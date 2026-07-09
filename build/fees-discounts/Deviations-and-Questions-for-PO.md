# Fees & Discounts V1 — Deviations & Open Questions for PO / Dev

**Feature:** Fees & Discounts V1 (ShopView) — whole-WO / labor-line / part-line
adjustments, templates, customer defaults, Processing Fee, calculation contract
(§5), customer documents, history log, permissions (Story 13).
**Raised by:** ShopView QA
**For:** the F&D Product Owner / dev team.
**Env this was observed on:** app `https://qb.qa.shopview.com` · API
`https://sv7387api.qa.shopview.com` (SV-7387) · `FeesAndDiscounts` flag ON.
**Spec:** `build/fees-discounts/requirements.md`. **Evidence:** `viu-qb-findings.md`,
`viu-findings.md`, `bugs-log.md`, screenshots under `viu-evidence/` + `screenshots/viu-qb/`.

> This file collects every F&D deviation that needs a **human decision** — a
> product ruling (PO), or a dev confirmation. It is split into three parts:
> **(1) PO questions** (behaviour differs from spec — need a product ruling),
> **(2) Case-update deviations** (the app behaves acceptably but our test case's
> *expected wording* is stale spec text — we propose new expected wording for you
> to approve), and **(3) the FDBUG-1 inconsistency** (a money bug that reproduced
> in one batch but not another — needs a controlled re-check).
> Confirmed **code bugs** are written up separately as ready-to-file tickets in
> `build/fees-discounts/jira-bug-drafts.md`.
> Nothing here has been filed or written to TestRail. Case JSONs are **unchanged** —
> the case-update proposals stay proposals until you approve them.
> The machine-readable table (all rows, with a blank **Answer** column) is
> `Deviations-and-Questions-for-PO.xlsx`.

---

## Part 1 — PO questions (behaviour differs from spec; need a product ruling)

