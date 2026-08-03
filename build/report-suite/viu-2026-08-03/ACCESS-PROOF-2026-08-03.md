# Report Suite — QA-branch live access PROOF (2026-08-03)

> **Purpose:** prove, with live evidence, that the Report Suite QA branch is reachable and
> authenticating, and record every durable environment fact so no later pass re-discovers it
> (CLAUDE.md Standing Rule 27). **No secrets in this file** — cookie VALUES live only in
> `/tmp/report-suite-viu/cookies.json` (chmod 600) and are never committed.

---

## 1. VERDICT — ACCESS WORKS

| Check | Result | Evidence |
|---|---|---|
| App host reachable | **PASS** — `HTTP 200`, `text/html` | `curl https://sv8582.qa.shopview.com/` |
| API host reachable | **PASS** — `HTTP 200`, `application/json`, body `{"data":[]}` | `curl https://sv8582api.qa.shopview.com/` |
| API host naming convention | **CONFIRMED** — `sv8582api.qa.shopview.com` (no dot before "api", same as `sv7301api`) | probed both, only this form answers JSON |
| Session authenticates | **PASS** — `POST /api/quick-login {"key":"admin"}` → **HTTP 200**, fresh `PHPSESSID` set | `evidence/api/quick-login-admin.json` |
| Authenticated user | `admin@shopview.com`, user id `0eabf741-019e-4b02-84ce-66097c140b3a` | quick-login response |
| Permissions read | **PASS** — `GET /api/auth/me/fe-permissions` → **200**, 42 atoms, `view_mode: full`, `template_slug: administrator`, `system_role: true` | `evidence/api/fe-permissions-admin.json` |
| `reportsPageAccess` held | **YES** (present in the 42 atoms) | same |
| SPA hydrates + renders | **PASS** — boot2-pattern hydration renders the full app shell and the reports side-nav | `evidence/nav-reports-sidebar.png` |
| All six reports reachable | **PASS** — all six routes present in the live nav | `evidence/nav-map.json` |

## 2. COOKIE-NAME MAPPING (worked out by shape, then PROVEN by a 200)

The three supplied values were unlabelled. Mapping resolved and verified — the trio below
produced a **200** on `quick-login`; the mapping is therefore proven, not assumed.

| Shape supplied | Cookie name | Why |
|---|---|---|
| 64-hex | `sv_sso_session` | recorded `.qa.shopview.com` SSO session shape |
| 32-hex | `PHPSESSID` | PHP session id length |
| long dotted Cloudflare token | `cf_clearance` | Cloudflare clearance token shape |

Domain: `.qa.shopview.com`. Stored **only** at `/tmp/report-suite-viu/cookies.json` (`chmod 600`).
**Lifetime ~24h** (the `Set-Cookie` on this branch carries `Max-Age=86400`) — first proven
`2026-08-03 ~18:13 UTC`, so expect expiry around `2026-08-04 18:00 UTC` or on the next deploy.

## 3. BUILD MARKER (Rule 49 — the non-final build must be identifiable)

| Marker | Value |
|---|---|
| **App version (authoritative)** | **`v3.4.1-0ed4433`** — `<meta name="app-version">` in the SPA's `index.html` |
| index.html `last-modified` | `Mon, 03 Aug 2026 13:40:38 GMT` |
| index.html `etag` | `02091e9dc11f187d7739b4efa166ea21` |
| API server | `nginx/1.30.4`, `PHP/8.5.7` |
| Captured at | `2026-08-03 18:17 UTC` |

Re-read the marker with:
`curl -s https://sv8582.qa.shopview.com/ | grep app-version`

## 4. FEATURE-FLAG / SETTINGS STATE (Rule 22 — the flag state is an environment fact)

**There is NO feature flag for the Report Suite.** The full flag catalogue on this branch
(`GET /api/feature-flags`, 13 flags) contains **no** `Reports`, `ReportSuite`, `ReportsSuite`
or similarly named entry, and all six reports render in the nav unflagged.

- **Catalogue (13):** PartSales · ShopPay · DashboardAdministrator · FeesAndDiscounts ·
  DigitalInspections · openapi · Dashboards · ShopCoachWOReview · QuickBooks ·
  CustomerPortalServiceAdvisorNoReportsAccess · LateFeesMvp · ShopCoach · ShopCoachStory
