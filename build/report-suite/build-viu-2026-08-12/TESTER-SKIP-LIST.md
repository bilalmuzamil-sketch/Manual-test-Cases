# TESTER SKIP LIST — do not spend release-morning hours on these

**Report Suite · run 359 · build `v3.6-8c28eed` · 12 August 2026**

**42 of our 480 cases carry `AUTOMATION: HOLD`.** A `HOLD` means the case **cannot be run and settled today** — the expected behaviour has no product source yet, or the state it needs cannot be produced on this environment, or it needs a second login we do not have.

🔴 **THESE MUST NOT BE GRADED `Passed`.** A sibling worker found that testers do grade `HOLD` cases as Passed, which turns *"nobody could check this"* into *"this was checked and it is fine"* — the most expensive kind of wrong entry in a release run. **If you open one of these, mark it `Blocked` and move on** (the standing Blocked-revisit loop will pick it up).

**The other 438 are runnable** — 338 expected to pass, 100 expected to fail against a known reported problem, and each of those 100 tells you on the case itself what the failure should look like and what to do if it looks different.

---

## A. Waiting on an answer from Chris Ward — the expected behaviour is not settled — 6 cases

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | Sales By Customer Report | Opening an invoice you lack permission for shows access-denied; back works | waiting on one answer from the product owner about whether this person is given a link at all |
| [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | Sales By Representative Report | Sales Representative selector shows on WO and Part Sale, not on imported | waiting on an answer from the product owner |
| [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | Sales By Representative Report | Customer record shows a "Sales Representative" row; "Unassigned" when none | waiting on an answer from the product owner |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Work In Progress | Each qualifying work order appears exactly once in exactly one tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Work In Progress | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Work In Progress | Approved started-boundary: time or part received vs neither decides the tab | the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |

## B. Needs a SECOND SIGN-IN — there is one shared login on this environment — 7 cases

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Technician Utilization | Without reports access Technician Utilization is hidden | needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization | Technician Utilization: Location filter hidden for a one-location user | needs a second sign-in as a user who can reach only one location, and there is one shared sign-in on this environment |
| [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | Inventory Value | Inventory Value: the Location filter is hidden for a one-location user | needs a second sign-in as a user with access to only one location |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | Inventory Value | A user with ordinary reports access can open Inventory Value | needs a second sign-in as a user holding only the ordinary reports access |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | Inventory Value | Without reports access Inventory Value is absent from the navigation | needs a second sign-in as a user with no reports access |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | Sales By Customer Report | You cannot reach an invoice you have no permission to open | waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales |
| [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | Sales By Representative Report | Invoice # and customer name when you cannot open what they point at | waiting on one answer from the product owner about what these two values should look like, and it needs a second sign-in that cannot open work orders, part sales or customers |

## C. Depends on a background/server job the product never shows — 9 cases

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | Work In Progress | Nightly snapshot records one row per then-open job per calendar date | the nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | Work In Progress | Captured Earned and Remaining use the same maths as the on-screen report | the nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Work In Progress | Nightly snapshot spans every location with no user location filter | the nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Work In Progress | Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped | the nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Inventory Value | Nightly snapshot records one row per in-stock non-core part per location | the nightly capture is a server-side job and its stored rows are not reachable from the application |
| [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | Inventory Value | A recorded snapshot day equals what the live report showed that day | needs the stored nightly capture rows, which are not reachable from the application |
| [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Inventory Value | Nightly snapshot: re-running the capture for a date replaces that date's rows | the nightly capture job cannot be re-run or inspected from the application |
| [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | Inventory Value | Snapshot retention: daily captures are kept for 0–13 months | retention pruning is a server-side job over stored history, not reachable from the application |
| [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Inventory Value | Thinned history still served by the closest-recorded-day rule | needs a thinned history that this organisation does not have and cannot be produced from the application |

## D. The data state does not exist on this environment and cannot be made — 17 cases

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | Sales By Customer Report | A service (S) invoice with no vehicle also lands in the Parts Sales bucket | this organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | Sales By Customer Report | Reversed and voided invoices are excluded from every row; count and total | this organisation has no reversed or voided invoice inside the report date range |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Sales By Customer Report | Duplicate asset labels get stable (#1)/(#2) suffixes that survive reloads | no customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | Sales By Customer Report | An invoice deleted after load shows the not-found state and back returns | deleting a real invoice while the report is open is not something to do on a shared environment |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | Sales By Customer Report | A failed data fetch shows the error toast which fades after 5 seconds | a failing data fetch cannot be forced from the application |
| [C30372](https://shopview.testrail.io/index.php?/cases/view/30372) | Parts Velocity Report | Core parts are excluded from both the inventory and special-order result sets | no part in this organisation carries the core flag, so core exclusion cannot be exercised |
| [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | Technician Utilization | Internal hours with no default labor rate anywhere show an em-dash | no location on this environment is set up without a default labor rate, so the em-dash state cannot be produced |
| [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | Technician Utilization | Internal hours split across rated and unrated locations show a part value | no location on this environment is set up without a default labor rate, so a part-valued row cannot be produced |
| [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | Technician Utilization | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0 | no technician on this environment has an em-dash in Est. Lost Labor, because both locations have a default labor rate |
| [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | Technician Utilization | Reconcile exception (a): an open clock is snapshotted at each load instant | needs a technician clocked in at the moment of the test, and no technician on this environment is currently clocked in |
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | Work In Progress | First visit shows the default columns; the rest are in the column selector | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C30547](https://shopview.testrail.io/index.php?/cases/view/30547) | Inventory Value | With no fixed sell price and no category, Unit Sell equals Unit Cost | a part cannot be saved without a category on this build, so the no-category path cannot be produced |
| [C38892](https://shopview.testrail.io/index.php?/cases/view/38892) | Inventory Value | A recorded day keeps its category and vendor names after a rename or delete | needs a recorded earlier day plus the stored capture rows, which are not reachable from the application |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Sales By Customer Report | Location column: shown to any multi-location user, Multiple on aggregating rows | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | Work In Progress | An over-cap Work In Progress download is refused with the too-large message | the over-size refusal cannot be produced on this environment; no tab comes near the size limit |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | Work In Progress | A hand-made Location column choice is remembered like any other column | the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | Sales By Customer Report | A logo that is set but will not load falls back to the ShopView logo | this organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced |

## E. The feature is not built in this version — 1 case

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | Sales By Representative Report | Selector offers only reps whose sales-representative toggle is on | this part of the report is not built yet |

## F. Could not be driven from our tooling (a human may still manage it) — 2 cases

| Case | Report | Title | Why it cannot be run |
|---|---|---|---|
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | Sales By Customer Report | Building a custom range on the calendar cannot exceed a 366-day span | the calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen |
| [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | Sales By Representative Report | A Custom range uses the date-picker and holds a 366-day maximum span | needs the calendar driven past a 366-day span, which this harness could not do |

---

## Per report, so you can see it before you start a section

| Report | ours | runnable | on HOLD |
|---|---:|---:|---:|
| Inventory Value | 68 | **58** | 10 |
| Parts Velocity Report | 71 | **70** | 1 |
| Sales By Customer Report | 88 | **78** | 10 |
| Sales By Representative Report | 112 | **107** | 5 |
| Technician Utilization | 60 | **54** | 6 |
| Work In Progress | 81 | **71** | 10 |
| **Total** | **480** | **438** | **42** |

The arithmetic closes both ways: **338 `READY` + 100 `READY - EXPECT FAIL` = 438 = 480 − 42 `HOLD`.**
