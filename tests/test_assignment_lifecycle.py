import concurrent.futures
import tempfile
import time
import threading
import unittest
from pathlib import Path
from unittest.mock import patch

from assignment_lifecycle import PHASES, route_plan, route_position
from simulation import Simulation
from station_locations import TORONTO_STATIONS
from agent_control import AgentCoordinator
from types import SimpleNamespace


class LifecycleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.path = Path(self.tmp.name)/'state.sqlite'
        self.sim = Simulation(self.path)
        self.now = time.time()

    def tearDown(self):
        self.sim.db.close(); self.tmp.cleanup()

    def approve(self, sim=None, iid=None):
        sim = sim or self.sim; state = sim.read()
        incident = next(i for i in state['incidents'] if i['id'] == iid) if iid else state['incidents'][0]
        incident['service'] = 'general'; incident['equipment'] = 'general'; sim.save(state)
        unit, hospital = state['fleet'][0], state['hospitals'][0]
        pickup = {'duration_s': 120, 'coordinates': [[unit['lon'], unit['lat']],
            [unit['lon']+.0005, unit['lat']], [incident['lon'], incident['lat']]]}
        transport = {'duration_s': 240, 'coordinates': [[incident['lon'], incident['lat']],
            [hospital['lon'], incident['lat']], [hospital['lon'], hospital['lat']]]}
        rec = {'id': 'rec-'+str(time.time_ns()), 'incident_id': incident['id'], 'version': state['version'],
            'incident_revision': incident.get('incident_revision', 0), 'decision': 'pending',
            'simulation_epoch': state['epoch'], 'approvable': True, 'created_epoch': self.now,
            'evidence_epoch': self.now, 'selected': {'ambulance_id': unit['id'], 'hospital_id': hospital['id'],
            'pickup_route': pickup, 'transport_route': transport}}
        sim.store_rec(rec)
        with patch('backend.domain.proposals.time.time', return_value=self.now): sim.decide(rec['id'], 'approve')
        return sim.read()['assignments'][-1]

    def assignment(self, sim=None): return (sim or self.sim).read()['assignments'][-1]

    def test_all_stages_move_along_routes_and_release_exactly_once(self):
        before = self.sim.read(); assignment = self.approve()
        for phase in PHASES[1:]:
            current = self.assignment()
            self.sim.advance_assignments(current['phase_ends_epoch']+.001)
            self.assertEqual(self.assignment()['phase'], phase)
            state = self.sim.read()
            if phase != 'completed':
                self.assertEqual(state['fleet'][0]['status'], 'assigned')
                self.assertEqual(state['hospitals'][0]['slots'], before['hospitals'][0]['slots']-1)
        state = self.sim.read()
        self.assertEqual(state['fleet'][0]['status'], 'available')
        self.assertEqual([state['fleet'][0]['lon'], state['fleet'][0]['lat']], assignment['destination'])
        self.assertEqual(state['incidents'][0]['status'], 'completed')
        self.assertEqual(state['hospitals'][0]['slots'], before['hospitals'][0]['slots'])
        self.assertEqual([event['phase'] for event in self.assignment()['history']], list(PHASES))
        self.sim.advance_assignments(self.now+10000)
        self.assertEqual(self.sim.read(), state)
        with self.assertRaisesRegex(ValueError, 'already ended'):
            self.sim.progress_assignment(assignment['id'], self.assignment()['revision'], 'advance', self.now+10000)

    def test_motion_stays_on_captured_polyline_and_not_a_straight_line_shortcut(self):
        route = route_plan({'duration_s': 100, 'coordinates': [[0, 0], [0, 1], [1, 1]]})
        first = route_position(route, .25); second = route_position(route, .75)
        self.assertAlmostEqual(first[0], 0); self.assertAlmostEqual(second[1], 1)
        self.assertEqual(route_position(route, 1), [1, 1])
        for route in ({}, {'duration_s': float('nan'), 'coordinates': [[0, 0], [1, 1]]},
                      {'duration_s': 2, 'coordinates': [[0, 91], [1, 1]]}):
            self.assertIsNone(route_plan(route))

    def test_restart_catches_up_but_does_not_release_twice(self):
        self.approve(); self.sim.db.close(); self.sim = Simulation(self.path)
        self.sim.advance_assignments(self.now+1000)
        self.assertEqual(self.assignment()['phase'], 'completed')
        slots = self.sim.read()['hospitals'][0]['slots']
        self.sim.db.close(); self.sim = Simulation(self.path)
        self.sim.advance_assignments(self.now+2000)
        self.assertEqual(self.sim.read()['hospitals'][0]['slots'], slots)

    def test_busy_unit_is_not_released_early_and_stale_control_is_rejected(self):
        assignment = self.approve(); version = self.sim.read()['version']
        self.sim.progress_assignment(assignment['id'], assignment['revision'], 'advance', self.now+.1)
        with self.assertRaisesRegex(ValueError, 'progress changed'):
            self.sim.progress_assignment(assignment['id'], assignment['revision'], 'advance', self.now+.2)
        self.assertEqual(self.sim.read()['version'], version)
        self.assertEqual(self.sim.read()['fleet'][0]['status'], 'assigned')

    def test_legacy_assignments_are_manual_and_preserve_resource_positions(self):
        state = self.sim.read(); state['fleet'][0]['status'] = 'assigned'; state['incidents'][0]['status'] = 'assigned'
        state['hospitals'][0]['slots'] -= 1
        state['assignments'] = [{'incident_id': state['incidents'][0]['id'], 'ambulance_id': state['fleet'][0]['id'],
            'hospital_id': state['hospitals'][0]['id'], 'at': '2020-01-01T00:00:00+00:00'}]
        self.sim.save(state); self.sim.db.close(); self.sim = Simulation(self.path)
        self.sim.advance_assignments(self.now+100000)
        self.assertEqual(self.assignment()['phase'], 'assigned')
        self.assertFalse(self.assignment()['automatic'])
        self.assertEqual(self.sim.read()['fleet'][0]['lat'], state['fleet'][0]['lat'])
        for _ in range(5):
            assignment = self.assignment()
            self.sim.progress_assignment(assignment['id'], assignment['revision'], 'advance', self.now)
        self.assertEqual(self.assignment()['phase'], 'completed')
        self.assertEqual(self.sim.read()['fleet'][0]['lat'], state['hospitals'][0]['lat'])

    def test_destination_disruption_holds_until_available_then_resumes_without_time_jump(self):
        self.approve(); state = self.sim.read(); state['hospitals'][0]['accepting'] = 0; self.sim.save(state)
        self.sim.advance_assignments(self.now+1)
        held = self.assignment(); self.assertTrue(held['hold_reason'])
        self.sim.advance_assignments(self.now+1000)
        self.assertEqual(self.assignment()['phase'], 'assigned')
        with self.assertRaisesRegex(ValueError, 'unavailable'):
            self.sim.progress_assignment(held['id'], held['revision'], 'advance', self.now+1000)
        state = self.sim.read(); state['hospitals'][0]['accepting'] = 1; self.sim.save(state)
        self.sim.advance_assignments(self.now+1000)
        resumed = self.assignment()
        self.assertNotIn('hold_reason', resumed); self.assertEqual(resumed['phase'], 'assigned')
        self.assertAlmostEqual(resumed['phase_ends_epoch'], self.now+1000.5)

    def test_closure_holds_route_and_ending_exercise_releases_at_current_position(self):
        assignment = self.approve(); start = self.sim.read()['fleet'][0]
        state = self.sim.read(); state['closures'] = [{'name': 'Closed', 'active': 1,
            'lat': state['incidents'][0]['lat'], 'lon': state['incidents'][0]['lon'], 'radius_m': 100}]
        self.sim.save(state); self.sim.advance_assignments(self.now+.1)
        self.assertIn('closure', self.assignment()['hold_reason'])
        assignment = self.assignment()
        self.sim.progress_assignment(assignment['id'], assignment['revision'], 'cancel', self.now+.2)
        after = self.sim.read()
        self.assertEqual(after['fleet'][0]['status'], 'available')
        self.assertEqual(after['fleet'][0]['lat'], start['lat'])
        self.assertEqual(after['incidents'][0]['status'], 'cancelled')

    def test_speed_change_preserves_progress(self):
        self.approve(); self.sim.advance_assignments(self.now+2)
        self.assertEqual(self.assignment()['phase'], 'responding')
        sample = self.now+5
        self.sim.advance_assignments(sample); before = self.sim.read()['fleet'][0]
        self.sim.set_journey_speed(30, sample)
        self.sim.advance_assignments(sample)
        after = self.sim.read()['fleet'][0]
        self.assertAlmostEqual(before['lat'], after['lat']); self.assertAlmostEqual(before['lon'], after['lon'])
        for speed in (0, -1, True, 100, '30'):
            with self.assertRaises(ValueError): self.sim.set_journey_speed(speed, sample)

    def test_released_unit_is_not_sent_back_to_station_and_feed_schema_is_stable(self):
        assignment = self.approve(); self.sim.advance_assignments(self.now+1000)
        state = self.sim.read(); unit = state['fleet'][0]; last = [unit['lat'], unit['lon']]
        self.sim.sync_public({'stations': {'mode': 'live', 'stale': False, 'records': [
            {'id': 'station', 'name': 'Station 1', 'address': '1 A St', 'staging_eligible': True,
             'lat': 43.7, 'lon': -79.4}], 'source_url': TORONTO_STATIONS}})
        unit = self.sim.read()['fleet'][0]
        self.assertEqual([unit['lat'], unit['lon']], last)
        row = self.sim.feed('fleet')['records'][0]
        self.assertEqual(set(row), {'id','name','lat','lon','equipment','status','version','source','observed_at'})
        self.assertEqual(row['source'], 'simulated_journey')

    def test_resource_ownership_mismatch_never_frees_another_assignment(self):
        self.approve(); state = self.sim.read(); state['fleet'][0]['active_assignment_id'] = 'different'; self.sim.save(state)
        self.sim.advance_assignments(self.now+1000)
        self.assertEqual(self.sim.read()['fleet'][0]['status'], 'assigned')
        self.assertIn('resources changed', self.assignment()['hold_reason'])

    def test_seattle_progress_does_not_change_toronto(self):
        seattle = Simulation(Path(self.tmp.name)/'seattle.sqlite', 'seattle'); before = self.sim.read()
        try:
            self.approve(seattle); seattle.advance_assignments(self.now+1000)
            self.assertEqual(seattle.read()['fleet'][0]['status'], 'available')
            self.assertEqual(self.sim.read(), before)
        finally: seattle.db.close()

    def test_double_completion_requests_do_not_duplicate_capacity(self):
        assignment = self.approve()
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            list(pool.map(lambda _: self.sim.advance_assignments(self.now+1000), range(2)))
        self.assertEqual(self.sim.read()['hospitals'][0]['slots'], 3)
        self.assertEqual(sum(e['phase'] == 'completed' for e in self.assignment()['history']), 1)

    def test_paused_assessment_supervisor_still_advances_approved_journeys(self):
        self.approve(); state = self.sim.read(); state['agent_enabled'] = False; self.sim.save(state)
        arc = SimpleNamespace(sim=self.sim, public_context=SimpleNamespace(snapshot=lambda: {}),
            jobs={}, jobs_lock=threading.Lock(), analysis_lock=threading.Lock())
        supervisor = AgentCoordinator(arc, start=False)
        with patch('agent_control.time.time', return_value=self.now+1000): supervisor.tick()
        self.assertEqual(self.assignment()['phase'], 'completed')
        self.assertEqual(self.sim.read()['fleet'][0]['status'], 'available')
