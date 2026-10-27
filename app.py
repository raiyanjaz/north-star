"""ARC local application. UI/API on loopback; synthetic feeds on a separate port."""
import argparse, concurrent.futures, gzip, hashlib, json, mimetypes, os, threading, time, uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, parse_qs
from simulation import Simulation, ROOT, stamp
from integrations import Federation, World, Routes, refresh_public_roads
from decision import evaluate
from agent import Agent
from public_context import PublicContext, CAMERA_IMAGES, refresh_seattle_roads
from cities import city_config
from incident_intake import incident_issues
from agent_control import AgentCoordinator
from coordination import proposal_conflict

class ARC:
 def __init__(self,directory,start_agent=True,prepare_demo=True,city="toronto",analysis_lock=None):
  self.city=city;self.config=city_config(city);directory.mkdir(parents=True,exist_ok=True)
  self.roads_fetch=refresh_seattle_roads if city=="seattle" else refresh_public_roads
  self.directory=directory;self.sim=Simulation(directory/'arc.sqlite',city);self.world=World(directory);self.routes=Routes(directory/'routes.json');self.jobs={};self.jobs_lock=threading.Lock();self.analysis_lock=analysis_lock or threading.Lock()
  self.public_context=PublicContext(self.roads_fetch,directory,on_update=self.sim.sync_public,city=city)
  self.public_roads={'mode':'unavailable','records':[],'note':'Refresh public roads to load city context.'};self.last_integration={};self.engine_error=None
  if (directory/'public-roads.json').exists():self.public_roads=dict(json.loads((directory/'public-roads.json').read_text()),mode='cached')
  self.prepare_demo=prepare_demo
  if prepare_demo:self.sim.load_demo_intake()
  self.coordinator=AgentCoordinator(self,start=start_agent)
 def sync_world(self,s):
  items=[{'type':kind,'id':r['id'],'name':r['name'],'attrs':dict(r,simulation_epoch=s['epoch'])} for key,kind in [('fleet','ambulance'),('hospitals','hospital'),('incidents','incident')] for r in s[key]]
  return self.world.call('record',items=items,runId='version-'+str(s['version']))
 def view(self):
  self.sim.sync_public(self.public_context.snapshot())
  with self.sim.lock:
   s=self.sim.read();latest=self.sim.latest_recommendations()
  agent_state=self.coordinator.snapshot(state=s,recs=latest)
  for incident in s['incidents']:
   incident['assessment_blockers']=incident_issues(incident)
   incident['agent_state']=agent_state['states'].get(incident['id'],{}).get('state','queued')
   incident['agent_reason']=agent_state['states'].get(incident['id'],{}).get('reason','')
  proposals={}
  for iid,r in latest.items():
   if iid not in proposals and r.get('simulation_epoch')==s['epoch']:
    proposals[iid]={k:r.get(k) for k in ['id','version','incident_revision','decision','approvable','evidence_epoch','created_epoch','status']}
    proposals[iid].update(ambulance_id=(r.get('selected') or {}).get('ambulance_id'),hospital_id=(r.get('selected') or {}).get('hospital_id'))
  assessments=[{k:j.get(k) for k in ['id','incident_id','status','stage','error','simulation_epoch','automatic']} for j in list(self.jobs.values()) if j.get('simulation_epoch')==s['epoch'] and j['status']=='running']
  return dict(s,city=self.config,agent=agent_state,proposals=proposals,assessments=assessments,public_context=self.public_context.snapshot(),public_roads=self.public_roads,integrations=self.last_integration,engine_error=self.engine_error,simulation=True)
 def start_analysis(self,incident_id,request,preferred_id=None,automatic=False,trigger=None,fingerprint=None):
  if fingerprint is None:
   s=self.sim.read();incident=next((i for i in s['incidents'] if i['id']==incident_id),None)
   if not incident:raise ValueError('Incident not found')
   fingerprint=(s['epoch'],s['version'],incident.get('incident_revision',0),self.sim.coordination(incident_id)['signature'])
  if not self.analysis_lock.acquire(blocking=False):raise ValueError('An assessment is already running. Please wait.')
  id=str(uuid.uuid4());job={'id':id,'status':'running','stage':'Planning evidence tools','started_at':stamp(),'incident_id':incident_id,'simulation_epoch':self.sim.read()['epoch'],'automatic':automatic,'trigger':trigger,'fingerprint':fingerprint}
  with self.jobs_lock:self.jobs[id]=job
  def run():
   try:job['result']=self.analyze(incident_id,request,job,preferred_id);job['status']='done'
   except Exception as e:
    job['status']='error';job['error']=str(e) if isinstance(e,(ValueError,RuntimeError)) else 'Assessment failed. Check services and retry.'
   finally:
    try:
     if hasattr(self,'coordinator'):self.coordinator.finished(job)
    finally:self.analysis_lock.release()
  if automatic and hasattr(self,'coordinator'):self.coordinator.log(incident_id,'Started '+(trigger or 'automatic assessment')+'.')
  threading.Thread(target=run,daemon=True).start();return job
 def analyze(self,incident_id,request,job,preferred_id=None):
  self.sim.sync_public(self.public_context.snapshot())
  s=self.sim.read();incident=next((x for x in s['incidents'] if x['id']==incident_id),None)
  if not incident or incident['status']!='open':raise ValueError('Choose an open incident')
  if incident_issues(incident):raise ValueError('; '.join(incident_issues(incident)))
  previous_at_start=self.sim.latest_recommendations().get(incident_id)
  if s['ai_offline']:raise RuntimeError('Nightshift failure scenario active. No AI explanation generated.')
  agent=Agent();tools,plan_receipt=agent.plan(request);trace=[{'tool':'Nemotron tool plan','status':'complete','detail':', '.join(tools)}]
  if 'refresh_public_roads' in tools:
   job['stage']='Refreshing public road context';self.public_roads=self.roads_fetch(self.directory/'public-roads.json')
  job['stage']='Federating fleet, hospitals and roads through Zetaris'
  if s['zetaris_offline']:raise RuntimeError('Zetaris failure scenario active. No direct-feed substitution was used.')
  groups,z=Federation(self.city).snapshot();self.last_integration['zetaris']=z
  if z['version']!=s['version']:raise RuntimeError('Conditions changed while evidence was collected. Reassess.')
  trace.append({'tool':'federate_resources','status':'complete','detail':str(z['rows'])+' rows from three REST sources; '+str(z['duration_ms'])+' ms'})
  job['stage']='Calculating eligible assignments and road-network routes';coordination=self.sim.coordination(incident_id);job['fingerprint']=(s['epoch'],s['version'],incident.get('incident_revision',0),coordination['signature']);result=evaluate(incident,groups,self.routes,preferred_id,coordination)
  trace.append({'tool':'calculate_routes','status':'complete','detail':'Explicit service, equipment, acceptance, availability, freshness and closure checks'})
  job['stage']='Recalling resource history from Meterless World Model'
  # Prior context is obtained from the actual engine before ingesting this assessment.
  memory=self.sync_world(s);changes=[]
  for key,kind in [('fleet','ambulance'),('hospitals','hospital')]:
   for r in s[key]:
    old=memory['prior'].get(r['id'])
    if old and old.get('simulation_epoch')==s['epoch']:
     for field in ['status','accepting','slots']:
      if field in r and old.get(field)!=r[field]:changes.append({'id':'C'+str(len(changes)+1),'text':r['name']+': '+field+' changed from '+str(old.get(field))+' to '+str(r[field])+'.','source':'Meterless World Model prior entity → current evidence'})
  previous=self.sim.db.execute('SELECT payload FROM recommendations WHERE json_extract(payload,\'$.incident_id\')=? ORDER BY rowid DESC LIMIT 1',(incident_id,)).fetchone()
  if previous and json.loads(previous[0]).get('simulation_epoch')==s['epoch']:
   prev=json.loads(previous[0]);old=prev.get('selected');new=result.get('selected')
   if old and new and old['id']==new['id'] and any(abs(old.get(k,0)-new.get(k,0))>=1 for k in ['pickup_min','transport_min']):changes.append({'id':'C'+str(len(changes)+1),'text':'Route estimates changed: response '+str(old['pickup_min'])+' to '+str(new['pickup_min'])+' min; transport '+str(old['transport_min'])+' to '+str(new['transport_min'])+' min.','source':'Previous recommendation vs current route estimates'})
   if old and (not new or new['id']!=old['id']):changes.append({'id':'C'+str(len(changes)+1),'text':'Assignment revised from '+old['name']+' to '+(new['name'] if new else 'no feasible assignment')+'. Fresh approval required.','source':'Previous recommendation vs current constrained calculation'})
  if s['closures']:changes.append({'id':'C'+str(len(changes)+1),'text':'Simulated destination approach closure is active. Routes crossing its 100 m zone are excluded.','source':'Zetaris simulated roads'})
  trace.append({'tool':'recall_world_history','status':'complete','detail':str(memory['events'])+' persistent engine events; '+str(len(changes))+' relevant changes'})
  job['stage']='Nemotron composing a cited explanation';explanation,receipt=agent.explain(result['evidence'],changes)
  evidence_epoch=min(__import__('datetime').datetime.fromisoformat(r['observed_at']).timestamp() for rows in groups.values() for r in rows)
  if result.get('selected'):
   traffic_epochs=[result['selected'][leg]['fetched_epoch'] for leg in ['pickup_route','transport_route'] if result['selected'][leg].get('traffic_aware')]
   if traffic_epochs:evidence_epoch=min(evidence_epoch,*traffic_epochs)
  result['fresh']=result['fresh'] and time.time()-evidence_epoch<=120
  rec=dict(result,automatic=job.get('automatic',False),trigger=job.get('trigger'),coordination_signature=coordination['signature'],coordination=coordination,incident_revision=incident.get('incident_revision',0),simulation_epoch=s['epoch'],evidence_epoch=evidence_epoch,id=str(uuid.uuid4()),incident_id=incident_id,version=s['version'],created_at=stamp(),created_epoch=time.time(),decision='pending',changes=changes,explanation=explanation,trace=trace,zetaris=z,ai={'status':'online','plan':plan_receipt,'explanation':receipt},source_rows=groups,request=request[:500])
  rec['approvable']=bool(rec['selected']) and rec['fresh'] and self.sim.read()['version']==s['version']
  if self.sim.read()['version']!=s['version']:raise RuntimeError('Conditions changed during analysis. Results discarded; reassess.')
  self.sim.sync_public(self.public_context.snapshot())
  latest=next(i for i in self.sim.read()['incidents'] if i['id']==incident_id)
  if latest.get('incident_revision',0)!=incident.get('incident_revision',0) or incident_issues(latest):raise RuntimeError('Incident details or public feed changed during analysis. Results discarded; review and reassess.')
  if proposal_conflict(rec,self.sim.coordination(incident_id),self.sim.read()):raise RuntimeError('Competing resource proposals changed during analysis. ARC will reassess.')
  current_decision=self.sim.latest_recommendations().get(incident_id)
  if job.get('automatic') and previous_at_start and previous_at_start.get('decision')=='pending' and current_decision and current_decision['id']==previous_at_start['id'] and current_decision.get('decision')=='rejected':raise RuntimeError('Dispatcher rejected the plan during refresh. Update intake or retry when ready.')
  p=rec['selected'] or {}
  self.world.call('record',items=[],assignment={'id':rec['id'],'incident':incident_id,'ambulance':p.get('ambulance_id'),'hospital':p.get('hospital_id'),'version':s['version'],'status':rec['status']})
  self.sim.store_rec(rec);self.last_integration['nightshift']=receipt
  return rec

