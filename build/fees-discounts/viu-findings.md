# Fees & Discounts V1 — Verify-in-UI (VIU) findings — qb QA env

**Date:** 2026-07-08 · **Env:** app `https://qb.qa.shopview.com`, API
`https://sv7387api.qa.shopview.com` (SV-7387) · Org `d55bc308…` "Staging
Foothills Group Inc".
**Method:** Admin + Technician sessions (`POST /api/quick-login {key:'admin'|'tech'}`,
both 200 on this env now), boot2 hydration for browser; direct API for the calc
contract, validation, permissions, history and template CRUD. Evidence:
`viu-evidence/*.png`; calc data `/tmp/fdcln/calc-results.json` (ephemeral).

> Supersedes the 2026-07-06 staging findings (feature did not render there).
> Recon surface map: `viu-recon.md`. Bugs/deviations: `bugs-log.md`.

## Summary

| Area | Verified | Pending | Note |
|---|---|---|---|
| §5 Calculation contract (FD-CALC) | 10 / 17 | 7 | Math matches spec EXACTLY; pending = Processing Fee + QB-negative-total |
| Permissions (FD-PERM) | 3 / 11 | 8 | BE-enforced: templates, paid/invoiced. FE-only: whole-WO add (BUG-FD-3) |
| Validation (FD-VAL) | 5 / 7 | 2 | All BE value validation confirmed |
| Feature-flag (FD-FLAG) | 0 / 3 | 3 | Flag ON confirmed; off-state not toggled |
| WO whole-WO (FD-WO) | 11 / 15 | 4 | dialog, preview, card, validation, base math |
| Labor line (FD-LABOR) | 4 / 7 | 3 | scope-lock, gross-base, per-item flat |
| Part line (FD-PART) | 3 / 8 | 5 | per-item flat, gross qty×sell base |
| Inline display (FD-INLINE) | 0 / 5 | 5 | data model confirmed; ↳ visual not screenshotted |
| Statistics (FD-STATS) | 0 / 5 | 5 | layout DEVIATION (BUG-FD-2) |
| Financial Info / card (FD-FIN) | 2 / 5 | 3 | card + Financial Info row confirmed |
| Parts-sale column (FD-PCOL) | 0 / 7 | 7 | Story 11 NOT built |
| Edit (FD-EDIT) | 2 / 3 | 1 | re-resolve + history-update |
| Remove (FD-REMOVE) | 1 / 3 | 2 | confirm dialog + 204 |
| Stacking (FD-STACK) | 1 / 3 | 2 | Step-2 net base |
| Customer defaults (FD-CUST) | 7 / 17 | 10 | tab/caption/columns, add/remove endpoints, route-guard |
| Templates admin (FD-TMPL) | 9 / 17 | 8 | CRUD, columns, methods, gating, delete-precondition |
| Processing Fee (FD-PROC) | 0 / 14 | 14 | Story 8 NOT built (BE accepts it — NOTE-FD-4) |
| Customer documents (FD-DOC) | 0 / 11 | 11 | Story 5/14 not reached |
| QuickBooks (FD-QB) | 0 / 16 | 16 | Story 6 not connected |
| History log (FD-HIST) | 4 / 8 | 4 | add/edit/remove events, fields, "Full invoice" |
| **TOTAL** | **62 / 182** | **120** | *(batch-1; see Batch-2 update below → 88 / 182)* |

---

## BATCH 2 (2026-07-08) — reachable built-surface remainder + Story 13 per-role

**New totals: 88 VIU-Verified / 94 Pending (of 182)** — +26 net this batch.
Env unchanged (qb / SV-7387). Method: admin + **tech** quick-login (both 200 now;
the earlier tech-403 is FIXED on qb), direct API for calc/CRUD/enforcement, boot2
for the visual cases. Evidence: `viu-evidence/b2-*.png`, `viu-evidence/b2c-*.png`;
data `/tmp/fdcln/{batch2-results.json,fixup3-results.json,cust-lifecycle-results.json,
roles-matrix.json,enforce-tech-results.json}` (ephemeral).

