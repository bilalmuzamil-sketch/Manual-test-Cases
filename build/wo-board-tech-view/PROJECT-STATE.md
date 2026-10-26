# Work Orders — Board View & Tech View — PROJECT STATE (canonical; updated 14 Oct 2026)

**Read this first for this suite.** Details live behind the pointers. For "has this been done before?" on any
NEW suite, run `python3 build/testing-tools/recall.py "<words>"` and read `build/KNOWLEDGE-MAP.md` (Rule 127).

## 1 · What it is
| Fact | Value |
|---|---|
| Feature | Work Orders page gains **Tech View** (rows grouped by lead technician) and **Board View** (cards in technician columns, drag to reassign/reorder), with Fields to display, density, pins, keyboard access and Google Analytics events (Story 12) |
| Epic / stories | [SV-10043](https://shopview.atlassian.net/browse/SV-10043); stories SV-10044 (Story 1 display switch) … SV-10052, SV-10054 (Story 11 keyboard), SV-10593 (Story 12 analytics); SV-10047 = Story 4 lead reassign; SV-10048 = Story 5 fields/columns |
| Sources | PRD Confluence **845185030** (read as "PRD v33" 8 Oct; Chris's later answers cite **PRD v48**) · Review Decisions **853901313** · tech plan revised 24 Sep 2026 · design export 8 Oct · developer regression list (Slavcho, 8 Oct: High 1–4, Medium 6–7 …) |
| Scope (Rule 110) | **GENERAL** (QA lead, 8 Oct) |
| People | PO / answers: **Chris Ward** (question sheets as Google Sheets) · developers **Slavcho Mitrov** (redeploys), **Ahtasham Amjad** (tickets, retests) · analytics report owner **Milos Vasic** · **Stefan Mitrovic** (analytics access; SV-11240 closed obsolete) · automation **Vladimir Tomovic** (TestRail user 1 — his cases are never edited; he flips the Automated flag) |
| Jira label | **`board-tech-view`** on every Story Defect from this suite (QA lead 9 Oct); tickets end with the test case link (Rule 120) |

## 2 · Environments and builds
| Env | Address | Notes |
|---|---|---|
| QA branch | `sv10043.qa.shopview.com` | builds v26.40.8-7a95011 (8–11 Oct) → **v26.40.14-e84b3d1** (12 Oct redeploy, PR #3548); location "Staging Heavy Duty - 9919" (zone set to Asia/Karachi, Rule 125); second location Lethbridge; sleeps when idle (wake via `session.mts`); turns any network error into the sleep page (L0317) |
| Staging | `app.staging.shopview.com` (API `api.staging.shopview.com`; Heavy Duty on Asia/Karachi since 14 Oct; Schedule technicians must be in department exactly "Service" — L0330; scripts `stg6*.mts`) | build v26.40.14-f92c26c (12 Oct) → **v26.40.17-ddb9ba1** (14 Oct, feature now on staging); sign-in needs THREE cookies (SV_SSO_SESSION, PHPSESSID, CF_CLEARANCE) in `/tmp/shopview/app.env`, ~24 h life; profile `run498-2026-10-08/profiles/app.staging.shopview.com.json` |
| Production | `app.shopview.com` | no Board/Tech View; used for "same on production ⇒ not a regression" (Rule 121) comparisons (`run498-2026-10-08/prod-*.mjs`) |

## 3 · TestRail
- Group **13204** "WO Board and Tech View (Sep 2026)". Run **498**: https://shopview.testrail.io/index.php?/runs/view/498
- **14 Oct 2026 ~17:00 UTC: the six (C154648, C368133, C96965, C581889, C581890, C581891) RUN on staging and Passed; run 498 = 248 tests, 243 Passed, 5 Untested (added by others).** Earlier 14 Oct: 243 tests — 240 Passed, 3 Untested (new C581889, C581890, C581891; and C154648, C368133, C96965 changed 14 Oct — all six to retest on staging: `run498-2026-10-08/STAGING-6-CASES-2026-10-14.md`). 13 Oct: 240 tests, 240 Passed. 19 tests that passed on a ruling were rewritten (Rule 114(d)) — see `run498-2026-10-08/ruling-rewrites-2026-10-12/`; automated ones for the engineer in its `FOR-ENGINEER.md`.
- Cases deleted on the QA lead's instruction (snapshots kept): `run498-2026-10-08/case-deletes-2026-10-12/`.

## 4 · How to run it again (no rediscovery)
- **Any environment, everything:** `run498-2026-10-08/STAGING-READY.md` → `GS_APP=… WOB_API=… ./staging-all.sh <tag>` (44 scripts / 214 tests); one script: `./wob-run.sh <script>.mts` (passes only listed env vars — L0315).
- **A new environment:** `GS_APP=https://<host> ./wob-run.sh discover-profile.mts` once.
- **Normal-browser checks:** `bash build/testing-tools/ensure_bridge.sh`, then `cd build/global-search/e2e && TZ=Asia/Karachi QA_DPR=2 npx tsx ../../wo-board-tech-view/run498-2026-10-08/<file>`.
- **Which script covers which test:** `run498-2026-10-08/rerun-map.json` (`build-rerun-map.py`), `RERUN.md`, `FAST-RERUN.md`.
- **Analytics (Story 12):** `PHASE=day1|day2|c97026 ./wob-run.sh ga-week.mts` then `python3 ga_calc.py` (L0314). Manual-tester version: `ruling-rewrites-2026-10-12/HOWTO.html`.

## 5 · Test data (all made by name, tagged ZZAUTOTEST; nothing depends on a QA-branch id)
Technicians made for these checks (e.g. "Esther Howard", "Ralph Edwards" — names the expected results quote), customers
"ZZAUTOTEST F1 …", "ZZAUTOTEST F2 …", "ZZAUTOTEST F3 …", "ZZAUTOTEST Edit WO …", "ZZAUTOTEST Asset Tab Count", analytics users
"ZZAUTOTEST GA FS1–FS4 / WK1–WK4 / NEWBIE / DISP" (`evidence/ga-week-2026-10-12/ga-week-users.json`). Seeders: `staff.mts`,
`data.mts`, `case-seed.mts`, `e84-seed.mts`, `shifts.mts`. Plain-English setup blocks: `ruling-rewrites-2026-10-12/preconds-trim/build_preconds.py`.

## 6 · What we learned here (each is written down where it belongs)
| Learning | Where |
|---|---|
| A keyword search is not a filter | L0301 |
| An ask without the steps cannot be answered | L0302 |
| The PRD wins; production never decides what the PRD means | L0303 |
| Lead technician changes are in the WORK ORDER's log, not the line's | L0304 |
| C96962 is the model for preconditions and steps | L0305 |
| Every ticket goes into the run with its full link; an obsoleted ticket ⇒ ask "mark Passed?" | L0306 |
| A watcher must test the real thing and be proved able to say "up" | L0307 |
| A filed ticket is his text — add to it, never overwrite | L0308 |
| "Which tickets did he obsolete" comes from the change history | L0309 |
| Same on production ⇒ not a regression | L0310, Rule 121 |
| A freeze only my browser shows: pause and read the stack | L0311 |
| The harness shows QA-branch times in UTC | L0312 |
| Re-test another tester's failure with their route; read the shop's time zone first | L0313, Rules 124/125 |
| "Read it in Google Analytics" is not a blocker — test what the product sends | L0314, Rule 107 (2026-10-12) |
| `wob-run.sh` drops any setting it does not list | L0315 |
| "Already clocked into different line" ⇒ fresh technicians | L0316 |
| Offline on a QA branch lands on the sleep page | L0317 |
| His own rulings go into a test as one dated line, never our chat | L0318, Rule 114(d) 2026-10-13 |
| Editing cases safely, history snapshots, automation flags, multi-day tests and UTC, run-comment tidy | L0319–L0323 |
| Finding things again: `recall.py`, `KNOWLEDGE-MAP.md` | Rule 127, L0324 |

## 7 · Open items
- Run 498 on **staging** (Rule 126) — needs fresh staging sign-in values from the QA lead; one command in `STAGING-READY.md`. Must-check there: C96968 offline drag.
- Then production, per Rule 126.

## STAGING FULL RUN — status 15 Oct 2026 02:15 UTC (run 498, build v26.40.17-a5c4210)
- **Posted to run 498 with annotated pictures:** 124 results (121 Passed, 3 Failed same-as-production, no ticket — C368232,
  C368236, C368237). Files: `run498-2026-10-08/RESULTS-staging-full-batch{1..5}-2026-10-15.json`.
- **Verdicts:** `evidence/staging-full-2026-10-14/judge/wave{1..8,8a..8e}.json`; pictures `judge/pictures-final-passes.json`
  ("no_usable_picture" = re-captured in passes 3/4).
- **Passes:** main (14 Oct 17:35–22:54) → stg-new5 → second (23:06–01:40) → third (from 01:41, `third-pass-plan.txt`, logs3) →
  fourth (`fourth-pass-plan.txt`, logs4; starts with sign-in check, role reset, clock clean-up, then C581895; signout-fix LAST).
- **Open for the QA lead:** C96973 (case vs newer PRD empty state), C97003 (view-only drop before Unassigned lands after it),
  C96920 (offline Tech View never downloaded), C97005 step 8 (real sign-out cannot run unattended on staging), shipped fixes
  C368134 / C368136 / C154889 / C154888 (case outcome 3). Chris's S5-R11b bug: waits on C581895's fourth-pass reading.
- **Lessons:** L0339–L0346.
- **15 Oct ~02:50 UTC — QA lead added section 73780 "Design — how it looks" (child of 13204) to the queue:** 22 cases
  C590110–C590131 (ours, Untested), each Expected quoting the Claude Design export of 14 Oct ("Work Orders.dc.html") with
  measurable points. Test list: `run498-2026-10-08/design-2026-10-15/section-73780-tests.json` (found by walking the suite's
  sections fully paged and keeping tests whose section is under 73780). Script `design-stg5.mts` (QA_DPR=2) runs in the fourth
  pass before signout-fix. C590125 (Dark theme) has no expected result — record only, it is with the product owner.
- **15 Oct 03:15 UTC — Chris's S5-R11b bug (C581895) not reproducible tonight, and why:** staging keeps ONE name per technician
  (renaming the staff record renames the account and vice versa — L0339, L0349), so every surface showed the same name
  (List, card, hovers, column header: "ZZAUTOTEST Account Ana"); production v26.40.17-f5bf8f4 has no Board/Tech View
  (`/api/work-orders/board` 404) and its List names match the staff list (`run498-2026-10-08/evidence/prod-names-2026-10-15/`);
  the QA branch sv10043 — the only place the two stored names differ (developer, 12 Oct) — needs a fresh sign-in cookie
  (its 12 Oct cookie has expired; DEV MODE quick-login is gone). ⛔ QA lead 15 Oct ~03:15 UTC: "Everything needs to run on staging. Nothing for WO Board and Tech view is to run on any QA
  branch." — so the QA branch is NOT a route (the one read-only sign-in attempt at 03:05 failed at the sign-in page and read
  nothing). On staging the bug cannot appear because the product keeps one name; ASK the QA lead whether Chris or the
  developer knows a way, on staging, for a technician's account name to differ from the staff record name; nothing filed.
  C581895 → Blocked (its set-up — two different names — cannot be made on staging; every screen showed the one name).
- **15 Oct 03:50 UTC — C96929 FAILED on staging (v26.40.17-a5c4210), twice:** a technician's work orders start in creation
  order in Tech View and Board View, not the List's customer A-Z (PRD S2-R6). On the QA branch it worked on 9 Oct and
  SV-11101 was marked Obsolete (read live: OBSOLETE). Posted Failed with the ticket held; draft
  `run498-2026-10-08/defect-drafts/tickets/D3-staging-C96929-2026-10-15.wiki` (Story Defect under SV-10045, Ready for QA
  read live) — ASK the QA lead: reopen SV-11101 or file the new one. Nothing filed.

### 15 Oct 05:35 UTC — coverage gap found by a live count (L0357)
Run 498: 274 tests; 243 Passed, 4 Failed (C368232, C368236, C368237 same on production, no ticket; C96929 ticket held), 27 untested.
180 have a staging result; 67 still carry only a QA-branch result. Of those, 50 are in the fifth/sixth pass plans and 4 are held
for the QA lead (C96916, C96920, C96973, C97003). 17 were covered by nothing and were handed to the helper for the sixth pass:
- judged from existing third-pass readings: C368193, C368194, C368195, C368198, C368200, C368210, C368213, C368214;
- never run on staging: C154650, C368175 (need a second organisation), C97026, C97033, C97034 (analytics);
- new cases from the QA lead, 14 Oct 21:59, section 13236: C581915, C581916, C581917, C581918.

### 15 Oct 06:05 UTC — design results posted; report draft
- Batch 12 (design section 73780): Passed C590126 C590131; Failed (tickets held, story read live, Ready for QA) C590110 C590111
  C590112 C590113 C590115 C590116 C590117 C590118 C590119 C590121 C590124 C590127 C590130; redo queued in the sixth pass
  C590114 C590120 C590122 C590123 C590128 C590129; C590125 Dark theme has no expected result (PO question W-15).
- Batch 13: Passed C368193 C368194 C368200 C368214 (wave 14). C368210, C368213 pictures re-captured in the sixth pass.
- Story keys: S1–S9 = SV-10044…SV-10052, S10 = SV-10053 (OBSOLETE), S11 = SV-10054.
- Report draft for the QA lead: `run498-2026-10-08/REPORT-staging-2026-10-15.md` (plain_check clean), finished when passes 5–6 end.

### 15 Oct 07:00 UTC — pass 5 finished (06:50), pass 6 started (06:51)
- Staging fact: the organisation setting `requireTechStories` (a line needs a tech story before Complete) reads OFF on staging.
  C96998 turned it on for its check (passed) and put it back off. Any test about the tech-story gate must read it first.
- Posted since 06:05: batch 14 (wave 15, 6 Passed), 15 (wave 16, 4 Passed), 16 (wave 17, 7 Passed). C96978 is a question for the
  QA lead (card shows the full name then +N, like List; the case quotes S5-R11 as first name then +N). C368191 is on hold for the
  sixth pass's "Deleted user" reading on S2-35973.
- The watcher stopped at its 2-hour limit; check-ins every 30 minutes now do its job (L0365).

### 15 Oct 07:45 UTC — restarts, and a possible 100-name limit on the work order page's lead list
- The machine restarted twice (about 07:21 and 07:35) during staledrop-stg4 (C97012). The cause was unbounded page reads on a
  dead page plus a heavy message watcher (L0368); fixed, moved to the end of pass 7, memwatch.sh guards memory (L0367).
- Possible product finding, NOT yet proven (L0369): the work order page's Lead Technician list, opened without typing, holds
  101 entries (Unassigned + the first 100 names A–Q + the current lead). Eligible technicians past the 100th (Ben Bravo, Ralph
  Edwards) are never offered there; the Reassign dialog does offer them. It explains the repeated misses on C97007, C368159,
  C96958, C96962 and C368169. Pass 7 settles it: typing into the box (pickLeadTyped) and lead100-compare.mts (staging "X of N",
  plus a read-only production comparison for Rule 121). If staging still does not offer him after typing, and production does,
  it becomes a Failed result with a held ticket under SV-10047.

### 15 Oct 10:35 UTC — QA lead ruling: the 100-name lead list is its own Story Defect
- Ruling (QA lead, 15 Oct 2026): the work order page's Lead Technician list stopping at 100 names gets its own Story Defect
  (under SV-10047), separate from the others. Draft: run498-2026-10-08/defect-drafts/tickets/D-LEAD100-staging-2026-10-15.wiki
  (being prepared). It is held until lead100-compare's production reading (Rule 121) and his per-ticket yes. Blocks C97007,
  C368159 and C368169.

### 15 Oct 11:15 UTC — the 100-name limit is in a second list too
- Edit Line > Add Technician on staging lists 99 names (Aaron Baker to the Q names); Ralph Edwards, the name C368173's
  Expected quotes, is not offered, and typing does not narrow the list (wave 27). This is the same limit as the work order page's
  Lead Technician list (D-LEAD100). lead100-compare.mts (pass 8, line 10) reads both lists on staging AND production. Then the
  QA lead is asked whether it is one ticket (every technician pick list on the work order page) or two.
- The seventh pass's lead100-compare read nothing usable (status filter empty, Reassign card off screen, production 404 on the
  board-only candidates list); fixed for pass 8.

### 15 Oct 11:40 UTC — view-only Asset on Site pin: same on production
- Production (v26.40.18-163ddfa, a real view-only login with workOrdersView and no Create & Edit) and staging read the same for
  the List's Asset on Site pin: a disabled button, cursor not-allowed, opacity 0.6, and a click changes nothing. The hover text
  on both still says "Asset (not) here. Click to toggle status." C368208 passes. The hover wording comes from production, so it
  is not caused by this work (Rule 121). Reading: evidence/staging-full-2026-10-14/viewonly-pin-prod.json.
- The production view-only login is /tmp/shopview/prod-login-limited.env. Read its permissions live first (they have drifted
  before); on 15 Oct it held 6 permissions, including workOrdersView and workOrderLinesCreateAndEdit.

### 15 Oct 12:30 UTC — run 498 on staging: all ten passes finished; final report sent
- Run 498 (271 tests): 244 Passed, 21 Failed (tickets held: C96929; 16 design; 4 technician-filter + C590127), 4 Blocked
  (C368175, C154650, C368191, C581895), 2 Untested (C590120 needs one more run; C590125 has no expected result).
- Still carrying a test-branch result: re-runs needing a fresh staging sign-in (C368156 C368178 C368179 C96962 C97012
  C368217); held on the 100-name list (C97007 C368159 C368169 C368173); the QA lead's calls (C96916 C96920 C96973 C96978
  C97003); C97033 day 2 (scheduled 19:10 UTC).
