# Atlassian / Jira / Confluence Access Method (shared infra, all projects)

> Reusable, success-proven method for reading Jira tickets and Confluence pages at
> `shopview.atlassian.net` when the user supplies login credentials + email OTP codes.
> **This SUPERSEDES the old "Jira/Confluence is SSO-walled → export/paste only" stance:**
> **live browser login is now the PRIMARY method** whenever the user provides creds +
> relays OTP codes; **export/paste is the FALLBACK** when login is unavailable.
> **NO SECRETS IN THIS REPO — EVER.** Passwords, cookies, tokens, and OTP codes live in
> `/tmp` only (chmod 600). This doc contains the METHOD, never a secret value.

---

## 0. Context — why Basic-auth cookies do NOT work

- Jira and Confluence at `shopview.atlassian.net` sit behind **Atlassian SSO + an email
  one-time-code (OTP) MFA challenge**.
- The ShopView app cookies (`sv_sso_session` / `PHPSESSID` / `cf_clearance`, domain
  `.staging.shopview.com` etc.) authenticate ShopView **staging/QA only**. They do **NOT**
  authenticate `atlassian.net`.
- Consequences observed (2026-07-22):
  - Atlassian REST v3 Basic auth with those cookie values as the token →
    `GET /rest/api/3/myself` **HTTP 401** (`Client must be authenticated…`);
    `GET /rest/api/3/issue/<KEY>` **HTTP 404** (`Issue does not exist or you do not have
    permission to see it.`). The 64/32-hex values are ShopView session cookies, NOT
    Atlassian API tokens.
  - `curl` of `/browse/<KEY>` with those cookies → HTTP 200 but only the unauthenticated
    Jira SPA shell (`<title>Jira</title>`, ~732 KB, no ticket data).
  - `WebFetch` of a browse URL → HTTP 403 (SSO wall).
- Therefore: **we log in as a real browser session** to obtain genuine Atlassian session
  cookies, then call the REST API with those.

---

## 1. Login flow (headless Chromium via a FRESH MITM bridge)

Chromium cannot TLS through the egress proxy directly, so build a **FRESH local MITM
bridge per run** (see `build/TESTING-RUNBOOK.md` §"Chromium UI automation" — read
`$HTTPS_PROXY` LIVE each run; the port rotates; do not hard-code or reuse an old bridge).
Browser binary is pre-installed at `/opt/pw-browsers` — **NEVER run `playwright install`**.

Steps the automated session drives:

1. Navigate a browse URL, e.g. `https://shopview.atlassian.net/browse/SV-XXXX`.
2. Atlassian redirects to `id.atlassian.com` with a **two-step login form**:
   a. Enter **EMAIL** (`bilal.muzamil@shopview.com`) → click **Continue**.
   b. Enter **PASSWORD** → click **Log in**.
3. Submitting the password triggers Atlassian to **email a fresh 6-digit OTP** and shows a
   **6-digit email verification code prompt**.
4. The session **holds AT the OTP prompt**, polling a file for the code (see §3).

