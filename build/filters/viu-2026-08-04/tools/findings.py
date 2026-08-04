#!/usr/bin/env python3
"""THE FINDINGS TABLE — every live observation made on 2026-08-04 against
Filters QA branch sv8785.qa.shopview.com, build v3.4.2-4f8211c.

Each entry: the requirement, the VERBATIM spec text, what was OBSERVED, the verdict,
and the evidence file. Nothing here is inferred (Rule 12).
"""

BUILD = 'v3.4.2-4f8211c'
BRANCH = 'sv8785.qa.shopview.com'
API = 'sv8785api.qa.shopview.com'
OBSERVED = '2026-08-04'
SPEC_VERSION = '1.7'          # Confluence version 17; body token still reads 1.6
SPEC_CONFLUENCE_VERSION = 17

# on-screen labels captured from the DOM (Rule 9 build-accurate wording)
LABELS = {
    'chips': ['Status', 'Customer', 'Lead Technician', 'Service Advisor', 'Asset on Site'],
    'statuses': ['Estimate', 'Approved', 'In progress', 'Review', 'Complete',
                 'Invoiced', 'Paid', 'Declined', 'Imported'],
    'clear_selection': 'Clear Selection',
    'clear_filters': 'Clear Filters',
    'search_placeholder_in_dropdown': 'Search',
    'no_results': 'No results',
    'empty_state': 'No work orders match your filters',
    'page_search_button': 'Search',
    'page_search_placeholder': 'Type to search',
    'back_to_saved': 'Back To My Saved Filters',
    'cta': 'Create Work Order',
    'all_filters_chip': 'All Filters',
    'apply_filters': 'Apply Filters',
    'asset_options': ['Yes', 'No'],
    'tabs': ['All', 'Estimates', 'Completed', 'My Work Orders'],
}

TEST_IDS = {
    'toggle_filter_bar': 'the collapse/expand toggle (filter_list icon)',
    'filter_chip_status': 'Status chip', 'filter_chip_company_id': 'Customer chip',
    'filter_chip_tech_assigned_id': 'Lead Technician chip',
    'filter_chip_service_advisor_id': 'Service Advisor chip',
    'filter_chip_vehicleHere': 'Asset on Site chip',
    'filter_chip_all_filters': 'mobile All Filters chip',
    'filter_option_status_<value>': 'a Status checkbox (Review = ready_for_review)',
    'filter_option_company_id_<uuid>': 'a customer row',
    'filter_option_tech_assigned_id_<uuid>': 'a technician row',
    'filter_option_service_advisor_id_<uuid>': 'an advisor row',
    'filter_option_vehicleHere_1 / _0': 'Asset on Site Yes / No',
    'filter_search_<field>': 'the in-dropdown search box',
    'filter_clear_selection_<field>': 'Clear Selection',
    'filter_tag_company_id_<uuid>': 'a selected-customer tag',
    'clear_filters': 'toolbar Clear Filters',
    'empty_state_clear_filters': 'Clear Filters inside the empty state',
    'page_search_toggle': 'the collapsed page Search button',
    'page_search_input': 'the expanded page search field',
    'page_search_clear': 'the X-circle that clears the query',
    'button_open_mobile_search': 'the mobile search icon (in the top header)',
    'button_column_selection': 'Column Selection',
    'button_new_work_order': 'Create Work Order',
    'apply_filters': 'Apply Filters in the mobile All Filters sheet',
    'back_to_saved_filters': 'Back To My Saved Filters',
}

# the list-request contract
LIST_REQUEST = ('GET /api/work-orders?pagination[rowsPerPage]=..&pagination[page]=..'
                '&pagination[sortBy]=..&pagination[descending]=..'
                '&filters[N][field]=<status|company_id|tech_assigned_id|service_advisor_id|vehicleHere>'
                '&filters[N][value]=<value>&search=<query>&showMyWorkOrders=<0|1>')
