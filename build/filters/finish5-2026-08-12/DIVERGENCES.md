# DIVERGENCES — what the sources describe that the build does not have

**Standing Rule 9's three-link chain: learned from the sources → verified runnable on the build →
any divergence raised.** This is the third link.

**The category test, applied to every row below:** *would a reader of the source recognise what the
build offers as the same thing?* **YES → cosmetic:** correct it and log it. **The source describes
something the build simply does not have → substantive:** record both texts, name the cases, give
the smallest change that stops a tester being stranded, and **raise it — never silently rewrite it**,
because rewriting a substantive divergence **deletes the finding**.

**Build:** `v3.7-20e801b`, read 17:49:08Z. **Location:** Staging Heavy Duty - 9919.
**Nothing in this file was applied.** Every affected case is held on Branko's Parts/Reports
write-up, and the brief bars editing their expected results. **Applying step corrections now would
also be wasted work: his write-up is likely to rewrite these very steps**, and a second edit on
release eve carries more risk than the first one removes.

---

## SUMMARY

| # | Case | Kind | One line |
|---|---|---|---|
| 1 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | 🔴 **SUBSTANTIVE** | There is no **Part Type** button on Parts Returns |
| 2 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | 🔴 **SUBSTANTIVE** | Its precondition needs a record of the **pre-redesign** filters that does not exist |
| 3 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | 🔴 **SUBSTANTIVE** | The **My Timesheets** report does not exist on this build |
| 4 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | cosmetic | Sales Tax's two views are a page and a **link**, not two **tabs** |
| 5 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | cosmetic | A/R Aging Detail has **no Location and no Transaction Type** button |
| 6 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | our own wording | Its hold reason is **wider than the truth** |
| 7 | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | build observation | A shared **report** address filters the data but the chip shows **no value** |

**3 substantive · 2 cosmetic · 1 correction to our own text · 1 build observation.**

---

## 1 · 🔴 C38905 — there is no "Part Type" button on Parts Returns

**WHAT THE CASE SAYS** (steps 1 and 3, verbatim):

> 1. On the Parts Returns tab, click the **Part Type** filter button.
> 3. Tick **Core**, then also tick **Non Core**, and watch the list below.

and its expected result 1:

> A small menu opens with two options: **Core** and **Non Core**.

**WHAT THE BUILD HAS** — every chip on that tab opened and enumerated
(`evidence/probeS1.json` → `c38905_returns`):

| Button | Options inside |
|---|---|
| **`Show cores only`** | **Yes**, **No** |
| **`Vendor`** | 123 Cannabis Forestlawn, 4Refuel, Aabridge Beverages, … (a long real vendor list) |

**There is nothing named Part Type and nothing offering Core / Non Core.**

**WHY THIS IS SUBSTANTIVE, NOT COSMETIC.** A reader of the source would **not** recognise
`Show cores only → Yes/No` as the same thing as `Part Type → Core/Non Core`: it is a different
control, with different values, and **step 3's "tick both" has no counterpart at all** — a
show-only-cores toggle cannot be set to both.

**WHY THE CASE'S OWN SAFETY NET DOES NOT CATCH IT.** Its expectation 5 tells the tester *"if the
filter bar is missing on the view you are testing, mark this test BLOCKED — do not mark it failed."*
**The filter bar is not missing.** It is present, with two buttons, neither of them the one the step
names — so the tester falls through the net and has to decide alone.

**SMALLEST CHANGE THAT STOPS A TESTER BEING STRANDED — recommended, NOT applied.** Widen the note
already on the case:

> *"Not built yet on the build tested: the Returns tab shows two filter buttons — Show cores only
> (Yes/No) and Vendor — and there is no Part Type button. If the button this test names is not on
> the page, mark this test BLOCKED — do not mark it failed."*

**WHO CLEARS IT:** Branko, in the Parts/Reports write-up — is `Show cores only` the intended shape,
or is `Part Type` still owed?

---

## 2 · 🔴 C38908 — the precondition needs a record of the old screens that no longer exists

**WHAT THE CASE SAYS** (precondition 2, verbatim):

> 2. You have a written list of the filters each Parts page and each report offers today, **before
> the new filter bar** (take screenshots of the old screens first, or ask the developers for the
> list).

