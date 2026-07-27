# "Are there more?" sweep — LIVE page-load + network capture (2026-07-27)

Method: impersonate a role (atoms confirmed live), load the page in Chromium, record final URL +
every /api response status. A regression = page loads in FE but a background call 403s → redirect to
/access-denied (the SV-8701 lockout pattern), OR a broken dependency 403 (the SV-8682 pattern).
"Zero 4xx + stays on page" = NO lockout.

## Role: VOM View + See Financial Data, Reports OFF  (the SV-8682 config) — on vehicle staff
| Page (route) | Final URL | Any 4xx? | Verdict |
|---|---|---|---|
| Parts → Vendors (/parts/vendors)            | /parts/vendors            | NONE | LOADS (SV-8682 NOT reproduced) |
| Parts → Purchase Orders (/parts/orders)     | /parts/orders             | NONE | LOADS — no lockout |
| Parts → Deliveries (/parts/deliveries)      | /parts/deliveries         | NONE | LOADS — no lockout |
| Parts → Vendor Invoices (/parts/vendor-invoices) | /parts/vendor-invoices | NONE | LOADS — no lockout |
| Parts → Returns (/parts/returns)            | /parts/returns            | NONE | LOADS — no lockout |

## Role: Customers C&E + SFD + Manage AP/AR (the SV-8701 positive config)
| Page | Final URL | Any 4xx? | Verdict |
|---|---|---|---|
| Customer detail (/customers/{id}) | /customers/{id}/work-orders | NONE | LOADS (SV-8701 FIXED — no /access-denied) |

## Role: Customers C&E + SFD, NO Manage AP/AR (the SV-8701 negative config)
| Page | Final URL | Any 4xx? | Verdict |
|---|---|---|---|
| Customer detail (/customers/{id}) | /customers/{id}/work-orders | NONE | LOADS — FE correctly skips default-adjustments fetch, no lockout |

## Bottom line so far
No FE-allows/BE-blocks whole-page lockout and no broken-dependency 403 found in the Parts/vendor
area (5 pages) or the customer-detail area (2 configs) for the v0.68/v0.69-affected permission
combos tested. The two known page-lockout regressions (SV-8682, SV-8701) do NOT reproduce on the
current staging build.
