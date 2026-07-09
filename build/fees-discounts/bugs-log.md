# Fees & Discounts V1 — Bugs & Deviations Log

**Env:** app `https://qb.qa.shopview.com` / API `https://sv7387api.qa.shopview.com`
(SV-7387). Verified as Admin (quick-login) + Technician (quick-login).
**Date:** 2026-07-08. Evidence in `viu-evidence/*.png`, calc data in
`/tmp/fdcln/calc-results.json` (ephemeral). Spec = `requirements.md`.

Severity legend: **Deviation** = build differs from spec; **Bug** = incorrect/
broken behavior; **Note** = build fact worth tracking.

---

## BUG-FD-1 — Customer-default + location auto-apply double-add — NOT REPRODUCED on current build (batch 2)
- **Type:** Bug (known S9 gap, requirements §14 item 4).
- **Cases:** FD-CUST-016, FD-VAL-007.
- **Status (batch 2, 2026-07-08):** **Re-driven cleanly with a fresh WO create —
  did NOT reproduce. The backend DEDUPES.** The double-add could not be produced
  through the WO-create path.
- **What was tested (two independent clean setups, both via `POST
  /api/work-orders/create`, the same endpoint the UI "New Work Order" button
  calls):**
  1. **Manual-default setup:** template "Customer fee" (`43e94ed0…`,
     `autoApply:true`) was ALSO set as a customer default on company Aosquare
     Forestry (`1f17bcab…`). New WO created → **exactly ONE "Customer fee"
     adjustment** (control "Flat fee", auto-apply only, also 1). Result = correct.
  2. **Auto-inheritance setup (S9-R1 path):** a brand-new customer was created
     while "Customer fee" was auto-apply → it auto-inherited "Customer fee" AND
     "Flat fee" as defaults (FD-CUST-014 confirms). *(WO-create for that new
     customer needs a vehicle owned by the new company; vehicle-create needs a
     contact/customer_id the new company doesn't yet have, so this exact WO count
     was not completed — but setup #1 covers the same "auto-apply + default"
     collision.)*
- **Conclusion:** on the current qb build the auto-apply + customer-default
  collision resolves to **one** adjustment (intended per spec). The recon
  (2026-07-08) ×2 observation was **not reproducible** here — the bug appears
  **fixed or not triggerable via the create path**. Recommend confirming with the
  team whether the S9 dedupe fix has shipped; if so, FD-CUST-016/FD-VAL-007
  EXPECTED (double-add) should be re-scoped to "single adjustment".
- **Evidence:** `/tmp/fdcln/batch2-results.json` (BUG-FD-1 = NOT-REPRODUCED, count
  1), `/tmp/fdcln/cust-lifecycle-results.json` (FD-CUST-014 inheritance).

## BUG-FD-2 — Statistics tab F&D layout differs from spec (aggregate, not per-row)
- **Type:** Deviation (S4-R2 / S4-R3).
- **Cases:** FD-STATS-001 (and FD-STATS-002/003/004 depend on it).
- **Spec:** Stats "Fees & Discounts (N)" section lists **each adjustment** with a
  **"%" column and an "Amount" column**, signed.
- **Build:** Stats shows **aggregate rows only** — "Fees (N) / Discounts (N) /
  Net" (recon), and the section header "Fees & Discounts (N) $…". No per-adjustment
  %/Amount rows. Evidence `wo-stats.png`.
- **Action:** The case EXPECTED does not match the live build — **listed for
  confirmation, not rewritten.** Decide: is the aggregate layout the intended V1,
  or is the per-row layout still to be built?

## BUG-FD-3 — Whole-WO adjustment add/edit/remove is NOT backend-enforced
- **Type:** Deviation / enforcement gap (S13-R3 / S13-N2).
- **Cases:** FD-PERM-002, FD-WO-013.
- **Detail:** Technician (`quick-login {key:'tech'}`, fe-permissions =
  `customersView, scheduleView, woPickParts, workOrderLinesCreateAndEdit,
  workOrdersView, woTechViewMode`) has **NO `workOrdersCreateAndEdit`**, yet
  `POST /api/work-orders/adjustments/add` with `scope:"whole_wo"` **returned 201**
  (adjustment created; removed after). Per S13-R3 a whole-WO adjustment add
  requires **Work Orders: Create and Edit**; the backend does not enforce it.
- **Consistent with** the project's documented enforcement model (granular perms
  are front-end display gates; BE enforces only resource View/Edit). Template
  create (Settings→Finance) **is** BE-enforced (403), and financials are masked
  for `view_mode:tech` (`sub_total:"0.00"`).
- **Action:** Confirm whether whole-WO adjustment writes should be BE-enforced or
  remain FE-gated for V1.
