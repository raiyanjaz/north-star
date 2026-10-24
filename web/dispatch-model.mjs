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
