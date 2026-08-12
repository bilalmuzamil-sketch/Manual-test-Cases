# DIVERGENCES — where a step or precondition our sources require does not hold on the build

**Report Suite · build `v3.7-4626299` · 12 August 2026 · for the QA lead**

Every row below is a case where something the **specification** asks for could not be done on the
build. **Nothing here has been rewritten to match the build.** Where a source describes something the
build does not have, the case keeps what the source says and the difference is written down here —
because silently "correcting" it to the build would erase the signal that the **build** is the thing
that is wrong.

Three of these need your decision. They are marked **NEEDS YOUR DECISION**.

---

## 🔴 1 · NEEDS YOUR DECISION — 57 defect tickets were closed in one two-minute sweep, and at least one of them is still broken

**What happened.** On **9 August between 22:40:38 and 22:42:46** — a window of two minutes and eight
seconds, tickets closing about two seconds apart — **57 defect tickets were set to OBSOLETE / Done**.
That is a bulk close, not one-by-one triage.

**Why it matters to us.** **75 of our 480 cases** carry the marker
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`. That marker tells a tester: *this test is expected to
fail today, here is the ticket explaining why.* For **75 cases the ticket now reads "Done."** A tester
opening one tomorrow morning sees a closed ticket and reasonably concludes the test should now pass.

**And the closure carries no information either way — we checked two of them on today's build:**

| Ticket | What it says | What today's build actually does |
|---|---|---|
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) — Location column | closed OBSOLETE 9 Aug | **STILL BROKEN.** Re-proved live today, and it is worse than the ticket says — see section 2 |
| [SV-8907](https://shopview.atlassian.net/browse/SV-8907) — Work In Progress download fails | closed OBSOLETE 9 Aug | **GENUINELY FIXED.** 8 of 8 downloads succeeded (this morning's pass) |

So one closed ticket is fixed and another closed ticket is not. **The status tells you nothing**,
which is exactly why our rule says never to read a ticket's status as evidence about the build.

**What I need from you:** were those 57 closed because the work was done, or because the list was
being tidied before release? The answer changes what tomorrow's testers should do with 75 cases.
**I have not changed any of the 75 markers** — changing them on the strength of a ticket status would
be the very mistake the rule forbids.

The full list of 60 tickets, their status, the closing timestamp and how many of our cases point at
each is in `evidence/expectfail-ticket-status.json`, and tabulated at the end of this file.

---

## 🔴 2 · NEEDS YOUR DECISION — the Location column: the specification asks for one thing, five of the six reports do another

**This is the question earlier passes could not settle. It can be settled now, and the answer is a
real divergence.** Previous passes said it could not be tested "from a single-location scope". That
was true of the account they had. **This account can reach five locations** — `QB Location`, `3rd`,
`L'Espace Tralala Yoga`, `Staging Heavy Duty - 9919`, `Staging Lethbridge - 4310` — which is exactly
the access condition the specification names, so the test is now possible.

**What the sources say** — Work In Progress specification **S4-R3**, and the same rule in the Sales By
Customer and Technician Utilization specifications, all amended 5–6 August:

> *"The **Location** column is offered in the column selector to any user with access to more than one
> location; for that user it is shown by default and can be toggled on or off. A user with access to
> only one location never sees it."*

The gate is **what the user can reach**, not what they have currently chosen, and the column must be
**in the column selector**.

**What the build does**, measured on all six reports today:

| Report | Location column with ONE location chosen | with ALL locations chosen | offered in the column selector? |
|---|---|---|---|
| Work In Progress | **absent** | present | **never** |
| Sales By Customer | **absent** | present | **never** |
| Technician Utilization | **absent** | present | **never** |
| Sales By Representative | **absent** | present | **never** |
| Parts Velocity | **absent** | present | **never** |
| **Inventory Value** | **present** | present | **yes** |

**So five of the six reports still follow the superseded 29 July rule** (show it only when more than
one location is *chosen*) **and never let the user toggle it at all. Inventory Value is the only one
that does what the specifications now ask for.**

