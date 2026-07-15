# Custom Roles (SV-7388) — PRODUCTION vs STAGING permission gaps — INTERIM (2026-07-14/15)

> **RELEASE-EVE compare.** Goal: find every place a **PRODUCTION** role grants **MORE**
> capability than the **STAGING** role it maps to (the regressions/over-grants the user
> worries about — e.g. *Send to Portal*, *Send to Terminal*, delete, financial).

## ⛔ DATA STATUS — READ FIRST

| Side | Status |
|---|---|
| **STAGING** | **LIVE-VERIFIED** — read-only capture from `api.staging.shopview.com`, 11 system roles, all HTTP 200. |
| **PRODUCTION** | **NOT CAPTURED — authentication FAILED.** The prod half of this compare is **SPEC-PREDICTED ONLY** (from the spec's own "Behavior Changes" table), **UNVERIFIED against live production.** |

**This is an INTERIM scaffold, NOT a completed compare.** Do not ship a release decision on
the prod side of this document until production is captured live.

---

## STEP-0 VALIDATION RESULT

### STAGING — ✅ PASS
- `POST /api/quick-login {key:"admin"}` → **200** (rotates PHPSESSID).
- `GET /api/organizations/{org}/roles` → **200**, **11 system roles** returned.
- Per-role `GET /api/roles/{id}` → **200** for all 11.
- Org UUID `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. cf_clearance (qa zone) passes Cloudflare on staging (no challenge).
- **Env reseeded again:** all staging role IDs are NEW vs `roles-matrix-2026-07-13.md` AND vs the TimeClock doc's `be58f381…`. Current Time Clock User = `36462edb-25a7-464d-9827-8d6ae906afdb`. (Re-derived live — IDs below.)

### PRODUCTION — ❌ FAIL (cannot proceed to live compare)
- **Host discovery OK:** SPA `app.shopview.com` (200), API `api.shopview.com` (200, live Symfony backend — returns proper `/api/...` route errors).
- **Authentication FAILS.** Every authenticated GET returns **HTTP 409 `"Session has expired."`**:
  - `GET /api/organizations` → 409, `GET /api/staff?page=1` → 409.
  - This 409 returns **even with NO cookies at all**, and identically with `cf_clearance` only, `PHPSESSID` only, and `value1` tried as `sv_sso_session` — so it is a **session** failure, **not** a Cloudflare block.
- **`POST /api/quick-login` on prod → HTTP 500** (both `admin` and `tech`). The dev quick-login refresh path (which staging relies on to establish a session from `sv_sso_session`) does not function on production.
- `GET /api/auth/me/fe-permissions` and `/api/auth/me` → **404 "No route found"** on prod (old-model build; new fe-permissions route absent — confirms prod uses a different permission representation, as the PLAN anticipated).

**ROOT CAUSE (precise):** the production cookie set is **MISSING a valid production
`sv_sso_session` (64-hex)**. `value1 = <prod-value1 32-hex, redacted>` (32-hex) does not
authenticate as either `PHPSESSID` or `sv_sso_session`; with only that + the qa-zone
`cf_clearance`, the backend has no valid session → 409 on every call, and the quick-login
refresh 500s on prod.

- **cf_clearance is NOT the blocker** (409 returns with no cf_clearance at all — Cloudflare is not challenging).
- **Host is NOT the blocker** (`api.shopview.com` is the correct live backend).

### 👉 WHAT IS NEEDED TO COMPLETE
1. A **valid production `sv_sso_session` (64-hex)** cookie for `api.shopview.com` — the missing piece.
2. Confirmation of the **production org UUID** (do not assume it equals staging's `d55bc308…`).
3. Confirm whether prod exposes role data at `GET /api/organizations/{org}/roles` / `GET /api/roles/{id}` under the old model, or a different endpoint (fe-permissions route is 404 on prod).

Per the task rule, **no comparison was fabricated from missing production data.** The prod
column in the workbook is explicitly the SPEC's declared reductions, flagged NEEDS-REVIEW.

---

## STAGING live role model (verified 2026-07-14/15)

Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Cross-toggles: SFD=seeFinancialData, AP/AR=seeApArData, HIST=viewHistoryLogs.

| Staging Role | Role ID (LIVE) | view_mode | SFD | AP/AR | HIST | #perms |
|---|---|---|:--:|:--:|:--:|--:|
| Admin | 9b3fc6be-6bbc-4a6b-86d4-b0520ff48547 | full | ✓ | ✓ | ✓ | 42 |
| Service Manager | 0fb1333c-07e5-405d-ad74-c37994c3332a | full | ✓ | ✓ | ✓ | 36 |
| Senior Service Advisor | 62c28d64-350e-425e-9ff8-7ac60fb6f778 | full | ✓ | ✓ | ✓ | 32 |
| Service Advisor | 32dc4355-14f3-49cf-8909-404fb0d57a9a | full | ✓ | ✗ | ✓ | 26 |
| Foreman | 8d704f89-d4a5-4f80-b630-5cf97f122862 | full | ✓ | ✗ | ✓ | 23 |
| Technician | 10fdbeaa-dbed-4da2-a860-23a30d656fcd | tech | ✗ | ✗ | ✗ | 6 |
| Parts Manager | b7d68907-eb5f-49da-8b8b-c6d40d7a9436 | full | ✓ | ✓ | ✓ | 31 |
| Parts Technician | 3bd9ac57-cd05-42c0-9b34-3306f5dc7419 | full | ✓ | ✗ | ✓ | 19 |
| Office User | 9b36bb9f-feed-43a0-93e2-91a1be23965a | full | ✓ | ✓ | ✓ | 23 |
| Sales Representative | 0767df32-7d85-4a56-8eb0-b3f17a174864 | full | ✓ | ✓ | ✗ | 8 |
| Time Clock User | 36462edb-25a7-464d-9827-8d6ae906afdb | (none) | ✗ | ✗ | ✗ | 3 |

---

## PROD→STAGING merge mapping used (from PLAN §1, sourced to spec migration table)

- **Admin** ← Owner + Administrator (MERGE)
- **Senior Service Advisor** ← Service Advisor + SA Technician + SA No Reports (MERGE)
- **Sales Representative** ← Sales Representative + Reporting (MERGE)
- **Service Advisor** ← SA Limited View (1:1 rename — naming trap)
- Service Manager, Foreman, Technician, Parts Manager, Parts Technician, Office User, Time Clock User = 1:1.

**⚠ NEEDS REVIEW (flagged, not resolved):** the naming trap (legacy "Service Advisor" →
staging "Senior Service Advisor"), the spec-table-vs-migration-cases contradiction (C26514/
C26515), and the real prod role inventory — all require the live prod capture + user
confirmation. See the workbook "Open questions" tab.

---

## SPEC-PREDICTED PROD-ONLY capabilities (the release-eve risk list)

Taken from the spec's **own** "Behavior Changes for Migrating Users" table ("Loses …" rows).
**Staging-grants? verified LIVE** — every reduction below is confirmed already applied in the
current staging build (staging does NOT grant it). **Prod-grants? = SPEC-PREDICTED, UNVERIFIED.**

| Staging Role | Prod role | Capability (prod-only per spec) | Prod grants? | Staging grants? (LIVE) | Severity |
|---|---|---|---|---|:--:|
| **Technician** | Technician | **Send to Portal** | Yes (spec-predicted) | **No** (tech-view hides it) | **High** |
| **Parts Manager** | Parts Manager | **Delete work order** (`workOrdersDelete`) | Yes (spec-predicted) | **No** | **High** |
| **Parts Manager** | Parts Manager | **Delete work order line** (`workOrderLinesDelete`) | Yes (spec-predicted) | **No** | **High** |
| **Service Manager** | Service Manager | **Reverse/delete invoice** (`invoicingPaymentsDelete`) | Yes (spec-predicted) | **No** | **High** |
| Service Manager | Service Manager | Change Service settings (`settingsService`) | Yes (spec-predicted) | No | Medium |
| Service Manager | Service Manager | Change Parts settings (`settingsParts`) | Yes (spec-predicted) | No | Medium |
| Service Manager | Service Manager | Change Finance settings (`settingsFinance`) | Yes (spec-predicted) | No | Medium |
| Service Manager | Service Manager | Data Import settings (`settingsDataImport`) | Yes (spec-predicted) | No | Medium |
| Foreman | Foreman | Edit timesheets (`timesheetsCreateAndEdit`) | Yes (spec-predicted) | No | Medium |
| Office User | Office | Create & Edit catalog/inventory (`catalogInventoryCreateAndEdit`) | Yes (spec-predicted) | No | Medium |

**Headline high-severity (spec-predicted):** Technician **Send to Portal**; Parts Manager
**Delete WO / Delete WO line**; Service Manager **reverse invoice**. These are the classic
"prod can do more" risks — but they are the intended, spec-declared reductions of the
migration, i.e. **removals of capability by design**, not accidental regressions. They still
require **live production confirmation** that production actually grants them today.

### Send to Terminal — separately flagged NEEDS-REVIEW
*Send to Terminal* is **not** on the spec's "Loses" list, so it is not predictable from the
spec. In staging it is gated on `invoicingPaymentsCreateAndEdit` **AND** `customerPortalPageAccess`.
It must be diffed **live per prod role** once production is reachable — cannot be adjudicated now.

---

## Evidence / provenance
- Raw captures: `compare-evidence-2026-07-14/` — `staging-roles-list.json`,
  `staging-role-<id>.json` (×11), `staging-capability-matrix.json`, `prod-auth-probes.txt`.
- Spec source: `build/custom-roles-spec-update/updated-spec-source.md` (Migration Plan + Behavior Changes tables).
- Method/mapping: `prod-vs-staging-compare-PLAN-2026-07-14.md`.
- Secrets: `/tmp/custom-roles/compare-cookies.env` (chmod 600, NOT in repo).

## Cleanup
- **No writes to production** (read-only GET probes only).
- **No writes to staging** (read-only GET only; no role/staff/settings changes; Tech NOT switched).
- No ZZAUTOTEST data created on either env. Nothing to restore.
