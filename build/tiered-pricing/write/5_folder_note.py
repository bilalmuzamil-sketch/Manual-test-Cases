#!/usr/bin/env python3
"""(e) Rule 140 currency note on section 138770: its description becomes the note sentence, with any existing text kept below it.
EDIT-LOCKED on the live text: the dry run saves the live description (section-138770-before.json); --apply re-reads it and writes only if it
is still exactly that text (otherwise it stops: the folder changed after review). If the note is already there, nothing is written. The folder
name is never changed. Read back. Log: log-folder.jsonl. Run last.   python3 5_folder_note.py [--apply]"""
import json, sys, os
from _tp import *
L = logger("folder")
print("the note:", NOTE)
readiness()
api, LAST = tr()
sec = api(f"get_section/{TOP}"); desc = sec.get("description") or ""
BEFORE = f"{W}/section-{TOP}-before-note.json"
print(f"live name {sec['name']!r}\nlive description {desc!r}")
new = desc if NOTE in desc else f"<p>{NOTE}</p>" + desc      # the live description is HTML; the existing text stays below the note
print("will write:" if new != desc else "already carries the note; nothing to write:", repr(new))
if not APPLY:
    json.dump(sec, open(BEFORE, "w"), indent=1, ensure_ascii=False)
    L({"op": "lock_saved", "section": TOP, "description": desc}); print("dry run: nothing written; live text saved as the lock"); sys.exit(0)
if not os.path.exists(BEFORE): sys.exit("REFUSED: run the dry run first (it saves the text the write is locked on)")
lock = json.load(open(BEFORE)).get("description") or ""
if desc != lock: L({"op": "lock", "section": TOP, "result": "LOCKED: live text changed since the dry run", "live": desc}); sys.exit("LOCKED: not written")
if new == desc: L({"op": "folder_note", "section": TOP, "result": "already current"}); sys.exit(0)
api(f"update_section/{TOP}", {"description": new}); st = LAST["status"]
back = api(f"get_section/{TOP}")
ok = (back.get("description") or "").startswith(f"<p>{NOTE}</p>") and back["name"] == sec["name"] and (not desc.strip() or desc in back["description"])
L({"op": "update_section", "section": TOP, "http": st, "readback_ok": ok, "name_unchanged": back["name"] == sec["name"]})
print("written and read back" if ok else "READ-BACK FAILED"); sys.exit(0 if ok else 1)
