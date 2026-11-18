#!/usr/bin/env python3
"""18 Nov 2026, Rule 141 (QA lead: "Only the two cases now"). Rewrites C715471 (REL-01) and C715472 (REL-02) top to bottom from the library
(authoring/proposals.json, build.py 0 PROBLEM lines, readiness 0 hard problems). Quotes stay on PRD version 13.
EDIT LOCK: written only if the live title, preconditions, steps, expected result and refs still equal our last written body (10 Nov 2026
read-back) and updated_on still equals the 14 Nov 2026 read. No section_id is sent; run 557 and its results are never touched.
Per case: before-copy, update_case, read-back field by field, log. Dry run unless --apply."""
import sys, os, json
sys.path.insert(0, "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-14/write")
from _common import PROP, SNAP14, FIELDS, last_written, same, link, B
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools")
import tester_readiness_check as T
T.require(B)
from trlib import api, LAST
APPLY = "--apply" in sys.argv
OUT = os.path.dirname(os.path.abspath(__file__)) + "/applied"; os.makedirs(OUT, exist_ok=True)
logf = open(f"{OUT}/write-log.jsonl", "a")
for key, cid in (("REL-01", 715471), ("REL-02", 715472)):
    live = api(f"get_case/{cid}"); st = LAST["status"]
    base = last_written(cid)
    drift = [f for f in FIELDS if not same(f, live.get(f), base.get(f))]
    moved = live["updated_on"] != SNAP14[cid]["updated_on"]
    new = PROP[key]["fields"]; send = {f: new[f] for f in FIELDS if not same(f, live.get(f), new.get(f))}
    print(key, f"C{cid}", "get", st, "| edited outside our library:", drift or "no", "| changed since 14 Nov:", moved, "| fields to send:", list(send))
    if drift or moved: print("  SKIPPED (edit lock)"); continue
    if not APPLY: continue
    json.dump(live, open(f"{OUT}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", send); ust = LAST["status"]
    back = api(f"get_case/{cid}"); json.dump(back, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    bad = [f for f in FIELDS if not same(f, back.get(f), new.get(f))] + (["section_id"] if back["section_id"] != live["section_id"] else [])
    rec = {"op": "update_case", "case": f"C{cid}", "key": key, "http": ust, "fields": list(send), "readback_mismatch": bad, "link": link(cid)}
    logf.write(json.dumps(rec) + "\n"); print(" ", rec)
