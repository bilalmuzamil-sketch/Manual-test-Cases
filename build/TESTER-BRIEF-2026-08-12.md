# What to test, and what to leave alone — 12 August 2026

**For the manual test team. Release is tomorrow.**

---

## Read this first

**If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.**

This is not a formality. Checked in TestRail this morning, across the three test runs, **19 of the tests on the skip lists below already have a result recorded against them, and 16 of those say Passed.** A test that could not be run cannot have passed, so each of those results has to be cleared up before it is read as evidence that the feature works.

Every test in the skip lists carries its reason in its own words, at the bottom of its Expected Results. If you open a test and it tells you it is waiting on something, that is the case — mark it **Blocked** and move on.

**The other thing worth knowing.** Some tests say, in plain words, *what you should see today* and that it is a known problem with a ticket already raised. Those you **do** run:

- See exactly what the test describes → mark it **Failed** and raise nothing new.
- See something **different** → that is a **new** problem. Please report it.
- It **passes** → the fix has shipped. Tell the QA lead so the ticket can be closed.

---

## The short version

| Project | Tests to run | Tests to skip | Where the run is |
|---|---|---|---|
| Filters | **97** | 18 | TestRail run 352 — *Filters - Ahtasham (Awaiting QA- ENV)* |
| Schedule | **145** | 31 | TestRail run 357 — *Schedule - Ayesha (VIU Pending)* |
| Report Suite | **438** | 42 | TestRail run 359 — *Reports Suite - Nebojsa/Viktoria (VIU Pending)* |
| **All three** | **680** | **91** | |

**680 tests to run, 91 to skip, 771 in total.**

---

# Filters

**Run 352. 115 tests belong to us. Run 97 of them. Skip the 18 listed below.**

*(5 further tests in this area were written by a colleague and are not part of this list or these counts.)*

**⚠️ 4 of the 18 tests below are already marked Passed in this run.** A test that could not be run cannot have passed.

## Skip these

