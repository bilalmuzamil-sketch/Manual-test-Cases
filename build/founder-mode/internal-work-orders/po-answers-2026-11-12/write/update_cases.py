#!/usr/bin/env python3
"""Round 3: update every case in plan.json "update" to its PRD v1.1 body, and move the released cases out of "Waiting on Milos Vasic's
answers" (plan.json "move"). LOCKED on the live text: each case is re-read first and is only updated if every field still equals the body
we wrote (write/proposals-before-v1.1.json, the read-backs in applied/); a case someone else edited is skipped and listed (Rule 87),
never overwritten. Each update is read back field by field; the case's PRD version in testrail-id-map.csv becomes 1.1 after a clean
read-back. Missing design pictures named in the new body are attached and read back.
   python3 update_cases.py                 dry run (plan only)
   python3 update_cases.py --check-live    dry run that also re-reads every live case and reports the lock result (read-only)
   python3 update_cases.py --apply         the writes (only with the QA lead's go-ahead, Rule 6)"""
import re, csv, sys
from _wlib import *
L = logger("update"); M = mapping(); IMG = f"{P}/design-2026-11-12/images"
PICRE = re.compile(r"[\w-]+\.png")
def pics(h): return sorted(set(PICRE.findall(h.split("References from Design", 1)[1]))) if "References from Design" in h else []
ups, moves = PLAN["update"], PLAN["move"]
newpics = {u["key"]: sorted(set(pics(NOW[u["key"]]["fields"]["custom_expected"])) - set(pics(BEFORE[u["key"]]["fields"]["custom_expected"]))) for u in ups}
print(f"updates {len(ups)} | moves {len(moves)} | cases gaining pictures {sum(1 for v in newpics.values() if v)} ({sum(len(v) for v in newpics.values())} files)")
miss = sorted({p for v in newpics.values() for p in v if not os.path.exists(f"{IMG}/{p}")}); print("missing picture files", miss)
if miss: sys.exit("refuse: a picture named in a body is missing")
if not LIVE: print("dry run: nothing read or written (add --check-live to test the lock, --apply to write)"); sys.exit(0)
api, LAST = tr()
locked, ok, bad = [], 0, 0
BULK = live_cases(api)          # one pass over the section's live cases (the lock at the start); --apply re-reads each case again just before it writes
print(f"live cases read: {len(BULK)}")
for u in ups:
    k, cid = u["key"], u["case_id"]
    live = api(f"get_case/{cid}") if APPLY else BULK.get(str(cid))
    if live is None: locked.append((k, cid, ["not found live"])); L({"op": "lock", "key": k, "case": f"C{cid}", "result": "LOCKED: not found live"}); continue
    diff = same(live, BEFORE[k]["fields"])
    if diff:
        locked.append((k, cid, diff)); L({"op": "lock", "key": k, "case": f"C{cid}", "result": "LOCKED: live differs from our last body", "fields": diff}); continue
    if not APPLY: L({"op": "lock", "key": k, "case": f"C{cid}", "result": "ok (dry run, not written)"}); continue
    body = {f: NOW[k]["fields"][f] for f in FIELDS + ["refs"]}
    api(f"update_case/{cid}", body); st = LAST["status"]
    back = api(f"get_case/{cid}"); rb = same(back, NOW[k]["fields"])
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not rb, "bad": rb}); ok += not rb; bad += bool(rb)
    if not rb: M[k]["prd_version"] = "1.1"; M[k]["title"] = NOW[k]["title"]
    for name in newpics[k]:
        from create_new import upload_one
        hs, res = upload_one(cid, name); L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": name, "http": hs, "error": (res or {}).get("error")})
if APPLY:
    for sec in sorted({m["to"] for m in moves}):
        ids = [int(m["case_id"]) for m in moves if m["to"] == sec and not any(x[0] == m["key"] for x in locked)]
        if not ids: continue
        api(f"move_cases_to_section/{SUITE}", {"section_id": SECS[sec]["id"], "suite_id": SUITE, "case_ids": ids}); st = LAST["status"]
        for cid in ids:
            back = api(f"get_case/{cid}"); okm = back["section_id"] == SECS[sec]["id"]
            L({"op": "move_case", "case": f"C{cid}", "to": sec, "http": st, "readback_ok": okm})
            k = next(m["key"] for m in moves if int(m["case_id"]) == cid)
            if okm: M[k]["section"] = sec
    with open(f"{P}/testrail-id-map.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["key", "case_id", "section", "title", "link", "prd_version"]); w.writeheader(); w.writerows(M.values())
print(f"lock: {len(ups) - len(locked)} ok, {len(locked)} LOCKED {[(k, c, d) for k, c, d in locked][:10]}" + (f" | updated {ok}, read-back failures {bad}" if APPLY else " | dry run: nothing written"))
