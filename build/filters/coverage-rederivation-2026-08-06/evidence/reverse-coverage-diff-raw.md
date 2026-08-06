# Reverse coverage diff - foreign assertions vs OUR suite

**Generated:** 2026-08-06T15:51:22Z · **READ-ONLY** (get_* only, zero writes) · **OURS = user id 3**

| Group | Name | Live total | Ours | Foreign | Foreign authors |
|---|---|---|---|---|---|
| 4110 | Filters - (2026) | 114 | 114 | 0 | - |
| 37 | Reports | 134 | 43 | 91 | {'Vladimir Tomovic': 91} |
| 38 | Technician Efficiency | 23 | 0 | 23 | {'Vladimir Tomovic': 23} |
| 39 | Advisor Analysis | 8 | 0 | 8 | {'Vladimir Tomovic': 8} |
| 59 | Timesheet Activities | 58 | 43 | 15 | {'Vladimir Tomovic': 15} |
| 27 | Inventory | 31 | 0 | 31 | {'Vladimir Tomovic': 31} |
| 29 | Returns | 22 | 0 | 22 | {'Vladimir Tomovic': 22} |
| 30 | Credits | 12 | 0 | 12 | {'Vladimir Tomovic': 12} |
| 25 | Catalog | 15 | 0 | 15 | {'Vladimir Tomovic': 15} |
| 277 | Import WO Invoices | 11 | 0 | 11 | {'Vladimir Tomovic': 11} |
| 3557 | G. Customer Page Tabs & Payments Expansion | 8 | 0 | 8 | {'Vladimir Tomovic': 8} |
| 265 | Part Sales | 9 | 0 | 9 | {'Vladimir Tomovic': 9} |
| 245 | Staf filtering by fields | 8 | 0 | 8 | {'Vladimir Tomovic': 8} |
| 276 | Staff | 6 | 0 | 6 | {'Vladimir Tomovic': 6} |

## C27260 - CANDIDATE GAP

*AR Aging Summary — customer-name link gated on Customers view*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27260)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Owner/admin logged in (reporting project storage state) |
| 2 | CANDIDATE GAP | STRONG | `customer render row` | `render` | - | Wait for the seeded customer row to render |
| 3 | CANDIDATE GAP | STRONG | `cell customer name` | `name` | - | Click the customer-name cell |
| 4 | CANDIDATE GAP | PHRASING | `invoiced unpaid workplace` | `invoiced` | - | One unpaid invoiced WO exists in the active workplace (seeded via API) |

## C27261 - CANDIDATE GAP

*AR Aging Detail — transaction finance link gated on Work Orders + Invoicing view*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27261)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Owner/admin logged in (reporting project storage state) |
| 2 | CANDIDATE GAP | PHRASING | `invoiced unpaid workplace` | `invoiced` | - | One unpaid invoiced WO exists in the active workplace (seeded via API) |
| 3 | CANDIDATE GAP | PHRASING | `aging bucket expand` | `aging` | - | Expand the aging bucket holding the seeded invoice |

## C27262 - CANDIDATE GAP

*AR Aging Collection — transaction finance link gated on Work Orders + Invoicing view*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27262)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Owner/admin logged in (reporting project storage state) |
| 2 | CANDIDATE GAP | STRONG | `customer expand row` | `row` | - | Expand the seeded customer row |
| 3 | CANDIDATE GAP | PHRASING | `invoiced unpaid workplace` | `invoiced` | - | One unpaid invoiced WO exists in the active workplace (seeded via API) |
| 4 | CANDIDATE GAP | PHRASING | `aging collection directly` | `aging` | - | Open the AR Aging Collection report directly |

## C27263 - CANDIDATE GAP

*AP Unpaid Invoices — invoice delivery link gated on Parts access*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27263)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Admin logged in (reporting project storage state); |
| 2 | CANDIDATE GAP | PHRASING | `accepted delivery invoice` | `accepted` | - | One unpaid accepted PO delivery (vendor invoice) exists (seeded via API) |
| 3 | CANDIDATE GAP | PHRASING | `expand holding invoice` | `expand` | - | Expand the vendor row holding the seeded invoice |

## C27264 - CANDIDATE GAP

*AP Aging Detail — invoice delivery link gated on Parts access*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27264)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Admin logged in (reporting project storage state); |
| 2 | CANDIDATE GAP | PHRASING | `accepted delivery invoice` | `accepted` | - | One unpaid accepted PO delivery (vendor invoice) exists (seeded via API) |
| 3 | CANDIDATE GAP | PHRASING | `aging bucket expand` | `aging` | - | Expand the aging bucket holding the seeded invoice |

## C27265 - CANDIDATE GAP

*Inventory report renders inventory rows*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27265)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `logged` | `-` | C19247 C19248 C19249 C19250 C19251 C19252 | Logged in as admin/owner (Reports access); |
| 2 | CANDIDATE GAP | STRONG | `inventory workplace part` | `part` | - | at least one inventory part exists at the active workplace (seeded via API) |
| 3 | CANDIDATE GAP | PHRASING | `finish inventory table` | `finish` | - | Wait for the inventory table to finish loading |

## C27267 - CANDIDATE GAP

*Work In Progress report renders and expands a segment*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27267)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `logged` | `-` | C19247 C19248 C19249 C19250 C19251 C19252 | Logged in as admin/owner (Reports access; |
| 2 | CANDIDATE GAP | STRONG | `progress work` | `work` | - | Navigate to the Work In Progress report (reports/work-in-progress) |
| 3 | CANDIDATE GAP | STRONG | `expand segment first` | `first` | - | Click the expand toggle on the first segment row |
| 4 | CANDIDATE GAP | PHRASING | `regardless seeding segment` | `regardless` | - | No data seeding — the WIP report always returns 3 segments x 4 sub-rows regardless of org data |

## C27268 - CANDIDATE GAP

*Sales Follow Up report renders rows*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/27268)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `logged` | `-` | C19247 C19248 C19249 C19250 C19251 C19252 | Logged in as admin/owner (Reports access; |
| 2 | CANDIDATE GAP | STRONG | `sal follow` | `follow` | - | Navigate to the Sales Follow Up report (reports/sales-follow-up) |
| 3 | CANDIDATE GAP | PHRASING | `customer invoice invoiced` | `customer` | - | at least one customer has an invoiced WO whose invoice was created within the last 3 months (seeded via API) |
| 4 | CANDIDATE GAP | PHRASING | `clear overlay table` | `clear` | - | Wait for the report table's loading overlay to clear |

## C29920 - CANDIDATE GAP

*Sales Tax Collected — WO invoice link targets finance with financial access, lines without*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/29920)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `reporting logged` | `logged` | - | Owner/admin logged in (reporting project storage state) |
| 2 | CANDIDATE GAP | PHRASING | `invoiced paid workplace` | `invoiced` | - | One invoiced + paid WO exists in the active workplace, paid within this_month (seeded via API) |
| 3 | CANDIDATE GAP | PHRASING | `collected payment sal` | `collected` | - | Open the Sales Tax Collected report (default this_month range contains the seeded payment) |
| 4 | CANDIDATE GAP | PHRASING | `invoice link number` | `invoice` | - | Locate the seeded WO's invoice-number link |

## C39448 - CANDIDATE GAP

*Sales Tax invoices status filter narrows grid and is shared with All Tax Rates view*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/39448)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `paid partially range` | `range` | - | one Paid, one Partially Paid) within the default date range. |
| 2 | CANDIDATE GAP | STRONG | `rat tax see` | `see` | - | Click 'See all tax rates'. |
| 3 | CANDIDATE GAP | PHRASING | `differing invoic statuse` | `differing` | - | At least two invoices exist with differing statuses (e.g. |
| 4 | CANDIDATE GAP | PHRASING | `sal tax` | `sal` | - | Navigate to the Sales Tax report (/reports/sales-tax). |
| 5 | CANDIDATE GAP | PHRASING | `grid invoic statuse` | `grid` | - | The invoices grid loads with all statuses shown. |
| 6 | CANDIDATE GAP | PHRASING | `chip paid partially` | `chip` | - | Open the Status filter chip and select 'Partially Paid' only. |
| 7 | CANDIDATE GAP | PHRASING | `invoic paid partially` | `invoic` | - | only partially-paid invoices remain. |
| 8 | CANDIDATE GAP | PHRASING | `paid partially rat` | `paid` | - | The All Tax Rates summary view opens reflecting the same Partially Paid status selection. |

## C39449 - CANDIDATE GAP

*My Timesheets date chip drives the grid; incomplete custom range triggers no fetch*  
Section: Test Cases > Reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/39449)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `grid load range` | `load` | - | The timesheet grid loads for the default range. |
| 2 | CANDIDATE GAP | STRONG | `chip preset different` | `different` | - | Change the date range chip to a different preset. |
| 3 | CANDIDATE GAP | STRONG | `fetch grid new` | `new` | - | The grid re-fetches for the new range. |
| 4 | CANDIDATE GAP | STRONG | `choose fill custom` | `fill` | - | Choose Custom and fill only the start date. |
| 5 | CANDIDATE GAP | STRONG | `fetch occur empty` | `empty` | - | No re-fetch occurs while the end date is empty. |
| 6 | CANDIDATE GAP | PHRASING | `more preset spanning` | `more` | - | The logged-in user has timesheet entries spanning more than one date-range preset. |

## C175 - CANDIDATE GAP

*Technician efficiency - list of members*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/175)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `foreman found enabled` | `enabled` | - | <li><p>All staff members with 'Time Clock' enabled could be found on a list<br />//There should be all members from Staff page with Admin, Technician and Foreman role</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `app base efficiency` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/technician-efficiency</li> |

## C176 - CANDIDATE GAP

*Technician efficiency - time intervals*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/176)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base efficiency` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/technician-efficiency</li> |

## C1779 - COVERED-BY

*Technician Efficiency - One Tech per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1779)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `invoiced single strong` | `invoiced` | - | <li>A invoiced WO with <strong>single</strong> tech clocked in time on the line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `calculate proportion spend` | `calculate` | - | <li>Calculate proportion of the time spend on the line for the tech</li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $techproportion strong` | `$clockedhour` | - | <li><strong>$TechProportion</strong> = $ClockedHours / $ClockedHours </li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techtime allocated` | `$invoicedtechhour` | - | <li>Verify tech <strong>$InvoicedTechHours</strong> (allocated tech time is the <strong>same</strong> as <strong>$TechTime</strong> when only one tech is clocked into the line)</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techproportion strong` | `$invoicedtechhour` | - | <li><strong>$InvoicedTechHours</strong> = $TechProportion |
| 8 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li>Verify tech <strong>Efficiency</strong> for that WO line </li> |
| 9 | CANDIDATE GAP | PHRASING | `$clockedhour $invoicedtechhour $techefficiency` | `$clockedhour` | - | <li><strong>$TechEfficiency</strong> = ($InvoicedTechHours / $ClockedHours) |
| 10 | CANDIDATE GAP | PHRASING | `profit strong tech` | `profit` | - | <li>Verify tech <strong>Profit Hours</strong> for that WO line</li> |
| 11 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techprofithour strong` | `$invoicedtechhour` | - | <li><strong>$TechProfitHours</strong> = $InvoicedTechHours |

## C1780 - COVERED-BY

*Technician Efficiency - Multiple Techs per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1780)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li>An invoiced WO with <strong>multiple</strong> tech clocked in times on the same line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the <strong>Edit Line</strong> modal<br /><strong>$InvoicedTechHours</strong |
| 4 | CANDIDATE GAP | PHRASING | `calculate proportion spend` | `calculate` | - | <li>Calculate proportion of the time spend on the line for all techs </li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhours1 $clockedhours2 $tech1proportion` | `$clockedhours1` | - | <li><strong>$Tech1Proportion</strong> = $ClockedHours1 / ($ClockedHours1 + $ClockedHours2)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$clockedhours1 $clockedhours2 $tech2proportion` | `$clockedhours1` | - | <li><strong>$Tech2Proportion</strong> = $ClockedHours2 / ($ClockedHours1 + $ClockedHours2)</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techtime allocated` | `$invoicedtechhour` | - | <li>Verify tech <strong>$InvoicedTechHours</strong> (allocated tech time is <strong>different</strong> from <strong>$TechTime</strong> when multiple techs are clocked into the same line)</li> |
| 8 | CANDIDATE GAP | PHRASING | `$invoicedtechhours1 $tech1proportion strong` | `$invoicedtechhours1` | - | <li><strong>$InvoicedTechHours1</strong> = $Tech1Proportion |
| 9 | CANDIDATE GAP | PHRASING | `$invoicedtechhours2 $tech2proportion strong` | `$invoicedtechhours2` | - | <li><strong>$InvoicedTechHours2</strong> = $Tech2Proportion |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li>Verify tech <strong>Efficiency</strong> for that WO line </li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhours1 $invoicedtech1hour $tech1efficiency` | `$clockedhours1` | - | <li><strong>$Tech1Efficiency</strong> = ($InvoicedTech1Hours / $ClockedHours1) |
| 12 | CANDIDATE GAP | PHRASING | `$clockedhours2 $invoicedtech2hour $tech2efficiency` | `$clockedhours2` | - | <li><strong>$Tech2Efficiency</strong> = ($InvoicedTech2Hours / $ClockedHours2) |
| 13 | CANDIDATE GAP | PHRASING | `profit strong tech` | `profit` | - | <li>Verify tech <strong>Profit Hours</strong> for that WO line</li> |
| 14 | CANDIDATE GAP | PHRASING | `$invoicedtechhours1 $tech1profithour strong` | `$invoicedtechhours1` | - | <li><strong>$Tech1ProfitHours</strong> = $InvoicedTechHours1 |
| 15 | CANDIDATE GAP | PHRASING | `$invoicedtechhours2 $tech2profithour strong` | `$invoicedtechhours2` | - | <li><strong>$Tech2ProfitHours</strong> = $InvoicedTechHours2 |

## C1781 - COVERED-BY

*Technician Efficiency - Multiple Roles per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1781)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li>An <strong>invoiced</strong> WO with multiple tech clocked in times on the same line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |

## C1798 - COVERED-BY

*Technician Efficiency -  Summary per Tech*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1798)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li><strong>Multiple</strong> invoiced WOs with tech clocked in time exist</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `$clockedhour strong summary` | `$clockedhour` | - | <li>Verify tech summary <strong>$ClockedHours</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $clockedhourssum strong` | `$clockedhour` | - | <li>Sum of all <strong>$ClockedHours</strong> per user is correct ($ClockedHoursSum)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour strong summary` | `$invoicedtechhour` | - | <li>Verify tech summary for <strong>$InvoicedTechHours</strong> </li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $invoicedtechhourssum strong` | `$invoicedtechhour` | - | <li>Sum of all <strong>$InvoicedTechHours</strong> per user is correct ($InvoicedTechHoursSum)</li> |
| 8 | CANDIDATE GAP | PHRASING | `profit strong summary` | `profit` | - | <li>Verify tech summary for <strong>Profit Hours</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `$profithourssum profit strong` | `$profithourssum` | - | <li>Sum of all <strong>Profit Hours</strong> per user is correct ($ProfitHoursSum)</li> |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong summary` | `efficiency` | - | <li>Verify tech summary for <strong>Efficiency</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhourssum $invoicedtechhourssum efficiency` | `$clockedhourssum` | - | <li><p>Sum of all <strong>Efficiency</strong> per user is correct<br />($InvoicedTechHoursSum / $ClockedHoursSum) |

## C1799 - COVERED-BY

*Technician Efficiency -  Totals (Summary for all Techs)*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1799)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li><strong>Multiple</strong> invoiced WOs with tech clocked in time exist</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `$clockedhour strong tech` | `$clockedhour` | - | <li>Verify total <strong>$ClockedHours</strong> for all techs</li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $clockedhourstotal strong` | `$clockedhour` | - | <li>Sum of all <strong>$ClockedHours</strong> for <strong>all users</strong> is correct ($ClockedHoursTotal)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour strong tech` | `$invoicedtechhour` | - | <li>Verify total <strong>$InvoicedTechHours</strong> for all techs</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $invoicedtechhourstotal strong` | `$invoicedtechhour` | - | <li>Sum of all <strong>$InvoicedTechHours</strong> for <strong>all users</strong> is correct ($InvoicedTechHoursTotal)</li> |
| 8 | CANDIDATE GAP | PHRASING | `profit strong tech` | `profit` | - | <li>Verify total <strong>Profit Hours</strong> for all techs</li> |
| 9 | CANDIDATE GAP | PHRASING | `$profithourstotal profit strong` | `$profithourstotal` | - | <li>Sum of all <strong>Profit Hours</strong> for <strong>all users</strong> is correct ($ProfitHoursTotal)</li> |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li>Verify total <strong>Efficiency</strong> for all techs</li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhourstotal $invoicedtechhourstotal efficiency` | `$clockedhourstotal` | - | <li><p>Sum of all <strong>Efficiency</strong> for <strong>all users</strong> is correct<br />($InvoicedTechHoursTotal / $ClockedHoursTotal) |

## C1783 - CANDIDATE GAP

*Technician Efficiency - Download*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1783)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | COVERED-BY | STRONG | `option dropdown list` | `-` | C19272 | <li><p>A dropdown list with 2 options opens:</p> |
| 3 | COVERED-BY | STRONG | `option dropdown list` | `-` | C19272 | <li><p>A dropdown list with 2 options opens:</p> |
| 4 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 5 | CANDIDATE GAP | PHRASING | `corner dots strong` | `corner` | - | <li>Click on the <strong>menu</strong> (3 dots) in top right corner</li> |
| 6 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li><strong>Download Summary</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li><strong>Download Expanded View</strong></li> |
| 8 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li>Click on <strong>Download Summary</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `downloaded efficiency summary.pdf` | `downloaded` | - | <li>Technician-Efficiency-summary.pdf reports is downloaded</li> |
| 10 | CANDIDATE GAP | PHRASING | `corner dots strong` | `corner` | - | <li>Click on the <strong>menu</strong> (3 dots) in top right corner</li> |
| 11 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li><strong>Download Summary</strong></li> |
| 12 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li><strong>Download Expanded View</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li>Click on <strong>Download Expanded View</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `downloaded efficiency expandedview.pdf` | `downloaded` | - | <li>Technician-Efficiency-expandedView.pdf reports is downloaded</li> |

## C1784 - CANDIDATE GAP

*Technician Efficiency - Summary Report Structure*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1784)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `strong summary data` | `data` | - | <li>Verify data on the <strong>Summary</strong> report</li> |
| 3 | CANDIDATE GAP | STRONG | `address strong location` | `location` | - | <li><strong>Location address</strong> is visible under Location name</li> |
| 4 | CANDIDATE GAP | STRONG | `previously dat showing` | `dat` | - | <li>Date range is showing dates that are previously selected in the date filter</li> |
| 5 | CANDIDATE GAP | STRONG | `strong table header` | `header` | - | <li><p>Table <strong>header</strong> is visible:</p> |
| 6 | CANDIDATE GAP | STRONG | `bolded font header` | `font` | - | <li>header fonts are bolded</li> |
| 7 | CANDIDATE GAP | STRONG | `contain header column` | `contain` | C19256 C19257 C19258 | <li><p>header contains columns:</p> |
| 8 | CANDIDATE GAP | STRONG | `invoiced tech hour` | `hour` | - | <li>Invoiced Tech Hours</li> |
| 9 | CANDIDATE GAP | STRONG | `strong table rows` | `rows` | - | <li><p>Table <strong>rows</strong> are visible:</p> |
| 10 | CANDIDATE GAP | STRONG | `bolded footer font` | `font` | - | <li>footer fonts are bolded</li> |
| 11 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 12 | CANDIDATE GAP | PHRASING | `downloaded efficiency summary.pdf` | `downloaded` | - | <li>Technician-Efficiency-summary.pdf reports is downloaded</li> |
| 13 | CANDIDATE GAP | PHRASING | `strong structure summary` | `strong` | - | <li><p>The <strong>Summary</strong> reports structure:</p> |
| 14 | CANDIDATE GAP | PHRASING | `corner left strong` | `corner` | - | <li><p><strong>Location name</strong> is visible in top left corner</p> |
| 15 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li><p>Report title <strong>Tech Efficiency</strong> is visible</p> |
| 16 | CANDIDATE GAP | PHRASING | `strong subtitle summary` | `strong` | - | <li><p>Report subtitle <strong>Summary</strong> is visible</p> |
| 17 | CANDIDATE GAP | PHRASING | `corner logo organization` | `corner` | - | <li>Organization <strong>logo</strong> is visible in top right corner </li> |
| 18 | CANDIDATE GAP | PHRASING | `invoice logo strong` | `invoice` | - | <li><p><strong>Invoice Date Range</strong> is visible under logo (e.g., Invoice Date Range: |
| 19 | CANDIDATE GAP | PHRASING | `bolded invoice label` | `bolded` | - | <li>Invoice Date Range label fonts are bolded</li> |
| 20 | CANDIDATE GAP | PHRASING | `background gray light` | `background` | - | <li>header has light gray background</li> |
| 21 | CANDIDATE GAP | PHRASING | `gray light separated` | `gray` | - | <li>each technician row is separated by a light gray line</li> |
| 22 | CANDIDATE GAP | PHRASING | `aka footer strong` | `aka` | - | <li><p>Table <strong>footer</strong> aka <strong>Totals</strong> is visible</p> |
| 23 | CANDIDATE GAP | PHRASING | `background footer gray` | `background` | - | <li>footer has light gray background</li> |
| 24 | CANDIDATE GAP | PHRASING | `gst number strong` | `gst` | - | <li><p><strong>GST</strong> number and <strong>page</strong> numbers are not visible on the bottom of the page</p></li> |

## C1785 - CANDIDATE GAP

*Technician Efficiency - Expanded View Report Structure*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1785)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `expandedview strong data` | `data` | - | <li>Verify data on the <strong>ExpandedView</strong> report</li> |
| 3 | CANDIDATE GAP | STRONG | `company section full` | `full` | - | <li>Each technician's section should start with the full company header on top. |
| 4 | CANDIDATE GAP | STRONG | `pag span first` | `first` | - | If a technician's report spans multiple pages, the header should appear only on the first page</li> |
| 5 | CANDIDATE GAP | STRONG | `address strong location` | `location` | - | <li><strong>Location address</strong> is visible under Location name</li> |
| 6 | CANDIDATE GAP | STRONG | `previously dat showing` | `dat` | - | <li>Date range is showing dates that are previously selected in the date filter</li> |
| 7 | CANDIDATE GAP | STRONG | `strong table header` | `header` | - | <li><p>Table <strong>header</strong> is visible:</p> |
| 8 | CANDIDATE GAP | STRONG | `bolded font header` | `font` | - | <li>header fonts are bolded</li> |
| 9 | CANDIDATE GAP | STRONG | `contain header column` | `contain` | C19256 C19257 C19258 | <li><p>header contains columns:</p> |
| 10 | CANDIDATE GAP | STRONG | `invoiced tech hour` | `hour` | - | <li>Invoiced Tech Hours</li> |
| 11 | CANDIDATE GAP | STRONG | `strong table rows` | `rows` | - | <li><p>Table <strong>rows</strong> are visible:</p> |
| 12 | CANDIDATE GAP | STRONG | `bolded footer font` | `font` | - | <li>footer fonts are bolded</li> |
| 13 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 14 | CANDIDATE GAP | PHRASING | `downloaded efficiency expandedview.pdf` | `downloaded` | - | <li>Technician-Efficiency-expandedView.pdf reports is downloaded</li> |
| 15 | CANDIDATE GAP | PHRASING | `expandedview strong structure` | `expandedview` | - | <li><p>The <strong>ExpandedView</strong> reports structure:</p> |
| 16 | CANDIDATE GAP | PHRASING | `corner left strong` | `corner` | - | <li><p><strong>Location name</strong> is visible in top left corner</p> |
| 17 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li><p>Report title <strong>Tech Efficiency</strong> is visible</p> |
| 18 | CANDIDATE GAP | PHRASING | `$technicianname strong subtitle` | `$technicianname` | - | <li><p>Report subtitle <strong>$TechnicianName</strong> is visible</p> |
| 19 | CANDIDATE GAP | PHRASING | `corner logo organization` | `corner` | - | <li>Organization <strong>logo</strong> is visible in top right corner </li> |
| 20 | CANDIDATE GAP | PHRASING | `invoice logo strong` | `invoice` | - | <li><p><strong>Invoice Date Range</strong> is visible under logo (e.g., Invoice Date Range: |
| 21 | CANDIDATE GAP | PHRASING | `bolded invoice label` | `bolded` | - | <li>Invoice Date Range label fonts are bolded</li> |
| 22 | CANDIDATE GAP | PHRASING | `background gray light` | `background` | - | <li>header has light gray background</li> |
| 23 | CANDIDATE GAP | PHRASING | `gray light separated` | `gray` | - | <li>each technician row is separated by a light gray line</li> |
| 24 | CANDIDATE GAP | PHRASING | `aka footer strong` | `aka` | - | <li><p>Table <strong>footer</strong> aka <strong>Totals</strong> is visible</p> |
| 25 | CANDIDATE GAP | PHRASING | `background footer gray` | `background` | - | <li>footer has light gray background</li> |
| 26 | CANDIDATE GAP | PHRASING | `gst number strong` | `gst` | - | <li><strong>GST</strong> number and <strong>page</strong> numbers are not visible on the bottom of the page</li> |

## C1805 - CONTRADICTS-OURS

*Technician Efficiency - Verify Data After WO is Invoiced*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1805)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `tech lin multiple` | `lin` | - | <li>WO with multiple lines and techs clocked into those lines exist</li> |
| 2 | COVERED-BY | STRONG | `include filter set` | `-` | C19251 | <li>Filters are set to include WO date</li> |
| 3 | CONTRADICTS-OURS | STRONG | `result tim visible` | `tim` | C19270 | <li>WO and clocked in times are not visible in the results</li> |
| 4 | CONTRADICTS-OURS | STRONG | `result tim now` | `tim` | C19270 | <li>WO and clocked in times are now visible in the results</li> |
| 5 | CANDIDATE GAP | PHRASING | `estimate invoice statu` | `estimate` | - | <li>WO is in <strong>Complete</strong> or <strong>Estimate</strong> status ( <strong>Invoice</strong> is not created )</li> |
| 6 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 7 | CANDIDATE GAP | PHRASING | `base efficiency existence` | `base` | - | <li>Navigate back to the WO and create invoice and then navigate to the {{BASE_URL}}/reports/technician-efficiency and verify existence of that WO in the results</li> |

## C1786 - CANDIDATE GAP

*Technician Efficiency - Verify Data After WO is Reversed*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1786)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced strong tim` | `tim` | - | <li>An <strong>invoiced</strong> WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `efficiency strong record` | `record` | - | <li>There are records for the WO under <strong>Technician Efficiency</strong></li> |
| 3 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 4 | CANDIDATE GAP | PHRASING | `invoiced issued paid` | `invoiced` | - | <li>Verify records exist for the issued WO (Invoiced/Paid)</li> |
| 5 | CANDIDATE GAP | PHRASING | `issued payment reverse` | `issued` | - | <li>Reverse Payment and Verify records exist for the issued WO</li> |
| 6 | CANDIDATE GAP | PHRASING | `efficiency invoice longer` | `efficiency` | - | <li>Tech Efficiency data is no longer visible for that WO/Invoice</li> |

## C1801 - CANDIDATE GAP

*Technician Efficiency - Filter*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1801)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | COVERED-BY | STRONG | `filter date` | `-` | C19247 C19251 | <li>Verify default date filter</li> |
| 3 | CANDIDATE GAP | STRONG | `strong filter month` | `filter` | - | <li>Filter is set to <strong>This Month</strong></li> |
| 4 | CANDIDATE GAP | STRONG | `strong option filter` | `option` | - | <li>Click on <strong>Filter</strong> dropdown and verify dropdown options</li> |
| 5 | CANDIDATE GAP | STRONG | `following strong option` | `option` | - | <li><p>The following <strong>Filter</strong> dropdown options are present:</p> |
| 6 | CANDIDATE GAP | STRONG | `filtered strong option` | `option` | - | <li>Click on each <strong>Filter</strong> dropdown option and verify filtered results</li> |
| 7 | CANDIDATE GAP | STRONG | `rang record selected` | `record` | - | <li>Records are displayed only within selected date ranges</li> |
| 8 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |

## C1802 - CANDIDATE GAP

*Technician Efficiency - Links*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1802)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `link strong hour` | `hour` | - | <li>Click on any link under <strong>Clocked Hours</strong></li> |
| 3 | CANDIDATE GAP | STRONG | `strong edit line` | `edit` | - | <li><strong>Edit Line</strong> modal opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 5 | CANDIDATE GAP | PHRASING | `invoice link number` | `invoice` | - | <li>Click on any link under <strong>Invoice Number</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `base url workorder` | `base` | - | <li>User lands to {{BASE_URL}}/workorder/{{WO_ID}}/lines</li> |
| 7 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 8 | CANDIDATE GAP | PHRASING | `customer link strong` | `customer` | - | <li>Click on any link under <strong>Customer</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `base customer url` | `base` | - | <li>User lands to {{BASE_URL}}/customers/{{CUSTOMER_ID}}/work-orders</li> |
| 10 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 11 | CANDIDATE GAP | PHRASING | `base url workorder` | `base` | - | <li>User lands to {{BASE_URL}}/workorder/{{WO_ID}}/timesheets</li> |
| 12 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 13 | CANDIDATE GAP | PHRASING | `invoiced link strong` | `invoiced` | - | <li>Click on any link under <strong>Invoiced Tech Hours</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `base customer url` | `base` | - | <li>User lands to {{BASE_URL}}/customers/{{CUSTOMER_ID}}/lines</li> |

## C1803 - CANDIDATE GAP

*Technician Efficiency - Line Ordering*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1803)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `ordering line technician` | `line` | - | <li>Verify line ordering for the same WO under technician </li> |
| 3 | COVERED-BY | STRONG | `most recent work` | `-` | C19293 C19294 | <li>The most recent work orders are at the top</li> |
| 4 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 5 | CANDIDATE GAP | PHRASING | `grouped highest lowest` | `grouped` | - | <li>Lines are ordered from <strong>lowest</strong> to <strong>highest</strong> grouped by work orders</li> |
| 6 | CANDIDATE GAP | PHRASING | `class line1 table` | `class` | - | <tr><td class="table-data">1</td><td class="table-data">wo2</td><td class="table-data">wo2_line1</td></tr> |
| 7 | CANDIDATE GAP | PHRASING | `class line2 table` | `class` | - | <tr><td class="table-data">2</td><td class="table-data">wo2</td><td class="table-data">wo2_line2</td></tr> |
| 8 | CANDIDATE GAP | PHRASING | `class line3 table` | `class` | - | <tr><td class="table-data">3</td><td class="table-data">wo2</td><td class="table-data">wo2_line3</td></tr> |
| 9 | CANDIDATE GAP | PHRASING | `class line4 table` | `class` | - | <tr><td class="table-data">4</td><td class="table-data">wo2</td><td class="table-data">wo2_line4</td></tr> |
| 10 | CANDIDATE GAP | PHRASING | `class line5 table` | `class` | - | <tr><td class="table-data">5</td><td class="table-data">wo2</td><td class="table-data">wo2_line5</td></tr> |
| 11 | CANDIDATE GAP | PHRASING | `class line2 table` | `class` | - | <tr><td class="table-data">6</td><td class="table-data">wo1</td><td class="table-data">wo1_line2</td></tr> |
| 12 | CANDIDATE GAP | PHRASING | `class line5 table` | `class` | - | <tr><td class="table-data">7</td><td class="table-data">wo1</td><td class="table-data">wo1_line5</td></tr> |
| 13 | CANDIDATE GAP | PHRASING | `class line6 table` | `class` | - | <tr><td class="table-data">8</td><td class="table-data">wo1</td><td class="table-data">wo1_line6</td></tr> |

## C1804 - CANDIDATE GAP

*Technician Efficiency - Table Header Tooltip*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1804)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `strong header hour` | `header` | - | <li>Hover over <strong>Clocked Hours</strong> column header</li> |
| 3 | CANDIDATE GAP | STRONG | `profit strong header` | `header` | - | <li>Hover over <strong>Hours Profit</strong> column header</li> |
| 4 | CANDIDATE GAP | STRONG | `efficiency strong header` | `header` | - | <li>Hover over <strong>Efficiency</strong> column header</li> |
| 5 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 6 | CANDIDATE GAP | PHRASING | `following invoiced number` | `following` | - | <li><p><strong>Clocked Hours</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'clocked hours' that the technician clocked in to the work order that have been invoiced withi |
| 7 | CANDIDATE GAP | PHRASING | `alternative invoiced number` | `alternative` | - | <p>Alternative:<br />Total number of 'clocked hours' the technician has logged into the work order, which have been invoiced within the selected date range.</p> |
| 8 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li>Hover over <strong>Invoiced Tech Hours</strong> column header</li> |
| 9 | CANDIDATE GAP | PHRASING | `assigned following invoiced` | `assigned` | - | <li><p><strong>Invoiced Tech Hours</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'tech hours' that were assigned to lines on the work orders that have been invoiced with |
| 10 | CANDIDATE GAP | PHRASING | `alternative assigned invoiced` | `alternative` | - | <p>Alternative:<br />Total number of 'tech hours' assigned to work order lines, which have been invoiced within the selected date range.</p> |
| 11 | CANDIDATE GAP | PHRASING | `difference following invoiced` | `difference` | - | <li><p><strong>Hours Profit</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'hours profit' that the difference of technician invoiced tech hours and technician clocked hou |
| 12 | CANDIDATE GAP | PHRASING | `actual alternative between` | `actual` | - | <p>Alternative:<br />Difference between the technician's invoiced hours and their actual clocked hours for work orders invoiced within the selected date range.</p> |
| 13 | CANDIDATE GAP | PHRASING | `associated based compared` | `associated` | - | <li><p><strong>Efficiency</strong> tooltip is visible with the following message:<br /><strong>This is the technician efficiency based off of the hours that were clocked onto the lines compared to the tech hours that wer |
| 14 | CANDIDATE GAP | PHRASING | `divided efficiency invoiced` | `divided` | - | Efficiency = invoiced tech time divided by the clocked time (in %)</strong></p></li> |
| 15 | CANDIDATE GAP | PHRASING | `100 alternative assigned` | `100` | - | <p>Alternative:<br />Technician's efficiency based on the clocked hours versus the tech hours assigned to work order lines, which have been invoiced within the selected date range.<br />Efficiency = (Invoiced Tech Hours  |

## C1806 - CANDIDATE GAP

*Technician Efficiency - Scroll*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1806)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `expanded table rows` | `rows` | - | <li>All table rows are expanded</li> |
| 3 | CANDIDATE GAP | STRONG | `scroll way back` | `back` | - | <li>Scroll all the way to the bottom and back to the top</li> |
| 4 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 5 | CANDIDATE GAP | PHRASING | `arrow next strong` | `arrow` | - | <li>Click on arrow next to the <strong>Technician</strong> column header</li> |
| 6 | CANDIDATE GAP | PHRASING | `between footer moving` | `between` | - | <li>The scroll is moving between the table header and table footer</li> |

## C1807 - CANDIDATE GAP

*Technician Efficiency - Expand Entire Table*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1807)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `arrow next header` | `header` | - | <li>Click the arrow next to the Technician column header</li> |
| 3 | CANDIDATE GAP | STRONG | `arrow next header` | `header` | - | <li>Click the arrow next to the Technician column header again</li> |
| 4 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 5 | CANDIDATE GAP | PHRASING | `expanded strong table` | `expanded` | - | <li>All table rows are <strong>expanded</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `collapsed strong table` | `collapsed` | - | <li>All table rows are <strong>collapsed</strong></li> |

## C1808 - CANDIDATE GAP

*Technician Efficiency - Expand Row*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1808)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `arrow next name` | `name` | - | <li>Click the arrow next to technician name</li> |
| 3 | CANDIDATE GAP | STRONG | `expanded strong selected` | `selected` | - | <li>Row for selected technician is <strong>expanded</strong></li> |
| 4 | CANDIDATE GAP | STRONG | `tech record visible` | `record` | - | <li>All tech records are visible</li> |
| 5 | CANDIDATE GAP | STRONG | `arrow next name` | `name` | - | <li>Click the arrow next to the same technician's name again</li> |
| 6 | CANDIDATE GAP | STRONG | `collapsed strong selected` | `selected` | - | <li>Row for selected technician is <strong>collapsed</strong></li> |
| 7 | CANDIDATE GAP | STRONG | `strong tech record` | `record` | - | <li>Tech records are <strong>not</strong> visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |

## C1809 - CANDIDATE GAP

*Technician Efficiency - Column Sorting*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1809)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `invoiced tim multiple` | `tim` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | STRONG | `strong header hour` | `header` | - | <li>Click on <strong>Clocked Hours</strong> column header</li> |
| 3 | CANDIDATE GAP | STRONG | `strong header hour` | `header` | - | <li>Click on <strong>Clocked Hours</strong> column header once again</li> |
| 4 | CANDIDATE GAP | STRONG | `profit strong header` | `header` | - | <li>Click on <strong>Hours Profit</strong> column header</li> |
| 5 | CANDIDATE GAP | STRONG | `profit strong header` | `header` | - | <li>Click on <strong>Hours Profit</strong> column header once again</li> |
| 6 | CANDIDATE GAP | STRONG | `efficiency strong header` | `header` | - | <li>Click on <strong>Efficiency</strong> column header</li> |
| 7 | CANDIDATE GAP | STRONG | `efficiency strong header` | `header` | - | <li>Click on <strong>Efficiency</strong> column header once again</li> |
| 8 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 9 | CANDIDATE GAP | PHRASING | `highest lowest strong` | `highest` | - | <li>The technician <strong>Clocked Hours</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `highest lowest strong` | `highest` | - | <li>The technician <strong>Clocked Hours</strong> are sorted from <strong>highest</strong> to <strong>lowest</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li>Click on <strong>Invoiced Tech Hours</strong> column header</li> |
| 12 | CANDIDATE GAP | PHRASING | `highest invoiced lowest` | `highest` | - | <li>The technician <strong>Invoiced Tech Hours</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `invoiced strong tech` | `invoiced` | - | <li>Click on <strong>Invoiced Tech Hours</strong> column header once again</li> |
| 14 | CANDIDATE GAP | PHRASING | `highest invoiced lowest` | `highest` | - | <li>The technician <strong>Invoiced Tech Hours</strong> are sorted from <strong>highest</strong> to <strong>lowest</strong></li> |
| 15 | CANDIDATE GAP | PHRASING | `highest lowest profit` | `highest` | - | <li>The technician <strong>Hours Profit</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 16 | CANDIDATE GAP | PHRASING | `highest lowest profit` | `highest` | - | <li>The technician <strong>Hours Profit</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 17 | CANDIDATE GAP | PHRASING | `efficiency highest lowest` | `efficiency` | - | <li>The technician <strong>Efficiency</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 18 | CANDIDATE GAP | PHRASING | `efficiency highest lowest` | `efficiency` | - | <li>The technician <strong>Efficiency</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |

## C19296 - CONTRADICTS-OURS

*Technician Efficiency - Error When Applying Custom Date Range*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19296)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `efficiency navigated technician` | `technician` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CANDIDATE GAP | STRONG | `correctly load filter` | `load` | - | Data loads correctly for default time filter (This Month). |
| 3 | CONTRADICTS-OURS | STRONG | `filter right dropdown` | `right` | C19266 | Open the Date Filter dropdown (top right) |
| 4 | CANDIDATE GAP | STRONG | `interval option showing` | `option` | - | Date filter dropdown opens showing time interval options |
| 5 | CANDIDATE GAP | STRONG | `correctly load month` | `load` | - | Select "This Month" and observe data loads correctly |
| 6 | CANDIDATE GAP | STRONG | `load successfully filter` | `load` | - | Report data loads successfully for This Month filter |
| 7 | CONTRADICTS-OURS | STRONG | `custom filter date` | `custom` | C19251 | Open the Date Filter again and select "Custom" |
| 8 | CANDIDATE GAP | STRONG | `picker custom range` | `custom` | - | Custom date range picker appears |
| 9 | CANDIDATE GAP | STRONG | `apply choose current` | `current` | - | Choose a start and end date within the current month and click Apply |
| 10 | CANDIDATE GAP | STRONG | `correctly custom load` | `custom` | - | The report should load data correctly for the selected custom date range without errors. |

## C19297 - CONTRADICTS-OURS

*Technician Efficiency - Single-Day Filter Returns Data for Multiple Days*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19297)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `efficiency navigated technician` | `technician` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CONTRADICTS-OURS | STRONG | `filter dropdown date` | `filter` | C19268 | Open the Date Filter dropdown |
| 3 | CANDIDATE GAP | STRONG | `interval option showing` | `option` | - | Date filter dropdown opens showing time interval options |
| 4 | CANDIDATE GAP | STRONG | `day single filter` | `filter` | - | Single day is selected as the filter |
| 5 | CANDIDATE GAP | STRONG | `apply expanded filter` | `filter` | - | Apply the filter and observe the Date column in the expanded technician rows |
| 6 | CANDIDATE GAP | STRONG | `day single selected` | `selected` | - | The report should display data only for the selected single day. |
| 7 | COVERED-BY | STRONG | `rows column date` | `-` | C19247 | All rows in the Date column should show the same date. |
| 8 | CANDIDATE GAP | PHRASING | `invoiced tech wos` | `invoiced` | - | Invoiced WOs with tech clocked-in time exist for multiple dates. |
| 9 | CANDIDATE GAP | PHRASING | `day pick single` | `day` | - | Select a single day (e.g., "Today" or pick a specific date via Custom) |

## C19298 - CONTRADICTS-OURS

*Technician Efficiency - Clicking Custom Does Not Open Date Range Dialog*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19298)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `efficiency navigated technician` | `technician` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CONTRADICTS-OURS | STRONG | `filter right dropdown` | `right` | C19266 | Open the Date Filter dropdown (top right) |
| 3 | CANDIDATE GAP | STRONG | `interval option custom` | `option` | - | Date filter dropdown opens showing time interval options including Custom |
| 4 | CANDIDATE GAP | STRONG | `input interactive custom` | `custom` | - | Verify the custom date range inputs are visible and interactive |
| 5 | CANDIDATE GAP | STRONG | `input field end` | `field` | - | Start date and end date input fields are visible. |
| 6 | CANDIDATE GAP | STRONG | `apply submit available` | `available` | - | An Apply/Submit button is available to confirm the selection. |
| 7 | CANDIDATE GAP | PHRASING | `allowing dialog picker` | `allowing` | - | A date range dialog/picker opens allowing the user to select a custom start and end date |

## C177 - CANDIDATE GAP

*Billing efficiency - columns*  
Section: Test Cases > Reports > Billing Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/177)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 2 | CANDIDATE GAP | STRONG | `hpur total clocked` | `total` | - | <li>Total clocked hpurs</li> |
| 3 | CANDIDATE GAP | STRONG | `invoiced total hour` | `total` | - | <li>Total invoiced hours</li> |
| 4 | CANDIDATE GAP | PHRASING | `app base billing` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/billing-efficiency</li> |

## C179 - CANDIDATE GAP

*Billing efficiency - time intervals*  
Section: Test Cases > Reports > Billing Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/179)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base billing` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/billing-efficiency</li> |

