"""Fetch all fixed scenario legs once. Public OSRM demo server: bounded, sequential."""
import os,sys,time
sys.path.insert(0,os.path.dirname(os.path.dirname(__file__)))
from integrations import Routes
from simulation import ROOT, FLEET,HOSPITALS,INCIDENTS
r=Routes(ROOT/'data/routes.json')
for i in INCIDENTS:
 for a in FLEET[:2]:r.get(a,i);time.sleep(.15)
 for h in HOSPITALS:r.get(i,h);time.sleep(.15)
print(str(len(r.cache))+' directed legs cached')
