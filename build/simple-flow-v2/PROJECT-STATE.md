# PROJECT-STATE — Simple Flow V2

**Canonical cold-resume doc.** Status derived live (Rule 92 / skill 15 §7).

## Identity
- **Epic:** SV-8683 (assignee/PM Milos Vasic) · **PO:** Milos Vasic
- **Spec:** Confluence **771391574**, live **v21** (2026-08-21)
- **Permission map:** SV-8183 (existing Custom Roles atoms; one new "Received later")
- **Designs:** Claude "Shopview App" 0c2ed95b + "Purchase Order Details" d2b4d45e (+ Work Order PRD, matrices) — static exports in intake-2026-08-21/sources/
- **Tech plan:** none standalone (folded into spec 2026-08-20) — reminded
- **QA env:** none ("Not yet available") — Rule-85 source-verified-only
- **Case source:** `build/simple-flow-v2/cases/` · internal ID prefix **SFV2** (`SFV2-<AREA>-NN`)
- **TestRail target:** UNCONFIRMED — proposed new "Simple Flow V2" section, suite 1
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
