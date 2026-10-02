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
