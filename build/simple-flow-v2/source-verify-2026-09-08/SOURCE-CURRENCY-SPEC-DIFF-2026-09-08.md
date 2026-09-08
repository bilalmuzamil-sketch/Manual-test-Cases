# Simple Flow V2 — SOURCE CURRENCY + SPEC-DIFF (read 2026-09-08)

Epic **SV-8683** · PO **Milos Vasic** · cases in **group 6665** (12 story sub-folders) · run **R416**.
Prior source-verification: spec **v23** (reconciled 2026-08-21; authored v21). This pass re-verifies
against the **8 September 2026** spec revision.

## Source currency (Rule 31 / Rule 57 list)
| Source | Identifier | Version / last updated | Verdict |
|---|---|---|---|
| Specification | Confluence **771391574** "Simple Flow V2" | **Revised 8 September 2026** (was v23, 2026-08-21) | **MOVED** — 11 stories changed; per-requirement diff below. |
| Epic + stories | **SV-8683**, stories **SV-9247 … SV-9267** | unchanged set | CURRENT — story→case map unchanged. |
| Design | Purchase Orders page + Work orders & settings (shared .dc.html exports) | attached this pass | Read; spec is explicit and cases follow the spec (Rule 57). No design/spec conflict found. |
| Tech plan | `SimpleFlowV2TechnicalImplementationPlan_2.md` | **byte-identical to `_1`** — no change | reference only (Rule 30, informs not overrules). |
| PO / Owner | **Milos Vasic** | unchanged | CURRENT. |

Currency judged by **body content + the story tables**, not by Confluence's relative "edited"
timestamp (Rule 31 trap). The 8-September revision rewrites Stories 2, 3, 4, 5, 7, 13, 14, 15, 17, 18
and adds detail to Story 1.

## v23 → 2026-09-08 diff (Rule 43 — per-requirement verdict)
Full per-case reasoning with the driving spec sentences is in **`/tmp/sfv2_diff_report.md`** (kept in
this folder as `DIFF-REPORT-2026-09-08.md`). Summary of the **39 cases mapped to the 11 changed
stories** (the other 22 cases belong to untouched stories and are unchanged):

| Story | # | UPDATE | UNCHANGED | HELD (Automated) | NEW |
|---|---|---|---|---|---|
| SV-9247 (1) | 5 | 1 (44551) | 4 | 0 | 0 |
| SV-9248 (2) | 3 | 2 (44554, 44555) | 1 | 0 | 0 |
| SV-9249 (3) | 2 | 0 | 1 | 1 (44557) | 1 (C53485) |
| SV-9250 (4) | 2 | 1 (44559) | 1 | 0 | 0 |
| SV-9251 (5) | 5 | 1 (44563) | 3 | 1 (44561) | 0 |
| SV-9253 (7) | 4 | 2 (44571, 44572) | 2 | 0 | 1 (C53486) |
| SV-9259 (13) | 6 | 1 (44585) | 3 | 2 (44583, 44587) | 1 (C53487) |
| SV-9260 (14) | 3 | 2 (44589, 44590) | 1 | 0 | 1 (C53488) |
| SV-9261 (15) | 2 | 0 | 2 | 0 | 1 (C53489) |
| SV-9263 (17) | 4 | 1 (44596) | 3 | 0 | 0 |
| SV-9264 (18) | 3 | 2 (44599, 44600) | 1 | 0 | 0 |
| **TOTAL** | **39** | **13** | **22** | **4** | **5** |

