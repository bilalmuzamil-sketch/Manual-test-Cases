#!/usr/bin/env python3
"""(b) Create the 54 layout stress cases (plan-v14.json "create"; S12-49 dropped) on PRD v1.4 / design 1794565397-7f4c, each in its folder
(proposals.json, build.py's FOLDER logic: design cases in "Design — how it looks" 136719 (the 6 held on questions 17 and 18 too: waiting
design cases stay there), S9-49..S9-51 in Story 9 136710). Mirrors layout-stress-2026-11-14/create_layout_stress.py steps 1-4:
  1. tester-readiness check first (Rule 138); refuses on failure
  2. each target section must hold only cases in our testrail-id-map.csv (Rules 38, 123); refuses otherwise
  3. add_case for each key not yet in the map (resumable), read back field by field (after-copy in ../../applied/), map row appended with
     prd_version 1.4
  4. the case's design pictures (names under "References from Design") attached, idempotent, read back by name
   python3 create_v14.py                 dry run (plan only)
   python3 create_v14.py --check-live    dry run that also runs the foreign-case guard on the target sections (GET only)
   python3 create_v14.py --apply         the writes (QA lead's go-ahead, Rule 6). Run after update_v14.py --apply, before sync_run_v14.py."""
import sys, os, json, re, csv
from _v14 import *
import tester_readiness_check as TRC
L = logger("create"); PICRE = re.compile(r"[\w-]+\.png")
def pictures(k):
    h = NOW[k]["fields"]["custom_expected"]
    return sorted(set(PICRE.findall(h.split("References from Design", 1)[1]))) if "References from Design" in h else []
C = PLAN["create"]; M = mapping()
for c in C:
    k = c["key"]; v = NOW[k]; f = v["fields"]
    assert v["prd_version"] == "1.4" and v["held"] == c["held"] and v["section_id"] == c["section_id"] == SECS[c["section"]]["id"], k
    assert not v["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up"), k
    assert len(f["refs"]) < 250 and len(f["title"]) <= 80, k
    for n in pictures(k): assert os.path.exists(f"{IMG}/{n}"), (k, n)
todo = [c for c in C if c["key"] not in M]
print("PLAN (dry run unless --apply)")
for s in sorted({c["section"] for c in C}):
    ks = [c for c in todo if c["section"] == s]
    print(f"  {s:7} section {SECS[s]['id']} {SECS[s]['name'][:45]:45} add {len(ks):3} | held {sum(c['held'] for c in ks)}")
print(f"  already mapped: {[c['key'] for c in C if c['key'] in M]} | pictures to attach: {sum(len(pictures(c['key'])) for c in todo)} "
      f"({len({n for c in todo for n in pictures(c['key'])})} distinct files) | S12-49 in plan: {'S12-49' in [c['key'] for c in C]}")
TRC.require(P)          # Rule 138
if not LIVE: print("dry run: nothing read or written (add --check-live for the foreign-case guard, --apply to write)"); sys.exit(0)
api, LAST = tr()
ours = {int(r["case_id"]) for r in M.values()}
for s in sorted({c["section"] for c in C}):
    have = section_cases(api, SECS[s]["id"]); foreign = [x["id"] for x in have if x["id"] not in ours]
    L({"op": "section_guard", "section": SECS[s]["id"], "cases_now": len(have), "foreign": foreign})
    print(f"  guard {s} {SECS[s]['id']}: {len(have)} cases now, foreign {foreign}")
    if foreign: sys.exit(f"REFUSED: section {SECS[s]['id']} holds cases not in our map {foreign}; ask the QA lead (Rules 38, 123)")
if not APPLY: print("dry run: guard passed, nothing written"); sys.exit(0)
bad = 0
for c in todo:
    k = c["key"]; f = NOW[k]["fields"]; sid = c["section_id"]
    n = api(f"add_case/{sid}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = same(a, f) + (["section"] if a["section_id"] != sid else [])
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "section": sid, "http": st, "readback_ok": not diff, "bad": diff})
    with open(f"{P}/testrail-id-map.csv", "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, c["section"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}", "1.4"])
M = mapping()
for c in C:
    k = c["key"]; cid = int(M[k]["case_id"]); want = pictures(k)
    if not want: continue
    names = {a["name"] for a in attachments(api, cid)}
    for n in want:
        if n in names: L({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}); continue
        http, res = upload(cid, n); L({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http, "error": (res or {}).get("error")})
    okp = set(want) <= {a["name"] for a in attachments(api, cid)}; bad += not okp
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": okp})
print(f"created {len(todo)}, problems {bad}")