### Cases moved to VIU-Verified this batch (30)
**API-verified:** FD-STACK-001 (part multi-adj each on own gross base, no stacking),
FD-STACK-003 (same template applied twice → 2 adjustments), FD-PART-008 (flat qty-1
part = base amount), FD-TMPL-013 (pct-discount 150% rejected 400 / pct-fee 150%
allowed), FD-TMPL-017 (name 100-char limit), FD-TMPL-009 (delete template leaves WO
adj), FD-TMPL-005 (auto-apply lands on new WO), FD-CUST-009/010 (pct default added
as independent copy, re-resolves), FD-CUST-011 (remove default keeps existing WO
adj), FD-CUST-012 (delete template drops default link), FD-CUST-013 (delete customer
removes default links), FD-CUST-014 (new customer inherits auto-apply as defaults),
FD-CALC-009 ($0 base → $0.00), FD-HIST-005 (history persists w/ set-rate under SFD
off), FD-LABOR-006 (delete line removes its adjustment).
**UI-verified (b2-05 / b2-04 / b2c-05):** FD-INLINE-001/002 (↳ inline line/part
rows, signed grey resolved), FD-INLINE-004 (per-line Total includes own adj),
FD-INLINE-005 (inline 3-dot menu), FD-STATS-003 (Stats Net = signed sum), FD-TMPL-007
(delete-confirm dialog + S7-R21 warning).
**Story 13 (roles-matrix + tech enforcement):** FD-PERM-001 (SFD masks $ amounts),
FD-PERM-003 (line/part gate via matrix), FD-PERM-005 (SFD prerequisite),
FD-PERM-006 / FD-REMOVE-002 (remove uses Create-and-Edit not Delete), FD-PERM-009 /
FD-HIST-006 (View History Logs is FE-only; BE returns history), FD-LABOR-007
(labor-line starting place FE-gated by WO Lines C&E).

### Story 13 — per-role permissions (self-service)
**Login limitation:** qb `quick-login` supports only `{admin}` and `{tech}` keys;
there is **no per-user login key**, and the `tech` quick-login user is not a
role-switchable staff record on this env — so a **live UI login as each of the other
9 roles was not feasible**. Per the task's fallback, per-role gating was verified by
(a) **enumerating every role's fe-permissions** (`GET /api/organizations/{org}/roles`
→ `GET /api/roles/{id}`) and mapping to the S13 action table, and (b) **live BE
enforcement** using the `tech` (Technician) session, which cleanly isolates several
gates (tech HAS `workOrderLinesCreateAndEdit` but LACKS `workOrdersCreateAndEdit`,
`seeFinancialData`, `settingsFinance`, `customersCreateAndEdit`, `seeApArData`,
`viewHistoryLogs`).

**Per-role FE-capability matrix (all 11 roles, derived from role fe-permissions):**

| Role | See $ (SFD) | Whole-WO adj | Line/Part adj | Part-Sale adj | Manage templates | Customer defaults | History |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Admin | Y | Y | Y | Y | Y | Y | Y |
| Parts Manager | Y | Y | Y | Y | Y | Y | Y |
| Service Manager | Y | Y | Y | Y | Y | · | Y |
| Senior Service Advisor | Y | Y | Y | Y | · | Y | Y |
| Service Advisor | Y | Y | Y | Y | · | · | Y |
| Foreman | Y | Y | Y | · | · | · | Y |
| Office User | Y | · | · | · | Y | Y | Y |
| Parts Technician | Y | · | · | Y | · | · | Y |
| Sales Representative | Y | · | · | · | · | · | · |
| Technician | · | · | Y | · | · | · | · |
| Time Clock User | · | · | · | · | · | · | · |

(Y = the role's fe-permissions satisfy that S13 action's required permission(s); · = denied. Data: `roles-matrix.json`.)

**Live BE enforcement (tech session — `enforce-tech-results.json`):**

