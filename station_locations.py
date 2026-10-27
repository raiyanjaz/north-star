"""Official Toronto station geography for explicitly simulated unit staging."""
import math
import re
from incident_intake import valid_pickup

TORONTO_STATIONS = 'https://gis.toronto.ca/arcgis/rest/services/cot_geospatial25/FeatureServer/1'


def station_records(data):
    if not isinstance(data, dict) or 'features' not in data or data.get('exceededTransferLimit'):
        raise ValueError('Station catalogue unavailable or truncated')
    stations = {}
    for feature in data['features']:
        a = feature.get('attributes', {})
        name = str(a.get('NAME') or a.get('PLACE_NAME') or '').strip()
        address = str(a.get('ADDRESS') or a.get('ADDRESS_FULL') or '').strip()
        lat, lon = a.get('LATITUDE'), a.get('LONGITUDE')
        identifier = a.get('ADDRESS_POINT_ID') or a.get('OBJECTID')
        if not identifier or not name or not address or not valid_pickup(lat, lon):
            continue
        iid = 'TOR-STATION-' + str(identifier)
        stations[iid] = {'id': iid, 'name': name, 'address': address,
                         'staging_eligible': bool(re.fullmatch(r'Station\s+\d+', name, re.I)),
                         'lat': float(lat), 'lon': float(lon)}
    if not stations:
        raise ValueError('Station catalogue contained no usable locations')
    return sorted(stations.values(), key=lambda station: station['id'])


def stage_available_units(state, source):
    """Assign unanchored available scenario units once; never relocate active units."""
    if source.get('mode') != 'live' or source.get('stale', True):
        return []
    stations = [station for station in source.get('records', []) if station.get('staging_eligible')]
    if not stations:
        return []
    eligible_ids = {station['id'] for station in stations}
    occupied = {unit['station_reference']['id'] for unit in state['fleet'] if unit.get('station_reference')}
    changed = []
    for unit in state['fleet']:
        if unit['status'] != 'available' or unit.get('last_assignment_id') or unit.get('location_source')=='simulated_journey' or unit.get('station_reference', {}).get('id') in eligible_ids:
            continue
        choices = [station for station in stations if station['id'] not in occupied] or stations
        # Proximity to the prior scenario position chooses a plausible base; it is
        # not a claim that this fictional unit belongs to the published station.
        station = min(choices, key=lambda station: (
            (station['lat'] - unit['lat']) ** 2 +
            ((station['lon'] - unit['lon']) * math.cos(math.radians(unit['lat']))) ** 2,
            station['id']))
        unit.update(lat=station['lat'], lon=station['lon'], location_source='official_station_scenario_staging',
                    station_reference=dict(station, source_url=source.get('source_url', TORONTO_STATIONS),
                                           fetched_at=source.get('fetched_at')))
        occupied.add(station['id']); changed.append(unit['id'])
    return changed
