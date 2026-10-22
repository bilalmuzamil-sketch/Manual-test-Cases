#!/usr/bin/env python3
"""Project-wide "epics each QA member is working on" sidecar.

The dashboard is scoped to three epics, but "what is each person working on" is a cross-epic
question — so it is answered PROJECT-WIDE here, across all of ShopView, not from the three-epic
set. "Working on" = tickets anywhere in project SV where the person is the QA Assignee and the
ticket is not Done (their live testing queue). Output: qa-epics.json
  {"asof": "YYYY-MM-DD",
   "by": {"<QA name>": {"open": <int>, "epics": [{"key","name","count"}, ...]}}}

Usage: fetch_qa_epics.py <asof YYYY-MM-DD>   (reads qa-accounts.json in the same dir)
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mcpcall as m
D = os.path.dirname(os.path.abspath(__file__))
ASOF = sys.argv[1] if len(sys.argv) > 1 else ""
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

_pcache = {}
def _closed(fl):
    sc = ((fl.get("status") or {}).get("statusCategory") or {}).get("name")
    nm = fl.get("summary") or ""
    return sc == "Done" or nm.startswith("[ARCHIVED]")
def epic_of(fl):
    """Return (epicKey, epicName, closed?) — epic = parent if it is an Epic, else the grandparent."""
    p = fl.get("parent")
    if not p: return None, None, False
    if p["fields"]["issuetype"]["name"] == "Epic":
        return p["key"], p["fields"]["summary"], _closed(p["fields"])
    pk = p["key"]
    if pk not in _pcache:
        try:
            gp = m.call("getJiraIssue", {"cloudId": "x", "issueIdOrKey": pk, "fields": ["parent"]})
            g = (gp.get("fields") or {}).get("parent")
            if g and g["fields"]["issuetype"]["name"] == "Epic":
                _pcache[pk] = (g["key"], g["fields"]["summary"], _closed(g["fields"]))
            else:
                _pcache[pk] = (None, None, False)
        except Exception:
            _pcache[pk] = (None, None, False)
    return _pcache[pk]

m.init()
by = {}
for name, aid in acc.items():
    iss = search('project = SV AND "QA Assignee" = "%s" AND statusCategory != Done' % aid,
                 ["parent", "issuetype", "summary", "status"])
    counts = {}; kept = 0
    for r in iss:
        ek, en, closed = epic_of(r["fields"])
        if ek and closed:            # drop work that rolls up to a CLOSED/archived epic
            continue
        kept += 1
        key = ek or "NONE"; nm = en or "(no epic)"
        c = counts.setdefault(key, {"key": key, "name": nm, "count": 0}); c["count"] += 1
    epics = sorted(counts.values(), key=lambda c: -c["count"])
    by[name] = {"open": kept, "epics": epics}
    print("%-20s %3d open across %d live epics (closed epics excluded)" % (name, kept, len([e for e in epics if e['key'] != 'NONE'])))

json.dump({"asof": ASOF, "by": by}, open(D + "/qa-epics.json", "w"))
print("-> qa-epics.json")
