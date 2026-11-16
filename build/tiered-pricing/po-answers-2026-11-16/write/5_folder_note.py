#!/usr/bin/env python3
"""(5) Rule 140 note on section 138770, stamped 11/16/2026, the earlier text kept below it. Edit-locked: writes only when the note is not already
the first paragraph; a description that already starts with today's note is read back and left alone. Log: log-folder.jsonl."""
import json, sys
from _w import *
L = logger("folder")
NOTE = ("Test cases are current as of 11/16/2026. Before you start testing, check whether the PRD, design or any other source has changed since "
        "then; if it has, update the test cases first.")
sec = api(f"get_section/{TOP}"); desc = sec.get("description") or ""
json.dump(sec, open(f"{W}/section-138770-before-2026-11-16.json", "w"), indent=1, ensure_ascii=False)
if desc.startswith(f"<p>{NOTE}") or desc.startswith(NOTE):   # TestRail nests the older paragraphs inside the first <p>
    L({"op": "folder_note", "section": TOP, "result": "already current (stamped 11/16/2026 by the 16 Nov write; earlier text kept below)", "readback_ok": True,
       "name": sec["name"], "description": desc})
    print("already current; read back:", repr(desc[:300])); sys.exit(0)
import re
rest = re.sub(r"^<p>Test cases are current as of \d\d/\d\d/\d{4}\..*?</p>", "", desc, flags=re.S)
new = f"<p>{NOTE}</p>" + rest
print("will write:", repr(new[:300]))
if not APPLY: sys.exit(0)
api(f"update_section/{TOP}", {"description": new}); st = LAST["status"]
back = api(f"get_section/{TOP}"); ok = (back.get("description") or "").startswith(f"<p>{NOTE}</p>") and back["name"] == sec["name"]
L({"op": "update_section", "section": TOP, "http": st, "readback_ok": ok}); print("written, read back", ok); sys.exit(0 if ok else 1)
