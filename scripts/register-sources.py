"""Register only ARC's additive source objects. Never drops anything."""
import os, sys
sys.path.insert(0,os.path.dirname(os.path.dirname(__file__)))
from zetaris_client import ZetarisClient
c=ZetarisClient()
existing=c.query('SHOW LIGHTNING DATABASES',100)['data']
for city,namespace in [('toronto','ARC_DISPATCH'),('seattle','ARC_SEATTLE')]:
 if not any(r[0].lower()==namespace.lower() for r in existing):
  c.query('CREATE LIGHTNING DATABASE '+namespace+' DESCRIBE BY "ARC '+city+' exercise resource feeds"');print('Created '+namespace)
 for name in ['fleet','hospitals','roads']:
  try:c.query('SELECT * FROM '+namespace+'.'+name,1);print(city+' '+name+': already registered')
  except Exception:
   host=os.environ.get('ARC_FEED_HOST','host.docker.internal:4318')
   prefix='/feeds/' if city=='toronto' else '/feeds/seattle/'
   c.query('CREATE LIGHTNING REST TABLE '+name+' FROM '+namespace+' REQUEST(endpoint "http://'+host+prefix+name+'", method "get", response_type "json", http_encoding "URLENCODED") HEADER () BODY ()')
   print(city+' '+name+': registered')
