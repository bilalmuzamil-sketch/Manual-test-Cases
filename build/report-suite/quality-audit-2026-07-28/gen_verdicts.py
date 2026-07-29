#!/usr/bin/env python3
"""Report Suite usefulness audit 2026-07-28 — generates per-case-verdicts.csv.

Source snapshot: build/report-suite/cases/*.json at git SHA ddf8c16b1c271b12459838f6c9e51a34078087bf
(read-only copy taken to /tmp/rs-audit/cases-snapshot at audit start; working tree was clean
for build/report-suite at that moment). NO case files are modified; NO TestRail writes.

Verdicts: KEEP / MERGE (member absorbed into a named survivor) / WEAK-KEEP / CUT.
Every one of the 515 cases gets exactly one verdict. Merge SURVIVORS are KEEP
(they gain the members' steps); merge MEMBERS are MERGE.
Tier: T1 = core regression value (run every cycle); T2 = build-acceptance /
verify-once conformance (verbatim labels, formats, layout, states). Tier is an
honest prioritisation estimate, independent of the verdict.
"""
import json, glob, csv, collections, os, sys

SNAP = '/tmp/rs-audit/cases-snapshot'
IDMAP = '/tmp/rs-audit/testrail-id-map.csv'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'per-case-verdicts.csv')

