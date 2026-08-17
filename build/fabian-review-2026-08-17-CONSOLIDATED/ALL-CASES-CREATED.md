# ALL CASES CREATED AND UPDATED — Fabian design-review reconciliation (2026-08-17)

Single cross-project index of every test case **created** and every test case **updated** in the
2026-08-17 Fabian design-review authoring passes on **Schedule**, **Report Suite** and **Filters**.
Every row: internal ID · title · TestRail C-id · clickable link.

Sourced strictly from each project's completion deliverables:
- Schedule — reconstructed from `build/schedule/fabian-review-2026-08-17/` (this project has **no**
  `CASES-CREATED.md`; the created list is rebuilt from `oplog-add.jsonl`, the updated list from
  `oplog-v30-updates.jsonl`, and titles from `build/schedule/testrail-id-map.csv` + the generator).
- Report Suite — `build/report-suite/fabian-review-2026-08-17/CASES-CREATED.md`.
- Filters — `build/filters/fabian-review-2026-08-17/CASES-CREATED.md`.

**Build verification was deferred by instruction** on all three passes — the app was never opened, and
every touched case carries `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`
(Standing Rule 69) plus a documented-source provenance line. All writes were byte-verified (re-GET,
field-by-field). No foreign (other-author) case was touched on any project.

---

## GRAND TOTALS

| Project | Cases CREATED | Cases UPDATED |
|---|---:|---:|
| Schedule | 19 | 28 |
| Report Suite | 27 | 54 |
| Filters | 9 | 60 |
| **OVERALL** | **55** | **142** |

- **Overall created: 55** (Schedule 19 + Report Suite 27 + Filters 9).
- **Overall updated: 142** (Schedule 28 + Report Suite 54 + Filters 60).

---

# 1 · SCHEDULE (group 4254)

Spec Confluence **v30** · epic **SV-8685** (39 children). Ours 195 / live 195 / foreign 0.
Reconstructed — no `CASES-CREATED.md` existed for Schedule; every C-id below is taken from the pass's
op-logs (each logged HTTP 200 + byte-verify), so none is unverified.

## 1a · Schedule — CREATED (19)  [C43795–C43813]

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SCH-START-09 | A day's hours resolve tech then shop then a 7am-7pm default used everywhere | C43795 | https://shopview.testrail.io/index.php?/cases/view/43795 |
| SCH-DND-10 | A shift is sized by remaining hours: estimate minus hours already clocked | C43796 | https://shopview.testrail.io/index.php?/cases/view/43796 |
| SCH-DND-11 | Below 0.25h left you are told nothing remains; shifts never resize later | C43797 | https://shopview.testrail.io/index.php?/cases/view/43797 |
| SCH-CONF-08 | One hours source per shift; neither set means no hours conflict; Adjust clamps | C43798 | https://shopview.testrail.io/index.php?/cases/view/43798 |
| SCH-UNAS-01 | Dropping a work order on a department header row parks it as one shift | C43799 | https://shopview.testrail.io/index.php?/cases/view/43799 |
| SCH-UNAS-02 | An unassigned block is a fixed-width chip, excluded from capacity and conflicts | C43800 | https://shopview.testrail.io/index.php?/cases/view/43800 |
| SCH-UNAS-03 | Assigning a parked shift to a technician, spreading it if it will not fit | C43801 | https://shopview.testrail.io/index.php?/cases/view/43801 |
| SCH-SPREAD-12 | Spread selector: six options with resolved hours, and a new Today only | C43802 | https://shopview.testrail.io/index.php?/cases/view/43802 |
| SCH-SPREAD-13 | When the scope fits one day the spread hides the selector for an Hours field | C43803 | https://shopview.testrail.io/index.php?/cases/view/43803 |
| SCH-SPREAD-14 | Spread: Until a date and Specific hours derive each other; summary label | C43804 | https://shopview.testrail.io/index.php?/cases/view/43804 |
| SCH-SPREAD-15 | Spread skips weekends only; Undo removes the whole generated series | C43805 | https://shopview.testrail.io/index.php?/cases/view/43805 |
| SCH-WOL-07 | Work order card shows the vehicle and clocked hours; vehicle joins the search | C43806 | https://shopview.testrail.io/index.php?/cases/view/43806 |
| SCH-WOL-08 | Hovering a work order card opens a read-only peek panel of its lines | C43807 | https://shopview.testrail.io/index.php?/cases/view/43807 |
| SCH-MODAL-09 | Shift modal shows Time Logged (actual vs estimate) per line, not only rolled up | C43808 | https://shopview.testrail.io/index.php?/cases/view/43808 |
| SCH-MODAL-10 | Shift modal: start, end and hours typed to the minute resolve each other | C43809 | https://shopview.testrail.io/index.php?/cases/view/43809 |
| SCH-CAP-05 | Clicking a capacity bar opens a per-technician detail modal; tooltip truncates | C43810 | https://shopview.testrail.io/index.php?/cases/view/43810 |
| SCH-REAS-08 | The empty-cell menu's first item Assign work order schedules an existing order | C43811 | https://shopview.testrail.io/index.php?/cases/view/43811 |
| SCH-DAY-08 | Day view has a zoom control (pixels per hour); blocks and now line rescale | C43812 | https://shopview.testrail.io/index.php?/cases/view/43812 |
| SCH-DAY-09 | A block clipped by the visible day-view edge shows a continuation chevron | C43813 | https://shopview.testrail.io/index.php?/cases/view/43813 |

