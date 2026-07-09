# Custom Roles — Role-API permission parent-gate / CRUD-cascade enforcement

**Ticket:** parent Epic **SV-7388** (Custom Roles & Permissions). Specific bug key = **TBD** (not supplied; note it when filed). Related E2E bug-guards: **C26569–C26573**.
**Type:** Backend bug re-verification (does the role create/update API enforce the permission parent-gate / CRUD-cascade rules server-side?).
**Env:** STAGING — app `https://app.staging.shopview.com`, API `https://api.staging.shopview.com`. Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (confirmed live). Auth: dev quick-login `{key:'admin'}` (org admin) gated by the SV-8182 staging cookie set — **auth OK** (LOGIN 200 / calls 200).
**Date:** 2026-07-09.

## The bug (as ticketed)
- Endpoint (ticketed): `POST` (create) / `PUT` (update) `/api/organizations/{orgId}/roles`.
- BUG (actual, reported): API returns **201 and persists invalid bundles verbatim** — a child without its parent (`workOrdersCreateAndEdit` without `workOrdersView`), `workOrdersDelete` without createEdit/view, or a parent-gated sub-toggle (`woReviewWorkOrders` / `woPickParts` / `woOrderParts`) with no parent WO area — no cascade, no 400.
- EXPECTED (fix — EITHER contract acceptable): API should **auto-CASCADE** (granting a child auto-includes its parents: delete⇒createEdit⇒view) **OR REJECT with 400**.
- Out of scope: `PARTS_DEPARTMENT` (UI-only toggle, no fePermission bundle).

## Endpoint correction (important)
The ticket names `POST/PUT /api/organizations/{orgId}/roles`, but that route is **GET-only** — `POST` there returns **405 Method Not Allowed (Allow: GET)**. The real role create/update endpoints are:
- Create: `POST /api/roles`
- Update: `PUT /api/roles/{id}`
- Delete: `DELETE /api/roles/{id}` (204)
- Read: `GET /api/organizations/{orgId}/roles` (list) · `GET /api/roles/{id}` (detail, returns `fe_permissions[]`)
- Permission catalog (code→id map): `GET /api/fe-permissions`

Valid create/update payload shape:
```
{ "name": "...", "description": "...", "organization": "<orgId>",
  "cross_toggles": { "seeFinancialData": false, "seeApArData": false, "viewHistoryLogs": false },
  "fe_permissions": [ "<permissionId>", ... ] }   // ids, not codes
```
(`description` is required on PUT; `cross_toggles` must be the object with those three keys.)

## Probes run (each: POST/PUT the bundle → record HTTP status → GET the role back → record persisted permissions)

| # | Scenario | Method | Sent fePermissions | HTTP status | Persisted on fetch-back | Outcome |
|---|----------|--------|--------------------|-------------|-------------------------|---------|
| a | child without parent | POST | `workOrdersCreateAndEdit` | **201** | `workOrdersCreateAndEdit`, **`workOrdersView`** | **AUTO-CASCADED** (parent added) |
| b | delete without createEdit/view | POST | `workOrdersDelete` | **201** | `workOrdersDelete`, **`workOrdersCreateAndEdit`**, **`workOrdersView`** | **AUTO-CASCADED** (full chain added) |
| c | gated sub-toggle, no parent area | POST | `woOrderParts` | **201** | `woOrderParts`, **`workOrdersView`** | **AUTO-CASCADED** (parent WO area added) |
| c2 | gated sub-toggle, no parent area | POST | `woPickParts` | **201** | `woPickParts`, **`workOrdersView`** | **AUTO-CASCADED** (parent WO area added) |
| d | update: create valid then drop parent | PUT | `workOrdersCreateAndEdit` (dropped `workOrdersView`) | **200** | `workOrdersCreateAndEdit`, **`workOrdersView`** | **AUTO-CASCADED** (view re-added) |
| d2 | update: sub-toggle only | PUT | `woOrderParts` | **200** | `woOrderParts`, **`workOrdersView`** | **AUTO-CASCADED** (parent WO area added) |

In every case the fetch-back showed the parent(s) **auto-added**. In NO case did the API persist the invalid bundle verbatim, and in NO case did it return 400 for the missing parent.

## Verdict

**FIXED — by CASCADE (not by reject).**

The original bug (201 + invalid bundle persisted verbatim) **does NOT reproduce**. The API now **auto-cascades parents server-side** on both **create (`POST /api/roles`)** and **update (`PUT /api/roles/{id}`)**:
- child ⇒ its View parent is added (`workOrdersCreateAndEdit` ⇒ `workOrdersView`);
- `workOrdersDelete` ⇒ `workOrdersCreateAndEdit` ⇒ `workOrdersView` (full chain);
- a parent-gated WO sub-toggle (`woOrderParts` / `woPickParts`) ⇒ its parent WO area (`workOrdersView`) is added.

