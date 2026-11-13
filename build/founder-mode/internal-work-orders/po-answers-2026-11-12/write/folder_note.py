#!/usr/bin/env python3
"""Round 4 (13 Nov 2026): Rule 140 currency note on the main folder, section 136701 ("Internal Work order (11/12/2026)"): its description
gets the date of plan.json "folder_note" (11/13/2026) in place of 11/12/2026; every other word stays. LOCKED: the live section is re-read and
changed only if its description is still the one read on 13 Nov 2026 (section-136701-live-2026-11-13.json); the name is not touched. Read back after the write. Run after update_cases.py --apply.
   python3 folder_note.py            dry run (with --check-live: reads the section)     python3 folder_note.py --apply"""
import sys
from _wlib import *
L = logger("folder"); want = PLAN["folder_note"]; before = json.load(open(f"{W}/section-136701-live-2026-11-13.json"))
html = before["description"].replace("current as of 11/12/2026.", "current as of 11/13/2026.")
if html == before["description"] or want["description"] not in html.replace("\n", " ").replace("<p>", ""): sys.exit("refuse: the note to write is not the plan's")
print(f"section {want['section_id']} {before['name']!r}: description {before['description']!r} -> {html!r}")
if not LIVE: print("dry run: nothing read or written"); sys.exit(0)
api, LAST = tr()
live = api(f"get_section/{want['section_id']}")
if (live.get("description") or "") != before["description"]:
    L({"op": "lock", "section": want["section_id"], "result": "LOCKED: live description differs", "live": live.get("description")}); sys.exit("LOCKED: the live description changed; not written")
if not APPLY: L({"op": "lock", "section": want["section_id"], "result": "ok (dry run, not written)"}); print("lock ok, dry run"); sys.exit(0)
api(f"update_section/{want['section_id']}", {"description": html}); st = LAST["status"]
back = api(f"get_section/{want['section_id']}")
L({"op": "update_section", "section": want["section_id"], "http": st, "readback_ok": want["description"] in (back.get("description") or ""), "name_unchanged": back["name"] == before["name"]})
print("written and read back" if want["description"] in (back.get("description") or "") else "READ-BACK FAILED")
