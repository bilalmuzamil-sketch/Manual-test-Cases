# Per-ticket record — the source found and the exact block written

One entry per ticket. **Source type** is one of the three the QA lead named: **1** a story in the epic · **2** the specification (PRD) · **3** a product owner answer in the questions spreadsheet.

The block text below is what is now live at the bottom of each ticket, appended after a line break. Nothing above it was altered.

## [SV-8818](https://shopview.atlassian.net/browse/SV-8818) — Report Suite

| | |
|---|---|
| Status | **Ready to Fix** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **2** — the specifications (five reports, each in its own words) |
| Document named | Inventory Value v4 S10-R12 / S10-R14 · Sales By Customer v15 S15-R25 · Parts Velocity v5 S6-N1 · Technician Utilization v6 Story 7 Error Handling |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the report specifications, each in its own words. None of them allows a download to end in a server error; each one says a download either produces a file or explains itself.
>
> the Inventory Value report specification, version 4, requirement S10-R12, which says: "Export size guardrail. To keep a single-shot export renderable, an export is capped at a maximum of 10,000 rows in the filtered set. When the current filtered set exceeds the cap, neither the PDF nor the CSV is produced; instead the user sees the message: “This report is too large to export. Narrow the date range or filters, then try again.”" The views in this ticket are far below that cap, so the download should simply have worked.
>
> the Inventory Value report specification, version 4, requirement S10-R14, which says: "If a download fails, the user sees an error notification: “Failed to export inventory value report (pdf)” or “Failed to export inventory value report (csv)”."
>
> the Sales By Customer report specification, version 15, requirement S15-R25, which caps each PDF at 10,000 data rows in the same way.
>
> the Parts Velocity report specification, version 5, requirement S6-N1, which says: "If an export fails, an error toast is shown."
>
> the Technician Utilization report specification, version 6, Story 7 under Error Handling, which says: "If a download fails, the user sees an error notification: “Failed to download report”."
>
> Two honest caveats. First, this ticket as filed quoted the Inventory Value description at version 3; that page is now at version 4 and both requirements above carry over into it unchanged. Second, the Parts Velocity, Technician Utilization and Work In Progress descriptions carry no export size cap of their own, so for those three the source is the failure-message requirement rather than a cap.
>

## [SV-8819](https://shopview.atlassian.net/browse/SV-8819) — Report Suite

| | |
|---|---|
| Status | **Done** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5, Story 5 (Metric Calculations) — the Window definition and the Turns / Yr formula |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, Story 5 (Metric Calculations). Its Definitions block says: "Window — the whole-day span of the selected range, inclusive of both the start and end dates, with a floor of 1 day (so a single-day range such as Today has Window = 1). This is the divisor used to annualize Turns / Yr."
>
> The same story gives the calculation itself, for Turns / Yr: "(Units Sold ÷ Window days × 365) ÷ On Hand; renders 0.00 when On Hand is 0." So the divisor must count both the first and the last day of the chosen period.
>
> One honest note: this ticket as filed quoted the Parts Velocity description at version 4. That page is now at version 5 and the Window definition and the formula are unchanged in it.
>

## [SV-8820](https://shopview.atlassian.net/browse/SV-8820) — Report Suite

| | |
|---|---|
| Status | **Ready to Fix** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S5-R2, S5-R4, S5-R7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S5-R2, which says: "The report values inventory as of the end of the selected range."
>
> The same specification, requirement S5-R7, says of a custom range: "A Custom range lets the user pick a start and end date; the report values as of the picked end date (never a future date — it is capped at today)."
>
> And requirement S5-R4 gives the only permitted fallback, which is backwards and never forwards: "Otherwise, the report replays the closest recorded day on or before the end of the selected range." A day AFTER the date asked for is not an outcome the specification allows.
>

## [SV-8821](https://shopview.atlassian.net/browse/SV-8821) — Report Suite

| | |
|---|---|
| Status | **OBSOLETE** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **NONE** — NO DOCUMENTED SOURCE — see FLAGGED.md |
| Document named | none; the block says so plainly |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: nothing written down. Stating that plainly rather than dressing it up.
>
> We checked the six report specifications and the stories under this epic, and none of them says what answer the system should give when an invoice is requested for a work order that has no contact set. The expectation in this ticket rests on consistency with the answers the product already gives for other missing prerequisites — for example "Work order is not complete." and "Line can`t be completed with unfulfilled part requests." — and on the general principle that a missing piece of required information should produce a clear rejection rather than a server error. That is a reasonable expectation, but it is our reading and not a quoted requirement.
>
> This ticket is already closed. It is recorded here so that the record is honest about what the expectation rested on.
>

