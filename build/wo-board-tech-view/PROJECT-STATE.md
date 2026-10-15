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
