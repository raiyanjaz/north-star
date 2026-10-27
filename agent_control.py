"""Event-driven assessment supervisor. Only humans can reserve resources."""
import threading
import time
from collections import deque
from coordination import commitments, current_proposal, priority_key, resource_blocker, proposal_conflict
from incident_intake import incident_issues
from simulation import stamp


class AgentCoordinator:
    def __init__(self, arc, start=True):
        self.arc = arc
        self.stop = threading.Event()
        self.lock = threading.RLock()
        self.attempts = {}
        self.events = deque(maxlen=20)
        self.started = deque()
        self.retry_rejected = set()
        self.error = None
        if start:
            threading.Thread(target=self.run, daemon=True).start()

    def log(self, incident_id, text):
        with self.lock:
            self.events.appendleft({'at': stamp(), 'incident_id': incident_id, 'text': text})

    def enabled(self):
        return self.arc.sim.read().get('agent_enabled', True)

    def set_enabled(self, enabled):
        if not isinstance(enabled, bool):
            raise ValueError('Agent enabled must be true or false')
        with self.arc.sim.lock:
            state = self.arc.sim.read(); state['agent_enabled'] = enabled
            self.arc.sim.save(state); self.arc.sim.log('agent-control', {'enabled': enabled})
        self.log(None, 'Agent resumed.' if enabled else 'Agent paused; any in-flight assessment may finish.')

    def inspect(self, now=None, state=None, recs=None):
        now = time.time() if now is None else now
        state = self.arc.sim.read() if state is None else state
        recs = self.arc.sim.latest_recommendations() if recs is None else recs
        with self.arc.jobs_lock:
            running = {j['incident_id']: j for j in self.arc.jobs.values() if j['status'] == 'running'}
        with self.lock:
            attempts = dict(self.attempts)
            retries = set(self.retry_rejected)
            recent_runs = [t for t in self.started if now - t < 600]
        statuses, work = {}, []
        enabled = state.get('agent_enabled', True)
        for incident in sorted(state['incidents'], key=priority_key):
            iid = incident['id']; rec = recs.get(iid)
            issues = incident_issues(incident)
            coord = commitments(incident, state, recs, now) if incident['status'] == 'open' and not issues else {'units': {}, 'slots': {}, 'signature': '[]'}
            fingerprint = (state['epoch'], state['version'], incident.get('incident_revision', 0), coord['signature'])
            info = {'state': 'queued', 'reason': 'Queued for automatic assessment.', 'fingerprint': fingerprint}
            if incident['status'] in ('completed','cancelled'):
                info.update(state='completed', reason='Assignment ended; resources were released at the last journey location.')
            elif incident['status'] != 'open':
                info.update(state='reserved', reason='Assignment reserved by the dispatcher.')
            elif issues:
                watching = incident.get('public_feed_status') in ('missing', 'stale') and not incident.get('service')
                info.update(state='watching' if watching else 'needs_input', reason=' · '.join(issues))
            elif iid in running:
                if current_proposal(rec,incident,state,now) and not proposal_conflict(rec,coord,state):
                    info.update(state='awaiting_approval',reason='Plan ready. ARC is refreshing its evidence in the background.')
                else:info.update(state='working', reason=running[iid]['stage'])
            else:
                valid = current_proposal(rec, incident, state, now) and not proposal_conflict(rec,coord,state)
                if valid:
                    info.update(state='awaiting_approval', reason='Evidence-backed plan ready for your decision.')
                same = bool(rec and rec.get('version') == state['version'] and rec.get('incident_revision', 0) == incident.get('incident_revision', 0))
                blocker = resource_blocker(incident, state, coord)
                attempt = attempts.get(iid, {})
                same_attempt = attempt.get('fingerprint') == fingerprint
                needs_refresh = not valid or now - rec['evidence_epoch'] >= 80
                reason = 'new incident' if not rec else 'evidence refresh' if same and rec.get('selected') and rec.get('decision')=='pending' and now-rec.get('evidence_epoch',0)>=80 else 'changed conditions'
                if not valid and same and rec.get('decision') == 'rejected' and rec['id'] not in retries:
                    info.update(state='needs_input', reason='Plan rejected. Edit the intake or request another assessment.')
                elif blocker:
                    if not valid: info.update(state='waiting', reason=blocker)
                elif state.get('feed_stale') or state.get('zetaris_offline') or state.get('ai_offline'):
                    if not valid: info.update(state='waiting', reason='Waiting for operational services to recover.')
                elif not enabled:
                    if not valid: info.update(state='waiting', reason='Agent paused. Resume to prepare this plan.')
                elif same_attempt and attempt.get('failures', 0) >= 3:
                    if not valid: info.update(state='needs_input', reason=attempt.get('error', 'Assessment needs attention.') + ' Use Retry after checking services.')
                elif same_attempt and now < attempt.get('retry_at', 0):
                    if not valid: info.update(state='waiting', reason=attempt.get('error', 'No feasible route yet.') + ' ARC will retry automatically.', retry_at=attempt['retry_at'])
                elif needs_refresh:
                    if len(recent_runs) >= 16:
                        if not valid: info.update(state='waiting', reason='Assessment rate limit reached; ARC will resume automatically.', retry_at=recent_runs[0] + 600)
                    else:
                        work.append((incident, fingerprint, reason))
            statuses[iid] = {k:v for k,v in info.items() if k != 'fingerprint'}
        return state, statuses, work

    def snapshot(self, state=None, recs=None):
        state, statuses, _ = self.inspect(state=state, recs=recs)
        with self.lock:
            return {'enabled': state.get('agent_enabled', True), 'states': statuses,
                    'events': list(self.events), 'error': self.error}

    def tick(self):
        for event in self.arc.sim.advance_assignments():
            self.log(event['incident_id'], 'Assignment '+event['phase'].replace('_', ' ')+'.')
        self.arc.sim.sync_public(self.arc.public_context.snapshot())
        if getattr(self.arc,'prepare_demo',False):self.arc.sim.load_demo_intake()
        state, statuses, work = self.inspect()
        if not state.get('agent_enabled', True) or self.arc.analysis_lock.locked() or not work:
            return
        incident, fingerprint, reason = work[0]
        try:
            self.arc.start_analysis(incident['id'], 'Automatically assess this incident: '+reason+'. Explain the recommendation and competing resource constraints.', automatic=True, trigger=reason, fingerprint=fingerprint)
        except ValueError:
            return  # A human-requested assessment won the shared inference lock.
        with self.lock:
            self.started.append(time.time())
            while self.started and time.time() - self.started[0] >= 600:self.started.popleft()

    def finished(self, job):
        iid = job['incident_id']; fp = job.get('fingerprint')
        incident=next((i for i in self.arc.sim.read()['incidents'] if i['id']==iid),None)
        if job['status']=='error' and incident and incident['status']!='open':
            self.log(iid,'Refresh superseded by the dispatcher decision.');return
        with self.lock:
            previous = self.attempts.get(iid, {})
            if job['status'] == 'error':
                failures = previous.get('failures', 0) + 1 if previous.get('fingerprint') == fp else 1
                self.attempts[iid] = {'fingerprint': fp, 'failures': failures, 'retry_at': time.time()+min(300,30*2**(failures-1)), 'error': job['error']}
                message = 'Assessment needs attention: '+job['error']
            else:
                rec = job['result']
                self.attempts[iid] = {'fingerprint': fp, 'failures': 0, 'retry_at': time.time()+180 if not rec.get('selected') else 0,
                                      'error': 'No eligible route was found.'}
                message = 'Plan ready for approval.' if rec.get('approvable') else 'Assessment blocked; monitoring for changes.'
        self.log(iid, message)

    def retry(self, iid, request=None):
        rec = self.arc.sim.latest_recommendations().get(iid)
        with self.lock:
            self.attempts.pop(iid, None)
            if rec and rec['decision'] == 'rejected':self.retry_rejected.add(rec['id'])
        return self.arc.start_analysis(iid, str(request or 'Dispatcher requested a fresh assessment after reviewing an exception.')[:500])

    def run(self):
        while not self.stop.wait(3):
            try:
                self.tick(); self.error = None
            except Exception:
                self.error = 'Automatic coordination is temporarily unavailable; manual review remains available.'
