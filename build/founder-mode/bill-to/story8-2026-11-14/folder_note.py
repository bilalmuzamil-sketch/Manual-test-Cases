#!/usr/bin/env python3
"""DRAFT, NOT RUN (14 Nov 2026, Rule 140). Sets the currency note on the Bill To suite's main folder 132467 ("Bill To", suite 1).
No description of 132467 is recorded in our files, so the EDIT LOCK works in two runs:
  1. dry run: reads the live description (read only) and saves it as applied/section-132467-snapshot.json; prints the new description
  2. --apply: writes only if the live description still equals that snapshot (otherwise REFUSED: show it to the QA lead); the tester-
     readiness check runs first (Rule 138); an earlier "Test cases are current as of" line is replaced, any other text (the QA lead's own)
     is kept below the note (Rule 140 item 3); before-copy, update_section, read-back, log.
python3 folder_note.py [--apply]"""
import sys, os, json, re
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
APPLY = "--apply" in sys.argv; SEC = 132467
NOTE = ("Test cases are current as of 11/14/2026. Before you start testing, check whether the PRD, design or any other source has changed "
        "since then; if it has, update the test cases first.")
SNAP = f"{H}/applied/section-{SEC}-snapshot.json"; os.makedirs(f"{H}/applied", exist_ok=True)
live = api(f"get_section/{SEC}"); cur = live.get("description") or ""
rest = re.sub(r"^\s*Test cases are current as of \d\d/\d\d/\d{4}\.[^\n]*\n*", "", cur).strip()
new = NOTE + ("\n\n" + rest if rest else "")
print(f"folder {SEC} ({live.get('name')}): live description {cur!r}\nnew description {new!r}")
if not APPLY:
    json.dump(live, open(SNAP, "w"), indent=1, ensure_ascii=False); print(f"DRY RUN: nothing written; live description saved as the lock ({SNAP})"); sys.exit(0)
TRC.require(P)
if not os.path.exists(SNAP): sys.exit("REFUSED: run the dry run first so the live description is saved as the lock")
lock = json.load(open(SNAP)).get("description") or ""
if cur != lock: sys.exit(f"REFUSED (edit lock): the folder description changed since the dry run: {cur!r}; show it to the QA lead")
json.dump(live, open(f"{H}/applied/section-{SEC}-before.json", "w"), indent=1, ensure_ascii=False)
api(f"update_section/{SEC}", {"description": new}); http = LAST["status"]
a = api(f"get_section/{SEC}"); ok = (a.get("description") or "").strip() == new.strip()
rec = {"op": "update_section", "section": SEC, "http": http, "readback_ok": ok, "description": a.get("description")}
open(f"{H}/applied/folder-note-log.jsonl", "a").write(json.dumps(rec) + "\n"); print(rec)
