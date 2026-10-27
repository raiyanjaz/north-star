import {elapsedSeconds,durationLabel,sortedIncidents,proposalState,belongsToSelection,nextAction,workflowBucket} from './dispatch-model.mjs';
const $=s=>document.querySelector(s);
const city=window.ARC_CITY;
const storageKey=key=>city.id==='toronto'?key:key+'.'+city.id;
$('#clock').title=city.name+' local time ('+city.timezone+')';
$('#city-selector').value=city.id;
$('.brand').href='/?city='+city.id;
$('#city-selector').onchange=e=>{window.location.href='/?city='+encodeURIComponent(e.target.value);};
const [south,west,north,east]=city.bounds;
for(const [name,min,max] of [['lat',south,north],['lon',west,east]]){const input=$(`[name="${name}"]`);input.min=(min+.000001).toFixed(6);input.max=(max-.000001).toFixed(6);}
if(city.id==='seattle'){
 for(const select of [$('#queue-source'),$('#public-kind')]){const police=select.querySelector('[value="police"]');police.hidden=true;police.disabled=true;police.textContent='Police (not connected)';}
 $('#queue-source [value="fire"]').textContent='Seattle Fire / EMS';
 $('.map-disclosure').textContent='Ordinary driving estimates · Seattle operations';
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=null,selected=sessionStorage.getItem(storageKey('arc.selected')),rec=null,activeJob=null;
let recRenderKey='',mapRenderKey='',lastEpoch=null,loadSequence=0;
const records=new Map(),errors=new Map(),activities=[],scrollPositions=new Map(),detailStates=new Map(),intakeDrafts=new Map();
let renderedIncident=null,resourceKey='',headingKey='',queueStage='all',overviewInitialized=false;
const map=L.map('map',{zoomControl:false,preferCanvas:true,minZoom:10,maxZoom:19,scrollWheelZoom:false}).setView(city.center,city.zoom);
L.control.zoom({position:'bottomright'}).addTo(map);
const layers=L.layerGroup().addTo(map);
const publicLayers=L.layerGroup().addTo(map);
const pickupDraftLayer=L.layerGroup().addTo(map);
let publicRenderKey='',publicMapKey='',intakeOwner='',pickingPickup=null;
// Keep local streets underneath remote backgrounds, including partially loaded tiles.
map.createPane('cachedStreets');
map.getPane('cachedStreets').style.zIndex=150;
map.getPane('cachedStreets').style.pointerEvents='none';
const fallbackBase=L.layerGroup().addTo(map);
map.attributionControl.addAttribution(city.basemap_credit);
// Vector cartography keeps labels sharp; existing Leaflet overlays remain authoritative.
const streetTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
streetTiles.on('tileload',()=>{$('#map-source').textContent='Standard street map · cached streets beneath unavailable tiles';});
streetTiles.on('tileerror',()=>{fallbackBase.addTo(map);map.attributionControl.addAttribution(city.basemap_credit);$('#map-source').textContent='Street background unavailable · cached downtown streets shown';});
let vectorBase=null,vectorReady=false,vectorFailed=false,cachedStreetsPromise=null;
function fallbackMap(){if(vectorFailed)return;vectorFailed=true;loadCachedStreets();map.getPane('cachedStreets').style.display='';if(vectorBase&&map.hasLayer(vectorBase))map.removeLayer(vectorBase);streetTiles.addTo(map);$('#map-source').textContent='Loading standard street fallback…';}
try{
 vectorBase=L.maplibreGL({style:'https://tiles.openfreemap.org/styles/positron',interactive:false}).addTo(map);
 const vector=vectorBase.getMaplibreMap();
 vector.on('load',()=>{if(vectorFailed)return;vectorReady=true;map.getPane('cachedStreets').style.display='none';$('#map-source').textContent='OpenFreeMap · street map';});
 vector.on('error',()=>{fallbackMap();});
 setTimeout(()=>{if(!vectorReady)fallbackMap();},15000);
}catch{fallbackMap();}
L.control.scale({position:'bottomleft',imperial:false,maxWidth:90}).addTo(map);
function loadCachedStreets(){
 if(cachedStreetsPromise)return cachedStreetsPromise;
 cachedStreetsPromise=fetch('/'+city.basemap).then(r=>r.json()).then(data=>{
 const roads=L.geoJSON(data,{pane:'cachedStreets',interactive:false,style:f=>({color:'#fff',weight:f.properties.class.includes('Arterial')?5:2.5,opacity:1})}).addTo(fallbackBase);roads.bringToBack();
 const labelled=new Set(),names=new Set(city.id==='seattle'?['Pike Street','Pine Street','Broadway','4th Avenue','Denny Way','Madison Street','University Way Northeast']:['University Ave','Queen St W','Queen St E','College St','King St W','King St E','Yonge St','Spadina Ave','Dundas St W','Bay St']);
 for(const f of data.features){const n=f.properties.name;if(!names.has(n)||labelled.has(n))continue;const c=f.geometry.type==='MultiLineString'?f.geometry.coordinates[0]:f.geometry.coordinates,p=c[Math.floor(c.length/2)];if(p&&p[0]>west&&p[0]<east&&p[1]>south&&p[1]<north){labelled.add(n);L.marker([p[1],p[0]],{pane:'cachedStreets',interactive:false,keyboard:false,icon:L.divIcon({className:'street-label',html:esc(n),iconSize:[100,12]})}).addTo(fallbackBase);}}
}).catch(()=>toast('Street background unavailable. Resource positions and routes remain visible.'));
 return cachedStreetsPromise;
}
// Build the large offline street layer only if the online basemap is delayed or unavailable.
setTimeout(()=>{if(!vectorReady)loadCachedStreets();},1200);
let initialStateRequest=window.ARC_INITIAL_STATE;
async function api(path,body){const url=new URL(path,window.location.origin);url.searchParams.set('city',city.id);const res=await fetch(url,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw Error(data.error||'Service unavailable');return data;}
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',5000);}
function log(text){activities.unshift({text,at:new Date().toISOString()});if(activities.length>7)activities.pop();renderActivity();}
function renderActivity(){const combined=[...activities,...(state?.agent?.events||[]).map(e=>({text:(e.incident_id?e.incident_id+' · ':'')+e.text,at:e.at}))].sort((a,b)=>b.at.localeCompare(a.at));const rows=combined.length?combined:state?.assignments?.slice(-4).reverse().map(a=>({text:a.incident_id+' · assignment reserved',at:a.at}))||[];$('#activity').innerHTML=rows.length?rows.slice(0,4).map(a=>`<p><time>${esc(new Date(a.at).toLocaleTimeString('en-CA',{timeZone:city.timezone,hour:'2-digit',minute:'2-digit'}))}</time> &nbsp; ${esc(a.text)}</p>`).join(''):'<p>No activity this session.</p>';}
async function load(){
 const seq=++loadSequence;
 try{
  const prefetched=initialStateRequest;initialStateRequest=null;
  const next=(prefetched?await prefetched:null)||await api('/api/state');if(seq!==loadSequence)return;
  if(lastEpoch&&lastEpoch!==next.epoch){records.clear();errors.clear();intakeDrafts.clear();intakeOwner='';pickingPickup=null;pickupDraftLayer.clearLayers();recRenderKey='';mapRenderKey='';}
  lastEpoch=next.epoch;state=next;
  if(!state.incidents.some(i=>i.id===selected))selected=sortedIncidents(state.incidents).find(i=>i.status==='open')?.id||state.incidents[0].id;
  renderState();
  const target=selected,latest=await api('/api/recommendations/'+target);if(seq!==loadSequence)return;
  if(latest&&latest.simulation_epoch===state.epoch)records.set(target,latest);else records.delete(target);
  $('#system-status').textContent='Workspace connected';$('#system-status').classList.remove('offline');
  renderState();
  if(!activeJob){const running=state.assessments?.[0];if(running)watchJob(running);}
 }catch(e){if(seq!==loadSequence)return;$('#system-status').textContent='Workspace unavailable';$('#system-status').classList.add('offline');$('#workspace-status').textContent='Connection lost. The displayed picture may be out of date; approvals are unavailable.';$('#workspace-status').classList.add('attention');$('#analyze').disabled=true;$('#approve')?.setAttribute('disabled','');}
}
function caseStatus(proposal,incidentId=selected){return proposalState(proposal,state.version,Date.now(),state.incidents.find(i=>i.id===incidentId));}
function hasPickup(i){return Boolean(i)&&i.lat!==null&&i.lat!==undefined&&i.lon!==null&&i.lon!==undefined&&Number.isFinite(Number(i.lat))&&Number.isFinite(Number(i.lon));}
function visibleIncidents(){const scope=$('#queue-source').value;return sortedIncidents(state.incidents.filter(i=>scope==='all'||scope==='public'&&i.public_source||scope==='workspace'&&!i.public_source||scope==='prepared'&&i.prepared_intake||i.public_kind===scope));}
function queueLabel(i){
 if(i.agent_state)return [({awaiting_approval:'Awaiting your approval',working:'Agent assessing…',queued:'Queued for assessment',needs_input:'Needs your input',waiting:'Waiting · ARC is monitoring',watching:'Feed review',reserved:'Assignment reserved'})[i.agent_state]||'Needs input',['needs_input','waiting'].includes(i.agent_state)?'attention':i.agent_state==='reserved'?'assigned':''];
 if(i.status!=='open')return ['Plan reserved','assigned'];
 if(i.public_feed_status==='stale')return ['Public feed stale','attention'];
 if(i.public_feed_status==='missing')return ['No longer in feed · review','attention'];
 if(i.assessment_blockers?.length)return [i.source_review_required?'Source changed · review details':'Complete incident details','attention'];
 const j=activeJob?.incident_id===i.id?activeJob:state.assessments?.find(j=>j.incident_id===i.id);
 if(j)return ['Assessment running',''];
 if(errors.has(i.id))return ['Assessment needs attention','attention'];
 const status=caseStatus(state.proposals?.[i.id],i.id);
 return ({ready:['Proposal ready',''],changed:['Conditions changed','attention'],expired:['Evidence expired','attention'],blocked:['No feasible plan','attention'],rejected:['Proposal rejected',''],unassessed:['Awaiting assessment','']})[status]||['Awaiting assessment',''];
}
function renderQueue(){
 const groupOrder=['approval','working','input','watching','reserved'],groupNames={approval:'Awaiting your approval',working:'Agent working',input:'Needs your input',watching:'Public feed history',reserved:'Reserved'};
 const scoped=visibleIncidents();
 document.querySelectorAll('[data-queue-bucket]').forEach(b=>{b.querySelector('b').textContent=scoped.filter(i=>workflowBucket(i)===b.dataset.queueBucket).length;b.setAttribute('aria-pressed',String(queueStage===b.dataset.queueBucket));});
 const visible=scoped.filter(i=>queueStage==='all'||workflowBucket(i)===queueStage),rows=groupOrder.flatMap(group=>visible.filter(i=>workflowBucket(i)===group));
 const expanded=new Map([...document.querySelectorAll('#incidents details')].map(d=>[d.dataset.queueGroup,d.open]));
 $('#incident-count').textContent=rows.length;
 $('#queue-feed-status').textContent=(city.id==='seattle'?['fire']:['fire','police']).map(k=>{const f=state.public_context?.[k];return (k==='fire'?'Fire':'Police')+': '+(!f?'connecting':f.stale?'stale':f.mode==='live'?'connected':'unavailable');}).join(' · ');
 const focus=document.activeElement?.dataset?.incident;
 let html='',previousGroup=null;
 for(const i of rows){const group=workflowBucket(i);if(group!==previousGroup){if(previousGroup)html+='</div></details>';const members=rows.filter(x=>workflowBucket(x)===group),open=queueStage===group||members.some(x=>x.id===selected)||(expanded.get(group)??['approval','working'].includes(group));html+=`<details class="queue-group" data-queue-group="${group}" ${open?'open':''}><summary>${groupNames[group]} <span>${members.length}</span></summary><div class="queue-group-items">`;previousGroup=group;}const [label,kind]=queueLabel(i);const since=i.public_source?i.public_observed_at:(i.received_at||state.epoch);
  html+=`<button class="incident-card ${selected===i.id?'selected':''}" data-incident="${esc(i.id)}" aria-pressed="${selected===i.id}"><div class="incident-top"><span>${esc(i.public_key||i.id)}</span><span class="priority ${i.priority==='Priority 1'&&i.status==='open'?'urgent':''}">${esc(i.status==='open'?(i.priority||'Needs triage'):'Reserved')}</span></div>${i.prepared_intake?'<span class="incident-category">Prepared intake</span>':i.public_source?`<span class="incident-category">${esc(i.public_call_type||'Public call')}</span>`:''}<strong>${esc(i.name)}</strong><div class="incident-meta"><span>${esc(i.public_kind==='fire'?'Fire':i.public_kind==='police'?'Police':i.service+' service')}</span>${i.status==='open'?`<span>${i.public_source?'Reported':'Waiting'} <span data-wait-since="${esc(since)}">${durationLabel(elapsedSeconds(since))}</span></span>`:''}</div><span class="queue-state ${kind}">${esc(label)}</span></button>`;
 }
 if(previousGroup)html+='</div></details>';
 $('#incidents').innerHTML=html||'<p class="public-notice">No calls in this view. Public feed status is shown above.</p>';
 document.querySelectorAll('[data-incident]').forEach(b=>{b.onclick=()=>selectIncident(b.dataset.incident);b.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const index=rows.findIndex(i=>i.id===b.dataset.incident),next=rows[(index+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length];selectIncident(next.id);document.querySelector(`[data-incident="${next.id}"]`)?.focus();}};});
 if(focus)document.querySelector(`[data-incident="${focus}"]`)?.focus({preventScroll:true});
}
async function selectIncident(id){pickingPickup=null;pickupDraftLayer.clearLayers();$('#map').classList.remove('choosing-pickup');scrollPositions.set(selected,$('.case-panel').scrollTop);selected=id;sessionStorage.setItem(storageKey('arc.selected'),id);recRenderKey='';renderState();$('.case-panel').scrollTop=scrollPositions.get(id)||0;await load();}
function proposedUnits(){return new Set(Object.entries(state.proposals||{}).filter(([iid,p])=>p.decision==='pending'&&p.approvable&&p.version===state.version&&state.agent?.states?.[iid]?.state==='awaiting_approval').map(([,p])=>p.ambulance_id).filter(Boolean));}
function renderResources(){
 const proposed=proposedUnits();const key=JSON.stringify([state.fleet,state.hospitals,[...proposed]]);if(key===resourceKey)return;resourceKey=key;
 const available=state.fleet.filter(a=>a.status==='available'&&!proposed.has(a.id)).length;$('#fleet-count').textContent=available+' free'+(proposed.size?' · '+proposed.size+' proposed':'');
 $('#fleet').innerHTML=state.fleet.map(a=>`<div class="resource-row"><div><strong>${esc(a.name)}</strong><small>${esc(a.equipment.replaceAll(',',' · '))}</small></div><span class="status ${proposed.has(a.id)&&a.status==='available'?'proposed':esc(a.status)}">${esc(a.status==='assigned'?'reserved':proposed.has(a.id)?'proposed':a.status)}</span></div>`).join('');
 $('#hospitals').innerHTML=state.hospitals.map(h=>`<div class="resource-row"><div><strong>${esc(h.name)}</strong><small>${esc(h.capabilities.replaceAll(',',' · '))}</small></div><span class="status ${h.accepting&&h.slots>0?'':'closed'}">${h.accepting&&h.slots>0?h.slots+' '+(h.slots===1?'slot':'slots'):'Unavailable'}</span></div>`).join('');
}
function renderState(){
 if(!state)return;rec=records.get(selected)||null;const i=state.incidents.find(i=>i.id===selected),status=caseStatus(rec);
 renderQueue();renderResources();renderActivity();renderPublic();renderIntake(i);renderAgent();
 const nextHeading=JSON.stringify([i.id,i.status,i.name,i.priority,i.service,i.equipment,i.incident_revision]);if(nextHeading!==headingKey){headingKey=nextHeading;$('#selected-incident').innerHTML=`<div><span class="case-id">${esc(i.id)} <span class="priority ${i.priority==='Priority 1'?'urgent':''}">${esc(i.priority||'Needs triage')}</span></span><h2>${esc(i.name)}</h2><p>${i.prepared_intake?'Prepared intake · '+esc(i.service)+' service · '+esc(i.equipment)+' equipment':i.public_source?esc(i.public_call_type||'Public call')+' · '+esc(i.public_source):esc(i.service)+' service required · '+esc(i.equipment)+' equipment'}</p></div>`;}
 renderWorkflow(i,status);
 const approvals=state.incidents.filter(i=>i.agent_state==='awaiting_approval').length,working=state.incidents.filter(i=>['working','queued'].includes(i.agent_state)).length,inputs=state.incidents.filter(i=>['needs_input','waiting'].includes(i.agent_state)).length,units=state.fleet.filter(a=>a.status==='available'&&!proposedUnits().has(a.id)).length;
 $('#workspace-status').textContent=`${approvals} awaiting approval · ${working} with ARC · ${inputs} need input or resources · ${units} units free`;
 $('#workspace-status').classList.toggle('attention',Boolean(state.feed_stale||state.zetaris_offline||state.ai_offline));
 const activeHere=activeJob&&belongsToSelection(activeJob,selected,state.epoch);
 $('#analyze').hidden=i.status!=='open'||Boolean(i.assessment_blockers?.length)||['working','queued'].includes(i.agent_state);
 $('#manual-assessment').hidden=$('#analyze').hidden;
 if(i.agent_state==='needs_input'&&!i.assessment_blockers?.length)$('#manual-assessment').open=true;$('#request-area').hidden=i.status!=='open';
 $('#analyze').disabled=Boolean(activeJob)||i.status!=='open'||Boolean(i.assessment_blockers?.length);$('#analyze').classList.add('secondary-action');
 $('#analyze').textContent=activeJob?'Another assessment is running':i.agent_state==='needs_input'?'Retry assessment':'Reassess now';
 $('#plan-heading').textContent=i.status!=='open'?'Reserved assignment':status==='incomplete'?'Input needed':status==='ready'?'Approve this plan':i.agent_state==='working'?'ARC is assessing':'Response plan';
 $('.decision-panel').dataset.state=status;
 $('#decision-status').textContent=({ready:'Ready for review',changed:'Review required',expired:'Evidence expired',approved:'Reserved',rejected:'Rejected',blocked:'Blocked',incomplete:'Details required'})[status]||'Awaiting assessment';
 const error=errors.get(selected),changed=status==='changed',expired=status==='expired';let alert='';
 if(i.assessment_blockers?.length&&i.status==='open')alert=i.assessment_blockers.join(' · ')+'.';
 else if(error)alert='Assessment unavailable. '+error;
 else if(['needs_input','waiting'].includes(i.agent_state))alert=i.agent_reason;
 else if(changed)alert=describeChange(rec)+' ARC will reassess before approval.';
 else if(expired)alert='Evidence expired. ARC will refresh it before approval.';
 else if(status==='blocked')alert='ARC is monitoring for a feasible plan.';
 $('#case-alert').hidden=!alert||(['needs_input','waiting','watching'].includes(i.agent_state)&&alert.replace(/\.$/,'')===(i.agent_reason||'').replace(/\.$/,''));if($('#case-alert').textContent!==alert)$('#case-alert').textContent=alert;$('#case-alert').classList.toggle('error',Boolean(error));
 $('#progress').innerHTML=activeHere?'<span class="spinner"></span>'+esc(friendlyStage(activeJob.stage)):'';
 $('#scenario-status').textContent=state.scenario==='baseline'?'Baseline scenario':state.scenario.replaceAll('-',' ');
 renderRec();renderMap();
}
function describeChange(r){
 const a=state.fleet.find(a=>a.id===r?.selected?.ambulance_id),h=state.hospitals.find(h=>h.id===r?.selected?.hospital_id);
 if(a&&a.status!=='available')return a.name+' is now '+a.status+'.';
 if(h&&(!h.accepting||h.slots<1))return h.name+' is no longer available to receive this transfer.';
 if(state.closures.length)return 'A road closure may affect this plan’s routes.';
 return 'The operational picture changed after this plan was assessed.';
}
function renderRec(){
 const status=caseStatus(rec),key=JSON.stringify([selected,rec?.id,rec?.decision,state.version,state.incidents.find(i=>i.id===selected)?.incident_revision,status,Boolean(activeJob)]);
 if(key===recRenderKey)return;recRenderKey=key;
 if(renderedIncident)detailStates.set(renderedIncident,new Set([...document.querySelectorAll('#recommendation details[open]')].map(d=>d.dataset.detail)));
 const opened=detailStates.get(selected)||new Set();renderedIncident=selected;
 if(!rec&&state.incidents.find(i=>i.id===selected)?.assessment_blockers?.length){$('#recommendation').innerHTML='';return;}
 if(!rec){const current=state.incidents.find(i=>i.id===selected);$('#recommendation').innerHTML=`<div class="empty-state"><h3>${current.agent_state==='working'?'Preparing your recommendation':current.agent_state==='queued'?'ARC will assess this incident':'Monitoring this incident'}</h3><p>${esc(current.agent_reason||'ARC checks resources and prepares a plan automatically.')}</p></div>`;return;}
 const sameCaseBusy=Boolean(activeJob&&!activeJob.automatic&&belongsToSelection(activeJob,selected,state.epoch));
 const p=rec.selected,i=state.incidents.find(i=>i.id===selected),byId=Object.fromEntries(rec.evidence.map(e=>[e.id,e]));
 const explanation=rec.explanation.evidence_ids.map(id=>byId[id]);
 let html='';
 if(p){const unit=rec.source_rows.fleet.find(a=>a.id===p.ambulance_id),hospital=rec.source_rows.hospitals.find(h=>h.id===p.hospital_id);
  html+=`<section class="plan-section"><div class="plan-label"><span>Response unit</span><span>${rec.decision==='approved'?'Reserved':status==='changed'||status==='expired'?'Last assessed':rec.selection_basis==='dispatcher'?'Dispatcher preference':'Proposed'}</span></div><div class="plan-main"><div><strong>${esc(unit.name)}</strong><p>${esc(i.equipment)} equipment</p></div><div class="eta"><strong>~${p.pickup_min}</strong><small>min to incident</small></div></div><p class="constraint-line">✓ ${esc(i.equipment)} equipment requirement met</p></section>`;
  html+=`<section class="plan-section transport-section"><div class="plan-label"><span>Receiving hospital</span><span>Destination preview</span></div><div class="plan-main"><div><strong>${esc(hospital.name)}</strong><p>${esc(i.service)} service · ${p.slots} slots at assessment</p></div><div class="eta"><strong>~${p.transport_min}</strong><small>min from incident</small></div></div><p class="plan-note">Driving estimate excludes time on scene and hospital handover.</p></section>`;
 }
 else html+='<div class="error-box"><strong>No feasible response plan</strong><br>Current availability, requirements, freshness or routes prevent a valid proposal.</div>';
 if(p&&rec.decision==='pending')html+=`<section class="agent-rationale" aria-label="Recommendation rationale"><h3>Why this plan</h3><p>${esc(operationalCopy(p.reasons?.[0]||'Eligible resources matched to this incident.').replace('Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.','Shortest combined driving time among eligible plans.'))}</p>${explanation.filter(e=>!e.text.startsWith('Estimated driving')).slice(0,1).map(e=>`<p class="rationale-evidence">${esc(operationalCopy(e.text))} <span class="evidence-ref">${esc(e.id)}</span></p>`).join('')}</section>`;
 if(rec.decision==='approved')html+='<p class="reservation-note">Unit and receiving slot reserved.</p>';
 else if(rec.decision==='rejected')html+='<div class="pending-box">Proposal rejected. No resources were reserved by this decision.</div>';
 if(rec.changes.length&&rec.decision==='pending'&&status==='ready')html+='<div class="change"><strong>Revised proposal</strong><br>'+esc(rec.changes.map(c=>humanChange(c.text)).join(' '))+'</div>';
 html+=`<div class="evidence-quality ${status==='expired'||status==='changed'?'stale':''}"><span>${rec.decision==='approved'?'Source evidence':status==='expired'?'Evidence expired':'Evidence age'}</span><span data-evidence-epoch="${rec.evidence_epoch||rec.created_epoch}">${durationLabel(Math.max(0,Math.floor(Date.now()/1000-(rec.evidence_epoch||rec.created_epoch))))} ago</span></div>`;
 if(status==='ready'&&p)html+=`<div class="decision-actions"><button id="approve" class="primary" ${sameCaseBusy?'disabled':''}>Approve assignment</button><button id="reject" ${sameCaseBusy?'disabled':''}>Reject</button></div><p class="approval-note">Reserves ${esc(p.ambulance_id)} and one receiving slot for ${esc(i.id)}.</p>`;
 const candidates=rec.alternatives.filter(a=>a.type==='assignment'&&a.eligible&&a.id!==p?.id).sort((a,b)=>a.pickup_min-b.pickup_min||a.transport_min-b.transport_min);
 if(candidates.length){html+=`<details class="review-details" data-detail="alternatives"><summary>${status==='ready'?'Compare '+candidates.length+' eligible alternatives':'Other plans at assessment'}</summary>`;for(const a of candidates){html+=`<div class="alternative-row"><strong>${esc(a.name)}</strong><div class="alternative-timing"><span>~${a.pickup_min} min response</span><span>~${a.transport_min} min transport</span></div>${status==='ready'?`<button data-alternative="${esc(a.id)}" ${activeJob?'disabled':''}>Assess this pair</button>`:''}</div>`;}html+='</details>';}
 html+=`<details class="review-details" data-detail="reasoning"><summary>Why this plan & what was excluded</summary><div class="explanation">`+explanation.map(e=>`<div class="evidence-item"><span class="eid">${esc(e.id)}</span><span>${esc(operationalCopy(e.text))}</span></div>`).join('');
 for(const a of rec.alternatives.filter(a=>!a.eligible))html+=`<div class="alternative-row"><strong>${esc(a.name)} · excluded</strong><p>${esc(operationalCopy(a.reasons.join(' ')))}</p></div>`;
 html+='</div></details>';
 html+=`<details class="review-details" data-detail="sources"><summary>Sources & decision history</summary><div class="source-strip">Routes: ${p?esc(p.transport_route.mode)+' '+esc(p.transport_route.source):'unavailable or ineligible'} · ${p?.transport_route.traffic_aware?'Traffic at assessment time':'Static estimates; no live traffic'}<br>Assessed ${esc(new Date(rec.created_at).toLocaleString('en-CA'))}</div>`+rec.changes.map(c=>`<div class="change">${esc(operationalCopy(c.text))}</div>`).join('')+`<ol class="trace">${rec.trace.map(t=>`<li><strong>${esc(t.tool)}</strong><br>${esc(operationalCopy(t.detail))}</li>`).join('')}</ol><div class="source-strip">${Object.entries(rec.source_rows).map(([name,rows])=>esc(name)+' · observed '+esc(rows[0]?.observed_at||'missing timestamp')).join('<br>')}</div></details>`;
 $('#recommendation').innerHTML=html;document.querySelectorAll('#recommendation details').forEach(d=>d.open=opened.has(d.dataset.detail));
 if($('#approve'))$('#approve').onclick=()=>decide('approve');if($('#reject'))$('#reject').onclick=()=>decide('reject');
 document.querySelectorAll('[data-alternative]').forEach(b=>b.onclick=()=>startAssessment(b.dataset.alternative));
}
function operationalCopy(text){return String(text).replace(/\bsimulated\s+/gi,'').replace(/\bsynthetic\s+/gi,'').replace(/\bpredefined\s+/gi,'required ');}
function humanChange(text){return operationalCopy(text).replace('accepting changed from 1 to 0.','no longer accepting transfers.').replace('accepting changed from 0 to 1.','accepting transfers again.').replace('status changed from available to busy.','unit is now busy.');}
function friendlyStage(stage=''){if(stage.includes('Planning'))return 'Reviewing the request…';if(stage.includes('Federating'))return 'Checking unit and hospital availability…';if(stage.includes('Calculating'))return 'Comparing eligible resources and routes…';if(stage.includes('Recalling'))return 'Checking what changed…';return 'Preparing the evidence explanation…';}
async function startAssessment(pairId=null){
 if(activeJob)return;const incidentId=selected;errors.delete(incidentId);
 try{const job=await api(pairId?'/api/alternative':'/api/agent/retry',pairId?{recommendation_id:rec.id,pair_id:pairId}:{incident_id:incidentId,request:$('#request').value});log(incidentId+' · assessment started');watchJob(job);}
 catch(e){errors.set(incidentId,e.message);renderState();}
}
async function watchJob(initial){
 if(activeJob)return;activeJob=initial;errors.delete(initial.incident_id);renderState();let job=initial;
 try{
  while(job.status==='running'){await new Promise(r=>setTimeout(r,850));job=await api('/api/jobs/'+job.id);activeJob=job;if(state&&belongsToSelection(job,selected,state.epoch))renderState();else renderQueue();}
  if(job.simulation_epoch!==state.epoch)return;
  if(job.status==='error')throw Error(job.error);
  records.set(job.incident_id,job.result);errors.delete(job.incident_id);
  if(!job.automatic)log(job.incident_id+' · '+(job.result.selected?'proposal ready':'no feasible plan'));
  if(selected!==job.incident_id&&(!job.automatic||job.trigger==='new incident'||job.result.changes?.some(c=>c.text.startsWith('Assignment revised')||c.text.startsWith('Route estimates changed'))))toast(job.incident_id+' · '+(job.result.approvable?'plan ready for approval':'assessment needs attention'));
 }catch(e){if(job.simulation_epoch===state.epoch&&!job.automatic){errors.set(job.incident_id,e.message);log(job.incident_id+' · assessment needs attention');}}
 finally{activeJob=null;await load();}
}
async function decide(action){const current=rec;$('#approve')?.setAttribute('disabled','');$('#reject')?.setAttribute('disabled','');try{const result=await api('/api/decision',{id:current.id,action});records.set(current.incident_id,result);log(current.incident_id+(action==='approve'?' · assignment reserved':' · proposal rejected'));await load();}catch(e){errors.set(current.incident_id,e.message);await load();}}
function marker(lat,lon,type,label,muted=false){return L.marker([lat,lon],{title:label,alt:label,icon:L.divIcon({className:'map-marker',html:`<div class="marker ${type} ${muted?'muted':''}">${type==='hospital'?'+':type==='ambulance'?'↗':'!'}</div>`,iconSize:[28,28],iconAnchor:[14,14]})}).bindTooltip(esc(label)).addTo(layers);}
function renderMap(){
 const currentIncident=state.incidents.find(i=>i.id===selected);
 const key=JSON.stringify([selected,rec?.id,state.version,currentIncident?.incident_revision,currentIncident?.lat,currentIncident?.lon,caseStatus(rec)]);if(key===mapRenderKey)return;const selectionChanged=!mapRenderKey||JSON.parse(mapRenderKey)[0]!==selected;mapRenderKey=key;layers.clearLayers();
 const p=rec?.selected,routeNeedsReview=rec?.decision==='pending'&&caseStatus(rec)!=='ready';
 state.hospitals.forEach(h=>marker(h.lat,h.lon,'hospital',h.name,!h.accepting||Boolean(p&&h.id!==p.hospital_id)));
 state.fleet.forEach(a=>marker(a.lat,a.lon,'ambulance',a.name+' · '+(a.status==='assigned'?'reserved':proposedUnits().has(a.id)?'proposed':a.status),Boolean(p&&a.id!==p.ambulance_id)));
 state.incidents.filter(i=>(i.status==='open'||i.id===selected)&&hasPickup(i)&&(i.service||i.id===selected)).forEach(i=>{const color=i.agent_state==='awaiting_approval'?'#28785c':i.agent_state==='working'?'#315fb6':'#9c7131';L.circleMarker([i.lat,i.lon],{radius:i.id===selected?10:7,color,weight:i.id===selected?3:2,fillColor:color,fillOpacity:i.id===selected?.85:.5}).bindTooltip(esc(i.name+' · '+queueLabel(i)[0])).on('click',()=>selectIncident(i.id)).addTo(layers);});
 state.closures.forEach(c=>L.circle([c.lat,c.lon],{radius:c.radius_m,color:'#ac694b',fillOpacity:.15,weight:2}).bindTooltip(esc(operationalCopy(c.name))).addTo(layers));
 if(p){for(const [route,color] of [[p.pickup_route,'#255bd6'],[p.transport_route,'#16786b']]){const points=route.coordinates.map(([x,y])=>[y,x]);L.polyline(points,{color:'#fff',weight:8,opacity:.95,interactive:false}).addTo(layers);L.polyline(points,{color:routeNeedsReview?'#9a783a':color,weight:4.5,dashArray:routeNeedsReview?'6 6':undefined,lineCap:'round'}).addTo(layers);}}
 $('.map-legend').innerHTML=routeNeedsReview?'<span><i class="legend-dot review"></i>Previous plan · review required</span>':'<span><i class="legend-dot ambulance"></i>Unit to incident</span><span><i class="legend-dot hospital"></i>Incident to hospital</span>';
 const trafficNote=!p?'No assessed route · traffic observations below':p.transport_route.traffic_aware?'Traffic at assessment time · ordinary driving':'Static driving estimates · live traffic not included';
 $('.map-disclosure').textContent=(routeNeedsReview?'Previous assessed routes · review required · ':'')+trafficNote;
 if(p?.transport_route.traffic_aware)map.attributionControl.addAttribution('© TomTom');
 if(!overviewInitialized){overviewInitialized=true;fitOverview();}
}
function fitOperationalMap(){if(!state)return;const i=state.incidents.find(i=>i.id===selected),p=rec?.selected;let points=hasPickup(i)?[[i.lat,i.lon]]:[];if(p)points=points.concat(p.pickup_route.coordinates.map(([x,y])=>[y,x]),p.transport_route.coordinates.map(([x,y])=>[y,x]));else points=points.concat(state.fleet.map(a=>[a.lat,a.lon]),state.hospitals.map(h=>[h.lat,h.lon]));map.invalidateSize();map.fitBounds(points,{padding:[30,30],maxZoom:15,animate:false});}
$('#analyze').onclick=()=>startAssessment();$('#fit-map').onclick=fitOperationalMap;
$('#open-scenarios').onclick=()=>$('#scenarios-modal').showModal();
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
document.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=async()=>{try{await api('/api/scenario',{name:b.dataset.scenario,incident_id:selected});log(selected+' · '+(b.querySelector('strong')?.textContent||b.textContent));$('#scenarios-modal').close();await load();}catch(e){toast(e.message);}});
$('#reset').onclick=async()=>{try{await api('/api/reset',{});records.clear();errors.clear();intakeDrafts.clear();intakeOwner='';activities.length=0;selected=city.id==='seattle'?'SEA-DEMO-101':'INC-1042';sessionStorage.setItem(storageKey('arc.selected'),selected);$('#scenarios-modal').close();log('Workspace reset');await load();}catch(e){toast(e.message);}};
$('#open-evidence').onclick=async()=>{$('#evidence-modal').showModal();$('#evidence-content').textContent='Loading integration evidence…';try{const world=await api('/api/world');const z=rec?.zetaris||state.integrations.zetaris;const n=rec?.ai;$('#evidence-content').innerHTML=`<div class="integration-block"><h3>Zetaris · ${z?'verified product query':'awaiting product assessment'}</h3><p>Three distinct REST sources combined by SQL.  The app does not substitute direct API reads when Zetaris fails.</p><pre>${esc(z?JSON.stringify(z,null,2):'Assess an incident first.')}</pre></div><div class="integration-block"><h3>Nightshift → NVIDIA Nemotron</h3><p>Primary AI provider. The model selects allowed evidence tools and composes explanations from verified evidence IDs. The exact evidence text is rendered by ARC to prevent invented measurements.</p><pre>${esc(n?JSON.stringify(n,null,2):'No completed AI assessment yet.')}</pre></div><div class="integration-block"><h3>Meterless World Model · actual upstream reference</h3><p>Persistent typed entities, provenance, recommendation relationships, historical resource comparisons. Upstream conformance: 8/8 checks. SQLite separately handles transactional simulation reservations.</p><pre>${esc(JSON.stringify({entities:world.entities.length,recent_events_returned:world.events.length,events:world.events.slice(-8)},null,2))}</pre></div><div class="integration-block"><h3>${esc(city.name)} road context · ${esc(state.public_roads.mode)}</h3><p>${esc(state.public_roads.note||state.public_roads.error||'Public point restrictions are contextual, not validated route closure geometry.')}</p><p>${esc(state.public_roads.fetched_at||'Not fetched')} · ${state.public_roads.records.length} records</p><button id="refresh-roads">Refresh public road context</button></div>`;$('#refresh-roads').onclick=async()=>{const b=$('#refresh-roads');b.disabled=true;b.textContent='Refreshing…';try{const r=await api('/api/roads/refresh',{});await load();toast('Public road context: '+r.mode+' · '+r.records.length+' records');$('#open-evidence').click();}catch(e){toast(e.message);}finally{b.disabled=false;}};}catch(e){$('#evidence-content').textContent=e.message;}};
$('#close-evidence').onclick=()=>$('#evidence-modal').close();$('#evidence-modal').onclick=e=>{if(e.target===$('#evidence-modal'))$('#evidence-modal').close();};
setInterval(()=>{
 $('#clock').textContent=new Date().toLocaleTimeString('en-CA',{timeZone:city.timezone,hour:'2-digit',minute:'2-digit'});
 document.querySelectorAll('[data-wait-since]').forEach(el=>el.textContent=durationLabel(elapsedSeconds(el.dataset.waitSince)));
 document.querySelectorAll('[data-evidence-epoch]').forEach(el=>el.textContent=durationLabel(Math.max(0,Math.floor(Date.now()/1000-Number(el.dataset.evidenceEpoch))))+' ago');
 if(state){const status=caseStatus(rec);if(status!==$('#decision-status').dataset.lastStatus){$('#decision-status').dataset.lastStatus=status;renderState();}}
},1000);
setInterval(load,5000);load();

