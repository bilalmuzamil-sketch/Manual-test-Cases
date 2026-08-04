# Parts Velocity + Technician Utilization — LIVE VIU VERDICTS (2026-08-03/04)

**Scope: 131 cases — Parts Velocity 71 + Technician Utilization 60.** Every case carries ONE
definite verdict. There are **no "partly observed" rows**.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| PV spec | Confluence pageId 620888066 | **v4**, last modified 2026-07-29 | 2026-08-03 (live capture reused) | **CURRENT** |
| TU spec | Confluence pageId 641400833 | **v5**, last modified 2026-07-29 | 2026-08-03 (mirror proven same-version) | **CURRENT** |
| Epic | SV-8582 | not re-read this run | 2026-07-31 (6 stories reopened) | **PARTIAL** — a Tier-2 full re-read was not authorised for this batch (Rule 37) |
| Designs | none exist for the Report Suite | n/a | — | **N/A** (spec-only project, no Rule-35 queue) |
| Tech plan | build/report-suite/tech-plan-2026-07-29 | 2026-07-29, not re-fetched | — | **PARTIAL** |
| PO answers | Chris Ward, through 2026-08-01 | — | — | **CURRENT** |
| **Live build** | `sv8582.qa.shopview.com` | **v3.4.1-0ed4433** — `last-modified Mon, 03 Aug 2026 13:40:38 GMT`, `etag 02091e9dc11f187d7739b4efa166ea21` | **re-captured at the START and at the END of this run — IDENTICAL, the build did not change mid-run** | **PARTIAL — DECLARED NOT FINAL** |

**Because the branch is NOT FINAL, every verdict below is PROVISIONAL (Standing Rule 49).**
All 131 rows are queued in `RECHECK-ROWS.md` with the build marker. **No suite may be called
VIU-complete while that queue is open.**

## TALLY

| Verdict | Cases | Meaning |
|---|---:|---|
| **VIU-Observed-PASS** | **95** | The case's assertion was driven live and the build matched. |
| **DEVIATION** | **32** | Driven live; the build and the spec/ruling disagree. Each row quotes the spec verbatim and says whether I read it as a defect or as not-built-yet on an unfinished branch. |
| **NOT-BUILT** | **0** | Nothing in scope was absent from the build. |
| **EXTERNAL-DEPENDENCY** | **4** | Fully characterised below; not a seeding gap. |
| **PARTLY OBSERVED** | **0** | Not an accepted verdict in this batch. |
| **TOTAL** | **131** | |

Per report:

| Report | Total | PASS | DEVIATION | EXTERNAL-DEP |
|---|---:|---:|---:|---:|
| Parts Velocity | 71 | 54 | 16 | 1 |
| Technician Utilization | 60 | 41 | 16 | 3 |

## SEVEN-FIELD SWEEP (every case, every field)

| Field | OK | EDIT | What was checked |
|---|---:|---:|---|
| Title | 131 | 0 | Accuracy against what the build does, length (all 131 are inside 80 characters), and agreement with the case's own expected result. |
| Preconditions | 131 | 0 | Reachability. Every precondition needed this run was satisfiable by seeding — **no case failed for want of data**. The one genuine exception is QuickBooks. |
| Steps | 131 | 0 | Executable in order using the build's real control names (verified handles: `input_report_search` "Search parts", `btn_dropdown_pv_export` / `btn_dropdown_tu_export` aria "Export report", `button_column_selection` aria/tooltip "Column Selection", `span.date-range-label`, `button_tu_expand_all`). No non-executable step was found in either report. |
| Expected results | 122 | 9 | Follows from the steps; scope-conditional rather than brittle. The closed "exactly this list" enumerations that exist here (the date-preset list, the three Type options, the three info-icon columns, the toast strings, the empty-state string) are all ones the spec itself closes, and each is version-pinned in its `refs`. |
| References | 131 | 0 | **Checked on every one of the 131 cases.** All 131 carry a Jira ticket AND a spec anchor, every anchor still exists in the current PV v4 / TU v5 spec bodies, and every anchor governs the assertion the case makes. **No reference change is needed anywhere in this batch.** The single documented exception is PV-PREC-02, whose refs state in as many words that no report spec covers QuickBooks and cite the tech plan instead. |
| Section | 131 | 0 | The 6 API-content cases (PV-API-01..04, PV-PREC-02, TU-API-01/02) are already in `PV — API` / `TU — API` sections; no UI-only case contains API content. **No section move needed.** |
| Notes | 0 | 131 | **All 131 need the same addition** — the Rule-49 non-final-build marker (metadata layer, never tester-facing). No FE-hidden / BE-allowed situation arises in either report (the permission model is enforced on the back end with 403s), so no Rule-24 tester note is required. |

## THE 4 EXTERNAL-DEPENDENCY ROWS — fully characterised

### PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925) — QuickBooks amount for a part-of-a-unit sale is exact and never inflated

QuickBooks is NOT connected on this org, so a QuickBooks journal amount cannot be observed at all. Fully characterised: the QuickBooks feature flag IS enabled for the organisation but no company is linked, and the case's own references already record that no report spec covers QuickBooks (it cites the tech plan). This is a genuine external-integration dependency, not a data-seeding gap - it needs a QuickBooks-connected company and a human in QuickBooks.

*Evidence:* `evidence/perms/permission-matrix.json; ../ACCESS-PROOF-2026-08-03.md (flag catalogue)` · *Unblocked by:* Re-run once a QuickBooks-connected company is available on the QA branch.

### TU-ELL-04 = [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) — Internal hours with no default labor rate anywhere show an em-dash

The em-dash state requires a location with NO default labor rate, and BOTH locations on this organisation have one (Heavy Duty resolves to "CP RAIL FLEET RATE" $145.00/h, Lethbridge to approximately $159.95/h - both proven by dividing the reported Est. Lost Labor by the internal seconds). Fully characterised attempts: POST /api/labour-types/change accepts is_default:false and returns 201 but does NOT persist the change (re-read still true - a finding in its own right); POST /api/labour-types/set-default requires an existing type id and rejects null/empty/bogus ("Not found"), so the default cannot be cleared; POST /api/workplaces/create works but /api/workplaces/delete returns HTTP 500 for every id, so a rate-less third location cannot be created REVERSIBLY on a shared organisation and was deliberately not created. Every probe left the configuration byte-identical (verified: the one default is still CP RAIL FLEET RATE at 145).

