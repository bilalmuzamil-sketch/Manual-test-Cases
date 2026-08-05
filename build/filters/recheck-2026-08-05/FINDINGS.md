# Filters — what the re-check found, 5 August 2026

**Plain summary.** The Filters QA branch was rebuilt overnight. We re-ran **every one of the 110
test cases** against the new build. **91 came out the same. 19 changed.** Two problems have been
fixed, one problem we had marked as fine turns out to be real, and we found one new problem.

**The build:** ShopView **`v3.4.2-d00239b`**, read at the start, the middle and the end of the
pass — the same all three times, so nothing shifted under us. The previous pass measured
**`v3.4.2-4f8211c`**, which no longer exists.

## What I did

1. Read the build's own version marker myself before touching anything.
2. Re-ran every observation the 4 August pass had recorded, against the new build, and compared
   the two sets of readings machine-to-machine rather than by eye.
3. Where a reading could not be produced by re-running a script, drove the app by hand and
   created whatever data was needed.
4. Checked all eight relevant developer tickets in Jira for their live status.
5. Pulled the specification live from Confluence and compared it to what our cases say.
6. Updated all 110 cases in TestRail, checked every write byte by byte, and proved the test run
   and the tester's own results were left exactly as they were.

## The five things that changed the picture

### 1. The dropdown that closed on every tick is FIXED — and it affected 12 cases

This is the biggest change. On the old build, ticking one value closed the dropdown, so picking a
second value meant opening it again. **On the new build the dropdown stays open**, and I proved it
on all five filter buttons, not one:

| Button | Panel open 0.7 s after one tick | Panel open 4 s after | Second value ticked without reopening | Result |
|---|---|---|---|---|
| Status | open, 9 options | open | **yes — and a third as well** | button reads "Status: Estimate, Approved, Paid" |
| Customer | open | open | **yes** | two removable tags, both in the address bar |
| Lead Technician | open | open | **yes** | two tags |
| Service Advisor | open | open | **yes** | two tags |
| Asset on Site | closes | closed | not applicable | this is a single-choice Yes/No filter, so closing on choice is correct |

On the old build the same script recorded the panel **closed** at both moments.

