# RE-CHECK ROWS — Parts Velocity + Technician Utilization (2026-08-03/04)

> **STATUS: OPEN.** These rows belong in the master `../RECHECK-QUEUE.md`. **Do not merge them
> yourself if another worker is editing that file** — hand this file to the coordinator.
>
> **CHECK THIS AT EVERY SESSION START** for the Report Suite, before and after any work on it,
> and **immediately** when the branch is declared final or the app-version marker changes
> (`curl -s https://sv8582.qa.shopview.com/ | grep app-version`).
>
> **NEITHER REPORT MAY BE CALLED VIU-COMPLETE WHILE THIS QUEUE IS OPEN** (Standing Rule 49).

## BUILD MARKER (the thing that makes a re-check meaningful)

| Marker | Value at run START | Value at run END |
|---|---|---|
| App version | **v3.4.1-0ed4433** | **v3.4.1-0ed4433** |
| `index.html` last-modified | Mon, 03 Aug 2026 13:40:38 GMT | Mon, 03 Aug 2026 13:40:38 GMT |
| `index.html` etag | 02091e9dc11f187d7739b4efa166ea21 | 02091e9dc11f187d7739b4efa166ea21 |
| Observed (UTC) | 2026-08-04 ~00:50 | 2026-08-04 ~02:16 |

**The build did NOT change during the run**, so every observation in this batch belongs to one
single build state.

## SCOPE

**131 rows — every case in this batch is queued**, because every verdict was taken from a
non-final build: Parts Velocity 71 + Technician Utilization 60. Breakdown: 95 PASS, 32 DEVIATION, 4 EXTERNAL-DEPENDENCY.

**Priority order for the re-run** (highest value first):

1. The **4 EXTERNAL-DEPENDENCY** rows — they are blocked on environment configuration, so they
   are the rows most likely to become answerable. TU-ELL-04, TU-ELL-05, TU-SORT-05, PV-PREC-02.
2. The **32 DEVIATION** rows — each will either be FIXED (flip to PASS and report the fix) or
   CONFIRMED (escalate as a defect or a PO question). **A row that flips is a finding in its own
   right and must be reported, not quietly corrected.**
3. The **11 PASS rows that carry a stated narrower limit** (listed below) — these have a specific
   thing left to drive.
4. The remaining PASS rows — re-confirm.

## THE 11 PASS ROWS WITH A SPECIFIC OUTSTANDING SUB-CHECK