- D-LEAD100 is drafted (one or two tickets). Production cannot show the ~100 cut-off (18 staff), and it is not proven old.
- Final report: run498-2026-10-08/REPORT-staging-2026-10-15.md.

### 15 Oct 12:30 UTC — fresh staging sign-in; QA lead: tickets first
- QA lead, 15 Oct 2026: create the tickets for the failed tests BEFORE the re-runs. I proposed running the 7 re-runs in the
  background at the same time, and the answer is pending.
- He supplied a fresh staging sign-in (sso, PHPSESSID, cf_clearance). It is written to /tmp/qa-cookies/staging-sso.txt and
  staging-full.json (chmod 600, old files kept as *.bak-1015). The sign-in check passed at 12:27 (logs11).
- Ticket queue being drafted (defect-drafts/tickets/QUEUE-2026-10-15.md): sorting C96929 (reopen SV-11101 or new — his
  call), D-LEAD100 (one or two), TECHFILTER (5 tests, SV-10044), design findings grouped one per distinct finding. Each is
  asked separately (Rule 113). The live PRD read waits for his yes (Rule 81/106).

### 15 Oct 12:50 UTC — tickets: SV-11101 reopened; 17 failed tests linked to existing tickets
- QA lead, 15 Oct 2026 (quota at 97%): report what we already know first, fast, so the developer has work while the quota
  resets. Reopen old tickets with full data and screenshots, and always give the link.
- SV-11101 was reopened (transition 26), retitled, and rewritten from D3-staging-C96929 with 3 inline pictures
  (size_pics: 3 full-width). A snapshot of the old text is in defect-drafts/tickets/SV-11101-snapshot-before-reopen-2026-10-15.json.
- Run 498 batch 31: 17 failed tests carry their existing ticket (Defects field + "Follow the status here"). Mapping: SV-11319
  C590110 · SV-11322 C590111 · SV-11324 C590112 · SV-11317 + SV-11321 C590113 · SV-11325 C590114 · SV-11318 C590115 ·
  SV-11320 C590116/C590117 · SV-11323 C590118 · SV-11338 C590119/C590129 · SV-11326 C590127 + C581915–C581918 ·
  SV-11101 C96929.
- New tickets still to ask (one yes each): D-LEAD100 (one or two), hover shadow (C590121, C590124), name bubble below
  (C590124), green message box (C590130), avatar size by density (C590128). C590121's menu icon goes under SV-11319 if he
  agrees.

### 15 Oct 13:05 UTC — every finding reported
- QA lead approved (one reply, a yes per ticket): new SV-11393 (technician lists stop at ~100, one ticket covering both lists;
  C97007 C368159 C368169 C368173 now Failed), SV-11394 (no card hover shadow; C590121 C590124), SV-11395 (name bubble below;
  C590124), SV-11396 (green message box; C590130), SV-11397 (avatar size by density; C590128). C590121's menu icon goes under
  SV-11319. Each one quotes the PRD (v52 as the cases give it) first and the design as a reference; design screenshots were
  left out to save quota (his permission).
- Run 498: 240 Passed, 25 Failed (every one carries its ticket), 4 Blocked, 2 Untested.
- Next session: run498-2026-10-08/NEXT-SESSION-2026-10-15.md.

### 15 Oct 2026 (afternoon) — "Deleted user" entry filed as SV-11398 (QA lead: file only if production does not show it)
- Staging (v26.40.17-a5c4210), S2-35973: after Esther Howard's time entry is moved from line 1 to line 2, line 2's Labor lists
  Esther Howard AND "Deleted user". A fresh repeat on S2-36276 broke before the move (clock-in did not run; stop gave the
  "Ooooops" message), so it proves nothing either way; not judged, not blocked-gated.
- Production (v26.40.18-163ddfa), S1-3 (Truck Hill 1): the same move was done 12 Oct; line 2 read 15 Oct lists only
  Technician 1 and Service Advisor No Reports (Admin). No "Deleted user" ⇒ new on staging ⇒ filed.
- SV-11398 https://shopview.atlassian.net/browse/SV-11398 — Story Defect · parent SV-10228 (Testing QA, read live) · Medium ·
  label board-tech-view · Relates SV-10228 · one full-width picture. C368177 stays Passed in run 498 (its Expected is met);
  the ticket and picture were added to it. Draft + picture: run498-2026-10-08/defect-drafts/tickets/D-DELUSER/.
- Side effect: the production account's active location was switched to Truck Hill 1 (dummy environment, no cleanup needed).

### 15 Oct 2026 (evening) — two Blocked tests run on staging and Passed
- C581895 (rewritten: real names) Passed — Esther Howard lead, Ralph Edwards on line 2, S2-36280; names match Settings > Staff in the
  List, Board card + column header, avatar tooltips and the Tech View group/Assigned Techs. Script `c581895-v2.mts`.
- C154650 Passed — company B reached with the QA lead's "Analyst 1" login (L0395): `stg-orgb-seed.mts` + `stg-orgb-lead.mts`, then
  `orgb-fix3.mts ONLY=C154650` as Admin. Nothing from company B or the second location shows; Reassign "OrgB" finds nobody.
