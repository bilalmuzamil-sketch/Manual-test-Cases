# ShopView CREDENTIALS — production · staging · QA branches · TestRail · Atlassian

> **Grep for this file as:** `ENVIRONMENT-CREDENTIALS` · `environment credentials` · `prod password` ·
> `testrail password` · `atlassian password` · `staging login` · `qa branch login` · `how do I log in`.
> It is the **one committed place** where ShopView logins live.

**Last measured against the repo: 2026-09-03.** Every fact below is quoted from a committed source and
the source is named on the line. **No login was performed by the pass that wrote this file** — it is a
record, not a test.

---

## 0 · WHY THIS FILE EXISTS, AND THE ONE THING IT MUST NEVER CONTAIN

### 0.1 · The ruling that authorises it

**QA lead, 2026-09-03, verbatim:**

> *"If I share with you the password of anything I will always share when its a dummy account no matter
> if its prod/staging or QA so saving password is absolutely fine for any branch."*

and, earlier the same day, on the production account specifically:

> *"Prod is a test account no problem sharing its password in public repo."*

**Reaffirmed twice, each time after the risk was put to him in full** — that this repository is PUBLIC,
that this sits against Standing Rule 82 as originally written, and that **one password string opens both
TestRail and Atlassian**. On the second occasion the proposed carve-out for TestRail and Atlassian was
put to him explicitly and **he overruled it: include them.** It is his decision. It is recorded here,
not argued with, and it is carried into **Standing Rule 82 as the 2026-09-03 amendment**
(`build/rules/RULES-61-ONWARD.md`).

### 0.2 · 🛑 A COMMITTED PASSWORD IS NOT AUTHORISATION TO USE IT

**Finding a password in this file tells you the login exists. It tells you NOTHING about what you may
then do.** Every standing permission gate is unchanged by his ruling:

- **Standing Rule 6 — TestRail.** *"The ONLY real/production system is TestRail."* **No `add_case`,
  `update_case`, `delete_case`, run write or result write happens without the QA lead's explicit
  per-task go-ahead.** The password in §4 is a **read** convenience. **It is not permission to write,
  and no session may infer permission from its presence here.**
- **Standing Rule 62 — Jira.** The **artefact-creation hold of 2026-08-10 is ACTIVE**: no Jira ticket
  of any type. The password in §5 does not lift it. (TestRail *case creation* is expressly carved out
  of that hold and remains permitted — that carve-out comes from Rule 62, not from this file.)
- **Standing Rule 71 / 38** — Automated cases and foreign cases are still hands-off.
- **Standing Rule 83** — one session drives the shared browser/login at a time.

### 0.3 · A PASSWORD IS NOT A SESSION TOKEN — the one hard limit

**His ruling is about PASSWORDS.** A **live session token is not a password**: it is a bearer credential
that authenticates as an already-signed-in user, and **it rotates and goes stale within hours**. A
committed token is **worse than useless** — the next session would try a dead value and misdiagnose a
rotated cookie as a login failure, which is exactly the false-blocker loop the playbook's
"five false dead-session traps" exists to stop.

**NEVER COMMITTED, under any ruling on this page:**
`sv_sso_session` · `PHPSESSID` · `cf_clearance` · `cloud.session.token` · `tenant.session.token` ·
any JWT · any Figma `figd_` token · any TestRail **API key**.
These live in **`/tmp` only, `chmod 600`** (Rule 82), and
`python3 build/testing-tools/scan_secrets.py --staged` still gates every commit and still fails on all
of them.

### 0.4 · One password, two systems — an operational fact for whoever rotates it

**The same password string currently opens both TestRail (§4) and Atlassian/Jira/Confluence (§5).**
**A change to one is a change to both**, and a rotation must be applied to both entries here and to
`/tmp/testrail/creds.json`, `/tmp/testrail/creds-ui.json` and any Atlassian login harness in the same
pass. Stated so nobody rotates half of it.

---

## 1 · PRODUCTION — `app.shopview.com`

