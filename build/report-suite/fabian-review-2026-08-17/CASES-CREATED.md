# CASES CREATED / UPDATED — Report Suite Fabian design-review (2026-08-17)

This lists EVERY case created or updated across BOTH the prior worker's pass and this
completion pass. Every write byte-verified (re-GET, field-by-field, untouched fields ==
snapshot). Build verification deferred by instruction — every touched case carries
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (Standing Rule 69)
and a full documented-source provenance line with read-dates.

## TOTALS
- **NEW cases created: 27** (18 prior + 9 this pass).
- **Existing cases updated: 54** (1 prior + 53 this pass).
- Foreign cases (Vladimir Tomovic, ids 1): 12 — **0 touched**.
- Live group 4281: **ours 507 / foreign 12 / live 519**.

---

# PRIOR PASS (18 new + 1 update — Adjustments column + Locked Estimates tooltip)

## New — Adjustments money column (WIP/SBC/SBR, SV-9280/9281/9282)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| WIP-ADJ-01 | C43814 | Adjustments column appears in the fixed column order and in the first-visit set | https://shopview.testrail.io/index.php?/cases/view/43814 |
| WIP-ADJ-02 | C43815 | Adjustments is the signed net of work-order-level fees and discounts | https://shopview.testrail.io/index.php?/cases/view/43815 |
| WIP-ADJ-03 | C43816 | A work-order fee or discount moves only Adjustments and Total | https://shopview.testrail.io/index.php?/cases/view/43816 |
| WIP-ADJ-04 | C43817 | A row's Total is Earned plus Remaining plus Adjustments | https://shopview.testrail.io/index.php?/cases/view/43817 |
| WIP-ADJ-05 | C43818 | The summary strip shows seven figures and no Adjustments figure | https://shopview.testrail.io/index.php?/cases/view/43818 |
| WIP-ADJ-06 | C43819 | The Totals row sums the Adjustments column across the tab's visible jobs | https://shopview.testrail.io/index.php?/cases/view/43819 |
| WIP-ADJ-07 | C43820 | Earlier as-of days show no Adjustments value because history is not backfilled | https://shopview.testrail.io/index.php?/cases/view/43820 |
| WIP-ADJ-08 | C43821 | Completed tab: Earned equals Total minus Adjustments, Remaining $0.00 | https://shopview.testrail.io/index.php?/cases/view/43821 |
| SBC-ADJ-01 | C43822 | Adjustments column appears between Shop Supplies and Margin | https://shopview.testrail.io/index.php?/cases/view/43822 |
| SBC-ADJ-02 | C43823 | Adjustments is the signed net of invoice-level fees and discounts | https://shopview.testrail.io/index.php?/cases/view/43823 |
| SBC-ADJ-03 | C43824 | Every row ties out once Adjustments is included | https://shopview.testrail.io/index.php?/cases/view/43824 |
| SBC-ADJ-04 | C43825 | The column selector lists ten toggleable columns including Adjustments | https://shopview.testrail.io/index.php?/cases/view/43825 |
| SBC-ADJ-05 | C43826 | Both CSV exports include the Adjustments column in the specified position | https://shopview.testrail.io/index.php?/cases/view/43826 |
| SBC-ADJ-06 | C43827 | Each invoice detail row shows a per-invoice Adjustments value | https://shopview.testrail.io/index.php?/cases/view/43827 |
| SBR-ADJ-01 | C43828 | Adjustments column appears between Parts Margin and Margin | https://shopview.testrail.io/index.php?/cases/view/43828 |
| SBR-ADJ-02 | C43829 | Adjustments is the signed net of invoice-level fees and discounts | https://shopview.testrail.io/index.php?/cases/view/43829 |
| SBR-ADJ-03 | C43830 | Every row ties out once Adjustments is included | https://shopview.testrail.io/index.php?/cases/view/43830 |
| SBR-ADJ-04 | C43831 | The eight toggleable metric columns include Adjustments | https://shopview.testrail.io/index.php?/cases/view/43831 |

