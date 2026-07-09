# TestRail update log — Custom Roles bug-guards C26569–C26573 → assert CASCADE

**Date:** 2026-07-09
**Authorization:** user-approved TestRail WRITE (this specific task).
**Scope:** ONLY case_ids 26569, 26570, 26571, 26572, 26573. No runs/results/other
cases created, updated, or deleted.
**Source of the fix:** `build/random-tasks/customroles-role-api-cascade.md` —
verified on staging that role create (`POST /api/roles`) and update
(`PUT /api/roles/{id}`) now **auto-cascade parent permissions server-side**
(does NOT return 400, does NOT persist invalid bundles verbatim).
**Method:** `GET get_case` → `POST update_case` → re-`GET get_case` to confirm.
All fields changed = `title`, `custom_steps` (added a fetch-back step), and
`custom_expected`. Section (3554), template (1), type (6 = Other), priority, and
refs were left untouched.

**Endpoint note:** all 5 cases already used the correct `POST /api/roles`
endpoint in their steps — no `/organizations/{id}/roles` correction was needed.

**Verified-scope caveat:** the verified probes in the source doc cover the
**Work Orders** area only (createEdit⇒view, delete⇒createEdit⇒view, WO sub-toggle
⇒workOrdersView). C26569–C26573 exercise **other** areas (Schedule, Customers,
Part Sales, Invoicing, and the See-Financial-Data / Parts-Department gates). Per
task instruction, the general cascade rule (child ⇒ its parents auto-added) was
applied to these by extension and the extrapolation is flagged per case below.
None of these cases matched the "assert 400" wording *in their steps*; the 400
assertion lived entirely in the `custom_expected` (and the "BE rejects…" titles),
both of which were rewritten.

---

## C26569 — Edit but no View (Schedule area)

- **Combo POSTed:** `['SCHEDULE_EDIT']` (Edit present, View absent).
- **Old title:** "BE rejects role create with Edit but no View (cascade integrity)"
- **Old expected (summary):** Status 400. Body identifies the cascade violation
  (Schedule Edit without Schedule View). Role NOT created.
- **New title:** "BE cascades role create with Edit but no View (cascade integrity)"
- **New expected:** 201 Created (NOT 400); SCHEDULE_VIEW auto-added alongside
  SCHEDULE_EDIT (Edit ⇒ View); fetch-back shows SCHEDULE_EDIT + SCHEDULE_VIEW;
  Edit-only bundle NOT persisted verbatim.
- **Cascade basis:** matches verified WO pattern (a) createEdit⇒view, applied to
  the Schedule area (extrapolated — not directly probed).
- **HTTP status:** update_case **200**. **Verified:** re-fetch shows new title +
  expected saved.

## C26570 — Delete but no Edit (Customers area)

- **Combo POSTed:** `['CUSTOMERS_VIEW', 'CUSTOMERS_DELETE']` (Delete present, Edit absent).
- **Old title:** "BE rejects role create with Delete but no Edit (cascade integrity)"
- **Old expected (summary):** Status 400. Body identifies cascade violation. Role NOT created.
- **New title:** "BE cascades role create with Delete but no Edit (cascade integrity)"
- **New expected:** 201 Created (NOT 400); CUSTOMERS_EDIT auto-added
  (Delete ⇒ Edit ⇒ View chain; View already present); fetch-back shows
  CUSTOMERS_VIEW + CUSTOMERS_EDIT + CUSTOMERS_DELETE; Delete-without-Edit bundle
  NOT persisted verbatim.
- **Cascade basis:** matches verified WO pattern (b) delete⇒createEdit⇒view,
  applied to the Customers area (extrapolated — not directly probed).
- **HTTP status:** update_case **200**. **Verified:** re-fetch confirms saved.

## C26571 — PART_SALES_* without SEE_FINANCIAL_DATA

- **Combo POSTed:** `['PARTS_DEPARTMENT', 'PART_SALES_VIEW']`, no SEE_FINANCIAL_DATA.
- **Old title:** "BE rejects PART_SALES_* without SEE_FINANCIAL_DATA"
- **Old expected (summary):** Status 400. Body identifies missing
  SEE_FINANCIAL_DATA dependency. Role NOT created.
