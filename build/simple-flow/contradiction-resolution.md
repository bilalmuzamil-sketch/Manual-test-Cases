# Simple Flow — Contradiction Resolution Log (Reconciled V2.4 Batch)

> **Date:** 2026-07-08 · **Scope:** Simple Flow (Simple Mode) ONLY.
> **Rule applied:** *last-update-wins* — when two inputs conflict (spec doc vs
> round-1 answer sheet vs design), the **MOST RECENT** update is authoritative. The
> **V2.4 spec doc** (`spec-current-source.md` / `spec-change-diff.md`) and the
> **2026-07-08 design bundle** (`design-change-diff.md`) are the latest inputs, so
> they **override** the earlier round-1 Google-sheet answers
> (`milos-answers-mapping.md`) wherever they disagree.
> Recorded as a durable rule in `CLAUDE.md` (Simple Flow entry) and applied here.

## Conflicts resolved

| # | Topic | Conflicting inputs | Winner (latest) | Decision applied |
|---|---|---|---|---|
| C1 | **Require Review default** | Round-1 answer sheet (Milos Q1): "They should all have ON the review option" (= default **ON for all orgs**). **V2.4 S1-R4** (latest): "Default **per cohort** (see §8)"; §8 still lists the cohort question as UNRESOLVED. | **V2.4 (per-cohort)** | The queued "**default ON for all**" rewrite is **NOT applied**. **SF-REV-15** keeps the **per-cohort** expected (which cohorts default ON stays a §8 open question). **SF-SET-14** does **NOT** get the "toggle defaults ON for the org" line; its toggle-present + routes-to-review expectations stand. Both note the reversal. |
| C2 | **No-PO path / Create-POs-OFF setting** | Round-1 answer sheet (Milos Q5): "We removed the PO OFF … we will Always have a PO" (= descope No-PO; **POs always on**; retire SF-COMP-06 / SF-QB-02; rewrite SF-SET-03). **V2.4** (latest): Story 2 "No-PO (Skip) Flow", **S1-R2** "Off → no POs (default On)", **§4** "Create POs OFF ⇒ no PO at all" — all still fully documented. | **V2.4 (No-PO RETAINED)** | The **retire** of SF-COMP-06 / SF-QB-02 is **CANCELLED** (both kept as V2.4 documentation). SF-SET-03 is **NOT** rewritten to "POs always on" — it keeps documenting the Create-POs toggle (default On) + the hidden Vendor-Invoice sub-setting when OFF. **BUG-1** (no Create-POs toggle live; POs always-on) is reclassified as a **spec-vs-build gap** (build lags V2.4), **not** an intended descope. |
| C3 | **No-PO completion lifecycle (SF-COMP-07 / SF-QB-01)** | These were **on HOLD** pending the No-PO ruling. Round-1 premise "skip path bypasses inventory" became moot under Q5's descope. | **V2.4 (No-PO retained)** | **Un-held.** Because the No-PO path stays (V2.4), the completion expectations stand. The **inventory-decrement + Part-History invariant** (do in-stock parts decrement + write Part History on completion) is **not yet confirmed** → kept as **VIU-pending / round-2 Q3** (viu_status moved Open-Question → VIU-Pending; expected unchanged). |

## Reversals recorded (from this reconciliation)

- **BUG-3 (missing optional review note):** the 2026-07-08 design bundle shows the
  Mark-Reviewed dialog carries **VIN (required) + an optional Review note** *by
  design*. Under last-update-wins the design is the latest input → the note is
  **intended**, so BUG-3 is **REVERSED** from "EXPECTED (simplification)" back to a
  **REAL DEFECT / build-gap**. **SF-REV-10** EXPECTED restored to VIN-required +
  optional-note. (See `finding-reclassification.md`, `bugs-log.md`.)
- **BUG-1 (no Create-POs toggle):** reclassified from "intended descope" to a
  **build-lag / spec-vs-build gap** (V2.4 retains the setting). Cases NOT retired.

## Confirmed inputs that did NOT conflict (still applied)

These round-1 answers / reclassifications do **not** conflict with V2.4 or the 07-08
design, so they were applied as-is (see `milos-answers-mapping.md` /
`finding-reclassification.md`):

- SF-SET-08 — spec first-use defaults authoritative (Auto-approve OFF / Create POs
  ON / Vendor Invoice REQUIRED); live defaults are a build gap (GAP-B).
- SF-RCV-05 — vendor-missing group LEADS (top), not bottom.
- SF-UX-04 — Close/Cancel behavior defined; un-blocked.
- SF-SET-13 — Save dirty-state gating not required in v1 (soften).
- SF-CORE-01/02/10 — cores are line-level; no wizard Resolve-Cores step
  (BUG-10 EXPECTED — unaffected by V2.4/design).
- SF-REV-08/11 — sign-off completes directly Review → Complete
  (BUG-4 EXPECTED — unaffected by V2.4/design).

## Net effect

- Review default = **per-cohort** (NOT ON-for-all).
- No-PO path + Create-POs-OFF = **RETAINED**; SF-COMP-06 / SF-QB-02 **NOT retired**;
  SF-SET-03 **NOT** rewritten to "POs always on".
- BUG-1 and the vendorless-form + first-use-defaults deviations recorded as
  **spec-vs-build gaps** (build lags the latest spec/design).
