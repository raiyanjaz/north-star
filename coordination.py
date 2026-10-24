"""Priority ordering and advisory commitments, separate from actual reservations."""
import json
import time
from incident_intake import incident_issues


def priority_key(incident):
    try:
        priority = int(str(incident.get('priority', '')).split()[-1])
    except (ValueError, IndexError):
        priority = 99
    return priority, incident.get('received_at', ''), incident['id']


def current_proposal(rec, incident, state, now=None):
    now = time.time() if now is None else now
    return bool(rec and incident['status'] == 'open' and not incident_issues(incident)
                and rec.get('simulation_epoch') == state['epoch']
                and rec.get('version') == state['version']
                and rec.get('incident_revision', 0) == incident.get('incident_revision', 0)
                and rec.get('decision') == 'pending' and rec.get('approvable') and rec.get('selected')
                and 0 <= now - rec.get('evidence_epoch', 0) < 120)


def commitments(incident, state, recommendations, now=None):
    units, slots, claims = {}, {}, []
    for other in sorted(state['incidents'], key=priority_key):
        if priority_key(other) >= priority_key(incident):
            continue
        rec = recommendations.get(other['id'])
        if not current_proposal(rec, other, state, now):
            continue
        pair = rec['selected']
        units[pair['ambulance_id']] = other['id']
        hid = pair['hospital_id']; slots[hid] = slots.get(hid, 0) + 1
        claims.append([other['id'], pair['ambulance_id'], hid])
    return {'units': units, 'slots': slots, 'signature': json.dumps(claims, separators=(',', ':'))}


def resource_blocker(incident, state, coordination):
    suitable = [a for a in state['fleet'] if a['status'] == 'available'
                and incident['equipment'] in a['equipment'].split(',')]
    if not suitable:
        return 'Waiting for a compatible unit to become available.'
    if not any(a['id'] not in coordination['units'] for a in suitable):
        return 'Available units are proposed for higher-priority incidents. Waiting for a decision or resource change.'
    if not any(h['accepting'] and int(h['slots']) - coordination['slots'].get(h['id'], 0) > 0
               and incident['service'] in h['capabilities'].split(',') for h in state['hospitals']):
        return 'Waiting for a compatible receiving slot. ARC will resume when availability changes.'
    return None


def proposal_conflict(rec, coordination, state):
    pair = (rec or {}).get('selected')
    if not pair:
        return False
    hospital = next((h for h in state['hospitals'] if h['id'] == pair['hospital_id']), None)
    return pair['ambulance_id'] in coordination['units'] or not hospital or int(hospital['slots']) - coordination['slots'].get(pair['hospital_id'], 0) < 1
