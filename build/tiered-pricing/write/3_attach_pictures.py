#!/usr/bin/env python3
"""(c) Attach each case's design pictures (proposals.json picture_files: design-2026-11-14/images/, its full-height pictures and images/today/)
to its TestRail case, idempotent (a picture already attached by name is skipped), and read back by name. Needs the C-ids from
2_create_cases.py (testrail-id-map.csv). Log: log-pictures.jsonl.   python3 3_attach_pictures.py [--apply]"""
import sys, os
from _tp import *
L = logger("pictures"); PR = prop(); M = mapping()
want = {k: [f"{P}/{p}" for p in v["picture_files"]] for k, v in PR.items() if v["picture_files"]}
missing = sorted({p for ps in want.values() for p in ps if not os.path.exists(p)})
print(f"PLAN: {sum(len(x) for x in want.values())} attachments on {len(want)} cases, {len({os.path.basename(p) for ps in want.values() for p in ps})} "
      f"distinct files | cases without a picture (nopic reason): {len(PR) - len(want)} | missing files: {missing}")
print(f"cases with a C-id: {sum(k in M for k in want)} of {len(want)}")
if missing: sys.exit("REFUSED: picture files missing")
readiness()
if not APPLY:
    if M:
        api, LAST = tr(); k0 = next(k for k in want if k in M)
        print("live check (GET):", k0, f"C{M[k0]['case_id']} has", len(attachments(api, int(M[k0]["case_id"]))), "attachments")
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
api, LAST = tr(); bad = 0
for k, paths in want.items():
    if k not in M: L({"op": "skip_no_cid", "key": k}); bad += 1; continue
    cid = int(M[k]["case_id"]); have = attachments(api, cid)
    for p in paths:
        n = os.path.basename(p)
        if n in have: L({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}); continue
        http, res = upload(cid, p)
        L({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http, "error": res.get("error")})
    ok = {os.path.basename(p) for p in paths} <= attachments(api, cid); bad += not ok
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": [os.path.basename(p) for p in paths], "ok": ok})
print("problems:", bad); sys.exit(1 if bad else 0)