This satisfies the ticket's accepted fix contract (EITHER cascade OR reject → cascade was chosen). Behavior is **consistent across create and update**.

### Note for the E2E bug-guards C26569–C26573
Those guards assert **400 (reject)**. They will stay **red** — but **not because the bug is unfixed**. The backend implemented the **cascade** branch of the accepted contract instead of the **reject** branch, so a 201-with-parents-added is now correct. The guards should be **updated to assert the cascade outcome** (201 + parent(s) present on fetch-back) rather than a 400, OR the product decision to cascade-vs-reject should be reconfirmed and the guards realigned. This is a test-expectation mismatch, not a live defect.

## Safety / cleanup
All probe roles were named `ZZAUTOTEST …`. All **6** created roles were deleted (`DELETE /api/roles/{id}` → 204) and a follow-up list confirmed **0 `ZZAUTOTEST` roles remaining**. No existing/real roles were modified; the PUT test used a role created by this run. Cookies were kept in `/tmp` only.

## Ready-to-post Jira comment

```
Re-verified on staging (build sv5319, org admin via API). Result: FIXED — by cascade.

The reported behaviour (create/update returning 201 and persisting an invalid
permission bundle verbatim) no longer reproduces. The role create and update APIs
now auto-cascade parent permissions on the server:

- Creating a role with "Work Orders: Create & Edit" but not "View" -> "View" is
  auto-added on save.
- Creating a role with "Work Orders: Delete" only -> "Create & Edit" and "View"
  are both auto-added (full chain).
- Creating a role with a Work-Order sub-toggle (e.g. Order Parts, Pick Parts) and
  no Work-Order area -> the Work-Order "View" area is auto-added.
- The same auto-cascade applies on update: removing "View" while keeping
  "Create & Edit" simply re-adds "View".

Verified across both create (POST) and update (PUT); in every case the saved role,
when fetched back, contained the required parent permissions. No invalid bundle was
ever persisted, and no 400 was returned.

This matches the accepted fix (cascade OR reject); the cascade path was implemented.

One follow-up for the automated bug-guards: they currently assert a 400 (reject
outcome). Since the fix took the cascade path instead, those checks should be
updated to assert the cascade result (save succeeds and the parent permissions are
present afterwards) rather than a rejection — otherwise they will report red even
though the behaviour is correct.

Verified on staging by QA.
```

## Re-verification (C26571/72/73)

**Date:** 2026-07-09. Same env/org/auth (LOGIN 200). These three combos had been
EXTRAPOLATED (not directly probed) in the first pass, so they were re-verified live
because they rely on DIFFERENT mechanisms than the WO CRUD parent chain: the
**See-Financial-Data cross-toggle dependency** and the **PARTS_DEPARTMENT gate**.

**Key mechanism fact confirmed:** `seeFinancialData` / `seeApArData` /
`viewHistoryLogs` are **cross_toggles (booleans)**, NOT fePermission ids. And
`GET /api/fe-permissions` returns **42 codes** with **NO `PARTS_DEPARTMENT`** (nor
any parts-department) code — confirming PARTS_DEPARTMENT is UI-only with no
fePermission bundle. Part-related codes present: partSalesView/CreateAndEdit/Delete,
settingsParts, woOrderParts, woPickParts.

| Combo | Sent | HTTP | Persisted (fetch-back) | Outcome |
|-------|------|------|------------------------|---------|
| C26571 part-sales view, NO SFD | fe:`[partSalesView]`, ct:`{seeFinancialData:false}` | **201** | fe:`[partSalesView]`; ct:`{seeFinancialData:false}` | **VERBATIM — no cascade, no 400.** seeFinancialData NOT auto-added |
| C26572 invoicing view, NO SFD | fe:`[invoicingPaymentsView]`, ct:`{seeFinancialData:false}` | **201** | fe:`[invoicingPaymentsView]`; ct:`{seeFinancialData:false}` | **VERBATIM — no cascade, no 400.** seeFinancialData NOT auto-added |
| C26573 part-sales + SFD, NO PARTS_DEPARTMENT | fe:`[partSalesView]`, ct:`{seeFinancialData:true}` | **201** | fe:`[partSalesView, seeFinancialData]`; ct:`{seeFinancialData:true}` | **VERBATIM.** PARTS_DEPARTMENT is not a settable fePermission → nothing to cascade → **out of scope** as a BE cascade |

(Note: when `seeFinancialData` is `true` it surfaces in the role detail's
`fe_permissions[]` list AND in `cross_toggles`; when `false` it appears in neither
fe list. It is set/read via `cross_toggles`, not as an fePermission id.)

