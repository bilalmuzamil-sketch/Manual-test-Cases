# PROJECT-STATE — Invoice UI Refresh

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## Identity
- **Epic:** SV-8218 (owner/assignee Chris Ward) · **PO:** Chris Ward
- **Spec:** Confluence **755990532**, live **v39** (as of 2026-08-25; authored at v38, re-verified at v39 — delta non-substantive); tech plan built against **v36**
- **Design:** Claude artifact `c88ee207-3197-4f54-8cb9-bac3deb84354` (binding visual reference; static export held)
- **Tech plan:** `intake-2026-08-21/sources/tech-plan-2026-08-12.md` (Symfony/Twig→WeasyPrint + Vue/Quasar)
- **Git dev branch (theirs):** `project/invoice-ui-refresh` · **QA env:** none yet (feature Not started)
- **Case source:** `build/invoice-ui-refresh/cases/` · internal ID prefix **INV** (`INV-<AREA>-NN`)
- **TestRail parent folder (group):** group_id **6559**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6559 (recorded 2026-08-25)

## Scope (from spec v39; unchanged from v38)
- **13 stories**, **109 rule IDs** (S1–S13 + G-R1). Documents: Estimate · Invoice (paid = receipt) ·
  Credit Invoice · Parts Sale Estimate · Parts Sale Invoice.
- Epic children: 12 named (SV-9140–9151) + SV-9195 (Story 13) + SV-9193 (batch/imported, **deferred**) +
  5 "Verify:" plan Tasks (SV-9207–9211, not test requirements).

## Status — 2026-08-21 (authoring pass complete)
- **INTAKE COMPLETE + FULL SUITE AUTHORED: 87 cases** across 14 areas (13 spec stories + Authorizer WO-UI).
- **Coverage: 110 of 110 spec rule IDs covered, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **Deliverables:** requirements.md (v38) · coverage-matrix.md · intake-2026-08-21/{INTAKE, SOURCE-CURRENCY, SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} · cases/ · testrail-id-map.csv · testrail-import/Invoice-UI-Refresh_testrail-import.{csv,xlsx}.
- **Ruthless Usefulness Audit:** 87/87 KEEP (2 WEAK-KEEP), 0 CUT, 0 NONSENSE, 0 unresolved contradictions.
- **Rule-85 project:** every case SOURCE-VERIFIED ONLY - NO BUILD EXISTS YET (deferred automation marker).
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank). Import file ready for the QA lead.
- **Open PO questions:** PO-1 (Credit Balance S11-R6a vs stale Terminology §6) · PO-2 (un-logged spec edits 2026-08-13 [v38] and ~2026-08-25 [v39]; the v39 one verified cosmetic). Refreshed sheet: questions-2026-08-25/.
- **Reconciliation:** local active 87 = id-map 87 = import 87; id-map refs 87/87; set-equal both ways.

## Status — 2026-08-25 (reconciliation pass)
- Re-supplied design + tech plan are IDENTICAL to authoring inputs (design content byte-identical; tech plan md5-identical). PRD moved **v38→v39**, delta non-substantive (Slack-link row only). **No case content changed**; provenance re-stamped v38→v39 on all 87; import regenerated (0 shredded, 87/87). Detail: reconcile-2026-08-25/RECONCILIATION-2026-08-25.md.


## How to resume (ordered)
1. `git fetch` + `merge --ff-only` on `claude/slack-session-0sxnd9`; claim the lock.
2. Read `intake-2026-08-21/INTAKE-2026-08-21.md` + `SOURCE-CURRENCY.md`.
3. On go-ahead: run the **v36→v38 + log-vs-body diff** first (Rule 59), then author per skill 01.

## TestRail run (2026-08-25)
- **Full-suite run R417** — all 87 cases — https://shopview.testrail.io/index.php?/runs/view/417. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).
