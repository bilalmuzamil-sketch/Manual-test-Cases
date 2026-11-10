#!/usr/bin/env python3
"""10 Nov 2026, round 3. Updates custom_expected (and, on D-63, D-68 and D-73, custom_preconds) on the 46 cases that carry a re-shot picture: only the References from Design block changes
(the re-shot picture is listed under its new name, and the tester is told the older attachment shows the design before 23 Oct 2026 and must
not be used). EDIT LOCK on the live text as round 2 wrote it, re-read 10 Nov 2026 (live-before/live-46-round3-2026-11-10.json): a case whose
updated_on or custom_expected has changed since is skipped and logged. Before-copy, read-back, log. Run before attach_reshot.py.
Dry run unless --apply.  python3 update_refs.py [--apply]"""
from _common import *
AFF = json.load(open(f"{W}/reshot-affected-cases.json")); ID = ids()
PRE_KEYS = {"D-63", "D-68", "D-73"}   # round 3: the "open the design picture" precondition is back, naming the re-shot file
LIVE = json.load(open(f"{W}/live-before/live-46-round3-2026-11-10.json"))
plan = []
for k in AFF:
    lv = LIVE[k]; new = PROP[k]["fields"]["custom_expected"]; old = lv["custom_expected"]
    assert lv["id"] == ID[k]
    assert old.split("References from Design")[0] == new.split("References from Design")[0], k   # nothing above the design block changes in Expected
    for x in ("title", "custom_steps", "refs"): assert same(x, lv.get(x), PROP[k]["fields"][x]), (k, x)
    pre_changed = not same("custom_preconds", lv.get("custom_preconds"), PROP[k]["fields"]["custom_preconds"])
    assert pre_changed == (k in PRE_KEYS), k                        # preconditions change on D-63, D-68, D-73 only
    assert "attached later" not in new and "no longer attached" not in new, k
    fl = (["custom_preconds"] if pre_changed else []) + (["custom_expected"] if old != new else [])
    if fl: plan.append({"key": k, "fields": fl})
from collections import Counter
print("cases to update", len(plan), "of", len(AFF), "|", dict(Counter("+".join(p["fields"]) for p in plan)),
      "| preconditions:", [p["key"] for p in plan if "custom_preconds" in p["fields"]])
json.dump(plan, open(f"{OUT}/update-refs-plan-2026-11-10.json", "w"), indent=1)
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
from trlib import api, LAST
os.makedirs(f"{OUT}/before-round3", exist_ok=True); L = log("update-refs-2026-11-10-log.jsonl"); bad = skipped = 0
for p in plan:
    k = p["key"]; cid = ID[k]; lock = LIVE[k]; live = api(f"get_case/{cid}")
    if live["updated_on"] != lock["updated_on"] or any(live.get(x) != lock.get(x) for x in p["fields"]):
        L.write(json.dumps({"op": "skipped_edit_lock", "key": k, "case": f"C{cid}", "live_updated_on": live["updated_on"],
                            "lock_updated_on": lock["updated_on"], "updated_by": live.get("updated_by")}) + "\n"); skipped += 1; continue
    json.dump(live, open(f"{OUT}/before-round3/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    f = PROP[k]["fields"]; api(f"update_case/{cid}", {x: f[x] for x in p["fields"]}); http = LAST["status"]
    a = api(f"get_case/{cid}"); ok = all(a.get(x) == f[x] for x in p["fields"]); bad += not ok
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": http, "fields": p["fields"], "readback_ok": ok}) + "\n"); L.flush()
print("updated", len(plan) - skipped, "| skipped (edit lock)", skipped, "| read-back problems", bad)