| Case | C-id | What is still owed |
|---|---|---|
| PV-FILT-04 | [C30331](https://shopview.testrail.io/index.php?/cases/view/30331) | Re-drive the over-cap span from the calendar UI once the branch is final, to confirm the on-screen rejection wording. |
| PV-FILT-12 | [C30339](https://shopview.testrail.io/index.php?/cases/view/30339) | Re-check the no-category third once a part with a genuinely unassigned category exists. |
| PV-COL-06 | [C30356](https://shopview.testrail.io/index.php?/cases/view/30356) | Re-drive with two real sign-ins in one browser profile once the branch is final. |
| PV-CALC-03 | [C30361](https://shopview.testrail.io/index.php?/cases/view/30361) | Cross-read the return records once a returns endpoint or the Returns screen is drivable. |
| PV-CALC-04 | [C30362](https://shopview.testrail.io/index.php?/cases/view/30362) | Seed a return whose initiation date falls in a different window from its sale and re-check. |
| PV-CALC-11 | [C30369](https://shopview.testrail.io/index.php?/cases/view/30369) | Reverse a known invoice and re-measure the same part once an invoice endpoint or screen is drivable. |
| PV-CALC-12 | [C30370](https://shopview.testrail.io/index.php?/cases/view/30370) | Seed a revenue-with-zero-billed-quantity adjustment to exercise the mirror case. |
| PV-PREC-01 | [C38924](https://shopview.testrail.io/index.php?/cases/view/38924) | Seed a fractional-quantity part line, invoice it, and re-check Units Sold specifically. |
| TU-NAV-04 | [C30395](https://shopview.testrail.io/index.php?/cases/view/30395) | Re-drive the over-cap span from the calendar UI once the branch is final. |
| TU-ELL-03 | [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | Re-check the explicit $0.00-rate variant once the branch is final. |
| TU-SUM-04 | [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | Re-check the all-em-dash Summary clause once a location with no default labor rate exists. |
| TU-LINK-03 | [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | Re-reconcile a high-volume technician once the branch is final. |
| TU-EXP-06 | [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | Re-check the bundled-default fallback on an organisation with no uploaded logo. |

## FULL QUEUE (131 rows)

| Internal ID | C-id | Link | Verdict this run | Observed on | Re-check obligation |
|---|---|---|---|---|---|
| PV-NAV-01 | C30322 | [open](https://shopview.testrail.io/index.php?/cases/view/30322) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-NAV-02 | C30323 | [open](https://shopview.testrail.io/index.php?/cases/view/30323) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-NAV-03 | C30324 | [open](https://shopview.testrail.io/index.php?/cases/view/30324) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-01 | C30325 | [open](https://shopview.testrail.io/index.php?/cases/view/30325) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-02 | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PERM-03 | C30327 | [open](https://shopview.testrail.io/index.php?/cases/view/30327) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-01 | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-03 | C30330 | [open](https://shopview.testrail.io/index.php?/cases/view/30330) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-04 | C30331 | [open](https://shopview.testrail.io/index.php?/cases/view/30331) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive the over-cap span from the calendar UI once the branch is final, to confirm the on-screen rejection wording. |
| PV-FILT-05 | C30332 | [open](https://shopview.testrail.io/index.php?/cases/view/30332) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-06 | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-07 | C30334 | [open](https://shopview.testrail.io/index.php?/cases/view/30334) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-08 | C30335 | [open](https://shopview.testrail.io/index.php?/cases/view/30335) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-09 | C30336 | [open](https://shopview.testrail.io/index.php?/cases/view/30336) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-10 | C30337 | [open](https://shopview.testrail.io/index.php?/cases/view/30337) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-11 | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-12 | C30339 | [open](https://shopview.testrail.io/index.php?/cases/view/30339) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the no-category third once a part with a genuinely unassigned category exists. |
| PV-FILT-13 | C30340 | [open](https://shopview.testrail.io/index.php?/cases/view/30340) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-FILT-14 | C38914 | [open](https://shopview.testrail.io/index.php?/cases/view/38914) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-01 | C30341 | [open](https://shopview.testrail.io/index.php?/cases/view/30341) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-02 | C30342 | [open](https://shopview.testrail.io/index.php?/cases/view/30342) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-03 | C30343 | [open](https://shopview.testrail.io/index.php?/cases/view/30343) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-04 | C30344 | [open](https://shopview.testrail.io/index.php?/cases/view/30344) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-05 | C30345 | [open](https://shopview.testrail.io/index.php?/cases/view/30345) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-06 | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-07 | C30347 | [open](https://shopview.testrail.io/index.php?/cases/view/30347) | DEVIATION | v3.4.1-0ed4433 | Re-measure at a narrow viewport once the branch is final. |
| PV-ROW-08 | C30348 | [open](https://shopview.testrail.io/index.php?/cases/view/30348) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-09 | C30349 | [open](https://shopview.testrail.io/index.php?/cases/view/30349) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-ROW-10 | C30350 | [open](https://shopview.testrail.io/index.php?/cases/view/30350) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-01 | C30351 | [open](https://shopview.testrail.io/index.php?/cases/view/30351) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-02 | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-03 | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-04 | C30354 | [open](https://shopview.testrail.io/index.php?/cases/view/30354) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-05 | C30355 | [open](https://shopview.testrail.io/index.php?/cases/view/30355) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-COL-06 | C30356 | [open](https://shopview.testrail.io/index.php?/cases/view/30356) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive with two real sign-ins in one browser profile once the branch is final. |
| PV-COL-08 | C30358 | [open](https://shopview.testrail.io/index.php?/cases/view/30358) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-01 | C30359 | [open](https://shopview.testrail.io/index.php?/cases/view/30359) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-02 | C30360 | [open](https://shopview.testrail.io/index.php?/cases/view/30360) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-03 | C30361 | [open](https://shopview.testrail.io/index.php?/cases/view/30361) | VIU-Observed-PASS | v3.4.1-0ed4433 | Cross-read the return records once a returns endpoint or the Returns screen is drivable. |
| PV-CALC-04 | C30362 | [open](https://shopview.testrail.io/index.php?/cases/view/30362) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a return whose initiation date falls in a different window from its sale and re-check. |
| PV-CALC-05 | C30363 | [open](https://shopview.testrail.io/index.php?/cases/view/30363) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-06 | C30364 | [open](https://shopview.testrail.io/index.php?/cases/view/30364) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-07 | C30365 | [open](https://shopview.testrail.io/index.php?/cases/view/30365) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-08 | C30366 | [open](https://shopview.testrail.io/index.php?/cases/view/30366) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-09 | C30367 | [open](https://shopview.testrail.io/index.php?/cases/view/30367) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-10 | C30368 | [open](https://shopview.testrail.io/index.php?/cases/view/30368) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-11 | C30369 | [open](https://shopview.testrail.io/index.php?/cases/view/30369) | VIU-Observed-PASS | v3.4.1-0ed4433 | Reverse a known invoice and re-measure the same part once an invoice endpoint or screen is drivable. |
| PV-CALC-12 | C30370 | [open](https://shopview.testrail.io/index.php?/cases/view/30370) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a revenue-with-zero-billed-quantity adjustment to exercise the mirror case. |
| PV-CALC-13 | C30371 | [open](https://shopview.testrail.io/index.php?/cases/view/30371) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-14 | C30372 | [open](https://shopview.testrail.io/index.php?/cases/view/30372) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-15 | C30373 | [open](https://shopview.testrail.io/index.php?/cases/view/30373) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-CALC-16 | C30374 | [open](https://shopview.testrail.io/index.php?/cases/view/30374) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PREC-01 | C38924 | [open](https://shopview.testrail.io/index.php?/cases/view/38924) | VIU-Observed-PASS | v3.4.1-0ed4433 | Seed a fractional-quantity part line, invoice it, and re-check Units Sold specifically. |
| PV-EXP-01 | C30375 | [open](https://shopview.testrail.io/index.php?/cases/view/30375) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-02 | C30376 | [open](https://shopview.testrail.io/index.php?/cases/view/30376) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-03 | C30377 | [open](https://shopview.testrail.io/index.php?/cases/view/30377) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-04 | C30378 | [open](https://shopview.testrail.io/index.php?/cases/view/30378) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-05 | C30379 | [open](https://shopview.testrail.io/index.php?/cases/view/30379) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-06 | C30380 | [open](https://shopview.testrail.io/index.php?/cases/view/30380) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-07 | C30381 | [open](https://shopview.testrail.io/index.php?/cases/view/30381) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-08 | C30382 | [open](https://shopview.testrail.io/index.php?/cases/view/30382) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-10 | C30384 | [open](https://shopview.testrail.io/index.php?/cases/view/30384) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-EXP-11 | C38885 | [open](https://shopview.testrail.io/index.php?/cases/view/38885) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-01 | C30385 | [open](https://shopview.testrail.io/index.php?/cases/view/30385) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-02 | C30386 | [open](https://shopview.testrail.io/index.php?/cases/view/30386) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-VIS-03 | C30387 | [open](https://shopview.testrail.io/index.php?/cases/view/30387) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-01 | C30388 | [open](https://shopview.testrail.io/index.php?/cases/view/30388) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-02 | C30389 | [open](https://shopview.testrail.io/index.php?/cases/view/30389) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-03 | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-API-04 | C30391 | [open](https://shopview.testrail.io/index.php?/cases/view/30391) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| PV-PREC-02 | C38925 | [open](https://shopview.testrail.io/index.php?/cases/view/38925) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once a QuickBooks-connected company is available on the QA branch. |
| TU-NAV-01 | C30392 | [open](https://shopview.testrail.io/index.php?/cases/view/30392) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-02 | C30393 | [open](https://shopview.testrail.io/index.php?/cases/view/30393) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-03 | C30394 | [open](https://shopview.testrail.io/index.php?/cases/view/30394) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-04 | C30395 | [open](https://shopview.testrail.io/index.php?/cases/view/30395) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-drive the over-cap span from the calendar UI once the branch is final. |
| TU-NAV-05 | C30396 | [open](https://shopview.testrail.io/index.php?/cases/view/30396) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-06 | C30397 | [open](https://shopview.testrail.io/index.php?/cases/view/30397) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-07 | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-NAV-08 | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-02 | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-03 | C30402 | [open](https://shopview.testrail.io/index.php?/cases/view/30402) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-HRS-04 | C30403 | [open](https://shopview.testrail.io/index.php?/cases/view/30403) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-01 | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-02 | C30405 | [open](https://shopview.testrail.io/index.php?/cases/view/30405) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-ELL-03 | C30406 | [open](https://shopview.testrail.io/index.php?/cases/view/30406) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the explicit $0.00-rate variant once the branch is final. |
| TU-ELL-04 | C30407 | [open](https://shopview.testrail.io/index.php?/cases/view/30407) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once an administrator provides a location with no default labor rate, or once the default can be cleared. |
| TU-ELL-05 | C30408 | [open](https://shopview.testrail.io/index.php?/cases/view/30408) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run once a location with no default labor rate exists. |
| TU-SORT-01 | C30409 | [open](https://shopview.testrail.io/index.php?/cases/view/30409) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-02 | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-03 | C30411 | [open](https://shopview.testrail.io/index.php?/cases/view/30411) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-04 | C30412 | [open](https://shopview.testrail.io/index.php?/cases/view/30412) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SORT-05 | C30413 | [open](https://shopview.testrail.io/index.php?/cases/view/30413) | EXTERNAL-DEPENDENCY | v3.4.1-0ed4433 | Re-run the both-directions em-dash sort once a location with no default labor rate exists. |
| TU-SUM-01 | C30414 | [open](https://shopview.testrail.io/index.php?/cases/view/30414) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-02 | C30415 | [open](https://shopview.testrail.io/index.php?/cases/view/30415) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-03 | C30416 | [open](https://shopview.testrail.io/index.php?/cases/view/30416) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-SUM-04 | C30417 | [open](https://shopview.testrail.io/index.php?/cases/view/30417) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the all-em-dash Summary clause once a location with no default labor rate exists. |
| TU-DAY-01 | C30418 | [open](https://shopview.testrail.io/index.php?/cases/view/30418) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-02 | C30419 | [open](https://shopview.testrail.io/index.php?/cases/view/30419) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-03 | C30420 | [open](https://shopview.testrail.io/index.php?/cases/view/30420) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-04 | C30421 | [open](https://shopview.testrail.io/index.php?/cases/view/30421) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-DAY-05 | C30422 | [open](https://shopview.testrail.io/index.php?/cases/view/30422) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-01 | C30423 | [open](https://shopview.testrail.io/index.php?/cases/view/30423) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-02 | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-03 | C30425 | [open](https://shopview.testrail.io/index.php?/cases/view/30425) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-TECH-04 | C30426 | [open](https://shopview.testrail.io/index.php?/cases/view/30426) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-01 | C30428 | [open](https://shopview.testrail.io/index.php?/cases/view/30428) | DEVIATION | v3.4.1-0ed4433 | Drive Enter-key activation and re-check the at-rest affordance once the branch is final. |
| TU-LINK-02 | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-03 | C30430 | [open](https://shopview.testrail.io/index.php?/cases/view/30430) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-reconcile a high-volume technician once the branch is final. |
| TU-LINK-04 | C30431 | [open](https://shopview.testrail.io/index.php?/cases/view/30431) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-05 | C30432 | [open](https://shopview.testrail.io/index.php?/cases/view/30432) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LINK-06 | C30433 | [open](https://shopview.testrail.io/index.php?/cases/view/30433) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-01 | C30434 | [open](https://shopview.testrail.io/index.php?/cases/view/30434) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-02 | C30435 | [open](https://shopview.testrail.io/index.php?/cases/view/30435) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-03 | C30436 | [open](https://shopview.testrail.io/index.php?/cases/view/30436) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-04 | C30437 | [open](https://shopview.testrail.io/index.php?/cases/view/30437) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-05 | C30438 | [open](https://shopview.testrail.io/index.php?/cases/view/30438) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-06 | C30439 | [open](https://shopview.testrail.io/index.php?/cases/view/30439) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-check the bundled-default fallback on an organisation with no uploaded logo. |
| TU-EXP-07 | C30440 | [open](https://shopview.testrail.io/index.php?/cases/view/30440) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-EXP-08 | C30441 | [open](https://shopview.testrail.io/index.php?/cases/view/30441) | DEVIATION | v3.4.1-0ed4433 | Provoke a genuine TU download failure once the branch is final, to read the failure toast. |
| TU-EXP-09 | C38887 | [open](https://shopview.testrail.io/index.php?/cases/view/38887) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-01 | C30442 | [open](https://shopview.testrail.io/index.php?/cases/view/30442) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-02 | C30443 | [open](https://shopview.testrail.io/index.php?/cases/view/30443) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-03 | C30444 | [open](https://shopview.testrail.io/index.php?/cases/view/30444) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-04 | C30445 | [open](https://shopview.testrail.io/index.php?/cases/view/30445) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-05 | C30446 | [open](https://shopview.testrail.io/index.php?/cases/view/30446) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-LOC-06 | C38915 | [open](https://shopview.testrail.io/index.php?/cases/view/38915) | DEVIATION | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-VIS-01 | C30447 | [open](https://shopview.testrail.io/index.php?/cases/view/30447) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-VIS-02 | C30448 | [open](https://shopview.testrail.io/index.php?/cases/view/30448) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-COL-01 | C38859 | [open](https://shopview.testrail.io/index.php?/cases/view/38859) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-API-01 | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |
| TU-API-02 | C30450 | [open](https://shopview.testrail.io/index.php?/cases/view/30450) | VIU-Observed-PASS | v3.4.1-0ed4433 | Re-run this observation when the branch is declared final or the app-version marker changes. |

## HOW TO RE-RUN (nothing needs re-deriving)

All the drivers are in `tools/` and are secret-free — they read credentials from
`/tmp/report-suite-viu/cookies.json` at runtime. Run node with `NODE_USE_ENV_PROXY=1`.

| Purpose | Command |
|---|---|
| Re-read the build marker | `curl -s https://sv8582.qa.shopview.com/ \| grep app-version` |
| Any single export, with a timeout and a request-id capture | `node tools/dl.mjs <slug> <name> "<query string>" 120000` |
| PV UI sweeps | `node tools/pv_ui.mjs`, `pv_ui2.mjs`, `pv_ui3.mjs`, `pv_ui4.mjs` |
| PV calculation contract from live payloads | `node tools/pv_calc.mjs`, `pv_extra.mjs`, `last_gaps.mjs` |
| Core exclusion | `node tools/core_check3.mjs`, `core_final.mjs` (re-seed with `seed_core*.mjs` if needed) |
| TU UI sweeps | `node tools/tu_ui1.mjs`, `tu_ui2.mjs`, `tu_ui3.mjs`, `tu_coltoggle.mjs` |
| TU clock seeding (This-Month data, the "Multiple" row, an open clock) | `node tools/tu_seed2.mjs`, then clean up with `cleanup.mjs` + `cleanup2.mjs` |
| Permission matrix, single-location subject | `node tools/perms.mjs`, `perms2.mjs`, `singleloc2.mjs` |
| First-visit defaults, deep links, visual, dark mode | `node tools/final_ui.mjs` |
| The em-dash Est. Lost Labor blocker | `node tools/unrated.mjs` (safe — it restores itself and, on this build, the flip does not even persist) |
| Rebuild these deliverables | `python3 tools/gen_verdicts.py && python3 tools/gen_docs.py && python3 tools/gen_recheck.py` |
| PDF text extraction | `pdftotext -layout <file>.pdf <file>.txt` (poppler-utils; `pdfinfo` for page size, `pdfimages -list` for an embedded logo) |

## POST-RE-RUN CHECKLIST

1. Re-capture the build marker first and write it beside the old one.
2. Work the priority order above; flip each row to **CONFIRMED** or **CHANGED** with fresh evidence.
3. Report every **CHANGED** row explicitly — it is a finding.
4. Close the queue only when **100% of the 131 rows** are re-verified (no sampling).
5. Update `VERDICTS.md`, `verdicts.csv` and `STAGED-CHANGES.md` in the same pass, and update the
   cross-project outstanding register.
