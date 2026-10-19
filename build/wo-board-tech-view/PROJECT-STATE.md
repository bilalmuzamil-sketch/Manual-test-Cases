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
