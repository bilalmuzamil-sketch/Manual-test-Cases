# Filters — the expected-behaviour audit, 5 August 2026

**Why this document exists.** The QA lead read case **FLT-BAR-01 = C29557** and found that its
expected result had been rewritten to describe **what the build does** instead of **what the
specification requires**. His words:

> *"The expected behaviors are NOT the ones 'how the build is behaving'. Expected behaviors are the
> ones which are either in PRD-Confluence/Epic Stories/Verified in the Answer sheets by the PO. From
> the Build we are JUST doing the VIU and the processes attached to that VIU process. I am shocked to
> see that how come you considered the Build behavior as the expected behavior?"*

He is right. This is the audit of **all 110** Filters cases against that single question, written and
committed **before** any repair, so the evidence stands on its own.

**The rule being applied.** Expected behaviour comes only from **(a)** the PRD on Confluence,
**(b)** the epic's stories, **(c)** the PO's verified answers. From the build we take only the exact
on-screen labels (Standing Rule 9) and the pass/fail verdict (Rules 10, 12, 13). **A closed ticket
does not change the expected behaviour** — closing a ticket is a decision about whether to fix, not a
change to the specification.

## Sources this audit was judged against

| Source | Identifier | Version | Verdict |
|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 18**, 2026-08-04T18:19:21Z, Branko Cicovic | **CURRENT** — our committed mirror is **byte-identical** to the live storage body (56983 bytes, same md5), so currency is proven by content and not by trusting a version number |
| Requirements extracted | 132 anchors (104 `Sn-Rn`, 28 `Sn-Nn`/`Sn-En`) | from the live v18 body | complete |
| Epic | **SV-8785** | **20 children**, counted two ways (`parent=` and `"Epic Link"=`), sets equal both directions, `isLast=true` | **CURRENT** |
| PO answers | `build/filters/branko-answers-2026-08-04/answers-ingested.md` and SV-8825 | newest PO input | **CURRENT** |
| Test cases | TestRail group **4110** | 110 cases, all `created_by=3`, no foreign case | **CURRENT** |

**The in-body trap, confirmed again:** the specification page's own body still reads *"Version: 1.6"*
while the Confluence page version is **18**. Every one of the 110 provenance lines currently says
*"specification version 1.6"*. That is wrong and is repaired in the same pass.

## The result in one table

| Class | What it means | Count |
|---|---|---|
| **A — BUILD-DERIVED EXPECTATION** | the case waives a documented requirement and tells the tester the build's contradicting behaviour is intended | **5** |
| **B — BUILD-DERIVED, SPEC SILENT** | the case describes the build and no source says anything | **0** |
| **C — LEGITIMATE** | the assertion is documented; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept | **104** |
| **D — UNSOURCED ASSERTION** | our case over-specified beyond any source; the repair is removal or scope-conditional wording | **1** |
| | **TOTAL** | **110** |

**Separately — 8 cases carry a provenance line that is false in a different way.** The eight
Parts/Reports cases (C38904–C38911) assert design-and-PO-sourced behaviour correctly (so they are
class C), but their provenance line opens *"This is the expected behaviour as per the build tested on
8/5/2026"* **for a feature that is not in the product at all**. Naming the build as the source of an
expectation for something that does not exist is the same error in miniature, and it is repaired.

---

## The distinction that decides every row

Two note styles appear in this suite and they are **opposites**. Telling them apart is the whole
audit.

**THE WRONG ONE — 5 cases.** It waives the requirement and instructs the tester to stay quiet:

> *"Known and accepted: … The product behaves this way **on purpose for now. Do not raise this as a
> new problem.**"*

Nothing supports *"on purpose"*. No PO said it. The specification says the opposite. The tickets were
closed as a triage decision, not a specification change. And the last sentence actively suppresses a
genuine spec violation.

**THE RIGHT ONE — 9 cases.** It keeps the requirement and flags the deviation:

> *"Known issue: … Until it is fixed **this test is expected to fail on that point** — it is already
> reported. **Ticket:** https://shopview.atlassian.net/browse/SV-88xx"*

These are correct and they stay: C29613, C29616, C29618, C29619, C29620, C29624, C29628, C29630,
C29633, C29634.

---

## Class A — the five cases that must be restored

Every one quotes **both texts side by side** (Standing Rule 45(e)).


### FLT-BAR-01 = C29557 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/29557)

**Title:** Filter bar is shown below the tab row on the Work Orders page

**The offending text, quoted verbatim from the live case:**

> *Known and accepted: on the build tested the filter buttons sit on the same row as the tabs instead of on their own row below them. The product behaves this way on purpose for now. Do not raise this as a new problem.*

**The governing requirement, quoted verbatim from live Confluence page 572030978 version 18:**

> **S1-R1:** *"The filter bar is displayed below the tab navigation row (All, Estimates, Completed, My Work Orders) by default"*

**Is the specification silent?** No. The specification is NOT silent. S1-R1 states the position of the bar in plain terms, and the Claude design shows the chips on their own row below the tabs. Ahtasham raised the same objection independently as SV-8876 today.

**Assessment:** The case's numbered expected results 1 and 2 are correct and match S1-R1. The defect is the paragraph beneath them.

**Classification: A — BUILD-DERIVED EXPECTATION.** The waiver paragraph is deleted. The documented requirement is restored in full. The case becomes a deviation carrying **SV-8843**, and because that ticket is closed without a fix the marker qualifies it so no tester waits for one.


### FLT-COLL-02 = C29602 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/29602)

**Title:** Expanding the filter bar brings it back with active filters still shown

**The offending text, quoted verbatim from the live case:**

> *Known and accepted: on the build tested collapsing the bar does not move the table up, because the buttons share the tab row. The product behaves this way on purpose for now. Do not raise this as a new problem.*

**The governing requirement, quoted verbatim from live Confluence page 572030978 version 18:**

> **S1-R5:** *"When the user collapses the filter bar, the bar is hidden and the table expands to use the reclaimed vertical space"*

>
> **S1-R6:** *"When the user expands the filter bar, the bar reappears in its previous state (with any active filters still shown)"*

**Is the specification silent?** No. The specification is NOT silent. S1-R5 says the table expands to use the reclaimed space. If the bar shares the tab row, no space is reclaimed - that is the defect, not the requirement.

**Assessment:** Expected results 1-3 match S1-R6. The waiver paragraph contradicts S1-R5, which is the requirement the collapse behaviour is judged against.

**Classification: A — BUILD-DERIVED EXPECTATION.** The waiver paragraph is deleted. The documented requirement is restored in full. The case becomes a deviation carrying **SV-8843**, and because that ticket is closed without a fix the marker qualifies it so no tester waits for one.


### FLT-EMPTY-01 = C29606 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/29606)

**Title:** A filter combination with no matches shows a no-results empty state

**The offending text, quoted verbatim from the live case:**

> *Known and accepted: when only a search is active the message still says "filters" and the only link offered is Clear Filters. The product behaves this way on purpose for now. Do not raise this as a new problem.*

**The governing requirement, quoted verbatim from live Confluence page 572030978 version 18:**

> **S8-R3:** *"When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"*

**Is the specification silent?** No. The specification is NOT silent, and it is explicit: the message must indicate no results 'for the current filters and search'.

**Assessment:** Expected results 1-3 match S8-R3 only partly: S8-R3 requires the message to name BOTH filters AND search. The waiver paragraph then declares the build's filters-only message intended.

**Classification: A — BUILD-DERIVED EXPECTATION.** The waiver paragraph is deleted. The documented requirement is restored in full. The case becomes a deviation carrying **SV-8847**, and because that ticket is closed without a fix the marker qualifies it so no tester waits for one.


### FLT-EMPTY-02 = C29607 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/29607)

**Title:** The filtered empty state offers a way to clear the filters

**The offending text, quoted verbatim from the live case:**

> *Known and accepted: the empty screen offers no way to clear the search on its own. The product behaves this way on purpose for now. Do not raise this as a new problem.*

**The governing requirement, quoted verbatim from live Confluence page 572030978 version 18:**

> **S8-R4:** *"The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"*

>
> **S8-R5:** *"Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"*

**Is the specification silent?** No. The specification is NOT silent and it is explicit twice over: S8-R4 requires a prompt 'to clear filters and, where a search query is active, to clear the query', and S8-R5 requires each to be cleared independently.

**Assessment:** Expected results 1-3 match S8-R4's filter half. The waiver paragraph declares the missing search-clear intended - which is the exact half of S8-R4 it omits.

**Classification: A — BUILD-DERIVED EXPECTATION.** The waiver paragraph is deleted. The documented requirement is restored in full. The case becomes a deviation carrying **SV-8847**, and because that ticket is closed without a fix the marker qualifies it so no tester waits for one.


### FLT-PSRCH-09 = C38899 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/38899)

**Title:** The list narrows shortly after you stop typing, with no button to press

**The offending text, quoted verbatim from the live case:**

> *Known and accepted: the empty screen offers no way to clear the search on its own. The product behaves this way on purpose for now. Do not raise this as a new problem.*

**The governing requirement, quoted verbatim from live Confluence page 572030978 version 18:**

> **S8-R4:** *"The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"*

>
> **S8-R5:** *"Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"*

>
> **S13-R7** (what this case actually tests): *"The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required. Inventory uses 350ms because of its load characteristics. Any other table needing a longer interval must be listed here rather than deviating silently"*

**Is the specification silent?** No. The specification is NOT silent on the waived point (S8-R4/S8-R5), and the waived point is not this case's subject at all. The paragraph is simply removed - there is nothing here to restore, because this case never had a defect.

**Assessment:** This is the worst of the five: the waiver paragraph is about the empty screen's search-clear link, which is NOT what this case tests. This case tests the 300ms debounce (S13-R7) and in-place results (S13-R12). The paragraph was pasted onto a case it has nothing to do with.

**Classification: A — BUILD-DERIVED EXPECTATION.** The waiver paragraph is deleted. The documented requirement is restored in full. The case becomes a deviation carrying **SV-8847**, and because that ticket is closed without a fix the marker qualifies it so no tester waits for one.


### Who closed SV-8843 and SV-8847, and why that matters

Read live from Jira this pass, not taken from any earlier note:

| Ticket | Closed | By | Resolution |
|---|---|---|---|
| **SV-8843** *"Filter bar sits on the same row as the tabs, so collapsing it frees no space"* | 2026-08-04T21:41:31-0500 | **Bilal Muzamil** | OBSOLETE / Done |
| **SV-8847** *"When only a page search is active the empty screen offers Clear Filters, which does not help"* | 2026-08-04T22:02:41-0500 | **Bilal Muzamil** | OBSOLETE / Done |

Both were closed **under the QA lead's own account** — which is also our account, so the changelog
cannot tell the two apart (this is the Standing Rule 53 corollary). Either way, **closing a ticket is
a triage decision about whether to fix it. It is not an amendment to the specification.** The cases
keep the specification's expectation and report the failure.