*Evidence:* `evidence/tu/unrated/unrated-location.json` · *Unblocked by:* Re-run once an administrator provides a location with no default labor rate, or once the default can be cleared.

### TU-ELL-05 = [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) — Internal hours split across rated and unrated locations show a part value

Partial valuation needs internal hours spanning a rated and an UNRATED location; no unrated location can be produced on this build - see TU-ELL-04 for the full characterisation. The rated-plus-rated case WAS proven (Location "Multiple" with Est. Lost Labor equal to the exact sum of both per-location amounts), so the per-location summation half of the behaviour is verified; only the exclusion-of-unrated-hours half is blocked.

*Evidence:* `evidence/tu/unrated/unrated-location.json; evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` · *Unblocked by:* Re-run once a location with no default labor rate exists.

### TU-SORT-05 = [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) — Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0

The SORT MECHANISM was verified live - ascending puts every $0.00 row at the top and descending puts the largest values first, with $0.00 sorting as a number - but the specific assertion that em-dash rows stay at the BOTTOM in BOTH directions cannot be observed because no em-dash Est. Lost Labor value can be produced on this organisation. See TU-ELL-04 for the full characterisation of why.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/tu/unrated/unrated-location.json` · *Unblocked by:* Re-run the both-directions em-dash sort once a location with no default labor rate exists.

## THE 32 DEVIATIONS

Each row quotes the spec verbatim (Standing Rule 25) and states my read.

### PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330)

**Date range selector offers exactly the eleven bounded options and no All Time**

The picker offers NINE presets - Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week - plus an inline calendar, a "Range: N days" readout, a Today button and Apply. There is NO "Yesterday" and NO "Custom" item, and "Last 12 Months" is not in the spec list. SPEC S2-R2 (verbatim): "The toolbar provides a date range selector offering exactly these options: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom." Read as NOT-BUILT-AS-SPECIFIED in a SHARED date-range component (the same control serves every report), i.e. a product decision, not a Parts-Velocity defect. The "no All Time" half of the case PASSES.

*Evidence:* `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json`

### PV-FILT-10 = [C30337](https://shopview.testrail.io/index.php?/cases/view/30337)

**Location filter is rightmost, defaults to the active location, accessible-only**

The Location filter IS the rightmost control and IS limited to the accessible locations, but on a FIRST visit it defaults to ALL locations (both workplaces), not to the user's currently active location. SPEC S2-R9 (verbatim): "On a first visit it defaults to the user's currently active location (the location currently selected in the application's global location switcher)." Read as a build defect on the default, small and self-contained; the rest of S2-R9 passes.

*Evidence:* `evidence/final/final-ui.json`

### PV-FILT-13 = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340)

**Parts Velocity: the Location filter is hidden for a one-location user**

A seeded one-location user (Sales Representative, single workplace, impersonated then restored) STILL SEES the Location filter; its menu offers only "Clear all" and the one location name (the "All locations" entry drops out). The per-row Location column is correctly absent. Our case follows Chris Ward's 2026-07-31 Q1=A ruling that the filter should be HIDDEN; PV spec S2-E4 still reads (verbatim) "A user with access to only one location still sees the Location filter with a single selectable location; behavior is unchanged from single-location use." Read as the build following the un-updated spec - a product decision awaiting Chris's spec edit, not a bug ticket. NO CASE CHANGE.

*Evidence:* `evidence/perms/singleloc-pv-tu.json, evidence/perms/singleloc2-parts-velocity.png`

### PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)

**The Location column shows only with more than one location, leftmost before Type**

The per-row Location column DOES appear only when more than one location is in scope (present with both locations, absent for a single-location user and for a single-location selection), it is NOT in the 20-column picker, and a merged special-order row shows the literal "Multiple". But it renders SIXTH - after Vendor, before Units Sold - not leftmost before Type, on screen AND in both exports. SPEC S7-R8 (verbatim): "the per-row Location column renders as the leftmost column, before Type". Read as a build defect on placement only; every other assertion of the case passes.

*Evidence:* `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json; evidence/pv/exports/pv-csv-GREASE-multi.csv, pv-pdf-GREASE-multi.txt`

### PV-ROW-06 = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346)

**Info icons sit on Units Sold; Demand and Turns / Yr with descriptions**

All three info icons exist and carry the spec's VERBATIM descriptions (Units Sold and Demand always on; the Turns icon appears only once that column is enabled, with "How many times you sell through this part in a year. Higher is better."). The build's header label is "Turns/Yr" with no spaces; the spec and our case write "Turns / Yr". OUR WORDING must change.

*Evidence:* `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json`

### PV-ROW-07 = [C30347](https://shopview.testrail.io/index.php?/cases/view/30347)

**Description; Category and Vendor truncate on hover; Part # never does**

At 1680px a 62-character description ("WHEEL BEARING GREASE, RED - HIGH TEMP (PRIMGHT64, WOIPR127651)") renders in FULL: computed text-overflow is "clip" (not ellipsis), scrollWidth equals clientWidth, and the cell carries NO title attribute, so there is no native hover tooltip. SPEC S3-R7 (verbatim): "The Description, Category, and Vendor columns truncate long text with an ellipsis on screen; the full value is available on native hover (browser tooltip)". The "Part # is never truncated" half passes. Read as a build defect. Honest limit: measured at 1680x1050; a 900px re-measure did not render a row in time.

*Evidence:* `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json`

### PV-COL-05 = [C30355](https://shopview.testrail.io/index.php?/cases/view/30355)

**A saved value that is no longer valid falls back to that setting's default**

A deliberately invalid saved view (dateRange "not-a-range", an unknown location id, a bogus column key, type "nonsense") does fall back for columns, Type and the location id - but the date-range control is left reading "Select Date Range" and NO data request is made at all, so the report shows nothing. SPEC S4-R6 (verbatim): "a saved value that is no longer valid ... falls back to that setting's default rather than being sent to the server." Read as a build defect: the invalid date range should fall back to This Year and load.

*Evidence:* `evidence/final/final-ui.json`

### PV-COL-08 = [C30358](https://shopview.testrail.io/index.php?/cases/view/30358)

**All 20 columns can be hidden; the empty selection is never restored**

All 14 visible columns can be switched off (headers empty, saved columns array empty) and the empty selection is correctly NOT restored - the 14 defaults return on the next visit. But an export with zero columns produces NO file and NO request: the front end short-circuits with a toast reading "Empty export / Export didn't yield any results". SPEC S4-E1 (verbatim): "An export triggered with zero columns enabled produces a file containing only the header/metadata rows and no data columns." Read as a build defect on the export half.

*Evidence:* `evidence/final/final-ui.json`

### PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367)

**Turns / Yr annualizes the sales rate, is 0.00 at zero stock, can be negative**

Turns/Yr annualises the in-window rate and is 0.00 at zero on hand and negative when Units Sold is negative - but the WINDOW DIVISOR IS ONE DAY SHORT. BRAKECLEAN (512 sold, 618 on hand, Jan 1 - Aug 4) returns 1.40648754422, which is exactly 512/215*365/618; the spec's inclusive window (216 days) gives 1.39998. Reproduced on a second row (50.78875968992 = 359/215*365/12). SPEC S5 Definitions (verbatim): "Window - the whole-day span of the selected range, inclusive of both the start and end dates, with a floor of 1 day". Read as a build defect (an off-by-one in the divisor).

*Evidence:* `evidence/pv/calc-checks.json`

### PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)

**Window anchors: movement uses the event date, billed uses the WO date**

The two anchors do behave differently (Last Sale ignores the window entirely; movement and billed figures diverge for inventory rows and agree for special-order rows), but the Window divisor used to annualise is the EXCLUSIVE day count - see PV-CALC-09 for the arithmetic proof. SPEC S5 Definitions (verbatim): "inclusive of both the start and end dates". Read as the same single build defect.

*Evidence:* `evidence/pv/calc-checks.json; evidence/pv/extra-checks.json`

### PV-EXP-05 = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379)

**PDF: filename, A3 landscape, title, text truncation, and the shop logo**

The PDF is titled "Parts Velocity", carries the organisation name and the "Locations:" line, and truncates Description/Category/Vendor while leaving Part # whole - but its PAGE SIZE IS A4 LANDSCAPE (841.89 x 595.276 pts), not A3 landscape, and the browser-visible filename is "parts-velocity-report.pdf" rather than "velocity-report.pdf" (the API Content-Disposition does say velocity-report.pdf, so the front end renames it). SPEC S6-R6 (verbatim): "The PDF is formatted for A3 landscape, titled Parts Velocity."; S6-R5 (verbatim): "the PDF as velocity-report.pdf". Read as two build defects. NOTE also that no logo is required by the PV spec and none was asserted.

*Evidence:* `evidence/pv/exports/pv-pdf-GREASE-multi.pdf`

### PV-EXP-06 = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380)

**CSV is named velocity-report.csv and holds full untruncated text values**

The CSV carries the FULL untruncated Description/Category/Vendor values (confirmed against the PDF's 18-character truncation), but the browser-visible filename is "parts-velocity-report.csv" not "velocity-report.csv", and the CSV renders Last Sale as "52 days" rather than the raw integer. SPEC S6-R5 (verbatim): "The CSV downloads as velocity-report.csv"; S6-R8 (verbatim): "Last Sale renders as N days ... in the PDF; the CSV renders the raw integer." Read as two build defects.

*Evidence:* `evidence/pv/exports/pv-csv-GREASE-multi.csv; pv-pdf-GREASE-multi.txt`

### PV-EXP-07 = [C30381](https://shopview.testrail.io/index.php?/cases/view/30381)

**Em-dash in both exports; Last Sale reads "N days" in the PDF**

Em-dashes do appear in both files for every nullable field (Unit Cost, Sell Price, Margin %, On Hand, Turns/Yr, Last Sale, Min, Max - special-order rows show four em-dashes) and the PDF renders Last Sale as "N days". The CSV also renders "N days" where the spec wants the raw integer - the same single defect as PV-EXP-06.

*Evidence:* `evidence/pv/exports/`

### PV-EXP-10 = [C30384](https://shopview.testrail.io/index.php?/cases/view/30384)

**Export toasts: exact success texts; server or fallback error text on failure**

The FAILURE path matches the spec exactly - an over-cap export raises the server message verbatim as a warning toast: "This report is too large to export. Narrow the date range or filters, then try again."; an empty result raises "Empty export / Export didn't yield any results" with no request at all. But the SUCCESS toast reads "Success / Data exported successfully." for BOTH formats. SPEC S6-R9 (verbatim): 'a success toast reads "Velocity report exported (CSV)" or "Velocity report exported (PDF)"'. Read as a build defect on the success wording (and it removes the documented uppercase/lowercase casing quirk).

*Evidence:* `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json`

### PV-VIS-01 = [C30385](https://shopview.testrail.io/index.php?/cases/view/30385)

**The report uses the standard two-tone layout**

The layout IS the standard edge-to-edge two-tone report grid, but the measured surfaces are #F9FAFB (rgb 249,250,251) for the toolbar, the table wrapper, the header cells and the body cells - not white - and the card computes a 4px border-radius. SPEC S7-R1 (verbatim): "The page uses the two-tone theme: white card surfaces (toolbar + table cells) on the standard soft blue-grey page background. No card border-radius (edge-to-edge table)." Read as a token-level build/design drift rather than a functional defect.

*Evidence:* `evidence/final/final-ui.json`

### PV-VIS-02 = [C30386](https://shopview.testrail.io/index.php?/cases/view/30386)

**Toolbar and table detail styling matches the suite paddings and borders**

Measured live: toolbar padding is 0px 0px 24px (spec: 32px top, 2rem right, 24px bottom, 2rem left); the header cell top border computes 0px (spec: 1px); first/last cell padding is 14.28px (spec: 2rem = 32px). Header and body cell backgrounds are #F9FAFB rather than white. SPEC S7-R2/R3/R5. Read as token-level drift on a shared report shell - a design decision for the PO, not a Parts-Velocity bug.

*Evidence:* `evidence/final/final-ui.json`

### TU-NAV-03 = [C30394](https://shopview.testrail.io/index.php?/cases/view/30394)

**First visit defaults to the This Month preset and the user's active location**

A first visit (saved view cleared) does open on This Month - the request is range=custom&start_date=2026-08-01&end_date=2026-08-04, i.e. month-to-date - but the Location filter defaults to ALL locations, not to the user's currently active location. SPEC S9-R2 (verbatim): "On a first visit (no saved selection ...), it defaults to the user's currently active location". Read as a build defect on the location default; the This-Month half passes.

*Evidence:* `evidence/final/final-ui.json`

### TU-HRS-02 = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401)

**Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp)**

The five data headers appear in the fixed order Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor with hours to two decimals and no thousands separator ("15914.83", "0.01"), and toggling columns never reorders the rest. But the automatic Location column renders SECOND - after Technician - whereas the spec puts it leftmost, before Technician. SPEC S2-R1 (verbatim): "When shown ..., the per-row Location column precedes them all as the leftmost column." Note the EXPORTS do put Location first, so screen and file disagree. Read as a build defect on the on-screen placement.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/tu/exports/`

