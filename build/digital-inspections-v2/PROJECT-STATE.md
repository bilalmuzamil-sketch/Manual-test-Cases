# Digital Inspection V2 — PROJECT-STATE

**Started:** 2026-09-22 (source verification). PO/spec owner: Milos Vasic (spec 768507905). Manual tester: TBC.

## 🔴 STATUS 2026-09-22 — SUITE DELETED AND REBUILT FROM SCRATCH
The QA lead authorised deleting the old 43-case suite and rebuilding from scratch against the CURRENT
spec (**Confluence 768507905**, last modified 2026-09-18). Done:
- Old 43 cases deleted (snapshot in `source-verify-2026-09-22/cases-dump.md`); 6 old generic subfolders
  removed; **16 per-story subfolders** created (ids in `source-verify-2026-09-22/section-map.json`).
- **87 new cases authored (C88507–C88593)** covering every one of the 373 R/N/E anchors in the current
  spec, Expected quoted verbatim by anchor (Rule 113) + plain restatement. All fr-view.
- **AUTOMATION marker = `HOLD - not yet build-verified` on all 87** (not build-verified ⇒ not
  automation-ready; QA lead 2026-09-22).
- Full record + folder→C-id map: **`source-verify-2026-09-22/REBUILD-COMPLETE-2026-09-22.md`**.
- Still outstanding: build verification on `sv8181.qa.shopview.com` (with ShopCoach enabled), then
  re-stamp dates and flip markers; create/sync a test run (union-only).

## What this is
Digital Vehicle Inspections V2 (DVI V2), epic **SV-8181** ("Digital Inspection V2", Ready for
Development, updated 2026-09-10) — follow-ups from V1 epic SV-7426 plus new requirements. V1 predecessor
= SV-7426.

## Sources (preserved in build/digital-inspections-v2/sources/, from the QA lead's 2026-09-22 upload)
- **DVI-V2-PRD.md** (the PRD, 62 KB) — Claude design handoff PRD.
- **DVI-V2-build-spec.md** (43 KB) — build specification.
- **DVI-V2-user-stories.md** (18 KB) — user stories.
- **DVI-V2-Technical-Implementation-Plan.md** (154 KB) — engineering tech plan (Digital Inspections V2
  Foundation).
- **FOLLOWUP-handoff.md**, **PREVIEW-MODE-handover.md**, **CLAUDE-CODE-HANDOFF.md**,
  **DESIGN-HANDOFF-README.md**, **DVI-V2-design-brief.md**, **DVI-V2-shopcoach-design-prompt.md**.
- **Claude design screens** (.dc.html, in the upload zip, not committed — large): Inspection Fill V2
  (Desktop/Mobile), Inspection Template Builder V2, ShopCoach Line Builder V2, Conditional Follow-up V2,
  "All Screens", plus screenshots in uploads/.
- **Epic SV-8181 + 38 children** (live in Jira). DVI V2 stories: SV-9099 (S1) … SV-9112, SV-9397 (S14),
  SV-9404 (S15), SV-9440, SV-9881–SV-9887, SV-10243. **OBSOLETE: SV-9108 (S10 — require acknowledgement
  of an instruction).** Plus V1 follow-up bugs (SV-76xx / SV-81xx / SV-9043 / SV-10257).

⚠️ Currency to establish (Rule 31/32): the attached PRD/build-spec/user-stories are a design-handoff
snapshot; the epic's stories are live (2026-09-10). Where they differ, latest authoritative wins (32)
and the divergence is disclosed (56). The epic description carries no Confluence PRD link — the attached
docs + the stories are the source set unless a case cites a Confluence page.

## TestRail — group 6658 "Digital Inspection V2 (Aug 2026)" (parent 3559), 43 cases, ALL ours (created_by=3)
| Section | Cases |
|---|---|
| 6659 Capturing Findings | 14 |
| 6660 Building Work From Findings | 16 |
| 6661 Inspection History | 4 |
| 6662 Template Builder | 5 |
| 6663 Customer Report | 2 |
| 6664 Phone Filling | 2 |

No test run identified yet for this suite (to confirm). No QA build host identified yet (source-verify
only for now; Rule 85).

## Task in progress
**Source verification** of all 43 cases (Rule 101 full; Rule 108 whole-doc + links; Rule 113 Expected =
verbatim source quote). Working dir: `build/digital-inspections-v2/source-verify-2026-09-22/`.