**An outsider found this before we did.** **[SV-8876](https://shopview.atlassian.net/browse/SV-8876)**
— raised by **Ahtasham Amjad at 2026-08-05T06:17:01-0500**, status Ready — says exactly what the QA
lead said, and names our case:

> *"There's a mismatch between the PRD, the design, and the build on where the filter bar sits, and a
> test case has waived it without the PRD being updated. … PRD S1-R1 (v1.6, current): 'The filter bar
> is displayed below the tab navigation row … by default.' … Test case C29557 / T1762290: carries a
> note — 'Known and accepted: on the build tested the filter buttons sit on the same row as the tabs…'"*

That is a Standing Rule 45(d) external signal and it was **correct**. His ticket is not touched
(Rule 38); it is a clarification request for Branko, and it is the right vehicle.

---

## Class D — the one over-specified case


### FLT-RPTS-23 = C38882 — [open in TestRail](https://shopview.testrail.io/index.php?/cases/view/38882)

**The offending text, quoted verbatim:**

> *"1. The panel that opens offers a set of ready-made periods to choose from - **on the build tested
> these are Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last
> quarter, This year, Last year** - plus a Custom option and a Clear Selection link. The exact set of
> ready-made periods may differ per report, so check the ones your report offers rather than expecting
> this list."*

**The governing text, quoted verbatim from live Confluence page 572030978 version 18 (§4 Key Decisions):**

> *"New date-range filter type: Date chips open a picker offering **standard predefined ranges** plus a
> custom start/end range, pre-populated with the application's current default range for that
> report/page. A predefined range applies on selection; a custom range applies when the second date is
> picked. Used across Reports and the date columns on Parts views."*

**Is the specification silent?** Partly. It **documents the behaviour** (pre-populated default, preset
applies on selection, custom applies on the second date) — so expected results 2 to 6 are properly
sourced and stay. It **deliberately does not enumerate the periods**, saying only *"standard predefined
ranges"*.

**Assessment:** the ten-period list is a build observation. It is already hedged with *"may differ per
report … rather than expecting this list"*, so it was never asserted as a requirement — which is why
this is **D and not A**. Still, a list of build values inside an expected result invites a tester to
treat it as the expectation.

**Classification: D — UNSOURCED ASSERTION.** The enumeration is moved out of the expected result and
kept as clearly-labelled orientation, and the assertion becomes scope-conditional (Standing Rule 42):
the panel offers a set of standard ready-made periods plus Custom and Clear Selection, and the
specification does not fix which.


---

## The eight false provenance lines

These eight assert design-and-PO-sourced behaviour correctly, so their **assertions are class C**. The
fault is the provenance line, which names the build as the source of an expectation for a feature that
**is not in the product**:

> *"This is the expected behaviour as per the build tested on 8/5/2026 (ShopView v3.4.2-d00239b on the
> Filters QA branch) and epic SV-8785."*

…on a case whose own body says *"Not built yet on the build tested"*. The build cannot be the source of
an expectation it does not implement. Repaired to name the design and Branko's answers as the source,
and to state separately that the feature was looked for on the build and not found.

| Case | C-id | Link |
|---|---|---|
| FLT-PARTS-01 | C38904 | https://shopview.testrail.io/index.php?/cases/view/38904 |
| FLT-PARTS-09 | C38905 | https://shopview.testrail.io/index.php?/cases/view/38905 |
| FLT-PARTS-11 | C38906 | https://shopview.testrail.io/index.php?/cases/view/38906 |
| FLT-PARTS-12 | C38907 | https://shopview.testrail.io/index.php?/cases/view/38907 |
| FLT-PARTS-13 | C38908 | https://shopview.testrail.io/index.php?/cases/view/38908 |
| FLT-RPTS-01 | C38909 | https://shopview.testrail.io/index.php?/cases/view/38909 |
| FLT-RPTS-21 | C38910 | https://shopview.testrail.io/index.php?/cases/view/38910 |
| FLT-RPTS-22 | C38911 | https://shopview.testrail.io/index.php?/cases/view/38911 |

---

## How the search for the pattern was run

Not by checking the five cases the QA lead named. Two independent exhaustive sweeps over **all 110**
live expected-result texts:

**Sweep 1 — 24 waiver phrases** over the whole expected result: `known and accepted`,
`accepted behaviour`, `this is accepted`, `current behaviour`, `the build currently`, `as built`,
`on the build tested`, `by design`, `on purpose`, `do not raise`, `will not be fixed`,
`not a (new) problem`, `closed as`, `known issue`, `not reproducible`, `behaves this way`,
`is expected`, `treat as`, `don't raise`, `no longer`, `accepted as`. **30 of 110 matched.**

**Sweep 2 — 13 observation phrases** over the **assertion body only** (above the provenance
separator), which is where an expectation actually lives: `on the build`, `in this build`,
`currently`, `at present`, `for now`, `we saw`, `observed`, `as it works/behaves now/today`,
`the app does/shows`, `in practice`, `today the`, `the product behaves/does`, `waive`, `accepted`.
**21 of 110 matched.**

Every match was then read in full and judged against the live requirement. The false positives were
ordinary English and are listed openly rather than quietly dropped:

| Case | The match | Why it is not a finding |
|---|---|---|
| C29561, C29569, C29578, C29585 | *"no longer listed"*, *"no longer restricts the table"* | ordinary English for a filter taking effect; matches S2-R3 / S3-R6 / S4-R4 / S5-R4 |
| C29565, C29573 | *"The app does not show an error"* | a documented no-error requirement (S2-N3, S3-N1), not an observation |
| C29590, C29591 | *"asset is currently on site"*, *"the currently selected value"* | *currently* describes the asset's state and the chip's value, per S6-R2 / S6-R3 |
| C38876 | *"order and default are different on purpose"* | sourced: Branko answered **Q2 = "A - Yes, Estimates first is fine"** on 4 August, plus tech-plan D10 |
| C38889 | *"no longer stretches full-width"* | sourced to S13-R18 (CTA hug width) and S13-R19 (2+ icon actions collapse to a kebab) |
| C29613, C29616, C29618, C29619, C29620, C29628, C29630, C29633, C29634 | *"on the build tested … expected to fail … Ticket: …"* | the **correct** pattern — requirement kept, deviation flagged with its ticket |

---

## All 110 rows

`Class` is A / B / C / D. `Anchor + requirement text` is quoted verbatim from live Confluence page
572030978 version 18. Where a case is anchored to prose rather than a numbered requirement, that is
stated — those ten are honest about it in their own `refs`.


### FLT-BAR-01 = C29557 — **class A** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29557)
*Filter Bar Layout and Visibility* · Filter bar is shown below the tab row on the Work Orders page
- **S1-R1** *(spec v18)*: "The filter bar is displayed below the tab navigation row (All, Estimates, Completed, My Work Orders) by default"
- **Expected result asserts:** 1. A filter bar is visible directly below the tab row and above the work order table. 2. The filter bar is shown by default (expanded) without having to turn anything on. Known and accepted: on the build tested the filter buttons sit on the same row as the tabs instead of on their own row below them. The product behaves this way on purpose for now. Do not raise this as a new problem.
- **Verdict:** **RESTORE** — waives a documented requirement (see the Class A section above).

