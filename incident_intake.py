"""Public incident identity and readiness; no inferred clinical requirements."""
import hashlib
import math
from datetime import datetime, timezone


def public_key(kind, row):
    if kind == 'fire':
        if not row.get('id'):
            raise ValueError('Missing fire incident ID')
        return 'TFS-' + row['id']
    # Police OBJECTIDs are rebuilt. Use occurrence + published intersection;
    # omit category so reclassification updates the same local case.
    when = datetime.fromisoformat(row['observed_at']).astimezone(timezone.utc).isoformat()
    location = ' '.join(row['location'].upper().split())
    return 'TPS-' + hashlib.sha256((when + '|' + location).encode()).hexdigest()[:16]


def relevant_call(kind, row):
    if kind == 'fire':
        return bool(row.get('id'))
    category = row.get('name', '').upper()
    return any(word in category for word in ['COLLISION', 'INDUSTRIAL ACCIDENT', 'PERSONAL INJURY', 'INJURED', 'FIRE'])


def valid_pickup(lat, lon):
    if isinstance(lat, bool) or isinstance(lon, bool) or lat in (None, '') or lon in (None, ''):
        return False
    try:
        return math.isfinite(float(lat)) and math.isfinite(float(lon)) and 43.4 < float(lat) < 44 and -80 < float(lon) < -79
    except (TypeError, ValueError):
        return False


def incident_issues(incident):
    if not incident.get('public_source'):
        return []
    missing = []
    if incident.get('priority') not in ['Priority 1', 'Priority 2', 'Priority 3']:
        missing.append('Choose a priority')
    if incident.get('service') not in ['general', 'cardiac', 'trauma', 'neuro', 'pediatric']:
        missing.append('Choose a required service')
    if incident.get('equipment') not in ['general', 'advanced']:
        missing.append('Choose required equipment')
    if not valid_pickup(incident.get('lat'), incident.get('lon')):
        missing.append('Confirm a pickup location')
    if incident.get('source_review_required'):
        missing.append('Review the changed public call details')
    status = incident.get('public_feed_status', 'stale')
    if status != 'present':
        missing.append('Public feed is stale or unavailable' if status == 'stale' else 'Call is no longer in the public feed; review required')
    return missing
