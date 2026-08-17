# -*- coding: utf-8 -*-
import os,sys; sys.path.insert(0,os.path.dirname(__file__))
from bodies import exp,J
V='[spec v21 2026-08-14]'
U={}
def mk(cid,title,refs,pre,steps,ex): U[cid]=dict(title=title,refs=refs,preconds=pre,steps=steps,expected=ex)

# ===== Filter Bar Layout (SV-9268) =====
mk(29557,"Filter chips sit in the Work Orders toolbar row, not a separate filter bar",
   f"SV-9268 (S1-R1; S1-R4) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Look at where the filter chips are placed on the page.","2. Look for any separate filter bar or a control to hide the chips."),
   exp(["1. The filter chips sit in the page's main toolbar row, right-aligned, in the same row as the tabs.",
        "2. There is no separate filter bar row above or below the tabs.",
        "3. The chips are always visible - there is no button to hide, collapse or expand them."],
     "S1-R1; S1-R4","story SV-9268 (Filter layout in the toolbar) and SV-9269 (remove the collapse toggle),"))
mk(29558,"Work Orders shows three filter chips: Status, Assigned to me, Asset on Site",
   f"SV-9268 (S1-R5; S1-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page, All tab."),
   J("1. Read the filter chips in the toolbar row, left to right.","2. Look at each chip's parts."),
   exp(["1. There are THREE filter chips, in this order: Status, Assigned to me, Asset on Site.",
        "2. Customer, Lead Technician and Service Advisor are NOT filter chips here - they were removed in the redesign.",
        "3. Each chip shows a leading type-icon, the filter name, and a chevron (arrow) that shows it opens a panel.",
        "4. The 'Assigned to me' chip is the exception: it has no chevron because it is a simple on/off toggle."],
     "S1-R5; S1-R6","story SV-9268 (Filter layout in the toolbar) and SV-9270 (reduce Work Orders filters),"))
mk(29559,"On the Estimates tab the Assigned to me and Asset on Site chips still show",
   f"SV-8794 (S1-N1; S9-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Go to the Estimates tab.","2. Read which filter chips are shown."),
   exp(["1. The 'Assigned to me' and 'Asset on Site' chips are shown on the Estimates tab.",
        "2. The Status chip is not among them on this tab, because the Estimates tab already pre-filters by status (the Status chip shows on the All tab only).",
        "3. Note: there is an open question on whether the Status chip should be hidden or shown greyed/pre-filled on this tab - see the tab-behaviour cases; that point is being confirmed with the QA lead and is not settled by this case."],
     "S1-N1; S9-R5","story SV-9272 (tab model),"))

# ===== Active chips / Clear (SV-9274) =====
mk(29597,"There is no global Clear filters button; each filter is cleared on its own",
   f"SV-9274 (S8-R1; S7-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page with one or more filters active."),
   J("1. Look across the toolbar for a single 'Clear filters' button.","2. Hover a selected chip and use its X-circle; also open a panel and use 'Clear selection'."),
   exp(["1. There is NO single 'Clear filters' button anywhere - it was removed in the redesign.",
        "2. A filter is cleared one at a time: either by clicking the X-circle on its selected chip, or by 'Clear selection' inside its open panel.",
        "3. Clearing one filter leaves the others untouched."],
     "S8-R1; S7-R6","story SV-9274 (remove the global Clear filters control),"))
mk(29598,"Clearing a filter does not clear a typed search, and vice versa",
   f"SV-9274 (S8-R1; S8-R5; S13-R13) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page with a filter active and a search query typed."),
   J("1. Clear one filter using its X-circle or 'Clear selection'.","2. Then clear the search query using the search box X.","3. Watch the list at each step."),
   exp(["1. Filters are cleared one at a time (there is no global Clear filters button).",
        "2. Clearing a filter does NOT clear the typed search - the search stays and keeps narrowing the list.",
        "3. Clearing the search does NOT clear any filters - they stay applied.",
        "4. The search and the filters are cleared independently of each other."],
     "S8-R1; S8-R5; S13-R13","story SV-9274 (remove the global Clear filters control),"))
mk(29600,"Status and Asset on Site together show only work orders matching both",
   f"SV-8787 (S2-R2; S6-R2; S8-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page, All tab."),
   J("1. Select one or more statuses in the Status filter.","2. Then set the Asset on Site filter to Yes.","3. Note the list."),
   exp(["1. The list shows only work orders that match BOTH the chosen status(es) AND the Asset on Site choice (the filters combine together).",
        "2. Clearing one of the two filters re-widens the list to the other filter alone.",
        "3. (Customer is no longer a Work Orders filter, so this combination now uses Status with Asset on Site.)"],
     "S2-R2; S6-R2; S8-R5","story SV-9270 (reduce Work Orders filters),"))

