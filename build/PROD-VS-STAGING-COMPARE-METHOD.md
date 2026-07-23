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

**SETUP PRECONDITION — reset in-scope roles to template first (Standing Rule 26).**
Before observing any role in EITHER env, **reset every in-scope role to its template/default**
('Reset To Template'), recording each role's pre-reset and post-reset permission set — the
before→after drift diff is itself a comparison finding (which roles were over-/under-granted by
prior or parallel-session testing on the shared org). Verify each template-default against the
canonical spec permission matrix and FLAG any role whose template differs from spec. Only then
observe live per role, so the comparison reflects spec-default permissions, not drift.

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

---

## 10. SPEC-CONFORMANCE ANNOTATION (per-spec / per-standing-rules columns)

When the comparison workbook (or any deliverable) carries a **"Per Spec?"** /
conformance column judging each cell against the spec, the annotations are
release-critical calls in their own right and get their own method (see Standing
Rule 15 in CLAUDE.md):

1. **Canonical-doc-only sourcing.** NEVER derive the calls from a prose
   summary/extract of the spec (a requirements.md digest, a prior pass's notes, a
   pasted excerpt). Work from the CANONICAL spec document itself — its Permission
   Matrix / requirement tables, prose sections, change-log, key decisions, and open
   questions. A prose extract can silently carry a stale column.
2. **Verbatim truth table, committed.** Before annotating, build a VERBATIM
   role×gate (or requirement×behavior) TRUTH TABLE straight from the canonical
   spec's Permission Matrix. Every value carries a citation to its exact table
   row/section. Apply EVERY change-log entry (latest-wins) so no pre-update column
   survives. Commit it alongside the deliverable using the
   `spec-conformance/spec-truth-table.md` pattern so the derivation is auditable.
3. **Independent re-derivation.** Derive every annotation FROM the truth table —
   never from memory, a previous pass, or the earlier workbook's own cells.
4. **Adversarial diff before delivery.** Independently recompute the calls (full
   population for release-critical work; a sample otherwise) and DIFF against the
   produced annotations. Ship only after the diff is empty.
5. **MATCH rows are still judged.** A prod==staging MATCH cell must STILL be
   checked against the spec — identical behavior in both environments can still be
   a spec deviation. Never auto-mark MATCH rows conformant.
6. **Spec-silent / spec-inconsistent handling.** If the spec genuinely says
   nothing, write "spec silent" — but only after reading the FULL spec (matrix +
   prose + change-log + key decisions + open questions; e.g. a blanket "Decline
   line = spec-silent" call missed §1b "authorize lines"). If the spec contradicts
   itself (e.g. matrix vs migration-table), write "spec inconsistent (flagged)"
   with BOTH citations — never silently pick a side.
7. **Incident + corrected-artifact pattern.** 2026-07-16: a "Per Spec (v2)?"
   annotation pass over this comparison's workbook produced **64 wrong cells out
   of 297** because it derived from a prose extract carrying a stale pre-7/14
   Office User column (change-log not applied) and blanket-marked "Decline line"
   spec-silent. The fix that worked: build the verbatim cited truth table,
   re-derive every annotation from it, adversarially diff before delivery — and
   correct at ALL THREE layers (the extract, the generator, and the workbook), so
   no stale source can regenerate the error.

## Self-seed to unblock — never stay blocked on data (Standing Rule 14)
This process MUST self-seed any missing data state rather than declare "blocked" or ask the user to
provide data. Playbook (learned 2026-07-23): (a) don't rely on the user to fix env/data/workplace
issues — find the switcher or another usable record yourself; (b) if the UI is flaky (Quasar
dialogs/selects intercepting clicks) switch to the API, and if the API is scoped/awkward switch to
the UI; (c) discover endpoints by probing — POST an empty/partial body and read the validation error
for required fields (e.g. `POST /api/work-orders/create` needs company_id+vehicle_id+workplace_id+
start_date+`is_vehicle_here:true`); (d) create the WOs/lines/parts/adjustments/roles/customer-defaults
needed (a customer default makes fees auto-apply); (e) for Quasar UI click by element-center
coordinate (`page.mouse.click`) not Playwright actionability clicks; (f) clean up ZZAUTOTEST data and
restore roles afterwards. Only a genuinely un-provisionable dependency (a server 500 on create, an
external device) is a real blocker — characterise it with evidence (endpoint + requestId), never bare
"NOT VERIFIED", and hand the user a layman step-by-step data-setup sheet for the one thing only a
human/dev can supply. User rule: "there is nothing like 'require seeding data' — make everything in
the build; do not find an excuse to keep yourself blocked."
