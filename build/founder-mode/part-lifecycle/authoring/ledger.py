#!/usr/bin/env python3
"""Writes ../TICKET-LEDGER.json (Rule 129) from the saved Jira read of 27 Oct 2026 and the library, and ../TICKET-SWEEP.json.
A row's "updated" is the ticket's own updated time when it was read, so a later edit makes it unhandled again (ticket_sweep.py).
Outcomes: NEW-CASES / COVERED / NO-CASE / ASKED (ticket_sweep's set) and PENDING-PHASE-B / PENDING-PHASE-C for stories whose cases
are still being rewritten in this full pass (deliberately not in ticket_sweep's set, so the sweep stays red until they are done).
Phases B and C re-run this script after writing their stories (set the outcome in OUTCOME below). Integration step, 27 Oct 2026: the
Phase B and Phase C outcomes (PHASE-B-REQUESTS.json, PHASE-C-REQUESTS.json) are merged below; no PENDING-PHASE row is left."""
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
def sec_cases(sec):
    """Every case of a section, mapped (C-id) or new (key), so new cases such as IV-08b, IV-12, IV-13 are listed too."""
    return sorted(f"C{MAP[c['key']]['case_id']}" if c["key"] in MAP else f"{c['key']} (new)" for c in L.CASES if c["sec"] == sec)