SAVED_STATE = 'GET/PUT /api/users/me/preferences/work-orders-list'
URL_PARAMS = ('?status=<v>(repeatable)&company_id=<uuid>(repeatable)'
              '&tech_assigned_id=<uuid>&service_advisor_id=<uuid>&vehicleHere=<1|0>'
              '&search=<query>&tab=<all|complete|my>   (NO tab param on Estimates)')

# ----------------------------------------------------------------------------------
# D = a DEVIATION the build is responsible for.  Each quotes the spec VERBATIM (R25).
# ----------------------------------------------------------------------------------
DEVIATIONS = {
 'D1': dict(
   anchors=['S1-R1', 'S1-R5'],
   spec_verbatim=('S1-R1: "The filter bar is displayed below the tab navigation row '
                  '(All, Estimates, Completed, My Work Orders) by default"  ·  '
                  'S1-R5: "When the user collapses the filter bar, the bar is hidden and the '
                  'table expands to use the reclaimed vertical space"'),
   observed=('The five chips sit ON THE SAME horizontal row as the tabs, to their right '
             '(tabs at y=85 height 40; chips at y=90 height 30, x 452-1164). Collapsing '
             'removes the chips but the table header stays at y=144 before and after, so no '
             'vertical space is reclaimed.'),
   design='The Figma final desktop board 11854:24657 also shows the bar on its OWN row below the tabs.',
   read='DEFECT - spec and design agree against the build.',
   surfaces=['screen (desktop)'],
   cases=['FLT-BAR-01', 'FLT-COLL-02'],
   evidence='p1.json, o-tabs.json (collapse), shots/01-workorders.png, shots/cl-03-collapsed-active.png',
   ticket='T1'),
 'D2': dict(
   anchors=['S10-R5', 'S13-R25', 'S13-N4'],
   spec_verbatim=('S10-R5: "The search query is not covered by this story. It is scoped to the '
                  'browser tab session and is never written to the user account."  ·  '
                  'S13-R25: "The query is stored in the browser tab session, never against the '
                  'user account... does not sync across devices, does not survive the tab session '
                  'ending"  ·  S13-N4: "A query is never restored on a later visit after the tab '
                  'session has ended. A user returning the next day sees an unsearched list."'),
   observed=('Typing a query fires PUT /api/users/me/preferences/work-orders-list with '
             '"search":"Lastone" in the body; GET returns it back. A BRAND-NEW browser context '
             '(no localStorage, no sessionStorage) opened /workorders and the app rewrote the URL '
             'to ?search=ZZQQNOMATCHXX and rendered ZERO rows - the stale query was restored from '
             'the account.'),
   read='DEFECT - user-facing: a user returns to an apparently empty Work Orders list.',
   surfaces=['screen (desktop)', 'saved state', 'URL state', 'a later session'],
   cases=['FLT-PSRCH-10', 'FLT-PSRCH-11', 'FLT-PSRCH-12'],
   evidence='o-search.json (savedPayloadAfterQuery, queryTabSessionOnly), shots/se-07-new-session.png',
   ticket='T2'),
 'D3': dict(
   anchors=['S11-N1', 'S11-R3'],
   spec_verbatim=('S11-N1: "If the URL filter state is malformed or unrecognizable, the page '
                  'loads without any filters applied and does not show an error"  ·  '
                  'S11-R3: "If the URL contains a filter value that no longer exists (e.g., a '
                  'deleted customer), the system ignores that value and loads the page without it"'),
   observed=('/workorders?status=%%%&company_id=not-a-uuid&tab=zzz&vehicleHere=banana loaded with '
             'NO error but DID apply filters: the request went out as filters[0][value]=estimate '
             'plus filters[1][field]=company_id&filters[1][value]=not-a-uuid, and the Status chip '
             'was hidden (the bogus tab resolved to the Estimates view). '
             '/workorders?company_id=00000000-0000-4000-8000-000000000000&status=paid&tab=all '
             'forwarded the unknown id to the backend and rendered 0 rows instead of the Paid list.'),
   read='DEFECT - a bad shared link silently shows a wrong or empty list.',
   surfaces=['URL state', 'screen (desktop)', 'screen (mobile)'],
   cases=['FLT-URL-03', 'FLT-URL-04', 'FLT-API-03', 'FLT-API-04'],
   evidence='o-pers.json (malformedUrl, unknownIdUrl), shots/pe-06-malformed.png, shots/pe-07-unknown-id.png',
   ticket='T3',
   note='Same root cause as the already-filed SV-8832. Recorded as extra evidence, not re-filed.'),
 'D4': dict(
   anchors=['S11-R2', 'S12-N1'],
   spec_verbatim=('S11-R2: "When a user opens a URL that contains filter state, the Work Orders '
                  'page loads with those filters pre-applied and the table already filtered"'),
   observed=('At a 390x844 mobile viewport, /workorders?status=declined&tab=all rendered the chips '
             'as "All Filters (1)" and "Status (1)" ACTIVE, but the list request went out as '
             'filters[0][value]=ESTIMATE and every card shown was an Estimate for Aagate '
             'Landscaping. Same with a no-match URL: chips read "All Filters (2)" / "Status (1)" / '
             '"Customer (1)" while the request was still status=estimate and 30 Estimate cards '
             'were listed. Tapping a chip on mobile filters correctly (status=paid -> 30 Paid '
             'cards), so the fault is specific to filter state arriving from the URL.'),
   read='DEFECT - mobile tells the user filters are on and shows an unrelated list.',
   surfaces=['screen (mobile)', 'URL state'],
   cases=['FLT-MOB-10', 'FLT-URL-02'],
   evidence='o-mob3.json (urlDrivenMobile, urlDrivenNoMatchMobile), shots/m3-02-urldriven.png, shots/m3-03-nomatch.png',
   ticket='T4'),
 'D5': dict(
   anchors=['S12-R2'],
   spec_verbatim=('S12-R2: "The filter chips behave like desktop with one exception (see S12-R5): '
                  'tapping a chip opens its dropdown, selections update the chip appearance, and '
                  '\\"Clear filters\\" appears when active"'),
   observed=('At a 390x844 mobile viewport with Status: Paid active (chips read "All Filters (1)" '
             'and "Status (1)" in the active blue state), there is NO Clear Filters control '
             'anywhere on the page - data-test-id="clear_filters" is absent and no element whose '
             'text matches /clear/i exists. On desktop the same state shows it.'),
   read='DEFECT - a mobile user cannot clear all filters in one action.',
   surfaces=['screen (mobile)'],
   cases=['FLT-MOB-08'],
   evidence='o-mob2.json (clearFiltersMobile), o-mob3.json (clearFiltersOnMobileWithActive), shots/m2-03-after-tick.png',
   ticket='T5'),
 'D6': dict(
   anchors=['S8-R4', 'S8-R5'],
   spec_verbatim=('S8-R4: "The empty state includes a prompt or link to clear filters and, where a '
                  'search query is active, to clear the query"  ·  S8-R5: "Where both a query and '
                  'filters are active, each is cleared independently from the empty state."'),
   observed=('With ONLY a page-search query active and no filters, the empty state reads '
             '"No work orders match your filters" and offers exactly one link, '
             'data-test-id="empty_state_clear_filters" labelled "Clear Filters". There is no '
             'clear-the-search option in the empty state, and the message names filters when none '
             'are applied.'),
   read='DEFECT - low: the tester/user is offered the one action that will not help.',
   surfaces=['screen (desktop)', 'empty state'],
   cases=['FLT-EMPTY-01', 'FLT-EMPTY-02', 'FLT-PSRCH-09'],
   evidence='o-search.json (noResultsQuery), o-fin.json (emptyStateClearLink), shots/se-06-no-results.png',
   ticket='T6'),
 'D7': dict(
   anchors=['S11-R7'],
   spec_verbatim=('S11-R7: "While viewing filter state that arrived from a URL, a \\"Back to my '
                  'view\\" action is available... The label is..."'),
   observed=('The control exists, works, and restores the user\'s own saved filters - but it is '
             'labelled "Back To My Saved Filters" (data-test-id="back_to_saved_filters"), not '
             '"Back to my view".'),
   read='WORDING DEVIATION - already reported inside SV-8828 by the QA who is executing run 352. '
        'Not re-filed. Our two cases are corrected to the build label.',
   surfaces=['screen (desktop)'],
   cases=['FLT-URL-05', 'FLT-URL-06'],
   evidence='o-pers.json (urlDriven), shots/pe-04-url-driven.png',
   ticket=None),
 'D8': dict(
   anchors=['S13-R2', 'S13-R16', 'S13-R17', 'S13-R18'],
   spec_verbatim=('S13-R2: label "Search", Inter Medium 14/20, grey/600 (#4B5565), 8px corner '
                  'radius, 10px padding, magnifier 20x20  ·  S13-R16: "Mobile uses the same inline '
                  'expansion as desktop... Tapping the collapsed control expands it in place '
                  'within the action row"  ·  S13-R17: "On Work Orders that resolves to 162px"  ·  '
                  'S13-R18: "\\"New Work Order\\" is 144px, the same width it has on desktop, not 211px"'),
   observed=('Desktop control: font-family "Nunito Sans" (not Inter), font-size 13.12px / '
             'line-height 19.55px (not 14/20), colour rgb(97,97,97) = #616161 (not #4B5565), '
             'border-radius 6px (not 8px), padding 4px 16px (not 10px), magnifier 22.5px (not 20). '
             'The expanded field IS exactly 180px wide with placeholder "Type to search" - that '
             'part matches. Mobile: search is an icon-only button in the TOP HEADER '
             '(data-test-id="button_open_mobile_search"), not an inline expansion in the action '
             'row; the expanded field measured 300px, not 162px; and the primary CTA is '
             '"Create Work Order" at 332px full width, not "New Work Order" at 144px.'),
   read=('DEVIATION on the visual/pixel specification. Reported to the QA lead as ONE '
         'design-conformance item rather than filed: these are design-token values a manual '
         'tester cannot check without browser dev tools, and the control itself works. The '
         'affected cases are reworded to what a tester CAN see and are marked '
         '"needs a browser tool" in the readiness table.'),
   surfaces=['screen (desktop)', 'screen (mobile)'],
   cases=['FLT-PSRCH-01', 'FLT-PSRCH-02', 'FLT-PSRCH-08', 'FLT-MOB-09'],
   evidence='o-search.json (collapsedControl, expand), o-mob.json (mobileSearch, layout)',
   ticket=None),
 'D9': dict(
   anchors=['S13-R22'],
   spec_verbatim=('S13-R22: "Every table in the application carries a search control, delivered '
                  'through the shared table component. This covers the list pages across Work '
                  'Orders, Parts and Reports"'),
   observed=('Reports carries NO page search control on any sub-tab observed: Timesheet '
             'Activities, Sales and Technician Efficiency all have data-test-id='
             '"page_search_toggle" ABSENT. Parts has it on every view checked. Parts also has no '
             'filter bar at all on Purchase Orders, Vendor Invoices (/parts/deliveries) or '
             'Vendors, which spec section 2 lists as in scope.'),
   read='NOT BUILT YET on Reports and on three Parts views - not a regression, unfinished work.',
   surfaces=['screen (desktop) - Reports', 'screen (desktop) - Parts'],
   cases=['FLT-RPTS-01', 'FLT-RPTS-21', 'FLT-RPTS-22', 'FLT-RPTS-23',
          'FLT-PARTS-01', 'FLT-PARTS-09', 'FLT-PARTS-11', 'FLT-PARTS-12', 'FLT-PARTS-13'],
   evidence='o-pr.json, o-pr2.json, shots/pr-*.png, shots/pr2-*.png',
   ticket=None),
}