# ===== Collapse and Expand -> removed feature (SV-9269) =====
mk(29601,"There is no control to collapse or hide the filter chips on any page",
   f"SV-9269 (S1-R4; S12-R5) {V}",
   J("1. You are signed in.","2. You can reach the Work Orders page on desktop and on a phone."),
   J("1. On desktop, look for any button that hides, collapses or expands the filter chips.","2. Repeat on a phone-width screen."),
   exp(["1. The filter chips are always visible. There is no control to hide, collapse or expand them - on any page or any screen size.",
        "2. The old collapse/expand toggle has been removed by the redesign, on desktop and on mobile."],
     "S1-R4; S12-R5","story SV-9269 (remove the filter bar collapse/expand toggle),"))
mk(29602,"There is no remembered collapsed or expanded state, because there is no toggle",
   f"SV-9269 (S1-R4; S10-R1) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Look for any collapsed/expanded chip state to set.","2. Leave the page and return."),
   exp(["1. Because there is no collapse control, there is no collapsed-or-expanded state to remember.",
        "2. On return, the chips are shown exactly as before - always visible. Only the actual filter selections are remembered (Story 10)."],
     "S1-R4; S10-R1","story SV-9269 (remove the filter bar collapse/expand toggle),"))
mk(29603,"There is no collapsed-state indicator, because the chips are always shown",
   f"SV-9269 (S1-R4; S7-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page with a filter active."),
   J("1. Look for a small indicator on a collapsed toolbar button showing that filters are active."),
   exp(["1. There is no collapsed-state active-filter indicator - it was removed with the collapse toggle.",
        "2. An active filter is shown directly on its own chip, which takes the highlighted (selected) appearance (Story 7)."],
     "S1-R4; S7-R5","story SV-9269 (remove the filter bar collapse/expand toggle),"))
mk(29604,"Active filters always keep filtering the table; there is no bar to collapse",
   f"SV-9269 (S1-R4) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Apply one or more filters and watch the table.","2. Confirm there is no way to collapse the chips."),
   exp(["1. Active filters keep narrowing the table at all times.",
        "2. There is no filter bar to collapse, so there is no collapsed state that could stop the filtering - the chips and their effect are always present."],
     "S1-R4","story SV-9269 (remove the filter bar collapse/expand toggle),"))
mk(29605,"Every page shows its filter chips with no toggle, whatever the filter count",
   f"SV-9269 (S1-R4; S1-R8) {V}",
   J("1. You are signed in on a desktop browser.","2. You can reach a page with one filter and a page with several filters."),
   J("1. On a page with only one filter, look for a collapse toggle.","2. On a page with several filters, look for a collapse toggle."),
   exp(["1. Neither page has a collapse toggle - the old 'show the toggle only when a page has more than one filter' rule is gone.",
        "2. Every page simply shows the filter chips it provides, always visible, with no toggle at all."],
     "S1-R4; S1-R8","story SV-9269 (remove the filter bar collapse/expand toggle),"))
mk(43590,"No collapse control exists even on a page that has only one filter",
   f"SV-9269 (S1-R4; S1-R8) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on a page that has only one filter chip."),
   J("1. Look for a button to hide or collapse the single filter chip."),
   exp(["1. There is no collapse control - the single filter chip is simply always shown.",
        "2. The redesign removed the toggle entirely, so a one-filter page behaves the same as any other: chips always visible, no toggle."],
     "S1-R4; S1-R8","story SV-9269 (remove the filter bar collapse/expand toggle),"))

# ===== Tab Behaviour (SV-9272) =====
mk(29608,"The All tab shows the three Work Orders filter chips, all working",
   f"SV-8794 (S9-R1; S1-R5; S9-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page, All tab."),
   J("1. Read the tabs and the filter chips on the All tab.","2. Try each chip."),
   exp(["1. The tabs are: All, Work Orders, Estimates, Completed (there is no My Work Orders tab).",
        "2. On the All tab all three chips are shown: Status, Assigned to me, Asset on Site.",
        "3. Each works: Status and Asset on Site open their panels; Assigned to me toggles on and off.",
        "4. The Status chip is shown on the All tab only."],
     "S9-R1; S1-R5; S9-R5","story SV-9272 (tab model),"))