- Still Blocked: C368175 (now runnable with the same company B — not yet run) and C368191 (a deleted person's line).
- C368175 Passed on staging (15 Oct evening): no company-B technician in New Line / Edit Line / Edit labor; full `/api/technicians`
  (253, 4 pages) holds none either (L0396). Only C368191 stays Blocked.

### 16 Oct 2026 (afternoon) — run 498 state on staging (v26.40.19-72f4f3b)
- 273 tests: 236 Passed, 30 Failed (every one with its ticket linked), 7 Blocked, 0 untested/retest (read live).
- Blocked: C581915–C581918 + C97022 (no Technician filter on staging, SV-11326) · C590120 (SV-11405 In Progress) · C368151
  (its steps 13–15 follow the old Tab rule; PRD v55+ S11-R1/R3 changed it — QA lead's call on the case text).
- Filed today (QA lead's go-ahead, checked against PRD v58): SV-11419, SV-11420, SV-11421, SV-11422. Updated: SV-11318, SV-11101
  (still Obsolete), SV-11320, SV-11322, SV-11338. C581895 = existing SV-11336. C590122 linked to SV-11323 (grey panel).
- **16 Oct 2026, QA lead: "you have my YES for automated tests"** — go-ahead (Rule 71) to run, and where a test's own steps or
  preconditions need it, to update the cases TestRail flags as Automated in run 498. The Expected field is still never changed
  (Rule 114) and Vladimir's cases (created_by 1) are still never touched (Rule 38). Every change to an Automated case is told to Vlad (Rule 65).

### 2026-10-17 — full staging run (build v26.40.19-1493c63): two tickets now pass
- **SV-11317** (Tech View's starting columns) — C96927 Failed 16 Oct, **Passed 17 Oct**; ticket status TESTING STAGE (read live 17 Oct). Defaults now: Assigned Techs on, VIN/Serial # and Lead Technician off, On Site in the menu (off).
- **SV-11420** (text sizes per density) — C96990 Failed earlier, **Passed 17 Oct**; ticket TESTING STAGE. Row/card text 14 px at Compact/Regular/Comfortable, header labels and percentage 12 px. Avatar initials scale with the avatar (8/9.6/12.8 px) — not covered by S6-R4, not counted.
- Still failing on this build: SV-11393 (lead list stops ~100 names; OBSOLETE) — C368169, C368173; SV-11101 (A-to-Z order; OBSOLETE) — C96929. Both go to the QA lead as reopen questions.
- Script faults found while judging go to fix-up 2 (`C-fix2` lines in `run498-2026-10-08/fixup-1017.txt`), run after the main queue.
- 17 Oct (steps 69–76): **SV-11416** (deleted lead → "Unknown Technician" column) no longer reproduces on v26.40.19-1493c63 — the work order sits under "Deleted technician" with the Inactive marker and no grip (C614711, EXPECT-FAIL outcome 3; ticket TESTING STAGE). Open question for the QA lead: List shows that work order's Lead Technician as "Unassigned"; C614711 step 8 expects a blank cell.
- Other-company isolation holds on staging: C154650 and C368175 passed (no other-company names in either view, the Reassign dialog, the lead list or any line/labor list).

### 2026-10-17 — QA lead ruling: a ticket in Testing Stage ⇒ re-test now, do not wait
Verbatim: *"If a failed or blocked or retest test case has a comment asking you to wait for a ticket to be fixed and when you open that ticket and the status of that ticket is appearing as "Testing Stage" then you must test that test case too assuming that this ticket might have been passed. So test the case by yourself too and push the results, do not wait for that ticket to be marked as passed first."*
- Applied 17 Oct 05:50 UTC: scanned all 77 non-passed tests of run 498 (latest 5 results' comments + Defects), read each named ticket live. Tickets in TESTING STAGE: SV-11317, -11318, -11320, -11321, -11323, -11325, -11338, -11394, -11395, -11397, -11416, -11421. Every test naming one was either re-tested on today's build v26.40.19-1493c63 (C590114, C590117, C590122) or is in fix-up round 2 (C96916, C614711, C590113, C590115, C590116, C590124, C590129). C368178 (names story SV-10228, TESTING QA) added to round 3.
- How to re-run the scan: the script in this entry's commit (scratch `ts-scan.json` method: get_tests 498 paged, get_results limit 5, regex `SV-\d{4,5}`, jira.sh status).
- Ticket status is still never evidence about the build (Rule 61): the re-test decides; a pass on a Testing Stage ticket is reported to the QA lead as "fix looks shipped".
- 17 Oct fix-up 2 (staging v26.40.19-1493c63): **SV-11393 still reproduces** on every lead list — work order page 62–98 names, status-card list 98 names ending "QA PartsTechnician", Edit labor/Add Technician 97; typing "Ralph Edwards"/"Edwards" does not narrow. Cases whose names are examples pass with Jenny Wilson; cases needing Ralph by name (C368169, C368171, C368173) fail on it. Keyboard rule side-effect: after Escape on a card's More actions (…) menu, focus returns to the button, so it stays shown while focus is on the card (C96945 step 5 question for the QA lead).
- Production (v26.40.19-d2441a9) Parts Velocity report shows no rows for any choice — a production comparison of its narrowing cannot be made (C368234).
- 17 Oct (staging v26.40.19-1493c63): the **Work Orders tab has no Status filter** (only the All tab offers one) — C96916 and C368214 cannot reach their start state "Work Orders tab, Status: Approved"; held as a QA lead / source question (Rule 58), Expected untouched.
- 17 Oct 08:30 UTC — **possible finding under investigation (C368167):** Finance > Create Invoice on a Complete work order showed invoice INV-S2-37093 and the New Customer Payment window, yet the work order stayed Complete (screen and server, no invoice id), credit limit 9,999,999. Round 5 first proves whether Create Invoice invoices at all on a plain control work order; only then is anything put to the QA lead.
- 17 Oct 09:00 UTC — **C97020 confirmed on staging v26.40.19-1493c63 (round 4, kbd-r4):** on an Invoiced work order the disabled "Reassign lead technician" shows its note on mouse hover but NOT on keyboard highlight (text only in aria-describedby). Against PRD v64 S4-N6 + S11-N1; owning story SV-10054 Ready for QA. Draft `defect-drafts/tickets/D-C97020-2026-10-17.wiki`; **asked the QA lead 09:10 UTC (Rule 113, first ticket) — WAITING for his yes/no; nothing filed.**
- 17 Oct 09:45 UTC — **Create Invoice is undone by closing the payment window (round 5 control, S2-37110):** Create Invoice → POST /api/invoices/create 201 (INV-S2-37110); work order reads Invoiced only after ~10 s (invoice status "pending"); closing New Customer Payment with X → POST /api/invoices/remove-customer-transaction 200 → back to Complete, no invoice id, Create invoice offered again. Explains C368167's "never invoiced". **QA lead question:** is closing the payment window meant to cancel the invoice? (outside the WO Board PRD — invoicing). C368167 re-run live with a different route to Invoiced/Paid as set-up.
- C96963 and C368151 passed (round 5): Tech View Unassigned reorder kept after reload; Status menu fully keyboard-operable (Tab reaches the options, Enter ticks Approved).
- 17 Oct 11:00 UTC — sign-out batch (real initials > Logout + quick-login, staging v26.40.19-1493c63): Tech View density, technician order, pins and collapsed groups all survive a real log-out/log-in (C96989, C97005, C96948, C96928 passed); C368240 passed (tab 1 goes to sign-in by itself; after sign-in data current). **List's column choice (Progress off) did NOT survive a real log-out/log-in** while Tech View's did (C96975) — production comparison pending (PRD v64 S5-R8: List keeps saving its columns "exactly as it does today").
- Run 498 at 11:10 UTC: 244 Passed, 12 Failed, 22 Blocked, 0 untested (of 278).
- 17 Oct 11:30 UTC — **C96975 confirmed as a staging regression (re-measured):** turning a List column off on staging is NEVER saved (the Work Orders preference keeps Progress on and its updated time does not change, 10:57:13Z before log-out and after sign-in); production v26.40.19-d2441a9 saves it (updated 11:20:39Z) and keeps it across a real log-out/log-in. Draft `defect-drafts/tickets/D-C96975-2026-10-17.wiki` held; second ask after C97020. **C96916 passes behaviourally** with a dedicated user (Back restores Board View / Tech View, position and top card) — Blocked only for the unreachable "Work Orders tab + Status" start state.
- Final report to the QA lead: `run498-2026-10-08/REPORT-QA-LEAD-2026-10-17.md` (run 498: 244 Passed, 13 Failed, 21 Blocked, 0 untested at 11:25 UTC).
- 19 Oct — Rule 131 pass (staging v26.40.19-31ad1e1): C96929 and C590130 passed against PRD v64 (S2-R6/S9-R14 change log v53 15 Oct; §9 "Success toast, auto-fades" + Chris on SV-11396); case updates ASKED of the QA lead (per test). C97007, C368159, C368173, C368169, C368171 re-failed on SV-11429 (Open; SV-11393 re-homed there by Chris). Evidence `source-verify-2026-10-19/RULE131-TICKET-COMMENTS.md`, `c96929-live.json`, `c590130-live.json`, `sv11393-lists.json`.
- 19 Oct — QA lead: the five SV-11429 tests (C97007, C368159, C368173, C368169, C368171) stay at **Retest** ("same on production", kept separate for now). Run 498 now: 248 Passed, 6 Failed, 19 Blocked, 5 Retest. C96929 and C590130 updated to PRD v64 with his yes (case-updates-2026-10-19/); C96929 is Automated — Vlad to be told.

### 19 Oct 2026 — two approved tickets filed (QA lead: "File with the Quote from the Updated PRD"); design-only two NOT filed
- Re-checked first on staging v26.40.19-31ad1e1 (PRD still v64, read live 19 Oct; stories SV-10054, SV-10048 Ready for QA, read live):
  - C97020 reproduced (kbd-r4.mts, Invoiced S2-37313): keyboard highlight on the greyed-out Reassign lead technician shows no note; mouse hover does.
    Filed **SV-11498** https://shopview.atlassian.net/browse/SV-11498 — Story Defect · parent SV-10054 · Medium · board-tech-view · Relates SV-10054.
    Run result 527952 (Failed, ticket) + Follow-the-status comment; test https://shopview.testrail.io/index.php?/tests/view/3481958
  - C96975 reproduced (c96975-relog.mts): List's Progress turned off comes back after a real log-out/sign-in; saved preference never records it.
    Filed **SV-11499** https://shopview.atlassian.net/browse/SV-11499 — Story Defect · parent SV-10048 · Medium · board-tech-view · Relates SV-10048.
    Run result 527954 (Failed, ticket); this replaces the mistaken SV-10048 in the ticket field. Test https://shopview.testrail.io/index.php?/tests/view/3481919
- C590114 (Total price alignment) and C590117 (count tooltip above/below): PRD v64 searched again 19 Oct — no sentence on either
  (only Status/Waiting On Parts/Progress alignment, and Density/Columns/switcher/avatar tooltip placement). Not against the PRD ⇒ not filed
  (his condition). Their test pages show SV-11325 / SV-11338 only because those tickets sit on results from before the 16 Oct rewrite;
  the 17 Oct results carry no ticket.
- Run 498 now: 248 Passed, 6 Failed, 19 Blocked, 5 Retest.
- 19 Oct (later) — QA lead: "If the build going against the design if YES then create them too." Both checked against the design and
  re-measured on v26.40.19-31ad1e1 → both against the design → filed (owning story SV-10045 Ready for QA, read live):
  - **SV-11500** https://shopview.atlassian.net/browse/SV-11500 — Tech View Total Price at the left (design: right). C590114, result 527956/527958,
    test https://shopview.testrail.io/index.php?/tests/view/3995723
  - **SV-11501** https://shopview.atlassian.net/browse/SV-11501 — Tech View group count tooltip opens below (design: above). C590117, result 527957/527959,
    test https://shopview.testrail.io/index.php?/tests/view/3995726
  - Design basis: commit 23ab6f695 VISUAL-INVENTORY-ROWS V0753/V0754 and V0929 (L0450). Drafts D-C590114-2026-10-19.wiki, D-C590117-2026-10-16.wiki.
- C96929 (Automated, changed with his yes 19 Oct) — tell Vlad: test https://shopview.testrail.io/index.php?/tests/view/3481873 (run 498).
- 19 Oct — blocked tests, one by one. Technician filter (SV-11326) still Open, not on staging → C581915–C581918, C97022 stay Blocked.
  Item 1: C96916 / C368214 — "Work Orders tab + Status Approved" cannot exist: Status is offered on the All tab only, on staging
  (v26.40.19-e435950) AND production (v26.40.19-d2441a9) (L0451, evidence tabs-status-filter-*.json). Both Expected texts name that
  state, so fixing them needs the QA lead to name the cases (114(c)). C368214 is Automated (tell Vlad if changed). Asked 19 Oct.
- 19 Oct — QA lead: Technician-filter tests to RETEST with "will be retested once <SV-11326> is development-complete and available
  for QA". Done: C581915–C581918, C97022 → Retest (results 527962–527966, defects SV-11326; retest-sv11326-1019.json).
  Run now 248 Passed · 6 Failed · 14 Blocked · 10 Retest. Remaining blocked: C96916, C368214 (asked, item 1), C368145, C96912,
  C96936, C368167, C368131, C97003, C614711, C96945, C590122, C97024, C97035, C368153.
- 19 Oct — blocked step 1 done (staging v26.40.19-e435950):
  - C368145 PASSED (Split route the case allows; S2-37324 kept its lead and its customer-name place) — result 527967.
  - C96912 PASSED with every sign-in real (two new yopmail users, L0454) — result 527968.
  - C368131 behaviour matches every Expected once the Heavy Duty ENROLMENT is removed on screen (Settings > Staff > Department(s) >
    Manage staff enrollments); the case's step 3 (Location field only) does not remove her. Asked: Pass + reword step 3.
  - C368167 behaviour matches (message shown, lead kept, reload keeps it) with the payment window LEFT OPEN; closing it with X undoes the
    invoice on staging AND production (prod-invoice-x.json). Asked: Pass + reword step 2.
  - C96936 behaviour matches on screen with Aaron Baker (Ralph Edwards cannot be picked — list cut-off SV-11429). Expected names Ralph.
    Asked: Pass + rename (114(c) needs his naming) or Retest per the SV-11429 ruling.
  - New test in the run today: C665914 (test 4014037) Failed "Track here SV-11503" — not ours, untouched.
- 19 Oct — QA lead "A" on all three: C368131 (527970), C368167 (527971), C96936 (527972) PASSED with pictures; cases updated
  (case-updates-2026-10-19b/AUDIT.md). C368167 and C96936 are Automated → tell Vlad. Run now 253 Passed · 7 Failed · 9 Blocked · 10 Retest.
  Blocked left: C96916, C368214 (Back button — waiting A/B/C), C97024, C97035, C368153 (analytics), C97003, C614711, C96945, C590122.
- 19 Oct — analytics trio reconciled (source-verify-2026-10-19/ANALYTICS-RECONCILE.md): PRD v64 S2-R4 + S12-R2 ⇒ Tech View exposes 17 fields
  (List's 16 + Assigned Techs) — the build is right, the cases' 15 (a 6 Oct developer comment) is out of date. Asked the QA lead to name the
  three cases for an Expected update (114(c)), then pass them.
- 19 Oct — QA lead named the three analytics tests and ruled "always unblock yourself" (L0456): C97024, C97035, C368153 Expected updated to
  PRD v64 S2-R4 (Tech View 17; totals 30 / 41; no-financial 16, total 28), served pages clean (case-updates-2026-10-19c/); re-run on e435950 queued.
- 19 Oct — analytics trio PASSED on e435950 after the case update (C368153 527973, C97024 527974, C97035 527975). Run: 256 P · 7 F · 6 B · 10 R.
  Remaining blocked: C96916, C368214 (Back; All-tab runs queued, s1-r7 / high2-all), C96945 (step 5 reworded — click outside; re-run queued),
  C97003 (step 11 order), C614711 (production TODAY shows "Unassigned" for a deleted lead — prod-deleted-lead.json; PRD says "blank, as today"),
  C590122 (production List's Clear all filters keeps the search — clear-all-search-prod.json; staging check queued).
- 19 Oct — C96916 on the ALL tab + Status Approved (s1-r7-C96916.json, dedicated user): Board View Back keeps columns, top card S2-36407,
  All tab, Status Approved; Tech View Back keeps top row S2-36421 and filters. Passes under option A — HELD: Expected names the Work Orders
  tab, so it needs the QA lead to name the case (114(c)).
- 19 Oct — C368214 on the ALL tab (high2-all.json): Back/Forward/Back keep All tab, Status Approved, search and row S2-37445 — HELD for naming (114(c)).
- 19 Oct — C96945 PASSED after step 5 reworded (click outside; Expected unchanged; case Automated → tell Vlad).
- 19 Oct — Clear all filters on staging e435950 (clear-all-search-staging.json): List AND Tech View clear Status and KEEP the search, same as production List → C590122 step 8 'search is empty' has no source; Expected change needs naming.
- 19 Oct — C97003 re-run e435950 (s9-r4-C97003.json): step 7 Ben lands right after Unassigned; step 11 reads Unassigned, Ben, Cal, Ana (case expects Unassigned, Cal, Ana, Ben); dispatcher unchanged. Expected step 11 needs naming.
- 19 Oct — C590122 re-run e435950: steps 5-10 as before (search kept after Clear all filters in Board/Tech/List); the empty-group/column readings (steps 1-4) were not drawn by the script today (17 Oct readings stand). Decisions put to the QA lead: C96916, C368214, C97003, C590122 (Expected changes, need naming), C614711 (PRD 'blank, as today' vs production 'Unassigned').
- 19 Oct — QA lead: deleted lead → List shows 'Unassigned' is EXPECTED (L0457). C614711 step 8 updated; re-run on e435950 in progress.
- 19 Oct — C614711 PASSED (527978-ish) after the 'Unassigned' ruling. Blocked left: C96916, C368214, C97003, C590122 (waiting for his yes).

- 19 Oct — last four blocked tests passed after the QA lead's go-ahead ("if editing does not go against the PRD … easiest for the tester"):
  C96916 + C368214 start on the All tab (Status filter only there), C97003 step 11 = order written down at step 8, C590122 step 8 = search stays
  (PRD v64 §9 "Existing List empty state and clear-filter behavior in all display options"). Edits: case-updates-2026-10-19d/. C96916's Tech
  View half re-run with s1-r8.mts (s1-r7's reading was void, L0458). Results RESULTS-four-1019.json, pictures pictures-1019/C96916-*, C368214-1,
  C97003-1, C590122-1. Run now 263 Passed · 7 Failed · 0 Blocked · 10 Retest. C368214 Automated → tell Vlad.

- 19 Oct (16:20 UTC) — retest of tests updated in the last 9 hours (QA lead: "test all the test cases which have been updated since last 9 hours"),
  staging v26.40.19-c850386: C368131, C368167, C96936, C614719 (preconds rewritten by Vladimir, steps unchanged), C682419 (NEW, scroll bar
  16 px / handle 150 px; PRD v65 S3-E2 read live, matches the case quote) — all Passed with pictures (RESULTS-retest6-1019.json). C96953
  re-run with a mouse-driven script (c96953-cols.mts) in progress. Facts: no New Customer Payment window after Create Invoice on c850386
  (L0462, C368167 step 2 wording now stale, Automated → asked); scrollbar measurements need --hide-scrollbars off (L0464). Run: 264 Passed
  · 7 Failed · 0 Blocked · 10 Retest.

- 19 Oct (17:10 UTC) — QA lead: (1) C368167 step 2 reworded so it runs whether or not the payment window opens (case-updates-2026-10-19e/);
  (2) no need to tell Vlad; (3) authoring notes: leave for now; (4) PRD v66 S3-R20e "blank, as today" vs "Unassigned" added as row 19 of
  Chris's sheet https://docs.google.com/spreadsheets/d/1coGNz1ZNj1GiFA4rS7pt9nwKsNgE8bCLpuutygK4iQs (tab "Questions for Chris").
  New in run 498 since 16:48: C682421 (Blocked by another session, SV-11422) and C682422–C682428 (untested: Assign lead dialog / Undo).

- 19 Oct (22:20 UTC) — Design- cases: C682439, C682440 Passed (c850386). Eight held "(design's version)" cases prepared and read on the build
  (c6824-held.mts, READY-TO-RUN.md). Chris answered all rows of his design-differences sheet: 5 cases to remove (PRD won), 2 released
  (C682430 messages/Undo/2.6 s, C682436 no-technician pages — both fail on today's build), C682431 mixed → needs rewording. Asked the QA lead:
  add the released ones to run 498, reword C682431, remove the five.

### 19 Oct 2026 (late) — six-test retest on staging v26.40.19-c850386 (PRD v68); two tickets filed on the QA lead's word
- QA lead: "Please retest … C614711, T3481908, T3481958, T3995730, T3481911, T3761668 … If any of them fail prepare the story defect"; then
  "Please create the defects for the failed test Cases. And also push the results … with the ticket or tickets to follow".
- All six Failed (results 529589–529594 with pictures; ticket results 529842–529847 + follow-the-status comments; C97020 also 529863):
  - C614711 (T4004397): steps 1–9 pass (SV-11416 fix on staging: "Deleted technician", Inactive, no grip, drops refused, List "Unassigned");
    step 10 message "Lead technician updated", no work order/technician/Undo → **SV-11524** (Open, Branko).
  - C96964 (T3481908), C590121 (T3995730): old locked sentence on lock icon (title), menu tooltips, drag note → filed **SV-11545**.
  - C97020 (T3481958): keyboard note never shows → **SV-11498** (In Progress) + old wording → **SV-11545**. View-only half steps 1–6 pass.
  - C96967 (T3481911), C368147 (T3761668): view-only user cannot pick a card/row up and gets no "You don't have permission to assign
    technicians" note → filed **SV-11546**. Everything else (no move, no More actions, lead kept) passes.
- SV-11545 https://shopview.atlassian.net/browse/SV-11545 and SV-11546 https://shopview.atlassian.net/browse/SV-11546 — Story Defect ·
  parent SV-10047 (Ready for QA, read live) · Medium · board-tech-view · Relates SV-10047 · pictures inline full-width (read back).
- The six cases also sit in the Nightly Test Runs 539–543 (Engineering's automated runs; Rule 47 — not ours, not written to).

## 20 Oct 2026 (06:50 UTC) — QA lead's 27-test batch in run 498 on staging: ALL judged and posted (v26.40.19-c850386)
- Passed (22): C682437, C682438, C682446, C368159, C368169, C368171, C368173, C97021, C690643–C690646, C690648–C690657.
- Failed (5): C682421 (SV-11422, REJECTED FROM TESTING), C682436 (**SV-11555 filed today** — no "Nothing here yet" / "Add Technician" on today's build, proven from the app code), C682445 (SV-11119 In Progress, known outcome 1), C690642 and C690647 (SV-11545 Open — locked wording).
- Every Failed result has the bold failing steps (Rule 132) and a "Follow the status here" comment.
- Lessons: L0483 (release copies need drag / Unassign, not the dialog), L0484 (correction of L0479; assign-technician 500; runner not clockable; queue file read once), L0485 (Fields-to-display keys; lines made after the lead only follow it).
- Results files: `run498-2026-10-08/RESULTS-run1020-*.json`; defect draft `defect-drafts/tickets/D-S1N1d-empty-states-2026-10-20.wiki`.

## 20 Oct 2026 (15:55 UTC) — fixed-ticket retest in run 498 on staging (v26.40.20-0509710), QA lead's order after SV-11541/11498/11454/11422/11326/11119 were fixed
- All six tickets read live: Done. SV-11541 and SV-11454 had no Failed/Retest test in the run.
- Posted (results file `run498-2026-10-08/RESULTS-run1020-v.json`, pictures `pictures-1019/*-1020.png`): **Passed** C581916, C581918, C590127, C682445 (SV-11119 fix shipped) · **Failed** C97020 (keyboard note now shows — SV-11498 fixed — but still the old sentence, SV-11545 Open) · **Blocked** C97022 at step 6 (PRD S11-E1 vs S1-R15a/S1-N1a conflict: when the last card leaves a filtered column, the board becomes "No work orders match these filters", so there is no header to take focus; PO question).
- **C581917 Passed** (posted 15:57 UTC; after Clear all filters WO-1 and WO-2 are back, pictured). **C581915 Failed** (posted 16:02 UTC, ticket HELD for the QA lead: 11 technicians with a group/column — e.g. Aimee Francis, Inactive, 8 work orders — are not in the Technician filter; draft `defect-drafts/tickets/D-S1R15-filter-missing-technicians-2026-10-20.wiki`). All 8 tests of the order are now recorded.
- PRD 845185030 is now **v69** (20 Oct 15:31 UTC): S1-R15 widened (deactivated / not-enrolled / Time-Clock-off leads keep a column and are listed, "Inactive" label), new S1-R15c (50-value message never on opening the list) — staging shows that message on opening; no case covers it.
- C682421 (Automated) is Passed but still titled "SV-11422 - …": removing it needs the QA lead's go-ahead (Rule 71), then tell Vlad.
- 20 Oct 16:20 UTC — QA lead's answers: (1) YES to file the missing-technicians report → NOT filed: SV-11575 (his, Open) already covers it; C581915 re-posted Failed on SV-11575 (title "SV-11575 - …"). (2) PO question (keyboard focus when the last card leaves a filtered technician) is **question 34 of THE spec/design question sheet** https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU ("Questions on the spec and design – for Chris Ward (14 Oct 2026)") — first put by mistake on the 19 Oct design-differences sheet (1coGNz1Z…), removed from there. (3) C682421 (Automated) title prefix removed — Vlad to be told. (4) NEW case **C698883** "The 50-value limit message never shows just from opening the Technician list" (section 13236, PRD v69 S1-R15c quote, AUTOMATION: READY, Functional) added to run 498 (test 4093190) and marked **Blocked** on SV-11575 — the ticket is named in the result comment only, not in the case text; Rule 133 put "SV-11575 - " on its title.
- 20 Oct 17:40 UTC — **Chris answered Q34 (b)**: when a move leaves nothing matching the filters, the S1-N1a empty state shows and focus moves to its Clear all filters button; header focus (S11-E1) still applies when other work orders remain. PRD **v70** (17:26 UTC) S11-E1 carries it. He asked for a bug against S11-E1. C97022 re-posted **Failed** at steps 6–7 (focus falls to the page), ticket HELD for the QA lead: draft `defect-drafts/tickets/D-S11E1-focus-lost-empty-state-2026-10-20.wiki` (Story Defect under SV-10054, Ready for QA; no duplicate found). C97022's step 6 Expected still says "column header" — diverges from v70; not changed (Rule 114), asked.
- 20 Oct 18:15 UTC — QA lead said yes to both: C97022 step 6 Expected updated to PRD v70 S11-E1 (Clear all filters; only that step; before/after in `case-updates-2026-10-20/`; served page fr-view), re-run on staging 18:08 UTC — reproduced (focus to the page, next Tab → Skip to main content) — fresh duplicate check clean, then **filed SV-11582** (Story Defect under SV-10054, Medium, relates to SV-10054, picture full-width, ends with the test link). C97022 Failed on SV-11582 with "Follow the status here"; title "SV-11582 - …".
- 21 Oct 03:17 UTC — QA lead asked to retest C698883 (test 4093190) on staging. `c698883-1021.mts` written (case text read live: 7 steps, "Known problem SV-11575", title "SV-11575 - Opening the Technician list never shows the 50-value limit message" — rewritten by another session 20 Oct). Run stopped at sign-in: every saved staging sign-in answers 401 on /api/auth/me (relay checked 200 first, L0355). Waits only on fresh staging cookies from the QA lead (L0477/L0478); SV-11575 still In Progress (read live).
- 21 Oct 03:25 UTC — fresh staging sign-in from the QA lead (saved in /tmp only; /api/auth/me 404 = accepted). C698883 re-run on staging **v26.40.20-b1e205d**: message shows on opening (nothing ticked), after ticking and unticking Unassigned, in Tech View and Board View → outcome (1), stays **Blocked by SV-11575** (In Progress); posted with 2 pictures. Run 498 now reads untested 1 · passed 269 (another session added/changed a test since 20 Oct).
- 21 Oct 12:28 UTC — QA lead: rerun the tests blocked on SV-11577, SV-11576 (both Story Defects, Ready for QA) and SV-11575 (Bug, Merged to Staging), read live. Tests: C581915 + C698883 (SV-11575), C707076 (SV-11576, new, untested), C707077 (SV-11577, new, untested). Queue `fixed1021` (fixed-1021.mts, c698883-1021, tech-filter-stg6 ONLY=C581915, tech-filter-check-1020, tech-filter-aimee-1020). C698884 (SV-11580) not in scope.
- 21 Oct 13:01 UTC — **C698883 Passed** (SV-11575 shipped to staging v26.40.20-00f1fd6), posted with pictures; prefix removed. Observation for the QA lead: at the limit the red text reads "50 selected (max 50 across all filters)", not the PRD S1-R15c sentence (no case covers it). Own runner `WOB_RUNNER=c21` used after the shared runner kept landing at the S1 location.
- 21 Oct 13:40 UTC — **C707077 Failed** (SV-11577, staging v26.40.20-c627fc7, WO S2-37765): Settings > Staff reads Carol Neal, but List lead, Lines Labor text, Edit Line Technicians, Board card and column header all read the account name David Sparks — fails steps 1, 2, 4, 7 in a different way from the known problem (outcome 2). Posted with 4 annotated pictures (`RESULTS-run1021-e.json`), title prefixed SV-11577. C707076 Passed, C581915 Passed, C698883 Passed. Run 498 now: untested 1 · passed 272 · failed 12. Asked the QA lead: comment/reopen SV-11577 or new ticket (no Jira write yet); plus three observations (50-limit wording, Escape from the search box, Deleted technician group).
- 21 Oct 13:55 UTC — QA lead: retest the tests blocked on SV-11576 (staging) and SV-11499 (sv11499 QA branch, staging if the branch is unreachable). `find-ticket-tests.py` found C707076 (SV-11576, already Passed 13:20 on staging c627fc7) and C96975 (SV-11499, Failed). `c96975-1021.mts` written: all 23 steps (real log-out/sign-in, second browser, Change Location). sv11499 answers 200 on v26.40.20-00f1fd6. Container restart emptied /tmp: waiting for the QA lead's sign-in cookies (L0494).
- 21 Oct 14:20 UTC — **Fast-follow ruling (QA lead):** tests failed/blocked on a `fast-follow` ticket are not tested; moved to section 87347 "Fast-follow" and removed from run 498. Moved + removed: C614711 (SV-11524), C96964, C690642, C690647, C97020, C590121 (SV-11545), C97022 (SV-11582). Held for his yes (Automated): C96967, C368147 (SV-11546). Run 498: 285 → 278 tests; failed 12 → 5. Evidence `run498-2026-10-08/fast-follow-2026-10-21/`. SV-11577 read Done (labels QAcomplete) at 14:15 although C707077 failed on c627fc7.
- 21 Oct 14:40 UTC — **C707076 Passed again on staging** (re-run on the QA lead's order, c627fc7, WO S2-37804). **C96975 Passed on sv11499** (v26.40.20-00f1fd6, all 23 steps), prefix SV-11499 removed. Run 498 now: untested 1 (C698884) · passed 273 · failed 4 (C96967, C368147 = fast-follow SV-11546, Automated, held; C581895 SV-11336; C707077 SV-11577). Staging run of C96975 (Rule 126): all 23 steps pass on staging c627fc7 too (14:40; locations DVI Test → QB Location, another session had moved the admin) — not posted, the run result is the branch one.
- 21 Oct 15:05 UTC — QA lead said yes: C96967 and C368147 (Automated, SV-11546 fast-follow) moved to Fast-follow and out of run 498 (278 → 276); Vlad to be told (Rule 65). **C707077 corrected to Passed** (L0497: Settings > Staff shows the login name; staff record name of Carol Neal's login is David Sparks, and every place shows it). SV-11577 already carried a PASSED comment (08:58). Run 498 now: passed 274 · failed 1 (C581895, SV-11336 — case uses Settings > Staff as the staff-record source; asked) · blocked 1 (C698884, set by someone else).
- 21 Oct 15:45 UTC — PRD **v73** read live (Chris, 14:42): 50-limit wording now matches the build; "Deleted technician" filter choice is fast follow SV-11594. **Escape-in-search defect** prepared (draft `defect-drafts/tickets/D-S11R5-escape-technician-search-2026-10-21.wiki`, pictures `defect-drafts/tickets/esc-1021/`), new test **C707079** in run 498 Failed with ticket held — waiting for the QA lead's yes. **C581895 Passed** after the precondition fix (same-name technicians). Run 498: passed 275 · failed 1 (C707079 held) · blocked 1 (C698884, SV-11580 In Progress). sv11499: Admin's Work Orders columns still need restoring (branch sign-in refused).
- 21 Oct 15:45 UTC — QA lead: "Also test this in next 5 hours" — test 4093512 (C698884, SV-11580 In Progress, PR open, no QA branch). `c698884-1021.mts` written (all 5 steps, divider gaps, card spacing). Baseline on staging c627fc7: Board View still has the density button; card-fields button named "Fields to display" (gaps 78 / 12 px); Tech View density Compact/Regular/Comfortable; card gap 8 px. Stays Blocked (Rule 112). Hourly check-ins armed (first 16:45 UTC, trigger trig_01WLqMJtB4TwebaRnQ6XbHzv), last at 20:30 UTC runs and posts regardless.
- 21 Oct 16:05 UTC — On the QA lead's yes: **SV-11627** filed (Escape does not close the Technician list after clicking into its search box; Story Defect under SV-10054, Medium, board-tech-view + fast-follow, 2 pictures sized). C707079 result re-posted with the ticket, title prefixed, then moved to Fast-follow (87347) and removed from run 498 (277 → 276). Run 498: passed 275 · failed 0 · blocked 1 (C698884, SV-11580; hourly check-ins until 20:30 UTC).
- 21 Oct 16:20 UTC — SV-11627 moved on the QA lead's order to the Fast Follow epic **SV-11593**: type Story Defect → Bug (as Chris did for SV-11582/11545/11546), Product Area Work Orders; everything else unchanged (read back). C707079 already in Fast-follow and out of run 498 (re-checked live).
- 21 Oct 16:35 UTC — On the QA lead's order, the 24 cases in section 55300 "Not runnable for now" moved back to their native folders (13247 ×8, 13248 ×3, 20449 ×1, 47111 ×6, 47110 ×6), read from each case's history. Run 498 unchanged (276 tests, same results); 55300 is empty and left in place.
- 21 Oct 16:45 UTC — QA lead: QA Assignee = Bilal Muzamil on all 12 stories of epic SV-10043 (SV-10044–SV-10054, SV-10593; all were empty; read back). Log `qa-assignee-2026-10-21/`.
- 21 Oct 16:55 UTC — QA lead: label QAcomplete on WO Board / Tech View Done Story Defects/Bugs with QA Assignee Bilal: 50 in scope, 39 labelled, 11 already had it (read back). Log `qa-assignee-2026-10-21/QAcomplete-labels-2026-10-21.json`.
- 21 Oct 18:51 UTC — Check-in 3: staging moved to **v26.40.20-4c6c9e0**, SV-11580 in TESTING STAGE. **C698884 Passed** (outcome 3: the change shipped) — no Board View density button, Column Selection centred (13/12 px), picker opens, Escape closes, card gap 8 px unchanged, Tech View density Compact/Regular/Comfortable. Run 498: 276 tests, all passed. No further check-ins armed.

## 22 Oct 2026 — STATE SAVED (QA lead: "Save the state"), then the PRODUCTION pass starts
- **Run 498** (https://shopview.testrail.io/index.php?/runs/view/498): 276 tests, **all Passed** (staging v26.40.20-c627fc7 / 4c6c9e0 and sv11499 for C96975). Fast-follow cases (section 87347) are out of the run: C614711, C96964, C690642, C690647, C97020, C590121, C97022, C96967, C368147, C707079. Section 55300 "Not runnable for now" is empty (24 cases back in their native folders).
- **Jira, 21 Oct:** SV-11627 filed then moved under Fast Follow epic SV-11593 as a Bug; QA Assignee Bilal on SV-10043's 12 stories; QAcomplete label on 50 Done defects (39 added).
- **Production, 22 Oct 11:15 UTC:** app.shopview.com is **v26.43.0-ffea43c** and the release is LIVE (switcher List / Tech View / Board View with a "New" badge; Board View has no density button — SV-11580's change). Staging is v26.43.0-e48011d. QA lead's order: run the suite on production as soon as the release is there — **Design — how it looks (section 73780, 24 tests) first, then the rest of run 498**; results go into run 498 marked "production".
- **Harness for production (new):** `source prod-env.sh` → `WOB_PROD_LOGIN=1` makes `session.mts open()` sign in with `prod-login-boot.mjs` (second admin test account in `/tmp/shopview/prod-login.env`, never the QA lead's). `profiles/app.shopview.com.json`: org 72b2cc90-6964-4429-a207-76e55f946936 (found by `org-probe2-1022.mts`), Truck Hill 1 (555206ea…) and Trucks Hill 2 (b617914c…). Evidence folder `evidence/prod-2026-10-22/`. Self-test 34/34 before and after.
- 22 Oct 11:48 UTC — production full run in progress (step 8 of 77 at 11:47, all steps exit 0 so far); Design judging with two helpers; evidence autosaved every 10 min (`autosave-prod.sh`, L0506). Re-runs queued after the full run: design-stg5 ONLY=C590113,C590114,C590117,C590119 (C590114/C590117 are Fast-follow, judged only if back in the run).
- 22 Oct 12:40 UTC — QA lead: YES — C590120 steps 6–7 (and only their Expected lines) rewritten to PRD v73 S3-R11 / S6-E1 (case-updates-2026-10-22/, fr-view checked). Script updated; re-run queued after the full run with the other Design re-runs (C590112, C590113, C590115, C590116, C590119, C590120, C590127, C598326) and C96917 (s1-batch4b, "Failed to fetch" while moving between screens).

### 22 Oct 2026 14:25 UTC — production time zone reading (Rule 125) — OPEN
- Truck Hill 1 set to **Asia/Karachi** (was Africa/Bangui; the 11:xx set-up step had timed out on the staging location name). Readings: (b) 13:34, same session after the change — Schedule "now" pill **6:34 PM = browser clock** (cached user zone still Africa/Bangui); (c) 14:24, fresh sign-in — location, user zone and browser all Asia/Karachi, pill **2:24 PM** while the browser read **7:24 PM** (the now line sits at UTC; `evidence/prod-2026-10-22/tz-match-1022c.png`). Two more readings (d, e) queued after the full run. Until settled, time-of-day verdicts from this run (shifts "running now", schedule drops) are judged with this caveat and are not Failed on time alone.
- 22 Oct 14:40 UTC — production results posted so far: 45 Passed, 0 Failed (Design folder 19 of 24 Passed; C614716, C614717, C682439, C682440, C682420 come in the full run). C590116 step 7 (log out Admin, sign in as User-B) is done by the script in User-B's own window — counted Passed (what User-B sees is the point); C97006 held and re-queued because its script did not do steps 6 and 8 as written (L0513).
- 22 Oct 2026 (QA lead, C368154 named): "Yes, rewrite step 4 to Tech View and never the PRD." Done: step 4 reads the density in Tech View and returns to Board View for step 5; Expected sentences unchanged (S6-R5 still "Use Regular as the default density." in PRD v73); one source line added quoting PRD v73 S6-R1. Read back equal; stored-value check flags only the pre-existing <br>; served page fr-view, no literal tags. Script `s11-batch.mts` follows the new step; production re-run queued. Files: `run498-2026-10-08/case-updates-2026-10-22/c368154_step4.py`, before/after JSON.
- 22 Oct 15:29 UTC — second reading for the open time question: C96962's Work Order Log on production lists "Lead tech changed … Oct 22, 2026 03:25 PM" for a change made at 15:25 UTC (20:25 Asia/Karachi), with location, user zone and browser on Asia/Karachi (`evidence/prod-2026-10-22/C96962-b40*.png`, `C96962-b40.json`). With the Schedule now line at UTC (reading c), production appears to show times in UTC after a fresh sign-in. Still OPEN — readings d/e queued after the full run; Rule 104 proofs (positive control: a time the product shows correctly in the same session) before anything is called a fault.
- 22 Oct 16:08 UTC — OPEN: account access (`/impersonate-user/<user id>`, used by imp-fix3 C368238/C368239, seed-carol-prod-1022, stg-fix-new3's C581895 set-up) did not start on production for Esther Howard: no orange bar, `GET /api/…state` answered 400 "You are not currently impersonating a user." Read-only probe `impersonate-probe-prod-1022.mts` queued after the full run (route responses + Staff row menu). C368238/C368239 are not judged until it reports; Rule 104 — the route, the account's permission and the staff record are each checked before anything is called unavailable.
- 22 Oct 2026 — QA lead could not follow three one-line questions; new Rule 134 (layman, context, recommendation, full question on every reminder). The three questions as rewritten and sent: `/scratchpad` copy committed as `run498-2026-10-08/asks-1022-rewritten.md` — (1) spacing step on Board View in three usage-tracking tests (C97025, C97027, C97035; recommend: move to Tech View and change the expected "loaded" count 2 → 1 on his say-so), (2) compare-with-production on production (C368233; recommend Passed with a note), (3) scroll-loading list (C368197; recommend count scroll loads as pages, Passed).
- 22 Oct 2026 (QA lead answers "Question 1: a, Question 2: a, Question 3: a"): (1) C97025, C97027, C97035 — density steps moved to Tech View; C97035 Expected work_orders_density_load 2 → 1 and its grand total 41 → 40 (Rule 114(c), named cases); source line quotes PRD v73 S3-R11 + S6-R1; read back equal, served pages fr-view, no literal tags; `analytics-batch.mts` follows; production re-run queued. (2) C368233 Passed on production with the note that production was compared with itself. (3) C368197 Passed — scroll loads count as pages (as staging, 17 Oct). Files: `case-updates-2026-10-22/c970xx_density.py`, before/after JSON.
- 22 Oct 2026 (QA lead, C97024 named, answered "a"): Expected Step 2 sentence "There is also one work_orders_density_load event for Board View." removed (Rule 114(c)); source line quotes PRD v73 S3-R11 with the dated decision; read back equal, served page fr-view; Passed on production on that day's readings (no picture — background recording only). C97029: saved display set to Tech View in the script (case does not name the display) — re-run queued, no case change.
- 22 Oct 2026 — production people that staging already had and production did not (each made by the script that needs it, or a seed, queued before the test's re-run): ZZAUTOTEST WOB User B (`zzautotest.wob.userb.1008@…`, s2-batchC — C96926), Carol Neal / David Sparks (seed-carol-prod-1022 — C707077, C96929), Olive Office with a custom "Office User" role (seed-office-prod-1022 — C368163), the second Chris Lee (seed-staff, present), ZZ WOB Runner at the second location (runner-loc2-1022 — C368226, C368231). Before a run on a new environment, grep each script's `staffRows(a, '<email>')` lookups against the environment's staff list.
- 22 Oct 2026 (QA lead, C96944 named, answered "a"): step 6 (density on Board View) removed and "at every density" removed from the Expected (Rule 114(c)); source line quotes PRD v73 S3-R11 with the dated decision; read back equal, served page fr-view. Script hovers each of the three cards; production re-run queued.
- 22 Oct 17:5x UTC — FIRST FAILED reading on production: C96953 step 7 — the mouse wheel over empty space below a short Board View column moved the whole page down 56 px (tabs, Search, filters and switcher went out of view); Expected (PRD v33 S3-E1): "The page itself does not scroll vertically; only the content inside each column does." Same step passed on staging 19 Oct (v26.40.19). Window 1600 x 1000 in both. NOT yet posted: second attempt queued with the page height measured (Rule 104); then Rule 106 reconcile (live PRD), Rule 112 story status (SV-10046), Rule 113 result + held ticket + per-ticket ask.
- 22 Oct 18:3x UTC — time question, fourth reading (C96966): a shift set up for tomorrow 08:00–12:00 location time (Asia/Karachi) was drawn on the Schedule grid at 3 AM–7 AM (its details read "8:00 AM – 12:00 PM"); Timesheets list a 17:56 UTC clock-in as 05:54/05:56 PM. With the Work Order Log (UTC), the now line (UTC) and the stored timesheet (−5 h), production consistently shows UTC wall-clock times while location, user and browser are on Asia/Karachi. Still to settle before any report: readings d/e (fresh sign-ins after the run) and a positive control.

## 22 Oct 2026 (18:26 UTC) — C96953 (page scrolls on Board View, production) — gate readings before any ask
- Source re-read (Rule 106/114): PRD 845185030 **v73**, read 22 Oct 2026 (`source-verify-2026-10-21/prd-845185030-v73-read-1022.txt` line 482), S3-E1 still reads: "The page itself does not scroll vertically; only the content inside each column does." The case's Expected quotes the same sentence, so case and source agree.
- Owning story **SV-10046** "Board View — board by lead technician" read live 22 Oct 18:25 UTC: **Done** (updated 22 Oct 08:14 -0500). Rule 112's table names Ready for QA / Testing QA / QA Complete; **Done is not named**. The WO Board epic's after-release faults go as **Bugs under the Fast Follow epic SV-11593** (L0500; Chris moved SV-11582/11545/11546 there). So where a ticket would go is a question for the QA lead, put to him with a recommendation (Rule 134), not decided here.
- Production evidence so far is ONE reading (step 7: the mouse wheel over the empty space below a short column moved the whole page down 56 px). Second attempt, measuring the window and page heights, is queued in redo3 (`s3-batchA C96953,C96941,C96942`). Nothing is posted until it reads back.
- 22 Oct 2026 (19:50 UTC) — production batch 17: C97021, C368150, C97003 Passed; **C368152 Failed at steps 8 and 12** (keyboard reassign/unassign message reads "Lead technician updated" / "Lead technician removed" with Close, not "<number> assigned to <technician>" / "<number> moved to Unassigned" with Undo — PRD v73 S4 message table). Known problem **SV-11524** (Bug, parent Fast Follow SV-11593, status **Code Review** read live 22 Oct) — posted Failed with that ticket and the follow-the-status comment, title prefixed (Rule 133); no new ticket. C368151 and C368146 Unsure (scripts did not follow steps 5–7 / staff changes behind the screen) — script fixes queued.
- 22 Oct 2026 (20:10 UTC) — **full production run finished** (steps 19–79 of `full-order-prod-1022.txt`; queue.out in `run498-2026-10-08/evidence/prod-2026-10-22/logs-full/`). Step 79 (C368240 sign-out, `signout-fix.mts`) printed nothing after sign-in for 24 min and took no picture; stopped by hand (no reading, nothing posted), progress lines added, re-queued LAST in redo3 with `timeout 900`. Steps 72 (C97012 two people) and 73 (C97026/C97033/C97034 two-day analytics) are TODO/TWO-DAY and were not run. The re-run queue (redo3) started 20:10 UTC.
- 22 Oct 2026 (20:37–20:38 UTC) — **time-zone readings d and e** (e: browser 1:38 AM, pill 8:38 PM, match:false — identical) (`stg6-tz.mts`, production): location Truck Hill 1 = Asia/Karachi, user zone Asia/Karachi, browser Asia/Karachi (clock 1:37 AM), Schedule "now" pill **8:37 PM** — exactly UTC, `match:false`; the fourth reading the same way (b, c and the C96966/Timesheet readings earlier). Rule 125 is NOT proved on production, so no time-of-day verdict is given. Positive control: the same check matched on staging. A read-only probe of every place a zone is stored (organisation, user, location, Settings, Schedule) is queued (`tz-source-probe-1022.mts`) before anything is called a product fault (Rule 104).
- 22 Oct 2026 (21:00 UTC) — re-run entry 18 (`c682439-440.mts`, WOB_PILL_WO=S1-1262): C682439 readings taken; C682440/C682420 got nothing — S1-1262 and the first six screens of List had no work order whose status pill shows BOTH a red and a blue count. Script now seeds one (playbook §Y recipe: Line-1 authorized + part request = blue, Line-2 Authorization required = red, then Approved → Ready For Review) and is re-queued.
- 22 Oct 2026 — C707077 re-run stopped: "Carol Neal not found". On production, renaming the account via account access also renamed the staff record (L0539); the seed now tests whether the two names can differ at all on production (re-runs at queue lines 35/43).
- 22 Oct 2026 (21:15 UTC) — re-run batch 20 posted: **C368154 Passed** (new user: List first, Tech View density Regular, Board View default fields — the rewritten step 4), **C682439 Passed** (dark-theme column scrollbars 10 px, dark grey, no white track: outcome (3) of the SV-11430 note — the fix is on production; tell the QA lead). Unsure: C581915–C581918 (the 21 Oct scripts look for staging people; `tech-filter-stg6.mts`, which MAKES its NT1 people, re-queued for all four after the stg6 seed), C96970 (step 13 opened the work order by address), C368131 (steps 1 and 3 not by the case's route). Judge's side note: production's Tech View / Board View show a "Deleted technician" group/column that the Technician filter does not offer — possibly SV-11575's area; not a step of these cases, recorded only.
- 22 Oct 2026 (21:40 UTC) — **account-access probe read** (`impersonate-probe-prod-1022.json`, read only): `/impersonate-user/<Esther's user id>` answers 200 but the page lands on Work Orders as the admin with NO "Account Access Mode" bar; on Settings > Staff, Esther's row offers only "1 Department" and the edit pencil — no menu with an account-access item. So the test admin (role "Service Advisor No Reports (Admin)") cannot start account access through the screen on production; `POST /api/switch-user` (behind the screen) does work. C368238/C368239 (start/exit account access while a page loads) need the SCREEN route and are not run. Next routes (Rule 107): read whether the role has the account-access permission and turn it on, or use the QA lead's own sign-in (he allowed it; it ends his open session). Put to him in the final report.
- 22 Oct 2026 (22:05 UTC) — re-run batch 22 judged, NOTHING posted: 13 cases; 11 Unsure (C368174, C368178, C368190, C368192, C368173, C368188, C368189, C368179, C368245, C368246, C368167) — every observed Expected met except where unread; Unsure because a page was opened by its address where the step says open it, the time-of-day rule, or thin pictures. **C368234, C368235**: judge passed them by applying the QA lead's C368233 decision ("production compared with itself") by analogy — NOT posted; an analogy is not his decision (Rule 114(c) spirit), so it goes to him as a question. Open-from-list helpers in `high1-fix5`, `high1-fix`, `s11-batch`, `editwo-fix` now switch to List before searching (C368173 landed on Tech View and fell back to the address); C368173 re-queued.
- For the final report: a QA-lead question — accept "opened by its link" for steps that only say "open the work order / Schedule / customer" where navigation is not what the case checks (would move ~15 route-only Unsure cases to Passed on his word).
- 22 Oct 2026 (22:20 UTC) — C707077 posted **Blocked** on production: staff name and sign-in name are one shared name there (proved both directions, `seed-carol-prod-1022.json`); the test's set-up (Carol Neal / David Sparks) cannot exist on production. Passed on staging earlier. For the report: ask whether it is staging-only.
- 22 Oct 2026 (22:40 UTC) — re-run batch 24 judged, nothing posted: all 8 Unsure. Route-only: C368218, C368219, C368223 (left-menu click looked for the first matching element, a hidden one; now `:visible`). C368169/C368171: list row not found (fixed by the List-first change) — re-queued with the others. C368226/C368231: production's Location filter starts with BOTH locations ticked; the script now unticks the case's pick first (start state = first location only), then step 3 ticks it. **C368170**: Create Invoice → "New Customer Payment" window; the case closes it with X, and on production that takes the invoice back off (L0521), so the work order never reads Invoiced and steps 5–7 ran on a Complete order — goes to the QA lead (case route vs production behaviour), not a ticket. Leftover: S1-1663 may now be led by Ralph Edwards with an open mileage question (dummy data, no clean-up needed).
- 22 Oct 2026 (22:55 UTC) — re-run batch 25: **C97025 Passed** (posted, no picture — usage records). Held Unsure: C97027 (page address/title of each usage record not read — search text could ride in the address), C97035 and C97023 (counts match; the scroll step has no reading that more cards loaded), C368153 (role used lacks Create & Edit), C96936 (still Ralph not Aaron; production's work order page shows Lead technician as plain text — step 5 done behind the screen; worth a hand check), C368180/C368181/C368184/C368185 (results match; customer pages opened by address and WO-A shows Approved, not Estimate).
- 22 Oct 2026 (23:05 UTC) — re-run batch 26 judged, all 6 held Unsure: C96929, C368161 route-only (Work Orders opened by address; everything else matched); C96926 (step 6 not read on screen); C96954 (field picker not read back, set-up lacks extra line technicians); C96955 (step 9 Compact not confirmed); **C97029** — its set-up ("dispatcher saved on Board View with a density") cannot exist on production (Board View has no density, PRD v73); the script saved Tech View instead, so step 3 recorded 1 display record, not 2. A case question for the QA lead (same family as C97024/C97025/C97027/C97035, which he had moved to Tech View).
- 22 Oct 2026 (23:20 UTC) — re-run batch 27 judged, all 7 held Unsure: C96944, C368137 route-only (Work Orders opened by address); C96948 (step 6 sign-out/in of the first browser not done); C96968 (closed the connection message, not the alert); **C154890** (alert not closed; step 7 read from records) — NOTE its earlier "Passed on production" came from the old stand-in (refused saves) — flag in the report; C96960/C96961 (line clock read behind the screen). Judging consistency: batches 3–13 accepted "Open Work Orders" by address; batches 15+ do not — the QA-lead question on route-only settles both ways.
- 22 Oct 2026 (23:30 UTC) — **C96953 confirmed and posted Failed (ticket held)**: second attempt (re-run entry 51, 23:11 UTC) reproduced — window 1600×1000, page 1056 px tall; wheel over empty space below a short column scrolled the page 56 px (toolbar off screen, picture); positive control: Unassigned's own scroll moved 1200 px with headers fixed. Source re-read v73 S3-E1 (case agrees). Owning story SV-10046 Done → filing destination asked of the QA lead. Duplicate check (JQL, 22 Oct 23:28): no existing report of the board page scrolling. Draft: `run498-2026-10-08/defect-drafts/tickets/held-1022/C96953-page-scrolls-HELD.wiki` + two pictures.
- 22 Oct 2026 (23:40 UTC) — re-run batch 29 judged, all 8 held Unsure, no Expected contradicted: C96941, C96942 (address + one distinct picture); C96975 (no real log-out/in; production's profile button is an avatar without initials, so the script's location-menu click timed out); C96976, C96983 (not in the re-run script — re-queued from `s5-batchA.mts` as list 5); C96972 (Create Invoice click missed, invoiced behind the screen; refusal alert text matched); C96989, C96992 (Board View not read at the steps that set the baseline; no Board View density button on production — likely SV-11580's outcome (3), "fix shipped", once read).
- 22 Oct 2026 (23:45 UTC) — **time-zone source probe** (`tz-source-probe-1022.json`, read only): every stored zone that can be read says Asia/Karachi — the location Truck Hill 1, the user's workplaces list, the browser; the organisation and user-settings reads answered 404 and Settings > Organization has no time-zone field. At 04:24 Pakistan time (Fri 23 Oct) the Schedule showed **Thu, Oct 22** with the now-line near 11 PM — UTC (picture `tz-source-schedule.png`). Positive control: the same check matched on staging (Rule 125). Conclusion for the report: on production the Schedule draws the day and the time in UTC although nothing we can see is set to UTC — a finding to put to the QA lead (raise or not, and where); all time-of-day verdicts on production stay unjudged until then.
- 22 Oct 2026 (23:45 UTC) — **permission probe** (`role-access-probe-1022.json`): the test admin's role IS "Admin" (built on the Admin template, 45 permissions), identical to the built-in Admin role — nothing missing, and no permission mentions account access. So the screen route for account access is not offered to this account for a reason no role setting controls. C368238/C368239 need either the QA lead's own sign-in (he allowed it; it ends his open session) or a decision to keep them staging-only.
- 23 Oct 2026 (00:10 UTC) — re-run batch 30: **C96990 Passed** (posted). Held Unsure: C368209, C368130 route-only; C368215 (row not found after search, opened by address); C368217 (`ps-counts` third-location check tests the ERROR TEXT for "Truck Hill 1" and so counts a failure as success — fix: read the top bar); C97032 (S1-1688 row not found, approved behind the screen; filter-clear line commented out); C368157 (Cal not in the pictures); C368214 (used the Work Orders tab, which has no Status filter; the 19 Oct decision says All); C368156 (step 5 needed the SANKAN detour — choosing Truck Hill 1 while the field already reads it does nothing: possibly a product problem, for the QA lead).
- 23 Oct 2026 (00:12 UTC) — container restarted at ~00:07; the re-run queue (list 4) and autosave kept running, only the watcher was lost (re-armed). C614714 second attempt: Edit Staff Member > Time Clock off > **Save & Close sent NO request at all** (every non-GET call recorded for 6 s: none), the window stayed open with no field error, record unchanged — two attempts now. Not called a product fault (the click may not have reached the button); goes to the QA lead as a one-minute hand check. C614715 (empty location now created with Country) and C614719 (steps 8–13 now run) packed for judging.
- 23 Oct 2026 (01:15 UTC) — batches 31–32: **C368151 Passed** (posted; the keyboard fix works). Held Unsure: C96965 (Schedule steps read behind the screen + time of day), C154648 (production has no imported work order), C368133 (message after lead change not pictured — would match SV-11524 outcome 1), C581889 (switches to staging-only "QB Location"), C581890/C581917/C581918/C614715 route-only, C581891 (canned line names differ on production), C581915 (no deactivated technician made; SV-11575 Done), C581916 (step 1 not read), C96976 (start state not set; second browser certificate error), C96983 (wrong field turned on at step 9), C368217 (`ps-counts` third route throws "np is not defined" — script bug), C614714 (Save & Close sends nothing — hand check), **C614719: the case contradicts itself** (preconditions give Customer-C three work orders, step 9 expects only WO-4) → question for the QA lead. **Admin:** C368133 and C581891 are no longer in run 498 (their old test rows return nothing) — ask which run they belong to before anything is posted for them. Leftover: "ZZAUTOTEST C614715 Empty Location" now holds three work orders (a C614719 ordering bug); a re-run needs a fresh empty location.
- 23 Oct 2026 (01:55 UTC) — re-run batch 34, all 7 held Unsure: C368218/C368219/C368223 route-only (the left-menu click still times out on production although the link is visible; the page is then opened by address); C368226/C368231 (production now has THREE locations in the report filter — "ZZAUTOTEST F2 No Tech Shop" was created by C368130 — so unticking only Trucks Hill 2 does not give "first location only"; C368226 showed no rows before the reload and 31 after, possibly read too soon); C368169 (Mileage reads "120500" after reload where the Expected says "120,500" — a formatting difference worth a hand check; the script also pressed Enter); C368171 (history entry time 01:27 AM = UTC — time-of-day rule).
- 23 Oct 2026 (02:00 UTC) — re-run batch 33: **C368168, C682440, C682420 Passed** (posted). C682440 = outcome (3) of its known-problem note: **SV-11467** (Tech View Compact count bubbles cover the status name) is Done (read live 23 Oct) and the fix shows on production — tell the QA lead. Held Unsure: C368166, C368158, C96937 route-only (Work Orders opened by address in step 1); C368173 (the remove-Dana X not found — likely a different staff record for Dana); C96928 (new sign-out branch read through the blanked page's connection → "Failed to fetch"; fix: use p3/a3).
- 23 Oct 2026 (03:00 UTC) — QA lead asked why C96953 (test 3481897) and C368152 (test 3761673) failed on production after passing on staging, and made **Rule 135** (a Failed comment says only where and how it failed, with annotated pictures of the failure). Findings: **C96953** — the new Technician filter (SV-11326, Done 20 Oct, after the 19 Oct staging pass) makes the toolbar too wide at 1600 px; Create Work Order wraps, board 56 px lower, page 1056 px in a 1000 px window, wheel scrolls it (third production run 02:51 UTC, `layout-1023.mts`, pictures `pictures-prod-1023/C96953-*`). **C368152** — Expected changed 19 Oct 22:13 to the PRD v68 S4-R5 wording with Undo (SV-11524, Code Review); the build still shows "Lead technician updated/removed". Both comments EDITED in place (results 536391, 535233) to the Rule 135 shape; old pictures replaced by annotated failure pictures (`comment-edits-1023/`). Held draft `defect-drafts/tickets/held-1022/C96953-page-scrolls-HELD.wiki` updated with the cause and the correct before/after pictures. Density-change cases for the automation engineer: C368154, C590120, C96944, C97024, C97025, C97027, C97035. List 6 finished (signout-fix timed out again at 15 min); 9 results packed and sent to a judge (batch 35).
- 23 Oct 2026 (03:10 UTC) — QA lead asked how C707077 (test 4101036) passed on staging. Re-proved the production Blocked properly (L0554): sign-in name and staff record name move together on production by every route, including Profile > Edit Profile > Change Name on screen; staging had a ready-made person whose names differed. Blocked comment 535247 edited to the corrected evidence + Edit Profile picture. Batch 35 judged: **C368126, C96988, C682445 Passed** (posted with pictures; C682445 is outcome 3 of its expect-fail note — SV-11119 Done, the fix is on production: tell the QA lead); Unsure held: C682419 (step 7 location not changed), C368191 (no "Deleted user" on production; deleting a technician with logged time refused), C682421, C682437, C682438, C682446 (script set-up failures on production), see `verdicts-batch35.json`.
- 23 Oct 2026 (03:30 UTC) — **Final production report sent** (`run498-2026-10-08/final-report-prod-1023.md`): 156 Passed · 2 Failed (C96953 held ticket, C368152 SV-11524) · 4 Blocked · 89 held · 26 never run; ten questions. Hourly check-in routine disabled.
- 23 Oct 2026 (04:00 UTC) — QA lead's answers applied: SV-11720 filed (Bug, Fast Follow SV-11593; ends with the case and run-test links) and put on C96953 (comment edited, follow-the-status result 537631, title prefixed); 15 route-only + C368234/C368235 Passed (RESULTS-prod-dec1023); C97029 preconds / C368170 step 2 / C614719 step 9 Expected changed as he said (case-updates-2026-10-23/, served pages fr-view); C614719 and C97029 Passed on production; C368170 attempt 1 hit a dropped connection on Create Invoice (no payment window) — re-queued with the read-only name scan for C707077. Automated tests changed since 9 Oct: 36 (note for Ahtasham: AUTOMATION-UPDATES-for-Ahtasham-2026-10-23.md). Density-change tests since 20 Oct: 16 (3 Automated: C96988, C96989, C96992) — the 7 sent earlier were incomplete.
- 23 Oct 2026 (04:20 UTC) — QA lead: SV-11720 behaviour is expected. C96953 re-posted **Passed** (decision line; prefix removed); run 498 now passed 272 · failed 1 (C368152, SV-11524) · blocked 4. Rule 114(d) rewrite of C96953 (step 7 Expected) proposed to him, waiting for his yes.
- 23 Oct 2026 (04:40 UTC) — QA lead reopened SV-11720 and reversed the 'expected' ruling: C96953 re-posted **Failed** (result 537635 + follow-the-status 537636, title prefix back) with the new Rule 135(8) 'Fails against:' line (PRD v74 S3-E1). SV-11720 retitled 'Board View – The Whole Page Scrolls, Although the PRD Lets Only the Columns Scroll'; Description opens 'What the PRD requires' / 'What happens instead' (pictures re-sized, run link kept). C368152's Failed comment edited to add its 'Fails against' line (PRD v74 S4-R5). Push tool now refuses a Failed result without `source`.
- 23 Oct 2026 (04:55 UTC) — QA lead: 'PERFECT' for the Rule 135(8) shape (L0560, now the standard). C96953 moved to the Fast-follow folder (section 87347) and out of run 498 on his order (277 → 276 tests, others untouched; `fast-follow-2026-10-23/audit.json`); SV-11720's last line updated (the run link no longer resolves).
- 23 Oct 2026 (05:10 UTC) — QA lead: tests failed/blocked/retest on a fast-follow ticket leave the run (restating 21 Oct). C368152 (SV-11524, fast-follow label) comment corrected to the Rule 135(8) shape and moved to Fast-follow (87347); run 498 = 275 tests. Sweep tool `fast_follow_sweep.py` added; dry run on 498 finds none left (positive control: C368152 would be caught). Remaining Blocked: C707077 (no ticket), C96944/C97027/C97035 (SV-11580, not fast-follow). Run 498 now has no Failed test.
- 23 Oct 2026 (05:20 UTC) — QA lead: before Fast-follow moves / Failed→Passed flips, update the case to the current PRD (L0562). PRD v68→v74 diff saved (`source-verify-2026-10-23/`); all 45 Fast-follow cases under review against v74.
- 23 Oct 2026 (05:45 UTC) — Fast-follow cases vs PRD v74 (ff_review.json, 45 cases): 33 up to date; preconds/steps updated on C96953, C96954, C96955, C96957, C154889, C97002, C97028 (Assign lead technician, one click — S3-R14/S4-R13) and C97022 steps 10/12 (arrow keys + Enter, S4-R13); served pages clean. Held for the QA lead: C96969, C97008 (Automated, same line), C97028 density steps + Expected (S3-R11/S6-R1/S6-R3), C590114/C590117 quoted sentences changed (no asserted result changes). Blocked tests: C96944 Passed (route-only accepted); C97027 and C97035 re-running on production with the page address/title read (C97027) and a real load-more proof (C97035); C707077 stays Blocked (one name per person on production).
- 23 Oct 2026 (07:45 UTC) — Blocked tests made runnable: C96944 Passed (route-only accepted); C97035 Passed (step 7 proved: 78→130 cards in the column; totals 40); **C97027 Failed** — every Work Orders GA record carries page_location with the search text (?search=ZZAUTOTEST Bravo GA 82354) against PRD v74 S12-R5; report held (story SV-10593 Done → QA lead decides; recommend Fast Follow bug); C707077 stays Blocked. Run-wide wording to PRD v74 (QA lead allowed Automated too): 92 cases' preconds/steps updated — the Reassign set-up line (worded to work before and after SV-11524) and 'Fields to display' → 'Column Selection'; Automated C96969/C97008 + 20 more; served pages clean (case-updates-2026-10-23c/). Expected fields untouched: ~20 still say 'Fields to display'; design cases quote older S1-R9a/S6-E1/S1-R15/S4-R12 text — for his per-case yes. Run 498: 273 passed · 1 failed · 1 blocked.
- 23 Oct 2026 (08:20 UTC) — QA lead: never update a case on a ticket not on production (L0565). SV-11524 wording ('Assign lead technician', one click, no confirm) reverted on 82 cases (incl. C97022 step, Automated C96969/C97008/C96974 and others); 'Column Selection' kept (SV-11580 on production). Served pages clean (case-updates-2026-10-23d/).
- 23 Oct 2026 (08:35 UTC) — Simple list sent: 36 Automated tests whose text changed since they were automated (net comparison; AUTOMATED-TESTS-CHANGED-2026-10-23.md; Ahtasham note refreshed). Question put to the QA lead: keep C97027 Failed (search text in GA page address, PRD S12-R5) and file a Fast Follow bug (recommended) or pass it on his decision.
- 23 Oct 2026 (08:15 UTC) — QA lead approved filing C97027: **SV-11722** (Bug, parent SV-11593, Medium, Product Area Work Orders, label board-tech-view, relates SV-10593) — search text sent to Google Analytics in the page address, against PRD v74 S12-R5; composed picture (page + record); Chris Ward tagged and asked 'fast-follow or obsolete?'. Result 537638 edited to carry the ticket, follow-status result added, title prefixed. Stays in run 498 (no fast-follow label yet).
- 23 Oct 2026 (09:45 UTC) — C707077 (run 498, test 4101036) "unblock yourself": seven routes tried on production, all keep one name per person (L0568); gate 7/7 (`run498-2026-10-08/blocker-c707077-1023/claim.json`). Stays Blocked; comment edited to list all seven (result 535247, read back). Carol Neal restored and active. Question to the QA lead: keep this test staging-only (where the two-name person exists) — recommended.
- 23 Oct 2026 (10:10 UTC) — QA lead chose A: C707077 staging-only. Set-up updated (staging-only line + real staging pairs David Sparks/Carol Neal, Debra Garcia/Lindsay Perez, S2-37765); comment's last line edited to record the decision. Still Blocked on production.
- 23 Oct 2026 (13:55 UTC) — QA lead asked for proof David Sparks = Carol Neal on staging; he ran the 'sparks' search himself (no match). My on-screen check (carol-sparks-stg-1023.mts) is ready but staging sign-in expired (sso_required); waiting on fresh staging cookies from him.
- 23 Oct 2026 (14:00 UTC) — Proof sent to the QA lead: on staging, viewed as Carol Neal, Assigned to me lists S2-37765 led by David Sparks (4 annotated pictures, evidence/staging-2026-10-23/ann-*.png).
- 23 Oct 2026 (14:20 UTC) — C707077 PASSED on staging v26.43.1-f2d183d (S2-38093; result 537641, 5 pictures). Step 5 reworded: Edit Line has no Cancel, close with the X. Run 498: 274 passed, 1 failed (C97027, waiting on Chris).
- 26 Oct 2026 — Fixed tickets verified on their own QA branches, `→ QA Status: Passed` comments with pictures: SV-11500 (79469), SV-11501 (79470), SV-11668 (79471), SV-11686 (79472), SV-11545 (79473), SV-11524 (79475; Undo is SV-11567, Open). Rule 136 recorded. Linked tests run whole: Passed in run 498 — C590117 (T3995726), C96964 (T3481908), C97020 (T3481958) added back; C682422 (T4056656). Not passing: C590114 step 9 (padlock tooltip), C590121 step 3 (… button beside the pill), C682423–C682428 (Undo, SV-11567) — kept in Fast-follow, known-problem blocks re-pointed to SV-11567 (Expected edits under Rule 136, PRD v75 checked), C682422's stale SV-11570 note removed, titles of C590114/C590121 cleaned. No Automated case changed. C590110 step 9 vs SV-11668 vs PRD v75 "List keeps its column chooser" → question to the QA lead.
- 26 Oct 2026 (QA lead answers Q1 A · Q2 file + ask Chris · Q3 A · Q4 update): **SV-11753** filed (Bug, Fast Follow SV-11593, Medium, relates SV-10046; Chris Ward asked in comment 79481 whether the More actions button beside the status label is acceptable; design-vs-build picture sized). **C590121** Failed in run 498 (T3995730, title "SV-11753 - …") and **C590114** Failed (T3995723, padlock has no styled tooltip; report HELD for his go-ahead: `fix-verify-2026-10-26/ticket-C590114-HELD/`) — both read on production v26.43.1-9af7270 with a positive control. Run 498: 277 Passed · 3 Failed (C97027 SV-11722, C590114 held, C590121 SV-11753). **C590110** step 9 → SV-11668 (List's Column Selection icon = Board/Tech), PRD v75 divergence recorded, served page clean (not Automated). Q3: C682423–C682428 stay in Fast-follow. **Sheet** of Automated tests changed after automation with the reason per test (37 rows: the 36 of 23 Oct + Vladimir's C236979): https://docs.google.com/spreadsheets/d/1NThIhlZ5DY3Gadx5-l5syheNviuZ7649oInTwqFRVfo — evidence `automated-changed-why-2026-10-26/`. Automated count now 115 (was 95).