- **Batch-2 reconfirm (2026-07-08):** re-ran with the `tech` quick-login (now 200
  on qb). Tech fe-permissions = `customersView, scheduleView, woPickParts,
  workOrderLinesCreateAndEdit, workOrdersView, woTechViewMode` (no
  `workOrdersCreateAndEdit`). `POST /api/work-orders/adjustments/add`
  scope=`whole_wo` → **201** again (FE-only). By contrast **template create → 403**
  and **customer-default GET+POST → 403** (BE-enforced), and `view_mode=tech`
  masks financials (`sub_total:"0.00"`). **New:** the WO **history** endpoint is
  also **NOT BE-enforced** — tech (no `viewHistoryLogs`) `GET
  /work-orders/{id}/history` → **200 with 100 entries** (so View History Logs is an
  FE display gate; F&D history persists regardless — S10-R1). Full data in
  `/tmp/fdcln/enforce-tech-results.json`; per-role FE matrix in
  `/tmp/fdcln/roles-matrix.json`.

## BUG-FD-4 — WO Add/Edit dialog: "Add" button not disabled on an empty form (Deviation)
- **Type:** Deviation (S2-N1/N2 / design §6 validateForm()).
- **Cases:** FD-WO-005, FD-VAL-001 (flagged VIU-Pending — DEVIATION, not rewritten).
- **Detail:** The Add Fee/Discount dialog shows the confirm button **enabled**
  (blue "Add Fee") even with Name and Amount empty (evidence
  `viu-evidence/b2-05-add-dialog-empty.png`). The build enforces required-field
  validation **on submit** (inline error "Amount must be greater than 0",
  confirmed batch 1) rather than by disabling the button. The underlying spec rule
  (can't save an empty/invalid adjustment) still holds; only the mechanism
  (disabled-button vs inline-error) differs. Same pattern as the batch-1
  "Save Settings always enabled" template-dialog note.
- **Action:** Confirm intended (inline-error vs disabled-button).

## BUG-FD-5 — Inline line adjustments: no "Show N more" collapse toggle (Deviation)
- **Type:** Deviation (S3-R15 / S3-R16 / S12-R6).
- **Cases:** FD-INLINE-003 (flagged VIU-Pending — DEVIATION).
- **Detail:** With **two** labor-line adjustments on one line, **both** inline rows
  render and **no "Show N more" / "Show less"** toggle was observed (evidence
  `viu-evidence/b2-05`). Spec expects only the first row + a toggle when ≥2.
- **Action:** Confirm whether the collapse toggle is planned for V1.

## NOTE-FD-7 — Add dialog Taxable is a toggle; template delete-confirm wording differs
- **Type:** Note / minor deviation (recon-level wording drift, §6.1 / S2-R26 / S7-R20).
- **Detail:** (a) The WO Add/Edit dialog **Taxable** control is a **Yes/No toggle
  switch**, not the spec's Yes/No **dropdown** (S2-R26); default Yes (b2-05).
  (b) The template **delete-confirm** dialog title is **"Delete Template"** with
  message **"This template is set as a default for 1 customer. Deleting it will
  remove it from them."** (b2c-05) — the S7-R21 customer-default warning IS present,
  but the base wording differs from spec S7-R20 ("Are you sure you want to delete
  this fee / discount?"). Low severity.

## NOTE-FD-4 — Processing Fee: UI not built, but backend accepts it
- **Type:** Note (Story 8; leave VIU-pending per instructions).
- **Detail:** Template builder Type dropdown offers only **Fee / Discount** (no
  Processing Fee). However `POST /api/adjustment-templates` with
  `kind:"processing_fee"`, `calculationType:"pct_grand_total"` **returned 201**
  (created; deleted after). So the BE data model already supports Processing Fee;
  only the UI is missing.

## NOTE-FD-5 — Customer default picker + template page location differ from spec
- **Type:** Deviation (recon; S9-R18/R20, S7-R7a).
- **Detail:** (a) Customer default "Add Fee/Discount" is a **dropdown + Save**,
  not the spec's checkbox **multi-select list with "Add"** (S9-R18/R20) — though
  the API accepts a `templateIds` **array**, so multi-add is supported under the
  hood. (b) The admin template library sits under **Finance** (matches S13-R8),
  not **Service → below Canned Lines** (S7-R7a/c).

## NOTE-FD-6 — Build label uses "Add Fee/Discount" (no spaces) at WO/dialog
- **Type:** Deviation (recon; §6.1 exact-text).
- **Detail:** Spec WO-toolbar label is "Add Work Order Fee / Discount" and dialog
  uses spaces around the slash; build uses **"Add Fee/Discount"** (no spaces) at
  the WO toolbar and card menu says **"Edit | Remove"** (spec S3-R9 says
  "Edit / Delete"). Low severity wording drift.

## FDBUG-3 — reinforced (batch-3, 2026-07-09)
- Batch-3 FD-HIST-007 attempt: a Processing Fee auto-applied to a fresh WO produced NO
  history entry (`GET /api/work-orders/{id}/history` empty for the new WO) — same root
  cause as FDBUG-3 (auto-applied adjustments are not logged). Not a new bug; blocks the
  positive verification of FD-HIST-007 until fixed.