mk(29609,"Estimates tab: Assigned to me and Asset on Site chips work; Status pre-set",
   f"SV-8794 (S9-R3; S9-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Go to the Estimates tab.","2. Read the chips shown and try them.","3. Note how the Status is handled."),
   exp(["1. The Estimates tab pre-filters the list to the Estimate status.",
        "2. The 'Assigned to me' and 'Asset on Site' chips are shown and work on this tab.",
        "3. OPEN POINT (held, not settled by this case): spec v21 S9-R5 says the Status chip is HIDDEN on the Estimates tab, but a recorded QA-lead ruling of 30 July 2026 said it should be shown greyed-out and pre-filled with Estimate. This conflict has been flagged to the QA lead; test the Status-chip appearance against whichever he confirms.",
        "4. (Customer, Lead Technician and Service Advisor are no longer filters here - they were removed.)"],
     "S9-R3; S9-R5","story SV-9272 (tab model); QA-lead ruling 2026-07-30 (greyed) vs v21 S9-R5 (hidden) - CONFLICT held,"))
mk(29610,"Completed tab: Assigned to me and Asset on Site chips work; Status pre-set",
   f"SV-8794 (S9-R4; S9-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Go to the Completed tab.","2. Read the chips shown and try them.","3. Note how the Status is handled."),
   exp(["1. The Completed tab pre-filters the list to the statuses Complete, Invoiced and Paid.",
        "2. The 'Assigned to me' and 'Asset on Site' chips are shown and work on this tab.",
        "3. OPEN POINT (held, not settled by this case): spec v21 S9-R5 says the Status chip is HIDDEN on the Completed tab, but a recorded QA-lead ruling of 30 July 2026 said it should be shown greyed-out and pre-filled. This conflict has been flagged to the QA lead; test the Status-chip appearance against whichever he confirms.",
        "4. (Customer, Lead Technician and Service Advisor are no longer filters here - they were removed.)"],
     "S9-R4; S9-R5","story SV-9272 (tab model); QA-lead ruling 2026-07-30 (greyed) vs v21 S9-R5 (hidden) - CONFLICT held,"))
mk(29611,"The Work Orders tab pre-filters to Estimate, Approved and In Progress",
   f"SV-9272 (S9-R1; S9-R2; S9-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. Work orders exist across several statuses."),
   J("1. Click the Work Orders tab.","2. Note which work orders are shown and which chips are visible."),
   exp(["1. There is NO My Work Orders tab any more - it was removed. Its job is done by the 'Assigned to me' chip.",
        "2. The Work Orders tab shows only work orders with the statuses Estimate, Approved and In Progress.",
        "3. On this tab the Status chip is not shown (Status shows on the All tab only); the Assigned to me and Asset on Site chips are shown."],
     "S9-R1; S9-R2; S9-R5","story SV-9272 (Work Orders tab model),"))
mk(29612,"A Status choice is kept while you switch tabs and returns on the All tab",
   f"SV-8794 (S9-R6; S9-N1) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page, All tab."),
   J("1. On the All tab, select some statuses in the Status filter.","2. Switch to another tab that hides the Status chip, then back to All."),
   exp(["1. Your Status selection is kept in memory while you are on a tab that hides the Status chip.",
        "2. It does not visually carry over to the other tab, but it is not lost.",
        "3. When you return to the All tab, the Status chip reappears with your selection still applied."],
     "S9-R6; S9-N1","story SV-9272 (tab model),"))

# ===== Asset on Site -> single-select checkmark (SV-9275) =====
mk(29589,"Asset on Site opens a single-select list with a checkmark on the chosen row",
   f"SV-9275 (S6-R1; S16-R4; S16-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Click the Asset on Site chip.","2. Read the panel and pick an option."),
   exp(["1. A single-select list panel opens with two options: Yes and No.",
        "2. You can pick only one at a time. The chosen row is marked with a checkmark icon (not a radio button and not a checkbox).",
        "3. A 'Clear selection' action is in the panel; it removes the filter."],
     "S6-R1; S16-R4; S16-R6","story SV-9275 (Asset on Site single-select panel),"))
mk(29591,"Asset on Site is single-select: choosing the other option replaces the first",
   f"SV-9275 (S6-R2; S6-R3) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page with the Asset on Site panel open."),
   J("1. Choose Yes and note the checkmark and the list.","2. Then choose No."),
   exp(["1. Choosing Yes marks the Yes row with a checkmark and narrows the list to work orders whose asset is on site.",
        "2. Choosing No replaces the Yes selection (the checkmark moves to No) - only one value can be selected at a time.",
        "3. The list updates to match the newly chosen value."],
     "S6-R2; S6-R3","story SV-9275 (Asset on Site single-select panel),"))

