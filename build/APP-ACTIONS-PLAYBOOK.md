# ShopView App Actions Playbook — Proven Per-Action Recipes (NON-SECRET)

> ## 🔎 NEVER GIVE UP ON A BLOCKER WITHOUT SEARCHING THE REPO FIRST (user directive 2026-08-28)
> Almost every "this is impossible" in this workspace has already been hit, solved, and written down.
> Before telling the user something cannot be done, spend two minutes searching — **use the EXACT ERROR
> STRING as the search key; that is what finds it.** Targeted greps / bounded slices only — never bulk-read
> "to get oriented".
> ```
> grep -rn "<exact error string>" build/ --include=*.md | head -20
> grep -rn "<endpoint | tool | symptom>" build/APP-ACTIONS-PLAYBOOK.md | head -20
> ls build/*/FINDINGS.md 2>/dev/null            # past per-ticket investigations
> git log --all --oneline --grep="<keyword>" | head -20   # someone may have fixed it in a commit
> ```
> **🔴 STEP 0 IS `git fetch origin` — ALWAYS, before you measure or report ANY repo fact.** A stale
> checkout answers confidently and WRONGLY with no signal it's stale (on 2026-08-28 it made this very
> session declare `build/skills/`, `build/rules/`, the `BLOCKED-*` and `*DIAGNOSIS*` files "not on this
> branch" — **they all exist on `origin/claude/slack-session-0sxnd9`**, the canonical shared-brain branch).
> **🔴 SEARCH THE CANONICAL BRANCH, NOT ONLY YOUR OWN — you do NOT need to check it out:**
> ```
> git fetch origin                                                              # STEP 0, never skipped
> git ls-tree -r --name-only origin/claude/slack-session-0sxnd9 | grep -E 'skills/|rules/|BLOCKED|DIAGNOSIS'
> git grep -n "<exact error string>" origin/claude/slack-session-0sxnd9 -- build/ | head -20
> git show origin/claude/slack-session-0sxnd9:build/skills/14-ACCESS-RESILIENCE.md | sed -n '1,80p'
> ```
> **"Not on this branch" is NEVER a reason to conclude something doesn't exist.** The canonical resources:
> `build/APP-ACTIONS-PLAYBOOK.md` · `build/skills/14-ACCESS-RESILIENCE.md` (access ladders) ·
> `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` · `build/rules/RULES-*.md` (**grep, never read whole**) ·
> `ls build/BLOCKED-*.md` (several marked RESOLVED with the cause) · `build/*/FINDINGS.md` ·
> `git log --all --grep`. **DURABLE FACT: the Standing Rules moved OUT of `CLAUDE.md` into
> `build/rules/RULES-*.md` on 2026-08-21; `CLAUDE.md` is now an INDEX.** This directive is formal
> **Standing Rule 97** (in `build/rules/RULES-61-97.md` on the canonical branch), which already cites this
> session's stale-checkout failure. **Find it → use it, say where. Can't → report the exact searches you
> ran. Solve something new → write it down the same pass** (Rule 27).

