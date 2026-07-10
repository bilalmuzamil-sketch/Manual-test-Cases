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

---

## PO ruling 2026-07-10 — reviewer ≠ completer DESCOPED from v1 (Milos)

> **Date:** 2026-07-10 · **Decided by:** Milos (PO), relayed by the QA lead.
> **Rule applied:** *last-update-wins* (this 2026-07-10 PO ruling is the most recent
> input and supersedes the SV-8183 "Decision 3 / NET-NEW must be built" acceptance
> criterion where they conflict).

**Ruling:** The **"reviewer ≠ completer" hard rule is NOT a v1 requirement.** A user
completing AND then reviewing / marking-reviewed their **own** work order is
**EXPECTED / acceptable behavior in v1** — it is **not** a defect.

**Background / origin (kept for history):** The strict same-user identity block came
only from **SV-8183** acceptance-criteria ("Decision 3 / NET-NEW must be built");
**Story 16 (SV-7870)** only ever required a different **ROLE** (already covered by the
Review Work Orders permission gate). Milos has now ruled the strict identity block out
of v1.

**Decision applied (LOCAL artifacts only — TestRail push held for QA-lead authorization):**

- **SF-PERM-04, SF-PERM-07, SF-REV-09** — reviewer ≠ completer assertion REMOVED from
  each expected; the Review Work Orders **permission-gating** half is retained. Re-adjudicated
  from existing VIU evidence to **VIU-Verified** (permission-gating live-verified via the
  SF-PERM-10 BATCH-5 11-role fe-permissions sweep; per Milos R2 Q5 UI gating is the v1 pass
  criterion, API gap tracked as TICKET 2 / BUG-6/7). `fresh_run: 2026-07-10` added.
- **SF-PERM-08** (the dedicated same-user case) — nothing meaningful remains once the
  identity rule is removed → marked **OBSOLETE / covered-by SF-PERM-04 + SF-PERM-07**;
  left in the file (not deleted) and flagged for the QA lead to retire in TestRail.
- **BUG-5 / TICKET 1** (reviewer can sign off own WO) — **DROPPED / closed-as-expected**;
  moved to the "Dropped — expected behavior per PO (Milos), 2026-07-10" section of
  `jira-bug-drafts.md` (record retained, not deleted). Removed from the Milos-confirm
  and bug-drafts deliverables.
- **requirements.md §9** — dated descope note appended (identity rule marked descoped;
  SV-8183 origin kept for history).

**Net effect:** These 4 cases leave the **BLOCKED — BUG/RULING** bucket (they no longer
wait on a BUG-5 ruling) and move to **READY** (VIU-Verified). Their TestRail push is
**PENDING QA-lead authorization** (the QA lead decides separately on TestRail; no
TestRail writes were made here).
