"""Open ARC after checking its real dependencies. Uses the standard library only."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from urllib.request import urlopen
import webbrowser

ROOT = Path(__file__).resolve().parent
URL = 'http://127.0.0.1:4317'


def check_services():
    from zetaris_client import ZetarisClient
    from meterless_client import MeterlessClient
    print('Checking Zetaris and Nightshift…', flush=True)
    ZetarisClient().query('SELECT 1 AS one')
    MeterlessClient().models()


def healthy():
    try:
        with urlopen(URL + '/api/health', timeout=3) as response:
            health = json.load(response)
        return health.get('app') == 'ARC' and health.get('status') == 'online'
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser(description='Start ARC and open your browser.')
    parser.add_argument('--check', action='store_true', help='Check dependencies without starting ARC.')
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    os.chdir(ROOT)
    if sys.version_info < (3, 11):
        raise RuntimeError('Install Python 3.11 or newer, then open Start ARC again.')
    node = os.environ.get('NODE_BIN') or shutil.which('node')
    bundled = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
    if not node and bundled.is_file():
        node = str(bundled)
    if not node:
        raise RuntimeError('Install Node.js 24 or newer, then open Start ARC again.')
    version = subprocess.check_output([node, '--version'], text=True).strip()
    if int(version.lstrip('v').split('.')[0]) < 24:
        raise RuntimeError('Node.js 24 or newer is required. Upgrade Node.js and try again.')
    os.environ['NODE_BIN'] = node
    check_services()
    if args.check:
        print('Python, Node.js, Zetaris and Nightshift checks passed.')
        return
    if healthy():
        from integrations import Federation
        Federation().snapshot()
        Federation('seattle').snapshot()
        print('ARC is already running: ' + URL)
        if not args.no_browser:
            webbrowser.open(URL)
        return
    process = subprocess.Popen([sys.executable, str(ROOT / 'app.py')], cwd=ROOT)
    try:
        deadline = time.monotonic() + 30
        while not healthy():
            if process.poll() is not None:
                raise RuntimeError('ARC could not start. Check whether ports 4317 and 4318 are in use.')
            if time.monotonic() > deadline:
                raise RuntimeError('ARC did not become ready. Check the messages above and try again.')
            time.sleep(0.5)
        # Register only ARC sources; the existing script preserves registered sources.
        subprocess.run([sys.executable, str(ROOT / 'scripts/register-sources.py')], check=True)
        from integrations import Federation
        Federation().snapshot()
        Federation('seattle').snapshot()
        print('ARC is ready. Keep this window open. Close it or press Ctrl+C to stop.', flush=True)
        if not args.no_browser:
            webbrowser.open(URL)
        process.wait()
    finally:
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nARC stopped.')
    except Exception as error:
        # Known client errors contain actionable messages without credential values.
        from zetaris_client import ZetarisError
        from meterless_client import MeterlessError
        message = str(error) if isinstance(error, (RuntimeError, ZetarisError, MeterlessError)) else 'Startup failed. Check the required services and try again.'
        print('\nCould not open ARC: ' + message, file=sys.stderr)
        sys.exit(1)
