# Dashboard — NAVIGATION MAP (observed, reusable — Rule 27)
# Env: sv490.qa.shopview.com · build v26.39.1-09be696 · first observed 2026-10-02
## ACCESS: 3 cookies (sv_sso_session+PHPSESSID+cf_clearance) → /tmp/cln/sv490-cookies.json (SECRET,/tmp,600).
#  Boot: `node build/testing-tools/qa-branch-boot.mjs sv490 <route> admin`; Chrome-131 UA; NODE_USE_ENV_PROXY=1;
#  bridge via ensure_bridge.sh. API host sv490api.qa.shopview.com.
## UI ROUTES
# /dashboard — the Dashboard (top-nav "Dashboard"). Tiles link out via an expand icon + "View details".
# API: /api/dashboard/reports (+ per-tile report endpoints).
## BUILD GLOSSARY — Dashboard (/dashboard)  — Evidence: build-verify-2026-10-02/dashboard-main.png
# Top nav adds "Dashboard". 
# KPI HERO TILES: "Revenue" ($, "N Invoices") · "Billing Efficiency" ("X Invoiced / Y Clocked") ·
#   "Technician Efficiency" ("X Invoiced Tech Hrs / Y Clocked") · "Technician Utilization" (%, "WO Hrs / Clocked", bar).
# COUNT TILES: "Sales by Customer" ("N customers", "Top: <name>", area chart) · "At Risk Customers"
#   ("N", "$X (12mo) · N customers", area chart).
# Each tile: an expand/open icon (top-right) · a date-range dropdown · "View details" (expands/drills in).
# DATE RANGES observed: "This Month" (KPI tiles) · "Last 12 Months" (Sales by Customer) · "120 Days" (At Risk).
## STILL TO OBSERVE
# Expanding a tile / "View details" drill-in (S6/S10) · per-tile date-range options list (S7) · chart filters (S8) ·
# chart behavior/hover (S9) · chart on the report page (S11) · the report pages each tile drills into (S3/S10/DATA).

## REPORTS ROUTES (tile drill-in targets) — observed 2026-10-02, build v26.39.1-09be696
# Reports top-nav "Reports" → lands on /reports/punch-clock-activities; left rail lists all reports.
| What | Route | Evidence |
|---|---|---|
| Reports landing | /reports (→ /reports/punch-clock-activities) | reverify-2026-10-02/reports-landing.png |
| Technician Efficiency report | /reports/technician-efficiency | report-technician-efficiency.png |
| Service Advisor Analysis report | /reports/service-advisor-analysis (rail label "Advisor Analysis"; page heading "Service Advisor Analysis") | report-advisor-analysis.png |
# Report shell: filter row (Date dropdown + report filter + "⋯" more-actions + "Hide Chart"/"Show Chart"); embedded
#   chart ABOVE the data tabs; chart empty-state "No data for selected date range"; table empty-state "No record matches these filters".
# The four reports that carry the embedded chart: Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization.