### TU-DAY-01 = [C30418](https://shopview.testrail.io/index.php?/cases/view/30418)

**Each technician row has an accessible expand/collapse control**

Every technician row carries an expand control whose accessible name is exactly "Expand <name>'s daily breakdown" and flips to "Collapse <name>'s daily breakdown" when opened, and the control is keyboard-focusable. But the control exposes NO aria-expanded attribute, so its expanded/collapsed state reaches assistive technology only through the changing name. SPEC S8-R12 (verbatim): "The expand/collapse controls ... expose their expanded/collapsed state to assistive technology". Read as an accessibility build defect, narrow and precise.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json`

### TU-TECH-01 = [C30423](https://shopview.testrail.io/index.php?/cases/view/30423)

**Filter by Technician starts with every technician selected on a first visit**

On a first visit every technician IS selected (the control reads "All technicians" and the saved view records an empty deselected set) and it is a multi-select. But the control is labelled just "Technician". SPEC S5-R1 (verbatim): 'The toolbar has a filter labeled "Filter by Technician"'. Read as a build defect on the label - and note the same menu offers "All technicians" where S5-R6 asks for a control labelled "Select all".

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/final/final-ui.json`

### TU-TECH-03 = [C30425](https://shopview.testrail.io/index.php?/cases/view/30425)

