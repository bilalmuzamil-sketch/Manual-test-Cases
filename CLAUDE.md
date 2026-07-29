# ShopView Manual Test Cases — Project Memory

> **Before any staging or TestRail testing, read `build/TESTING-RUNBOOK.md`.**
> That runbook holds the full, proven method; this file is a concise index +
> durable memory. **No secrets in this repo — ever** (secrets live in `/tmp`).
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
   resume doc: build/global-search/PROJECT-STATE.md.** Spec fully
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
   **⚠️ Epic/Jira key: NOT AVAILABLE YET — ASK THE USER for it when VIU begins**
   (every story's Jira field reads "TBD"; do NOT invent).
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
   / 15 stories SV-8686..SV-8700. Applied locally (plan item 1): (1) Rule-20 refs backfilled on ALL
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
    with a per-case audit log (subject to that project's TestRail authorization) →
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
    KEEP-but-NONSENSE (the embarrassment check) explicitly. **(3) GENUINE + LAYMAN-RUNNABLE** —
    every case traceable to its ticket + spec/video source (Rule 20 authenticity) AND executable
    by a NON-TECHNICAL manual QA tester easily (Rules 7/9 plain wording: build-accurate labels,
    no jargon, numbered steps a layman can follow); a case failing this dimension gets FIX-WORDING
    or CUT. **The stated purpose: no suite we deliver can ever substantiate the "AI makes useless
    test cases" claim — every delivered suite carries the three-dimension tally as proof.** The
    suite SHIPS WITH that tally (usefulness headline current → recommended + sense counts +
    genuine/layman confirmation) + an honest "is the critic right?" answer covering BOTH halves of
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

## Persistence note
Secrets are **ephemeral** (`/tmp`, re-supply per environment). Everything else
here is **durable memory** — update it when facts genuinely change (a spec change
gets implemented, ids change, scope changes).
- **NO-WORK-LOSS STRATEGY (read on any near-limit / restart / dead-worker event):**
  `build/NO-WORK-LOSS-STRATEGY.md` — golden rule (all durable work lives in GIT,
  committed+pushed after every step; container + /tmp are ephemeral), checkpoint
  granularity, resume anchors (this CLAUDE.md + each PROJECT-STATE.md), in-flight
  kill recovery, secrets re-supply, pre-limit checklist, post-reset resume steps.