# ----------------------------------------------------------------------------------
# S = the spec is at fault or ambiguous; NOT a build defect.  These become PO asks.
# ----------------------------------------------------------------------------------
SPEC_ISSUES = {
 'S_A': dict(
   anchors=['S7-R2'],
   spec_verbatim=('S7-R2: "If multiple values are selected for a single filter, the chip displays '
                  'the first value followed by a count of additional selections '
                  '(e.g., \\"Status: Estimate, In progress, Approved...\\")"'),
   observed=('With five statuses ticked the chip reads "Status: Estimate, Approved, In progress,..." '
             '- a comma list truncated with an ellipsis, with no count anywhere.'),
   read=('THE REQUIREMENT CONTRADICTS ITS OWN EXAMPLE, and the BUILD MATCHES THE EXAMPLE. '
         'So this is a spec wording error, not a build defect. Our case is written to the build '
         'and the sentence is raised with Branko.'),
   cases=['FLT-CHIP-02'],
   evidence='o-fin.json (sevenValuesChipFormat), shots/fn-02-five-values.png'),
 'S_B': dict(
   anchors=['S12-R2', 'S12-R5', 'S12-R6'],
   spec_verbatim=('S12-R2 says "one exception (see S12-R5)" but S12-R5 is the page-search '
                  'requirement; the exception it means is S12-R6.'),
   observed='Cross-reference points at the wrong requirement after the version-17 renumber.',
   read='Spec editing slip introduced by the 2026-08-04 renumber. Raised with Branko; no case impact.',
   cases=[],
   evidence='spec-v17-storage.xml'),
 'S_C': dict(
   anchors=['S1-R3'],
   spec_verbatim='S1-R3: "Each chip displays the filter name and a chevron icon indicating it opens a dropdown"',
   observed=('The build shows the name plus a keyboard_arrow_down chevron and NO leading icon. The '
             'Figma final board shows a leading icon per chip (spinner / person / wrench / headset '
             '/ truck).'),
   read=('The BUILD MATCHES THE SPEC; the DESIGN is the outlier. Our case asserted the design '
         'icons, so OUR CASE was over-specified - corrected to the build and the spec. The design '
         'difference is recorded, not filed.'),
   cases=['FLT-BAR-02'],
   evidence='p1.json (chips[].icons all == ["keyboard_arrow_down"])'),
}