## [SV-8822](https://shopview.atlassian.net/browse/SV-8822) — Report Suite

| | |
|---|---|
| Status | **OBSOLETE** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | None (unchanged) |
| **Source type** | **NONE** — NO DOCUMENTED SOURCE — see FLAGGED.md |
| Document named | none; the block says so plainly |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: nothing written down, and the ticket said so when it was filed.
>
> No specification and no story under this epic says what answer the system should give when a customer is saved with a field it does not recognise. The expectation — a validation error explaining what is wrong, rather than a server error — is a general robustness expectation and not a quoted requirement.
>
> This ticket has already been withdrawn, for a separate reason: the fault can only be reached by sending the save request directly in a shape the product's own screens never produce, so no customer and no manual tester can see it. It is recorded here so that the record is honest about what the expectation rested on.
>

## [SV-8823](https://shopview.atlassian.net/browse/SV-8823) — Report Suite

| | |
|---|---|
| Status | **Ready to Fix** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S10-R3, S10-R7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S10-R3, which says: "Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last." That covers both halves of this ticket — which columns appear, and the order they appear in.
>
> The same specification, requirement S10-R7, says: "Money and Margin % use two-decimal and one-decimal formats respectively; an undefined Margin % shows “—”." A number is asked for, not a dressed-up money string.
>
> One honest note: this ticket as filed quoted the Inventory Value description at version 3. That page is now at version 4 and both requirements carry over into it unchanged.
>

## [SV-8843](https://shopview.atlassian.net/browse/SV-8843) — Filters

| | |
|---|---|
| Status | **OBSOLETE** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8785 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S1-R1, S1-R5 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, requirement S1-R1, which says: "The filter bar is displayed below the tab navigation row (All, Estimates, Completed, My Work Orders) by default".
>
> And requirement S1-R5, which says: "When the user collapses the filter bar, the bar is hidden and the table expands to use the reclaimed vertical space". Both halves of this ticket are covered: the row the bar sits on, and what collapsing it should free up.
>

## [SV-8844](https://shopview.atlassian.net/browse/SV-8844) — Filters

| | |
|---|---|
| Status | **OBSOLETE** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8785 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S13-R7, S13-R12 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, requirement S13-R7, which says: "The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required."
>
> And requirement S13-R12, which says: "Results replace the table contents in place. There is no separate results view or results page." Together those two mean that typing into the page search must narrow the list on the page itself.
>

## [SV-8845](https://shopview.atlassian.net/browse/SV-8845) — Filters

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8785 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S11-R2, S12-R2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, requirement S11-R2, which says: "When a user opens a URL that contains filter state, the Work Orders page loads with those filters pre-applied and the table already filtered".
>
> That the same must hold on a phone comes from requirement S12-R2, which says: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and “Clear filters” appears when active". The one exception it names is about staging selections behind an Apply button, not about which records are listed.
>

## [SV-8846](https://shopview.atlassian.net/browse/SV-8846) — Filters

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8797 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S7-R3, S12-R2, S12-R6 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, requirement S7-R3, which says: "When at least one filter is active, a “Clear filters” button appears in the filter bar to the right of all chips".
>
> That this applies on a phone as well comes from requirement S12-R2, which says: "The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens its dropdown, selections update the chip appearance, and “Clear filters” appears when active", and from requirement S12-R6, which closes with: "“Clear selection” and “Clear filters” behave as on desktop."
>

## [SV-8847](https://shopview.atlassian.net/browse/SV-8847) — Filters

| | |
|---|---|
| Status | **OBSOLETE** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8785 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S8-R3, S8-R4, S8-R5 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, and it takes three requirements, all of which the empty screen has to satisfy.
>
> Requirement S8-R3: "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search".
>
> Requirement S8-R4: "The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query".
>
> Requirement S8-R5: "Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13".
>

## [SV-8848](https://shopview.atlassian.net/browse/SV-8848) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | None (unchanged) |
| **Source type** | **2** — the specification (PRD) — PARTLY supporting, see FLAGGED.md |
| Document named | Schedule v23 sections 4.2 and 4.8 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.2, which says: "Every shift has a start time. It is derived from a hierarchy: The technician's configured working hours take precedence." The technician in the steps above has working hours of 7:00 AM to 7:00 PM, so a shift placed on her must read 7:00 AM, not 1:00 PM.
>
> The same specification, section 4.8, says of the day view: "Now line. A vertical indicator showing the current time, with a label on hover over the grid." The current time for a shop is the time on the shop's own clock.
>
> One honest caveat, so nobody has to take our word for it: the specification nowhere writes down a rule about time zones, and it is silent on that point. What the two lines above do settle is that a shift's start time follows the technician's configured hours, and that the day view's marker shows the current time. The six-hour shift breaks both. If the product owner takes a different view of which clock the board should show, this belongs back with him as a question rather than with a developer.
>

