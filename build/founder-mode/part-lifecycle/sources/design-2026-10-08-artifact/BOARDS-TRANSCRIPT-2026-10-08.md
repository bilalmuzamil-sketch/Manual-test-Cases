# Part Lifecycle design — board transcript (2026-10-08 artifact)

Source: `png/` folder of this design package (46 PNG screenshots). Board order and titles from `files/canvas.json` ("artboards"). The "Before" boards have no PNG and are not transcribed: six canvas entries (1.0, 2.0, 3.0, 4.0, 6.0, 7.0) pointing at five distinct files (PartDialogBefore, used by both 1.0 and 3.0; HistoryBefore; ListBefore; LookupBefore; PartLibraryBefore).

How to read this file:
- Text in double quotes is copied verbatim from the image (spelling, capitalisation and punctuation as shown, including typos such as "Fuel FIlter").
- "…" marks text cut off by the screen edge or hidden behind a dialog/menu/tooltip; "..." inside quotes is the product's own truncation ellipsis.
- All part numbers, descriptions, quantities, bins, prices, staff names, customers and dates are EXAMPLE data shown in the design.
- Where several boards share the same app chrome or background list, the shared text is repeated in each section so every section stands alone.
- No designer annotations, callouts or sticky notes appear on any of the 46 boards (each section says so).

## 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png