## 1b · Schedule — UPDATED (28)

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SCH-DND-01 | Dropping a single-line work order creates a shift with no scope picker | C29955 | https://shopview.testrail.io/index.php?/cases/view/29955 |
| SCH-DND-04 | A job over the technician's daily hours opens the spread step | C29958 | https://shopview.testrail.io/index.php?/cases/view/29958 |
| SCH-START-03 | With neither technician hours nor business hours set, a 7:00 AM default applies | C29971 | https://shopview.testrail.io/index.php?/cases/view/29971 |
| SCH-START-07 | Dragging an unassigned shift onto a technician assigns and re-sizes it | C29975 | https://shopview.testrail.io/index.php?/cases/view/29975 |
| SCH-SPREAD-03 | How-much selector defaults to Full estimate; preset amounts apply at once | C29979 | https://shopview.testrail.io/index.php?/cases/view/29979 |
| SCH-SPREAD-04 | 'Until a date…' reveals a single finish-by date field | C29980 | https://shopview.testrail.io/index.php?/cases/view/29980 |
| SCH-SPREAD-05 | 'Specific hours…' reveals an hours stepper | C29981 | https://shopview.testrail.io/index.php?/cases/view/29981 |
| SCH-SPREAD-07 | Spread sizes shifts to the tech's hours and skips weekends only | C29983 | https://shopview.testrail.io/index.php?/cases/view/29983 |
| SCH-SPREAD-08 | Spread preview: '{N} shifts / {total}h' summary, expandable week-by-week | C29984 | https://shopview.testrail.io/index.php?/cases/view/29984 |
| SCH-WOL-02 | Work order card shows number, hours, customer, unit, vehicle, and lead tech | C29937 | https://shopview.testrail.io/index.php?/cases/view/29937 |
| SCH-WOL-04 | 'Search work orders' matches number, customer, unit, vehicle, and technician | C29939 | https://shopview.testrail.io/index.php?/cases/view/29939 |
| SCH-MODAL-02 | Scheduled date, start, end and hours can be typed to the minute; 15-min dropdown is a shortcut | C30009 | https://shopview.testrail.io/index.php?/cases/view/30009 |
| SCH-MODAL-03 | The modal shows the technician and time logged vs estimate, per line and for the shift | C30010 | https://shopview.testrail.io/index.php?/cases/view/30010 |
| SCH-CAP-04 | Hovering a capacity bar shows a truncated breakdown with 'click to view all' | C30033 | https://shopview.testrail.io/index.php?/cases/view/30033 |
| SCH-DAY-01 | Day view auto-scrolls to the working-day start; manual scrolling stands | C30001 | https://shopview.testrail.io/index.php?/cases/view/30001 |
| SCH-DAY-04 | Dragging a shift sideways moves its start in 15-min steps with a live time chip | C30004 | https://shopview.testrail.io/index.php?/cases/view/30004 |
| SCH-DAY-05 | Dragging a shift's edge resizes it in 15-min steps with a live time chip | C30005 | https://shopview.testrail.io/index.php?/cases/view/30005 |
| SCH-CONF-02 | Working-day conflict: a shift outside the tech's working days is flagged | C30024 | https://shopview.testrail.io/index.php?/cases/view/30024 |
| SCH-CONF-03 | Before-hours and after-hours shifts are flagged against the tech's hours | C30025 | https://shopview.testrail.io/index.php?/cases/view/30025 |
| SCH-EDGE-05 | Shop closures do NOT block the spread - shifts can land on closure days | C30089 | https://shopview.testrail.io/index.php?/cases/view/30089 |
| SCH-PANEL-01 | Panel button sits left of Today and its tooltip names what it will do | C43582 | https://shopview.testrail.io/index.php?/cases/view/43582 |
| SCH-PANEL-02 | Panel button hides the left panel and the grid widens into the space | C43583 | https://shopview.testrail.io/index.php?/cases/view/43583 |
| SCH-PANEL-03 | What you had set up in the left panel survives hiding and showing it | C43584 | https://shopview.testrail.io/index.php?/cases/view/43584 |
| SCH-PANEL-04 | On a narrow window the panel button still works and your choice holds | C43585 | https://shopview.testrail.io/index.php?/cases/view/43585 |
| SCH-PANEL-05 | Menus and pop-up windows reposition when the left panel is hidden | C43586 | https://shopview.testrail.io/index.php?/cases/view/43586 |
| SCH-PANEL-06 | Hiding the panel lasts for the rest of your sign-in but is not saved | C43587 | https://shopview.testrail.io/index.php?/cases/view/43587 |
| SCH-NAV-07 | The department header row doubles as that department's unassigned lane | C29931 | https://shopview.testrail.io/index.php?/cases/view/29931 |
| SCH-REAS-03 | Left-click empty grid space opens a menu with 'Assign work order' first | C30054 | https://shopview.testrail.io/index.php?/cases/view/30054 |