## C178 - CANDIDATE GAP

*Billing efficiency - set custom time interval*  
Section: Test Cases > Reports > Billing Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/178)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | STRONG | `interval pick custom` | `custom` | - | <li>Click on time intervals dropdown field and pick custom interval</li> |
| 3 | CANDIDATE GAP | STRONG | `dialog range date` | `range` | - | <li>Select Date Range dialog opens</li> |
| 4 | COVERED-BY | STRONG | `set date` | `-` | C19247 C19251 C19252 C19253 C19254 C19256 | <li>Set start date</li> |
| 5 | COVERED-BY | STRONG | `end set date` | `-` | C19252 C19253 C19268 | <li>Set end date</li> |
| 6 | CANDIDATE GAP | PHRASING | `app base billing` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/billing-efficiency</li> |
| 7 | CANDIDATE GAP | PHRASING | `billable invoiced organization` | `billable` | - | <li><p>Users organization has billable staff members <br />with clocked and invoiced work</p></li> |
| 8 | CANDIDATE GAP | PHRASING | `billable billing calculat` | `billable` | - | <li>The billing efficiency report calculates the total number of hours invoiced in the time period, compared to the total number of hours clocked for ‘Billable’ staff members.</li> |

## C211 - CANDIDATE GAP

*Billing efficiency - no billable staff*  
Section: Test Cases > Reports > Billing Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/211)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `bilable organization non` | `non` | - | <li>Users organization only has non bilable staff members</li> |
| 2 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 3 | CANDIDATE GAP | STRONG | `billing interval data` | `data` | - | <li>Set time interval in which there is billing data</li> |
| 4 | CANDIDATE GAP | PHRASING | `app base billing` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/billing-efficiency </li> |

## C181 - CANDIDATE GAP

*Timesheets - time intervals*  
Section: Test Cases > Reports > Timesheets  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/181)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/payroll-timesheet</li> |

## C315 - CANDIDATE GAP

*Work Orders Exceeding 24 Hours*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/315)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `activity timesheet` | `-` | C19247 C19248 C19249 C19250 C19251 C19252 | <li>Navigate to the 'Timesheet Activities' page</li> |
| 2 | CANDIDATE GAP | STRONG | `day punch record` | `record` | - | <li>The 'Timesheet Activities' page displays records for the time punch on the day it started</li> |
| 3 | CANDIDATE GAP | PHRASING | `exceed having punch` | `exceed` | - | <li>For the location, there is an active Work Order (WO) with at least one line having a time punch that exceeds 24 hours</li> |
| 4 | CANDIDATE GAP | PHRASING | `associated identify punch` | `associated` | - | <li>Identify the time punch record(s) associated with the WO</li> |
| 5 | CANDIDATE GAP | PHRASING | `days exceeding never` | `days` | - | <li>Time punch records are split over at least 2 days and never exceeding 24 hours</li> |

## C1011 - CONTRADICTS-OURS

*Default Ordering of Timesheet Activities*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1011)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `ordering filter activity` | `filter` | - | <li>Verify default filters and default activities ordering</li> |
| 2 | CONTRADICTS-OURS | STRONG | `filter staff set` | `staff` | C19251 | <li>By default 'Filter By Staff' is not set</li> |
| 3 | CANDIDATE GAP | STRONG | `interval filter month` | `filter` | - | <li>By default time interval filter is set to 'This Month'</li> |
| 4 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 5 | CANDIDATE GAP | STRONG | `interval ordering option` | `option` | - | <li>For each time filter interval option verify activities ordering</li> |
| 6 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 7 | CANDIDATE GAP | STRONG | `ordering pick member` | `member` | - | <li>Pick staff member in 'Filter By Staff' and verify activities ordering</li> |
| 8 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 9 | CANDIDATE GAP | STRONG | `interval ordering option` | `option` | - | <li>For the selected staff member verify activities ordering for each time filter interval option </li> |
| 10 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `filtered improved interval` | `filtered` | - | <strong>Currently time interval should be filtered before staff member...this will be improved in the future</strong></p> |

## C1328 - CONTRADICTS-OURS

*Create New Timesheet Activity (no pre-existing activity on the line)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1328)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `corner right new` | `right` | - | <li>Click on 'New' button in top right corner</li> |
| 2 | COVERED-BY | STRONG | `new modal time` | `-` | C19267 C19271 | <li>'New Timesheet Clock Time' modal opens</li> |
| 3 | COVERED-BY | STRONG | `dropdown work order` | `-` | C19267 C19272 | <li>'Work Order' dropdown is present</li> |
| 4 | COVERED-BY | STRONG | `field date` | `-` | C19267 C19268 C19269 C19274 C19275 | <li>'Start' date field is present</li> |
| 5 | COVERED-BY | STRONG | `field end date` | `-` | C19267 C19268 C19274 C19275 | <li>'End' date field is present</li> |
| 6 | CANDIDATE GAP | STRONG | `mandatory populate create` | `create` | - | <li>Populate all mandatory fields and click 'Create'</li> |
| 7 | COVERED-BY | STRONG | `close new modal` | `-` | C19271 | <li>'New Timesheet Clock Time' modal closes</li> |
| 8 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li>'Creation/change was successful' message appears <strong>(No error message upon creation)</strong></li> |
| 9 | COVERED-BY | STRONG | `new list time` | `-` | C19268 C19271 | <li>Verify new entry of clock-in time on the 'Timesheet Activities' list</li> |
| 10 | CANDIDATE GAP | STRONG | `new list visible` | `new` | C19249 C19250 C19291 | <li>New clock-in time is visible on the 'Timesheet Activities' list</li> |
| 11 | CANDIDATE GAP | STRONG | `added tim tab` | `tim` | - | <li>Navigate to WO's 'Timesheets' tab a verify clock-in times on the line it was added</li> |
| 12 | CONTRADICTS-OURS | STRONG | `line new time` | `line` | C19268 C19270 C19271 | <li>A new clock-in time is present on the line</li> |
| 13 | CANDIDATE GAP | STRONG | `lin tim tab` | `lin` | - | <li>Navigate to the WO's 'Lines' tab and verify clock-in times</li> |
| 14 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities </li> |
| 15 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the 'Progress' and 'Actual/Estimate'</li> |
| 16 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on 'Timesheets' tab</li> |

## C1338 - CANDIDATE GAP

*Create activity that starts and ends in same minute*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1338)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `ends minute create` | `create` | - | Create activity that starts and ends in same minute |

## C1339 - CANDIDATE GAP

*Overwrite activity that ends 1 minute after it starts*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1339)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `pick edit button` | `edit` | - | <li>Pick timesheet activity and click edit button</li> |
| 2 | CANDIDATE GAP | STRONG | `dialog edit activity` | `edit` | - | <li>Edit timesheet activity dialog opens</li> |
| 3 | CANDIDATE GAP | STRONG | `minute change end` | `change` | - | <li>Change end time to +1 minute</li> |
| 4 | CANDIDATE GAP | STRONG | `punch saved successfully` | `saved` | - | <li>Time punch is saved successfully.</li> |
| 5 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 6 | CANDIDATE GAP | PHRASING | `make minute sure` | `make` | - | <li><p>Make sure that Start time and End time are the same (same minute)</p></li> |

## C1730 - CANDIDATE GAP

*Create New Timesheet Activity (Line Has Tech Activity)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1730)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `tech lin time` | `lin` | - | <li>Tech user has clock-in time on all lines</li> |
| 2 | CANDIDATE GAP | STRONG | `corner right new` | `right` | - | <li>Click on 'New' button in top right corner</li> |
| 3 | COVERED-BY | STRONG | `new modal time` | `-` | C19267 C19271 | <li>'New Timesheet Clock Time' modal opens</li> |
| 4 | COVERED-BY | STRONG | `close new modal` | `-` | C19271 | <li>'New Timesheet Clock Time' modal closes</li> |
| 5 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li>'Creation/change was successful' message appears <strong>(No error message upon creation)</strong></li> |
| 6 | COVERED-BY | STRONG | `new list time` | `-` | C19268 C19271 | <li>Verify new entry of clock-in time on the 'Timesheet Activities' list</li> |
| 7 | CANDIDATE GAP | STRONG | `new list visible` | `new` | C19249 C19250 C19291 | <li>New clock-in time is visible on the 'Timesheet Activities' list</li> |
| 8 | CANDIDATE GAP | STRONG | `added tim tab` | `tim` | - | <li>Navigate to WO's 'Timesheets' tab a verify clock-in times on the line it was added</li> |
| 9 | CANDIDATE GAP | STRONG | `previou together record` | `record` | - | <li>A new clock-in time is present together with previous time records for the same line</li> |
| 10 | CANDIDATE GAP | STRONG | `lin tim tab` | `lin` | - | <li>Navigate to the WO's 'Lines' tab and verify clock-in times</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `mandatory populate privileg` | `mandatory` | - | <li>Populate all mandatory fields and click 'Create' (Use staff member with Tech privileges)</li> |
| 13 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the 'Progress' and 'Actual/Estimate'</li> |
| 14 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on 'Timesheets' tab</li> |

## C1731 - CONTRADICTS-OURS

*Create New Timesheet Activity (Line Has Admin Activity)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1731)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CONTRADICTS-OURS | STRONG | `lin time clock` | `lin` | C19270 C19278 | <li>Admin user has clock-in time on all lines</li> |
| 2 | CANDIDATE GAP | STRONG | `corner strong right` | `right` | - | <li>Click on <strong>New</strong> button in top right corner</li> |
| 3 | CANDIDATE GAP | STRONG | `strong new modal` | `new` | - | <li><strong>New Timesheet Clock Time</strong> modal opens</li> |
| 4 | CANDIDATE GAP | STRONG | `strong close new` | `close` | - | <li><strong>New Timesheet Clock Time</strong> modal closes</li> |
| 5 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li><strong>Creation/change was successful</strong> message appears (no error message upon creation)</li> |
| 6 | CANDIDATE GAP | STRONG | `strong new list` | `new` | - | <li>Verify new entry of clock-in time on the <strong>Timesheet Activities</strong> list</li> |
| 7 | CANDIDATE GAP | STRONG | `strong new list` | `new` | - | <li>New clock-in time is visible on the <strong>Timesheet Activities</strong> list</li> |
| 8 | CANDIDATE GAP | STRONG | `added strong tim` | `tim` | - | <li>Navigate to WO's <strong>Timesheets</strong> tab a verify clock-in times on the line it was added</li> |
| 9 | CANDIDATE GAP | STRONG | `previou together record` | `record` | - | <li>A new clock-in time is present together with previous time records for the same line</li> |
| 10 | CANDIDATE GAP | STRONG | `strong lin tim` | `lin` | - | <li>Navigate to the WO's <strong>Lines</strong> tab and verify clock-in times</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `mandatory populate privileg` | `mandatory` | - | <li>Populate all mandatory fields and click <strong>Create</strong> (Use staff member with Admin privileges)</li> |
| 13 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the <strong>Progress</strong> and <strong>Actual/Estimate</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on <strong>Timesheets</strong> tab</li> |

## C1788 - CANDIDATE GAP

*Create a New Timesheet Activity for a User Already Assigned to the Line*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1788)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `punch strong line` | `line` | - | <li>WO exists with <strong>admin</strong> user time punches on the line</li> |
| 2 | CANDIDATE GAP | STRONG | `already assigned create` | `create` | - | <li>Create a new timesheet activity for a user who is already assigned to the line</li> |
| 3 | COVERED-BY | STRONG | `tab line timesheet` | `-` | C19285 C19286 C19287 C19293 | <li>Verify WO line and WO timesheets tab</li> |
| 4 | COVERED-BY | STRONG | `created new activity` | `-` | C19268 C19269 C19271 | <li>A new timesheet activity is created</li> |
| 5 | CANDIDATE GAP | STRONG | `mentioned punch multiple` | `multiple` | - | <li>Multiple time punches exist on the line for the mentioned user</li> |
| 6 | CANDIDATE GAP | STRONG | `already punch create` | `create` | - | <li>Create a new timesheet activity for a user who already has time punches on the line</li> |
| 7 | COVERED-BY | STRONG | `tab line timesheet` | `-` | C19285 C19286 C19287 C19293 | <li>Verify WO line and WO timesheets tab</li> |
| 8 | COVERED-BY | STRONG | `created new activity` | `-` | C19268 C19269 C19271 | <li>A new timesheet activity is created</li> |
| 9 | CANDIDATE GAP | STRONG | `mentioned punch multiple` | `multiple` | - | <li>Multiple time punches exist on the line for the mentioned user</li> |
| 10 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 11 | CANDIDATE GAP | PHRASING | `base punch url` | `base` | - | <li>Navigate back to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `foreman process rol` | `foreman` | - | <li>Repeat the process for all user roles (Tech, Foreman...)</li> |

## C182 - CANDIDATE GAP

*Timesheet activities - columns*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/182)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 2 | CANDIDATE GAP | STRONG | `modify date time` | `date` | - | <li>Modify Date/Time</li> |
| 3 | CANDIDATE GAP | STRONG | `summed bottom valu` | `bottom` | - | <p>At he bottom there is Totals column with summed up values</p> |
| 4 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C183 - CANDIDATE GAP

*Timesheet activities - time intervals*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/183)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C184 - CANDIDATE GAP

*Timesheet activities - filter by staff*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/184)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `pick employee filter` | `employee` | - | <li>Click on Filter by staff dropdown and pick employee</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C185 - COVERED-BY

*Timesheet activities - select single row*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/185)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C186 - CANDIDATE GAP

*Timesheet activities - export button*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/186)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `.csv downloading file` | `file` | - | <li>.csv file starts downloading</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C287 - CANDIDATE GAP

*Timesheet activities - try to punch in time on department with technician from different location*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/287)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `location multiple department` | `location` | - | <li>There is same department in multiple locations (A and B)</li> |
| 2 | CANDIDATE GAP | STRONG | `punched location department` | `location` | - | <li>Technician punched in time for department in location A</li> |
| 3 | CANDIDATE GAP | STRONG | `location account logged` | `account` | C19279 | <li>User is logged in with admin account on location B</li> |
| 4 | CANDIDATE GAP | STRONG | `punch location visible` | `location` | - | <li>No time punches are visible on location B</li> |
| 5 | CANDIDATE GAP | PHRASING | `finding punch try` | `finding` | - | <li>Try finding time punches from technician on location A</li> |

## C1992 - CANDIDATE GAP

*Timesheet activities - Multiple Browsers*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1992)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `chrome strong using` | `using` | - | <li>User is logged in as Admin using <strong>Chrome</strong></li> |
| 2 | CANDIDATE GAP | STRONG | `assigned tech lin` | `lin` | - | <li>WO is created and tech is assigned to one of the lines</li> |
| 3 | CANDIDATE GAP | STRONG | `previously created` | `created` | - | <li>Navigate to the previously created WO</li> |
| 4 | CANDIDATE GAP | STRONG | `navigated previously created` | `created` | - | <li>User is navigated to the previously created WO</li> |
| 5 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged in and change any data on the line (on <strong>Edit Line</strong> modal)</li> |
| 6 | CANDIDATE GAP | STRONG | `edited strong successfully` | `successfully` | - | <li>Line is successfully <strong>edited</strong></li> |
| 7 | CANDIDATE GAP | STRONG | `strong started successfully` | `started` | - | <li>Line is successfully <strong>started</strong></li> |
| 8 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li><p>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged and verify:</p> |
| 9 | CANDIDATE GAP | STRONG | `strong tab timesheet` | `tab` | - | <li><strong>Timesheets</strong> tab</li> |
| 10 | CANDIDATE GAP | STRONG | `strong activity timesheet` | `activity` | - | <li><strong>Timesheets Activities</strong> page</li> |
| 11 | CANDIDATE GAP | STRONG | `strong export filter` | `export` | - | <li>Timesheets Activities <strong>export</strong> with filter set to <strong>Today</strong></li> |
| 12 | CANDIDATE GAP | STRONG | `strong record current` | `record` | - | <li>There are no record for the current WO and line in the <strong>Timesheets Activities</strong> page</li> |
| 13 | CANDIDATE GAP | STRONG | `export file current` | `current` | C19295 | <li>There is no data for the the current WO and line in the export file</li> |
| 14 | CANDIDATE GAP | STRONG | `strong tech back` | `back` | - | <li>Go back to the other browser where <strong>Tech</strong> user is logged in and click <strong>Stop</strong> on the line tech was working</li> |
| 15 | CANDIDATE GAP | STRONG | `stopped strong successfully` | `successfully` | - | <li>Line is successfully <strong>stopped</strong></li> |
| 16 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li><p>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged and verify:</p> |
| 17 | CANDIDATE GAP | STRONG | `strong tab timesheet` | `tab` | - | <li><strong>Timesheets</strong> tab</li> |
| 18 | CANDIDATE GAP | STRONG | `strong activity timesheet` | `activity` | - | <li><strong>Timesheets Activities</strong> page</li> |
| 19 | CANDIDATE GAP | STRONG | `strong export filter` | `export` | - | <li>Timesheets Activities <strong>export</strong> with filter set to <strong>Today</strong></li> |
| 20 | CANDIDATE GAP | STRONG | `match strong record` | `record` | - | <li>There are one record for the current WO and line in the <strong>Timesheets Activities</strong> page that matches Timesheets tab data</li> |
| 21 | CANDIDATE GAP | STRONG | `match export file` | `export` | - | <li>There is one record for the the current WO and line in the export file that matches Timesheets tab data</li> |
| 22 | CANDIDATE GAP | PHRASING | `assign strong tech` | `assign` | - | <li>Create new WO and assign <strong>Tech</strong> to one of the line</li> |
| 23 | CANDIDATE GAP | PHRASING | `chrome edge etc` | `chrome` | - | <li>Open any browser <strong>other than</strong> Chrome (Edge, Firefox, Opera, etc. |
| 24 | CANDIDATE GAP | PHRASING | `login strong tech` | `login` | - | ) and login as <strong>Tech</strong></li> |
| 25 | CANDIDATE GAP | PHRASING | `chrome strong tech` | `chrome` | - | <li>User is logged in as a <strong>Tech</strong> using any browser other than Chrome</li> |
| 26 | CANDIDATE GAP | PHRASING | `edited previously strong` | `edited` | - | <li>Go back to the other browser where <strong>Tech</strong> user is logged in and click <strong>Start</strong> on the previously edited line</li> |
| 27 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time</li> |
| 28 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time on the line reflect data on the Timesheets tab</li> |
| 29 | CANDIDATE GAP | PHRASING | `recorded strong timestamp` | `recorded` | - | <li>There is one recorded with <strong>Start Date</strong> timestamp and <strong>Active</strong> badge for <strong>End Time</strong> on the Timesheets tab</li> |
| 30 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time</li> |
| 31 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time on the line reflect data on the Timesheets tab</li> |
| 32 | CANDIDATE GAP | PHRASING | `recorded strong timestamp` | `recorded` | - | <li>There is one recorded with <strong>Start Date</strong> timestamp and <strong>End Time</strong> timestamp on the Timesheets tab</li> |

## C187 - COVERED-BY

*Work In Progress - Pending Authorization*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/187)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C188 - COVERED-BY

*Work In Progress - In Progress*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/188)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C189 - COVERED-BY

*Work In Progress - Ready To Invoice*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/189)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C190 - CANDIDATE GAP