## Updated — Locked Estimates tooltip
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| WIP-SUM-07 | C30493 | Each summary figure's information icon reveals its plain explanation | https://shopview.testrail.io/index.php?/cases/view/30493 |

---

# THIS PASS (53 updates + 9 new — the 7 staged Loom items)

## Item 1 — "Inv. Hrs" -> "Labor Delta" rename (SV-9071), simple label-swap cases (17)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| SBC-CALC-04 | C30152 | Labor Delta is never blank: no-labor rows and near-zero values both show 0.0 | https://shopview.testrail.io/index.php?/cases/view/30152 |
| SBC-EXP-04 | C30162 | CSV formats: Margin % plain; dates mm-dd-yyyy; currency plain; no color | https://shopview.testrail.io/index.php?/cases/view/30162 |
| SBR-TREE-05 | C30221 | Expanding a rep loads its invoices on demand with a row-level spinner | https://shopview.testrail.io/index.php?/cases/view/30221 |
| SBR-BADGE-01 | C30226 | Status badge between Customer and Labor Delta; every detail row shows mapped text | https://shopview.testrail.io/index.php?/cases/view/30226 |
| SBR-CALC-02 | C30230 | Labor Delta: +green, -red, 0.0 default on every row; rollups from unrounded deltas | https://shopview.testrail.io/index.php?/cases/view/30230 |
| SBR-CALC-03 | C30231 | No-labor-no-time invoices show 0.0; clocked-unbilled work shows negative | https://shopview.testrail.io/index.php?/cases/view/30231 |
| SBR-CALC-08 | C30236 | Half-up rounding at each precision; totals may differ by one last-decimal unit | https://shopview.testrail.io/index.php?/cases/view/30236 |
| SBR-EXP-12 | C30287 | CSV cells: plain numbers, signed Labor Delta, empty Margin %, (Inactive) | https://shopview.testrail.io/index.php?/cases/view/30287 |
| SBR-EXP-16 | C30291 | An empty-data export still generates with zeroed Summary PDF totals | https://shopview.testrail.io/index.php?/cases/view/30291 |
| SBR-VIS-02 | C30306 | Dark mode: page, toolbar, table; Totals switch to dark equivalents | https://shopview.testrail.io/index.php?/cases/view/30306 |
| SBR-VIS-05 | C30309 | The subdued grey of the (N) count and (Inactive) tag meets WCAG AA contrast | https://shopview.testrail.io/index.php?/cases/view/30309 |
| WIP-CALC-08 | C30481 | Labor Delta shows quoted minus worked hours; signed to one decimal | https://shopview.testrail.io/index.php?/cases/view/30481 |
| WIP-TOT-02 | C30495 | The Totals row sums each visible money column and the Labor Delta column | https://shopview.testrail.io/index.php?/cases/view/30495 |
| WIP-EXP-03 | C30512 | Downloaded money and Labor Delta values keep the on-screen formats | https://shopview.testrail.io/index.php?/cases/view/30512 |
| WIP-EXP-04 | C30513 | Labor Delta green/red coloring appears on screen and in the PDF; not the CSV | https://shopview.testrail.io/index.php?/cases/view/30513 |
| WIP-VIS-07 | C30525 | In dark mode every table; strip; link and coloring stays legible | https://shopview.testrail.io/index.php?/cases/view/30525 |
| SBR-CALC-09 | C38894 | A clock-record edit after invoicing updates Labor Delta; billed money stays put | https://shopview.testrail.io/index.php?/cases/view/38894 |