---

# 2 · REPORT SUITE (group 4281)

Specs SBC **v20** / SBR **v22** / PV **v10** / TU **v9** / WIP **v21** / IV **v10** · epic **SV-8582**
(114 children). Ours 507 / live 519 / foreign 12 (Vladimir Tomovic, id 1 — 0 touched).
Full source: `build/report-suite/fabian-review-2026-08-17/CASES-CREATED.md`.

## 2a · Report Suite — CREATED (27)  [C43814–C43840]

**Prior pass (18) — Adjustments money column (WIP/SBC/SBR, SV-9280/9281/9282)**

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| WIP-ADJ-01 | Adjustments column appears in the fixed column order and in the first-visit set | C43814 | https://shopview.testrail.io/index.php?/cases/view/43814 |
| WIP-ADJ-02 | Adjustments is the signed net of work-order-level fees and discounts | C43815 | https://shopview.testrail.io/index.php?/cases/view/43815 |
| WIP-ADJ-03 | A work-order fee or discount moves only Adjustments and Total | C43816 | https://shopview.testrail.io/index.php?/cases/view/43816 |
| WIP-ADJ-04 | A row's Total is Earned plus Remaining plus Adjustments | C43817 | https://shopview.testrail.io/index.php?/cases/view/43817 |
| WIP-ADJ-05 | The summary strip shows seven figures and no Adjustments figure | C43818 | https://shopview.testrail.io/index.php?/cases/view/43818 |
| WIP-ADJ-06 | The Totals row sums the Adjustments column across the tab's visible jobs | C43819 | https://shopview.testrail.io/index.php?/cases/view/43819 |
| WIP-ADJ-07 | Earlier as-of days show no Adjustments value because history is not backfilled | C43820 | https://shopview.testrail.io/index.php?/cases/view/43820 |
| WIP-ADJ-08 | Completed tab: Earned equals Total minus Adjustments, Remaining $0.00 | C43821 | https://shopview.testrail.io/index.php?/cases/view/43821 |
| SBC-ADJ-01 | Adjustments column appears between Shop Supplies and Margin | C43822 | https://shopview.testrail.io/index.php?/cases/view/43822 |
| SBC-ADJ-02 | Adjustments is the signed net of invoice-level fees and discounts | C43823 | https://shopview.testrail.io/index.php?/cases/view/43823 |
| SBC-ADJ-03 | Every row ties out once Adjustments is included | C43824 | https://shopview.testrail.io/index.php?/cases/view/43824 |
| SBC-ADJ-04 | The column selector lists ten toggleable columns including Adjustments | C43825 | https://shopview.testrail.io/index.php?/cases/view/43825 |
| SBC-ADJ-05 | Both CSV exports include the Adjustments column in the specified position | C43826 | https://shopview.testrail.io/index.php?/cases/view/43826 |
| SBC-ADJ-06 | Each invoice detail row shows a per-invoice Adjustments value | C43827 | https://shopview.testrail.io/index.php?/cases/view/43827 |
| SBR-ADJ-01 | Adjustments column appears between Parts Margin and Margin | C43828 | https://shopview.testrail.io/index.php?/cases/view/43828 |
| SBR-ADJ-02 | Adjustments is the signed net of invoice-level fees and discounts | C43829 | https://shopview.testrail.io/index.php?/cases/view/43829 |
| SBR-ADJ-03 | Every row ties out once Adjustments is included | C43830 | https://shopview.testrail.io/index.php?/cases/view/43830 |
| SBR-ADJ-04 | The eight toggleable metric columns include Adjustments | C43831 | https://shopview.testrail.io/index.php?/cases/view/43831 |