### Verdict for these three (DIFFERENT from the WO story)
The **See-Financial-Data dependency does NOT cascade or 400 server-side** for either
Part Sales (C26571) or Invoicing (C26572) — the bundle persists verbatim and the
toggle is a **FE-only display gate**. This is the OPPOSITE of the WO CRUD parent
chain (which DOES auto-cascade). The first-pass extrapolation (that these would
cascade like WO) was **WRONG** and has been corrected. **PARTS_DEPARTMENT** (C26573)
has no fePermission bundle at all (UI-only), so it cannot be exercised as a
server-side cascade — the case was rewritten to out-of-scope.

### Safety / cleanup (re-verify pass)
3 probe roles created (`ZZAUTOTEST reverify 26571/26572/26573`), all deleted
(`DELETE /api/roles/{id}` → 204), follow-up list confirmed **0 ZZAUTOTEST roles
remaining**. No real roles touched. Cookies `/tmp` only.

### Updated note for the Jira/ticket comment (fin-data & parts-department differ)
```
Correction to the earlier cascade write-up: the See-Financial-Data dependency does
NOT behave like the Work-Order CRUD chain. Re-verified on staging 2026-07-09:
creating a role with Part Sales view (C26571) or Invoicing view (C26572) but WITHOUT
See Financial Data returns 201 and persists the bundle verbatim — See Financial Data
is NOT auto-added and there is no 400. That dependency is a front-end display gate
only, not enforced/cascaded server-side. PARTS_DEPARTMENT (C26573) is not a settable
fePermission (absent from GET /api/fe-permissions), so it cannot be exercised as a
server-side cascade at all (UI-only gate, out of scope). Only the WO CRUD parent
chain (create/edit/delete/view) cascades server-side.
```

## Re-verification (C26569 Schedule / C26570 Customers) — last loose end

**Date:** 2026-07-09. Same env/org/auth (LOGIN 200). These two guards had their
assertions set to the CRUD-cascade outcome by **extrapolation** from the verified
Work-Orders cascade (probes a/b above), never probed directly. Verified LIVE now.

**Codes confirmed** from `GET /api/fe-permissions` (42-code catalog): Schedule =
`scheduleView` / `scheduleCreateAndEdit` / `scheduleDelete`; Customers =
`customersView` / `customersCreateAndEdit` / `customersDelete`.

| Case | Scenario | Method | Sent fePermissions | HTTP | Persisted on fetch-back | Outcome |
|------|----------|--------|--------------------|------|-------------------------|---------|
| C26569 | Schedule Edit without View | POST | `scheduleCreateAndEdit` | **201** | `scheduleCreateAndEdit`, **`scheduleView`** | **AUTO-CASCADED** (View parent added) |
| C26570 | Customers Delete only (no edit/view) | POST | `customersDelete` | **201** | `customersDelete`, **`customersCreateAndEdit`**, **`customersView`** | **AUTO-CASCADED** (full chain added) |

### Verdict
Both Schedule and Customers behave **identically to the Work-Orders CRUD chain** —
the backend **auto-cascades parents server-side** on create (`POST /api/roles`):
child ⇒ its View parent (`scheduleCreateAndEdit` ⇒ `scheduleView`), and
`customersDelete` ⇒ `customersCreateAndEdit` ⇒ `customersView` (full chain). No
verbatim persistence, no 400. The extrapolation was **CORRECT**; both TestRail
cases (C26569, C26570) already assert cascade and match reality — **left as-is, no
correction needed**.

### Consolidated final status — all 5 guards (C26569–C26573)
- **C26569 Schedule** — asserts **CASCADE**; ✅ live-verified correct.
- **C26570 Customers** — asserts **CASCADE**; ✅ live-verified correct.
- **C26571 Part Sales + See-Financial-Data** — asserts **VERBATIM / FE-only gate**
  (SFD not cascaded); ✅ live-verified, corrected in prior pass.
- **C26572 Invoicing + See-Financial-Data** — asserts **VERBATIM / FE-only gate**;
  ✅ live-verified, corrected in prior pass.
- **C26573 PARTS_DEPARTMENT** — **OUT OF SCOPE** (UI-only, no fePermission bundle);
  ✅ rewritten in prior pass.

So: the **CRUD parent chains cascade server-side** (Work-Orders, Schedule,
Customers = C26569/C26570). The **cross-toggle dependencies do NOT cascade** (they
are FE-only display gates = C26571/C26572). **PARTS_DEPARTMENT** has no backend
cascade surface (C26573).

### Safety / cleanup (Schedule/Customers pass)
2 probe roles created (`ZZAUTOTEST reverify 26569/26570`), both deleted
(`DELETE /api/roles/{id}` → 204), follow-up list confirmed **0 ZZAUTOTEST roles
remaining**. No real roles touched. Cookies `/tmp` only.
