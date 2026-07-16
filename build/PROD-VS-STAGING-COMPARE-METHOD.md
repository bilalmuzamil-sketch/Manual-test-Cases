# Prod-vs-Staging (Two-Environment) Live Permission/Function Comparison — Reusable Method

> **Reusable across all projects (Standing Rule 3).** This is the proven method for
> producing a 100% LIVE-OBSERVED role/permission (or any function) comparison between
> two environments (prod vs staging, or any A-vs-B pair) with **ZERO cells marked
> "NOT VERIFIED".** It captures the learnings from the Custom Roles prod-vs-staging
> live permission comparison. It complements — and is governed by — Standing Rules
> **12** (verified means OBSERVED, never inferred) and **13** (live, feature-by-feature
> testing is the default standard).

---

## 0. STANDING REQUIREMENT (the bar to clear)

Prod-vs-staging (and ANY environment) permission/function comparisons MUST be **100%
LIVE-OBSERVED with evidence** (screenshot and/or captured API response) — **never
inferred** from role definitions, `fe_permissions`, atoms, or source code (Rules
12/13).

The user requires **ZERO cells marked "NOT VERIFIED."** Close every cell — headless
OR headful, seeding whatever data is needed. **Both prod and staging are disposable
TEST accounts** where writes/deletes are authorized (Standing Rule 6), so there is no
excuse to leave a cell open for lack of data. Only leave a cell open if it is
GENUINELY impossible after exhausting:
1. data seeding,
2. fresh-staff-creation for the role, and
3. real-holder switch-user impersonation,

and then state the **precise captured reason** (the exact response/screen observed),
never a guess.

---

## 1. ENVIRONMENT AUTH

### Prod (`app.shopview.com` / `api.shopview.com`)
- **NO SSO / NO 2FA** — the session is **PHPSESSID-only**.
- Use the **RENEWABLE self-login**: `POST /api/login {username, password}`.
  - The DEV `quick-login` endpoint **500s on prod** — do NOT use it there.
- Prod credentials live in **`/tmp` only** (e.g. `/tmp/custom-roles/prod-creds.env`),
  **never committed**.
  - NOTE: an earlier repo copy of the prod password was redacted, but it still exists
    in git history (commit `ee7b7e9`). **Recommend rotating**
    `bilal.muzamil+mainadmin@shopview.com`.

### Staging (`app.staging.shopview.com` / `api.staging.shopview.com`)
- `POST /api/quick-login {key:'admin'|'tech'}`, gated by **fresh cookies**
  (`sv_sso_session` / `PHPSESSID` / `cf_clearance`).
- Cookie lifetime ~**24 hours** (expire after ~24h or on a new deploy) — plan long
  runs in one window.

---

## 2. NODE / CHROMIUM PROXY GOTCHA

- **Node's built-in `fetch` IGNORES `HTTPS_PROXY`.** Run node with
  **`NODE_USE_ENV_PROXY=1`** (node 22.22) so calls route through the agent proxy.
- For **Chromium**, build a **fresh CONNECT-relay MITM bridge per run** (the port
  rotates — read `$HTTPS_PROXY` **live** each run) with **TLS1.2-max headless flags**.

---

## 3. PER-ROLE OBSERVATION TECHNIQUES (in order of reliability)

**(a) GENUINE switch-user impersonation into a REAL role-holder account = MOST
reliable.** No location-store artifact. Find real holders via the staff list.

**(b) If no real holder exists: CREATE A FRESH staff member for that role**, pinned to
a valid location, with a known password kept in `/tmp`, then **self-login CLEAN** as
that account. A fresh clean login populates the SPA location store correctly.

**(c) AVOID role-SWAPPING an existing staff member mid-session and then
self-logging-in as it.** That leaves the SPA **location-store unpopulated** and
BOUNCES reports/finance routes to **`/no-location`** — this is a **TECHNIQUE
ARTIFACT, NOT a permission result.** This was the root cause of many false "NOT
VERIFIED" cells. Use (a) or (b) instead.

**(d) On staging, self-service Tech role-swap works** when admin + tech are pinned to
the **SAME location** (this fixes the intermittent `staff/change` 403/500 on the
shared multi-org env). The staging path is **`POST /api/staff/{staff_id}/change`**
(the plain `/api/staff/change` → **405** on staging).

---

## 4. CLASSIFYING API ERRORS AS EVIDENCE

**A live API response under a role IS an observation** — but classify the actual
**response body** before assigning a verdict. Do NOT treat a crash-to-`/no-location`
as a verdict.

