# Opening ARC

## On an already configured computer

1. Open the project folder.
2. Double-click **Start ARC.command** (Mac) or **Start ARC.bat** (Windows).
3. The app opens in your browser. Leave the startup window open while working.
4. Close that window to stop the app you started. If the launcher found an app
   already running, it leaves that app running.

If startup reports a problem, the full app is not ready. Do not assume opening
the map means the AI and data connections work.

## First installation — owner setup required

The current app depends on separately installed sponsor services. These launchers
do not install or license those products or generate credentials. The owner must
prepare each computer before handing it to a nontechnical teammate:

- Install Python 3.11+ and Node.js 24+ and make them available to the launcher.
- Install and configure Zetaris and its container runtime using its distribution.
- Install Nightshift and configure its NVIDIA model provider.
- Copy `.env.example` to `.env` and supply credentials privately. Never commit `.env`.
- Start Zetaris and Nightshift, then run the ARC launcher. Source registration is
  automatic for a newly started ARC instance. For an app started using `run.sh`,
  follow the source-registration step in the README.
- Assess a prepared incident, review its explanation, approve it, and exercise
  a changed-condition scenario before handing over the computer.

Use `python3 launch.py --check` to check required runtimes and service credentials
without starting ARC. This checks service connectivity and advertised models;
it does not prove a complete inference or assessment succeeds.

Windows launcher behavior needs testing on an actual Windows computer.
No Python application packages or frontend build are required.

## For access through a shared web link

The easiest teammate experience is a centrally configured deployment: they open
a private HTTPS link instead of installing software. This requires a host that
can run ARC, Zetaris and Nightshift, persistent storage, private credentials,
access control and a reverse proxy. The current server uses loopback binding and
local-origin checks, so it needs deployment configuration before remote use.
It currently has no login system. Do not expose it directly to the public internet.

A shared deployment also shares the same incident queue, approvals and reset
actions among all teammates. Separate installations have separate state.
The source repository is public. Access to a hosted app and sponsor credentials is configured separately.