*Advisor Analysis - Columns*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/190)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <ul><li>Verify all visible columns in the table</li></ul> |
| 2 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <ul><li>Verify all visible columns in the table</li></ul> |
| 3 | CANDIDATE GAP | STRONG | `ligatur variant font` | `font` | - | font-variant-ligatures: |
| 4 | CANDIDATE GAP | STRONG | `caps variant font` | `font` | - | font-variant-caps: |
| 5 | CANDIDATE GAP | STRONG | `decoration text style` | `style` | - | text-decoration-style: |
| 6 | CANDIDATE GAP | PHRASING | `analysi app base` | `analysi` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 7 | CANDIDATE GAP | PHRASING | `billing cost customer` | `billing` | - | <ul><li>Date</li><li>Invoice</li><li>Customer</li><li>Advisor</li><li>Days Open</li><li>Lines</li><li>Hrs Worked</li><li id="isPasted">Hrs Invoiced</li><li>Hrs Profit</li><li>Billing Efficiency</li><li>ELR</li><li>Parts  |
| 8 | CANDIDATE GAP | PHRASING | `1036123 12345 2025` | `1036123` | - | <ul id="isPasted"><li>Date (e.g., <strong>Nov 21 2025</strong>)</li><li>Invoice (e.g., <strong>S3-12345</strong>)</li><li>Customer (e.g., <strong>1036123 AB LTD O/A HYDR...</strong>) → Max: |
| 9 | CANDIDATE GAP | PHRASING | `char color glavi` | `char` | - | <strong>23</strong> chars</li><li>Advisor (e.g., <strong>Nebojsa Glavi..</strong><span style='color: |
| 10 | CANDIDATE GAP | PHRASING | `nunito sans serif` | `nunito` | - | "Nunito Sans", sans-serif; |
| 11 | CANDIDATE GAP | PHRASING | `stroke text webkit` | `stroke` | - | webkit-text-stroke-width: |
| 12 | CANDIDATE GAP | PHRASING | `245 247 250` | `245` | - | rgb(245, 247, 250); |
| 13 | CANDIDATE GAP | PHRASING | `decoration text thickness` | `decoration` | - | text-decoration-thickness: |
| 14 | CANDIDATE GAP | PHRASING | `color decoration text` | `color` | - | text-decoration-color: |
| 15 | CANDIDATE GAP | PHRASING | `max none span` | `max` | - | none'><strong>.</strong>) </span>→ Max: |
| 16 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 $33.33` | `$0.00` | - | <strong>13</strong> chars</li><li>Days Open (e.g., <strong>2</strong>,<strong> </strong><strong>0</strong>)</li><li>Lines (e.g., <strong id="isPasted">1</strong>,<strong id="isPasted"> 0</strong>)</li><li>Hrs Worked (e.g |
| 17 | CANDIDATE GAP | PHRASING | `$0.00 $80.97 invoice` | `$0.00` | - | pre" id="isPasted">)</span></li><li>Parts Invoice (e.g., <strong>$80.97</strong><strong id="isPasted">, $0.00</strong><span style="white-space: |
| 18 | CANDIDATE GAP | PHRASING | `$0.00 $80.97 ispasted` | `$0.00` | - | pre">)</span></li><li>Parts Profit (e.g., <strong id="isPasted">$80.97</strong><strong>, $0.00</strong><span style="white-space: |
| 19 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 7.33%` | `$0.00` | - | pre">)</span></li><li>Parts Margin ( e.g., <strong>7.33%, N/A</strong>)</li><li>Total Profit (e.g., <strong id="isPasted">$142.59, $0.00</strong><span style="white-space: |
| 20 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 27.73%` | `$0.00` | - | pre">)</span></li><li>Total Margin ( e.g., <strong>27.73%,</strong><strong> N/A</strong>)</li><li>Subtotal (e.g., <strong id="isPasted">$142.59, $0.00</strong><span style="white-space: |

## C191 - CANDIDATE GAP

*Advisor Analysis - Filters*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/191)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `analysi app base` | `analysi` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 3 | CANDIDATE GAP | PHRASING | `interval ispasted strong` | `interval` | - | <ul><li><strong>Filter By Advisor</strong> exists</li><li><strong>Time interval filter</strong> exists:</li></ul><ul id="isPasted"><ul style="list-style-type: |
| 4 | CANDIDATE GAP | PHRASING | `disc quarter strong` | `disc` | - | disc"><li>Today</li><li>Yesterday</li><li>This Week</li><li>Last Week</li><li>This Month → <strong>Default</strong></li><li>Last Month</li><li>This Year</li><li>Last Year</li><li>This Quarter</li><li>Last Quarter</li><li |

## C192 - CANDIDATE GAP

*Advisor Analytics - Filter By Advisor*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/192)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `pick strong advisor` | `advisor` | - | <ul><li>Click on <strong>Filter By Advisor</strong> dropdown and pick advisor</li></ul> |
| 2 | CANDIDATE GAP | PHRASING | `analysi app base` | `analysi` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |

## C281 - CANDIDATE GAP

*Advisor Analysis - Totals*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/281)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `except valu total` | `valu` | - | <li><p>There are total values for all columns except for: |
| 2 | CANDIDATE GAP | STRONG | `margin style change` | `style` | - | <ul><li>Change date range and verify if totals are correct for selected range<ul><li style="margin: |
| 3 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 4 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 5 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 6 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 7 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 8 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 9 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 10 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 11 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 12 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 13 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 14 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 15 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 16 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 17 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 18 | CANDIDATE GAP | STRONG | `disc margin style` | `style` | - | disc">This Week</li><li style="margin: |
| 19 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 20 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 21 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 22 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 23 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 24 | CANDIDATE GAP | STRONG | `disc margin last` | `last` | - | disc">Last Week</li><li style="margin: |
| 25 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 26 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 27 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 28 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 29 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 30 | CANDIDATE GAP | STRONG | `disc margin style` | `style` | - | disc">This Month</li><li style="margin: |
| 31 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 32 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 33 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 34 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 35 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 36 | CANDIDATE GAP | STRONG | `disc margin last` | `last` | - | disc">Last Month</li><li style="margin: |
| 37 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 38 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 39 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 40 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 41 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 42 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 43 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 44 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 45 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 46 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 47 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 48 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 49 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 50 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 51 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 52 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 53 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 54 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 55 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 56 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 57 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 58 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 59 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 60 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 61 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 62 | CANDIDATE GAP | STRONG | `total correct selected` | `total` | C19274 | <ul><li>Totals are correct for selected date range</li></ul> |
| 63 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 64 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 65 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 66 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 67 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 68 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 69 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 70 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 71 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 72 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 73 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 74 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 75 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 76 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 77 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 78 | CANDIDATE GAP | STRONG | `disc margin style` | `style` | - | disc">This Week</li><li style="margin: |
| 79 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 80 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 81 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 82 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 83 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 84 | CANDIDATE GAP | STRONG | `disc margin last` | `last` | - | disc">Last Week</li><li style="margin: |
| 85 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 86 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 87 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 88 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 89 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 90 | CANDIDATE GAP | STRONG | `disc margin style` | `style` | - | disc">This Month</li><li style="margin: |
| 91 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 92 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 93 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 94 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 95 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 96 | CANDIDATE GAP | STRONG | `disc margin last` | `last` | - | disc">Last Month</li><li style="margin: |
| 97 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 98 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 99 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 100 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 101 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 102 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 103 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 104 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 105 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 106 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 107 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 108 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 109 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 110 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 111 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 112 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 113 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 114 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 115 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 116 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 117 | CANDIDATE GAP | STRONG | `optical sizing font` | `font` | - | font-optical-sizing: |
| 118 | CANDIDATE GAP | STRONG | `adjust size font` | `font` | - | font-size-adjust: |
| 119 | CANDIDATE GAP | STRONG | `feature setting font` | `font` | - | font-feature-settings: |
| 120 | CANDIDATE GAP | STRONG | `setting variation font` | `font` | - | font-variation-settings: |
| 121 | CANDIDATE GAP | STRONG | `type style list` | `style` | - | list-style-type: |
| 122 | CANDIDATE GAP | STRONG | `advisor total correct` | `advisor` | C19248 | <ul><li>Totals are correct for selected Advisor</li></ul> |
| 123 | CANDIDATE GAP | PHRASING | `analysi app base` | `analysi` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 124 | CANDIDATE GAP | PHRASING | `summary table whole` | `summary` | - | <li>Verify Totals summary for whole table</li> |
| 125 | CANDIDATE GAP | PHRASING | `customer invoice number` | `customer` | - | <br />Date, Invoice NUmber, Customer, Service Advisor</p></li> |
| 126 | CANDIDATE GAP | PHRASING | `100 billing corresponding` | `100` | - | <ul><li>Verify Totals summary for entire table (on the bottom of the table)</li></ul><p>Note:</p><ul><li id="isPasted">All totals are calculated as the sum of the corresponding row values except:<ul><li>Parts Margin → (< |
| 127 | CANDIDATE GAP | PHRASING | `customer except invoice` | `customer` | - | <ul><li>There are total values for all columns except for:<ul><li>Date</li><li>Invoice Number</li><li>Customer</li><li>Advisor</li></ul></li></ul> |
| 128 | CANDIDATE GAP | PHRASING | `disc ispasted margin` | `disc` | - | disc" id="isPasted">Today</li><li style="margin: |
| 129 | CANDIDATE GAP | PHRASING | `disc margin yesterday` | `disc` | - | disc">Yesterday</li><li style="margin: |
| 130 | CANDIDATE GAP | PHRASING | `disc margin year` | `disc` | - | disc">This Year</li><li style="margin: |
| 131 | CANDIDATE GAP | PHRASING | `disc margin year` | `disc` | - | disc">Last Year</li><li style="margin: |
| 132 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">This Quarter</li><li style="margin: |
| 133 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">Last Quarter</li><li style="margin: |
| 134 | CANDIDATE GAP | PHRASING | `following margin rang` | `following` | - | <ul><li>Filter by any Advisor and all of the following date ranges:<ul><li style="margin: |
| 135 | CANDIDATE GAP | PHRASING | `disc ispasted margin` | `disc` | - | disc" id="isPasted">Today</li><li style="margin: |
| 136 | CANDIDATE GAP | PHRASING | `disc margin yesterday` | `disc` | - | disc">Yesterday</li><li style="margin: |
| 137 | CANDIDATE GAP | PHRASING | `disc margin year` | `disc` | - | disc">This Year</li><li style="margin: |
| 138 | CANDIDATE GAP | PHRASING | `disc margin year` | `disc` | - | disc">Last Year</li><li style="margin: |
| 139 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">This Quarter</li><li style="margin: |
| 140 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">Last Quarter</li><li style="margin: |

## C27259 - CANDIDATE GAP

*Advisor Analysis - Row click opens WO Finance (gated by workOrdersView)*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `SV-5982` · [open](https://shopview.testrail.io/index.php?/cases/view/27259)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `analysi advisor contain` | `advisor` | - | <p>Open the Service Advisor Analysis report (default this_month range contains the seeded WO)</p> |
| 2 | CANDIDATE GAP | STRONG | `finish table loading` | `loading` | - | <p>Wait for the table to finish loading</p> |
| 3 | CANDIDATE GAP | PHRASING | `assigned dated invoiced` | `assigned` | - | <p>Owner/admin logged in (reports project storage state)<br />An invoiced WO with a Service Advisor assigned exists in the active workplace, dated within this_month (seeded via API)</p> |
| 4 | CANDIDATE GAP | PHRASING | `cell invoice number` | `cell` | - | <p>Click the seeded row's invoice cell (service_advisor_cell_invoice_number_&lt;woId&gt;)</p> |

## C193 - CANDIDATE GAP

*Sales - columns*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/193)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns i table</li> |
| 2 | CANDIDATE GAP | STRONG | `invoiced total hour` | `total` | - | <li>Total Invoiced Hours</li> |
| 3 | CANDIDATE GAP | STRONG | `invoiced labour total` | `total` | - | <li>Total Labour Invoiced</li> |
| 4 | CANDIDATE GAP | STRONG | `invoiced part total` | `part` | - | <li>Total Parts Invoiced</li> |
| 5 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales</li> |

## C194 - CANDIDATE GAP

*Sales - Custom time interval*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/194)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 3 | CANDIDATE GAP | STRONG | `dialog manually end` | `end` | - | <li>Dialog opens with start and end date that should be set manually</li> |
| 4 | COVERED-BY | STRONG | `end set date` | `-` | C19252 C19253 C19268 | <li>Set start and end date</li> |
| 5 | CANDIDATE GAP | STRONG | `filled rage dat` | `dat` | - | <li>All shown results are in the rage of dates that were filled in.</li> |
| 6 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales</li> |

## C1941 - CANDIDATE GAP

*Sales - time intervals*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1941)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 3 | CANDIDATE GAP | STRONG | `described frame result` | `result` | - | <li>All results are in described time frame</li> |
| 4 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales</li> |

## C195 - CANDIDATE GAP

*Follow Up - columns*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/195)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns i table</li> |
| 2 | CANDIDATE GAP | STRONG | `number work order` | `work` | - | <li>Number of Work Orders</li> |
| 3 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales-follow-up</li> |

## C196 - CANDIDATE GAP

*Follow Up - visits in period*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/196)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `visit valu field` | `valu` | - | <li>Verify all the values in the "Visits" dropdown field</li> |
| 2 | CANDIDATE GAP | STRONG | `visit last month` | `last` | - | <li>Visits in last 3 months</li> |
| 3 | CANDIDATE GAP | STRONG | `visit last month` | `last` | - | <li>Visits in last 6 months</li> |
| 4 | CANDIDATE GAP | STRONG | `visit last month` | `last` | - | <li>Visits in last 12 months</li> |
| 5 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales-follow-up</li> |

## C197 - COVERED-BY

*Follow Up - Contacts*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/197)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales-follow-up</li> |
| 2 | CANDIDATE GAP | PHRASING | `contact down drop` | `contact` | - | <li>List of contacts drops down</li> |

## C282 - CANDIDATE GAP

*Sales - Totals*  
Section: Test Cases > Reports > Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/282)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `except valu total` | `valu` | - | <li><p>There are total values for all columns except for: |
| 2 | CANDIDATE GAP | STRONG | `except valu total` | `valu` | - | <li><p>There are total values for all columns except for: |
| 3 | CANDIDATE GAP | STRONG | `invoice number date` | `date` | - | <br />Invoice Date<br />Invoice Number</p></li> |
| 4 | CANDIDATE GAP | STRONG | `change total correct` | `change` | C19248 | <li>Change date range and verify id totals are correct for selected range</li> |
| 5 | CANDIDATE GAP | STRONG | `total correct selected` | `total` | C19274 | <li>Totals are correct for selected date range</li> |
| 6 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/sales</li> |
| 7 | CANDIDATE GAP | PHRASING | `summary table whole` | `summary` | - | <li>Verify Totals summary for whole table</li> |
| 8 | CANDIDATE GAP | PHRASING | `customer invoice number` | `customer` | - | <br />Date, Invoice NUmber, Customer, Service Advisor</p></li> |
| 9 | CANDIDATE GAP | PHRASING | `entire summary table` | `entire` | - | <li>Verify Totals summary for entire table (on the bottom of the table)</li> |

## C2356 - CANDIDATE GAP

*Verify IBS Management Tabs*  
Section: Test Cases > Reports > IBS Management  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2356)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `ready send active` | `active` | - | <li>Ready To Send (default/active)</li> |
| 2 | CANDIDATE GAP | STRONG | `content table available` | `available` | - | Its content loads (table headers + data if available) </li> |
| 3 | CANDIDATE GAP | STRONG | `tabs remain visible` | `remain` | - | <li>Other tabs remain visible</li> |
| 4 | CANDIDATE GAP | STRONG | `content table available` | `available` | - | Its content loads (table headers + data if available)</li> |
| 5 | CANDIDATE GAP | STRONG | `tabs remain visible` | `remain` | - | <li>Other tabs remain visible</li> |
| 6 | CANDIDATE GAP | STRONG | `content table available` | `available` | - | Its content loads (table headers + data if available)</li> |
| 7 | CANDIDATE GAP | STRONG | `tabs remain visible` | `remain` | - | <li>Other tabs remain visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `base batch transaction` | `base` | - | <li>Navigate to {{BASE_URL}}/reports/batch-transactions page</li> |
| 9 | CANDIDATE GAP | PHRASING | `following nam tabs` | `following` | - | <li><p>Tabs are displayed with the following names:</p> |
| 10 | CANDIDATE GAP | PHRASING | `sent strong switch` | `sent` | - | <li>Switch to <strong>Sent</strong> tab</li> |
| 11 | CANDIDATE GAP | PHRASING | `becom sent strong` | `becom` | - | <li><strong>Sent</strong> becomes the active tab. |
| 12 | CANDIDATE GAP | PHRASING | `payment strong switch` | `payment` | - | <li>Switch to <strong>Payments</strong> tab</li> |
| 13 | CANDIDATE GAP | PHRASING | `becom payment strong` | `becom` | - | <li><strong>Payments</strong> becomes the active tab. |
| 14 | CANDIDATE GAP | PHRASING | `ready send strong` | `ready` | - | <li>Return to <strong>Ready To Send</strong></li> |
| 15 | CANDIDATE GAP | PHRASING | `becom ready send` | `becom` | - | <li><strong>Ready To Send</strong> becomes the active tab. |

## C198 - CANDIDATE GAP

*Ready to Send - Verify columns*  
Section: Test Cases > Reports > IBS Management > Batch transactions - Ready to Send  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/198)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 2 | CANDIDATE GAP | STRONG | `checkbox dot menu` | `dot` | - | <li>Checkboxes (with 3-dot menu)</li> |
| 3 | CANDIDATE GAP | PHRASING | `app base batch` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/batch-transactions</li> |

## C199 - CANDIDATE GAP

*Create batch*  
Section: Test Cases > Reports > IBS Management > Batch transactions - Ready to Send  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/199)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `.csv downloaded file` | `file` | - | <li>.csv file is downloaded</li> |
| 2 | CANDIDATE GAP | STRONG | `longer exported rows` | `exported` | - | <li>The rows from the list are exported and are no longer on the list</li> |
| 3 | CANDIDATE GAP | PHRASING | `app base batch` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/batch-transactions</li> |
| 4 | CANDIDATE GAP | PHRASING | `checkbox corner left` | `checkbox` | - | <li>Select first checkbox in top left corner</li> |
| 5 | CANDIDATE GAP | PHRASING | `below box checked` | `below` | - | <li>All the boxes below are checked</li> |

## C200 - CANDIDATE GAP

*Sent - Verify columns*  
Section: Test Cases > Reports > IBS Management > Batch transactions - Sent  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/200)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `sent strong tab` | `tab` | - | <li>Click on <strong>Sent</strong> tab</li> |
| 2 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 3 | CANDIDATE GAP | STRONG | `checkbox dot menu` | `dot` | - | <li>Checkboxes (with 3-dot menu)</li> |
| 4 | CANDIDATE GAP | PHRASING | `app base batch` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/batch-transactions</li> |

## C201 - CANDIDATE GAP

*Make Payment*  
Section: Test Cases > Reports > IBS Management > Batch transactions - Sent  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/201)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `method payment set` | `set` | - | <li>Set payment Method</li> |
| 2 | CANDIDATE GAP | STRONG | `number reference set` | `set` | - | <li>Set Reference number</li> |
| 3 | CANDIDATE GAP | STRONG | `day trying message` | `message` | - | <li>When trying to select that day again there is message over it: |
| 4 | CANDIDATE GAP | PHRASING | `app base batch` | `app` | - | <li>App is navigated to page {{BASE_URL}}/batch-transactions</li> |
| 5 | CANDIDATE GAP | PHRASING | `corner left sent` | `corner` | - | <li>Sent option in the top left corner is selected</li> |
| 6 | CANDIDATE GAP | PHRASING | `checkbox corner expand` | `checkbox` | - | <li>Select first checkbox in top left corner and expand it</li> |
| 7 | CANDIDATE GAP | PHRASING | `below box checked` | `below` | - | <li>All the boxes from the expanded rows below are checked</li> |
| 8 | CANDIDATE GAP | PHRASING | `batch dialog payment` | `batch` | - | <li>New Batch Payment dialog opens</li> |
| 9 | CANDIDATE GAP | PHRASING | `batch changed paid` | `batch` | - | <li>Status of the batch changed to Paid</li> |
| 10 | CANDIDATE GAP | PHRASING | `batch payed transaction` | `batch` | - | <li><p>Navigate to WO that is payed via Batch Transaction</p></li> |
| 11 | CANDIDATE GAP | PHRASING | `batch ibs transaction` | `batch` | - | <li><p>IBS batch transaction is visible</p></li> |
| 12 | CANDIDATE GAP | PHRASING | `hidden reverse transaction` | `hidden` | - | <li><p>Reverse button is hidden for this transaction</p></li> |

## C202 - CANDIDATE GAP

*Payments - Verify columns*  
Section: Test Cases > Reports > IBS Management > Batch transactions - Payments  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/202)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 2 | CANDIDATE GAP | STRONG | `payment strong tab` | `tab` | - | <li>Click on <strong>Payments</strong> tab</li> |
| 3 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 4 | CANDIDATE GAP | STRONG | `single list row` | `list` | - | <li>Click on the single row from the list</li> |
| 5 | CANDIDATE GAP | STRONG | `collapsed rows` | `rows` | - | <li>Rows are collapsed by default</li> |
| 6 | CANDIDATE GAP | PHRASING | `app base batch` | `app` | - | <li>App is navigated to page {{BASE_URL}}/batch-transactions</li> |
| 7 | CANDIDATE GAP | PHRASING | `corner left payment` | `corner` | - | <li>Click on Payments option from the menu in the top left corner</li> |
| 8 | CANDIDATE GAP | PHRASING | `every expand payment` | `every` | - | <li>After click, row expands and every single payment is visible</li> |

## C203 - CANDIDATE GAP

*Export reports - happy flow*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/203)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | <li>Click on Reports link in EXPORT section (menu on the right side)</li> |
| 2 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | <li>Click on Reports link in EXPORT section (menu on the right side)</li> |
| 3 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports</li> |

## C204 - CONTRADICTS-OURS

*Export reports - empty report name*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/204)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | Click on Reports link in EXPORT section (menu on the right side) |
| 2 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | Click on Reports link in EXPORT section (menu on the right side) |
| 3 | CONTRADICTS-OURS | STRONG | `name empty set` | `name` | C19268 C19270 | Report Name is set to be empty |
| 4 | CANDIDATE GAP | STRONG | `required name field` | `required` | C19274 | Report Name is a required field |
| 5 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | App is navigated to page {{BASE_URL}}/reports |

## C205 - CONTRADICTS-OURS

*Export reports - empty date range*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/205)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | Click on Reports link in EXPORT section (menu on the right side) |
| 2 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | Click on Reports link in EXPORT section (menu on the right side) |
| 3 | CONTRADICTS-OURS | STRONG | `empty range set` | `empty` | C19251 C19253 | Set Date Range to be empty |
| 4 | CONTRADICTS-OURS | STRONG | `required field range` | `range` | C19269 | Date Range is a required field |
| 5 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | App is navigated to page {{BASE_URL}}/reports |

## C206 - CANDIDATE GAP

*Export reports - select date with no results*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/206)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | <li>Click on Reports link in EXPORT section (menu on the right side)</li> |
| 2 | CANDIDATE GAP | STRONG | `link section export` | `export` | - | <li>Click on Reports link in EXPORT section (menu on the right side)</li> |
| 3 | CANDIDATE GAP | STRONG | `doesn record range` | `record` | - | <li>Select Date Range for the date that doesn't have records</li> |
| 4 | CANDIDATE GAP | STRONG | `didnt yield export` | `export` | - | 'Export didnt yield any results'</li> |
| 5 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports</li> |

## C1329 - CANDIDATE GAP

*Export Report - Payroll Timesheet*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1329)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `left side tab` | `side` | - | <li>Click on 'Reports' tab on the left side of the screen</li> |
| 2 | CANDIDATE GAP | STRONG | `payroll name dropdown` | `name` | - | <li>From the 'Report Name' dropdown select 'Payroll Timesheet'</li> |
| 3 | CANDIDATE GAP | STRONG | `payroll option selected` | `option` | - | <li>'Payroll Timesheet' option is selected</li> |
| 4 | CANDIDATE GAP | STRONG | `specified dat option` | `dat` | - | <li>'Custom' option is selected with specified 'Start' and 'End' dates</li> |
| 5 | CANDIDATE GAP | STRONG | `csv downloaded file` | `file` | - | <li>CSV file is downloaded</li> |
| 6 | CANDIDATE GAP | STRONG | `csv file data` | `file` | - | <li>Open CSV file and verify its data</li> |
| 7 | CANDIDATE GAP | STRONG | `following column visible` | `column` | - | <li><p>Following columns are visible:</p> |
| 8 | CANDIDATE GAP | STRONG | `grouped name employee` | `name` | - | <li>Employee Name (data is grouped by Employee Name)</li> |
| 9 | CANDIDATE GAP | STRONG | `$employeename strong employee` | `employee` | - | <li><strong>Total for $employeeName</strong> row is present for each employee</li> |
| 10 | COVERED-BY | STRONG | `internal name employee` | `-` | C19248 | <tr><th>Employee Name</th><th>Date</th><th>Total Hours</th><th>WO Hours</th><th>Internal Hours</th></tr> |
| 11 | CANDIDATE GAP | STRONG | `csv file option` | `file` | - | <li>Download CSV file for each 'Date Range' dropdown option and verify its data</li> |
| 12 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 13 | CANDIDATE GAP | PHRASING | `1st 28th pick` | `1st` | - | <li>From the 'Date Range' dropdown select 'Custom' and pick 'Start' and 'End' date (e.g., September 1st to 28th )</li> |
| 14 | CANDIDATE GAP | PHRASING | `format newest oldest` | `format` | - | <li>Date (dates are sorted from the oldest to the newest per employee with <strong>yyyy-mm-dd</strong> format)</li> |
| 15 | CANDIDATE GAP | PHRASING | `$employeename class table` | `$employeename` | - | <tr><td class="table-data">$employeeName</td class="table-data"><td class="table-data"></td class="table-data"><td class="table-data"></td class="table-data"><td class="table-data"></td class="table-data"><td class="tabl |
| 16 | CANDIDATE GAP | PHRASING | `2024 class table` | `2024` | - | <tr><td class="table-data"></td class="table-data"><td class="table-data">2024-09-01</td class="table-data"><td class="table-data">1</td class="table-data"><td class="table-data">1</td class="table-data"><td class="table |
| 17 | CANDIDATE GAP | PHRASING | `2024 class table` | `2024` | - | <tr><td class="table-data"></td class="table-data"><td class="table-data">2024-09-15</td class="table-data"><td class="table-data">2</td class="table-data"><td class="table-data">0</td class="table-data"><td class="table |
| 18 | CANDIDATE GAP | PHRASING | `2024 class table` | `2024` | - | <tr><td class="table-data"></td class="table-data"><td class="table-data">2024-09-28</td class="table-data"><td class="table-data">3</td class="table-data"><td class="table-data">3</td class="table-data"><td class="table |
| 19 | CANDIDATE GAP | PHRASING | `$employeename class table` | `$employeename` | - | <tr><td class="table-data">Total for $employeeName</td class="table-data"><td class="table-data"></td class="table-data"><td class="table-data">6</td class="table-data"><td class="table-data">4</td class="table-data"><td |
| 20 | CANDIDATE GAP | PHRASING | `csv format grouping` | `csv` | - | <li>CSV file has same columns with same formats, grouping, and sorting</li> |

## C1771 - CANDIDATE GAP

*Journal Entry - Download*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1771)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `strong side menu` | `side` | - | <li>Click on <strong>Reports</strong> on the side menu</li> |
| 2 | CANDIDATE GAP | STRONG | `strong export modal` | `export` | - | <li><strong>Export Report</strong> modal opens</li> |
| 3 | CANDIDATE GAP | STRONG | `journal strong name` | `name` | - | <li>Under <strong>Report Name</strong> dropdown select <strong>Journal Entry</strong></li> |
| 4 | CANDIDATE GAP | STRONG | `strong range date` | `range` | - | <li>Under <strong>Date Range</strong> select any range</li> |
| 5 | CANDIDATE GAP | STRONG | `journal selected entry` | `selected` | - | <li>Journal Entry is selected</li> |
| 6 | COVERED-BY | STRONG | `selected range date` | `-` | C19249 C19250 C19253 | <li>Date range is selected</li> |
| 7 | CANDIDATE GAP | STRONG | `strong export close` | `export` | - | <li><strong>Export Report</strong> modal closes</li> |
| 8 | CANDIDATE GAP | STRONG | `corner bottom message` | `bottom` | - | <li>Success message appears in the bottom right corner: |
| 9 | CANDIDATE GAP | STRONG | `strong exported successfully` | `exported` | - | <strong>Data exported successfully.</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `downloaded entry.csv journal` | `downloaded` | - | <li>File is successfully downloaded as <strong>journal_entry.csv</strong></li> |

## C1772 - CONTRADICTS-OURS

*Journal Entry - Date Range*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1772)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `journal strong option` | `option` | - | <li>Verify <strong>Date Range</strong> dropdown options for <strong>Journal Entry</strong></li> |
| 2 | CONTRADICTS-OURS | STRONG | `option range date` | `option` | C19251 C19253 C19273 | <p>Date Range options are:</p> |
| 3 | CANDIDATE GAP | STRONG | `pick strong custom` | `custom` | - | <li>Select <strong>Custom</strong> range and pick any <strong>Start</strong> and <strong>End</strong> date</li> |
| 4 | CANDIDATE GAP | STRONG | `journal strong export` | `export` | - | <li>Download export file and verify <strong>Journal Date</strong> column values are within selected range</li> |
| 5 | CANDIDATE GAP | STRONG | `journal strong valu` | `valu` | - | <li><strong>Journal Date</strong> values are within selected range</li> |
| 6 | CANDIDATE GAP | STRONG | `strong option dropdown` | `option` | - | <li>Repeat <strong>Step 2</strong> for all other <strong>Date Range</strong> dropdown options</li> |
| 7 | CANDIDATE GAP | STRONG | `journal strong valu` | `valu` | - | <li><strong>Journal Date</strong> values are within selected range</li> |

## C1773 - CANDIDATE GAP

*Journal Entry - Export Structure*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `https://shopview.atlassian.net/browse/SV-2012` · [open](https://shopview.testrail.io/index.php?/cases/view/1773)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `happened journal action` | `action` | - | <li>Journal Date (Date on which action happened |
| 2 | CANDIDATE GAP | STRONG | `invoiced reversed action` | `action` | - | actions are invoiced or reversed)</li> |
| 3 | CANDIDATE GAP | STRONG | `amount journal total` | `total` | - | <li>Amount (Total value of the journal entry)</li> |
| 4 | CANDIDATE GAP | STRONG | `class shop location` | `location` | - | <li>Class (Shop location)</li> |
| 5 | CANDIDATE GAP | STRONG | `adjustment false alway` | `alway` | - | <li>Is Adjustment (Always set to FALSE)</li> |
| 6 | CANDIDATE GAP | PHRASING | `downloaded journal strong` | `downloaded` | - | <li><strong>Journal Entry</strong> report is downloaded</li> |
| 7 | CANDIDATE GAP | PHRASING | `journal strong structure` | `journal` | - | <li>Verify <strong>Journal Entry</strong> report column structure</li> |
| 8 | CANDIDATE GAP | PHRASING | `$sequencenumber journal strong` | `$sequencenumber` | - | <li>Journal No ( <strong>SV-$sequenceNumber</strong> )</li> |
| 9 | CANDIDATE GAP | PHRASING | `depending inventory special` | `depending` | - | <li>Account (Inventory or Special depending on action)</li> |
| 10 | CANDIDATE GAP | PHRASING | `description strong todo` | `description` | - | <li>Description ( <strong>TODO</strong> )</li> |
| 11 | CANDIDATE GAP | PHRASING | `decrease inventory invoicing` | `decrease` | - | <li>invoicing a WO with an inventory part on it (action-inventory decrease)</li> |
| 12 | CANDIDATE GAP | PHRASING | `increase inventory reversing` | `increase` | - | <li>reversing a WO with a inventory part on it (action-inventory increase)</li> |
| 13 | CANDIDATE GAP | PHRASING | `cost counting cycle` | `cost` | - | <li>cycle counting down the qty or cost (action-inventory decrease)</li> |
| 14 | CANDIDATE GAP | PHRASING | `cost counting cycle` | `cost` | - | <li>cycle counting up the qty or cost (action-inventory increase)</li> |
| 15 | CANDIDATE GAP | PHRASING | `decrease inventory transferring` | `decrease` | - | <li>transferring to another location (action-inventory decrease)</li> |
| 16 | CANDIDATE GAP | PHRASING | `increase inventory receiving` | `increase` | - | <li>receiving inventory from another location (action-inventory increase)</li> |

## C1774 - CANDIDATE GAP

*Journal Entry - Export Results After Inventory Part is Invoiced*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1774)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 2 | CANDIDATE GAP | STRONG | `inventory strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Inventory account</li> |
| 3 | CANDIDATE GAP | STRONG | `decrease inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Decrease; |
| 4 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 5 | CANDIDATE GAP | PHRASING | `inventory invoice invoiced` | `inventory` | - | <li>An Invoice with an Inventory part is Invoiced</li> |
| 6 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 7 | CANDIDATE GAP | PHRASING | `invoice journal strong` | `invoice` | - | <li><strong>Journal Date</strong> is same as Invoice date (same for both entries)</li> |
| 8 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 9 | CANDIDATE GAP | PHRASING | `positive special strong` | `positive` | - | <li>has <strong>positive</strong> value for Special account</li> |
| 10 | CANDIDATE GAP | PHRASING | `$customername strong type` | `$customername` | - | <strong>$CustomerName</strong>;Type: |
| 11 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 12 | CANDIDATE GAP | PHRASING | `decrease inventory special` | `decrease` | - | <li><p>for Special account:<br />Inventory Decrease; |
| 13 | CANDIDATE GAP | PHRASING | `$customername strong type` | `$customername` | - | <strong>$CustomerName</strong>;Type: |
| 14 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 15 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 16 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |

## C1775 - CANDIDATE GAP

*Journal Entry - Export Results After Invoice is Reversed*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1775)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 2 | CANDIDATE GAP | STRONG | `special strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Special account</li> |
| 3 | CANDIDATE GAP | STRONG | `increase inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Increase; |
| 4 | CANDIDATE GAP | STRONG | `$actionuser strong nbsp` | `nbsp` | - | User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 5 | CANDIDATE GAP | STRONG | `$actionuser strong nbsp` | `nbsp` | - | User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 6 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 7 | CANDIDATE GAP | PHRASING | `inventory invoice reversed` | `inventory` | - | <li>An Invoice with an Inventory part is Reversed</li> |
| 8 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 9 | CANDIDATE GAP | PHRASING | `invoice journal strong` | `invoice` | - | <li><strong>Journal Date</strong> is same as Invoice date (same for both entries)</li> |
| 10 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 11 | CANDIDATE GAP | PHRASING | `inventory positive strong` | `inventory` | - | <li>has <strong>positive</strong> value for Inventory account</li> |
| 12 | CANDIDATE GAP | PHRASING | `$customername strong type` | `$customername` | - | <strong>$CustomerName</strong>;Type: |
| 13 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 14 | CANDIDATE GAP | PHRASING | `increase inventory special` | `increase` | - | <li><p>for Special account:<br />Inventory Increase; |
| 15 | CANDIDATE GAP | PHRASING | `$customername strong type` | `$customername` | - | <strong>$CustomerName</strong>;Type: |
| 16 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 17 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 18 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |

## C1776 - CANDIDATE GAP

*Journal Entry - Export Results After Inventory Part QTY or Cost are Manually Increased*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1776)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 2 | CANDIDATE GAP | STRONG | `journal strong performed` | `performed` | - | <li><strong>Journal Date</strong> is the date when this action was performed (same for both entries)</li> |
| 3 | CANDIDATE GAP | STRONG | `special strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Special account</li> |
| 4 | CANDIDATE GAP | STRONG | `increase inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Increase; |
| 5 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 6 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 7 | CANDIDATE GAP | STRONG | `journal strong performed` | `performed` | - | <li><strong>Journal Date</strong> is the date when this action was performed (same for both entries)</li> |
| 8 | CANDIDATE GAP | STRONG | `special strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Special account</li> |
| 9 | CANDIDATE GAP | STRONG | `increase inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Increase; |
| 10 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 11 | CANDIDATE GAP | PHRASING | `increase inventory manually` | `increase` | - | <li>Manually Increase the Quantity for the Inventory Part</li> |
| 12 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 13 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 14 | CANDIDATE GAP | PHRASING | `inventory positive strong` | `inventory` | - | <li>has <strong>positive</strong> value for Inventory account</li> |
| 15 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 16 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 17 | CANDIDATE GAP | PHRASING | `increase inventory special` | `increase` | - | <li><p>for Special account:<br />Inventory Increase; |
| 18 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 19 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 20 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 21 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |
| 22 | CANDIDATE GAP | PHRASING | `cost increase inventory` | `cost` | - | <li>Manually Increase the Cost for the Inventory Part</li> |
| 23 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 24 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 25 | CANDIDATE GAP | PHRASING | `inventory positive strong` | `inventory` | - | <li>has <strong>positive</strong> value for Inventory account</li> |
| 26 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 27 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 28 | CANDIDATE GAP | PHRASING | `increase inventory special` | `increase` | - | <li><p>for Special account:<br />Inventory Increase; |
| 29 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 30 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 31 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 32 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |

## C1777 - CANDIDATE GAP

*Journal Entry - Export Results After Inventory Part QTY or Cost are Manually Decreased*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1777)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 2 | CANDIDATE GAP | STRONG | `journal strong performed` | `performed` | - | <li><strong>Journal Date</strong> is the date when this action was performed (same for both entries)</li> |
| 3 | CANDIDATE GAP | STRONG | `inventory strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Inventory account</li> |
| 4 | CANDIDATE GAP | STRONG | `decrease inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Decrease; |
| 5 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 6 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 7 | CANDIDATE GAP | STRONG | `journal strong performed` | `performed` | - | <li><strong>Journal Date</strong> is the date when this action was performed (same for both entries)</li> |
| 8 | CANDIDATE GAP | STRONG | `inventory strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Inventory account</li> |
| 9 | CANDIDATE GAP | STRONG | `decrease inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Decrease; |
| 10 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 11 | CANDIDATE GAP | PHRASING | `decrease inventory manually` | `decrease` | - | <li>Manually decrease Quantity for the Inventory Part</li> |
| 12 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 13 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 14 | CANDIDATE GAP | PHRASING | `positive special strong` | `positive` | - | <li>has <strong>positive</strong> value for Special account</li> |
| 15 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 16 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 17 | CANDIDATE GAP | PHRASING | `decrease inventory special` | `decrease` | - | <li><p>for Special account:<br />Inventory Decrease; |
| 18 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 19 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 20 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 21 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |
| 22 | CANDIDATE GAP | PHRASING | `cost decrease inventory` | `cost` | - | <li>Manually decrease Cost for the Inventory Part</li> |
| 23 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 24 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 25 | CANDIDATE GAP | PHRASING | `positive special strong` | `positive` | - | <li>has <strong>positive</strong> value for Special account</li> |
| 26 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 27 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 28 | CANDIDATE GAP | PHRASING | `decrease inventory special` | `decrease` | - | <li><p>for Special account:<br />Inventory Decrease; |
| 29 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 30 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 31 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 32 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |

## C1778 - CANDIDATE GAP

*Journal Entry - Export Results After Inventory Part is Created*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1778)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `inventory part created` | `part` | - | <li>A new Inventory Part is created</li> |
| 2 | CANDIDATE GAP | STRONG | `journal strong data` | `data` | - | <li>Download <strong>Journal Entry</strong> and verify its data</li> |
| 3 | CANDIDATE GAP | STRONG | `journal strong performed` | `performed` | - | <li><strong>Journal Date</strong> is the date when this action was performed (same for both entries)</li> |
| 4 | CANDIDATE GAP | STRONG | `special strong negative` | `negative` | - | <li>has <strong>negative</strong> value for Special account</li> |
| 5 | CANDIDATE GAP | STRONG | `increase inventory account` | `account` | - | <li><p>for Inventory account:<br />Inventory Increase; |
| 6 | CANDIDATE GAP | STRONG | `$shoplocation strong location` | `location` | - | <li><strong>Location</strong> is visible ( <strong>$ShopLocation</strong> for both entries )</li> |
| 7 | CANDIDATE GAP | PHRASING | `increased journal strong` | `increased` | - | <li><p><strong>Journal No</strong> is increased by 1 and there are 2 entries for the same Journal No:</p> |
| 8 | CANDIDATE GAP | PHRASING | `inventory special strong` | `inventory` | - | <li><strong>Account</strong> is present as Inventory and Special</li> |
| 9 | CANDIDATE GAP | PHRASING | `inventory positive strong` | `inventory` | - | <li>has <strong>positive</strong> value for Inventory account</li> |
| 10 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 11 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 12 | CANDIDATE GAP | PHRASING | `increase inventory special` | `increase` | - | <li><p>for Special account:<br />Inventory Increase; |
| 13 | CANDIDATE GAP | PHRASING | `$actionuser $partid strong` | `$actionuser` | - | <strong>$PartID</strong> User:&nbsp;&nbsp;<strong>$ActionUser</strong>; |
| 14 | CANDIDATE GAP | PHRASING | `$actiondate $actiontime strong` | `$actiondate` | - | <strong>$ActionTime</strong> <strong>$ActionDate</strong></p></li> |
| 15 | CANDIDATE GAP | PHRASING | `$shoplocation class strong` | `$shoplocation` | - | <li><strong>Class</strong> is visible ( <strong>$ShopLocation</strong> for both entries ) </li> |
| 16 | CANDIDATE GAP | PHRASING | `adjustment false strong` | `adjustment` | - | <li><strong>Is Adjustment</strong> is visible ( <strong>FALSE</strong> for both entries )</li> |

## C1955 - CANDIDATE GAP

*Export payroll report and compare it with date from Timesheet activities*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1955)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `random window list` | `list` | - | Select random time window from the list |
| 2 | CANDIDATE GAP | STRONG | `belong window selected` | `selected` | - | All entries on page belong to selected time window |
| 3 | CANDIDATE GAP | STRONG | `compare payroll exported` | `exported` | - | Compare all entries on exported report Payroll Timesheet and Timesheet Activities page |
| 4 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | User is navigated to {{BASE_URL}}/reports/punch-clock-activities |
| 5 | CANDIDATE GAP | PHRASING | `payroll punch window` | `payroll` | - | Set same time window on reports/punch-clock-activities as it was for Payroll Timesheet report |

## C2055 - CANDIDATE GAP

*Vendro Bill report*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2055)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `bill vendor export` | `export` | - | <li>Export vendor bill report</li> |
| 2 | CANDIDATE GAP | STRONG | `mentioned tax part` | `part` | - | <li>Tax for part for mentioned WO is correct</li> |
| 3 | CANDIDATE GAP | PHRASING | `specific tax vendor` | `specific` | - | <li>User has WO with parts from vendor with specific tax</li> |

## C2056 - CANDIDATE GAP

*Vendro Bill Payment report*  
Section: Test Cases > Reports > Export reports  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2056)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `bill vendor export` | `export` | - | <li>Export vendor bill report</li> |
| 2 | CANDIDATE GAP | STRONG | `mentioned tax part` | `part` | - | <li>Tax for part for mentioned WO is correct</li> |
| 3 | CANDIDATE GAP | STRONG | `amoiunt payed total` | `total` | - | <li>Total payed amoiunt is correct </li> |
| 4 | CANDIDATE GAP | PHRASING | `specific tax vendor` | `specific` | - | <li>User has WO with parts from vendor with specific tax</li> |
| 5 | CANDIDATE GAP | PHRASING | `form invoice match` | `form` | - | <li>All values match with invoice form WO</li> |

## C175 - COVERED-BY

*Technician efficiency - list of members*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/175)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base efficiency` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/technician-efficiency</li> |
| 2 | CANDIDATE GAP | PHRASING | `clock enabled foreman` | `clock` | - | <li><p>All staff members with 'Time Clock' enabled could be found on a list<br />//There should be all members from Staff page with Admin, Technician and Foreman role</p></li> |

## C176 - COVERED-BY

*Technician efficiency - time intervals*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/176)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base efficiency` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/technician-efficiency</li> |
| 2 | CANDIDATE GAP | PHRASING | `dropdown field interval` | `dropdown` | - | <li>Verify all the time intervals in the dropdown field</li> |