function publicAge(value){const age=elapsedSeconds(value);return age===null?'source time unavailable':durationLabel(age)+' ago';}
function renderPublic(){
 const sources=state.public_context||{},kind=$('#public-kind').value,source=sources[kind]||{};
 const live=Object.values(sources).filter(s=>s.mode==='live'&&!s.stale).length;$('#public-summary').textContent=live+' feeds connected';
 const key=JSON.stringify([kind,selected,source.fetched_at,source.mode,source.stale,kind==='traffic'?sources.cameras?.fetched_at:null]);
 renderPublicMap(sources);if(key===publicRenderKey)return;publicRenderKey=key;
 const rows=source.records||[];
 const notices={fire:'Fire dispatch activity. Medical locations may be postal areas only. Listed units are fire resources; feed disappearance does not establish resolution.',police:'Public police calls near mapped intersections. Calls remain visible for four hours regardless of on-scene status. Medical-distress calls are excluded.',roads:'Published restrictions include partial and scheduled closures. Context only; these points do not automatically block routes or change travel estimates.',hospitals:'ER Watch public readings. Posted waits are not ambulance acceptance or available receiving slots. Missing or old readings are shown explicitly.',traffic:'Sampled speeds describe nearby segments. Route estimates identify whether traffic was included; neither includes emergency privileges or scene time.'};
 if(city.id==='seattle'){notices.fire='Seattle Fire/EMS calls reported in the last four hours. Published coordinates are approximate; the feed does not establish ongoing activity, medical priority or fleet availability. Requirements must be confirmed before assessment.';notices.hospitals='Seattle hospital receiving operations are exercise data. No live hospital waits or acceptance feed is connected.';}
 let html=`<p class="public-notice">${notices[kind]}</p><p class="public-freshness ${source.stale||source.mode!=='live'?'attention':''}">${source.mode==='live'?(source.stale?'Last retrieval is stale':'Connected'):source.mode==='cached'?'Cached · refresh failed':'Unavailable'}${source.fetched_at?' · retrieved '+esc(new Date(source.fetched_at).toLocaleTimeString('en-CA',{timeZone:city.timezone})):''}${source.observed_at?' · publisher updated '+esc(publicAge(source.observed_at)):''}${source.error?' · '+esc(source.error):''}</p><div class="public-list">`;
 let display=rows;
 if(kind==='police')display=[...rows].sort((a,b)=>String(b.observed_at).localeCompare(String(a.observed_at))).slice(0,30);
 if(kind==='roads'){const i=state.incidents.find(i=>i.id===selected);display=[...rows].sort((a,b)=>publicDistance(a,i)-publicDistance(b,i)).slice(0,20);}
 for(const r of display){
  html+=`<div class="public-row"><strong>${esc(r.name||r.id)}</strong>`;
  if(kind==='police'||kind==='fire')html+=`<p>${esc(r.location)} · ${esc(publicAge(r.observed_at))}${r.units?' · '+esc(r.units):''}</p>${(()=>{const queued=state.incidents.find(i=>i.public_source&&i.public_observed_at===r.observed_at&&i.public_location===r.location);return queued?`<button data-open-case="${esc(queued.id)}">Open queued call</button>`:'';})()}`;
  if(kind==='roads')html+=`<p>${esc(r.description)}</p><p>Source update: ${esc(r.updated_ms?new Date(Number(r.updated_ms)).toLocaleString('en-CA'):'unavailable')}</p>`;
  if(kind==='hospitals'){const seconds=elapsedSeconds(r.observed_at),fresh=seconds!==null&&seconds<=7200;html+=`<p>${r.wait_min!==null?esc(r.wait_min)+' min posted wait':'Wait unavailable'}${r.patients_waiting!=null?' · '+esc(r.patients_waiting)+' waiting':''}</p><p>${esc(publicAge(r.observed_at))}${!fresh?' · stale / unverified':''}</p>`;}
  if(kind==='traffic')html+=`<p>${esc(r.speed_kph)} km/h observed · ${esc(r.free_flow_kph)} km/h free flow · ${r.closed?'road closed':'no closure reported'} · confidence ${esc(r.confidence)}</p>`;
  html+='</div>';
 }
 if(!display.length)html+='<p class="public-notice">'+(source.mode==='live'?'No records returned by this source.':'Waiting for available source data.')+'</p>';
 html+='</div>';
 if(source.source_url)html+=`<p class="public-freshness"><a href="${esc(source.source_url)}" target="_blank" rel="noopener noreferrer">${kind==='hospitals'&&city.id==='toronto'?'ER Watch':kind==='traffic'?'TomTom Traffic':'Official source'}</a>${kind==='police'?' · Contains information licensed under the Open Government Licence – Ontario.':''}</p>`;
 if(kind==='traffic'&&city.id==='toronto'){
  const i=state.incidents.find(i=>i.id===selected),cameras=[...(sources.cameras?.records||[])].sort((a,b)=>publicDistance(a,i)-publicDistance(b,i)).slice(0,3);
  html+='<p class="public-notice">City traffic cameras · on-demand snapshots. Image capture time is not supplied; a retrieved image may be old.</p>';
  for(const c of cameras)html+=`<details class="public-camera"><summary>Camera ${esc(c.id)} · ${esc(c.name)}</summary><button data-camera="${esc(c.id)}">Load camera snapshot</button><div id="camera-${esc(c.id)}"></div></details>`;
 }
 $('#public-content').innerHTML=html;
 document.querySelectorAll('[data-open-case]').forEach(b=>b.onclick=()=>selectIncident(b.dataset.openCase));
 document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{const box=document.getElementById('camera-'+b.dataset.camera),img=new Image();img.alt=city.name+' traffic camera snapshot';img.className='camera-image';img.onload=()=>{box.replaceChildren(img);b.textContent='Refresh snapshot';};img.onerror=()=>{box.textContent='Camera image unavailable.';};img.src='/api/cameras/'+encodeURIComponent(b.dataset.camera)+'?city='+city.id+'&t='+Date.now();});
}
function publicDistance(a,b){return Number.isFinite(Number(a.lat))&&Number.isFinite(Number(a.lon))?Math.hypot((Number(a.lat)-b.lat)*111,(Number(a.lon)-b.lon)*80):Infinity;}
function renderPublicMap(sources){
 const calls=$('#show-public-calls').checked,roads=$('#show-public-roads').checked;
 const key=JSON.stringify([selected,calls,roads,['fire','police','roads','traffic'].map(k=>[sources[k]?.fetched_at,sources[k]?.stale])]);if(key===publicMapKey)return;publicMapKey=key;publicLayers.clearLayers();
 if(calls)for(const r of [...(sources.police?.records||[]),...(city.id==='seattle'?sources.fire?.records||[]:[])].filter(hasPickup))L.circleMarker([r.lat,r.lon],{radius:4,color:'#66718a',weight:1,fillOpacity:.5}).bindTooltip(esc(((sources[city.id==='seattle'?'fire':'police']?.stale?'Cached call · ':'Public call · '))+r.name+' · '+r.location)).addTo(publicLayers);
 if(roads)for(const r of [...(sources.roads?.records||[])].sort((a,b)=>publicDistance(a,state.incidents.find(i=>i.id===selected))-publicDistance(b,state.incidents.find(i=>i.id===selected))).slice(0,100))if(r.lat&&r.lon)L.circleMarker([r.lat,r.lon],{radius:4,color:'#a4762f',weight:1,fillOpacity:.5}).bindTooltip(esc('Restriction · '+r.name)).addTo(publicLayers);
 const traffic=sources.traffic;if(traffic?.mode==='live'&&!traffic.stale&&traffic.records?.length)map.attributionControl.addAttribution('© TomTom');if(traffic?.mode==='live'&&!traffic.stale)for(const r of traffic.records||[])L.polyline(r.coordinates.map(c=>[c.latitude,c.longitude]),{color:r.closed?'#a33f39':r.speed_kph<r.free_flow_kph*.5?'#c07928':'#39816e',weight:5,opacity:.65}).bindTooltip(esc(r.speed_kph+' km/h observed · '+r.name)).addTo(publicLayers);
}
$('#public-kind').onchange=()=>{publicRenderKey='';renderPublic();};
$('#show-public-calls').onchange=()=>renderPublicMap(state.public_context||{});$('#show-public-roads').onchange=()=>renderPublicMap(state.public_context||{});

