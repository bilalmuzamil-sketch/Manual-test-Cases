# Design review — Work Orders Board View & Tech View (driven end-to-end 2026-09-23)

Rule 115: the design was **driven live**, not skimmed. The Claude Design export boots React from a CDN, which is
offline behind the proxy; it was localized (react/react-dom/babel into `sources/design/vendor/`, `support.js`
restored to verbatim afterward) and served over a local HTTP server, then driven with `build/testing-tools/drive_design.py`.
Screenshots + innerText per state are in `design-exploration-2026-09-23/`.

## States driven and what each confirmed
- **01 List (default):** full column table; columns incl. On Site, Status, Waiting On Parts, Number, Customer, Unit #,
  Asset, VIN/Serial, Progress, Lead Technician, Service Advisor, Clocked In, Lines, Assigned Tech, Created on, Total price.
- **02 Tech View:** groups by lead technician; **Unassigned first**; group header = avatar + name + count badge;
  collapse chevrons + drag handles; empty group shows "No work orders assigned"; lock icons on Declined/Imported/Invoiced/Paid.
- **03 Board View:** one column per lead tech + **fixed Unassigned first**; header avatar + name + **pin** + count;
  cards = number/status(badge fixed top-right)/customer/unit·asset/hours/progress/date/line-tech avatar/total price;
  **"Waiting on parts" correctly absent from cards** (matches spec decision); lock icons on restricted statuses.
- **05 Columns picker:** "12 of 17 shown", searchable, checkboxes (Auth, Parts, Waiting On Parts, Unit #, Asset,
  VIN/Serial #, Progress, Lead Technician, Service Advisor …), "Show all" / "Reset to default" — shared List/Tech View.
- **06 List scrolled (more-actions):** row **"⋯" more-actions**; **Assigned Tech avatar group with +N overflow** (S7-R4).
- **07 Board dark theme:** renders correctly in dark mode.
- **09 Density ("Row height") menu:** options **Small / Medium (default) / Large**.

## Design-vs-spec divergences (design lags the PRD — cases follow the SPEC, Rule 57/113; disclosed, Rule 56/115)
| # | Design shows | Spec requires | Tracked as |
|---|---|---|---|
| 1 | Density = "Row height: Small / Medium / Large" | Density: Compact / Regular / Comfortable (Regular default) in all 3 views | UX-14 (open) |
| 2 | No separate Board View "Fields to display" picker; only shared Columns picker | Board View has its own Fields picker (S5-R2) | UX-12 (open) |
| 3 | Switcher tooltips "Table / By Lead Tech / Board" | Labels List / Tech View / Board View | SQ-8 (board name settled; Tech View icon open) |
| 4 | Opens on the **All** filter tab | Work Orders is the default filter view (S1-R10) | flag to PO |
| 5 | Empty group label "No work orders assigned" | "No work orders" (S2-R15) | UX-4 (open) |
| 6 | Restricted-status cards still expose Reassign Lead Tech | Reassign blocked + non-draggable + reason (S4-N2/N6/N7) | UX-17 (open) |

These are already tracked as open design follow-ups on review child 853901313; none subtracts or adds a test case —
the cases are authored to the spec and the divergences are the PO/design authority's to resolve.
