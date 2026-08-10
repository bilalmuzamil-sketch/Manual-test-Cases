# COVERAGE MAP — Filters, re-derived from scratch against spec v19

**Date:** 2026-08-06 · **Spec:** Confluence page 572030978 "Filters", **version 19**, published
2026-08-06T11:48:47Z · **Cases:** the 114 live under TestRail group 4110, read 15:45Z
· **Read-only pass — no TestRail write, no Jira write.**

> **THIS FILE IS THE DURABLE ARTEFACT.** It exists because there was no published map for a
> reviewer to check, so the only way anyone outside our work could look for a gap was to read 110
> case bodies hunting for sentences buried in the middle of them. Four of the five things Vlad got
> wrong were wrong for that reason. **Anyone may now check a list instead.**
>
> **Re-derive this file, from scratch, whenever the spec is republished (Standing Rule 43).** Do not
> patch it. The last map was patched instead of re-derived and that is the whole root cause.

> **⚠️ MAINTENANCE NOTE, 2026-08-10.** The specification has **not** moved — it is still
> Confluence **version 19**, so this derivation stands and was **not** re-derived. But the
> source-accuracy pass of 2026-08-10 changed the wording of two cases quoted below, so **four
> "says, verbatim" quotes were corrected in place to match live TestRail**: C38879 and C38896 now
> say **'Back to my view'**, the label `S11-R7` pins, in place of the build's *'Back To My Saved
> Filters'*. Nothing else in this file was touched, and no verdict changed.
> See `build/filters/source-accuracy-2026-08-10/SOURCE-ACCURACY.md` §3.

---

## HOW TO READ IT, AND THE RULES IT HAS TO SATISFY

* **Every requirement gets its own row with exactly one verdict** (Rule 43). An un-verdicted row is
  a visible hole.
* **A requirement making more than one assertion gets ONE ROW PER ASSERTION** (Rule 45(e)). This is
  where the real gaps were: `S10-R2` makes five promises and `S13-R21` makes six.
* **A "covered" verdict is only valid with BOTH TEXTS QUOTED SIDE BY SIDE** (Rule 45(e)). Every
  covered row below quotes the requirement verbatim from the live spec **and** the covering case's
  own words verbatim from live TestRail. *"Covered by C38896"* with nothing quoted is what produced
  the false all-clear on 31 July.
* **Verdicts:** `COVERED` · `PARTIAL` (recorded as one covered row plus one uncovered row, so the
  totals stay honest) · `UNCOVERED` · `NOT-TESTABLE` (with the reason) · `BLOCKED` (with what, and
  who owns it).
* **The build is not a source.** Expected behaviour comes from the PRD, the epic's stories, the PO's
  verified answers and the designs (Rule 57). The build supplies labels and a pass/fail verdict, and
  neither is a coverage question.

---

## THE TOTALS, RECONCILED

### Direction 1 — requirement → case

| | Count |
|---|---|
| Anchored requirements in spec v19 §7 | **132** |
| …of which `R` (requirements) | 104 |
| …of which `N` (negative cases) | 24 |
| …of which `E` (edge cases) | 4 |
| Requirements split into more than one assertion row | **17** |
| **Assertion rows in this map** | **151** |
| Distinct requirement anchors appearing as a row | **132** |
| Spec anchors with **no** row | **0** |
| Rows citing an anchor that **does not exist** in v19 | **0** |

**Reconciliation:** 132 requirements → 151 assertion rows (132 + 19 extra rows from the 17 split
requirements). Every anchor appears; nothing is un-verdicted.

| Verdict | Rows | Of 151 |
|---|---|---|
| **COVERED** | **133** | 88.1% |
| **UNCOVERED** | **11** | 7.3% |
| **BLOCKED** | **5** | 3.3% |
| **NOT-TESTABLE (with reason)** | **2** | 1.3% |

Counted at requirement level rather than assertion level: **113 of 132 requirements are fully
covered · 9 are partially covered · 5 are blocked · 4 have an uncovered assertion whose omission is
a recorded deliberate decision · 1 is not independently testable.**

### Direction 2 — case → requirement

| | Count |
|---|---|
| Cases live under group 4110 | **114** |
| Cases citing at least one numbered spec anchor | **103** |
| Cases citing **no** numbered anchor (sourced to §2/§4 prose, a PO answer or a design) | **11** |
| Cases citing an anchor that **no longer exists** in v19 — *orphans* | **0** |
| Cases named by at least one row of the map above | **99** |
| Cases named by no row, but citing a valid anchor already covered elsewhere | **4** |
| Cases named by no row and citing no anchor | **11** |
| Cases whose expectation rests on **no valid Rule-57 source at all** | **1** (C38881) |
| Cases whose `refs` pin a **superseded** spec version | **95** (all pin `[spec v18 2026-08-04]`) |
| Cases whose `refs` pin **no** spec version | **10** |
| Cases whose `refs` pin the current v19 | **9** |

Full detail in `ORPHANS.md`.

---

## TABLE A — the 132 anchored requirements, 151 assertion rows

### S1-R1