## [SV-8849](https://shopview.atlassian.net/browse/SV-8849) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8692 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.9, which says: "Clicking a shift block opens a detail panel showing:" and then lists what the panel holds, including the scope summary, the notes and the Delete action. The specification draws no distinction between a single-day shift and one that belongs to a series, and no distinction between the day, week and month views.
>

## [SV-8850](https://shopview.atlassian.net/browse/SV-8850) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8693 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.7, which says: "Visible lanes are capped at 3. Additional overlapping shifts collapse into a “+N more” affordance that opens a popover listing the hidden shifts. This applies in day, week, and month views (week and month reach the overflow much sooner because cells are narrower)." Listing the hidden shifts is the whole purpose the specification gives that control.
>

## [SV-8851](https://shopview.atlassian.net/browse/SV-8851) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8700 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 9 — the View Options table |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 9 (View options and customization). Its View Options table gives the Tech Hours option a default of Off and this effect: "Displays each technician's working hours next to their name."
>

## [SV-8852](https://shopview.atlassian.net/browse/SV-8852) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8697 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.9, which lists among the things the shift detail panel shows: "A conflict banner with an “Adjust” action when the shift is conflicted." The banner and the action are named together, so a banner on its own does not meet it.
>

## [SV-8853](https://shopview.atlassian.net/browse/SV-8853) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8700 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 7 — Keyboard support (both Escape and Enter) |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 7 (Interactions and micro-interactions), under "Keyboard support. Global shortcuts work anywhere on the schedule page". Both keys are written down separately.
>
> On Escape: "Escape closes the topmost open modal or popover, following a defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters, search)."
>
> On Enter: "Enter confirms the active confirmable dialog (delete scope, reassign, spread, event create/edit). It does not fire inside textareas, so multiline note editing still works normally." The delete-scope and reassign windows are both named in that list.
>

## [SV-8854](https://shopview.atlassian.net/browse/SV-8854) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8687 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 14.2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 14.2 (Work order sidebar dependency), which says: "The left panel sidebar displays work order data (customer, unit, lines, lead tech) and requires Work Orders: View to populate. If a user has Schedule access but Work Orders: View is OFF, the sidebar hides the work order list and line drill-down (the mini calendar remains available). The user can still view and interact with shifts already on the grid, but cannot drag new ones from the sidebar since the WO list is not visible."
>

## [SV-8855](https://shopview.atlassian.net/browse/SV-8855) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8691 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.5 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.5 (Multi-day spread scheduling), which says: "Start date. Defaults to the earliest working day. Adjusting it is how a second technician's series can be made sequential (starting after the first) rather than parallel." The second sentence names the exact thing that cannot be done today.
>

## [SV-8856](https://shopview.atlassian.net/browse/SV-8856) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8694 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.8 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.8 (Day view: timeline interactions), which says: "Horizontal drag to move a shift's start time (snaps to 15-minute intervals)."
>

## [SV-8857](https://shopview.atlassian.net/browse/SV-8857) — Schedule

| | |
|---|---|
| Status | **TESTING QA** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8687 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 5.1 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 5.1 (Work order filters), which says: "Filters live behind a “Filter” button (with an active-count badge); there are no assignment tabs. Applying a filter narrows the flat card list, and “Clear all” resets in one click." Both missing things — the count on the button and the one-click reset — are in that one sentence.
>

## [SV-8871](https://shopview.atlassian.net/browse/SV-8871) — Filters

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8795 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S7-R1, S10-R1 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, requirement S7-R1, which says: "When a filter has one or more values selected, the chip changes to an active/highlighted visual state (blue pill) and displays the selected value(s)". The last five words are the part that is missing.
>
> And requirement S10-R1, which says: "When the user navigates away from the Work Orders page (e.g., to a Work Order detail, then back), the filter selections and collapsed/expanded state are restored exactly as they were left".
>

## [SV-8879](https://shopview.atlassian.net/browse/SV-8879) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **3** — a product owner answer in the questions spreadsheet |
| Document named | Chris Ward, tab "The product vs your write-up", row 6 (question 1.0), cell F6 — and it OVERRIDES four specifications |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: Chris Ward's answer in our questions spreadsheet — https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true — tab "The product vs your write-up", row 6 (question 1.0), where he answered: "B) (answered in sheet: "Urgent - Location column")".
>
> Option B, as he read it, was written out in full in that row: "Change the product to match your ruling - hide it. We raise it with engineering, and the four lines still need correcting because they say it stays."
>
> This must be said plainly, because his answer differs from the written descriptions rather than agreeing with them. Four of the six specifications currently say the opposite — for example the Parts Velocity description says "A user with access to only one location still sees the Location filter with a single selectable location; behavior is unchanged from single-location use." and the Technician Utilization and Inventory Value descriptions carry the same line. Chris Ward's answer of 5 August 2026 is the more recent decision and it is the one this ticket follows; he also accepted in that same answer that those four lines still need correcting.
>

