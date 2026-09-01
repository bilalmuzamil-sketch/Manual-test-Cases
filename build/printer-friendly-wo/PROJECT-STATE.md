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

## Status — 2026-08-31 (source currency check — NO verification needed)
- **Spec checked live: Confluence 519176194 is now v9** (was v8 at authoring 2026-08-25). The version integer bumped, so the source qualified for a check.
- **Diff v8→v9 = NON-SUBSTANTIVE.** Same **45 rule IDs** (S1–S6), rule texts materially identical, and the spec's own **Change Log has not moved since 2026-04-19** — no entry after our authoring. Only difference found: S3-R3 carries a trailing rationale sentence ("This printout is for mechanics doing the work, not for billing") that our requirements condensed; no behavioural change. **No case content update warranted** (same call as Invoice v38→v39).
- **No case writes made** — the 44 cases remain accurate against v9. Provenance left reading v8 because v8≡v9 in substance; not re-stamped via API to avoid disturbing the render container (see the Inline render-container lesson). The cases are currently plain-text (authored 2026-08-25), which renders readably as text; a rich `fr-view` reformat can be offered as a separate nicety if the QA lead wants it.
- Epic **SV-9383** owner still **TBD** (PO-PFWO-1 open).

## Status — 2026-08-31 (layman-UI provisional routes — skill 18)
- **STANDARD ENFORCED (QA lead, 2026-08-31, universal):** no case may ship with spec-level
  preconditions/steps; every case must be runnable from the UI by a manual QA (Victoria). Rule 85 (no
  QA build), so routes are **SPEC-derived and marked PROVISIONAL — to be confirmed on the build.** Only
  PRECONDITIONS/STEPS touched; Expected Results unchanged (Rule 57).
- **Routes added (from spec v9 + the sibling Invoice-UI NAVIGATION-MAP's confirmed top-nav):**
  detail-view route — *In the top menu click "Work Orders" → open a work order → its detail view* — and
  the trigger route — *→ click "More" (the overflow/actions menu on the toolbar) → "Print Work Order" →
  the browser print view/dialog opens.* Line-state and dark-mode preconditions reframed to the open work
  order; the negative permission case (PFWO-MENU-07) states the blocked-attempt route without inventing
  access controls. No admin/menu path invented. Wording matches suite convention (UI labels in smart
  double quotes; no markdown).
- **Applied through the UI editor (Playwright → Froala `html.set` → Save, deadlock-retry ×15) so each
  field is written AND flipped to `fr-view` in one save** (the cases were previously plain text in the
  escaping `markdown` container). Recipe `render-repair-2026-08-31/layman_fix.mjs`; intended content by
  `gen_intended.py`; checkpoints in `REPAIRED-layman.jsonl`.
- **RESULT: 43 of 44 verified on the served page — `markdown fr-view`, 0 literal tags, route present,
  AUTOMATION marker still last, atmstatus & title unchanged. 0 failures.**
- **🛑 Rule 71 — 1 Automated case (atm=3) SKIPPED: C45123 (PFWO-AUDIT-01, S6-R1).** Still spec-level
  wording; ready-to-apply text in `intended-blocks.json`; ask/enrich per
  `render-repair-2026-08-31/FOR-VLAD-layman-routes-automated-2026-08-31.md`.
- **Local JSONs (`cases/`) updated to match TestRail.** No Jira / no run changes. Still Rule 85
  SOURCE-VERIFIED ONLY; routes PROVISIONAL until a build confirms exact toolbar/More-menu labels. PO/PO
  Owner still TBD (PO-PFWO-1).

## TestRail run (2026-08-25)
- **Full-suite run R419** — all 44 cases — https://shopview.testrail.io/index.php?/runs/view/419. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).
