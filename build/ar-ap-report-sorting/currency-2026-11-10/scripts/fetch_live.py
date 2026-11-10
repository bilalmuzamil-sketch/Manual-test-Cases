"""Read-only snapshot of TestRail group 90418 (A/R and A/P) for the 10 Nov 2026 currency assessment. get_* calls only."""
import json, sys, os
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
from trlib import api
OUT = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-10/live-before"
secs = []; off = 0
while True:
    r = api(f"get_sections/1&suite_id=1&offset={off}&limit=250")
    s = r["sections"] if isinstance(r, dict) else r
    secs += s
    if isinstance(r, dict) and r.get("_links", {}).get("next"): off += 250; continue
    break
byid = {s["id"]: s for s in secs}
def under(sid):
    while sid:
        if sid == 90418: return True
        sid = byid.get(sid, {}).get("parent_id")
    return False
ours = [s for s in secs if under(s["id"])]
print("sections total", len(secs), "under 90418", len(ours))
cases = []
for s in ours:
    off = 0
    while True:
        r = api(f"get_cases/1&suite_id=1&section_id={s['id']}&offset={off}&limit=250")
        c = r["cases"] if isinstance(r, dict) else r
        cases += [x for x in c if x["section_id"] == s["id"]]
        if isinstance(r, dict) and r.get("_links", {}).get("next"): off += 250; continue
        break
json.dump({"read": "2026-11-10", "sections": [{"id": s["id"], "name": s["name"], "parent_id": s["parent_id"]} for s in ours], "cases": cases},
          open(f"{OUT}/live-cases-2026-11-10.json", "w"), indent=1)
from collections import Counter
print("cases", len(cases), Counter(c["section_id"] for c in cases))
print("created_by", Counter(c["created_by"] for c in cases), "updated_by", Counter(c["updated_by"] for c in cases))
import datetime
print("updated_on max", datetime.datetime.utcfromtimestamp(max(c["updated_on"] for c in cases)))