### FLT-BAR-02 = C29558 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29558)
*Filter Bar Layout and Visibility* · Five filter chips appear in a fixed order with an icon, name and arrow
- **S1-R2** *(spec v18)*: "The filter bar contains five filter chips in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site"
- **S1-R3** *(spec v18)*: "Each chip displays the filter name and a chevron icon indicating it opens a dropdown"
- **Expected result asserts:** 1. Exactly five filter chips appear, in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site. 2. Each chip shows the filter name and a down arrow (chevron) indicating it opens a dropdown. 3. Each chip shows only the filter name and the arrow - there is no picture icon in front of the name.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-BAR-03 = C29559 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29559)
*Filter Bar Layout and Visibility* · The filter bar still shows the other four chips on the Estimates tab
- **S1-N1** *(spec v18)*: "If no filters are available for the current tab (e.g., Estimates tab where Status is hidden), the filter bar still displays the remaining filter chips"
- **S9-R2** *(spec v18)*: "On the Estimates tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"
- **Expected result asserts:** 1. The filter bar is still shown - it does not disappear on this tab. 2. The Customer, Lead Technician, Service Advisor and Asset on Site chips are all displayed and usable. 3. The Status chip is not shown on this tab at all - only four chips appear.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-01 = C29560 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29560)
*Status Filter* · Status chip opens a checkbox list of all nine statuses plus Clear Selection
- **S2-R1** *(spec v18)*: "Clicking the Status chip opens a dropdown panel with a checkbox list of all possible work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined, Imported"
- **S2-R4** *(spec v18)*: "The dropdown includes a "Clear selection" action at the bottom that deselects all selected statuses and removes the filter"
- **Expected result asserts:** 1. A dropdown panel opens under the Status chip. 2. It lists all nine statuses as checkboxes, in this order: Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported. 3. All checkboxes are unticked (nothing selected yet). 4. A 'Clear Selection' action is shown at the bottom of the dropdown.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-02 = C29561 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29561)
*Status Filter* · Ticking one status filters the table immediately, with no apply button
- **S2-R2** *(spec v18)*: "The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"
- **S2-R3** *(spec v18)*: "Selected statuses are indicated with a filled checkbox"
- **S2-R6** *(spec v18)*: "The table filters in real time as the user makes selections (no confirm/apply button needed)"
- **Expected result asserts:** 1. The ticked checkbox appears filled (checked). 2. The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop. 3. Work orders in other statuses are no longer listed.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-03 = C29562 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29562)
*Status Filter* · Ticking several statuses shows work orders matching any of them
- **S2-R2** *(spec v18)*: "The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"
- **Expected result asserts:** 1. Every ticked status shows a filled checkbox. 2. The table shows work orders whose status matches ANY of the ticked statuses (both Estimate and Approved rows appear). 3. Work orders in statuses that are not ticked are hidden. 4. There is no limit on how many statuses you can tick.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-04 = C29563 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29563)
*Status Filter* · Clear Selection in the Status dropdown unticks every status
- **S2-R4** *(spec v18)*: "The dropdown includes a "Clear selection" action at the bottom that deselects all selected statuses and removes the filter"
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. All status checkboxes become unticked. 2. The Status filter is removed and the table returns to showing work orders of every status. 3. Only the Status filter is affected - any other active filters stay applied.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-05 = C29564 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29564)
*Status Filter* · Clicking outside the Status dropdown closes it and keeps the selections applied
- **S2-R5** *(spec v18)*: "Clicking outside the dropdown closes it"
- **Expected result asserts:** 1. The dropdown closes. 2. The ticked statuses stay selected - the Status chip stays in its active state showing the selection. 3. The table stays filtered by the selected statuses.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-06 = C29565 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29565)
*Status Filter* · Selecting statuses that no work order has shows the empty state
- **S2-N3** *(spec v18)*: "If no work orders match the selected statuses, the table shows an empty state (see Story 8)"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The table shows no rows. 2. An empty state is displayed saying no results were found for the current filters (see the Empty State cases for its full content). 3. The app does not show an error.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-01 = C29566 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29566)
*Customer Filter* · Customer chip opens a dropdown with a search field and a customer list
- **S3-R1** *(spec v18)*: "Clicking the Customer chip opens a dropdown panel with a search input at the top and a scrollable list of customers below"
- **Expected result asserts:** 1. A dropdown panel opens under the Customer chip. 2. A search box with the placeholder 'Search' is at the top of the panel. Click it before you type - it is not focused for you automatically. 3. Below it is a scrollable list of customer names. 4. A 'Clear Selection' action is shown at the bottom of the panel.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-02 = C29567 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29567)
*Customer Filter* · Typing in the customer search narrows the list to matching names
- **S3-R2** *(spec v18)*: "As the user types in the search field, the customer list filters to show only matching names"
- **Expected result asserts:** 1. The customer list narrows as you type, showing only names that match what you entered. 2. Customers that do not match are removed from the list. 3. Deleting the text brings the full list back.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-03 = C29568 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29568)
*Customer Filter* · Selected customers show as removable tags and as ticks in the list
- **S3-R3** *(spec v18)*: "The user can select one or more customers; each selected customer appears as a tag/chip at the top of the dropdown input area"
- **S3-R4** *(spec v18)*: "Selected customers are indicated with a checkmark in the list"
- **Expected result asserts:** 1. Each selected customer appears as a tag (small chip) with an x in the input area at the top of the dropdown. 2. Each selected customer's row in the list shows a checkmark on the right. 3. Long customer names on tags are shortened with an ellipsis (for example 'Texas Truck And Aut...'). 4. You can keep selecting as many customers as needed - there is no selection limit.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-04 = C29569 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29569)
*Customer Filter* · Clicking the x on a customer tag removes just that customer from the selection
- **S3-R5** *(spec v18)*: "The user can remove an individual selected customer by clicking the × on their tag"
- **Expected result asserts:** 1. That customer's tag disappears from the input area. 2. The checkmark next to that customer in the list is removed. 3. The other selected customers keep their tags and checkmarks. 4. The table updates to no longer include that customer's work orders.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-05 = C29570 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29570)
*Customer Filter* · The table shows only work orders belonging to any of the selected customers
- **S3-R6** *(spec v18)*: "The table updates to show only work orders belonging to any of the selected customers"
- **S2-R6** *(spec v18)*: "The table filters in real time as the user makes selections (no confirm/apply button needed)"
- **Expected result asserts:** 1. The table shows only work orders whose customer is one of the two selected customers. 2. Work orders belonging to any other customer are hidden. 3. The table updates in real time as you make the selections (no apply button on desktop).
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-06 = C29571 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29571)
*Customer Filter* · Clear Selection in the Customer dropdown removes all selected customers
- **S3-R7** *(spec v18)*: "The dropdown includes a "Clear selection" action at the bottom that removes all selected customers"
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. All customer tags are removed from the input area. 2. All checkmarks in the list are removed. 3. The Customer filter is removed and the table shows work orders of all customers again. 4. Other active filters (if any) are not affected.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-07 = C29572 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29572)
*Customer Filter* · Clicking outside the Customer dropdown closes it and the selections remain
- **S3-R8** *(spec v18)*: "Clicking outside the dropdown closes it; selected tags remain visible"
- **Expected result asserts:** 1. The dropdown closes when you click outside it. 2. The Customer chip stays in the active (blue) state showing the selection and the table stays filtered. 3. When reopened, the selected customers' tags are still visible in the input area.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-08 = C29573 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29573)
*Customer Filter* · Customer search with no matching name shows a no-results message in the list
- **S3-N1** *(spec v18)*: "If the search query returns no matching customers, the list shows a "No results" message"
- **Expected result asserts:** 1. The list shows a message saying there are no results (instead of an empty gap). 2. The app does not show an error. 3. Clearing the search text brings the customer list back.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CUST-09 = C29574 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29574)
*Customer Filter* · A customer with no work orders is still listed; picking them shows no rows
- **S3-E1** *(spec v18)*: "If a customer has no open work orders, they still appear in the filter list: filtering by them simply returns an empty result set"
- **S3-N2** *(spec v18)*: "If no work orders match the selected customers, the table shows an empty state (see Story 8)"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The customer with no work orders IS shown in the filter list (they are not hidden). 2. After selecting only that customer, the table shows no rows and the filtered empty state is displayed. 3. No error is shown.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-01 = C29575 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29575)
*Lead Technician Filter* · Lead Technician chip opens a dropdown with a search field and a list
- **S4-R1** *(spec v18)*: "Clicking the Lead Technician chip opens a dropdown panel with a search input at the top and a scrollable list of technicians below"
- **Expected result asserts:** 1. A dropdown panel opens under the Lead Technician chip. 2. A search input with the placeholder 'Search' is at the top. 3. Below it is a scrollable list of technician names. 4. A 'Clear Selection' action is shown at the bottom.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-02 = C29576 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29576)
*Lead Technician Filter* · Typing in the technician search narrows the list to matching names
- **S4-R2** *(spec v18)*: "As the user types in the search field, the technician list filters to show only matching names"
- **Expected result asserts:** 1. The technician list narrows to only the names matching what you typed. 2. Deleting the text brings the full list back.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-03 = C29577 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29577)
*Lead Technician Filter* · Selecting technicians shows only work orders where they are the lead technician
- **S4-R3** *(spec v18)*: "The user can select one or more technicians; selected technicians are indicated with a filled checkbox"
- **S4-R4** *(spec v18)*: "The table updates to show only work orders where the selected users are assigned as lead technician"
- **Expected result asserts:** 1. Selected technicians show a checkmark on the row, and as a small removable tag above the list in the list. 2. The table shows only work orders where one of the selected technicians is assigned as the LEAD technician. 3. A work order where the technician is assigned only in a non-lead role does not appear. 4. The table updates in real time as you select.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-04 = C29578 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29578)
*Lead Technician Filter* · Clear Selection in the Lead Technician dropdown removes all selected technicians
- **S4-R5** *(spec v18)*: "The dropdown includes a "Clear selection" action at the bottom"
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. All technician selections are removed (checkboxes unticked). 2. The Lead Technician filter no longer restricts the table. 3. Other active filters are not affected.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-05 = C29579 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29579)
*Lead Technician Filter* · Clicking outside the Lead Technician dropdown closes it
- **S4-R6** *(spec v18)*: "Clicking outside the dropdown closes it"
- **Expected result asserts:** 1. The dropdown closes. 2. The selection stays applied - the chip stays active and the table stays filtered.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-06 = C29580 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29580)
*Lead Technician Filter* · Selecting a technician who leads no work orders shows the empty state
- **S4-N1** *(spec v18)*: "If no work orders match the selected technicians, the table shows an empty state (see Story 8)"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The table shows no rows and the filtered empty state is displayed. 2. No error is shown.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TECH-07 = C29581 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29581)
*Lead Technician Filter* · A deactivated technician does not appear in the Lead Technician filter list
- **S4-E1** *(spec v18)*: "If a technician is no longer active, they are not shown in the filter list"
- **Expected result asserts:** 1. The deactivated technician is NOT shown in the filter list. 2. Active technicians are still listed normally.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-01 = C29582 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29582)
*Service Advisor Filter* · Service Advisor chip opens a dropdown with a search field and a list
- **S5-R1** *(spec v18)*: "Clicking the Service Advisor chip opens a dropdown panel with a search input at the top and a scrollable list of advisors below"
- **Expected result asserts:** 1. A dropdown panel opens under the Service Advisor chip. 2. A search input with the placeholder 'Search' is at the top. 3. Below it is a scrollable list of advisor names. 4. A 'Clear Selection' action is shown at the bottom.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-02 = C29583 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29583)
*Service Advisor Filter* · Typing in the advisor search narrows the list to matching names
- **S5-R2** *(spec v18)*: "As the user types, the list filters to matching names"
- **Expected result asserts:** 1. The advisor list narrows to only the names matching what you typed. 2. Deleting the text brings the full list back.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-03 = C29584 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29584)
*Service Advisor Filter* · Selecting advisors shows only work orders assigned to those advisors
- **S5-R3** *(spec v18)*: "The user can select one or more advisors; selected advisors are indicated with a filled checkbox"
- **S5-R4** *(spec v18)*: "The table updates to show only work orders assigned to the selected advisors"
- **Expected result asserts:** 1. Selected advisors show a checkmark on the row, and as a small removable tag above the list in the list. 2. The table shows only work orders assigned to any of the selected advisors. 3. The table updates in real time as you select.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-04 = C29585 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29585)
*Service Advisor Filter* · Clear Selection in the Service Advisor dropdown removes all selected advisors
- **S5-R5** *(spec v18)*: "The dropdown includes a "Clear selection" action at the bottom"
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. All advisor selections are removed. 2. The Service Advisor filter no longer restricts the table. 3. Other active filters are not affected.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-05 = C29586 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29586)
*Service Advisor Filter* · Clicking outside the Service Advisor dropdown closes it
- **S5-R6** *(spec v18)*: "Clicking outside the dropdown closes it"
- **Expected result asserts:** 1. The dropdown closes. 2. The selection stays applied - the chip stays active and the table stays filtered.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-06 = C29587 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29587)
*Service Advisor Filter* · Selecting an advisor with no assigned work orders shows the empty state
- **S5-N1** *(spec v18)*: "If no work orders match the selected advisors, the table shows an empty state (see Story 8)"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The table shows no rows and the filtered empty state is displayed. 2. No error is shown.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ADV-07 = C29588 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29588)
*Service Advisor Filter* · A deactivated advisor does not appear in the Service Advisor filter list
- **S5-E1** *(spec v18)*: "If an advisor is no longer active, they are not shown in the filter list"
- **Expected result asserts:** 1. The deactivated advisor is NOT shown in the filter list. 2. Active advisors are still listed normally.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-01 = C29589 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29589)
*Asset on Site Filter* · Asset on Site chip opens a dropdown with Yes and No plus Clear Selection
- **S6-R1** *(spec v18)*: "Clicking the Asset on Site chip opens a dropdown panel with two options: Yes and No"
- **Expected result asserts:** 1. A small dropdown panel opens under the Asset on Site chip. 2. It contains exactly two options: Yes and No. 3. A 'Clear Selection' action is shown at the bottom. 4. It is a dropdown (like the other filters), not an on/off toggle.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-02 = C29590 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29590)
*Asset on Site Filter* · Choosing Yes shows only work orders whose asset is on site
- **S6-R2** *(spec v18)*: "The user selects one option; the table updates to show only work orders matching that asset on-site status"
- **Expected result asserts:** 1. The table shows only work orders whose asset is currently on site. 2. Work orders whose asset is not on site are hidden.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-03 = C29591 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29591)
*Asset on Site Filter* · Asset on Site is single-select: choosing the other option replaces the first
- **S6-R3** *(spec v18)*: "Only one option can be selected at a time (single-select)"
- **Expected result asserts:** 1. No becomes the selected option and Yes is deselected automatically - only one option can be selected at a time. 2. The table switches to showing only the not-on-site work orders. 3. The chip shows the currently selected value.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-04 = C29592 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29592)
*Asset on Site Filter* · Clear Selection in the Asset on Site dropdown removes the filter
- **S6-R4** *(spec v18)*: "The dropdown includes a "Clear selection" action that removes the filter"
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. The selection is removed and the chip returns to its default (inactive) state. 2. The table shows work orders regardless of on-site status again. 3. Other active filters are not affected.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-05 = C29593 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29593)
*Asset on Site Filter* · Clicking outside the Asset on Site dropdown closes it
- **S6-R5** *(spec v18)*: "Clicking outside the dropdown closes it"
- **Expected result asserts:** 1. The dropdown closes. 2. The Yes selection stays applied - the chip stays active and the table stays filtered.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-06 = C29594 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29594)
*Asset on Site Filter* · An Asset on Site choice that matches no work orders shows the empty state
- **S6-N1** *(spec v18)*: "If no work orders match the selected option, the table shows an empty state (see Story 8)"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The table shows no rows and the filtered empty state is displayed. 2. No error is shown.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-01 = C29595 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29595)
*Active Filter Chips and Clear Filters* · A chip with a selected value turns blue and shows the value
- **S7-R1** *(spec v18)*: "When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)"
- **Expected result asserts:** 1. The Status chip changes to an active/highlighted look (blue pill). 2. The chip displays the selected value (for example 'Status: Estimate'). 3. The other chips stay in their default state.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-02 = C29596 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29596)
*Active Filter Chips and Clear Filters* · A chip with several values shows the first ones and shortens the rest
- **S7-R2** *(spec v18)*: "If multiple values are selected for a single filter, the chip displays the first value followed by a count of additional selections (e.g., "Status: Estimate, In progress, Approved…")"
- **Expected result asserts:** 1. The chip lists the selected values starting with the first one and shortens the label when it gets too long (the design shows 'Status: Estimate, In progress, Approved...'). 2. The chip stays a single compact pill - it does not grow to show every value in full.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-03 = C29597 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29597)
*Active Filter Chips and Clear Filters* · 'Clear Filters' shows right of the chips only when a filter is active
- **S7-R3** *(spec v18)*: "When at least one filter is active, a "Clear filters" button appears in the filter bar to the right of all chips"
- **S7-N1** *(spec v18)*: "When no filters are active, the "Clear filters" button is not shown"
- **S8-N1** *(spec v18)*: "If no filters are active, the "Clear filters" button is not visible and cannot be clicked"
- **Expected result asserts:** 1. With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click). 2. As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row. 3. When the last active filter is removed, 'Clear Filters' disappears again.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-04 = C29598 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29598)
*Active Filter Chips and Clear Filters* · 'Clear Filters' removes every active filter and resets all chips
- **S8-R1** *(spec v18)*: "Clicking "Clear filters" removes all active filter selections across all filters; all chips return to their default (inactive) state"
- **S13-R13** *(spec v18)*: "Clicking the X-circle clears the query and restores the list to its filtered-but-unsearched state. "Clear filters" (S8-R1) does not clear the search query, and clearing the search query does not clear any filters"
- **Expected result asserts:** 1. Every active filter is cleared in one click. 2. All chips return to their default (inactive) look with no values shown. 3. The table shows the full unfiltered list again (no text is in the page Search box, so nothing else is narrowing it). 4. The 'Clear Filters' link disappears.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-05 = C29599 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29599)
*Active Filter Chips and Clear Filters* · 'Clear Selection' in one dropdown clears only that filter
- **S8-R2** *(spec v18)*: "Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"
- **Expected result asserts:** 1. Only the Status filter is cleared - its chip returns to default. 2. The Customer filter stays selected and active (blue) and keeps filtering the table. 3. 'Clear Filters' remains visible because a filter is still active.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-CHIP-06 = C29600 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29600)
*Active Filter Chips and Clear Filters* · Status and Customer filters together show only work orders matching both
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. Only customer A's Estimate work order is shown. 2. Customer A's Approved work order is hidden (wrong status) and customer B's Estimate work order is hidden (wrong customer) - each additional filter narrows the result further. 3. Both chips are in the active state and 'Clear Filters' is visible.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-COLL-01 = C29601 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29601)
*Collapse and Expand* · The toolbar filter button collapses the bar and the table takes the space
- **S1-R4** *(spec v18)*: "The page toolbar contains a toggle button that collapses and expands the filter bar"
- **S1-R5** *(spec v18)*: "When the user collapses the filter bar, the bar is hidden and the table expands to use the reclaimed vertical space"
- **Expected result asserts:** 1. The filter bar row is hidden. 2. The work order table moves up and uses the reclaimed vertical space. 3. The filter icon shows a pressed/active look while the bar is collapsed.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-COLL-02 = C29602 — **class A** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29602)
*Collapse and Expand* · Expanding the filter bar brings it back with active filters still shown
- **S1-R6** *(spec v18)*: "When the user expands the filter bar, the bar reappears in its previous state (with any active filters still shown)"
- **Expected result asserts:** 1. The filter bar reappears below the tab row. 2. The previously selected filters are still shown on their chips in the active (blue) state - nothing was lost while collapsed. 3. The 'Clear Filters' link is still shown at the right end of the chip row. Known and accepted: on the build tested collapsing the bar does not move the table up, because the buttons share the tab row. The product behaves this way on purpose f…
- **Verdict:** **RESTORE** — waives a documented requirement (see the Class A section above).

