# ShopView Testing Runbook — Staging + TestRail (DURABLE, NON-SECRET)

> **NO SECRETS IN THIS FILE — EVER.** Never write cookie values, session IDs,
> tokens, passwords, API keys, CA contents, or rotating proxy ports here or in
> any commit/log. This runbook documents the *method* and the stable, non-secret
> identifiers only. Secrets are re-supplied per environment (see section 2).

This is the single authoritative guide for running per-role / per-permission test
executions against ShopView **staging** and logging results to **TestRail**.
It captures the proven approach so future runs do not have to rediscover it.

> **Keeping this current:** update this runbook only when the **METHOD changes and
> it's proven** — record **only what actually worked** (never failed approaches or
> dead-ends); a gotcha goes in only as the working fix.

---

## 1. Overview & Scope

- **Purpose:** verify ShopView's Custom Roles / permission behavior on staging
  (what each role/permission does and does not gate in the app), then record
  results in TestRail.
- **Two surfaces per test:**
  - **Backend enforcement** — call the API endpoint and check `403` vs
    `200/201`.
  - **Front-end display gating** — drive the SPA UI and observe what is
    shown/hidden/enabled. Many granular permissions are FE-only display gates
    (see section 5).
- **Working method (proven):** authenticate to staging via the DEV quick-login
  SSO path, create a throwaway custom role with exactly the permissions under
  test, assign it to a dedicated **Tech** user, re-login as Tech, poll effective
  permissions, then verify in the API and/or UI. Restore Tech to Time Clock and
  delete throwaway data at the end.
- **Companion doc:** `build/VIU-ACCESS-METHOD.md` (Verify-in-UI access notes).
  This runbook supersedes/expands it with the full method.

---

## 2. What's Durable vs What to Re-Supply

**Durable (committed, in this repo):**
- This runbook and the method it describes.
- All non-secret identifiers below (staff id, role ids, workplace id, org id,
  TestRail project/suite/section ids, run id, endpoint list).
- `build/custom-roles-run/run-plan.json` — the section + case-list structure and
  the in-scope case ids for the current execution (run 312).

**Must be re-supplied on a fresh environment (NEVER committed, `/tmp` only):**

| Secret | Where to put it | Perms |
|---|---|---|
| (a) Staging cookies: `PHPSESSID`, `cf_clearance`, `sv_sso_session` | `/tmp/cln/cookies.json` | `chmod 600` |
| (b) TestRail creds: `email` + `api_key`-or-`password` (+ `host`) | `/tmp/testrail/creds.json` | `chmod 600` |

- Both are **ephemeral** — `/tmp` is wiped on container reset — and MUST NEVER be
  committed to git, pasted into logs, or written into any repo file.
- `cookies.json` shape: a flat JSON object `{ "PHPSESSID": "...",
  "cf_clearance": "...", "sv_sso_session": "..." }`.
- `creds.json` shape: `{ "host": "https://shopview.testrail.io", "email": "...",
  "password": "<api_key_or_password>" }`.
- Staging session cookies (`app.staging.shopview.com` / `api.staging.shopview.com`)
  last **~24 HOURS** — they expire only after ~24h **OR** when a new deployment
  happens; they do **NOT** expire after ~1 hour. Plan long VIU runs accordingly (a
  whole run can be done in one window). If quick-login returns **401 `sso_required`**
  / **409** before 24h, suspect a **deployment** (or a genuinely stale set) and
  re-request cookies. Re-acquire cookies from a live authenticated `app.staging`
  browser login when a window expires.
- Sandbox **Network access must be Full** — a restricted allowlist blocks the
  `*.staging.shopview.com` hosts and the run cannot proceed.

---

## 3. Staging Access

### Topology
- `app.staging.shopview.com` — SPA frontend (Vue/Quasar).
- `api.staging.shopview.com` — Symfony JSON backend.

### Authentication (DEV quick-login SSO)
- `POST https://api.staging.shopview.com/api/quick-login` with body
  `{ "key": "admin" }` or `{ "key": "tech" }`.
- DEV login is **gated by valid session cookies** (the three in section 2).
- **Prefer the quick-login SSO path.** The raw-cookie API session can return
  `409` ("Session has expired.") while quick-login still works. quick-login
  returns a fresh `PHPSESSID` in `Set-Cookie`; rebuild the cookie header by
  swapping in that fresh `PHPSESSID` and keeping `cf_clearance` +
  `sv_sso_session` (this is exactly what `/tmp/cln/adm.mjs` `login()` does).

