# PROJECT-STATE — WO Board / Tech View (build-verification lane)
## Identity (measured live 2026-10-08)
- TestRail group **13204 "WO Board and Tech View (Sep 2026)"** (suite 1), 13 sub-sections S1–S12 + "Counts and data accuracy" + "TP - Tech-plan coverage".
  Link: https://shopview.testrail.io/index.php?/suites/view/1&group_id=13204
- **148 cases**: 130 created by Bilal (user 3, all Not Automated) · **18 created by Vladimir (user 1, all Automated) — NEVER changed (Rule 38)**:
  C204099–C204101, C228761–C228763, C236975–C236983, C335320, C335321, C351740. Nobody else has edited any case (updated_by = creator on all 148).
- Markers today: 129 "HOLD - not yet build-verified on the Work Orders QA build", 1 HOLD (server-side scoping, developer check), 18 none (Vladimir's). No build stamp on any case.
- **Test run 498 "WO Board & Tech View (Sep 2026) - Execution 2026-10-01"** (created 2026-10-02, open): 130 tests = exactly Bilal's 130 cases, all Untested;
  Vladimir's 18 are not in the run. https://shopview.testrail.io/index.php?/runs/view/498
- QA branch: **sv10043** (app https://sv10043.qa.shopview.com · api sv10043api.qa.shopview.com).

## 2026-10-08 · readiness check
- Branch was ASLEEP (control path 302 → sleep.qa.shopview.com?api=sv10043). Woken with the playbook §R call
  (toggleQaEnv {"action":"wake","env":"sv10043"} → "sv10043 is waking up."); 503 for ~75 s, then **401 = awake**.
- **Sign-in not yet possible:** the saved QA sign-in (sv_sso_session from 2026-10-05) is now rejected on sv10043 AND on sv9667 (where it worked
  on 10-05) — `/api/sso/check` 401, and the sign-in page sends the browser to Google sign-in. So the cookie has expired; it is not a branch fault.
  Needs a fresh sv_sso_session from the QA lead (stored only in /tmp, never committed).
- Build version: not read yet (needs sign-in).
- **2026-10-08 (later): READY.** Fresh sign-in supplied by the QA lead (kept in /tmp only). Quick-login Admin works: administrator role,
  57 permissions. **Build v26.40.8-7a95011.** The Work Orders screen already shows the new display switch (list / tech-grouped / board icons) and a
  board grouped by lead technician ("Unassigned" column) — evidence build-verify-2026-10-08/wo-list-first-look.txt/png.
  **Build verification NOT started** (QA lead: "get ready but do not start now"). Still open with the QA lead: re-check sources first, or not (Rule 81).

## 2026-10-08 — build verification pass 1 (sv10043 v26.40.8-7a95011) — feature folder done, regression folder and new layout open
- **Done — 170 of our cases** in folder 13204 (130 original + 40 added mid-pass, C368125–C368164): build-verified, re-stamped
  "Last checked against build v26.40.8-7a95011 on 10/8/2026.", markers 158 READY / 12 HOLD (11 not hand-testable analytics cases + C154650 needs a second
  organisation). Writes: `build-verify-2026-10-08/write/` (write-log 130 OK, write-log-40-new 40 OK, fix170-log 112 OK); served page fr-view 130 + 40 + 112.
- **Fix pass (fix170):** example customers ("Fibridge Commercial" …) do not exist on the site → setup now says how to create customer, contact and asset
  (observed); "ZZ Board Test Co" asset route corrected (Contacts tab first, Make required); line names are labels only (ready-made lines); C96984 part (c)
  cannot be made by hand (asset without Make — proved, `asset-without-make-claim.json`); 14 vague steps given a place; 65 stale "not yet build-verified".
- **Build differs from the documents (cases keep the documented expectation, "What you should see today" added):** C96918 (no-match wording), C368160
  (column menu count/Show all/Reset — Blocked per developer), C368162 (Collapse all — Blocked), C368164 (column/field search box — Blocked), and the
  clear-shifts question: C96965, C154888, C154889, C368133, C368134, C368135, C368136 (proved absent, `clear-shifts-prompt-claim.json`; whole-work-order
  shift on S2-13556, restored).
- **Site restored:** test shifts deleted; S2-14294 lead back to Jason Johnson; S2-13556 lead back to Brent Avila. Left as test data: customer
  "ZZAUTOTEST Fibridge Commercial" with contact "ZZAUTOTEST Contact" and assets TRK-118 / 1999 Ford Explorer.
- **Open:** (1) regression folder 47109 (C368165 onward, 83 cases, all HOLD "not yet build-verified") — not yet walked; (2) the QA lead's new case layout
  (handover file 2026-10-08 "_1") for all 253 cases — two of its rules edit the expected results (step prefixes, [placeholders]); this conflicts with
  Rules 57/114 and the file's own "do not change the expected results" → asked (Rule 63); (3) run 498 lacks Vladimir's 18 (pre-existing, not ours to add
  without the QA lead); (4) Vladimir's cases flagged by the runnability gate (C204099 …) — hands-off (Rule 38).

## 2026-10-08 (afternoon) — new case layout + regression folder
- **QA lead's layout handover (file "_1") applied**, with his decision: Expected results NOT changed (no "Step N:" / placeholders inside them).
  Feature folder: 157 of 170 written in the new layout (Preconditions · Setup with [placeholders] and "Check the setup worked" · Steps), each with
  its own ZZAUTOTEST customer; damage-checked before writing (`scripts/layout_check.py`: Expected unchanged, step references intact, no dropped
  labels/setup actions, no shared customers), served fr-view 157/157, runnable 157/157. **13 held** until their setup claims are seen on the site:
  C96914, C96915, C96944, C96954, C96959, C96975, C96980, C96984, C96997, C97027, C154648, C368130, C368158 (list: SITE-CHECKS-AFTER-WALKER.md).
- **Regression folder 47109: 74 of 83 build-verified and written** (READY 62 + HOLD 12 with plain reasons), served fr-view, runnable. 11 carry "What you
  should see today" (C368165, C368181, C368204, C368211, C368216, C368221, C368233, C368234, C368235, C368236, C368242). **9 held, not walked:**
  C368169–C368171 (no way to open Edit Work Order found — unproved), C368197 (no page control; scroll loads more — unproved), C368213, C368217 (order/
  receive/return not walked), C368191, C368240, C368244 (sign-in expired mid-walk). Also to revisit: C368247 (seed an Imported work order via Data Import).
- **QA lead decisions today:** keep the invitation route where a case needs a second user; permanent 100% rule (Rule 115 amendment).
- **Blocked:** test-site sign-in expired ~14:00 (`sso_required`); needs a fresh `sv_sso_session` from the QA lead.
- **Asks open:** C368218 Purchase Orders, C368219 Vendors, C368223 Deliveries — the pages have no filter on this build (proved,
  regression/parts-pages-no-filter-claim.json); keep as HOLD, or treat as build-differs (READY + "What you should see today")?
- Test data left on the site (all ZZAUTOTEST): see the regression helper's list in RUN-HANDOFF-WO-BOARD-2026-10-08.md.