### FLT-COLL-03 = C29603 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29603)
*Collapse and Expand* · The filter bar's collapsed or expanded state is remembered on return
- **S1-R7** *(spec v18)*: "The collapsed/expanded state of the filter bar persists across navigation"
- **S10-R1** *(spec v18)*: "When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left"
- **Expected result asserts:** 1. After step 2 the filter bar is still collapsed (your choice was remembered). 2. After step 4 the filter bar is expanded again when you return - whichever state you left it in is restored.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-COLL-04 = C29604 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29604)
*Collapse and Expand* · Collapsed filter button shows a blue indicator only when filters are active
- **S7-R4** *(spec v18)*: "When the filter bar is collapsed and at least one filter is active, the toolbar collapse/expand toggle displays a visual indicator (e.g., filters icon in primary blue color) signalling that active filters are in effect"
- **S7-N2** *(spec v18)*: "When no filters are active and the bar is collapsed, the toolbar toggle shows no indicator"
- **Expected result asserts:** 1. After step 1 the filter icon shows no special indicator (only its normal pressed look). 2. After step 3 the filter icon shows a visual indicator (filters icon in primary blue) signalling that active filters are in effect while the bar is hidden.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-COLL-05 = C29605 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29605)
*Collapse and Expand* · Active filters keep filtering the table while the filter bar is collapsed
- **S7-R5** *(spec v18)*: "When the filter bar is collapsed with active filters, the table continues to apply all active filters"
- **Expected result asserts:** 1. The table content does not change when the bar collapses - it still shows only the work orders matching the active filters. 2. Hiding the bar only hides the chips; it does not remove or pause the filtering.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-EMPTY-01 = C29606 — **class A** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29606)
*Empty State* · A filter combination with no matches shows a no-results empty state
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The table body is replaced by an empty state (not just a bare empty grid). 2. The empty state shows a message indicating no results were found for the current filters. 3. No error message or broken layout appears. Known and accepted: when only a search is active the message still says "filters" and the only link offered is Clear Filters. The product behaves this way on purpose for now. Do not raise this as a new p…
- **Verdict:** **RESTORE** — waives a documented requirement (see the Class A section above).

### FLT-EMPTY-02 = C29607 — **class A** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29607)
*Empty State* · The filtered empty state offers a way to clear the filters
- **S8-R4** *(spec v18)*: "The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"
- **S8-R5** *(spec v18)*: "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"
- **Expected result asserts:** 1. The empty state includes a prompt or link to clear the filters. 2. Clicking it removes the active filters and the full work order list is shown again (with no text in the Search box, nothing else is narrowing the list). 3. The chips return to their default state. Known and accepted: the empty screen offers no way to clear the search on its own. The product behaves this way on purpose for now. Do not raise this as …
- **Verdict:** **RESTORE** — waives a documented requirement (see the Class A section above).

