#!/usr/bin/env python3
"""Writes ../TICKET-LEDGER.json (Rule 129) from the saved Jira read of 27 Oct 2026 and the library, and ../TICKET-SWEEP.json.
A row's "updated" is the ticket's own updated time when it was read, so a later edit makes it unhandled again (ticket_sweep.py).
Outcomes: NEW-CASES / COVERED / NO-CASE / ASKED (ticket_sweep's set) and PENDING-PHASE-B / PENDING-PHASE-C for stories whose cases
are still being rewritten in this full pass (deliberately not in ticket_sweep's set, so the sweep stays red until they are done).
Phases B and C re-run this script after writing their stories (set the outcome in OUTCOME below)."""
import json, os, sys, csv
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pllib as L, build_mods  # noqa: F401  (loads every case module)
P = L.P
J = json.load(open(f"{P}/sources/jira-2026-10-27/EPIC-CHILDREN-2026-10-27.json"))
MAP = L.id_map(); BYKEY = {c["key"]: c for c in L.CASES}
def cases_for(st):
    out = []
    for c in L.CASES:
        if f"S{st}-" in " ".join(L.codes_of(c)) or c["sec"] == f"S{st}":
            out.append(f"C{MAP[c['key']]['case_id']}" if c["key"] in MAP else f"{c['key']} (new)")
    return sorted(set(out))
def live_cases(sec): return sorted(f"C{r['case_id']}" for k, r in MAP.items() if k.rsplit("-", 1)[0] == sec)
OUTCOME = {
 "SV-10814": ("NEW-CASES", "Story 1 rewritten to PRD v33 (Phase A). The 23 Oct comment (tabs during a cycle count, answer A) is S1-E1 in v31+: new case S1-14."),
 "SV-10815": ("COVERED", "Story 2 rewritten to PRD v33 (Phase A); S2-N3 is NO MANUAL CASE (a core has no row of its own)."),
 "SV-10816": ("COVERED", "Story 3 rewritten to PRD v33 (Phase A)."),
 "SV-10817": ("COVERED", "Story 4 rewritten to PRD v33 (Phase A). 23 Oct comment (untracked part keeps Min/Max, answer A) is the v31 overview/terminology wording: S4-03, S5-02 quote it. S4-N1/S4-N2 NO MANUAL CASE."),
 "SV-10818": ("COVERED", "Story 5 rewritten to PRD v33 (Phase A). 23 Oct comment (public API stock adjustment, answer A) is S5-E1a: NO MANUAL CASE (public API). S5-N1 NO MANUAL CASE."),
 "SV-10819": ("PENDING-PHASE-B", "23 Oct comment (tracking words in the vendor Return and Credit pickers, answer A) is S6-R1a (new in v31): needs a case."),
 "SV-10820": ("PENDING-PHASE-B", "23 Oct comment (linked entry with no category takes the dialog's, answer B) is the CHANGED S7-R6c: existing cases quoting the old S7-R6c must change."),
 "SV-10821": ("PENDING-PHASE-B", "No change since 9 Oct; cases rewritten in Phase B."),
 "SV-10822": ("PENDING-PHASE-B", "23 Oct comment (S9-N3a reworded to today's bundles, answer A); S9-R21/S9-R22 new in v30."),
 "SV-10823": ("PENDING-PHASE-B", "23 Oct comment (Min/Max history shows only the changed pair, answer A) is the CHANGED S10-R22a."),
 "SV-10824": ("PENDING-PHASE-C", "No change since 9 Oct in the ticket; PRD v30 added S11-R8/S11-R9."),
 "SV-10825": ("PENDING-PHASE-C", "No change since 9 Oct in the ticket; PRD v30 changed S12-R14b (uses the most recent delivery's cost)."),
 "SV-10826": ("PENDING-PHASE-C", "23 Oct comment (look-alike rename refused; a core cannot be renamed on its own) is S13-N1a/S13-N1b (new in v31)."),
 "SV-10380": ("PENDING-PHASE-C", "23 Oct comment: footer Margin % stays the true aggregate (Chris Ward, confirmed A) - a PO answer that needs a case in Phase C."),
 "SV-11756": ("PENDING-PHASE-C", "Merge tool (console command app:inventory:delete-duplicate-part) and past Inventory Value; Chris 26 Oct: ships separately. Phase C decides NO-CASE / NO MANUAL CASE."),
}
VERIFY = "Developers' verification checklist for one tech-plan phase (SV-11038 to SV-11046): facts about what is testable, not a source of expected behaviour; every item it lists is a PRD code covered (or listed) in REQUIREMENT-MAP.json."
led = {}
for i in J["issues"]:
    k, f = i["key"], i["fields"]
    if k in OUTCOME: out, note = OUTCOME[k]
    elif k.startswith("SV-110") and "Verify Phase" in f["summary"]: out, note = "NO-CASE", VERIFY
    else: out, note = "ASKED", "not classified yet"
    st = next((n for n, j in L.STORY_JIRA.items() if j == k), None)
    cases = (cases_for(st) if st and f"S{st}" in build_mods.WRITTEN else live_cases(f"S{st}") if st else live_cases("IV") if k == "SV-10380" else [])
    led[k] = {"updated": f["updated"], "summary": f["summary"], "status": f["status"], "outcome": out, "cases": cases, "note": note}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Founder Mode / Part Lifecycle", "epic": "SV-10647", "stories": list(L.STORY_JIRA.values()), "prd_page": "829227015",
           "prd_version_handled": 33, "prd_version_note": "v29 -> v33 diffed 27 Oct 2026 (full-pass-2026-10-27/PRD-DIFF-v29-v33.md); handled when every phase is written"},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1)
from collections import Counter
print("ledger rows", len(led), dict(Counter(r["outcome"] for r in led.values())))