# ---------------------------------------------------------------- merge groups
# group -> (survivor, [members], what the survivor's step table gains)
MERGES = {
 # --- SBC
 'G-SBC-NAV':        ('SBC-NAV-01', ['SBC-NAV-02'], 'page title + browser-tab title become 2 expected lines of the nav/open case'),
 'G-SBC-DEFAULTS':   ('SBC-PERS-05', ['SBC-DATE-02', 'SBC-LOC-02'], 'first-load defaults are already enumerated once in PERS-05; the per-filter default cases restate two of its lines'),
 'G-SBC-TYPE':       ('SBC-TYPE-02', ['SBC-TYPE-01', 'SBC-TYPE-03'], 'one Product Type case: options list + default (from TYPE-01), S-only/P-only effect (TYPE-02 core), and the no-filter third state (TYPE-03) as a final step'),
 'G-SBC-ALLCUST':    ('SBC-CUST-04', ['SBC-CUST-08'], 'the all-customers explicit-state case gains the filter-change step proving new customers stay auto-included'),
 'G-SBC-CLEARALL':   ('SBC-CUST-03', ['SBC-CUST-07'], 'the pinned All/Clear control case gains the outcome of Clear all: empty state + zero totals + label "None"'),
 'G-SBC-EXPAND':     ('SBC-TREE-03', ['SBC-TREE-07'], 'expand case gains 2 steps: second click collapses; customer/asset expansion independence'),
 'G-SBC-LBL':        ('SBC-LBL-01', ['SBC-LBL-02', 'SBC-LBL-03'], 'one asset-label case with an input table covering the whole fallback chain: Unit > plate > VIN-8 > whole VIN > VIN-only > "Unknown Asset"'),
 'G-SBC-SORTSCOPE':  ('SBC-SORT-01', ['SBC-SORT-05'], 'sortability case gains the invariant that only customer summary rows reorder'),
 'G-SBC-SORTRELOAD': ('SBC-TREE-09', ['SBC-SORT-06'], 'the reload-collapses-expansion case already covers sort as a trigger; loading-state + page-membership lines fold in'),
 'G-SBC-COLBOUNDS':  ('SBC-COL-02', ['SBC-COL-03'], 'hide/show case gains the hide-all-nine edge (Customer/Subtotal/totals still render)'),
 'G-SBC-EXPNAME':    ('SBC-EXP-02', ['SBC-EXP-07'], 'one range-to-filename map case asserting both .csv and .pdf extensions'),
 'G-SBC-EXPTOAST':   ('SBC-EXP-06', ['SBC-EXP-12'], 'one export in-flight/failure case with a CSV row and a PDF row (identical behavior, different toast text)'),
 'G-SBC-EMPTYSEL':   ('SBC-EMPTY-01', ['SBC-EMPTY-03'], 'empty-state case gains: a narrowed customer selection is KEPT and customers reappear when filters widen'),
 # --- SBR
 'G-SBR-NAV':        ('SBR-NAV-01', ['SBR-NAV-02'], 'page/tab-title lines fold into the Performance-group nav case'),
 'G-SBR-DEFAULTS':   ('SBR-PERS-04', ['SBR-DATE-03', 'SBR-LOC-02'], 'first-visit defaults live once in PERS-04; the date-default and location-default restatements fold in (the reload/loading half of DATE-03 is already STATE-03)'),
 'G-SBR-TYPE':       ('SBR-TYPE-02', ['SBR-TYPE-01'], 'options+default become 2 expected lines of the per-option behavior case'),
 'G-SBR-GATE':       ('SBR-STAT-04', ['SBR-TYPE-03', 'SBR-STAT-03'], 'ONE contributor-gate/composition case: a rep appears iff >=1 invoice matches ALL filters, with a per-filter step table (product type / status / location legs)'),
 'G-SBR-ROWLAYOUT':  ('SBR-ROW-02', ['SBR-ROW-04'], 'the 12-column layout case absorbs the column-alignment "hard invariant" restatement'),
 'G-SBR-BADGE':      ('SBR-BADGE-01', ['SBR-BADGE-03'], 'badge placement/mapping case gains: vertically centered, blank on summary rows, text as accessible label'),
 'G-SBR-CALCZERO':   ('SBR-CALC-02', ['SBR-CALC-04'], 'the +green/-red/0.0 case gains the rounds-to-zero and explicit-minus edges (mirrors how SBC-CALC-04 was already combined)'),
 'G-SBR-STICKY':     ('SBR-TOT-01', ['SBR-TOT-04'], 'pinned-Subtotal case gains sticky header-row / both-axes assertions'),
 'G-SBR-LINKS':      ('SBR-LINK-01', ['SBR-LINK-02'], 'one drilldown-targets case: invoice number -> WO/parts sale; customer name -> customer record; both same tab'),
 'G-SBR-NODIALOG':   ('SBR-DEACT-07', ['SBR-DEACT-01'], 'one no-dialog case: no assignments / toggle off / already inactive / reactivation'),
 'G-SBR-UNASROW':    ('SBR-UNAS-02', ['SBR-UNAS-03'], 'the Unassigned-row case gains behaves-like-a-rep-row lines (count, expandable, in Totals, never (Inactive))'),
 'G-SBR-COLSEL':     ('SBR-COL-01', ['SBR-COL-02', 'SBR-COL-06'], 'one selector-contents-and-bounds case: 7 toggleable + 5 always-on not offered + all-hidden still renders the 5'),
 'G-SBR-EMPTYBAR':   ('SBR-STATE-01', ['SBR-STATE-02'], 'empty-state case gains: toolbar stays interactive and widening the range recovers'),
 # --- PV
 'G-PV-TYPE':        ('PV-FILT-01', ['PV-FILT-02'], 'Type filter options/default case gains the per-option reload effect (all rows read Inventory / Catalogue)'),
 'G-PV-EXPTOAST':    ('PV-EXP-10', ['PV-EXP-09'], 'one export-toast case: success texts (uppercase CSV/PDF) + failure texts (lowercase) + server-message precedence'),
 # --- TU
 'G-TU-COLS':        ('TU-HRS-02', ['TU-HRS-01'], 'the fixed header order becomes expected line 1 of the hours-columns case'),
 'G-TU-EMPTY':       ('TU-NAV-08', ['TU-TECH-05'], 'NAV-08 already states the same no-data message serves both genuinely-no-data and cleared-filter; the clear-all trigger becomes a step'),
 # --- WIP
 'G-WIP-NAV':        ('WIP-TAB-01', ['WIP-TAB-04'], 'browser-title line folds into the nav/open case'),
 'G-WIP-EMPTY':      ('WIP-SCOPE-05', ['WIP-SCOPE-06'], 'one empty-state case: all-tabs-empty and single-tab-empty as two scenario rows'),
 'G-WIP-PLACE-STATUS':('WIP-PLACE-01', ['WIP-PLACE-02'], 'one status-to-tab mapping case with a table: Estimate->Estimates, Complete->Completed, In Progress/Review->partially completed'),
 'G-WIP-PLACE-START':('WIP-PLACE-03', ['WIP-PLACE-04'], 'one started-boundary case: clocked time OR received part -> partially completed; neither -> not started'),
 'G-WIP-RECOMPUTE':  ('WIP-FLT-08', ['WIP-SUM-06', 'WIP-TOT-03'], 'the AND-composition case already asserts strip+Totals recompute; the two per-surface recompute cases fold in as expected lines'),
 # --- IV
 'G-IV-RELOAD':      ('IV-FLT-02', ['IV-NAV-04'], 'the server-side re-query case absorbs the reload-triggers list + loading indicator lines'),
 'G-IV-EMPTY':       ('IV-NAV-06', ['IV-DATE-07', 'IV-LOC-05'], 'one no-data case with a cause table: no in-stock parts / no recorded day on-or-before range / empty selected locations — same message + no totals row'),
 'G-IV-SCOPE':       ('IV-SCOPE-01', ['IV-SCOPE-03', 'IV-SCOPE-04'], 'one row-scope case with a 4-part seed table: normal part shown; core part never; zero-qty never; negative-qty never (SCOPE-01 already asserts both conditions)'),
 'G-IV-TOTFILTER':   ('IV-TOT-02', ['IV-TOT-04'], 'full-set server totals case gains the change-filter-and-recompute steps'),
 'G-IV-EXPTOAST':    ('IV-EXP-09', ['IV-EXP-08'], 'one notification case: verbatim success (PDF/CSV) + failure texts'),
 'G-IV-TOTSTICKY':   ('IV-TOT-01', ['IV-VIS-03'], 'totals-row layout case gains the stays-visible-while-scrolling line'),
}
member2group = {}
for g, (surv, members, gain) in MERGES.items():
    for m in members:
        member2group[m] = g

