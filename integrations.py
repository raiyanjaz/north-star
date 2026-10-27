"""Sponsor and public-source adapters. Exceptions are explicit; no hidden live fallback."""
import concurrent.futures, csv, io, json, math, os, shutil, subprocess, threading, time
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import urlencode
from zetaris_client import ZetarisClient, ZetarisError
from meterless_client import MeterlessClient, MeterlessError
from simulation import ROOT, stamp
from network import tls_context
from public_context import setting

class World:
 def __init__(self,directory):
  node=os.environ.get('NODE_BIN') or shutil.which('node')
  bundled=Path('/Users/raiyanjaz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node')
  if not node and bundled.exists():node=str(bundled)
  if not node:raise RuntimeError('Node.js 24+ required for Meterless World Model')
  self.proc=subprocess.Popen([node,'--experimental-transform-types',str(ROOT/'scripts/world-model.mjs')],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,env=dict(os.environ,ARC_DATA_DIR=str(directory)))
  self.lock=threading.Lock()
 def call(self,action,**kwargs):
  with self.lock:
   self.proc.stdin.write(json.dumps(dict(action=action,**kwargs))+'\n');self.proc.stdin.flush()
   response=self.proc.stdout.readline()
   if not response:raise RuntimeError('Meterless World Model process unavailable')
   r=json.loads(response)
   if not r.get('ok'):raise RuntimeError('Meterless World Model operation failed')
   return r['result']
 def close(self):
  self.proc.terminate()
  try:self.proc.wait(timeout=3)
  except subprocess.TimeoutExpired:self.proc.kill();self.proc.wait()
  self.proc.stdin.close();self.proc.stdout.close()

FEDERATED_SQL=' UNION ALL '.join("SELECT '%s' AS kind, to_json(r) AS payload FROM ARC_DISPATCH.%s LATERAL VIEW explode(records) AS r"%(kind,kind) for kind in ['fleet','hospitals','roads'])

class Federation:
 def __init__(self,city='toronto'):
  from cities import city_config
  city_config(city)
  self.client=ZetarisClient();self.sql=FEDERATED_SQL if city=='toronto' else FEDERATED_SQL.replace('ARC_DISPATCH.','ARC_SEATTLE.')
 def snapshot(self):
  start=time.monotonic();r=self.client.query(self.sql,200)
  groups={'fleet':[],'hospitals':[],'roads':[]}
  for row in r['data']:
   kind,payload=row[0],row[1]; groups[kind].append(json.loads(payload))
  if not all(groups.values()):raise ZetarisError('Federated snapshot missing required sources')
  versions={int(x['version']) for rows in groups.values() for x in rows}
  if len(versions)!=1:raise ZetarisError('Feeds changed during federation. Reassess.')
  return groups,{'status':'online','query':self.sql,'rows':len(r['data']),'duration_ms':round((time.monotonic()-start)*1000),'at':stamp(),'version':versions.pop()}

class Routes:
 def __init__(self,path):self.path=Path(path);self.lock=threading.RLock();self.cache=json.loads(self.path.read_text()) if self.path.exists() else (json.loads((ROOT/'fixtures/routes.json').read_text()) if (ROOT/'fixtures/routes.json').exists() else {})
 def traffic_route(self,a,b,api_key):
  route_key=(a['lat'],a['lon'],b['lat'],b['lon'])
  with self.lock:cached=getattr(self,'traffic_cache',{}).get(route_key)
  if cached and time.time()-cached['fetched_epoch']<30:return dict(cached,mode='cached')
  url='https://api.tomtom.com/routing/1/calculateRoute/%s,%s:%s,%s/json?'%(a['lat'],a['lon'],b['lat'],b['lon'])+urlencode({'key':api_key,'traffic':'true','departAt':'now','travelMode':'car','routeType':'fastest','computeTravelTimeFor':'all'})
  try:
   with urlopen(Request(url,headers={'User-Agent':'ARC/1.0'}),timeout=15,context=tls_context()) as response:data=json.load(response)
   route=data['routes'][0];summary=route['summary'];coords=[[p['longitude'],p['latitude']] for leg in route['legs'] for p in leg['points']]
   duration=float(summary['travelTimeInSeconds']);distance=float(summary['lengthInMeters'])
   if len(coords)<2 or not math.isfinite(duration) or not math.isfinite(distance) or duration<0 or distance<0:raise ValueError()
   now=time.time();result={'coordinates':coords,'duration_s':duration,'distance_m':distance,'source':'TomTom Routing','mode':'live','fetched_at':stamp(now),'fetched_epoch':now,'traffic_aware':True,'traffic_delay_s':summary.get('trafficDelayInSeconds'),'traffic':'Traffic at assessment time; ordinary driving, no emergency privileges or scene time'}
   with self.lock:
    if not hasattr(self,'traffic_cache'):self.traffic_cache={}
    self.traffic_cache[route_key]=result
   return result
  except Exception:raise RuntimeError('TomTom traffic routing unavailable. Check the provider key and service; no static substitute was used.') from None
 def get(self,a,b):
  api_key=setting('TOMTOM_API_KEY')
  if api_key:return self.traffic_route(a,b,api_key)
  key=','.join(str(x) for x in [a['lon'],a['lat'],b['lon'],b['lat']])
  with self.lock:cached=self.cache.get(key)
  if cached and time.time()-cached['fetched_epoch']<7*86400:return dict(cached,mode='cached')
  url='https://router.project-osrm.org/route/v1/driving/%s,%s;%s,%s?overview=full&geometries=geojson'%(a['lon'],a['lat'],b['lon'],b['lat'])
  try:
   with urlopen(Request(url,headers={'User-Agent':'ARC-Hackathon/1.0'}),timeout=12) as response:r=json.load(response)
   route=r['routes'][0]
   result={'coordinates':route['geometry']['coordinates'],'duration_s':route['duration'],'distance_m':route['distance'],'source':'OSRM / OpenStreetMap','mode':'live','fetched_at':stamp(),'fetched_epoch':time.time(),'traffic':'Static driving estimate; no live traffic or emergency privileges'}
   with self.lock:self.cache[key]=result;self.path.write_text(json.dumps(self.cache))
   return result
  except Exception:raise RuntimeError('Routing unavailable and no fresh cached route exists') from None