### API calls from Node
Run Node with:
- `NODE_USE_ENV_PROXY=1`
- `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`
- Send a **Chromium User-Agent** header (this is what passes Cloudflare), plus
  `Origin: https://app.staging.shopview.com` and `Referer:
  https://app.staging.shopview.com/`.
- Use Node's global `fetch` with `redirect:'manual'`.

### Chromium UI automation
- Binary: glob `/opt/pw-browsers/chromium-*/chrome-linux/chrome`.
- Set `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
- **NEVER run `playwright install`** (no network for it; the browser is already
  present at the path above).
- Chromium cannot TLS through the egress proxy directly. Build a **FRESH local
  MITM bridge per run**:
  - A small Node HTTP server that accepts Chromium's `CONNECT` and forwards each
    request via Node global `fetch` with `NODE_USE_ENV_PROXY=1` +
    `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
  - Launch Chromium with:
    `--proxy-server=http://127.0.0.1:<freshBridgePort>`
    `--ignore-certificate-errors --no-sandbox --ssl-version-max=tls1.2`.
  - **Read `$HTTPS_PROXY` fresh at start-up each run — the proxy port rotates
    between sessions.** Do NOT reuse an old bridge or a hard-coded port.
  - (Playwright can also be pointed at `proxy:{server: process.env.HTTPS_PROXY}`
    directly, as `/tmp/cln/boot2.mjs` does; the dedicated bridge is the fallback
    when the direct proxy path fails.)

### SPA hydration (the `boot2` pattern)
The DEV-MODE Tech/Admin login **buttons do not reliably work**. Hydrate the SPA
manually instead:
1. quick-login (section above) to get the fresh session + the quick-login
   response JSON.
2. Seed the browser context cookies from the fresh session
   (`domain: .staging.shopview.com`, `path: /`).
3. Navigate to a lightweight app-origin route (e.g. `/login`) so localStorage is
   writable, then set:
   - `localStorage['user']` = the full quick-login response JSON (`{data:...}`).
   - `localStorage['fe_permissions_wrapper']` = body of
     `GET /api/auth/me/fe-permissions`.
   - `localStorage['token']` = the token from the quick-login response.
4. THEN navigate to the target `app.staging.shopview.com` route.
5. Set `page.setDefaultTimeout(8000)`.

### Reusable scripts (`/tmp/cln`, recreate if `/tmp` was wiped)
- `adm.mjs` — `login(key)` (quick-login + cookie rebuild) and `api(sessCookie,
  method, path, body)`. All other scripts import from it.
- `api.mjs` — raw-cookie one-shot API caller (no quick-login).
- `boot2.mjs` — the SPA hydration launcher described above.
- `restore.mjs` — restore Tech to Time Clock and verify (section 4).
- These read secrets from `/tmp/cln/cookies.json`; **recreate them if missing**
  (they contain no secret values themselves — only the method).

---

## 4. Role / Permission Setup

### Reference IDs (non-secret)
| Thing | Value |
|---|---|
| Tech user email | `tech@shopview.com` |
| Tech **staff_id for `/change`** | `6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa` |
| Tech staff-list id (does **NOT** work on `/change`) | `a7fd0a88-...` (404s on `/change` — do NOT use it there) |
| Workplace id | `b3c8c820-f815-4cf1-8938-10956c5ee71a` |
| Time Clock role_id (restore target) | `77b069d1-19dd-4a7f-a541-819bd3cd7cde` |
| Organization id | `d55bc308-e61a-438d-b5f1-c7a73c89d49f` |

> Get the authoritative list of roles/permissions from
> `GET /api/organizations/{org}/roles`.

### Assign a specific permission set to Tech
1. Create/update a throwaway custom role (prefix its name **`ZZAUTOTEST`**; an
   earlier method used a single reusable **`BILAL AUTOMATION`** role — reuse one
   role across cases that need the same perms). Use
   `POST`/`PUT /api/roles/{id}`; shape the payload from
   `GET /api/organizations/{org}/roles` with **exactly** the permissions needed.
2. Assign it to Tech:
   `POST /api/staff/6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa/change` with body:
   ```json
   {"first_name":"Tech","last_name":"ShopView","email":"tech@shopview.com",
    "workplace_id":"b3c8c820-f815-4cf1-8938-10956c5ee71a","role_id":"<roleId>"}
   ```
   **Use the EXACT staff_id `6fb22c1b-...`. NEVER match by substring or email** —
   a past near-miss changed the wrong user.