- **New title:** "BE cascades PART_SALES_* dependency on SEE_FINANCIAL_DATA"
- **New expected:** 201 Created (NOT 400); SEE_FINANCIAL_DATA auto-added alongside
  PART_SALES_VIEW; fetch-back shows PART_SALES_VIEW + SEE_FINANCIAL_DATA +
  PARTS_DEPARTMENT; incomplete bundle NOT persisted verbatim.
- **Cascade basis:** EXTRAPOLATED. This is a cross-toggle / financial-data
  *dependency*, not a WO CRUD/sub-toggle chain, and was NOT among the verified
  probes. Cascade wording applied per the general rule; **re-verify** the
  SEE_FINANCIAL_DATA cascade for the Parts area before relying on it.
- **HTTP status:** update_case **200**. **Verified:** re-fetch confirms saved.

## C26572 — INVOICING_* without SEE_FINANCIAL_DATA

- **Combo POSTed:** `['INVOICING_VIEW']`, no SEE_FINANCIAL_DATA.
- **Old title:** "BE rejects INVOICING_* without SEE_FINANCIAL_DATA"
- **Old expected (summary):** Status 400. Body identifies the missing dependency.
- **New title:** "BE cascades INVOICING_* dependency on SEE_FINANCIAL_DATA"
- **New expected:** 201 Created (NOT 400); SEE_FINANCIAL_DATA auto-added alongside
  INVOICING_VIEW; fetch-back shows INVOICING_VIEW + SEE_FINANCIAL_DATA;
  incomplete bundle NOT persisted verbatim.
- **Cascade basis:** EXTRAPOLATED. Same financial-data dependency caveat as
  C26571 — not directly probed; **re-verify** before relying on it.
- **HTTP status:** update_case **200**. **Verified:** re-fetch confirms saved.

## C26573 — Parts area bundle without PARTS_DEPARTMENT parent gate

- **Combo POSTed:** `['SEE_FINANCIAL_DATA', 'PART_SALES_VIEW']`, no PARTS_DEPARTMENT.
- **Old title:** "BE rejects Parts area bundles without PARTS_DEPARTMENT parent gate"
- **Old expected (summary):** Status 400. Body identifies missing PARTS_DEPARTMENT
  parent gate.
- **New title:** "BE cascades Parts area bundles to the PARTS_DEPARTMENT parent gate"
- **New expected:** 201 Created (NOT 400); PARTS_DEPARTMENT area gate auto-added
  for PART_SALES_VIEW; fetch-back shows PART_SALES_VIEW + SEE_FINANCIAL_DATA +
  PARTS_DEPARTMENT parent gate; incomplete bundle NOT persisted verbatim.
- **Cascade basis:** EXTRAPOLATED + additional caveat. The source doc marks
  `PARTS_DEPARTMENT` as a **UI-only toggle with no fePermission bundle**
  ("Out of scope"), so whether the server materializes it as a persisted gate on
  cascade is uncertain. Cascade wording applied per the general rule; **re-verify**
  the PARTS_DEPARTMENT gate behavior specifically.
- **HTTP status:** update_case **200**. **Verified:** re-fetch confirms saved.

---

## Result summary

| Case | update_case HTTP | Re-fetch verified | Cascade basis |
|------|------------------|-------------------|---------------|
| 26569 | 200 | yes | verified WO pattern (a), extrapolated to Schedule |
| 26570 | 200 | yes | verified WO pattern (b), extrapolated to Customers |
| 26571 | 200 | yes | EXTRAPOLATED (fin-data dependency, re-verify) |
| 26572 | 200 | yes | EXTRAPOLATED (fin-data dependency, re-verify) |
| 26573 | 200 | yes | EXTRAPOLATED (UI-only PARTS_DEPARTMENT gate, re-verify) |

Only these 5 cases were touched. Section/type/refs unchanged. No runs, results,
or other cases were created, modified, or deleted.

---

## CORRECTION — C26571/72/73 re-verified live and rewritten to ACTUAL behavior

**Date:** 2026-07-09 (same-day follow-up). **Authorization:** user-approved
TestRail WRITE for these three cases. **Scope:** ONLY 26571, 26572, 26573.
26569/26570 (verified CRUD-cascade) were **left untouched**.