## 🔴 14 Oct 2026 — currency check (read this first)
- **PRD now v43** (Confluence 768507905, 13 Oct, Milos Vasic): 8 codes added, 4 removed, 71 reworded since our 22 Sep copy. Record: `currency-2026-10-14/SOURCE-CHECK-2026-10-14.md`.
- **Ownership (Slack, Milos Vasic, 12 Oct, https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899):** "QA on the feature squad owns writing and updating test cases." Staging 13 Oct (https://shopview.slack.com/archives/C0C39T5MLMB/p1791892327032259); production planned Thu 15 Oct (Project Plan, Confluence 902660109).
- **Others on the suite:** build-verified 1 Oct on sv8181 (v26.36.8-2a64085) by the build-verification session; Vladimir flagged 30 Automated + 2 Pending; Viktoria Videnovic edited 19 cases 5–13 Oct. List: `currency-2026-10-14/PERMISSION-ASK-2026-10-14.md`; her diffs: `OTHERS-EDITS-2026-10-14.md`.
- **We have NOT edited any case.** Notification for Vladimir and Viktoria (27 outdated cases, 11 to check, 3 later Jira decisions, 8 uncovered items): Google Doc https://docs.google.com/document/d/14x7FWO4X6sVvUoxTi1v5dRpS8hok7B6kcDPiQEvKTH0/edit (source HTML `currency-2026-10-14/notify/`). The QA lead shares it.
- **Waiting on the QA lead:** whether we still update this suite at all (ownership).
- **Design (14 Oct upload `ShopView_Inspection_Form_Redesign_1.zip`):** driven to the Rule 124 gates — 184/184 files read, 5,283 elements swept, 49 flows, 2,414 texts, 0 unclassified. 27 design-vs-PRD conflicts (SC-01…SC-27) and 2 case-needed (CN-01 S3-R8, CN-02 S4-R5). Proof: `design-drive-2026-10-14/DESIGN-COVERAGE-2026-10-14.md`; triage `design-drive-2026-10-14/inventory/DESIGN-TEXT-TRIAGE-2026-10-14.md`.
- **Tool gap found:** `build/testing-tools/design_text_inventory.py` drops single-word labels, lowercase texts with a digit, and texts containing "this/let/var/const"; the drive used `design-drive-2026-10-14/scripts/supp.py` to recover 566 texts. Shared tool not changed (awaiting the QA lead).
- **QA lead decision 14 Oct 2026 (verbatim):** "FOr DVI we will stop at this report, and I will tell you if this is the policy goingforward for ALL the upcoming feature squads and the existing feature squads too." → **We do not edit DVI V2 cases.** Deliverable: the notification spreadsheet for Vladimir and Viktoria. Whether this applies to all feature squads is NOT decided yet — do not treat it as a rule until he says so.
- **Notification spreadsheet (QA lead asked 14 Oct for a Google Sheet):** built as `currency-2026-10-14/notify/DVI-V2-changes-for-Vladimir-and-Viktoria.xlsx` (4 tabs: Read me, Cases to update 58 rows, Later Jira decisions 3, No case yet 8; dates from the spec's Change Log, `change-dates.json`). Google Sheets upload failed twice: the base64 copy came out corrupted (sheet 11lyuyjo8VH3LhMWX8wfGPpsV3TorCo7asi_2CJijUHo — do NOT use), and the plain-text route was stopped by a safety check, which we do not work around. File sent to the QA lead to import himself. Test file 1n5o86aPnqXGTQ1OcUeu-lC-ipX1xaDAUfBSLa7miTK0 is a throwaway. The earlier Google Doc (14x7FWO4…) is superseded by the spreadsheet.
- 14 Oct: on the QA lead's "Yes", trashed the corrupted sheet (11lyuyjo…), the test file (1n5o86aP…) and the superseded Google Doc (14x7FWO4…). The QA lead imports and shares the spreadsheet. Feature-squad policy: he will confirm in a few days.
- **14 Oct, QA lead: "GIve only those changes which actually require the test case to change NOT just a few words."** Filtered spreadsheet `currency-2026-10-14/notify/DVI-V2-behaviour-changes-for-Vladimir-and-Viktoria.xlsx`: 40 rows across 25 cases (30 rows on automated cases); 18 wording-only rows dropped (6 of them leave an outdated quote in the case only); later Jira: C88575 only (C88561/C88579 dropped: SV-11103 is not about file names / phone has no hover); 8 new behaviours with no case. Each kept row quotes the case sentence that is no longer right. Classification: `behaviour-filter.json`. Open point: C88530 S5-R17 ("field is visible" dropped) may only be a clean-up — PO question.
