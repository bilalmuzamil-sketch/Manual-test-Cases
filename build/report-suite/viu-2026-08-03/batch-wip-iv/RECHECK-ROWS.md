# RE-CHECK ROWS — Work In Progress + Inventory Value (Standing Rule 49)

**STATUS: OPEN.** Merge these rows into the master `../RECHECK-QUEUE.md`. **Do not close this**
**batch until every row below has been re-verified against a build declared FINAL.**

## BUILD MARKER — the thing that makes a re-check meaningful

| Marker | Value |
|---|---|
| App version (authoritative) | **`v3.4.1-0ed4433`** — `<meta name="app-version">` in the SPA `index.html` |
| index.html `last-modified` | `Mon, 03 Aug 2026 13:40:38 GMT` |
| index.html `etag` | `02091e9dc11f187d7739b4efa166ea21` |
| Read at the START of this pass | `2026-08-04T01:00Z` (approx) |
| Read at the END of this pass | `2026-08-04T02:10:08Z` |
| **Changed mid-run?** | **NO — identical version, last-modified and etag at both ends.** |
| Environment | app `https://sv8582.qa.shopview.com` · API `https://sv8582api.qa.shopview.com` · org `d55bc308-e61a-438d-b5f1-c7a73c89d49f` |
| Declared final by engineering? | **NO** — every verdict in `VERDICTS.md` is PROVISIONAL |

Re-read the marker with: `curl -s https://sv8582.qa.shopview.com/ | grep app-version`

## WHEN TO RE-RUN THIS QUEUE

- At **every session start** on the Report Suite, alongside the Rule-35 design-queue check.
- **Before and after** any further work on Work In Progress or Inventory Value.
- **Immediately** when the branch is declared final, when the app-version marker changes, or when
  a session dies early (cookies on this estate die at ~24 h **or on deploy**).

A row that comes back **CHANGED** is a finding in its own right and gets reported, not quietly
corrected.

## THE ROWS (149 — every case in scope)