### FLT-TAB-01 = C29608 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29608)
*Tab Behaviour* · The All tab shows all five filter chips, all working
- **S9-R1** *(spec v18)*: "On the All tab, all five filters (Status, Customer, Lead Technician, Service Advisor, Asset on Site) are shown and active"
- **Expected result asserts:** 1. All five chips are shown: Status, Customer, Lead Technician, Service Advisor, Asset on Site. 2. Each chip opens its dropdown and can be used.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TAB-02 = C29609 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29609)
*Tab Behaviour* · Estimates tab: the Status chip is not shown; the other four still work
- **S9-R2** *(spec v18)*: "On the Estimates tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"
- **S2-N1** *(spec v18)*: "On the Estimates tab, the Status filter chip is not shown: that tab already pre-filters by the Estimate status"
- **Expected result asserts:** 1. The Status chip is not shown on this tab at all - only four chips appear. The tab already pre-filters the list to Estimate. 2. Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable. 3. After step 4 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TAB-03 = C29610 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29610)
*Tab Behaviour* · Completed tab: the Status chip is not shown; the other four still work
- **S9-R3** *(spec v18)*: "On the Completed tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Completed pre-filter"
- **S2-N2** *(spec v18)*: "On the Completed tab, the Status filter chip is not shown: that tab already pre-filters by the Complete status"
- **Expected result asserts:** 1. The Status chip is not shown on this tab at all - only four chips appear. The tab already pre-filters the list to Complete. 2. Customer, Lead Technician, Service Advisor and Asset on Site chips are shown and usable. 3. After step 4 the table shows only that customer's COMPLETE work orders.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TAB-04 = C29611 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29611)
*Tab Behaviour* · My Work Orders tab shows all five filters and they narrow that list
- **S9-R4** *(spec v18)*: "On the My Work Orders tab, all five filters are shown; the table already scopes results to work orders assigned to the logged-in user, and the filters apply on top of that scope"
- **Expected result asserts:** 1. All five filter chips are shown on the My Work Orders tab. 2. The table only ever shows work orders assigned to you (the tab's own scope stays). 3. After step 2 it shows only YOUR work orders in the ticked status - the filters narrow the user-scoped list, they do not widen it to other users' work orders.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TAB-05 = C29612 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29612)
*Tab Behaviour* · A Status choice is kept while you switch tabs and comes back on the All tab
- **S9-R5** *(spec v18)*: "Filter selections are maintained when switching between tabs; selections that are incompatible with a tab (e.g., a Status selection on the Estimates tab) are not applied but are retained in memory so they reappear if the user switches back to the All tab"
- **S9-N1** *(spec v18)*: "A Status selection made on the All tab does not carry over visually to the Estimates or Completed tabs, but is not lost"
- **S9-R2** *(spec v18)*: "On the Estimates tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"
- **Expected result asserts:** 1. On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is not shown on that tab. The Customer selection is still shown and still filters the list. 2. Back on the All tab the Status chip reappears with the SAME selection (Approved) still applied - the selection was retained in memory, not lost. 3. The Customer selection is unchanged throughout.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-01 = C29613 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29613)
*Persistence* · Leaving the page and coming back restores the filters and the bar state
- **S10-R1** *(spec v18)*: "When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left"
- **S1-R7** *(spec v18)*: "The collapsed/expanded state of the filter bar persists across navigation"
- **Expected result asserts:** 1. After step 2 the same Status and Customer selections are still applied - chips active with the same values, table filtered the same way. 2. The filter bar is still expanded (as you left it). 3. After step 4 the filter bar comes back collapsed - the collapsed/expanded state is restored too. Known issue: on the build tested the Customer, Lead Technician and Service Advisor buttons come back switched on but WITHOUT t…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-02 = C29614 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29614)
*Persistence* · Filters are remembered permanently, even after closing the browser
- **S10-R2** *(spec v18)*: "Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"
- **S10-R3** *(spec v18)*: "Filter selections are saved per user: one user's filters do not affect another user's view"
- **S10-R1** *(spec v18)*: "When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left"
- **Expected result asserts:** 1. After moving around the app (step 2) the filter selections are still applied - you do not have to re-apply them. 2. After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session. 3. The same filter selections are applied on the other computer too - the filters are saved to your ac…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-03 = C29615 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29615)
*Persistence* · Saved filters are per user: one user's filters do not appear for another user
- **S10-R3** *(spec v18)*: "Filter selections are saved per user: one user's filters do not affect another user's view"
- **Expected result asserts:** 1. User B does not see user A's filters - user B's page opens with user B's own (or no) filters. 2. User B's new filter does not change what user A sees; each user keeps their own saved filter state.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-04 = C29616 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29616)
*Persistence* · A remembered filter value that was deleted is silently ignored
- **S10-N1** *(spec v18)*: "If a previously selected filter value no longer exists (e.g., a customer was deleted), the system silently ignores that value and the filter updates to reflect only valid selections"
- **Expected result asserts:** 1. The deleted customer is silently ignored - no error or warning appears. 2. The Customer filter now reflects only the still-valid selection (the real customer). 3. The table is filtered by the remaining valid selection only. Known issue: on the build tested the deleted customer is hidden from the dropdown but is STILL used to filter the table - the address bar and the request to the server both still carry it. So s…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-01 = C29617 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29617)
*URL State and Shareable Links* · Applying filters updates the page URL to reflect the active filter state
- **S11-R1** *(spec v18)*: "When a user applies one or more filters, the page URL updates to reflect the active filter state"
- **Expected result asserts:** 1. After step 1 the URL changes to include the active filter state. 2. After step 3 the filter part of the URL is removed again.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-02 = C29618 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29618)
*URL State and Shareable Links* · Opening a shared URL or bookmark loads the page with those filters on
- **S11-R2** *(spec v18)*: "When a user opens a URL that contains filter state, the Work Orders page loads with those filters pre-applied and the table already filtered"
- **Expected result asserts:** 1. The page opens with the same filters already applied - chips active with the same values. 2. The table is already filtered accordingly on load (no need to re-apply anything). 3. The same works from a saved bookmark. Known issue: two points on this test are expected to fail on the build tested. On a phone-sized screen a link carrying filters shows the buttons as on but lists the wrong work orders (ticket: https://s…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-03 = C29619 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29619)
*URL State and Shareable Links* · A URL with a deleted filter value loads and ignores that value
- **S11-R3** *(spec v18)*: "If the URL contains a filter value that no longer exists (e.g., a deleted customer), the system ignores that value and loads the page without it"
- **Expected result asserts:** 1. The page loads normally - no error. 2. The deleted value is ignored; only the still-valid filter value is applied and shown on the chips. 3. The table reflects only the valid filter. Known issue: a value in the address bar that no longer exists is still sent to the server, so you get an empty list instead of the list without that value. Until it is fixed this test is expected to fail on that point - it is already …
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-04 = C29620 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29620)
*URL State and Shareable Links* · A broken filter URL loads the page with no filters and no error
- **S11-N1** *(spec v18)*: "If the URL filter state is malformed or unrecognizable, the page loads without any filters applied and does not show an error"
- **Expected result asserts:** 1. The Work Orders page loads normally. 2. No filters are applied (chips in default state, full list shown) - the unrecognizable state is discarded. 3. No error message or broken page appears. Known issue: a broken address is not fully ignored - a wrong tab value can switch the tab and a bad customer value is still sent to the server. Until it is fixed this test is expected to fail on that point - it is already repor…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-01 = C29621 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29621)
*Mobile Filters* · Mobile: chips sit in a scrollable row below the tabs, starting All Filters
- **S12-R1** *(spec v18)*: "The filter chips are displayed in a horizontally scrollable row below the tab navigation"
- **Expected result asserts:** 1. A filter chip row is shown below the tabs, starting with an 'All Filters' chip (with a filter icon) followed by the individual filter chips (Status, Customer, Lead Technician, ...). 2. The row scrolls horizontally - chips that do not fit are reachable by swiping. 3. An arrow at the right-hand edge shows that the row can be scrolled. (This is what the design shows - if your screen looks different, write down what y…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-02 = C29622 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29622)
*Mobile Filters* · Mobile: All Filters opens a sheet of expandable rows with Apply filters
- **S12-R3** *(spec v18)*: "Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"
- **Expected result asserts:** 1. A bottom sheet slides up with a drag handle at the top, the centered title 'All Filters' and a close (x) button. 2. It lists the five filters as expandable accordion rows, each with its icon, name and a down arrow: Status, Customer, Lead Technician, Service Advisor, Asset on Site. 3. A sticky blue 'Apply filters' button sits at the bottom of the sheet.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-03 = C29623 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29623)
*Mobile Filters* · Mobile: tapping Apply filters applies the statuses and updates the count
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S12-R3** *(spec v18)*: "Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"
- **S2-R1** *(spec v18)*: "Clicking the Status chip opens a dropdown panel with a checkbox list of all possible work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined, Imported"
- **Expected result asserts:** 1. Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) plus 'Clear Selection'. 2. After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses. 3. The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)', and the Status accordion header is highlighted…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-04 = C29624 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29624)
*Mobile Filters* · Mobile: one chip opens its own sheet and applies only on Apply filters
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S12-R3** *(spec v18)*: "Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"
- **S2-R6** *(spec v18)*: "The table filters in real time as the user makes selections (no confirm/apply button needed)"
- **Expected result asserts:** 1. A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters. 2. The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection'). 3. You can tick more than one option, and the work order list does NOT change while you tick - your choices are only being held, not a…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-05 = C29625 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29625)
*Mobile Filters* · Mobile Customer filter has search, multi-select and removable tags
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S3-R2** *(spec v18)*: "As the user types in the search field, the customer list filters to show only matching names"
- **Expected result asserts:** 1. The list narrows to matching names as you type. 2. Each selected customer appears as a tag with an x in the input area, and its list row shows a checkmark. 3. Removing a tag deselects just that customer. 4. After 'Apply filters' the list shows only work orders of the remaining selected customers, and the sheet title counts the applied filters (for example 'All Filters (2)').
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-06 = C29626 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29626)
*Mobile Filters* · Mobile Lead Technician and Service Advisor filters offer their search lists
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S4-R1** *(spec v18)*: "Clicking the Lead Technician chip opens a dropdown panel with a search input at the top and a scrollable list of technicians below"
- **S5-R1** *(spec v18)*: "Clicking the Service Advisor chip opens a dropdown panel with a search input at the top and a scrollable list of advisors below"
- **Expected result asserts:** 1. The Lead Technician row opens with a 'Search' field and the technician list. 2. The Service Advisor row opens with a 'Search' field and the advisor list. 3. Applying a selection filters the work order list just like on desktop.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-07 = C29627 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29627)
*Mobile Filters* · The mobile Asset on Site filter offers Yes/No with Clear Selection in the sheet
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S6-R1** *(spec v18)*: "Clicking the Asset on Site chip opens a dropdown panel with two options: Yes and No"
- **Expected result asserts:** 1. The Asset on Site row opens showing the two options Yes and No plus 'Clear Selection'. 2. Only one option can be selected at a time. 3. After applying, the list shows only work orders matching the chosen on-site state.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-08 = C29628 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29628)
*Mobile Filters* · Active chips and Clear Filters behave on mobile the same way as on desktop
- **S12-R2** *(spec v18)*: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"
- **S7-R1** *(spec v18)*: "When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)"
- **S8-R1** *(spec v18)*: "Clicking "Clear filters" removes all active filter selections across all filters; all chips return to their default (inactive) state"
- **Expected result asserts:** 1. The chip for the applied filter shows the active state with the selected value(s), like on desktop. 2. A 'Clear Filters' control appears while at least one filter is active. 3. Using it removes all active filters, the chips return to default and the full list comes back. Known issue: on a phone there is no Clear Filters button at all while filters are on. Until it is fixed this test is expected to fail on that poi…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-09 = C29629 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29629)
*Mobile Filters* · Mobile has no collapse toggle: the filter chip row is always visible
- **S12-R4** *(spec v18)*: "The filter bar collapse toggle is not shown on mobile; the filter bar is always visible"
- **Expected result asserts:** 1. There is no filter-bar collapse/expand (filter icon) toggle on mobile. 2. The filter chip row is always visible on the mobile Work Orders page.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-MOB-10 = C29630 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29630)
*Mobile Filters* · Filters matching no work orders on mobile show the same empty state as desktop
- **S12-N1** *(spec v18)*: "If no work orders match the active filters on mobile, the list shows the same empty state as desktop"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. The list shows the same no-results empty state as desktop, saying no results were found for the current filters. 2. The empty state includes the prompt to clear filters. 3. No error appears. Known issue: on a phone a link carrying filters shows the buttons as on but lists the wrong work orders. Until it is fixed this test is expected to fail on that point - it is already reported. Ticket: https://shopview.atlassia…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-01 = C29631 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29631)
*API — Work Orders List Filtering* · The work order list request carries the active filter selections
- **S2-R2** *(spec v18)*: "The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"
- **S3-R6** *(spec v18)*: "The table updates to show only work orders belonging to any of the selected customers"
- **Expected result asserts:** 1. The list request includes the active filter selections as request parameters (status values and customer identifiers). 2. The request succeeds (HTTP 200). 3. The response contains only work orders matching the filters - the filtering is done by the backend, not just hidden client-side.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-02 = C29632 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29632)
*API — Work Orders List Filtering* · A combined multi-filter request returns only work orders matching all filters
- **S2-R2** *(spec v18)*: "The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"
- **S3-R6** *(spec v18)*: "The table updates to show only work orders belonging to any of the selected customers"
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **Expected result asserts:** 1. One request carries both filters together (both statuses and the customer). 2. The response returns customer A's Estimate and Approved work orders only. 3. Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-03 = C29633 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29633)
*API — Work Orders List Filtering* · A request with a deleted or unknown filter value gives no server error
- **S10-N1** *(spec v18)*: "If a previously selected filter value no longer exists (e.g., a customer was deleted), the system silently ignores that value and the filter updates to reflect only valid selections"
- **S11-R3** *(spec v18)*: "If the URL contains a filter value that no longer exists (e.g., a deleted customer), the system ignores that value and loads the page without it"
- **Expected result asserts:** 1. The backend does not fail with a server error (no HTTP 5xx). 2. The response is a normal, successful list response - the invalid value is ignored or simply matches nothing. 3. Any still-valid filter values in the same request are applied normally. Known issue: the server does not fail, but the value that no longer exists is still applied instead of being dropped. Until it is fixed this test is expected to fail on …
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-04 = C29634 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29634)
*API — Work Orders List Filtering* · A list request with malformed filter parameters does not produce a server error
- **S11-N1** *(spec v18)*: "If the URL filter state is malformed or unrecognizable, the page loads without any filters applied and does not show an error"
- **Expected result asserts:** 1. The backend responds gracefully - no HTTP 5xx / crash; either a normal (unfiltered or empty) list or a clean validation response. 2. In the browser the page still loads without filters and without an error message, matching the malformed-URL requirement. Known issue: the server does not fail, but a broken address is not fully ignored by the page. Until it is fixed this test is expected to fail on that point - it i…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-05 = C29635 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/29635)
*API — Work Orders List Filtering* · A filter combination matching nothing returns an empty list, not an error
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **S2-N3** *(spec v18)*: "If no work orders match the selected statuses, the table shows an empty state (see Story 8)"
- **Expected result asserts:** 1. The request succeeds (HTTP 200). 2. The response contains an empty result set (zero work orders) - an empty match is a normal outcome, not an error. 3. The page renders the no-results empty state from this response.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-TAB-06 = C38876 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38876)
*Tab Behaviour* · First visit opens the Estimates tab; your last-used tab is remembered
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (no requirement in spec v1.6 - default/last-used tab is not in the spec; RULED by Branko answers 2026-08-04 Q2 "A - it's fine"); tech plan 2026-07-29 D10 (default tab = Estimates; last-used tab persists) [spec v1.6 2026-07-28]
- **Expected result asserts:** 1. On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row (order and default are different on purpose). 2. After switching to All and returning, the All tab is selected - the app remembers your last-used tab per account.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-STAT-07 = C38877 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38877)
*Status Filter* · Imported works alone: picking it greys out the other filters
- **S2-R7** *(spec v18)*: "Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips. This is current production behaviour and is un…"
- **S2-N4** *(spec v18)*: "Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 rather than returning an empty result"
- **Expected result asserts:** 1. The table switches to showing imported work orders only. 2. While Imported is ticked, the other filter chips are greyed out and cannot be used. 3. Imported cannot be combined with other statuses - selecting it works alone. 4. Unticking Imported re-enables the other chips and the normal list returns.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-ASSET-07 = C38878 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38878)
*Asset on Site Filter* · Choosing No shows only work orders whose asset is not on site
- **S6-R2** *(spec v18)*: "The user selects one option; the table updates to show only work orders matching that asset on-site status"
- **Expected result asserts:** 1. Only work orders whose asset is NOT on site remain in the list. 2. Every work order with the asset on site is excluded. 3. The chip shows the active No selection.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-05 = C38879 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38879)
*URL State and Shareable Links* · Opening a shared link does not change your own saved filters
- **S11-R6** *(spec v18)*: "Filter state arriving from a URL applies at runtime only. It never overwrites the user's saved filter state (S10-R2). Changes the user makes to filters while viewing a shared link are also not written back to their saved state: the entire visit is treated as a temporary view"
- **S11-R7** *(spec v18)*: "While viewing filter state that arrived from a URL, a "Back to my view" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately "my view" rather than "my filters", since the action affects both filters and search"
- **S11-R8** *(spec v18)*: "S11-R6 does not need to protect the search query. Because the query is never saved (S13-R25), a query arriving from a URL has no stored value to overwrite: it simply becomes that browser tab's session query"
- **Expected result asserts:** 1. The link's filters apply for viewing only - the page shows the shared view. 2. Changes made during the link visit are also NOT saved to your account. 3. A 'Back To My Saved Filters' option is shown while you are looking at the shared link. (If the wording on screen is slightly different, note what it says and carry on.) 4. Clicking 'Back To My Saved Filters' brings back your own saved filters and removes the filte…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-05 = C38880 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38880)
*Persistence* · Each page and tab remembers its own filters separately
- **S10-R4** *(spec v18)*: "Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions. Persistence and scope are separate concerns: each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2"
- **Expected result asserts:** 1. The second Parts view does NOT show the first view's selections - each view keeps its own. 2. Returning to the first view restores that view's own selections. 3. Report tabs likewise keep separate filter choices, each remembered and restored on its own tab.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PERS-06 = C38881 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38881)
*Persistence* · Filters saved before the redesign carry over after the update
- **S10-R2** *(spec v18)*: "Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"
- **Expected result asserts:** 1. The old saved choices appear in the new filter bar on the first visit - the update does not lose them (old status choices show in the Status chip, the old asset-here choice shows as Asset on Site: Yes, the old My-Work-Orders toggle maps to the My Work Orders tab, columns and sorting stay). 2. Those carried-over choices are now saved to the account: the other computer shows them too.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-RPTS-23 = C38882 — **class D** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38882)
*Reports Page Filters* · Date range filter offers ready-made periods and a custom start/end range
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (Filters spec v1.6 rev 2026-08-04 pm: Feature Overview + Key Decisions "New date-range filter type" - standard predefined ranges; pre-populated default range; preset applies on selection; custom applies on 2nd date)
- **Expected result asserts:** 1. The panel that opens offers a set of ready-made periods to choose from - on the build tested these are Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year - plus a Custom option and a Clear Selection link. The exact set of ready-made periods may differ per report, so check the ones your report offers rather than expecting this list. 2. A period is alread…
- **Verdict:** **SCOPE-CONDITIONAL REWRITE** — see the Class D section above.

