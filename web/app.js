import {elapsedSeconds,durationLabel,sortedIncidents,proposalState,belongsToSelection,nextAction,inboxGroup,caseQuestion,defaultInboxSelection} from './dispatch-model.mjs';
const $=s=>document.querySelector(s);
const city=window.ARC_CITY;
const storageKey=key=>city.id==='toronto'?key:key+'.'+city.id;
$('#clock').title=city.name+' local time ('+city.timezone+')';
$('#city-selector').value=city.id;
$('.brand').href='/?city='+city.id;
$('#city-selector').onchange=e=>{window.location.href='/?city='+encodeURIComponent(e.target.value);};
if(city.id==='toronto'){
 const option=document.createElement('option');option.value='stations';option.textContent='Ambulance stations';$('#public-kind').append(option);
 const note=document.createElement('p');note.className='station-source-note';note.textContent='Station-based positions use official Toronto geography. Unit staging and availability remain scenario data; this is not live vehicle tracking.';
 $('#resources-modal .resource-dock').before(note);
}
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
let renderedIncident=null,resourceKey='',headingKey='',queueStage='all',overviewInitialized=false,firstInboxView=true;
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
 const seq=++loadSequence,initialLoad=firstInboxView;
 try{
  const prefetched=initialStateRequest;initialStateRequest=null;
  const next=(prefetched?await prefetched:null)||await api('/api/state');if(seq!==loadSequence)return;
  if(lastEpoch&&lastEpoch!==next.epoch){records.clear();errors.clear();intakeDrafts.clear();intakeOwner='';pickingPickup=null;pickupDraftLayer.clearLayers();recRenderKey='';mapRenderKey='';}
  lastEpoch=next.epoch;state=next;
  if(firstInboxView||!state.incidents.some(i=>i.id===selected))selected=defaultInboxSelection(state.incidents,selected);firstInboxView=false;
  renderState();
  const target=selected,latest=await api('/api/recommendations/'+target);if(seq!==loadSequence)return;
  if(latest&&latest.simulation_epoch===state.epoch)records.set(target,latest);else records.delete(target);
  $('#system-status').textContent='Workspace connected';$('#system-status').classList.remove('offline');
  renderState();if(initialLoad&&rec?.selected)fitOperationalMap();
  if(!activeJob){const running=state.assessments?.[0];if(running)watchJob(running);}
 }catch(e){if(seq!==loadSequence)return;$('#system-status').textContent='Workspace unavailable';$('#system-status').classList.add('offline');$('#workspace-status').textContent='Connection lost. The displayed picture may be out of date; approvals are unavailable.';$('#workspace-status').classList.add('attention');$('#analyze').disabled=true;$('#approve')?.setAttribute('disabled','');}
}
function caseStatus(proposal,incidentId=selected){return proposalState(proposal,state.version,Date.now(),state.incidents.find(i=>i.id===incidentId));}
function hasPickup(i){return Boolean(i)&&i.lat!==null&&i.lat!==undefined&&i.lon!==null&&i.lon!==undefined&&Number.isFinite(Number(i.lat))&&Number.isFinite(Number(i.lon));}
function visibleIncidents(){
 const scope=$('#queue-source').value,reportsView=['reports','history'].includes(queueStage);
 return sortedIncidents(state.incidents.filter(i=>!reportsView||scope==='all'||scope==='public'&&i.public_source||scope==='workspace'&&!i.public_source||scope==='prepared'&&i.prepared_intake||i.public_kind===scope));
}
function queueLabel(i){
 const group=inboxGroup(i);
 if(group==='reports')return ['Confirm response requirements',''];
 if(group==='history')return ['Earlier public report',''];
 if(group==='reserved')return ['View approved plan','assigned'];
 if(group==='approval')return ['Review ARC’s plan',''];
 if(group==='input')return [caseQuestion(i).title,'attention'];
 if(i.agent_state==='waiting')return [i.agent_reason?.includes('receiving')?'Waiting for a receiving facility':i.agent_reason?.includes('unit')?'Waiting for a unit':i.agent_reason?.includes('paused')?'ARC is paused':'ARC is monitoring availability',''];
 return [i.agent_state==='working'?'ARC is checking this call':'ARC will prepare a plan',''];
}
function renderQueue(){
 const groupOrder=['approval','input','working','reserved','reports','history'];
 const groupNames={approval:'Review plans',input:'Questions for you',working:'With ARC',reserved:'Active assignments',reports:'Public reports',history:'Earlier public reports'};
 const all=state.incidents,reportsView=['reports','history'].includes(queueStage),scoped=visibleIncidents();
 document.querySelectorAll('[data-queue-bucket]').forEach(b=>{b.querySelector('b').textContent=all.filter(i=>inboxGroup(i)===b.dataset.queueBucket).length;b.setAttribute('aria-pressed',String(queueStage===b.dataset.queueBucket));});
 const visible=scoped.filter(i=>queueStage==='all'?!['reports','history'].includes(inboxGroup(i)):inboxGroup(i)===queueStage),rows=groupOrder.flatMap(group=>visible.filter(i=>inboxGroup(i)===group));
 const expanded=new Map([...document.querySelectorAll('#incidents details')].map(d=>[d.dataset.queueGroup,d.open]));
 $('#incident-count').textContent=rows.length;
 $('.queue-filter').hidden=!reportsView;
 $('#queue-feed-status').hidden=!reportsView;
 $('#inbox-note').textContent=reportsView?'Public reports need confirmed response requirements before ARC can plan. They may already be handled by the reporting agency.':all.some(i=>['approval','input'].includes(inboxGroup(i)))?'Review a plan or answer a question. ARC follows up on the other cases.':'ARC is following your cases. Public reports are available separately.';
 $('#queue-feed-status').textContent=(city.id==='seattle'?['fire']:['fire','police']).map(k=>{const f=state.public_context?.[k];return (k==='fire'?'Fire':'Police')+': '+(!f?'connecting':f.stale?'stale':f.mode==='live'?'connected':'unavailable');}).join(' · ');
 const focus=document.activeElement?.dataset?.incident;
 let html='',previousGroup=null;
 for(const i of rows){
  const group=inboxGroup(i);
  if(group!==previousGroup){if(previousGroup)html+='</div></details>';const members=rows.filter(x=>inboxGroup(x)===group),open=queueStage===group||members.some(x=>x.id===selected)||(expanded.get(group)??['approval','input','working'].includes(group));html+=`<details class="queue-group" data-queue-group="${group}" ${open?'open':''}><summary>${groupNames[group]} <span>${members.length}</span></summary><div class="queue-group-items">`;previousGroup=group;}
  const [label,kind]=queueLabel(i),since=i.public_source?i.public_observed_at:(i.received_at||state.epoch);
  html+=`<button class="incident-card ${selected===i.id?'selected':''}" data-incident="${esc(i.id)}" aria-pressed="${selected===i.id}"><div class="incident-top"><span class="priority ${i.priority==='Priority 1'&&i.status==='open'?'urgent':''}">${esc(i.status==='open'?(i.priority||i.public_call_type||'Public report'):'Approved')}</span>${i.status==='open'?`<span data-wait-since="${esc(since)}">${durationLabel(elapsedSeconds(since))}</span>`:''}</div><strong>${esc(i.name)}</strong><span class="queue-state ${kind}">${esc(label)}</span></button>`;
 }
 if(previousGroup)html+='</div></details>';
 $('#incidents').innerHTML=html||`<div class="inbox-empty"><strong>${queueStage==='input'?'No questions for you':queueStage==='approval'?'No plans waiting for review':'Nothing in this view'}</strong><p>${reportsView?'Try another source or view current public reports.':'ARC will bring the next decision here.'}</p></div>`;
 document.querySelectorAll('[data-incident]').forEach(b=>{b.onclick=()=>selectIncident(b.dataset.incident);b.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const index=rows.findIndex(i=>i.id===b.dataset.incident),next=rows[(index+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length];selectIncident(next.id);document.querySelector(`[data-incident="${next.id}"]`)?.focus();}};});
 if(focus)document.querySelector(`[data-incident="${focus}"]`)?.focus({preventScroll:true});
}
async function selectIncident(id){pickingPickup=null;pickupDraftLayer.clearLayers();$('#map').classList.remove('choosing-pickup');scrollPositions.set(selected,$('.case-panel').scrollTop);selected=id;const group=inboxGroup(state.incidents.find(i=>i.id===id));if(['reports','history'].includes(group))queueStage=group;sessionStorage.setItem(storageKey('arc.selected'),id);recRenderKey='';renderState();$('.case-panel').scrollTop=scrollPositions.get(id)||0;await load();if(selected===id)fitOperationalMap();}
function proposedUnits(){return new Set(Object.entries(state.proposals||{}).filter(([iid,p])=>p.decision==='pending'&&p.approvable&&p.version===state.version&&state.agent?.states?.[iid]?.state==='awaiting_approval').map(([,p])=>p.ambulance_id).filter(Boolean));}
function renderResources(){
 const proposed=proposedUnits();const key=JSON.stringify([state.fleet,state.hospitals,[...proposed]]);if(key===resourceKey)return;resourceKey=key;
 const available=state.fleet.filter(a=>a.status==='available'&&!proposed.has(a.id)).length;const unavailable=state.hospitals.filter(h=>!h.accepting||h.slots<1).length;
 $('#resource-summary').textContent=available+' '+(available===1?'unit':'units')+' free · '+(unavailable?unavailable+' receiving '+(unavailable===1?'facility':'facilities')+' unavailable':state.hospitals.length+' receiving facilities');
 $('#resource-summary').classList.toggle('attention',unavailable>0||available===0);
 $('#fleet-count').textContent=available+' free'+(proposed.size?' · '+proposed.size+' proposed':'');
 $('#fleet').innerHTML=state.fleet.map(a=>`<div class="resource-row"><div><strong>${esc(a.name)}</strong><small>${esc(a.equipment.replaceAll(',',' · '))}</small>${a.station_reference?`<p class="station-basis">${esc(a.station_reference.name)} · ${esc(a.station_reference.address)}</p>`:''}</div><span class="status ${proposed.has(a.id)&&a.status==='available'?'proposed':esc(a.status)}">${esc(a.status==='assigned'?'reserved':proposed.has(a.id)?'proposed':a.status)}</span></div>`).join('');
 $('#hospitals').innerHTML=state.hospitals.map(h=>`<div class="resource-row"><div><strong>${esc(h.name)}</strong><small>${esc(h.capabilities.replaceAll(',',' · '))}</small></div><span class="status ${h.accepting&&h.slots>0?'':'closed'}">${h.accepting&&h.slots>0?h.slots+' '+(h.slots===1?'slot':'slots'):'Unavailable'}</span></div>`).join('');
}
function renderState(){
 if(!state)return;rec=records.get(selected)||null;const i=state.incidents.find(i=>i.id===selected),status=caseStatus(rec);
 renderQueue();renderResources();renderActivity();renderPublic();renderIntake(i);renderAgent();
 const nextHeading=JSON.stringify([i.id,i.status,i.name,i.priority,i.service,i.equipment,i.incident_revision]);if(nextHeading!==headingKey){headingKey=nextHeading;$('#selected-incident').innerHTML=`<div><span class="case-id">Case details <span class="priority ${i.priority==='Priority 1'?'urgent':''}">${esc(i.priority||'Needs triage')}</span></span><h2>${esc(i.name)}</h2><p>${i.prepared_intake?'Prepared intake · '+esc(i.service)+' service · '+esc(i.equipment)+' equipment':i.public_source?esc(i.public_call_type||'Public report')+' · '+esc(i.public_source):esc(i.service)+' service required · '+esc(i.equipment)+' equipment'}</p></div>`;}
 renderWorkflow(i,status);
 const approvals=state.incidents.filter(i=>inboxGroup(i)==='approval').length,working=state.incidents.filter(i=>inboxGroup(i)==='working').length,inputs=state.incidents.filter(i=>inboxGroup(i)==='input').length,units=state.fleet.filter(a=>a.status==='available'&&!proposedUnits().has(a.id)).length;
 $('#workspace-status').textContent=approvals||inputs?`${approvals} ${approvals===1?'plan':'plans'} to review · ${inputs} ${inputs===1?'question':'questions'} for you`:working?`ARC is following up on ${working} ${working===1?'case':'cases'}. You can review active assignments while it works.`:'No plans or questions are waiting for your review.';
 $('#workspace-status').classList.toggle('attention',Boolean(state.feed_stale||state.zetaris_offline||state.ai_offline));
 const activeHere=activeJob&&belongsToSelection(activeJob,selected,state.epoch);
 $('#analyze').hidden=i.status!=='open'||Boolean(i.assessment_blockers?.length)||['working','queued'].includes(i.agent_state);
 $('#manual-assessment').hidden=$('#analyze').hidden;
 $('#request-area').hidden=i.status!=='open';
 $('#analyze').disabled=Boolean(activeJob)||i.status!=='open'||Boolean(i.assessment_blockers?.length);$('#analyze').classList.add('secondary-action');
 $('#analyze').textContent=activeJob?'Another assessment is running':i.agent_state==='needs_input'?'Retry assessment':'Reassess now';
 $('#plan-heading').textContent=i.status!=='open'?'Approved plan':status==='incomplete'?'Confirm the response':status==='ready'?'Your decision':i.agent_state==='working'?'ARC is assessing':'Response plan';
 $('.decision-panel').dataset.state=status;
 $('.decision-heading').hidden=!rec&&!i.assessment_blockers?.length;
 $('#decision-status').textContent=({ready:'Ready for review',changed:'Review required',expired:'Evidence expired',approved:'Reserved',rejected:'Rejected',blocked:'Blocked',incomplete:'Details required'})[status]||'Awaiting assessment';
 const error=errors.get(selected),alert=error?'Assessment unavailable. '+error:'';
 $('#case-alert').hidden=!alert;if($('#case-alert').textContent!==alert)$('#case-alert').textContent=alert;$('#case-alert').classList.toggle('error',Boolean(error));
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
 if(!rec){$('#recommendation').innerHTML=inboxGroup(state.incidents.find(i=>i.id===selected))==='working'?'<p class="case-followup">You can review another case while ARC checks this one. The next plan will appear here.</p>':'';return;}
 const sameCaseBusy=Boolean(activeJob&&!activeJob.automatic&&belongsToSelection(activeJob,selected,state.epoch));
 const p=rec.selected,i=state.incidents.find(i=>i.id===selected),byId=Object.fromEntries(rec.evidence.map(e=>[e.id,e]));
 const explanation=rec.explanation.evidence_ids.map(id=>byId[id]);
 let html='';
 if(p){
  const unit=rec.source_rows.fleet.find(a=>a.id===p.ambulance_id),hospital=rec.source_rows.hospitals.find(h=>h.id===p.hospital_id);
  if(rec.decision==='pending'&&status==='ready')html+=`<p class="plan-explanation">${esc(operationalCopy(p.reasons?.[0]||'These resources meet the confirmed requirements.').replace('Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.','This is the shortest combined driving time among eligible plans.'))}</p>`;
  html+=`<section class="plan-section"><div class="plan-label"><span>Response unit</span><span>${rec.decision==='approved'?'Reserved':status==='changed'||status==='expired'?'Previous plan':'Proposed'}</span></div><div class="plan-main"><div><strong>${esc(unit.name)}</strong><p>Meets the ${esc(i.equipment)} equipment requirement</p></div><div class="eta"><strong>~${p.pickup_min}</strong><small>min to pickup</small></div></div></section>`;
  html+=`<section class="plan-section transport-section"><div class="plan-label"><span>Destination preview</span></div><div class="plan-main"><div><strong>${esc(hospital.name)}</strong><p>Meets the ${esc(i.service)} service requirement</p></div><div class="eta"><strong>~${p.transport_min}</strong><small>min from pickup</small></div></div></section>`;
  html+='<p class="plan-note">Driving estimates exclude time on scene and hospital handover.</p>';
 }else html+='<div class="error-box"><strong>No suitable plan yet</strong><br>ARC could not match the current requirements, available resources and routes. Review the explanation below.</div>';
 if(rec.decision==='rejected')html+='<p class="pending-box">Plan rejected. Review the requirements or request another assessment when ready.</p>';
 if(rec.changes.length&&rec.decision==='pending'&&status==='ready')html+='<div class="change"><strong>What changed</strong><br>'+esc(rec.changes.map(c=>humanChange(c.text)).join(' '))+'</div>';
 if(rec.decision==='pending')html+=`<div class="evidence-quality ${status==='expired'||status==='changed'?'stale':''}"><span>${status==='expired'?'Evidence expired':'Checked'}</span><span data-evidence-epoch="${rec.evidence_epoch||rec.created_epoch}">${durationLabel(Math.max(0,Math.floor(Date.now()/1000-(rec.evidence_epoch||rec.created_epoch))))} ago</span></div>`;
 if(status==='ready'&&p)html+=`<div class="decision-actions"><button id="approve" class="primary" ${sameCaseBusy?'disabled':''}>Approve plan</button><button id="reject" ${sameCaseBusy?'disabled':''}>Reject plan</button></div><p class="approval-note">Approval reserves this unit and one receiving slot.</p>`;
 const candidates=rec.alternatives.filter(a=>a.type==='assignment'&&a.eligible&&a.id!==p?.id).sort((a,b)=>a.pickup_min-b.pickup_min||a.transport_min-b.transport_min);
 if(candidates.length){html+=`<details class="review-details" data-detail="alternatives"><summary>${status==='ready'?'Compare options ('+candidates.length+')':'Other options at assessment'}</summary>`;for(const a of candidates){html+=`<div class="alternative-row"><strong>${esc(a.name)}</strong><div class="alternative-timing"><span>~${a.pickup_min} min response</span><span>~${a.transport_min} min transport</span></div>${status==='ready'?`<button data-alternative="${esc(a.id)}" ${activeJob?'disabled':''}>Ask ARC to review this option</button>`:''}</div>`;}html+='</details>';}
 html+=`<details class="review-details" data-detail="reasoning"><summary>Why this plan?</summary><div class="explanation">`+explanation.map(e=>`<div class="evidence-item"><span class="eid">${esc(e.id)}</span><span>${esc(operationalCopy(e.text))}</span></div>`).join('');
 for(const a of rec.alternatives.filter(a=>!a.eligible))html+=`<div class="alternative-row"><strong>${esc(a.name)} · excluded</strong><p>${esc(operationalCopy(a.reasons.join(' ')))}</p></div>`;
 html+='</div></details>';
 html+=`<details class="review-details" data-detail="sources"><summary>Evidence & activity</summary><div class="source-strip">Routes: ${p?esc(p.transport_route.mode)+' '+esc(p.transport_route.source):'unavailable or ineligible'} · ${p?.transport_route.traffic_aware?'Traffic at assessment time':'Static estimates; no live traffic'}<br>Assessed ${esc(new Date(rec.created_at).toLocaleString('en-CA'))}</div>`+rec.changes.map(c=>`<div class="change">${esc(operationalCopy(c.text))}</div>`).join('')+`<ol class="trace">${rec.trace.map(t=>`<li><strong>${esc(t.tool)}</strong><br>${esc(operationalCopy(t.detail))}</li>`).join('')}</ol><div class="source-strip">${Object.entries(rec.source_rows).map(([name,rows])=>esc(name)+' · observed '+esc(rows[0]?.observed_at||'missing timestamp')).join('<br>')}</div></details>`;
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
 state.hospitals.filter(h=>$('#show-resource-markers').checked||h.id===p?.hospital_id).forEach(h=>marker(h.lat,h.lon,'hospital',h.name,!h.accepting||Boolean(p&&h.id!==p.hospital_id)));
 state.fleet.filter(a=>$('#show-resource-markers').checked||a.id===p?.ambulance_id).forEach(a=>marker(a.lat,a.lon,'ambulance',a.name+' · '+(a.status==='assigned'?'reserved':proposedUnits().has(a.id)?'proposed':a.status),Boolean(p&&a.id!==p.ambulance_id)));
 state.incidents.filter(i=>(i.status==='open'||i.id===selected)&&hasPickup(i)&&(i.service||i.id===selected)).forEach(i=>{const color=i.agent_state==='awaiting_approval'?'#28785c':i.agent_state==='working'?'#315fb6':'#9c7131';L.circleMarker([i.lat,i.lon],{radius:i.id===selected?10:7,color,weight:i.id===selected?3:2,fillColor:color,fillOpacity:i.id===selected?.85:.5}).bindTooltip(esc(i.name),{permanent:i.id===selected,direction:'top',offset:[0,-10],className:'selected-map-label'}).on('click',()=>selectIncident(i.id)).addTo(layers);});
 state.closures.forEach(c=>L.circle([c.lat,c.lon],{radius:c.radius_m,color:'#ac694b',fillOpacity:.15,weight:2}).bindTooltip(esc(operationalCopy(c.name))).addTo(layers));
 if(p){for(const [route,color] of [[p.pickup_route,'#255bd6'],[p.transport_route,'#16786b']]){const points=route.coordinates.map(([x,y])=>[y,x]);L.polyline(points,{color:'#fff',weight:8,opacity:.95,interactive:false}).addTo(layers);L.polyline(points,{color:routeNeedsReview?'#9a783a':color,weight:4.5,dashArray:routeNeedsReview?'6 6':undefined,lineCap:'round'}).addTo(layers);}}
 $('.map-legend').innerHTML=routeNeedsReview?'<span><i class="legend-dot review"></i>Previous plan · review required</span>':'<span><i class="legend-dot ambulance"></i>Unit to incident</span><span><i class="legend-dot hospital"></i>Incident to hospital</span>';
 $('.map-legend').hidden=!p;
 const trafficNote=!p?'No plan assessed for this report yet':p.transport_route.traffic_aware?'Traffic at assessment time · ordinary driving':'Static driving estimates · live traffic not included';
 $('.map-disclosure').textContent=(routeNeedsReview?'Previous assessed routes · review required · ':'')+trafficNote;
 if(p?.transport_route.traffic_aware)map.attributionControl.addAttribution('© TomTom');
 if(!overviewInitialized){overviewInitialized=true;hasPickup(currentIncident)?fitOperationalMap():fitOverview();}
}
function fitOperationalMap(){if(!state)return;const i=state.incidents.find(i=>i.id===selected),p=rec?.selected;if(hasPickup(i)&&!p){map.invalidateSize({pan:false});map.setView([i.lat,i.lon],14,{animate:false});return;}let points=hasPickup(i)?[[i.lat,i.lon]]:[];if(p)points=points.concat(p.pickup_route.coordinates.map(([x,y])=>[y,x]),p.transport_route.coordinates.map(([x,y])=>[y,x]));else points=points.concat(state.fleet.map(a=>[a.lat,a.lon]),state.hospitals.map(h=>[h.lat,h.lon]));map.invalidateSize();map.fitBounds(points,{padding:[30,30],maxZoom:15,animate:false});}
$('#analyze').onclick=()=>startAssessment();$('#fit-map').onclick=fitOperationalMap;
$('#open-resources').onclick=()=>$('#resources-modal').showModal();
$('#open-context').onclick=()=>$('#context-modal').showModal();
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
 notices.stations='Official Toronto ambulance-station locations. ARC stages available scenario units at these sites; the catalogue contains no live vehicle positions, staffing or availability.';
 let html=`<p class="public-notice">${notices[kind]}</p><p class="public-freshness ${source.stale||source.mode!=='live'?'attention':''}">${source.mode==='live'?(source.stale?'Last retrieval is stale':'Connected'):source.mode==='cached'?'Cached · refresh failed':'Unavailable'}${source.fetched_at?' · retrieved '+esc(new Date(source.fetched_at).toLocaleTimeString('en-CA',{timeZone:city.timezone})):''}${source.observed_at?' · publisher updated '+esc(publicAge(source.observed_at)):''}${source.error?' · '+esc(source.error):''}</p><div class="public-list">`;
 let display=rows;
 if(kind==='police')display=[...rows].sort((a,b)=>String(b.observed_at).localeCompare(String(a.observed_at))).slice(0,30);
 if(kind==='roads'){const i=state.incidents.find(i=>i.id===selected);display=[...rows].sort((a,b)=>publicDistance(a,i)-publicDistance(b,i)).slice(0,20);}
 for(const r of display){
  html+=`<div class="public-row"><strong>${esc(r.name||r.id)}</strong>`;
  if(kind==='police'||kind==='fire')html+=`<p>${esc(r.location)} · ${esc(publicAge(r.observed_at))}${r.units?' · '+esc(r.units):''}</p>${(()=>{const queued=state.incidents.find(i=>i.public_source&&i.public_observed_at===r.observed_at&&i.public_location===r.location);return queued?`<button data-open-case="${esc(queued.id)}">Open queued call</button>`:'';})()}`;
  if(kind==='stations')html+=`<p>${esc(r.address)}</p>`;
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
 const calls=$('#show-public-calls').checked,roads=$('#show-public-roads').checked,showTraffic=$('#show-traffic').checked;
 const key=JSON.stringify([selected,calls,roads,showTraffic,['fire','police','roads','traffic'].map(k=>[sources[k]?.fetched_at,sources[k]?.stale])]);if(key===publicMapKey)return;publicMapKey=key;publicLayers.clearLayers();
 if(calls)for(const r of [...(sources.police?.records||[]),...(city.id==='seattle'?sources.fire?.records||[]:[])].filter(hasPickup))L.circleMarker([r.lat,r.lon],{radius:4,color:'#66718a',weight:1,fillOpacity:.5}).bindTooltip(esc(((sources[city.id==='seattle'?'fire':'police']?.stale?'Cached call · ':'Public call · '))+r.name+' · '+r.location)).addTo(publicLayers);
 if(roads)for(const r of [...(sources.roads?.records||[])].sort((a,b)=>publicDistance(a,state.incidents.find(i=>i.id===selected))-publicDistance(b,state.incidents.find(i=>i.id===selected))).slice(0,100))if(r.lat&&r.lon)L.circleMarker([r.lat,r.lon],{radius:4,color:'#a4762f',weight:1,fillOpacity:.5}).bindTooltip(esc('Restriction · '+r.name)).addTo(publicLayers);
 const traffic=sources.traffic;if(traffic?.mode==='live'&&!traffic.stale&&traffic.records?.length)map.attributionControl.addAttribution('© TomTom');if(showTraffic&&traffic?.mode==='live'&&!traffic.stale)for(const r of traffic.records||[])L.polyline(r.coordinates.map(c=>[c.latitude,c.longitude]),{color:r.closed?'#a33f39':r.speed_kph<r.free_flow_kph*.5?'#c07928':'#39816e',weight:5,opacity:.65}).bindTooltip(esc(r.speed_kph+' km/h observed · '+r.name)).addTo(publicLayers);
}
$('#public-kind').onchange=()=>{publicRenderKey='';renderPublic();};
$('#show-traffic').onchange=()=>renderPublicMap(state.public_context||{});
$('#show-resource-markers').onchange=()=>{mapRenderKey='';renderMap();};
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
 form.elements.pickup_label.value=draft?.pickup_label??i.pickup_label??i.name??'';$('#pickup-help').textContent=hasPickup(i)?'Confirm the pickup location, or choose another point on the map.':'Choose a confirmed pickup point on the map. A street or postal area alone is not an exact pickup.';$('#intake-error').textContent='';$('#reload-intake').hidden=true;panel.open=draft?.open??false;
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

