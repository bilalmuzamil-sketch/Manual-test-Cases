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
   as evidence, not crash-to-/no-location as a verdict). Local case source now exists (first time for Custom Roles):
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
   **SESSION RESUME 2026-07-16 (exec+QA deliverables): read build/custom-roles-run/SESSION-STATE-2026-07-16-EXEC-QA.md first** — exec file DELIVERED (audited CLEAN); QA pre-release checklist DELIVERED (audited CLEAN, aad5864). Task COMPLETE; open threads in the state doc.
2. **Fees and Discount project** — Fees & Discounts V1 (ShopView). **Canonical
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
   **NEW TALLY: 152 VIU-Verified / 12 VIU-Deviation / 0 Blocked-NotBuilt / 20 Blocked-Env
   / 1 VIU-Pending (FD-PART-005) = 185.** (Prior qb tally 135/15/12/20/1 = 183.)
   **This staging LIVE-VIU pass was ADVERSARIALLY AUDITED CLEAN 2026-07-20 (§0.0j):**
   every VIU-Verified flip is evidence-backed, the 152/12/0/20/1 = 185 tally reconciles
   across all deliverables, live TestRail matches, run 325 untouched, no secrets. STILL
   OPEN: re-VIU the remaining 12 Deviations not cleanly re-driven on staging
   (FD-STATS-001/002/004 persist [no headers/hyperlink]; FD-PROC-008/009, FD-CALC-013,
   FD-INLINE-003, FD-CUST-005/006, FD-TMPL-010, FD-WO-013, FD-PERM-002 need
   seeding/role-negatives) + FD-PART-005 + the FD-CUST-016/FD-VAL-007 DUPLICATE-PAIR
   QA-lead keep/retire ruling + filing the ready bug drafts (TICKETS 2/3/6/7/8/9/10/11;
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
   Receiving (ShopView), Epic **SV-7301**. **Canonical spec (Confluence):**
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
   **RESUME 2026-07-20: read build/simple-flow/PROJECT-STATE.md §'WHAT'S LEFT TO DO' + §0-CC first**
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
   TOP, should be BOTTOM per Milos — bug draft #5 STAYS OPEN). SF-CORE-15/17 + SF-QB-09 → Blocked-Env
   (invoiced+unreceived-core state not producible: complete≠invoiced/paid + can't order on completed WO;
   QB not connected). Remaining 4 VIU-Pending: SF-CORE-19 (received-core handle-core), SF-RCV-11
   (return-to-line scroll), SF-RCV-12 (other-vendor exclusion), SF-WOP-04 (Waiting-on-Parts column).
   Outstanding: SEND the
   Milos spec-V2.6 sheet (READY), Story-18 re-VIU backlog (needs SV-8353 build +
   dev-seeded core), 5 unanswered Milos Qs, file Receive-screen bug in Jira, run-325
   reconcile.
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
4. **Global Search project** — Global Search v2 (ShopView App). **Canonical spec
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
   **STATUS: CASES AUTHORED 2026-07-17 — 79 cases/14 sections,
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
- **Prod-vs-staging (and any two-env) permission comparisons: 100% LIVE-OBSERVED,
  ZERO NOT-VERIFIED — see `build/PROD-VS-STAGING-COMPARE-METHOD.md`.**

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
