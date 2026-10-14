# 14 Oct 2026 — six tests to retest on STAGING (3 changed + 3 new); build verification first

**QA lead, 14 Oct 2026 (~15:30 UTC):** "save the state as we have 3 new test cases and 3 old test cases to retest on
staging … since the feature is now on staging this needs to be build verified on staging … BUILD VERIFY the test cases
only, do not cross your lane." Fresh staging sign-in supplied (three values, in `/tmp/shopview/app.env`, never committed).

| # | Case | Run 498 test | Status in run 498 (read live 14 Oct 15:40 UTC) | Kind |
|---|---|---|---|---|
| 1 | [C154648](https://shopview.testrail.io/index.php?/cases/view/154648) Tech View and Board View are unavailable while Imported is selected | [3481974](https://shopview.testrail.io/index.php?/tests/view/3481974) | Passed (QA branch, before today's rewrite) | changed today |
| 2 | [C368133](https://shopview.testrail.io/index.php?/cases/view/368133) The clear-shifts question appears only for the old lead's unfinished shifts (**Automated**) | [3761654](https://shopview.testrail.io/index.php?/tests/view/3761654) | Passed (QA branch, before today's rewrite) | changed today |
| 3 | [C96965](https://shopview.testrail.io/index.php?/cases/view/96965) Clear shifts removes only the old lead's whole-work-order shifts | [3481909](https://shopview.testrail.io/index.php?/tests/view/3481909) | Passed (QA branch, before today's rewrite) | changed today |
| 4 | [C581889](https://shopview.testrail.io/index.php?/cases/view/581889) Board View and Tech View show the filter message when no work order matches | [3973195](https://shopview.testrail.io/index.php?/tests/view/3973195) | Untested | new today |
| 5 | [C581890](https://shopview.testrail.io/index.php?/cases/view/581890) A search alone that matches nothing shows the search message with no button | [3973196](https://shopview.testrail.io/index.php?/tests/view/3973196) | Untested | new today |
| 6 | [C581891](https://shopview.testrail.io/index.php?/cases/view/581891) A line with only a Schedule shift technician follows the new lead technician | [3973197](https://shopview.testrail.io/index.php?/tests/view/3973197) | Untested | new today |

Run 498 (https://shopview.testrail.io/index.php?/runs/view/498): **243 tests — 240 Passed, 3 Untested** (the three new ones).

## What was already done today (facts, from another session's committed work — branch `claude/build-verification-setup-aieu36`)
- Cases rewritten / created by the source-currency pass (branch `claude/slack-session-setup-7v5itm`, commit 096421603):
  source = PRD 845185030 **v48**, read 14 Oct.
- **Build verification of all six on staging build `v26.40.17-ddb9ba1` was done at ~15:16–15:21 UTC** (commits 159189aa3,
  aa18345ef; evidence `build/wo-board-tech-view/build-verify-staging-2026-10-14/` on that branch): screens and labels only,
  no test run; stamp "Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026." added; marker READY; an
  "Asset on Site shows no choice" line added to the preconditions; C368133 (Automated) changed after the QA lead's YES.
- **Staging is still `v26.40.17-ddb9ba1`** (read 14 Oct 15:35 UTC with the new sign-in) — so that check is on the current build.

## Things noticed in that check (for the QA lead; not changed by this session)
1. Every one of the six now says BOTH "This version of the case has not yet been checked against a build" / "Not yet
   checked against a build." AND "Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026." in its source
   note — the old sentence was not removed when the stamp was added. Both lines are inside the Expected field (Rule 114).
2. Its build search found the screens' "Try removing a filter to widen your results." and "Clear all filters", but NOT the
   two headings the new tests expect: "No work orders match these filters" (C581889) and "No work orders match the search"
   (C581890). Not proved either way (a search of the build's files, not the screen — Rule 104); it is the first thing to
   look at when those two are run. It is not a build-verification finding: the Expected comes from the PRD (Rule 57).

## QA lead's answer (14 Oct ~16:00 UTC) and what was done
He: the three new ones never had a result and the three old ones were rewritten after the PRD change — all six must be RUN on
staging (asking whether to re-check was wrong — L0330); remove the "not yet checked" sentence only after the results are in.
**All six RUN on staging v26.40.17-ddb9ba1 and recorded PASSED in run 498 (14 Oct 2026, ~17:00 UTC):**
`RESULTS-staging-6-2026-10-14.json`, evidence `evidence/staging-6-2026-10-14/` (stg6.json + screenshots).
Scripts: `stg6.mts` (all six, own data, normal sign-in), `stg6-sched2.mts` (C96965 Schedule read on screen), `stg6-tz.mts` +
`tz-match-staging.mjs` (Rule 125: Heavy Duty set to Asia/Karachi, pill 9:04 PM = browser 9:04 PM).
- C581889 ran at QB Location (every status at Heavy Duty has work orders); Status-A = Estimate.
- Technicians made in exactly "Service" (`zz.wob.<name>.svc@…`); the first four went to Service/Parts and had no Schedule row (L0330).
- Another session reworded C368133, C96965 and C581891 to PRD **v49** at 16:15–16:22 UTC (source notes and the quoted S4-R28
  only — "every approved line"); steps and expected outcomes unchanged, all lines in the data were approved, so the results hold.
- Sentence removal (his OK, after results): done on C154648, C96965, C581889, C581891 through TestRail's editor
  (`surgical_replace.mjs`; the API route is refused because the fields carry UI-made line breaks); Froala also turned one empty
  setup paragraph into a blank line. C368133 (Automated — tell Vlad) and C581890 hit a TestRail database lock and were done on the retry (17:08 UTC); all six read back without the sentence, nothing else changed, display scan clean —
  see `staging-6-sentence-removal-2026-10-14/`.
- Run 498 now has 248 tests: 243 Passed, 5 Untested — the 5 were added by someone else today, not part of this job.