| Field | Value |
|---|---|
| **SPA URL** | `https://app.shopview.com` |
| **API URL** | `https://api.shopview.com` |
| **Account** | `bilal.muzamil+mainadmin@shopview.com` |
| **Password** | `analyst1` |
| **Login method** | `POST https://api.shopview.com/api/login {username, password}` |
| **What it returns** | **HTTP 200** + `Set-Cookie: PHPSESSID`. The session is **PHPSESSID-only** — no SSO cookie, and `cf_clearance` is not needed via the agent proxy. |
| **Authority** | Password recovered from git history (`git show ee7b7e9` — the archived Jira comment on SV-8165; `[REDACTED]` at HEAD). Account, route and behaviour: `build/APP-ACTIONS-PLAYBOOK.md` §K and §A *"PRODUCTION access"*, proven live 2026-07-29 on SV-8721. Committed here under the 2026-09-03 ruling in §0.1. |

**This is a dummy account** — QA lead, 2026-09-03: *"Prod is a test account no problem sharing its
password in public repo."* The long-standing *"rotate the prod credential"* recommendation is **CLOSED
by that ruling and must not be re-raised** (`build/PROD-VS-STAGING-COMPARE-METHOD.md` §1).

### Traps — read all five before you log in

1. **`quick-login` 500s on prod.** The DEV endpoint does not exist there; use the real
   `POST /api/login` above. (§K)
2. **A fresh login EXPIRES the same user's prior `PHPSESSID`** — the old session then answers
   **409 "Session has expired"**. **Log in ONCE per run** and reuse that one session for API +
   browser + cleanup. (§K)
3. **Prefer the `+mainadmin` account precisely because of trap 2** — logging in as the QA lead's own
   everyday prod account would **evict him from his own browser** mid-work.
4. **🔴 Since 2026-09-03, Chromium can NO LONGER TLS straight through `$HTTPS_PROXY` on prod** — every
   navigation returns `net::ERR_CONNECTION_RESET`, exactly as on QA and staging. **The local MITM
   bridge is REQUIRED**: `build/atlassian-login/bridge.mjs`, port in `/tmp/atlassian/bridge-port.txt`
   — **the port rotates, never hard-code it** (`source build/testing-tools/ensure_bridge.sh`). Point
   Chromium at `http://127.0.0.1:<bridgePort>`. The rest of the recipe (login → fe-permissions →
   hydrate `localStorage`) is unchanged. (§K correction, re-proven 2026-09-03 verifying C30354 on
   `/reports/parts-velocity`.)
5. **Node's built-in `fetch` bypasses the egress proxy** in this sandbox (403 *"Host not in allowlist"*
   while `curl` works) → run node with **`NODE_USE_ENV_PROXY=1`**. (§K, proven 2026-07-29.)

**Useful prod ids** (§K, all proven live 2026-07-29): test org
`72b2cc90-6964-4429-a207-76e55f946936` · workplace **Trucks Hill 2**
`b617914c-16e9-4485-8e8b-193cd86aa416` (**has canned lines — seed WOs here**) · **QA Testing**
`8badadec-0344-4bc3-b668-7beaedfefa8d` (no canned lines).

---

## 2 · QA BRANCHES — `<branch>.qa.shopview.com` — **COOKIE ENTRY, NO PASSWORD**

> **QA lead, 2026-09-03, verbatim: *"No staging and QA branches a relooged in through Cookies etc"*.**
> **There is no username/password login to record for a QA branch.** None is recorded here, and none
> is to be hunted for or invented.

| Field | Value |
|---|---|
| **SPA URL** | `https://<branch>.qa.shopview.com` (e.g. `sv9315`, `sv8218`, `sv8582`) |
| **Account** | **None.** You enter as the branch's own **`DEV MODE — QUICK LOGIN`** pseudo-user, `Admin` or `Tech`, populated from `GET /api/quick-login/users`. |
| **Password** | **N/A — none exists for this route, so none is committed.** |
| **Entry credential** | **A session cookie — `sv_sso_session` ONLY, scoped HOST-ONLY.** Supplied **by the QA lead, per branch**, into **`/tmp/qa-cookies/<branch>-sso.txt`** as `sv_sso_session=<value>`, **`chmod 600`**, `/tmp` only. **NEVER committed — §0.3.** |
| **Login method** | `node build/testing-tools/qa-branch-boot.mjs <branch> <route> admin` — it drives a real browser to `/login` and **clicks the `DEV MODE — QUICK LOGIN` → `Admin` button**. |
| **What it returns** | The **SPA itself** performs `POST /api/quick-login`, receives 200, and writes `user`, `fe_permissions_wrapper` and `token` into `localStorage` **from the server's own response** — nothing is hand-assembled. A fresh `PHPSESSID` is minted by that login. |
| **Authority** | `build/APP-ACTIONS-PLAYBOOK.md` §A *"THE AUTHENTIC QA-BRANCH LOGIN"*; `build/skills/14-ACCESS-RESILIENCE.md` §3. Proven live twice on `sv9315` (`v26.35.6-0f8d60b`), 2026-08-31 and 2026-09-02. |