### The 13 UPDATED cases (atm=1, edited; expected re-derived from the 8-Sep spec)
C44551 · C44554 · C44555 · C44559 (title changed) · C44563 · C44571 · C44572 · C44585 · C44589 ·
C44590 · C44596 · C44599 · C44600. Central changes: **approval never changes an existing line**
(C44554/44555); **ordering-off creates a real purchase order and moves parts to "Awaiting"**
(C44551/44554); **picking-off deducts stock** (C44554); **audit attributed to the admin, no system
actor** (C44555); **applying at scale blocks the admin only, never the organization** (C44559);
**a Needs-Approval line completes by no path; Create invoice refused while any line is unapproved**
(C44563/44599/44600); **bulk bar splits line vs parts groups with dividers + Deselect all**
(C44571/44572); **vendor can be created from the field; fixed once received** (C44585/44589/44590);
**receive-wizard step has one action** (C44596). Provenance re-stamped to "revised 8 September 2026,
read on 8 September 2026"; deferred marker "Last checked 9/8/2026".

### The NEW cases (atm=1, automation_type set, deferred marker) — 5 created, 4 net after option A
| C-id | Story | Covers |
|---|---|---|
| ~~C53485~~ | SV-9249 (3) | **RETIRED (deleted) 2026-09-08 under option A** — its content was absorbed into C44557. |
| **C53486** | SV-9253 (7) | Deselect all keeps the bar; close dismisses it; an empty group shows no divider. |
| **C53487** | SV-9259 (13) | A vendor is correctable until a part is received, then fixed (guard on the back end too). |
| **C53488** | SV-9260 (14) | PO list-page selection raises the shared bulk bar; Assign vendor in More; paged Select-all covers one page. |
| **C53489** | SV-9261 (15) | Deferring a part with a core: the core follows the parent and is never offered its own choice. |

### The 4 HELD Automated cases (Rule 71)
C44557 (Story 3) · C44561 (Story 5) · C44583 (Story 13) · C44587 (Story 13). **C44557 was out of date;
per the QA lead's option A (2026-09-08) it was brought current in place** (title + all three fields
rewritten to the narrowed-confirmation rule, type set to Functional, rendered to `fr-view`, atmstatus
kept 3), and the duplicate **C53485 deleted**. **🔔 Rule 65: Vlad (Vladimir Tomovic, TestRail user 1)
must be told the Automated case changed — flagged to the QA lead to relay.** The other three held cases
were re-verified spec-current and untouched. Full record: **`HELD-AUTOMATED-FOR-QA-LEAD-2026-09-08.md`**.

## Handling notes
- The 13 UPDATED cases had their build-check sentence omitted (this is a **no-build** suite, Rule 85);
  provenance carries the spec-read date only, marker is the Rule-69 "Not available on Build" form.
- **Automation type** backfilled on the 13 UPDATED cases (were born type 0): E2E for the cross-feature
  / audit / invoicing journeys (C44551, C44554, C44555, C44600), Functional for the rest. The 5 NEW
  cases were created with type set (all Functional). No case left type 0.
- **Vladimir Tomovic's foreign cases (Rule 38) untouched:** C45202, C45203 (created_by = 1).
- **Rendering:** all 18 written cases repaired to the served-page `markdown fr-view` container via the
  deterministic Froala `html.set` harness (`hs_write.mjs`); served-page verified (numbers on their own
  rows, no literal tags/entities, AUTOMATION marker last). Log: `REPAIRED-hs.jsonl`.
- **Run R416** synced 61 → 66 (5 new; 2 passed preserved — Rule 34), then → **65** after C53485 was retired (option A).

## OUTSTANDING (for the QA lead / PO)
1. **C44557 (held Automated)** — ✅ **RESOLVED via option A**: brought current in place; duplicate C53485
   deleted. **🔔 Rule 65 still open: Vlad must be told the Automated case changed** — flagged to the QA
   lead to relay.
2. **3 PO questions for Milos** (spec ambiguities, cannot be answered from documents) — delivered as a
   **Google Sheet** (https://docs.google.com/spreadsheets/d/1wqxIZaQSl4LH4ju798RdSQgaaG2rV5YzgWx2jAhx5fk/edit;
   super-simple PO questions in Part 1, all references in Part 2) and the xlsx copy in this folder:
   (a) Story 2 "approval first" vs "approval changes no existing line"; (b) Story 14 paged Select-all
   accepted as expected; (c) Story 4 the two engineering volume thresholds.
