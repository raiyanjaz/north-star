import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch
from types import SimpleNamespace
from simulation import Simulation, stamp
from incident_intake import incident_issues, public_key
from app import ARC


def feed(rows,kind='fire',fresh=True):
 return {kind:{'mode':'live' if fresh else 'cached','stale':not fresh,'records':rows,'source_url':'https://publisher.example/feed'}}

def call(id='F1',name='MEDICAL',location='M4X'):
 return {'id':id,'name':name,'location':location,'observed_at':'2026-10-23T15:00:00-04:00','units':'P1'}

class IntakeTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.path=Path(self.tmp.name)/'state.sqlite';self.sim=Simulation(self.path)
 def tearDown(self):self.sim.db.close();self.tmp.cleanup()
 def public(self):return [i for i in self.sim.read()['incidents'] if i.get('public_source')]
 def complete(self,i,**changes):
  body={'revision':i['incident_revision'],'priority':'Priority 2','service':'general','equipment':'general','lat':43.65,'lon':-79.38,'pickup_label':'Dispatcher-confirmed intersection','notes':'Dispatcher entry for review'};body.update(changes)
  self.sim.update_incident_details(i['id'],body)
  return next(x for x in self.public() if x['id']==i['id'])
 def proposal(self,i):
  r={'id':'test-rec','incident_id':i['id'],'incident_revision':i['incident_revision'],'version':self.sim.read()['version'],'decision':'pending','approvable':True,'evidence_epoch':time.time(),'created_epoch':time.time(),'selected':{'ambulance_id':'A-12','hospital_id':'H-TGH'}}
  self.sim.store_rec(r);return r
 def test_ingestion_is_idempotent_and_leaves_missing_fields_missing(self):
  version=self.sim.read()['version'];self.sim.sync_public(feed([call()]));self.sim.sync_public(feed([call()]));i=self.public()[0]
  self.assertEqual(len(self.public()),1);self.assertIsNone(i['lat']);self.assertIsNone(i['service']);self.assertIsNone(i['priority']);self.assertEqual(self.sim.read()['version'],version);self.assertTrue(incident_issues(i))
 def test_police_rebuilt_object_id_and_reclassification_keep_identity(self):
  r=dict(call('TPS-1','COLLISION','A / B'),lat=43.65,lon=-79.38);self.sim.sync_public(feed([r],'police'));iid=self.public()[0]['id']
  r.update(id='TPS-99',name='COLLISION - PERSONAL INJURY');self.sim.sync_public(feed([r],'police'))
  self.assertEqual(len(self.public()),1);self.assertEqual(self.public()[0]['id'],iid);self.assertTrue(self.public()[0]['source_review_required'])
 def test_source_changes_preserve_dispatcher_details(self):
  r=call();self.sim.sync_public(feed([r]));i=self.complete(self.public()[0]);r.update(location='NEW LOCATION',name='MEDICAL UPDATED',lat=43.7,lon=-79.4)
  self.sim.sync_public(feed([r]));new=self.public()[0]
  self.assertEqual(new['lat'],43.65);self.assertEqual(new['name'],i['name']);self.assertEqual(new['notes'],i['notes']);self.assertEqual(new['service'],'general');self.assertTrue(new['source_review_required']);self.assertGreater(new['incident_revision'],i['incident_revision'])
 def test_disappearance_and_failure_never_resolve_a_call(self):
  self.sim.sync_public(feed([call()]));self.sim.sync_public(feed([]));i=self.public()[0]
  self.assertEqual(i['status'],'open');self.assertEqual(i['public_feed_status'],'missing')
  self.sim.sync_public(feed([],fresh=False));self.assertEqual(self.public()[0]['public_feed_status'],'stale');self.assertEqual(len(self.sim.read()['assignments']),0)
 def test_no_new_cases_from_cached_data(self):
  self.sim.sync_public(feed([call()],fresh=False));self.assertEqual(self.public(),[])
 def test_new_arrival_does_not_invalidate_another_ready_case(self):
  self.sim.sync_public(feed([call()]));i=self.complete(self.public()[0]);self.proposal(i)
  self.sim.sync_public(feed([call(),call('F2')]));result=self.sim.decide('test-rec','approve')
  self.assertEqual(result['decision'],'approved');self.assertEqual(len(self.sim.read()['assignments']),1)
 def test_edit_or_disappearance_blocks_old_approval(self):
  self.sim.sync_public(feed([call()]));i=self.complete(self.public()[0]);self.proposal(i);self.complete(i,notes='Changed dispatch details')
  with self.assertRaisesRegex(ValueError,'Incident details changed'):self.sim.decide('test-rec','approve')
  self.assertEqual(len(self.sim.read()['assignments']),0)
 def test_stale_form_and_non_coordinates_are_rejected(self):
  self.sim.sync_public(feed([call()]));i=self.public()[0]
  with self.assertRaises(ValueError):self.complete(i,lat=True)
  ready=self.complete(i)
  with self.assertRaisesRegex(ValueError,'Call details changed'):self.complete(i)
  self.assertEqual(self.public()[0]['incident_revision'],ready['incident_revision'])
 def test_incomplete_call_is_blocked_before_any_ai_or_routing(self):
  sources=feed([call()]);self.sim.sync_public(sources);arc=object.__new__(ARC);arc.city='toronto';arc.sim=self.sim;arc.public_context=SimpleNamespace(snapshot=lambda:sources)
  with patch('backend.assessment.Agent') as agent:
   with self.assertRaisesRegex(ValueError,'Choose a priority'):arc.analyze(self.public()[0]['id'],'assess',{})
   agent.assert_not_called()
 def test_disappeared_call_blocks_approval_without_resolving(self):
  self.sim.sync_public(feed([call()]));i=self.complete(self.public()[0]);self.proposal(i);self.sim.sync_public(feed([]))
  with self.assertRaisesRegex(ValueError,'Incident details changed'):self.sim.decide('test-rec','approve')
  self.assertEqual(self.public()[0]['status'],'open');self.assertEqual(self.sim.read()['assignments'],[])
 def test_case_edit_during_inference_discards_result(self):
  sources=feed([call()]);self.sim.sync_public(sources);i=self.complete(self.public()[0]);arc=object.__new__(ARC)
  arc.city='toronto';arc.sim=self.sim;arc.public_context=SimpleNamespace(snapshot=lambda:sources);arc.last_integration={}
  arc.routes=SimpleNamespace(get=lambda a,b:{'duration_s':30,'distance_m':100,'coordinates':[[a['lon'],a['lat']],[b['lon'],b['lat']]],'source':'test','mode':'test'})
  arc.sync_world=lambda s:{'prior':{},'events':0};arc.world=SimpleNamespace(call=lambda *a,**k:self.fail('Changed result must not be recorded'))
  groups={k:self.sim.feed(k)['records'] for k in ['fleet','hospitals','roads']};version=self.sim.read()['version']
  def explain(*args):
   self.complete(i,notes='Changed during inference')
   return {'evidence_ids':['E1'],'change_ids':[]},{}
  with patch('backend.assessment.Agent') as agent,patch('backend.assessment.Federation') as federation:
   agent.return_value.plan.return_value=(['federate_resources','calculate_routes','recall_world_history'],{})
   agent.return_value.explain.side_effect=explain;federation.return_value.snapshot.return_value=(groups,{'version':version,'rows':len(groups),'duration_ms':1})
   with self.assertRaisesRegex(RuntimeError,'Results discarded'):arc.analyze(i['id'],'assess',{})
  self.assertEqual(self.sim.db.execute('SELECT count(*) FROM recommendations').fetchone()[0],0)
 def test_rejection_during_automatic_refresh_is_not_overwritten(self):
  sources=feed([call()]);self.sim.sync_public(sources);i=self.complete(self.public()[0]);r=self.proposal(i)
  r['selected'].update(id='A-12 / H-TGH',name='Medic 12 → Toronto General',pickup_min=.5,transport_min=.5)
  r['simulation_epoch']=self.sim.read()['epoch'];self.sim.db.execute('UPDATE recommendations SET payload=? WHERE id=?',(__import__('json').dumps(r),r['id']))
  arc=object.__new__(ARC);arc.city='toronto';arc.sim=self.sim;arc.public_context=SimpleNamespace(snapshot=lambda:sources);arc.last_integration={}
  arc.routes=SimpleNamespace(get=lambda a,b:{'duration_s':30,'distance_m':100,'coordinates':[[a['lon'],a['lat']],[b['lon'],b['lat']]],'source':'test','mode':'test'})
  arc.sync_world=lambda s:{'prior':{},'events':0};arc.world=SimpleNamespace(call=lambda *a,**k:self.fail('Rejected refresh must not be recorded'))
  groups={k:self.sim.feed(k)['records'] for k in ['fleet','hospitals','roads']};version=self.sim.read()['version']
  def explain(*args):
   self.sim.decide(r['id'],'reject');return {'evidence_ids':['E1'],'change_ids':[]},{}
  with patch('backend.assessment.Agent') as agent,patch('backend.assessment.Federation') as federation:
   agent.return_value.plan.return_value=(['federate_resources','calculate_routes','recall_world_history'],{})
   agent.return_value.explain.side_effect=explain;federation.return_value.snapshot.return_value=(groups,{'version':version,'rows':len(groups),'duration_ms':1})
   with self.assertRaisesRegex(RuntimeError,'rejected the plan during refresh'):arc.analyze(i['id'],'assess',{'automatic':True})
  self.assertEqual(self.sim.latest_recommendations()[i['id']]['decision'],'rejected')
 def test_restart_preserves_case_and_dispatcher_details(self):
  self.sim.sync_public(feed([call()]));i=self.complete(self.public()[0]);self.sim.db.close();self.sim=Simulation(self.path);self.sim.sync_public(feed([call()]))
  self.assertEqual(len(self.public()),1);self.assertEqual(self.public()[0]['notes'],i['notes']);self.assertEqual(self.public()[0]['incident_revision'],i['incident_revision'])

if __name__=='__main__':unittest.main()
