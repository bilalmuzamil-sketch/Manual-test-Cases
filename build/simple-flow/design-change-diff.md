# Simple Flow — Design Change Diff (refreshed bundle vs prior designs)

> **New bundle:** `Simple_Flow_Design_1.zip` → `/tmp/simple-flow-design-2/`
> (unzipped 2026-07-08; ephemeral). **Baseline:** `build/simple-flow/design-notes.md`
> (catalog built from the ORIGINAL `Simple_Flow_Design.zip`; original unzip dir is
> gone, so this diff is against the recorded catalog, not a byte-level diff).
> Scope: **INGEST + DIFF + PROPOSE only** — no case/Excel/TestRail edits.

## Summary (counts)

- **Total files in bundle:** 132 (54 Inter font TTFs + `assets/symbol-primary.svg`
  = non-test design-system assets; 15 HTML mockups; 3 MD handoffs; 4 JSX; 2 CSS;
  ~52 PNG screenshots; 2 tooling metadata files).
- **By filename vs prior catalog:** **0 NEW** and **0 REMOVED** design docs
  (all 15 HTML + 3 MD + 4 JSX + 2 CSS are present, same names as `design-notes.md`).
- **NEW files:** **1** — `uploads/Screenshot 2026-07-08 at 16.57.07.png` (dated
  after the prior catalog's stated upload range end of 2026-07-06; upload count
  42 → 43). It captures the **Review "Mark work order reviewed" confirm dialog**.
- **CHANGED (content):** **None materially detectable.** The 3 MD handoffs are
  content-consistent with the recorded catalog (same 6-setting list + defaults,
  same WO-state table, same 9-row and 12-row case matrices, same element test IDs,
  same open-items lists). Key HTML surfaces (Workflow Settings v1/v2, Work Orders
  List, Receive Vendor Parts, PO List/Detail, Resolve Cores) render the same
  screens described in the catalog. All zip entries share one export timestamp
  (2026-07-08 14:59), so mtime cannot flag individual changes; pixel-level edits to
  HTML/PNG can't be ruled out but **no semantic/behavioral change was found.**
- **Cases materially impacted:** **0 require rewrite.** The bundle is effectively a
  **re-export/refresh of the same design set.** The one new screenshot *confirms*
  already-authored review sign-off behavior; it does not change any expected result.

**Bottom line:** This is a design **refresh**, not a design **change**. No UPDATE /
ADD / RETIRE actions are proposed. Two confirmations and zero conflicts are noted
below for the record.

## Delta table

