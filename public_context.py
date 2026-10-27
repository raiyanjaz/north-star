"""Read-only Toronto public context. Never infers clinical needs or fleet capacity."""
import concurrent.futures
import copy
import json
import math
import os
import re
import threading
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo
from backend.common import stamp
from network import tls_context
from cities import city_config
from incident_intake import valid_pickup
from station_locations import TORONTO_STATIONS, station_records

POLICE = 'https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/C4S_Public_NoGO/FeatureServer/0'
FIRE = 'https://www.toronto.ca/data/fire/livecad.xml'
CAMERAS = 'https://opendata.toronto.ca/transportation/tmc/rescucameraimages/Data/tmcearthcameras.json'
ER_WATCH = 'https://www.er-watch.ca/'
CAMERA_IMAGES = 'https://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/'
SEATTLE_FIRE = 'https://data.seattle.gov/resource/kzjm-xkqj.json'
SEATTLE_META = 'https://data.seattle.gov/api/views/kzjm-xkqj.json'
SEATTLE_ROADS = 'https://data.wsdot.wa.gov/arcgis/rest/services/TravelInformation/TravelInfoRoadAlerts/FeatureServer/2'


def seattle_records(data):
    if not isinstance(data, list) or len(data) >= 1000:
        raise ValueError('Seattle snapshot invalid or truncated')
    rows = {}
    for r in data:
        iid = r['incident_number']
        if not re.fullmatch(r'[A-Za-z0-9-]{1,50}', iid):
            raise ValueError('Invalid Seattle incident ID')
        dt = datetime.fromisoformat(r['datetime'])
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=ZoneInfo('America/Los_Angeles'))
        lat, lon = r.get('latitude'), r.get('longitude')
        if not valid_pickup(lat, lon, 'seattle'):
            lat = lon = None
        # One incident can appear repeatedly; the descending query puts its latest row first.
        rows.setdefault(iid, {'id': iid, 'name': r['type'], 'location': r.get('address', ''),
                             'lat': float(lat) if lat is not None else None,
                             'lon': float(lon) if lon is not None else None,
                             'observed_at': dt.isoformat()})
    return list(rows.values())


def refresh_seattle_roads(path):
    try:
        query = urlencode({'where': '1=1', 'geometry': '-122.46,47.48,-122.23,47.75',
                           'geometryType': 'esriGeometryEnvelope', 'inSR': 4326, 'outSR': 4326,
                           'spatialRel': 'esriSpatialRelIntersects', 'outFields': '*',
                           'returnGeometry': 'true', 'f': 'json', 'resultRecordCount': 1000})
        data = json.loads(fetch_text(SEATTLE_ROADS + '/query?' + query))
        if 'features' not in data or data.get('exceededTransferLimit'):
            raise ValueError('Road snapshot invalid or truncated')
        rows = []
        for feature in data['features']:
            a = feature['attributes']; paths = feature.get('geometry', {}).get('paths', [])
            points = [p for line in paths for p in line]
            if not points:
                continue
            lon, lat = points[len(points)//2][:2]
            rows.append({'id': str(a['OBJECTID']), 'name': a.get('Road', 'Road alert'),
                         'lat': lat, 'lon': lon, 'description': a.get('HeadlineMessage'),
                         'updated_ms': a.get('LastModifiedDate'), 'direction': a.get('RoadDirection'),
                         'impact': 'Closed' if a.get('RoadClosedFlag') else 'Restriction', 'paths': paths})
        result = {'source': 'WSDOT Seattle-area road closures', 'url': SEATTLE_ROADS,
                  'fetched_at': stamp(), 'fetched_epoch': time.time(), 'mode': 'live', 'records': rows,
                  'note': 'State-road alerts intersecting Seattle coverage. Context only; city streets may be absent. TomTom supplies traffic-informed routing.'}
        Path(path).write_text(json.dumps(result)); return result
    except Exception:
        if Path(path).exists():
            return dict(json.loads(Path(path).read_text()), mode='cached', error='Live WSDOT refresh unavailable')
        return {'mode': 'unavailable', 'records': [], 'error': 'WSDOT unavailable; controlled closure checks remain active'}


def fetch_text(url):
    with urlopen(Request(url, headers={'User-Agent': 'ARC/1.0 public-context'}), timeout=15, context=tls_context()) as r:
        body = r.read(6_000_001)
        if len(body) > 6_000_000:
            raise ValueError('Publisher response too large')
        return body.decode('utf-8')


def local_time(value):
    if not value:
        return None
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo('America/Toronto'))
    return dt.isoformat()


def coordinates(lat, lon):
    lat, lon = float(lat), float(lon)
    if not math.isfinite(lat) or not math.isfinite(lon) or not (43.4 < lat < 44 and -80 < lon < -79):
        raise ValueError('Outside Toronto coverage')
    return lat, lon


