"""Persisted exercise journeys. Timed progress is not vehicle telemetry or crew acknowledgement."""
import bisect
import hashlib
import math
from datetime import datetime, timezone

PHASES = ('assigned', 'responding', 'on_scene', 'transporting', 'handover', 'completed')
SPEEDS = (1, 10, 30)


def iso(epoch):
    return datetime.fromtimestamp(epoch, timezone.utc).isoformat()


def distance(a, b):
    x1, y1, x2, y2 = map(math.radians, (*a, *b))
    return 6371000 * 2 * math.asin(min(1, math.sqrt(
        math.sin((y2-y1)/2)**2 + math.cos(y1)*math.cos(y2)*math.sin((x2-x1)/2)**2)))


def route_plan(route):
    if not route:
        return None
    try:
        duration = float(route['duration_s'])
        coords = [[float(p[0]), float(p[1])] for p in route['coordinates']]
        if len(coords) < 2 or not math.isfinite(duration) or duration < 0 or any(
            not all(math.isfinite(v) for v in p) or not (-180 <= p[0] <= 180 and -90 <= p[1] <= 90) for p in coords):
            return None
        cumulative = [0.0]
        for a, b in zip(coords, coords[1:]):
            cumulative.append(cumulative[-1] + distance(a, b))
        return {'coordinates': coords, 'cumulative_m': cumulative, 'duration_s': duration}
    except (KeyError, TypeError, ValueError, OverflowError):
        return None


def route_position(route, fraction):
    coords, cumulative = route['coordinates'], route['cumulative_m']
    fraction = max(0, min(1, fraction))
    if fraction >= 1:
        return coords[-1][:]
    if cumulative[-1] == 0:
        return coords[0][:]
    target = cumulative[-1] * fraction
    index = min(len(coords)-2, max(0, bisect.bisect_right(cumulative, target)-1))
    length = cumulative[index+1] - cumulative[index]
    ratio = (target-cumulative[index])/length if length else 0
    return [coords[index][n] + (coords[index+1][n]-coords[index][n])*ratio for n in (0, 1)]


def migrate_assignments(state, now):
    changed = False
    for assignment in state['assignments']:
        if assignment.get('id'):
            continue
        identity = '|'.join(str(assignment.get(k, '')) for k in ('incident_id', 'ambulance_id', 'at'))
        unit = next((u for u in state['fleet'] if u['id'] == assignment['ambulance_id']), None)
        incident = next((i for i in state['incidents'] if i['id'] == assignment['incident_id']), None)
        hospital = next((h for h in state['hospitals'] if h['id'] == assignment['hospital_id']), None)
        assignment.update(id='legacy-'+hashlib.sha256(identity.encode()).hexdigest()[:16],
                          phase='assigned', revision=0, automatic=False, slot_released=False,
                          phase_started_epoch=now, phase_ends_epoch=None,
                          pickup=[incident['lon'], incident['lat']] if incident else None,
                          destination=[hospital['lon'], hospital['lat']] if hospital else None,
                          history=[{'phase': 'assigned', 'at': assignment['at']}])
        if unit and unit['status'] == 'assigned' and not unit.get('active_assignment_id'):
            unit['active_assignment_id'] = assignment['id']
        changed = True
    return changed


def make_assignment(rec, state, now):
    p = rec['selected']; unit = next(u for u in state['fleet'] if u['id'] == p['ambulance_id'])
    incident = next(i for i in state['incidents'] if i['id'] == rec['incident_id'])
    hospital = next(h for h in state['hospitals'] if h['id'] == p['hospital_id'])
    pickup_route, transport_route = route_plan(p.get('pickup_route')), route_plan(p.get('transport_route'))
    automatic = bool(pickup_route and transport_route)
    speed = state.get('journey_speed', 10)
    assignment = {'id': rec['id'], 'incident_id': incident['id'], 'ambulance_id': unit['id'],
        'hospital_id': hospital['id'], 'at': iso(now), 'phase': 'assigned', 'revision': 0,
        'automatic': automatic, 'speed': speed, 'slot_released': False,
        'pickup': pickup_route['coordinates'][-1] if pickup_route else [incident['lon'], incident['lat']],
        'destination': transport_route['coordinates'][-1] if transport_route else [hospital['lon'], hospital['lat']],
        'pickup_route': pickup_route, 'transport_route': transport_route,
        'durations': {'assigned': 15, 'responding': pickup_route['duration_s'] if pickup_route else 0,
                      'on_scene': 180, 'transporting': transport_route['duration_s'] if transport_route else 0,
                      'handover': 300},
        'phase_started_epoch': now, 'phase_ends_epoch': now+15/speed if automatic else None,
        'history': [{'phase': 'assigned', 'at': iso(now)}]}
    unit['active_assignment_id'] = assignment['id']
    return assignment