### FLT-PSRCH-01 = C38883 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38883)
*Page Search Toolbar* · Page toolbar Search expands in place and narrows the list as you type
- **S13-R1** *(spec v18)*: "A Search control is displayed in the page toolbar, in the right-hand action group, positioned before any icon-only actions and before the primary CTA"
- **S13-R9** *(spec v18)*: "Search is scoped strictly to the records in the current table. It never returns results from another table, another page, another module, or any content outside that table. There is no cross-page lookup and no fallback to a wider search when the query returns nothing"
- **S13-R12** *(spec v18)*: "Results replace the table contents in place. There is no separate results view or results page"
- **S13-R15** *(spec v18)*: "On desktop, blur with an empty field collapses the control to its default state. Blur with a query keeps the field expanded so the active query stays visible"
- **Expected result asserts:** 1. The control expands in place into a small search box showing the placeholder 'Type to search'. 2. The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app. 3. The round x clears the text and the full list returns. 4. Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-02 = C38884 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38884)
*Page Search Toolbar* · Page search combines with filters and is cleared separately
- **S13-R10** *(spec v18)*: "Search and filters are additive (AND). A query narrows within the active filters; applying a filter narrows within the active query"
- **S13-R13** *(spec v18)*: "Clicking the X-circle clears the query and restores the list to its filtered-but-unsearched state. "Clear filters" (S8-R1) does not clear the search query, and clearing the search query does not clear any filters"
- **S8-R5** *(spec v18)*: "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"
- **Expected result asserts:** 1. With both active, the results match the filter AND the search together (both narrow the list at once). 2. Clearing the search keeps the filter applied. 3. Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-03 = C38886 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38886)
*Page Search Toolbar* · Your typed search stays in this browser tab only and is never saved
- **S13-R14** *(spec v18)*: "The search query is retained for the browser tab session. It survives sorting, pagination, and navigating away from the page and returning. Tab-switch behaviour within a page is governed by S13-R24"
- **S13-R25** *(spec v18)*: "The query is stored in the browser tab session, never against the user account. This is deliberately different from filters, which are stored server-side and sync across devices (S10-R2). The query does not sync across devices, does not survive the tab session ending, and two browser tabs open on the same page each keep their own independent query. A shared link opened in a new tab therefore starts clean"
- **S13-N4** *(spec v18)*: "A query is never restored on a later visit after the tab session has ended. A user returning the next day sees an unsearched list"
- **S10-R5** *(spec v18)*: "The search query is not covered by this story. It is scoped to the browser tab session and is never written to the user account. See S13-R14 and S13-R25"
- **Expected result asserts:** 1. Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed. 2. Leaving the page and coming back also keeps your text in the box and the list still narrowed. 3. The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search. 4. After closing the browser and coming back, the Search box is empty and the list is unsearche…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-04 = C38888 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38888)
*Page Search Toolbar* · The search term is part of the shareable page link
- **S11-R4** *(spec v18)*: "The active search query is reflected in the page URL alongside the filter state, so a filtered-and-searched view can be shared or bookmarked"
- **S11-R5** *(spec v18)*: "Opening a URL that contains a search query loads the page with that query pre-applied and the search control in its filled state, matching the filter behaviour in S11-R2"
- **S11-N2** *(spec v18)*: "If the URL search parameter is malformed, the page loads without a query applied and does not show an error, matching S11-N1"
- **S11-R8** *(spec v18)*: "S11-R6 does not need to protect the search query. Because the query is never saved (S13-R25), a query arriving from a URL has no stored value to overwrite: it simply becomes that browser tab's session query"
- **Expected result asserts:** 1. The address contains the search term after step 1. 2. The fresh tab opens with the search box filled and the list already narrowed. 3. The malformed part is ignored - the page loads cleanly without an error. 4. A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-05 = C38889 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38889)
*Page Search Toolbar* · On mobile the search expands in the toolbar and buttons make room
- **S13-R16** *(spec v18)*: "Mobile uses the same inline expansion as desktop. There is no modal, no separate search screen, and no mobile-only state in the component. Tapping the collapsed control expands it in place within the action row, moves focus into the field and raises the keyboard"
- **S13-R17** *(spec v18)*: "On mobile the expanded field fills the remaining width of the action row rather than taking the fixed 180px desktop width. On Work Orders that resolves to 162px. All other toolbar actions remain visible and in position throughout; nothing is hidden while searching"
- **S13-R18** *(spec v18)*: "To create that room, the primary CTA on mobile uses its natural hug width instead of stretching to fill the row: "New Work Order" is 144px, the same width it has on desktop, not 211px. The action group is right-aligned as on desktop, so the free space sits to the left and the field expands into it"
- **S13-R19** *(spec v18)*: "Where a page has more than one icon-only action in its toolbar, those actions collapse into a single "more" kebab on mobile. This applies to Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), and any other page carrying two or more icon actions"
- **S13-R20** *(spec v18)*: "No separate active-query indicator is needed on mobile. Because the field stays expanded and visible whenever a query is present, the desktop blur rules (S13-R15) apply unchanged: empty collapses, non-empty stays expanded showing the query"
- **S12-R5** *(spec v18)*: "The page search control is shown on mobile and behaves as it does on desktop (Story 13, S13-R16 to S13-R21). S12-R4, which hides the filter bar collapse toggle on mobile, does not apply to the search control"
- **Expected result asserts:** 1. The search expands inline inside the toolbar - no separate popup window opens. 2. The list narrows as you type, same as desktop. 3. To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu. 4. The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-06 = C38891 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38891)
*Page Search Toolbar* · Every list page keeps its own search box (Parts, Reports, detail tabs)
- **S14-R6** *(spec v18)*: "The audit of surfaces where global search currently filters content is complete. No surface loses text narrowing: every affected surface keeps a search control, delivered through the shared table component (S13-R22). The audit identified 42 surfaces across 39 components, listed under Affected Surfaces below. It confirmed that global search filters tables well outside the list pages, including Work Order notes, Custom…"
- **S14-R5** *(spec v18)*: "This applies to every page in the application. Global search must no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and Reports, and pages with no design in the current explorations. QA should treat this as an app-wide sweep, not a per-module check"
- **S13-R22** *(spec v18)*: "Every table in the application carries a search control, delivered through the shared table component. This covers the list pages across Work Orders, Parts and Reports, and also tables on detail pages and tables inside dialogs (see S14-R6). Any exception must be listed explicitly here; there are none at time of writing. This replaces the enumerated page list used in earlier versions, which did not account for tables …"
- **S14-N1** *(spec v18)*: "Page search (Story 13) is a hard prerequisite. Removing global-search filtering from a page before page search is available there would leave that page with no way to narrow by text. If the rollout is phased, S14-R2 is scoped per page and S14-R5 is verified once at the end"
- **Expected result asserts:** 1. Every table listed above has its own Search box - no table lost the ability to narrow by text. 2. Each Search box narrows only its own table; nothing else in the app changes. 3. Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there. 4. The work order Parts tab keeps the local search input it already had - it was deliberat…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-07 = C38893 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38893)
*Page Search Toolbar* · The top navigation search no longer filters page lists
- **S14-R1** *(spec v18)*: "The global header search returns navigational results only. It takes the user to a record or page and does not modify the contents of the list the user is currently viewing"
- **S14-R2** *(spec v18)*: "The existing code path that applies a global search query as a filter on the current page's table is removed, not hidden behind a flag or left dormant"
- **S14-R4** *(spec v18)*: "Entering a query in the global search while on a list page leaves that list untouched"
- **S14-R5** *(spec v18)*: "This applies to every page in the application. Global search must no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and Reports, and pages with no design in the current explorations. QA should treat this as an app-wide sweep, not a per-module check"
- **Expected result asserts:** 1. The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears. 2. The same holds on the other pages checked. 3. Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-API-06 = C38895 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38895)
*API — Work Orders List Filtering* · Saved-filters service round-trip: save, reload, and per-user isolation
- **S10-R2** *(spec v18)*: "Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"
- **S10-R3** *(spec v18)*: "Filter selections are saved per user: one user's filters do not affect another user's view"
- **Expected result asserts:** 1. Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200). 2. On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them. 3. The second user does NOT receive the first user's saved state - each account's saved filters are isolated. 4. Asking for a never-saved key returns succ…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-URL-06 = C38896 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38896)
*URL State and Shareable Links* · 'Back To My Saved Filters' is not shown when you are on your own view
- **S11-N3** *(spec v18)*: ""Back to my view" is not shown when the user is viewing their own state rather than state that arrived from a URL"
- **S11-R7** *(spec v18)*: "While viewing filter state that arrived from a URL, a "Back to my view" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately "my view" rather than "my filters", since the action affects both filters and search"
- **Expected result asserts:** 1. On your own view there is no 'Back To My Saved Filters' option anywhere - it only belongs to a shared-link visit. 2. Changing your own filters does not make it appear. 3. When you open the shared link, 'Back To My Saved Filters' does appear. 4. After you click it and you are back on your own view, the option disappears again.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-EMPTY-03 = C38897 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38897)
*Empty State* · When filters and a search find nothing, each can be cleared on its own
- **S8-R3** *(spec v18)*: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"
- **S8-R4** *(spec v18)*: "The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"
- **S8-R5** *(spec v18)*: "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"
- **S13-N1** *(spec v18)*: "If no records match the query, the table shows an empty state (see Story 8)"
- **S13-N2** *(spec v18)*: "If the query is cleared while filters remain active, the table returns to the filtered result set rather than the unfiltered list"
- **Expected result asserts:** 1. The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone. 2. The message offers a way to clear the filters and, because a search is active, a separate way to clear the search. 3. Clearing the search brings back the list as narrowed by the filter only - the filter is still on. 4. Clearing the filters leaves your typed word in the box and still appli…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-08 = C38898 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38898)
*Page Search Toolbar* · The Search box changes look as you hover over it, open it and type
- **S13-R2** *(spec v18)*: "In its default state the control is a low-emphasis text button: magnifier icon (20×20) and the label "Search", Inter Medium 14/20, grey/600 (#4B5565), 8px corner radius, transparent background, 10px padding"
- **S13-R3** *(spec v18)*: "On hover the control takes a grey/100 (#EEF2F6) background fill; the label colour is unchanged"
- **S13-R4** *(spec v18)*: "On desktop, clicking the control expands it in place into a text input and moves focus into the input. The field grows leftward from its anchor and the remaining toolbar actions stay in position. The expanded width is 180px"
- **S13-R5** *(spec v18)*: "The expanded empty state shows the magnifier icon, the text caret, and the placeholder "Type to search" in grey/500 (#697586)"
- **S13-R6** *(spec v18)*: "Once the user types, the entered text is shown in grey/900 (#121926) and an X-circle clear icon (16×16) appears at the right edge of the field"
- **S13-R8** *(spec v18)*: "Long queries use standard text input behaviour: the field neither grows nor truncates, the text scrolls horizontally within it, and the caret follows the insertion point. Keyboard navigation and click-and-drag selection behave as in any text input"
- **Expected result asserts:** 1. A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill. 2. Hovering over it gives it a light grey background; the word 'Search' keeps its own colour. 3. Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box gro…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-09 = C38899 — **class A** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38899)
*Page Search Toolbar* · The list narrows shortly after you stop typing, with no button to press
- **S13-R7** *(spec v18)*: "The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required. Inventory uses 350ms because of its load characteristics. Any other table needing a longer interval must be listed here rather than deviating silently"
- **S13-R12** *(spec v18)*: "Results replace the table contents in place. There is no separate results view or results page"
- **Expected result asserts:** 1. The list narrows on its own a moment after you stop typing (about a third of a second) - you never press Enter or any button. 2. The matching rows appear in the table you were already looking at; no separate results page, results list or pop-up window opens. 3. There is no Apply or Submit button anywhere next to the Search box. 4. Pressing Enter changes nothing that has not already happened - the same rows stay li…
- **Verdict:** **RESTORE** — waives a documented requirement (see the Class A section above).

