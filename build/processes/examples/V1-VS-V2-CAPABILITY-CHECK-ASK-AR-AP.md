# Example ask: V1 vs V2 capability check (A/R and A/P aging reports, Nov 2026)

Saved on the QA lead's request (13 Nov 2026): *"Save this Ask as an example to give me when I need."*
When he asks for "the example ask", "the A/R A/P ask" or "how did I ask for the V1 vs V2 check", give him this file.

## The ask, ready to copy (fill in the angle brackets)

> **V1 vs V2 CAPABILITY CHECK on `<feature>`** (epic `<SV-xxxxx>`, release `<date>`).
> After the upgrade, users must still be able to do everything they could do before, unless the PRD clearly takes it
> away. Read how it works today from the product code that production runs, write the regression tests into a
> **"Regression Tests"** folder in run `<run number>`, run them on `<QA branch / staging>`, and give every failed test a
> defect ticket in the approved format, with marked-up screenshots.

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

## Where everything is

`build/ar-ap-report-sorting/v1-regression/` - README (summary), SCOPE, AR-AP-V1-BASELINE, INVARIANT-REGISTER,
POSSIBLE-LOSSES, PO-QUESTIONS, `cases/CASES.md` (all tests), STAGING-RUN-CARD (how to run it again), `defect-pack-2026-11-11/`
(tickets). Staging before/after: `build/ar-ap-report-sorting/existing-data-unchanged-check/`.
Process it follows: `build/processes/1-V1-VS-V2-CAPABILITY-CHECK.md`.
