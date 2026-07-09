# Fees & Discounts V1 — Jira Bug Drafts (ready to file)

> **STATUS: NOT YET FILED — Atlassian is not reachable from this Claude Code
> environment.** File these via your chat app where Atlassian / Jira IS connected.
> Do NOT auto-create them from here.
>
> Source of truth: `build/fees-discounts/bugs-log.md`,
> `build/fees-discounts/viu-qb-findings.md` (FDBUG register + API map),
> `build/fees-discounts/viu-findings.md`. Spec = `build/fees-discounts/requirements.md`.
>
> These are the **confirmed F&D CODE bugs** (behaviour is wrong or missing). Pure
> label/copy/UX-mechanism drift and product-ruling questions are NOT filed here —
> they live in `build/fees-discounts/Deviations-and-Questions-for-PO.md`.

## Common fields (apply to all tickets)

- **Project:** ShopView — **SV**
- **Issue type:** **Bug**
- **Product Area (REQUIRED, `customfield_10153`):** **Work Orders** (id **`10120`**)
- **Parent (epic):** **TBD — confirm the F&D epic key before filing.** The F&D spec
  header lists **Epic = TBD**; `SV-7387` is only the QA-env / F&D-permissions label
  and `SV-7388` is the *Custom Roles & Permissions* epic — **neither is the Fees &
  Discounts epic.** Leave `parent` **unset** until the correct F&D epic is confirmed.
- **Labels:** `fees-discounts`, `qa`, `testrail`
- **cloudId (same ShopView Atlassian instance):** `19fdd96d-a135-46c4-83e7-d2cc218a4e63`
- **QA env:** app `https://qb.qa.shopview.com` · API `https://sv7387api.qa.shopview.com`
  (SV-7387) · `FeesAndDiscounts` flag ON.

---

## TICKET 1 (FDBUG-1) — Priority: High

**Summary:** Fees & Discounts: work-order & estimate Subtotal/Total EXCLUDE adjustment amounts while GST still taxes them (customer-facing money is wrong)

**Description:**

*Summary of issue*
On a work order carrying fees/discounts, the money totals leave the net adjustment
amount OUT of the Subtotal and Total, yet the GST/tax line still INCLUDES the tax
effect of those same adjustments. The customer-facing money (WO Financial Info and
the estimate/invoice document) is therefore wrong.

*Simplified Steps to Reproduce*
1. Open a work order and add one or more whole-WO fees (e.g. a fees-only WO).
2. Look at the WO Financial Info Total/Balance and `total_cost`.
3. Generate the customer estimate/invoice document and read Subtotal / GST / Total.

*Expected*
The Adjustments block is included BEFORE the Subtotal, so Subtotal = base + net
adjustments, GST is computed on that adjustment-inclusive Subtotal, and Total =
Subtotal + GST (per S5-R5). `total_cost` matches the document Total.

*Actual*
`total_cost`, Financial-Info Total/Balance AND the estimate's Subtotal/Total all
OMIT the net adjustment amount, while GST DOES include the adjustments' tax effect.
Batch 1/2 examples: a fees-only WO showed **Total $10.93 = tax alone** (fees $218.68
ignored); an estimate showed **Subtotal $292.83 / GST $17.75 / Total $310.58** with
**+$62.25 net adjustments missing**.

*Inconsistency / re-check note*
This reproduced in **batch 1/2 (2026-07-08)** but did **NOT reproduce in batch 4
(2026-07-09)** — three WOs' estimate documents reconciled correctly (Subtotal
includes net adjustments, GST on the adjustment-inclusive Subtotal, `total_cost`
matches). It may be a partial/shipped fix, or scenario-specific (discount-heavy /
excess-credit / a particular surface such as fees-only WOs or the Financial-Info
tab vs the estimate). **Please confirm whether a fix shipped between 07-08 and 07-09
and which surfaces/scenarios it covers**; QA will run a controlled re-check to pin
the trigger.

*Affected cases*
FD-DOC-011 (expected deliberately left unchanged pending this ticket).

*Related*
- Spec S5-R5 (Adjustments before Subtotal).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 2 (FDBUG-2) — Priority: High

**Summary:** Fees & Discounts: Processing-Fee grand-total base wrongly includes whole-WO fees/discounts and their tax (overcharges the customer)

**Description:**