**This is already ticketed as [SV-8954](https://shopview.atlassian.net/browse/SV-8954) — and that
ticket was closed OBSOLETE on 9 August in the sweep above.** The ticket describes it on Technician
Utilization only; **it is actually on five reports.**

**What it costs a tester:** any case whose set-up says "turn the Location column off" cannot be set up
at all on five of the six reports. That is a precondition the build cannot achieve.

**What I did:** nothing to the expectations. Two cases already carried a hold naming this
([C38912](https://shopview.testrail.io/index.php?/cases/view/38912),
[C43551](https://shopview.testrail.io/index.php?/cases/view/43551)) — left as they were, now with
fresh evidence behind them. One case asserting the same thing on Sales By Representative
([C38913](https://shopview.testrail.io/index.php?/cases/view/38913)) was marked `READY`, which was
inconsistent with its two siblings; see `CHANGES-MADE.md`.

**What I need from you:** should SV-8954 be reopened and widened to five reports?

---

## 🔴 3 · NEEDS YOUR DECISION — Sales By Customer's Product Type filter was redesigned in the specification two days ago and the build has not caught up

**Sales By Customer is one of the three reports handed off to QA as final.**

**What the sources say** — Sales By Customer specification **S3-R1** and **S3-R2**, changed on
**10 August** under [SV-9074](https://shopview.atlassian.net/browse/SV-9074):

> *"A 'Product Type' filter is visible in the report toolbar. It is a **multi-select**, matching the
> behavior of the Customer and Location filters."*
> *"The dropdown pins two action rows at the top — **'All products'** and **'Clear all'** — above two
> toggle options: **'Parts'** and **'Services.'**"*

**What the build does.** The filter is still the old **single-select** with three options:
**`Parts & Service`**, **`Parts only`**, **`Service only`**. There are no toggles, no "All products"
row and no "Clear all" row.

**SV-9074 is `Ready to Fix`** — the change is accepted and simply has not been built yet.

**What it costs a tester.** Two cases send the tester to options that do not exist:

| Case | The step that cannot be run |
|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | *Select only "Services" (leave "Parts" unselected)* — there is no "Services" option and nothing to leave unselected |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | *Open the "Product Type" filter and read the two action rows at the top* — there are no action rows |

**Both cases are correct against the specification. Neither was rewritten to the build** — doing that
would have deleted our only coverage of a requirement that shipped two days ago and turned a real gap
into a passing test. Both were given a hold with a plain reason so the tester marks them BLOCKED
rather than being stranded; see `CHANGES-MADE.md`.

**What I need from you:** confirm the tester should skip these two tomorrow, and that SV-9074 is
simply not in this release.

---

## 4 · Not a divergence — checked and cleared

Recorded here because each *looked* like one and would otherwise be re-investigated tomorrow.

- **The Work In Progress advisor filter has no "All advisors" row**, while the customer, asset,
  technician and location filters all have an "All …" row. **Not a defect.** The specification gives
  Customer (**S7-R3**) and Asset (**S7-R5**) an "All …" label explicitly and says nothing of the sort
  for Advisor (**S7-R1**). The build matches the sources.
- **The four Work In Progress tab names look miscased in the page source** — `Approved - partially
  completed` — while our cases say `Approved - Partially Completed`. **Our cases are right.** The
  labels carry `text-transform: capitalize`, so the tester reads the title-case form. Reading only the
  raw text would have "corrected" five cases on a final report into wording no tester will ever see.
- **Sales By Customer and Technician Utilization list the same four download items in different
  orders** — Sales By Customer groups by format, Technician Utilization by view. Both cases are
  already written to their own report's order.
- **Parts Velocity's date panel appears to offer a tenth option, "Today".** It does not. The panel
  opens on the month the range starts in; Parts Velocity defaults to a January start, so the calendar
  shows a "Today" jump button that the other five do not need. The nine presets are identical on all
  six reports.
- **Work In Progress's date range read `Aug 9 — Aug 11` when today is 12 August.** Correct: the shop
  is on Mountain time, where it was still the 11th.

---

## Appendix — the 60 tickets our EXPECT FAIL markers point at

| Ticket | Status | Last updated | Our cases | Summary |
|---|---|---|---:|---|
| SV-8818 | Ready to Fix | 2026-08-06T09:43:37 | 13 | PDF download fails with a server error on a medium-sized report view, on 5 of th |
| SV-8820 | Ready to Fix | 2026-08-06T08:28:38 | 4 | Inventory Value reports the stock value for one day AFTER the date asked for |
| SV-8823 | Ready to Fix | 2026-08-06T08:28:14 | 3 | Inventory Value spreadsheet: money arrives as text, and the file ignores the cho |
| SV-8880 | OBSOLETE | 2026-08-09T22:40:38 | 1 | Sales By Representative Summary spreadsheet is missing four columns the screen s |
| SV-8908 | OBSOLETE | 2026-08-09T22:40:44 | 1 | Work In Progress Asset filter leaves out a vehicle that shares a unit number |
| SV-8925 | OBSOLETE | 2026-08-09T22:40:46 | 1 | Sales By Customer and Sales By Representative spreadsheets export money, percent |
| SV-8926 | OBSOLETE | 2026-08-09T22:40:48 | 1 | Inventory Value totals row is labelled Totals on screen where the written descri |
| SV-8928 | OBSOLETE | 2026-08-09T22:40:51 | 1 | Inventory Value forgets the part search text between visits, though it remembers |
| SV-8929 | OBSOLETE | 2026-08-09T22:40:53 | 1 | Inventory Value keeps a saved category that no longer exists, so the report open |
| SV-8930 | OBSOLETE | 2026-08-09T22:40:55 | 1 | Inventory Value shows an empty table with no message when nothing matches |
| SV-8931 | OBSOLETE | 2026-08-09T22:40:57 | 2 | Inventory Value opens on All locations instead of the user's current location |
| SV-8932 | OBSOLETE | 2026-08-09T22:40:59 | 2 | Inventory Value: long text never shortens with an ellipsis, and column headings  |
| SV-8934 | OBSOLETE | 2026-08-09T22:41:08 | 1 | Parts Velocity PDF prints Description, Category and Vendor in full instead of sh |
| SV-8935 | OBSOLETE | 2026-08-09T22:41:16 | 1 | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a  |
| SV-8936 | OBSOLETE | 2026-08-09T22:41:17 | 1 | Parts Velocity download success message is a general one and does not name the r |
| SV-8937 | OBSOLETE | 2026-08-09T22:41:19 | 1 | PDF heading shows an end date one day later than the range asked for, on three r |
| SV-8938 | OBSOLETE | 2026-08-09T22:41:27 | 2 | Parts Velocity Location column sits sixth, after Vendor, instead of first before |
| SV-8939 | OBSOLETE | 2026-08-09T22:41:21 | 1 | Parts Velocity opens on All locations instead of the location the user is workin |
| SV-8940 | OBSOLETE | 2026-08-09T22:41:23 | 1 | Parts Velocity never shortens long Description, Category or Vendor text, so the  |
| SV-8943 | OBSOLETE | 2026-08-09T22:41:25 | 1 | Technician Utilization opens on All locations instead of the location the user i |
| SV-8944 | OBSOLETE | 2026-08-09T22:41:29 | 1 | Technician Utilization total hours do not match Timesheet Activities for the sam |
| SV-8945 | OBSOLETE | 2026-08-09T22:41:32 | 1 | Sorting a Technician Utilization column reloads the report from the server inste |
| SV-8946 | OBSOLETE | 2026-08-09T22:41:33 | 1 | The Technician Utilization technician filter reloads the report from the server  |
| SV-8947 | OBSOLETE | 2026-08-09T22:41:35 | 1 | Technician Utilization technician filter and its select-all control are labelled |
| SV-8948 | OBSOLETE | 2026-08-09T22:41:37 | 2 | Technician Utilization downloads ignore the technician filter and include everyb |
| SV-8949 | OBSOLETE | 2026-08-09T22:41:39 | 1 | Technician Utilization downloads are not ordered by technician name A to Z |
| SV-8950 | OBSOLETE | 2026-08-09T22:41:41 | 1 | Technician Utilization downloads leave out the Summary row |
| SV-8951 | OBSOLETE | 2026-08-09T22:41:43 | 2 | The Technician Utilization Expanded spreadsheet contains per-day rows and the fi |
| SV-8952 | OBSOLETE | 2026-08-09T22:41:44 | 1 | Technician Utilization download messages: the success wording is generic and a f |
| SV-8953 | OBSOLETE | 2026-08-09T22:41:46 | 2 | Technician Utilization expand and collapse controls do not tell assistive techno |
| SV-8954 | OBSOLETE | 2026-08-09T22:41:48 | 2 | The Technician Utilization Location column disappears when one location is chose |
| SV-8955 | OBSOLETE | 2026-08-09T22:41:50 | 1 | Sales By Customer never puts the date range or Product Type in the page link, so |
| SV-8956 | OBSOLETE | 2026-08-09T22:41:52 | 1 | Sales By Customer download file names leave out the date range |
| SV-8962 | OBSOLETE | 2026-08-09T22:41:54 | 2 | Sales By Customer Customer filter: no search icon, wrong multi-select label, and |
| SV-8963 | OBSOLETE | 2026-08-09T22:41:56 | 2 | Sales By Customer sorting: the Location column cannot be sorted, and blank value |
| SV-8964 | OBSOLETE | 2026-08-09T22:41:59 | 1 | Sales By Customer Expanded View PDF comes out on A3 paper instead of A4 |
| SV-8965 | OBSOLETE | 2026-08-09T22:42:00 | 2 | Sales By Customer table uses the wrong row colours, too little side padding, and |
| SV-8966 | OBSOLETE | 2026-08-09T22:42:02 | 1 | Sales By Customer remembered view keeps a location and a customer the user can n |
| SV-8967 | OBSOLETE | 2026-08-09T22:42:04 | 3 | Work In Progress: the WO number is plain text even for a user who does have Work |
| SV-8968 | OBSOLETE | 2026-08-09T22:42:07 | 3 | Work In Progress Advisor, Customer and Asset filters reload from the server inst |
| SV-8969 | OBSOLETE | 2026-08-09T22:42:08 | 1 | Work In Progress filters show a Clear action before anything is selected, and th |
| SV-8970 | OBSOLETE | 2026-08-09T22:42:10 | 1 | Work In Progress table is pale blue-grey throughout instead of the all-white tab |
| SV-8972 | OBSOLETE | 2026-08-09T22:42:20 | 1 | Sales By Representative Expanded spreadsheet puts Invoice # before Date and head |
| SV-8973 | OBSOLETE | 2026-08-09T22:42:14 | 1 | Sales By Representative empty-state message uses different wording from the one  |
| SV-8974 | OBSOLETE | 2026-08-09T22:42:16 | 1 | Sales By Representative: invoices on the same day are not ordered by invoice num |
| SV-8975 | OBSOLETE | 2026-08-09T22:42:18 | 1 | Sales By Representative: three icon-only buttons announce the wrong name to a sc |
| SV-8976 | OBSOLETE | 2026-08-09T22:42:12 | 1 | Sales By Representative: a saved date range that is no longer valid leaves the r |
| SV-8977 | OBSOLETE | 2026-08-09T22:42:22 | 2 | Sales By Representative: the heading row and the Totals row both scroll away ins |
| SV-8978 | OBSOLETE | 2026-08-09T22:42:23 | 1 | Sales By Representative on a phone has no separate totals bar under the table |
| SV-8979 | OBSOLETE | 2026-08-09T22:42:25 | 1 | Sales By Representative expand and collapse chevrons are half the required touch |
| SV-8980 | OBSOLETE | 2026-08-09T22:42:27 | 1 | Sales By Representative table is the same pale grey as the page, and the title a |
| SV-8981 | OBSOLETE | 2026-08-09T22:42:29 | 1 | Sales By Representative Expanded View PDF is one flat table instead of a block p |
| SV-8982 | OBSOLETE | 2026-08-09T22:42:31 | 1 | Sales By Representative download file names have a date-range word added to them |
| SV-8983 | OBSOLETE | 2026-08-09T22:42:33 | 1 | Sales Rep Assignments spreadsheet does not start with the UTF-8 marker |
| SV-8987 | OBSOLETE | 2026-08-09T22:42:35 | 1 | Work In Progress: the Last Activity column is left-aligned where the description |
| SV-8988 | OBSOLETE | 2026-08-09T22:42:38 | 1 | Work In Progress: the Estimates figure in the summary strip is not shown in a mu |
| SV-8989 | OBSOLETE | 2026-08-09T22:42:41 | 1 | Work In Progress: Inv. Hrs shows two decimal places where the description asks f |
| SV-8991 | OBSOLETE | 2026-08-09T22:42:44 | 2 | Sales By Customer drops the Totals line entirely when nothing matches, on screen |
| SV-8999 | OBSOLETE | 2026-08-09T22:42:46 | 4 | Sales By Representative and Sales By Customer show Inv. Hrs as 0.0 on every row, |
| SV-9001 | OBSOLETE | 2026-08-09T22:42:42 | 1 | Sales By Representative summary rows merge the four leading columns instead of l |
