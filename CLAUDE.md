# ShopView Manual Test Cases — Project Memory

> **Before any staging or TestRail testing, read `build/TESTING-RUNBOOK.md`.**
> That runbook holds the full, proven method; this file is a concise index +
> durable memory. **No secrets in this repo — ever** (secrets live in `/tmp`).
> - App action recipes (how to do each thing in ShopView): build/APP-ACTIONS-PLAYBOOK.md
> - Keep the books current: After each task, append ONLY success-proven learnings
>   (working navigation paths, action recipes, endpoints, the specific unblock that
>   worked) to build/APP-ACTIONS-PLAYBOOK.md; update build/TESTING-RUNBOOK.md when the
>   method changes; update CLAUDE.md when a durable fact changes. Do NOT record failed
>   approaches or dead-ends; a gotcha is recorded only as the working fix. Promote
>   (verify) items to confirmed only after actually succeeding. Reuse the books for
>   anything done before; research only genuinely new things.

## Projects in this workspace (three projects, one chat)
This workspace/chat serves **THREE separate projects**. Keep their memory
**SEPARATE** (don't mix facts/scope), but **reuse knowledge across them when
genuinely helpful** (e.g. the staging access method + testing harness apply to
all).

1. **Custom Roles project** — Custom Roles & Permissions (ShopView). Existing
   memory: this CLAUDE.md's detail sections, `build/TESTING-RUNBOOK.md`,
   `build/APP-ACTIONS-PLAYBOOK.md`, `build/custom-roles-run/*`,
   `build/custom-roles-spec-update/*`, TestRail section **3527** / run **312**.
2. **Fees and Discount project** — Fees & Discounts V1 (ShopView). Memory:
   `build/fees-discounts/*` (`requirements.md` = spec extract [NOTE: source PDF
   was truncated at Story 2; Stories 3-13 missing], `viu-findings.md` when done,
   `/tmp/fees-discounts` loom transcript). **STATUS: BLOCKED** — do not proceed
   with VIU or case-writing until BOTH the COMPLETE spec (Stories 3-13, incl. the
   Story-13 permissions table) AND the design files are provided.
   *TestRail import (INTERIM):* `testrail-import/fees-discounts-v1-testrail-import.csv`
   (+ `.xlsx`), all 182 cases via `build/fees-discounts/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule**; INTERIM pending post-VIU + dev-answer
   finalization (see `build/fees-discounts/RESUME-STRATEGY.md`). Permissions: DEFINED
   / reuse-only — see `build/PERMISSIONS-ASSESSMENT.md`.
3. **Simple flow project** — Simple Mode / Streamlined Work Order Completion &
   Receiving (ShopView), Epic **SV-7301**. **CANONICAL STATE DOC (read first for
   resume):** `build/simple-flow/PROJECT-STATE.md` — the single authoritative
   snapshot (case inventory 162 + VIU breakdown, TestRail state, deliverables
   index, open threads, env/access facts, how-to-resume). Memory:
   `build/simple-flow/*`
   (`requirements.md` = COMPLETE spec, 17 stories SV-7696..SV-7710 + SV-7870 +
   SV-7876; `design-notes.md`; `viu-findings.md`; `cases/*.json` = 156 authored
   cases with `SF-` IDs; `SimpleFlow_V1_TestCases.xlsx/.csv`;
   `build_workbook.py` + `gen_cases.py`). TestRail = later (not yet imported).
   **STATUS: cases authored; VIU PARTIAL** — feature under development, so Stories
   **7/8/9/14 are NOT built** and role-gating negatives are unverified. 14 open
   questions consolidated in the workbook's Open Questions tab.
   *TestRail import (INTERIM):* `testrail-import/simple-flow-v1-testrail-import.csv`
   (+ `.xlsx`), all 156 cases via `build/simple-flow/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule** (settings-driven, so settings preconditions
   are kept); INTERIM pending post-VIU + dev-answer finalization (see
   `build/simple-flow/RESUME-STRATEGY.md`). Permissions: REQUIRES definition (no role
   matrix) — see `build/PERMISSIONS-ASSESSMENT.md`.
   **Simple Flow contradiction rule:** when two inputs conflict (spec doc vs answer
   sheet vs design), the MOST RECENT update is authoritative (last-update-wins). The
   V2.4 spec doc + 2026-07-08 design bundle are the latest and override the earlier
   round-1 answer sheet where they disagree.

**STANDING RULES (apply to all projects):**
1. **Never proceed without the complete set of information needed.** If
   specs/designs/inputs are incomplete, STOP and ask for the missing pieces
   before doing the work (do not guess or partially proceed on a half-spec).
2. **Always confirm which project an instruction is for.** When the user gives an
   instruction, first offer the options (Custom Roles project / Fees and Discount
   project) and confirm the target project before acting — unless the instruction
   itself unambiguously names or references one project's artifacts.
3. **Separate memory per project; cross-use when useful.** Shared infrastructure
   (staging access, harness scripts, TestRail API patterns) is common;
   project-specific facts/scope/cases stay under each project's own files.
4. **API test placement:** ANY test case (any project) whose preconditions, steps,
   or expected results include API-related content — API endpoints, HTTP
   methods/verbs, HTTP status codes (200/201/204/400/403…), or explicit backend
   request/response checks — MUST be placed in a TestRail section whose title
   includes 'API'. UI-only cases stay in their functional sections. Apply to every
   TestRail import going forward.
5. **Self-service test data & roles (all projects):** On the disposable
   test/QA/staging environments, CREATE and DELETE whatever data a test case needs
   yourself (work orders, POs, parts, assets, inventory items, custom roles, etc.)
   — never block on missing data you can seed. To verify role-specific behavior,
   assign the Tech user the needed role (a system role, or a purpose-made custom
   role), test, then RESTORE Tech to its original role afterward. Do not block on
   anything you can do yourself. Still: mark throwaway data ZZAUTOTEST, restore any
   user/role/settings you change, and don't do irreversible things outside the
   disposable env.

## Project purpose (Custom Roles project)
Manual test-case authoring + live staging (Verify-in-UI) verification + TestRail
management for ShopView **"Custom Roles and Permissions"**, plus related
regression / bug-fix re-testing.

## Durable key facts (detail → runbook)
- **Staging topology:** `app.staging.shopview.com` = SPA frontend;
  `api.staging.shopview.com` = Symfony JSON backend.
- **Auth:** DEV `POST /api/quick-login {key:'admin'|'tech'}` (gated by valid
  session cookies). Prefer quick-login SSO over raw-cookie API (raw can 409).
- **UI automation:** Chromium can't TLS through the egress proxy directly — build
  a FRESH MITM bridge per run (port rotates; read `$HTTPS_PROXY` live). Use the
  `boot2` hydration pattern (seed cookies + localStorage `user` /
  `fe_permissions_wrapper` / `token`, THEN navigate); the DEV login BUTTONS don't
  reliably work.
- **IDs (non-secret):**
  - Tech `/change` **staff_id `6fb22c1b-...`** (the staff-list id `a7fd0a88-...`
    **404s on `/change`** — never use it there).
  - workplace `b3c8c820-...`; Time Clock role `77b069d1-...` (restore target);
    org `d55bc308-...`.
  - Tech email `tech@shopview.com`.
- **TestRail:** project **1** / single suite **1 "Master"**; API v2, Basic auth.
  - Custom Roles - (Revised) = section **3527**; Combo+Breakage **3641–3645**;
    Digital Inspections **3646**; execution **run = 312**.
  - `add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`.
  - Result statuses: **1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed**.
  - Scope structure lives in `build/custom-roles-run/run-plan.json`.

## Durable key facts (simple flow)
- **SHORTCUT INTERPRETATION PRINCIPLE (Simple Flow ONLY):** Simple Flow's purpose
  is to shorten/skip legacy multi-step flows to reach the **same end state faster**.
  Therefore any behavior that reaches the same destination by SKIPPING a legacy
  flow/step is **EXPECTED** (not a bug, not a PO question). It is ONLY a defect if
  the skip (a) throws an **ERROR**, or (b) **corrupts data / inventory / Part-History
  integrity**. Applied 2026-07-08: BUG-3, BUG-4, BUG-10 reclassified → EXPECTED;
  BUG-11 stays a REAL DEFECT (skip 500s); BUG-5/6/7/8/9 = OTHER (enforcement or
  added-requirement, not flow-skips). Detail in `build/simple-flow/finding-reclassification.md`.
- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note: `sv7301api`, no dot).
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` gated by cookies
  `sv_sso_session` / `PHPSESSID` / `cf_clearance` (domain `.qa.shopview.com`;
  secrets in `/tmp` only). **Both `{key:'admin'}` and `{key:'tech'}` return 200**
  (the earlier tech-403 is FIXED). quick-login is **stateful on the shared
  PHPSESSID** — probe roles strictly SEQUENTIALLY. Read fe-permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}` (array of code strings, NOT a bool map).
- **Settings-driven, NO feature flag** — behavior is controlled by the Work Order
  settings tab (checked `/administration/feature-flags`: no "Simple Mode" flag).
  Read `GET /api/organizations/settings`; save
  `POST /api/organizations/settings/change` (full settings object).
- **Routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries/Accept-Delivery `/parts/deliveries`; WOs
  `/workorders` → `/workorders/{id}/lines`.
- **NOT built yet:** Stories **7** (PO multi-select), **8** (Bulk Receive page),
  **9** (apply-invoice), **14** (Waiting-on-Parts column).
- **Receive/inventory endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}` (`{data:{order:{items}}}`); deliveries
  `GET /api/inventory/deliveries`; inventory parts `GET /api/inventory/parts?…&search=`.
  **Receive = `POST /api/inventory/orders/accept`** (driven from
  `/accept-delivery/{orderId}` = the shared Accept Delivery surface: fields
  `invoice-number`, Invoice Date, per-line `delivered` qty, Tax, note; over-qty →
  "Received More Than Ordered" warning). Remove a WO part =
  `POST /api/work-orders/parts/delete {part_id,work_order_id}` (returns picked
  inventory + enables WO delete).
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id). Add via New Part Request → `select_part` catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). **BUG-10:** the completion
  wizard shows NO distinct "Resolve Cores" step for a pre-picked inventory core
  (goes Details→Success); core Ok/Not-Ok is a LINE-level control.
- **VIU deviations (bugs):** (1) no "Create Purchase Orders" toggle / no
  `createPurchaseOrders` field — POs always-on; (2) Save Settings always enabled;
  (3) Mark-Reviewed dialog missing optional `input_review_note`; (4) review
  sign-off jumps straight to Complete (no distinct "Reviewed" state observed).
- **Permissions matrix = §9 of requirements.md (from SV-8183)** — DEFINED and now
  **live-verified for all 11 roles** (SF-PERM-10). Completion gate = FE-only at BE
  (BUG-6 atom-collapse).
- **IDs:** case IDs use `SF-<AREA>-NN`; org `d55bc308-...` (shared with Custom
  Roles). VIU tools in `/tmp/simple-flow/tools/`.
- **Self-service Tech role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-...`, **staff
  `6fb22c1b-...`**, restore role **Technician `131b5274-...`**, workplace
  `b3c8c820-...`. EXACT-MATCH `email==='tech@shopview.com'` before changing;
  safety-net `restore-tech.mjs`. **ALL 11 system roles are REAL & assignable** (the
  earlier "only 3 instantiated / other 8 are templates" note was WRONG). Roles list:
  `GET /api/organizations/{org}/roles` (405 on `/api/roles`). Ids: Admin
  `16fec34c…`, Service Manager `ef6e24c2…`, Senior Service Advisor `e03f176f…`,
  Service Advisor `3874cc56…`, Foreman `897018a5…`, Technician `131b5274…`, Parts
  Manager `5d703b9b…`, Parts Tech `486622b9…`, Office `163abe0d…`, Sales
  Representative `8eb4a1c1…`, Time Clock `0a198766…` (full map
  `/tmp/simple-flow/roles-map-6.json`). Assign any role to Tech via
  `POST /api/staff/{staff_id}/change` with that `role_id`. Role detail
  `GET /api/roles/{id}`. **SF-PERM-10 full 11-role completion matrix VERIFIED live**
  (matches §9.2 exactly; Complete gate = `workOrdersCreateAndEdit`).

## Key findings to remember
- **Enforcement model:** backend enforces only **resource-level View/Edit**;
  granular perms (Delete, WO sub-perms, cross-toggles, view_mode) are
  **FRONT-END display gates** the raw API does NOT enforce. Denial cases → verify
  in UI; enforcement cases → hit endpoint, check 403 vs 200/201.
- **Sasha's spec updates:** WO View = create/edit ANY note; WO Delete = delete
  ANY note; **Order Parts requires See Financial Data** and controls the WO Parts
  tab; WO Lines Create&Edit covers core OK/Not-OK + line story; **Manage AP/AR no
  longer gates aging reports** (they follow the Reports permission,
  all-or-nothing); History logs split WO-level vs line-level; Inventory item +
  SFD gating.
- **CAUTION:** several of these spec changes are **NOT yet implemented on
  staging** — cases written to the new spec may FAIL against the current app.
  See `build/custom-roles-run/CustomRoles_Run312_SUMMARY.md`.

## Standing user rules
- **NEVER write to TestRail** (create/update/delete cases, runs, or results)
  **without explicit user permission.**
- When logging a run: **log ONLY Passed cases to TestRail**; put
  Failed/Retest/Blocked only in the **local per-status report** (a tab per
  status). Capture ALL results locally.
- Staging is **fully disposable**: mark throwaway data `ZZAUTOTEST`, use
  **exact-user-match** on role changes (never substring/email), and **restore
  Tech to Time Clock** after.
- Currently **ignore** Digital Inspections, Regression Suite (Minja's API file),
  and Backend API & Security in the Custom Roles execution scope (unless told
  otherwise).
- **NEVER commit secrets** (cookies/tokens/keys/passwords) — `/tmp` only.
- Git identity: `noreply@anthropic.com` / `Claude`.
- The **"Unverified" commit stop-hook is a known false alarm** (signing key not
  registered) — ignore it.

## Deliverable conventions the user likes
- Plain, layman English.
- Numbered **Preconditions / Steps / Expected**, each with line breaks.
- Excel workbooks: a **separate tab per result status** + a **Summary** tab.
- Provide **GitHub raw download links** for deliverables.
- **Per-case audit logs** for any TestRail edits.

## Persistence note
Secrets are **ephemeral** (`/tmp`, re-supply per environment). Everything else
here is **durable memory** — update it when facts genuinely change (a spec change
gets implemented, ids change, scope changes).
