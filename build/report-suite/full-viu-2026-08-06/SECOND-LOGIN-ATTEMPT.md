# THE SECOND TEST LOGIN — ATTEMPTED, AND BOTH SELF-SERVICE ROUTES ARE CLOSED ON THIS BRANCH

The QA lead authorised unblocking this, verbatim: *"You should unblock yourself."* It was attempted at
the end of the 2026-08-06 second session. **Both routes are shut on `sv8582`.** This is an
evidence-backed blocker, not "we ran out of time" — recorded here so nobody spends another session
re-discovering it.

Build in force throughout: **`v3.5-7168d14`**, `index.html` last-modified Thu, 06 Aug 2026 08:32:37 GMT.

## Route 1 · Impersonate an existing non-admin holder — `POST /api/switch-user`

**CLOSED. HTTP 403 `{"errors":[{"error":"Access denied."}]}`**

Tried as the signed-in administrator (42 permissions, `view_mode: full`), against a **real, active,
invitation-confirmed Technician**: Henry Hess, user id `0687da3b-0f7b-41a4-b24c-616c5a9dc056`, staff id
`21bb7388-2e45-4025-bfd8-a4c2e306e9f6`.

A first attempt with a wrong id returned **HTTP 401 "Invalid credentials."**, and the correct id returned
**HTTP 403 "Access denied."** — two different errors, which is what proves the id was right and the
**endpoint itself is refusing an administrator on this branch**.

## Route 2 · The developer quick-login — `POST /api/quick-login`

**PRESENT BUT ADMIN-ONLY.**

| Request | Result |
|---|---|
| `{}` | **HTTP 400 `"Key is required."`** — so the endpoint exists and is reachable |
| `{"key":"tech"}` | **HTTP 403 `"Access denied."`** — the `tech` key is not available here |
| `{"key":"admin"}` | **HTTP 200**, returns a token and a fresh `PHPSESSID` |

## ⚠️ AND THE FAILED ATTEMPT KILLED THE SESSION

Immediately after the `{"key":"tech"}` refusal, the existing cookie returned
**HTTP 409 `{"errors":[{"error":"Session has expired."}]}`** on every endpoint. **A 403 from
`quick-login` still burns the session it was called with.**

**Recovered:** `{"key":"admin"}` → HTTP 200 with a new `PHPSESSID`; substituting that one value into the
existing cookie header restored full access — `/api/auth/me/fe-permissions` HTTP 200, 42 permissions,
`reportsPageAccess` and `workOrdersView` both present, `view_mode: full`, and the report endpoint back to
HTTP 200. **`/tmp/rs-viu/cookie-header.txt` was updated with the working value, chmod 600, never
committed.**

**The recipe worth keeping: if a `quick-login` or `switch-user` attempt leaves you with 409 "Session has
expired.", call `POST /api/quick-login {"key":"admin"}` and swap ONLY the returned `PHPSESSID` into your
existing cookie header. `sv_sso_session` and `cf_clearance` stay as they were.** This belongs in
`build/APP-ACTIONS-PLAYBOOK.md` §J — **not edited from here, another worker holds that file. Flagged for
the QA lead.**

## Route 3 · Create a fresh staff member — NOT attempted, and why

`POST /api/iam/create` would make a staff record, but the playbook already records that **a fresh staff
member on these environments needs invitation confirmation before it can sign in**, which needs an email
we cannot read. Creating one would leave a dead record on a shared branch for no gain.

## What this means for the 17 permission cases

`RECHECK-QUEUE.md` section A lists them: C30098, C30099, C30100, C30101, C30109 (item 5), C43546,
C43550, C43558, C39447, C30526, C30527, C30325, C30326, C30327, C30340, C30391, C30603, C30604.

**They cannot be observed from this container on this branch by any self-service route.** What would
unblock them, in order of preference:

1. **A second set of cookies for a NON-ADMIN user** on `.qa.shopview.com` — the cleanest answer, and it
   costs the QA lead one sign-in in a private window.
2. **A developer enabling the `tech` key** on `sv8582`'s quick-login, as it is enabled on other branches.
3. **A developer granting `switch-user` to the administrator** on this branch.

**Until one of those arrives, these 17 cases stay `AUTOMATION: HOLD` with that exact reason on them, and
no verdict is inferred** (Rule 12).

## Housekeeping

**One `PHPSESSID` was rotated** — the shared session's. Any sibling worker holding the previous value on
`.qa.shopview.com` will see 409 and needs the new one from `/tmp/rs-viu/cookie-header.txt`, or their own
fresh sign-in. **Nothing else on the estate changed**: no data was created, edited or deleted, no role or
setting was touched, and no user was impersonated — both attempts were refused before they took effect.