# ----------------------------------------------------------------------------------
# H = HELD, awaiting a product-owner ruling.  NOT ours to resolve (Rule 32(iii)).
# ----------------------------------------------------------------------------------
HELD = {
 'H1': dict(
   anchors=['S12-R6', 'S12-R2'],
   what='Does the mobile SINGLE-filter sheet apply instantly, or only after an Apply button?',
   source_a=('Branko\'s answer sheet, ingested 2026-08-04, Q1 = "A - no apply button": choices '
             'apply instantly as you tick. File: '
             'build/filters/branko-answers-2026-08-04/answers-ingested.md'),
   source_b=('Branko\'s OWN spec, Confluence page 572030978, versions 15/16/17 written '
             '2026-08-04 12:04:15Z / 12:23:58Z / 12:33:56Z, comment "Clarify mobile deferred '
             'apply". New S12-R6 verbatim: "Unlike desktop, mobile does not filter in real time. '
             'Selections made inside a dropdown / bottom sheet are staged, and the table updates '
             'only when the user taps an \\"Apply filters\\" button within the sheet."'),
   observed=('The BUILD does what the ANSWER SHEET says: tapping Paid in the single-filter sheet '
             'fired the list request within 700ms, the URL updated at once and there is NO Apply '
             'button in that sheet. The combined "All Filters" sheet DOES have a footer button '
             'labelled "Apply Filters" (data-test-id="apply_filters").'),
   why_held=('Two authoritative product sources from the SAME person on the SAME day disagree, and '
             'the exact time he ticked the sheet cannot be established, so recency cannot be '
             'proven. Rule 32(iii) says ask the PO rather than pick a side. The build and the '
             'engineering tech plan (decision D15) both match the answer sheet.'),
   cases=['FLT-MOB-01', 'FLT-MOB-02', 'FLT-MOB-03', 'FLT-MOB-04', 'FLT-MOB-05',
          'FLT-MOB-06', 'FLT-MOB-07', 'FLT-MOB-10'],
   risk='HIGH',
   evidence='o-mob2.json (S12R6_deferredApply, allFiltersSheet), shots/m2-02-status-sheet.png, shots/m2-04-all-filters.png'),
 'H2': dict(
   anchors=['S2-N1', 'S2-N2', 'S9-R2', 'S9-R3', 'S1-N1'],
   what='On the Estimates and Completed tabs, is the Status chip HIDDEN or shown greyed-out and pre-filled?',
   source_a=('Branko 2026-07-17 Q4 = B (shown greyed-out and pre-filled), plus the Figma board '
             '11972:32318 which draws it greyed out reading "Status: Estimate", plus the QA lead\'s '
             'ruling of 2026-07-30 recorded in our cases.'),
   source_b=('The spec, unchanged through Confluence version 17: S9-R2 "On the Estimates tab, the '
             'Status filter chip is hidden"; S2-N1 "On the Estimates tab, the Status filter chip '
             'is not shown".'),
   observed=('The BUILD HIDES IT. On Estimates and on Completed exactly FOUR chips render - '
             'Customer, Lead Technician, Service Advisor, Asset on Site. There is no greyed-out '
             'Status chip in the DOM. A Status selection made on All is retained and reappears on '
             'returning to All (S9-R5 / S9-N1 both pass).'),
   why_held=None,
   resolution=('RESOLVED IN FAVOUR OF THE SPEC AND THE BUILD (Rule 32/44): the spec is the newest '
               'authoritative source (version 17, 2026-08-04) and it agrees with the build, so the '
               '2026-07-17 answer and the design board are stale. OUR CASES ARE THE DEFECT and are '
               'corrected. Branko is told his 2026-07-17 answer is now contradicted by his own spec '
               'and by the shipped build.'),
   cases=['FLT-TAB-02', 'FLT-TAB-03', 'FLT-BAR-03', 'FLT-BAR-02', 'FLT-TAB-05', 'FLT-STAT-07'],
   risk='MEDIUM',
   evidence='o-tabs.json (tab_estimates, tab_completed), shots/tb-01-estimates.png, shots/tb-02-completed.png'),
}

