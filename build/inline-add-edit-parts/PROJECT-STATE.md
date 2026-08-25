# PROJECT-STATE — Inline Add and Edit Parts on Work Order Lines

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## Identity
- **TestRail parent folder (group):** group_id **6597**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6597 (recorded 2026-08-25)
- **Epic:** SV-9315 · **PO / Owner:** Sasha Grosman
- **Spec:** Confluence **782761986**, live **v13** (as of 2026-08-25)
- **Design:** Claude "Add Part" artifact `561657da` (appearance reference; static export held)
- **Tech plan:** `intake-2026-08-25/sources/tech-plan-2026-08-18.md` (behind PRD v13; informs only, Rule 30)
- **QA env:** none yet → **Rule 85 SOURCE-VERIFIED ONLY**
- **Case source:** `cases/` · internal ID prefix **IAEP** (`IAEP-<AREA>-NN`)

## Scope (from spec v13)
- **6 stories** (SV-9316–SV-9321), **107 rule IDs**. Single surface: Work Order → Lines → Parts,
  forking by Work Order View Mode (Tech View / Full View).

## Status — 2026-08-25 (authoring pass complete)
- **FULL SUITE AUTHORED: 96 cases** across 6 areas.
- **Coverage: 107/107 rule IDs, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **RUA:** 96/96 KEEP (2 WEAK-KEEP tied to open PO questions), 0 CUT, 0 NONSENSE.
- **Rule-85:** every case "Not available on Build to test Yet - Last checked 8/25/2026".
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank). Import ready for the QA lead.
- **Open PO questions (Sasha Grosman):** PO-IAEP-1 (S3-E1 scope: PRD keeps it, tech plan D3 defers it) ·
  PO-IAEP-2 ("Imported" status guard: PRD hides Add Part/Edit, tech plan plans no such check).
- **Deliverables:** requirements.md (v13) · coverage-matrix.md · intake-2026-08-25/{INTAKE, SOURCE-CURRENCY,
  SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} · cases/ ·
  testrail-id-map.csv · testrail-import/Inline-Add-and-Edit-Parts_testrail-import.{csv,xlsx} ·
  questions-2026-08-25/.
- **Reconciliation:** authored 96 = import 96 = id-map 96; set-equal both ways.

## How to resume
1. On go-ahead from Sasha's answers: fold PO-IAEP-1/2 outcomes into IAEP-TEDIT-12 and IAEP-BTN-06/07.
2. When a QA build exists: run skill 03/11 build verification; re-stamp AUTOMATION markers.

## TestRail run (2026-08-25)
- **Full-suite run R418** — all 96 cases — https://shopview.testrail.io/index.php?/runs/view/418. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).
