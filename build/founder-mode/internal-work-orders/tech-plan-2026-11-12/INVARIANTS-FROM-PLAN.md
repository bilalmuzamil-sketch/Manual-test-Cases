# Internal Work Orders: what the tech plan says must NOT change (Rule 96 invariant set, from the plan)

**Project type:** (ii) V2 / upgrade (intake, 12 Nov 2026): ordinary billable work orders must not change.
**Sources:** tech plan rev. 5 (2026-11-10, PRD v1.0 page 39) and PRD Final v1.0 (2026-11-09), both read in full.
Each row gives the plan lines that state the invariant, the `TP-` ids in `TECH-PLAN-TESTABLE.json`, and the PRD sentence that
agrees (quoted word for word, checked by `tools/prd_quotes.py`) or "PRD silent".

**How to read it.** Documents establish intent; the plan's code facts establish what the system does today (Rule 96). Where the
PRD agrees, the row is a **strong invariant** and gets a regression case that cites the PRD. Where the PRD is silent and the plan
says "unchanged", the row is a **plan-sourced invariant** (QA lead ruling of 12 Aug 2026: the tech design sources a case where
nothing contradicts it). Where the plan reports today's behaviour as a code fact (for example "void invoices still counted"), the
regression case asserts "the same as before the release", never the code fact as a requirement.

**The PRD's own umbrella sentences** (they cover every row below):
- Out of Scope: "Regular work orders, invoicing, payments, discounts, credits and the customer portal behave exactly as they do today."
- Business Case: "Everything else about how a work order is estimated, approved, worked and reviewed stays unchanged."
- S9-R14 (rule zero): "For billable work orders and billable lines no report, dashboard card or export changes any number: every figure a report gives today for billable work is the same after the release, to the cent."
- Key Decisions, No feature flag: "the setting under Work Orders is off by default, so existing shops see no change until they turn it on; that is the release-day protection."

---

