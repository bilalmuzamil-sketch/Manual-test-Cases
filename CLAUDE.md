# ShopView Manual Test Cases — Project Memory

> **Before any staging or TestRail testing, read `build/TESTING-RUNBOOK.md`.**
> That runbook holds the full, proven method; this file is a concise index +
> durable memory. **No secrets in this repo — ever** (secrets live in `/tmp`).
> - App action recipes (how to do each thing in ShopView): build/APP-ACTIONS-PLAYBOOK.md
> - Reusable build-accurate wording + VIU + TestRail-sync method (Standing Rule 9):
>   build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
> - Reusable spec-relevance/obsolescence reconciliation method (keep the WHOLE case
>   suite + all deliverables honest to a NEW/UPDATED spec, not just named deltas;
>   complements the VIU wording process — Standing Rules 9/10/11):
>   build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
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

1. **Custom Roles project** — Custom Roles & Permissions (ShopView), Epic
   **SV-7388**, STAGING. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL WORDING+VIU RESUME DOC (read first to resume the
   wording/VIU effort):** `build/custom-roles-run/WORDING-VIU-STATE-2026-07-13.md` —
   the single authoritative snapshot of the 2026-07-13 build-accurate wording + VIU
   pass (final tally, 38–39 manual/2nd-user residue, 11 dev deviations, deliverables
   index, env/access, how-to-resume). **STATUS: DONE 2026-07-13 — full build-accurate
   WORDING pass pushed to TestRail (252 update_case on the core suite, all 200/200) +
   boot2 behavioral VIU across 8 rounds (RUN331 headless blocker overcome) +
   section-3658 stub tree FULLY RESOLVED (3 dup deleted early + 2 moved into 3527
   [C27731→3549, C27736→3545] + 5 stubs deleted [C27729/30/32/34/38, QA-lead
   authorized]; section 3658 subtree 3658–3665 now EMPTY = candidate for section
   removal, not deleted).** Final tally (254 cases): **VIU-Verified 204 / Blocked-UI
   39 / Deviation 11.** Local case source now exists (first time for Custom Roles):
   `build/custom-roles-run/cases-2026-07-13/*.json` (254 bodies, carry
   `viu_status`/`section_id`; NO testrail-id-map.csv — filename = C<id>). Env note:
   staging org is SHARED and **Tech is currently DRIFTED on Technician — reset to Time
   Clock User `a0359055-3dfb-4e9c-9e11-2fbea21585c2` before any negative retest**
   (old `77b069d1-...` is wrong). **CANONICAL RUN-331 RESUME DOC (for the earlier
   run-331 re-test):** `build/custom-roles-run/RUN331-STATE.md` (final tally
   96P/4F/10B/50R/0U). Existing memory: this CLAUDE.md's detail sections,
   `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
   `build/custom-roles-run/*` (WORDING-VIU-STATE / Blockers Tracker / WordingVIU
   workbook / section-3658-resolution / testrail-wording-viu-log),
   `build/custom-roles-spec-update/*`, TestRail section **3527** / runs **312** & **331**.
2. **Fees and Discount project** — Fees & Discounts V1 (ShopView). **Canonical
   spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/622297094/Fees+Discounts+V1
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL
   STATE DOC (read first for resume):** `build/fees-discounts/PROJECT-STATE.md` —
   the single authoritative snapshot (case inventory 182 + VIU breakdown, TestRail
   state, deliverables index, FDBUG register, open threads, env/access facts,
   how-to-resume). Per-case status tallied by
   `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx` (regenerate with
   `python3 build/fees-discounts/gen_blockers.py`). Memory:
   `build/fees-discounts/*` (`requirements.md` = COMPLETE spec Stories 1–14 + §5
   calc contract; `design-notes.md`; `viu-recon.md` = qb env map/access/harness;
   **TWO same-day VIU passes 2026-07-08:** pass A = `viu-findings.md` +
   `bugs-log.md` + `viu-evidence/` (API-heavy, Admin+Tech); pass B =
   `viu-qb-findings.md` + `screenshots/viu-qb/` (UI-deep) — pass B's doc holds
   the merged scoreboard + reconciliation + FDBUG register + API map).
   **STATUS: ⏸️ PAUSED 2026-07-13 — WAITING ON Chris Ward's answers to the
   Round-2 PO sheet** (`PO-Questions-Round2.xlsx`, 4 questions, STILL BLANK; user
   will share the filled file). **Resume = PROJECT-STATE.md §0** (pre-decided
   per-answer action map incl. which held Jira drafts release/drop and which
   TestRail cases get expected-result updates — TestRail edits need fresh one-day
   authorization then). FEATURE LIVE on `qb.qa.shopview.com` / API
   `sv7387api.qa.shopview.com` (flag ON). **DONE 2026-07-13: V1_2 spec applied (43
   case updates + new FD-WO-016=C29441) AND a FRESH FULL build-accurate WORDING +
   VIU PASS over ALL 183 cases** with live-captured build labels — **ALL 183
   pushed to TestRail via update_case, 200/200, 0 errors.** **Tally: 130
   VIU-Verified / 20 Deviation / 12 Blocked-NotBuilt / 20 Blocked-Env / 1 Pending
   = 183.** Headlines: FDBUG-1 not reproduced (treat fixed; FD-DOC-011 Verified);
   §5-R15 tax-jurisdiction note NOT implemented (FD-WO-016 Deviation); 6 cases
   held on Chris's Round-2 answers; 14 QB line-item cases need a human in
   QuickBooks; 6 flag-off cases need a tester-free window; env bugs for dev: WO
   line-create 500, QB duplicate-doc-number export failure, bookkeeping unmap PUT
   500; **Technician role DRIFTED on qb (now has WO/Lines Create&Edit + Delete →
   WO permission negatives not testable) — reset Tech + re-derive roles-matrix
   before any permission retest**. **qb env is SHARED** (never assume env state)
   and **tech quick-login is FLAKY** — retest each run. **PROJECT-STATE.md =
   canonical resume doc** (full detail: FDBUG register, open threads, env/access,
   how-to-resume).
   *TestRail import (INTERIM):* `testrail-import/fees-discounts-v1-testrail-import.csv`
   (+ `.xlsx`), all 183 cases via `build/fees-discounts/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule**; INTERIM pending post-VIU + dev-answer
   finalization (see `build/fees-discounts/RESUME-STRATEGY.md`). Permissions: DEFINED
   / reuse-only — see `build/PERMISSIONS-ASSESSMENT.md`.
   **PO for Fees & Discounts = Chris Ward; PO for Simple Flow = Milos — never mix
   attributions.**
3. **Simple flow project** — Simple Mode / Streamlined Work Order Completion &
   Receiving (ShopView), Epic **SV-7301**. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/646021121/Simple+Mode+Streamlined+Work+Order+Completion+Bulk+Receiving
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL STATE DOC (read first for
   resume):** `build/simple-flow/PROJECT-STATE.md` — the single authoritative
   snapshot (case inventory 163 + VIU breakdown, TestRail state, deliverables
   index, open threads, env/access facts, how-to-resume). Memory:
   `build/simple-flow/*`
   (`requirements.md` = COMPLETE spec, 17 stories SV-7696..SV-7710 + SV-7870 +
   SV-7876 + §9/§10 SV-8183 permissions; `design-notes.md`; `viu-findings.md`;
   `cases/*.json` = 163 authored cases with `SF-` IDs; `SimpleFlow_V1_TestCases.xlsx/.csv`;
   `build_workbook.py` + `gen_cases.py`). All 163 cases in TestRail EXCEPT SF-QB-09
   (no C-ID, Open-Question); no execution run exists.
   **STATUS: FRESH FULL VIU-PROCESS DONE 2026-07-13** (build-accurate wording + VIU
   per rule 10 over ALL 163 cases; ~171 `update_case` pushes ALL verified 200/200, 0
   errors). Prior 2026-07-13 work: `_2` spec doc + `Design_3.zip` = byte-identical
   re-deliveries (no new work); V2.4 Δ1-Δ4 APPLIED (9 cases + new SF-VEND-06=C29442)
   + pushed (10 writes, 200/200); roles matrix re-derived — **Technician NOT drifted
   on sv7301**. **Tally: VIU-Verified 116 / VIU-Pending 35 / Blocked-Env 10 /
   Deviation 1 (SF-SET-03) / Open-Question 1 (SF-QB-09) = 163;** blockers READY 112 /
   VIU-PENDING(QA) 38 / MILOS 13 / BUG-RULING 0 / DEV-NOT-BUILT 0. Stories 7/8/9/14
   CONFIRMED BUILT. **reviewer≠completer DESCOPED** (Milos ruling — self-review
   allowed when the role holds the Mark Reviewed permission; BUG-5 dropped).
   Headline findings: SF-SET-03 Deviation (no Create Purchase Orders toggle, lags
   V2.4 → blocks No-PO path SF-COMP-06/SF-QB-02); completion modal has NO VIN even
   review-off (corrected SF-COMP-16/SF-VAL-02/SF-REV-03/SF-UX-02); OBS-6 Part-History
   500 re-confirmed; SF-PERM-06 app-blocks/backend-allows gap. **WAITING ON:** Milos
   Round-3 answers (13 MILOS cases; 3 deliverables ready to send:
   PO-Questions-Round3.xlsx, SimpleFlow_Bugs-for-Milos-Confirm.xlsx,
   SimpleFlow_Bug-Drafts.xlsx). 38 VIU-PENDING(QA) genuinely blocked on non-seedable
   data (vendor-missing PO, Needs-Approval line, cores, invoiced/paid WO, VIN-less
   asset, OBS-6, QuickBooks-needs-a-human, brand-new-org defaults). 4 active bug
   drafts (TICKET 2-5) unfiled (no Atlassian in this env); OBS-6 for dev. SF-QB-09
   unmapped in testrail-id-map.csv (Open-Question, not in TestRail) — follow-up.
   **qb/sv7301 env is SHARED — re-read settings before runs, restore byte-identical
   after** (node-fetch-ignores-proxy gotcha → use undici ProxyAgent). All detail
   (deltas, blockers, env, how-to-resume) in PROJECT-STATE.md = canonical resume doc.
   *TestRail import (INTERIM):* `testrail-import/simple-flow-v1-testrail-import.csv`
   (+ `.xlsx`), all 163 cases via `build/simple-flow/gen_import.py`; **VIU-word-free
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
6. **Everything except TestRail is a disposable TEST account — act freely.** All
   environments and third-party/integration accounts provided (staging, QA, qb,
   QuickBooks, and any other integration/environment) are disposable TEST accounts —
   nothing there is off-limits or irreversible-in-a-bad-way. Fully exercise them:
   create WOs/adjustments, invoice, push/sync to QuickBooks and verify real QB line
   items/GL/tax/totals end-to-end, unmap/remap settings, etc. Do NOT skip a
   verification just because it writes to a third-party integration. (Still tag
   throwaway data ZZAUTOTEST for tidiness and clean up in-app where easy, and restore
   settings/roles/location you change.) **The ONLY real/production system is
   TestRail — NEVER write to TestRail (create/update/delete cases, runs, or results)
   without explicit user permission.**
7. **PO & Dev questions (all projects):** When preparing open questions for a
   Product Owner OR for Developers, write them in the SIMPLEST, non-technical
   layman form. Each question = plain "What happens now" + "the question" +
   simple A/B options + a blank answer. NO case IDs, API/HTTP terms, bug codes,
   enum names, or jargon in the reader-facing content. Include ONLY genuine PRODUCT
   DECISIONS for the PO — never put bugs/defects in front of the PO (bugs go to dev
   tickets). Keep any internal question→case-ID mapping on a separate QA-only
   section/sheet, out of the reader-facing view. Whenever we surface questions to a
   Product Owner OR to Developers, the reader-facing wording MUST be in very simple,
   layman, non-technical language — assume the reader is not technical at all. This
   applies to every question deliverable going forward, for every project.
8. **TestRail IDs in deliverables (all projects):** EVERY deliverable that lists
   test cases (Excel workbooks, results/blockers trackers, CSVs, per-status files)
   MUST include the TestRail Case ID (C#####) — and a clickable TestRail link where
   practical (https://shopview.testrail.io/index.php?/cases/view/<id>) — so the user
   can locate each case in TestRail. Show it alongside any internal (SF-/FD-/etc.)
   ID. Source it from the per-project testrail-id-map.csv. Bake this into every
   workbook generator going forward.
9. **Build-accurate, layman-friendly wording (all projects):** Every test case's
   Title, Preconditions, Steps, and Expected Results MUST use the EXACT words,
   button/label/feature/function/screen names as they actually appear in the
   build/UI — taken DIRECTLY from the build, never invented, paraphrased, or
   guessed. Wording must be understandable by a NEW, NON-TECHNICAL manual tester
   (plain layman language; if a UI term is unavoidable, use the term exactly as the
   build shows it). During any VIU pass, capture the real on-screen labels from the
   build and correct the case wording (title/preconds/steps/expected) to match them.
   If a term cannot be confirmed from the build, flag it rather than invent it. This
   applies to every project (Fees & Discounts, Simple Flow, Custom Roles, and any
   future project) and to every TestRail import/update going forward. **The repeatable
   method for this (capture labels → rewrite → VIU → push → deliverables) is
   `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`; apply it to a given project WHEN THE
   USER ASKS.**
10. **"VIU" = the full BUILD-ACCURATE-WORDING-VIU-PROCESS (all projects, default
    meaning):** When the user says **"VIU the test cases"** (or "do the VIU"), it
    means **run `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` END-TO-END** (this is
    the rule-9 method): capture the EXACT on-screen labels LIVE from the build →
    rewrite every case Title/Preconditions/Steps/Expected into build-accurate,
    layman, non-technical wording (never invented; flag anything unconfirmable) →
    VIU-verify behavior → checkpoint-commit → push to TestRail via `update_case`
    with a per-case audit log (subject to that project's TestRail authorization) →
    regenerate deliverables (Blockers Tracker + Results workbook + import, with
    TestRail Case ID + Link columns) → report each area tester-ready and **ALWAYS
    state the TestRail update status explicitly.** This is the default meaning of
    "VIU" for EVERY project going forward.
11. **ALWAYS ASK which process to run on a new/updated spec OR a VIU request (all
    projects):** Whenever the user provides a spec (new or updated) OR asks to VIU,
    ALWAYS ASK the user first whether they want (1)
    `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (per-case build-accurate wording +
    behavior VIU) and/or (2)
    `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (whole-suite
    relevance/obsolescence audit + regenerate ALL deliverables) run — **do not
    assume; confirm which one(s) before proceeding.** Ties directly to Standing
    Rules 9 and 10 (they define the two methods; this rule governs when to invoke
    each). The two are complementary: rule-9/10 wording+VIU handles each case's
    words/behavior; the reconciliation process handles which cases should exist and
    keeps every downstream deliverable honest to the current spec.

## Project purpose (Custom Roles project)
Manual test-case authoring + live staging (Verify-in-UI) verification + TestRail
management for ShopView **"Custom Roles and Permissions"**, plus related
regression / bug-fix re-testing.

## Durable key facts (detail → runbook)
- **Staging topology:** `app.staging.shopview.com` = SPA frontend;
  `api.staging.shopview.com` = Symfony JSON backend.
- **Auth:** DEV `POST /api/quick-login {key:'admin'|'tech'}` (gated by valid
  session cookies). Prefer quick-login SSO over raw-cookie API (raw can 409).
- **Session cookie lifetime:** staging cookies last **~24 HOURS** — they expire
  only after ~24h OR when a new deployment happens; they do **NOT** expire after
  ~1h (plan long VIU runs in one window). A 401 `sso_required` / 409 before 24h ⇒
  suspect a deployment (or a stale set) and re-request cookies.
- **UI automation:** Chromium can't TLS through the egress proxy directly — build
  a FRESH MITM bridge per run (port rotates; read `$HTTPS_PROXY` live). Use the
  `boot2` hydration pattern (seed cookies + localStorage `user` /
  `fe_permissions_wrapper` / `token`, THEN navigate); the DEV login BUTTONS don't
  reliably work.
- **IDs (non-secret):**
  - Tech `/change` **staff_id `6fb22c1b-...`** (the staff-list id `a7fd0a88-...`
    **404s on `/change`** — never use it there).
  - workplace `b3c8c820-...`; **Time Clock (User) restore role id (STAGING) =
    `a0359055-3dfb-4e9c-9e11-2fbea21585c2`** (restore target). NOTE: the old
    `77b069d1-...` does **NOT** exist on staging — do not use it.
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