> ## ⛔ BEFORE ANY APP ACTION: run the 30-second pre-action check in **§U.0**
> Five questions — have I done this before · **is there more than one surface for this action and am I
> on the one the product uses** · whose state am I changing · will I have the evidence · does the setup
> match what the ticket requires. It exists because a mistake already written down here got repeated
> anyway (SV-8779 → SV-8815). **§U.0b** lists the four harness traps that eat an hour each.
>
> **Looking for a route, a control id, or a limit? → §W, the navigation map.** Routes that work and the
> four that render but are dead · every `data-test-id` by the action you want · the five reads that lie
> and what to read instead · the field-name and length limits. **Check §W before hunting the DOM.**
>
> **Building evidence or a Jira comment? → §V.** Frozen states, real geometry, the annotation rules,
> and **§V.9/§V.10**: generate the comment with a script, lift content rather than retyping it,
> tone-gate it, and **one complete comment instead of a chain of corrections**.

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
[R. PRODUCTION: work order → INVOICE seeding](#r--production-seed-a-work-order-all-the-way-to-an-invoice-proven-2026-08-10-sv-8769--sv-8814) ·
[L. Git practice with parallel workers](#l-git-practice-with-parallel-workers) ·
[M. Figma: extract ALL frames from a design link](#m-figma-extract-all-frames-from-a-design-link-proven-2026-07-31-filters) ·
[Jira/Confluence access](#jiraconfluence-access)

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
- **Chromium UI automation (boot2 hydration):** Chromium can't TLS through the egress proxy directly.
  `boot2(roleKey, opts)` in `staging-boot2.mjs` does quick-login → optionally `change-location` →
  reads `GET /api/auth/me/fe-permissions` → seeds cookies + localStorage (`user`,
  `fe_permissions_wrapper`, `token`) THEN navigates (the DEV login BUTTONS don't reliably work).
  It points Playwright at `$HTTPS_PROXY` (read LIVE — port rotates). Exits code 2 with
  `COOKIES_EXPIRED` on a 409. *Source: CLAUDE.md, TESTING-RUNBOOK.md.*
- **Fresh MITM bridge (fallback when the direct proxy path fails):** `staging-bridge.mjs` — a small
  local proxy that accepts Chromium's CONNECT and relays via Node fetch (honours
  `NODE_USE_ENV_PROXY=1` + `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`). Reads `$HTTPS_PROXY`
  live; **rebuild every run, never hard-code the port.** Prints `BRIDGE_LISTENING 127.0.0.1:<port>`;
  launch Chromium with `--proxy-server=http://127.0.0.1:<port> --ignore-certificate-errors
  --no-sandbox --ssl-version-max=tls1.2`.
- **node-fetch / undici proxy gotcha:** node-fetch IGNORES the proxy → use **undici `ProxyAgent`**
  (or Node global `fetch` with `NODE_USE_ENV_PROXY=1`). *Source: CLAUDE.md Simple Flow env note.*
- **⭐ QUICK-LOGIN ON SHOPVIEW — the CORRECT method (QA-lead ruling, proven sv9500 build v26.35.6-4b694be,
  2026-08-28). Read this before ever touching quick-login:**
  1. **PROBE FIRST.** `GET /api/auth/me/fe-permissions` on the API host. **If it returns 200 you are
     already logged in — DO NOT call quick-login.** (`/api/auth/me` 404s on this build; use fe-permissions.)
  2. **Call quick-login ONCE per run, and ONLY to CHANGE ROLE.** Every call rotates your session.
  3. **Take the new `PHPSESSID` from the `Set-Cookie` — INCLUDING when the response is 403.** A 403 from
     quick-login is **not** a failed login; it still logs you in. **Leave `sv_sso_session` alone; it does
     NOT rotate.**
  4. **NEVER reuse a cookie jar after a 409 "Session has expired."** That response hands back a **DEAD
     PHPSESSID that 409s forever.** **Disable cookie persistence** so a poisoned value can't be stored and
     reused. (This — not a short TTL — is what made the session "keep dying": a poisoned PHPSESSID kept
     getting reused.)
  5. **NEVER call quick-login while another session is using the same account** (e.g. the user's own
     browser is open on the branch). That is what LOGS THE USER OUT. Two *normal* browsers coexist fine;
     a quick-login rotates the shared account's session and kicks the others. **CONFIRMED LIVE 2026-08-28:
     the QA lead's own browser on `sv8504.qa.shopview.com` WAS logged out the moment I quick-logged-in on
     the same account — OBSERVED-MECHANISM, not inferred.** ⇒ For same-user testing where you don't need to
     change role, use the localStorage-seed bypass below (no rotation, user's browser untouched).
  6. **CAPTURE the rotated PHPSESSID with a DIRECT node fetch (or a network-response listener) — an
     IN-PAGE `page.evaluate(fetch)` CANNOT read `Set-Cookie`,** so the context keeps the OLD (now-dead)
     PHPSESSID and every later call 409s. Proven 2026-08-28: direct-fetch captured PHPSESSID → fe-permissions
     200 alive end-to-end; in-page fetch → 409. This is the exact mechanism behind the "morning worked, then
     failed" drift. **How NOT to over-generalize this into "never quick-login": see
     `build/LEARNING-DISCIPLINE.md`.**
- **⭐ PER-TICKET QA BRANCH (`sv####.qa.shopview.com`) SPA UI — when you DON'T need to change role, SEED
  localStorage instead of logging in at all (proven SV-8504, 2026-08-28). This is the DEFAULT for testing
  as the current user, and it never disturbs the user's own session:**
  - **Do not click `button_quick_login_admin` here** — the user's browser is on the same account, so per
    rule 5 above it would log them out. (This was the whole cause of the "session keeps expiring" saga.)
  - **The symptom without quick-login:** the raw API works with the cookies (`fe-permissions` → **200**),
    but the *SPA UI* still redirects every route to `/login`, because a fresh headless browser has empty
    `localStorage` and cannot complete the Google-SSO round-trip that a real browser uses to hydrate.
  - **✅ THE BYPASS — seed `localStorage` from the live API, no login action at all:**
    1. Set the 3 cookies (domain `.qa.shopview.com`); `page.goto('/')`; confirm `GET
       /api/auth/me/fe-permissions` → **200** (session valid). If 409, the `sv_sso_session` is genuinely
       expired — ask for a freshly-grabbed one (grab within ~seconds of the user viewing the branch).
    2. Fetch `GET /api/auth/me/fe-permissions` (→ the `data` object) and pick a staff id from
       `GET /api/staff?...` (any admin). `POST /api/iam/change-location {workplace_id, workplace_timezone}`.
    3. Seed these keys, then navigate:
       `localStorage.user = JSON.stringify({data:{details:{user_id:<staffId>, first_name, last_name, email,
       avatar_url:null, clockable:false, default_workplace:<WP_ID>}, permissions:<fe.fe_permissions>}})` —
       **`default_workplace` is REQUIRED** (`userHasDefaultWorkplace()` reads it; without it the router
       bounces to `/administration/locations`); `localStorage.fe_permissions_wrapper = JSON.stringify(<fe
       data: {fe_permissions,view_mode,cross_toggles,...}>)`; `localStorage.location =
       JSON.stringify("<WP_ID>")`; `localStorage.current_shop_id = "<shopId>"`; `localStorage.timezone`,
       `country_code`, `bookkeeping_enabled`. Then `page.goto('/workorders?status=imported')` (etc.) — the
       app boots, no `/login`, and **the user's browser stays logged in the whole time.**
    - The router guard (index chunk): `O=getUser(); U=userHasDefaultWorkplace(); N=O&&has("settingsApp")` →
      `if(O&&N&&!U…)→/administration/locations`; `if(O&&!N&&!U…)→/no-location`; no user → `/login`. So seed
      `user` (with `default_workplace`) + `fe_permissions_wrapper` and all three guards pass.
  - **Session TTL ≈ 24 h when you DON'T quick-login** (same as a normal browser). The "session died in
    ~10 min" was NOT a short TTL — it was (a) quick-login rotating the shared account's session and
    (b) reusing a **409-poisoned PHPSESSID** (see quick-login rule 4). Disable cookie persistence and never
    quick-login here, and the session lasts. Still, grab cookies reasonably fresh.
  - Chromium via the fresh MITM bridge (below); build marker from `<meta name="app-version">`
    (sv8504 was `v26.35.6-3b9cbae`). Canonical script: `build/sv8504-sorting-2026-08-28/` (seed_load3 / SORT_TEST).
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

## B. Environment / location
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
- **Impersonate a role holder (PREFERRED live-role test):** `POST /api/switch-user {user_id}` (user_id =
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

## J. TestRail API
- **⚠️ TestRail is the ONLY real/production system — NEVER create/update/delete cases, runs, or
  results without EXPLICIT user permission (Standing Rule 6).** Log ONLY Passed cases to a run; keep
  Failed/Retest/Blocked local.
- **Project 1 / single suite 1 "Master"**; API v2, Basic auth. Helper `testrail-api.mjs` reads creds
  from `/tmp/testrail/creds.json` (email + password-OR-key + host) — **never hard-code creds.** Calls
  hit `{host}/index.php?/api/v2/{path}`.
- **`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`** (non-API cases). Place any
  case with API content in a section whose title includes "API" (Rule 4).
- **Result statuses:** 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed.
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
    **`template_id` 2 = Steps** (ours: 1 = Text, 474/474) · **`custom_automation_type` unset** (ours:
    always 0) · **`type_id` 7 "Other"** (ours: 6/5/1/2) · **titles over 80 chars** (ours: 0/474 —
    the ≤80 title rule) · **no expected results at all** (automated cases keep the assertion in code).
    **⚠️ `custom_atmstatus` is NOT a usable tell** — it is 3 ("Automated") on his cases AND on 16 of
    ours. Field decode from `get_case_fields`: atmstatus `1 Not Automated · 2 Cannot be automated ·
    3 Automated · 4 Pending`; automation_type `0 None · 1 Ranorex`.
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
comment, set priority Low first, and NEVER DELETE** (deletion is irreversible; a withdrawn ticket with
its reasoning on the record is worth more). **Keep the finding in the pack — we withdraw the ticket, not
the finding.** Read alongside **Rule 24**: FE-blocks + BE-allows is a **PASS**, not a defect at all.

**2. PARENT = THE EPIC; THE OWNING STORY IS *LINKED*, NOT PARENTED (Rule 52).**
His clarification, verbatim and operative: *"So Yes, attach the tickets to the Epic as Parent but when
you liunk th etickets to the stories they should be linked as their story defects. You did it correctly
before."*
**Do NOT reparent a defect onto a story, do NOT convert it to a `Story Defect` subtask, do NOT create
replacement issues or close the original as a duplicate to get a story parent.**
**Why this shape is CORRECT and not a workaround:** in project **SV**, **`Bug` (10008) is hierarchy
level 0** — same level as `Story` (10245) and `Task` (10005) — so **its parent may only be an `Epic`
(10006, level 1)**. The only story-level child vehicle is **`Story Defect` (10007), a SUBTASK at level
−1**, and **Jira REFUSES the level-0 → subtask conversion** (both attempts proven 2026-08-04):
`PUT /rest/api/3/issue/{key}` with `issuetype:10007` + `parent` → **400
`{"pid":"Issues with this Issue Type must be created in the same project as the parent."}`** (misleading
— the parent *was* in the same project); `issuetype` alone → **400 `{"issuetype":"Issue type is a
sub-task but parent issue key or id not specified."}`**. An unwinnable pair.
**The LINK TYPE is his to name — never guess.** Available in this Jira (`GET /rest/api/3/issueLinkType`,
read live 2026-08-04): **Blocks** · **Cause** (`caused by`/`causes`) · **Cloners** · **Duplicate** ·
**Fixes** · **Polaris work item link** · **Relates** · **Split**. **None is a defect-of / is-defect-for
type**, so if a "story defect link" is asked for, **change nothing and ask which of the eight he means.**

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

### Fields to set on a ShopView `SV` bug (from `createmeta`, 2026-08-04)

`project` · `issuetype` (**`Bug`**) · `summary` · `description` · `labels` · **`priority` — ALWAYS
`Low`** (Rule 53; the field offers Highest/High/Medium/Low, we use `Low`) · `customfield_10418`
**Severity** (High/Medium/Low — put the real severity HERE) · **`customfield_10153` "Product Area" —
REQUIRED** (Reports & Dashboards · Work Orders · Customers · …).
**Parent:** the **Epic** (see gate 2 above) — a `Bug` is hierarchy level 0 so an Epic is the only parent
it can take. **Attach the owning story as a LINK** (`POST /rest/api/3/issueLink`), not a parent.
**Withdrawing a ticket:** read `GET /rest/api/3/issue/{KEY}/transitions` and use the closest close
transition — on `SV` that is **`Close` (id 8) → status `OBSOLETE`**, whose post-function sets
**`resolution: Done`** with no resolution screen. Comment first (v2 `POST /rest/api/2/issue/{KEY}/comment`
takes a plain string), then transition, then read back status + resolution + priority + comment.

---

## Navigation Map

How to reach each screen. SPA routes are under `app.staging.shopview.com`. Top nav
items are **gated by permission** (a hidden item means the role lacks the perm).

| Screen / Feature | Nav path (from the top) | SPA route | Notes |
|---|---|---|---|
| Work Orders list | Top nav → Work Orders | `/workorders` | Gated by `workOrdersView`. |
| Work Order detail | WO list → click a row | `/workorders/{id}/lines` | **Existing-WO detail bounces to `/workorders` on mount for ALL roles incl. admin.** Only a **freshly-created** WO reliably lands on the detail/lines page — create fresh to test line/part/finance flows. |
| WO Finance tab | open WO → **Finance** tab | (within WO detail) | Gated by `invoicingPaymentsView` **AND** `seeFinancialData`. Holds Create Invoice / Add Deposit / invoice kebab (Reverse / Issue Credit). |
| WO Parts tab | open WO → **Parts** tab | `/workorders/{id}/parts` | Direct URL to `/parts` sub-route returns page-not-found without WO context (SPA needs WO loaded). Order Parts is meant to gate this tab (visibility looked identical ON/OFF — needs manual confirm). |
| WO Lines / Notes / Stats tabs | open WO → tab | (within WO detail) | Tabs render as Lines / Parts / Notes / Stats (+ Finance when invoicing+SFD on). |
| Schedule (calendar) | Top nav → Schedule | `/schedule` | Gated by `scheduleView`; shows ALL users' appointments. Create/delete = click/drag on the grid (no persistent button). |
| Parts (department) | Top nav → Parts | `/parts` | Gated by Parts Department parent. Parent OFF → nav item gone and inner pages redirect to `/workorders`. |
| Part Sales | Parts → Part Sales | `/parts/part-sales` | **Route is flaky in the harness** (sometimes never reaches `domcontentloaded`; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. `/part-sales`, `/partsales` are NOT valid (page-not-found). |
| Catalog | Parts → Catalog | `/parts/parts-catalogue` | Read-only without Create&Edit. |
| Inventory | Parts → Inventory | `/parts/inventory` (also `/inventory`) | "New Inventory Part" button with Create&Edit. |
| Part History (inventory) | Parts → Inventory → **clock icon** next to a part | `/parts/inventory` | Clock icon (tooltip **"Part History"**) opens that part's history. This is a **separate feature** from the WO View History Logs permission. **Part Sales has NO history.** (Confirmed with product owner.) |
| Vendors | Parts → Vendors | `/parts/vendors` (also `/vendors`) | Supply-chain sub-tabs: Purchase Orders, Vendor Invoices, Returns, Vendors. |
| Parts → Returns | Parts → Vendors → Returns tab (or Parts → Returns) | `/parts` → Returns | Returns list; row three-dots → "Return to inventory" / "Delete Return". |
| Customers | Top nav → Customers | `/customers` | Gated by `customersView`; OFF → nav gone and `/customers` redirects to `/workorders`. Customer detail tabs: Work Orders / Part Sales / Contacts / Assets(vehicles) / Notes / Payments. |
| Reports | Top nav → Reports | `/reports` | Gated by `reportsPageAccess`. Left nav groups: A/R Aging (Summary/Detail/Collection), A/P Aging (Summary/Detail/Unpaid Invoices), Sales Tax, Timesheet Activities. |
| A/R & A/P aging reports | Reports → left nav | `/reports/ar-aging-summary`, `/reports/ap-aging-summary`, `/reports/ap-unpaid-invoices`, `/reports/ar-aging-collection` | Now follow **Reports** permission (all-or-nothing), per updated spec. |
| Timesheet Activities | Reports → Timesheet Activities | `/reports/punch-clock-activities` | Default report view; gated by `timesheetsView` (+ reports). |
| Administration (Settings home) | left sidebar → Settings group | `/administration`, `/administration/settings` | No perms → `/administration` redirects to `/workorders`; no SETTINGS group in sidebar. |
| Roles & Permissions (roles list) | Settings sidebar → **Roles & Permissions** | `/administration/roles-permissions` | Heading "Roles & Permissions". "Create custom role" button. Gated by `settingsApp` (App Settings). |
| Create/Edit role | Roles list → "Create custom role" (or pencil) | `/administration/roles-permissions/new` · `/administration/roles-permissions/{id}/edit` | Template picker modal → Apply → `/new?template=...`; Skip → blank `/new`. View-only summary at `/{id}/summary`. |
| Staff | Settings sidebar → Staff | `/administration/staff` | Role user-counts link here as `?roleName=<RoleName>`. |
| Locations / Departments / Taxes | Settings sidebar (App group) | `/administration/locations`, `.../departments`, `.../taxes` | App Settings group also holds Settings + Staff + Roles & Permissions. |
| Service settings | Settings sidebar → Service group | `/administration/labour-types` (Labor Rates), `/canned-lines` (Canned Lines), Asset Types, Inspection Templates | Gated by `settingsService`; OFF → these redirect to `/administration/locations`. |
| Parts settings | Settings sidebar → Parts group | Pricing, Bin Locations, Categories | Gated by `settingsParts`. |
| Finance settings | Settings sidebar → Finance group | Payment Methods | Gated by `settingsFinance`. **No QuickBooks entry present** (relocation not implemented). |
| Data Import | Settings sidebar → Imports group | Contacts, Assets, Vendors, Inventory, Invoices | Gated by `settingsDataImport`. |
| Wages | (per-staff) Staff → Edit Staff Member | (modal) | `settingsWages` reveals Salary Type + Hourly Rate on the staff modal. |
| Integrations | Settings sidebar → Integrations | `/administration/quickbooks`, `/administration/finance/quickbooks` (routes exist) | Shows only **IBS**; QuickBooks absent. |

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
- **UI path:** WO detail → Finance tab → invoice **three-dot** menu → **Reverse** → Warning ("re-open and undo the invoice") → confirm Reverse. (Part-sales invoice: Part Sales → invoice → reverse.)
- **API:** `POST /api/invoices/reverse-invoice` body `{id}` → **200** (WO reverts "Invoiced" → "Complete", Create Invoice reappears).
- **Preconditions:** WO-invoice reverse is gated by **Work Orders: Delete** (SM has WO Delete → reverse allowed even though `invoicingPaymentsDelete`=OFF). Foreman/Parts Manager without it → menu shows only "Issue Credit" and the endpoint returns **403 "Access denied."**
- **Confidence:** High (executed 200 allowed and 403 blocked, both observed).

### Issue credit
- **UI path:** WO detail → Finance tab → invoice three-dot menu → **Issue Credit** (present even for roles that lack Reverse).
- **Confidence:** Medium (menu item confirmed; flow not fully driven).

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

#### Schedule module (redesigned, technician-row grid) — SV-9519 / SV-9500 (proven 2026-08-27/28)
- **Grid:** `/schedule` → `schedule_page`; technician rows carry `data-staff-id`; time columns across the top (Day/Week/Month). Sidebar = `schedule_sidebar` with `input_sidebar_search` + `sidebar_work_order_card` (each card shows `<actual>h / <estimate>h Est.`).
- **Schedule an EXISTING WO:** drag a `sidebar_work_order_card` onto a technician's time cell → `POST /api/schedule/shifts` `{workOrderId, lineIds:[..], staffId, departmentId, startDate:"YYYY-MM-DD", startTime:"HH:MM", spreadMode:"single", totalMinutes, perDayMinutes}` → 201 `{data:{shifts:[{id,staffId,startsAt,endsAt,durationMinutes,...}]}}`. `totalMinutes` = **remaining estimate = line estimate − clocked actual** (computed client-side).
- **Create a WO FROM a slot (SV-9519):** click a tech's time cell → menu `menu_schedule_new_work_order` → dialog (`select_customer_select`, `select_company_vehicle_select`, `checkbox_is_vehicle_here`, `button_save_work_order`). The create payload carries the slot context — `POST /api/work-orders/create {..., scheduled_start, assigned_staff_id}` → the shift is created atomically and appears on that tech's row (verify via `GET /api/schedule/board?from=..&to=..` → `board.shifts[].staffId` == the row's `data-staff-id`).
- **Schedule board data:** `GET /api/schedule/board?from=<ISO>&to=<ISO>` → `{data:{board:{shifts,events,series,capacity,workingWindows}}}`; each shift has `staffId,startsAt,endsAt,durationMinutes,workOrder{number,...}`. (Older calendar `/api/calendar` is the legacy view.)

#### Labor line: estimated vs ACTUAL hours + clocking (SV-9500, proven 2026-08-28)
- **Estimate** = line `time_estimate` (stored in **MINUTES**; 60 = 1.0h). **Actual** = the technician's **clocked** time (start/stop), surfaced as the line's real clocked hours (the Schedule + sidebar use this, NOT the raw `total_labour_time` field which can be inflated by a container-vs-server timezone gap on an open punch).
- **New Line dialog** (`dialog_line`; a 0-line WO auto-opens it): `select_line_canned_line` ("What are you doing" — pick a canned line to auto-fill labour type/rate), `input_line_description`, `select_line_roster_add_technician` (Add Technician to roster — must have a workplace tech), `input_time_estimate` (Estimated time, hours), `input_tech_time` (Tech time, hours), `button_save_close` / `button_save_add_line`. Create-from-canned = `POST /api/work-orders/{wo}/lines/create-from-canned-line` → 201.
- **Read line:** `GET /api/work-orders/lines/{wo}` → line objects with `line_id, time_estimate(min), tech_time, tech_times{}, total_labour_time, assigned_techs, labour_type_id, ...`.
- **Edit line / set estimate:** `POST /api/work-orders/lines/change` — send the line object with `time_estimate` (minutes) changed (+ `line_id, work_order_id, description, line_name, labour_type_id, assigned_techs, tech_assigned_id, is_diagnosis, is_warranty, is_authorized_to_repair, is_parts_required_are_authorized`). Also `PUT /api/work-orders/lines/{line_id}/technicians {staffIds:[..]}` assigns techs.
- **Clock ACTUAL time (start/stop):** line button `button_clock_toggle_task_{lineId}`. START → `POST /api/work-orders/tasks/create {staff_id,line_id,work_order_id}` (201, returns task) + `POST /api/technician-tasks/check-in {task_id,line_id,work_order_id,refresh_lines:true}` (201, returns check-in record id). STOP → opens the **"Stop working on …"** dialog (tech story prefilled, "Line Completed?" toggle, departments) → click **Clock Out** → `POST /api/technician-tasks/check-out {task_id:<check-in record id>, tech_story, complete_line:false, work_order_id}` (201). Open punch state: `GET /api/technician-tasks/my-current-task`.
- **Add ~1.5h actual without waiting:** clock a little real time, then LOWER the line estimate below the clocked actual via `lines/change` (deterministic). (Punch-time edit endpoints `technician-tasks/change` / `work-orders/tasks/change` exist but returned 500 on the payloads tried — not needed for the repro.)
- **THE SV-9500 BUG (unfixed):** when a line's clocked **actual ≥ estimate**, remaining ≤ 0, and dragging the WO onto the Schedule is **blocked client-side** (NO `POST /api/schedule/shifts`) with the toaster **"Nothing left to schedule — there's no estimated time left to book."** Reproduced live on production 2026-08-28 (WO with Actual 0.2h / Estimate 0.1h). Fix (SV-9497) should allow scheduling when remaining is 0/negative.

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

---

## §P — Verify a FRONTEND fix from the DEPLOYED BUNDLE, with NO login (proven 2026-08-05, SV-7324)

**Use this when** you must confirm a frontend fix is genuinely deployed on a QA branch but the estate
is `401 sso_required` (no cookies), **or** the app repo is outside the session's GitHub scope so the PR
diff cannot be read. The deployed bundle is **better evidence than the PR anyway** — it is what is
actually running (Rule 12), and static assets are served **without auth** even when the API is walled.

**Why it matters:** it turns "I couldn't check anything without cookies" into a real, exhaustive,
byte-level verification of the shipped code — and it reads the *server-driven* parts of a fix, which is
where silent failures hide.

### The recipe

```bash
# 1. Build marker (Rule 49) — ALWAYS capture this first
curl -sS -D - -o idx.html https://<env>.qa.shopview.com/ | grep -Ei 'last-modified|etag'
grep -oE '<meta name="app-version"[^>]*>' idx.html && sha256sum idx.html

# 2. Seed chunk list from the entry bundle named in index.html
grep -oE '(src|href)="[^"]*\.js"' idx.html          # -> /js/index.<hash>.js
curl -sS -o index.js https://<env>.qa.shopview.com/js/index.<hash>.js
grep -oE '[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{8}\.js' index.js | sort -u > chunks.txt

# 3. TRANSITIVE CLOSURE — chunks reference further chunks; one pass is NOT enough
#    (SV-7324: 120 -> 506 -> 541. Stopping at pass 1 would have missed the fix entirely.)
while :; do
  cat *.js | grep -oE '[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{8}\.js' | sort -u > want.txt
  ls -1 *.js | sort -u > have.txt; comm -23 want.txt have.txt > todo.txt
  [ ! -s todo.txt ] && break
  xargs -P 16 -I{} curl -sS --max-time 25 -o {} "https://<env>.qa.shopview.com/js/{}" < todo.txt
done

# 4. Now grep ALL of them (Rule 50 — exhaustive, no sampling)
grep -l -i 'heic\|heif' *.js          # absence across ALL chunks is itself strong evidence
grep -l 'some_data_test_id' *.js      # finds the component chunk by its data-test-id
```

**GOTCHAS, all hit for real:**
- **`xargs -P 16` is required.** Serial download of ~500 chunks times out at 2 min. Parallel = seconds.
- **Chunk names are content-hashed**, so they are also a precise build fingerprint — record them.
- **Vite chunks are named after the component** (`GenericNotes.<hash>.js`), so the fastest way to the
  right file is `grep -l` for a **`data-test-id`** or a user-facing string, not for the filename.
- A `.map` sourcemap URL is often present at the tail of each chunk — check for it, it can make the
  minified code trivially readable.

### What this proves, and what it does NOT

**PROVES:** the fix's files are deployed; hardcoded constants and limits; exact on-screen labels and
`data-test-id`s (Rule 9 wording, straight from the build with no login); that *removed* code really is
gone (`grep -l` returning nothing across every chunk).
**DOES NOT PROVE:** anything the **server** supplies at runtime, and anything the **device/browser**
does. Both must be labelled NOT VERIFIED (Rule 12).

### The high-value move: trace the SERVER-DRIVEN inputs

Read the fix's data flow to find where a runtime value can **override** a safe hardcoded default. On
SV-7324 the file-picker `accept` list was `(serverList.length > 0 ? serverList : HARDCODED_15)` —
so a server allow-list containing `image/heic` would silently defeat the whole fix while **every unit
test still passed** (they assert the hardcoded list). That risk is invisible in the PR description and
was only findable by reading the deployed code. **Always ask: which part of this fix is not in the
bundle?**

### Honest limit

A physical-device behaviour (here: iOS transcoding HEIC→JPEG *inside* the photo picker, before the
browser receives a file) is **not** reachable this way — nor by emulation, mobile viewport or UA
spoofing. That is Rule 14's genuine-blocker exception; it needs a human with the device, and a
`PENDING-LIVE-CHECK.md` queue (Rule 49). Canonical example:
`build/sv7324-heic-2026-08-05/`.

---

## §Q — QA-branch auth: **NEVER call `quick-login`** — the supplied cookies already work (learned the hard way 2026-08-05, sv8781)

**THE GOTCHA, stated first because it cost five cookie sets:** on a per-ticket QA branch
(`sv<ticket>.qa.shopview.com`), **`POST /api/quick-login` ROTATES the `PHPSESSID` and INVALIDATES the
session you were given.** It returns **200**, which looks like success — and then **every subsequent
authenticated call returns `409 {"errors":[{"error":"Session has expired."}]}`**. The cookies the QA
lead sent are now dead and only a fresh set can recover it.

**PROVEN SEQUENCE (2026-08-05, sv8781, one browser context):**
```
1) GET /api/auth/me/fe-permissions   -> 200 OK          <-- the supplied cookies ALREADY WORK
2) POST /api/quick-login             -> 200 OK          <-- looks fine, but PHPSESSID rotates
   cookies: PHPSESSID=2c605fbd03..  ->  PHPSESSID=d39bfc5702..
3) GET /api/auth/me/fe-permissions   -> 409 Session has expired.   <-- session destroyed
```

**SO: DO NOT CALL `quick-login` ON A QA BRANCH.** Set the supplied cookies and use the session as-is.
This **supersedes**, for per-ticket QA branches, the older CLAUDE.md guidance *"prefer quick-login SSO
over raw-cookie API"* — that was learned on the shared `staging`/`qb` estates, where quick-login is the
login mechanism. On a QA branch the cookies are already an authenticated SSO session and quick-login
**destroys** it.

**SECOND GOTCHA — curl gets 401 where the browser gets 200, with the SAME cookie values.** Do not read
a curl `401 sso_required` as "the cookies are dead". On page load the browser acquires a **second,
host-scoped `PHPSESSID`** for `sv<ticket>.qa.shopview.com` alongside the `.qa.shopview.com` one, and
sends the app's `Origin`/`Referer`; a bare curl call has neither. **Verify a session from inside the
page** (`page.evaluate` + `fetch(..., {credentials:'include'})`) before concluding anything:
```js
await page.goto(APP + '/login');            // establishes the host-scoped cookie
const r = await page.evaluate(async API => {
  const x = await fetch(API + '/api/auth/me/fe-permissions', { credentials: 'include' });
  return { s: x.status, b: await x.text() };
}, API);                                     // 200 here = the session is FINE
```

**THIRD GOTCHA — the SSO is Google OAuth, so a dead session cannot be revived from the container.**
Following the API's `sso_redirect_url` lands on `accounts.google.com/o/oauth2/v2/auth`
(`hd=shopview.com`, `redirect_uri=https://auth.qa.shopview.com/callback`). `sv_sso_session` is minted
only by a real Google sign-in — there is **no programmatic recovery**. One careless `quick-login`
therefore costs a human round-trip. **`sv_sso_session` appears to be shared across QA branches and
long-lived; the `PHPSESSID` is the per-session part that dies.**

**FOURTH GOTCHA — the MITM bridge dies when the agent proxy port rotates.** `$HTTPS_PROXY` changed
`36459` → `38595` mid-session; the running bridge kept its stale upstream and every request through it
returned **HTTP 000**. **Re-read `$HTTPS_PROXY` and rebuild the bridge whenever Chromium starts
failing**, and verify it before launching:
```bash
curl -sS -x "http://127.0.0.1:$PORT" -o /dev/null -w "%{http_code}\n" https://<env>.qa.shopview.com/
```
Also: start the bridge as a **background task**, not inside a compound command — a Bash-tool timeout
kills the whole pipeline and can truncate a heredoc written later in the same call.

**Cost of not knowing this: five cookie sets and roughly an hour.** Session cookies last ~24 h
(`Max-Age=86400`), so **one live `PHPSESSID` is enough to work for a whole session** — provided
nothing calls `quick-login`.

## §R — PRODUCTION: seed a work order all the way to an INVOICE (proven 2026-08-10, SV-8769 / SV-8814)

**Read this before doing anything WO→invoice on `app.shopview.com`.** Every line below was proven
live on org `72b2cc90…` ("Bilal-Trucks"), workplace **Trucks Hill 2**
`b617914c-16e9-4485-8e8b-193cd86aa416`, on 2026-08-10. It exists so the endpoint-guessing done that
day never has to be repeated. **§K stays valid** — this extends it with the invoice path and
corrects two of its notes.

### R.0 The one-login rule (unchanged from §K, restated because it bites)
`POST /api/login {username,password}` → 200 + a fresh `PHPSESSID`. **A second login kills the
first**, so log in ONCE and reuse the cookie for API + browser + cleanup. The QA lead editing
settings in his own browser ALSO kills our session — expect a re-login after any settings change he
makes, and just re-run the login step.

Reusable curl helper (secrets stay in `/tmp`, never committed):
```bash
# /tmp/<run>/api.sh  →  ./api.sh GET /api/taxes   |   ./api.sh POST /api/path '{"k":"v"}'
curl -s -X "$M" "https://api.shopview.com$P" -x "$HTTPS_PROXY" \
  -H 'Content-Type: application/json' -H 'Origin: https://app.shopview.com' \
  -H "Cookie: $(cat sess.txt)" -d "$B" -w "\n__HTTP:%{http_code}"
```

### R.1 ⚠️ CORRECTION to §K — the browser needs the MITM BRIDGE on prod
§K says Playwright can point straight at `$HTTPS_PROXY` on prod with no bridge. **On 2026-08-10 that
gave `net::ERR_CONNECTION_RESET` on every navigation.** The fix is the same bridge used for staging
(`staging-bridge.mjs`), plus `--ssl-version-max=tls1.2`. Try direct first; **fall back to the bridge
rather than concluding prod is unreachable.**

### R.2 ⚠️ The SPA localStorage seed — get `fe_permissions_wrapper` RIGHT or the app renders BLANK
A **name array** (`['workOrdersView', …]`) makes the SPA die on boot with
`TypeError: Cannot read properties of undefined (reading 'length')` and a **completely white page**
— easy to misread as a proxy or auth failure. It is neither.
Seed all three, and make the wrapper the **real payload**:
```js
localStorage.user                    = JSON.stringify({data: <login response .data>})
localStorage.fe_permissions_wrapper  = JSON.stringify(<GET /api/auth/me/fe-permissions → .data>)   // the OBJECT
localStorage.token                   = <login response .data.token>
```
`GET /api/auth/me/fe-permissions` → `.data` = `{fe_permissions[], view_mode, cross_toggles,
template_id, template_slug, system_role}`. Fetch it; never reconstruct it.

### R.3 Reference data endpoints
| What | Call | Notes |
|---|---|---|
| Workplaces | `GET /api/staff/my-workplaces` | id + name + timezone |
| Switch workplace | `POST /api/iam/change-location {workplace_id, workplace_timezone}` | → 200 |
| Tax models | `GET /api/taxes` | `isDefault`, `rateTotal`, **`isEnabledLabor`** |
| Labor rates | `GET /api/labour-types` | `name`, `labour_rate`, `id` |
| Customers | `GET /api/customers?limit=N` | ⚠️ `GET /api/customers/{id}` → **404** |
| Vehicles | `GET /api/vehicles?company_id={id}` | ⚠️ the `company_id` filter looks **IGNORED**; `GET /api/vehicles/{id}` → **404** |
| Canned lines | `GET /api/work-orders/canned-lines` | carries `labour_type_id` / `labour_type_name` / `labour_rate` / `time_estimate` / `fixed_price` |
| WO lines | `GET /api/work-orders/lines/{woId}` | the reliable per-WO read |

**⚠️ THERE IS NO WORKING WO-DETAIL ENDPOINT.** `GET /api/work-orders/{id}`,
`/api/work-orders/detail/{id}`, `/{id}/detail`, `/{id}/financial-info` are **all 404**. The WO list
`GET /api/work-orders` returns `{data:{pagination, work_orders:[…]}}` but **its `ids[]` filter is
IGNORED** and it pages at 100 — so you cannot look up one WO by id through it. **Read WO financials
from the UI** (see R.6).

### R.4 Tax comes from the CUSTOMER, not the org default
The org default can be a 0% model while a specific customer carries a real one. **Pick the customer
whose default tax is the rate you need** — that is the whole reason a test asks you to use one named
customer. Confirm it landed by reading the Financial Info panel: the tax row is **labelled with the
tax model's name** (e.g. `15 percent`), not the word "Tax".
**A tax model needs `isEnabledLabor: true`** — a big percentage with labor off yields zero labor tax.

### R.5 Seed sequence that works (each step's exact payload)
```
1. POST /api/work-orders/create
     {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}      → 201 {work_order_id}
2. POST /api/work-orders/{woId}/lines/create-from-canned-line
     {canned_line_id, status:"authorized"}                                          → 201 {line_id}
3. POST /api/work-orders/lines/change            ← ALSO the invoice-rebuild trigger
     {line_id, work_order_id, tech_story, line_name, time_estimate, tech_time, labour_type_id}  → 201
4. (UI) set WO mileage — see R.6
5. POST /api/work-orders/lines/change-status {line_id, work_order_id, status:"complete"}   → 200
6. POST /api/work-orders/change-status       {id,      status:"complete"}                  → 201
```
**Field-name traps that cost real time:**
- line status uses **`line_id`**; WO status uses **`id`** (not `work_order_id`) — each returns
  *"Missing required parameter"* / *"Work Order ID is missing."* for the other spelling.
- `POST /api/work-orders/lines/create` **500s on prod** (§K already says use the canned-line route).
  Its validator order is discoverable though: `work_order_id` → *"Labor or fixed prices must be
  set."* → satisfied by `time_estimate` + `labour_type_id` → then *"Line name is missing."* →
  the field is **`line_name`** (not `name`/`lineName`/`title`). It still 500s after that.
- `POST /api/work-orders/change` (WO update, e.g. mileage) **500s** even with the full create-shaped
  payload. Use the UI.

**Completion preconditions, in the order the API enforces them** (each is a plain error string):
1. *"Line can not be completed without a tech story"* → set `tech_story` via `lines/change`.
2. *"Line can not be completed without a Work Order mileage"* → set mileage (R.6).
3. *"Cannot complete work order with incomplete lines."* → complete every line first.
4. `requireVehicleIdentifier: "vin"` → the vehicle needs a **17-character VIN** or the WO shows
   **"Valid VIN Required"**. **Don't fight it — pick a vehicle that already has one**
   (`[v for v in vehicles if len(v['vin'])==17]`); vehicle-edit endpoints 404.

**Status vocabulary:** `complete` is valid. `completed` / `review` / `reviewed` / `pending_review`
→ *"Wrong status name"*. `invoiced` → *"Work order status cannot be changed manually to invoiced."*
(invoicing is its own action). After Complete: *"Complete work order cannot change its status
again."* — so **get everything right BEFORE completing.**

### R.5a ⭐ ADD A LABOR-ONLY LINE VIA THE "NEW LINE" DIALOG — the reliable way, no canned line, no junk parts (proven prod 2026-08-27)
**Preferred over `create-from-canned-line`**: canned lines on prod carry pre-attached junk part
requests (`"Line can't be completed with unfulfilled part requests."`) that have **no delete option
in the part kebab** (only Move / Add Fee), and a QA-test workplace can have **zero** canned lines
(the picker shows *"No results"*). Build the line by hand instead. **QA-lead rule: never leave any
field empty** — fill all five.
1. `/workorders/{id}/lines` → `button_new_line` (a freshly-created WO may auto-open this dialog).
2. **"What Are You Doing?"** = `select_line_canned_line` — this data-test-id **IS the `<input>`**
   (a q-select with new-value-mode), not a wrapper. Click it, **type a custom name** (e.g.
   `ZZAUTOTEST Labor`), press **Enter** to accept it as a new value, then **Escape** to close the
   menu. It accepts the typed value **even when the dropdown shows "No results"** (0 canned lines);
   the field's own `.value` reads back empty afterwards but the line is created with that **name**.
3. **"Why Are You Doing It?"** = `input_line_description` — fill (free text).
4. **"Labor Rate"** = `select_labour_type` — click, pick the first `.q-menu .q-item` (e.g.
   `General Labor $135`).
5. `input_time_estimate` + `input_tech_time` — fill (`1`/`1`); the technician (`Admin ShopView`)
   is pre-added.
6. `button_save_close`. → a **labor-only line, 0 part_requests**, `status:"authorized"` —
   completable without any receiving step. Then set tech story + mileage + complete per R.5.
Escape any open q-menu before clicking the next field (the menu backdrop swallows clicks — §14d).

### R.6 Reading and writing what the API won't
Boot the browser (R.1/R.2) and go to `/workorders/{id}/lines`.
- **Financial Info** (the numbers that matter) — read the label/value pairs:
  ```js
  document.querySelectorAll('[data-test-id^="item_label_"]')  // key
  document.querySelector(`[data-test-id="item_value_${k}"]`)  // value
  ```
  yields `Parts · Labor · Shop Supplies · Subtotal · <tax model name> · Total · Balance`.
- **Mileage** — `[data-test-id="input_vehicle_mileage"]`: click → `fill('')` → `type()` → **Tab**
  (the Tab is what saves it). Siblings: `input_vehicle_engine_hours`, `input_vehicle_license_plate`.

### R.7 Invoicing
**The Create Invoice button lives on the FINANCE tab: `/workorders/{id}/finance` →
`[data-test-id="button_create_invoice"]`.** It is **not** on Lines, and **not** in the WO `⋮` menu
(that menu is only: Audit Log · Timesheets · Add Work Order Fee / Discount · Delete Work Order).
Other finance-tab controls: `button_download_invoice`, `button_send_email`, `button_print_invoice`,
`button_invoice_settings`, `button_send_to_portal`.
- **`/workorders/{id}/invoices` and `/financial` are 404 routes** — only `/finance` exists.
- `POST /api/invoices/create` exists and takes **`work_order_id`**, but **500s**; use the button.
- **The button is DISABLED with NO tooltip when the org requires review** (`requireReview: true` in
  `GET /api/organizations/settings`). There is no API review transition — `review`/`reviewed` are
  rejected status names and `/api/work-orders/review` is 404. **Ask for `requireReview` to be turned
  off, or find the review action in the UI; do not burn time guessing endpoints.**
- Harmless noise: the finance tab logs several **500s in the browser console** while still
  rendering — not a symptom of your session.

### R.7a ⚠️ THE INVOICE BLOCKER THAT LOOKS LIKE A BROKEN BUTTON: a MISSING CUSTOMER CONTACT
**A work order created through `POST /api/work-orders/create` has NO customer contact** — the create
endpoint **silently ignores a `customer_id` you pass it** — and without a contact the whole invoice
path dies:
- `POST /api/work-orders/invoices/estimate` → **500**
- `GET /api/invoices/{woId}/details?includeDeclined=0` → **500**
- **`Create Invoice` renders DISABLED with NO tooltip** — it looks like a permission or status
  problem and is neither.

**How to prove it in one call rather than guessing for an hour:** run the estimate against a work
order **you did not create**. Ours all returned 500 while every existing WO returned 200 — that
contrast is the whole diagnosis. Then diff `GET /api/work-orders/view/{id}` between the two: the
telling field is **`customer_id`** (the CONTACT, a person — not `company_id`), `None` on ours and set
on theirs.

**The fix:** set the contact in the UI — `[data-test-id="select_customer_contact"]` → pick any
option. Contacts are **not** on a contacts endpoint (all 404); they arrive inside
**`GET /api/customers/view/{companyId}?`** → `data.company.contacts[]`.

**This is the SECOND time this trap has cost us time** — the same missing-contact condition is
recorded in `CLAUDE.md` from SV-8821 (2026-08-04), where a defect was un-reproducible for the QA lead
for the same reason. **Set a contact as a matter of course when seeding any WO you intend to invoice.**

**Gotcha while setting it:** a freshly created WO **auto-opens the "create line" dialog**, whose
backdrop swallows clicks — close it (`button_close_dialog` + `Escape`) before touching the contact
dropdown, and click the dropdown by **coordinate** (`page.mouse.click`) per the Quasar rule in §14d.

### R.7a-bis SET THE CONTACT VIA THE API — and set it BEFORE completing
The UI dropdown fires **`POST /api/work-orders/change-contact`**:
```json
{"work_order_id":"…","vehicle_id":"…","contact_id":"…","update_vehicle":false}
```
Use that directly and skip the UI entirely. Two traps if you do use the UI:
- **Selecting a contact pops a Confirmation dialog** — *"Would you like to change to the new contact
  for this asset permanently?"* with **NO / YES**. Until you answer, **nothing is saved and no
  request is sent** — the field silently reverts and it looks like the click missed. **NO** applies
  it to this work order only (`update_vehicle:false`); YES also changes the asset's default.
- **The contact field is LOCKED once the work order is Complete.** Set it while the WO is still
  editable, or you will be reseeding.

### R.7b Creating the invoice, and NOT paying it
Clicking **Create Invoice** creates the invoice **and immediately opens a "New Customer Payment"
dialog** listing the new invoice with its balance. **Close it** (`button_close_payment_dialog`) —
do **not** press `button_make_payment` / `button_charge_account` — or the invoice stops being
**pending** and every `UpdateTotalWhenWO*` listener stops firing (they all filter on
`Status::PENDING`), which silently invalidates any rebuild test.
Verify afterwards: WO status badge reads **Invoiced**, and the invoice keeps a non-zero Balance.

### R.7c Reading the invoice document itself
`GET /api/invoices/{woId}/details?includeDeclined=0` → `data.collection` with `sub_total_display`,
`tax.amountTotal`, `total_balance`, `work_order.total_labor_price`.
**⚠️ It does NOT always agree with the rendered invoice** — during a pending-invoice rebuild this
endpoint returned the *live* subtotal while the **rendered invoice document still showed the old
one**. **The rendered document is what the customer sees; screenshot THAT**, and treat the endpoint
as a second opinion rather than the truth.

### R.8 Org settings (snapshot before touching)
`GET /api/organizations/settings` → `{requireMileage, requireHours, requireTechStories,
requireVehicleIdentifier, vehicleIdentifier, autoPickInventoryParts, autoApproveLines,
requireVendorInvoiceNumber, requireReview}`. Write with `POST /api/organizations/settings/change`
(full object). **Snapshot it to a file first and restore byte-for-byte** — these are org-wide and
other testers share the org.

---

## §S — STAGING: the same seed, plus feature flags, reversal, and the controls that hide (proven 2026-08-10, SV-8768 plan)

Staging is `app.staging.shopview.com` / `api.staging.shopview.com`. **You cannot re-login from the
container** — staging redirects to Google SSO, so when the session dies you must ask for fresh
`PHPSESSID` / `sv_sso_session` / `cf_clearance`. Budget your run around one session.

### S.1 ⚠️ CORRECTION to §R.7b — the payment dialog must be LEFT OPEN, full stop

§R.7b said dismissing the payment dialog with **Escape** rolls back invoice creation but the close
**button** was fine. **It is not.** On staging, clicking `button_close_payment_dialog` in the same
page session **also** rolls it back: `POST /api/invoices/create` returns **201**, and the work order
stays at **Complete** with no invoice in the list. The only sequence that persists is:

```js
await p.mouse.click(cx, cy);        // button_create_invoice, by coordinate
await p.waitForTimeout(9000);       // let the create call land
await s.browser.close();            // dialog still OPEN — do not touch it
```

Verify afterwards with `GET /api/work-orders/view/{id}` — status must read **Invoiced**.

### S.2 Feature flags — read, and set (the whole set, not a delta)

```
GET  /api/feature-flags                                   # every flag in the system: id + name
GET  /api/organization/feature-flags?organization_id=…     # what THIS org has
POST /api/organization/feature-flags
     {organization_id, feature_flag_ids:[<global feature ids>]}   → 200
```

**Two traps.** (a) The per-org GET returns **join-row ids**, *not* feature ids — you cannot feed them
back. Always resolve names against `/api/feature-flags` and send **those** ids. (b) The POST
**replaces** the set, so include the flags the org already has or you will strip them. Snapshot first.

Worth knowing: a staging org can be missing flags production has. On 2026-08-10 staging carried only
`BillingPortal` + `Deposits` while production had 13 — so a "the panel is gone" check was passing for
the wrong reason. **Read the flags before concluding a UI element is absent because of a code change.**

### S.3 Workplace settings (shop supplies %) — `tax` must be an OBJECT

```
GET  /api/workplaces                       # full records, incl. shop_supplies_charge
POST /api/workplaces/change
     {id, workplace_id, name, address_1, address_2, city, state_or_province, postal_code,
      country_code, telephone, timezone, color, shop_id, remit_to, remit_to_type,
      shop_supplies_charge: 10, min_shop_supplies_charge, max_shop_supplies_charge,
      shopSupplyPercentageEnabled, tax:{id,name}, another:false}     → 201
```

**`tax` as a bare id string returns HTTP 500.** It must be the `{id, name}` object. The UI path is
Administration → Locations → the edit icon at the **far right of the row** (off-screen at 1600px —
scroll or read the payload from the network, which is how this was captured).

### S.4 Line status, including DECLINE

`POST /api/work-orders/lines/change-status {line_id, work_order_id, status}` accepts `complete` but
rejects every spelling of declined. The real call is the bulk one:

```
POST /api/work-orders/lines/change-lines
     {workOrderId, lines:[<line_id>…], field:"status", value:"authorization_declined"}   → 201
```

Valid values seen in the UI submenu: `Authorization required`, **`Declined`** (`authorization_declined`),
`Authorized`, `Complete`. UI path: tick the line's checkbox → `button_line_bulk_action` → **click**
(not hover) "Set line status" → pick the status. Completing a line auto-completes the work order when
it is the last one.

### S.5 Parts on a work order

```
GET /api/work-orders/{id}/parts/list-requests-by-line?search=
```
returns `collection[].part_requests[]` with each request's `id`, `status`, `sell_price`, `quantity`.
`POST /api/work-orders/parts/delete {part_id, work_order_id}` rejects a **part request** id with
`{"part_id":"Not found"}` — the delete for a request is on the row's Action kebab
(`button_part_request_action`), which sits **off-screen to the right** at 1600px.

**Guard worth knowing:** `Line can't be completed with unfulfilled part requests.` A canned line that
carries a part therefore blocks completion — and so blocks invoicing — until the part is received or
the request removed.

### S.6 Audit Log and the history snapshot

The **Audit Log** is *not* a tab. It is under the **⋮** on the Lines tab
(`button_work_order_nav_bar_menu`) → "Audit Log", and it opens a **Work Order Log** dialog listing
Invoice created / Reviewed / Fee added / Line completed with amounts. `link_history_tab` exists in the
DOM but is inside the overflow and clicking it does nothing.

Rows for status events carry a **clock icon**; clicking it navigates to
`…/workorders/{id}/finance?historyId=<uuid>` — the work order **as it was at that moment**. That is
what the SV-8768 plan means by "open that history entry".

The API twin is `GET /api/work-orders/{id}/history` (adjustment/audit rows, paginated).

### S.7 Reversing an invoice

Finance tab → `button_wo_invoice_menu` → menu is `["Reverse","Issue Credit"]` → click **Reverse** →
confirm dialog `["close","Reverse","Cancel"]`. The work order returns to **Complete** and the
processing fee drops back to its pre-invoice value. No API route for this was found
(`/api/invoices/reverse|void|cancel` all 404).

### S.8 Creating a line when the API refuses

`POST /api/work-orders/lines/create` returns `{"error":"Labor or fixed prices must be set."}` for a
bare canned-line id and **HTTP 500** when labour fields are added. Drive the dialog instead: it
auto-opens on a zero-line work order, otherwise `button_new_line`. Fill
`select_line_canned_line` by **typing a name and pressing Enter** (a free-text name is accepted —
"No results" in the dropdown is fine), then the Labor Rate select, then `input_time_estimate` /
`input_tech_time` (**hours**, not minutes). Save with **Save & Close** clicked by coordinate.

⚠️ **Production's dialog differs**: it has no `input_line_description`, and `input_time_estimate` /
`input_tech_time` carry **no data-test-id** — target them via `.q-field:has-text("Estimated Time") input`.
Production's Enter-select fires `POST /api/work-orders/{id}/lines/create-from-canned-line`, which
copies the canned line's **parts** too; fix the rate/time afterwards with `lines/change`.

### S.9 Quasar clicks — the standing rule, restated because it cost time again

`locator.click()` times out against Quasar menus and dialogs ("subtree intercepts pointer events").
**Always** take `boundingBox()` and use `page.mouse.click(x + w/2, y + h/2)`. Submenus open on
**click**, not hover.

### S.10 The Customer Invoice CSV export — Reports → Export Reports

**This is the "Customer Invoice CSV" the Fees & Discounts / invoicing plans keep referring to.**

UI: `Reports` → **Export Reports**, at the **bottom of the ACCOUNTING group** in the left sidebar,
below *IBS Batches* and *QB Unexported*. It opens an **Export Report** dialog with two selects:

* `select_report_name` — Customer Contact · **Customer Invoice** · Customer Payment · Customer Credit
  Memo · Vendor Contact · Vendor Bill · Vendor Bill Payment · Vendor Credit Memo · Payroll Timesheet ·
  Journal Entry
* `select_date_range` — Custom · Today · Yesterday · This Week · Last Week · This Month · Last Month

⚠️ Option text comes back as `"check Customer Invoice"` — the Quasar tick icon renders as the word
`check` inside `innerText`. **Strip a leading `check` before matching**, or every match fails silently.

⚠️ The route `/reports/export-reports` **404s**. It is a dialog on whatever reports page you are on —
click the sidebar item, don't navigate.

API (same thing, no browser needed):

```
GET /api/reporting/export/customer_invoice?report=customer_invoice&range=today
```

`range` takes `today|yesterday|this_week|last_week|this_month|last_month|custom`. **The UI download
gives raw CSV; the direct API call returns it JSON-wrapped as `{"data":["<csv text>"]}`** — unwrap
`data[0]` before parsing.

Columns: `InvoiceNo, Customer, InvoiceDate, DueDate, Terms, Location, Memo, Item(Product/Service),
ItemDescription, ItemQuantity, ItemRate, ItemAmount, ItemTaxCode, ItemTaxAmount, "ShopView Products
and Services"`. One row per invoice line; `Item(Product/Service)` is `Labour` / `Supplies` /
`Inventory` / `Fee`. A non-taxable processing fee carries `ItemTaxCode = Exempt` and `0` tax. Declined
lines do not appear at all.

⚠️ **Date range is in the ORG's timezone.** On an Asia/Dubai org, invoices created in our afternoon
land on the *next* calendar date, so they show under **Today** while ones from a few hours earlier
show under **Yesterday**. Pull both before concluding a record is missing.

### S.11 ⚠️ THE LESSON THAT COST THE MOST TODAY: never conclude "it does not exist" from a truncated read

The Export Reports item above was declared **not found** for hours. The cause: a page-text dump was
sliced to the first N characters and the slice ended at *IBS Batches* — two entries above it. Four
follow-up probes then "confirmed" the absence, each of them looking somewhere it was never going to be.

**The rule: an absence is a claim, and a claim needs the same rigour as a finding (Standing Rules
12/17/50).** Before writing "there is no X":

1. Print the **whole** container's text, never a slice — or grep the slice for what you expect and say
   so if it is truncated.
2. Enumerate the **full** nav/menu/DOM list (`[...document.querySelectorAll("[data-test-id]")]`,
   or every `a`/`.q-item`), don't eyeball a screenshot that may be cut off at the viewport edge.
3. Check the **feature flags** — a control can be absent because the org lacks the flag, not because
   the build lacks the code (this bit us twice today: ShopCoach in §S.2, and here).
4. Say **"not found"** with the exact places looked, never **"does not exist"**.

Same failure mode, same day, different surface: the part-row Action kebab and the Locations edit icon
were both "missing" because they sit **off-screen to the right at a 1600px viewport**. Scroll the
container or read the network payload instead of trusting what rendered.

---

## §T — PER-TICKET QA BRANCHES: the fast seed, and the four traps that eat a night (proven 2026-08-19, SV-8815)

Branch `sv8815.qa.shopview.com` / `sv8815api.qa.shopview.com`, build `v3.8-1f5fb3c`. Everything below
was executed, not inferred.

### T.1 ⚠️ TRAP 1 — `POST /api/work-orders/create` IGNORES the `workplace_id` you send

It uses **the session's active location**. Get this wrong and three things fail *silently and
confusingly at once*: the work order picks up a different location's tax, the canned-line dropdown
shows **"No results"** (canned lines are location-scoped), and **Save & Close no-ops with no error**,
so you sit there watching lines fail to appear.

**Always pin the active location first, through the profile menu** (`POST /api/iam/change-location`
alone is not enough — the SPA keeps its own):

```js
profile_menu_button  ->  read "Change Location: <name>" out of the .q-menu innerText
                     ->  select_location (click the RIGHT edge, x + width - 30)  ->  pick the option
```
Reusable helper: `ensureHD()` in the SV-8815 harness. **Cheap sanity check:** create a throwaway WO
and read `workplace_id` off `GET /api/work-orders/view/{id}` before trusting a whole run.

### T.2 The FAST line builder — 3 lines in 3 seconds instead of 90

The UI's **Save & Close** on the New Line dialog fires exactly this, so skip the browser:

```
POST /api/work-orders/{WO}/lines/create-from-canned-line
     {another:false, canned_line_id, work_order_id, status:'authorized'}     -> 201 {line_id}
POST /api/work-orders/lines/change
     {line_id, work_order_id, line_name, tech_story, time_estimate, tech_time, labour_type_id} -> 200
```
- **`POST /api/work-orders/lines/create` 500s** ("Labor or fixed prices must be set" first if you send
  nothing), and a bare `POST .../lines/` **404s**. Use `create-from-canned-line`.
- **`tech_story` must be ≥ 2 characters** — a 1-char story returns
  `400 {"techStoryAtLeastTwoCharactersLong": ...}`.
- **Labour types are per workplace.** A type created at one location answers
  `400 "Labor type not found for this workplace"` at another. Create one per location you use.

**Dialling a line to an exact dollar amount** (essential for any rounding/tax work): create a labour
type at **`labour_rate: 1`** — the field is in **DOLLARS**, not cents — then
`time_estimate = amount × 60` minutes. Labour hours are rounded to 2 dp, so any 2-dp dollar amount is
reachable exactly. `GET /api/work-orders/canned-lines` returns `total_parts` per line; **filter
`Number(total_parts) === 0`** (42 of 79 on this branch) so nothing blocks completion.

### T.3 Complete + invoice, entirely by API — the chain that works

```
POST /api/work-orders/change-mileage      {work_order_id, mileage:'123456'}   -> 201  (STRING)
POST /api/work-orders/lines/change-story  {line_id, tech_story, work_order_id} -> 201
POST /api/work-orders/lines/change-status {line_id, work_order_id, status:'complete'} -> 200
POST /api/work-orders/change-status       {id, status:'complete'}             -> 201  (field is `id`)
POST /api/invoices/create                 {work_order_id}                     -> 201
```
**CORRECTION to §R.7: `POST /api/invoices/create` does NOT 500 on this branch — it returns 201** and
the work order goes to **Invoiced**, with no browser and no payment dialog to nurse. The contact is
still mandatory (§R.7a): `POST /api/work-orders/change-contact {work_order_id, vehicle_id, contact_id,
update_vehicle:false}`, contact ids from `GET /api/customers/view/{companyId}` → `company.contacts[]`.

### T.4 ⚠️ TRAP 2 — the two invoice endpoints are NOT the same thing

- **`GET /api/invoices/{invoiceId}/view` = THE ISSUED INVOICE.** It carries the invoice's own **frozen
  tax snapshot** (its own rate ids, distinct from the live tax model's), `rates[].amount` at 4 dp plus
  a rounded `amountTotal`, `shop_supplies_cost`, `paid_balance`, `total_balance`, and the real
  `created_on`.
- **`GET /api/invoices/{workOrderId}/details` = A LIVE RE-PRICE of the work order.** Same-shaped
  payload, so it looks authoritative — but for a February-2025 invoice it returned **today's** date,
  **today's** location tax model and a different subtotal.

**Anyone asking "did this invoice move?" against `details` will report a false alarm.** Use `/view`.
List every invoice with **`GET /api/invoices/list?pagination[rowsPerPage]=3000`** (`/api/invoices`
404s); amounts there are **integer cents** (`subtotal`, `subtotal_with_tax`) beside display strings.

### T.5 Payments by API — read the balance off the screen, not the invoice doc

```
GET  /api/customer-account/payment-methods           -> {data:{data:[{id,name,code,type}]}}   (/api/payment-methods 404s)
GET  /api/customer-account/list-unpaid-transaction?accountId=…&pagination[rowsPerPage]=1000
        -> data.response.collection[]   <-- note the EXTRA `response` level
POST /api/customer-account/create-customer-payment
        {account_id, payment_date (ISO), payment_method:'CASH', reference_number:null, description:null,
         transactions:[<the whole collection row, plus transaction_payment_amount and index:0>],
         primary_id:null, new_credit:0, new_deposit:0, applied_credits:[], applied_deposits:[],
         ibs_batch_id:null, payment_amount}                                    -> 201
```
`account_id` comes back in the `invoices/create` response as `customer_account_id`. **Send the whole
transaction row back, not a trimmed object** — an empty-body probe just 500s, so don't try to guess
the shape from errors.

**Where to read a balance:** the work order's **Financial Info** panel
(`/workorders/{id}/finance`, `[data-test-id^="item_label_"]` + `item_value_<k>`) gives
`Parts · Labor · Shop Supplies · Subtotal · <tax model name> · Total · Payments · Balance` — the
tester-facing truth. The invoice document's `total_balance` is the invoice **amount** and does not
move when a payment lands.

### T.6 Taxes and locations by API

```
POST /api/taxes  {name, isEnabledLabor, isEnabledParts, isEnabledShopSupplies, isDefault,
                  rates:[{name, percentage}]}                                  -> 200
```
**`POST /api/taxes/create` 400s with `{"tax":"Invalid UUID"}`** however you shape it — the real route
is the bare **`POST /api/taxes`**, and it must NOT carry `id`/`tax` fields. Multi-rate is just several
entries in `rates[]`. Location settings: `POST /api/workplaces/change` per §S.3 — and **`tax` must be
the `{id,name}` OBJECT**. `bookkeeping_enabled` is **not** writable through it (silently ignored).

### T.7 ⚠️ TRAP 3 — fees and discounts: the gate is a QuickBooks ITEM MAPPING, and it is enforced on BOTH sides

**Where the control actually is** (this is the bit worth never re-deriving):

```
WO -> /workorders/{id}/lines  ->  [data-test-id="button_work_order_nav_bar_menu"]   <-- the WO kebab
                              ->  menu: Audit Log | Timesheets | Add Work Order Fee / Discount | Delete Work Order
                              ->  [data-test-id="menu_item_add_adjustment"]
dialog "New Work Order Fee / Discount":
   select_adjustment_template (Apply From Template) · input_adjustment_name · select_adjustment_type
   select_adjustment_calc_type · input_adjustment_amount · select_adjustment_taxable
   adjustment_preview · button_add_adjustment · banner_adjustment_mapping_guard · link_qb_settings
line level: [data-test-id="button_add_labor_adjustment_<lineId>"] on each line row
```
The dialog **opens fine**, the template applies, and `adjustment_preview` computes live
(*"Work-order subtotal $27.81 | Fee +$5.00 | New work-order subtotal $32.81 | Tax is recalculated on
save."*) — but **`button_add_adjustment` is `disabled` + `aria-disabled="true"`** and the API answers
**409 `"Connect a QuickBooks item for fees before adding a fee."`** (same for discounts). FE and BE
enforce the same guard, so this is **not** a Rule-24 FE-only gate.

**THE EXACT GATE — don't guess at it again:**

```
GET /api/bookkeeping/adjustment-item-mapping-status
  -> {"data":{"quickBooksConnected":true,"feeItemMapped":false,"discountItemMapped":false}}
```
The banner component (`AdjustmentMappingGuardBanner.vue`) defaults both flags to **true** and only
blocks when the fetch returns false: `isKindBlocked = kind==='discount' ? !discountItemMapped :
!feeItemMapped`. **So one mapped Fee item and one mapped Discount item is the whole unblock.**

**BOTH ENTRY POINTS EXIST AND BOTH HIT THE SAME GATE** (confirmed 2026-08-20 after the QA lead pointed
out the second one):

```
(a) WO kebab      button_work_order_nav_bar_menu -> menu_item_add_adjustment
(b) PART ROW kebab button_requested_part_context_menu_<partRequestId>_line_<lineId>
                  -> menu: Move | Add Part Fee / Discount
                  -> menu_item_add_adjustment_part_<partRequestId>
```
Both open `dialog_adjustment` (`select_adjustment_template`, `input_adjustment_name`,
`select_adjustment_type`, `select_adjustment_calc_type`, `input_adjustment_percent`,
`input_adjustment_max_cap`, `select_adjustment_taxable`, `text_adjustment_taxable_note`,
`adjustment_preview`), and both leave `button_add_adjustment` **disabled** behind
`banner_adjustment_mapping_guard`. ⚠️ **The part row must actually be EXPANDED first, and the expand
click does not always take on the first attempt** — click `button_line_expand_<lineId>`, then **PROVE
the part row rendered** by finding the part's own description in `document.body.innerText`, and retry
if it did not. Assuming the expand worked is what made this path look absent.

⚠️ **`quickBooksConnected: true` FROM THAT ENDPOINT IS NOT TRUSTWORTHY — read all three signals.**
An earlier version of this section said to trust the status endpoint over the page. **That was wrong,
and it made me tell the QA lead QuickBooks was connected when it is not.** On sv8815 the three signals
disagree, and the endpoint is the odd one out:

| signal | says |
|---|---|
| `GET /api/bookkeeping/adjustment-item-mapping-status` | `quickBooksConnected: **true**` |
| `GET /api/bookkeeping/products-and-services` | **400 `"Bookkeeping is not configured"`** |
| `GET /api/bookkeeping/integration` | **200 with an Intuit OAuth `authUrl`** — i.e. still waiting to be connected |
| the admin page | only `button_quickbooks_connect`, no mapping fields |

Three of the four say not connected. **So the org genuinely has no QuickBooks company attached, the
`true` flag is misleading, and the item mapping CANNOT be created from inside ShopView** — the mapping
UI (`QuickBooks.HlYHSkpv.js` — `settings_group_account`, product-and-service options) has nothing to
populate itself from. That makes this a **genuine external dependency** (an Intuit account we do not
have), which is the one permitted non-seedable blocker under Standing Rule 14. **The lesson: a single
boolean is not "reading the state" — correcting an inference with another inference is how you get it
wrong twice.**

**What does NOT get you past it** (all tried, all refused): an adjustment **template**
(`POST /api/adjustment-templates {kind,name,calculationType,defaultAmount,defaultScope,defaultMaxCap,
autoApply,taxable}` → **201**, no guard on template creation — but applying it still leaves Add
disabled and the API still 409s); passing `templateId` to `adjustments/add`; the line-level labour
adjustment button; turning `bookkeeping_enabled` off via `workplaces/change` (silently ignored);
`PUT /api/bookkeeping/settings {settings:{feeItemMapped:true,…}}` (**500**). The admin
**New Fee / Discount** template dialog has **no QuickBooks-item field**, so the mapping is not set
from there.

**The one-step unblock for a tester:** map a Fee item and a Discount item under
**Settings → QuickBooks** on an org whose bookkeeping is configured, then re-read
`adjustment-item-mapping-status` and both flags flip to true.

**Related endpoints worth having:** `GET /api/bookkeeping/integration` (auth URL + `toggles` incl.
`advancedModeEnabled`, `allocateShopSuppliesByClass`, `fallbacks{…fallbackProductId…}`, and a `syncs`
map of 11 sync switches) · `PUT bookkeeping/settings` = `saveQuickBooksData` ·
`POST /api/product-and-service/create {name, category}` (category is an enum — `fee`, `discount`,
`adjustment` are all rejected with *"Selected category is invalid."*; the valid set is in the
QuickBooks page UI) · `POST /api/product-and-service/{id}/update|delete` ·
`GET /api/adjustment-templates?pagination[rowsPerPage]=50` → `{data:{templates:[…]}}`.

### T.8 ⚠️ TRAP 4 — THERE ARE TWO RECEIVE SURFACES AND ONE OF THEM IS DEAD (corrected 2026-08-20)

**Receiving a part WORKS.** An earlier version of this section said it returned HTTP 500 and listed six
ruled-out causes. **That was wrong, and the ruled-out table was worse than useless — it told the next
reader to stop looking.** The 500 was real but it came from a screen the product does not drive a
work-order part request through any more. **This is the same mistake as SV-8779** (see the pre-action
check in §U.0): both times I reached for `/accept-delivery` and the live path was the part row.

| | ✅ THE LIVE ONE — use this | ❌ THE DEAD ONE — do not use |
|---|---|---|
| how you get there | work order → **Lines** tab → the part row's blue **Receive** button, `button_part_request_action` | **Parts → Deliveries**, or `/accept-delivery/{orderId}` |
| first call | `POST /api/inventory/orders/receive-view` `{workOrderId, vendorIds:[…]}` → **200** | — |
| lands on | `/order/{poId}?receive=1&returnTo=WorkOrder&returnId=…&returnLineId=…&vendorIds=…` | `/accept-delivery/{orderId}` |
| fields | `input_invoice_{poId}`, `input_qty_{itemId}` | `input_invoice_number`, `date_input_`, `input_delivered_quantity_0`, `input_base`, `input_delivery_note`, `badge_vendor_missing` |
| save | **`POST /api/orders/receive-requested-parts`** → **200**, part → `received` | `button_receive_delivery` → `POST /api/inventory/orders/accept` → **500** |

**The working recipe, proven twice** (S-15999 and S-16001, build `v3.8-1f5fb3c`):

```
1. active location == the work order's own location            (T.1)
2. POST /api/work-orders/part/make-request  {work_order, line, description, part_number,
       quantity, part_source_type:'vendor', is_authorized:false, part_category_id,
       cost, sell_price, vendor_id}                                            -> 201
3. POST /api/work-orders/part/perform-request-status-action
       {part_request_id, action:'order'}                                       -> 201   (part = Awaiting)
4. click  [data-test-id="button_part_request_action"]   ("Receive" on the part row)
5. type into  input_invoice_{poId}   and   input_qty_{itemId}
6. click  button_receive_po_{poId}   ->  POST /api/orders/receive-requested-parts -> 200
```
⚠️ **Keep the vendor invoice number short — there is a 21-character limit** (a longer one is rejected
and reads like a receive failure; cost time on SV-8781).

**Two things that are NOT the variable** — I tested both against the dead screen and they changed
nothing, because the *screen* was the variable: ticking **Line Approved** on the New Line dialog, and
choosing the **vendor inside the New Part Request modal**.

**RETURNING a received part** — `POST /api/work-orders/part/make-return-request`
`{part_id, work_order_id, quantity, return_reason}` → 200. Two traps in one call:
**`part_id` is the PART OBJECT's id** from `GET /api/work-orders/lines/{WO}` →
`collection[].parts[].id` (match on `part_request_id`) — *not* the part-request id; and
**`return_reason` is required** (e.g. `Incorrect`). Get either wrong and it is a 400 reading
`{part_id:"Not found", return_reason:"Missing required parameter"}`. The request comes back with
`status: "returned"` immediately — there is no approve step.

**What a return does and does not do** (measured in both rounding modes, 2026-08-20):
the **issued invoice does not move** (correct), but on the **invoiced** work order the Financial Info
panel shows a subtotal reduced by the returned part **with the tax line still at the invoiced figure**
— so its Total is neither the invoiced total nor a clean recompute, while **Balance** correctly still
holds the invoiced amount. Identical on both modes, so it is not a rounding-setting effect.

**A credit memo is NOT a part return.** `POST /api/credit-memos` takes **`customer_account_id` and
`amount` only** — no tax, no rate, no lines (`{creditMemoId, creditNumber:"CM-100", totalAmount,
openBalance, status:"open", refundPaymentId}`). Siblings: `credit-memos/{id}/void`,
`credit-memos/{id}/cash-out`, `credit-memos/{id}/pdf`. So there is **no tax in a credit memo to
pro-rate** — worth knowing before anyone spends a night trying to test tax on one.

**For the record, the dead screen's payload** (kept only so nobody re-captures it):
`POST /api/inventory/orders/accept` `{"id","invoiceNumber","invoiceDate","note","items":"<JSON
STRING of whole order-item records + quantity_received + total>","total","orderStatus":"fulfilled","tax"}`
— `items` is a JSON *string*, and a partial body 400s in **snake_case** while the working body is
camelCase, so don't reverse-engineer the shape from those errors.

**Getting a part onto a line — the payload that WORKS** (lifted from `ShopCoachVehicleLineBuilder`, not
guessed):

```
POST /api/work-orders/part/make-request
     {work_order, line, description, quantity, part_source_type:'vendor',
      is_authorized:false, part_category_id}                                  -> 201
```
**The field names are `work_order` and `line`, NOT `work_order_id`/`line_id`** — that mismatch is what
made this look impossible. `part_category_id` can be the *Uncategorized* category id. For an
**inventory** part the shape is `{description, part_number, part_category_id, vendor_id:null, cost,
sell_price, inventory_part_id, part_source_type:'inventory', core_charge}`; for a **catalogue** part
`{catalogue_part_id, inventory_part_id:null, part_source_type:'vendor', cost:null, sell_price:null}`.
Then `POST /api/work-orders/part/change-request {id, sell_price, cost, quantity}` → 200 to price it, and
`perform-request-status-action {part_request_id, action:'order'|'pick'}` → 201 to move it along.

**⚠️ RETURN and the part-row actions are on a RIGHT-CLICK CONTEXT MENU, not a kebab.** From
`WorkOrderLineParts.Cb2440fQ.js`: the part row renders a Quasar `context-menu` holding **Move** /
**Return** (staged parts) and **Move** / **Add Part Fee / Discount**
(`menu_item_add_adjustment_part_context_<partId>`, requested parts). Gating worth knowing:
**Return is hidden when `inventory_part_id` is set** (inventory parts are deleted, not returned) and
**disabled when `part_source_type === 'found'`** with the tooltip *"Found parts cannot be returned.
Please delete."* Requested-part actions need `workOrderLinesCreateAndEdit`.

**The WO Parts tab is `/workorders/{id}/part-requests`** — `/workorders/{id}/parts` renders an error
page ("The technician says this page is totaled"). Ids there: `table_part_requests`,
`button_expand_collapse_all`, and the row Actions column.

### T.8b Getting the CREDIT for a returned part — Parts → Returns → Receive Credit (proven 2026-08-20)

**This is the flow that actually credits a returned part, and it is a VENDOR credit — not a customer
credit and not `POST /api/credit-memos`.** Recorded because I first went looking in the wrong place
entirely and told the QA lead a credit had no tax in it.

```
Parts → Returns  (/parts/returns, tabs: tab_returns | tab_credits)
  tick  return_request_checkbox_<returnRequestId>
  ->    button_receive_credit  appears top-right
  ->    /parts/confirm-return?ids=<returnRequestId>&isManualReturn=0   ("Process Return")
  fields: select_vendor · input_packaging_slip · input_credit_memo_number · date_input_ (Credit Date)
          input_received_quantity_0 (Accepted Quantity) · input_return_note
  ->    button_post_credit   ->   POST /api/inventory/returns/create   -> 200
```
After posting, the row leaves the Returns tab. `button_manual_return_actions_<id>` is the per-row kebab;
`button_create_return` makes a manual one.

⚠️ **TWO DIFFERENT FIELDS SHARE `data-test-id="input_base"` on this screen** — the per-row
**Restocking Fee** and the **Tax** in the totals block. `page.locator(...).first()` picks the
restocking fee, so a script aiming at Tax silently edits the fee instead (it did, to me). **Disambiguate
by context, not by id** — read every `input` with its surrounding label text and match on that. This is
an automation hazard worth a ticket in its own right.

**What the numbers mean** (measured, both rounding modes, identical):
- **Subtotal = the part's COST**, not its sell price ($10.00, not $80.00).
- **Tax is pre-filled and editable**, computed as **cost × the workplace tax rate** — the payload
  carries **`workplace_tax: 5`**, giving $0.50 on $10.00 — **which is NOT the location's sales-tax
  model** (that was `ZZ8815 9.75pct`). So a vendor credit's tax has nothing to do with the sales-tax
  rounding setting, and reads the same under both modes.
- Entering a restocking fee **reduces the subtotal** and the tax recomputes on the reduced base
  (0.98 fee → subtotal 9.02, tax 0.45, total 9.47).
- **Posting the credit does NOT move the customer's issued invoice** — verified byte for byte.

### T.8c The CUSTOMER credit — "Issue Credit" on the customer's Invoices tab (proven 2026-08-20)

**This is the OTHER credit, and it is the one the sales-tax rounding setting engages.** T.8b is the
**vendor** credit (purchase tax on the part's *cost*). This one credits **the customer** for a part
on **their invoice**, pro-rated from the **frozen invoice tax**. They are easy to confuse — the
developer's own test plan mixed them up, which sent a whole QA pass to the wrong screen.

```
Customer → Invoices tab      (/customers/{companyId}/invoices)
  tick the checkbox on EXACTLY ONE invoice row
  ->  button_issue_credit_customer      ("Issue Credit", page header, top right)
  ->  IssueCreditMemoDialog
      checkbox_credit_memo_type_parts   ("Parts are being returned")  - ON by default
      radio_credit_memo_outcome_hold ("Issue Store Credit", default) | ..._refund ("Issue Refund")
      input_credit_memo_reason          - REQUIRED, submit stays disabled until it has text
      date_input_credit_memo_date · select_credit_memo_payment_method
      table_parts_return, per part row:
        checkbox_select_parts_{workOrderPartId}      <-- see the trap below
        input_parts_return_quantity_{id}             ("Qty To Credit")
        input_parts_return_restocking_fee_{id}
        currency_text_parts_return_total_{id}
      totals: currency_text_parts_return_{subtotal|tax|total}
  ->  button_confirm_dialog             ("Issue Credit" INSIDE the dialog)
        -> POST /api/credit-memos -> 201 {creditMemoId, creditNumber "CM-####", totalAmount (CENTS)}
```

⚠️ **EVERY PART ROW STARTS TICKED.** The dialog opens with the whole invoice selected, so
**clicking a row's checkbox DESELECTS it**. To credit one part you untick the others — ticking the
one you want does the opposite of what it looks like, and the totals quietly follow.

⚠️ **The page header and the dialog both have a button reading exactly "Issue Credit".** Matching on
the visible text hits the header one, which just reopens the dialog and posts nothing. Use
**`button_confirm_dialog`**.

**Preconditions the dialog enforces, with its own wording:** the customer must have a customer
account (button disabled otherwise) · *"Credits can only be issued for one invoice at a time."* ·
*"Switch to this invoice's location to issue a credit."*

**Where the tax comes from** — server-side, on every quantity change (debounced):
`POST /api/work-orders/parts/calculate-tax` `{items:[{workOrderPartId, quantity}]}` →
`{totalTaxAmount, items:[{workOrderPartId, taxAmount}]}`. **`taxAmount` is in CENTS**; the UI
divides by 100. `totalTaxAmount` is in dollars. Reading these two as the same unit is an easy
off-by-100.

**What the numbers do** (measured both ways, 2 × $5.10 parts at GST 5%, build `v3.8-0cb5771`):
- **Invoice total**: invoice tax **0.51** → credit splits **0.26 + 0.25 = 0.51**, rows $5.36/$5.35
- **Line by line**: invoice tax **0.52** → credit splits **0.26 + 0.26 = 0.52**, rows $5.36/$5.36
- crediting the whole invoice in **separate** credit memos still sums to the invoice **to the cent**
  (CM-3574 $5.35 + CM-3575 $5.36 = $10.71) — the residual cent is allocated, never dropped or doubled
- **`GET /api/part-sales/{INVOICE_id}/list-credit-available-parts`** feeds the table — note it takes
  the **invoice id**, not the part-sale/work-order id, and returns `[]` for parts that were never
  received. **It returns HTTP 500 for a part with NO catalogue entry** (i.e. source **"found"**), and
  the dialog renders that failure as the plausible-but-wrong *"No parts on this invoice are available
  for credit."* Use **vendor-sourced** or inventory parts and it answers 200.

### T.8d Seeding a clean parts-only invoice (proven 2026-08-20) — the four things that bite

A **part sale** is the cleanest billable-parts shape: no labour, no shop supplies, one `Default`
line. `POST /api/part-sales {company_id}` → the id **is** a work-order id (`/work-orders/view/{id}`,
number `P-####`, rendered in grids as **`P9-####`** with the shop-id prefix — match on the digits).

1. **The company needs a CONTACT** or `POST /api/part-sales` answers *"Customer not found"*.
   `POST /api/contacts/create {company_id, first_name, last_name}`. Same trap as SV-8821.
2. **The org auto-applies its default fees/discounts to every new part sale** — here **+$50.52 net**
   on a $10.20 invoice, which makes any tax arithmetic unrecognisable. Strip them:
   read `work_order.adjustments`, then `POST /api/work-orders/adjustments/remove {adjustmentId,
   workOrderId}` → 204 each. **They come back when you edit parts, so strip them again immediately
   before invoicing.**
3. **The line starts `authorization_required`** and part actions refuse with *"This action can only
   be performed on the authorized lines."* → `POST /api/work-orders/lines/change-status {line_id,
   work_order_id, status:'authorized'}`.
4. **`part_source_type` is one of `inventory | vendor | found`** (`GET /api/work-orders/part/request-sources-list`).
   Use **`vendor`** — `found` needs no catalogue part and therefore breaks the credit screen (T.8c),
   and `inventory` needs a real bin allocation at the active location. Recipe:
   `make-request {line, work_order, description, quantity, part_source_type:'vendor', part_category_id}`
   → `change-request {id, …, vendor_id, part_number, cost, sell_price}`
   → `perform-request-status-action {part_request_id, action:'order'}` (creates + links the PO;
   a hand-built `POST /api/inventory/orders/create` leaves `part_request_id: null` and is useless)
   → **receive on the screen** (T.8) → `POST /api/invoices/create {work_order_id}`.

⚠️ **A vendor invoice number must be UNIQUE as well as ≤21 chars.** Reusing one returns
*"There is already invoice with number: …"*, which reads exactly like a receive failure.

⚠️ **Do not hand-build the `receive-requested-parts` body.** The screen sends ~25 fields per item;
a 5-field version returns **500**. Drive the screen (T.8) — it worked first time — or capture the
payload from it once and replay that.

### T.9 The Customer Invoice export carries PER-LINE TAX — this is where you reconcile

`GET /api/reporting/export/customer_invoice?report=customer_invoice&range=today` (§S.10) returns a
per-line row with **`ItemTaxCode`** and **`ItemTaxAmount`**. Summing `ItemTaxAmount` per `InvoiceNo`
is the cheapest exact reconciliation available anywhere in the app — it caught the invoice-total
tax split allocating its residual cent to individual lines (302.81 → 302.78 by shedding a cent from
three of thirteen lines). **The rendered invoice document does NOT print a per-line tax column**, so
the export is the only per-line tax surface. Header:

```
InvoiceNo,Customer,InvoiceDate,DueDate,Terms,Location,Memo,Item(Product/Service),ItemDescription,
ItemQuantity,ItemRate,ItemAmount,ItemTaxCode,ItemTaxAmount,"ShopView Products and Services"
```
⚠️ Amounts over 999 are **comma-formatted inside the CSV** (`2,081.59`) — strip commas before
`float()`, or a reconciliation script dies on the one row that matters.

### T.10 The tax arithmetic, as observed (both modes, all confirmed live)

Per **tax rate**, over the taxable base (labour + parts + taxable adjustments + shop supplies when the
tax model has shop supplies enabled):

- **line by line** — round each line's tax to the cent, then add up.
- **invoice total** — add the taxable lines first, round the tax once.
- **each rate is rounded on its own base**; the rate rows always sum to the invoice tax, in both modes.
- rounding is **half away from zero**.

Wire value for the setting is **`total_rounded`** — `invoice_total` and `total` both return
`400 "Invalid sales tax rounding method."` while the UI calls the option "Invoice total".
`GET /api/workplaces` reports it back as **`salesTaxRoundingMode`**.

---


### T.11 Labor rates (labour-types): seed at scale + count PAST a capped list (proven 2026-08-27, SV-9194)

**Endpoints** (API host `sv####api.qa.shopview.com`, org/workplace taken from the session):
- **List:** `GET /api/labour-types` → `{data:{collection[], pagination:{page,rowsPerPage:100,...}}}`. ⚠️ **HARD-CAPPED at 100 and IGNORES every pagination param** — `page`, `offset`, `limit`, `perPage`, `rowsPerPage` all return the same first 100. (This cap *is* the SV-9194 bug surface — the WO Labor Rate dropdown reads this endpoint.)
- **Create:** `POST /api/labour-types/create {name, labour_rate, is_default}` → **201**. Auto-assigns product/service **"Labor"** (`1e6f9231-…` on the shared org) and the session's workplace/org — no other fields needed. Empty-body probe names the 3 required fields.
- **Search:** `GET /api/labour-types?search=<term>` — **PRECISE substring match on name**, but ALSO caps at 100. No `/count` endpoint (404).

**Counting a list that caps at N and ignores paging (general trick, not just labor):** if `search` is precise, count with **prefix buckets whose maximum possible size ≤ N**. For rates named `ZZAUTOTEST WO Rate 034..300`: search `"...Rate 0"` (034-099, ≤66), `"...Rate 1"` (100-199, ≤100), `"...Rate 2"` (200-299, ≤100), `"...Rate 30"` (300+, small). Each bucket's max = the cap, so a returned count is unambiguous; sum them. This gave an exact 292→300 total when the list endpoint could only ever show 100.

**Seeding to an EXACT total (the reliable pattern):** get a trustworthy baseline while it is still under the cap (here 32) → create in a loop, but **trust only HTTP 201 as "created"** (curl code `0` = transient timeout, may or may not have written — verify, don't assume) → **re-count with the bucket trick, not the counter** → top up the shortfall with **fresh unique names** (continue the numbering, e.g. 301+) so you never collide, retrying transient `0`s up to 3× → re-count to confirm. Reached exactly 300 this way. Names tagged `ZZAUTOTEST` per the disposable-data rule.


### T.12 Vendor invoices, receive, split — reproduce a "one invoice across two POs" (proven 2026-08-27, SV-8910)

**Where duplicate/vendor invoices are SEEN:** Parts → Vendors → click the vendor → **Unpaid Invoices** tab = route `/parts/vendor/{vendorId}/unpaid-invoices`. Columns: Date · Type · **No.** (invoice number) · Memo · **Total** · Balance · Status. Tick row checkboxes → a **"Totals selected"** footer sums them (this is how the doubling shows: a $300 invoice's two PO rows each reading $300 → footer $600). The `/parts/deliveries` route is the same data table (label "Vendor Invoices" in the Parts nav points at `/parts/deliveries`); the per-vendor Unpaid Invoices page is the cleaner evidence surface.

**Getting two POs under ONE vendor invoice (the reproduction):** same-vendor parts on the SAME work order **merge into one PO** — so two parts alone will NOT give two POs. You need the first PO **closed to new additions**: order part 1 (qty 2), **partially receive it (1 of 2)**, then **Split work order** the line → new WO; add part 2 (same vendor) on the new WO and order it → now a NEW PO. The new WO's receive screen groups both POs under the vendor into one block → receiving there is one submission spanning two POs. (`receive-view` returns `vendors[].purchaseOrders[].items[]` where each item's own `orderNumber` reveals the real PO.)

**Key endpoints:**
- Line create: `POST /api/work-orders/lines/create` — needs `{work_order_id, canned_line_id, status:'authorized', line_name, labour_type_id, labour_rate, tech_time, time_estimate}`; a bare `{work_order_id,canned_line_id,status}` **400s** with "Labor or fixed prices must be set." **The UI New Line dialog is more reliable** (`button_new_line` → `select_line_canned_line` type+pick → `checkbox_line_approved` → `button_save_add_line`/`button_save_close`).
- Authorize a line: `POST /api/work-orders/lines/change-status {work_order_id, line_ids:[...], status:'authorized'}` → 200. (A part order 400s "can only be performed on the authorized lines" until then.)
- Add part: `POST /api/work-orders/part/make-request {line, work_order, description, quantity, part_source_type:'vendor', part_number, price, part_category_id, vendor_id}` → 201.
- Order the part (create PO): `POST /api/work-orders/part/perform-request-status-action {part_request_id}` → 201, returns `data.orderId`.
- **Split work order (UI only):** on `/workorders/{WO}/lines`, hover `line_number_{L}`, click `line_checkbox_{L}`, click `button_line_bulk_action`, then click the **"Split work order" menu item TWICE** (the item itself arms red on the 1st click and the **menu stays open** — click the SAME item again to confirm; do NOT reopen the menu). URL redirects to the new WO.
- Receive screen: `/order/{PO}?receive=1&workOrderId={WO}` — controls `input_invoice_{PO}`, `input_cost_{itemId}`, `input_qty_{itemId}`, `input_tax_{PO}` (per-PO/block tax), `checkbox_item_{itemId}`, `button_receive_po_{PO}`. **Cost is entered at receive time** (order-item cost defaults to 0; button stays disabled until cost is set). An already-received item shows a locked `currency_text_cost_{itemId}` instead of an input. Submit calls `POST /api/orders/receive-requested-parts` with `{vendor_id, invoice_number, invoice_date, total, tax, items:[...]}`.

**Seed a CORE CHARGE for a receive:** `POST /api/work-orders/part/make-request` accepts `core_charge` + `is_core` on a **vendor**-source part → the receive screen then shows a separate "Core for <part>" line and the delivery total includes it (part $100 + core $25 = $125, recorded $125). An **inventory**-source cored part is drawn from stock and is NOT vendor-ordered (order returns no PO), so use the vendor path for a receivable core.

**Verify per-PO recording:** `GET /api/inventory/orders/{PO}` → `data.order.deliveries[]`, each with `invoice_number`, `total_price` (= its own part share **+ its own tax share**), and nested `items[]` (`total_cost`). Fixed = each delivery's `total_price` is its own share; the two sum to the true invoice. Broken (SV-8910) = both = the whole submission total. Tax per row = `total_price − sum(items.total_cost)`; the two tax shares sum exactly to the entered tax, larger PO carrying the larger share.

### T.13 Complete a WO to the invoice stage — the fast API/UI chain + the status enums (proven 2026-08-27, SV-9087)

When the WO completion settings are permissive (Work Orders settings tab: Require Approval / Require Mileage / Require Tech Story / Require Review / Require Receiving Parts all OFF), a WO drives to `Complete` in a few calls:
1. `POST /api/iam/change-location {workplace_id, workplace_timezone}` — scope to the workplace, or `/api/work-orders?limit=…` returns 0.
2. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` → `data.work_order_id`.
3. **Add a labor line via the UI New Line dialog** (`button_new_line` → `select_line_canned_line` type name → pick first `.q-menu .q-item` → `checkbox_line_approved` → `button_save_close`). Direct `POST /api/work-orders/lines/create` is unreliable: bare canned 400s "Labor or fixed prices must be set"; canned+`labour_type_id`+`labour_rate`+`line_name` 500s. Labour types (for rate): `GET /api/labour-types?limit=…` → `{id, name, rate}`.
4. **Complete the line:** `POST /api/work-orders/lines/change-status {line_id, work_order_id, status:'complete'}` → 200. **Valid line status = `complete`** (`completed`/`done`/`closed` → "Invalid parameter value").
5. **The WO auto-completes to `Complete` when its last line completes** — no separate WO call needed; `POST /api/work-orders/change-status {id, status:'complete'}` then 400s "Complete work order cannot change its status again." (Valid WO statuses probed: `complete`, `invoiced`, `in_progress`; `completed`/`review`/`done`/`closed` are rejected. WO change-status key is **`id`**, not `work_order_id`.)
6. Canned-lines list = `GET /api/work-orders/canned-lines?limit=…` (returns ids only; detail endpoints 404 — pick by adding via the UI dialog). Invoice-create = `POST /api/invoices/create {work_order_id, …}`.

**Invoice preview / draft = `GET /api/invoices/{wo}/details?includeDeclined=0` + `POST /api/work-orders/invoices/estimate`** (also `GET /api/invoices/{wo}/settings/view`). The Finance tab's `date_input_invoice_date` field is present even pre-create; **Create Invoice stays disabled until the draft preview renders** — if `/details` 500s, the preview area is blank behind red toasts ("Error fetching draft invoice details", "Error get invoice HTML") and Create Invoice never enables. When diagnosing a 500 there, prove whether it depends on `credit_term` by seeding canonical / mis-spelled / garbage terms (`POST /api/customers/change` with the full record + `credit_term`) and comparing — if all 500 identically it is a preview-infra issue, not the term. **The `/details` 500 was also traced to a missing customer CONTACT** — set one on the WO (or on the customer) and the preview renders.

**Reverse → re-invoice → change date (the SV-9087 reported flow, and how to drive it):** invoice menu `button_wo_invoice_menu` → `menu_item_reverse` → confirm; after reversal the WO returns to `Complete` and the finance draft's invoice-date field **defaults to today**. `Create Invoice` opens the **New Customer Payment** dialog directly (no "confirm create" dialog) and the invoice is created at that moment — close it with `button_close_payment_dialog`. To backdate: change `date_input_invoice_date` **before** clicking Create Invoice; the due date recomputes live from the credit term. A page reload resets the draft date to today, so set the date and create **without** reloading in between.

**⚠️ Test the customer's REAL data path, not just an API-seeded state (SV-9087, ties Standing Rule 66).** When a fix needs "bad" data (here a mis-spelled `credit_term` like `NET 30`), find HOW the customer actually produced it — the dev's root-cause note usually says. Here it is the **Contacts CSV import** (`Imports → Contacts`); the credit-term **dropdown only writes canonical values**, so a customer cannot type a bad term through the customer form. `POST /api/customers/change` reproduces the same stored state as a shortcut, but the airtight, question-answering reproduction is the **Contacts import** itself.

### Session resilience — recover after a container reprovision (budget-friendly)
`/tmp` is ephemeral: the MITM bridge, cookies, `state.json`, and every `/tmp/<slug>/` harness script are **gone** after a reprovision, and the local git checkout may be sitting on **another session's commit**. Recover cheaply: (1) `git fetch origin <branch>` then `git reset --hard origin/<branch>` — restores committed evidence + any committed scripts (git is the only durable store; commit evidence as you go so this works). (2) Restart the bridge (`node build/testing-tools/staging-bridge.mjs`), read its `BRIDGE_LISTENING` port into `bridgeport.txt`. (3) Rebuild `api.mjs` / `lib.mjs` from this playbook (they carry no secrets). (4) **Re-request fresh cookies from the user** — secrets are never committed and ~24h-lived. To recover a **deleted/edited Jira comment id**, re-fetch `getJiraIssue fields=["comment"]` before updating — an `addCommentToJiraIssue` update to a stale id returns `Can not find a comment for the id`.

## §U — HOW TO UNBLOCK YOURSELF: the ladder, in order (the standing skill, not one project's trick)

### U.00 💰 THE COST CHECK — pick the harness before you build it (Standing Rule 63)

**Ask these three before any test run. They are free, and they decide the whole cost of the pass.**

1. **Is this an API-surface defect or a screen behaviour?** A wrong status code, an org-scoped
   not-found, a payload contract → **no browser at all**: no Chromium, no bridge, no screenshots.
   A dialog's arithmetic, a label, a control's presence → the browser is genuinely required.
   **Choosing the browser for an API defect is the single largest avoidable cost.**
2. **What is the cheapest check that could END this task?** *Is the fix deployed? Does a QA branch
   exist? Is the source current?* One HTTP call often ends it.
3. **How will each probe report?** **One verdict line, body truncated (~130 chars), `| head -N` on
   every command.** Never `cat` a file, never dump a JSON response, never bulk-download to grep.
   Ask the server for the shape instead — an empty POST returns the required-field list.

**Cheap never means less verified** — Rule 50 (exhaustive and exact) still binds. This saves
redundant *reads*, never a check, a case, a field or a row. Worked example of a whole ticket done
this way: `build/sv7760-reverse-payment-2026-08-26/FINDINGS.md` (~10 API calls, no browser).

### U.0 ⛔ THE PRE-ACTION CHECK — run this BEFORE the action, not after the mistake

**QA lead, 2026-08-20, verbatim:** *"SO keep on making your skills/rules/recipe/Playbook so that you go
through them for each action before performing that action so that you do not make similar mistakes."*
He said it because I **repeated an SV-8779 mistake on SV-8815 even though it was already written down**
— written down is worthless if it is only read afterwards. This checklist is the fix: **five questions,
about thirty seconds, before any app action.**

1. **Have I done this before?** `grep -in "<the action>" build/APP-ACTIONS-PLAYBOOK.md` — §R staging
   seed · §S staging specifics · §T per-ticket QA branches · §J TestRail · §K production · §M Figma.
   If there is a recipe, **use it verbatim**; do not re-derive it.
2. **⚠️ IS THERE MORE THAN ONE SURFACE FOR THIS ACTION, AND AM I ON THE ONE THE PRODUCT USES?**
   *This is the named trap. It has now cost two tickets.* Before driving a screen, confirm the product
   actually routes this object through it — start from the **object's own row/page** (the part row, the
   work-order line, the invoice) and follow the button the user would press. A stale route can still
   render, still enable its button, and still answer — with a 500.
   **Known instances: receiving a part** (part row's Receive → `receive-requested-parts` ✅ · the
   Deliveries / `/accept-delivery` screen ❌ — SV-8779 *and* SV-8815, see T.8) — **and the same class
   of thing on reads: `GET /api/invoices/{id}/view` is the issued invoice while
   `GET /api/invoices/{woId}/details` is a live re-price** (T.4).
3. **Whose state am I about to change, and is it disposable?** Per-ticket `sv####.qa` branch → no
   cleanup needed. Shared `app.staging` / `qb` / **production** → snapshot first, restore after.
   **TestRail and Jira are real** — nothing written without the QA lead's explicit go-ahead.
4. **What will I claim from this, and will I have the evidence?** If the outcome is a verdict, plan the
   **before AND after** capture now (§V) — a frozen record, real geometry, annotated. A replication
   without a screenshot taken *at the moment it reproduced* is an assertion, not evidence.
5. **Does what I have been asked to set up match what the ticket/spec actually requires?** If not, say
   so in one sentence and ask, before building it (Standing Rule 61).

**And the closing half of the same discipline:** the moment an action succeeds in a new way, the recipe
goes into this file **in the same session** — and when a recipe here turns out to be **wrong**, it is
**corrected, not appended to**. T.8 spent a day telling readers that receiving was broken with a
six-row "already ruled out" table; a confidently wrong recipe is worse than none, because it stops the
next person looking.

### U.0b THE HARNESS TRAPS — six that cost real time, each with its one-line fix

These are not product behaviour; they are ways the *tooling* wastes an hour. All hit on 2026-08-19/20.

| Trap | What you see | The fix |
|---|---|---|
| **`pkill -f <script>` kills YOUR OWN SHELL** | the command dies mid-way with exit **144**, and a heredoc that was supposed to write a file never wrote it — so the next run fails with `MODULE_NOT_FOUND` on a file you "just created" | the shell's own command line contains the script name, so `-f` matches it. Use a narrower pattern (`pkill -f "node fee_partrow"`), or better, **write files with the Write tool** instead of heredocs in a compound command |
| **…and its SECOND FORM: the pattern inside the HEREDOC THAT WRITES THE KILL SCRIPT** (found 2026-08-20, after the fix above was already written down) | exit **144** again, from a command whose only job was to *create* a `restart_bridge.sh` — because the pattern sat in the heredoc body, which is part of the caller's argv | `pgrep`/`pkill` match the **whole command line**, heredoc contents included. **Write the script with the Write tool** and assemble the pattern from pieces (`P1='staging-brid'; P2='ge.mjs'`) so it never appears literally in any argv |
| **`page.mouse.click` uses VIEWPORT coordinates, so a control below the fold is clicked at nothing** | the click "succeeds", **no request is sent at all**, and the stored value never changes — it looks exactly like the product failing to save. The dialog's **Save & Close** sat at y≈**1691** in a 1300-tall viewport | `scrollIntoView({block:'center'})` → **wait** → **RE-MEASURE** → click the new box; and assert `r.y>=0 && r.bottom<=innerHeight` first. Helper: `clickTestId()` in `build/sv8815-customer-credit-2026-08-20/tools/lib.mjs`, which throws rather than clicking blind. This nearly became a false report that the rounding setting does not persist |
| **A click that "worked" but changed nothing** | the next step reports the control is missing — on SV-8815 the part row's kebab "did not exist" because the line row had never actually expanded | **click, then PROVE the state changed** (find the part's own description in `document.body.innerText`), **and retry up to ~4 times.** It took 2 attempts every single run. Never let the next step assume the click landed |
| **Container restart kills the MITM bridge** | every `page.evaluate` fetch dies with `TypeError: Failed to fetch` | relaunch `staging-bridge.mjs`, read the **new** port from its `BRIDGE_LISTENING` line, and **rewrite `bridgeport.txt`** — the port rotates every restart. `/tmp` itself survives, cookies included |
| **A foreground browser run exceeds the 2-minute Bash default** | the command is killed at 2 min with nothing to show | pass an explicit `timeout` (up to 600000 ms) for foreground runs, or launch with `(… &)` and poll with an `until ! pgrep -f "node <script>"` loop. **`sleep N` chained after another command is blocked** — use the until-loop form |

---

**Standing rule already in CLAUDE.md: never stop at "a human must do this" or "this needs data
seeding".** §U is the *method* behind that rule, written down so it is executed the same way every
time instead of being reinvented. It was proven on 2026-08-19/20, where it turned two "impossible"
items into precisely-diagnosed ones in about an hour — after an earlier pass had wrongly reported one
of them as *"QuickBooks is not connected"*, which was **false**.

**Work the rungs in order. Do not skip to guessing payloads — that is rung 5, and it is the worst one.**

1. **READ WHAT THE SCREEN IS TELLING YOU.** The on-screen message, the tooltip, the validation text,
   the banner. *"Map a Fee item in Settings → QuickBooks"* named the entire gate, and its
   `data-test-id` (`banner_adjustment_mapping_guard`) was the string that unlocked everything else.
2. **ASK THE DOM WHAT EXISTS — never conclude "there is no button" from a screenshot.**
   `[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))]`
   then filter by keyword. This is what found `button_work_order_nav_bar_menu`,
   `menu_item_add_adjustment` and `button_add_labor_adjustment_<lineId>` after a screenshot had
   suggested there was no fee control at all. **Controls also hide off-screen right, and inside
   right-click context menus** (see T.8 — Return is a context menu, and no amount of screenshotting
   finds it).
3. **CHECK WHETHER THE CONTROL IS DISABLED, AND WHY.** `{disabled, aria-disabled}` off the element
   distinguishes *"my click missed"* from *"the product is refusing"* — completely different problems.
   A disabled button with a banner above it is a **gate**, and a gate has a **condition**.
4. **READ THE DEPLOYED BUNDLE. This is the highest-yield rung and the most under-used.**
   Collect the chunk URLs the app actually loads (`page.on('response')` filtered to `.js`), fetch each
   with `credentials:'include'`, and grep for the message, the `data-test-id`, or the field name. It is
   *first-party source*: it gives the **exact endpoint**, the **exact field names** and the **exact
   boolean** that gates the control. Tonight it produced
   `bookkeeping/adjustment-item-mapping-status` → `{feeItemMapped, discountItemMapped}` (the whole
   answer), and the working `make-request` body whose fields are `work_order`/`line` and **not**
   `work_order_id`/`line_id`. **A lazily-loaded dialog's chunk only appears after you open the
   dialog — open it first, then collect.**
5. **ONLY NOW probe the endpoint** — empty/partial body, read the validation error, iterate. And treat
   what it says with suspicion: this API answered in **snake_case** about a body that actually wants
   **camelCase**, and answered **500** where the real problem was elsewhere entirely.
6. **CAPTURE THE UI'S OWN REQUEST AND REPLAY IT.** `page.on('request')` + `postData()`. If the replay
   fails identically, the payload is exonerated and the fault is server-side — which is a *finding*,
   not a blocker.
7. **RULE CAUSES OUT ONE AT A TIME, AND WRITE DOWN EACH ONE.** T.8's ruled-out table is worth more
   than the eventual fix, because the next person's instinct will be to re-test exactly those six
   things.
8. **SWITCH SURFACES.** UI ↔ API, and *route casing and spelling matter*: `/workorders/{id}/parts`
   errors while `/workorders/{id}/part-requests` works; `/api/vendors` 404s while
   `/api/parts-catalogue/vendors` returns 10.
9. **SEED IT YOURSELF** (Standing Rules 5/14) — a template, a tax model, a vendor assignment, a fresh
   staff, a work order. Creating an adjustment **template** took one call and no permission.
10. **ONLY THEN call it blocked** — and even then, deliver the *exact* gate, the *exact* condition, and
    **the one step that would clear it**, so a human spends a minute rather than an evening.

**THE TWO HONESTY RULES THAT GO WITH THIS LADDER:**

- **Never report a cause you inferred.** *"QuickBooks is not connected"* was inferred from a page that
  showed a Connect button; the status endpoint said **`quickBooksConnected: true`**. Read the state,
  don't read the decoration.
- **"Blocked" must name the gate.** *"Fees can't be added"* is useless. *"`feeItemMapped:false` from
  `GET /api/bookkeeping/adjustment-item-mapping-status`; map a Fee item under Settings → QuickBooks"*
  is actionable, and it is the same amount of typing.

**AND THE RULE THAT MAKES ALL OF IT COMPOUND (QA lead, 2026-08-19, verbatim):** *"once you learned
save it with you in your rules/playbook/skills/recipe and keep on upskilling yourself as you learn, I
do not want you to search for the same process from scratch again and again and spend hours to do that
repeatedly when you once have already found the right path to do it previously."*
So: **the moment a rung pays off, the recipe goes into this playbook in the same session** — endpoint,
payload, field names, `data-test-id`s, the gate, and what was ruled out. **Before starting anything
that smells familiar, grep this file first** (`§R` staging seed · `§S` staging specifics · `§T`
per-ticket QA branches · `§J` TestRail · `§M` Figma). Re-deriving a recipe that is already written
down is the failure this section exists to prevent.


---

## §V — EVIDENCE THAT CANNOT BE CHALLENGED: building annotated exhibits for a Jira comment

The bar the QA lead set: *"i dont want any front end or backend developers to challenge me or bite me
or the client to say that its not fixed."* Everything below was learned by getting it wrong first on
2026-08-19 (see `build/LESSONS-2026-08-19.md`).

### V.1 Screenshot a FROZEN state, never a live one

**A ShopView work order that has not been invoiced RE-PRICES against its location's current settings.**
Screenshot one of those as proof of a tax figure and the number changes the moment anybody edits the
location — the reviewer clicks your link, sees something else, and the whole report is suspect.
**Invoice the work order first.** An issued invoice keeps its own frozen tax snapshot.

Corollary, and it bites specifically on OLD records: the work order's **Financial Info panel
recomputes**, while the **issued invoice document** is frozen. On a Feb-2025 invoice the panel read
`2,833.11 / 2,974.77` and the invoice read `2,833.13 / 2,974.79`. **For any pre-existing invoice,
annotate the invoice DOCUMENT, not the panel** — and if the panel is visible in the shot, explain it in
the caption before a reviewer "finds" it.

### V.2 Drive annotations from REAL geometry

```js
el.getBoundingClientRect()   // -> {x,y,w,h} per target, saved to JSON alongside the .png
```
Capture the boxes in the same page visit as the screenshot, write them to a sidecar JSON, and generate
the annotation spec from that file. **Never estimate coordinates off a scaled screenshot** — it works
until it silently doesn't.

Two ways to find targets: `[data-test-id^="item_label_"]` + `item_value_<k>` for the Financial Info
panel (gives label box, value box and a full-row box), and an exact-innerText walk over leaf elements
for anything in the rendered invoice document.

⚠️ **A LAYOUT SHIFTS BETWEEN STATES — capture geometry PER STATE, never reuse one state's boxes on
another panel (learned SV-9087 2026-08-27).** A composite that stacks the SAME screen in several states
(e.g. Complete → Invoiced → Reversed → Invoiced) is the trap: the finance tab's **INVOICED** state has no
"Estimate/Invoice" toggle row, so the rendered invoice document — and its `Invoice Date:` / `Due date:`
lines — sits **~40px HIGHER** than in the **draft/Complete** state. Measured live: invoiced-layout dates
at `y≈223–265`, draft-layout dates `~40px lower`; status badge `y≈134` in both. A single fixed box drawn
for all panels landed correctly on the draft panels and **below the dates on the invoiced panels** — the
QA lead caught it. Fix: measure `getBoundingClientRect` in **each** state (or at least once per distinct
layout) and use per-layout coordinates; then **re-read the finished composite before delivering** to
confirm every box actually rings its target.

### V.3 ⚠️ `fullPage` does NOT reach an inner scroll container

The invoice document lives in an inner scroller. Its rect can read `y≈2874` while
`document.documentElement.scrollHeight` is only `1300` — so a `fullPage: true` screenshot ends long
before the target and every box lands off-image. **`scrollIntoView({block:'center'})` the target, wait,
RE-READ the rects, then take a viewport screenshot.**

### V.4 Label placement rules (all three were learned by covering the evidence)

- Put labels in **empty space** — for the WO screen that is the column to the right of the Financial
  Info panel (x ≈ 430+); for the invoice document it is the gap to its left (x ≈ 470–600).
- **Spread by index**, not by target y: `ly = anchor + i*52..64`. Document rows can be **19px** apart
  while a label box is ~36px tall, so anchoring a label to its own row guarantees overlap.
- **Tight box padding (2px) when rows are close**, or adjacent boxes merge into one unreadable blob.
- **When targets are only ~15px apart, draw ONE box around the whole block and label it once.** Three
  boxes 15px apart overlap each other and the leaders tangle; a single box round the totals block with
  the figures spelled out in the label reads instantly.
- ⚠️ **The leader must leave the label from the edge that FACES the box.** `annotate.py` used to always
  draw from the label's right edge, so a label placed to the **right** of its value drew the line back
  **through its own text** and every caption came out looking struck through — on an exhibit whose
  entire job was to show numbers clearly. **Fixed 2026-08-20**; it now picks left/right/vertical from
  the label's position. If you copy an older annotate.py, copy this fix with it.

### V.5 Check the geometry automatically, THEN look at the images

Two steps, and both are needed. First run the collision guard —
`build/sv8815-sales-tax-rounding-2026-08-19/check-annotations.py <annspec.json>` — which reproduces
annotate.py's own label maths and fails the build if any label covers the value it points at or
another label. That catches the commonest defect across every exhibit in one second.

Then **still open the images**. The guard cannot see a box drawn off-image (V.3), a caption that
contradicts what is on screen, a label pointing at the wrong row, **or a leader line drawn through
its own label** — the guard passed all five exhibits on 2026-08-20 while every label was struck
through by its own arrow, because the guard checks label/box *rectangles* and not the *line*. **The
guard is a filter, never the sign-off. Look at every image you are about to publish.**

### V.6 The generator

`build/sv8769-8814-invoice-rebuild-2026-08-10/annotate.py` — spec-driven (`src`, `dst`, `banner`,
`bannercol`, `boxes[{x,y,w,h,color,label,lx,ly}]`, `caption`). It draws the box, a white-backed label
and a connector line, adds a coloured header band, and **sizes the caption strip to the number of
lines** (a clipped caption is a wasted exhibit). Fonts: `/usr/share/fonts/truetype/dejavu/`.

### V.7 Getting them into Jira

The Atlassian MCP has no attachment upload. Commit the PNGs and embed as **ADF external media** —
this repo is public, so `raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>.png` returns 200.
**`curl -o /dev/null -w "%{http_code}"` every URL before posting.** Full comment format (status first
line, table, inline images, rule, technical detail last) is in CLAUDE.md.

### V.8 The exhibit set that closes the arguments

One exhibit per challenge a reviewer could actually make, each captioned with the work-order number and
the build marker:

| Challenge | The exhibit that answers it |
|---|---|
| "the setting isn't there / has no warning" | the settings dialog, default **and** new value, banner boxed |
| "you didn't check the real reported case" | the actual reported invoice's figures, both modes |
| "the tax just goes down" | the case that goes **up** a cent, beside the one that goes down |
| "you only looked at the total" | the **per-rate breakdown** moving while the total stays identical |
| "old invoices moved" | a years-old **issued invoice** after the config was changed underneath it |
| "it leaves a cent behind" | a full payment closing to **exactly $0.00** |
| "it's an org-wide switch" | two locations, same subtotal, different tax |

### V.9 BUILD THE COMMENT WITH A SCRIPT, NEVER BY RETYPING (proven 2026-08-20, SV-8815)

A QA comment for a passed ticket runs to ~50 KB of ADF with 19 images and three tables. **Typing any of
it twice is how a figure drifts**, and a drifted figure in a public comment is the one thing that lets a
developer dismiss the whole thing. So:

1. **Generate the ADF from a committed script** — `evidence/build_single.py` on SV-8815 is the pattern:
   tiny helpers (`t()` text+marks, `p()`, `h()`, `tbl()`, `img()`, `blist()`, `olist()`), then the
   document assembled as a Python list. It regenerates byte-for-byte, so a late edit is a one-line change.
2. **LIFT reusable content out of the previous comment's ADF rather than retyping it.** Walk the stored
   ADF, pull the tables out as row arrays and the captions out as the `em` paragraph that follows each
   `mediaSingle`, and feed them straight back in. On SV-8815 that carried an AC table, an
   open-questions table, **30 check rows and 14 captions** across with zero transcription risk.
3. **TONE-GATE the rendered text before posting.** Flatten the ADF to plain text and grep for words that
   must not appear — for a QA result: `wrong`, `correction`, `mistake`, `I was`, `apolog`, `withdraw`,
   `provisional`. Any hit gets read in context and either justified or removed. *(On SV-8815 the only
   hit was "the wrong location's tax", a legitimate technical phrase.)*
4. **`curl` every image URL for a 200** before the write, and **re-read the build marker** at that moment
   (Rule 59).
5. **READ THE COMMENT BACK from Jira and check the structure**, not just that the POST returned 201:
   media-node **count AND order**, table row counts, the first line of text, and a handful of content
   probes. The write response echoes what you sent; only a re-read proves what was stored.

⚠️ **`getJiraIssue` with `fields:["comment"]` blows the token cap on a ticket with big comments.** The
result gets written to a file instead — parse that with `python3`/`jq` rather than retrying the call.

### V.10 ONE COMPLETE COMMENT BEATS A CHAIN OF CORRECTIONS (QA lead's ruling, 2026-08-20)

Verbatim: *"Just post one new complete comment and I will delete the older comments. No need to add
multiple comments like we did."* And on its tone: *"do not post it as you were wrong before and right
now etc. Just post a comment which with all the evidences proves that why this ticket is QA passed and
with all annotated screenshots etc like a professional Jira comment for a QA passed ticket."*

**So when findings change after a comment is posted, do NOT stack a correction comment on top.** Rebuild
**one standalone comment** that carries the whole result — every check, every exhibit, the current
conclusions — so the QA lead can delete the earlier ones and be left with a single clean record.

**And the tone rule, which matters more than it looks:** a QA comment states **the result**, not the
tester's journey to it. The PO and the developers need to know what was tested and what it showed. A
"I said X, actually Y" narrative makes the reader discount everything around it and buries the verdict.
**Keep the self-review in `LESSONS-*.md` and this playbook, where it does its job; keep Jira for the
finding.** *(This does not license hiding a defect or overstating a pass — the two genuine gaps and the
open question for the developer were all stated plainly in that same comment.)*

---

## §W — THE NAVIGATION MAP: routes, controls, and the ones that lie (consolidated 2026-08-20)

**Purpose: stop hunting.** Everything below was observed live. Read this before opening a screen —
looking a route up here takes seconds; rediscovering it has repeatedly taken an hour.
**Every `data-test-id` is quoted exactly as the build renders it.**

### W.1 Routes that work, and the ones that look right but do not

| To reach | Route | Notes |
|---|---|---|
| work order lines | `/workorders/{id}/lines` | the main working surface |
| work order finance panel | `/workorders/{id}/finance` | the tester-facing **Financial Info** figures |
| work order parts | `/workorders/{id}/part-requests` | ⚠️ **`/workorders/{id}/parts` renders an error page** |
| purchase order list | `/parts/orders` | ✅ **every "Ordered" row carries its own `Receive` LINK** whose href is `/order/{poId}?receive=1` — this is a real user route into receiving |
| a received vendor invoice | `/parts/delivery/{deliveryId}` | read-only (`delivery_page_view`, `button_edit_delivery`) — reached by clicking a Vendor Invoices row; **no receive action here** |
| admin locations | `/administration/locations` | rows carry `button_edit_workplace`; the dialog is `dialog_base` / `dialog_title` / `button_close_dialog` / **`button_save_workplace`** |
| **returns + credits** | `/parts/returns` | tabs `tab_returns` / `tab_credits` |
| process a return into a credit | `/parts/confirm-return?ids=<returnRequestId>&isManualReturn=0` | reached by the Receive Credit button |
| receive a work-order part | `/order/{poId}?receive=1&returnTo=WorkOrder&returnId=…&vendorIds=…` | ✅ **the live receive path** |
| vendor invoices | `/parts/deliveries` | ⚠️ titled *Vendor Invoices*; its receive screen is the DEAD one |
| ❌ dead | `/accept-delivery/{orderId}` | renders and its button enables, but the save 500s — **not the product's path** (§T.8) |
| ❌ dead | `/parts/credits` | *"Looks like this page took a coffee break… permanently"* — the Credits **tab** on `/parts/returns` is the real one |
| ❌ dead | `/administration/bookkeeping` | use `/administration/quickbooks` |
| admin tabs | `/administration/{settings,locations,taxes,quickbooks,…}` | left nav ids are `link_<name>_tab` — e.g. `link_locations_tab`, `link_taxes_tab`, `link_quickbooks_tab`, `link_adjustment_templates_tab` (that last one is the **Fees & Discounts** page) |
| **a customer's invoices — and the CUSTOMER CREDIT** | `/customers/{companyId}/invoices` | tick one row → `button_issue_credit_customer` → the Issue Credit dialog (**§T.8c**). Sibling tabs: `work-orders`, `part-sales`, `contacts`, `vehicles`, `notes`, `payments`, `deposits`, `default-adjustments` |
| ❌ dead | `/customers/{id}/part-sales-credits` and `/customers/{id}/unpaid-invoices` | both **redirect** to `CustomerInvoicesTab` — not separate screens |
| ❌ **NOT the customer credit** | `/parts/create-credit` | despite the name, this is the **vendor** credit form (`create_credit_vendor`, `button_post_credit`) — §T.8b |

### W.2 Controls by the action you want

| Action | Control |
|---|---|
| work-order menu | `button_work_order_nav_bar_menu` → `menu_item_audit_log` · `menu_item_timesheets` · `menu_item_add_adjustment` · `menu_item_delete_work_order` |
| expand a line | `button_line_expand_{lineId}` — ⚠️ **verify it expanded, and retry** (§U.0b) |
| a part row's menu | `button_requested_part_context_menu_{partRequestId}_line_{lineId}` → *Move* · *Add Part Fee / Discount* (`menu_item_add_adjustment_part_{partRequestId}`) |
| receive a part | `button_part_request_action` on the part row (renders as **Receive**) |
| the receive form | `input_invoice_{poId}` · `input_qty_{itemId}` · `button_receive_po_{poId}` |
| line-level labour adjustment | `button_add_labor_adjustment_{lineId}` |
| the fee/discount dialog | `dialog_adjustment` — `select_adjustment_template` · `input_adjustment_name` · `select_adjustment_type` · `select_adjustment_calc_type` · `input_adjustment_percent` · `input_adjustment_max_cap` · `select_adjustment_taxable` · `text_adjustment_taxable_note` · `adjustment_preview` · `button_add_adjustment` · `banner_adjustment_mapping_guard` |
| returns list row | `return_request_checkbox_{id}` · `link_return_work_order_{id}` · `button_manual_return_actions_{id}` · `button_create_return` · `button_receive_credit` (appears once a row is ticked) |
| process-return form | `select_vendor` · `input_packaging_slip` · `input_credit_memo_number` · `date_input_` · `input_received_quantity_0` · **`input_base` ×2 (restocking fee AND tax — disambiguate by label context)** · `input_return_note` · `button_post_credit` |
| financial info rows | `item_label_<Name>` / `item_value_<Name>` — the reliable way to read Parts · Labor · Shop Supplies · Subtotal · `<tax name>` · Total · Balance |
| change location | `profile_menu_button` → `select_location` (click its **right edge** to open the dropdown) |
| dev quick login | `button_quick_login_admin` on `/login` |
| the sales-tax rounding field | ⚠️ **`select_sales_tax_rounding_mode`** — *with* the `_mode` suffix. Guessing `select_sales_tax_rounding` finds nothing and looks like the field is absent. Its warning banner is `banner_sales_tax_rounding_changed`; open the dropdown by clicking the field's **right edge** |
| purchase-order list controls | `checkbox_select_order_{orderId}` · `button_receive` (bulk, appears on selection) · `button_new_po` · `button_column_selection` · and the per-row `Receive` **anchor** (no test id — find it by its `Receive` text and read its `href`) |
| the receive screen's other fields | `link_receive_work_order` · `select_assign_vendor_{poId}` · `date_input_invoice_date_{poId}` · `input_sell_{itemId}` · `input_tax_{poId}` · `input_note_{poId}` · `currency_text_subtotal_{poId}` · `checkbox_item_{itemId}` · `button_back_to_purchase_orders` |
| **the customer-credit dialog** | `checkbox_credit_memo_type_parts` · `radio_credit_memo_outcome_hold` / `..._refund` · `input_credit_memo_reason` (**required** — submit stays disabled without it) · `date_input_credit_memo_date` · `select_credit_memo_payment_method` · `table_parts_return` · per row `checkbox_select_parts_{partId}` (⚠️ **starts TICKED — clicking DESELECTS**) · `input_parts_return_quantity_{partId}` · `input_parts_return_restocking_fee_{partId}` · `currency_text_parts_return_total_{partId}` · totals `currency_text_parts_return_{subtotal,tax,total}` · **`button_confirm_dialog`** = the dialog's *Issue Credit* (⚠️ the page header has a button with the **same visible text** — matching on text hits the wrong one and posts nothing) |

### W.3 Reads that lie, and what to read instead

| Do not trust | Trust |
|---|---|
| `GET /api/invoices/{workOrderId}/details` — a **live re-price** | `GET /api/invoices/{invoiceId}/view` — the frozen issued invoice |
| the **Financial Info** panel on an invoiced work order | the issued invoice document (`/api/invoices/preview?invoice_id=…&type=html`). After a part return the panel shows a **reduced subtotal with the invoiced tax**, so its Total matches neither; **Balance** is the reliable field |
| `quickBooksConnected: true` from `adjustment-item-mapping-status` | `products-and-services` (400 = not configured) **+** `integration` (an unused OAuth URL) **+** the admin page. Three signals beat one boolean (§T.7) |
| a route rendering | whether the **product** drives this object through it (§U.0 question 2) |
| the `workplace_id` you sent to `POST /api/work-orders/create` | the session's **active location** — it wins (§T.1) |

### W.4 Limits and shapes worth not re-learning

- vendor **invoice number: 21 characters max** — over that it is rejected and looks like a receive failure.
- `POST /api/work-orders/part/make-request` → fields are **`work_order`** and **`line`**, not `…_id`.
- `POST /api/work-orders/part/make-return-request` → `part_id` is the **part object's** id from
  `GET /api/work-orders/lines/{WO}` → `collection[].parts[].id`, and **`return_reason` is required**.
- sales-tax rounding wire value is **`total_rounded`** (`invoice_total` / `total` → 400); read back as
  `salesTaxRoundingMode`.
- a vendor credit is taxed at **`workplace_tax`** on the part's **cost** — unrelated to the sales-tax model.
- ⚠️ **CORRECTED 2026-08-20** — the old note *"`POST /api/credit-memos` takes `customer_account_id` +
  `amount` only — no tax, no lines"* is **WRONG**, and it was written from a probe rather than from the
  screen. What the Issue Credit dialog actually posts:
  `{customerAccountId, amount, reason, originKind:"invoice", originInvoiceId, originDate,
  lineItems:[{partNumber, description, quantity, sellPrice, restockingFee, taxAmount,
  originatingInvoiceLineId}]}` → **201** `{creditMemoId, creditNumber:"CM-####", totalAmount (CENTS),
  openBalance, status:"open"}`. **Per-line tax is central to it** — it is the whole SV-8815 customer
  side. *Lesson: a shape learned by probing an endpoint is a guess about the product; capture what the
  screen sends.*
- `POST /api/work-orders/parts/calculate-tax` → `{items:[{workOrderPartId, quantity}]}` returns
  `totalTaxAmount` in **dollars** but per-item `taxAmount` in **CENTS**. Mixed units in one response.
- `GET /api/part-sales/{id}/list-credit-available-parts` wants the **INVOICE id**, not the part-sale id
  (part-sale id → 400 `{"invoiceId":"Not found"}`), returns `[]` for unreceived parts, and **500s for a
  part with no catalogue entry**.
- part-sale / work-order numbers render in grids with a **shop-id prefix**: API `P-1345` displays as
  **`P9-1345`**. Match on the digits, never the whole string.
- `list-unpaid-transaction` nests its rows one level deeper than the siblings:
  `data.response.collection[]`.
- Quasar: click by `boundingBox()` centre via `page.mouse.click`, not Playwright actionability clicks —
  **and scroll it into the viewport first, then re-measure** (§U.0b).

### W.5 PROVE UI REACHABILITY before you call a failure user-facing — or harmless (proven 2026-08-20)

**The question that decides whether a broken endpoint is a defect: can a user get there by CLICKING?**
An end user never types a URL. So a 500 on a route nothing links to is not a customer-facing defect —
and a 500 on a route every list row links to is a serious one. **Both claims need the same test, and
neither may be asserted without it.** I had described `/accept-delivery` as "not reachable in normal
use" from having reached it by typing the URL, which proves nothing either way.

**THE METHOD — enumerate the click-paths, do not click blindly:**

1. **Seed the object in the state that offers the action** (here: a part `Ordered` but not received —
   otherwise the row shows nothing to click and you learn nothing).
2. **READ THE `href` OF EVERY CANDIDATE LINK RATHER THAN CLICKING IT.** One `page.evaluate` over
   `document.querySelectorAll('a')`, filtered by the link's own text, gives you every destination at
   once — 30 rows answered in one call. Clicking each would take an hour and tell you less.
   ```js
   [...document.querySelectorAll('a')].filter(a=>a.innerText.trim()==='Receive')
     .map(a=>({href:a.getAttribute('href'), row:a.closest('tr').innerText.slice(0,80)}))
   ```
3. **Walk every menu that could offer it** — the object's own row, the list page, the sibling list
   pages (`Parts > Deliveries` looked like a receive route and turned out to be read-only).
4. **Then click one for real and watch the network**, to confirm the destination's save is the working
   call and not the failing one.
5. **State the result as a count, not an impression**: *"all 30 Receive links point at X"* is
   checkable; *"the UI uses X"* is not.

**Verdict wording that follows from it:** reachable-and-broken → **a defect, raise it**;
unreachable-and-broken → *"recorded for information; there is no click-path to it"*, and say how you
established that. **Never the phrase "not reachable in normal use" without the enumeration behind it.**

### W.6 THE END-USER PATH IS ITS OWN CHECK — drive the FEATURE by hand even when the scaffolding is API

Driving setup by API is a legitimate speed trade-off on a long run; **driving the thing under test by
API is a coverage gap**, because the screen is where the customer lives and the screen can send a
different payload than you do. Split it explicitly:

- **By hand, always:** the setting/control the ticket is about — open the dialog, read the options,
  click the value, observe any banner, press **Save**, confirm it survives a reopen **and a hard
  reload**, and then **carry that saved state through to the outcome** (on SV-8815: dialog-set
  "Invoice total" → invoice billed 2.71 where the default bills 2.70). That last step is the one that
  proves the UI's save reaches the calculation.
- **By API, fine:** creating work orders and lines, completing, invoicing, payments, and repeating a
  pinned case dozens of times.
- **Then SAY WHICH WAS WHICH in the report** (CLAUDE.md deliverable convention) — a reader who assumes
  everything was clicked, and a reader who assumes everything was scripted, both draw wrong
  conclusions about coverage.

## §X — Part Sales: create, add part, order, receive, return, invoice (proven 2026-09-03, SV-6295)
**WHY THIS IS HERE (lesson — do not repeat):** I burned a lot of time "failing to seed a Part Sale."
Two root causes, both simple: **(1) WRONG DETAIL ROUTE.** A Part Sale opens at
`/parts/part-sale/{id}/part-requests` — NOT `/part-sales/{id}` (that path renders the app's error
page: "in the shop indefinitely" / "totaled"). The part-sales LIST is `/part-sales` but the DETAIL
lives under `/parts/part-sale/{id}/...`. **(2) EMPTY API-CREATED PS HAS NO LINE.**
`POST /api/part-sales {company_id}` → `{data:[{id}]}` creates an EMPTY Part Sale with **no Default
line**, so `POST /api/work-orders/part/make-request` (which requires a `line`) fails. The Default
line is created by the UI **Add Part** flow. So either drive the UI to add the first part, or accept
that a fresh API PS needs its line seeded first.

**UI CREATE FLOW (simplest — user-confirmed):** Parts → Part Sales → New Part Sale → pick a Customer
from the dropdown → **Save** → the Add-Part modal opens automatically (or click **Add Part**) → fill
Part Number, Description, Quantity, keep **Source = vendor**, pick the **Vendor**, fill Cost (+ Core
if needed), blur, **Save & Close** → the part shows status **Quoted** → click the green **Authorize**
button → the per-part **Order** button appears → Order → part becomes **Awaiting** (ordered).

**ENDPOINTS (all proven live):**
- Part Sale detail data (same as WO): `GET /api/work-orders/{psId}/parts/list-requests-by-line`.
- Authorize the part for ordering (green Authorize btn): `POST /api/work-orders/lines/change-status
  {line_id, status:"authorized", workOrderId:psId}` → part Quoted → **Auth to order**.
- Order the part (per-part "Order" btn): `POST /api/work-orders/part/perform-request-status-action
  {part_request_id, workOrderId:psId, sellPrice}` → creates the PO, part → **Awaiting** (gets order_id).
- Receive (same as WO): the per-AWAITING-row **Receive** button opens
  `/order/{orderId}?receive=1&workOrderId={psId}&returnTo=PartSale`; set `input_qty_{orderItemId}`
  + `input_invoice_{orderId}`, click `button_receive_po_{orderId}` → `POST
  /api/orders/receive-requested-parts`. Each partial receive splits off a new **Received** row +
  keeps the **Awaiting** remainder (received rows carry a `work_order_part_id`).
- Return (same as WO): `POST /api/work-orders/part/make-return-request {partId=work_order_part_id,
  quantity, returnReason}`. Reduces that received row's qty; **no "Returned" row** is created.
- Invoice a Part Sale: it must be **complete** first. `invoiced` CANNOT be set manually
  ("Work order status cannot be changed manually to invoiced"), and `authorized` is NOT a valid
  status name — use **`approved`**. Sequence: `POST /api/work-orders/change-status {id:psId,
  status:"approved"}` → `{id:psId, status:"complete"}` → `POST /api/invoices/create
  {work_order_id:psId}` (201). PS status → **invoiced**.
- Per-part context menu on the PS parts tab: `button_part_request_menu_{partRequestId}`; nav menu
  `button_part_sale_nav_bar_menu` → "Set status" (submenu shows target statuses; gated "Auth
  required" until the PS is approved).
- Browser hydration for the PS UI is the same boot2 pattern (quick-login → capture fresh PHPSESSID
  from Set-Cookie → seed cookies + localStorage user/fe_permissions_wrapper/token → navigate).