## [SV-8880](https://shopview.atlassian.net/browse/SV-8880) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **3** — a product owner answer, agreeing with the specification |
| Document named | Chris Ward, tab "The product vs your write-up", row 9 (question 4.0), cell F9 · plus Sales By Representative v17 S14-R15 / S14-R20 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: Chris Ward's answer in our questions spreadsheet — https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true — tab "The product vs your write-up", row 9 (question 4.0), where he answered: "A)  Further context -- on-screen should match download :).".
>
> Option A, as he read it, was: "They are missing by mistake - add the four back. We raise it with engineering and your write-up stays exactly as it is."
>
> His answer agrees with the written description, so nothing is being overridden here. the Sales By Representative report specification, version 17, requirement S14-R15, sets out the Summary spreadsheet's column list in full, and requirement S14-R20 adds the Location column to it whenever that column is on screen.
>

## [SV-8881](https://shopview.atlassian.net/browse/SV-8881) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Bug (unchanged) |
| Parent | SV-8582 (unchanged) |
| **Source type** | **2** — the specification (PRD), confirmed by a product owner answer |
| Document named | Technician Utilization v6 S7-R2/R3/R4 · confirmed by Chris Ward, tab "The product vs your write-up", row 11 (question 6.0), cell F11 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, which writes each menu option out in full — requirement S7-R2: "The menu has an option labeled “Download Summary (PDF)”."; requirement S7-R3: "The menu has an option labeled “Download Expanded View (PDF)”."; requirement S7-R4: "The menu has an option labeled “Download Summary (CSV)”." Every one begins with the word Download.
>
> Chris Ward confirmed the same thing on 5 August 2026 in our questions spreadsheet — https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true — tab "The product vs your write-up", row 11 (question 6.0), where he answered: "B) is correct here. Consistency is key." Option B in that row was: "Bring it into line with Sales By Customer and Sales By Representative - the longer “Download ...” wording. We raise it with engineering."
>
> One honest caveat, and it is only about how many options there should be, not their wording: the description names three options and the product ships four. His answer settles the wording and does not state the count, so the count is still his to confirm.
>

## [SV-8886](https://shopview.atlassian.net/browse/SV-8886) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8689 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.3 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.3 (Scope picker), which says: "“Select multiple” is an opt-in control that switches the line rows into checkboxes and shows a confirm bar with a running tally (“Create shift · 2 lines · 6h”), a “Select all” shortcut (equivalent to whole order), and Cancel (returns to the fast single-tap list)."
>

## [SV-8907](https://shopview.atlassian.net/browse/SV-8907) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8665 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Work In Progress v9 S9-R1, S9-R2, S9-R4, S9-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Work In Progress report specification, version 9, Story 9, which describes a download that produces a file. Requirement S9-R1: "The toolbar has a menu, opened from a three-dot button, holding the download options “Download (PDF)” and “Download (CSV)”." Requirement S9-R2: "Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last." Requirement S9-R4: "Both downloads include a Totals row matching the on-screen Totals row for the tab." And requirement S9-R9 even names the files: "The downloaded files are named “wip-2-report.pdf” and “wip-2-report.csv”."
>
> A specification that says what is inside the file and what the file is called is asking for a file to be produced. There is nothing to satisfy if the request ends in a server error.
>
> One honest note: unlike the Inventory Value and Sales By Customer descriptions, the Work In Progress description sets no export size limit and gives no wording for a failed download, so a download that fails is not an outcome it contemplates at all.
>

## [SV-8908](https://shopview.atlassian.net/browse/SV-8908) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8663 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Work In Progress v9 S7-R4 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Work In Progress report specification, version 9, requirement S7-R4, which says: "The toolbar has an Asset filter, a searchable type-ahead multi-select listing the assets present across all open jobs in the current scope. Each option shows the unit number and the vehicle identification number, and the user's typed text matches against EITHER the unit number OR the vehicle identification number." Two different vehicles that share a unit number are two assets present in scope, so both belong in the list.
>