def police_records(data):
    if 'error' in data or 'features' not in data:
        raise ValueError('Invalid police response')
    rows = []
    for f in data['features']:
        a = f['attributes']
        try:
            lat, lon = coordinates(a['LATITUDE'], a['LONGITUDE'])
            rows.append({'id': 'TPS-' + str(a['OBJECTID']), 'name': a['CALL_TYPE'],
                         'location': a.get('CROSS_STREETS', ''), 'lat': lat, 'lon': lon,
                         'observed_at': stamp(a['OCCURRENCE_TIME'] / 1000), 'division': a.get('DIVISION')})
        except (ValueError, TypeError, KeyError):
            continue
    return rows


def fire_records(text):
    root = ET.fromstring(text)
    return [{'id': e.findtext('event_num'), 'name': e.findtext('event_type'),
             'location': ' '.join(filter(None, [e.findtext('prime_street'), e.findtext('cross_streets')])).strip(' /,'),
             'observed_at': local_time(e.findtext('dispatch_time')), 'units': e.findtext('units_disp', ''),
             'alarm_level': e.findtext('alarm_lev')} for e in root.findall('event')], local_time(root.findtext('update_from_db_time'))


def camera_records(text):
    match = re.fullmatch(r'\s*jsonTMCEarthCamerasCallback\((.*)\);?\s*', text, re.S)
    if not match:
        raise ValueError('Invalid camera catalog')
    rows = []
    for a in json.loads(match[1])['Data']:
        if not re.fullmatch(r'\d{1,6}', str(a.get('Number', ''))):
            continue
        lat, lon = coordinates(a['Latitude'], a['Longitude'])
        if 43.62 < lat < 43.70 and -79.44 < lon < -79.34:
            rows.append({'id': str(a['Number']), 'name': a['Name'], 'lat': lat, 'lon': lon})
    return rows


def hospital_records(text):
    # Read the same public server-rendered data used by ER Watch, without executing scripts.
    for raw in re.findall(r'self\.__next_f\.push\((\[.*?\])\)</script>', text, re.S):
        chunk = json.loads(raw)
        if len(chunk) < 2 or not isinstance(chunk[1], str):
            continue
        match = re.search(r'"hospitals"\s*:\s*(\[)', chunk[1])
        if not match:
            continue
        hospitals, _ = json.JSONDecoder().raw_decode(chunk[1][match.start(1):])
        rows = []
        for h in hospitals:
            c = h.get('coordinates') or {}
            if h.get('city', '').lower() not in ('toronto', 'north york', 'scarborough', 'etobicoke', 'east york', 'york'):
                continue
            try:
                lat, lon = coordinates(c['lat'], c['lng'])
            except (KeyError, ValueError, TypeError):
                continue
            rows.append({'id': h['id'], 'name': h['name'], 'lat': lat, 'lon': lon,
                         'wait_min': h.get('estimated_wait_time') if h.get('hasLiveData') and h.get('status') == 'online' else None,
                         'patients_waiting': h.get('patients_waiting'), 'observed_at': h.get('last_updated'),
                         'status': h.get('status', 'unknown'), 'url': ER_WATCH})
        return rows
    raise ValueError('Hospital publisher layout changed')


def setting(name):
    settings = {}
    path = Path(__file__).with_name('.env')
    if path.exists():
        for line in path.read_text().splitlines():
            if '=' in line and not line.lstrip().startswith('#'):
                k, v = line.split('=', 1)
                settings[k.strip()] = v.strip().strip('\"\'')
    return os.environ.get(name, settings.get(name, ''))