MERGE_REASON = {
 'SBC-NAV-02': 'Two title assertions; not a separate flow — fold into the nav/open case.',
 'SBC-DATE-02': 'Default restated: SBC-PERS-05 already asserts "Date range = This Month".',
 'SBC-LOC-02': 'Default restated: SBC-PERS-05 already asserts "Location = your active location".',
 'SBC-TYPE-01': 'Options+default of the same 3-option dropdown TYPE-02 exercises; one control, one case.',
 'SBC-TYPE-03': 'The trivial third state (no filter) of the same dropdown; one extra step, not a case.',
 'SBC-CUST-08': 'Same all-customers explicit-state contract as CUST-04 with one extra trigger.',
 'SBC-CUST-07': 'The outcome of the Clear-all action CUST-03 performs; one extra expected block.',
 'SBC-TREE-07': 'Chevron toggle/independence is UI mechanics of the expand flow TREE-03 drives.',
 'SBC-LBL-02': 'One branch of the single label fallback chain; a row in LBL-01\'s input table.',
 'SBC-LBL-03': 'One branch (final fallback "Unknown Asset") of the same chain; a table row.',
 'SBC-SORT-05': 'A scope invariant of sorting, not a separate flow; one expected line in SORT-01.',
 'SBC-SORT-06': 'Reload-collapse on sort duplicates TREE-09 (sort is one of its listed triggers).',
 'SBC-COL-03': 'Hide-all edge of the same toggle behavior COL-02 tests.',
 'SBC-EXP-07': 'Identical filename map as EXP-02 with a different extension; one case, two file types.',
 'SBC-EXP-12': 'Same loading/failure pattern as EXP-06 with PDF wording; a two-row step table.',
 'SBC-EMPTY-03': 'Empty-state variant (selection kept); an extra scenario in EMPTY-01.',
 'SBR-NAV-02': 'Title assertions fold into the nav case (same pattern as SBC).',
 'SBR-DATE-03': 'Default -> PERS-04; reload/loading half already covered by STATE-03.',
 'SBR-LOC-02': 'Default restated: PERS-04 already asserts "Location = your active location".',
 'SBR-TYPE-01': 'Options+default of the dropdown TYPE-02 exercises option-by-option.',
 'SBR-TYPE-03': 'Same contributor-gate rule as STAT-03/STAT-04, applied to a different filter — one gate case with per-filter legs.',
 'SBR-STAT-03': 'Same contributor-gate rule as TYPE-03/STAT-04 — the composition case (STAT-04) is the survivor.',
 'SBR-ROW-04': 'Restates ROW-02\'s layout contract as an "invariant"; no new observable behavior.',
 'SBR-BADGE-03': 'Three residual badge attributes; fold into the badge placement/mapping case.',
 'SBR-CALC-04': 'Rounds-to-zero / explicit-minus edges of the CALC-02 formatting contract (SBC combined these in one case).',
 'SBR-TOT-04': 'Sticky-header mechanics of the same pinned layout TOT-01 covers.',
 'SBR-LINK-02': 'Second link target of the same drilldown behavior; one case with two targets.',
 'SBR-DEACT-01': 'One of three no-dialog paths DEACT-07 already enumerates.',
 'SBR-UNAS-03': '"Behaves like a rep row" lines belong on the row case UNAS-02 creates.',
 'SBR-COL-02': 'Selector-contents negative (5 always-on not offered); one line in COL-01.',
 'SBR-COL-06': 'All-hidden edge of the same selector; one step in COL-01.',
 'SBR-STATE-02': 'Toolbar-interactive-in-empty-state is one expected line of STATE-01.',
 'PV-FILT-02': 'Per-option effect of the Type filter FILT-01 defines; one control, one case.',
 'PV-EXP-09': 'Success-toast wording; pairs with the failure case as one notification case.',
 'TU-HRS-01': 'A header-order assertion; expected line 1 of the hours-columns case.',
 'TU-TECH-05': 'NAV-08 explicitly covers the cleared-filter trigger for the same message.',
 'WIP-TAB-04': 'Browser-title assertion; folds into the nav/open case.',
 'WIP-SCOPE-06': 'Single-tab-empty variant of SCOPE-05; a second scenario row.',
 'WIP-PLACE-02': 'Status->tab mapping row; PLACE-01/02 are one mapping case with a table.',
 'WIP-PLACE-04': 'The other side of the started-boundary rule PLACE-03 tests; one boundary case.',
 'WIP-SUM-06': 'Strip recompute on filter change — already asserted by FLT-08.',
 'WIP-TOT-03': 'Totals-row recompute on filter change — already asserted by FLT-08.',
 'IV-NAV-04': 'Reload-trigger list + loading indicator; the server-side re-query case covers it.',
 'IV-DATE-07': 'Same no-data message/no-totals with a snapshot cause; a cause-table row in NAV-06.',
 'IV-LOC-05': 'Same no-data message/no-totals with a location cause; a cause-table row in NAV-06.',
 'IV-SCOPE-03': 'Negative half (core excluded) of the two-condition rule SCOPE-01 already asserts.',
 'IV-SCOPE-04': 'Negative half (qty<=0 excluded) of the same two-condition rule.',
 'IV-TOT-04': 'Recompute-on-filter action of the full-set totals contract TOT-02 owns.',
 'IV-EXP-08': 'Success-notification wording; pairs with EXP-09 as one notification case.',
 'IV-VIS-03': 'Totals-row visible-on-scroll duplicates the pinned-layout assertions in TOT-01.',
}

