#!/usr/bin/env python3
"""14 Nov 2026, PRD version 13 (QA lead: "Named set (Recommended)"). Updates our existing cases: the 73 rewritten top to bottom and the 307
re-stamped (From line to version 13, after quote_check.py proved every quote word for word in version 13). The 14 Demo Day cases are never
touched. No case is moved: update_case never sends section_id, and each read-back must show the case still in its live folder.

EDIT LOCK, two modes:
  default (as ordered): a case is updated ONLY if its live title, preconditions, steps, expected result and refs still equal OUR LAST WRITTEN
          BODY (the 10 Nov 2026 read-back, currency-2026-11-10/applied/C<id>-after.json). The body sent is the library's (authoring/proposals.json).
          Every other case is listed as "edited outside our library" and never overwritten.
  --on-live (only on the QA lead's decision): the body sent is the v13 body built ON the live text (proposals-v13-on-live-writable.json:
          every outside edit kept, merge_on_live.py, invariant proved by check_merge.py); a case is updated only if its live fields and
          updated_on still equal the 14 Nov 2026 read (live-before/live-2026-11-14.json); anything edited since is listed and skipped.
          Cases in held-out-of-write.json are never written (DATA-13: a case id in its live tester text fails the readiness check).
Per op: before-copy, update_case, read-back field by field and section_id, log (operation, C-id, HTTP status, read-back).
Dry run unless --apply.   python3 update_cases.py [--on-live] [--apply]"""
from _common import *
ON_LIVE = "--on-live" in sys.argv
ID = ids()
keys = sorted(k for k in PROP if k in ID and k not in DEMO)
plan, outside, held, noop = [], [], [], []
for k in keys:
    cid = ID[k]; lv = SNAP14[cid]
    if k in HELD: held.append({"key": k, "case": f"C{cid}", "why": HELD[k], "link": link(cid)}); continue
    if ON_LIVE:
        new = MERGED[k]["fields"]
    else:
        base = last_written(cid)
        if base is None or any(not same(f, lv.get(f), base.get(f)) for f in FIELDS):
            diff = [f for f in FIELDS if base is not None and not same(f, lv.get(f), base.get(f))]
            outside.append({"key": k, "case": f"C{cid}", "fields_edited": diff, "updated_by": lv.get("updated_by"), "link": link(cid)}); continue
        new = PROP[k]["fields"]
    fl = [f for f in FIELDS if not same(f, lv.get(f), new.get(f))]
    (plan.append({"key": k, "case": cid, "fields": fl, "section_live": lv["section_id"]}) if fl else noop.append(k))
mode = "on-live" if ON_LIVE else "locked on our last written body"
from collections import Counter
print(f"mode: {mode} | cases {len(keys)} | to update {len(plan)} | edited outside our library {len(outside)} | held {len(held)} | no change {len(noop)}")
print("fields to update:", dict(Counter("+".join(p["fields"]) for p in plan)))
json.dump({"mode": mode, "plan": plan, "edited_outside": outside, "held": held, "no_change": noop},
          open(f"{OUT}/update-plan-{'on-live' if ON_LIVE else 'locked'}-2026-11-14.json", "w"), indent=1)
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
from trlib import api, LAST
os.makedirs(f"{OUT}/before", exist_ok=True); L = log("update-2026-11-14-log.jsonl"); bad = skipped = 0
for p in plan:
    k, cid = p["key"], p["case"]; live = api(f"get_case/{cid}"); lock = SNAP14[cid]
    if ON_LIVE: moved = live["updated_on"] != lock["updated_on"] or any(not same(f, live.get(f), lock.get(f)) for f in FIELDS)
    else:
        base = last_written(cid); moved = any(not same(f, live.get(f), base.get(f)) for f in FIELDS)
    if moved:
        L.write(json.dumps({"op": "skipped_edit_lock", "key": k, "case": f"C{cid}", "mode": mode, "live_updated_on": live["updated_on"],
                            "updated_by": live.get("updated_by")}) + "\n"); skipped += 1; continue
    json.dump(live, open(f"{OUT}/before/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    body = (MERGED[k] if ON_LIVE else PROP[k])["fields"]
    payload = {f: body[f] for f in p["fields"]}; assert "section_id" not in payload
    api(f"update_case/{cid}", payload); http = LAST["status"]
    a = api(f"get_case/{cid}")
    wrong = [f for f in p["fields"] if not same(f, a.get(f), body[f])] + (["section_id moved"] if a["section_id"] != live["section_id"] else [])
    bad += bool(wrong)
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "mode": mode, "http": http, "fields": p["fields"],
                        "section": a["section_id"], "readback_ok": not wrong, "wrong": wrong}) + "\n"); L.flush()
print("updated", len(plan) - skipped, "| skipped (edit lock)", skipped, "| read-back problems", bad)
