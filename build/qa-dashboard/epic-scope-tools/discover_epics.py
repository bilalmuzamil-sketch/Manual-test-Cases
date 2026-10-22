#!/usr/bin/env python3
"""Discover the dashboard's epic scope dynamically = the LIVE (non-closed) epics the QA team
currently has open testing work in. "Working on" = a QA member is the QA Assignee on an open
(not-Done) ticket that rolls up to the epic. Closed/archived epics are excluded.

Writes scope-epics.json = [{"key","name"}] (sorted by how many QA members touch it, then key).
fetch.py and transform.py read this file for their epic set. Run this FIRST, before fetch.py.

Usage: discover_epics.py   (reads qa-accounts.json in the same dir)
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mcpcall as m
D = os.path.dirname(os.path.abspath(__file__))
acc = json.load(open(D + "/qa-accounts.json"))

def search(jql, fields):
    out, tok = [], None
    while True:
        a = {"cloudId": "x", "jql": jql, "fields": fields, "maxResults": 100}
        if tok: a["nextPageToken"] = tok
        for att in range(3):
            try: r = m.call("searchJiraIssuesUsingJql", a); break
            except Exception:
                if att == 2: raise
                time.sleep(3)
        out += r["issues"]; tok = r.get("nextPageToken")
        if not tok: break
    return out

_pc = {}
def _closed(fl):
    sc = ((fl.get("status") or {}).get("statusCategory") or {}).get("name")
    return sc == "Done" or (fl.get("summary") or "").startswith("[ARCHIVED]")
def epic_of(fl):
    p = fl.get("parent")
    if not p: return None, None, False
    if p["fields"]["issuetype"]["name"] == "Epic":
        return p["key"], p["fields"]["summary"], _closed(p["fields"])
    pk = p["key"]
    if pk not in _pc:
        try:
            gp = m.call("getJiraIssue", {"cloudId": "x", "issueIdOrKey": pk, "fields": ["parent"]})
            g = (gp.get("fields") or {}).get("parent")
            _pc[pk] = (g["key"], g["fields"]["summary"], _closed(g["fields"])) \
                if g and g["fields"]["issuetype"]["name"] == "Epic" else (None, None, False)
        except Exception:
            _pc[pk] = (None, None, False)
    return _pc[pk]

m.init()
epics = {}  # key -> {name, people}
for name, aid in acc.items():
    for r in search('project = SV AND "QA Assignee" = "%s" AND statusCategory != Done' % aid,
                    ["parent", "issuetype", "summary", "status"]):
        ek, en, closed = epic_of(r["fields"])
        if not ek or closed:
            continue
        e = epics.setdefault(ek, {"name": en, "people": set()})
        e["people"].add(name)

ordered = sorted(epics.items(), key=lambda kv: (-len(kv[1]["people"]), kv[0]))
out = [{"key": k, "name": v["name"]} for k, v in ordered]
json.dump(out, open(D + "/scope-epics.json", "w"))
print("discovered %d live epics the QA team is working on:" % len(out))
for e in out:
    print("  %-10s %s" % (e["key"], (e["name"] or "")[:50]))