## [SV-8912](https://shopview.atlassian.net/browse/SV-8912) — Filters

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8798 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Filters v18 S13-R16, S13-R17, S13-R18, S13-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Filters specification, version 18, and three requirements settle it together.
>
> Requirement S13-R16: "Mobile uses the same inline expansion as desktop. There is no modal, no separate search screen, and no mobile-only state in the component. Tapping the collapsed control expands it in place within the action row, moves focus into the field and raises the keyboard".
>
> Requirement S13-R17: "On mobile the expanded field fills the remaining width of the action row rather than taking the fixed 180px desktop width. On Work Orders that resolves to 162px. All other toolbar actions remain visible and in position throughout; nothing is hidden while searching".
>
> Requirement S13-R18: "To create that room, the primary CTA on mobile uses its natural hug width instead of stretching to fill the row: “New Work Order” is 144px, the same width it has on desktop, not 211px."
>
> The same specification also keeps the page search and the application-wide search apart, in requirement S13-R9: "Search is scoped strictly to the records in the current table. It never returns results from another table, another page, another module, or any content outside that table." So the global search cannot stand in for the page search.
>

## [SV-8924](https://shopview.atlassian.net/browse/SV-8924) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8688 (unchanged) |
| **Source type** | **2** — the specification (PRD) — PARTLY supporting, see FLAGGED.md |
| Document named | Schedule v23 sections 3.2 and 4.2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 3.2, which says of the unassigned row: "Dragging a shift from this row down onto a technician assigns it." And section 4.2, which says: "When an unassigned shift is later dragged onto a technician row in the grid, that technician's hours apply."
>
> One honest caveat about what that source does and does not support. It supports the start time landing on the technician's own working hours. It does not say the start time must be left exactly as it was, so this ticket's wording is stricter than the written rule. Either way the result seen is wrong: the job moved to 1:00 in the morning, and the technician it was given to starts at 7:00 in the morning — so 1:00 AM is neither the time the job had nor that technician's hours.
>

## [SV-8925](https://shopview.atlassian.net/browse/SV-8925) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8612 (unchanged) |
| **Source type** | **2** — the specifications (PRD, two reports) |
| Document named | Sales By Customer v15 S14-R9/R10/R11 · Sales By Representative v17 S14-R17 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: both reports' own specifications, which ask for plain numbers so the file can be re-used.
>
> the Sales By Customer report specification, version 15, requirement S14-R9: "The Margin % cell is a plain number to one decimal with no percent sign (for example, 64.7); it is empty when the row's Subtotal is zero or below."
>
> the Sales By Customer report specification, version 15, requirement S14-R10: "Dates export as mm-dd-yyyy — for example, 05-14-2026 — matching the ShopView-wide CSV date format."
>
> the Sales By Customer report specification, version 15, requirement S14-R11: "Currency values export as plain numbers with no dollar sign and no thousands separators."
>
> the Sales By Representative report specification, version 17, requirement S14-R17: "CSV cell formatting (both CSVs): numeric columns are emitted as plain numbers for re-pivoting — no currency symbol, thousands separators, or parentheses; a negative value uses a leading minus (-1234.56)."
>

## [SV-8926](https://shopview.atlassian.net/browse/SV-8926) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8671 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S4-R1 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S4-R1, which says: "A totals row is shown at the bottom of the report, with the literal label “Total” in the Part # column's cell." The word literal is the specification's own.
>

## [SV-8927](https://shopview.atlassian.net/browse/SV-8927) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8670 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S3-R12, S3-R13, S8-R3 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S3-R12, which lists what is on screen at the start: "On first visit, the visible columns are: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin %, and Total Cost." Margin and Total Sell are not in that list.
>
> The same specification, requirement S3-R13, says so directly: "The Margin and Total Sell columns are hidden by default and can be turned on from the column-selection control (Story 8)." And requirement S8-R3 repeats it: "Every other column is available in the control; Margin and Total Sell are off by default, the rest on by default (S3-R12)."
>

## [SV-8928](https://shopview.atlassian.net/browse/SV-8928) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8675 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S8-R5 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S8-R5, which says: "The report remembers, in the user's browser, the selected date range, category selection, vendor selection, part search text, location selection, column selection, and sort, and restores them on the user's next visit." The part search text is named in that list.
>

## [SV-8929](https://shopview.atlassian.net/browse/SV-8929) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8675 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S8-R6 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S8-R6, which says: "Restore is defensive: a saved value that is no longer valid falls back to that setting's default rather than breaking the view. A saved category or vendor no longer present in the data is dropped."
>

