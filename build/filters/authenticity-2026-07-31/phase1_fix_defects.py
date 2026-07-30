#!/usr/bin/env python3
"""PHASE 1 of the Filters closing-authenticity pass (2026-07-31).

Fixes the 3 pre-existing defects the 2026-07-31 audit found but had no
authorization to touch:
  (a) FLT-STAT-07 = C38877 — refs cite "spec S2-R1 (conflict ... export of spec
      v1.3 awaited)". The conflict is RESOLVED: v1.6 added S2-R7 + S2-N4, which
      say exactly what the case asserts. Re-point + drop the resolved
      PENDING-BRANKO note.
  (b) FLT-API-06 = C38895 — refs cite "spec v1.3 S10 per-user persistence
      (export awaited)". Re-point to v1.6 S10-R2 + S10-R3; keep the tech-plan
      endpoint citation (the endpoint shape is genuinely tech-plan-sourced).
  (c) FLT-EMPTY-02 = C29607 — refs leak the internal id "FLT-EMPTY-03".
      References must carry ticket/spec refs only.

LOCAL ONLY. The TestRail write happens in the Phase 5 authorized push.
Ticket half uses the honest wording proven by
build/epic-recheck-2026-07-31/FILTERS-EPIC-SEARCH.md: Filters has NO Jira epic.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import load_all, patch

EDITS = {
    "FLT-STAT-07": {
        "spec_ref": "Filters (no Jira epic) (S2-R7 (Imported cannot be combined with anything else; other filter chips disabled while it is active); S2-N4 (the combination is prevented rather than returning an empty result)) [spec v1.6 2026-07-28]",
        "notes": "Traceability repaired 2026-07-31 (closing-authenticity pass defect (a)): refs re-pointed from \"tech plan G1; spec S2-R1 (conflict raised with the author - export of spec v1.3 awaited)\" to the ratified anchors S2-R7 + S2-N4. The conflict is RESOLVED - spec v1.6 (Confluence page 572030978 version 12 2026-07-28) added S2-R7 verbatim: \"Imported is an exception to S2-R2 and cannot be combined with anything else ... selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips\" - which is exactly what this case asserts, so the PENDING-BRANKO question is closed. Tech plan 2026-07-29 G1 independently corroborates the same build behaviour. Exact disabled look/tooltip still VIU-confirm. A saved or shared state combining Imported with other filters must also normalise back to Imported-only on load (tech plan risk 4).",
    },
    "FLT-API-06": {
        "spec_ref": "Filters (no Jira epic) (S10-R2 (filters stored server-side against the user account; last write wins); S10-R3 (saved per user)) + tech plan 2026-07-29 s4-1.3 (GET/PUT per-user page preferences) [spec v1.6 2026-07-28]",
        "notes": "Traceability repaired 2026-07-31 (closing-authenticity pass defect (b)): refs re-pointed from \"spec v1.3 S10 per-user persistence (export awaited)\" to the ratified v1.6 anchors S10-R2 + S10-R3; the export is no longer awaited (spec pulled live 2026-07-31, Confluence page 572030978 version 12). The ENDPOINT SHAPE is tech-plan-sourced (not spec) and is cited as such: tech plan 2026-07-29 section 4-1.3 - GET/PUT /api/users/me/preferences/{pageKey}; Work Orders pageKey = work-orders-list; unset pref returns value:null (200 not 404); 400 on a malformed page key or a value over 16 KB; last-write-wins across devices (matches S10-R2 verbatim). Expected result 4 (never-saved key returns success with an empty value) is tech-plan intent only - no spec anchor - and stays flagged for live confirmation.",
    },
    "FLT-EMPTY-02": {
        "spec_ref": "Filters (no Jira epic) (S8-R4 (the empty state includes a prompt or link to clear filters); S8-R5 (where a query is also active each is cleared independently)) [spec v1.6 2026-07-28]",
    },
}

def main():
    before = {c["id"]: dict(c) for _, c in load_all() if c["id"] in EDITS}
    for iid, e in EDITS.items():
        for k, v in e.items():
            if k == "spec_ref":
                assert len(v) <= 250, (iid, len(v))
                assert "," not in v, ("comma in refs", iid)
                assert "FLT-" not in v, ("internal-id leak", iid)
        print("%-14s refs %d -> %d chars" % (iid, len(before[iid].get("spec_ref") or ""), len(e.get("spec_ref") or before[iid]["spec_ref"])))
        print("   BEFORE:", before[iid].get("spec_ref"))
        print("   AFTER :", e.get("spec_ref"))
    n = patch(EDITS)
    print("patched cases:", n)

if __name__ == "__main__":
    main()