| # | Case / Bug ref | What we see (live build) | Spec / expected | Question for PO / dev |
|---|---|---|---|---|
| 1 | **FD-STATS-001** (BUG-FD-2 / FDBUG-6); dependents FD-STATS-002, FD-STATS-004 | The Statistics tab F&D area is an **aggregate**: "Fees (3) $227.90 / Discounts (0) $0.00 / Net $227.90". No per-adjustment rows. | S4-R2/R3: a "Fees & Discounts (N)" section listing **each adjustment** with a **"%"/Value column and an Amount column**, signed. | Is the aggregate layout the intended V1, or is the per-adjustment table still to be built? (Ruling here also settles FD-STATS-002 and FD-STATS-004.) |
| 2 | **FD-PERM-002** (BUG-FD-3) | Technician **without** `workOrdersCreateAndEdit` can add a whole-WO adjustment: `POST /api/work-orders/adjustments/add` scope=`whole_wo` → **201** (reconfirmed batch 2). The permission is a **front-end display gate only**; the backend does not enforce it. (Contrast: templates admin and customer-defaults **are** BE-enforced → 403.) | S13-R3: whole-WO adjustment add/edit/remove **requires Work Orders: Create and Edit**. | Should whole-WO adjustment writes be **backend-enforced** for V1, or is FE-only gating acceptable (matching the project's documented enforcement model)? |
| 3 | **FD-WO-013** (BUG-FD-3) | Same root cause as #2 — the whole-WO "Add … Fee / Discount" starting places are hidden in the FE only; the backend does not enforce the gate. Per-role UI hiding could not be exercised on qb (only admin/tech logins available). | S1-N2 / S13-N2: starting places hidden without Work Orders: Create & Edit. | Same ruling as #2 (enforce server-side vs FE-only). Also: confirm whether the split whole-WO-vs-line permission model (S13-R3/R4) applies, or the build's single WO-edit check is intended (requirements §10.4). |
| 4 | **FD-CUST-016 / FD-VAL-007** (BUG-FD-1 double-add) | The old "double-add" defect (a template that is BOTH location auto-apply AND a customer default gets added twice to a new WO) **did NOT reproduce** on the current build. Controlled repro via a fresh WO create → **exactly ONE** adjustment per template (backend dedupes). | §14 item 4 / S9 known gap: intended result is exactly ONE adjustment. | Can you confirm the S9 **dedupe fix has shipped**, so we treat the double-add as fixed and keep these cases as "single adjustment"? (An earlier recon saw ×2; we could not reproduce it since.) |
| 5 | **NOTE-FD-4** (Story 8) | The template-builder Type dropdown offers only **Fee / Discount** (no Processing Fee) — but the **backend accepts** `POST /api/adjustment-templates {kind:"processing_fee", calculationType:"pct_grand_total"}` → **201**, and a pfee auto-applies/resolves correctly. So the data model + resolve path exist; only the builder UI is missing. | Story 8: a Processing Fee is a first-class template type with its own builder UI. | Is Story 8 **partially built on purpose** (BE ready, UI pending), and should the BE keep accepting `kind:processing_fee` before the builder ships? Or should the endpoint reject it until the UI lands? |
| 6 | **FD-WO-005 / FD-VAL-001** (BUG-FD-4) | The Add Fee/Discount dialog's confirm button is **enabled** even when Name and Amount are empty; required-field validation fires **on submit** (inline "Amount must be greater than 0") rather than by disabling the button. | Design §6 `validateForm()` / S2-N1/N2: confirm button disabled until the form is valid. | Is inline-error-on-submit acceptable for V1, or should the button be disabled-until-valid as designed? (The no-empty-save rule itself is honoured.) |
| 7 | **FD-INLINE-003** (BUG-FD-5) | With two line-level adjustments on one line, **both** inline rows render; **no "Show N more" / "Show less"** collapse toggle was seen. | S3-R15/R16 / S12-R6: show the first row + a "Show N more" toggle when ≥2. | Is the collapse toggle planned for V1, or is always-expanded acceptable? |
| 8 | **FD-CUST-005** (NOTE-FD-5 / FDBUG-7); ties to FD-CUST-003/004/006 | The customer-default "Add Fee/Discount" control is a **single-select dropdown + Save** (no caption; generic "No results" empty state; direct trash-icon remove). The backend **does** accept a `templateIds` **array**, so multi-add works under the hood — only the UI multi-select is missing. | S9-R18..R24: a caption + **checkbox multi-select** list with an "Add" button; empty state "No templates available to add."; 3-dot "Remove"; removal toast. | Is the single-select dropdown the intended V1 picker, or should the checkbox multi-select + exact copy be built? (This ruling also settles the case-update rows FD-CUST-003/004/006/007.) |

**Summary of Part 1:** 8 PO-question threads (10 cases). Items 2 & 3 share one ruling
(BUG-FD-3 enforcement); item 8 governs several FD-CUST case-updates.

---

## Part 2 — Case-update deviations (app is acceptable; our expected wording is stale)

These are label / copy / UX-mechanism drifts where the **build behaves acceptably**
but the test case's *expected* still quotes the original spec text. For each we
propose new expected wording **for you to approve**; nothing is rewritten yet. Where
a row overlaps a tracked FDBUG (a real code bug), it is flagged — for those, keep the
spec expected until the bug is fixed OR descope it here.

| # | Case | What the case expects (spec) | What the app actually does | Proposed new expected (approve?) |
|---|---|---|---|---|
| 1 | **FD-WO-001** | Dialog title "New Fee / Discount"; WO-toolbar label "Add Work Order Fee / Discount". | Dialog opens at whole-WO scope (correct, no "Applying to" subtitle) but title reads **"Add new fee/discount"** with the WO number as subtitle; menu item reads **"Add Fee/Discount"**. | Title "Add new fee/discount" (WO number as subtitle); menu/toolbar label "Add Fee/Discount". |
| 2 | **FD-LABOR-001** | Subtitle "Applying to: Line {N} Labor — {name}". | Dialog is scope-locked to the labor line (correct) but subtitle reads **"Applying to: {line name}"** — omits the "Line {N} Labor —" prefix. | Subtitle "Applying to: {line name}" (no "Line N Labor —" prefix). *[Same prefix-omission class as the part-line FDBUG-14 — if the prefix is still wanted, this stays a build gap.]* |
| 3 | **FD-FIN-004** | Sidebar card title "Work Order Fee / Discount"; hover menu "Edit / Delete". | Card lists whole-WO adjustments correctly, but title is **"WO Fees & Discounts"** and the hover menu reads **"Edit \| Remove"**. | Card title "WO Fees & Discounts"; hover menu "Edit \| Remove". |
| 4 | **FD-REMOVE-001** | Confirm message 'Remove "{name}" from this work order?'; toast "Discount removed". | Confirm title "Remove Fee / Discount" (correct); message reads **"Are you sure you want to remove this fee?"**; toast **"Fee removed"**; remove → 204. | Message "Are you sure you want to remove this fee?"; toast "Fee removed" / "Discount removed" (confirm whether it varies by kind). |
| 5 | **FD-CUST-003** | Picker = checkbox list of rows (Name/Type/Calc/Amount); toast "Fee / discount added." | Add works end-to-end; toast "Fee / discount added." (correct). Picker is a single **dropdown + Cancel/Save**, no caption. | Picker is a single-select dropdown + Save; toast "Fee / discount added." *[Contingent on Part-1 #8 picker ruling.]* |
| 6 | **FD-CUST-004** | Multi-select 3 templates in one action; toast "3 fees / discounts added." | UI cannot multi-select (single dropdown); the **backend accepts a `templateIds` array** (multi-link 201) — only the UI + plural toast are missing. | Either keep as a build gap (if multi-select is wanted) OR rewrite to single-add. *[Blocked on Part-1 #8.]* |
| 7 | **FD-CUST-006** | Empty picker message "No templates available to add." | With every template linked, the dropdown shows the generic **"No results"**. | Empty state "No results" *(or dev fix the copy — contingent on Part-1 #8)*. |
| 8 | **FD-CUST-007** | Row 3-dot menu "Remove"; no confirm; toast "Fee / discount removed." | Remove is a **direct trash icon** per row; no confirm (correct, S9-R24); **no removal toast** observed; row/count update. | Remove via direct trash icon, no confirm, row + count update; confirm whether a "Fee / discount removed" toast is expected. |
| 9 | **FD-TMPL-001** | Page at Administration → Service → Fees & Discounts, below Canned Lines. | Page lives at **Administration → Finance → "Fees & Discounts"** (below Payment Methods), route `/administration/adjustment-templates`. Matches the S13-R8 target location. | Page at Administration → Finance → "Fees & Discounts". |
| 10 | **FD-TMPL-003** | Confirm button "Add Fee / Discount"; toast "Fee added"; amount label "Amount"; Taxable/auto-apply Yes/No dropdown + checkbox; no Description field; auto-apply label "…at this location". | Create works. Deviations: button **"Create"**; toast **"Template created"**; amount label **"$ Default Amount"**; Taxable & auto-apply are **toggles**; an extra **"Description (Optional)"** (255-char) field exists; auto-apply label **"Auto-apply to new work orders"**. Title "New Fee / Discount" correct. | Reflect all actual labels/controls (button "Create", toast "Template created", "$ Default Amount", toggles, Description field, "Auto-apply to new work orders"). |
| 11 | **FD-TMPL-004** | Toast "Discount added". | Discount template created fine; toast is the generic **"Template created"**. | Toast "Template created" (generic, not per-type). |
| 12 | **FD-TMPL-006** | Toast "Fee updated"; Type/Calc editable in template edit. | Row-click opens "Edit Fee / Discount" with a "Save" button (correct); toast **"Template updated"**; Type + Calc are **locked** in template edit. | Toast "Template updated"; Type/Calc locked in edit. |
| 13 | **FD-TMPL-008** | Delete warning "…set as a default for [N] customer(s). Their defaults will be removed too." | Warning present + backed by the `delete-precondition` API, but reads **"This template is set as a default for 1 customer. Deleting it will remove it from them."** | Warning "This template is set as a default for {N} customer(s). Deleting it will remove it from them." |
| 14 | **FD-TMPL-010** | Line-scope picker filters by method + hint "Showing templates compatible with this line."; excludes Processing Fee. | The **line-scope Add dialog has NO template picker at all** (control absent); the whole-WO dialog's picker lists every template. | Line-scope Add dialog has no template picker (templates applied via the whole-WO dialog). *[Overlaps FDBUG-13 — if the filtered line-scope picker is still planned, this stays a build gap, not a case-update.]* |
| 15 | **FD-TMPL-011** | Max Amount shown for % methods only (verified ✓) **and** Max Amount 0 treated as empty (no cap → $0.00). | Max Amount shows for % only (correct). But `maxCap:0` is **stored and resolves with NO cap** (10% of $324.60 → $32.46 despite maxCap 0). | Keep expected #1/#2 (verified). **Do NOT rewrite the 0-handling** — it is a real code bug tracked as **FDBUG-9** (see bug drafts); fix in build. |
| 16 | **FD-PROC-008** | A Processing Fee on a WO offers "Delete" only (no Edit). | Removal works and the BE correctly **409s** an edit ("A processing fee cannot be edited through this endpoint."), but the WO card menu still shows **"Edit \| Remove"**. Matches the §14 documented current-build gap. | Menu shows "Edit \| Remove" but Edit fails with 409; removal works — pending the S8-R17 cleanup (remove the dead Edit control). |
| 17 | **FD-HIST-002** | History detail shows Name, **Type**, Amount (set rate), Applied-to. | Detail shows Name, Amount (set rate), Applied-to "Full invoice" (all correct) — but there is **no "Type:" line**. | Keep Name/Amount/Applied-to. The missing "Type:" line is a real code bug tracked as **FDBUG-11** (dev fix); do not drop it from expected unless PO descopes S10-R6b. |

**Summary of Part 2:** 17 case-update proposals. 13 are pure label/copy/placement
drift (safe to update once confirmed). **4 overlap tracked FDBUG code bugs** and
should NOT simply be rewritten: FD-TMPL-011 (→ FDBUG-9), FD-HIST-002 (→ FDBUG-11),
FD-TMPL-010 (→ FDBUG-13), and FD-CUST-003/004/006 (blocked on the Part-1 #8 picker
ruling).

---

## Part 3 — FDBUG-1 inconsistency (money bug — needs a controlled re-check)

**Case:** FD-DOC-011. **Type:** bug-confirm (needs re-check + a known/partial-fix answer).

- **Batch 1/2 (2026-07-08):** FDBUG-1 **reproduced** — WO `total_cost`, the Financial
  Info Total/Balance, **and** the customer estimate's Subtotal/Total all **excluded**
  the net adjustment amount, while **GST included** the adjustments' tax effect. A
  fees-only WO showed Total $10.93 = tax alone (fees $218.68 ignored); an estimate
  showed Subtotal $292.83 / GST $17.75 / Total $310.58 with **+$62.25 net adjustments
  missing**. Customer-facing money was wrong (§5-R5 places the Adjustments block
  *before* Subtotal, i.e. included).
- **Batch 4 (2026-07-09):** FDBUG-1 **did NOT reproduce** on estimate documents.
  Across **three** WOs the estimate totals reconciled correctly (Subtotal = base + net
  adjustments; GST = 5% of the adjustment-inclusive Subtotal; Total = Subtotal + GST;
  `total_cost` matched — e.g. WO_A 1,214.81 + 82.71 → GST 64.89 → Total 1,362.41).
- **What we need:**
  1. **Dev:** Was a fix shipped for the totals/tax reconciliation between 2026-07-08
     and 2026-07-09 (known fix / partial fix)? If so, which surfaces/scenarios does it
     cover?
  2. **QA (follow-up):** A **controlled re-check** is required to pin the trigger — the
     batch-1 failure was seen on a fees-only WO / Financial Info surface and on a
     discount-heavy estimate; batch-4 passes were "normal" estimates. Suspected
     scenario-dependence (discount-heavy / excess-credit / a specific surface).
  3. FD-DOC-011's expected has been **left unchanged** pending this answer.
- FDBUG-1 is still written up as a **High** bug draft (see `jira-bug-drafts.md`) with
  the inconsistency + repro config noted, so it can be filed and dev can confirm.

---

## What happens next

- **PO:** answer Part 1 (8 threads). Item 8's picker ruling also unblocks the FD-CUST
  case-updates in Part 2.
- **PO:** approve/adjust the Part 2 case-update wordings (13 safe; 4 bug-overlap rows
  need a keep-vs-descope call).
- **Dev:** answer the FDBUG-1 known/partial-fix question (Part 3) and take the confirmed
  code bugs from `jira-bug-drafts.md`.
- Once answered, QA finalizes the case JSONs + the TestRail import (currently INTERIM)
  per `RESUME-STRATEGY.md`. **No TestRail writes without explicit user permission.**