**Why:** the three cases above had been EXTRAPOLATED (assumed cascade) rather than
directly probed. Live re-verification on staging (probe
`/tmp/random-tasks/reverify-probe.mjs`; results in `reverify-results.json`) showed
the fin-data dependency and PARTS_DEPARTMENT gate behave DIFFERENTLY from the WO
CRUD chain — they do NOT cascade. The earlier "cascade" wording was wrong and has
been corrected to the actual behavior.

**Actual probe results (all POST /api/roles as org admin):**
- C26571 `fe:[partSalesView]`, `ct.seeFinancialData:false` → **201**, fetch-back
  persisted `[partSalesView]`, `seeFinancialData` stayed **false** → **VERBATIM**
  (no cascade, no 400).
- C26572 `fe:[invoicingPaymentsView]`, `ct.seeFinancialData:false` → **201**,
  fetch-back persisted `[invoicingPaymentsView]`, `seeFinancialData` stayed
  **false** → **VERBATIM** (no cascade, no 400).
- C26573 `fe:[partSalesView]`, `ct.seeFinancialData:true` → **201**, fetch-back
  `[partSalesView, seeFinancialData]`. `GET /api/fe-permissions` = 42 codes, **no
  PARTS_DEPARTMENT** → gate is UI-only, not a settable fePermission → nothing to
  cascade → **out of scope**.

### C26571 — corrected (old cascade wording → verbatim/FE-only)
- **Old title:** "BE cascades PART_SALES_* dependency on SEE_FINANCIAL_DATA"
- **New title:** "BE persists PART_SALES view without See Financial Data (fin-data
  dependency NOT cascaded server-side)"
- **Old expected:** 201 + SEE_FINANCIAL_DATA auto-added (cascade).
- **New expected:** 201; seeFinancialData NOT auto-added (stays false); bundle
  persists VERBATIM; no cascade, no 400. NOTE added that See-Financial-Data is a
  FE-only display gate, unlike the WO CRUD chain.
- Steps clarified that seeFinancialData is a cross_toggle boolean, not an fePermission.
- **update_case HTTP 200; re-fetch confirmed.**

### C26572 — corrected (old cascade wording → verbatim/FE-only)
- **Old title:** "BE cascades INVOICING_* dependency on SEE_FINANCIAL_DATA"
- **New title:** "BE persists INVOICING view without See Financial Data (fin-data
  dependency NOT cascaded server-side)"
- **Old expected:** 201 + SEE_FINANCIAL_DATA auto-added (cascade).
- **New expected:** 201; seeFinancialData NOT auto-added (stays false); bundle
  persists VERBATIM; no cascade, no 400. Same FE-only note.
- **update_case HTTP 200; re-fetch confirmed.**

### C26573 — corrected (old cascade wording → out-of-scope UI-only gate)
- **Old title:** "BE cascades Parts area bundles to the PARTS_DEPARTMENT parent gate"
- **New title:** "PARTS_DEPARTMENT is a UI-only gate - not exercisable as a
  server-side fePermission cascade (out of scope)"
- **Old expected:** 201 + PARTS_DEPARTMENT auto-added (cascade).
- **New expected:** PARTS_DEPARTMENT confirmed absent from GET /api/fe-permissions
  (UI-only); POST returns 201 and persists verbatim; no PARTS_DEPARTMENT
  materializes; scenario CANNOT be a server-side cascade → out of scope per the
  ticket's own note.
- **update_case HTTP 200; re-fetch confirmed.**

### Corrected-scope summary

| Case | Old assertion | Actual behavior (verified) | New assertion |
|------|---------------|----------------------------|---------------|
| 26571 | cascade (SFD auto-added) | VERBATIM, SFD stays false, 201 | persists verbatim, FE-only gate |
| 26572 | cascade (SFD auto-added) | VERBATIM, SFD stays false, 201 | persists verbatim, FE-only gate |
| 26573 | cascade (PARTS_DEPARTMENT added) | no such fePermission; 201 verbatim | out of scope, UI-only gate |

Only 26571/26572/26573 touched in this correction. 26569/26570 unchanged. No runs,
results, or other cases created/modified/deleted. 3 probe roles created and all
deleted (0 ZZAUTOTEST remaining).