### FLT-PSRCH-10 = C38900 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38900)
*Page Search Toolbar* · One search box serves all Work Orders tabs and searches the tab you are on
- **S13-R11** *(spec v18)*: "On pages with tabs, search applies within the active tab only"
- **S13-R24** *(spec v18)*: "On pages with tabs, the query scopes the same way that page's filters do. The Work Orders tabs share a single query, because they are views of one dataset. Reports sub-tabs and Parts views each keep their own query, matching their per-view filter scoping, because carrying a query between them would apply it to a different table with different columns"
- **Expected result asserts:** 1. On the All tab only the rows matching your word remain. 2. On the Estimates tab your word is still in the Search box, and the list shows only Estimates rows that match it - no rows from the other tabs appear. 3. The Completed tab behaves the same way: your word is still there and only that tab's matching rows are listed. 4. Clearing the search clears it for all the Work Orders tabs - they share one search - and ea…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-11 = C38901 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38901)
*Page Search Toolbar* · Each Report tab and each Parts view keeps its own separate search
- **S13-R24** *(spec v18)*: "On pages with tabs, the query scopes the same way that page's filters do. The Work Orders tabs share a single query, because they are views of one dataset. Reports sub-tabs and Parts views each keep their own query, matching their per-view filter scoping, because carrying a query between them would apply it to a different table with different columns"
- **S13-R11** *(spec v18)*: "On pages with tabs, search applies within the active tab only"
- **S10-R4** *(spec v18)*: "Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions. Persistence and scope are separate concerns: each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2"
- **Expected result asserts:** 1. The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over. 2. Going back to the first view brings its own word back and narrows its list again. 3. Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own. 4. No search is ever applied to a table it was not typed on.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-12 = C38902 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38902)
*Page Search Toolbar* · An old link carrying a top-search word no longer narrows the page list
- **S14-R3** *(spec v18)*: "Any state, URL parameters or persisted values that carry a global search term into page-level filtering are removed with it"
- **S14-R2** *(spec v18)*: "The existing code path that applies a global search query as a filter on the current page's table is removed, not hidden behind a flag or left dormant"
- **S14-R1** *(spec v18)*: "The global header search returns navigational results only. It takes the user to a record or page and does not modify the contents of the list the user is currently viewing"
- **Expected result asserts:** 1. The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list. 2. The page's own Search box is empty; nothing was carried into it. 3. No error is shown - the leftover search part in the address is simply ignored. (Whether it also disappears from the address is not important; note what you see.) 4. After typing in the top-of-screen search and reloading, the list is st…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PSRCH-13 = C38903 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38903)
*Page Search Toolbar* · Collapsing the filter bar keeps an active search working
- **S13-E1** *(spec v18)*: "If the user collapses the filter bar (S1-R5) while a search query is active, the query continues to apply and the search control remains in the toolbar"
- **Expected result asserts:** 1. The list stays narrowed by your word - collapsing the filter bar does not cancel the search. 2. The Search box stays in the toolbar row with your word still showing; it is not tucked away with the filter bar, because the search sits in the toolbar row and the chips sit in the row below. 3. Expanding the bar again changes nothing about the search or the narrowed list.
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.

### FLT-PARTS-01 = C38904 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38904)
*Parts Page Filters* · Every Parts list page shows its designed filter buttons
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Parts Filters; §4 context-specific filter sets + multi-select); Branko answers 2026-07-31 Q2/Q3/Q5/Q7 + 2026-08-04 Q3 (Vendors design exists Figma 11903-10461) + Q8 (Part Sales chips); Figma 11884-16885
- **Expected result asserts:** 1. Inventory shows four filter buttons: Bin Location, Category, Supply and Vendor. 2. Part Sales shows four filter buttons: Status, Customer, Created by and Date. 3. Catalog shows two filter buttons: Manufacturer and Category. 4. The Returns tab shows three filter buttons: Vendor, Category and Part Type. 5. The Credits tab shows three filter buttons: Vendor, Date and Processed by. 6. Purchase Orders shows four filter…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-PARTS-09 = C38905 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38905)
*Parts Page Filters* · Part Type filter opens a Core / Non Core list with Clear Selection
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Feature Overview -> Parts Filters; §4 Key Decisions -> "Context-specific filter sets on Parts and Reports" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885
- **Expected result asserts:** 1. A small menu opens with two options: Core and Non Core. 2. A Clear Selection action is shown at the bottom of the menu. 3. You can tick both Core and Non Core at the same time - this filter allows more than one choice. 4. As soon as you tick a choice the list below narrows to matching parts straight away, with no Apply button to press; Clear Selection puts the list back. Not built yet on the build tested: a filter…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-PARTS-11 = C38906 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38906)
*Parts Page Filters* · Choosing a Parts filter narrows the list on that page
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Feature Overview -> Parts Filters; §4 Key Decisions -> "Context-specific filter sets on Parts and Reports" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885
- **Expected result asserts:** 1. The table updates to show only the rows that match the chosen filter value. 2. The chosen value is shown on the filter button so you can see what is applied. 3. The list narrows as soon as you pick the value - there is no Apply or Search button to press. Every filter button on every Parts page works this way. Not built yet on the build tested: a filter bar exists on Inventory, Part Sales, Catalog and Returns, but …
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-PARTS-12 = C38907 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38907)
*Parts Page Filters* · Parts filters support multiple choices and can be cleared
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Feature Overview -> Parts Filters; §4 Key Decisions -> "Context-specific filter sets on Parts and Reports" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11884-16885
- **Expected result asserts:** 1. More than one value can be chosen inside the filter, and the button shows what you picked. 2. Clear Selection removes the choices for that one filter. 3. A Clear Filters button appears in the filter bar while any filter is set, and using it clears them all at once - exactly as it works on the Work Orders page. Not built yet on the build tested: a filter bar exists on Inventory, Part Sales, Catalog and Returns, but…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-PARTS-13 = C38908 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38908)
*Parts Page Filters* · Every filter a page had before is still available in the new filter bar
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Parts Filters + Reports Filters); Branko answers 2026-07-31 Q3 + 2026-08-04 Q8 ("we should have all filters we support now per each page plus we should add new ones"); tech plan 2026-07-29 rollout rule
- **Expected result asserts:** 1. Every filter the page offered before is still offered - nothing has been taken away. 2. Every choice each of those filters offered before is still available inside the new button. 3. If any filter or choice is missing, write down exactly which page, which filter and which choice - that is a bug worth reporting. Not built yet on the build tested: a filter bar exists on Inventory, Part Sales, Catalog and Returns, bu…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-RPTS-01 = C38909 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38909)
*Reports Page Filters* · Every report page shows its designed filter buttons
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Reports Filters; §4 Key Decisions "New date-range filter type" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11903-10573
- **Expected result asserts:** 1. Timesheet Activities shows four filter buttons: Staff, Date, Status and Modified by. 2. Payroll Timesheet shows two filter buttons: Employee and Date. 3. Sales shows two filter buttons: Customer and Date. 4. Technician Efficiency shows three filter buttons: Customer, Technician and Date — the same three on both of its view tabs, Invoiced and Completed. 'Technician' is spelled correctly here. 5. Advisor Analysis sh…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-RPTS-21 = C38910 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38910)
*Reports Page Filters* · Choosing a Reports filter narrows the report results
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Reports Filters; §4 Key Decisions "New date-range filter type" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11903-10573
- **Expected result asserts:** 1. The report updates to show only the rows matching the chosen filter value, and the chosen value is shown on the filter button. 2. The report narrows as soon as you pick the value - there is no Apply or Run button to press. Every filter button on every report works this way. Not built yet on the build tested: only the first report tab (Timesheet Activities) has a filter bar, with a Date Range and a Filter by Staff …
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

