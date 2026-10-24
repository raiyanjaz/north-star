"""Small Zetaris SQL client. Uses Python's standard library only."""

import argparse
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from uuid import uuid4


class ZetarisError(RuntimeError):
    pass


class ZetarisClient:
    def __init__(self, env_file=None):
        path = Path(env_file) if env_file else Path(__file__).with_name('.env')
        settings = {}
        if path.is_file():
            for line in path.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    settings[key.strip()] = value.strip().strip('\"\'')
        settings.update(os.environ)
        self.base_url = settings.get('ZETARIS_REST_URL', '').rstrip('/')
        self.org_id = settings.get('ZETARIS_ORG_ID', '')
        self._api_key = settings.get('ZETARIS_API_KEY', '')
        if not all((self.base_url, self.org_id, self._api_key)):
            raise ZetarisError('Set ZETARIS_REST_URL, ZETARIS_ORG_ID and ZETARIS_API_KEY in .env.')
        parsed = urlsplit(self.base_url)
        if parsed.scheme not in ('http', 'https') or not parsed.hostname:
            raise ZetarisError('ZETARIS_REST_URL must be an HTTP(S) URL.')
        if parsed.scheme == 'http' and parsed.hostname not in ('localhost', '127.0.0.1', '::1'):
            raise ZetarisError('Use HTTPS when connecting outside this computer.')

    def query(self, sql, limit=10):
        """Run one Zetaris SQL statement and return headers, data and metadata."""
        request = Request(
            self.base_url + '/sql-editor/sqls/run',
            data=json.dumps({
                'queryId': str(uuid4()), 'sql': sql,
                'source': 'SqlEditor', 'limit': limit,
            }).encode(),
            headers={
                'Authorization': 'Bearer ' + self._api_key,
                'X-Org-ID': self.org_id,
                'X-Request-ID': str(uuid4()),
                'Content-Type': 'application/json',
            },
        )
        try:
            with urlopen(request, timeout=120) as response:
                result = json.load(response)
        except HTTPError as error:
            # This Zetaris version also reports rejected API tokens as 400.
            try:
                message = json.loads(error.read()).get('msg', '')
            except (ValueError, AttributeError):
                message = ''
            if error.code in (401, 403) or (error.code == 400 and message == 'Not Allowed'):
                raise ZetarisError('Authentication failed. Check the API key, expiry and organisation ID.') from None
            raise ZetarisError(f'Zetaris returned HTTP {error.code}. Check the SQL and server logs.') from None
        except (URLError, TimeoutError):
            raise ZetarisError('Cannot reach Zetaris. Check that OrbStack and the Zetaris stack are running.') from None
        except (ValueError, UnicodeError):
            raise ZetarisError('Zetaris returned an invalid JSON response.') from None
        if not isinstance(result, dict) or 'data' not in result:
            raise ZetarisError('Zetaris did not return a SQL result.')
        return result


def main():
    parser = argparse.ArgumentParser(description='Query your local Zetaris instance.')
    parser.add_argument('sql', nargs='?', default='SELECT 1 AS one')
    parser.add_argument('--limit', type=int, default=10)
    args = parser.parse_args()
    try:
        result = ZetarisClient().query(args.sql, args.limit)
        if args.sql == 'SELECT 1 AS one' and result['data'] != [['1']]:
            raise ZetarisError('The connection test returned an unexpected value.')
    except ZetarisError as error:
        parser.exit(1, f'{error}\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
