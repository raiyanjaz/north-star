import tempfile
import threading
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from simulation import Simulation
from agent_control import AgentCoordinator
from coordination import commitments, resource_blocker
from decision import evaluate

class SupervisorTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.sim=Simulation(Path(self.tmp.name)/'state.sqlite')
  s=self.sim.read();s['incidents']=s['incidents'][:2]
  s['incidents'][0].update(priority='Priority 2',service='general',equipment='general')
  s['incidents'][1].update(priority='Priority 1',service='general',equipment='general')
  self.sim.save(s);self.calls=[]
  self.arc=SimpleNamespace(sim=self.sim,jobs={},jobs_lock=threading.Lock(),analysis_lock=threading.Lock(),public_context=SimpleNamespace(snapshot=lambda:{}))
  def start(iid,request,**kwargs):
   self.arc.analysis_lock.acquire();job={'id':'j','incident_id':iid,'status':'running','stage':'Checking evidence',**kwargs};self.arc.jobs['j']=job;self.calls.append(job);return job
  self.arc.start_analysis=start;self.agent=AgentCoordinator(self.arc,start=False)
 def tearDown(self):self.sim.db.close();self.tmp.cleanup()
 def rec(self,iid,unit='A-12',hospital='H-TGH',age=0,decision='pending'):
  s=self.sim.read();r={'id':iid+'-'+str(time.time_ns()),'incident_id':iid,'version':s['version'],'simulation_epoch':s['epoch'],'incident_revision':0,'decision':decision,'approvable':True,'evidence_epoch':time.time()-age,'created_epoch':time.time(),'selected':{'ambulance_id':unit,'hospital_id':hospital}}
  self.sim.store_rec(r);return r
 def test_starts_highest_priority_once_without_human_trigger(self):
  self.agent.tick();self.agent.tick();self.assertEqual(len(self.calls),1);self.assertEqual(self.calls[0]['incident_id'],'INC-1043');self.assertTrue(self.calls[0]['automatic']);self.assertEqual(self.sim.read()['assignments'],[])
 def test_missing_inputs_never_start_inference(self):
  s=self.sim.read()
  for i in s['incidents']:i.update(public_source='Toronto Fire',public_feed_status='present',priority=None)
  self.sim.save(s);self.agent.tick();self.assertEqual(self.calls,[]);self.assertTrue(all(v['state']=='needs_input' for v in self.agent.snapshot()['states'].values()))
 def test_feed_history_does_not_repeat_resource_coordination(self):
  s=self.sim.read()
  s['incidents'] += [dict(s['incidents'][0],id='history-'+str(n),public_source='Toronto Fire',public_feed_status='missing',priority=None,service=None,equipment=None) for n in range(1000)]
  with patch('agent_control.commitments',wraps=commitments) as calculate:
   _,states,_=self.agent.inspect(state=s,recs={})
  self.assertEqual(calculate.call_count,2)
  self.assertEqual(states['history-999']['state'],'watching')
 def test_pausing_keeps_resources_and_prevents_new_work(self):
  before=self.sim.read();self.agent.set_enabled(False);self.agent.tick();after=self.sim.read();self.assertEqual(self.calls,[]);self.assertEqual(after['version'],before['version']);self.assertEqual(after['fleet'],before['fleet'])
 def test_fresh_plan_waits_for_approval_then_refreshes_automatically(self):
  self.rec('INC-1043');_,states,work=self.agent.inspect();self.assertEqual(states['INC-1043']['state'],'awaiting_approval');self.assertNotIn('INC-1043',[i['id'] for i,_,_ in work])
  self.rec('INC-1043',age=85);_,_,work=self.agent.inspect();self.assertEqual(work[0][0]['id'],'INC-1043');self.assertEqual(work[0][2],'evidence refresh')
 def test_resource_change_triggers_reassessment(self):
  self.rec('INC-1043');self.sim.scenario('fleet-busy','INC-1043');_,_,work=self.agent.inspect();self.assertEqual(work[0][0]['id'],'INC-1043');self.assertEqual(work[0][2],'changed conditions')
 def test_no_units_waits_without_busy_retry_loop(self):
  s=self.sim.read()
  for a in s['fleet']:a['status']='busy'
  self.sim.save(s)
  for _ in range(4):self.agent.tick()
  self.assertEqual(self.calls,[]);self.assertEqual(self.agent.snapshot()['states']['INC-1043']['state'],'waiting')
  s=self.sim.read();s['fleet'][0]['status']='available';s['version']+=1;self.sim.save(s);self.agent.tick();self.assertEqual(len(self.calls),1)
 def test_failed_services_back_off_and_surface_after_three_failures(self):
  _,_,work=self.agent.inspect();fp=work[0][1]
  for _ in range(3):self.agent.finished({'incident_id':'INC-1043','fingerprint':fp,'status':'error','error':'Service unavailable'})
  _,states,work=self.agent.inspect();self.assertEqual(states['INC-1043']['state'],'needs_input');self.assertNotIn('INC-1043',[i['id'] for i,_,_ in work])
 def test_budget_bounds_automatic_requests(self):
  self.agent.started.extend([time.time()]*16);self.agent.tick();self.assertEqual(self.calls,[]);self.assertIn('rate limit',self.agent.snapshot()['states']['INC-1043']['reason'])
 def test_rejection_does_not_keep_resubmitting_the_same_plan(self):
  self.rec('INC-1043',decision='rejected');_,states,work=self.agent.inspect();self.assertEqual(states['INC-1043']['state'],'needs_input');self.assertNotIn('INC-1043',[i['id'] for i,_,_ in work])
 def test_higher_priority_proposal_blocks_duplicate_unit_and_invalidates_lower_plan(self):
  lower=self.rec('INC-1042');self.rec('INC-1043');self.assertFalse(self.sim.get_rec(lower['id'])['approvable'])
  with self.assertRaises(ValueError):self.sim.decide(lower['id'],'approve')
  coord=self.sim.coordination('INC-1042');self.assertEqual(coord['units']['A-12'],'INC-1043')
  s=self.sim.read();groups={k:self.sim.feed(k)['records'] for k in ['fleet','hospitals','roads']}
  routes=SimpleNamespace(get=lambda a,b:{'duration_s':10,'distance_m':100,'coordinates':[[a['lon'],a['lat']],[b['lon'],b['lat']]],'source':'test','mode':'test'})
  result=evaluate(s['incidents'][0],groups,routes,coordination=coord);self.assertEqual(result['selected']['ambulance_id'],'A-24')
 def test_freeing_a_higher_priority_commitment_does_not_block_a_safe_plan(self):
  higher=self.rec('INC-1043');lower=self.rec('INC-1042',unit='A-24');self.sim.decide(higher['id'],'reject');self.assertEqual(self.sim.decide(lower['id'],'approve')['decision'],'approved')
 def test_superseded_plan_cannot_be_approved(self):
  old=self.rec('INC-1043');new=self.rec('INC-1043',unit='A-24')
  self.assertEqual(self.sim.get_rec(old['id'])['superseded_by'],new['id'])
  with self.assertRaisesRegex(ValueError,'newer plan'):self.sim.decide(old['id'],'approve')
 def test_ready_plan_remains_approvable_during_background_refresh(self):
  r=self.rec('INC-1043',age=85);self.arc.jobs['refresh']={'incident_id':'INC-1043','status':'running','stage':'Refreshing evidence','automatic':True}
  self.assertEqual(self.agent.snapshot()['states']['INC-1043']['state'],'awaiting_approval')
  self.assertEqual(self.sim.decide(r['id'],'approve')['decision'],'approved')
 def test_hospital_slots_are_coordinated(self):
  s=self.sim.read();s['hospitals'][0]['slots']=1;self.sim.save(s);self.rec('INC-1043')
  coord=self.sim.coordination('INC-1042');self.assertEqual(coord['slots']['H-TGH'],1)
 def test_prepared_intake_is_additive_idempotent_and_provenanced(self):
  before=self.sim.read();self.assertTrue(self.sim.load_demo_intake());after=self.sim.read();self.assertEqual(after['assignments'],before['assignments']);self.assertEqual(len(after['fleet']),len(before['fleet'])+2)
  self.assertTrue(all(i['requirements_source']=='prepared_demo' for i in after['incidents'] if i.get('prepared_intake')))
  self.assertFalse(self.sim.load_demo_intake());self.assertEqual(self.sim.read()['version'],after['version'])

if __name__=='__main__':unittest.main()
