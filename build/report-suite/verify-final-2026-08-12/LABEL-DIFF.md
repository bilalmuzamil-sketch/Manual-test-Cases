# LABEL DIFF — the build's labels against what our cases say

**PARTIAL — this pass was stood down at the 5-hour usage limit. Build `v3.7-4626299`, 12 Aug 2026.**

## Headline: 0 of 480 cases send a tester to a control that does not exist

Every toolbar control named in the preconditions or steps of all **480** cases was found present and
**operated** on the build — each one clicked and its panel read. That covers the column selector, the
download menu, the date-range panel, and every filter on all six reports.

**One control had to be found twice before that could be said.** The first sweep reported the
Sales By Customer `Product Type`, and Sales By Representative's `Product Type`, `Invoice Status` and
`Show Unassigned`, as absent. They are not absent — the id-matching pattern required a `_filter`
suffix and those four ids do not have one. **Had that gone unchecked it would have read as four
missing controls on a report handed off to QA.**

## The `capitalize` trap — confirmed again, and the reason it must be read from the render

| Work In Progress tab | as shipped in the markup | **as the tester reads it** |
|---|---|---|
| `tab_wip_approved_partially_completed` | `Approved - partially completed (15)` | **`Approved - Partially Completed (15)`** |
| `tab_wip_approved_not_started` | `Approved - not started (3)` | **`Approved - Not Started (3)`** |
| `tab_wip_completed` | `Completed (4)` | `Completed (4)` |
| `tab_wip_estimates` | `Estimates (15)` | `Estimates (15)` |

**Our cases say the right-hand column and they are correct. Nothing was changed.**

*Honest note on the measurement: the computed `text-transform` reads `none` on the tab element
itself — the transform sits on an inner element — so reading the style of the node you happen to
select is not reliable either. The rendered text is the authority, and it is unambiguous.*

## Verified exactly, on this build

| Surface | Result |
|---|---|
| Report routes | 6 of 6 load |
| Navigation group | Work In Progress · Technician Utilization · Sales By Customer · Sales By Representative all under **PERFORMANCE**; Parts Velocity · Inventory Value under **PARTS** |
| Column selector contents | all 6 reports, in order, with each column's on/off state |
| Download menu contents | WIP `Download (PDF)` · `Download (CSV)` — 2 items; TU/SBC/SBR 4 items; PV/IV 2 items |
| Date-range presets | **the same nine on all six reports**, no `Today`, no `Custom`, no `All Time` |
| Tab switching (WIP) | 4 of 4 switch and become selected |
| Downloads | **10 of 10 succeeded** across the three final reports — see below |
| Expand / collapse | Technician Utilization 4→7→4 rows; Sales By Customer 9→16→9 |
| Dark mode | body background changes on all three final reports |
| Phone at 390×844 | all four toolbar controls visible on all three final reports |

### Downloads — 10 of 10, and the filenames match the specifications

| Report | Item | File | Bytes |
|---|---|---|---:|
| WIP | Download (PDF) | `wip-2-report.pdf` | 177,683 |
| WIP | Download (CSV) | `wip-2-report.csv` | 1,366 |
| TU | Summary (PDF) | `Technician-Utilization-Summary.pdf` | 175,287 |
| TU | Summary (CSV) | `Technician-Utilization-Summary.csv` | 215 |
| TU | Expanded (PDF) | `Technician-Utilization-Expanded.pdf` | 175,677 |
| TU | Expanded (CSV) | `Technician-Utilization-Expanded.csv` | 334 |
| SBC | Summary (PDF) | `sales-by-customer-summary-custom.pdf` | 178,330 |
| SBC | Expanded (PDF) | `sales-by-customer-expanded-custom.pdf` | 181,266 |
| SBC | Summary (CSV) | `sales-by-customer-summary-custom.csv` | 808 |
| SBC | Expanded (CSV) | `sales-by-customer-expanded-custom.csv` | 2,650 |

Every one returned the success notification **"Data exported successfully."** WIP's filenames match
its specification **S9-R9** exactly. **This independently re-confirms that
[SV-8907](https://shopview.atlassian.net/browse/SV-8907) is genuinely fixed** — and extends it from
Work In Progress to Technician Utilization and Sales By Customer.

## 🔴 What I did NOT establish, and must not be read as a finding

- **Sorting on Technician Utilization and Sales By Customer.** My probe reported "the order did not
  change", and **that is a measurement artefact, not a defect** — the row-text extractor read the
  expand-chevron cell rather than the name cell, so it compared identical strings whatever the sort
  did. **Sorting on those two reports is NOT VERIFIED.** Work In Progress's sort *was* proven: the
  `WO #` order reversed on the first click and returned on the second. *This is the same class of
  mistake as the "broken sort" that turned out to be a stale snapshot — recorded rather than
  reported.*
- **Label surfaces inside the downloaded files.** The files were produced and sized; their contents
  were not read.
- **34 quoted labels** in case text were not found in the harvest. Hand-reviewed: almost all are the
  **browser's own** developer-tools strings (`Network`, `No throttling`, `Slow 3G`, `Offline`,
  `Accessibility`, `Styles`) or example data (`Acme Corp`, `corp`, `Best Test`), and several are
  cases correctly asserting that something is **absent** (`Today` and `Custom` on the Inventory Value
  date picker, `Multiple` on a Work In Progress row). **None is reported as a build defect.** The two
  genuine ones — `All products` and `Services` on Sales By Customer — are `DIVERGENCES.md` section 3.
- **Every permission case, on all six reports.** One shared sign-in; `quick-login` and `switch-user`
  were deliberately never called because a sibling worker shares the token.
