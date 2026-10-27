// Pure display policy shared by the workspace and its behavioral tests.
export function elapsedSeconds(iso, now=Date.now()) {
  const epoch=Date.parse(iso);
  return Number.isFinite(epoch)?Math.max(0,Math.floor((now-epoch)/1000)):null;
}
export function durationLabel(seconds) {
  if(seconds===null)return 'Time unknown';
  if(seconds<60)return `${seconds}s`;
  if(seconds<3600)return `${Math.floor(seconds/60)}m ${seconds%60}s`;
  return `${Math.floor(seconds/3600)}h ${Math.floor(seconds%3600/60)}m`;
}
export function priorityNumber(incident) {
  return Number(incident.priority?.match(/\d+/)?.[0]??99);
}
export function sortedIncidents(incidents) {
  return [...incidents].sort((a,b)=>(a.status==='open'?0:1)-(b.status==='open'?0:1)||priorityNumber(a)-priorityNumber(b)||Number(['missing','stale'].includes(a.public_feed_status))-Number(['missing','stale'].includes(b.public_feed_status))||String(a.received_at??'').localeCompare(String(b.received_at??''))||a.id.localeCompare(b.id));
}
export function proposalState(proposal,version,now=Date.now(),incident=null) {
  if(proposal&&proposal.decision!=='pending')return proposal.decision;
  if(incident?.assessment_blockers?.length)return 'incomplete';
  if(!proposal)return 'unassessed';
  if(incident&&(proposal.incident_revision??0)!==(incident.incident_revision??0))return 'changed';
  if(proposal.version!==version)return 'changed';
  const evidenceEpoch=proposal.evidence_epoch??proposal.created_epoch;
  if(!Number.isFinite(evidenceEpoch)||now/1000-evidenceEpoch>120)return 'expired';
  if(!proposal.approvable)return 'blocked';
  return 'ready';
}
export function belongsToSelection(job,incidentId,epoch) {
  return job.incident_id===incidentId&&job.simulation_epoch===epoch;
}
export function nextAction(status) {
  return ({incomplete:'Complete incident details',unassessed:'Assess response plan',ready:'Refresh assessment',changed:'Reassess changed conditions',expired:'Refresh expired evidence',blocked:'Reassess availability',rejected:'Find another plan'})[status]??null;
}

export function workflowBucket(incident) {
  if(incident.agent_state)return ({awaiting_approval:'approval',working:'working',queued:'working',needs_input:'input',waiting:'input',watching:'watching',reserved:'reserved'})[incident.agent_state]||'input';
  if (incident.status !== 'open') return 'reserved';
  if (['missing', 'stale'].includes(incident.public_feed_status)) return 'feed';
  if (incident.assessment_blockers?.length) return 'intake';
  return 'action';
}

// Public reports are incoming context until a dispatcher supplies response requirements.
export function inboxGroup(incident) {
  if(incident.status!=='open')return 'reserved';
  if(incident.public_source&&!incident.requirements_source&&!incident.prepared_intake)
    return ['missing','stale'].includes(incident.public_feed_status)?'history':'reports';
  if(incident.agent_state==='awaiting_approval')return 'approval';
  if(incident.assessment_blockers?.length||incident.agent_state==='needs_input'||incident.agent_state==='watching')return 'input';
  return 'working';
}

export function defaultInboxSelection(incidents,savedId) {
  const saved=incidents.find(i=>i.id===savedId);
  if(saved&&!['reports','history'].includes(inboxGroup(saved)))return saved.id;
  const operational=sortedIncidents(incidents.filter(i=>!['reports','history'].includes(inboxGroup(i))));
  return operational.find(i=>i.status==='open')?.id||operational[0]?.id||saved?.id||sortedIncidents(incidents)[0]?.id||null;
}

export function caseQuestion(incident) {
  const issues=incident.assessment_blockers||[];
  if(issues.some(s=>s.includes('changed public call')||s.includes('feed')||s.includes('no longer')))return {
    title:'Can you verify this call?',
    body:'The published call changed or its source is no longer current. Review the details before ARC prepares another plan.',
    action:'Review call details',target:'intake'};
  if(issues.some(s=>s.includes('pickup location')))return {
    title:'Where should the unit go?',
    body:'This report does not include a confirmed pickup point. Choose a location, then confirm the response requirements.',
    action:'Confirm pickup and requirements',target:'intake'};
  if(issues.length)return {
    title:'What response is needed?',
    body:'The public report does not supply the priority, required service and equipment. Confirm those details so ARC can assess this call.',
    action:'Confirm response requirements',target:'intake'};
  return {title:'This case needs your review',body:incident.agent_reason||'Review the previous plan or adjust the requirements before asking ARC to continue.',action:'Review and retry',target:'retry'};
}
