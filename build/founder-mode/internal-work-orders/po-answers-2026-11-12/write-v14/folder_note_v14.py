#!/usr/bin/env python3
"""(d) Rule 140 currency note on the IWO main folder, section 136701: the date in "Test cases are current as of MM/DD/YYYY." becomes
11/14/2026; every other word of the description and the folder name stay. LOCKED on the live text: the description must hold that sentence
exactly once, with the rest of the required wording; otherwise nothing is written. Before-copy in section-136701-before.json; read back.
   python3 folder_note_v14.py               dry run (plan only)
   python3 folder_note_v14.py --check-live  dry run that also reads the section (GET only)
   python3 folder_note_v14.py --apply       the write (QA lead's go-ahead, Rule 6). Run last."""
import sys, json, re
from _v14 import *
L = logger("folder"); F = PLAN["folder"]; sid = F["section_id"]; want = F["sentence"]
REST = "Before you start testing, check whether the PRD, design or any other source has changed since then; if it has, update the test cases first."
assert want == f"Test cases are current as of {F['date']}. {REST}"
print(f"section {sid}: the note will read: {want!r}")
if not LIVE: print("dry run: nothing read or written"); sys.exit(0)
api, LAST = tr()
sec = api(f"get_section/{sid}"); desc = sec.get("description") or ""
json.dump(sec, open(f"{W}/section-{sid}-before.json", "w"), indent=1, ensure_ascii=False)
hits = re.findall(r"Test cases are current as of (\d\d/\d\d/\d{4})\. " + re.escape(REST), desc)
if len(hits) != 1:
    L({"op": "lock", "section": sid, "result": f"LOCKED: the note sentence found {len(hits)} times", "live": desc}); sys.exit("LOCKED: not written")
new = desc.replace(f"current as of {hits[0]}.", f"current as of {F['date']}.")
print(f"live name {sec['name']!r} | live date {hits[0]} -> {F['date']}" + (" (already current)" if hits[0] == F["date"] else ""))
if not APPLY: L({"op": "lock", "section": sid, "result": "ok (dry run, not written)", "from": hits[0], "to": F["date"]}); sys.exit(0)
if hits[0] == F["date"]: L({"op": "folder_note", "section": sid, "result": "already current, not written"}); sys.exit(0)
api(f"update_section/{sid}", {"description": new}); st = LAST["status"]
back = api(f"get_section/{sid}")
okn = want in (back.get("description") or "") and back["name"] == sec["name"]
L({"op": "update_section", "section": sid, "http": st, "from": hits[0], "to": F["date"], "readback_ok": okn, "name_unchanged": back["name"] == sec["name"]})
print("written and read back" if okn else "READ-BACK FAILED")