| # | Internal ID | C-id | Link | Verdict on build `v3.4.1-0ed4433` | What must be re-confirmed |
|---:|---|---|---|---|---|
| 1 | WIP-TAB-01 | C30451 | [open](https://shopview.testrail.io/index.php?/cases/view/30451) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 2 | WIP-TAB-02 | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | DEVIATION | Re-confirm the on-screen label text on the final build before adopting it permanently. |
| 3 | WIP-TAB-03 | C30453 | [open](https://shopview.testrail.io/index.php?/cases/view/30453) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 4 | WIP-TAB-05 | C30455 | [open](https://shopview.testrail.io/index.php?/cases/view/30455) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 5 | WIP-SCOPE-01 | C30456 | [open](https://shopview.testrail.io/index.php?/cases/view/30456) | VIU-Observed-PASS | Re-run once an In progress work order exists (or seed one through the UI) to observe the fifth status branch. Also re-confirm on the final build. |
| 6 | WIP-SCOPE-02 | C30457 | [open](https://shopview.testrail.io/index.php?/cases/view/30457) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 7 | WIP-SCOPE-03 | C30458 | [open](https://shopview.testrail.io/index.php?/cases/view/30458) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 8 | WIP-SCOPE-04 | C30459 | [open](https://shopview.testrail.io/index.php?/cases/view/30459) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 9 | WIP-SCOPE-05 | C30460 | [open](https://shopview.testrail.io/index.php?/cases/view/30460) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 10 | WIP-PLACE-01 | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | VIU-Observed-PASS | Re-run when an In progress work order exists to observe that branch. Also re-confirm on the final build. |
| 11 | WIP-PLACE-03 | C30464 | [open](https://shopview.testrail.io/index.php?/cases/view/30464) | VIU-Observed-PASS | Re-run against a purpose-seeded trio (clocked time / received part / neither) to attribute each branch to its specific cause. Also re-confirm on the final build. |
| 12 | WIP-COL-01 | C30466 | [open](https://shopview.testrail.io/index.php?/cases/view/30466) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 13 | WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 14 | WIP-COL-03 | C30468 | [open](https://shopview.testrail.io/index.php?/cases/view/30468) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 15 | WIP-COL-04 | C30469 | [open](https://shopview.testrail.io/index.php?/cases/view/30469) | DEVIATION | Re-confirm the on-screen label text on the final build before adopting it permanently. |
| 16 | WIP-COL-05 | C30470 | [open](https://shopview.testrail.io/index.php?/cases/view/30470) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 17 | WIP-COL-06 | C30471 | [open](https://shopview.testrail.io/index.php?/cases/view/30471) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 18 | WIP-COL-07 | C30472 | [open](https://shopview.testrail.io/index.php?/cases/view/30472) | VIU-Observed-PASS | Re-run against a work order created today and one created exactly one day ago to observe the "0 days" / "1 days" endpoints specifically. Also re-confirm on the final build. |
| 19 | WIP-COL-08 | C30473 | [open](https://shopview.testrail.io/index.php?/cases/view/30473) | VIU-Observed-PASS | Re-run against a work order touched today ("Today") and one with no recorded activity ("—") to observe those two branches. Also re-confirm on the final build. |
| 20 | WIP-CALC-01 | C30474 | [open](https://shopview.testrail.io/index.php?/cases/view/30474) | VIU-Observed-PASS | A negative WIP money value did not occur in the data; re-run if one becomes producible. Also re-confirm on the final build. |
| 21 | WIP-CALC-02 | C30475 | [open](https://shopview.testrail.io/index.php?/cases/view/30475) | VIU-Observed-PASS | Re-run with a purpose-seeded work order (one approved labor line, known quote, known clocked time, plus an over-clocked line) to observe the per-line cap directly. Also re-confirm on the final build. |
| 22 | WIP-CALC-03 | C30476 | [open](https://shopview.testrail.io/index.php?/cases/view/30476) | VIU-Observed-PASS | Re-run with a seeded known-quote work order to check the arithmetic against a hand-computed quoted value. Also re-confirm on the final build. |
| 23 | WIP-CALC-04 | C30477 | [open](https://shopview.testrail.io/index.php?/cases/view/30477) | VIU-Observed-PASS | Re-run with a seeded partly-received parts line to attribute the figure to a known quantity x sell price. Also re-confirm on the final build. |
| 24 | WIP-CALC-05 | C30478 | [open](https://shopview.testrail.io/index.php?/cases/view/30478) | VIU-Observed-PASS | The core-charge half (outstanding quantity valued INCLUDING the core charge) needs a seeded cored part on an approved unreceived line - re-run for that. Also re-confirm on the final build. |
| 25 | WIP-CALC-06 | C30479 | [open](https://shopview.testrail.io/index.php?/cases/view/30479) | VIU-Observed-PASS | Re-run the "differs from the work order's stored grand total" comparison against a seeded work order carrying tax/fee/discount. Also re-confirm on the final build. |
| 26 | WIP-CALC-07 | C30480 | [open](https://shopview.testrail.io/index.php?/cases/view/30480) | VIU-Observed-PASS | Re-run the before/after variant - add an unapproved line to a valued work order and confirm no figure moves. Also re-confirm on the final build. |
| 27 | WIP-CALC-08 | C30481 | [open](https://shopview.testrail.io/index.php?/cases/view/30481) | VIU-Observed-PASS | The green/red/zero colouring and the exact +2.0 / -14.0 / 0.0 rendering still need a screen read with the column on and rows of each sign - the toggle click was flaky in the scripted run (a tooling artefact; the toggle itself is proven by colsel-work-in-progress.json). Re-run on the final build. |
| 28 | WIP-CALC-09 | C30482 | [open](https://shopview.testrail.io/index.php?/cases/view/30482) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 29 | WIP-SORT-01 | C30483 | [open](https://shopview.testrail.io/index.php?/cases/view/30483) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 30 | WIP-SORT-02 | C30484 | [open](https://shopview.testrail.io/index.php?/cases/view/30484) | VIU-Observed-PASS | The exact asc -> desc -> asc cycle with no third cleared state, and the single-active-sort rule, need one more careful click sequence per column. Re-run on the final build. |
| 31 | WIP-SORT-03 | C30485 | [open](https://shopview.testrail.io/index.php?/cases/view/30485) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 32 | WIP-SORT-04 | C30486 | [open](https://shopview.testrail.io/index.php?/cases/view/30486) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 33 | WIP-CALC-10 | C38890 | [open](https://shopview.testrail.io/index.php?/cases/view/38890) | VIU-Observed-PASS | The running-clock behaviour (a technician clocked in, time accruing between refreshes) needs a live clock-in on a seeded quoted line and could not be driven this run. Re-run on the final build with an open clock. |
| 34 | WIP-SUM-01 | C30487 | [open](https://shopview.testrail.io/index.php?/cases/view/30487) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 35 | WIP-SUM-02 | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 36 | WIP-SUM-03 | C30489 | [open](https://shopview.testrail.io/index.php?/cases/view/30489) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 37 | WIP-SUM-04 | C30490 | [open](https://shopview.testrail.io/index.php?/cases/view/30490) | VIU-Observed-PASS | The Not Started tie needs the Approved - Not Started tab Totals read in the same window (the scripted tab click did not land on that tab). Re-run on the final build. |
| 38 | WIP-SUM-05 | C30491 | [open](https://shopview.testrail.io/index.php?/cases/view/30491) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 39 | WIP-SUM-07 | C30493 | [open](https://shopview.testrail.io/index.php?/cases/view/30493) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 40 | WIP-TOT-01 | C30494 | [open](https://shopview.testrail.io/index.php?/cases/view/30494) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 41 | WIP-TOT-02 | C30495 | [open](https://shopview.testrail.io/index.php?/cases/view/30495) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 42 | WIP-FLT-01 | C30498 | [open](https://shopview.testrail.io/index.php?/cases/view/30498) | VIU-Observed-PASS | The screen-only narrowing (no new /reporting call, no loading indicator) needs one clean selection with data present. Re-run on the final build. |
| 43 | WIP-FLT-02 | C30499 | [open](https://shopview.testrail.io/index.php?/cases/view/30499) | VIU-Observed-PASS | Confirm the Clear action is absent until at least one customer is selected, and that narrowing does not reload. Re-run on the final build. |
| 44 | WIP-FLT-03 | C30500 | [open](https://shopview.testrail.io/index.php?/cases/view/30500) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 45 | WIP-FLT-04 | C30501 | [open](https://shopview.testrail.io/index.php?/cases/view/30501) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 46 | WIP-FLT-05 | C30502 | [open](https://shopview.testrail.io/index.php?/cases/view/30502) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 47 | WIP-FLT-06 | C30503 | [open](https://shopview.testrail.io/index.php?/cases/view/30503) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 48 | WIP-FLT-07 | C30504 | [open](https://shopview.testrail.io/index.php?/cases/view/30504) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 49 | WIP-FLT-08 | C30505 | [open](https://shopview.testrail.io/index.php?/cases/view/30505) | VIU-Observed-PASS | The AND-combination and the "strip + Totals recompute with no reload" half need one clean three-filter selection with data present. Re-run on the final build. |
| 50 | WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 51 | WIP-PERS-01 | C30506 | [open](https://shopview.testrail.io/index.php?/cases/view/30506) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 52 | WIP-PERS-02 | C30507 | [open](https://shopview.testrail.io/index.php?/cases/view/30507) | VIU-Observed-PASS | Confirm the four tabs share one column set by switching tabs with a non-default selection. Re-run on the final build. |
| 53 | WIP-PERS-03 | C30508 | [open](https://shopview.testrail.io/index.php?/cases/view/30508) | VIU-Observed-PASS | Confirm the advisor/customer/asset/location selections and the active tab restore too, and that a different browser profile shows the defaults. Re-run on the final build. |
| 54 | WIP-PERS-04 | C30509 | [open](https://shopview.testrail.io/index.php?/cases/view/30509) | VIU-Observed-PASS | Confirm the same fallback for a stale advisor/customer/asset selection. Re-run on the final build. |
| 55 | WIP-EXP-01 | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 56 | WIP-EXP-02 | C30511 | [open](https://shopview.testrail.io/index.php?/cases/view/30511) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 57 | WIP-EXP-03 | C30512 | [open](https://shopview.testrail.io/index.php?/cases/view/30512) | VIU-Observed-PASS | The Inv. Hrs format in a file cannot be checked because the export rejects that column (see WIP-TOT-02). Re-run on the final build. |
| 58 | WIP-EXP-04 | C30513 | [open](https://shopview.testrail.io/index.php?/cases/view/30513) | NOT-BUILT | Re-run once the export accepts invoiced_hours. Until then this case is not executable. |
| 59 | WIP-EXP-05 | C30514 | [open](https://shopview.testrail.io/index.php?/cases/view/30514) | VIU-Observed-PASS | Observe the screen-vs-file one-day difference directly by generating a file either side of a day boundary. Re-run on the final build. |
| 60 | WIP-EXP-06 | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 61 | WIP-EXP-07 | C30516 | [open](https://shopview.testrail.io/index.php?/cases/view/30516) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 62 | WIP-EXP-08 | C30517 | [open](https://shopview.testrail.io/index.php?/cases/view/30517) | VIU-Observed-PASS | This org has no shop logo set, so the logo-present branch is not observed. Set a logo and re-run, and re-confirm on the final build. |
| 63 | WIP-EXP-09 | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | VIU-Observed-PASS | The success caption "Data exported successfully." and the failure text still need a UI toast read. Re-run on the final build. |
| 64 | WIP-EXP-10 | C38918 | [open](https://shopview.testrail.io/index.php?/cases/view/38918) | EXTERNAL-DEPENDENCY | Re-run on an organisation with 10,000+ open work orders in one tab, or once a dev can lower the cap for a test. Also re-confirm on the final build. |
| 65 | WIP-VIS-01 | C30519 | [open](https://shopview.testrail.io/index.php?/cases/view/30519) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 66 | WIP-VIS-02 | C30520 | [open](https://shopview.testrail.io/index.php?/cases/view/30520) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 67 | WIP-VIS-03 | C30521 | [open](https://shopview.testrail.io/index.php?/cases/view/30521) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 68 | WIP-VIS-04 | C30522 | [open](https://shopview.testrail.io/index.php?/cases/view/30522) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 69 | WIP-VIS-05 | C30523 | [open](https://shopview.testrail.io/index.php?/cases/view/30523) | VIU-Observed-PASS | The visible focus indicator still needs a keyboard-driven screenshot. Re-run on the final build. |
| 70 | WIP-VIS-06 | C30524 | [open](https://shopview.testrail.io/index.php?/cases/view/30524) | VIU-Observed-PASS | Confirm the tooltip actually renders on keyboard focus with a focus-driven capture. Re-run on the final build. |
| 71 | WIP-VIS-07 | C30525 | [open](https://shopview.testrail.io/index.php?/cases/view/30525) | VIU-Observed-PASS | NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode on and read the table, strip, link, Inv. Hrs colours and the two-line asset cell. |
| 72 | WIP-PERM-01 | C30526 | [open](https://shopview.testrail.io/index.php?/cases/view/30526) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 73 | WIP-PERM-02 | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | VIU-Observed-PASS | The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final build. |
| 74 | WIP-API-01 | C30528 | [open](https://shopview.testrail.io/index.php?/cases/view/30528) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 75 | WIP-API-02 | C30529 | [open](https://shopview.testrail.io/index.php?/cases/view/30529) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 76 | WIP-API-03 | C30530 | [open](https://shopview.testrail.io/index.php?/cases/view/30530) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 77 | WIP-API-04 | C30531 | [open](https://shopview.testrail.io/index.php?/cases/view/30531) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 78 | WIP-API-05 | C30532 | [open](https://shopview.testrail.io/index.php?/cases/view/30532) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 79 | WIP-API-06 | C30533 | [open](https://shopview.testrail.io/index.php?/cases/view/30533) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored WIP snapshot rows (or provide a DB/inspection route). Also re-confirm on the final build. |
| 80 | IV-NAV-01 | C30534 | [open](https://shopview.testrail.io/index.php?/cases/view/30534) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 81 | IV-NAV-02 | C30535 | [open](https://shopview.testrail.io/index.php?/cases/view/30535) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 82 | IV-NAV-03 | C30536 | [open](https://shopview.testrail.io/index.php?/cases/view/30536) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 83 | IV-NAV-05 | C30538 | [open](https://shopview.testrail.io/index.php?/cases/view/30538) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 84 | IV-NAV-06 | C30539 | [open](https://shopview.testrail.io/index.php?/cases/view/30539) | VIU-Observed-PASS | Confirm the empty-location and impossible-filter branches too. Re-run on the final build. |
| 85 | IV-SCOPE-01 | C30540 | [open](https://shopview.testrail.io/index.php?/cases/view/30540) | VIU-Observed-PASS | A true is_core part with positive stock was not located to prove the exclusion directly; the evidence is that no is_core row appears. Re-run against a seeded core-charge part on the final build. |
| 86 | IV-SCOPE-02 | C30541 | [open](https://shopview.testrail.io/index.php?/cases/view/30541) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 87 | IV-SCOPE-05 | C30544 | [open](https://shopview.testrail.io/index.php?/cases/view/30544) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 88 | IV-COL-01 | C30551 | [open](https://shopview.testrail.io/index.php?/cases/view/30551) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 89 | IV-COL-02 | C30552 | [open](https://shopview.testrail.io/index.php?/cases/view/30552) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 90 | IV-CALC-01 | C30545 | [open](https://shopview.testrail.io/index.php?/cases/view/30545) | VIU-Observed-PASS | Attribute a specific row to a known FIXED sell price (rather than a markup) with a seeded part. Re-run on the final build. |
| 91 | IV-CALC-02 | C30546 | [open](https://shopview.testrail.io/index.php?/cases/view/30546) | VIU-Observed-PASS | Attribute one row to a known matrix markup with a seeded part and a known matrix. Re-run on the final build. |
| 92 | IV-CALC-03 | C30547 | [open](https://shopview.testrail.io/index.php?/cases/view/30547) | EXTERNAL-DEPENDENCY | Re-run if the build ever permits a category-less part, or ask a developer to create one directly. Also re-confirm on the final build. |
| 93 | IV-CALC-04 | C30548 | [open](https://shopview.testrail.io/index.php?/cases/view/30548) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 94 | IV-CALC-05 | C30549 | [open](https://shopview.testrail.io/index.php?/cases/view/30549) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 95 | IV-CALC-06 | C30550 | [open](https://shopview.testrail.io/index.php?/cases/view/30550) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 96 | IV-COL-03 | C30553 | [open](https://shopview.testrail.io/index.php?/cases/view/30553) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 97 | IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 98 | IV-COL-05 | C30555 | [open](https://shopview.testrail.io/index.php?/cases/view/30555) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 99 | IV-TOT-01 | C30556 | [open](https://shopview.testrail.io/index.php?/cases/view/30556) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 100 | IV-TOT-02 | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 101 | IV-TOT-03 | C30558 | [open](https://shopview.testrail.io/index.php?/cases/view/30558) | VIU-Observed-PASS | The "—" branch (total Total Sell zero or negative) needs a filter whose whole set sums to zero sell. Re-run on the final build. |
| 102 | IV-DATE-01 | C30561 | [open](https://shopview.testrail.io/index.php?/cases/view/30561) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 103 | IV-DATE-02 | C30562 | [open](https://shopview.testrail.io/index.php?/cases/view/30562) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 104 | IV-DATE-03 | C30563 | [open](https://shopview.testrail.io/index.php?/cases/view/30563) | VIU-Observed-PASS | Attribute the live values to a quantity changed TODAY, after last night's capture, with a seeded part. Re-run on the final build. |
| 105 | IV-DATE-04 | C30564 | [open](https://shopview.testrail.io/index.php?/cases/view/30564) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 106 | IV-DATE-05 | C30565 | [open](https://shopview.testrail.io/index.php?/cases/view/30565) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 107 | IV-DATE-06 | C30566 | [open](https://shopview.testrail.io/index.php?/cases/view/30566) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 108 | IV-DATE-08 | C30568 | [open](https://shopview.testrail.io/index.php?/cases/view/30568) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 109 | IV-FLT-01 | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | VIU-Observed-PASS | The Vendor filter's server-side narrowing was not proven by API - the vendor parameter name was not established (GET /api/vendors is 404 on this build). Drive it through the UI dropdown and re-run on the final build. |
| 110 | IV-FLT-02 | C30570 | [open](https://shopview.testrail.io/index.php?/cases/view/30570) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 111 | IV-FLT-03 | C30571 | [open](https://shopview.testrail.io/index.php?/cases/view/30571) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 112 | IV-FLT-04 | C30572 | [open](https://shopview.testrail.io/index.php?/cases/view/30572) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 113 | IV-FLT-05 | C30573 | [open](https://shopview.testrail.io/index.php?/cases/view/30573) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 114 | IV-LOC-01 | C30574 | [open](https://shopview.testrail.io/index.php?/cases/view/30574) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 115 | IV-LOC-02 | C30575 | [open](https://shopview.testrail.io/index.php?/cases/view/30575) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 116 | IV-LOC-03 | C30576 | [open](https://shopview.testrail.io/index.php?/cases/view/30576) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 117 | IV-LOC-04 | C30577 | [open](https://shopview.testrail.io/index.php?/cases/view/30577) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 118 | IV-DATE-09 | C38892 | [open](https://shopview.testrail.io/index.php?/cases/view/38892) | EXTERNAL-DEPENDENCY | Re-run once history is several days deep and a developer confirms the snapshot read route. Also re-confirm on the final build. |
| 119 | IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 120 | IV-PERS-01 | C30579 | [open](https://shopview.testrail.io/index.php?/cases/view/30579) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 121 | IV-PERS-02 | C30580 | [open](https://shopview.testrail.io/index.php?/cases/view/30580) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 122 | IV-PERS-03 | C30581 | [open](https://shopview.testrail.io/index.php?/cases/view/30581) | VIU-Observed-PASS | Confirm each remembered setting individually - date range, category, vendor, search text, location, columns and sort - and that a different browser profile shows the defaults. Re-run on the final build. |
| 123 | IV-PERS-04 | C30582 | [open](https://shopview.testrail.io/index.php?/cases/view/30582) | VIU-Observed-PASS | Confirm a stale saved CATEGORY or VENDOR is specifically dropped. Re-run on the final build. |
| 124 | IV-SORT-01 | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 125 | IV-SORT-02 | C30584 | [open](https://shopview.testrail.io/index.php?/cases/view/30584) | VIU-Observed-PASS | The exact asc -> desc -> asc click cycle with no third state needs one more careful UI sequence. Re-run on the final build. |
| 126 | IV-SORT-03 | C30585 | [open](https://shopview.testrail.io/index.php?/cases/view/30585) | VIU-Observed-PASS | The case-insensitivity of the text sort was NOT established - the sampled data did not give a clean mixed-case pair. Re-run against seeded parts named "apple" and "Apple". |
| 127 | IV-SORT-04 | C30586 | [open](https://shopview.testrail.io/index.php?/cases/view/30586) | VIU-Observed-PASS | Confirm the sort is restored after leaving and returning. Re-run on the final build. |
| 128 | IV-EXP-01 | C30587 | [open](https://shopview.testrail.io/index.php?/cases/view/30587) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 129 | IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 130 | IV-EXP-03 | C30589 | [open](https://shopview.testrail.io/index.php?/cases/view/30589) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 131 | IV-EXP-04 | C30590 | [open](https://shopview.testrail.io/index.php?/cases/view/30590) | VIU-Observed-PASS | This org has no shop logo set, so the logo-present branch is not observed; and the "no snapshot available for the period" header variant was not reachable. Set a logo and re-run on the final build. |
| 132 | IV-EXP-05 | C30591 | [open](https://shopview.testrail.io/index.php?/cases/view/30591) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 133 | IV-EXP-06 | C30592 | [open](https://shopview.testrail.io/index.php?/cases/view/30592) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 134 | IV-EXP-07 | C30593 | [open](https://shopview.testrail.io/index.php?/cases/view/30593) | EXTERNAL-DEPENDENCY | Re-run on an organisation with more than 10,000 in-stock part rows, or once a developer can lower the cap for a test. Also re-confirm on the final build. |
| 135 | IV-EXP-09 | C30595 | [open](https://shopview.testrail.io/index.php?/cases/view/30595) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 136 | IV-VIS-01 | C30596 | [open](https://shopview.testrail.io/index.php?/cases/view/30596) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 137 | IV-VIS-02 | C30597 | [open](https://shopview.testrail.io/index.php?/cases/view/30597) | DEVIATION | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 138 | IV-VIS-04 | C30599 | [open](https://shopview.testrail.io/index.php?/cases/view/30599) | VIU-Observed-PASS | The ellipsis glyph and the hover-reveal of the full value need a narrowed-window capture with a deliberately over-long value. Re-run on the final build. |
| 139 | IV-VIS-05 | C30600 | [open](https://shopview.testrail.io/index.php?/cases/view/30600) | VIU-Observed-PASS | NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode on and read the background, toolbar, cells and the "—" glyph. |
| 140 | IV-VIS-06 | C30601 | [open](https://shopview.testrail.io/index.php?/cases/view/30601) | VIU-Observed-PASS | The assistive-technology half was not established - the headers did not expose an aria-sort attribute in the reads taken, so this needs an accessibility-inspector pass. Re-run on the final build. |
| 141 | IV-VIS-07 | C30602 | [open](https://shopview.testrail.io/index.php?/cases/view/30602) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 142 | IV-PERM-01 | C30603 | [open](https://shopview.testrail.io/index.php?/cases/view/30603) | VIU-Observed-PASS | Re-confirm on the final build: the observation is provisional (branch declared not final). |
| 143 | IV-PERM-02 | C30604 | [open](https://shopview.testrail.io/index.php?/cases/view/30604) | VIU-Observed-PASS | The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final build. |
| 144 | IV-API-01 | C30605 | [open](https://shopview.testrail.io/index.php?/cases/view/30605) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 145 | IV-API-02 | C30606 | [open](https://shopview.testrail.io/index.php?/cases/view/30606) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 146 | IV-API-03 | C30607 | [open](https://shopview.testrail.io/index.php?/cases/view/30607) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 147 | IV-API-04 | C30608 | [open](https://shopview.testrail.io/index.php?/cases/view/30608) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 148 | IV-API-05 | C30609 | [open](https://shopview.testrail.io/index.php?/cases/view/30609) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |
| 149 | IV-API-06 | C30610 | [open](https://shopview.testrail.io/index.php?/cases/view/30610) | EXTERNAL-DEPENDENCY | Re-run once the developers expose a read route for the stored inventory snapshot rows. History at this organisation currently starts around 2026-08-01, so the retention cases additionally need months of accrued history or dev-seeded dates. Also re-confirm on the final build. |

## PRIORITY RE-CHECKS (do these first when the build settles)

These are the rows most likely to FLIP, because they are the ones where the build and a written
source disagree today:

| Internal ID | C-id | Link | The question to answer |
|---|---|---|---|
| WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | Is the Location column still a manual toggle, or has the automatic behaviour the spec requires been built? |
| WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | Same question, from the location-scope side. |
| IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | Same question on Inventory Value, where the column is ON by default and does not auto-hide. |
| IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | Are Margin and Total Sell hidden by default yet? |
| IV-DATE-02 | C30562 | [open](https://shopview.testrail.io/index.php?/cases/view/30562) | Is the as-of date still resolving ONE DAY LATE than the end of the selected range? |
| IV-DATE-04 | C30564 | [open](https://shopview.testrail.io/index.php?/cases/view/30564) | Same off-by-one, from the history-replay side. |
| IV-EXP-09 | C30595 | [open](https://shopview.testrail.io/index.php?/cases/view/30595) | Does the large PDF still time out at ~30 s with a raw 500? |
| IV-EXP-03 | C30589 | [open](https://shopview.testrail.io/index.php?/cases/view/30589) | Does the CSV still write money with a dollar sign and thousands separators? |
| IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | Does the export still ignore the column selection and re-order the columns? |
| IV-NAV-05 | C30538 | [open](https://shopview.testrail.io/index.php?/cases/view/30538) | Has a pagination control appeared? |
| WIP-SUM-05 | C30491 | [open](https://shopview.testrail.io/index.php?/cases/view/30491) | Does the Estimates figure still read $0.00 instead of the quoted value? |
| WIP-FLT-04 | C30501 | [open](https://shopview.testrail.io/index.php?/cases/view/30501) | Has the date control gained Today / Yesterday / Custom? |
| IV-NAV-03 | C30536 | [open](https://shopview.testrail.io/index.php?/cases/view/30536) | Does a fresh visit default to the active location yet, or still to All locations? |
| IV-LOC-04 | C30577 | [open](https://shopview.testrail.io/index.php?/cases/view/30577) | Is the Location filter hidden for a one-location user yet? |
| WIP-COL-05 | C30470 | [open](https://shopview.testrail.io/index.php?/cases/view/30470) | Does the Asset cell lead with the VIN yet? |

## THE UNDRIVEN BRANCHES (not verdict flips — coverage still owed)

Each of these is a PASS whose observation covered only part of a multi-branch assertion. They are
listed so the shortfall is visible rather than buried in a row:

- **WIP-SCOPE-01 / WIP-PLACE-01 = C30456 / C30462** — no work order in **In progress** status existed in the data; the status DOES exist in the build enum
- **WIP-COL-07 = C30472** — the "0 days" and "1 days" endpoints specifically
- **WIP-COL-08 = C30473** — the "Today" and "—" branches of Last Activity
- **WIP-CALC-02..05 = C30475–C30478** — per-line attribution against a purpose-seeded quote / clocked time / received quantity, and the core-charge half
- **WIP-CALC-08 = C30481** — the green / red / zero colouring of Inv. Hrs on screen
- **WIP-CALC-10 = C38890** — the running-clock behaviour with a technician clocked in
- **WIP-VIS-07 / IV-VIS-05 = C30525 / C30600** — **dark mode was not driven at all this run**
- **WIP-EXP-08 / IV-EXP-04 = C30517 / C30590** — the logo-present branch — this org has no shop logo set
- **WIP-PERM-02 / IV-PERM-02 = C30527 / C30604** — the navigation-absence half, as the unpermitted user in the UI
- **IV-SORT-03 = C30585** — case-insensitivity of the text sort
- **IV-VIS-06 = C30601** — the assistive-technology sort state (no aria-sort was seen)
- **IV-SCOPE-01 = C30540** — a true is_core part with positive stock, to prove the exclusion directly

## THE BLOCKED ROWS (cannot be re-checked by QA alone)

- **12 nightly-snapshot cases** (WIP-API-01..06 = C30528–C30533, IV-API-01..06 = C30605–C30610)
  need a **developer read route** into the stored snapshot tables. There is none on this build and
  probes for one return 404.
- **IV-API-05 / IV-API-06 = C30609 / C30610** additionally need **months of accrued history** —
  retained history at this org starts around **2026-08-01**, a couple of days deep.
- **IV-DATE-09 = C38892** needs both of the above plus a category/vendor rename, which would
  mutate shared org data other testers rely on.
- **WIP-EXP-10 = C38918 / IV-EXP-07 = C30593** need **more data than this organisation holds** —
  the widest WIP tab is 114 work orders and the widest IV view is 9,275 rows, both far under the
  10,000-row cap.
- **IV-CALC-03 = C30547 / IV-COL-05 = C30555 (Category half)** need a part with **no category**,
  which the build refuses to create (`category_id` is a required parameter).

