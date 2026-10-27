import json
import tempfile
import threading
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from http.server import ThreadingHTTPServer

from app import Handler
from cities import CITIES
from incident_intake import incident_issues, valid_pickup
from integrations import Federation
from public_context import PublicContext, seattle_records, SEATTLE_FIRE
from simulation import Simulation, stamp


def public_call():
    return {'incident_number': 'F260100', 'datetime': '2026-10-27T10:05:00.000',
            'type': 'Aid Response', 'address': '4th Ave / Pike St',
            'latitude': '47.6102', 'longitude': '-122.336'}


class SeattleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.directory = Path(self.tmp.name)
        self.toronto = Simulation(self.directory / 'toronto.sqlite')
        self.seattle = Simulation(self.directory / 'seattle.sqlite', 'seattle')

    def tearDown(self):
        self.toronto.db.close(); self.seattle.db.close(); self.tmp.cleanup()

    def source(self, rows, fresh=True):
        return {'fire': {'mode': 'live' if fresh else 'cached', 'stale': not fresh,
                         'records': rows, 'source_url': SEATTLE_FIRE}}

    def test_city_bounds_reject_cross_city_pickups(self):
        self.assertTrue(valid_pickup(47.61, -122.33, 'seattle'))
        self.assertFalse(valid_pickup(43.65, -79.38, 'seattle'))
        self.assertFalse(valid_pickup(47.61, -122.33, 'toronto'))
        self.assertFalse(valid_pickup(True, -122.33, 'seattle'))

    def test_timezone_dedup_and_no_inferred_requirements(self):
        row = public_call()
        rows = seattle_records([row, dict(row, type='Older duplicate')])
        self.assertEqual(len(rows), 1)
        self.assertTrue(rows[0]['observed_at'].endswith('-07:00'))
        self.seattle.sync_public(self.source(rows)); self.seattle.sync_public(self.source(rows))
        incident = next(i for i in self.seattle.read()['incidents'] if i.get('public_source'))
        self.assertEqual(incident['id'], 'LIVE-SFD-F260100')
        self.assertEqual(incident['public_source'], 'Seattle Fire Department')
        self.assertEqual(incident['lat'], 47.6102)
        self.assertIsNone(incident['priority']); self.assertIsNone(incident['service'])
        self.assertIn('Choose a priority', incident_issues(incident))
        self.assertNotIn('Confirm a pickup location', incident_issues(incident))
        self.assertEqual(sum(bool(i.get('public_source')) for i in self.seattle.read()['incidents']), 1)

    def test_snapshot_limit_and_invalid_locations(self):
        with self.assertRaises(ValueError): seattle_records([public_call()] * 1000)
        row = dict(public_call(), latitude='43.65', longitude='-79.38')
        self.assertIsNone(seattle_records([row])[0]['lat'])
        with self.assertRaises(ValueError): seattle_records({'error': 'unavailable'})

    def test_dispatcher_edits_survive_source_updates_and_restart(self):
        rows = seattle_records([public_call()]); self.seattle.sync_public(self.source(rows))
        i = next(i for i in self.seattle.read()['incidents'] if i.get('public_source'))
        self.seattle.update_incident_details(i['id'], {'revision': i['incident_revision'],
            'priority': 'Priority 2', 'service': 'general', 'equipment': 'advanced',
            'lat': 47.62, 'lon': -122.34, 'pickup_label': 'Confirmed pickup', 'notes': 'Reviewed'})
        rows[0].update(lat=47.63, name='Updated response')
        self.seattle.sync_public(self.source(rows))
        self.seattle.db.close(); self.seattle = Simulation(self.directory / 'seattle.sqlite', 'seattle')
        i = next(i for i in self.seattle.read()['incidents'] if i.get('public_source'))
        self.assertEqual(i['lat'], 47.62); self.assertEqual(i['notes'], 'Reviewed')
        self.assertTrue(i['source_review_required']); self.assertTrue(incident_issues(i))

    def test_feed_failure_and_disappearance_do_not_resolve_or_create_calls(self):
        rows = seattle_records([public_call()])
        self.seattle.sync_public(self.source(rows, False))
        self.assertFalse(any(i.get('public_source') for i in self.seattle.read()['incidents']))
        self.seattle.sync_public(self.source(rows)); self.seattle.sync_public(self.source([]))
        i = next(i for i in self.seattle.read()['incidents'] if i.get('public_source'))
        self.assertEqual(i['public_feed_status'], 'missing'); self.assertEqual(i['status'], 'open')

    def test_public_refresh_uses_watermark_and_failure_preserves_records(self):
        context = PublicContext(lambda _: {}, self.directory, start=False, city='seattle')
        with patch('public_context.fetch_text', side_effect=[json.dumps([public_call()]), json.dumps({'rowsUpdatedAt': time.time()})]):
            context.refresh_one('fire')
        self.assertFalse(context.snapshot()['fire']['stale'])
        context.sources['fire']['attempt_epoch'] = 0
        with patch('public_context.fetch_text', side_effect=OSError()): context.refresh_one('fire')
        self.assertEqual(context.snapshot()['fire']['mode'], 'cached')
        self.assertTrue(context.snapshot()['fire']['stale'])
        self.assertEqual(len(context.snapshot()['fire']['records']), 1)
        context.refresh_one('hospitals')
        self.assertEqual(context.snapshot()['hospitals']['mode'], 'unavailable')

    def test_city_reset_and_approval_do_not_touch_toronto(self):
        before = self.toronto.read()
        s = self.seattle.read(); i = s['incidents'][0]; a = s['fleet'][0]; h = s['hospitals'][0]
        rec = {'id': 'seattle-test', 'incident_id': i['id'], 'version': s['version'],
               'incident_revision': 0, 'simulation_epoch': s['epoch'], 'decision': 'pending',
               'approvable': True, 'created_epoch': time.time(), 'evidence_epoch': time.time(),
               'selected': {'ambulance_id': a['id'], 'hospital_id': h['id']}}
        self.seattle.store_rec(rec)
        with self.assertRaises(ValueError): self.toronto.decide(rec['id'], 'approve')
        self.seattle.decide(rec['id'], 'approve')
        self.assertEqual(len(self.seattle.read()['assignments']), 1)
        self.seattle.reset(); self.seattle.load_demo_intake()
        self.assertEqual(self.toronto.read(), before)
        self.assertTrue(all(valid_pickup(i['lat'], i['lon'], 'seattle') for i in self.seattle.read()['incidents']))
        self.assertTrue(all(i['id'].startswith('SEA-') for key in ('fleet', 'hospitals', 'incidents') for i in self.seattle.read()[key]))

    def test_federation_uses_separate_allowlisted_namespace(self):
        with patch('integrations.ZetarisClient'):
            self.assertIn('ARC_SEATTLE.', Federation('seattle').sql)
            self.assertNotIn('ARC_DISPATCH.', Federation('seattle').sql)
            with self.assertRaises(ValueError): Federation('unknown')

    def test_http_routes_scope_state_html_and_feed(self):
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        server.feed_only = False
        server.arcs = {city: SimpleNamespace(sim=sim, config=CITIES[city], view=sim.read, prepare_demo=True)
                       for city, sim in [('toronto', self.toronto), ('seattle', self.seattle)]}
        thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
        base = 'http://127.0.0.1:' + str(server.server_port)
        try:
            with urlopen(base + '/api/state?city=seattle') as response: self.assertEqual(json.load(response)['city'], 'seattle')
            with urlopen(base + '/?city=seattle') as response:
                html = response.read().decode(); self.assertIn('"id": "seattle"', html); self.assertIn('Seattle operations', html)
            with self.assertRaises(HTTPError) as error: urlopen(base + '/api/state?city=unknown')
            self.assertEqual(error.exception.code, 400)
            req = Request(base + '/api/reset?city=seattle', data=b'{}', headers={'Content-Type': 'application/json'})
            with urlopen(req) as response:
                reset = json.load(response)
                self.assertTrue(reset['demo_intake_loaded'])
                self.assertFalse(self.seattle.load_demo_intake())
                self.assertEqual(reset['version'], self.seattle.read()['version'])
            server.feed_only = True
            with urlopen(base + '/feeds/seattle/fleet') as response:
                self.assertTrue(json.load(response)['records'][0]['id'].startswith('SEA-'))
            with urlopen(base + '/feeds/fleet?city=seattle') as response:
                self.assertFalse(json.load(response)['records'][0]['id'].startswith('SEA-'))
            with self.assertRaises(HTTPError): urlopen(base + '/feeds/unknown/fleet')
        finally:
            server.shutdown(); server.server_close(); thread.join()
