# ARC setup and troubleshooting

Start with the [README](../README.md) for required services, credentials and launch
commands. Run ARC commands below from the repository root. This guide covers the
extra steps needed on a new computer.

## Install the services

### Zetaris

Obtain the Zetaris platform/hackathon distribution and any required private image
registry credentials from Zetaris or the team. Keep that distribution in a separate
folder; its Compose files and credentials are not part of ARC.

In the **Zetaris distribution folder**, follow its supplied setup instructions.
For the distribution used by this project, the normal first start is:

```sh
docker compose pull
docker compose up -d
docker compose ps -a
```

Docker Desktop works on Mac and Windows; the original Mac setup uses OrbStack.
On Windows, use Linux containers and the distribution's supported WSL 2/Docker
setup. Follow Zetaris's own memory, disk and platform requirements. If supplied,
run its `preflight.sh` and `verify.sh` in a supported Bash environment.

Open the configured Zetaris UI, normally http://localhost:3000. Obtain a valid API
key and its matching organization ID for ARC's `.env`. Successful one-off `init`
and `bootstrap` containers may exit; the main platform services must stay running.
Never use `docker compose down -v` as a repair shortcut: it removes platform data
volumes and encryption keys.

### Nightshift and NVIDIA

Install a native Nightshift edition compatible with your machine:
[Mac](https://meterless.ai/mac.html) or [Windows](https://meterless.ai/windows.html).
The browser-only edition does not supply the local Runtime API ARC needs.

In Nightshift:

1. Configure NVIDIA provider credentials and a working Nemotron model.
2. Test a real model request. Provider quota/access is separate from the Runtime token.
3. Obtain the Runtime API token and confirm the API port, normally 8088.
4. Put the Runtime token in ARC's `METERLESS_RUNTIME_TOKEN`. Keep the NVIDIA
   provider key in Nightshift, not in ARC's `.env`.

The template requests `nvidia/nemotron-3.5-super-vl-120b-a12b`. Your configured
routing can choose another model; inspect the actual receipt in System details.
Follow the selected Nightshift edition's hardware requirements. ARC's tested
configuration uses cloud inference rather than local Nemotron weights.

### Optional TomTom traffic

Supply a TomTom API key with Traffic and Routing access as `TOMTOM_API_KEY`.
A blank value uses OSRM static driving estimates. If a TomTom key is configured
but its requests fail, ARC blocks affected routes rather than silently
substituting static estimates. No Google Maps key is required.

## Configuration and first launch

The [README](../README.md#3-add-your-credentials) lists every `.env` variable.
Preserve an existing `.env`. Environment variables take precedence over the file;
check terminal overrides if a corrected token seems to be ignored. Obtain fresh
credentials from each service when tokens expire.

Start Zetaris and Nightshift before running `launch.py`. The launcher uses a real
Zetaris SQL request, checks Nightshift's model list, then starts ARC and registers
its resource sources. A successful connection check alone does not prove model
inference works: let a complete response case produce a plan and explanation.

Daily launch shortcuts: `Start ARC.command` on Mac, `Start ARC.bat` on Windows.
If a downloaded Mac launcher lost executable permission:

```sh
chmod +x "Start ARC.command"
```

Windows users with Python 3.11+ installed as `python` can substitute `python` for
`py -3`. Reopen terminals after installing runtimes so their PATH is refreshed.

## Missing Zetaris sources

If ARC was already running, the launcher reuses it but does not register sources
in that branch. With ARC still running, register them in a second terminal:

**Mac**

```sh
python3 scripts/register-sources.py
```

**Windows — PowerShell**

```powershell
py -3 scripts/register-sources.py
```

The script adds `ARC_DISPATCH` (Toronto) and `ARC_SEATTLE` without dropping existing
sources. Default URLs use `host.docker.internal:4318` so Zetaris in Docker can
reach ARC's read-only resource feed listener. Check container-to-host networking
if the script cannot query those URLs.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Python/Node missing or too old | Use Python 3.11+ and Node 24+ in the terminal launching ARC. Avoid the old macOS system Python. `PYTHON_BIN`/`NODE_BIN` can select installed runtimes. |
| Zetaris unavailable/unauthorized | Start the container engine and platform services; check port 8888, API URL, key expiry and matching organization ID. |
| Nightshift unavailable/unauthorized | Open the correct native edition; check port 8088 and the Runtime token. |
| Model list works, but assessment fails | Test the NVIDIA provider inside Nightshift. Check model access, provider credentials, quota and internet connectivity. |
| Missing tables or inconsistent federation | Run source registration while ARC is running. Preserve existing source definitions; verify the Docker host URL and feed port. |
| Routing unavailable | Check internet access; if configured, check TomTom Traffic/Routing permissions and quota. Static route caches expire after seven days. |
| Public call cannot be assessed | Confirm priority, service, equipment and pickup as requested. A stale/changed public feed can also require review. |
| HTTPS/certificate error | Repair Python/system certificate trust. Do not disable TLS verification. |
| Port already in use | Identify the owner; reuse an existing ARC or stop only the intended process. |

## Ports, state and manual startup

- UI/API: `127.0.0.1:4317`.
- Read-only exercise feeds: `0.0.0.0:4318`, reachable by Zetaris containers.
- Toronto state/history: `data/`; Seattle: `data/seattle/`.

The guided launcher uses these default ports. For manual startup:

```sh
python3 app.py --port 4327 --feed-port 4328
```

Use `py -3` on Windows. Custom feed ports require matching Zetaris source URLs.
`ARC_FEED_HOST=host.docker.internal:4328` selects the host for newly registered
sources; it does not rewrite existing definitions. Prefer default ports unless
you intend to manage those source definitions.

Do not delete `data/` to troubleshoot an unrelated startup issue. Each installation
has its own persistent state. The local app has no login system or configured
shared hosting; see [team access](TEAM-SETUP.md) before planning a shared deployment.
