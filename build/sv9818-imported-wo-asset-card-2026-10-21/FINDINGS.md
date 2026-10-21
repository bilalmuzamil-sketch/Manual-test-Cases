# SV-9818 — Imported WO asset card: Mileage / Engine Hours labelled
Result: PASSED (no recording / no technical section per QA lead).
- Branch sv9818 v26.40.19-e435950. Imported 4 invoices (import.csv) via /administration/invoices-import (POST /api/imports/work-order-historical): ZZ9818-A 45/9987, -B 45/–, -C –/–, -D –/9987. Imported WOs open at /imported-work-orders/{id}; list via Work Orders → All → Status: Imported (/api/work-orders-imported).
- All four cards show labelled "Mileage" and "Engine Hours" rows ("-" when empty; hours shown with a thousands comma, 9,987).
- Production before (v26.40.20-aada856): imported ZZ9818-P (Trucks Hill 2, aqeel transport 56, 45/9987) → card shows "459987". Left on production as test data.
