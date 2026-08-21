# BLOCKED — the ShopView app's authenticated surface (all projects)

**Status: BLOCKED as at 2026-08-21.** Raised by the PROJECT INDEX refresh
(`build/PROJECT-INDEX-REFRESH-2026-08-21.md`).

## What is blocked

Anything that needs to be **signed in**: driving the SPA, reading an API response, observing a
control, confirming a label, running a permission negative, or producing any live PASS/FAIL verdict —
on **staging and on every `*.qa.shopview.com` branch**. Under Rule 12 none of it may be inferred, so
these simply do not happen until a session exists.

## What still works without a session (and was used today)

Unauthenticated `GET /index.html` on each host, which serves `<meta name="app-version">`,
`last-modified` and `etag`. That is enough for a **build marker** (Rule 49) and nothing more.

## Evidence

* `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` with the stored cookie header
  from `/tmp/qa-cookies/reports-cookie-header.txt` → **HTTP 401**.
* The stored cookie sets in `/tmp` are dated **2026-08-04** and **2026-08-10** — 11 to 17 days old,
  against a documented lifetime of about **24 hours, or less if a deploy lands**.

## Exactly what is needed

A fresh cookie set for the host to be driven — **three values**:

| Cookie | Shape |
|---|---|
| `sv_sso_session` | 64-hex |
| `PHPSESSID` | 32-hex |
| `cf_clearance` | Cloudflare clearance string |

Domain `.shopview.com` for staging, `.qa.shopview.com` for a QA branch. Supplied into `/tmp` only,
**never committed** (Rule 6 secrets bar). Name the host they belong to — a Filters-branch cookie does
not authenticate the Schedule API.

## Who can clear it

The QA lead. It is a one-minute action on his side and it unblocks every live-verification lane.