3. Fresh Tech login (`quick-login {key:'tech'}`); a role change **forces a
   re-auth**, so the previously-held session `409`s ("Session has expired.") —
   this is **expected**.
4. Poll `GET /api/auth/me/fe-permissions` until it reflects the new role
   (`match=true` / expected `fe_permissions` keys present).
5. Verify in API and/or UI (section 5).

### Testing a SYSTEM role
Assign that system role's `role_id` directly to Tech (same `/change` call).

### ALWAYS restore + clean up (even if interrupted)
- Restore Tech to **Time Clock** (`role_id
  77b069d1-19dd-4a7f-a541-819bd3cd7cde`) and **verify** via a fresh Tech
  `fe-permissions` read (`/tmp/cln/restore.mjs` does exactly this).
- **Delete** throwaway `ZZAUTOTEST` roles and any throwaway data created.

### Known-good endpoints (non-secret)
| Purpose | Endpoint |
|---|---|
| SSO auth check | `GET /api/sso/check` (build calls doubled `/api/api/sso/check` — a known bug) |
| Effective FE permissions (poll) | `GET /api/auth/me/fe-permissions` |
| Roles list / read | `GET /api/roles` · `GET /api/organizations/{org}/roles` |
| Create / update role | `POST`/`PUT /api/roles/{id}` |
| Delete role | `DELETE /api/roles/{id}` |
| Assign role to staff | `POST /api/staff/{id}/change` |
| Staff list / read | `GET /api/staff` |
| Digital Inspections presence | `GET /api/inspection-templates` |

---

## 5. Domain Preconditions & Gotchas

Ignoring these produces **false results**.

### Enforcement model (critical)
- The backend enforces **only resource-level View/Edit**. Granular permissions —
  Delete, WO sub-permissions, cross-toggles, `view_mode` — are **front-end
  display gates the raw API does NOT enforce**.
- Therefore: **expected-denial cases → verify in the UI**; **backend-enforcement
  cases → hit the endpoint and check `403` vs `200/201`.**

### Create Invoice preconditions
Requires ALL of:
- every part **RECEIVED** with a **real PART NUMBER** — no "Requested" status, no
  `(-)` prefix, no part badge; AND
- the **Review** step completed (an unclicked Review button blocks Create
  Invoice).

### The "OVER LIMIT" customer badge blocks NOTHING
It does not block pick, invoice, or reverse. **Never attribute a block to it** —
the real cause is usually a blank/missing part number.

### Deletion cascade rules
- Delete a **WORK ORDER** → move it to **Uncomplete** first.
- Delete a **LINE** → allowed in any status **EXCEPT Complete**.
- A **part return** cannot be deleted on a **Completed** WO → uncomplete first.
- WO / line statuses: **Uncomplete / Approved / Authorized / Complete**.

### Financial / permission gates (per the UPDATED spec)
- **See Financial Data (SFD)** gates cost/price/margin/totals visibility, scoped
  to work orders, parts, and invoices.
- **Order Parts now REQUIRES See Financial Data**, and Order Parts controls the
  **WO Parts tab**.
- **WO Lines Create & Edit** covers core OK/Not-OK marking + line story/history.
- **WO View** = create/edit ANY note; **WO Delete** = delete ANY note.
- **Manage AP/AR** no longer gates AR/AP aging reports — those now follow the
  **Reports** permission (all-or-nothing).
- **IMPORTANT:** these spec changes are **NOT all implemented on staging yet**
  (as of the last run). Cases written to the new spec may **fail against the
  current app** — see the run-312 findings in
  `build/custom-roles-run/CustomRoles_Run312_SUMMARY.md` (e.g. 26482 aging still
  gated by AP/AR; 27869/26475 Order Parts + SFD prompts absent; QuickBooks
  relocation not present).

---

## 6. Session Quirks (harness limitations to expect)

- Some `create-*` endpoints (`work-orders/create`,
  `work-orders/lines/create`, `create-customer-payment`) return **HTTP 500** in
  some sessions — reuse existing records or create via the UI.
- Existing WO detail pages can **bounce to `/workorders`** on mount for all
  roles; only **freshly-created** WOs reliably land on the detail `/lines` page.
