import copy, concurrent.futures, tempfile, time, unittest
from pathlib import Path
from simulation import Simulation, INCIDENTS, stamp
from decision import evaluate
from integrations import blocked, World

class FakeRoutes:
 def get(self,a,b):return {'duration_s':120 if b['id']=='H-TGH' else 240,'distance_m':1000,'coordinates':[[a['lon'],a['lat']],[b['lon'],b['lat']]],'mode':'cached','source':'test route'}

class DecisionTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.sim=Simulation(Path(self.tmp.name)/'test.sqlite');self.groups={k:self.sim.feed(k)['records'] for k in ['fleet','hospitals','roads']}
 def tearDown(self):self.sim.db.close();self.tmp.cleanup()
 def assess(self,incident=None):return evaluate(incident or INCIDENTS[0],self.groups,FakeRoutes())
 def proposal(self,id='r1',incident='INC-1042'):
  p=self.assess()['selected'];r={'id':id,'version':self.sim.read()['version'],'incident_id':incident,'selected':p,'decision':'pending','approvable':True,'created_epoch':time.time(),'simulation_epoch':self.sim.read()['epoch']};self.sim.store_rec(r);return r
 def test_baseline_and_real_constraints(self):
  r=self.assess();self.assertEqual(r['selected']['hospital_id'],'H-TGH');self.assertEqual(r['selected']['ambulance_id'],'A-12');self.assertTrue(any('Does not meet' in ' '.join(a['reasons']) for a in r['alternatives']))
 def test_dispatcher_can_select_only_an_eligible_alternative(self):
  r=evaluate(INCIDENTS[0],self.groups,FakeRoutes(),'A-24 / H-SMH')
  self.assertEqual(r['selected']['ambulance_id'],'A-24');self.assertEqual(r['selection_basis'],'dispatcher')
  self.assertIn('Medic 24',r['evidence'][0]['text'])
  with self.assertRaises(ValueError):evaluate(INCIDENTS[0],self.groups,FakeRoutes(),'A-37 / H-SK')
 def test_specialist_service_not_invented(self):self.assertEqual(self.assess(INCIDENTS[1])['selected']['hospital_id'],'H-TWH')
 def test_stale_and_missing_evidence(self):
  self.groups['hospitals'][0]['observed_at']=stamp(time.time()-2000);self.assertIsNone(self.assess()['selected'])
  self.groups['hospitals'][0].pop('observed_at');self.assertIsNone(self.assess()['selected'])
 def test_unavailable_hospital_excluded(self):
  self.groups['hospitals'][0]['accepting']=0;self.assertNotEqual(self.assess()['selected']['hospital_id'],'H-TGH')
 def test_no_destination(self):
  for h in self.groups['hospitals']:h['accepting']=0
  self.assertIsNone(self.assess()['selected'])
 def test_no_available_fleet(self):
  for a in self.groups['fleet']:a['status']='busy'
  self.assertIsNone(self.assess()['selected'])
 def test_route_failure_no_invented_eta(self):
  class Broken:
   def get(self,*a):raise RuntimeError('offline')
  self.assertIsNone(evaluate(INCIDENTS[0],self.groups,Broken())['selected'])
 def test_closure_detects_segment_crossing(self):
  route={'coordinates':[[-79.4,43.65],[-79.38,43.65]]};c=[{'active':1,'lat':43.65,'lon':-79.39,'radius_m':50,'name':'closed'}];self.assertEqual(blocked(route,c),'closed')
 def test_approval_reserves_atomically(self):
  r=self.proposal();self.sim.decide(r['id'],'approve');s=self.sim.read();self.assertEqual(s['fleet'][0]['status'],'assigned');self.assertEqual(s['hospitals'][0]['slots'],2);self.assertEqual(s['incidents'][0]['status'],'assigned')
 def test_rejection_reserves_nothing(self):
  r=self.proposal();before=self.sim.read();self.sim.decide(r['id'],'reject');self.assertEqual(self.sim.read(),before)
 def test_changed_conditions_require_renewed_approval(self):
  r=self.proposal();self.sim.scenario('fleet-busy')
  with self.assertRaises(ValueError):self.sim.decide(r['id'],'approve')
 def test_expired_approval(self):
  r=self.proposal();r['id']='old';r['created_epoch']=time.time()-121;self.sim.store_rec(r)
  with self.assertRaises(ValueError):self.sim.decide('old','approve')
 def test_duplicate_and_concurrent_reservation(self):
  self.proposal('r1');self.proposal('r2','INC-1043')
  def go(id):
   try:self.sim.decide(id,'approve');return True
   except ValueError:return False
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as p:out=list(p.map(go,['r1','r2']))
  self.assertEqual(sum(out),1);self.assertEqual(len(self.sim.read()['assignments']),1)
 def test_scenario_targets_reviewed_incident_not_latest_other_proposal(self):
  self.proposal('r1','INC-1042');other=self.proposal('r2','INC-1043');other['selected']['hospital_id']='H-SMH'
  self.sim.db.execute('UPDATE recommendations SET payload=? WHERE id=?',(__import__('json').dumps(other),'r2'))
  self.sim.scenario('hospital-unavailable','INC-1042');h={h['id']:h for h in self.sim.read()['hospitals']}
  self.assertEqual(h['H-TGH']['accepting'],0);self.assertEqual(h['H-SMH']['accepting'],1)
 def test_reset_preserves_version_monotonicity(self):
  v=self.sim.read()['version'];self.sim.scenario('no-destination');s=self.sim.reset();self.assertGreater(s['version'],v);self.assertTrue(all(h['accepting'] for h in s['hospitals']))

class WorldTests(unittest.TestCase):
 def test_real_reference_persists_and_recalls_prior_state(self):
  with tempfile.TemporaryDirectory() as tmp:
   w=World(tmp);item={'type':'hospital','id':'h1','name':'Hospital','attrs':{'accepting':1}};w.call('record',items=[item]);item['attrs']['accepting']=0;r=w.call('record',items=[item]);self.assertEqual(r['prior']['h1']['accepting'],1);w.close()
   w=World(tmp);r=w.call('inspect');self.assertEqual(r['entities'][0]['attrs']['accepting'],0);w.close()

if __name__=='__main__':unittest.main()
