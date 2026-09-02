# VIU Access Method — Live Verification Access (NON-SECRET)

This document records the working method for running Verify-in-UI (VIU) and live
per-role test runs against ShopView in future sessions.

> **NO SECRETS IN THIS FILE.** Never commit cookie values, tokens, session IDs,
> passwords, proxy ports, or CA contents. This file describes *how*, not *what*.
> Session cookies are obtained fresh each session and are never written to the repo
> (Rule 82 — this repo is PUBLIC).

> ### 🔴 READ THIS BEFORE ANYTHING BELOW — THIS FILE WAS REWRITTEN 2026-09-02
> **The canonical recipe is `build/APP-ACTIONS-PLAYBOOK.md` §A "THE AUTHENTIC QA-BRANCH
> LOGIN". Read it there; this file points at it rather than restating it, so the two
> cannot drift.**
>
> Until 2026-09-02 this file taught the **three-cookie + hand-hydration** path
> (`PHPSESSID` + `sv_sso_session` + `cf_clearance`, then hand-writing
> `localStorage["user"]`). **On QA branches that path is SUPERSEDED and is a trap** — it
> is both more fragile and, worse, it silently invalidates permission-dependent verdicts.
> The superseded text is kept below, dated and marked, because someone may be mid-task
> following it and needs to see that it changed and why. **§b and §e are the superseded
> sections.**

---

## 0) THE PROVEN RECIPE — QA branches (`<branch>.qa.shopview.com`)

**Let the APP log itself in. One cookie. Nothing hand-minted.**

Harness: **`build/testing-tools/qa-branch-boot.mjs`**

```
source build/testing-tools/ensure_bridge.sh          # prerequisite (a) — see note below
node build/testing-tools/qa-branch-boot.mjs <branch> [route] [admin|tech]
```

**Re-proven live on `sv9315`, build `v26.35.6-0f8d60b`, on 2026-09-02** — exit 0,
`localStorage["user"]` present, landed on `/customers` (not `/login`),
`GET /api/auth/me/fe-permissions` → **200**, `fe_permissions.length` = **40**,
`template_slug` = **`administrator`**.

### The five things that make or break it — all measured, none guessable

1. **`sv_sso_session` ONLY.** Do **not** carry `PHPSESSID` into the browser: quick-login
   rotates it, and a stale one is the whole "409 Session has expired" latch.
   `cf_clearance` is not needed either — QA-branch hosts are CloudFront + nginx, not
   Cloudflare. The cookie lives in `/tmp/qa-cookies/<branch>-sso.txt` at `chmod 600`,
   `/tmp` only, **never committed**.

2. **SCOPE COOKIES HOST-ONLY — never to `.qa.shopview.com`.**
   **🔍 THE SYMPTOM TO RECOGNISE: a `409` on `fe-permissions` IMMEDIATELY AFTER a `200`
   on quick-login.** That is a *duplicate same-name cookie*, not a dead session: a
   domain-scoped `PHPSESSID` plus the host-only one quick-login sets means two
   `PHPSESSID`s reach the API host and the server reads the stale one. It is a correct
   login that looks failed, and it is routinely misdiagnosed as "the cookies are dead"
   or escalated as a blocker. **Fix the scoping; do not re-request cookies.**

3. **Click the branch's own `DEV MODE — QUICK LOGIN` control in a real browser.** Every
   QA branch's sign-in screen carries it, populated from `GET /api/quick-login/users`
   (observed 2026-09-02: exactly two entries, `admin` → label "Admin" and `tech` →
   label "Tech"). Clicking one makes the SPA call `POST /api/quick-login` itself and
   write `user` / `fe_permissions_wrapper` / `token` from the response. So land on
   `/login` FIRST so the panel renders.

4. **Use `button:has-text("Admin")` — `getByRole('button', { name })` does NOT match
   Quasar `q-btn`.** This is the single most common reason a correct script reports
   "no DEV MODE button".

5. **Chromium cannot TLS through the egress proxy.** A **fresh local MITM bridge per
   run** is required and **its port rotates within a session** — always read
   `/tmp/atlassian/bridge-port.txt`, never hard-code a port. Use
   `ensure_bridge.sh`, which restarts the bridge when its captured egress no longer
   matches `$HTTPS_PROXY`.
   **⚠️ `ensure_bridge.sh` does NOT generate the bridge's TLS cert.** If
   `/tmp/atlassian/mitm.key` is absent the bridge dies with `ENOENT` and the port file
   stays empty. Generate it first — the recipe (with the wide SAN list you actually
   need) is in playbook §A(2). Observed again 2026-09-02.

### 🛑 NEVER HAND-MINT `localStorage["user"]`

A fabricated `user` object means the **role and permissions come from a blob we wrote,
not from the server**. Every permission-dependent verdict built on it is invalid —
**Rule 12** (verified means observed, never inferred) and **Rule 26** (reset roles to
template/default before any permission verification). There is no need for it: the app
mints it for you. **A script that writes `localStorage["user"]` is a defect, not a
shortcut.**

