## A. Auth & session

> **🔑 THE ACCOUNTS AND PASSWORDS THEMSELVES LIVE IN `build/ENVIRONMENT-CREDENTIALS.md`** — production,
> TestRail and Atlassian, each with the URL, the account, the password, the login method, what that
> method returns and its traps. **Committed under the QA lead's ruling of 2026-09-03** (Standing Rule 82
> amendment). **Staging and the QA branches have NO password — entry is by session cookie**, supplied by
> him per branch into `/tmp` at `chmod 600`; **cookies and tokens are still NEVER committed.** And a
> committed password is **not** authorisation: **Rule 6 still governs every TestRail write.**

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
- **🛑 2026-09-03 — A SLEEPING BRANCH LOOKS EXACTLY LIKE EXPIRED CREDENTIALS. CHECK THE URL.** QA
  branches are **paused to save resources**. The app host then redirects to
  **`https://sleep.qa.shopview.com/?app=<branch>&api=<branch>`**, which serves *"Environment Sleeping
  — This environment is currently paused to save resources. Click below to wake it up — it usually
  takes around 1 minute."* with a single **`Wake Up`** button and **no sign-in form** — so the
  `DEV MODE — QUICK LOGIN` panel is absent and `qa-branch-boot.mjs` stopped with
  *"no DEV MODE Admin button"*. **That reads as a dead token and is nothing of the kind.**

  **The tells, in order of reliability:** the URL contains **`sleep.qa.shopview.com`** · the page's
  only button is `Wake Up` · the body text starts `Environment Sleeping`. **`GET /` still answers
  HTTP 200 with a valid `app-version` meta tag**, so a reachability check does NOT reveal it, and
  `/api/quick-login/users` answers **403** rather than anything sleep-specific.

  **`qa-branch-boot.mjs` now wakes it automatically** — clicks `Wake Up`, waits up to ~2.5 minutes for
  the redirect to clear, reloads, and retries up to three times. **Detect by URL and POLL:** the
  redirect takes several seconds, and a first fix that checked once at +4s never fired because the
  page had not yet moved. Nothing else about the login changes; after waking, quick-login and
  `fe-permissions` both answer 200 on the same `sv_sso_session`.

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
  **⚖️ 2026-09-03 — (a) IS NOW SETTLED / NOT BEING CHASED, BY THE QA LEAD'S DECISION; (b) STAYS OPEN:**
  **(a)** whether **clicking the panel headlessly on staging completes the login** the way it does on
  a QA branch. **A cookieless Chromium run on 2026-09-03 found NO panel and NO email+password form to
  click** (the page paints empty for ~2.1 s then redirects to Google; sampled every 0.7 s for 10.5 s),
  and **the build marker had moved** (`v26.35.6-49e216a` → **`v26.35.8-414f13c`**). **HE HAS RULED:
  LEAVE IT — DO NOT CHASE IT**, because **a DEV MODE panel behind a login is not a way in**, so which
  reading is true does not change the access position. **🛑 BOTH READINGS STAY ON THE RECORD** — his
  screenshot is **not** retracted, and we do **not** assert staging has no panel: **nobody has looked
  while signed in.** **Do not queue this as an independently answerable question and do not spend a
  probe on it.**
  **⚖️ 2026-09-12 — BOTH HALVES NOW ANSWERED, AND THEY DO NOT CONTRADICT EACH OTHER.**
  **(i) FROM A COLD JAR, STILL NO.** `https://app.staging.shopview.com/` and `/login` redirect
  server-side to `accounts.google.com` (`hd=shopview.com`,
  `redirect_uri=https://auth.staging.shopview.com/callback`) before the app renders — no panel, no
  form. Identical to the 2026-09-03 reading. **So the panel is NOT a way to GET a session, and his
  ruling stands: do not chase it as one.**
  **(ii) 🟢 WITH A LIVE COOKIE, YES — AND THIS IS NOW THE STAGING SPA-HYDRATION ROUTE, ONE CLICK.**
  A borrowed `sv_sso_session` authenticates the API but leaves the SPA sitting on `/login`. On that
  page the `DEV MODE — QUICK LOGIN` panel **renders**, and **clicking `Admin` completes the login**:
  ~14 s later the page is at `/workorders?status=paid` with `localStorage.user` set and every in-app
  screen reachable. Proven live 2026-09-12 (`build/invoice-design-selection/staging-2026-09-12/evidence/S27-inapp-finance.png`).
  ```js
  await p.goto(`${APP}/`); await p.waitForTimeout(5000);
  await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('button,.q-btn,[role=button],a')].filter(vis)
      .find(e=>/\bAdmin\b/.test(t(e))&&!/Panel|Settings:/.test(t(e)));
    if(el) el.click();});
  await p.waitForTimeout(14000);   // localStorage.user is now set
  ```
  **⇒ Stop hand-writing `localStorage` on staging, and do NOT go looking for a user endpoint:
  `GET /api/auth/me` is **404** there; only `/api/auth/me/fe-permissions` answers (200).**
  **(b)** whether **`sv_sso_session` ALONE suffices on staging** — **genuinely still open.** Staging
  sits behind **Cloudflare** (`cf_clearance` at the edge), unlike the CloudFront+nginx QA branches,
  **so the QA-branch finding that `cf_clearance` is inert does NOT transfer**. Answer it opportunistically
  inside the next staging window; do not spend a pass on it.
  Neither could be settled live: we hold no staging `sv_sso_session` and stored staging cookies
  return 401 (`build/BLOCKED-shopview-app-session.md`).
  **✅ HOW A STAGING SESSION IS OBTAINED — DECIDED 2026-09-03, PER-NEED.** The QA lead drops a live
  **`sv_sso_session`** (plus `cf_clearance` if Cloudflare demands it) into **`/tmp`**, **`chmod 600`**,
  **when a NAMED piece of work needs staging**. **The ask is a COOKIE, NEVER A PASSWORD** — the
  password route was tested on 2026-09-03 and is closed (`POST /api/login` → **401 `sso_required`**,
  byte-identical for two different accounts; the `/login` page renders **no form**, redirecting to
  Google, which returns **`/v3/signin/rejected`** — bot detection before any account decision). **Name
  the work, ask ONCE, expect roughly a 24-hour window, and NEVER commit the token — it rotates within
  hours, and a committed one makes the next session misdiagnose a rotated cookie as a login failure.**
  Inside that window, piggyback **only the Navigation Map rows the work actually uses** (NAV-3, below).
  Full decision: `build/BLOCKED-shopview-app-session.md` *Who can clear the remaining half* ·
  `build/ENVIRONMENT-CREDENTIALS.md` §3 · register row **R1**.
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