**This pass (9) — CSV filter-summary metadata (item 7, SV-9283) + Loom visual shell cases (items 2/3/4, SV-8593)**

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SBC-EXP-18 | CSV export repeats the PDF header's Product Type and Locations filter lines | C43832 | https://shopview.testrail.io/index.php?/cases/view/43832 |
| SBR-EXP-17 | CSV export repeats the PDF header's Product Type, status and Locations lines | C43833 | https://shopview.testrail.io/index.php?/cases/view/43833 |
| PV-EXP-13 | CSV export repeats the PDF header's date range and Locations filter lines | C43834 | https://shopview.testrail.io/index.php?/cases/view/43834 |
| TU-EXP-11 | CSV export repeats the PDF header's technician and Locations filter lines | C43835 | https://shopview.testrail.io/index.php?/cases/view/43835 |
| WIP-EXP-11 | CSV export repeats the PDF header's as-of date and Locations lines | C43836 | https://shopview.testrail.io/index.php?/cases/view/43836 |
| IV-EXP-11 | CSV export shows the PDF header's as-of date and Locations filter lines | C43837 | https://shopview.testrail.io/index.php?/cases/view/43837 |
| WIP-VIS-08 | Active view tab shows the selected-tab highlight (amber glow) when clicked | C43838 | https://shopview.testrail.io/index.php?/cases/view/43838 |
| SBR-VIS-06 | Long column header labels wrap to two lines instead of being truncated | C43839 | https://shopview.testrail.io/index.php?/cases/view/43839 |
| SBC-VIS-04 | A group/summary row presents its rolled-up totals as an inline math strip | C43840 | https://shopview.testrail.io/index.php?/cases/view/43840 |

## 2b · Report Suite — UPDATED (54)

**Prior pass (1) — Locked Estimates tooltip**

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| WIP-SUM-07 | Each summary figure's information icon reveals its plain explanation | C30493 | https://shopview.testrail.io/index.php?/cases/view/30493 |

**This pass (53) — Labor Delta rename (item 1), WIP single "as of" date (item 6), VIN-alone (item 5), cross-case contradiction fix**

*Item 1 — "Inv. Hrs" → "Labor Delta" rename (SV-9071), simple label-swap cases (17)*

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SBC-CALC-04 | Labor Delta is never blank: no-labor rows and near-zero values both show 0.0 | C30152 | https://shopview.testrail.io/index.php?/cases/view/30152 |
| SBC-EXP-04 | CSV formats: Margin % plain; dates mm-dd-yyyy; currency plain; no color | C30162 | https://shopview.testrail.io/index.php?/cases/view/30162 |
| SBR-TREE-05 | Expanding a rep loads its invoices on demand with a row-level spinner | C30221 | https://shopview.testrail.io/index.php?/cases/view/30221 |
| SBR-BADGE-01 | Status badge between Customer and Labor Delta; every detail row shows mapped text | C30226 | https://shopview.testrail.io/index.php?/cases/view/30226 |
| SBR-CALC-02 | Labor Delta: +green, -red, 0.0 default on every row; rollups from unrounded deltas | C30230 | https://shopview.testrail.io/index.php?/cases/view/30230 |
| SBR-CALC-03 | No-labor-no-time invoices show 0.0; clocked-unbilled work shows negative | C30231 | https://shopview.testrail.io/index.php?/cases/view/30231 |
| SBR-CALC-08 | Half-up rounding at each precision; totals may differ by one last-decimal unit | C30236 | https://shopview.testrail.io/index.php?/cases/view/30236 |
| SBR-EXP-12 | CSV cells: plain numbers, signed Labor Delta, empty Margin %, (Inactive) | C30287 | https://shopview.testrail.io/index.php?/cases/view/30287 |
| SBR-EXP-16 | An empty-data export still generates with zeroed Summary PDF totals | C30291 | https://shopview.testrail.io/index.php?/cases/view/30291 |
| SBR-VIS-02 | Dark mode: page, toolbar, table; Totals switch to dark equivalents | C30306 | https://shopview.testrail.io/index.php?/cases/view/30306 |
| SBR-VIS-05 | The subdued grey of the (N) count and (Inactive) tag meets WCAG AA contrast | C30309 | https://shopview.testrail.io/index.php?/cases/view/30309 |
| WIP-CALC-08 | Labor Delta shows quoted minus worked hours; signed to one decimal | C30481 | https://shopview.testrail.io/index.php?/cases/view/30481 |
| WIP-TOT-02 | The Totals row sums each visible money column and the Labor Delta column | C30495 | https://shopview.testrail.io/index.php?/cases/view/30495 |
| WIP-EXP-03 | Downloaded money and Labor Delta values keep the on-screen formats | C30512 | https://shopview.testrail.io/index.php?/cases/view/30512 |
| WIP-EXP-04 | Labor Delta green/red coloring appears on screen and in the PDF; not the CSV | C30513 | https://shopview.testrail.io/index.php?/cases/view/30513 |
| WIP-VIS-07 | In dark mode every table; strip; link and coloring stays legible | C30525 | https://shopview.testrail.io/index.php?/cases/view/30525 |
| SBR-CALC-09 | A clock-record edit after invoicing updates Labor Delta; billed money stays put | C38894 | https://shopview.testrail.io/index.php?/cases/view/38894 |

