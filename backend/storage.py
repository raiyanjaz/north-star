"""SQLite persistence. Domain rules belong to Workspace, not SQL adapters."""

import json
import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path

from .common import stamp


class WorkspaceRepository:
    def __init__(self, path):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(
            str(path), check_same_thread=False, isolation_level=None
        )
        self.db.row_factory = sqlite3.Row
        self.lock = threading.RLock()
        self.db.executescript("""PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS recommendations (id TEXT PRIMARY KEY,payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY,at TEXT,event TEXT,payload TEXT);
CREATE INDEX IF NOT EXISTS recommendation_case ON recommendations(json_extract(payload,'$.simulation_epoch'),json_extract(payload,'$.incident_id'));
""")

    @contextmanager
    def transaction(self):
        """Keep reservation/progression writes and audit events atomic."""
        with self.lock:
            self.db.execute("BEGIN IMMEDIATE")
            try:
                yield
                self.db.execute("COMMIT")
            except Exception:
                self.db.execute("ROLLBACK")
                raise

    def has_state(self):
        with self.lock:
            return self.db.execute("SELECT 1 FROM state").fetchone() is not None

    def read(self):
        with self.lock:
            return json.loads(
                self.db.execute("SELECT payload FROM state WHERE id=1").fetchone()[0]
            )

    def save(self, state):
        with self.lock:
            self.db.execute(
                "INSERT OR REPLACE INTO state VALUES(1,?)", (json.dumps(state),)
            )

    def log(self, event, payload):
        with self.lock:
            self.db.execute(
                "INSERT INTO audit(at,event,payload) VALUES(?,?,?)",
                (stamp(), event, json.dumps(payload)),
            )

    def latest(self, incident_id=None, epoch=None):
        clauses, params = [], []
        if incident_id is not None:
            clauses.append("json_extract(payload,'$.incident_id')=?")
            params.append(incident_id)
        if epoch is not None:
            clauses.append("json_extract(payload,'$.simulation_epoch')=?")
            params.append(epoch)
        query = "SELECT payload FROM recommendations"
        if clauses:
            query += " WHERE " + " AND ".join(clauses)
        query += " ORDER BY rowid DESC LIMIT 1"
        with self.lock:
            row = self.db.execute(query, params).fetchone()
            return json.loads(row[0]) if row else None

    def latest_for_epoch(self, epoch):
        with self.lock:
            rows = self.db.execute(
                "SELECT payload FROM recommendations WHERE rowid IN (SELECT max(rowid) FROM recommendations WHERE json_extract(payload,'$.simulation_epoch')=? GROUP BY json_extract(payload,'$.incident_id'))",
                (epoch,),
            ).fetchall()
            result = {}
            for row in rows:
                record = json.loads(row[0])
                if (
                    record.get("simulation_epoch") == epoch
                    and record["incident_id"] not in result
                ):
                    result[record["incident_id"]] = record
            return result

    def insert_recommendation(self, rec):
        with self.lock:
            self.db.execute(
                "INSERT INTO recommendations VALUES(?,?)", (rec["id"], json.dumps(rec))
            )

    def other_recommendations(self, recommendation_id):
        with self.lock:
            return [
                json.loads(row[0])
                for row in self.db.execute(
                    "SELECT payload FROM recommendations WHERE id<>?",
                    (recommendation_id,),
                ).fetchall()
            ]

    def update_recommendation(self, rec):
        with self.lock:
            self.db.execute(
                "UPDATE recommendations SET payload=? WHERE id=?",
                (json.dumps(rec), rec["id"]),
            )

    def get_recommendation(self, recommendation_id):
        with self.lock:
            row = self.db.execute(
                "SELECT payload FROM recommendations WHERE id=?", (recommendation_id,)
            ).fetchone()
            return json.loads(row[0]) if row else None