CUTS = {
 'SBC-SORT-07': 'No-op assertion (sort headers with zero rows produce no change). A failure here would never be a reportable bug; tests framework idle behavior, not the feature.',
 'SBR-SORT-06': 'No-op assertion (sorting a single row changes nothing). Not a reportable failure; framework behavior.',
 'SBR-EXP-09': 'PDF font-tier EDGE rules (negative-string shifts one px tier, no-positive stays 11px). Pure spec minutiae a manual tester cannot verify (measuring px font sizes in a PDF); belongs in a dev unit test, not a manual case. (Base-tier case EXP-08 kept as WEAK.)',
 'PV-COL-07': 'Requires manufacturing a "stale schema version" in browser storage — not executable by a manual tester; implementation detail for a dev test. Defensive-restore behavior is already covered by PV-COL-05.',
 'WIP-TOT-04': 'Duplicate: "empty tab shows no Totals row" is already an expected line of WIP-SCOPE-05 and WIP-SCOPE-06.',
 'IV-TOT-05': 'Duplicate: "no totals row when empty" is already expected line 2 of IV-NAV-06 (and its merged variants).',
}

WEAK = {
 'SBC-CUST-01': 'Placement/search-icon/hint cosmetics of the Customer control; legitimate spec line, low failure value.',
 'SBC-TREE-10': 'Low-yield edge (single-invoice asset expands; only-parts-sales customer); keep only if suite size is no concern.',
 'SBC-TREE-13': 'Structural/font-weight invariant restating the layout; cosmetic-leaning.',
 'SBC-LINK-03': 'Link color / no-visited-purple cosmetics.',
 'SBC-EXP-08': 'A4/25px-margins/footer: px values not measurable by a manual tester without tooling.',
 'SBC-EXP-15': 'Empty export still downloads headers+zero totals; legitimate but low value.',
 'SBC-EMPTY-02': 'No-empty-message-while-loading; a race a manual tester can rarely drive deterministically.',
 'SBC-VIS-01': 'Hex/px theme parroting (#f9fafb, 32px/24px/2rem); PO said his local visuals are broken and the video is the reference — verify once at build acceptance, not per cycle.',
 'SBC-VIS-02': 'Row-surface color assignments per tree level; verify once.',
 'SBC-VIS-03': 'Dark mode + PDF-stays-light; verify once per report.',
 'SBR-NAV-03': 'Real known issue (video: "Representative" squishes) but the FIX is undecided (padding vs other); asserting the padding solution is premature.',
 'SBR-LOC-04': 'Single-location-still-sees-filter: directly contradicted by pending video P33 (hide when <=1 location) — likely to be inverted by the spec update.',
 'SBR-BADGE-02': 'Badge color tokens; cosmetic conformance, verify once.',
 'SBR-LINK-04': 'Link styling/hover/focus/never-purple; cosmetic.',
 'SBR-EXP-05': '18-char PDF truncation detail; testable but low value.',
 'SBR-EXP-08': 'PDF body font px by longest-dollar-string tier table; barely verifiable manually (kept only as the base rule; the edge rules case is CUT).',
 'SBR-MOB-03': '44x44px touch targets need measurement tooling; keep as a one-time design check.',
 'SBR-VIS-01': 'Px/hex toolbar/table theme parroting; verify once.',
 'SBR-VIS-02': 'Dark-mode equivalents; verify once.',
 'SBR-VIS-05': 'WCAG AA contrast ratio requires tooling; one-time a11y check.',
 'PV-NAV-03': 'Loading-indicator/no-blank-flash; standard framework behavior, verify once.',
 'PV-FILT-11': 'Verbatim empty-state label; string conformance, verify once.',
 'PV-FILT-13': 'Single-location-still-sees-filter: contradicted by pending video P33; may invert.',
 'PV-COL-08': 'All-20-columns-hidden edge + not-restored subtlety; legitimate but low value.',
 'PV-EXP-08': 'Export column alignment (centered/left/right); cosmetic conformance.',
 'PV-VIS-01': 'Two-tone theme parroting; verify once.',
 'PV-VIS-02': 'Px paddings/1px borders; verify once.',
 'PV-VIS-03': 'Dark mode + 3:1 icon contrast (tooling); one-time check.',
 'TU-NAV-05': 'Loading indicator/toolbar-interactive; framework behavior, verify once.',
 'TU-DAY-01': 'Accessible-name wording of the chevron; one-time a11y check.',
 'TU-EXP-08': 'Verbatim toast texts ("Download started"/"Failed to download report"); string conformance.',
 'TU-LOC-05': 'Single-location-still-sees-filter: contradicted by pending video P33; may invert.',
 'TU-VIS-01': 'All-white table / toolbar order; cosmetic, verify once.',
 'TU-VIS-02': 'Dark mode legibility + 3:1 contrast (tooling); one-time check.',
 'WIP-SCOPE-04': 'Loading indicator behavior; framework, verify once.',
 'WIP-COL-06': 'Customer-name-or-blank; restates a default rendering, low value.',
 'WIP-VIS-01': 'All-white/no-zebra; cosmetic, verify once.',
 'WIP-VIS-02': 'Strip band styling (rules, not cards); cosmetic.',
 'WIP-VIS-03': 'Bold/pinned Total column styling; overlaps TOT-01; cosmetic-leaning.',
 'WIP-VIS-04': 'Scroll-container/fill-height behavior; framework-leaning, verify once.',
 'WIP-VIS-07': 'Dark mode legibility; verify once.',
 'IV-COL-05': 'Em-dash for missing category/vendor; a rendering default, low value.',
 'IV-FLT-03': 'No-selection-means-no-narrowing; restates the absence of a filter (trivial inverse).',
 'IV-LOC-04': 'Single-location-still-sees-filter: contradicted by pending video P33; may invert.',
 'IV-EXP-05': 'Verbatim filenames; string conformance, verify once.',
 'IV-VIS-01': 'All-white/backdrop theme; cosmetic, verify once.',
 'IV-VIS-02': 'Toolbar control order; cosmetic conformance.',
 'IV-VIS-05': 'Dark mode legibility; verify once.',
 'IV-VIS-06': 'aria-sort exposure; one-time a11y check.',
 'IV-VIS-07': 'Accessible names on icon buttons; one-time a11y check.',
}

