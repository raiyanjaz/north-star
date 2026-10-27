import test from 'node:test';
import assert from 'node:assert/strict';
import {sortedIncidents,proposalState,belongsToSelection,elapsedSeconds,nextAction} from '../web/dispatch-model.mjs';
const now=Date.UTC(2026,9,23,3),p={decision:'pending',version:4,approvable:true,evidence_epoch:now/1000-30};
test('priority and waiting time order never mutates the source queue',()=>{const rows=[{id:'a',priority:'Priority 2',status:'open',received_at:'2026-01-01'},{id:'b',priority:'Priority 1',status:'open',received_at:'2026-01-03'},{id:'c',priority:'Priority 1',status:'open',received_at:'2026-01-02'}];assert.deepEqual(sortedIncidents(rows).map(i=>i.id),['c','b','a']);assert.equal(rows[0].id,'a');});
test('reserved plans follow open calls even at higher priority',()=>{assert.deepEqual(sortedIncidents([{id:'a',priority:'Priority 1',status:'assigned'},{id:'b',priority:'Priority 2',status:'open'}]).map(i=>i.id),['b','a']);});
test('approval readiness follows evidence age, not completion time',()=>{assert.equal(proposalState({...p,created_epoch:now/1000,evidence_epoch:now/1000-121},4,now),'expired');});
test('changed operational picture invalidates an otherwise fresh proposal',()=>{assert.equal(proposalState(p,5,now),'changed');assert.equal(nextAction('changed'),'Reassess changed conditions');});
test('a failed eligibility assessment cannot be offered for approval',()=>{assert.equal(proposalState({...p,approvable:false},4,now),'blocked');});
test('background results belong to their originating incident and epoch',()=>{const job={incident_id:'b',simulation_epoch:'run-2'};assert.equal(belongsToSelection(job,'a','run-2'),false);assert.equal(belongsToSelection(job,'b','run-1'),false);assert.equal(belongsToSelection(job,'b','run-2'),true);});
test('reserved proposals remain recorded decisions after other changes',()=>{assert.equal(proposalState({...p,decision:'approved'},99,now),'approved');});
test('unknown or future incident timestamps never produce invalid waiting times',()=>{assert.equal(elapsedSeconds('invalid',now),null);assert.equal(elapsedSeconds(new Date(now+1000).toISOString(),now),0);});
test('public calls with missing details are not assessable',()=>{assert.equal(proposalState(null,4,now,{assessment_blockers:['Choose a priority']}),'incomplete');assert.equal(nextAction('incomplete'),'Complete incident details');});
test('case revisions invalidate a pending plan without changing resource version',()=>{assert.equal(proposalState({...p,incident_revision:2},4,now,{incident_revision:3}),'changed');});
test('unrelated public arrivals leave a matching plan ready',()=>{assert.equal(proposalState({...p,incident_revision:2},4,now,{incident_revision:2,assessment_blockers:[]}),'ready');});
test('current calls precede missing calls at equal priority while confirmed priority stays primary',()=>{const rows=[{id:'old',status:'open',public_feed_status:'missing',received_at:'2026-01-01'},{id:'new',status:'open',public_feed_status:'present',received_at:'2026-01-02'}];assert.deepEqual(sortedIncidents(rows).map(i=>i.id),['new','old']);rows[0].priority='Priority 1';assert.equal(sortedIncidents(rows)[0].id,'old');});
test('workflow groups distinguish missing intake from unavailable feeds and reserved plans',async()=>{const {workflowBucket}=await import('../web/dispatch-model.mjs');assert.equal(workflowBucket({status:'open',assessment_blockers:['Choose priority']}),'intake');assert.equal(workflowBucket({status:'open',public_feed_status:'missing',assessment_blockers:['Choose priority']}),'feed');assert.equal(workflowBucket({status:'assigned',public_feed_status:'missing'}),'reserved');assert.equal(workflowBucket({status:'open',assessment_blockers:[]}),'action');});
test('autonomous inbox groups approvals, agent work and exceptions',async()=>{const {workflowBucket}=await import('../web/dispatch-model.mjs');assert.equal(workflowBucket({agent_state:'awaiting_approval'}),'approval');assert.equal(workflowBucket({agent_state:'working'}),'working');assert.equal(workflowBucket({agent_state:'queued'}),'working');assert.equal(workflowBucket({agent_state:'waiting'}),'input');assert.equal(workflowBucket({agent_state:'watching'}),'watching');});

