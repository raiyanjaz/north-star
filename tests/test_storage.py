"""Persistence invariants across the repository extraction."""

import tempfile
import unittest
from pathlib import Path

from backend.storage import WorkspaceRepository


class RepositoryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "workspace.sqlite"
        self.store = WorkspaceRepository(self.path)
        self.store.save({"version": 1, "epoch": "original"})

    def tearDown(self):
        self.store.db.close()
        self.tmp.cleanup()

    def test_failed_transaction_rolls_back_state_recommendation_and_audit_together(
        self,
    ):
        with self.assertRaisesRegex(ValueError, "abort"):
            with self.store.transaction():
                self.store.save({"version": 2, "epoch": "original"})
                self.store.insert_recommendation({"id": "proposal"})
                self.store.log("approved", {"id": "proposal"})
                raise ValueError("abort")
        self.assertEqual(self.store.read()["version"], 1)
        self.assertIsNone(self.store.get_recommendation("proposal"))
        self.assertEqual(
            self.store.db.execute("SELECT count(*) FROM audit").fetchone()[0], 0
        )
        # A rollback must also leave the connection usable for the next transaction.
        with self.store.transaction():
            self.store.save({"version": 3, "epoch": "original"})
        self.assertEqual(self.store.read()["version"], 3)

    def test_existing_state_is_preserved_when_repository_reopens(self):
        record = {"id": "saved", "incident_id": "case", "simulation_epoch": "original"}
        self.store.insert_recommendation(record)
        self.store.db.close()
        self.store = WorkspaceRepository(self.path)
        self.assertEqual(self.store.read(), {"version": 1, "epoch": "original"})
        self.assertEqual(self.store.get_recommendation("saved"), record)

    def test_latest_queries_preserve_case_and_epoch_boundaries(self):
        for id, case, epoch in [
            ("first", "a", "one"),
            ("other", "b", "one"),
            ("new", "a", "two"),
        ]:
            self.store.insert_recommendation(
                {"id": id, "incident_id": case, "simulation_epoch": epoch}
            )
        self.assertEqual(self.store.latest("a")["id"], "new")
        self.assertEqual(self.store.latest("a", "one")["id"], "first")
        self.assertEqual(set(self.store.latest_for_epoch("one")), {"a", "b"})
        self.assertIsNone(self.store.latest("b", "two"))