function renderIntake(i){
 const panel=$('#incident-intake'),form=$('#incident-intake-form');
 if(intakeOwner&&intakeOwner!==i.id){intakeDrafts.set(intakeOwner,{...Object.fromEntries(new FormData(form)),revision:form.dataset.revision,open:panel.open});intakeOwner='';}
 panel.hidden=(!i.public_source&&!i.prepared_intake)||i.status!=='open';if(panel.hidden)return;
 const anchor=i.assessment_blockers?.length?$('.decision-heading'):$('#recommendation');if(anchor.nextElementSibling!==panel)anchor.after(panel);
 $('#intake-summary').textContent=i.assessment_blockers?.length?' · review required':' · ready';
 $('#intake-source').textContent=i.prepared_intake?'Prepared demo profile. Priority, requirements and pickup are supplied for this exercise.'+(i.public_reference?' Public reference: '+(i.public_reference.public_call_type||'call')+' · '+(i.public_reference.public_location||'location unavailable')+'.':''):'Published: '+(i.public_call_type||'Call')+' · '+(i.public_location||'Location unavailable')+' · '+publicAge(i.public_observed_at)+'. '+(i.public_kind==='fire'?'Published fire units: '+(i.public_units||'not supplied')+' · alarm level '+(i.public_alarm_level??'not supplied')+'. ':'')+(i.pickup_source==='dispatcher'?'Pickup entered by dispatcher.':hasPickup(i)?'Approximate public intersection.':'Exact pickup not published.');
 if(intakeOwner===i.id)return;intakeOwner=i.id;const draft=intakeDrafts.get(i.id);form.dataset.revision=draft?.revision??i.incident_revision??0;form.reset();
 for(const field of ['priority','service','equipment','lat','lon','notes'])form.elements[field].value=draft?.[field]??i[field]??'';
 form.elements.pickup_label.value=draft?.pickup_label??i.pickup_label??i.name??'';$('#intake-error').textContent='';$('#reload-intake').hidden=true;panel.open=draft?.open??Boolean(i.assessment_blockers?.length);
}
$('#queue-source').value=sessionStorage.getItem(storageKey('arc.queueSource'))||'all';
if(city.id==='seattle'&&$('#queue-source').value==='police')$('#queue-source').value='all';
$('#queue-source').onchange=()=>{sessionStorage.setItem(storageKey('arc.queueSource'),$('#queue-source').value);renderQueue();};
$('#pick-pickup').onclick=()=>{
 pickingPickup=selected;
 const container=$('#map');
 container.classList.add('choosing-pickup');
 $('#pickup-help').textContent='Click the pickup position on the map, then save the details to confirm it.';
 // Picking should preserve the dispatcher’s view, not refit and fetch a new background.
 container.scrollIntoView({block:'nearest',behavior:'instant'});
 requestAnimationFrame(()=>map.invalidateSize({pan:false}));
};
map.on('click',e=>{if(pickingPickup!==selected)return;if(e.latlng.lat<=south||e.latlng.lat>=north||e.latlng.lng<=west||e.latlng.lng>=east){toast('Choose a pickup within '+city.name+' coverage.');return;}const form=$('#incident-intake-form');form.elements.lat.value=e.latlng.lat.toFixed(6);form.elements.lon.value=e.latlng.lng.toFixed(6);pickingPickup=null;pickupDraftLayer.clearLayers();L.circleMarker([e.latlng.lat,e.latlng.lng],{radius:7,color:'#3974cc',fillOpacity:.4}).bindTooltip('Unsaved pickup',{permanent:true}).addTo(pickupDraftLayer);$('#map').classList.remove('choosing-pickup');$('#pickup-help').textContent='Pickup point selected. Save the details to confirm it.';toast('Pickup point selected; save incident details to confirm.');});
$('#incident-intake-form').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('[type="submit"]');b.disabled=true;try{const values=Object.fromEntries(new FormData(form));await api('/api/incidents/details',{...values,incident_id:selected,revision:Number(form.dataset.revision)});pickupDraftLayer.clearLayers();intakeDrafts.delete(selected);intakeOwner='';errors.delete(selected);await load();log(selected+' · dispatcher details saved');toast('Incident details saved.');}catch(error){$('#intake-error').textContent=error.message;$('#reload-intake').hidden=false;await load();}finally{b.disabled=false;}};

