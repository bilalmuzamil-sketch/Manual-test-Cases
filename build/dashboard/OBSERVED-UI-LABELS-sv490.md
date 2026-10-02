# OBSERVED UI LABELS — Dashboard · sv490.qa.shopview.com · build v26.39.1-09be696 · observed 2026-10-02
# RULE: label enters here ONLY from a live probe with evidence. Evidence: build-verify-2026-10-02/
## Top nav: "Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports" · "Dashboard" (new)
## Dashboard (/dashboard)  — Evidence: dashboard-main.png
KPI hero tiles: "Revenue" · "Billing Efficiency" · "Technician Efficiency" · "Technician Utilization".
  Sub-measures: "N Invoices" · "X Invoiced / Y Clocked" (Billing Efficiency) · "X Invoiced Tech Hrs / Y Clocked"
  (Technician Efficiency) · "NN WO Hrs / NN Clocked" + a progress bar (Technician Utilization).
Count tiles: "Sales by Customer" ("N customers" · "Top: <customer name>" · area chart) · "At Risk Customers"
  ("N" · "$X (12mo) · N customers" · area chart).
Per tile: an expand/open icon, a date-range dropdown, "View details".
Date ranges seen: "This Month" · "Last 12 Months" · "120 Days".
## STILL TO OBSERVE: tile expand/drill-in report (S6/S10), date-range option list (S7), chart filters (S8),
#  chart behavior/hover (S9), chart on report page (S11), visual conformance (S12).

## Expanding a tile (S6)  — Evidence: tile-drill-in.png
"View details" (chevron) expands the tile INLINE into a chart panel below the tile row (header = tile name,
a chart, empty state "No data for selected date range"). Clicking again collapses it. The expand/open icon
(top-right ↗) is separate — it opens the full report page (S10/S11 drill-in).
## Date-range options (S7)  — Evidence: date-range-open.png
"Today" · "This Week" · "Last Week" · "This Month" · "Last Month" · "This Quarter" · "This Year" · "Last Year" ·
"Last 12 Months" · "120 Days" · "Custom".
## STILL TO OBSERVE: report page drill-in (expand icon, S10/S11) · chart filters (S8) · chart hover/behavior (S9).

## Reports pages (tile drill-in targets, S10/S11) — observed 2026-10-02, build v26.39.1-09be696
# Evidence: reverify-2026-10-02/reports-landing.png, report-technician-efficiency.png, report-advisor-analysis.png
Reports left rail sections + entries (the smallest element label each tester sees):
  LABOR: "Timesheet Activities".
  PERFORMANCE: "Sales" · "Technician Efficiency" · "Advisor Analysis" (rail label) · "Shop Efficiency" ·
    "Work In Progress" · "Technician Utilization" · "Sales By Customer" · "Sales By Representative".
  PARTS: "Parts Velocity" · "Inventory Value".  FINANCE: "Sales Tax Collected".
  ACCOUNTS RECEIVABLE: "A/R Aging Summary/Detail/Collection".  ACCOUNTS PAYABLE: "A/P Aging Summary/Detail/Unpaid Invoices".
  ACCOUNTING: "IBS Batches" · "QB Unexported" · "Export Reports".
# NOTE (glossary): the PERFORMANCE rail shows "Advisor Analysis" but the REPORT PAGE'S OWN HEADING is
#   "Service Advisor Analysis" (route /reports/service-advisor-analysis). Cases that name "Service Advisor
#   Analysis" are build-accurate (page heading = smallest element that owns the title). C204098 confirmed OK.
## A report page layout (Technician Efficiency /reports/technician-efficiency; same shell as Advisor Analysis)
Heading = report name (e.g. "Technician Efficiency" · "Service Advisor Analysis").
Filter row (one horizontal line, top-right): "Date: This month" dropdown (calendar icon) · report-specific filter
  (e.g. "Advisor") · "⋯" (more actions) menu · "Hide Chart" / "Show Chart" toggle (chart icon).
Embedded CHART panel sits ABOVE the data tabs; empty state in the chart = "No data for selected date range".
Data TABS under the chart (Technician Efficiency): "Invoiced" · "Completed".
Empty table state: "No record matches these filters" / "Try changing filters to widen your results."
Technician Efficiency columns: Date · Invoice · Customer · WO Line · Clocked Hrs · Invoiced Tech Hrs · Hrs Profit · Efficiency.
Service Advisor Analysis columns: Date · Invoice · Customer · Advisor · Days Open · Lines · Hrs Worked · Hrs Invoiced ·
  Labor Delta · Billing Efficiency · ELR · Parts Cost · Parts Invoiced · Parts Profit · Parts Margin · Total Profit · T Subtotal.
# Confirms build-accurate: C137997 (Vlad: Reports>Technician Efficiency, chart above tabs, This Month, No-data state),
#   C204097 (chart axis — chart panel present), C204098 (Show/Hide Chart control on filter row w/ ⋯ menu, 4 chart reports).