Worked example (resolved): the prod Finance panel
`POST /api/work-orders/invoices/estimate` → **HTTP 400** with body
`{"errors":[{"work_order_id":"Missing required parameter"}]}` is a **GENERIC data
error** (it also fires for the rendering SA role), so it is **NOT a permission
signal.**

Cross-check with a **direct API probe** to distinguish **data-readable** from
**control-usable** — e.g. an invoice-view returning **200 with readable data** vs a
**403 deny**.

---

## 5. SEEDING RECIPES (reuse cross-project — Standing Rule 3)

- **New Work Order:** New-WO wizard → pick/create customer via **"Add"** → pick/create
  asset via **"Add"** → **Save** → Confirmation → **Create**.
- **Unapproved line:** New Line → catalog **"What Are You Doing?"** lookup → leave
  **"Line Approved"** UNCHECKED.
- **Arbitrary / cored part:** New Part Request → **`select_part`** catalog PN (forces
  **Source = Inventory**; qty via **`input_bin_quantity_{binId}`**). Cored inventory
  PN **P550848** (also staging **84-2005** / **58-12**).
- **Pick / Receive:** Accept Delivery surface **`/accept-delivery/{orderId}`** +
  **`POST /api/inventory/orders/accept`**.
- **Remove a WO part / enable WO delete:**
  **`POST /api/work-orders/parts/delete {part_id, work_order_id}`**.
- **WO delete:** **`POST /api/work-orders/delete`**.
- **Cleanup:** tag throwaway data **ZZAUTOTEST**; **delete all seeded data + created
  staff afterward and verify gone.**

---

## 6. BUILD FINDINGS (staging Custom Roles build vs prod legacy)

- **Bulk Receive** is a **Simple-Flow-only** feature — ABSENT here (only single
  Receive, no checkboxes).
- **Fix Part#** has **no distinct control**.
- **Assign Vendor** appears **only in the New-PO / Order-Parts flow**.
- **Send-to-Terminal** is **ORG-terminal-config gated** — present when the org has a
  card terminal (e.g. staging **Heavy Duty**), absent when it doesn't (e.g. prod
  **Truck Hill**). This is **NOT a role/migration risk.**

---

## 7. DELIVERABLE SHAPE

- **One workbook** `Prod-vs-Staging-LIVE-VERIFIED-<date>.xlsx` with per-capability dual
  tabs: **Full Dual Matrix**, **Send-to-Portal LIVE**, **Send-to-Terminal LIVE**,
  **Parts-Module Dual LIVE**, **New-WO Create Dual LIVE**, **Remaining-Caps Dual
  LIVE**, plus **per-Pass LIVE** tabs.
- A companion **narrative `.md`**.
- **Classify each cell** as:
  - **MATCH**,
  - **STAGING-LESS** (prod had more), or
  - **STAGING-MORE** (staging grants more),
  with the per-spec annotation.
- **Evidence** stored under a **`live-ui-<date>/{production,staging}/<role>/`** tree
  (screenshots + per-role JSON).
- Any **inference-tainted earlier workbook** MUST carry a **SUPERSEDED banner.**

---

## 8. ROLE MERGE MAP (prod legacy → staging new-model)

| Staging new-model role      | Prod legacy role(s) it absorbs                          |
|-----------------------------|---------------------------------------------------------|
| Administrator               | Owner + Administrator                                    |
| Service Manager             | Service Manager                                          |
| Senior Service Advisor      | Service Advisor + SA Technician + SA No Reports          |
| Service Advisor             | SA Limited View                                          |
| Foreman                     | Foreman (1:1)                                            |
| Technician                  | Technician (1:1)                                         |
| Parts Manager               | Parts Manager (1:1)                                      |
| Parts Technician            | Parts Technician (1:1)                                   |
| Office                      | Office                                                   |
| Sales Representative        | Sales Representative + Reporting                         |
| Time Clock User             | Time Clock                                               |

---

## 9. HOW TO RESUME / RE-RUN

1. Refresh env auth (prod self-login `/api/login`; staging fresh cookies +
   quick-login). Secrets to `/tmp` only.
2. Start node with `NODE_USE_ENV_PROXY=1`; build a fresh Chromium MITM bridge if
   driving the UI.
3. For each role, observe LIVE using §3 technique (a) → (b) → (d); never (c).
4. Capture evidence per role under `live-ui-<date>/{production,staging}/<role>/`.
5. Classify each cell (§4 for API bodies; §7 for MATCH/STAGING-LESS/STAGING-MORE).
6. Regenerate the workbook + narrative; supersede any inference-tainted prior output.
