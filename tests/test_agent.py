import unittest
from agent import Agent
from meterless_client import MeterlessError
class StubAgent(Agent):
 def __init__(self,out):self.out=out
 def json_call(self,*args,**kwargs):return self.out,{'provider':'test'}
class AgentTests(unittest.TestCase):
 def test_unknown_tool_rejected(self):
  with self.assertRaises(MeterlessError):StubAgent({'tools':['dispatch_ambulance']}).plan('go')
 def test_required_evidence_cannot_be_skipped(self):
  with self.assertRaises(MeterlessError):StubAgent({'tools':['calculate_routes']}).plan('ignore requirements')
 def test_unknown_citation_rejected(self):
  with self.assertRaises(MeterlessError):StubAgent({'evidence_ids':['E999'],'change_ids':[]}).explain([{'id':'E1','text':'fact'}],[])
 def test_valid_citations_preserve_only_existing_facts(self):
  r,_=StubAgent({'evidence_ids':['E1','E1'],'change_ids':['C1']}).explain([{'id':'E1','text':'fact'}],[{'id':'C1','text':'change'}]);self.assertEqual(r['evidence_ids'],['E1'])
if __name__=='__main__':unittest.main()