### 🛑 JUDGE THE SESSION BY `template_slug`, NEVER BY `role.name`

Observed on `sv9315` 2026-09-02: the `admin` quick-login user's `user.data.role.name`
reads **"Tech View"** while `fe-permissions` reports `template_slug` =
**`administrator`** with 40 permissions. `role.name` is a per-branch display label and
will make a correct admin login look like it landed on the wrong role. **Assert on
`template_slug` + permission count.**

### EVICTION — one session per branch, and a mid-test 401/409 is a RE-BOOT

**Every quick-login ROTATES that branch's `PHPSESSID`.** So **two sessions on one QA
branch will evict each other** — that is expected branch behaviour, not a fault. One
session per branch (**Rule 83**). A mid-test 401/409 is **NOT a blocker and NOT a
reason to contact the QA lead**: run the harness again and carry on. Never persist a
`PHPSESSID` between runs; carry `sv_sso_session` only, which does not rotate.

---

## 0a) STAGING (`app.staging.shopview.com`) — WHAT IS ACTUALLY PROVEN

**Do not assume staging behaves like a QA branch.** Established from the repo record on
2026-09-02:

- **Quick login DOES exist on staging and was used throughout the Custom Roles
  project** — but as the **API endpoint** `POST /api/quick-login {key:'admin'|'tech'}`,
  gated by the three session cookies, **not** by clicking a DEV MODE panel.
  Evidence: `build/TESTING-RUNBOOK.md` §3 · `build/testing-tools/staging-admin.mjs`
  `login()` · `build/APP-ACTIONS-PLAYBOOK.md` §A · `build/custom-roles-run/RUN331-STATE.md`.
- **✅ SETTLED 2026-09-02 — STAGING'S `/login` DOES RENDER A `DEV MODE — QUICK LOGIN`
  PANEL** with `Admin` and `Tech` buttons, visually identical in placement and labelling
  to the QA-branch panel; the login card also carries a normal **email + password** form
  above it. **PROVENANCE: observed by the QA lead via a screenshot of the live staging
  login page, 2026-09-02** — **not** executed or reproduced by a session, and **not** a
  proof that the staging quick-login *flow* works headlessly, only that the panel
  renders. **This retires the line that used to sit here** (*"has never been observed"*).
  The negative remark *"DEV login buttons don't reliably work"*
  (`build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md`) **can no longer mean the
  panel is absent**; the QA-branch selector bug is now a **more likely, still not
  demonstrated,** explanation of it on staging. `boot2` hand-hydrated because no session
  had driven the click route there — **not** because the panel was missing.
- **🟡 STILL OPEN — whether clicking that panel HEADLESSLY on staging completes the
  login.** The rendering is settled; the click-through is not. Every recorded staging use
  is still the API route plus hand-hydration, so **hand-hydration remains the recorded
  staging fallback** until someone proves the click route with a valid staging session.
- **🟡 STILL OPEN — Staging is behind Cloudflare** (`cf_clearance` at the edge), unlike
  the CloudFront + bare-nginx QA branches. So even trap 1 above — "`sv_sso_session` only"
  — is **unproven on staging**, and **the QA-branch finding that `cf_clearance` is inert
  does NOT transfer.**

⇒ `build/testing-tools/staging-boot2.mjs` now delegates to the proven QA-branch recipe,
but **keeps its NOT-YET-VERIFIED-LIVE marker for staging, NARROWED to the two open
questions above** — the panel question is closed. **We hold no staging `sv_sso_session`**
and stored staging cookies return 401 (`build/BLOCKED-shopview-app-session.md`), so the
remaining two could not be settled live; **do not attempt a staging login, and do not
re-prompt the QA lead for a staging cookie.**

---

## a) Network egress

- Staging lives behind `*.staging.shopview.com`; QA branches behind
  `*.qa.shopview.com` (API host is `<branch>api.qa.shopview.com` — **no dot before
  `api`**). The sandbox must allow egress to those hosts. Set the environment's
  **Network access = Full** before starting; a restricted allowlist will block the
  API/app hosts and the run cannot proceed.
- **Never disable TLS verification and never unset `HTTPS_PROXY`** to work around a
  transport failure.

---

## 🟠 b) SUPERSEDED 2026-09-02 — Obtain the 3 session cookies

> **SUPERSEDED for QA branches on 2026-09-02.** Carrying `PHPSESSID` and `cf_clearance`
> into the browser is the **cause** of the 409-after-200 latch (trap 2 above), not a
> requirement. **On a QA branch, carry `sv_sso_session` and nothing else.**
> Still descriptive of **staging**, whose API quick-login is gated by all three and
> which does sit behind Cloudflare (§0a).

From a live `app.staging` browser login, obtain these three cookies:

- `PHPSESSID` — the app/API session cookie.
- `sv_sso_session` — the SSO session; **longer-lived** than the other two.
- `cf_clearance` — the Cloudflare clearance cookie (required to pass the edge).

Read them from the live authenticated browser session. Do **not** paste their
values into the repo, logs, or commit messages.

