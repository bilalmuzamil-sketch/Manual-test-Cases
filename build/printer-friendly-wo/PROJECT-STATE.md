# PROJECT-STATE — Printer Friendly Work Orders

**Canonical cold-resume doc.** Status derived live (Rule 92 / skill 15 §7).

## Identity
- **TestRail parent folder (group):** group_id **6617**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6617 (recorded 2026-08-25)
- **Epic:** SV-9383 · **PO / Owner:** **TBD** (must be confirmed — PO-PFWO-1)
- **Spec:** Confluence **519176194**, live **v8** (as of 2026-08-25)
- **Design:** none (TBD on every story) · **Tech plan:** none
- **QA env:** none → **Rule 85 SOURCE-VERIFIED ONLY**
- **Case source:** `cases/` · internal ID prefix **PFWO** (`PFWO-<AREA>-NN`)

## Scope (from spec v8)
- **6 stories** (SV-9384–SV-9389), **45 rule IDs**. Trigger: WO detail → More → Print Work Order;
  output: browser print view. Pricing never shown.

## Status — 2026-08-25 (authoring pass complete)
- **FULL SUITE AUTHORED: 44 cases** across 6 areas.
- **Coverage: 45/45 rule IDs, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **RUA:** 44/44 KEEP, 0 CUT, 0 NONSENSE.
- **Rule-85:** every case "Not available on Build to test Yet - Last checked 8/25/2026".
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank).
- **Open PO questions:** PO-PFWO-1 (confirm the Owner/PO — spec says TBD) · PO-PFWO-2 (no design
  exists; confirm PRD text is the appearance authority or a design will follow).
- **Deliverables:** requirements.md (v8) · coverage-matrix.md · intake-2026-08-25/{INTAKE,
  SOURCE-CURRENCY, SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} ·
  cases/ · testrail-id-map.csv · testrail-import/Printer-Friendly-Work-Orders_testrail-import.{csv,xlsx}
  · questions-2026-08-25/.
- **Reconciliation:** authored 44 = import 44 = id-map 44; set-equal both ways.