def resources(state, assignment):
    unit = next((u for u in state['fleet'] if u['id'] == assignment['ambulance_id']), None)
    hospital = next((h for h in state['hospitals'] if h['id'] == assignment['hospital_id']), None)
    incident = next((i for i in state['incidents'] if i['id'] == assignment['incident_id']), None)
    if not unit or not hospital or not incident or unit.get('active_assignment_id') != assignment['id'] or unit['status'] != 'assigned' or incident['status'] != 'assigned':
        raise ValueError('Assignment resources changed. Review before advancing progress.')
    return unit, hospital, incident


def set_position(unit, point):
    if point:
        unit.update(lon=point[0], lat=point[1], location_source='simulated_journey')


def release(state, assignment, now, cancelled=False):
    unit, hospital, incident = resources(state, assignment)
    if assignment.get('slot_released'):
        raise ValueError('This assignment has already released its receiving slot')
    if not cancelled:
        set_position(unit, assignment['destination'])
    unit.update(status='available', last_assignment_id=assignment['id'])
    unit.pop('active_assignment_id', None)
    hospital['slots'] += 1; assignment['slot_released'] = True
    incident['status'] = 'cancelled' if cancelled else 'completed'
    assignment.update(phase='cancelled' if cancelled else 'completed', completed_at=iso(now),
                      phase_started_epoch=now, phase_ends_epoch=None)
    assignment.pop('hold_reason', None); assignment.pop('hold_since_epoch', None)
    state['version'] += 1


def next_phase(state, assignment, now):
    unit, _, _ = resources(state, assignment)
    phase = PHASES[PHASES.index(assignment['phase'])+1]
    if phase == 'completed':
        release(state, assignment, now)
    else:
        if phase in ('on_scene', 'transporting'):
            set_position(unit, assignment['pickup'])
        elif phase == 'handover':
            set_position(unit, assignment['destination'])
        assignment.update(phase=phase, phase_started_epoch=now,
                          phase_ends_epoch=now+assignment['durations'][phase]/assignment['speed'] if assignment['automatic'] else None)
    assignment['revision'] += 1
    assignment['history'].append({'phase': phase, 'at': iso(now)})


def advance_assignments(state, now, blocked):
    """Advance by persisted wall-clock deadlines, including safe restart catch-up."""
    changed = False; events = []
    for assignment in state['assignments']:
        if assignment['phase'] in ('completed', 'cancelled'):
            continue
        try:
            unit, hospital, _ = resources(state, assignment)
        except ValueError as error:
            if assignment.get('hold_reason') != str(error):
                assignment.update(hold_reason=str(error), hold_since_epoch=now)
                assignment['revision'] += 1; changed = True
            continue
        reason = None
        if assignment['phase'] != 'handover':
            if not hospital['accepting']:
                reason = hospital['name']+' is unavailable. Review the destination before continuing.'
            elif state['closures']:
                # Conservative: an approved route crossing a scenario closure needs review.
                routes = [assignment.get('transport_route')]
                if assignment['phase'] in ('assigned', 'responding'):
                    routes.append(assignment.get('pickup_route'))
                if any(route and blocked(route, state['closures']) for route in routes):
                    reason = 'A closure affects the approved route. Review before continuing.'
        if reason:
            if not assignment.get('hold_reason'):
                assignment.update(hold_reason=reason, hold_since_epoch=now)
                assignment['revision'] += 1; changed = True
                events.append({'assignment_id': assignment['id'], 'incident_id': assignment['incident_id'], 'phase': 'held', 'at': iso(now)})
            continue
        if assignment.get('hold_reason'):
            delay = now-assignment.pop('hold_since_epoch', now)
            assignment.pop('hold_reason', None)
            assignment['phase_started_epoch'] += delay
            if assignment['phase_ends_epoch'] is not None:
                assignment['phase_ends_epoch'] += delay
            assignment['revision'] += 1; changed = True
        if not assignment['automatic']:
            continue
        while assignment['phase'] != 'completed' and now >= assignment['phase_ends_epoch']:
            boundary = assignment['phase_ends_epoch']
            next_phase(state, assignment, boundary); changed = True
            events.append({'assignment_id': assignment['id'], 'incident_id': assignment['incident_id'],
                           'phase': assignment['phase'], 'at': iso(boundary)})
        route = assignment.get('pickup_route') if assignment['phase'] == 'responding' else assignment.get('transport_route') if assignment['phase'] == 'transporting' else None
        if route:
            span = assignment['phase_ends_epoch']-assignment['phase_started_epoch']
            fraction = (now-assignment['phase_started_epoch'])/span if span else 1
            point = route_position(route, fraction)
            if point != [unit['lon'], unit['lat']]:
                set_position(unit, point); changed = True
    return changed, events