- The `/parts/part-sales` SPA route, the Quasar rich-text editor, the inline
  parts grid, and confirmation buttons can resist headless automation. When a
  control resists driving:
  1. Try multiple techniques: selector click, bounding-box coordinate click, JS
     `value` + `input`/`change` events, keyboard, or firing the element's own
     click handler.
  2. If truly undrivable, issue the action to the **exact same endpoint the UI
     calls** — but only **after confirming the FE gate/dialog was reachable** —
     and disclose that you did so.
  3. **Never mark PASS on gate presence alone.**

---

## 7. TestRail

- Instance: `https://shopview.testrail.io`, API **v2**.
- Auth: HTTP **Basic** `base64("email:apikey_or_password")`; header
  `Content-Type: application/json`; call via Node global `fetch` through the
  agent proxy (`NODE_USE_ENV_PROXY=1`, `NODE_EXTRA_CA_CERTS`).
- **Project id 1**, single **suite "Master" id 1**.
- List endpoints paginate: response is
  `{offset, limit, size, _links, <collection>}`. Page with
  `&limit=250&offset=N`.

### Case fields in use
- `template_id 1` (Test Case (Text)), `type_id 6` (Functional).
- Populated free-text: `custom_preconds`, `custom_steps`, `custom_expected`.
- **Creating a case REQUIRES** `custom_atmstatus: 3` and
  `custom_automation_type: 0` — otherwise `add_case` returns **400**.
- Use **REAL newline characters** in text fields (not literal `\n`) so Markdown
  lists render.

### Result statuses (no custom statuses)
`1 Passed` · `2 Blocked` · `3 Untested` · `4 Retest` · `5 Failed`

### Key endpoints
`get_projects` · `get_suites/{p}` · `get_sections/{p}&suite_id={s}` ·
`get_cases/{p}&suite_id={s}[&section_id=]` · `get_case/{id}` ·
`add_case/{section_id}` · `update_case/{id}` · `add_run/{p}` ·
`update_run/{run}` · `get_run/{run}` · `get_tests/{run}` ·
`add_result_for_case/{run}/{case}` · `get_statuses` ·
`get_history_for_case/{id}`
(all under `${host}/index.php?/api/v2/<endpoint>`).

### Structure / ids for the current execution
- **Custom Roles - (Revised)** = section **3527**.
  - Combo + Breakage subtree = **3641–3645**.
  - Digital Inspections = **3646** (+ **3647–3657**).
- **Current execution run = 312**
  (`https://shopview.testrail.io/index.php?/runs/view/312`).
  - Built over 3527 minus Combo minus DI = **408 cases**.
  - Regression Suite ("Minja's API file") and Backend API & Security later
    **excluded from execution** per request → **254 in-scope**.
- `build/custom-roles-run/run-plan.json` holds the full section + case list.
- Run 312 results so far (see `CustomRoles_Run312_SUMMARY.md`): 159 Passed
  (logged), 34 Failed, 44 Retest, 16 Blocked, 1 Not Run — only the Passed cases
  were logged to TestRail.

---

## 8. Standing User Rules (MUST follow)

- **NEVER write to TestRail** (create/update/delete cases, create runs, log
  results) **WITHOUT explicit user permission.**
- When logging a run: **log ONLY Passed cases to TestRail**; leave
  Failed/Retest/Blocked as **Untested** in TestRail. **Capture ALL results
  locally** and deliver a report with a **separate tab per status**.
- Staging is **fully disposable** — create/delete test data freely (mark
  `ZZAUTOTEST`). The only guardrails: **don't delete something you still need**,
  and **exact-user-match on role changes** (never substring/email match).
- In the current Custom Roles execution scope, **ignore** Digital Inspections,
  Regression Suite (Minja's API file), and Backend API & Security — unless told
  otherwise.
- **NEVER commit** cookies/tokens/API keys/passwords. Secrets live in `/tmp`
  only.
- Commit identity for this work: `git config user.email noreply@anthropic.com`,
  `git config user.name Claude`.

---

## 9. Worker Execution Discipline (batched runs)

- **Commit after every case.**
- Make batches **resume-safe**: skip case_ids already recorded.
- At ~150 tool calls, **stop cleanly**: commit, **restore Tech to Time Clock**,
  and report done-vs-remaining.
- **No Monitor tool, no idle-waiting.**
- **Push** at the end and at step 0.
- On **HTTP 401 `sso_required`** or **persistent 409**: commit, restore Tech,
  and report **"cookies expired"** (the ~24h session window lapsed, or — if it
  happens well before 24h — a **deployment** likely rotated the session; re-supply
  cookies per section 2).
