# Founder Mode → Part Sales — NAVIGATION MAP (observed, reusable — Rule 27)
# Env: sv9667.qa.shopview.com · build v26.39.2-210868d · first observed 2026-10-01
# PERMANENT: every UI route + API endpoint goes here the moment it is confirmed live. Update in the same pass.

## ACCESS RECIPE (QA branch behind Cloudflare — 3 cookies)
- App https://sv9667.qa.shopview.com · API https://sv9667api.qa.shopview.com (no dot before "api").
- Cookies sv_sso_session + PHPSESSID + cf_clearance → /tmp/cln/sv9667-cookies.json (SECRET, /tmp, chmod 600).
  Boot: `node build/testing-tools/qa-branch-boot.mjs sv9667 <route> admin`; Chrome-131 UA; NODE_USE_ENV_PROXY=1;
  bridge via `source build/testing-tools/ensure_bridge.sh`.

## UI ROUTES
| What | Route | Notes | Evidence |
|---|---|---|---|
| Parts area | `/parts/inventory` (Parts top-nav) | sidebar: Part Sales / Inventory / Catalog / Returns / Purchase Orders / Vendor Invoices / Vendors | parts-area.txt |
| Part Sales LIST | `/parts/part-sales` (sidebar "Part Sales") | list + "New Part Sale" + Status filter; `?status=estimate&status=approved` default | part-sales-list.png |
| Part Sale DOCUMENT | `/parts/part-sale/<uuid>` (singular; open a row) | tabs Parts/Stats/Finance; Finance has Add Deposit, Create Invoice, Estimate/Invoice toggle | part-sale-doc.png, part-sale-finance.png |
| ❌ /part-sales, /partsales, /sales (top) | — | empty — Part Sales is under /parts | try-*.txt |
## API ENDPOINTS (host sv9667api.qa.shopview.com)
/api/auth/me/fe-permissions · GET /api/part-sales (list; ?limit=N; data.partSales[]) · part sale keys include
id/number(P9667-###? API)/status/totalPrice/partReturnRequestsCount. UI numbers show as P2-### (org data).
## BUILD GLOSSARY  (filled as discovered)
## STILL TO OBSERVE
# Part sale document (Finance tab, Parts section, Estimate/Invoice toggle) · Add Deposit dialog · core
# return/charge · tax rate change · audit log & menu order · sales representative · actions column · labels & tab bar.
