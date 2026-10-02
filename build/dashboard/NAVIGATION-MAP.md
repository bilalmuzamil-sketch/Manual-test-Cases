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
