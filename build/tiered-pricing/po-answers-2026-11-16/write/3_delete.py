#!/usr/bin/env python3
"""(3) Delete the 25 held design-version cases the PO ruled out (Rule 130; QA lead 16 Nov 2026: "Named set, write it (Recommended)").
Each: get_case; EDIT-LOCKED (skip and list a case whose live text differs from our 16 Nov read-back, or that is in run 560, or not ours);
save its full JSON to deleted/C<id>-before.json and its attachments list; delete_case/<id> POST {} (empty reply; a repeat answers 400);
confirm with get_case answering 400. Resumable: a case whose before-copy exists and whose get_case answers 400 is recorded as done.
Log: log-delete.jsonl.   python3 3_delete.py [--apply]"""
import json, sys
from _w import *
L = logger("delete"); M = idmap(); I = impact()
DEL = sorted(c["key"] for c in I["cases"] if c["verdict"] == "DELETE")
assert len(DEL) == 25
readiness()
run_cases = {t["case_id"] for t in paged(f"get_tests/{RUN}", "tests")}
plan, gone, skipped = [], [], []
for k in DEL:
    cid = int(M[k]["case_id"])
    try: live = api(f"get_case/{cid}")
    except RuntimeError as e:
        if e.args[0] == 400 and os.path.exists(f"{W}/deleted/C{cid}-before.json"): gone.append(k); continue
        raise
    prev = last_readback(cid)
    ok = prev is not None and all((norm_refs(live.get(f)) if f == "refs" else live.get(f)) == (norm_refs(prev.get(f)) if f == "refs" else prev.get(f)) for f in LOCK)
    why = [w for w, bad in (("edited outside our library", not ok), ("in run 560", cid in run_cases), ("not created by us", live.get("created_by") != 3)) if bad]
    if why: skipped.append((k, cid, why)); L({"op": "LOCKED_skip", "key": k, "case": f"C{cid}", "why": why}); continue
    plan.append((k, cid, live))
print(f"PLAN: delete {len(plan)} | already deleted {len(gone)} | skipped {skipped}")
for k, cid, live in plan: print(f"  {k:6} C{cid} {live['title']}")
if not APPLY: print("dry run: nothing written"); sys.exit(0)
bad = []
for k, cid, live in plan:
    att = api(f"get_attachments_for_case/{cid}"); att = att.get("attachments", att) if isinstance(att, dict) else att
    json.dump({"case": live, "attachments": [{x: a.get(x) for x in ("id", "name", "filename", "size", "created_on")} for a in att]},
              open(f"{W}/deleted/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    try: api(f"delete_case/{cid}", {}); st = LAST["status"]
    except RuntimeError as e: st = e.args[0]; L({"op": "delete_case", "key": k, "case": f"C{cid}", "http": st, "error": e.args[1]})
    try: api(f"get_case/{cid}"); confirm = 200
    except RuntimeError as e: confirm = e.args[0]
    ok = confirm == 400
    if not ok: bad.append(k)
    L({"op": "delete_case", "key": k, "case": f"C{cid}", "http": st, "confirm_get_case": confirm, "readback_ok": ok, "before_copy": f"deleted/C{cid}-before.json"})
print("deleted:", len(plan) - len(bad), "| problems:", bad); sys.exit(1 if bad else 0)