## C1779 - COVERED-BY

*Technician Efficiency - One Tech per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1779)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>A invoiced WO with <strong>single</strong> tech clocked in time on the line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `calculate line proportion` | `calculate` | - | <li>Calculate proportion of the time spend on the line for the tech</li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $techproportion strong` | `$clockedhour` | - | <li><strong>$TechProportion</strong> = $ClockedHours / $ClockedHours </li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techtime allocated` | `$invoicedtechhour` | - | <li>Verify tech <strong>$InvoicedTechHours</strong> (allocated tech time is the <strong>same</strong> as <strong>$TechTime</strong> when only one tech is clocked into the line)</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techproportion strong` | `$invoicedtechhour` | - | <li><strong>$InvoicedTechHours</strong> = $TechProportion |
| 8 | CANDIDATE GAP | PHRASING | `efficiency line strong` | `efficiency` | - | <li>Verify tech <strong>Efficiency</strong> for that WO line </li> |
| 9 | CANDIDATE GAP | PHRASING | `$clockedhour $invoicedtechhour $techefficiency` | `$clockedhour` | - | <li><strong>$TechEfficiency</strong> = ($InvoicedTechHours / $ClockedHours) |
| 10 | CANDIDATE GAP | PHRASING | `hour line profit` | `hour` | - | <li>Verify tech <strong>Profit Hours</strong> for that WO line</li> |
| 11 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techprofithour strong` | `$invoicedtechhour` | - | <li><strong>$TechProfitHours</strong> = $InvoicedTechHours |

## C1780 - COVERED-BY

*Technician Efficiency - Multiple Techs per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1780)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with <strong>multiple</strong> tech clocked in times on the same line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the <strong>Edit Line</strong> modal<br /><strong>$InvoicedTechHours</strong |
| 4 | CANDIDATE GAP | PHRASING | `calculate line proportion` | `calculate` | - | <li>Calculate proportion of the time spend on the line for all techs </li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhours1 $clockedhours2 $tech1proportion` | `$clockedhours1` | - | <li><strong>$Tech1Proportion</strong> = $ClockedHours1 / ($ClockedHours1 + $ClockedHours2)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$clockedhours1 $clockedhours2 $tech2proportion` | `$clockedhours1` | - | <li><strong>$Tech2Proportion</strong> = $ClockedHours2 / ($ClockedHours1 + $ClockedHours2)</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $techtime allocated` | `$invoicedtechhour` | - | <li>Verify tech <strong>$InvoicedTechHours</strong> (allocated tech time is <strong>different</strong> from <strong>$TechTime</strong> when multiple techs are clocked into the same line)</li> |
| 8 | CANDIDATE GAP | PHRASING | `$invoicedtechhours1 $tech1proportion strong` | `$invoicedtechhours1` | - | <li><strong>$InvoicedTechHours1</strong> = $Tech1Proportion |
| 9 | CANDIDATE GAP | PHRASING | `$invoicedtechhours2 $tech2proportion strong` | `$invoicedtechhours2` | - | <li><strong>$InvoicedTechHours2</strong> = $Tech2Proportion |
| 10 | CANDIDATE GAP | PHRASING | `efficiency line strong` | `efficiency` | - | <li>Verify tech <strong>Efficiency</strong> for that WO line </li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhours1 $invoicedtech1hour $tech1efficiency` | `$clockedhours1` | - | <li><strong>$Tech1Efficiency</strong> = ($InvoicedTech1Hours / $ClockedHours1) |
| 12 | CANDIDATE GAP | PHRASING | `$clockedhours2 $invoicedtech2hour $tech2efficiency` | `$clockedhours2` | - | <li><strong>$Tech2Efficiency</strong> = ($InvoicedTech2Hours / $ClockedHours2) |
| 13 | CANDIDATE GAP | PHRASING | `hour line profit` | `hour` | - | <li>Verify tech <strong>Profit Hours</strong> for that WO line</li> |
| 14 | CANDIDATE GAP | PHRASING | `$invoicedtechhours1 $tech1profithour strong` | `$invoicedtechhours1` | - | <li><strong>$Tech1ProfitHours</strong> = $InvoicedTechHours1 |
| 15 | CANDIDATE GAP | PHRASING | `$invoicedtechhours2 $tech2profithour strong` | `$invoicedtechhours2` | - | <li><strong>$Tech2ProfitHours</strong> = $InvoicedTechHours2 |

## C1781 - COVERED-BY

*Technician Efficiency - Multiple Roles per Line*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1781)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An <strong>invoiced</strong> WO with multiple tech clocked in times on the same line exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |

## C1798 - COVERED-BY

*Technician Efficiency -  Summary per Tech*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1798)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li><strong>Multiple</strong> invoiced WOs with tech clocked in time exist</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `$clockedhour strong summary` | `$clockedhour` | - | <li>Verify tech summary <strong>$ClockedHours</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $clockedhourssum correct` | `$clockedhour` | - | <li>Sum of all <strong>$ClockedHours</strong> per user is correct ($ClockedHoursSum)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour strong summary` | `$invoicedtechhour` | - | <li>Verify tech summary for <strong>$InvoicedTechHours</strong> </li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $invoicedtechhourssum correct` | `$invoicedtechhour` | - | <li>Sum of all <strong>$InvoicedTechHours</strong> per user is correct ($InvoicedTechHoursSum)</li> |
| 8 | CANDIDATE GAP | PHRASING | `hour profit strong` | `hour` | - | <li>Verify tech summary for <strong>Profit Hours</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `$profithourssum correct hour` | `$profithourssum` | - | <li>Sum of all <strong>Profit Hours</strong> per user is correct ($ProfitHoursSum)</li> |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong summary` | `efficiency` | - | <li>Verify tech summary for <strong>Efficiency</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhourssum $invoicedtechhourssum correct` | `$clockedhourssum` | - | <li><p>Sum of all <strong>Efficiency</strong> per user is correct<br />($InvoicedTechHoursSum / $ClockedHoursSum) |

## C1799 - COVERED-BY

*Technician Efficiency -  Totals (Summary for all Techs)*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1799)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li><strong>Multiple</strong> invoiced WOs with tech clocked in time exist</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `$clockedhour $efficiency $hoursprofit` | `$clockedhour` | - | <p>Note:<br /><strong>$ClockedHours</strong> → tech's actual clocked hours on the line<br /><strong>$TechTime</strong> → tech's time defined on the Edit Line modal<br /><strong>$InvoicedTechHours</strong> → tech's alloca |
| 4 | CANDIDATE GAP | PHRASING | `$clockedhour strong tech` | `$clockedhour` | - | <li>Verify total <strong>$ClockedHours</strong> for all techs</li> |
| 5 | CANDIDATE GAP | PHRASING | `$clockedhour $clockedhourstotal correct` | `$clockedhour` | - | <li>Sum of all <strong>$ClockedHours</strong> for <strong>all users</strong> is correct ($ClockedHoursTotal)</li> |
| 6 | CANDIDATE GAP | PHRASING | `$invoicedtechhour strong tech` | `$invoicedtechhour` | - | <li>Verify total <strong>$InvoicedTechHours</strong> for all techs</li> |
| 7 | CANDIDATE GAP | PHRASING | `$invoicedtechhour $invoicedtechhourstotal correct` | `$invoicedtechhour` | - | <li>Sum of all <strong>$InvoicedTechHours</strong> for <strong>all users</strong> is correct ($InvoicedTechHoursTotal)</li> |
| 8 | CANDIDATE GAP | PHRASING | `hour profit strong` | `hour` | - | <li>Verify total <strong>Profit Hours</strong> for all techs</li> |
| 9 | CANDIDATE GAP | PHRASING | `$profithourstotal correct hour` | `$profithourstotal` | - | <li>Sum of all <strong>Profit Hours</strong> for <strong>all users</strong> is correct ($ProfitHoursTotal)</li> |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li>Verify total <strong>Efficiency</strong> for all techs</li> |
| 11 | CANDIDATE GAP | PHRASING | `$clockedhourstotal $invoicedtechhourstotal correct` | `$clockedhourstotal` | - | <li><p>Sum of all <strong>Efficiency</strong> for <strong>all users</strong> is correct<br />($InvoicedTechHoursTotal / $ClockedHoursTotal) |

## C1783 - COVERED-BY

*Technician Efficiency - Download*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1783)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `corner dots menu` | `corner` | - | <li>Click on the <strong>menu</strong> (3 dots) in top right corner</li> |
| 4 | CANDIDATE GAP | PHRASING | `dropdown list option` | `dropdown` | - | <li><p>A dropdown list with 2 options opens:</p> |
| 5 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li><strong>Download Summary</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li><strong>Download Expanded View</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li>Click on <strong>Download Summary</strong></li> |
| 8 | CANDIDATE GAP | PHRASING | `downloaded efficiency summary.pdf` | `downloaded` | - | <li>Technician-Efficiency-summary.pdf reports is downloaded</li> |
| 9 | CANDIDATE GAP | PHRASING | `corner dots menu` | `corner` | - | <li>Click on the <strong>menu</strong> (3 dots) in top right corner</li> |
| 10 | CANDIDATE GAP | PHRASING | `dropdown list option` | `dropdown` | - | <li><p>A dropdown list with 2 options opens:</p> |
| 11 | CANDIDATE GAP | PHRASING | `strong summary` | `strong` | - | <li><strong>Download Summary</strong></li> |
| 12 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li><strong>Download Expanded View</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `expanded strong` | `expanded` | - | <li>Click on <strong>Download Expanded View</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `downloaded efficiency expandedview.pdf` | `downloaded` | - | <li>Technician-Efficiency-expandedView.pdf reports is downloaded</li> |

## C1784 - COVERED-BY

*Technician Efficiency - Summary Report Structure*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1784)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `downloaded efficiency summary.pdf` | `downloaded` | - | <li>Technician-Efficiency-summary.pdf reports is downloaded</li> |
| 4 | CANDIDATE GAP | PHRASING | `data strong summary` | `data` | - | <li>Verify data on the <strong>Summary</strong> report</li> |
| 5 | CANDIDATE GAP | PHRASING | `strong structure summary` | `strong` | - | <li><p>The <strong>Summary</strong> reports structure:</p> |
| 6 | CANDIDATE GAP | PHRASING | `corner left location` | `corner` | - | <li><p><strong>Location name</strong> is visible in top left corner</p> |
| 7 | CANDIDATE GAP | PHRASING | `address location name` | `address` | - | <li><strong>Location address</strong> is visible under Location name</li> |
| 8 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li><p>Report title <strong>Tech Efficiency</strong> is visible</p> |
| 9 | CANDIDATE GAP | PHRASING | `strong subtitle summary` | `strong` | - | <li><p>Report subtitle <strong>Summary</strong> is visible</p> |
| 10 | CANDIDATE GAP | PHRASING | `corner logo organization` | `corner` | - | <li>Organization <strong>logo</strong> is visible in top right corner </li> |
| 11 | CANDIDATE GAP | PHRASING | `date e.g invoice` | `date` | - | <li><p><strong>Invoice Date Range</strong> is visible under logo (e.g., Invoice Date Range: |
| 12 | CANDIDATE GAP | PHRASING | `bolded date font` | `bolded` | - | <li>Invoice Date Range label fonts are bolded</li> |
| 13 | CANDIDATE GAP | PHRASING | `dat date filter` | `dat` | - | <li>Date range is showing dates that are previously selected in the date filter</li> |
| 14 | CANDIDATE GAP | PHRASING | `header strong table` | `header` | - | <li><p>Table <strong>header</strong> is visible:</p> |
| 15 | CANDIDATE GAP | PHRASING | `background gray header` | `background` | - | <li>header has light gray background</li> |
| 16 | CANDIDATE GAP | PHRASING | `bolded font header` | `bolded` | - | <li>header fonts are bolded</li> |
| 17 | CANDIDATE GAP | PHRASING | `column contain header` | `column` | - | <li><p>header contains columns:</p> |
| 18 | CANDIDATE GAP | PHRASING | `hour invoiced tech` | `hour` | - | <li>Invoiced Tech Hours</li> |
| 19 | CANDIDATE GAP | PHRASING | `rows strong table` | `rows` | - | <li><p>Table <strong>rows</strong> are visible:</p> |
| 20 | CANDIDATE GAP | PHRASING | `gray light line` | `gray` | - | <li>each technician row is separated by a light gray line</li> |
| 21 | CANDIDATE GAP | PHRASING | `aka footer strong` | `aka` | - | <li><p>Table <strong>footer</strong> aka <strong>Totals</strong> is visible</p> |
| 22 | CANDIDATE GAP | PHRASING | `background footer gray` | `background` | - | <li>footer has light gray background</li> |
| 23 | CANDIDATE GAP | PHRASING | `bolded font footer` | `bolded` | - | <li>footer fonts are bolded</li> |
| 24 | CANDIDATE GAP | PHRASING | `bottom gst number` | `bottom` | - | <li><p><strong>GST</strong> number and <strong>page</strong> numbers are not visible on the bottom of the page</p></li> |

## C1785 - COVERED-BY

*Technician Efficiency - Expanded View Report Structure*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1785)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `downloaded efficiency expandedview.pdf` | `downloaded` | - | <li>Technician-Efficiency-expandedView.pdf reports is downloaded</li> |
| 4 | CANDIDATE GAP | PHRASING | `data expandedview strong` | `data` | - | <li>Verify data on the <strong>ExpandedView</strong> report</li> |
| 5 | CANDIDATE GAP | PHRASING | `company full header` | `company` | - | <li>Each technician's section should start with the full company header on top. |
| 6 | CANDIDATE GAP | PHRASING | `first header multiple` | `first` | - | If a technician's report spans multiple pages, the header should appear only on the first page</li> |
| 7 | CANDIDATE GAP | PHRASING | `expandedview strong structure` | `expandedview` | - | <li><p>The <strong>ExpandedView</strong> reports structure:</p> |
| 8 | CANDIDATE GAP | PHRASING | `corner left location` | `corner` | - | <li><p><strong>Location name</strong> is visible in top left corner</p> |
| 9 | CANDIDATE GAP | PHRASING | `address location name` | `address` | - | <li><strong>Location address</strong> is visible under Location name</li> |
| 10 | CANDIDATE GAP | PHRASING | `efficiency strong tech` | `efficiency` | - | <li><p>Report title <strong>Tech Efficiency</strong> is visible</p> |
| 11 | CANDIDATE GAP | PHRASING | `$technicianname strong subtitle` | `$technicianname` | - | <li><p>Report subtitle <strong>$TechnicianName</strong> is visible</p> |
| 12 | CANDIDATE GAP | PHRASING | `corner logo organization` | `corner` | - | <li>Organization <strong>logo</strong> is visible in top right corner </li> |
| 13 | CANDIDATE GAP | PHRASING | `date e.g invoice` | `date` | - | <li><p><strong>Invoice Date Range</strong> is visible under logo (e.g., Invoice Date Range: |
| 14 | CANDIDATE GAP | PHRASING | `bolded date font` | `bolded` | - | <li>Invoice Date Range label fonts are bolded</li> |
| 15 | CANDIDATE GAP | PHRASING | `dat date filter` | `dat` | - | <li>Date range is showing dates that are previously selected in the date filter</li> |
| 16 | CANDIDATE GAP | PHRASING | `header strong table` | `header` | - | <li><p>Table <strong>header</strong> is visible:</p> |
| 17 | CANDIDATE GAP | PHRASING | `background gray header` | `background` | - | <li>header has light gray background</li> |
| 18 | CANDIDATE GAP | PHRASING | `bolded font header` | `bolded` | - | <li>header fonts are bolded</li> |
| 19 | CANDIDATE GAP | PHRASING | `column contain header` | `column` | - | <li><p>header contains columns:</p> |
| 20 | CANDIDATE GAP | PHRASING | `hour invoiced tech` | `hour` | - | <li>Invoiced Tech Hours</li> |
| 21 | CANDIDATE GAP | PHRASING | `rows strong table` | `rows` | - | <li><p>Table <strong>rows</strong> are visible:</p> |
| 22 | CANDIDATE GAP | PHRASING | `gray light line` | `gray` | - | <li>each technician row is separated by a light gray line</li> |
| 23 | CANDIDATE GAP | PHRASING | `aka footer strong` | `aka` | - | <li><p>Table <strong>footer</strong> aka <strong>Totals</strong> is visible</p> |
| 24 | CANDIDATE GAP | PHRASING | `background footer gray` | `background` | - | <li>footer has light gray background</li> |
| 25 | CANDIDATE GAP | PHRASING | `bolded font footer` | `bolded` | - | <li>footer fonts are bolded</li> |
| 26 | CANDIDATE GAP | PHRASING | `bottom gst number` | `bottom` | - | <li><strong>GST</strong> number and <strong>page</strong> numbers are not visible on the bottom of the page</li> |

## C1805 - COVERED-BY

*Technician Efficiency - Verify Data After WO is Invoiced*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1805)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist lin` | `clocked` | - | <li>WO with multiple lines and techs clocked into those lines exist</li> |
| 2 | CANDIDATE GAP | PHRASING | `complete created estimate` | `complete` | - | <li>WO is in <strong>Complete</strong> or <strong>Estimate</strong> status ( <strong>Invoice</strong> is not created )</li> |
| 3 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 4 | CANDIDATE GAP | PHRASING | `date filter include` | `date` | - | <li>Filters are set to include WO date</li> |
| 5 | CANDIDATE GAP | PHRASING | `clocked result tim` | `clocked` | - | <li>WO and clocked in times are not visible in the results</li> |
| 6 | CANDIDATE GAP | PHRASING | `back base create` | `back` | - | <li>Navigate back to the WO and create invoice and then navigate to the {{BASE_URL}}/reports/technician-efficiency and verify existence of that WO in the results</li> |
| 7 | CANDIDATE GAP | PHRASING | `clocked now result` | `clocked` | - | <li>WO and clocked in times are now visible in the results</li> |

## C1786 - COVERED-BY

*Technician Efficiency - Verify Data After WO is Reversed*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1786)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An <strong>invoiced</strong> WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `exist invoiced issued` | `exist` | - | <li>Verify records exist for the issued WO (Invoiced/Paid)</li> |
| 4 | CANDIDATE GAP | PHRASING | `efficiency record strong` | `efficiency` | - | <li>There are records for the WO under <strong>Technician Efficiency</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `exist issued payment` | `exist` | - | <li>Reverse Payment and Verify records exist for the issued WO</li> |
| 6 | CANDIDATE GAP | PHRASING | `data efficiency invoice` | `data` | - | <li>Tech Efficiency data is no longer visible for that WO/Invoice</li> |

## C1801 - COVERED-BY

*Technician Efficiency - Filter*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1801)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `date filter` | `date` | - | <li>Verify default date filter</li> |
| 4 | CANDIDATE GAP | PHRASING | `filter month set` | `filter` | - | <li>Filter is set to <strong>This Month</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `dropdown filter option` | `dropdown` | - | <li>Click on <strong>Filter</strong> dropdown and verify dropdown options</li> |
| 6 | CANDIDATE GAP | PHRASING | `dropdown filter following` | `dropdown` | - | <li><p>The following <strong>Filter</strong> dropdown options are present:</p> |
| 7 | CANDIDATE GAP | PHRASING | `dropdown filter filtered` | `dropdown` | - | <li>Click on each <strong>Filter</strong> dropdown option and verify filtered results</li> |
| 8 | CANDIDATE GAP | PHRASING | `date rang record` | `date` | - | <li>Records are displayed only within selected date ranges</li> |

## C1802 - COVERED-BY

*Technician Efficiency - Links*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1802)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `invoice link number` | `invoice` | - | <li>Click on any link under <strong>Invoice Number</strong></li> |
| 4 | CANDIDATE GAP | PHRASING | `base lin url` | `base` | - | <li>User lands to {{BASE_URL}}/workorder/{{WO_ID}}/lines</li> |
| 5 | CANDIDATE GAP | PHRASING | `back base efficiency` | `back` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 6 | CANDIDATE GAP | PHRASING | `customer link strong` | `customer` | - | <li>Click on any link under <strong>Customer</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `base customer order` | `base` | - | <li>User lands to {{BASE_URL}}/customers/{{CUSTOMER_ID}}/work-orders</li> |
| 8 | CANDIDATE GAP | PHRASING | `back base efficiency` | `back` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 9 | CANDIDATE GAP | PHRASING | `clocked hour link` | `clocked` | - | <li>Click on any link under <strong>Clocked Hours</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `base timesheet url` | `base` | - | <li>User lands to {{BASE_URL}}/workorder/{{WO_ID}}/timesheets</li> |
| 11 | CANDIDATE GAP | PHRASING | `back base efficiency` | `back` | - | <li>Navigated back to the {{BASE_URL}}/reports/technician-efficiency page</li> |
| 12 | CANDIDATE GAP | PHRASING | `hour invoiced link` | `hour` | - | <li>Click on any link under <strong>Invoiced Tech Hours</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `base customer lin` | `base` | - | <li>User lands to {{BASE_URL}}/customers/{{CUSTOMER_ID}}/lines</li> |
| 14 | CANDIDATE GAP | PHRASING | `edit line modal` | `edit` | - | <li><strong>Edit Line</strong> modal opens</li> |

## C1803 - COVERED-BY

*Technician Efficiency - Line Ordering*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1803)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `line ordering technician` | `line` | - | <li>Verify line ordering for the same WO under technician </li> |
| 4 | CANDIDATE GAP | PHRASING | `most order recent` | `most` | - | <li>The most recent work orders are at the top</li> |
| 5 | CANDIDATE GAP | PHRASING | `grouped highest lin` | `grouped` | - | <li>Lines are ordered from <strong>lowest</strong> to <strong>highest</strong> grouped by work orders</li> |
| 6 | CANDIDATE GAP | PHRASING | `class data line1` | `class` | - | <tr><td class="table-data">1</td><td class="table-data">wo2</td><td class="table-data">wo2_line1</td></tr> |
| 7 | CANDIDATE GAP | PHRASING | `class data line2` | `class` | - | <tr><td class="table-data">2</td><td class="table-data">wo2</td><td class="table-data">wo2_line2</td></tr> |
| 8 | CANDIDATE GAP | PHRASING | `class data line3` | `class` | - | <tr><td class="table-data">3</td><td class="table-data">wo2</td><td class="table-data">wo2_line3</td></tr> |
| 9 | CANDIDATE GAP | PHRASING | `class data line4` | `class` | - | <tr><td class="table-data">4</td><td class="table-data">wo2</td><td class="table-data">wo2_line4</td></tr> |
| 10 | CANDIDATE GAP | PHRASING | `class data line5` | `class` | - | <tr><td class="table-data">5</td><td class="table-data">wo2</td><td class="table-data">wo2_line5</td></tr> |
| 11 | CANDIDATE GAP | PHRASING | `class data line2` | `class` | - | <tr><td class="table-data">6</td><td class="table-data">wo1</td><td class="table-data">wo1_line2</td></tr> |
| 12 | CANDIDATE GAP | PHRASING | `class data line5` | `class` | - | <tr><td class="table-data">7</td><td class="table-data">wo1</td><td class="table-data">wo1_line5</td></tr> |
| 13 | CANDIDATE GAP | PHRASING | `class data line6` | `class` | - | <tr><td class="table-data">8</td><td class="table-data">wo1</td><td class="table-data">wo1_line6</td></tr> |

## C1804 - COVERED-BY

*Technician Efficiency - Table Header Tooltip*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1804)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `clocked column header` | `clocked` | - | <li>Hover over <strong>Clocked Hours</strong> column header</li> |
| 4 | CANDIDATE GAP | PHRASING | `clocked date following` | `clocked` | - | <li><p><strong>Clocked Hours</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'clocked hours' that the technician clocked in to the work order that have been invoiced withi |
| 5 | CANDIDATE GAP | PHRASING | `alternative clocked date` | `alternative` | - | <p>Alternative:<br />Total number of 'clocked hours' the technician has logged into the work order, which have been invoiced within the selected date range.</p> |
| 6 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Hover over <strong>Invoiced Tech Hours</strong> column header</li> |
| 7 | CANDIDATE GAP | PHRASING | `assigned date following` | `assigned` | - | <li><p><strong>Invoiced Tech Hours</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'tech hours' that were assigned to lines on the work orders that have been invoiced with |
| 8 | CANDIDATE GAP | PHRASING | `alternative assigned date` | `alternative` | - | <p>Alternative:<br />Total number of 'tech hours' assigned to work order lines, which have been invoiced within the selected date range.</p> |
| 9 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Hover over <strong>Hours Profit</strong> column header</li> |
| 10 | CANDIDATE GAP | PHRASING | `clocked date difference` | `clocked` | - | <li><p><strong>Hours Profit</strong> tooltip is visible with the following message:<br /><strong>This is the total number of 'hours profit' that the difference of technician invoiced tech hours and technician clocked hou |
| 11 | CANDIDATE GAP | PHRASING | `actual alternative between` | `actual` | - | <p>Alternative:<br />Difference between the technician's invoiced hours and their actual clocked hours for work orders invoiced within the selected date range.</p> |
| 12 | CANDIDATE GAP | PHRASING | `column efficiency header` | `column` | - | <li>Hover over <strong>Efficiency</strong> column header</li> |
| 13 | CANDIDATE GAP | PHRASING | `associated based clocked` | `associated` | - | <li><p><strong>Efficiency</strong> tooltip is visible with the following message:<br /><strong>This is the technician efficiency based off of the hours that were clocked onto the lines compared to the tech hours that wer |
| 14 | CANDIDATE GAP | PHRASING | `clocked divided efficiency` | `clocked` | - | Efficiency = invoiced tech time divided by the clocked time (in %)</strong></p></li> |
| 15 | CANDIDATE GAP | PHRASING | `100 alternative assigned` | `100` | - | <p>Alternative:<br />Technician's efficiency based on the clocked hours versus the tech hours assigned to work order lines, which have been invoiced within the selected date range.<br />Efficiency = (Invoiced Tech Hours  |

## C1806 - COVERED-BY

*Technician Efficiency - Scroll*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1806)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `arrow column header` | `arrow` | - | <li>Click on arrow next to the <strong>Technician</strong> column header</li> |
| 4 | CANDIDATE GAP | PHRASING | `expanded rows table` | `expanded` | - | <li>All table rows are expanded</li> |
| 5 | CANDIDATE GAP | PHRASING | `back bottom scroll` | `back` | - | <li>Scroll all the way to the bottom and back to the top</li> |
| 6 | CANDIDATE GAP | PHRASING | `between footer header` | `between` | - | <li>The scroll is moving between the table header and table footer</li> |

## C1807 - COVERED-BY

*Technician Efficiency - Expand Entire Table*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1807)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `arrow column header` | `arrow` | - | <li>Click the arrow next to the Technician column header</li> |
| 4 | CANDIDATE GAP | PHRASING | `expanded rows strong` | `expanded` | - | <li>All table rows are <strong>expanded</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `arrow column header` | `arrow` | - | <li>Click the arrow next to the Technician column header again</li> |
| 6 | CANDIDATE GAP | PHRASING | `collapsed rows strong` | `collapsed` | - | <li>All table rows are <strong>collapsed</strong></li> |

## C1808 - COVERED-BY

*Technician Efficiency - Expand Row*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1808)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `arrow name next` | `arrow` | - | <li>Click the arrow next to technician name</li> |
| 4 | CANDIDATE GAP | PHRASING | `expanded row selected` | `expanded` | - | <li>Row for selected technician is <strong>expanded</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `record tech visible` | `record` | - | <li>All tech records are visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `arrow name next` | `arrow` | - | <li>Click the arrow next to the same technician's name again</li> |
| 7 | CANDIDATE GAP | PHRASING | `collapsed row selected` | `collapsed` | - | <li>Row for selected technician is <strong>collapsed</strong></li> |
| 8 | CANDIDATE GAP | PHRASING | `record strong tech` | `record` | - | <li>Tech records are <strong>not</strong> visible</li> |

## C1809 - COVERED-BY

