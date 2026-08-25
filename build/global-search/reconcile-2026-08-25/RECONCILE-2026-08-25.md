# Global Search — Reconciliation v1.1 → PRD v1.2 (2026-08-25)

**Trigger:** QA lead reported the spec updated + doubt the design changed. Verified live.

## What changed (verified 2026-08-25)
- **Spec:** Confluence 576978945 now **v1.2 (Confluence version 11)**, updated 8/25/2026 (was v1.1).
- **Design:** desktop **Global Search Page.html CHANGED** (md5 differs vs the 4/5 bundle we authored
  from); **Mobile Global Search.html IDENTICAL**. Design source migrated Figma → Claude Design
  (artifact fac6efcf). Appearance specifics to be confirmed against the new prototype at build time.
- **Epic SV-9160:** header says "16 stories"; live children = **17 Story + 7 verify Tasks**
  (SV-9306 page-search cutover added; SV-9307–9313 verify tasks). Our cases trace to PRD sections,
  not dev stories, so this does not change case content — recorded for traceability.

## Suite changes applied (97 → 109 cases)
| Action | Count | Detail |
|---|---|---|
| Provenance re-pinned to v1.2 | 109 | every case now cites "specification version 1.2 (Confluence version 11), read 25 Aug 2026" |
| **Moved to Out-of-V1 section** | 8 | GS-HOVER-01..08 (quick actions) → "Global Search - Out of V1 Scope (not tested this release)", each footer-stamped with the §5.4 / §2 non-goal reference. Kept, not deleted. |
| Flipped back into V1 (Show-all) | 3 | GS-GRP-03 (link appears >5), GS-GRP-04 (full-page handoff + banner + Clear search), GS-TAB-09 (scope-tab scoping). Reverses our tech-plan D15; PRD v1.2 §5.2 wins (Rule 32/57). |
| Wording aligned to v1.2 | 3 | GS-TAB-01 (ten tabs), GS-ENT-07 ("Contact match" + two-row rule), GS-EMPTY-01 (exact placeholder copy). |
| Entity cases corrected | 2 | GS-PO-01 (removed the "Receive" hover quick action; added §5.3 displayed fields), GS-VI-01 (removed quick-action line; badge set to **Paid/Unpaid** per §5.3 + type Invoice/Sublet — see PO-GS-6). |
| **New V1 cases added** | 12 | Clear all (GS-REC-04); Contacts/PO/Vendor-Invoice scope tabs (GS-TAB-10/11/12); mobile §5.6 detail (GS-MOB-02..06); new-entity ranking (GS-RANK-06/07/08). |

## Coverage of the v1.2 additions (no genuine V1 case missed)
- 3 new entities (Contacts, POs, Vendor Invoices): rows GS-CON-01/PO-01/VI-01 + tabs GS-TAB-10/11/12
  + ranking GS-RANK-06/07/08 + permission GS-PERM-06. ✅
- "Show all" full-page handoff + banner: GS-GRP-03/04 + GS-LIST-01/02. ✅
- Clear all → first-time (web + mobile): GS-REC-04 + GS-MOB-05. ✅
- Contact-field match "Contact match" + two rows: GS-ENT-07. ✅
- Mobile §5.6 (full-screen, Cancel, chip row, uncapped/sticky, states, deferrals): GS-MOB-01..06. ✅
- AI removed: existing no-AI negatives retained as V1 guards. ✅

## Applied to TestRail 2026-08-25 (authorized by the QA lead)
The live run R415 holds the OLD 97 cases (assigned to Bilal). Recommended apply: re-import Global
Search from the 109-row file (as before), then (1) re-backfill C-IDs into testrail-id-map.csv,
(2) union-sync run R415 (`sync_runs.py --apply`), (3) re-assign R415 to Bilal (now 109). No results
exist yet, so nothing is lost.

## Open questions raised (PO)
- **PO-GS-5 (telemetry):** PRD §6.4 says the search-event schema is in place day 1 (mechanism only);
  the epic's SV-9167 is in Board Backlog and our earlier D20 deferred telemetry. In or out for v1?
- **PO-GS-6 (vendor-invoice badge):** PRD §5.3 says Paid/Unpaid (binary); our tech-plan-based case had
  tri-state (Unpaid/Partially paid/Paid). Cases now follow the PRD; confirm the build's actual states.


## APPLIED 2026-08-25 (lossless, in place)
- 97 existing cases **updated in place by C-ID** (IDs preserved); 8 quick-action cases **moved** to a
  new 'Out of V1 Scope' section; **13 new V1 cases added**; new 'Search Telemetry' section created.
- id-map re-backfilled: **110/110** live C-IDs. Run **R415 union-synced to 110** and **re-assigned to
  Bilal** (all Untested). Verified live: group 110 cases, 0 duplicate titles, 8 Out-of-V1.
- Nothing deleted; no results existed, so nothing lost. Tool: build/global-search/apply_to_testrail.py
