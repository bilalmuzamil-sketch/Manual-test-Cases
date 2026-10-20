#!/usr/bin/env python3
"""Fresh live snapshot (16 Oct 2026, v61 pass) of every case under WO root section 13204 (all child sections, paged) and of run 498's
tests. Writes snapshots-before/live-cases.json (ours, created_by 3), all-cases.json (everyone's) and run498-tests.json."""
import json, urllib.request, base64, time
H = "build/wo-board-tech-view/prd-v71-2026-10-20"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C.get('email') or C.get('user')}:{C['password']}".encode()).decode()
def get(ep):
    for a in range(4):
        try:
            r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", headers={"Authorization": "Basic " + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=120))
        except Exception:
            if a == 3: raise
            time.sleep(3)
def paged(ep, key):
    out, off = [], 0
    while True:
        d = get(f"{ep}&limit=250&offset={off}"); page = d[key] if isinstance(d, dict) else d; out += page
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
secs = paged("get_sections/1&suite_id=1", "sections")
wo = {13204}; changed = True
while changed:
    changed = False
    for s in secs:
        if s["parent_id"] in wo and s["id"] not in wo: wo.add(s["id"]); changed = True
cases = []
for sid in sorted(wo): cases += paged(f"get_cases/1&suite_id=1&section_id={sid}", "cases")
json.dump([s for s in secs if s["id"] in wo], open(f"{H}/snapshots-before/sections.json", "w"), indent=1)
json.dump(cases, open(f"{H}/snapshots-before/all-cases.json", "w"), indent=1)
json.dump([c for c in cases if c["created_by"] == 3], open(f"{H}/snapshots-before/live-cases.json", "w"), indent=1)
tests = paged("get_tests/498", "tests"); run = get("get_run/498")
json.dump({"run": {k: run[k] for k in ("id", "name", "include_all", "is_completed")}, "tests": tests}, open(f"{H}/snapshots-before/run498-tests.json", "w"), indent=1)
from collections import Counter
print("sections", len(wo), "cases", len(cases), "by creator", Counter(c["created_by"] for c in cases), "run498 tests", len(tests), run["include_all"], run["is_completed"])
print("status in run", Counter(t["status_id"] for t in tests))
