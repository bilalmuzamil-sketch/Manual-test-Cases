# SV-8701 — Custom Roles post-release regression ingest

- **Source (pointer only, do NOT fetch):** https://shopview.atlassian.net/browse/SV-8701
- **Ingested:** 2026-07-27 (REST v3, live Atlassian session)
- **Key / Type:** SV-8701 / Bug
- **Status:** **Done** (fix merged + staging-verified; prod deploy manual, still pending as of the comment)
- **Priority:** High
- **Reporter:** Vladimir Tomovic · **Assignee:** Stefan Vukovic
- **Created:** 2026-07-27 05:36 (-0500) · **Updated:** 2026-07-27 09:20 (-0500)
- **Parent/Epic:** (none)
- **Labels:** Prod_Verified, QAComplete_Viktoria_Videnovic, Staging_Verified · **Fix Versions:** **v0.69**
- **Links:** (none formal) — body references the **SV-7958 family** (Time Clock ROLE_REPORT_VIEW lockout, Done v0.65/v0.68) as the same lockout class.

## What broke (plain English)
When the **FeesAndDiscounts feature flag is ON**, a custom-role user who legitimately holds
**Customers Create & Edit + See Financial Data + Manage AP/AR** (and NO settings/organization
grants) is **fully locked out of every customer detail page** — a full-page "Access restricted".
They can't see work orders, payments, or invoices tabs. One background permission-count fetch
(GET /customers/{id}/default-adjustments) returns 403 and the global 403 handler redirects the
whole page to /access-denied.

- **Role/permission:** custom role with Customers Create & Edit (or higher) + See Financial Data ON + Manage AP/AR ON, no Settings/org grants.
- **Screen/action:** any customer detail page (/customers/{id}, any tab) while FeesAndDiscounts flag is ON.
- **Feature area:** Fees & Discounts customer default-adjustments endpoint permission gating (FE rule S13-R10 vs BE gate mismatch) — a **Custom Roles & Permissions** regression triggered by the Fees & Discounts flag rollout.

## Description (verbatim, HTML stripped)
Reported from the E2E stabilization campaign (E2E case C26423, P4 — red nightly). Only occurs while the FeesAndDiscounts feature flag is ON, so it will ship broader as the flag rolls out.

**Preconditions**
- Org has the FeesAndDiscounts feature flag enabled.
- A custom role with: Customers Create & Edit (or higher), See Financial Data ON, Manage AP/AR ON — and no Settings/organization grants.
- A user assigned that role.

**Steps**
1. Log in as that user.
2. Open any customer detail page (/customers/{id} — any tab).

**Expected result:** The customer page renders normally. The user holds every permission the FE's own rule (S13-R10: customers C&E + AP/AR + flag) requires for the Fees & Discounts data.

**Actual result:** Full-page "Access restricted" — the user cannot see ANY part of the customer detail (work orders, payments, invoices tabs all unreachable).

**Root cause (verified in source + network trace, 2026-07-26):** FE and BE disagree about who may call `GET /customers/{id}/default-adjustments`:
- FE (Customer.vue:565-580, loadDefaultAdjustmentsCount) fires the fetch on customer-detail load when `organizationHasFeature('FeesAndDiscounts') && canEdit('customers') && seeApArData()` — the S13-R10 rule.
- BE (ListCustomerDefaultAdjustmentsController.php:34) gates the endpoint on `ROLE_ORGANIZATION_VIEW` — an organization/settings-tier grant that customer-focused custom roles do not hold.
The role passes the FE check, the fetch fires, the BE replies 403 — and although loadDefaultAdjustmentsCount swallows its own error, the global axios interceptor navigates to /access-denied on any 403 before the local catch can keep the page alive. One background count-fetch kills the whole page. Same lockout class as the punch-clock ROLE_REPORT_VIEW bug (SV-7958 family).

**Evidence:**
- Playwright trace (C26423, 2026-07-26): exactly ONE 4xx during page load — 403 GET /customers/{id}/default-adjustments — followed by the Access-restricted render.
- Injected FE permission set verified complete: customersCreateAndEdit, customersDelete, customersView, invoicingPaymentsCreateAndEdit, invoicingPaymentsView, seeApArData, seeFinancialData, woFullViewMode, workOrdersView; cross_toggles: {seeFinancialData:true, seeApArData:true}.
- The intermittent E2E red is explained by flag state: another spec enables FeesAndDiscounts on the shared org mid-run, after which every C26423 run hits the lockout.

**Suggested fix (either side resolves it):** BE — align the endpoint's gate with S13-R10 (customers C&E + AP/AR) instead of ROLE_ORGANIZATION_VIEW; or FE — gate loadDefaultAdjustmentsCount on what the BE actually requires (and/or exempt background count fetches from the interceptor's AccessDenied navigation).

**QA note:** E2E C26423 stays deliberately red until this is fixed — masking it by granting the role an unrelated ROLE_ORGANIZATION_VIEW bundle would hide the lockout.

## Comments (1)
1. **Stefan Vukovic @ 2026-07-27 07:28 (-0500):** "Fix merged to main — PR #2363. Deployed to staging — testable there now. Prod deploy is manual and still pending. What was fixed: all three /customers/{id}/default-adjustments endpoints (list/link/unlink) were gated on organization/settings-tier permissions instead of the spec rule (S13-R9 in the current spec revision: Customers Create & Edit + Manage AP/AR). The BE gate now matches the FE, so the background fetch no longer 403s and the customer page no longer redirects to Access Denied.
   **QA steps (staging):** Preconditions: org with FeesAndDiscounts flag ON; custom role with Customers Create & Edit, See Financial Data ON, Manage AP/AR ON, no Settings/org grants; a user with that role.
   1. Log in, open any customer detail page → renders normally, all tabs reachable — no Access restricted.
   2. Open the Fees & Discounts tab → list loads; add a default fee/discount, then remove it → both succeed.
   3. Negative: same role but Manage AP/AR OFF → tab is hidden, customer page still loads fine.
   4. Regression: admin/owner → customer F&D tab and Administration → Fees & Discounts templates page work as before.
   E2E C26423 should go green on the next nightly after deploy. Note: this widens API access to customer default-adjustments to customer-facing roles per spec (verified against prod role data: no existing role loses UI access)."

## Attachments
(none)