*Item 1 — Labor Delta rename + Adjustments fold-in / delicate heading cases (21)*

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SBC-TREE-04 | Expanding an asset reveals its invoice rows with number link and date | C30124 | https://shopview.testrail.io/index.php?/cases/view/30124 |
| SBC-SORT-01 | All columns sortable except chevron; text alphabetical, numbers by value | C30142 | https://shopview.testrail.io/index.php?/cases/view/30142 |
| SBC-CALC-01 | Financial columns run in the specified order with Subtotal and Margin rules | C30149 | https://shopview.testrail.io/index.php?/cases/view/30149 |
| SBC-COL-01 | Column selector is its own toolbar button with ten toggles all on | C30156 | https://shopview.testrail.io/index.php?/cases/view/30156 |
| SBC-EXP-03 | Expanded View CSV: column order, blank-cell rules, and the Locations line | C30161 | https://shopview.testrail.io/index.php?/cases/view/30161 |
| SBC-EXP-11 | Expanded CSV body: column set and order, Customer/Asset/Invoice tree, blanks | C30169 | https://shopview.testrail.io/index.php?/cases/view/30169 |
| SBC-EXP-16 | Summary and Expanded View downloads exist for both PDF and CSV | C38856 | https://shopview.testrail.io/index.php?/cases/view/38856 |
| SBC-CALC-03 | Labor Delta heading is verbatim; value shows +green / -red / 0.0 on every row | C30151 | https://shopview.testrail.io/index.php?/cases/view/30151 |
| SBR-ROW-02 | Row layout: 13 columns in order, blanks in position, bold summary rows | C30218 | https://shopview.testrail.io/index.php?/cases/view/30218 |
| SBR-CALC-07 | Negative dollar values render in accounting parentheses; money columns only | C30235 | https://shopview.testrail.io/index.php?/cases/view/30235 |
| SBR-SORT-01 | All nine financial columns are sortable | C30241 | https://shopview.testrail.io/index.php?/cases/view/30241 |
| SBR-COL-01 | Column selector: eight metric toggles; five always-on columns cannot be hidden | C30265 | https://shopview.testrail.io/index.php?/cases/view/30265 |
| SBR-CALC-01 | Labor Delta is hours invoiced minus hours worked; half-up to one decimal | C30229 | https://shopview.testrail.io/index.php?/cases/view/30229 |
| SBR-EXP-04 | Expanded View PDF: one page-block per rep with its own totals; no grand | C30279 | https://shopview.testrail.io/index.php?/cases/view/30279 |
| SBR-EXP-03 | Summary PDF: one rolled-up row per rep with a recomputed grand totals row | C30278 | https://shopview.testrail.io/index.php?/cases/view/30278 |
| SBR-EXP-10 | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep | C30285 | https://shopview.testrail.io/index.php?/cases/view/30285 |
| SBR-EXP-11 | Expanded CSV: file name, verbatim headers, one row per invoice | C30286 | https://shopview.testrail.io/index.php?/cases/view/30286 |
| SBR-LOC-05 | Location column: shown to any multi-location user; toggleable; rep rows Multiple | C38913 | https://shopview.testrail.io/index.php?/cases/view/38913 |
| WIP-COL-01 | With all toggleable columns on, the fixed column order and alignment hold | C30466 | https://shopview.testrail.io/index.php?/cases/view/30466 |
| WIP-PERS-02 | Toggling columns never reorders them (Total always last) | C30507 | https://shopview.testrail.io/index.php?/cases/view/30507 |
| WIP-COL-02 | First visit shows the default columns; the rest are in the column selector | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 |

*Item 6 — WIP single "as of" date reconciliation (13)*

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| WIP-FLT-04 | The "as of" date is a single day: defaults to today, capped at today, no range | C30501 | https://shopview.testrail.io/index.php?/cases/view/30501 |
| WIP-FLT-05 | The "as of" date shows the end-of-day position and reloads when changed | C30502 | https://shopview.testrail.io/index.php?/cases/view/30502 |
| WIP-PERS-03 | Remembers the "as of" date, filter selections, location, columns | C30508 | https://shopview.testrail.io/index.php?/cases/view/30508 |
| WIP-EXP-02 | Downloads keep shown columns, honor filters, include the tab's Totals row | C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 |
| WIP-EXP-10 | An over-cap Work In Progress download is refused with the too-large message | C38918 | https://shopview.testrail.io/index.php?/cases/view/38918 |
| WIP-PERS-05 | A hand-made Location column choice is remembered like any other column | C43551 | https://shopview.testrail.io/index.php?/cases/view/43551 |
| WIP-SCOPE-01 | Every open service WO at a selected location appears in the report | C30456 | https://shopview.testrail.io/index.php?/cases/view/30456 |
| WIP-SCOPE-02 | Invoiced; Paid and part-sale work orders never appear | C30457 | https://shopview.testrail.io/index.php?/cases/view/30457 |
| WIP-SCOPE-04 | While loading the standard indicator shows and old rows stay until data | C30459 | https://shopview.testrail.io/index.php?/cases/view/30459 |
| WIP-SCOPE-05 | No qualifying work orders: every tab shows the no-data message and no Totals | C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 |
| WIP-PLACE-01 | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 |
| WIP-PLACE-03 | Approved started-boundary: time or part received vs neither decides the tab | C30464 | https://shopview.testrail.io/index.php?/cases/view/30464 |
| WIP-COL-09 | The WO # is plain text, not a link, without Work Order permission | C43557 | https://shopview.testrail.io/index.php?/cases/view/43557 |