## [SV-8930](https://shopview.atlassian.net/browse/SV-8930) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8668 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S1-N2, S5-N1, S7-N2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, which says three separate times that an empty result shows a message rather than a bare empty table.
>
> Requirement S1-N2: "If no in-stock part exists for the selected location(s) on the resolved date, the report shows the no-data message (Story 12) instead of rows."
>
> Requirement S5-N1: "If there is no recorded day on or before the end of the selected range... the report shows the no-data message (Story 12) and no totals row."
>
> Requirement S7-N2: "If the selected location(s) hold no in-stock parts on the resolved date, the report shows the no-data message (Story 12)."
>

## [SV-8931](https://shopview.atlassian.net/browse/SV-8931) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8674 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S1-R3, S7-R2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S1-R3, which says: "On the user's first visit (no saved settings — Story 8), the report defaults to the current calendar month date range and the user's currently active location."
>
> The same specification, requirement S7-R2, repeats it for the filter itself: "On a first visit (no saved selection — Story 8), it defaults to the user's currently active location."
>

## [SV-8932](https://shopview.atlassian.net/browse/SV-8932) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8679 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Inventory Value v4 S12-R6, S12-R8 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Inventory Value report specification, version 4, requirement S12-R6, which covers the long text: "Long text values (Description, Category, Vendor) are truncated with an ellipsis when they overflow their column, with the full value available on hover; the Part # is never truncated."
>
> And requirement S12-R8, which covers the headings: "Each sortable column header exposes its sort state to assistive technology, and the active sort direction is indicated visually."
>

## [SV-8933](https://shopview.atlassian.net/browse/SV-8933) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8699 (unchanged) |
| **Source type** | **2** — the specification (PRD) — PARTLY supporting, see FLAGGED.md |
| Document named | Schedule v23 section 4.2 — Hours settings |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.2, under "Hours settings (tech and business hours)", which says: "Behind a toggle, off by default. Each section sits behind a toggle (“Set custom hours for this technician” / “Set business hours for this shop”). The per-day editor appears only when the toggle is on." The same section then describes the per-day editor: "One row per day (Mon–Sun): day name, with From → To ranges on the right."
>
> One honest caveat: the specification puts no condition on which location the staff member is being viewed from, and it does not say anywhere whether working hours are meant to be held per location. It is silent on that point. So what the source settles is that turning the toggle on must reveal the editor; it does not settle whether a person from another location should be reachable at all. If the answer is that hours really are per location, then the right outcome is not an error but a screen that says so — and that is a product owner's decision, not a developer's.
>

## [SV-8934](https://shopview.atlassian.net/browse/SV-8934) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8646 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S6-R6 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S6-R6, which says: "The PDF is formatted for A3 landscape, titled Parts Velocity. In the PDF, Description, Category, and Vendor are truncated to 18 characters. Part # is not truncated. The CSV carries the full, untruncated Description / Category / Vendor values."
>

## [SV-8935](https://shopview.atlassian.net/browse/SV-8935) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8646 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S6-R8 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S6-R8, which says: "Last Sale renders as N days (e.g. 42 days) in the PDF; the CSV renders the raw integer." So the words belong in the printable file and a plain number belongs in the spreadsheet.
>

## [SV-8936](https://shopview.atlassian.net/browse/SV-8936) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8646 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S6-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S6-R9, which says: "On a successful download, a success toast reads “Velocity report exported (CSV)” or “Velocity report exported (PDF)”." The wording names the report and the file type, which the general message does not.
>

## [SV-8938](https://shopview.atlassian.net/browse/SV-8938) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8643 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S7-R8, S2-R12 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S7-R8, which says: "When shown (S2-R12 / S3-R10), the per-row Location column renders as the leftmost column, before Type, using the suite's standard column treatment so its placement matches the same column on the other reports in the suite."
>
> The same specification, requirement S2-R12, says when it is shown at all: "When the Location filter (S2-R9) resolves to more than one location in scope, the table shows a per-row Location column identifying each row's location; when a single location is in scope the column is hidden."
>

## [SV-8939](https://shopview.atlassian.net/browse/SV-8939) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8642 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S2-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S2-R9, which says: "The toolbar provides a Location multi-select filter as the rightmost control in the filter row, listing the locations the signed-in user has access to plus an “All Locations” option. On a first visit it defaults to the user's currently active location (the location currently selected in the application's global location switcher)."
>

## [SV-8940](https://shopview.atlassian.net/browse/SV-8940) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8643 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Parts Velocity v5 S3-R7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Parts Velocity report specification, version 5, requirement S3-R7, which says: "The Description, Category, and Vendor columns truncate long text with an ellipsis on screen; the full value is available on native hover (browser tooltip) and is written in full to the CSV export (S6). Part # is never truncated (on screen or in any export)."
>

