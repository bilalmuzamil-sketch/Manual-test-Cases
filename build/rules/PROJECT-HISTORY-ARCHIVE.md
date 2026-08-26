# Per-project NARRATIVE HISTORY — archived from CLAUDE.md, 2026-08-21

This file holds the FULL, VERBATIM per-project narrative status blocks (projects 1-7) that
used to sit in CLAUDE.md. NOTHING was deleted — this is the same text, moved.

**The canonical LIVE document for each project remains its own `build/<project>/PROJECT-STATE.md`.**
Read that first; this archive is the history behind it.

Full archive of the whole former CLAUDE.md: build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md
Rule texts: build/rules/RULES-01-20.md, RULES-21-40.md, RULES-41-60.md, RULES-61-95.md

---

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
   **STATUS 2026-07-27 (SUPERSEDED — OPTION A design-level authoring): 43 NEW
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
   **STATUS 2026-08-06 (LATEST — VLAD'S GAP REVIEW WORKED: THE SUITE IS 114 CASES, READY TO AUTOMATE
   94, AND THREE CLAIMS BELOW ARE CORRECTED. Resume
   `build/filters/vlad-gap-review-2026-08-06/{ROOT-CAUSE,ROW-BY-ROW,SOURCE-CURRENCY,NEW-CASES,
   RECHECK-QUEUE,DELIBERATE-DECISIONS,QUESTIONS-FOR-BRANKO,testrail-execution-log,
   STAGED-RUN-352-SYNC}.md` → `build/filters/PROJECT-STATE.md`; commit `6a51f273`):**
   **🔴 THE ROOT CAUSE, IN ONE LINE: WE VERIFIED THAT THE 110 CASES WE HAD WERE CORRECT; WE NEVER
   VERIFIED THAT 110 WAS THE RIGHT SET.** The requirement→case map (`build/filters/coverage-matrix.md`)
   was last written **17 July** — **81 rules / 79 cases** — while the spec now carries **132 rules**,
   and the map has **ZERO entries for Stories 13 and 14**, the two largest sections, added **26 July**.
   **Rule 43 already required that map to be RE-DERIVED every spec version, and it was simply never
   run** (not for v12, v18 or v19). Three of the genuine gaps live in exactly that unmapped territory.
   Full five-whys, with the recurrence-vs-new analysis: `vlad-gap-review-2026-08-06/ROOT-CAUSE.md`.
   **⚠️ A REQUIREMENT→CASE RE-DERIVATION FOR FILTERS IS NOW AN OUTSTANDING ASK AWAITING THE QA LEAD'S
   GO-AHEAD — IT HAS NOT BEEN DONE and must not be described as done.**
   **THE HONEST SCOREBOARD on Vlad's eleven rows (twelve, because one splits in two under Rule 45(e)):
   he was RIGHT on 6 · MISTAKEN on 5 · and 1 was never a gap** (row 7, a deliberate HOLD on the QA
   lead's own *"lets wait for Brankos PRD"*). **AND 4 OF THE 5 HE GOT WRONG ARE STILL OUR FAULT** — the
   coverage he could not find sits **mid-list inside cases titled after a different rule** (point 4 of
   five, point 6 of seven), and **there is no published requirement→case map for him to check**, so his
   only option was reading 110 case bodies. **That last point is the actionable one:** publishing the
   map turns an outsider's review from archaeology into a one-page check.
   **CORRECTION 1 — "RAW MARKUP IS NOW 0 OF 110" (claimed 2026-08-05, below) IS NOT TRUE OF THE LIVE
   SUITE.** A live census on **2026-08-06** found **14 of the 114 cases still showing raw markup to the
   tester** (15 before one was repaired in passing): C29558, C29560, C29561, C29562, C29563, C29564,
   C29565, C29583, C29584, C29585, C29586, C29587, C29588, C38877, C38882 — and **11 of the 15 were
   last written by our own 5 August pass**, so this is ours, not drift. **REPAIRING THEM IS NOT YET
   AUTHORISED** — it is a TestRail write and its own pass (Rule 6).
   **CORRECTION 2 — READY TO AUTOMATE IS 94, NOT 95, AND THE SUITE IS 114 CASES, NOT 110.** Live
   markers read **79 `READY` + 15 `READY - EXPECT FAIL` + 20 `HOLD` = 114**, and **the gate passes both
   ways: 79 + 15 = 94, and 114 − 20 = 94.** Four new cases were authored (**C43560–C43563**), taking
   110 → 114. **And the honest detail: the old figure of 95 was ALREADY ONE TOO HIGH** — it was counted
   as 81 + 14, but the live census showed **80 READY plus C29558 carrying NO MARKER AT ALL** after
   another author's edit, so the true figure at the end of the 5 August pass was **94**.
   **CORRECTION 3 / SOURCE FACTS — BOTH THE SPEC AND THE BUILD MOVED ON 2026-08-06:** the spec went to
   **Confluence v19 at 11:48:47Z**, the whole diff being **one new requirement, `S1-R3`** (chips carry a
   leading type-icon; SV-8986), **so all 110 pre-existing `refs` now pin a superseded `[spec v18
   2026-08-04]`** — and note that **Ahtasham had already covered it 21 minutes BEFORE Branko published
   it**, rewriting C29558 at 11:27:20Z. The build redeployed to **`v3.4.2-280ca5a`** (last-mod Thu 06
   Aug 2026 09:37:49 GMT, etag `720a7f1f…`), **superseding the `v3.4.2-d00239b` recorded throughout the
   blocks below**, so **every Filters verdict now predates the build that is running** — under **Rule
   60** that is the ORDINARY CONSEQUENCE of a branch that is never declared final, not an alarm: it
   touches layer 1 (labels/navigation), layer 2 (the verdict) and the `HOLD` half of layer 3, and
   invalidates **no** expectation, because expectations come from documents (Rule 57).
   **⚠️ Rule-49 queue OPEN (`vlad-gap-review-2026-08-06/RECHECK-QUEUE.md`, 9 rows) — the branch is NOT
   declared final, so all 114 verdicts remain PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 ~21:35 UTC (SUPERSEDED for the three claims corrected above — THE FULL
   LIVE PASS: ALL 110 CASES DRIVEN LIVE, READY TO
   AUTOMATE 95. Resume `build/filters/READINESS-2026-08-05-FULL-LIVE.md` →
   `build/filters/full-viu-2026-08-05/{FINDINGS,CHANGES-MADE,testrail-execution-log,RECHECK-QUEUE,
   DELIBERATE-DECISIONS,SOURCE-CURRENCY,FILED,API-ASK,RESUME}.md` → `build/filters/PROJECT-STATE.md`):**
   **all 110 of the 110 cases were OBSERVED LIVE in this one pass — 0 carried forward** — on build
   **`v3.4.2-d00239b`** (`index.html` last-modified Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41…`,
   read at 19:53Z, 21:00Z and 21:34Z and **byte-identical by sha256 all three times**, so nothing
   redeployed under the pass). Expected behaviour came from the documents only (Rule 57): spec at
   **Confluence version 18**, epic **SV-8785** and its stories, and Branko's recorded answers.
   **OUTCOMES: PASS 81 · DEVIATION 14 (every one ticketed) · HOLD 15.** **READY TO AUTOMATE = 95**, and
   **the arithmetic gate passes two ways: 81 READY + 14 EXPECT-FAIL = 95, and 110 − 15 HOLD = 95.**
   **⚠️ CORRECTED 2026-08-06 — THE 95 WAS ONE TOO HIGH EVEN THEN (a live census found 80 READY, not 81,
   because C29558 carried NO marker after another author's edit) and the suite is now 114 cases:
   THE FIGURE IS 94. Superseded wording kept above; see CORRECTION 2 in the 2026-08-06 block.**
   **The figure went DOWN from 100 to 95 and every one of the five is explained** — HOLD rose 10 → 15
   (C29615 needs a second login; C38880 and C38881 assert behaviour no source documents or need an
   account that no longer exists; C38891 and C38901 have preconditions the part-finished page-search
   rollout cannot meet). **A lower honest figure is the point of the exercise.** **ALL 110 `refs` MOVED
   OFF THE STALE TRAP NUMBER** — every entry now pins **`[spec v18 2026-08-04]`** instead of
   **`[spec v1.6 2026-07-28]`**, so Rule 42's version-pin mechanism can finally fire, and no entry
   exceeds the 248-character limit. **RAW MARKUP IS NOW 0 OF 110** — the ten cases showing raw
   `<ol>`/`<li>` to the tester (C29558, C29559, C29571, C29574, C29589, C29595, C29608, C29616,
   C38881, C38904, in all three text fields) are repaired; they were in the pre-write snapshot, so they
   **predate this pass**. **⚠️ THIS CLAIM IS UNTRUE AND IS CORRECTED 2026-08-06: a live census found 14
   of 114 cases still showing raw markup to the tester, 11 of them written by THIS pass. Superseded
   wording kept above; see CORRECTION 1 in the 2026-08-06 block. Repair NOT yet authorised.**
   **WRITES: 110 × `update_case`, every one HTTP 200 + byte-verified MATCH, 30
   fields compared each, 0 mismatches, 0 collateral changes**, with **all four fields on every payload**
   (`custom_preconds`, `custom_steps`, `custom_expected`, `refs`) because TestRail re-renders any
   omitted text field; **0 add / 0 delete / 0 section / 0 run writes; no result logged anywhere.**
   **Run 352 PROVEN UNDAMAGED** — `include_all` still false, 110 tests, test-id and case-id sets equal
   both directions, **all 458 result records present BY ID with 0 graded fields changed and 0 new
   results during the write window**; the 458 moved `case_refs` values are the **declared read-time
   echo** of the refs edit. **Untouched-proof is BY CONTENT, never by `updated_on`** — a sibling pass
   found 14 Report Suite cases whose text changed while the timestamp stood still. **Rule 59 satisfied:
   sources read at pass start 19:53Z and RE-READ at write start 21:34Z, verdict UNCHANGED.** **ONE
   TICKET FILED: [SV-8912](https://shopview.atlassian.net/browse/SV-8912)** — Story Defect · parent
   **SV-8798** (the owning story, itself a child of the epic) · priority **Low** · `relates to`
   SV-8798 · Open · 11 field checks read back all PASS · duplicate-searched with four JQL queries
   first · test data named (**Bahampton Holdings**, 6 work orders, with what was ruled out).
   **NOTHING WAS CREATED OR DELETED ON THE BRANCH** — no ZZAUTOTEST data exists from this pass because
   none was ever needed; every data state the 110 cases require already existed and was used read-only.
   **The 15 HOLDs are waiting on four things, and the four rows total exactly 15:** Branko's
   Parts/Reports product write-up (**10** — the bars ARE built, nothing documents what they should do) ·
   a second test login on this branch (**2** — C29615, C38895) · the page-search rollout finishing
   (**2**) · an account whose filters were saved before the redesign (**1**).
   **🔴 COVERAGE-COMPLETENESS IS *NOT* ESTABLISHED, AND FILTERS MAY NOT BE DESCRIBED AS COMPLETE
   WITHOUT THAT QUALIFIER.** This pass verified all 110 cases we **have**; it did **not** re-derive
   whether **110 is the right set** — the requirement→case direction Rule 43 requires. **Vlad (the
   automation engineer) has raised an ELEVEN-ROW requirement-side gap table**, transcribed and queued
   at **`build/filters/vlad-gap-review-QUEUED.md`** and tracked as register row **F9**. **Nothing has
   been analysed, checked or verified on it; no TestRail or Jira call was made.** It is queued on the
   QA lead's own instruction, verbatim: *"But do that after everything else has ben done."* **⚠️ NO
   LONGER TRUE — the review WAS worked on 2026-08-06 (all twelve rows verdicted from documents; see the
   2026-08-06 block above and `build/filters/vlad-gap-review-2026-08-06/`). Kept as the record of where
   the 5 August pass stopped.** The rows
   span `S9-R2/S9-R3`, `S11-R7`, `S10-R2`, `S13-R19`, `S13-N4`, `S14-R6`, Parts views, the Reports
   date-range URL contract, `R3 Q5` parity, `R3 Q5` single-range, and mobile imported-exclusivity —
   and **row 1 is the sharpest: it alleges our cases assert the REJECTED Status-chip behaviour rather
   than the DECIDED one, which would be a Rule-57-class defect and not merely a gap.** Four rows name
   cases that already exist (C38896, C38908, C38882, C38877), so those are PARTIAL-coverage claims
   needing both texts quoted side by side (Rule 45(e)) before we agree or disagree.
   **⚠️ Rule-49 queue OPEN (`full-viu-2026-08-05/RECHECK-QUEUE.md`) — the branch is NOT declared
   final, so all 110 verdicts are PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 14:25 UTC (THE FINAL-CHECK PASS: THE BUILD IS NO LONGER TREATED AS A
   SOURCE OF EXPECTED BEHAVIOUR, AND THE 8 PHONE CASES ARE FINALLY OBSERVED; resume
   `build/filters/expected-behaviour-audit-2026-08-05.md` then `build/filters/final-viu-2026-08-05/FINDINGS.md`):**
   the QA lead found **FLT-BAR-01 = C29557** stating what the build does instead of what the spec
   requires — *"I am shocked to see that how come you considered the Build behavior as the expected
   behavior?"* — and **he was right**. An audit of **all 110** (committed BEFORE any repair) classified
   every case: **A=5 build-derived over a documented requirement · B=0 spec silent · C=104 legitimate ·
   D=1 over-specified**. The five all carried *"Known and accepted: … The product behaves this way **on
   purpose for now. Do not raise this as a new problem.**"* over a requirement the PRD states plainly —
   **C29557 vs S1-R1, C29602 vs S1-R5, C29606 vs S8-R3, C29607 vs S8-R4/R5, and C38899 whose waiver was
   about a screen that case does not even test.** **Nothing supported "on purpose"**; the tickets behind
   them had merely been *closed*, and **a closed ticket is a decision about whether to fix, never an
   amendment to the spec.** **Class B is ZERO**, so every one had a documented requirement to return to
   and **none needs Branko**. **SV-8843 and SV-8847 were closed OBSOLETE under OUR OWN shared account**
   (4 Aug 21:41:31 / 22:02:41 −0500 — Rule 53's corollary), and **Ahtasham had independently filed
   [SV-8876](https://shopview.atlassian.net/browse/SV-8876) at 06:17 today quoting C29557's waiver note
   back at us — he found it eight hours before we did** (untouched, Rule 38; ~~it is Branko's question~~ —
   **CORRECTED 2026-08-06: Ahtasham CLOSED IT HIMSELF as Done on 5 August at 08:38:16−0500, so it was never
   Branko's to answer; see the corrected OUTSTANDING line further down this entry, which also records that
   his closing comment says he edited OUR case C29557**).
   **A second sweep answered his follow-up ask** (*"steps correctly VIU'd but the expectation quietly
   changed in the same edit"*): 26 commits replayed comparing steps against the **assertion body only**
   → **16 both-changed, 14 legitimate label work, 2 genuine reversals both driven by a document** (C38882
   by Confluence v18 published the previous evening; C29609/C29610 by S9-R2/S9-R3 superseding Branko's own
   17 July answer). **The five waivers were NOT camouflaged — steps byte-identical across the introducing
   commit.** **The reusable tell: if the new expectation cannot be quoted back to a document, the case has
   been disarmed.** **A FRESH SIGN-IN ARRIVED, so THE 8 PHONE CASES ARE SETTLED** at **390 × 844 touch**:
   the **combined "All Filters" sheet defers correctly** (two ticks fired **ZERO** list requests, address
   bar untouched, the button then applied both), a **single filter's own sheet does NOT** (tapping *Paid*
   changed the URL at once, the sheet closed, **no Apply button anywhere in the document**) — covered by
   **SV-8875**, so **nothing filed**; and **THE BUTTON'S EXACT LABEL IS `Apply Filters` WITH A CAPITAL F**
   (`data-test-id="apply_filters"`) while the spec writes *"Apply filters"*. **THREE CLOSED TICKETS STILL
   REPRODUCE:** **SV-8843** — measured tabs y81–121 vs bar y86–116, **flex siblings in one row**, so the
   bar is beside the tabs — **but its own claim "collapsing frees no space" is WRONG** (collapse moved the
   table y184→y144 and hid all 5 chips, so **S1-R5 PASSES** and only C29557 deviates); **SV-8847** — both
   halves, though **"clearing filters does not clear the query" PASSES**; **SV-8845** — **still reproduces
   and worse: on a phone EVERY filter link is ignored and `filters[0][value]=estimate` is sent instead**
   (proven on declined/paid/imported, 30 Estimates each) while the chips read *"Status (1)"*, and the same
   link on desktop correctly returns 7 Declined. **Closed OBSOLETE by Ahtasham this morning; NOT reopened
   — the QA lead's call, and our recommendation is that this is the one worth reopening.** **110
   `update_case`, every one HTTP 200 + byte-verified MATCH, 28 fields each, 0 mismatches, one write per
   case; 0 add / 0 delete / 0 section / 0 run writes; NO result logged anywhere.** **ALL 110 provenance
   lines now name the spec at CONFLUENCE VERSION 18** (the in-body *"1.6"* is the Rule-31(a) trap), and
   **16 EXPECT-FAIL cases no longer open "as per the build tested on…"** — literally false when the build
   fails the requirement. **MARKERS on all 110, read back live: READY 82 + READY-EXPECT-FAIL 18 + HOLD 10
   = 110 → READY-TO-AUTOMATE 100** (was 93: +8 phone, −1 for C38882 correctly moving to HOLD; the
   arithmetic gate holds). **⚠️ A NEW TESTRAIL NORMALISATION, FOUND THE HARD WAY: `update_case`
   RE-RENDERS ANY TEXT FIELD YOU OMIT FROM THE PAYLOAD through its HTML pipeline** — it wrapped
   `custom_preconds` and `custom_steps` in `<p>` and turned `\n` into `\r\n` on write 1 of 110; **a field
   sent explicitly is stored verbatim.** The byte-check caught it on case 1, **the batch STOPPED as Rule
   50 requires**, the fields were restored byte-exact, and every later payload carried all three text
   fields. **This matters here because this project shows markup LITERALLY to the tester** — same class as
   this morning's raw `<ol>`/`<li>`. **BELONGS IN `build/APP-ACTIONS-PLAYBOOK.md` §J — not edited from
   that worker, flagged in the register as F4.** **RUN 352 PROVEN UNDAMAGED** — include_all still false,
   110 tests, test-id and case_id sets equal both directions, **438 result records before and after with
   0 missing BY ID**, counters unchanged 36 Passed / 2 Failed; **the only field that moved is `case_refs`
   on 10 records, traced to exactly C29609/C29610, the only two cases whose `refs` we edited — a DERIVED
   read-time echo, same class as the declared `case_title` echo**; no graded field moved on any of the 438;
   Ahtasham logged nothing during the write window. **FOUR COUNTS live 110 · local 110 · id-map 110 ·
   import 110, set-equal BOTH directions**; id-map 0 blanks, refs 110/110, header byte-identical; shredding
   guard **PASSED** and independently re-checked; import header sha256 identical to all five peers.
   **0 deletions, 0 retirements — `delete_case` is irreversible and nothing earned it; the 27 July-retired
   cases and the 9 FLT-SRCH palette cases were NOT resurrected.** **QUEUES: `cleanup-2026-08-05/RECHECK-QUEUE.md`
   and its `PENDING-LIVE-CHECK.md` are CLOSED** (all 8 phone rows observed); `recheck-2026-08-05/` is
   banner-marked SUPERSEDED but **still OPEN**; **`final-viu-2026-08-05/RECHECK-QUEUE.md` is the live OPEN
   queue.** **HONEST LIMITS: 29 of the 110 were driven live THIS pass, not all 110** — the other 81 carry
   forward from the 04:20–04:53Z re-check **on the same build marker**, each labelled as such in
   `FINDINGS.md`; and **the branch is still NOT declared final, so every verdict is PROVISIONAL.**
   **OUTSTANDING: reopen SV-8845? (recommended) · ~~Branko owes SV-8876~~ **CORRECTED 2026-08-06 — SV-8876
   IS NOT BRANKO'S TO ANSWER AND IS NOT OUTSTANDING: it is CLOSED.** Read live 2026-08-06: type **Task**,
   **status Done**, resolution Done, resolved **2026-08-05T08:38:16−0500**, parent SV-8785, reporter
   **Ahtasham Amjad — who closed it himself**, verbatim: *"closing this as it was a gap with test case ,
   I've updated the test case here >>…/cases/view/29557 And created a story defect >> …/browse/SV-8883 as
   the build is not behaving as per PRD"*. **The old claim is kept struck-through because a
   silently-erased wrong claim is how a session re-asks a question a source has already answered — the
   exact embarrassment this workspace has had once.** **The half that IS still Branko's** — did he want the
   filter buttons on one row, in which case the developer job should be cancelled? — is **Filters item 5**
   on `build/filters/questions-2026-08-06/`. · a second test login for C29615 ·
   the branch declared final · the playbook §J note · Branko's Parts/Reports PRD.**
   **⚠️ AND IN THAT SAME CLOSING COMMENT AHTASHAM SAYS HE EDITED OUR CASE
   [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) (recorded 2026-08-06 under Rule 38).**
   Recorded as a FACT, **reported and NOT acted on** — we do not touch another author's cases and, by the
   same rule, ours are not his to edit. **This one needs the QA lead's eye specifically**, because C29557
   (FLT-BAR-01) is **the case at the centre of the whole expected-behaviour correction** — the one whose
   *"the product behaves this way on purpose for now"* waiver started the Rule-57 audit, and the one whose
   waiver note Ahtasham quoted back at us in SV-8876. **We do not know what he changed**: no before/after
   snapshot of his edit exists, and TestRail's `updated_by`/`updated_on` record only the LAST writer, which
   our own later passes have since overwritten. **So the honest position is that C29557 has been edited by
   someone else at least once and the change is not reconstructable from what we hold** — the QA lead's
   call on whether to ask him what he altered.
   **PRIOR STATUS 2026-08-05 12:30 UTC (CLEANUP PASS: 25 CASES REPAIRED, ALL BYTE-VERIFIED; resume
   `build/filters/cleanup-2026-08-05/` then `build/filters/READINESS-2026-08-05.md`):** build confirmed
   by us at **both ends** — `v3.4.2-d00239b`, last-mod Tue 04 Aug 22:51:02 GMT, etag `b9ab1d41…`,
   **identical at 11:59:30Z and 12:20:02Z down to the sha256 of `index.html`**, so no redeploy under us.
   **33 `update_case` over 25 distinct cases in two passes, every one HTTP 200 + byte-verified MATCH,
   28 fields compared each, 0 mismatches; the 85 untouched cases proven byte-identical INCLUDING
   `updated_on`/`updated_by`; 0 add / 0 delete / 0 section / 0 run writes.** **(1) THE 8 PHONE CASES —
   `SV-8825 IS ANSWERED AND CLOSED`:** Branko commented **2026-08-05T05:18:22-0500** *"This is updated in
   the filters prd, I'm closing it."* and closed it Done — read live by us, not taken on trust. Spec
   **Confluence v18** rules it (**§4 Key Decisions** + **S12-R6**, both quoted verbatim in
   `SOURCE-CURRENCY.md`): a phone applies **only on tapping "Apply filters"**. The false
   *"DO NOT AUTOMATE YET … the question is open as SV-8825"* line is **GONE from all 8**, and
   **FLT-MOB-04 = C29624 was REVERSED** (it asserted the opposite of the ratified spec) with a **Rule-56
   divergence sentence**; the other 7 got a **confirmation** citation only, per Rule 56's honesty half
   (**no divergence sentence where nothing diverged**). **S12-R6 covers a SINGLE filter's sheet, not just
   the combined one** — the chain is S12-R2's *"one exception (see S12-R5)"*, a **stale cross-reference**
   left by his own **v17** renumbering (*"deferred-apply requirement renumbered to S12-R6"*), so
   **S12-R2's "see S12-R5" is a spec defect Branko still owes**. **(2) NO DEFECT FILED — it already
   exists:** **[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** (Story Defect, Open, parent
   SV-8797, **Ahtasham Amjad 05:50:12-0500 — 32 min after Branko's closure**) reports exactly it, reaches
   the **same** S12-R6 reading we reached independently, and **names our own C29622/C29623/C29624**. Not
   touched (Rule 38). **(3) ALL 8 CARRY `AUTOMATION: HOLD - needs one live check…` AND STATE-1 PROVENANCE
   WITH NO BUILD DATE** — because **every `.qa.shopview.com` cookie set is DEAD** (401 `sso_required`; all
   four share the same expired `sv_sso_session`; `quick-login` is itself session-gated and 401s too), so
   **nothing was observed on the app** and READY/EXPECT-FAIL would both assert a build fact we have not
   seen (Rule 12). **⇒ READY-TO-AUTOMATE STAYS AT 93 of 110 — it does NOT reach 101 this pass**; it
   becomes 101 in ~10 minutes once cookies land (`PENDING-LIVE-CHECK.md` names the exact steps + test
   data; a **4th Rule-49 queue** holds a row per case). **(4) THE DEAD GITHUB LINK — the owner-only fix
   would have produced a DIFFERENT dead link:** `bmuzamil-shopview/…` = 403, and
   `bilalmuzamil-sketch/…/blob/main/…` = **404 because THERE IS NO `main` BRANCH on this repo** (only four
   `claude/*` session branches; default HEAD = `claude/slack-session-0sxnd9`). **`blob/HEAD/` was used,
   verified HTTP 200 before and after.** Fixed on **10** cases; **REMOVED from 7** more where that file is
   **not** what the expectation rests on (Rule 54 bars citing a non-load-bearing source). **(5) RAW
   MARKUP:** all **10** listed cases verified broken from live text, each broken in **all three** fields,
   **no 11th found in a sweep of 110**, converted to plain numbered text — **formatting only**; and
   **C29613 had TWO provenance lines**, the stale `<hr /><p>` copy removed, so **110/110 now carry it
   exactly once**. **RUN 352 PROVEN UNTOUCHED** — include_all still false, 110 tests, test-id and case_id
   sets equal both ways, **all 429 prior result records present BY ID, 0 with any graded field changed**;
   the only field that moved on 5 of them is **`case_title`** (TestRail's read-time display copy —
   **independently corroborates playbook DECLARED NORMALISATION #2**), and **9 NEW results are Ahtasham's
   own grading during our window** (user 7, 12:02–12:25Z; counters 27P/5F → 36P/2F). **DELIVERABLES:**
   local source re-synced **from live before** regenerating (47 fields, then 8 more); **shredding guard
   RAN and PASSED (0 shredded), import independently re-checked = 0 rows with the signature**; id-map
   **re-merged FROM LIVE twice** (the generator blanks C-ids **and** drops `refs` every rerun) → **110
   rows, 0 blanks, refs 110/110, header byte-identical to the committed one, refs+titles byte-equal to
   live 110/110**; **four counts set-equal BOTH ways (live 110 / local 110 / id-map 110 / import 110)**;
   import header sha256 **identical to all 4 peers**. **ALSO FOUND, REPORTED NOT FIXED:**
   **[SV-8845](https://shopview.atlassian.net/browse/SV-8845) is now OBSOLETE/Done** (Ahtasham
   04:41:58-0500) yet **2 of our cases still call it open**; **all 110 provenance lines say "spec version
   1.6" while live Confluence is 18** (the Rule-31(a) trap — wants ONE authorised pass over all 110);
   the button may really read **"Apply Filters"** with a capital F (another run's capture; **spec-sourced
   lowercase kept, NOT live-confirmed**); **`get_sections` NEEDS PAGING — 625 sections exist and an
   unpaged call returns 250 and silently finds ZERO Filters sections** (added to playbook §J); and the
   earlier note that SV-8825 was answered *"28 minutes"* after the readiness report is **wrong — the gap
   was five and a half hours**, a −0500 timestamp read as UTC. **New epic state: SV-8785 has 20 children**
   (+SV-8876, a clarification on ground the QA lead already closed as accepted in SV-8843) plus **3 new
   Story Defects today — SV-8872, SV-8875, SV-8878** (all Ahtasham); **SV-8787 + SV-8788 are now QA
   Complete**. **⚠️ Branch still NOT declared final — every verdict remains PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 (AUTOMATION MARKERS WRITTEN, 102 of 110; resume
   `build/automation-markers-2026-08-05/` then `build/filters/PROJECT-STATE.md` §0-MARKERS-2026-08-05):**
   the QA lead's machine-findable automation marker is now on **102 of the 110** cases, at the **very end
   of Expected Results after the Rule-54 provenance line**, blank line before, line break after (his exact
   placement). **74 `AUTOMATION: READY` · 19 `AUTOMATION: READY - EXPECT FAIL (<ticket>)` · 9
   `AUTOMATION: HOLD - <reason>`** (8 not-built + 1 needing a second test login). **Arithmetic check
   PASSED: READY + READY-EXPECT-FAIL = 93 = the readiness figure exactly.** **102 × `update_case`, every
   one HTTP 200 + byte-verified MATCH, 30 fields compared each, 0 collateral changes**; `refs` not written
   on any op; **0 add / 0 delete / 0 section / 0 run writes**; **provenance lines deliberately NOT
   re-stamped** (nothing was re-observed, so a new tested-on date would be a false claim). Build confirmed
   **byte-identical at the start on all three markers** (`v3.4.2-d00239b`, last-mod Tue 04 Aug 22:51:02
   GMT, etag `b9ab1d41…`). **Run 352 PROVEN UNTOUCHED** — 110 tests, **427** result records (not 425:
   Ahtasham has since logged 2 more Passed, so he now stands at **25 Passed / 7 Failed**), case_id sets
   equal both ways, every prior result present BY ID and byte-identical.
   **⚠️ THE 8 PHONE CASES WERE DELIBERATELY NOT WRITTEN — Branko ANSWERED AND CLOSED
   [SV-8825](https://shopview.atlassian.net/browse/SV-8825) at 2026-08-05T05:18:22Z** (*"This is updated
   in the filters prd, I'm closing it."*) — **28 minutes AFTER `READINESS-2026-08-05.md` was finished
   saying it was still Open with zero comments.** Spec **v18** now rules it (§4 Key Decisions + **S12-R6**
   *"mobile does not filter in real time… only when the user taps an 'Apply filters' button"*, and *"This
   confirms intent"*). So FLT-MOB-01/02/03/04/05/06/07/10 (C29621–C29627, C29630) are **no longer waiting
   on the PO**, their existing *"the question is open as SV-8825"* line is **now FALSE**, and their verdict
   is **unknown** (the build applies as you tap = contradicts a ratified requirement, and there is **no
   defect ticket**). **Needs ONE authorised pass: correct the 8, raise one Low defect on epic SV-8785 with
   story SV-8797 linked, set their markers to READY-EXPECT-FAIL → ready figure 93 → 101 of 110.** Write-up
   `automation-markers-2026-08-05/SV-8825-ANSWERED.md`. **LESSON (Rule 31): a readiness figure has a shelf
   life measured in MINUTES when a PO is active — re-read the blocking ticket at the moment you rely on
   it.** Deliverables re-verified: local source re-synced FROM LIVE first (exactly 102 `expected` fields
   moved), shredding guard **PASSED** (and note: **the Filters import was NOT still corrupt** — the
   5 Aug recheck pass had already repaired it, correcting the standing note), import differs from its
   predecessor in **one column, 102 rows, only by the appended marker**, all four counts **= 110 set-equal
   both ways**, id-map came back **byte-identical (0 blanks, refs 110/110)**, import header **sha256
   identical to all 5 peers**. **Two defects in our own data, reported not fixed:** the GitHub links inside
   the provenance lines point at **`bmuzamil-shopview/Manual-test-Cases`, which does NOT resolve (403)** —
   the repo is `bilalmuzamil-sketch/Manual-test-Cases`; and **10 cases show raw `<ol>`/`<li>` markup to the
   tester** (C29557/29560/29566/29568/29573/29575/29582/29613/29625/38911, **predates this pass**).
   **⚠️ Rule-49 queue STILL OPEN — branch not declared final, all 110 verdicts PROVISIONAL.**
   **PRIOR STATUS 2026-08-05 (FULL RULE-49 RE-CHECK AGAINST THE REBUILT BRANCH; resume
   `build/filters/recheck-2026-08-05/` then `build/filters/PROJECT-STATE.md` §0-RECHECK-2026-08-05):**
   the `sv8785` branch redeployed overnight (`v3.4.2-4f8211c` → **`v3.4.2-d00239b`**, last-modified
   Tue 04 Aug 22:51:02 GMT, etag `b9ab1d41…`; marker read at start/mid/end — **identical all three, no
   redeploy under us**), so the queue was re-run **IN FULL: 110 of 110 rows, no sampling — 91 CONFIRMED
   / 19 CHANGED.** **110 × `update_case`, every one HTTP 200 + byte-verified MATCH, 28 fields compared
   each** (Rule 50); **0 add / 0 delete / 0 section / 0 run writes**. **All 110 provenance lines
   re-stamped to `v3.4.2-d00239b` + 8/5/2026, exactly once each** (0 name the old build, 0 doubled).
   **Run 352 PROVEN UNTOUCHED both times** — 110 tests, **425 result records**, case_id sets equal both
   ways, **every prior result present BY ID and byte-identical field by field**; **Ahtasham Amjad's 30
   results (23 Passed / 7 Failed) exactly as he left them.** **THE 19 CHANGES:** **SV-8824 IS FIXED**
   (dropdown now stays open — proven on all five chips, 2nd + 3rd values tickable without reopening;
   Jira independently **Ready for QA**) → the false known-issue line removed from **12 cases**
   (STAT-03/04/05, CUST-03/05/07, TECH-03/05, ADV-03/05, ASSET-05, CHIP-01) — **our judgement call
   applying the QA lead's own rule, flagged for retrospective confirmation**; **SV-8844 IS FIXED** (no
   `search` key in the saved pref, no PUT sent, fresh browser returns the full 30 rows) → line
   **DELETED** from PSRCH-10/11/12 per his decision 1; **SV-8843 + SV-8847 STILL REPRODUCE
   byte-identically** → the 5 cases (BAR-01, COLL-02, EMPTY-01, EMPTY-02, PSRCH-09) carry his
   accepted-behaviour wording, **and the defence register records plainly that SV-8843 was closed as
   "Not Reproducible Anymore" while the build contradicts that reason**; **FLT-RPTS-23 = C38882**
   (id-map name; the ask said FLT-RPTS-13) NOTBUILT → **PASS**, rewritten scope-conditionally (Rule 42)
   to spec **Confluence v18** — the Reports date filter IS built and matches: opens on "Date Range: This
   month", offers 11 ready-made periods + Custom + Clear Selection, a period applies on selection
   (`?range=today`), a custom range applies **only on the 2nd date** (From 07/01/2026 alone fired no
   request; adding To 07/31/2026 gave `?range=custom&range=2026-07-01&range=2026-07-31`);
   **FLT-PERS-01 → DEVIATION** on a **NEW defect [SV-8871](https://shopview.atlassian.net/browse/SV-8871)**
   (**filed by us** as a **Bug, Low, parent SV-8785, Product Area Work Orders**, linked SV-8792 + SV-8795,
   Open, duplicate search run first — **that was byte-verified at filing and was the correct shape on
   2026-08-04, but it is NOT its shape now: Ahtasham Amjad converted it via the Jira "Change work type"
   wizard on 2026-08-05T04:51:42-0500, which changed the type Bug → Story Defect AND atomically
   re-parented it SV-8785 → SV-8795 (12 ms apart in the changelog), and the same conversion SILENTLY
   WIPED Product Area to empty. Jira logged the type and the parent move but records NO Product Area
   changelog entry at all, so the loss of "Work Orders" is provable ONLY from our byte-verification at
   filing time. LIVE NOW (read 2026-08-05): Story Defect · parent SV-8795 · Product Area NULL · Low ·
   Open. Do NOT reverse it — it is another author's deliberate triage (Rule 53's corollary); re-instating
   Product Area is the QA lead's call**) — a restored **Customer / Lead Technician / Service Advisor** button comes back
   blue but **WITHOUT its value name** on all four restore routes (nav-away, reload, fresh browser,
   shared link) while **Status and Asset on Site keep theirs**; breaches **S7-R1** *"…and displays the
   selected value(s)"* + **S10-R1** *"restored exactly as they were left"*; **honestly NOT callable a
   regression** — the 4 Aug pass tested persistence only with the two unaffected filters;
   **FLT-PERS-04 → DEVIATION: OUR 4 AUGUST PASS WAS WRONG AND AHTASHAM WAS RIGHT** — seeded properly
   (throwaway *ZZAUTOTEST Filters Recheck* + *Lastone Construction*, deleted while off-page) the
   dropdown hides the deleted customer but the URL **and** the request still carry it = his open
   **SV-8832**; **FLT-URL-02** keeps DEVIATION with a **second** reason (desktop label loss, SV-8871).
   **NEW TALLY: PASS 74 / DEVIATION 19 / HELD 8 / NOTBUILT 8 / second-sign-in 1 = 110** (was
   60/32/8/9/1); **ready to automate 89** (was 88). **SV-8825 (mobile Apply button) STILL UNANSWERED**
   — Open, **0 comments** — so the 8 mobile cases keep DO-NOT-AUTOMATE. **Nothing new shipped on
   Parts/Reports filter bars** (observations byte-identical). **Spec = Confluence v18** (2026-08-04T18:19:21Z,
   Branko: *"Date-range filter: reflect current in-app default range and standard predefined ranges"*),
   128 requirements unchanged — **and the page BODY still reads "Version: 1.6", the exact Rule-31(a)
   trap; go by the Confluence number.** **Deliverables:** local source **re-synced FROM live BEFORE
   regenerating** (114 fields), shredding guard **PASSED**, and the generator's gotcha fired again — it
   blanks the id-map C-ids **and drops the `refs` column** every rerun, so both were re-merged from live
   (110 rows, 0 blanks, refs 110/110); **all four counts = 110, set-equal BOTH directions**; import
   header **sha256 identical to all 4 peer imports**. **Readiness recounted —
   `build/filters/READINESS-2026-08-05.md`, EVERY row and the total now ADD UP** (the 4 Aug file is kept
   but marked SUPERSEDED); the 4-cases-in-two-columns / 1-case-in-none overlaps are stated in the open,
   and the 4 Aug note that named **FLT-MOB-10** as the double-counted phone case is corrected to
   **FLT-MOB-09**. Env clean: throwaway customer deleted + **proven absent two ways**, filters cleared,
   Reports range back to This month, one sign-in reused. **⚠️ Rule-49 queue STILL OPEN — the branch has
   NOT been declared final, so all 110 verdicts remain PROVISIONAL.**
   **STATUS 2026-08-04 (SUPERSEDED — STANDING RULE 54 PROVENANCE RETROFIT EXECUTED, user-authorized;
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
   **STATUS 2026-07-27 (SUPERSEDED — EPIC SV-8685 BACKFILL + DESIGN/JIRA DELTAS + NEW-SCOPE, LOCAL
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
   **🔴 SOURCE-CURRENCY GAP, RECORDED 2026-08-06 (Standing Rule 31) — THE SCHEDULE SPECIFICATION IS AT
   CONFLUENCE v25 AND OUR RECORDS SAY v23. TWO VERSIONS ARE UNINGESTED.** Read live 2026-08-06:
   `GET /wiki/api/v2/pages/713031682` → **HTTP 200, Confluence version 25, last edited
   2026-08-06T09:13:51Z**. Every "spec CURRENT at Confluence v23" line in this entry, and **every one of the
   168 cases' Rule-54 provenance lines naming "the Schedule specification version 23"**, is therefore
   **STALE until the diff is done** — a version pin is only worth anything if it is the right version
   (Rule 42). **This is recorded as a GAP, not resolved here: the v23 → v25 diff has NOT been attempted by
   this note** (a separate worker is running it), so nothing below is re-verdicted and no case was touched.
   Consequences to keep in view rather than assume away: a moved requirement re-opens its per-requirement
   coverage verdict (Rule 43), and any case whose anchor moved needs re-checking (Rule 41). **The in-body
   "Version" field on that page still reads `1.0` — Rule 31's trap (a); go by the Confluence number.**
   **OUTSTANDING: the v23 → v25 diff, then a re-stamp of the affected provenance lines.**
   **STATUS 2026-08-06 (LATEST — THE FULL LIVE PASS ACROSS TWO BUILDS: ALL 168 WRITTEN AND
   BYTE-VERIFIED, 156 OF 168 OBSERVED, READY TO AUTOMATE 140. Resume
   `build/schedule/READINESS-2026-08-06.md` → `build/schedule/full-viu-2026-08-05/{FINDINGS,RESUME,
   CHANGES-MADE,RECHECK-QUEUE,FILED,NEW-TICKETS-ASSESSED,API-ASK,SOURCE-CURRENCY,
   TECH-HOURS-RESOLVED-2026-08-06,SV-8923-WITHDRAWN,COMMIT-SCOPING-LESSON-2026-08-06}.md` →
   `build/schedule/PROJECT-STATE.md`):** **168 × `update_case`, every one HTTP 200, 30 fields compared
   each, 0 mismatches, 0 collateral changes**, all three text fields on every op; read back live,
   **exactly one provenance line, one build stamp and one marker on every case, 0 raw markup, 0 barred
   phrases**. **MARKERS: 119 `READY` · 21 `READY - EXPECT FAIL` · 28 `HOLD` = 168. THE ARITHMETIC GATE
   PASSES: 119 + 21 = 140 = 168 − 28**, both arithmetics read back from the live cases rather than
   computed from our notes. **Run 357 PROVEN UNTOUCHED** — 168 tests, **429** results, all present BY
   ID, 0 graded and 0 derived fields changed, `include_all` still false. **THE HONEST SPLIT: 156 of the
   168 were observed, 12 have NEVER been observed and say so on themselves** — they need a **second
   sign-in as a non-administrator**, and impersonation was deliberately NOT used because a sibling
   worker shares the session (`quick-login` and `switch-user` were never called). **The 168 verdicts do
   not all come from one build: 90 were seen on `v3.5-7ec992f`** (last-mod Wed 05 Aug 22:49:36 GMT,
   etag `e2a80a6ab5e0b47c29fd88af9db1e980`, byte-identical at session start and end) **and 78 on
   `v3.5-d122eef`, which no longer exists** — and Rule-54 sentence 2 now names the marker **that case
   was actually seen on**, so the split is visible per case instead of hidden in an average.
   **🔴 A REGRESSION WAS FOUND IN A CASE WE HAD ALREADY PASSED: SCH-DND-08 =
   [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)'s CLICK-TO-ARM ALTERNATIVE TO
   DRAGGING HAS BEEN REMOVED between `v3.5-be42149` and `v3.5-7ec992f`** — zero controls anywhere carry
   it, on load, on hover, or in the expanded line list (it had been proven BUILT on 5 August:
   `button_sidebar_arm_<woId>`, `aria-pressed`). Filed **[SV-8957](https://shopview.atlassian.net/browse/SV-8957)**.
   **Its absence is also WHY 7 CASES COULD NOT BE RE-DRIVEN** — the drag will not complete through our
   tooling and the click route no longer exists: **C29967, C29982, C29984, C29985, C30004, C30013,
   C30020**, all now `HOLD - not re-checked against the current build`. **SEVEN CASES STOPPED BEING
   FAILURES** (SV-8857, SV-8849 and SV-8850 are fixed; the create-event toast and Undo now exist; event
   cards are structurally distinct; the tooltip caps line names at three) — **every one of those
   tickets is still Open or Ready to Fix in Jira, which is exactly why ticket status is never used as a
   verdict (Rule 61).** **ONE FEATURE SHIPPED** (the long-series and 120-shift guards on the scheduling
   endpoint now exist and behave correctly). **ONE TICKET OF OURS WAS WITHDRAWN AS INVALID** —
   **SV-8923**, closed OBSOLETE, because it had been raised against a shop with no business hours
   configured, which the source case's own precondition required. **TWO NEAR-MISS FALSE DEFECTS WERE
   AVOIDED BY LOOKING TWICE**, and one of them was ours: a "the working-hours service is broken" report
   was **our own missed click** — the Save button sat below the fold and the coordinate click landed on
   nothing (`scrollIntoViewIfNeeded()` then click → `POST /change` 201 + `PUT /working-hours` 200, value
   read back). **The 28 HOLDs, grouped:** 13 waiting on a second sign-in as a different user (the whole
   Permissions area plus two API cases and one Filter-and-Display case) · 7 needing a drag our tooling
   cannot complete · 3 waiting on a product-owner answer **that has never been sent** · 3 whose feature
   is simply not in the build · 1 needing shifts noted before a release already deployed · 1 needing a
   user with no staff record of their own.
   **⚠️ THE DESIGN BASELINE MAY BE STALE, AND IT IS RECORDED AS A PARTIAL SOURCE (Rule 31), NOT
   ASSUMED FINE.** **Sasha Grosman's three tickets — SV-8915, SV-8916, SV-8917 — all close with the same
   source: `Design: https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?file=Schedule.dc.html&via=share`,
   each *"Raised in the Schedule design review with Fabian on 5 Aug 2026"*.** That is a **share URL to a
   live, editable design page with no version or date on it** — **NOT** the artefact we ingested
   (`build/schedule/design-2026-07-27/`, the Claude prototype Branko ruled authoritative at Q0), and
   **~48 of our labels were pinned from that prototype**. Consequences stated rather than assumed: we
   **cannot verify any of Sasha's three design-sourced claims against a design we hold**; **SV-8916
   could not be verified at all** — its button is in *his* design and in **no requirement of spec v23**;
   and **if his link is newer, our design baseline is stale**, so the next Schedule pre-flight must
   fetch and diff it. **What is owed: confirmation of which design artefact is canonical.**
   **⚠️ Rule-49 queue OPEN (`full-viu-2026-08-05/RECHECK-QUEUE.md`, opened 2026-08-06) — the branch is
   NOT declared final, so all 168 verdicts are PROVISIONAL. This pass drove the 27 previously
   unobserved cases and re-drove 18 of the 25 stale deviations; it was NOT a fresh live run of all 168
   and does not claim to be.**
   **PRIOR STATUS 2026-08-05 ~17:30 UTC (THE SUITE IS 168 CASES, READY TO AUTOMATE 160; three coverage
   gaps authored, run 357 union-synced, and all 165 provenance lines re-worded off the build. Resume
   `build/schedule/PROJECT-STATE.md` §0-PROVENANCE-REWORD-2026-08-05 → `build/schedule/provenance-reword-2026-08-05/`
   {`SOURCE-CURRENCY`,`testrail-execution-log`,`NEW-CASES`,`RECHECK-QUEUE`}`.md` → `build/schedule/READINESS-2026-08-05.md`
   (banner + the RECOUNT section at its end)):** **THE BUILD MOVED A THIRD TIME IN TWO DAYS —
   `v3.5-be42149` → `v3.5-d122eef`**, last-modified Wed 05 Aug 2026 **15:35:43** GMT, etag
   `dd1c57e2fb4beba9758b62a29afdeaab`, read at 17:11:48Z and 17:29:54Z with `index.html` **sha256 identical
   both times**. Engineering will **not** declare the branch final before release, so an **OPEN Rule-49 queue is
   this project's normal steady state**, and the LIVE queue is now
   `provenance-reword-2026-08-05/RECHECK-QUEUE.md`. **THE THREE COVERAGE GAPS THAT THE 14:15 PASS LEFT
   UNAUTHORED ARE NOW AUTHORED** (QA-lead authorised: *"Yes authorized for Scheduling three coverage gaps."*),
   **all three reproducing live on `v3.5-d122eef`, each with a CONTROL that rules out a harness artefact**:
   **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)**
   ([SV-8863](https://shopview.atlassian.net/browse/SV-8863) — which view the module opens on; `Week` carries
   `aria-pressed="true"` on arrival while `Day` is false — **and the requirement is story SV-8686's acceptance
   criterion, NOT the specification, which is SILENT on the default view**, so the case says so rather than
   inventing an anchor) · **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)**
   ([SV-8870](https://shopview.atlassian.net/browse/SV-8870) — Month-view drag-create does nothing, **zero
   requests sent**, while the identical drag in Week view opens the scope picker; **HELD, because §4.1 names no
   view and story SV-8688 names only Week — the Month-view question was NOT resolved from the build, it is
   Branko's to answer**) · **SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)**
   ([SV-8867](https://shopview.atlassian.net/browse/SV-8867) — a series block snaps back with no confirmation
   while an ordinary shift between the **same two lanes** raises *"Move this shift to MQ Test Tech Qamar?"*).
   **Their internal IDs were checked THREE ways** (not in the 195 bodies · not on the 27-case retired list ·
   not in the id-map) because another project reused a retired ID today and its resync **overwrote the retired
   record**. **No API case among them** (Rule 51 — the QA lead ruled *"No test cases for API only findings
   please"*). **ALL 165 PROVENANCE LINES RE-WORDED so no case credits the build for its expected behaviour**
   (Rule 54 as amended: sentence 1 names only documents, sentence 2 records neutrally the build the case was
   last checked against — the two must never merge): **165 distinct cases · 241 `update_case` ops · every one
   HTTP 200 + byte-verified MATCH, 28 fields compared each · 0 collateral changes**, and because all three text
   fields were sent on every payload **TestRail's omit-field re-render never fired — 0 of 168 carry raw markup
   or CRLF**. **Two defects in our own text removed, both findings:** 8 cases said the expectation was
   *"verified against the build"* (**two of those 8 are EXPECT-FAIL cases that fail on that very build**, so the
   line contradicted the case's own body) and **157 named `v3.5-be42149` as the build the branch "has since been
   rebuilt to" — true when written, false within hours**. **HONEST PER-CASE SPLIT: only 8 were ever re-observed
   on the newer build** (`Last checked against build v3.5-be42149 on 8/5/2026`); the other **157 carry
   `v3.5-4873abe` / 8/4/2026** — and **only 3 of the 168 (the new cases) were observed on `v3.5-d122eef`**.
   **RUN 357 UNION-SYNCED 165 → 168** — `include_all` is **false**, so adding cases had frozen the run out of
   date; `update_run` HTTP 200 with the **FULL union of 168**, `case_id` sets **equal in both directions**, all
   165 prior tests present **by id** (0 lost, 0 rebound), **all 429 prior result records present BY ID with 0
   graded-field changes and 0 echo movement**, 0 new results, only `untested_count`/`updated_on` moved on the run
   record. Executor `tools/run_sync_357_only.py` = the proven executor with `SCOPE` **cut to run 357 alone**, so
   runs 359 and 352 (other workers live) could not be touched; the unsafe 2026-07-31 script was not used.
   **THE GATE — RE-VERIFIED LIVE 2026-08-05 ~19:30Z: cases 168 − 3 waiting on the PO − 2 un-settable − 3 not
   built = READY TO AUTOMATE 160, and the live markers are READY 137 + READY-EXPECT-FAIL 23 = 160, HOLD 8 =
   3 PO + 2 un-settable + 3 not built. 168 markers on 168 cases, EXACTLY ONE EACH, 0 unmarked, 0 doubled.
   THE GATE PASSES.** The figure moved **158 → 160**. **FOUR COUNTS: live 168 · local active 168 (195 bodies −
   27 retired) · id-map 168 · import 168, set-equal in EVERY direction**; id-map **0 blanks, refs 168/168**;
   **shredding guard PASSED (0 of 168)**; import header sha256 **`f2d76051d8a42e62`, identical to all five
   peers**. **ENVIRONMENT, HONESTLY: nothing seeded, but ONE all-day event was reassigned by an imprecisely
   targeted early drag and was restored through the interface and proven byte-identical** — 366 shifts / 33
   events / 7 series, 0 added, 0 removed, 0 changed, id sets equal both ways (recorded in full in
   `NEW-CASES.md` rather than glossed). No role changed. **0 Jira issues created.** **⚠️ THE BRANCH IS STILL
   NOT DECLARED FINAL — every verdict remains PROVISIONAL, and 165 of the 168 have NOT been re-observed on the
   build running now.**
   **PRIOR STATUS 2026-08-05 ~14:15 UTC (FINAL VIU PASS: THE QA LEAD'S "EXPECTED BEHAVIOUR IS NOT THE
   BUILD" CORRECTION AUDITED ACROSS ALL 165 AND REPAIRED — its figures below are AS AT 14:15 and describe the
   165-case suite BEFORE the three coverage-gap cases above were authored; resume `build/schedule/expected-behaviour-audit-2026-08-05.md`
   → `build/schedule/final-viu-2026-08-05/FINDINGS.md` → `build/schedule/READINESS-2026-08-05.md` →
   `build/schedule/PROJECT-STATE.md` §0-FINAL-VIU-2026-08-05):** cookies arrived, the branch was reachable,
   build **`v3.5-be42149`** read at **13:24:01Z / 13:49:34Z / 14:11:22Z — `index.html` byte-identical all
   three**, etag `70e496609e155994b93f515db32d0289`. **THE AUDIT (written and committed BEFORE any repair):
   the expected-result BODIES were SOUND — 0 of 165 described build behaviour as the requirement**, and the
   27 cases where the build disagrees kept the documented expectation with the deviation in a separately
   labelled note quoting the spec and instructing FAIL. **THE DEFECT WAS THE PROVENANCE LINE, ON ALL 165** —
   every one read *"This is the expected behaviour **as per the build tested on** 8/4/2026 (v3.5-4873abe),
   and as per epic … and the specification …"*, crediting the build FIRST for the expectation, and on the 27
   deviation cases it was **FALSE and self-contradictory**. **Honest note: that phrasing is Standing Rule
   54's own, taken from the QA lead's earlier example sentence; his correction supersedes it (Rules 32/33).**
   **TWO ASSERTIONS HAD GENUINELY BEEN REWRITTEN TO THE BUILD**, found by diffing live text against the
   4 August pre-write snapshot with the provenance excluded: **SCH-SCOPE-05 = C29967 had come to assert that
   `Select all` and `Cancel` DO NOT EXIST** — the absence of two controls spec §4.3 requires — so it would
   have FAILED before that pass and PASSED after; **silently disarmed**, exactly the QA lead's point that a
   test which cannot fail is not a test. **SCH-LINE-03 = C29950** item 3 had been weakened to a near-tautology.
   Both **restored to the specification**. **THE steps-VIU'd-but-expectation-bent FAILURE MODE DID NOT OCCUR —
   for an unflattering reason: the 4 August pass changed 37 expected results and ZERO steps or preconditions**,
   so the Rule-9 label half of VIU was never done to the steps on any of the 165 (which is why 16 cases still
   showed raw `<ol>` markup) — **fixed this pass**. **AUDIT TALLY over 165: C 155 · A 2 · T 8 · B 0 · D 0**,
   with BOTH texts quoted side by side for every row (Rule 45(e)). **WRITTEN: 165 × `update_case`, every one
   HTTP 200 + byte-verified, 30 fields compared each, 0 mismatches, `refs` under the declared comma
   normalisation, 0 add / 0 delete / 0 section / 0 run writes.** Provenance now **credits the documented
   source** and names the build only as what the case was **checked against**, with an **honest per-case
   date** — the 7 re-observed today say *verified against v3.5-be42149 on 8/5/2026*, the other **158 say in
   their own text that they have NOT been re-checked** against the rebuilt branch. Also fixed: **17 dead
   `blob/main` links** (404 — there is no `main` branch) → `blob/HEAD` (both verified 200), **16 raw-markup
   cases** cleaned (formatting only), **C30010 → SV-8834** and **C30041 → SV-8874** instead of claiming no
   ticket exists. **MARKERS on all 165 (0 before): 137 `READY` · 21 `READY - EXPECT FAIL` · 7 `HOLD`.
   ARITHMETIC GATE PASSES: 137 + 21 = 158 = 165 − 2 PO − 2 un-settable − 3 not-built** (the 2 PO holds say
   honestly that **the shop-closures question has never been sent — the blocker is US**). **FOUR VERDICTS
   CHANGED LIVE: SCH-DND-08 = C29962 NOT-BUILT → PASS — click-to-arm IS BUILT** (`button_sidebar_arm_<woId>`,
   `aria-label="Schedule S-12876 by click"`, `aria-pressed`→`true`, label → *"Stop placing S-12876"*, and
   clicking a technician cell opens the same scope picker a drag does) · **SCH-WOL-04 = C29939 PASS →
   DEVIATION (SV-8873) — OUR VERDICT WAS WRONG**: `Andrew`→12 rows, `Wade`→12, but **`Andrew Wade`→0**,
   `andrew wade`→0, `Wade Andrew`→0, while multi-word `Vuchester Retail`→21 proves it is **not** a spaces
   problem · **SCH-SCOPE-05 = C29967 PASS → DEVIATION (SV-8886)** — tally reads `1 selected · 1h`, confirm
   reads `Schedule`, **no Select all, no Cancel** · **SCH-FILT-03 = C29944 PASS re-proven over ALL 8 statuses
   the filter accepts, 0 leaks** (the 6 empty ones are correct — the list holds only Approved ×90 + Review ×1
   of 91, though the org holds 1200 WOs across 6 statuses, which is useful for whoever fixes SV-8868) ·
   **SCH-LINE-03 = C29950 restored assertion PASSES — 533 of 533 sidebar lines approved** (`authorized` ×329,
   `complete` ×204). **ONE TICKET FILED: [SV-8886](https://shopview.atlassian.net/browse/SV-8886)** — FILED as
   Bug · **Low** · parent **SV-8685** · story **SV-8689** linked *Relates* · Product Area Schedule · 7-section
   format · **11 field checks read back, all PASS** · duplicate-searched with 4 JQL queries first · test data
   named on-screen (S-12876 / Pamill Paving / unit 713 / MQ Test Tech Qamar).
   **⚠️ IT NO LONGER READS THAT WAY — re-read LIVE 2026-08-05: SV-8886 is now a `Story Defect` (id 10007,
   subtask, hierarchy level −1) parented to STORY **SV-8689** ("Scope Picker"), with **Product Area NULL**;
   still Open / Low.** **Mudassir Qamar converted it at 2026-08-05T09:29:49 −0500** with the Jira UI "Change
   work type" wizard, which changed `issuetype` Bug → Story Defect **AND** re-parented it SV-8685 → SV-8689
   **in ONE atomic action** (changelog read live). **BOTH HALVES OF THE AUDIT TRAIL STAND: our filing was
   CORRECT for its date — the 11 field checks did pass and Product Area WAS Schedule when we set it — and
   someone else changed it afterwards.** **THE Product Area LOSS IS NOT IN THE CHANGELOG AT ALL** — the whole
   changelog logs only three fields ever (`IssueParentAssociation`, `Link`, `issuetype`), **so NOBODY can
   reconstruct that value from Jira's own history**; it is provable only because the ticket was byte-verified
   at filing (Rule 50). The shape now required is amended **Rule 52**; converting a ticket is never ours to
   do. **API-only finding STILL NOT
   FILED** (Rule 51) — and honestly, the 8-week/120-shift limits appear **only in the tech plan, nowhere in
   spec v23**, so there are three possible answers and we are not guessing: `final-viu-2026-08-05/API-ASK.md`.
   **`delete_case` called ZERO times** — 6 candidates considered, each kept with a reason (`DELETIONS.md`),
   and the 27 July-retired internal IDs are listed as **never-reuse** after another project lost a retired
   record to ID reuse today. **3 CANDIDATE COVERAGE GAPS deliberately NOT AUTHORED** (SV-8863 default view ·
   SV-8870 Month-view drag-create · SV-8867 reassigning a series member); IDs reserved `SCH-NAV-08`,
   `SCH-DND-09`, `SCH-REAS-07`. **⚠️ NO LONGER TRUE — all three WERE authored later the same day as
   C43554/C43555/C43556 (see the LATEST block above); this sentence is kept only as the record of where the
   14:15 pass stopped.** **SPEC DEFECT REPORTED NOT FIXED: §7 says the cell menu opens on left-click
   while §14.1/§14.2 twice call it a right-click menu.** **PROOFS: run 357 untouched** — 165 tests, **429**
   results, all present BY ID, **0 new, 0 fields changed on any of the 429** (not even `case_title` — nothing
   was retitled); **no result logged anywhere**. **Nothing seeded, nothing to restore** — 34 shifts / 9 events
   / 6 series **byte-identical** before and after, shift id sets **equal both directions**; the scope picker's
   confirm button was never pressed. **Four counts reconcile 165/165/165/165 set-equal both ways**; id-map
   came back **byte-identical, 0 blanks, refs 165/165**; **shredding guard PASSED**; import header sha256
   **identical to all 5 peers**. **SOURCES: spec CURRENT at Confluence v23** (last edited **30 July**, before
   our ingest; **its in-body Version still reads `1.0` — the Rule-31(a) trap confirmed again**), 33 apparent
   word-diff gaps each individually resolved as boundary artefacts of our mirror's annotations, **0
   requirements changed**; epic **26 children** verified two ways with equal key sets; **22 story defects**;
   **all ten of our tickets SV-8848…SV-8857 read live and STILL OPEN**. **THE HONEST LIMIT: only 7 of the 165
   were re-observed live** — the other 158 carry 4 August verdicts and say so on themselves; **the Rule-49
   queue is OPEN, the branch is NOT declared final, and every verdict is PROVISIONAL.** `READINESS-2026-08-05.md`
   written (the 4 Aug file kept + marked SUPERSEDED); `READINESS-2026-08-04.md` NOT deleted.
   **PRIOR STATUS 2026-08-05 (THE QA BRANCH WAS REBUILT; the authorised automation-marker pass
   DELIBERATELY WROTE NOTHING; resume `build/automation-markers-2026-08-05/SCHEDULE-HALTED.md` then
   `build/schedule/PROJECT-STATE.md` §0-BUILD-MOVED-2026-08-05):** the `sv8685` branch **redeployed at
   08:09 UTC on 5 August** — **`v3.5-4873abe` → `v3.5-be42149`**, last-modified Wed 05 Aug 2026 08:09:19
   GMT, etag `70e496609e155994b93f515db32d0289` (all three read live). **So every one of the 165 verdicts,
   and every one of the 165 provenance lines, names a build that no longer exists**, and the marker pass
   stopped before writing rather than assert "expect this to fail" / "this feature is not built" from a
   build nobody has observed (Rule 12 + Rule 49). **All 165 cases proven byte-identical before and after,
   including `updated_on`/`updated_by`; run 357 proven untouched** (165 tests, **429** result records,
   case_id sets equal both ways, every prior result present BY ID and byte-identical). **Honest split:
   142 of the 165 markers were build-INDEPENDENT and safe** (138 `READY` — which asserts *automatable*,
   not *currently passing*; 2 waiting on Branko for the shop-closure contradiction; 2 un-settable on this
   estate) **and 23 were NOT** (19 `READY - EXPECT FAIL (SV-88xx)` + 4 "not built"). **All ten defect
   tickets SV-8848…SV-8857 were read live and are STILL Open**, so the 19 probably still reproduce — but
   probably is not observed.
   **STATUS 2026-08-05 ~12:10 UTC (SUPERSEDED — THE RULE-49 RE-CHECK WAS ATTEMPTED AND COULD NOT RUN; resume
   `build/schedule/PROJECT-STATE.md` §0-RECHECK-ATTEMPT-2026-08-05 then
   `build/schedule/recheck-2026-08-05/`):** the branch redeployed at **08:09 UTC** (`v3.5-4873abe` →
   **`v3.5-be42149`**, last-modified Wed 05 Aug 08:09:19 GMT, etag `70e496609e155994b93f515db32d0289`;
   marker read at start **12:01:46Z** and mid **12:09Z** — `index.html` **byte-identical between the
   reads**, so nothing redeployed under the attempt). **0 OF 165 ROWS RE-OBSERVED** — the QA-branch
   cookies (2026-08-04 11:31 UTC, ~24.5 h old) return HTTP 401 `sso_required`, and the Filters +
   Report Suite sets are dead too (the Filters cookie also 401s against the Schedule API), so it is the
   ordinary **~24 h expiry across the whole `.qa.shopview.com` estate** plus the deploy, and it cannot be
   worked around from the container. **ALL 165 VERDICTS ARE PROVISIONAL AND UNCONFIRMED and NOTHING was
   inferred** (Rule 12). **ZERO WRITES, PROVEN:** all 165 cases byte-identical before/after — **30 fields
   each, `updated_on` + `updated_by` included, 0 differences**; **run 357 untouched** — 165 tests, **429**
   result records, **every one present BY ID and byte-identical field by field**, `case_id` sets equal
   BOTH directions, `include_all` still false; **Jira 0 writes**; **no foreign cases exist in group 4254**
   (all 165 `created_by = 3`). **WHY NOTHING WAS WRITTEN even for the build-independent fixes:** every
   touched case owes a Rule-54 re-stamp, and a write today would either leave a dead build marker on a
   freshly-updated case or claim an observation we did not make — so the 16 formatting repairs, the 2
   false "no ticket yet" sentences, the 165 provenance re-stamps and the 165 automation markers are ALL
   staged as **ONE write per case** in `recheck-2026-08-05/WRITE-PLAN.md`. **Option (ii) — the 142
   build-independent markers — is no longer worth taking: 2 of the 19 "expect fail" cases have changed
   since.** **ESTABLISHED LIVE:** spec **CURRENT at Confluence v23**, proven by word-diff of the live body
   (**0 runs of 6+ words present live and missing from our mirror**) — **and its in-body "Version" field
   reads `1.0`, the Rule-31(a) trap confirmed live**; epic **SV-8685 = 26 direct children**, verified two
   ways with equal key sets, changelog's last entry administrative only (Stefan Vukovic, Severity + QA
   Test Plan, 2026-08-04T07:07); **all 10 of our tickets SV-8848…SV-8857 STILL OPEN, none fixed** (only
   Mudassir Qamar adding label `FS-Schedule`). **FOUR CORRECTIONS TO OUR OWN RECORD:** the epic has **26**
   children not 28; the 12 tickets we recorded as epic-level Bugs are **`Story Defect` SUBTASKS of the
   stories**; the SV-8826–8841 range is **16** tickets of which **4 are not Schedule at all** (2 Ahtasham
   Filters defects on SV-8795, 2 Ryan Fyfe unparented Bugs); and there are **22 story defects, not 12** —
   10 arrived after our ingest (7 Ayesha Khan, 3 Mudassir Qamar on 5 Aug). **TWO ASKS ANSWERED WITHOUT
   US:** [SV-8834](https://shopview.atlassian.net/browse/SV-8834) (Mudassir, 4 Aug 08:39) covers
   SCH-MODAL-03 = C30010 **exactly** — same `1h / 1h` symptom — **so the "eleventh ticket" would be a
   DUPLICATE and must not be filed**; and [SV-8874](https://shopview.atlassian.net/browse/SV-8874)
   (Mudassir, 5 Aug 05:26) now covers SCH-TOOL-03 = C30041, so **decisions-register entry 8 must stop
   calling it unticketed**. Both cases' text still says the fault *"has no developer ticket yet"* — **now
   false**, queued. **TWO OF OUR PASS VERDICTS ARE CONTRADICTED by accepted Ready-to-Fix defects and they
   are probably right (Rule 44):** SV-8873 vs C29939 (our evidence **never records which FORM of the
   technician name we typed**) and SV-8868 vs C29944 (**we proved Approved alone and called the filter
   good — one status is a sample, not the filter**; a Rule-50 exhaustiveness failure of our own). **THREE
   CANDIDATE COVERAGE GAPS** with no counterpart among our 165, found by reverse-coverage diff: SV-8863
   (which view the module opens on), SV-8870 (drag-create in Month view), SV-8867 (reassigning a series
   member) — **not authored**, needs authorisation + live observation. **STILL UNKNOWN and most wanted:**
   whether any of the **4 not-built** features shipped in this deploy (SCH-API-02 C38873, SCH-DND-08
   C29962, SCH-EVT-02 C30017, SCH-SPREAD-11 C38863) and whether the **2 un-settable** rows (SCH-EDGE-07
   C38865, SCH-START-02 C29970) can now be seeded. **MARKERS: 0 of 165**; all 165 provenance lines name
   `v3.5-4873abe` + `8/4/2026`, exactly once each, none doubled. **Arithmetic gate not runnable yet;
   target recorded = READY + READY-EXPECT-FAIL must equal 157** (165 − 2 PO − 2 un-settable − 4
   not-built), **and it will move if a not-built feature shipped or a contradicted PASS flips.**
   **16 raw-markup cases CONFIRMED by searching all 165** (not by trusting the count), all named with
   C-ids. **DELIVERABLES: nothing regenerated, deliberately** — live **165** = local active **165** (192
   bodies − 27 retired) = id-map **165** (0 blank C-ids, `refs` 165/165) = import **165** rows; **id-map
   C-ids vs live sets equal BOTH directions**; **local vs live text 0 field mismatches** across all 165;
   **shredding guard PASSED**; import header **sha256 `a45eae40ec73b8ac` identical to all five peers** — a
   rerun would only blank the id-map C-ids and drop `refs` for no gain. **`READINESS-2026-08-05.md` was
   DELIBERATELY NOT WRITTEN** (a readiness report is a statement about a build we could not see);
   **`READINESS-2026-08-04.md` is KEPT and banner-marked "its verdicts are no longer confirmed" rather
   than SUPERSEDED, because there is nothing newer to supersede it with.** **NEEDED FROM THE QA LEAD:
   fresh `sv_sso_session` / `PHPSESSID` / `cf_clearance` for `.qa.shopview.com` — that is the only
   blocker; every other source is current and proven current.**
   **PRIOR STATUS 2026-08-04 (FIRST-EVER LIVE VIU DONE on QA branch `sv8685`, then RECOVERED +
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
   read back from Jira. **⚠️ THAT IS THE PRE-2026-08-05 `Bug`-on-the-EPIC CONVENTION — correct for its date,
   NOT the shape required now: Rule 52 was AMENDED 2026-08-05 to require a `Story Defect` parented to the
   OWNING STORY, so read this line as a historical record and Rule 52 for today's shape.** **AND IT HAS SINCE
   MOVED (re-read LIVE 2026-08-05): NINE of the ten — SV-8849…SV-8857 — are now `Story Defect`s parented to
   their owning stories with **Product Area NULL**, converted by others; only **SV-8848** is still a `Bug`
   with Product Area Schedule, and **its parent was REMOVED** (Mudassir Qamar, 2026-08-05T09:21:39 −0500,
   SV-8685 → None), so it now has NO parent. All ten remain Open / Low.**
   **Epic is now 28 children** (15 stories all `Ready for QA`, SV-8812 **Done** =
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
   **STATUS 2026-08-06 LATE (NEWEST — THE COUNT MOVED AND THREE CLAIMS BELOW ARE SUPERSEDED. Session 6,
   commits `0446f226` / `a1c38d38`; resume `build/report-suite/full-viu-2026-08-06/RESUME.md`):**
   **THE COUNT IS NOW 403 OF 476 VERDICTED · 73 OUTSTANDING** (403 + 73 = 476), re-derived from live
   TestRail and **set-equal in BOTH directions** to the handover list. **⚠️ THE BLOCK IMMEDIATELY BELOW
   SAYS "200 OF 476 OBSERVED / 276 STILL OWED" — TRUE WHEN WRITTEN, NOW SUPERSEDED**; the superseded
   figures are kept visible and dated rather than overwritten. The branch has since moved to
   **`v3.5-f77875c`** (last-mod Thu 06 Aug 2026 10:43:37 GMT, etag `829ed03832a746e78cbdb28eb9957a3e`),
   so **only 51 of the 476 verdicts rest on the build now running** — the rest carry their own honest
   earlier build line, which under Rule 60 is the record, not a defect.
   **TWO FURTHER CLAIMS BELOW ARE STALE, BOTH DISPROVED BY A FULL LIVE CENSUS OF ALL 476:**
   **(a) "12 with NO plain-text marker … raw-markup cases"** — the census found **0 raw markup and
   476/476 carrying exactly one marker and one provenance line** (**330 READY · 103 READY-EXPECT-FAIL ·
   43 HOLD**); the 12 named cases were re-read individually and are clean.
   **(b) "8 cases still carry NO build line at all"** — it is **5** (C30278, C43550, C43551, C43558,
   C43559), and it is **NOT a defect**: each says in its own text that it has not yet been checked
   against any build, which is exactly what Rule 60 requires.
   **THE EPIC MOVED 105 → 104 CHILDREN, AND THE CAUSE IS KNOWN:**
   **[SV-8821](https://shopview.atlassian.net/browse/SV-8821) was closed OBSOLETE and had its PARENT
   STRIPPED at 14:23:46Z**, and **SV-8822 likewise** — both under **our own shared account**, so
   somebody was tidying closed tickets off the epic. **LEFT EXACTLY AS FOUND (Rule 53's corollary —
   his edits are indistinguishable from ours in the changelog, and nobody may "restore" them).** A
   sweep of all 476 cases confirms **neither ticket is named on any case**, so **nothing downstream is
   affected**. **All six specs re-read live and NONE moved** (SBC 15 · SBR 17 · PV 5 · TU 6 · WIP 9 ·
   IV 4). **0 cases were closed this session — the sign-in died estate-wide 80 minutes into it, and a
   verdict is an observation (Rule 12), so nothing was inferred to pad the number; 0 TestRail writes
   even though `update_case` was authorised.** **`AND A RULE-49 QUEUE NOW EXISTS`** — see the
   correction note on the queue-state pointer near the top of this file.
   **STATUS 2026-08-06 (SUPERSEDED IN PART BY THE BLOCK ABOVE — THE LIVE-OBSERVATION PASS: 200 OF 476
   OBSERVED ON `v3.5-16cf83f`,
   276 STILL OWED, THREE REPORTS FINISHED. Resume `build/report-suite/full-viu-2026-08-06/RESUME.md` →
   `{FINDINGS,CHANGES-MADE,FILED,TICKET-SOURCE-BLOCK,COMMIT-COLLISION-2026-08-06}.md` + `REMAINING.txt`
   + `verdicts.json` → `build/report-suite/PROJECT-STATE.md`):** build **`v3.5-16cf83f`** (last-mod Wed
   05 Aug 2026 06:40:32 GMT, etag `177c59546701e7810b894492dabc1423`, `index.html` sha256
   `67932a75…`), read at the start of every batch and at the end — **byte-identical every time, no
   redeploy under any batch**. **Sources re-fetched live: SBC v15 · SBR v17 · PV v5 · TU v6 · WIP v9 ·
   IV v4 — none moved**; epic **SV-8582 = 105 children**, verified two ways with equal key sets and no
   paging remainder. **THE HONEST HEADLINE: 200 of our 476 cases carry a verdict established against
   this build; 276 do NOT — they carry markers and verdicts inherited from earlier passes and say so on
   themselves. THE ARITHMETIC GATE IS NOT CLAIMED TO PASS AND MUST NOT BE.** 200 + 276 = 476.
   **INVENTORY VALUE, PARTS VELOCITY and TECHNICIAN UTILIZATION ARE FINISHED** — every one of their
   68 + 71 + 57 cases carries either a verdict or a written not-observed reason. **THE 276 REMAINING
   BREAK DOWN AS: SBR 109 (not started) · WIP 67 · SBC 58 · plus 42 already recorded NOT OBSERVED WITH
   WRITTEN REASONS and an `AUTOMATION: HOLD` marker already on them (IV 9, PV 26, TU 7)** — a reason is
   not a verdict, so they stay in `REMAINING.txt`. **Count by case id, never by line** (`grep -oE
   'C[0-9]{5}' REMAINING.txt | sort -u | wc -l` = 276). **NEXT ACTION: Sales By Customer (58), then
   Sales By Representative (109), then Work In Progress (67).** **LIVE MARKER CENSUS: 426 `READY` · 38
   `HOLD` · 12 with NO plain-text marker = 476** — and **only 200 of those markers rest on this build.**
   The 12 are the **raw-markup cases**, all now in **Work In Progress** (C30451, C30456, C30457, C30460,
   C30487, C30490, C30491, C30493, C30519, C30522, C30526, C30528): their marker exists but is wrapped
   in `<p>` tags, so it is not machine-findable. **8 cases still carry NO build line at all** (C30278,
   C38856, C43550, C43551, C43553, C43557, C43558, C43559 — C43552 was given one in batch 7).
   **OUR OWN DEFECT, OWNED AND REPAIRED IN THE SAME SESSION: C30341** stores its text as raw HTML, none
   of the writer's plain-text patterns matched, so instead of REPLACING the provenance line and the
   marker it **APPENDED a second one of each — and the byte-check PASSED, because the write was faithful
   to the payload; the payload itself was wrong.** Found by a census of all 476, not by chance;
   converted to plain numbered text with **not one word of meaning changed**, and `rebuild()` now
   **REFUSES outright** on any case containing raw markup. **TWO THINGS THAT LOOKED LIKE DEFECTS AND
   WERE NOT, mechanism established first:** the **~10,000-row export refusal is DELIBERATE and is in the
   epic** ([SV-8591](https://shopview.atlassian.net/browse/SV-8591) *"Export contract + 10k row-cap
   guard"*) — an epic story is a source of expected behaviour under Rule 57, so the cap is **expected**,
   and **none of the six specifications mentions it**, which is a documentation gap for Chris recorded
   as a **question**, not a defect; and the **header-click sort is CORRECT** — the first read was a stale
   snapshot four seconds after the click. **THE WORK IN PROGRESS EXPORT WAS REPRODUCED AT LAST, and the
   earlier failure to reproduce was our own input shape: WIP uses `from=`/`to=` with full ISO instants,
   NOT the other five reports' `range=` parameters** (shape taken from the product's own download menu
   via a request listener, not guessed). It returns **HTTP 500 on every non-empty tab, both formats** —
   2 rows fail exactly as 65 do, so it is **presence of rows, not size** — and **HTTP 200 with a real
   file when the window is empty**; already covered by
   [SV-8907](https://shopview.atlassian.net/browse/SV-8907), so **no new ticket**. **29 Story Defects
   filed** (SV-8925–SV-8940, SV-8943–SV-8956), all in the Rule-52 shape (issuetype 10007 · parent = the
   owning story · priority **Low** · `relates to` the same story), every field read back with 11 checks
   each all PASS; plus **one authorised edit to SV-8937**, WIDENED to three reports rather than
   duplicated, with two new `relates to` links and 16 field checks read back. **0 edits to anyone
   else's ticket.** **Run 359 PROVEN UNTOUCHED** — `include_all` false, 476 tests, sets equal both
   directions, **all 535 results present BY ID, 0 new, 0 non-echo field changes**; the only movement is
   **`case_title` on 2 results of the one case we were authorised to retitle (C30102)**, the declared
   read-time echo. **THE PERMISSION CASES ACROSS EVERY REPORT STILL CANNOT BE DRIVEN** — one session on
   this estate, shared with a sibling worker, and both `quick-login` and `switch-user` rotate it.
   **⚠️ THIS PASS OPENED NO RULE-49 QUEUE FILE**, so its 200 verdicts are queued nowhere — the four
   older Report Suite queues (`full-viu-2026-08-05`, `chris-newreqs-2026-08-05`, `final-viu-2026-08-05`,
   `viu-2026-08-03`) are all still OPEN, the branch is **NOT declared final**, and **all 476 verdicts
   are PROVISIONAL.**
   **DEFECT-TICKET TOTAL ACROSS ALL PROJECTS** (source-block retrofit pass,
   `build/ticket-source-blocks-2026-08-06/`): **66 tickets in our own records** · 1 skipped by instruction
   (**SV-8923**, withdrawn as a false defect, no legitimate source) · **65 IN SCOPE** · 1 already
   carried a block (SV-8937, untouched) · **64 BLOCKS WRITTEN**, all 65 re-read live after the writes =
   **65 PASS / 0 FAIL**, one block each, description above it byte-identical, no other field changed.
   Source types: **61 the specification · 2 a PO answer with tab + row · 0 an epic story**. **2 HAVE NO
   DOCUMENTED SOURCE AND THEIR BLOCKS SAY SO — [SV-8821](https://shopview.atlassian.net/browse/SV-8821)
   and [SV-8822](https://shopview.atlassian.net/browse/SV-8822)** — and **5 more are only PARTLY
   supported**; every one is written up decision-ready in
   **`build/ticket-source-blocks-2026-08-06/FLAGGED.md`** with what it claims, what the build does,
   exactly where we looked and found nothing, what the expectation really rests on, a recommendation,
   and the cases affected. **Nothing had a source invented for it.**
   **PRIOR STATUS 2026-08-05 LATE (THE EXPECTED-BEHAVIOUR CORRECTION: WE HAD BEEN TREATING BUILD
   BEHAVIOUR AS EXPECTED BEHAVIOUR. Resume `build/report-suite/expected-behaviour-audit-2026-08-05.md`
   → `build/report-suite/final-viu-2026-08-05/ADDENDUM-SPECS-MOVED-AGAIN.md` **(read the addendum before
   acting on anything)** → `final-viu-2026-08-05/{SOURCE-CURRENCY,FINDINGS,testrail-execution-log,
   RECHECK-QUEUE,DELIBERATE-DECISIONS,OUTSIDE-IN,API-ASK,DELETIONS}.md` → `READINESS-2026-08-05.md` →
   `rulings-2026-08-05/FOLLOW-UP-QUESTIONS-ROUND-2-2026-08-05.md`.)** The QA lead's ruling, verbatim:
   *"The expected behaviors are NOT the ones 'how the build is behaving'… From the Build we are JUST doing
   the VIU… I am shocked to see that how come you considered the Build behavior as the expected behavior?"*
   plus *"'the case should be matched to the build' … meant that the test case should be VIU'd from the
   build"* — **labels and steps from the build, NEVER the expectation; if the expectation bends to whatever
   shipped, the case can no longer fail and a test that cannot fail is not a test.** **ALL 473 AUDITED, no
   sampling: A 16 · A\* 2 (spec states it both ways) · B 8 · C 440 · D 7.** **The systemic error was ONE
   Location-column boilerplate paragraph pasted into 14 cases across all six reports**, contradicting
   PV S3-R10 / TU S10-R4 / WIP S4-R3 / IV S7-R6 / SBR S20-R1 — **and it had overwritten wording that was
   RIGHT** (C30352's line was PV S3-R10 almost verbatim, recorded in a manifest as "wrong under both
   readings"). **Three of our own suspicions were WRONG and the specs cleared them** (C30356, C30336,
   C30384); **C30265 is correct as written and was deliberately NOT changed** though the brief asked.
   **Rule-41 forensics over all 41 commits touching the case source: NO pass ever changed a case's steps
   and its expectation body together, and the two pure VIU passes changed ZERO expectations — the
   contamination entered via an ANSWER-INGEST pass where an ambiguous PO answer met an observed build and
   the observation won.** **473 × `update_case`, every one HTTP 200 + byte-verified, 30 fields compared,
   0 mismatch, 0 collateral**, plus a **15-case second pass** fixing provenance lines that said the PO
   overrode the spec while the body followed the spec. **MARKERS NOW ON 473/473, exactly one each, last
   line: 423 READY · 17 READY-EXPECT-FAIL · 33 HOLD; gate 423+17 = 440 = the readiness figure** (before
   this pass **453 carried NO marker** and two styles coexisted on the other 20). **Run 359 PROVEN
   UNTOUCHED — 469 tests, 535 results (not 532: the owners logged 3 more before we started), all present
   BY ID, 0 graded-field changes, 0 echo changes, 0 new during our window; the 5 foreign cases
   byte-identical incl. `updated_on`/`updated_by`.** **Four counts set-equal BOTH ways at 473; import
   header sha256 == all 6 peers.** **⚠️ THE SHREDDING BUG FIRED AGAIN — all 473 import rows came back with
   a newline between every character (`joinlines` iterating a string after the live re-sync); FIXED in
   `build/report-suite/gen_import.py`, guard now 0; the generator also blanked all 473 id-map C-ids and
   dropped `refs` — both re-merged from live, 0 blanks, refs 473/473.** **NEW PLAYBOOK FACTS: `case_refs`
   is a SECOND read-time echo on run results alongside `case_title`; and the reports export needs
   `variant=summary|expanded`.** **LIVE ON `v3.5-16cf83f` (session alive — the previous two passes got
   401; `quick-login` never called): the SBC Summary CSV carries a Location column with BOTH locations
   selected and NOT with one, so the build follows the in-scope model; the two brand-new v14 requirements
   S20-R19a and S20-R19 are ALREADY correctly built; S14-R14 filenames, the UTF-8 BOM and the
   `"Locations:"` line all met; S15-R15 met (1 embedded image, 0 URLs); SV-8823 STILL REPRODUCES
   (`$224.92`, `90.5%`); and NEW-UNTICKETED: the server rejects `last_12_months` (v14's new first preset)
   while still accepting `today`/`yesterday` (both deleted) — ASKED not filed (Rule 51).**
   **🔴 CHRIS WARD EDITED ALL SIX SPECS DURING THE PASS AND PART OF IT IS ALREADY REVERSED:** SBC v13→**14**
   (13:07Z) · PV v4→**5** (13:21Z, one minute before it was fetched) · then **SBR v15→16 · TU v5→6 ·
   WIP v6→7 · IV v3→4 between 13:55Z and 14:23Z**, all messaged *"Applied QA review workbook decisions"*.
   **All four now ratify the ACCESS-GATE + TOGGLEABLE Location model and the exact anchors this pass cited
   have FLIPPED (TU S10-R4, WIP S4-R3) — so the boilerplate we removed is now, for those reports, what the
   spec says.** The audit was right against the sources at 13:20–13:55Z and is **partly overtaken**.
   **The cases are SAFE because all 16 carry `AUTOMATION: HOLD` naming the open question.** **Four of six
   specs STILL state it both ways (SBR S21-R7, WIP S7-R13, IV S7-R6, SBC S13-R4) and PV was never touched
   on this point.** **OWED: re-diff the 4 moved specs, re-repair the 13 cases to the toggleable model,
   re-stamp SBR→16/TU→6/WIP→7/IV→4, and ask Chris to finish the four leftover contradictions.**
   **LESSON (Rule 31): re-read the sources immediately BEFORE the writes begin, not only at pass start.**
   **Build `v3.5-16cf83f` byte-identical at 13:20:39Z, 13:55:25Z and 14:23:34Z. Rule-49 queue OPEN — all
   473 verdicts PROVISIONAL; this pass was NOT a per-case live VIU of all 473 and does not claim to be.
   0 deletions. 0 tickets filed. 4 of our cases (C43550–C43553) are still absent from run 359 and
   `include_all` is false.**
   **PRIOR STATUS 2026-08-05 (CHRIS'S ANSWERS APPLIED + 4 NEW CASES + 3 DEFECT TICKETS; resume
   `build/report-suite/approved-writes-2026-08-05/` — read `THE-46-EXECUTED.md` first, then
   `TASK-A-UNSUPPORTED-FREEZE-LINE.md`, `TASK-B-NEW-CASES.md`, `TASK-C-TICKETS-FILED.md`,
   `API-SPLIT.md`):** all four QA-lead authorisations executed. **TALLY: 473 ACTIVE OURS** (469 + 4 new;
   live under group 4281 = **478** incl. **5 foreign** by Vladimir Tomovic C38919–C38923, proven
   byte-identical incl. `updated_on`/`updated_by`, Rule 38). **56 TestRail ops total, ALL HTTP 200, 30
   fields compared each, 0 mismatch, 0 add-beyond-the-4 / 0 delete / 0 section / 0 run writes.**
   **(a) The 46 staged Chris-answer edits EXECUTED + 4 corrections = 50 ops** — **ops for C30470/C30485/
   C30500 were RE-DERIVED, not pushed as staged: they invented a "then plate" fallback and `plate`
   appears 0 times in the live WIP spec v6** (fetched live; the spec specifies PLACEHOLDERS `"(no unit
   #)"` / `"— no VIN —"`), so as staged they would have failed a correct build; C30516's provenance
   likewise corrected (S9-E1 AGREES). **The 4 WIP identifier cases carry the HONEST divergence** — spec
   + build agree and it is Chris's **29 July** answer that differs (given against a question that
   mis-described the report); **inventing a spec conflict is itself a defect**. **C30525 WIP-VIS-07 never
   entered the write set** (hard assertion; `updated_on` unchanged) — it was right all along and
   contradicted 4 of our cases for 7 days. Also corrected: **PV-COL-02 C30352** (an EIGHTH live-and-wrong
   location case the manifest missed), **WIP-COL-01 C30466 precondition 4**, and **3 TITLES** (C30470/
   C30500/C30485) that still asserted the plate against their own corrected bodies. **C30134 keeps its
   plate — ratified SBC v13 S8-R9.** Held **47→16**: the **11 genuinely blocked** now cite the live
   `rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx` (4 of them were LIVE and
   unwarned and deliberately GAINED a hold); the other 5 keep their old hold correctly. The manifest
   would also have dropped the `---` separator from 39 cases (all 469 live carried it) — restored.
   **(b) 4 NEW CASES pushed: SBC-COL-04 = C43550** (single-ACCESS user never sees Location in the column
   list — real coverage the release would have shipped without) **· WIP-PERS-05 = C43551 · TU-EXP-10 =
   C43552** (two TU spreadsheet downloads) **· SBC-EXP-17 = C43553** (a logo SET BUT FAILING TO LOAD —
   a branch no case tested). **All 4 `AUTOMATION: HOLD`, none live-verified.** **N2 NOT AUTHORED —
   Chris's answer says both yes and no about the same person (gap U1).**
   **(c) TASK A: the unsupported waiting-on-PO line REMOVED from C30440/C30491 (replaced with an accurate
   developer-blocker line — neither has a ticket yet) and C30564 (already names SV-8820). C30186
   NOT TOUCHED — removal not provably correct; a real product question sits behind it that was never
   asked.** **(d) 3 DEFECT TICKETS FILED — SV-8879** (location chooser shown to a single-location user,
   all six reports; screenshot proven to render inline) **· SV-8880** (SBR Summary spreadsheet missing 4
   columns) **· SV-8881** (TU download menu wording) — all Bug/priority **Low**/parent **SV-8582**/owning
   story linked **Relates**/Product Area Reports & Dashboards; every field read back, 11 checks each ALL
   PASS; 7/7 sections; 0 barred phrases. **⚠️ THAT IS THE PRE-2026-08-05 `Bug`-on-the-EPIC CONVENTION —
   correct for its date, and all three tickets STILL CARRY EXACTLY THIS SHAPE LIVE (re-read 2026-08-05:
   Bug · parent SV-8582 · Product Area Reports & Dashboards · Low · Open, none converted). It is NOT the
   shape required for NEW tickets: see amended Rule 52 (a `Story Defect` parented to the OWNING STORY).** **B4 NOT FILED (blocked on Chris's contradiction) · B5 NOT FILED
   — NO LIVE EVIDENCE: the no-logo state was never produced** (*"the PDF logo fallback could not be
   exercised because this organisation has an uploaded logo"*). **Rule 51 checked item by item: none of
   the 5 is API-only.** **PROVEN READY-TO-AUTOMATE = 432** (401 + 35 released − 4 newly held;
   cross-checked 473 − 16 − 14 − 6 − 1 − 4). ⚠️ **`READINESS-2026-08-04-POST-DEPLOY.md` still says 401 —
   owned by another worker, NOT edited.** **Four counts reconcile 473/473/473/473 set-equal both ways;
   id-map 0 blanks; import header sha256 == all 5 peers; shredding guard PASSED.** **Run 359 PROVEN
   UNTOUCHED** — 469 tests, case_id sets equal both ways, all **532** results present BY ID; 3 differ in
   **`case_title` ONLY**, a DERIVED read-time echo of the case title on the 2 cases we were authorised to
   retitle (**new declared normalisation, recorded in APP-ACTIONS-PLAYBOOK §J**); every real result field
   byte-identical on all 532. **OUR OWN DEFECT, OWNED: `SBC-COL-03` was a RETIRED id (merged 2026-07-28)
   that the new-case pass reused, and the resync overwrote the retired record — restored byte-for-byte
   from git, the new case renamed `SBC-COL-04`; no TestRail write needed, C43550 unchanged.**
   ⚠️ **BUILD REDEPLOYED AGAIN: `v3.4.1-3d03023` → `v3.5-16cf83f`** (last-modified Wed 05 Aug 06:40:32
   GMT, etag `177c59546701e7810b894492dabc1423`; identical at start and end of the pass). **The sign-in
   died with it (401 `sso_required`) so NO application was opened — the Rule-49 queue
   `viu-2026-08-03/RECHECK-QUEUE.md` is OPEN with the 2026-08-05 trigger recorded, and all 473 verdicts
   are PROVISIONAL.** **OUTSTANDING: one sentence from Chris on the location column (unblocks 11 cases +
   N2 + ticket B4) · which automation marker to standardise on (16 `DO NOT AUTOMATE` vs 4 `AUTOMATION:
   HOLD`) · the readiness file needs 432 folded in · a line on the CLAUDE.md cross-project identifier rule
   (NOT touched) · a live logo check before B5 · fresh QA-branch sign-in.**
   **PRIOR STATUS 2026-07-28: AUTHORIZED FULL TESTRAIL PUSH EXECUTED ("Push ALL") — 459
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