# Specific KEEP reasons for notable cases; everything else gets an accurate area-based reason.
KEEP_REASON = {
 'SBC-PERM-04': 'Location-access enforcement (report never widens to inaccessible data) — a real security contract.',
 'SBC-TREE-12': 'Reversed/voided invoices excluded from every count/total — data-integrity contract.',
 'SBC-EXP-05': 'Exports reflect active filters — the PO stated this is "very, very much intentional" on the kickoff video.',
 'SBC-EXP-13': 'Print flow is spec Story 16 today — but flagged: video P25 says Print will be CUT from SBC; case dies if/when the spec updates.',
 'SBC-EXP-14': '10,000-row export cap with the exact refusal toast — spec change-log headline item.',
 'SBC-LBL-01': 'Asset-label identifier chain — flagged: video P24 (FIRM) switches the identifier to SERIAL NUMBER; expect rewrite when the spec catches up.',
 'SBR-STAT-02': '5 system payment states -> 3 display values mapping — the spec change-log calls this the single source of truth.',
 'SBR-ROW-03': 'Deactivated/deleted rep keeps historical credit with (Inactive) tag — protects historical data integrity.',
 'SBR-WO-05': 'Invoice crediting snapshot precedence (WO rep > customer rep > unassigned; never retroactive) — the core crediting contract.',
 'SBR-DEACT-04': 'Esc must NOT close the dialog — Chris answered Q1=B on 2026-07-28; case already matches the answer.',
 'TU-ELL-01': 'Est. Lost Labor = per-location default labor rate x internal hours — the new calculator Chris called a "highly sought-after Fabian ask".',
 'TU-LINK-03': 'Cross-report reconciliation to the cent vs Timesheet Activities — defines when a mismatch IS a defect.',
 'TU-LINK-04': 'Open-clock snapshot exception — prevents false bug reports on a known legitimate difference.',
 'TU-LINK-05': 'Link passes no location — documents a real user-visible discrepancy so testers do not misfile it.',
 'TU-SUM-03': 'Weighted utilization (not average of percentages) — a classic real-world calc bug this would catch.',
 'WIP-CALC-06': 'Total = Earned + Remaining, NOT the WO grand total — the report\'s central definitional contract.',
 'WIP-SUM-02': 'Hero figure math (Total Earned = Started-Earned + Ready to Invoice) — the number Chris said users come for.',
 'WIP-TAB-05': 'No Trend tab / snapshot not read by any screen — prevents false expectations and false bugs.',
 'WIP-EXP-06': 'Odd "wip-2-report" filenames documented as expected — prevents a false bug ticket.',
 'WIP-EXP-07': 'Unit/Branch export headers documented as expected v1 — prevents a false bug ticket.',
 'IV-DATE-02': 'The date is an as-of anchor, not a created-date filter — the report\'s core semantic; testers WILL misread this without the case.',
 'IV-CALC-03': 'Sell-price fallback chain end (no price, no category -> valued at cost) — valuation contract.',
 'IV-API-05': 'Snapshot retention thinning (13 months daily, then monthly) — spec change-log item; data-lifecycle contract.',
 'IV-API-03': 'Idempotent snapshot re-run (no duplicate rows) — protects the data the whole report stands on.',
 'PV-NAV-02': 'First-visit defaults (This Year, auto-fetch, Demand ranking) — PV\'s only defaults case.',
 'TU-NAV-02': 'Contributor rule: exactly one row per technician who clocked time in scope.',
 'TU-NAV-03': 'First-visit defaults (This Month, active location).',
 'TU-NAV-04': 'Date-range reload + 366-day Custom cap.',
 'TU-NAV-06': 'Timezone/day-grouping contract incl. cross-midnight record splitting — real calculation behavior.',
 'TU-NAV-07': 'Negative permission gate on navigation (timesheet-reports permission).',
 'IV-NAV-02': 'Report opening scope: one row per in-stock part, valued as of the resolved date.',
 'IV-NAV-03': 'First-visit defaults (current month, active location).',
 'IV-NAV-05': 'Server pagination + return-to-first-page contract.',
 'WIP-TAB-02': 'Four fixed tabs + default tab — the report\'s primary structure.',
 'WIP-TAB-03': 'Tab counts match the listed rows — a real integrity check, including "(0)".',
}