$('#reload-intake').onclick=()=>{intakeDrafts.delete(selected);intakeOwner='';renderIntake(state.incidents.find(i=>i.id===selected));};

function renderWorkflow(i,status){
 const titles={awaiting_approval:'Your approval is needed',working:'ARC is working',queued:'Queued with ARC',needs_input:'Your input is needed',waiting:'ARC is watching for a change',watching:'Public feed history',reserved:'Assignment reserved'};
 const title=titles[i.agent_state]||'ARC is monitoring';
 const description=i.agent_state==='working'?friendlyStage(i.agent_reason):i.agent_reason;
 const html=`<strong>${esc(title)}</strong><p>${esc(description||'')}</p>`;
 if($('#case-guidance').innerHTML!==html)$('#case-guidance').innerHTML=html;
 $('#case-guidance').classList.toggle('is-complete',i.agent_state==='reserved');
}
function renderAgent(){
 const agent=state.agent||{},running=state.assessments?.[0];
 $('#agent-status').textContent=agent.enabled?(running?'ARC is assessing':'ARC is monitoring'):'ARC is paused';
 $('#agent-detail').textContent=agent.error||(running?running.incident_id+' · '+friendlyStage(running.stage):agent.enabled?'New incidents and changed conditions are checked automatically.':'Existing proposals remain available; resume to continue automatic work.');
 $('#agent-toggle').textContent=agent.enabled?'Pause agent':'Resume agent';
 const unmapped=state.incidents.filter(i=>i.status==='open'&&i.agent_state!=='watching'&&!hasPickup(i)).length;$('#map-unmapped').textContent=unmapped?unmapped+' calls need a pickup location':'';
 $('.agent-orb').classList.toggle('running',Boolean(running));
}
function fitOverview(){if(!state)return;const points=[...state.fleet,...state.hospitals,...state.incidents.filter(i=>i.status==='open'&&i.service&&hasPickup(i))].filter(hasPickup).map(i=>[i.lat,i.lon]);if(points.length){map.invalidateSize();map.fitBounds(points,{padding:[35,35],maxZoom:14,animate:false});}}
$('#fit-overview').onclick=fitOverview;
$('#agent-toggle').onclick=async()=>{try{await api('/api/agent/control',{enabled:!state.agent.enabled});await load();}catch(e){toast(e.message);}};
$('#load-demo-intake').onclick=async()=>{try{const r=await api('/api/demo/intake',{});toast(r.loaded?'Prepared intake loaded. ARC will assess automatically.':'Prepared intake is already loaded.');await load();}catch(e){toast(e.message);}};
new ResizeObserver(()=>map.invalidateSize()).observe($('#map'));

document.querySelectorAll('[data-queue-bucket]').forEach(b=>b.onclick=()=>{queueStage=queueStage===b.dataset.queueBucket?'all':b.dataset.queueBucket;renderQueue();document.querySelector(`[data-incident="${selected}"]`)?.scrollIntoView({block:'nearest'});});