**Select all and Clear all controls set every technician on or off**

The menu does offer a working select-all and clear-all pair, and clearing all deselects every listed technician (the report then shows the no-data message), and a date-range or location change keeps the deselected set. But the select-all control is labelled "All technicians", not "Select all". SPEC S5-R6 (verbatim): 'The filter has a control labeled "Select all" to select all technicians at once.' Read as a build defect on the label; "Clear all" matches exactly.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json`

### TU-LINK-01 = [C30428](https://shopview.testrail.io/index.php?/cases/view/30428)

**Total Hours is a real link with a non-color affordance and keyboard access**

The Total Hours value IS a real anchor, keyboard-focusable, and on focus it gains BOTH an underline and a 2px solid focus outline; the Summary row's Total Hours is NOT a link. But AT REST the anchor computes text-decoration: none and is distinguished by colour alone (rgb 34,118,218) - the underline appears only on hover or focus. SPEC S6-R1 (verbatim): "The link is distinguished by more than color - it carries an underline (or equivalent non-color affordance) ...". Read as an accessibility build defect at rest. Honest limit: Enter-key activation was not driven.

*Evidence:* `evidence/final/final-ui.json`

### TU-EXP-01 = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434)

**Three-dot menu is leftmost, then Column Selection; three download options**

The three-dot menu IS leftmost in the action cluster, followed by Column Selection, then the date-range picker, the technician filter and the location filter - matching the spec exactly. But the menu holds FOUR items, not three: "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)", "Expanded (CSV)" - no "Download" prefix anywhere, and a second CSV variant the spec does not describe. SPEC S7-R2/R3/R4 (verbatim): 'an option labeled "Download Summary (PDF)"', '"Download Expanded View (PDF)"', '"Download (CSV)"'. Read as shipped strings and a shipped extra variant - a product question for Chris Ward, not a bug ticket. NO CASE CHANGE until he rules.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/tu/ui/tu-export-menu.png`

### TU-EXP-02 = [C30435](https://shopview.testrail.io/index.php?/cases/view/30435)

**The Summary PDF holds the technician rows plus the Summary**

The Summary PDF does contain the technician rows, is titled "Technician Utilization", carries the "Locations:" line and an embedded logo - but it does NOT contain the Summary row (the last data row is followed straight by the footer "Software Powered by ShopView / Page 2 of 2"), and the file is named "technician-utilization-summary.pdf" not "Technician-Utilization-Summary.pdf". SPEC S7-R5 (verbatim): "The Summary PDF shows the technician rows and the Summary row."; S7-R12 names the Title-Case filenames. Read as two build defects.

*Evidence:* `evidence/tu/exports/tu-pdf-thisyear-summary-multi.pdf, tu-pdf-summary.txt`

### TU-EXP-03 = [C30436](https://shopview.testrail.io/index.php?/cases/view/30436)

**The CSV is always summary-level, quotes comma-containing values**

CSV comma-quoting is exactly right ("$7,248.85", "$139,819.85" are quoted; plain numbers are not). But the CSV DOES vary by the summary/expanded choice - the expanded CSV adds one row per clocked day (1,869 lines vs 30) - and neither CSV contains the Summary row, and the filenames are technician-utilization-summary.csv / -expanded.csv rather than technician-utilization.csv. SPEC S7-R7 (verbatim): "The CSV file shows the technician rows and the Summary row. The CSV is always this summary-level content; it does not vary by the summary/expanded choice." Read as build defects on all three points.

*Evidence:* `evidence/tu/exports/tu-csv-thisyear-summary-multi.csv, tu-csv-thisyear-expanded-multi.csv`

### TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437)

**Downloads cover only selected technicians, locations, and date range**