**WHAT IS TRUE ON THIS BUILD.** The new filter bar is installed. **The old screens are gone**, so
"take screenshots of them first" is no longer available to anyone, and **no such list exists in this
repository** — searched.

**RULED OUT FIRST (Rule 68):** this is not a data state seeding can produce. It is a **historical
artefact**. There is no self-service route to it.

**SMALLEST CHANGE — recommended, NOT applied.** Either the developers supply the before-list (an
external dependency, and the case's own precondition already names it as the alternative), or the
case is re-scoped to compare against the **specification's** filter list rather than the old
screens'. **That second option is a real change of what the case tests and is Branko's and the QA
lead's call, not ours.**

**WHO CLEARS IT:** the developers (the list), or the QA lead (a re-scope).

---

## 3 · 🔴 C38909 step 3 — the "My Timesheets" report does not exist

**WHAT THE CASE SAYS** (step 3, verbatim):

> 3. Go to the **My Timesheets** report and look at its filter buttons. This is the report called
> 'My Timesheets' - it is not the separate 'Timesheets (Payroll Timesheet)' report.

and expectation 4:

> **My Timesheets** includes a Date filter button. No product document lists any other filter button
> for this report…

**WHAT THE BUILD HAS.** The Reports navigation carries **seventeen** items, enumerated verbatim:

> Timesheet Activities · Sales · Technician Efficiency · Advisor Analysis · Shop Efficiency ·
> Sales Tax Collected · A/R Aging Summary · A/R Aging Detail · A/R Aging Collection ·
> A/P Aging Summary · A/P Aging Detail · A/P Unpaid Invoices · IBS Batches · QB Unexported ·
> Export Reports · Notes · Reminders

**There is no My Timesheets.** And it is not merely missing from the menu — **all five plausible
routes return the application's own 404 page**:

| Route tried | What came back |
|---|---|
| `/reports/my-timesheets` | *"Our wrench could not fix this one. The page does not exist! 🔧"* |
| `/reports/my-timesheet` | *"Error: Page not found. Have you tried turning it off and on ag…"* |
| `/reports/timesheets` | *"404: The page went to get parts and never came back 🚗"* |
| `/reports/punch-clock` | *"Looks like this page took a coffee break... permanently ☕"* |
| `/my-timesheets` | *"Our wrench could not fix this one. The page does not exist! 🔧"* |

**The detector can fail:** every real route in this same run rendered its report.

**WHY THIS MATTERS MORE THAN A MISSING STEP.** The case's expectation **describes what that report's
filter bar should contain**, so the *source* believes the report exists. **A precondition or route
the sources require but the build does not have is very often evidence that the BUILD is wrong, not
the case** — and rewriting the step to skip it would erase exactly that signal.

**SMALLEST CHANGE — recommended, NOT applied.** Add to the case's existing "not built yet" note:

> *"Not built yet on the build tested: there is no My Timesheets report in the Reports menu on this
> build. Skip step 3 and mark this test BLOCKED for that step — do not mark it failed."*

**WHO CLEARS IT:** Branko — is My Timesheets still in scope, and is its absence a build gap or a
scope change nobody told the test suite about?

---

## 4 · C38909 step 6 — Sales Tax's two views are a page and a link, not two tabs

**WHAT THE CASE SAYS** (step 6 and expectation 7, verbatim):

> 6. Go to the Sales Tax report. Look at the filter buttons on the **Collected tab**, then open the
> **All Tax Rates tab** and look at them again.
> 7. Sales Tax has **two view tabs**: the Collected tab includes Date, Invoice Status and Customer
> filter buttons, and the All Tax Rates tab includes an Invoice Status filter button.

**WHAT THE BUILD HAS.** No tabs on that report at all. Instead:

* the Reports nav item reads **SALES TAX COLLECTED** (`text-transform: uppercase`; DOM text
  *"Sales Tax Collected"*), landing on **`/reports/sales-tax/invoices?range=this_quarter`** with
  chips **`Date Range : This quarter`** and **`Invoice Status`**;
* an **`<a>` element, `data-test-id="button_see_all_tax_rates"`, labelled "See All Tax Rates"**,
  going to **`/reports/sales-tax/all-tax-rates`**, whose bar carries **`Invoice Status`**.

**WHY COSMETIC.** **Both destinations exist and a tester can reach both.** Only the control differs
— a link where the source says a tab. A reader of the source would recognise the destination.

**SMALLEST CHANGE — recommended, NOT applied.** In step 6: *"…look at the filter buttons on the
Sales Tax Collected report, then use the **See All Tax Rates** link and look at them again."*

---

## 5 · C38911 — A/R Aging Detail has no Location and no Transaction Type button

**WHAT THE CASE SAYS** (step 1, verbatim):

> 1. Open the Reports area and go to a report that uses them - **for example A/R Aging Detail
> (Location, Transaction Type)** or Notes (Mention).

**WHAT THE BUILD HAS.** A/R Aging Detail carries exactly **one** chip: **`Date : 2026-08-12`**.
No Location. No Transaction Type.

**WHY COSMETIC AND NOT SUBSTANTIVE.** The step names **two** example routes, and **the second one
works** — Notes carries `Filter by Mention` with 39 options. **A tester is not stranded.**

**Recommended — NOT applied:** drop the A/R Aging Detail example, or move it into the case's
"not built yet" note. **Branko's write-up may settle it either way**, which is another reason not to
edit now.

**A second observation on the same case, for the tester's benefit rather than as a divergence:**
the Notes `Filter by Mention` filter is **single-select** — the menu closes on the first pick and a
second pick **replaces** the value. The case's step 3 says *"tick two choices where possible"*, so
the step still runs; whether single-select is correct is Branko's to say. **Both picks were proven
to move the signal, so this is a measurement, not a missed click.**

---

## 6 · C38901 — our own hold reason is wider than the truth

**WHAT OUR CASE SAYS** (marker, verbatim):

> `AUTOMATION: HOLD - only half of it can be run - the report pages have no page search box yet, so
> the report-tab half cannot be tested`

**WHAT IS TRUE.** **IBS Batches has both** a page search **and** three tabs
(**READY TO SEND · SENT · PAYMENTS**); searching `a` there took 6 rows to 5 and put `?search=a` in
the address. So *"the report pages have no page search box"* is **not true of every report page**.

**AND THE HOLD STILL STANDS**, because the search box is on **the first tab only** — switching to
Sent leaves no search box to compare against, so the *"each tab keeps its own separate search"*
behaviour still cannot be exercised.

**Recommended wording — NOT applied:**

> `AUTOMATION: HOLD - only half of it can be run - no report offers a page search box on more than
> one of its tabs, so the report-tab half cannot be tested`

**This is a correction to OUR text, not a build finding**, and it is listed here so it cannot be
mistaken for one.

---

## 7 · C43562 — a shared report address filters the data but its chip shows no value

**A BUILD OBSERVATION, NOT A STEP PROBLEM.** Step 4 runs perfectly well; what it shows is worth
recording.

| | Parts page (Inventory) | Report (Timesheet Activities) |
|---|---|---|
| Address shared, naming a value **different** from the one saved | `?category=<.Brake Parts>` | `?staffId=<Johnny Olson>` |
| Fresh window: rows | **6** (control, bare address: 32) | **2** (control, bare address: 5) |
| Fresh window: what the button reads | **`Category : .Brake Parts`** | **`Filter by Staff`** — no value |
| Control (bare address, same fresh-window route) | `Category : Uncategorized, +1` | `Filter by Staff : Heather Carlson` |

**So on a report the shared address does reach the data — the row count proves it — but the button
does not display what it is filtering by.** The two arms differ in both cases, so **the detector can
fail** and this is a measurement rather than an artefact.

**Not filed.** The Jira creation hold stands (Standing Rule 62 and the hold at its tail), and this is
in any case ground Branko's write-up covers. **Recorded here so it is not lost, and so that whoever
files it has the evidence ready.**

---

## WHAT IS **NOT** IN THIS FILE, DELIBERATELY

**The absent Status chip on the Estimates and Completed tabs is not a divergence.** It is what
[C29559](https://shopview.testrail.io/index.php?/cases/view/29559),
[C29609](https://shopview.testrail.io/index.php?/cases/view/29609),
[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) and
[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) **exist to test**. The cases
expect it present and greyed out (Branko's Q4=B of 17 July, plus the QA lead's ruling of 30 July);
the build does not have it; **the cases are left asserting their source so the tester fails them.**
Recording it as a step divergence and "correcting" the steps is precisely how that finding would
disappear.
