# PROJECT-STATE — Simple Flow V2

**Canonical cold-resume doc.** Status derived live (Rule 92 / skill 15 §7).

## Identity
- **Epic:** SV-8683 (assignee/PM Milos Vasic) · **PO:** Milos Vasic
- **Spec:** Confluence **771391574**, **revised 8 September 2026** (re-verified 2026-09-08; was v23 reconciled 2026-08-21, authored v21)
- **Permission map:** SV-8183 (existing Custom Roles atoms; one new "Received later")
- **Designs:** Claude "Shopview App" 0c2ed95b + "Purchase Order Details" d2b4d45e (+ Work Order PRD, matrices) — static exports in intake-2026-08-21/sources/
- **Tech plan:** none standalone (folded into spec 2026-08-20) — reminded
- **QA env:** none ("Not yet available") — Rule-85 source-verified-only
- **Case source:** `build/simple-flow-v2/cases/` · internal ID prefix **SFV2** (`SFV2-<AREA>-NN`)
- **TestRail parent folder (group):** group_id **6665**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6665 (recorded 2026-08-25)
- **NOT the completed Simple Flow (SV-7301)** — this is a new V2 epic.

## Scope (spec v21): 21 stories
Settings (1-4) · Completing a line (5) · Line/part actions (6) · Bulk action bar (7-12) ·
Receiving from WO + PO pages + Receive later (13-15) · Completion wizard + finish action (16-18) ·
Part rows/menus + reordering (19-20) · Permissions (21). Story 10 (bulk delete) is OUT OF SCOPE.

## Status — 2026-08-21 (authoring pass complete)
- **INTAKE COMPLETE + FULL SUITE AUTHORED: 61 cases** across 12 areas (21 spec stories + permission map SV-8183).
- **Coverage: 21 of 21 stories covered, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **Deliverables:** requirements.md (v21) - coverage-matrix.md - intake-2026-08-21/{INTAKE, SOURCE-CURRENCY, SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md, sources/} - cases/ - testrail-id-map.csv - testrail-import/Simple-Flow-V2_testrail-import.{csv,xlsx} - questions-2026-08-21/ (PO sheet for Milos).
- **RUA:** 61/61 KEEP, 0 CUT/NONSENSE, 0 unresolved contradictions.
- **Rule-85:** SOURCE-VERIFIED ONLY - NO BUILD EXISTS YET (deferred marker on every case). NO TestRail/Jira writes.
- **Open PO questions:** PO-SF-1 (SV-8726 PO column rename scope) - PO-SF-2 (SV-8183 permission map is Blocked).
- **Reconciliation:** local 61 = id-map 61 = import 61; refs 61/61; set-equal both ways.


## How to resume
1. `git fetch` + `merge --ff-only`; claim lock.
2. Read intake-2026-08-21/{INTAKE, SOURCE-CURRENCY}; cases/; coverage-matrix.md.
3. On a QA build: build-verify sync (skill 03) lifts the deferred markers.

## TestRail run (2026-08-25, resynced 2026-09-08)
- **Full-suite run R416** — https://shopview.testrail.io/index.php?/runs/view/416. Union-synced 61 → 66 on 2026-09-08 (5 new added; 2 passed preserved — Rule 34), then **65** after C53485 was retired (option A). New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).

## Status — 2026-09-09 (FULL suite source RE-VERIFICATION — closes the delta-vs-full gap)
- **⚠️ The 2026-09-08 pass below was a DELTA:** it re-stamped only the 18 changed-story cases, leaving 47 of 65 at `v23 / read 21 Aug`. A build-verify session read that and correctly reported the suite last-verified 2026-08-21. Fixed today. **Lesson: `build/LEARNINGS-LOG.md` L0015 + `build/skills/02-SOURCE-CHECK.md` §5b (provenance-currency gate).**
- **Spec re-checked LIVE 2026-09-09:** Confluence 771391574 is STILL the 8 September 2026 revision (last edited 2026-09-08 by Milos; not moved). Epic stories + SV-8183 permission map fetched live.
- **The 22 never-checked cases** (stories 6, 8–12, 16, 19, 20, 21) content-diffed against the live spec: **21 UNCHANGED, 1 conflict (C44604)**.
- **Re-stamped 46 cases** to the 8-Sep revision (read 9 Sep), automation_type set (were 0), rendered to `fr-view`. **5 Automated re-stamped with QA-lead go-ahead** (C44561, C44575, C44583, C44587, C44605 → `source-verify-2026-09-09/FOR-VLAD-2026-09-09.md`).
- **🛑 C44604 HELD, not changed (Rule 58):** its Expected says the reorder Undo was "removed on user request 2026-09-04", but every spec version says "a drop can be undone" and no record of that removal exists in the repo. Unsourced case-vs-spec conflict → PO question for Milos, not a guess.
- **RESULT: 64 of 65 cases now carry the 8 September 2026 revision; C44604 is the one explicit hold.** Suite no longer mis-reports currency. Deliverables: `source-verify-2026-09-09/{SOURCE-CURRENCY-FULL-REVERIFY-2026-09-09.md, FULL-REVERIFY-DIFF-2026-09-09.md, FOR-VLAD-2026-09-09.md}`.
- **Build-verify may now proceed** on the 64 (Rule-85 source-verified-only, no build yet); flag C44604's held behaviour to the tester.
- **OUTSTANDING (2026-09-09):** PO question for Milos on C44604 (reorder Undo conflict); Rule-65 Vlad notice for the 5 Automated (+ C44557).

