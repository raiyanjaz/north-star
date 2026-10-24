"""Text requests through the local Meterless Runtime, with no third-party packages."""

import argparse
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen


class MeterlessError(RuntimeError):
    pass


def normalize_url(value):
    parsed = urlsplit(value if '://' in value else 'http://' + value)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username:
        raise MeterlessError('Meterless base URL must be an HTTP(S) URL without credentials.')
    if parsed.scheme == 'http' and parsed.hostname not in ('localhost', '127.0.0.1', '::1'):
        raise MeterlessError('Use HTTPS for Meterless outside this computer.')
    return urlunsplit((parsed.scheme, parsed.netloc, '/v1', '', ''))


class MeterlessClient:
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
        self.base_url = normalize_url(settings.get('METERLESS_BASE_URL', 'http://127.0.0.1:8088/v1'))
        self._token = settings.get('METERLESS_RUNTIME_TOKEN', '')
        self.model = settings.get('METERLESS_MODEL', 'meterless/auto')
        if not self._token:
            raise MeterlessError('Set METERLESS_RUNTIME_TOKEN in .env using the Nightshift Console key.')

    def _request(self, path, payload=None):
        headers = {
            'Authorization': 'Bearer ' + self._token,
            'meterless-app': 'north-star',
            'Content-Type': 'application/json',
        }
        if payload is not None:
            headers['meterless-scope'] = 'user'
        request = Request(self.base_url + path,
                          data=None if payload is None else json.dumps(payload).encode(),
                          headers=headers)
        try:
            with urlopen(request, timeout=180) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code in (401, 403):
                raise MeterlessError('Unauthorized: check your Nightshift Runtime token.') from None
            if error.code == 429:
                raise MeterlessError('Model rate limit reached. Wait before retrying.') from None
            raise MeterlessError(f'Meterless returned HTTP {error.code}. Check its provider and lane settings.') from None
        except (URLError, TimeoutError):
            raise MeterlessError('Meterless is offline or timed out. Open Nightshift and check its model lanes.') from None
        except (ValueError, UnicodeError):
            raise MeterlessError('Meterless returned invalid JSON.') from None

    def models(self):
        response = self._request('/models')
        models = [row['id'] for row in response.get('data', []) if isinstance(row.get('id'), str)]
        if not any(model.startswith('meterless/') for model in models):
            raise MeterlessError('The endpoint did not advertise Meterless routing modes.')
        return models

    def chat(self, prompt):
        response = self._request('/chat/completions', {
            'model': self.model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 256,
            'stream': False,
        })
        try:
            content = response['choices'][0]['message']['content']
        except (KeyError, IndexError, TypeError):
            raise MeterlessError('Meterless returned no assistant message. Check its provider and lanes.') from None
        if not isinstance(content, str) or not content.strip():
            raise MeterlessError('Meterless returned an empty text response.')
        return content


def main():
    parser = argparse.ArgumentParser(description='Test Nightshift or send it a text prompt.')
    parser.add_argument('prompt', nargs='?', default='Reply with one short sentence confirming this connection works.')
    parser.add_argument('--models', action='store_true')
    args = parser.parse_args()
    try:
        client = MeterlessClient()
        modes = client.models()
        if args.models:
            print(json.dumps(modes, indent=2))
        else:
            print(client.chat(args.prompt))
    except MeterlessError as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