## 1. Ordinary billable work orders and Create invoice

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 1.1 | Create invoice on a billable work order from the header, menu, bulk bar, Finance tab and wizard works exactly as today; payment flow unchanged | 699 (TP-065), 1194-1197 (TP-125), 3024 (TP-366), 3222 (TP-404), 3729 (TP-539) | S3-N1: "If the work order is billable, the button reads "Create invoice" and everything works as today." |
| 1.2 | Create invoice refusal messages (complete, no live invoice, completed line, incomplete lines, blocking parts, unresolved cores) are word for word as today | 687 (TP-064), 2441 (TP-233) | PRD silent on the messages; covered by S3-N1 above |
| 1.3 | Completion wizard labels and steps on billable work orders unchanged | 3730 (TP-540) | S3-N1 (above) |
| 1.4 | Credit hold still blocks Create invoice on a billable work order: "Cannot invoice this customer. Customer is on Credit Hold" | 3404 (TP-475), 2228 | S3-N5 makes the exception only for Close: "A customer on credit hold does not block Close: nothing is owed, so Close Work Order is offered and works as on any other work order." |
| 1.5 | Existing work order header status labels (Review and every other) stay as today; only "Closed" is added | 491 (TP-019), 3731 (TP-541) | PRD silent |
| 1.6 | Work order three-dots menu on a billable work order unchanged (Audit Log, Timesheets, Fee/Discount, Print, Delete) | 3736 (TP-544) | PRD silent on the menu list; S2-R5 only adds Convert to No Charge |
| 1.7 | Change Customer on billable work orders and part sales: deposit refusal, part-sale lock, authorizer clear unchanged; an invoiced billable work order keeps today's hidden button | 3034 (TP-374), 3737 (TP-545), 3340 | S2-R7: "Changing the customer on a work order works as today (not offered on an invoiced or paid billable work order, as today, …)" |
| 1.8 | Reverse of an invoiced billable work order unchanged | 2114 (TP-211), 3025 (TP-367) | S4-N2: "If the work order is billable and invoiced, the existing Reverse behaviour applies, unchanged." |
| 1.9 | Adding a line to an invoiced or paid billable work order still spawns a new work order as today | 3033 (TP-373) | PRD silent on billable (S3-R3 extends the rule to closed ones) |
| 1.10 | Split and move-part on billable work orders unchanged | 3035 (TP-375) | PRD silent |
| 1.11 | Auto-apply fee and discount templates and the customer's default discount still apply on billable work orders and part sales | 2461 (TP-241), 2645 (TP-286), 3031 (TP-371) | S2-R21: "On a billable work order with no-charge lines, work order fees and discounts stay and are computed on the billable amounts; only the marked line's own discount is removed (S12-R4)." |
| 1.12 | Receiving and vendor-invoice edits on billable work orders: same sell-price derivation, same notice ("Updating the cost also updates the sell price"), same Sell preview | 2645 (TP-285), 3030 (TP-370), 3742 (TP-550) | PRD silent for billable; S2-R19 changes only internal / no-charge work and lines |
| 1.13 | Billable shop supplies rules (percentage, Min, Max) unchanged; Min without a percentage stays inert on billable work | 3029 (TP-369), 2529, 2624 | S10-E1 and S10-R1 change only internal / no-charge work orders |
| 1.14 | Pick, receive, clock-in and line approval write the same rows and statuses on internal work orders as on billable ones | 820 (TP-071), 2646 (TP-287) | S2-R11: "Parts ordering, receiving, picking, clock-ins, approvals, notes, inspections, split and review work exactly as on a billable work order." |
| 1.15 | A billable invoice with no no-charge line is byte-identical: statements, snapshot, inventory rows, QuickBooks invoice | 854 (TP-077), 1075 (TP-105), 2468 (TP-243), 3026 (TP-368) | S12-R7: "Create invoice works as today." |
| 1.16 | Issue Credit on billable parts unchanged (restocking fee, amounts; no QuickBooks restock entry, as today) | 2717 (TP-306), 3042 (TP-380), 3744 (TP-552) | PRD silent for billable |
| 1.17 | Work order notes that are not classification notes render as today | 3743 (TP-551) | PRD silent |
| 1.18 | Work order list: Invoiced and Paid filters, Completed tab, saved filters and URLs without the new chip restore as today | 3032 (TP-372), 3740 (TP-548), 3369 | S2-R14: "While the setting is off the chip is not shown; the badges on the rows stay." |
| 1.19 | Today's $0 invoices stay billable invoices (auto-paid, with their invoice webhooks) | 576 (TP-057), 2184 (TP-212, names TestRail C984), 2704 (TP-304), 3016 (TP-365), 3024 (TP-366) | S9-E2: "The $0 invoices created before this feature stay billable invoices in every report, as today; they are not re-classified." S12-R10 keeps the $0 path: "If every line of the work order is No Charge, the work order still invoices at $0.00 as a billable work order (one invoice, nothing owed, as a $0 invoice is paid today)" |

## 2. Part sales

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 2.1 | Part sales behave exactly as today; every new branch is for service work orders only; a part sale invoiced end to end is identical | 334 (TP-006), 699 (TP-065), 1075 (TP-105), 1093 (TP-120), 3733 (TP-542), 3735 (TP-543) | Out of Scope: "Part sales. A part sale to an internal customer is a regular billable part sale: no badge, no Convert action, no Close, no NO CHARGE stamp. Components shared with part sales change only for work orders." |