class PublicContext:
    def __init__(self, roads_fetch, directory, start=True, on_update=None, city='toronto'):
        self.city = city
        city_config(city)
        self.on_update = on_update
        self.lock = threading.RLock()
        self.sources = {}
        self.roads_fetch = roads_fetch
        self.directory = Path(directory)
        self.stop = threading.Event()
        if start:
            threading.Thread(target=self.run, daemon=True).start()

    def snapshot(self):
        with self.lock:
            result = copy.deepcopy(self.sources)
        for source in result.values():
            source['age_s'] = round(max(0, time.time() - source.get('fetched_epoch', 0)))
            source['stale'] = source['age_s'] > source.get('ttl_s', 600) or source['mode'] != 'live'
            if source.get('observed_at'):
                try:
                    publisher_age = time.time() - datetime.fromisoformat(source['observed_at']).timestamp()
                    source['stale'] |= publisher_age > source.get('ttl_s', 600) + 120 or publisher_age < -60
                except (ValueError, TypeError):
                    source['stale'] = True
        return result

    def refresh_one(self, kind):
        sources = {'police': (POLICE, 300), 'fire': (FIRE, 300), 'cameras': (CAMERAS, 86400),
                   'hospitals': (ER_WATCH, 900), 'roads': ('https://secure.toronto.ca/opendata/cart/road_restrictions/v3?format=csv', 300),
                   'traffic': ('https://developer.tomtom.com/traffic-api', 120),
                   'stations': (TORONTO_STATIONS, 86400)}
        if self.city == 'seattle':
            sources.update(fire=(SEATTLE_FIRE, 600), roads=(SEATTLE_ROADS, 300))
            if kind not in ('fire', 'roads', 'traffic'):
                with self.lock:
                    self.sources[kind] = {'mode': 'unavailable', 'records': [], 'ttl_s': 600,
                        'error': {'police': 'Seattle uses the Fire/EMS incident feed; no live police adapter is connected.',
                                  'hospitals': 'No live Seattle hospital wait or receiving-status feed is connected.',
                                  'cameras': 'No Seattle camera adapter is connected.'}[kind]}
                return
        url, ttl = sources[kind]
        with self.lock:
            old = self.sources.get(kind, {})
        if time.time() - old.get('attempt_epoch', 0) < (3600 if kind in ('cameras', 'stations') else 60):
            return
        try:
            observed = None
            if kind == 'police':
                data = json.loads(fetch_text(POLICE + '/query?' + urlencode({'where': '1=1', 'outFields': '*', 'returnGeometry': 'false', 'f': 'json', 'resultRecordCount': 500, '_arc_refresh': int(time.time()//60)})))
                if data.get('exceededTransferLimit'):
                    raise ValueError('Police feed truncated')
                rows = police_records(data)
                meta = json.loads(fetch_text(POLICE + '?f=json&_arc_refresh=' + str(int(time.time()//60))))
                observed = stamp(meta['editingInfo']['dataLastEditDate'] / 1000)
            elif kind == 'fire':
                if self.city == 'seattle':
                    cutoff = (datetime.now(ZoneInfo('America/Los_Angeles')) - timedelta(hours=4)).replace(tzinfo=None).isoformat(timespec='seconds')
                    query = urlencode({'$where': "datetime >= '" + cutoff + "'", '$order': 'datetime DESC', '$limit': 1000})
                    rows = seattle_records(json.loads(fetch_text(SEATTLE_FIRE + '?' + query)))
                    metadata = json.loads(fetch_text(SEATTLE_META))
                    observed = stamp(metadata['rowsUpdatedAt'])
                else:
                    rows, observed = fire_records(fetch_text(FIRE))
                if not observed:
                    raise ValueError('Missing fire publisher timestamp')
            elif kind == 'stations':
                query = urlencode({'where': '1=1', 'outFields': 'ADDRESS_POINT_ID,OBJECTID,NAME,ADDRESS,ADDRESS_FULL,PLACE_NAME,LATITUDE,LONGITUDE',
                                   'returnGeometry': 'false', 'resultRecordCount': 2000, 'f': 'json'})
                rows = station_records(json.loads(fetch_text(TORONTO_STATIONS + '/query?' + query)))
            elif kind == 'cameras':
                rows = camera_records(fetch_text(CAMERAS))
            elif kind == 'hospitals':
                rows = hospital_records(fetch_text(ER_WATCH))
            elif kind == 'roads':
                road = self.roads_fetch(self.directory / 'public-roads.json')
                if road['mode'] != 'live':
                    raise ValueError('Road publisher unavailable')
                rows = road['records']
            else:
                key = setting('TOMTOM_API_KEY')
                if not key:
                    raise ValueError('Traffic provider key required')
                rows = []
                samples = [('Pike & 4th', 47.6102, -122.3360), ('Broadway & E Pine', 47.6150, -122.3208), ('University District', 47.6613, -122.3131)] if self.city == 'seattle' else [('University & Queen', 43.6508, -79.3865), ('College & Spadina', 43.658, -79.4003), ('King & Church', 43.6499, -79.3753)]
                for name, lat, lon in samples:
                    flow = json.loads(fetch_text('https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/15/json?' + urlencode({'key': key, 'point': f'{lat},{lon}', 'unit': 'KMPH'})))['flowSegmentData']
                    if any(not math.isfinite(float(flow[k])) or float(flow[k]) < 0 for k in ['currentSpeed','freeFlowSpeed','confidence']) or float(flow['confidence']) > 1:
                        raise ValueError('Invalid traffic reading')
                    rows.append({'name': name, 'lat': lat, 'lon': lon, 'speed_kph': flow['currentSpeed'], 'free_flow_kph': flow['freeFlowSpeed'], 'confidence': flow['confidence'], 'closed': flow['roadClosure'], 'coordinates': flow['coordinates']['coordinate']})
            now = time.time()
            new = {'mode': 'live', 'source_url': url, 'records': rows, 'fetched_at': stamp(now),
                   'fetched_epoch': now, 'attempt_epoch': now, 'ttl_s': ttl, 'observed_at': observed}
        except Exception:
            new = dict(old, mode='cached' if old.get('records') else 'unavailable', attempt_epoch=time.time(),
                       source_url=url, ttl_s=ttl, records=old.get('records', []),
                       error='Traffic provider key required' if kind == 'traffic' and not setting('TOMTOM_API_KEY') else 'Publisher unavailable; retrying automatically')
        with self.lock:
            self.sources[kind] = new
        if self.on_update and kind in ('fire','police','stations'):
            self.on_update(self.snapshot())

    def run(self):
        while not self.stop.is_set():
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
                kinds = ['police', 'fire', 'roads', 'hospitals', 'cameras', 'traffic']
                if self.city == 'toronto':
                    kinds.append('stations')
                list(pool.map(self.refresh_one, kinds))
            self.stop.wait(60)
