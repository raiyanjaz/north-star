"""Exercise real product APIs and sponsors. Run against a local app; resets simulation."""
import json,time,sys
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError
BASE='http://127.0.0.1:4317'
def call(path,body=None):
 req=Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json'})
 with urlopen(req,timeout=200) as r:return json.load(r)
def assess(id='INC-1042'):
 j=call('/api/analyze',{'incident_id':id})
 start=time.monotonic()
 while j['status']=='running':
  time.sleep(.5);j=call('/api/jobs/'+j['id'])
  if time.monotonic()-start>400:raise RuntimeError('Assessment exceeded bounded test time')
 if j['status']=='error':raise RuntimeError(j['error'])
 r=j['result']; print('Assessment:',r['status'],(r.get('selected') or {}).get('name'),round(time.monotonic()-start,1),'s',flush=True);return r

def main():
 results=[];call('/api/reset',{})
 base=assess();assert base['selected'] and base['approvable'];assert base['ai']['explanation']['winning_route']['provider']=='nvidia';results.append('baseline: real Zetaris + Nightshift/NVIDIA receipt + actual routes')
 call('/api/scenario',{'name':'road-closure'})
 try:call('/api/decision',{'id':base['id'],'action':'approve'});raise AssertionError('Old approval accepted')
 except HTTPError as e:assert e.code==409
 revised=assess();assert revised['selected'] and revised['selected']['hospital_id']!=base['selected']['hospital_id'];assert revised['changes'];results.append('road closure: revised destination and renewed approval')
 decision=call('/api/decision',{'id':revised['id'],'action':'approve'});s=call('/api/state');assert s['fleet'][0]['status']=='assigned';assert s['incidents'][0]['status']=='assigned';results.append('approval: fleet + receiving slot + incident updated')
 call('/api/reset',{});call('/api/scenario',{'name':'stale-feed'});stale=assess();assert stale['selected'] is None and not stale['approvable'];results.append('stale feed: no approvable proposal')
 call('/api/reset',{});call('/api/scenario',{'name':'no-destination'});none=assess();assert none['selected'] is None;results.append('no destination: concrete exclusions and no proposal')
 for scenario in ['zetaris-offline','ai-offline']:
  call('/api/reset',{});call('/api/scenario',{'name':scenario})
  try:assess();raise AssertionError('Failure scenario silently succeeded')
  except RuntimeError as e:results.append(scenario+': explicit failure, no fallback');print(str(e),flush=True)
 call('/api/reset',{});world=call('/api/world');assert world['entities'] and world['events'];results.append('World Model: real engine entities and persistent events')
 output={'at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'passed':results,'baseline_receipt':base['ai']['explanation'],'baseline_selected':{k:base['selected'][k] for k in ['id','pickup_min','transport_min','total_min']},'revised_selected':{k:revised['selected'][k] for k in ['id','total_min']}}
 Path('artifacts/live-validation.json').write_text(json.dumps(output,indent=2));print(json.dumps(output,indent=2))
if __name__=='__main__':main()