| Test | What it is | Why it cannot be run yet |
|---|---|---|
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear Selection | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters support multiple choices and can be cleared | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new filter bar | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Transaction Type, etc.) | Waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do |
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | The filter bar still shows the other four chips on the Estimates tab | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | Estimates tab: Status chip is greyed out and pre-filled; other four work | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | Completed tab: Status chip is greyed out and pre-filled; other four work | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | A Status choice is kept while you switch tabs and comes back on the All tab | Waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification |
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | Held for the QA lead's ruling only - the behaviour IS documented (S10-R4 says each Parts view and each Report tab keeps its own separate filter set and each persists independently), so the earlier reason that no source described it was wrong |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters saved before the redesign carry over after the update | Cannot be run - it needs an account whose filters were saved before the redesign, and none exists |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Every list page keeps its own search box (Parts, Reports, detail tabs) | Cannot be run yet - its own precondition needs the page-search rollout finished everywhere, and it is still part-way through |
| [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | Each Report tab and each Parts view keeps its own separate search | Only half of it can be run - the report pages have no page search box yet, so the report-tab half cannot be tested |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filters collapse, share and work on a phone as Work Orders do | The new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Date range filter offers ready-made periods and a custom start/end range | Waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states the periods it must offer |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change covers | Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons each report should show |

---

# Schedule

**Run 357. 176 tests belong to us. Run 145 of them. Skip the 31 listed below.**

**⚠️ 14 of the 31 tests below already have a result recorded against them, 11 of them Passed.** A test that could not be run cannot have passed. **3 of those are not the tester's doing** — C30004, C30013, C30020 were moved onto the skip list today, after the result was recorded.

## Skip these

| Test | What it is | Why it cannot be run yet |
|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Panel button sits left of Today and its tooltip names what it will do | The panel button does not exist in this build |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Panel button hides the left panel and the grid widens into the space | The panel button does not exist in this build |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | What you had set up in the left panel survives hiding and showing it | The panel button does not exist in this build |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | On a narrow window the panel button still works and your choice holds | The panel button does not exist in this build |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Menus and pop-up windows reposition when the left panel is hidden | The panel button does not exist in this build |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Hiding the panel lasts for the rest of your sign-in but is not saved | The panel button does not exist in this build |
| [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | Confirming the spread creates a linked series of daily shifts | An observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker |
| [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | Dragging a shift sideways moves its start time in 15-minute steps | An observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker |
| [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | Notes can be added, edited, and deleted per work order from the modal | An observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker |
| [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | Events can be dragged to another technician or another day | An observed fault on this case has no ticket number yet, so it cannot carry an expect-fail marker |
| [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | Schedule without Work Orders: View - the sidebar hides the work order list | Needs a second sign-in as a user who cannot see work orders |
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | With Work Orders: View OFF, work order details on shifts are hidden | Needs a second sign-in as a user who cannot see work orders |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API - No pricing fields in Schedule responses; WO details need Work Orders View | Needs a second sign-in as a user who cannot see work orders |
| [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | Spread uses the tech's working hours; skips weekends only when hours not set | Waiting on the product owner's answer, and the question has not been sent yet |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Month view: dragging a work order onto a day creates a shift for that day | Waiting on the product owner's answer, and the question has not been sent yet |
| [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | Schedule: View grants the full read-only experience across the whole page | Needs a second sign-in as a view-only user |
| [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | View-only: every editing affordance is hidden or disabled | Needs a second sign-in as a view-only user |
| [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | Schedule: Edit unlocks all creation and modification interactions | Needs a second sign-in as an edit-without-delete user |
| [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | Edit without Delete: the user can create and modify but not remove | Needs a second sign-in as an edit-without-delete user |
| [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | 'My Shifts' filters the grid to only the current user's shifts | Needs a second sign-in as a user with no staff record of their own |
| [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | Needs a second sign-in as a user without the Schedule permission |
| [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | Schedule: Delete unlocks deleting shifts and events | Needs a second sign-in as a delete-capable user |
| [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | No own-only restriction: a View user sees ALL technicians' shifts | Needs a second sign-in as a view-only technician |
| [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | Clocking into line tasks is gated by the staff 'Time Clock' setting | Needs a second sign-in as each of the two staff members |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Default roles start at the Schedule level the spec names (view-only vs edit) | Needs a second sign-in as a holder of each permission level |
| [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | Shop closures do NOT block spread in V1 - shifts can land on closure days | Waiting on the product owner's answer, and the shop-closure setting does not exist in the build |
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Shifts and events created before the Schedule rewrite still appear after it | Cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Dashboard shows one schedule row per work order even with many shifts | The Dashboard section this test needs does not exist in the build |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | A work order created with an appointment shows up on the Schedule board | Work order creation offers no appointment in the build |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | The Priority field this test needs does not exist in the build |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | Needs three separate sign-ins, one per permission level |

---

# Report Suite

**Run 359. 480 tests belong to us. Run 438 of them. Skip the 42 listed below.**

*(12 further tests in this area were written by a colleague and are not part of this list or these counts.)*

**⚠️ 1 of the 42 tests below is already marked Passed in this run.** A test that could not be run cannot have passed.

## Skip these

| Test | What it is | Why it cannot be run yet |
|---|---|---|
| [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | Nightly snapshot records one row per then-open job per calendar date | The nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | Captured Earned and Remaining use the same maths as the on-screen report | The nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Nightly snapshot spans every location with no user location filter | The nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped | The nightly capture is written by a background process and nothing in the product reads it back in this version |
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | First visit shows the default columns; the rest are in the column selector | The build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | Location column: shown to any multi-location user, Multiple on aggregating rows | The build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | A hand-made Location column choice is remembered like any other column | The build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at |
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | Each qualifying work order appears exactly once in exactly one tab | The specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | The specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |
| [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | Approved started-boundary: time or part received vs neither decides the tab | The specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs |
| [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | Sales Representative selector shows on WO and Part Sale, not on imported | Waiting on an answer from the product owner |
| [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | Customer record shows a "Sales Representative" row; "Unassigned" when none | Waiting on an answer from the product owner |
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | Opening an invoice you lack permission for shows access-denied; back works | Waiting on one answer from the product owner about whether this person is given a link at all |
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | Building a custom range on the calendar cannot exceed a 366-day span | The calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | A service (S) invoice with no vehicle also lands in the Parts Sales bucket | This organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | Reversed and voided invoices are excluded from every row; count and total | This organisation has no reversed or voided invoice inside the report date range |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Duplicate asset labels get stable (#1)/(#2) suffixes that survive reloads | No customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | An invoice deleted after load shows the not-found state and back returns | Deleting a real invoice while the report is open is not something to do on a shared environment |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | You cannot reach an invoice you have no permission to open | Waiting on one answer from the product owner about what the invoice number should look like, and it needs a second sign-in that cannot open work orders or part sales |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | A logo that is set but will not load falls back to the ShopView logo | This organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | A failed data fetch shows the error toast which fades after 5 seconds | A failing data fetch cannot be forced from the application |
| [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | A Custom range uses the date-picker and holds a 366-day maximum span | Needs the calendar driven past a 366-day span, which this harness could not do |
| [C43559](https://shopview.testrail.io/index.php?/cases/view/43559) | Invoice # and customer name when you cannot open what they point at | Waiting on one answer from the product owner about what these two values should look like, and it needs a second sign-in that cannot open work orders, part sales or customers |
| [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | Selector offers only reps whose sales-representative toggle is on | This part of the report is not built yet |
| [C30372](https://shopview.testrail.io/index.php?/cases/view/30372) | Core parts are excluded from both the inventory and special-order result sets | No part in this organisation carries the core flag, so core exclusion cannot be exercised |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Without reports access Technician Utilization is hidden | Needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment |
| [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | Internal hours with no default labor rate anywhere show an em-dash | No location on this environment is set up without a default labor rate, so the em-dash state cannot be produced |
| [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | Internal hours split across rated and unrated locations show a part value | No location on this environment is set up without a default labor rate, so a part-valued row cannot be produced |
| [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0 | No technician on this environment has an em-dash in Est. Lost Labor, because both locations have a default labor rate |
| [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | Reconcile exception (a): an open clock is snapshotted at each load instant | Needs a technician clocked in at the moment of the test, and no technician on this environment is currently clocked in |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Technician Utilization: Location filter hidden for a one-location user | Needs a second sign-in as a user who can reach only one location, and there is one shared sign-in on this environment |
| [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | An over-cap Work In Progress download is refused with the too-large message | The over-size refusal cannot be produced on this environment; no tab comes near the size limit |
| [C30547](https://shopview.testrail.io/index.php?/cases/view/30547) | With no fixed sell price and no category, Unit Sell equals Unit Cost | A part cannot be saved without a category on this build, so the no-category path cannot be produced |
| [C38892](https://shopview.testrail.io/index.php?/cases/view/38892) | A recorded day keeps its category and vendor names after a rename or delete | Needs a recorded earlier day plus the stored capture rows, which are not reachable from the application |
| [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | Inventory Value: the Location filter is hidden for a one-location user | Needs a second sign-in as a user with access to only one location |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | A user with ordinary reports access can open Inventory Value | Needs a second sign-in as a user holding only the ordinary reports access |
| [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | Without reports access Inventory Value is absent from the navigation | Needs a second sign-in as a user with no reports access |
| [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Nightly snapshot records one row per in-stock non-core part per location | The nightly capture is a server-side job and its stored rows are not reachable from the application |
| [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | A recorded snapshot day equals what the live report showed that day | Needs the stored nightly capture rows, which are not reachable from the application |
| [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Nightly snapshot: re-running the capture for a date replaces that date's rows | The nightly capture job cannot be re-run or inspected from the application |
| [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | Snapshot retention: daily captures are kept for 0–13 months | Retention pruning is a server-side job over stored history, not reachable from the application |
| [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Thinned history still served by the closest-recorded-day rule | Needs a thinned history that this organisation does not have and cannot be produced from the application |

---

## If you are not sure

- The test tells you it is waiting on something → **Blocked**.
- The test tells you what you will see and it matches → **Failed**, nothing to raise.
- The test tells you what you will see and you see something else → **report it**.
- The test says nothing special and works → **Passed**.
- Anything else, or the test simply does not make sense → **Blocked**, and tell the QA lead. Never guess a result.

*Every count in this document was read from TestRail on 12 August 2026. If cases are added or changed after that, the counts move with them.*
