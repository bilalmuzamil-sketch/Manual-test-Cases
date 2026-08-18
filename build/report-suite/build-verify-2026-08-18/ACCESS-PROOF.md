# ACCESS PROOF — Report Suite build-verification recon, 2026-08-18

> NO secrets, tokens or cookie values are recorded here (repo is public — core §10). Only build
> markers, hosts and HTTP results.

## 1. Staging is LIVE and was redeployed TODAY

Stefan's word that the QA branch is merged to staging is confirmed. The app answers on the
**staging** domain, not the old per-branch QA host.

| Probe | Host | Result |
|---|---|---|
| App index (unauth GET) | `app.staging.shopview.com/index.html` | **HTTP 200** |
| — build marker | `<meta name="app-version">` | **`v3.8-2bf8d14`** |
| — `last-modified` | | **Tue, 18 Aug 2026 17:45:12 GMT** (today) |
| — `etag` | | `0f69246068bb597a9f1a1f02bd708754` |
| — read at (UTC) | | **2026-08-18T19:05:08Z** |

The build was rebuilt ~1h20m before we read it — consistent with a fresh merge to staging.

## 2. ACCESS — now **OK** (fresh staging cookies supplied 2026-08-18 ~19:12Z)

The QA lead supplied fresh `.staging.shopview.com` cookies (`sv_sso_session` · `PHPSESSID` ·
`cf_clearance`), written to `/tmp/staging-cookie.txt` (chmod 600, **never committed** — repo is
public, core §10). A real authenticated probe confirms a live, observable session on the
**Report Suite**:

| Probe (host `api.staging.shopview.com`) | Result |
|---|---|
| `GET /api/auth/me/fe-permissions` | **HTTP 200** — 42 permissions, `view_mode: full`, `system_role` present |
| `GET /api/reporting/reports/sales-by-customer?range=this_month` | **HTTP 200** — real report data (`data.collection` of customer rows: `customer_name`, `location`, `inv_hrs`, …) |
| read at (UTC) | **2026-08-18T19:12:52Z** |

**The Report Suite is observable live.** Build marker re-read at 19:12Z: `v3.8-2bf8d14`,
`last-modified` Tue 18 Aug 2026 17:45:12 GMT, `etag` `0f69246068bb597a9f1a1f02bd708754` —
byte-stable across the 19:05 and 19:12 reads, so nothing redeployed under the probe.

**Endpoint-shape note (skill 03 false-absence trap, recorded so nobody re-derives it):** the real
report endpoint is **`/api/reporting/reports/<report-slug>`**, NOT `/api/reports/…`. First guesses at
`/api/reports/sales-by-customer` returned **404 "resource not found"** (wrong path, not absence), and a
`range=custom` call returned **400 "not a valid datetime"** (param-format, not a broken endpoint) —
both classic false-absence signatures. `range=this_month` returned 200 with data. The prior-work
capture that carries the correct shape: `build/report-suite/finish-2026-08-12/evidence/verify3.json`.

### The old cookies (for the record) — dead, and the old host is gone

Two old cookie sets in `/tmp` targeted the **retired** per-branch QA host `.qa.shopview.com`
(`/tmp/rs-cookie.txt` 2026-08-04, `/tmp/qa-cookies/reports-cookie-header.txt` 2026-08-10). Against
staging they returned **401 `sso_required`** (dead shared sign-in), and the old host
`sv8582api.qa.shopview.com` returned **HTTP 000** (torn down by the merge to staging). These are not
used.

## 4. Jira access WORKS (independent of staging)

Atlassian cookies in `/tmp/atlassian/cookies.txt` (via `jira.sh`) still authenticate:

- `GET /rest/api/3/issue/SV-8582` → **HTTP 200**, type **Epic**, status **Open**.
- Epic children paged in full: **113 children** (97 Story · 8 Bug · 8 Task).

## 5. TestRail

Credentials present at `/tmp/testrail/creds.json` (not read this pass — recon is read-only on the case
source and Jira; no TestRail call was made). Case source and id-map read locally: **508 cases** under
group **4281**.