*Technician Efficiency - Column Sorting*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1809)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `clocked exist invoiced` | `clocked` | - | <li>An invoiced WO with multiple clocked in times exists</li> |
| 2 | CANDIDATE GAP | PHRASING | `base efficiency navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/technician-efficiency</li> |
| 3 | CANDIDATE GAP | PHRASING | `clocked column header` | `clocked` | - | <li>Click on <strong>Clocked Hours</strong> column header</li> |
| 4 | CANDIDATE GAP | PHRASING | `clocked highest hour` | `clocked` | - | <li>The technician <strong>Clocked Hours</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `clocked column header` | `clocked` | - | <li>Click on <strong>Clocked Hours</strong> column header once again</li> |
| 6 | CANDIDATE GAP | PHRASING | `clocked highest hour` | `clocked` | - | <li>The technician <strong>Clocked Hours</strong> are sorted from <strong>highest</strong> to <strong>lowest</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Click on <strong>Invoiced Tech Hours</strong> column header</li> |
| 8 | CANDIDATE GAP | PHRASING | `highest hour invoiced` | `highest` | - | <li>The technician <strong>Invoiced Tech Hours</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Click on <strong>Invoiced Tech Hours</strong> column header once again</li> |
| 10 | CANDIDATE GAP | PHRASING | `highest hour invoiced` | `highest` | - | <li>The technician <strong>Invoiced Tech Hours</strong> are sorted from <strong>highest</strong> to <strong>lowest</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Click on <strong>Hours Profit</strong> column header</li> |
| 12 | CANDIDATE GAP | PHRASING | `highest hour lowest` | `highest` | - | <li>The technician <strong>Hours Profit</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `column header hour` | `column` | - | <li>Click on <strong>Hours Profit</strong> column header once again</li> |
| 14 | CANDIDATE GAP | PHRASING | `highest hour lowest` | `highest` | - | <li>The technician <strong>Hours Profit</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 15 | CANDIDATE GAP | PHRASING | `column efficiency header` | `column` | - | <li>Click on <strong>Efficiency</strong> column header</li> |
| 16 | CANDIDATE GAP | PHRASING | `efficiency highest lowest` | `efficiency` | - | <li>The technician <strong>Efficiency</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |
| 17 | CANDIDATE GAP | PHRASING | `column efficiency header` | `column` | - | <li>Click on <strong>Efficiency</strong> column header once again</li> |
| 18 | CANDIDATE GAP | PHRASING | `efficiency highest lowest` | `efficiency` | - | <li>The technician <strong>Efficiency</strong> are sorted from <strong>lowest</strong> to <strong>highest</strong></li> |

## C19296 - COVERED-BY

*Technician Efficiency - Error When Applying Custom Date Range*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19296)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `efficiency navigated technician` | `efficiency` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CANDIDATE GAP | PHRASING | `correctly data filter` | `correctly` | - | Data loads correctly for default time filter (This Month). |
| 3 | CANDIDATE GAP | PHRASING | `date dropdown filter` | `date` | - | Open the Date Filter dropdown (top right) |
| 4 | CANDIDATE GAP | PHRASING | `date dropdown filter` | `date` | - | Date filter dropdown opens showing time interval options |
| 5 | CANDIDATE GAP | PHRASING | `correctly data load` | `correctly` | - | Select "This Month" and observe data loads correctly |
| 6 | CANDIDATE GAP | PHRASING | `data filter load` | `data` | - | Report data loads successfully for This Month filter |
| 7 | CANDIDATE GAP | PHRASING | `custom date filter` | `custom` | - | Open the Date Filter again and select "Custom" |
| 8 | CANDIDATE GAP | PHRASING | `custom date picker` | `custom` | - | Custom date range picker appears |
| 9 | CANDIDATE GAP | PHRASING | `apply choose current` | `apply` | - | Choose a start and end date within the current month and click Apply |
| 10 | CANDIDATE GAP | PHRASING | `correctly custom data` | `correctly` | - | The report should load data correctly for the selected custom date range without errors. |

## C19297 - COVERED-BY

*Technician Efficiency - Single-Day Filter Returns Data for Multiple Days*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19297)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `efficiency navigated technician` | `efficiency` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CANDIDATE GAP | PHRASING | `clocked dat exist` | `clocked` | - | Invoiced WOs with tech clocked-in time exist for multiple dates. |
| 3 | CANDIDATE GAP | PHRASING | `date dropdown filter` | `date` | - | Open the Date Filter dropdown |
| 4 | CANDIDATE GAP | PHRASING | `date dropdown filter` | `date` | - | Date filter dropdown opens showing time interval options |
| 5 | CANDIDATE GAP | PHRASING | `custom date day` | `custom` | - | Select a single day (e.g., "Today" or pick a specific date via Custom) |
| 6 | CANDIDATE GAP | PHRASING | `day filter selected` | `day` | - | Single day is selected as the filter |
| 7 | CANDIDATE GAP | PHRASING | `apply column date` | `apply` | - | Apply the filter and observe the Date column in the expanded technician rows |
| 8 | CANDIDATE GAP | PHRASING | `data day selected` | `data` | - | The report should display data only for the selected single day. |
| 9 | CANDIDATE GAP | PHRASING | `column date rows` | `column` | - | All rows in the Date column should show the same date. |

## C19298 - COVERED-BY

*Technician Efficiency - Clicking Custom Does Not Open Date Range Dialog*  
Section: Test Cases > Reports > Technician Efficiency  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/19298)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `efficiency navigated technician` | `efficiency` | - | User is navigated to /reports/technician-efficiency. |
| 2 | CANDIDATE GAP | PHRASING | `date dropdown filter` | `date` | - | Open the Date Filter dropdown (top right) |
| 3 | CANDIDATE GAP | PHRASING | `custom date dropdown` | `custom` | - | Date filter dropdown opens showing time interval options including Custom |
| 4 | CANDIDATE GAP | PHRASING | `allowing custom date` | `allowing` | - | A date range dialog/picker opens allowing the user to select a custom start and end date |
| 5 | CANDIDATE GAP | PHRASING | `custom date input` | `custom` | - | Verify the custom date range inputs are visible and interactive |
| 6 | CANDIDATE GAP | PHRASING | `date end field` | `date` | - | Start date and end date input fields are visible. |
| 7 | CANDIDATE GAP | PHRASING | `apply available button` | `apply` | - | An Apply/Submit button is available to confirm the selection. |

## C187 - COVERED-BY

*Work In Progress - Pending Authorization*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/187)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C188 - COVERED-BY

*Work In Progress - In Progress*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/188)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C189 - COVERED-BY

*Work In Progress - Ready To Invoice*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/189)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/work-in-progress</li> |

## C190 - COVERED-BY

*Advisor Analysis - Columns*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/190)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `advisor analysi app` | `advisor` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 2 | CANDIDATE GAP | PHRASING | `column table visible` | `column` | - | <ul><li>Verify all visible columns in the table</li></ul> |
| 3 | CANDIDATE GAP | PHRASING | `advisor billing cost` | `advisor` | - | <ul><li>Date</li><li>Invoice</li><li>Customer</li><li>Advisor</li><li>Days Open</li><li>Lines</li><li>Hrs Worked</li><li id="isPasted">Hrs Invoiced</li><li>Hrs Profit</li><li>Billing Efficiency</li><li>ELR</li><li>Parts  |
| 4 | CANDIDATE GAP | PHRASING | `column table visible` | `column` | - | <ul><li>Verify all visible columns in the table</li></ul> |
| 5 | CANDIDATE GAP | PHRASING | `1036123 12345 2025` | `1036123` | - | <ul id="isPasted"><li>Date (e.g., <strong>Nov 21 2025</strong>)</li><li>Invoice (e.g., <strong>S3-12345</strong>)</li><li>Customer (e.g., <strong>1036123 AB LTD O/A HYDR...</strong>) → Max: |
| 6 | CANDIDATE GAP | PHRASING | `advisor char color` | `advisor` | - | <strong>23</strong> chars</li><li>Advisor (e.g., <strong>Nebojsa Glavi..</strong><span style='color: |
| 7 | CANDIDATE GAP | PHRASING | `nunito sans serif` | `nunito` | - | "Nunito Sans", sans-serif; |
| 8 | CANDIDATE GAP | PHRASING | `font ligatur variant` | `font` | - | font-variant-ligatures: |
| 9 | CANDIDATE GAP | PHRASING | `caps font variant` | `caps` | - | font-variant-caps: |
| 10 | CANDIDATE GAP | PHRASING | `stroke text webkit` | `stroke` | - | webkit-text-stroke-width: |
| 11 | CANDIDATE GAP | PHRASING | `245 247 250` | `245` | - | rgb(245, 247, 250); |
| 12 | CANDIDATE GAP | PHRASING | `decoration text thickness` | `decoration` | - | text-decoration-thickness: |
| 13 | CANDIDATE GAP | PHRASING | `decoration style text` | `decoration` | - | text-decoration-style: |
| 14 | CANDIDATE GAP | PHRASING | `color decoration text` | `color` | - | text-decoration-color: |
| 15 | CANDIDATE GAP | PHRASING | `max none span` | `max` | - | none'><strong>.</strong>) </span>→ Max: |
| 16 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 $33.33` | `$0.00` | - | <strong>13</strong> chars</li><li>Days Open (e.g., <strong>2</strong>,<strong> </strong><strong>0</strong>)</li><li>Lines (e.g., <strong id="isPasted">1</strong>,<strong id="isPasted"> 0</strong>)</li><li>Hrs Worked (e.g |
| 17 | CANDIDATE GAP | PHRASING | `$0.00 $80.97 e.g` | `$0.00` | - | pre" id="isPasted">)</span></li><li>Parts Invoice (e.g., <strong>$80.97</strong><strong id="isPasted">, $0.00</strong><span style="white-space: |
| 18 | CANDIDATE GAP | PHRASING | `$0.00 $80.97 e.g` | `$0.00` | - | pre">)</span></li><li>Parts Profit (e.g., <strong id="isPasted">$80.97</strong><strong>, $0.00</strong><span style="white-space: |
| 19 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 7.33%` | `$0.00` | - | pre">)</span></li><li>Parts Margin ( e.g., <strong>7.33%, N/A</strong>)</li><li>Total Profit (e.g., <strong id="isPasted">$142.59, $0.00</strong><span style="white-space: |
| 20 | CANDIDATE GAP | PHRASING | `$0.00 $142.59 27.73%` | `$0.00` | - | pre">)</span></li><li>Total Margin ( e.g., <strong>27.73%,</strong><strong> N/A</strong>)</li><li>Subtotal (e.g., <strong id="isPasted">$142.59, $0.00</strong><span style="white-space: |

## C191 - COVERED-BY

*Advisor Analysis - Filters*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/191)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `advisor analysi app` | `advisor` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 2 | CANDIDATE GAP | PHRASING | `dropdown field interval` | `dropdown` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 3 | CANDIDATE GAP | PHRASING | `advisor exist filter` | `advisor` | - | <ul><li><strong>Filter By Advisor</strong> exists</li><li><strong>Time interval filter</strong> exists:</li></ul><ul id="isPasted"><ul style="list-style-type: |
| 4 | CANDIDATE GAP | PHRASING | `custom disc last` | `custom` | - | disc"><li>Today</li><li>Yesterday</li><li>This Week</li><li>Last Week</li><li>This Month → <strong>Default</strong></li><li>Last Month</li><li>This Year</li><li>Last Year</li><li>This Quarter</li><li>Last Quarter</li><li |

## C192 - COVERED-BY

*Advisor Analytics - Filter By Advisor*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/192)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `advisor analysi app` | `advisor` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 2 | CANDIDATE GAP | PHRASING | `advisor dropdown filter` | `advisor` | - | <ul><li>Click on <strong>Filter By Advisor</strong> dropdown and pick advisor</li></ul> |

## C281 - COVERED-BY

*Advisor Analysis - Totals*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/281)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `advisor analysi app` | `advisor` | - | <li>App is navigated to page {{BASE_URL}}/reports/service-advisor-analysis</li> |
| 2 | CANDIDATE GAP | PHRASING | `summary table total` | `summary` | - | <li>Verify Totals summary for whole table</li> |
| 3 | CANDIDATE GAP | PHRASING | `column except total` | `column` | - | <li><p>There are total values for all columns except for: |
| 4 | CANDIDATE GAP | PHRASING | `advisor customer date` | `advisor` | - | <br />Date, Invoice NUmber, Customer, Service Advisor</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `100 billing bottom` | `100` | - | <ul><li>Verify Totals summary for entire table (on the bottom of the table)</li></ul><p>Note:</p><ul><li id="isPasted">All totals are calculated as the sum of the corresponding row values except:<ul><li>Parts Margin → (< |
| 6 | CANDIDATE GAP | PHRASING | `advisor column customer` | `advisor` | - | <ul><li>There are total values for all columns except for:<ul><li>Date</li><li>Invoice Number</li><li>Customer</li><li>Advisor</li></ul></li></ul> |
| 7 | CANDIDATE GAP | PHRASING | `change correct date` | `change` | - | <ul><li>Change date range and verify if totals are correct for selected range<ul><li style="margin: |
| 8 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 9 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 10 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 11 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 12 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 13 | CANDIDATE GAP | PHRASING | `disc ispasted margin` | `disc` | - | disc" id="isPasted">Today</li><li style="margin: |
| 14 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 15 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 16 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 17 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 18 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 19 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">Yesterday</li><li style="margin: |
| 20 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 21 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 22 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 23 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 24 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 25 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">This Week</li><li style="margin: |
| 26 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 27 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 28 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 29 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 30 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 31 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Week</li><li style="margin: |
| 32 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 33 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 34 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 35 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 36 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 37 | CANDIDATE GAP | PHRASING | `disc margin month` | `disc` | - | disc">This Month</li><li style="margin: |
| 38 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 39 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 40 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 41 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 42 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 43 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Month</li><li style="margin: |
| 44 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 45 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 46 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 47 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 48 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 49 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">This Year</li><li style="margin: |
| 50 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 51 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 52 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 53 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 54 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 55 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Year</li><li style="margin: |
| 56 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 57 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 58 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 59 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 60 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 61 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">This Quarter</li><li style="margin: |
| 62 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 63 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 64 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 65 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 66 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 67 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Quarter</li><li style="margin: |
| 68 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 69 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 70 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 71 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 72 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 73 | CANDIDATE GAP | PHRASING | `correct date range` | `correct` | - | <ul><li>Totals are correct for selected date range</li></ul> |
| 74 | CANDIDATE GAP | PHRASING | `advisor date filter` | `advisor` | - | <ul><li>Filter by any Advisor and all of the following date ranges:<ul><li style="margin: |
| 75 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 76 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 77 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 78 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 79 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 80 | CANDIDATE GAP | PHRASING | `disc ispasted margin` | `disc` | - | disc" id="isPasted">Today</li><li style="margin: |
| 81 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 82 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 83 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 84 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 85 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 86 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">Yesterday</li><li style="margin: |
| 87 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 88 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 89 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 90 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 91 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 92 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">This Week</li><li style="margin: |
| 93 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 94 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 95 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 96 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 97 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 98 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Week</li><li style="margin: |
| 99 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 100 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 101 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 102 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 103 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 104 | CANDIDATE GAP | PHRASING | `disc margin month` | `disc` | - | disc">This Month</li><li style="margin: |
| 105 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 106 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 107 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 108 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 109 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 110 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Month</li><li style="margin: |
| 111 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 112 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 113 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 114 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 115 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 116 | CANDIDATE GAP | PHRASING | `disc margin style` | `disc` | - | disc">This Year</li><li style="margin: |
| 117 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 118 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 119 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 120 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 121 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 122 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Year</li><li style="margin: |
| 123 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 124 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 125 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 126 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 127 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 128 | CANDIDATE GAP | PHRASING | `disc margin quarter` | `disc` | - | disc">This Quarter</li><li style="margin: |
| 129 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 130 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 131 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 132 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 133 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 134 | CANDIDATE GAP | PHRASING | `disc last margin` | `disc` | - | disc">Last Quarter</li><li style="margin: |
| 135 | CANDIDATE GAP | PHRASING | `font optical sizing` | `font` | - | font-optical-sizing: |
| 136 | CANDIDATE GAP | PHRASING | `adjust font size` | `adjust` | - | font-size-adjust: |
| 137 | CANDIDATE GAP | PHRASING | `feature font setting` | `feature` | - | font-feature-settings: |
| 138 | CANDIDATE GAP | PHRASING | `font setting variation` | `font` | - | font-variation-settings: |
| 139 | CANDIDATE GAP | PHRASING | `list style type` | `list` | - | list-style-type: |
| 140 | CANDIDATE GAP | PHRASING | `advisor correct selected` | `advisor` | - | <ul><li>Totals are correct for selected Advisor</li></ul> |

## C27259 - COVERED-BY

*Advisor Analysis - Row click opens WO Finance (gated by workOrdersView)*  
Section: Test Cases > Reports > Advisor Analysis  
Author: **Vladimir Tomovic** · refs: `SV-5982` · [open](https://shopview.testrail.io/index.php?/cases/view/27259)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `active advisor assigned` | `active` | - | <p>Owner/admin logged in (reports project storage state)<br />An invoiced WO with a Service Advisor assigned exists in the active workplace, dated within this_month (seeded via API)</p> |
| 2 | CANDIDATE GAP | PHRASING | `advisor analysi contain` | `advisor` | - | <p>Open the Service Advisor Analysis report (default this_month range contains the seeded WO)</p> |
| 3 | CANDIDATE GAP | PHRASING | `finish loading table` | `finish` | - | <p>Wait for the table to finish loading</p> |
| 4 | CANDIDATE GAP | PHRASING | `advisor cell invoice` | `advisor` | - | <p>Click the seeded row's invoice cell (service_advisor_cell_invoice_number_&lt;woId&gt;)</p> |

## C315 - CANDIDATE GAP

*Work Orders Exceeding 24 Hours*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/315)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | COVERED-BY | STRONG | `activity timesheet` | `-` | C19247 C19248 C19249 C19250 C19251 C19252 | <li>Navigate to the 'Timesheet Activities' page</li> |
| 2 | CANDIDATE GAP | STRONG | `day punch record` | `record` | - | <li>The 'Timesheet Activities' page displays records for the time punch on the day it started</li> |
| 3 | CANDIDATE GAP | PHRASING | `exceed having punch` | `exceed` | - | <li>For the location, there is an active Work Order (WO) with at least one line having a time punch that exceeds 24 hours</li> |
| 4 | CANDIDATE GAP | PHRASING | `associated identify punch` | `associated` | - | <li>Identify the time punch record(s) associated with the WO</li> |
| 5 | CANDIDATE GAP | PHRASING | `days exceeding never` | `days` | - | <li>Time punch records are split over at least 2 days and never exceeding 24 hours</li> |

## C1011 - CONTRADICTS-OURS

*Default Ordering of Timesheet Activities*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1011)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `ordering filter activity` | `filter` | - | <li>Verify default filters and default activities ordering</li> |
| 2 | CONTRADICTS-OURS | STRONG | `filter staff set` | `staff` | C19251 | <li>By default 'Filter By Staff' is not set</li> |
| 3 | CANDIDATE GAP | STRONG | `interval filter month` | `filter` | - | <li>By default time interval filter is set to 'This Month'</li> |
| 4 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 5 | CANDIDATE GAP | STRONG | `interval ordering option` | `option` | - | <li>For each time filter interval option verify activities ordering</li> |
| 6 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 7 | CANDIDATE GAP | STRONG | `ordering pick member` | `member` | - | <li>Pick staff member in 'Filter By Staff' and verify activities ordering</li> |
| 8 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 9 | CANDIDATE GAP | STRONG | `interval ordering option` | `option` | - | <li>For the selected staff member verify activities ordering for each time filter interval option </li> |
| 10 | CANDIDATE GAP | STRONG | `newest oldest bottom` | `bottom` | - | <li>Activities are sorted from newest date, with the most recent time, at the top, to oldest, with the oldest time, at the bottom (column 'Date' + column 'Clock In')</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `filtered improved interval` | `filtered` | - | <strong>Currently time interval should be filtered before staff member...this will be improved in the future</strong></p> |

## C1328 - CONTRADICTS-OURS

*Create New Timesheet Activity (no pre-existing activity on the line)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1328)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `corner right new` | `right` | - | <li>Click on 'New' button in top right corner</li> |
| 2 | COVERED-BY | STRONG | `new modal time` | `-` | C19267 C19271 | <li>'New Timesheet Clock Time' modal opens</li> |
| 3 | COVERED-BY | STRONG | `dropdown work order` | `-` | C19267 C19272 | <li>'Work Order' dropdown is present</li> |
| 4 | COVERED-BY | STRONG | `field date` | `-` | C19267 C19268 C19269 C19274 C19275 | <li>'Start' date field is present</li> |
| 5 | COVERED-BY | STRONG | `field end date` | `-` | C19267 C19268 C19274 C19275 | <li>'End' date field is present</li> |
| 6 | CANDIDATE GAP | STRONG | `mandatory populate create` | `create` | - | <li>Populate all mandatory fields and click 'Create'</li> |
| 7 | COVERED-BY | STRONG | `close new modal` | `-` | C19271 | <li>'New Timesheet Clock Time' modal closes</li> |
| 8 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li>'Creation/change was successful' message appears <strong>(No error message upon creation)</strong></li> |
| 9 | COVERED-BY | STRONG | `new list time` | `-` | C19268 C19271 | <li>Verify new entry of clock-in time on the 'Timesheet Activities' list</li> |
| 10 | CANDIDATE GAP | STRONG | `new list visible` | `new` | C19249 C19250 C19291 | <li>New clock-in time is visible on the 'Timesheet Activities' list</li> |
| 11 | CANDIDATE GAP | STRONG | `added tim tab` | `tim` | - | <li>Navigate to WO's 'Timesheets' tab a verify clock-in times on the line it was added</li> |
| 12 | CONTRADICTS-OURS | STRONG | `line new time` | `line` | C19268 C19270 C19271 | <li>A new clock-in time is present on the line</li> |
| 13 | CANDIDATE GAP | STRONG | `lin tim tab` | `lin` | - | <li>Navigate to the WO's 'Lines' tab and verify clock-in times</li> |
| 14 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities </li> |
| 15 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the 'Progress' and 'Actual/Estimate'</li> |
| 16 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on 'Timesheets' tab</li> |

## C1338 - CANDIDATE GAP

*Create activity that starts and ends in same minute*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1338)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `ends minute create` | `create` | - | Create activity that starts and ends in same minute |

## C1339 - CANDIDATE GAP

*Overwrite activity that ends 1 minute after it starts*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1339)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `pick edit button` | `edit` | - | <li>Pick timesheet activity and click edit button</li> |
| 2 | CANDIDATE GAP | STRONG | `dialog edit activity` | `edit` | - | <li>Edit timesheet activity dialog opens</li> |
| 3 | CANDIDATE GAP | STRONG | `minute change end` | `change` | - | <li>Change end time to +1 minute</li> |
| 4 | CANDIDATE GAP | STRONG | `punch saved successfully` | `saved` | - | <li>Time punch is saved successfully.</li> |
| 5 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 6 | CANDIDATE GAP | PHRASING | `make minute sure` | `make` | - | <li><p>Make sure that Start time and End time are the same (same minute)</p></li> |

## C1730 - CANDIDATE GAP

*Create New Timesheet Activity (Line Has Tech Activity)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1730)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `tech lin time` | `lin` | - | <li>Tech user has clock-in time on all lines</li> |
| 2 | CANDIDATE GAP | STRONG | `corner right new` | `right` | - | <li>Click on 'New' button in top right corner</li> |
| 3 | COVERED-BY | STRONG | `new modal time` | `-` | C19267 C19271 | <li>'New Timesheet Clock Time' modal opens</li> |
| 4 | COVERED-BY | STRONG | `close new modal` | `-` | C19271 | <li>'New Timesheet Clock Time' modal closes</li> |
| 5 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li>'Creation/change was successful' message appears <strong>(No error message upon creation)</strong></li> |
| 6 | COVERED-BY | STRONG | `new list time` | `-` | C19268 C19271 | <li>Verify new entry of clock-in time on the 'Timesheet Activities' list</li> |
| 7 | CANDIDATE GAP | STRONG | `new list visible` | `new` | C19249 C19250 C19291 | <li>New clock-in time is visible on the 'Timesheet Activities' list</li> |
| 8 | CANDIDATE GAP | STRONG | `added tim tab` | `tim` | - | <li>Navigate to WO's 'Timesheets' tab a verify clock-in times on the line it was added</li> |
| 9 | CANDIDATE GAP | STRONG | `previou together record` | `record` | - | <li>A new clock-in time is present together with previous time records for the same line</li> |
| 10 | CANDIDATE GAP | STRONG | `lin tim tab` | `lin` | - | <li>Navigate to the WO's 'Lines' tab and verify clock-in times</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `mandatory populate privileg` | `mandatory` | - | <li>Populate all mandatory fields and click 'Create' (Use staff member with Tech privileges)</li> |
| 13 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the 'Progress' and 'Actual/Estimate'</li> |
| 14 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on 'Timesheets' tab</li> |

## C1731 - CONTRADICTS-OURS

*Create New Timesheet Activity (Line Has Admin Activity)*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1731)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CONTRADICTS-OURS | STRONG | `lin time clock` | `lin` | C19270 C19278 | <li>Admin user has clock-in time on all lines</li> |
| 2 | CANDIDATE GAP | STRONG | `corner strong right` | `right` | - | <li>Click on <strong>New</strong> button in top right corner</li> |
| 3 | CANDIDATE GAP | STRONG | `strong new modal` | `new` | - | <li><strong>New Timesheet Clock Time</strong> modal opens</li> |
| 4 | CANDIDATE GAP | STRONG | `strong close new` | `close` | - | <li><strong>New Timesheet Clock Time</strong> modal closes</li> |
| 5 | CANDIDATE GAP | STRONG | `strong successful creation` | `creation` | - | <li><strong>Creation/change was successful</strong> message appears (no error message upon creation)</li> |
| 6 | CANDIDATE GAP | STRONG | `strong new list` | `new` | - | <li>Verify new entry of clock-in time on the <strong>Timesheet Activities</strong> list</li> |
| 7 | CANDIDATE GAP | STRONG | `strong new list` | `new` | - | <li>New clock-in time is visible on the <strong>Timesheet Activities</strong> list</li> |
| 8 | CANDIDATE GAP | STRONG | `added strong tim` | `tim` | - | <li>Navigate to WO's <strong>Timesheets</strong> tab a verify clock-in times on the line it was added</li> |
| 9 | CANDIDATE GAP | STRONG | `previou together record` | `record` | - | <li>A new clock-in time is present together with previous time records for the same line</li> |
| 10 | CANDIDATE GAP | STRONG | `strong lin tim` | `lin` | - | <li>Navigate to the WO's <strong>Lines</strong> tab and verify clock-in times</li> |
| 11 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `mandatory populate privileg` | `mandatory` | - | <li>Populate all mandatory fields and click <strong>Create</strong> (Use staff member with Admin privileges)</li> |
| 13 | CANDIDATE GAP | PHRASING | `actual added estimate` | `actual` | - | <li>A new clock-in time is added to the <strong>Progress</strong> and <strong>Actual/Estimate</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `actual estimate match` | `actual` | - | <li><strong>Actual</strong> time (Actual/Estimate) on the line match the total time per line on <strong>Timesheets</strong> tab</li> |

## C1788 - CANDIDATE GAP

*Create a New Timesheet Activity for a User Already Assigned to the Line*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1788)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `punch strong line` | `line` | - | <li>WO exists with <strong>admin</strong> user time punches on the line</li> |
| 2 | CANDIDATE GAP | STRONG | `already assigned create` | `create` | - | <li>Create a new timesheet activity for a user who is already assigned to the line</li> |
| 3 | COVERED-BY | STRONG | `tab line timesheet` | `-` | C19285 C19286 C19287 C19293 | <li>Verify WO line and WO timesheets tab</li> |
| 4 | COVERED-BY | STRONG | `created new activity` | `-` | C19268 C19269 C19271 | <li>A new timesheet activity is created</li> |
| 5 | CANDIDATE GAP | STRONG | `mentioned punch multiple` | `multiple` | - | <li>Multiple time punches exist on the line for the mentioned user</li> |
| 6 | CANDIDATE GAP | STRONG | `already punch create` | `create` | - | <li>Create a new timesheet activity for a user who already has time punches on the line</li> |
| 7 | COVERED-BY | STRONG | `tab line timesheet` | `-` | C19285 C19286 C19287 C19293 | <li>Verify WO line and WO timesheets tab</li> |
| 8 | COVERED-BY | STRONG | `created new activity` | `-` | C19268 C19269 C19271 | <li>A new timesheet activity is created</li> |
| 9 | CANDIDATE GAP | STRONG | `mentioned punch multiple` | `multiple` | - | <li>Multiple time punches exist on the line for the mentioned user</li> |
| 10 | CANDIDATE GAP | PHRASING | `base navigated punch` | `base` | - | <li>User is navigated to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 11 | CANDIDATE GAP | PHRASING | `base punch url` | `base` | - | <li>Navigate back to the {{BASE_URL}}/reports/punch-clock-activities</li> |
| 12 | CANDIDATE GAP | PHRASING | `foreman process rol` | `foreman` | - | <li>Repeat the process for all user roles (Tech, Foreman...)</li> |

## C182 - CANDIDATE GAP

*Timesheet activities - columns*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/182)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `table column visible` | `column` | - | <li>Verify all visible columns in table</li> |
| 2 | CANDIDATE GAP | STRONG | `modify date time` | `date` | - | <li>Modify Date/Time</li> |
| 3 | CANDIDATE GAP | STRONG | `summed bottom valu` | `bottom` | - | <p>At he bottom there is Totals column with summed up values</p> |
| 4 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C183 - CANDIDATE GAP

*Timesheet activities - time intervals*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/183)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `interval field dropdown` | `field` | - | <li>Verify all the time intervals in the dropdown field</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C184 - CANDIDATE GAP

*Timesheet activities - filter by staff*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/184)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `pick employee filter` | `employee` | - | <li>Click on Filter by staff dropdown and pick employee</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C185 - COVERED-BY

*Timesheet activities - select single row*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/185)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C186 - CANDIDATE GAP

*Timesheet activities - export button*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/186)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `.csv downloading file` | `file` | - | <li>.csv file starts downloading</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base navigated` | `app` | - | <li>App is navigated to page {{BASE_URL}}/reports/punch-clock-activities</li> |

## C287 - CANDIDATE GAP

*Timesheet activities - try to punch in time on department with technician from different location*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/287)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `location multiple department` | `location` | - | <li>There is same department in multiple locations (A and B)</li> |
| 2 | CANDIDATE GAP | STRONG | `punched location department` | `location` | - | <li>Technician punched in time for department in location A</li> |
| 3 | CANDIDATE GAP | STRONG | `location account logged` | `account` | C19279 | <li>User is logged in with admin account on location B</li> |
| 4 | CANDIDATE GAP | STRONG | `punch location visible` | `location` | - | <li>No time punches are visible on location B</li> |
| 5 | CANDIDATE GAP | PHRASING | `finding punch try` | `finding` | - | <li>Try finding time punches from technician on location A</li> |

## C1992 - CANDIDATE GAP

*Timesheet activities - Multiple Browsers*  
Section: Test Cases > Reports > Timesheet Activities  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1992)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | STRONG | `chrome strong using` | `using` | - | <li>User is logged in as Admin using <strong>Chrome</strong></li> |
| 2 | CANDIDATE GAP | STRONG | `assigned tech lin` | `lin` | - | <li>WO is created and tech is assigned to one of the lines</li> |
| 3 | CANDIDATE GAP | STRONG | `previously created` | `created` | - | <li>Navigate to the previously created WO</li> |
| 4 | CANDIDATE GAP | STRONG | `navigated previously created` | `created` | - | <li>User is navigated to the previously created WO</li> |
| 5 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged in and change any data on the line (on <strong>Edit Line</strong> modal)</li> |
| 6 | CANDIDATE GAP | STRONG | `edited strong successfully` | `successfully` | - | <li>Line is successfully <strong>edited</strong></li> |
| 7 | CANDIDATE GAP | STRONG | `strong started successfully` | `started` | - | <li>Line is successfully <strong>started</strong></li> |
| 8 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li><p>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged and verify:</p> |
| 9 | CANDIDATE GAP | STRONG | `strong tab timesheet` | `tab` | - | <li><strong>Timesheets</strong> tab</li> |
| 10 | CANDIDATE GAP | STRONG | `strong activity timesheet` | `activity` | - | <li><strong>Timesheets Activities</strong> page</li> |
| 11 | CANDIDATE GAP | STRONG | `strong export filter` | `export` | - | <li>Timesheets Activities <strong>export</strong> with filter set to <strong>Today</strong></li> |
| 12 | CANDIDATE GAP | STRONG | `strong record current` | `record` | - | <li>There are no record for the current WO and line in the <strong>Timesheets Activities</strong> page</li> |
| 13 | CANDIDATE GAP | STRONG | `export file current` | `current` | C19295 | <li>There is no data for the the current WO and line in the export file</li> |
| 14 | CANDIDATE GAP | STRONG | `strong tech back` | `back` | - | <li>Go back to the other browser where <strong>Tech</strong> user is logged in and click <strong>Stop</strong> on the line tech was working</li> |
| 15 | CANDIDATE GAP | STRONG | `stopped strong successfully` | `successfully` | - | <li>Line is successfully <strong>stopped</strong></li> |
| 16 | CANDIDATE GAP | STRONG | `chrome strong back` | `back` | - | <li><p>Go back to the <strong>Chrome</strong> browser where <strong>Admin</strong> user is logged and verify:</p> |
| 17 | CANDIDATE GAP | STRONG | `strong tab timesheet` | `tab` | - | <li><strong>Timesheets</strong> tab</li> |
| 18 | CANDIDATE GAP | STRONG | `strong activity timesheet` | `activity` | - | <li><strong>Timesheets Activities</strong> page</li> |
| 19 | CANDIDATE GAP | STRONG | `strong export filter` | `export` | - | <li>Timesheets Activities <strong>export</strong> with filter set to <strong>Today</strong></li> |
| 20 | CANDIDATE GAP | STRONG | `match strong record` | `record` | - | <li>There are one record for the current WO and line in the <strong>Timesheets Activities</strong> page that matches Timesheets tab data</li> |
| 21 | CANDIDATE GAP | STRONG | `match export file` | `export` | - | <li>There is one record for the the current WO and line in the export file that matches Timesheets tab data</li> |
| 22 | CANDIDATE GAP | PHRASING | `assign strong tech` | `assign` | - | <li>Create new WO and assign <strong>Tech</strong> to one of the line</li> |
| 23 | CANDIDATE GAP | PHRASING | `chrome edge etc` | `chrome` | - | <li>Open any browser <strong>other than</strong> Chrome (Edge, Firefox, Opera, etc. |
| 24 | CANDIDATE GAP | PHRASING | `login strong tech` | `login` | - | ) and login as <strong>Tech</strong></li> |
| 25 | CANDIDATE GAP | PHRASING | `chrome strong tech` | `chrome` | - | <li>User is logged in as a <strong>Tech</strong> using any browser other than Chrome</li> |
| 26 | CANDIDATE GAP | PHRASING | `edited previously strong` | `edited` | - | <li>Go back to the other browser where <strong>Tech</strong> user is logged in and click <strong>Start</strong> on the previously edited line</li> |
| 27 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time</li> |
| 28 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time on the line reflect data on the Timesheets tab</li> |
| 29 | CANDIDATE GAP | PHRASING | `recorded strong timestamp` | `recorded` | - | <li>There is one recorded with <strong>Start Date</strong> timestamp and <strong>Active</strong> badge for <strong>End Time</strong> on the Timesheets tab</li> |
| 30 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time</li> |
| 31 | CANDIDATE GAP | PHRASING | `actual estimate progress` | `actual` | - | <li><strong>Progress bar</strong> and <strong>Actual/Estimate</strong> time on the line reflect data on the Timesheets tab</li> |
| 32 | CANDIDATE GAP | PHRASING | `recorded strong timestamp` | `recorded` | - | <li>There is one recorded with <strong>Start Date</strong> timestamp and <strong>End Time</strong> timestamp on the Timesheets tab</li> |

## C100 - COVERED-BY

*Filter by manufacturer*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/100)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `field filter manufacturer` | `field` | - | <li>Click on Filter by manufacturer field</li> |
| 3 | CANDIDATE GAP | PHRASING | `down drop list` | `down` | - | <li>List of manufacturers drops down</li> |
| 4 | CANDIDATE GAP | PHRASING | `manufacturer part selected` | `manufacturer` | - | <li>Only parts from selected manufacturer are shown</li> |

## C1720 - COVERED-BY

*Validate columns*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1720)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `column required visible` | `column` | - | <li>Verify all required columns are visible</li> |
| 3 | CANDIDATE GAP | PHRASING | `category column manufacturer` | `category` | - | <li><p>columns:<br /> partNumber, category, manufacturer, vendor. |
| 4 | CANDIDATE GAP | PHRASING | `averagecost core countgroup` | `averagecost` | - | gridLocation, averageCost, core, sellPrice, size, quantity, min, max, lastCountDate, countGroup</p></li> |

## C101 - COVERED-BY

*Filter by category*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/101)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `category field filter` | `category` | - | <li>Click on Filter by Category field</li> |
| 3 | CANDIDATE GAP | PHRASING | `category down drop` | `category` | - | <li>List of categories drops down</li> |
| 4 | CANDIDATE GAP | PHRASING | `category part selected` | `category` | - | <li>Only parts from selected category are shown</li> |

## C102 - COVERED-BY

*Filter by supply*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/102)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `field filter supply` | `field` | - | <li>Click on Filter by Supply field</li> |
| 3 | CANDIDATE GAP | PHRASING | `category down drop` | `category` | - | <li><p>List with 4 categories drops down:<br />All categories<br />Under-supplied<br />Well-supplied<br />Over-supplied</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `pick supplied well` | `pick` | - | <li>Pick Well-supplied</li> |
| 5 | CANDIDATE GAP | PHRASING | `item supplied well` | `item` | - | <li>Well-supplied items shown</li> |

## C103 - COVERED-BY

*Shown columns*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/103)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `column filter off` | `column` | - | <li>All toggles in Show Columns filter are set to OFF state</li> |
| 3 | CANDIDATE GAP | PHRASING | `option part set` | `option` | - | <li>Set Part option to on</li> |
| 4 | CANDIDATE GAP | PHRASING | `grid location set` | `grid` | - | <li>Set Grid location to on</li> |
| 5 | CANDIDATE GAP | PHRASING | `average cost set` | `average` | - | <li>Set Average cost to on</li> |
| 6 | CANDIDATE GAP | PHRASING | `price sell set` | `price` | - | <li>Set Sell Price to on</li> |

## C104 - COVERED-BY

*New Inventory Part - happy case*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/104)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `button inventory new` | `button` | - | <li>Click on New Inventory Part button</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog inventory new` | `dialog` | - | <li>New Inventory Part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `added inventory new` | `added` | - | <li>New Inventory part added</li> |

## C105 - COVERED-BY

*New Inventory Part - FE validation*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/105)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `button inventory new` | `button` | - | <li>Click on New Inventory Part button</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog inventory new` | `dialog` | - | <li>New Inventory Part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `catalog field mandatory` | `catalog` | - | <li>Verify that field Catalog part is mandatory</li> |
| 5 | CANDIDATE GAP | PHRASING | `error message set` | `error` | - | <li>If not set, error message on FE: |
| 6 | CANDIDATE GAP | PHRASING | `catalog field part` | `catalog` | - | Catalog part is a required field</li> |
| 7 | CANDIDATE GAP | PHRASING | `field mandatory vendor` | `field` | - | <li>Verify that field Vendor is mandatory</li> |
| 8 | CANDIDATE GAP | PHRASING | `2877 field longer` | `2877` | - | <li><strong>Since v0.13 this is no longer a mandatory field [SV-2877]</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `error message set` | `error` | - | <p>// If not set, Error message on FE: |
| 10 | CANDIDATE GAP | PHRASING | `field required vendor` | `field` | - | Vendor is a required field</p> |

## C106 - COVERED-BY

*New Inventory Part - close dialog*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/106)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `button inventory new` | `button` | - | <li>Click on New Inventory Part button</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog inventory new` | `dialog` | - | <li>New Inventory Part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `button close dialog` | `button` | - | <li>Click "x" button to close dialog</li> |

## C107 - COVERED-BY

*Edit Inventory Part - Save*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/107)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `existing inventory part` | `existing` | - | <li>Click on existing inventory part from the table</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit Inventory Part dialog is opened</li> |
| 4 | CANDIDATE GAP | PHRASING | `dialog edit field` | `dialog` | - | <li>Edit fields from dialog</li> |
| 5 | CANDIDATE GAP | PHRASING | `info inventory part` | `info` | - | <li>Updated info is visible on inventory part</li> |

## C108 - COVERED-BY

*Edit Inventory Part - Delete*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/108)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `existing inventory part` | `existing` | - | <li>Click on existing inventory part from the table</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit Inventory Part dialog is opened</li> |
| 4 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p>Confirm deletion modal pops up with options<br />Delete<br />Cancel</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p>Confirm deletion modal pops up with options<br />Delete<br />Cancel</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `deleted inventory part` | `deleted` | - | <li>Inventory Part deleted</li> |

## C338 - COVERED-BY

*[SV-1844] Cycle Count*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/338)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory menu (3 dots)</li> |
| 3 | CANDIDATE GAP | PHRASING | `count cycle new` | `count` | - | <li>New option ' Cycle count' is visible</li> |
| 4 | CANDIDATE GAP | PHRASING | `close dropdown inventory` | `close` | - | <li>Inventory menu (dropdown) closes</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory longer` | `button` | - | <li>'New Inventory Part' button is no longer visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `button save visible` | `button` | - | <li>'Save' button is visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `button cancel visible` | `button` | - | <li>'Cancel' button is visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li>'Count changes available: |
| 9 | CANDIDATE GAP | PHRASING | `message visible xyz` | `message` | - | XYZ' message is visible</li> |
| 10 | CANDIDATE GAP | PHRASING | `button print visible` | `button` | - | <li>Print button is visible</li> |
| 11 | CANDIDATE GAP | PHRASING | `column new table` | `column` | - | <li><p>New columns are visible on the table:</p> |
| 12 | CANDIDATE GAP | PHRASING | `button longer save` | `button` | - | <li>'Save' button is no longer visible</li> |
| 13 | CANDIDATE GAP | PHRASING | `button cancel longer` | `button` | - | <li>'Cancel' button is no longer visible</li> |
| 14 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li>'Count changes available: |
| 15 | CANDIDATE GAP | PHRASING | `longer message visible` | `longer` | - | XYZ' message is no longer visible</li> |
| 16 | CANDIDATE GAP | PHRASING | `adjustment column count` | `adjustment` | - | <li>Columns 'Count' and 'Adjustment' are no longer visible</li> |
| 17 | CANDIDATE GAP | PHRASING | `button longer print` | `button` | - | <li>Print button is no longer visible</li> |
| 18 | CANDIDATE GAP | PHRASING | `button inventory new` | `button` | - | <li>'New Inventory Part' button is visible again</li> |

## C339 - COVERED-BY