OUTCOME = {
 "SV-10814": ("NEW-CASES", "Story 1 rewritten to PRD v33 (Phase A). The 23 Oct comment (tabs during a cycle count, answer A) is S1-E1 in v31+: new case S1-14."),
 "SV-10815": ("COVERED", "Story 2 rewritten to PRD v33 (Phase A); S2-N3 is NO MANUAL CASE (a core has no row of its own)."),
 "SV-10816": ("COVERED", "Story 3 rewritten to PRD v33 (Phase A)."),
 "SV-10817": ("COVERED", "Story 4 rewritten to PRD v33 (Phase A). 23 Oct comment (untracked part keeps Min/Max, answer A) is the v31 overview/terminology wording: S4-03, S5-02 quote it. S4-N1/S4-N2 NO MANUAL CASE."),
 "SV-10818": ("COVERED", "Story 5 rewritten to PRD v33 (Phase A). 23 Oct comment (public API stock adjustment, answer A) is S5-E1a: NO MANUAL CASE (public API). S5-N1 NO MANUAL CASE."),
 "SV-10819": ('COVERED', "Story 6 rewritten to PRD v33 (Phase B): 8 live cases rewritten, new S6-09 (vendor return) and S6-10 (vendor credit) for S6-R1a, the 23 Oct comment (answer A, quoted)."),
 "SV-10820": ('COVERED', "Story 7 rewritten to PRD v33 (Phase B). 23 Oct comment (answer B: a linked entry with no category takes the dialog's) is the changed S7-R6c: S7-09 (entry with a category keeps it) and new split S7-09b (entry with no category takes the one picked), both quoting the comment. S7-N6 NO MANUAL CASE. S7-17 held on Q12, S7-25 held on Q4."),
 "SV-10821": ('COVERED', "Story 8 rewritten to PRD v33 (Phase B); S8-03 split per default role (S8-03b Parts Manager, S8-03c Service Advisor). S8-N1 to S8-N3 checked by hand with a screen opened before the role was cut to View only (S8-04, S8-13, S8-14)."),
 "SV-10822": ('COVERED', "Story 9 rewritten to PRD v33 (Phase B). 23 Oct comment (answer A, bundles unchanged) is the reworded S9-N3a: S9-28 (Vendor Order Management Create & Edit can search parts on a return), S9-41 and S9-42 (Returns access compared with production, today's app). New S9-43 to S9-46 (S9-R21) and S9-47, S9-48 (S9-R22). S9-E9 NO MANUAL CASE."),
 "SV-10823": ('COVERED', "Story 10 rewritten to PRD v33 (Phase B). 23 Oct comment (answer A, only the changed Min/Max pair) is the changed S10-R22a: S10-25 (both pairs), new split S10-25b (only Max; no entry when neither changed), S10-26 (only Min, import). S10-N3, S10-N4, S10-R25a NO MANUAL CASE. S10-22 and S10-29 held on Q1."),
 "SV-10824": ('NEW-CASES', "Story 11 rewritten to PRD v33 (Phase C): 18 live cases rewritten keeping C-ids, 3 split parts (S11-03b, S11-08b, S11-09b), 2 new cases for S11-R8 / S11-R9 (PRD v30, 19 Oct): S11-19, S11-20. S11-E3 (public API create) NO MANUAL CASE. Ticket text unchanged since 9 Oct (its S11-R3 still says the detail page deletes; the PRD v29+ wording, Delete in the Edit Library Part window, is followed)."),
 "SV-10825": ('COVERED', "Story 12 rewritten to PRD v33 (Phase C): 14 live cases rewritten keeping C-ids. Changed S12-R14b (v30: uses the most recent delivery's cost) is in S12-14 (C573674). S12-06 (C425620) held on Q3. Three S12-R11 refusals with no named screen route: NO MANUAL (rows 47 variants, 48, 49), question Q13."),
 "SV-10826": ('NEW-CASES', "Story 13 rewritten to PRD v33 (Phase C): 44 live cases rewritten keeping C-ids, 6 split parts, 3 new: S13-45 (S13-N1a look-alike rename at another location, Chris Ward's 23 Oct answer Q1 = B), S13-46 (\"This part could not be activated\"), S13-47 (Story 13 context note: Inventory Value for a date before a rename shows the old number). S13-N1b (23 Oct answer Q2 = A, core renamed on its own), S13-R19d (public API) and S13-N8 (re-point) NO MANUAL CASE."),
 "SV-10380": ('NEW-CASES', "11 live cases rewritten keeping C-ids (IV-01..IV-11), 1 split (IV-08b, PDF download parity) and 2 new for Chris Ward's 23 Oct comment (footer Margin % is the true aggregate, total margin / total sell, above 100% or below 0; a single negative row shows the dash): IV-12 (200.0%) and IV-13 (-25.0%). Rule 116: every figure computed from known inputs."),
 "SV-11756": ('NO-CASE', "No case: ships separately, Chris Ward 26 Oct 2026. The duplicate-part merge tool is a console command an operator runs (app:inventory:delete-duplicate-part, SV-10939); no screen runs it, so a manual tester cannot reach the behaviour. Chris Ward, 26 Oct 2026: Parts Lifecycle ships without the fix and the tool is not to be run where the two copies have different tracking. Developers' check (its own acceptance: tracked 5/$50 + untracked 3/$30 leaves $50 in both directions; app and SQL agree). Related manual coverage that stays: past-date Inventory Value leaves out untracked parts (S5-14, ACC-3) and saved past figures are kept (IV-11, ACC-4)."),
}
VERIFY = "Developers' verification checklist for one tech-plan phase (SV-11038 to SV-11046): facts about what is testable, not a source of expected behaviour; every item it lists is a PRD code covered (or listed) in REQUIREMENT-MAP.json."
led = {}
for i in J["issues"]:
    k, f = i["key"], i["fields"]
    if k in OUTCOME: out, note = OUTCOME[k]
    elif k.startswith("SV-110") and "Verify Phase" in f["summary"]: out, note = "NO-CASE", VERIFY
    else: out, note = "ASKED", "not classified yet"
    st = next((n for n, j in L.STORY_JIRA.items() if j == k), None)
    cases = (cases_for(st) if st and f"S{st}" in build_mods.WRITTEN else live_cases(f"S{st}") if st else (sec_cases("IV") if "IV" in build_mods.WRITTEN else live_cases("IV")) if k == "SV-10380" else [])
    led[k] = {"updated": f["updated"], "summary": f["summary"], "status": f["status"], "outcome": out, "cases": cases, "note": note}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Founder Mode / Part Lifecycle", "epic": "SV-10647", "stories": list(L.STORY_JIRA.values()), "prd_page": "829227015",
           "prd_version_handled": 33, "prd_version_note": "v29 -> v33 diffed 27 Oct 2026 (full-pass-2026-10-27/PRD-DIFF-v29-v33.md); handled when every phase is written"},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1)
from collections import Counter
print("ledger rows", len(led), dict(Counter(r["outcome"] for r in led.values())))
