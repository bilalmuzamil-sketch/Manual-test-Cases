#!/usr/bin/env python3
"""Project-wide "tickets created by each QA member" sidecar.

The dashboard is scoped to three epics, but the per-member "tickets created" table answers a
cross-epic question — each person's real output — so it is counted PROJECT-WIDE here, not from
the three-epic ticket set. Output: created-by-member.json
  {"from": "YYYY-MM-01", "asof": "YYYY-MM-DD",
   "byDay": {"<QA name>": {"YYYY-MM-DD": <count>, ...}, ...}}

Window = the 1st of the PREVIOUS month through <asof>, which covers both the by-month view
(this month + previous month) and the by-week view (this week back to 4 weeks ago).

Usage: fetch_created.py <asof YYYY-MM-DD>   (reads qa-accounts.json in the same dir)
Account ids come from qa-accounts.json (built once from raw_issues.json); reporter-by-accountId
is exact, unlike display-name matching.
"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mcpcall as m

D = os.path.dirname(os.path.abspath(__file__))
CID = "19fdd96d-a135-46c4-83e7-d2cc218a4e63"
ASOF = sys.argv[1]

def prev_month_first(asof):
    y, mo = int(asof[:4]), int(asof[5:7])
    mo -= 1
    if mo == 0: mo, y = 12, y - 1
    return f"{y}-{mo:02d}-01"

FROM = prev_month_first(ASOF)
acc = json.load(open(D + "/qa-accounts.json"))     # {name: accountId}
id2name = {v: k for k, v in acc.items()}
ids = ",".join(id2name)                             # accountIds are quote-free in JQL

def search(jql, fields):
    out, tok = [], None
    while True:
        args = {"cloudId": CID, "jql": jql, "fields": fields, "maxResults": 100}
        if tok: args["nextPageToken"] = tok
        for a in range(3):
            try: r = m.call("searchJiraIssuesUsingJql", args); break
            except Exception:
                if a == 2: raise
                time.sleep(3)
        iss = r.get("issues")
        nodes = iss.get("nodes", []) if isinstance(iss, dict) else (iss or [])
        pi = iss.get("pageInfo") if isinstance(iss, dict) else None
        out += nodes
        if pi: tok = pi.get("endCursor") if pi.get("hasNextPage") else None
        else:  tok = r.get("nextPageToken") if not r.get("isLast", True) else None
        if not tok: break
    return out

jql = f"project = SV AND reporter in ({ids}) AND created >= \"{FROM}\" ORDER BY created ASC"
rows = search(jql, ["created", "reporter"])

byday = {n: {} for n in acc}
for r in rows:
    f = r["fields"]
    rep = (f.get("reporter") or {})
    name = id2name.get(rep.get("accountId")) or (rep.get("displayName") if rep.get("displayName") in acc else None)
    if not name: continue
    d = (f.get("created") or "")[:10]
    if not d: continue
    byday[name][d] = byday[name].get(d, 0) + 1

json.dump({"from": FROM, "asof": ASOF, "byDay": byday},
          open(D + "/created-by-member.json", "w"))
tot = sum(sum(v.values()) for v in byday.values())
print(f"project-wide created pull: {len(rows)} tickets since {FROM} -> created-by-member.json")
for n in acc:
    print(f"  {n:20} {sum(byday[n].values())}")
