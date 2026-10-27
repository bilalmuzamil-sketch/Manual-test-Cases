#!/usr/bin/env python3
"""Writes ../TICKET-LEDGER.json (Rule 129) from the saved Jira read of 27 Oct 2026 and the library, and ../TICKET-SWEEP.json.
A row's "updated" is the ticket's own updated time when it was read, so a later edit makes it unhandled again (ticket_sweep.py).
Outcomes: NEW-CASES / COVERED / NO-CASE / ASKED (ticket_sweep's set). The sweep's Jira input is
sources/jira-2026-10-27/raw-*.json (every ticket under the epic and its stories, plus SV-11850 and SV-11558 linked to it)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wwlib as L, build_mods  # noqa: F401  (loads every case module)
P = L.P
nodes = []
for f in ("raw-others.json", "raw-stories-2-4.json"):
    nodes += json.load(open(f"{P}/sources/jira-2026-10-27/{f}"))["issues"]["nodes"]
MAP = L.id_map()
def sec_cases(sec):
    return sorted(f"C{MAP[c['key']]['case_id']}" if c["key"] in MAP else f"{c['key']} (new)" for c in L.CASES if c["sec"] == sec)
def ef_cases(t):
    return sorted(f"C{MAP[c['key']]['case_id']}" if c["key"] in MAP else f"{c['key']} (new)" for c in L.CASES if t in c["marker"] + c["note"])
OUTCOME = {
 "SV-11257": ("COVERED", "Epic. Every story below handled; comments of 19 Oct (redeployed with PRD v14, QA on sv10130 and qb1) and 27 Oct "
              "(QA's staging re-check: Stories 1, 3, 4 passed; Story 2 blocked by SV-11850) read. No new behaviour beyond PRD v15."),
 "SV-10130": ("NEW-CASES", "Story 1 rewritten to PRD v15 (8 live cases, top to bottom). New splits S1-03b (v14 S1-R6: the message shows on "
              "leaving Title empty, SV-10916) and S1-04b (Edit Line fields). Developer's 19 Oct note (\"Title cannot be longer than 255 "
              "characters\") is not in the PRD: question Q1, no case."),
 "SV-10131": ("COVERED", "Story 2 rewritten to PRD v15 (4 live cases). The builder is reached through the ShopCoach Line Builder box on the "
              "Lines tab (developer's test plan, SV-11850). C154711, C154712, C549079 carry AUTOMATION: READY - EXPECT FAIL (SV-11850)."),
 "SV-10132": ("NEW-CASES", "Story 3 rewritten to PRD v15 (18 live cases). New for v14: S3-19 (description of spaces), S3-20 (tech story of "
              "spaces), S3-21 (end of line trimmed), S3-22 (a value's own trailing space kept; developer and QA, 23 Oct), S3-23 (S3-E4: "
              "old invoice, new text in the report)."),
 "SV-10133": ("NEW-CASES", "Story 4 rewritten to PRD v15 (7 live cases). New S4-08 (v14 S4-R3: old names in any capitals, spaces around). "
              "Where imported invoices are found (developer, 21 Oct) used in the steps. Row error messages that keep the old wording "
              "(developer, 8 Oct) asked as question Q3."),
 "SV-10390": ("NO-CASE", "Developers' verification checklist (Done 21 Oct): facts about what is testable, not a source of expected "
              "behaviour; every item is a PRD code covered in REQUIREMENT-MAP.json (Story 3)."),
 "SV-10391": ("NO-CASE", "Developers' verification checklist (Done 21 Oct) for Stories 1-2; every item is a PRD code covered in REQUIREMENT-MAP.json."),
 "SV-10392": ("NO-CASE", "Developers' verification checklist (Done 21 Oct) for Story 4; every item is a PRD code covered in REQUIREMENT-MAP.json."),
 "SV-10393": ("NO-CASE", "E2E coverage task (Done 21 Oct): automation work, no behaviour of its own."),
 "SV-11850": ("COVERED", "Open bug (27 Oct): Build Lines shows nothing on staging. Marker AUTOMATION: READY - EXPECT FAIL (SV-11850) with the "
              "symptom and three outcomes on the cases whose steps click Build Lines; S2-04 carries a note (its precondition needs a ShopCoach line)."),
 "SV-11558": ("NO-CASE", "Founder Mode Batch #2 epic, linked to SV-11257 (Fixes); lists What/Why as item 1, no behaviour of its own."),
}
led = {}
for i in nodes:
    k, f = i["key"], i["fields"]
    out, note = OUTCOME[k]
    st = next((n for n, j in L.STORY_JIRA.items() if j == k), None)
    cases = sec_cases(f"S{st}") if st else (ef_cases("SV-11850") if k == "SV-11850" else [])
    led[k] = {"updated": f["updated"], "summary": f.get("summary", ""), "status": f["status"]["name"], "outcome": out, "cases": cases, "note": note}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Founder Mode / What/Why (Title and Description)", "epic": L.EPIC, "stories": list(L.STORY_JIRA.values()),
           "prd_page": "845348896", "prd_version_handled": 15,
           "prd_version_note": "v13 -> v15 diffed 27 Oct 2026 (full-pass-2026-10-27/PRD-DIFF-v13-v15.md); every changed code is quoted by a rewritten or new case (Phase A)"},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1)
from collections import Counter
print("ledger rows", len(led), dict(Counter(r["outcome"] for r in led.values())))