**Carry `sv_sso_session` and nothing else.** Measured as a controlled A/B: `sv_sso_session` +
`cf_clearance` → signed in; **`sv_sso_session` ALONE → signed in**, identical result. `cf_clearance` is
inert on these hosts (app = CloudFront/S3, API = nginx — **no Cloudflare in the path**), and a
`PHPSESSID` you are holding is a cookie you should not be holding.

### Traps

1. **🛑 SCOPE THE COOKIE HOST-ONLY, never `.qa.shopview.com`.** A parent-domain cookie collides with
   the host-only one the login sets — two same-name cookies go up on every request, the server reads
   the stale one, and **`fe-permissions` answers 409 immediately after a 200 `quick-login`**. **That is
   duplicate cookies, not a dead session.** (Observed on `sv9315`; §A trap 2.)
2. **`quick-login` EVICTS every other holder of that branch's session** (Rule 83). One session drives
   the browser at a time — claim `build/LOCKS/browser.lock.md` first. Never call `quick-login`, or
   click the control, on cookies somebody else minted.
3. **A FAILED `quick-login` burns the session** (e.g. `{"key":"tech"}` → 403 "Access denied"). Recovery
   recipe: `build/APP-ACTIONS-PLAYBOOK.md` §A.
4. **A sleeping branch is not a dead token.** The `DEV MODE` panel is absent and `qa-branch-boot.mjs`
   stops with *"no DEV MODE Admin button"*; `/api/quick-login/users` answers **403**. After waking,
   `quick-login` and `fe-permissions` both answer 200 on the **same** `sv_sso_session`.
5. **Judge the session by `fe_permissions.length` + `template_slug`, never by `role.name`.**
6. **Prerequisites, all three:** a fresh MITM bridge (`source build/testing-tools/ensure_bridge.sh`) ·
   `sv_sso_session` alone in `/tmp/qa-cookies/<branch>-sso.txt` · playwright at
   `/opt/node22/lib/node_modules/playwright/index.js`.

---

## 3 · STAGING — `app.staging.shopview.com` — **COOKIE ENTRY, NO PASSWORD**

> **Same ruling as §2** — QA lead, 2026-09-03: *"No staging and QA branches a relooged in through
> Cookies etc"*. **No staging username/password is recorded here, and none is to be invented.**

| Field | Value |
|---|---|
| **SPA URL** | `https://app.staging.shopview.com` |
| **API URL** | `https://api.staging.shopview.com` |
| **Account / password** | **N/A — entry is by session cookie, per his ruling above.** |
| **Entry credential** | **Session cookies supplied by the QA lead**, into `/tmp`, `chmod 600`, **never committed** (§0.3). Historically the set is `sv_sso_session` / `PHPSESSID` / `cf_clearance`. |
| **Login method (recorded)** | `POST /api/quick-login {key:'admin'\|'tech'}` from Node, **gated by those cookies**, followed by hand-writing `localStorage`. |
| **What it returns** | 200 + `data.{token, role, details}` and a rotated `PHPSESSID` — the same shape as a QA branch, but the SPA does not do the writing for you on this route. |
| **Authority** | `build/APP-ACTIONS-PLAYBOOK.md` §A (staging DEV MODE entry, 2026-09-02) · `build/TESTING-RUNBOOK.md` §3 · `build/testing-tools/staging-admin.mjs` `login()` · `build/PROD-VS-STAGING-COMPARE-METHOD.md` §1. |