> **Requirement, verbatim (spec v19):** *"The filter bar is displayed below the tab navigation row (All, Estimates, Completed, My Work Orders) by default"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)  
> **[C29557](https://shopview.testrail.io/index.php?/cases/view/29557) says, verbatim:** *"A filter bar is visible directly below the tab row and above the work order table."*  
> **[C29557](https://shopview.testrail.io/index.php?/cases/view/29557) says, verbatim:** *"The filter bar is shown by default (expanded) without having to turn anything on."*  


### S1-R2

> **Requirement, verbatim (spec v19):** *"The filter bar contains five filter chips in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29558](https://shopview.testrail.io/index.php?/cases/view/29558)  
> **[C29558](https://shopview.testrail.io/index.php?/cases/view/29558) says, verbatim:** *"Exactly five filter chips appear, in this order: Status, Customer, Lead Technician, Service Advisor, Asset on Site."*  
> **[C29558](https://shopview.testrail.io/index.php?/cases/view/29558) says, verbatim:** *"The leading icon suits each filter (for example a status glyph for Status, a person for Customer, a wrench for Lead Technician, a headset for Service Advisor, a box for Asset on Site)."*  


### S1-R3

> **Requirement, verbatim (spec v19):** *"Each chip displays a leading type-icon identifying the filter, the filter name, and a chevron icon indicating it opens a dropdown"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29558](https://shopview.testrail.io/index.php?/cases/view/29558)  
> **[C29558](https://shopview.testrail.io/index.php?/cases/view/29558) says, verbatim:** *"Each chip shows a leading picture icon, then the filter name, then a down arrow (chevron) showing that it opens a dropdown."*  
*New at v19 (6 Aug). Ahtasham had already rewritten C29558 for it at 11:27Z, 21 min before Branko published.*  


### S1-R4

> **Requirement, verbatim (spec v19):** *"The page toolbar contains a toggle button that collapses and expands the filter bar"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29601](https://shopview.testrail.io/index.php?/cases/view/29601)  
> **[C29601](https://shopview.testrail.io/index.php?/cases/view/29601) says, verbatim:** *"The filter bar row is hidden."*  
> **[C29601](https://shopview.testrail.io/index.php?/cases/view/29601) says, verbatim:** *"The filter icon shows a pressed/active look while the bar is collapsed."*  
*The toggle's POSITION in the toolbar is asserted only in the step, not the expected result. SV-8903 (filed by Ahtasham today) alleges it is on the left instead of the right; no requirement states a side.*  


### S1-R5

> **Requirement, verbatim (spec v19):** *"When the user collapses the filter bar, the bar is hidden and the table expands to use the reclaimed vertical space"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29601](https://shopview.testrail.io/index.php?/cases/view/29601)  
> **[C29601](https://shopview.testrail.io/index.php?/cases/view/29601) says, verbatim:** *"The work order table moves up and uses the reclaimed vertical space."*  
> **[C29601](https://shopview.testrail.io/index.php?/cases/view/29601) says, verbatim:** *"The filter bar row is hidden."*  


### S1-R6

> **Requirement, verbatim (spec v19):** *"When the user expands the filter bar, the bar reappears in its previous state (with any active filters still shown)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29602](https://shopview.testrail.io/index.php?/cases/view/29602)  
> **[C29602](https://shopview.testrail.io/index.php?/cases/view/29602) says, verbatim:** *"The previously selected filters are still shown on their chips in the active (blue) state - nothing was lost while collapsed."*  
> **[C29602](https://shopview.testrail.io/index.php?/cases/view/29602) says, verbatim:** *"The filter bar reappears below the tab row."*  


### S1-R7

> **Requirement, verbatim (spec v19):** *"The collapsed/expanded state of the filter bar persists across navigation"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29603](https://shopview.testrail.io/index.php?/cases/view/29603), [C29613](https://shopview.testrail.io/index.php?/cases/view/29613)  
> **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) says, verbatim:** *"After step 4 the filter bar is expanded again when you return - whichever state you left it in is restored."*  
> **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) says, verbatim:** *"After step 2 the filter bar is still collapsed (your choice was remembered)."*  
> **[C29613](https://shopview.testrail.io/index.php?/cases/view/29613) says, verbatim:** *"After step 4 the filter bar comes back collapsed - the collapsed/expanded state is restored too."*  
> **[C29613](https://shopview.testrail.io/index.php?/cases/view/29613) says, verbatim:** *"The filter bar is still expanded (as you left it)."*  


### S1-N1

> **Requirement, verbatim (spec v19):** *"If no filters are available for the current tab (e.g., Estimates tab where Status is hidden), the filter bar still displays the remaining filter chips"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29559](https://shopview.testrail.io/index.php?/cases/view/29559)  
> **[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) says, verbatim:** *"The filter bar is still shown on this tab - it does not disappear."*  
> **[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) says, verbatim:** *"The Status chip is shown but greyed out and already filled in with this tab's own status, and cannot be clicked or changed."*  


### S2-R1

> **Requirement, verbatim (spec v19):** *"Clicking the Status chip opens a dropdown panel with a checkbox list of all possible work order statuses: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined, Imported"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29560](https://shopview.testrail.io/index.php?/cases/view/29560)  
> **[C29560](https://shopview.testrail.io/index.php?/cases/view/29560) says, verbatim:** *"It lists all nine statuses as checkboxes, in this order: Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported."*  
> **[C29560](https://shopview.testrail.io/index.php?/cases/view/29560) says, verbatim:** *"A dropdown panel opens under the Status chip."*  


### S2-R2

> **Requirement, verbatim (spec v19):** *"The user can select one or more statuses; the table updates to show only work orders matching any of the selected statuses"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29562](https://shopview.testrail.io/index.php?/cases/view/29562)  
> **[C29562](https://shopview.testrail.io/index.php?/cases/view/29562) says, verbatim:** *"The table shows work orders whose status matches ANY of the ticked statuses (both Estimate and Approved rows appear)."*  
> **[C29562](https://shopview.testrail.io/index.php?/cases/view/29562) says, verbatim:** *"Work orders in statuses that are not ticked are hidden."*  


### S2-R3

> **Requirement, verbatim (spec v19):** *"Selected statuses are indicated with a filled checkbox"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29561](https://shopview.testrail.io/index.php?/cases/view/29561)  
> **[C29561](https://shopview.testrail.io/index.php?/cases/view/29561) says, verbatim:** *"The ticked checkbox appears filled (checked)."*  
> **[C29561](https://shopview.testrail.io/index.php?/cases/view/29561) says, verbatim:** *"The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop."*  


### S2-R4

> **Requirement, verbatim (spec v19):** *"The dropdown includes a "Clear selection" action at the bottom that deselects all selected statuses and removes the filter"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29560](https://shopview.testrail.io/index.php?/cases/view/29560), [C29563](https://shopview.testrail.io/index.php?/cases/view/29563)  
> **[C29560](https://shopview.testrail.io/index.php?/cases/view/29560) says, verbatim:** *"A 'Clear Selection' action is shown at the bottom of the dropdown."*  
> **[C29560](https://shopview.testrail.io/index.php?/cases/view/29560) says, verbatim:** *"A dropdown panel opens under the Status chip."*  
> **[C29563](https://shopview.testrail.io/index.php?/cases/view/29563) says, verbatim:** *"Click 'Clear Selection' at the bottom of the dropdown."*  


### S2-R5

> **Requirement, verbatim (spec v19):** *"Clicking outside the dropdown closes it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29564](https://shopview.testrail.io/index.php?/cases/view/29564)  
> **[C29564](https://shopview.testrail.io/index.php?/cases/view/29564) says, verbatim:** *"The dropdown closes."*  


### S2-R6

> **Requirement, verbatim (spec v19):** *"The table filters in real time as the user makes selections (no confirm/apply button needed)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29561](https://shopview.testrail.io/index.php?/cases/view/29561)  
> **[C29561](https://shopview.testrail.io/index.php?/cases/view/29561) says, verbatim:** *"The table updates immediately to show only work orders in the selected status - there is no confirm or apply button on desktop."*  


### S2-R7

> **Requirement, verbatim (spec v19):** *"Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips. This is current production behaviour and is unchanged by this work"*

**Assertion:** (a) cannot be combined with anything else  
**VERDICT: COVERED**  
**Case(s):** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Imported cannot be combined with other statuses - selecting it works alone."*  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Unticking Imported re-enables the other chips and the normal list returns."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"Imported cannot be combined with another status: it works on its own."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"After you apply, the list shows imported work orders only."*  

**Assertion:** (b) selecting switches the list to the imported records  
**VERDICT: COVERED**  
**Case(s):** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Imported cannot be combined with other statuses - selecting it works alone."*  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Unticking Imported re-enables the other chips and the normal list returns."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"Imported cannot be combined with another status: it works on its own."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"After you apply, the list shows imported work orders only."*  

**Assertion:** (c) disables the other filter chips while active  
**VERDICT: COVERED**  
**Case(s):** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Imported cannot be combined with other statuses - selecting it works alone."*  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Unticking Imported re-enables the other chips and the normal list returns."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"Imported cannot be combined with another status: it works on its own."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"After you apply, the list shows imported work orders only."*  
*Desktop C38877; phone C43563 (authored today by the Vlad-review pass - it was Vlad's row 11).*  

**Assertion:** (d) deselecting returns the list and re-enables the chips  
**VERDICT: COVERED**  
**Case(s):** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Imported cannot be combined with other statuses - selecting it works alone."*  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Unticking Imported re-enables the other chips and the normal list returns."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"Imported cannot be combined with another status: it works on its own."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"After you apply, the list shows imported work orders only."*  


### S2-N1

> **Requirement, verbatim (spec v19):** *"On the Estimates tab, the Status filter chip is not shown: that tab already pre-filters by the Estimate status"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: BLOCKED**  
**Case(s):** [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)  
> **[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) says, verbatim:** *"The Status chip is shown, but greyed out and already filled in with this tab's own status (Estimate), because the tab already narrows the list to Estimate."*  
> **[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) says, verbatim:** *"After step 4 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list."*  
*Our case asserts the OPPOSITE of this requirement, deliberately, on Branko's 17 Jul Q4=B answer + the QA lead's 30 Jul ruling. Owner: Branko. See GAPS.md G1.*  


### S2-N2

> **Requirement, verbatim (spec v19):** *"On the Completed tab, the Status filter chip is not shown: that tab already pre-filters by the Complete status"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: BLOCKED**  
**Case(s):** [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)  
> **[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) says, verbatim:** *"The Status chip is shown, but greyed out and already filled in with this tab's own status (Complete), because the tab already narrows the list to Complete."*  
> **[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) says, verbatim:** *"The Status chip cannot be clicked or changed on this tab."*  
*Same as S2-N1. Owner: Branko.*  


### S2-N3

> **Requirement, verbatim (spec v19):** *"If no work orders match the selected statuses, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29565](https://shopview.testrail.io/index.php?/cases/view/29565), [C29635](https://shopview.testrail.io/index.php?/cases/view/29635)  
> **[C29565](https://shopview.testrail.io/index.php?/cases/view/29565) says, verbatim:** *"An empty state is displayed saying no results were found for the current filters (see the Empty State cases for its full content)."*  
> **[C29635](https://shopview.testrail.io/index.php?/cases/view/29635) says, verbatim:** *"The response contains an empty result set (zero work orders) - an empty match is a normal outcome, not an error."*  
> **[C29635](https://shopview.testrail.io/index.php?/cases/view/29635) says, verbatim:** *"The page renders the no-results empty state from this response."*  


### S2-N4

> **Requirement, verbatim (spec v19):** *"Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 rather than returning an empty result"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38877](https://shopview.testrail.io/index.php?/cases/view/38877), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"Imported cannot be combined with other statuses - selecting it works alone."*  
> **[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) says, verbatim:** *"The table switches to showing imported work orders only."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"Imported cannot be combined with another status: it works on its own."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"While Imported is ticked, the other filters cannot be used - they are greyed out or otherwise blocked, in the same way as on a desktop screen."*  


### S3-R1

> **Requirement, verbatim (spec v19):** *"Clicking the Customer chip opens a dropdown panel with a search input at the top and a scrollable list of customers below"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29566](https://shopview.testrail.io/index.php?/cases/view/29566)  
> **[C29566](https://shopview.testrail.io/index.php?/cases/view/29566) says, verbatim:** *"A dropdown panel opens under the Customer chip."*  
> **[C29566](https://shopview.testrail.io/index.php?/cases/view/29566) says, verbatim:** *"Below it is a scrollable list of customer names."*  
*⚠ The case asserts placeholder 'Search'; §4 Key Decisions and the Figma design both say 'Search customer'. See GAPS.md G2 - a Rule-57 defect, not a coverage gap.*  


### S3-R2

> **Requirement, verbatim (spec v19):** *"As the user types in the search field, the customer list filters to show only matching names"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29567](https://shopview.testrail.io/index.php?/cases/view/29567)  
> **[C29567](https://shopview.testrail.io/index.php?/cases/view/29567) says, verbatim:** *"The customer list narrows as you type, showing only names that match what you entered."*  
> **[C29567](https://shopview.testrail.io/index.php?/cases/view/29567) says, verbatim:** *"Customers that do not match are removed from the list."*  


### S3-R3

> **Requirement, verbatim (spec v19):** *"The user can select one or more customers; each selected customer appears as a tag/chip at the top of the dropdown input area"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)  
> **[C29568](https://shopview.testrail.io/index.php?/cases/view/29568) says, verbatim:** *"Each selected customer appears as a tag (small chip) with an x in the input area at the top of the dropdown."*  
> **[C29568](https://shopview.testrail.io/index.php?/cases/view/29568) says, verbatim:** *"Each selected customer's row in the list shows a checkmark on the right."*  


### S3-R4

> **Requirement, verbatim (spec v19):** *"Selected customers are indicated with a checkmark in the list"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)  
> **[C29568](https://shopview.testrail.io/index.php?/cases/view/29568) says, verbatim:** *"Each selected customer's row in the list shows a checkmark on the right."*  
> **[C29568](https://shopview.testrail.io/index.php?/cases/view/29568) says, verbatim:** *"Each selected customer appears as a tag (small chip) with an x in the input area at the top of the dropdown."*  


### S3-R5

> **Requirement, verbatim (spec v19):** *"The user can remove an individual selected customer by clicking the × on their tag"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29569](https://shopview.testrail.io/index.php?/cases/view/29569)  
> **[C29569](https://shopview.testrail.io/index.php?/cases/view/29569) says, verbatim:** *"That customer's tag disappears from the input area."*  
> **[C29569](https://shopview.testrail.io/index.php?/cases/view/29569) says, verbatim:** *"The checkmark next to that customer in the list is removed."*  


### S3-R6

> **Requirement, verbatim (spec v19):** *"The table updates to show only work orders belonging to any of the selected customers"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29570](https://shopview.testrail.io/index.php?/cases/view/29570)  
> **[C29570](https://shopview.testrail.io/index.php?/cases/view/29570) says, verbatim:** *"The table shows only work orders whose customer is one of the two selected customers."*  
> **[C29570](https://shopview.testrail.io/index.php?/cases/view/29570) says, verbatim:** *"Work orders belonging to any other customer are hidden."*  


### S3-R7

> **Requirement, verbatim (spec v19):** *"The dropdown includes a "Clear selection" action at the bottom that removes all selected customers"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29571](https://shopview.testrail.io/index.php?/cases/view/29571)  
> **[C29571](https://shopview.testrail.io/index.php?/cases/view/29571) says, verbatim:** *"The Customer filter is removed and the table shows work orders of all customers again."*  


### S3-R8

> **Requirement, verbatim (spec v19):** *"Clicking outside the dropdown closes it; selected tags remain visible"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29572](https://shopview.testrail.io/index.php?/cases/view/29572)  
> **[C29572](https://shopview.testrail.io/index.php?/cases/view/29572) says, verbatim:** *"The dropdown closes when you click outside it."*  
> **[C29572](https://shopview.testrail.io/index.php?/cases/view/29572) says, verbatim:** *"When reopened, the selected customers' tags are still visible in the input area."*  


### S3-N1

> **Requirement, verbatim (spec v19):** *"If the search query returns no matching customers, the list shows a "No results" message"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29573](https://shopview.testrail.io/index.php?/cases/view/29573)  
> **[C29573](https://shopview.testrail.io/index.php?/cases/view/29573) says, verbatim:** *"The list shows a message saying there are no results (instead of an empty gap)."*  
> **[C29573](https://shopview.testrail.io/index.php?/cases/view/29573) says, verbatim:** *"Clearing the search text brings the customer list back."*  


### S3-N2

> **Requirement, verbatim (spec v19):** *"If no work orders match the selected customers, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29574](https://shopview.testrail.io/index.php?/cases/view/29574)  
> **[C29574](https://shopview.testrail.io/index.php?/cases/view/29574) says, verbatim:** *"The customer with no work orders IS shown in the filter list (they are not hidden)."*  
> **[C29574](https://shopview.testrail.io/index.php?/cases/view/29574) says, verbatim:** *"After selecting only that customer, the table shows no rows and the filtered empty state is displayed."*  


### S3-E1

> **Requirement, verbatim (spec v19):** *"If a customer has no open work orders, they still appear in the filter list: filtering by them simply returns an empty result set"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29574](https://shopview.testrail.io/index.php?/cases/view/29574)  
> **[C29574](https://shopview.testrail.io/index.php?/cases/view/29574) says, verbatim:** *"The customer with no work orders IS shown in the filter list (they are not hidden)."*  
> **[C29574](https://shopview.testrail.io/index.php?/cases/view/29574) says, verbatim:** *"After selecting only that customer, the table shows no rows and the filtered empty state is displayed."*  


### S4-R1

> **Requirement, verbatim (spec v19):** *"Clicking the Lead Technician chip opens a dropdown panel with a search input at the top and a scrollable list of technicians below"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29575](https://shopview.testrail.io/index.php?/cases/view/29575), [C29626](https://shopview.testrail.io/index.php?/cases/view/29626)  
> **[C29575](https://shopview.testrail.io/index.php?/cases/view/29575) says, verbatim:** *"A dropdown panel opens under the Lead Technician chip."*  
> **[C29575](https://shopview.testrail.io/index.php?/cases/view/29575) says, verbatim:** *"Below it is a scrollable list of technician names."*  
> **[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) says, verbatim:** *"The Lead Technician row opens with a 'Search' field and the technician list."*  
> **[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) says, verbatim:** *"The Service Advisor row opens with a 'Search' field and the advisor list."*  
*⚠ placeholder 'Search' vs the documents' 'Search technician' - GAPS.md G2.*  


### S4-R2

> **Requirement, verbatim (spec v19):** *"As the user types in the search field, the technician list filters to show only matching names"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29576](https://shopview.testrail.io/index.php?/cases/view/29576)  
> **[C29576](https://shopview.testrail.io/index.php?/cases/view/29576) says, verbatim:** *"The technician list narrows to only the names matching what you typed."*  
> **[C29576](https://shopview.testrail.io/index.php?/cases/view/29576) says, verbatim:** *"Deleting the text brings the full list back."*  


### S4-R3

> **Requirement, verbatim (spec v19):** *"The user can select one or more technicians; selected technicians are indicated with a filled checkbox"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29577](https://shopview.testrail.io/index.php?/cases/view/29577)  
> **[C29577](https://shopview.testrail.io/index.php?/cases/view/29577) says, verbatim:** *"The table shows only work orders where one of the selected technicians is assigned as the LEAD technician."*  
> **[C29577](https://shopview.testrail.io/index.php?/cases/view/29577) says, verbatim:** *"Selected technicians show a checkmark on the row, and as a small removable tag above the list in the list."*  


### S4-R4

> **Requirement, verbatim (spec v19):** *"The table updates to show only work orders where the selected users are assigned as lead technician"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29577](https://shopview.testrail.io/index.php?/cases/view/29577)  
> **[C29577](https://shopview.testrail.io/index.php?/cases/view/29577) says, verbatim:** *"The table shows only work orders where one of the selected technicians is assigned as the LEAD technician."*  
> **[C29577](https://shopview.testrail.io/index.php?/cases/view/29577) says, verbatim:** *"A work order where the technician is assigned only in a non-lead role does not appear."*  


### S4-R5

> **Requirement, verbatim (spec v19):** *"The dropdown includes a "Clear selection" action at the bottom"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29578](https://shopview.testrail.io/index.php?/cases/view/29578)  
> **[C29578](https://shopview.testrail.io/index.php?/cases/view/29578) says, verbatim:** *"Open the Lead Technician dropdown and click 'Clear Selection' at the bottom."*  


### S4-R6

> **Requirement, verbatim (spec v19):** *"Clicking outside the dropdown closes it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29579](https://shopview.testrail.io/index.php?/cases/view/29579)  
> **[C29579](https://shopview.testrail.io/index.php?/cases/view/29579) says, verbatim:** *"The dropdown closes."*  


### S4-N1

> **Requirement, verbatim (spec v19):** *"If no work orders match the selected technicians, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29580](https://shopview.testrail.io/index.php?/cases/view/29580)  
> **[C29580](https://shopview.testrail.io/index.php?/cases/view/29580) says, verbatim:** *"The table shows no rows and the filtered empty state is displayed."*  


### S4-E1

> **Requirement, verbatim (spec v19):** *"If a technician is no longer active, they are not shown in the filter list"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29581](https://shopview.testrail.io/index.php?/cases/view/29581)  
> **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) says, verbatim:** *"The deactivated technician is NOT shown in the filter list."*  
> **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) says, verbatim:** *"Active technicians are still listed normally."*  


### S5-R1

> **Requirement, verbatim (spec v19):** *"Clicking the Service Advisor chip opens a dropdown panel with a search input at the top and a scrollable list of advisors below"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29582](https://shopview.testrail.io/index.php?/cases/view/29582), [C29626](https://shopview.testrail.io/index.php?/cases/view/29626)  
> **[C29582](https://shopview.testrail.io/index.php?/cases/view/29582) says, verbatim:** *"A dropdown panel opens under the Service Advisor chip."*  
> **[C29582](https://shopview.testrail.io/index.php?/cases/view/29582) says, verbatim:** *"Below it is a scrollable list of advisor names."*  
> **[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) says, verbatim:** *"The Service Advisor row opens with a 'Search' field and the advisor list."*  
> **[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) says, verbatim:** *"The Lead Technician row opens with a 'Search' field and the technician list."*  
*⚠ placeholder 'Search' vs the design's 'Search advisor' - GAPS.md G2.*  


### S5-R2

> **Requirement, verbatim (spec v19):** *"As the user types, the list filters to matching names"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29583](https://shopview.testrail.io/index.php?/cases/view/29583)  
> **[C29583](https://shopview.testrail.io/index.php?/cases/view/29583) says, verbatim:** *"The advisor list narrows to only the names matching what you typed."*  
> **[C29583](https://shopview.testrail.io/index.php?/cases/view/29583) says, verbatim:** *"Deleting the text brings the full list back."*  


### S5-R3

> **Requirement, verbatim (spec v19):** *"The user can select one or more advisors; selected advisors are indicated with a filled checkbox"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29584](https://shopview.testrail.io/index.php?/cases/view/29584)  
> **[C29584](https://shopview.testrail.io/index.php?/cases/view/29584) says, verbatim:** *"Selected advisors show a checkmark on the row, and as a small removable tag above the list in the list."*  
> **[C29584](https://shopview.testrail.io/index.php?/cases/view/29584) says, verbatim:** *"The table shows only work orders assigned to any of the selected advisors."*  


### S5-R4

> **Requirement, verbatim (spec v19):** *"The table updates to show only work orders assigned to the selected advisors"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29584](https://shopview.testrail.io/index.php?/cases/view/29584)  
> **[C29584](https://shopview.testrail.io/index.php?/cases/view/29584) says, verbatim:** *"The table shows only work orders assigned to any of the selected advisors."*  
> **[C29584](https://shopview.testrail.io/index.php?/cases/view/29584) says, verbatim:** *"Selected advisors show a checkmark on the row, and as a small removable tag above the list in the list."*  


### S5-R5

> **Requirement, verbatim (spec v19):** *"The dropdown includes a "Clear selection" action at the bottom"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29585](https://shopview.testrail.io/index.php?/cases/view/29585)  
> **[C29585](https://shopview.testrail.io/index.php?/cases/view/29585) says, verbatim:** *"Open the Service Advisor dropdown and click 'Clear Selection' at the bottom."*  


### S5-R6

> **Requirement, verbatim (spec v19):** *"Clicking outside the dropdown closes it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29586](https://shopview.testrail.io/index.php?/cases/view/29586)  
> **[C29586](https://shopview.testrail.io/index.php?/cases/view/29586) says, verbatim:** *"The dropdown closes."*  


### S5-N1

> **Requirement, verbatim (spec v19):** *"If no work orders match the selected advisors, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29587](https://shopview.testrail.io/index.php?/cases/view/29587)  
> **[C29587](https://shopview.testrail.io/index.php?/cases/view/29587) says, verbatim:** *"The table shows no rows and the filtered empty state is displayed."*  


### S5-E1

> **Requirement, verbatim (spec v19):** *"If an advisor is no longer active, they are not shown in the filter list"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29588](https://shopview.testrail.io/index.php?/cases/view/29588)  
> **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588) says, verbatim:** *"The deactivated advisor is NOT shown in the filter list."*  
> **[C29588](https://shopview.testrail.io/index.php?/cases/view/29588) says, verbatim:** *"Active advisors are still listed normally."*  


### S6-R1

> **Requirement, verbatim (spec v19):** *"Clicking the Asset on Site chip opens a dropdown panel with two options: Yes and No"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29589](https://shopview.testrail.io/index.php?/cases/view/29589), [C29627](https://shopview.testrail.io/index.php?/cases/view/29627)  
> **[C29589](https://shopview.testrail.io/index.php?/cases/view/29589) says, verbatim:** *"A small dropdown panel opens under the Asset on Site chip."*  
> **[C29589](https://shopview.testrail.io/index.php?/cases/view/29589) says, verbatim:** *"It contains exactly two options: Yes and No."*  
> **[C29627](https://shopview.testrail.io/index.php?/cases/view/29627) says, verbatim:** *"The Asset on Site row opens showing the two options Yes and No plus 'Clear Selection'."*  
> **[C29627](https://shopview.testrail.io/index.php?/cases/view/29627) says, verbatim:** *"After applying, the list shows only work orders matching the chosen on-site state."*  


### S6-R2

> **Requirement, verbatim (spec v19):** *"The user selects one option; the table updates to show only work orders matching that asset on-site status"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29590](https://shopview.testrail.io/index.php?/cases/view/29590), [C38878](https://shopview.testrail.io/index.php?/cases/view/38878)  
> **[C29590](https://shopview.testrail.io/index.php?/cases/view/29590) says, verbatim:** *"The table shows only work orders whose asset is currently on site."*  
> **[C29590](https://shopview.testrail.io/index.php?/cases/view/29590) says, verbatim:** *"Work orders whose asset is not on site are hidden."*  
> **[C38878](https://shopview.testrail.io/index.php?/cases/view/38878) says, verbatim:** *"Only work orders whose asset is NOT on site remain in the list."*  
> **[C38878](https://shopview.testrail.io/index.php?/cases/view/38878) says, verbatim:** *"Every work order with the asset on site is excluded."*  
*Both values exercised: Yes by C29590, No by C38878.*  


### S6-R3

> **Requirement, verbatim (spec v19):** *"Only one option can be selected at a time (single-select)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29591](https://shopview.testrail.io/index.php?/cases/view/29591)  
> **[C29591](https://shopview.testrail.io/index.php?/cases/view/29591) says, verbatim:** *"No becomes the selected option and Yes is deselected automatically - only one option can be selected at a time."*  
> **[C29591](https://shopview.testrail.io/index.php?/cases/view/29591) says, verbatim:** *"The table switches to showing only the not-on-site work orders."*  


### S6-R4

> **Requirement, verbatim (spec v19):** *"The dropdown includes a "Clear selection" action that removes the filter"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29592](https://shopview.testrail.io/index.php?/cases/view/29592)  
> **[C29592](https://shopview.testrail.io/index.php?/cases/view/29592) says, verbatim:** *"The selection is removed and the chip returns to its default (inactive) state."*  


### S6-R5

> **Requirement, verbatim (spec v19):** *"Clicking outside the dropdown closes it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29593](https://shopview.testrail.io/index.php?/cases/view/29593)  
> **[C29593](https://shopview.testrail.io/index.php?/cases/view/29593) says, verbatim:** *"The dropdown closes."*  


### S6-N1

> **Requirement, verbatim (spec v19):** *"If no work orders match the selected option, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29594](https://shopview.testrail.io/index.php?/cases/view/29594)  
> **[C29594](https://shopview.testrail.io/index.php?/cases/view/29594) says, verbatim:** *"The table shows no rows and the filtered empty state is displayed."*  


### S7-R1

> **Requirement, verbatim (spec v19):** *"When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29595](https://shopview.testrail.io/index.php?/cases/view/29595), [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)  
> **[C29595](https://shopview.testrail.io/index.php?/cases/view/29595) says, verbatim:** *"The Status chip changes to an active/highlighted look (blue pill)."*  
> **[C29595](https://shopview.testrail.io/index.php?/cases/view/29595) says, verbatim:** *"The chip displays the selected value (for example 'Status: Estimate')."*  
> **[C29628](https://shopview.testrail.io/index.php?/cases/view/29628) says, verbatim:** *"The chip for the applied filter shows the active state with the selected value(s), like on desktop."*  
> **[C29628](https://shopview.testrail.io/index.php?/cases/view/29628) says, verbatim:** *"A 'Clear Filters' control appears while at least one filter is active."*  


### S7-R2

> **Requirement, verbatim (spec v19):** *"If multiple values are selected for a single filter, the chip displays the first value followed by a count of additional selections (e.g., "Status: Estimate, In progress, Approved…")"*

**Assertion:** (a) the chip displays the first value  
**VERDICT: COVERED**  
**Case(s):** [C29596](https://shopview.testrail.io/index.php?/cases/view/29596)  
> **[C29596](https://shopview.testrail.io/index.php?/cases/view/29596) says, verbatim:** *"The chip lists the selected values starting with the first one and shortens the label when it gets too long (the design shows 'Status: Estimate, In progress, Approved...')."*  
> **[C29596](https://shopview.testrail.io/index.php?/cases/view/29596) says, verbatim:** *"The chip stays a single compact pill - it does not grow to show every value in full."*  

**Assertion:** (b) followed by a COUNT of additional selections  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*No case asserts a count. The requirement contradicts ITSELF in the same sentence - its own example shows a comma list with an ellipsis ('Status: Estimate, In progress, Approved...'), not a count, and our case follows the example. Unchanged since v1 (13 May), so trap (c) does not rescue either reading. Owner: Branko. GAPS.md G3.*  


### S7-R3

> **Requirement, verbatim (spec v19):** *"When at least one filter is active, a "Clear filters" button appears in the filter bar to the right of all chips"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."*  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."*  


### S7-R4

> **Requirement, verbatim (spec v19):** *"When the filter bar is collapsed and at least one filter is active, the toolbar collapse/expand toggle displays a visual indicator (e.g., filters icon in primary blue color) signalling that active filters are in effect"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29604](https://shopview.testrail.io/index.php?/cases/view/29604)  
> **[C29604](https://shopview.testrail.io/index.php?/cases/view/29604) says, verbatim:** *"After step 3 the filter icon shows a visual indicator (filters icon in primary blue) signalling that active filters are in effect while the bar is hidden."*  
> **[C29604](https://shopview.testrail.io/index.php?/cases/view/29604) says, verbatim:** *"After step 1 the filter icon shows no special indicator (only its normal pressed look)."*  


### S7-R5

> **Requirement, verbatim (spec v19):** *"When the filter bar is collapsed with active filters, the table continues to apply all active filters"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29605](https://shopview.testrail.io/index.php?/cases/view/29605)  
> **[C29605](https://shopview.testrail.io/index.php?/cases/view/29605) says, verbatim:** *"The table content does not change when the bar collapses - it still shows only the work orders matching the active filters."*  
> **[C29605](https://shopview.testrail.io/index.php?/cases/view/29605) says, verbatim:** *"Hiding the bar only hides the chips; it does not remove or pause the filtering."*  


### S7-N1

> **Requirement, verbatim (spec v19):** *"When no filters are active, the "Clear filters" button is not shown"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."*  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."*  


### S7-N2

> **Requirement, verbatim (spec v19):** *"When no filters are active and the bar is collapsed, the toolbar toggle shows no indicator"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29604](https://shopview.testrail.io/index.php?/cases/view/29604)  
> **[C29604](https://shopview.testrail.io/index.php?/cases/view/29604) says, verbatim:** *"After step 3 the filter icon shows a visual indicator (filters icon in primary blue) signalling that active filters are in effect while the bar is hidden."*  
> **[C29604](https://shopview.testrail.io/index.php?/cases/view/29604) says, verbatim:** *"After step 1 the filter icon shows no special indicator (only its normal pressed look)."*  


### S8-R1

> **Requirement, verbatim (spec v19):** *"Clicking "Clear filters" removes all active filter selections across all filters; all chips return to their default (inactive) state"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29598](https://shopview.testrail.io/index.php?/cases/view/29598)  
> **[C29598](https://shopview.testrail.io/index.php?/cases/view/29598) says, verbatim:** *"All chips return to their default (inactive) look with no values shown."*  
> **[C29598](https://shopview.testrail.io/index.php?/cases/view/29598) says, verbatim:** *"Every active filter is cleared in one click."*  


### S8-R2

> **Requirement, verbatim (spec v19):** *"Each filter dropdown includes a "Clear selection" action that removes only the selections for that specific filter without affecting others"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29599](https://shopview.testrail.io/index.php?/cases/view/29599), [C29563](https://shopview.testrail.io/index.php?/cases/view/29563), [C29571](https://shopview.testrail.io/index.php?/cases/view/29571), [C29578](https://shopview.testrail.io/index.php?/cases/view/29578), [C29585](https://shopview.testrail.io/index.php?/cases/view/29585), [C29592](https://shopview.testrail.io/index.php?/cases/view/29592)  
> **[C29599](https://shopview.testrail.io/index.php?/cases/view/29599) says, verbatim:** *"Only the Status filter is cleared - its chip returns to default."*  
> **[C29599](https://shopview.testrail.io/index.php?/cases/view/29599) says, verbatim:** *"The Customer filter stays selected and active (blue) and keeps filtering the table."*  
> **[C29563](https://shopview.testrail.io/index.php?/cases/view/29563) says, verbatim:** *"Only the Status filter is affected - any other active filters stay applied."*  


### S8-R3

> **Requirement, verbatim (spec v19):** *"When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38897](https://shopview.testrail.io/index.php?/cases/view/38897), [C29606](https://shopview.testrail.io/index.php?/cases/view/29606)  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"The table is replaced by a no-results message that mentions BOTH the current filters and the search - not the filters alone."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."*  
> **[C29606](https://shopview.testrail.io/index.php?/cases/view/29606) says, verbatim:** *"The empty state shows a message saying no results were found for the filters and the search you have on."*  
> **[C29606](https://shopview.testrail.io/index.php?/cases/view/29606) says, verbatim:** *"The table body is replaced by an empty state (not just a bare empty grid)."*  


### S8-R4

> **Requirement, verbatim (spec v19):** *"The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29607](https://shopview.testrail.io/index.php?/cases/view/29607), [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)  
> **[C29607](https://shopview.testrail.io/index.php?/cases/view/29607) says, verbatim:** *"The empty state includes a link to clear the filters, and - when you also have a search on - a separate way to clear just the search."*  
> **[C29607](https://shopview.testrail.io/index.php?/cases/view/29607) says, verbatim:** *"Note for the tester: on the build this test was run against the empty screen offers only a "Clear Filters" link."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"Note for the tester: on the build this was checked against the message reads "No work orders match your filters" and never mentions the search - even when a search is the only thing narrowing the list - and the screen offers only a "Clear Filters" link with no way to clear just the search."*  


### S8-R5

> **Requirement, verbatim (spec v19):** *"Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38884](https://shopview.testrail.io/index.php?/cases/view/38884), [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"With both active, the results match the filter AND the search together (both narrow the list at once)."*  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"Clearing the filters leaves your typed word in the box and still applied - each is cleared on its own without wiping the other."*  


### S8-N1

> **Requirement, verbatim (spec v19):** *"If no filters are active, the "Clear filters" button is not visible and cannot be clicked"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29597](https://shopview.testrail.io/index.php?/cases/view/29597)  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"With no filters active, no 'Clear Filters' button/link is shown (there is nothing to click)."*  
> **[C29597](https://shopview.testrail.io/index.php?/cases/view/29597) says, verbatim:** *"As soon as one filter is active, a blue 'Clear Filters' link appears at the right end of the chip row."*  


### S9-R1

> **Requirement, verbatim (spec v19):** *"On the All tab, all five filters (Status, Customer, Lead Technician, Service Advisor, Asset on Site) are shown and active"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29608](https://shopview.testrail.io/index.php?/cases/view/29608)  
> **[C29608](https://shopview.testrail.io/index.php?/cases/view/29608) says, verbatim:** *"All five chips are shown: Status, Customer, Lead Technician, Service Advisor, Asset on Site."*  


### S9-R2

> **Requirement, verbatim (spec v19):** *"On the Estimates tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: BLOCKED**  
**Case(s):** [C29609](https://shopview.testrail.io/index.php?/cases/view/29609), [C29559](https://shopview.testrail.io/index.php?/cases/view/29559), [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)  
> **[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) says, verbatim:** *"The Status chip is shown, but greyed out and already filled in with this tab's own status (Estimate), because the tab already narrows the list to Estimate."*  
> **[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) says, verbatim:** *"The Status chip cannot be clicked or changed on this tab."*  
> **[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) says, verbatim:** *"The Status chip is shown but greyed out and already filled in with this tab's own status, and cannot be clicked or changed."*  
> **[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) says, verbatim:** *"The filter bar is still shown on this tab - it does not disappear."*  
*Same dispute as S2-N1. Our cases follow Branko's answer. Owner: Branko. GAPS.md G1.*  


### S9-R3

> **Requirement, verbatim (spec v19):** *"On the Completed tab, the Status filter chip is hidden; the remaining four filters are shown and apply on top of the Completed pre-filter"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: BLOCKED**  
**Case(s):** [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)  
> **[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) says, verbatim:** *"The Status chip is shown, but greyed out and already filled in with this tab's own status (Complete), because the tab already narrows the list to Complete."*  
> **[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) says, verbatim:** *"The Status chip cannot be clicked or changed on this tab."*  
*Same dispute. Owner: Branko. GAPS.md G1.*  


### S9-R4

> **Requirement, verbatim (spec v19):** *"On the My Work Orders tab, all five filters are shown; the table already scopes results to work orders assigned to the logged-in user, and the filters apply on top of that scope"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29611](https://shopview.testrail.io/index.php?/cases/view/29611)  
> **[C29611](https://shopview.testrail.io/index.php?/cases/view/29611) says, verbatim:** *"The table only ever shows work orders assigned to you (the tab's own scope stays)."*  
> **[C29611](https://shopview.testrail.io/index.php?/cases/view/29611) says, verbatim:** *"All five filter chips are shown on the My Work Orders tab."*  


### S9-R5

> **Requirement, verbatim (spec v19):** *"Filter selections are maintained when switching between tabs; selections that are incompatible with a tab (e.g., a Status selection on the Estimates tab) are not applied but are retained in memory so they reappear if the user switches back to the All tab"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)  
> **[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) says, verbatim:** *"Back on the All tab the Status chip is usable again and shows the SAME selection (Approved) still applied - your choice was kept, not thrown away."*  
> **[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) says, verbatim:** *"On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is greyed out and already filled in with that tab's own status."*  


### S9-N1

> **Requirement, verbatim (spec v19):** *"A Status selection made on the All tab does not carry over visually to the Estimates or Completed tabs, but is not lost"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29612](https://shopview.testrail.io/index.php?/cases/view/29612)  
> **[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) says, verbatim:** *"Back on the All tab the Status chip is usable again and shows the SAME selection (Approved) still applied - your choice was kept, not thrown away."*  
> **[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) says, verbatim:** *"On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is greyed out and already filled in with that tab's own status."*  
*COVERED by the case text, but NO case cites S9-N1 in its refs - a traceability gap, not a coverage gap. Proposed refs fix P1.*  


### S10-R1

> **Requirement, verbatim (spec v19):** *"When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29613](https://shopview.testrail.io/index.php?/cases/view/29613), [C29603](https://shopview.testrail.io/index.php?/cases/view/29603), [C43560](https://shopview.testrail.io/index.php?/cases/view/43560)  
> **[C29613](https://shopview.testrail.io/index.php?/cases/view/29613) says, verbatim:** *"After step 4 the filter bar comes back collapsed - the collapsed/expanded state is restored too."*  
> **[C29613](https://shopview.testrail.io/index.php?/cases/view/29613) says, verbatim:** *"The filter bar is still expanded (as you left it)."*  
> **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) says, verbatim:** *"After step 4 the filter bar is expanded again when you return - whichever state you left it in is restored."*  
> **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) says, verbatim:** *"After step 2 the filter bar is still collapsed (your choice was remembered)."*  


### S10-R2

> **Requirement, verbatim (spec v19):** *"Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"*

**Assertion:** (a) stored server-side against the user account  
**VERDICT: COVERED**  
**Case(s):** [C38895](https://shopview.testrail.io/index.php?/cases/view/38895)  
> **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) says, verbatim:** *"Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200)."*  
> **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) says, verbatim:** *"On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them."*  

**Assertion:** (b) survive logout  
**VERDICT: COVERED**  
**Case(s):** [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)  
> **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) says, verbatim:** *"After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session."*  
> **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) says, verbatim:** *"The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."*  

**Assertion:** (c) sync across the user's devices  
**VERDICT: COVERED**  
**Case(s):** [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)  
> **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) says, verbatim:** *"The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."*  

**Assertion:** (d) where two devices write different state, last write wins  
**VERDICT: COVERED**  
**Case(s):** [C43560](https://shopview.testrail.io/index.php?/cases/view/43560)  
> **[C43560](https://shopview.testrail.io/index.php?/cases/view/43560) says, verbatim:** *"After the reload in step 6, Browser B likewise shows the newest saved state, including the Customer filter that Browser A added in step 5."*  
> **[C43560](https://shopview.testrail.io/index.php?/cases/view/43560) says, verbatim:** *"Nothing is merged and nothing is duplicated: whichever browser saved last is the one whose filters both browsers end up with."*  
*Was Vlad's row 3b and was a REAL gap until this morning; C43560 was authored by the Vlad-review pass today.*  

**Assertion:** (e) not browser-local storage; does not expire with a browser session  
**VERDICT: COVERED**  
**Case(s):** [C29614](https://shopview.testrail.io/index.php?/cases/view/29614)  
> **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) says, verbatim:** *"After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session."*  
> **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) says, verbatim:** *"The same filter selections are applied on the other computer too - the filters are saved to your account, not to one computer or browser (to confirm live once built)."*  


### S10-R3

> **Requirement, verbatim (spec v19):** *"Filter selections are saved per user: one user's filters do not affect another user's view"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29615](https://shopview.testrail.io/index.php?/cases/view/29615), [C38895](https://shopview.testrail.io/index.php?/cases/view/38895)  
> **[C29615](https://shopview.testrail.io/index.php?/cases/view/29615) says, verbatim:** *"User B's new filter does not change what user A sees; each user keeps their own saved filter state."*  
> **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) says, verbatim:** *"Changing a filter sends a save (PUT) to the per-user page-preferences service carrying the page's state, and it succeeds (HTTP 200)."*  
> **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) says, verbatim:** *"On reload the page requests the saved state back (GET, HTTP 200) and applies it - the filters return without you redoing them."*  
*Both cases are AUTOMATION: HOLD - a second test login does not exist on this branch.*  


### S10-R4

> **Requirement, verbatim (spec v19):** *"Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions. Persistence and scope are separate concerns: each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38880](https://shopview.testrail.io/index.php?/cases/view/38880), [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)  
> **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) says, verbatim:** *"The second Parts view does NOT show the first view's selections - each view keeps its own."*  
> **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) says, verbatim:** *"Report tabs likewise keep separate filter choices, each remembered and restored on its own tab."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."*  
*HOLD - waiting on Branko's Parts/Reports write-up.*  


### S10-R5

> **Requirement, verbatim (spec v19):** *"The search query is not covered by this story. It is scoped to the browser tab session and is never written to the user account. See S13-R14 and S13-R25"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"The second browser tab starts clean: its Search box is empty and it shows the full list."*  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."*  


### S10-N1

> **Requirement, verbatim (spec v19):** *"If a previously selected filter value no longer exists (e.g., a customer was deleted), the system silently ignores that value and the filter updates to reflect only valid selections"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29616](https://shopview.testrail.io/index.php?/cases/view/29616), [C29633](https://shopview.testrail.io/index.php?/cases/view/29633)  
> **[C29616](https://shopview.testrail.io/index.php?/cases/view/29616) says, verbatim:** *"The deleted customer is silently ignored - no error or warning appears."*  
> **[C29616](https://shopview.testrail.io/index.php?/cases/view/29616) says, verbatim:** *"The Customer filter now reflects only the still-valid selection (the real customer)."*  
> **[C29633](https://shopview.testrail.io/index.php?/cases/view/29633) says, verbatim:** *"The response is a normal, successful list response - the invalid value is ignored or simply matches nothing."*  
> **[C29633](https://shopview.testrail.io/index.php?/cases/view/29633) says, verbatim:** *"Any still-valid filter values in the same request are applied normally."*  


### S11-R1

> **Requirement, verbatim (spec v19):** *"When a user applies one or more filters, the page URL updates to reflect the active filter state"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29617](https://shopview.testrail.io/index.php?/cases/view/29617)  
> **[C29617](https://shopview.testrail.io/index.php?/cases/view/29617) says, verbatim:** *"After step 1 the URL changes to include the active filter state."*  
> **[C29617](https://shopview.testrail.io/index.php?/cases/view/29617) says, verbatim:** *"After step 3 the filter part of the URL is removed again."*  


### S11-R2

> **Requirement, verbatim (spec v19):** *"When a user opens a URL that contains filter state, the Work Orders page loads with those filters pre-applied and the table already filtered"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29618](https://shopview.testrail.io/index.php?/cases/view/29618)  
> **[C29618](https://shopview.testrail.io/index.php?/cases/view/29618) says, verbatim:** *"The page opens with the same filters already applied - chips active with the same values."*  
> **[C29618](https://shopview.testrail.io/index.php?/cases/view/29618) says, verbatim:** *"The table is already filtered accordingly on load (no need to re-apply anything)."*  


### S11-R3

> **Requirement, verbatim (spec v19):** *"If the URL contains a filter value that no longer exists (e.g., a deleted customer), the system ignores that value and loads the page without it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29619](https://shopview.testrail.io/index.php?/cases/view/29619), [C29633](https://shopview.testrail.io/index.php?/cases/view/29633)  
> **[C29619](https://shopview.testrail.io/index.php?/cases/view/29619) says, verbatim:** *"Known issue: a value in the address bar that no longer exists is still sent to the server, so you get an empty list instead of the list without that value."*  
> **[C29619](https://shopview.testrail.io/index.php?/cases/view/29619) says, verbatim:** *"The deleted value is ignored; only the still-valid filter value is applied and shown on the chips."*  
> **[C29633](https://shopview.testrail.io/index.php?/cases/view/29633) says, verbatim:** *"The response is a normal, successful list response - the invalid value is ignored or simply matches nothing."*  


### S11-R4

> **Requirement, verbatim (spec v19):** *"The active search query is reflected in the page URL alongside the filter state, so a filtered-and-searched view can be shared or bookmarked"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."*  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"The address contains the search term after step 1."*  


### S11-R5

> **Requirement, verbatim (spec v19):** *"Opening a URL that contains a search query loads the page with that query pre-applied and the search control in its filled state, matching the filter behaviour in S11-R2"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"The address contains the search term after step 1."*  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"The fresh tab opens with the search box filled and the list already narrowed."*  


### S11-R6

> **Requirement, verbatim (spec v19):** *"Filter state arriving from a URL applies at runtime only. It never overwrites the user's saved filter state (S10-R2). Changes the user makes to filters while viewing a shared link are also not written back to their saved state: the entire visit is treated as a temporary view"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38879](https://shopview.testrail.io/index.php?/cases/view/38879)  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"The link's filters apply for viewing only - the page shows the shared view."*  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"Changes made during the link visit are also NOT saved to your account."*  


### S11-R7

> **Requirement, verbatim (spec v19):** *"While viewing filter state that arrived from a URL, a "Back to my view" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately "my view" rather than "my filters", since the action affects both filters and search"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38879](https://shopview.testrail.io/index.php?/cases/view/38879), [C38896](https://shopview.testrail.io/index.php?/cases/view/38896)  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back."*  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"Clicking 'Back to my view' brings back your own saved filters and removes the filter part from the web address."*  
> **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) says, verbatim:** *"On your own view there is no 'Back to my view' option anywhere - it only belongs to a shared-link visit."*  
> **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) says, verbatim:** *"When you open the shared link, 'Back to my view' does appear."*  
*Vlad's row 2. He looked at C38896 (the negative) and missed C38879, whose TITLE advertises S11-R6. Findability, not coverage.*  


### S11-R8

> **Requirement, verbatim (spec v19):** *"S11-R6 does not need to protect the search query. Because the query is never saved (S13-R25), a query arriving from a URL has no stored value to overwrite: it simply becomes that browser tab's session query"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38888](https://shopview.testrail.io/index.php?/cases/view/38888), [C38879](https://shopview.testrail.io/index.php?/cases/view/38879)  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"A search arriving via a link is view-only, the same as filters from a link - it does not overwrite your own remembered search."*  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back."*  
> **[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) says, verbatim:** *"Changes made during the link visit are also NOT saved to your account."*  
*This requirement is rationale for S11-R6 rather than an independent behaviour; the observable half is asserted.*  


### S11-N1

> **Requirement, verbatim (spec v19):** *"If the URL filter state is malformed or unrecognizable, the page loads without any filters applied and does not show an error"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29620](https://shopview.testrail.io/index.php?/cases/view/29620), [C29634](https://shopview.testrail.io/index.php?/cases/view/29634)  
> **[C29620](https://shopview.testrail.io/index.php?/cases/view/29620) says, verbatim:** *"No filters are applied (chips in default state, full list shown) - the unrecognizable state is discarded."*  
> **[C29620](https://shopview.testrail.io/index.php?/cases/view/29620) says, verbatim:** *"The Work Orders page loads normally."*  
> **[C29634](https://shopview.testrail.io/index.php?/cases/view/29634) says, verbatim:** *"In the browser the page still loads without filters and without an error message, matching the malformed-URL requirement."*  


### S11-N2

> **Requirement, verbatim (spec v19):** *"If the URL search parameter is malformed, the page loads without a query applied and does not show an error, matching S11-N1"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38888](https://shopview.testrail.io/index.php?/cases/view/38888)  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"The malformed part is ignored - the page loads cleanly without an error."*  
> **[C38888](https://shopview.testrail.io/index.php?/cases/view/38888) says, verbatim:** *"The address contains the search term after step 1."*  


### S11-N3

> **Requirement, verbatim (spec v19):** *""Back to my view" is not shown when the user is viewing their own state rather than state that arrived from a URL"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38896](https://shopview.testrail.io/index.php?/cases/view/38896)  
> **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) says, verbatim:** *"On your own view there is no 'Back to my view' option anywhere - it only belongs to a shared-link visit."*  
> **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) says, verbatim:** *"After you click it and you are back on your own view, the option disappears again."*  


### S12-R1

> **Requirement, verbatim (spec v19):** *"The filter chips are displayed in a horizontally scrollable row below the tab navigation"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29621](https://shopview.testrail.io/index.php?/cases/view/29621)  
> **[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) says, verbatim:** *"A filter chip row is shown below the tabs, starting with an 'All Filters' chip (with a filter icon) followed by the individual filter chips (Status, Customer, Lead Technician, ...)."*  
> **[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) says, verbatim:** *"The row scrolls horizontally - chips that do not fit are reachable by swiping."*  


### S12-R2

> **Requirement, verbatim (spec v19):** *"The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and "Clear filters" appears when active"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29623](https://shopview.testrail.io/index.php?/cases/view/29623), [C29624](https://shopview.testrail.io/index.php?/cases/view/29624), [C29625](https://shopview.testrail.io/index.php?/cases/view/29625), [C29626](https://shopview.testrail.io/index.php?/cases/view/29626), [C29627](https://shopview.testrail.io/index.php?/cases/view/29627), [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)  
> **[C29623](https://shopview.testrail.io/index.php?/cases/view/29623) says, verbatim:** *"Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) plus 'Clear Selection'."*  
> **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) says, verbatim:** *"The chip then shows its active state with the value(s) you picked. 'Clear Selection' and 'Clear Filters' work the same way as on desktop."*  
> **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) says, verbatim:** *"A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."*  


### S12-R3

> **Requirement, verbatim (spec v19):** *"Filter dropdowns open as a bottom sheet or overlay appropriate for the mobile viewport"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29622](https://shopview.testrail.io/index.php?/cases/view/29622), [C29623](https://shopview.testrail.io/index.php?/cases/view/29623), [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)  
> **[C29622](https://shopview.testrail.io/index.php?/cases/view/29622) says, verbatim:** *"A bottom sheet slides up with a drag handle at the top, the centered title 'All Filters' and a close (x) button."*  
> **[C29622](https://shopview.testrail.io/index.php?/cases/view/29622) says, verbatim:** *"A sticky blue 'Apply filters' button sits at the bottom of the sheet."*  
> **[C29623](https://shopview.testrail.io/index.php?/cases/view/29623) says, verbatim:** *"After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."*  
> **[C29623](https://shopview.testrail.io/index.php?/cases/view/29623) says, verbatim:** *"The reopened sheet's title shows the applied-filter count, for example 'All Filters (1)', and the Status accordion header is highlighted with the selected values ticked."*  


### S12-R4

> **Requirement, verbatim (spec v19):** *"The filter bar collapse toggle is not shown on mobile; the filter bar is always visible"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29629](https://shopview.testrail.io/index.php?/cases/view/29629)  
> **[C29629](https://shopview.testrail.io/index.php?/cases/view/29629) says, verbatim:** *"There is no filter-bar collapse/expand (filter icon) toggle on mobile."*  
> **[C29629](https://shopview.testrail.io/index.php?/cases/view/29629) says, verbatim:** *"The filter chip row is always visible on the mobile Work Orders page."*  


### S12-R5

> **Requirement, verbatim (spec v19):** *"The page search control is shown on mobile and behaves as it does on desktop (Story 13, S13-R16 to S13-R21). S12-R4, which hides the filter bar collapse toggle on mobile, does not apply to the search control"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  


### S12-R6

> **Requirement, verbatim (spec v19):** *"Unlike desktop, mobile does not filter in real time. Selections made inside a dropdown / bottom sheet are staged, and the table updates only when the user taps an "Apply filters" button within the sheet. This confirms intent on smaller screens and avoids repeated table reflows / data fetches while the user scrolls a long option list. "Clear selection" and "Clear filters" behave as on desktop."*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C43563](https://shopview.testrail.io/index.php?/cases/view/43563), [C29624](https://shopview.testrail.io/index.php?/cases/view/29624), [C29622](https://shopview.testrail.io/index.php?/cases/view/29622)  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"After you apply, the list shows imported work orders only."*  
> **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563) says, verbatim:** *"The blocking happens as you tap inside the sheet - you do not have to apply first to see the other filters become unusable."*  
> **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) says, verbatim:** *"Known issue reported by the test team: a single filter's own sheet is reported to allow only one value and to have no 'Apply filters' button, filtering the list the moment you tap a value, while only the combined 'All Filters' sheet holds your choices until you press a button."*  
> **[C29624](https://shopview.testrail.io/index.php?/cases/view/29624) says, verbatim:** *"A bottom sheet opens for that single filter: its title row shows the filter's icon and name (for example 'Status') with a close (x) button, and no accordion list of the other filters."*  


### S12-N1

> **Requirement, verbatim (spec v19):** *"If no work orders match the active filters on mobile, the list shows the same empty state as desktop"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C29630](https://shopview.testrail.io/index.php?/cases/view/29630)  
> **[C29630](https://shopview.testrail.io/index.php?/cases/view/29630) says, verbatim:** *"The list shows the same no-results empty state as desktop, saying no results were found for the current filters."*  
> **[C29630](https://shopview.testrail.io/index.php?/cases/view/29630) says, verbatim:** *"The empty state includes the prompt to clear filters."*  


### S13-R1

> **Requirement, verbatim (spec v19):** *"A Search control is displayed in the page toolbar, in the right-hand action group, positioned before any icon-only actions and before the primary CTA"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38883](https://shopview.testrail.io/index.php?/cases/view/38883) says, verbatim:** *"The control expands in place into a small search box showing the placeholder 'Type to search'."*  
> **[C38883](https://shopview.testrail.io/index.php?/cases/view/38883) says, verbatim:** *"The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."*  
*The ORDER assertion (before the icon-only actions and before the primary CTA) lives in the step, not the expected result. Proposed tightening P2.*  


### S13-R2

> **Requirement, verbatim (spec v19):** *"In its default state the control is a low-emphasis text button: magnifier icon (20×20) and the label "Search", Inter Medium 14/20, grey/600 (#4B5565), 8px corner radius, transparent background, 10px padding"*

**Assertion:** (a) a low-emphasis text button: magnifier icon + the label 'Search'  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."*  

**Assertion:** (b) the exact visual tokens - Inter Medium 14/20, grey/600 #4B5565, 8px radius, transparent background, 10px padding, 20x20 icon  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*Deliberate: pixel and hex token checks are design QA, not a manual-tester assertion. DELIBERATE-DECISIONS D1.*  


### S13-R3

> **Requirement, verbatim (spec v19):** *"On hover the control takes a grey/100 (#EEF2F6) background fill; the label colour is unchanged"*

**Assertion:** (a) hover takes a background fill; the label colour is unchanged  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"Hovering over it gives it a light grey background; the word 'Search' keeps its own colour."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."*  

**Assertion:** (b) the exact fill value grey/100 #EEF2F6  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*Same deliberate decision D1.*  


### S13-R4

> **Requirement, verbatim (spec v19):** *"On desktop, clicking the control expands it in place into a text input and moves focus into the input. The field grows leftward from its anchor and the remaining toolbar actions stay in position. The expanded width is 180px"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."*  


### S13-R5

> **Requirement, verbatim (spec v19):** *"The expanded empty state shows the magnifier icon, the text caret, and the placeholder "Type to search" in grey/500 (#697586)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A 'Search' button is shown with a small magnifier icon next to the word 'Search'; it is plain text on a see-through background, with no border and no fill."*  


### S13-R6

> **Requirement, verbatim (spec v19):** *"Once the user types, the entered text is shown in grey/900 (#121926) and an X-circle clear icon (16×16) appears at the right edge of the field"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"As soon as you type, your text shows in a dark grey and a small round x appears at the right-hand end of the box."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."*  


### S13-R7

> **Requirement, verbatim (spec v19):** *"The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required. Inventory uses 350ms because of its load characteristics. Any other table needing a longer interval must be listed here rather than deviating silently"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)  
> **[C38899](https://shopview.testrail.io/index.php?/cases/view/38899) says, verbatim:** *"There is no Apply or Submit button anywhere next to the Search box."*  
> **[C38899](https://shopview.testrail.io/index.php?/cases/view/38899) says, verbatim:** *"Parts Inventory behaves the same way, only it waits a fraction longer before reacting; that longer wait is on purpose because that page carries more data."*  


### S13-R8

> **Requirement, verbatim (spec v19):** *"Long queries use standard text input behaviour: the field neither grows nor truncates, the text scrolls horizontally within it, and the caret follows the insertion point. Keyboard navigation and click-and-drag selection behave as in any text input"*

**Assertion:** (a) the field neither grows nor truncates; the text scrolls; the caret follows  
**VERDICT: COVERED**  
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"A very long sentence does not make the box grow and does not cut the text off - the text scrolls sideways inside the box and the cursor stays where you are typing."*  
> **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) says, verbatim:** *"Clicking it turns the button into a small text box in the same spot (the design sets it at 180 pixels wide), the typing cursor is already inside it, and the box grows towards the left so the other toolbar buttons do not move."*  

**Assertion:** (b) keyboard navigation and click-and-drag selection behave as in any text input  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*No case asserts it. Low value but it is a real uncovered assertion. GAPS.md G4.*  


### S13-R9

> **Requirement, verbatim (spec v19):** *"Search is scoped strictly to the records in the current table. It never returns results from another table, another page, another module, or any content outside that table. There is no cross-page lookup and no fallback to a wider search when the query returns nothing"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), [C38891](https://shopview.testrail.io/index.php?/cases/view/38891), [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)  
> **[C38883](https://shopview.testrail.io/index.php?/cases/view/38883) says, verbatim:** *"The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."*  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Each Search box narrows only its own table; nothing else in the app changes."*  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Every table listed above has its own Search box - no table lost the ability to narrow by text."*  


### S13-R10

> **Requirement, verbatim (spec v19):** *"Search and filters are additive (AND). A query narrows within the active filters; applying a filter narrows within the active query"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38884](https://shopview.testrail.io/index.php?/cases/view/38884)  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"With both active, the results match the filter AND the search together (both narrow the list at once)."*  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"Clearing the search keeps the filter applied."*  


### S13-R11

> **Requirement, verbatim (spec v19):** *"On pages with tabs, search applies within the active tab only"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38900](https://shopview.testrail.io/index.php?/cases/view/38900), [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)  
> **[C38900](https://shopview.testrail.io/index.php?/cases/view/38900) says, verbatim:** *"On the Estimates tab your word is still in the Search box, and the list shows only Estimates rows that match it - no rows from the other tabs appear."*  
> **[C38900](https://shopview.testrail.io/index.php?/cases/view/38900) says, verbatim:** *"Clearing the search clears it for all the Work Orders tabs - they share one search - and each tab shows its full list again."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."*  


### S13-R12

> **Requirement, verbatim (spec v19):** *"Results replace the table contents in place. There is no separate results view or results page"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)  
> **[C38899](https://shopview.testrail.io/index.php?/cases/view/38899) says, verbatim:** *"The matching rows appear in the table you were already looking at; no separate results page, results list or pop-up window opens."*  


### S13-R13

> **Requirement, verbatim (spec v19):** *"Clicking the X-circle clears the query and restores the list to its filtered-but-unsearched state. "Clear filters" (S8-R1) does not clear the search query, and clearing the search query does not clear any filters"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38884](https://shopview.testrail.io/index.php?/cases/view/38884), [C29598](https://shopview.testrail.io/index.php?/cases/view/29598), [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"With both active, the results match the filter AND the search together (both narrow the list at once)."*  
> **[C38884](https://shopview.testrail.io/index.php?/cases/view/38884) says, verbatim:** *"Clearing the search keeps the filter applied."*  
> **[C29598](https://shopview.testrail.io/index.php?/cases/view/29598) says, verbatim:** *"The table shows the full unfiltered list again (no text is in the page Search box, so nothing else is narrowing it)."*  
> **[C29598](https://shopview.testrail.io/index.php?/cases/view/29598) says, verbatim:** *"The 'Clear Filters' link disappears."*  


### S13-R14

> **Requirement, verbatim (spec v19):** *"The search query is retained for the browser tab session. It survives sorting, pagination, and navigating away from the page and returning. Tab-switch behaviour within a page is governed by S13-R24"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"The second browser tab starts clean: its Search box is empty and it shows the full list."*  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"Sorting and paging keep your search applied - your text stays in the box and the list stays narrowed."*  


### S13-R15

> **Requirement, verbatim (spec v19):** *"On desktop, blur with an empty field collapses the control to its default state. Blur with a query keeps the field expanded so the active query stays visible"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38883](https://shopview.testrail.io/index.php?/cases/view/38883)  
> **[C38883](https://shopview.testrail.io/index.php?/cases/view/38883) says, verbatim:** *"Clicking away with an empty box collapses it back to the Search button; with text in it, the box stays open."*  
> **[C38883](https://shopview.testrail.io/index.php?/cases/view/38883) says, verbatim:** *"The control expands in place into a small search box showing the placeholder 'Type to search'."*  


### S13-R16

> **Requirement, verbatim (spec v19):** *"Mobile uses the same inline expansion as desktop. There is no modal, no separate search screen, and no mobile-only state in the component. Tapping the collapsed control expands it in place within the action row, moves focus into the field and raises the keyboard"*

**Assertion:** (a) inline expansion, no modal, no separate screen, no mobile-only state  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The search expands inline inside the toolbar - no separate popup window opens."*  

**Assertion:** (b) tapping moves focus into the field and raises the keyboard  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*Neither focus nor the keyboard is asserted on mobile. GAPS.md G5.*  


### S13-R17

> **Requirement, verbatim (spec v19):** *"On mobile the expanded field fills the remaining width of the action row rather than taking the fixed 180px desktop width. On Work Orders that resolves to 162px. All other toolbar actions remain visible and in position throughout; nothing is hidden while searching"*

**Assertion:** (a) the field fills the remaining width instead of the fixed desktop width; all other toolbar actions stay visible and in position  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The magnifier in the action row opens the app-wide search instead, and typing in it does not narrow this page's list."*  

**Assertion:** (b) on Work Orders that resolves to 162px  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*Token - deliberate decision D1.*  


### S13-R18

> **Requirement, verbatim (spec v19):** *"To create that room, the primary CTA on mobile uses its natural hug width instead of stretching to fill the row: "New Work Order" is 144px, the same width it has on desktop, not 211px. The action group is right-aligned as on desktop, so the free space sits to the left and the field expands into it"*

**Assertion:** (a) the primary CTA uses its natural hug width instead of stretching  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The magnifier in the action row opens the app-wide search instead, and typing in it does not narrow this page's list."*  

**Assertion:** (b) 'New Work Order' is 144px, not 211px, and the action group is right-aligned so the free space sits to the left  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*Token - deliberate decision D1.*  


### S13-R19

> **Requirement, verbatim (spec v19):** *"Where a page has more than one icon-only action in its toolbar, those actions collapse into a single "more" kebab on mobile. This applies to Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), and any other page carrying two or more icon actions"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C43561](https://shopview.testrail.io/index.php?/cases/view/43561), [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C43561](https://shopview.testrail.io/index.php?/cases/view/43561) says, verbatim:** *"On the comparison page in step 7, which has only one small icon button, that button is still shown on its own - a single icon action is not put into a 'more' menu."*  
> **[C43561](https://shopview.testrail.io/index.php?/cases/view/43561) says, verbatim:** *"This rule applies to any page carrying two or more small icon buttons, so if you find another page like that, it should behave the same way."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"To make room, the page's main button no longer stretches full-width, and pages with two or more small icon buttons collapse them into a single 'more' menu."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  
*Vlad's row 4. C43561 (the six named surfaces) was authored by the Vlad-review pass today; before that only one example page was visited.*  


### S13-R20

> **Requirement, verbatim (spec v19):** *"No separate active-query indicator is needed on mobile. Because the field stays expanded and visible whenever a query is present, the desktop blur rules (S13-R15) apply unchanged: empty collapses, non-empty stays expanded showing the query"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"There is no extra 'search is on' badge on mobile: with text in it the box simply stays open showing your text, and an empty box closes back to the Search button when you tap elsewhere - exactly as on desktop."*  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  


### S13-R21

> **Requirement, verbatim (spec v19):** *"All query behaviour is identical across breakpoints: additive with filters (S13-R10), tab scoping (S13-R11, S13-R24), clearing (S13-R13), retention (S13-R14) and the four component states (S13-R2 to S13-R6). Only the expanded width differs, and that is a fill rule rather than a distinct behaviour"*

**Assertion:** (a) only the expanded width differs between breakpoints  
**VERDICT: COVERED**  
**Case(s):** [C38889](https://shopview.testrail.io/index.php?/cases/view/38889)  
> **[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) says, verbatim:** *"The box stretches to fill the space left in the action row instead of staying the narrow desktop size, and every other toolbar button stays visible and in the same place while you search."*  

**Assertion:** (b) additive-with-filters, tab scoping, clearing, retention and the four component states are IDENTICAL on mobile  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*NOT CITED BY ANY CASE, and not asserted by any. Every one of those five behaviours is tested on desktop only. This requirement arrived at v7 (26 Jul) and has never been mapped. GAPS.md G6 - the largest genuinely new gap this pass found.*  


### S13-R22

> **Requirement, verbatim (spec v19):** *"Every table in the application carries a search control, delivered through the shared table component. This covers the list pages across Work Orders, Parts and Reports, and also tables on detail pages and tables inside dialogs (see S14-R6). Any exception must be listed explicitly here; there are none at time of writing. This replaces the enumerated page list used in earlier versions, which did not account for tables outside list pages. Note the scope of this requirement is wider than the S14-R6 surface list: that list covers only tables global search filters today, so tables it never touched still fall under this rule"*

**Assertion:** (a) every table carries a search control through the shared component, including detail-page tables and tables inside dialogs  
**VERDICT: COVERED**  
**Case(s):** [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Every table listed above has its own Search box - no table lost the ability to narrow by text."*  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."*  

**Assertion:** (b) the scope is WIDER than the S14-R6 list - tables global search never touched still fall under this rule  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*C38891 walks exactly the 42 S14-R6 surfaces, so the wider set is asserted nowhere. Arrived at v12 (28 Jul). GAPS.md G7.*  


### S13-R23

> **Requirement, verbatim (spec v19):** *"Each table searches the fields its existing search endpoint already covers today. This is deliberate reuse rather than a newly defined set, so that no page changes behaviour it already has. Where a table needs to search fields beyond what its endpoint covers today, that is scoped separately as backend work and called out against that table. Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against. Five of the surfaces listed under S14-R6 (Customer Contacts, Customer Assets, Customer Fees & Discounts, Administration Locations, Administration Fees & Discounts) narrow rows already loaded in the browser rather than querying an endpoint. For those, no list of covered fields exists to document: the searchable set is whatever the client-side filter happens to match today. Closing this item for them means either scoping the fields as new backend work or stating that the existing client-side narrowing is accepted as-is"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: BLOCKED**  
**Case(s):** — none —  
*NOT CITED BY ANY CASE and not testable as written: the requirement itself says 'Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against.' Owner: engineering. GAPS.md G8.*  


### S13-R24

> **Requirement, verbatim (spec v19):** *"On pages with tabs, the query scopes the same way that page's filters do. The Work Orders tabs share a single query, because they are views of one dataset. Reports sub-tabs and Parts views each keep their own query, matching their per-view filter scoping, because carrying a query between them would apply it to a different table with different columns"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38900](https://shopview.testrail.io/index.php?/cases/view/38900), [C38901](https://shopview.testrail.io/index.php?/cases/view/38901)  
> **[C38900](https://shopview.testrail.io/index.php?/cases/view/38900) says, verbatim:** *"Clearing the search clears it for all the Work Orders tabs - they share one search - and each tab shows its full list again."*  
> **[C38900](https://shopview.testrail.io/index.php?/cases/view/38900) says, verbatim:** *"The Completed tab behaves the same way: your word is still there and only that tab's matching rows are listed."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"Each report tab behaves the same way: a word typed on one tab stays on that tab only, and each tab remembers its own."*  
> **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901) says, verbatim:** *"The second Parts view opens with an empty Search box and its full list - the word you typed on the first view is not carried over."*  


### S13-R25

> **Requirement, verbatim (spec v19):** *"The query is stored in the browser tab session, never against the user account. This is deliberately different from filters, which are stored server-side and sync across devices (S10-R2). The query does not sync across devices, does not survive the tab session ending, and two browser tabs open on the same page each keep their own independent query. A shared link opened in a new tab therefore starts clean"*

**Assertion:** (a) stored in the browser tab session, never against the account; two tabs keep independent queries; does not survive the tab session ending  
**VERDICT: COVERED**  
**Case(s):** [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"The second browser tab starts clean: its Search box is empty and it shows the full list."*  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"Each tab keeps its own search."*  

**Assertion:** (b) the query does not sync across devices  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*C29614 checks FILTERS on a second device; nothing checks that the QUERY does not appear there. GAPS.md G9.*  


### S13-N1

> **Requirement, verbatim (spec v19):** *"If no records match the query, the table shows an empty state (see Story 8)"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"Note for the tester: on the build this was checked against the message reads "No work orders match your filters" and never mentions the search - even when a search is the only thing narrowing the list - and the screen offers only a "Clear Filters" link with no way to clear just the search."*  


### S13-N2

> **Requirement, verbatim (spec v19):** *"If the query is cleared while filters remain active, the table returns to the filtered result set rather than the unfiltered list"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38897](https://shopview.testrail.io/index.php?/cases/view/38897)  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"The message offers a way to clear the filters and, because a search is active, a separate way to clear the search."*  
> **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) says, verbatim:** *"Clearing the search brings back the list as narrowed by the filter only - the filter is still on."*  


### S13-N3

> **Requirement, verbatim (spec v19):** *"Hover states for the expanded field, and disabled and loading states, are not defined and are out of scope for this release"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: NOT-TESTABLE**  
**Case(s):** — none —  
*NOT CITED BY ANY CASE, correctly: the requirement is an explicit scope EXCLUSION ('not defined and are out of scope for this release'). There is nothing to assert. DELIBERATE-DECISIONS D2.*  


### S13-N4

> **Requirement, verbatim (spec v19):** *"A query is never restored on a later visit after the tab session has ended. A user returning the next day sees an unsearched list"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38886](https://shopview.testrail.io/index.php?/cases/view/38886)  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."*  
> **[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) says, verbatim:** *"The second browser tab starts clean: its Search box is empty and it shows the full list."*  
*Vlad's row 5. It is point 4 of a five-point expected result, which is why he missed it.*  


### S13-E1

> **Requirement, verbatim (spec v19):** *"If the user collapses the filter bar (S1-R5) while a search query is active, the query continues to apply and the search control remains in the toolbar"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38903](https://shopview.testrail.io/index.php?/cases/view/38903)  
> **[C38903](https://shopview.testrail.io/index.php?/cases/view/38903) says, verbatim:** *"The Search box stays in the toolbar row with your word still showing; it is not tucked away with the filter bar, because the search sits in the toolbar row and the chips sit in the row below."*  
> **[C38903](https://shopview.testrail.io/index.php?/cases/view/38903) says, verbatim:** *"The list stays narrowed by your word - collapsing the filter bar does not cancel the search."*  


### S14-R1

> **Requirement, verbatim (spec v19):** *"The global header search returns navigational results only. It takes the user to a record or page and does not modify the contents of the list the user is currently viewing"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."*  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."*  


### S14-R2

> **Requirement, verbatim (spec v19):** *"The existing code path that applies a global search query as a filter on the current page's table is removed, not hidden behind a flag or left dormant"*

**Assertion:** (a) global search never applies a query as a filter on the current page's table  
**VERDICT: COVERED**  
**Case(s):** [C38893](https://shopview.testrail.io/index.php?/cases/view/38893), [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."*  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."*  
> **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) says, verbatim:** *"The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list."*  
> **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) says, verbatim:** *"The page's own Search box is empty; nothing was carried into it."*  

**Assertion:** (b) the code path is REMOVED, not hidden behind a flag or left dormant  
**VERDICT: NOT-TESTABLE**  
**Case(s):** — none —  
*A source-code property. A manual tester can only observe the behaviour, which (a) covers. DELIBERATE-DECISIONS D3.*  


### S14-R3

> **Requirement, verbatim (spec v19):** *"Any state, URL parameters or persisted values that carry a global search term into page-level filtering are removed with it"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38902](https://shopview.testrail.io/index.php?/cases/view/38902)  
> **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) says, verbatim:** *"The page opens with the normal list for your own saved filters - the old search word does NOT narrow the list."*  
> **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) says, verbatim:** *"The page's own Search box is empty; nothing was carried into it."*  


### S14-R4

> **Requirement, verbatim (spec v19):** *"Entering a query in the global search while on a list page leaves that list untouched"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."*  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"Picking a dropdown result still takes you to that record - the navigation search keeps its find-and-open role."*  


### S14-R5

> **Requirement, verbatim (spec v19):** *"This applies to every page in the application. Global search must no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and Reports, and pages with no design in the current explorations. QA should treat this as an app-wide sweep, not a per-module check"*

**Assertion:** (a) global search must no longer alter the visible record set  
**VERDICT: COVERED**  
**Case(s):** [C38893](https://shopview.testrail.io/index.php?/cases/view/38893)  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The page list does NOT narrow while you type in the navigation search - only its dropdown of matching records appears."*  
> **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) says, verbatim:** *"The same holds on the other pages checked."*  

**Assertion:** (b) on EVERY page, including pages outside Work Orders/Parts/Reports and pages with no design - 'an app-wide sweep, not a per-module check'  
**VERDICT: UNCOVERED**  
**Case(s):** — none —  
*C38893 drives exactly two pages (Work Orders and Parts Inventory) and then asserts 'the same holds on the other pages checked'. C38891 walks 42 surfaces but for the SEARCH-IS-PRESENT assertion, not this one. Arrived at v7 (26 Jul). Vladimir Tomovic's C1789 walks ~30 pages for this exact thing. GAPS.md G10.*  


### S14-R6

> **Requirement, verbatim (spec v19):** *"The audit of surfaces where global search currently filters content is complete. No surface loses text narrowing: every affected surface keeps a search control, delivered through the shared table component (S13-R22). The audit identified 42 surfaces across 39 components, listed under Affected Surfaces below. It confirmed that global search filters tables well outside the list pages, including Work Order notes, Customer notes, Work Order history, customer and vendor transaction tabs, and the audit log dialog. One candidate was examined and excluded: Work Order Parts, which already has its own local search input independent of global search and therefore loses nothing"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"The work order Parts tab keeps the local search input it already had - it was deliberately left as it is."*  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Where the table sits inside a dialog (the Work Order Log, the Line Log, the audit log dialog), the Search box is inside that dialog and works there."*  
*Vlad's row 6. Counted group by group against the spec's own list: 5+11+10+12+2+2 = 42. HOLD, because its own precondition needs the rollout finished.*  


### S14-N1

> **Requirement, verbatim (spec v19):** *"Page search (Story 13) is a hard prerequisite. Removing global-search filtering from a page before page search is available there would leave that page with no way to narrow by text. If the rollout is phased, S14-R2 is scoped per page and S14-R5 is verified once at the end"*

**Assertion:** the whole requirement (single assertion)  
**VERDICT: COVERED**  
**Case(s):** [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)  
> **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) says, verbatim:** *"Every table listed above has its own Search box - no table lost the ability to narrow by text."*  
*The substance ('no page loses text narrowing') is asserted; the phasing rule is a project-management instruction.*  

---

## TABLE B — normative statements in §2 Feature Overview and §4 Key Decisions that carry no requirement number

These are **not** decoration. The Filters spec puts real product decisions in §2 and §4 and never
gives them an `Sn-Rm` anchor, and **eleven of our cases are sourced to them and to nothing else**. A
map that walked only §7 would declare the suite complete while missing them — so they get the same
treatment: verbatim quote, one row per assertion, one verdict.

**16 rows. COVERED 11 · UNCOVERED 3 · BLOCKED 2.**

### B1 — §2 Parts Filters, searchable long enumerations
> **Spec, verbatim:** *"Entity filters (Customer, Vendor, Created by, Ordered by, Received by, Processed by) use the searchable multi-select dropdown; long lists such as Category and Manufacturer also include a search field; short attribute filters (Supply, Part Type, Bin Location, State/Province, Status) use the checkbox list"*

**Assertion:** Category and Manufacturer include a **search field**, and the short attribute filters use a plain checkbox list
**VERDICT: UNCOVERED**
**Case(s):** — none —
*[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) asserts only which buttons exist — "Catalog shows two filter buttons: Manufacturer and Category." Nothing asserts that either one contains a search field, and nothing asserts the three-way split between searchable / long-with-search / plain-checkbox. Corroborated from outside: Ahtasham filed [SV-8962](https://shopview.atlassian.net/browse/SV-8962) on the Report Suite for "Customer filter: no search icon". GAPS.md G12.*

### B2 — §2 Parts Filters, date columns use the new date-range type
> **Spec, verbatim:** *"Date-based columns (Date, Invoice date, Date received) use the new date-range filter"*

**Assertion:** those three Parts columns use the **date-range filter type**, with its behaviour
**VERDICT: UNCOVERED**
**Case(s):** — none —
*[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) lists Date, Invoice date and Date received as buttons that exist. [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) tests the date-range behaviour, but on a **Report** (Timesheet Activities) — no case tests it on a Parts view. Corroborated from outside: Vladimir Tomovic's [C26740](https://shopview.testrail.io/index.php?/cases/view/26740) and [C26741](https://shopview.testrail.io/index.php?/cases/view/26741) both test date-range presets and custom ranges on **Parts → Returns → Credits**. GAPS.md G13.*

### B3 — §4 Key Decisions, the placeholder copy
> **Spec, verbatim:** *"Generic placeholder. The expanded field reads "Type to search" on every page rather than being parameterised per page, unlike the filter dropdowns which use targeted copy ("Search customer", "Search technician")."*

**Assertion (a):** the page-search field reads **"Type to search"** on every page
**VERDICT: COVERED**
**Case(s):** [C38898](https://shopview.testrail.io/index.php?/cases/view/38898)
> **C38898 says, verbatim:** *"While the box is empty it shows the magnifier icon and the grey placeholder text 'Type to search'."*

**Assertion (b):** the **filter dropdowns** use **targeted copy** — "Search customer", "Search technician"
**VERDICT: UNCOVERED — and worse: three of our cases assert the opposite**
**Case(s):** — none asserts it; [C29566](https://shopview.testrail.io/index.php?/cases/view/29566), [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) and [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) contradict it
> **C29566 says, verbatim:** *"A search box with the placeholder 'Search' is at the top of the panel. Click it before you type - it is not focused for you automatically."*
*This is a Rule-57-class defect, not a coverage gap. See GAPS.md **G2** — it is the most serious thing this pass found.*

### B4 — §4, no selection limit
> **Spec, verbatim:** *"No selection limit on multi-select filters: users can select as many values as needed."*

**VERDICT: COVERED** · **Case(s):** [C29562](https://shopview.testrail.io/index.php?/cases/view/29562), [C29568](https://shopview.testrail.io/index.php?/cases/view/29568)
> **C29562 says, verbatim:** *"There is no limit on how many statuses you can tick."*
> **C29568 says, verbatim:** *"You can keep selecting as many customers as needed - there is no selection limit."*

### B5 — §4, Asset on Site is a dropdown, not a toggle
> **Spec, verbatim:** *"Asset on Site changed from toggle to dropdown to maintain visual and interaction consistency with the other four filters, all of which use the dropdown chip pattern."*

**VERDICT: COVERED** · **Case(s):** [C29589](https://shopview.testrail.io/index.php?/cases/view/29589)
> **C29589 says, verbatim:** *"It is a dropdown (like the other filters), not an on/off toggle."*

### B6 — §4, My Work Orders keeps its filters
> **Spec, verbatim:** *"My Work Orders tab does not remove filters: filters continue to work on top of the user-scoped result set."*

**VERDICT: COVERED** · **Case(s):** [C29611](https://shopview.testrail.io/index.php?/cases/view/29611)
> **C29611 says, verbatim:** *"it shows only YOUR work orders in the ticked status - the filters narrow the user-scoped list, they do not widen it to other users' work orders."*

### B7 — §4, the new date-range filter type
> **Spec, verbatim:** *"New date-range filter type: Date chips open a picker offering standard predefined ranges plus a custom start/end range, pre-populated with the application's current default range for that report/page. A predefined range applies on selection; a custom range applies when the second date is picked. Used across Reports and the date columns on Parts views."*

**Assertion (a):** presets + custom range, pre-populated default, preset applies on selection, custom applies on the second date
**VERDICT: COVERED** · **Case(s):** [C38882](https://shopview.testrail.io/index.php?/cases/view/38882)
> **C38882 says, verbatim:** *"A period is already filled in when the panel first opens (on Timesheet Activities it is This month), and the button reads that period, for example "Date Range: This month"."*
> **C38882 says, verbatim:** *"As soon as you fill in the To date the results update to show only records inside that range, and the button reads "Date Range: Custom"."*

**Assertion (b):** *"Used across Reports **and the date columns on Parts views**"*
**VERDICT: UNCOVERED** — the Parts half. Same gap as **B2** / GAPS.md G13.

### B8 — §4, context-specific filter sets
> **Spec, verbatim:** *"Context-specific filter sets on Parts and Reports: each Parts view and each Report defines its own filter chips rather than sharing a single set, because the underlying datasets and relevant dimensions differ per view."*

**VERDICT: COVERED** · **Case(s):** [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) (all 8 Parts views), [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) (16 report views)
> **C38904 says, verbatim:** *"Inventory shows four filter buttons: Bin Location, Category, Supply and Vendor."*
> **C38909 says, verbatim:** *"Timesheet Activities shows four filter buttons: Staff, Date, Status and Modified by."*
*Both cases are `AUTOMATION: HOLD` on Branko's write-up. This was Vlad's row 7 — a recorded deliberate wait, not a miss.*

### B9 — §4, multi-select except date-range
> **Spec, verbatim:** *"Multi-select where it makes sense: all Parts and Reports filters are multi-select except the date-range filter, which is a single range."*

**VERDICT: COVERED** · **Case(s):** [C38907](https://shopview.testrail.io/index.php?/cases/view/38907), [C38882](https://shopview.testrail.io/index.php?/cases/view/38882)
> **C38907 says, verbatim:** *"More than one value can be chosen inside the filter, and the button shows what you picked."*
> **C38882 says, verbatim:** *"Only one date range can be active at a time on that button."*
*The second quote is Vlad's row 10, which he read as missing; it is expected result 6 of a seven-point list.*

### B10 — §4, page search is separate from the filter bar
> **Spec, verbatim:** *"Page search is separate from the filter bar, not a filter chip. It lives in the toolbar row with the collapse toggle and primary action; the chips stay in the row below. The two are additive but independently cleared: "Clear filters" does not clear the query, and clearing the query does not clear the chips."*

**VERDICT: COVERED** · **Case(s):** [C38903](https://shopview.testrail.io/index.php?/cases/view/38903), [C38884](https://shopview.testrail.io/index.php?/cases/view/38884)
> **C38903 says, verbatim:** *"The Search box stays in the toolbar row with your word still showing; it is not tucked away with the filter bar, because the search sits in the toolbar row and the chips sit in the row below."*
> **C38884 says, verbatim:** *"Clearing the filter keeps the search applied - each is cleared by its own control without wiping the other."*

### B11 — §4, one shared search component
> **Spec, verbatim:** *"One shared search component, scoped strictly to its own table. Page-specific behaviour is configuration (which fields are searched), not a per-module variant. Each search input queries only the records in its own table; it cannot reach content in any other table, on any other page, or in any other module."*

**Assertion (a):** strict per-table scoping, no cross-page or cross-module reach
**VERDICT: COVERED** · **Case(s):** [C38883](https://shopview.testrail.io/index.php?/cases/view/38883), [C38891](https://shopview.testrail.io/index.php?/cases/view/38891)
> **C38883 says, verbatim:** *"The list narrows as you type, after a brief pause - and ONLY this page's list changes, nothing else in the app."*
> **C38891 says, verbatim:** *"Each Search box narrows only its own table; nothing else in the app changes."*

**Assertion (b):** *"Page-specific behaviour is configuration (**which fields are searched**)"*
**VERDICT: BLOCKED** — the field list does not exist. Same blocker as `S13-R23` / GAPS.md G8. Owner: engineering.

### B12 — §2, sub-report tabs keep separate sets
> **Spec, verbatim:** *"Reports with sub-report tabs keep a separate filter set per tab"*

**VERDICT: COVERED** · **Case(s):** [C38880](https://shopview.testrail.io/index.php?/cases/view/38880)
> **C38880 says, verbatim:** *"Report tabs likewise keep separate filter choices, each remembered and restored on its own tab."*
*⚠ Vladimir Tomovic's [C39448](https://shopview.testrail.io/index.php?/cases/view/39448) asserts the OPPOSITE for one specific report. See OUTSIDE-IN.md O1.*

### B13 — §2, desktop and mobile
> **Spec, verbatim:** *"Supported on both desktop and mobile"*

**VERDICT: COVERED** · **Case(s):** the eleven Mobile Filters cases, [C29621](https://shopview.testrail.io/index.php?/cases/view/29621)–[C29630](https://shopview.testrail.io/index.php?/cases/view/29630) and [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)
> **C29621 says, verbatim:** *"A filter chip row is shown below the tabs, starting with an 'All Filters' chip (with a filter icon) followed by the individual filter chips"*

### B14 — §4, the Status chip on Estimates and Completed
> **Spec, verbatim:** *"Status filter is hidden on the Estimates and Completed tabs, because those tabs are shortcuts that already pre-filter by a single status, so showing a Status filter would be redundant and potentially confusing."*

**VERDICT: BLOCKED** — Owner: **Branko**.
**Case(s):** [C29609](https://shopview.testrail.io/index.php?/cases/view/29609), [C29610](https://shopview.testrail.io/index.php?/cases/view/29610), [C29559](https://shopview.testrail.io/index.php?/cases/view/29559), [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) — all four assert the opposite, deliberately
> **C29609 says, verbatim:** *"The Status chip is shown, but greyed out and already filled in with this tab's own status (Estimate), because the tab already narrows the list to Estimate."*
*This is the **SECOND** copy of the disputed text, and by trap (c) it is the **OLDER** one — present since **v1, 13 May 2026**, two months before Branko's answer. GAPS.md **G1**.*

### B15 — §2 Reports Filters, the date-range URL contract
> **Spec, verbatim:** *"…A predefined range applies on selection; a custom range applies when the second date is picked. **The selected range is reflected in the URL (e.g., range=custom&from=2026-04-01&to=2026-04-25) so a filtered report is shareable**"*

**Assertion:** the selected range appears in the URL, in that parameter form
**VERDICT: UNCOVERED**
**Case(s):** — none —
> **[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) says only, verbatim:** *"Choosing a ready-made period applies it straight away: the results update, the button reads the period you chose, and the web address records it."*
*🔴 **THIS CORRECTS A ROW THAT WAS RECORDED AS SETTLED THIS MORNING.** GAPS.md **G11**.*

### B16 — §4, mobile deferred apply
> **Spec, verbatim:** *"Mobile uses deferred apply: desktop filters in real time, while mobile stages the user's selections and applies them only when the user taps an "Apply filters" button — a deliberate difference for small-screen ergonomics (see Story 12)."*

**VERDICT: COVERED** · **Case(s):** [C29624](https://shopview.testrail.io/index.php?/cases/view/29624), [C43563](https://shopview.testrail.io/index.php?/cases/view/43563)
> **C29624 says, verbatim:** *"You can tick more than one option, and the work order list does NOT change while you tick - your choices are only being held, not applied yet."*

---

## TABLE C — assertions that come from Branko's answers rather than the spec

Rule 57 names the PO's verified answers as a source of expected behaviour, and Rule 45(e) applies to
them exactly as it does to the spec: **a promise in an answer counts the same as a promise in the
PRD.** Forgetting that is how three of Vlad's six correct rows happened. **9 rows: COVERED 6 ·
UNCOVERED 0 · BLOCKED 3.**

| # | Source assertion, verbatim | Verdict | Case(s) | The case's own words |
|---|---|---|---|---|
| C1 | Branko R3 Q5, 31 Jul: *"multi-select … match Work Orders"* | **COVERED** | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | *"More than one value can be chosen inside the filter, and the button shows what you picked."* |
| C2 | Branko R3 Q5: *"clearing … match Work Orders"* | **COVERED** | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | *"A Clear Filters button appears in the filter bar while any filter is set, and using it clears them all at once - exactly as it works on the Work Orders page."* |
| C3 | Branko R3 Q5: *"persistence … match Work Orders"* | **COVERED** | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | *"Returning to the first view restores that view's own selections."* |
| C4 | Branko R3 Q5: *"collapse … match Work Orders"* | **COVERED** | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | *"The filter bar on the Parts page and on the report can be collapsed and expanded, and the table takes the freed space when it is collapsed - exactly as on the Work Orders page."* |
| C5 | Branko R3 Q5: *"shareable URL … match Work Orders"* | **COVERED** | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | *"The web address carries the filters you set, and opening that address in a fresh window loads the page with the same filters already applied and the list already narrowed"* |
| C6 | Branko R3 Q5: *"mobile … match Work Orders"* | **COVERED** | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | *"On the phone the filter buttons sit in a row you can scroll sideways, there is no collapse control, and your choices are applied when you tap the apply button"* |
| C7 | Branko R1 Q4=B, 17 Jul: *"Shown but greyed out, pre-filled with the tab's status, and not [clickable]"* | **BLOCKED** — Branko must reconcile it with two older document copies | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609), [C29610](https://shopview.testrail.io/index.php?/cases/view/29610), [C29559](https://shopview.testrail.io/index.php?/cases/view/29559), [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | *"The Status chip cannot be clicked or changed on this tab."* |
| C8 | Branko 4 Aug Q2 = *"A - it's fine"* on the default/last-used tab | **BLOCKED** — a two-word answer is a thin basis for a whole case; the spec has no requirement | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | *"On the very first visit the Estimates tab is the selected one, even though All is the FIRST tab in the row"* |
| C9 | Branko 4 Aug Q8: *"we should have all filters we support now per each page plus we should add new ones"* | **BLOCKED** — HOLD on the write-up | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | *"Every filter the page offered before is still offered - nothing has been taken away."* |

**Rows C4, C5 and C6 were UNCOVERED until this morning** — they are Vlad's row 9, and C43562 was
authored by the Vlad-review pass in response. The independent corroboration is
[SV-8905](https://shopview.atlassian.net/browse/SV-8905) *"Filter bar collapse state not persisted on
Parts and Reports"*, filed by Ahtasham at 05:23Z today: **someone found the defect in the very
dimension we had no case for.**

---

## DIRECTION 2 — case → requirement, all 114

**0 orphans: no case cites an anchor that has ceased to exist in v19.** The 128 distinct anchors
cited across the 114 cases are all present in the live spec. Full detail, including the 11 cases
with no numbered anchor and the 105 with a stale or absent spec-version pin, is in **`ORPHANS.md`**.