Downloads do cover the selected locations and the active date range, DO mirror the shown columns, DO carry the "Locations:" line ("Locations: All locations" when both are selected) and DO include the per-row Location column only in multi-location scope (absent from the single-location file). But a download taken with NO technician selected still exports: the request returns 200 and a success toast appears. SPEC S7-N1 (verbatim): "If no technician is selected, choosing a download option does nothing: no file downloads and no message appears." Read as a build defect. Note also that the export puts Location FIRST while the screen puts it second.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/tu/exports/`

### TU-EXP-05 = [C30438](https://shopview.testrail.io/index.php?/cases/view/30438)

**Downloads always order rows Technician A to Z; the on-screen sort is ignored**

Export rows are NOT ordered Technician A to Z - the summary CSV and PDF both run Alexander Cohen, Brittany Anderson, Colleen Guerrero, Wesley Mcclure, Jacob Chung, William Johns, Judy Garcia, Andrew Wade, ... i.e. the raw server order. SPEC S7-R10a (verbatim): "Rows in every download are ordered by Technician name A to Z (the default order)." The other half is satisfied: the on-screen sort is not carried into the file. Read as a build defect.

*Evidence:* `evidence/tu/exports/tu-csv-thisyear-summary-multi.csv, tu-pdf-summary.txt`

### TU-EXP-07 = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440)

**Choosing a download with no technician selected is a silent no-op**

With every technician cleared (the report showing the no-data message) choosing "Summary (CSV)" still issued the export request, received 200 and raised a success toast. SPEC S7-N1 (verbatim): "If no technician is selected, choosing a download option does nothing: no file downloads and no message appears." Read as a build defect - the same one recorded on TU-EXP-04.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json`

### TU-EXP-08 = [C30441](https://shopview.testrail.io/index.php?/cases/view/30441)

**A starting download notifies; a failed one shows the failure message**

A download does raise a success notification and a failure does raise an error, but the SUCCESS text reads "Success / Data exported successfully." SPEC Story 7 Error Handling and the section 7 table (verbatim): 'When a download starts, the user sees a success notification: "Download started".' Read as a build defect on the wording. Honest limit: the failure text "Failed to download report" was not provoked on TU - the failures seen were the shared over-cap 400 and the PDF 500, which surface the server message instead.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json`

### TU-LOC-01 = [C30442](https://shopview.testrail.io/index.php?/cases/view/30442)

**The Location filter is the rightmost multi-select; All Locations = select-all**

The Location filter IS the rightmost control, IS a multi-select, and "All Locations" DOES act as a select-all shortcut - unchecking one location correctly left the other selected. But the on-screen wording is "All locations" (lower-case L) and the menu also offers a "Clear all" action the case does not mention. SPEC S9-R1 writes "All Locations". OUR WORDING must change.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json`

### TU-LOC-05 = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446)

**Technician Utilization: Location filter hidden for a one-location user**

A seeded one-location user (Sales Representative, single workplace, impersonated then restored) STILL SEES the Location filter, whose menu offers only "Clear all" and the one location name. Our case follows Chris Ward's 2026-07-31 Q1=A ruling that it should be HIDDEN; TU spec S9-N1 still reads (verbatim) "A user with access to only one location still sees the filter with a single selectable location; behavior is unchanged from single-location use." Read as the build following the un-updated spec - a product decision awaiting Chris's spec edit. NO CASE CHANGE.

*Evidence:* `evidence/perms/singleloc-pv-tu.json, evidence/perms/singleloc2-technician-utilization.png`

### TU-LOC-06 = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915)

**The Location column shows only with more than one location; Summary row blank**

The Location column DOES appear only when more than one location is in scope (absent for a single-location selection and for a one-location user), a technician whose hours span both locations shows the literal "Multiple", a single-location technician shows that location's name, the SUMMARY ROW LEAVES IT BLANK, and it is not in the column selector - every one of those verified live. But on screen it renders SECOND, after Technician, not leftmost; in the exports it correctly renders FIRST. SPEC S8-R15 (verbatim): "the per-row Location column renders as the leftmost column, before Technician". Read as a build defect on the on-screen placement only.

*Evidence:* `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json; evidence/tu/exports/`

## FULL PER-CASE TABLE (all 131)

The machine-readable table with all seven field verdicts per case is **`verdicts.csv`**.

