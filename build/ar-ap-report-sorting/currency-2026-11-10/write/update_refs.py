#!/usr/bin/env python3
"""10 Nov 2026, round 3. Updates custom_expected on the 46 cases that carry a re-shot picture: only the References from Design block changes
(the re-shot picture is listed under its new name, and the tester is told the older attachment shows the design before 23 Oct 2026 and must
not be used). EDIT LOCK on the live text as round 2 wrote it, re-read 10 Nov 2026 (live-before/live-46-round3-2026-11-10.json): a case whose
updated_on or custom_expected has changed since is skipped and logged. Before-copy, read-back, log. Run before attach_reshot.py.
Dry run unless --apply.  python3 update_refs.py [--apply]"""
from _common import *
AFF = json.load(open(f"{W}/reshot-affected-cases.json")); ID = ids()
LIVE = json.load(open(f"{W}/live-before/live-46-round3-2026-11-10.json"))
plan = []
for k in AFF:
    lv = LIVE[k]; new = PROP[k]["fields"]["custom_expected"]; old = lv["custom_expected"]
    assert lv["id"] == ID[k]
    assert old.split("References from Design")[0] == new.split("References from Design")[0], k   # nothing above the design block changes
    for x in ("title", "custom_preconds", "custom_steps", "refs"): assert same(x, lv.get(x), PROP[k]["fields"][x]), (k, x)
    assert "attached later" not in new and "no longer attached" not in new, k
    if old != new: plan.append(k)
print("cases to update", len(plan), "of", len(AFF), "| field: custom_expected (References from Design block only)")
json.dump(plan, open(f"{OUT}/update-refs-plan-2026-11-10.json", "w"), indent=1)
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
from trlib import api, LAST
os.makedirs(f"{OUT}/before-round3", exist_ok=True); L = log("update-refs-2026-11-10-log.jsonl"); bad = skipped = 0
for k in plan:
    cid = ID[k]; lock = LIVE[k]; live = api(f"get_case/{cid}")
    if live["updated_on"] != lock["updated_on"] or live.get("custom_expected") != lock["custom_expected"]:
        L.write(json.dumps({"op": "skipped_edit_lock", "key": k, "case": f"C{cid}", "live_updated_on": live["updated_on"],
                            "lock_updated_on": lock["updated_on"], "updated_by": live.get("updated_by")}) + "\n"); skipped += 1; continue
    json.dump(live, open(f"{OUT}/before-round3/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    f = PROP[k]["fields"]; api(f"update_case/{cid}", {"custom_expected": f["custom_expected"]}); http = LAST["status"]
    a = api(f"get_case/{cid}"); ok = a.get("custom_expected") == f["custom_expected"]; bad += not ok
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": http, "fields": ["custom_expected"], "readback_ok": ok}) + "\n"); L.flush()
print("updated", len(plan) - skipped, "| skipped (edit lock)", skipped, "| read-back problems", bad)