*[SV-1844] Cycle Count Input Validation*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/339)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory menu (3 dots)</li> |
| 3 | CANDIDATE GAP | PHRASING | `count cycle option` | `count` | - | <li>Option ' Cycle count' is visible</li> |
| 4 | CANDIDATE GAP | PHRASING | `close dropdown inventory` | `close` | - | <li>Inventory menu (dropdown) closes</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory longer` | `button` | - | <li>'New Inventory Part' button is no longer visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `button save visible` | `button` | - | <li>'Save' button is visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `button cancel visible` | `button` | - | <li>'Cancel' button is visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li>'Count changes available: |
| 9 | CANDIDATE GAP | PHRASING | `message visible xyz` | `message` | - | XYZ' message is visible</li> |
| 10 | CANDIDATE GAP | PHRASING | `button print visible` | `button` | - | <li>Print button is visible</li> |
| 11 | CANDIDATE GAP | PHRASING | `column new table` | `column` | - | <li><p>New columns are visible on the table:</p> |
| 12 | CANDIDATE GAP | PHRASING | `character count enter` | `character` | - | <li><p>Enter special characters and symbols in 'Count' field <br />Example: |
| 13 | CANDIDATE GAP | PHRASING | `allowed character special` | `allowed` | - | <li>Special characters and symbols are not allowed</li> |
| 14 | CANDIDATE GAP | PHRASING | `character contain count` | `character` | - | <li><p>Enter mixed values that contain both numerical and non-numerical character in 'Count' field <br />Example: |
| 15 | CANDIDATE GAP | PHRASING | `12abc34 9.10abc strong` | `12abc34` | - | <strong>12abc34, 56#78, 9.10abc</strong></p></li> |
| 16 | CANDIDATE GAP | PHRASING | `allowed character non` | `allowed` | - | <li>Non-numerical characters are not allowed</li> |
| 17 | CANDIDATE GAP | PHRASING | `count decimal enter` | `count` | - | <li><p>Enter decimal numbers in 'Count' field <br />Example: |
| 18 | CANDIDATE GAP | PHRASING | `1.00 1.724 1.725` | `1.00` | - | <strong>1.00, 1.724, 1.725, 1.729</strong></p></li> |
| 19 | CANDIDATE GAP | PHRASING | `allowed decimal number` | `allowed` | - | <li>Decimal numbers are <strong>allowed</strong></li> |
| 20 | CANDIDATE GAP | PHRASING | `count enter example` | `count` | - | <li><p>Enter negative number in 'Count' field <br />Example: |
| 21 | CANDIDATE GAP | PHRASING | `allowed negative number` | `allowed` | - | <li>Negative numbers are not allowed</li> |
| 22 | CANDIDATE GAP | PHRASING | `count enter example` | `count` | - | <li><p>Enter number grater than 1 million in 'Count' field <br />Example: |
| 23 | CANDIDATE GAP | PHRASING | `border input red` | `border` | - | <li>Input border turns red</li> |
| 24 | CANDIDATE GAP | PHRASING | `1000000 below cannot` | `1000000` | - | <li>Message is displayed below the field 'Count value cannot be higher than 1000000'</li> |

## C340 - COVERED-BY

*Cycle Count  - Save*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/340)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory <strong>menu</strong> (3 dots)</li> |
| 3 | CANDIDATE GAP | PHRASING | `count cycle option` | `count` | - | <li>Option <strong>Cycle count</strong> is visible</li> |
| 4 | CANDIDATE GAP | PHRASING | `count cycle strong` | `count` | - | <li>Click on <strong>Cycle count</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `close dropdown inventory` | `close` | - | <li>Inventory menu (dropdown) closes</li> |
| 6 | CANDIDATE GAP | PHRASING | `button inventory longer` | `button` | - | <li><strong>New Inventory Part</strong> button is no longer visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `button save strong` | `button` | - | <li><strong>Save</strong> button is visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `button cancel strong` | `button` | - | <li><strong>Cancel</strong> button is visible</li> |
| 9 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li><strong>Count changes available: |
| 10 | CANDIDATE GAP | PHRASING | `corner message right` | `corner` | - | XYZ</strong> message is visible in the top right corner</li> |
| 11 | CANDIDATE GAP | PHRASING | `button print strong` | `button` | - | <li><strong>Print</strong> button is visible</li> |
| 12 | CANDIDATE GAP | PHRASING | `column new table` | `column` | - | <li><p>New columns are visible on the table:</p> |
| 13 | CANDIDATE GAP | PHRASING | `count part save` | `count` | - | <li>Set <strong>Count</strong> value for some parts and click on <strong>Save</strong></li> |
| 14 | CANDIDATE GAP | PHRASING | `modal quantity strong` | `modal` | - | <li><p><strong>Update quantity</strong> modal opens</p> |
| 15 | CANDIDATE GAP | PHRASING | `about inventory part` | `about` | - | <li><strong>You’re about to update quantity of selected inventory parts. |
| 16 | CANDIDATE GAP | PHRASING | `message modal proceed` | `message` | - | Do you want to proceed?</strong> message is visible in the modal</li> |
| 17 | CANDIDATE GAP | PHRASING | `button close strong` | `button` | - | <li><strong>Close</strong> (X) button is visible</li> |
| 18 | CANDIDATE GAP | PHRASING | `button cancel strong` | `button` | - | <li><strong>Cancel</strong> button is visible</li> |
| 19 | CANDIDATE GAP | PHRASING | `button save strong` | `button` | - | <li><strong>Save</strong> button is visible</li> |
| 20 | CANDIDATE GAP | PHRASING | `adjusted amount enhancement` | `adjusted` | - | <p>( future enhancement )<br />The adjusted amount will be displayed on the modal message </p> |
| 21 | CANDIDATE GAP | PHRASING | `close modal quantity` | `close` | - | <li><strong>Update quantity</strong> modal closes</li> |
| 22 | CANDIDATE GAP | PHRASING | `count previously remain` | `count` | - | <li>Previously set <strong>Count</strong> values remain the same</li> |
| 23 | CANDIDATE GAP | PHRASING | `count few more` | `count` | - | <li>Set <strong>Count</strong> value for few more parts and click on <strong>Save</strong></li> |
| 24 | CANDIDATE GAP | PHRASING | `modal quantity strong` | `modal` | - | <li><p><strong>Update quantity</strong> modal opens</p> |
| 25 | CANDIDATE GAP | PHRASING | `about inventory part` | `about` | - | <li><strong>You’re about to update quantity of selected inventory parts. |
| 26 | CANDIDATE GAP | PHRASING | `message modal proceed` | `message` | - | Do you want to proceed?</strong> message is visible in the modal</li> |
| 27 | CANDIDATE GAP | PHRASING | `button close strong` | `button` | - | <li><strong>Close</strong> (X) button is visible</li> |
| 28 | CANDIDATE GAP | PHRASING | `button cancel strong` | `button` | - | <li><strong>Cancel</strong> button is visible</li> |
| 29 | CANDIDATE GAP | PHRASING | `button save strong` | `button` | - | <li><strong>Save</strong> button is visible</li> |
| 30 | CANDIDATE GAP | PHRASING | `adjusted amount enhancement` | `adjusted` | - | <p>( future enhancement )<br />The adjusted amount will be displayed on the modal message </p> |
| 31 | CANDIDATE GAP | PHRASING | `close modal quantity` | `close` | - | <li><strong>Update quantity</strong> modal closes</li> |
| 32 | CANDIDATE GAP | PHRASING | `count previously remain` | `count` | - | <li>Previously set <strong>Count</strong> values remain the same</li> |
| 33 | CANDIDATE GAP | PHRASING | `count few more` | `count` | - | <li>Set <strong>Count</strong> value for few more parts and click on <strong>Save</strong></li> |
| 34 | CANDIDATE GAP | PHRASING | `modal quantity strong` | `modal` | - | <li><p><strong>Update quantity</strong> modal opens</p> |
| 35 | CANDIDATE GAP | PHRASING | `about inventory part` | `about` | - | <li><strong>You’re about to update quantity of selected inventory parts. |
| 36 | CANDIDATE GAP | PHRASING | `message modal proceed` | `message` | - | Do you want to proceed?</strong> message is visible in the modal</li> |
| 37 | CANDIDATE GAP | PHRASING | `button close strong` | `button` | - | <li><strong>Close</strong> (X) button is visible</li> |
| 38 | CANDIDATE GAP | PHRASING | `button cancel strong` | `button` | - | <li><strong>Cancel</strong> button is visible</li> |
| 39 | CANDIDATE GAP | PHRASING | `button save strong` | `button` | - | <li><strong>Save</strong> button is visible</li> |
| 40 | CANDIDATE GAP | PHRASING | `adjusted amount enhancement` | `adjusted` | - | <p>( future enhancement )<br />The adjusted amount will be displayed on the modal message </p> |
| 41 | CANDIDATE GAP | PHRASING | `clicking multiple save` | `clicking` | - | <li>Confirm with <strong>Save</strong> (try clicking it multiple times)</li> |
| 42 | CANDIDATE GAP | PHRASING | `1st button disabled` | `1st` | - | <li>Button is disabled after 1st click (loading spinner is visible)</li> |
| 43 | CANDIDATE GAP | PHRASING | `close quantity strong` | `close` | - | <li><strong>Update quantity</strong> closes</li> |
| 44 | CANDIDATE GAP | PHRASING | `adjusted inventory new` | `adjusted` | - | <li>New quantities are visible on the Inventory page for the adjusted parts</li> |

## C341 - COVERED-BY

*[SV-1844] Cycle Count - Print*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/341)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory menu (3 dots)</li> |
| 3 | CANDIDATE GAP | PHRASING | `count cycle option` | `count` | - | <li>Option ' Cycle count' is visible</li> |
| 4 | CANDIDATE GAP | PHRASING | `close dropdown inventory` | `close` | - | <li>Inventory menu (dropdown) closes</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory longer` | `button` | - | <li>'New Inventory Part' button is no longer visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `button save visible` | `button` | - | <li>'Save' button is visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `button cancel visible` | `button` | - | <li>'Cancel' button is visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li>Count changes available: |
| 9 | CANDIDATE GAP | PHRASING | `message visible xyz` | `message` | - | XYZ' message is visible</li> |
| 10 | CANDIDATE GAP | PHRASING | `button print visible` | `button` | - | <li>Print button is visible</li> |
| 11 | CANDIDATE GAP | PHRASING | `column new table` | `column` | - | <li><p>New columns are visible on the table:</p> |
| 12 | CANDIDATE GAP | PHRASING | `count part print` | `count` | - | <li>Set 'Count' value for some part and click on 'Print'</li> |
| 13 | CANDIDATE GAP | PHRASING | `new preview print` | `new` | - | <li>New browser tab opens with print preview</li> |
| 14 | CANDIDATE GAP | PHRASING | `changed future loaded` | `changed` | - | <li>Print preview shows only loaded pages ( <strong>this will be changed in the future</strong> )</li> |
| 15 | CANDIDATE GAP | PHRASING | `app changed future` | `app` | - | <li>Quantity stays unchanged on both app and print preview ( <strong>this might be changed in the future</strong> )</li> |
| 16 | CANDIDATE GAP | PHRASING | `modal quantity update` | `modal` | - | <li>Update quantity modal opens</li> |
| 17 | CANDIDATE GAP | PHRASING | `adjusted amount enhancement` | `adjusted` | - | <li>The adjusted amount will be displayed on the modal message ( <strong>future enhancement</strong> )</li> |
| 18 | CANDIDATE GAP | PHRASING | `current inventory new` | `current` | - | <li>New quantity is visible on the Inventory for the current part</li> |
| 19 | CANDIDATE GAP | PHRASING | `new preview print` | `new` | - | <li>New browser tab opens with print preview</li> |
| 20 | CANDIDATE GAP | PHRASING | `changed future loaded` | `changed` | - | <li>Print preview shows only loaded pages ( <strong>this will be changed in the future</strong> )</li> |
| 21 | CANDIDATE GAP | PHRASING | `changed future preview` | `changed` | - | <li>Quantity stays unchanged on print preview ( <strong>this might be changed in the future</strong> )</li> |
| 22 | CANDIDATE GAP | PHRASING | `count cycle enter` | `count` | - | <li>Refresh the page and enter Cycle count again</li> |
| 23 | CANDIDATE GAP | PHRASING | `new preview print` | `new` | - | <li>New browser tab opens with print preview</li> |
| 24 | CANDIDATE GAP | PHRASING | `changed future loaded` | `changed` | - | <li>Print preview shows only loaded pages ( <strong>this will be changed in the future</strong> )</li> |
| 25 | CANDIDATE GAP | PHRASING | `new now preview` | `new` | - | <li>New quantity is now visible on print preview</li> |
| 26 | CANDIDATE GAP | PHRASING | `layout pdf quantity` | `layout` | - | <li>Download the PDF and verify quantity and layout</li> |
| 27 | CANDIDATE GAP | PHRASING | `count cycle downloaded` | `count` | - | <li>PDF is downloaded with the same layout and quantity as shown in the preview and Inventory (excluding Cycle Count fields)</li> |

## C342 - COVERED-BY

*[SV-1844] Cycle Count Adjustment Calculation*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/342)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory menu (3 dots)</li> |
| 3 | CANDIDATE GAP | PHRASING | `count cycle option` | `count` | - | <li>Option ' Cycle count' is visible</li> |
| 4 | CANDIDATE GAP | PHRASING | `close dropdown inventory` | `close` | - | <li>Inventory menu (dropdown) closes</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory longer` | `button` | - | <li>'New Inventory Part' button is no longer visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `button save visible` | `button` | - | <li>'Save' button is visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `button cancel visible` | `button` | - | <li>'Cancel' button is visible</li> |
| 8 | CANDIDATE GAP | PHRASING | `available chang count` | `available` | - | <li>Count changes available: |
| 9 | CANDIDATE GAP | PHRASING | `message visible xyz` | `message` | - | XYZ' message is visible</li> |
| 10 | CANDIDATE GAP | PHRASING | `button print visible` | `button` | - | <li>Print button is visible</li> |
| 11 | CANDIDATE GAP | PHRASING | `column new table` | `column` | - | <li><p>New columns are visible to the table:</p> |
| 12 | CANDIDATE GAP | PHRASING | `1000000 adjustment allowed` | `1000000` | - | <li>Enter any number between 0 and 1000000 in 'Count' field (both 0 and 1000000 are allowed) and verify Adjustment column value for the part</li> |

## C996 - COVERED-BY

*Edit Inventory Part Quantity Validation*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `[SV-2893]` · [open](https://shopview.testrail.io/index.php?/cases/view/996)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `inventory list part` | `inventory` | - | <li>Pick any part from the inventory list and click on it</li> |
| 3 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `1000001 quantity save` | `1000001` | - | <li>Set Quantity to <strong>1000001</strong> and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `below border error` | `below` | - | <li>Quantity border turns to red with error message below the field <strong>Maximum quantity is 1 million</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `quantity save set` | `quantity` | - | <li>Set Quantity to <strong>-1</strong> and click <strong>Save</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `below border cannot` | `below` | - | <p>//- Quantity border turns to red with error message below the field <strong>Quantity cannot be a negative number</strong></p> |
| 8 | CANDIDATE GAP | PHRASING | `part quantity strong` | `part` | - | <li>Part Quantity is <strong>-1</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `quantity set strong` | `quantity` | - | <li>Set Quantity to <strong>0</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 11 | CANDIDATE GAP | PHRASING | `part quantity strong` | `part` | - | <li>Part Quantity is <strong>0</strong></li> |
| 12 | CANDIDATE GAP | PHRASING | `1000000 quantity set` | `1000000` | - | <li>Set Quantity to <strong>1000000</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 14 | CANDIDATE GAP | PHRASING | `1000000 part quantity` | `1000000` | - | <li>Part Quantity is <strong>1000000</strong></li> |

## C2201 - COVERED-BY

*Edit Inventory Part Quantity Validation*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `[SV-2893]` · [open](https://shopview.testrail.io/index.php?/cases/view/2201)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `inventory list part` | `inventory` | - | <li>Pick any part from the inventory list and click on it</li> |
| 3 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `quantity save set` | `quantity` | - | <li>Set Quantity and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `changed quantity set` | `changed` | - | <li>Quantity has changed to the value that was set</li> |

## C997 - COVERED-BY

*[SV-2897] Verify Filters Upon Saving Cycle Count Changes*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/997)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to the {{BASE_URL}}/parts/inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `category column count` | `category` | - | <li><p>Open Cycle Count and Verify filters:<br />Filter By Manufacturer<br />Filter By Category<br />Filter By Supply<br />Shown columns</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `available filter option` | `available` | - | <li>All filter options are available and working</li> |
| 4 | CANDIDATE GAP | PHRASING | `count enter part` | `count` | - | <li>Enter Count value for any part and click 'Save'</li> |
| 5 | CANDIDATE GAP | PHRASING | `chang clicking modal` | `chang` | - | <li>Confirm quantity changes by clicking 'Save' on 'Update quantity' modal</li> |
| 6 | CANDIDATE GAP | PHRASING | `chang inventory table` | `chang` | - | <li>Changes are visible in Inventory table</li> |
| 7 | CANDIDATE GAP | PHRASING | `category column filter` | `category` | - | <li><p>Verify filters:<br />Filter By Manufacturer<br />Filter By Category<br />Filter By Supply<br />Shown columns</p></li> |
| 8 | CANDIDATE GAP | PHRASING | `available filter option` | `available` | - | <li>All filter options are available and working</li> |

## C1724 - COVERED-BY

*Set iventory and request and deliver part (inventory qty = part req. qty)*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1724)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to {BASE_URL}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `add catalog inventory` | `add` | - | <li><p>Add catalog part as new inventory part</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `added inventory part` | `added` | - | <li>Inventory part added successfully</li> |
| 4 | CANDIDATE GAP | PHRASING | `add added inventory` | `add` | - | <li>Navigate to WO and add part request for newly added inventory part (qty =1)</li> |
| 5 | CANDIDATE GAP | PHRASING | `added request successfully` | `added` | - | <li><p>Request added successfully</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `1st added find` | `1st` | - | <li>Navigate to Inventory and find part added in 1st step</li> |

## C1725 - COVERED-BY

*Set iventory and request and deliver part (inventory qty < part req. qty)*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1725)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to {BASE_URL}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `add catalog inventory` | `add` | - | <li><p>Add catalog part as new inventory part</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `added inventory part` | `added` | - | <li>Inventory part added successfully</li> |
| 4 | CANDIDATE GAP | PHRASING | `add added inventory` | `add` | - | <li>Navigate to WO and add part request for newly added inventory part (qty =2)</li> |
| 5 | CANDIDATE GAP | PHRASING | `added request successfully` | `added` | - | <li><p>Request added successfully</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `cannot ordered part` | `cannot` | - | <li><p>Part CANNOT be Picked, must be in Ordered</p></li> |
| 7 | CANDIDATE GAP | PHRASING | `deliver order part` | `deliver` | - | <li>Order + deliver part</li> |
| 8 | CANDIDATE GAP | PHRASING | `1st added find` | `1st` | - | <li>Navigate to Inventory and find part added in 1st step</li> |

## C1726 - COVERED-BY

*Set iventory and request and deliver part (inventory qty > part req. qty)*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1726)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory navigated` | `base` | - | <li>User is navigated to {BASE_URL}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `add catalog inventory` | `add` | - | <li><p>Add catalog part as new inventory part</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `added inventory part` | `added` | - | <li>Inventory part added successfully</li> |
| 4 | CANDIDATE GAP | PHRASING | `add added inventory` | `add` | - | <li>Navigate to WO and add part request for newly added inventory part (qty =1)</li> |
| 5 | CANDIDATE GAP | PHRASING | `added request successfully` | `added` | - | <li>Request added successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `deliver order part` | `deliver` | - | <li>Order + deliver part</li> |
| 7 | CANDIDATE GAP | PHRASING | `1st added find` | `1st` | - | <li>Navigate to Inventory and find part added in 1st step</li> |

## C1760 - COVERED-BY

*Add core to coreless inventory part*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1760)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `core edit part` | `core` | - | <li>Select part <strong>without</strong> core to edit it</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `charge core save` | `charge` | - | <li>Set <strong>core charge</strong> < $0 and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `cannot charge core` | `cannot` | - | <li><strong>Core charge</strong> cannot be lower than 0</li> |
| 6 | CANDIDATE GAP | PHRASING | `charge core save` | `charge` | - | <li>Set <strong>core charge</strong> > $0 and click <strong>Save</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `charge core set` | `charge` | - | <li><strong>Core charge</strong> set successfully</li> |
| 8 | CANDIDATE GAP | PHRASING | `edited exist instance` | `edited` | - | <li>On the Parts/Inventory page, in the parts list, verify that <strong>only one instance</strong> of the previously edited part exists</li> |
| 9 | CANDIDATE GAP | PHRASING | `average cost part` | `average` | - | <li>Verify <strong>average cost</strong> of the part</li> |
| 10 | CANDIDATE GAP | PHRASING | `edited entry list` | `edited` | - | <li>The parts list displays only one entry for the edited part. |
| 11 | CANDIDATE GAP | PHRASING | `chang core created` | `chang` | - | No duplicate entries are created as a result of core price changes</li> |
| 12 | CANDIDATE GAP | PHRASING | `average cost part` | `average` | - | <li><strong>Average cost</strong> of the part remains the same</li> |
| 13 | CANDIDATE GAP | PHRASING | `order part pick` | `order` | - | <li>Go to WO, order and pick that part</li> |
| 14 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | <li>Core charge is the same as in Inventory</li> |
| 15 | CANDIDATE GAP | PHRASING | `cost inventory part` | `cost` | - | <li>Part Cost is the same as in Inventory</li> |
| 16 | CANDIDATE GAP | PHRASING | `inventory price sell` | `inventory` | - | <li>Sell Price is the same as in Inventory</li> |

## C1761 - COVERED-BY

*Remove core from part*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1761)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `core edit part` | `core` | - | <li>Select part <strong>with</strong> Core to edit it</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `core price save` | `core` | - | <li>Set core price to $0 and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `price set successfully` | `price` | - | <li>Price set successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `edited exist instance` | `edited` | - | <li>On the Parts/Inventory page, in the parts list, verify that <strong>only one instance</strong> of the previously edited part exists</li> |
| 7 | CANDIDATE GAP | PHRASING | `average cost part` | `average` | - | <li>Verify <strong>average cost</strong> of the part</li> |
| 8 | CANDIDATE GAP | PHRASING | `edited entry list` | `edited` | - | <li>The parts list displays only one entry for the edited part. |
| 9 | CANDIDATE GAP | PHRASING | `chang core created` | `chang` | - | No duplicate entries are created as a result of core price changes</li> |
| 10 | CANDIDATE GAP | PHRASING | `average cost part` | `average` | - | <li><strong>Average cost</strong> of the part remains the same</li> |
| 11 | CANDIDATE GAP | PHRASING | `order part pick` | `order` | - | <li>Go to WO, order and pick that part</li> |
| 12 | CANDIDATE GAP | PHRASING | `core part strong` | `core` | - | <li>Part has <strong>NO</strong> core</li> |
| 13 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | <li>Core charge is the same as in Inventory</li> |
| 14 | CANDIDATE GAP | PHRASING | `cost inventory part` | `cost` | - | <li>Part Cost is the same as in Inventory</li> |
| 15 | CANDIDATE GAP | PHRASING | `inventory price sell` | `inventory` | - | <li>Sell Price is the same as in Inventory</li> |

## C2143 - COVERED-BY

*Verify Part's Fixed Sell Price Upon Adding Core*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2143)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `core edit fixed` | `core` | - | <li>Select part <strong>without</strong> core and <strong>fixed</strong> Sell Price to edit it</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `charge core save` | `charge` | - | <li>Set <strong>core charge</strong> > $0 and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `charge core set` | `charge` | - | <li><strong>Core charge</strong> set successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `fixed part price` | `fixed` | - | <li>Verify <strong>fixed</strong> Sell Price of the part</li> |
| 7 | CANDIDATE GAP | PHRASING | `fixed price remain` | `fixed` | - | <li><strong>Fixed</strong> Sell Price remains the same</li> |
| 8 | CANDIDATE GAP | PHRASING | `order part pick` | `order` | - | <li>Go to WO, order and pick that part</li> |
| 9 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | <li>Core charge is the same as in Inventory</li> |
| 10 | CANDIDATE GAP | PHRASING | `cost inventory part` | `cost` | - | <li>Part Cost is the same as in Inventory</li> |
| 11 | CANDIDATE GAP | PHRASING | `inventory price sell` | `inventory` | - | <li>Sell Price is the same as in Inventory</li> |

## C2144 - COVERED-BY

*Verify Part's Fixed Sell Price Upon Removing Core*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2144)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `core edit fixed` | `core` | - | <li>Select part <strong>with</strong> core and <strong>fixed</strong> Sell Price to edit it</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `charge core save` | `charge` | - | <li>Set <strong>core charge</strong> to $0 and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `charge core set` | `charge` | - | <li><strong>Core charge</strong> set successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `fixed part price` | `fixed` | - | <li>Verify <strong>fixed</strong> Sell Price of the part</li> |
| 7 | CANDIDATE GAP | PHRASING | `fixed price remain` | `fixed` | - | <li><strong>Fixed</strong> Sell Price remains the same</li> |
| 8 | CANDIDATE GAP | PHRASING | `order part pick` | `order` | - | <li>Go to WO, order and pick that part</li> |
| 9 | CANDIDATE GAP | PHRASING | `core part strong` | `core` | - | <li>Part has <strong>NO</strong> core</li> |
| 10 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | <li>Core charge is the same as in Inventory</li> |
| 11 | CANDIDATE GAP | PHRASING | `cost inventory part` | `cost` | - | <li>Part Cost is the same as in Inventory</li> |
| 12 | CANDIDATE GAP | PHRASING | `inventory price sell` | `inventory` | - | <li>Sell Price is the same as in Inventory</li> |

## C2145 - COVERED-BY

*Add and Remove Core From The Same Part*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2145)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `core edit part` | `core` | - | <li>Select part <strong>without</strong> core to edit it</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `charge core save` | `charge` | - | <li>Set <strong>core charge</strong> > $0 and click <strong>Save</strong></li> |
| 5 | CANDIDATE GAP | PHRASING | `charge core set` | `charge` | - | <li><strong>Core charge</strong> set successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `edit part strong` | `edit` | - | <li>Select the <strong>same</strong> part to edit it</li> |
| 7 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | <li>Edit inventory part dialog opens</li> |
| 8 | CANDIDATE GAP | PHRASING | `core price save` | `core` | - | <li>Set core price to $0 and click <strong>Save</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `charge core set` | `charge` | - | <li><strong>Core charge</strong> set successfully</li> |

## C2146 - COVERED-BY

*Verify Returned Core Existence After Core Removal*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2146)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `core order part` | `core` | - | <li>Go to any WO, order and pick part <strong>with</strong> core</li> |
| 2 | CANDIDATE GAP | PHRASING | `core line part` | `core` | - | <li>Part <strong>with</strong> core is visible on the line</li> |
| 3 | CANDIDATE GAP | PHRASING | `core part returned` | `core` | - | <li>Core for that part is <strong>Returned</strong></li> |
| 4 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | <li>Navigate to <strong>Parts > Inventory</strong> page and set <strong>core charge</strong> to $0 </li> |
| 5 | CANDIDATE GAP | PHRASING | `core part removed` | `core` | - | <li>Core is set to $0 (core is removed for that part)</li> |
| 6 | CANDIDATE GAP | PHRASING | `core existence part` | `core` | - | <li>Navigate to <strong>Parts > Return</strong> page and verify existence of the returned core</li> |
| 7 | CANDIDATE GAP | PHRASING | `core part previously` | `core` | - | <li>The previously returned core is visible on the <strong>Parts > Return</strong> page</li> |

## C2169 - COVERED-BY

*Inventory Listing Export to CSV*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2169)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `inventory navigated part` | `inventory` | - | <li>User is navigated to the Parts > Inventory page</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots export menu` | `dots` | - | <li>Open 3 dots menu and click on <strong>Export</strong></li> |
| 3 | CANDIDATE GAP | PHRASING | `csv downloaded file` | `csv` | - | <li>CSV file is downloaded</li> |
| 4 | CANDIDATE GAP | PHRASING | `column following order` | `column` | - | <li><p>The following columns are visible in the following order</p> |
| 5 | CANDIDATE GAP | PHRASING | `available number quantity` | `available` | - | <li>quantity (shows the <strong>number</strong> only without available)</li> |
| 6 | CANDIDATE GAP | PHRASING | `app average cost` | `app` | - | <li>purchase_price (matches <strong>Average Cost</strong> in the app)</li> |
| 7 | CANDIDATE GAP | PHRASING | `cell core emoty` | `cell` | - | <li>core_price (if core price is 0 shows an emoty cell)</li> |
| 8 | CANDIDATE GAP | PHRASING | `app csv data` | `app` | - | <li>CSV data match data in the app</li> |

## C2357 - COVERED-BY

*Cycle Count - Decimal Rounding*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2357)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | <li>User has access to {{BASE_URL}}/parts/inventory</li> |
| 2 | CANDIDATE GAP | PHRASING | `count cycle exist` | `count` | - | <li>Parts exist in inventory to test cycle count</li> |
| 3 | CANDIDATE GAP | PHRASING | `base inventory part` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/inventory page</li> |
| 4 | CANDIDATE GAP | PHRASING | `dots inventory menu` | `dots` | - | <li>Click on Inventory menu (3 dots)</li> |
| 5 | CANDIDATE GAP | PHRASING | `count cycle strong` | `count` | - | <li>Click on <strong>Cycle Count</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `count decimal enter` | `count` | - | <li><p>Enter decimal numbers in the Count field for multiple parts:</p> |
| 7 | CANDIDATE GAP | PHRASING | `decimal plac quantity` | `decimal` | - | <li><p>All quantities are rounded to 2 decimal places and saved successfully</p> |
| 8 | CANDIDATE GAP | PHRASING | `1.72 1.724 part` | `1.72` | - | <li>part_2 from 1.724 to 1.72</li> |
| 9 | CANDIDATE GAP | PHRASING | `1.725 1.73 part` | `1.725` | - | <li>part_3 from 1.725 to 1.73</li> |
| 10 | CANDIDATE GAP | PHRASING | `1.729 1.73 part` | `1.729` | - | <li>part_4 from 1.729 to 1.73</li> |
| 11 | CANDIDATE GAP | PHRASING | `0.005 0.01 part` | `0.005` | - | <li>part_6 from 0.005 to 0.01</li> |
| 12 | CANDIDATE GAP | PHRASING | `close count cycle` | `close` | - | <li>Close <strong>Cycle Count</strong> and verify Quatities on Inventory page for those parts</li> |
| 13 | CANDIDATE GAP | PHRASING | `inventory new part` | `inventory` | - | <li>New Quatities are visible on Inventory page for those parts</li> |

## C2444 - COVERED-BY

*Edit Inventory - Allow Decimal Quantity (e.g., 1.5)*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2444)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base inventory logged` | `base` | - | <p>User is logged in<br />User is navigated to {{BASE_URL}}/parts/inventory</p> |
| 2 | CANDIDATE GAP | PHRASING | `inventory part` | `inventory` | - | <li>Navigate to Parts > Inventory</li> |
| 3 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li>Select any inventory part and open the Edit Inventory part modal</li> |
| 4 | CANDIDATE GAP | PHRASING | `1.5 attempt change` | `1.5` | - | <li>Attempt to change the quantity value to 1.5</li> |
| 5 | CANDIDATE GAP | PHRASING | `1.5 quantity successfully` | `1.5` | - | <li>Quantity is updated to 1.5 successfully</li> |
| 6 | CANDIDATE GAP | PHRASING | `close inventory modal` | `close` | - | <li>Inventory modal closes properly and updated value is reflected</li> |

## C30637 - COVERED-BY

*Delete an inventory part*  
Section: Test Cases > Parts > Inventory  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/30637)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `catalog delete inventory` | `catalog` | - | Logged in as owner/admin with catalog/inventory delete permission. |
| 2 | CANDIDATE GAP | PHRASING | `deletable exist factory` | `deletable` | - | A deletable inventory part exists (seeded via the parts API factory). |
| 3 | CANDIDATE GAP | PHRASING | `inventory part` | `inventory` | - | Navigate to /parts/inventory |
| 4 | CANDIDATE GAP | PHRASING | `inventory list part` | `inventory` | - | The inventory table lists the seeded part. |
| 5 | CANDIDATE GAP | PHRASING | `dialog inventory part` | `dialog` | - | Click the part row to open the inventory part dialog |
| 6 | CANDIDATE GAP | PHRASING | `dialog edit inventory` | `dialog` | - | The inventory part dialog opens in edit mode. |
| 7 | CANDIDATE GAP | PHRASING | `close deleted dialog` | `close` | - | The part is deleted and the dialog closes. |
| 8 | CANDIDATE GAP | PHRASING | `inventory observe table` | `inventory` | - | Observe the inventory table |
| 9 | CANDIDATE GAP | PHRASING | `deleted listed longer` | `deleted` | - | The deleted part is no longer listed. |

## C109 - COVERED-BY

*Show cores only*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/109)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `cor set` | `cor` | - | <li>Click on Show cores only toggle and set it to ON state</li> |
| 3 | CANDIDATE GAP | PHRASING | `core list reason` | `core` | - | <li>Only returns with "Return reason" = "Core ok" are shown on list</li> |

## C110 - COVERED-BY

*Filter By Vendors*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/110)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `field filter vendor` | `field` | - | <li>Click on Filter by Vendor field</li> |
| 3 | CANDIDATE GAP | PHRASING | `clicking down drop` | `clicking` | - | <li>After clicking field, list with all vendors drops down</li> |
| 4 | CANDIDATE GAP | PHRASING | `list return selected` | `list` | - | <li>Only returns for selected vendor are shown on the list</li> |

## C111 - COVERED-BY

*Add parts to returns*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/111)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `box left rows` | `box` | - | <li>Using check boxes on the left side of the table check several rows</li> |
| 3 | CANDIDATE GAP | PHRASING | `checked rows selected` | `checked` | - | <li>Selected rows are checked</li> |
| 4 | CANDIDATE GAP | PHRASING | `checked filtered first` | `checked` | - | <li>After first row is checked, table is filtered by vendor</li> |
| 5 | CANDIDATE GAP | PHRASING | `add dots option` | `add` | - | <li>Click on 3 dots and select option Add parts to return</li> |
| 6 | CANDIDATE GAP | PHRASING | `dialog new part` | `dialog` | - | <li>New Parts Return dialog opens</li> |
| 7 | CANDIDATE GAP | PHRASING | `add button part` | `add` | - | <li>Add 2 parts and click Save button</li> |
| 8 | CANDIDATE GAP | PHRASING | `added checked part` | `added` | - | <li>Parts are added to checked returns</li> |

## C112 - COVERED-BY

*Delete record*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/112)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `action column delete` | `action` | - | <li>In the Action column click on trash can icon for the row you want to delete</li> |

## C113 - COVERED-BY

*Return to inventory*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/113)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `action column deleted` | `action` | - | <li>Records that are deleted from inventory have "return to inventory" option in Action column</li> |
| 3 | CANDIDATE GAP | PHRASING | `find inventory return` | `find` | - | <li>Find one of them and return it to inventory</li> |
| 4 | CANDIDATE GAP | PHRASING | `inventory item returned` | `inventory` | - | <li>Item is returned to inventory</li> |

## C1333 - COVERED-BY

*Verify Returns Tab Elements [TO DO]*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1333)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>User lands to {{BASE_URL}}/parts/returns page</li> |
| 3 | CANDIDATE GAP | PHRASING | `return selected tab` | `return` | - | <li>'Returns' tab is selected by default</li> |

## C1334 - COVERED-BY

