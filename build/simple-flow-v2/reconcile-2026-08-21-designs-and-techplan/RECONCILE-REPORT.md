# Simple Flow V2 — Reconciliation Report (2026-08-21)

Ran the queued reconciliation after the QA lead formally assigned Simple Flow V2 with the tech plan +
designs. Method: diff every new input against what the 61-case suite was authored from.

## Inputs vs authoring baseline
- **Designs (Purchase Orders Page, Work orders + settings):** every text source (Work Order PRD, the four
  matrices/specs, the design brief, bulk-bar priority) is **byte-identical** to the bundle used at authoring.
  No design-driven case change.
- **Technical Implementation Plan (new — was MISSING at authoring, Rule 30):** read §1 Clarifications, §5 API
  changes, §10 traceability, §12 open questions. It **confirms** the spec-sourced cases (Requested counted /
  no row button, See Financial Data governs money, bulk delete out of scope, reviewer≠completer does NOT
  exist, Story 20 stays, Require approval in scope). Its new/modified **API endpoints** (bulk-status per-line
  judgement, receive-modal prefill, received-later creates no bill/stock/accounting, preview-change counts
  only, create honours Require-approval) **corroborate** existing cases — no new cases (our cases are
  UI-behaviour; Rule 4 API-section not triggered; API-level cases would need a Rule-51 go-ahead).
- **Spec currency:** moved **v21 → v23**. Full body diff: the **only** substantive change is **Story 7**
  (SV-9253, the bulk action bar) — v23 removed "Create invoice" from the "More contains, in order" list.

## Changes applied
- **SFV2-BULK-02** — updated to the v23 wording ("More contains, in order: Authorization required, Split to
  new work order, Decline"; Create invoice described separately). Whole-case re-verified (Rule 41).
- **All 61 cases** — spec version pin re-stamped **v21 → v23** (suite re-verified against v23; only Story 7
  content changed). Read-date 21 August 2026. Markers unchanged (metadata re-pin, Rule 69/G13).
- **SFV2-MENU-01** — added a disclosed divergence note (Rule 56): the tech plan (§12 Assumption 6) says the
  Uncomplete guard turns off one status earlier (`complete`) for SERVICE work orders; the spec says
  invoiced/paid. Kept the SPEC expectation (Rule 57); raised as **PO-SF-3**, not silently changed.
- Import regenerated (61 rows); coverage 21/21 unchanged; RUA unaffected (no new contradictions).

## Still open (unchanged by this reconciliation)
PO-SF-1 (SV-8726 PO rename scope), PO-SF-2 (SV-8183 permission map Blocked), **PO-SF-3 (new — Story 19
Uncomplete block: service WOs at `complete` vs spec's invoiced/paid)**, plus TestRail creds + target.