class ARCServer(ThreadingHTTPServer):
 # Two open workspaces can request many local assets at once during navigation.
 request_queue_size=64

class Handler(BaseHTTPRequestHandler):
 server_version='ARC'
 asset_cache={}
 asset_lock=threading.Lock()
 def log_message(self,*args):pass
 @property
 def arc(self):
  parts=urlsplit(self.path);city=parse_qs(parts.query).get('city',['toronto'])[0]
  if self.server.feed_only:city='seattle' if parts.path.startswith('/feeds/seattle/') else 'toronto'
  city_config(city)
  return self.server.arcs[city] if hasattr(self.server,'arcs') else self.server.arc
 def reply(self,status,data,ctype='application/json'):
  b=json.dumps(data,ensure_ascii=False,separators=(',',':')).encode() if ctype=='application/json' else data
  compressed=len(b)>1024 and self.accepts_gzip()
  if compressed:b=gzip.compress(b,compresslevel=1)
  self.send_response(status);self.send_header('Content-Type',ctype);self.send_header('Content-Length',str(len(b)));self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.send_header('Referrer-Policy','strict-origin-when-cross-origin')
  if compressed:self.send_header('Content-Encoding','gzip');self.send_header('Vary','Accept-Encoding')
  self.end_headers();self.wfile.write(b)
 def accepts_gzip(self):
  for value in self.headers.get('Accept-Encoding','').split(','):
   parts=value.strip().lower().split(';')
   if parts[0]=='gzip' and not any(p.strip() in ('q=0','q=0.0','q=0.00','q=0.000') for p in parts[1:]):return True
  return False
 def static(self,file):
  stat=file.stat();key=str(file);revision=(stat.st_mtime_ns,stat.st_size)
  with self.asset_lock:
   cached=self.asset_cache.get(key)
   if cached is None or cached['revision']!=revision:
    raw=file.read_bytes();cached={'revision':revision,'raw':raw,'gzip':gzip.compress(raw,compresslevel=1),'etag':hashlib.sha256(raw).hexdigest()}
    self.asset_cache[key]=cached
  compressed=self.accepts_gzip();etag='"'+cached['etag']+('-gzip' if compressed else '')+'"'
  unchanged=self.headers.get('If-None-Match')==etag
  self.send_response(304 if unchanged else 200)
  self.send_header('Cache-Control','public, max-age=0, must-revalidate');self.send_header('ETag',etag);self.send_header('Vary','Accept-Encoding')
  if not unchanged:
   b=cached['gzip' if compressed else 'raw'];self.send_header('Content-Type',mimetypes.guess_type(str(file))[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(b)));self.send_header('X-Content-Type-Options','nosniff')
   if compressed:self.send_header('Content-Encoding','gzip')
  self.end_headers()
  if not unchanged:self.wfile.write(b)
 def do_GET(self):
  path=urlsplit(self.path).path
  try:
   if self.server.feed_only:
    if path in [prefix+kind for prefix in ['/feeds/','/feeds/seattle/'] for kind in ['fleet','hospitals','roads']]:return self.reply(200,self.arc.sim.feed(path.split('/')[-1]))
    return self.reply(404,{'error':'Not found'})
   if path=='/api/state':return self.reply(200,self.arc.view())
   if path.startswith('/api/recommendations/'):
    return self.reply(200,self.arc.sim.latest_recommendation(path.split('/')[-1]))
   if path=='/api/public':return self.reply(200,self.arc.public_context.snapshot())
   if path.startswith('/api/cameras/'):
    camera=path.split('/')[-1]
    catalog=self.arc.public_context.snapshot().get('cameras',{}).get('records',[])
    if not any(c['id']==camera for c in catalog):return self.reply(404,{'error':'Camera not found'})
    from urllib.request import urlopen, Request
    with urlopen(Request(CAMERA_IMAGES+'loc'+camera+'.jpg',headers={'User-Agent':'ARC/1.0'}),timeout=10) as response:
     frame=response.read(2000000)
    if not frame.startswith(b'\xff\xd8'):raise ValueError('Camera image unavailable')
    return self.reply(200,frame,'image/jpeg')
   if path=='/api/world':return self.reply(200,self.arc.world.call('inspect'))
   if path.startswith('/api/jobs/'):
    job=self.arc.jobs.get(path.split('/')[-1]);return self.reply(200 if job else 404,job or {'error':'Job not found'})
   if path=='/api/health':return self.reply(200,{'app':'ARC','status':'online','world_model':self.arc.world.call('inspect')['engine']})
   if path=='/':path='/index.html'
   if path not in ['/index.html','/app.js','/style.css','/leaflet.js','/leaflet.css','/toronto-map.geojson','/dispatch-model.mjs','/agent-workspace.css','/maplibre-gl.js','/maplibre-gl.css','/leaflet-maplibre-gl.js','/seattle-map.geojson']:return self.reply(404,{'error':'Not found'})
   file=ROOT/'web'/path[1:]
   if path!='/index.html':return self.static(file)
   content=file.read_bytes()
   if path=='/index.html':
    config=self.arc.config
    content=content.decode().replace('Toronto operations',config['name']+' operations').replace('Toronto incident, unit and hospital map',config['name']+' incident, unit and hospital map').replace('Toronto public information',config['name']+' public information').replace('Cached Toronto streets','Cached '+config['name']+' streets').replace('<script src="/leaflet.js">','<script>window.ARC_CITY='+json.dumps(config)+';window.ARC_INITIAL_STATE=fetch("/api/state?city='+config['id']+'").then(r=>r.ok?r.json():null).catch(()=>null);</script><script src="/leaflet.js">').encode()
   return self.reply(200,content,mimetypes.guess_type(str(file))[0] or 'application/octet-stream')
  except ValueError:return self.reply(400,{'error':'Invalid request or city workspace.'})
  except Exception:return self.reply(503,{'error':'Service unavailable. Check local runtime.'})
 def do_POST(self):
  if self.server.feed_only:return self.reply(405,{'error':'Read-only synthetic feeds'})
  # Prevent drive-by browser requests from other origins changing the simulation.
  origin=self.headers.get('Origin')
  if origin and origin not in ['http://127.0.0.1:'+str(self.server.server_port),'http://localhost:'+str(self.server.server_port)]:return self.reply(403,{'error':'Origin rejected'})
  if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.reply(415,{'error':'JSON required'})
  try:
   length=int(self.headers.get('Content-Length','0'))
   if length>8192:raise ValueError('Request too large')
   body=json.loads(self.rfile.read(length) or '{}');path=urlsplit(self.path).path
   if path=='/api/agent/control':
    self.arc.coordinator.set_enabled(body.get('enabled'));return self.reply(200,self.arc.coordinator.snapshot())
   if path=='/api/agent/retry':return self.reply(202,self.arc.coordinator.retry(str(body.get('incident_id','')),body.get('request')))
   if path=='/api/demo/intake':return self.reply(200,{'loaded':self.arc.sim.load_demo_intake()})
   if path=='/api/analyze':return self.reply(202,self.arc.start_analysis(str(body.get('incident_id','')),str(body.get('request','Assess this incident and explain the best feasible assignment.'))))
   if path=='/api/alternative':
    prior=self.arc.sim.get_rec(str(body.get('recommendation_id','')))
    if not prior or prior['version']!=self.arc.sim.read()['version'] or prior['decision']!='pending':raise ValueError('Refresh the proposal before choosing an alternative.')
    pair=str(body.get('pair_id',''))
    if not any(a['id']==pair and a['type']=='assignment' and a['eligible'] for a in prior['alternatives']):raise ValueError('Only an eligible alternative may be selected.')
    return self.reply(202,self.arc.start_analysis(prior['incident_id'],'Review this dispatcher-selected alternative and explain its eligibility.',pair))
   if path=='/api/incidents/details':
    self.arc.sim.sync_public(self.arc.public_context.snapshot())
    return self.reply(200,self.arc.sim.update_incident_details(body.get('incident_id'),body))
   if path=='/api/public/review':
    source=self.arc.public_context.snapshot().get('police',{})
    if source.get('stale',True):raise ValueError('Public incident feed is unavailable or stale. Wait for a fresh update.')
    incident=next((r for r in source.get('records',[]) if r['id']==body.get('id')),None)
    if not incident:raise ValueError('Public call is no longer in the current feed')
    return self.reply(200,self.arc.sim.add_public_review(incident,body.get('service'),body.get('equipment'),body.get('priority')))
   if path=='/api/scenario':return self.reply(200,self.arc.sim.scenario(body.get('name'),body.get('incident_id')))
   if path=='/api/reset':
    workspace=self.arc
    with workspace.sim.lock:
     workspace.sim.reset()
     if workspace.prepare_demo:workspace.sim.load_demo_intake()
     result=workspace.sim.read()
    return self.reply(200,result)
   if path=='/api/decision':
    self.arc.sim.sync_public(self.arc.public_context.snapshot())
    r=self.arc.sim.decide(body.get('id'),body.get('action'))
    try:self.arc.sync_world(self.arc.sim.read())
    except Exception:self.arc.engine_error='Assignment saved, but World Model sync failed. Reassess after restoring engine.'
    return self.reply(200,r)
   if path=='/api/roads/refresh':
    self.arc.public_roads=self.arc.roads_fetch(self.arc.directory/'public-roads.json');return self.reply(200,self.arc.public_roads)
   return self.reply(404,{'error':'Not found'})
  except (ValueError,TypeError):return self.reply(409,{'error':str(__import__('sys').exc_info()[1])})
  except Exception:return self.reply(503,{'error':'Operation failed. Check services and retry.'})

def main():
 p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=4317);p.add_argument('--feed-port',type=int,default=4318);p.add_argument('--data-dir',default=str(ROOT/'data'));args=p.parse_args()
 directory=__import__('pathlib').Path(args.data_dir);directory.mkdir(exist_ok=True,parents=True);inference_lock=threading.Lock()
 arcs={city:ARC(directory if city=='toronto' else directory/city,city=city,analysis_lock=inference_lock) for city in ['toronto','seattle']}
 arc=arcs['toronto']
 servers=[]
 for host,port,feed in [('127.0.0.1',args.port,False),('0.0.0.0',args.feed_port,True)]:
  server=ARCServer((host,port),Handler);server.arc=arc;server.arcs=arcs;server.feed_only=feed;servers.append(server)
  threading.Thread(target=server.serve_forever,daemon=True).start()
 print('ARC ready at http://127.0.0.1:'+str(args.port),flush=True)
 try:threading.Event().wait()
 except KeyboardInterrupt:
  for server in servers:server.shutdown()
  for workspace in arcs.values():
   workspace.coordinator.stop.set();workspace.public_context.stop.set();workspace.world.close()
if __name__=='__main__':main()