## [SV-8941](https://shopview.atlassian.net/browse/SV-8941) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8690 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.4 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.4 (Shift block anatomy and scope labeling), which says of the VIN line: "Line 3 (optional): VIN number, visible only when the VIN toggle is on in Filter and Display (§6). Shown in day and week views only; month view omits it due to space constraints."
>

## [SV-8942](https://shopview.atlassian.net/browse/SV-8942) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8686 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 11 — Responsiveness |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 11 (Non-functional requirements), which says under Responsiveness: "Minimum supported width is 960px (the grid scrolls horizontally below that), and the sidebar collapses on narrow viewports." Both halves are in that one sentence: it is the grid that scrolls sideways, and the sidebar collapses.
>

## [SV-8943](https://shopview.atlassian.net/browse/SV-8943) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8648 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S1-R3, S9-R2 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S1-R3, which says: "On the user's first visit (no saved settings — §3), the report defaults to the current calendar month (the date picker's “This Month” preset) and the user's currently active location."
>
> The same specification, requirement S9-R2, says it again for the filter itself: "On a first visit (no saved selection — §3), it defaults to the user's currently active location (the location currently selected in the application's global location switcher)."
>

## [SV-8944](https://shopview.atlassian.net/browse/SV-8944) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8648 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S1-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S1-R9, which says: "Reconciliation guarantee (scope). For the same date range and the same single location, and counting closed clock records, this report's Total Hours for a technician equals the Timesheet Activities report's total for that technician to the cent."
>

## [SV-8945](https://shopview.atlassian.net/browse/SV-8945) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8649 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S2-R13, S7-R10a |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S2-R13, which says: "All six columns (Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor) are sortable by clicking the column header. Clicking a column that is not the active sort sorts it ascending; clicking the active sort column again toggles it to descending."
>
> That the sort happens on screen rather than by asking the server again is stated in requirement S7-R10a: "The on-screen column sort (S2-R13) is applied client-side only and is not carried into the export."
>

## [SV-8946](https://shopview.atlassian.net/browse/SV-8946) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8652 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S9-R3, S4-R5 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S9-R3, which draws the distinction in its own words: "Selecting one, several, or all locations reloads the report scoped to that set (unlike the technician filter, which is on-screen only)."
>
> The same specification, requirement S4-R5, depends on that being true: "Expansion state is view-only and is not persisted: it resets (all collapsed) on any data reload (date-range or location change) and on a fresh visit. Deselecting and re-selecting a technician in the technician filter (an on-screen operation) does not change the expansion state of the other rows."
>

## [SV-8947](https://shopview.atlassian.net/browse/SV-8947) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8652 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S5-R1, S5-R6, S5-R7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, which writes the labels out in full — requirement S5-R1: "The toolbar has a filter labeled “Filter by Technician” where the user can select more than one technician."; requirement S5-R6: "The filter has a control labeled “Select all” to select all technicians at once."; requirement S5-R7: "The filter has a control labeled “Clear all” to clear all technicians at once."
>

## [SV-8948](https://shopview.atlassian.net/browse/SV-8948) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8654 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S7-R8, S7-N1 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S7-R8, which says: "Every download includes only the technicians that are currently selected in the technician filter, and covers the location(s) currently selected in the location filter."
>
> The same specification, requirement S7-N1, covers the empty case: "If no technician is selected, choosing a download option does nothing: no file downloads and no message appears."
>

## [SV-8949](https://shopview.atlassian.net/browse/SV-8949) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8654 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S7-R10a |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S7-R10a, which says: "Rows in every download are ordered by Technician name A→Z (the default order). The on-screen column sort (S2-R13) is applied client-side only and is not carried into the export."
>

## [SV-8950](https://shopview.atlassian.net/browse/SV-8950) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8654 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S7-R5, S7-R6, S7-R7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, which names the Summary row in all three files — requirement S7-R5: "The Summary PDF shows the technician rows and the Summary row."; requirement S7-R6: "The Expanded PDF shows the technician rows, each technician's per-day breakdown, and the Summary row."; requirement S7-R7: "The CSV file shows the technician rows and the Summary row."
>

## [SV-8951](https://shopview.atlassian.net/browse/SV-8951) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8654 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S7-R7, S7-R12 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S7-R7, which says what the spreadsheet holds: "The CSV file shows the technician rows and the Summary row. The CSV is always this summary-level content; it does not vary by the summary/expanded choice." Per-day rows are not part of that.
>
> The same specification, requirement S7-R12, names the files: "The downloaded files are named “Technician-Utilization-Summary.pdf”, “Technician-Utilization-Expanded.pdf”, and “technician-utilization.csv”."
>