## Status — 2026-09-08 (SOURCE RE-VERIFICATION against the 8-Sep spec revision)
- **Spec MOVED** from v23 (2026-08-21) to the **8 September 2026** revision (Confluence 771391574); 11 stories changed. Tech plan `_2` is byte-identical to `_1` (no change). Design zips (Purchase Orders page, Work orders & settings) read — no design/spec conflict.
- **Disposition (Rule 43):** 39 cases mapped to the 11 changed stories → **13 UPDATE · 22 UNCHANGED · 4 HELD (Automated) · 5 NEW**. The other 22 cases belong to untouched stories.
- **13 UPDATED (atm=1):** C44551, C44554, C44555, C44559 (title changed), C44563, C44571, C44572, C44585, C44589, C44590, C44596, C44599, C44600. Automation type backfilled (E2E for C44551/44554/44555/44600, Functional for the rest).
- **5 NEW created (atm=1, type set):** C53485 (Story 3), **C53486** (Story 7), **C53487** (Story 13), **C53488** (Story 14), **C53489** (Story 15).
- **QA-lead option A executed 2026-09-08:** **C44557** (Automated, atm=3) brought current in place to the narrowed-confirmation rule (type=2, fr-view); the duplicate **C53485 deleted** (auto-removed from R416). **Vlad to be told (Rule 65)** — flagged. Net new cases = 4; suite is now **65 cases ours** in group 6665.
- **4 HELD Automated (Rule 71):** C44557 (now current per option A), C44561, C44583, C44587 — the latter three re-verified spec-current, untouched. → `source-verify-2026-09-08/HELD-AUTOMATED-FOR-QA-LEAD-2026-09-08.md`.
- **Vladimir's foreign cases (Rule 38) untouched:** C45202, C45203.
- **Rendering:** all 18 written cases repaired to served-page `markdown fr-view` (Froala `html.set` harness); marker last, no literal tags/entities. Log `source-verify-2026-09-08/REPAIRED-hs.jsonl`.
- **Deliverables:** `source-verify-2026-09-08/{SOURCE-CURRENCY-SPEC-DIFF-2026-09-08.md, DIFF-REPORT-2026-09-08.md, HELD-AUTOMATED-FOR-QA-LEAD-2026-09-08.md, Simple Flow V2 - Questions for Milos Vasic - 2026-09-08.xlsx}`.
- **Still Rule-85:** SOURCE-VERIFIED ONLY — no QA build exists yet; deferred marker on every written case. Ready for build-verification in a separate session once a build exists.
- **OUTSTANDING:** C44557 QA-lead decision (rewrite vs keep C53485); 3 PO questions for Milos (Story 2 approval-first, Story 14 paged Select-all, Story 4 volume thresholds).

## 🆕 2026-09-09 — BUILD VERIFICATION AUTHORISED + AUTOMATED GO-AHEAD EXTENDED
- **Source is current** (full re-verification finished 2026-09-09 by the source-verify session; 46 cases read 9-Sep + 18 read 8-Sep). Green signal given.
- **QA lead 2026-09-09: build verification proceeds on sv8683 (`v26.35.9-5700a76`), whole suite autonomously.**
- **AUTOMATED GO-AHEAD EXTENDED to Simple Flow V2** (QA lead 2026-09-09): the 7 Automated ours cases
  (C44557, C44561, C44575, C44583, C44587, C44604, C44605) may be build-verified + re-stamped like the
  rest — `custom_atmstatus` stays 3; **Vlad must be told (Rule 65)**. **Vladimir's 6** (C45202, C45203,
  C53490–C53493) stay hands-off (Rule 38).
- **Build-verify workspace:** `build/simple-flow-v2/build-verify-2026-09-09/`; observed labels
  `build/OBSERVED-UI-LABELS-sv8683.md`. Routes confirmed so far: WO Lines (Complete/New Line/Start/Pick/
  Part context menu), Settings → Work Orders tab (8 completion toggles verbatim).
