# OUT OF V1 / STILL OPEN — everything the two documents place outside this release or leave undecided, and whether any of our cases assert it anyway — 2026-08-10

**The question this document answers, for every item:** *does any of our 282 active cases (114 Filters +
168 Schedule) assert this as though it were V1 behaviour?*

**Method — stated so the "NO" answers are worth something.** Each row was checked by **string-searching all
295 Filters case bodies and 195 Schedule case bodies** (active and retired), not by memory and not by
sampling. Where the search needed judgement — a word like *vertical* that has an innocent meaning — the
hits were **opened and read individually**, and that is said in the row.

---

## THE ANSWER, UP FRONT

> **Schedule: ZERO of our 168 cases assert anything the design review places outside V1.** Every
> out-of-scope and Founder-Mode item has no counterpart in our suite. That is a genuinely clean result and
> I checked it rather than assumed it.
>
> **Filters: this is where the problem is — and it is not "out of V1", it is "out of this epic entirely".**
> **One case, `FLT-RPTS-01` = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909), asserts
> working filter buttons on THIRTEEN report surfaces that engineering has forbidden, deferred, or left
> open.** It is the only case in either suite with this problem, and it has it thirteen times over.

---

## Part 1 — FILTERS: out of this epic's scope

### 1.1 The four reports another epic owns — FORBIDDEN to this branch

> **Handover §8, verbatim:** *"**SV-8582 "Reporting Suite" overlap:** separate epic/branch
> (`project/reports-suite-bravo`, owner Chris Ward) rebuilds 6 reports with its own filter chassis.
> **Do not migrate** `TechnicianEfficiency`, `Sales`, `ServiceAdvisorAnalysis`, `WorkInProgress` —
> coordinate first."*

| Report | Do we assert it? | Where |
|---|---|---|
| Technician Efficiency | **YES** ⚠️ | C38909 step 4 / expected 4 — *"Technician Efficiency shows three filter buttons: Customer, Technician and Date — the same three on both of its view tabs"* |
| Sales | **YES** ⚠️ | C38909 step 3 / expected 3 — *"Sales shows two filter buttons: Customer and Date"* |
| Advisor Analysis (`ServiceAdvisorAnalysis`) | **YES** ⚠️ | C38909 step 5 / expected 5 — *"Advisor Analysis shows three filter buttons: Customer, Date and Advisor"* |
| Work in Progress | **YES** ⚠️ | C38909 step 7 / expected 7 — *"Work in Progress shows three filter buttons: Status, Date and Customer"* |

**This is the cross-project boundary the QA lead named in the brief**, and our Filters case is on the wrong
side of it four times. **The reverse direction — whether any Report Suite case asserts Filters-epic
behaviour — was NOT checked**: it is outside this pass's scope and another worker is live in
`build/report-suite/chris-answers-2026-08-10/`. Carried as `QUESTIONS.md` **QA-3**.

### 1.2 The six aging reports — deferred pending the PM, NOT migrated

> **Handover §8, verbatim:** *"**As-of-date reports (A/R & A/P Aging ×5–6):** single point-in-time "As Of
> Date", **no chip type yet**. **Deferred pending PM** — build a small **single-date chip** (recommended…)
> vs keep the existing control. **NOT migrated.**"*

**We assert all six, plus a toolbar detail:** C38909 steps 10–11, expected 10–15, and expected **20**
(*"Each of the six A/R and A/P aging reports also shows a print icon in its toolbar"*).

**And a seventh exposure that is easy to miss:** `FLT-RPTS-22` =
[C38911](https://shopview.testrail.io/index.php?/cases/view/38911) uses **A/R Aging Detail as its worked
example** (*"for example A/R Aging Detail (Location, Transaction Type)"*) — so the case cannot be run at
all on this branch.

**Note the shape of the deferral, because it changes what the case should eventually say:** the open
decision is between a **new single-date chip** and **keeping the existing control**. Under the second
option these reports would keep controls that are **not filter chips at all** — so C38909's assertion that
they show *"filter buttons"* could be wrong even after the reports are dealt with.

### 1.3 Nav-orphan reports — a reachability call comes first

> **Handover §8, verbatim:** *"**Nav-orphan / hidden reports** (CustomerTransactions, VendorTransactions,
> **SalesFollowUp**, **PayrollTimesheet**, Inventory-report): reachability/priority call before migrating."*