If any step throws (bridge fails, Chromium won't start, the login page markup changed),
capture a screenshot + the exact error and report — do NOT spin/retry blindly.

**SUCCESS-PROVEN (2026-07-22):** this exact flow LOGGED IN LIVE and ingested the
SV-8479 / SV-8480 / SV-8456 tickets — headless Chromium via a fresh MITM bridge →
`id.atlassian.com` two-step (email → **Continue** → password → **Log in**) → 6-digit
**EMAIL OTP** relayed by the user → authenticated Atlassian session captured →
`GET /rest/api/3/myself` **200** → REST v3 ingest per §5. Live login is confirmed
working, not theoretical.

---

## 2. Secret handling

- Credentials and OTP codes live in `/tmp` ONLY, e.g.:
  - `/tmp/fd-tickets/jira-creds.env` — `email` + `password` (chmod 600).
  - `/tmp/fd-tickets/otp.txt` — the newest OTP code the user relays (chmod 600).
  - `/tmp/fd-tickets/cookies.env` — captured Atlassian session cookies (chmod 600).
- **NEVER** commit, echo, or log any password, cookie, token, or OTP code.
- Before every commit, grep the staged diff for the password / any token and abort if found.

---

## 3. THE MFA RACE (the crux — read this)

**Every password submission emails a NEW code and INVALIDATES all prior codes.** Only the
code from the **NEWEST** email works. The winning pattern:

- Launch ONE **persistent, DETACHED** headless Chromium session and drive it to the OTP
  prompt, then **hold it there**, polling a file (e.g. `/tmp/fd-tickets/otp.txt`) on a
  short interval.
- When the user relays the newest code, write it to that file; the HELD session types +
  submits it **instantly**.
- **NEVER start a fresh login run to "retry."** A fresh run submits the password again,
  which emails yet another code and **invalidates the one the user is currently reading** —
  the classic race that never converges.
- Codes **expire in a few minutes** — relay and submit fast.
- The detached poller **survives across orchestrator/worker turns** (it is a background OS
  process), but the **held browser session + the MITM bridge do NOT survive a container
  restart** — a restart kills both, so an in-flight OTP challenge cannot be resumed and must
  be re-driven.
- **NUANCE (observed 2026-07-22, corrects the older "restart wipes /tmp" note):** `/tmp`
  FILES can PERSIST across a container restart — this session's authenticated Atlassian
  session cookies **and** the already-downloaded ticket bundles were still present after a
  restart, so **re-login was NOT needed** (re-verify with `GET /rest/api/3/myself` → 200 to
  confirm the cookie is still live). **Do NOT rely on it:** the held session + bridge are
  gone regardless. So always **RE-CHECK `/tmp` (cookies + bundles) BEFORE re-triggering an
  OTP** — only start a fresh login (which emails a new code) if the cookie is actually
  stale/absent. This avoids needlessly burning the user's OTP.

Detach pattern: launch the login script with `run_in_background` (or `nohup … &` inside a
single bash command) so it outlives the turn; have it write status/screenshots to `/tmp`
and poll `/tmp/fd-tickets/otp.txt` in a loop.

---

## 4. After login — capture cookies & verify

1. Once the OTP is accepted, capture the **Atlassian session cookies** from the browser
   context to `/tmp` (chmod 600). The key cookies are:
   - `cloud.session.token`
   - `tenant.session.token`
   - `atlassian.account.*`
2. Verify the session is authenticated:
   `GET https://shopview.atlassian.net/rest/api/3/myself` with those cookies → **HTTP 200**
   (returns the account JSON). A 401 means the session did not stick — re-check cookie
   capture / domain.

Node `fetch` ignores the proxy → use **undici `ProxyAgent`** for REST calls (read
`$HTTPS_PROXY` live), or `curl --cacert /root/.ccr/ca-bundle.crt` honoring `$HTTPS_PROXY`.

---

## 5. Ingest via REST v3 (with the captured cookies)

For each ticket KEY:

1. `GET /rest/api/3/issue/KEY?expand=renderedFields,names,changelog&fields=*all`
   — full fields, rendered HTML, field display names, and change history.
2. `GET /rest/api/3/issue/KEY/comment` — all comments (author + date + full body), in order.
3. **Download every attachment** via its `content` URL
   (`GET /rest/api/3/attachment/content/<id>` or the `content` link from the issue JSON) to
   `/tmp`, then **open/analyze each image** (the VIU depends on the visuals — per Standing
   Rule 17, get the COMPLETE attachment set, not a sample).
4. Save one **`requirements-KEY.md` per ticket** (summary/status/type/fields + full
   description + all comments in order + a complete attachment inventory with a description
   of each image/video).

For Confluence pages, the same cookies work against the Confluence REST API
(`/wiki/rest/api/content/<pageId>?expand=body.storage,body.view`); export/paste of the
page remains the fallback.

---

## 6. Roles / who supplies what

- **The user (`bilal.muzamil@shopview.com`) supplies the email OTP codes on request** —
  they read the newest verification email and relay the 6-digit code; we write it to the
  poll file and the held session submits it.
- Credentials (email + password) are provided by the user and stored in `/tmp` only.

## 7. Fallback

If live login is unavailable (no creds, OTP not relayable, login page changed and blocks
automation), fall back to the **export/paste** method: the user exports/pastes each
ticket's full content (title/status/type/fields, complete description, ALL comments in
order, and every attachment/screenshot/video with the files) and it is ingested into
`build/<project>/…/requirements-KEY.md`.

---

## Cross-references
- MITM bridge + Chromium automation details: `build/TESTING-RUNBOOK.md` (§Chromium UI
  automation / §SPA hydration).
- Action recipes: `build/APP-ACTIONS-PLAYBOOK.md`.
- Per-project spec pointers + PO attributions: `CLAUDE.md`.