**Jira agrees, independently:** [SV-8824](https://shopview.atlassian.net/browse/SV-8824) is now
**Ready for QA**. It was raised by Ahtasham Amjad, not by us.

**What we did about it.** Twelve of our cases carried a line telling the tester *"this test is
expected to fail on that point"*. That line is now false, so it was **removed from all twelve**.
The affected cases are FLT-STAT-03/04/05, FLT-CUST-03/05/07, FLT-TECH-03/05, FLT-ADV-03/05,
FLT-ASSET-05 and FLT-CHIP-01. This is the same reasoning the QA lead applied to SV-8844: a line
that tells a tester to expect a failure has to go once the failure is gone.

### 2. The page search that was remembered forever is FIXED — 3 cases

The saved page preference now holds **no search key at all** — not before typing, not after
typing, not after clearing — and typing a word **sends no save request** at all. On the old build
it sent `"search":"Lastone"` and stored it. A brand-new browser with nothing remembered opens Work
Orders with a clean address and the **full 30-row list**; the old build restored the stale word and
showed an empty list.

The known-issue line was **deleted outright** from FLT-PSRCH-10, FLT-PSRCH-11 and FLT-PSRCH-12, as
the QA lead directed.

### 3. Two problems the QA lead closed are STILL THERE — 5 cases

- **[SV-8843](https://shopview.atlassian.net/browse/SV-8843)** (filter buttons share the tab row,
  so collapsing frees no space) was closed **OBSOLETE with the note "Not Reproducible Anymore"**.
  It still happens: buttons at y=90 height 30, tabs at y=85 height 40, and collapsing the bar
  moves the table header by **0 pixels** — the measurements are byte-identical to 4 August.
- **[SV-8847](https://shopview.atlassian.net/browse/SV-8847)** (empty screen offers only "Clear
  Filters" when just a search is active) was closed **OBSOLETE with no reason recorded**. Also
  byte-identical.

Both keep their assertions. Their five cases now carry the QA lead's accepted-behaviour wording:
*"Known and accepted: the product behaves this way on purpose for now. Do not raise this as a new
problem."* Our authority for that note is **his ruling**, not the closing reason — and the closing
reason on SV-8843 is contradicted by the build. That is recorded in `PO-RULING-DEFENCE.md`.

### 4. NEW PROBLEM: a saved people-filter comes back without its name — ticket SV-8871

Found while re-testing persistence. Reproduced from a clean start, twice, on four different routes
back to the page.

| Route back to Work Orders | Status button | Customer button |
|---|---|---|
| just after picking the value | "Status: Paid" | "Customer: Iibay Landscaping" |
| open a work order and come back | "Status: Paid" | **"Customer"** — name gone |
| refresh the page | "Status: Paid" | **"Customer"** |
| close the browser and sign in again | "Status: Paid" | **"Customer"** |
| open the same link in a new window | — | **"Customer"** |

The button is still blue, and the list is **still correctly filtered** — open the button and the
name is there as a tag with a tick. So the list is filtered by something the screen no longer
names. The same happens on **Lead Technician** and **Service Advisor**; it does **not** happen on
**Status** or **Asset on Site**. The three affected filters are exactly the ones whose choices come
from the server.

This breaches two written rules, quoted verbatim from the live specification:
- **S7-R1** — *"When a filter has one or more values selected, the chip changes to an
  active/highlighted visual state (blue pill) **and displays the selected value(s)**"*
- **S10-R1** — *"the filter selections and collapsed/expanded state are **restored exactly as they
  were left**"*

**Filed as [SV-8871](https://shopview.atlassian.net/browse/SV-8871)** — Bug, priority **Low**,
parent epic **SV-8785**, Product Area **Work Orders**, linked to story SV-8792 (Active Filter Chip
Appearance) and story SV-8795 (Filter Persistence). A duplicate search was run first and found
none. Read back from Jira after creation to confirm every field.

**Honesty on this one:** we cannot call it a regression. The 4 August pass tested persistence using
the **Status** and **Asset on Site** filters, which are the two that are unaffected, so this was
never tested on the previous build. It may well have been there all along. The old build is gone,
so that cannot now be settled.

**Exact test data:** customer **Iibay Landscaping** (`company_id=00122246-ab6d-47ee-a885-3425c7bda754`),
staff member **Admin ShopView** for both people filters, Work Orders page, All tab, signed in as an
Admin.

### 5. A case we passed on 4 August was WRONG, and the tester was right — FLT-PERS-04

**FLT-PERS-04** ([C29616](https://shopview.testrail.io/index.php?/cases/view/29616)) — *"A
remembered filter value that was deleted is silently ignored"*. We marked it PASS on 4 August.
**Ahtasham marked it Failed. He is right and we were wrong**, and the reason is that we never
created the state the case needs.

This time it was seeded properly: a throwaway customer **ZZAUTOTEST Filters Recheck**
(`805c112d-cd94-4783-9507-c3cfab137a6e`) was created, selected in the Customer filter alongside the
real customer **Lastone Construction** (`54d98c61-217d-44ad-89bb-79005c902fff`), and then deleted
while off the page. On returning:

| The case says | What actually happens |
|---|---|
| the deleted customer is silently ignored, no error | **true** — no error, no warning, no message |
| the filter reflects only the still-valid selection | **false** — the address bar and the request to the server BOTH still carry the deleted customer's id |
| the table is filtered by the remaining valid selection only | **false** — the request filters on both ids |

The dropdown *does* hide the deleted customer, so the display is cleaned while the applied filter
is not. That is exactly **[SV-8832](https://shopview.atlassian.net/browse/SV-8832)**, Ahtasham's
own ticket, still Open. His Failed result stands untouched; the case now carries the known-issue
line pointing at his ticket.

## The tester's seven failures, reproduced one by one

| Case | C-id | What we found | Verdict on his result |
|---|---|---|---|
| FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | the dropdown defect he hit was real on the build he tested; it is **fixed on the new build** | **right at the time.** Worth re-running now |
| FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | same | same |
| FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | same | same |
| FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | same | same |
| FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | same | same |
| FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | **could not reproduce a failure of what the case actually asks.** Filters ARE stored against the account (`"filters":{"status":["paid"],"company_id":["..."]}`) and a brand-new browser restored both of them and filtered the list, with no "Back To My Saved Filters" button needed | **a question for him, not a change.** His result is untouched |
| FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | **reproduced. He is right, we were wrong** — see section 5 | **correct, and it has a ticket** |

**On FLT-PERS-02 — the likely explanation, offered rather than asserted.** Two things could make
that case look failed without its stated expectations being broken: the new problem in section 4
(if he had a Customer filter set, the button comes back without the name, which reads exactly like
"my filter was not remembered"), or his own open ticket
**[SV-8828](https://shopview.atlassian.net/browse/SV-8828)**, which describes needing to click
"Back To My Saved Filters" after closing the window. We could not reproduce SV-8828 either, on
4 August or today. **Someone should ask him which of the two he saw.** We changed nothing about
his result and nothing about the case's assertions.

## The specification moved, and one case had to follow it

The Filters specification is now **Confluence version 18**, published **2026-08-04T18:19:21Z** by
Branko Cicovic, with his own version note: *"Date-range filter: reflect current in-app default
range and standard predefined ranges (Feature Overview + Key Decisions)"*. The requirement count
did not change (128 numbered items). The page body still says **"Version: 1.6"** — the in-document
version has not moved, which is exactly the trap that let an earlier spec drift five versions
unnoticed, so the Confluence version number is what we go by.

**What reversed.** The earlier revision said the date filter had *no presets and no default range*.
Version 18 says the opposite, verbatim:

> *"A new date-range filter type is introduced: the chip opens a date picker that offers standard
> predefined ranges as well as a custom start/end range, and it is pre-populated with the current
> default range the application applies today (per report/page). A predefined range applies on
> selection; a custom range applies when the second date is picked."*

**And the build already agreed with the new wording** — which is almost certainly why he changed
it. Driven live on the Timesheet Activities report:

- the button opens already reading **"Date Range: This month"** — a default range, pre-filled;
- the panel offers **Today, Yesterday, This week, Last week, This month, Last month, This quarter,
  Last quarter, This year, Last year**, plus **Custom** and a **Clear Selection** link;
- choosing **Today** applied straight away — button "Date Range: Today", address `?range=today`,
  and a request to `/api/reporting/punch-clock-activities/today`;
- choosing **Custom** revealed **From** and **To** boxes. With **From = 07/01/2026** filled in and
  nothing else, **no request fired and the button did not change**. Filling in **To = 07/31/2026**
  changed the button to **"Date Range: Custom"**, the address to
  `?range=custom&range=2026-07-01&range=2026-07-31`, and fired the request. So a custom range
  applies on the **second** date, exactly as written.

**FLT-RPTS-23** ([C38882](https://shopview.testrail.io/index.php?/cases/view/38882)) said *"there
are NO preset ranges and NO pre-filled default range"*. It was **rewritten**: new title,
preconditions, steps and expected results, and its reference pinned to this revision of the
specification. It is deliberately **not** written as a closed list — the ready-made periods are
described as "the ones your report offers", so a report with a different set does not make a
tester fail a correct build. The report left back on "This month" afterwards.

*(A note on the identifier: the instruction called this case FLT-RPTS-13. C38882 is FLT-RPTS-23 in
our id map — the C-id is what matters and it is the right case, the internal number was a slip.)*

## What did NOT change — 91 rows

Confirmed by re-running the same observations and comparing them machine-to-machine:

- **Mobile** — all three mobile observation files came back **byte-identical**, so SV-8845 (shared
  link shows the wrong list on a phone) and SV-8846 (no Clear Filters on a phone) both still
  happen, and the eight held mobile cases are unchanged.
- **Tabs and collapsing** — the whole file byte-identical, all ten readings.
- **Empty state** — byte-identical, so SV-8847 stands.
- **Parts and Reports** — byte-identical apart from the app's own randomised joke text on three
  addresses that do not exist. **Nothing new shipped**: Reports still has no page-search box on any
  tab, and only Timesheet Activities has a filter bar; Purchase Orders, Vendor Invoices and Vendors
  still have no filter bar. The eight remaining not-built cases stay not-built.
- **The data request** — all thirteen probes returned identical HTTP statuses. A made-up field name
  is still rejected with 400; a made-up status value and a made-up Yes/No value are still accepted
  with 200. That last one is the API-only item still waiting for the QA lead's word.
- **The look of the search box** — byte-identical, down to the font (Nunito Sans, 13.12px, colour
  #616161, 6px corner radius, 22.5px magnifier), so the four pixel-measurement cases are unchanged.
- **Everything else in the filter areas** — every difference between the two runs traced to one
  single cause: the dropdown now staying open. Chip labels, addresses, tag lists, Clear Selection
  behaviour, the Imported exclusivity rule and the seven-value "Status: Estimate, Approved, In
  progress,..." button text were all identical.

**One improvement worth naming:** on 4 August the Asset on Site Yes/No readings **failed to
complete** because the dropdown kept closing. They completed this time, so those cases now rest on
better evidence than before — Yes gives `?vehicleHere=1`, No gives `?vehicleHere=0`.

## Was anything else asked and answered?

- **Is the mobile Apply-button question answered?** **No.**
  [SV-8825](https://shopview.atlassian.net/browse/SV-8825) is still **Open**, with **zero
  comments**, last touched 2026-08-04 05:58. So the eight phone cases keep their "do not automate
  yet" line.
- **Did Parts or Reports filter bars ship in this deploy?** **No** — see above.
- **Was anything left behind in the environment?** No. The throwaway customer was deleted and
  proven gone two ways (`/api/customers/list-options?search=ZZAUTOTEST` returns an empty list, and
  a customer search contains no ZZAUTOTEST). All filters were cleared and the Reports date range
  put back to This month.

## OUTSTANDING — what I need from you

1. **Tell Ahtasham that five of his seven failures are now fixed** (the dropdown ones) so he can
   re-run them, and **ask him what he saw on FLT-PERS-02** — we could not reproduce a failure of
   what that case asks for. We did not touch any of his results.
2. **My judgement call, for your confirmation.** You told me to delete the known-issue line where
   the defect is fixed. I applied that same rule to the **twelve** cases carrying the SV-8824 line,
   because that defect is fixed too and the line was telling testers to expect a failure that no
   longer happens. If you would rather those twelve had kept the line, say so and it goes back.
3. **Branko's answer on the phone Apply button (SV-8825).** Still unanswered. It blocks 8 cases.
4. **Your word on the one API-only issue** — a made-up Yes/No filter value is silently ignored.
   Unreachable from any screen, so nothing is filed until you say so.
5. **A second test login**, so the "one person's filters do not leak to another" case can be run.
6. **Tell us when engineering says this branch is final.** Until then every verdict here is
   provisional and the re-check queue stays open.
7. **A decision on the 19 dropdown merges** left over from the July audit. The shared-component
   assumption they waited on is confirmed.
8. **Whether to ask Branko to renumber, or leave it.** The specification's own body still reads
   "Version: 1.6" although the page has been revised eighteen times. It is not blocking anything,
   but it is how a spec drifts without anyone noticing.
