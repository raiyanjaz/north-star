"""Navigation performance boundaries: safe HTTP caching and bounded history reads."""
import gzip
import json
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from app import ARCServer, Handler
from simulation import Simulation


class LoadingTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / 'web').mkdir()
        (self.root / 'web/app.js').write_text('/* static asset */' * 200)
        self.root_patch = patch('backend.http.ROOT', self.root); self.root_patch.start()
        self.server = ARCServer(('127.0.0.1', 0), Handler)
        self.server.feed_only = False
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True); self.thread.start()
        self.base = 'http://127.0.0.1:' + str(self.server.server_port)

    def tearDown(self):
        self.server.shutdown(); self.server.server_close(); self.thread.join()
        self.root_patch.stop(); self.tmp.cleanup()

    def test_static_assets_revalidate_and_change_etag_after_edit(self):
        with urlopen(self.base + '/app.js') as response:
            etag = response.headers['ETag']
            self.assertIn('must-revalidate', response.headers['Cache-Control'])
            self.assertEqual(response.read(), (self.root / 'web/app.js').read_bytes())
        with self.assertRaises(HTTPError) as unchanged:
            urlopen(Request(self.base + '/app.js', headers={'If-None-Match': etag}))
        self.assertEqual(unchanged.exception.code, 304)
        (self.root / 'web/app.js').write_text('/* edited */')
        with urlopen(Request(self.base + '/app.js', headers={'If-None-Match': etag})) as response:
            self.assertNotEqual(etag, response.headers['ETag'])
            self.assertEqual(response.read(), b'/* edited */')

    def test_compressed_assets_vary_by_encoding_and_respect_gzip_disabled(self):
        with urlopen(Request(self.base + '/app.js', headers={'Accept-Encoding': 'gzip'})) as response:
            self.assertEqual(response.headers['Content-Encoding'], 'gzip')
            self.assertIn('Accept-Encoding', response.headers['Vary'])
            self.assertEqual(gzip.decompress(response.read()), (self.root / 'web/app.js').read_bytes())
        with urlopen(Request(self.base + '/app.js', headers={'Accept-Encoding': 'gzip;q=0'})) as response:
            self.assertIsNone(response.headers.get('Content-Encoding'))
            self.assertEqual(response.read(), (self.root / 'web/app.js').read_bytes())

    def test_dynamic_state_is_compressed_but_never_cached(self):
        payload = {'incidents': ['x' * 100 for _ in range(100)]}
        from types import SimpleNamespace
        self.server.arc = SimpleNamespace(view=lambda: payload)
        with urlopen(Request(self.base + '/api/state', headers={'Accept-Encoding': 'gzip'})) as response:
            self.assertEqual(response.headers['Cache-Control'], 'no-store')
            self.assertIsNone(response.headers.get('ETag'))
            self.assertEqual(json.loads(gzip.decompress(response.read())), payload)

    def test_latest_recommendations_select_current_epoch_and_latest_case_only(self):
        sim = Simulation(self.root / 'state.sqlite')
        try:
            epoch = sim.read()['epoch']
            for n in range(100):
                rec = {'id': str(n), 'incident_id': 'INC-1042', 'simulation_epoch': epoch if n > 49 else 'old-epoch'}
                sim.db.execute('INSERT INTO recommendations VALUES(?,?)', (rec['id'], json.dumps(rec)))
            other = {'id': 'other', 'incident_id': 'INC-1043', 'simulation_epoch': epoch}
            sim.db.execute('INSERT INTO recommendations VALUES(?,?)', (other['id'], json.dumps(other)))
            latest = sim.latest_recommendations()
            self.assertEqual({key: r['id'] for key, r in latest.items()}, {'INC-1042': '99', 'INC-1043': 'other'})
            self.assertEqual(sim.latest_recommendation('INC-1042')['id'], '99')
            self.assertIsNone(sim.latest_recommendation('missing'))
        finally:
            sim.db.close()