*Summary of issue*
A Processing Fee calculated as "% of grand total" is computed on a base that
incorrectly includes the whole-WO fees/discounts (and their tax). Per §5-R4 the
processing-fee base must EXCLUDE every whole-WO adjustment, so the customer is
overcharged.

*Simplified Steps to Reproduce*
1. On a WO with a subtotal, add a whole-WO fee (e.g. $212.00 of whole-WO fees).
2. Apply a Processing Fee of 3% (calculation type "% of grand total").
3. Compare the resolved processing-fee amount to the spec base.

*Expected*
Per §5-R4 the pfee base EXCLUDES all whole-WO adjustments → 3% × 307.47 = **$9.22**.
(Tax-inclusion, resolve-last, and the no-self-feedback tax rule all behave correctly.)

*Actual*
The pfee base includes the whole-WO fees + their tax → observed 3% × (292.83
subtotal + 212.00 whole-WO fees) × 1.05 = **$15.90** (overcharge).

*Affected cases*
FD-PROC-009, FD-CALC-013 (also feeds the Stats totals in FD-STATS-001/002/004).

*Related*
- Spec §5-R4 (processing-fee base excludes whole-WO adjustments).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 3 (FDBUG-3) — Priority: Medium

**Summary:** Fees & Discounts: auto-applied adjustments write NO history-log entry (audit gap)

**Description:**

*Summary of issue*
Adjustments that land on a work order automatically (location auto-apply and
customer-default templates, including a customer-default Processing Fee) are not
recorded in the WO history log. Manual add/edit/remove ARE logged correctly, so the
audit trail is incomplete for anything auto-applied.

*Simplified Steps to Reproduce*
1. Set one or more templates to auto-apply (and/or set customer defaults).
2. Create a new work order for that customer/location so the adjustments auto-apply.
3. Open the WO history (`GET /api/work-orders/{id}/history`).

*Expected*
Each auto-applied adjustment writes a history entry (added, as a fee/discount,
"Applied to: Full invoice"), consistent with manual add/edit/remove logging (§1 /
S10-R2).

*Actual*
A new WO that received 3 automatic adjustments (location auto-apply ×2 + a
customer-default processing fee) logged only "Created"/"Line created" — no
adjustment entries. Reconfirmed in batch 3: a Processing Fee auto-applied to a fresh
WO produced NO history entry (history empty for the new WO).

*Affected cases*
FD-HIST-001 (also blocks the positive verification of FD-HIST-007).

*Related*
- Spec §1 / S10-R2 (history logs adjustment lifecycle).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 4 (FDBUG-9) — Priority: Medium

**Summary:** Fees & Discounts: Max Amount of 0 is accepted and treated as NO cap (should force $0.00 / be treated as empty)

**Description:**

*Summary of issue*
A percentage adjustment saved with a Max Amount (maxCap) of 0 is stored and then
resolves with NO cap applied, instead of forcing the result to $0.00 (spec §5-R6) —
and the product contract is that 0 should be treated as empty / never sent (S7-R14).
Either way, the current behaviour (0 = unlimited) is wrong.

*Simplified Steps to Reproduce*
1. Add a percentage fee/discount (e.g. 10%) with Max Amount = 0.
2. Save it against a WO whose base makes 10% non-trivial (e.g. base $324.60).
3. Read the resolved amount.

*Expected*
Per §5-R6, Max $0 forces the resolved amount to **$0.00**; and per S7-R14 a 0 is
treated as empty (no maximum). The build should NOT resolve an uncapped amount for
maxCap 0.

*Actual*
`maxCap:0` is accepted and treated as NO cap — 10% of $324.60 resolved to **$32.46**
despite maxCap 0.

*Affected cases*
FD-CALC-008, FD-VAL-006 (also the 0-handling clause of FD-TMPL-011).

*Related*
- Spec §5-R6 / S7-R14 (Max Amount 0 handling).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 5 (FDBUG-10) — Priority: Medium

**Summary:** Fees & Discounts: a percentage below the minimum is silently rounded up instead of being rejected

**Description:**

*Summary of issue*
A percentage value below the allowed minimum is accepted and silently coerced
(rounded up) to the minimum, rather than being rejected with a validation error.

*Simplified Steps to Reproduce*
1. Add a percentage fee/discount with a percent below the minimum (e.g. 0.005%).
2. Save it.
3. Observe the stored/resolved percent.

