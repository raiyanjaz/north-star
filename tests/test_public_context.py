import io
import json
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch
from public_context import PublicContext, fire_records, hospital_records, police_records, camera_records
from integrations import road_records, Routes
from simulation import Simulation, stamp


class PublicTests(unittest.TestCase):
 def test_medical_postal_area_never_becomes_precise_location(self):
  rows, updated=fire_records('<tfs_active_incidents><update_from_db_time>2026-10-23 15:00:00</update_from_db_time><event><event_num>F1</event_num><event_type>MEDICAL</event_type><prime_street>M4X</prime_street><dispatch_time>2026-10-23T14:55:00</dispatch_time></event></tfs_active_incidents>')
  self.assertEqual(rows[0]['location'],'M4X');self.assertNotIn('lat',rows[0]);self.assertTrue(updated.endswith('-04:00'))
 def test_police_requires_valid_toronto_coordinates(self):
  record={'OBJECTID':1,'CALL_TYPE':'COLLISION','CROSS_STREETS':'A / B','LATITUDE':43.65,'LONGITUDE':-79.38,'OCCURRENCE_TIME':1792780000000}
  self.assertEqual(len(police_records({'features':[{'attributes':record}]})),1)
  record['LATITUDE']=float('nan');self.assertEqual(police_records({'features':[{'attributes':record}]}),[])
  with self.assertRaises(ValueError):police_records({'error':{'message':'failure'}})
 def test_hospital_readings_keep_missing_wait_and_source_time(self):
  h={'id':'x','slug':'x','name':'Hospital','city':'Toronto','coordinates':{'lat':43.65,'lng':-79.38},'hasLiveData':True,'status':'offline','estimated_wait_time':12,'last_updated':None}
  chunk='48:'+json.dumps(['$','component',None,{'hospitals':[h]}])
  html='<script>self.__next_f.push('+json.dumps([1,chunk])+')</script>'
  r=hospital_records(html)[0];self.assertIsNone(r['wait_min']);self.assertIsNone(r['observed_at'])
 def test_camera_ids_cannot_be_urls_or_paths(self):
  text='jsonTMCEarthCamerasCallback('+json.dumps({'Data':[{'Number':'../secret','Latitude':43.65,'Longitude':-79.38}]})+');'
  self.assertEqual(camera_records(text),[])
 def test_roads_exclude_upcoming_expired_and_preserve_partial_impact(self):
  r={'id':'x','road':'Queen','latitude':'43.65','longitude':'-79.38','startTime':'1000','endTime':'4000','expired':0,'geoPolyline':'[-79.38,43.65],[-79.39,43.65]','type':'CONSTRUCTION','currImpact':'Low'}
  self.assertEqual(road_records({'Closure':[r]},now=2)[0]['impact'],'Low')
  self.assertEqual(road_records({'Closure':[r]},now=5),[])
  self.assertEqual(road_records({'Closure':[r]},now=0),[])
 def test_failed_refresh_preserves_data_without_claiming_live(self):
  p=PublicContext(None,'.',start=False)
  p.sources['police']={'mode':'live','records':[{'id':'x'}],'fetched_epoch':time.time()-500}
  with patch('public_context.fetch_text',side_effect=OSError()):p.refresh_one('police')
  s=p.snapshot()['police'];self.assertEqual(s['mode'],'cached');self.assertTrue(s['stale']);self.assertEqual(s['records'],[{'id':'x'}])
 def test_old_publisher_timestamp_is_stale_even_after_successful_fetch(self):
  p=PublicContext(None,'.',start=False)
  p.sources['fire']={'mode':'live','records':[],'fetched_epoch':time.time(),'observed_at':stamp(time.time()-1800),'ttl_s':300}
  self.assertTrue(p.snapshot()['fire']['stale'])
 def test_traffic_routes_use_provider_geometry_and_short_cache(self):
  payload={'routes':[{'summary':{'travelTimeInSeconds':123,'lengthInMeters':456,'trafficDelayInSeconds':12},'legs':[{'points':[{'latitude':43.65,'longitude':-79.38},{'latitude':43.66,'longitude':-79.39}]}]}]}
  with tempfile.TemporaryDirectory() as d:
   routes=Routes(Path(d)/'routes.json');a={'lat':43.65,'lon':-79.38};b={'lat':43.66,'lon':-79.39}
   with patch('integrations.setting',return_value='test-key'),patch('integrations.urlopen',return_value=io.BytesIO(json.dumps(payload).encode())) as fetch:
    r=routes.get(a,b);self.assertTrue(r['traffic_aware']);self.assertEqual(r['duration_s'],123);self.assertEqual(r['coordinates'][0],[-79.38,43.65]);self.assertNotIn('test-key',json.dumps(r))
    self.assertIn('traffic=true',fetch.call_args.args[0].full_url);self.assertIn('departAt=now',fetch.call_args.args[0].full_url)
    cached=routes.get(a,b);self.assertEqual(cached['mode'],'cached');self.assertEqual(fetch.call_count,1)
 def test_configured_traffic_failure_does_not_silently_use_static_routes(self):
  with tempfile.TemporaryDirectory() as d:
   routes=Routes(Path(d)/'routes.json')
   with patch('integrations.setting',return_value='test-key'),patch('integrations.urlopen',side_effect=OSError('private URL')):
    with self.assertRaisesRegex(RuntimeError,'no static substitute') as caught:routes.get({'lat':43.65,'lon':-79.38},{'lat':43.66,'lon':-79.39})
    self.assertNotIn('private URL',str(caught.exception))
 def test_public_review_requires_explicit_requirements_and_deduplicates_rebuilt_ids(self):
  with tempfile.TemporaryDirectory() as d:
   sim=Simulation(Path(d)/'test.sqlite');version=sim.read()['version'];call={'id':'TPS-1','name':'COLLISION','location':'A / B','lat':43.65,'lon':-79.38,'observed_at':stamp()}
   with self.assertRaises(ValueError):sim.add_public_review(call,None,'general','Priority 2')
   self.assertEqual(sim.read()['version'],version)
   r=sim.add_public_review(call,'general','general','Priority 2');self.assertEqual(sim.read()['version'],version+1)
   call['id']='TPS-99';r2=sim.add_public_review(call,'general','general','Priority 2');self.assertEqual(r['incident_id'],r2['incident_id']);self.assertFalse(r2['created'])
   self.assertEqual(sim.read()['version'],version+1);self.assertEqual(sim.read()['incidents'][-1]['requirements_source'],'dispatcher');sim.db.close()

if __name__=='__main__':unittest.main()