- **ENABLED for this org** (`GET /api/organization/feature-flags?organization_id=<org>`, 9):
  PartSales · ShopPay · DashboardAdministrator · DigitalInspections · ShopCoachWOReview ·
  QuickBooks · LateFeesMvp · ShopCoach · ShopCoachStory
- **NOT enabled:** FeesAndDiscounts · openapi · Dashboards ·
  CustomerPortalServiceAdvisorNoReportsAccess

Consequence for authoring: the Report Suite cases correctly carry **no** feature-flag
precondition. `CustomerPortalServiceAdvisorNoReportsAccess` being OFF is worth noting for any
portal/reports-access case.

## 5. ENVIRONMENT FACTS (durable — reuse, do not re-discover)

| Fact | Value |
|---|---|
| App | `https://sv8582.qa.shopview.com` |
| API | `https://sv8582api.qa.shopview.com` |
| Auth | `POST /api/quick-login {"key":"admin"\|"tech"}` → 200 + fresh `PHPSESSID` (gated by valid cookies) |
| Org id | `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (**the same shared org as staging / Simple Flow / Custom Roles**) |
| Default workplace | `Staging Heavy Duty - 9919` |
| Reports landing | `/reports` **redirects to** `/reports/punch-clock-activities` (Timesheet Activities) — there is no neutral reports index page |
| Report data API shape | `GET /api/reporting/<report-slug>/<range>?pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=&search=&range=<range>` |
| Org flags endpoint | `GET /api/organization/feature-flags?organization_id=<org>` (note: **`organization`** singular; `/api/organizations/feature-flags` 404s) |
| Helper (secret-free) | `tools/qa8582.mjs` (`login()` / `api()`), `tools/boot8582.mjs` (`boot()` / `spaGo()`) |
| Node proxy | run node with **`NODE_USE_ENV_PROXY=1`** or plain `fetch` bypasses the egress proxy |

## 6. THE SIX REPORTS — EXACT ROUTES AND NAV PLACEMENT (live)

The reports side-nav is grouped by ALL-CAPS headings. Live order and placement:

| Nav group heading | Report entry (verbatim) | Route |
|---|---|---|
| LABOR | Timesheet Activities | `/reports/punch-clock-activities` |
| PERFORMANCE | Sales | `/reports/sales` |
| PERFORMANCE | Technician Efficiency | `/reports/technician-efficiency` |
| PERFORMANCE | Advisor Analysis | `/reports/service-advisor-analysis` |
| PERFORMANCE | Shop Efficiency | `/reports/shop-billing-efficiency` |
| PERFORMANCE | **Work In Progress** | **`/reports/work-in-progress`** |
| PERFORMANCE | **Technician Utilization** | **`/reports/technician-utilization`** |
| PERFORMANCE | **Sales By Representative** | **`/reports/sales-by-representative`** |
| PARTS | **Parts Velocity** | **`/reports/parts-velocity`** |
| PARTS | **Inventory Value** | **`/reports/inventory-value`** |
| SALES | **Sales By Customer** | **`/reports/sales-by-customer`** |
| FINANCE | Sales Tax Collected | `/reports/sales-tax` |
| ACCOUNTS RECEIVABLE | A/R Aging Summary · A/R Aging Detail · A/R Aging Collection | `/reports/ar-aging-summary` · `-detail` · `-collection` |
| ACCOUNTS PAYABLE | A/P Aging Summary · A/P Aging Detail · A/P Unpaid Invoices | … |
| ACCOUNTING | IBS Batches · QB Unexported · Export Reports | … |
| COMMUNICATIONS | Notes · Reminders | … |

**⚠️ FIRST SIGNIFICANT DISCREPANCY (carried into `LABEL-DIFF.md`):** the build places
**Sales By Customer under a `SALES` group heading**, not under `PERFORMANCE`. Our
**SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096)** asserts
"listed under Performance, below existing links". Likewise the **PARTS** group (PV + IV) exists
as the companion video described, which our IV/PV nav cases predicted correctly.

## 7. HONESTY / SCOPE OF THIS DOCUMENT

Everything above was **observed live on 2026-08-03** against build `v3.4.1-0ed4433`; nothing is
inferred (Rule 12). This document proves **access + navigation reachability only** — it is **not**
a VIU verdict on any test case. Per-case verdicts live in the batch files, and every one of them
is provisional because **the QA branch is NOT FINAL** (Standing Rule 49) — see
`RECHECK-QUEUE.md`, status **OPEN**.
