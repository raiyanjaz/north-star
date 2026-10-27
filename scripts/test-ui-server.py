"""Static browser-test host: no application state, feeds, jobs or integrations."""

import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from backend.http import ARCServer, Handler
from cities import city_config


class TestHandler(Handler):
    def do_GET(self):
        if self.path.startswith("/api/"):
            return self.reply(503, {"error": "Browser tests must intercept API calls"})
        return super().do_GET()

    def do_POST(self):
        return self.reply(405, {"error": "Read-only browser-test host"})


if __name__ == "__main__":
    server = ARCServer(("127.0.0.1", 4319), TestHandler)
    server.feed_only = False
    server.arcs = {
        city: SimpleNamespace(config=city_config(city))
        for city in ("toronto", "seattle")
    }
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
