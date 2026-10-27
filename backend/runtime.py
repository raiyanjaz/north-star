"""Process entry point: wire city services to the UI and feed servers."""

import argparse
import threading

from .application import ARC
from .common import ROOT
from .http import ARCServer, Handler


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=4317)
    p.add_argument("--feed-port", type=int, default=4318)
    p.add_argument("--data-dir", default=str(ROOT / "data"))
    args = p.parse_args()
    directory = __import__("pathlib").Path(args.data_dir)
    directory.mkdir(exist_ok=True, parents=True)
    inference_lock = threading.Lock()
    arcs = {
        city: ARC(
            directory if city == "toronto" else directory / city,
            city=city,
            analysis_lock=inference_lock,
        )
        for city in ["toronto", "seattle"]
    }
    arc = arcs["toronto"]
    servers = []
    for host, port, feed in [
        ("127.0.0.1", args.port, False),
        ("0.0.0.0", args.feed_port, True),
    ]:
        server = ARCServer((host, port), Handler)
        server.arc = arc
        server.arcs = arcs
        server.feed_only = feed
        servers.append(server)
        threading.Thread(target=server.serve_forever, daemon=True).start()
    print("ARC ready at http://127.0.0.1:" + str(args.port), flush=True)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        for server in servers:
            server.shutdown()
        for workspace in arcs.values():
            workspace.coordinator.stop.set()
            workspace.public_context.stop.set()
            workspace.world.close()
