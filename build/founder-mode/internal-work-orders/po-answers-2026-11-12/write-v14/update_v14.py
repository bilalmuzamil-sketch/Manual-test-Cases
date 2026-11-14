#!/usr/bin/env python3
"""(a) Update the 34 touched live cases to their PRD v1.4 / design 1794565397-7f4c bodies (plan-v14.json "update": 16 CHANGE, 8 RE-QUOTE,
10 DESIGN REFERENCE). LOCKED on the live text: each case is re-read first and is only updated if every field still equals our last
read-back (lock-base-34.json: the round-4 body written 13 Nov 2026 and read back OK); a case someone else edited is skipped and listed
(Rule 87), never overwritten. Before-copy of each live case in before/C<id>.json; after-copy in ../../applied/C<id>-after.json. Each update
is read back field by field; testrail-id-map.csv gets prd_version 1.4 and the new title after a clean read-back. Pictures: the -v14
pictures the new body names are attached and read back; the old pictures of the changed boards are deleted where TestRail allows (a picture
used on a closed run cannot be deleted: TestRail answers 200 with an error body; logged, not retried). The tester-readiness check runs first
and refuses on failure (Rule 138).
   python3 update_v14.py                 dry run (plan only)
   python3 update_v14.py --check-live    dry run that also reads every live case and its attachments (GET only) and reports the lock
   python3 update_v14.py --apply         the writes (only with the QA lead's go-ahead, Rule 6)"""
import sys, os, json
from _v14 import *
import tester_readiness_check as TRC
L = logger("update"); M = mapping(); LOCK = json.load(open(f"{W}/lock-base-34.json"))["cases"]
ups = PLAN["update"]
miss = sorted({p for u in ups for p in u["pictures_add"] if not os.path.exists(f"{IMG}/{p}")})
kinds = ", ".join(f"{s} {sum(u['set'] == s for u in ups)}" for s in ("CHANGE", "RE-QUOTE", "DESIGN REFERENCE"))
print(f"updates {len(ups)} ({kinds})"
      f" | pictures to attach {sum(len(u['pictures_add']) for u in ups)} | old pictures to delete {sum(len(u['pictures_delete']) for u in ups)} | missing files {miss}")
if miss: sys.exit("refuse: a picture named in a body is missing")
for u in ups:
    k = u["key"]; assert M[k]["case_id"] == u["case_id"] == LOCK[k]["case_id"], k
    assert NOW[k]["prd_version"] == "1.4", k
TRC.require(P)          # Rule 138: refuses (exit) on a hard problem
if not LIVE: print("dry run: nothing read or written (add --check-live to test the lock, --apply to write)"); sys.exit(0)
api, LAST = tr()
os.makedirs(f"{W}/before", exist_ok=True)
locked, ok, bad, dels = [], 0, 0, []
for u in ups:
    k, cid = u["key"], u["case_id"]
    live, err = safe(api, f"get_case/{cid}")
    if live is None: locked.append((k, cid, [err])); L({"op": "lock", "key": k, "case": f"C{cid}", "result": "LOCKED: not readable", "error": err}); continue
    json.dump(live, open(f"{W}/before/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    diff = same(live, LOCK[k])
    att = attachments(api, cid); names = {a["name"] for a in att}
    if diff:
        locked.append((k, cid, diff)); L({"op": "lock", "key": k, "case": f"C{cid}", "result": "LOCKED: live differs from our last read-back", "fields": diff}); continue
    if not APPLY:
        L({"op": "lock", "key": k, "case": f"C{cid}", "result": "ok (dry run, not written)", "attached_now": sorted(names),
           "would_attach": [p for p in u["pictures_add"] if p not in names], "would_delete": [p for p in u["pictures_delete"] if p in names]}); continue
    body = {f: NOW[k]["fields"][f] for f in FIELDS + ["refs"]}
    api(f"update_case/{cid}", body); st = LAST["status"]
    back = api(f"get_case/{cid}"); rb = same(back, NOW[k]["fields"])
    json.dump(back, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not rb, "bad": rb}); ok += not rb; bad += bool(rb)
    if not rb: M[k]["prd_version"] = "1.4"; M[k]["title"] = NOW[k]["title"]
    for name in u["pictures_add"]:
        if name in names: L({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": name}); continue
        hs, res = upload(cid, name); L({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": name, "http": hs, "error": (res or {}).get("error")})
    now_names = {a["name"] for a in attachments(api, cid)}
    okp = set(u["pictures_add"]) <= now_names; bad += not okp
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": u["pictures_add"], "ok": okp})
    for a in att:
        if a["name"] not in u["pictures_delete"]: continue
        r, err = safe(api, f"delete_attachment/{a['id']}"); st = LAST["status"]
        body_err = (r or {}).get("error") if isinstance(r, dict) else None
        rec = L({"op": "delete_attachment", "key": k, "case": f"C{cid}", "file": a["name"], "http": st, "error": err or body_err})
        if err or body_err: dels.append((k, a["name"], err or body_err))
if APPLY: write_map(M)
print(f"lock: {len(ups) - len(locked)} ok, {len(locked)} LOCKED {locked}" + (f" | updated {ok}, read-back failures {bad}, picture deletes refused {len(dels)}" if APPLY else " | dry run: nothing written"))