## 3. Customers, assets, settings (what existed before)

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 3.1 | New Customer and New Asset dialogs send exactly today's data; shop supplies validation unchanged for customers without the flag | 3308 (TP-440), 3738 (TP-546) | S1-R7: "New Customer does not show it: a customer is flagged after it exists, from Edit Customer or the modal." |
| 3.2 | The other Work Orders settings toggles and the existing confirm dialog save as today; the generic Settings save works while the release switch is off | 492 (TP-020), 3739 (TP-547) | PRD silent |
| 3.3 | Release day flags no customer and reclassifies no work order; existing "Internal" / "Shop Fleet" customers untouched | 576 (TP-058) | S13-R6: "Shops that keep an "Internal" or "Shop Fleet" customer today are not touched: the migration flags no customer and reclassifies no work order (Assumptions)" |
| 3.4 | Existing lines that carry the warranty flag keep it | 576 (TP-057) | S2-R22: "Existing lines that carry the flag keep it as it is; they are not priced, marked or changed by the release." |
| 3.5 | Before the release switch flips, nothing of the feature is visible (toggle, checkbox, line actions, categories page, QuickBooks rows, hub port) | 336 (TP-008), 505, 523, 526, 3190 | Key Decisions, No feature flag (quoted above) |
| 3.6 | Administration page sections that exist today keep their place; only a new tab is added | 1719 (TP-199) | PRD silent |

## 4. Reports, dashboard and exports (rule zero)

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 4.1 | Every billable figure in every report and dashboard card is the same to the cent; Sales report and dashboard load identically | 331 (TP-004), 670 (TP-062), 673 (TP-063), 2537 (TP-260), 3026 (TP-368) | S9-R14 (quoted above) |
| 4.2 | The regression list the plan re-runs: Sales, Advisor Analysis, Technician Efficiency, Billing Efficiency, Export Reports, Sales By Customer, Sales By Representative, Sales Tax, A/R Aging, Parts Velocity, Inventory Value, Technician Utilization, Work In Progress, dashboard tiles, imported-invoice sales exclusion, finance exports, A/R as-of, customer finance open-only filter, invoice list search, work order delete permissions | 1180-1188 (TP-124) | S9-R14 and S9-R15: "Reports not named above, checked and unchanged under rule zero: Requested Parts, Payroll Timesheet and the Journal Entries report" |
| 4.3 | Technician Efficiency gives identical numbers on billable-only data (report, PDF, dashboard card) | 3039 (TP-378) | S9-R14 |
| 4.4 | Customers Spending keeps today's totals for billable work (code fact: it counts void invoices today, and still will) | 2287 (TP-217), 2745 (TP-322), 3043 (TP-381) | S9-R14; S9-R15 only adds the exclusion of internal and no-charge work orders |
| 4.5 | Customer Invoice export: with the new option off the file is exactly today's file; billable rows byte-identical | 3038 (TP-377), 1033, 2745 | S9-R6: "While the option is off the file is exactly today's file." |
| 4.6 | Inventory Value, Work In Progress (its $0 line treatment) and A/P reports unchanged | 3032, 2742 | S9-R9: "Inventory Value, Work In Progress and A/P reports are unchanged; an open internal or no-charge work order shows in Work In Progress with its badge and no value." |
| 4.7 | Sales tax, IBS batches, A/R Aging and statements unchanged by a no-charge line | 2956, 2957 | S9-R12: "Sales Tax Collected, IBS Batches, the A/R Aging reports, customer statements, Inventory Value and the A/P reports are not affected by a no-charge line: it adds $0.00 taxable and nothing owed." |
| 4.8 | Asset Invoices tab keeps its columns; only closed rows are added | 1573 (TP-176), 1720 (TP-200) | S9-R10 (columns are v1.1); PRD silent on "unchanged columns" in words |

## 5. QuickBooks

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 5.1 | QuickBooks sync of billable invoices, payments, vendor bills, credits and journal entries posts to the same accounts as today | 932 (TP-087), 2718 (TP-308), 3036 (TP-376), 3037 | S7-R8: "The billable lines post as today." |
| 5.2 | QB Unexported: a billable entry keeps today's type ("Work Order Create") | 2718 (TP-307) | PRD silent |
| 5.3 | ShopView Accounts page: existing rows keep their place and grouping (no row regrouped under "Other"); the save sends exactly today's data when no category row changed; validation banner unchanged | 1238 (TP-130), 3041 (TP-379), 3272 (TP-424), 3741 (TP-549) | S5-R1: "Nothing is created in QuickBooks: the picker lists the location's existing expense accounts." |
| 5.4 | A location without QuickBooks: nothing sent, Close behaves as without an integration | 1926 | S7-N1: "If QuickBooks is not connected at the location, nothing is sent and Story 3 behaves exactly as it does without the integration." |

