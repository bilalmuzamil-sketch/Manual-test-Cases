# SV-9296 / SV-9297 / SV-9298 / SV-9299 — auth & session tickets, QA pass 2026-09-15

Milomir Kotlajic on SV-9297: *"I created one pr for all of these. You can test them all at once
on this QA env."* — so all four were driven on the one branch.

## Environments and build markers

| | Web | API | Build (app-version) | index.html last-modified / etag |
|---|---|---|---|---|
| Fix branch | `sv9297.qa.shopview.com` | `sv9297api.qa.shopview.com` | **v26.36.6-b7aa273** | Mon 14 Sep 2026 16:37:32 GMT / `5623f0fd2c9ed1f231c341d50f5ca6f4` |
| Production (the "before") | `app.shopview.com` | `api.shopview.com` | **v26.36.7-cf5012e** | Tue 15 Sep 2026 09:32:41 GMT / `b5f3b4831b5cc6f505a8c477b2fceec3` |

Markers read at 15:35:42Z. Production's frontend build number is *higher* than the branch's; that is
normal (the branch forked earlier) and does not mean the fixes are on production — verified below,
where production still reproduces SV-9296, SV-9297 and SV-9298.

Sign-in on the branch used the real login page (email + password) and Dev Mode → Quick Login →
Admin. The production credentials authenticate on the branch as well.

## Verdicts

