# RUNNABILITY — THE 14 CASES THAT WERE CLASSIFIED "WAITING ON BRANKO"

**The premise of this pass, and it was right:** Branko's missing Parts/Reports product write-up
leaves these cases' **expected behaviour** unsourced. It does **not** stop us verifying that **a
tester can execute their preconditions and steps**. Nobody had tested which.

**Build:** `v3.7-20e801b` — last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`, read at **17:49:08Z**.
**Location:** Staging Heavy Duty - 9919. **Identity:** `admin@shopview.com` (42 permissions,
`view_mode: full`).
**No case in this file was written to.** Their expected results are untouched and every
`AUTOMATION: HOLD` stands — the hold is about the unsourced expectation and is not ours to lift.
**The runnability verdict lives here, off the case, exactly as the brief required.**

---

## THE HEADLINE

| Verdict | Count | Cases |
|---|---|---|
| **RUNNABLE** — every step executable exactly as written | **10** | C29559, C29609, C29610, C29612, C38882, C38904, C38906, C38907, C38910, C43562 |
| **RUNNABLE, one step needs a route correction** (cosmetic) | **1** | C38911 |
| **NOT RUNNABLE AS WRITTEN** — a substantive divergence strands the tester | **3** | C38905, C38908, C38909 |

**10 + 1 + 3 = 14.** ✓

**So 11 of the 14 are runnable today and 3 are not** — and the three fail for reasons that have
**nothing to do with Branko's write-up**. Two of them would have stayed invisible until a tester
opened the case and stopped.

---

## 1 · THE FOUR STATUS-CHIP CASES — ALL FOUR RUNNABLE

Driven in `evidence/probeQ1b.json`. Preconditions verified live from the API before driving:
**Estimate 100 work orders / 52 distinct customers · Complete 11 / 8 · Approved 96 / 47** — so every
"records exist for at least two different customers" precondition is genuinely met.

The tabs on screen read **ALL · ESTIMATES · COMPLETED · MY WORK ORDERS** (`text-transform:
uppercase`; the DOM text is `All`, `Estimates`, `Completed`, `My Work Orders` — both readings
recorded, neither alone is "the label").

| Case | Steps | Verdict |
|---|---|---|
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | 1–3 | **RUNNABLE.** Estimates tab clicked; the bar carries **4** chips — Customer (4754 options), Lead Technician (47), Service Advisor (60), Asset on Site (2: Yes/No) — and each opened with real options. |
| [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | 1–5 | **RUNNABLE.** Steps 1, 2, 4, 5 executed; Customer picked (*Iibay Landscaping*), table narrowed to 2 rows, chip turned blue `rgb(227, 242, 253)` reading `Customer : Iibay Landscaping`. |
| [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | 1–5 | **RUNNABLE.** Same, on the Completed tab. |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | 1–5 | **RUNNABLE.** Approved ticked on All (9 status options offered), Customer picked, Estimates tab, back to All — **both chips came back** reading `Status : Approved` and `Customer : Iibay Landscaping`. |

### The one thing to be clear about, because it looks like a runnability failure and is not

**On the Estimates and Completed tabs there is no Status chip at all** — not disabled, not greyed:
absent. C29609 and C29610 step 2 says *"Look at the filter bar and at the Status chip"* and step 3
says *"Try to click the Status chip and change it."*

**A tester can perform both.** They look, the chip is not there, they try to click it, nothing is
there to click — **and that observation is the entire point of the case.** The case expects it
present and greyed out (Branko's Q4=B ruling of 17 July plus the QA lead's ruling of 30 July); the
build does not have it; **the case is left asserting its source so the tester fails it.**

**Correcting these steps to match the build would delete the finding** — Standing Rule 9's dangerous
edge, and this is exactly the shape it warns about.

---

## 2 · THE TEN PARTS AND REPORTS CASES

Routes were discovered **from the app's own navigation**, not guessed (`evidence/probeQ3.json`).
Parts carries seven views — **Part Sales · Inventory · Catalog · Returns · Purchase Orders · Vendor
Invoices · Vendors**. Reports carries **seventeen**, enumerated verbatim in
`evidence/probeS2.json`.

**Which Parts views actually carry a filter bar (measured, `evidence/probeR3.json`):**

| View | Filter chips | Page search |
|---|---|---|
| Inventory | **3** — Bin Location, Category, Supply | yes |
| Part Sales | **1** — Status | yes |
| Catalog | **2** — Manufacturer, Category | yes |
| Returns | **2** — Show cores only, Vendor | yes |
| Purchase Orders | **0** | yes |
| Vendor Invoices | **0** | yes |
| Vendors | **0** | yes |

**Reports: page search is present on only 2 of the 10 views checked** — Sales Tax and IBS Batches.
The other eight have none.

### C38882 — Date range: ready-made periods and a custom range · **RUNNABLE**

Steps 1–7 driven on Timesheet Activities (`evidence/probeQ6.json` → `customRange`). The button
reads `Date Range : Last month` before anything is touched. The panel offers **Today, Yesterday,
This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year,
Custom, Clear Selection**. Picking *Today* → `?range=today`, 8 rows → 2. *Custom* opens two inputs
(`date_input_range_start` / `date_input_range_end`, labelled **From** and **To**). **The From date
alone changed nothing**; adding the To date gave
`?range=custom&range=2026-07-01&range=2026-07-31`, 8 rows, button `Date Range : Custom`.
Precondition 3 (records inside and outside the range) is genuinely met.

### C38904 — Every Parts list page shows its designed filter buttons · **RUNNABLE**

All eight pages reached (steps 1–8), the Credits tab included (step 5 — Returns carries tabs
`Returns | Credits`; Credits shows one chip, `Date : 30 days`, 5 rows). Step 9's toolbar icons
captured on each page. Step 10 — *"open one of its filter buttons … and pick a value"* — is
**already scoped by the case's own expectation 14**, which states in the tester's own words that
Purchase Orders, Vendor Invoices and Vendors have no filter bar and tells them to **mark the test
BLOCKED, not failed**. So a tester is not stranded on those three.

### C38905 — Part Type filter opens a Core / Non Core list · 🔴 **NOT RUNNABLE AS WRITTEN**

**There is no Part Type button on the Returns tab.** Every chip on that tab was opened and
enumerated: **`Show cores only`** (options: **Yes**, **No**) and **`Vendor`** (a long real vendor
list). Nothing named Part Type; nothing offering Core / Non Core.

Step 1 tells the tester to *"click the Part Type filter button"* and step 3 to *"Tick Core, then
also tick Non Core"*. **Neither can be done.** The case's own "not built yet" note covers *"if the
filter bar is missing on the view you are testing"* — but the filter **bar is present**; it is the
**button** that is absent, so the note does not catch this and the tester must decide for
themselves. **Substantive → `DIVERGENCES.md` §1. Not rewritten.**

### C38906 — Choosing a Parts filter narrows the list · **RUNNABLE**

Inventory, Category → `.Brake Parts`: **32 rows → 6**, `?category=d8e28ff3…`.

### C38907 — Parts filters support multiple choices and can be cleared · **RUNNABLE**

Two categories ticked → the button reads **`Category : .Brake Parts, +1`** and the address carries
both ids. `Clear Selection` restored 32 rows. Step 3's *"look at the filter bar for a way to clear
all filters"* is a look, and a `Clear Filters` control does appear on Inventory while a filter is
applied (`evidence/probeQ4.json`).

### C38908 — Every filter a page had before is still available · 🔴 **NOT RUNNABLE AS WRITTEN**

**Its precondition 2 cannot be met by anyone here.** It requires *"a written list of the filters
each Parts page and each report offers today, before the new filter bar (take screenshots of the
old screens first, or ask the developers for the list)"*. **The redesign is already installed — the
old screens no longer exist on this branch, and no such list is held anywhere in this repository.**

Checked for self-serviceability first (Standing Rule 68): it is **not** seedable — it is a
historical artefact, not a data state. **The one thing that would clear it is the developers' list.
Substantive → `DIVERGENCES.md` §2.**

### C38909 — Report filter bars appear on the reports this change covers · 🔴 **NOT RUNNABLE AS WRITTEN**

Two problems, one substantive and one cosmetic.

**Step 3 sends the tester to a report that does not exist.** It says *"Go to the My Timesheets
report … it is not the separate 'Timesheets (Payroll Timesheet)' report"*, and the case's
expectation 4 describes its Date filter. **There is no My Timesheets report on this build.** It is
absent from all **seventeen** Reports nav items, and **all five plausible routes return the app's
own 404 page** — `/reports/my-timesheets`, `/reports/my-timesheet`, `/reports/timesheets`,
`/reports/punch-clock`, `/my-timesheets` (*"Our wrench could not fix this one. The page does not
exist!"*). The detector demonstrably works: real routes render their report. **Substantive →
`DIVERGENCES.md` §3.**

**Step 6 names two tabs that are a link and a page.** It says *"Go to the Sales Tax report. Look at
the filter buttons on the Collected tab, then open the All Tax Rates tab"*, and expectation 7 says
*"Sales Tax has two view tabs"*. The build has **no tabs** on that report. It has a nav item reading
**SALES TAX COLLECTED** landing on `/reports/sales-tax/invoices?range=this_quarter` (chips
`Date Range` and `Invoice Status`), and an **`<a>` link `button_see_all_tax_rates` labelled "See All
Tax Rates"** going to `/reports/sales-tax/all-tax-rates`, which has its own bar (`Invoice Status`).
**Both destinations exist and a tester can reach both** — only the control differs. **Cosmetic →
`DIVERGENCES.md` §4, correction recommended, deliberately not applied.**

Steps 1, 2, 4, 5, 7 and 8 all run.

### C38910 — Choosing a Reports filter narrows the report results · **RUNNABLE**

Sales report, Customer → *Aaborough Works*: **16 rows → 2**, `?companyId=7af75d7c…`, button
`Customer : Aaborough Works`.
**An earlier run of this reported "0 options" and that was our own wrong chip id** — it used the
Work Orders id and so could not fail. Named in §4 below rather than dropped.

### C38911 — New Reports filter types behave correctly · **RUNNABLE, one route wrong**

Step 1 offers the tester a choice: *"for example A/R Aging Detail (Location, Transaction Type) or
Notes (Mention)"*.

* **The Notes route works.** `Filter by Mention` carries 39 options and narrows the report.
* **The A/R Aging Detail route does not.** That report carries exactly **one** chip —
  `Date : 2026-08-12`. **No Location. No Transaction Type.**

Because the step names an alternative that works, **a tester is not stranded**, so this is runnable
— but the first example is wrong on this build. **`DIVERGENCES.md` §5.**

**Step 3 says "tick two choices where possible", and "where possible" is doing real work here:**
the Notes `Mention` filter is **single-select** — the menu closes on the first pick and a second
pick **replaces** the value (`Admin ShopView` → `Ahtasham Zeeshan`, one `mention=` parameter
throughout). **Both picks were proven to move the signal, so this is not a missed click.** Whether
single-select is correct is Branko's business, not ours.

### C43562 — Parts and Reports filters collapse, share and work on a phone · **RUNNABLE**

All six steps, on a Parts page and then on a report.

| Step | Parts (Inventory) | Report (Timesheet Activities) |
|---|---|---|
| 1 · set a filter | Category `.Brake Parts` → 6 rows | `Filter by Staff` → 5 rows |
| 2 · collapse / expand | 3 chips → **0** → **3** | 2 chips → **0** → **2** |
| 3 · leave and come back | expanded, filter still on | expanded, filter still on |
| 4 · copy the address into a fresh window | **6 rows, chip `Category : .Brake Parts`** | **2 rows** — the data is filtered — **but the chip reads `Filter by Staff` with no value** |
| 5 · phone, 390 × 844 | chips in one horizontally scrollable row (619 px in a 379 px viewport); the dropdown is a **menu, not a bottom sheet**; **no Apply button**; the pick applied immediately | chips scrollable, menu not sheet, no Apply; **the apply-immediately reading is INCONCLUSIVE — the option picked was already selected** |

**Step 4 needed three attempts before it could fail, and that is worth recording**: the first two
runs shared an address that carried no filter at all, or shared it while the page preference held
the same value — in both cases the control looked identical to the test. It was settled by sharing
an address naming a **different** category from the one saved, so the two arms had to differ
(6 rows vs 32; `.Brake Parts` vs `Uncategorized, +1`).

---

## 3 · WHAT THE HOLDS ACTUALLY BLOCK

Every one of the 14 keeps its `AUTOMATION: HOLD`, and that is correct — **the expectation is
unsourced and only Branko can source it.** What this pass establishes is the other half:

> **11 of the 14 can be handed to a tester the moment Branko answers, with no further work on the
> case at all. 3 of them cannot, and the reasons have nothing to do with him.**

That distinction did not exist before today. It was the difference between *"23 cases remain"* and
*"3 cases have a problem we can act on and 20 are waiting on other people"*.

---

## 4 · FIVE THINGS THAT LOOKED LIKE BUILD FAULTS AND WERE OUR OWN HARNESS

Recorded because the count matters more than the excuse — **more than forty-five false absences
have been caught this way across these projects in two days**, and every one of these five would
have read as a finding.

1. **"The Estimates tab has no filter bar at all."** The bar-opening helper probed a chip that
   **does not exist on that tab** and so toggled an already-open bar shut. Fixed; the tab has four
   chips.
2. **"The Sales report's Customer filter has 0 options."** Wrong chip id — the Work Orders one.
   With `filter_chip_companyId` it has 4754. **That probe could not fail.**
3. **"The Notes Mention filter does not register a tick."** The tick detector looks for checkbox
   markup that **Reports options do not have**, and the URL already carried a mention from an
   earlier probe. Re-run properly, the filter is single-select — a real finding that the broken
   detector would have mislabelled.
4. **"Every tab on Technician Efficiency is active."** An active-tab test matching `/active/`
   anywhere in the class string. It meant the "other" tab clicked was the one already showing, so
   nothing moved and nothing could fail.
5. **"The Date chip's menu is empty."** An option count that only counts `filter_option_` divs, on
   a Date panel that is **not built that way** — as an earlier probe in this same pass had already
   recorded.

**Two further readings are reported as INCONCLUSIVE rather than as findings**, because their checks
could not fail: the phone apply-immediately behaviour on a *report* (the option was already
selected), and the workplace count (`/api/staff/my-workplaces` returned 200 and our parser did not
understand the shape).
