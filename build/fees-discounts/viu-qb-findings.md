# Fees & Discounts V1 — Deep VIU, Batch 1 (qb QA env)

**Date:** 2026-07-08 · **Env:** `qb.qa.shopview.com` / API `sv7387api.qa.shopview.com` · **User:** Admin
**Feature flag:** `FeesAndDiscounts` ON (untouched). Env map/access: `viu-recon.md`.
**Scope:** all 182 authored cases adjudicated against the live build (UI via Playwright boot2 +
API probes). Screenshots: `screenshots/viu-qb/*.png`. Per-case verdicts+evidence are written into
`cases/*.json` (`viu_status` + a "VIU qb batch-1" note on every case).

> **TWO PARALLEL PASSES RAN ON 2026-07-08 (same branch, same env).**
> **Pass A** (commit `a9d38f8`, files `viu-findings.md` + `bugs-log.md` + `viu-evidence/`):
> API-heavy pass, 62/182 verified, ran Admin + **Technician** sessions — **tech quick-login
> returned 200 for pass A** (recon and this pass B saw 403 earlier; treat tech login as
> flaky/recently enabled — retest before relying on it).
> **Pass B** (this file + `screenshots/viu-qb/`): UI-deep pass over templates admin, customer
> defaults, WO dialogs/cards, processing-fee end-to-end, estimate document, lifecycle.
> Pass A's per-case verdict strings are merged into each case's `notes` as
> "[pass A same-day parallel verdict]"; the merged `viu_status` takes the stronger verdict.
> **Pass A explains most of the "concurrent user" interference pass B observed**
> (template deletions, autoApply toggles, the "test" fee on S3-15888).
>
> **Reconciliations:**
> - **Double-add (BUG-FD-1 in pass A's bugs-log):** pass A left it open (recon had seen ×2).
>   Pass B ran the controlled repro — a customer whose defaults ARE the auto-apply templates
>   got exactly ONE adjustment per template on a fresh WO. **Not reproduced; treat as
>   fixed/intermittent, PO to confirm.**
> - **Whole-WO add enforcement (BUG-FD-3, pass A):** Technician WITHOUT
>   workOrdersCreateAndEdit got **201** on `adjustments/add` (scope whole_wo) → S13-R3 is
>   FE-only; templates admin IS BE-enforced (tech → 403 list/create). Folded into
>   FD-WO-013 / FD-PERM-002 / FD-PERM-007 / FD-TMPL-016.
> - Pass A also verified **part_line per-item math** ($5 × qty 2 = $10; pct_parts on
>   qty×sell) on an existing parts WO → FD-PART-002/004, FD-CALC-004 upgraded.

## Scoreboard (182 cases, after merging both passes)

| viu_status | Count | Meaning |
|---|---|---|
| **VIU-Verified** | **72** | Exercised on the build; matches the spec |
| **VIU-Deviation** | **36** | Exercised; build deviates from spec (bug or case-update needed — see below) |
| **VIU-Blocked-NotBuilt** | **11** | Surface absent (Part Sales S11 = 7, Processing-Fee builder UI S8 = 4) |
| **VIU-Blocked-Env** | **31** | Not testable this batch (restricted-role logins for Story-13 perms — tech login flaky; no QuickBooks; org-flag toggling skipped on shared env) |
| **VIU-Pending** | **32** | Not attempted in batch 1 (parts UI flows, invoice-time walks, misc leftovers) |

## Bugs / deviations found (FDBUG register)

**Calculation / money (high impact):**
1. **FDBUG-1 — WO totals exclude adjustments while taxing them (MAJOR).** `total_cost`,
   Financial-Info Total/Balance AND the customer estimate's Subtotal/Total all omit the net
   adjustment amount, while GST *does* include the adjustments' tax effect. Evidence: fees-only WO
   showed **Total $10.93 = tax alone** (fees $218.68 ignored); estimate showed Subtotal $292.83 /
   GST $17.75 / **Total $310.58** with **+$62.25 net adjustments missing**. Spec S5-R5 places the
   Adjustments block *before* Subtotal (i.e. included). Customer-facing money is wrong.
2. **FDBUG-2 — Processing-fee Grand-Total base includes whole-WO fees/discounts + their tax.**
   Observed 3% pfee = 3% × (292.83 subtotal + 212.00 whole-WO fees) × 1.05 = **$15.90**; §5-R4
   requires the base to EXCLUDE every whole-WO adjustment → expected 3% × 307.47 = **$9.22**.
   (Tax-inclusion itself, resolve-last, and the no-self-feedback tax rule all behave correctly.)
3. **FDBUG-9 — `maxCap: 0` accepted and treated as NO cap** (resolved $32.46 with maxCap 0);
   §5-R6 says Max $0 forces $0.00 (and the product contract is that 0 is treated as empty/never sent).
4. **FDBUG-10 — percent below minimum silently coerced:** 0.005% is accepted and rounded UP to
   0.01% (201) instead of rejected (§5-R1).

**Missing behaviors:**
5. **FDBUG-3 — Auto-applied adjustments write NO history-log entry.** A new WO that received 3
   automatic adjustments (location auto-apply ×2 + customer-default processing fee) logged only
   "Created"/"Line created". Manual add/edit/remove ARE logged correctly. Violates §1/S10-R2.
6. **FDBUG-4 — No "Show N more"/"Show less" collapse** on inline line-level adjustments — all rows
   always show (S3-R15/R16).
7. **FDBUG-5 — Line Total column shows gross only** (grid and estimate "Line Total") — excludes the
   line's own adjustments (S3-R18).
8. **FDBUG-6 — Stats tab F&D section is an aggregate** ("Fees (3) $227.90 / Discounts (0) $0.00 /
   Net $227.90") — not the spec's per-adjustment table with % and Amount columns (S4-R2..R6).
9. **FDBUG-7 — Customer-defaults picker deviates wholesale from S9-R18..R22:** single-select
   dropdown + Cancel/**Save** (spec: caption + checkbox **multi-select** + "Add"); empty message is
   generic "No results" (spec "No templates available to add."); row remove is a direct trash icon
   (spec 3-dot "Remove") and shows **no removal toast** (S9-R24). Backend accepts a `templateIds`
   ARRAY, so only the UI is missing multi-select.
10. **FDBUG-8 — Processing Fee absent from the template-builder UI** (Type = Fee/Discount only)
    although the backend fully supports `kind: processing_fee` (create/validate/deliver/resolve).
    Admin list mislabels a pfee template's Type as "Fee" (customer tab says "Processing fee"
    correctly). WO card still offers **Edit** on a pfee entry (S8-N5) — backend correctly 409s
    ("A processing fee cannot be edited through this endpoint.").
11. **FDBUG-11 — History details omit the "Type:" line** (S10-R6b) — details show only
    Name / Amount / Applied to.
12. **FDBUG-12 — API-created customers don't get auto-apply templates seeded as defaults**
    (S9-R1); UI-created customers DO. Seeding appears to live in the FE create path.
13. **FDBUG-13 — Line-scope Add dialog has NO template picker at all** — S2-R13..R17 (filtered
    picker + "Showing templates compatible with this line." hint) unimplementable at line scope;
    the whole-WO dialog's picker lists every template.
14. Minor: `part_line` add accepts a non-part targetId (a line id) and resolves $0 — weak target
    validation.

**Label/copy deviations (case-update candidates, not necessarily code bugs):**
- Add-dialog title **"Add new fee/discount"** (spec "New Fee / Discount"); the EDIT title
  "Edit Fee / Discount" matches.
- Menu label **"Add Fee/Discount"** everywhere (spec "Add Work Order Fee / Discount" on the WO
  toolbar; spaces-around-slash convention not followed).
- Labor-line subtitle "Applying to: {line name}" — no "Line {N} Labor —" prefix (S2-R10).
- Template admin: toasts are generic **"Template created"/"Template updated"** (spec "Fee added"
  etc. per type, S7-R18); create button **"Create"** (spec "Add Fee / Discount", S7-R17); amount
  label "$ Default Amount"; Taxable/auto-apply are **toggles** (spec Yes/No dropdown + checkbox);
  extra **Description (Optional)** field (255) not in spec; auto-apply label drops "at this
  location"; Type+Calc are **locked on template edit** (spec locks them only in the WO dialog).
- Template delete dialog: "Are you sure you want to delete this **template**?" (spec "fee /
  discount"); default-warning wording differs ("Deleting it will remove it from them." vs "Their
  defaults will be removed too.") — behavior correct incl. `delete-precondition`
  `{affectedCustomerCount:N}`.
- WO card entry menu **"Edit | Remove"** (spec S3-R9 "Edit"/"Delete"); remove-confirm message
  "Are you sure you want to remove this fee?" (spec 'Remove "{name}" from this work order?').
- Admin page lives under **FINANCE** (matches the S13-R8 target, deviates from S7-R7a "Service
  below Canned Lines") — route `/administration/adjustment-templates`, FE-gated `settingsFinance`.
- Add/Create buttons are never disabled; validation is inline-on-save + toasts (design §6
  enable-rule not implemented).

## What was positively verified (highlights)

- **§5 calc contract (backend + preview):** base×percent, half-cent rounds UP (0.1%×265 → 0.27),
  flat exactness, per-scope method matrix enforced with exact 400s, discount ≤100% / fee uncapped,
  max-cap clamp, $0 base → $0.00, taxable fee/discount move GST to the cent, 3-step order
  (line-level on target gross → whole-WO on net-including-line-effects, no stacking anywhere),
  same template applies twice, declined line → $0.00 and back, deleting a line/template behaves
  per S3-R2/S7-R4/S7-N1.
- **Dialog UX:** live preview exact strings ("Enter an amount to see the impact.", "Tax is
  recalculated on save.", "Work-order subtotal → New work-order subtotal", "Line labor total →
  New line labor total", "Base · Labor total"/"Base · Parts total" rows, no Base row for
  %-of-subtotal), fee GREEN rgb(33,186,69) / discount RED only in preview, "Add Fee"/"Add
  Discount" flips live, edit locks Type/Calc + hides picker + re-resolves + "Save" + "Fee updated".
- **Cards:** "WO Fees & Discounts" sidebar card (badges "−10%"/"$11.00", grey signed resolved
  amounts with true minus, hover ⋮), Financial Info "Fees & Discounts (N) net" row counting all
  scopes; inline ↳ rows with pill badges.
- **Customer defaults (S9):** tab count live, caption/empty-state EXACT, picker excludes linked
  templates, defaults land on new WOs as independent copies (`appliedBy: customer_default`),
  percentage defaults re-resolve per WO, template values copied at link time, UI-created customer
  inherits auto-apply templates, **double-add bug NOT reproduced** (auto-apply + default → ONE
  adjustment), customer deletion removes links.
- **Auto-apply (S7-R5):** templates with autoApply land on new WOs as `appliedBy: auto`, whole-WO
  scope, values copied; later template edits don't touch existing WO copies (also for pfee, S8-R19).
- **Estimate document (S5, S14):** per-line "↳ name (% of labor) $66.25"; discount "($15.00)"
  accounting format; Adjustments block position + creation order; "(% of grand total)" phrase;
  Shop-supplies section hidden at $0.00 and shown when >0. (Subtotal/Total math broken — FDBUG-1.)
- **Lifecycle:** paid/invoiced WO hides all controls AND API rejects with 409; processing fee not
  addable by hand (UI + exact API error); processing fee delivered via customer default and
  resolved last/dynamically.
- **History log (manual actions):** one entry per add/edit/remove, bold labels, Line "−", set-rate
  amounts, "Applied to: Full invoice".

## API surface mapped (for batch 2 / future runs)

- Templates: `GET/POST /api/adjustment-templates`, `POST /api/adjustment-templates/{id}/change`,
  `DELETE /api/adjustment-templates/{id}`, `GET /api/adjustment-templates/{id}/delete-precondition`
  → `{affectedCustomerCount}`. Fields: `{name,kind:fee|discount|processing_fee,calculationType:
  flat|pct_labor|pct_parts|pct_subtotal|pct_grand_total,defaultAmount,defaultMaxCap,autoApply,
  taxable,description}`.
- WO adjustments: `POST /api/work-orders/adjustments/add|change|remove`
  (`add`: `{workOrderId,kind,name,calculationType,amount,maxCap,scope:whole_wo|labor_line|part_line,
  targetId,taxable,templateId,description}`; `change` takes only
  `{adjustmentId,name,amount,maxCap,taxable}`; `remove` → 204).
- Reads: whole-WO adjustments in `GET /api/work-orders/view/{id}` (`work_order.adjustments`,
  `adjustmentsSummary{feesCount,feesAmount,discountsCount,discountsAmount,netAmount,
  excessCreditAmount}`, `totalAdjustments`); line-level ones under each line in
  `GET /api/work-orders/lines/{woId}` (`collection[].adjustments`).
- Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
  (POST `{templateIds:[…]}` — array OK).
- Mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status` →
  `{quickBooksConnected,feeItemMapped,discountItemMapped}` (polled before every add dialog).
- Test-data seeding proven: `customers/create {name}` → `contacts/create {company_id,first_name}`
  → `vehicles/create {company_id,customer_id:<contactId>,unit}` → WO via **UI** (New Work Order on
  the customer's WO tab; `work-orders/create` 500s via raw API) → line via UI canned line
  ("CVIP - Light Duty Truck - Wheels On" = fixed $265; `lines/create-from-canned-line` 201).
  Cleanup: `work-orders/delete {work_order_id}`, `vehicles/delete {vehicle_id,company_id}`,
  `contacts/delete {customer_id,company_id}`, `customers/delete {company_id}`.

## Environment cautions

- **Concurrent users are active on qb**: during the run someone toggled "Flat fee" autoApply
  twice, added/removed a "test" fee on S3-15888, and **deleted two of my ZZAUTOTEST templates
  mid-run**. Timing-sensitive checks should expect interference; never assume env state.
- Tech quick-login is 403 on this env (Admin only) → Story-13 permission negatives need either the
  staff role-switch of a loginable second user or a fixed tech login. **Blocked batch 1.**
- Org feature-flag toggling (flag-off cases) deliberately skipped on the shared env.
- SPA deep-link gotcha refined: `/workorders/{id}/lines` deep-links fine; other sub-routes work via
  in-SPA `history.pushState + PopStateEvent('popstate')` (customers detail = `/customers/{id}/…`).
  A 0-line WO auto-opens the persistent New-Line dialog (close via its X icon before navigating).

## Cleanup / restore audit (all done)

- Deleted: WOs S3-15900/15901/15902 (all ZZAUTOTEST), templates "ZZAUTOTEST fee flat"/"ZZAUTOTEST
  disc pct" (externally deleted mid-run)/"ZZAUTOTEST pfee" + 3 API probe templates, customers
  "ZZAUTOTEST FD Batch1"/"ZZAUTOTEST FD Cust2" (+ their contacts & vehicles ZZAUTOTEST-1/-2),
  every probe adjustment (incl. one 409-guard check against a real invoiced WO — rejected, nothing
  written). Customer search for "ZZAUTOTEST" → 0 rows.
- Untouched/restored: feature flags, roles/users, pre-existing templates ("Flat fee",
  "Customer fee"), real WOs/customers/part sale P3-69.

## Batch-2 backlog (the 35 Pending + retests)

1. **Parts flows:** seed a part request on a throwaway WO → FD-PART-001..008, FD-INLINE-002,
   FD-STACK-001, FD-CALC-004, FD-DOC-003/010 (per-item flat × qty is the key §5-R14 rule).
2. **Invoice-time walk:** create+invoice a throwaway WO → FD-DOC-001 (invoice layout),
   over-discount floor/warn/credit (FD-QB-012/014/015, FD-CALC-015/016), verify FDBUG-1 on a real
   invoice, then reverse/clean.
3. **Second-user login** (ask devs to enable tech quick-login or supply creds) → all FD-PERM-*,
   FD-HIST-005/006, FD-WO-013, FD-LABOR-007, FD-REMOVE-002, FD-CUST-015, FD-TMPL-016.
4. **Flag-off window** → FD-FLAG-001/002, FD-HIST-004.
5. Small retests: Stats hidden-when-none, Financial-Info expand rows, inline ⋮ menu items, WO-dialog
   name maxlength, pfee removal history entry, multiple pfees, S8-N6 min-amount probe, S8-N2
   whole-WO picker pfee exclusion, edit-mode save-failure.
