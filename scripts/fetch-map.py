"""Download public Toronto centreline geometry for a bounded downtown study area."""
import json,sys,time
from pathlib import Path
from datetime import datetime,timezone
from urllib.request import urlopen
from urllib.parse import urlencode
root=Path(__file__).resolve().parent.parent
features=[]
for offset in [0,2000,4000]:
 query={'where':"FEATURE_CODE_DESC IN ('Local','Collector','Major Arterial','Minor Arterial','Expressway','Expressway Ramp')",'geometry':'-79.425,43.635,-79.35,43.68','geometryType':'esriGeometryEnvelope','inSR':4326,'spatialRel':'esriSpatialRelIntersects','outFields':'LINEAR_NAME_FULL,FEATURE_CODE_DESC','outSR':4326,'f':'geojson','resultRecordCount':2000,'resultOffset':offset}
 with urlopen('https://gis.toronto.ca/arcgis/rest/services/cot_geospatial/MapServer/2/query?'+urlencode(query),timeout=40) as r:s=json.load(r)
 features.extend({'type':'Feature','geometry':f['geometry'],'properties':{'name':f['properties']['LINEAR_NAME_FULL'],'class':f['properties']['FEATURE_CODE_DESC']}} for f in s['features'])
 if not s.get('properties',{}).get('exceededTransferLimit',s.get('exceededTransferLimit',False)):break
 time.sleep(.3)
output={'type':'FeatureCollection','features':features,'source':'City of Toronto Centreline','fetched_at':datetime.now(timezone.utc).isoformat(),'note':'Cached downtown road extract, up to 6000 features. Display only; routing uses OSRM.'}
(root/'web/toronto-map.geojson').write_text(json.dumps(output,separators=(',',':')));print(len(features),'road features')