## [SV-8952](https://shopview.atlassian.net/browse/SV-8952) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8654 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 Story 7 Error Handling + the section 7 notifications table |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, Story 7 under Error Handling, which gives both wordings: "When a download starts, the user sees a success notification: “Download started”." and "If a download fails, the user sees an error notification: “Failed to download report”."
>
> The same two appear again in the notifications table in section 7 of that specification, where the trigger "A download starts" is paired with the message "Download started", and the trigger "A download fails" with the message "Failed to download report".
>

## [SV-8953](https://shopview.atlassian.net/browse/SV-8953) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8655 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S4-R1, S4-R4, S8-R12 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S4-R1, which says: "Each technician row has a control to expand and collapse it. The control carries an accessible name reflecting its next action, scoped to that technician (“Expand 's daily breakdown” when the row is collapsed, “Collapse 's daily breakdown” when it is expanded)."
>
> Requirement S4-R4 asks for the same of the all-rows control, and requirement S8-R12 states the accessibility duty outright: "The expand/collapse controls (per-row S4-R1 and the all-rows control S4-R4) are keyboard-focusable, toggle on Enter/Space, expose their expanded/collapsed state to assistive technology, and carry the verbatim accessible names defined in S4-R1 (per-row) and S4-R4 (all-rows)."
>

## [SV-8954](https://shopview.atlassian.net/browse/SV-8954) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8656 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Technician Utilization v6 S10-R4, S9-R9 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Technician Utilization report specification, version 6, requirement S10-R4, which says: "The per-row Location column is one of the toggleable columns for a user with access to more than one location: it is shown by default and can be toggled on or off from the column selector (S9-R9). A user with access to only one location never sees it and it is not offered to them in the column selector."
>
> The same specification, requirement S9-R9, repeats it: "The report shows a per-row Location column to any user with access to more than one location; it is shown by default and can be toggled on or off from the column selector, and a user with access to only one location never sees it." A user who has more than one location must therefore be able to put the column back.
>

## [SV-8955](https://shopview.atlassian.net/browse/SV-8955) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8601 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Sales By Customer v15 S2-R6, S9-R3 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Sales By Customer report specification, version 15, requirement S2-R6, which says: "When the user changes the date range, the chosen value is written to the page link so the report can be shared or bookmarked at that range."
>
> The same specification, requirement S9-R3, adds the Product Type: "Before navigating, the active date range and Product Type are written to the page link so the report can be restored."
>

## [SV-8956](https://shopview.atlassian.net/browse/SV-8956) — Report Suite

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8612 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Sales By Customer v15 S14-R14, S15-R6 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Sales By Customer report specification, version 15, requirement S14-R14, which says: "The files are named for the report, the version, and the active date range: the Summary CSV is sales-by-customer-summary-{range}.csv and the Expanded CSV is sales-by-customer-expanded-{range}.csv. {range} uses this map from range label: Today → today; Yesterday → yesterday; This Week → this_week; Last Week → last_week; This Month → this_month; Last Month → last_month; This Year → this_year; Last Year → last_year; This Quarter → this_quarter; Last Quarter → last_quarter; Custom → custom."
>
> The same specification, requirement S15-R6, applies the same naming to the printable files: "The files follow the same version-and-range naming as the CSV (S14-R14) with a .pdf extension."
>

## [SV-8957](https://shopview.atlassian.net/browse/SV-8957) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8688 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 sections 11 and 7 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 11 (Non-functional requirements), which says under Accessibility: "drag-and-drop has a click-to-arm alternative". The same specification repeats it in section 7 (Interactions and micro-interactions): "Drag-and-drop has a click-to-arm alternative for users who cannot drag."
>

## [SV-8958](https://shopview.atlassian.net/browse/SV-8958) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8692 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.6 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.6 (Linked series and banners), which says: "Month view: a continuous bar wrapping across week rows, labeled once at the start (with the technician), with a faded “continues” label on later weeks, empty weekend columns (when business hours are not set for weekends)." The words in brackets are the part that is missing.
>

## [SV-8959](https://shopview.atlassian.net/browse/SV-8959) — Schedule

| | |
|---|---|
| Status | **Open** |
| Priority | Low (unchanged) |
| Type | Story Defect (unchanged) |
| Parent | SV-8695 (unchanged) |
| **Source type** | **2** — the specification (PRD) |
| Document named | Schedule v23 section 4.13 |
| Verification | one block · description above it byte-identical · no other field changed |

**The block as written:**

> Where this expected behaviour comes from: the Schedule specification, version 23, section 4.13 (Hover tooltips), which sets out the order of the tooltip's contents beginning: "Shift tooltip: customer name (plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range; technician; scope summary..." and ending "...and the conflict reason in amber when conflicted." So the reason at the bottom is correct; what is missing is the icon beside the customer name on the first line.
>
