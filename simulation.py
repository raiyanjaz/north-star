"""Transactional workspace resources, public incident intake and local reservations."""
import json, sqlite3, threading, time
from pathlib import Path
from datetime import datetime, timezone
from incident_intake import public_key, relevant_call, valid_pickup, incident_issues
from coordination import commitments, current_proposal, proposal_conflict

ROOT=Path(__file__).parent

def stamp(t=None): return datetime.fromtimestamp(t or time.time(),timezone.utc).isoformat()

HOSPITALS=[
 {'id':'H-TGH','name':'Toronto General','lat':43.6596,'lon':-79.3885,'capabilities':'general,cardiac','accepting':1,'slots':3},
 {'id':'H-SMH','name':"St. Michael’s",'lat':43.6534,'lon':-79.3777,'capabilities':'general,trauma','accepting':1,'slots':2},
 {'id':'H-TWH','name':'Toronto Western','lat':43.6534,'lon':-79.4055,'capabilities':'general,neuro','accepting':1,'slots':2},
 {'id':'H-SK','name':'SickKids','lat':43.6575,'lon':-79.3869,'capabilities':'pediatric','accepting':1,'slots':2},
]
FLEET=[
 {'id':'A-12','name':'Medic 12','lat':43.6508,'lon':-79.3881,'equipment':'general,advanced','status':'available'},
 {'id':'A-24','name':'Medic 24','lat':43.6651,'lon':-79.3992,'equipment':'general,advanced','status':'available'},
 {'id':'A-37','name':'Medic 37','lat':43.6480,'lon':-79.3690,'equipment':'general','status':'busy'},
]
INCIDENTS=[
 {'id':'INC-1042','name':'Queen & University','lat':43.6509,'lon':-79.3862,'service':'general','equipment':'general','priority':'Priority 2','description':'Adult transport • predefined general-service requirement'},
 {'id':'INC-1043','name':'College & Spadina','lat':43.6580,'lon':-79.4003,'service':'neuro','equipment':'advanced','priority':'Priority 1','description':'Specialist transport • predefined neuro-service requirement'},
 {'id':'INC-1044','name':'King & Church','lat':43.6499,'lon':-79.3753,'service':'pediatric','equipment':'general','priority':'Priority 2','description':'Pediatric transport • predefined pediatric-service requirement'},
]