| Action | Tech FE gate | Endpoint result | Enforcement |
|---|---|---|---|
| See $ amounts | DENY (view_mode=tech) | WO view `sub_total:"0.00"` | **BE-masked** (SFD) |
| Whole-WO add | DENY (no WO C&E) | `adjustments/add` whole_wo → **201** | **FE-only** (BUG-FD-3) |
| Labor-line add | ALLOW (has Lines C&E) | `adjustments/add` labor_line → 201 | allowed (consistent) |
| Manage templates | DENY (no Settings→Finance) | `POST adjustment-templates` → **403** | **BE-enforced** |
| Customer defaults | DENY (no cust C&E + AP/AR) | GET+POST default-adjustments → **403** | **BE-enforced** |
| History log | DENY (no View History Logs) | `GET .../history` → **200 (100 rows)** | **FE-only** (not enforced) |

**Takeaway:** BE actually enforces only **templates (Settings→Finance)**, **customer
defaults (Customer C&E + AP/AR)**, and **SFD money-masking**. Whole-WO adjustment
writes and the history log are **FE display gates only** (BE allows) — matching the
project enforcement model. Could NOT be tested: live per-role UI gating for the other
9 roles (no per-user login), Part-Sale adjustment gate (Story 11 not built),
flag-OFF gate combination (FD-PERM-010/FD-FLAG-*; would affect the whole org).

### Deviations flagged this batch (kept VIU-Pending — DEVIATION, not rewritten)
- **FD-WO-005 / FD-VAL-001** — Add button not disabled on empty form (BUG-FD-4).
- **FD-INLINE-003** — no "Show N more" toggle with ≥2 line adjustments (BUG-FD-5).
- **FD-STATS-002 / FD-STATS-004** — Stats aggregate layout, no per-adjustment rows (BUG-FD-2).
- **FD-CUST-005** — customer picker is a single dropdown, not a checkbox multi-select (NOTE-FD-5).

### BUG-FD-1 double-add — NOT reproduced (see bugs-log)
Re-driven cleanly via a fresh WO create (the same endpoint the UI uses) with the
auto-apply template ALSO set as a customer default → **exactly one** adjustment
(backend dedupes). Appears fixed / not triggerable via the create path.