# ===== Empty state (SV-9274/SV-8793) =====
mk(29607,"The filtered empty state names the active filters and search and clears each",
   f"SV-8793 (S8-R3; S8-R4; S8-R5) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Apply filters and type a search that together match no work orders.","2. Read the empty state.","3. Use it to clear the search, and clear a filter from its chip."),
   exp(["1. An empty state is shown saying no results were found for the current filters and search.",
        "2. It names what is currently narrowing the list - the active filters and, where present, the search query - and offers to clear the query.",
        "3. Filters are cleared from their chips (there is no global Clear filters button).",
        "4. The search and the filters are cleared independently: clearing one does not clear the other."],
     "S8-R3; S8-R4; S8-R5","story SV-9274 (clearing filters and empty state),"))

# ===== Persistence (SV-8795) =====
mk(29613,"Leaving the page and returning restores your filter selections",
   f"SV-8795 (S10-R1; S10-R2) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on the Work Orders page."),
   J("1. Apply one or more filters.","2. Navigate to another page and come back."),
   exp(["1. Your filter selections are restored exactly as you left them.",
        "2. There is no filter-bar collapsed/expanded state to restore, because the collapse control was removed - only the filter selections are remembered.",
        "3. Selections are stored against your user account (Story 10), not just this browser."],
     "S10-R1; S10-R2","story SV-8795 (Filter persistence) and SV-9269 (collapse removed),"))

# ===== Page search: S13-E1 removed (SV-8798) =====
mk(38903,"Your typed search keeps working as you sort, page and leave and return",
   f"SV-8798 (S13-R14; S13-R12) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on a list page with a search box."),
   J("1. Type a search query so the list narrows.","2. Sort a column, move to another page of results, then navigate away and back."),
   exp(["1. The typed search keeps narrowing the list.",
        "2. It survives sorting, paging, and navigating away from the page and back within the same browser tab.",
        "3. (The old edge case about a collapsed filter bar no longer applies - the filter bar collapse control was removed in the redesign.)"],
     "S13-R14; S13-R12","story SV-8798 (Page Search) and SV-9269 (collapse removed),"))

# ===== Reports date-range panel presets (SV-9276) =====
mk(38882,"The date-range panel offers set periods and a custom start and end range",
   f"SV-9276 (S16-R5; S16-R6) {V}",
   J("1. You are signed in on a desktop browser.","2. You are on a report that has a Date filter."),
   J("1. Click the Date chip.","2. Read the list of periods.","3. Choose a preset, then choose Custom and pick two dates."),
   exp(["1. A single-select preset list opens with these periods in this order: Today, Yesterday, This week, This month, Last month, This quarter, This year, Custom.",
        "2. Choosing a preset applies it straight away.",
        "3. Choosing Custom reveals a range input with the placeholder MM/DD/YYYY - MM/DD/YYYY; the custom range applies only when the second date is picked.",
        "4. A 'Clear selection' action is in the panel footer and clears only this filter."],
     "S16-R5; S16-R6","story SV-9276 (Filter panel types),"))

# ===== Mobile (SV-9278) =====
mk(29621,"On a phone the toolbar splits into a tabs row, an action row and a chips row",
   f"SV-9278 (S12-R1; S12-R4; S12-R6) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page."),
   J("1. Look at the page chrome below the top application header.","2. Note the rows and the chips row."),
   exp(["1. Below the application header the page stacks into three rows, in this order: the tabs row, the action row, then the filter chips row.",
        "2. The chips row is horizontally scrollable and separated from the row above by a divider.",
        "3. The chips are the same set as desktop, in the same order (Status on the All tab only), and are always visible - there is no collapse control.",
        "4. There is no combined 'All Filters' button - each chip is shown on its own."],
     "S12-R1; S12-R4; S12-R6","story SV-9278 (mobile stacked toolbar rows),"))
mk(29622,"On a phone each filter chip opens its own bottom sheet, not one combined drawer",
   f"SV-9278 (S12-R7; S12-R8; S12-R9) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page."),
   J("1. Tap a filter chip in the chips row.","2. Read the sheet that appears."),
   exp(["1. Tapping a chip opens THAT filter's panel as a bottom sheet - there is no combined 'All filters' drawer.",
        "2. The sheet slides up from the bottom over a dimmed page, with the filter name and a close (X) at the top.",
        "3. Its body uses the same panel type that filter uses on desktop (checkbox list, searchable list, or single-select with a checkmark).",
        "4. Its footer has a full-width 'Apply filters' button."],
     "S12-R7; S12-R8; S12-R9","story SV-9278 (per-filter bottom sheets),"))
