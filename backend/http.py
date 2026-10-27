"""HTTP transport, browser request boundaries and static asset delivery."""

import gzip
import hashlib
import json
import mimetypes
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

from cities import city_config
from public_context import CAMERA_IMAGES

from .common import ROOT


class ARCServer(ThreadingHTTPServer):
    # Two open workspaces can request many local assets at once during navigation.
    request_queue_size = 64


class Handler(BaseHTTPRequestHandler):
    server_version = "ARC"
    asset_cache = {}
    asset_lock = threading.Lock()

    def log_message(self, *args):
        pass

    @property
    def arc(self):
        parts = urlsplit(self.path)
        city = parse_qs(parts.query).get("city", ["toronto"])[0]
        if self.server.feed_only:
            city = "seattle" if parts.path.startswith("/feeds/seattle/") else "toronto"
        city_config(city)
        return (
            self.server.arcs[city] if hasattr(self.server, "arcs") else self.server.arc
        )

    def reply(self, status, data, ctype="application/json"):
        b = (
            json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode()
            if ctype == "application/json"
            else data
        )
        compressed = len(b) > 1024 and self.accepts_gzip()
        if compressed:
            b = gzip.compress(b, compresslevel=1)
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(b)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        if compressed:
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Vary", "Accept-Encoding")
        self.end_headers()
        self.wfile.write(b)

    def accepts_gzip(self):
        for value in self.headers.get("Accept-Encoding", "").split(","):
            parts = value.strip().lower().split(";")
            if parts[0] == "gzip" and not any(
                p.strip() in ("q=0", "q=0.0", "q=0.00", "q=0.000") for p in parts[1:]
            ):
                return True
        return False

    def static(self, file):
        stat = file.stat()
        key = str(file)
        revision = (stat.st_mtime_ns, stat.st_size)
        with self.asset_lock:
            cached = self.asset_cache.get(key)
            if cached is None or cached["revision"] != revision:
                raw = file.read_bytes()
                cached = {
                    "revision": revision,
                    "raw": raw,
                    "gzip": gzip.compress(raw, compresslevel=1),
                    "etag": hashlib.sha256(raw).hexdigest(),
                }
                self.asset_cache[key] = cached
        compressed = self.accepts_gzip()
        etag = '"' + cached["etag"] + ("-gzip" if compressed else "") + '"'
        unchanged = self.headers.get("If-None-Match") == etag
        self.send_response(304 if unchanged else 200)
        self.send_header("Cache-Control", "public, max-age=0, must-revalidate")
        self.send_header("ETag", etag)
        self.send_header("Vary", "Accept-Encoding")
        if not unchanged:
            b = cached["gzip" if compressed else "raw"]
            self.send_header(
                "Content-Type",
                mimetypes.guess_type(str(file))[0] or "application/octet-stream",
            )
            self.send_header("Content-Length", str(len(b)))
            self.send_header("X-Content-Type-Options", "nosniff")
            if compressed:
                self.send_header("Content-Encoding", "gzip")
        self.end_headers()
        if not unchanged:
            self.wfile.write(b)

    def do_GET(self):
        path = urlsplit(self.path).path
        try:
            if self.server.feed_only:
                if path in [
                    prefix + kind
                    for prefix in ["/feeds/", "/feeds/seattle/"]
                    for kind in ["fleet", "hospitals", "roads"]
                ]:
                    return self.reply(200, self.arc.sim.feed(path.split("/")[-1]))
                return self.reply(404, {"error": "Not found"})
            if path == "/api/state":
                return self.reply(200, self.arc.view())
            if path.startswith("/api/recommendations/"):
                return self.reply(
                    200, self.arc.sim.latest_recommendation(path.split("/")[-1])
                )
            if path == "/api/public":
                return self.reply(200, self.arc.public_context.snapshot())
            if path.startswith("/api/cameras/"):
                camera = path.split("/")[-1]
                catalog = (
                    self.arc.public_context.snapshot()
                    .get("cameras", {})
                    .get("records", [])
                )
                if not any(c["id"] == camera for c in catalog):
                    return self.reply(404, {"error": "Camera not found"})
                from urllib.request import Request, urlopen

                with urlopen(
                    Request(
                        CAMERA_IMAGES + "loc" + camera + ".jpg",
                        headers={"User-Agent": "ARC/1.0"},
                    ),
                    timeout=10,
                ) as response:
                    frame = response.read(2000000)
                if not frame.startswith(b"\xff\xd8"):
                    raise ValueError("Camera image unavailable")
                return self.reply(200, frame, "image/jpeg")
            if path == "/api/world":
                return self.reply(200, self.arc.world.call("inspect"))
            if path.startswith("/api/jobs/"):
                job = self.arc.jobs.get(path.split("/")[-1])
                return self.reply(
                    200 if job else 404, job or {"error": "Job not found"}
                )
            if path == "/api/health":
                return self.reply(
                    200,
                    {
                        "app": "ARC",
                        "status": "online",
                        "world_model": self.arc.world.call("inspect")["engine"],
                    },
                )
            if path == "/":
                path = "/index.html"
            if path not in [
                "/index.html",
                "/app.js",
                "/style.css",
                "/leaflet.js",
                "/leaflet.css",
                "/toronto-map.geojson",
                "/maplibre-gl.js",
                "/maplibre-gl.css",
                "/leaflet-maplibre-gl.js",
                "/seattle-map.geojson",
            ]:
                return self.reply(404, {"error": "Not found"})
            file = ROOT / "web" / path[1:]
            if path != "/index.html":
                return self.static(file)
            content = file.read_bytes()
            if path == "/index.html":
                config = self.arc.config
                content = (
                    content.decode()
                    .replace("Toronto operations", config["name"] + " operations")
                    .replace(
                        "Toronto incident, unit and hospital map",
                        config["name"] + " incident, unit and hospital map",
                    )
                    .replace(
                        "Toronto public information",
                        config["name"] + " public information",
                    )
                    .replace(
                        "Cached Toronto streets",
                        "Cached " + config["name"] + " streets",
                    )
                    .replace(
                        '<script src="/leaflet.js">',
                        "<script>window.ARC_CITY="
                        + json.dumps(config)
                        + ';window.ARC_INITIAL_STATE=fetch("/api/state?city='
                        + config["id"]
                        + '").then(r=>r.ok?r.json():null).catch(()=>null);</script><script src="/leaflet.js">',
                    )
                    .encode()
                )
            return self.reply(
                200,
                content,
                mimetypes.guess_type(str(file))[0] or "application/octet-stream",
            )
        except ValueError:
            return self.reply(400, {"error": "Invalid request or city workspace."})
        except Exception:
            return self.reply(
                503, {"error": "Service unavailable. Check local runtime."}
            )

    def do_POST(self):
        if self.server.feed_only:
            return self.reply(405, {"error": "Read-only synthetic feeds"})
        # Prevent drive-by browser requests from other origins changing the simulation.
        origin = self.headers.get("Origin")
        if origin and origin not in [
            "http://127.0.0.1:" + str(self.server.server_port),
            "http://localhost:" + str(self.server.server_port),
        ]:
            return self.reply(403, {"error": "Origin rejected"})
        if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
            return self.reply(415, {"error": "JSON required"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 8192:
                raise ValueError("Request too large")
            body = json.loads(self.rfile.read(length) or "{}")
            path = urlsplit(self.path).path
            if path == "/api/agent/control":
                self.arc.coordinator.set_enabled(body.get("enabled"))
                return self.reply(200, self.arc.coordinator.snapshot())
            if path == "/api/assignments/progress":
                return self.reply(
                    200,
                    self.arc.sim.progress_assignment(
                        body.get("id"), body.get("revision"), body.get("action")
                    ),
                )
            if path == "/api/journeys/speed":
                return self.reply(
                    200, self.arc.sim.set_journey_speed(body.get("speed"))
                )
            if path == "/api/agent/retry":
                return self.reply(
                    202,
                    self.arc.coordinator.retry(
                        str(body.get("incident_id", "")), body.get("request")
                    ),
                )
            if path == "/api/demo/intake":
                return self.reply(200, {"loaded": self.arc.sim.load_demo_intake()})
            if path == "/api/analyze":
                return self.reply(
                    202,
                    self.arc.start_analysis(
                        str(body.get("incident_id", "")),
                        str(
                            body.get(
                                "request",
                                "Assess this incident and explain the best feasible assignment.",
                            )
                        ),
                    ),
                )
            if path == "/api/alternative":
                return self.reply(202, self.arc.review_alternative(body))
            if path == "/api/incidents/details":
                return self.reply(200, self.arc.confirm_incident_details(body))
            if path == "/api/public/review":
                return self.reply(200, self.arc.review_public_call(body))
            if path == "/api/scenario":
                return self.reply(
                    200,
                    self.arc.sim.scenario(body.get("name"), body.get("incident_id")),
                )
            if path == "/api/reset":
                return self.reply(200, self.arc.reset_workspace())
            if path == "/api/decision":
                return self.reply(200, self.arc.decide(body))
            if path == "/api/roads/refresh":
                return self.reply(200, self.arc.refresh_roads())
            return self.reply(404, {"error": "Not found"})
        except (ValueError, TypeError):
            return self.reply(409, {"error": str(__import__("sys").exc_info()[1])})
        except Exception:
            return self.reply(
                503, {"error": "Operation failed. Check services and retry."}
            )