$('#incident-intake-form').addEventListener('invalid',e=>{const details=e.target.closest('.coordinate-details');if(details)details.open=true;},true);
$('#reload-intake').onclick=()=>{intakeDrafts.delete(selected);intakeOwner='';renderIntake(state.incidents.find(i=>i.id===selected));};

function renderWorkflow(i,status){
 const group=inboxGroup(i),question=caseQuestion(i);
 let title='',description='',action='';
 if(group==='reserved'){
  title='Assignment approved';const assignment=state.assignments.find(a=>a.incident_id===i.id);
  description='The unit and receiving slot are reserved.'+(assignment?' Approved at '+new Date(assignment.at).toLocaleTimeString('en-CA',{timeZone:city.timezone,hour:'2-digit',minute:'2-digit'}):'');
 }else if(group==='reports'||group==='history'){
  title=group==='history'?'Earlier public report':'Is this a response case?';description='This is a public report, not a confirmed request to ARC. '+question.body;action='intake';
 }else if(group==='input'){
  title=question.title;description=question.body;action=question.target;
 }else if(status==='ready'){
  title='ARC has a plan ready';description='Review the unit, destination and explanation below. Resources stay available until you approve.';
 }else if(status==='changed'||status==='expired'){
  title='ARC is reviewing this plan';description=status==='changed'?describeChange(rec):'The previous evidence has aged. ARC will check current conditions before another approval.';
 }else if(i.agent_state==='working'){
  title='ARC is checking this case';description=friendlyStage(i.agent_reason);
 }else if(i.agent_state==='waiting'){
  title=i.agent_reason?.includes('unit')?'ARC is waiting for a unit':i.agent_reason?.includes('receiving')?'ARC is waiting for a receiving facility':'ARC is monitoring this case';description=i.agent_reason;
 }else{title='ARC will prepare a plan';description='ARC will check eligible units, receiving facilities and routes, then bring you a recommendation.';}
 if(!state.agent?.enabled&&group==='working'){title='ARC is paused';description='Resume ARC to continue preparing and refreshing plans.';}
 const label=group==='history'?'Review report details':group==='reports'?'Confirm this response case':question.action;
 const html=`<span class="arc-speaker">ARC</span><strong>${esc(title)}</strong><p>${esc(description)}</p>${action?`<button id="case-next-action" data-target="${action}">${esc(label)}</button>`:''}`;
 if($('#case-guidance').innerHTML!==html){$('#case-guidance').innerHTML=html;const button=$('#case-next-action');if(button)button.onclick=()=>{const panel=button.dataset.target==='intake'?$('#incident-intake'):$('#manual-assessment');panel.open=true;panel.scrollIntoView({block:'nearest'});panel.querySelector('select,textarea,button')?.focus({preventScroll:true});};}
 $('#case-guidance').classList.toggle('is-complete',group==='reserved');
}
function renderAgent(){
 const agent=state.agent||{},running=state.assessments?.[0];
 $('#agent-status').textContent=agent.enabled?(running?'ARC is assessing':'ARC is monitoring'):'ARC is paused';
 const incident=running&&state.incidents.find(i=>i.id===running.incident_id);
 $('#agent-detail').textContent=agent.error||(running?(incident?.name||'Current case')+' · '+friendlyStage(running.stage):agent.enabled?'ARC checks confirmed cases and brings you the next decision.':'Existing proposals remain available; resume to continue automatic work.');
 $('#agent-toggle').textContent=agent.enabled?'Pause agent':'Resume agent';
 const unmapped=state.incidents.filter(i=>!['reports','history'].includes(inboxGroup(i))&&i.status==='open'&&!hasPickup(i)).length;$('#map-unmapped').textContent=unmapped?unmapped+' calls need a pickup location':'';
 $('.agent-orb').classList.toggle('running',Boolean(running));
}
function fitOverview(){if(!state)return;const points=[...state.fleet,...state.hospitals,...state.incidents.filter(i=>i.status==='open'&&i.service&&hasPickup(i))].filter(hasPickup).map(i=>[i.lat,i.lon]);if(points.length){map.invalidateSize();map.fitBounds(points,{padding:[35,35],maxZoom:14,animate:false});}}
$('#fit-overview').onclick=fitOverview;
$('#agent-toggle').onclick=async()=>{try{await api('/api/agent/control',{enabled:!state.agent.enabled});await load();}catch(e){toast(e.message);}};
$('#load-demo-intake').onclick=async()=>{try{const r=await api('/api/demo/intake',{});toast(r.loaded?'Prepared intake loaded. ARC will assess automatically.':'Prepared intake is already loaded.');await load();}catch(e){toast(e.message);}};
new ResizeObserver(()=>map.invalidateSize()).observe($('#map'));

document.querySelectorAll('[data-queue-bucket]').forEach(b=>b.onclick=()=>{queueStage=queueStage===b.dataset.queueBucket?'all':b.dataset.queueBucket;renderQueue();document.querySelector(`[data-incident="${selected}"]`)?.scrollIntoView({block:'nearest'});});