| Internal ID | C-id | Link | Verdict | Fields needing an edit | Evidence |
|---|---|---|---|---|---|
| PV-NAV-01 | C30322 | [open](https://shopview.testrail.io/index.php?/cases/view/30322) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json` |
| PV-NAV-02 | C30323 | [open](https://shopview.testrail.io/index.php?/cases/view/30323) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| PV-NAV-03 | C30324 | [open](https://shopview.testrail.io/index.php?/cases/view/30324) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| PV-PERM-01 | C30325 | [open](https://shopview.testrail.io/index.php?/cases/view/30325) | VIU-Observed-PASS | notes | `evidence/perms/permission-matrix.json, singleloc-and-noreports.json, singleloc-pv-tu.json` |
| PV-PERM-02 | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | VIU-Observed-PASS | notes | `evidence/perms/permission-matrix.json, singleloc-and-noreports.json, singleloc-pv-tu.json` |
| PV-PERM-03 | C30327 | [open](https://shopview.testrail.io/index.php?/cases/view/30327) | VIU-Observed-PASS | notes | `evidence/perms/permission-matrix.json, singleloc-and-noreports.json, singleloc-pv-tu.json` |
| PV-FILT-01 | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-03 | C30330 | [open](https://shopview.testrail.io/index.php?/cases/view/30330) | DEVIATION | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-04 | C30331 | [open](https://shopview.testrail.io/index.php?/cases/view/30331) | VIU-Observed-PASS | notes | `evidence/pv/extra-checks.json` |
| PV-FILT-05 | C30332 | [open](https://shopview.testrail.io/index.php?/cases/view/30332) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-06 | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-07 | C30334 | [open](https://shopview.testrail.io/index.php?/cases/view/30334) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-08 | C30335 | [open](https://shopview.testrail.io/index.php?/cases/view/30335) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-09 | C30336 | [open](https://shopview.testrail.io/index.php?/cases/view/30336) | VIU-Observed-PASS | notes | `evidence/pv/exports/` |
| PV-FILT-10 | C30337 | [open](https://shopview.testrail.io/index.php?/cases/view/30337) | DEVIATION | notes | `evidence/final/final-ui.json` |
| PV-FILT-11 | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-FILT-12 | C30339 | [open](https://shopview.testrail.io/index.php?/cases/view/30339) | VIU-Observed-PASS | notes | `evidence/pv/last-gaps.json` |
| PV-FILT-13 | C30340 | [open](https://shopview.testrail.io/index.php?/cases/view/30340) | DEVIATION | notes | `evidence/perms/singleloc-pv-tu.json, evidence/perms/singleloc2-parts-velocity.png` |
| PV-FILT-14 | C38914 | [open](https://shopview.testrail.io/index.php?/cases/view/38914) | DEVIATION | expected, notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-01 | C30341 | [open](https://shopview.testrail.io/index.php?/cases/view/30341) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-ROW-02 | C30342 | [open](https://shopview.testrail.io/index.php?/cases/view/30342) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-ROW-03 | C30343 | [open](https://shopview.testrail.io/index.php?/cases/view/30343) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-04 | C30344 | [open](https://shopview.testrail.io/index.php?/cases/view/30344) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-05 | C30345 | [open](https://shopview.testrail.io/index.php?/cases/view/30345) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-06 | C30346 | [open](https://shopview.testrail.io/index.php?/cases/view/30346) | DEVIATION | expected, notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-07 | C30347 | [open](https://shopview.testrail.io/index.php?/cases/view/30347) | DEVIATION | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-ROW-08 | C30348 | [open](https://shopview.testrail.io/index.php?/cases/view/30348) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-ROW-09 | C30349 | [open](https://shopview.testrail.io/index.php?/cases/view/30349) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-ROW-10 | C30350 | [open](https://shopview.testrail.io/index.php?/cases/view/30350) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-COL-01 | C30351 | [open](https://shopview.testrail.io/index.php?/cases/view/30351) | VIU-Observed-PASS | expected, notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-COL-02 | C30352 | [open](https://shopview.testrail.io/index.php?/cases/view/30352) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| PV-COL-03 | C30353 | [open](https://shopview.testrail.io/index.php?/cases/view/30353) | VIU-Observed-PASS | expected, notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-COL-04 | C30354 | [open](https://shopview.testrail.io/index.php?/cases/view/30354) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-COL-05 | C30355 | [open](https://shopview.testrail.io/index.php?/cases/view/30355) | DEVIATION | notes | `evidence/final/final-ui.json` |
| PV-COL-06 | C30356 | [open](https://shopview.testrail.io/index.php?/cases/view/30356) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-COL-08 | C30358 | [open](https://shopview.testrail.io/index.php?/cases/view/30358) | DEVIATION | notes | `evidence/final/final-ui.json` |
| PV-CALC-01 | C30359 | [open](https://shopview.testrail.io/index.php?/cases/view/30359) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-02 | C30360 | [open](https://shopview.testrail.io/index.php?/cases/view/30360) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-03 | C30361 | [open](https://shopview.testrail.io/index.php?/cases/view/30361) | VIU-Observed-PASS | notes | `evidence/pv/last-gaps.json` |
| PV-CALC-04 | C30362 | [open](https://shopview.testrail.io/index.php?/cases/view/30362) | VIU-Observed-PASS | notes | `evidence/pv/last-gaps.json` |
| PV-CALC-05 | C30363 | [open](https://shopview.testrail.io/index.php?/cases/view/30363) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-06 | C30364 | [open](https://shopview.testrail.io/index.php?/cases/view/30364) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-07 | C30365 | [open](https://shopview.testrail.io/index.php?/cases/view/30365) | VIU-Observed-PASS | notes | `evidence/pv/extra-checks.json` |
| PV-CALC-08 | C30366 | [open](https://shopview.testrail.io/index.php?/cases/view/30366) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-09 | C30367 | [open](https://shopview.testrail.io/index.php?/cases/view/30367) | DEVIATION | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-10 | C30368 | [open](https://shopview.testrail.io/index.php?/cases/view/30368) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-11 | C30369 | [open](https://shopview.testrail.io/index.php?/cases/view/30369) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-12 | C30370 | [open](https://shopview.testrail.io/index.php?/cases/view/30370) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-13 | C30371 | [open](https://shopview.testrail.io/index.php?/cases/view/30371) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-14 | C30372 | [open](https://shopview.testrail.io/index.php?/cases/view/30372) | VIU-Observed-PASS | notes | `evidence/pv/core-exclusion-final.json, core-exclusion-iscore.json` |
| PV-CALC-15 | C30373 | [open](https://shopview.testrail.io/index.php?/cases/view/30373) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-CALC-16 | C30374 | [open](https://shopview.testrail.io/index.php?/cases/view/30374) | DEVIATION | notes | `evidence/pv/calc-checks.json` |
| PV-PREC-01 | C38924 | [open](https://shopview.testrail.io/index.php?/cases/view/38924) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-EXP-01 | C30375 | [open](https://shopview.testrail.io/index.php?/cases/view/30375) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-EXP-02 | C30376 | [open](https://shopview.testrail.io/index.php?/cases/view/30376) | VIU-Observed-PASS | notes | `evidence/pv/exports/` |
| PV-EXP-03 | C30377 | [open](https://shopview.testrail.io/index.php?/cases/view/30377) | VIU-Observed-PASS | notes | `evidence/pv/exports/pv-csv-GREASE-cols14.csv` |
| PV-EXP-04 | C30378 | [open](https://shopview.testrail.io/index.php?/cases/view/30378) | VIU-Observed-PASS | notes | `evidence/pv/exports/pv-csv-sort-*.csv` |
| PV-EXP-05 | C30379 | [open](https://shopview.testrail.io/index.php?/cases/view/30379) | DEVIATION | notes | `evidence/pv/exports/pv-pdf-GREASE-multi.pdf` |
| PV-EXP-06 | C30380 | [open](https://shopview.testrail.io/index.php?/cases/view/30380) | DEVIATION | notes | `evidence/pv/exports/pv-csv-GREASE-multi.csv` |
| PV-EXP-07 | C30381 | [open](https://shopview.testrail.io/index.php?/cases/view/30381) | DEVIATION | notes | `evidence/pv/exports/` |
| PV-EXP-08 | C30382 | [open](https://shopview.testrail.io/index.php?/cases/view/30382) | VIU-Observed-PASS | notes | `evidence/pv/exports/pv-pdf-GREASE-multi.txt` |
| PV-EXP-10 | C30384 | [open](https://shopview.testrail.io/index.php?/cases/view/30384) | DEVIATION | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-EXP-11 | C38885 | [open](https://shopview.testrail.io/index.php?/cases/view/38885) | VIU-Observed-PASS | notes | `evidence/pv/exports/exports-log.jsonl` |
| PV-VIS-01 | C30385 | [open](https://shopview.testrail.io/index.php?/cases/view/30385) | DEVIATION | notes | `evidence/final/final-ui.json` |
| PV-VIS-02 | C30386 | [open](https://shopview.testrail.io/index.php?/cases/view/30386) | DEVIATION | notes | `evidence/final/final-ui.json` |
| PV-VIS-03 | C30387 | [open](https://shopview.testrail.io/index.php?/cases/view/30387) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| PV-API-01 | C30388 | [open](https://shopview.testrail.io/index.php?/cases/view/30388) | VIU-Observed-PASS | notes | `evidence/pv/calc-checks.json` |
| PV-API-02 | C30389 | [open](https://shopview.testrail.io/index.php?/cases/view/30389) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-API-03 | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | VIU-Observed-PASS | notes | `evidence/pv/ui/pv-ui-1.json, pv-ui-2.json, pv-ui-3.json, pv-ui-4.json` |
| PV-API-04 | C30391 | [open](https://shopview.testrail.io/index.php?/cases/view/30391) | VIU-Observed-PASS | notes | `evidence/perms/permission-matrix.json, singleloc-and-noreports.json, singleloc-pv-tu.json` |
| PV-PREC-02 | C38925 | [open](https://shopview.testrail.io/index.php?/cases/view/38925) | EXTERNAL-DEPENDENCY | notes | `evidence/perms/permission-matrix.json` |
| TU-NAV-01 | C30392 | [open](https://shopview.testrail.io/index.php?/cases/view/30392) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-NAV-02 | C30393 | [open](https://shopview.testrail.io/index.php?/cases/view/30393) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-NAV-03 | C30394 | [open](https://shopview.testrail.io/index.php?/cases/view/30394) | DEVIATION | notes | `evidence/final/final-ui.json` |
| TU-NAV-04 | C30395 | [open](https://shopview.testrail.io/index.php?/cases/view/30395) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-NAV-05 | C30396 | [open](https://shopview.testrail.io/index.php?/cases/view/30396) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| TU-NAV-06 | C30397 | [open](https://shopview.testrail.io/index.php?/cases/view/30397) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-NAV-07 | C30398 | [open](https://shopview.testrail.io/index.php?/cases/view/30398) | VIU-Observed-PASS | notes | `evidence/perms/permission-matrix.json, singleloc-and-noreports.json, singleloc-pv-tu.json` |
| TU-NAV-08 | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-HRS-02 | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | DEVIATION | expected, notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-HRS-03 | C30402 | [open](https://shopview.testrail.io/index.php?/cases/view/30402) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-HRS-04 | C30403 | [open](https://shopview.testrail.io/index.php?/cases/view/30403) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-ELL-01 | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-ELL-02 | C30405 | [open](https://shopview.testrail.io/index.php?/cases/view/30405) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-ELL-03 | C30406 | [open](https://shopview.testrail.io/index.php?/cases/view/30406) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-ELL-04 | C30407 | [open](https://shopview.testrail.io/index.php?/cases/view/30407) | EXTERNAL-DEPENDENCY | notes | `evidence/tu/unrated/unrated-location.json` |
| TU-ELL-05 | C30408 | [open](https://shopview.testrail.io/index.php?/cases/view/30408) | EXTERNAL-DEPENDENCY | notes | `evidence/tu/unrated/unrated-location.json` |
| TU-SORT-01 | C30409 | [open](https://shopview.testrail.io/index.php?/cases/view/30409) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SORT-02 | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SORT-03 | C30411 | [open](https://shopview.testrail.io/index.php?/cases/view/30411) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SORT-04 | C30412 | [open](https://shopview.testrail.io/index.php?/cases/view/30412) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SORT-05 | C30413 | [open](https://shopview.testrail.io/index.php?/cases/view/30413) | EXTERNAL-DEPENDENCY | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SUM-01 | C30414 | [open](https://shopview.testrail.io/index.php?/cases/view/30414) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SUM-02 | C30415 | [open](https://shopview.testrail.io/index.php?/cases/view/30415) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SUM-03 | C30416 | [open](https://shopview.testrail.io/index.php?/cases/view/30416) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-SUM-04 | C30417 | [open](https://shopview.testrail.io/index.php?/cases/view/30417) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-DAY-01 | C30418 | [open](https://shopview.testrail.io/index.php?/cases/view/30418) | DEVIATION | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-DAY-02 | C30419 | [open](https://shopview.testrail.io/index.php?/cases/view/30419) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-DAY-03 | C30420 | [open](https://shopview.testrail.io/index.php?/cases/view/30420) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-DAY-04 | C30421 | [open](https://shopview.testrail.io/index.php?/cases/view/30421) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-DAY-05 | C30422 | [open](https://shopview.testrail.io/index.php?/cases/view/30422) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-TECH-01 | C30423 | [open](https://shopview.testrail.io/index.php?/cases/view/30423) | DEVIATION | expected, notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-TECH-02 | C30424 | [open](https://shopview.testrail.io/index.php?/cases/view/30424) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-TECH-03 | C30425 | [open](https://shopview.testrail.io/index.php?/cases/view/30425) | DEVIATION | expected, notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-TECH-04 | C30426 | [open](https://shopview.testrail.io/index.php?/cases/view/30426) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LINK-01 | C30428 | [open](https://shopview.testrail.io/index.php?/cases/view/30428) | DEVIATION | notes | `evidence/final/final-ui.json` |
| TU-LINK-02 | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| TU-LINK-03 | C30430 | [open](https://shopview.testrail.io/index.php?/cases/view/30430) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| TU-LINK-04 | C30431 | [open](https://shopview.testrail.io/index.php?/cases/view/30431) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LINK-05 | C30432 | [open](https://shopview.testrail.io/index.php?/cases/view/30432) | VIU-Observed-PASS | notes | `evidence/final/final-ui.json` |
| TU-LINK-06 | C30433 | [open](https://shopview.testrail.io/index.php?/cases/view/30433) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-EXP-01 | C30434 | [open](https://shopview.testrail.io/index.php?/cases/view/30434) | DEVIATION | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-EXP-02 | C30435 | [open](https://shopview.testrail.io/index.php?/cases/view/30435) | DEVIATION | notes | `evidence/tu/exports/tu-pdf-thisyear-summary-multi.pdf, tu-pdf-summary.txt` |
| TU-EXP-03 | C30436 | [open](https://shopview.testrail.io/index.php?/cases/view/30436) | DEVIATION | notes | `evidence/tu/exports/tu-csv-thisyear-summary-multi.csv, tu-csv-thisyear-expanded-multi.csv` |
| TU-EXP-04 | C30437 | [open](https://shopview.testrail.io/index.php?/cases/view/30437) | DEVIATION | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-EXP-05 | C30438 | [open](https://shopview.testrail.io/index.php?/cases/view/30438) | DEVIATION | notes | `evidence/tu/exports/tu-csv-thisyear-summary-multi.csv, tu-pdf-summary.txt` |
| TU-EXP-06 | C30439 | [open](https://shopview.testrail.io/index.php?/cases/view/30439) | VIU-Observed-PASS | notes | `evidence/tu/exports/` |
| TU-EXP-07 | C30440 | [open](https://shopview.testrail.io/index.php?/cases/view/30440) | DEVIATION | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-EXP-08 | C30441 | [open](https://shopview.testrail.io/index.php?/cases/view/30441) | DEVIATION | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-EXP-09 | C38887 | [open](https://shopview.testrail.io/index.php?/cases/view/38887) | VIU-Observed-PASS | notes | `evidence/tu/exports/exports-log.jsonl` |
| TU-LOC-01 | C30442 | [open](https://shopview.testrail.io/index.php?/cases/view/30442) | DEVIATION | expected, notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LOC-02 | C30443 | [open](https://shopview.testrail.io/index.php?/cases/view/30443) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LOC-03 | C30444 | [open](https://shopview.testrail.io/index.php?/cases/view/30444) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LOC-04 | C30445 | [open](https://shopview.testrail.io/index.php?/cases/view/30445) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-LOC-05 | C30446 | [open](https://shopview.testrail.io/index.php?/cases/view/30446) | DEVIATION | notes | `evidence/perms/singleloc-pv-tu.json, evidence/perms/singleloc2-technician-utilization.png` |
| TU-LOC-06 | C38915 | [open](https://shopview.testrail.io/index.php?/cases/view/38915) | DEVIATION | expected, notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-VIS-01 | C30447 | [open](https://shopview.testrail.io/index.php?/cases/view/30447) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-VIS-02 | C30448 | [open](https://shopview.testrail.io/index.php?/cases/view/30448) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-COL-01 | C38859 | [open](https://shopview.testrail.io/index.php?/cases/view/38859) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-API-01 | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |
| TU-API-02 | C30450 | [open](https://shopview.testrail.io/index.php?/cases/view/30450) | VIU-Observed-PASS | notes | `evidence/tu/ui/tu-ui-1.json, tu-ui-2.json, tu-ui-3.json, tu-coltoggle.json` |

## WHAT WAS SEEDED, AND THAT IT WAS CLEANED UP (Standing Rules 5 / 14)

| Seeded | How | Removed |
|---|---|---|
| Clocked internal time for 3 technicians at BOTH locations, so the empty This-Month Technician Utilization view had rows, one technician had hours at two locations (the "Multiple" case), and one clock stayed OPEN | `POST /api/switch-user` to impersonate, then `POST /api/technician-tasks/department-clock-in {department_id}` (snake_case) → 201, `.../department-clock-out {task_id, description}` → 201, with `POST /api/iam/change-location` between locations | **Yes** — the open clock was closed (201) and all 4 records deleted with `DELETE /api/technician-tasks/{id}` → 204 each; the This-Month view is empty again |
| Catalogue part + inventory part `ZZAUTOTEST-CORE-1` (5 on hand), then a $25 core attached to it, to settle the core-exclusion rule | `POST /api/parts-catalogue/add-catalogue-part` → 201, `POST /api/inventory/parts/create` (bins take `{id, quantity, isDefault}`) → 201, `POST /api/inventory/parts/change {core:true, core_charge:25}` → 201 | **Yes** — inventory part deleted (201), catalogue part removed (200), search returns nothing |
| A one-location reports user, to settle the Location-filter visibility question | reassigned an existing Technician to Sales Representative + a single workplace, impersonated, observed, restored | **Yes** — restored to Technician / Lethbridge and re-read to confirm |
| Nothing else. The labour-rate probes returned 201 but did **not** persist, so the labour configuration is byte-identical (the one default is still "CP RAIL FLEET RATE" at 145) | — | n/a |

## HONEST LIMITS OF THIS BATCH

1. **The branch is not final** — every verdict is provisional and queued.
2. **Four assertions are environment-blocked** (the em-dash Est. Lost Labor family and QuickBooks) — characterised above, not hidden.
3. **Eleven PASS rows carry a stated narrower limit** inside their `observed` text (for example: the 366-day cap was driven through the API rather than from the calendar UI; the return SOURCE records could not be cross-read because `/api/returns` 404s; no fractional Units Sold exists on this org; the PDF logo fallback could not be exercised because this organisation has an uploaded logo). Each of those limits is written on the row and carries its own re-check obligation — none of them is presented as full coverage.
4. **The epic was not re-read** (Tier-2, Rule 37) and the tech plan was not re-fetched.
5. Nothing was written to TestRail. Every proposed change is staged in `STAGED-CHANGES.md`.