| Report | Do we assert it? |
|---|---|
| Sales Follow Up | **YES** ⚠️ — C38909 step 8 / expected 8 |
| Payroll Timesheet | **AMBIGUOUS** ⚠️ — C38909 step 2 says *"the Timesheets (Payroll Timesheet) report"*. The rollout contains **"My Timesheets"**; the orphan list contains **"PayrollTimesheet"**. **Our case's own label names both, so we cannot tell which report it means** — and neither can a tester. |
| CustomerTransactions · VendorTransactions · Inventory-report | **NO** — searched, zero hits in any case body |

**The Payroll Timesheet ambiguity is worth more than it looks.** If it means My Timesheets, the case is in
scope and should be run; if it means Payroll Timesheet, it is a nav-orphan nobody has decided on. **Same
sentence, opposite instructions to the tester.**

### 1.4 No-date reports — would need new backend work

> **Handover §8, verbatim:** *"**No-date reports** (IBS Batch, QuickBooks Unexported): no date dimension
> server-side; would only get shell + page-search + persistence, **or need new BE work**."*

**We assert both, in detail:** C38909 step 14 / expected 18 (*"IBS Batch Transactions shows three filter
buttons: Customer, **Date** and Status"*) and step 15 / expected 19 (*"QB Unexported shows three filter
buttons and the first one changes with the tab: Customer, **Date** and Type…"*).

**Both of our assertions include a Date filter on a report engineering says has no date dimension at all.**
That is not a scheduling difference — it is an assertion that the backend cannot satisfy without new work.

### 1.5 Reachable-but-unbuilt: the mobile `required` semantics

> **Handover §8, verbatim:** *"**Iteration-1 mobile-sheet gap:** mobile sheets register the preset panel but
> **don't implement the `required`/reset-to-default clear semantics** — safe today (only WorkOrders uses
> mobile sheets, no required filter there), but lift the substitution into a shared helper **before any
> `required` filter lands on a mobile-sheet page**."*

**Do we assert it? NO — and it is currently unreachable.** Our eight phone cases (`FLT-MOB-01`…`07`, `10`
= C29621–C29627, C29630) all concern the Work Orders chips and the Apply button; **none involves a required
or date filter.**

**WATCH ITEM.** The moment any Reports page gains mobile sheets this becomes live, because **every report
date chip is `required: true`** (F-06b). Whoever picks that up should test "Clear selection" on a mobile
date chip **first**.

### 1.6 Sort in the URL — a deliberate absence

> **Handover §4, verbatim:** *"Sort — **Server pref only (personal), not URL** — decision 2026-07-29."*

**Do we assert it? NO.** No case asserts sort state in the URL, in either direction. **Correctly left
alone:** the spec is silent on sort, so a "sort must not appear in the URL" case would rest on an
engineering decision alone — the thing Rule 57 forbids. **Recorded so the absence is visibly deliberate
rather than accidental (Rule 46).**

---

## Part 2 — SCHEDULE: out of V1

### 2.1 Explicitly out of scope or Founder Mode

| # | Item | Scope column, verbatim | Do we assert it? |
|---|---|---|---|
| **E1** | Hover pill on work order cards | *"**Out of Scope** / Done in foundermode FS"* | **NO.** 16 cases contain *hover*; all were read. Every tooltip case (`SCH-TIP-01`…`05` = C30034–C30038) is a **grid block** tooltip under §4.13. **No case asserts a hover summary on a sidebar work-order card.** |
| **E13** | Visual indicator for explicitly assigned lines | *"Will be done in Foundermode FS"* | **NO.** No case distinguishes explicitly-assigned lines from lead-tech-implied ones. |
| **E14** | Single tech selector + "Add Tech" on WO lines | *"Will be done in Foundermode FS"* | **NO.** Our cases follow §4.3's *"There is no technician cap and no swap flow"*. |
| **E16** | Vertical orientation for Day View | *"**Fast-follow, not part of this v1 release** (unless we can fit it)"* | **NO.** Three cases contain *vertical* — C30003 (headers stick during **vertical scroll**), C30006 (the **vertical now line**), C30088 (scrolling **vertically**). All three opened and read; **none asserts an orientation choice.** |

