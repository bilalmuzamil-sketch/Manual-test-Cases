#!/usr/bin/env python3
"""raw_issues.json (3 epic trees) -> tickets-unique.json + story-epic-map.json
Record shape per REFRESH-RUNBOOK.md step 1."""
import json, os
from collections import Counter
D=os.path.dirname(os.path.abspath(__file__))
EPICS=["SV-8785","SV-8685","SV-8582"]
rows=json.load(open(D+"/raw_issues.json"))
byk={r["key"]:r for r in rows}
def f(r): return r["fields"]
# story -> epic map (a story's parent is the epic)
semap={}
for r in rows:
    fl=f(r); p=fl.get("parent")
    if not p: continue
    pt=p["fields"]["issuetype"]["name"]
    if pt=="Epic":
        semap[r["key"]]={"epic":p["key"],"epicSummary":p["fields"]["summary"],"epicType":"Epic"}
recs=[]
for r in rows:
    fl=f(r)
    ty=fl["issuetype"]["name"]
    if ty=="Epic":            # the 3 epics are containers, not work items
        continue
    p=fl.get("parent") or {}
    pk=p.get("key")
    pt=(p.get("fields",{}).get("issuetype") or {}).get("name")
    ps=(p.get("fields",{}) or {}).get("summary")
    st=fl["status"]
    recs.append({
      "key":r["key"], "summary":fl["summary"], "status":st["name"],
      "statusCat":st["statusCategory"]["name"], "type":ty,
      "priority":(fl.get("priority") or {}).get("name"),
      "labels":fl.get("labels") or [],
      "qa":[u["displayName"] for u in (fl.get("customfield_10385") or [])],
      "reporter":(fl.get("reporter") or {}).get("displayName"),
      "assignee":(fl.get("assignee") or {}).get("displayName"),
      "parent":pk, "parentType":pt, "parentSummary":ps,
      "created":fl["created"], "updated":fl["updated"],
      "resolved":fl.get("resolutiondate"),
      "catchange":fl.get("statuscategorychangedate") or fl.get("resolutiondate") or fl["updated"],
    })
json.dump(recs, open(D+"/tickets-unique.json","w"))
json.dump(semap, open(D+"/story-epic-map.json","w"))
# sanity: every record must resolve to one of the 3 epics
def epic_of(r):
    if r["parentType"]=="Epic": return r["parent"]
    return (semap.get(r["parent"]) or {}).get("epic")
unres=[r["key"] for r in recs if epic_of(r) not in EPICS]
print("tickets:",len(recs),"| stories mapped:",len(semap),"| unresolved epic:",len(unres), unres[:8])
print("per epic:",dict(Counter(epic_of(r) for r in recs)))
print("types:",dict(Counter(r["type"] for r in recs)))
print("catchange present:",sum(1 for r in recs if r["catchange"]))
print("QA Complete tickets:",sum(1 for r in recs if r["status"]=="QA Complete"))