AREA_KEEP_REASON = [
 (('CALC',), 'Calculation contract with a worked example; a failure is a real, reportable money/hours bug.'),
 (('PERM',), 'Permission gate (positive/negative observable behavior). NOTE: Q2 permission-model discrepancy raised to Chris/dev 2026-07-28; cases stay per the shipped mixed model per user ruling.'),
 (('API',), 'Server-side contract (pagination/sort/snapshot/enforcement) — placed in an API section per Rule 4; verifiable via network tab/DB; failures are real defects.'),
 (('EXP',), 'Export content/behavior contract (what is in the file / when it is refused) — distinct observable outcome.'),
 (('PERS',), 'Persistence/restore contract. NOTE: Stefan flagged on the kickoff that per-user-per-device persistence may be delegated to the Filters squad — re-check before execution.'),
 (('SORT',), 'Sorting contract (default/direction/null placement/scope) — spec-defined, observable, distinct.'),
 (('TOT', 'SUM'), 'Totals/summary aggregation contract over the full filtered set — catches real aggregation bugs.'),
 (('TREE', 'ROW', 'SCOPE', 'PLACE'), 'Row-model/scope contract (who appears, where, exactly once) — data-correctness core.'),
 (('LINK',), 'Drill-through/link target contract — the PO walked these hyperlinks on the video as a key feature.'),
 (('DATE',), 'Date-range semantics (presets/cap/anchoring) — drives every number on the report.'),
 (('LOC',), 'Location scoping/fallback contract — includes the accessible-locations security boundary.'),
 (('CUST', 'TECH', 'TYPE', 'STAT', 'FILT', 'FLT'), 'Filter data-effect contract — changes which rows/totals appear; failures are real.'),
 (('DEACT',), 'Deactivation dialog flow (gate/confirm/failure) — a destructive action with a spec-defined safety flow.'),
 (('UNAS',), 'Unassigned-row contract — off-by-default toggle the PO called out on the video.'),
 (('ASGN',), 'Sales Rep Assignments export contract — a distinct deliverable with its own dialog, sort and legacy rules.'),
 (('WO',), 'Sales-rep entry-point on Work Orders — the PO said the report "goes a lot deeper", these entry points are how data gets in.'),
 (('COL',), 'Column selector behavior contract (contents/effect/exports interaction).'),
 (('NAV', 'TAB'), 'Navigation/entry contract — additive placement was an explicit PO instruction on the video.'),
 (('STATE', 'EMPTY'), 'Loading/empty/error state contract with exact recovery behavior.'),
 (('BADGE',), 'Status badge mapping contract (5 states -> 3 values).'),
 (('MOB',), 'Responsive/touch behavior at the spec-defined 1024px breakpoint.'),
 (('VIS',), 'Accessibility/visual conformance requirement from the spec.'),
 (('HRS', 'ELL', 'DAY', 'LBL',), 'Report-specific behavior contract (hours math / lost-labor / per-day breakdown / labels).'),
]

