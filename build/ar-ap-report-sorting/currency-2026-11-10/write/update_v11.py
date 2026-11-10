#!/usr/bin/env python3
"""10 Nov 2026 (QA lead: "Named set"). Updates the 355 kept cases (133 CHANGED + 222 STAMP-ONLY, from stamp-diff.json) to the library's
fields. EDIT LOCK on the 10 Nov 2026 snapshot (live-before/live-cases-2026-11-10.json): before each write the case is read live and is
skipped, untouched, if its updated_on or any field we would write differs from the snapshot (someone changed it since; Rules 38, 87, 123).
Writes only the fields that differ; keeps a before-copy; reads back. Dry run unless --apply.  python3 update_v11.py [--apply]"""
from _common import *
from collections import Counter
FIELDS = ["title", "refs", "custom_preconds", "custom_steps", "custom_expected"]
ID = ids(); plan = []
for k, st in STAMP.items():
    if st["status"] not in ("CHANGED", "STAMP-ONLY"): continue
    cid = ID[k]; snap = SNAP[cid]; f = PROP[k]["fields"]
    assert st["case_id"] == cid, (k, cid)
    diff = [x for x in FIELDS if not same(x, snap.get(x), f[x])]
    other = [x for x in ("type_id", "priority_id", "template_id", "custom_atmstatus") if snap.get(x) != f[x]]
    assert not other, (k, other)                       # nothing but the text fields changes
    assert snap.get("custom_atmstatus") != 3, k        # no case is flagged Automated (Rule 71); checked 10 Nov 2026: all 356 are 1
    if diff: plan.append({"key": k, "case": f"C{cid}", "status": st["status"], "fields": diff})
print("cases to update", len(plan), Counter(p["status"] for p in plan), Counter(tuple(p["fields"]) for p in plan).most_common())
json.dump(plan, open(f"{OUT}/update-plan-2026-11-10.json", "w"), indent=1)
if not APPLY: print("DRY RUN: nothing written. Plan: applied/update-plan-2026-11-10.json"); sys.exit(0)
readiness()
from trlib import api, LAST
os.makedirs(f"{OUT}/before", exist_ok=True); L = log("update-2026-11-10-log.jsonl"); bad = skipped = 0
for p in plan:
    k = p["key"]; cid = int(p["case"][1:]); snap = SNAP[cid]; f = PROP[k]["fields"]
    live = api(f"get_case/{cid}")
    moved = [x for x in FIELDS if not same(x, live.get(x), snap.get(x))]
    if live["updated_on"] != snap["updated_on"] or moved:
        L.write(json.dumps({"op": "skipped_edit_lock", "key": k, "case": p["case"], "live_updated_on": live["updated_on"],
                            "snapshot_updated_on": snap["updated_on"], "fields_changed_since": moved, "updated_by": live.get("updated_by")}) + "\n")
        skipped += 1; continue
    json.dump(live, open(f"{OUT}/before/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", {x: f[x] for x in p["fields"]}); http = LAST["status"]
    a = api(f"get_case/{cid}"); wrong = [x for x in p["fields"] if not same(x, a.get(x), f[x])]
    bad += bool(wrong)
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "update_case", "key": k, "case": p["case"], "http": http, "fields": p["fields"], "readback_ok": not wrong, "wrong": wrong}) + "\n"); L.flush()
print("updated", len(plan) - skipped, "| skipped (edit lock)", skipped, "| read-back problems", bad)