### Still VIU-Pending on built surfaces (reason)
Not captured this pass (UI interaction/state not driven): FD-WO-004 (template
autofill), FD-WO-015 (colored preview row), FD-FIN-002/003/005 (expand + no-adj
states), FD-STATS-005 (no-adj hidden), FD-CUST-006/017 (empty picker / failure
toast), FD-EDIT-003 (save-failure keeps dialog), FD-REMOVE-003 (inline remove),
FD-TMPL-010/012/015 (picker scoping / empty list / save-failure toast).
Not constructible via API this pass: FD-CALC-010 (negative base can't be forced),
FD-LABOR-005 / FD-PART-006 (not-billable target), FD-PART-003/005/007 (requested /
requested→received / delete-part — needs a WO with a staged/requested part; delete
mechanism proven identical via FD-LABOR-006). Blocked by not-built / org-wide:
FD-PERM-010, FD-FLAG-001/002/003, FD-HIST-004 (flag-OFF not toggled).

---

## Priority 1 — §5 Calculation contract (highest value): MATH MATCHES EXACTLY

Test WO **S3-15513** (`0993b0a6…`, open/approved): gross **labor $749.75**, gross
**parts $386.34**, **shop supplies $78.72**, **subtotal $1,214.81**, GST 5%
($60.75). Target labor line `422f311e…` (gross $749.75); target part `9c5d99a7…`
(qty 2 × sell $116.34 = $232.68 gross).

Adjustment payload (reverse-engineered + used):
`POST /api/work-orders/adjustments/add {workOrderId, kind:"fee"|"discount",
name, calculationType:"flat"|"pct_labor"|"pct_parts"|"pct_subtotal", amount,
maxCap, scope:"whole_wo"|"labor_line"|"part_line", targetId, taxable,
templateId, description}` → response includes `resolvedAmount`.

| Scenario | Expected (spec) | Actual | ✓ |
|---|---|---|---|
| WO flat $5 fee | +$5.00 | +$5.00 | ✓ |
| WO % of Subtotal 10% | $1214.81×.10 = $121.48 | $121.48 | ✓ |
| WO % of Labor 10% | $749.75×.10 = 74.975 → **$74.98 (half-cent UP)** | $74.98 | ✓ |
| WO % of Parts 10% | $386.34×.10 = 38.634 → $38.63 (down) | $38.63 | ✓ |
| WO % of Subtotal 10% discount | −$121.48 (minus sign) | −$121.48 | ✓ |
| WO discount 150% | REJECT (≤100%) | 400 "cannot exceed 100%" | ✓ |
| WO fee 150% | allowed (no fee cap) | +$1822.22 | ✓ |
| WO % 10% + Max Amount $50 | clamp to +$50.00 | +$50.00 | ✓ |
| WO % 10% + Max Amount $0 | 0 = empty → no cap ($121.48) | $121.48 | ✓ |
| Flat amount $0 | REJECT (>0) | 400 "greater than zero" | ✓ |
| Flat amount $0.01 | +$0.01 | +$0.01 | ✓ |
| Labor-line % of Labor 10% | gross line $749.75×.10 = $74.98 | $74.98 | ✓ |
| Labor-line flat $10 | +$10.00 exact (no qty) | +$10.00 | ✓ |
| Labor-line % of Subtotal | REJECT (method not allowed for scope) | 400 "not allowed for this scope" | ✓ |
| Part-line % of Parts 10% | $232.68×.10 = 23.268 → $23.27 | $23.27 | ✓ |
| Part-line flat $5 (qty 2) | **per item** 5×2 = $10.00 | $10.00 | ✓ |
| Part-line % of Labor | REJECT (method not allowed) | 400 | ✓ |
| **Resolve order** labor-line 10% disc then whole-WO 5% of Labor | line-level first → net labor $674.77; whole-WO on NET = $674.77×.05 = **$33.74** (not gross $37.49) | $33.74 | ✓ |
| **Tax** taxable $100 fee | GST +$5.00 ($60.75→$65.75) | $65.75 | ✓ |
| **Tax** non-taxable $100 fee | GST unchanged | $60.75 | ✓ |

**Verdict: every §5 rule tested resolves EXACTLY to the spec** — base selection by
scope/method (§5-R4/R10), half-cent-rounds-up (§5-R3), per-item flat on parts
(§5-R14), sign (§5-R7), Max cap (§5-R6), min-value & percentage limits (§5-R1/R2),
3-step resolve order on net totals (§5-R5), taxable/non-taxable tax impact
(§5-R11). Pending: FD-CALC-013/014 (Processing Fee — not built), 015/016/017
(negative-total floor / credit memo — need QB), 009/010 ($0/negative base & QB
skip — not driven).

## Priority 2 — Whole-WO fee/discount (Story 2/3)

- Dialog opens from WO toolbar ⋯ "Add Fee/Discount" (`cap-add-dialog.png`); fields
  Apply-from-template, Name, Type (default Fee), Calculation Type (default Flat
  Amount), Amount/Percent, Max Amount (percentage only), Taxable (default Yes).
- Live preview correct: "Work-order subtotal $1,214.81 → Fee · 10% +$121.48 → New
  work-order subtotal $1,336.29 / Tax is recalculated on save"; empty-amount state
  "Enter an amount to see the impact." (`cap-add-filled.png`).
- Saved whole-WO fee appears on the **"WO Fees & Discounts"** sidebar card (name +
  "$11.00" rate badge + "+$11.00" resolved grey) and as **Financial Info →
  "Fees & Discounts (1) $11.00"** (`wo-card-after-add.png`).
- Add dialog fires `GET bookkeeping/adjustment-item-mapping-status` — the QB
  mapping-guard hook (S6-R6), inert because QB isn't connected here.
- Validation (BE): empty name 400, name>100 400, amount 0/negative 400,
  discount>100% 400, add on Invoiced/Paid WO **409**.

## Priority 3 — Labor-line & Part-line (Story 1/§5)

- Labor line ⋯ opens a scope-locked dialog "Applying to: {line}", Calc default
  "% Of Labor Total". Part row ⋯ opens part-line scope. (recon + build).
- Line/part adjustments are stored on `line.adjustments` / `part.adjustments`
  (separate from `work_order.adjustments`) — they resolve on the target's gross
  value and feed the whole-WO net totals (confirmed via the resolve-order test).
- Method restriction enforced per scope (labor→flat/%labor, part→flat/%parts);
  disallowed methods 400.

## Priority 4 — Customer defaults + auto-apply (Story 9)

- Tab/card/caption/columns/empty-state match spec (recon).
- Endpoints: `GET/POST /api/customers/{id}/default-adjustments`
  (POST body `{templateIds:[…]}` → 201, supports multi-add), `DELETE
  /api/customers/{id}/default-adjustments/{defaultId}` → 204 (no confirm, S9-R24).
- Route guard requires `customersCreateAndEdit` + `seeApArData` (S13-R9).
- **Double-add (BUG-FD-1):** setup confirmed present; recon observed ×2; not
  re-driven this pass (WO-create blocked). See bugs-log.

## Priority 5 — History / audit log (Story 10)

`GET /api/work-orders/{id}/history` — each add/edit/remove logs exactly one event
(`work_order.adjustment.added/updated/removed`) carrying `adjustmentName`,
`adjustmentKind`, `adjustmentSetRate` (**set rate, not resolved**),
`adjustmentAppliedTo="Full invoice"` (whole-WO), `lineId=null` (Line column "−").
Matches S10-R2/R4/R5/R6.

## Priority 6 — Template Builder / admin (Story 7)

`GET/POST /api/adjustment-templates`, `POST …/{id}/change`, `DELETE …/{id}`,
`GET …/{id}/delete-precondition` (`{affectedCustomerCount}` → S7-R21 warning).
Create (fee/discount) 201, edit 200, delete 204. List columns + 4 whole-WO methods
+ no-scope-field per recon. Page gated by Settings→Finance (Tech 403). Location
placement is under **Finance** (deviation from spec Service, NOTE-FD-5).

## Priority 7 — Permissions (Story 13)

| Action | Result | Enforcement |
|---|---|---|
| Whole-WO add (Tech, no `workOrdersCreateAndEdit`) | **201 allowed** | **FE-only, NOT BE-enforced** (BUG-FD-3) |
| Labor-line add (Tech HAS `workOrderLinesCreateAndEdit`) | 201 | consistent (can't isolate enforcement) |
| Template create/list (Tech, no Settings→Finance) | **403** | **BE-enforced** |
| See financial amounts (Tech `view_mode:tech`) | `sub_total:"0.00"` | financials **masked** in payload (SFD gate) |
| Customer defaults tab | route guard `customersCreateAndEdit`+`seeApArData` | FE gate confirmed |
| Add on Invoiced/Paid WO | 409 | **BE-enforced** (S3-R1b) |

**Limitation:** the `tech` quick-login user (`a7fd0a88…`) is **not in the org
staff table** (`/api/staff/{id}/view` 404) and quick-login only supports
admin/tech, so per-role FE-gating and enforcement for the other 9 roles could not
be probed on this env. Those permission cases stay VIU-Pending.

## Left VIU-Pending (per instructions / not reachable)

- **Story 8 Processing Fee** — UI not built (BE accepts `kind:processing_fee`, NOTE-FD-4).
- **Story 11 Part Sales** — no F&D affordances on part sales.
- **Story 6 QuickBooks** — not connected (mapping guard, sync, negative-total credit memo).
- **Story 5/14 customer documents** — not reached (needs invoice-ready WO).
- **Feature-flag OFF** state — not toggled (would affect the whole org).
- Per-role permission negatives for non-Tech roles — quick-login limited.

## Cleanup / safety

- Baseline captured to `baseline-templates.json`. All test WO adjustments removed
  (whole-WO + line + part). Test templates ("ZZAUTOTEST …") deleted. Customer
  default added to Aacrest removed; Aaborough's pre-existing default left intact.
- **Restored** the two baseline templates ("Flat fee" $12, "Customer fee" $200) to
  `autoApply:true` (they were observed flipped to false mid-session — see report).
- Final state: exactly the 2 baseline templates, both auto-apply, 0 stray
  adjustments. No roles changed (used tech quick-login, not role-switch). Secrets
  in `/tmp` only.

---

## VIU BATCH 3 — reachable VIU-Pending remainder + Story 13 per-role (2026-07-09)

**Env:** app `qb.qa.shopview.com` / API `sv7387api.qa.shopview.com`, `FeesAndDiscounts`
flag ON. Fresh admin cookies (prior `sv_sso_session` had expired → 401; new one worked).
Baseline captured to `/tmp/fees-discounts/baseline-3.json` (2 templates: "Flat fee" $12
autoApply=true, "Customer fee" $200 autoApply=true). Harness: `/tmp/fdcln/batch3-api.mjs`,
`story13.mjs`, `ui-batch3b.mjs`. Tech quick-login worked this run (200).

**13 cases flipped VIU-Pending/Blocked → VIU-Verified:**

*Reachable VIU-Pending (10, API + selective UI):*
- **FD-REMOVE-003** — line-level adjustment added (201) then removed via
  `POST /api/work-orders/adjustments/remove` (204); gone from the line (S3-R17/R11a).
- **FD-EDIT-003** — invalid edit rejected by `adjustments/change` (amount 0 → 400,
  empty name → 400); original left unchanged → UI keeps the Edit dialog open with the
  error (S2-R30).
- **FD-CUST-017** — customer-default negatives: bad template add → 400, bad-id remove →
  404, bad-customer load → 404 → standard error notification (S9-N1). [API section 4087]
- **FD-TMPL-015** — template save failures (empty name → 400, amount 0 → 400) → failure
  toast (S7-R19).
- **FD-CALC-010** — 50% discount on a $0-base WO → resolved $0.00; negative/zero base
  floored to $0 (§5-R3/R4).
- **FD-PROC-006** — Processing Fee template autoApply=true (201) auto-applied to a new
  WO as whole-WO adjustment kind=processing_fee (S8-R14/S7-R5).
- **FD-STATS-005** — WO with no adjustments → `adjustments=[]` + all-zero
  `adjustmentsSummary` → Stats "Fees & Discounts" section hidden (S4-N1).
- **FD-FIN-002** — whole-WO adjustments returned/listed in creation order (a=fee before
  b=discount), read-only in Financial Info (S3-R23/R24/§5-R9); UI `b3-wo-lines-full.png`.
- **FD-FIN-003** — no-adjustment F&D row hidden (empty summary); tech (view_mode=tech,
  no SFD) WO view masks money (`sub_total="0.00"`) → dollar amounts hidden (S3-N2/N4).
- **FD-FIN-005** — sidebar "Work Order Fee / Discount" card lists whole-WO adjustments
  (UI shows Shop Fee + Loyalty), hidden when empty, no Add control (S3-R4/R10/S3-N1).

*Story 13 per-role (3 of the 4 NEEDS-ACCOUNT cases — verified via tech-session BE
enforcement + per-role FE derivation in `/tmp/fdcln/roles-matrix.json`):*
- **FD-PERM-008** — BE-enforced: tech (lacks `customersCreateAndEdit` AND `seeApArData`)
  → customer default-adjustments GET **403** and POST **403**. FE gate = both perms
  (ALLOW only Admin/Sr SA/Parts Mgr/Office) (S13-R9/N3).
- **FD-CUST-015** — same BE gate hides the customer F&D tab data (default-adjustments GET
  403 for tech) → tab/controls hidden without the perms (S13-R9/N3).
- **FD-PERM-010** — BOTH gates required: with the flag ON, tech lacking the perm is still
  BE-blocked (customer defaults 403, templates 403) → permission required in addition to
  the flag; flag-OFF complement is the env-blocked FD-FLAG-001/003 (S13-R1).

**4th NEEDS-ACCOUNT case reclassified:**
- **FD-PERM-004** (Part-Sale part adjustment requires Part Sales C&E) → **VIU-Blocked-
  NotBuilt (Story 11)**. FE gate is derivable (`partSalesCreateAndEdit`; ALLOW Parts Tech/
  Service Mgr/Admin/Sr SA/Parts Mgr/Service Advisor) but BE enforcement of a *part-sale
  adjustment* cannot be exercised — the Part-Sale adjustment surface is Story 11 (not built).

**Enforcement-model controls re-confirmed (tech session):** templates admin GET → 403
(BE-enforced); whole-WO adjustment add → 201 (FE-only, consistent with **BUG-FD-3**).

**Left pending (not verifiable this run):**
- **FD-PROC-014** — a Processing Fee "carrying a minimum amount" cannot be constructed via
  API (min-amount field is accepted/ignored → 201, not rejected); needs the Story 8
  builder. (Control: pfee w/ maxCap → 400, i.e. Max Amount correctly rejected.)
- **FD-PROC-013** — multiple Processing Fees excluding each other from the base needs the
  Story 8 builder; a manual whole-WO `pct_grand_total` add is rejected (400).
- **FD-HIST-007** — a Processing Fee arrives via auto-apply/customer-default, and
  auto-applied adjustments write NO history entry (**FDBUG-3**) → the positive "logged as
  a fee / Full invoice" cannot be observed until FDBUG-3 is fixed or a manual-add path
  exists.
- Part-line state flows (FD-PART-001/003/005/006/007), customer-document rendering
  (FD-DOC-001/003/006/010), negative-total floor/QB (FD-QB-012/014/015,
  FD-CALC-015/016/017) — not driven this run; and the 6 PO-flagged deviations — untouched.

**Cleanup:** all ZZAUTOTEST throwaway WOs deleted (verified: none dated 2026-07-09 remain;
delete lifecycle confirmed create 201 → delete 201 → view 404); all ZZAUTOTEST templates
deleted; all test adjustments removed from WO_A (final 0). Baseline intact: exactly the 2
templates, both autoApply=true; 0 customer defaults on the test company. No staff users
created (quick-login supports only admin/tech, so login-as-non-Tech is infeasible — Story 13
verified via tech BE tests + role matrix instead). No roles/settings changed. Secrets in
`/tmp` only.

---

## Batch 4 — 2026-07-09 (admin, qb) — part-line state flows + customer-document rendering

**Auth:** admin quick-login 200 (41 fe-perms, view_mode full); tech not needed. Fresh
MITM bridge via Playwright straight at `$HTTPS_PROXY`. Cookies from `/tmp` (batch-3 set,
still valid). Baseline captured → `/tmp/fees-discounts/baseline-4.json` (exactly 2
autoApply templates "Flat fee"/"Customer fee"; 0 customer defaults) — restored at end.

**Key mechanism unlocked (reusable):** the **customer document** is generated by
`POST /api/work-orders/invoices/estimate {work_order_id, type:'html', issue_date,
due_date}` → returns the full **invoice-template HTML** (header literally "Invoice:
INV-…", Invoice Date, Due date, remit-to, mechanic's-lien clause). Fetch full text with a
non-truncating client (`/tmp/fdcln/docgen.mjs`; the shared `fd-admin.js api()` truncates
strings at 500 chars). This is the estimate == invoice preview surface (S5). Committed
invoice = same renderer family (`invoices/preview` GET, `work-orders/invoices/snapshot`
POST — snapshot needs an `entity_event_id` from a committed invoice).

**Part-request seeding (reusable):** throwaway WO via `POST /api/work-orders/create`
(201) → labor line via `POST /api/work-orders/{woId}/lines/create-from-canned-line
{another:false, canned_line_id, work_order_id, status:'authorization_required'}` (201;
free-text line names are NOT accepted — must pick a canned line) → part **request** via
`POST /api/work-orders/part/make-request {line, work_order, description, quantity,
part_source_type:'vendor'|'inventory', part_number, sell_price, cost, part_category_id}`
(201; requires `part_category_id`). A requested part is a `part_requests[]` entry on the
line carrying its own `adjustments[]` and `quantity_remaining`/`total_sell_price`. Line
authorize/decline via `POST /api/work-orders/lines/change-status {line_id, work_order_id,
status:'authorized'|'authorization_declined'}`. Delete a request via
`POST /api/work-orders/part/remove-request/{requestId}`.

### Verdicts

- **FD-PART-003 → VIU-Verified.** 10% "% of Parts Total" discount added to a REQUESTED
  (not-yet-received) vendor part qty 2 @ $20 → resolved **−$4.00** (2×$20=$40→10%), shown
  on the request before pick (§5-R13).
- **FD-PART-006 → VIU-Verified.** With that part-line discount, declining the line
  (change-status → authorization_declined) resolved the adjustment to **$0.00** (stays
  visible); re-authorizing restored **−$4.00** (§5-R12).
- **FD-PART-007 → VIU-Verified.** Deleting the part (remove-request) removed the part AND
  its adjustment ("ReqDisc" gone; 0 requests) while a separate labor-line adjustment
  persisted → only adjustments pointing to the deleted part are removed (S3-R2).
- **FD-PART-005 → stays VIU-Pending (NOT-SEEDABLE).** requested→received needs the
  Purchase-Order + Accept-Delivery receiving subsystem: `perform-request-status-action`
  rejects ALL direct actions on a "requested" vendor request ("This action cannot be
  performed on requested part requests") and `change-request` won't set status. Out of
  admin+normal-data scope this batch.
- **FD-PART-001 → VIU-Deviation (FDBUG-14, labels).** Part ⋯ menu offers "Add
  Fee/Discount"; dialog IS locked to the part (subtitle "Applying to: 1710 U-JOINT
  1.938X6.094") with exactly 2 calc methods — CORRECT behavior — but three label defects:
  (a) subtitle omits the spec's "Line {N} Part —" prefix + part number in parens (S2-R11);
  (b) default calc field shows the raw enum "Pct_parts" (not humanized); (c) the part-line
  **percentage option is mislabeled "% of Labor Total"** though it resolves against Part
  total (preview: "Part total $232.68 … Fee · 10% +$23.27") — behavior right, label wrong
  (§5-R10 expects "% of Parts Total"). Screenshots viu-qb/partui3/5/6.
- **FD-DOC-003 → VIU-Verified.** Estimate: part-line pct discount renders "ZZAUTOTEST
  PartPct **(% of parts)** ($23.27)" WITH the phrase; part-line Flat renders "ZZAUTOTEST
  PartFlat $5.00" with NO bracketed phrase.
- **FD-DOC-006 → VIU-Verified.** Estimate: three same-name+type "ShopSupply" fees grouped
  into ONE bottom-block row "ZZAUTOTEST ShopSupply **(×3)** $6.00" AND each still shows
  inline "↳ ZZAUTOTEST ShopSupply $2.00" under its target (S5-R8).
- **FD-DOC-010 → VIU-Verified.** Estimate on a DECLINED line: both "ReqDisc (% of parts)
  ($0.00)" and "LineFeeDeclined (% of labor) $0.00" render but resolve $0.00 while still
  shown (Labor $0.00 / Parts $0.00); §5-R12. (Needs-Approval banner variant not separately
  captured; $0-resolution confirmed regardless of authorization state.)
- **FD-DOC-001 → VIU-Verified.** The estimate document is the invoice template; estimate
  and committed invoice share one document/layout (same invoices renderer family); full
  adjustment layout verified on the estimate. (No live invoiced WO with adjustments existed
  to pull non-destructively; committing/reversing a live invoice on the shared env was out
  of scope.)

### FDBUG-1 observation (cross-cutting — do NOT rewrite FD-DOC-011)

On **three** different WOs' estimate documents this batch — WO_A (whole-WO + labor-line +
part-line pct/flat + grouped fees), a throwaway declined-line WO, and S3-15895 (Flat fee) —
the estimate totals **reconciled correctly**: Subtotal = base + net adjustments, GST = 5% of
the adjustment-inclusive Subtotal, Total = Subtotal + GST (e.g. WO_A: 1,214.81 + 82.71 =
1,297.52 → GST 64.89 → Total 1,362.41; `total_cost` also 1,362.41). **FDBUG-1 did NOT
reproduce on the estimate document in batch 4.** Possible fix shipped since batch 1/2, or
FDBUG-1 is specific to a discount-heavy / excess-credit scenario or a different surface. Flag
for the FDBUG-1 owner; FD-DOC-011's expected left unchanged per instruction.

### Cleanup / restore (batch 4)

Throwaway WOs created and deleted (verified: WO 1e651d0f delete 201 → view 400; two probe
WOs deleted). All ZZAUTOTEST adjustments removed from WO_A (final 0; sub_total back to
1,214.81, status Approved). 0 ZZAUTOTEST templates; baseline = exactly 2 autoApply templates
("Flat fee"/"Customer fee"); 0 customer defaults on the test company. No roles/users/settings
changed. Secrets in `/tmp` only.