# ----------------------------------------------------------------------------------
# NOT REPRODUCED - another author's finding we could not reproduce (Rule 33: report it,
# do not overturn it).
# ----------------------------------------------------------------------------------
NOT_REPRODUCED = {
 'SV-8828': dict(
   title='Saved filters do not auto-restore after closing the tab/window',
   filed_by='Ahtasham Amjad, 2026-08-04 07:36 -0500, Story Defect on SV-8795, status Open',
   his_case='C29614 (FLT-PERS-02) marked Failed in run 352 at 12:39 UTC',
   our_attempt=('A BRAND-NEW Chromium browser context (fresh localStorage and sessionStorage, the '
                'equivalent of closing the window) on the SAME build v3.4.2-4f8211c at 15:0x UTC: '
                '/workorders was requested with no query string and the app rewrote the URL to '
                '?status=invoiced&vehicleHere=1&tab=all, the chips came back ACTIVE, 16 rows were '
                'filtered, and NO "Back To My Saved Filters" button was present.'),
   verdict=('NOT REPRODUCED. We are NOT calling his finding wrong. The likeliest difference is '
            'that his previous visit was URL-driven (a shared-link view), because '
            '"Back To My Saved Filters" is exactly the S11-R7 control and it DOES appear for us '
            'on a URL-driven visit. Reported to the QA lead as a question for him, and his case '
            'keeps its assertion and its Failed result.'),
   evidence='o-pers.json (freshContext, navAwayAndBack, reloadPage, urlDriven), shots/pe-03-fresh-context.png'),
 'SV-8832': dict(
   title='Deleted filter value removed from dropdown but still applied to table results',
   filed_by='Ahtasham Amjad, 2026-08-04 08:27 -0500, Story Defect on SV-8795, status Open',
   his_case='C29616 (FLT-PERS-04) marked Failed in run 352 at 13:30 UTC',
   our_attempt=('REPRODUCED on the URL surface: an unknown customer id in the URL is forwarded to '
                'the backend and the list comes back empty while the Customer chip shows nothing '
                'selected.'),
   verdict='CONFIRMED, same root cause. Not re-filed; recorded as extra evidence on his ticket (D3).',
   evidence='o-pers.json (unknownIdUrl), o-fin.json'),
}