*Verify Hyperlinks on Returns Tab*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1334)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>User lands to {{BASE_URL}}/parts/returns page</li> |
| 3 | CANDIDATE GAP | PHRASING | `return selected tab` | `return` | - | <li>'Returns' tab is selected by default</li> |
| 4 | CANDIDATE GAP | PHRASING | `column hyperlink order` | `column` | - | <li>Click on any hyperlink under column 'Work Order'</li> |
| 5 | CANDIDATE GAP | PHRASING | `base part request` | `base` | - | <li><p>User lands to that specific wo's Parts Returns tab<br />{{BASE_URL}}/workorder/{{WO_ID}}/part-return-requests</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `column hyperlink invoice` | `column` | - | <li>Return to the previous page and click on any hyperlink under 'Vendor Invoice' column</li> |
| 7 | CANDIDATE GAP | PHRASING | `base delivery invoice` | `base` | - | <li><p>User lands to that specific invoice <br />{{BASE_URL}}/delivery/{{INVOICE_ID}}</p></li> |

## C1337 - COVERED-BY

*Verify Table Columns on  Process Return [TO DO]*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1337)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `column process return` | `column` | - | Verify Table Columns on Process Return [TO DO] |

## C1344 - COVERED-BY

*Return special part*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1344)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `amongst ordered part` | `amongst` | - | <li>Amongst ordered parts there is at least 1 special part</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 3 | CANDIDATE GAP | PHRASING | `box left part` | `box` | - | <li>Using check boxes on the left side of the table check special part</li> |
| 4 | CANDIDATE GAP | PHRASING | `checked rows selected` | `checked` | - | <li>Selected rows is checked</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory return` | `button` | - | <li>Click on button Return to Inventory</li> |
| 6 | CANDIDATE GAP | PHRASING | `dialog inventory part` | `dialog` | - | <li>Return special part to inventory dialog opens</li> |
| 7 | CANDIDATE GAP | PHRASING | `button inventory qty` | `button` | - | <li>Select qty and click on Return to inventory button</li> |
| 8 | CANDIDATE GAP | PHRASING | `added checked part` | `added` | - | <li>Parts are added to checked returns</li> |
| 9 | CANDIDATE GAP | PHRASING | `inventory part` | `inventory` | - | <li><p>Navigate to parts/inventory</p></li> |
| 10 | CANDIDATE GAP | PHRASING | `created inventory part` | `created` | - | <li><p>Verify if inventory part was created</p></li> |
| 11 | CANDIDATE GAP | PHRASING | `match picked qty` | `match` | - | <li><p>Qty matches the one that was picked on step 3</p></li> |

## C1345 - COVERED-BY

*Return special core part*  
Section: Test Cases > Parts > Returns  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1345)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `amongst core ordered` | `amongst` | - | <li>Amongst ordered parts there is at least 1 special part with core</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 3 | CANDIDATE GAP | PHRASING | `box core left` | `box` | - | <li>Using check boxes on the left side of the table check special part with core</li> |
| 4 | CANDIDATE GAP | PHRASING | `checked rows selected` | `checked` | - | <li>Selected rows is checked</li> |
| 5 | CANDIDATE GAP | PHRASING | `button inventory return` | `button` | - | <li>Click on button Return to Inventory</li> |
| 6 | CANDIDATE GAP | PHRASING | `dialog inventory part` | `dialog` | - | <li>Return special part to inventory dialog opens</li> |
| 7 | CANDIDATE GAP | PHRASING | `button inventory qty` | `button` | - | <li>Select qty and click on Return to inventory button</li> |
| 8 | CANDIDATE GAP | PHRASING | `added checked part` | `added` | - | <li>Parts are added to checked returns</li> |
| 9 | CANDIDATE GAP | PHRASING | `inventory part` | `inventory` | - | <li><p>Navigate to parts/inventory</p></li> |
| 10 | CANDIDATE GAP | PHRASING | `created inventory part` | `created` | - | <li><p>Verify if inventory part was created</p></li> |
| 11 | CANDIDATE GAP | PHRASING | `match picked qty` | `match` | - | <li><p>Qty matches the one that was picked on step 3</p></li> |

## C114 - COVERED-BY

*Receive Full Credit - Post credit*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/114)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button credit receive` | `button` | - | <li>Check some row and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `accepted credit date` | `accepted` | - | <li><p>Set fields:<br />Packaging slip<br />Credit Memo Number<br />Credit Date<br />Accepted Quantity<br />Restocking fee<br />Tax<br />Note</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `button credit post` | `button` | - | <li><p>Click on Post Credit button</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `credit possible receive` | `credit` | - | <li>It's not possible to receive credit for same return again</li> |
| 7 | CANDIDATE GAP | PHRASING | `list longer part` | `list` | - | <li>Returned part is no longer on the list</li> |

## C115 - COVERED-BY

*Process Return - Add Packing Slip*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/115)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button credit receive` | `button` | - | <li>Check some row and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `add another button` | `add` | - | <li>Click on Add another slip button</li> |
| 5 | CANDIDATE GAP | PHRASING | `back redirected return` | `back` | - | <li>User is redirected back to returns page</li> |
| 6 | CANDIDATE GAP | PHRASING | `filtered selected vendor` | `filtered` | - | <li>Selected vendor is filtered</li> |

## C142 - COVERED-BY

*Filter by Days*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/142)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `credit left menu` | `credit` | - | <li>Click on <strong>Credits</strong> tab on upper left menu</li> |
| 3 | CANDIDATE GAP | PHRASING | `days filter strong` | `days` | - | <li>Click on <strong>Filter by days</strong></li> |
| 4 | CANDIDATE GAP | PHRASING | `available days dropdown` | `available` | - | <li><p>Dropdown list appears with available options:<br />30 days<br />60 days<br />90 days<br />6 months<br />1 year<br />All</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `credit days old` | `credit` | - | <li>Only credits up to 60 days old are shown</li> |
| 6 | CANDIDATE GAP | PHRASING | `credit days old` | `credit` | - | <li>Only credits up to 90 days old are shown</li> |
| 7 | CANDIDATE GAP | PHRASING | `credit month old` | `credit` | - | <li>Only credits up to 6 months old are shown</li> |
| 8 | CANDIDATE GAP | PHRASING | `credit old year` | `credit` | - | <li>Only credits up to 1 year old are shown</li> |

## C331 - COVERED-BY

*Receive Partial Credit*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/331)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `digit e.g line` | `digit` | - | <li>WO has a line with a vendor part with a two-digit quantity (e.g., 12)</li> |
| 2 | CANDIDATE GAP | PHRASING | `e.g part picked` | `e.g` | - | <li>Parts are picked up and some are returned (e.g., 5)</li> |
| 3 | CANDIDATE GAP | PHRASING | `action add cancel` | `action` | - | <strong>Add more steps and create more cases regarding this issue including PARTIAL CREDIT in combination with parts with core, partial receive, partial return, full return, checking part tab and return tab (with cancel  |
| 4 | CANDIDATE GAP | PHRASING | `line part quantity` | `line` | - | <li>Verify part quantity on the line</li> |
| 5 | CANDIDATE GAP | PHRASING | `$orderedqty quantity strong` | `$orderedqty` | - | <li>Quantity is <strong>$orderedQty |
| 6 | CANDIDATE GAP | PHRASING | `back canceled invoiced` | `back` | - | <p><strong>Note:</strong> The remaining quantity (in this case 7) should stay the same until the WO is invoiced/paid unless the return is canceled and parts are moved back to the line</p> |
| 7 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns page</li> |
| 8 | CANDIDATE GAP | PHRASING | `part returned row` | `part` | - | <li>Check the row with parts we just returned</li> |
| 9 | CANDIDATE GAP | PHRASING | `credit receive strong` | `credit` | - | <li>Click on <strong>Receive Credit</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `list part returned` | `list` | - | <li>List of all returned parts is displayed</li> |
| 11 | CANDIDATE GAP | PHRASING | `filtered list part` | `filtered` | - | <li>List is filtered to show only parts from vendor for which part we selected</li> |
| 12 | CANDIDATE GAP | PHRASING | `process return strong` | `process` | - | <li><strong>Process Return</strong> page is displayed</li> |
| 13 | CANDIDATE GAP | PHRASING | `accepted e.g enter` | `accepted` | - | <li>Enter <strong>Accepted Quantity</strong> (e.g., <strong>3</strong>)</li> |
| 14 | CANDIDATE GAP | PHRASING | `credit field fill` | `credit` | - | <li>Fill in mandatory fields and click on <strong>Post Credit</strong></li> |
| 15 | CANDIDATE GAP | PHRASING | `change creation strong` | `change` | - | <strong>Creation/change was successful</strong></li> |
| 16 | CANDIDATE GAP | PHRASING | `back base navigated` | `back` | - | <li>User is navigated back to the {{BASE_URL}}/parts/returns page</li> |
| 17 | CANDIDATE GAP | PHRASING | `list part returned` | `list` | - | <li>List of all returned parts is shown</li> |
| 18 | CANDIDATE GAP | PHRASING | `$returnedqty accepted list` | `$returnedqty` | - | <li>Verify if the remaining parts on the list, parts that were not accepted, <strong>$returnedQty |
| 19 | CANDIDATE GAP | PHRASING | `awaiting credit part` | `awaiting` | - | <li>Remaining parts are displayed, still awaiting the credit from the vendor, in this case <strong>2</strong></li> |
| 20 | CANDIDATE GAP | PHRASING | `credit strong tab` | `credit` | - | <li>Click on tab <strong>Credits</strong></li> |
| 21 | CANDIDATE GAP | PHRASING | `$acceptedqty credit processed` | `$acceptedqty` | - | <li>The credit is processed, the row with <strong>$acceptedQty</strong> is shown, in this case <strong>3</strong></li> |
| 22 | CANDIDATE GAP | PHRASING | `invoic strong tab` | `invoic` | - | <li>Click on <strong>Unpaid Invoices</strong> tab</li> |
| 23 | CANDIDATE GAP | PHRASING | `amount credit invoic` | `amount` | - | <li>The credit amount is visible under <strong>Unpaid Invoices</strong> tab</li> |
| 24 | CANDIDATE GAP | PHRASING | `accepted amount balance` | `accepted` | - | <li>The vendor balance is reduced by the total amount of the accepted credit</li> |
| 25 | CANDIDATE GAP | PHRASING | `line part quantity` | `line` | - | <li>Navigate to the WO and verify part quantity on the line</li> |
| 26 | CANDIDATE GAP | PHRASING | `part quantity strong` | `part` | - | <li>Part quantity is the same as before (in this case <strong>7</strong>, same as on step 1)</li> |

## C1332 - COVERED-BY

*Verify Credit Tab Elements*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1332)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>User lands to {{BASE_URL}}/parts/returns page</li> |
| 3 | CANDIDATE GAP | PHRASING | `return selected strong` | `return` | - | <li><strong>Returns</strong> tab is selected by default</li> |
| 4 | CANDIDATE GAP | PHRASING | `column credit strong` | `column` | - | <li>Click on <strong>Credits</strong> tab and verify table columns</li> |
| 5 | CANDIDATE GAP | PHRASING | `credit tab visible` | `credit` | - | <li>Credit tab is visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `column credit following` | `column` | - | <li><p>The credit table with following columns is visible:</p> |
| 7 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li><strong>Credit Memo Number</strong></li> |
| 8 | CANDIDATE GAP | PHRASING | `order strong work` | `order` | - | <li><strong>Work Order</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `invoice strong vendor` | `invoice` | - | <li><strong>Vendor Invoice</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `cost strong total` | `cost` | - | <li><strong>Total Cost</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `corner days dropdown` | `corner` | - | <li><p>In top right corner dropdown <strong>Filter By Days</strong> is visible with following options:</p> |
| 12 | CANDIDATE GAP | PHRASING | `days dropdown filter` | `days` | - | <li><strong>Filter By Days</strong> dropdown label name is fully displayed</li> |

## C1335 - COVERED-BY

*Verify Hyperlinks on Credit Tab*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1335)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `credit hyperlink removed` | `credit` | - | <strong>Hyperlinks are removed from the table rows on 'Credits' tab</strong></p> |

## C1336 - COVERED-BY

*Verify Table Columns on Returned items [TO DO]*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1336)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `column item returned` | `column` | - | Verify Table Columns on Returned items [TO DO] |

## C1709 - COVERED-BY

*Verify Hyperlinks on Returned items page [TO DO]*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1709)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `hyperlink item returned` | `hyperlink` | - | Verify Hyperlinks on Returned items page [TO DO] |

## C1737 - COVERED-BY

*Receive Credit for part with core*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1737)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button contain core` | `button` | - | <li>Check row that contains returned part with core and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `fee restocking set` | `fee` | - | <li><p>Set Restocking fee</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `button credit post` | `button` | - | <li><p>Click on Post Credit button</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `core fee part` | `core` | - | <li>Restocking fee can only be set for part, not the core</li> |
| 7 | CANDIDATE GAP | PHRASING | `credit possible receive` | `credit` | - | <li>It's not possible to receive credit for same return again</li> |
| 8 | CANDIDATE GAP | PHRASING | `list longer part` | `list` | - | <li>Returned part is no longer on the list</li> |

## C1893 - COVERED-BY

*Change Vendor During Process Return*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1893)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button contain credit` | `button` | - | <li>Check the row that contains the returned part and click on <strong>Receive Credit</strong> button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to <strong>Process Return</strong> page</li> |
| 4 | CANDIDATE GAP | PHRASING | `desired dropdown strong` | `desired` | - | <li>On the <strong>Vendor</strong> dropdown select desired vendor</li> |
| 5 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li>Set <strong>Credit Memo Number</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `credit post strong` | `credit` | - | <li>Click <strong>Post Credit</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `new set strong` | `new` | - | <li>New <strong>Vendor</strong> is set</li> |
| 8 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li><strong>Credit Memo Number</strong> is set</li> |
| 9 | CANDIDATE GAP | PHRASING | `change creation message` | `change` | - | <li><strong>Creation/change was successful</strong> message appears on the screen</li> |
| 10 | CANDIDATE GAP | PHRASING | `base navigated part` | `base` | - | <li>User is navigated to the{{BASE_URL}}/parts/returns page</li> |
| 11 | CANDIDATE GAP | PHRASING | `credit strong tab` | `credit` | - | <li>Click on <strong>Credits</strong> tab</li> |
| 12 | CANDIDATE GAP | PHRASING | `credit list memo` | `credit` | - | <li>Credit with previously selected <strong>Vendor</strong> and <strong>Credit Memo Number</strong> is visible on the list</li> |

## C26740 - COVERED-BY

*Credits tab — date-range preset loads credits (credit_date lower-bound filter)*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/26740)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged part` | `logged` | - | Logged in as a user with Parts access. |
| 2 | CANDIDATE GAP | PHRASING | `credit part return` | `credit` | - | On Parts → Returns → Credits tab. |
| 3 | CANDIDATE GAP | PHRASING | `credit day part` | `credit` | - | Open Parts → Returns and switch to the Credits tab (default 30-day preset). |
| 4 | CANDIDATE GAP | PHRASING | `200 called get` | `200` | - | GET /api/inventory/returns is called and returns 200. |
| 5 | CANDIDATE GAP | PHRASING | `credit date filter` | `credit` | - | The request carries a single credit_date filter with operator=gt. |
| 6 | CANDIDATE GAP | PHRASING | `credit error render` | `credit` | - | The credits table renders and no error toast appears. |

## C26741 - COVERED-BY

*Credits tab — custom date range builds gte+lte filters (no 400)*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/26741)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged part` | `logged` | - | Logged in as a user with Parts access. |
| 2 | CANDIDATE GAP | PHRASING | `credit part return` | `credit` | - | On Parts → Returns → Credits tab. |
| 3 | CANDIDATE GAP | PHRASING | `custom date e.g` | `custom` | - | Open the date-range selector and pick a custom from–to range (e.g. |
| 4 | CANDIDATE GAP | PHRASING | `1st apply current` | `1st` | - | the 1st of the current month to today), then Apply. |
| 5 | CANDIDATE GAP | PHRASING | `chosen commit custom` | `chosen` | - | The selector commits the chosen custom range (trigger shows the from–to dates). |
| 6 | CANDIDATE GAP | PHRASING | `apply credit fired` | `apply` | - | Observe the return-credits request fired on Apply. |
| 7 | CANDIDATE GAP | PHRASING | `200 400 called` | `200` | - | GET /api/inventory/returns is called with two credit_date filters — operator=gte value '<from> 00:00:00' and operator=lte value '<to> 23:59:59' — and returns 200 (not 400). |
| 8 | CANDIDATE GAP | PHRASING | `credit data failed` | `credit` | - | No 'Invalid filter data' / 'Failed to load return credits' toast appears and the table is present. |

## C114 - COVERED-BY

*Receive Full Credit - Post credit*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/114)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button credit receive` | `button` | - | <li>Check some row and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `accepted credit date` | `accepted` | - | <li><p>Set fields:<br />Packaging slip<br />Credit Memo Number<br />Credit Date<br />Accepted Quantity<br />Restocking fee<br />Tax<br />Note</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `button credit post` | `button` | - | <li><p>Click on Post Credit button</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `credit possible receive` | `credit` | - | <li>It's not possible to receive credit for same return again</li> |
| 7 | CANDIDATE GAP | PHRASING | `list longer part` | `list` | - | <li>Returned part is no longer on the list</li> |

## C115 - COVERED-BY

*Process Return - Add Packing Slip*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/115)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button credit receive` | `button` | - | <li>Check some row and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `add another button` | `add` | - | <li>Click on Add another slip button</li> |
| 5 | CANDIDATE GAP | PHRASING | `back redirected return` | `back` | - | <li>User is redirected back to returns page</li> |
| 6 | CANDIDATE GAP | PHRASING | `filtered selected vendor` | `filtered` | - | <li>Selected vendor is filtered</li> |

## C142 - COVERED-BY

*Filter by Days*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/142)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `credit left menu` | `credit` | - | <li>Click on <strong>Credits</strong> tab on upper left menu</li> |
| 3 | CANDIDATE GAP | PHRASING | `days filter strong` | `days` | - | <li>Click on <strong>Filter by days</strong></li> |
| 4 | CANDIDATE GAP | PHRASING | `available days dropdown` | `available` | - | <li><p>Dropdown list appears with available options:<br />30 days<br />60 days<br />90 days<br />6 months<br />1 year<br />All</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `credit days old` | `credit` | - | <li>Only credits up to 60 days old are shown</li> |
| 6 | CANDIDATE GAP | PHRASING | `credit days old` | `credit` | - | <li>Only credits up to 90 days old are shown</li> |
| 7 | CANDIDATE GAP | PHRASING | `credit month old` | `credit` | - | <li>Only credits up to 6 months old are shown</li> |
| 8 | CANDIDATE GAP | PHRASING | `credit old year` | `credit` | - | <li>Only credits up to 1 year old are shown</li> |

## C331 - COVERED-BY

*Receive Partial Credit*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/331)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `digit e.g line` | `digit` | - | <li>WO has a line with a vendor part with a two-digit quantity (e.g., 12)</li> |
| 2 | CANDIDATE GAP | PHRASING | `e.g part picked` | `e.g` | - | <li>Parts are picked up and some are returned (e.g., 5)</li> |
| 3 | CANDIDATE GAP | PHRASING | `action add cancel` | `action` | - | <strong>Add more steps and create more cases regarding this issue including PARTIAL CREDIT in combination with parts with core, partial receive, partial return, full return, checking part tab and return tab (with cancel  |
| 4 | CANDIDATE GAP | PHRASING | `line part quantity` | `line` | - | <li>Verify part quantity on the line</li> |
| 5 | CANDIDATE GAP | PHRASING | `$orderedqty quantity strong` | `$orderedqty` | - | <li>Quantity is <strong>$orderedQty |
| 6 | CANDIDATE GAP | PHRASING | `back canceled invoiced` | `back` | - | <p><strong>Note:</strong> The remaining quantity (in this case 7) should stay the same until the WO is invoiced/paid unless the return is canceled and parts are moved back to the line</p> |
| 7 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns page</li> |
| 8 | CANDIDATE GAP | PHRASING | `part returned row` | `part` | - | <li>Check the row with parts we just returned</li> |
| 9 | CANDIDATE GAP | PHRASING | `credit receive strong` | `credit` | - | <li>Click on <strong>Receive Credit</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `list part returned` | `list` | - | <li>List of all returned parts is displayed</li> |
| 11 | CANDIDATE GAP | PHRASING | `filtered list part` | `filtered` | - | <li>List is filtered to show only parts from vendor for which part we selected</li> |
| 12 | CANDIDATE GAP | PHRASING | `process return strong` | `process` | - | <li><strong>Process Return</strong> page is displayed</li> |
| 13 | CANDIDATE GAP | PHRASING | `accepted e.g enter` | `accepted` | - | <li>Enter <strong>Accepted Quantity</strong> (e.g., <strong>3</strong>)</li> |
| 14 | CANDIDATE GAP | PHRASING | `credit field fill` | `credit` | - | <li>Fill in mandatory fields and click on <strong>Post Credit</strong></li> |
| 15 | CANDIDATE GAP | PHRASING | `change creation strong` | `change` | - | <strong>Creation/change was successful</strong></li> |
| 16 | CANDIDATE GAP | PHRASING | `back base navigated` | `back` | - | <li>User is navigated back to the {{BASE_URL}}/parts/returns page</li> |
| 17 | CANDIDATE GAP | PHRASING | `list part returned` | `list` | - | <li>List of all returned parts is shown</li> |
| 18 | CANDIDATE GAP | PHRASING | `$returnedqty accepted list` | `$returnedqty` | - | <li>Verify if the remaining parts on the list, parts that were not accepted, <strong>$returnedQty |
| 19 | CANDIDATE GAP | PHRASING | `awaiting credit part` | `awaiting` | - | <li>Remaining parts are displayed, still awaiting the credit from the vendor, in this case <strong>2</strong></li> |
| 20 | CANDIDATE GAP | PHRASING | `credit strong tab` | `credit` | - | <li>Click on tab <strong>Credits</strong></li> |
| 21 | CANDIDATE GAP | PHRASING | `$acceptedqty credit processed` | `$acceptedqty` | - | <li>The credit is processed, the row with <strong>$acceptedQty</strong> is shown, in this case <strong>3</strong></li> |
| 22 | CANDIDATE GAP | PHRASING | `invoic strong tab` | `invoic` | - | <li>Click on <strong>Unpaid Invoices</strong> tab</li> |
| 23 | CANDIDATE GAP | PHRASING | `amount credit invoic` | `amount` | - | <li>The credit amount is visible under <strong>Unpaid Invoices</strong> tab</li> |
| 24 | CANDIDATE GAP | PHRASING | `accepted amount balance` | `accepted` | - | <li>The vendor balance is reduced by the total amount of the accepted credit</li> |
| 25 | CANDIDATE GAP | PHRASING | `line part quantity` | `line` | - | <li>Navigate to the WO and verify part quantity on the line</li> |
| 26 | CANDIDATE GAP | PHRASING | `part quantity strong` | `part` | - | <li>Part quantity is the same as before (in this case <strong>7</strong>, same as on step 1)</li> |

## C1332 - COVERED-BY

*Verify Credit Tab Elements*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1332)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>Navigate to {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | <li>User lands to {{BASE_URL}}/parts/returns page</li> |
| 3 | CANDIDATE GAP | PHRASING | `return selected strong` | `return` | - | <li><strong>Returns</strong> tab is selected by default</li> |
| 4 | CANDIDATE GAP | PHRASING | `column credit strong` | `column` | - | <li>Click on <strong>Credits</strong> tab and verify table columns</li> |
| 5 | CANDIDATE GAP | PHRASING | `credit tab visible` | `credit` | - | <li>Credit tab is visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `column credit following` | `column` | - | <li><p>The credit table with following columns is visible:</p> |
| 7 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li><strong>Credit Memo Number</strong></li> |
| 8 | CANDIDATE GAP | PHRASING | `order strong work` | `order` | - | <li><strong>Work Order</strong></li> |
| 9 | CANDIDATE GAP | PHRASING | `invoice strong vendor` | `invoice` | - | <li><strong>Vendor Invoice</strong></li> |
| 10 | CANDIDATE GAP | PHRASING | `cost strong total` | `cost` | - | <li><strong>Total Cost</strong></li> |
| 11 | CANDIDATE GAP | PHRASING | `corner days dropdown` | `corner` | - | <li><p>In top right corner dropdown <strong>Filter By Days</strong> is visible with following options:</p> |
| 12 | CANDIDATE GAP | PHRASING | `days dropdown filter` | `days` | - | <li><strong>Filter By Days</strong> dropdown label name is fully displayed</li> |

## C1335 - COVERED-BY

*Verify Hyperlinks on Credit Tab*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1335)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `credit hyperlink removed` | `credit` | - | <strong>Hyperlinks are removed from the table rows on 'Credits' tab</strong></p> |

## C1336 - COVERED-BY

*Verify Table Columns on Returned items [TO DO]*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1336)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `column item returned` | `column` | - | Verify Table Columns on Returned items [TO DO] |

## C1709 - COVERED-BY

*Verify Hyperlinks on Returned items page [TO DO]*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1709)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `hyperlink item returned` | `hyperlink` | - | Verify Hyperlinks on Returned items page [TO DO] |

## C1737 - COVERED-BY

*Receive Credit for part with core*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1737)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button contain core` | `button` | - | <li>Check row that contains returned part with core and click on Receive Credit button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to Process Return page</li> |
| 4 | CANDIDATE GAP | PHRASING | `fee restocking set` | `fee` | - | <li><p>Set Restocking fee</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `button credit post` | `button` | - | <li><p>Click on Post Credit button</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `core fee part` | `core` | - | <li>Restocking fee can only be set for part, not the core</li> |
| 7 | CANDIDATE GAP | PHRASING | `credit possible receive` | `credit` | - | <li>It's not possible to receive credit for same return again</li> |
| 8 | CANDIDATE GAP | PHRASING | `list longer part` | `list` | - | <li>Returned part is no longer on the list</li> |

## C1893 - COVERED-BY

*Change Vendor During Process Return*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1893)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base part return` | `base` | - | {{BASE_URL}}/parts/returns</li> |
| 2 | CANDIDATE GAP | PHRASING | `button contain credit` | `button` | - | <li>Check the row that contains the returned part and click on <strong>Receive Credit</strong> button</li> |
| 3 | CANDIDATE GAP | PHRASING | `process redirected return` | `process` | - | <li>User is redirected to <strong>Process Return</strong> page</li> |
| 4 | CANDIDATE GAP | PHRASING | `desired dropdown strong` | `desired` | - | <li>On the <strong>Vendor</strong> dropdown select desired vendor</li> |
| 5 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li>Set <strong>Credit Memo Number</strong></li> |
| 6 | CANDIDATE GAP | PHRASING | `credit post strong` | `credit` | - | <li>Click <strong>Post Credit</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `new set strong` | `new` | - | <li>New <strong>Vendor</strong> is set</li> |
| 8 | CANDIDATE GAP | PHRASING | `credit memo number` | `credit` | - | <li><strong>Credit Memo Number</strong> is set</li> |
| 9 | CANDIDATE GAP | PHRASING | `change creation message` | `change` | - | <li><strong>Creation/change was successful</strong> message appears on the screen</li> |
| 10 | CANDIDATE GAP | PHRASING | `base navigated part` | `base` | - | <li>User is navigated to the{{BASE_URL}}/parts/returns page</li> |
| 11 | CANDIDATE GAP | PHRASING | `credit strong tab` | `credit` | - | <li>Click on <strong>Credits</strong> tab</li> |
| 12 | CANDIDATE GAP | PHRASING | `credit list memo` | `credit` | - | <li>Credit with previously selected <strong>Vendor</strong> and <strong>Credit Memo Number</strong> is visible on the list</li> |

## C26740 - COVERED-BY

*Credits tab — date-range preset loads credits (credit_date lower-bound filter)*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/26740)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged part` | `logged` | - | Logged in as a user with Parts access. |
| 2 | CANDIDATE GAP | PHRASING | `credit part return` | `credit` | - | On Parts → Returns → Credits tab. |
| 3 | CANDIDATE GAP | PHRASING | `credit day part` | `credit` | - | Open Parts → Returns and switch to the Credits tab (default 30-day preset). |
| 4 | CANDIDATE GAP | PHRASING | `200 called get` | `200` | - | GET /api/inventory/returns is called and returns 200. |
| 5 | CANDIDATE GAP | PHRASING | `credit date filter` | `credit` | - | The request carries a single credit_date filter with operator=gt. |
| 6 | CANDIDATE GAP | PHRASING | `credit error render` | `credit` | - | The credits table renders and no error toast appears. |

## C26741 - COVERED-BY

*Credits tab — custom date range builds gte+lte filters (no 400)*  
Section: Test Cases > Parts > Returns > Credits  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/26741)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged part` | `logged` | - | Logged in as a user with Parts access. |
| 2 | CANDIDATE GAP | PHRASING | `credit part return` | `credit` | - | On Parts → Returns → Credits tab. |
| 3 | CANDIDATE GAP | PHRASING | `custom date e.g` | `custom` | - | Open the date-range selector and pick a custom from–to range (e.g. |
| 4 | CANDIDATE GAP | PHRASING | `1st apply current` | `1st` | - | the 1st of the current month to today), then Apply. |
| 5 | CANDIDATE GAP | PHRASING | `chosen commit custom` | `chosen` | - | The selector commits the chosen custom range (trigger shows the from–to dates). |
| 6 | CANDIDATE GAP | PHRASING | `apply credit fired` | `apply` | - | Observe the return-credits request fired on Apply. |
| 7 | CANDIDATE GAP | PHRASING | `200 400 called` | `200` | - | GET /api/inventory/returns is called with two credit_date filters — operator=gte value '<from> 00:00:00' and operator=lte value '<to> 23:59:59' — and returns 200 (not 400). |
| 8 | CANDIDATE GAP | PHRASING | `credit data failed` | `credit` | - | No 'Invalid filter data' / 'Failed to load return credits' toast appears and the table is present. |

## C87 - COVERED-BY

*Filter by manufacturer*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/87)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `manufacturer pick single` | `manufacturer` | - | <li>Pick single manufacturer</li> |
| 3 | CANDIDATE GAP | PHRASING | `listed manufacturer part` | `listed` | - | <li>Only parts from selected manufacturer are listed</li> |

## C88 - COVERED-BY

*Filter by category*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/88)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `category field filter` | `category` | - | <li>Select Filter by Category field</li> |
| 3 | CANDIDATE GAP | PHRASING | `category listed non` | `category` | - | <li>All categories are listed (non is selected by default)</li> |
| 4 | CANDIDATE GAP | PHRASING | `button category pick` | `button` | - | <li>Pick a category and set toggle button to ON state</li> |
| 5 | CANDIDATE GAP | PHRASING | `category item list` | `category` | - | <li>List items with selected category are listed on the table</li> |

## C89 - COVERED-BY

*New catalog part - happy case*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/89)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `button catalog new` | `button` | - | <li>Click on New Catalog Part button</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog new part` | `catalog` | - | <li>New Catalog Part</li> |
| 4 | CANDIDATE GAP | PHRASING | `number part set` | `number` | - | <li>Set Part Number</li> |
| 5 | CANDIDATE GAP | PHRASING | `measurement pick unit` | `measurement` | - | <li>Pick Units Of Measurement</li> |
| 6 | CANDIDATE GAP | PHRASING | `added new part` | `added` | - | <li>New part added</li> |

## C90 - COVERED-BY

*New catalog part - FE validation*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/90)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `button catalog new` | `button` | - | <li>Click on New Catalog Part button </li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog dialog new` | `catalog` | - | <li>New Catalog Part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `description field mandatory` | `description` | - | <li>Verify that Description is mandatory fields</li> |
| 5 | CANDIDATE GAP | PHRASING | `error field filled` | `error` | - | <li>If field is not filled in there is FE error message: |
| 6 | CANDIDATE GAP | PHRASING | `description field required` | `description` | - | Description is a required field</li> |
| 7 | CANDIDATE GAP | PHRASING | `field mandatory number` | `field` | - | <li>Verify that Part number is mandatory fields</li> |
| 8 | CANDIDATE GAP | PHRASING | `error field filled` | `error` | - | <li>If field is not filled in there is FE error message: |
| 9 | CANDIDATE GAP | PHRASING | `field number part` | `field` | - | Part number is a required field</li> |
| 10 | CANDIDATE GAP | PHRASING | `category field mandatory` | `category` | - | <li>Verify that Category is mandatory fields</li> |
| 11 | CANDIDATE GAP | PHRASING | `2877 error field` | `2877` | - | <li><p><strong>Since v0.13 this is no longer a mandatory field [SV-2877]</strong><br />// If field is not filled in there is FE error message: |
| 12 | CANDIDATE GAP | PHRASING | `category field required` | `category` | - | Category is a required field</p></li> |

## C91 - COVERED-BY

*New catalog part - close dialog*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/91)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `button catalog new` | `button` | - | <li>Click on New Catalog Part button</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog dialog new` | `catalog` | - | <li>New Catalog Part dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `button clicking close` | `button` | - | <li>Close dialog by clicking "x" button</li> |

## C92 - COVERED-BY

*Set category on multiple parts at once*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/92)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `dots left side` | `dots` | - | <li>Click on 3 dots on the top left side of the table</li> |
| 3 | CANDIDATE GAP | PHRASING | `category option set` | `category` | - | <li>Set category option is displayed</li> |
| 4 | CANDIDATE GAP | PHRASING | `assigned category checked` | `assigned` | - | <li>Selected category is assigned to all checked rows </li> |

## C1928 - COVERED-BY

*Verify Case Insensitivity When Using the Same Part Name in Uppercase and Lowercase Letters (WO then PO)*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1928)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged strong` | `logged` | - | <li>User is logged in as <strong>Admin</strong></li> |
| 2 | CANDIDATE GAP | PHRASING | `create order part` | `create` | - | <li><p>Create <strong>WO</strong> and order and receive part with:</p> |
| 3 | CANDIDATE GAP | PHRASING | `create order part` | `create` | - | <li><p>Create <strong>PO</strong> and order and receive part with:</p> |
| 4 | CANDIDATE GAP | PHRASING | `catalog history part` | `catalog` | - | <li>Navigate to catalog and verify that part history</li> |
| 5 | CANDIDATE GAP | PHRASING | `catalog part visible` | `catalog` | - | <li><p>Part is visible in catalog as:</p> |
| 6 | CANDIDATE GAP | PHRASING | `history made order` | `history` | - | <li>Order that was made via <strong>PO</strong> is visible in the history as well under same part</li> |

## C1929 - COVERED-BY

*Verify Case Insensitivity When Using the Same Part Name in Uppercase and Lowercase Letters (PO then WO)*  
Section: Test Cases > Parts > Catalog  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1929)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `logged strong` | `logged` | - | <li>User is logged in as <strong>Admin</strong></li> |
| 2 | CANDIDATE GAP | PHRASING | `create order part` | `create` | - | <li><p>Create <strong>PO</strong> and order and receive part with:</p> |
| 3 | CANDIDATE GAP | PHRASING | `create order part` | `create` | - | <li><p>Create <strong>WO</strong> and order and receive part with:</p> |
| 4 | CANDIDATE GAP | PHRASING | `catalog history part` | `catalog` | - | <li>Navigate to catalog and verify that part history</li> |
| 5 | CANDIDATE GAP | PHRASING | `catalog part visible` | `catalog` | - | <li><p>Part is visible in catalog as:</p> |
| 6 | CANDIDATE GAP | PHRASING | `history made order` | `history` | - | <li>Order that was made via <strong>WO</strong> is visible in the history as well under same part</li> |

## C93 - COVERED-BY

*Part details - verify elements*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/93)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog part single` | `catalog` | - | <li>Select single catalog part from table</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog opened part` | `catalog` | - | <li>Selected catalog part opened</li> |
| 4 | CANDIDATE GAP | PHRASING | `detail part section` | `detail` | - | <li>Verify Part details section</li> |
| 5 | CANDIDATE GAP | PHRASING | `detail label part` | `detail` | - | <li>Part details label</li> |
| 6 | CANDIDATE GAP | PHRASING | `catalog edit part` | `catalog` | - | <li>Edit Catalog part</li> |
| 7 | CANDIDATE GAP | PHRASING | `label number part` | `label` | - | <li>Part Number label</li> |
| 8 | CANDIDATE GAP | PHRASING | `label part total` | `label` | - | <li>Total Parts label</li> |

## C94 - COVERED-BY

*Edit catalog part and save*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/94)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog opened part` | `catalog` | - | <li>Part Catalog opened</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog dialog edit` | `catalog` | - | <p>On the Edit Catalog Part dialog edit:</p> |
| 4 | CANDIDATE GAP | PHRASING | `catalog edited part` | `catalog` | - | <li>Values are edited in part catalog</li> |

## C95 - COVERED-BY

*Edit catalog part and delete*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/95)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog opened part` | `catalog` | - | <li>Catalog Part opened</li> |
| 3 | CANDIDATE GAP | PHRASING | `button catalog edit` | `button` | - | <li>Click on Edit Catalog Part button</li> |
| 4 | CANDIDATE GAP | PHRASING | `catalog dialog edit` | `catalog` | - | <li>Edit Catalog Part dialog opens</li> |
| 5 | CANDIDATE GAP | PHRASING | `catalog dialog edit` | `catalog` | - | <p>On the Edit Catalog Part dialog:</p> |
| 6 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p>Confirm deletion modal pops up with options<br />Delete<br />Cancel</p></li> |
| 7 | CANDIDATE GAP | PHRASING | `button catalog delete` | `button` | - | <li>On the Edit Catalog Part dialog click Delete button again</li> |
| 8 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p>Confirm deletion modal pops up with options<br />Delete<br />Cancel</p></li> |
| 9 | CANDIDATE GAP | PHRASING | `deleted inventory part` | `deleted` | - | <li>Inventory part deleted</li> |

