# ShopView Manual Test Cases — Project Memory

> **Before any staging or TestRail testing, read `build/TESTING-RUNBOOK.md`.**
> That runbook holds the full, proven method; this file is a concise index +
> durable memory. **No secrets in this repo — ever** (secrets live in `/tmp`).
> - **PRE-FLIGHT — THE FIRST ACTION OF ANY PROJECT TASK (Standing Rules 31 + 32): ESTABLISH THE
>   CURRENCY OF **ALL SOURCES** — not just the spec — BEFORE doing ANYTHING on a project (test cases,
>   question sheets, reports, audits, TestRail pushes, reconciliations, bug work, or even answering a
>   question about the project's state) (Rule 31, scope broadened 2026-07-31): (1) the **spec** (live Confluence version +
>   last-updated vs our baseline), (2) the **epic + its child stories** (story set, statuses,
>   description/comment changes), (3) the **designs** (Figma file/nodes; an OPEN Rule-35 fetch queue
>   means the design source is NOT current — say so), (4) the **engineering tech plan** (Rule 30),
>   (5) the **PO/stakeholder answers, messages and videos** (newest authoritative source wins).
>   **Every deliverable carries a SOURCE-CURRENCY block** — per source: identifier, version /
>   last-updated, date checked, and CURRENT / STALE / PARTIAL (a PARTIAL source names the exact
>   shortfall); nothing may claim completeness while a source is STALE. **Staleness markers lie:**
>   a Confluence page's in-body "Version" can sit at 1.0 while the real version advances (how the
>   Schedule spec drifted 5 versions) and a Jira epic's "updated" date moves for admin-only edits
>   like a QA-Assignee change — use the **Confluence version number** and the **Jira changelog**.
>   If a source can't be fetched, STOP and ask for access; never work off a possibly-stale copy.
>   And when sources disagree
>   (spec vs Figma vs prototype/Claude design vs video vs PO message vs tech plan) the MOST
>   RECENT authoritative product source WINS, with source + date recorded on the case (Rule 32).**
>   **Review findings are INPUTS, not overrides (Rule 33) — precedence: PO ruling → QA lead's
>   ruling → our own live-verified findings → a reviewer's/other QA's claims; judge the claim,
>   not the claimant, and never let a review silently reverse a recorded ruling.**
>   **WHEN ANOTHER AUTHOR'S CASE CONTRADICTS OURS (Rule 39): RETAIN our sourced position (spec /
>   tech plan / Loom video / PO answer), NEVER edit their case, and ESCALATE to the QA lead with
>   BOTH bases on the table — our document+version+anchor+date AND what source THEY worked from
>   (establish it; ASK them if it can't be determined). Check our OWN newer sources FIRST — the
>   conflict is often our older case vs a newer ruling we already ingested.**
>   **AFTER EVERY authorized `add_case` push, RUN-SYNC the project's test run (Rule 34) — a
>   fixed-selection run (`include_all: false`) never auto-picks up new cases; UNION the run's
>   current case_ids with the new ones (a partial `update_run` DELETES tests + results), snapshot
>   first, and get the user's authorization since the runs belong to other testers. Checker:
>   `build/testrail-run-sync-2026-07-31/run_sync_audit.py`.**
>   **AT EVERY SESSION START (and before/after any project or design work): CHECK FOR OPEN
>   DESIGN-FETCH QUEUES (Rule 35) — `ls build/*/design-*/PENDING-FIGMA-FETCH.md`; if a queue is
>   OPEN and now >= its DUE-AT, run its fetch command IMMEDIATELY without asking (no
>   authorization needed), and on another rate limit append the attempt + re-arm DUE-AT = new
>   error time + 9 h. **NO QUEUE IS OPEN as of 2026-08-04** — the Filters queue
>   `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` is **CLOSED at 85/85**
>   (2026-07-31T08:58:40Z, cleared over REST `/v1/images` with the QA lead's token). The
>   earlier "OPEN NOW 73/85, DUE-AT `2026-07-30T23:27:02Z`" pointer that stood here was
>   **STALE** — corrected 2026-08-04. Still run the glob at every session start.**
> - **AT EVERY SESSION START (and before/after any project work): CHECK FOR OPEN NON-FINAL-BUILD
>   RE-CHECK QUEUES (Rule 49) — `ls build/*/viu-*/RECHECK-QUEUE.md`; a build declared NOT FINAL
>   yields PROVISIONAL findings only, so every finding is queued with its BUILD MARKER and no suite
>   may be called VIU-complete while a queue is OPEN. Re-run the queue when the build is declared
>   final or the app-version marker changes. **THREE QUEUES ARE OPEN NOW (2026-08-04):**
>   `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` (Report Suite QA branch `sv8582`, build
>   `v3.4.1-0ed4433`) · `build/filters/viu-2026-08-04/RECHECK-QUEUE.md` (Filters QA branch `sv8785`,
>   build `v3.4.2-4f8211c`) · `build/schedule/viu-2026-08-04/RECHECK-QUEUE.md` (Schedule QA branch
>   `sv8685`, build `v3.5-4873abe`, 165 rows). **None of the three branches has been declared final,
>   so every finding on all three is PROVISIONAL.**
> - **OUTSTANDING-ITEMS REGISTER (Standing Rule 36) — the single cross-project list of everything we
>   are WAITING ON: build/OUTSTANDING-ITEMS-REGISTER.md. READ IT before writing any status report or
>   management deliverable, and UPDATE IT the moment an item is raised or cleared. EVERY project
>   report MUST END with an "OUTSTANDING — what I need from you" section (say "nothing outstanding"
>   if that is true — never omit it). Sweep all six categories: missing sources · unanswered PO/dev
>   questions · missing go-aheads/authorizations · access/credentials · deferred or HELD decisions ·
>   what another team owes. Unresolved inputs are the main threat to 100% authentic tests.**
> - **THE OUTSIDE-IN GAP HUNT (Standing Rules 45 + 46) — a suite may NOT be called current until it
>   has been looked at from OUTSIDE our own work. Rules 40–44 force follow-through on what WE found;
>   45/46 exist because we had no way to notice an OUTSIDER could see what we could not. **45** run the
>   foreign-coverage diff in BOTH directions (overlap AND the reverse — their assertions with no
>   counterpart in ours = a COVERAGE SIGNAL, not a nuisance: read-only checker
>   `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`), apply the automation-engineer lens
>   ("what would I assert from the running build?" — limited to the document while we have no QA
>   branch, and say so), the hostile-reviewer lens, treat EVERY external signal as a coverage input
>   rather than a reply, and **(e) never accept a "covered" verdict without BOTH TEXTS QUOTED SIDE BY
>   SIDE — a requirement making two assertions gets one row PER ASSERTION** · **46** every suite ships
>   its DELIBERATE-DECISIONS / anticipated-challenge register (decision · plain one-sentence answer ·
>   evidence · affected cases with C-ids · who closes it · honest risk), because an undocumented
>   deliberate omission is indistinguishable from a miss. Root-cause analysis:
>   `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`.**
> - **THE 2026-07-31 LESSONS (Standing Rules 40–44) — read `build/LESSONS-2026-07-31.md` before any
>   spec-delta, authoring, or case-edit pass. In one line each: **40** trace a requirement across
>   EVERY surface (screen · PDF · CSV · print · API · mobile) and ship the SURFACE MATRIX, not a case
>   list · **41** touch a case → re-verify the WHOLE case against the current spec and log
>   "re-verified whole against <spec+version>" · **42** no closed "exactly these …" enumerations
>   without a version-pinned anchor — write them scope-conditionally · **43** every spec-diff
>   requirement gets its OWN coverage-verdict row (narrative summaries are not acceptable; matrices
>   are RE-DERIVED, never patched) · **44** someone else's contradicting case is a bug report
>   against OUR suite until we re-derive our own position — a missing `refs` is never a reason to
>   dismiss it.**
> - **PROCESS CATALOG (the table of every reusable process + how to call it for any project):
>   build/PROCESS-CATALOG.md — READ THIS to pick/name a process; it lists all of them with
>   trigger phrases and the deliverable each produces. Keep it updated when a process is
>   added/changed (shared brain for both sessions).**
> - **READ-FIRST STAGING ACTION RECIPES (how to do each thing in ShopView — reuse, never
>   re-discover): build/APP-ACTIONS-PLAYBOOK.md — the indexed "STAGING ACTION RECIPES"
>   section at the top is the canonical quick-reference for every staging/QA action (auth,
>   create WO, add part, adjustments, switch role, change location, endpoints, UI flows,
>   TestRail). READ IT + "Durable key facts" below BEFORE any staging action; append any NEW
>   proven recipe immediately (Standing Rule 27).**
> - Reusable build-accurate wording + VIU + TestRail-sync method (Standing Rule 9):
>   build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
> - Reusable spec-relevance/obsolescence reconciliation method (keep the WHOLE case
>   suite + all deliverables honest to a NEW/UPDATED spec, not just named deltas;
>   complements the VIU wording process — Standing Rules 9/10/11):
>   build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md — **apply to any project WHEN THE USER ASKS.**
> - Reusable **spec-recheck** method (re-check a feature's TestRail cases against the CURRENT
>   spec + all Done Jira tickets [newest-wins], live-verify on the build, deliver a SIMPLE
>   change-list of only the cases needing a change/decision with the driving ticket + Done-status,
>   then edit only user-approved cases in TestRail): build/SPEC-RECHECK-PROCESS.md — **apply to any
>   project WHEN THE USER ASKS.** Proven on Custom Roles SV-7388 2026-07-20 ("Vlad's spec-recheck";
>   deliverable build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx).
> - Reusable **spec-recheck change-list workbook** method (the SIMPLE sign-off FILE half of the
>   spec-recheck: only the cases needing a change/decision, each with driving ticket + Done-status
>   + Action, 2nd tab for cases blocked on a not-done ticket, fine cases omitted; nothing pushed
>   until approved; captures the full originating instructions + corrections per Rule 18):
>   build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md — **apply to any project WHEN THE USER ASKS.** This is
>   the process behind build/custom-roles-run/CustomRoles_SpecRecheck_ChangeList_2026-07-20.xlsx
>   (generator gen_simple_changelist.py).
> - Reusable **missing-traceability** method (find every test case lacking a Jira ticket ref
>   and/or a spec anchor, then backfill the metadata layer — TestRail `refs` field + spec
>   citation — so 100% of cases are provably authentic; enforces Standing Rule 20):
>   build/MISSING-TRACEABILITY-PROCESS.md — **apply to any project WHEN THE USER ASKS, and as a
>   sub-step of any spec-recheck/VIU pass.**
> - Reusable **Custom-Roles / Permission-VIU** method (run a COMPLETE Custom Roles & Permissions
>   test for a feature/epic — LIVE, against the CURRENT spec + all Done tickets [newest-wins] — in
>   4 layers [composition / backend 403-200 / front-end route guards / element controls],
>   reset-to-template first [persistent re-reset on drift], every verdict observed live with
>   evidence, then deliver a plain-English 7-tab management report [.md + .xlsx]; composes the
>   wording-VIU + prod-vs-staging + Atlassian methods; Standing Rules 6/7/8/9/10/11/12/13/14/15/20/
>   22/23/26): build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md — **apply to any project WHEN THE USER
>   ASKS.** Proven on Simple Flow SV-8183 2026-07-23 (deliverable
>   build/simple-flow/sv8183/SimpleFlow_SV-8183_Permission-Test-Report_2026-07-23.md/.xlsx).
> - Reusable Atlassian/Jira/Confluence LIVE-LOGIN + ingest access method (shared infra):
>   build/ATLASSIAN-JIRA-ACCESS-METHOD.md — **live browser login (headless Chromium via a
>   fresh MITM bridge → id.atlassian.com email+password → 6-digit EMAIL OTP) is now the
>   PRIMARY way to read shopview.atlassian.net tickets/pages; export/paste is the FALLBACK.**
>   This SUPERSEDES the old "Jira/Confluence is SSO-walled → export/paste only" stance used
>   in the per-project pointers above. **MFA RACE (crux):** each password submit emails a NEW
>   code and invalidates prior ones → hold ONE detached session at the OTP prompt polling
>   /tmp/…/otp.txt; NEVER start a fresh run to retry. ShopView/Cloudflare cookies do NOT
>   authenticate atlassian.net (Basic auth → 401/404). Creds + cookies + OTP codes in /tmp
>   only, never committed. The user supplies the OTP codes on request.
> - Reusable **Ruthless Usefulness Audit** method — the THREE-DIMENSION quality gate: score 100%
>   of a suite (1) USEFUL: KEEP/MERGE/WEAK-KEEP/CUT (hunt the named slop patterns, credit
>   load-bearing coverage), (2) MAKES SENSE: SENSIBLE/FIX-WORDING/NONSENSE (the 6 cold-read fail
>   conditions), (3) GENUINE + LAYMAN-RUNNABLE (Rule 20 traceability + Rules 7/9 plain wording);
>   honest "is the critic right?" answer on BOTH halves (waste % + makes-no-sense %); MANDATORY
>   final gate of every authoring pass per Standing Rule 28:
>   build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md — canonical example
>   build/report-suite/quality-audit-2026-07-28/.
> - **QA QUALITY PIPELINE EXPLAINER (the presentable "how do we ensure the test cases are
>   good?" doc the QA lead presents): build/QA-QUALITY-PIPELINE-EXPLAINER.md — the 12-step
>   quality pipeline in plain language (source ingestion → traceability → build-accurate
>   wording → coverage matrix → adversarial review → Ruthless Usefulness Audit → spec-change
>   reconciliation → VIU → the tester Blocked-revisit loop → the OUTSIDE-IN CHECK against other
>   people's cases in both directions → the DELIBERATE-DECISIONS register → the outstanding-items
>   close), each step cross-referenced to its internal process doc.**
> - Keep the books current: After each task, append ONLY success-proven learnings
>   (working navigation paths, action recipes, endpoints, the specific unblock that
>   worked) to build/APP-ACTIONS-PLAYBOOK.md; update build/TESTING-RUNBOOK.md when the
>   method changes; update CLAUDE.md when a durable fact changes. Do NOT record failed
>   approaches or dead-ends; a gotcha is recorded only as the working fix. Promote
>   (verify) items to confirmed only after actually succeeding. Reuse the books for
>   anything done before; research only genuinely new things.

## Projects in this workspace (three projects now, MANY more incoming)
This workspace/chat serves **THREE separate projects today** (Custom Roles, Fees &
Discounts, Simple Flow) but **will SCALE TO MANY** — the QA lead has flagged that
**~10+ more new projects are coming**. Keep each project's memory **SEPARATE** (don't
mix facts/scope/cases), but **reuse shared infrastructure across all of them** (the
staging/QA access method, the harness scripts, the TestRail API patterns, and the two
process docs — `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` +
`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`).

**New-project onboarding convention (apply when each new spec arrives — do NOT invent
project details ahead of time):** for each new project create a
`build/<project-slug>/` folder with its own:
- `PROJECT-STATE.md` — the canonical cold-resume doc (single authoritative snapshot:
  case inventory + VIU breakdown, TestRail state, deliverables index, open threads,
  env/access facts, ordered how-to-resume).
- `requirements.md` — the COMPLETE spec, built from the spec the user provides
  (Confluence pages are Atlassian-SSO login-walled → the user must export/paste the
  content; do NOT fetch the URL — keep the canonical Confluence URL as a reference
  pointer only).
- `cases/` — the authored test-case source (per-project `<PREFIX>-<AREA>-NN` IDs).
- `testrail-id-map.csv` — the internal-ID ↔ TestRail Case-ID map (Standing Rule 8).
- Record the project's **canonical spec URL + PO name** (never mix PO attributions
  across projects).
- The **ENGINEERING TECH PLAN is part of the required input set** (alongside
  spec/designs/epic) — if the user has not provided it by project start (or when
  authoring/VIU begins), **REMIND the user to supply it** (Standing Rule 30).
Then add a **per-project CLAUDE.md entry** with a concise STATUS line that points at
that project's `PROJECT-STATE.md` as the canonical resume doc. Per **Standing Rule
11**, whenever a new/updated spec arrives OR a VIU is requested, ALWAYS ASK which
process(es) to run before proceeding.

**PROJECT STATUS SNAPSHOT (2026-07-27, user ruling):** the **3 ACTIVE projects** are
**Report Suite, Schedule, Filters** — all three VIU-pending their QA branches. **Global
Search = POSTPONED**; **Simple Flow + Fees & Discounts = COMPLETED** (detail/resume docs
retained). The exact "what we need from the user/PO before VIU" list per active project is
in **build/PROJECTS-NEEDS-2026-07-27.md**.

**PERMISSION TESTING ROUTES THROUGH THIS SESSION (all projects):** each NEW project
ships its own Custom-Roles permission ticket (defining what each permission does for that
feature); that permission testing routes through this session — apply the Custom-Roles /
Permission-VIU process (build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md, proven on Simple
Flow SV-8183 2026-07-23) to test it LIVE against the current spec + Done tickets and
deliver the 7-tab management report.

1. **Custom Roles project** — Custom Roles & Permissions (ShopView), Epic
   **SV-7388**, STAGING. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **RECURRING: run the complete Custom Roles & Permissions test
   against the CURRENT spec + ALL Done tickets in epic SV-7388 on a cadence AND
   AFTER EVERY FEATURE RELEASE (not just on a cadence) — the Custom Roles feature is
   VOLATILE and regresses when OTHER features ship (Fees & Discounts, Vendor mgmt, etc.);
   run build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md after each release to catch regressions
   before they reach customers. (User ruling 2026-07-27, prompted by the SV-8682/8541/8701
   post-release breakage — ingest + coverage in
   build/custom-roles-run/release-regression-2026-07-27/.)** — use
   build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md (4-layer live method + 7-tab management
   report; proven on Simple Flow SV-8183 2026-07-23). **POST-v0.68/v0.69 REGRESSION DONE +
   ADVERSARIALLY VERIFIED CLEAN 2026-07-27 (canonical resume:
   `build/custom-roles-run/release-regression-2026-07-27/RELEASE-REGRESSION-STATE-2026-07-27.md`):**
   3 tickets triaged — **SV-8682 NOT REPRODUCED** (Vendors loads with Reports OFF, no dependency),
   **SV-8701 FIXED-VERIFIED** (customer default-adjustments 200 entitled / 403 unentitled, FE guards
   the tab, no whole-page lockout), **SV-8541 SPEC-INTENDED / pending PM** (core-resolve + part-return
   gated by WO→View, 400 not 403). 3 guard cases pushed to TestRail (user-authorized, titles shortened,
   run 312 untouched): **CR-REG-01=C38843** (sec 3538), **CR-REG-02=C38844** (sec 3537),
   **CR-REG-03=C38845** (sec 3535), all HTTP 200 + re-GET MATCH. **Full 11-role live sweep = 110
   role×page cells** (independently re-derived matrix = exact match, 0 mismatches) — **NO new broken
   permissions** (no lockout, no broken dependency, no FE-exposure; only benign 404 = a doubled-path
   SSO housekeeping call, page loaded). All 11 roles left AT template. Honest limits: page-reachability
   + per-page BE (not every in-page action), Vendor Invoices dropped, genuine tech-login drive method
   (switch-user was concurrent-locked). **After-each-release regression rule ACTIVE.** **CANONICAL WORDING+VIU RESUME DOC (read first to resume the
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
   39 / Deviation 11.** **PROD-VS-STAGING PERMISSION COMPARE DONE 2026-07-14 (final
   commit 30b35bd)** — release-eve bi-directional capability diff of all 14 live prod
   legacy roles (org 72b2cc90…, no Owner) vs all 11 staging roles + independent
   verification + staging FE-gate verify; counts (out-of-model excl.): STAGING-LESS
   No=51/Yes=5, STAGING-MORE No=37/Yes=24 (WO-granular 22/18; out-of-model 10);
   headline risks = Send-to-Portal prod-only loss (6 roles), Parts-Mgr WO+WOL C&E
   over-grant, Tech Order-Parts/WOL-Delete + Parts-Tech invoice-reverse/AP-AR + SA
   WO-Delete regressions; Send-to-Terminal has NO control in the staging build at all.
   **CANONICAL RESUME DOC: `build/custom-roles-run/PROD-VS-STAGING-STATE-2026-07-14.md`**
   (deliverables: `Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`,
   `compare-VERIFICATION-2026-07-14.md`, `prod-vs-staging-compare-PLAN-2026-07-14.md`,
   `gen_prod_vs_staging.py`, `compare-evidence-2026-07-14/`,
   `staging-ui-verify-2026-07-14/`). **REUSABLE METHOD DOC (new):**
   `build/PROD-VS-STAGING-COMPARE-METHOD.md` — how to run a 100%-LIVE-OBSERVED
   two-environment permission/function comparison with **ZERO cells "NOT VERIFIED"**
   (headless OR headful; seed data as needed since both prod & staging are disposable
   TEST accounts; create a FRESH staff per holderless role + CLEAN self-login to avoid
   the role-swap `/no-location` location-store bounce; classify live API error bodies
   as evidence, not crash-to-/no-location as a verdict). **Comparison/environment-diff workbooks: `build/COMPARISON-WORKBOOK-RECIPE.md`** — the reusable template + method for any "make a comparison file" request (file name starts with "Comparison"); parameters = the envs/population/capabilities/spec. Local case source now exists (first time for Custom Roles):
   `build/custom-roles-run/cases-2026-07-13/*.json` (254 bodies, carry
   `viu_status`/`section_id`; NO testrail-id-map.csv — filename = C<id>). Env note:
   staging org is SHARED and **Tech is currently DRIFTED on Technician — reset to Time
   Clock User `a0359055-3dfb-4e9c-9e11-2fbea21585c2` before any negative retest**
   (old `77b069d1-...` is wrong). **⚠️ TWO-SESSION BASELINE CONFLICT (shared staging org
   d55bc308, flagged 2026-07-22) — RESOLVED 2026-07-23:** the intended Tech default is
   **role "Technician" (50bf6a0d)** — the user reset `tech@shopview.com` (user a7fd0a88) via
   "Reset To Template" 2026-07-23 → canonical 6 perms (customersView, scheduleView,
   woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView). **Tech baseline
   = Technician, NOT Time Clock User** (this supersedes the earlier Custom-Roles "reset to Time
   Clock User" expectation on the SHARED d55bc308 org; Custom Roles' own separate note above is
   staging-org-context — on the shared d55bc308 org the confirmed default is Technician).
   **⚠️ LIVE-OBSERVED CAUTION (2026-07-23):** the Technician ROLE (50bf6a0d) is being actively
   RE-DRIFTED by a concurrent session (observed added `workOrdersCreateAndEdit` +
   `seeFinancialData`, up to 14 atoms). Sessions MUST re-read Tech's current role AND re-assert
   "Reset To Template" on Technician immediately before any role-negative test, and not assume a
   clean baseline — a concurrent actor may re-drift it mid-run (Standing Rule 26). **CANONICAL RUN-331 RESUME DOC (for the earlier
   run-331 re-test):** `build/custom-roles-run/RUN331-STATE.md` (final tally
   96P/4F/10B/50R/0U). Existing memory: this CLAUDE.md's detail sections,
   `build/TESTING-RUNBOOK.md`, `build/APP-ACTIONS-PLAYBOOK.md`,
   `build/custom-roles-run/*` (WORDING-VIU-STATE / Blockers Tracker / WordingVIU
   workbook / section-3658-resolution / testrail-wording-viu-log),
   `build/custom-roles-spec-update/*`, TestRail section **3527** / runs **312** & **331**.
   **SESSION RESUME 2026-07-16 (exec+QA deliverables): read build/custom-roles-run/SESSION-STATE-2026-07-16-EXEC-QA.md first** — exec file DELIVERED (audited CLEAN); QA pre-release checklist DELIVERED (audited CLEAN, aad5864). Task COMPLETE; open threads in the state doc.
2. **Fees and Discount project** — Fees & Discounts V1 (ShopView).
   **✅ STATUS: COMPLETED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record. **Canonical
   spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/622297094/Fees+Discounts+V1
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL
   STATE DOC (read first for resume):** `build/fees-discounts/PROJECT-STATE.md` —
   the single authoritative snapshot (case inventory 183 + VIU breakdown, TestRail
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
   **STATUS: 2026-07-14 — CHRIS WARD'S ROUND-2 ANSWERS (Q1=A/Q2=A/Q3=A/Q4=B)
   APPLIED + the 6 Round-2 cases PUSHED TO TESTRAIL (6/6, 200/200); FD-QB-014
   (C28557) VIU-Verified (commit-time over-discount warn/confirm "Discount exceeds
   subtotal" dialog confirmed BUILT at Create-Invoice + Mark-Reviewed/Complete).
   V1_3 applied 2026-07-17 (2 deltas: §5-R15 SFD-gate [FD-WO-016 gate qualifier +
   folded SFD-negative, FD-PROC-004], history→audit-log sweep [9 cases + 4
   notes-only]; 11 update_case pushed 11/11 200 + re-GET MATCH, audit-logged in
   spec-v3-2026-07-17/testrail-update-log.md, commit 90e786e; requirements.md §17 =
   V1_3 baseline; TICKET 3 reworded to audit-log; tally unchanged). DONE 2026-07-20
   (§0.0f/§0.0g): ALL 5 "History log*"→"Audit log*" section renames EXECUTED —
   thread CLOSED 5/5 (user-authorized; sections 3957–3960 4/4 + 5th section
   "History log — edit entry" 3961 → "Audit log — edit entry" [authorized
   2026-07-20], all update_section 200 + re-GET MATCH, audit-logged; mirrors +
   import/Tracker regenerated both passes) + the Chris V1_3
   question sheet PRODUCED + READY TO SEND
   (PO-Questions-Chris-V1_3_2026-07-17.xlsx/.md, Round-2 format 1:1, Rule-7
   layman).**
   **CHRIS V1_3 ANSWERS INGESTED 2026-07-20** (`chris-answers-v1_3-2026-07-20/answers-ingested.md`):
   **Q1=B** — the §5-R15 tax-jurisdiction note shows below EVERY Taxable control (WO +
   Part Sale Add/Edit + admin fee-template dialog, every kind; no separate
   Processing-Fee window); **Q2=A** — SFD gate observable only at the admin template
   dialog via a Manage-Finance-Settings-without-See-Financial-Data user. Resolves
   spec-diff §H a/b (latest-wins). Consequence: FD-WO-016 (C29441)/FD-PROC-004 (C28522)
   scope stands; TWO new surfaces (admin template dialog note S7-R12f + Part Sale dialog
   note) now need an authorized add/update pass + live VIU. INGESTION ONLY — tally
   unchanged.
   **STAGING LIVE VIU DONE 2026-07-20 (§0.0i — F&D now deployed to
   `app.staging.shopview.com`, flags FeesAndDiscounts+PartSales+QuickBooks ON):**
   Chris Q1=B §5-R15 note VERIFIED LIVE in all surfaces (admin template dialog + WO
   Add/Edit + Part Sale Add/Edit); Q2=A SFD-gate negative CONFIRMED (Tech = Manage
   Finance Settings without See Financial Data → sees Taxable toggle, not the note).
   ALL 12 Blocked-NotBuilt FLIPPED to VIU-Verified (Processing-Fee builder + Part Sales
   "Fees & Discounts" column both shipped on staging) + FD-WO-016/FD-WO-005/FD-VAL-001
   Deviations FIXED. 2 NEW cases pushed (FD-TMPL-018=C29917, FD-PSALE-001=C29918) +
   FD-WO-016 (C29441) refined — TestRail 1 update_case + 2 add_case, all 200 + re-GET
   MATCH, NO run results. Evidence/log: `build/fees-discounts/viu-staging-2026-07-20/`.
   **DUP-PAIR RETIREMENT DONE 2026-07-20 (§0.0k):** user ruled keep FD-VAL-007 (C28605),
   retire FD-CUST-016 (C28500) — C28500 delete_case'd (HTTP 200; verify re-GET HTTP 400
   gone), C28605 intact; body kept locally marked Retired; id-map −1; generators exclude
   Retired; deliverables regenerated over 184. Dup-pair thread CLOSED. Audit:
   `build/fees-discounts/retire-2026-07-20/testrail-log.md`.
   **SV-8479/8480 AUTHORING CONSOLIDATED & COMMITTED 2026-07-22 (§0.0m — NO TestRail
   writes):** 18 net-new cases authored (SV-8479 ×11 + SV-8480 ×7, all VIU-Pending, in
   id-map with BLANK C-ids pending `add_case`; FD-CALC-024 = API) + 54 existing edited
   (pending `update_case`) + 9 SV-8479 dups dropped + 3 retire-candidates flagged awaiting
   user ruling (FD-LABOR-003/FD-PCOL-003/FD-PCOL-007) + SV-8456 no-delta. **NEW TALLY: 202
   ACTIVE authored** (184 prior + 18 net-new; +2 dev-authored = 204 in id-map/204-row map),
   of which **18 are NOT-YET-IN-TESTRAIL**. Deliverables regenerated over 202 (import 202
   rows, hygiene clean). Sources: `sv8479-8456-8480/deconfliction-decision-table-2026-07-22.md`.
   **SV-8479/8480/8456 LIVE STAGING VIU DONE + ADVERSARIALLY AUDITED CLEAN 2026-07-22 (§0.0n —
   supersedes §0.0m; NO TestRail writes):** 18 net-new + 54 edited verified LIVE on
   `app.staging.shopview.com` (4 batches; evidence `viu-sv8479-8480-2026-07-22/` +
   `viu-sv8456-2026-07-22/`). **FINAL TALLY: 202 active authored = 167 VIU-Verified / 13
   VIU-Deviation / 21 VIU-Blocked-Env / 1 VIU-Pending (FD-PART-005)** (+2 dev-authored
   FD-PERM-012/013 Verified; FD-CUST-016 retired; 204 in id-map). New Deviations = FD-WO-017 +
   FD-LABOR-003 (item-#1 ⋮ entry renders RIGHT of "Unassigned", spec wants LEFT — matches ticket
   Rejected-from-testing); FD-CALC-023 Blocked-Env (needs flag-off org). Sign convention resolved
   (line-level fee bare "20%" / discount "−10%" en-dash, plain grey no badge, both Lines-tab
   inline + Parts F&D column; whole-container CARD parenthesized "(10%)"/"(−5%)"; resolved $
   signed). SV-8480 S3-R18: WO line Total = Labor(gross)+Parts(gross)+line's own SIGNED
   fee/discount amounts (display-only; docs print fees/discounts as own rows, no double-count).
   Durable build facts consolidated in PROJECT-STATE.md "Durable build facts (VIU-confirmed
   2026-07-22)".
   **AUTHORIZED TESTRAIL SYNC EXECUTED 2026-07-22 (§0.0o — supersedes §0.0n):** user authorized
   the push + retiring the 3. Executed 5 add_section (4377–4381) + 18 add_case (C30618–C30635) +
   3 delete_case (FD-LABOR-003/C28441, FD-PCOL-003/C28471, FD-PCOL-007/C28475 — verified gone) +
   51 update_case (54-item list minus the 3 deleted), ALL HTTP 200 + re-GET MATCH; run 325
   untouched, only group 3894 touched, no secrets. **NEW TALLY: 199 ACTIVE authored = 165
   VIU-Verified / 12 VIU-Deviation / 21 VIU-Blocked-Env / 1 VIU-Pending (FD-PART-005)** (+2
   dev-authored = 201 in id-map). Deliverables regenerated over 199. Executor
   `exec_sync_2026-07-22.py`; audit `sv8479-8456-8480/testrail-execution-log-2026-07-22.md`;
   manifest header = EXECUTED. Canonical resume = PROJECT-STATE.md §0.0o.
   **ALL DEVIATIONS + THE PENDING CLOSED 2026-07-24 (§0.0q — supersedes §0.0p for the tally):**
   user-authorized, per Ahtasham's QA live review + our own live SV-8421 spot-check, all 8
   remaining VIU-Deviations + the 1 VIU-Pending closed to VIU-Verified = "no bug". **ZERO TestRail
   writes this pass:** Ahtasham reworded 3 directly in TestRail (C28460 FD-STATS-002 per-row
   name/percent/amount; C28489 FD-CUST-005 single→multi-select S9-R20; C28526 FD-PROC-008
   Remove-only) — pulled READ-ONLY + mirrored local; **FD-WO-017/C30618 was edited MANUALLY by the
   USER** in TestRail (kebab LEFT→RIGHT, Chris Ward accepted, SV-8479 DONE) — re-GET read-only,
   synced local; 5 pass-as-written flips LOCAL-only (FD-INLINE-003/C28456, FD-STATS-004/C28462,
   FD-CUST-006/C28490, FD-TMPL-010/C28511, FD-PART-005/C28450); FD-PROC-009/C28527 +
   FD-CALC-013/C28580 confirmed ALREADY Verified from our live spot-check (not re-flipped). HONESTY
   (Rule 12/22): only C28527/C28580 re-observed live by us; every other flip accepted on Ahtasham's
   review / the user's manual edit (noted per case). **NEW TALLY: 199 ACTIVE = 178 VIU-Verified / 0
   VIU-Deviation / 21 VIU-Blocked-Env / 0 VIU-Pending** (+2 dev-authored = 201 managed; id-map 203
   rows incl. 2 from a concurrent SV-8520/8521 session, untouched). Deliverables regenerated over
   199 (import header byte-identical, 0 VIU/flag words, no dup titles, no C-id column; id-map C-ids
   preserved). whats_needed.py: all 11 now-Verified fall through to "No action needed — passed"; 21
   Blocked-Env keep next-steps. Run 325 untouched. Audit
   `testrail-execution-log-deviation-closeout-2026-07-24.md`.
   **FE-BLOCK/BE-ALLOW PASS FLIP 2026-07-24 (§0.0p — superseded by §0.0q for the tally):** per
   Standing Rule 24 (FE blocks + BE/API allows = PASS), user-authorized, **FD-WO-013 (C28436) +
   FD-PERM-002 (C28586) flipped VIU-Deviation → VIU-Verified (PASS)** + a plain tester line added
   to each Expected ("only hidden on screen; if still doable via back-end/API that's expected —
   mark PASSED, don't raise a bug"). 2 update_case, both HTTP 200 + re-GET MATCH, refs intact, NO
   run writes / no add/delete/section. whats_needed.py: both now "No action needed — passed".
   **NEW TALLY: 199 ACTIVE authored = 167 VIU-Verified / 10 VIU-Deviation / 21 VIU-Blocked-Env /
   1 VIU-Pending (FD-PART-005)** (+2 dev-authored = 201 in id-map). Deliverables regenerated over
   199. Audit `testrail-execution-log-fe-be-pass-2026-07-24.md`.
   **Prior CURRENT TALLY (pre-8479/8480): 151 VIU-Verified / 12 VIU-Deviation / 20 Blocked-Env
   / 1 VIU-Pending (FD-PART-005) = 184 ACTIVE** (185 authored − 1 retired; +2 dev-authored
   reconciled = 186 in-suite; was 152/12/0/20/1 = 185 pre-retire; prior qb 135/15/12/20/1 = 183).
   **SV-8456 UI-CORRECTION STAGING LIVE VIU DONE 2026-07-21 (§0.0l):** frontend-only F&D
   UI corrections verified live — **FUNCTIONALITY INTACT** (template CRUD + apply-to-WO/
   Part-Sale + calc correct) and the **PERMISSION PIVOT CONFIRMED** (F&D settings now
   gated by **Settings → Service** [atom settingsService], was Finance: Service-user
   sees+manages+convenience toggle; Finance-only user has no F&D nav item, FINANCE shows
   only Payment Methods, /administration/adjustment-templates bounces to /workorders). All
   8 UI corrections match the ticket, 0 deviations (Taxable Yes/No dropdown; Auto-apply
   checkbox+caption; plain-text left-aligned tables; WO card "Work Order Fees & Discounts"
   above Financial Info; Part-sale card above Financial Info; customer tab; jur.note +
   convenience banner preserved). **34 cases reworded + pushed update_case 34/34, 200 +
   re-GET MATCH** (statuses unchanged). **C29922/C29923** (dev-authored automated, TestRail
   section 3963 Permissions Story 13) reconciled into id-map (FD-PERM-012/013) + mirrored
   locally (dev_authored, excluded from import/tracker) — no duplicates. Tech restored to
   Technician; 4 ZZAUTOTEST roles deleted; test data removed. Evidence:
   `build/fees-discounts/viu-sv8456-2026-07-21/`.
   **This staging LIVE-VIU pass was ADVERSARIALLY AUDITED CLEAN 2026-07-20 (§0.0j):**
   every VIU-Verified flip is evidence-backed, the 152/12/0/20/1 = 185 tally reconciles
   across all deliverables, live TestRail matches, run 325 untouched, no secrets. STILL
   OPEN: re-VIU the remaining 12 Deviations not cleanly re-driven on staging
   (FD-STATS-001/002/004 persist [no headers/hyperlink]; FD-PROC-008/009, FD-CALC-013,
   FD-INLINE-003, FD-CUST-005/006, FD-TMPL-010, FD-WO-013, FD-PERM-002 need
   seeding/role-negatives) + FD-PART-005 + (the FD-CUST-016/FD-VAL-007 DUPLICATE-PAIR
   QA-lead ruling is now RESOLVED — kept C28605, retired C28500, §0.0k) + filing the ready bug drafts (TICKETS 2/3/6/7/8/9/10/11;
   TICKET 1 on hold, 4 & 5 dropped, FDBUG-15 dropped) + the env/VIU backlog.
   **Resume = PROJECT-STATE.md §0/§0.5**
   (TestRail edits need fresh one-day authorization). FEATURE LIVE on
   `qb.qa.shopview.com` / API `sv7387api.qa.shopview.com` (flag ON). **DONE 2026-07-13:
   V1_2 spec applied (43 case updates + new FD-WO-016=C29441) AND a FRESH FULL
   build-accurate WORDING + VIU PASS over ALL 183 cases** with live-captured build
   labels — **ALL 183 pushed to TestRail via update_case, 200/200, 0 errors.**
   Headlines: FDBUG-1 not reproduced (treat fixed; FD-DOC-011 Verified);
   §5-R15 tax-jurisdiction note NOT implemented (FD-WO-016 Deviation); 14 QB
   line-item cases need a human in
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
   Receiving (ShopView), Epic **SV-7301**.
   **✅ STATUS: COMPLETED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record. **Canonical spec (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/PM/pages/646021121/Simple+Mode+Streamlined+Work+Order+Completion+Bulk+Receiving
   (Atlassian-SSO login-walled — reference pointer only; export/paste content to
   ingest, do NOT fetch). **CANONICAL STATE DOC (read first for
   resume):** `build/simple-flow/PROJECT-STATE.md` — the single authoritative
   snapshot (case inventory 184 active [187 authored − 3 retired] + VIU breakdown,
   TestRail state, deliverables
   index, open threads, env/access facts, how-to-resume). Memory:
   `build/simple-flow/*`
   (`requirements.md` = COMPLETE spec, 17 stories SV-7696..SV-7710 + SV-7870
   [incl. R12/R13 auto-complete = SV-8303] + SV-7876 + §9/§10 SV-8183 permissions;
   `design-notes.md`; `viu-findings.md`;
   `cases/*.json` = 187 authored cases with `SF-` IDs (post spec `_4`/V2.6 2026-07-17;
   **3 Retired 2026-07-20 → 184 ACTIVE**); `SimpleFlow_V1_TestCases.xlsx/.csv`;
   `build_workbook.py` + `gen_cases.py`). ALL 184 active cases in TestRail (SF-QB-09 =
   C29909 since 2026-07-17; SF-CORE-05/06/09 = ex C29317/18/21 DELETED 2026-07-20 per
   user ruling). **A QA execution run EXISTS — run 325 "Simple Flow -
   Ayesha Khan -> Specs 7/7/2026"** (project 1/suite 1; snapshot 48 Passed / 6 Failed
   / 13 Blocked / 89 Untested; results logged by Ayesha 2026-07-13). It was **NOT
   created by us** — it is Ayesha's/QA's run; **never write results to it without
   explicit permission** (corrects the earlier "no execution run exists" note).
   Reconciliation vs our findings:
   `build/simple-flow/run325-reconciliation-2026-07-13.md` — priority follow-ups = 5
   "she-FAILED / we-VIU-Verified" cases (SF-COMP-02, SF-TECH-02, SF-VPART-06
   unexplained → need live re-VIU; SF-VPART-01/02 likely stale-7/7-baseline tied to
   known BUG-9) + ingest Jira **SV-8303** (Ayesha's SF-SET-10 note flags a coming
   spec change).
   **RESUME 2026-07-24 (LATEST — SV-8183 UNCOVERED-AREAS RE-RUN "rerun2"; NO TestRail writes; read
   build/simple-flow/PROJECT-STATE.md §0-KK + source `sv8183/rerun2-2026-07-24/FINDINGS.md` commit
   7a0cc39):** closed the 5 §0-II open follow-ups (part-item kebab actions; SV-8541 return/resolve-core
   endpoints LOCATED; `/bulk-receive`; Returns/Part-Sales/Vendors/Deliveries/Inventory; Yes-heavy
   roles). **BE-enforcement matrix extended to 11 roles × 7 endpoints — `accept`/receive matches §9.2
   EXACTLY** (400 for the 7 Yes roles, 403 for the 4 No roles). **RESULT: NO NEW permission issue** (no
   FE-exposure defect, no true FE-allows+BE-allows gap); the 2 API-behaviors (NEW-1 `change-item`
   SFD-gate → Sales Rep/Office; NEW-2 part add/delete/edit + resolve-core not BE-enforced) are **PASS
   per the strengthened Rule 24** — rerun2 added the missing FE-blocked half of the proof (Office
   edit_note/Receive hidden; negatives route-blocked). Known SV-8515 (not reproducible), SV-8516
   (part-edit API-flag PASS), SV-8541 (pre-resolve-cores 400-all recurs; held) unchanged. **0 role
   drift** (all 11 == §9.2 before AND after). **HONESTY — do NOT claim 100% exhaustive; 2 residuals:**
   SM/SrSA/Foreman not individually UI-driven (no confirmed real holder; BE-positive via matrix
   superset); the resolve-cores wizard + return flow not driven end-to-end (per-role BE captured).
   Corrective cases IN TestRail (§0-JJ): SF-PERM-11 = C30646 (VIU-Deviation, SV-8515 FE-exposure) +
   SF-PERM-12 = C30647 (VIU-Verified, Rule-24 PASS) + SF-PERM-03 = C29407 (updated). Tally 186 active.
   **RESUME 2026-07-24 (LATEST — SV-8183 OPTIONAL REGRESSION EDITS EXECUTED; read PROJECT-STATE.md §0-LL):**
   2 `update_case` (user-authorized), both HTTP 200 + re-GET MATCH, run 325 untouched, 0 add/delete/section.
   SF-PERM-06 = C29410 (API — Permissions, sec 4090) — added per-role Bulk Receive `accept` BE-enforcement
   matrix (403 for the 4 No roles / allowed for the 7 Yes, matches §9.2). SF-PERM-12 = C30647 (Permissions,
   sec 4084) — appended a plain Rule-24 QA note (edit-part/change-vendor + part add/delete FE-hidden but
   API-possible = accepted PASS; NEW-1/NEW-2). viu_status unchanged; tally UNCHANGED 186 active
   (152/4/21/5/3/1); id-map refs mirrored; deliverables regenerated (import 186 rows, hygiene clean). Audit
   sv8183/testrail-execution-log-optional-edits-2026-07-24.md.
   **PRIOR RESUME 2026-07-24 (CORRECTIVE PUSH EXECUTED + RULE 24 STRENGTHENED; read
   build/simple-flow/PROJECT-STATE.md §0-JJ):** the staged SV-8183 corrective push is now LIVE —
   **SF-PERM-11 = C30646 (VIU-Deviation, SV-8515 FE-exposure) + SF-PERM-12 = C30647 (VIU-Verified,
   PASS per Rule 24) add_case + SF-PERM-03 = C29407 update_case, all HTTP 200 + re-GET MATCH; run
   325 untouched.** id-map 186/186 (0 blanks); deliverables regenerated over 186. **Standing Rule 24
   STRENGTHENED (user ruling 2026-07-24): FE-blocks + BE/API-allows = a PASSED test case (anywhere,
   always); INVERSE (FE exposes what BE blocks) = FE-exposure DEFECT.** §0-II NEW-1/NEW-2 → PASS per
   Rule 24 (no dev ticket); existing 3 Deviations scanned — none match FE-block/BE-allow, none
   flipped. Tally UNCHANGED 152/4/21/5/3/1 = 186.
   **PRIOR RESUME 2026-07-24 (SV-8183 EXHAUSTIVE LIVE RE-RUN, §13a method; NO TestRail writes;
   read build/simple-flow/PROJECT-STATE.md §0-II + source `sv8183/rerun-2026-07-24/FINDINGS.md`
   commit 1a263c8):** all 11 roles reset-verified == §9.2, 0 drift; **NO new permission BUG beyond
   the known 3.** Two NEW Rule-24 flags (FE-hidden but API-possible; accepted-for-now per user
   2026-07-24, NOT bugs): **NEW-1** = `change-item` (edit-part/change-vendor) BE-gated by
   `seeFinancialData` not `vendorOrderManagementCreateAndEdit` per §9.2 → Sales Rep + Office can
   change vendor via API (spec-conformance wrong-atom deviation, no known ticket, AWAITING user
   dev-raise decision); **NEW-2** = part add/delete not BE-enforced for any role (SV-7864
   atom-collapse). Known-3: SV-8515 NOT reproducible now (Receive-Selected path gone + accept 403);
   SV-8516 mostly fixed (change-item 403 for Time Clock; part add/cancel angle persists as API flag);
   SV-8541 not re-driven (endpoints not located; held). **Broad but NOT exhaustive — OPEN
   follow-ups:** part-row kebab on a seeded received special-order part+core; SV-8541
   return/resolve-core endpoints; the /bulk-receive page; Returns/Part-Sales/Vendor pages; the
   Yes-heavy roles (SM/SrSA/Foreman/PM) individually UI-driven. Corrective cases SF-PERM-11/12 +
   SF-PERM-03 tighten authored (commit 53d89a5), TestRail push STAGED not executed. Tally UNCHANGED
   152/4/21/5/3/1 = 186.
   **RESUME 2026-07-24 (SV-8183 report CORRECTED; our 11/11 PASS OVER-CLAIMED):**
   QA (Ayesha) found 3 real coverage gaps our pass missed; live re-verify on clean template roles
   (drift ruled out, Rule 26) confirmed all 3 — **SV-8515** = real FE-exposure defect (View-only user
   reaches editable Bulk-Receive via multi-select "Receive Selected"; BE blocks the actual receive
   `accept`→403; dev Ready-to-Fix; Ayesha overstated the bypass); **SV-8516** = real over-grant now
   FE-fixed (Time Clock ⋮ = only Return) but BE still accepts part edit (`change-request`→200) =
   Rule-24 flag; **SV-8541** = real, pre-existing/spec-interp (`pre-resolve-cores`→201 even for Time
   Clock, §9.4-anticipated, Open for Sasha). 3 corrective cases PROPOSED (not authored): (i) V&O
   View-only "Receive Selected" negative +update SF-PERM-03/C29407; (ii) Time Clock part
   edit/cancel/return negative (Rule-24); (iii) WOL-C&E core-resolve/return negative (pending Sasha).
   Deliverables: `sv8183/SimpleFlow_SV-8183_vs-QA-Issues_Analysis_2026-07-24.md`/`.xlsx`; prior report
   carries a CORRECTION addendum; **lesson folded into build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md §13a**
   (drive every action path + alternate entry points per role; probe BE per granular action; never
   report "all pass" as feature-wide completeness). NO TestRail writes; tally UNCHANGED 151/4/21/5/3=184.
   Read build/simple-flow/PROJECT-STATE.md §0-GG / the CORRECTION block first.
   **RESUME 2026-07-24 (SV-8183 CORRECTIVE CASES AUTHORED — user-approved, staged only, NO TestRail
   writes): read build/simple-flow/PROJECT-STATE.md §0-HH first.** 2 corrective SF-PERM cases authored
   for the QA-found coverage gaps: **SF-PERM-11** (new, no C-ID yet; driver **SV-8515** — V&O View-only
   [Office] can't receive by ANY path; multi-select "Receive Selected" currently EXPOSES editable
   /bulk-receive = FE-exposure defect, dev Ready-to-Fix, BE blocks accept→403; viu_status VIU-Deviation)
   + **SF-PERM-12** (new, no C-ID yet; driver **SV-8516** — Time Clock part ⋮ menu hides Edit/Cancel/
   Change Vendor [pass]; **SV-8516 FE-only gating ACCEPTED for now, NOT a defect** — same edit via API
   `part/change-request`→200 = Rule-24 flag; viu_status VIU-Verified) + **SF-PERM-03 (C29407) tightened**
   to drive BOTH Bulk-Receive entry points. **SV-8541 HELD** (not authored, user ruling). **NEW TALLY =
   186 ACTIVE: 152 VIU-Verified / 4 VIU-Pending / 21 Blocked-Env / 5 awaiting-Milos / 3 Deviation / 1
   VIU-Deviation.** id-map SF-PERM-11/12 = BLANK C-ids (need add_case). Sync STAGED not executed:
   `sv8183/testrail-sync-manifest-corrective-2026-07-24.md` (2 add_case + 1 update_case; run 325 untouched).
   **PRIOR RESUME 2026-07-23 (SV-8183 drift-cells FINISHED + SF-PERM-01 PUSHED): read build/simple-flow/PROJECT-STATE.md §0-FF-CLOSE first.**
   Follow-up (authorized): the 3 drift-blocked Technician cells are now CLEANLY OBSERVED LIVE
   against a verified-clean Technician baseline (role 50bf6a0d re-read = canonical 6 atoms,
   before==after, no drift this window; Rule 26 satisfied). **SF-PERM-02 (C29406)/SF-PERM-10
   (C29414) Technician cell** — WO "Send To Review"/completion cluster ABSENT for Technician
   (only line-level New Line/Complete show = line-edit). **SF-PERM-09 (C29413)** — New Part
   Request dialog for Technician shows only Part Number/Description/Quantity, **sell-price field
   ABSENT** (seeFinancialData gate; corroborated by Admin Parts-tab Sell Price column). Element
   gates now 9/9 clean this run. Evidence: `viu-sv8183-2026-07-23/element-reobserve/`
   (complete-Tech-reset-2026-07-23.png, tech-newpartrequest-dialog-2026-07-23.png, element-matrix.json).
   **SF-PERM-01 (C29405) `update_case` EXECUTED** (page-reachability Expected; BE atom-family
   driver in metadata) — HTTP 200 + re-GET MATCH, title/refs unchanged; manifest = EXECUTED;
   audit `sv8183/testrail-execution-log-2026-07-23.md`. **ONLY TestRail write; run 325 untouched;
   no add/delete/section.** Tally UNCHANGED = 151/4/21/5/3 = 184 (no status changes, metadata-only).
   Prior 0-FF pass (same day): all 11 SF-PERM/SF-REV VIU-Verified; composition 11/11 == §9.2;
   BE atom-FAMILY finding for `POST /api/organizations/settings/change` (clean Parts Manager 200,
   no-settings 403). **Tech baseline = role "Technician" (50bf6a0d), NOT Time Clock User** (Rule 26).
   **Prior RESUME 2026-07-20: read build/simple-flow/PROJECT-STATE.md §'WHAT'S LEFT TO DO' + §0-CC**
   — RETIRE EXECUTED 2026-07-20 (user ruling 2026-07-17): SF-CORE-05/06/09 deleted from
   TestRail (delete_case 3/3, verified gone, audit-logged, run 325 untouched), bodies
   kept locally marked Retired, id-map −3, generators exclude Retired (187→184), all
   deliverables regenerated over 184; **Milos spec-V2.6 question sheet READY to send:
   PO-Questions-Milos-SpecV26_2026-07-17.xlsx/.md** (Q1 S8-R7 leftover cost sentence,
   Q2 Vendors-Expenses surface, Q3 S10-R2 residue; layman + QA-map tabs). Prior pass:
   — spec `_4`/V2.6 APPLIED 2026-07-17: Story-18 pre-resolve-cores (SV-8353) authored
   (+17 new cases: SF-CORE-11..19 [2 API] + SF-RCV-11..13 + SF-VEND-07/08 + SF-POSEL-07
   + SF-BULK-11 + SF-WOP-04 = C29892–C29908), Δ9-Δ15 applied (14 case edits),
   SF-VMIS-06 rescoped (S6-R6 rewritten-to-code — Deviation RESOLVED), SF-QB-09
   rescoped + FINALLY IN TESTRAIL (=C29909; Open-Question resolved; all 187 mapped),
   SF-INV-01/02/03 + SF-BULK-06 re-VIU pending (old-build-Verified; Δ13 Apply-button
   removed / Δ14 $0-only cost — expect build deviations until dev ships);
   3 retire-proposals SF-CORE-05/06/09 (RESOLVED: retired + deleted 2026-07-20).
   TestRail push 2 add_section (4252/4253) +
   13 update_case + 18 add_case, all 200+re-GET-MATCH, audit =
   build/simple-flow/spec-v4-2026-07-17/testrail-update-log.md; **ADVERSARIALLY
   AUDITED CLEAN 2026-07-17** (31/31 live-vs-local MATCH, run 325 + retire
   candidates untouched, tally confirmed across all deliverables; one
   Tracker-header count defect fixed; commits df95b70→a578ef9 + audit fix 4398091);
   requirements.md promoted to V2.6; deliverables regenerated (import 187 rows
   VIU/flag-word-free).
   **STAGING LIVE VIU 2026-07-20 (§0-DD, LATEST):** Simple Flow is now DEPLOYED on
   `app.staging.shopview.com`/`api.staging.shopview.com` (shared d55bc308 org) — the
   Story-18 pre-resolve-cores build is LIVE there (was NOT seedable/built on sv7301). A
   live pass verified **4 cases: SF-CORE-03 (C29315) / SF-CORE-04 (C29316) / SF-CORE-11
   (C29892) / SF-CORE-18 (C29899)** — Resolve-cores wizard step ("Missing Details →
   Resolve cores → Receive parts & invoice"; buttons "OK · Returned"/"Not OK · Keep +
   Charge"; Continue gated 0/1→1/1) + `POST /api/work-orders/{id}/pre-resolve-cores`
   `{cores:[{partRequestId,isCoreOk}]}`→201 `{resolvedCount}` no side-effects. **Two-session
   pass verified 18 cases:** SF-CORE-03/04/07/08/11/12/13/14/16/18, SF-BULK-06/10,
   SF-INV-01/02/03, SF-RCV-13, SF-VEND-08, SF-REV-14 (Story-18 resolve wizard incl.
   required-invoice "Complete & Send to Review" pill order Details→Resolve cores→Receive;
   grouped Bulk Receive at `/bulk-receive?ids=...` via "Receive Selected" — per-vendor
   invoice field no-Apply-button; cost editable only when $0; receive auto-applies core
   decision via `badge_core_resolution` no re-prompt; Not-OK bills a "Core for <part>" line,
   OK doesn't — line-items authoritative, WO totalPrice aggregate lags/inverts). TestRail:
   SF-CORE-03/11/18 update_case 200 + re-GET MATCH, all others no-op (wording already accurate);
   run 325 untouched. Evidence: `build/simple-flow/viu-staging-2026-07-20/`. Seeding works
   (recipe + add-part API `POST /api/work-orders/part/make-request` in PROJECT-STATE §0-DD).
   **3-session pass verified 21 cases total** (added resume-2: SF-VEND-07, SF-POSEL-07, SF-BULK-11
   — vendor changeable via parts-tab select_vendor before receive; part-sale PO type 2 "P-1110"
   appears in PO list + on grouped Bulk Receive). **Tally 184 ACTIVE (187 authored − 3 retired):
   Verified 151 / VIU-Pending 4 / Blocked-Env 21 / awaiting-Milos 5 / Deviation 3 / Open-Q 0.**
   **SF-RCV-05/07 DEVIATION DEFINITIVELY CONFIRMED** (Accept-Delivery Vendor Missing group still at
   TOP, should be BOTTOM per Milos — they KEEP Deviation status; but **bug draft #5 DROPPED — WON'T FILE**
   as cosmetic-only / no functional impact per user 2026-07-20; the vendor-missing-position thread is
   CLOSED, accepted-cosmetic, not filed). SF-CORE-15/17 + SF-QB-09 → Blocked-Env
   (invoiced+unreceived-core state not producible: complete≠invoiced/paid + can't order on completed WO;
   QB not connected). Remaining 4 VIU-Pending: SF-CORE-19 (received-core handle-core), SF-RCV-11
   (return-to-line scroll), SF-RCV-12 (other-vendor exclusion), SF-WOP-04 (Waiting-on-Parts column).
   Outstanding: SEND the
   Milos spec-V2.6 sheet (READY), Story-18 re-VIU backlog (needs SV-8353 build +
   dev-seeded core), 5 unanswered Milos Qs, run-325 reconcile. (Receive-screen
   vendor-missing-position bug draft #5 DROPPED — won't-file, cosmetic, user 2026-07-20.)
   **STATUS: STAGING LIVE-VIU DONE + ADVERSARIALLY AUDITED CLEAN 2026-07-20 (§0-EE;
   tally 184: 151/4/21/5/3 reconciles across all deliverables, live TestRail matches,
   run 325 untouched, retired SF-CORE-05/06/09 confirmed gone, no secrets) + RETIRE
   EXECUTED + MILOS V2.6 SHEET READY 2026-07-20 (on top of SPEC `_4`
   V2.6 applied + audited clean 2026-07-17 + the complete VIU process + spec `_3`/design
   `_4` + Milos Round-3). PROJECT-STATE.md = canonical resume doc (read first).** Detail: full build-accurate
   wording+VIU pass (all 163, 200/200) + V2.4 Δ1-Δ4 (+ SF-VEND-06=C29442) +
   reviewer≠completer DESCOPED (self-review allowed when role holds Mark Reviewed; BUG-5
   dropped) + spec-relevance reconciliation + run-325 (Ayesha) reconciled + the
   2026-07-14 VIU grind (drove VIU-Pending to 0) + the **spec `_3`/design `_4` pass**:
   Δ5 auto-complete (Story 16 R12/R13 = SV-8303) authored **7 new SF-AUTO cases
   C29461–C29467** (sections 4092 UI / 4093 API; 01/02/03/05/07 Verified, 04
   [delete-lines API 500] + 06 [UI clock-out] Blocked-Env), Δ6 flipped SF-SET-10
   Verified (resolves SV-8303/run-325), Δ7 S10-R2 first-class-part DEPRECATED
   (SF-PNFIX-02/03/06 + SF-QB-08 rescoped → Verified), design `_4` flipped SF-CORE-03
   (core un-skippable at completion; core BEHAVIOR still Blocked-Env — needs a
   dev-seeded vendor-sourced core). **TestRail push: 18 update_case + 7 add_case + 2
   add_section, all 200/200, no writes to run 325.** Roles matrix re-derived —
   **Technician NOT drifted on sv7301.** Stories 7/8/9/14/16-auto CONFIRMED BUILT;
   DEV-NOT-BUILT = 0. **ALL 184 active current in TestRail** (SF-QB-09 = C29909,
   2026-07-17; SF-CORE-05/06/09 retired/deleted 2026-07-20).
   **Deviations (3):** SF-SET-03 (no Create Purchase Orders toggle) + SF-RCV-05/07
   (Vendor-Missing group at TOP on the Receive screen, should be BOTTOM). SF-VMIS-06's
   old "needs vendor report" deviation was RESOLVED 2026-07-17 by the spec `_4` S6-R6
   rewrite (rescoped → Blocked-Env). Build findings OBS-6 (Part-History 500) +
   OBS-7 (universal disabled-Complete gate on unapproved line, expected). **WAITING
   ON:** Milos Round-3 (8 awaiting-Milos: SF-SET-08/COMP-06/RCV-05/RCV-07/REV-11/
   REV-15/UX-04/QB-02 + earlier MILOS set; deliverables ready: PO-Questions-Round3.xlsx,
   SimpleFlow_Bugs-for-Milos-Confirm.xlsx, SimpleFlow_Bug-Drafts.xlsx); **25 Blocked-Env**
   (§0-ZZ/§0-AA): QuickBooks not connected (9, needs QB-connected company + human in QB),
   special-order vendor-sourced cores not creatable — needs dev-seeded core (SF-CORE
   set), invoiced/paid WO not drivable (3), merge auto-consolidates (2), VIN-less asset
   (1), SF-AUTO-04 (API-500 fix) + SF-AUTO-06 (UI clock-out) (2). Run-325 Ayesha status
   cross-referenced in `run325-status-map-2026-07-14.md`. **Doc self-contradiction to
   flag for Milos:** spec `_3` strikes S10-R2 but Story-10 AC bullets + technical
   guardrails still describe first-class-part creation. Bug drafts (TICKET 2-5) unfiled
   (no Atlassian in this env); OBS-6 + SF-AUTO-04 API-500 for dev (SF-VMIS-06 dev-route
   dropped 2026-07-17 — spec rewritten to match code). SF-QB-09 mapped 2026-07-17
   (= C29909) — the old unmapped-follow-up is CLOSED.
   Pre-existing residue: 3 QA WOs left Complete (reversible in-app only).
   **qb/sv7301 env is SHARED — re-read settings before runs, restore byte-identical
   after** (node-fetch-ignores-proxy gotcha → use undici ProxyAgent). All detail
   (deltas, blockers, env, how-to-resume) in PROJECT-STATE.md = canonical resume doc.
   *TestRail import (INTERIM):* `testrail-import/simple-flow-v1-testrail-import.csv`
   (+ `.xlsx`), all 169 mapped cases via `build/simple-flow/gen_import.py`; **VIU-word-free
   and feature-flag-free by user rule** (settings-driven, so settings preconditions
   are kept); INTERIM pending post-VIU + dev-answer finalization (see
   `build/simple-flow/RESUME-STRATEGY.md`). Permissions: REQUIRES definition (no role
   matrix) — see `build/PERMISSIONS-ASSESSMENT.md`.
   **Simple Flow contradiction rule:** when two inputs conflict (spec doc vs answer
   sheet vs design), the MOST RECENT update is authoritative (last-update-wins). The
   spec `_3` (de-facto V2.5) doc + 2026-07-14 design `_4` bundle are the latest and
   override the earlier V2.4 doc / round-1 answer sheet where they disagree (e.g. the
   V2.4 note #6 first-class-part requirement was REVERSED by spec `_3` Δ7).
4. **Global Search project** — Global Search v2 (ShopView App).
   **⏸️ STATUS: POSTPONED 2026-07-27 (user ruling).** Detail/resume docs below are
   kept for the record; not active work. **Canonical spec
   (Confluence, confirmed 2026-07-16):**
   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements+Development+Plan
   (Atlassian-SSO login-walled — reference pointer only; do NOT fetch; spec content
   already ingested from the exported .doc).
   **Figma:** https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
   **PO: Branko** (confirmed 2026-07-16; known as Branko, full name TBC — never mix PO
   attributions: Global Search=Branko, Fees&Discounts=Chris Ward, Simple Flow=Milos).
   **⚠️ Epic/Jira key: NOT AVAILABLE YET — ASK THE USER for it when VIU begins** (user
   doesn't have it as of 2026-07-16; do NOT invent).
   **CANONICAL STATE DOC (read first for resume):**
   `build/global-search/PROJECT-STATE.md` — single authoritative snapshot (status,
   case inventory, deliverables index, open questions, env/access TBD, how-to-resume).
   **STATUS: CASES AUTHORED 2026-07-16 (86 cases/15 sections, adversarial-reviewed
   CLEAN, import ready VIU-word-free/flag-free); TestRail push PENDING permission; VIU
   pending feature on QA; PO=Branko; Epic key TBD (ask at VIU); OQ-3 open. Canonical
   resume doc: build/global-search/PROJECT-STATE.md.**
   **2026-07-31 OWNERSHIP RULING (Branko, via the Filters Q6 sheet): the ⌘K/pop-up
   "Search or ask a question" palette is tested under GLOBAL SEARCH, not Filters — so the
   9 retired Filters palette cases (FLT-SRCH-01..09, blank C-ids, never pushed) have their
   coverage land HERE on resume; "Ask a question" is out of the FILTERS PRD only, so OQ-3
   (AI in Global Search V1?) STAYS OPEN. See PROJECT-STATE.md §0.0.** Spec fully
   ingested → `build/global-search/requirements.md` (§1–§11: 6 searchable entity types
   [Work Orders, Customers, Assets, Parts, Vendors, Part Sales], ⌘K/K spotlight
   palette, fuzzy match [trigram + Damerau-Levenshtein + Double Metaphone; identifier
   fields exact-only], relevance ranking, recent/persisting search, hover
   quick-actions, keyboard nav, role-based result scoping, `GET /api/search`, 5-phase
   dev plan, feature-flagged rollout). Design capture COMPLETE **10/10 Figma
   screenshots** → `build/global-search/design-notes.md`; **2 states OUT OF SCOPE (NOT
   authored): AI search-all + header-component proposal.** AI/"ask a question"
   placeholder implies AI but AI is OUT OF SCOPE for V1 (OQ-3 still open — confirm
   whether the placeholder ships in V1). Deliverables: `cases/cases-A..D-*.json` (86),
   `coverage-matrix.md` (every in-scope spec req + Figma state → case IDs, out-of-scope
   items + ~20 VIU-confirm placeholders), `gen_import.py` +
   `testrail-import/global-search-v2-testrail-import.csv`/`.xlsx` (CANONICAL location +
   format — PURE 1:1 match to the fees-discounts / simple-flow imports: 8 named columns
   + 2 trailing blank columns, header byte-identical, NO ID columns; traceability via
   `testrail-id-map.csv` per Rule 8, same as the other two projects;
   VIU-word-free + feature-flag-free; API cases in an "API — <leaf>" section per Rule 4;
   the old bespoke
   `build/global-search/GlobalSearch_TestRail-Import.*` was superseded/removed 2026-07-16),
   `testrail-id-map.csv` (all 86 IDs, blank C-ids),
   PROJECT-STATE.md. **No TestRail writes without explicit user permission.** Reuse
   shared infra (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION,
   TESTING-RUNBOOK, harness/TestRail patterns). Per Standing Rule 11, ASK which
   process(es) to run before the VIU pass. Still open: OQ-3 (AI scope), OQ-4 (Epic key
   — ask at VIU), OQ-5 (QA env/flag status).
5. **Filters project** — Filters / Work Order list filtering (ShopView App): a
   persistent multi-criteria filter bar on the Work Orders page (Status / Customer /
   Lead Technician / Service Advisor / Asset on Site chips; multi-select + search;
   Clear filters / Clear selection; collapse/expand toggle; per-user persistence;
   URL shareable state; tab behaviour incl. Status hidden on Estimates/Completed;
   mobile horizontally-scrollable chips + bottom-sheet dropdowns).
   **Canonical spec URL (Confluence): TO CONFIRM — user provided the exported .doc
   2026-07-16; ask for the page URL** (when obtained: Atlassian-SSO login-walled —
   reference pointer only, do NOT fetch; spec content already ingested from the
   exported .doc).
   **Figma (canonical design pointer):**
   https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-23562
   ("Work Order Explorations 20.4.2026"; spec header also links node 11817-27678;
   per-story node links in requirements.md).
   **PO: Branko** (full name TBC — same PO as Global Search; never mix PO
   attributions: Filters=Branko, Global Search=Branko, Fees&Discounts=Chris Ward,
   Simple Flow=Milos).
   **✅ Epic/Jira key: SV-8785 "Filters" — FOUND + VERIFIED LIVE 2026-08-04.** This
   **SUPERSEDES** the long-standing "no epic exists / all 170 SV epics enumerated, none is
   Filters" finding, which was **true on 2026-07-31 and went stale within hours**: the epic
   was created **2026-07-31T07:51:51-0500 = 12:51 UTC**, AFTER that enumeration ran, and
   Branko linked it into the spec at 13:07/13:10 UTC (Confluence v13→v14 — the ONLY content
   change in either version). Verified `GET /rest/api/3/issue/SV-8785` → HTTP 200, type
   **Epic**, hierarchy level 1, status Open. **14 children SV-8786…SV-8799 map 1:1 BY TITLE
   AND IN ORDER onto the spec's 14 stories, so `Story n → SV-(8785+n)`** (Rule-37 Tier-1
   check, two independent ways: `parent=SV-8785` → 14, `"Epic Link"=SV-8785` → 14, same keys,
   no paging remainder). **All 110 cases now carry a real ticket in `refs`** — 66 single-story
   keys + 44 the epic marked `[epic]` for cross-cutting/unanchored cases (the compact marker
   is deliberate: TestRail rejects a `refs` comma-entry over 248 chars, and these already run
   to 248) — pushed + byte-verified 2026-08-04 and mirrored into a **NEW `refs` column** on
   `build/filters/testrail-id-map.csv` (110/110). **Rule 20 is satisfiable for Filters for the
   first time.** **SV-8795 (Filter Persistence) and SV-8796 (URL State) are already `Ready for
   QA`** — the first sign a QA env may be near. Evidence:
   `build/filters/provenance-2026-08-04/SOURCE-CURRENCY.md`. **LESSON (Rule 31): a
   proven-absence finding has a shelf life — re-check it, do not cache it.**
   **CANONICAL STATE DOC (read first for resume):** `build/filters/PROJECT-STATE.md`
   — single authoritative snapshot (status, deliverables index, open questions,
   env/access TBD, how-to-resume).
   **STATUS 2026-07-27 (LATEST — OPTION A design-level authoring): 43 NEW
   Parts/Reports/page-search cases AUTHORED, VIU-Pending, NO TestRail writes** —
   Parts 12 (FLT-PARTS-01..12), Reports 22 (FLT-RPTS-01..22), page-search 9
   (FLT-SRCH-01..09; every one carries an OVERLAP note = also the Global Search
   project, reconcile before push). Written to the captured designs (chips +
   columns + on-screen labels); all behaviour flagged "pending Branko's product
   write-up" (design-only, not live-verified). **New total 122** (79 existing
   C29557–C29635 + 43 new blank C-ids → need add_case). Import + id-map regenerated
   over 122, hygiene re-verified (header byte-identical, 0 VIU/flag words, 79 C-ids
   re-merged). **Branko PO-questions doc READY:
   build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md/.xlsx** (7 product
   Qs: PRD request, which chips apply, option lists, new filter-type behaviour,
   WO-parity, page-search scope vs Global Search + AI, per-role filters). NEXT =
   Branko PRD/answers → SPEC-RELEVANCE-RECONCILIATION + build-accurate wording + live
   VIU on the 43 new cases → authorized add_case push. Canonical resume doc:
   build/filters/PROJECT-STATE.md (2026-07-27 header).
   **STATUS 2026-08-04 (LATEST — STANDING RULE 54 PROVENANCE RETROFIT EXECUTED, user-authorized;
   resume `build/filters/provenance-2026-08-04/`):** all **110/110** cases now end their Expected
   Results with a plain provenance sentence naming **epic SV-8785** (see the epic entry above) + the
   **Filters specification version 1.6** + the case's own anchors — **state 1 (NO build date; still
   no Filters QA env)**. `update_case` ONLY: 110 cases / 111 ops, every one HTTP 200 +
   **byte-verified MATCH, 28 fields compared each** (Rule 50); **each op wrote `custom_expected` +
   `refs`**, the refs being the **epic backfill that replaced the now-false literal "Filters (no Jira
   epic)"**. **Run 352 verified untouched** — 110 tests set-equal both ways, **all 395 result records
   present BY ID**. **Rule-41 whole-case re-read of all 110** found the paste-corrupted **FLT-MOB-04
   C29624** (refs artefact FIXED in the same write; the BODY reflow is **STAGED not executed** —
   `STAGED-REPAIRS.md` — because the case sits in the frozen mobile cluster) and **0 other defects**.
   **Rule-28 cross-case sweep: 0 contradictions**, and it caught one coherence issue of our own —
   **FLT-MOB-08 C29628** reclassified `plain` → `design_awaiting` and re-pushed. **Honesty variants:
   4 PO-ruling (Status chip) · 9 prose-only+PO-answers (Parts/Reports) · 8 design-awaiting (mobile
   "Apply filters" — 2 HIGH risk, and the ask has NEVER been sent) · 2 no-anchor · 87 plain.**
   Defence register: `build/filters/provenance-2026-08-04/PO-RULING-DEFENCE.md`. **NOTE: the
   permanent-persistence ruling is NO LONGER a conflict — Branko fixed S10-R2 in v1.6.**
   **STATUS 2026-07-31 (three-dimension Ruthless Usefulness Audit RUN + consolidation
   EXECUTED; audit dir build/filters/quality-audit-2026-07-31/):** 137 → **110 local / 94 live**
   (2 update_case + 27 local-only retirements + 12 sense repairs); audit tally = **1 nonsense
   (RETAINED per user ruling) + 0 missing-traceability**. **PENDING:** ~~39 title trims~~
   (**DONE — re-measured live 2026-08-04: 0 of 110 titles exceed 80 chars, longest is exactly
   80**); the 19
   dropdown merges (await QA-branch LIVE check of the shared-dropdown-component assumption); the
   9 FLT-SRCH cases (await Branko's Global-Search ownership confirmation — user ruling 2026-07-31:
   do NOT delete unless he confirms).
   **Prior STATUS: CASES AUTHORED 2026-07-17 — 79 cases/14 sections,
   adversarial-reviewed CLEAN (7/7); import ready (pure 1:1,
   testrail-import/filters-v1-testrail-import.csv/.xlsx); PO questions ready
   for Branko (Parts/Reports scope + 3 more); VIU pending env + Epic key
   ask-at-VIU. IMPORTED TO TESTRAIL 2026-07-17 (suite 1, group 4110; id-map
   79/79 populated, C29557–C29635; API cases in section 4124 "API — Work Orders
   List Filtering"; ⚠️ gen_import.py blanks the C-id column — re-merge after any
   rerun); NEXT = Branko answers → VIU at QA (ask Epic key + process). Canonical
   resume doc: build/filters/PROJECT-STATE.md. Branko answers ingested
   2026-07-17 (Parts/Reports IN SCOPE pending PRD; persistence permanent;
   disabled-chip ruling); JE-tab frame captured (final set 50/50);
   design-system zip = reference prototype; baseline confirmed ZIP=final
   (user ruling A 2026-07-17). Q2/Q4 case updates PUSHED to TestRail
   2026-07-17 (3/3, audit-logged) — FLT-PERS-02/C29614 permanent persistence,
   FLT-TAB-02/03 C29609/C29610 disabled pre-filled Status chip; import +
   id-map regenerated (id-map re-merged 79/79); audit log =
   build/filters/branko-answers-2026-07-17/testrail-update-log.md; Round-2 Qs +
   PRD request SENT to Branko 2026-07-17. **ROUND-2 ANSWERS INGESTED 2026-07-20
   (Q1=A/Q2=A/Q3=A — all confirmatory, ZERO case edits / ZERO TestRail writes
   required; OQ-4 RESOLVED: filter lists role-independent; prototype
   "Reported" anomaly CLOSED — "Imported" correct; optional Q3 notes-only
   annotation on C29566/C29575/C29582 to bundle with the next authorized push;
   source of record
   build/filters/branko-answers-round2-2026-07-20/answers-ingested.md).**
   Still awaited: Branko's updated PRD (incl. the two Q1 text fixes) → then
   Parts/Reports authoring; VIU on QA arrival.** Same rules as all projects: reuse shared infra
   (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION,
   TESTING-RUNBOOK, harness/TestRail patterns); per Standing Rule 11 ASK which
   process(es) to run before any VIU pass. Open questions live in
   requirements.md (OQ-2/3/6/7 QA-side) + the PO sheet (product decisions).
6. **Schedule project** — Schedule / Technician Scheduling Module (ShopView App): a
   visual drag-and-drop technician scheduling calendar (top-level nav area) with a
   left work-order sidebar (mini calendar + searchable/filterable WO cards +
   approved-only per-line drill-down) and a main schedule grid (Day/Week/Month,
   department-grouped technician rows + in-grid Unassigned lane); drag a WO/line onto
   a technician × day/time cell to create shifts, with a scope picker (multi-line
   orders) and a multi-day spread step producing a linked series (connected banner);
   plus events, conflict detection (double-booked/weekend/before-hours/after-hours),
   capacity bars, hover tooltips, overlap lane-stacking (3-lane cap + "+N more"),
   series-aware deletion, undo toasts, keyboard support; WO labor-roster kept in
   sync; access gated by a Schedule View/Edit/Delete custom-role tier
   (Delete⊇Edit⊇View) + a Work Orders: View sidebar dependency; grid rows are
   department-based, not role-based.
   **Canonical spec URL (Confluence):**
   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
   (Atlassian-SSO login-walled — reference pointer only, do NOT fetch; content
   ingested from the exported .doc — a Confluence "Export to Word" MHTML/
   quoted-printable file, decoded with Python email/quopri + BeautifulSoup).
   **PO: Branko** (confirmed 2026-07-21; same PO as Global Search & Filters; full name
   TBC — never mix PO attributions: Schedule=Branko, Global Search=Branko,
   Filters=Branko, Fees&Discounts=Chris Ward, Simple Flow=Milos).
   **⚠️ Epic/Jira key: NOT AVAILABLE YET — ASK THE USER when VIU begins** (do NOT
   invent). **⚠️ QA branch/env + feature-flag/settings status: NOT AVAILABLE YET —
   ASK THE USER when VIU begins.** **Figma/design: NONE at the moment (user confirmed
   2026-07-21) — SPEC-ONLY project;** author build-accurate wording (Rule 9) from the
   spec text where present and mark anything the spec doesn't pin down (exact
   on-screen labels/states) as "VIU-confirm" to confirm LIVE once the QA branch exists
   (same pattern as Global Search/Filters); do NOT invent labels.
   **CANONICAL STATE DOC (read first for resume):** `build/schedule/PROJECT-STATE.md`
   — single authoritative snapshot (status, spec-ingest facts, authoring-readiness
   assessment §0.6, deliverables index, open questions, env/access TBD, how-to-resume).
   **STATUS 2026-07-27 (LATEST — EPIC SV-8685 BACKFILL + DESIGN/JIRA DELTAS + NEW-SCOPE, LOCAL
   ONLY, NO TestRail writes; resume `build/schedule/PROJECT-STATE.md` §0.0-EPIC):** epic = **SV-8685**
   / 15 stories SV-8686..SV-8700 **(+ SV-8812 since 2026-08-04 = 16 children — a Task,
   "Set up a dedicated QA environment for testing", Board Backlog; NOT a testable requirement,
   it is the ticket for the very thing blocking our VIU. All 15 stories also moved Open →
   In Progress by 2026-08-04 — a status move, so NO case content changed).** Applied locally (plan item 1): (1) Rule-20 refs backfilled on ALL
   **167** active cases (`<TICKET> (<spec-anchor>)`, cross-cutting perms → epic SV-8685; resolves
   OQ-2); (2) 10 tester-facing edits — SCH-FILT-01/C29942 "Filters", SCH-VIEW-01/C30042 "Filter &
   Display", SCH-EVT-01/C30016 "Create Event", SCH-REAS-03/C30054 menu=Create Event+New Work Order,
   SCH-REAS-04/C30055 (View Day removed) + SCH-REAS-05/C30056 (New Shift removed, both REWORKED not
   retired), SCH-DEL-08/C30064 toast 7s-Undo/4s, D2 SCH-SPREAD-07/C29983 + SCH-EDGE-05/C30089 (shop
   closures NOT skipped V1), D3 SCH-BLOCK-04/C29994 (blocks default blue, custom per-shift); (3) **10
   NEW-SCOPE cases** (`cases/cases-G-new-scope.json`, VIU-Pending): Working Hours Settings ×7
   (SCH-HRS-01..07, SV-8699), Week Export ×2 (SCH-EXP-01/02, scope pending Branko), New Work Order
   shortcut ×1 (SCH-REAS-06). **HELD pending Branko:** D1 events-count-toward-capacity
   (SCH-EVT-08/C30615 + SCH-CAP-01..04) + D4 modal "Reassign" (SCH-MODAL-08/C30015). **NEW TALLY:
   177 ACTIVE authored** (all VIU-Pending); deliverables regenerated over 177 (id-map now has a
   `refs` column, References column = Rule-20 refs, header byte-identical, hygiene clean); id-map
   167 C-ids re-merged + 10 new blank. **EPIC SYNC EXECUTED 2026-07-27 (user-authorized, Rule 6):
   the manifest `spec-v1-2026-07-22/testrail-sync-manifest-epic-2026-07-27.md` is now LIVE —
   2 add_section (Working Hours Settings = 5405, Week Export and Printing = 5406) + 10 add_case
   (SCH-HRS-01..07 = C38846–C38852, SCH-EXP-01/02 = C38853/C38854, SCH-REAS-06 = C38855;
   custom_atmstatus:3+custom_automation_type:0, non-API) + 167 update_case (157 refs-only + 10
   tester-facing), ALL HTTP 200, ALL re-GET MATCH, 0 delete. D1 (events→capacity) + D4 (modal
   Reassign) HELD, not written. Run 325/all runs untouched. NEW TALLY: 177 ACTIVE, all C-id'd
   (id-map re-merged 177/177; import regenerated header byte-identical, 0 VIU/flag words).
   Executor `exec_sync_epic_2026-07-27.py` (+ `exec_sync_epic_resume.py` for a 16-case tail after a
   transient HTTP 000). Audit `testrail-execution-log-epic-2026-07-27.md`; manifest header = EXECUTED.**
   Scripts: `epic-sv8685/backfill_refs.py`, `epic-sv8685/patch_edits.py`. Design-pinned ≠
   VIU-Verified (Rule 12); live VIU still pending QA branch (OQ-3).
   **STATUS 2026-08-04 (LATEST — FIRST-EVER LIVE VIU DONE on QA branch `sv8685`, then RECOVERED +
   FINISHED after the worker was cut off mid-wrap-up; resume `build/schedule/READINESS-2026-08-04.md`
   then `build/schedule/recovery-2026-08-04/STATE.md`):** all **165 cases carry a DEFINITE verdict** —
   **138 PASS / 19 DEVIATION (ticketed) / 4 NOT-BUILT / 2 HELD (shop closures) / 2 un-settable on this
   estate** — **zero partly-observed, zero unobserved**, counted two independent ways (the execution
   log and a re-read of the live case text) which agree area-for-area. Build **`v3.5-4873abe`**,
   `index.html` last-modified Tue 04 Aug 2026 14:47:39 GMT, etag `9b4b1fc776ebbfb04a9a0ca051d847f7` —
   **identical at start, mid-run, end AND at the recovery re-read, so NO redeploy**. **Provenance now
   at Rule-54 STATE 2 on 165/165** (build date + marker), each exactly once. **179 `update_case` ops
   total (169 by the original worker + 10 in recovery), ALL HTTP 200 + byte-verified MATCH, 28 fields
   compared each, 0 mismatch; run 357 proven untouched BOTH times** (include_all false, 165 tests, all
   **429** result records present BY ID, case_id sets equal both ways). **10 defects filed SV-8848…
   SV-8857** — all **priority Low, parent SV-8685, owning story linked, Open** (Rules 52/53), each
   read back from Jira. **Epic is now 28 children** (15 stories all `Ready for QA`, SV-8812 **Done** =
   this branch, **+12 Bug tickets SV-8826…SV-8841 raised 2026-08-04 by Mudassir Qamar** — 6 confirmed,
   2 don't reproduce as written, 2 contradict Branko's own rulings [SV-8835 VIN / SV-8829 money] where
   **Rule 33 means the rulings STAND and nothing was changed on either side**, 1 = SV-8831 a REAL gap
   we missed). **1 API-only finding written up NOT filed** (Rule 51, `viu-2026-08-04/API-ASK.md`).
   **⚠️ Rule-49 queue OPEN — branch NOT declared final, so all 165 verdicts are PROVISIONAL.**
   **RECOVERY caught 5 half-states** (`recovery-2026-08-04/STATE.md`): (1) a **pre-existing shift
   `ebdd3e03…` left on the WRONG technician and 450 min short** by the Day-view drag test — **RESTORED
   and proven byte-identical on all 14 fields**, series total back to 1980 min *(lesson: a restore
   isn't restored until compared FIELD BY FIELD)*; (2) the **generated import was corrupt — a newline
   between EVERY CHARACTER** of preconds/steps/expected in all 165 rows, because `gen_import.py`'s
   `joinlines()` did `"\n".join(x)` over a **string** where the live-resync now writes strings not
   lists — **FIXED in `gen_import.py` (it now splits a string first) + regenerated**; ⚠️ **the SAME
   bug corrupted `testrail-import/filters-v1-testrail-import.csv` (all 110 rows) — NOT fixed here,
   out of scope, needs the same one-line fix in the Filters generator**; (3) local source stale for
   the 4 audit-fix cases; (4) **17 cases said a defect "has no developer ticket yet" when 8 of them
   DID** — 10 cases corrected so all 10 filed tickets are now named on their case; (5) 2 cases leaked
   dev jargon (a PATCH endpoint / a payload flag + HTTP codes) into tester text in **non-API sections**
   — cleaned, so **0 cases now carry API content outside the API section**. **Reported NOT changed:
   16 cases show raw `<ol>/<li>` markup to the tester (PREDATES this pass — same 16 in the pre-write
   snapshot; a repair = 16 writes, needs go-ahead)** and **SCH-MODAL-03 = C30010 is a real deviation
   with NO ticket and, until entry 19, no register entry** (the time-logged bar reads full when
   nothing was clocked — an 11th ticket is the ask). Env left clean: 3 ZZAUTOTEST roles already
   deleted, borrowed staff (Henry Hess) back on Technician, seeded shifts gone, working hours + the
   location business-hours toggle byte-identical to the snapshot. Deliverables:
   `READINESS-2026-08-04.md` (one table, 29 rows, **every row sums**, 161 of 165 automatable now),
   `viu-2026-08-04/{FINDINGS,COVERAGE-REDERIVATION,AUDIT,GAP-HUNT,SURFACE-MATRIX,DELIBERATE-DECISIONS
   [22 entries, HIGH 3/MED 7/LOW 12],RECHECK-QUEUE,API-ASK,SOURCE-CURRENCY}.md`,
   `recovery-2026-08-04/{STATE,testrail-execution-log}.md`, and the refreshed
   `provenance-2026-08-04/PO-RULING-DEFENCE.md` (all 4 Branko rulings re-confirmed LIVE).
   **Prior STATUS 2026-08-04 (STANDING RULE 54 PROVENANCE RETROFIT EXECUTED, user-authorized;
   resume `build/schedule/provenance-2026-08-04/`):** all **165/165** cases end their Expected
   Results with a plain provenance sentence naming **epic SV-8685** + the **Schedule specification
   version 23** + the case's own § anchors — **state 1 then (NO build date; superseded by state 2
   above once the branch arrived)**. `update_case` ONLY: 165 ops, every one HTTP 200 + **byte-verified MATCH, 28
   fields compared each**, every unintended field proven byte-identical (Rule 50). **Run 357 verified
   untouched** — 165 tests set-equal both ways, **all 429 result records present BY ID**,
   include_all still false. **Rule-41 whole-case re-read of all 165** produced 1 fix (SCH-HRS-04
   C38849 `(/02)` leak) and **0 other defects** (0 stale anchors, 0 over-80 titles, 0 Rule-4
   misplacements). **Rule-28 cross-case sweep: 0 contradictions.** **Honesty variants: 5 PO-ruling ·
   3 spec-states-it-BOTH-WAYS-with-no-ruling (2 HIGH risk: shop closures) · 2 tech-plan limits ·
   5 no-spec-anchor · 150 plain.** Defence register (quote-ready if challenged):
   `build/schedule/provenance-2026-08-04/PO-RULING-DEFENCE.md`; source currency
   `SOURCE-CURRENCY.md`; per-op audit `testrail-execution-log.md`. **Spec version is ONE generator
   constant** (`tools/classify.py`), and the stamper is **idempotent** (proven over 3 runs) — a
   re-stamp REPLACES the line, never appends.
   **STATUS 2026-07-31 (three-dimension Ruthless Usefulness Audit RUN + consolidation
   EXECUTED; audit dir build/schedule/quality-audit-2026-07-31/):** 190 → **165 ACTIVE**
   (49/49 TestRail ops verified — 20 merge groups + 2 cuts + 6 sense repairs); audit tally =
   **0 nonsense + 0 missing-traceability**. **PENDING:** ~~79 title trims~~ (**DONE —
   re-measured live 2026-08-04: 0 of 165 titles exceed 80 chars, longest is exactly 80**).
   **PRIOR STATUS: TestRail SYNC EXECUTED 2026-07-22 (user-authorized, incl. delete) — the staged
   spec_1+design+Branko reconciliation is now LIVE in TestRail: 7 update_case + 2 add_case +
   1 delete_case, ALL HTTP 200, ALL re-GET verified MATCH; run 325 untouched, only group 4254
   touched, no secrets committed. 7 updates: SCH-MODAL-04 (C30011)/MODAL-08 (C30015)/CONF-02/03/04
   (C30024/25/26)/VIEW-04 (C30045)/TIP-01 (C30034) [SCH-CONF-01/C30023 notes-only, NOT pushed].
   2 adds: SCH-PERM-12 = C30614 (Permissions §4279) + SCH-EVT-08 = C30615 (Events §4269), both
   custom_atmstatus:3/custom_automation_type:0, non-API. 1 delete: SCH-REAS-02/C30053 (modal-Reassign
   removed; drag-reassign covered by SCH-REAS-01/C30052) — verified gone, body kept locally Retired.
   Tally now 168 authored / **167 ACTIVE** (SCH-REAS-02 Retired/deleted). Deliverables regenerated
   over 167 (import 167 rows VIU/flag-word-free header byte-identical; id-map 167 ALL C-ids populated
   incl. C30614/C30615; ⚠️ gen_import.py blanks id-map C-ids + excludes Retired on rerun — re-merge).
   Executor build/schedule/exec_sync_2026-07-22.py; per-case audit log
   spec-v1-2026-07-22/testrail-execution-log-2026-07-22.md; manifest header = EXECUTED.
   Design NO LONGER MISSING (Claude prototype Schedule.dc.html authoritative, Branko Q0). Applied
   edits: 6 expected-result edits (MODAL-04 no $/labor, MODAL-08 Delete-only, CONF-02/03/04 per-tech
   configured hours hierarchy, VIEW-04 "VIN Number" toggle=block-only) + VIN §4.13-vs-§9 RESOLVED
   (design §6; §9 prose flagged to Branko) + Q1 events-excluded may-change notes + ~48 design-pinned
   labels folded (~18 still need LIVE confirm).
   NEXT = live VIU pending QA branch (OQ-3) + Epic key (OQ-2); Rule 12 design-pinned ≠ VIU-Verified.
   Prior: CASES
   AUTHORED 2026-07-21 166/26 SPEC-ONLY adversarial-reviewed CLEAN; IMPORTED TO TESTRAIL
   2026-07-21 (group 4254 "Schedule - 2026 (VIU Pending)", child sections 4255–4280).
   Canonical resume doc: build/schedule/PROJECT-STATE.md §0.0-APPLIED.** Same rules as all projects:
   reuse shared infra (BUILD-ACCURATE-WORDING-VIU-PROCESS,
   SPEC-RELEVANCE-RECONCILIATION-PROCESS, TESTING-RUNBOOK, harness/TestRail patterns);
   deliverable/import format pure 1:1 with testrail-import/*-testrail-import.csv
   (Standing Rule 16); no TestRail writes without explicit permission (Standing Rule
   6); per Standing Rule 11 ASK which process(es) to run before any VIU pass.
7. **Report Suite project** — Reporting suite (ShopView App): ONE project, SIX
   reports, each with its own spec — (1) SBC Sales By Customer, (2) SBR Sales By
   Representative, (3) Parts Velocity, (4) Technician Utilization, (5) WIP Work In
   Progress, (6) Inventory Value.
   **PO: Chris Ward** (same PO as Fees & Discounts — never mix attributions: Report
   Suite = Chris Ward; Global Search/Filters/Schedule = Branko; Simple Flow = Milos).
   **Epic/Jira key = SV-8582** (ingested 2026-07-27 via Atlassian MCP — epic Open, 97
   child stories SV-8583→SV-8679, branch `project/reports-suite-bravo`, QA Nebojsa +
   Viktoria; **reconciled: the 97 stories MATCH our 515 cases 1:1, no new user-facing
   cases needed** — sources build/report-suite/epic-sv8582/INGEST-SUMMARY.md +
   RECONCILIATION.md; **Chris PO-questions doc READY:
   build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-27.md/.xlsx** — SBR Esc
   vs Golden-Rule, permission-model confirm, confirm-no-designs; ~3–6 backend/regression
   cases deferred to the QA branch). OPEN = QA branch/env + flag state + Chris's answers.
   **⚠️ Designs: NOT YET AVAILABLE** — spec-only authoring (Rule 9 wording from the
   spec's verbatim labels, "VIU-confirm" anything unpinned; design-reconciliation
   later if designs arrive). **Specs WILL keep changing** — run
   SPEC-RELEVANCE-RECONCILIATION per update (ALWAYS ASK first, Standing Rule 11).
   **Canonical spec URLs (Confluence, Atlassian-SSO login-walled — reference pointers
   only, do NOT fetch; content ingested from the exported .doc MHTML files):** all six
   under https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/
   — SBC `577634305/SBC+Sales+By+Customer+Report` · SBR
   `585629698/SBR+Sales+By+Representative+Report` · Parts Velocity
   `620888066/Parts+Velocity+Report` · Technician Utilization
   `641400833/Technician+Utilization+Report` · WIP
   `703660034/WIP+Work+In+Progress+Report` · Inventory Value
   `720142338/Inventory+Value+Report` (full URLs in each spec file's header +
   PROJECT-STATE §1).
   **TestRail structure (user-prescribed):** ONE main section "Report Suite" → a
   SUBSECTION per report (named after the report) → that report's cases inside;
   API-content cases in "<Report> — API" sections per Rule 4; import pure 1:1 per
   Rule 16 (Section column = report name; the user's import creates the parent group).
   **CANONICAL STATE DOC (read first for resume):** `build/report-suite/PROJECT-STATE.md`
   — single authoritative snapshot (per-report spec inventory + readiness snapshot,
   TestRail structure, open questions OQ-1..7, how-to-resume).
   **STATUS 2026-07-28 (LATEST): AUTHORIZED FULL TESTRAIL PUSH EXECUTED ("Push ALL") — 459
   ACTIVE cases (515 − 57 deletes + SBC-EXP-16 = C38856; video edits + 9 sense-check repairs +
   41-group merge consolidation all live, 70 update / 1 add / 57 delete, ALL 200 + verified, 0
   failures; run R359 515→458 documented, never written; live count under group 4281 = 459 ==
   id-map). Resume = PROJECT-STATE.md §0 UPDATE 2026-07-28-B; audit =
   reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md.**
   **Prior STATUS: CASES AUTHORED + ADVERSARIALLY REVIEWED CLEAN 2026-07-22 — 515
   cases / 89 sections / 6 reports; import ready; NEXT = user import → C-id
   map → VIU.** (SBC 99 / SBR 127 / PV 70 / TU 59 / WIP 83 / IV 77; spec-only,
   all VIU-Pending; coverage 6/6 complete, every bullet mapped in
   `build/report-suite/coverage-*.md`; review fixes b410d29 + 82f1665, import
   REGENERATED post-review, full gate re-passed). **Unified import READY (pure
   1:1, header byte-identical 5/5 vs prior imports):
   `testrail-import/report-suite-v1-testrail-import.csv`/`.xlsx` via
   `build/report-suite/gen_import.py`; id-map 515 rows blank C-ids (⚠️
   gen_import.py rerun blanks C-ids — re-merge, same as Filters/Schedule).
   **PER-REPORT SPLIT 2026-07-22:** user manually created TestRail group 4281
   "Reports Suite" + six empty per-report subsections 4282–4287; six per-report
   split imports emitted with **HUMAN-READABLE filenames** (user rule — full
   report names, never cryptic abbreviations; renamed same day from the initial
   `-{sbc,sbr,pv,tu,wip,iv}-` slugs):
   `testrail-import/Report-Suite_{Sales-By-Customer-Report,Sales-By-Representative-Report,Parts-Velocity-Report,Technician-Utilization-Report,Work-In-Progress-Report,Inventory-Value-Report}_testrail-import.csv`/`.xlsx`,
   99/127/70/59/83/77 = 515, rows byte-identical to the unified file, verified;
   PROJECT-STATE §0.6). **IMPORTED + MAPPED READ-ONLY 2026-07-22: all 515 cases
   now live in TestRail under group 4281 "Reports Suite" (six report folders
   4282–4287 → 89 per-area leaf subsections 4288–4376); live read confirmed
   exactly 515 cases under 4281; execution run R359 "Reports Suite -
   Nebojsa/Viktoria (VIU Pending)" exists (515 tests, all Untested, NOT ours —
   no result writes without permission). testrail-id-map.csv now FULLY POPULATED
   — 515/515 matched by exact (section-leaf-name + title), 0 unmatched / 0
   ambiguous / 0 leftover, observed C-id range C30096–C30610; done read-only
   (get_sections + get_cases only), NO TestRail writes.** NEXT = VIU pending
   env/Epic (ask Chris Ward: TU S8 video inconsistency, IV export cap; Epic key
   ask-at-VIU; designs pending).** Specs will keep
   changing → Rule-11 reconciliation ask per update. Canonical resume doc:
   build/report-suite/PROJECT-STATE.md. Same rules as all projects: reuse shared
   infra (BUILD-ACCURATE-WORDING-VIU-PROCESS, SPEC-RELEVANCE-RECONCILIATION-PROCESS,
   TESTING-RUNBOOK, harness/TestRail patterns); Standing Rules 6/11/16 apply.
   **2026-07-28: the walkthrough VIDEO ruled AUTHORITATIVE (VP-created); video-driven edits applied
   LOCALLY with full pre-edit backups (build/report-suite/video-promotion-backup-2026-07-28/) +
   SPEC-WATCH deadline 2026-08-04 — if Chris Ward has NOT ratified the video items into the 6 specs
   by then, REMIND THE USER (build/report-suite/SPEC-WATCH-2026-07-28.md); ruthless usefulness audit
   run 2026-07-28 (build/report-suite/quality-audit-2026-07-28/).**
   **2026-07-29 Chris ruling (DURABLE, all projects' reports + all future work): the asset
   identifier chain VIN → Unit # → plate is the STANDARD everywhere — WIP included (his answer "A
   is the correct answer" to the WIP question; verbatim "Not just for these specs though -- really
   good to keep this in mind for all actions moving forward"). Terminology caution: VIN = VEHICLE
   identification number — for non-vehicle assets (e.g. a generator) the value is effectively the
   serial number; keep the build label "VIN" + a short plain tester note. Source
   build/report-suite/chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md; WIP-COL-05
   C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485 / WIP-EXP-07 C30516 flipped LOCALLY, wave-2
   push queue = 4 update_case awaiting authorization; Chris's spec edit NOT hand-reviewed — the
   changelog re-diff must confirm the WIP identifier text (SPEC-WATCH deadline 2026-08-04).**

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
   **EXTENDED 2026-07-23 — applies to CHAT/REPORTS too, not just files:** whenever I
   name a case by its internal ID (FD-/SF-/SCH-/etc.) ANYWHERE — a chat reply, a status
   update, a summary table, a findings list — I MUST pair it with the TestRail Case ID
   (C#####) + the /cases/view/<id> link so the user can look it up in TestRail. Never
   give a bare internal ID with no C-ID. (A case not yet in TestRail — e.g. a new
   to-be-authored case — is stated as "new, no C-ID yet".) User rule: "instead of just
   such numbers also give me the TestRail test case IDs so I can look for those in
   TestRail … save it for all the processes where you give me these numbers."
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
    VIU-verify behavior **LIVE with evidence** → checkpoint-commit → push to TestRail via `update_case`
    with a per-case audit log (subject to that project's TestRail authorization; **the push step's
    verification follows Standing Rule 50 — EXHAUSTIVE then EXACT: every case and every field, no
    sampling, and each write re-GET and byte-compared against the intended payload with untouched
    fields proven byte-identical**) →
    **STAMP OR REFRESH EACH CASE'S PROVENANCE LINE as part of that same push (Standing Rule 54) — a
    live-verified case's line must name the build and the date it was tested; a push that corrects
    wording but leaves a stale (or absent) provenance line is not complete** →
    regenerate deliverables (Blockers Tracker + Results workbook + import, with
    TestRail Case ID + Link columns) → report each area tester-ready and **ALWAYS
    state the TestRail update status explicitly.** This is the default meaning of
    "VIU" for EVERY project going forward. **The behavior-verification step MUST be
    LIVE UI-OBSERVED with evidence captured that run (screenshot / captured API
    response) — never inferred.** For permission/role cases this means actually
    logging in / driving the UI AS the actual role and OBSERVING the control, PER
    role, PER environment — never derived from role definitions, `fe_permissions`,
    atoms, or source code. A case is only **VIU-Verified** when its behavior was
    directly observed live with evidence; otherwise it is **Blocked / NOT VERIFIED**
    with the reason stated. (See Standing Rule 12 — verified means observed, never
    inferred; it governs this step absolutely.)
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
12. **Verified means OBSERVED, never inferred (trust rule):** When the user asks
    for a real/live check — or ANY verification — only mark something Verified /
    Pass / Fail / grants / blocks / present / absent if it was ACTUALLY observed
    live in the environment with evidence (screenshot / API response captured that
    run). NEVER fill a gap with inference from the spec, the source code, role
    definitions, or prior data and present it as a verified result. Anything not
    directly observed MUST be labeled explicitly 'NOT VERIFIED' (or
    Blocked-with-reason) in the deliverable — never silently derived and passed off
    as done. If a live check cannot be completed (session/cookie expired, screen
    unreachable, env down), STOP and tell the user plainly what could not be
    verified and what is needed (e.g. fresh cookies) — do NOT substitute inference
    to appear complete. Every deliverable must clearly separate LIVE-OBSERVED
    results from INFERRED/derived ones, with a per-item confidence/source. This is
    absolute for release-critical and production work. Rationale: on 2026-07-14 a
    prod-vs-staging permission comparison presented FE-gated capabilities (Send to
    Portal/Terminal etc.) as results when they were inferred from role
    definitions/code rather than UI-observed, and the session had expired mid-run —
    this broke user trust and must never recur.
13. **Live, feature-by-feature testing is the DEFAULT standard (all projects):**
    Whenever the user asks to TEST / VERIFY / CHECK / CONFIRM anything — any
    feature, function, permission, or behavior — test it LIVE by going through each
    feature/function IN THE REAL ENVIRONMENT and OBSERVING it directly with evidence
    (screenshot / captured response that run), exactly the way the 2026-07-14
    prod-vs-staging permission comparison was done (log in / drive the actual UI per
    role / per environment, seed data as needed, observe the real control/behavior).
    Never assume, never infer from spec, source code, role definitions,
    fe_permissions, atoms, or prior data. Go feature-by-feature in reality. This
    live, feature-by-feature, evidence-based method is the required standard for
    EVERY testing request going forward, not just VIU or release checks. (Extends
    Rule 12's observed-not-inferred trust rule and Rule 10's live VIU verification
    step to cover ALL test/verify/check/confirm requests.)
14. **NEVER mark anything NOT-VERIFIED for a missing DATA-STATE — seed it and
    observe (all projects).** A test/verify/compare cell or case must NEVER be left
    "NOT VERIFIED" (or Blocked) merely because the required data-state doesn't
    currently exist in the environment. On the disposable test/staging/QA/prod
    environments (all are test accounts — writes/deletes authorized per Standing
    Rule 6), the required state is ALWAYS self-serviceable: SEED it and observe the
    behavior LIVE with evidence. Reasons like "line already approved — needs a
    pending-line WO", "no returnable part exists", "no cored picked line", "no
    invoice in void state", "no PO/delivery", "role has no live holder" are NOT
    acceptable blockers — UNBLOCK yourself by creating the state (seed a WO with an
    unapproved line, pick a cored/returnable part, drive an invoice to void, create
    a PO+delivery, CREATE a fresh staff member per role and clean-self-login, etc.),
    then observe. The ONLY permissible non-plain-observed cell is a genuine EXTERNAL
    dependency that cannot be provisioned even with full seeding + fresh-staff
    creation (e.g. physical payment-terminal hardware / external payment-processor
    registration) — and even then it must be a FULLY-CHARACTERIZED, evidence-backed
    LABELED verdict (e.g. "org-device gate — org has no terminal device; not a
    role/permission difference"), NEVER the bare text "NOT VERIFIED". This extends
    Standing Rules 5 (self-service test data), 12 (observed not inferred), and 13
    (live feature-by-feature testing): observed-not-inferred means you must first
    CREATE the conditions needed to observe, not fall back to NOT-VERIFIED. Applies
    to every deliverable and every project going forward.
    **SELF-SEED PLAYBOOK (learned 2026-07-23 — always try these BEFORE ever saying
    "blocked"): (a) DON'T rely on the user to unblock env/data/workplace issues — find
    the fix yourself (e.g. the location/workplace switcher, a different WO in your own
    workplace). (b) When the UI is flaky (Quasar dialogs/selects intercepting clicks),
    switch to the API; when the API is scoped/awkward, switch to the UI — use whichever
    works. (c) DISCOVER endpoints by probing: POST with an empty/partial body and read
    the validation error to learn required fields (this found `POST /api/work-orders/create`
    needs company_id+vehicle_id+workplace_id+start_date+`is_vehicle_here:true`). (d) SEED
    the state yourself: create WOs/lines/parts/adjustments, assign a customer default so
    fees auto-apply, create a fresh staff per role, etc. **ROLE-TESTING ON STAGING (learned from the Test-Case/Automated-Test-Run session 2026-07-23): to test an arbitrary role's permission LIVE, either (i) `POST /api/switch-user {user_id}` to IMPERSONATE an existing holder of that role (get user_id = staff `id` from `GET /api/staff?limit=200` which lists role_label per staff; end with a fresh admin `login()`), or (ii) create a fresh staff `POST /api/iam/create {email, firstName, lastName, roleId, departments:[...], workplaceId}` then self-login — but on staging a fresh staff needs invite-confirmation, so PREFER switch-user impersonation of an existing role holder. NEVER role-swap Tech mid-session (causes the /no-location SPA bounce = technique artifact, not a permission result). Proven: impersonated Sales Representative (workOrdersCreateAndEdit=FALSE) → whole-WO fee add returned 201 = FE-only gate, confirming FD-WO-013/PERM-002.** (e) For Quasar UI, click by
    element-center COORDINATE (page.mouse.click) rather than Playwright actionability
    clicks that time out on backdrops; reach in-page tabs the same way. (f) CLEAN UP
    after (delete ZZAUTOTEST data, restore roles). Only after all of this genuinely
    fails is it a real blocker — and then it must be a FULLY-CHARACTERIZED, evidence-backed
    label (e.g. "WO line-create returns HTTP 500, requestId X — env defect for dev"),
    never bare "NOT VERIFIED", and you may hand the user a step-by-step data-setup sheet
    (layman, per Rule 7) for the one thing only a human/dev can provide.** The user's
    standing instruction: "there is nothing like 'require seeding data' — you can make
    everything in the build; do not find an excuse to keep yourself blocked."
15. **Spec-conformance calls derive from a VERBATIM TRUTH TABLE + adversarial
    self-audit before delivery (all projects).** Whenever annotating/judging
    ANYTHING against a spec (per-spec columns, case-vs-spec reconciliation,
    deviation calls): (1) NEVER derive from a prose summary/extract of the spec —
    build a VERBATIM role×gate / requirement truth table from the CANONICAL spec
    document itself, every value cited to its exact table row/section, with ALL
    change-log entries applied (latest-wins) so no stale column survives; (2)
    re-derive every judgement from that truth table, not from memory or a previous
    pass; (3) before delivering, run an ADVERSARIAL SELF-AUDIT diff — independently
    recompute a sample (or all, for release-critical work) of the calls and diff
    against what was written; ship only after the diff is empty; (4) MATCH/no-delta
    rows must STILL be checked against the spec — identical behavior in both envs
    can still deviate from spec; (5) where the spec is silent or self-contradictory,
    say "spec silent"/"spec inconsistent (flagged)" explicitly with the conflicting
    citations — never pick a side silently, and never declare silence without
    reading the FULL spec (matrix + prose + change-log + key decisions + open
    questions). Rationale: on 2026-07-16 a per-spec annotation pass produced 64/297
    wrong cells because it derived from a stale prose extract instead of the
    canonical spec; the truth-table + adversarial-diff method caught and fixed
    them. Release-critical deliverables get the full-population re-audit, not a
    sample.
16. **ALWAYS deliver in the format already established/provided (all projects).**
    Every deliverable (TestRail import CSV/XLSX, results/blockers workbooks,
    question sheets, exec/QA reports, per-status files, etc.) MUST match the EXACT
    format of the artifact already given for that deliverable type — same column
    headers and order, same section/folder naming convention, same file location
    and filename pattern, same wording/formatting conventions (numbered
    Preconditions/Steps/Expected, line breaks), same rules (API cases in an
    'API'-titled section per Rule 4, VIU-word-free + feature-flag-free imports,
    TestRail Case ID + link columns per Rule 8). Before producing any deliverable,
    FIRST locate the canonical prior example (e.g.
    testrail-import/<project>-testrail-import.csv + the project's gen_import.py, or
    the established workbook generator) and MIRROR its schema 1:1; do NOT invent a
    new layout. If no prior example exists for that deliverable type, ask or reuse
    the closest established template. Rationale: on 2026-07-16 the Global Search
    TestRail import was first produced in a bespoke column layout instead of
    matching the existing testrail-import/ CSV format used by Fees & Discounts and
    Simple Flow; deliverables must always mirror the format already in use so they
    drop into the user's existing process unchanged.
17. **COMPLETE data in, COMPLETE data out, COMPLETE work — always (all projects).**
    Never work from, or deliver, a partial subset unless the user EXPLICITLY asks
    to trim. (1) INPUTS: before authoring/analyzing/verifying anything, enumerate
    the FULL input set (every Figma frame in the section, every spec section +
    change-log, every ticket + its comments, every case in the suite, every role,
    every row) and state the exact total found; if any part of the input set
    cannot be obtained, STOP and tell the user exactly what is missing and how to
    supply it (per Standing Rule 1) rather than silently proceeding on a subset.
    (2) OUTPUTS: deliverables cover the WHOLE population, not a sample — no silent
    caps, no "top N", no representative-subset substitutions; if something is
    intentionally excluded (e.g. design states marked out-of-scope), list the
    exclusion explicitly with the reason. (3) WORK: multi-item jobs (VIU passes,
    comparisons, audits, pushes) run to 100% of the item list or report the
    precise per-item remainder with reasons — never declare done at a partial
    count. (4) Every completion report states the counts: total in scope /
    processed / excluded-with-reason, so completeness is verifiable at a glance.
    Rationale: 2026-07-16 — the first Figma capture for the Filters project
    rendered only 8 of the section's ~26 frames and the user had to catch it
    ("you need to have them ALL"); completeness must be the default, trimming
    only ever user-requested.
18. **Reconstruct the FULL originating instruction history when turning work
    into a process or reproducing a deliverable (all projects).** Whenever the
    user asks to (a) create/save a process, recipe, template, or "method" FROM
    their instructions, or (b) reproduce/replicate/"do the same as" a
    deliverable previously produced (including when they hand back a file you
    generated), you MUST go back to the COMPLETE set of instructions that
    produced that artifact — from the very first ask through EVERY correction,
    refinement, and iteration that led to the final ACCEPTED version — and fold
    all of it in. Do NOT merely reverse-engineer the finished artifact's
    structure/format: the originating intent, the standards demanded, and
    especially the corrections the user made ("this is wrong, fix it", "you
    can't make this mistake", "it has to be X", "you also had to learn from my
    instructions") are part of the spec and must be captured too. This applies
    to EVERYTHING — files/workbooks, TestRail test cases, imports, question
    sheets, exec/QA reports, comparisons, VIU passes, and any other work.
    METHOD: mine (1) the session transcript for the user's own turns on that
    work, (2) the project's memory/state/method docs, and (3) the relevant
    Standing Rules' rationale clauses, to recover the full A-to-Z including the
    path to the final acceptable format; then reproduce/encode BOTH the final
    structure AND the requirements/corrections behind it. When reproducing,
    apply those captured requirements by default unless the user overrides for
    that specific request. Rationale: on 2026-07-20, asked to save a reusable
    recipe for the prod-vs-staging comparison workbook, the first pass only
    reverse-engineered the file's cell structure and omitted the user's
    originating instructions and hard-won corrections (the trust incident,
    zero-NOT-VERIFIED, truth-table + adversarial audit, exec/QA companions,
    role merge-map); the user required both the format AND the full instruction
    history. Ties to Standing Rules 9/10/11/15/16/17 and the recipe docs (e.g.
    build/COMPARISON-WORKBOOK-RECIPE.md).
19. **Deliverable filenames must be HUMAN-READABLE (all projects).** Every file
    delivered to the user (imports, workbooks, question sheets, reports,
    evidence bundles) carries a filename readable at a glance — spell out
    project/report/feature names in full; NEVER cryptic abbreviations
    (sbc/pv/tu), internal codes, or opaque slugs; include the deliverable type
    and (where dated) the date. Established cross-project patterns (e.g.
    `<project>-v1-testrail-import.csv`) remain valid where they already exist;
    new files default to readable full names. Rationale: 2026-07-22 — the six
    per-report Report Suite split imports were first emitted as
    report-suite-v1-{sbc,pv,...}-… and the user required full report names
    ("make them human readable to avoid confusion - remember this rule
    always").
20. **Every test case is 100% AUTHENTIC = fully TRACEABLE to its ticket(s) + spec
    (all projects).** Whenever CREATING, VIU-verifying, or UPDATING a test case, the
    case MUST carry a provable link back to (a) the Jira ticket(s) it belongs to AND
    (b) the exact spec section/requirement it derives from — so anyone can show WHY the
    case exists and WHY its expected result is what it is. Capture these references in
    the TRACEABILITY / METADATA layer, NOT the tester-facing fields. **The TestRail
    case References (`refs`) field MUST carry BOTH references together — the Jira
    ticket key(s) AND the spec section/requirement anchor — in the format
    `<TICKET(S)> (<spec-anchor>)`** (e.g. `SV-7696 (S1-R3 (Vendor invoice Optional/
    Required))`, `SV-7865 (§5-R3)`, `SV-7301 (§5 invariant 1)` for a cross-cutting
    integrity case with no single-story owner). **Ticket-only is NOT acceptable — the
    spec reference must never be dropped** (corrected 2026-07-22: an earlier pass wrongly
    reduced `refs` to the ticket key alone; the user requires ticket + spec both, always).
    Mirror the same combined `refs` into the per-project `testrail-id-map.csv` and the
    findings/coverage-matrix. **Per-story precision ALWAYS** — the exact story ticket +
    exact spec requirement, never epic-level or guesswork (the only time the epic key is
    used is a genuinely cross-cutting case with no single-story owner, and that is stated
    explicitly). This does NOT contradict Rules 7 & 9 — the tester-facing Title/
    Preconditions/Steps/Expected stay plain and jargon-free (NO ticket IDs, story refs,
    §-numbers, enum names, or bug codes in the words the manual tester reads); the
    references live only in the metadata layer. Every CHANGE to a case must cite its
    driving ticket (with Done/Not-Done status) + spec section in the audit log and the
    change-list deliverable (last-update-wins on conflicts). A case with no ticket AND no
    spec anchor is NOT authentic — flag it (missing-traceability) rather than leave it
    unsourced. **The repeatable method to find + backfill unsourced cases is
    build/MISSING-TRACEABILITY-PROCESS.md** (run it on demand or as a sub-step of any
    spec-recheck/VIU pass). **TWO-SESSION KNOWLEDGE SHARING:** this workspace is worked
    by more than one Claude session in parallel; there is no live message bus between
    them, so **this CLAUDE.md + the build/*-PROCESS.md docs ARE the shared brain** — any
    session that learns/changes a durable rule MUST write it here so the other session
    picks it up, and MUST read here before acting. Ties to Standing Rules
    6/8/9/10/11/12/13/14/15 and build/SPEC-RECHECK-PROCESS.md +
    build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md.
21. **When CREATING a process, follow the Process-Authoring Standard — do NOT skip
    anything (all projects).** The user has a fixed preference for how a reusable
    process/recipe/method is written (stated 2026-07-23: "whenever you are creating the
    process keep in mind my preference for making a process and do not skip anything").
    Every process doc MUST: (1) be built from the FULL originating instruction history read
    from the RAW TRANSCRIPT (not a summary or memory — Rule 18), verified line by line, with
    every correction folded in; (2) capture BOTH the final accepted FORMAT and the
    REQUIREMENTS/CORRECTIONS behind it; (3) contain ALL sections — plain-English purpose,
    trigger phrases, kickoff prompt, originating-instructions+corrections, exact deliverable
    format (mirror 1:1, canonical example path), numbered steps, reusable generator/tooling,
    guardrails, honesty notes; (4) carry a human-readable filename (Rule 19); (5) get a row
    added to build/PROCESS-CATALOG.md in the SAME turn; (6) be indexed in this CLAUDE.md and
    shared with the other session; (7) end by telling the user the name + how to call it and
    offering a dry-run. **The full checklist is build/PROCESS-AUTHORING-STANDARD.md.** The
    canonical index of all callable processes is **build/PROCESS-CATALOG.md** (read it to
    pick/name a process for any project). Ties to Standing Rules 16/17/18/19.
22. **ALWAYS ASK about a live-build check up front — for EVERY process/task — whenever
    anything appears to require it (all projects).** A live-build check (observing the real
    staging/QA build with evidence) is a mandatory step of most of these processes, and access
    needs the user to supply fresh cookies. Therefore, at the START of any process or task,
    identify every step/deliverable/cell that APPEARS to need observing the live build — on-screen
    labels/wording, a control's presence/absence, a behaviour, a permission/role gate, a
    calculation, a state/flow, "what needs to change" descriptions, VIU/verification, spec-vs-build
    conformance, comparisons — and **ASK the user whether to run the live-build check for those
    items, and request the access needed (fresh cookies + env/branch + feature-flag state), BEFORE
    proceeding.** Never silently skip it, and never substitute documented prior findings,
    `viu_status`, memory, spec text, source code, or inference for a fresh live observation to
    appear complete (Rule 12). If the user declines the live check, proceed but clearly LABEL every
    such item as "not live-verified this run" in the deliverable. When live access is required but
    missing, STOP and request it rather than guessing. Rationale, 2026-07-23: the first Simple Flow
    + Fees & Discounts change lists were delivered off documented findings without a fresh live
    build check and the user rejected them — "checking in the build is part of the process, why did
    you skip that? … you should always ask me for every process if something needs to be live build
    checked … Remember that forever." Ties to Standing Rules 10/11/12/13/14/21 and
    build/PROCESS-AUTHORING-STANDARD.md.
23. **ALWAYS check the CURRENT Confluence spec — and ASK per process when unsure (all
    projects).** For the Spec-Recheck Change-List and almost every reconciliation/verification/
    authoring process, the CANONICAL current spec on Confluence is a source of truth to check
    against (not just the ingested `requirements.md`, which can lag). Therefore, at the start of
    any such process, if there is ANY doubt whether the local spec is current, **ASK the user
    whether to go through the Confluence spec** (each project's canonical page — e.g. Fees &
    Discounts pageId 622297094, Simple Flow pageId 646021121, Custom Roles pageId 565116952) —
    do NOT assume the local copy is up to date and do NOT silently skip the Confluence read.
    **When the Atlassian MCP is live, read Confluence directly via `getConfluencePage`** (this
    supersedes the older "Confluence is login-walled → user must export/paste" note, which applied
    only when no MCP was available); if the MCP is NOT available, ask the user to export/paste.
    Reconcile the cases + the change-list against the current spec (last-update-wins with the
    tickets, Rule 15 verbatim-truth-table). Rationale, 2026-07-23: the user requires "for this
    process and almost all processes you are supposed to check the specs from that confluence link
    as well; ask me for every process if I want you to go through that confluence specs or not when
    you are not sure." Ties to Standing Rules 10/11/12/13/15/21/22 and build/PROCESS-CATALOG.md.
24. **Front-end blocks + backend/API allows = a PASSED test case (all projects).** When a
    control/action is restricted in the UI (hidden/disabled by a front-end permission or FE
    gate) for a role BUT the same action still succeeds through the API (e.g. a direct `POST`
    returns 201/200 for a user who lacks the permission in the UI), the test case is a **PASS**
    — do NOT classify it as a bug/defect. **User ruling 2026-07-24 (anywhere, always): "if an
    action is blocked from the front-end and allowed from the backend/API, consider that a
    PASSED test case."** The front-end gate IS the tester-facing behaviour and is the pass
    criterion; the front-end-only enforcement (backend does not independently enforce) is
    ACCEPTED by product policy. Treat the UI behaviour as the tester-facing result (viu_status
    = Verified / PASS). **Tester-facing line required (going forward + retroactively where such
    cases exist):** Any test case where an action is blocked/hidden in the UI for a role but still
    succeeds via the back-end/API MUST carry a PLAIN, tester-facing note line so the manual tester
    knows it is expected and passes — worded simply (Rule 7), e.g.: "Note for the tester: this
    action is only hidden on the screen. If you find it can still be done another way (through the
    back-end/API), that is expected — mark this test PASSED and do not raise it as a bug." This
    applies to all projects and all future authoring; existing FE-block/BE-allow cases should get
    this line added when next touched. (User ruling 2026-07-24.) This SUPERSEDES the earlier
    "metadata-layer only" phrasing: the plain tester-facing line is now REQUIRED in the case; the
    technical detail (which exact API/endpoint) may still ALSO live in the QA/findings metadata
    layer. This matches the ShopView enforcement model (granular permissions are largely front-end
    display gates the backend does not independently enforce). **INVERSE IS NOT A PASS:** if the front-end EXPOSES/ALLOWS
    something it should NOT for a role while the backend blocks it (FE-exposure), that is an
    FE-exposure DEFECT, not covered by this ruling (e.g. SV-8515 / SF-PERM-11 — a View-only user
    reaches an editable Bulk-Receive screen the FE should hide, even though the BE `accept`→403
    blocks the actual write; keep it a Deviation). Rationale, 2026-07-23: FD-WO-013 (C28436)/
    FD-PERM-002 (C28586) — a Sales-Rep-role user (no Work Orders: Create & Edit in the UI) still
    added a whole-WO fee via the API (201); per this rule that is a PASS with the "doable via
    API" flag, not a bug. Ties to Standing Rules 12/13 and the Custom Roles enforcement-model
    finding (BE enforces resource View/Edit; granular perms are FE gates).
25. **Every DEVIATION call must cite the spec/ticket/story reference + the VERBATIM wording
    it deviates from (all projects).** Whenever I say something is a deviation (or a
    build-vs-case mismatch, or "the case expects X but the build does Y"), I MUST quote the
    exact source wording the case's expectation comes from — the spec section/requirement,
    the Jira ticket/story, and/or the design — with the reference AND the verbatim text, so
    the user can see the basis and judge it. If the expectation turns out NOT to be in the
    spec/ticket (e.g. it came from a design mock only, or was over-specified), SAY SO
    explicitly — that often means the build is actually spec-compliant and the case should be
    matched to the build, not flagged as a bug. Never assert a deviation from memory or a
    prose summary; pull the wording from the canonical spec/ticket (Rule 15 verbatim
    truth-table; Rule 23 read Confluence when unsure). Rationale, 2026-07-23: FD-STATS-002
    (C28460) "expected a per-row target + clickable link" — but the FD spec only says
    adjustments "appear on the Statistics tab" (§3) "oldest first" (§5-R9); the target/link
    was design-only, not in the spec, so the build was spec-compliant and the case was matched
    to the build. User: "whenever you discuss a deviation, give specs/tickets/stories reference
    with the wordings from which the test case is deviating." Ties to Standing Rules 12/15/20/23.
26. **Reset roles to template/default BEFORE any permission/role verification on a shared/
    disposable environment (all projects).** Whenever verifying permission- or role-gated
    behavior — a permission/role VIU (e.g. role-matrix cases), a prod-vs-staging (or any
    two-env) permission comparison, or ANY test whose expected result depends on what a role
    can/can't do — FIRST reset every in-scope role to its TEMPLATE/DEFAULT (the app's 'Reset
    To Template' action) so the test runs against the CORRECT spec-default permissions, NOT
    drift/over-grants left by prior or parallel-session testing on the shared org. Method: for
    each role, (1) record the current (pre-reset) permission set, (2) reset to template, (3)
    record the post-reset set — the before→after diff is itself a finding (which roles were
    drifted/over- or under-granted); (4) verify each template-default against the canonical
    spec permission matrix and FLAG any role whose template differs from spec (never silently
    accept); (5) then observe live per role (Rule 10/12/13). Leave roles at template afterward
    (that corrected state is the canonical baseline, and it benefits every session sharing the
    org — see the two-session shared-env caution). This EXTENDS Standing Rules 5 (self-service
    data/roles), 12 (observed-not-inferred), 13 (live feature-by-feature), 14 (seed-don't-block),
    and 15 (verbatim spec truth-table). Rationale: 2026-07-23 — during the Simple Flow SV-8183
    permission VIU on shared staging org d55bc308, the Tech user (and likely other roles) were
    over-granted from prior testing; the user directed resetting each role to template first so
    the VIU verifies against correct permissions rather than drift.
    **26a — Re-reset on mid-test drift, persistently.** If a role RE-DRIFTS during the test (a
    concurrent session/actor re-adds permissions on the shared org), RESET it to template AGAIN
    and CONTINUE the testing — re-assert the template baseline every time drift is detected mid-run,
    then immediately re-observe. Do NOT abandon the observation to a "drift-blocked" partial while
    re-reset is still working, and do NOT cap the retries at a small number. Only record a genuine
    blocker if the reset itself fails, or drift recurs so fast that no observation can complete even
    with immediate re-reset+observe after sustained persistence — and then document it precisely
    (Rule 12, never infer a pass). Leave the role at template when done. Rationale: 2026-07-23 —
    during the SV-8183 Technician-role VIU a concurrent session kept re-drifting the shared
    Technician role mid-run.
27. **Reuse recorded action recipes; never re-discover from scratch (all projects).** Before
    performing ANY staging/QA/env action — create a WO, add a part to a work order, add a fee/
    discount, switch/impersonate a role, reset a role to template, change location/workplace, hit
    an endpoint, drive a UI flow, log into Jira/Confluence, push to TestRail — FIRST read
    build/APP-ACTIONS-PLAYBOOK.md "STAGING ACTION RECIPES" (the indexed quick-reference at the top)
    + CLAUDE.md "Durable key facts" and REUSE the recorded recipe. Do NOT re-derive endpoints, IDs,
    payloads, UI click-paths, or gotcha-fixes that you (or another session) already proved. The
    INSTANT you discover a NEW working recipe (a new endpoint, payload field, ID, UI path, or the
    concrete gotcha-fix that unblocked success), append it to build/APP-ACTIONS-PLAYBOOK.md
    immediately in the same session — success-proven knowledge ONLY (never failed attempts/dead-ends),
    per the "Keeping this current" append-only convention. This is the shared brain across the
    parallel sessions (there is no live message bus — the books ARE the channel, Rule 20), so a
    recipe recorded once must never be re-discovered. Rationale, 2026-07-27: the user flagged that
    re-discovering known actions (e.g. how to add a part to a work order) from scratch extends
    testing time — "you should have these things in your memory as mentioned to you before so that
    you can retrieve them from memory instead of finding your ways from scratch again and again."
    Ties to Standing Rules 5 (self-service data/roles), 6 (disposable env), 14 (self-seed playbook)
    and the "keep the books current" convention.
28. **Ruthless usefulness audit — a THREE-DIMENSION mandatory quality gate on all test-case
    authoring (all projects).** EVERY test-case authoring/update pass, for every project, ENDS
    with the Ruthless Usefulness Audit (build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md) BEFORE the
    suite is delivered/imported, scoring 100% of the cases (no sampling, Rule 17) on **THREE
    dimensions, together**: **(1) USEFUL** — exactly one verdict each: **KEEP** (distinct
    observable behavior, failure = real reportable bug, not covered elsewhere) / **MERGE**
    (over-granular; name the merge group + the one survivor) / **WEAK-KEEP** (legitimate but
    low-value, flagged) / **CUT** (spec-parroting, untestable/vague, duplicate [named], tests the
    framework not the feature, or PO-descoped) — hunting the named slop patterns (near-duplicates
    across areas; sort-direction/per-column explosions; per-column display filler; tooltip
    present-vs-text splits; empty-state triplets; permission cases reducing to one gate; export
    pairs duplicating a whole filter matrix) AND crediting the load-bearing coverage (calculation
    contracts, permission gating, link targets, persistence, export-reflects-filters).
    **(2) MAKES SENSE (coherence)** — read each case COLD, as the critic would, and score
    **SENSIBLE / FIX-WORDING / NONSENSE** against the 6 fail conditions: steps not executable in
    order or precondition unreachable; expected result doesn't follow from the steps; internal
    contradiction; references a control/screen/field in neither the spec nor the design/video
    sources; domain nonsense (impossible math, wrong calculation direction, cost/sell conflation,
    impossible snapshot logic); not actionable (a tester can't tell what to DO or what PASS looks
    like). Every NONSENSE quotes the offending text + fail condition; cross-check for
    KEEP-but-NONSENSE (the embarrassment check) explicitly. **Per Standing Rule 50 the audit scores
    100% of the cases and THE COLD READ IS NOT A SAMPLE — every case is cold-read on all three
    dimensions; a spot-check of N cases may NEVER be reported in language implying the whole suite,
    and the deliverable states the exact number read out of the exact population.** **Dimension 2 also includes a MANDATORY
    CROSS-CASE CONSISTENCY SWEEP (a suite can be 100% individually-sensible and still be
    self-contradictory):** group the cases by the control/behaviour they assert on and diff their
    expected results — plus an opposite-assertion keyword sweep (hidden vs shown/disabled, real-time
    vs on-Apply, editable vs locked…), a **TITLE-vs-EXPECTED check on every case**, and a
    same-`refs`-anchor diff; any pair that cannot both be true = **CONTRADICTION**, resolved by the
    Rule-33 precedence order (PO ruling → QA-lead ruling → our live-verified findings → reviewer
    claim) with the WHOLE group aligned to the winner, or flagged PENDING a PO question if no ruling
    exists — **a suite may not be delivered with an unresolved contradiction**, and the count found/
    resolved ships in the tally (rationale 2026-07-31: our audit rated 110 Filters cases SENSIBLE
    while they contradicted each other on the Status chip — a junior QA caught it cold; canonical
    example `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md`). **(3) GENUINE + LAYMAN-RUNNABLE** —
    every case traceable to its ticket + spec/video source (Rule 20 authenticity) AND executable
    by a NON-TECHNICAL manual QA tester easily (Rules 7/9 plain wording: build-accurate labels,
    no jargon, numbered steps a layman can follow); a case failing this dimension gets FIX-WORDING
    or CUT. **The stated purpose: no suite we deliver can ever substantiate the "AI makes useless
    test cases" claim — every delivered suite carries the three-dimension tally as proof.** The
    suite SHIPS WITH that tally (usefulness headline current → recommended + sense counts +
    contradictions found/resolved + genuine/layman confirmation) + an honest "is the critic right?" answer covering BOTH halves of
    the claim (waste % AND makes-no-sense %); the audit only RECOMMENDS — no merge/cut/delete/edit
    is executed in TestRail without explicit user authorization (Rule 6). Also runs on demand for
    any existing suite and as a sub-step of major spec reconciliations. Rationale, 2026-07-28:
    Stefan Mitrovic (engineering manager) claimed 2026-07-27 there is "serious AI slop" — of the
    500+ Report Suite cases "maybe only 200 test cases are useful, the rest of them can be a
    waste", AI makes "more than 70% useless test cases", and (second half of the claim) "some
    tests just do not make sense"; the user directed: "we have to be very careful to make sure
    that he does not prove us wrong and him as right when he says that AI is making more than 70%
    useless test cases", "Regarding: ruthless usefulness audit — Please keep this approach always
    for all the test cases you create and it should be the part of the process", "Regarding
    Ruthless Audit: Stefan believes that some tests just does not make sense. So our audit should
    keep in mind that part of his claim too", and (the three-part permanent bar, 2026-07-28):
    "usefulness + sense together — Make it a permanent rule so that his claims can never be proven
    right. Our test cases need to be genuine, can be run by the manual QA guys and laymen who are
    non technical very easily and the rest of the rules you already know." Canonical example:
    build/report-suite/quality-audit-2026-07-28/ (Report Suite, 515 cases — usefulness audit +
    SENSE-CHECK-2026-07-28.md supplement, per-case-verdicts.csv with both verdict sets). Ties to
    Standing Rules 6/7/8/9/16/17/20/21.
29. **No-work-loss checkpoint discipline is permanent (all projects + side projects).**
    USER DIRECTIVE (2026-07-29, permanent): "you have to make sure that if we hit the daily
    limit we do not loose anything and this should be a permanent rule for every project or
    side project you work on". Every task — on every project AND every side project —
    commits + pushes durable work to git after EVERY completed step/phase; NEVER hold more
    than one phase uncommitted. Long runs (VIU passes, sweeps, audits, multi-batch pushes)
    checkpoint-commit MID-RUN, not just at the end. Before any known limit/reset risk, do a
    state-save: write the cold-resume block — what's DONE, what's IN FLIGHT (with its exact
    re-run recipe), what's AWAITING WHOM — into that project's PROJECT-STATE.md and push it.
    Every in-flight TestRail/Jira write sequence MUST be resumable: take pre-write snapshots
    + keep per-operation logs so a killed run can be verified against the live state and
    completed from exactly where it stopped (proven on the 2026-07-29 wave-completion — the
    killed worker's per-op log let the resume verify live TestRail and finish only the
    missing writes). The container and `/tmp` are EPHEMERAL — git is the ONLY durable store;
    `/tmp` secrets (cookies/tokens/OTP) are the ONLY acceptable loss, re-supplied by the user
    on resume (never committed, Rule 6/secrets rule). Detailed method =
    **build/NO-WORK-LOSS-STRATEGY.md** (golden rule, checkpoint granularity, resume anchors,
    in-flight kill recovery, pre-limit checklist, post-reset resume steps). Rationale: proven
    across the 2026-07-28/29 daily-limit hits — because every step was committed+pushed and
    state-saved, ZERO work was lost across the resets. Ties to Standing Rules 6/17/20 and the
    two-session shared-brain convention (CLAUDE.md + PROJECT-STATE.md are the resume anchors).
30. **Tech plan is a standard project input — remind the user if missing (all projects).**
    USER DIRECTIVE (2026-07-29, verbatim): "Also, going forward if I miss to provide you the
    tech plan for the project, please remind me of that. Save it as a rule". Every project's
    STANDARD INPUT SET includes the ENGINEERING TECH PLAN alongside the spec, designs, and
    epic/tickets. If the tech plan has not been provided at project start — or at the latest
    by the time authoring or a VIU pass begins — REMIND the user to supply it (do not
    silently proceed without asking). Tech plans STRENGTHEN test cases: they reveal edge
    cases, API contracts, and states/state machines the spec glosses over. But engineering
    intent NEVER overrules product truth from the spec/PO — where a tech plan conflicts with
    the spec/PO position, the conflict becomes a PO/dev QUESTION (Rules 7/11/15), never a
    silent case change. Canonical example: the 2026-07-29 tech-plan reconciliations —
    build/filters/tech-plan-2026-07-29/, build/report-suite/tech-plan-2026-07-29/,
    build/schedule/tech-plan-2026-07-29/. Ties to Standing Rules 1 (complete inputs before
    work), 11 (ask which process on new inputs), 17 (complete data in/out), and the
    new-project onboarding convention (tech plan is part of the required input set).
31. **Establish the CURRENCY OF EVERY SOURCE before doing ANYTHING on a project (all projects).**
    *(Originally "always pull the latest spec"; **STRENGTHENED 2026-07-31** to cover EVERY source;
    **SCOPE BROADENED 2026-07-31** from test-case work to ANY project task — the rule number is kept
    so existing cross-references stay valid.)*
    USER DIRECTIVE (2026-07-31, verbatim — the third and BROADEST statement of the same
    requirement): **"Going forward the first thing you do whenever you are about to do anything for
    your projects is to get the updated version of all the sources you have for that project and
    ONLY then do what you are asked to do."**
    Earlier directive (2026-07-31, verbatim): **"I want the test cases to be current with specs and
    epics and you must have the current version of epics and specs and every other doc you are
    using alwyas first make sure that you have the current source for the test cases before doing
    anything with the test cases."** Earlier directive (2026-07-31, verbatim): "everytime you are
    making the test cases or looking at the test cases for any reason make a rule that you pull the
    latest version of Specs from the URL, I see that the specs have been updated on 28th. But I
    believe you are unaware of that and due to that you left a few tests uncovered."
    **THE PRE-FLIGHT (MANDATORY — BEFORE DOING ANYTHING ON A PROJECT; the FIRST action of any
    project task, without exception) — establish and record the currency of ALL FIVE source types.**
    This covers **not only test-case work** (authoring / editing / auditing / reconciling /
    reviewing cases) but ALSO: **writing or revising PO/dev question sheets; status reports and
    management deliverables; audits; coverage analyses; TestRail pushes and run syncs; spec/epic
    reconciliations; bug investigations; and answering the user's questions about a project's
    state.** The sequence is FIXED: **(1) refresh every source → (2) diff against our baseline →
    (3) fold in any deltas → (4) only then do the thing that was asked.**
    **If a task looks trivial or read-only, the currency check is STILL first** — a stale answer
    about a project's state is as damaging as a stale test case (we once told the user a suite was
    current while its spec was 8 versions ahead).
    **(1) THE SPEC** — fetch it LIVE from its canonical URL (Confluence via the Atlassian MCP
    `getConfluencePage` when available, else the REST API with session cookies); compare the **live
    version number + last-updated date** against our ingested `requirements.md` baseline.
    **(2) THE EPIC AND ITS CHILD STORIES** — fetch the epic LIVE and compare the **story set +
    each story's status + description/comment changes** against our ingest; a **reopened** story or
    a **newly-Done** story CHANGES what must be tested, so this is never optional.
    **(3) THE DESIGNS** — the Figma file + node set (and any prototype/Claude design in play); **if
    a design-fetch queue is OPEN per Rule 35, the design source is NOT current and that must be
    STATED in the deliverable**, naming the shortfall.
    **(4) THE ENGINEERING TECH PLAN** (Rule 30) — confirm we hold the current version; if it was
    never supplied, remind the user.
    **(5) THE PO / STAKEHOLDER ANSWERS, MESSAGES AND VIDEOS** — the **newest authoritative product
    source wins** (Rule 32); a later PO answer can reverse an earlier ruling our cases still assert.
    If the live spec/epic/design/plan/answer is NEWER than our baseline, run the **diff FIRST** and
    fold the deltas in BEFORE doing the requested work (Rule 11 — ask which process).
    **EVERY DELIVERABLE MUST CARRY A "SOURCE-CURRENCY" BLOCK** stating, **per source**: the
    **identifier** (Confluence page id / epic key / Figma file + node ids / doc name), the
    **version-or-last-updated value**, the **date we checked it**, and a verdict of
    **CURRENT / STALE / PARTIAL** — e.g. *"designs PARTIAL — 12 of 85 frames pending, Rule-35 queue
    open"*. **No deliverable may claim completeness while ANY source is STALE**, and a **PARTIAL**
    source must name the **exact shortfall** (which frames/stories/sections are missing).
    **⚠️ STALENESS MARKERS ARE UNRELIABLE — VERIFY THE RIGHT ONE (two proven traps):**
    **(a)** a Confluence page's **BODY "Version" field can sit at 1.0 forever** while the real
    Confluence page version advances — this is exactly how the **Schedule spec drifted 5 versions**
    unnoticed; **use the CONFLUENCE VERSION NUMBER, not the version written inside the document.**
    **(b)** a Jira epic's **"updated" timestamp moves for purely ADMINISTRATIVE edits** such as a
    QA-Assignee change — on **2026-07-31 two epics looked changed when their content was identical**;
    **use the JIRA CHANGELOG (what actually changed), not the surface updated-date.**
    **If a source cannot be fetched, STOP and ASK THE USER for access** — never proceed on a
    possibly-stale copy, never fabricate content to appear complete (Rule 12).
    **RATIONALE (both incidents are the evidence):** the **Filters** spec was **8 versions behind**
    (we held **V1.0**, live was **v1.6**) and a QA reviewer (Ahtesham) found requirements with **NO
    coverage** as a direct result; the **Schedule** spec was **5 versions behind** (we held **v18**,
    live was **v23**) and a **PO answer had reversed an earlier ruling our cases still asserted**.
    This **STRENGTHENS Standing Rule 23** from "ask if unsure" to **"ALWAYS verify currency, for
    every source"**. Ties to Standing Rules 1 (complete inputs), 11 (ask which process), 12
    (observed, never inferred/fabricated), 17 (complete data in/out), 23 (check the Confluence
    spec), 30 (tech plan is a standard input), 32 (latest information wins), 33 (authority
    precedence), 35 (design-fetch queues).
32. **Latest information wins across ALL sources (all projects).** USER DIRECTIVE (2026-07-31,
    verbatim): "Rule of trusting something if it is duplicated or if figma says one thing and
    claud design says the other thing. Trust the latest information." When two sources disagree —
    spec vs Figma design vs a prototype/Claude-generated design vs a walkthrough video vs a PO
    message vs an engineering tech plan — **the MOST RECENT authoritative PRODUCT source wins**,
    and the case **records which source + date it follows**. Corollaries: **(i) DUPLICATION RAISES
    CONFIDENCE** — where the same thing appears in two sources and they AGREE, treat it as
    CONFIRMED; **(ii) engineering docs INFORM but NEVER OVERRULE product truth** from the spec/PO
    (Rule 30); **(iii) if the newest source is AMBIGUOUS or its recency cannot be established, ASK
    THE PO rather than pick a side** (Rules 7/11/15 — never silently choose); **(iv) ALWAYS state
    the source + date in the case metadata** so the next pass can re-evaluate. Proven precedent:
    the **Simple Flow "last-update-wins" contradiction rule** (spec `_3`/design `_4` overrode the
    earlier V2.4 doc + round-1 answer sheet) — this rule generalizes it to EVERY project and EVERY
    source type. Ties to Standing Rules 7/11/15/20/23/25/30/31.
33. **Review findings are INPUTS, not overrides — apply the authority precedence order (all
    projects).** USER DIRECTIVE (2026-07-31, verbatim): "Hold Ahtesham as the Junior most QA
    person, I do not want his findings to over rule me and your findings here. But we need to know
    if he is right at some point so that we can take advantage of his findings." **PRECEDENCE ORDER
    for resolving any disagreement about what a test case should say:** (a) the **PO's product
    ruling** (per project: **Branko** = Filters / Schedule / Global Search; **Chris Ward** = Report
    Suite / Fees & Discounts; **Milos** = Simple Flow) → (b) the **QA lead's (the user's) ruling** →
    (c) **our own live-observed, evidence-backed findings** (Rule 12) → (d) a **reviewer's / other
    QA's spec-reading claims** (e.g. Ahtesham, the most junior QA). Within the same tier, the most
    recent authoritative product source wins (Rule 32). **A reviewer's report is an INPUT to be
    EVALUATED CLAIM-BY-CLAIM on the evidence** — never an authority that reverses a PO or QA-lead
    ruling, and never dismissed either: **judge the claim, not the claimant.** **Where a review
    claim is CORRECT, ADOPT it and say so plainly** — that is the value of the review (e.g.
    2026-07-31: a junior QA's run review correctly exposed a real internal inconsistency in our own
    Filters run, and correctly flagged coverage that a stale-spec baseline had cost us). **Where a
    review claim CONTRADICTS an existing ruling, the RULING STANDS:** align the cases to the ruling,
    and note the reviewer's observation as the trigger that surfaced the inconsistency; escalate to
    the PO only if the underlying product question is genuinely open. **Never let a review claim
    silently reverse a recorded ruling** — every adoption/rejection is logged with its evidence
    (Rules 20/25). Canonical example:
    `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md`. Ties to Standing Rules
    7/11/12/15/20/25/31/32.
34. **Keep test runs in sync with the cases (all projects) — new/updated cases must appear in
    the existing run.** USER DIRECTIVE (2026-07-31, verbatim): "when we update or add test cases
    for any projects and we have a test run for them, make sure that those test cases also appear
    in the test run." **THE GOTCHA THAT CAUSES THIS:** a TestRail run does **NOT** auto-include
    newly added cases **unless the run was created with `include_all: true`**. A run built from a
    FIXED CASE SELECTION (`include_all: false` — which is how every per-project VIU run in this
    workspace was built) stays **FROZEN** at the selection it was created with. Therefore **every
    authorized `add_case` pass MUST be followed by a run-sync check** — it is the LAST STEP of
    every push manifest/execution log, not an afterthought. **METHOD:** (1) `get_run/{id}` → if
    `include_all` is **true**, new cases appear automatically — nothing to do, just VERIFY the test
    count equals the live case count. (2) If `include_all` is **false**: `get_tests/{run_id}` to
    derive the run's **CURRENT** case_id list, **UNION** it with the new case ids
    (`sorted(set(current) | set(new))`), then `update_run` with the **FULL UNION**.
    **⚠️ NEVER SEND A PARTIAL `case_ids` LIST — `update_run` REPLACES the selection, so a partial
    list DELETES the omitted tests AND THEIR RECORDED RESULTS.** This is the single most dangerous
    operation in the sync: **always union, and always snapshot the run's tests + results
    (`get_tests` + `get_results_for_run`) BEFORE writing**, then re-verify after (test count ==
    expected, every prior result still present). **The before/after check follows Standing Rule 50 —
    EXHAUSTIVE then EXACT: EVERY prior result verified present BY ID (no sampling), never by count
    alone, and the case_id sets proven equal in BOTH directions.** **Deleted/retired cases drop out of runs
    automatically** — so the sync is add-only; still **record the run's test count before→after in
    the audit log** (proven 2026-07-28: R359 went 515→458 when the consolidated cases were
    deleted). **Runs owned by other testers** (R359 = Nebojsa/Viktoria Report Suite; run 357 =
    Ayesha/Schedule; run 352 = Ahtesham/Filters; run 325 = Ayesha/Simple Flow; run 324 =
    Ahtasham/Fees & Discounts; run 278 = Custom Roles; note the old "run 312" no longer exists)
    **still require the user's EXPLICIT AUTHORIZATION before any run write (Rule 6 stands)** — and
    the case-sync must **never touch existing RESULTS**. Where a run belongs to a COMPLETED project
    or already holds graded results, ASK the user whether to sync it at all or to create a new run
    for the unrun cases (a "finished" run becoming incomplete is a reporting decision, not a QA one).
    **Rationale, 2026-07-31:** a junior QA's review of Filters run 352 reported "no case exists" for
    requirements we HAD already authored and pushed — the cases simply were not in his run.
    Out-of-sync runs cause **false coverage gaps and wasted review cycles**. Canonical audit +
    reusable read-only checker + union executor:
    `build/testrail-run-sync-2026-07-31/` (`RUN-SYNC-AUDIT.md`, `run_sync_audit.py`,
    `sync_runs_EXECUTOR.py`). Ties to Standing Rules 6/8/17/20/29/31/33.
    **SCOPE (see Rule 47, 2026-07-31): this sync duty applies to the THREE ACTIVE projects' runs
    ONLY — Filters 352 · Schedule 357 · Reports Suite 359; all other runs (other/completed projects,
    and run 278) are OUT OF SCOPE and are not synced, written to, or audited for missing cases.**
35. **Never leave design frames unfetched — auto-retry rate-limited Figma fetches until 100%
    complete (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"Do not forget to fetch
    the frames from Figma which you could not because of the limit reached issue. You do not need
    my authorization for that, for every figma frams which were/are left due to the rate limit
    auto set the timer to fetch them after 9 hours of the rate limit error time and date, set it
    as a rule permanently. And keep on repeating the same unless you fetch ALL the frames
    needed."* **THE RULE:** when a Figma (or ANY design-source) fetch is blocked by a rate limit
    — `HTTP 429 {"err":"Rate limit exceeded"}` on `GET /v1/images/{file_key}` is the usual one —
    **do NOT abandon it and do NOT ask permission to retry.** Instead: (1) record the exact
    MISSING node ids + the **UTC error timestamp** + the fresh `retry-after` in a
    **`PENDING-FIGMA-FETCH.md` queue file inside that project's design folder**; (2) set
    **DUE-AT = error time + 9 HOURS**; (3) re-attempt **at or after DUE-AT, automatically,
    without asking**; (4) if it fails again, **append the attempt to the queue's RETRY LOG and
    re-arm DUE-AT = new error time + 9 hours**; (5) **repeat until EVERY needed frame is
    downloaded.** "All the frames needed" means **100%, not "enough"** (Standing Rule 17
    completeness — no sampling, no "the important ones are done"). **WHEN TO CHECK THE QUEUE:**
    at **every session start**, and **before AND after any work touching that project or any
    design ingest**. **A design pass may NOT be reported as complete while a queue file is
    OPEN** — the deliverable (design notes + the project's PROJECT-STATE.md) must state the exact
    shortfall, e.g. *"73/85 PNGs; 12 pending, due-at 2026-07-30T23:27:02Z"*. **QUEUE FILE
    CONTENTS (convention):** OPEN/CLOSED status header with the check-and-run instruction · file
    key · the exact missing node ids + target filenames · the error timestamp (UTC) · DUE-AT ·
    the fresh `retry-after` for reference · the **exact resumable command** · a RETRY LOG table
    (attempt #, timestamp, outcome, frames obtained, still missing, `retry-after`, next DUE-AT)
    between `<!-- RETRY-LOG-START -->` / `<!-- RETRY-LOG-END -->` markers so the fetcher can
    append rows and re-arm DUE-AT itself · the post-success checklist (update the counts, the
    inventory's `png_source`, flag any NEW information the render reveals, close the queue).
    **INTERIM HONESTY:** missing frames are described from the **node tree** (their own visible
    TEXT layers, component/variant names, layer names) — **never guessed, never silently
    omitted** (Rules 12/17); the *nodes* endpoint is a SEPARATE budget from *images* and usually
    still works when images is capped, and `scale=1` is capped by the SAME budget (not a
    workaround). Any NEW information a late render reveals is recorded as a **FLAG** in the
    design notes — no test-case edit without user authorization (Rule 6). **HONESTY NOTE (say
    this plainly, don't imply magic): there is NO live scheduler or background timer across
    sessions/containers — the mechanism is this DUE-DATED QUEUE FILE plus the MANDATORY check at
    session start / before-and-after related work.** The fetcher must be **resumable and
    idempotent** (skip boards that already have a file, cache render URLs, work off the canonical
    frame inventory, runnable from any cwd) so a killed or rate-limited run costs nothing —
    canonical implementation `build/filters/design-2026-07-31/tools/fetch_all.py` (exit 0 =
    complete / 2 = rate-limited, queue re-armed / 3 = short for another reason). Design-source
    tokens stay in `/tmp` (`/tmp/figma-token`) and are **never committed**; `/tmp` is ephemeral,
    so on a fresh container ASK the user to re-supply the token, then continue the queue.
    **Rationale, 2026-07-31 (Filters):** the complete-Figma-extraction pass got 73 of 85 boards
    and the last 12 were blocked by a ~10.5 h image-endpoint cap; the user directed a permanent
    auto-retry so no design frame is ever quietly left behind. Canonical example:
    `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`. Method/recipe cross-reference:
    `build/APP-ACTIONS-PLAYBOOK.md` §M "Figma: extract ALL frames from a design link". Ties to
    Standing Rules 17 (complete data in/out), 27 (reuse recorded recipes), 29 (no work loss —
    the queue file is committed to git, the only durable store), 31 and 32 (latest source wins).
36. **Always remind the user of everything OUTSTANDING for each project — every report carries
    the asks (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"And keep on reminding me
    for anything which is missing for any project, like the epic is missing for some project the
    answers are missing for some project my go ahead is missing for some project OR anything which
    you had asked me to give you for that project that can be anything from give you a go ahead for
    something or provided you with a soure of something or to answer any of your squestion,m if
    anything is missing with the report of each project you will include that as a reminder for me
    to provide you with. The end goal is ALWAYS to make sure that our tests are 100% authentic."*
    **THE RULE:** EVERY project status report, management deliverable, and progress update MUST
    END with an **"OUTSTANDING — what I need from you"** section for that project. If nothing is
    outstanding, **say that explicitly** (*"Nothing outstanding"*) — **never omit the section**, so
    the user can always tell the difference between "clear" and "we forgot to check".
    **THE SIX CATEGORIES TO SWEEP EVERY TIME** (walk all six, every report — do not stop at the
    first one that has items): **(1) MISSING SOURCES** — spec/PRD not shared or stale, no epic in
    Jira, designs not provided or a Rule-35 Figma fetch queue still OPEN, tech plan not supplied
    (Rule 30), a promised video/changelog not delivered. **(2) UNANSWERED QUESTIONS** to a PO or to
    dev — name the sheet + the question number and who owes it, and **how long it has been
    outstanding**. **(3) MISSING GO-AHEADS / AUTHORIZATIONS** from the user — TestRail pushes,
    retirements, merges, deletions, run syncs, title-trim passes (Rule 6 means nothing moves
    without them). **(4) ACCESS / CREDENTIALS** needed — fresh staging or prod cookies, Atlassian
    access, a Figma token, a QuickBooks-connected company, a QA branch/env + flag state. **(5)
    DECISIONS THE USER DEFERRED OR HELD** — anything marked HELD, PENDING, or "your call".
    **(6) THINGS ANOTHER TEAM OWES** — a PO's spec correction, a dev fix, a missing ticket key, a
    stale Jira story.
    **EACH ITEM STATES FOUR THINGS:** *what is missing* · *who owes it* · **what it BLOCKS** (the
    concrete authenticity or coverage consequence, not a vague "needed for completeness") · *since
    when*.
    **ITEMS BLOCKED ON THE QA LEAD HIMSELF CARRY FIVE MORE — see Standing Rule 48:** any item that
    is *awaiting his authorisation*, *frozen by his ruling*, or *held by a decision he made* MUST
    also quote **which ruling (verbatim)** · **when he gave it and what question it answered** ·
    **the named cases it blocks (internal ID + C-id + link)** · **why the ruling was reasonable (or
    what has changed since)** · **the single thing that would unblock it, and from whom.** A bare
    *"awaiting your decision"* row is non-compliant — a ruling is a source, and sources get cited.
    **THE DURABLE REGISTER: `build/OUTSTANDING-ITEMS-REGISTER.md`** is the SINGLE cross-project
    source of truth for these asks — one section per project, a table per project, plus a one-line
    "what I most need from you". It is **updated whenever an item is RAISED or CLEARED** (same
    turn, like the PROCESS-CATALOG convention in Rule 21), and each project's `PROJECT-STATE.md`
    points at it. **Items are removed ONLY when genuinely satisfied** — never quietly dropped;
    cleared items move to the register's "Recently cleared" log with the date and how they were
    satisfied, so nothing can silently disappear and nothing gets re-asked (we have already
    embarrassed ourselves once by re-asking a question a source had answered). Predecessor
    snapshot kept for the record: `build/PROJECTS-NEEDS-2026-07-27.md`.
    **Reader-facing wording stays plain and layman (Rule 7)** — the outstanding section is written
    for a non-technical reader: what you need to give us, and what we cannot prove until you do.
    **RATIONALE:** the end goal is **100% AUTHENTIC tests**, and most authenticity gaps are things
    WE are waiting on — a missing epic means no ticket traceability (Rule 20 cannot be satisfied at
    all); an unanswered PO question means a case stays hedged/flagged rather than asserted; a
    missing QA branch means **nothing is live-verified** and the whole suite sits VIU-Pending (Rules
    12/22). Surfacing these every time is how the gaps get closed instead of quietly accumulating.
    Ties to Standing Rules 1 (never proceed without the complete input set), 6 (nothing written
    without permission), 12 (observed, never inferred), 20 (traceability/authenticity), 22 (ask for
    the live-build check + access up front), 30 (tech plan is a standard input), 31 (source
    currency), 33 (authority precedence) and 35 (the Figma fetch queue).
37. **Epics — ASK before a full re-read; if authorized, read them EXHAUSTIVELY (all projects).**
    USER DIRECTIVE (2026-07-31, verbatim): *"And for the EPics, since reading them from scratch is
    a long proess, ask me if you want me to get the updated epic version too. But if I ask you to
    do ye, then you need to check the epic open each ticket defect, bug, story and everything in
    that epic or related to that epic including the ticket/stories/bug/task titles/description/
    attached or inline images/comments and everything related to ALL the tickets."*
    This **REFINES Rule 31's epic step into two tiers** — it does not contradict it.
    **TIER 1 — THE CHEAP CURRENCY CHECK (part of the Rule-31 pre-flight; NO need to ask).** Fetch
    the epic + its child list and compare against our ingest: the **STORY SET** (any new or removed
    keys), **each story's STATUS**, and the **Jira CHANGELOG**. Verify the child count two
    independent ways (`parent = <epic>` and `"Epic Link" = <epic>`) with no paging remainder (Rule
    17). This is cheap and it is what proved **SV-8685 unchanged** and caught **SV-8582's 6
    reopened stories** on 2026-07-31. **If nothing moved, SAY SO plainly and proceed** — no full
    re-read, no question needed.
    **TIER 2 — THE FULL RE-READ (EXPENSIVE — ASK THE USER FIRST).** When the currency check shows
    **meaningful movement**, or when the task genuinely needs the epic's full content, **ASK the
    user whether to do a full epic re-read before starting it** — it is a long process and it is
    the most expensive ingest we do. **Never launch a full re-read unannounced, and never skip one
    the user has authorized.**
    **IF AUTHORIZED, "EXHAUSTIVE" MEANS EXACTLY THIS (Rule 17 completeness — state the totals
    found):** open **EVERY child ticket AND every related ticket** — linked issues, sub-tasks,
    defects, bugs, stories, tasks, **including tickets OUTSIDE the epic that link to it** — and for
    **EACH** one read: the **title**, the **FULL description**, **EVERY comment**, and **EVERY
    attachment INCLUDING inline images**. **Images must actually be DOWNLOADED and LOOKED AT — not
    merely listed by filename** — because screenshots routinely carry the real requirement or the
    real defect. Also read the **changelog**, the **status/resolution history**, and any **linked
    PRs/branches** referenced. **Report the exact counts** (tickets read / comments read / images
    viewed) and **quote the testable content VERBATIM** with its ticket key (Rule 25).
    **HONESTY CLAUSE:** if any part cannot be read — an attachment that will not download, a
    permission-blocked linked ticket, a truncated comment thread — **say precisely what was
    unreadable and why**. **NEVER present a partial epic read as complete** (Rules 12/17).
    **RATIONALE:** epic re-reads are the most expensive ingest we do, so they are **user-gated**;
    but a **PARTIAL one is worse than none**, because it produces false confidence about coverage.
    Canonical Tier-1 example: `build/epic-recheck-2026-07-31/` (both active epics currency-checked,
    170 SV epics enumerated to prove Filters has none). Ties to Standing Rules 1 (complete inputs),
    11 (ask which process), 12 (observed not inferred), 17 (complete data in/out), 22 (ask up
    front), 25 (verbatim citations), 31 (source currency) and 33 (authority precedence).
38. **FOREIGN test cases (created by someone other than us) are HANDS-OFF — identify, exclude from
    our counts, raise with the author (all projects).** USER RULING 2026-07-31: this hands-off
    approach is the CORRECT strategy and must be kept. **We NEVER edit, update, delete, move, or add
    to a run any case we did not author** — not to tidy a title, not to add `refs`, not to merge an
    apparent duplicate. **HOW TO TELL:** a case page's bottom-left **"People & Dates"** panel shows
    **Created** and **Updated** (name + date); via the API `get_case`/`get_cases` return
    **`created_by` / `updated_by` as user ids**, resolved with **`get_user/{id}`** (`get_users` is
    admin-only for our account). **We are user id 3 (Bilal Muzamil); id 1 = Vladimir Tomovic**, who
    authored the 5 automated Report Suite cases **C38919–C38923** found 2026-07-31. Supporting tells:
    **no `refs`** (ours always carry a Rule-20 reference), `template_id` 2 vs our 1, no expected
    results, titles over 80 chars, `custom_automation_type` unset — but **`custom_atmstatus` is NOT a
    tell** (3 = "Automated" on his cases and on 16 of ours). **REPORTING:** always state **BOTH
    numbers — "ours N / live total M"** (e.g. Report Suite = **ours 474 / live 479**) so our counts
    stay honest without claiming or hiding anyone else's work; per-project tallies count OURS only.
    **OVERLAP:** after any authorized push, re-check the group for new foreign cases and for overlaps
    with our cases (read-only checker
    `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`, method in
    build/APP-ACTIONS-PLAYBOOK.md §J), classify each as **DUPLICATE / AUTOMATED EQUIVALENT / NEW
    COVERAGE** on the assertion text, and **present the evidence rather than acting** — a duplicate
    is a QA-lead + author conversation (keep both / retire ours / their automation is redundant),
    never our unilateral decision. Where a foreign case CONTRADICTS one of ours about the build, that
    is a question for its author, not a licence to change either side. Canonical evidence pack:
    `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`. Ties to Standing Rules 6 (never write
    to TestRail without permission), 8 (always give the C-id), 17, 20, 25, 33 and 34.
39. **When someone else's test cases CONTRADICT ours, establish BOTH sides' sources and bring them
    to the QA lead (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"If what we have done
    is based on the specs/technical Plan/Loom Videos/Answers of the questins, then retain the latest
    information from our own sources, and if in future again the test cases of someone else
    contradicts with us, you need to come back to me with your sources and references and also you
    need to tell me here the otehr person who is creating the contradicting cases with ours is
    getting the reference to create those cases from"*.
    **DEFAULT POSITION — RETAIN OUR SOURCED LATEST INFORMATION.** Where OUR case is grounded in a
    legitimate source — **the spec, the engineering tech plan, a walkthrough/Loom video, or a PO's
    written answer** — we **KEEP our latest information** and do **NOT** change the case merely
    because another author's case disagrees. Another author's disagreement is not evidence.
    **BUT EVERY SUCH CONTRADICTION IS ESCALATED TO THE QA LEAD — NEVER RESOLVED SILENTLY**, and the
    escalation MUST put **BOTH SIDES** on the table: **(a) OUR source and reference** for the
    assertion — the **named document, its version, the section/anchor, and the date**; and **(b) WHAT
    SOURCE THE OTHER AUTHOR BASED THEIR CASE ON** — and this must be **ACTIVELY ESTABLISHED**, not
    shrugged at: their case's `refs` if it has any, **the spec version that was live on the date they
    authored it** (compare their created/updated timestamps against the spec's version history), the
    ticket / branch / build they were working from, the shipped-build behaviour their automation runs
    against — **or ASK THEM DIRECTLY**. **"Unknown" is only acceptable AFTER asking.**
    **RESOLUTION ORDER IS UNCHANGED:** Rule 33 (PO ruling → QA-lead ruling → our live-verified
    findings → another's claim) and Rule 32 (**newest authoritative product source wins**). A
    contradiction is **NEVER settled by seniority, job title, or who wrote first** — it is settled by
    **whose source is the most recent authoritative one**, which is precisely why **both bases must be
    visible** before anyone decides.
    **NEVER EDIT, DELETE OR MOVE THE OTHER AUTHOR'S CASES** (Rule 38 stands, absolutely) — we
    **present evidence** and let the **QA lead and the author** decide.
    **ALSO CHECK OUR OWN NEWER SOURCES FIRST.** An apparent conflict with another author is often
    **our own older case contradicting a newer ruling WE OURSELVES already ingested** (a spec version
    bump, a PO answer, a video). **Verify that before attributing the disagreement to anyone** — the
    honest outcome is frequently *"they are right, and our case is stale against our own source"*.
    Report which of the three it is: **(i) no change to ours** · **(ii) ours needs updating because
    of OUR OWN newer source** · **(iii) genuinely unresolvable without a PO ruling**.
    **RATIONALE, 2026-07-31:** Vladimir Tomovic's automated case
    **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** asserted a **Location
    column in the SBR CSV exports** while two of our cases — **SBR-EXP-10 =
    [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and **SBR-EXP-11 =
    [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** — stated the CSV headers
    were *"exactly"* a list **without it**. On inspection the likelier cause was **OUR OWN older
    cases not yet reflecting the 2026-07-29 SBR spec v15 export ruling (S14-R20)**, not a mistake by
    the other author. Canonical evidence pack:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md`. Ties to Standing Rules 12
    (observed, never inferred), 20 (traceability), 25 (verbatim citation of the source deviated
    from), 32 (latest source wins), 33 (authority precedence) and 38 (foreign cases are hands-off).
40. **A requirement that spans SURFACES must be traced across EVERY surface — produce a surface
    matrix, not a case list (all projects).** A requirement almost never lives on one screen. When a
    requirement, PO ruling, spec delta, or design change is applied, **ENUMERATE THE SURFACES IT CAN
    TOUCH and give EACH ONE ITS OWN VERDICT** — "applied" is not an answer, and neither is a list of
    the cases you happened to edit.
    **THE SURFACE CHECKLIST (walk ALL of it, every time; mark N/A explicitly rather than skipping):**
    **on-screen** (the grid/list/table/detail view) · **PDF export** · **CSV export** (and any other
    download format) · **print view** · **API / response payload** · **mobile / responsive layout** ·
    **email or scheduled delivery** · **column/field selector or settings surface** · **filter and
    sort surfaces** · **empty / error / zero-state**. Add any surface the project has (a portal, a
    terminal, a QuickBooks push, a document template).
    **PER SURFACE, EXACTLY ONE VERDICT:** *covered by case X (internal ID + C-id)* · *case X extended
    (name the field changed)* · *new case authored* · *not applicable (state WHY, from the spec)* ·
    *blocked (state the blocker)*. **The change-list / delta deliverable MUST SHOW THE SURFACE MATRIX**
    — requirement anchor down the side, surfaces across the top — so a reader can see at a glance
    that no surface was left unexamined. A delta document that names only the cases it touched is
    **incomplete by definition** and may not be delivered.
    **THE TELL TO WATCH FOR:** a requirement whose own text says *"…in all four exports"*, *"every
    download"*, *"wherever it is shown"*, *"and in the API"*, *"on screen and in print"* is
    **explicitly multi-surface** — those phrases are a hard trigger for this rule. Also treat any
    requirement that CROSS-REFERENCES another requirement (*"in the same position it occupies on
    screen (S21-R7)"*) as multi-surface: the cross-reference is the surface link.
    **RATIONALE (2026-07-31 — the worst defect of the day, and it was ours):** the 2026-07-29
    suite-wide **Location column** ruling was worked through
    `build/report-suite/chris-answers-2026-07-31/DELTAS.md` **D11**, which authored **six new
    ON-SCREEN cases** (SBC-LOC-04 = C38912, SBR-LOC-05 = C38913, PV-FILT-14 = C38914, TU-LOC-06 =
    C38915, WIP-FLT-09 = C38916, IV-LOC-06 = C38917) and **never revisited the EXPORT cases** — the
    anchor **`S14-R20`** appears **nowhere in DELTAS.md** (verified: 0 occurrences). Consequence:
    **SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and
    **SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** kept
    enumerating CSV headers *"exactly"* **without** Location, so a tester on a correct multi-location
    build would have **failed a passing build**. The **same on-screen/export split** existed on three
    more reports — PV **S6-R11**, TU **S7-R13**, IV **S10-R15** (each export case covered only the
    `"Locations:"` metadata line). **We did not find it by auditing; we found it because an automation
    engineer's case disagreed with ours** (Rule 44). Evidence:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` +
    `build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` rows 2–5. Ties to
    Standing Rules 17 (complete data in/out), 20 (traceability), 28 (the audit's Stage-2b sweep now
    groups by requirement anchor and checks every surface it names), 31 (source currency), 41
    (re-verify a whole case when you touch it) and 43 (per-requirement coverage verdicts).
41. **Touch a case, RE-VERIFY THE WHOLE CASE — there are no surgical edits (all projects).** Any test
    case you open for **ANY** reason — a one-word label rename, a title trim, a `refs` backfill, a
    merge, a note addition, a status flip — gets **RE-READ END-TO-END against the CURRENT spec before
    it is saved**, and its `refs` re-validated. **Opening a case is the cheapest opportunity we will
    ever get to catch that it is stale; a surgical edit throws that opportunity away and, worse,
    stamps the case with a fresh "Updated" date that makes it LOOK current.**
    **METHOD (checkable — the pass must be able to prove it did this):** per touched case, record in
    the execution log a line **"re-verified whole against `<spec document + version + date>`"** plus
    the fields checked — **title · preconditions · steps · expected results · refs · notes** — and
    any second finding the re-read produced. **A push log whose entries name only the edited field is
    non-compliant.** **The re-read follows Standing Rule 50 — EXHAUSTIVE then EXACT: EVERY field
    (title · preconditions · every step · every expected result · refs · section · type · notes), not
    only the one being edited; the case text byte-compared against the current spec text; and every
    field the pass did NOT intend to change proven byte-identical to its pre-write snapshot.** Where the re-read finds a further problem the pass was not chartered to fix,
    **RECORD IT** (in the manifest and the Outstanding register) rather than silently leaving it;
    where it finds nothing, the recorded line is the positive evidence that it was looked at.
    **RATIONALE (2026-07-31):** **SBR-EXP-10 = C30285** and **SBR-EXP-11 = C30286** were touched that
    same day — **ops 46 and 47** of the authorized push
    (`build/report-suite/chris-answers-2026-07-31/testrail-execution-log-2026-07-31.md`) — **purely to
    apply Chris's Q5 `Sales Rep` → `Sales Representative` rename on the first header**. The pass had
    both cases open, edited the very line that lists the headers, and **did not notice the header LIST
    itself was already stale** against `S14-R20`. One end-to-end re-read of either case would have
    caught the day's worst defect hours earlier and for free. Ties to Standing Rules 20, 28, 31, 40
    and 43.
42. **NO ABSOLUTE ENUMERATIONS without a version-pinned anchor — prefer scope-conditional wording
    (all projects).** A closed list in an expected result is a **time bomb**: it is correct until the
    spec adds one item, and then it makes a tester **fail a correct build**. Any expected result that
    CLOSES a list — *"the headers, in order, are exactly …"*, *"the options are exactly …"*, *"only
    these columns appear"*, *"the menu contains exactly …"*, *"no other field is shown"* — MUST:
    **(a) CITE ITS GOVERNING REQUIREMENT + THE SPEC VERSION in `refs`** (Rule 20 format, extended
    with the version: `<TICKET(S)> (<spec-anchor>, spec v<N> <date>)`), so that when that requirement
    changes, **every case citing it is re-checked** (this is what makes the same-anchor clustering in
    Rule 28's Stage 2b actually work); and
    **(b) BE WRITTEN SCOPE-CONDITIONALLY WHEREVER THE SPEC MAKES THE LIST CONDITIONAL** — prefer
    **"includes X in position Y when Z"** (plus, where useful, "and is absent when not-Z") over a
    closed list. Only keep a closed list when **the closed list IS the requirement** (the spec itself
    says "exactly these and no others") — and then say so in the case notes, citing the anchor.
    **Give the tester the plain conditional too** (Rule 7), e.g. *"If you are looking at only one
    location there is no Location column — that is correct."* — otherwise a correct build reads as a
    failure to a layman tester.
    **SWEEP DUTY:** the word **"exactly"** (and "only", "no other", "the complete list") in a
    tester-facing field is a **grep-able audit target**; every hit must show a version-pinned anchor
    or be rewritten. This is a Dimension-2 fail condition in Rule 28.
    **RATIONALE (2026-07-31):** *"The headers, in order, are **exactly**: Sales Representative,
    # Invoices, …, Subtotal."* (SBR-EXP-10 = C30285, and its twin C30286) **broke the moment the spec
    added a column** — `S14-R20`, 2026-07-29. The enumerations dated from the **2026-07-11** "Exports
    hardened" change and the cases' `refs` cited only **S14-R15 / S14-R16 / S14-R18**, so nothing
    connected them to the requirement that changed. Ties to Standing Rules 7 (plain tester wording),
    20 (refs), 25 (verbatim citation), 28 (Dimension 2), 32 (latest wins), 40 and 43.
43. **Spec-diff processing must emit a PER-REQUIREMENT COVERAGE VERDICT — a narrative summary is not
    acceptable (all projects).** For **EVERY** added / changed / removed requirement in a spec diff,
    the deliverable carries **its own explicit ROW**: the **requirement id** + the **VERBATIM
    requirement text** → **one** verdict from: **covered by case(s)** (internal ID + C-id) ·
    **case extended** (name the case + the field changed) · **new case authored** (or *authoring
    proposed, awaiting authorization*) · **not independently testable** (state the reason — e.g. it
    is rationale prose, or it duplicates another requirement's assertion) · **blocked** (state the
    blocker and who owns it). **The diff pass is NOT COMPLETE until every row has a verdict**, and
    the row count must reconcile with the number of deltas the diff itself found (state both totals —
    Rule 17).
    **COVERAGE MATRICES ARE RE-DERIVED PER SPEC VERSION, NEVER INCREMENTALLY PATCHED.** Rebuild the
    requirement → case map from the CURRENT spec body and the CURRENT case source every time, and run
    it in **BOTH directions**: requirement → case(s) (finds uncovered requirements) **and** case →
    requirement (finds cases whose anchor no longer exists, i.e. orphaned or stale-anchored cases).
    Patching last version's matrix preserves last version's blind spots — which is exactly how this
    rule was earned.
    **RATIONALE (2026-07-31):** **`S14-R20` WAS PRESENT** in our own v15 spec diff
    (`build/report-suite/spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md` §2.2 lists it explicitly)
    and yet **appears NOWHERE** in the deltas document that acted on that diff
    (`chris-answers-2026-07-31/DELTAS.md` — 0 occurrences). **The narrative summary let a
    correctly-detected requirement slip between detection and action**, and it took a **formal
    re-derivation** (`build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md`)
    to surface it — along with the same gap on **PV S6-R11, TU S7-R13, IV S10-R15**. A per-requirement
    verdict table makes that class of slip structurally impossible: an un-verdicted row is a visible
    hole. Ties to Standing Rules 11 (ask which process), 15 (verbatim truth-table), 17, 20, 31, 40
    and 42; the required table format lives in
    `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` step 1.
44. **Another author's CONTRADICTING case is a BUG REPORT AGAINST OUR SUITE until disproven (all
    projects).** When anyone else's test case — automation or manual, senior or junior, referenced or
    unreferenced — disagrees with one of ours, the **FIRST** move is **NOT** to defend ours or to
    question theirs. It is to **RE-DERIVE OUR OWN POSITION FROM THE CURRENT SOURCES**: re-pull the
    spec (Rule 31), find the governing requirement, read it verbatim (Rule 25), and check the DATE of
    the text our case actually cites. **If our source is stale or was misread, OURS IS THE DEFECT and
    we fix ours** — and we say so plainly. **Only after our side is verified sound** does the
    disagreement become a question to them, escalated with **both sides' sources** per Rule 39.
    **NEVER dismiss the other case on grounds of seniority, authorship, job title, automation-vs-
    manual, or ABSENCE OF REFERENCES.** A missing `refs` field is a **traceability** shortcoming of
    their case; it is **not evidence about the build**, and it must never be used as the reason to
    wave the disagreement away. Rule 38 still stands absolutely: **we do not touch their cases** — we
    fix ours and present the evidence.
    **RATIONALE (2026-07-31 — the uncomfortable one):** Vladimir Tomovic's automated
    **[C38923](https://shopview.testrail.io/index.php?/cases/view/38923)** ("SBR Summary and Expanded
    CSV exports carry the Location column at its designated slot") was **RIGHT**, and **our two cases
    — SBR-EXP-10 = C30285 and SBR-EXP-11 = C30286 — were WRONG, against OUR OWN spec** (SBR v15
    `S14-R20`, live since 2026-07-29, one day before he authored). **His case carried NO `refs` at
    all** — precisely the signal we might have used to dismiss it. It was the only thing that exposed
    a four-report export gap. Evidence:
    `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` +
    `build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`. Ties to Standing Rules 12, 25, 31, 32,
    33 (precedence — judge the claim, not the claimant), 38, 39, 40 and 43.
45. **OUTSIDE-IN GAP HUNT — before any suite is declared current, deliberately look at it from
    OUTSIDE (all projects).** USER DIRECTIVE (2026-07-31, verbatim): *"Also I need to fill the GAP,
    Vlad should not have been able to find the missing cases, how did we miss them and what have we
    learned from that? How will we ensure that we will not miss creating those cases which Vlad picked
    up. Learn from that and add to your strategy anything which should be the part of your learning to
    never miss any test cases to be created which others can raise like Vlad did today."*
    **THE RULE:** a suite may **NOT** be reported as current, complete, or audited-clean until it has
    been examined from a position **other than our own**. Rules 40–44 force us to follow through on
    what WE detected; this rule exists because **we had no way to notice that an outsider could see
    something we could not.** All five checks below run, and the suite's deliverable **states the
    result of each one** — "not applicable" is a permitted answer, silence is not.
    **(a) FOREIGN-COVERAGE DIFF, IN BOTH DIRECTIONS.** The overlap direction ("which of THEIR cases
    duplicate OURS") is `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`. The
    REVERSE direction — **assertions in other authors' cases with NO counterpart in ours** — is
    `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` (READ-ONLY, `get_*` only). **Their case
    existing where ours does not is a COVERAGE SIGNAL, not a nuisance.** Every foreign assertion gets
    one of three labels — **COVERED-BY** (name our case ids) · **CANDIDATE GAP** · **CONTRADICTS-OURS**
    — and every CANDIDATE GAP / CONTRADICTS row is **carried into the deliverable with its evidence**.
    **Foreign cases stay untouched in every scenario (Rule 38); a candidate gap is authorised by the
    QA lead, never authored on our own initiative (Rule 6).**
    **(b) THE AUTOMATION-ENGINEER LENS.** For each requirement ask: *"if I were automating this from
    the RUNNING BUILD, what would I assert?"* — then check we have a case for it. An automation
    engineer must assert what a system actually emits; he cannot write a header list he has not seen.
    **HONESTY, per Rule 12: WITHOUT A QA BRANCH this lens is limited to what the DOCUMENT says, and
    that limit must be stated in the deliverable.** It is also itself an **OUTSTANDING ASK** (Rule 36)
    — the largest single reason an outsider working from the build can out-see us.
    **(c) THE HOSTILE-REVIEWER LENS.** An explicit *"what would a reviewer claim is missing?"* pass
    **before** delivery, not after the challenge arrives. Its output is the Rule-46 register.
    **(d) EVERY EXTERNAL SIGNAL IS A COVERAGE INPUT, NEVER MERELY A REPLY.** A reviewer's report, a
    colleague's test case, a support ticket, a dev comment, a customer complaint, a PO aside — each is
    **LOGGED and DIFFED against the suite**, not just answered. On 2026-07-31 **two reviews and one
    foreign case each surfaced something real**; answering them would have fixed three sentences and
    left the defects in place.
    **(e) A "COVERED" VERDICT IS ONLY VALID WITH BOTH TEXTS QUOTED SIDE BY SIDE — and a requirement
    making MORE THAN ONE ASSERTION GETS ONE ROW PER ASSERTION.** This is the mechanical clause; the
    other four are lenses. *"Covered by C30277"* is **unfalsifiable as written**, so no reviewer ever
    tests it. Any coverage / NO-CHANGE / "provably fine" verdict must show **the requirement's verbatim
    text** beside **the covering case's verbatim expected-result text**, and where a requirement
    asserts two things (a column **and** a metadata line; on screen **and** in the export) **each
    assertion is verdicted separately.** **Checkable test of compliance: a NO-CHANGE entry that names
    only case ids, with no quoted text, is non-compliant and the pass is not done.**
    **RATIONALE (2026-07-31 — the failure this rule exists for):** SBR spec v15 `S14-R20` (live
    2026-07-29) makes **two** assertions — the per-row Location **column** in all four exports, **and**
    a `"Locations:"` metadata **line**. Our deltas pass
    (`build/report-suite/chris-answers-2026-07-31/DELTAS.md`) **did examine the export surface** and
    filed it under **"NO-CHANGE (checked, provably fine — not skipped)"** entry **N2**, listing seven
    case ids that cover the **line** — thereby certifying the **column** as done. That is a **false
    all-clear, which is worse than a blind spot because it stops anyone looking again**. `S14-R20`
    appears **nowhere** in that document (0 occurrences). Consequence: **SBR-EXP-10 =
    [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and **SBR-EXP-11 =
    [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** kept enumerating CSV headers
    *"exactly"* without Location, and the identical split existed on **four more reports** — SBC
    `S4-R13`, PV `S6-R11`, TU `S7-R13`, IV `S10-R15` (**five reports in total**; WIP was covered by
    WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)). **We did not find
    it by auditing. We found it because Vladimir Tomovic's automated
    [C38923](https://shopview.testrail.io/index.php?/cases/view/38923) — which carried NO `refs` —
    disagreed with ours.** The reverse checker reproduces the catch from cold: for C38923 it narrows
    **474 of our cases to 8 candidates** with C30285 and C30286 ranked **3rd and 4th**. Full analysis
    (timeline, five-whys, and the honest finding that **Rule 42 would NOT have fired here** because the
    invalidating requirement was a NEW anchor arriving in the same spec version):
    `build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`; live output
    `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md`. Ties to Standing Rules 6 (nothing
    written without permission), 12 (observed, never inferred), 17 (complete data in/out), 22 (ask for
    the live check + access up front), 28 (the audit's outside-in stage), 31, 33 (judge the claim, not
    the claimant), 36 (the QA-branch ask), 38 (foreign cases hands-off), 39, 40, 41, 43, 44 and 46.
46. **EVERY SUITE SHIPS ITS DELIBERATE-DECISIONS / ANTICIPATED-CHALLENGE REGISTER (all projects).**
    **THE RULE:** every **deliberate non-authoring**, every case that **follows a PO ruling over spec
    text**, every **HELD / open / awaiting-answer** item, and every **accepted imperfection** is
    **WRITTEN DOWN — with its evidence and a plain one-sentence answer — BEFORE anyone asks.** The
    register ships **with** the suite, as a required deliverable of every authoring, audit,
    reconciliation and push pass; a suite delivered without one is incomplete.
    **REQUIRED CONTENT, per entry (all six fields, every entry):** **(1)** the decision, in plain
    layman words (Rule 7); **(2)** the **plain one-sentence answer** a non-technical reader can paste
    straight into a public channel; **(3)** the **evidence** — document, version, anchor, date (Rules
    20/25); **(4)** the **affected cases** with internal ID **and** C-id **and**
    `https://shopview.testrail.io/index.php?/cases/view/<id>` link (Rule 8); **(5)** **who can close
    it** (PO / QA lead / dev / a live check); **(6)** an honest **RISK rating** — and read that column
    honestly: **HIGH does not mean we are wrong, it means if this is raised publicly we have a
    concession to make, not just an explanation.**
    **THE CATEGORIES TO SWEEP** (walk all of them; "none" is a valid entry, omission is not):
    requirements not authored **because the spec contradicts itself** · cases that **follow a PO ruling
    over the spec text** · requirements **deliberately not authored for other reasons** · items **open,
    awaiting a PO or dev** · things that **cannot be settled without a live build** · **foreign-case
    overlaps** (Rule 38/45a) · **known imperfections accepted or scheduled**.
    **HONESTY CLAUSE:** the register records what we **decided**, never what we **wish we had
    decided**. A defect discovered late goes in as a defect — dated, with the cost stated — not
    re-labelled as a deliberate choice. **Back-dating a miss into the register is the one thing that
    would make it worthless.**
    **RATIONALE:** the QA lead must **never be blindsided in a public channel by a decision we made on
    purpose**, and — the sharper half — **an undocumented deliberate omission is indistinguishable from
    a miss.** On 2026-07-31 entry **N2** of
    `build/report-suite/chris-answers-2026-07-31/DELTAS.md` was written in the exact register of a
    considered decision — a numbered NO-CHANGE entry, seven case ids, a stated reason — and was an
    **error**; nothing in the deliverable let a reader tell the two apart, because no NO-CHANGE verdict
    was required to show its working (now Rule 45(e)). Canonical examples:
    `build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md` (Report Suite, 474
    cases — 7 categories, risk profile HIGH 3 · MEDIUM 7 · LOW 25) and the cross-project
    `build/qa-preemptive-answers-2026-07-31/`. Ties to Standing Rules 6, 7 (plain layman wording), 8
    (always give the C-id + link), 12, 17, 20, 25, 28 (a required audit deliverable), 33, 36 (the
    outstanding register is its waiting-on-others sibling), 38, 43 and 45.
47. **TEST-RUN SCOPE — we keep OUR ACTIVE projects' runs COMPLETE, and IGNORE every other run
    entirely (all projects).** **IN SCOPE = the runs of the projects we are actively working, and
    only to keep them COMPLETE:** every ACTIVE case in that project's suite must be present as a
    test in that project's execution run. The three active runs are **Filters run 352 · Schedule
    run 357 · Reports Suite run 359**. Keeping them complete is a **STANDING DUTY, re-checked
    whenever cases are added, edited or retired** — not a one-off task (this is the scoped
    application of Rule 34).
    **METHOD — UNION-ONLY, per Rule 34:** `update_run` **REPLACES** the run's selection, so a
    partial `case_ids` list **DELETES the omitted tests AND their recorded results**. Therefore:
    **SNAPSHOT `get_tests` + `get_results_for_run` BEFORE any write**, send the **FULL UNION**
    (`sorted(set(current) | set(new))`), then **VERIFY AFTER** — test count equals the expected
    figure and **every prior result is still present**. Record the run's test count before→after in
    the audit log. Run writes still need the user's explicit authorization (Rule 6).
    **OUT OF SCOPE — IGNORED ENTIRELY:** runs belonging to **other projects**, to **COMPLETED
    projects (run 324 Fees & Discounts · run 325 Simple Flow)**, or **created by another author for
    work we are not doing** — specifically **run 278 (Vladimir Tomovic's Custom Permissions run)**.
    Ignored means **not synced, not written to, and NOT AUDITED for missing cases**: we do not
    measure ourselves against them and we do not produce gap reports about them.
    **WHAT OUR COVERAGE IS MEASURED AGAINST:** the **CASE SUITE under our group** — **never** anyone
    else's run selection. A foreign run's contents are **not evidence about our suite**; if a
    reviewer reports cases "missing" from their run, **that run's selection is theirs to manage**,
    and the honest answer is to point at the suite (Rule 8: internal ID + C-id + link).
    **DISTINCT FROM RULE 38:** foreign **CASES** are governed by Rule 38 (report, never touch);
    this rule governs foreign **RUNS**. **Both stand** — neither weakens the other.
    **RATIONALE, 2026-07-31:** the QA lead ruled *"ignore any test run which is not created by Bilal
    Muzamil"*, then **clarified the same day** that the three active projects' runs must still
    contain **every** test case, *"like it happened with filters yesterday"* — a frozen run selection
    on Filters 352 made a reviewer see coverage gaps that **did not exist**. **The earlier blanket
    "ignore all foreign runs" reading was CORRECTED by him; both instructions are recorded here so
    neither half is lost.** Canonical papers: `build/testrail-run-sync-2026-07-31/` (`RUN-SYNC-AUDIT.md`,
    `RUN-278-DECISION.md` — now SUPERSEDED/out-of-scope, `RUN-COMPLETENESS-CHECK-2026-07-31.md`).
    Ties to Standing Rules 6 (no TestRail write without permission), 8, 12 (a completeness check not
    run is NOT VERIFIED), 17 (100% of the case list, no sampling), 32/33 (latest ruling wins), 34
    (the sync mechanism this scopes), 36 and 38.
48. **NEVER say "waiting on you" or "frozen by your ruling" without the CONTEXT — quote the ruling,
    date it, and say whether it was right (all projects).** USER DIRECTIVE (2026-07-31, verbatim):
    *"SO when you say that something is waiting on me or forzen by my own ruling always give a
    context with that too just like you gave this context: 'The ruling was yours, two messages ago.
    I asked what it would take to apply each staged group, and you answered: "Lets wait for Brankos
    answers." So they're frozen deliberately — and it was the right call, because applying them
    means asserting behaviour no written source supports.'"*
    **THE RULE:** whenever a deliverable, status report, chat reply, register row or OUTSTANDING
    section states that something is **blocked on the QA lead**, **frozen by his ruling**,
    **awaiting his authorisation**, or **held by a decision he made**, it MUST carry **ALL FIVE** of
    the following — **never a bare "awaiting your decision"**:
    **(1) WHICH RULING** — quote his words **VERBATIM**. **Rule 25 applies to his instructions
    exactly as it does to a spec.**
    **(2) WHEN he gave it, and IN WHAT CONTEXT** — what question he was answering; a ruling read
    without its question is easy to misremember as arbitrary.
    **(3) WHAT IT BLOCKS, concretely** — the **named cases** (internal ID + C-id +
    `https://shopview.testrail.io/index.php?/cases/view/<id>` per Rule 8), the deliverable, or the
    **specific coverage claim we cannot make**.
    **(4) WHY THE RULING WAS REASONABLE** — or, honestly, **what has CHANGED since that makes it
    worth revisiting.** The point is that he can **re-read his own decision and see the reasoning
    without reconstructing it**. **Never imply his ruling is the obstacle when it was the correct
    call**; and **never quietly carry a stale ruling forward when new information has superseded it
    — say so.**
    **(5) WHAT WOULD UNBLOCK IT** — the **single specific thing** needed, and **from whom**.
    **THE UNDERLYING PRINCIPLE, PLAINLY: A RULING IS A SOURCE, AND SOURCES GET CITED.** We already
    require this for specs, PO answers, tickets and designs (Rules 20/25/32); **the QA lead's own
    decisions are held to the same standard.** **A blocked item with no cited ruling is
    indistinguishable from us having forgotten to do the work** — the same failure mode **Rule 46**
    exists to prevent for deliberate omissions.
    **RATIONALE, 2026-07-31:** a status line said *"roughly 15 changes are queued but frozen by your
    own ruling"* **without naming the ruling, its date or the cases**, and the QA lead had to ask
    *"Which ruling and what are those cases?"*. When the context **WAS** given — the ruling quoted,
    the question it answered, and why it was the right call — he directed that **this become the
    standard for every such statement**. Canonical examples: the Filters frozen-items row and the
    completed-runs row of `build/OUTSTANDING-ITEMS-REGISTER.md`. Ties to Standing Rules 7 (plain
    layman wording), 8 (always give the C-id + link), 12 (observed, never inferred), 25 (verbatim
    citation of the source), 32 (latest source wins), 33 (authority precedence — a ruling outranks a
    reviewer claim, which is exactly why it must be citable), 36 (the outstanding register carries
    these five fields for QA-lead-blocked items) and 46 (an undocumented deliberate decision is
    indistinguishable from a miss).
49. **A NON-FINAL BUILD yields PROVISIONAL findings ONLY — record the build marker, queue every
    finding for re-check, and never report a suite VIU-complete against it (all projects).**
    USER DIRECTIVE (2026-08-03, verbatim — on the Report Suite QA branch `sv8582`): *"they have also
    told they this QA Branch is also not final they are still working on it. So whatever you change
    from it, make sure that you will have to recheck it in future to ensure that what you had learned
    from this QA branch is still true or if that has been changed."*
    **THE RULE:** when a build/branch/environment is declared **NOT FINAL** by engineering, the PO or
    the QA lead, **every** observation taken from it — a captured on-screen label, a column order, a
    calculation result, a permission verdict, a PASS/DEVIATION call — is **PROVISIONAL**, not settled.
    A provisional finding may still be acted on (wording corrections, verdicts, staged pushes), but it
    is **never treated as durable truth** and it is **never allowed to look durable**.
    **THE FOUR OBLIGATIONS (all four, every time):**
    **(1) RECORD THE BUILD MARKER.** Capture a concrete, re-readable identifier of the exact build
    observed and put it in the deliverable: the app's version string (ShopView SPA:
    `<meta name="app-version">` in `index.html`, e.g. `v3.4.1-0ed4433`), plus a corroborating marker
    (`last-modified`/`etag` on `index.html`, or the API's `x-request-id`/server banner) and the
    **UTC timestamp of observation**. **Without a build marker a "re-check" is meaningless — you
    cannot tell whether the build changed.**
    **(2) OPEN A DATED RE-CHECK QUEUE — the same mechanism as the Rule-35 design-fetch queue.**
    One file per pass, `RECHECK-QUEUE.md`, inside that pass's dated folder, with a **status header of
    OPEN or CLOSED** and **one row per case touched or verdicted**, each carrying: internal ID · C-id ·
    the `https://shopview.testrail.io/index.php?/cases/view/<id>` link (Rule 8) · **what was observed**
    · **what was changed or concluded** · the **date + build marker** · and the **re-check obligation**
    (what specifically must be re-confirmed when the build settles). **Honesty about the mechanism
    (as with Rule 35): there is NO background scheduler — the queue is a committed, dated file plus
    the mandatory check below.**
    **(3) STAMP THE PROVENANCE ON THE CASE ITSELF** — in the **notes/metadata layer, never the
    tester-facing fields** (Rules 9/20): the observation came from a **non-final build**, naming the
    build marker and the date. A future reader must not mistake a provisional label for a confirmed
    one. **THE MECHANISM FOR THIS IS STANDING RULE 54 (added 2026-08-04): the case's PROVENANCE LINE
    under Expected Results IS where the build marker lives on the case** (this project has no Notes
    field), and **re-stamping that line is part of re-running the queue** below — a row re-checked
    without its provenance line re-stamped is not re-checked.
    **(4) NEVER CLAIM COMPLETENESS.** No suite, report, deliverable, tally or status line may be
    described as **VIU-complete / verified / current** on a non-final build **without stating that the
    build was non-final and naming the OPEN queue**. This is the Rule-31 SOURCE-CURRENCY logic applied
    to the *build* as a source: a non-final build is at best **PARTIAL**, and a PARTIAL source must
    name its exact shortfall.
    **WHEN TO RE-RUN THE QUEUE:** at **every session start** for that project (alongside the Rule-35
    design-queue check), **before and after any work on that project**, and **immediately** when the
    build is declared final, a deploy is detected (the app-version marker changed, or a session dies
    early — cookies on these estates die at ~24h **or on deploy**), or the QA lead asks. Re-check each
    row against the new build, **flip it to CONFIRMED or CHANGED with fresh evidence**, and only close
    the queue when **100% of rows are re-verified** (Rule 17 — no sampling, no "the important ones").
    **A row that flips to CHANGED is a finding in its own right** and is reported, not quietly
    corrected.
    **RATIONALE, 2026-08-03:** the Report Suite got its first QA branch (`sv8582`,
    `v3.4.1-0ed4433`) and 475 cases were finally live-verifiable — but engineering said the branch is
    still being worked on. Without this rule the suite would have been stamped "VIU-Verified" against
    a moving target, and every corrected label would have silently become "the truth" with no record
    of which build it came from and no trigger to re-confirm it. Canonical example:
    `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` (+ its build marker in
    `ACCESS-PROOF-2026-08-03.md`). Ties to Standing Rules 10/12 (VIU verdicts are live-observed, and
    a provisional observation is still an observation — it is its DURABILITY that is limited), 17
    (complete data in/out), 22 (ask for the live check + the environment/flag state up front), 25
    (cite the source verbatim — here, the build marker), 29 (the queue is committed to git, the only
    durable store), 31 (source currency — the build is a source), 35 (the design-fetch queue is the
    same due-dated-queue pattern), 36 (an OPEN queue is an outstanding item and belongs in the
    register) and 46 (a provisional finding recorded as final is indistinguishable from a miss).
50. **VERIFY EXHAUSTIVELY — "byte-level" means NOTHING is skipped, sampled, or assumed (all
    projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"Also remember, the verification should always be
    byte-level verification"* — **CLARIFIED by him the same day, verbatim:** *"When said byte-level
    verification I meant not to miss anything when you are verifying something."*
    **So this rule is PRIMARILY about EXHAUSTIVENESS, and only secondly about mechanical exactness.
    Read Part 1 first: "byte-level" is his phrase for MISS NOTHING.**
    **PART 1 — EXHAUSTIVE (the primary meaning).** When we verify anything, **we verify ALL of it.**
    **No sampling. No "representative subset". No spot-check standing in for a population. No "the
    important ones". No stopping at the first confirming example.** Concretely:
    · verifying a **suite** means **EVERY CASE**, not a sample
    · verifying a **case** means **EVERY FIELD** — title · preconditions · every step · every
    expected result · refs · section · type · notes — **not only the field we came to change** (this
    is the mechanism of Rule 41)
    · verifying **coverage** means **EVERY REQUIREMENT in the spec**, in **BOTH DIRECTIONS**
    (requirement→case and case→requirement), with the **totals reconciled** — **a partial extraction
    is an UNFINISHED JOB, not a "partial pass"**
    · verifying a requirement that **spans surfaces** means **EVERY SURFACE** (Rule 40) and **EVERY
    ASSERTION within it** (Rule 45(e))
    · verifying a **permission** means **EVERY ROLE**, in **both directions** (granted → allowed, and
    not-granted → refused)
    · verifying an **export** means **EVERY FORMAT and EVERY VIEW**, and **reading the file's actual
    CONTENT** — not merely that a download occurred
    · verifying **counts** means **SET EQUALITY BOTH WAYS**, **never matching totals**
    · verifying a **REPRODUCTION** means **NAMING EVERY PIECE OF TEST DATA IT DEPENDS ON** — the canned
    line, customer, contact, part, asset, work-order state, location, role/user and date range, each by
    its exact on-screen name, plus **which values were tried and ruled out**. *"Create a work order with
    a canned line"* is **not exhaustively specified**; *"add canned line **HD CVIP air brake trailer
    single/tandem**"* is. **An unnamed variable is an unverified variable** — the reader picks a different
    one, gets a different result, and closes the ticket (SV-8821, 2026-08-04: the QA lead could not
    reproduce it because our steps named no canned line, and the real condition turned out to be a
    missing CONTACT, not the canned line at all). Format requirement:
    `build/APP-ACTIONS-PLAYBOOK.md` § "HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA".
    **IF THE POPULATION IS LARGE, THAT CHANGES THE SCHEDULE, NOT THE SCOPE:** batch it, checkpoint it
    (Rule 29), and **FINISH it**. **State the EXACT number verified and the EXACT remainder** — and
    **never let a sample be reported in language that implies the whole** (Rules 12/17).
    **A SAMPLE IS ONLY EVER ACCEPTABLE WHEN THE QA LEAD EXPLICITLY ASKS FOR ONE** — and then the
    deliverable must **say plainly that it IS a sample, of what size, out of what population**.
    **PART 2 — EXACT (the mechanical half).** Where a comparison is possible, make it **BYTE-LEVEL**,
    never by eye, never by "looks right", never by a substring/`contains` check, never by a matching
    total: **every TestRail write** re-GET and compared **field by field against the intended
    payload**, with **every field we did NOT intend to change proven BYTE-IDENTICAL to its pre-write
    snapshot** (that is how collateral damage is caught, and it is the half a "200 OK" can never tell
    you) · **every claimed NON-WRITE** proven by a **byte-identical snapshot INCLUDING `updated_on` /
    `updated_by`** — *"we didn't write to it"* is an **assertion**, a byte-identical snapshot is
    **evidence** (this is how a foreign case is proven untouched, Rule 38) · **import headers HASHED**
    against their peer projects, id-map zero blanks, no duplicate titles, no leaked internal IDs ·
    **spec mirrors BYTE-COMPARED against the live fetch** (or the exact differing lines enumerated) —
    **never trusted by version number alone**, which is exactly Rule 31's staleness trap · **every
    prior run result verified PRESENT BY ID** (Rules 34/47).
    **ON A MISMATCH: THE WRITE FAILED.** **STOP the batch, do NOT proceed to the next operation**,
    report it with **BOTH byte sequences** — **never retry blindly, never log it as success**.
    **THE HONEST CAVEAT — DECLARED NORMALISATIONS.** A server may legitimately **transform** a value
    on write, so a raw byte compare can differ **for a correct write**. Accept that **ONLY when it is
    a KNOWN, RECORDED behaviour**, and then **assert it EXPLICITLY as the expected transformation** —
    **never wave it away as "close enough"**. The one recorded for us: **TestRail's `refs` field
    splits on commas, trims each entry, and rejoins with a bare comma, and rejects any single entry
    over 248 characters with HTTP 400 `Field :refs does not match the required pattern.` — a PATTERN
    error, not a length error** (248 passes, 249 fails; total length unbounded; our house style is
    **one comma-free entry ≤ 248 chars**), so `refs` is verified under
    `','.join(p.strip() for p in s.split(','))`, declared as such in the log. **Any NEWLY discovered
    normalisation must be PROVEN and RECORDED in `build/APP-ACTIONS-PLAYBOOK.md` §J, with its
    evidence, BEFORE it may be relied on** (Rule 27 — the books are the shared brain; an undeclared
    normalisation is indistinguishable from a silent write failure).
    **EVIDENCE DUTY:** keep **the pre-write snapshot AND the post-write re-GET**, and record **per
    operation** in the audit log: **the operation · the target C-id · the HTTP status · the
    verification result**. **An audit log that records only "200 OK" is NON-COMPLIANT.**
    **RATIONALE, 2026-08-04 — and the honest part is that the shortfalls are OURS.** The QA lead
    requires **zero risk of error on the Report Suite**, and our own recent work **passed the exact
    half while FAILING the exhaustive half**: the independent certification pass **spot-checked 25 of
    895 requirements and cold-read 24 of 475 cases** while reading as a certification **of the
    whole**; a coverage re-derivation extracted **856 of ~895** anchors and was reported as
    *"partial"* **rather than finished**; and an earlier VIU pass reported **86 of 475** cases
    verified with **243 only "partly observed" and 124 untouched**, which the QA lead **rejected**.
    Meanwhile the **exact** half is what caught the real dangers: a **`refs` normalisation** that
    would otherwise have read as a failed write; a run holding **539 result records** when the staged
    plan said zero — where a partial `case_ids` list would have **destroyed them** (Rule 34's
    union-only law); and **foreign cases proven untouched** by comparing their timestamps.
    **Both halves are the rule; neither substitutes for the other.**
    Ties to Standing Rules 8 (the C-id names the target), 10 (the VIU push step), 12 (observed, never
    inferred — this is its mechanical form), 17 (complete data in/out — **this rule is its
    verification-side twin**), 25 (quote the bytes, verbatim), 28 (score 100% of the cases, no
    sampling), 34 and 47 (run-sync before/after), 40 (every surface), 41 (the whole-case re-read, and
    untouched fields proven byte-identical), 45 (both directions, and one row per assertion), 48 (a
    claim carries its evidence) and 49 (a provisional finding is still verified exhaustively and
    exactly — its *durability* is what is limited, not its rigour).
51. **NEVER file an API-related ticket without ASKING — every time, even inside an approved batch (all
    projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"do not create the tickets which are related to API , if
    there are any ASK me (ask again if I have previously given a go ahead for the API tickets with the
    Non API tickets) and create them ONLY if I ask you to create them"*.
    **THE RULE:** an **API-related defect is NEVER filed on our own initiative.** It is **ASKED ABOUT
    SEPARATELY and filed ONLY if the QA lead explicitly says to file it.** **A BATCH APPROVAL DOES NOT
    COVER AN API ITEM** — the parenthesis in his directive is the whole point: *"ask again if I have
    previously given a go ahead for the API tickets with the Non API tickets"*. So *"file these six"*
    is **NOT** authorisation for the API one among the six; **ask again, naming it.** Silence is not
    consent, and an earlier yes to the batch is not a yes to the API item.
    **HOW TO JUDGE WHETHER A FINDING IS API-RELATED (the test, in one line):** **if the defect is
    invisible to a user AND to a manual tester — reachable only by calling an endpoint directly with a
    request the product's own screens never send — it is API-RELATED.** **If the same failure ALSO
    occurs through the product's own screens, it is a USER-FACING defect** that merely happens to be
    *characterised* technically (a 500 in the response is technical *evidence*; it is not what makes
    the ticket API-related). Judge by **reachability from the product**, never by whether our evidence
    happens to be an endpoint capture.
    **METHOD (so the split is visible BEFORE anything is filed):** **(1)** every defect pack **LISTS
    API-RELATED FINDINGS IN THEIR OWN SEPARATE SECTION**, with the reachability reason stated per item
    — a dated `API-SPLIT.md` beside the pack is the canonical vehicle (`build/report-suite/
    defect-pack-2026-08-04/API-SPLIT.md`). **(2)** the ask goes to the QA lead **separately from the
    non-API batch**, in plain layman words (Rule 7): what the defect is, that it cannot be reached from
    any screen, and the explicit question *file it or not?* **(3)** nothing is filed until he answers.
    **(4)** if an API ticket was already filed before this rule was known, **withdraw it on his ruling**
    — **CLOSE it via a workflow transition with a plain-language closing comment, NEVER DELETE it**
    (a withdrawn ticket with its reasoning on the record is worth more than a deleted one, and deletion
    is irreversible); set **priority Low first** (Rule 53) so it does not sit closed at the wrong
    priority; and **keep the underlying finding written up in the defect pack** — we withdraw the
    *ticket*, we do not discard the *finding*.
    **TIE TO RULE 24 (read them together):** Rule 24 already says **front-end blocks + back-end/API
    allows = a PASS, not a defect.** This rule is its filing-side sibling: even where an API-only
    behaviour is a genuine hardening opportunity rather than a Rule-24 pass, **it is still not ours to
    raise unasked.** Between them: an FE-gated/BE-allowed action is **not a defect at all**, and an
    API-only fault that IS a defect is **not a ticket without his say-so**.
    **RATIONALE, 2026-08-04 (the worked example that produced the rule — and it was our miss):**
    **SV-8822** *"Saving a customer returns a server error instead of a validation error when a
    sales-rep id is supplied"* was filed **inside the approved batch of six** defect tickets, because
    the batch had been approved as a whole and nobody separated out the API item. It is **API-only**:
    the fault is reachable only by sending the customer-save request directly in a shape the product's
    own dialog never produces, so **no customer and no manual tester can see it**. The QA lead then
    stated the rule above, and when asked, ruled verbatim: *"Yes Tickets related to API which you have
    already created can be withdrawn"* — so SV-8822 was **transitioned to OBSOLETE (resolution Done)
    with a plain-language withdrawal comment, not deleted**, while **SV-8821** (the create-invoice
    server error) **stayed OPEN** precisely because that one **also fails through the product's own
    screen** and is therefore user-facing despite its technical characterisation. **That contrast —
    8822 withdrawn, 8821 kept — IS the reachability test in practice.** Records:
    `build/report-suite/defect-pack-2026-08-04/API-SPLIT.md` + `FILED.md`. Ties to Standing Rules 1
    (never proceed without the complete input set — an unanswered ask is a missing input), 6 (nothing
    written to a system of record without permission), 7 (plain layman wording for the ask), 12
    (observed, never inferred), 24 (FE-blocks/BE-allows is a PASS), 36 (an unanswered ask is an
    OUTSTANDING item and belongs in the register), 48 (a blocked item cites the ruling that blocks it)
    and 53 (priority Low).
52. **A defect ticket is parented to the EPIC, and its relationship to the owning STORY is expressed as
    a LINK of the story-defect kind — never as a parent, never as a subtask (all projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"when you attach a ticket to a story that should ALWAYS be
    attached as a Story Defect and NOT as a bug"* — **CLARIFIED by him the same day, verbatim, and the
    clarification is the operative wording:** *"So Yes, attach the tickets to the Epic as Parent but
    when you liunk th etickets to the stories they should be linked as their story defects. You did it
    correctly before."*
    **THE RULE — the correct shape, both halves together:** **(a) PARENT = THE EPIC.** **(b) THE OWNING
    STORY IS LINKED, NOT PARENTED**, and that link must read as a **story-defect** relationship rather
    than a bare association. **Do NOT reparent a defect onto a story. Do NOT convert it to a subtask.
    Do NOT create replacement issues or close the original as a duplicate to achieve a story parent.**
    **THE PROJECT FACT THAT MAKES THIS THE CORRECT SHAPE, NOT A WORKAROUND** (verified live from
    `GET /rest/api/3/issue/createmeta/SV/issuetypes`): in project **SV**, **`Bug` (id 10008) is
    HIERARCHY LEVEL 0**, exactly like `Story` (10245) and `Task` (10005) — **so its parent may only be
    an `Epic` (10006, level 1)**; a Story cannot be a Bug's parent at all. The only story-level child
    vehicle is **`Story Defect` (id 10007), a SUBTASK at hierarchy level −1**. **Jira REFUSES the
    level-0 → subtask conversion:** `PUT /rest/api/3/issue/{key}` with `issuetype:10007` + `parent`
    returns **HTTP 400 `{"pid":"Issues with this Issue Type must be created in the same project as the
    parent."}`** (a misleading message — the parent WAS in the same project), and `issuetype` alone
    returns **HTTP 400 `{"issuetype":"Issue type is a sub-task but parent issue key or id not
    specified."}`** — an unwinnable pair. **So epic-parent + story-link is not a compromise forced by a
    limitation; it is the shape the QA lead requires.**
    **NO STANDALONE TICKETS — EVERY ticket we create gets the EPIC as its parent (clarified by the QA lead
    2026-08-04), INCLUDING a defect we found during our testing whose UNDERLYING CAUSE SITS IN ANOTHER
    TEAM'S AREA.** "It is not really a reporting bug" is **NOT** a reason to leave a ticket parentless: we
    found it, we raised it from this epic's testing, so it hangs off this epic. **HONEST CAVEAT (a note, not
    an exception): an epic parent CAN MISATTRIBUTE another squad's work** — so where the defect is not the
    epic's own feature, **SAY SO IN THE TICKET'S TECHNICAL SECTION** (name the real area/endpoint) and
    **KEEP the `blocks` link that explains WHY we raised it**. The parent records who found and owns the
    report; the links and the text record where the fault actually lives. **A `blocks` link to the epic and
    an epic parent COEXIST FINE** — Jira raised no objection (proven live on **SV-8821**, 2026-08-04:
    `parent = SV-8582` set while `blocks SV-8582` + `blocks SV-8592` were both retained).
    **METHOD:** file with `parent` = the epic and the story attached via `POST /rest/api/3/issueLink`.
    **The link TYPE is the QA lead's to name — never guessed.** The types available in this Jira
    (`GET /rest/api/3/issueLinkType`, read live 2026-08-04) are exactly: **Blocks** (`is blocked by` /
    `blocks`) · **Cause** (`caused by` / `causes`) · **Cloners** · **Duplicate** · **Fixes** (`Fixes` /
    `Fixed by`) · **Polaris work item link** (`is implemented by` / `implements`) · **Relates**
    (`relates to` / `relates to`) · **Split**. **NONE of them is a defect-of / is-defect-for type**, so
    where a "story defect link" is called for and no such type exists, **CHANGE NOTHING and ASK him
    which of the eight he means** (Rule 7 — plain question; Rule 12 — never invent a semantic).
    **RATIONALE, 2026-08-04:** the six Report-Suite defect tickets were filed as `Bug`s parented to
    epic **SV-8582** with the owning story merely **linked** (`Relates`) — SV-8818→SV-8591,
    SV-8819→SV-8645, SV-8820→SV-8672, SV-8823→SV-8677. **An intermediate pass then wrongly proposed
    CONVERTING those four into `Story Defect` subtasks parented to their stories, and the QA lead
    corrected it: *"You did it correctly before."*** Both conversion attempts had already been
    **rejected by Jira with the two HTTP 400s quoted above, so nothing was converted** and no repair
    was needed — but the lesson is that **the original shape was right and the "fix" was the error.**
    **SECOND RATIONALE, same day — the no-standalone half:** **SV-8821** (the create-invoice server error) was
    filed with **NO parent** because its cause is work-order invoicing rather than reporting, and the QA lead
    asked why it was not related to the Report Suite epic. It was corrected to **`parent = SV-8582`**
    (`PUT /rest/api/3/issue/SV-8821` → **HTTP 204**, byte-verified: 58 fields compared, only `parent` and the
    server's `updated` changed, both `blocks` links intact). **`SV-8822` was left alone** — it is
    **OBSOLETE / Done / withdrawn**, and re-parenting a closed ticket is his decision, not ours.
    Record: `build/report-suite/defect-pack-2026-08-04/FILED.md`. Ties to Standing Rules 6 (no write
    without permission), 12 (observed, never inferred — the hierarchy levels and the refusals were read
    live, not assumed), 25 (quote the source and the error verbatim), 27 (recorded in the playbook so it
    is never re-derived), 32/33 (the latest ruling wins — his clarification supersedes the first
    reading) and 51.
53. **NEVER set a ticket's priority to High — always file at Low; and NEVER "restore" a field the QA
    lead has changed (all projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"never mark the priority as High for the tickets you create
    always keep the priority as LOW"*.
    **THE RULE:** **every ticket we create is filed at priority `Low`.** Not Medium, not "the severity
    the pack states", not High however bad the defect looks to us. **Priority is the QA lead's to
    RAISE, not ours to ASSERT** — he triages; we report. This is unconditional and applies to every
    project and every ticket type. **Where the finding genuinely is severe, that belongs in the ticket's
    own words and in the project's `Severity` field — not in `Priority`.**
    **THE COROLLARY THAT BURNED US — A CHANGE MADE UNDER HIS ACCOUNT IS HIS TRIAGE, NOT AN ANOMALY:**
    **NEVER "restore", "correct" or "repair" a field value that has changed without an action of ours.**
    He works in the Jira UI **under this same account** (`bilal.muzamil@shopview.com`, accountId
    `712020:6d590212-…`), so **his edits are INDISTINGUISHABLE FROM OURS in the changelog** — the author
    column will read our own name. Therefore: an unexplained field change is to be **READ AS HIS
    DELIBERATE ACTION and ASKED ABOUT, never reversed.** The signature to look for: a change that is
    **selective and semantically coherent** (only the `High` ones moved; the `Low` and `Medium` ones did
    not) or a **status transition that sets a resolution** — both are human triage, not a stray write.
    **RATIONALE, 2026-08-04 (the whole sequence, because the evidence is the lesson):** the six tickets
    were created at the severity their pack stated (High ×4 · Low · Medium). The QA lead then downgraded
    the four to `Low` at **00:35:27 / 00:35:32 / 00:35:37 / 00:36:58 (−0500)** and closed **SV-8823** to
    **OBSOLETE** at **00:55:27** — all under our shared account. A pass read the four downgrades as
    unexplained drift and **"restored" them to `High` at 00:54:23–00:54:27, reversing his deliberate
    decision.** He then **re-applied `Low` at 00:56:00–00:56:29** — the changelog now carries the full
    embarrassing round trip **`High → Low → High → Low`** on all four, and it is on the record precisely
    so nobody repeats it. **The restore was WRONG twice over: wrong because it undid his triage, and
    wrong because the correct value under this rule was `Low` all along.** Ties to Standing Rules 6
    (nothing changed in a system of record without permission — *including* changing it back), 12
    (observed, never inferred — "drift" was an inference and it was false), 25 (cite the changelog
    verbatim), 32/33 (his ruling outranks our reading of a pack), 48 (never imply his decision is an
    obstacle, and never carry a "restore" forward silently), 50 (the byte-level re-read is what surfaced
    the change — reading it correctly is the other half of the job) and 51/52.
54. **EVERY TEST CASE STATES WHAT ITS EXPECTATION IS BASED ON — a provenance line under Expected
    Results, kept current (all projects).**
    USER DIRECTIVE (2026-08-04, verbatim): *"This is the expected behaviour as per the build tested on
    8/4/2026, and as per the Sales By Customer report specification version 13 (S4-R13). yes make it a
    permanent rule whenever you create the test cases, when there is only the Epic and Specs mention
    the epic and specs reference and when you also are done with VIU mention the Test on Buil with the
    date. Then update them whenever you recheck against the spec/epic/Build."*
    **THE RULE:** **every** test case carries, as the **LAST thing in its Expected Results** — after a
    separator line — **a single plain-English sentence naming the sources its expectation rests on.**
    A case that does not say what it is based on is not self-describing, and its staleness is
    invisible.
    **THE TWO STATES (a case is always in exactly one of them):**
    **(1) BEFORE ANY LIVE VERIFICATION (spec + epic only)** — name the **epic**, the
    **specification with its VERSION**, and the **governing requirement reference**. Shape:
    *"This is the expected behaviour as per epic SV-8582 and the Sales By Customer report
    specification version 13 (S4-R13)."*
    **(2) AFTER LIVE VERIFICATION** — **ALSO** name the **build and the date it was tested**. Shape
    (**the QA lead's own wording — use it**): *"This is the expected behaviour as per the build tested
    on 8/4/2026, and as per the Sales By Customer report specification version 13 (S4-R13)."*
    **KEEP IT CURRENT — THIS IS THE OPERATIVE HALF.** The line is **RE-STAMPED whenever we re-check
    against the spec, the epic or the build**, and re-stamping is a **REQUIRED step** of every
    verification, reconciliation and spec-delta pass — **not an optional tidy**. **A stale date, a
    stale spec version or a stale epic reference is ITSELF A FINDING** and is reported as one (Rule 31
    source currency; Rule 49's re-check queue — the provenance line is **where the build marker
    actually lives on the case**, so re-running a Rule-49 queue re-stamps it).
    **MECHANICS THAT MAKE IT MAINTAINABLE (not hundreds of hand-edited strings):** the **date is a
    SINGLE variable** in the generator and the **spec versions a per-report / per-project MAP**;
    the stamper is **IDEMPOTENT** — it **REPLACES an existing provenance line, never appends a
    second**; and it is driven off the case source so a re-stamp is one regeneration, not a manual
    sweep.
    **WORDING CONSTRAINTS:** **plain layman English** (Rule 7) · the **FULL report/feature name, never
    an abbreviation** (Rule 19's spirit) · and **NEVER the word "VIU"**, nor a feature-flag name, nor
    any internal jargon — imports stay **VIU-word-free and flag-word-free** per the standing
    convention. **THE REQUIREMENT REFERENCE IN PARENTHESES IS PERMITTED AND WANTED** — notwithstanding
    the general "no §-anchors in tester-facing text" guidance of Rules 7/20. **This is a DELIBERATE,
    QA-LEAD-AUTHORISED EXCEPTION and it is stated here explicitly so that a future pass does not strip
    it as a Rule-7 violation.**
    **NAME THE SOURCE FILE, AND GIVE ITS LINK (added 2026-08-04 by the QA lead's ruling, verbatim:
    *"If Branko said this in his new file then yes, but below the expected behavior give the file link
    and mention that this is coming from Branko's responses here. Anyting that you do if that has the
    reference from the file only - follow the same practice."*).** Where an expectation derives from a
    **NAMED SOURCE FILE rather than the specification** — a **PO's answer sheet**, a **walkthrough /
    Loom video**, an **engineering tech plan**, a **design export**, any document that is not the spec
    — the provenance line **NAMES THAT SOURCE, GIVES ITS LINK, and says plainly that the position comes
    from there**, e.g. *"…and as per Branko's answers in this file: <link>"*. **THE LINK IN
    TESTER-FACING TEXT IS A DELIBERATE, QA-LEAD-AUTHORISED EXCEPTION** to the no-jargon guidance of
    Rules 7/20, exactly as the requirement anchor above is — **stated here so a future pass does not
    strip it.** **A LINK MAY ONLY BE CITED WHERE THAT SOURCE IS GENUINELY LOAD-BEARING FOR THE
    ASSERTION:** pasting an answer-file link onto a case the file does not govern manufactures false
    authority just as surely as omitting a source does, so **distinguish the two cases in the wording**
    — the file is either the **BASIS** (*"that decision is recorded in <who>'s answers, in this file:
    <link>"*) or a **CONFIRMATION** of a spec-backed expectation (*"<who> confirmed this on <date> in
    his answers in this file: <link>"*). **Keep the answer's DATE where it clarifies things**, and
    **re-stamp when a newer file supersedes it** (Rule 32). Canonical example:
    `build/filters/branko-answers-2026-08-04/testrail-execution-log.md` — 12 Filters cases, 10 cited
    the file as governing and 2 as confirming, while the other 98 kept the ordinary line.
    **HONESTY CLAUSE — THE IMPORTANT ONE.** Where a case **deliberately follows a LATER PRODUCT
    DECISION instead of the spec text** (Rule 32 latest-wins — e.g. a PO ruling the spec has not
    caught up with), the line **MUST NOT claim plain spec agreement**: it names the spec **AND states
    that the behaviour follows a later product decision**. **A provenance line asserting a source that
    does not actually support the expectation is WORSE THAN NONE — it manufactures false authority**
    (the same failure mode Rule 46 exists to prevent). Where a case genuinely **has no spec anchor**,
    **say that in words** rather than inventing a reference (Rule 12).
    **SCOPE:** **ALL projects** — Report Suite, Schedule, Filters, Global Search and every future one.
    **NEW cases get it at authoring**; **EXISTING suites get it when next touched, or on an authorised
    retrofit pass** (a retrofit is a TestRail write and needs the QA lead's go-ahead, Rule 6).
    **RATIONALE, 2026-08-04:** it makes every case **self-describing about what it is based on**, so an
    automation engineer or a reviewer can see the basis **without asking** (the Rule-39/44 conversation
    starts from evidence instead of guesswork), and **a source moving on makes the case VISIBLY STALE
    instead of silently wrong** — which is exactly the failure that cost us the SBR export gap. The
    **Report Suite is receiving it now across 478 cases**; and note that **this TestRail project has NO
    Notes field** (verified read-only via `get_case_fields`), which is **why the provenance belongs in
    Expected Results — where a tester actually sees it** — rather than in a metadata field that does
    not exist. Ties to Standing Rules 7 (plain layman wording — with the authorised anchor exception
    above), 8 (a case is always named with its C-id), 9 (build-accurate wording), 10 (the VIU push step
    stamps/refreshes the line), 12 (never assert a source you did not read), 19 (full readable names),
    20 (traceability — this is its **tester-visible** twin; `refs` remains the metadata layer), 25
    (cite the source, with its version), 31 (source currency — a stale stamp is a stale source), 32
    (latest product decision wins, and the line must say so), 41 (touch a case → re-verify it whole,
    and re-stamp), 42 (the version in the stamp is what connects a closed list to the requirement that
    invalidates it), 43 (a spec-version bump re-stamps every affected case), 46 (a documented basis is
    what stops a deliberate decision looking like a miss) and 49 (the build marker + the re-check
    queue).

## Project purpose (Custom Roles project)
Manual test-case authoring + live staging (Verify-in-UI) verification + TestRail
management for ShopView **"Custom Roles and Permissions"**, plus related
regression / bug-fix re-testing.

## Durable key facts (detail → runbook)
- **Staging topology:** `app.staging.shopview.com` = SPA frontend;
  `api.staging.shopview.com` = Symfony JSON backend.
- **PRODUCTION access & fix-verification (app.shopview.com, prod test org 72b2cc90…):** see
  build/APP-ACTIONS-PLAYBOOK.md **§K "PRODUCTION access & fix-verification"** (proven 2026-07-29,
  SV-8721) — prod login/session gotchas, canned-line workplace, 5-decimal recipe, Jira evidence method.
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
- **SWITCH WORKPLACE/LOCATION (self-unblock — learned 2026-07-23, never ask the user again):**
  a session is scoped to ONE workplace; reading/writing a WO in another workplace returns
  400/no-data. Switch with **`POST /api/iam/change-location {workplace_id, workplace_timezone}`**
  (→200). Helper: `changeLocation()` in `build/testing-tools/staging-admin.mjs`; boot2 accepts
  `{workplaceId}` / env `SV_WORKPLACE`+`SV_TZ` and switches before hydrating. Workplaces (GET
  `/api/staff/my-workplaces`): Heavy Duty 9919 = `b3c8c820-f815-4cf1-8938-10956c5ee71a`
  (America/Edmonton); Lethbridge 4310 = `f8a8b802-7780-4b16-bf10-343caeb616b2`; QB Location =
  `d5366a95-582d-4a06-96e2-20f8cb937866`. **CREATE A WO:** `POST /api/work-orders/create
  {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}` (→201, needs
  is_vehicle_here). Vehicles: `GET /api/vehicles?company_id={id}`. Customer defaults auto-apply
  fees on new WOs. **DELETE WO:** `POST /api/work-orders/delete {work_order_id}`. **WO LINE CREATE:**
  `POST /api/work-orders/lines/create` SUCCEEDS with a canned line — body `{canned_line_id,
  work_order_id, status:'authorized'}`; it 500s only when called without a canned line/labor — use the
  UI New Line dialog for those (confirmed live 2026-07-27, SV-8721 side project).
  **ADJUSTMENTS API (FD, learned 2026-07-23):** add a WO fee/discount = `POST /api/work-orders/adjustments/add`
  `{workOrderId, kind:'fee'|'discount'|'processing_fee', name, calculationType:'flat'|'pct_labor'|'pct_parts'|'pct_subtotal'|'pct_grand_total', amount, scope:'whole_wo'|line, targetId, taxable, templateId}`; remove = `POST /api/work-orders/adjustments/remove {adjustmentId, workOrderId}` (→204); edit = `POST /api/work-orders/adjustments/change {adjustmentId, workOrderId, name, ...}` (a **processing_fee** returns HTTP 409 'A processing fee cannot be edited through this endpoint' = remove-only, spec-correct). Customer default fees auto-apply on WO create (appliedBy=customer_default); processing-fee base = net subtotal (labour+parts+shop)×(1+tax) EXCLUDING whole-WO fees (§5-R4, VIU-confirmed FIXED 2026-07-23).
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
- **Prod-vs-staging (and any two-env) permission comparisons: 100% LIVE-OBSERVED,
  ZERO NOT-VERIFIED — see `build/PROD-VS-STAGING-COMPARE-METHOD.md`.**
- **Comparison/environment-diff workbooks: `build/COMPARISON-WORKBOOK-RECIPE.md`** —
  the reusable template + method for any "make a comparison file" request (file name
  starts with "Comparison"); parameters = the envs/population/capabilities/spec.
  **§1A "USER REQUIREMENTS & INSTRUCTIONS" now captures the originating engagement's
  own asks/standards/corrections** (bi-directional; Send-to-Terminal/Portal focus;
  role merge-map + naming trap; granular WO tab; the two per-spec/per-standing
  conformance columns; the trust rule = 100% live-observed both envs / zero
  NOT-VERIFIED / seed-don't-block; verbatim-truth-table + adversarial audit; Excel in
  the established format; exec + QA companions; env/access + ways-of-working) — these
  are the DEFAULT requirements for any comparison file unless the user overrides.

## Deliverable conventions the user likes
- Plain, layman English.
- Numbered **Preconditions / Steps / Expected**, each with line breaks.
- **A PROVENANCE LINE ends every case's Expected Results (Standing Rule 54):** after a separator
  line, one plain sentence saying what the expectation is based on — the **epic + specification
  version + requirement reference** before live verification, and **also the build + the date it was
  tested** after it (the QA lead's wording: *"This is the expected behaviour as per the build tested
  on 8/4/2026, and as per the Sales By Customer report specification version 13 (S4-R13)."*).
  **Re-stamped on every spec/epic/build re-check** — a stale stamp is a finding. Never the word
  "VIU", never a flag name; the requirement reference in parentheses is an authorised exception to
  the no-anchors-in-tester-text guidance.
- Excel workbooks: a **separate tab per result status** + a **Summary** tab.
- Provide **GitHub raw download links** for deliverables.
- **Per-case audit logs** for any TestRail edits.
- Test cases with FE-block/BE-allow behavior carry a plain tester-facing "Note for the
  tester: …expected, mark PASSED, don't raise a bug" line (per Standing Rule 24).
- **Simple-format status updates (all chat updates + reports):** Give updates/status
  in EXTREMELY SIMPLE, plain, layman words a manual QA can read and follow — short
  statements/steps, grouped under clear plain headings (e.g. "What I did / What needs
  to be done / Other actions"), no jargon, nothing important omitted. This is the
  default format for every progress update and summary going forward. (User
  instruction 2026-07-24: "Always give updates in this format.")
- **Every DEVIATION cell must carry a plain "What needs to be done" (all
  deliverables):** In ANY deliverable (workbooks, reports, trackers, CSVs) that marks
  a cell/row as DEVIATION — or Failed / Blocked / any not-passed status — that cell
  MUST be paired with a plain-English "What needs to be done" explanation (a dedicated
  "What needs to be done (plain)" column or an adjacent note), in simple words a
  non-technical manual QA can act on. Never leave a bare "DEVIATION"/"Failed"/"Blocked"
  without the plain next-step. Bake this into every generator/workbook going forward.
  (User instruction 2026-07-24: "in such cases you always need to use simple words to
  tell me what needs to be done.") Ties to Standing Rules 7 and 8.
- **Concise TestRail case TITLES (all projects):** TestRail case titles MUST be concise
  enough to display fully on the TestRail case page (no truncation) — keep to ≤ ~80
  characters; put the full detail in Steps/Expected/Preconditions, never rely on a long
  title. Applies to all future authoring and to any long title when a case is next
  touched. (User instruction 2026-07-27.)
- **Blocked-revisit loop (standing, all projects):** tester-marked-**Blocked** cases are a
  standing intake queue — if a case seems off/confusing/wrong during execution the manual
  tester marks it Blocked (never skips, never guesses); EVERY Blocked case then gets a manual
  revisit (re-checked against the current spec + live build) and a logged, authorized TestRail
  correction (reword / fix expectation / merge / retire). Part of the permanent quality
  pipeline — presentable overview doc = build/QA-QUALITY-PIPELINE-EXPLAINER.md; runtime
  counterpart section in build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md. (QA lead's standing
  instruction 2026-07-29: "the last fool proof process is that the manual tester marks the test
  cases which seems off to him/her as Blocked and we revisit those blocked tests manually to
  see what needs to be changed there.")
- **Execution discipline + tickets→cases (standing, all projects; Daily QA Meetup 2026-07-29,
  source build/meetings/Daily-QA-Meetup-2026-07-29-notes.md):** test-case execution and
  creative break-the-feature testing are TWO SEPARATE activities — QAs run the cases as
  written (Blocked for anything off), and SEPARATELY deep-dive each feature with "creative,
  imaginative testing … to attempt to break the features" + hunt regressions; those findings
  are NEVER mixed into the test-case run — they are reported as TICKETS ("Create tickets for
  any edge cases or scenarios that break features during manual creative testing"), findings
  consolidated in a dedicated regression/edge-case section, and those tickets are LATER
  CONVERTED INTO test cases — the suite grows from real findings. General leadership-facing
  doc: build/Test-Case-Creation-and-Refinement-Process_2026-07-29.docx/.md (no project names,
  anonymized numbers). **Refinements (QA lead 2026-07-29):**
  completely-irrelevant cases found on revisit are removed and should be ≤1% of the suite;
  slight fixes (expected behavior / steps of reproduction / title) are owned and applied
  directly by the QA; QAs also owe each feature a deeper dive — actively trying to break it and
  finding/reporting regressions (test-case work is only ONE part of squad success); those
  edge-case/regression tickets are later converted into test cases, so the suite grows from
  real findings. Layman-facing guide =
  build/How-We-Ensure-Test-Case-Quality_Simple-Guide_2026-07-29.docx (+ .md twin).

## Persistence note
Secrets are **ephemeral** (`/tmp`, re-supply per environment). Everything else
here is **durable memory** — update it when facts genuinely change (a spec change
gets implemented, ids change, scope changes).
- **NO-WORK-LOSS STRATEGY (read on any near-limit / restart / dead-worker event):**
  `build/NO-WORK-LOSS-STRATEGY.md` — golden rule (all durable work lives in GIT,
  committed+pushed after every step; container + /tmp are ephemeral), checkpoint
  granularity, resume anchors (this CLAUDE.md + each PROJECT-STATE.md), in-flight
  kill recovery, secrets re-supply, pre-limit checklist, post-reset resume steps.