| File / Screen | New or Changed | What changed | Affected cases | Proposed impact | Relation to open items |
|---|---|---|---|---|---|
| `uploads/Screenshot 2026-07-08 at 16.57.07.png` | **NEW** (only genuinely new artifact) | Adds a captured artboard "9 · Review — Confirm sign-off dialog (9/12)": the **Mark work order reviewed** modal with **VIN / Serial # (REQUIRED)** + **Review note (optional)** + Cancel / **Confirm Reviewed** (disabled until VIN). WO shows `Review` badge + amber "Ready for Review" banner. | SF-REV-06, SF-REV-09 (sign-off), SF-VAL-07 (VIN required at Mark Reviewed), SF-REV (dialog fields) | **NO-CHANGE** — visualizes behavior already documented in `WO Review Flow - Handoff.md` §7 + test IDs `input_review_vin` / `input_review_note` / `button_confirm_review`, already reflected in authored cases. | **Confirms** the optional review-note field EXISTS by design → directly bears on **VIU deviation #3** ("Mark-Reviewed dialog missing optional review note" on live sv7301). Design intends the note; live absence stays a **build gap/bug**, not a design change. **Confirms** VIN-required-at-review (spec update §10-#3). |
| `WO Review Flow - Handoff.md` | Unchanged | Same 6 driving settings, WO state/badge table, tech-story modal, completion wizard, review gate §7, 9-row case matrix, 5 test IDs, 5 open items. | SF-COMP-*, SF-REV-*, SF-TECH-*, SF-VAL-* | **NO-CHANGE** | Open items still stand (tech-story modal-vs-line S15-R2; Close-vs-Cancel confirm; Story-4 inline invoice not built; Require-review/VIN toggles not on settings page; Story-16 Ready-for-Review queue). None resolved by this bundle. |
| `Resolve Cores Flow - Handoff.md` | Unchanged | Same step order (Details→Pick→Resolve cores→Receive→Complete), gate logic, line-level OK/Not-OK reuse, 12-row `?screen=` matrix, 4 open items. | SF-CORE-*, SF-COMP (core steps), SF-INV-* | **NO-CHANGE** | Cores open items still open (real data-model wiring; special-order vendor-return reference; option copy; action-bar unresolved-core count). |
| `HANDOFF.md` (Workflow Settings) | Unchanged | Same 6 setting cards; same defaults (Auto-approve ON, Create-POs ON, Vendor-invoice **Optional** default, Tech/Mileage/Engine OFF, Auto-pick ON); still **omits** "Require review before completion". | SF-SET-* | **NO-CHANGE** | **Settings-default conflict (design-notes gap #3) NOT resolved** — design still defaults Auto-approve ON / vendor-invoice Optional vs spec's Auto-approve OFF / vendor-invoice REQUIRED. Spec update §10 confirms this conflict remains open. |
| `Workflow Settings.html` (v1) | Unchanged | 6 cards; Vendor Invoice Number Optional/Required radios; no Require-review toggle. | SF-SET-01/02/12 | **NO-CHANGE** | Reinforces `operatingMode`/operating-mode selector absence (spec update §10-#7). |
| `Workflow Settings v2.html` | Unchanged (as recorded "later iteration") | Fuller admin sidebar (DEV TOOLS / Feature Flags / Settings nav). Surfaces the Vendor-invoice **Required** state copy ("Advisors must enter vendor invoice number before completing WO"). Still no Require-review toggle. | SF-SET-01/06/11/12 | **NO-CHANGE** | v2 already cataloged. Shows the Required state exists in UI but does not settle the default (gap #3 open). |
| `Work Orders List.html` | Unchanged | "Waiting On Parts" column + "Create Work Order" button + Completed/By-Status/My-WO tabs. | SF-WOP-01/02/03, SF-UX-* | **NO-CHANGE** | Story 14 "Waiting on Parts" still NOT built on live (durable fact); design unchanged. |
| `Receive Vendor Parts - v2.html` | Unchanged | Bulk/Accept-Delivery receive screen (grouped by vendor, invoice #, qty/cost/sell, assign-vendor). | SF-BULK-*, SF-RCV-*, SF-VMIS-*, SF-VEND-* | **NO-CHANGE** | Spec title now "Bulk Receiving" (Stories 7/8/9) — design surface unchanged; Stories 7/8/9 still NOT built on live. |
| `Purchase Orders List.html` / `Purchase Order Details.html` | Unchanged | PO multi-select list + PO detail Receive / Vendor-Missing. | SF-POSEL-*, SF-VMIS-*, SF-RCV-* | **NO-CHANGE** | Story 7 PO multi-select still NOT built on live. |
| `Core Resolution.html`, `Resolve Cores to Invoice.html`, `Pick Parts Step.html`, `Pick Parts + Cores.html`, `Inventory & Cores - Overview.html`, `Simple Flow Design.html`, `WO Review Flow.html`, `WO Review Flow - Handoff.html` | Unchanged | Same screens as cataloged. | SF-CORE-*, SF-COMP-*, SF-QB-* | **NO-CHANGE** | — |
| JSX (`design-canvas`, `components`, `PODetails`, `po-data`) + CSS (`colors_and_type`, `po-details`) | Unchanged | Source powering the prototypes; design tokens. | — | **NO-CHANGE** | Not test-relevant. |
| Fonts (54 TTF) + `assets/symbol-primary.svg` + `.design-canvas.state.json` + `.thumbnail` | Unchanged | Design-system / tooling assets. | — | **NO-CHANGE** | Not test-relevant. |

## Confirmations / overrides / round-2 answers

- **Confirms (does not override):** Review confirm sign-off dialog = VIN required +
  optional note + disabled-until-VIN Confirm (new 07-08 screenshot). Aligns with
  authored SF-REV/SF-VAL cases and spec update §10-#3 (VIN at Mark Reviewed).
- **Does NOT resolve** the settings-default conflict (design-notes gap #3) — design
  still ships Auto-approve ON + vendor-invoice Optional-default and omits the
  Require-review toggle from the settings page. Remains open (matches spec update
  §10 "NOT contradicted by SV-8183").
- **No round-2 question answered** by the refreshed design (no new screens/behavior).

## Conflicts with VIU-verified behavior

- **None new.** The pre-existing VIU deviations stand and are *reinforced* (not
  contradicted) by this design: (1) live has no Create-POs toggle, (2) Save always
  enabled, (3) **Mark-Reviewed dialog missing the optional review note** — the
  07-08 screenshot confirms the design intends that note, so live absence is a
  build gap; (4) review→Complete jump. All remain live-vs-design gaps for VIU/dev
  follow-up, not design changes.
</content>
</invoke>
