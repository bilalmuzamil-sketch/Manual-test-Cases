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

## 2. We have NO live session — access is BLOCKED

Two old cookie sets exist in `/tmp`, both for the **retired** per-branch QA host `.qa.shopview.com`,
both stale (8–14 days old, past the ~24h lifetime, and a redeploy kills them anyway):

- `/tmp/rs-cookie.txt` — host `sv8582.qa.shopview.com` — mtime 2026-08-04
- `/tmp/qa-cookies/reports-cookie-header.txt` — mtime 2026-08-10

Probes (`GET /api/auth/me/fe-permissions`), per core §6 (probe the `…api.` host, build header with
`'; '.join`):

| Cookies used | Host | Result | Meaning (core §6.1) |
|---|---|---|---|
| none | `api.staging.shopview.com` | **HTTP 401** | auth required (expected) |
| old QA (reports) | `api.staging.shopview.com` | **HTTP 401 `{"error":"sso_required"}`** (JSON from app) | shared `sv_sso_session` is DEAD; request reached the app, so Cloudflare is fine |
| old QA (rs-cookie) | `api.staging.shopview.com` | **HTTP 401 `sso_required`** | same |
| old QA (either) | `sv8582api.qa.shopview.com` | **HTTP 000** (no connection) | the old per-branch QA host is TORN DOWN |

**Signature of a genuinely dead shared sign-in (core §6.1):** JSON `sso_required` from the app, and
**nothing returned 409**. `quick-login` is not a recovery route in this state (it is itself
SSO-gated).

## 3. What is needed to unblock

**Fresh STAGING cookies for the `.staging.shopview.com` domain** (we have never held staging cookies —
every set in `/tmp` is for the retired `.qa.shopview.com`):

- `sv_sso_session` — the shared sign-in (dead)
- `PHPSESSID` — staging's session (per-branch/per-host; we have none for staging)
- `cf_clearance` — Cloudflare clearance for the staging domain

API host to probe once supplied: **`https://api.staging.shopview.com/api/auth/me/fe-permissions`**
(a 200 with a permissions array confirms live).

## 4. Jira access WORKS (independent of staging)

Atlassian cookies in `/tmp/atlassian/cookies.txt` (via `jira.sh`) still authenticate:

- `GET /rest/api/3/issue/SV-8582` → **HTTP 200**, type **Epic**, status **Open**.
- Epic children paged in full: **113 children** (97 Story · 8 Bug · 8 Task).

## 5. TestRail

Credentials present at `/tmp/testrail/creds.json` (not read this pass — recon is read-only on the case
source and Jira; no TestRail call was made). Case source and id-map read locally: **508 cases** under
group **4281**.
