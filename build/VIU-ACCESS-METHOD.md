# VIU Access Method — Live Staging Verification (NON-SECRET)

This document records the working method for running Verify-in-UI (VIU) and live
per-role test runs against ShopView staging in future sessions.

> **NO SECRETS IN THIS FILE.** Never commit cookie values, tokens, session IDs,
> passwords, proxy ports, or CA contents. This file describes *how*, not *what*.
> The three session cookies are obtained fresh each session and are never written
> to the repo.

## a) Network egress

- Staging lives behind `*.staging.shopview.com`. The sandbox must allow egress to
  those hosts. Set the environment's **Network access = Full** before starting; a
  restricted allowlist will block the API/app hosts and the run cannot proceed.

## b) Obtain the 3 session cookies (fresh, per session)

From a live `app.staging` browser login, obtain these three cookies:

- `PHPSESSID` — the app/API session cookie.
- `sv_sso_session` — the SSO session; **longer-lived** than the other two.
- `cf_clearance` — the Cloudflare clearance cookie (required to pass the edge).

Read them from the live authenticated browser session. Do **not** paste their
values into the repo, logs, or commit messages.

## c) Session lifetime

- Sessions are **short (~1 hour)**. Plan work in windows and re-acquire cookies
  when a window expires. `sv_sso_session` outlives the others but the effective
  window is still about an hour.

## d) Build a FRESH MITM bridge per session

- Build a new Chromium-TLS -> Node-fetch bridge **each session**.
- Run Node with `NODE_USE_ENV_PROXY=1` and `NODE_EXTRA_CA_CERTS` pointing at the
  current agent-proxy CA bundle, and have it read the **current** `$HTTPS_PROXY`
  from the environment at start-up.
- **The proxy port rotates between sessions.** Do NOT reuse an old bridge or a
  hard-coded port — always read `$HTTPS_PROXY` live and rebuild.

## e) Hydrate via the SPA dev-login

- Hydrate the SPA through the dev-login (Admin / Tech buttons), which performs the
  real `fe-permissions` hydration path.
- The cookie owner is **read-only** over the raw API, so any **writes** (role
  create/edit, staff assignment) must go through the **Admin dev-login session**,
  not raw-API calls under the cookie owner.

## f) Per-role method

To verify a specific permission configuration as the restricted Tech user:

1. **PUT** a single reusable role named **"BILAL AUTOMATION"** with the target
   permission set (reuse the same role across configs; don't spawn many roles).
2. **Assign** it to the Tech staff member via `POST /api/staff/{id}/change`.
3. Perform a **fresh Tech dev-login** (permission changes require a fresh login +
   brief settle — see VIU-31).
4. **Poll** `GET /api/auth/me/fe-permissions` until the effective permissions
   match the intended set (`match=true`).
5. **Verify the UI** for the expected gating behavior.

## g) ALWAYS restore + clean up

After every per-role session, restore state:

- Restore Tech to the **Time Clock** role:
  `role_id = 77b069d1-19dd-4a7f-a541-819bd3cd7cde`.
- **Delete** the temporary "BILAL AUTOMATION" role.

Do this even if the run is interrupted, so the shared staging shop is left clean.

## Known-good endpoint list

| Purpose | Endpoint |
|---|---|
| SSO auth check | `GET /api/sso/check` (note: staging build calls the doubled `/api/api/sso/check` — a bug, VIU-23) |
| Effective FE permissions (poll) | `GET /api/auth/me/fe-permissions` |
| Roles list / read | `GET /api/roles` |
| Create / update role | `PUT /api/roles/{id}` |
| Delete role | `DELETE /api/roles/{id}` |
| Assign role to staff | `POST /api/staff/{id}/change` |
| Staff list / read | `GET /api/staff` |
| Digital Inspections templates (feature-presence check) | `GET /api/inspection-templates` |

### Reference IDs (non-secret)

- Tech staff id: `6fb22c1b`
- Time Clock role_id (restore target): `77b069d1-19dd-4a7f-a541-819bd3cd7cde`
- Temp role name: `BILAL AUTOMATION`
