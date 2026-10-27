"""Real sponsor acceptance check. --reset permits resetting only Seattle exercise state."""
import argparse
import json
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

BASE = 'http://127.0.0.1:4317'


def call(path, body=None, city='seattle'):
    req = Request(BASE + path + '?city=' + city,
                  data=json.dumps(body).encode() if body is not None else None,
                  headers={'Content-Type': 'application/json'})
    with urlopen(req, timeout=30) as response:
        return json.load(response)


def wait_job(job):
    deadline = time.monotonic() + 180
    while job['status'] == 'running':
        if time.monotonic() > deadline:
            raise RuntimeError('Assessment exceeded acceptance-test deadline')
        time.sleep(1)
        job = call('/api/jobs/' + job['id'])
    if job['status'] != 'done':
        raise RuntimeError(job.get('error', 'Assessment failed'))
    result = job['result']
    assert result['approvable'] and result['selected']
    assert 'ARC_SEATTLE.' in result['zetaris']['query']
    assert all(result['selected'][key]['source'] == 'TomTom Routing' for key in ('pickup_route', 'transport_route'))
    assert result['ai']['explanation'].get('winning_route')
    print('Verified:', result['incident_id'], result['selected']['name'], flush=True)
    return result


def assess(incident_id):
    deadline = time.monotonic() + 120
    while True:
        try:
            return wait_job(call('/api/analyze', {'incident_id': incident_id}))
        except HTTPError as error:
            message = json.load(error).get('error', '')
            if error.code != 409 or 'already running' not in message or time.monotonic() > deadline:
                raise RuntimeError(message) from None
            time.sleep(2)


def core(state):
    return {key: state[key] for key in ('epoch', 'fleet', 'hospitals', 'assignments')}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reset', action='store_true', required=True)
    parser.parse_args()
    toronto_before = core(call('/api/state', city='toronto'))
    call('/api/agent/control', {'enabled': False})
    while call('/api/state')['assessments']:
        time.sleep(1)
    call('/api/reset', {})
    call('/api/agent/control', {'enabled': False})
    checks = []
    try:
        baseline = assess('SEA-DEMO-101')
        checks.append('Seattle Zetaris federation, TomTom directed routes and Nightshift model receipt')
        call('/api/scenario', {'name': 'hospital-unavailable', 'incident_id': 'SEA-DEMO-101'})
        try:
            call('/api/decision', {'id': baseline['id'], 'action': 'approve'})
            raise AssertionError('Obsolete plan was approved')
        except HTTPError as error:
            assert error.code == 409
        revised = assess('SEA-DEMO-101')
        assert revised['selected']['hospital_id'] != baseline['selected']['hospital_id']
        assert revised['changes']
        checks.append('Hospital disruption invalidates approval and revises destination with change evidence')
        state_before = call('/api/state')
        call('/api/decision', {'id': revised['id'], 'action': 'approve'})
        state_after = call('/api/state'); selected = revised['selected']
        assert next(a for a in state_after['fleet'] if a['id'] == selected['ambulance_id'])['status'] == 'assigned'
        assert next(h for h in state_after['hospitals'] if h['id'] == selected['hospital_id'])['slots'] == next(h for h in state_before['hospitals'] if h['id'] == selected['hospital_id'])['slots'] - 1
        checks.append('Approval atomically reserves Seattle unit, incident and hospital slot')
        public = next(i for i in state_after['incidents'] if i.get('public_source') == 'Seattle Fire Department' and i.get('public_feed_status') == 'present' and i.get('lat') is not None)
        call('/api/incidents/details', {'incident_id': public['id'], 'revision': public['incident_revision'],
             'priority': 'Priority 2', 'service': 'general', 'equipment': 'advanced',
             'lat': public['lat'], 'lon': public['lon'], 'pickup_label': public['name'],
             'notes': 'Acceptance-test exercise requirements; not supplied by Seattle public feed.'})
        public_result = assess(public['id'])
        call('/api/decision', {'id': public_result['id'], 'action': 'reject'})
        checks.append('Actual Seattle public call → explicit intake → complete assessment → rejection')
        world = call('/api/world')
        assert world['entities'] and world['events']
        checks.append('Seattle Meterless entities and persistent events exist')
        assert core(call('/api/state', city='toronto')) == toronto_before
        checks.append('Toronto reservations and resources unchanged')
    finally:
        # This script is explicitly restricted to the new Seattle exercise workspace.
        call('/api/reset', {})
        call('/api/agent/control', {'enabled': True})
    deadline = time.monotonic() + 180
    automatic = None
    while time.monotonic() < deadline:
        automatic = call('/api/recommendations/SEA-DEMO-101')
        if automatic and automatic.get('automatic') and automatic.get('approvable'):
            break
        time.sleep(2)
    assert automatic and automatic.get('automatic') and automatic.get('approvable')
    assert not call('/api/state')['assignments']
    checks.append('Automatic assessment produces proposal after reset; no automatic approval')
    output = {'at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'passed': checks,
              'baseline': {key: baseline['selected'][key] for key in ('id', 'pickup_min', 'transport_min')},
              'revised': {key: revised['selected'][key] for key in ('id', 'pickup_min', 'transport_min')},
              'actual_model_receipt': baseline['ai']['explanation'].get('winning_route'),
              'automatic_proposal': automatic['id']}
    Path('artifacts/seattle-live-validation.json').write_text(json.dumps(output, indent=2))
    print(json.dumps(output, indent=2), flush=True)


if __name__ == '__main__':
    main()