## c) Session lifetime

- **Corrected:** cookies last **~24 hours**, expiring only after ~24h **or a new
  deployment** — not after ~1h (playbook §A). A 401 `sso_required` / 409 before 24h
  ⇒ suspect a deployment or a stale set, or **on a QA branch suspect eviction or the
  scoping trap first** (§0). `sv_sso_session` outlives the others and does not rotate.
- *(The original text here said "~1 hour". Kept visible as corrected, not deleted.)*

## d) Build a FRESH MITM bridge per session

- Build a new Chromium-TLS → Node-fetch bridge **each session**; use
  `source build/testing-tools/ensure_bridge.sh` rather than hand-rolling it, and see
  the cert warning in §0 trap 5.
- Run Node with `NODE_USE_ENV_PROXY=1` and `NODE_EXTRA_CA_CERTS` pointing at the
  current agent-proxy CA bundle, and have it read the **current** `$HTTPS_PROXY`
  from the environment at start-up.
- **The proxy port rotates *within* a session, not merely between sessions.** Do NOT
  reuse an old bridge or a hard-coded port. A still-alive bridge can be pointed at a
  dead egress port; the symptom is `net::ERR_PROXY_CONNECTION_FAILED` on the first
  navigation, which looks like a broken site and is neither. `ps` showing the bridge
  running is **not** proof it works.
- **curl through the bridge needs `--cacert /tmp/atlassian/mitm.crt`.**

## 🟠 e) SUPERSEDED 2026-09-02 — Hydrate via the SPA dev-login

> **SUPERSEDED for QA branches on 2026-09-02.** "Hydrate the SPA" here meant, in
> practice, **hand-writing `localStorage["user"]` and `fe_permissions_wrapper`** after an
> API quick-login (see `build/filters/build-verify-2026-08-19/tools/mobile.mjs`, still
> doing this on 2026-08-19). **That is barred** — it makes role and permissions ours
> rather than the server's and invalidates every permission-dependent verdict (Rules 12,
> 26). On a QA branch, **click the DEV MODE panel and let the app hydrate itself** (§0).
> **Staging HAS the same panel** (QA lead's screenshot, 2026-09-02 — §0a), but **no
> session has driven the click route there**, so on staging hand-hydration is still the
> recorded fallback until it is proven — §0a.

- Hydrate the SPA through the dev-login (Admin / Tech buttons), which performs the
  real `fe-permissions` hydration path.
- The cookie owner is **read-only** over the raw API, so any **writes** (role
  create/edit, staff assignment) must go through the **Admin dev-login session**,
  not raw-API calls under the cookie owner. *(This half still holds.)*

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

> **Rule 26 reminder:** reset roles to template/default **before** any
> permission/role verification on a shared environment. The staging org is SHARED —
> never assume env state; re-read it live before asserting.
> **Standing rule: the ADMIN role is NEVER changed — swap the TECH role.**

## g) ALWAYS restore + clean up

After every per-role session, restore state:

- Restore Tech to its default role, then **delete** the temporary "BILAL AUTOMATION"
  role.
- **⚠️ Confirm the restore target live before using it.** The `role_id`
  `77b069d1-19dd-4a7f-a541-819bd3cd7cde` recorded in the original version of this file
  **does not exist on staging** — `build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md`
  records Time Clock User as `a0359055-3dfb-4e9c-9e11-2fbea21585c2` on staging and says
  plainly *"the old `77b069d1-…` does NOT exist on staging — do not use it"*. Safety
  net: `build/testing-tools/staging-restore-tech.mjs`.

Do this even if the run is interrupted, so the shared staging shop is left clean.

## Known-good endpoint list

| Purpose | Endpoint |
|---|---|
| Quick-login user list (populates the DEV MODE panel) | `GET /api/quick-login/users` |
| Quick-login (the app calls this itself when you click the panel) | `POST /api/quick-login {key:'admin'\|'tech'}` |
| SSO auth check | `GET /api/sso/check` (note: the build calls the doubled `/api/api/sso/check` — a bug, VIU-23; still observed returning 404 on sv9315, 2026-09-02) |
| Effective FE permissions (poll) | `GET /api/auth/me/fe-permissions` |
| Roles list / read | `GET /api/roles` |
| Create / update role | `PUT /api/roles/{id}` |
| Delete role | `DELETE /api/roles/{id}` |
| Assign role to staff | `POST /api/staff/{id}/change` |
| Staff list / read | `GET /api/staff` |
| Switch workplace | `POST /api/iam/change-location` |
| Digital Inspections templates (feature-presence check) | `GET /api/inspection-templates` |

`fe-permissions` response shape (observed live, sv9315, 2026-09-02):
`data.{fe_permissions[], view_mode, cross_toggles, template_id, template_slug, system_role}`.

### Reference IDs (non-secret)

- Tech staff id: `6fb22c1b`
- Temp role name: `BILAL AUTOMATION`
- Restore target role_id: **look it up live** — see §g. The previously recorded
  `77b069d1-…` is wrong for staging.
