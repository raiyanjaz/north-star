"""Explicit simulation policy. No model-generated clinical or distance rules."""
import concurrent.futures, time
from datetime import datetime
from integrations import blocked

def age(row):
 try:return time.time()-datetime.fromisoformat(row['observed_at']).timestamp()
 except (KeyError,ValueError,TypeError):return float('inf')

def evaluate(incident,groups,routes,preferred_id=None,coordination=None):
 coordination=coordination or {'units':{},'slots':{}}
 evidence=[];alternatives=[];candidates=[]
 def fact(text,source):
  id='E'+str(len(evidence)+1);evidence.append({'id':id,'text':text,'source':source});return id
 fleet=[]; hospitals=[];max_age=max(age(x) for rows in groups.values() for x in rows)
 stale=any(age(x)>120 or age(x)<-30 for rows in groups.values() for x in rows)
 for a in groups['fleet']:
  reasons=[]
  if a['id'] in coordination['units']:reasons.append('Proposed for higher-priority incident '+coordination['units'][a['id']])
  if a['status']!='available':reasons.append('Resource is '+a['status'])
  if incident['equipment'] not in a['equipment'].split(','):reasons.append('Missing '+incident['equipment']+' equipment')
  if age(a)>120:reasons.append('Fleet evidence older than 2 minutes')
  if reasons:alternatives.append({'type':'ambulance','id':a['id'],'name':a['name'],'eligible':False,'reasons':reasons})
  else:fleet.append(a)
 for h in groups['hospitals']:
  reasons=[]
  if incident['service'] not in h['capabilities'].split(','):reasons.append('Does not meet predefined '+incident['service']+' service requirement')
  if not int(h['accepting']):reasons.append('Not accepting simulated transfers')
  if int(h['slots'])-coordination['slots'].get(h['id'],0)<1 and int(h['slots'])>0:reasons.append('Receiving slots proposed for higher-priority incidents')
  if int(h['slots'])<1:reasons.append('No simulated receiving slots')
  if age(h)>120:reasons.append('Hospital evidence older than 2 minutes')
  if reasons:alternatives.append({'type':'hospital','id':h['id'],'name':h['name'],'eligible':False,'reasons':reasons})
  else:hospitals.append(h)
 # Fetch each directed leg once, concurrently; never infer an ETA when unavailable.
 keys={}
 for a in fleet:keys[('pickup',a['id'])]=(a,incident)
 for h in hospitals:keys[('transport',h['id'])]=(incident,h)
 resolved={};errors={}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  jobs={pool.submit(routes.get,*pair):key for key,pair in keys.items()}
  for job in concurrent.futures.as_completed(jobs):
   key=jobs[job]
   try:resolved[key]=job.result()
   except Exception:errors[key]='No usable routing response or cache'
 for a in fleet:
  for h in hospitals:
   reasons=[];pickup=resolved.get(('pickup',a['id']));transport=resolved.get(('transport',h['id']))
   if not pickup or not transport:reasons.append('Routing unavailable for required leg')
   else:
    for leg in [pickup,transport]:
     closure=blocked(leg,groups['roads'])
     if closure:reasons.append('Route intersects '+closure)
   if stale:reasons.append('Required source freshness failed; approval blocked')
   pair={'type':'assignment','id':a['id']+' / '+h['id'],'name':a['name']+' → '+h['name'],'ambulance_id':a['id'],'hospital_id':h['id'],'eligible':not reasons,'reasons':reasons}
   if not reasons:
    total=round((pickup['duration_s']+transport['duration_s'])/60,1)
    pair.update(total_min=total,pickup_min=round(pickup['duration_s']/60,1),transport_min=round(transport['duration_s']/60,1),pickup_route=pickup,transport_route=transport,slots=int(h['slots']),coordinated_slots=int(h['slots'])-coordination['slots'].get(h['id'],0))
    candidates.append(pair)
   alternatives.append(pair)
 candidates.sort(key=lambda x:(x['total_min'],-x.get('coordinated_slots',x['slots']),x['id']))
 selected=candidates[0] if candidates else None
 if preferred_id:
  selected=next((c for c in candidates if c['id']==preferred_id),None)
  if selected is None:raise ValueError('The selected alternative is no longer eligible. Refresh the assessment.')
 if selected:
  traffic_aware=all(selected[k].get('traffic_aware',False) for k in ['pickup_route','transport_route'])
  estimate_kind='traffic-informed driving estimate at assessment time' if traffic_aware else 'static driving estimate'
  route_source='TomTom road-network calculation with traffic' if traffic_aware else 'OSRM road-network calculation'
  selected['evidence_ids']=[fact(selected['name']+' meets the predefined '+incident['equipment']+' equipment and '+incident['service']+' service constraints.','Zetaris fleet + hospitals'),
    fact('Estimated driving: '+str(selected['pickup_min'])+' min to incident + '+str(selected['transport_min'])+' min to destination (combined '+estimate_kind+': '+str(selected['total_min'])+' min; rounded values).',route_source),
    fact('Both route legs pass the active simulated closure checks.','Zetaris roads + segment intersection'),
    fact('Hospital accepting transfers with '+str(selected['slots'])+' simulated receiving slots.','Zetaris hospitals')]
  for c in [c for c in candidates if c is not selected]:c['reasons']=['Eligible alternative: '+str(c['total_min'])+' estimated driving minutes; tie-break is more slots, then stable ID.']
  selected['reasons']=['Dispatcher-selected eligible alternative; all eligibility and route checks passed.' if preferred_id else 'Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.']
 if coordination['units'] or coordination['slots']:
  held=', '.join(next((a['name'] for a in groups['fleet'] if a['id']==aid),aid)+' for '+iid for aid,iid in coordination['units'].items())
  slots=', '.join(next((h['name'] for h in groups['hospitals'] if h['id']==hid),hid)+': '+str(count) for hid,count in coordination['slots'].items())
  fact('Higher-priority pending plans: '+(held or 'no unit commitments')+'. Receiving slots proposed: '+(slots or 'none')+'. Reservations still require dispatcher approval.','ARC priority coordination')
 if not selected:fact('No feasible assignment. Check rejected alternatives and restore valid, fresh resources or routes.','Deterministic constraint evaluation')
 for alt in alternatives:
  if alt.get('reasons') and alt is not selected:alt['evidence_id']=fact(alt['name']+': '+'; '.join(alt['reasons']), 'Eligibility and route evaluation')
 return {'selected':selected,'alternatives':alternatives,'evidence':evidence,'selection_basis':'dispatcher' if preferred_id else 'ranked','fresh':not stale,'max_age_s':round(max_age) if max_age!=float('inf') else None,'status':'recommended' if selected else 'no-feasible-assignment'}