### FLT-RPTS-22 = C38911 — **class C** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38911)
*Reports Page Filters* · New Reports filter types behave correctly (Location, Transaction Type, etc.)
- **No numbered anchor.** `refs` records the prose source: SV-8785 [epic] (spec v1.6 §2 Reports Filters; §4 "Multi-select where it makes sense"); Branko answers 2026-07-31 Q3/Q5 + 2026-08-04 Q8 ("We do not have list of all filter items" - confirms no option list exists); Figma 11903-10573
- **Expected result asserts:** 1. Each of these filter buttons - Location, Transaction Type, Invoice Status, Type, User and Mention - opens a list of choices, lets you tick more than one, and narrows the report straight away with no Apply button. 2. The choices inside each filter come from your own shop's data (for example your real vendors or categories), so there is no fixed list to compare against - check that the choices you see match the data…
- **Verdict:** **CORRECT — stays.** The assertion above is the documented requirement; the build supplied only labels, or the deviation is flagged with its ticket while the requirement is kept.
- **Provenance defect:** names the build as the source of an expectation for a feature that is not built. Repaired.

---

## Steps correctly VIU'd but the expectation altered in the same pass

The QA lead asked for this specifically, and gave the reason that makes it matter:

> *"For the rule: 'the case should be matched to the build' — That doesn't mean the expected behavior
> should match the build. That kills the purpose of the test case. I think when we said 'the case
> should be matched to the build' it meant that the test case should be VIU'd from the build"*

**The consequence, stated plainly: if the expected behaviour bends to whatever shipped, the case can no
longer fail — and a test that cannot fail is not a test.** A build-derived expected result is not a
wording problem. It is a case that has been silently disarmed. And the reason this particular pattern is
the hardest to catch is that the case comes out looking **freshly maintained**, with a current provenance
line, which is worse than an obviously stale case rather than better.

**How it was searched.** Not by reading the cases — by replaying **26 commits** of the local case source
since 28 July and, for every case in every commit, comparing the **steps** and the **assertion body**
(the expected result with the provenance line, the automation marker, the HTML and the list numbering all
stripped, so only the assertion itself is compared). The commit is flagged only when **both** changed.
Tooling: `final-viu-2026-08-05/tools/stepsweep2.py`.

**Result: 16 cases had steps and assertion change together. 14 are legitimate. 2 are real reversals, and
both were driven by a document, not by the build.**

### First — where did the five class-A waivers come from?

The precise question: were the five waivers slipped in alongside a legitimate step correction?

**No.** In all five the steps text is **byte-identical across the commit that introduced the waiver**:

| Case | Commit that introduced the waiver | Steps changed in the same commit? |
|---|---|---|
| FLT-BAR-01 C29557 | `ef02f7f2` 2026-08-05 | **NO** — 145 chars before and after |
| FLT-COLL-02 C29602 | `ef02f7f2` 2026-08-05 | **NO** — 73 chars before and after |
| FLT-EMPTY-01 C29606 | `ef02f7f2` 2026-08-05 | **NO** — 87 chars before and after |
| FLT-EMPTY-02 C29607 | `ef02f7f2` 2026-08-05 | **NO** — 131 chars before and after |
| FLT-PSRCH-09 C38899 | `ef02f7f2` 2026-08-05 | **NO** — 330 chars before and after |

So the waivers were **not** camouflaged by a VIU edit. They were added on their own, deliberately, in the
belief that a closed ticket settled the question. That is the failure this audit's main section addresses.

### The two genuine reversals

**FLT-RPTS-23 = C38882** — [TestRail](https://shopview.testrail.io/index.php?/cases/view/38882) — commit
`ef02f7f2`, 5 August. Steps and expectation changed together, and the expectation was **reversed**:

> **Before:** *"a start/end date picker opens — there are **no preset ranges** (no 'last 30 days'
> shortcuts) and **no pre-filled default range**."*
>
> **After:** *"The panel that opens offers a set of ready-made periods to choose from — on the build
> tested these are Today, Yesterday, This week…"*

**Was the driver the build or a document?** A document. Branko published Confluence **version 18** at
**2026-08-04T18:19:21Z**, the day before, with the note *"Date-range filter: reflect current in-app
default range and standard predefined ranges"*, and the §4 text reads:

> *"New date-range filter type: Date chips open a picker offering **standard predefined ranges** plus a
> custom start/end range, **pre-populated with the application's current default range** for that
> report/page. A predefined range applies on selection; a custom range applies when the second date is
> picked."*

So reversing the assertion was **correct and spec-driven**. What is *not* correct is enumerating the
build's ten periods inside the expected result — that is the class-D finding, and it is repaired by
removal, never by substitution.

**FLT-TAB-02 = C29609 / FLT-TAB-03 = C29610** — [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)
· [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) — commit `5e3f4df3`, 4 August. Also
reversed:

> **Before:** *"the status chip **is shown but greyed out, already filled in** with this tab's status, and
> cannot be clicked or changed"*
>
> **After:** *"The Status chip **is not shown** on this tab at all — only four chips appear."*

**Was the driver the build or a document?** A document, and it is the newer one. Quoting both:

> **S9-R3 (spec v18):** *"On the Completed tab, the Status filter chip is **hidden**; the remaining four
> filters are shown and apply on top of the Completed pre-filter"*
>
> **S2-N2 (spec v18):** *"On the Completed tab, the Status filter chip is **not shown**: that tab already
> pre-filters by the Complete status"*

The superseded position was **Branko's own answer of 2026-07-17** (greyed out and pre-filled), which the
design frame also showed. The specification is the newer authoritative source (Standing Rule 32), so the
cases follow it — and, to their credit, **both already carry a Rule-56 divergence sentence** saying so.
**Verdict: substantively correct, class C.**

Two blemishes are repaired anyway, because opening a case means re-reading the whole of it (Rule 41):

1. **The `refs` on both cases still assert the superseded position** — *"behaviour per Branko Q4=B
   2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled"* — which now directly contradicts
   the case's own body. Stale metadata.
2. The divergence sentence ends *"so this test follows the specification **and the build**"*. The build is
   not a source of the expectation and should not be named as a co-author of it. The clause is dropped;
   the specification alone carries it.

### The 14 legitimate ones — this is the rule working as intended

| Case | What changed | Why it is legitimate |
|---|---|---|
| FLT-COLL-01 C29601, FLT-COLL-04 C29604 | *"funnel icon"* → *"filter icon"* in both steps and expectation | pure label correction (Standing Rule 9). The assertion — the bar hides and the table takes the space — is untouched and is S1-R5 |
| FLT-MOB-05 C29625 | *"'Search customer' field"* → *"'Search' field"* | label correction |
| FLT-URL-05 C38879, FLT-URL-06 C38896 | *"Back to my view"* → *"Back to my saved filters"* | label correction. The specification writes it *"Back to my view"* in S11-N3; the button on screen reads otherwise, and the tester must read what they will see. The assertion — the control is absent on your own view — is unchanged |
| FLT-MOB-04 C29624 | reversed to the deferred-apply requirement | driven by S12-R6 and Branko closing SV-8825; carries a proper Rule-56 divergence sentence |
| FLT-PARTS-01 C38904, FLT-RPTS-01 C38909 | assertion widened from one page to all pages | driven by the Figma boards and Branko's answers, not the build |
| FLT-PARTS-09 C38905, FLT-PARTS-12 C38907, FLT-RPTS-22 C38911 | *"behaviour to confirm — pending Branko's product write-up"* replaced by a definite assertion | Branko answered. A hedge becoming an assertion **because the PO ruled** is exactly right |
| FLT-PSRCH-03 C38886, FLT-PSRCH-05 C38889, FLT-PSRCH-06 C38891 | assertions rewritten during the phase-2 authoring of the uncovered v1.6 requirements | driven by S13-R7/R12/R16–R20 and S13-N4 |

### The pattern to recognise next time

The tell is not that steps and expectation changed together — 14 of the 16 did, legitimately. **The tell
is whether the new expectation can be quoted back to a document.** If the answer to *"which requirement,
which version, which anchor?"* is the build, the case has been disarmed. If it is a spec anchor, a story,
or a dated PO answer, it has been maintained. That question is cheap to ask and it separates all 16 rows
above without ambiguity.

---

## What this audit cannot fix, and who owns it

**Nothing here needs Branko to settle an expected behaviour** — that is the good news, and it is why
class B is zero. Every one of the six repaired cases has a documented requirement to go back to.

Two things do sit with other people:

1. **[SV-8876](https://shopview.atlassian.net/browse/SV-8876)** (Ahtasham, Ready) asks Branko to
   reconcile the PRD, the design and the build on where the filter bar sits. Until he answers, **the
   PRD stands** and our cases follow it. Not ours to close.
2. **SV-8843 and SV-8847 are closed while the build still contradicts the specification.** That
   contradiction is reported here plainly. Reopening them is the QA lead's call, not ours, and neither
   ticket was touched.

## The honest lesson

The five cases were not sloppiness — each was written deliberately, with a note explaining itself, in
the belief that a closed ticket settled the question. That is precisely what makes it dangerous:
**a deliberate wrong decision that documents itself reads exactly like a considered one** (Standing
Rule 46). The safeguard is the principle the QA lead restated: the build is never a source of expected
behaviour. A closed ticket changes the plan to fix, never the requirement.