def keep_reason(cid):
    if cid in KEEP_REASON:
        return KEEP_REASON[cid]
    fam = cid.split('-')[1]
    for fams, r in AREA_KEEP_REASON:
        if fam in fams:
            return r
    return 'Distinct observable spec-derived behavior; failure would be a reportable bug.'

# Tier-2 (build-acceptance / verify-once) heuristics for KEEP cases.
T2_AREAS = ('VIS', 'MOB')
T2_EXPLICIT = {
 # export menu/filename/toast/layout cases (kept, but one-time conformance)
 'SBC-EXP-01','SBC-EXP-02','SBC-EXP-06',
 'SBR-EXP-06','SBR-EXP-14',
 'PV-EXP-01','PV-EXP-05','PV-EXP-10',
 'TU-EXP-01',
 'WIP-EXP-01','WIP-EXP-06','WIP-EXP-08','WIP-EXP-09',
 'IV-EXP-01','IV-EXP-09',
 # nav/title/state-string cases
 'SBC-NAV-01','SBR-NAV-01','PV-NAV-01','TU-NAV-01','WIP-TAB-01','IV-NAV-01',
 'SBC-EMPTY-04','SBR-STATE-03','TU-NAV-08','WIP-SCOPE-05','IV-NAV-06',
 # column-selector mechanics (contents/tooltips)
 'SBC-COL-01','SBR-COL-01','PV-COL-01','WIP-PERS-01','WIP-PERS-02','IV-PERS-01','IV-PERS-02',
 # badge/label rendering
 'SBR-BADGE-01','SBC-LBL-01','SBC-LBL-04','WIP-COL-04','WIP-COL-05','WIP-COL-08','IV-COL-01','IV-COL-02','IV-COL-05',
 'SBC-CALC-06','SBR-TOT-01','IV-COL-03','WIP-VIS-05','WIP-VIS-06','SBR-VIS-03','SBR-VIS-04',
 'PV-ROW-05','PV-ROW-06','PV-ROW-07','SBC-TREE-13','WIP-COL-01','WIP-COL-02','PV-COL-02',
 'TU-SUM-01','TU-DAY-01','SBR-ROW-02',
}

