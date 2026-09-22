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