### What is settled about staging, and what is not

- **✅ SETTLED 2026-09-02:** `https://app.staging.shopview.com/login` **renders a
  `DEV MODE — QUICK LOGIN` panel** with `Admin` and `Tech` buttons, visually identical to the QA-branch
  panel. **Provenance: observed by the QA lead via a screenshot of the live page.** It was **not**
  clicked, executed or reproduced by a session (Rule 12).
- **❌ NOT PROVEN:** that **clicking that panel headlessly completes the login on staging** the way it
  does on a QA branch. The click route on staging is **unexercised end-to-end by any session**, so
  **hand-hydration remains the recorded staging fallback** — not because staging lacks a panel (it does
  not lack one), but because nobody has driven it.
- **❌ NOT PROVEN — and do NOT assume it:** that **`sv_sso_session` ALONE suffices on staging**.
  **Staging sits behind Cloudflare** (`cf_clearance` at the edge), unlike the CloudFront+nginx QA
  branches, **so the QA-branch "one cookie is enough" finding does NOT transfer.**
- **The prod `POST /api/login {username, password}` recipe does NOT transfer to staging** — tried
  2026-08-28, **HTTP 401 `sso_required`** (`build/BLOCKED-shopview-app-session.md`). This is a further
  reason the entry here is cookie-based.
- **We hold no valid staging session cookie.** Stored staging sets return **HTTP 401**
  (register row **R1**). Cookie lifetime is ~**24 h** or until a deploy — plan a long staging run
  inside one window.
- **The QA lead has asked not to be re-prompted for a staging cookie** — raise it only when a named
  piece of work actually needs staging.
- **A 401 `sso_required` on this estate is usually an expired `cf_clearance`, not a dead sign-in** —
  measured against a set where `sv_sso_session` and `PHPSESSID` were byte-identical and only
  `cf_clearance` had changed (§A, the five false-dead-session traps).

---

## 4 · TESTRAIL — `shopview.testrail.io`

> **🛑 READ §0.2 BEFORE YOU USE THIS. Standing Rule 6 is UNCHANGED: TestRail is the ONLY real
> production system we touch.** It holds every test case in the estate. **A committed password is a
> convenience for READING. It is NOT permission to write.** **No `add_case` / `update_case` /
> `delete_case` / run write / result write happens without the QA lead's explicit, per-task go-ahead.**
> A session that finds this password and infers authorisation from it has made the single most damaging
> mistake available in this workspace.

| Field | Value |
|---|---|
| **URL** | `https://shopview.testrail.io` |
| **Account** | `bilal.muzamil@shopview.com` |
| **Password** | `Bb1lal~123` |
| **Login method** | The **web UI** sign-in form at `https://shopview.testrail.io/index.php?/auth/login/`. Used by the Playwright/Froala **UI-repair** path (`fr-view` render repair), which cannot be done over the API. |
| **What it returns** | An authenticated TestRail **web** session — the only route that can flip a field's container from the escaping `<div class="markdown">` to `<div class="markdown fr-view">` (playbook §J). |
| **API access is SEPARATE and is NOT this value** | The TestRail **API key** is a different credential and stays **`/tmp`-only, never committed** (§0.3): `/tmp/testrail/creds.json` → `{"host","user","email","password"}` where **`password` IS the API key**. The web password also lives at `/tmp/testrail/creds-ui.json` for harnesses that read it there. Loader: `build/testing-tools/load_creds.py`. |
| **Authority** | Committed here under the 2026-09-03 ruling in §0.1, on his explicit overrule of the proposed TestRail carve-out. Value byte-confirmed present in this repository's git history at commit `89758f48` (redacted from HEAD by `4631f79b`). Access mechanics: `build/skills/00-COMMON-CORE.md` §3.1, `build/APP-ACTIONS-PLAYBOOK.md` §J, `build/skills/14-ACCESS-RESILIENCE.md` §1. |

**Traps.** `get_sections/1&suite_id=…` → **HTTP 400**: project 1 is **single-suite mode**, so `suite_id`
is rejected and `6597`/`6617`/`6559` are **top-level SECTION ids, not suite ids** — page `get_sections/1`
and `get_cases/1` whole and filter to descendants. **A 400 is not an auth failure.** Paging is mandatory:
an unpaged `get_sections` returns 250 and silently finds zero. Never count from a local snapshot.

