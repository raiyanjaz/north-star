"""Use verified TLS with the system and, when present, Homebrew CA bundle."""
import ssl
from pathlib import Path


def tls_context():
    context = ssl.create_default_context()
    # The bundled Python runtime may not include newer intermediate/root CAs.
    # Add the locally installed trust bundle; never disable verification.
    bundle = Path('/opt/homebrew/etc/openssl@3/cert.pem')
    if bundle.exists():
        context.load_verify_locations(cafile=str(bundle))
    return context
