# ShopView App Actions Playbook — Proven Per-Action Recipes (NON-SECRET)

> ## 🟥 READ-FIRST — NEVER RE-DISCOVER
> **Every test / VIU / staging worker MUST read this playbook (the "STAGING ACTION
> RECIPES" index directly below) AND `CLAUDE.md` "Durable key facts" BEFORE doing ANY
> staging/QA action** — create a WO, add a part, add a fee/discount, switch a role,
> change location, hit an endpoint, drive a UI flow, log into Jira, push to TestRail.
> **REUSE the recorded recipe — do NOT re-derive an endpoint / ID / payload / UI path /
> gotcha-fix that this session (or another) already proved.** Re-discovering known
> actions from scratch wastes testing time; that is exactly what this file exists to
> prevent (user directive 2026-07-27).
>
> **The MOMENT you discover a NEW working recipe** (a new endpoint, payload field, ID,
> UI click-path, or the concrete gotcha-fix that unblocked success) — **append it here
> immediately, in the same session.** Success-proven knowledge ONLY (never failed
> attempts / dead-ends), per "Keeping this current" at the bottom. This is Standing
> Rule 27 in `CLAUDE.md`. **NO SECRETS EVER** — cookie NAMES only, never values.

> ## 🔴 THIS REPOSITORY IS **PUBLIC** — READ BEFORE WRITING ANYTHING TO DISK
>
> `bilalmuzamil-sketch/Manual-test-Cases` is `"private": false`. **Everything committed
> here is world-readable the moment it is pushed**, and the default branch is the one a
> visitor lands on. That fact changes what may be written to disk at all — it is not
> merely a reason to be tidy.
>
> **PROVEN INCIDENT (2026-08-11).** **12 Mercure JWT bearer tokens** were found in **13
> tracked files** (14 occurrences). Eight had been public **since 4 August**. Every
> earlier secret scan passed, because the patterns looked for **cookie prefixes** and
> **`eyJ` was not among them**.
>
> **THE REASONING THAT FAILED US, so it is not repeated:**
> **A JWT IS A CREDENTIAL EVEN WHEN IT IS SHORT-LIVED AND NARROWLY SCOPED.**
> *"It expires in ten minutes"* and *"it only grants read access to one topic"* are
> statements about **blast radius**, not arguments for committing it. A signed token is
> also an **offline oracle for brute-forcing the signing key**, and **that risk does not
> expire when the token does.**
>
> **THE HARNESS CAUSE — and it was NOT an `Authorization` header.** The capture
> (`build/schedule/build-viu-2026-08-11/tools/step9_staffdiag.cjs`) did
> `body=JSON.stringify(j).slice(0,600)` — **the first 600 characters of EVERY JSON
> response body** — and `/api/notifications/subscribe-token` exists purely to **return a
> token**. There were **zero `Bearer` literals** in the repo, so a scan for request
> headers would have found nothing. **Response bodies leak credentials just as readily as
> request headers, and are far less watched.**
>
> **THE FIX — REDACT AT THE POINT OF CAPTURE, NOT BEFORE COMMIT.** Keep the header/key
> name so the evidence stays diagnostically useful; replace only the value. A `scrub()`
> helper doing exactly this is now in both `step9*_staffdiag.cjs` and is the pattern to
> copy into any new capture harness.
>
> **THE SCANNER — `build/testing-tools/scan_secrets.py`.** Run it before every commit:
> ```
> python3 build/testing-tools/scan_secrets.py --staged     # exits non-zero on a hit
> python3 build/testing-tools/scan_secrets.py --selftest    # proves it BOTH ways
> ```
> It covers JWTs, `Bearer`/`Basic` values, literal `Authorization` headers, `set-cookie`
> and session-cookie **values**, the known cookie prefixes, `figd_` Figma tokens, private
> keys, cloud/GitHub/Slack tokens, and literal password assignments. It deliberately
> **distinguishes a reference from a value** — `'Basic ' + AUTH` and
> `"${CK.sv_sso_session}"` do **not** trip it, because a scanner that cries wolf gets
> switched off and then protects nothing.
> **It ships with NO secret material**: this repo is public, so committing the real
> passwords *even hashed* would publish a brute-forceable target. Run
> `--build-fingerprints` to hash the real `/tmp` credentials **into `/tmp`**, where the
> scanner picks them up automatically.
> **A scanner that only ever passes proves nothing** — it is tested in both directions
> (clean tree ⇒ exit 0; a real token recovered from git history ⇒ exit 1).
>
> **⚠️ REDACTION DOES NOT UNDO EXPOSURE.** Cleaning the files at HEAD leaves the tokens
> **in git history**, and on a public repo anything pushed must be assumed already cloned,
> forked and cached by third parties. **Rotation of the signing secret is the only control
> that actually revokes them** — that is the QA lead's decision, not a worker's.

**How to use this.** This is the durable "how to do X in ShopView" reference, mined
from ~2.5 weeks of committed test artifacts (VIU runs, the by-role regression run,
custom-roles run 312, and the bug-fix re-test). Each recipe gives the concrete
**UI path** (click-path from the top nav + SPA route), the **API endpoint(s)** the
button actually calls (verb + key payload fields), **Preconditions**, the
**Gotcha/Unblock** that got the action working, and a **Confidence** grade. Use it
so future runs *reuse* a proven procedure instead of re-researching each action.
When you need to do something listed here, follow the recipe; only re-investigate
genuinely new actions, and then **add them here** (see "Keeping this current").

> **Access/setup** (cookies, MITM bridge, boot2 hydration, quick-login, role
> assignment, restore) is in **`build/TESTING-RUNBOOK.md`**. Non-secret **ids and
> rules** (staff_id, org id, role ids, enforcement model) are in **`CLAUDE.md`**.
> **NO SECRETS EVER** — every value below is a non-secret identifier or an endpoint.

**Confidence legend:** `High` = executed end-to-end with the endpoint + HTTP status
observed in the artifacts. `Medium` = affordance/gate confirmed but full flow not
driven in the harness. `(verify)` = named in the task/spec but **not** directly
evidenced in the committed artifacts — confirm before relying on it.

**Base URLs:** SPA `https://app.staging.shopview.com` · API
`https://api.staging.shopview.com` (all `/api/...` paths below are on the API host).

---

# STAGING ACTION RECIPES (quick-reference index)

> ## 🔧 RECIPE — DRIVING A **QA BRANCH** SPA WITH PLAYWRIGHT, END TO END (proven 2026-08-31 on `sv8218`)
>
> **Four things must all be true or the browser never reaches the app. Each one failed in turn on
> 2026-08-31 and each failure has a distinct, misleading symptom.** Working harness:
> `build/invoice-ui-refresh/build-verify-2026-08-31/tools/boot8218.mjs` — copy it, change the host.
>
> **(1) THE MITM BRIDGE MUST BE FRESH, BECAUSE THE EGRESS PROXY PORT ROTATES *WITHIN* A SESSION.**
> Symptom: chromium returns **`net::ERR_PROXY_CONNECTION_FAILED`** on every navigation while `curl`
> through the egress proxy still works. Cause: the running bridge holds the egress port it was
> started with; `$HTTPS_PROXY` had moved (`:46015` → `:45521`) and the bridge process was gone.
> **Do not debug the app — restart the bridge and re-read `$HTTPS_PROXY` LIVE.**
> ```sh
> ps aux | grep -c "[b]ridge.mjs"                    # 0 = dead, and the port file is a lie
> rm -f /tmp/atlassian/bridge-port.txt
> export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_USE_ENV_PROXY=1
> setsid nohup node build/atlassian-login/bridge.mjs > /tmp/atlassian/bridge.log 2>&1 < /dev/null &
> curl -s -o /dev/null -w '%{http_code}\n' -x http://127.0.0.1:$(cat /tmp/atlassian/bridge-port.txt) \
>      -k https://<branch>.qa.shopview.com/index.html      # expect 200
> ```
>
> **(2) THE BRIDGE NEEDS ITS CERT GENERATED FIRST, AND THE DOCUMENTED SAN IS TOO NARROW.**
> Symptom: `ENOENT: no such file or directory, open '/tmp/atlassian/mitm.key'`. The `openssl` line in
> `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` covers only `*.atlassian.net` — **add the hosts you actually
> need**: `-addext "subjectAltName=DNS:*.atlassian.net,DNS:*.atlassian.com,DNS:*.testrail.io,DNS:*.qa.shopview.com"`.
> **✅ 2026-09-02 — YOU NO LONGER RUN THIS BY HAND: `build/testing-tools/ensure_bridge.sh` GENERATES
> THE PAIR ITSELF**, idempotently, from exactly this recipe (SAN widened once more, with
> `DNS:*.staging.shopview.com`) — and it now **exits non-zero** if the bridge comes up with no port or
> no egress instead of reporting success. Use the launcher; keep this line as the authority for what
> it emits, and widen its `SAN=` variable if you need another host.
>
> **(3) 🔑 COOKIES ALONE DO NOT GET YOU IN — THE SPA NEEDS `user` + `token` IN `localStorage`.**
> **🟢 SUPERSEDED 2026-08-31 — PREFER THE UI ROUTE, and read §A "THE AUTHENTIC QA-BRANCH LOGIN"
> FIRST.** The hydration below still works, but you no longer need it and it is the more fragile
> path. **Click the sign-in screen's `DEV MODE — QUICK LOGIN` → `Admin` button in the browser and the
> app mints and writes all of `localStorage` itself, from ONE cookie (`sv_sso_session`) — no
> `PHPSESSID`, no `cf_clearance`, no 409, and nothing hand-assembled.** Harness:
> `build/testing-tools/qa-branch-boot.mjs`. Proven on `sv9315`, 2026-08-31. Keep reading only if a
> branch has no DEV MODE panel.
> Symptom, and it looks like dead cookies but is not: the API probe returns **HTTP 200 with a real
> permissions payload**, yet the browser lands on **`/login?redirect=/workorders`** showing the
> sign-in form. Seeding `fe_permissions_wrapper` alone is not enough.
> **The fix — mint a real session, then hydrate all three keys:**
> ```
> POST /api/quick-login {"key":"admin"}   ->  200, data.{token,role,details} + a ROTATED PHPSESSID
> localStorage: user = {data:{token,role,details}} · fe_permissions_wrapper = <fe data> · token
> then goto the real route  (order matters: cookies -> land on /login -> write localStorage -> navigate)
> ```
> **Swap the rotated `PHPSESSID` into your API cookie header too**, or subsequent API calls answer 409.
> **Use `{"key":"admin"}` first** — a failed `{"key":"tech"}` burns the session and everything then
> 409s (core §6.2). **And quick-login EVICTS any other worker on that branch**, so confirm with the QA
> lead that nobody else is driving it (Rule 83).
>
> **(4) THE HOST HAS NO DOT BEFORE `api`.** `sv8218api.qa.shopview.com`, never `sv8218.api…`. And
> **probe the `…api.` host, never the app host** — the SPA serves `index.html` for any unmatched path,
> so a 200 from the app host proves nothing (core §6 trap 2).
>
> **Landing proof to assert, so a false success cannot pass:** the URL must NOT match `/login`, the
> page title is the real screen (`Work Orders | ShopView`), and `document.body.innerText` is a
> four-figure character count of real content — not the 225 characters of the sign-in form.

Consolidated, copy-paste-ready staging/QA recipes so no worker re-discovers a proven
action. Each is terse: **what · method+endpoint (minimal payload) · the gotcha · helper
location · source**. Fuller per-action detail (UI click-paths, confidence grades) is in
the sections further down (Navigation Map, WORK ORDERS, PARTS, etc.) and in the dated
"proven" appendices. **Helpers live in `build/testing-tools/`** (`staging-admin.mjs` =
`login()`/`api()`/`changeLocation()`; `staging-boot2.mjs` = `boot2()` SPA hydration;
`staging-bridge.mjs` = fresh MITM bridge; `testrail-api.mjs` = TestRail). **Do NOT invent
any endpoint/ID not recorded here or in `CLAUDE.md`** — if only partly known, it is marked
"(verify)".

**Index:**
[A. Auth & session](#a-auth--session) ·
[B. Environment / location](#b-environment--location) ·
[C. Work Orders](#c-work-orders) ·
[D. WO Lines](#d-wo-lines) ·
[E. Parts](#e-parts) ·
[F. Adjustments / Fees & Discounts](#f-adjustments--fees--discounts) ·
[G. Roles & permissions testing](#g-roles--permissions-testing) ·
[H. Settings](#h-settings) ·
[I. UI automation (Quasar)](#i-ui-automation-quasar) ·
[J. TestRail API](#j-testrail-api) ·
[K. PRODUCTION access & fix-verification](#k-production-access--fix-verification-sv-8721-proven-2026-07-29) ·
[L. Git practice with parallel workers](#l-git-practice-with-parallel-workers) ·
[M. Figma: extract ALL frames from a design link](#m-figma-extract-all-frames-from-a-design-link-proven-2026-07-31-filters) ·
[N. Report Suite QA branch `sv8582`](#n-report-suite-qa-branch-sv8582--reporting-api--report-ui-recipes-proven-2026-08-03) ·
[O. Filters QA branch `sv8785`](#o--filters-qa-branch-sv8785-the-filter-bar-recipes-proven-2026-08-04) ·
[P. Schedule QA branch `sv8685`](#p--schedule-qa-branch-sv8685-api-shapes-that-cost-real-time-proven-live-2026-08-06-build-v35-7ec992f) ·
[Jira/Confluence access](#jiraconfluence-access) ·
[Filing a defect ticket (Story Defect shape, fields, conversion)](#filing-a-defect-ticket--the-organisations-required-format-all-projects-all-future-tickets)

---

## A. Auth & session
- **Quick-login (admin/tech):** `POST /api/quick-login {key:'admin'|'tech'}` → 200 + a fresh
  `PHPSESSID`. Gated by valid session cookies. Prefer quick-login SSO over raw-cookie API (raw
  can 409). Both `{key:'admin'}` and `{key:'tech'}` return 200 on staging (tech-403 is fixed;
  on qb, tech quick-login is FLAKY — retest each run). Helper: `login(key)` in `staging-admin.mjs`
  (returns `{sessCookie, data, status}`; rebuilds cookie with the fresh PHPSESSID, keeps
  `cf_clearance` + `sv_sso_session`). *Source: CLAUDE.md Durable key facts.*
- **Cookie names / domain (values are SECRETS — `/tmp` only, NEVER in repo):** `sv_sso_session`,
  `PHPSESSID`, `cf_clearance`; staging domain `.staging.shopview.com`, qb domain `.qa.shopview.com`.
  Helpers read them from `/tmp/cln/cookies.json`.
- **Cookie lifetime ~24 HOURS** — expire only after ~24h OR a new deployment; they do NOT expire
  after ~1h (plan long VIU runs in one window). A 401 `sso_required` / 409 before 24h ⇒ suspect a
  deployment or stale set → re-request cookies. *Source: CLAUDE.md.*
- **Diagnostic ladder:** no cookies → 401; `sso_required`/only sso+cf → 409; **poisoned shared
  PHPSESSID → 500 on everything** (API root still 200). Fix a poisoned session: re-run quick-login
  `{key:'admin'}` WITHOUT sending the old PHPSESSID → fresh PHPSESSID → all 200 again.
- **🔑 `POST /api/login {username,password}` DOES NOT WORK ON STAGING OR ON A QA BRANCH — it is SSO-gated
  (proven 2026-08-28, VIU lane).** Both hosts answer **HTTP 401
  `{"error":"sso_required","sso_redirect_url":"https://auth.<env>.shopview.com/login?return_to=..."}`**
  to an empty-body POST: staging → `auth.staging.shopview.com`, QA branch → `auth.qa.shopview.com`.
  **So the §K PRODUCTION recipe (`POST /api/login` → 200 + a fresh `PHPSESSID`) IS PROD-ONLY AND DOES
  NOT TRANSFER.** Consequence, and it is the useful half: **a ShopView username and password cannot
  mint a staging/QA session** — the session must come from a browser SSO login through
  `auth.<env>.shopview.com`, or from the QA lead as a cookie set. Asking him for "a username and
  password instead of cookies" is therefore a dead end; ask for the **three cookies** (or for someone
  to drive the SSO login).
  **The `quick-login` half of this was ALREADY RECORDED — see §A's own "quick-login is SSO-gated too and
  returns HTTP 401 `sso_required` as well" entry; re-confirmed by probe on `sv9500api` 2026-08-28 and
  deliberately NOT restated here, because a duplicated fact drifts** (the reason skills `10`/`11`/`12`
  became routers).
  **🔑 THE ROOT CAUSE, WHICH IS WHY NO SESSION CAN BE SELF-MINTED HERE:** the app authenticates via
  **Google SSO (OIDC to `accounts.google.com` via `auth.<env>.shopview.com`)**. A quick-login from a
  fresh cookie jar **redirects to the real Google sign-in page**, and there is no Google-SSO
  automation in this workspace — evidence `build/viu-testrail/results-misc.json`
  (`actual_ui_observation`). **So cookies are mintable ONLY by the QA lead**, exactly as
  `OUTSTANDING-ITEMS-REGISTER.md` row **SCH-BV-1** states. **Drop paths already in use, so use one of
  them rather than inventing a path:** `/tmp/staging-cookie.txt` (single-line header form) or
  `/tmp/cln/cookies.json` (json form); a QA branch set went to `/tmp/sv9500/cookies.txt` on
  2026-08-28.
- **🆕 2026-09-02 — THE API HOST IS `sv9315api.qa.shopview.com`, AND A CURL TO `/api/...` ON THE APP HOST
  IS A SILENT TRAP.** `curl https://sv9315.qa.shopview.com/api/work-orders/statuses` answers **HTTP 200
  with the SPA shell** (`<!doctype html><title>ShopView</title>`), not JSON, and not an error — so a
  session can read it as "the endpoint returned 200" and conclude something false about the data. The
  API lives on the **separate `sv9315api` host** (§A's "no dot before `api`" rule), and the app's own
  first authenticated call is `GET https://sv9315api.qa.shopview.com/api/api/sso/check` — note the
  **doubled `/api/api/`**, which is what the front end actually requests.
  **⇒ Any 200 whose body starts `<!doctype html>` is NOT an answer. Assert JSON before believing a
  reply.**
- **✅ 2026-09-02 (LATER) — THE TWO BULLETS BELOW WERE MY OWN MISDIAGNOSIS. THE SESSION WAS NEVER DEAD,
  AND `qa-branch-boot.mjs` SIGNED IN FIRST TRY ON THE SAME CREDENTIALS.** Run log: build
  `v26.35.6-0f8d60b`, landed on `/customers` (2,867 body chars vs 225 for sign-in),
  `GET /api/auth/me/fe-permissions` **200**, `fe_permissions_wrapper.template_slug`
  **`administrator`**, **41** permissions.

  **What I got wrong, and it is worth naming precisely:** I scoped the cookies to
  **`.qa.shopview.com`**, so a domain-scoped `PHPSESSID` was sent alongside the host-only one
  quick-login sets — two same-name cookies, the server read the stale one, and `fe-permissions`
  answered **409 immediately after a 200 quick-login**. **That is trap 2 in §A, recorded on 2026-08-31,
  and its symptom is exactly "the QA lead's session must be dead".** It is not. I then reported the
  session as destroyed and asked him to re-mint. **A 409 right after a 200 quick-login is duplicate
  cookies, never a dead session** — check the cookie scoping before you tell anybody their session is
  gone.

  **Two field locations, because looking in the wrong place produced a `null` I nearly reported:**
  `template_slug` and `fe_permissions` live in **`localStorage["fe_permissions_wrapper"]`**, NOT in
  `localStorage["user"]` — `user.data` holds only `{token, role, details}`, and `user.data.role`
  has **no** `templateSlug`/`template_slug` field at all. `user.data.role.fePermissions.length` does
  exist and agrees with the wrapper. **Permission count observed today is 41, against 42 recorded on
  2026-08-31** — one difference, so read it, never assert the remembered number.

  **The keys the app mints for itself** (proof nothing is hand-assembled): `user`,
  `fe_permissions_wrapper`, `bookkeeping_enabled`, `organization_features`,
  `organization_features_timestamp`, `location`, `current_shop_id`, `timezone`, `country_code`, `mode`.

- **🛑🛑 2026-09-02 — I KILLED A WORKING QA SESSION BY CLICKING THE LOGIN PAGE'S OWN "Admin" BUTTON.
  NEVER CALL QUICK-LOGIN ON A SESSION YOU DID NOT MINT.** The sequence, verbatim from the run logs:

  | Time | What happened |
  |---|---|
  | before | `GET /api/auth/me/fe-permissions` **200**; 2,821 work orders paged with the QA lead's cookies |
  | — | the app still landed on `/login` even after a full SPA boot with cookies pre-seeded on all three hosts, so I used the branch's own quick-login control, as instructed |
  | click | the login page's **`Admin`** button fires **`POST /api/quick-login`** → **200** |
  | immediately after | `GET /api/auth/me/fe-permissions` → **409 `{"errors":[{"error":"Session has expired."}]}`** |
  | and in a FRESH context with the ORIGINAL cookies | **409 `Session has expired.`** — the QA lead's own session was gone |

  **`POST /api/quick-login` ROTATES THE SHARED SESSION SERVER-SIDE AND EVICTS EVERY OTHER HOLDER OF IT**
  (Rule 83 says exactly this: *"quick-login EVICTS any other worker on that branch"*). With an
  SSO-minted session it answers **200 and hands back a PHPSESSID that 409s for ever** — the QA lead's
  words: *"persist that cookie and you are latched into permanent logout."* The 200 is not success.

  **⇒ THE RULES, and they are absolute:**
  1. **Do not call quick-login — or click a quick-login control — on cookies somebody else minted.**
     It is not a read. Rule 83 requires confirming with the QA lead first, and a direct instruction to
     "use the quick-login control" is exactly the moment to surface that conflict (Rule 63) rather
     than to click.
  2. **Never write a post-quick-login cookie back to the cookie file.** Keep the supplied set
     immutable and verify it by fingerprint afterwards; a rotated PHPSESSID on disk is the latch.
  3. **A `token` field in the quick-login body is NOT a bearer token.** On this build it is **119,039
     characters of whitespace-bearing permission JSON**. There is no header-auth fallback: `Bearer`,
     `Token`, `JWT` and `X-AUTH-TOKEN` are all dead ends.
  4. **409 `Session has expired.` is the recorded signal** (`staging-boot2.mjs` already checks for it
     at `fe-permissions`). Treat any 409 there as "stop, the session is gone", never as "retry".

- **⚠️ CORRECTION to the entry below ("the one value that fixes it"): IT WAS WRONG, AND UNTESTABLE.**
  Seeding `localStorage["user"]` cannot help while every API call answers 409 — the blocker is the
  **session**, not the user store. And the underlying puzzle is still open, now unmeasurable: **with a
  LIVE session, cookies seeded on all three hosts before first navigation, and the SPA booted normally
  from `/`, the app STILL landed on `/login`.** So cookies alone did not sign the app in even while
  they were valid. The only proven path to a rendered UI on this branch remains **a real Google SSO
  sign-in in a person's browser**. The key names in that entry (`user`, `fe_permissions_wrapper`) are
  still correct and still useful; the conclusion drawn from them was not.

- **🆕 2026-09-02 — WHY A VALID COOKIE SET STILL LANDS ON THE SIGN-IN FORM, AND THE ONE VALUE THAT FIXES
  IT.** The QA lead's cookies for sv9315 authenticate perfectly **against the API host** — 2,821 work
  orders paged, `/api/auth/me/fe-permissions` 200 — and the single-page app *still* shows
  "Sign in to your account to continue". Read out of the deployed bundle (`index.Bl7X34W2.js`), the
  cause is precise:

  ```js
  const Dt = "user", St = "impersonated_user", ks = "bookkeeping_enabled", Ot = "fe_permissions_wrapper",
        k = { getUser: () => ie(Dt) || null, saveUser: e => { oe(Dt, e) }, ... };
  // and, elsewhere:
  ...if (a") && !k.getUser()) try { yield s.get("/api/sso/check") } catch (e) {}
  ```

  **Three facts that each kill a plausible wrong theory:**
  1. **The `/api/api/sso/check` 404 is NOT the blocker.** The doubled `/api/api/` is real — the axios
     base is `https://<branch>api.qa.shopview.com/api/` and the code calls `s.get("/api/sso/check")` —
     but the call sits inside `try { … } catch (e) {}`, so the failure is **swallowed**. No
     `sso/check` route exists on this API in any form (`/api/api/sso/check`, `/api/sso/check`,
     `/sso/check`, `/api/auth/sso/check` all 404). Do not report it as the cause.
  2. **The gate is `!k.getUser()` — an empty user store.** The app is signed in when
     **`localStorage["user"]`** holds the user object, shaped
     `{ data: { role: "...", details: { staff_id, clockable, default_workplace, avatar_url, intercom_data, … } } }`.
     `localStorage["fe_permissions_wrapper"]` is the companion, and **that one is fetchable**:
     `GET /api/auth/me/fe-permissions` → 200.
  3. **`staging-boot2.mjs`'s localStorage keys are still CORRECT** (`user`, `fe_permissions_wrapper`);
     what is stale is where it gets the user object. **`/api/users/me`, `/api/auth/me`, `/api/iam/me`
     and six other guesses all 404 on this build** — the user object is minted by the login/quick-login
     response and by nothing else. A scan for `localStorage.getItem("…")` finds **nothing**, because
     every access goes through the `ie`/`oe` wrappers with a *variable* key; grep for the key constants
     (`Dt="user"`) instead.

  **⇒ THE CHEAPEST UNBLOCK, and it is one value:** ask for the contents of **`localStorage["user"]`**
  from a browser where the app is already open (DevTools → Application → Local Storage → the branch
  origin → the `user` row). With that plus the fetchable `fe_permissions_wrapper`, seed both and the
  SPA renders. Cookies alone are necessary and **not sufficient** on this build.
- **🆕 2026-09-02 — THE sv9315 COOKIES EXPIRED, and the tell is a 401 followed by a Google redirect.**
  `/tmp/qa-cookies/sv9315-live-session.txt` (minted 2026-09-01 16:15) now yields
  `401 GET https://sv9315api.qa.shopview.com/api/api/sso/check` and Playwright lands on
  `accounts.google.com/v3/signin/identifier?...redirect_uri=https://auth.qa.shopview.com/callback`.
  That is the documented end state above: **cookies are mintable only by the QA lead** (register row
  **SCH-BV-1**). It is not a bridge fault and not a dead branch — the bridge proxied the request fine.
  **Check `signedIn` by URL before trusting any probe result**, or a whole probe silently measures the
  login page. Also: **curl through the bridge needs `--cacert /tmp/atlassian/mitm.crt`**; without it
  curl exits 60 and looks exactly like a broken bridge, while Playwright (`ignoreHTTPSErrors`) works.
- **🟢 2026-08-31 — THE AUTHENTIC QA-BRANCH LOGIN: LET THE APP LOG *ITSELF* IN. ONE COOKIE, NO
  HAND-MINTING, NO 409 EVER. — SUPERSEDES THE TWO BULLETS DIRECTLY ABOVE.** Proven live end to end on
  **`sv9315`**, six consecutive clean runs. **You do NOT need `localStorage["user"]` from a human's
  browser, and you must never hand-assemble it** — a hand-written user object means the role and
  permissions come from a blob we wrote, not the server, which silently invalidates every
  permission-dependent verdict (Rules 12, 26). **There is no need: the app mints it for you.**

  **Every QA branch's sign-in screen carries a `DEV MODE — QUICK LOGIN` panel with `Admin` and `Tech`
  buttons** (populated from `GET /api/quick-login/users` → 200, `data.collection[]` of
  `{key,label,description,icon}`). **Click the button in a real browser.** The SPA then calls
  `POST /api/quick-login` itself and writes `user`, `fe_permissions_wrapper`, `token`,
  `bookkeeping_enabled`, `organization_features`, `location`, `current_shop_id`, `timezone`,
  `country_code` into `localStorage` from the server's own response. Harness:
  **`build/testing-tools/qa-branch-boot.mjs`** — `node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin`.

  **🔑 ONLY `sv_sso_session` IS NEEDED. Carry NOTHING else into the browser.** Measured as a
  controlled A/B: `sv_sso_session` + `cf_clearance` → signed in; **`sv_sso_session` ALONE → signed
  in**, identical result. `PHPSESSID` is minted fresh by the quick-login the app performs, and
  `cf_clearance` is pointless here (app host = **CloudFront/AmazonS3**, API host = **nginx** — no
  Cloudflare in the path, same as `sv9500`). **⇒ The "cookies expired" and "409 Session has expired"
  blocker class disappears entirely, because the only value you carry is the one that never rotates.**
  A dead `PHPSESSID` is not a blocker; it is a cookie you should not have been holding.

  **⚠️ TRAP — SCOPE COOKIES HOST-ONLY, NEVER TO `.qa.shopview.com`. This is what makes a correct
  login look like a failed one.** Scoped to the parent domain, your `PHPSESSID` matches the API host
  *as well as* the host-only one quick-login sets — **two same-name cookies are then sent on every
  request, the server reads the stale one, and `GET /api/auth/me/fe-permissions` answers 409 even
  though `POST /api/quick-login` just answered 200.** Observed exactly that way on `sv9315`, and fixed
  by the single-variable change to host-only scoping. **⇒ `domain: '<branch>api.qa.shopview.com'` and
  `domain: '<branch>.qa.shopview.com'` as two separate entries — never a leading dot.**
  **A 409 immediately after a 200 quick-login means duplicate cookies, not a dead session.**

  **Other measured facts:**
  - **Cookies alone genuinely are not enough** — that much of the bullet above is right. With all
    three cookies set and a normal navigation to `/` and to `/customers`, `localStorage` holds only
    `{"mode"}`, and the browser lands on `/login?redirect=/customers` (225-char sign-in page). **The
    SPA does not self-hydrate from cookies; it needs the login response.** The gate is real.
  - **`GET /api/api/sso/check` → 404 is harmless noise**, swallowed by `try{}catch(e){}`. Still true,
    still not the cause. Do not chase it.
  - **`getByRole('button', {name: /^Admin$/})` does NOT match these buttons** (Quasar `q-btn`, text is
    `admin_panel_settings Admin` with the ligature icon inline). Use
    **`page.locator('button:has-text("Admin")').first()`**.
  - **Role selection works and must be read, not assumed.** `Tech` → `role.name` **"Technician", 6
    permissions**. `Admin` → **42 permissions, `template_slug: administrator`**, `cross_toggles`
    `seeFinancialData/seeApArData/viewHistoryLogs` all true — but `role.name` reads **"Tech View"** and
    `view_mode` reads **`tech`** on this branch's data. **⇒ Judge the session by
    `fe_permissions.length` + `template_slug`, never by `role.name`.**
  - **`{"key":"tech"}` returned 200 here**, not the 403 seen on `sv9500`. The old "a failed `tech`
    burns the session" warning does not apply to the UI route — and cannot, since nothing you hold
    can be burned.
  - **Landing proof to assert** (so a false success cannot pass): `localStorage["user"]` exists **and**
    the URL does not match `/login`. The real Customers screen is ~2,870 body chars vs 225 for sign-in.

  **THE THREE PREREQUISITES, and the harness fails loudly without each:**
  1. **A fresh MITM bridge.** `source build/testing-tools/ensure_bridge.sh` (it restarts the bridge
     only when the egress it captured has gone stale, and exports `BRIDGE_PORT`). The bridge itself is
     **committed at `build/atlassian-login/bridge.mjs`** and writes its rotating port to
     `/tmp/atlassian/bridge-port.txt`, which `qa-branch-boot.mjs` reads. **Never hard-code the port.**
  2. **`sv_sso_session` and nothing else**, as `sv_sso_session=<value>` in
     **`/tmp/qa-cookies/<branch>-sso.txt`**, `chmod 600`. `/tmp` only, never committed (Rule 82).
  3. **Playwright** at `/opt/node22/lib/node_modules/playwright/index.js` and Chromium at
     `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (override with `$CHROME_BIN`).

  **Confidence: High — executed live on `https://sv9315.qa.shopview.com` on 2026-08-31 against build
  marker `v26.35.6-0f8d60b` (`last-modified: Wed, 02 Sep 2026 08:11:58 GMT`), read-only throughout: no
  ShopView record was created, modified or deleted.**
- **🔴 2026-09-02 — EVICTION: "IT KILLED MY SESSION WHILE I WAS TESTING". THE HONEST POSITION, AND THE
  OPERATING RULE.** **Every quick-login rotates that branch's `PHPSESSID`** — the proving runs rotated
  `sv9315`'s **seven times**. **So two sessions working the same QA branch WILL evict each other, and
  that is expected behaviour of the branch, not a fault in the branch and not dead cookies.** The UI
  recipe above does **not** fix eviction; what it does is make eviction **cheap** — a re-boot costs
  seconds and needs nothing from a human.
  - **ONE SESSION PER QA BRANCH (Rule 83 lane ownership).** Claim it before you drive it. If two
    sessions genuinely must share one, expect eviction and say so up front.
  - **🛑 A MID-TEST 401 OR 409 IS NOT A BLOCKER AND IS NOT A REASON TO CONTACT THE QA LEAD — IT IS A
    RE-BOOT.** Re-run `qa-branch-boot.mjs` and continue from the case you were on. **Escalating to a
    human to "log out of ShopView" so your session survives is the failure mode being eliminated
    here.**
  - **NEVER REUSE A `PHPSESSID` YOU DID NOT JUST MINT, AND NEVER PERSIST ONE BETWEEN RUNS.** A stored
    `PHPSESSID` is the 409 latch. Carry `sv_sso_session` only — it does **not** rotate.
  - **Escalate only when `sv_sso_session` itself is refused** (true ~24 h expiry, or a deploy). That
    one only the QA lead can re-mint, and it is a different symptom.
  - **Re-read the build marker after any re-boot** — an eviction and a redeploy look identical from
    the inside, and a redeploy splits your verdicts across two builds (Rules 49, 54).
- **✅ CONFIDENCE — THE REFACTORED HARNESS WAS RE-PROVEN LIVE ON 2026-09-02 against `sv9315`, build
  marker `v26.35.6-0f8d60b`.** `qa-branch-boot.mjs` was refactored in commit `f6e602b3` **after** the
  original proof (the body moved into `bootOrigin()`, `boot()` kept as a thin wrapper), so by Rule 12
  the file as it now stands had never been observed working. It has now been observed, three ways —
  the CLI entry point, the exported `boot()`, and the exported `bootOrigin()` — all clean:
  **exit 0** · `localStorage["user"]` **present** (with `fe_permissions_wrapper`, `location`,
  `current_shop_id`, `timezone`, `country_code`, `organization_features`, `bookkeeping_enabled`,
  `mode`) · landed URL **`https://sv9315.qa.shopview.com/customers`**, *not* `/login` ·
  `GET /api/auth/me/fe-permissions` → **200** · `fe_permissions.length` = **40** ·
  `template_slug` = **`administrator`**. **No "not re-verified" caveat remains on this file.**
- **✅ CONFIDENCE, RE-STAMPED — RE-PROVEN LIVE AGAIN ON 2026-09-02 (LATER), AFTER `ensure_bridge.sh`
  AND THE HARNESS SUMMARY LINE WERE BOTH EDITED, against `sv9315`, build marker
  `v26.35.6-0f8d60b`.** By Rule 12 an edited file is no longer a proven file, so both changes were
  re-observed rather than assumed. Command run exactly as documented —
  `bash build/testing-tools/ensure_bridge.sh` then
  `node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin` — and observed:
  **exit 0** · bridge reported a real port and a real egress (`BRIDGE_PORT=33499`,
  `egress=http://127.0.0.1:34791`) · `localStorage["user"]` **present** · landed URL
  **`https://sv9315.qa.shopview.com/customers`**, *not* `/login`, title `Customers | ShopView`,
  **2,867** body chars · `GET /api/auth/me/fe-permissions` → **200** ·
  `fe_permissions.length` = **40** · `template_slug` = **`administrator`** ·
  `GET /api/api/sso/check` → 404 (the harmless noise, as recorded). Read-only throughout: no ShopView
  record was created, modified or deleted; the only POST was the app's own `/api/quick-login`.
  - **✅ FIXED 2026-09-02 — `ensure_bridge.sh` NOW GENERATES THE BRIDGE'S TLS CERT ITSELF, so
    prerequisite (a) IS self-sufficient. This replaces the ⚠️ warning that stood here.** It creates
    `mitm.key`/`mitm.crt` **idempotently** — only when the pair is absent or within 2 days of expiry,
    so it never disturbs a bridge already serving (verified: re-running it against a live bridge left
    the cert and the process untouched and reported `bridge: healthy on port …`) — using this §A(2)
    openssl recipe and the wide SAN list
    (`*.atlassian.net`, `*.atlassian.com`, `*.testrail.io`, `*.qa.shopview.com`,
    `*.staging.shopview.com`). **Need another host: widen that one `SAN=` line and delete
    `/tmp/atlassian/mitm.crt` to force a regen.**
  - **✅ AND THE EMPTY-PORT CASE NOW FAILS LOUDLY (non-zero) INSTEAD OF REPORTING SUCCESS.** The old
    launcher printed `bridge: restarted -> , egress ` and returned 0, so the `ENOENT` death on the
    missing cert read as a pass — the single most expensive false pass in this harness. It now
    refuses: no numeric port, or an empty egress, or an egress that no longer matches `$HTTPS_PROXY`,
    each print `bridge: FAILED -- …` plus the **last 5 lines of `/tmp/atlassian/bridge.log`** (which
    is what names the real cause) and exit non-zero; the success path prints
    `bridge: OK -- BRIDGE_PORT=<port> egress=<proxy>`. It `return`s when sourced and `exit`s when
    executed, so `source`ing a failure no longer kills the calling shell.
  - **🛑 JUDGE THE SESSION BY `template_slug`, NEVER BY `role.name`.** On `sv9315` the **`admin`**
    quick-login user's `user.data.role.name` reads **"Tech View"** while `fe-permissions` reports
    `template_slug` = **`administrator`** / 40 permissions.
    **✅ FIXED 2026-09-02 — the harness summary line no longer misleads.** It used to print
    `role: Tech View`, which made a correct admin login look like it landed on the wrong role; it now
    prints the identity first and flags the label as untrustworthy, observed live as:
    `identity    : template_slug=administrator | fe_permissions=40   [role.name="Tech View"/40 — UNRELIABLE, do not assert on it]`
    `boot()`/`bootOrigin()` also return **`templateSlug`** and **`nFePerms`** now, alongside the
    unchanged `role`/`nPerms` — **assert on the former**; both are read from
    `localStorage["fe_permissions_wrapper"]`, never from `user.data.role`, which has no
    `template_slug` field at all. (`GET /api/quick-login/users` on sv9315 returns
    exactly two entries — `admin`→"Admin", `tech`→"Tech" — so there is no third button to mis-click.)
- **🟢 STAGING *DOES* HAVE THE `DEV MODE — QUICK LOGIN` PANEL — SETTLED 2026-09-02 BY THE QA LEAD'S
  OWN OBSERVATION. WHAT IS STILL OPEN IS THE ROUTE, NOT THE PANEL.**
  **THE FACT:** `https://app.staging.shopview.com/login` renders a `DEV MODE — QUICK LOGIN` panel
  with `Admin` and `Tech` buttons, **visually identical in placement and labelling to the QA-branch
  panel**. The staging login card also carries a normal **email + password** sign-in form above the
  panel.
  **PROVENANCE (Rule 12 — read this before citing the fact): observed by the QA lead via a
  screenshot of the live staging login page, 2026-09-02.** It was **not** executed, clicked or
  reproduced by a session, and it is **not** evidence that the staging quick-login *flow* works
  headlessly — only that the panel renders.
  **⇒ THIS RETIRES the line this bullet used to carry** — *"No observation of a `DEV MODE — QUICK
  LOGIN` panel on `app.staging.shopview.com/login` exists anywhere in this repo"* — **and it retires
  any statement or implication that staging has no panel, or that hand-hydration is the staging path
  *because* there is no panel.** That was never the reason; the reason is that no session has yet
  driven the click route on staging.
  **WHAT REMAINS TRUE, unchanged:** every *recorded* staging use is the **API endpoint**
  `POST /api/quick-login {key:'admin'|'tech'}`, called from Node under the **three cookies** and
  followed by **hand-writing `localStorage`**, *not* a click on the panel:
  `build/TESTING-RUNBOOK.md` §3 ("DEV login is gated by valid session cookies (the three in section
  2)") · `build/testing-tools/staging-admin.mjs` `login()` · `build/custom-roles-run/RUN331-STATE.md`
  ("Auth: DEV `POST /api/quick-login`") · `build/custom-roles-run/live-ui-2026-07-16/staging/approve-decline-TECH-PT.json`
  (`"method": "quick-login tech (real session)"`) · and as recently as 2026-08-19
  `build/filters/build-verify-2026-08-19/tools/mobile.mjs`, which visits `/login` only as a
  same-origin landing pad for `localStorage.setItem(...)` and **never clicks a button**.
  **⇒ THE HONEST POSITION: the panel is there; the staging click route is NOT yet proven end to end
  by a session; so hand-hydration remains the RECORDED STAGING FALLBACK until someone proves the
  click route with a valid staging session.** Not because staging lacks a panel — it does not lack
  one — but because the click route there is unexercised.
  **STILL UNSETTLED, both ways (do not treat either as decided):**
  **(a)** whether **clicking the panel headlessly on staging completes the login** the way it does on
  a QA branch; **(b)** whether **`sv_sso_session` ALONE suffices on staging** — staging sits behind
  **Cloudflare** (`cf_clearance` at the edge), unlike the CloudFront+nginx QA branches, **so the
  QA-branch finding that `cf_clearance` is inert does NOT transfer**.
  Neither could be settled live: we hold no staging `sv_sso_session` and stored staging cookies
  return 401 (`build/BLOCKED-shopview-app-session.md`), and **the QA lead has asked not to be
  re-prompted for a staging cookie**. **The staging caveat therefore STANDS, narrowed to (a) and (b)
  — the panel question is closed.**
- **Chromium UI automation — `staging-boot2.mjs`. 🔴 CONVERTED 2026-09-02: it now delegates to
  `qa-branch-boot.mjs` for any QA branch and no longer hand-hydrates `localStorage`.** An earlier
  version of this bullet said the recorded note *"the DEV login BUTTONS don't reliably work"* **"was
  a selector bug, not a button bug"**. **Half-corrected 2026-09-02: the selector bug is REAL and
  proven** (`getByRole('button',{name:/^Admin$/})` does not match a Quasar `q-btn`;
  `button:has-text("Admin")` does) **— but it was proven on a QA BRANCH, and the note it was
  explaining was recorded about STAGING** (`build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md`).
  **Strengthened, but only one notch, 2026-09-02:** now that staging is known to render **the same
  panel** (QA lead's screenshot, same date, bullet above), the selector bug is a **MORE LIKELY — and
  still NOT demonstrated —** explanation of that staging note. **State it at exactly that strength;
  it has not been reproduced on staging.** **Hand-hydration is the recorded staging fallback until
  the click route is proven there** — *not* because staging has no panel (it has one) but because no
  session has driven that route on staging — and it stays reserved for a host where the panel click
  does not land. Marked as such in the script. Both scripts read `$HTTPS_PROXY`/the bridge
  port LIVE — the port rotates. *Source: CLAUDE.md, TESTING-RUNBOOK.md; selector correction proven on
  `sv9315` 2026-08-31, re-proven 2026-09-02; staging scope corrected 2026-09-02; staging panel
  confirmed by the QA lead's screenshot 2026-09-02.*
- **Fresh MITM bridge (fallback when the direct proxy path fails):** `staging-bridge.mjs` — a small
  local proxy that accepts Chromium's CONNECT and relays via Node fetch (honours
  `NODE_USE_ENV_PROXY=1` + `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`). Reads `$HTTPS_PROXY`
  live; **rebuild every run, never hard-code the port.** Prints `BRIDGE_LISTENING 127.0.0.1:<port>`;
  launch Chromium with `--proxy-server=http://127.0.0.1:<port> --ignore-certificate-errors
  --no-sandbox --ssl-version-max=tls1.2`.
- **node-fetch / undici proxy gotcha:** node-fetch IGNORES the proxy → use **undici `ProxyAgent`**
  (or Node global `fetch` with `NODE_USE_ENV_PROXY=1`). *Source: CLAUDE.md Simple Flow env note.*
- **fe-permissions read:** `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],
  view_mode, cross_toggles}}` (array of code STRINGS, not a bool map). quick-login is stateful on the
  shared PHPSESSID → probe roles strictly SEQUENTIALLY.
- **PRODUCTION access (`app.shopview.com` / `api.shopview.com`) — proven 2026-07-29 (SV-8721 prod
  verification):** real login `POST /api/login {username, password}` → 200 + set-cookie `PHPSESSID`
  (session is PHPSESSID-only, NO SSO / no cf_clearance needed via the agent proxy; quick-login 500s on
  prod). **A fresh login for the SAME user EXPIRES the previous PHPSESSID** (old session → 409 "Session
  has expired") — log in ONCE per run and reuse that session for API + browser + cleanup. Prod test org
  = `72b2cc90-6964-4429-a207-76e55f946936`; workplaces via `GET /api/staff/my-workplaces` — **Trucks
  Hill 2 = `b617914c-16e9-4485-8e8b-193cd86aa416` (Africa/Accra, HAS canned lines — use it for WO
  seeding)**; QA Testing = `8badadec-0344-4bc3-b668-7beaedfefa8d` (Africa/Abidjan, NO canned lines).
  Same-as-staging on prod (all confirmed live): `iam/change-location`, `work-orders/create`
  (is_vehicle_here required), `part/make-request`, `perform-request-status-action {action:'order'}`,
  `inventory/orders/{id}` (incl. the `*_decimal` fields), `work-orders/delete` (deleting the WO also
  removes its un-received PO). **DIFFERENT on prod:** `POST /api/work-orders/lines/create
  {canned_line_id,…}` → 400 "Labor or fixed prices must be set" even with a fixed-price canned line —
  use **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201** instead. Chromium boot2-style hydration works on prod: PHPSESSID cookie on `.shopview.com` +
  localStorage `user` = `{data:<login-response data>}` (has `token`/`role`/`details`) +
  `fe_permissions_wrapper` = fe-permissions `data`; Playwright pointed straight at `$HTTPS_PROXY`
  worked (no bridge needed). Credentials/cookies in `/tmp` only. **Node-fetch proxy fix (proven
  2026-07-29):** in sandboxes where plain node `fetch` bypasses the egress proxy (403 "Host not in
  allowlist" while `curl` gets through), run node with **`NODE_USE_ENV_PROXY=1`** (Node 22.22+,
  undici EnvHttpProxyAgent) — fetch then honors `$HTTPS_PROXY` and prod login/API work; no code
  change needed. **Receive-screen Tax field (prod + staging):** a manual vendor-invoice dollar
  input defaulting to $0.00 when the org's workplace tax rate is 0 (`workplace_tax` in the order
  JSON); typing a dollar amount live-recalculates Total = Subtotal + Tax (verified: 15.32 + 0.77
  → 16.09, SV-8721).

- **🛑 THE FIVE TRAPS THAT PRODUCE A FALSE "DEAD SESSION" ON `.qa.shopview.com` — read this BEFORE
  asking for new cookies (proven live 2026-08-06 on the Schedule branch `sv8685`; the first three each
  cost a whole pass).**
  **(1) A 401 `sso_required` IS USUALLY AN EXPIRED `cf_clearance`, NOT A DEAD SIGN-IN.** Measured
  against the exact set that had just 401'd: **`sv_sso_session` and `PHPSESSID` were BYTE-IDENTICAL and
  only `cf_clearance` had changed.** What expires first on this estate is the **Cloudflare clearance**.
  **So on a 401, ask the QA lead for a fresh `cf_clearance` — not for a whole new sign-in.**
  **(2) PROBE THE `…api.` HOST, NEVER THE APP HOST.** `GET https://sv8685.qa.shopview.com/api/auth/me/fe-permissions`
  returns **HTTP 200** — and it is **not** a live session: the SPA host serves `index.html` for any
  unmatched path, so the 200 is an HTML page, not an auth response. Always probe
  `https://sv<n>api.qa.shopview.com/api/auth/me/fe-permissions`.
  **(3) `paste -sd'; '` SILENTLY CORRUPTS THE COOKIE HEADER — it ALTERNATES the two delimiter
  characters**, producing `A=1;B=2 C=3` and **dropping the third cookie**. That single bug produced a
  false "dead session" that stopped an entire pass; rebuilt as **`'; '.join(lines)`** the very same
  cookies returned **HTTP 200 with 42 permissions on the first try**. Keep the cookie file as **one
  line**, `name=value; name=value; …` (the harness does `COOKIE.split('; ')`, so a multi-line file
  breaks it too), `chmod 600`, `/tmp` only.
  **(4) EACH QA BRANCH KEEPS ITS OWN SESSION STORE.** A cookie set that is **alive** on one branch
  returns **HTTP 409 `{"errors":[{"error":"Session has expired."}]}`** on another — proven with the
  live Filters set (200 against `sv8785api`) against the Schedule API (409, and `GET /api/schedule/board`
  409 as well). **A live cookie on one branch is not a live session on another** — you need a per-branch
  set. (This sits alongside §B's note that `sv_sso_session` + `cf_clearance` are shared while
  `PHPSESSID` is per-branch: the shared tokens are necessary, not sufficient.)
  **(5) `POST /api/quick-login` AND `POST /api/switch-user` BOTH ROTATE THE SHARED `sv_sso_session`,
  SIGNING OUT ANY CONCURRENT WORKER ON ANOTHER BRANCH.** So **never call either while a sibling worker
  is live** — and say so in the pass notes, because it is the honest reason a permission case goes
  unobserved rather than being seeded around. (This is the cross-branch half of §N's one-login rule,
  which already forbids a second `quick-login` within a single run.)
- **🔧 THE 409 RECOVERY RECIPE — a FAILED `quick-login` BURNS THE SESSION, and this is how you get it
  back (proven live 2026-08-06 on the Report Suite branch `sv8582`).** Symptom: you call
  `POST /api/quick-login {"key":"tech"}`, it returns **HTTP 403 "Access denied."** — and from that moment
  **every** request on that branch returns **HTTP 409 `{"errors":[{"error":"Session has expired."}]}`**,
  including ones that worked seconds earlier. The failed attempt has rotated the session out from under
  you. **THE FIX:** call **`POST /api/quick-login {"key":"admin"}`** (the key that DOES work on this
  estate), take **only the `PHPSESSID` it returns**, and **swap that one value into the existing cookie
  header, leaving `sv_sso_session` and `cf_clearance` exactly as they were.** All requests return 200
  again. **Do not rebuild the whole header and do not ask for new cookies** — the other two values were
  never invalid.
  **The cheaper lesson: do not probe `{"key":"tech"}` at all on a branch where it has already been shown
  to 403** (`sv8582` is one), because the probe costs you the working session to learn nothing new.
- **✅ WHY QUICK-LOGIN "LOGS YOU OUT", MEASURED END TO END (controlled diagnostic 2026-08-28 on
  `sv9500`, build `v26.35.6-4b694be`; full evidence `build/QUICK-LOGIN-DIAGNOSIS-2026-08-28.md`).**
  **CONFIRMED: every `POST /api/quick-login` rotates the session and the previous jar is dead the same
  second** (200 at T+0, **409 `Session has expired.`** 7 s later after one call). Two calls → two
  rotations → two dead jars. Three corrections to what is written above, each observed live:
  **(a) ONLY `PHPSESSID` ROTATES — `sv_sso_session` NEVER CHANGED** across the whole run. Trap 5's
  *"rotates the shared `sv_sso_session`"* is the wrong mechanism; the sibling sign-out it warns about is
  real, but it is the per-branch `PHPSESSID` doing it. Never rebuild the SSO value.
  **(b) A `403 Access denied.` FROM QUICK-LOGIN IS NOT A FAILED LOGIN.** `{"key":"tech"}` answered 403
  and the jar it set was a **working Technician session** (`view_mode: "tech"`, 6 permissions). **Take
  the `PHPSESSID` out of the 403's own `Set-Cookie` and verify with one read — do NOT "recover" with an
  `admin` quick-login**, which throws away the tech session you were just given. The §A recipe above is
  still right about *how* to repair (swap only `PHPSESSID`); it is wrong that the 403 login failed.
  **(c) THE STICKY DEAD-SESSION LATCH — the second, sneakier cause of "logged out".** A **409 response
  hands back a `PHPSESSID` of its own** (deterministically the same dead value every time) and **that
  value 409s forever**. Any client with ordinary cookie persistence (browser, `requests.Session()`,
  `curl -c`) that hits ONE 409 adopts the dead id and never recovers, though a valid session exists.
  **Turn cookie persistence OFF and re-read the jar from `/tmp` after any 409.**
  **Also settled on `sv9500`:** the supplied raw cookies read **200 immediately** (so §N's "a raw-cookie
  read 409s, that is normal" is branch-specific, not a law) · **`GET /api/auth/me` 404s — probe
  `/api/auth/me/fe-permissions`** · a **five-minute** session of ordinary paging with 20–65 s idle gaps
  produced **zero** 401/409 and no cookie change, so **idle timeout is NOT a cause** (cookie `Max-Age`
  86400) · **four concurrent requests on one jar all returned 200** — shared concurrent use evicts
  nothing · **`cf_clearance` is NOT needed and cannot be the problem on `sv9500`: there is no Cloudflare
  in the path** (app host = **CloudFront/S3**, API host = bare `nginx/1.30.4`, no `cf-*` headers; an
  unauthenticated API call returns the app's own JSON `401 sso_required`, not an edge challenge).
  **THE RECIPE — five lines, verbatim from the diagnosis:** **(1)** probe
  `GET /api/auth/me/fe-permissions` on the `…api.` host first — **200 ⇒ you are signed in, do NOT call
  quick-login**; only 409 means you need one, and 401 `sso_required` means ask for a fresh
  `sv_sso_session` by name. **(2)** call quick-login **at most once per run**, and only to CHANGE ROLE.
  **(3)** overwrite `PHPSESSID` from the response `Set-Cookie` **even on a 403**, leave `sv_sso_session`
  alone, and use the new jar for everything after. **(4)** never re-send a jar after a 409 and never keep
  the `PHPSESSID` a 409 gave you. **(5)** never call quick-login while a sibling worker is live on that
  branch (Rule 83) — one call logs every one of them out instantly.
- **WHICH COOKIE IS SHARED, RE-PROVEN ON THREE BRANCHES AT ONCE (2026-08-06):** one supplied set for
  Reports, Filters and Schedule differed **only** in `PHPSESSID`; the `sv_sso_session` and `cf_clearance`
  values were byte-identical across all three, and each set returned **HTTP 200 with 42 permissions**
  against **its own** `…api.` host. So: **`sv_sso_session` + `cf_clearance` are shared across branches,
  `PHPSESSID` is per-branch** — which is exactly why `quick-login` / `switch-user` signs out workers on
  the OTHER branches, and why the recovery above only needs the one value swapped. Convention:
  **`/tmp/qa-cookies/{project}-cookie-header.txt`, one line, `'; '.join`, `chmod 600` in a `chmod 700`
  directory.**
- **QA-BRANCH SESSION DIAGNOSTIC ORDER, so nobody re-derives it:** build the header with `'; '.join`
  → probe the **`…api.`** host → on 401 ask for a fresh **`cf_clearance`** → on 409 check you are using
  **that branch's** `PHPSESSID` → only then consider the sign-in dead. **Never call `quick-login` to
  "be safe" if a sibling is live.**
- **✅ THE POSITIVE TEST — HOW TO TELL A GENUINELY DEAD SHARED SIGN-IN FROM THE FOUR FALSE ALARMS
  ABOVE (proven live 2026-08-06, Report Suite `sv8582`; the five traps were each ruled out first).**
  The four traps tell you what a dead session is **not**; this is the signature of one that **is**.
  **THE SIGNATURE — all three together:**
  **(1) ALL THREE BRANCHES 401 TOGETHER ON A BYTE-IDENTICAL SHARED `sv_sso_session`.** Since
  `sv_sso_session` + `cf_clearance` are the **shared** values and `PHPSESSID` is per-branch, a refusal
  that is simultaneous across Reports, Filters and Schedule on the same shared token can only be the
  shared token — **one branch failing alone is trap 4, not this.**
  **(2) THE REFUSAL ARRIVES FROM nginx AS `application/json`** — `GET /api/auth/me` returns
  **HTTP 401 `{"error":"sso_required"}`** as a **JSON body**, i.e. **the request reached the
  application**. That is what rules `cf_clearance` out: a Cloudflare problem returns a **Cloudflare
  challenge/HTML**, not the app's own JSON. **So trap 1 does NOT apply, and asking for a fresh
  `cf_clearance` will not fix it.**
  **(3) NOTHING RETURNS 409**, so it is not a `PHPSESSID` mismatch (trap 4's other half).
  **⛔ `quick-login` IS NOT A RECOVERY ROUTE HERE — IT IS ITSELF SSO-GATED AND ANSWERS 401.**
  Observed directly: `POST https://sv8582api.qa.shopview.com/api/quick-login` →
  **HTTP 401 `{"error":"sso_required", …}`** (captured 2026-08-04 in
  `build/report-suite/build-change-2026-08-04/BUILD-MOVED-2026-08-04.md`). **This is a different failure
  from the §A 409-recovery recipe above:** that recipe repairs a session **burned by a `quick-login`
  that got 403**, where the shared token is still good and only `PHPSESSID` needs swapping. When the
  **shared** token is dead there is nothing to swap and no endpoint to swap it with.
  **⇒ THE ONLY FIX IS A FRESH `sv_sso_session` FROM THE QA LEAD** — ask for **that value by name**,
  not for "new cookies" and not for a `cf_clearance`. **Corroborating (not diagnostic): two other
  candidate cookie files were tried and both 401'd, and a background probe re-tested every 90 s for a
  whole session and never recovered** — useful confirmation, but the three-part signature is what
  settles it, and a probe that never recovers is not by itself proof of cause.

## B. Environment / location
- **QA-BRANCH SESSION TRAPS live in §A** (the five that produce a false "dead session": expired
  `cf_clearance` mistaken for a dead sign-in · the app host answering 200 on any path · `paste -sd`
  corrupting the cookie header · per-branch session stores returning 409 · `quick-login`/`switch-user`
  rotating the shared token out from under a sibling worker). Read them with the cookie-scope note below.
- **QA-BRANCH HOST NAMING — now proven on three data points (2026-08-04), so never re-derive it:**
  a per-epic QA branch is served at **`sv<epic-number>.qa.shopview.com`**, and its API host follows
  the **`sv<number>api.qa.shopview.com`** shape — **`api` glued on with NO dot**. The three points:
  `sv8582` → Report Suite epic **SV-8582** · `sv8785` → Filters epic **SV-8785** · `sv8685` →
  Schedule epic **SV-8685**. (Same shape as the older per-ticket envs `sv7301api…`, `sv7387api…`.)
  ⚠️ **Only the Report Suite pair is VERIFIED** (`sv8582api.qa.shopview.com` answered live
  2026-08-03). For **`sv8785api`** and **`sv8685api`** the API host is **INFERRED from the pattern
  and NOT YET VERIFIED** — those two branches have deliberately had **zero requests** made to them,
  because the QA lead reserved VIU permission on both until Report Suite is finished. So: given an
  epic number you can predict the hosts, but **state the API host as inferred until it answers.**
- **QA-BRANCH COOKIES — which cookie is shared and which is per-branch (observed 2026-08-04 across
  three branches; values are SECRETS, `/tmp` only, never in repo):** the **`sv_sso_session`** token
  and the **`cf_clearance`** token appear to be **SHARED across branches** (byte-identical for
  `sv8582`, `sv8785` and `sv8685` — single sign-on plus one Cloudflare clearance for the whole
  `.qa.shopview.com` domain), while **`PHPSESSID` is PER-BRANCH** (a different value for each).
  Practical consequence: **you still need a per-branch set**, one file per branch — the convention
  is `/tmp/<project>-viu/cookies.json` (`chmod 600`, dir `chmod 700`), same JSON shape for all, so
  the helper scripts work unchanged. **These cookies live roughly 24 hours** (or until a deployment,
  per §A), and **`/tmp` is ephemeral**, so on any resumed or newly-authorised VIU **ask the QA lead
  for a fresh set** rather than assuming a stored one is still good.
- **Org ID (staging, shared):** `d55bc308-...` (shared across Custom Roles + Simple Flow + F&D staging).
- **🏢 DEFAULT LOCATION = `Staging Heavy Duty - 9919` — CONFIRM IT BEFORE ANY OBSERVATION, ON ALL
  THREE PROJECTS (QA lead's standing convention, 2026-08-11):** *"Make sure to use Staging Heavy Duty
  Location for all projects and change it only / When needed."* Switch away **only** where a case
  genuinely requires it (only two known exceptions: a case needing **several locations in scope**, or
  one pinned to a **specific shop's data**), **say so on the case's own record, and switch back.**
  **Record the location alongside the build marker in every verification deliverable.** **Two real
  near-misses drove this: an endpoint scoped to the ACTIVE WORKPLACE ONLY nearly produced a false
  finding, and a pass that SEEDED a default workplace to escape the `/no-location` bounce then
  observed links its own setup had created — report the bounce, never engineer around it (Rule 14
  permits seeding DATA, not manufacturing the condition under test).** *Full convention + both
  incidents with sources: CLAUDE.md "Durable key facts".*
- **Change active workplace/location (self-unblock — required before reading/writing a WO in a
  non-default workplace, else `work-orders/view/{id}` returns 400/no-data):**
  `POST /api/iam/change-location {workplace_id, workplace_timezone}` → 200. Helper:
  `changeLocation(sessCookie, workplaceId, timezone)` in `staging-admin.mjs`; boot2 accepts
  `{workplaceId}` / env `SV_WORKPLACE`+`SV_TZ`. **On qb, AVOID `change-location`** (suspected
  500-incident trigger; admin default is already Lethbridge = the QB location). *Source: CLAUDE.md.*
- **Workplaces (`GET /api/staff/my-workplaces`):** Heavy Duty 9919 =
  `b3c8c820-f815-4cf1-8938-10956c5ee71a` (America/Edmonton); Lethbridge 4310 =
  `f8a8b802-7780-4b16-bf10-343caeb616b2`; QB Location = `d5366a95-582d-4a06-96e2-20f8cb937866`.
- **qb (SV-7387) env sleep/wake:** env auto-sleeps. Wake:
  `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
  {"action":"wake","env":"sv7387"}`, then poll API ROOT `https://sv7387api.qa.shopview.com/` until
  200 (~60s; 503 while booting). *Source: FEES & DISCOUNTS appendix below.*

## C. Work Orders
- **Create WO (API):** `POST /api/work-orders/create {company_id, vehicle_id, workplace_id,
  start_date, is_vehicle_here:true}` → 201. **`is_vehicle_here:true` is REQUIRED.** Customer defaults
  auto-apply fees on new WOs (`appliedBy=customer_default`). **Gotcha:** create can 500 in some staging
  sessions → create via the UI instead (UI recipe: `/workorders` → New → pick Customer + Asset →
  Save → Confirmation "over credit limit" → Create). *Source: CLAUDE.md, UI-seeding appendix 2026-07-15.*
- **Delete WO:** `POST /api/work-orders/delete {work_order_id}`. **Move the WO to Uncomplete first**
  (a Complete WO → 400 "Completed work order cannot be deleted"). On staging, WO delete can be
  UI-only (top ⋮ → Delete Work Order) if the API 404s.
- **List / read:** list `GET /api/work-orders` / `GET /api/work-orders/simple-list`; detail
  `GET /api/work-orders/view/{id}` (carries `adjustments[]`, `adjustmentsSummary`, `editable`,
  `deletable`); lines `GET /api/work-orders/lines/{woId}`.
- **Vehicles:** `GET /api/vehicles?company_id={id}`; create `POST /api/vehicles/create
  {company_id, customer_id:<CONTACT id>, unit}`; VIN edit `POST /api/vehicles/change` → 201.
- **Existing-WO detail bounces to `/workorders` on mount (all roles incl. admin)** — create a FRESH
  WO to reliably land on `/workorders/{id}/lines`, or in-SPA `history.pushState` + dispatch
  `popstate` (see UI automation). *Source: CLAUDE.md, Navigation Map below.*

## D. WO Lines
- **`POST /api/work-orders/lines/create` SUCCEEDS with a canned line** — body `{canned_line_id,
  work_order_id, status:'authorized'}` (get a `canned_line_id` from the canned-lines list). It only
  returns **HTTP 500 when called WITHOUT a canned line / labor** (bare or empty body). So: to add a WO
  line via API, ALWAYS supply a `canned_line_id`; for a line that needs labor / has no canned line, use
  the **UI New Line dialog** (WO detail → Lines tab → New Line → pick a canned line → Save & Close) as
  the fallback. *(confirmed live 2026-07-27, SV-8721 side project; supersedes the earlier "always 500s
  → use UI" note. On qb, lines/create still 500s on ALL payloads incl. `create-from-canned-line`.)*
  **UPDATE 2026-07-29 (staging):** `lines/create` with a canned_line_id now returns **400 "Labor or
  fixed prices must be set"** on staging too (same as prod) — use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201** on staging as well (proven live 2026-07-29). Note: a line created from a canned line can
  AUTO-CREATE a part request (with the canned line's part category) — remove it via
  `part/remove-request/{id}` if the test needs a clean line.
- **Change line status:** `POST /api/work-orders/lines/change-status {line_id, status:'authorized',
  workOrderId}` → 200 (enum `authorization_required|authorization_declined|authorized|complete`).
  Bulk: `POST /api/work-orders/lines/change-lines` → 201. Delete: `POST
  /api/work-orders/lines/delete-lines` → 200 (deletable in any status except Complete).

## E. Parts
- **ADD PART to a WO/line (API — the recorded recipe; do NOT re-discover):**
  `POST /api/work-orders/part/make-request {line, work_order, description, quantity,
  part_source_type:'inventory'|'vendor', part_number, sell_price, cost, part_category_id}` → 201.
  **`part_category_id` is REQUIRED** (categories: `GET /api/inventory/categories` → {value,label}).
  Edit: `POST /api/work-orders/part/change-request {id, description|quantity|part_number|
  part_source_type}` → 200 (recalcs sellPrice/margin; vendor→inventory locks cost). *Source: CLAUDE.md
  Simple Flow facts + Custom Roles Phase-2b appendix.*
- **Add part via UI (reliable when API awkward):** WO detail → New Part Request dialog. Fields:
  Part Number / Description / Quantity (+ Sell Price when `seeFinancialData` ON — sell-price field is
  ABSENT for roles without SFD). For inventory source: `select_part` a catalogue PN (forces
  Source=Inventory) → qty via `input_bin_quantity_{binId}`.
- **Remove a WO part:** `POST /api/work-orders/parts/delete {part_id, work_order_id}` (returns picked
  inventory + enables WO delete).
- **Cored part (seed data):** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id). Core OK/Not-OK is a LINE-level control governed by WO Lines Create & Edit; needs a
  received core-bearing part to appear.
- **Inventory / orders / deliveries:** parts `GET /api/inventory/parts?...&search=`; create
  `POST /api/inventory/parts/create` → 201, delete `POST /api/inventory/parts/delete` → 201; PO list
  `GET /api/inventory/orders`, order detail `GET /api/inventory/orders/{id}`; deliveries
  `GET /api/inventory/deliveries`. Edit a PO item pre-receive: `POST /api/inventory/orders/change-item
  {order_id,item_id,part_number,quantity_ordered,price,category,description}` → 200.
- **`GET /api/inventory/orders/{id}` now ALSO returns full-precision fields `price_decimal`,
  `total_cost_decimal`, `total_price_decimal`** (the SV-8721 5-decimal fix fields) alongside the legacy
  rounded `price` / `total_price`. Use the `*_decimal` fields to verify 5-decimal cost precision on
  Receive. *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Receive parts:** `POST /api/inventory/orders/accept` (driven from `/accept-delivery/{orderId}`:
  fields `invoice-number`, Invoice Date, per-line `delivered` qty, Tax, note; over-qty → "Received
  More Than Ordered" warning). *Source: CLAUDE.md Simple Flow facts.*
- **WO Receive Parts screen (UI route):** `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={workOrderId}`
  — this is the Receive Parts screen reached from a work order (the PO Receive screen with the WO as the
  return target). *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Delete an UNPICKED part REQUEST:** `POST /api/work-orders/part/remove-request/{requestId}` → 200
  (the id in the URL, empty body). **`parts/delete` returns 400 "part_id Not found" for a request that
  was never picked** — `parts/delete` is for picked inventory parts; requests use `remove-request`.
  Useful to clear the part a canned line auto-creates. *(proven live 2026-07-29, sell-price verify.)*
- **New Part Request modal (UI recipe):** WO lines page → the LINE's ⋮ kebab (inside
  `[data-test-id=table_work_order_lines]`, the menu containing "Request part | Add line note | Save as
  canned line | …") → **"Request part"**. Dialog test-ids: `input_workorder_part_description`,
  `input_workorder_part_quantity`, `select_part` (PN catalogue), `select_workorder_part_source`,
  `select_part_category`, `select_part_vendor`, `input_part_cost`, `input_workorder_part_core_charge`,
  `input_workorder_part_sell_price`, `input_workorder_part_margin`; save buttons
  `button_workorder_part_save` (= Save & Close) / `…_save_add_part` / `…_save_add_line`.
  **Category DEFAULTS to "Uncategorized"** when nothing is picked. *(proven live 2026-07-29.)*
- **Receive Parts screen driving (test-ids + endpoints):** vendor top-left =
  `select_assign_vendor_{orderId}` (Quasar select → `.q-menu .q-item`; fires
  `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds:[]}`); invoice # =
  `input_invoice_{orderId}`; per-item `input_part_number_{itemId}` (fires
  `POST /api/orders/items/{itemId}/part-number {partNumber}`), `input_cost_{itemId}`,
  `input_sell_{itemId}`, `input_qty_{itemId}`; submit = `button_receive_po_{orderId}` (disabled until
  vendor + invoice + PN + cost/sell present — sell>0 is part of the gate). Screen data =
  `POST /api/inventory/orders/receive-view {orderIds:[…], vendorIds:[…]}`. **GOTCHAS (proven
  2026-07-29):** (1) Cost/invoice edits fire NO API call on blur and do NOT persist across reload —
  they submit only with the final Receive; (2) after a vendor is assigned, re-opening the URL that
  still has `&vendorless=1` renders "All parts on this purchase order have been received." even though
  nothing was received (artifact — drop `vendorless=1` and reload); (3) the Sell field does NOT
  auto-calc from Cost on this screen in the current build (staging AND prod — the 2026-07-29
  sell-price bug, see build/simple-flow/sell-price-investigation-2026-07-29/live-verify-2026-07-29/).
- **Returns:** create `POST /api/work-orders/part/make-return-request` → 200; delete
  `POST /api/work-orders/part/remove-return-request {part_return_request_id}` → 200; list
  `GET /api/work-orders/part/list-return-requests`. A return can't be deleted on a Complete WO —
  uncomplete first.

### 🧾 Vendor invoices, receiving & the PAYMENT-SELECTION LIST — the fast path (proven SV-9096, 2026-08-31, per-ticket QA branch `sv9096`, build `v26.35.6-8176cde`)
**Why this exists:** SV-9096 (invoice total vs payment-selection-list mismatch) took an afternoon almost entirely on route/endpoint discovery and fighting `orders/create` + the Quasar New-PO modal. With the recipe below a repeat is **~10 API calls**. **Prefer API for setup + value reads; use the UI only for the evidence screenshots.**

- **ROUTES (one dead route wastes time):** Parts sub-nav → Purchase Orders = **`/parts/orders`** · Vendor Invoices = **`/parts/deliveries`** · Returns = `/parts/returns` · Vendors = `/parts/vendors`. **`/parts/purchase-orders` is a DEAD page** ("Looks like this page took a coffee break… permanently"). Opened vendor-invoice detail = **`/parts/delivery/{deliveryId}`**. A vendor's **payment-selection screen** (Unpaid Invoices) = **`/parts/vendor/{vendorId}/unpaid-invoices`**. Receive screen = **`/accept-delivery/{orderId}`**.
- **AUTH without logging the user out** = localStorage-seed (NO quick-login; §"THIS SPA AUTHENTICATES FROM localStorage"). Seed `user={data:{details:{default_workplace:<WP>},view_mode,system_role,…}}`, `fe_permissions_wrapper`, `location`, `current_shop_id`, `timezone`, `country_code`, `bookkeeping_enabled`, then navigate. **THEN SCOPE THE SESSION: `POST /api/iam/change-location {workplace_id, workplace_timezone}`** — without it `default_workplace` is `"None"` and inventory/parts pages sit on **"Loading…"** forever. (These clones: Heavy Duty 9919 = `b3c8c820-f815-4cf1-8938-10956c5ee71a` / America/Edmonton; workplaces via `GET /api/staff/my-workplaces`.)
- **CREATE A PO WITH A CUSTOM (fractional) COST — do NOT fight `orders/create`** (its item shape 500s: needs `id`+`is_core`+`quantity`+`part_number`+`price`+`category`+`description`, and a random `id` still 500s; the New-PO Quasar modal gates Description behind Part Number and is fragile). **Instead:** take an existing **ordered** PO — `GET /api/inventory/orders?status=ordered`, pick one with a single item that has `ioi_vendor_name` — and set its line cost/qty: **`POST /api/inventory/orders/change-item {order_id,item_id,part_number,quantity_ordered,price,category,description}` → 200** (`price` takes 5 decimals, e.g. 7.836). Verify with `GET /api/inventory/orders/{id}` → item `price_decimal` / `total_cost_decimal`.
- **RECEIVE IT (creates the vendor invoice/delivery): `POST /api/inventory/orders/accept` — camelCase, and `items` is a JSON STRING:** `{id:<orderId>, invoiceNumber, invoiceDate:"2026-08-31T06:00:00.000Z" (ISO-Z, NOT a bare date), note, items:JSON.stringify([<the order-detail item + quantity_received + total>]), total, orderStatus:"fulfilled", tax}`. Returns `{"data":[]}` on success. **On the receive SCREEN the Cost is READ-ONLY** (comes from the PO) — only Quantity Received + Tax are editable, which is why the cost must be set at create/`change-item`. **Fractional received qty (1.5, 3.1) makes the PO `accept` 500** — fractional-qty receives live on the **work-order** path `POST /api/orders/receive-requested-parts` instead.
- **EDIT A RECEIVED INVOICE LINE (the SV-9096 bug trigger): `POST /api/inventory/deliveries/change-item {delivery_id,item_id,quantity,price,part_number,description}` → 200.** Header/tax edit: **`POST /api/inventory/deliveries/change {delivery_id,invoice_number,vendor_id,tax,invoice_date}`**. ⚠️ The workplace **re-derives its default tax (5% GST on Heavy Duty) on ANY line edit** even if you received at tax 0 → set `tax:0` via `deliveries/change` for clean numbers (`change-item` ignores a tax field).
- **READ THE TWO FIGURES A SV-9096-CLASS BUG COMPARES:**
  - **Opened-invoice total:** `GET /api/inventory/deliveries?search=<invoiceNumber>` → `total_price_decimal` (delivery detail line also carries `total_cost_decimal` raw + `total_cost` round-first display).
  - **PAYMENT-SELECTION LIST amount/balance (the vendor ledger / Unpaid Invoices):** `GET /api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=<vendorAccountId>&pagination%5BrowsPerPage%5D=1000`. Response is `data.response` (a dict — recurse for dicts carrying `reference_id`+`amount`; `reference_id` = the delivery id; fields `amount`,`balance`,`invoice_number`). **`accountId` is the vendor ACCOUNT id, NOT the vendor id** — grab it once by loading `/parts/vendor/{vendorId}/unpaid-invoices` and reading the `accountId=…` query on that call (attach the request listener BEFORE navigating; boot lands you on the page first).
  - **Rounding-fix check:** correct = **multiply-then-round** (9 × 7.836 = 70.524 → **70.52**); the bug stored **round-first** (7.84 × 9 = 70.56) in the ledger. PASS ⇔ invoice `total_price` == ledger `amount` == `balance`.
- **WORK-ORDER receive path (for WO-sourced parts, tax-computed receives — G1/F2; proven SV-9096 follow-up 2026-08-31):** WO create (§C) → add a line `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:"authorized"}` (canned lines list: `GET /api/work-orders/canned-lines`) → **request a vendor part `POST /api/work-orders/part/make-request {line, work_order, description, quantity, part_source_type:"vendor", part_category_id, part_number, cost, sell_price, vendor, is_core}`** — ⚠️ the category field is **`part_category_id`** (NOT `category`/`category_id`) → if it made a WO-linked order (`GET /api/inventory/orders` → `workOrderId==woId`, `vendorMissing:true`), assign a vendor `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds:[…]}` and set cost with `orders/change-item` → **receive on the WO receive screen `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId}`**: test-ids `input_invoice_{orderId}`, `input_sell_{itemId}` (must be > 0 to enable Receive), `input_qty_{itemId}`, **`input_tax_{orderId}`**, `button_receive_po_{orderId}`; the button fires **`POST /api/orders/receive-requested-parts {vendor_id, invoice_number, invoice_date, note, total, tax, items:[<full item objs>]}`** (NOT `orders/accept`). **TAX ON A WO RECEIVE is a FE-computed dollar field = rate × subtotal, ROUNDED** (86.90 × 5% = 4.345 → shows $4.35, stored 435c) — this is the G1 path; the stored invoice + payment ledger both keep the rounded value.
- **Payment apply — RESOLVED SHAPE (SV-9096 follow-up 2026-08-31): `POST /api/parts-catalogue/vendor/payment/create {account_id, payment_date, payment_method:"<methodKey e.g. 10000_CALGARY_CHEQUING>", reference_number, description, transactions:[<THE FULL vendor_transaction object from list-unpaid-by-vendor-account, plus `transaction_payment_amount`>], payment_amount}`** → 200. The earlier "must be greater than $0.00" was because each `transactions[]` entry needs the FULL txn object incl. **`transaction_payment_amount`**, not a bare `{id,amount}`. UI to capture a fresh method key: tick **`checkbox_transaction_{txnId}`** → **`button_new_payment`** → **`select_payment_method`** + **`input_payment_amount`** (prefills from the ticked invoice) → **`button_make_payment`**. After full payment the invoice **leaves the Unpaid list** (settled $0.00, no residual cent). **A PAID delivery refuses editing:** `deliveries/change-item` → `"Cannot edit a delivery item that has already been paid. Delete payment before editing."`
- **Vendors list** = `GET /api/parts-catalogue/vendors` (vendor objects carry NO tax config — vendor tax is entered at receive time). **Categories** = `GET /api/inventory/categories` (`{value,label}`). A transient **"Invalid parameter type" toast** shows on the Vendor-Invoices / Unpaid-Invoices list pages on this build; it does not affect the figures (consistent across every screen).

## F. Adjustments / Fees & Discounts
- **Add a WO adjustment:** `POST /api/work-orders/adjustments/add {workOrderId, kind:'fee'|'discount'|
  'processing_fee', name, calculationType:'flat'|'pct_labor'|'pct_parts'|'pct_subtotal'|
  'pct_grand_total', amount, maxCap, scope:'whole_wo'|'labor_line'|'part_line', targetId, taxable,
  templateId, description}`. **Part-sales percent uses `pct_subtotal`** (`pct_total` → 400 "Invalid
  calculation type"). *Source: CLAUDE.md + F&D appendices.*
- **Remove:** `POST /api/work-orders/adjustments/remove {adjustmentId, workOrderId}` → 204.
- **Change:** `POST /api/work-orders/adjustments/change {adjustmentId, workOrderId, name, amount,
  maxCap, taxable}` (kind/calc immutable). **A `processing_fee` → HTTP 409 "cannot be edited through
  this endpoint" = REMOVE-ONLY (spec-correct);** manual add of a processing_fee → 400.
- **Base calc note:** processing-fee base = net subtotal (labour+parts+shop)×(1+tax) EXCLUDING
  whole-WO fees (§5-R4, VIU-confirmed 2026-07-23). Customer default fees auto-apply on WO create.
- **Templates:** `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`;
  `DELETE .../{id}`. Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
  (POST `{templateIds:[…]}`). Fuller F&D contract + Quasar dialog driving in the F&D appendices below.

## G. Roles & permissions testing
- **RESET TO TEMPLATE FIRST (Standing Rule 26/26a):** before ANY permission/role verification on the
  shared org, reset every in-scope role to its template/default so you test spec-defaults, not drift.
  Record pre-reset → reset → post-reset (the diff IS a finding). Path: Settings → Roles & Permissions →
  pencil → Reset to Template → Save. If a role RE-DRIFTS mid-run (concurrent session), reset AGAIN and
  continue (persistently, Rule 26a). Leave roles at template when done. Custom-role reset API:
  `POST /api/roles/{id}` (re-PUT template perms).
- **STAGING ACTION RECIPE: multi-login via Technician role-swap (PREFERRED for any case needing a
  different role/login — Standing Rule 74 multi-login standard, QA lead 2026-08-19):** instead of
  creating a new user, swap the role on the **Technician quick-login user**. Steps: **(1)** don't create
  a user; **(2)** RESET the needed role to template/default and SAVE FIRST — Settings → Roles &
  Permissions → pencil → Reset to Template → Save, or custom-role API `POST /api/roles/{id}` (re-PUT
  template perms) (Rule 26); **(3)** assign that reset role to Tech: `POST /api/staff/6fb22c1b-.../change
  {first_name, last_name, email:'tech@shopview.com', workplace_id:'b3c8c820-...', role_id:<the role>}` →
  201 (EXACT-match email first; invalid `role_id` → 500 no-persist); **(4)** run the test as the Tech
  quick-login user (`POST /api/quick-login {key:'tech'}`), observe live; **(5)** AFTER all testing,
  RESTORE Tech to the **Technician role `131b5274-...`** via the same `/change` call (safety-net
  `staging-restore-tech.mjs`). Re-read the role live before asserting and re-reset if a concurrent actor
  drifts it (Rule 26a). Role-change forces re-auth (409 "Session has expired" → re-login; poll
  fe-permissions). `switch-user` impersonation (below) is the simpler fallback. *Source: CLAUDE.md Rule
  74 multi-login standard + Rule 26/26a.*
- **Impersonate a role holder (SIMPLER live-role fallback):** `POST /api/switch-user {user_id}` (user_id =
  staff `id` from `GET /api/staff?limit=200`, which lists `role_label` per staff). End impersonation with
  a fresh admin `login()`. *Source: CLAUDE.md Rule 14 self-seed playbook.*
- **Create a fresh staff per role (alt):** `POST /api/iam/create {email, firstName, lastName, roleId,
  departments:[...], workplaceId}` → 201 `{user_id}`. On staging a fresh staff needs invite-confirmation
  → PREFER switch-user impersonation.
- **Assign a role to the Tech user (self-service):** `POST /api/staff/{staff_id}/change {first_name,
  last_name, email, workplace_id, role_id}` → 201. **Use Tech `/change` staff_id `6fb22c1b-...`** — the
  staff-LIST id `a7fd0a88-...` **404s on `/change`.** EXACT-match `email==='tech@shopview.com'` before
  changing (never substring). Invalid `role_id` → 500 (does not persist). **NEVER role-swap Tech
  mid-session** → causes the `/no-location` SPA bounce (technique artifact, not a permission result).
  Restore Tech afterward (Technician role `131b5274-...`; safety-net `staging-restore-tech.mjs`).
- **Roles list:** `GET /api/organizations/{org}/roles` (authoritative; `/api/roles` 405s);
  `GET /api/roles/{id}`. 11 system roles, all `default=true`; Office + Time Clock non-editable.
- **Role change forces re-auth:** changing a user's role invalidates the held session → next request
  409 "Session has expired." → re-login; poll fe-permissions until the new set applies (409 is expected).
- **Enforcement model:** backend enforces only resource-level View/Edit; granular perms (Delete, WO
  sub-perms, cross-toggles) are FE-only display gates → **FE-block + BE/API-allow = PASS (Rule 24)**;
  verify denials in the UI (endpoint often returns 400 validation, not 403).

## H. Settings
- **Read:** `GET /api/organizations/settings`. **Write:** `POST /api/organizations/settings/change`
  (send the FULL settings object). Simple Flow behavior is settings-driven (no feature flag).
- **Feature flags:** route `/administration/feature-flags`; org flags
  `GET /api/organization/feature-flags?organization_id={org}`.
- **PRICING MATRIX (parts sell-price rules) — route + API (proven live 2026-07-29):** UI =
  Settings → PARTS → **Pricing** = route `/administration/pricing` (permission `settingsParts`);
  tabs "Pricing Matrices(N)" + "Fixed Rules(N)"; click a matrix row → "Edit Price Matrix" dialog
  (Name, Category multi-select, rule rows Min Cost / Max Cost / Markup % / Margin %). API: list
  `GET /api/pricing-rules/list?limit=200&page=1` → `{data:{collection:[{id,name,categories:[catIds],
  rules:[{rule_id,type:'markup_for_interval',min_cost,max_cost,markup,margin}],is_default}]}}`;
  create `POST /api/pricing-rules/matrix`; edit `POST /api/pricing-rules/change-matrix`; delete
  `POST /api/pricing-rules/remove-matrix`. Fixed sell prices: `GET /api/parts/list-fixed-price`.
  Map category ids via `GET /api/inventory/categories`. **Known state 2026-07-29:** staging org
  d55bc308 has "Default matrix 07/12/2023" covering **Uncategorized** (cat id `b25c5c04-…`, 21 rules,
  e.g. $24.01–55 → markup 150%); prod test org 72b2cc90 has "Default matrix" covering Uncategorized
  (cat id `00e200b1-…`, 1 rule $1–2500 → markup 800%).

## I. UI automation (Quasar)
- **Escalation ladder when a click won't take:** (1) selector click → (2) fire the element's own
  handler / `dispatchEvent` → (3) **bounding-box / element-center COORDINATE click**
  (`page.mouse.click`) → (4) JS set value + dispatch `input`/`change` → (5) keyboard → (6) call the
  EXACT endpoint the button calls, ONLY after confirming the FE gate/dialog was reachable (disclose it;
  never PASS on gate presence alone). *Source: HEADLESS-AUTOMATION section below.*
- **Reach an in-page tab / WO detail (bounce fix):** land on `/workorders` then `page.evaluate(()=>{
  history.pushState({},'','/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})`.
  Close the auto New-Line dialog via `.q-dialog i:text("close")` (Escape does NOT close Quasar
  persistent dialogs). JS-click a tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- **Quasar selects:** click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never
  `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index.
- **🛑 QUASAR CHECKBOX STATE LIVES ON THE COMPONENT ROOT'S `aria-checked`, NOT ON THE HIDDEN
  `<input>` (proven live 2026-08-06, Schedule).** Reading the hidden input **mis-reported 9 of 11 roles**
  as having a permission switched OFF when they did not. Read the root's `aria-checked` (and the
  matching class), never the input's `checked` property. Same rule for the View-Options and
  Filter-and-Display toggles, which are the same component.
- **🛑 ALWAYS `scrollIntoViewIfNeeded()` BEFORE A COORDINATE CLICK — a click that misses looks EXACTLY
  like a feature that does nothing (proven twice, 2026-08-06, Schedule).** In the staff dialog the
  **Save & Close** button sits below the fold; a bounding-box-centre `page.mouse.click` landed on
  nothing, **0 requests** were sent, the dialog stayed open, and that was read as *"saving working
  hours does not persist"* — a **false "the working-hours service is broken" report** that came within
  one step of being filed as a defect. Same script with `scrollIntoViewIfNeeded()` first:
  `POST /change` **201** + `PUT /working-hours` **200**, and the edited value read back. **Two controls
  proved the mechanism from both sides** (hours untouched + button scrolled into view → both requests
  fired every time). **The variable is never the feature — it is whether the click reached the button.**

### 🔬 READING A LABEL OFF THIS SPA — the visible TEXT NODE, never the screen and never the accessible name (proven 2026-08-11, Schedule `sv8685`, `v3.5-65d6500`)

**Two traps, both of which produce a CONFIDENT WRONG ANSWER to a casing question. They cost nothing to
avoid once you know them, and a screenshot cannot settle either.**

**TRAP 1 — CSS `text-transform` makes the screen lie about capitalisation.**
`textContent` (and a `TreeWalker` over text nodes) returns the **raw markup**, immune to
`text-transform`. `innerText` **applies** it. The Schedule toolbar panels are styled uppercase, so:

| Read via | Filter & Display control | View options control |
|---|---|---|
| the screen / `innerText` | `FILTER & DISPLAY` | `VIEW OPTIONS` |
| **`textContent` (the shipped string)** | **`Filter & display`** | **`View options`** |

**A screenshot — or an `innerText` dump — would have decided two label questions wrongly.** So: harvest
with a `TreeWalker` over `SHOW_TEXT` for the canonical string, and keep `innerText` only for
*"what does the tester physically see"*.

**TRAP 2 — DO NOT ACCEPT THE ACCESSIBLE NAME AS THE LABEL.** The same toolbar button carries
`aria-label="Filter and display options"`. A containment/substring diff therefore "finds" a case's
wording `Filter and Display` **in the build** — but only inside a string **no manual tester can ever
see**. The visible label is `Filter & display`. **A label diff that accepts the accessible name will
certify the wrong wording with full confidence.** Rank the sources: **visible text node → tooltip →
`aria-label` (diagnostic only, never the tester-facing label).**

**A THIRD, CHEAPER TRAP WORTH THE SAME BREATH — a placeholder is not a mismatch.** Our own sweep
flagged `'N Lines'` on four cases as wrong because the build renders `8 Lines`. The cases are RIGHT:
one of them spells out *"(with N = the line count)"*. **Before staging a correction, check whether the
"mismatch" is deliberate scope-conditional wording (Rule 42) or a negative assertion** (*"there is no
'View Day' item"* — a string search cannot tell an assertion from a negation).

**Method that works, in one line:** dump `texts` (TreeWalker), `buttons`/`headers` (`innerText`),
`aria`, `placeholders` and every `data-test-id` per surface, keep them **per surface** so a change list
can say WHERE a label was seen, and prefer the **non-all-caps** form when the same label appears twice.
Harvester: `build/schedule/build-viu-2026-08-11/tools/harvest.cjs`; differ: `.../tools/sweep.py`.

### ⚡ THIS SPA AUTHENTICATES FROM `localStorage`, NOT COOKIES — a live API session is not enough to reach a page

A cookie set that returns **HTTP 200** on `…api.` will still land the browser on **`/login?redirect=…`**,
because the SPA decides "signed in" from `localStorage` (`user`, `token`, `fe_permissions_wrapper`). The
boot2 hydration is therefore **required**, not a shortcut. **Build the seed from LIVE reads every time**
(`/api/auth/me/fe-permissions`, `/api/staff`, `/api/staff/my-workplaces`) — **never reuse a stored
seed.** A seed captured hours earlier carried `default_workplace: "None"` from before the account was
configured, and reusing it would have faithfully reproduced the bounce it was meant to solve.

### 🕒 WORKING HOURS AND THE BEFORE/AFTER-HOURS FLAG — read the BOARD, and read the RIGHT technician

- **Per-staff hours:** `GET /api/staff/{staff_id}/working-hours` → `{data:{workingHours:{ranges:[{dayOfWeek,startMinute,endMinute}]}}}`.
  **Minutes from midnight** (420 = 07:00). **A non-working day has NO range at all** — and because a
  missing day is absent under ISO (1=Mon…7=Sun) *and* JS (0=Sun…6=Sat) numbering alike, "absent = not
  working" is **convention-independent** and safe to state.
  **Note the id: it is the `staff_id`, not the user `id`** — the user id returns `404 'Staff' was not found.`
- **Everything at once:** `GET /api/schedule/board?from=<ISO-Z>&to=<ISO-Z>` (**it rejects bare dates**:
  *"Must be a UTC ISO-8601 instant, for example 2026-08-03T00:00:00Z"*) returns `shifts` with
  **`conflictReasons`** (`before_hours` · `after_hours` · `double_booked`) and **`workingWindows`
  per staffId per date** — so a conflict can be checked against its OWN technician's window without
  opening the UI.
- **🛑 THE MISTAKE TO AVOID, and it nearly cost a false defect:** the flag is measured against **each
  technician's own configured hours**, and technicians on one board **differ** (Alicia Campbell
  06:00–15:00, MQ Test Tech Qamar 07:00–19:00). Comparing a flagged shift against **the signed-in
  account's** hours will look like a bug and is not one. **Proven correct: the UI quoted "(3:00 PM)" for
  Alicia's 15:00 end and "(7:00 AM)" for Qamar's 07:00 start, on the same board.**
- **⚠️ Build-wording caveat worth knowing before reading a case:** the message says *"Starts before
  **business** hours (7:00 AM)"* even though the boundary is demonstrably the **technician's** window.
  The label says business, the arithmetic is per-technician.

### ⚠️ EDITING A STAFF RECORD KILLS THAT USER'S SESSION — not just a ROLE change (widened 2026-08-11)

§A already records this for a **role** change (409 at +0 ms, new state applies only on a **fresh
login**). It also fires on a **default-location** change and on a **working-hours** change — i.e. it
appears to be **any** edit to the staff record. **Operational consequence: finish ALL account
configuration FIRST, then sign in, then hand over the cookies** — a set minted between two edits is
dead on arrival. **And the recovery ask is a FRESH SIGN-IN, not a `cf_clearance`:** the tell is
**409 on every branch and never 401** (proven end to end — the replacement set had a new `PHPSESSID`
with `sv_sso_session` and `cf_clearance` **byte-identical** to the set that was 409ing).

## J. TestRail API
- **⚠️ TestRail is the ONLY real/production system — NEVER create/update/delete cases, runs, or
  results without EXPLICIT user permission (Standing Rule 6).** Log ONLY Passed cases to a run; keep
  Failed/Retest/Blocked local.
- **Project 1 / single suite 1 "Master"**; API v2, Basic auth. Helper `testrail-api.mjs` reads creds
  from `/tmp/testrail/creds.json` (email + password-OR-key + host) — **never hard-code creds.** Calls
  hit `{host}/index.php?/api/v2/{path}`.
- **🛑 `add_case` MUST SEND `custom_atmstatus:1` (= "Not Automated") + a REAL `custom_automation_type`
  (`1 E2E · 2 Functional · 3 Unit` — NEVER `0`/None; QA lead 2026-09-02). `custom_atmstatus` is NEVER
  `3`. CORRECTED 2026-08-11 for atmstatus; automation_type made mandatory-non-zero 2026-09-02.** The
  type is set at birth in the TestRail case AND in any CSV/XML upload file, so it is never bulk-edited
  later (a 285-case sweep on 2026-09-02 fixed cases that were all born `0`). Rubric: Unit = isolated
  calc/format/single-field validation; E2E = cross-feature journey / browser print / audit trail /
  email-PDF delivery; Functional = single-feature UI behaviour (default).
  Place any case with API content in a section whose title includes "API" (Rule 4).
  **⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern) — until 2026-08-11
  this bullet read: *"`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`
  (non-API cases)."* **THAT IS THE INSTRUCTION THAT MADE EVERY API-CREATED CASE IN THIS WORKSPACE
  CLAIM TO BE AUTOMATED**, because every `add_case` script copied it; it is left visible so nobody
  re-derives it from an old script.
  **THE FIELD, READ LIVE FROM `get_case_fields` 2026-08-11 (not inferred):** `custom_atmstatus`,
  field id 17, label **"Automation status"**, dropdown values **`1` Not Automated · `2` Cannot be
  automated · `3` Automated · `4` Pending**. It is `is_required: true` for project 1 **but its
  `default_value` is `"1"`** — so `3` was never required by anything, and the required value, if one
  must be sent, is **`1`**. (`custom_automation_type` is `is_required: false`, `default_value: "0"`.)
  **WHY IT MATTERS: `3` is Vladimir Tomovic's OWN flag for what HE has automated**, and Standing
  Rule 65 keys the whole tell-Vlad duty off it, so a case born `3` corrupts the signal he and we both
  rely on. **31 Schedule cases were corrected `3 → 1` on 2026-08-11**
  (`build/automated-flag-and-c30041-2026-08-11/`).
  **USE THE CANONICAL HELPER, DO NOT HAND-ROLL THE PAYLOAD:**
  **`build/testing-tools/testrail_add_case.py`** — `add_case_payload()` sets `1` and **raises** on
  `3`; `verify_created_case()` does the Rule-50 byte-check on the created case.
  **AND THE GUARD: `build/testing-tools/check_add_case_payloads.py`** fails any new payload carrying
  `3` (run it before committing a pass that creates cases).
  **⚠️ DO NOT COPY AN `add_case` PAYLOAD OUT OF AN EXECUTED PUSH SCRIPT.** The 19 already-executed
  scripts still contain `3` **deliberately** — they are the audit record of what was actually run, and
  rewriting them would make that record lie. Copy from this bullet or from the helper.
- **Result statuses:** 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed.
- **🛑 CASE-FIELD FORMATTING — THE ONLY SAFE FORMAT IS BLOCK-LEVEL HTML; NEVER INLINE TAGS, NEVER
  PLAIN NEWLINES (proven live 2026-08-28, C27800 + probe round-trips).** `custom_preconds`,
  `custom_steps`, `custom_expected` are **`format: markdown`** (read live from `get_case_fields`), but
  TestRail runs every submitted value through a **sanitiser that WRAPS the whole value in ONE outer
  `<p>…</p>`** on save. Consequences, all verified by round-trip:
  - **Plain text with `\n` / `\n\n` LOSES ALL LINE BREAKS.** The blank lines end up *inside* that single
    outer `<p>`, and a paragraph collapses internal whitespace → every paragraph runs together as one
    block. **This is the bug that made C27800 show as a wall of text.** (It is also why the earlier
    "plain text auto-wraps and renders cleanly" note was WRONG — it does wrap, but into ONE `<p>`.)
  - **STYLING inline tags show LITERALLY** — `<b>`, `<i>`, `<u>`, `<code>`, `<em>`, `<strong>` were seen
    printed as text by the tester. **Never use styling inline tags for formatting.**
  - **⚠️ `<br>` IS ORIGIN-DEPENDENT — IT SHOWS LITERALLY WHEN WRITTEN VIA THE API (corrected
    2026-08-28, QA lead observed our API update print `<br>` as text).** The TestRail **UI editor** stores
    `<br>` in a way that renders (that is why the QA lead's own manual edit of C27800 looks right), but an
    **API write** of the same `<br>` shows the literal tag. **Because our scripts write via the API, NEVER
    emit `<br>` (or any inline tag) in an API payload.** To put each statement on its own line via the
    API, use **separate `<p>` blocks** (wider gap) or a **`<ul><li>` list** (tight lines). A `<br>` seen
    on a live case is normally a human's UI edit — leave it; just never generate one.
  - **BLOCK-LEVEL tags are the ONLY thing proven to render when written via the API:** `<p>` (one per
    paragraph — do NOT put `\n\n` inside a `<p>`), `<ol>/<ul>` with `<li>`, and `<hr />`.
    The sanitiser strips some closing
    `</p>` and re-nests the markup (raw read-back looks mangled: `<p>A<p>B</p>…</p>`), **but the browser
    auto-closes an open `<p>` when the next block starts, so it renders as clean separate blocks.** Do
    not "fix" the mangled read-back — that is expected and it renders correctly.
  - **QA-LEAD-APPROVED REFERENCE EXAMPLE (blessed 2026-08-28): C27801** — preconditions as separate
    `<p>` paragraphs, steps as `<ol><li>`, expected = statement + `<hr />` + a "Source of expected
    behaviour:" `<ul><li>` list + a final `<p>` "Source-verified <date>". The QA lead confirmed this
    layout is "ideal". Copy it for any Custom Roles / permission case.
  - **THE RULE WHEN UPDATING ANY CASE (e.g. after source verification): MATCH THE PROVEN-GOOD FORMAT.**
    Copy the exact block structure of a case known to render well — e.g. C27801 or Global Search
    **C44804** — which
    stores steps/expected as `<ol><li>…</li></ol>` and appends provenance as `<hr /><p>…</p>` after the
    last item. **One paragraph = one `<p>`; steps = `<ol><li>`; the source block goes BELOW the expected
    behaviour, separated by `<hr />`, as a `<p>` label + `<ul><li>` list + a final `<p>` with the
    verification date.** No inline tags anywhere. Never send raw `\n`-separated plain text.
  - The canonical converters already do this right: `to_ol()` / `expected_html()` in
    `build/global-search/apply_to_testrail.py` and `.../regression-2026-08-26/push_to_testrail.py` emit
    block-only HTML — **reuse them; do not hand-author field HTML.**
  - **🛑 POST-WRITE RENDER SELF-CHECK IS MANDATORY (standing rule, QA lead, 2026-08-28).** After ANY
    `add_case` / `update_case`, **fetch the case back and confirm it renders correctly for a manual
    tester before you call the work done.** Never assume the write looks right — verify it. Run
    **`python3 build/testing-tools/check_case_render.py <C-ID> [<C-ID> ...]`** for every C-ID you
    touched; it fetches each case live and fails (exit 1) on inline tags, wall-of-text (blank-line
    paragraphs with no block structure), or multi-line content with no block tags. Push/apply scripts
    that create or edit cases should call it (or reproduce its checks) as their final step. A green
    self-check is part of "done"; a case is not finished until it passes.
- **⚠️ `get_sections` NEEDS PAGING, AND IT FAILS SILENTLY IF YOU FORGET (proven live 2026-08-05,
  Filters).** This project now has **625 sections**. An unpaged `get_sections/1&suite_id=1` returns
  only the **first 250**, with no error and no warning — and because the Filters group is section
  **4110**, well past 250, an unpaged call finds **ZERO Filters sections and therefore zero cases**,
  which reads exactly like "the group is empty" rather than "you truncated the list". **Always page:**
  loop `&limit=250&offset=N` until a chunk comes back shorter than 250, then walk the `parent_id` tree
  down from the group id to collect the subtree. **Also note the URL form:** the query separator must
  be `&`, not `?` — `get_sections/1?suite_id=1` returns
  `HTTP 400 {"error":"Invalid characters in URI: [/api/v2/get_sections/1?suite_id]"}`. The same paging
  rule applies to `get_cases`, `get_tests` and `get_results_for_run`.
- **⚠️ WHY THAT `&` RULE HOLDS FOR *EVERY* PARAMETER, NOT JUST `suite_id` — AND WHY IT IS THE REAL
  CAUSE OF THE `getall()` / `trlib` PAGING BREAKAGE (recorded 2026-08-11, Schedule staged push).**
  **TestRail joins EVERY parameter after the endpoint with `&`, NEVER `?`, because the whole
  `/api/v2/...` path already sits INSIDE the `index.php` query string.** The base URL is
  `{host}/index.php?/api/v2/{path}` — the `?` has already been spent on `/api/v2/...` itself, so a
  second `?` anywhere in `path` is not a separator at all, it is an **illegal character inside a query
  value**. Hence `get_cases/1?suite_id=1` fails with **`400 Invalid characters in URI`** for exactly
  the same reason an appended `?limit=` does, and hence `get_cases/1&suite_id=1&limit=250&offset=0`
  works with **four** parameters and only ampersands.
  **PROVEN LIVE 2026-08-11, all three read-only:** `get_cases/1?suite_id=1` → **HTTP 400
  `{"error":"Invalid characters in URI: [/api/v2/get_cases/1?suite_id]"}`** · the four-parameter
  ampersand form → **HTTP 200** · a five-parameter form with `&section_id=` → **HTTP 200**. **And
  TestRail corroborates it itself: the `_links.next` it hands back reads
  `/api/v2/get_cases/1&suite_id=1&limit=2&offset=2` — ampersands throughout, no `?` anywhere.** So the
  server's own pagination link is the canonical example of the form to build.
  **THIS IS DEEPER THAN "it appends `?limit=` twice", which is how the fault has been described
  before.** The paginators in `build/testrail-run-sync-2026-07-31/{run_sync_audit,sync_runs_EXECUTOR,
  exec_run_sync_2026-07-31}.py` all carry the shape
  `f"{path}{'&' if '?' in path or '/' in path else '?'}limit=250&offset={offset}".replace('?limit', '&limit')`
  — a conditional that can emit `?` followed by a `.replace()` that patches it back to `&`. **It
  happens to work, but only because the patch undoes the conditional**, so the moment anyone edits
  either half, or adds a parameter, or reorders the string, the request 400s and the failure reads
  like a permissions or paging problem rather than a URL problem.
  **THE RULE TO CODE TO: build the path with `&` unconditionally and never write a `?` into it.**
  `f"{path}&limit=250&offset={offset}"` needs no conditional and no `.replace()`. The clean
  implementation is `/tmp/testrail/tr.py` (`get_cases` / `get_tests` / `get_results_for_run`), which
  concatenates `&limit=250&offset=N` and has never hit the error.
  **AND THE FAILURE IS SILENT IN THE OTHER DIRECTION**, which is why it is worth this much space:
  forget the parameter and you get **250 rows and HTTP 200** (the truncation trap in the bullet above);
  write it with `?` and you get **HTTP 400 with a message that names a URI nobody wrote by hand**.
  Neither symptom points at the cause.
- **Corroboration of DECLARED NORMALISATION #2 below, from a second project (Filters, 2026-08-05):**
  retitling **C29624** made **5 of run 352's 429 historical result records** read back with a different
  `case_title`, and `case_title` was **the only field that differed across all 429** — status, comment,
  who, when, elapsed, defects and version were byte-identical. Two independent projects, same
  behaviour, so it is safe to rely on.
- **⚠️ DECLARED NORMALISATION #2 — `get_results_for_run` ECHOES THE CASE'S *CURRENT* TITLE (proven live
  2026-08-05, Report Suite).** Historical result records carry a **`case_title`** field that TestRail
  fills in **at read time from the case as it stands now**, not from the title the case had when the
  result was graded. **So retitling a case makes its old result records read back differently with NO
  run write whatsoever.** Proven: 3 of run 359's 532 result records differed pre-versus-post a
  `update_case` batch, the ONLY differing field across all 532 was `case_title`, the 3 belonged to
  exactly the 2 cases retitled, and `status_id` · `comment` · `created_on` · `created_by` · `elapsed`
  · `defects` · `version` · `test_id` · `id` were **byte-identical on all 532**. **CONSEQUENCE for
  Standing Rules 34/47/50: verify a run untouched on those fields and treat `case_title` as DERIVED —
  a raw whole-record compare will otherwise report a false "results changed" and stop a clean batch.**
- **⚠️ DECLARED NORMALISATION #2b — `case_refs` IS THE SAME KIND OF ECHO AS `case_title` (found 2026-08-05,
  Report Suite).** A result record also carries a **`case_refs`** field, filled in **at read time from the
  case's References as they stand now**. So **writing `refs` on a case makes its old result records read
  back differently with NO run write** — exactly as retitling does (#2). Both are DERIVED; neither is a
  graded field and neither can be written by us. **Verify a run untouched on the graded fields
  (`status_id` · `comment` · `defects` · `elapsed` · `version` · `assignedto_id` · `created_by` ·
  `created_on` · `test_id` · `case_id` · `id`) and treat `case_title` AND `case_refs` as echoes** — a raw
  whole-record compare will otherwise report a false "results changed" and stop a clean batch. Confirmed by
  reading a live run-359 result record whose `case_refs` reproduced its case's full Rule-20 reference
  string verbatim.
- **🛑 DECLARED NORMALISATION #3a — AND THE "SENT EXPLICITLY IS STORED VERBATIM" HALF OF #3 IS FALSE.
  PROVEN 2026-08-25 (Global Search / Digital Inspections).** Three normalisations fire on `update_case`
  **even when every field is sent explicitly at its exact snapshot value.** They are recorded here, with
  their evidence, **because Standing Rule 50 forbids relying on an undeclared normalisation** — and a
  pass that byte-compares without knowing these will stop a correct batch, while a pass that shrugs them
  off will miss real damage. **Compare on the RENDERED text** — tags stripped, entities decoded,
  whitespace collapsed — **and treat byte-equality as reportable but unattainable.**

  | # | What TestRail does on write | Evidence |
  |---|---|---|
  | **3a-i** | **Plain multi-line text is wrapped in `<p>…</p>` with the newlines left BARE** — producing the run-on-paragraph collapse. **A plain-text case is therefore DAMAGED by any write that does not pre-empt it.** Mitigation: insert `<br>` before each newline **in the same payload**. | C44864: three fields sent byte-identical, all three returned `<p>`-wrapped; case had been plain text |
  | **3a-ii** | **Characters are entity-encoded** — `—` → `&mdash;`. Renders identically, so it is a true normalisation, not damage. | C44506 `custom_preconds` |
  | **3a-iii** | **🔴 BLOCK MARKUP IS RE-PARSED AND A LIST'S CLOSING TAG IS RELOCATED TO THE END OF THE FIELD.** `<ol>…</ol><hr /><p>prov</p><p>marker</p>` comes back as `<ol>…<hr><p>prov</p><p>marker</p></ol>` — the provenance and marker end up **nested inside the ordered list**, and `<hr />` becomes `<hr>`. **This is NOT recoverable by writing the correct HTML back:** two attempts, one with the original bytes and one with the blocks made contiguous (no newlines between them), both re-parsed the same way. | C44506, three writes |

  **⇒ THE OPERATIONAL CONSEQUENCE, AND IT IS A REASON NOT TO WRITE:** a case created by **CSV import**
  holds clean block HTML that `update_case` **cannot reproduce**. So **touching such a case costs its
  markup structure permanently**, for the rendering gain of nothing. **Do not write to a case unless the
  write fixes something a tester can actually see.** *(Scar: a batch built on a faulty "collapse"
  detector wrote to C44506 believing it was repairing a run-on paragraph. The field had been correct
  block HTML all along; the write nested its provenance inside the list and could not be undone. The
  detector had flagged any field holding `<p>` + a newline + no `<br>` — which is the NORMAL import
  shape. The correct test is narrower: a **single `<p>` whose own inner text contains a newline**.
  Re-derived across all 428 August cases with the corrected test: **0 genuinely collapsed cases** —
  against 16 the faulty one claimed.)*

- **🛑 DECLARED NORMALISATION #3 — `update_case` RE-RENDERS ANY TEXT FIELD YOU *OMIT* FROM THE PAYLOAD
  (found the hard way 2026-08-05, Filters).** Send a partial payload — say only `custom_expected` — and
  TestRail may push the fields you did **not** send back through its HTML pipeline: `custom_preconds`
  and `custom_steps` came back **wrapped in `<p>…</p>` with every `\n` converted to `\r\n`**. A field
  **sent explicitly is stored verbatim**. **THE MITIGATION, APPLY IT WITHOUT EXCEPTION: on EVERY
  `update_case`, send ALL THREE text fields — `custom_preconds` + `custom_steps` + `custom_expected` —
  even when you are changing only one**, setting the unchanged ones to their exact pre-write snapshot
  value. It costs nothing and it is the only reliable protection.
  **WHY IT MATTERS SO MUCH HERE: these projects render that markup LITERALLY to the manual tester.**
  This is not cosmetic — on the very same day, **10 Filters cases and 16 Schedule cases** had to be
  repaired for showing raw `<ol>`/`<li>` to the tester. A partial payload silently manufactures that
  same defect.
  **HOW IT WAS FOUND:** write **1 of 110** (**C29557**) sent only `custom_expected`, returned **HTTP
  200**, and the Rule-50 byte-check flagged **two UNINTENDED field changes**. The batch **stopped
  immediately**, the two fields were **restored byte-exact** from the pre-write snapshot, and all 110
  subsequent payloads carried all three fields and verified clean. An untouched control case
  (**C29558**) was byte-identical **including `updated_on`**, so the re-render was caused by the
  partial payload, not by anything ambient. **A "200 OK" tells you nothing about this — only the
  byte-check catches it.**
  **⚠️ IT IS CONDITIONAL OR INTERMITTENT — DO NOT ASSUME YOU ARE SAFE (independently verified
  2026-08-05, all three active projects).** The same day, in the **same project 1 / suite 1**, the
  **Report Suite** pass sent **469 partial payloads** (`custom_expected` only) over content
  structurally identical to the Filters cases — same plain numbered text, same `\n`, same `---`
  separators — and was **NOT affected at all**; **Schedule** sent all three fields on all 165 payloads
  and was **immune by design**. So the trigger condition is **NOT characterised**, and it fired on one
  pass while sparing another hours earlier. **Therefore treat every partial payload as unsafe rather
  than trying to predict it.** (Independent audit that established this: all **753** live cases across
  groups 4281 / 4254 / 4110 re-read **twice**, by `get_cases` and by per-case `get_case`, with **0
  field differences**, and every project's committed pre-write snapshot diffed field-by-field against
  live — **0 damage signatures introduced anywhere**.)
  **THIS IS NOT A NORMALISATION YOU MAY USE TO EXPLAIN AWAY A MISMATCH.** Unlike the `refs` re-join
  and the `case_title` / `case_refs` echoes, this one is **silent data corruption**, not a benign
  server transformation. If a byte-check flags `custom_preconds` or `custom_steps` moving on a write
  that did not intend to touch them, **the write FAILED**: stop the batch, restore from the snapshot,
  and re-send with all three fields (Rule 50).
  **SCOPE:** the exposure is the three text fields above. The other text-ish custom fields
  (`custom_mission`, `custom_goals`, `custom_steps_separated`, `custom_testrail_bdd_scenario`) are
  **null on all 753 of our cases**, so they cannot be damaged today — but if any project ever populates
  one, it joins the send-it-every-time list.

- **🔴🔴 CORRECTION, 2026-08-26 — NORMALISATION #3's MITIGATION IS INVERTED AND MUST NOT BE FOLLOWED.
  OMITTED FIELDS ARE PRESERVED; *SENT* FIELDS ARE THE ONES THAT GET RE-RENDERED. SEND ONLY WHAT YOU
  ARE CHANGING.** Settled empirically on a **throwaway case**, never on a real one, because the two
  recorded positions (#3 "always send all three" vs. hazard #6 "every sent field is re-wrapped")
  cannot both be operational advice. **The old #3 text above is kept visible and is NOT deleted — but
  its instruction *"on EVERY `update_case`, send ALL THREE text fields"* is SUPERSEDED and is now the
  wrong thing to do.**

  **THE EXPERIMENT (script `build/report-suite/writes2-2026-08-26/job4_field_preservation.py`, log
  `logs/job4-field-preservation.log`).** One `ZZAUTOTEST`-prefixed case, `custom_atmstatus: 1`, created
  in section 237 with distinctive multi-block preconditions/steps/expected, then **deleted** (re-GET
  after delete → HTTP 400 `"Field :case_id is not a valid test case."` — confirmed gone).

  | Test | What was sent | Result, byte-compared on a re-GET |
  |---|---|---|
  | **(a)** | `update_case` with **only `{"title": …}`**, all three text fields **OMITTED** | **ALL THREE PRESERVED BYTE-IDENTICAL.** `custom_preconds` sha `853db875…` before and after; `custom_steps` `48024bf0…`; `custom_expected` `dca7952b…`. **Nothing was re-rendered.** |
  | **(b)** | `update_case` with **all four fields**, the three text values byte-identical to the re-GET | **LOSSLESS** — all three came back byte-identical to what was sent. |
  | **(c)** | the **initial `add_case`**, plain text sent | **ALTERED ON THE WAY IN**: `'ZZAUTOTEST-PRE-B1\n1. …'` was stored as `'<p>ZZAUTOTEST-PRE-B1\n1. …</p>\n'` — sent-vs-stored identical = **False**. |

  **⇒ WHICH RULE IS TRUE:** the **last worker is right**. Round-tripping is stable *once* a value has
  been through TestRail's pipeline — which is why (b) looked lossless — but the pipeline runs on
  **what you send**, never on what you omit. **A field you omit is untouched. A field you send is
  re-rendered.** This CONFIRMS hazard #6 and **REFUTES normalisation #3's mitigation**: sending an
  unchanged field "for safety" is the only way to damage it.

  **⇒ THE RULE, FROM 2026-08-26:** **send ONLY the fields whose content you are actually changing.**
  Omit the rest. Then byte-verify: the omitted fields must be byte-identical to the pre-write snapshot,
  and the sent fields must equal the sent value **after normalisation** (`—`→`&mdash;`, `<p>` wrap if
  the value does not already start with a block tag, trailing `\n`). Reference implementation of that
  comparison: `build/report-suite/writes2-2026-08-26/job1_verify.py`.

- **🔴🔴 THE `<p>` WRAP IS UNCONDITIONAL — AND WHETHER IT HARMS THE TESTER DEPENDS ON A PER-CASE
  RENDER FLAG THE API DOES NOT EXPOSE. CHECK THE VIEW PAGE BEFORE ANY TEXT-FIELD WRITE (proven
  2026-08-26).** This is the missing half of hazard #6 and it explains why some passes "got away with
  it" and others did not.

  **(i) The wrap cannot be avoided.** Eight formulations were tried on a throwaway — plain, trailing
  `\n`, leading `\n`, CRLF, blank-line-separated, leading space, markdown bullets — and **all eight
  came back `<p>…</p>\n`.** The only value stored unwrapped is one that **already begins with a
  block-level tag** (`<ol>…</ol>` stored as sent, no wrapper added, and `<p>x</p>` is not
  double-wrapped).

  **(ii) The damage is decided by the container, not by the content.** TestRail's case-view page emits
  each field into one of two containers:

  | Container in the served view page | Behaviour | Effect of the `<p>` wrapper |
  |---|---|---|
  | `<div class="markdown fr-view">` | value emitted **RAW**, HTML renders | **invisible — harmless** |
  | `<div class="markdown">` | value run through the **markdown renderer**, which **ESCAPES** every tag | **the tester literally reads `<p>` and `</p>`** |

  **The container is a per-case property that `get_case` does not return** — it is not derivable from
  the value's content (a `<p>`-wrapped plain body renders raw on one case and escaped on another), and
  it is **not** the field's configured `format: markdown`. **It can only be read from the served view
  page**, by looking for `markdown fr-view` vs `markdown`. Scanner:
  `build/report-suite/writes2-2026-08-26/job4_render_path_scan.py`.

  **(iii) THE BLAST RADIUS ALREADY INCURRED — 72 Report Suite cases are showing tag text to testers
  right now.** All 185 cases touched on 2026-08-26 were scanned: **72 sit in an escaping `markdown`
  container and now display a literal `<p>` and `</p>`** (three of them a `<br>` as well). **71 were
  written by the 12:40 write pass; 1 (C30518) by the 13:1x Job 1 rewrite.** Causation is **proven, not
  assumed**: the pre-write snapshot `build/report-suite/source-verify-2026-08-26/data/live-cases.json`
  was captured at **11:53, before those writes**, and **all 72 contained no HTML tag at all in any of
  the three fields at that moment**. C-ids: `build/report-suite/writes2-2026-08-26/logs/job4-damaged-cids.txt`;
  causation split: `logs/job4-causation.json`.

  **(iv) THEY CANNOT BE REPAIRED THROUGH THE API.** Any API write re-adds the wrapper, and any HTML
  written instead is escaped by the same renderer — so on an escaping case **every possible API value
  puts visible tag text on the tester's screen**. Repair needs the **TestRail web editor**. A
  UI-form-post repair path was investigated and **not attempted**: `index.php?/cases/edit/<id>` does
  not expose the three text fields as form inputs (they are JS editors) and the form carries a
  `_token`, so reconstructing the post is not safe to do blind.

  **⇒ THE PRE-WRITE GATE, FROM 2026-08-26 — do this BEFORE any text-field write:** fetch
  `index.php?/cases/view/<id>` on a logged-in UI session and read the container. **`markdown fr-view`
  → safe to write. Plain `markdown` → DO NOT WRITE via the API**; the write will damage the case
  visibly, whatever you send. (Worked example: C30287 and C30536 are `fr-view` and were written safely
  on 2026-08-26; C30518 is `markdown` and was damaged by an otherwise-correct write.)

  **⇒ THE STANDING OPERATIONAL RULE (recorded 2026-08-26, after the repair was approved):**
  **`update_case` RE-RENDERS ANY FIELD YOU SEND AND PRESERVES ANY FIELD YOU OMIT — SO SEND ONLY THE
  FIELD YOU ACTUALLY NEED TO CHANGE.** Whether the re-render is **VISIBLE** depends on a **per-case
  container flag** (`markdown` escapes and shows literal tags to the tester; `markdown fr-view`
  renders correctly) which **`get_case` DOES NOT EXPOSE**. Therefore: **NEVER bulk-write plain text
  via the API**, and **where a case's body must change and its container is unknown, prefer the UI
  editor.** On 2026-08-26 this damaged **72 cases**.

  **⇒ 🔑 sv8218 (ShopView QA) — REAL ROUTES, FOUND BY WATCHING THE APP (2026-08-31).** Guessed routes
  404'd every single time on this project; every working one came from `page.on('request')` while
  clicking the app's own tabs. **The convention is `/api/<thing>/view/<id>`, not `/api/<thing>/<id>`**
  — `/api/customers/<id>` is a 404 while **`/api/customers/view/<id>` is a 200**.

  | Route | Method | Notes |
  |---|---|---|
  | `/api/customers/view/{id}` | GET | the customer record (NOT `/api/customers/{id}`) |
  | `/api/customer-payment/list` | GET | customer payments |
  | `/api/customer-deposits/list` | GET | customer deposits |
  | `/api/customer-account/list-unpaid-transaction?account_id=<id>` | GET | **the rows are at `data.response.collection`, NOT `data.collection`** — alongside `unpaid_transactions_count` and a `groupByDueDateData` ageing block. Reading `data.collection` returns `undefined`, which a loop silently treats as "no rows" and reports as zero for every account. **And it is the UNPAID list only**, so it is the wrong list for finding a credit that has been applied — ask the endpoint that answers the question (2026-09-02) |
  | `account_id` itself | — | **`customer_account_id`, and it is ONLY on `/api/customers/view/<id>`** — the customers LIST does not carry it. Passing the customer id instead returns HTTP 200 with zero rows, on every account (2026-09-02) |
  | `/api/customers/{id}/default-adjustments` | GET | fees & discounts defaults |
  | `/api/part-sales` | GET | **53 part sales**, statuses paid/complete/estimate; fields include `number`, `status`, `invoiceShopId`, `invoicedDate` — but **no `invoice_id`**, and `/api/part-sales/view/{id}` is a **404**, so the part-sale document route is still unfound |
  | `/api/credit-memos` | **POST only** | GET answers **405 `Allow: POST`**; a bare POST answers 400 *"customer_account_id: Missing required parameter, amount: Missing required parameter"* ⇒ **credit memos are created against a CUSTOMER ACCOUNT, not a work order** |
  | `/api/work-orders/statuses` | GET | Estimate · Approved · In progress · Review · Complete · Invoiced · Paid |
  | `/api/invoices/preview?invoice_id=<id>&type=html&isEstimate=<0\|1>&includeDeclined=<0\|1>&historyEvent=` | GET | the document render path; invoice id is `data.work_order.invoice_id` on `/api/work-orders/view/{woId}` |

  **⇒ ✅ THE INVOICE UI REFRESH DOCUMENT ROUTES, ALL BUILD-VERIFIED LIVE 2026-08-31.** Two of these
  came from a source-read by another session (`CROSS-SESSION-UNBLOCK-2026-08-31.md`, badge **never
  build-verified**); each was then confirmed with one live call, which is what moves a lead to a fact
  (Rule 12). **One of them did NOT behave as the source predicted — see the 500 below.**

  | Document | Route | Live result |
  |---|---|---|
  | Invoice / Estimate (HTML) | `GET /api/invoices/preview?invoice_id=<id>&type=html&isEstimate=0\|1&includeDeclined=0\|1&historyEvent=` | 200 |
  | Invoice / Estimate (**PDF**) | same route, **`type=pdf`** | **200, real PDF v1.7, 187 KB** |
  | **Credit Invoice** | `GET /api/credit-memos/{creditMemoId}/pdf` | **200, PDF, `credit-memo.pdf`** |
  | **Parts Sale** Invoice / Estimate | `GET /api/invoices/preview?invoice_id=<the part sale's invoice_id>&isEstimate=0\|1` | **200** — `INV-P2-123` / `EST-P2-123` |
  | Parts Sale (dedicated endpoint) | `GET /api/part-sales/{workOrderId}/invoice-pdf?estimate=0\|1` | **HTTP 500** — twice, two part sales, both `estimate` values |

  **🔑 A PART SALE *IS* A WORK ORDER.** `/api/part-sales/{id}/pdf` and `/api/part-sales/view/{id}`
  are 404, but **`GET /api/work-orders/view/{partSaleId}` returns 200** and the paid one carries
  `invoice_id` — which the ordinary preview route accepts. The `/api/part-sales` row `id` **is** the
  work order id (the view payload echoes it back as `"id"`). The clue was in the credit memo payload:
  `origin_invoices[0].work_order_type == 'service'` implies other work-order types exist.

  **🔑 `type=pdf` WAS ALWAYS THERE.** The DTO asserts `Choice(['html','HTML','pdf','PDF'])`. A pass
  spent a day rendering `type=html` and reported four cases blocked on *"Generate the PDF"*. **Try
  the one-token variant of the call you are already making before reporting a capability missing.**

  **🔑 `includeDeclined=1` RENDERS DECLINED WORK — the capability ships without a UI control.**
  Live: the same invoice goes from 4,366 to 5,256 visible characters and the label **`Declined Work`**
  appears. The **toggle** is absent from the Invoice Details dialog (proven with a firing control),
  and no front-end code sends the param. **This is NOT Rule 24** — Rule 24 is about a permission
  boundary correctly hidden from a user who should not act; here the control is missing for an admin
  who *should* have it, on a story still In Progress. So it is **possibly-unfinished (Rules 49/60)**,
  keeps the documented expectation (Rule 57) and the **NOT AVAILABLE ON BUILD** marker (Rule 69) —
  **not a PASSED case, and not a defect ticket.**

  **⚠️ A 500 IS NOT A 404, AND THE DIFFERENCE IS THE DIAGNOSIS.** On `part_sales_invoice_pdf` the
  param is `#[MapEntity('partSaleId')] WorkOrder`, so an unresolvable id yields **404**. Getting
  **500** proves the entity bound and the fault is inside the handler — and the same document
  renders fine through the preview route, so template and data are good. Candidate written up at
  `build/invoice-ui-refresh/build-verify-2026-08-31/DEFECT-CANDIDATE-partsale-invoice-pdf-500.md`
  (not filed — hold active).

  **⚠️ THE CREDIT DOCUMENT IS PDF-ONLY.** `type=html`, `format=html`, `html=1` and `?preview=1` all
  still return `%PDF-`. Text extraction needs pypdf; this image's `cryptography` is broken
  (`_cffi_backend` missing) and `pip install --force-reinstall cffi` fixes it. **pypdf inserts
  kerning artefacts inside words** — the captured credit document literally reads `T ax`,
  `T erritory` — so a label matcher needs a **space-insensitive fallback applied only after an exact
  miss**, with controls drawn from the PDF itself. **Never edit the captured text to suit the
  matcher.**

  **⇒ 🔑 CUSTOMER CREDIT MEMOS ON sv8218 — the record is reachable, the DOCUMENT is not (2026-08-31).**
  `GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>` returns them,
  with `type: credit`, `formatted_invoice_number: CM-100`, `status_label: Unapplied`. The
  **`customer_account_id` is `data.company.customer_account_id` on
  `GET /api/customers/view/{customerId}`** — it is NOT the customer id. The **invoice menu's
  "Issue Credit" action DOES create a genuine customer credit memo** (a session on 2026-08-31 first
  concluded it made "only a part-sale credit" — wrong; the `has_part_sale_credits: true` flag was a
  side effect). **The credit memo's document could not be rendered:** it is absent from the customer's
  Invoices/Payments/Deposits tabs and from the originating work order's finance tab, 13 candidate
  routes all 404, `/api/invoices/preview` rejects a credit memo id, and the app never calls a
  credit/preview route. **Before re-running that hunt, read this list — it is the searched set.**

  **⚠️ A 405 IS A FIND, NOT A FAILURE.** `/api/credit-memos` answering *405 Method Not Allowed
  (Allow: POST)* proved the endpoint exists and named its method, and the 400 that followed named its
  required parameters. **Read the error body — on this API it enumerates the missing fields.** A
  session that treats any non-200 as "absent" will report a built feature as missing.

  **⚠️ AND: `/api/work-orders/statuses` DOES NOT LIST INVOICE STATES.** On 2026-08-31 a session read
  that list, saw no partial/void/draft, and told the QA lead those invoice states were "probably not
  built". **Wrong: they are WORK ORDER statuses.** Partially-paid and voided/reversed invoices are
  both explicitly in the Invoice UI Refresh spec, and Jira has shipped reversal work (SV-9087,
  SV-9382, both Done). **Never answer "is this state built?" from a different entity's status list.**

  **⚠️ THE PAID BANNER IS PORTAL-ONLY.** Spec S8-R8: the paid banner *"appears only on the Invoice
  PDF generated by the customer portal… An Invoice PDF generated in the shop app never carries the
  banner."* So `PAID IN FULL`, `PARTIALLY PAID`, `Payment Receipt - Payments by ShopView`,
  `Total Charged`, `Remaining Balance`, `Convenience Fee`, `Late Fee`, `Paid By`, `Method`,
  `Date / Time`, `Invoice Amount`, `Payment X of Y - Batch` **can never be found by rendering a
  shop-app invoice, however it was paid.** A label absent from one render path is not absent from
  the product — establish WHICH path is supposed to carry it before calling it a gap.

  **⚠️ JIRA STORY STATUS IS NOT EVIDENCE ABOUT THE BUILD.** All 13 SV-8218 stories read **Open** on
  2026-08-31 while the sv8218 build already rendered `Paid date:` in place of `Due date:` — net-new
  S10-R4. **The branch runs ahead of the tickets.** Ticket status is context; only observation is
  evidence (Rule 57, and Rule 61's *"ticket status is never evidence about the build"*).

  **⇒ 🛑 THE UI-LOGIN CREDENTIAL TRAP — IT TURNS THE CONTAINER SCANNER INTO A DETECTOR THAT CANNOT
  FIRE, AND IT REPORTS A CLEAN BILL OF HEALTH (found 2026-08-31, Invoice UI Refresh).**
  **`/tmp/testrail/creds.json['password']` holds the TESTRAIL API KEY, not the account password.**
  The API accepts the key as the Basic-auth password, so every `get_case` works and the file looks
  correct. But the **web UI login form needs the real account password**, and posting the API key into
  it **fails silently**: the POST returns HTTP 200, you land back on `/auth/login/`, and every
  subsequent `index.php?/cases/view/<id>` fetch returns the **24 KB login shell** instead of the case.
  The container regex then matches **nothing**, and the scan reports **"0 escaping containers"** for
  every case — i.e. *"all safe, write via the API"* — which is the exact opposite of the truth.
  On this pass the real split was **48 escaping / 5 fr-view**; the broken scan said **0 / 53**.
  **⇒ Keep the UI password in a SEPARATE file (`/tmp/testrail/ui-creds.json`, `chmod 600`), and make
  every UI-session scanner CONTROL ITSELF:** assert the post-login URL is **not** `/auth/login`, assert
  the fetched page actually contains the case's own title, and classify a case whose container could
  not be located as **UNKNOWN — never as "safe"**. Working scanner with all three assertions:
  `build/invoice-ui-refresh/build-verify-2026-08-31/markers/render_scan.py`.
  *(This is Rule 12 in miniature: "0 problems found" from a probe that cannot fire is not a result.)*

  **⇒ ✅ A UI SAVE FLIPS THE CONTAINER TO `fr-view`; AN API WRITE LEAVES IT ESCAPING (measured
  2026-08-31).** §J above says repair "needs the web editor" but not *why it sticks*. It sticks because
  the container flag follows the **write path**, not the content:

  | How the field was last written | Resulting container | Tester sees |
  |---|---|---|
  | `add_case` / `update_case` (API) | plain `<div class="markdown">` | **literal `<ol><li><p>` text** |
  | the TestRail web editor (UI save) | `<div class="markdown fr-view">` | correctly rendered |

  **Evidence, both directions, on one suite:** of the 53 build-verified Invoice cases, the **48 written
  only ever by the API are all plain `markdown`**, and the **5 that had been repaired through the UI
  editor earlier the same day are all `fr-view` — 5 of 5**. So the flag is not random and not per-suite:
  it is a fingerprint of the last write path. **Consequences:** (a) a case authored via the API is
  *born* showing tags if it stores any HTML, so **API-authored cases should store PLAIN TEXT, never
  block HTML**; (b) the render repair and any content edit are **ONE operation** — do them in the same
  UI save rather than writing twice; (c) **`fr-view` is achievable, so "the tester reads tags" is never
  a permanent state.**

  **⇒ ⚠️ CORRECTION TO THE COLLAPSE CENSUS (2026-08-28 → 2026-08-31): IT MEASURED THE WRONG ARTEFACT.**
  The census that concluded **"0 genuinely collapsed cases across the 428"** ran `genuine_collapse()`
  over the **API-stored value**. That answers *"is a newline stranded inside a `<p>`?"* — a real
  question, and the 0 stands **for that question**. It says **nothing** about whether the tester can
  read the case, because **escaping is decided by the container, which the stored value does not
  reveal.** Run on the served page instead, the same corpus's Invoice slice came back **48 of 53
  unreadable**. **⇒ THERE ARE TWO SEPARATE DEFECTS AND EACH NEEDS ITS OWN PROBE: the bare-`\n`-inside-
  `<p>` COLLAPSE (read the stored value) and the ESCAPING CONTAINER (read the served view page). A
  clean bill from one is not a clean bill from the other.** Never report "the suite renders fine"
  from the stored value alone.

  **⇒ THE REPAIR ROUTE, PROVEN (C30197, then the 70-case batch, 2026-08-26).** The UI editor is
  driven with **Playwright**, and Playwright needs the **LOCAL MITM BRIDGE** — chromium **cannot TLS
  through the egress proxy directly** (`net::ERR_CONNECTION_RESET` on every host, `curl` through the
  same proxy is fine). Start a **fresh** `build/atlassian-login/bridge.mjs` per run (the port rotates;
  it writes `/tmp/atlassian/bridge-port.txt`) per `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §1, then
  `chromium.launch({ proxy: { server: 'http://127.0.0.1:<port>' } })`. **Import playwright as
  `/opt/node22/lib/node_modules/playwright/index.js` (or `index.mjs`) — a bare `import 'playwright'`
  fails outside `/opt/node22`.** Never disable TLS verification, never unset `HTTPS_PROXY`.
  Per case: open `index.php?/cases/edit/<id>`, click the `#custom_<field>_display .fr-element` editor,
  `Control+A` + `Delete`, **PASTE** the intended text with `keyboard.insertText` (**paste, never
  re-type** — re-typing introduced curly apostrophes on C30197), click `#accept`, then verify by API
  re-GET **and** by re-reading the view container. Working script:
  `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`.

- **🔧 `delete_case` — AND EVERY WRITE ENDPOINT — MUST BE A POST WITH A BODY; A GET RETURNS HTTP 404
  AND THE CASE SURVIVES (2026-08-26).** A helper that only switches to POST when it has a payload will
  send `delete_case/<id>` as a GET. TestRail answers **404**, which reads like "already gone" — but the
  case is still there. Send `{}` as the body, and **always confirm with a re-GET**: a genuinely deleted
  case returns **HTTP 400 `"Field :case_id is not a valid test case."`**, not 404.

- **🔧 `add_case` REQUIRES `custom_automation_type` AS WELL AS `custom_atmstatus` (2026-08-26).**
  Omitting it returns HTTP 400 `{"error":"Field :custom_automation_type is a required field."}`.
  Both are required on this instance. **`custom_automation_type` must be a REAL type — `1 E2E ·
  2 Functional · 3 Unit`, NEVER `0`/None (QA lead 2026-09-02)**; `custom_atmstatus: 1` = Not Automated
  (**never send `3` on a throwaway** — that is the Automated flag Rule 71 protects). Same requirement on
  any CSV/XML upload file: an Automation Type per case, never blank.

- **🛑🛑 DECLARED HAZARD #6 — `update_case` NOW RENDERS THE MARKDOWN FIELDS TO HTML AND STORES THE HTML
  ON *EVERY* WRITE — A TESTRAIL-SIDE CHANGE ON 2026-08-19, AND IT IS A HARD BLOCK ON ALL TEXT-FIELD
  WRITES WHILE ACTIVE (diagnosed 2026-08-19, Report Suite; evidence
  `build/report-suite/build-verify-2026-08-18/UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`).**
  **This is NOT normalisation #3 and NOT hazard #5.** #3 wraps only the fields you OMIT; #5 fires
  hours later when a run owner works the case in the UI. **This one fires on your OWN write, during
  the write, on fields you SEND, regardless of content.** `custom_expected` / `custom_preconds` /
  `custom_steps` (all `format: markdown`, `get_case_fields` HTTP 200) come back **wrapped in
  `<p>…</p>\n` with `—` escaped to `&mdash;` and `&`/`<`/`>` entity-escaped** — i.e. a full
  markdown→HTML render, stored.
  **PROVEN TESTRAIL-SIDE, NOT A METHOD ERROR (this is the important part — do not "fix your payload"):**
  the **exact Python `tr_client` method that byte-verified CLEAN on 64 Schedule batch-C cases at
  ~08:30 UTC** (all three text fields sent explicitly, `Content-Type: application/json`, JSON body)
  **wrapped when re-run at ~10:45 UTC the same day.** A **115-minute change window** is bracketed by
  the last clean write (C30016, 2026-08-19 08:30:28 UTC) and the first wrapped write (C30133,
  2026-08-19 10:25:27 UTC). TestRail is hosted (`shopview.testrail.io`); we do not control its version.
  **NO WRITE METHOD AVOIDS IT — battery on C30133 (the standing canary):** a trivial single word
  `"plain test line"` → `"<p>plain test line</p>\n"`; a numbered string, hyphens-not-em-dash, and
  all-three-fields payloads **all wrap**; only sending content that is **already the exact HTML**
  round-trips idempotently (`"<p>already wrapped</p>"` → unchanged), which just stores the raw-markup
  defect. So there is **no payload shape that stores the house plain-text form.**
  **IT IS RENDER-ON-WRITE (STORED), NOT RENDER-ON-READ:** cases not written today (C30016/C30096/
  C30124) still read back **clean** via the same `get_case`, so the HTML is in storage, not applied at
  read time — and this project renders the STORED value literally to the manual tester.
  **WHAT TO DO WHILE IT IS ACTIVE:** **HALT all text-field `update_case` writes** (the SBC sweep's halt
  was correct, Rule 50). A refs-only or marker-only re-stamp is **also blocked**, because #3 forces you
  to send all three text fields on every `update_case` and they will wrap. **RE-TEST CHEAPLY before any
  future write batch:** write a throwaway string to **C30133** and re-GET — if it returns with no
  `<p>`, the block has lifted; then repair anything wrapped during the block with
  `build/markup-regression-2026-08-10/demark.py` + a post-batch census (C30133 first). Do not report
  "0 raw markup" as durable while this is active.
  **⏱️ RE-TEST 2026-08-19 11:16 UTC — STILL ACTIVE (block NOT lifted).** The QA lead manually
  Edit→Saved C30133 in the TestRail UI and it stored clean (literal `—`, HTML `<p>`/`<br>`/`&nbsp;`
  that *renders* clean), so the **UI path is clean**. But an **idempotent API `update_case`** of that
  exact content (1 write, HTTP 200) **re-wrapped it**: trailing `\n` appended to all three fields and
  the literal `—` re-escaped to `&mdash;` in `custom_expected` (1074→1087 b); `refs` byte-identical
  (non-markdown). **So it is UI-clean / API-dirty — a TestRail API-side regression, for their
  support.** Fields are still `format: markdown` (no config switch). The literal-em-dash→`&mdash;`
  escape is the decisive discriminator (pure-ASCII HTML round-trips idempotently even during the
  block; a literal `—` is re-escaped only when the render still runs). **All paused text-field writes
  stay HALTED; C30133 is re-wrapped and can only be re-fixed via the UI by the QA lead.** Evidence:
  UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md §8; snapshots `/tmp/c30133-retest/{PRE,POST}.json`.
  **⏱️ RE-DIAGNOSIS 2026-08-19 ~11:35 UTC — STILL ACTIVE; the visible symptom is now RUN-TOGETHER
  numbered lines, and the ONLY API format that renders as separate lines is embedded `<br>`.** The QA
  lead reported C30133 "no longer shows `<p>` but the numbered lines run together (no line break after
  each numbered item)." **Cause:** the block wraps the WHOLE field in a SINGLE `<p>…</p>`, and inside
  that one `<p>` HTML block TestRail's markdown render turns **NO** internal whitespace into a line
  break — not `\n`, not `\r\n`, not a blank line `\n\n` (a full battery on C30133 confirmed each stays
  in one `<p>`, `\n` preserved verbatim, never `<ol>/<li>`; `\n\n` is NOT split into separate `<p>`).
  So single-`\n`-joined numbered items collapse onto one visual line. **This corrects §5's imprecise
  "full markdown→HTML render" wording:** the block never built `<ol>/<li>` — it only escapes
  `&`/`<`/`>`/`—`, preserves recognised inline HTML (`<br>`, `<p>`), single-`<p>`-wraps, appends `\n`.
  **The clean pre-block cases (C30016/C30096/C30124) render as separate lines ONLY because they are
  stored PLAIN with NO `<p>` (markdown builds an `<ol>` from `1.\n2.\n3.`).** "`<p>` no longer shows"
  just means the field IS markdown-rendered (the `<p>` renders as a paragraph, not shown literally).
  **THE CORRECT WRITE FORMAT:** (1) the **clean/correct house form stays `1. line\n2. line\n3. line`
  (plain, single `\n`, NO HTML)** — it renders as separate lines only when stored WITHOUT the `<p>`
  wrap, so **the true fix is TestRail lifting the wrap block; then no writer change is needed.**
  (2) **INTERIM workaround that renders line-broken DESPITE the block: join numbered items with a
  literal `<br>`** (`1. line<br>2. line<br>3. line`) — the block PRESERVES `<br>` (does not escape it)
  and it renders as a break. **Cost: it stores raw HTML `<br>` (+ `&mdash;`; `---` shows literally, no
  `<hr>` inside the wrap) — the very markup the house style avoids and the `demark.py`/census tooling
  strips, and it makes `words()` mis-count list markers. Display workaround, not a clean fix.**
  **RESUME?** clean-form passes: **NO** (still wrap → run-together) — keep HALTED and escalate the API
  regression to TestRail support; `<br>` form: functionally yes but stores raw HTML — adopt only if
  the QA lead accepts it as interim. **C30133 was restored with the `<br>` form (renders line-broken),
  byte-verified round-trip, 0 collateral, refs intact; a UI Edit→Save would make it byte-clean.**
  Evidence: UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md §9; snapshots
  `/tmp/c30133-rediag/{CURRENT-BEFORE,PROBE-RESULTS,PROBE2,RESTORED}.json`.
- **⚠️ DECLARED NORMALISATION #2c — `case_refs` ON A RUN RESULT IS A STORED SNAPSHOT, NOT A LIVE
  MIRROR (found 2026-08-10, Schedule).** Normalisation #2b called `case_refs` a read-time echo. It is
  better described as a **snapshot that catches up when the case is next written**: on 2026-08-10 it
  moved on **208 run-357 result records belonging to cases whose `refs` we never edited**, purely
  because those cases were touched by an unrelated `custom_expected` write. So **do not use "its refs
  did not change" to predict that `case_refs` will not move** — any `update_case` on a case can
  refresh it across that case's whole result history. Treat it exactly as #2b says: a **derived**
  field, never graded, never writable by us, and excluded from the untouched-run comparison alongside
  `case_title`. Verify the run on the graded fields only.
- **🛑 DECLARED HAZARD #5 — TESTRAIL RE-RENDERS A CASE'S TESTER TEXT INTO HTML *HOURS AFTER* YOUR
  WRITE, WITHOUT MOVING `updated_on` OR `updated_by` — SO THE IMMEDIATE RE-GET BYTE-CHECK CANNOT SEE
  IT (proven 2026-08-10, Filters + Schedule).** **This is NOT normalisation #3 and the mitigation for
  #3 does not prevent it.** #3 fires *during* a partial write and wraps the omitted field in `<p>`
  with `\r\n`. **This one fires later, on cases written with all three fields sent**, and produces a
  **full rich-text render**: `<ol>`/`<li>` built out of numbered lines, plus `<p>`, `<br />`,
  `<hr />` for `---`, `<a href>` around bare URLs and `&nbsp;`, with plain `\n`.
  **THE PROOF, and it is the part that matters:** two committed **live** snapshots of the same 110
  Filters cases, 2.5 hours apart with **no write in between** — `cases-POST.json` (commit `3e34d4ea`,
  5 Aug 17:25) and `PRE-cases-110.json` (commit `a4f8b870`, 5 Aug 19:56) — differ on **10 cases, in
  exactly `custom_preconds`, `custom_steps` and `custom_expected` and no other field**, while
  **`updated_on` is byte-identical in both (`1785950271`) and `updated_by` is 3 in both**. Content
  moved; the timestamp did not. **`updated_on` is therefore NOT a reliable change detector for case
  text** — compare content, never timestamps (this is the concrete proof behind that standing
  caution).
  **WHAT TRIGGERS IT:** the run owners working the cases in the TestRail UI, not our writes. Run 357
  has been graded exactly once ever — user 5, 10 Aug 21:17–21:31 UTC, 28 results — and **19 of the 20
  Schedule cases found rendered had been graded inside that 14-minute window**, out of only 26 graded
  in the whole 168-case suite. Two were already rendered earlier that day, so it is the tester
  *working in* the case rather than the act of grading itself.
  **WHY IT DEFEATS OUR VERIFICATION:** at re-GET time the text is still exactly what we sent, so every
  pass since 5 August truthfully reported "0 raw markup" and every one of them was right at the moment
  it looked. Tightening the write path cannot fix this.
  **THE MITIGATION — a DEFERRED census, not a tighter write:** **(1) census raw markup across the whole
  project at the START of every pass**, before any write, and treat a non-zero count as a finding to
  repair rather than a surprise; **(2) never report "0 raw markup" as a durable state** — it is true
  only of the moment it was measured; **(3) expect repaired cases to regress** once a tester next works
  through them, and say so rather than implying the repair is permanent. **It matters because these
  projects render that markup LITERALLY to the manual tester**, who then cannot follow the case.
  Converter + evidence: `build/markup-regression-2026-08-10/` (`TRACE.md`, `demark.py`,
  `exec_repair.py`); 40 cases repaired 2026-08-10, census afterwards **0 of 282**.
- **🔧 REPAIR RECIPE — THE BARE-`\n`-INSIDE-`<p>` COLLAPSE, AND THE TWO WAYS TO FIX IT (proven
  2026-08-21; this is the *repair* half of hazard #5 and of the wrap-block bullet above, both of which
  describe the defect but not how to undo it).**
  **THE DEFECT, in one line:** a text field stored as `<p>…</p>` containing **bare `\n` and NO `<br>`**
  renders to the manual tester as **ONE COLLAPSED RUN-ON PARAGRAPH** — numbered steps arrive as a wall
  of text. Inside a single `<p>` block TestRail turns **no** internal whitespace into a line break, so
  `\n`, `\r\n` and `\n\n` all collapse. **The fix is `<br>` tags.**
  **PATH (a) — API `update_case`.** Rewrite the field with explicit `<br>` where the breaks belong.
  **Change ONLY the line breaks — never a word of the wording** (Rule 57: a reflow is formatting, not
  a re-authoring). Send all three text fields + `refs` on the payload (normalisation #3) and byte-verify.
  **PATH (b) — THE UI "." TRICK**, for a field the API cannot clean while the wrap block is active:
  open `https://shopview.testrail.io/index.php?/cases/edit/<id>` → **append `.` to the Title** → Save
  (this pushes the whole case through TestRail's HTML pipeline, converting `\n` → `<br>`) → reopen →
  **remove the `.`** → Save. Two writes, title back to byte-identical.
  **⚠️ DANGER — THE "." TRICK *COLLAPSES* A FIELD THAT IS ALREADY BARE-`\n`-INSIDE-`<p>`-WITH-NO-`<br>`.**
  On such a field the pipeline preserves the single `<p>` and the `\n`s, so the trick makes the run-on
  paragraph **permanent** instead of fixing it. **Those cases must be API-rewritten (path a) FIRST**,
  then the trick is safe on the rest. **DETECT before choosing a path**, on **MID-TEXT** newlines only:
  `('\n' in text and '<p' in text.lower() and '<br' not in text.lower())`.
  **🔴 CORRECTION 2026-08-25 — THAT DETECTOR IS WRONG AND IT COST A DAMAGED CASE. USE THE REFINED ONE.**
  The expression above flags **any** field that contains a `<p>` anywhere plus a newline anywhere — which
  is the **NORMAL, CORRECT shape the CSV import produces**: a field of block elements
  (`<ol><li>…</ol>` · `<hr />` · `<p>provenance</p>` · `<p>marker</p>`) separated by newlines. Those
  newlines sit **BETWEEN blocks**, where they are insignificant whitespace, and the field renders
  perfectly. The prose above says *"MID-TEXT newlines only"*, but **the code as written does not
  implement that qualifier**, and a session implementing it literally will flag most of a suite.
  **THE REFINED DETECTOR — a newline inside ONE `<p>`'s own inner text:**
  ```python
  P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)
  def genuine_collapse(t):
      return any('\n' in inner.strip() and '<br' not in inner.lower()
                 for inner in P_BLOCK.findall(t or ''))
  ```
  **MEASURED BOTH WAYS over the 428 cases of the six August suites: the old detector claimed 16
  collapsed cases; the refined one finds 0.** All 16 were the normal import shape.
  **THE SCAR:** a batch built on the old detector wrote `<br>` throughout
  **[C44506](https://shopview.testrail.io/index.php?/cases/view/44506)**, whose `custom_expected` was
  correct block HTML. TestRail re-parsed the result and **relocated `</ol>` to the end of the field**, so
  its provenance and marker paragraphs are now nested inside the ordered list. **Two API attempts to
  restore it — the original bytes verbatim, then the blocks made contiguous — were both re-parsed the
  same way** (see DECLARED NORMALISATION #3a-iii). **⇒ VALIDATE A DETECTOR AGAINST A KNOWN-GOOD CASE
  BEFORE BUILDING A BATCH ON IT.** A detector that cannot distinguish the correct shape from the broken
  one manufactures work and then damage.
  **⇒ AND FOR STRUCTURAL DAMAGE OF THIS KIND, PATH (b) IS THE UNTRIED OPTION, NOT "PERMANENT".** The API
  cannot rebuild the block structure; the **UI "." trick pushes the case through a DIFFERENT pipeline** —
  the one that produced the clean structure originally. On a case with no bare-`\n`-inside-`<p>` field the
  danger note above does **not** apply, so the trick is safe to attempt. **Say "not recoverable via the
  API" — never "permanent" — until path (b) has actually been tried.**
  **⚠️ FALSE POSITIVE THAT COST TWO WASTED PASSES (2026-08-21) — A LONE *TRAILING* `\n` AFTER `</p>` ON
  A SINGLE-LINE FIELD IS HARMLESS.** There is no mid-text break to lose, nothing renders wrong, and
  **rewriting it INJECTS A SPURIOUS BLANK LINE** the tester then sees. **Leave it alone.** Strip the
  trailing newline before applying the detector, or it flags every clean single-line field in the suite.
- **🛑 DECLARED HAZARD #4 — EDITING A JIRA DESCRIPTION *DESTROYS* ANY PASTED IMAGE WHOSE MEDIA NODE
  YOU DO NOT CARRY INTO THE NEW BODY, AND THE DELETION IS NOT IN THE CHANGELOG (proven the hard way
  2026-08-06, Report Suite ticket reformat).** This one is in §J rather than the Jira section because
  §J is where the declared write hazards live and this is the same class of silent, unlogged loss as
  #3 — **but it is JIRA, not TestRail.**
  **THE MECHANISM.** A **pasted** screenshot is an **embedded** attachment: the only reason the file
  exists is the `media` node inside the description that points at it. `PUT /rest/api/3/issue/{key}`
  with a new `description` that does not contain that node removes its last reference, **and Jira
  deletes the file.** Proven: **[SV-8818](https://shopview.atlassian.net/browse/SV-8818)** lost
  `image-20260804-061644.png` (attachment `59255`, media `4aec0119-…`) on write **1 of 63**. The file
  is **unrecoverable** — `GET /rest/api/3/attachment/59255` now returns **HTTP 404** *"The attachment
  with id '59255' does not exist"* — and no copy exists anywhere.
  **AND THE CHANGELOG DOES NOT MENTION IT — VERIFIED LIVE, AND THE ASYMMETRY IS THE POINT.** Read
  live 2026-08-06 (`GET /rest/api/3/issue/SV-8818/changelog`, 22 entries): the changelog **DOES** log
  attachment **additions** — five separate `Attachment` items, including `image-20260804-06164…` being
  added at `01:17:54.565-0500` — but the destroying write at `08:25:43.777-0500` logs **exactly one
  item, `description`, and NO attachment item at all.** **Jira records the arrival of a pasted image
  and stays silent about its deletion.** So from Jira's own history nobody can reconstruct that the
  file went. **The loss is provable ONLY because the write was byte-compared against a pre-write
  snapshot (Rule 50)** — the same reason the silent Product Area wipe under Rule 52 was ever
  detectable.
  **THE WORKING METHOD — LIFT THE EXISTING NODES VERBATIM, DO NOT REBUILD THEM.** Before building the
  new body: walk the CURRENT description's ADF, deep-copy every **`mediaSingle` / `mediaGroup`** node
  whole, and place those copies into the new body. Then **assert `media_ids(new) ⊇ media_ids(old)` and
  REFUSE TO WRITE the ticket at all if it does not hold** — a refusal costs nothing, a write costs the
  file. Proven on 8 tickets: SV-8821's two pictures and SV-8844's picture + screen recording came back
  **byte-identical**.
  **REBUILDING A NODE FROM THE MEDIA ID IS SAFE FOR THE FILE BUT LOSES THE DISPLAY ATTRIBUTES.** The
  Report Suite pass rebuilt nodes as `{'mediaSingle', attrs:{layout:'align-start'}}` + `{'media',
  attrs:{type:'file', id, alt, collection:''}}`. The file reference survives — nothing is deleted —
  but `width` / `height` / `localId` on the media node and `width` / `widthType` / `layout` on the
  wrapper are **dropped**, so a picture the author had sized to 921px renders at full size and a
  centred one becomes left-aligned. Cosmetic, but it is a real diff a byte-check will flag: seen on
  SV-8820 (×2), SV-8823 and SV-8879. **Verbatim lifting avoids it entirely.**
  **VERIFY AFTER EVERY WRITE, BY ID.** Re-read the issue and compare the `attachment` array
  **attachment id by attachment id, and each survivor's filename** — never by count, because a count
  match hides a swap. A description-only edit must leave `attachment` byte-identical.
  **A DANGLING ATTACHMENT *CAN* BE MADE INLINE — the media UUID is obtainable (proven 2026-08-06,
  correcting an earlier note that said it was not).** `curl -D - -o /dev/null` on
  `/rest/api/3/attachment/content/{attachment_id}` returns a **303** whose `location` is
  `https://api.media.atlassian.com/file/{UUID}/…`; that UUID is the `attrs.id` an ADF `media` node
  needs. **Keep only the UUID — the signed token on that URL is a secret and is never stored or
  printed.** This is how SV-8818 came to show `parts-velocity-download-menu.png`, an image that had
  been attached and never referenced. No media-API upload is required.
  **REUSABLE TOOLING (read-only auditor + safe writer):**
  `build/ticket-reformat-2026-08-06/attachment-audit/tools/{jira.py,audit.py,media_exact.py}` — audits
  every ticket's attachment set against a pre-write baseline and every media reference attribute by
  attribute; `build/ticket-reformat-2026-08-06/closed-tickets/tools/rewrite.py` — the writer that
  lifts nodes verbatim, refuses on a would-be drop, and byte-verifies. Full evidence:
  `build/ticket-reformat-2026-08-06/attachment-audit/ATTACHMENT-VERIFICATION.md` (92 tickets, 46
  attachments before, 45 now, 1 loss, 0 renamed, 0 broken references).
- **`/api/reporting/reports/{slug}/export` REQUIRES `variant` (proven live 2026-08-05, `sv8582`,
  `v3.5-16cf83f`).** `?format=pdf&range=this_year` alone returns **HTTP 400** `{"errors":[{"error":"Invalid
  export variant. Allowed values: summary, expanded."}]}`. The working shape is
  `?format=csv|pdf&range=<preset>&variant=summary|expanded[&locations=<id>[,<id>]]`. Accepted `range`
  values on that build: `this_year` `last_year` `this_quarter` `last_quarter` `this_month` `last_month`
  `this_week` `last_week` `today` `yesterday` (all 200); `custom` needs `start_date`+`end_date`;
  **`last_12_months` returns 400 "Selected date range is invalid."** `locations` is a **comma-separated**
  list (not `locations[]`), and an unknown id gives 400 `Invalid location id "…"`. Report slugs:
  `sales-by-customer` `sales-by-representative` `parts-velocity` `technician-utilization`
  `work-in-progress` `inventory-value`. Filenames come back on `content-disposition`, and each CSV opens
  with a UTF-8 BOM then `"Date Range: …"` and `"Locations: …"` metadata lines above the header row.
- **🛑🛑 THE C30341 LESSON — BYTE-VERIFICATION PROVES YOU WROTE WHAT YOU INTENDED, NOT THAT YOUR
  INTENT WAS **CORRECT** (found the hard way 2026-08-06, Report Suite). READ THIS BEFORE TRUSTING A
  CLEAN BYTE-CHECK.** **C30341** stores its text as **raw HTML** (`<ol>/<li>`, `<hr />`,
  `<p>AUTOMATION: READY</p>`). None of the writer's plain-text patterns matched that form, so instead of
  **REPLACING** the Rule-54 provenance line and the automation marker it **APPENDED A SECOND ONE OF
  EACH** — and **the Rule-50 byte-check PASSED, because the write was faithful to the payload; the
  PAYLOAD ITSELF WAS WRONG.** **TWO MITIGATIONS, both now standing practice:** **(a) make the writer
  REFUSE OUTRIGHT on any case whose stored text contains raw markup** rather than pattern-matching
  through it (the `rebuild()` guard added that day); **(b) RUN A CENSUS AFTER EVERY BATCH** confirming
  **exactly one provenance line and exactly one marker per touched case** — that census is what found
  this, not chance. The repair converted the case to plain numbered text with **not one word of meaning
  changed**. **Generalise it: a byte-check is a check on FIDELITY, never on CORRECTNESS — pair it with a
  post-batch invariant census, always.**
- **🛑 `updated_on` IS NOT PROOF A CASE IS UNTOUCHED — PROVE IT BY BYTE-COMPARING CONTENT (found
  2026-08-05, Report Suite; corrects a belief Standing Rule 50 leaned on).** **Fourteen** of our cases —
  **C30341 · C30392 · C30451 · C30456 · C30457 · C30460 · C30487 · C30490 · C30491 · C30493 · C30519 ·
  C30522 · C30526 · C30528** — had **all three text fields change from plain numbered text into raw
  `<ol>`/`<li>` HTML while `updated_on` and `updated_by` STAYED FROZEN** at values from *before* that
  pass began. Confirmed with a direct `get_case/30341`, which returned the markup while still reporting
  `updated_on=1785951654`. Nobody in that pass wrote to any of them. **CONSEQUENCE: every
  "we did not touch it" proof — including the Rule-38 proof that a foreign case is untouched — must be a
  BYTE COMPARISON OF THE FIELD CONTENT against a pre-write snapshot committed before the first write.
  A timestamp is context, never evidence.**
- **🛑 AND THE MIRROR IMAGE IS ALSO TRUE — A *FRESH* `updated_on` IS NOT PROOF A WRITE *LANDED*
  (found 2026-08-11, Filters; the companion to the bullet above, and the more dangerous of the two).**
  The bullet above is about a **frozen** timestamp hiding a change that happened. **This is the
  opposite: a MOVED timestamp advertising a change that did NOT happen.** Three Filters cases —
  **C29601 · C38882 · C43562** — carried **the current day's `updated_on`** while the write intended
  for them had **never landed**: the timestamps came from a *different* pass (the read-date sweep) that
  had legitimately touched the same cases hours earlier. A worker checking "did my write go through?"
  by timestamp would have read **today's date on all three and concluded success**. **WHY THIS ONE IS
  WORSE: the frozen-timestamp failure makes you re-check something that was fine; the fresh-timestamp
  failure makes you STOP checking something that is broken** — and on a shared suite, where several
  passes touch the same cases in a day, a fresh timestamp is the *expected* state and proves nothing at
  all. **THE RULE IS THE SAME IN BOTH DIRECTIONS AND HAS NO EXCEPTIONS: VERIFY BY CONTENT.** Compare
  the live field text against the **intended payload**, never against a clock. *(Recorded in
  `build/RECOVERY-2026-08-11/STATE.md` §B pass 2.)*
- **⚠️ THE WORK IN PROGRESS EXPORT TAKES DIFFERENT DATE PARAMETERS FROM THE OTHER FIVE REPORTS
  (proven live 2026-08-06, `v3.5-16cf83f`) — and getting it wrong makes a REAL HTTP 500 look like your
  own input error, which is exactly what blocked the finding for two passes.** The other five use
  `range=<preset>` (or `range=custom&start_date=&end_date=`); **Work In Progress uses `from=` and `to=`
  with FULL ISO INSTANTS**:
  `GET /api/reporting/reports/work-in-progress/export?format=csv|pdf&tab=<Tab>&from=2026-08-02T00:00:00.000Z&to=2026-08-06T23:59:59.999Z&locations=<ids>&columns=<list>&sortBy=days_open&descending=true`.
  **TAKE THE SHAPE FROM THE PRODUCT'S OWN DOWNLOAD MENU, NEVER GUESS IT** — attach a request listener
  and click the menu item; that is how this was recovered. **The rule generalises: when an export or
  read endpoint rejects every datetime form you try, assume YOUR shape is wrong and go read the request
  the product itself sends.** (Once the shape was right the real defect appeared: HTTP 500 on every
  non-empty tab in both formats, HTTP 200 with a real file when the window is empty — presence of rows,
  not size.)
- **Known runs — do NOT write without permission:** Custom Roles run **312**, section **3527**;
  Simple Flow / F&D / Schedule / Report Suite run **325** (and R359 Reports). Section IDs per project
  in CLAUDE.md.
- **THE `refs` FIELD HAS A PER-ENTRY LIMIT OF 248 CHARS AND IS COMMA-DELIMITED (probed live
  2026-08-03, Report Suite verifier-fix pass).** TestRail treats `refs` as a COMMA-separated list of
  references: it **splits on `,`, TRIMS each entry, and re-joins with a bare `,`** (sent
  `"AAA, BBB,   CCC ,DDD"` → stored `"AAA,BBB,CCC,DDD"`). Any **single entry longer than 248
  characters rejects the WHOLE `update_case`** with **HTTP 400 `Field :refs does not match the
  required pattern.`** — 248 passes, 249 fails, and it is a *pattern* error not a length error, so
  it is easy to misdiagnose. **Total** length is unbounded (674 chars across 40 short entries → 200).
  **Consequences:** (a) **write Rule-20 `refs` COMMA-FREE and ≤ 248 chars, using semicolons as
  separators** — this is already the house style: all 475 Report Suite `refs` are comma-free single
  entries, longest 245, and one earlier author wrote `"the 10; 000-row cap"` to dodge the comma in
  10,000; (b) never put a comma inside a quoted list in `refs` (`"Today, Yesterday, …"` silently
  becomes many references) — describe the list instead; (c) **when verifying a `refs` write, compare
  under the normalisation** `','.join(p.strip() for p in s.split(','))`, or a byte compare will
  report a false mismatch. Probe + validator: `build/report-suite/verifier-fixes-2026-08-03/tools/`
  (`refs_final.json` asserts comma-free + ≤ 248 before every run).
  **⚠️ THIS IS THE ONE DECLARED NORMALISATION PERMITTED BY STANDING RULE 50** ("verify exhaustively —
  byte-level means nothing is skipped, sampled, or assumed": **every case, every field, no sampling**,
  and then **exact** byte comparison). It may be applied **only because it is recorded HERE with
  its evidence**, and it must be **asserted explicitly as the expected transformation** in the audit
  log — never treated as "close enough". Every OTHER field is compared **raw byte-for-byte**, and any
  **NEWLY discovered normalisation must be added to this section, with its evidence, BEFORE it may be
  relied on** to explain away a mismatch. Until it is recorded here, **a mismatch means the write
  FAILED** — stop the batch and report both byte sequences (Rule 50).
- **TestRail swallows angle-bracket `<placeholders>` as HTML — never use `<` `>` in case text; write
  plain words instead** (e.g. "Expand, then the technician's name" — not an angle-bracket
  placeholder). Confirmed live 2026-07-29: TU-DAY-01/C30418's expected result imported 2026-07-22 as
  "Expand 's daily breakdown" — the placeholder was eaten as an HTML tag. Sweep any import/push
  payload for `<` before sending.
- **WHO CREATED / LAST UPDATED A CASE (how to spot FOREIGN cases — not ours)** *(proven 2026-07-31;
  this is how Vladimir Tomovic's 5 Report Suite cases C38919–C38923 were identified)*
  - **In the UI:** case page → **bottom-left "People & Dates" panel** → **Created** (name + date) and
    **Updated** (name + date).
  - **Via the API:** `get_case/{id}` returns **`created_by` / `updated_by` as USER IDS** (+
    `created_on` / `updated_on` epoch). `get_cases` returns them in bulk too, so one paged pull covers
    a whole suite. Resolve ids with **`get_user/{id}`** — **`get_users` is ADMIN-ONLY** for our Lead
    account (`Access Denied. You are not a TestRail administrator. Field:project_id is a required
    field.`, and adding `&project_id=1` does NOT fix it). Our own id: `get_user_by_email&email=…`.
  - **User map (project 1):** 1 Vladimir Tomovic · 2 Nebojsa Glavinic · **3 Bilal Muzamil = US (the
    account we push with)** · 4 Viktoria Videnovic · 5 Ayesha Khan · 6 Mudassir Qamar · 7 Ahtasham
    Amjad · 8 Chris Amani · 9 Sasha Grossman. Ids 10+ do not exist.
  - **Practical tells beyond `created_by`** (measured over 474 of our Report Suite cases vs his 5):
    **`refs` empty** (ours: 474/474 populated — Rule 20 means we never ship a case without one) ·
    **`template_id` 2 = Steps** (ours: 1 = Text, 474/474) · **`custom_automation_type` unset/`0`** (ours:
    now always a real type 1/2/3 per the 2026-09-02 rule; historically `0`) · **`type_id` 7 "Other"** (ours: 6/5/1/2) · **titles over 80 chars** (ours: 0/474 —
    the ≤80 title rule) · **no expected results at all** (automated cases keep the assertion in code).
    **⚠️ `custom_atmstatus` is NOT a usable tell** — it is 3 ("Automated") on his cases AND on 16 of
    ours. Field decode from `get_case_fields`: atmstatus `1 Not Automated · 2 Cannot be automated ·
    3 Automated · 4 Pending`; **automation_type `0 None · 1 E2E · 2 Functional · 3 Unit`** (verified live
    from `get_case_fields` 2026-09-02 — an earlier note saying "1 Ranorex" was wrong).
  - **The reusable READ-ONLY checker:** `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`
    — pulls every live case under a group, splits ours vs foreign by `created_by`, and ranks the
    best-matching OF-OURS cases per foreign case on **normalised assertion text** (title + preconds +
    steps + expected, not the title alone), printing the tells + a verdict-ready table.
    `source /tmp/tr-creds.env && python3 foreign_overlap_check.py --group 4281` (Report Suite; Filters
    **4110**, Schedule **4254**; `--top N --min-score X --csv out.csv --refresh`). Similarity only
    **suggests candidates — a human confirms** DUPLICATE / AUTOMATED EQUIVALENT / NEW COVERAGE (the
    true duplicate found on 2026-07-31 scored just 0.264, because his cases carry no expected results
    to match on; trust the RANK, not the value, and read the top handful).
  - **STANDING EXPECTATION — re-check after every authorized push.** As the last step of any push
    manifest/execution log (right next to the Rule-34 run-sync), re-run the checker on the group to
    (1) catch **new foreign cases** and (2) catch **new overlaps** between someone else's cases and
    ours, so drift is found the same day instead of at audit time. Always report **"ours N / live
    total M"**. **Never edit/delete/move a foreign case or add one to a run** — identify it, exclude
    it from our counts, raise it with the author (see CLAUDE.md standing convention).
  - **⚠️ THE OVERLAP CHECKER ONLY FINDS HALF THE PROBLEM — ALWAYS RUN THE REVERSE ONE TOO
    (Standing Rule 45a).** `foreign_overlap_check.py` answers *"do THEIR cases duplicate OURS?"*.
    It **cannot** find the shape that actually cost us on 2026-07-31: an assertion of theirs with
    **NO counterpart in ours**. **Their case existing where ours does not is a COVERAGE SIGNAL, not
    a nuisance.** The reverse checker is
    **`build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`** (READ-ONLY, `get_*` only, no POST
    code path):
    ```
    source /tmp/tr-creds.env
    python3 build/gap-rootcause-2026-07-31/reverse_coverage_diff.py \
      --group 4281 --group 4110 --group 4254 --scope-to-section \
      --md OUT.md --csv OUT.csv --json OUT.json
    ```
    Flags: `--scope-to-section` (compare only against OUR cases in the same report/area folder —
    **use it**, it cuts most cross-report noise) · `--sig-size N` (signature tokens, default 3) ·
    `--ours-uid 3` · `--cache-dir /tmp/trrcd` · `--refresh`. Groups: Report Suite **4281**, Filters
    **4110**, Schedule **4254**.
    **How to read the output — the useful block first.** It splits each foreign case into
    **assertion units** (a single foreign case routinely mixes one assertion we cover with one we do
    not) and labels each **COVERED-BY / CANDIDATE GAP / CONTRADICTS-OURS**, naming the **missing
    token**. Two things make it readable rather than noisy:
    - **`STRENGTH`** — **STRONG** = the missing word IS in our own vocabulary, it just never
      co-occurs with the rest (a meaningful absence); **PHRASING** = a word we never use anywhere
      (*"refetch"*, *"widened"*) = their wording, not our gap. **Only STRONG units set the
      case-level verdict.**
    - **`CLOSED-LIST COLLISIONS`** — **read this block first.** It finds OUR cases that enumerate a
      closed list (*"exactly"*, *"in order"*, *"only these"* — the Rule 42 time-bomb shape) on the
      same subject as a foreign case, and names the term their case asserts that our closed list
      never mentions. **This is the detector for the actual 2026-07-31 defect:** for **C38923** it
      narrowed **474 of our cases to 8** with the two real defects — **SBR-EXP-10 = C30285** and
      **SBR-EXP-11 = C30286** — ranked **3rd and 4th**.
    **Honest limits (say them when quoting it):** lexical, not semantic — a gap phrased in words we
    use elsewhere can read as COVERED-BY, and a synonym can read as a gap; the per-unit verdicts on
    step-only automated cases carry real false-alarm noise from setup prose (**that is why the
    collision block and the STRONG filter exist**); it compares written text on both sides and
    **proves nothing about the running build** (Rule 12). It **suggests — a human rules.** A
    CANDIDATE GAP goes to the QA lead; **never author or push from it unasked** (Rule 6), and
    **never touch the foreign case** (Rule 38).
    **Live baseline 2026-07-30T20:20Z** (read-only, zero writes): Report Suite **4281** = live 479 =
    ours 474 + **foreign 5, all Vladimir Tomovic (user id 1; we are id 3)**; Filters **4110** = 110 =
    ours 110 + **0 foreign**; Schedule **4254** = 165 = ours 165 + **0 foreign**. Output kept at
    `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md`.
- **🔴 `get_history_for_case` IS THE AUTHORITATIVE RECORD OF A FOREIGN EDIT — CHECK IT FIRST (proven
    live 2026-08-28; CORRECTS A STANDING BELIEF).** `GET index.php?/api/v2/get_history_for_case/<case_id>`
    returns **one entry per save**, each with `id`, `created_on` (unix), `user_id`, `type_id`, and a
    **`changes[]` array carrying `field`, `old_value` AND `new_value`** — **full text bodies, not
    truncations**: `title`, `refs`, `custom_preconds`, `custom_steps`, `custom_expected`,
    `custom_atmstatus`. **It survives our own later overwrites**, so a foreign edit is reconstructable
    field by field long after the fact. **Nothing may be reported as "we cannot establish what was
    changed" until this call has been made and its output recorded** (Rule 12). Committed body
    snapshots (Rule 87) remain useful as a **fast offline diff** and for the things history cannot do —
    a **deleted** case has no history, history is **one call per case** so it does not scale to a
    714-case group, and it cannot show that a case **appeared or vanished** — but **history is primary**.
    **SUPERSEDED, kept visible per Rules 32/33:** the pre-2026-08-28 playbook/rule position that
    *"TestRail stores only the LAST writer; there is no per-field history"* is **FALSE** — it was true
    of `updated_by` / `updated_on` only, then wrongly generalised.
    **Evidence:** **C29557** returned **17 entries** and recovered the 2026-08-05 Ahtasham Amjad
    (user id 7) edit in full — three fields, a rich-text save that `<p>`-wrapped them and truncated
    Expected Result 687 → 423 chars (`build/custom-roles/foreign-edit-C29557/HISTORY.json`). **C27792
    and C27805** returned **exactly one entry each — `custom_atmstatus` `1 → 4 Pending`, no text change**
    — disproving the claim that an undiffable body edit had happened to them.
    **`custom_atmstatus` values: `1` Not Automated · `3` Automated · `4` Pending. `4` IS NOT `3`** — a
    `1 → 4` move does **not** make a case Automated and does **not** trigger Rules 65 / 71, but it means
    someone has queued it for automation, so **preserve the value and never send that field**.
- **🔧 ON THE CASE EDIT PAGE, REFERENCES IS `div#refs` — `#requirements_display` IS A DIFFERENT FIELD
    (DOM-probed 2026-08-28).** The **References** field is the **contenteditable `div#refs`**, backed by
    the hidden input **`#refs_hidden[name=refs]`** — that hidden input is what actually submits, so a UI
    edit must land in both. **`#requirements_display` is NOT references**: it is the unrelated **"AI
    context"** field, and driving it silently edits the wrong thing while appearing to work. Found while
    repairing C30518; source note `build/report-suite/damage-2026-08-26/C30518-REPAIR-2026-08-28.md` §6.

## K. PRODUCTION access & fix-verification (SV-8721, proven 2026-07-29)
One indexed block for verifying a bug fix on PRODUCTION (`app.shopview.com` / `api.shopview.com`).
Terse entries; where the full detail already lives elsewhere in this playbook, this points there
(consolidated, not duplicated). All proven live 2026-07-27→29 on the SV-8721 5-decimal side project.
- **PROD login & session:** `POST /api/login {username, password}` → 200 + fresh `PHPSESSID`
  (PHPSESSID-only — NO SSO cookie on prod; quick-login 500s). **GOTCHA: a fresh login EXPIRES the
  same user's prior PHPSESSID** (old session → 409 "Session has expired") — log in ONCE per run,
  reuse for API + browser + cleanup. `cf_clearance` NOT needed via the agent proxy. Full entry: §A
  "PRODUCTION access". *(proven 2026-07-29)*
- **PROD browser automation:** boot2-style Chromium hydration works on prod — `PHPSESSID` cookie on
  `.shopview.com` + localStorage `user` = `{data:<login-response data>}` + `fe_permissions_wrapper`;
  Playwright pointed straight at `$HTTPS_PROXY`, **no MITM bridge needed**. Full entry: §A.
  *(proven 2026-07-29)*
- **PROD test org / workplace:** org `72b2cc90-6964-4429-a207-76e55f946936`; seed WOs in
  **"Trucks Hill 2" `b617914c-16e9-4485-8e8b-193cd86aa416`** (HAS canned lines; "QA Testing"
  `8badadec-…` has none). Full entry: §A. *(proven 2026-07-29)*
- **PROD API difference — WO line create:** `POST /api/work-orders/lines/create` → 400 "Labor or
  fixed prices must be set" even with a canned line → use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201**. Full entry: §D. *(proven 2026-07-29)*
- **Node fetch proxy fix (this sandbox):** plain node `fetch` BYPASSES the egress proxy (403 "Host
  not in allowlist" while `curl` works) → run node with **`NODE_USE_ENV_PROXY=1`** (Node 22.22+,
  undici EnvHttpProxyAgent); confirm reachability with `curl` via `$HTTPS_PROXY` first. Full entry:
  §A. *(proven 2026-07-29)*
- **5-DECIMAL FIX-VERIFICATION RECIPE (works on staging AND prod, end-to-end):**
  (1) seed a throwaway WO (`work-orders/create`, §C; on prod use Trucks Hill 2) + a line
  (`create-from-canned-line`, §D);
  (2) add parts via `part/make-request` (§E) with **precision-stressing costs** — the customer trio
  `0.240 / 0.027 / 0.089` + a 4-decimal `45.6789` + a 5-decimal `124.96545`;
  (3) order them (`perform-request-status-action {action:'order'}`);
  (4) open the Receive screen `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId}` (§E);
  (5) check on-screen 5dp costs + line totals + Subtotal, AND the order-detail
  `GET /api/inventory/orders/{id}` **`price_decimal` / `total_cost_decimal` / `total_price_decimal`**
  fields vs the legacy rounded `price`/`total_price` (§E);
  (6) **Tax on the Receive screen = a manual dollar field** (defaults from the workplace tax rate —
  $0.00 on a 0%-rate org); typing a value live-recalculates Total = Subtotal + Tax (verified
  15.32 + 0.77 → 16.09);
  (7) clean up: `work-orders/delete` (§C — deleting the WO also removes its un-received PO).
  *(proven on staging 2026-07-27 + prod 2026-07-29, SV-8721)*
- **Jira evidence method (inline screenshots + editable comment):** attach PNGs to the issue first —
  `POST /rest/api/3/issue/{KEY}/attachments` with header `X-Atlassian-Token: no-check` (multipart
  `file=@…`) → then reference each as `!filename.png!` (optionally `|width=853`) in a **v2
  wiki-markup comment** (`POST /rest/api/2/issue/{KEY}/comment {"body":"<wiki markup>"}`) → renders
  inline. **Comments are editable in place:** `PUT /rest/api/2/issue/{KEY}/comment/{id}` with the
  full new body → 200; always re-GET to verify the text + `!refs!`. **Before/after evidence:** pull
  the ticket's ORIGINAL attachments for the "before" side instead of re-reproducing the bug.
  *(proven 2026-07-29, SV-8721 comment 74275)*
- **TestRail import gotcha (angle brackets):** `<placeholders>` get swallowed as HTML — full entry:
  §J. *(proven 2026-07-29)*
- **⚠️ TestRail `refs` (References) field — TWO hard gotchas, both cost a failed push:**
  **(1) MAX LENGTH 250 CHARACTERS.** Over it, `add_case`/`update_case` returns **HTTP 400
  `{"error":"Field :refs does not match the required pattern."}`** — a misleading message that
  looks like a charset problem but is purely length. Keep refs **≤240 chars** for margin; when a
  Rule-20 ref won't fit, trim it and move the overflow detail into the case's internal `notes`
  (never drop the ticket half or the spec anchor). **(2) TestRail NORMALIZES `refs` as a
  comma-separated reference list and STRIPS THE SPACE AFTER EVERY COMMA** — so a re-GET
  verification of a refs string containing `", "` will FALSELY MISMATCH (content identical,
  spacing only). **Write refs COMMA-FREE**: use `;` and ` + ` as separators. Check both before a
  batch push — `assert len(refs) <= 240 and "," not in refs` — rather than discovering them
  mid-run. Also: **`update_case` does NOT move a case between sections** — use
  `POST move_cases_to_section/{section_id}` with `{"suite_id":1,"case_ids":[...]}` and verify with
  a re-GET of `section_id`. And **`tr.paged` helpers must join the 2nd query param with `&`, not
  `?`** (`get_tests/352?` → HTTP 400 *"Invalid characters in URI"*).
  *(both refs gotchas proven on the Filters push 2026-07-31: the comma one on the morning pass,
  the 250-char one mid-run on FLT-PARTS-13 at 298 chars)*
  **SHARPENED (Report Suite push 2026-07-30): the boundary is EXCLUSIVE — a refs string of
  EXACTLY 250 chars is REJECTED (SBR-NAV-01 / C30195, HTTP 400), while 243 chars pushes fine
  (IV-EXP-02 / C30588). So the real ceiling is ≤249; the "≤240 for margin" rule above is the one
  to assert on, and asserting `<= 250` is NOT safe.**

## L. Git practice with parallel workers
- **⚠️ Parallel workers SHARE ONE git index** — a bare `git commit` after `git add <own paths>` also
  commits whatever a sibling worker staged in between, sweeping their half-written files into the
  wrong commit. **Happened TWICE on 2026-07-30/31** (content survived both times, but history got
  muddied).
- **THE FIX (proven working): always commit PATH-SCOPED** — `git commit -- <explicit paths>` (or
  `git commit <paths>`), which commits only those paths regardless of what else is staged. **Never a
  bare `git commit` after staging, and never `git add -A` / `git add .`,** whenever other workers may
  be active. **Syntax gotcha:** `git commit -m "<msg>" -- <paths>` errors ("did not match any
  file(s)") — write the message to a temp file and use **`git commit -F /tmp/msg.txt -- <paths>`**
  (multi-line messages work cleanly this way too). *(proven 2026-07-31)*
- **🛑 STAGE AND COMMIT IN ONE BREATH — NEVER LEAVE FILES SITTING STAGED. This is the half we had
  BACKWARDS (proven 2026-08-06).** **Path-scoping protects what YOU commit from sweeping in someone
  else's files. It does NOT protect YOUR staged files from being swept by someone else's un-scoped
  commit.** Anything left in the index is exposed to the other worker for as long as it sits there.
  **What happened:** a worker ran `git add` correctly path-scoped to `build/schedule/`, but then
  committed with a **bare `git commit -q -F /tmp/cm4.txt`** — which takes **the whole index** — and swept
  in **nine files staged by the live Report Suite worker**. The sibling's own path-scoped commit then
  correctly answered *"nothing to commit, working tree clean"*, because its work was already in someone
  else's commit. **Nothing was lost** (all nine byte-identical, md5-compared file by file, already
  pushed) — **the damage is to the record**: the commit message talks only about Schedule and
  **misattributes** the nine. **It was deliberately NOT fixed** — no amend, no rebase, no force push:
  *"a misleading commit message is a documentation problem; a rewritten shared history is a data-loss
  problem."* Both halves are recorded in `build/schedule/full-viu-2026-08-05/COMMIT-SCOPING-LESSON-2026-08-06.md`
  and `build/report-suite/full-viu-2026-08-06/COMMIT-COLLISION-2026-08-06.md`.
  **THE PRACTICE:** `git status` **immediately before** committing; if paths you do not own are staged,
  name only yours in **BOTH** the add and the commit; then **`git add -- <paths>` and
  `git commit -F /tmp/msg.txt -- <the same paths>` back to back, with nothing in between.**
- **🛑 `git push <branch>` RESOLVES THE REF AT PUSH TIME, so a concurrent commit can be published
  UNSCANNED.** Between the moment you review/scan a diff and the moment the push runs, a sibling worker
  can add a commit to the same branch — and pushing the **branch name** publishes whatever the tip is
  then, including work you never looked at. **PUSH THE EXPLICIT REVIEWED SHA:**
  `git push origin <sha>:refs/heads/<branch>`. Report the pushed SHA and confirm it equals the SHA you
  scanned. *(2026-08-06)*
- **⚠️ A REMOTE-TRACKING REF READ WITHOUT A PRIOR `git fetch` IS STALE — and it produced a false
  work-loss scare.** `origin/<branch>` is only as fresh as your last fetch, so `git rev-parse
  origin/<branch>` can report *"local == origin, all pushed"* while local is in fact **49 commits
  behind**. **Always `git fetch origin <branch>` FIRST**, then compare — and never conclude anything
  about what is or is not on the remote from an unfetched ref. *(2026-08-06)*
- **🛑 THE SAME STALENESS BITES IN THE OTHER DIRECTION, AND IT IS FAR MORE DANGEROUS: THE LOCAL
  CHECKOUT CAN BE WILDLY BEHIND WHILE `git status` REPORTS THE BRANCH *AHEAD* AND THE TREE CLEAN
  (proven 2026-08-11 — 110 commits behind).** The bullet above is about mis-reading what is on the
  remote. **This is about working from a tree that is out of date and not being told.** A recovery pass
  found `git status` clean and `git rev-list` reporting the branch **1 commit AHEAD**; after
  `git fetch` the true position was **110 BEHIND, 0 ahead**. **WHAT IT COST:** that pass concluded six
  other passes' folders **did not exist**, that **nothing had been committed**, and that **all their
  work was lost with the container** — **every one of those conclusions was false.** The folders, the
  execution logs and the per-op records were all on the remote, invisible to a stale checkout.
  **WHY IT MATTERS MORE THAN A WRONG STATUS REPORT: another session pushes to this same branch from a
  different container, so a worker reading a stale tree WHILE WRITING TO LIVE TESTRAIL can re-do work
  already done, "restore" text another pass deliberately changed, or regenerate deliverables from a
  source 110 commits out of date** — each of which is a confident, well-evidenced, wrong answer.
  **THE RULE: `git fetch origin <branch>` then `git merge --ff-only` as the FIRST ACTION of every pass,
  before reading anything.** **A clean working tree proves nothing about currency**, and neither does
  an ahead/behind count taken without a fetch. **If the fast-forward is refused, STOP and report** —
  never force, never rebase, never `reset --hard`, because a sibling's unpushed-to-you commits are the
  very thing at risk. *(2026-08-11; the mechanism behind the stale ref is still unexplained and may
  recur in any container — see `build/RECOVERY-2026-08-11/STATE.md`.)*

## M. Figma: extract ALL frames from a design link (proven 2026-07-31, Filters)
**Use when** the user hands over one or more `figma.com/design/<fileKey>/...?node-id=A-B` links and
wants every frame/board captured. **Do NOT WebFetch the figma.com URL** (returns the app shell only)
and do not assume the Figma MCP is connected — it usually is not.

- **Creds:** a Figma **personal access token** goes at **`/tmp/figma-token`** (`chmod 600`; secret →
  `/tmp` only, NEVER committed; scripts must read the file, never inline the value). Verify with
  `GET https://api.figma.com/v1/files/<fileKey>?depth=1` → HTTP 200 + the file name. **`/tmp` is
  ephemeral — on a fresh container ASK THE USER for a token** (Figma → Settings → Security →
  Personal access tokens → scope *"File content read-only"*).
- **⭐ WHICH ACCESS ROUTE, and in what order (learned the hard way 2026-07-30/31, Filters — this
  ordering saves a day):** **ASK FOR A REST TOKEN FIRST when there is a BACKLOG of frames.** The
  **Figma MCP** `get_screenshot` needs no token and is cheap per call, but it has a **low per-seat
  tool-call cap** (*"You've reached the Figma MCP tool call limit for your View seat"* — no
  `retry-after`, so Rule 35's +9 h applies): it managed **6 boards then stopped**. **REST
  `/v1/images` with a token has no such cap** — it rendered the **remaining 6 in ONE call with no
  429** and finished an 85-board set that had been stuck for two days. So: **MCP is fine for one or
  two boards; a token is the only sane route for a backlog.** The two budgets are independent, so a
  capped MCP does not mean REST is capped, and vice versa.
- **⚠️ A LAYER TREE CANNOT ANSWER "IS THIS CONTROL PRESENT?" — ONLY A RENDER CAN.** This cost us two
  wrong "control X is absent" claims that we wrote into our own design notes as *corrections*: a
  toolbar sort icon and a `Status ↓` column indicator were both declared absent from a tree read and
  are plainly there in the PNG. **The reason:** an icon lives inside a component `INSTANCE` under a
  layer name containing no keyword you would search for. **Rule:** use the tree for *text* and
  *structure*; for any presence/absence question, render the board, crop the region and read it at
  2–3×. And when a render lands, **re-check every absence claim you made from the tree** — record the
  verdicts in a table (correct / wrong / indeterminate), and say plainly which ones the render could
  not settle (e.g. a heading row hidden behind an open panel).
- **Node-id format gotcha:** the URL uses a **dash** (`11817-27678`); the **API uses a colon**
  (`11817:27678`). Convert both ways.
- **Step 1 — enumerate the whole tree (Rule 17 completeness):**
  `GET /v1/files/<fileKey>/nodes?ids=<id1>,<id2>,...` (all ids in ONE call), then walk it:
  descend through `CANVAS` and `SECTION`, and **collect at the first `FRAME` / `COMPONENT_SET`**
  (do not recurse into a frame or you collect its inner layers as separate boards).
  **Dedupe by node id** — a link often points at a whole CANVAS that *contains* the other links, so
  the union is far smaller than the sum. *(Filters: 4 links → 118 hits → **85 unique boards**.)*
  State the exact total found before rendering.
- **Step 2 — read the exact on-screen labels WITHOUT any image:** walk the same tree collecting
  `TEXT.characters` per board, **skipping `visible:false`** layers. This is the Rule-9 wording source
  and it survives a rate limit. Also read `componentProperties`/`variantProperties` on `INSTANCE`
  nodes — that is how you prove a state (e.g. a chip rendered with variant `Disabled` vs `Selected`),
  and `COMPONENT_SET` children names give the full variant list (`Default/Hover/Selected/Disabled`).
  Layer NAMES also identify unlabelled icons (`Filter-lines`, `Columns`, `Switch-vertical` = sort).
  **⚠️ Never report a `visible:false` layer as design content** — Figma components are full of hidden
  placeholder text ("By ownership", "Administrator", "Placeholder").
- **Step 3 — render:** `GET /v1/images/<fileKey>?ids=<comma ids>&format=png&scale=2` returns
  `{images:{id:url}}` (signed S3 URLs), then `curl -L -o <file> <url>`.
- **⚠️ THE BIG GOTCHA — the images endpoint has a hard, long-window cap.** After ~24 renders it
  returns `HTTP 429 {"err":"Rate limit exceeded"}` with **`retry-after: ~37874` (≈10.5 HOURS)**.
  `scale=1` is capped identically (cost is not per-pixel), and no amount of backoff helps inside a
  session. The **`/nodes` endpoint is a separate budget and keeps working** — which is why Step 2
  matters. Practical rules: **render in small batches with a pause, most-important boards FIRST**,
  make the fetcher **resumable** (skip any file already on disk, cache the signed URLs to json), and
  when capped, fall back to (a) PNGs already exported for the same node ids in an earlier pass, and
  (b) the Step-2 text/variant extraction — then state the honest split in the deliverable.
- **⚠️ AND YOU MUST STILL GO BACK FOR THE MISSING FRAMES — Standing Rule 35 (mandatory, no
  authorization needed).** A rate limit is a DELAY, never an end state: "all the frames needed"
  means **100%**. When capped, create/update a **`PENDING-FIGMA-FETCH.md` queue file in that
  project's design folder** holding: an **OPEN** status header with the check-and-run instruction ·
  the file key · the exact **missing node ids + target filenames** · the **UTC error timestamp** ·
  **DUE-AT = error time + 9 HOURS** · the fresh `retry-after` for reference · the **exact resumable
  command** · and a **RETRY LOG** table (attempt #, timestamp, outcome, frames obtained, still
  missing, `retry-after`, next DUE-AT) wrapped in `<!-- RETRY-LOG-START -->` /
  `<!-- RETRY-LOG-END -->` markers so the fetcher appends its own rows and re-arms DUE-AT. Then
  **re-attempt at/after DUE-AT automatically without asking**; on another 429, append + re-arm
  (new error time + 9 h) and **repeat until every board has a PNG**. Check the queue at **every
  session start** and **before/after any work on that project or any design ingest**
  (`ls build/*/design-*/PENDING-FIGMA-FETCH.md`). **A design pass may NOT be called complete while
  a queue is OPEN** — state the shortfall ("73/85 PNGs; 12 pending, due-at <ts>") in the design
  notes AND the project's PROJECT-STATE.md. There is **no background timer** across sessions — the
  queue file + that mandatory check IS the mechanism. Live example (open):
  `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`.
- **Naming (Rule 19):** `<Section-Name>__<Board-Name>__<node-id-with-dash>.png` — board names repeat
  constantly ("Mobile" ×4, "Step 1" ×3), so the node id is mandatory to disambiguate.
- **Python gotcha:** do NOT name a helper script `enum.py` — it shadows stdlib `enum` and breaks
  `import json` with a circular-import error.
- **Helpers (copy these):** `build/filters/design-2026-07-31/tools/` — `enumerate_frames.py`
  (tree walk + dedupe), `texts.py` (visible-text per board), `render.py` (batch image request),
  `fetch_all.py` (**the resumable/idempotent fetcher — reads `frame-inventory.json`, skips boards
  already on disk, caches signed URLs in `imgurls.json`, runs from any cwd, and on a 429 prints +
  logs the error time / `retry-after` / DUE-AT into `PENDING-FIGMA-FETCH.md`; exit 0 = complete,
  2 = rate-limited & re-armed, 3 = short for another reason**). Canonical example output:
  `build/filters/design-2026-07-31/DESIGN-NOTES.md` (85-board inventory + design-vs-cases flags)
  and `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` (the Rule-35 retry queue).

## Jira/Confluence access
- **LOG IN TO JIRA / FILE OR READ A TICKET — the whole recipe is `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`
  (§0a "THE FAST PATH" is copy-pasteable) with runnable scripts at `build/atlassian-login/`
  (`bridge.mjs` · `login.mjs` · `jira.sh`). Do NOT re-derive it.**
- Live browser login (headless Chromium via a fresh MITM bridge → id.atlassian.com email+password →
  a **6-CHARACTER ALPHANUMERIC** email code (digits + uppercase letters) — **not** 6 digits, typed into
  **six separate boxes** `input[data-testid^="otp-input-index-"]`) is the PRIMARY way to reach
  `shopview.atlassian.net`. **Check whether the Atlassian MCP even exists before planning around it**
  — there were zero MCP servers on 2026-08-04; REST v3 with the session cookie is the reliable path.
  Creds/cookies/codes in `/tmp` only, and `/tmp` is wiped by a container reset.
- **Writes with cookie auth need `Origin` + `Referer` on `shopview.atlassian.net` or every POST/PUT
  is `403 XSRF check failed`**; `/rest/api/3/search` is **410** → use `/rest/api/3/search/jql`
  (pages by `nextPageToken`). Full gotcha table: that doc's §5a.
- **Posting evidence (attachments + inline images + comment edit):** see §K "Jira evidence method".
- **FILING A DEFECT TICKET — the organisation's REQUIRED format: see the section of that name below.**

## Filing a defect ticket — the organisation's required format (ALL projects, ALL future tickets)

**Standing instruction from the QA lead, 2026-08-04. Every defect ticket we file, on every project,
uses these SEVEN sections IN THIS ORDER.** Do not re-derive this (Rule 27). Canonical worked examples:
`build/report-suite/defect-pack-2026-08-04/TICKET-1…6*.md` (filed as SV-8818…SV-8823).

**🛑 BEFORE YOU EDIT AN EXISTING TICKET'S DESCRIPTION, READ §J DECLARED HAZARD #4.** Rewriting a
description over the REST API **DELETES any pasted image whose `media` node you do not carry into the
new body**, and **Jira logs the addition of such an image but NOT its deletion** — so the loss is
invisible in the changelog and provable only from a pre-write snapshot. One image was destroyed this
way on 2026-08-06 (SV-8818) and it is unrecoverable. The working method, the verbatim node-lifting
code and the read-only auditor are all in §J.

| # | Section | What goes in it |
|---|---|---|
| 1 | **Description** | Simple, layman-understandable. Plain words, **no jargon, no codes, no endpoints**. What is wrong, so anyone in the business understands it — plus why it matters. |
| 2 | **Branch / Environment** | **Stated explicitly, never assumed:** the branch/URL tested (e.g. `https://sv8582.qa.shopview.com`), the API host, the **build marker** (`<meta name="app-version">`, e.g. `v3.4.1-0ed4433`), the org/location ids, and the **date/time observed**. |
| 3 | **Steps to reproduce** | **REAL numbered steps a layman can follow**, using the **exact on-screen labels** (Rule 9). **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA — see the hard requirement below; a step that does not name it is non-compliant.** **NO API calls in this section**, and no "requires a large dataset" hand-waving — a person clicking the product must get end to end. If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7. |
| 4 | **Expected behaviour** | What should happen, in plain words. Quote the governing requirement if there is one (Rule 25). |
| 5 | **Current behaviour** | What actually happens, in plain words. |
| 6 | **Images** | Attach them **AND embed them inline so they RENDER in the description** — not merely a file list. If no image exists, **say so and say why** (never imply one). |
| 7 | **Technical details for developers** | **LAST.** ALL the codes, endpoints, request/response bodies, request ids, timings, row counts, spec references, extracted file text, repo evidence paths. Everything technical lives here **and nowhere above**. |

### TWO THINGS THAT MUST NEVER APPEAR IN A TICKET

1. **No reference to our test cases** — no "QA test cases affected" section, no internal case IDs
   (`SBR-EXP-10`), no C-ids, no TestRail links. Keep that mapping in OUR records (e.g.
   `build/report-suite/defect-pack-2026-08-04/CASE-IMPACT.md`).
2. **No "this QA branch is not final / this finding is provisional / close it if already fixed"
   disclaimer.** **The QA lead's reasoning, recorded:** *every QA branch is always non-final — they keep
   changing it — so saying so adds nothing, and it is OUR job to keep the test cases accurate, not the
   developer's job to caveat our findings.* **A defect hedged as provisional invites dismissal.**

> ⚠️ **DO NOT OVER-APPLY #2.** This drops the **Jira-facing text only.** The **Standing Rule 49 re-check
> obligation still stands INTERNALLY** — the `RECHECK-QUEUE.md` files stay exactly as they are, and a
> finding taken from a non-final build is still re-checked when the build moves. A future pass must not
> read "no provisional disclaimer" as "no re-check duty".

### HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA (QA lead, 2026-08-04)

**His words, verbatim:** *"This is not reproducible with the canned line I used, either you used a
different canned line (You should always name the canned line you used) unblock yourself by using
different canned lines."*

**THE RULE: a reproduction that does not name the data it used is NOT A REPRODUCTION.** Steps to
reproduce must name **every piece of data the behaviour could depend on, by its exact on-screen
name** — because the reader will pick a *different* one, get a *different* result, and close the
ticket. That is exactly what happened to SV-8821.

**NAME ALL OF THESE (every one that the flow touches; write "any" ONLY where you have PROVEN it does
not matter, and say how you proved it):**

| What | How to name it |
|---|---|
| **the canned line / pre-set job** | its exact name, e.g. *HD CVIP air brake trailer single/tandem* — and its price shape (fixed labour · fixed line total · hourly rate), because the catalogue mixes all three |
| **the customer** | the exact company name, e.g. *Aaborough Works* |
| **the contact person** | the exact name — **and whether one is set at all**, which is itself a behaviour-changing state |
| **the part** | part number **and** whether it is cored / special-order / in stock |
| **the asset** | year + make + model **and** VIN/serial, e.g. *2020 Ford Transit, VIN 86J8FAC1VALJ43SJY* |
| **the work-order state** | Estimate · Approved · Complete · **Invoiced** · Paid — these behave differently |
| **the location / workplace** | e.g. *Staging Heavy Duty - 9919* — writes are workplace-scoped |
| **the role / user** | who you were signed in as, e.g. `admin@shopview.com` (Administrator) |
| **the date range** | the exact from/to used, and the report's own date basis |
| **money** | the resulting totals, so the reader can confirm they built the same thing |

**COMPLIANCE TEST — apply it to your own text before filing:**
- ❌ *"Create a work order with a canned line."* — non-compliant.
- ✅ *"Create a work order and add canned line **HD CVIP air brake trailer single/tandem** (fixed
  labour, $350.00). The total should read **$406.09**."* — compliant.

**AND STATE WHAT YOU RULED OUT.** If several values were tried, list them and their results — a
short table of *"these behave the same"* saves the reader the work you already did, and it is the
proof that the variable is not the cause. If a value could **not** be tried, say which and why.

**RATIONALE — this is exactly how SV-8821 was lost.** Its steps said *"choosing a pre-set (canned)
job so it carries a price"*, naming none. The seeding script behind the evidence had silently
filtered the catalogue to `c.fixed_price && workplace === HD` — **11 of the 79 canned lines** — so the
report rested on a narrow slice nobody could see. The QA lead used a different one, saw it work, and
closed the ticket. **Re-testing then showed the canned line was never the variable at all: the real
condition was that the work order had no CONTACT person, which disables the Finance tab entirely
("Please select a contact for the asset") and makes the failure unreachable from any screen.** Naming
the data in the first place would have surfaced that in the first hour. Full evidence:
`build/report-suite/defect-pack-2026-08-04/repro-sv8821/` and the corrected SV-8821 description.

### INLINE IMAGES — the mechanism that actually works (proven 2026-08-04)

A hand-built ADF `media` node **fails**: `PUT /rest/api/3/issue/{key}` returns **400
`ATTACHMENT_VALIDATION_ERROR`** because the media `id` must be a **media-services UUID**, not the
attachment id. The working route is **wiki markup through API v2**, which makes Jira resolve the
filename server-side:

1. `POST /rest/api/3/issue/{KEY}/attachments` (multipart `-F file=@…`, header
   **`X-Atlassian-Token: no-check`**) → note the returned `id` and **check `size` against the source file**.
2. `PUT /rest/api/2/issue/{KEY}` with `description` as a **wiki-markup STRING** containing
   **`!the-file-name.png|width=900!`** → HTTP 204.
3. **VERIFY it truly renders inline, do not assume:** `GET /rest/api/3/issue/{KEY}?fields=description&expand=renderedFields`
   → the stored ADF must contain a **`mediaSingle` › `media`** node whose `attrs.id` is a **36-char UUID**,
   **and** `renderedFields.description` must contain a real
   **`<img src=".../rest/api/3/attachment/content/<attachmentId>">`**. An attachment with no media node
   is *attached but not inline* — that fails this format.

Wiki-markup quick reference: `h2. Heading` · `*bold*` · `_italic_` · `{{monospace}}` ·
`{noformat}…{noformat}` (code blocks) · `{quote}…{quote}` · `* bullet` · `# numbered` · `----` (rule) ·
`||header||header||` then `|cell|cell|` (tables) · `!image.png|width=900!`.
Reusable converter: `/tmp`-side `md2wiki.py` pattern documented in
`build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §5a; give descriptions to v2 as wiki markup, **not** ADF, when
they contain images.

### THREE HARD GATES BEFORE AND WHILE FILING (QA lead, 2026-08-04 — Standing Rules 51 / 52 / 53)

**These three came in AFTER the six tickets below were filed, and each one corrected something that
pass got wrong. Read them before you file anything.**

**1. API-RELATED TICKETS ARE NEVER FILED WITHOUT ASKING — EVERY TIME (Rule 51).**
His words: *"do not create the tickets which are related to API , if there are any ASK me (ask again if
I have previously given a go ahead for the API tickets with the Non API tickets) and create them ONLY
if I ask you to create them"*. **A BATCH APPROVAL DOES NOT COVER THE API ITEM INSIDE IT** — ask again,
naming it, even if he already approved the batch.
**The reachability test:** if the defect is **invisible to a user and to a manual tester — reachable
only by calling an endpoint directly with a request the product's own screens never send — it is
API-RELATED.** If **the same failure also happens through the product's own screens**, it is a
**user-facing** defect that merely happens to be characterised technically (a 500 in the evidence does
**not** make it API-related).
**Method:** list API-related findings in **their own section of the defect pack BEFORE filing** (canonical
vehicle: a dated `API-SPLIT.md` beside the pack, e.g.
`build/report-suite/defect-pack-2026-08-04/API-SPLIT.md`), ask separately in plain words, file only on a
yes. **Already filed one? Withdraw on his ruling — CLOSE it by workflow transition with a plain-language
comment, set priority first (`Medium` since 2026-08-06), and NEVER DELETE** (deletion is irreversible; a withdrawn ticket with
its reasoning on the record is worth more). **Keep the finding in the pack — we withdraw the ticket, not
the finding.** Read alongside **Rule 24**: FE-blocks + BE-allows is a **PASS**, not a defect at all.

**2. FILE A `Story Defect` PARENTED TO THE OWNING STORY (Rule 52, amended 2026-08-05 — this SUPERSEDES
the Bug-on-an-epic-parent shape below).**
His instruction, verbatim: *"Also, make sure that whenever you create a ticket it should be attached to
the parent ticket as its epic and that ticket should be created as STORY DEFECT"*.
**⚠️ PRIORITY IS `Medium` FROM 2026-08-06 — `Low` was the rule until that date.** QA lead's ruling,
verbatim: *"One thing which I want to correct, please keep the priority of the tickets which you create to
Medium instead of keeping them to LOW."* So **every NEW ticket is `Medium`**; **`High` is still never
used**. The old value is left visible here on purpose — tickets filed **before 2026-08-06 carry `Low` and
are CORRECT for their date**, and a superseded rule that is quietly deleted is how a session ends up not
knowing why an old ticket looks different. **Do NOT retro-change a priority that is already set** (Rule 53's
corollary — the one time a pass "corrected" priorities it had misread the QA lead's own triage and left a
High→Low→High→Low round trip in the changelog).

**THE SHAPE — `issuetype` = `Story Defect` (10007) · `parent` = THE OWNING STORY · `priority` = `Medium` (was `Low` before 2026-08-06) ·
ALSO link the owning story `relates to` · DO NOT send Product Area.**
**Why a story parent still satisfies "attached to the epic":** the owning story is itself a child of the
epic, so the defect **rolls up to the epic** one level further down. **A `Story Defect` cannot be
parented to an Epic at all** — proven live 2026-08-05, a create with an Epic parent returns
**HTTP 400 `{"errorMessages":[],"errors":{"parent":"Please select valid parent issue.","parentId":"Please
select valid parent issue."}}`**, while the **identical body with a STORY parent (SV-8689) returns HTTP
201** and reads back at hierarchy level −1 under a Story. Population check: **of ALL 502 Story Defects in
SV** (exhaustive, fully paged) parents are **Story 294 · Task 149 · Bug 57 · none 2 · EPIC 0** (0 under
SV-8685, 0 under SV-8785, 0 under SV-8582). His own cited example **SV-8883** sits under **SV-8786, a
Story**.
**ISSUE TYPES IN PROJECT SV** (`GET /rest/api/3/issue/createmeta/SV/issuetypes` → HTTP 200, 6 types, read
live 2026-08-05):

| type | id | subtask | hierarchyLevel | use |
|---|---|---|---|---|
| Task | 10005 | false | 0 | — |
| Epic | 10006 | false | 1 | parent of stories/tasks/bugs |
| **Story Defect** | **10007** | **true** | **−1** | **our defect tickets; parent must be level-0** |
| Bug | 10008 | false | 0 | pre-2026-08-05 shape; may take an Epic parent |
| Story | 10245 | false | 0 | the parent we use |
| Story Defect - Archive | 10279 | false | 0 | **LEGACY — NEVER USE** (lookalike name, wrong level) |

**WORKING CREATE SHAPE (Story Defect):**
```
POST /rest/api/3/issue
{"fields":{"project":{"key":"SV"},"issuetype":{"id":"10007"},
           "parent":{"key":"<OWNING-STORY>"},          # level-0 ONLY; an Epic key → 400
           "summary":"<one line>","description":<ADF, 7 sections>,
           "priority":{"name":"Medium"},                # Rule 53 as amended 2026-08-06 (was "Low")
           "customfield_10418":{"value":"<Severity>"}}} # NO customfield_10153 on this type
```
then `POST /rest/api/3/issueLink` `relates to` the same story.
**FIELD DIFFERENCE:** **Product Area (`customfield_10153`) is REQUIRED on `Bug` and ABSENT on
`Story Defect`.** Priority (`Medium` since 2026-08-06), the `relates to` link and the seven-section ADF body behave identically
on both.
**CONVERSION IS UI-ONLY AND SILENTLY WIPES Product Area — AND IS NEVER OURS TO DO.** The REST API refuses
level-0 → subtask (both proven 2026-08-04): `PUT /rest/api/3/issue/{key}` with `issuetype:10007` +
`parent` → **400 `{"pid":"Issues with this Issue Type must be created in the same project as the
parent."}`** (misleading — the parent *was* in the same project); `issuetype` alone → **400
`{"issuetype":"Issue type is a sub-task but parent issue key or id not specified."}`**. **The org's UI
"Change work type" wizard does what the API refuses — it converts the type AND atomically re-parents
Epic→Story in ONE changelog action** (SV-8886 Mudassir Qamar 2026-08-05 09:29:49 →SV-8689 · SV-8849
09:15:03 →SV-8692 · SV-8871 Ahtasham Amjad 04:51:42 →SV-8795 · SV-8846 04:46:32 →SV-8797). **⚠️ The
conversion DESTROYS Product Area and the loss is NOT in the changelog** — proven on our own **SV-8886**
(filed with Product Area = Schedule, byte-verified at filing, now NULL) vs **SV-8848** (never converted,
still Schedule); **all 502 Story Defects in SV have Product Area null**. His ruling: **"Product area loss
is OK"**. **Converting an existing ticket is HIS decision** — Mudassir and Ahtasham convert tickets
themselves and Rule 53's corollary forbids cutting across their triage.
**THE UI CONVERSION LANDS ON THE STORY WE *LINKED*** (SV-8886 linked SV-8689 → landed under SV-8689;
SV-8849 linked SV-8692 → landed there), **so keep adding the `relates to` story link even though it now
duplicates the parent.**
**⚠️ WE CANNOT DELETE JIRA ISSUES** — `DELETE /rest/api/3/issue/{KEY}` → **HTTP 403 *"You do not have
permission to delete issues in this project."*** So a throwaway/probe ticket **cannot be removed**:
transition it to **OBSOLETE** with a comment saying it is a disposable ZZAUTOTEST probe, and expect it to
persist as a closed item (this is why **SV-8902** still exists). Probe once, record the answer here.
**The LINK TYPE list** (`GET /rest/api/3/issueLinkType`, read live 2026-08-04): **Blocks** · **Cause**
(`caused by`/`causes`) · **Cloners** · **Duplicate** · **Fixes** · **Polaris work item link** ·
**Relates** · **Split**. **None is a defect-of / is-defect-for type — and that no longer matters:** the
story-defect relationship is carried by the **issue type + story parent**, so the link we add is
**`relates to`**. If he ever asks for a different one, **change nothing and ask which of the eight.**

**3. PRIORITY IS ALWAYS `Low` — NEVER `High` (Rule 53).**
His words: *"never mark the priority as High for the tickets you create always keep the priority as
LOW"*. Priority is **his to raise, not ours to assert**. Severity belongs in the ticket's words and in
the `Severity` field, **never** in `Priority`.
**⚠️ AND NEVER "RESTORE" A FIELD HE HAS CHANGED.** He works in the Jira UI **under this same account**,
so **his edits are indistinguishable from ours in the changelog** — the author column reads our own
name. A change with no action of ours is **his triage**, to be **asked about, never reversed**. Tells: a
**selective, semantically coherent** change (only the `High` ones moved) or a **transition that sets a
resolution**. On 2026-08-04 a pass read his four `High → Low` downgrades as drift and "restored" them;
he re-applied `Low`, and the changelog now carries **`High → Low → High → Low`** on all four.

### Fields to set on a ShopView `SV` defect ticket (from `createmeta`, 2026-08-04; type amended 2026-08-05)

`project` · `issuetype` (**`Story Defect`, id 10007** — was `Bug` before 2026-08-05) · **`parent` — THE
OWNING STORY, and it is REQUIRED on this type** (level-0 only; an Epic key → HTTP 400) · `summary` ·
`description` · `labels` · **`priority` — ALWAYS `Medium` since 2026-08-06, `Low` before it** (Rule 53; the field offers
Highest/High/Medium/Low, we use `Low`) · `customfield_10418` **Severity** (High/Medium/Low — put the real
severity HERE).
**⚠️ `customfield_10153` "Product Area" is REQUIRED on `Bug` and DOES NOT EXIST on `Story Defect`** — do
not send it on a Story Defect (his ruling: *"Product area loss is OK"*).
**Also attach the owning story as a LINK** (`POST /rest/api/3/issueLink`, `relates to`) even though it
duplicates the parent — see gate 2 for why.
**Withdrawing a ticket:** read `GET /rest/api/3/issue/{KEY}/transitions` and use the closest close
transition — on `SV` that is **`Close` (id 8) → status `OBSOLETE`**, whose post-function sets
**`resolution: Done`** with no resolution screen. Comment first (v2 `POST /rest/api/2/issue/{KEY}/comment`
takes a plain string), then transition, then read back status + resolution + priority + comment.

---

## Navigation Map

How to reach each screen. SPA routes are under `app.staging.shopview.com`. Top nav
items are **gated by permission** (a hidden item means the role lacks the perm).

> **↔ PER-PROJECT PATHS LIVE IN `build/<project>/NAVIGATION-MAP.md` — NOT HERE.** This section holds
> the **shared, cross-project staging** paths. A path that is specific to a project and to the branch
> it is tested on goes in that project's own map (template: `build/NAVIGATION-MAP-TEMPLATE.md`;
> convention: `build/skills/03-RUN-CHECK.md` §9), which records the branch + build marker and the date
> observed. **The two files cross-reference, never duplicate:** if a path proves general, promote it
> here and point at it from the project map. Same discipline either way (Rules 27 / 57 / 12) — a path
> is written only after it was **navigated successfully and observed live**, never inferred from source
> code, a spec, a design or another branch, and the map records **navigation only, never expected
> behaviour**.

**🛑 FRESHNESS COLUMNS ADDED 2026-08-31 — EVERY EXISTING ROW IS `❌`, AND THAT IS THE HONEST ANSWER.**
The four right-hand columns (branch + build marker · date observed · Rule 91 badge · recorded by) were
added on **2026-08-31** to match the navigation-map convention in `build/skills/03-RUN-CHECK.md` §9.
Every row that already existed was written **before the convention existed**, so **none of them carries
an observation date and none can be given one now**. A `❌ unknown` cell means literally that, and the
badge cell states it in full: *"❌ observation date unknown — recorded before the navigation-map
convention existed (2026-08-31); not yet re-observed"*. **The date on which the row's TEXT was committed
is NOT the date the path was observed** — do not back-fill one from git history; that is false precision
(Rule 12: verified means observed, never inferred). **No path text, URL, label or note was changed when
the columns were added** — the paths are exactly as they were.
**Use a `❌` row as a starting point, not as evidence.** If it works, re-observe it properly and replace
all four cells with the branch + build marker, today's date, a ✅ badge and your session; if it fails,
correct the row and commit the correction in the same pass (Rule 93) — never leave a known-wrong path
for the next session. Badges: **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never observed / unknown.**

| Screen / Feature | Nav path (from the top) | SPA route | Notes | Branch + build marker observed on | Date observed | Freshness badge (Rule 91) | Recorded by |
|---|---|---|---| --- | --- | --- | --- |
| Work Orders list | Top nav → Work Orders | `/workorders` | Gated by `workOrdersView`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Work Order detail | WO list → click a row | `/workorders/{id}/lines` | **Existing-WO detail bounces to `/workorders` on mount for ALL roles incl. admin.** Only a **freshly-created** WO reliably lands on the detail/lines page — create fresh to test line/part/finance flows. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Finance tab | open WO → **Finance** tab | (within WO detail) | Gated by `invoicingPaymentsView` **AND** `seeFinancialData`. Holds Create Invoice / Add Deposit / invoice kebab (Reverse / Issue Credit). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Parts tab | open WO → **Parts** tab | `/workorders/{id}/parts` | Direct URL to `/parts` sub-route returns page-not-found without WO context (SPA needs WO loaded). Order Parts is meant to gate this tab (visibility looked identical ON/OFF — needs manual confirm). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Lines / Notes / Stats tabs | open WO → tab | (within WO detail) | Tabs render as Lines / Parts / Notes / Stats (+ Finance when invoicing+SFD on). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Schedule (calendar) | Top nav → Schedule | `/schedule` | Gated by `scheduleView`; shows ALL users' appointments. Create/delete = click/drag on the grid (no persistent button). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts (department) | Top nav → Parts | `/parts` | Gated by Parts Department parent. Parent OFF → nav item gone and inner pages redirect to `/workorders`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Part Sales | Parts → Part Sales | `/parts/part-sales` | **Route is flaky in the harness** (sometimes never reaches `domcontentloaded`; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. `/part-sales`, `/partsales` are NOT valid (page-not-found). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Catalog | Parts → Catalog | `/parts/parts-catalogue` | Read-only without Create&Edit. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Inventory | Parts → Inventory | `/parts/inventory` (also `/inventory`) | "New Inventory Part" button with Create&Edit. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Part History (inventory) | Parts → Inventory → **clock icon** next to a part | `/parts/inventory` | Clock icon (tooltip **"Part History"**) opens that part's history. This is a **separate feature** from the WO View History Logs permission. **Part Sales has NO history.** (Confirmed with product owner.) | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Vendors | Parts → Vendors | `/parts/vendors` (also `/vendors`) | Supply-chain sub-tabs: Purchase Orders, Vendor Invoices, Returns, Vendors. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts → Returns | Parts → Vendors → Returns tab (or Parts → Returns) | `/parts` → Returns | Returns list; row three-dots → "Return to inventory" / "Delete Return". | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Customers | Top nav → Customers | `/customers` | Gated by `customersView`; OFF → nav gone and `/customers` redirects to `/workorders`. Customer detail tabs: Work Orders / Part Sales / Contacts / Assets(vehicles) / Notes / Payments. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Reports | Top nav → Reports | `/reports` | Gated by `reportsPageAccess`. Left nav groups: A/R Aging (Summary/Detail/Collection), A/P Aging (Summary/Detail/Unpaid Invoices), Sales Tax, Timesheet Activities. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| A/R & A/P aging reports | Reports → left nav | `/reports/ar-aging-summary`, `/reports/ap-aging-summary`, `/reports/ap-unpaid-invoices`, `/reports/ar-aging-collection` | Now follow **Reports** permission (all-or-nothing), per updated spec. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Timesheet Activities | Reports → Timesheet Activities | `/reports/punch-clock-activities` | Default report view; gated by `timesheetsView` (+ reports). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Administration (Settings home) | left sidebar → Settings group | `/administration`, `/administration/settings` | No perms → `/administration` redirects to `/workorders`; no SETTINGS group in sidebar. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Roles & Permissions (roles list) | Settings sidebar → **Roles & Permissions** | `/administration/roles-permissions` | Heading "Roles & Permissions". "Create custom role" button. Gated by `settingsApp` (App Settings). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Create/Edit role | Roles list → "Create custom role" (or pencil) | `/administration/roles-permissions/new` · `/administration/roles-permissions/{id}/edit` | Template picker modal → Apply → `/new?template=...`; Skip → blank `/new`. View-only summary at `/{id}/summary`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Staff | Settings sidebar → Staff | `/administration/staff` | Role user-counts link here as `?roleName=<RoleName>`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Locations / Departments / Taxes | Settings sidebar (App group) | `/administration/locations`, `.../departments`, `.../taxes` | App Settings group also holds Settings + Staff + Roles & Permissions. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Service settings | Settings sidebar → Service group | `/administration/labour-types` (Labor Rates), `/canned-lines` (Canned Lines), Asset Types, Inspection Templates | Gated by `settingsService`; OFF → these redirect to `/administration/locations`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts settings | Settings sidebar → Parts group | Pricing, Bin Locations, Categories | Gated by `settingsParts`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Finance settings | Settings sidebar → Finance group | Payment Methods | Gated by `settingsFinance`. **No QuickBooks entry present** (relocation not implemented). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Data Import | Settings sidebar → Imports group | Contacts, Assets, Vendors, Inventory, Invoices | Gated by `settingsDataImport`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Wages | (per-staff) Staff → Edit Staff Member | (modal) | `settingsWages` reveals Salary Type + Hourly Rate on the staff modal. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Integrations | Settings sidebar → Integrations | `/administration/quickbooks`, `/administration/finance/quickbooks` (routes exist) | Shows only **IBS**; QuickBooks absent. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |

### RE-OBSERVATION ATTEMPT — 2026-08-31 · **0 of 28 rows re-observed** (no session could be minted)

An attempt was made on **2026-08-31** to re-walk every row above on staging and replace the `❌` cells
with a real date. **It reached the app but could not sign in, so NOT ONE row was re-observed and every
row above is still `❌`.** Recorded here so the next session does not repeat the same four probes.

**What WAS observed live, unauthenticated (this much is real):**

| Probe | Result |
|---|---|
| `GET https://app.staging.shopview.com/index.html` | **HTTP 200** · build marker **`v26.35.6-49e216a`** · `last-modified: Fri, 28 Aug 2026 08:31:04 GMT` · `etag: "7ee61447ee66167ad918fee664be24ea"` |
| `GET https://api.staging.shopview.com/` | **HTTP 200** `{"data":[]}` — the API host is up |

**What FAILED, with the exact response text:**

| Probe | Result |
|---|---|
| `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` (no cookies — none exist in this container) | **HTTP 401** `{"error":"sso_required","sso_redirect_url":"https://auth.staging.shopview.com/login?return_to=…"}` |
| `POST https://api.staging.shopview.com/api/quick-login {"key":"admin"}` | **HTTP 401** — the **identical** `sso_required` body. Confirms on **staging** what §A already proved on `sv9500api`: quick-login is itself SSO-gated and is **not** a way in from a cold jar |
| Following the `sso_redirect_url` to `https://auth.staging.shopview.com/login?...` | **HTTP 200 — the real Google sign-in page** (`accounts.google.com`, `hd=shopview.com`, `prompt=select_account`). Exactly the §A root cause: **a staging session is mintable only by a human SSO login or by the QA lead handing over a cookie set** |

**Why no fallback was tried:** `/tmp` held **no cookie file at all** (`/tmp/qa-cookies/`,
`/tmp/staging-cookie.txt`, `/tmp/cln/cookies.json` — none present; `/tmp` is per-container and this was
a fresh one), and §A records that `POST /api/login {username,password}` is **prod-only** and answers the
same `sso_required` 401 on staging. **This is the state `build/BLOCKED-shopview-app-session.md` already
describes — re-confirmed live on 2026-08-31, not a new blocker.** The unblock is unchanged: a fresh
three-cookie set for `app.staging.shopview.com` from the QA lead, into `/tmp` only.

---

## WORK ORDERS

### Create a WO
- **UI path:** Top nav → Work Orders (`/workorders`) → **New / New Work Order** button → New Work Order dialog (Customer selector + Asset selector) → Create.
- **API:** `POST /api/work-orders/` (create). Dialog offers inline **Add** buttons for Customer and Asset that open working create forms.
- **Preconditions:** `workOrdersView` + `workOrdersCreateAndEdit`. Customer selector lists customers even when `customersView` is OFF (feature-access vs data-access).
- **Gotcha/Unblock:** `work-orders/create` returns **HTTP 500 in some sessions** — reuse an existing record or create via the UI. Custom Quasar dropdowns for Customer/Asset resist automation; the New WO dialog's Add-Customer/Add-Asset buttons are **NOT gated** by `customersCreateAndEdit` (they appear and function regardless — a known FE-gating gap). **Create fresh** whenever you need to reach a WO detail page.
- **Confidence:** Medium (dialog + affordances confirmed; full automated save flaky).

### Open / navigate a WO
- **UI path:** Work Orders list → click a row → WO detail `/workorders/{id}/lines`.
- **API:** `GET /api/work-orders/view/{id}` · `GET /api/work-orders/lines/{wo}` · list `GET /api/work-orders` / `GET /api/work-orders/simple-list`.
- **Gotcha/Unblock:** **Existing-WO detail bounces back to `/workorders` on mount for every role (incl. admin).** Deep-links and row-clicks both bounce. **Workaround: create a fresh WO** — only freshly-created WOs reliably land on the detail/lines page — then run line/part/finance actions there.
- **Confidence:** High (bounce reproduced across all roles).

### Add a line
- **UI path:** WO detail → Lines tab → **New Line** button → New Line dialog (includes "AI - SHOPCOACH LINE BUILDER" entry).
- **API:** `POST /api/work-orders/lines/create`. Canned-line pick source: `GET /api/work-orders/canned-lines` **(verify — not evidenced in artifacts; the `/canned-lines` seen is the Service-settings SPA route)**.
- **Preconditions:** `workOrdersView` + `workOrderLinesCreateAndEdit` (New Line button + ShopCoach builder are gated by `workOrderLinesCreateAndEdit`; hidden when OFF).
- **Gotcha/Unblock:** `work-orders/lines/create` can return **HTTP 500** in some sessions. Line persisted end-to-end when created via the New Line dialog (Lines count incremented).
- **Confidence:** High (line added + persisted).

### Change a line's status (approve / authorize a line)
- **UI path:** WO detail → Lines grid → per-line **Approve** button (or bulk **Set line status**).
- **API:** `POST /api/work-orders/lines/change-status` body `{line_id, status:'authorized', workOrderId}` → **200**. Status advances `authorization_required` → `authorized`.
- **Preconditions:** line in an approvable state; `workOrderLinesCreateAndEdit`.
- **Confidence:** High (executed, 200).

### Bulk line status change
- **UI path:** WO detail → Lines grid → select lines → bulk-action menu (**Set line status | Delete lines | Split work order**) → Set line status.
- **API:** `POST /api/work-orders/lines/change-lines` → **201** (body `{data:[]}` on success). Bulk-complete works even for another tech's line (SV-8042 own-data bypass — needs manual confirm with default Technician role).
- **Confidence:** High (executed, 201, from SV-4112).

### Delete a line
- **UI path:** WO detail → Lines grid → select line → bulk-action menu → **Delete lines**.
- **API:** `POST /api/work-orders/lines/delete-lines` → **200**. Guard: `POST /api/work-orders/lines/check-delete` **(verify — endpoint named in task, not evidenced)**.
- **Preconditions:** `workOrderLinesDelete`. **A line is deletable in any status EXCEPT Complete.**
- **Confidence:** High for delete-lines (executed 200, Lines count decremented); (verify) for check-delete guard.

### Approve / authorize a WO (send for approval)
- **UI path:** WO detail → approvals / Send-to-Portal action.
- **API:** `POST /api/work-orders/approvals/create-approval-request`.
- **Gotcha/Unblock:** This `create-*` endpoint returns **HTTP 500 for BOTH Office and Admin** in-session (the create-* session quirk) — a clean 403 could not be isolated. WO/line status ladder: **Uncomplete / Approved / Authorized / Complete**.
- **Confidence:** Medium (endpoint mapped; 500 quirk observed).

### Uncomplete a WO, then delete it
- **UI path:** WO header three-dot menu → (Uncomplete) → then Delete Work Order.
- **API:** `POST /api/work-orders/delete` body `{work_order_id}`. **Move the WO to Uncomplete first** — delete requires it.
- **Preconditions:** `workOrdersDelete`. Without it: header menu shows only Audit Log/Timesheets (no Delete) **and** the endpoint returns **403 "Access denied."** (verified for Parts Manager).
- **Confidence:** High (403 gating confirmed; Uncomplete-first rule documented).

### Edit WO header / change service advisor
- **UI path:** WO detail → header fields / service-advisor selector.
- **API:** `POST /api/work-orders/change-service-advisor`.
- **Gotcha/Unblock:** FE hides it for Technician, but the **backend does NOT enforce it** — a Technician POST to `change-service-advisor` actually changed the field (FE-only display gate). Expected-denial cases must be verified in the **UI**, not by the endpoint.
- **Confidence:** High (FE-only gate proven).

### Edit asset fields on a WO (mileage / engine hours / plate / VIN)
- **UI path:** WO detail → vehicle/asset fields (VIN via **Edit Vehicle** form).
- **API:** `POST /api/work-orders/change-mileage` · `.../change-engine-hours` · `.../change-licence-plate` (all → **201**); VIN via `POST /api/vehicles/change` → **201**.
- **Confidence:** High (all four executed + persisted).

### Complete the Review step (why it blocks Create Invoice)
- **UI path:** WO detail → Review action (surfaces when the WO is in a reviewable state).
- **Gotcha/Unblock:** An **unclicked Review button blocks Create Invoice.** Create Invoice only enables after Review is complete (WO moved Approved → Reviewed → Complete). The Review action's visibility is gated by the `woReviewWorkOrders` sub-toggle.
- **Confidence:** High (Create-Invoice prereq confirmed across roles).

---

## PARTS

### Add a part to a line
- **UI path:** WO detail → Lines → line **more_vert** menu → **Request part** / Add Part window → Save & Close.
- **API:** part request creation flows through the WO part endpoints; category edit on an existing request uses `POST /api/work-orders/part/change-request` → **200** (recalculates sellPrice/margin; category select editable for inventory parts).
- **Gotcha/Unblock:** The Add-Part combobox + Save&Close flow is **harness-flaky** (SV-5132: modal sometimes doesn't close). Needs a role with add-parts permission (`woAddParts`; stock Technician role has it false).
- **Confidence:** Medium (change-request 200 confirmed; add-part flow flaky).

### Order / pick a part
- **UI path:** WO detail → Parts grid → blue **Order** button (part in "Auth to order") or green **Pick** button (in-stock part).
- **API:** `POST /api/work-orders/part/perform-request-status-action` body `{part_request_id, action:'order'|'pick'}` → **201**. Order: `authorized_to_order` → `waiting_to_receive`; Pick: in-stock → moves toward Received.
- **Preconditions:** `woOrderParts` (+ SFD) for Order; `woPickParts` for Pick. **Both are FE-only gates** — the endpoint returns **400 validation, not 403**, with only `workOrdersView` (confirm the Pick/Order control renders in the UI to test the gate).
- **Confidence:** High (order + pick both executed, 201).

### Receive a part (so it has a real part number)
- **UI path:** Parts / receiving flow (mark the ordered part received).
- **Gotcha/Unblock:** **Invoicing is blocked by parts that are "Requested", show `(-)`, or have no part number/badge.** The **OVER LIMIT** customer badge does **NOT** cause this — the real cause is a blank/missing part number. Fix: **delete the bad request and re-add the part WITH a number, then receive it** so it becomes a genuinely RECEIVED numbered part. (Auto Pick bug SV-6873: approving a quoted part can pick 2×qty — verify.)
- **Confidence:** High (documented as the Create-Invoice unblock across multiple runs).

### Catalog: create / edit / delete a part
- **UI path:** Parts → Catalog (`/parts/parts-catalogue`) → **New Catalog Part** (create) / open part → edit / delete.
- **API:** `POST /api/parts-catalogue/add-catalogue-part` → **201** · `POST /api/parts-catalogue/change-catalogue-part` → **200** · `POST /api/parts-catalogue/remove-catalogue-part?id=<partId>` → **200**.
- **Preconditions:** Catalog View/Create&Edit/Delete. Cost & price columns gated by **SFD** (ON shows Average Cost/Sell Price, OFF hides them; item still creatable).
- **Gotcha/Unblock:** **Backend does NOT enforce catalog edit/delete** — Office (view-only) `change-catalogue-part` returned **200** and persisted; Parts Tech (no delete perm) `remove-catalogue-part` returned **200**. FE hides the controls but the API is open — verify denials in the UI.
- **Confidence:** High (all three executed).

### Inventory: create / delete a part
- **UI path:** Parts → Inventory (`/parts/inventory`) → **New Inventory Part** (create) / row delete.
- **API:** `POST /api/inventory/parts/create` → **201** · `POST /api/inventory/parts/delete` → **201**. List: `GET /api/inventory/parts`. Orders: `GET /api/inventory/orders`.
- **Part history:** Each part row has a **clock icon** (tooltip **"Part History"**) under Parts → Inventory that opens that part's history. This is a **separate feature** from the work-order View History Logs permission and is NOT gated by it. **Part Sales has NO history at all.** (Confirmed with product owner.)
- **Confidence:** High (create + delete executed as Parts Manager, 201).

### Vendors: create / delete
- **UI path:** Parts → Vendors (`/parts/vendors`) → **New Vendor** form (Name required; Country, Taxes) → Save & Close.
- **API:** `POST /api/parts-catalogue/add-vendor` → **201** · `POST /api/parts-catalogue/remove-vendor` → **201**. Vendor detail (with sensitive fields credit_term/credit_limit/tax_id): `GET /api/parts-catalogue/vendor/{id}`.
- **Gotcha/Unblock:** UI vendor save can be blocked by a **Google Maps overlay**; the API create needs a **valid `tax_id` UUID** (returns 400 validation without one, never 403). Vendor credit: `POST /api/parts-catalogue/vendor/credit/create` → **200**.
- **Confidence:** High (add/remove executed as Parts Manager, 201).

### Part Sales: create
- **UI path:** Parts → Part Sales (`/parts/part-sales`) → create.
- **API:** `POST /api/part-sales` body `{company_id:<customer>}` → **200** (new part-sale, status Estimate). List `GET /api/part-sales`.
- **Preconditions:** `partSalesCreateAndEdit` (+ `invoicingPaymentsCreateAndEdit` to invoice it).
- **Gotcha/Unblock:** **The `/parts/part-sales` SPA route is flaky** — it repeatedly failed to finish loading in some sessions (blocked cases 26411/26412). If the UI won't load, hit `POST /api/part-sales` directly after confirming the FE gate is reachable.
- **Confidence:** High for the endpoint (executed 200); route itself flaky.

### Part Sales: Fees & Discounts VIU recipe (staging, proven 2026-07-22)
- **Part sales ARE work orders under the hood** — use the WO endpoints, NOT `/api/part-sales/{id}` (that 404s for detail/delete).
  - Detail route (SPA): `/parts/part-sale/{id}/part-requests`; Statistics section renders further down the same view.
  - Read: `GET /api/work-orders/view/{id}` (has `adjustments[]`, `adjustmentsSummary`, `editable`, `deletable`) and
    `GET /api/work-orders/lines/{id}` (`data.collection[0].part_requests[]`, each with `adjustments[]`).
- **Create:** `POST /api/part-sales {company_id}` → 200 `{data:[{id}]}` (harvest `company_id` from any `work-orders/view`).
- **Add parts (UI, reliable):** open detail → `[data-test-id="button_add_part"]` → `[data-test-id="select_part"]` type a
  catalogue name → click first `.q-menu .q-item` → set qty (`input_bin_quantity_*` for inventory, else
  `input_workorder_part_quantity`) → **"Save & Add Part"** (repeat) / **"Save & Close"** (last).
- **Add fees/discounts (API):** `POST /api/work-orders/adjustments/add` with
  `{workOrderId, kind:'fee'|'discount', name, calculationType, amount, maxCap:null, scope, targetId, taxable:true, templateId:null, description:null}`.
  - Part-line: `scope:'part_line'`, `targetId:<part_request id>`, calc `pct_parts` (or `flat`).
  - Whole parts-sale: `scope:'whole_wo'`, `targetId:null`. **Percent uses `pct_subtotal`** (⚠ `pct_total` → 400 "Invalid
    calculation type" on part sales); flat uses `flat`. (`pct_grand_total` is the company Processing-Fee template.)
- **Row/menu test-ids:** per-part ⋮ = `button_part_request_menu_{partId}` (ABSENT on non-editable sales → add blocked);
  top-right whole-sale ⋮ = `button_part_sale_nav_bar_menu` ("Delete / Add Parts Sale Fee / Discount / Set status");
  card adjustment kebabs = `button_parts_sale_adjustment_actions_{adjId}`.
- **Filled-cell breakdown viewer:** click the F&D cell text (e.g. `text=/Part Fee/`) → dialog "Fees & Discounts" with cols
  Name/Type/Calculation/Amount/Max Amount + "Net adjustment"; per-row `i:text-is("delete")` → confirm "Remove Fee /
  Discount" → "Remove".
- **Delete a part sale:** `POST /api/work-orders/delete` (201) — driven from top-right ⋮ → Delete → confirm. Re-GET
  `work-orders/view/{id}` then returns 400 (gone). (Direct `DELETE /api/part-sales/{id}` and `DELETE /api/work-orders/{id}` 404.)
- **Confirmed labels (SV-8479 build, staging):** F&D column has NO "+ Add"; per-part menu "Add Part Fee / Discount";
  per-part dialog title "New Part Fee / Discount" + subline "Applying To: Line N Part — Part — (pn) name"; whole-sale menu
  "Add Parts Sale Fee / Discount" + dialog "New Parts Sale Fee / Discount" + subline "Applying To: Entire Parts Sale";
  card "Parts Sale Fees & Discounts" plain text w/ bracket % (fee no sign, discount minus, flat name-only); Financial Info
  "Fees & Discounts (N)" directly above Subtotal; Statistics F&D section headings "% Amount" (flat = blank %); jurisdiction
  note below Taxable Yes/No dropdown in every dialog.
- **Confidence:** High (all executed live 2026-07-22, admin with Part Sales C&E + See Financial Data).

### Returns: create / list / delete
- **UI path (create from WO):** WO line → part context menu → **Return** → "Add new part return request" dialog (Return Reason, Quantity) → confirm.
- **UI path (create from WO, manual):** returns list / WO part actions.
- **UI path (delete):** Parts → Returns → row three-dots → **Delete Return** → "permanently delete" confirmation (No / Yes).
- **API (create):** `POST /api/work-orders/part/make-return-request` → **200** (returns a new return-request id) · alt `POST /api/part/manual-return-request/create` → **201** (creates part-return, status "returned").
- **API (delete):** `POST /api/work-orders/part/remove-return-request` body `{part_return_request_id}` (or `{partReturnRequestId}`) → **200** · also seen: `POST /api/work-orders/part/delete-return-request` → **200** (return-request count drops).
- **API (list):** `GET /api/work-orders/part/list-return-requests`.
- **Preconditions:** returning a part from a WO requires **no permission** (endpoint never 403s; falls through to business validation — e.g. 400 "Cannot return inventory part" / "part_id: Not found"). Deleting a return currently works even without `invoicingPaymentsDelete` (old Vendor&Order-Delete gating still applies — SV-7911 not enforced).
- **Gotcha/Unblock:** **A return cannot be deleted on a COMPLETED WO — uncomplete the WO first.** Also, to return a received part the WO must be uncompleted (line status Authorized).
- **Confidence:** High (create + delete both executed, 200/201).

### Cores (core OK / Not-OK)
- **UI path:** WO line → core inspection control (appears on the line).
- **Preconditions:** requires a **core-bearing part that has been RECEIVED and is awaiting core inspection** — the control does not appear on a normal line. Governed by **WO Lines Create & Edit** (covers core OK/Not-OK + line story/history).
- **Gotcha/Unblock:** the core data state could not be seeded in the harness (parts add+receive flow not drivable) — needs manual setup of a received core part.
- **Confidence:** Medium (precondition + gate documented; not driven).

---

## INVOICING / PAYMENTS

### Create an invoice
- **UI path:** WO detail → **Finance** tab → **Create Invoice** button. (After success the app auto-opens a "New Customer Payment" dialog.)
- **API:** `POST /api/invoices/create` → **201** (returns invoice_id; WO status → "Invoiced"). Invoice detail `GET /api/invoices/{id}/details`. Estimate PDF/HTML `POST /api/work-orders/invoices/estimate`.
- **Preconditions (ALL required):** every part **RECEIVED with a real PART NUMBER** (no "Requested", no `(-)`, no badge) **AND** the **Review** step completed **AND** `invoicingPaymentsCreateAndEdit` + `seeFinancialData` (SFD OFF → no Finance tab at all, even with V/E/D).
- **Gotcha/Unblock:** **OVER LIMIT badge blocks nothing** — if Create Invoice does nothing, it's a missing part number or an unclicked Review, not the credit badge. Use a **clean throwaway customer** + a fresh WO taken Approved → Reviewed → Complete.
- **Confidence:** High (created 201 across Foreman/SM/SA/SSA).

### Reverse an invoice
- **⚠️ A PAID INVOICE CANNOT BE REVERSED** — `POST /api/invoices/reverse-invoice` answers **400
  *"Customer transaction cannot be deleted."*** Reverse its payments first, or start from an unpaid
  invoice. (Proven 2026-09-01; the previous entry only recorded the 200 and the 403.)
- **UI path:** WO detail → Finance tab → invoice **three-dot** menu → **Reverse** → Warning ("re-open and undo the invoice") → confirm Reverse. (Part-sales invoice: Part Sales → invoice → reverse.)
- **API:** `POST /api/invoices/reverse-invoice` body `{id}` → **200** (WO reverts "Invoiced" → "Complete", Create Invoice reappears).
- **Preconditions:** WO-invoice reverse is gated by **Work Orders: Delete** (SM has WO Delete → reverse allowed even though `invoicingPaymentsDelete`=OFF). Foreman/Parts Manager without it → menu shows only "Issue Credit" and the endpoint returns **403 "Access denied."**
- **Confidence:** High (executed 200 allowed and 403 blocked, both observed).

### Issue credit
- **UI path:** WO detail → Finance tab → invoice three-dot menu → **Issue Credit** (present even for roles that lack Reverse).
- **API (driven live 2026-09-01, 201):** `POST /api/credit-memos` —
  `{customerAccountId, amount, reason, originKind:"invoice"|"manual", originInvoiceId, originDate,
  lineItems:[{partNumber, description, quantity, sellPrice, restockingFee, taxAmount,
  originatingInvoiceLineId}], refund?:{amount, paymentMethod, memo, externalReference}}`.
  Payload read off the product's own `IssueCreditMemoDialog` chunk, then executed.
- **🔑 `amount` IS IN DOLLARS, NOT CENTS** — and when `lineItems` is present the server derives the
  total from the lines and ignores `amount` entirely. Passing `6084` for a manual credit created a
  **$6,084.00** credit, not $60.84. Two credits differing only in this looked identical in the
  request and were 100× apart in the record.
- **Creditable parts:** `GET /api/part-sales/{id}/list-credit-available-parts` takes the **INVOICE
  id**, not the part-sale id. The part-sale id answers **400 `{"invoiceId":"Not found"}`**, which
  reads like a missing feature and is really a wrong id.
- **The parts-return picker is PART-SALE ONLY** (`PartsReturnPicker` props default
  `invoiceType:"partSale"`); a service work order's credit is a plain amount.
- **Void / cash out:** `POST /api/credit-memos/{id}/void` · `POST /api/credit-memos/{id}/cash-out`.
  Voiding an already-voided credit answers a clean **400** *"Cannot void a credit memo while it is
  in status \"voided\"."* — a refusal, not a failure.
- **⚠️ REVERSING AN INVOICE AUTO-VOIDS ANY CREDIT ISSUED AGAINST IT, AND DELETES THE INVOICE
  RECORD.** Proven 2026-09-01: the credit went *Unapplied → Voided*, its Balance $10.94 → $0.00, and
  the credit document's **Invoice Number column disappeared** (correct per spec S11-R3, which hides
  it when there is no origin invoice). Afterwards `GET /api/invoices/{id}/view` answers 400 *"The
  invoice doesn't exist"*.
- **Confidence:** High (create, render, reverse-origin, re-render and void all executed).

### Import an historical / "imported" work order  🆕 2026-09-01
- **Why it matters:** a session on 2026-08-31 reported invoice import as **not built** on the
  strength of four **guessed** routes all answering 404. It is built. **Four 404s from guessed routes
  are not evidence of absence** — a guessed route and a wrong id 404 identically.
- **API:** `POST /api/imports/work-order-historical`, **multipart, field name `file`** → 200
  `{"duplicatedInvoices":[]}`. A bare POST answers 400 *"file file is missing or invalid"*; wrong
  headers answer *"Invalid file headers provided!"*.
- **The CSV contract is shipped by the product itself** — an inline template literal in the
  `InvoicesDataImport` chunk, downloadable in-app as `invoices_template.csv`. **24 columns; the 10
  marked `*` are required.** Keep the asterisks and the exact column order:
  `*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount`
  · `*Invoice Date` is **MM/DD/YYYY** (an ISO date is read as empty) · `*Item` is one of
  Labor / Part / Shop Supplies / Misc / Sublet / Credit Memo · `*Shop Location` and `*Customer` must
  match existing records by name.
- **Read them back:** `GET /api/work-orders-imported` (list) · `GET /api/work-orders-imported/{id}`.
  They are **NOT** in `GET /api/work-orders` — `imported` is a **synthetic status on a separate
  endpoint** and is absent from `GET /api/work-orders/statuses`. 600 work orders scanned for
  `status == imported` found zero; the separate endpoint had them.
- **Screen:** route `/imported-work-orders/:id`, component `ImportedWorkOrderLeftSection`.
- **Screen navigation, tester-style:** Work Orders list → the **Imported** status chip → click the
  row. (The route also has a guard, `requiredCheck: () => featureFlags().WorkOrders`.)
- **🛑 A PAGE THAT LANDS ON `/` WITH ~148 BODY CHARACTERS IS THE ENVIRONMENT ASLEEP, NOT A ROUTE
  GUARD AND NOT A MISSING SCREEN.** sv8218 auto-sleeps mid-run and every route then serves
  `sleep.qa.shopview.com/?app=sv8218&api=sv8218` reading *"Environment Sleeping — This environment is
  currently paused to save resources… Wake Up"*. On 2026-09-01 this was first misdiagnosed as the
  route guard firing before the feature-flag store loaded; the body text settled it.
  **Assert the landing, and read the body text before diagnosing** — wake with the toggleQaEnv
  lambda (below) and re-run. **The API keeps answering for a while after the SPA host has gone to
  sleep**, so an API-only probe will not warn you.
- **No document route:** an imported work order has no invoice PDF of its own
  (`/api/invoices/preview` rejects its id; `/api/work-orders-imported/{id}/pdf` is 404).
- **Confidence:** High (seeded `ZZAUTOTEST-IMP-001` live and read it back).

### Impersonation, and the inline part row  🆕 2026-09-01 (sv9315)
- **🛑 `quick-login` DOES NOT END IMPERSONATION.** After a `switch-user`, a second `switch-user`
  answers **400 *"You are already impersonating a user. Exit impersonation first."*** even though the
  profile reads Admin and `view_mode` reads `full`. The exit route is **`POST /api/exit-switch-user`**
  (read off the SPA bundle; eight guessed shapes returned 404). **Always exit before switching again,
  and exit before handing the branch back.**
- **A bare `quick-login` at the END of a run strands the next process.** It rotates the shared
  PHPSESSID; if the new value is not written back to the cookie file every later call answers
  **409 "Session has expired."** and looks like dead credentials. Persist the rotated session.
- **Tech View needs no role change.** The **Technician** role already carries `view_mode: 'tech'` and
  lacks `woFullViewMode`; the **Admin** carries `view_mode: 'full'` and holds it. So impersonating a
  Technician *is* Tech View. There is also a dedicated **"Tech View"** role with one holder.
- **⚠️ IMPERSONATE A TECHNICIAN AT THE WORK ORDER'S OWN WORKPLACE.** A technician based elsewhere sees
  a page with no Parts controls at all, which reads exactly like the feature being absent. Compare the
  work order's `workplace_id` (`GET /api/work-orders/view/{id}`) against the staff record's.
- **The inline part row has TWO ids:** **`inline_part_row`** when adding and
  **`inline_part_edit_row`** when editing. Fields: `input_inline_part_description`,
  `select_inline_part_number`, `input_inline_part_quantity` (all views) plus
  `select_inline_part_category`, `input_inline_part_cost`, `input_inline_part_sell_price` (Full View
  only); controls `button_more_options_inline_part` (opens the full New/Edit Part Request modal),
  `button_save_inline_part`, `button_cancel_inline_part`, and `button_pulled_from_bin` for the bin chip.

### Document snapshots and batch invoices  🆕 2026-09-01
- **Snapshot a document as it was at a history event:**
  `POST /api/work-orders/invoices/snapshot {entity_event_id, work_order_id, type:"html"|"pdf"}` →
  200. `entity_event_id` is an event from `GET /api/work-orders/{id}/history` (payload is
  `data.history`, **not** `data.collection`) whose **`snapshotAvailable`** flag is true.
- **🛑 THE `historyEvent` QUERY PARAM ON `/api/invoices/preview` IS NOT THE SNAPSHOT FEATURE.** It
  binds and changes nothing — five different values including a nonsense one return a byte-identical
  document. A pass spent a day on it and filed a defect candidate for a parameter that is simply not
  the mechanism. **The route above is the mechanism.**
- **⚠️ FINDING (2026-09-01): every PRE-EXISTING snapshot on sv8218 returns HTTP 500**; snapshots
  captured the same day return 200. Proven on one work order (S8218-17113: today 200, its own
  18/13/10 August events all 500, html and pdf), so it is the snapshot's age, not the record or the
  document type. Candidate at
  `build/invoice-ui-refresh/build-verify-2026-08-31/DEFECT-CANDIDATE-snapshot-500.md` (not filed).
- **Batch invoice PDF:** `POST /api/invoices/batch-pdf {invoiceIds:[…]}` → 200, one multi-page PDF.
  **NOT `/api/invoices/batch`**, which is a 404 and was mistaken for the feature being absent.
- **Both the batch PDF and the imported-work-order document render the OLD template**, which is
  correct — they are deferred to SV-9193. Tell them apart by label, not by guesswork: **old** =
  `Invoice Date:` (capital D) · `Customer signature:` / `Printed name:` (lower case, colons) ·
  `Software Powered by ShopView` · `Tax` · `Issue date:` (imported). **New** = `Invoice date:` ·
  `Paid date:` when settled · `Customer Signature` / `Printed Name` · `Powered by ShopView` ·
  `GST (5%)` · the `Addresses` and `Summary` group labels.

### 🛑 NEVER WRITE "NOT BUILT" FROM A GUESSED ROUTE — FETCH THE BUNDLE  🆕 2026-09-01
On 2026-08-31 three features were reported as not built because guessed route names answered 404.
**All three were built** — the imported/historical import, the batch invoice PDF, and document
snapshots. **A guessed route and a wrong id 404 identically**, so a 404 from a name you invented is
evidence of nothing.

**The product's own front-end bundle is the authority on which routes exist, and it is one fetch
away.** It is *product source code*, so it is **never a source of expected behaviour (Rule 57)** —
use it only to find the route to drive and the payload shape to send, then observe live.

```
C=$(cat /tmp/qa-cookies/<branch>-live-session.txt)
curl -s -H "Cookie: $C" https://<branch>.qa.shopview.com/ | grep -o 'src="[^"]*\.js"'   # entry chunk
# then fetch it, and follow its "./*.js" references (2-3 rounds reaches the whole graph, ~520 files)
grep -ho '\(get\|post\)(`\?"\?[a-z][^`",)]*<keyword>[^`",)]*' *.js | sort -u
```
It also yields the **exact request payload** (as it did for `credit-memos`,
`create-customer-payment` and the snapshot route) and any **CSV import template** the app ships
inline — which is how the historical-import contract was obtained without guessing a write
(skill 03 §8.2-w).

### Create a customer payment (full payload)  🆕 2026-09-01
- **API:** `POST /api/customer-account/create-customer-payment` → **201 `{id}`**. Payload, read off
  `TransactionsPaymentDialog` and executed:
  `{account_id, payment_date:"YYYY-MM-DD HH:MM:SS", payment_method:<CODE>, reference_number,
  description, transactions:[<the row from list-unpaid-transaction with transaction_payment_amount
  set>], primary_id:<that row's id>, new_credit:0, new_deposit:0, applied_credits:[<a credit row,
  same shape>], applied_deposits:[], ibs_batch_id:null, payment_amount:<number>}`.
- **The transaction row's `id` is the TRANSACTION id; `reference_id` is the invoice id.** Match on
  `reference_id` when you are holding an invoice id.
- **Apply a customer credit** by putting the credit's row in `applied_credits` with
  `payment_method:"APPLIED_CREDIT"` and `payment_amount:0`; the document then shows
  `(Credit) {date} - CM-xxxx`.
- **Unpaid list:** `GET /api/customer-account/list-unpaid-transaction?accountId=…&openOnly=true|false`.
  **`openOnly=true` is the "Open only" chip** — fully applied/paid rows vanish from it, which looks
  like deleted data and is not.
- **⚠️ AN UNCONFIGURED PAYMENT CODE IS REFUSED**, so the "unconfigured code" rendering state cannot
  be created directly: `payment_method:"credit_card"` answers **400 *"Payment method \"credit_card\"
  is not available for this organization."*** **Reach it instead by creating a method, paying with
  it, then deleting the method** — `POST /api/organizations/finance/payment-methods/create
  {name, type:1}` (the server derives `code` from the name, upper-snake) →
  `POST /api/organizations/finance/payment-methods/delete {id}`. That leaves the payment carrying a
  code nothing resolves, and gives a controlled A/B on one payment row.
- **⚠️ `GET /api/organizations/finance/payment-methods` 500s with no query string** (and with a
  pagination one); **`?type=1` works.** A 500 where a 400 belongs — recorded, not filed.

### Create a payment
- **UI path:** WO Finance (after invoicing) → **New Payment** → method (e.g. Cash) → amount → **Make Payment**. Customer Payments also on Customers → customer → Payments tab.
- **API:** `POST /api/customer-account/create-customer-payment` → **201** (returns payment id).
- **Preconditions:** an unpaid invoice; `invoicingPaymentsCreateAndEdit` + SFD. **Add Deposit** action on Finance is gated by Invoicing Create&Edit (absent for view-only).
- **Gotcha/Unblock:** `create-customer-payment` returns **HTTP 500 in some sessions** — process via the UI when the API 500s.
- **Confidence:** High (created 201 as SSA); 500 quirk noted.

### Reverse a payment
- **UI path:** Customers → customer → Payments tab → row delete/trash icon → confirmation ("reverse the payment for all invoices … record preserved for audit") → **Reverse**.
- **API:** `POST /api/customer-account/reverse-customer-payment` → **201** (payment removed from invoice; record kept for audit).
- **Preconditions:** per-payment delete icon is gated by **`invoicingPaymentsDelete`** (NOT Customer Management Delete).
- **Confidence:** High (executed 201).

### Remove a customer transaction (delete payment / void)
- **API:** `POST /api/invoices/remove-customer-transaction` → **403 "Access denied."** without `invoicingPaymentsDelete` (observed for Service Manager).
- **Preconditions:** `invoicingPaymentsDelete`.
- **Confidence:** High (403 gating observed).

### Send to Terminal
- **UI path:** WO Finance → **Send to Terminal** (appears on an **unpaid invoice**; gated by Invoicing Create&Edit).
- **Confidence:** Medium (gate confirmed; needs an existing unpaid invoice to surface it).

---

## CUSTOMERS / VENDORS

### Create / edit / delete a customer
- **UI path:** Top nav → Customers (`/customers`) → **New Customer** (create) → save; open customer → pencil (**Edit Customer** modal) → Save; Edit modal → **Delete** → "Are you sure you want to delete the company?" → confirm.
- **API:** `POST /api/customers/create` → **201** · `POST /api/customers/change` → **200** · `POST /api/customers/delete` (redirects to list; id absent after). List/read `GET /api/customers`.
- **Preconditions:** `customersView` (+ Create&Edit / Delete). New WO dialog can create customers even without `customersCreateAndEdit` (non-gated Add — FE gap).
- **Gotcha/Unblock:** Sales Rep has no customer access — `GET /api/customers` → **403**, `POST /api/customers` → **405** (no write route). Deleting a customer does **NOT** delete its payments (needs Invoicing Delete).
- **Confidence:** High (CRUD executed as Office/Tech).

### Customer AP/AR tabs + sensitive fields gating
- **UI path:** Customers → customer → Edit Customer modal (sensitive fields) / Payments & AR tabs.
- **Gotcha/Unblock:** **`seeApArData` (AP/AR) ON reveals the 7 sensitive customer fields** — Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min & Max, Taxes, PO is required; OFF hides all 7 (basic fields remain). Vendor sensitive fields (credit_term, credit_limit, tax_id) are served unmasked to Office via `GET /api/parts-catalogue/vendor/{id}`.
- **Confidence:** High (7-field toggle confirmed).

### Create a vendor
- See **PARTS → Vendors** (`POST /api/parts-catalogue/add-vendor`). Also `POST /api/vendors` exists but returned 404/405 for roles without vendor access. Staff/user creation: `POST /api/iam/create` → **201** (returns user_id).

---

## NOTES

### Create / edit / delete a note
- **UI path:** WO (or Customer) detail → **Notes** tab → add note; existing note **more_horiz** menu → **Edit note** / **Delete note** / Attach files.
- **API:** `POST /api/note/create` body `{type:'work_order', reference_id:<WO>, content}` → **201** · `POST /api/note/update` → **200** · `POST /api/note/delete` → **200**. List `GET /api/notes`.
- **Who can edit/delete whose note (per updated spec):** **WO View = create/edit ANY note; WO Delete = delete ANY note.** Confirmed: Admin edited a Tech-authored note (`note/update` 200). JSA could create/edit/delete its **own** note (all 200/201); editing others' notes was tested against an admin-authored note.
- **Gotcha/Unblock:** the Quasar rich-text editor resists automation; note create/update still succeed via the endpoint. Story-history opens a panel (not a simple dialog).
- **Confidence:** High (create/update/delete executed).

### View History Logs (WO history + line story)
- **Scope:** **View History Logs governs work-order-level history (the WO Audit Log / History) AND line-level (line story/history) — for WORK ORDERS ONLY. There is NO history log for Part Sales or Purchase Orders. (Confirmed with product owner.)** Do not assert any part-sales or PO history behavior.
- **UI path:** WO detail → History / Audit Log section (WO-level); WO line → line story/history panel (line-level).

---

## ROLES / STAFF / ADMIN

### List roles / read a role
- **UI path:** Settings sidebar → **Roles & Permissions** (`/administration/roles-permissions`).
- **API:** `GET /api/organizations/{org}/roles` (authoritative list) · `GET /api/roles` · `GET /api/roles/{id}`. Org id in CLAUDE.md. Role fields include `default`, `editable`, `deletable`, `usersCount`, `template_id`.
- **Gotcha:** 11 system roles (Admin, Office, Time Clock, Service Manager, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech, Senior Service Advisor, Sales Representative), all `default=true`. Office & Time Clock are non-editable (lock + eye-only → `/{id}/summary`); **Admin is `editable=true`** (pencil present) but all toggles disabled with a "Full administrative access" banner.
- **CONFIRMED (product owner):** Non-editable system roles: ONLY **Office** and **Time Clock** (lock + eye-only, View Permissions only). All other system roles, **INCLUDING Administrator**, are editable (pencil + three-dot Edit). No system role is deletable.
- **CONFIRMED (product owner):** Actions column: standalone **Eye (View Permissions)** icon shows ONLY for **Office** and **Time Clock**; all other roles (Administrator, all other system roles, and any custom roles) have **no eye icon** in Actions — View Permissions is inside the **3-dot menu** (3-dot menu > View Permissions).
- **Confidence:** High.

### Create / edit / delete a custom role
- **UI path (create):** Roles list → **Create custom role** → "Choose a template" modal → pick a template → **Apply** (`/new?template=...`, prefilled) or **Skip** (blank `/new`) → set Role name* + permissions → **Create** ("Role created successfully." toast).
- **UI path (edit):** Roles list → row **pencil** → `/{id}/edit` → change → **Save** → "Confirm Permission Updates" dialog (added/removed lists) → confirm.
- **UI path (delete):** Roles list → row **three-dot** menu → **Delete** (only appears when usersCount=0) → confirm ("Role deleted successfully.").
- **API:** `POST /api/roles` / `PUT /api/roles/{id}` (create/update) · `DELETE /api/roles/{id}` (delete). Similar-role check: `POST /api/check-existing-roles`.
- **Preconditions/Gotchas:** Create is disabled until a Role name + ≥1 permission ("At least one permission is required"). Duplicate name → "Role name already exists in the Organization." Duplicate permission set → "Similar role already exists" confirm dialog. **A role with ≥1 assigned user cannot be deleted** — Delete item is hidden and the editor's Delete button is disabled ("This role is assigned to N user(s). Reassign them…"); reassign users to 0 first. No "Duplicate" action exists. CRUD cascade: checking Delete auto-checks Create&Edit + View; unchecking View clears all (incl. WO Lines C&E/Delete). WO Lines card has **no View column** (inherits WO View); Timesheets card shows only View + Create&Edit (no Delete).
- **CONFIRMED (product owner):** Edit Role > Reset to Template: resets the custom role's permissions to its template defaults; the Save button enables ONLY if the role differed from the template (if it already matches, Save stays disabled). Path: Settings > Roles and Permissions > pencil (edit) > Reset to Template > Save. (Confirmed with product owner.)
- **Confidence:** High (create/edit/delete executed with toasts).

### Assign a role to a staff member
- **UI path:** Settings → Staff → open staff → **Edit Staff Member** modal → Role select (grouped SYSTEM / CUSTOM; eye icon = View Permissions preview) → save.
- **CONFIRMED (product owner):** Edit Staff Member modal (Administration > Staff > open a staff member): an eye icon next to the Role dropdown opens a read-only Permission Summary for the selected role. (Confirmed with product owner.)
- **API:** `POST /api/staff/{id}/change` → **201**. Body: `{first_name,last_name,email,workplace_id,role_id}`.
- **Preconditions/Gotchas:** **Use the EXACT Tech `/change` staff_id `6fb22c1b-...`.** The staff-**list** id **`a7fd0a88-...` 404s on `/change`** — never use it there. Never match by substring/email (a past near-miss changed the wrong user). An invalid `role_id` returns **500** and does **not** persist (Tech stays on prior role).
- **Confidence:** High (executed 201; id distinction proven).

### Create staff / search staff
- **API (create):** `POST /api/iam/create` → **201** (`{message:"created", user_id}`). **Staff search:** `GET /api/staff?search=` **(verify — not evidenced; base `GET /api/staff` list is evidenced)**. Clocked staff `GET /api/staff/clocked`.
- **UI path (search):** Staff page search field ("Search Role" analog on Roles list filters live).
- **Confidence:** High for `iam/create`; (verify) for the search query param.

### Role change forces re-auth (409)
- **Gotcha:** Changing a user's role **immediately invalidates the held session** — the very next request returns **HTTP 409 "Session has expired."** (at +0ms). The new role applies on a **fresh login**; re-login and poll `GET /api/auth/me/fe-permissions` until it reflects the new set. This 409 is **expected**, not an error.
- **Confidence:** High (reproduced 26525).

---

## REPORTS / SCHEDULE / TIMESHEETS / SETTINGS

### Reports + aging reports gating
- **UI path:** Top nav → Reports (`/reports`) → left nav (A/R Aging Summary/Detail/Collection, A/P Aging Summary/Detail/Unpaid Invoices, Sales Tax, Timesheet Activities).
- **API:** e.g. `GET /api/reporting/account-payable/unpaid-invoices-report`. Reports open with no 4xx when `reportsPageAccess` is on.
- **Gotcha:** Per the updated spec **aging reports follow the Reports permission (all-or-nothing), not Manage AP/AR** — but staging still had 26482 aging gated by AP/AR when last checked (spec not fully implemented). Office (with Reports) loaded both A/R and A/P aging with no block.
- **Confidence:** High (reports load confirmed); spec-vs-staging gap noted.

### Schedule / calendar
- **UI path:** Top nav → Schedule (`/schedule`) → full calendar (shows ALL users' appointments).
- **API:** `GET /api/calendar?date=...&end_date=...` (the schedule data endpoint).
- **Preconditions:** `scheduleView`; create/edit needs `scheduleCreateAndEdit`.
- **Gotcha/Unblock:** create/delete an appointment is a **click-to-create/drag interaction on the grid with no persistent button** — the harness could not reliably drive it; needs manual click on a day/resource cell.
- **Confidence:** Medium (view confirmed; create/delete not driven).

### Timesheets
- **UI path:** Reports → **Timesheet Activities** (`/reports/punch-clock-activities`). Wage fields on Staff → Edit Staff Member (needs `settingsWages`). Department clock: `POST /api/technician-tasks/department-clock-in {department_id}` → 201 · `.../department-clock-out {task_id,description}` → 201.
- **Preconditions:** `timesheetsView` (+ reports) to see; Create&Edit to edit. Timesheets card has no Delete column.
- **Gotcha:** virtualized report rows resist automation — edit dialog could not be opened in-harness.
- **Confidence:** Medium (view + department-clock endpoints confirmed).

### Settings sub-toggles
- **UI path:** Roles editor → **Settings** toggle reveals exactly **6** sub-toggles (App Settings, Service, Parts, Finance, Data Import, View/Manage Wages) — **no 7th "Integrations"** sub-toggle. Turning the last enabled sub OFF auto-sets the Settings parent OFF; OFF→ON preserves prior sub selections.
- **Sidebar mapping:** App Settings → Settings + Staff + Roles & Permissions + Locations + Departments + Taxes · Service → Labor Rates + Canned Lines + Asset Types + Inspection Templates · Parts → Pricing + Bin Locations + Categories · Finance → Payment Methods (no QuickBooks) · Data Import → Contacts/Assets/Vendors/Inventory/Invoices · Wages → staff wage fields. Org settings write: `POST /api/organizations/settings/change`.
- **Confidence:** High (toggle counts + sidebar groups observed).

---

## HEADLESS-AUTOMATION TECHNIQUES

When the Quasar/Vue SPA resists normal clicks, escalate in this order (proven across runs):

1. **Selector click** (normal Playwright click).
2. **Fire the element's own click handler / `dispatchEvent`** (dispatch a synthetic `click`/`input`/`change` on the DOM node).
3. **Bounding-box coordinate click** (click the element's screen coordinates).
4. **JS set value + dispatch `input`/`change`** (for inputs the framework won't fill).
5. **Keyboard** entry.
6. **If truly undrivable, call the EXACT endpoint the button calls** — but **only after confirming the FE gate/dialog was reachable** — and disclose that you did so. **Never mark PASS on gate presence alone.**

**Known session quirks to expect and route around:**
- **`create-*` endpoints return HTTP 500 in some sessions:** `work-orders/create`, `work-orders/lines/create`, `customer-account/create-customer-payment`, `work-orders/approvals/create-approval-request`. Reuse existing records or create via the UI.
- **Existing-WO detail bounces to `/workorders`** on mount for all roles — create a fresh WO to land on detail.
- **`/parts/part-sales` route is flaky** (goto never reaches domcontentloaded; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. Retry or hit `POST /api/part-sales` directly.
- Undrivable widgets seen: the Quasar rich-text editor, the inline parts grid, confirmation buttons, custom Customer/Asset dropdowns, virtualized report rows, calendar day/resource cells.
- **Enforcement reality:** the backend enforces only **resource-level View/Edit**. Granular perms (Delete, WO sub-perms, cross-toggles, view_mode) are **FE-only display gates** — expected-denial cases must be verified in the **UI** (endpoint often returns 400 validation, not 403); backend-enforcement cases hit the endpoint and check **403 vs 200/201**.

## FEES & DISCOUNTS (qb env, proven 2026-07-08)

### Env / navigation (qb.qa.shopview.com, API sv7387api.qa.shopview.com)
- **In-SPA navigation that works:** land on any working page, then `page.evaluate(() => { history.pushState({}, '', '/customers/{id}/default-adjustments'); dispatchEvent(new PopStateEvent('popstate')); })` — vue-router follows popstate. Customer detail route is **`/customers/{id}`** (NOT `/customers/view/{id}`); tabs append `/work-orders`, `/default-adjustments`, etc. `/workorders/{id}/lines` deep-links fine on qb (no bounce).
- **A 0-line WO auto-opens the persistent New Line dialog** — close it via its `i:text("close")` X icon (Escape does NOT close Quasar persistent dialogs; click Cancel/X) before touching tabs; or JS-click the tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- Admin templates page: Administration → **FINANCE → Fees & Discounts** → `/administration/adjustment-templates` (FE-gated `settingsFinance`). Customer defaults route FE-gated `customersCreateAndEdit`+`seeApArData`.

### Seed a testable WO end-to-end (proven)
1. `POST /api/customers/create {name}` → company_id (NOTE: API-created customers do NOT inherit auto-apply templates as defaults; UI-created do).
2. `POST /api/contacts/create {company_id, first_name}` → contact_id.
3. `POST /api/vehicles/create {company_id, customer_id:<contact_id>, unit}` (customer_id = CONTACT id).
4. WO via **UI** (raw `work-orders/create` 500s): customer page → Work Orders tab → wait `[data-test-id=button_new_work_order]` ENABLED (disabled while list loads / when customer has no asset) → asset q-select = 2nd `.q-select` in dialog → Save. Payload it sends: `{company_id, customer_id:<contact>, vehicle_id, type:'service', is_vehicle_here:true,…}`.
5. Labor line with KNOWN price: New Line → first `.q-select` → pick canned line **"(L) CVIP - Light Duty Truck - Wheels On"** (fixed **$265.00**) → Save & Close (`POST work-orders/{id}/lines/create-from-canned-line` 201). Shop supplies auto-adds 10.5% ($27.83 on $265).
6. Cleanup: `work-orders/delete {work_order_id}` → `vehicles/delete {vehicle_id, company_id}` → `contacts/delete {customer_id:<contactId>, company_id}` → `customers/delete {company_id}` (contacts+vehicles must go first: "Company with a customer cannot be deleted").

### Adjustments API (full contract, proven)
- Templates: `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`; `DELETE .../{id}`; `GET .../{id}/delete-precondition` → `{affectedCustomerCount}`. Fields `{name,kind:fee|discount|processing_fee, calculationType:flat|pct_labor|pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply, taxable, description}`.
- WO: `POST /api/work-orders/adjustments/add` `{workOrderId,kind,name,calculationType,amount,maxCap,scope:whole_wo|labor_line|part_line,targetId,taxable,templateId,description}`; `/change` accepts ONLY `{adjustmentId,name,amount,maxCap,taxable}` (kind/calc immutable); `/remove {adjustmentId}` → 204. Processing fee: manual add → 400 "cannot be added manually"; change → 409.
- Reads: whole-WO adjustments + `adjustmentsSummary{...,excessCreditAmount}` in `work-orders/view/{id}`; **line-level adjustments live under each line** in `work-orders/lines/{woId}` `collection[].adjustments` (NOT in the WO view).
- Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments` (POST `{templateIds:[…]}`, array OK). Mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
- Line status enum for billability tests: `authorization_required | authorization_declined | authorized | complete` (`work-orders/lines/change-status {line_id,status,workOrderId}`); declined → adjustments resolve $0, authorize → restore.

### Quasar dialog driving (F&D dialogs)
- Selects: click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never click `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index (name first, amount second); template `input[name=adjustment_template_name]` maxlength=100; WO dialog name `input[name=adjustment_name]`.
- Toasts: poll `.q-notification` innerTexts for ~3s.
- Line-row ⋮ menu: hover then **mouse-click ~50px right of `[data-test-id^=button_line_expand_]`** (the button has no test-id; retry loop — flaky), menu = Request part | Add line note | Add Fee/Discount | Save as canned line | Story history | Audit log | Add inspection | Edit labor. Card entries: `[data-test-id^=button_adjustment_actions_{adjustmentId}]` → Edit | Remove.
- Estimate document renders INLINE on the WO **Finance** tab (`link_finance_tab`) — full doc text incl. Adjustments block readable from body innerText.

### qb env cautions (working fixes)
- **Shared env with active concurrent users** — they toggled autoApply and deleted ZZAUTOTEST templates mid-run. Fix: re-read state via API before every assertion; keep test data self-contained; re-verify baselines right before use.
- Tech quick-login on qb is **FLAKY**: 403 in recon/pass B but **200 in the same-day pass A** (which used it to prove whole-WO adjustment add is FE-only enforced while templates admin is BE-403). Retest `{key:'tech'}` at the start of each run before assuming it's blocked.
- `New Work Order` button stays disabled until the customer has ≥1 asset AND the tab list finished loading — poll `isDisabled()`.

---

## Keeping this current

**Standing practice — record ONLY success-proven knowledge (append-only).** After
**every** run, append the approach that actually **WORKED** — the proven navigation
path, action recipe, API endpoint, payload field, and the **concrete unblock that led
to success** ("do X to succeed") — to **this file** (and update `CLAUDE.md` /
`build/TESTING-RUNBOOK.md` if a *durable fact* changed — an id, a rule, a scope, or a
spec change that got implemented). **Do NOT record failed attempts or dead-ends as
recipes.** A "gotcha" belongs here **only** when framed as the working fix (the thing
that unblocked success), never as a log of what didn't work. **Promote a `(verify)`
item to confirmed only after you have actually succeeded with it** — until then it
stays `(verify)`. The goal is that nothing proven is ever lost or re-researched: for
anything already captured here, **reuse the recipe**; only spend effort investigating
**genuinely new** actions, then record the working path. Keep everything
**non-secret** — endpoints, routes, and non-secret ids only; cookies/tokens/keys/ports
never go in the repo.

## CUSTOM ROLES — Phase 2b functional-flow recipes (staging, proven 2026-07-09)

- **Reach a WO detail in headless (bounce fix):** direct-mount `/workorders/{id}/lines` bounces/hangs.
  Land on `/workorders` (list), then in-SPA nav: `page.evaluate(()=>{history.pushState({},'',
  '/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})` → detail loads (no bounce).
  Close the auto New-Line dialog via `.q-dialog i:text("close")`. Finance tab: `[data-test-id=link_finance_tab]`.
- **WO tax (Financial Info card):** `POST /api/work-orders/{id}/tax {id:<taxId>}` sets the WO tax
  (Total recalcs); `POST .../{id}/tax {}` (empty) = the X reset → reverts to default customer/location tax.
- **Taxes CRUD:** `GET /api/taxes` (collection; rates[]); `POST /api/taxes {name,isEnabledLabor,
  isEnabledParts,isEnabledShopSupplies,rates:[{name,percentage}]}` (201, multi-rate OK, sums rateTotal);
  update `POST /api/taxes/{id}` (same body); `DELETE /api/taxes/{id}` (204). **Toggling a tax's
  isEnabledParts / isEnabledShopSupplies directly controls parts / shop-supplies tax on the invoice**
  (proven on the estimate: parts on=$2.82/off=$0.00; shop-supplies on=GST$11.05/off=$10.00).
- **Estimate/invoice doc:** `POST /api/work-orders/invoices/estimate {work_order_id,type:'html',
  issue_date,due_date}` → HTML with tax breakdown. NOTE: it reflects the tax CONFIG + customer/location
  default; the per-WO `/tax` override shows in the Financial Info UI but the estimate used the default.
- **Split a WO:** `POST /api/work-orders/split {work_order_id, ids:[lineIds]}` → 201 `{data:{id:newWO}}`.
  Moves the picked lines to a new WO; history logs `work_order.split_to` (source) + `work_order.split_from`
  (new). WO history: `GET /api/work-orders/{id}/history` → `{data:[{eventType,eventName,...}]}`.
- **Part requests:** add `POST /api/work-orders/part/make-request {line,work_order,description,quantity,
  part_source_type:'inventory'|'vendor',part_number,sell_price,cost,part_category_id}` (201; category
  REQUIRED; categories `GET /api/inventory/categories` {value,label}). Edit `POST .../part/change-request
  {id, description|quantity|part_number|part_source_type}` (200; switching source vendor→inventory locks cost).
- **Edit a line / tech story:** `POST /api/work-orders/lines/change {line_id,work_order_id,tech_story,
  lineName,line_name,labour_type_id,total_labour_time,fixed_price}` (needs lineName). On an **invoiced WO
  the line has `editable=false`** (read-only). (This change endpoint 500s on some lines.)
- **Change customer on WO:** `POST /api/work-orders/change-customer {work_order_id,company_id,
  customer_id:<contactId>}` → the WO vehicle becomes associated with the new company (many-to-many; the
  vehicle must be unlinked `POST /api/vehicles/delete {vehicle_id,company_id}` before that company can be deleted).
- **Return validation:** `POST /api/work-orders/part/make-return-request {part_id,quantity,return_reason}`
  → negative/zero quantity rejected ("value should be >= 0.01").
- **PO item edit before receiving:** `POST /api/inventory/orders/change-item {order_id,item_id,
  part_number,quantity_ordered,price,category,description}` (200). Cost validation is FE-only (BE accepts negative).
- **Vendor CRUD:** `POST /api/parts-catalogue/add-vendor {name,email,tax_id,credit_term,credit_limit}`
  (201; tax_id + credit_term + credit_limit required); `POST .../remove-vendor {id}` (201). Vendor list caps
  at 100 — use `?search=` to find newly-added (Z-name) vendors.
- **Department clock (timesheet):** `POST /api/technician-tasks/department-clock-in {department_id}`
  → 201 `{technician_task_id}`; clock-out `POST .../department-clock-out {task_id,description}` → completes
  with no error (SV clock-out regression fixed). Departments: `GET /api/departments`.
- **IBS:** connect `POST /api/ibs/settings/credentials {clientId,clientSecret,baseUrl}` → isConfigured/
  isActive true (masked id); status `GET /api/ibs/settings`; disconnect `POST /api/ibs/settings/disconnect`.
  **IBS Multi-Tenancy (workplace IBS Location ID field + Remit-To card) requires a feature flag NOT enabled
  on staging** (org flag list: `GET /api/organization/feature-flags?organization_id={org}`).
- **Digital Inspections builder:** DigitalInspections flag ON. New Template makes **no API call on open**
  (deferred). Save Draft = `POST /api/inspection-templates` (create) + `PUT /api/inspection-templates/{id}/draft
  {name,description,isSignatureRequired,sections:[{id?,name,position,fields:[{type:'checkbox',label,position,
  isRequired,config:{labels:{na,fail,pass}}}]}]}`. Publish `POST .../{id}/publish` (blocks: "Template name is
  required" / "At least one section is required"). Delete only never-published (`DELETE`); published → `POST
  .../{id}/archive`. Reorder = re-PUT with new `position` values (persists). Editor reached via Settings sidebar
  → Inspection Templates → New Template (admin pages need sidebar nav, not direct URL).
- **Deposits (flag ON):** WO Finance → Add Deposit → "Create Deposit" modal (Deposit Date [defaults today],
  Payment Method [required], Deposit Amount, Reference Number, Memo; Submit Deposit / Cancel).
- **Issue Credit:** WO invoice ⋮ → Issue Credit → parts-only picker ("Parts to return"; labor not selectable;
  Outcome = Store Credit / Refund). **create-customer-payment 500s in some sessions** (blocks payment/credit submit).
- **Bin count link:** Settings → Bin Locations (`/administration/bins`) → click a row's Inventory-parts count
  → `/parts/inventory?binLocation={bin}` (filtered).
- **qb (SV-7387) env SLEEP/WAKE:** the env auto-sleeps (API + `/api/quick-login` 302 →
  `sleep.qa.shopview.com`). Wake it yourself: `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv`
  body `{"action":"wake","env":"sv7387"}` (lambda answers "sv7387 is waking up."), then poll the API ROOT `https://sv7387api.qa.shopview.com/`
  until 200 (~60s; it passes 503 while booting). Root `/` returning 200 `{"data":[]}` = awake.
- **qb "sustained 500 incident" ROOT CAUSE = poisoned shared PHPSESSID (batch-6 proven):** when every `/api/*`
  request 500s with a requestId but the API root is 200, the backend is fine — the SESSION is corrupt. Fix:
  re-run `POST /api/quick-login {key:'admin'}` **WITHOUT sending the old PHPSESSID** (keep sv_sso_session +
  cf_clearance) → 200 + fresh PHPSESSID → everything 200 again. Diagnostic ladder: no cookies → 401; sso+cf only
  → 409; poisoned PHPSESSID → 500 on everything. **Avoid `POST /api/iam/change-location`** (prime suspect
  trigger in batch-5 AND batch-6; admin default_workplace is already Lethbridge = the QB location).
- **Invoice a WO (qb):** WO must be status `complete` AND have ≥1 completed line. Walk statuses with
  `POST /api/work-orders/change-status {id:<woId>,status:'approved'|'in_progress'|'ready_for_review'|'complete'}`
  (key is `id`, NOT work_order_id), then `POST /api/invoices/create {work_order_id,issue_date,due_date}` → 201
  `{invoice_id,customer_account_id,remaining_balance,…}`; WO becomes `Invoiced`; QB export fires automatically
  (failures land in `GET /api/bookkeeping/unexported-items`; clear own junk with `POST …/unexported-items/{id}/mark-done`).
  Undo with `POST /api/invoices/reverse-invoice {invoice_id}`.
- **WO line creation is BROKEN on qb (2026-07-09/10):** `POST /api/work-orders/lines/create` AND
  `POST /api/work-orders/{id}/lines/create-from-canned-line` 500 on every WO/payload (labour_type/fixed_price
  variants too; `fixed_price:0` and valid payloads alike). Blocks building fresh invoiceable WOs — reuse existing
  complete WOs (e.g. S-15895/S-15894, 1 completed line each) with add→observe→restore deltas.
- **Over-discount floor observables (API):** `work_order.adjustmentsSummary.excessCreditAmount` carries the
  floored-off excess exactly (e.g. discount 1265 on sub 1214.81 → 50.19); `sub_total` floors to "0.00"; a
  NON-taxable over-discount leaves `tax.amountTotal` unchanged (customer still owes tax); a TAXABLE one zeroes it.
  The Add-dialog live preview shows the floor ("New work-order subtotal $0.00 / Tax is recalculated on save")
  but there is NO warn/confirm on save (FDBUG-15).
- **WO Add Fee/Discount dialog (UI automation):** toolbar `button:has(i:text("more_vert"))` → menu item
  "Add Fee/Discount". Dialog selects order: [0]=Apply From Template (readonly combobox — don't fill), [1]=Type
  (Fee/Discount), [2]=Calculation Type. Name = first `input:not([readonly]):not([type=number])`; Amount =
  `input[type=number]`. Submit label = "Add Fee"/"Add Discount".

## FEES & DISCOUNTS — fresh full-VIU pass learnings (qb env, proven 2026-07-10)

- **`POST /api/work-orders/create` now works via raw API on qb (201)** — the old "create-* 500" quirk
  cleared for WO create; **`lines/create` + `create-from-canned-line` still 500 on every payload**
  (a bare invalid payload 400s first at validation — a 400 does NOT mean the bug is fixed; test with
  a VALID `fixed_price` payload). Existing Complete WOs stay the fallback (add→observe→remove→restore).
- **Complete WOs are terminal:** `work-orders/delete` → 400 "Completed work order cannot be deleted"
  AND `change-status` → 400 "Complete work order cannot change its status again" — there is NO
  uncomplete path on qb. Never walk a throwaway WO to Complete; leave it in estimate so it stays deletable.
  Part requests are also locked ("Part requests can`t be modified on completed line") and a line with
  staged parts refuses status changes ("Can`t change status while there are staged parts").
- **`reverse-invoice` payload key is `{id:<invoiceId>}`** (`{invoice_id}` → 400 missing-parameter).
- **Read a WO's customer credit:** `invoices/create` response carries `customer_account_id`; then
  `GET /api/customer-account/list-unpaid-transaction?account_id={customer_account_id}` (param IS
  `account_id`) → `response.unpaid_transactions_count` + `groupByDueDateData.current`. An invoiced
  over-discount shows up as count+2 (invoice + credit) and the credit amount lands negative in
  `current` (proven: excess 117.24 → current −11.63→−119.73 with a 9.14 invoice).
- **QB mapping read/restore:** `GET /api/bookkeeping/integration` returns every settings option with
  its `selected` value (snapshot this BEFORE any settings write; Fee item = key `feeItemId`, Discount
  = `discountItemId`). Writes go `PUT /api/bookkeeping/settings {settings:{...}}` (flat body → 400
  "settings missing"). **Unmapping is NOT possible via API** — `{settings:{feeItemId:null}}` → 500 and
  the mapping stays untouched; the FD-QB-004..008 guard cycle needs a dev/QB-side unmap.
- **Estimate HTML full-text:** the shared `api()` helper truncates non-JSON bodies to 500 chars — for
  `POST /api/work-orders/invoices/estimate` use a direct `fetch` and read `res.text()` (strip tags for
  assertions). The doc's bottom block reads `Subtotal $X / GST (5%) $Y / Total $Z` and 2026-07-10
  matched the API view exactly (adjustments INCLUDED — FDBUG-1 not reproduced, 3rd clean pass).
- **WO shop supplies:** `POST /api/work-orders/change-shop-supplies-charge {work_order_id,
  shop_supplies_charge}` (201) — computes on LABOR, so a parts-only WO stays $0 (can't surface the
  Shop Supplies doc section there).
- **Contacts have NO list endpoint** (`GET /api/contacts*` 404s; the SPA contacts tab makes no list
  call) — `contacts/create` returns `{data:{contact_id}}`: **SAVE that id at creation** or the company
  becomes undeletable ("Company with a customer cannot be deleted").
- **Part sales:** `POST /api/part-sales {company_id}` → 200 `{data:[{id}]}` (ARRAY). Story-11 check
  2026-07-10: the part-sale page still has NO Fees & Discounts column; `adjustments/add` against a
  part-sale id → 400 needs-target (no part-sale adjustment surface). Delete route: `DELETE
  /api/part-sales/{id}` answered 404 yet the sale vanished from the list right after (verify).
- **Template builder (fresh 2026-07-10):** dialog title is now "New Fee / Discount" (matches spec);
  Type options still only Fee|Discount (Story 8 UI missing); 4 calc methods (no legacy % Labor+Parts).
- **Role drift on shared envs is real:** the qb Technician role gained `workOrdersCreateAndEdit` +
  `workOrdersDelete` between 2026-07-09 and -10 (8 perms vs the matrix's 6) — re-read
  `GET /api/auth/me/fe-permissions` at run start and re-derive any per-role matrix before reuse.
- **NEW FDBUG-16 (probe carefully):** `adjustments/add` with an EMPTY name now 201s at the API (was
  400); the UI dialog still blocks with an inline Name-required error — FE-only guard.

## PROVEN: UI-driven WO seeding for reference states (staging, 2026-07-15)
Confirmed end-to-end via boot2+Chromium bridge as Admin (create endpoints are NOT simple REST —
this is the working UI recipe):
1. **Create WO:** navigate `/workorders` → click **New** → in "New Work Order" dialog pick a Customer
   (q-select, first `.q-menu .q-item`) → pick an Asset → click **Save** → a **Confirmation** dialog
   ("customer over credit limit") appears → click **Create** (red). WO id then in URL `/workorders/<id>/lines`.
2. **Add an UNAPPROVED line + part requests:** click **New Line** → in "New Line" modal open the
   "What Are You Doing?" q-select (catalog lookup — NO free text; pick an existing service, e.g.
   "Replace - Brake pot" which carries 2 parts) → LEAVE **"Line Approved" UNCHECKED** → **Save & Close**.
   Result: WO has linesCount=1, statusRequested=2 (2 part-request rows) → **Approve/Decline** shows on
   the WO detail; the **Parts tab** shows editable **Vendor dropdown (Assign Vendor)**, **Part Number
   field (Fix Part #)**, **Core Charge column**. ("Save & Add Part" instead adds a specific part request.)
3. **Delete WO (cleanup):** WO Delete is UI-only (DELETE/POST API 404). On the WO detail open the top
   "⋮" menu → **Delete Work Order** → confirm. Verified removes the WO.
Still needs deeper seeding (build on the above): pick cored part P550848 onto a line (Core OK/Not-OK);
create a PO + delivery via `/parts` (Order Parts/Pick/Receive/Bulk Receive); an invoice in void state
(Invoicing reverse). Tag throwaway data ZZAUTOTEST; clean up after.

## N. REPORT SUITE QA BRANCH sv8582 — reporting API + report-UI recipes (proven 2026-08-03)
First live Report Suite environment. Everything below was observed working; reuse it, do not
re-discover (Rule 27). Secrets stay in `/tmp` — helpers read them at runtime.

### Env + auth
- App `https://sv8582.qa.shopview.com` · API **`https://sv8582api.qa.shopview.com`** (no dot before
  "api", same convention as `sv7301api`). Org = the shared **`d55bc308-e61a-438d-b5f1-c7a73c89d49f`**.
- `POST /api/quick-login {"key":"admin"}` → **200** + a fresh `PHPSESSID`; cookies
  (`sv_sso_session` 64-hex, `PHPSESSID` 32-hex, `cf_clearance`) on `.qa.shopview.com`, `Max-Age=86400`.
- **Run node with `NODE_USE_ENV_PROXY=1`** or plain `fetch` bypasses the egress proxy.
- Helpers: `build/report-suite/viu-2026-08-03/tools/qa8582.mjs` (`login()`/`api()`) and
  `boot8582.mjs` (`boot()` = the boot2 hydration pattern retargeted; also logs every `/api` call the
  SPA makes, which is how these endpoints were found).
- **Build marker:** `curl -s https://sv8582.qa.shopview.com/ | grep app-version` →
  `<meta name="app-version" content="v3.4.1-0ed4433">`. Use it for Rule-49 re-check queues.

### Report routes (all six, live)
`/reports` **redirects to** `/reports/punch-clock-activities` — there is no neutral reports index.
`/reports/sales-by-customer` · `/reports/sales-by-representative` · `/reports/parts-velocity` ·
`/reports/technician-utilization` · `/reports/work-in-progress` · `/reports/inventory-value`.
Nav group headings: LABOR · PERFORMANCE (WIP, TU, SBR) · PARTS (PV, IV) · **SALES (SBC)** ·
FINANCE · ACCOUNTS RECEIVABLE · ACCOUNTS PAYABLE · ACCOUNTING · COMMUNICATIONS.

### Report DATA endpoints
`GET /api/reporting/reports/<slug>?<filters>&pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=`
- SBC/SBR/PV/IV are **paginated**; **TU and WIP are NOT**.
- Date scope: most take `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`;
  **WIP takes `from`/`to` as ISO datetimes** (`from=2026-01-01T00:00:00.000Z&to=…`). A span beyond the
  server limit returns **400**.
- Multi-location scope: `&locations=<uuid>,<uuid>` (comma-separated, URL-encoded).
- Extra per report: SBC `productType=all`; SBR `productType`+`invoiceStatus=all`; PV `type=both`.
- Payload: `{data:{collection:[…], pagination:{…}, totals:{…}}}` — **PV returns NO `totals`**;
  IV also returns `as_of_date`.

### Report EXPORT endpoints (this is the part worth never re-deriving)
`GET /api/reporting/reports/<slug>/export?format=csv|pdf&<the same filters>` plus:
- `&variant=summary|expanded` — **required** for SBC, SBR, TU (else `400 "Invalid export variant.
  Allowed values: summary, expanded."`).
- `&tab=ApprovedNotStarted|ApprovedPartiallyCompleted|Completed|Estimates` — **required for WIP**
  (else `400 "Invalid tab \"\"."`).
- `&columns=<comma-separated keys>` — **required for WIP** (else `400 "At least one column is
  required."`); optional elsewhere, and **omitting it exports every column**.
  **Valid WIP keys:** `wo_number, status, customer, asset, vin, location, advisor, days_open,
  last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining,
  total`. **`invoiced_hours` is NOT accepted** even though the UI offers an Inv. Hrs column.
- Bad `format` → `400 "Invalid export format. Allowed values: csv, pdf."`
- **Over-size guard:** `400 "This report is too large to export. Narrow the date range or filters,
  then try again."` — narrow with `&search=<term>` or a single location to get a file.
- CSV shape: line 1 `"Locations: <name>"` (or `"Locations: All locations"`); IV puts
  `"As of: YYYY-MM-DD"` **above** it. Then the header row, the data rows, and a final `Totals,…` row.
- **The per-row `Location` column appears only when scope spans >1 location**, in the screen's slot —
  except TU, which puts it FIRST in the export and second on screen.
- **WIP export headers rename two columns:** screen `Asset`/`Location` → file **`Unit`/`Branch`**.

### Report UI recipes (Quasar)
- The **export menu** is the `more_horiz` icon button (`aria-label="Export report"`); the **column
  selector** is the `width_normal` icon button next to it (tooltip + aria `Column Selection`).
- The **date-range control** is **`span.date-range-label`** (NOT a `.q-btn` — a `.q-btn` text search
  fails). Click it by coordinate; the popup holds an inline calendar plus presets
  **Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month · Last Month ·
  This Week · Last Week**, a `Range: N days` readout and an **Apply** button. There is **no "Custom"
  or "Today"/"Yesterday"** preset.
- Filter dropdowns are `.q-select` in toolbar order; the **Location** filter is always last and offers
  `All locations` + `Clear all` + one row per accessible workplace.
- **The report grids are VIRTUALISED** — `tbody tr` returns a spacer, so per-cell reads fail. The
  `thead` and the `Totals` row read fine. To read data cells, scroll-and-read or use the data API.
- **Empty export:** the FE short-circuits and shows a toast `Empty export` /
  `Export didn't yield any results` / `Close`, and calls no endpoint.

### Report permission testing (the ONE-permission model, proven both ways)
- The **entire** FE-permission catalogue (`GET /api/fe-permissions`) holds exactly **one** report
  atom: **`reportsPageAccess`**. No per-report atom exists.
- Roles holding it on this org: Admin, Service Manager, Office User, **Sales Representative** (only 8
  atoms — the ideal minimal positive subject), Parts Manager. Without it: Parts Technician, Senior
  Service Advisor, Time Clock User, Technician, Service Advisor, **Foreman** (good negative subject).
- **Impersonate:** `POST /api/switch-user {user_id}` where `user_id` is the staff record's **`id`**
  (not `staff_id`). **`GET /api/staff?limit=300` returns `role_label`, `role_id`, `staff_id`, `id`,
  `is_active`.** **switch-user 403s on inactive users** — filter `is_active === true` **and**
  `confirmed_invitation_on`. Confirm who you are with `GET /api/auth/me/fe-permissions` →
  `template_slug`; `administrator` means the switch did not take.
- **Seed a minimal-permission subject** (Rule 14): `POST /api/staff/{staff_id}/change
  {first_name,last_name,email,role_id,workplace_id,job_title,salary_type,salary,billable,clockable}`
  → **201**. Note `POST /api/organizations/{org}/roles` is **GET-only (405)** on this build, so
  **reassign an existing minimal role instead of creating one**. Always restore and verify.
- **Seed a single-location user** (for the Location-filter question): assign one `workplace_id`; then
  `GET /api/staff/my-workplaces` as them returns exactly one. **Caution:** re-hydrating the same
  browser profile keeps the previous user's persisted **column selection** in localStorage, which can
  fake a Location column — use a fresh profile, and note that `localStorage.clear()` alone breaks SPA
  hydration (the SPA needs the full `user` payload, not just `fe_permissions_wrapper`).

### §N addendum — WIP + Inventory Value recipes (proven 2026-08-04, build v3.4.1-0ed4433)
Everything here was observed working. Reuse it; do not re-derive it (Rule 27).

**READ A PDF EXPORT'S CONTENTS.** `pdftotext -layout <file>.pdf -` works — **poppler-utils 24.02.0 is
already installed** at `/usr/bin/pdftotext`. Use `-layout` so the column order survives. Page count:
`pdfinfo <file>.pdf | grep ^Pages`. (`import pypdf` fails on this container with a
`pyo3_runtime.PanicException` out of `cryptography`; `pdfplumber` is not installed. Do not waste time
on either — `pdftotext` is the route.)

**TOGGLE A COLUMN IN THE Column Selection PANEL (the recipe that actually works).** Click
`[data-testid="button_column_selection"]` by coordinate, then click the **`.q-toggle` INSIDE** the
`.q-item` whose exact `innerText` is the column name — clicking the `.q-item` centre does NOT toggle
it (that is why an earlier pass reported "no change"). Then `Escape` and **re-read `table thead th`**
to confirm: the rendered header row is the only reliable state, because the toggles' `aria-checked`
reads `false` on every item regardless of state. Working script:
`build/report-suite/viu-2026-08-03/batch-wip-iv/tools/probe_colselector.mjs <slug> <ColumnLabel>`.

**DATE-RANGE PRESET, applied.** Click `span.date-range-label`, click the leaf element whose text is
the preset (e.g. `Last 12 Months`), then click the popup's **`Apply`** button, then wait ~9 s. Without
the Apply click the range does not take. The default range leaves 3 of the 4 WIP tabs empty, so widen
first or you will observe an empty report.

**WIP data payload.** `GET /api/reporting/reports/work-in-progress?from=<ISO>&to=<ISO>&locations=…`
→ `{data:{collection:[…]}}` — a FLAT list, **no `totals` and no `summary`**, each row carrying
`tab` (`ApprovedPartiallyCompleted|ApprovedNotStarted|Completed|Estimates`). Row keys: `work_order_id,
number, status, customer, unit_number, vin, location, advisor, start_date, last_activity,
labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total, quoted_hours,
worked_hours, tab`. **Money is INTEGER CENTS** (`15000` = $150.00). There is **no `days_open`** (the
browser derives it from `start_date`) and **no `invoiced_hours`** (Inv. Hrs = `quoted_hours −
worked_hours`, computed in the browser) — which is exactly why the export rejects
`columns=…,invoiced_hours` with `400 Invalid column`. **Span cap = 367 days**: 367 → 200, 368 → `400
{"error":"Date range cannot be over one year."}`. An unrecognised or omitted `locations` falls back to
the active workplace only.

**Inventory Value data payload.** `GET /api/reporting/reports/inventory-value?range=custom&
start_date=&end_date=&locations=…&search=&categories=<uuid>&pagination[…]` →
`{data:{collection:[…], pagination:{rowsNumber}, totals:{qty,total_cost,total_sell,margin,margin_pct},
as_of_date}}`. Row keys: `key, workplace_id, location, part_number, description, category, vendor,
qty, unit_cost, unit_sell, total_cost, total_sell, margin, margin_pct`. **Money is INTEGER CENTS**;
`margin_pct` carries **2 decimals** (the screen renders 1 dp truncating, the exports render 1 dp
rounding — the same row can read `56.0%` on screen and `56.1%` in the file). `totals` is computed
server-side over the FULL filtered set from UNROUNDED values, so a hand sum of displayed cents can
differ by a few cents (6 cents over 5,657 rows) — that is correct.
- **Category filter param is `categories=<uuid>`** (comma-separated for several). The option list is
  `GET /api/inventory/categories?limit=500` → `{data:{collection:[{value,label}]}}` — **`value` is the
  id, not `id`**. Passing a category NAME returns 400; `category` / `category_ids` / `categoryIds` are
  silently ignored. `GET /api/vendors` is **404** on this build — the vendor param was not established;
  drive the Vendor filter through the UI dropdown.
- **The IV export IGNORES `columns=` entirely** — it always emits every column, and a nonsense column
  name is silently accepted. It DOES honour `pagination[sortBy]`/`[descending]`.
- **The IV PDF export TIMES OUT at ~30 s.** `format=pdf` 500s (`"…please try again a bit later
  later."`) on any scope big enough to take >~31 s to render — 200 at 1–578 rows, 500 at 538–9,275
  rows, **non-deterministic at the boundary** (578 rows passed at 25.4 s and failed at 32.2 s). The
  CSV of the identical scope returns in 0.8–2.2 s. Narrow with `&search=<term>` or one location to get
  a PDF. Bisector: `batch-wip-iv/tools/iv_pdf_boundary.mjs`.

**EXPORT FILE NAMES** come back in `Content-Disposition`: `wip-2-report.csv|pdf` and
`inventory-value-report.csv|pdf`. **CSV metadata lines:** WIP line 1 = `"Locations: …"`; IV line 1 =
`"As of: YYYY-MM-DD"` then line 2 = `"Locations: …"`. `"Locations: All locations"` when every
accessible location is selected. **WIP export renames two headers:** screen `Asset`/`Location` → file
`Unit`/`Branch` (confirmed in the extracted PDF text as well as the CSV).

**WORK-ORDER STATUS ENUM.** `GET /api/work-orders/statuses` → `{data:{collection:[{value,label}]}}` =
`estimate/Estimate · approved/Approved · in_progress/`**`In progress`**` · ready_for_review/Review ·
complete/Complete · invoiced/Invoiced · paid/Paid`. **There is no `declined` status.** Note the
lower-case "p" in the In-progress label.

**CREATE / DELETE a work order — the gotcha that leaves strays.**
`POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
→ **201 `{data:{work_order_id:"…"}}`** — the id is `work_order_id`, **NOT `id`**. Reading `.id` returns
`undefined` and the cleanup `POST /api/work-orders/delete {work_order_id}` is silently skipped, leaving
a stray WO in the report. Always read `data.work_order_id ?? data.id`, then delete (201) and re-read
the report to confirm it is gone. On this build `GET /api/canned-lines` is **404**, so the
canned-line line-create recipe is unavailable; and driving a WO to In progress via
`POST /api/work-orders/change` was not achieved (`{id}` → `400 "Work Order ID is missing."`,
`{work_order_id}` → 500) — status transitions go through the UI wizard.

**CREATE an inventory part.** `POST /api/inventory/parts/create` requires
`catalog_part_id, category_id, quantity, cost, tags, bins` (learned by posting `{}` and reading the
validation errors). **`category_id` is mandatory, so a part with NO category cannot exist** — which is
why 0 of 5,657 Inventory Value rows show a "—" Category. `POST /api/inventory/parts` is 405 (GET only).
Check whether a part is a core charge with `GET /api/inventory/parts?search=<pn>` → `is_core` /
`core_charge` (a part merely NAMED "…-CORE" in a "CORE / FEE" category is **not** a core charge).

**SEED A MINIMAL *POSITIVE* PERMISSION SUBJECT (better than creating a fresh staff member).**
`switch-user` 403s on inactive/unconfirmed users, and on this org only Admin, Technician and Foreman
have an active+confirmed holder. So: take an existing active+confirmed holder, **temporarily reassign
their role** to the smallest role that holds the atom you need, impersonate, observe, then **restore
the original `role_id` and verify it**. `GET /api/organizations/{org}/roles` + `GET /api/roles/{id}`
gives each role's permission count; on this org the roles holding `reportsPageAccess` are Service
Manager (36), Office User (25), **Sales Representative (8 — the ideal minimal subject)**, Parts
Manager (31), Admin (42). Executor: `batch-wip-iv/tools/seed2_wo_and_minimal_role.mjs`.

**PRE-COMMIT SECRET GUARD.** `bash build/report-suite/viu-2026-08-03/batch-wip-iv/tools/secret_scan.sh
[paths]` reads the live secret VALUES from `/tmp` at run time and greps the staged folder for each
one; exit 1 = leak. Scope it to genuine secret KEYS only (`sv_sso_session`, `PHPSESSID`,
`cf_clearance`, `token`, `password`, `email`, `user`) — including the `host`/`api` values from
`cookies.json` produces false positives, because the host names are deliberately documented.

---

### §N addendum — PARTS VELOCITY + TECHNICIAN UTILIZATION recipes (proven 2026-08-04, build v3.4.1-0ed4433)

**READ THE PDF. IT IS NOT AN EXTERNAL DEPENDENCY.** `apt-get update -qq && apt-get install -y
poppler-utils` (the first attempt 404s until `apt-get update` runs) then `pdftotext -layout f.pdf
f.txt` reads every report PDF, `pdfinfo f.pdf` gives **Title / Pages / Page size**, and
`pdfimages -list f.pdf` proves whether a logo is embedded. `pip install pypdf` installs but its
import panics on this image's broken system `cryptography` — use poppler.

**EXPORT SIZE BOUNDARIES (three distinct behaviours — do not conflate them).**
- **Over ~10,000 rows → HTTP 400** `"This report is too large to export. Narrow the date range or
  filters, then try again."` Proven exactly: Parts Velocity This Year across **both** locations is
  **10,064** rows and every format is refused; **one** location is 6,219 rows and exports.
- **Under the cap but a big PDF → HTTP 500** while the CSV of the identical scope succeeds.
  Reproduced twice each way: **344 rows / 31 pages succeeds** (byte-identical 308,830 bytes at 37.9 s
  and 55.4 s), **449 rows fails** (35.1 s and 36.0 s). A 55 s success next to a 36 s failure proves it
  is **size-driven, not a wall-clock timeout**. Renderer is `WeasyPrint 69.0`. Same class on the TU
  **Expanded** PDF at This-Year scope (500 after 32.8 s) while its Summary PDF returns in 1.95 s.
- **Empty result → no request at all**: the front end short-circuits with a toast reading
  `Empty export` / `Export didn't yield any results`. Same for an export with zero columns enabled.

**PV export/data facts.** `Content-Disposition` says `velocity-report.csv/.pdf` but the **browser
filename is `parts-velocity-report.csv/.pdf`** — the front end renames it, so assert the browser name.
Omitting `columns=` exports all 20; passing an empty `columns=` also exports all 20. The per-row
`Location` column is auto-inserted whenever scope spans >1 location and sits **after Vendor** (6th) on
screen *and* in both files. CSV line 1 is `"Locations: …"`. PV has **no Totals row and no `totals`
object** — that is correct, not a gap. Export sort: `pagination[sortBy]`/`[descending]` are honoured
in the file, with **nulls first ascending, last descending**.

**TU export facts.** `variant=summary|expanded` is required. Menu ships **FOUR** items
(`Summary (PDF)`, `Summary (CSV)`, `Expanded (PDF)`, `Expanded (CSV)`). Files are
`technician-utilization-summary/-expanded.pdf/.csv`. **Location is FIRST in every export but SECOND on
screen.** Neither CSV nor the Summary PDF contains the Summary row. Rows come out in raw server order,
not A→Z. Money with commas is correctly quoted (`"$7,248.85"`).

**SEED CLOCKED TIME (this is how you make Technician Utilization non-empty).** Impersonate a holder
with `POST /api/switch-user {user_id}` (the staff record's `id`), optionally
`POST /api/iam/change-location {workplace_id, workplace_timezone}` first, then:
- `POST /api/technician-tasks/department-clock-in {department_id}` → **201** `{technician_task_id}`.
  **⚠️ SNAKE_CASE.** `{departmentId}` returns `400 "Department ID is missing."` even though the error
  names the camelCase key. Departments: `GET /api/departments` → use one with `enable_time_clock`.
- `POST /api/technician-tasks/department-clock-out {task_id, description}` → **201**.
- `GET /api/technician-tasks/my-current-task` shows the open record (with a live `seconds`).
- **`DELETE /api/technician-tasks/{id}` → 204** — full clean-up, so seeding costs nothing.
Clock the SAME technician at BOTH workplaces to produce the per-row Location value **`Multiple`**, and
leave one clock OPEN to exercise the load-instant snapshot (Total Hours read 0.06 → 0.13 → 0.76 across
successive loads). Day grouping uses the **active workplace's** time zone: a record created
`2026-08-04 01:24 UTC` lands on the `2026-08-03` day row and shows as `07:25 PM` in Timesheet
Activities. `POST /api/technician-tasks/create` needs `staff_id`+`start_date` (snake_case) but then
500s — use the clock-in/out pair instead.

**TU per-day endpoint (fires ONLY on expand).**
`GET /api/reporting/reports/technician-utilization/{staff_id}/daily?range=custom&start_date=&end_date=&locations=`

**TU deep link.** Total Hours is an anchor to
`/reports/punch-clock-activities?range=custom&startDate=&endDate=&technicianId=` — same tab, technician
and range only, **no location**. A day row narrows `startDate`=`endDate`. The landed page's Totals row
is what you reconcile against.

**REPORT UI HANDLES (`data-test-id` — stop guessing selectors).** `input_report_search`
(placeholder **"Search parts"** — the report's OWN search; `select_global_search` is the Ctrl+K bar and
is the wrong element), `btn_dropdown_pv_export` / `btn_dropdown_tu_export` (aria `Export report`),
`button_column_selection` (aria + tooltip `Column Selection`), `date-range-selector_tu_trigger`,
`clear_report_location_filter`, `clear_tu_technician_filter`, `button_tu_expand_all`
(aria `Expand all technicians`), `button_tu_expand_<staff_id>`
(aria `Expand <name>'s daily breakdown` ⇄ `Collapse …`), `header_tu_{technician,total_hours,wo_hours,
internal_hours,utilization,est_lost_labor}`, `icon_tu_est_lost_labor_info`,
`option_pv_type_{both,inventory,special_order}`. Filter `.q-select` inputs carry
`aria-label="Type|Category|Vendor|Bin|Location|Technician"` — open one by clicking
`input[aria-label="X"]`.

**QUASAR GOTCHAS THAT COST REAL TIME.**
- **Column-selector toggles: click the `.q-toggle` KNOB, not the row label.** Clicking the `.q-item`
  text does nothing, which reads exactly like a broken feature — I nearly logged a false defect.
  With a 20-entry menu also `scrollIntoView({block:'center'})` first, or `boundingBox()` returns a
  clipped/negative box and the click misses.
- **Select options are `[role=option]` with `aria-selected`**, so single-vs-multi select is provable
  from the DOM. **Date-range presets are NOT `.q-item` and NOT `<button>`** — a text match over either
  silently fails (that is why a "Last 12 Months" click appeared to do nothing).
- **Toasts are `.q-notification`; POLL them** every ~250 ms for 10–20 s. A single read at +2 s misses
  them and makes a correct error toast look absent.
- Report grids are virtualised: `tbody tr` includes spacer rows — filter on
  `tr.querySelectorAll('td').length > 5`.
- **Hydration:** set `fe_permissions_wrapper` only. Calling `localStorage.clear()` first breaks
  hydration and every report renders empty.

**SAVED VIEW.** `localStorage['report_view:<slug>']` =
`{version, view:{dateRange, locationIds, sortBy, descending, columns}, extra:{…}}` — PV's extra holds
`type/categoryIds/vendorIds/binIds`, TU's holds `deselectedTechnicianIds` (the **deselected** set, so a
newly appearing technician is selected by default). Delete just the `report_view:` keys to test
first-visit defaults without breaking hydration.

**LABOUR RATES / EST. LOST LABOR.** `GET /api/labour-types` (scoped to your **active** workplace) →
`{id, name, labour_rate, is_default, workplaceId}`. The Est. Lost Labor rate **is** the workplace's
default Labour Type — Heavy Duty's `CP RAIL FLEET RATE` at `145` matches the reported dollars exactly.
There is **no labor-rate field on the Location edit dialog**; the page is `/administration/labour-types`
(nav label "Labor Rates"). **⚠️ The default cannot be cleared:** `POST /api/labour-types/change` accepts
`is_default:false`, returns **201, and does not persist it**; `POST /api/labour-types/set-default`
requires a real `labour_type_id` and rejects null/empty/bogus. And `POST /api/workplaces/delete`
**returns 500 for every id**, so do NOT create a throwaway workplace on a shared org — it cannot be
removed. Consequence: a location with **no** default labor rate is not producible, so the em-dash
Est. Lost Labor family is environment-blocked, not seed-blocked.

**CORE PARTS.** `is_core` is not settable on create. Create the parent, then
`POST /api/inventory/parts/change {…full field set…, core:true, core_charge:25}` → 201, which mints a
**separate linked core-part record** (`core_part_id`). That core record appears in neither
`GET /api/inventory/parts` nor Parts Velocity, while the parent (which merely *carries* a core charge)
does — that is the core exclusion, and `core_charge > 0` is **not** the same thing as "is a core".
`bins` on create/change take `{id, quantity, isDefault}` — `{binLocationId,…}` is rejected.

**PV DATE-RANGE CAP, exactly.** A **366-day difference** is accepted; **367 is refused** with
`400 "Date range cannot exceed 366 days."`; reversed dates give
`400 "Invalid start date provided. Must be less than end date."`

**TURNS/YR USES THE EXCLUSIVE DAY COUNT.** For Jan 1 – Aug 4 the build divides by **215**, not the
spec's inclusive 216: `512/215*365/618 = 1.40648754422` matches the payload exactly (216 would give
1.39998). Reproduced on a second row. Useful as a worked example of settling a calculation dispute
from the payload alone.

### N.2 SBC / SBR report internals + the seeding chain (proven 2026-08-04, build v3.4.1-0ed4433)

**Report UI selectors (Quasar) — do not re-derive.**
- Date range trigger is **`span.date-range-label`** (NOT a `.q-btn`). Presets inside the popup are
  **`div.preset-option`** in **`div.preset-sidebar`** (active one also carries `.active`); the readout
  is **`span.range-indicator`** ("Range: N days"); then an **Apply** `.q-btn`.
  **Exactly NINE presets, and NO "Custom"/"Today"/"Yesterday":** Last 12 Months · This Year · Last Year ·
  This Quarter · Last Quarter · This Month · Last Month · This Week · Last Week. Default is **This Month**,
  which on this org is EMPTY — always widen to Last 12 Months before observing anything.
- Export menu = **`[aria-label="Export report"]`** (`btn_dropdown_<sbc|sbr>_export`), exactly four items:
  `Download Summary (PDF)` · `Download Expanded View (PDF)` · `Download Summary (CSV)` · `Download Expanded View (CSV)`.
  **No Print control exists on any report page.**
- Column selector = **`[aria-label="Column Selection"]`** (`button_column_selection`). **The menu ROW is
  NOT clickable** — the control is the **`q-toggle` `role="switch"` `data-test-id="toggle_column_<key>"`**
  beside the label. Clicking the row centre does nothing and reads as "the selector is broken"; clicking
  the toggle removes the column correctly. (Cost an hour once — don't repeat it.)
- Grand totals row = **`tbody tr.report-totals-row`**, label `Totals`. Row classes: `sbc-row--customer`
  / `sbc-row--asset` / `sbc-row--invoice`, `sbr-row--rep` / `sbr-row--invoice`.
- Expand-all is a header `.q-btn` with aria-label **"Expand all customers"** / **"Expand all representatives"**.
- Entity-filter menus have a real search input (`placeholder="Search customers"`) — you must **click the
  input inside the `.q-menu`** before typing, or the keystrokes go nowhere and it looks like search is broken.
- Filter state persists in **`localStorage['report_view:<slug>']`**; the **URL carries no filter state**.

**Report data + drill-down endpoints.**
- `GET /api/reporting/reports/sales-by-customer/{customerId}/assets?<filters>` then
  `.../assets/vehicle%3A{vehicleId}/invoices?<filters>` — SBC is a 3-level tree, loaded on demand.
- `GET /api/reporting/reports/sales-by-representative/{repKey}/invoices?<filters>`; the **Unassigned
  bucket's key is `00000000-0000-0000-0000-000000000000`**.
- **`showUnassigned=1`** is the Show Unassigned parameter (`show_unassigned`/`showUnassigned=true` also work;
  `includeUnassigned`/`unassigned` do NOT). It is the cheapest way to get a big SBR dataset without seeding.
- `productType=all|parts|service`; `invoiceStatus=all|paid|partially_paid|unpaid`; `customers=<uuid>`.
- A **span beyond ~2 years returns 400** — use `start_date` within 12 months for real data.
- Money is integer **CENTS** in every payload.

**Sales reps.**
- `GET /api/sales-reps` → `[{id (= the staff_id), name}]` — this is what the **work-order** selector uses.
- A staff member becomes selectable by setting **`is_sales_rep`** via
  `POST /api/staff/{staff_id}/change` (echo the whole record; **`workplace_id` must be non-null** or it
  400s "Missing required parameter").
- Assign on a WO: `POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id}` → 201.
  **⚠️ Returns 201 but SILENTLY NO-OPS for a work order in another workplace** — switch first with
  `POST /api/iam/change-location {workplace_id, workplace_timezone}`.
- The **customer's** rep is a different mechanism: `POST /api/customers/change` stores
  **`sales_rep_first_name` / `sales_rep_last_name` as STRINGS** (no `sales_rep_id`; sending one → 500), and
  its picker offers **all staff including inactive**, unlike the WO selector.
- **The report reads a SNAPSHOT taken at invoice creation** (SBR S19-R6/S19-N2): changing a WO's rep after
  invoicing does NOT move the invoice. So **a new invoice is the only way to create a new rep row.**

**The invoiced-work-order chain (each step's exact gotcha).**
1. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
   → 201; the response key is **`work_order_id`**, NOT `id` (getting this wrong silently strands work orders).
2. `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:'authorized'}` → 201
   `{line_id}`. Canned lines: `GET /api/work-orders/canned-lines` (filter to `fixed_price` set + your
   `workplace_id`). **The generic `POST /api/work-orders/lines/create` returns 500** once validation passes.
3. `POST /api/work-orders/change-mileage {work_order_id, mileage:'123456'}` → 201.
   **`mileage` MUST be a STRING** — a number returns 500. Without it, line-complete 400s
   "Line can not be completed without a Work Order mileage".
4. `POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}` → 201. Required before
   completing a line ("Line can not be completed without a tech story"). **`/lines/change` returns 500.**
5. `POST /api/work-orders/lines/change-status {line_id, status:'complete'}` → 200.
6. `POST /api/work-orders/change-status {id, status:'complete'}` → 201. **The field is `id`, not `work_order_id`.**
7. `POST /api/invoices/create {work_order_id}` → **201** — **but ONLY if the work order carries a
   CONTACT PERSON.** Without one it returns **500**. See the next block: this is the single most
   expensive thing this chain got wrong.

**⚠️ THE CONTACT IS MANDATORY FOR INVOICING — the correction that cost us SV-8821 (proven 2026-08-04,
build `v3.4.1-0ed4433`).** The earlier version of this recipe said `invoices/create` "returns 500 on
this branch" and that the UI's Create Invoice failed too. **Both statements were wrong**, and they were
wrong because the chain above never set a contact.

- **`POST /api/work-orders/create` does NOT set a contact unless you pass one.** Add
  **`customer_id: <contactId>`** to the create payload — on this build **`company_id` is the business
  and `customer_id` is the CONTACT PERSON**, which is easy to misread as the same thing.
- **Get a contact id from `GET /api/customers/view/{companyId}` → `data.company.contacts[]`.**
  (`/api/customers/{id}/contacts` is **404**; not every company has one — pick a company where
  `contacts_count > 0`.)
- **On an existing work order:** `POST /api/work-orders/change-contact
  {work_order_id, vehicle_id, contact_id, update_vehicle:true}` → **200**. This is what the UI sends;
  `update_vehicle:true` writes the contact onto the **asset** permanently (the UI asks *"Would you like
  to change to the new contact for this asset permanently?"* → **YES**).
- **With a contact: `invoices/create` → 201** (work order status → **Invoiced**) and
  `POST /api/work-orders/invoices/estimate` → **200**. **Without: both → 500** with the generic
  `"An error occurred…"` body. Proven with everything else held constant (same customer, same asset,
  same canned line, identical `sub_total 386.75` / `total_cost 406.09`).
- **The bare `{work_order_id}` body is fine** — the UI sends a much larger body, but the minimal one
  returns 201 once a contact exists, so **do not chase the payload shape.**
- **UI-side gate (useful for any invoicing test):** with no contact the work order's **Finance tab is
  disabled** (`aria-disabled="true"`, tooltip **"Please select a contact for the asset"**) and **no
  Create Invoice button exists in the DOM**. The **Create Work Order** dialog has only *Customer ·
  Asset · Asset Here?* — **no Contact field** — so every freshly created work order starts in that
  state. The **New Asset** dialog makes **`Contact *`** required, which is why the tooltip says
  "for the asset".

**⚠️ Canned lines that bring PARTS cannot reach Complete without receiving them first.**
`GET /api/work-orders/canned-lines` on this branch returns **79** lines (all at Heavy Duty): **11**
with `fixed_price` (Fixed labour), **3** with `fixed_line_total`, **65** hourly via `labour_rate`;
**37 pull catalogue parts**. For a parts-bearing line,
`POST /api/work-orders/lines/change-status {status:'complete'}` → **400 ``"Line can`t be completed with
unfulfilled part requests."``**, so the work order never completes and `invoices/create` correctly
answers **400 `"Work order is not complete."`**. **Pick a `total_parts === 0` canned line** for any
seed that only needs a completed, priced line — filtering on `fixed_price` (as the original script did)
narrows you to 11 lines for no reason and hides the parts distinction that actually matters.
Enumerator: `build/report-suite/defect-pack-2026-08-04/repro-sv8821/tools/enumerate_canned.mjs`.

**Deleting seeded work orders.** A Complete/Invoiced WO cannot be deleted — first
`POST /api/work-orders/change-status {id, status:'estimate'}`, then
`POST /api/work-orders/delete {work_order_id}`. **⚠️ A missing work order answers
`400 {"workOrderId":"Not found"}`, NOT 404** — a cleanup verifier checking for 404 will wrongly report
everything still present.

**Reading PDF exports (the "PDF is an external dependency" excuse is wrong).**
`pip install pypdf` — and if it fails to import with `ModuleNotFoundError: _cffi_backend`, `pip install cffi`
repairs the broken system `cryptography` module. `apt-get install poppler-utils` 404s on this image, and is
unnecessary. Extractor: `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/extract_pdf.py`.

---

## §N — Report Suite QA branch `sv8582`: the ONE-LOGIN session recipe (proven 2026-08-04)

**The trap this exists to stop.** `POST /api/quick-login` is **stateful on the shared `PHPSESSID` and
rotates it on every call.** So calling it a second time **invalidates the session the first call gave
you**, and a worker that "re-logs-in to be safe" locks itself out. A previous worker burned its session
exactly this way. Symptom: `HTTP 409 {"errors":[{"error":"Session has expired."}]}` on every read.

**Also true and worth knowing:** a **raw-cookie** read (the cookies as supplied, before any
quick-login) returns **409 `Session has expired.`** — that is **normal, not a dead session.** The
cookies gate quick-login; they are not themselves an API session. **Do not conclude the session is dead
from a 409 on a raw-cookie read — try quick-login once.**

**The recipe: capture EVERYTHING you will need in ONE login.**

```python
# ONE call. Persist BOTH the rotated cookie AND the SPA user payload.
r = POST https://sv8582api.qa.shopview.com/api/quick-login  {"key":"admin"}
    headers: Cookie: sv_sso_session=…; PHPSESSID=…; cf_clearance=…
             Origin/Referer: https://sv8582.qa.shopview.com
new_phpsessid = the PHPSESSID in the response's Set-Cookie      # REPLACE the old one
userobj       = {"data": <the whole response .data payload>}     # token + role + details
# write both to /tmp; never call quick-login again this run
```

**For Chromium/Playwright hydration the `user` object shape matters exactly:** `localStorage.user` must
be `{"data": <the quick-login data payload>}` — **the whole payload**, not a hand-built
`{token, ...profile}`. Getting it wrong renders the **login page** with no error. Also set
`fe_permissions_wrapper` (from `GET /api/auth/me/fe-permissions` → `.data`) and
`token` (`.data.token`).

**In-SPA route changes: use a FULL `page.goto()`, not `pushState`.** `history.pushState` +
`popstate` leaves the app on `/reports/punch-clock-activities` (its default) — every report then renders
the punch-clock table and you get six identical, wrong captures. `page.goto(APP + '/reports/<slug>')`
plus a ~11 s settle works. Reusable: `build/report-suite/recheck-2026-08-04/tools/boot.mjs`.

### Report endpoints (all `GET`)

| Purpose | Path |
|---|---|
| Report data | `/api/reporting/reports/<slug>?<params>` |
| Export | `/api/reporting/reports/<slug>/export?format=csv\|pdf&<params>` |

Slugs: `sales-by-customer` · `sales-by-representative` · `parts-velocity` ·
`technician-utilization` · `work-in-progress` · `inventory-value`.

**Per-report parameter shapes — they are NOT uniform:**
- most: `range=this_year|last_year|this_month|last_month|this_quarter|last_quarter|this_week`
  **or** `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`. **`range=last_12_months` → HTTP 400.**
- **Work In Progress is different** — it takes `from=<ISO>&to=<ISO>&tab=<Tab>` and **requires**
  `columns=` on export (`At least one column is required.`). Tabs:
  `ApprovedNotStarted` · `ApprovedPartiallyCompleted` · `Completed` · `Estimates`.
- SBC/SBR/TU exports take `variant=summary|expanded`; SBC/SBR also `productType`, SBR `invoiceStatus`.
- Location scope: `&locations=<uuid>[,<uuid>]`.
- Paging: `pagination[page]=1&pagination[rowsPerPage]=500`.

**Field-name traps that cost real time:**
- Work In Progress uses **`number`** (not `wo_number`) and **`labor_earned` / `parts_earned` /
  `labor_remaining` / `parts_remaining`** (not `earned_labor` …). Wrong names silently yield
  "mismatches" that are your own.
- **Money is integer cents** in the API. The CSV writes negatives as **`-$33.73`** — minus **outside**
  the `$`. Formatting them as `$-33.73` produces phantom mismatches.

**Export file shape (as of `v3.4.1-3d03023`):** a UTF-8 BOM, then metadata lines, then the header row.
`Date Range:` is line 1 on **all six**; Inventory Value adds `As of:` so its header row is **line 4**,
everyone else's is line 3. **Do not hard-code the header's line number — find it.**

**Validation messages (all HTTP 400, verbatim):** `Invalid export format. Allowed values: csv, pdf.` ·
`Invalid export variant. Allowed values: summary, expanded.` · `Invalid tab "zzz".` ·
`At least one column is required.` · `Invalid column "invoiced_hours".` ·
`Selected date range is invalid.`

**`format=pdf` 500s at whole-list scope** (SV-8818) after 30–45 s and succeeds when narrowed — budget
for the timeout, and give PDF probes ≥ 60 s.

**Transport:** the egress proxy occasionally resets the connection mid-run
(`ConnectionResetError [Errno 104]`). **Retry with a short backoff** rather than treating it as a dead
session — 4 tries with a 3 s pause cleared every occurrence.

## §N.1 — `gen_import.py` blanks the id-map C-ids (Report Suite too)

Running `build/report-suite/gen_import.py` **blanked all 469 C-ids** in
`build/report-suite/testrail-id-map.csv`. Same gotcha already recorded for Filters and Schedule.
**Fix: `git checkout -- build/report-suite/testrail-id-map.csv` after any regeneration, then verify
`0 blanks`.** The import file itself is fine.


---

## §O — FILTERS QA BRANCH `sv8785`: the filter-bar recipes (proven 2026-08-04)

**Hosts.** App `https://sv8785.qa.shopview.com` · API **`https://sv8785api.qa.shopview.com`** —
**VERIFIED live** (this closes the §B note that called it inferred; the `sv<epic>api` pattern is now
proven on two of three branches). Cookies `/tmp/filters-viu/cookies.json`. **Build marker:**
`curl -s https://sv8785.qa.shopview.com/ | grep app-version` → `v3.4.2-4f8211c` (2026-08-04),
**`v3.4.2-d00239b`** (2026-08-05 — **the branch redeploys overnight; read the marker EVERY session
before trusting any prior verdict**, Rule 49). Read it with headers in one shot:
`curl -sS -D- -o /tmp/idx.html https://sv8785.qa.shopview.com/index.html | grep -iE 'last-modified|etag'`
— `last-modified` + `etag` corroborate the version string and are what prove a deploy happened.

**The same session survives a redeploy.** `/tmp/filters-viu/cookies.json` + the stored `PHPSESSID`
still authenticated the day after the deploy — `POST /api/quick-login {"key":"admin"}` → **HTTP 200**
on the first try. So a deploy invalidates *verdicts*, not necessarily *credentials*.

**Navigation gotcha — never use `waitUntil:'networkidle'` on this SPA.** It never goes idle and the
`goto` times out at 90 s. Use the established pattern from `tools/h.mjs`:
`goto(..., {waitUntil:'domcontentloaded', timeout:90000})` then `waitForTimeout(12000)`.

**Session.** The §N one-login rule applies unchanged: **call `POST /api/quick-login {"key":"admin"}`
exactly ONCE**, keep the rotated `PHPSESSID`, and never call it again in the run. A raw-cookie read
returning `409 Session has expired.` before that is normal, not a dead session. Boot helper:
`build/filters/viu-2026-08-04/tools/boot.mjs` (Chromium straight through `$HTTPS_PROXY` with
`--ignore-certificate-errors` — **no MITM bridge is needed**).

### THE FILTER-BAR TEST-ID MAP — never re-derive these by reading the DOM again

Every control in this feature carries a `data-test-id`. Selectors, not guesses:

| Control | `data-test-id` |
|---|---|
| collapse / expand toggle (`filter_list` icon) | `toggle_filter_bar` |
| the five chips | `filter_chip_status` · `filter_chip_company_id` · `filter_chip_tech_assigned_id` · `filter_chip_service_advisor_id` · `filter_chip_vehicleHere` |
| mobile combined chip | `filter_chip_all_filters` |
| a Status option | `filter_option_status_<value>` — **note `Review` is `ready_for_review`** |
| a person / customer option | `filter_option_<field>_<uuid>` |
| Asset on Site options | `filter_option_vehicleHere_1` (Yes) · `filter_option_vehicleHere_0` (No) |
| in-dropdown search box | `filter_search_<field>` |
| Clear Selection | `filter_clear_selection_<field>` |
| a selected-customer tag | `filter_tag_company_id_<uuid>` |
| toolbar Clear Filters | `clear_filters` |
| Clear Filters inside the empty state | `empty_state_clear_filters` |
| page search (collapsed / expanded / clear) | `page_search_toggle` · `page_search_input` · `page_search_clear` |
| mobile search icon (top header, NOT the action row) | `button_open_mobile_search` |
| mobile All Filters footer button | `apply_filters` |
| Back To My Saved Filters | `back_to_saved_filters` |
| column selector · primary CTA | `button_column_selection` · `button_new_work_order` |

**Only TWO dropdown components exist app-wide** — worth knowing before writing any selector:
`.filter-option-list-panel` (checkbox list; options are `[role=checkbox][aria-label][aria-checked]`)
and `.filter-search-list-panel` (search box + `[role=listitem]` rows + a `.filter-search-list-panel__tags`
strip of removable `.q-chip`s). Mobile reuses both inside `.mobile-filter-sheet__body`;
the combined sheet adds `.mobile-all-filters-sheet__footer`.

### The three contracts

- **List request:** `GET /api/work-orders?pagination[rowsPerPage]=..&pagination[page]=..&pagination[sortBy]=..&pagination[descending]=..&filters[N][field]=<status|company_id|tech_assigned_id|service_advisor_id|vehicleHere>&filters[N][value]=<v>&search=<q>&showMyWorkOrders=<0|1>`.
  Repeat `filters[N]` with the **same field** for OR; **different fields AND together**.
  A bad `field` → **400**; a bad `value` → **200 with 0 rows**; a bad `vehicleHere` value → **200 UNFILTERED**.
- **Saved state:** `GET`/`PUT /api/users/me/preferences/work-orders-list`, value =
  `{tab, search, sortBy, descending, columns{...}, filters{<field>:[values]}, collapsed}`.
  **⚠️ BUILD-DEPENDENT: `search` is GONE from this payload as of `v3.4.2-d00239b` (2026-08-05).**
  On `v3.4.2-4f8211c` typing in the page search wrote `"search":"<term>"` here and it came back on a
  later visit (that was defect SV-8844); on `d00239b` **no `search` key is written at all** — before
  typing, after typing, or after clearing — so the page search is now session-only. Verified live:
  `build/filters/ruling-2026-08-05/evidence/recheck3.json`. **This is the cleanest probe for that
  behaviour — read the preference rather than trying to infer it from the screen.**
  A never-saved key returns **200 with `value: null`**; a path-traversal key returns a clean **404**.
  **`PUT` this to reset a branch to a known state** — far faster and more reliable than clicking
  Clear Filters, and it is how to stop filter state leaking between runs.
- **URL:** `?status=<v>` (repeatable) `&company_id=<uuid>` (repeatable) `&tech_assigned_id=` `&service_advisor_id=` `&vehicleHere=<1|0>` `&search=<q>` `&tab=<all|complete|my>`. **There is NO `tab` param on the Estimates tab** — a shared Estimates link does not carry its tab.

### Three traps that cost real time

1. **Filter state PERSISTS SERVER-SIDE across browser contexts**, so a fresh Chromium does **not**
   give you a clean page. **`PUT` the preferences payload before each run** or your results carry
   over from the last one. (This is also how the persistence requirement was verified.)
2. **A dropdown closes the moment you tick one option** (SV-8824), so a `click option, click option`
   sequence times out on the second. Re-open the chip between ticks — the helper
   `tick(page, testid, chipName)` in `viu-2026-08-04/tools/h.mjs` does it automatically.
3. **On a phone the list renders as CARDS, not `<tbody><tr>`** — row-counting selectors silently
   return 0 (or double-count nested card elements). Count distinct work-order numbers from
   `document.body.innerText` instead.

### On-screen labels — the build differs from the spec in eight places

Build wins for test wording (Rule 9): **`Asset on Site`** (not "on site") · **`Clear Selection`**
and **`Clear Filters`** (capital second word) · in-dropdown placeholder is plain **`Search`** (not
"Search customer"/"Search technician") · statuses read **`In progress`** (lowercase p) ·
**`Create Work Order`** (the spec says "New Work Order") · **`Back To My Saved Filters`** (the spec
says "Back to my view") · page-search placeholder **`Type to search`** · empty state
**`No work orders match your filters`**.

## §P — SCHEDULE QA BRANCH `sv8685`: API shapes that cost real time (proven live 2026-08-06, build `v3.5-7ec992f`)

**Session handling for this branch is §A's five traps plus §N's one-login rule — read those first.**
App `https://sv8685.qa.shopview.com` · API `https://sv8685api.qa.shopview.com` (now **verified**, not
inferred). Build marker: `curl -sS -D- -o /tmp/idx.html https://sv8685.qa.shopview.com/index.html`
then read `app-version` + `last-modified` + `etag`, and hash `index.html` — this branch redeployed
**four times in two days**, so read it at the start AND the end of every pass.

- **`GET /api/schedule/board?from=<ISO instant>&to=<ISO instant>` REJECTS A RANGE LONGER THAN 62 DAYS.**
  A **bare date is also rejected** — it wants full ISO instants. So a "the board is broken" reading is
  usually a range that is too wide or a date that is not an instant.
- **A `PATCH` CARRYING ONLY `note` IS REFUSED `400 "The request changes nothing."` FOR *ANY* ID** — real
  or invented. **Consequence: you cannot use a note-only PATCH to probe whether an id exists**, and a 400
  here says nothing about the record. Send at least one substantive field.
- **`/api/staff` ROWS CARRY BOTH `id` AND `staff_id`, AND THE WORKING-HOURS ENDPOINT WANTS `staff_id`.**
  Using `id` **404s for everybody**, which reads exactly like a **total service outage** rather than a
  wrong key. (`GET`/`PUT /api/staff/<staff_id>/working-hours`.) Pair this with §I's
  `scrollIntoViewIfNeeded()` note — between them they account for both halves of the false
  "the working-hours service is broken" report of 2026-08-06.
- **Series create:** `POST /api/schedule/shifts {workOrderId, lineIds[], staffId, startDate, startTime,
  spreadMode:'single'|'series', totalMinutes, perDayMinutes, isAllDay}` → **201**. `spreadMode:'multi'`
  is **rejected**. A 4800-minute series at 480/day materialises as **10 shifts**.
- **⚠️ CLICK-TO-ARM (the keyboard/click alternative to dragging) WAS REMOVED between `v3.5-be42149` and
  `v3.5-7ec992f`** — filed **SV-8957**. It had been `button_sidebar_arm_<woId>` with `aria-pressed`.
  **Practical consequence for tooling: with the click route gone, drag-dependent scenarios cannot be
  driven headlessly at all** — 7 cases went to `HOLD` for exactly this reason. If it is restored, use it.

## §T — AN AUTOMATED KEYBOARD SWEEP CAN CLOCK YOU IN, AND IT CHANGES THE WORK ORDER'S STATUS (happened 2026-09-01, sv9315)

**A Tab/Enter sweep left the quick-login Admin clocked in to a work order for about ten minutes, and
moved that work order to In Progress.** Found only because the masthead in an unrelated screenshot
read `stop_circle 00:04:30 S-15888`.

- The masthead's `clock_in_button` is reachable by Tab like anything else, and Enter activates it.
  Tab-order probes and any `keyboard.press('Enter')` after a focus walk can hit it.
- Proof it was mine, not a real user's: `GET /api/technician-tasks/my-current-task` returned a task
  with `start_date` inside the probing window, `end_date: null`, and `staff_id` = the Admin.
- **Clock out with `POST /api/technician-tasks/check-out` and the body `{"task_id": "<id>"}`.**
  `{"id": …}` and `{"technician_task_id": …}` both answer **400 "Task not found for the given
  technician ID."** — only `task_id` works. Confirm with `my-current-task` returning an empty array.
- **The work order stays at In Progress.** A clock-in advances it, and clocking out does not put it
  back. Its prior status cannot be recovered from `GET /api/work-orders` (that list's cursor wraps —
  §S), so **do not guess a status and write it: report the change.**

**PREVENTION, and it is cheap:** before a keyboard sweep, scope it. Focus the element you mean to
start from, bound the number of presses, and **assert that focus is still inside the row/dialog under
test before sending Enter**. A sweep that can reach the masthead can reach anything in it.

## §S — LIST ENDPOINTS DO NOT ALL TAKE THE SAME PAGING PARAMETERS, AND THE WRONG ONE IS SILENT (measured live 2026-09-01, sv9315 `v26.35.6-598cc8a`)

**This produced a false "the data state does not exist" that was one message away from being handed
to the QA lead as a blocker.** Three list endpoints, three different paging shapes, and none of them
errors on a parameter it does not understand — it just returns the first page:

| Endpoint | What actually works | What is SILENTLY IGNORED | What it cost |
|---|---|---|---|
| `GET /api/inventory/parts` | **`pagination[rowsPerPage]` and `pagination[page]`** — the shape the SPA's own `parts/fetchInventory` sends | `limit`, `rowsPerPage`, `page`, `per_page` | Read **100 of 6,879** parts and concluded that no part was held in more than one bin. **Nine test cases were written up as blocked on a data state that was there all along** — including a part in **four** bins (`S31S-950`), one with an already-negative bin (`TP-12-1013-CH`) and one with no prices (`6050-P`). |
| `GET /api/work-orders` | `limit` + `page` | — but **the cursor wraps**: page 30 returns page 1's rows again, so a naive loop "found" 3,000 work orders that were 500 repeated six times | A status survey with a six-times-inflated denominator |
| `GET /api/work-orders/part/list-requests` | nothing useful | **every** filter — `work_order_id`, `workOrderId`, `work_order`, `filter[work_order_id]` all return the same first 100 rows from across the estate | Two probes matched nothing and silently tested nothing. **Filter client-side on `work_order_id`.** |

**THE RULE: before concluding that a record or a data state does not exist, PROVE THE PAGING WORKED.**
Three checks, one minute:

1. **Read the SPA's own call.** `grep` the bundle for the action name (`fetchInventory`,
   `fetchWorkOrders`) and copy the parameter shape it sends. The client is the specification.
2. **Compare the response's own `pagination` block with what you asked for.** Asking
   `rowsPerPage=500` and being told `"rowsPerPage": 100` is the endpoint telling you it ignored you.
3. **De-duplicate by id and stop when a page adds nothing new.** Never trust a `total`, and never
   assume page N+1 differs from page N.

**And the honesty consequence:** *"this data state does not exist on the branch"* is a claim about the
branch and needs the same standard as any other finding (Rule 12). **Say how much of the set you
actually read** — "100 of 6,879" and "6,879 of 6,879" are different sentences.

## §Q — REPORT SUITE `sv8582`: Work In Progress + Quasar recipes (proven live 2026-08-06, build `v3.5-f77875c`)

**WIP EXPORT NEEDS `columns=` — WITHOUT IT YOU GET A 400 THAT LOOKS LIKE A DEFECT.**
`GET /api/reporting/reports/work-in-progress/export` returns
**HTTP 400 `{"errors":[{"error":"At least one column is required."}]}`** if `columns` is missing. The real
shape, taken off the product's own download menu with a request listener rather than guessed:
```
…/work-in-progress/export?format=csv|pdf&tab=<Tab>&from=<ISO>&to=<ISO>&locations=<id,id>
  &columns=wo_number,status,customer,asset,location,advisor,days_open,earned,remaining,total
  &sortBy=days_open&descending=true
```
Full column set: `wo_number,status,customer,asset,vin,location,advisor,days_open,last_activity,labor_earned,labor_remaining,parts_earned,parts_remaining,earned,remaining,inv_hours,total`.
**WIP uses `from=`/`to=` with full ISO instants plus `tab=`, NOT the other five reports' `range=`.**
Tabs: `Estimates` · `Completed` · `ApprovedPartiallyCompleted` · `ApprovedNotStarted`.
The data response carries `collection`, `pagination`, **`tab_counts`** (all four at once), **`totals`** and
**`summary`** (the seven-figure strip) — so **the whole strip and every tab total can be checked in one
call**, money in **cents**.

**WIP DATE-RANGE CAP, MEASURED:** a **366-day** span inclusive of both endpoints returns **200**; **367**
returns **HTTP 400 `{"errors":[{"error":"Date range cannot be over one year."}]}`**. So the first and last
days are both counted.

**LOCATION SCOPING:** omitting `locations` returns the **active location only** — counts identical to
passing that one id. An id the user cannot access, or a bogus uuid, is **silently ignored and falls back to
the active location** (no error). Useful as a ready-made negative for "no inaccessible location leaks".

**QUASAR: THREE THINGS THAT EACH COST A RUN.**
1. **A dialog backdrop swallows Playwright clicks.** `page.click('[data-test-id="button_new_line"]')` times
   out on `div.q-dialog__backdrop` even though the button is visible and enabled. **Fix: click the element
   centre by coordinate** — `const r=el.getBoundingClientRect(); page.mouse.click(r.x+r.width/2, r.y+r.height/2)`.
   Press `Escape` first to clear any dialog already open.
2. **A type-ahead multi-select needs its own input, and needs a dispatched event.** Typing with
   `page.keyboard.type` after clicking the control lands on the **page**, not the menu, so the list looks
   unfiltered and reads as a broken filter. **Fix: find `input` inside the open `.q-menu` whose
   `placeholder` starts with `Search`, set `.value`, then dispatch `new Event('input',{bubbles:true})`.**
   Query the **last** `.q-menu` in the DOM — earlier ones linger. Placeholders here are `Search assets`,
   `Search customers`.
3. **The shared date-range calendar navigates by `aria-label`** — `Previous month`, `Next month`,
   **`Previous year`**, **`Next year`**. Preset items are plain text inside `.q-menu`
   (`Last 12 Months`, `This Year`, …). **Clicking day cells to build a custom range did NOT register** for
   us — the readout stayed on the old range and Apply re-sent it, so a custom span is still best proven at
   the data layer.

**DARK MODE IS IN THE PROFILE MENU, NOT AN OS PREFERENCE.** `prefers-color-scheme: dark` does **not**
switch this app — the body stays `body--light`. The toggle is `[data-test-id="profile_menu_button"]` →
menu items **`Light`** / **`Dark`**; state persists in `localStorage.mode` (`"light"` / `"dark"`) and the
body class becomes `body--dark`. Forcing the class by hand works for a style read but is **not** what a
tester does — use the menu, and switch back afterwards.

**WO LINE SEEDING.** `POST /api/work-orders/create`
`{company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` → **201
`{data:{work_order_id}}`** (company only → 500; no company → 400 naming the field). `POST /api/work-orders/lines/create`
with just `work_order_id` returns **`{"error":"Labor or fixed prices must be set."}`**, and
`labor_hours`/`labor_rate`/`labor_price`/`hours`/`rate` in every combination tried do **not** satisfy it —
**the field names are still unknown; learn them from the dialog's own request, do not guess.** The New Line
dialog (`dialog_line`) holds `select_line_canned_line` ("What Are You Doing?"), `input_line_description`,
`select_technician`, `select_labour_type` ("Labor Rate"), **`input_time_estimate` ("Estimated Time")**,
**`input_tech_time` ("Tech Time")**, `checkbox_line_approved`, `button_save_add_line`, `button_save_close`.

**⚠️ TWO CLAIMS THAT STOOD HERE WERE PROVEN WRONG — CORRECTED 2026-08-06, both live on `v3.5-f77875c`.**
Left in place as corrections rather than deleted, because each cost a session.

1. **`input_tech_time` is NOT the clocked time, and the earned/remaining maths does not read it.** A canned
   line was seeded carrying **`tech_time: 120` (2.00 h)** and the report still returned **`worked_hours: 0`
   and `labor_earned: 0`**. The report reads **clock records** — `total_clocked_time` — so the state those
   maths cases need is **a running clock**, not a "Tech Time" value:
   **`POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}` → 201**.
   Verified three times against the same running clock (worked 0.01/0.02/0.18 h of a 3 h quote gave Labor
   Earned $1.50/$3.00/$26.99, each matching the clocked share of $449.85 to the cent).
2. **The "at least one more field is required" hunt on Save & Close was a DEAD END — abandon it.** There is
   no unknown field to find: **pick a canned line and the dialog collapses**, and the seeding route is
   **`POST /api/work-orders/{woId}/lines/create-from-canned-line`
   `{another:false, canned_line_id, work_order_id, status}` → 201**. Approve with
   `POST /api/work-orders/lines/change-status {line_id, status:'authorized', workOrderId}` → **200**;
   move the work order with `POST /api/work-orders/change-status {id, status}` → **201** — note **`id`, NOT
   `work_order_id`**, which returns 400 *"Work Order ID is missing"*. Use `status:'authorization_required'`
   on the canned-line call to seed **unapproved** value.

**SIX MORE PROVEN FACTS FROM THE SAME SEEDING RUN (recorded 2026-08-06; they had been flagged in a pass
note and never written here, so each was at risk of being re-derived).**

1. **`POST /api/work-orders/change-status` takes `id`.** `{work_order_id}` → 400 *"Work Order ID is
   missing"*; `{id}` alone → **500**; `{id, status}` → **201**.
2. **The staff list carries TWO ids and the task endpoints want the second one.** `GET /api/staff` returns
   both `id` and `staff_id`. `POST /api/work-orders/tasks/create` answers **400 `{"staff_id":"Not found"}`**
   for the `id` and **201** for the `staff_id`.
3. **Clock IN:** `POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}`
   → **201**. ⚠️ **Clock OUT is NOT solved:** `check-out` answers
   **400 `{"error":"Task not found for the given technician ID."}`** for every id tried (task id, the
   returned record id, with and without the work order), and a second check-in elsewhere then fails with
   *"You are already clocked into different line."* **So a clock you start is effectively left running —
   start one only when you want that state, and say so in the pass notes.**
4. **`POST /api/work-orders/lines/change` is camelCase** — `lineName`, `timeEstimate`, `labourTypeId`;
   snake_case (`line_id`, `time_estimate`) returns *"Line name is missing"*. **The labour-price key is
   still UNKNOWN**: `labourRate`, `labourPrice`, `fixedPrice` and `techTime` all still return
   **400 `{"error":"Labor or fixed prices must be set."}`**. **Do not guess it — capture it from the
   *Edit labor* dialog's own request** (line kebab → **Edit labor**). It is **no longer on the critical
   path**, because `create-from-canned-line` seeds a priced line outright.
5. **The work-order list response key is `data.work_orders`, NOT `data.collection`.** Reading it as
   `collection` returns an empty list with **HTTP 200**, which reads silently and falsely as *"no work
   orders exist"*.
6. **WIP received-vs-outstanding parts live in two different arrays on a line:** `parts[]` is what arrived
   (it carries `arrived_date` / `delivery_id`), `part_requests[]` is what is outstanding. **Parts Earned
   INCLUDES the core charge** — omitting it made a verification formula miss by exactly $149.50 and look
   like a product defect.

**⚠️ CORRECTION TO THE 409 RECOVERY RECIPE ABOVE — IT HAS A LIMIT.** The recipe (call
`quick-login {"key":"admin"}`, swap only the returned `PHPSESSID`) works when a **failed quick-login**
rotated the per-branch session. **It does NOT work when the shared `sv_sso_session` itself has expired:
`quick-login` is SSO-gated too and returns HTTP 401 `sso_required` as well.** How to tell the two apart in
one step: **all three branch cookie sets carry the SAME `sv_sso_session` and `cf_clearance`** (only
`PHPSESSID` is per-branch), so **if `sv8582api`, `sv8785api` AND `sv8685api` all 401 together, the shared
token is gone and no self-service recovery exists — only the QA lead can supply a new one.** If only one
branch fails, it is the per-branch session and the recipe applies. Distinguish an expired `cf_clearance`
from an expired SSO session by the **shape of the refusal**: a Cloudflare block returns a challenge page,
whereas an application-level JSON `{"error":"sso_required", …}` means the request **reached the app** and
`cf_clearance` is still good.

## §U · sv9315 — WHAT THE BUILD ITSELF WILL TELL YOU, IF YOU ASK THE RIGHT LIST (measured 2026-09-01)

**WHY THIS SECTION EXISTS.** Three "the data state does not exist here" conclusions on suites 6597 and
6617 were WRONG, and all three had the same shape: **a conclusion drawn from the wrong list.** §S was
the first (`/api/inventory/parts` ignoring the paging parameters, so 100 of 6,879 parts were read).
These are the rest, with the endpoint that answers each question directly.

| Question | Ask this, not the data | Answer on sv9315, 2026-09-01 |
|---|---|---|
| Which work order statuses exist? | `GET /api/work-orders/statuses` | `estimate, approved, in_progress, ready_for_review, complete, invoiced, paid` — **seven, and NEITHER "Declined" NOR "Imported" is one of them.** A case naming those names statuses the product does not have |
| Which line statuses exist? | `GET /api/work-orders/line-statuses` | `authorization_required, authorization_declined, authorized, complete` — **there is no "Cancelled"**, and posting it against a REAL line id answers 400 with the status field alone rejected |
| Are there catalogue parts in no bin? | `GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` | **19,496 of them.** `/api/inventory/parts` holds only STOCKED parts, so it can never answer this |
| Does a catalogue part carry a price? | `GET /api/parts-catalogue/catalogue-parts?search=<number>` | The record has **no cost and no sell-price field at all** (e.g. F40010212 "Slack Adjuster"). "Every part holds 0.00" was a statement about inventory rows, not catalogue parts |
| Can a work order exist with no customer / no vehicle? | Press Save on the **New Work Order** dialog with the field empty | **"Customer is a required field"** and **"Asset is a required field"** — no request is even sent. Neither state can exist |
| Where is the work order detail? | `GET /api/work-orders/view/<id>` → `data.work_order` | `GET /api/work-orders/<id>` is **404**. Status comes back capitalised (`"Estimate"`), so compare case-insensitively |
| Where are its lines? | `GET /api/work-orders/lines/<id>` → `data.collection`; the id field is **`line_id`**, not `id` | 3 lines on S9315-14846 |

**LINE STATUS IS A WALK, NOT A JUMP.** `POST /api/work-orders/lines/change-status {line_id, status,
workOrderId}` from `authorization_required` straight to `complete` answers **400 "Status transition from
authorization_required to complete is not allowed"** — go via `authorized`. And **a line with
unfulfilled part requests cannot be completed at all**: *"Line can`t be completed with unfulfilled part
requests."* Pick a part-free line. Walk it back the same way afterwards and verify.

**SIDE EFFECT WORTH KNOWING:** completing a line moves the WORK ORDER to **Review** on screen. Reverting
the line reverts the work order — no separate repair needed, but do not read the header mid-probe and
report a status drift.

**TECH STORY:** `POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}` → 201.
**`/lines/change` returns 500** — do not use it.

**A ROLE PERMISSION CAN REFUSE TO COME OFF, AND ANSWER 200 WHILE DOING IT.** `PUT /api/roles/{id}` with
`workOrdersView` removed returns **200** and the role reads back **with it still on** — the work-order
line-edit and pick-parts permissions depend on it. Remove the whole dependent group
(`workOrdersView`, `workOrderLinesCreateAndEdit`, `woPickParts`) and it takes. **⇒ After ANY role write,
re-read the role. A 200 is not evidence the change landed.**

**THE ROLE EDIT SCREEN IS DANGEROUS TO A KEYBOARD SWEEP.** The Technician role drifted from Tech View to
Full View during this pass, and the likeliest cause is a stray Enter on the "View mode" radio while a
probe was tabbing through `/administration/roles-permissions/<id>/edit` — the same sweep that clocked the
Admin into a work order (§T). **Snapshot any shared role to disk BEFORE opening its edit screen**, not
just before writing to it.