*Expected*
Per §5-R1 a percent below the minimum is **rejected** (validation error 400), not
accepted.

*Actual*
0.005% is accepted and rounded UP to 0.01% (201) instead of being rejected.

*Affected cases*
FD-CALC-006.

*Related*
- Spec §5-R1 (minimum percentage value).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 6 (FDBUG-14) — Priority: Low

**Summary:** Fees & Discounts: part-line Add Fee/Discount dialog has label/copy defects ("% of Labor Total" mislabel, raw enum "Pct_parts", missing "Line N Part —" prefix)

**Description:**

*Summary of issue*
On the part-line "Add Fee/Discount" dialog the calculation behaviour is correct
(dialog locked to the part; exactly 2 calc methods; the percentage resolves against
the Part total), but three labels are wrong.

*Simplified Steps to Reproduce*
1. Open a WO with a part on a line → part row ⋯ → "Add Fee/Discount".
2. Read the dialog subtitle and the Calculation Type field.
3. Select the percentage option and read its label and preview.

*Expected*
Per S2-R11 / §5-R10: (a) subtitle "Applying to: Line {N} Part — {part name} ({part
number})"; (b) Calculation Type shows a humanized label; (c) the part-line
percentage option is labelled **"% of Parts Total"**.

*Actual*
(a) Subtitle reads "Applying to: 1710 U-JOINT 1.938X6.094" — omits the "Line {N}
Part —" prefix and the part number in parens; (b) the Calculation Type field default
shows the raw enum **"Pct_parts"**; (c) the part-line percentage option is
mislabelled **"% of Labor Total"** even though it correctly resolves against the Part
total (preview: "Part total $232.68 … Fee · 10% +$23.27"). Behaviour is right; labels
are wrong. Evidence: `screenshots/viu-qb/partui3-dialog`, `partui5-partcalc`,
`partui6-preview`.

*Affected cases*
FD-PART-001.

*Related*
- Spec S2-R11 (subtitle) / §5-R10 (part percentage label).
- Parent epic: **TBD — confirm F&D epic key.**

---

## TICKET 7 (BUG-FD-3 — enforcement gap) — Priority: Medium

**Summary:** Fees & Discounts: whole-WO adjustment add/edit/remove is enforced only in the front end, bypassable via the API

**Description:**

*Summary of issue*
Role-gating of **whole-WO** adjustment writes is a front-end display gate only — the
backend does not enforce the required "Work Orders: Create and Edit" permission, so a
role without it (e.g. Technician) can add/edit/remove a whole-WO adjustment via the
API. (Note: this overlaps the product-ruling question in
`Deviations-and-Questions-for-PO.md` items FD-PERM-002 / FD-WO-013 — file this ONLY
if the PO confirms the writes should be server-enforced.)

*Simplified Steps to Reproduce*
1. Sign in as a role WITHOUT `workOrdersCreateAndEdit` (e.g. Technician; quick-login
   `{key:'tech'}` on qb).
2. Confirm the whole-WO "Add … Fee / Discount" controls are hidden in the UI.
3. Call `POST /api/work-orders/adjustments/add` with `scope:"whole_wo"` for a valid WO.

*Expected*
Per S13-R3 the backend rejects the write with **403** (permission enforced
server-side), the same way templates admin and customer-defaults are enforced.

*Actual*
The backend allows it — Technician without `workOrdersCreateAndEdit` got **201** on
`adjustments/add` scope=`whole_wo` (reconfirmed batch 2). It is an FE-only gate.
By contrast the same tech session correctly gets **403** on template create/list and
on customer default-adjustments GET/POST (those ARE BE-enforced), and financials are
masked for `view_mode:tech`. Separately, the WO **history** endpoint is also FE-only
(tech without `viewHistoryLogs` got 200 with entries) — same enforcement-model class.

*Affected cases*
FD-PERM-002, FD-WO-013 (also touches FD-PERM-007, FD-TMPL-016; and the history
FE-only observation touches FD-PERM-009 / FD-HIST-006).

*Related*
- Spec S13-R3 (whole-WO add/edit/remove requires Work Orders: Create and Edit).
- Depends on the PO ruling in `Deviations-and-Questions-for-PO.md` (FD-PERM-002 /
  FD-WO-013): confirm whether server-side enforcement is intended for V1 before filing.
- Parent epic: **TBD — confirm F&D epic key.**
