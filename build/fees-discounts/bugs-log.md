# Fees & Discounts V1 — Bugs & Deviations Log

**Env:** app `https://qb.qa.shopview.com` / API `https://sv7387api.qa.shopview.com`
(SV-7387). Verified as Admin (quick-login) + Technician (quick-login).
**Date:** 2026-07-08. Evidence in `viu-evidence/*.png`, calc data in
`/tmp/fdcln/calc-results.json` (ephemeral). Spec = `requirements.md`.

Severity legend: **Deviation** = build differs from spec; **Bug** = incorrect/
broken behavior; **Note** = build fact worth tracking.

---

## BUG-FD-1 — Customer-default + location auto-apply can double-add on a new WO
- **Type:** Bug (known S9 gap, requirements §14 item 4).
- **Cases:** FD-CUST-016, FD-VAL-007.
- **Status this pass:** Setup CONFIRMED, not re-observed via a fresh WO create.
- **Repro / evidence:**
  1. A template can be simultaneously **auto-apply at the location** AND a
     **customer default**. Confirmed live: template "Customer fee" (id
     `43e94ed0…`, `autoApply:true`) is also a customer default on customer
     Aaborough Works (`7af75d7c…`) — `GET /api/customers/7af75d7c…/default-adjustments`
     returns it.
  2. Recon (2026-07-08) directly **observed the auto-apply template landing ×2**
     on one newly-created WO — the shape of this bug.
  3. Intended result per spec: **one** adjustment on the WO; a duplicate is the
     defect.
- **Why not re-observed here:** `POST /api/work-orders/create` needs a vehicle
  that is associated to the target company (`company_id` is derived from
  `vehicle_company_id`); could not cleanly seed that association within budget,
  and the New-WO UI flow timed out. Recommend re-confirming by creating a WO for
  Aaborough via the UI and counting the "Customer fee" adjustments (expect 2 =
  bug).

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
