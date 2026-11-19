# Example ask: V1 vs V2 capability check (A/R and A/P aging reports, Nov 2026)

Saved on the QA lead's request (13 Nov 2026): *"Save this Ask as an example to give me when I need."*
When he asks for "the example ask", "the A/R A/P ask" or "how did I ask for the V1 vs V2 check", give him this file.

## The ask, ready to copy (fill in the angle brackets)

> **V1 vs V2 CAPABILITY CHECK on `<feature>`** (epic `<SV-xxxxx>`, release `<date>`).
> After the upgrade, users must still be able to do everything they could do before, unless the PRD clearly takes it
> away. Read how it works today from the product code that production runs, write the regression tests into a
> **"Regression Tests"** folder in run `<run number>`, run them on `<QA branch / staging>`, and give every failed test a
> defect ticket in the approved format, with marked-up screenshots.

## Fail-safe additions (added 19 Nov 2026, from what went wrong on 16–19 Nov) — paste under any ask

> **How to work, every time:**
> 0. Start by running `python3 build/testing-tools/lessons.py "<this task>"` and read every hit (Rule 127).
> 1. Every statement you give me (report, test result, ticket) is something you saw, measured by a saved script, or quoted
>    from a document you read today, with its version. Anything else says "not checked" (Rule 126).
> 2. Before saying anything "differs from production" or "from before the release": write a table of the settings on
>    both sides (build, location, role, the app's time-zone setting, browser time zone, as-of date and whether it was
>    today, screen or data). Both sides must match. Then reproduce it on production itself, signed in normally, with a
>    picture, on today's production build (Rule 125).
> 3. Read the data the way the screen asks for it (same filters, same time zone), and look at the screen once before
>    concluding anything about what users see.
> 4. Before calling something a bug, "undecided" or "intended": read the current PRD again and quote it; read the epic's
>    shared notes and "known mismatches / not bugs" lists; search Jira including closed tickets and my own past comments.
>    If any of these already answers it, stop and tell me instead of drafting (Rules 121, 123, 126).
> 5. A question I haven't answered stays "HELD" in every note until I answer it.
> 6. A pass counts only for the build it was taken on. On release day, list which build each pass came from and re-test
>    everything whose code changed after it. Check the build marker before every step; test sites redeploy without notice.
> 7. When your own script reports a failure, first try to prove the script wrong: look at the actual rows, quote the
>    sentence the check is based on, and pick screen rows by their exact text.
> 8. Draft tickets only. Show me each draft with its evidence and annotated pictures before filing. I approve each ticket
>    separately, and nothing goes into TestRail without my go-ahead.
> 9. Ask me at the start for: fresh staging cookies, a production test login if production must be checked, and the
>    release time. Date-dependent screen tests on staging run only 07:15–17:45 UTC.
> 10. Report in tables: what was checked, the result, the known non-blockers (with the quote), what's still to do, what you
>    got wrong, and "OUTSTANDING — what I need from you".

| # | Added because |
|---|---|
| 0 | Lessons existed but were not looked up; Rule 127 (19 Nov) |
| 1, 4 | The partly-used credit question was called "undecided" although my own 12 Nov comment on SV-11315 settled it (M16, M17); Rule 126 |
| 2 | SV-12853 compared a UTC "before" with a location-time "after", skipped production, closed OBSOLETE (M15); production also redeployed the evening before release (75f8b2e → 0b53dd5) |
| 3 | Data read without the screen's time zone gave a false picture (M13) |
| 6 | 343 of 482 passes were on an 11 Nov build; staging went b6a5d15 → e93e93b overnight |
| 7 | 5 of 5 overnight "failures" were my own script errors (M18–M21) |
| 8 | Results posted with a garbled Defects value (M14); per-ticket permission (Rule 62) |
| 9 | The staging session expired mid-run; tests run across the Karachi/Edmonton date change give false failures |

## The same ask, as it was for A/R and A/P

> **V1 vs V2 CAPABILITY CHECK on the A/R and A/P aging reports** (epic SV-11315, release 19 Nov 2026).
> After the upgrade, users must still be able to do everything they could do in these six reports before, unless the PRD
> clearly takes it away. Regression tests in the "Regression Tests" folder, run 557; every failed test gets a Story Defect.

(The question as recorded in the project README: *"after the upgrade, can users still do everything they could do in
these reports before, unless the PRD clearly takes it away?"*. The original chat message is not kept word for word.)

## What it took (in order)

1. **Pin both ends:** V1 = what production runs (ShopView/shopview at fc08f23, production v26.45.3); V2 = the feature
   branch (SV-11315-ar-ap-aging-reports at 8e35ee0d02); intent = the PRD (Confluence 947650561, then v11, now v12).
2. **Scope:** which screens the change can touch, from the code diff (`SCOPE.md`): the six reports, plus three other
   reports' info icons and the cross-location work order links.
3. **V1 baseline from code** (`AR-AP-V1-BASELINE.md`, `INVARIANT-REGISTER.md`): what users can do today, with file:line.
4. **Possible losses** (`POSSIBLE-LOSSES.md`): what V1 does that V2's code no longer does and no document removes.
5. **Tests:** 72 tests for what V1 does (V1R-01 to V1R-72) plus 21 planned-change tests (V1R-73 to V1R-93, added on the QA lead's
   order: *"If they are planned changes, then OK add tests for them too but in the same folder."*).
6. **Run** on the QA branch (11 Nov), then on staging once the feature landed (12 Nov).
7. **Defects** for every real failure, in the approved regression layout (Rules 117-119), checked against Rule 121 first.
8. **Before/after on staging** (Rule 122): a snapshot of staging before the feature, re-checked after it landed.

## What it found

| | Result |
|---|---|
| Regression tests on staging | 88 run: 86 passed, 2 failed |
| Picking a date after today (directly or from a saved link) | Lost - **SV-12545**, tests C1078980 and C1078981 Failed |
| An invoice without a due date, aged from the customer's credit term | Retired on the QA lead's order (cannot be set up in the app) |
| A/R Detail PDF printing empty buckets | Product decided "OK as built" (SV-12546 closed); test rewritten to the decision, passed |
| "Run on Staging After the Feature Is Deployed" (16 tests) | 14 passed, 2 failed - **SV-12663** (Past Due counted one day off) |

**Since then (19 Nov 2026):** SV-12545 and SV-12663 fixed and re-tested; SV-12853 closed OBSOLETE (our error, M15).
Release audit of 18–19 Nov: whole-data, export and screen checks on staging v26.45.5-e93e93b, no release-blocking defect
found; run 557 at 485 passed, 4 failed (SV-12763, moved out of the release).
`build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md`.

## Where everything is

`build/ar-ap-report-sorting/v1-regression/` - README (summary), SCOPE, AR-AP-V1-BASELINE, INVARIANT-REGISTER,
POSSIBLE-LOSSES, PO-QUESTIONS, `cases/CASES.md` (all tests), STAGING-RUN-CARD (how to run it again), `defect-pack-2026-11-11/`
(tickets). Staging before/after: `build/ar-ap-report-sorting/existing-data-unchanged-check/`.
Process it follows: `build/processes/1-V1-VS-V2-CAPABILITY-CHECK.md`.