*Item 5 — VIN-alone asset display, "(no unit #)" placeholder dropped (1)*

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| WIP-COL-05 | The Asset cell shows the Unit # in bold with the VIN underneath, VIN alone when no unit | C30470 | https://shopview.testrail.io/index.php?/cases/view/30470 |

*Cross-case contradiction fix — SBR money-column labels + Adjustments tie-out (1)*

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| SBR-CALC-06 | Money columns use the standardized labels and definitions | C30234 | https://shopview.testrail.io/index.php?/cases/view/30234 |

---

# 3 · FILTERS (group 4110)

Spec Confluence **v21** · epic **SV-8785** (33 children). Ours 124 / live 129 / foreign 5
(Ahtasham Amjad, id 7 — 0 touched). Full source:
`build/filters/fabian-review-2026-08-17/CASES-CREATED.md`.

## 3a · Filters — CREATED (9)  [C43841–C43849]

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| FLT-ASSIGN-01 | Assigned to me is a toggle chip with no arrow that turns on and off | C43841 | https://shopview.testrail.io/index.php?/cases/view/43841 |
| FLT-ASSIGN-02 | Turning Assigned to me on highlights the chip with no value and no clear X | C43842 | https://shopview.testrail.io/index.php?/cases/view/43842 |
| FLT-ASSIGN-03 | Assigned to me narrows to my work orders on top of the tab and filters | C43843 | https://shopview.testrail.io/index.php?/cases/view/43843 |
| FLT-BANNER-01 | A shared-link banner appears above the tabs when you open a filtered link | C43844 | https://shopview.testrail.io/index.php?/cases/view/43844 |
| FLT-TAB-WO-01 | The Work Orders tab pre-filters to Estimate, Approved and In Progress | C43845 | https://shopview.testrail.io/index.php?/cases/view/43845 |
| FLT-LAYOUT-01 | Filter chips sit in the toolbar row; on pages with no tabs, the title row | C43846 | https://shopview.testrail.io/index.php?/cases/view/43846 |
| FLT-LAYOUT-02 | Toolbar order is search, filter chips, icon actions, then the main button | C43847 | https://shopview.testrail.io/index.php?/cases/view/43847 |
| FLT-CHIP-07 | A selected chip shows an X to clear on hover and shortens a long value | C43848 | https://shopview.testrail.io/index.php?/cases/view/43848 |
| FLT-PANEL-01 | A filter panel opens under its chip and stays applied when you click away | C43849 | https://shopview.testrail.io/index.php?/cases/view/43849 |

## 3b · Filters — UPDATED / REPURPOSED (60)