---

## 5 · ATLASSIAN — Jira + Confluence, `shopview.atlassian.net`

> **🛑 Standing Rule 62's artefact-creation hold (2026-08-10) is ACTIVE and this password does not lift
> it** — no Jira ticket of any type is created without his explicit per-ask permission. See §0.2.

| Field | Value |
|---|---|
| **URL** | `https://shopview.atlassian.net` (Confluence at `/wiki`) |
| **Account** | `bilal.muzamil@shopview.com` |
| **Password** | `Bb1lal~123` — **the same string as §4; see §0.4.** |
| **Login method** | Headless Chromium → `id.atlassian.com` **two-step form**: enter **EMAIL** → **Continue** → enter **password** → **Log in**. Then the step below, which is the one that actually matters. |
| **What it returns** | An authenticated Atlassian session — **18 cookies captured**, including **`cloud.session.token`**; `/rest/api/3/myself` → **200** and a Confluence page → **200**. `jira.sh` + `cookies.txt` then work from the shell with no browser. Verified end to end 2026-08-26; the whole login took **35 seconds** with **no human in the loop**. |
| **Authority** | `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` (2026-08-26 correction block), verified at source 2026-09-03. Committed here under the 2026-09-03 ruling in §0.1. |

### ⚠️ THERE IS NO OTP ON THIS ACCOUNT — the blocker is an interstitial

**Proven live 2026-08-26: the account has two-step verification switched OFF, so Atlassian NEVER SENDS
AN EMAIL CODE.** A session that waits at `/tmp/atlassian/otp.txt` for a code **will wait forever**, and
asking the QA lead to relay one wastes his time. **Check for the interstitial FIRST; treat the OTP path
as the branch that may never fire.**

1. After the password is accepted the browser parks on **`id.atlassian.com/login/security-screen`**
   showing **"Security review"** with three choices: *Enable two-step verification* /
   **"Continue without two-step verification"** / *Create a passkey*. **The Jira board renders behind
   the modal, which makes it look like the login already succeeded. It has not.**
2. **CLICK "Continue without two-step verification".** It only **DISMISSES** the screen — it changes no
   account setting. **Until it is clicked the browser never reaches `shopview.atlassian.net`, so
   `cloud.session.token` is NEVER ISSUED** and every REST call afterwards fails. Selector:
   `button:has-text("Continue without two-step verification")`. **Poll for it up to 3 times**; it can
   also appear after a code step on accounts that do challenge.
3. **The second trap reads like an auth failure and is not:** verifying with
   `page.evaluate(fetch('https://shopview.atlassian.net/...'))` **while the page is still on the
   `id.atlassian.com` origin** dies with a bare **`TypeError: Failed to fetch`** — that is the
   browser's cross-origin block, **not a 401**. **Navigate to `shopview.atlassian.net` FIRST, then
   capture cookies and call the API.** Assert on real endpoints: `/rest/api/3/myself` **and** a
   Confluence page (`/wiki/api/v2/pages/<id>?body-format=storage`), both **200**.

**`cloud.session.token` is a full JWT. It is a session token, not a password — `/tmp` only, never
committed, and watch what you PRINT as well as what you commit** (§0.3).

---

## 6 · KEEPING THIS FILE HONEST

- **Add a password here only for an account the QA lead has confirmed may be committed**, and record
  his words and the date.
- **Never add a session token, cookie value, API key or JWT** — §0.3, no exceptions.
- **A password here is never authorisation** — §0.2.
- `python3 build/testing-tools/scan_secrets.py --staged` carries a **narrow allowlist keyed to the exact
  values on this page and to this exact path**. It still fails on every other credential, and on these
  values appearing **anywhere else in the repository**. **Do not widen it to make a commit pass** — if
  it fires, the finding is real.
- Linked from: `build/APP-ACTIONS-PLAYBOOK.md` §A · `build/skills/14-ACCESS-RESILIENCE.md` §3 ·
  `CLAUDE.md` §4 standing-infrastructure list · `build/rules/RULES-61-ONWARD.md` rule 82.
