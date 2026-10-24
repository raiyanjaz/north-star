"""Register only ARC's additive source objects. Never drops anything."""
import os, sys
sys.path.insert(0,os.path.dirname(os.path.dirname(__file__)))
from zetaris_client import ZetarisClient
c=ZetarisClient()
existing=c.query('SHOW LIGHTNING DATABASES',100)['data']
if not any(r[0].lower()=='arc_dispatch' for r in existing):
 c.query('CREATE LIGHTNING DATABASE ARC_DISPATCH DESCRIBE BY "ARC simulated dispatcher feeds"');print('Created ARC_DISPATCH')
for name in ['fleet','hospitals','roads']:
 try:c.query('SELECT * FROM ARC_DISPATCH.'+name,1);print(name+': already registered')
 except Exception:
  host=os.environ.get('ARC_FEED_HOST','host.docker.internal:4318')
  c.query('CREATE LIGHTNING REST TABLE '+name+' FROM ARC_DISPATCH REQUEST(endpoint "http://'+host+'/feeds/'+name+'", method "get", response_type "json", http_encoding "URLENCODED") HEADER () BODY ()')
  print(name+': registered')