| Internal ID | Title | C-id | Link |
|---|---|---|---|
| FLT-BAR-01 | Filter chips sit in the Work Orders toolbar row, not a separate filter bar | C29557 | https://shopview.testrail.io/index.php?/cases/view/29557 |
| FLT-BAR-02 | Work Orders shows three filter chips: Status, Assigned to me, Asset on Site | C29558 | https://shopview.testrail.io/index.php?/cases/view/29558 |
| FLT-BAR-03 | On the Estimates tab the Assigned to me and Asset on Site chips still show | C29559 | https://shopview.testrail.io/index.php?/cases/view/29559 |
| FLT-STAT-01 | Status chip opens a checkbox list of all nine statuses plus Clear selection | C29560 | https://shopview.testrail.io/index.php?/cases/view/29560 |
| FLT-CUST-01 | An entity filter opens a searchable panel with a list and Clear selection | C29566 | https://shopview.testrail.io/index.php?/cases/view/29566 |
| FLT-CUST-02 | Typing in an entity filter search narrows the list to matching values | C29567 | https://shopview.testrail.io/index.php?/cases/view/29567 |
| FLT-CUST-03 | Selected entity values show as removable pills and as ticks in the list | C29568 | https://shopview.testrail.io/index.php?/cases/view/29568 |
| FLT-CUST-04 | Clicking the X on an entity value pill removes just that one value | C29569 | https://shopview.testrail.io/index.php?/cases/view/29569 |
| FLT-CUST-05 | An entity filter narrows the table to records matching any selected value | C29570 | https://shopview.testrail.io/index.php?/cases/view/29570 |
| FLT-CUST-06 | Clear selection in an entity filter panel removes all its selected values | C29571 | https://shopview.testrail.io/index.php?/cases/view/29571 |
| FLT-CUST-07 | Clicking outside an entity filter panel closes it and keeps the selection | C29572 | https://shopview.testrail.io/index.php?/cases/view/29572 |
| FLT-CUST-08 | An entity filter search that matches nothing shows No matches | C29573 | https://shopview.testrail.io/index.php?/cases/view/29573 |
| FLT-CUST-09 | Selecting an entity value that has no records shows the empty state | C29574 | https://shopview.testrail.io/index.php?/cases/view/29574 |
| FLT-TECH-01 | Lead Technician is removed from Work Orders; its panel survives elsewhere | C29575 | https://shopview.testrail.io/index.php?/cases/view/29575 |
| FLT-TECH-02 | Typing in a technician filter search narrows the list to matching names | C29576 | https://shopview.testrail.io/index.php?/cases/view/29576 |
| FLT-TECH-03 | A technician filter shows only records where they are the lead technician | C29577 | https://shopview.testrail.io/index.php?/cases/view/29577 |
| FLT-TECH-04 | Clear selection in the technician filter panel removes all technicians | C29578 | https://shopview.testrail.io/index.php?/cases/view/29578 |
| FLT-TECH-05 | Clicking outside the technician filter panel closes it and keeps the selection | C29579 | https://shopview.testrail.io/index.php?/cases/view/29579 |
| FLT-TECH-06 | Selecting a technician who leads no records shows the empty state | C29580 | https://shopview.testrail.io/index.php?/cases/view/29580 |
| FLT-TECH-07 | A deactivated technician does not appear in the technician filter list | C29581 | https://shopview.testrail.io/index.php?/cases/view/29581 |
| FLT-ADV-01 | Service Advisor is removed from Work Orders; its panel survives elsewhere | C29582 | https://shopview.testrail.io/index.php?/cases/view/29582 |
| FLT-ADV-02 | Typing in an advisor filter search narrows the list to matching names | C29583 | https://shopview.testrail.io/index.php?/cases/view/29583 |
| FLT-ADV-03 | An advisor filter shows only records assigned to the selected advisors | C29584 | https://shopview.testrail.io/index.php?/cases/view/29584 |
| FLT-ADV-04 | Clear selection in the advisor filter panel removes all advisors | C29585 | https://shopview.testrail.io/index.php?/cases/view/29585 |
| FLT-ADV-05 | Clicking outside the advisor filter panel closes it and keeps the selection | C29586 | https://shopview.testrail.io/index.php?/cases/view/29586 |
| FLT-ADV-06 | Selecting an advisor with no assigned records shows the empty state | C29587 | https://shopview.testrail.io/index.php?/cases/view/29587 |
| FLT-ADV-07 | A deactivated advisor does not appear in the advisor filter list | C29588 | https://shopview.testrail.io/index.php?/cases/view/29588 |
| FLT-ASSET-01 | Asset on Site opens a single-select list with a checkmark on the chosen row | C29589 | https://shopview.testrail.io/index.php?/cases/view/29589 |
| FLT-ASSET-03 | Asset on Site is single-select: choosing the other option replaces the first | C29591 | https://shopview.testrail.io/index.php?/cases/view/29591 |
| FLT-CHIP-03 | There is no global Clear filters button; each filter is cleared on its own | C29597 | https://shopview.testrail.io/index.php?/cases/view/29597 |
| FLT-CHIP-04 | Clearing a filter does not clear a typed search, and vice versa | C29598 | https://shopview.testrail.io/index.php?/cases/view/29598 |
| FLT-CHIP-05 | Clear selection in one panel clears only that filter, leaving others | C29599 | https://shopview.testrail.io/index.php?/cases/view/29599 |
| FLT-CHIP-06 | Status and Asset on Site together show only work orders matching both | C29600 | https://shopview.testrail.io/index.php?/cases/view/29600 |
| FLT-COLL-01 | There is no control to collapse or hide the filter chips on any page | C29601 | https://shopview.testrail.io/index.php?/cases/view/29601 |
| FLT-COLL-02 | There is no remembered collapsed or expanded state, because there is no toggle | C29602 | https://shopview.testrail.io/index.php?/cases/view/29602 |
| FLT-COLL-03 | There is no collapsed-state indicator, because the chips are always shown | C29603 | https://shopview.testrail.io/index.php?/cases/view/29603 |
| FLT-COLL-04 | Active filters always keep filtering the table; there is no bar to collapse | C29604 | https://shopview.testrail.io/index.php?/cases/view/29604 |
| FLT-COLL-05 | Every page shows its filter chips with no toggle, whatever the filter count | C29605 | https://shopview.testrail.io/index.php?/cases/view/29605 |
| FLT-EMPTY-02 | The filtered empty state names the active filters and search and clears each | C29607 | https://shopview.testrail.io/index.php?/cases/view/29607 |
| FLT-TAB-01 | The All tab shows the three Work Orders filter chips, all working | C29608 | https://shopview.testrail.io/index.php?/cases/view/29608 |
| FLT-TAB-02 | Estimates tab: Assigned to me and Asset on Site chips work; Status pre-set | C29609 | https://shopview.testrail.io/index.php?/cases/view/29609 |
| FLT-TAB-03 | Completed tab: Assigned to me and Asset on Site chips work; Status pre-set | C29610 | https://shopview.testrail.io/index.php?/cases/view/29610 |
| FLT-TAB-04 | The My Work Orders tab is gone; the Assigned to me chip does its job | C29611 | https://shopview.testrail.io/index.php?/cases/view/29611 |
| FLT-TAB-05 | A Status choice is kept while you switch tabs and returns on the All tab | C29612 | https://shopview.testrail.io/index.php?/cases/view/29612 |
| FLT-PERS-01 | Leaving the page and returning restores your filter selections | C29613 | https://shopview.testrail.io/index.php?/cases/view/29613 |
| FLT-PERS-04 | A remembered filter value that was deleted is silently ignored | C29616 | https://shopview.testrail.io/index.php?/cases/view/29616 |
| FLT-MOB-01 | On a phone the toolbar splits into a tabs row, an action row and a chips row | C29621 | https://shopview.testrail.io/index.php?/cases/view/29621 |
| FLT-MOB-02 | On a phone each filter chip opens its own bottom sheet, not one combined drawer | C29622 | https://shopview.testrail.io/index.php?/cases/view/29622 |
| FLT-MOB-03 | On a phone, choices in a filter sheet apply only when you tap Apply filters | C29623 | https://shopview.testrail.io/index.php?/cases/view/29623 |
| FLT-MOB-04 | On a phone the same deferred-apply rule applies to every single filter sheet | C29624 | https://shopview.testrail.io/index.php?/cases/view/29624 |
| FLT-MOB-05 | On a phone, Assigned to me toggles on and off in the chips row with no sheet | C29625 | https://shopview.testrail.io/index.php?/cases/view/29625 |
| FLT-MOB-06 | On a phone a filter sheet appears over a dimmed page and closes on X or scrim | C29626 | https://shopview.testrail.io/index.php?/cases/view/29626 |
| FLT-MOB-07 | On a phone the Asset on Site sheet is a single-select list with a checkmark | C29627 | https://shopview.testrail.io/index.php?/cases/view/29627 |
| FLT-MOB-08 | On a phone active chips clear one at a time; there is no Clear filters button | C29628 | https://shopview.testrail.io/index.php?/cases/view/29628 |
| FLT-PERS-06 | Filters saved before the redesign carry over after the update | C38881 | https://shopview.testrail.io/index.php?/cases/view/38881 |
| FLT-RPTS-23 | The date-range panel offers set periods and a custom start and end range | C38882 | https://shopview.testrail.io/index.php?/cases/view/38882 |
| FLT-PSRCH-13 | Your typed search keeps working as you sort, page and leave and return | C38903 | https://shopview.testrail.io/index.php?/cases/view/38903 |
| FLT-PARTS-12 | Parts filters allow several choices and are cleared one filter at a time | C38907 | https://shopview.testrail.io/index.php?/cases/view/38907 |
| FLT-PARTS-14 | Parts and Reports filter chips share by link and work on a phone, no collapse | C43562 | https://shopview.testrail.io/index.php?/cases/view/43562 |
| FLT-COLL-06 | No collapse control exists even on a page that has only one filter | C43590 | https://shopview.testrail.io/index.php?/cases/view/43590 |

---

## Foreign cases (recorded, NOT touched — Standing Rule 38)

- **Report Suite:** 12 cases by Vladimir Tomovic (id 1) — C38919–C38923, C43567–C43573. 0 touched.
- **Filters:** 5 cases by Ahtasham Amjad (id 7) — C43576, C43577, C43578, C43579, C43580. Proven
  byte-identical start vs end. 0 touched.
- **Schedule:** 0 foreign cases (all 195 created_by 3).

## A note on Schedule reconstruction (honesty)

Schedule shipped no `CASES-CREATED.md`. Its created list (19) and updated list (28) above were rebuilt
from the pass's committed op-logs — `oplog-add.jsonl` (each row logs HTTP 200 + `MATCH 5 fields`) and
`oplog-v30-updates.jsonl` (each `VERIFIED_OK`) — with titles taken from `build/schedule/testrail-id-map.csv`
and the pass's generator. Every Schedule C-id here is a logged, byte-verified write, so none is marked
"verify". The completion report's own tally (19 created + 28 updated = 47 touched, suite 195) matches
this index exactly.