class Simulation:
 def __init__(self,path):
  Path(path).parent.mkdir(parents=True,exist_ok=True)
  self.db=sqlite3.connect(str(path),check_same_thread=False,isolation_level=None)
  self.db.row_factory=sqlite3.Row; self.lock=threading.RLock()
  self.db.executescript('''PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS recommendations (id TEXT PRIMARY KEY,payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY,at TEXT,event TEXT,payload TEXT);
''')
  if not self.db.execute('SELECT 1 FROM state').fetchone(): self.reset()
 def read(self):
  with self.lock: return json.loads(self.db.execute('SELECT payload FROM state WHERE id=1').fetchone()[0])
 def save(self,s): self.db.execute('INSERT OR REPLACE INTO state VALUES(1,?)',(json.dumps(s),))
 def log(self,event,payload): self.db.execute('INSERT INTO audit(at,event,payload) VALUES(?,?,?)',(stamp(),event,json.dumps(payload)))
 def reset(self):
  with self.lock:
   old=self.read() if self.db.execute('SELECT 1 FROM state').fetchone() else {'version':0}
   s={'version':old['version']+1,'epoch':stamp(),'fleet':FLEET,'hospitals':HOSPITALS,'incidents':[dict(i,status='open',received_at=stamp(time.time()-120+n*45)) for n,i in enumerate(INCIDENTS)],
      'scenario':'baseline','feed_stale':False,'zetaris_offline':False,'ai_offline':False,'closures':[], 'assignments':[]}
   self.save(s); self.log('reset',{'version':s['version']}); return self.read()
 def feed(self,kind):
  s=self.read(); now=stamp(time.time()-1200 if s['feed_stale'] else None)
  rows=s[kind] if kind!='roads' else s['closures'] or [{'id':'CLEAR','name':'No simulated closure','lat':0.0,'lon':0.0,'radius_m':0,'active':0}]
  return {'records':[dict(r,version=s['version'],source='simulated',observed_at=now) for r in rows]}
 def scenario(self,name,incident_id=None):
  allowed=['hospital-unavailable','road-closure','fleet-busy','stale-feed','no-destination','zetaris-offline','ai-offline','refresh']
  if name not in allowed: raise ValueError('Unknown scenario')
  with self.lock:
   s=self.read(); s['version']+=1; s['scenario']=name
   if incident_id:
    latest=self.db.execute("SELECT payload FROM recommendations WHERE json_extract(payload,'$.incident_id')=? AND json_extract(payload,'$.simulation_epoch')=? ORDER BY rowid DESC LIMIT 1",(incident_id,s['epoch'])).fetchone()
   else:latest=self.db.execute('SELECT payload FROM recommendations ORDER BY rowid DESC LIMIT 1').fetchone()
   rec=json.loads(latest[0]) if latest else {}; selected=rec.get('selected') or {}
   hid=selected.get('hospital_id','H-SMH'); aid=selected.get('ambulance_id','A-12')
   if name=='hospital-unavailable':
    for h in s['hospitals']:
     if h['id']==hid: h['accepting']=0
   if name=='road-closure':
    coords=selected.get('transport_route',{}).get('coordinates',[])
    p=coords[max(0,len(coords)-3)] if coords else [-79.3777,43.6534]
    s['closures']=[{'id':'SIM-C1','name':'Simulated destination approach closure','lon':p[0],'lat':p[1],'radius_m':100,'active':1}]
   if name=='fleet-busy':
    for a in s['fleet']:
     if a['id']==aid:a['status']='busy'
   if name=='no-destination':
    for h in s['hospitals']:h['accepting']=0
   s['feed_stale']=name=='stale-feed'
   s['zetaris_offline']=name=='zetaris-offline';s['ai_offline']=name=='ai-offline'
   self.save(s);self.log('scenario',{'name':name,'version':s['version']});return s
 def sync_public(self,sources):
  with self.lock:
   s=self.read();changed=False
   for kind in ['fire','police']:
    source=sources.get(kind,{})
    fresh=source.get('mode')=='live' and not source.get('stale',True)
    seen=set()
    for row in source.get('records',[]):
     try:key=public_key(kind,row)
     except (ValueError,KeyError,TypeError):continue
     seen.add(key)
     incident=next((i for i in s['incidents'] if i.get('public_key')==key),None)
     # Preserve older manually imported reviews when the same call is ingested.
     if incident is None and kind=='police':
      incident=next((i for i in s['incidents'] if i.get('public_source')=='Toronto Police Service' and i.get('public_observed_at')==row.get('observed_at') and (i.get('public_location') or i['name'])==row.get('location')),None)
     if incident is None:
      if not fresh or not relevant_call(kind,row):continue
      incident={'id':'LIVE-'+key,'public_key':key,'public_kind':kind,
       'public_source':'Toronto Fire Services' if kind=='fire' else 'Toronto Police Service',
       'name':row.get('location') or 'Location not published','status':'open','received_at':row.get('observed_at') or stamp(),
       'priority':None,'service':None,'equipment':None,'lat':row.get('lat'),'lon':row.get('lon'),
       'pickup_source':'public' if valid_pickup(row.get('lat'),row.get('lon')) else None,
       'location_precision':'public mapped intersection' if kind=='police' else 'public street / postal area',
       'incident_revision':0,'requirements_source':None,'notes':'','source_review_required':False}
      s['incidents'].append(incident);changed=True
     incoming={'public_key':key,'public_kind':kind,'public_call_type':row.get('name'),
      'public_location':row.get('location'),'public_observed_at':row.get('observed_at'),
      'public_lat':row.get('lat'),'public_lon':row.get('lon'),'public_units':row.get('units',''),
      'public_alarm_level':row.get('alarm_level'),'public_source_url':source.get('source_url'),
      'public_feed_status':'present' if fresh else 'stale'}
     important=['public_call_type','public_location','public_lat','public_lon','public_alarm_level','public_observed_at']
     edited=any(field in incident and incident[field]!=incoming[field] for field in important)
     if edited:
      incident['source_review_required']=True
      # Preserve dispatcher pickup overrides even when the source moves.
      if incident.get('pickup_source')!='dispatcher':
       incident['lat']=row.get('lat');incident['lon']=row.get('lon')
       incident['name']=row.get('location') or 'Location not published'
     material=edited or incident.get('public_feed_status')!=incoming['public_feed_status']
     if any(incident.get(k)!=v for k,v in incoming.items()) or material:
      incident.update(incoming)
      if material:incident['incident_revision']=incident.get('incident_revision',0)+1
      changed=True
    for incident in s['incidents']:
     if incident.get('public_kind')!=kind:continue
     status=('missing' if incident.get('public_key') not in seen else 'present') if fresh else 'stale'
     if incident.get('public_feed_status')!=status:
      incident['public_feed_status']=status;incident['incident_revision']=incident.get('incident_revision',0)+1;changed=True
   if changed:
    # Feed arrivals and case edits have their own revisions; they must not expire
    # unrelated assessments by bumping the resource version on every poll.
    self.save(s)
   return changed
 def update_incident_details(self,id,body):
  with self.lock:
   s=self.read();incident=next((i for i in s['incidents'] if i['id']==id),None)
   if not incident or not (incident.get('public_source') or incident.get('prepared_intake')):raise ValueError('Choose a public incident')
   if incident['status']!='open':raise ValueError('A reserved case cannot be edited')
   if body.get('revision')!=incident.get('incident_revision',0):raise ValueError('Call details changed. Reload and review the latest details.')
   service=body.get('service');equipment=body.get('equipment');priority=body.get('priority')
   if service not in ['general','cardiac','trauma','neuro','pediatric'] or equipment not in ['general','advanced'] or priority not in ['Priority 1','Priority 2','Priority 3']:
    raise ValueError('Choose a priority, service and equipment requirement')
   if not valid_pickup(body.get('lat'),body.get('lon')):raise ValueError('Confirm a valid pickup location within Toronto')
   lat=float(body['lat']);lon=float(body['lon']);label=str(body.get('pickup_label','')).strip()[:200]
   pickup_source=incident.get('pickup_source')
   if lat!=incident.get('lat') or lon!=incident.get('lon') or label!=(incident.get('pickup_label') or incident['name']):pickup_source='dispatcher'
   incident.update(service=service,equipment=equipment,priority=priority,lat=lat,lon=lon,
    pickup_label=label or incident['name'],name=label or incident['name'],pickup_source=pickup_source or 'dispatcher',
    requirements_source='dispatcher',notes=str(body.get('notes','')).strip()[:1000],source_review_required=False,
    incident_revision=incident.get('incident_revision',0)+1)
   self.save(s);self.log('incident-details-updated',{'incident_id':id,'revision':incident['incident_revision']})
   return {'incident_id':id,'revision':incident['incident_revision']}
 def add_public_review(self,call,service,equipment,priority):
  if service not in ['general','cardiac','trauma','neuro','pediatric'] or equipment not in ['general','advanced'] or priority not in ['Priority 1','Priority 2','Priority 3']:
   raise ValueError('Choose a priority, service and equipment requirement')
  # Public police records do not publish a durable call identifier. A content key
  # avoids treating their periodically rebuilt OBJECTID as an incident identity.
  import hashlib
  identity=call['observed_at']+'|'+call['name']+'|'+call['location']
  iid='PUBLIC-'+hashlib.sha256(identity.encode()).hexdigest()[:12]
  with self.lock:
   s=self.read()
   queued=next((i for i in s['incidents'] if i.get('public_key')==public_key('police',call)),None)
   if queued:
    self.update_incident_details(queued['id'],{'revision':queued.get('incident_revision',0),'service':service,'equipment':equipment,'priority':priority,'lat':queued.get('lat'),'lon':queued.get('lon'),'pickup_label':queued['name'],'notes':queued.get('notes','')})
    return {'incident_id':queued['id'],'created':False}
   if any(i['id']==iid for i in s['incidents']):return {'incident_id':iid,'created':False}
   incident={'id':iid,'name':call['location'] or call['name'],'lat':call['lat'],'lon':call['lon'],
    'service':service,'equipment':equipment,'priority':priority,'status':'open',
    'received_at':stamp(),'description':call['name']+' · dispatcher-defined review requirements',
    'public_source':'Toronto Police Service','public_observed_at':call['observed_at'],
    'public_call_type':call['name'],'requirements_source':'dispatcher','location_precision':'public mapped intersection'}
   s['incidents'].append(incident);s['version']+=1;self.save(s)
   self.log('public-review-created',{'incident_id':iid,'source':'Toronto Police Service'})
   return {'incident_id':iid,'created':True}
 def latest_recommendations(self):
  with self.lock:
   epoch=self.read()['epoch'];result={}
   for row in self.db.execute('SELECT payload FROM recommendations ORDER BY rowid DESC').fetchall():
    r=json.loads(row[0])
    if r.get('simulation_epoch')==epoch and r['incident_id'] not in result:result[r['incident_id']]=r
   return result
 def coordination(self,incident_id):
  with self.lock:
   s=self.read();incident=next(i for i in s['incidents'] if i['id']==incident_id)
   return commitments(incident,s,self.latest_recommendations())
 def load_demo_intake(self):
  with self.lock:
   s=self.read()
   if s.get('demo_intake_loaded'):return False
   profile=json.loads((ROOT/'fixtures/demo-intake.json').read_text())
   public=[i for i in s['incidents'] if i.get('public_feed_status')=='present']
   for n,case in enumerate(profile['incidents']):
    if any(i['id']==case['id'] for i in s['incidents']):continue
    reference=public[n%len(public)] if public else None
    s['incidents'].append(dict(case,status='open',received_at=stamp(time.time()+n*.001),incident_revision=0,
     prepared_intake=True,requirements_source='prepared_demo',pickup_source='prepared_demo',
     location_precision='prepared exercise location',notes='Prepared exercise intake; clinical requirements and pickup are supplied by the demo profile.',
     public_reference={k:reference.get(k) for k in ['public_source','public_key','public_call_type','public_location','public_observed_at']} if reference else None))
   for unit in profile['fleet']:
    if not any(a['id']==unit['id'] for a in s['fleet']):s['fleet'].append(unit)
   s['demo_intake_loaded']=True;s['version']+=1;self.save(s);self.log('prepared-intake-loaded',{'cases':[i['id'] for i in profile['incidents']]})
   return True
 def store_rec(self,rec):
  with self.lock:
   self.db.execute('INSERT INTO recommendations VALUES(?,?)',(rec['id'],json.dumps(rec)))
   for row in self.db.execute('SELECT payload FROM recommendations WHERE id<>?',(rec['id'],)).fetchall():
    old=json.loads(row[0])
    if old.get('incident_id')==rec['incident_id'] and old.get('simulation_epoch')==rec.get('simulation_epoch') and old.get('decision')=='pending' and not old.get('superseded_by'):
     old.update(approvable=False,superseded_by=rec['id'],invalidation_reason='A newer assessment supersedes this plan.')
     self.db.execute('UPDATE recommendations SET payload=? WHERE id=?',(json.dumps(old),old['id']))
   s=self.read();latest=self.latest_recommendations()
   for incident in s['incidents']:
    other=latest.get(incident['id'])
    if not current_proposal(other,incident,s):continue
    coord=commitments(incident,s,latest)
    if proposal_conflict(other,coord,s):
     other['approvable']=False;other['coordination_invalidated']=True
     other['invalidation_reason']='Higher-priority pending proposals changed. ARC is coordinating a fresh plan.'
     self.db.execute('UPDATE recommendations SET payload=? WHERE id=?',(json.dumps(other),other['id']))
 def get_rec(self,id):
  with self.lock:
   row=self.db.execute('SELECT payload FROM recommendations WHERE id=?',(id,)).fetchone()
   return json.loads(row[0]) if row else None
 def decide(self,id,action):
  if action not in ['approve','reject']: raise ValueError('Unknown decision')
  with self.lock:
   self.db.execute('BEGIN IMMEDIATE')
   try:
    r=self.get_rec(id);s=self.read()
    if not r:raise ValueError('Recommendation not found')
    if r.get('superseded_by'):raise ValueError('A newer plan is available. Review the latest assessment.')
    if r['decision']!='pending':raise ValueError('This recommendation has already been decided')
    if r['version']!=s['version']:raise ValueError('Conditions changed. Reassess before deciding.')
    incident=next(x for x in s['incidents'] if x['id']==r['incident_id'])
    if r.get('incident_revision',0)!=incident.get('incident_revision',0):raise ValueError('Incident details changed. Reassess before deciding.')
    if action=='approve':
     if proposal_conflict(r,self.coordination(incident['id']),s):raise ValueError('Competing resource proposals changed. Wait for ARC to reassess.')
     if incident_issues(incident):raise ValueError('; '.join(incident_issues(incident)))
     if not r.get('approvable') or time.time()-r.get('evidence_epoch',r['created_epoch'])>120:raise ValueError('Recommendation is blocked or expired. Reassess.')
     p=r['selected'];a=next(x for x in s['fleet'] if x['id']==p['ambulance_id']);h=next(x for x in s['hospitals'] if x['id']==p['hospital_id'])
     incident=next(x for x in s['incidents'] if x['id']==r['incident_id'])
     if a['status']!='available' or not h['accepting'] or h['slots']<1 or incident['status']!='open':raise ValueError('Resource or incident is no longer available')
     a['status']='assigned';h['slots']-=1;incident['status']='assigned'
     s['assignments'].append({'incident_id':r['incident_id'],'ambulance_id':a['id'],'hospital_id':h['id'],'at':stamp()})
     s['version']+=1;self.save(s)
    r['decision']='approved' if action=='approve' else 'rejected'
    self.db.execute('UPDATE recommendations SET payload=? WHERE id=?',(json.dumps(r),id));self.log(r['decision'],{'recommendation':id});self.db.execute('COMMIT');return r
   except Exception:self.db.execute('ROLLBACK');raise