## C96 - COVERED-BY

*Edit catalog part - close dialog*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/96)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog opened part` | `catalog` | - | <li>Catalog Part opened</li> |
| 3 | CANDIDATE GAP | PHRASING | `button catalog edit` | `button` | - | <li>Click on Edit Catalog Part button</li> |
| 4 | CANDIDATE GAP | PHRASING | `catalog dialog edit` | `catalog` | - | <li>Edit Catalog Part dialog opens</li> |
| 5 | CANDIDATE GAP | PHRASING | `button clicking close` | `button` | - | <li>Close dialog by clicking on "x" button</li> |

## C97 - COVERED-BY

*Edit Inventory Part Through Catalog Part History - Save*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/97)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `exist history inventory` | `exist` | - | <li>Part exists in inventory (has some purchase/order history)</li> |
| 2 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog list part` | `catalog` | - | <li>Select part from the catalog list and click on it</li> |
| 4 | CANDIDATE GAP | PHRASING | `catalog history part` | `catalog` | - | <li>Catalog <strong>Parts</strong> history opens </li> |
| 5 | CANDIDATE GAP | PHRASING | `collapsible location row` | `collapsible` | - | <li>Click on any location/workplace summary (collapsible) row</li> |
| 6 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 7 | CANDIDATE GAP | PHRASING | `edit field following` | `edit` | - | <li><p>On the <strong>Edit Inventory Part</strong> modal edit the following fields:</p> |
| 8 | CANDIDATE GAP | PHRASING | `cannot category edited` | `cannot` | - | <li>Category (cannot be edited)</li> |
| 9 | CANDIDATE GAP | PHRASING | `cannot edited manufacturer` | `cannot` | - | <li>Manufacturer (cannot be edited)</li> |
| 10 | CANDIDATE GAP | PHRASING | `average cannot cost` | `average` | - | <li>Average Cost (cannot be edited)</li> |
| 11 | CANDIDATE GAP | PHRASING | `cannot charge core` | `cannot` | - | <li>Core Charge (cannot be edited)</li> |
| 12 | CANDIDATE GAP | PHRASING | `change creation strong` | `change` | - | <strong>Creation/change was successful</strong></li> |
| 13 | CANDIDATE GAP | PHRASING | `base chang inventory` | `base` | - | <li>Changes are visible for the part under {{BASE_URL}}/parts/inventory page</li> |

## C98 - COVERED-BY

*Edit Inventory Part Through Catalog Part History  - Delete*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/98)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog list part` | `catalog` | - | <li>Select part from the catalog list and click on it</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog history opened` | `catalog` | - | <li>Catalog <strong>Parts</strong> history opened</li> |
| 4 | CANDIDATE GAP | PHRASING | `collapsible location row` | `collapsible` | - | <li>Click on any location/workplace summary (collapsible) row</li> |
| 5 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 6 | CANDIDATE GAP | PHRASING | `delete edit inventory` | `delete` | - | <li>On <strong>Edit Inventory Part</strong> modal click <strong>Delete</strong></li> |
| 7 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p><strong>Confirm deletion</strong> modal pops up with options:<br />Delete<br />Cancel</p></li> |
| 8 | CANDIDATE GAP | PHRASING | `collapsible location row` | `collapsible` | - | <li>Click again on location/workplace summary (collapsible) row</li> |
| 9 | CANDIDATE GAP | PHRASING | `button delete edit` | `button` | - | <li>On the <strong>Edit Inventory Part</strong> modal click <strong>Delete</strong> button again</li> |
| 10 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 11 | CANDIDATE GAP | PHRASING | `cancel delete deletion` | `cancel` | - | <li><p><strong>Confirm deletion</strong> modal pops up with options<br />Delete<br />Cancel</p></li> |
| 12 | CANDIDATE GAP | PHRASING | `deleted inventory part` | `deleted` | - | <li>Inventory part deleted</li> |
| 13 | CANDIDATE GAP | PHRASING | `active doesn exist` | `active` | - | this is only possible if inventory part doesn't exist in any active work orders</p> |

## C99 - COVERED-BY

*Edit Inventory Part Through Catalog Part History  - Close Modal*  
Section: Test Cases > Parts > Catalog > Single part  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/99)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base catalogue` | `app` | - | <li>App is navigated to {{BASE_URL}}/parts/part-catalogue</li> |
| 2 | CANDIDATE GAP | PHRASING | `catalog list part` | `catalog` | - | <li>Select part from the catalog list and click on it</li> |
| 3 | CANDIDATE GAP | PHRASING | `catalog history opened` | `catalog` | - | <li>Catalog <strong>Parts</strong> history opened</li> |
| 4 | CANDIDATE GAP | PHRASING | `collapsible location row` | `collapsible` | - | <li>Click on any location/workplace summary (collapsible) row</li> |
| 5 | CANDIDATE GAP | PHRASING | `edit inventory modal` | `edit` | - | <li><strong>Edit Inventory Part</strong> modal opens</li> |
| 6 | CANDIDATE GAP | PHRASING | `close modal strong` | `close` | - | <li>Click <strong>x</strong> to close modal</li> |

## C2272 - COVERED-BY

*Download and open the Invoice Template*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2272)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `following link` | `following` | - | <p>Navigate to the following link/s.</p> |
| 2 | CANDIDATE GAP | PHRASING | `administration base import` | `administration` | - | {{BASE URL}}/administration/invoice-import</p> |
| 3 | CANDIDATE GAP | PHRASING | `file filled pre` | `file` | - | <p>Pre-filled sample file: |
| 4 | CANDIDATE GAP | PHRASING | `change dat invoice` | `change` | - | (Make invoice number and dates are unique and change the location name |
| 5 | CANDIDATE GAP | PHRASING | `data import location` | `data` | - | DO NOT repeat any data or value upon new imports in the same location):</p> |
| 6 | CANDIDATE GAP | PHRASING | `file right side` | `file` | - | <li>Click "Download Template" from the top right side to download the template file.</li> |
| 7 | CANDIDATE GAP | PHRASING | `computer location` | `computer` | - | <li>Navigate to your "Download" location on your computer.</li> |
| 8 | CANDIDATE GAP | PHRASING | `computer file location` | `computer` | - | <li>The Template file should be download to your default downloads location on your computer.</li> |
| 9 | CANDIDATE GAP | PHRASING | `able clicking csv` | `able` | - | <li>You should be able to open the downloaded Excel/CSV file by clicking it.</li> |

## C2273 - COVERED-BY

*Fill the Template as per the accepted format.*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2273)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `csv editor excel` | `csv` | - | <p>The template file should be open in your excel/CSV editor.</p> |
| 2 | CANDIDATE GAP | PHRASING | `accepted csv downloaded` | `accepted` | - | <p>Fill the downloaded CSV file as per the accepted format given in the file.</p> |
| 3 | CANDIDATE GAP | PHRASING | `back below field` | `back` | - | <p>Do NOT skip the below mentioned fields which are must and required before you upload the file back to Shopview:</p> |
| 4 | CANDIDATE GAP | PHRASING | `data file save` | `data` | - | <p>Click Save to save the data in the file.</p> |
| 5 | CANDIDATE GAP | PHRASING | `file prefilled sample` | `file` | - | <p>Sample of a prefilled file: |
| 6 | CANDIDATE GAP | PHRASING | `change dat href` | `change` | - | (Make invoice number and dates unique and change the location name)<br /><a href="https://docs.google.com/spreadsheets/d/1deCJfKDonZkhjB4xA5O9X0l8cWsJM13j/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true">h |
| 7 | CANDIDATE GAP | PHRASING | `added data file` | `added` | - | <li>The data should be successfully added and saved to the file.</li> |

## C2274 - COVERED-BY

*Import the File to Shop View*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2274)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `following link` | `following` | - | <p>Navigate to the following link/s.</p> |
| 2 | CANDIDATE GAP | PHRASING | `administration base import` | `administration` | - | {{BASE URL}}/administration/invoice-import</p> |
| 3 | CANDIDATE GAP | PHRASING | `computer file location` | `computer` | - | <li>Select the file from your saved location on your computer and click open</li> |
| 4 | CANDIDATE GAP | PHRASING | `button import invoic` | `button` | - | <li>Click "Import Invoices" button from the top right side.</li> |
| 5 | CANDIDATE GAP | PHRASING | `computer file modal` | `computer` | - | <li>The modal to select the file from your computer should open.</li> |
| 6 | CANDIDATE GAP | PHRASING | `able file find` | `able` | - | <li>You should be able to find and select the file.</li> |
| 7 | CANDIDATE GAP | PHRASING | `account button clicking` | `account` | - | <li>Clicking the "Open" button should select the file and made it ready to be imported to your shop view account.</li> |
| 8 | CANDIDATE GAP | PHRASING | `account clicking import` | `account` | - | <li>Clicking "Import Invoices" should import the invoices to your shop view account.</li> |
| 9 | CANDIDATE GAP | PHRASING | `file import message` | `file` | - | <li>File import successful message should appear.</li> |

## C2265 - COVERED-BY

*Imported WO should show only Finance tab*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2265)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base import` | `administration` | - | {{BASE URL}}/administration/invoices-import</p> |
| 2 | CANDIDATE GAP | PHRASING | `clickable exist finance` | `clickable` | - | <p>Only finance tab should exist (or only finance tab should be clickable the rest would be greyed out/not clickable)</p> |

## C2266 - COVERED-BY

*All fields inside imported WO are read-only*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2266)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base import` | `administration` | - | <p>You are in this section {{BASE URL}}/administration/invoices-import</p> |
| 2 | CANDIDATE GAP | PHRASING | `clicking imported list` | `clicking` | - | <li>Open imported WO by clicking it from the list.</li> |
| 3 | CANDIDATE GAP | PHRASING | `input interact modal` | `input` | - | <li>Try to interact with any input or open modal</li> |
| 4 | CANDIDATE GAP | PHRASING | `anything create modal` | `anything` | - | There should be no way to open any modal to update/create anything</p> |

## C2267 - COVERED-BY

*Imported WOs appear in WO list with special marker*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2267)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base order url` | `base` | - | <li>Visit {{BASE URL}}/work-orders</li> |
| 2 | CANDIDATE GAP | PHRASING | `imported locate statu` | `imported` | - | <li>Locate a WO with status = imported</li> |
| 3 | CANDIDATE GAP | PHRASING | `asterisk badge best` | `asterisk` | - | <p>Imported WOs should have some mark (asterisk or badge, let’s see what looks the best |
| 4 | CANDIDATE GAP | PHRASING | `color different maybe` | `color` | - | maybe just different color of the WO number or whole row?)</p> |

## C2268 - COVERED-BY

*Filter: Imported only*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2268)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base import` | `administration` | - | <li>Open {{BASE URL}}/administration/invoices-import</li> |
| 2 | CANDIDATE GAP | PHRASING | `automatically deselect filter` | `automatically` | - | <p>If Imported is selected, automatically deselect the other filters so that imported can be the only one selected</p> |

## C2269 - COVERED-BY

*Imported WO appears under Customer > WO tab*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2269)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `base customer linked` | `base` | - | {{BASE URL}}/customers<br />AND<br />WO is linked to a customer.</p> |
| 2 | CANDIDATE GAP | PHRASING | `customer list row` | `customer` | - | <li>Click any customers row from the list.</li> |
| 3 | CANDIDATE GAP | PHRASING | `order tab work` | `order` | - | <li>Click the "Work Orders" tab.</li> |
| 4 | CANDIDATE GAP | PHRASING | `customer imported listed` | `customer` | - | <li>Imported WOs should be listed on Customer page (wo tab)</li> |
| 5 | CANDIDATE GAP | PHRASING | `decided distinct imported` | `decided` | - | <li>The imported WOs will be distinct (Yet to be decided how)</li> |

## C2270 - COVERED-BY

*Imported WO appears under Customer > Vehicle > WO tab (if linked)*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2270)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `automatically order selected` | `automatically` | - | <li>Work Order tab should be automatically selected for that vehicle.</li> |
| 2 | CANDIDATE GAP | PHRASING | `listed order vehicle` | `listed` | - | <li>All work-orders for that Vehicle should be listed.</li> |
| 3 | CANDIDATE GAP | PHRASING | `distinct imported listed` | `distinct` | - | <li>Imported WOs should be listed for that Vehicle in distinct. |
| 4 | CANDIDATE GAP | PHRASING | `confirmed imported order` | `confirmed` | - | (Not yet confirmed how they will be separated from other work orders which are not imported)</li> |

## C2271 - COVERED-BY

*Imported WO with no linked Customer or Vehicle is still viewable*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `SV-4572` · [open](https://shopview.testrail.io/index.php?/cases/view/2271)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer import link` | `customer` | - | <p>Import a WO but do not link it with any customer and Vehicle.</p> |
| 2 | CANDIDATE GAP | PHRASING | `base order url` | `base` | - | {{BASE URL}}/work-orders</p> |
| 3 | CANDIDATE GAP | PHRASING | `available filter imported` | `available` | - | <p>Open a WO with status = imported (Status filter for Imported WO is not yet available)</p> |
| 4 | CANDIDATE GAP | PHRASING | `able cannot customer` | `able` | - | <p>We should be able open that WO, but they cannot be linked with existing Customer or Vehicle</p> |

## C2275 - COVERED-BY

*Negative test cases (To be added later)*  
Section: Test Cases > Administration > Imports > Invoices > Import WO Invoices  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2275)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `added available becom` | `added` | - | <p>To be added later once the feature becomes available to test.</p> |

## C26615 - COVERED-BY

*Customer page shows three tabs Invoices / Payments / Deposits*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26615)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer exist finance` | `customer` | - | A customer exists (no finance lineage needed for the tab row) |

## C26616 - COVERED-BY

*Invoices tab contains invoices and credit memos only (no deposits)*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26616)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `credit customer held` | `credit` | - | Customer with one open invoice, one held credit memo, and one |

## C26617 - COVERED-BY

*Payments tab contains payments and refunds; deposits excluded as primary rows*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26617)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `against cash customer` | `against` | - | Customer with a cash payment against an invoice, a refund |

## C26618 - COVERED-BY

*Deposits tab shows held, applied, reversed and free-floating deposits*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26618)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `applied customer deposit` | `applied` | - | Customer with a held deposit, an applied deposit, and a |
| 2 | CANDIDATE GAP | PHRASING | `deposit filter off` | `deposit` | - | then toggle the open-deposits filter off |

## C26619 - COVERED-BY

*Open filter on by default hides zero-balance rows*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26619)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer fully invoice` | `customer` | - | Customer with one fully-paid invoice and one open invoice |
| 2 | CANDIDATE GAP | PHRASING | `filter invoic tab` | `filter` | - | Open the Invoices tab (filter defaults ON); |

## C26620 - COVERED-BY

*Tab header summaries match the rows beneath them*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26620)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer deposit invoic` | `customer` | - | Customer with open invoices, a payment, and deposits |
| 2 | CANDIDATE GAP | PHRASING | `counter header invoic` | `counter` | - | Read the Invoices and Payments tab header counters; |

## C26621 - COVERED-BY

*Payments tab row expansion shows applied credit memos and deposits*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26621)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `applied credit deposit` | `applied` | - | A payment that applied both a credit memo and a held deposit |
| 2 | CANDIDATE GAP | PHRASING | `expand payment row` | `expand` | - | Open the Payments tab and expand the payment row |

## C26622 - COVERED-BY

*Refund row links back to its source Credit Memo (click-through)*  
Section: Test Cases > Work Orders > Deposits - Scroll down on the left side for the tests > G. Customer Page Tabs & Payments Expansion  
Author: **Vladimir Tomovic** · refs: `SV-7331` · [open](https://shopview.testrail.io/index.php?/cases/view/26622)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `cashing created credit` | `cashing` | - | A refund created by cashing out a credit memo (the refund is |
| 2 | CANDIDATE GAP | PHRASING | `expand payment refund` | `expand` | - | Open the Payments tab and expand the refund row |

## C2125 - COVERED-BY

*Part Sales - filtering by status*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2125)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|

## C2126 - COVERED-BY

*Verify all fields in table*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2126)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base customer` | `app` | - | <li>App is navigated to {{BASE_URL}}/customer/{customer_id}/part-sales</li> |
| 2 | CANDIDATE GAP | PHRASING | `field intable required` | `field` | - | <li>Verify all required fields are visible intable</li> |

## C2127 - COVERED-BY

*New part sale - Add customer*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2127)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base customer` | `app` | - | <li>App is navigated to {{BASE_URL}}/customer/{customer_id}/part-sales</li> |
| 2 | CANDIDATE GAP | PHRASING | `new part sale` | `new` | - | <li>Click on New Part Sale</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog new part` | `dialog` | - | <li>New Part Sale dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `adding button close` | `adding` | - | <li><p>Dialog contains:<br />Fields for selecting Customer and vehicle, <br />Button for adding new customer and vehicle, <br />Save button<br />Close dialog button</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `add andd button` | `add` | - | <li>Click on Add button andd add new customer</li> |
| 6 | CANDIDATE GAP | PHRASING | `list pick vehicle` | `list` | - | <li>Pick vehicle from the list</li> |
| 7 | CANDIDATE GAP | PHRASING | `part redirected request` | `part` | - | <li>User is redirected to part-requests page</li> |
| 8 | CANDIDATE GAP | PHRASING | `add dialog opened` | `add` | - | <li>Add Part dialog is opened</li> |

## C2128 - COVERED-BY

*New part sale - Add customer Counter Sale*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2128)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base customer` | `app` | - | <li>App is navigated to {{BASE_URL}}/customer/{customer_id}/part-sales</li> |
| 2 | CANDIDATE GAP | PHRASING | `new part sale` | `new` | - | <li>Click on New Part Sale</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog new part` | `dialog` | - | <li>New Part Sale dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `adding button close` | `adding` | - | <li><p>Dialog contains:<br />Fields for selecting Customer and vehicle, <br />Button for adding new customer and vehicle, <br />Save button<br />Close dialog button</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `add andd button` | `add` | - | <li>Click on Add button andd add new customer (Counter Sale)</li> |
| 6 | CANDIDATE GAP | PHRASING | `part redirected request` | `part` | - | <li>User is redirected to part-requests page</li> |
| 7 | CANDIDATE GAP | PHRASING | `add dialog opened` | `add` | - | <li>Add Part dialog is opened</li> |

## C2129 - COVERED-BY

*New part sale - Add vehicle*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2129)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base customer` | `app` | - | <li>App is navigated to {{BASE_URL}}/customer/{customer_id}/part-sales</li> |
| 2 | CANDIDATE GAP | PHRASING | `new part sale` | `new` | - | <li>Click on New Part Sale</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog new part` | `dialog` | - | <li>New Part Sale dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `adding button close` | `adding` | - | <li><p>Dialog contains:<br />Fields for selecting Customer and vehicle, <br />Button for adding new customer and vehicle, <br />Save button<br />Close dialog button</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `customer list pick` | `customer` | - | <li>Pick customer from the list</li> |
| 6 | CANDIDATE GAP | PHRASING | `add adding button` | `add` | - | <li>Click Add vehicle button and fill in form for adding new vehicle</li> |
| 7 | CANDIDATE GAP | PHRASING | `part redirected request` | `part` | - | <li>User is redirected to part-requests page</li> |
| 8 | CANDIDATE GAP | PHRASING | `add dialog opened` | `add` | - | <li>Add Part dialog is opened</li> |

## C2130 - COVERED-BY

*New part sale - Add vehicle and Customer*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2130)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `app base customer` | `app` | - | <li>App is navigated to {{BASE_URL}}/customer/{customer_id}/part-sales</li> |
| 2 | CANDIDATE GAP | PHRASING | `new part sale` | `new` | - | <li>Click on New Part Sale</li> |
| 3 | CANDIDATE GAP | PHRASING | `dialog new part` | `dialog` | - | <li>New Part Sale dialog opens</li> |
| 4 | CANDIDATE GAP | PHRASING | `adding button close` | `adding` | - | <li><p>Dialog contains:<br />Fields for selecting Customer and vehicle, <br />Button for adding new customer and vehicle, <br />Save button<br />Close dialog button</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `add andd button` | `add` | - | <li>Click on Add button andd add new customer</li> |
| 6 | CANDIDATE GAP | PHRASING | `add adding button` | `add` | - | <li>Click Add vehicle button and fill in form for adding new vehicle</li> |
| 7 | CANDIDATE GAP | PHRASING | `part redirected request` | `part` | - | <li>User is redirected to part-requests page</li> |
| 8 | CANDIDATE GAP | PHRASING | `add dialog opened` | `add` | - | <li>Add Part dialog is opened</li> |

## C2197 - COVERED-BY

*Part Sales - PS Tab Counter*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2197)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer navigated part` | `customer` | - | <li><p>User is navigated to any customer's Part Sales tab</p> |
| 2 | CANDIDATE GAP | PHRASING | `base customer part` | `base` | - | {{BASE_URL}}/customers/{{CUSTOMER_ID}}/part-sales</li> |
| 3 | CANDIDATE GAP | PHRASING | `counter item list` | `counter` | - | <li>Verify that the number of PS items on the list matches the counter number in the PS tab</li> |

## C2198 - COVERED-BY

*New Part Sale Modal - Current Customer*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2198)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `customer navigated part` | `customer` | - | <li><p>User is navigated to the Customer's part sale page/tab</p> |
| 2 | CANDIDATE GAP | PHRASING | `base customer part` | `base` | - | {{BASE_URL}}/customers/{{CUSTOMER_ID}}/part-sales</li> |
| 3 | CANDIDATE GAP | PHRASING | `button new part` | `button` | - | <li>Click on <strong>New Part Sale</strong> button</li> |
| 4 | CANDIDATE GAP | PHRASING | `modal new part` | `modal` | - | <li><strong>New part sale</strong> modal opens</li> |
| 5 | CANDIDATE GAP | PHRASING | `new part sale` | `new` | - | <li>Title <strong>New part sale</strong> is visible</li> |
| 6 | CANDIDATE GAP | PHRASING | `button close strong` | `button` | - | <li><strong>X</strong> (close) button is visible</li> |
| 7 | CANDIDATE GAP | PHRASING | `customer dropdown strong` | `customer` | - | <li><p><strong>Customer</strong> Dropdown is visible</p> |
| 8 | CANDIDATE GAP | PHRASING | `current customer selected` | `current` | - | <li>Current customer is selected</li> |
| 9 | CANDIDATE GAP | PHRASING | `add adding buton` | `add` | - | <li><strong>Add</strong> buton for adding a new customer is visible</li> |
| 10 | CANDIDATE GAP | PHRASING | `button save strong` | `button` | - | <li><strong>Save</strong> button is visible</li> |
| 11 | CANDIDATE GAP | PHRASING | `close modal new` | `close` | - | <li><strong>New part sale</strong> modal closes</li> |
| 12 | CANDIDATE GAP | PHRASING | `created part sale` | `created` | - | <li><p>Part Sale is created:</p> |
| 13 | CANDIDATE GAP | PHRASING | `created navigated newly` | `created` | - | <li>User is navigated to the <strong>newly created</strong> Part Sale page</li> |
| 14 | CANDIDATE GAP | PHRASING | `add modal part` | `add` | - | <li><strong>Add Part</strong> modal opens</li> |

## C30638 - COVERED-BY

*Part Sale: picking an inventory part with a core charge applies the core charge once*  
Section: Test Cases > Customers > Part Sales  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/30638)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `charge core inventory` | `charge` | - | A Part Sale with an inventory part that carries a core charge, left unpicked (main request `in_stock`) |
| 2 | CANDIDATE GAP | PHRASING | `button grid inventory` | `button` | - | On the Parts-tab part-request grid, confirm the MAIN inventory row shows the Pick button |
| 3 | CANDIDATE GAP | PHRASING | `main pick row` | `main` | - | Click Pick on the MAIN row |

## C1943 - COVERED-BY

*Filter Staff by First Name*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1943)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `first header name` | `first` | - | <li>Click on First Name header</li> |
| 3 | CANDIDATE GAP | PHRASING | `first name sorted` | `first` | - | <li>Staff is sorted by First Name A-Z</li> |
| 4 | CANDIDATE GAP | PHRASING | `first name sorted` | `first` | - | <li>Staff is sorted by First Name Z-A</li> |

## C1944 - COVERED-BY

*Filter Staff by Last Name*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1944)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `header last name` | `header` | - | <li>Click on Last Name header</li> |
| 3 | CANDIDATE GAP | PHRASING | `last name sorted` | `last` | - | <li>Staff is sorted by Last Name A-Z</li> |
| 4 | CANDIDATE GAP | PHRASING | `last name sorted` | `last` | - | <li>Staff is sorted by Last Name Z-A</li> |

## C1945 - COVERED-BY

*Filter Staff by Email*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1945)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `email sorted staff` | `email` | - | <li>Staff is sorted by Email A-Z</li> |
| 3 | CANDIDATE GAP | PHRASING | `email sorted staff` | `email` | - | <li>Staff is sorted by Email Z-A</li> |

## C1946 - COVERED-BY

*Filter Staff by Job Title*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1946)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `header job title` | `header` | - | <li>Click on Job Title header</li> |
| 3 | CANDIDATE GAP | PHRASING | `job sorted staff` | `job` | - | <li>Staff is sorted by Job Title A-Z</li> |
| 4 | CANDIDATE GAP | PHRASING | `job sorted staff` | `job` | - | <li>Staff is sorted by Job Title Z-A</li> |

## C1949 - COVERED-BY

*Filter Staff by Creation date*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1949)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `ascending creation date` | `ascending` | - | <li>Staff is sorted by Creation date ascending. |
| 3 | CANDIDATE GAP | PHRASING | `creation date descending` | `creation` | - | <li>Staff is sorted by Creation date descending.</li> |

## C1950 - COVERED-BY

*Filter Staff by Confirmed Invitation date*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1950)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `confirmed header invitation` | `confirmed` | - | <li>Click on Confirmed Invitation header</li> |
| 3 | CANDIDATE GAP | PHRASING | `ascending confirmed date` | `ascending` | - | <li>Staff is sorted by Confirmed Invitation date ascending</li> |
| 4 | CANDIDATE GAP | PHRASING | `confirmed date descending` | `confirmed` | - | <li>Staff is sorted by Confirmed Invitation date descending</li> |

## C1951 - COVERED-BY

*Filter Staff by Is Active status*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1951)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `active sorted staff` | `active` | - | <li>Staff is sorted by Is Active y/n</li> |
| 3 | CANDIDATE GAP | PHRASING | `active sorted staff` | `active` | - | <li>Staff is sorted by Is Active n/y</li> |

## C1952 - COVERED-BY

*Filter Staff by Billable status*  
Section: Test Cases > Administration > Settings > Staff > Staf filtering by fields  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/1952)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `administration base navigated` | `administration` | - | <li>User is navigated to {BASE_URL}/administration/staff</li> |
| 2 | CANDIDATE GAP | PHRASING | `billable sorted staff` | `billable` | - | <li>Staff is sorted by Billable y/n</li> |
| 3 | CANDIDATE GAP | PHRASING | `billable sorted staff` | `billable` | - | <li>Staff is sorted by Billable n/y</li> |

## C2219 - COVERED-BY

*Verify staff table loads with expected columns*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2219)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged navigated` | `account` | - | <ul><li><p>User is logged in with an admin account.</p></li><li><p>User is navigated to: |
| 2 | CANDIDATE GAP | PHRASING | `.teamtools.shopview.com clicked env` | `.teamtools.shopview.com` | - | "{env}.teamtools.shopview.com/nova/resources/staff"&nbsp;</p></li><li><p>User has clicked on the "Staff" menu item on the right.</p></li></ul> |
| 3 | CANDIDATE GAP | PHRASING | `header load staff` | `header` | - | <ul><li><p>Wait for the Staff page to load.</p></li><li><p>Check that the table headers are: |
| 4 | CANDIDATE GAP | PHRASING | `active applicable client` | `active` | - | Name, Created At, Confirmed Invitation At, Active, Email, Job Title, Role, Client.</p></li><li><p>Check that rows are displayed with non-empty values where applicable.</p></li></ul> |
| 5 | CANDIDATE GAP | PHRASING | `applicable column contain` | `applicable` | - | <ul><li>All columns are visible, and each row contains valid data or “—” where applicable.</li></ul> |

## C2220 - COVERED-BY

*Verify "Active" status indicator (green check/red cross)*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2220)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged` | `account` | - | <li><p>User is logged in with an admin account.</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `.portal.shopview.com dashboard env` | `.portal.shopview.com` | - | "{env}.portal.shopview.com/dashboards/main"</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `clicked item menu` | `clicked` | - | <li><p>User has clicked on the "Staff" menu item on the right.</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `active column locate` | `active` | - | <li><p>Locate the “Active” column.</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `accepted checkmark green` | `accepted` | - | <p>Users who accepted the invite show a green checkmark.</p> |
| 6 | CANDIDATE GAP | PHRASING | `accept cross didn` | `accept` | - | <p>Users who didn’t accept show a red cross.</p></li> |
| 7 | CANDIDATE GAP | PHRASING | `accurately activation active` | `accurately` | - | <li>Active statuses accurately reflect user activation.</li> |

## C2221 - COVERED-BY

*Verify sorting functionality on columns*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2221)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged` | `account` | - | <li><p>User is logged in with an admin account.</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `.portal.shopview.com dashboard env` | `.portal.shopview.com` | - | "{env}.portal.shopview.com/dashboards/main"</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `clicked item menu` | `clicked` | - | <li><p>User has clicked on the "Staff" menu item on the right.</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `column created e.g` | `column` | - | <li><p>Click on each column header (e.g., "Name", "Created At").</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `ascending behavior descending` | `ascending` | - | <li><p>Observe the sorting behavior (ascending/descending toggle</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `ascending column correctly` | `ascending` | - | <li>Column data gets sorted correctly in both ascending and descending order</li> |

## C2222 - COVERED-BY

*Verify filter icon presence and interaction*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2222)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged` | `account` | - | <li><p>User is logged in with an admin account.</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `.portal.shopview.com dashboard env` | `.portal.shopview.com` | - | "{env}.portal.shopview.com/dashboards/main"</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `clicked item menu` | `clicked` | - | <li><p>User has clicked on the "Staff" menu item on the right.</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `filter icon right` | `filter` | - | <li><p>Click the filter icon (top-right of the table).</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `dialog dropdown filter` | `dialog` | - | <li><p>Confirm a filter dialog or dropdown appears.</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `filter many option` | `filter` | - | <li>A filter UI opens option of how many records do we want to see on page</li> |

## C2223 - COVERED-BY

*Verify “View” button navigates to user detail page*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2223)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged` | `account` | - | <li><p>User is logged in with an admin account.</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `.portal.shopview.com dashboard env` | `.portal.shopview.com` | - | "{env}.portal.shopview.com/dashboards/main"</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `clicked item menu` | `clicked` | - | <li><p>User has clicked on the "Staff" menu item on the right.</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `locate row staff` | `locate` | - | <li><p>On the Staff table, locate any row </p></li> |
| 5 | CANDIDATE GAP | PHRASING | `column eye icon` | `column` | - | <li><p>Click the eye icon in the last column of that row.</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `detail member navigation` | `detail` | - | <li><p>Wait for navigation to the staff member's detail view page.</p></li> |
| 7 | CANDIDATE GAP | PHRASING | `detail following new` | `detail` | - | <li><p>Verify that the following details are visible on the new page:</p> |
| 8 | CANDIDATE GAP | PHRASING | `active inactive indicator` | `active` | - | <p>Status (Active/Inactive toggle or indicator)</p> |
| 9 | CANDIDATE GAP | PHRASING | `confirmation date invitation` | `confirmation` | - | <p>Invitation Date and Confirmation Date</p> |
| 10 | CANDIDATE GAP | PHRASING | `available back button` | `available` | - | <p>A back or edit button (if available)</p></li> |
| 11 | CANDIDATE GAP | PHRASING | `clicked data match` | `clicked` | - | <li><p>Confirm that the data matches the row that was clicked on the staff table.</p></li> |
| 12 | CANDIDATE GAP | PHRASING | `correct detail member` | `correct` | - | <li><p>Page navigates to the correct staff member’s profile/detail page.</p></li> |
| 13 | CANDIDATE GAP | PHRASING | `clearly information match` | `clearly` | - | <li><p>All relevant user information is displayed clearly and matches the previous row.</p></li> |
| 14 | CANDIDATE GAP | PHRASING | `button include optionally` | `button` | - | <li><p>UI may optionally include buttons to:</p> |

## C2224 - COVERED-BY

*Verify search bar functionality*  
Section: Test Cases > Administration > Settings > Admin portal > Staff  
Author: **Vladimir Tomovic** · refs: `None` · [open](https://shopview.testrail.io/index.php?/cases/view/2224)

| # | Verdict | Strength | Signature | Missing | Our nearest | Assertion |
|---|---|---|---|---|---|---|
| 1 | CANDIDATE GAP | PHRASING | `account logged` | `account` | - | <li><p>User is logged in with an admin account.</p></li> |
| 2 | CANDIDATE GAP | PHRASING | `.portal.shopview.com dashboard env` | `.portal.shopview.com` | - | "{env}.portal.shopview.com/dashboards/main"</p></li> |
| 3 | CANDIDATE GAP | PHRASING | `clicked item menu` | `clicked` | - | <li><p>User has clicked on the "Staff" menu item on the right.</p></li> |
| 4 | CANDIDATE GAP | PHRASING | `bar cody e.g` | `bar` | - | <li><p>Type a full or partial name (e.g., "Cody") in the search bar.</p></li> |
| 5 | CANDIDATE GAP | PHRASING | `filtered list observe` | `filtered` | - | <li><p>Observe the filtered list.</p></li> |
| 6 | CANDIDATE GAP | PHRASING | `match rows search` | `match` | - | <li>Only rows that match the search term are displayed.</li> |