**1. Screen:** Parts > Inventory list (Active tab) with the **New Inventory Part** dialog open on top (background dimmed). Location shown: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar (partly hidden behind the dialog): search icon (cut off) · "Supply" (with dropdown chevron, box icon) · column-picker icon · vertical "⋮" menu icon · blue button "New Inventory Part".
- Column headers visible around the dialog: "Description" · (Category column, header cut off, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Background rows (example data; the dialog hides the middle of each row, so descriptions are cut off where the dialog begins; a clock-with-arrow "history" icon sits at the left of rows 1–5 and 9):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING" … "…ling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RI" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING E" … "Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1" … "…e & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZ" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" D…" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE N" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #1" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP /" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOC" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NF" … "…e & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MAL" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE CC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · part number "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6" (on some boards the dialog covers this row from "BUNA R" onward)

*Dialog:*
- Title "New Inventory Part" · close "×".
- Field "Description" (focused, small floating label "Description", empty).
- Field placeholder "Part Number".
- Dropdown placeholder "Vendor".
- Dropdown placeholder "Category".
- Dropdown placeholder "Manufacturer".
- Three fields in one row: "Cost" · "Sell Price" · "Core Charge".
- Section heading "Inventory Tracking" with an info "ⓘ" icon.
- Toggle switch (on) with label "Track quantities and cost of goods".
- Two fields: "Min" · "Max".
- Field "Tags".
- Section heading "Inventory".
- Dropdown "Bin Location" with value "General Storage" · field "Quantity" with value "0" · pill "Default".
- Link "+ Add Bin Location".
- Footer buttons: "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Description field is focused (blue outline, blue floating label). All other fields empty (placeholders shown). Inventory Tracking toggle is ON (blue). Bin Location row pre-filled: General Storage, Quantity 0, light-blue "Default" pill. "Save" is a solid blue button; "Cancel" is outlined. Field order in dialog: Description, Part Number, Vendor, Category, Manufacturer, Cost / Sell Price / Core Charge, Inventory Tracking toggle, Min / Max, Tags, Inventory (Bin Location / Quantity / Default), + Add Bin Location. Background "Active" tab selected; "Parts" > "Inventory" highlighted in nav.

**4. Record data shown (example data):** background inventory rows listed above (descriptions, vendors such as Butautas' Truck & Tr..., Grand Haven Diesel ..., Stillwater Diesel Re..., Muhlenberg Park Tr...; bins PB1, ST20, ST20BIN, G2C, VID1A, VID1D, SHOP, VID2J, VID1E, General Stora…; part number N60012-920). Dialog default bin "General Storage", quantity 0.

## 1.2 Save with nothing filled — create-02-p1-2-required.png

**1. Screen:** Parts > Inventory list (Active tab) with the **New Inventory Part** dialog open, after Save was pressed with nothing filled. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:* same as 1.1 (dialog is taller here, so the last background row reads "1.475" ID X 0.116" 90D BUNA R" before the dialog edge):
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar (partly hidden behind the dialog): search icon (cut off) · "Supply" (with dropdown chevron, box icon) · column-picker icon · vertical "⋮" menu icon · blue button "New Inventory Part".
- Column headers visible around the dialog: "Description" · (Category column, header cut off, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Background rows (example data; the dialog hides the middle of each row, so descriptions are cut off where the dialog begins; a clock-with-arrow "history" icon sits at the left of rows 1–5 and 9):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING" … "…ling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RI" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING E" … "Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1" … "…e & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZ" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" D…" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE N" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #1" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP /" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOC" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NF" … "…e & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MAL" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE CC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · part number "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6" (on some boards the dialog covers this row from "BUNA R" onward)

*Dialog:*
- Title "New Inventory Part" · close "×".
- Field "Description" (red outline, small label "Description", empty) — error text below: "Description is a required field"
- Field "Part Number" (red outline, red placeholder) — error text below: "Part number is a required field"
- Dropdown "Vendor" (normal).
- Dropdown "Category" (red outline, red placeholder) — error text below: "Category is a required field"
- Dropdown "Manufacturer" (normal).
- "Cost" (red outline, red placeholder) — error text below: "Cost is a required field" · "Sell Price" (normal) · "Core Charge" (normal).
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" · "Max".
- "Tags".
- "Inventory": "Bin Location" "General Storage" · "Quantity" "0" · pill "Default".
- "+ Add Bin Location".
- Buttons "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Four fields flagged in red with red helper text: Description, Part Number, Category, Cost. Vendor, Manufacturer, Sell Price, Core Charge, Min, Max, Tags not flagged. Tracking toggle ON. Errors appear in field order: Description, Part number, Category, Cost.

**4. Record data shown (example data):** same background rows as 1.1; default bin General Storage, quantity 0.

## 1.3 Number and description typed — create-03-p1-3-filled.png

**1. Screen:** Parts > Inventory list (Active tab) with the **New Inventory Part** dialog open, required fields filled. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar (partly hidden behind the dialog): search icon (cut off) · "Supply" (with dropdown chevron, box icon) · column-picker icon · vertical "⋮" menu icon · blue button "New Inventory Part".
- Column headers visible around the dialog: "Description" · (Category column, header cut off, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Background rows (example data; the dialog hides the middle of each row, so descriptions are cut off where the dialog begins; a clock-with-arrow "history" icon sits at the left of rows 1–5 and 9):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING" … "…ling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RI" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING E" … "Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1" … "…e & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZ" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" D…" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE N" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #1" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP /" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOC" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NF" … "…e & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MAL" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE CC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · part number "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6" (on some boards the dialog covers this row from "BUNA R" onward)

*Dialog:*
- Title "New Inventory Part" · close "×".
- "Description" (floating label) value "SLACK ADJUSTER LEFT".
- "Part Number" (floating label) value "F40010212".
- Dropdown placeholder "Vendor".
- "Category" (floating label) value "HD-Air Brakes & Air Suspension".
- Dropdown placeholder "Manufacturer".
- "Cost" value "$ 45.00" · "Sell Price" (focused, floating label) value "$" · "Core Charge" (placeholder).
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" · "Max".
- "Tags".
- "Inventory": "Bin Location" "General Storage" · "Quantity" "0" · "Default".
- "+ Add Bin Location".
- "Cancel" · "Save".

No designer annotations on this board.

**3. State:** No error messages. Sell Price field focused (blue outline) with "$" prefix and no amount. Cost field has dark outline (filled). Vendor and Manufacturer empty. Tracking toggle ON.

**4. Record data shown (example data):** Description SLACK ADJUSTER LEFT; Part Number F40010212; Category HD-Air Brakes & Air Suspension; Cost $45.00; bin General Storage qty 0; background rows as 1.1.

## 1.4 Saved and linked to the Part Library entry — create-04-p1-4-linked-toast.png

**1. Screen:** Parts > Inventory list (Active tab), dialog closed, success toast at bottom right. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: "Search" (magnifier icon) · "Bin Location: All bin locations" (pin icon, chevron) · "Category: All categories" (chevron) · "Supply" (chevron) · column-picker icon · "⋮" menu icon · blue button "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Rows (example data; a clock-with-arrow "history" icon at the left of rows 1–5 and 9; descriptions truncated with "..." as shown):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING LOADED T-BOL..." · "N68SL-356" · (no tag) · "HD-Cooling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RING" · "NBOR-04" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING BRAKE CHAMB..." · "4--FLT3030LCB20" · · "HD-Air Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1/16"), 1/2" WI..." · "4--PET-40" · · "HD-Hose & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZE HYD ADAPT..." · "4--N66-HYD003" · · "HD-Equipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" DOT HYDRAULIC..." · "NL245-04" · tag pill "1503-4" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC BANJO" · "N3069-06-14" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE NPT STRAIGHT" · "NFF2404-06-06" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #12 FEMALE ORF..." · "N63550-08-12" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP Adj. Port 90°" · "N9059-10-08" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOCK KIT X 1" FEM..." · "0908HK-16-16" · tag pill "NW44-16-16U" · "HD-Hose & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NPT 90°" · "N2501-16-20" · · "HD-Hose & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT BALL VALVE" · "N10004-125BR" · · "HD-Equipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MALE NPT STRAIG..." · "1616-20-20" · tag pill "N5404-20-20" · "HD-Hose & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE COOLANT HOSE ..." · "NL4905-113" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · "N60012-920" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6"

*Toast (bottom right, green, check-mark icon):*
- "Part created. Linked to F40010212 in the Part Library. Its description "Slack Adjuster" was kept."
- Button "Close"

No designer annotations on this board.

**3. State:** Dialog closed. Green success toast with white check icon and "Close" action. Row 15 ("1-1/8" 3-PLY BLUE SILICONE COOLANT HOSE ...") has a light grey (hover) background. The newly created part (F40010212) is not visible among the 16 rows shown. Active tab selected.

**4. Record data shown (example data):** the 16 inventory rows listed above (part numbers N68SL-356, NBOR-04, 4--FLT3030LCB20, 4--PET-40, 4--N66-HYD003, NL245-04, N3069-06-14, NFF2404-06-06, N63550-08-12, N9059-10-08, 0908HK-16-16, N2501-16-20, N10004-125BR, 1616-20-20, NL4905-113, N60012-920; tags 1503-4, NW44-16-16U, N5404-20-20). Toast: part number F40010212; Library description "Slack Adjuster".

## 1.5 The same number again, in lower case — create-05-p1-5-duplicate-refused.png

**1. Screen:** Parts > Inventory list (Active tab) with the **New Inventory Part** dialog still open after Save; red error toast at bottom right. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar (partly hidden behind the dialog): search icon (cut off) · "Supply" (with dropdown chevron, box icon) · column-picker icon · vertical "⋮" menu icon · blue button "New Inventory Part".
- Column headers visible around the dialog: "Description" · (Category column, header cut off, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Background rows (example data; the dialog hides the middle of each row, so descriptions are cut off where the dialog begins; a clock-with-arrow "history" icon sits at the left of rows 1–5 and 9):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING" … "…ling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RI" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING E" … "Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1" … "…e & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZ" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" D…" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE N" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #1" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP /" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOC" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NF" … "…e & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MAL" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE CC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · part number "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6" (on some boards the dialog covers this row from "BUNA R" onward)

*Dialog:*
- "New Inventory Part" · "×".
- "Description" value "Slack adjuster".
- "Part Number" value "f40010212".
- Dropdown placeholder "Vendor".
- "Category" value "HD-Air Brakes & Air Suspension".
- Dropdown placeholder "Manufacturer".
- "Cost" "$ 45.00" · "Sell Price" "$ 81.82" · "Core Charge" (placeholder).
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" · "Max".
- "Tags".
- "Inventory": "Bin Location" "General Storage" · "Quantity" "0" · "Default".
- "+ Add Bin Location".
- "Cancel" · "Save".

*Toast (bottom right, red, warning-triangle icon):*
- "F40010212 already exists at this location."
- "Please try to resolve this." (smaller, lighter text)
- Button "Close"

No designer annotations on this board.

**3. State:** Dialog remains open with the entered values (no field-level red errors). Red error toast shown. Part number typed in lower case ("f40010212") while the toast names it in upper case ("F40010212"). Tracking ON.

**4. Record data shown (example data):** Description "Slack adjuster"; Part Number "f40010212"; Category HD-Air Brakes & Air Suspension; Cost $45.00; Sell Price $81.82; bin General Storage qty 0.

## 1.6 Branch: a new part with tracking off — create-06-p1-6-untracked.png

**1. Screen:** Parts > Inventory list (Active tab) with the **New Inventory Part** dialog open, Inventory Tracking switched off. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:* same as 1.1, except the dialog is shorter so rows 15–16 show more: "1-1/8" 3-PLY BLUE SILICONE COOLANT HOSE ..." · "NL4905-113" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." and "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6".
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar (partly hidden behind the dialog): search icon (cut off) · "Supply" (with dropdown chevron, box icon) · column-picker icon · vertical "⋮" menu icon · blue button "New Inventory Part".
- Column headers visible around the dialog: "Description" · (Category column, header cut off, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /" (cut off at right edge).
- Background rows (example data; the dialog hides the middle of each row, so descriptions are cut off where the dialog begins; a clock-with-arrow "history" icon sits at the left of rows 1–5 and 9):
  1. (history icon) "3.50-3.82" (89-97mm) SPRING" … "…ling & HVAC" · "-" · "Butautas' Truck & Tr..." · bin pill "PB1 | 7"
  2. (history icon) "#04 BSPP REPLACEMENT O-RI" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  3. (history icon) "(30/30 LONG STROKE SPRING E" … "Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20 | 1"
  4. (history icon) "(SS HOSE CLAMP (2-1/16" - 3-1" … "…e & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20 | 6"
  5. (history icon) "#04 - #12 STEEL NPT JUMP SIZ" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20BIN | 5" (cut off)
  6. "#04 NEXUS SAE100R5 3/16" D…" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C | 13"
  7. "#06 MALE JIC X 14mm METRIC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 1"
  8. "#06 MALE ORFS X 3/8" MALE N" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1D | 1"
  9. (history icon) "#08 N1 CRIMP COUPLING X #1" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOP | 7"
  10. "#10 Male JIC X #08 Male BSPP /" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  11. "#16 C62 O-RING FLANGE BLOC" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "General Stora" (cut off)
  12. "#16 MALE JIC X 1-1/4" MALE NF" … "…e & Fittings" · "-" · "-" · "VID1D | 1"
  13. "1-1/4" 600# HD BR. FULL PORT" … "…ipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "VID2J | 1"
  14. "1-1/4" MALE NPT X 1-1/4" MAL" … "…e & Fittings" · "-" · "Muhlenberg Park Tr..." · "VID1E | 10"
  15. "1-1/8" 3-PLY BLUE SILICONE CC" … "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · (no bin pill)
  16. "1.475" ID X 0.116" 90D BUNA REPLACEMENT ..." · part number "N60012-920" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1A | 6" (on some boards the dialog covers this row from "BUNA R" onward)

*Dialog:*
- "New Inventory Part" · "×".
- "Description" value "SHOP RAGS, BOX OF 50".
- "Part Number" value "RAG-50".
- Dropdown placeholder "Vendor".
- Dropdown placeholder "Category".
- Dropdown placeholder "Manufacturer".
- "Cost" · "Sell Price" · "Core Charge" (placeholders).
- "Inventory Tracking" ⓘ; toggle OFF "Track quantities and cost of goods".
- "Tags".
- "Inventory": "Bin Location" "General Storage" · "Quantity" "0" · "Default".
- "+ Add Bin Location".
- "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Tracking toggle OFF (grey track, white knob on left). The Min and Max fields are NOT shown (Tags follows the toggle directly). Inventory section (Bin Location / Quantity / Default) still shown. Category, Cost etc. empty; no errors shown.

**4. Record data shown (example data):** Description SHOP RAGS, BOX OF 50; Part Number RAG-50; bin General Storage qty 0.

## 2.1 The part as it stands — correct-01-p2-1-edit-open.png

**1. Screen:** Parts > Inventory list (Active tab, searched for "FF5507") with the **Edit Inventory Part** dialog open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search box (magnifier icon) containing "FF5507" · (filters hidden behind dialog) · "Supply" (chevron) · column-picker icon · "⋮" · blue button "New Inventory Part".
- Column headers visible: "Description" · (Category, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "Fuel FIlter, Mack/Volvo" · category cut off, only "…ers" visible · "-" · "Willoughby Mechani..." · bin pill "H2C | 3".

*Dialog:*
- Title "Edit Inventory Part" · green pill "Active" · close "×".
- "Description" value "Fuel FIlter, Mack/Volvo" (note: capital "I" in "FIlter", as shown).
- "Part Number" value "FF5507".
- Heading "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" value "Willoughby Mechanical Services" (dropdown).
- "Category" value "HD-Filters" (dropdown).
- Dropdown placeholder "Manufacturer".
- "Average Cost" "$ 22.35" · "Sell Price" "$ 40.64" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "0" · "Max" "1".
- "Tags" with chips "BF7814 ⊗" · "P550529 ⊗" · "33721 ⊗" · "20972295 ⊗".
- "Inventory": "Bin Location" "H2C" · "Quantity" "3" · pill "Default".
- "+ Add Bin Location".
- Footer: red button "Delete Part" (trash icon) at left · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Part Status radio "Active" selected; "Inactive" not selected. Green "Active" status pill in the dialog header. Tracking ON. Delete Part is a solid red button. Field order: Description, Part Number, Part Status, Vendor, Category, Manufacturer, Average Cost / Sell Price / Core Charge, Inventory Tracking, Min / Max, Tags, Inventory (Bin Location / Quantity / Default), + Add Bin Location.

**4. Record data shown (example data):** Part FF5507 "Fuel FIlter, Mack/Volvo"; vendor Willoughby Mechanical Services; category HD-Filters; Average Cost $22.35; Sell Price $40.64; Core Charge $0.00; Min 0, Max 1; tags BF7814, P550529, 33721, 20972295; bin H2C qty 3.

## 2.2 Both fields edited — correct-02-p2-2-warnings.png

**1. Screen:** Parts > Inventory list (Active tab, searched "FF5507") with the **Edit Inventory Part** dialog open after editing Description and Part Number. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search box (magnifier icon) containing "FF5507" · (filters hidden behind dialog) · "Supply" (chevron) · column-picker icon · "⋮" · blue button "New Inventory Part".
- Column headers visible: "Description" · (Category, only "…y" visible) · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "Fuel FIlter, Mack/Volvo" · category cut off, only "…ers" visible · "-" · "Willoughby Mechani..." · bin pill "H2C | 3".

*Dialog:*
- "Edit Inventory Part" · green pill "Active" · "×".
- "Description" value "Fuel Filter, Mack/Volvo" — helper text below (orange): "This also changes the description at 1 other location."
- "Part Number" value "FF5507A" — helper text below (orange): "This also changes the part number at 1 other location."
- "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" "Willoughby Mechanical Services".
- "Category" "HD-Filters".
- "Manufacturer" (placeholder).
- "Average Cost" "$ 22.35" · "Sell Price" "$ 40.64" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "0" · "Max" "1".
- "Tags": "BF7814 ⊗" · "P550529 ⊗" · "33721 ⊗" · "20972295 ⊗".
- "Inventory": "Bin Location" "H2C" · "Quantity" "3" · "Default".
- "+ Add Bin Location".
- "Delete Part" · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Description corrected from "FIlter" to "Filter"; Part Number changed FF5507 → FF5507A. Two orange/amber warning lines under the two edited fields (warnings, not red errors). Part Status "Active" selected (radio shows a focus halo). Background row still shows the old description "Fuel FIlter, Mack/Volvo" (not yet saved).

**4. Record data shown (example data):** as 2.1, with new Description "Fuel Filter, Mack/Volvo" and new Part Number "FF5507A"; "1 other location".

## 2.3 Saved: the list shows the new values — correct-03-p2-3-list-after.png

**1. Screen:** Parts > Inventory list (Active tab), searched for "FF5507A", no dialog. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search box (magnifier) "FF5507A" with clear "⊗" icon · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- One row: (history icon) "Fuel Filter, Mack/Volvo" · "FF5507A" · tag pills "BF7814" · "P550529" · "33721" · "..." (overflow pill on a second line) · "HD-Filters" · "-" · "Willoughby Mechani..." · bin pill "H2C | 3".

No designer annotations on this board. No toast shown.

**3. State:** Active tab selected; single search result; rest of page empty. The row shows the corrected description (lower-case "i" in "Filter") and new part number.

**4. Record data shown (example data):** FF5507A, "Fuel Filter, Mack/Volvo", tags BF7814, P550529, 33721 (+ more), HD-Filters, Willoughby Mechani..., H2C 3.

## 2.4 Part History at Heavy Duty — correct-04-p2-4-history-here.png

**1. Screen:** Part History page for the part (Parts section), with a "Part details" panel on the left. Location: "Staging Heavy Duty - 9919". Theme: light. (No left navigation sidebar on this page.)

**2. Visible text, verbatim (reading order):**

*App chrome (top bar only):* app logo · "ShopHub" (chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS".

*Left panel:*
- "Part details"
- "Fuel Filter, Mack/.." (blue link-style title, truncated)
- "Part number" — "FF5507A"
- "Category" — "HD-Filters"
- "Manufacturer" — (no value)
- "Measurement" — "ea"

*Main area:*
- Title "Part History" · right: magnifier "Search".
- Column headers: "Staff" · "Date" · "Time" · "Event".
- Rows (newest first):
  1. "Admin ShopView" · "Oct 2, 2026" · "04:06 PM" · "Description updated | Original description: Fuel FIlter, Mack/Volvo | New description: Fuel Filter, Mack/Volvo"
  2. "Admin ShopView" · "Oct 2, 2026" · "04:06 PM" · "Part number updated | Original number: FF5507 | New number: FF5507A"
  3. "Admin ShopView" · "Oct 2, 2026" · "02:36 PM" · "Description updated | Original description: Fuel Filter, Mack/Volvo | New description: Fuel FIlter, Mack/Volvo"
  4. "Admin ShopView" · "Oct 2, 2026" · "02:36 PM" · "Part number updated | Original number: FF5507A | New number: FF5507"
  5. "Admin ShopView" · "Oct 2, 2026" · "02:35 PM" · "Description updated | Original description: Fuel FIlter, Mack/Volvo | New description: Fuel Filter, Mack/Volvo"
  6. "Admin ShopView" · "Oct 2, 2026" · "02:35 PM" · "Part number updated | Original number: FF5507 | New number: FF5507A"

No designer annotations on this board.

**3. State:** Six history rows, each a pair (description + part number) at the same time; event text is bold. The 02:35/02:36 pairs show an earlier change and its reversal; the 04:06 pair is the current correction. Note "FIlter" (capital I) appears as the old spelling.

**4. Record data shown (example data):** staff "Admin ShopView"; date Oct 2, 2026; times 04:06 PM, 02:36 PM, 02:35 PM; part FF5507 ↔ FF5507A; descriptions "Fuel FIlter, Mack/Volvo" ↔ "Fuel Filter, Mack/Volvo"; category HD-Filters; measurement ea.

## 2.5 Lethbridge: renamed there too — correct-05-p2-5-list-other-location.png

**1. Screen:** Parts > Inventory list (Active tab), searched "FF5507A", at the OTHER location. Location shown: "Staging Lethbridge - 4310". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · location selector "Staging Lethbridge - 4310" · avatar "AS".
- Left sidebar: "SALES & SERVICE" → "Part Sales"; "PARTS" → "Inventory", "Part Library"; "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search "FF5507A" with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- One row: (history icon) "Fuel Filter, Mack/Volvo" · "FF5507A" · tags "BF7814" · "P550529" · "33721" · "..." · "HD-Filters" · "-" · "Willoughby Mechani..." · (Bin Location cell empty — no bin pill).

No designer annotations on this board.

**3. State:** Location switched to Lethbridge (location selector shows "Staging Lethbridge - 4310"). The same part shows the new description and part number here. No bin/quantity pill at this location (unlike Heavy Duty's "H2C | 3").

**4. Record data shown (example data):** FF5507A "Fuel Filter, Mack/Volvo"; tags BF7814, P550529, 33721; HD-Filters; Willoughby Mechani...

## 2.6 Part History at Lethbridge — correct-06-p2-6-history-other-location.png

**1. Screen:** Part History page at the other location. Location: "Staging Lethbridge - 4310". Theme: light. (No left navigation sidebar.)

**2. Visible text, verbatim (reading order):**

*App chrome (top bar only):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Lethbridge - 4310" · "AS".

*Left panel:* "Part details" · "Fuel Filter, Mack/.." (blue) · "Part number" "FF5507A" · "Category" "HD-Filters" · "Manufacturer" (no value) · "Measurement" "ea".

*Main area:* "Part History" · "Search" (magnifier). Headers: "Staff" · "Date" · "Time" · "Event". Rows:
  1. "Admin ShopView" · "Oct 2, 2026" · "04:06 PM" · "Description updated | Original description: Fuel FIlter, Mack/Volvo | New description: Fuel Filter, Mack/Volvo | Changed at: Staging Heavy Duty - 9919"
  2. "Admin ShopView" · "Oct 2, 2026" · "04:06 PM" · "Part number updated | Original number: FF5507 | New number: FF5507A | Changed at: Staging Heavy Duty - 9919"
  3. "Admin ShopView" · "Oct 2, 2026" · "02:36 PM" · "Description updated | Original description: Fuel Filter, Mack/Volvo | New description: Fuel FIlter, Mack/Volvo | Changed at: Staging Heavy Duty - 9919"
  4. "Admin ShopView" · "Oct 2, 2026" · "02:36 PM" · "Part number updated | Original number: FF5507A | New number: FF5507 | Changed at: Staging Heavy Duty - 9919"
  5. "Admin ShopView" · "Oct 2, 2026" · "02:35 PM" · "Description updated | Original description: Fuel FIlter, Mack/Volvo | New description: Fuel Filter, Mack/Volvo | Changed at: Staging Heavy Duty - 9919"
  6. "Admin ShopView" · "Oct 2, 2026" · "02:35 PM" · "Part number updated | Original number: FF5507 | New number: FF5507A | Changed at: Staging Heavy Duty - 9919"

No designer annotations on this board.

**3. State:** Same six events as at Heavy Duty, each with an extra suffix "| Changed at: Staging Heavy Duty - 9919" naming the location where the change was made. Event text bold.

**4. Record data shown (example data):** as 2.4, plus the "Changed at" location Staging Heavy Duty - 9919.

## 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active.png

**1. Screen:** Parts > Inventory list (Active tab, searched "N6801-06-04") with **Edit Inventory Part** dialog open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "N6801-06-04" · (filters hidden behind dialog) · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · (Category, "…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "#06 MALE JIC X #04 MALE ORB" (cut off by dialog) · category "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · bin pill "VID1G | 4".

*Dialog:* title "Edit Inventory Part" · green pill "Active" · "×".
- "Description" value "#06 MALE JIC X #04 MALE ORB 90".
- "Part Number" value "N6801-06-04".
- "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" value "Butautas' Truck & Trailer Repair LLC".
- "Category" value "HD-Hose & Fittings".
- "Manufacturer" (placeholder).
- "Average Cost" "$ 1.14" · "Sell Price" "$ 2.37" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "1" · "Max" "2".
- "Tags" (placeholder, empty).
- "Inventory": "Bin Location" "VID1G" · "Quantity" "4" · pill "Default".
- "+ Add Bin Location".
- Footer: red "Delete Part" (trash icon) · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Part Status "Active" radio selected; "Inactive" unselected. Green "Active" pill in header. Part Status sits directly under Part Number, above Vendor. Tracking ON.

**4. Record data shown (example data):** N6801-06-04 "#06 MALE JIC X #04 MALE ORB 90"; vendor Butautas' Truck & Trailer Repair LLC; HD-Hose & Fittings; Average Cost $1.14; Sell Price $2.37; Core Charge $0.00; Min 1; Max 2; bin VID1G qty 4.

## 3.2 Inactive picked — retire-02-p3-2-picked-inactive.png

**1. Screen:** Same as 3.1 — Edit Inventory Part dialog for N6801-06-04 over the Inventory list. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "N6801-06-04" · (filters hidden behind dialog) · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · (Category, "…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "#06 MALE JIC X #04 MALE ORB" (cut off by dialog) · category "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · bin pill "VID1G | 4".

*Dialog:* "Edit Inventory Part" · green pill "Active" · "×".
- "Description" value "#06 MALE JIC X #04 MALE ORB 90".
- "Part Number" value "N6801-06-04".
- "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" value "Butautas' Truck & Trailer Repair LLC".
- "Category" value "HD-Hose & Fittings".
- "Manufacturer" (placeholder).
- "Average Cost" "$ 1.14" · "Sell Price" "$ 2.37" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "1" · "Max" "2".
- "Tags" (placeholder, empty).
- "Inventory": "Bin Location" "VID1G" · "Quantity" "4" · pill "Default".
- "+ Add Bin Location".
- Footer: red "Delete Part" (trash icon) · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Part Status radio "Inactive" now selected (with focus halo); "Active" unselected. Header pill still green "Active" (not yet saved). No other change.

**4. Record data shown (example data):** as 3.1.

## 3.3 Save asks first — retire-03-p3-3-confirm.png

**1. Screen:** Confirmation dialog **"Deactivate part?"** stacked over the Edit Inventory Part dialog (both over the Inventory list). Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "N6801-06-04" · (filters hidden behind dialog) · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · (Category, "…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "#06 MALE JIC X #04 MALE ORB" (cut off by dialog) · category "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · bin pill "VID1G | 4".

*Edit dialog behind (dimmed; partly covered by the confirmation):* "Edit Inventory Part" · "Active" pill · "×" · "Description" "#06 MALE JIC X #04 MALE ORB 90" · "Part Number" "N6801-06-04" · "Part Status" "Active" / "Inactive" (Inactive selected) · partly visible "Vendo…" "Buta…", "Categ…" "HD-…", "Man…", "Avera…" "$ 1.1…", "Inven…", toggle, "Min" "1" · "Tags" · "Inventory" · "Bin Location" "VID1G" · "Quantity" "4" · "Default" · "+ Add Bin Location" · "Delete Part" · "Cancel" · "Save".

*Confirmation dialog:*
- Title "Deactivate part?" · close "×".
- "N6801-06-04 #06 MALE JIC X #04 MALE ORB 90"
- "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders."
- "Existing records that use it stay as they are."
- "Stock, cost of goods and QuickBooks aren't affected." (lighter grey text)
- Text field with label "Note (Optional)", value "Superseded by N6801-06-04X".
- Buttons: "Cancel" · red "Deactivate".

No designer annotations on this board.

**3. State:** Note field focused (blue outline) with typed note. "Deactivate" is a solid red button; "Cancel" outlined. Edit dialog dimmed behind with Inactive radio selected.

**4. Record data shown (example data):** N6801-06-04 #06 MALE JIC X #04 MALE ORB 90; note "Superseded by N6801-06-04X".

## 3.4 Done — retire-04-p3-4-toast.png

**1. Screen:** Parts > Inventory list, Active tab, searched "N6801-06-04", empty result, success toast. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search "N6801-06-04" with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- Empty state: magnifier icon in a grey circle; text "No parts match the search "N6801-06-04"." (wrapped as "No parts match the search "N6801-06-" / "04".").

*Toast (bottom right, green, check icon):* "Part deactivated." · "Close".

No designer annotations on this board.

**3. State:** Dialogs closed. Active tab no longer lists the deactivated part (empty state). Green success toast.

**4. Record data shown (example data):** search term N6801-06-04.

## 3.5 The Inactive tab — retire-05-p3-5-inactive-tab.png

**1. Screen:** Parts > Inventory list, **Inactive** tab, searched "N6801-06-04". Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" · "Inactive" (selected, blue text on light-blue highlight).
- Toolbar: search "N6801-06-04" with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- One row: (history icon) "#06 MALE JIC X #04 MALE ORB 90" · "N6801-06-04" · (no tags) · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · bin pill "VID1G | 4".

No designer annotations on this board.

**3. State:** Inactive tab selected. The deactivated part appears here with its stock still shown (VID1G 4). No status pill in the row. No toast.

**4. Record data shown (example data):** N6801-06-04 "#06 MALE JIC X #04 MALE ORB 90", HD-Hose & Fittings, Butautas' Truck & Tr..., VID1G 4.

## 3.6 Opening the inactive part — retire-06-p3-6-dialog-inactive.png

**1. Screen:** Inventory list on the **Inactive** tab (searched "N6801-06-04") with the **Edit Inventory Part** dialog open for the inactive part. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:* "Inventory"; tabs "Active" · "Inactive" (selected, blue); search "N6801-06-04"; "Supply"; column-picker; "⋮"; "New Inventory Part"; headers "Description" · "…y" · "Manufacturer" · "Vendor" · "Bin Location /"; row (history icon) "#06 MALE JIC X #04 MALE ORB" · "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1G | 4".

*Dialog:* title "Edit Inventory Part" · grey pill "Inactive" · "×".
- "Description" value "#06 MALE JIC X #04 MALE ORB 90".
- "Part Number" value "N6801-06-04".
- "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" value "Butautas' Truck & Trailer Repair LLC".
- "Category" value "HD-Hose & Fittings".
- "Manufacturer" (placeholder).
- "Average Cost" "$ 1.14" · "Sell Price" "$ 2.37" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "1" · "Max" "2".
- "Tags" (placeholder, empty).
- "Inventory": "Bin Location" "VID1G" · "Quantity" "4" · pill "Default".
- "+ Add Bin Location".
- Footer: red "Delete Part" (trash icon) · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Header pill is GREY "Inactive". Part Status radio "Inactive" selected; "Active" unselected. All fields still editable-looking (not greyed); Delete Part, Cancel, Save shown as normal. Tracking ON.

**4. Record data shown (example data):** as 3.1.

## 3.7 Bringing it back — retire-07-p3-7-activate-confirm.png

**1. Screen:** Confirmation dialog **"Activate part?"** stacked over the Edit Inventory Part dialog, over the Inventory list on the Inactive tab. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:* "Inventory"; tabs "Active" · "Inactive" (selected); search "N6801-06-04"; "Supply"; column-picker; "⋮"; "New Inventory Part"; headers "Description" · "…y" · "Manufacturer" · "Vendor" · "Bin Location /"; row (history icon) "#06 MALE JIC X #04 MALE ORB" · "…e & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1G | 4".

*Edit dialog behind (dimmed, partly covered):* "Edit Inventory Part" · grey pill "Inactive" · "×" · "Description" "#06 MALE JIC X #04 MALE ORB 90" · "Part Number" "N6801-06-04" · "Part Status" "Active" / "Inactive" · "Vendor" "Butautas' Truck & Trailer Repair LLC" · partly visible "Categ…" "HD-…", "Man…", "Avera…" "$ 1.1…", "Inven…", toggle, "Min" "1", Max "2" (partly hidden) · "Tags" · "Inventory" · "Bin Location" "VID1G" · "Quantity" "4" · "Default" · "+ Add Bin Location" · "Delete Part" · "Cancel" · "Save".

*Confirmation dialog:*
- Title "Activate part?" · close "×".
- "N6801-06-04 #06 MALE JIC X #04 MALE ORB 90"
- "This part can be added to new work again."
- Text field placeholder "Note (Optional)" (empty).
- Buttons: "Cancel" · blue "Activate".

No designer annotations on this board.

**3. State:** In the edit dialog behind, Part Status radio "Active" is now selected while the header pill still reads "Inactive" (grey). Confirmation "Activate" button is solid BLUE (contrast: "Deactivate" was red). Note field empty.

**4. Record data shown (example data):** N6801-06-04 #06 MALE JIC X #04 MALE ORB 90.

## 3.8 Finding it in Part History — retire-08-p3-8-history-search.png

**1. Screen:** Part History page for N6801-06-04, with the history search filled in. Location: "Staging Heavy Duty - 9919". Theme: light. (No left nav sidebar.)

**2. Visible text, verbatim (reading order):**

*App chrome (top bar only):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS".

*Left panel:* "Part details" · "#06 MALE JIC X #04.." (blue, truncated) · "Part number" "N6801-06-04" · "Category" "HD-Hose & Fittings" · "Manufacturer" (no value) · "Measurement" "ea".

*Main area:* "Part History" · search box (magnifier) with "superseded" and clear "⊗".
Headers: "Staff" · "Date" · "Time" · "Event". Rows:
  1. "Admin ShopView" · "Oct 2, 2026" · "04:07 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"
  2. "Admin ShopView" · "Oct 2, 2026" · "02:14 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"
  3. "Admin ShopView" · "Oct 2, 2026" · "01:54 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"
  4. "Admin ShopView" · "Oct 2, 2026" · "01:47 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"
  5. "Admin ShopView" · "Oct 2, 2026" · "01:46 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"
  6. "Admin ShopView" · "Oct 2, 2026" · "01:27 PM" · "Deactivated | Reason: Superseded by N6801-06-04X"

No designer annotations on this board.

**3. State:** History filtered by the word "superseded" (lower case typed; matches "Superseded" in the reason — case-insensitive). Six matching "Deactivated" events shown; event text bold. Board height 900 px.

**4. Record data shown (example data):** staff Admin ShopView; Oct 2, 2026; times 04:07 PM, 02:14 PM, 01:54 PM, 01:47 PM, 01:46 PM, 01:27 PM; reason "Superseded by N6801-06-04X".

## 4.1 The actions menu — bulk-01-p4-1-actions-menu.png

**1. Screen:** Parts > Inventory list (Active tab), searched "571.", with the "⋮" actions menu open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search "571." with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" (highlighted, menu open) · "New Inventory Part".
- Open menu items (top to bottom): "Cycle count" · "Deactivate parts" · "Export".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manuf…" (cut by menu) · "…lor" (Vendor, cut by menu) · "Bin Location /".
- Rows (history icon on rows 1, 2, 3, 10, 11):
  1. (history) "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · · "HD-Lighting & Electric..." · "-" · "…dowbrook Truck..." (cut by menu) · "PB5 | 1"
  2. (history) "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · · "HD-Lighting & Electric..." · "-" · "…dowbrook Truck..." (partly hidden) · "PB5 | 4"
  3. (history) "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · tags "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5 | 5"
  4. "1893 LIGHT BULB" · "2--571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24BIN3 |" (cut off)
  5. "1893 LIGHT BULB" · "571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN | 6"
  6. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · tag "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5 | 3"
  7. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · (no bin)
  8. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · tags "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · (no bin)
  9. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · tag "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · (no bin)
  10. (history) "2-Wire Pigtail, Right Angle PL-10" · "571.PT117" · tag "94902" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "A3B | 6"
  11. (history) "2.5" Marker Light Grommet, Open Back" · "91400" · tags "10700" "571.GR101" "571.GR10" · "HD-Lighting & Electric..." · "-" · "Glen Burnie Truck S..." · "PB5 | 3"
  12. "2.5" Marker Light Grommet, Shallow, Closed Ba..." · "571.GR101" · tags "10704" "91410" "91400" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · (no bin)

No designer annotations on this board.

**3. State:** "⋮" button highlighted; dropdown menu open beneath it with three items in order Cycle count, Deactivate parts, Export. No checkboxes in the list yet. Board height 900 px.

**4. Record data shown (example data):** the 12 rows above (571.* lighting parts; vendors Meadowbrook Truck..., Glen Burnie Truck S...; bins PB5, ST24BIN3, BBIN, A3B).

## 4.2 Mode on — bulk-02-p4-2-mode-on.png

**1. Screen:** Parts > Inventory list (Active tab), searched "571.", in bulk-deactivate selection mode (dark bar above toolbar, checkbox column). Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Dark bulk bar: count circle "0" · "selected" · button "Deactivate" · close "×" at far right.
- Toolbar: search "571." with "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker icon · "⋮" · "New Inventory Part".
- Column headers: (select-all checkbox) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Lo…" (cut off).
- Rows, each with an empty checkbox (history icon on rows 1, 2, 3, 10):
  1. "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5" (cut)
  2. "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  3. "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  4. "1893 LIGHT BULB" · "2--571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24"
  5. "1893 LIGHT BULB" · "571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN"
  6. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5"
  7. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  8. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  9. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  10. "2-Wire Pigtail, Right Angle PL-10" · "571.PT117" · "94902" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "A3B"

No designer annotations on this board.

**3. State:** Selection mode ON: dark (near-black) bulk bar; count "0 selected"; the "Deactivate" button is a muted/dimmed blue with greyish text (appears disabled at 0 selected). All checkboxes unticked, including the header select-all. Columns shifted right; Bin Location column cut off.

**4. Record data shown (example data):** the 10 rows above.

## 4.3 Two rows ticked — bulk-03-p4-3-ticked.png

**1. Screen:** Parts > Inventory list (Active tab), searched "571.", selection mode with two rows ticked; a description tooltip is showing. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Dark bulk bar: count circle "2" · "selected" · button "Deactivate" · "×".
- Toolbar: search "571." "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: (header checkbox) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Lo…" (cut off).
- Rows (example data; checkbox at left of each; history icon on rows 1, 2, 3):
  1. "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5" (cut)
  2. "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  3. "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  4. "1893 LIGHT BULB" · "2--571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24"
  5. "1893 LIGHT BULB" · "571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN"
  6. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5"
  7. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  8. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  9. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
- Footer text below the table: "2 records selected."
- Tooltip (dark grey, over row 3 under row 2's description): "Marker Light, 12 Diode LED 2" x 4" Rectangle, Bullseye, Red," (text ends with a comma at the tooltip's edge; any further text is not visible).

No designer annotations on this board.

**3. State:** Rows 1 and 2 ticked (dark checkboxes) with grey row highlight. Header checkbox shows the indeterminate "−" state. Bar shows "2 selected"; "Deactivate" button is now bright blue (enabled). Tooltip covers most of row 3's description. Footer "2 records selected." shown.

**4. Record data shown (example data):** ticked: 571.LD60W20 "Back-Up Light, 20-Diode LED, 6", Oval" and 571.LD26R13 "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..."; other rows as listed.

## 4.4 Confirm — bulk-04-p4-4-confirm.png

**1. Screen:** **"Deactivate parts?"** confirmation dialog over the Inventory list in selection mode (2 ticked). Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page (dimmed):* "Inventory"; "Active" (selected) · "Inactive"; dark bar "2" "selected" "Deactivate" "×"; toolbar "571." "⊗" "Bin Location: All bin locations" "Category: All categories" "Supply" column-picker "⋮" "New Inventory Part"; the same 9 rows as 4.3 (descriptions partly hidden by the dialog, e.g. "Back-Up Light, 20-Diode LED, 6", O…", "Marker Light, 12 Diode LED 2" x 4" …", "1"x4" Rectangular Light Base, 1 Wi…", "19 Series, LED, Amber, 1" 4" Rectan…", "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." "571.LD11R7"); footer "2 records selected."
- Column headers: (header checkbox) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Lo…" (cut off).
- Rows (example data; checkbox at left of each; history icon on rows 1, 2, 3):
  1. "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5" (cut)
  2. "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  3. "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  4. "1893 LIGHT BULB" · "2--571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24"
  5. "1893 LIGHT BULB" · "571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN"
  6. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5"
  7. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  8. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  9. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
- Footer text below the table: "2 records selected."

*Dialog:*
- Title "Deactivate parts?" · close "×".
- "2 parts selected."
- "These parts won't show up when adding parts to work orders, estimates, part sales or purchase orders."
- "Existing records that use them stay as they are."
- "Stock, cost of goods and QuickBooks aren't affected." (lighter grey)
- Text field placeholder "Note (Optional)" (empty).
- Buttons: "Cancel" · red "Deactivate".

No designer annotations on this board.

**3. State:** Rows 1–2 still ticked behind the dialog; header checkbox indeterminate. Red "Deactivate" confirm button; note empty. No tooltip.

**4. Record data shown (example data):** "2 parts selected."; background rows as 4.3.

## 4.5 Done — bulk-05-p4-5-result.png

**1. Screen:** Parts > Inventory list (Active tab), searched "571.", selection mode closed, success toast. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search "571." "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- Rows (history icon on rows 1, 8, 9, 12):
  1. "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5 | 5"
  2. "1893 LIGHT BULB" · "571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN | 6"
  3. "1893 LIGHT BULB" · "2--571.LB1893" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24BIN3 |" (cut)
  4. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5 | 3"
  5. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  6. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  7. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  8. "2-Wire Pigtail, Right Angle PL-10" · "571.PT117" · "94902" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "A3B | 6"
  9. "2.5" Marker Light Grommet, Open Back" · "91400" · "10700" "571.GR101" "571.GR10" · "HD-Lighting & Electric..." · "-" · "Glen Burnie Truck S..." · "PB5 | 3"
  10. "2.5" Marker Light Grommet, Shallow, Closed Ba..." · "571.GR101" · "10704" "91410" "91400" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  11. "2.5" ROUND CENTER SCREW MOUNT REFLEC..." · "571.RF2SMR" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "A4D | 7"
  12. "2.5" Round Reflector, Stick On, Red" · "40072" · "571.RF2QMR" · "HD-Truck Accessories" · "Grote" · "Stillwater Diesel Re..." · "A4D | 4"

*Toast (bottom right, green, check icon):* "2 parts updated." · "Close".

No designer annotations on this board.

**3. State:** Bulk bar gone, checkboxes gone. The two deactivated parts (571.LD60W20 Back-Up Light, 571.LD26R13 Marker Light) no longer appear in the Active list. Row 8 (2-Wire Pigtail) has a light grey (hover) background. Green success toast. Note the two "1893 LIGHT BULB" rows appear in the opposite order to 4.1 (571.LB1893 first here).

**4. Record data shown (example data):** 12 rows above, incl. new rows 571.RF2SMR (A4D 7) and 40072 (manufacturer Grote, vendor Stillwater Diesel Re..., HD-Truck Accessories, A4D 4).

## 4.6 Inactive tab, Activate parts — bulk-06-p4-6-activate-ticked.png

**1. Screen:** Parts > Inventory list, **Inactive** tab, searched "571.", selection mode with both rows ticked. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" · "Inactive" (selected, blue).
- Dark bulk bar: "2" · "selected" · blue button "Activate" · "×".
- Toolbar: search "571." "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: (header checkbox) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Lo…" (cut).
- Rows (both with history icon):
  1. ☑ "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5" (cut)
  2. ☑ "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5" (cut)
- Footer text: "2 records selected."

No designer annotations on this board.

**3. State:** On the Inactive tab the bulk bar's action button reads "Activate" (blue, enabled). Header checkbox fully ticked (all selected, with a grey hover halo). Both rows ticked with grey highlight.

**4. Record data shown (example data):** 571.LD60W20 and 571.LD26R13 (the two parts deactivated in 4.4/4.5).

## 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm.png

**1. Screen:** **"Activate parts?"** confirmation dialog over the Inactive tab in selection mode. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page (dimmed):* "Inventory"; "Active" · "Inactive" (selected); bar "2" "selected" "Activate" "×"; toolbar "571." "⊗" "Bin Location: All bin locations" "Category: All categories" "Supply" column-picker "⋮" "New Inventory Part"; headers (checkbox) "Description" "Part Number" "Tags" "Category" "Manufacturer" "Vendor" "Bin Lo…"; rows ☑ "Back-Up Light, 20-Diode LED, 6", O…" … "HD-Lighting & Electric..." "-" "Meadowbrook Truck..." "PB5" and ☑ "Marker Light, 12 Diode LED 2" x 4" …" … "HD-Lighting & Electric..." "-" "Meadowbrook Truck..." "PB5"; footer "2 records selected."

*Dialog:*
- Title "Activate parts?" · close "×".
- "2 parts selected."
- "These parts can be added to new work again."
- "Existing records that use them stay as they are."
- Text field placeholder "Note (Optional)" (empty).
- Buttons: "Cancel" · blue "Activate".

No designer annotations on this board.

**3. State:** Confirm button "Activate" is solid blue. No "Stock, cost of goods and QuickBooks…" line in this dialog (that line appears only in the Deactivate confirmations). Both rows ticked behind.

**4. Record data shown (example data):** "2 parts selected."; 571.LD60W20, 571.LD26R13 in background.

## 4.8 Branch: the menu while the mode is on — bulk-08-p4-9-menu-in-mode.png

**1. Screen:** Parts > Inventory list (Active tab), searched "571.", selection mode ON with 0 selected, and the "⋮" menu open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Dark bulk bar: "0" · "selected" · "Deactivate" · "×".
- Toolbar: search "571." "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" (highlighted, open) · "New Inventory Part".
- Open menu (single item): "Export".
- Column headers: (header checkbox) · "Description" · "Part Number" · "Tags" · "Category" · "Manufactu…" (partly hidden by menu) · "Vendor" · "Bin Lo…".
- Rows, all unticked (history icon on rows 1, 2, 3, 10): identical to board 4.2 —
  1. "Back-Up Light, 20-Diode LED, 6", Oval" · "571.LD60W20" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  2. "Marker Light, 12 Diode LED 2" x 4" Rectangle, B..." · "571.LD26R13" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  3. "1"x4" Rectangular Light Base, 1 Wire" · "571.MK19B1" · "43850" "19726" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "PB5"
  4. "1893 LIGHT BULB" · "2--571.LB1893" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "ST24"
  5. "1893 LIGHT BULB" · "571.LB1893" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "BBIN"
  6. "19 Series, LED, Amber, 1" 4" Rectangular, 4 Dio..." · "19350Y" · "571.LD191A4" · "HD-Lighting & Electric..." · "-" · "-" · "PB5"
  7. "2-1/2" LED MARKER LIGHT REFLEX (1052, G1..." · "571.LD11R7" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  8. "2-1/2" LED MARKER LIGHT REFLEX (1052A, G..." · "571.LD11A7" · "MCL59AB" "M11256Y" "1052A" "..." · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  9. "2-1/2" REFLEX MARKER LIGHT (10205R, 143R..." · "571.LG11R" · "DO NOT REORDER" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..."
  10. "2-Wire Pigtail, Right Angle PL-10" · "571.PT117" · "94902" · "HD-Lighting & Electric..." · "-" · "Meadowbrook Truck..." · "A3B"

No designer annotations on this board.

**3. State:** While selection mode is on, the "⋮" menu shows ONLY "Export" — "Cycle count" and "Deactivate parts" are absent. Bar "0 selected"; Deactivate button dimmed.

**4. Record data shown (example data):** 10 rows as in 4.2.

## 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png

**1. Screen:** Parts > Inventory list (Active tab, no search term), selection mode with all 630 rows selected; tooltip under the Deactivate button. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Dark bulk bar: "630" · "selected" · "Deactivate" · "×".
- Tooltip (grey, below the Deactivate button): "Select 200 parts or fewer."
- Toolbar: search placeholder "Search" (partly covered by tooltip) · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: (header checkbox, ticked) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Lo…".
- Rows, all ticked (history icon on rows 1–5 and 9):
  1. "3.50-3.82" (89-97mm) SPRING LOADED T-BOL..." · "N68SL-356" · · "HD-Cooling & HVAC" · "-" · "Butautas' Truck & Tr..." · "PB1" (cut)
  2. "#04 BSPP REPLACEMENT O-RING" · "NBOR-04" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · (none)
  3. "(30/30 LONG STROKE SPRING BRAKE CHAMB..." · "4--FLT3030LCB20" · · "HD-Air Brakes & Air S..." · "-" · "Grand Haven Diesel ..." · "ST20"
  4. "(SS HOSE CLAMP (2-1/16" - 3-1/16"), 1/2" WI..." · "4--PET-40" · · "HD-Hose & Fittings" · "-" · "Stillwater Diesel Re..." · "ST20"
  5. "#04 - #12 STEEL NPT JUMP SIZE HYD ADAPT..." · "4--N66-HYD003" · · "HD-Equipment & Hyd..." · "-" · "Butautas' Truck & Tr..." · "ST20"
  6. "#04 NEXUS SAE100R5 3/16" DOT HYDRAULIC..." · "NL245-04" · "1503-4" · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "G2C"
  7. "#06 MALE JIC X 14mm METRIC BANJO" · "N3069-06-14" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1/" (cut)
  8. "#06 MALE ORFS X 3/8" MALE NPT STRAIGHT" · "NFF2404-06-06" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "VID1I" (cut)
  9. "#08 N1 CRIMP COUPLING X #12 FEMALE ORF..." · "N63550-08-12" · · "HD-Hose & Fittings" · "-" · "Butautas' Truck & Tr..." · "SHOF" (cut)
- Footer text: "630 records selected."

No designer annotations on this board.

**3. State:** All rows ticked (header checkbox fully ticked); 630 selected exceeds the 200 cap. The "Deactivate" button appears dimmed (muted blue, greyish text — disabled) and the tooltip "Select 200 parts or fewer." explains why.

**4. Record data shown (example data):** count 630; rows as listed (same parts as the 1.4 list).

## 4.10 Branch: no inactive parts — bulk-10-p4-8-empty-inactive.png

**1. Screen:** Parts > Inventory list, **Inactive** tab, empty, at the Lethbridge location. Location shown: "Staging Lethbridge - 4310". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · location selector "Staging Lethbridge - 4310" · avatar "AS".
- Left sidebar: "SALES & SERVICE" → "Part Sales"; "PARTS" → "Inventory", "Part Library"; "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" · "Inactive" (selected, blue on light-blue highlight).
- Toolbar: "Search" (placeholder, magnifier) · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location /".
- Empty-state text (grey, centred): "No inactive parts at this location."

No designer annotations on this board.

**3. State:** Inactive tab selected, no rows, no search term, no selection bar.

**4. Record data shown (example data):** none (location Staging Lethbridge - 4310).

## 5.1 The Inventory Tracking section — tracking-00-p5-1-tooltip.png

**1. Screen:** **Edit Inventory Part** dialog over the Inventory list (Active tab, searched "573.D430FH-HV"), with the Inventory Tracking info tooltip showing. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "573.D430FH-HV" · (filters hidden behind dialog) · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · ("…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "FLAT HOOK WINCH STRAP HiV…" (cut by dialog) · "…k Accessories" · "-" · "Meadowbrook Truck..." · bin pill "MZH1C | 10" (cut at right edge).

*Dialog:*
- "Edit Inventory Part" · green pill "Active" · "×".
- "Description" "FLAT HOOK WINCH STRAP HiVis 4"".
- "Part Number" "573.D430FH-HV".
- "Part Status" · radio "Active" · radio "Inactive".
- "Vendor" "Meadowbrook Truck & Trailer Repair".
- "Category" "HD-Truck Accessories".
- "Manufacturer" (placeholder).
- "Average Cost" "$ 19.52" · "Sell Price" "$ 37.54" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ.
- Tooltip (dark grey, below the ⓘ, covering the toggle label and the Min field): "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count."
- Toggle (ON; its label hidden under the tooltip).
- "Min" (label and value hidden under the tooltip) · "Max" "0".
- "Tags" (placeholder).
- "Inventory": "Bin Location" "MZH1C" · "Quantity" "10" · "Default".
- "+ Add Bin Location".
- "Delete Part" · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Hovering the ⓘ icon next to "Inventory Tracking" shows the tooltip. Tracking toggle ON (blue). Part Status Active. The Min field's label and value are covered by the tooltip (not readable).

**4. Record data shown (example data):** 573.D430FH-HV "FLAT HOOK WINCH STRAP HiVis 4""; vendor Meadowbrook Truck & Trailer Repair; HD-Truck Accessories; Average Cost $19.52; Sell Price $37.54; Core Charge $0.00; Max 0; bin MZH1C qty 10.

## 5.2 Switch off — tracking-01-p5-2-switch-off.png

**1. Screen:** **Edit Inventory Part** dialog for 573.D430FH-HV with Inventory Tracking switched off. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "573.D430FH-HV" · (filters hidden behind dialog) · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · ("…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "FLAT HOOK WINCH STRAP HiV…" (cut by dialog) · "…k Accessories" · "-" · "Meadowbrook Truck..." · bin pill "MZH1C | 10" (cut at right edge).

*Dialog:*
- "Edit Inventory Part" · green pill "Active" · "×".
- "Description" "FLAT HOOK WINCH STRAP HiVis 4"".
- "Part Number" "573.D430FH-HV".
- "Part Status" · "Active" · "Inactive".
- "Vendor" "Meadowbrook Truck & Trailer Repair".
- "Category" "HD-Truck Accessories".
- "Manufacturer".
- "Average Cost" "$ 19.52" · "Sell Price" "$ 37.54" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle OFF "Track quantities and cost of goods".
- "Tags".
- "Inventory": "Bin Location" "MZH1C" · "Quantity" "10" · "Default".
- "+ Add Bin Location".
- "Delete Part" · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Tracking toggle OFF (grey). Min and Max fields are no longer shown. No warning/confirmation text appears. Inventory bin MZH1C qty 10 still shown. Part Status Active.

**4. Record data shown (example data):** as 5.1.

## 5.3 The list says Not Tracked — tracking-02-p5-3-list-not-tracked.png

**1. Screen:** Parts > Inventory list (Active tab), wide board (2300 px) showing extra columns, searched "573.D430FH-HV". Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search (magnifier) "573.D430FH-HV" with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location / Quantity" · "Total Quantity" · "Average Cost" · "Core" · "Sell Price" · "Min".
- One row: (history icon) "FLAT HOOK WINCH STRAP HiVis 4"" · "573.D430FH-HV" · (no tags) · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · bin pill "MZH1C | 10" · "Not Tracked" (light grey text) · "$19.52" · "$0" · "$37.54" · "0".

No designer annotations on this board.

**3. State:** The Total Quantity cell reads "Not Tracked" in muted grey instead of a number, while the bin pill still shows MZH1C 10. Min shows 0. Search is by part number.

**4. Record data shown (example data):** 573.D430FH-HV "FLAT HOOK WINCH STRAP HiVis 4""; HD-Truck Accessories; Meadowbrook Truck...; MZH1C 10; Average Cost $19.52; Core $0; Sell Price $37.54; Min 0.

## 5.4 Finding untracked parts — tracking-03-p5-6-search-not-tracked.png

**1. Screen:** Parts > Inventory list (Active tab), wide board (2300 px) showing extra columns, searched "not tracked". Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search (magnifier) "not tracked" with clear "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers: "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Vendor" · "Bin Location / Quantity" · "Total Quantity" · "Average Cost" · "Core" · "Sell Price" · "Min".
- One row: (history icon) "FLAT HOOK WINCH STRAP HiVis 4"" · "573.D430FH-HV" · (no tags) · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · bin pill "MZH1C | 10" · "Not Tracked" (light grey text) · "$19.52" · "$0" · "$37.54" · "0".

No designer annotations on this board.

**3. State:** Typing the words "not tracked" into the list search returns the untracked part (the only row). Row otherwise identical to 5.3 ("Not Tracked" in grey under Total Quantity).

**4. Record data shown (example data):** as 5.3.

## 5.5 Part History — tracking-04-p5-4-history.png

**1. Screen:** Part History page for 573.D430FH-HV. Location: "Staging Heavy Duty - 9919". Theme: light. (No left nav sidebar.)

**2. Visible text, verbatim (reading order):**

*App chrome (top bar only):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS".

*Left panel:* "Part details" · "FLAT HOOK WINCH ST.." (blue, truncated) · "Part number" "573.D430FH-HV" · "Category" "HD-Truck Accessories" · "Manufacturer" (no value) · "Measurement" "ea".

*Main area:* "Part History" · "Search" (magnifier). Headers: "Staff" · "Date" · "Time" · "Event". Rows:
  1. "Admin ShopView" · "Oct 2, 2026" · "04:08 PM" · "Tracking turned off"
  2. "Admin ShopView" · "Oct 2, 2026" · "02:03 PM" · "Tracking turned on"
  3. "Admin ShopView" · "Oct 2, 2026" · "02:03 PM" · "Tracking turned off"
  4. "Admin ShopView" · "Oct 2, 2026" · "01:55 PM" · "Tracking turned on"
  5. "Admin ShopView" · "Oct 2, 2026" · "01:55 PM" · "Tracking turned off"
  6. "Admin ShopView" · "Oct 2, 2026" · "01:55 PM" · "Tracking turned on"
  7. "Admin ShopView" · "Oct 2, 2026" · "01:27 PM" · "Manufacturer updated | Original Manufacturer: - | New Manufacturer: -"
  8. "Admin ShopView" · "Oct 2, 2026" · "01:27 PM" · "Tracking turned off"

No designer annotations on this board.

**3. State:** Eight events, newest first; event text bold. Tracking on/off changes logged as separate events. Row 7 is a Manufacturer event whose original and new values are both "-".

**4. Record data shown (example data):** Admin ShopView; Oct 2, 2026; times 04:08 PM, 02:03 PM (×2), 01:55 PM (×3), 01:27 PM (×2); part 573.D430FH-HV; HD-Truck Accessories; ea.

## 5.6 Switch back on — tracking-05-p5-5-switch-back-on.png

**1. Screen:** **Edit Inventory Part** dialog for 573.D430FH-HV with Inventory Tracking switched back on. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Background page:*
- Page title "Inventory"; tabs "Active" (selected, blue) · "Inactive".
- Toolbar: search (magnifier) "573.D430FH-HV" · (filters hidden behind dialog) · "Supply" · column-picker · "⋮" · "New Inventory Part".
- Column headers visible: "Description" · ("…y") · "Manufacturer" · "Vendor" · "Bin Location /".
- One row (example data): (history icon) "FLAT HOOK WINCH STRAP HiV…" (cut by dialog) · "…k Accessories" · "-" · "Meadowbrook Truck..." · bin pill "MZH1C | 10" (cut at right edge).

*Dialog:*
- "Edit Inventory Part" · green pill "Active" · "×".
- "Description" "FLAT HOOK WINCH STRAP HiVis 4"".
- "Part Number" "573.D430FH-HV".
- "Part Status" · "Active" · "Inactive".
- "Vendor" "Meadowbrook Truck & Trailer Repair".
- "Category" "HD-Truck Accessories".
- "Manufacturer".
- "Average Cost" "$ 19.52" · "Sell Price" "$ 37.54" · "Core Charge" "$ 0.00".
- "Inventory Tracking" ⓘ; toggle ON "Track quantities and cost of goods".
- "Min" "0" (focused, with number up/down spinner arrows) · "Max" "0".
- "Tags".
- "Inventory": "Bin Location" "MZH1C" · "Quantity" "10" · "Default".
- "+ Add Bin Location".
- "Delete Part" · "Cancel" · "Save".

No designer annotations on this board.

**3. State:** Tracking toggle ON again; Min and Max fields reappear with values 0 and 0. Min field has dark focus outline and spinner. Part Status Active.

**4. Record data shown (example data):** as 5.1, with Min 0 and Max 0.

## 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count-untracked.png

**1. Screen:** Parts > Inventory list (Active tab) in **cycle count** mode (Count / Adjustment columns, Save/Cancel in toolbar), wide board (2300 × 1100), searched "573.". Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar (left to right): app logo · "ShopHub" (with dropdown chevron) · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted as the current section) · "Reports" · search box placeholder "Search" with key hint "Ctrl+K" · "Clock In" (stopwatch icon) · bell icon with badge "2" · location selector "Staging Heavy Duty - 9919" · avatar "AS".
- Left sidebar: section label "SALES & SERVICE" → "Part Sales"; section label "PARTS" → "Inventory", "Part Library"; section label "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- "Inventory"; tabs "Active" (selected) · "Inactive".
- Toolbar: search (magnifier) "573." with "⊗" · "Bin Location: All bin locations" · "Category: All categories" · "Supply" · printer icon (blue) · button "Save" (pale blue) · button "Cancel" (solid blue) · text "Count changes available: 200".
- Column headers: "Description" · "Part Number" · "Category" · "Manufacturer" · "Vendor" · "Bin Location / Quantity" · "Total Quantity" · "Count" · "Adjustment" (with small up-arrow sort marker) · "Min" · "Max".
- Rows (example data; history icon on rows 5 and 12; each row has Adjustment "-", Min "0", Max "0"):
  1. "1/4" ROPE RING" · "573.M14400RR" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZI1C 9" · orange badge "9 Available" · empty Count box
  2. "12" X 24" ALUMINUM, WHITE" · "573.V1224W-5OE" · "HD-Trailer Comp" · "-" · "-" · "MZI1B 1" · orange "1 Available" · empty Count box
  3. "CARGO BAR HOLDER" · "573.HCBH1" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 1" · orange "1 Available" · Count box
  4. "DELTA RING WINCH STRAP 4"" · "573.D450DR" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 10" · orange "10 Available" · Count box
  5. "DOUBLE L SLIDING WINCH (49207137, 1795)" · "573.FW6" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · (no bin) · green "0 Available" · Count box
  6. "FLAT HOOK WINCH STRAP - HD 4"" · "573.D440FH-HD" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 3" · orange "3 Available" · Count box
  7. "SLIDER WINCH WILSON TRACK (4970610)" · "573.FW7" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 2" · orange "2 Available" · Count box
  8. "SLIP HOOK W/LATCH G70 1/2" (5001923)" · "573.KG712SL" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 1" · orange "1 Available" · Count box
  9. "SLIP HOOK W/LATCH G70 3/8" (5001922, 10116375)" · "573.KG738SL" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · (no bin) · green "0 Available" · Count box
  10. "SLIP HOOK W/LATCH G70 5/16" (5001921, 10116312)" · "573.KG7516SL" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 1" · orange "1 Available" · Count box
  11. "WINCH BAR STANDARD BLACK" · "573.GWB3" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 1" · orange "1 Available" · Count box
  12. "FLAT HOOK WINCH STRAP HiVis 4"" · "573.D430FH-HV" · "HD-Truck Accessories" · "-" · "Meadowbrook Truck..." · "MZH1C 10" · "Not Tracked" (grey text, no badge) · "Not Tracked" (grey text in the Count column, no input box)

No designer annotations on this board.

**3. State:** Cycle count mode on. Save button pale/disabled-looking (no counts entered); Cancel solid blue. Tracked rows show coloured availability badges (orange for non-zero, green for "0 Available") and an empty Count input. The untracked part (row 12, last) shows "Not Tracked" in both Total Quantity and Count, with no input box. Rows 1–11 sorted alphabetically by description; the untracked row sits at the bottom.

**4. Record data shown (example data):** 12 rows listed above (573.* truck-accessory parts; bins MZI1C, MZI1B, MZH1C; vendor Meadowbrook Truck...). Note on legibility: in "573.V1224W-5OE" the character after "5" is rendered as a round glyph that appears to be the letter "O"; at this resolution it cannot be distinguished with certainty from the digit "0".

## 6.1 While active: GREASETUBE is found — daily-01-p6-3a-lookup-active.png

**1. Screen:** Work order S2-9647 (Lines tab) with the **New Part Request** dialog open; the Part Number lookup is showing results. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" (highlighted as current section) · "Schedule" · "Customers" · "Parts" · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · "Staging Heavy Duty - 9919" · avatar "AS". (No Parts sidebar on this page.)

*Background work order page (dimmed):*
- Left panel, work order card: "S2-9647" · pills "Estimate" (blue outline) · "Over Limit" (red outline) · "Started: Aug 28, 2025" (green map-pin icon at right) · "Total Hours: 25.0 hrs" · "Progress" "0%" (empty progress bar) · "Lead Technician" "Cameron Johnston" · "Service Advisor" "Unassigned" · "Sales Representative" "Unassigned".
- Left panel, customer card: "Colesville Diesel Repair" · pin icon "Pinned Notes:" · "Quis tempore molestiae neque velit dolorum aliquam. Repudiandae adipisci cum nulla inventore ut." · "Contact" "Bill Fleming" · "Phone" "289-319-1746" · "Title" "AP" · "Authorizer" "None" · "IBS#" "838930".
- Left panel, unit card: "2023 Ford F-750 795" (blue) · "Engine" "6.7".
- Tabs: "Lines (3)" (selected, blue) · "Parts (6)" · "Notes" · "Stats" · "Finance" · "AI" badge + "SHOPCOACH ANALYSIS" · "⋮" · blue button "New Line".
- Lines table headers: (checkbox) · (collapse caret) · "Name/Description" · "Actual/Estimate" · "Progress" · "Status" · "Action" · "Rate" · "Margin" · "Total".
- Line 1: "1" · "Repair - Top right side front of box" · "Corner bent in underneath upper light. Can see into box." · "0.00 / 3.00" · status pill "Needs Approval" · green "Approve" · red "Decline" · "$149.95" · "100%" · "$449.85"; sub-row "Labor" "Unassigned" … "$449.85"; sub-row "Parts" "+ Add Pa…" (cut by dialog); an inline part-entry row (partly hidden) with "Descriptio…" field, hint "Enter" "save…", "$ Sell price *", buttons "More options" · "Save" (blue) · "×".
- Line 2: "2" · "Replace - F…" (cut) · "Multiple cra…" (cut) · status "…pproval" (cut) · "Approve" · "Decline" · "$149.95" · "100%" · "$3358.04"; "Labor" "David Comb…" (cut) … "$2999"; "Parts" "+ Add Pa…"; part rows "(WS2) WEL…" (status "…sted") "$70.88" "100%" "$70.88"; "(SQT2x4x1/…" ("…ed") "$13.62" "45%" "$108.96"; "(SQT2x2x1/…" ("…ed") "$7.14" "50%" "$57.12"; "(CPS1/8) C…" ("…ed") "$15.26" "49%" "$122.08".
- Line 3: "3" · "Replace - S…" (cut) · "Excessive pl…" (cut) · status "…pproval" · "Approve" · "Decline" · "$149.95" · "100%" · "$299.9"; "Labor" "Unassigned" … "$299.9"; "Parts" "+ Add Pa…"; part rows "(-) U joint" · "1" · pill "Requested" · "$0.00" · "100%" · "-"; "(-) U-Joint Strap Kit (If Required)" · "1" · "Requested" · "$0.00" · "100%" · "-".
- Below: "AI" badge + "SHOPCOACH LINE BUILDER" · input placeholder "e.g. Dot Inspection, Oil Change, Check Engine Light" · dark button "Build Lines".

*Dialog:*
- Title "New Part Request" · close "×" (blue).
- Combobox "Part Number" (floating label, blue underline, up-caret) value "GREASETU".
- Results dropdown:
  - Result 1: "EP2 Grease Tube, 390G" · right "GREASETUBE" · "Inventory Qty: 78 ea" · bin pill "E1C | 78".
  - Result 2: "EP2 Grease Tube, 390G" · right "GREASETUBE" · "Part Library" · bin pill "E1C | 78".
- (Fields below the dropdown) "Cost" · "Core Charge" · "Sell Price" "$ 0.00" · "Margin".
- "AI" badge + "SHOPCOACH PARTS GUIDE" (link).
- Button "Save Part" (blue).

No designer annotations on this board.

**3. State:** Typing "GREASETU" offers the active part GREASETUBE twice: once from inventory (with "Inventory Qty: 78 ea") and once from the "Part Library", both showing E1C 78. Dropdown covers the fields between Part Number and Cost.

**4. Record data shown (example data):** GREASETUBE "EP2 Grease Tube, 390G", qty 78 ea, bin E1C 78; work order S2-9647, customer Colesville Diesel Repair, unit 2023 Ford F-750 795, contact Bill Fleming, phone 289-319-1746, IBS# 838930, Lead Technician Cameron Johnston, line amounts as listed.

## 6.2 Once inactive: not offered — daily-02-p6-3-lookup-no-inactive.png

**1. Screen:** Work order S2-9647 with the **New Part Request** dialog open; the same lookup now returns nothing. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" (highlighted as current section) · "Schedule" · "Customers" · "Parts" · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · "Staging Heavy Duty - 9919" · avatar "AS". (No Parts sidebar on this page.)

*Background work order page (dimmed):*
- Left panel, work order card: "S2-9647" · pills "Estimate" (blue outline) · "Over Limit" (red outline) · "Started: Aug 28, 2025" (green map-pin icon at right) · "Total Hours: 25.0 hrs" · "Progress" "0%" (empty progress bar) · "Lead Technician" "Cameron Johnston" · "Service Advisor" "Unassigned" · "Sales Representative" "Unassigned".
- Left panel, customer card: "Colesville Diesel Repair" · pin icon "Pinned Notes:" · "Quis tempore molestiae neque velit dolorum aliquam. Repudiandae adipisci cum nulla inventore ut." · "Contact" "Bill Fleming" · "Phone" "289-319-1746" · "Title" "AP" · "Authorizer" "None" · "IBS#" "838930".
- Left panel, unit card: "2023 Ford F-750 795" (blue) · "Engine" "6.7".
- Tabs: "Lines (3)" (selected, blue) · "Parts (6)" · "Notes" · "Stats" · "Finance" · "AI" badge + "SHOPCOACH ANALYSIS" · "⋮" · blue button "New Line".
- Lines table headers: (checkbox) · (collapse caret) · "Name/Description" · "Actual/Estimate" · "Progress" · "Status" · "Action" · "Rate" · "Margin" · "Total".
- Line 1: "1" · "Repair - Top right side front of box" · "Corner bent in underneath upper light. Can see into box." · "0.00 / 3.00" · status pill "Needs Approval" · green "Approve" · red "Decline" · "$149.95" · "100%" · "$449.85"; sub-row "Labor" "Unassigned" … "$449.85"; sub-row "Parts" "+ Add Pa…" (cut by dialog); an inline part-entry row (partly hidden) with "Descriptio…" field, hint "Enter" "save…", "$ Sell price *", buttons "More options" · "Save" (blue) · "×".
- Line 2: "2" · "Replace - F…" (cut) · "Multiple cra…" (cut) · status "…pproval" (cut) · "Approve" · "Decline" · "$149.95" · "100%" · "$3358.04"; "Labor" "David Comb…" (cut) … "$2999"; "Parts" "+ Add Pa…"; part rows "(WS2) WEL…" (status "…sted") "$70.88" "100%" "$70.88"; "(SQT2x4x1/…" ("…ed") "$13.62" "45%" "$108.96"; "(SQT2x2x1/…" ("…ed") "$7.14" "50%" "$57.12"; "(CPS1/8) C…" ("…ed") "$15.26" "49%" "$122.08".
- Line 3: "3" · "Replace - S…" (cut) · "Excessive pl…" (cut) · status "…pproval" · "Approve" · "Decline" · "$149.95" · "100%" · "$299.9"; "Labor" "Unassigned" … "$299.9"; "Parts" "+ Add Pa…"; part rows "(-) U joint" · "1" · pill "Requested" · "$0.00" · "100%" · "-"; "(-) U-Joint Strap Kit (If Required)" · "1" · "Requested" · "$0.00" · "100%" · "-".
- Below: "AI" badge + "SHOPCOACH LINE BUILDER" · input placeholder "e.g. Dot Inspection, Oil Change, Check Engine Light" · dark button "Build Lines".

*Dialog:*
- "New Part Request" · "×".
- "Part Number" value "GREASETU" (dropdown open).
- Dropdown text: "No results".
- "Source" value "Vendor" (dropdown).
- "Category" (dropdown placeholder).
- "Vendor" (dropdown placeholder).
- "Cost" · "Core Charge" · "Sell Price" "$ 0.00" · "Margin".
- "AI" "SHOPCOACH PARTS GUIDE".
- "Save Part".

No designer annotations on this board.

**3. State:** After GREASETUBE is made inactive, typing "GREASETU" shows "No results" — neither the inventory entry nor the Part Library entry is offered. Dialog field order visible: Part Number, (area between Part Number and Source hidden by the dropdown), Source, Category, Vendor, Cost / Core Charge / Sell Price / Margin.

**4. Record data shown (example data):** search text GREASETU; Source Vendor; Sell Price $0.00; background work order as 6.1.

## 6.3 Typing the retired number in full — daily-03-p6-7-special-order-blocked.png

**1. Screen:** Work order S2-9647 with the **New Part Request** dialog open; the full retired part number typed in lower case. Location: "Staging Heavy Duty - 9919". Theme: light. Board height 900 px (the unit card at bottom-left is cut off).

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" (highlighted as current section) · "Schedule" · "Customers" · "Parts" · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · "Staging Heavy Duty - 9919" · avatar "AS". (No Parts sidebar on this page.)

*Background work order page (dimmed):* same work order as 6.1 with these visible differences: the dialog sits higher, so line 1 shows "Repair - To…" / "Corner bent…" and status "…proval" (cut); line 3 shows "Labor" "Unassigned" with a "⋮" icon and "Parts" "+ Add Part" in full; the board ends below "SHOPCOACH LINE BUILDER" (the input, "Build Lines" button and the "2023 Ford F-750 795" card are not visible).
- Left panel, work order card: "S2-9647" · pills "Estimate" (blue outline) · "Over Limit" (red outline) · "Started: Aug 28, 2025" (green map-pin icon at right) · "Total Hours: 25.0 hrs" · "Progress" "0%" (empty progress bar) · "Lead Technician" "Cameron Johnston" · "Service Advisor" "Unassigned" · "Sales Representative" "Unassigned".
- Left panel, customer card: "Colesville Diesel Repair" · pin icon "Pinned Notes:" · "Quis tempore molestiae neque velit dolorum aliquam. Repudiandae adipisci cum nulla inventore ut." · "Contact" "Bill Fleming" · "Phone" "289-319-1746" · "Title" "AP" · "Authorizer" "None" · "IBS#" "838930".
- Left panel, unit card: "2023 Ford F-750 795" (blue) · "Engine" "6.7".
- Tabs: "Lines (3)" (selected, blue) · "Parts (6)" · "Notes" · "Stats" · "Finance" · "AI" badge + "SHOPCOACH ANALYSIS" · "⋮" · blue button "New Line".
- Lines table headers: (checkbox) · (collapse caret) · "Name/Description" · "Actual/Estimate" · "Progress" · "Status" · "Action" · "Rate" · "Margin" · "Total".
- Line 1: "1" · "Repair - Top right side front of box" · "Corner bent in underneath upper light. Can see into box." · "0.00 / 3.00" · status pill "Needs Approval" · green "Approve" · red "Decline" · "$149.95" · "100%" · "$449.85"; sub-row "Labor" "Unassigned" … "$449.85"; sub-row "Parts" "+ Add Pa…" (cut by dialog); an inline part-entry row (partly hidden) with "Descriptio…" field, hint "Enter" "save…", "$ Sell price *", buttons "More options" · "Save" (blue) · "×".
- Line 2: "2" · "Replace - F…" (cut) · "Multiple cra…" (cut) · status "…pproval" (cut) · "Approve" · "Decline" · "$149.95" · "100%" · "$3358.04"; "Labor" "David Comb…" (cut) … "$2999"; "Parts" "+ Add Pa…"; part rows "(WS2) WEL…" (status "…sted") "$70.88" "100%" "$70.88"; "(SQT2x4x1/…" ("…ed") "$13.62" "45%" "$108.96"; "(SQT2x2x1/…" ("…ed") "$7.14" "50%" "$57.12"; "(CPS1/8) C…" ("…ed") "$15.26" "49%" "$122.08".
- Line 3: "3" · "Replace - S…" (cut) · "Excessive pl…" (cut) · status "…pproval" · "Approve" · "Decline" · "$149.95" · "100%" · "$299.9"; "Labor" "Unassigned" … "$299.9"; "Parts" "+ Add Pa…"; part rows "(-) U joint" · "1" · pill "Requested" · "$0.00" · "100%" · "-"; "(-) U-Joint Strap Kit (If Required)" · "1" · "Requested" · "$0.00" · "100%" · "-".
- Below: "AI" badge + "SHOPCOACH LINE BUILDER" · input placeholder "e.g. Dot Inspection, Oil Change, Check Engine Light" · dark button "Build Lines".

*Dialog:*
- "New Part Request" · "×".
- "Part Number" value "greasetube" (dropdown open).
- Dropdown message: "GREASETUBE is inactive. Activate it from the Inactive tab to use it."
- "Source" value "Vendor".
- "Category" (placeholder).
- "Vendor" (placeholder).
- "Cost" · "Core Charge" · "Sell Price" "$ 0.00" · "Margin".
- "AI" "SHOPCOACH PARTS GUIDE".
- "Save Part".

No designer annotations on this board.

**3. State:** Typing the exact number (in lower case "greasetube") shows an inline message naming the part in upper case "GREASETUBE" and pointing to the Inactive tab; no result is offered to pick. Save Part still shown as blue.

**4. Record data shown (example data):** part number GREASETUBE; background work order S2-9647 as 6.1.

## 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.png

**1. Screen:** Work order S2-9647 with the **New Line** dialog open; the Title lookup is offering a canned job. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" (highlighted as current section) · "Schedule" · "Customers" · "Parts" · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · "Staging Heavy Duty - 9919" · avatar "AS". (No Parts sidebar on this page.)

*Background work order page (dimmed):*
- Left panel: "S2-9647" · "Estimate" · "Over Limit" · "Started: Aug 28, 2025" · "Total Hours: 23.0 hrs" · "Progress" "0%" · "Lead Technician" "Cameron Johnston" · "Service Advisor" "Unassigned" · "Sales Representative" "Unassigned"; "Colesville Diesel Repair" · "Pinned Notes:" · "Quis tempore molestiae neque velit dolorum aliquam. Repudiandae adipisci cum nulla inventore ut." · "Contact" "Bill Fleming" · "Phone" "289-319-1746" · "Title" "AP" · "Authorizer" "None" · "IBS#" "838930"; "2023 Ford F-750 795" · "Engine" "6.7".
- Tabs: "Lines (2)" (selected) · "Parts (4)" · "Notes" · "Stats" · "Finance" · "AI" "SHOPCOACH ANALYSIS" · "⋮" · "New Line".
- Headers: "Name/Description" · "Actual/Estimate" · "Progress" · "Status" · "Action" · "Rate" · "Margin" · "Total".
- Line 1: "1" "Repair - Top right side front of box" · "Corner bent in underneath upper light. Can see into box." · "0.00 / 3.00" · "Needs Approval" · "Approve" · "Decline" · "$149.95" · "100%" · "$449.85"; "Labor" "Unassigned" … "$449.85"; "Parts" "+ Add Pa…".
- Line 2: "2" "Replace - F…" · "Multiple cra…" · "…pproval" · "Approve" · "Decline" · "$149.95" · "100%" · "$3358.04"; "Labor" "David Comb…" … "$2999"; "Parts" "+ Add Pa…"; "(WS2) WEL…" "…sted" "$70.88" "100%" "$70.88"; "(SQT2x4x1/…" "…ed" "$13.62" "45%" "$108.96"; "(SQT2x2x1/…" "…ed" "$7.14" "50%" "$57.12"; "(CPS1/8) C…" "…ed" "$15.26" "49%" "$122.08".
- "AI" "SHOPCOACH LINE BUILDER" · input "e.g. Dot Inspection, Oil C…" (cut) · "Build Lines".

*Dialog:*
- Title "New Line" · "AI" badge + "SHOPCOACH LINE BUILDER" · close "×".
- Combobox "Title" (floating label) value "Steering shaft" (open, up-caret).
- Suggestion: "Replace - Steering shaft u joints" · "HD Fleet Rate : $299.90" · right "Total Parts: 3".
- "Technicians" · chip "Cameron Johnston ×".
- Dropdown placeholder "Add Technician".
- "Labor Rate" (dropdown, empty) · "Estimated Time" "0" · "Tech Time" "0".
- Checkbox "Line Approved".
- Buttons: "Save & Add Part" (outlined) · "Save & Add Line" (outlined) · "Save & Close" (blue).

No designer annotations on this board.

**3. State:** Work order now has 2 lines / 4 parts (line 3 from earlier boards is not present). Title lookup open with one canned-job suggestion holding 3 parts. "Line Approved" unticked. Cameron Johnston pre-added as technician.

**4. Record data shown (example data):** canned job "Replace - Steering shaft u joints", HD Fleet Rate $299.90, Total Parts 3; technician Cameron Johnston; work order S2-9647, Total Hours 23.0 hrs.

## 6.5 The canned job leaves it out — daily-05-p6-2-canned-warning.png

**1. Screen:** Work order S2-9647, Lines tab, no dialog, after adding the canned job; orange warning toast at bottom right. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:*
- Top navigation bar: app logo · "ShopHub" (chevron) · "Work Orders" (highlighted as current section) · "Schedule" · "Customers" · "Parts" · "Reports" · search "Search" "Ctrl+K" · "Clock In" · bell badge "2" · "Staging Heavy Duty - 9919" · avatar "AS". (No Parts sidebar on this page.)

*Page (not dimmed):*
- Left panel: "S2-9647" · "Estimate" · "Over Limit" · "Started: Aug 28, 2025" · "Total Hours: 25.0 hrs" · "Progress" "0%" · "Lead Technician" "Cameron Johnston" · "Service Advisor" "Unassigned" · "Sales Representative" "Unassigned"; "Colesville Diesel Repair" · "Pinned Notes:" · "Quis tempore molestiae neque velit dolorum aliquam. Repudiandae adipisci cum nulla inventore ut." · "Contact" "Bill Fleming" · "Phone" "289-319-1746" · "Title" "AP" · "Authorizer" "None" · "IBS#" "838930"; "2023 Ford F-750 795" · "Engine" "6.7".
- Tabs: "Lines (3)" (selected) · "Parts (6)" · "Notes" · "Stats" · "Finance" · "AI" "SHOPCOACH ANALYSIS" · "⋮" · "New Line".
- Headers: (checkbox) · (caret) · "Name/Description" · "Actual/Estimate" · "Progress" · "Status" · "Action" · "Rate" · "Margin" · "Total".
- Line 1: "1" · "Repair - Top right side front of box" · "Corner bent in underneath upper light. Can see into box." · "0.00 / 3.00" · "Needs Approval" · "Approve" · "Decline" · "$149.95" · "100%" · "$449.85"; "Labor" "Unassigned" "⋮" … "$449.85"; "Parts" "+ Add Part".
- Line 2: "2" · "Replace - Rear bumper step / rear metal floor" · "Multiple cracks in Step, Crossmember cracked and rusted through." · "0.00 / 20.00" · "Needs Approval" · "Approve" · "Decline" · "$149.95" · "100%" · "$3358.04"; "Labor" "David Combs" "⋮" … "$2999"; "Parts" "+ Add Part"; parts:
  - "(WS2) WELDING SUPPLIES" · "1" · pill "Requested" · "$70.88" · "100%" · "$70.88"
  - "(SQT2x4x1/8) Steel Square Tube, 2"x4"x1/8"" · "8" · pill "Quoted" · "$13.62" · "45%" · "$108.96"
  - "(SQT2x2x1/8) Steel Square Tube, 2"x2"x1/8"" · "8" · "Quoted" · "$7.14" · "50%" · "$57.12"
  - "(CPS1/8) Check Plate, Steel, 1/8"" · "8" · "Quoted" · "$15.26" · "49%" · "$122.08"
- Line 3 (new; checkbox, caret and "⋮" in place of a number): "Replace - Steering shaft u joints" · "Excessive play / Worn" · "0.00 / 2.00" · "Needs Approval" · "Approve" · "Decline" · "$149.95" · "100%" · "$299.9"; "Labor" "Unassigned" "⋮" … "$299.9"; "Parts" "+ Add Part"; parts (light yellow rows):
  - "(-) U joint" · "1" · "Requested" · "$0.00" · "100%" · "-"
  - "(-) U-Joint Strap Kit (If Required)" · "1" · "Requested" · "$0.00" · "100%" · "-"
- "AI" "SHOPCOACH LINE BUILDER" · input placeholder "e.g. Dot Inspection, Oil Change, Check Engine Light" · "Build Lines".

*Toast (bottom right, orange, "!" icon):* "GREASETUBE is inactive and was not added." · "Close".

No designer annotations on this board.

**3. State:** The canned job (offered in 6.4 with "Total Parts: 3") was added as line 3 with only two parts; the inactive GREASETUBE was skipped and an orange (warning) toast says so. Line 3 parts highlighted light yellow. Status pills: "Needs Approval" (orange outline), "Requested" (orange outline), "Quoted" (blue outline).

**4. Record data shown (example data):** work order S2-9647 (Lines 3, Parts 6, Total Hours 25.0 hrs); lines/parts and amounts as listed; technician David Combs; part GREASETUBE.

## 6.6 Vendor return: still offered, tagged — daily-06-p6-4-return-tag.png

**1. Screen:** **Create Return** page (Parts > Returns), with the Part Number lookup open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome (top bar):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS". (No left nav sidebar.)

*Left summary card:* "Create Return" · "Vendor" "N/A" · "Packaging Slip" "N/A".

*Main:*
- Title "Create Return" · dropdown placeholder "Vendor" (grey) · field placeholder "Packaging Slip".
- Column headers: "Part Number" · "Description" · "Bin Location" · "Qty In Stock" · "Qty To Return" · "Price Per Unit" · "Restocking Fee" · "Total".
- Entry row: combobox "Part Number" value "N79L-063" (open) · field placeholder "Description" · "—" · "—" · "Quantity" "1" · placeholder "Price Per Unit" · placeholder "Restocking F…" · "$0.00".
- Lookup results:
  - "CUSHIONED TUBE SUPPORT" · right "N79L-063" · "Inventory Qty: 0 EA" · pill "Unassigned | 0".
  - "CUSHIONED TUBE SUPPORT (0.38" SCREW HO..." · grey pill "Inactive" · right "N79L-063" · "Inventory Qty: 4 EA" · pill "A2CA | 4".
- Totals: "Total restocking fee:" "$0.00" · "Total:" "$0.00".
- Button "Save Return" (blue).

No designer annotations on this board.

**3. State:** In a vendor return the inactive part IS still offered, marked with a grey "Inactive" pill next to its description. Two parts share number N79L-063 (one active with 0 EA unassigned, one inactive with 4 EA in A2CA).

**4. Record data shown (example data):** N79L-063 "CUSHIONED TUBE SUPPORT" (0 EA, Unassigned 0); N79L-063 "CUSHIONED TUBE SUPPORT (0.38" SCREW HO..." (Inactive, 4 EA, A2CA 4); quantity 1; totals $0.00.

## 6.7 Part sale credit: still offered, tagged — daily-07-p6-6-credit-tag.png

**1. Screen:** Part sale **P2-89** (Finance tab, invoice view) with the **Issue Credit** dialog open. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome (top bar):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS".

*Background (dimmed):*
- Left card: "P2-89" · pills "Paid" (green outline) · "Over Limit" (red outline) · "Started: May 15, 2026" · "Sales representative" "Unassigned".
- Tabs: "Parts (2)" · "Notes" · "Stats" · "Finance" (selected, blue) · field placeholder "Customer PO" · icons download, email, print, settings, "⋮".
- Invoice header: "Heavy Duty - 9919" · (dark logo bar) · "Invoice:".
- Below the dialog: left "Not Available" (blue text); invoice line (top half hidden by the dialog) "CUSHIONED TUBE SUPPORT (0.38" SCREW HOLE) FOR 5/8" (16mm)OD" · "1" · "$1.25" · "$1.25"; "SUMMARY"; terms text "Any warranties on the parts and accessories sold hereby are made by the manufacturer. You understand and agree that we make no warranties of any kind unless expressed in writing. You hereby authorize us to perform the repair work herein set forth and to purchase the necessary material and parts to perform such repair work. You agree that we are not…" (cut off at board edge); summary "Parts" "$88.67" · "Subtotal" "$88.67" · "GST (5%)" "$4.43" · "Total" "$93.10".
- Left "Financial Info": headers "Item" · "Cost"; "Parts" "$88.67" · "Subtotal" "$88.67" · "GST" "$4.43".

*Dialog:*
- Title "Issue Credit" · close "×" (blue).
- Left column: date field (calendar icon) "Credit Date" "10/02/2026" · checkbox "Parts are being returned" · label "Outcome" · radio "Issue Store Credit" · radio "Issue Refund" · dropdown placeholder "Payment Method" · text area placeholder "Reason".
- Right column: "Parts to return"; table headers (header checkbox) "Part Number" · "Description" · "Sell Price" · "Qty Available For Credit" · "Q…" (cut off at right edge).
  - ☑ "GN10638" · "Ignition Coil" · "$87.42" · "1" · (quantity input, cut off)
  - ☑ "N79L-063" · grey pill "Inactive" · "CUSHIONED TUBE SUPPORT (0.38" SCREW HOLE) FOR 5/8" (16mm)OD" · "$1.25" · "1" · (quantity input, cut off)
  - "Subtotal:$88.67" · "Tax:  $4.43" · "Total:$93.10".
- Buttons: "Cancel" (grey) · "Issue Refund" (pale blue).

No designer annotations on this board.

**3. State:** "Parts are being returned" ticked; Outcome "Issue Refund" selected. Both part rows ticked (header ticked). The inactive part is still listed for credit with a grey "Inactive" pill after its part number. "Issue Refund" button appears pale (disabled-looking); Payment Method is empty. Last table column header and quantity inputs are cut off at the dialog's right edge.

**4. Record data shown (example data):** part sale P2-89, Paid, started May 15, 2026; credit date 10/02/2026; GN10638 Ignition Coil $87.42 qty 1; N79L-063 CUSHIONED TUBE SUPPORT (0.38" SCREW HOLE) FOR 5/8" (16mm)OD $1.25 qty 1; Subtotal $88.67, Tax $4.43, Total $93.10; GST (5%).

## 7.1 Part Library — library-01-p7-1-library.png

**1. Screen:** Parts > **Part Library** list page. Location: "Staging Heavy Duty - 9919". Theme: light.

**2. Visible text, verbatim (reading order):**

*App chrome:* top bar as on other Parts pages (logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS"); left sidebar "SALES & SERVICE" → "Part Sales"; "PARTS" → "Inventory", "Part Library" (selected, blue); "SUPPLY CHAIN" → "Returns", "Purchase Orders", "Vendor Invoices", "Vendors".

*Page:*
- Title "Part Library" · "Search" (magnifier) · "Manufacturer: All manufacturers" (person icon, chevron) · "Category: All categories" (chevron).
- Column headers: (select-all checkbox) · (blue "⋮" icon) · "Description" · "Part Number" · "Tags" · "Category" · "Manufacturer" · "Measurement" · "Size".
- Rows (each with an unticked checkbox; Manufacturer and Size cells empty):
  1. "Reverse Switch" · "21-361" · · "HD-Lighting & Electric..." · · "-"
  2. "Slack Adjuster" · "F40010212" · · "HD-Air Brakes & Air S..." · · "-"
  3. "drivers seatbelt buckle" · "3711355C93" · · "HD-Body Interior" · · "-"
  4. "PUSH PULL VALVE, 4 WAY" · "170.V8AP" · · "HD-Air Brakes & Air S..." · · "ea"
  5. "Fiberglass Repair Kit" · "100637" · · "Uncategorized" · · "-"
  6. "Reinforcement Strap" · "08-02564" · · "HD-Heavy Duty Brake..." · · "-"
  7. "20mm Gr8 Blk Crs Nut" · "ZHNM8BC-20" · · "Uncategorized" · · "-"
  8. "DOUBLE ENDED STUD" · "201.7003R" · tags "M50" "R005559R" "W40" "..." · "HD-Wheel Comp" · · "ea"
  9. "10JIC F 90DEG #10 HOSE FTG" · "RR5-10FJB10" · · "HD-Hose & Fittings" · · "-"
  10. "Oxford White Paint" · "GLOB-STAR GALL" · · "Uncategorized" · · "-"
  11. "Engine Oil Filter, Cummins 6BT" · "LF3349" · tags "P558615" "51607" "UPGRA..." "..." · "HD-Filters" · · "ea"
  12. "Wiper Motor" · "WM*854" · · "Uncategorized" · · "-"

No designer annotations on this board.

**3. State:** Part Library selected in sidebar. No rows ticked. No status column / Active-Inactive tabs on this page. Row 2 is the Library entry "Slack Adjuster" F40010212 referred to by the 1.4 toast.

**4. Record data shown (example data):** the 12 Library entries above.

## 7.2 An entry opens its detail page — library-02-p7-2-entry-detail.png

**1. Screen:** Part Library entry detail page for "Slack Adjuster" (F40010212). Location: "Staging Heavy Duty - 9919". Theme: light. (No left nav sidebar.)

**2. Visible text, verbatim (reading order):**

*App chrome (top bar):* logo · "ShopHub" · "Work Orders" · "Schedule" · "Customers" · "Parts" (highlighted) · "Reports" · "Search" "Ctrl+K" · "Clock In" · bell "2" · "Staging Heavy Duty - 9919" · "AS".

*Left panel:* "Part details" · "Slack Adjuster" (with blue edit-list icon at right) · "Part number" "F40010212" · "Category" "HD-Air Brakes & Air Suspension" · "Manufacturer" (no value) · "Measurement" (no value) · "Total parts" "1".

*Main:*
- Title "Parts".
- Column headers: (expand caret) · "Workplace" · "Bin location" · "Average cost" · "Sell price" · "Core charge" · "Remaining Quantity" · "Min" · "Max".
- One row: (caret) · "Staging Lethbridge ..." · "-" · "$62.40" · "$111.43" · "-" · "4.00" · "-" · "-".

No designer annotations on this board.

**3. State:** One workplace row (collapsed caret). "Total parts" 1. Only the Lethbridge workplace is listed for this entry.

**4. Record data shown (example data):** Slack Adjuster F40010212; HD-Air Brakes & Air Suspension; workplace Staging Lethbridge ...; Average cost $62.40; Sell price $111.43; Remaining Quantity 4.00.

## Coverage

| # | PNG file | Bytes | Read | Distinct text items transcribed |
|---|---|---|---|---|
| 1 | create-01-p1-1-new-empty.png | 179509 | read: yes | 94 |
| 2 | create-02-p1-2-required.png | 185078 | read: yes | 98 |
| 3 | create-03-p1-3-filled.png | 185399 | read: yes | 98 |
| 4 | create-04-p1-4-linked-toast.png | 195569 | read: yes | 98 |
| 5 | create-05-p1-5-duplicate-refused.png | 195774 | read: yes | 101 |
| 6 | create-06-p1-6-untracked.png | 182551 | read: yes | 94 |
| 7 | correct-01-p2-1-edit-open.png | 107885 | read: yes | 73 |
| 8 | correct-02-p2-2-warnings.png | 115111 | read: yes | 75 |
| 9 | correct-03-p2-3-list-after.png | 67711 | read: yes | 47 |
| 10 | correct-04-p2-4-history-here.png | 96926 | read: yes | 35 |
| 11 | correct-05-p2-5-list-other-location.png | 66060 | read: yes | 46 |
| 12 | correct-06-p2-6-history-other-location.png | 112449 | read: yes | 35 |
| 13 | retire-01-p3-1-dialog-active.png | 107158 | read: yes | 67 |
| 14 | retire-02-p3-2-picked-inactive.png | 107692 | read: yes | 67 |
| 15 | retire-03-p3-3-confirm.png | 119266 | read: yes | 71 |
| 16 | retire-04-p3-4-toast.png | 70563 | read: yes | 42 |
| 17 | retire-05-p3-5-inactive-tab.png | 67801 | read: yes | 43 |
| 18 | retire-06-p3-6-dialog-inactive.png | 107126 | read: yes | 67 |
| 19 | retire-07-p3-7-activate-confirm.png | 107130 | read: yes | 67 |
| 20 | retire-08-p3-8-history-search.png | 92623 | read: yes | 37 |
| 21 | bulk-01-p4-1-actions-menu.png | 156112 | read: yes | 88 |
| 22 | bulk-02-p4-2-mode-on.png | 136919 | read: yes | 77 |
| 23 | bulk-03-p4-3-ticked.png | 133113 | read: yes | 74 |
| 24 | bulk-04-p4-4-confirm.png | 146744 | read: yes | 82 |
| 25 | bulk-05-p4-5-result.png | 156667 | read: yes | 87 |
| 26 | bulk-06-p4-6-activate-ticked.png | 80273 | read: yes | 51 |
| 27 | bulk-07-p4-7-activate-confirm.png | 92428 | read: yes | 55 |
| 28 | bulk-08-p4-9-menu-in-mode.png | 138325 | read: yes | 78 |
| 29 | bulk-09-p4-10-cap.png | 139036 | read: yes | 76 |
| 30 | bulk-10-p4-8-empty-inactive.png | 58468 | read: yes | 37 |
| 31 | tracking-00-p5-1-tooltip.png | 110180 | read: yes | 66 |
| 32 | tracking-01-p5-2-switch-off.png | 105670 | read: yes | 63 |
| 33 | tracking-02-p5-3-list-not-tracked.png | 73398 | read: yes | 52 |
| 34 | tracking-03-p5-6-search-not-tracked.png | 72764 | read: yes | 53 |
| 35 | tracking-04-p5-4-history.png | 87055 | read: yes | 35 |
| 36 | tracking-05-p5-5-switch-back-on.png | 107099 | read: yes | 66 |
| 37 | tracking-06-p5-7-cycle-count-untracked.png | 167181 | read: yes | 83 |
| 38 | daily-01-p6-3a-lookup-active.png | 190045 | read: yes | 123 |
| 39 | daily-02-p6-3-lookup-no-inactive.png | 180741 | read: yes | 122 |
| 40 | daily-03-p6-7-special-order-blocked.png | 172428 | read: yes | 126 |
| 41 | daily-04-p6-1-canned-pick.png | 157153 | read: yes | 109 |
| 42 | daily-05-p6-2-canned-warning.png | 179236 | read: yes | 102 |
| 43 | daily-06-p6-4-return-tag.png | 75163 | read: yes | 40 |
| 44 | daily-07-p6-6-credit-tag.png | 132194 | read: yes | 68 |
| 45 | library-01-p7-1-library.png | 105010 | read: yes | 73 |
| 46 | library-02-p7-2-entry-detail.png | 46672 | read: yes | 35 |

Distinct text items = machine count of distinct quoted strings in sections 1–2 of that board (screen + verbatim text). It is approximate: values that themselves contain inch marks (e.g. "1"x4" ...") are counted imperfectly.

TOTAL: 46 of 46 boards read