## Item 1 — Labor Delta rename + Adjustments fold-in / delicate heading cases (21)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| SBC-TREE-04 | C30124 | Expanding an asset reveals its invoice rows with number link and date | https://shopview.testrail.io/index.php?/cases/view/30124 |
| SBC-SORT-01 | C30142 | All columns sortable except chevron; text alphabetical, numbers by value | https://shopview.testrail.io/index.php?/cases/view/30142 |
| SBC-CALC-01 | C30149 | Financial columns run in the specified order with Subtotal and Margin rules | https://shopview.testrail.io/index.php?/cases/view/30149 |
| SBC-COL-01 | C30156 | Column selector is its own toolbar button with ten toggles all on | https://shopview.testrail.io/index.php?/cases/view/30156 |
| SBC-EXP-03 | C30161 | Expanded View CSV: column order, blank-cell rules, and the Locations line | https://shopview.testrail.io/index.php?/cases/view/30161 |
| SBC-EXP-11 | C30169 | Expanded CSV body: column set and order, Customer/Asset/Invoice tree, blanks | https://shopview.testrail.io/index.php?/cases/view/30169 |
| SBC-EXP-16 | C38856 | Summary and Expanded View downloads exist for both PDF and CSV | https://shopview.testrail.io/index.php?/cases/view/38856 |
| SBC-CALC-03 | C30151 | Labor Delta heading is verbatim; value shows +green / -red / 0.0 on every row | https://shopview.testrail.io/index.php?/cases/view/30151 |
| SBR-ROW-02 | C30218 | Row layout: 13 columns in order, blanks in position, bold summary rows | https://shopview.testrail.io/index.php?/cases/view/30218 |
| SBR-CALC-07 | C30235 | Negative dollar values render in accounting parentheses; money columns only | https://shopview.testrail.io/index.php?/cases/view/30235 |
| SBR-SORT-01 | C30241 | All nine financial columns are sortable | https://shopview.testrail.io/index.php?/cases/view/30241 |
| SBR-COL-01 | C30265 | Column selector: eight metric toggles; five always-on columns cannot be hidden | https://shopview.testrail.io/index.php?/cases/view/30265 |
| SBR-CALC-01 | C30229 | Labor Delta is hours invoiced minus hours worked; half-up to one decimal | https://shopview.testrail.io/index.php?/cases/view/30229 |
| SBR-EXP-04 | C30279 | Expanded View PDF: one page-block per rep with its own totals; no grand | https://shopview.testrail.io/index.php?/cases/view/30279 |
| SBR-EXP-03 | C30278 | Summary PDF: one rolled-up row per rep with a recomputed grand totals row | https://shopview.testrail.io/index.php?/cases/view/30278 |
| SBR-EXP-10 | C30285 | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep | https://shopview.testrail.io/index.php?/cases/view/30285 |
| SBR-EXP-11 | C30286 | Expanded CSV: file name, verbatim headers, one row per invoice | https://shopview.testrail.io/index.php?/cases/view/30286 |
| SBR-LOC-05 | C38913 | Location column: shown to any multi-location user; toggleable; rep rows Multiple | https://shopview.testrail.io/index.php?/cases/view/38913 |
| WIP-COL-01 | C30466 | With all toggleable columns on, the fixed column order and alignment hold | https://shopview.testrail.io/index.php?/cases/view/30466 |
| WIP-PERS-02 | C30507 | Toggling columns never reorders them (Total always last) | https://shopview.testrail.io/index.php?/cases/view/30507 |
| WIP-COL-02 | C30467 | First visit shows the default columns; the rest are in the column selector | https://shopview.testrail.io/index.php?/cases/view/30467 |

