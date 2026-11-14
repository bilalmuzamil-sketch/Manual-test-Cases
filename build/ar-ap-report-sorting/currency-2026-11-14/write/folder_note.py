#!/usr/bin/env python3
"""14 Nov 2026 (Rule 140). Sets the currency note on the suite's main folder 90418 ("A/R and A/P Report Sorting, Export and Location Filter").
EDIT LOCK on the live description: it is written only if the live description still equals what was read on 14 Nov 2026 (empty); text the QA
lead wrote himself would be kept below the note (Rule 140 item 3). Before-copy, update_section, read-back, log.
Dry run unless --apply.   python3 folder_note.py [--apply]"""
from _common import *
SEC = 90418
NOTE = ("Test cases are current as of 11/14/2026. Before you start testing, check whether the PRD, design or any other source has changed "
        "since then; if it has, update the test cases first.")
LOCK = json.load(open(f"{W}/live-before/live-2026-11-14.json"))["folder_90418"].get("description") or ""
old = LOCK
new = NOTE if not old.strip() or old.strip() == NOTE else NOTE + "\n\n" + old
print(f"folder {SEC}: live description as read 14 Nov 2026 = {old!r}\nnew description = {new!r}")
from trlib import api, LAST
live = api(f"get_section/{SEC}")
print(f"live read: folder {SEC} description now {live.get('description')!r}; lock {'holds' if (live.get('description') or '') == LOCK else 'BROKEN'}")
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
if (live.get("description") or "") != LOCK:
    sys.exit(f"REFUSED (edit lock): the folder description changed since 14 Nov 2026: {live.get('description')!r}; show it to the QA lead")
json.dump(live, open(f"{OUT}/section-{SEC}-before-2026-11-14.json", "w"), indent=1)
api(f"update_section/{SEC}", {"description": new}); http = LAST["status"]
a = api(f"get_section/{SEC}"); ok = (a.get("description") or "").strip() == new.strip()
rec = {"op": "update_section", "section": SEC, "http": http, "readback_ok": ok, "description": a.get("description")}
log("folder-note-2026-11-14-log.jsonl").write(json.dumps(rec) + "\n"); print(rec)
