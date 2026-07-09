# FD-SEC-001 — Cross-tenant isolation: fees/discounts from one organization are never visible or usable in another

> **PROPOSED case (not yet in `cases/*.json`)** — authored 2026-07-09 from the
> v1 closeout reconciliation (`spec-v1-reconciliation.md` §5 group F): the epic
> lists cross-tenant isolation as shipped, but no existing case covers it.
> **Do not merge into `cases/*.json` while the VIU worker owns that directory** —
> fold it in during the finalization pass.
>
> **TestRail placement (standing rule 4):** the Expected results assert API
> responses/status codes, so this case MUST go in an **API-titled section**
> (e.g. "API — Fees & Discounts — Security / cross-tenant") under the F&D parent
> section 3894.

**Title:** Fees & Discounts templates, customer defaults and work-order
adjustments belong to one organization only and can never be seen or used from
another organization

**Priority:** High

**Type:** Security / Negative

## Preconditions

1. Two separate organizations (tenants) exist on the environment: Organization A
   and Organization B, each with its own admin login.
2. The Fees & Discounts feature is turned on for both organizations.
3. In Organization A, an admin has created at least one fee template and one
   discount template (name them clearly, e.g. "ZZAUTOTEST OrgA Fee" /
   "ZZAUTOTEST OrgA Discount").
4. In Organization A, at least one customer has one of those templates set as a
   customer default.
5. In Organization A, at least one work order exists carrying an adjustment
   (fee or discount) created from one of those templates.
6. In Organization B, at least one open work order and one customer exist (seed
   them if missing; tag throwaway data ZZAUTOTEST).

## Steps

1. Sign in to Organization B as an admin.
2. Open the fee/discount templates admin screen (Settings → Finance →
   fees/discounts templates) and read the full list of templates.
3. Open the "Add Fee/Discount" dialog on Organization B's work order and read
   the template picker list.
4. Open Organization B's customer → Fees & Discounts (defaults) screen and read
   the template dropdown.
5. While signed in to Organization B, call the templates list API
   (GET /api/adjustment-templates) and inspect the returned templates.
6. While signed in to Organization B, try to read one of Organization A's
   template records directly by its id (GET on the template id captured from
   Organization A).
7. While signed in to Organization B, try to apply Organization A's template to
   Organization B's work order via the API
   (POST /api/work-orders/adjustments/add with Organization A's templateId and
   Organization B's workOrderId).
8. While signed in to Organization B, try to set Organization A's template as a
   default for Organization B's customer
   (POST /api/customers/{companyId}/default-adjustments with Organization A's
   templateId).
9. While signed in to Organization B, try to read Organization A's work order
   (the one carrying the adjustment) by its id (GET /api/work-orders/view/{id}).
10. Sign in to Organization A and confirm its templates, customer default and
    work-order adjustment are unchanged.
11. Clean up any ZZAUTOTEST data created in either organization.

## Expected

1. Organization B's templates admin screen does NOT list any Organization A
   template (steps 2–4: no "ZZAUTOTEST OrgA …" entries anywhere — admin list,
   WO add-dialog picker, customer-defaults dropdown).
2. The templates list API returns only Organization B's own templates (step 5);
   no Organization A template id or name appears in the response.
3. Reading Organization A's template by id from Organization B is refused
   (step 6): 403 or 404 — never 200 with Organization A's data.
4. Applying Organization A's template to Organization B's work order is refused
   (step 7): 403/404/422 — no adjustment is created; Organization B's work
   order totals are unchanged.
5. Setting Organization A's template as a default for Organization B's customer
   is refused (step 8): 403/404/422 — no default row is created.
6. Reading Organization A's work order from Organization B is refused (step 9):
   403 or 404.
7. Organization A's data is fully intact afterwards (step 10): its templates,
   customer default, and work-order adjustment are unchanged, and nothing from
   Organization B appears in Organization A.