test('untriaged public reports do not become questions in the action inbox',async()=>{
 const {inboxGroup}=await import('../web/dispatch-model.mjs');
 const report={status:'open',public_source:'Seattle Fire Department',public_feed_status:'present',agent_state:'needs_input',assessment_blockers:['Choose a priority']};
 assert.equal(inboxGroup(report),'reports');
 assert.equal(inboxGroup({...report,public_feed_status:'missing'}),'history');
 assert.equal(inboxGroup({...report,public_feed_status:'stale'}),'history');
});
test('confirmed response cases keep missing or changed information visible as questions',async()=>{
 const {inboxGroup,caseQuestion}=await import('../web/dispatch-model.mjs');
 const incident={status:'open',public_source:'Seattle Fire Department',requirements_source:'dispatcher',public_feed_status:'stale',agent_state:'watching',assessment_blockers:['Public feed is stale or unavailable']};
 assert.equal(inboxGroup(incident),'input');assert.equal(caseQuestion(incident).title,'Can you verify this call?');
});
test('resource waiting stays with ARC rather than becoming a human question',async()=>{
 const {inboxGroup}=await import('../web/dispatch-model.mjs');
 assert.equal(inboxGroup({status:'open',agent_state:'waiting',agent_reason:'Waiting for a compatible unit to become available.'}),'working');
});
test('prepared and approved cases remain operational cases',async()=>{
 const {inboxGroup}=await import('../web/dispatch-model.mjs');
 assert.equal(inboxGroup({status:'open',prepared_intake:true,agent_state:'awaiting_approval'}),'approval');
 assert.equal(inboxGroup({status:'assigned',public_source:'Seattle Fire Department',agent_state:'reserved'}),'reserved');
});
test('pickup and requirements questions point to explicit intake without guessing',async()=>{
 const {caseQuestion}=await import('../web/dispatch-model.mjs');
 assert.equal(caseQuestion({assessment_blockers:['Confirm a pickup location']}).title,'Where should the unit go?');
 const response=caseQuestion({assessment_blockers:['Choose a priority','Choose a required service']});
 assert.equal(response.title,'What response is needed?');assert.equal(response.target,'intake');
});
test('a rejected or failed case offers review and retry rather than a fabricated input request',async()=>{
 const {inboxGroup,caseQuestion}=await import('../web/dispatch-model.mjs');
 const incident={status:'open',agent_state:'needs_input',assessment_blockers:[],agent_reason:'Plan rejected. Edit the intake or request another assessment.'};
 assert.equal(inboxGroup(incident),'input');assert.equal(caseQuestion(incident).target,'retry');assert.equal(caseQuestion(incident).body,incident.agent_reason);
});
test('opening a workspace starts with operational cases rather than an old public-report selection',async()=>{
 const {defaultInboxSelection}=await import('../web/dispatch-model.mjs');
 const rows=[{id:'old-report',status:'open',public_source:'Fire',public_feed_status:'missing',agent_state:'watching'},{id:'plan',status:'open',priority:'Priority 1',agent_state:'awaiting_approval'},{id:'approved',status:'assigned',agent_state:'reserved'}];
 assert.equal(defaultInboxSelection(rows,'old-report'),'plan');
 assert.equal(defaultInboxSelection(rows,'approved'),'approved');
 assert.equal(defaultInboxSelection(rows.slice(0,1),'old-report'),'old-report');
});

test('completed assignments leave the active inbox and remain accessible as history',async()=>{const {inboxGroup}=await import('../web/dispatch-model.mjs');assert.equal(inboxGroup({status:'completed',agent_state:'completed'}),'completed');assert.equal(inboxGroup({status:'cancelled',agent_state:'completed'}),'completed');assert.equal(inboxGroup({status:'assigned',agent_state:'reserved'}),'reserved');});
test('journey controls advance one stage and stop after completion',async()=>{const {assignmentLabel,nextAssignmentPhase}=await import('../web/dispatch-model.mjs');assert.equal(nextAssignmentPhase('responding'),'on_scene');assert.equal(nextAssignmentPhase('handover'),'completed');assert.equal(nextAssignmentPhase('completed'),null);assert.equal(nextAssignmentPhase('cancelled'),null);assert.equal(assignmentLabel('transporting'),'Transporting');});