## Item 6 — WIP single "as of" date reconciliation (13)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| WIP-FLT-04 | C30501 | The "as of" date is a single day: defaults to today, capped at today, no range | https://shopview.testrail.io/index.php?/cases/view/30501 |
| WIP-FLT-05 | C30502 | The "as of" date shows the end-of-day position and reloads when changed | https://shopview.testrail.io/index.php?/cases/view/30502 |
| WIP-PERS-03 | C30508 | Remembers the "as of" date, filter selections, location, columns | https://shopview.testrail.io/index.php?/cases/view/30508 |
| WIP-EXP-02 | C30511 | Downloads keep shown columns, honor filters, include the tab's Totals row | https://shopview.testrail.io/index.php?/cases/view/30511 |
| WIP-EXP-10 | C38918 | An over-cap Work In Progress download is refused with the too-large message | https://shopview.testrail.io/index.php?/cases/view/38918 |
| WIP-PERS-05 | C43551 | A hand-made Location column choice is remembered like any other column | https://shopview.testrail.io/index.php?/cases/view/43551 |
| WIP-SCOPE-01 | C30456 | Every open service WO at a selected location appears in the report | https://shopview.testrail.io/index.php?/cases/view/30456 |
| WIP-SCOPE-02 | C30457 | Invoiced; Paid and part-sale work orders never appear | https://shopview.testrail.io/index.php?/cases/view/30457 |
| WIP-SCOPE-04 | C30459 | While loading the standard indicator shows and old rows stay until data | https://shopview.testrail.io/index.php?/cases/view/30459 |
| WIP-SCOPE-05 | C30460 | No qualifying work orders: every tab shows the no-data message and no Totals | https://shopview.testrail.io/index.php?/cases/view/30460 |
| WIP-PLACE-01 | C30462 | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | https://shopview.testrail.io/index.php?/cases/view/30462 |
| WIP-PLACE-03 | C30464 | Approved started-boundary: time or part received vs neither decides the tab | https://shopview.testrail.io/index.php?/cases/view/30464 |
| WIP-COL-09 | C43557 | The WO # is plain text, not a link, without Work Order permission | https://shopview.testrail.io/index.php?/cases/view/43557 |

## Item 5 — VIN-alone asset display, "(no unit #)" placeholder dropped (1)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| WIP-COL-05 | C30470 | The Asset cell shows the Unit # in bold with the VIN underneath, VIN alone when no unit | https://shopview.testrail.io/index.php?/cases/view/30470 |

## Cross-case contradiction fix — SBR money-column labels + Adjustments tie-out (1)
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| SBR-CALC-06 | C30234 | Money columns use the standardized labels and definitions | https://shopview.testrail.io/index.php?/cases/view/30234 |

## Items 7 / 2 / 3 / 4 — new cases (9)
Item 7 = CSV filter-summary metadata, one per report (SV-9283). Items 3/4/2 = Loom-sourced
shell visual behaviours (SV-8593), exact styling marked "confirm live" (design artifact
unfetchable this pass).
| Internal ID | TestRail | Title | Link |
|---|---|---|---|
| SBC-EXP-18 | C43832 | CSV export repeats the PDF header's Product Type and Locations filter lines | https://shopview.testrail.io/index.php?/cases/view/43832 |
| SBR-EXP-17 | C43833 | CSV export repeats the PDF header's Product Type, status and Locations lines | https://shopview.testrail.io/index.php?/cases/view/43833 |
| PV-EXP-13 | C43834 | CSV export repeats the PDF header's date range and Locations filter lines | https://shopview.testrail.io/index.php?/cases/view/43834 |
| TU-EXP-11 | C43835 | CSV export repeats the PDF header's technician and Locations filter lines | https://shopview.testrail.io/index.php?/cases/view/43835 |
| WIP-EXP-11 | C43836 | CSV export repeats the PDF header's as-of date and Locations lines | https://shopview.testrail.io/index.php?/cases/view/43836 |
| IV-EXP-11 | C43837 | CSV export shows the PDF header's as-of date and Locations filter lines | https://shopview.testrail.io/index.php?/cases/view/43837 |
| WIP-VIS-08 | C43838 | Active view tab shows the selected-tab highlight (amber glow) when clicked | https://shopview.testrail.io/index.php?/cases/view/43838 |
| SBR-VIS-06 | C43839 | Long column header labels wrap to two lines instead of being truncated | https://shopview.testrail.io/index.php?/cases/view/43839 |
| SBC-VIS-04 | C43840 | A group/summary row presents its rolled-up totals as an inline math strip | https://shopview.testrail.io/index.php?/cases/view/43840 |