def haversine(a,b):
 lat1,lon1=a;lat2,lon2=b;p=math.pi/180
 return 6371000*2*math.asin(min(1,math.sqrt(math.sin((lat2-lat1)*p/2)**2+math.cos(lat1*p)*math.cos(lat2*p)*math.sin((lon2-lon1)*p/2)**2)))

def blocked(route,closures):
 # Each scenario closure is a circle, not a claimed real road polygon. Sample
 # every segment at <=20m spacing so a crossing cannot slip between vertices.
 for c in closures:
  if not int(c.get('active',0)):continue
  coords=route['coordinates']
  for p,q in zip(coords,coords[1:]):
   n=max(1,math.ceil(haversine((p[1],p[0]),(q[1],q[0]))/20))
   for i in range(n+1):
    x=p[0]+(q[0]-p[0])*i/n;y=p[1]+(q[1]-p[1])*i/n
    if haversine((y,x),(float(c['lat']),float(c['lon'])))<=float(c['radius_m']):return c['name']
 return None

ROAD_URL='https://secure.toronto.ca/opendata/cart/road_restrictions/v3?format=csv'

def road_records(data, now=None):
 now=time.time() if now is None else now
 rows=[]
 for r in data['Closure']:
  # Upcoming and expired records are not current restrictions. Work-hour
  # schedules remain descriptive; they are not inferred as impassable routes.
  start=float(r.get('startTime') or 0)/1000;end=float(r.get('endTime') or 0)/1000
  if str(r.get('expired',0)).lower() not in ('0','false','none','') or start>now or (end and end<now):continue
  try:
   lat=float(r['latitude']);lon=float(r['longitude'])
   if not math.isfinite(lat) or not math.isfinite(lon):continue
   geometry=json.loads('['+r['geoPolyline']+']') if r.get('geoPolyline') else []
  except (ValueError,KeyError,TypeError):continue
  rows.append({'id':r['id'],'name':r.get('road') or r.get('name'),'description':r.get('description'),
   'updated_ms':r.get('lastUpdated'),'lat':lat,'lon':lon,'type':r.get('type'),
   'impact':r.get('currImpact'),'direction':r.get('directionsAffected'),'coordinates':geometry,
   'start_epoch':start,'end_epoch':end,'work_period':r.get('workPeriod')})
 return rows

def refresh_public_roads(path):
 try:
  with urlopen(Request(ROAD_URL,headers={'User-Agent':'ARC/1.0'}),timeout=15,context=tls_context()) as response:text=response.read(10000000).decode('utf-8-sig')
  stream=io.StringIO(text)
  if stream.readline().strip()!='Current road restrictions':raise ValueError('Road publisher format changed')
  data={'Closure':[{('id' if k=='ID' else k[0].lower()+k[1:]):v for k,v in r.items() if k} for r in csv.DictReader(stream)]}
  rows=road_records(data)
  result={'source':'City of Toronto road restrictions v3','url':ROAD_URL,'fetched_at':stamp(),'fetched_epoch':time.time(),'mode':'live','records':rows,'note':'Published restrictions within their date range. Partial closures and work-hour schedules require review; no automatic route exclusions.'}
  Path(path).write_text(json.dumps(result));return result
 except Exception:
  if Path(path).exists():return dict(json.loads(Path(path).read_text()),mode='cached',error='Live refresh unavailable')
  return {'source':'City of Toronto road restrictions','mode':'unavailable','records':[],'error':'City feed unavailable; controlled closure checks remain active'}
