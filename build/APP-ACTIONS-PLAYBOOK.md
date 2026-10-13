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
→ part `build/kb/APP-ACTIONS-PLAYBOOK/001-a-auth-session.md` (48 KB)

## B. Environment / location
→ part `build/kb/APP-ACTIONS-PLAYBOOK/002-b-environment-location.md` (5 KB)

## C. Work Orders
→ part `build/kb/APP-ACTIONS-PLAYBOOK/003-c-work-orders.md` (9 KB)

## D. WO Lines
→ part `build/kb/APP-ACTIONS-PLAYBOOK/004-d-wo-lines.md` (2 KB)

## E. Parts
→ part `build/kb/APP-ACTIONS-PLAYBOOK/005-e-parts.md` (13 KB)
  - 🧾 Vendor invoices, receiving & the PAYMENT-SELECTION LIST — the fast path (proven SV-9096, 2026-08-31, per-ticket QA branch `sv9096`, build 

## F. Adjustments / Fees & Discounts
→ part `build/kb/APP-ACTIONS-PLAYBOOK/006-f-adjustments-fees-discounts.md` (1 KB)

## G. Roles & permissions testing
→ part `build/kb/APP-ACTIONS-PLAYBOOK/007-g-roles-permissions-testing.md` (4 KB)

## H. Settings
→ part `build/kb/APP-ACTIONS-PLAYBOOK/008-h-settings.md` (1 KB)

## I. UI automation (Quasar)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/009-i-ui-automation-quasar.md` (8 KB)
  - 🔬 READING A LABEL OFF THIS SPA — the visible TEXT NODE, never the screen and never the accessible name (proven 2026-08-11, Schedule `sv8685`
  - ⚡ THIS SPA AUTHENTICATES FROM `localStorage`, NOT COOKIES — a live API session is not enough to reach a page
  - 🕒 WORKING HOURS AND THE BEFORE/AFTER-HOURS FLAG — read the BOARD, and read the RIGHT technician
  - ⚠️ EDITING A STAFF RECORD KILLS THAT USER'S SESSION — not just a ROLE change (widened 2026-08-11)

## J. TestRail API
→ part `build/kb/APP-ACTIONS-PLAYBOOK/010-j-testrail-api.md` (82 KB)

## K. PRODUCTION access & fix-verification (SV-8721, proven 2026-07-29)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/011-k-production-access-fix-verification-sv-.md` (6 KB)

## L. Git practice with parallel workers
→ part `build/kb/APP-ACTIONS-PLAYBOOK/012-l-git-practice-with-parallel-workers.md` (12 KB)

## M. Figma: extract ALL frames from a design link (proven 2026-07-31, Filters)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/013-m-figma-extract-all-frames-from-a-design.md` (7 KB)

## Jira/Confluence access
→ part `build/kb/APP-ACTIONS-PLAYBOOK/014-jira-confluence-access.md` (1 KB)

## Filing a defect ticket — the organisation's required format (ALL projects, ALL future tickets)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/015-filing-a-defect-ticket-the-organisation-.md` (18 KB)
  - TWO THINGS THAT MUST NEVER APPEAR IN A TICKET
  - HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA (QA lead, 2026-08-04)
  - INLINE IMAGES — the mechanism that actually works (proven 2026-08-04)
  - THREE HARD GATES BEFORE AND WHILE FILING (QA lead, 2026-08-04 — Standing Rules 51 / 52 / 53)
  - Fields to set on a ShopView `SV` defect ticket (from `createmeta`, 2026-08-04; type amended 2026-08-05)

## Navigation Map
→ part `build/kb/APP-ACTIONS-PLAYBOOK/016-navigation-map.md` (18 KB)
  - RE-OBSERVATION ATTEMPT — 2026-08-31 · **0 of 28 rows re-observed** (no session could be minted)
  - 🛑 HOW THE 28 `❌` ROWS GET FIXED — **PIGGYBACK, NEVER A DEDICATED PASS** (Rule 78, recorded 2026-09-03)

## WORK ORDERS
→ part `build/kb/APP-ACTIONS-PLAYBOOK/017-work-orders.md` (6 KB)
  - Create a WO
  - Open / navigate a WO
  - Add a line
  - Change a line's status (approve / authorize a line)
  - Bulk line status change
  - Delete a line
  - Approve / authorize a WO (send for approval)
  - Uncomplete a WO, then delete it
  - Edit WO header / change service advisor
  - Edit asset fields on a WO (mileage / engine hours / plate / VIN)
  - Complete the Review step (why it blocks Create Invoice)

## PARTS
→ part `build/kb/APP-ACTIONS-PLAYBOOK/018-parts.md` (10 KB)
  - Add a part to a line
  - Order / pick a part
  - Receive a part (so it has a real part number)
  - Catalog: create / edit / delete a part
  - Inventory: create / delete a part
  - Vendors: create / delete
  - Part Sales: create
  - Part Sales: Fees & Discounts VIU recipe (staging, proven 2026-07-22)
  - Returns: create / list / delete
  - Cores (core OK / Not-OK)

## INVOICING / PAYMENTS
→ part `build/kb/APP-ACTIONS-PLAYBOOK/019-invoicing-payments.md` (16 KB)
  - Create an invoice
  - Reverse an invoice
  - Issue credit
  - Import an historical / "imported" work order  🆕 2026-09-01
  - Impersonation, and the inline part row  🆕 2026-09-01 (sv9315)
  - Document snapshots and batch invoices  🆕 2026-09-01
  - 🛑 NEVER WRITE "NOT BUILT" FROM A GUESSED ROUTE — FETCH THE BUNDLE  🆕 2026-09-01
  - Create a customer payment (full payload)  🆕 2026-09-01
  - Create a payment
  - Reverse a payment
  - Remove a customer transaction (delete payment / void)
  - Send to Terminal

## CUSTOMERS / VENDORS
→ part `build/kb/APP-ACTIONS-PLAYBOOK/020-customers-vendors.md` (2 KB)
  - Create / edit / delete a customer
  - Customer AP/AR tabs + sensitive fields gating
  - Create a vendor

## NOTES
→ part `build/kb/APP-ACTIONS-PLAYBOOK/021-notes.md` (1 KB)
  - Create / edit / delete a note
  - View History Logs (WO history + line story)

## ROLES / STAFF / ADMIN
→ part `build/kb/APP-ACTIONS-PLAYBOOK/022-roles-staff-admin.md` (5 KB)
  - List roles / read a role
  - Create / edit / delete a custom role
  - Assign a role to a staff member
  - Create staff / search staff
  - Role change forces re-auth (409)

## REPORTS / SCHEDULE / TIMESHEETS / SETTINGS
→ part `build/kb/APP-ACTIONS-PLAYBOOK/023-reports-schedule-timesheets-settings.md` (3 KB)
  - Reports + aging reports gating
  - Schedule / calendar
  - Timesheets
  - Settings sub-toggles

## HEADLESS-AUTOMATION TECHNIQUES
→ part `build/kb/APP-ACTIONS-PLAYBOOK/024-headless-automation-techniques.md` (2 KB)

## FEES & DISCOUNTS (qb env, proven 2026-07-08)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/025-fees-discounts-qb-env-proven-2026-07-08.md` (5 KB)
  - Env / navigation (qb.qa.shopview.com, API sv7387api.qa.shopview.com)
  - Seed a testable WO end-to-end (proven)
  - Adjustments API (full contract, proven)
  - Quasar dialog driving (F&D dialogs)
  - qb env cautions (working fixes)

## Keeping this current
→ part `build/kb/APP-ACTIONS-PLAYBOOK/026-keeping-this-current.md` (1 KB)

## CUSTOM ROLES — Phase 2b functional-flow recipes (staging, proven 2026-07-09)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/027-custom-roles-phase-2b-functional-flow-re.md` (8 KB)

## FEES & DISCOUNTS — fresh full-VIU pass learnings (qb env, proven 2026-07-10)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/028-fees-discounts-fresh-full-viu-pass-learn.md` (4 KB)

## PROVEN: UI-driven WO seeding for reference states (staging, 2026-07-15)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/029-proven-ui-driven-wo-seeding-for-referenc.md` (2 KB)

## N. REPORT SUITE QA BRANCH sv8582 — reporting API + report-UI recipes (proven 2026-08-03)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/030-n-report-suite-qa-branch-sv8582-reportin.md` (33 KB)
  - Env + auth
  - Report routes (all six, live)
  - Report DATA endpoints
  - Report EXPORT endpoints (this is the part worth never re-deriving)
  - Report UI recipes (Quasar)
  - Report permission testing (the ONE-permission model, proven both ways)
  - §N addendum — WIP + Inventory Value recipes (proven 2026-08-04, build v3.4.1-0ed4433)
  - §N addendum — PARTS VELOCITY + TECHNICIAN UTILIZATION recipes (proven 2026-08-04, build v3.4.1-0ed4433)
  - N.2 SBC / SBR report internals + the seeding chain (proven 2026-08-04, build v3.4.1-0ed4433)

## §N — Report Suite QA branch `sv8582`: the ONE-LOGIN session recipe (proven 2026-08-04)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/031-n-report-suite-qa-branch-sv8582-the-one-.md` (5 KB)
  - Report endpoints (all `GET`)

## §N.1 — `gen_import.py` blanks the id-map C-ids (Report Suite too)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/032-n-1-gen-import-py-blanks-the-id-map-c-id.md` (0 KB)

## §O — FILTERS QA BRANCH `sv8785`: the filter-bar recipes (proven 2026-08-04)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/033-o-filters-qa-branch-sv8785-the-filter-ba.md` (7 KB)
  - THE FILTER-BAR TEST-ID MAP — never re-derive these by reading the DOM again
  - The three contracts
  - Three traps that cost real time
  - On-screen labels — the build differs from the spec in eight places

## §P — SCHEDULE QA BRANCH `sv8685`: API shapes that cost real time (proven live 2026-08-06, build `v3.5-7ec992f`)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/034-p-schedule-qa-branch-sv8685-api-shapes-t.md` (2 KB)

## §T — AN AUTOMATED KEYBOARD SWEEP CAN CLOCK YOU IN, AND IT CHANGES THE WORK ORDER'S STATUS (happened 2026-09-01, sv9315)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/035-t-an-automated-keyboard-sweep-can-clock-.md` (2 KB)

## §S — LIST ENDPOINTS DO NOT ALL TAKE THE SAME PAGING PARAMETERS, AND THE WRONG ONE IS SILENT (measured live 2026-09-01, sv9315 `v26.35.6-598cc8a`)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/036-s-list-endpoints-do-not-all-take-the-sam.md` (2 KB)

## §Q — REPORT SUITE `sv8582`: Work In Progress + Quasar recipes (proven live 2026-08-06, build `v3.5-f77875c`)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/037-q-report-suite-sv8582-work-in-progress-q.md` (9 KB)

## §U · sv9315 — WHAT THE BUILD ITSELF WILL TELL YOU, IF YOU ASK THE RIGHT LIST (measured 2026-09-01)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/038-u-sv9315-what-the-build-itself-will-tell.md` (4 KB)

## Credit memo states — how to CREATE each one (proven on sv8218, 2026-09-03)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/039-credit-memo-states-how-to-create-each-on.md` (4 KB)

## CUSTOMER PORTAL (ShopPay) — staging entry, proven live 2026-09-07
→ part `build/kb/APP-ACTIONS-PLAYBOOK/040-customer-portal-shoppay-staging-entry-pr.md` (7 KB)

## §W — WRITING A PASS'S RESULTS INTO A TESTRAIL RUN (proven live 2026-09-07, run R417, 120 cases)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/041-w-writing-a-pass-s-results-into-a-testra.md` (4 KB)
  - The five things that cost a session real time. All five are now handled by the tool.
  - The standing limit on shared runs (unchanged)
  - Verify afterwards, always

## §X — ORDERING AND RECEIVING A SPECIAL-ORDER PART (proven on sv9315, 2026-09-10)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/042-x-ordering-and-receiving-a-special-order.md` (3 KB)

## §Y — WORK ORDER LINES: EVERY STATUS AND EVERY OPERATION, FROM THE SCREEN
→ part `build/kb/APP-ACTIONS-PLAYBOOK/043-y-work-order-lines-every-status-and-ever.md` (11 KB)
  - (shown by the QA lead on staging, 2026-09-10, with screenshots — do NOT re-discover this)
  - Reaching a WORK ORDER status
  - Reaching a LINE status — click the LINE, not the badge
  - Deleting a line, and the bulk menu
  - Other line facts proven the same day
  - §Y.1 — WORK ORDER AND LINE STATUS, PRINTING, AND THE JOB'S HISTORY (proven live on Staging 2026-09-10)
  - §Y.2 — WORK ORDER LINE STATUS: STAGED PARTS BLOCK IT, AND THE APP TELLS YOU SO (2026-09-10)

## §Z — PART SALES, PART SALE CREDITS, CREDIT MEMOS AND IMPORTED INVOICES (sv9872, 2026-09-11)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/044-z-part-sales-part-sale-credits-credit-me.md` (7 KB)
  - Z.1 The branch has TWO ORGANISATIONS — check which one you are in BEFORE anything else
  - Z.2 The QA lead's cookies reach his org's DATA but NOT its SCREENS
  - Z.3 Part sales
  - Z.4 Part Sale Credits — the conditions, from the QA lead (2026-09-11)
  - Z.5 Credit memos (Credit Invoices)
  - Z.6 Imported invoices — how to seed one
  - Z.7 Finding a route when walking the UI stalls

## 🧾 CREATE INVOICE IS GATED ON THE WORK ORDER BEING **COMPLETE** (proven on production 2026-09-12)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/045-create-invoice-is-gated-on-the-work-orde.md` (1 KB)

## INVOICE-DESIGN LANE — ROUTES AND CONTROLS PROVEN ON PRODUCTION, 12 SEPTEMBER 2026
→ part `build/kb/APP-ACTIONS-PLAYBOOK/046-invoice-design-lane-routes-and-controls-.md` (7 KB)
  - The estimate document of a NEVER-INVOICED job
  - The invoice kebab: Reverse and Issue Credit
  - Changing workplace (location)
  - The part-sale credit document
  - The Authorizer
  - Create Invoice
  - Completing a work order, and why fresh work cannot simply be invoiced
  - Invoices import (Settings → Invoices)
  - IBS batch transactions
  - QA branch sv9160 (Global Search V2) — boot, 2026-09-14

## §GS — GLOBAL SEARCH V2: READING THE MODAL HONESTLY (proven live on sv9160, 2026-09-14)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/047-gs-global-search-v2-reading-the-modal-ho.md` (12 KB)
  - The app labels its own results — never guess a row selector
  - 🛑 The four traps, each of which produced a finding that was not real
  - The location trap applies to the RUN, not only to seeding
  - Three signals, and they must agree before anything is believed
  - Keyboard
  - §GS.1 — RUNNING A PERMISSION CASE WITHOUT CREATING A USER (proven on sv9160, 2026-09-14)
  - §GS.2 — TECHNIQUES THIS PASS PAID FOR (sv9160, 2026-09-14)
  - §GS.3 — WHAT WORKS AND WHAT DOES NOT FOR ROLES ON sv9160 (measured 2026-09-14)
  - §GS.4 — CHANGING A STAFF MEMBER'S ROLE ON sv9160: WHY IT CANNOT BE DONE (measured 2026-09-14)

## GS.5 — UNBLOCKING RECIPES PROVEN 2026-09-15, AND THE FALSE BLOCKERS THEY REPLACE
→ part `build/kb/APP-ACTIONS-PLAYBOOK/048-gs-5-unblocking-recipes-proven-2026-09-1.md` (4 KB)
  - Driving Quasar controls (the staff editor, any q-select)
  - Reading the search modal honestly
  - Identity, roles and impersonation
  - Seeding
  - The general rule these all share

## 🆕 2026-09-16 — THE THREE-COOKIE LADDER ON A QA BRANCH API HOST, MEASURED (sv9160, build `v26.36.7-21b4db9`)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/049-2026-09-16-the-three-cookie-ladder-on-a-.md` (4 KB)

## ⛔ CORRECTION 2026-09-17 — `sv_sso_session` **DOES** EXPIRE. THE PLAYBOOK SAID IT DOES NOT.
→ part `build/kb/APP-ACTIONS-PLAYBOOK/050-correction-2026-09-17-sv-sso-session-doe.md` (2 KB)
  - The diagnosis, in order — 30 seconds, no browser
  - What does NOT fix it — all four tried and measured on 2026-09-17

## §X — CREATING A SECOND ORGANISATION ON A QA BRANCH (proven sv9160, 2026-09-17)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/051-x-creating-a-second-organisation-on-a-qa.md` (2 KB)

## §Y — THE IN-PAGE LIST SEARCH IS NOT THE GLOBAL SEARCH (proven sv9160, 2026-09-17)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/052-y-the-in-page-list-search-is-not-the-glo.md` (1 KB)

## §Z — `jira.sh` OUTPUT CARRIES A STATUS SUFFIX
→ part `build/kb/APP-ACTIONS-PLAYBOOK/053-z-jira-sh-output-carries-a-status-suffix.md` (2 KB)

## Simple Flow V2 on PRODUCTION — routes and traps found 2026-09-24
→ part `build/kb/APP-ACTIONS-PLAYBOOK/054-simple-flow-v2-on-production-routes-and-.md` (23 KB)
  - Work order LINES — the three-dot trap, the line editor, and the real menus (prod, 2026-09-25)
  - The grouped-by-VENDOR receive window — and the route to it (QA lead, 2026-09-25)
  - Reordering parts on a line, and moving a part to another line (production, v26.39.1)
  - Staging sign-in for Global Search (from 2026-09-28) — the QA branch is GONE
  - Staging routes and traps learned while running Global Search (2026-09-28)

## STAGING — permissions, roles and location switching (proven live 2026-09-28, build v26.39.1-02c6b6c)
→ part `build/kb/APP-ACTIONS-PLAYBOOK/055-staging-permissions-roles-and-location-s.md` (52 KB)
  - Driving a permission matrix without a second human login
  - The permission → search-group mapping, confirmed end to end
  - 🔴 The location lives in the BROWSER, not only in the session
  - 🔴 The mouse pointer selects the row that Enter will open
  - Smaller staging facts worth not re-discovering
  - WO Board / Tech View on a QA branch (sv10043, build v26.40.8-7a95011) — measured 2026-10-08
  - WO Board (sv10043) — three selector traps learned 2026-10-09 (each cost a whole batch)
  - Account access (impersonation) on the Work Orders QA branch — route found in the app code (2026-10-09)
  - Work order editing and the Parts pages' filters — confirmed by the QA lead (9 Oct 2026)
  - WO Board / Tech View suite — rerun on ANY environment in one command (2026-10-09)
  - Schedule drop-time on production vs QA, by location time zone (measured 12 Oct 2026, Rule 121)

