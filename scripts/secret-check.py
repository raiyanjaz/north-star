"""Check deliverable files for actual local secret values, without printing them."""
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
secrets=[]
if (ROOT/'.env').exists():
 for line in (ROOT/'.env').read_text().splitlines():
  if '=' in line:
   key,value=line.split('=',1)
   if any(s in key for s in ['TOKEN','KEY','PASSWORD']) and len(value.strip())>8:secrets.append(value.strip().strip('"\'').encode())
count=0
for p in ROOT.rglob('*'):
 if not p.is_file() or any(x in p.relative_to(ROOT).parts for x in ['.git','data','__pycache__','node_modules','.venv','.deck-build','.codex-finalizer']):continue
 if p.name.startswith('.env') and p.name!='.env.example':continue
 if p.suffix=='.zip':continue
 b=p.read_bytes();count+=1
 if any(s in b for s in secrets):raise SystemExit('FAIL: secret found in '+str(p.relative_to(ROOT)))
print('PASS: '+str(count)+' deliverable files contain no configured secret values')

import sys
if '--live' in sys.argv:
 from urllib.request import urlopen
 for city in ['toronto','seattle']:
  for path in ['/api/state','/api/world','/api/health']:
   with urlopen('http://127.0.0.1:4317'+path+'?city='+city,timeout=10) as response:b=response.read()
   if any(s in b for s in secrets):raise SystemExit('FAIL: configured secret in API response')
 print('PASS: both cities state, engine and health API responses contain no configured secrets')