mk(29623,"On a phone, choices in a filter sheet apply only when you tap Apply filters",
   f"SV-9278 (S12-R11; S12-R13; S12-N2) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page with a filter sheet open."),
   J("1. Make some selections in the open sheet and watch the list behind it.","2. Tap 'Apply filters'.","3. Re-open a sheet, change it, then close it with the X."),
   exp(["1. Selections made inside the sheet are staged - the list behind does NOT change while the sheet is open (deferred apply).",
        "2. Tapping 'Apply filters' applies the staged selections and closes the sheet; the list then updates.",
        "3. A 'Clear selection' action appears in the sheet once at least one value is selected, clearing only that filter.",
        "4. Closing the sheet with the X or by tapping outside discards the staged changes; filters applied before the sheet was opened stay in effect."],
     "S12-R11; S12-R13; S12-N2","story SV-9278 (mobile deferred apply),"))
mk(29624,"On a phone the same deferred-apply rule applies to every single filter sheet",
   f"SV-9278 (S12-R13; S12-R7) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page."),
   J("1. Open one filter's sheet, make a choice, and tap Apply filters.","2. Repeat with a different filter's sheet."),
   exp(["1. Every filter opens its own bottom sheet (one chip, one sheet) - there is no combined drawer.",
        "2. Each sheet uses deferred apply: nothing changes in the list until you tap 'Apply filters' in that sheet.",
        "3. This is the same for all filters, not just a combined view."],
     "S12-R13; S12-R7","story SV-9278 (per-filter bottom sheets),"))
mk(29625,"On a phone, Assigned to me toggles on and off in the chips row with no sheet",
   f"SV-9278 (S12-R12; S6a-R2) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page."),
   J("1. Tap the 'Assigned to me' chip in the chips row.","2. Tap it again."),
   exp(["1. Tapping 'Assigned to me' toggles the filter on and off directly in the chips row.",
        "2. It does NOT open a bottom sheet, because it is a toggle chip with no panel.",
        "3. When on, the chip takes the active appearance and the list narrows to your work orders."],
     "S12-R12; S6a-R2","story SV-9278 (mobile toggle) and SV-9271 (Assigned to Me),"))
mk(29626,"On a phone a filter sheet appears over a dimmed page and closes on X or scrim",
   f"SV-9278 (S12-R8; S12-N2) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page with a filter sheet open."),
   J("1. Note the dimmed background behind the sheet.","2. Make a change, then tap the dimmed area (scrim) or the X."),
   exp(["1. The bottom sheet is shown over a dimmed overlay (scrim) covering the page.",
        "2. Tapping the X or tapping the dimmed area closes the sheet and discards any staged changes.",
        "3. Any filters that were applied before the sheet was opened remain in effect."],
     "S12-R8; S12-N2","story SV-9278 (per-filter bottom sheets),"))
mk(29627,"On a phone the Asset on Site sheet is a single-select list with a checkmark",
   f"SV-9278 (S12-R9; S16-R4; S12-R11) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page."),
   J("1. Tap the Asset on Site chip.","2. Read the sheet and pick an option."),
   exp(["1. The Asset on Site sheet is a single-select list with two options: Yes and No.",
        "2. The chosen row is marked with a checkmark; picking the other option replaces the choice.",
        "3. A 'Clear selection' action appears once a value is selected.",
        "4. The choice applies when you tap 'Apply filters'."],
     "S12-R9; S16-R4; S12-R11","story SV-9278 (mobile single-select sheet),"))
mk(29628,"On a phone active chips clear one at a time; there is no Clear filters button",
   f"SV-9278 (S12-R14; S8-R1) {V}",
   J("1. You are signed in on a phone-width screen.","2. You are on the Work Orders page with filters active."),
   J("1. Look at an active chip in the chips row.","2. Look for a single Clear filters button; clear a filter from its own chip or sheet."),
   exp(["1. An active chip shows the same highlighted appearance and value text as on desktop (first value plus a count where there are several).",
        "2. There is no global 'Clear filters' button on mobile either.",
        "3. Each filter is cleared on its own - from its chip or from 'Clear selection' in its sheet."],
     "S12-R14; S8-R1","story SV-9278 (mobile chips) and SV-9274 (no global clear),"))

if __name__=='__main__':
    for cid,u in U.items():
        assert len(u['title'])<=80,(cid,len(u['title']),u['title'])
        assert ',' not in u['refs'],(cid,'comma in refs',u['refs'])
        assert '<' not in u['expected'] and '>' not in u['expected'],cid
        assert len(u['refs'])<=248,(cid,len(u['refs']))
    print("core updates:",len(U),"validated")