| Ticket | Verdict |
|---|---|
| SV-9296 — login 200 then session unusable, bounced with "status code 409" | **PASSED** |
| SV-9297 — 409 instead of 401 for unauthenticated requests | **PASSED** |
| SV-9298 — fe-permissions fired twice per sign-in (never QA'd before) | **PASSED** |
| SV-9299 — serialized Symfony token in the login response | **PASSED** (already corrected on production too — see the honest note) |

---

## SV-9296 — stale parent-domain session cookie

Reproduction condition, taken from the ticket and from our own August retest: plant a legacy
`PHPSESSID` scoped to the **parent** domain, then sign in with valid credentials.

```
document.cookie = "PHPSESSID=qa-stale-session-sv9296; Domain=<parent>; Path=/; Secure; SameSite=None";
```

### BEFORE — production (`.shopview.com`), 15 Sep 2026

```
POST /api/login                      -> 200
GET  /api/auth/me/fe-permissions     -> 409  {"errors":[{"error":"Session has expired."}]}
GET  /api/auth/me/fe-permissions     -> 409  (same call again, 907 ms later)
```
* user is returned to the login screen
* on-screen: **"Login failed. / Request failed with status code 409"**
* `Set-Cookie` on `/api/login` carries only the canonical cookie — no cleanup of the legacy scopes
* the planted parent-domain cookie **survives** the sign-in
* a direct `fetch('…/fe-permissions', {credentials:'include'})` still returns 409

Evidence: `ev/raw_prod_9296_before.png`, `ev/raw_prod_9296_after.png`.

### AFTER — fix branch (`.qa.shopview.com`), both sign-in methods

Quick Login (Admin) and normal email + password, run separately, identical outcome:

```
POST /api/quick-login  (or /api/login)  -> 200
GET  /api/auth/me/fe-permissions        -> 200
```
`Set-Cookie` on the login response, verbatim (value redacted):
```
PHPSESSID=[REDACTED]; expires=Wed, 16 Sep 2026 …; Max-Age=86400; path=/; secure; HttpOnly; SameSite=none
PHPSESSID=[REDACTED]; expires=Mon, 15 Sep 2025 …; Max-Age=0; path=/; domain=qa.shopview.com; secure; httponly; samesite=none
PHPSESSID=[REDACTED]; expires=Mon, 15 Sep 2025 …; Max-Age=0; path=/; domain=shopview.com;    secure; httponly; samesite=none
```
* both legacy scopes are explicitly expired
* after sign-in the only `PHPSESSID` left is on `sv9297api.qa.shopview.com`
* the planted cookie is gone (`document.cookie` no longer contains it)
* direct protected request → **200**
* lands on Work Orders; no raw client error string anywhere on screen
* no manual cookie clearing at any point

Evidence: `ev/raw_fix_9296_quicklogin_after.png`, `ev/raw_fix_9296_normallogin_after.png`,
exhibit `ev/01_SV-9296_before_after.png`.

### Repeated logout / sign-in lifecycle (the scenario blocked in the August cycle)

Without clearing cookies or site data between attempts:

| Cycle | Method | Result |
|---|---|---|
| 1 | normal login | signed in |
| 2 | logout → normal login | signed in, protected request **200** |
| 3 | logout → Admin quick login | signed in, protected request **200** |

### Wrong-password handling

Branch shows **"Login failed. / Invalid credentials."** — no raw HTTP-client string.

---

## SV-9297 — status code for an unauthenticated request

Ten protected endpoints, called with no usable app session, on both environments.

| | Production | Fix branch |
|---|---|---|
| status on all 10 | **409** | **401** |
| body, no session at all | `{"errors":[{"error":"Session has expired."}]}` | `{"errors":[{"error":"not_authenticated"}]}` |
| body, session present but invalid | `{"errors":[{"error":"Session has expired."}]}` (identical) | `{"errors":[{"error":"session_expired"}]}` |

Endpoints: `/api/auth/me/fe-permissions`, `/api/customers`, `/api/work-orders`,
`/api/staff/my-workplaces`, `/api/organization/feature-flags`, `/api/notes`,
`/api/inventory/parts`, `/api/work-orders/statuses`, `/api/iam/view-profile/`,
`/api/reporting/individual-punch-clock/today`.

**Method note, and it matters.** The QA branch sits behind an extra SSO edge gate that production
does not have. Calling the branch with *no cookies at all* returns `401 {"error":"sso_required"}`
from that gate, which is not the application's own answer. The comparison above therefore gives the
branch its SSO cookie and no app session — the same condition production was given. That is the
like-for-like measurement; the first sweep, before that was held constant, was not.

Front-end behaviour, driven through the UI on both: killing the session cookie and then navigating
to Customers produces `GET /api/customers` → 409 on production / 401 on the branch, and **both**
redirect to the login screen with **"Session expired, please log in again."** The front end has
already been taught to treat the 409 as a session problem on production, so the raw-axios half of
this ticket no longer reproduces there on that path — it does still reproduce on the sign-in path
(see SV-9296 above, "Request failed with status code 409").

Exhibit `ev/02_SV-9297_before_after.png`; branch toast `ev/raw_fix_9297_session_expired_toast.png`.

---

## SV-9298 — duplicate `GET /api/auth/me/fe-permissions`

This ticket had **no QA comment at all** before today (status Code Review).

Counted both at the network level (Playwright request events) and inside the page (`fetch` and
`XMLHttpRequest.open` instrumented, the same technique the ticket used).

| Scenario | Production | Fix branch |
|---|---|---|
| plain successful sign-in | 1 | 1 |
| sign-in with a stale parent-domain cookie (the failure path) | **2** — 907 ms apart | 1 |
| first permissions reply forced to fail (401) | not applicable — already failing | 2, sequential, 769 ms apart, recovers to 200 and the user signs in |
| second tab open during sign-in | — | 0 from the other tab; **1 in total** across both tabs |
| full page reload while signed in | — | 0 |
| navigating to another page | — | 0 |

The reported duplicate **does** reproduce on production, in exactly the situation the ticket says it
was found in (while capturing the SV-9296 failure):

```
+1551 ms  POST /api/login                    200
+1792 ms  GET  /api/auth/me/fe-permissions   409
+2699 ms  GET  /api/auth/me/fe-permissions   409
```

### What the fix actually is

Read out of the deployed branch's own published sourcemap (`/js/index.DI-3oG-d.js.map`), so this is
the shipped code, not a guess.

Production, minified:
```js
loadAndPersistFEPermissions: () => (async () => {
  const { authApi } = await import(...);
  try { const { data } = await authApi.getMyFEPermissions(); ... }
  catch (e) { removeUser(); removeImpersonatedUser(); throw e; }
})()
```
No guard of any kind — every caller starts its own request.

Fix branch, minified:
```js
loadAndPersistFEPermissions: () => {
  if (Te) return Te;                                   // share the request already running
  const e = io().finally(() => { Te === e && (Te = null) });
  return Te = e, e;
}
```
and inside `io()` (the fetch itself):
```js
const e = Xe;                    // identity generation captured up-front
... await getMyFEPermissions();
if (e !== Xe) return;            // a superseded identity's reply is discarded
```

Source comments in the shipped map name the ticket and explain both halves: an **in-flight latch**
so overlapping callers share one request, deliberately *not* a "loaded once" memo, dropped as soon
as the request settles and at every identity change (`saveUser` / `removeUser`); and an **identity
generation counter** so a reply that arrives after the identity moved on cannot persist the previous
user's permissions or roll back the new one's session. There is also a Sentry breadcrumb tagged
`ticket:"SV-9298"` for the sequential session-blip retry.

The cross-tab clause is satisfied structurally: the `refreshTabs` storage listener reloads the page,
and a reload rehydrates permissions synchronously from local storage with no network call
(`boot/permissions.ts`: *"no network call at boot, no router-guard race"*). Measured: 0 requests on
reload, 0 in the second tab.

Exhibit `ev/03_SV-9298_before_after.png`; blip recovery `ev/raw_fix_9298_blip_recovered.png`.

---

## SV-9299 — serialized Symfony token in the login response

Full `POST /api/login` body captured on both environments.

| | Production | Fix branch |
|---|---|---|
| top-level keys | `["data"]` | `["data"]` |
| `data` keys | `["role","details"]` | `["role","details"]` |
| `data.token` | absent | absent |
| contains `O:74:` / `UsernamePasswordToken` / `Symfony` / `serialize` | no | no |
| any local- or session-storage value containing `O:74:` | — | no |

**Honest limit:** production today is already clean, so the reported faulty reply could not be
captured as a "before". The verdict rests on the branch being correct, plus the ticket's own
recorded observation from 17 Aug.

The ticket's second clause — *"confirm no endpoint accepts a serialized token back and calls
`unserialize()` on request input"* — is a backend code question that cannot be answered from the
outside, and is flagged to the developer rather than claimed.

Exhibit `ev/04_SV-9299_before_after.png`; keys `ev/fix_login_response_keys.json`.

---

## Not treated as faults

* `GET /api/api/sso/check` — the branch's login page calls this with a doubled `/api` prefix and
  gets a 404/401. Pre-existing housekeeping call on the QA branch's SSO gate, unrelated to these
  four tickets, no user-visible effect. Recorded, not raised.
* Production's frontend build number being higher than the branch's — expected, the branch forked
  before that release.

## Honest limits

* The **identity-generation** half of the SV-9298 fix (impersonation enter/exit) was read in the
  shipped source but not driven through the impersonation UI; the login and blip paths were.
* SV-9299's `unserialize()` clause is not externally testable — see above.
* Everything else was observed live on the builds named at the top, on 15 Sep 2026.

---

## Posted

Pre-post gate run at 15:50:31Z: both build markers re-read live and identical to the start of the
pass; all four ticket statuses and priorities re-read; images uploaded as **real Jira attachments**
(not external links) and each comment read back in ADF afterwards.

| Ticket | Comment | Status at posting | Media (all `type: file`) | Table rows |
|---|---|---|---|---|
| SV-9296 | 76568 | Ready for Production | 3 | 10 |
| SV-9297 | 76569 | Ready for Production | 2 | 7 |
| SV-9298 | 76570 | Code Review | 2 | 9 |
| SV-9299 | 76571 | Ready for Production | 1 | 5 |

First line of every comment reads `OVERALL QA STATUS: PASSED`. Voice scan clean.

