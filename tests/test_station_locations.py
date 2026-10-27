import json
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from public_context import PublicContext
from simulation import Simulation, stamp
from station_locations import station_records, TORONTO_STATIONS


def catalogue():
    return {'features': [{'attributes': {'ADDRESS_POINT_ID': 101, 'NAME': 'Station 1',
        'ADDRESS': '1 Example Street', 'LATITUDE': 43.651, 'LONGITUDE': -79.388}},
        {'attributes': {'ADDRESS_POINT_ID': 102, 'NAME': 'Station 2',
        'ADDRESS': '2 Example Street', 'LATITUDE': 43.665, 'LONGITUDE': -79.399}}]}


class StationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / 'test.sqlite'
        self.sim = Simulation(self.path)

    def tearDown(self):
        self.sim.db.close(); self.tmp.cleanup()

    def source(self, mode='live', stale=False):
        return {'stations': {'mode': mode, 'stale': stale, 'records': station_records(catalogue()),
                             'source_url': TORONTO_STATIONS, 'fetched_at': stamp()}}

    def test_parser_rejects_truncation_empty_and_invalid_coordinates(self):
        self.assertEqual(len(station_records(catalogue())), 2)
        for data in ({'error': {}}, {'features': []}, dict(catalogue(), exceededTransferLimit=True)):
            with self.assertRaises(ValueError): station_records(data)
        invalid = catalogue(); invalid['features'][0]['attributes']['LATITUDE'] = True
        invalid['features'][1]['attributes']['LONGITUDE'] = float('nan')
        with self.assertRaises(ValueError): station_records(invalid)

    def test_staging_preserves_active_units_and_invalidates_previous_plans_once(self):
        before = self.sim.read()
        before['fleet'][0]['status'] = 'assigned'; self.sim.save(before)
        rec = {'id': 'old-plan', 'version': before['version'], 'decision': 'pending'}
        self.sim.store_rec(dict(rec, incident_id=before['incidents'][0]['id'], simulation_epoch=before['epoch']))
        self.sim.sync_public(self.source()); after = self.sim.read()
        self.assertEqual(after['fleet'][0], before['fleet'][0])
        self.assertEqual(after['fleet'][2], before['fleet'][2])  # Busy unit remains untouched.
        unit = after['fleet'][1]
        self.assertEqual((unit['lat'], unit['lon']), (43.665, -79.399))
        self.assertEqual(unit['station_reference']['name'], 'Station 2')
        self.assertEqual(after['version'], before['version'] + 1)
        with self.assertRaisesRegex(ValueError, 'Conditions changed'): self.sim.decide('old-plan', 'approve')
        self.sim.sync_public(self.source())
        self.assertEqual(self.sim.read(), after)
        exported = self.sim.feed('fleet')['records'][1]
        self.assertEqual(exported['source'], 'simulated_unit_at_official_station')
        self.assertEqual((exported['lat'], exported['lon']), (unit['lat'], unit['lon']))
        self.assertNotIn('station_reference', exported)

    def test_distinct_staging_persists_without_teleporting_on_refresh(self):
        self.sim.sync_public(self.source()); before = self.sim.read()
        available = [u for u in before['fleet'] if u['status'] == 'available']
        self.assertEqual(len({u['station_reference']['id'] for u in available}), 2)
        self.sim.db.close(); self.sim = Simulation(self.path)
        changed = self.source(); changed['stations']['records'][0]['lat'] += .01
        self.sim.sync_public(changed)
        self.assertEqual(self.sim.read(), before)

    def test_cached_or_stale_catalogue_does_not_change_positions(self):
        before = self.sim.read()
        self.sim.sync_public(self.source(mode='cached', stale=True))
        self.sim.sync_public(self.source(stale=True))
        self.assertEqual(self.sim.read(), before)

    def test_specialty_facilities_are_not_used_as_ground_ambulance_bases(self):
        data = catalogue()
        data['features'].append({'attributes': {'ADDRESS_POINT_ID': 103, 'NAME': 'Marine Unit',
            'ADDRESS': '3 Harbour Street', 'LATITUDE': 43.6508, 'LONGITUDE': -79.3881}})
        source = self.source(); source['stations']['records'] = station_records(data)
        self.sim.sync_public(source)
        self.assertTrue(all(u.get('station_reference', {}).get('name') != 'Marine Unit' for u in self.sim.read()['fleet']))

    def test_seattle_ignores_toronto_catalogue(self):
        seattle = Simulation(Path(self.tmp.name) / 'seattle.sqlite', 'seattle')
        try:
            before = seattle.read(); seattle.sync_public(self.source())
            self.assertEqual(seattle.read(), before)
        finally: seattle.db.close()

    def test_refresh_fetches_official_source_and_handles_failure(self):
        updates = []
        context = PublicContext(None, self.tmp.name, start=False, on_update=updates.append)
        with patch('public_context.fetch_text', return_value=json.dumps(catalogue())) as fetch:
            context.refresh_one('stations')
        self.assertTrue(fetch.call_args.args[0].startswith(TORONTO_STATIONS + '/query?'))
        source = context.snapshot()['stations']
        self.assertEqual(source['mode'], 'live'); self.assertFalse(source['stale'])
        self.assertEqual(len(updates), 1)
        context.sources['stations']['attempt_epoch'] = 0
        with patch('public_context.fetch_text', side_effect=OSError()): context.refresh_one('stations')
        self.assertEqual(context.snapshot()['stations']['mode'], 'cached')
        self.assertEqual(context.snapshot()['stations']['records'], source['records'])