def tier(cid, verdict):
    if verdict in ('CUT',):
        return '-'
    if verdict in ('WEAK-KEEP', 'MERGE'):
        return 'T2'
    fam = cid.split('-')[1]
    if fam in T2_AREAS or cid in T2_EXPLICIT:
        return 'T2'
    return 'T1'

def main():
    cases = []
    for f in sorted(glob.glob(os.path.join(SNAP, '*.json'))):
        cases.extend(json.load(open(f)))
    idmap = {}
    with open(IDMAP) as fh:
        for row in csv.DictReader(fh):
            idmap[row['internal_id']] = row['testrail_case_id']
    assert len(cases) == 515, len(cases)

    rows = []
    counts = collections.Counter()
    percounts = collections.defaultdict(collections.Counter)
    for c in cases:
        cid = c['id']
        rep = cid.split('-')[0]
        if cid in CUTS:
            v, reason, grp, surv = 'CUT', CUTS[cid], '', ''
        elif cid in member2group:
            g = member2group[cid]
            surv = MERGES[g][0]
            v, reason, grp = 'MERGE', MERGE_REASON[cid], g
        elif cid in WEAK:
            v, reason, grp, surv = 'WEAK-KEEP', WEAK[cid], '', ''
        else:
            v, reason, grp, surv = 'KEEP', keep_reason(cid), '', ''
        t = tier(cid, v)
        counts[v] += 1
        percounts[rep][v] += 1
        rows.append({
            'internal_id': cid,
            'testrail_case_id': idmap.get(cid, ''),
            'testrail_link': ('https://shopview.testrail.io/index.php?/cases/view/' + idmap[cid][1:]) if idmap.get(cid) else '',
            'report': rep,
            'section': c['area'],
            'title': c['title'],
            'verdict': v,
            'reason': reason,
            'merge_group': grp,
            'merge_survivor': surv,
            'tier': t,
        })
    with open(OUT, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    print('TOTAL', sum(counts.values()), dict(counts))
    for rep in ['SBC', 'SBR', 'PV', 'TU', 'WIP', 'IV']:
        print(rep, dict(percounts[rep]), 'total', sum(percounts[rep].values()))
    t1 = sum(1 for r in rows if r['tier'] == 'T1')
    t2 = sum(1 for r in rows if r['tier'] == 'T2')
    print('TIER1', t1, 'TIER2', t2)
    merged_members = sum(len(m) for _, m, _ in MERGES.values())
    print('merge groups', len(MERGES), 'members absorbed', merged_members)
    print('post-consolidation count:', 515 - merged_members - len(CUTS))
    print('post-consolidation if WEAK also dropped:', 515 - merged_members - len(CUTS) - len(WEAK))

if __name__ == '__main__':
    main()