### 2.2 In scope but undecided — cannot be authored

| # | Item | Why not authorable | Do we assert it? |
|---|---|---|---|
| **E6** | User-level "always schedule whole WO" preference | The document's own scope signal: *"**Open question** — decide before V1"*, and *"both Fabian and Sasha are resistant to an org-level settings toggle"* | **NO** |
| **E7** | Rename "Carryover" | *"Rename to **"Add a Day" or "Extend a Day"** — **final wording to be confirmed**"*. Authoring would pin a label that does not exist — Rule 9 forbids it | **NO** |
| **E15** | Restore the carryover button | Ships with E7's undecided name; **`carryover` appears zero times in spec v23/v24/v25/live and zero times in our 195 bodies** | **NO** |
| **E8** | Multi-day carryover extends by one day only | Depends entirely on E15 existing | **NO** |
| **E3 / E4** | Whole-WO default action · "Schedule by Line" secondary view | *"scope TBC"* on both, and **E3's premise contradicts §4.3's *"pinned at the top, visually distinct"*** | **Not as new behaviour** — but **four existing cases would have to be re-derived if they ship**: C29963, C29964, C29965, C29967 |
| **E9** | Drag a shift to the next day in week view | *"scope TBC"*; §7 covers only **technician-to-technician** drags, §4.10's day-moves are **events** | **NO — a genuine gap.** Proposed as `SCH-DND-11` |
| **E12** | Persist view options per user | *"scope TBC"*; §9 states defaults but not persistence, and §5.3's only persistence sentence is about the **panel**, not view options | **NO — a genuine gap.** Proposed as `SCH-VIEW-NEW-1` |
| **B4** | "Add Existing Work Order" button | *"Needs confirmation with Bronco as to whether it was **dropped in build or never scoped**"*; **zero occurrences in every spec version and in our suite**; Jira **Blocked** | **NO** |

### 2.3 The one Schedule item that is in V1 and contradicts the spec

**E11 — constrain the schedule width to business hours + buffer. In Scope: Yes.** Against §4.8's *"The full
24-hour timeline remains intact and scrollable."*

**Do we assert it? We assert the OPPOSITE, deliberately and correctly** —
`SCH-DAY-01` = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) `expected` 4: *"it
**remains a full 24-hour scrollable timeline (midnight to midnight)**."*

**The case is not changed.** The spec was edited on **7 August, two days after the review**, and still says
the full 24 hours. Full reasoning in `BRANKO-SHEET-RECHECK.md` S2-Q8.

---

## Part 3 — the exposure, counted

| Suite | Cases asserting an out-of-scope / undecided item as V1 behaviour |
|---|---|
| **Schedule (168 active)** | **0** |
| **Filters (114 active)** | **2** — `FLT-RPTS-01` = C38909 (thirteen surfaces) and `FLT-RPTS-22` = C38911 (its worked example) |

**Both Filters cases already carry `AUTOMATION: HOLD`**, so **neither is in the ready-to-automate figure**
and no automation is being written against them. **That limits the damage and does not remove it:** they
are live cases in a live suite, and their tester-facing notes say *"Not built yet… mark this test
BLOCKED"* when the truthful instruction for thirteen of those surfaces is **"this report is not in this
piece of work at all."**

**A tester following the current note would log thirteen BLOCKED results and wait for a build that is never
coming.**

---

## What is proposed about it

**Nothing has been changed.** All of it is staged in `PROPOSED-CHANGES.md` — principally **P-01**, which
rewrites `FLT-RPTS-01` = C38909 down to the surfaces this epic actually covers and moves the rest into a
named, dated, quoted deferral note rather than deleting the knowledge.

**Deletion is deliberately NOT proposed.** Those reports will get filter bars eventually — under SV-8582 for
four of them, and under a PM decision for the aging six — and **`delete_case` is irreversible**. The
coverage should be **scoped and dated**, not thrown away.