## 6. AccountingHub

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 6.1 | Billable invoices reach the hub and post exactly as today (a billable v4 posts what the same v3 posts) | 4276 (TP-582), 4331 (TP-584) | S8-R3: "Invoices, vendor bills, credits and payments keep today's statuses." |
| 6.2 | Today's $0 invoices still mirror in the hub as posted; replays never turn anything into revenue | 4275 (TP-581) | S8-R5: "Replaying historical events carries the classification, so a replay never turns a closed internal work order into revenue." |
| 6.3 | Hub vendor bills and credits for billable work book byte-identically | 4731 (TP-619) | S8-R3 (quoted in 6.1) |
| 6.4 | Hub Invoice List default and its totals unchanged; Closed is an extra, unselected value | 3963 (TP-567), 3508 | S8-R6: "The Invoice list report's status filter gets the value Closed, unselected by default, so the default report and its totals are unchanged." |
| 6.5 | Hub sales tax reports unchanged | 4638 (TP-606) | PRD silent for the hub |
| 6.6 | Accounting UI: existing status pills unchanged (deposit "Held" stays blue), static Account Mappings rows save as today | 3747 (TP-553) | PRD silent |
| 6.7 | An organization without AccountingHub: nothing changes | 1940 | S6-N1: "If AccountingHub is not enabled, nothing changes for the organization." |

## 7. Customer portal

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 7.1 | Billable estimates and approvals: same page, Price Summary numbers and emails as today | 5196 (TP-656), 5221 (TP-665), 335 (TP-007) | Out of Scope umbrella (quoted above) |
| 7.2 | Overdue and late-fee reminders and portal payments unchanged | 5082 (TP-645), 5083 (TP-646) | Out of Scope umbrella |
| 7.3 | Billable invoice webhooks and the portal "new invoice" notification still fire | 335 (TP-007), 2704 (TP-304) | Out of Scope umbrella |

## 8. Open API and webhooks

| # | Must not change | Plan lines (TP ids) | PRD |
|---|---|---|---|
| 8.1 | Billable invoices keep appearing in the Open API invoice lists; invoice.created / invoice.paid still sent for billable invoices (incl. $0) | 74 (TP-001), 2704 (TP-304) | S11-R5: "The changes are additive." S11-N2: "If a consumer subscribed to invoice webhooks only, it receives nothing for internal and no-charge work orders; the work order status webhook is the signal." |
| 8.2 | Organizations without Open API V1: nothing changes | (Story 11 is out of the plan) | S11-N1: "If Open API V1 is not enabled for the organization, nothing changes." |

---

## Dangerous silences (V2 touches the same code; flagged, not assumed)

| Silence | Why it is risky | Where it went |
|---|---|---|
| Portal deposit paid after the work order became no charge (plan line 5298) | Same deposit and portal checkout path; the customer is charged and refunded by hand | `QUESTIONS-DRAFT.md` Q5 |
| Line marks after Convert to No Charge then Convert to Billable (plan line 2385) | Same line pricing and category fields as Story 12 | Q7 |
| Customers Spending counts void invoices today (code fact, plan C14 line 2287) | The plan keeps it on purpose under rule zero; a PRD reader may expect voids excluded | Reported only: rule zero (S9-R14) settles it; the regression case asserts "same as before the release" |

## Honest limit

These rows are what the plan and the PRD say must not change. They are not everything ShopView does: a behaviour that no
document, no plan line and no existing case mentions cannot appear here. The existing V1 case set and the product code were not
part of this pass.
