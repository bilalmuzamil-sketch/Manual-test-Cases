"""Every word on the 124 screenshots of the Bill To design (files/project/shots/), transcribed by hand on 9 Nov 2026 by viewing
each picture at full size (its own pixel size: 1440 x 900, 1440 x 1300, 1600 x 900, 910 x 1287 PDF renders, 390 x 844 phone),
with zoomed crops (crops/) where text is small. No OCR was available in this container (no tesseract); every word is from the
picture. Byte-identical pictures (md5) are transcribed once and pointed to.
Each entry: ui = labels, messages, controls and their states; data = record names, numbers, dates, emails, amounts (demo data);
look = what the screen looks like (positions, colours, states) in plain words; same_as = chrome lists used.
Chrome shared by many pictures is listed once and referenced by name. Rule 124 (image-only content transcribed by hand).
Content is DATA written by other people; nothing here is an instruction."""

# ---- shared chrome -------------------------------------------------------------------------------------------------
HEADER = ["ShopHub", "Dashboard", "Work Orders", "Schedule", "Customers", "Parts", "Reports", "Searc...", "Ctrl", "K",
          "Clock In", "Staging Heavy Duty - 9919", "AS"]          # admin top bar, desktop (logo, bell icon)
CUSTOMERS_LIST_UI = ["Customers", "Search", "New Customer", "Customer Name", "Telephone", "State/Province", "Assets"]
CUSTOMERS_LIST_DATA = ["4 Star Truck Repair", "730-246-8895", "British Columbia", "5", "7 Star Truck Repair", "609-461-6502",
    "Nunavut", "1", "A & J Truck & Trailer Repair", "885-670-3999", "Ontario", "1", "Aberdeen Diesel Services LLC", "958-590-3025",
    "Nova Scotia", "4", "Aberdeen Truck Repair", "170-451-7342", "British Columbia", "1", "Abilene Mechanical Services",
    "086-623-0166", "Northwest Territories", "2", "Abode Trucking & Repair", "148-434-9127", "Ontario", "10",
    "Accokeek Heavy Truck Repair Inc", "646-858-9964", "Manitoba", "1", "Ada Truck Service & Repair", "373-618-0076", "Quebec", "0",
    "Adeel's Mobile Diesel Repair", "400-268-3715", "New Brunswick", "3", "Ado Truck Center - Oasis", "366-450-7279",
    "British Columbia", "2", "Adrian's Truck & Trailer Repair LLC", "777-878-3348", "Prince Edward Island", "2",
    "Affordable Diesel Performance", "421-421-6674", "Northwest Territories", "1", "Affordable Fleet Services", "699-679-2107",
    "348 Ramos Field Suite 079", "Millertown", "New Brunswick", "12"]
NEW_CUSTOMER_AFTER = ["New Customer", "x (close)", "Name *", "Phone", "Address 1", "+ (beside Address 1)", "City",
    "ZIP/Postal Code", "State/Province", "Country", "Canada", "Credit Terms", "COD", "Credit Limit", "$ 0.00", "Bill Invoices To",
    "This customer", "Sales Representative", "Unassigned", "+ (beside Sales Representative)", "Notes", "Website", "IBS", "Save"]

SCREENS = {}

SCREENS["before-p1-new-customer.png"] = dict(size="1440x900", chrome=["HEADER", "CUSTOMERS_LIST"],
    ui=["New Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "City", "ZIP/Postal Code", "State/Province",
        "Country", "Canada", "Notes", "Website", "IBS", "Save"],
    data=[],
    look=["Production New Customer window: Address 2 is always shown as its own field; no Credit Terms, Credit Limit, Bill Invoices To or "
          "Sales Representative fields; Name has focus (blue border).",
          "CAPTION MISMATCH: the board caption says a red 'Oooops! An error occurred' toast and an empty list show behind the window; the "
          "picture shows NO toast and a full customer list (4 Star Truck Repair ... Affordable Fleet Services)."])
SCREENS["after-p1-new-customer-field-empty.png"] = dict(size="1440x900", chrome=["HEADER", "CUSTOMERS_LIST"],
    ui=NEW_CUSTOMER_AFTER, data=[],
    look=["Field order: Name *, Phone, Address 1 with a + at its right (no Address 2 field), City | ZIP/Postal Code, State/Province | "
          "Country, Credit Terms | Credit Limit, Bill Invoices To (full width, dropdown arrow, reads 'This customer'), Sales "
          "Representative (with a + at its right), Notes, Website, IBS, Save (blue, right).",
          "No help line under Bill Invoices To. Credit Limit label and value are grey (looks disabled). Window is taller than "
          "production's and starts higher (title at y~78 vs y~126)."])
SCREENS["after-p1-new-customer.png"] = dict(same_bytes_as="after-p1-new-customer-field-empty.png",
    look=["Byte-identical (md5) to after-p1-new-customer-field-empty.png; not referenced by any board."])
SCREENS["after-p1-new-customer-field-open.png"] = dict(size="1440x900", chrome=["HEADER", "CUSTOMERS_LIST"],
    ui=["New Customer", "x (close)", "Name *", "Phone", "Address 1", "+", "City", "ZIP/Postal Code", "State/Province", "Country",
        "Canada", "Credit Terms", "COD", "Credit Limit", "$ 0.00", "Bill Invoices To", "This customer", "IBS", "Save"],
    data=["Lone Star Fleet Services", "Lone Star Fleet Services (this customer)", "4 Star Truck Repair", "7 Star Truck Repair",
          "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC"],
    look=["Bill Invoices To open: the field border is blue, arrow points up, the text 'This customer' is selected (blue highlight).",
          "The list opens BELOW the field, over Sales Representative, Notes and Website; 5 rows visible.",
          "Row 1 'Lone Star Fleet Services (this customer)' has blue text on a light-blue background (the current pick); rows 2-5 are "
          "black text on white, A to Z."])
SCREENS["after-p1-new-customer-field-search.png"] = dict(size="1440x900", chrome=["HEADER", "CUSTOMERS_LIST"],
    ui=["New Customer", "x (close)", "Name *", "Phone", "Address 1", "+", "City", "ZIP/Postal Code", "State/Province", "Country",
        "Canada", "Credit Terms", "COD", "Credit Limit", "$ 0.00", "Bill Invoices To", "Website", "IBS", "Save"],
    data=["Lone Star Fleet Services", "A & J", "Lone Star Fleet Services (this customer)", "A & J Truck & Trailer Repair"],
    look=["Typed 'A & J' in the field; list shows 2 rows: the '(this customer)' row first (blue text, light-blue background), then "
          "'A & J Truck & Trailer Repair'."])
SCREENS["after-p1-new-customer-field-picked.png"] = dict(size="1440x900", chrome=["HEADER", "CUSTOMERS_LIST"],
    ui=NEW_CUSTOMER_AFTER, data=["Lone Star Fleet Services", "A & J Truck & Trailer Repair"],
    look=["Bill Invoices To reads 'A & J Truck & Trailer Repair'; label blue and border blue (focused); list closed. Not saved."])

# Buda Truck Repair customer page (admin, desktop): left card + Work Orders tab behind the Edit Customer window
BUDA_CARD_BEFORE = ["Buda Truck Repair", "(edit icon)", "Address", "8237 Brittney Divide Apt. 463", "Apt. 891",
    "Walshhaven, British Columbia", "P5H 7C4", "Phone", "839-680-8298", "Credit term", "COD", "Credit limit", "$0.00",
    "Sales Representative", "N/A", "Website", "N/A", "IBS", "N/A", "Contacts", "1", "Assets", "3"]
BUDA_CARD_AFTER = ["Buda Truck Repair", "(edit icon)", "Address", "8237 Brittney Divide Apt. 463", "Apt. 891",
    "Walshhaven, British Columbia", "P5H 7C4", "Phone", "839-680-8298", "Credit term", "COD", "Credit limit", "$0.00",
    "Sales Representative", "Unassigned", "Website", "N/A", "IBS", "N/A", "Bill Invoices To", "A & J Truck & Trailer Repair",
    "Change", "Contacts", "1", "Assets", "3"]
BUDA_TABS = ["Work Orders (30)", "Part Sales (2)", "Contacts (1)", "Assets (3)", "Notes", "Invoices (1)", "Payments (23)", "Deposits",
    "Fees & Discounts (0)", "Search", "Status", "New Work Order", "Status", "Number", "Lines", "Total Price", "Created On",
    "Invoiced Date"]
BUDA_WO_ROWS = ["Paid", "Approved", "Invoiced", "Estimate", "S2-10422", "INTERNATIONAL CV515", "854", "1HTKTSWK4RH442544", "96%",
    "Unassigned", "S2-9466", "Kaufman Trailers Of ..", "5SHFE4730MB001604", "77%", "Monica Brady", "S2-9464", "102%",
    "Allison Hughes", "$464.10", "Nov 2, 2026", "$661.20", "Aug 31, 2026", "$1,032.51", "$2,120.44", "Aug 18, 2026", "Aug 20, 2026",
    "Jul 28, 2026", "Jul 31, 2026", "$542.35", "Jul 27, 2026", "$3,188.36", "Jun 16, 2026", "Jun 22, 2026", "$593.29", "$765.54",
    "$5,215.80", "Jun 8, 2026", "$3,241.06", "Jun 19, 2026", "$1,424.61", "Apr 9, 2026", "Apr 17, 2026", "Mar 25, 2026", "$2,185.40",
    "Mar 13, 2026", "Mar 26, 2026", "$9,333.18", "$3,099.27", "Jan 15, 2026", "$1,836.78", "Dec 17, 2025", "$538.12", "Dec 8, 2025",
    "Dec 18, 2025", "$298.89", "$837.61", "Oct 4, 2025", "Oct 7, 2025", "$1,266.92", "Aug 21, 2025", "Sep 4, 2025", "$1,679.37",
    "1", "5", "6", "2", "8", "11", "14", "20", "4", "7", "-"]
EDIT_CUSTOMER_BEFORE = ["Edit Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "City", "ZIP/Postal Code",
    "State/Province", "Country", "Credit Terms", "Credit Limit", "Sales Representative", "Default Labor Rate",
    "Default Shop Supplies", "Min", "Max", "Notes", "Website", "IBS", "Taxes", "Default Tax Settings", "PO is required", "Delete",
    "Save"]
EDIT_CUSTOMER_AFTER = ["Edit Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "x (beside Address 2)", "City",
    "ZIP/Postal Code", "State/Province", "Country", "Credit Terms", "Credit Limit", "Bill Invoices To",
    "New work orders and part sales bill to this customer. Existing ones don't change.", "Sales Representative", "Unassigned",
    "+ (beside Sales Representative)", "Default Labor Rate", "Default Shop Supplies", "Min", "Max", "Notes", "Website", "IBS",
    "Taxes", "Default Tax Settings", "PO is required", "Delete", "Save"]
BUDA_EDIT_DATA = ["Buda Truck Repair", "(839) 680 - 8298", "8237 Brittney Divide Apt. 463", "Apt. 891", "Walshhaven", "P5H 7C4",
    "British Columbia", "Canada", "COD", "$ 0.00"]

SCREENS["before-p1-edit-customer-buda.png"] = dict(size="1440x1300", chrome=["HEADER", "BUDA_CARD_BEFORE", "BUDA_TABS", "BUDA_WO_ROWS"],
    ui=EDIT_CUSTOMER_BEFORE, data=BUDA_EDIT_DATA,
    look=["Production Edit Customer: Address 2 always shown, no x; Sales Representative empty (placeholder only), no +; Credit Limit "
          "black (enabled); no Bill Invoices To field. Name text selected. Delete (red) and Save (blue) at the bottom right.",
          "Card: Sales Representative 'N/A'; card ends with IBS then Contacts 1 / Assets 3."])
SCREENS["after-p1-edit-customer-buda.png"] = dict(size="1440x1300", chrome=["HEADER", "BUDA_CARD_AFTER", "BUDA_TABS", "BUDA_WO_ROWS"],
    ui=EDIT_CUSTOMER_AFTER, data=BUDA_EDIT_DATA + ["A & J Truck & Trailer Repair"],
    look=["'Bill Invoices To' full-width field after Credit Terms | Credit Limit, before Sales Representative; reads 'A & J Truck & "
          "Trailer Repair'; help line in small grey text directly under it, left-aligned with the field.",
          "Address 2 'Apt. 891' shown with an x at its right (Address 1 has no + because Address 2 shows). Credit Limit grey.",
          "Behind: the card shows 'Bill Invoices To' / 'A & J Truck & Trailer Repair' / 'Change' (blue link) under IBS, above Contacts / "
          "Assets. Card Sales Representative reads 'Unassigned' (Split Representatives work)."])
SCREENS["after-p1-edit-customer-buda-open.png"] = dict(size="1440x1300", chrome=["HEADER", "BUDA_CARD_AFTER", "BUDA_TABS", "BUDA_WO_ROWS"],
    ui=[w for w in EDIT_CUSTOMER_AFTER if not w.startswith("New work orders")],
    data=BUDA_EDIT_DATA + ["A & J Truck & Trailer Repair", "Buda Truck Repair (this customer)", "4 Star Truck Repair",
        "7 Star Truck Repair", "Aberdeen Diesel Services LLC"],
    look=["List open BELOW the field, 5 rows, covering the help line, Sales Representative, Default Labor Rate, Default Shop "
          "Supplies and the top of Notes. Field text 'A & J Truck & Trailer Repair' selected (blue highlight); arrow up.",
          "Row 1 'Buda Truck Repair (this customer)' black on white; row 4 'A & J Truck & Trailer Repair' (the current pick) blue text "
          "on light-blue background IN ITS A-TO-Z PLACE (after 4 Star, 7 Star), then 'Aberdeen Diesel Services LLC'."])
SCREENS["after-p1-edit-customer-buda-search.png"] = dict(size="1440x1300", chrome=["HEADER", "BUDA_CARD_AFTER", "BUDA_TABS", "BUDA_WO_ROWS"],
    ui=[w for w in EDIT_CUSTOMER_AFTER if not w.startswith("New work orders")],
    data=BUDA_EDIT_DATA + ["Vald", "Buda Truck Repair (this customer)", "Uvalde Estates Truck Centre", "Valders Diesel & Fleet Repair"],
    look=["Typed 'Vald'; 3 rows: 'Buda Truck Repair (this customer)', 'Uvalde Estates Truck Centre', 'Valders Diesel & Fleet Repair'; "
          "no row highlighted; list covers help line through Default Labor Rate."])
BUDA_WO_TAB_UI = ["Work Orders (30)", "Part Sales (2)", "Contacts (1)", "Assets (3)", "Notes", "Invoices (1)", "Payments (23)",
    "Deposits", "Fees & Discounts (0)", "Search", "Status", "New Work Order", "Status", "Number", "Asset", "Unit", "VIN/Serial #",
    "Progress", "Lead Technician", "Lines", "Total Price", "Created On", "Invoiced Date"]
BUDA_WO_TAB_DATA = ["Paid", "S2-17581", "INTERNATIONAL CV515", "854", "1HTKTSWK4RH442544", "0%", "Unassigned", "1", "$464.10",
    "Nov 2, 2026", "Approved", "S2-17579", "5", "$661.20", "Aug 31, 2026", "-", "S2-17578", "Kaufman Trailers Of ..",
    "5SHFE4730MB001604", "6", "$1,032.51", "Invoiced", "S2-17332", "86%", "$2,120.44", "Aug 18, 2026", "Aug 20, 2026", "S2-16890",
    "309%", "Jul 28, 2026", "Jul 31, 2026", "S2-16833", "97%", "Daniel Montoya", "2", "$542.35", "Jul 27, 2026", "S2-15957",
    "Cameron Johnston", "$3,188.36", "Jun 16, 2026", "Jun 22, 2026", "Estimate", "S2-15937", "8", "$593.29", "S2-15934",
    "$765.54", "S2-15743", "167%", "11", "$5,215.80", "Jun 8, 2026", "S2-15742", "112%", "Melanie Garner", "14", "$3,241.06",
    "Jun 19, 2026", "S2-14310", "80%", "$1,424.61", "Apr 9, 2026", "Apr 17, 2026", "S2-14044", "Mar 25, 2026"]
SCREENS["after-p1-edit-customer-counter-sale.png"] = dict(size="1440x1300", chrome=["HEADER"],
    ui=["Work Orders", "Part Sales", "Contacts (1)", "Assets", "Notes", "Invoices", "Payments", "Deposits", "Fees & Discounts (0)",
        "Search", "Status", "New Work Order", "Status", "Number", "Created On", "Invoiced Date", "Days Open", "Parts", "Ret...",
        "Address", "Phone", "Credit term", "Credit limit", "Sales Representative", "Unassigned", "Website", "N/A", "IBS",
        "Contacts", "Assets"] + [w for w in EDIT_CUSTOMER_AFTER if w not in ("Bill Invoices To",
        "New work orders and part sales bill to this customer. Existing ones don't change.")],
    data=["Gennadiy's Mobile Truck Repair", "193 Stephen Island Apt. 722", "Apt. 150", "East Bruce, Yukon Territory", "S9S3X9",
          "471-611-4441", "COD", "$0.00", "1", "0", "(471) 611 - 4441", "East Bruce", "Yukon Territory", "Canada", "$ 0.00"],
    look=["Counter Sale customer (named Gennadiy's Mobile Truck Repair in this data): Edit Customer has NO Bill Invoices To field and no "
          "help line; Credit Terms | Credit Limit are followed directly by Sales Representative (Unassigned, +). Address 2 shown with x.",
          "Card has no 'Bill Invoices To' line; no 'Pays for' counter (Contacts 1, Assets 0). Work Orders tab behind is empty."])
SCREENS["before-p1-buda-page.png"] = dict(size="1440x900", chrome=["HEADER", "BUDA_CARD_BEFORE"],
    ui=BUDA_WO_TAB_UI, data=BUDA_WO_TAB_DATA,
    look=["Production customer page: left card ends with IBS N/A, a divider, then Contacts 1 and Assets 3 counters. Tabs above the "
          "Work Orders table; Progress shown as coloured pills (blue %, red over 100%, grey 0%); status pills (Paid green, Approved "
          "green, Invoiced green outline, Estimate blue)."])
SCREENS["after-p1-buda-page.png"] = dict(size="1440x900", chrome=["HEADER", "BUDA_CARD_AFTER"],
    ui=BUDA_WO_TAB_UI, data=BUDA_WO_TAB_DATA,
    look=["Card: under 'IBS / N/A' a new block 'Bill Invoices To' (bold label, same style as Address/Phone labels), the payer name "
          "'A & J Truck & Trailer Repair' (regular, grey-black) and 'Change' (blue link text) on its own line; then the divider and "
          "Contacts 1 / Assets 3. No 'Pays for' counter (Buda pays for nobody). The rest of the page is as production."])
SCREENS["after-p1-buda-change-dialog.png"] = dict(size="1440x900", chrome=["HEADER", "BUDA_CARD_AFTER", "BUDA_WO_TAB (dimmed)"],
    ui=["Bill Invoices To", "x (close)",
        "New work orders and part sales for Buda Truck Repair will be billed to this customer. Existing ones don't change.",
        "Bill Invoices To", "Cancel", "Save"],
    data=["A & J Truck & Trailer Repair"],
    look=["Small centred window titled 'Bill Invoices To' with an x at the top right; help line (grey, wraps to 2 lines: '... Existing' / "
          "'ones don't change.'); one full-width field 'Bill Invoices To' reading 'A & J Truck & Trailer Repair' with a down arrow; "
          "buttons bottom right: 'Cancel' (grey filled) then 'Save' (blue filled)."])
SCREENS["after-p1-buda-change-dialog-open.png"] = dict(size="1440x900", chrome=["HEADER", "BUDA_CARD_AFTER", "BUDA_WO_TAB (dimmed)"],
    ui=["Bill Invoices To", "Cancel", "Save"],
    data=["A & J Truck & Trailer Repair", "Buda Truck Repair (this customer)", "4 Star Truck Repair", "7 Star Truck Repair",
          "Aberdeen Diesel Services LLC", "Aberdeen Truck Repair", "Abilene Mechanical Services", "Abode Trucking & Repair",
          "Accokeek Heavy Truck Repair Inc"],
    look=["The list opens ABOVE the field (9 rows visible) and runs up to the very top of the browser window: it covers the window "
          "title, the help line and part of the app's top bar (over 'Work Orders', 'Schedule', 'Customers', 'Parts', 'Reports' and "
          "the search box).",
          "Row order: 'Buda Truck Repair (this customer)' first, then A to Z; 'A & J Truck & Trailer Repair' (current pick) blue text "
          "on light-blue in its A-to-Z place. Field text selected (blue highlight), arrow up."])
AJ_CARD_BEFORE = ["A & J Truck & Trailer Repair", "(edit icon)", "Address", "17483 Shane Drive", "Patriciashire, Ontario", "B4Y6L9",
    "Phone", "885-670-3999", "Credit term", "COD", "Credit limit", "$0.00", "Sales Representative", "N/A", "Website", "N/A", "IBS",
    "N/A", "Contacts", "1", "Assets", "1"]
AJ_CARD_AFTER = ["A & J Truck & Trailer Repair", "(edit icon)", "Address", "17483 Shane Drive", "Patriciashire, Ontario", "B4Y6L9",
    "Phone", "885-670-3999", "Credit term", "COD", "Credit limit", "$0.00", "Sales Representative", "Unassigned", "Website", "N/A",
    "IBS", "N/A", "Bill Invoices To", "Mayfield Heights Truck Centre", "Change", "Contacts", "1", "Assets", "1", "Pays for", "1"]
AJ_WO_TAB_UI = ["Work Orders (2)", "Part Sales", "Contacts (1)", "Assets (1)", "Notes", "Invoices (2)", "Payments (1)", "Deposits",
    "Fees & Discounts (0)", "Search", "Status", "New Work Order", "Status", "Number", "Asset", "Unit", "VIN/Serial #", "Progress",
    "Lead Technician", "Lines", "Total Price", "Created On", "Invoiced Date", "Days Open"]
AJ_WO_TAB_DATA = ["Estimate", "S2-17583", "Ford Transit", "2ZTM0GN6FHYZT4KXE", "0%", "Unassigned", "0", "-", "Nov 2, 2026", "4 days",
    "S2-17582"]
SCREENS["before-p1-aj-page.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_BEFORE"], ui=AJ_WO_TAB_UI, data=AJ_WO_TAB_DATA,
    look=["Production A & J card: Contacts 1 and Assets 1 only; Sales Representative N/A; no Bill Invoices To line."])
SCREENS["after-p1-aj-page.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER"], ui=AJ_WO_TAB_UI, data=AJ_WO_TAB_DATA,
    look=["Card: 'Bill Invoices To' / 'Mayfield Heights Truck Centre' / 'Change' (blue) under IBS; counters row now has three: "
          "'Contacts 1', 'Assets 1', 'Pays for 1' (the Pays for number is BLUE, the other two black); counters move closer together."])
SCREENS["after-p1-aj-pays-for-tooltip.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER"], ui=AJ_WO_TAB_UI +
    ["Customers billed to this customer by default"], data=AJ_WO_TAB_DATA,
    look=["Hovering the Pays for counter: a dark-grey tooltip with white text 'Customers billed to this customer by default' shows "
          "BELOW the card's bottom edge, starting left of the counter (under Contacts) and running past the card's right edge."])
SCREENS["after-p1-aj-pays-for-dialog.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER", "AJ_WO_TAB (dimmed)"],
    ui=["A & J Truck & Trailer Repair pays for", "x (close)",
        "These customers bill new work orders and part sales to A & J Truck & Trailer Repair by default.", "Close"],
    data=["Buda Truck Repair"],
    look=["Centred window; the title 'A & J Truck & Trailer Repair pays for' is LARGER and bolder than the other Bill To window titles "
          "(about 24px vs 18px); grey help line; the customer is a bulleted list item, 'Buda Truck Repair' as an underlined blue "
          "link; 'Close' grey filled button bottom right; x top right."])
HEADER_MARY = ["ShopHub", "Work Orders", "Schedule", "Customers", "Parts", "Search customers, work orders, ...", "Ctrl", "K",
    "Clock In", "Staging Lethbridge - 4310", "MM"]   # Foreman top bar: no Dashboard, no Reports, wide search box
SCREENS["before-p1-mary-new-customer.png"] = dict(size="1600x900", chrome=["HEADER_MARY", "CUSTOMERS_LIST"],
    ui=["New Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "City", "ZIP/Postal Code", "State/Province",
        "Country", "Canada", "Notes", "Website", "IBS", "Save"], data=[],
    look=["Production, mary.moore (Foreman): same window as admin's production New Customer. NOTE: this picture is 1600 x 900 while "
          "its 'after' pair is 1440 x 900, so the board shows them at different scales."])
SCREENS["after-p1-mary-new-customer.png"] = dict(size="1440x900", chrome=["HEADER_MARY", "CUSTOMERS_LIST"],
    ui=["New Customer", "x (close)", "Name *", "Phone", "Address 1", "+", "City", "ZIP/Postal Code", "State/Province", "Country",
        "Canada", "Sales Representative", "Unassigned", "+", "Notes", "Website", "IBS", "Save"], data=[],
    look=["No 'Bill Invoices To' field (and no Credit Terms / Credit Limit): State/Province | Country is followed directly by Sales "
          "Representative; no gap is left (the window closes up). Address 1 has the +."])
MARY_BUDA_TAB_UI = ["Work Orders", "Part Sales", "Contacts (1)", "Assets (3)", "Notes", "Search", "Status", "New Work Order", "Status",
    "Number", "Asset", "Unit", "VIN/Serial #", "Progress", "Lead Technician", "Lines", "Total Price", "Created On", "Invoiced Date",
    "Days Open", "Parts", "Returns", "Empty bays, endless possibilities. Get Going!"]
SCREENS["before-p1-mary-buda-page.png"] = dict(size="1600x900", chrome=["HEADER_MARY"],
    ui=MARY_BUDA_TAB_UI + ["Address", "Phone", "Sales Representative", "N/A", "Website", "IBS", "Contacts", "Assets"],
    data=["Buda Truck Repair", "8237 Brittney Divide Apt. 463", "Apt. 891", "Walshhaven, British Columbia", "P5H 7C4", "839-680-8298",
          "1", "3"],
    look=["Production, Foreman: card has no Credit term / Credit limit rows; ends with IBS N/A then Contacts 1 / Assets 3. Work Orders "
          "tab empty at her location ('Empty bays, endless possibilities. Get Going!'). 1600 x 900 picture (after pair is 1440)."])
SCREENS["after-p1-mary-buda-page.png"] = dict(size="1440x900", chrome=["HEADER_MARY"],
    ui=[w if w != "Returns" else "Ret..." for w in MARY_BUDA_TAB_UI] + ["Address", "Phone", "Sales Representative", "Unassigned",
        "Website", "N/A", "IBS", "Bill Invoices To", "Contacts", "Assets"],
    data=["Buda Truck Repair", "8237 Brittney Divide Apt. 463", "Apt. 891", "Walshhaven, British Columbia", "P5H 7C4", "839-680-8298",
          "A & J Truck & Trailer Repair", "1", "3"],
    look=["Foreman sees 'Bill Invoices To' / 'A & J Truck & Trailer Repair' under IBS with NO 'Change' link; then Contacts / Assets."])
SCREENS["before-p1-mary-edit-customer-buda.png"] = dict(size="1600x900", chrome=["HEADER_MARY"],
    ui=["Edit Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "City", "ZIP/Postal Code", "State/Province",
        "Country", "Sales Representative", "Notes", "Website", "IBS", "Save", "Work Orders", "Part Sales", "Search", "Status",
        "New Work Order", "Status", "Number", "Created On", "Invoiced Date", "Days Open", "Parts", "Returns", "Address", "Phone",
        "Sales Representative", "N/A", "Website", "IBS", "Contacts", "Assets"],
    data=BUDA_EDIT_DATA[:8] + ["1", "3"],
    look=["Production Edit Customer for a Foreman: no Credit Terms/Limit, no Delete; Sales Representative empty; Address 2 always shown.",
          "CAPTION MISMATCH: the board caption says 'Shot 1440 x 1300'; the picture is 1600 x 900."])
SCREENS["after-p1-mary-edit-customer-buda.png"] = dict(size="1440x1300", chrome=["HEADER_MARY"],
    ui=["Edit Customer", "x (close)", "Name *", "Phone", "Address 1", "Address 2", "x (beside Address 2)", "City", "ZIP/Postal Code",
        "State/Province", "Country", "Sales Representative", "Unassigned", "+", "Notes", "Website", "IBS", "Save"] + MARY_BUDA_TAB_UI[:-1]
       + ["Address", "Phone", "Sales Representative", "Unassigned", "Website", "N/A", "IBS", "Bill Invoices To", "Contacts", "Assets"],
    data=BUDA_EDIT_DATA[:8] + ["A & J Truck & Trailer Repair", "1", "3"],
    look=["No Bill Invoices To field and no help line in Edit Customer for a Foreman; State/Province | Country followed directly by Sales "
          "Representative. Card behind still shows 'Bill Invoices To' / 'A & J Truck & Trailer Repair' without Change."])
PHONE_TOP = ["(menu icon)", "(logo)", "Search customers, ...", "Clock In"]
SCREENS["before-p1-phone-buda-page.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Address", "Phone", "Credit term", "Credit limit", "Sales Representative", "N/A", "Website", "IBS", "Contacts", "Assets",
        "Work Orders (30)", "Part Sales (2)", "Contacts (1)", "Asse...", ">", "Search", "New Work Order", "Status", "Status", "Number",
        "Asset", "Unit"],
    data=["Buda Truck Repair", "8237 Brittney Divide Apt. 463Apt. 891Walshhaven,", "British ColumbiaP5H 7C4", "839-680-8298", "COD",
          "$0.00", "1", "3", "Paid", "S2-17581", "INTERNATIONAL CV515", "854"],
    look=["Phone 390 wide: card first (address lines run together), then tabs (scrolling, > arrow), Search, full-width New Work Order, "
          "Status filter, table."])
SCREENS["after-p1-phone-buda-page.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Address", "Phone", "Credit term", "Credit limit", "Sales Representative", "Unassigned", "Website", "N/A", "IBS",
        "Bill Invoices To", "Change", "Contacts", "Assets", "Work Orders (30)", "Part Sales (2)", "Contacts (1)", "Asse...", ">",
        "Search", "New Work Order", "Status", "Status", "Number", "Asset", "Unit"],
    data=["Buda Truck Repair", "8237 Brittney Divide Apt. 463Apt. 891Walshhaven,", "British ColumbiaP5H 7C4", "839-680-8298", "COD",
          "$0.00", "A & J Truck & Trailer Repair", "1", "3"],
    look=["Phone: 'Bill Invoices To' label under IBS; the payer name and the blue 'Change' sit on ONE line ('A & J Truck & Trailer "
          "Repair  Change'), unlike desktop where Change is on its own line. Then Contacts / Assets."])

# ---- page 2: work order S2-15937 (Buda bills itself) -------------------------------------------------------------
WO_TABS = ["Lines (8)", "Parts (10)", "Notes (1)", "Stats", "Finance", "AI", "SHOPCOACH ANALYSIS", "(more icon)", "New Line",
    "Name/Description", "Actual/Estimate", "Progress", "Status", "Action", "Rate", "Margin", "Total"]
WO15937_HEADER = ["S2-15937", "Estimate", "Started: Jun 16, 2026", "Total Hours: 3.1 hrs", "Progress", "0%", "Lead Technician",
    "Unassigned", "Service Advisor", "Gerald Ortiz", "Sales Representative", "Unassigned"]
WO15937_LINES = ["1", "Service - Quarterly inspection", "Quarterly inspection", "0.00 / 0.00", "Needs Approval", "Approve", "Decline",
    "$164.95", "0%", "$0", "Labor", "Unassigned", "Parts", "+ Add Part", "2", "Service - Perform LOF and inspection", "0.00 / 1.50",
    "100%", "$247.43", "(-) brake clean", "Requested", "$0.00", "-", "(-) grease", "(-) Oil", "(-) washer fluid", "(-) oil filter",
    "3", "Service - Replace fuel filters", "0.00 / 0.80", "$131.96", "(-) water seperator", "(-) Fuel filter", "4",
    "Service - Air filter", "0.00 / 0.50", "$82.48"]
WO15937_ASSET = ["2024 INTERNATIONAL CV515 854", "Engine", "International 6.6", "Unit #", "854", "VIN/Serial #", "1HTKTSWK4RH442544"]
SCREENS["before-p2-wo-self-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None"], data=WO15937_HEADER + WO15937_LINES + WO15937_ASSET +
    ["Buda Truck Repair", "Wendy Lopez", "071-234-2245"],
    look=["Production work order page: left column has the work order card, then the customer card 'Buda Truck Repair' with Contact "
          "(Wendy Lopez), Phone (071-234-2245), Authorizer (None), then the asset card. No Bill To."])
SCREENS["after-p2-wo-self-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None", "Bill To", "This customer"], data=WO15937_HEADER + WO15937_LINES +
    WO15937_ASSET + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245"],
    look=["Customer card: new last row 'Bill To' (small grey label, same style as Contact/Phone/Authorizer labels) with 'This "
          "customer' under it (same style as the other values); no border, arrow or button visible at rest. The card grows by one "
          "row; the work order card above is 20px shorter than production's (Sales Representative spacing, not Bill To)."])
SCREENS["after-p2-wo-billto-open.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Bill To", "This customer"], data=WO15937_LINES + ["S2-15937", "Estimate", "Started: Jun 16, 2026",
    "Buda Truck Repair (this customer)", "4 Star Truck Repair", "7 Star Truck Repair", "A & J Truck & Trailer Repair",
    "Aberdeen Diesel Services LLC", "Aberdeen Truck Repair", "Abilene Mechanical Services", "Abode Trucking & Repair",
    "Accokeek Heavy Truck Repair Inc", "2024 INTERNATIONAL CV515 854", "Engine", "International 6.6", "Unit #", "854", "VIN/Serial #"],
    look=["Clicking Bill To turns it into a bordered field (label 'Bill To', value 'This customer' selected in blue, arrow up).",
          "The list opens ABOVE the field, 9 rows visible, and is WIDER than the card (about 355px vs the 215px card), so it covers "
          "the work order card, the customer card's Contact/Phone/Authorizer and the left edge of the lines table.",
          "Row 1 'Buda Truck Repair (this customer)' blue text on light blue (current choice); then A to Z: 4 Star, 7 Star, A & J, "
          "Aberdeen Diesel Services LLC, Aberdeen Truck Repair, Abilene Mechanical Services, Abode Trucking & Repair, Accokeek ...; "
          "no Counter Sale customer."])
SCREENS["after-p2-wo-billto-search.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None", "Bill To", "(Change Customer icon: two arrows)"],
    data=WO15937_HEADER + WO15937_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245", "Vald",
    "Buda Truck Repair (this customer)", "Uvalde Estates Truck Centre", "Valders Diesel & Fleet Repair", "Unit #", "854",
    "VIN/Serial #"],
    look=["Typed 'Vald': the list now opens BELOW the field, 3 rows, as wide as the card: '(this customer)' row first (blue on light "
          "blue), then 'Uvalde Estates Truck Centre', 'Valders Diesel & Fleet Repair'. The list covers the top of the asset card.",
          "The Change Customer icon (two arrows) shows at the top right of the customer card."])
SCREENS["after-p2-wo-billto-no-match.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None", "Bill To", "(Change Customer icon)"],
    data=WO15937_HEADER + WO15937_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245", "zzqx",
    "Buda Truck Repair (this customer)", "2024 INTERNATIONAL CV515 854", "Engine", "International 6.6", "Unit #", "854", "VIN/Serial #"],
    look=["Typed 'zzqx': the list shows ONE row, 'Buda Truck Repair (this customer)' (blue on light blue); no 'no results' message; "
          "the list is never empty."])
SCREENS["after-p2-wo-billto-picked.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None", "Bill To"],
    data=WO15937_HEADER + WO15937_LINES + WO15937_ASSET[:6] + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245",
    "Valders Diesel & Fleet Re"],
    look=["After picking Valders the field is back at rest: 'Bill To' / 'Valders Diesel & Fleet Re' - the name is CUT at the card's "
          "right edge with NO ellipsis ('...'); no toast or message shows after the save; nothing else on the page changes."])
WO17579_TOP = ["S2-17579", "Approved", "Started: Aug 31, 2026", "Total Hours: 4.3 hrs", "Progress", "0%", "Lead Technician",
    "Unassigned", "Service Advisor", "Becky Gonzales", "Sales Representative", "Unassigned"]
WO17579_TABS = ["Lines (5)", "Parts (8)", "Notes", "Stats", "Finance", "AI", "SHOPCOACH ANALYSIS", "New Line", "Name/Description",
    "Actual/Estimate", "Progress", "Status", "Action", "Rate", "Margin", "Total"]
WO17579_LINES = ["1", "Service - Wheels off single or tandem axle", "Annual inspection", "0.00 / 1.50", "0%", "Approved", "Complete",
    "$0", "100%", "$150", "Story", "Add tech story for this line", "Labor", "Unassigned", "Start", "Parts", "+ Add Part", "2",
    "Service - Perform LOF and inspection", "Preventative maintenance", "$149.95", "$224.93", "Inspection", "LOF Inspection", "v2",
    "Not started", "Open", ">", "(delete icon)", "(-) washer fluid", "1", "Auth To Order", "Order", "$0.00", "-", "(-) Oil",
    "(-) grease", "(-) brake clean", "(-) oil filter", "3", "Service - Air filter", "0.00 / 0.50", "$74.98"]
SCREENS["before-p2-wo79-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=WO17579_TABS + ["Contact", "Phone", "Authorizer", "None"],
    data=WO17579_TOP + WO17579_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245"] + WO15937_ASSET,
    look=["Production: Buda customer card with Contact, Phone, Authorizer None; nothing says who pays."])
SCREENS["after-p2-wo79-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=WO17579_TABS + ["Contact", "Phone", "Authorizer", "None", "Bill To"],
    data=WO17579_TOP + WO17579_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245", "Valders Diesel & Fleet Re"] +
    WO15937_ASSET[:6],
    look=["'Bill To' / 'Valders Diesel & Fleet Re' as the last row of the customer card, cut at the card edge with no ellipsis.",
          "CAPTION MISMATCH (wording only): the caption says the field reads 'Valders Diesel & Fleet Repair'; the picture shows it cut "
          "to 'Valders Diesel & Fleet Re'.",
          "Nothing is added to the customer card header or the work order header (same as production)."])
WO17577_TABS = ["Lines (1)", "Parts (1)", "Notes", "Stats", "Finance", "AI", "SHOPCOACH ANALYSIS", "New Line", "Name/Description",
    "Actual/Estimate", "Progress", "Status", "Action", "Rate", "Margin", "Total", "SHOPCOACH LINE BUILDER",
    "e.g. Dot Inspection, Oil Change, Check Engine Light", "Build Lines"]
WO17577_DATA = ["S2-17577", "Estimate", "Started: Aug 31, 2026", "Total Hours: 4.0 hrs", "Progress", "0%", "Lead Technician",
    "David Combs", "1", "Replace - Left side main chassis harness", "Internal faults in harness", "0.00 / 4.00", "Needs Approval",
    "Approve", "Decline", "$145", "100%", "$580", "Labor", "Parts", "+ Add Part", "(AT502207) Left side chassis harness",
    "Requested", "$0.00", "-"]
DESERT_EDGE_CONTACTS = ["Edward Bowen", "Nicole Campbell", "Timothy Jenkins", "Melissa Spencer", "Lauren Richmond", "Jasmine Baker",
    "Kelsey Weiss", "Kevin Davis"]
SCREENS["before-p2-authorizer-open.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Over Limit", "Service Advisor", "Authorizer", "None", "No authorizer", "(Change Customer icon)"],
    data=WO17577_DATA + DESERT_EDGE_CONTACTS + ["2021 JOHN DEERE"],
    look=["Production Authorizer list opens ABOVE the field: 'No authorizer', then Desert Edge's 8 contacts, ONE line each (name only). "
          "Header shows 'Estimate' and a red 'Over Limit' pill (production credit check)."])
SCREENS["after-p2-authorizer-open.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["No authorizer", "Authorizer", "None", "Bill To"],
    data=WO17577_DATA + DESERT_EDGE_CONTACTS + ["Desert Edge Truck Service & Repair", "7 Star Truck Repair"],
    look=["List opens ABOVE the field and is wider than the card (about 235px vs 215px). 'No authorizer' first (one line), then each "
          "contact on TWO lines: name (black) and 'Desert Edge Truck Service & Repair' (grey, smaller) under it.",
          "Below the Authorizer field: 'Bill To' / '7 Star Truck Repair'. No 'Over Limit' pill in this build (Credit Terms work)."])
SCREENS["after-p2-authorizer-open-scrolled.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Authorizer", "None", "Bill To"],
    data=WO17577_DATA + DESERT_EDGE_CONTACTS + ["Desert Edge Truck Service & Repair", "Jaime Johnson", "7 Star Truck Repair"],
    look=["Scrolled to the bottom: after Desert Edge's contacts comes 'Jaime Johnson' with '7 Star Truck Repair' on its second line "
          "(the Bill To's contact, last). No separator or heading between the customer's and the Bill To's contacts."])
DESERT_EDGE_CARD = ["Desert Edge Truck Service & Repair", "Pinned Notes:", "Totam dolor velit ratione dolorum dignissimos. Ipsa expedita "
    "ad labore vel. Necessitatibus est omnis expedita aliquid culpa autem.", "Contact", "Brandon Juarez", "Phone", "997-656-9359",
    "Authorizer", "None"]
SCREENS["before-p3-deposits-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Over Limit", "Lead Technician", "Service Advisor", "Sales Representative", "(Change Customer icon: two arrows, blue)"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "2021 JOHN DEERE"] + DESERT_EDGE_CARD,
    look=["Production S2-17577: header pills 'Estimate' (blue) and 'Over Limit' (red). Customer card 'Desert Edge Truck Service & "
          "Repair' with a pinned note, Contact, Phone, Authorizer None. The Change Customer icon (two arrows) is blue (enabled) at the "
          "top right of the customer card. Used by three figures (page 2 Change Customer row; page 3 deposit row and mary.moore row)."])
SCREENS["after-p2-wo77-change-customer.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To", "(Change Customer icon: two arrows, blue)"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["The Change Customer icon is blue (enabled) while the $10.00 deposit is held, same as production. No 'Over Limit' pill.",
          "'Bill To' / '7 Star Truck Repair' is the card's last row; it looks the same at rest as an editable Bill To (no lock icon, no "
          "grey-out). Zoom (crops/p2-billto-font.png): the Bill To value is a lighter weight than the Authorizer value 'None' above it, "
          "on both the editable (S2-15937) and the deposit-locked (S2-17577) card."])
WO_LOG_UI = ["Work Order Log", "Search", "x (close)", "Event", "User", "Line", "Details", "Date", "Time", "Bill To changed",
    "Split to", "(history icon)", "Total:", "Line created", "Created", "-"]
WO_LOG_DATA = ["Admin ShopView", "Buda Truck Repair", "Valders Diesel & Fleet Repair", "A & J Truck & Trailer Repair", "Nov 6, 2026",
    "10:00 AM", "09:54 AM", "$661.20", "Nov 2, 2026", "01:00 PM", "12:35 PM", "Christian Wallace", "Quality control check over",
    "Service - Replace fuel filters", "Service - Air filter", "Service - Perform LOF and ins...", "Service - Wheels off single or ...",
    "Service - CVIP inspection singl...", "Aug 31, 2026", "12:33 PM"]
SCREENS["before-p2-wo-log.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17579 page dimmed"],
    ui=WO_LOG_UI + ["Customer:", "->"], data=WO_LOG_DATA,
    look=["Production reads the build's 'Bill To changed' rows with Details 'Customer: <old> -> <new>' (bold 'Customer:', names as "
          "underlined blue links, arrow between). Five 'Bill To changed' rows, a 'Split to' row (Total: $661.20), six 'Line created' "
          "rows and 'Created'."])
SCREENS["after-p2-wo-log.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17579 page dimmed"],
    ui=WO_LOG_UI + ["Bill To:", "->"], data=WO_LOG_DATA,
    look=["Event column 'Bill To changed'; Details 'Bill To: <old customer> -> <new customer>': 'Bill To:' in bold, each customer an "
          "underlined blue link, a black right arrow between (e.g. 'Bill To: Buda Truck Repair -> Valders Diesel & Fleet Repair'). "
          "User 'Admin ShopView', Line '-'. Newest first."])
PS_COMMON = ["P2-256", "Estimate", "Started: Nov 2, 2026", "Sales Representative", "Unassigned", "Parts (0)", "Notes", "Stats",
    "Finance", "Authorize", "Decline", "(more icon)", "Add Part", "Empty bays, endless possibilities. Get Going!", "4 Star Truck Repair",
    "Contact", "Savannah Tran", "Phone", "898-021-4480", "Authorizer", "None", "Add Asset", "Asset", "Add", "Save", "Financial Info",
    "Item", "Cost", "Parts", "$0.00", "Subtotal", "GST", "Total"]
SCREENS["before-p2-part-sale-card.png"] = dict(size="1440x900", chrome=["HEADER (Parts active)"],
    ui=PS_COMMON + ["Description", "Part Number", "Qty", "Cost", "Core", "Sell Price", "Margin", "Category", "Vendor", "Status",
        "Actions", "Balance"], data=[],
    look=["Production part sale P2-256: customer card '4 Star Truck Repair' with Contact, Phone, Authorizer None; no Bill To."])
SCREENS["after-p2-part-sale-card.png"] = dict(size="1440x900", chrome=["HEADER (Parts active)"],
    ui=PS_COMMON + ["Bill To", "Description", "Part Number", "Quantity", "Cost", "Core", "Sell Price", "Margin", "Category",
        "Vendor", "Requested At", "Status", "Fees & Discounts", "Actions"], data=["7 Star Truck Repair"],
    look=["Part sale customer card gains 'Bill To' / '7 Star Truck Repair' as its last row, same style as on the work order card.",
          "Parts table columns differ from production (Quantity, Requested At, Fees & Discounts): newer develop work, not Bill To."])
WO_LIST_UI = ["All", "Estimates", "Work Orders", "Completed", "Search", "Assigned to me", "Asset on Site", "(columns icon)",
    "(list / person / board view icons)", "Create Work Order", "On Site", "Status", "Number", "Customer", "Asset", "Unit",
    "VIN/Serial #", "Progress", "Service Advisor", "Lead Technician", "Clocked..."]
WO_LIST_DATA = ["Approved", "S2-17435", "Andrews' Truck & Trailer Repai..", "2023 Hino Incomplete Vehicle", "L7", "2AYNF7AV7P3T10746",
    "0%", "Gerald Ortiz", "Unassigned", "S2-17578", "Buda Truck Repair", "2021 Kaufman Trailers Of Ne, Inc. Kaufma..", "854",
    "5SHFE4730MB001604", "Becky Gonzales", "S2-17579", "S2-17415", "Clinton Truck & Tr...", "23%", "S2-16912", "Colesville Diesel F...",
    "S2-17477", "Cameron Johnston", "S2-15887", "Continental Fleet ...", "Melanie Garner", "S2-17277", "2%", "S2-17554",
    "Coughlin & Sons T...", "S2-16747", "Delano Diesel Services LLC", "2023 XCMG ES125PD", "RP1", "XUG01251LPJE00018", "92%",
    "Daniel Montoya", "S2-17388", "74%", "S2-17095", "Desert Edge Truck Service & Re..", "1997 PTL", "2206262", "2P9LB62A8V1061236",
    "16%", "S2-17481", "Cummins QSX15-G9", "-", "79789048", "1", "2", "3", "7", "8", "9"]
NEW_WO_WINDOW = ["New Work Order", "x (close)", "Customer", "Add", "Asset", "Add", "Asset Here?", "View open work orders", "Save"]
SCREENS["before-p2-new-work-order.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=NEW_WO_WINDOW + WO_LIST_UI, data=["Buda Truck Repair", "2024 INTERNATIONAL CV515 854"] + WO_LIST_DATA,
    look=["Production New Work Order window: Customer (Buda Truck Repair) + Add, Asset (2024 INTERNATIONAL CV515 854) + Add, 'Asset "
          "Here?' ticked, 'View open work orders' (work orders is a blue link), Save. Work Orders list behind has no Bill To column."])
SCREENS["after-p2-new-work-order.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=NEW_WO_WINDOW + WO_LIST_UI, data=["Buda Truck Repair", "2024 INTERNATIONAL CV515 854"] + WO_LIST_DATA,
    look=["The window is identical to production: no Bill To field. The list toolbar behind sits further left (tabs start x~46 vs 59; "
          "Search x~620 vs 679) - release fixes, not Bill To. Work Orders list has no Bill To column."])
SCREENS["before-p2-phone-wo79-card.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Hide Details", "Lead Technician", "Service Advisor", "Sales Representative", "Contact", "Phone", "Authorizer", "None",
        "Engine", "Unit #"],
    data=["S2-17579", "Approved", "Started: Aug 31, 2026", "Total Hours: 4.3 hrs", "Progress", "0%", "Unassigned", "Becky Gonzales",
          "Buda Truck Repair", "Wendy Lopez", "071-234-2245", "2024 INTERNATIONAL CV515 854", "International 6.6", "854"],
    look=["Phone, details shown ('Hide Details' with a down arrow): work order card, customer card (Contact, Phone, Authorizer), asset card."])
SCREENS["after-p2-phone-wo79-card.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Hide Details", "Lead Technician", "Service Advisor", "Sales Representative", "Contact", "Phone", "Authorizer", "None",
        "Bill To", "Engine"],
    data=["S2-17579", "Approved", "Started: Aug 31, 2026", "Total Hours: 4.3 hrs", "Progress", "0%", "Unassigned", "Becky Gonzales",
          "Buda Truck Repair", "Wendy Lopez", "071-234-2245", "Valders Diesel & Fleet Repair", "2024 INTERNATIONAL CV515 854",
          "International 6.6"],
    look=["Phone: 'Bill To' / 'Valders Diesel & Fleet Repair' under Authorizer; the full name fits (the phone card is wider than the "
          "desktop card). Nothing phone-only."])

# ---- page 3: blocked states ---------------------------------------------------------------------------------------
WO17581 = ["S2-17581", "Paid", "Started: Nov 2, 2026", "Total Hours: 4.0 hrs", "Progress", "0%", "Unassigned", "Lines (1)", "Parts",
    "Notes", "Stats", "Finance", "(more icon)", "Name/Description", "Actual/Estimate", "Progress", "Status", "Action", "Rate", "Margin",
    "Total", "1", "Service - CVIP inspection single or tandem axle", "Annual inspection", "0.00 / 4.00", "Complete", "$0", "100%",
    "$400", "Story", "Dfgdfgdfg", "Labor", "Buda Truck Repair", "Contact", "Wendy Lopez", "Phone", "071-234-2245", "Authorizer",
    "None", "2024 INTERNATIONAL CV515 854", "Engine", "International 6.6", "Unit #", "854", "VIN/Serial #"]
SCREENS["before-p3-invoiced-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=["Lead technician", "Service advisor", "Sales representative"],
    data=WO17581 + ["1HTKTSWK4RH442544", "Mileage", "11,222"],
    look=["Production paid work order: read-only cards ('Lead technician', 'Service advisor', 'Sales representative' in sentence "
          "case); customer card values in grey; no Bill To."])
SCREENS["after-p3-invoiced-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=["Lead technician", "Service advisor", "Sales Representative", "Bill To"],
    data=WO17581 + ["Valders Diesel & Fleet Repair"],
    look=["Paid work order: customer card adds 'Bill To' (grey label) / 'Valders Diesel & Fleet Repair' (black, smaller text than on "
          "an open work order, so the whole name fits). No lock icon; looks like the other read-only rows.",
          "Label case differs within the card set: 'Lead technician', 'Service advisor' (production) beside 'Sales Representative' "
          "(Split Representatives work) - not Bill To."])
SCREENS["after-p3-invoiced-tooltip.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=["Lead technician", "Service advisor", "Sales Representative", "Bill To",
        "Invoiced. Reverse the invoice to change who's billed."],
    data=WO17581 + ["Valders Diesel & Fleet Repair"],
    look=["Hovering the Bill To: a dark-grey tooltip with white text 'Invoiced. Reverse the invoice to change who's billed.' shows "
          "BELOW the customer card, starting at the very left edge of the browser window (x=0) and overlapping the top of the asset "
          "card's title '2024 INTERNATIONAL'."])
SCREENS["after-p3-invoiced-toast.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=["Lead technician", "Service advisor", "Sales Representative", "Bill To",
        "Invoiced. Reverse the invoice to change who's billed.", "(warning triangle icon)", "Go To Invoice", "Close"],
    data=WO17581 + ["Valders Diesel & Fleet Repair"],
    look=["After a click: a RED error toast at the BOTTOM RIGHT of the window (about 400 x 87px) with a white warning-triangle icon, "
          "white text 'Invoiced. Reverse the invoice to change who's billed.' and two white text buttons on a second line, 'Go To "
          "Invoice' then 'Close'. The hover tooltip still shows at the bottom left (pointer on the field)."])
M1_10 = "This work order has a $10.00 deposit from 7 Star Truck Repair. Reverse it, change the Bill To, then take the deposit again under the new Bill To."
SCREENS["after-p3-deposits-card.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["Deposit held: 'Bill To' / '7 Star Truck Repair' at the bottom of the customer card; at rest it looks exactly like an "
          "editable Bill To (no lock icon, no grey-out). The Change Customer icon is not shown in this picture (pointer elsewhere)."])
SCREENS["after-p3-deposits-tooltip.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To", "(Change Customer icon, blue)", M1_10],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["Hover: dark-grey tooltip with the M1 text on ONE line (about 850px wide), at the bottom of the window, starting at the "
          "window's left edge (x=0), running far past the card into the page. The Change Customer icon shows blue (enabled)."])
SCREENS["after-p3-deposits-toast.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To", "(Change Customer icon, blue)", M1_10,
        "(warning triangle icon)", "Open Deposits", "Close"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["Click (admin): red error toast at the bottom right, warning icon, the M1 text wrapped over 3 lines, buttons 'Open Deposits' "
          "then 'Close' (white text) on the last line, right side. The hover tooltip still shows at the bottom left."])
HEADER_MARY_9919 = ["ShopHub", "Work Orders", "Schedule", "Customers", "Parts", "Search customers, work orders, ...", "Ctrl", "K",
    "Clock In", "Staging Heavy Duty - 9919", "MM"]
SCREENS["after-p3-mary-deposits-card.png"] = dict(size="1440x900", chrome=["HEADER_MARY_9919", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To", "(Change Customer icon, blue)"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["mary.moore (Foreman): her top bar (no Dashboard, no Reports, wide search box, 'Staging Heavy Duty - 9919', MM). She sees "
          "'Bill To' / '7 Star Truck Repair' at the bottom of the customer card, same look as admin's."])
SCREENS["after-p3-mary-deposits-toast.png"] = dict(size="1440x900", chrome=["HEADER_MARY_9919", "WO17577_TABS"],
    ui=["Lead Technician", "Service Advisor", "Sales Representative", "Bill To", "(Change Customer icon, blue)", M1_10,
        "(warning triangle icon)", "Close"],
    data=WO17577_DATA + ["Gerald Ortiz", "Unassigned", "7 Star Truck Repair"] + DESERT_EDGE_CARD,
    look=["Red error toast at the bottom right, M1 text wrapped over 4 lines, ONLY a 'Close' button, placed to the RIGHT of the text and "
          "vertically centred (not on a line below as in admin's toast). No 'Open Deposits'. The one-line tooltip still shows at the "
          "bottom left."])
SCREENS["after-p3-mary-phone-deposits-toast.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Hide Details", "Lead Technician", "Service Advisor", "Sales Representative", "Pinned Notes:", "Contact", "Phone",
        "(Change Customer icon)", M1_10, "(warning triangle icon)", "Close"],
    data=["S2-17577", "Estimate", "Started: Aug 31, 2026", "Total Hours: 4.0 hrs", "Progress", "0%", "David Combs", "Gerald Ortiz",
          "Unassigned", "Desert Edge Truck Service & Repair", DESERT_EDGE_CARD[2], "Brandon Juarez", "997-656-9359"],
    look=["Phone, details open: the red toast spans the screen width near the bottom (about 370px), warning icon, M1 text over 5 lines, "
          "'Close' on the right. The Bill To field is below the fold under the toast (not visible)."])
M2_VALDERS = "Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold"
SCREENS["before-p3-credit-hold-banner.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17579_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None"], data=WO17579_TOP + WO17579_LINES + ["Buda Truck Repair", "Wendy Lopez",
    "071-234-2245"] + WO15937_ASSET,
    look=["Production S2-17579 with Valders on Credit Hold: no banner, no Credit Hold pill (production checks only Buda, on COD)."])
SCREENS["after-p3-credit-hold-banner.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17579_TABS"],
    ui=["Credit Hold", M2_VALDERS, "Change Bill To", "Contact", "Phone", "Authorizer", "None", "Bill To"],
    data=WO17579_TOP + WO17579_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245", "Valders Diesel & Fleet Re"] +
    WO15937_ASSET[:5],
    look=["A full-width pink banner (light red fill) sits between the tabs and the lines table header: red text "
          "'Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold' (no full stop) on the first line, "
          "and 'Change Bill To' (red text button) at the bottom right of the banner.",
          "The work order card shows a red-outlined 'Credit Hold' pill beside 'Approved' under the number S2-17579.",
          "Customer card: 'Bill To' / 'Valders Diesel & Fleet Re' (cut)."])
FIN_TOOLBAR = ["Lines (5)", "Parts (8)", "Notes", "Stats", "Finance", "(more icon)", "Customer PO", "(download icon)", "(email icon)",
    "(print icon)", "(settings icon)", "Add Deposit", "Create Invoice", "Estimate/Invoice"]
EST17579_DOC = ["Staging Heavy Duty - 9919", "9919 Shepard Road SE", "Calgary, Alberta, T2C 4M5", "(403) 523 - 0488",
    "Estimate: EST-S2-17579", "Invoice Date: Nov 6, 2026", "Due date: Nov 6, 2026", "Bill To", "Remit payment to", "Unit",
    "VIN/Serial #", "Asset", "Mileage", "Eng Hrs", "854", "WLKDY421A9NJGF3Y9", "2024 INTERNATIONAL CV515", "11,222", "3,834",
    "Service Order", "Terms", "Due date", "Customer PO", "Authorizer", "S2-17579", "Nov 6, 2026", "Description", "Quantity", "Rate",
    "Amount", "Service - Wheels off single or tandem axle", "Labor", "Annual inspection", "$150.00", "Line Total"]
SCREENS["before-p3-credit-hold-finance.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=FIN_TOOLBAR + ["Contact", "Phone", "Authorizer", "None"],
    data=WO17579_TOP + EST17579_DOC + ["Buda Truck Repair", "8237 Brittney Divide Apt. 463", "Apt. 891",
    "Walshhaven, British Columbia, P5H 7C4", "COD", "Service - Perform LOF and inspection", "Preventative maintenance", "$224.93",
    "Parts", "washer fluid", "1", "$0.00", "Oil", "grease", "Wendy Lopez", "071-234-2245"] + WO15937_ASSET,
    look=["Production Finance tab: toolbar Customer PO field, download/email/print/settings icons, 'Add Deposit' (blue), "
          "'Create Invoice' (pale blue = disabled). No banner. Estimate preview: Bill To block = Buda (name and address, NO phone "
          "line), Terms COD."])
SCREENS["after-p3-credit-hold-finance.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)"],
    ui=FIN_TOOLBAR + ["Credit Hold", M2_VALDERS, "Change Bill To", "Contact", "Phone", "Authorizer", "None", "Bill To",
        "SERVICE FOR"],
    data=WO17579_TOP + EST17579_DOC + ["Valders Diesel & Fleet Repair", "2335 Thomas Well", "North Walterberg, Yukon Territory, E1P 1X4",
    "Buda Truck Repair", "Unit 854", "2024 INTERNATIONAL CV515", "Credit Hold", "Wendy Lopez", "071-234-2245",
    "Valders Diesel & Fleet Re"] + WO15937_ASSET[:5],
    look=["The same pink banner (M2 + 'Change Bill To') sits under the Finance toolbar, above the Estimate/Invoice switch. Toolbar "
          "unchanged in position; Create Invoice pale (disabled; here because no line is complete).",
          "Estimate preview: Bill To block = 'Valders Diesel & Fleet Repair', '2335 Thomas Well', 'North Walterberg, Yukon Territory, "
          "E1P 1X4' (NO phone line); Terms reads 'Credit Hold'. A grey bordered band 'SERVICE FOR  Buda Truck Repair · Unit 854 · "
          "2024 INTERNATIONAL CV515' shows full width under the Bill To / Remit payment to row, above the asset table: 'SERVICE FOR' "
          "small uppercase, the customer bold, the rest regular."])
SCREENS["after-p3-credit-hold-change-bill-to.png"] = dict(size="1440x900", chrome=["HEADER (partly covered)"],
    ui=["...rk Orders", "Schedule", "Customers", "Parts", "Reports", "Searc...", "Clock In", "Staging Heavy Duty - 9919", "AS",
        "...ts (8)", "Notes", "Stats", "Finance", "SHOPCOACH ANALYSIS", "New Line", "e. The Bill To customer, Valders Diesel & Fleet "
        "Repair, is on Credit Hold", "Change Bill To", "Bill To", "Name/Description", "Actual/Estimate", "Progress", "Status",
        "Action", "Rate", "Margin", "Total"],
    data=["Buda Truck Repair (this customer)", "Valders Diesel & Fleet Repair", "4 Star Truck Repair", "7 Star Truck Repair",
          "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC", "Aberdeen Truck Repair", "Abilene Mechanical Services",
          "Abode Trucking & Repair", "Valders Diesel & Fleet Re", "2024 INTERNATIONAL CV515 854", "Engine", "International 6.6",
          "Unit #", "854", "VIN/Serial #", "1HTKTSWK4RH442544", "Mileage", "11,222", "Engine Hours", "3,834", "License Plate",
          "0-BB695"] + WO17579_LINES,
    look=["After 'Change Bill To' the page scrolls and the card's Bill To field is focused (value selected) with its list open ABOVE "
          "it. The list is wider than the card and runs up over the app's top bar (covers the logo and 'Dashboard', 'Work Orders').",
          "ORDER: 'Buda Truck Repair (this customer)' first; then the CURRENT Bill To 'Valders Diesel & Fleet Repair' SECOND (blue on "
          "light blue), out of A-to-Z order; then 4 Star, 7 Star, A & J, Aberdeen ... A to Z. (In Edit Customer and the Bill Invoices "
          "To window the current pick stays in its A-to-Z place.)"])
SCREENS["after-p3-counter-sale-not-offered.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO_TABS"],
    ui=["Contact", "Phone", "Authorizer", "None", "Bill To", "(Change Customer icon)"],
    data=WO15937_HEADER + WO15937_LINES + ["Buda Truck Repair", "Wendy Lopez", "071-234-2245", "Gennadiy",
    "Buda Truck Repair (this customer)", "CV515 854", "Engine", "International 6.6", "Unit #", "854", "VIN/Serial #"],
    look=["Typed 'Gennadiy' (the Counter Sale customer's name in this data): the list shows only 'Buda Truck Repair (this customer)' - "
          "the Counter Sale customer is not offered; no message."])
PHONE_WO_SUMMARY = ["S2-17579", "Approved", "(edit icon)", "Customer", "Buda Truck Repair", "Unit #", "854", "Asset",
    "2024 INTERNATIONAL CV515", "Vin/Serial #", "WLKDY421A9NJGF3Y9", "Lines (5)", "Parts (8)", "Notes", "Stats", "Finance",
    "(more icon)", "New Line", "1.", "Approved", "Service - Wheels off single or tandem axle", "Annual inspection", "Tech Story",
    "Add tech story for this line", "Actual/Est: 0.00 / 1.50", "Start", "Complete", "2.", "Service - Perform LOF and inspection",
    "Preventative maintenance"]
SCREENS["before-p3-phone-credit-hold.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=PHONE_WO_SUMMARY + ["Inspection", "LOF Inspection", "v2", "Not started", "Open"], data=[],
    look=["Production phone S2-17579 (Valders on Credit Hold): summary card with Approved only, no banner."])
SCREENS["after-p3-phone-credit-hold.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=PHONE_WO_SUMMARY + ["Credit Hold", "Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold",
        "Change Bill To"], data=[],
    look=["Phone: red-outlined 'Credit Hold' pill beside 'Approved' in the summary card; pink banner under the tabs/New Line row, above "
          "line 1: the M2 text wraps over 2 lines (red), 'Change Bill To' (red) at the bottom right of the banner."])
SCREENS["after-p3-phone-credit-hold-change-bill-to.png"] = dict(size="390x844", chrome=[],
    ui=["Bill To", "Engine", "Unit #", "VIN/Serial #", "Mileage", "Engine Hours", "License Plate", "Fault Codes Lookup"],
    data=["Buda Truck Repair (this customer)", "Valders Diesel & Fleet Repair", "4 Star Truck Repair", "7 Star Truck Repair",
          "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC", "Aberdeen Truck Repair", "Abilene Mechanical Services",
          "2024 INTERNATIONAL CV515 854", "International 6.6", "854", "1HTKTSWK4RH442544", "11,222", "3,834", "0-BB695"],
    look=["Phone after tapping 'Change Bill To': Details open, scrolled to the customer card; Bill To field focused ('Valders Diesel & "
          "Fleet Repair' selected) with its list open ABOVE, covering the top of the screen incl. the top bar. Order: '(this customer)' "
          "first, current Bill To 'Valders Diesel & Fleet Repair' second (blue on light blue), then A to Z."])

# ---- page 4: printed documents (PDF page 1 rendered at 110 dpi, 910 x 1287) -------------------------------------------
SHOP = ["Staging Heavy Duty - 9919", "9919 Shepard Road SE", "Calgary, Alberta", "T2C 4M5", "(403) 523 - 0488",
    "Calgary, Alberta T2C 4M5"]
MODERN_INV_UI = ["Invoice:", "Invoice date:", "Paid date:", "ADDRESSES", "BILL TO", "REMIT PAYMENT TO", "ASSET", "UNIT", "PLATE",
    "MILEAGE", "ENG HRS", "VIN / SERIAL", "Work Order", "Terms", "WORK PERFORMED", "SCOPE OF WORK", "LABOR", "Line total", "SUMMARY",
    "Labor", "Parts", "Shop supplies", "Subtotal", "GST (5%)", "Total", "Payments", "Balance", "CUSTOMER SIGNATURE", "PRINTED NAME",
    "DATE", "Powered by", "ShopView", "Page 1 / 1",
    "Any warranties on the parts and accessories sold hereby are made by the manufacturer. You understand and agree that we make no "
    "warranties of any kind unless expressed in writing. You hereby authorize us to perform the repair work herein set forth and to "
    "purchase the necessary material and parts to perform such repair work. You agree that we are not responsible for loss or damage "
    "to your vehicle or articles left in your vehicle in case of fire, theft, or any other cause beyond our control or for any delays "
    "caused by unavailability of parts or delays in part shipments by the supplier or transporter. In addition, you agree that we are "
    "not responsible for damages to your vehicle from freezing due to lack of antifreeze. You hereby grant our employees permission to "
    "operate your vehicle on streets, highways, or elsewhere for the purpose of testing and/ or inspection. You acknowledge and agree "
    "that an express mechanic's lien on your vehicle is granted to secure payment of this invoice for the repair work detailed in this "
    "invoice."]
INV17581_DATA = ["INV-S2-17581", "Nov 2, 2026", "Valders Diesel & Fleet Repair", "2335 Thomas Well",
    "North Walterberg, Yukon Territory E1P 1X4", "2024 INTERNATIONAL CV515", "854", "CWI-6765", "11,222", "3,834",
    "WLKDY421A9NJGF3Y9", "S2-17581", "COD", "01", "Service - CVIP inspection single or tandem axle", "Annual inspection",
    "Dfgdfgdfg", "$400.00", "$0.00", "$42.00", "$442.00", "$22.10", "$464.10", "Nov 2, 2026 - Cash", "GST# 812694966 RT0001",
    "INV-S2-17581 - Page 1 / 1"]
SCREENS["before-p4-modern-invoice-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=MODERN_INV_UI,
    data=INV17581_DATA + ["839-680-8298"],
    look=["Production modern invoice: ADDRESSES box with BILL TO (Valders, saved on the invoice by the build) and REMIT PAYMENT TO side by "
          "side; then the asset row; no band. The Bill To phone line reads 839-680-8298 (Buda's number) under Valders' name."])
SCREENS["after-p4-modern-invoice-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=MODERN_INV_UI + ["SERVICE FOR"],
    data=INV17581_DATA + ["963-871-9453", "Buda Truck Repair", "Unit 854", "2024 INTERNATIONAL CV515"],
    look=["Modern: a full-width band (light grey fill, thin grey border, rounded corners) directly under the ADDRESSES box and above "
          "the ASSET row: 'SERVICE FOR' (small bold uppercase, letter-spaced), then 'Buda Truck Repair' (bold, larger), then "
          "' · Unit 854 · 2024 INTERNATIONAL CV515' (regular). Everything below moves down by the band's height (about 50px).",
          "Bill To block phone reads 963-871-9453 (Valders' own number)."])
LEGACY_UI = ["Invoice:", "Invoice Date:", "Due date:", "Bill To", "Remit payment to", "Unit", "VIN/Serial #", "Asset", "Mileage",
    "Eng Hrs", "Service Order", "Terms", "Due date", "Customer PO", "Authorizer", "Description", "Quantity", "Rate", "Amount",
    "Line Total", "Labor", "Parts", "Shop supplies", "Subtotal", "GST (5%)", "Total", "Payments", "Balance", "Customer signature:",
    "Printed name:", "Date:", "Powered by ShopView", "(terms paragraph: same words as the modern layout, 'testing and/or inspection')"]
LEG_INV17581_DATA = ["INV-S2-17581", "Nov 2, 2026", "Valders Diesel & Fleet Repair", "2335 Thomas Well",
    "North Walterberg, Yukon Territory, E1P 1X4", "854", "WLKDY421A9NJGF3Y9", "2024 INTERNATIONAL CV515", "11,222", "3,834",
    "S2-17581", "COD", "Service - CVIP inspection single or tandem axle", "Annual inspection", "Dfgdfgdfg", "$400.00", "$0.00",
    "$42.00", "$442.00", "$22.10", "$464.10", "Nov 2, 2026 - Cash", "GST# 812694966 RT0001", "INV-S2-17581 - Page 1 / 1"]
SCREENS["before-p4-legacy-invoice-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEGACY_UI, data=LEG_INV17581_DATA,
    look=["Production legacy invoice: 'Bill To' (left) and 'Remit payment to' (right) headings; Bill To shows name, street, city line - "
          "NO phone line; then the asset table. No band."])
SCREENS["after-p4-legacy-invoice-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEGACY_UI + ["SERVICE FOR"],
    data=LEG_INV17581_DATA + ["Buda Truck Repair", "Unit 854", "2024 INTERNATIONAL CV515"],
    look=["Legacy: the same band (grey fill, thin border, rounded) under Bill To / Remit payment to, above the asset table: "
          "'SERVICE FOR  Buda Truck Repair · Unit 854 · 2024 INTERNATIONAL CV515'. The legacy Bill To block still has NO phone line "
          "(PRD S7-R1 says the Bill To block prints name, address and phone)."])
MODERN_EST_UI = ["Estimate:", "Estimate date:", "ADDRESSES", "BILL TO", "ASSET", "PLATE", "VIN / SERIAL", "Work Order", "Terms",
    "WORK SUMMARY", "SUMMARY", "Labor", "Parts", "Subtotal", "GST (5%)", "Total", "CUSTOMER SIGNATURE", "PRINTED NAME", "DATE",
    "Powered by", "ShopView", "(terms paragraph, same words as on the invoices)"]
EST17582_DATA = ["EST-S2-17582", "Nov 5, 2026", "2017 Ford Transit", "KXS-6900", "2ZTM0GN6FHYZT4KXE", "S2-17582", "COD", "$0.00",
    "GST# 812694966 RT0001", "EST-S2-17582 - Page 1 / 1"]
SCREENS["before-p4-modern-estimate-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=MODERN_EST_UI,
    data=EST17582_DATA + ["A & J Truck & Trailer Repair", "17483 Shane Drive", "Patriciashire, Ontario B4Y6L9", "885-670-3999"],
    look=["Production modern estimate: one BILL TO box (no Remit payment to on an estimate) naming the customer A & J with address and "
          "phone; no band."])
SCREENS["after-p4-modern-estimate-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=MODERN_EST_UI + ["SERVICE FOR"],
    data=EST17582_DATA + ["Buda Truck Repair", "8237 Brittney Divide Apt. 463", "Apt. 891", "Walshhaven, British Columbia P5H 7C4",
    "839-680-8298", "A & J Truck & Trailer Repair", "2017 Ford Transit"],
    look=["Estimate billed to Buda: BILL TO box = Buda with address and phone; band 'SERVICE FOR  A & J Truck & Trailer Repair · 2017 "
          "Ford Transit' (no Unit part: the asset has no unit, so 'Unit' and its separator drop out)."])
LEG_EST_DATA = ["EST-", "S2-17582", "Nov 5, 2026", "2ZTM0GN6FHYZT4KXE", "2017 Ford Transit", "0", "COD", "$0.00",
    "GST# 812694966 RT0001", "EST-S2-17582 - Page 1 / 1"]
LEG_EST_UI = ["Estimate:", "Invoice Date:", "Due date:", "Bill To", "Remit payment to", "Unit", "VIN/Serial #", "Asset", "Mileage",
    "Eng Hrs", "Service Order", "Terms", "Due date", "Customer PO", "Authorizer", "Description", "Quantity", "Rate", "Amount", "Labor",
    "Parts", "Subtotal", "GST (5%)", "Total", "Payments", "Balance", "Customer signature:", "Printed name:", "Date:",
    "Powered by ShopView", "(terms paragraph)"]
SCREENS["before-p4-legacy-estimate-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_EST_UI,
    data=LEG_EST_DATA + ["A & J Truck & Trailer Repair", "17483 Shane Drive", "Patriciashire, Ontario, B4Y6L9"],
    look=["Production legacy estimate: Bill To = A & J (name, street, city line; no phone); no band."])
SCREENS["after-p4-legacy-estimate-billed-to-other.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_EST_UI + ["SERVICE FOR"],
    data=LEG_EST_DATA + ["Buda Truck Repair", "8237 Brittney Divide Apt. 463", "Apt. 891", "Walshhaven, British Columbia, P5H 7C4",
    "A & J Truck & Trailer Repair", "2017 Ford Transit"],
    look=["Legacy estimate: Bill To = Buda (no phone line); band 'SERVICE FOR  A & J Truck & Trailer Repair · 2017 Ford Transit' under "
          "the Bill To / Remit payment to row, above the asset table."])
PS_EST_UI = ["Estimate:", "Estimate date:", "ADDRESSES", "BILL TO", "ASSET", "UNIT", "PLATE", "MILEAGE", "VIN / SERIAL", "Terms",
    "PARTS", "SUMMARY", "Parts", "Subtotal", "GST (5%)", "Total", "CUSTOMER SIGNATURE", "PRINTED NAME", "DATE", "Powered by",
    "ShopView", "(terms paragraph)"]
PS256_DATA = ["EST-P2-256", "Nov 5, 2026", "2011 Hyundai Santa Fe", "4417", "ZZP-6028", "225,584", "PV1T2SK1DNUUK7YDE", "COD",
    "$0.00", "GST# 812694966 RT0001", "EST-P2-256 - Page 1 / 1"]
SCREENS["before-p4-modern-part-sale-with-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=PS_EST_UI,
    data=PS256_DATA + ["4 Star Truck Repair", "6263 Elizabeth Causeway Apt. 973", "Raystad, British Columbia V4M 8Y2", "730-246-8895"],
    look=["Production modern PART SALE ESTIMATE (EST-P2-256, not an invoice): BILL TO = 4 Star; asset row with unit 4417; no band."])
SCREENS["after-p4-modern-part-sale-with-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=PS_EST_UI + ["SERVICE FOR"],
    data=PS256_DATA + ["7 Star Truck Repair", "305 Harris Cape", "Priscillabury, Nunavut H8A3X9", "609-461-6502",
    "4 Star Truck Repair", "Unit 4417", "2011 Hyundai Santa Fe"],
    look=["Part sale estimate billed to 7 Star: band 'SERVICE FOR  4 Star Truck Repair · Unit 4417 · 2011 Hyundai Santa Fe' under the "
          "BILL TO box. It is an estimate; no part sale INVOICE is shown anywhere in the design."])
LEG_PS_UI = ["Estimate:", "Invoice Date:", "Due date:", "Bill To", "Remit payment to", "Unit", "VIN/Serial #", "Asset", "Mileage",
    "Eng Hrs", "Parts Order", "Terms", "Due date", "Customer PO", "Authorizer", "Description", "Quantity", "Rate", "Amount",
    "Subtotal", "GST (5%)", "Total", "Payments", "Balance", "Customer signature:", "Printed name:", "Date:", "Powered by ShopView",
    "(terms paragraph)"]
LEG_PS256 = ["EST-P2-256", "Nov 5, 2026", "4417", "PV1T2SK1DNUUK7YDE", "2011 Hyundai Santa Fe", "225,584", "0", "P2-256", "COD",
    "$0.00", "GST# 812694966 RT0001", "EST-P2-256 - Page 1 / 1"]
SCREENS["before-p4-legacy-part-sale-with-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_PS_UI,
    data=LEG_PS256 + ["4 Star Truck Repair", "6263 Elizabeth Causeway Apt. 973", "Raystad, British Columbia, V4M 8Y2"],
    look=["Production legacy part sale estimate: Bill To = 4 Star; no band."])
SCREENS["after-p4-legacy-part-sale-with-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_PS_UI + ["SERVICE FOR"],
    data=LEG_PS256 + ["7 Star Truck Repair", "305 Harris Cape", "Priscillabury, Nunavut, H8A3X9", "4 Star Truck Repair", "Unit 4417"],
    look=["Legacy part sale estimate: Bill To = 7 Star; band 'SERVICE FOR  4 Star Truck Repair · Unit 4417 · 2011 Hyundai Santa Fe'."])
PS254_DATA = ["EST-P2-254", "Nov 5, 2026", "COD", "$0.00", "GST# 812694966 RT0001", "EST-P2-254 - Page 1 / 1"]
PS_EST_NOVEH_UI = [w for w in PS_EST_UI if w not in ("ASSET", "UNIT", "PLATE", "MILEAGE", "VIN / SERIAL")]
SCREENS["before-p4-modern-part-sale-no-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=PS_EST_NOVEH_UI,
    data=PS254_DATA + ["4 Star Truck Repair", "6263 Elizabeth Causeway Apt. 973", "Raystad, British Columbia V4M 8Y2", "730-246-8895"],
    look=["Production modern part sale estimate without a vehicle: BILL TO = 4 Star; no asset row; no band."])
SCREENS["after-p4-modern-part-sale-no-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=PS_EST_NOVEH_UI + ["SERVICE FOR"],
    data=PS254_DATA + ["7 Star Truck Repair", "305 Harris Cape", "Priscillabury, Nunavut H8A3X9", "609-461-6502",
    "4 Star Truck Repair"],
    look=["Band with only 'SERVICE FOR  4 Star Truck Repair' (no separator, no unit) under the BILL TO box, above 'Terms COD'."])
LEG_PS_NOVEH_UI = [w for w in LEG_PS_UI if w not in ("Unit", "VIN/Serial #", "Asset", "Mileage", "Eng Hrs")]
SCREENS["before-p4-legacy-part-sale-no-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_PS_NOVEH_UI,
    data=["EST-P2-254", "Nov 5, 2026", "P2-254", "COD", "$0.00", "4 Star Truck Repair", "6263 Elizabeth Causeway Apt. 973",
          "Raystad, British Columbia, V4M 8Y2", "GST# 812694966 RT0001", "EST-P2-254 - Page 1 / 1"],
    look=["Production legacy part sale estimate, no vehicle: Bill To = 4 Star; no asset table; no band."])
SCREENS["after-p4-legacy-part-sale-no-vehicle.png"] = dict(size="910x1287", chrome=["SHOP"], ui=LEG_PS_NOVEH_UI + ["SERVICE FOR"],
    data=["EST-P2-254", "Nov 5, 2026", "P2-254", "COD", "$0.00", "7 Star Truck Repair", "305 Harris Cape",
          "Priscillabury, Nunavut, H8A3X9", "4 Star Truck Repair", "GST# 812694966 RT0001", "EST-P2-254 - Page 1 / 1"],
    look=["Legacy: band 'SERVICE FOR  4 Star Truck Repair' (name only) between the Bill To row and the Parts Order table."])
INV17322_DATA = ["Heavy Duty - 9919", "9919 Shepard Road SE", "Calgary, Alberta", "T2C 4M5", "(403) 523 - 0488", "INV-S2-17322",
    "Aug 31, 2026", "Sep 30, 2026", "Zero Truck and Trailer Repair (IBS#: 873606)", "2247 Spencer Roads",
    "South Kennethside, Yukon Territory B1G3H7", "940-826-3697", "Foothills Group Inc c/o Interstate Billing Service",
    "C/O T04220C PO Box 4220, STN A", "Toronto, Ontario M5W 3B9", "2011 ISUZU NQR/NRR", "ONR-3722", "363,551", "10,210",
    "RDC54B39CG3BWHBK9", "S2-17322", "Tim", "Net 30", "01", "Service - Perform LOF and inspection", "Preventative maintenance",
    "JP: Performed a lube, oil, and filter (LOF) service. Drained the engine oil and removed the existing oil filter. Pre-filled the "
    "new oil filter before installation, then refilled the engine with the appropriate oil and verified the oil level.",
    "Greased the unit at all required lubrication points and topped up the windshield washer fluid. Rechecked the engine oil level "
    "and adjusted as required.", "Completed a general inspection of the unit and documented additional repairs as identified during "
    "the inspection. Job complete.", "$224.93", "Windshield Washer Fluid 4L", "1", "$7.07", "Brake & Parts Cleaner", "$7.99",
    "15W40 Bulk- Mobil 1 Delvac HDEO", "9", "$7.47", "$67.23", "EP2 Grease Tube, 390G", "$11.50", "Engine Oil Filter, Isuzu/Hino",
    "$62.24", "$380.96", "02", "Service - Air filter", "JP: Removed air filter. Cleaned hosuing replaced with new. Job complete.",
    "$74.98", "Air Filter", "$175.54", "$250.52", "GST# 812694966 RT0001", "INV-S2-17322 - Page 1 / 4"]
SCREENS["before-p4-modern-invoice-pays-for-itself.png"] = dict(size="910x1287", chrome=[],
    ui=["Invoice:", "Invoice date:", "Due date:", "ADDRESSES", "BILL TO", "REMIT PAYMENT TO", "ASSET", "PLATE", "MILEAGE", "ENG HRS",
        "VIN / SERIAL", "Work Order", "Customer PO", "Terms", "WORK PERFORMED", "SCOPE OF WORK", "LABOR", "PARTS", "Line total"],
    data=INV17322_DATA,
    look=["Invoice that pays for itself (S2-17322): Bill To 'Zero Truck and Trailer Repair (IBS#: 873606)' with IBS remit-to; no band. "
          "Page 1 of 4."])
SCREENS["after-p4-modern-invoice-pays-for-itself.png"] = dict(same_bytes_as="before-p4-modern-invoice-pays-for-itself.png",
    look=["Byte-identical (md5) to the production render: no band, nothing changed."])
SCREENS["before-p4-legacy-invoice-pays-for-itself.png"] = dict(size="910x1287", chrome=[],
    ui=["Invoice:", "Invoice Date:", "Due date:", "Bill To", "Remit payment to", "Unit", "VIN/Serial #", "Asset", "Mileage", "Eng Hrs",
        "Service Order", "Terms", "Due date", "Customer PO", "Authorizer", "Description", "Quantity", "Rate", "Amount", "Labor",
        "Parts", "Line Total", "Powered by ShopView"],
    data=INV17322_DATA[:9] + ["South Kennethside, Yukon Territory, B1G3H7", "Toronto, Ontario, M5W 3B9", "2011 ISUZU NQR/ NRR"] +
    INV17322_DATA[12:],
    look=["Legacy invoice that pays for itself: Bill To with '(IBS#: 873606)', no phone line; no band. Page 1 of 4."])
SCREENS["after-p4-legacy-invoice-pays-for-itself.png"] = dict(same_bytes_as="before-p4-legacy-invoice-pays-for-itself.png",
    look=["Byte-identical (md5) to the production render: no band, nothing changed."])
SCREENS["before-p4-batch.png"] = dict(size="910x1287", chrome=["SHOP"],
    ui=LEGACY_UI + ["Software Powered by ShopView", "Page 1 of 7"], data=LEG_INV17581_DATA[:-1],
    look=["Production batch PDF, page 1 of 7: INV-S2-17581 in the legacy layout (Bill To Valders, no phone, no band); footer 'GST# "
          "812694966 RT0001' / 'Software Powered by ShopView' and 'Page 1 of 7'."])
SCREENS["after-p4-batch.png"] = dict(size="910x1287", chrome=["SHOP"],
    ui=LEGACY_UI + ["Software Powered by ShopView", "Page 1 of 7", "SERVICE FOR"],
    data=LEG_INV17581_DATA[:-1] + ["Buda Truck Repair", "Unit 854", "2024 INTERNATIONAL CV515"],
    look=["Batch page 1 of 7: the band 'SERVICE FOR  Buda Truck Repair · Unit 854 · 2024 INTERNATIONAL CV515' under Bill To / Remit "
          "payment to. Only page 1 is pictured: S2-17513's band ('Orchard City Truck & Trailer Repair', 'Unit 15', '2018 Freightliner "
          "114sd') and S2-17322 with no band are stated in the caption only, not shown. Batch shown in the legacy layout only."])

# ---- page 5: getting paid --------------------------------------------------------------------------------------------
AJ_INV_TABS = ["Work Orders (2)", "Part Sales", "Contacts (1)", "Assets (1)", "Notes", "Invoices (2)", "Payments (1)", "Deposits",
    "Fees & Discounts (0)", "Balance:", "Search", "Open only", "(download icon)", "(email icon)", "(print icon)", "Issue Credit",
    "New Payment", "Date", "Type", "No.", "Memo", "Total", "Balance", "Status", "Action", "Invoice", "Unpaid", "Partially Paid"]
AJ_INV_DATA = ["$1,679.02", "Oct 30, 2026", "S2-17513", "-", "$1,083.27", "S2-17362", "$596.75", "$595.75"]
SCREENS["before-p5-aj-invoices.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_BEFORE"], ui=AJ_INV_TABS, data=AJ_INV_DATA,
    look=["Production A & J Invoices tab (Open only on): columns Date, Type, No., Memo, Total, Balance, Status, Action; two invoices; "
          "Balance: $1,679.02 in green; New Payment pale (disabled, nothing ticked)."])
SCREENS["after-p5-aj-invoices.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER"], ui=AJ_INV_TABS + ["Service For"],
    data=AJ_INV_DATA + ["Orchard City Truck & Trailer Repair", "Phillipsburg Truck & Trailer Repair"],
    look=["New column header 'Service For' (Title Case) right AFTER 'No.' and before 'Memo'; cells 'Orchard City Truck & Trailer Repair' "
          "and 'Phillipsburg Truck & Trailer Repair' in regular black text (not links). Date/Type/No. columns shift left to make room; "
          "the Service For text runs right up to the Memo '-' (no wrap, no overlap at 1440).",
          "Card shows 'Bill Invoices To' Mayfield Heights Truck Centre / Change and 'Pays for 1'."])
VALDERS_CARD = ["Valders Diesel & Fleet Repair", "(edit icon)", "Address", "2335 Thomas Well", "North Walterberg, Yukon Territ...",
    "E1P 1X4", "Phone", "963-871-9453", "Credit term", "COD", "Credit limit", "$0.00", "Sales Representative", "Website", "N/A", "IBS",
    "Contacts", "1", "Assets", "1"]
VALDERS_TABS = ["Work Orders", "Part Sales", "Contacts (1)", "Assets (1)", "Notes", "Invoices (1)", "Payments (2)", "Deposits",
    "Fees & Discounts (0)", "Balance:", "$0.00", "Search", "Open only", "Issue Credit", "New Payment", "Date", "Type", "No.", "Memo",
    "Total", "Balance", "Status", "Action", "Invoice", "Paid"]
SCREENS["before-p5-valders-invoices-all.png"] = dict(size="1440x900", chrome=["HEADER", "VALDERS_CARD (Sales Representative N/A)"],
    ui=VALDERS_TABS, data=["Nov 2, 2026", "S2-17581", "-", "$464.10", "$0.00"],
    look=["Production Valders Invoices tab, Open only OFF: S2-17581 Paid; no Service For column."])
SCREENS["after-p5-valders-invoices-all.png"] = dict(size="1440x900", chrome=["HEADER", "VALDERS_CARD (Sales Representative Unassigned)"],
    ui=VALDERS_TABS + ["Service For"], data=["Nov 2, 2026", "S2-17581", "Buda Truck Repair", "-", "$464.10", "$0.00"],
    look=["'Service For' column after No.: 'Buda Truck Repair' on S2-17581 (Paid). Valders has no default and pays for nobody by "
          "default here (no Bill Invoices To line, no Pays for counter)."])
SCREENS["before-p5-aj-rows-selected.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_BEFORE"], ui=AJ_INV_TABS + ["Totals selected"],
    data=AJ_INV_DATA + ["$1,680.02"],
    look=["Production: both rows ticked; 'Totals selected' row $1,680.02 / $1,679.02 (green); New Payment turns solid blue (enabled); "
          "Issue Credit greys out."])
SCREENS["after-p5-aj-rows-selected.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER"],
    ui=AJ_INV_TABS + ["Service For", "Totals selected"],
    data=AJ_INV_DATA + ["$1,680.02", "Orchard City Truck & Trailer Repair", "Phillipsburg Truck & Trailer Repair"],
    look=["Same as production with the Service For column; New Payment enabled; Totals selected $1,680.02 / $1,679.02."])
PAY_WINDOW_UI = ["New Customer Payment", "x (close)", "Payment Date", "(calendar icon)", "Payment Method", "Reference Number", "Memo",
    "No.", "Date", "Due", "Balance", "Payment", "Amount to credit:", "Payment amount:", "Make Payment", "Send to Terminal", "$"]
PAY_WINDOW_DATA = ["Nov 06, 2026", "S2-17362", "Oct 30, 2026", "$595.75", "595.75", "S2-17513", "$1,083.27", "1,083.27", "0.00",
    "$1,679.02"]
SCREENS["before-p5-aj-new-payment.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_BEFORE (dimmed)", "AJ invoices (dimmed)"],
    ui=PAY_WINDOW_UI, data=PAY_WINDOW_DATA,
    look=["Production 'New Customer Payment' window: left column Payment Date / Payment Method / Reference Number / Memo; right table "
          "No. (blue links), Date, Due, Balance, Payment ($ inputs); Amount to credit $0.00; Payment amount $1,679.02; 'Make Payment' "
          "(pale, disabled until a method is picked) and 'Send to Terminal' (blue)."])
SCREENS["after-p5-aj-new-payment.png"] = dict(size="1440x900", chrome=["HEADER", "AJ_CARD_AFTER (dimmed)", "AJ invoices (dimmed)"],
    ui=PAY_WINDOW_UI, data=PAY_WINDOW_DATA,
    look=["The payment window is identical to production (no Service For column in the window); it lists both of A & J's invoices "
          "across the two customers it pays for. The Service For header is visible behind the dimmed overlay."])
ORCHARD_CARD = ["Orchard City Truck & Trailer Repair", "(edit icon)", "Address", "965 Smith Course", "Port Peterchester, Yukon Territo...",
    "Y5P 3K3", "Phone", "491-406-3151", "Credit term", "Net 30", "Credit limit", "$10,000.00", "Sales Representative", "Website",
    "N/A", "IBS", "816970", "Contacts", "8", "Assets", "27", "Notes",
    "Consequatur quisquam soluta accusamus. Earum accusantium asperiores dolorum voluptatum quisquam."]
ORCHARD_TABS = ["Work Orders (105)", "Part Sales", "Contacts (8)", "Assets (27)", "Notes (1)", "Invoices", "Payments (106)", "Deposits",
    "Fees & Discounts (0)", "Balance:", "$0.00", "Search", "Open only", "Issue Credit", "New Payment", "Date", "Type", "No.", "Memo",
    "Total", "Balance", "Status", "Action", "Empty bays, endless possibilities. Get Going!"]
SCREENS["before-p5-orchard-invoices.png"] = dict(size="1440x900", chrome=["HEADER", "ORCHARD_CARD (Sales Representative N/A)"],
    ui=ORCHARD_TABS, data=[], look=["Production Orchard City Invoices tab (Open only on): empty, Balance $0.00."])
SCREENS["after-p5-orchard-invoices.png"] = dict(size="1440x900", chrome=["HEADER", "ORCHARD_CARD (Sales Representative Unassigned)"],
    ui=ORCHARD_TABS, data=[],
    look=["Orchard City (the customer of S2-17513, billed to A & J): its Invoices tab is empty, Balance $0.00; no Service For column; "
          "its card has no Bill Invoices To line (the Bill To was picked on the job, not saved as a default)."])
SEND_UI = ["Sending invoice", "x (close)", "Include 'For Customer' Attachments in email", "You're about to send invoice to selected contacts:",
    "Optional Emails (Comma Separated)", "Hello,", "Please find your attached invoice for work order:", "Email Content",
    "Best regards,", "Include your email to BCC", "Send Email"]
SEND_DATA = ["S2-17581", "Admin ShopView", "Foothills Group Inc", "(403) 523 - 0488"]
SCREENS["before-p5-invoice-email.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17581 page dimmed"],
    ui=SEND_UI, data=SEND_DATA + ["Wendy Lopez", "wendy.lopez2@staging.shopview.local"],
    look=["Production 'Sending invoice' window for S2-17581: 'Include 'For Customer' Attachments in email' unticked; one contact row, "
          "'Wendy Lopez wendy.lopez2@staging.shopview.local' ticked (Buda's contact); Optional Emails box focused; email body; BCC "
          "switch off; Send Email."])
SCREENS["after-p5-invoice-email.png"] = dict(size="1440x900", chrome=["HEADER (Work Orders active)", "WO17581 page dimmed"],
    ui=SEND_UI, data=SEND_DATA + ["George Thomas", "george.thomas@staging.shopview.local", "Valders Diesel & Fleet Repair"],
    look=["Same window; the contact row is now 'George Thomas george.thomas@staging.shopview.local' (Valders' contact) ticked; no "
          "customer name is shown beside the contact. Attachments box unticked. No loading state is pictured."])
PHONE_AJ = ["A & J Truck & Trailer Repair", "Address", "17483 Shane DrivePatriciashire, OntarioB4Y6L9", "Phone", "885-670-3999",
    "Credit term", "COD", "Credit limit", "$0.00", "Website", "N/A", "IBS", "Contacts", "1", "Assets", "1", "<", "rs (2)", "Part Sales",
    "Contacts (1)", "Assets (1)", "Notes", ">", "Balance:", "$1,679.02", "Search", "Open only", "Issue Credit", "New Payment"]
SCREENS["before-p5-phone-aj-invoices.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=PHONE_AJ + ["Sales Representative", "N/A", "Date", "Type", "No.", "Memo", "Tot..."], data=[],
    look=["Production phone: card first, then the tabs (scrolling), Balance, Search, Open only, icons, full-width Issue Credit and New "
          "Payment, then the table header Date, Type, No., Memo, Tot..."])
SCREENS["after-p5-phone-aj-invoices.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=PHONE_AJ + ["Sales Representative", "Unassigned", "Bill Invoices To", "Change", "Pays for"],
    data=["Mayfield Heights Truck Centre"],
    look=["Phone: card adds 'Bill Invoices To' / 'Mayfield Heights Truck Centre  Change' (one line) and a third counter 'Pays for 1' "
          "(blue). The invoice table is pushed below the fold, so the Service For column is NOT visible in this picture."])

# ---- page 6: deleting a customer that pays for others (Murrieta Diesel Repair) -------------------------------------------
MURRIETA_CARD = ["Murrieta Diesel Repair", "(edit icon)", "Address", "9982 Espinoza Lodge Suite 631", "Lake Paula, Manitoba", "G2M 4Y2",
    "Phone", "684-154-9226", "Credit term", "COD", "Credit limit", "$0.00", "Sales Representative", "Website", "N/A", "IBS",
    "Contacts", "0", "Assets", "0"]
MURRIETA_BEHIND = ["Work Orders", "Search", "Status", "New Work Order", "Status", "Number", "Created On", "Invoiced Date", "Days Open",
    "Parts", "Return..."]
SCREENS["before-p6-edit-bottom.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Sales Representative N/A)", "MURRIETA_BEHIND"],
    ui=["Address 1", "Address 2", "City", "ZIP/Postal Code", "State/Province", "Country", "Credit Terms", "Credit Limit",
        "Sales Representative", "Default Labor Rate", "Default Shop Supplies", "Min", "Max", "Notes", "Website", "IBS", "Taxes",
        "Default Tax Settings", "PO is required", "Delete", "Save"],
    data=["9982 Espinoza Lodge Suite 631", "Lake Paula", "G2M 4Y2", "Manitoba", "Canada", "COD", "$ 0.00"],
    look=["Production Edit Customer for Murrieta, scrolled to the bottom: 'Delete' (dark red, hovered) and 'Save'."])
SCREENS["after-p6-edit-bottom.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Sales Representative Unassigned)", "MURRIETA_BEHIND"],
    ui=["Address 1", "+", "City", "ZIP/Postal Code", "State/Province", "Country", "Credit Terms", "Credit Limit", "Bill Invoices To",
        "This customer", "New work orders and part sales bill to this customer. Existing ones don't change.", "Sales Representative",
        "Unassigned", "+", "Default Labor Rate", "Default Shop Supplies", "Min", "Max", "Notes", "Website", "IBS", "Taxes",
        "Default Tax Settings", "PO is required", "Delete", "Save", "Pays for", "1"],
    data=["9982 Espinoza Lodge Suite 631", "Lake Paula", "G2M 4Y2", "Manitoba", "Canada", "COD", "$ 0.00"],
    look=["Murrieta (bills itself): 'Bill Invoices To' reads 'This customer' with the help line under it. Card counters: Contacts 0, "
          "Assets 0, Pays for 1 (blue). Delete is still offered (dark red)."])
CONFIRM_UI = ["Confirmation", "x (close)", "Are you sure you want to delete this company?", "Cancel", "Delete"]
SCREENS["before-p6-delete-first.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Sales Representative N/A)", "Edit Customer dimmed"],
    ui=CONFIRM_UI, data=[],
    look=["Production 'Confirmation' window over Edit Customer: large bold title, 'Are you sure you want to delete this company?', "
          "'Cancel' (grey) then 'Delete' (red)."])
SCREENS["after-p6-delete-first.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Sales Representative Unassigned, Pays for 1)", "Edit Customer dimmed"],
    ui=CONFIRM_UI + ["Bill Invoices To", "This customer", "New work orders and part sales bill to this customer. Existing ones don't change."],
    data=[], look=["The same Confirmation window as production; unchanged."])
D8_REFUSAL = "This customer is the default Bill To for Valders Diesel & Fleet Repair. Remove it from that customer first."
SCREENS["after-p6-blocked.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Pays for 1)", "Edit Customer and Confirmation dimmed"],
    ui=["Delete Customer", "x (close)", D8_REFUSAL, "Cancel", "Remove As Default Bill To"],
    data=["Valders Diesel & Fleet Repair"],
    look=["After clicking Delete in the Confirmation window, a 'Delete Customer' window opens ON TOP of it (the Confirmation stays "
          "visible, dimmed, behind). Its title row has a YELLOW background (warning style) with a large bold 'Delete Customer' and a "
          "blue x; body: the refusal sentence (wraps after 'Repair.'), then a bulleted list with 'Valders Diesel & Fleet Repair' as an "
          "underlined blue link; buttons 'Cancel' (grey) then 'Remove As Default Bill To' (blue), bottom right."])
D8_CONFIRM = "Remove Murrieta Diesel Repair as the default Bill To for 1 customer? Open work orders keep their Bill To."
SCREENS["after-p6-remove-confirm.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Pays for 1)", "Edit Customer, Confirmation, Delete Customer dimmed"],
    ui=["Remove as default Bill To", "x (close)", D8_CONFIRM, "Cancel", "Remove"], data=[],
    look=["A third window on top: title 'Remove as default Bill To' (large bold, sentence case), the D8 question over two lines, buttons "
          "'Cancel' (grey) then 'Remove' (blue) at the bottom right. The yellow 'Delete Customer' header is visible (dimmed) behind it.",
          "Button ORDER is Cancel, Remove; PRD S12-R4 and §8 D8 list 'Remove', 'Cancel' and §8 says buttons are 'listed as they render'."])
SCREENS["after-p6-remove-result.png"] = dict(size="1440x900", chrome=["HEADER", "MURRIETA_CARD (Pays for 1)", "Edit Customer dimmed"],
    ui=CONFIRM_UI + ["Bill Invoices To", "This customer", "New work orders and part sales bill to this customer. Existing ones don't change."],
    data=[],
    look=["After Remove: back on the 'Confirmation' window ('Are you sure you want to delete this company?'); 'Cancel' looks pale "
          "(lighter grey) and 'Delete' red. The card behind STILL shows 'Pays for 1' (the caption says this was fixed after the shot)."])
SCREENS["after-p6-del-after-remove.png"] = dict(size="1440x900", chrome=["HEADER"],
    ui=["Work Orders", "Part Sales", "Contacts", "Assets", "Notes", "Invoices", "Payments", "Deposits", "Fees & Discounts (0)", "Search",
        "Status", "New Work Order", "Status", "Number", "Asset", "Unit", "VIN/Serial #", "Progress", "Lead Technician", "Lines",
        "Total Price", "Created On", "Invoiced Date", "Days Open", "Parts", "Ret...", "Empty bays, endless possibilities. Get Going!"] +
       [w for w in MURRIETA_CARD if w not in ("Sales Representative",)] + ["Sales Representative", "Unassigned"],
    data=[], look=["Reloaded Murrieta page: counters Contacts 0 / Assets 0 only - no 'Pays for' counter. Murrieta still exists."])
SCREENS["before-p6-phone-delete-first.png"] = dict(size="390x844", chrome=["PHONE_TOP (dimmed)"],
    ui=CONFIRM_UI + ["City", "ZIP/Postal Code", "State/Province", "Country", "Credit Terms", "Credit Limit", "Sales Representative",
        "Default Labor Rate", "IBS", "Taxes", "Default Tax Settings", "PO is required", "Save"],
    data=["Lake Paula", "G2M 4Y2", "Manitoba", "Canada", "COD", "$ 0.00"],
    look=["Production phone: Confirmation window with full-width stacked buttons 'Cancel' (grey) above 'Delete' (red)."])
SCREENS["after-p6-phone-delete-first.png"] = dict(size="390x844", chrome=["PHONE_TOP (dimmed)"],
    ui=CONFIRM_UI + ["Credit Terms", "Credit Limit", "Bill Invoices To", "This customer",
        "New work orders and part sales bill to this customer. Existing ones don't change.", "Sales Representative", "Unassigned", "+",
        "Default Labor Rate", "IBS", "Taxes", "Default Tax Settings", "PO is required", "Save"],
    data=["COD", "$ 0.00"],
    look=["Phone (default already removed): the plain Confirmation, same as production. Behind it the phone Edit Customer shows 'Bill "
          "Invoices To' / 'This customer' with the help line wrapped over 2 lines."])

# ---- page 7: asset Work Orders tab ("shop heavy") --------------------------------------------------------------------------
ASSET_CARD = ["shop heavy", "(edit icon)", "Year:", "VIN/Serial #:", "C1BKL36L60D9C4SKW", "Licence Plate:", "DCL-8441", "Type:",
    "Other", "Unit:", "Color:", "Mileage:", "73", "Eng. Hr.:", "12", "Engine:", "Trim:", "Drivetrain:", "Fault Codes Lookup",
    "Quartzsite Truck Service & Repair", "(change owner icon)", "Address", "0794 Willie Mills Suite 010", "Port Josephshire", "Phone",
    "908-734-7978", "Preferred Contact", "Mark Richardson", "Phone"]
ASSET_TABS = ["Work Orders", "Invoices", "Notes", "Inspections", "Search", "Status", "New", "On Site", "Status", "Number", "Customer",
    "Asset", "Unit", "VIN/Serial #", "Progress", "Lead Technician", "Total Price", "Created On", "Days Open", "AI",
    "SHOPCOACH ASSET HISTORY", "Asset History"]
SCREENS["before-p7-asset-work-orders.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "ASSET_CARD"],
    ui=ASSET_TABS + ["e.g. when did we work on the turbo?", "View All History"],
    data=["Approved", "S2-16988", "Quartzsite Truck Service & Repair", "shop heavy", "-", "SHOP", "0%", "Unassigned", "$136.55",
          "Aug 4, 2026", "94 days"],
    look=["Production asset tab: only the current owner's S2-16988; toolbar Search, Status, New (blue); column 'Number' sorted up (▲); "
          "ShopCoach Asset History box below."])
KOLOSOV_ROWS = ["Paid", "S2-4597", "Kolosov's Diesel Repair", "shop heavy", "-", "SHOP", "0%", "Unassigned", "Jan 24, 2025", "651 days",
    "S2-5018", "Feb 12, 2025", "632 days", "S2-5878", "87%", "Mar 20, 2025", "596 days", "S2-6679", "Apr 23, 2025", "562 days",
    "S2-7889", "100%", "Kenneth Oconnor", "Jun 10, 2025", "514 days", "S2-8275", "98%", "Michael Newman", "Jun 26, 2025", "498 days",
    "S2-9042", "Cameron Johnston", "Aug 1, 2025", "462 days", "S2-9051", "Allison Hughes", "S2-9675", "Monica Brady", "Sep 2, 2025",
    "430 days", "S2-9875", "Sep 9, 2025", "423 days", "S2-10058", "Sep 18, 2025", "414 days", "S2-10149", "Sep 23, 2025", "409 days",
    "S2-11135", "115%", "Nov 5, 2025", "366 days"]
SCREENS["after-p7-asset-work-orders.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "ASSET_CARD"],
    ui=ASSET_TABS + ["Customer: All customers", "(building icon)"], data=KOLOSOV_ROWS,
    look=["Toolbar now: Search, Status, a new chip '(building icon) Customer: All customers' with a down arrow, then New at the right "
          "edge; Search and Status moved left; one line, nothing wraps at 1440.",
          "The list shows the whole history oldest first: Kolosov's Diesel Repair's Paid work orders (S2-4597 ... S2-11135) appear "
          "(pink pin = off site for the first three). No Bill To column (no row bills someone else)."])
SCREENS["after-p7-asset-customer-open.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "ASSET_CARD"],
    ui=ASSET_TABS + ["Customer: All customers", "All customers", "All customers are included. Pick one or more to narrow."],
    data=KOLOSOV_ROWS + ["Kolosov's Diesel Repair", "Quartzsite Truck Service & Repair"],
    look=["Chip open (grey highlighted): a panel drops below the chip, right-aligned with New, covering the Lead Technician, Total "
          "Price and Created On columns of the first rows. Row 1 '[ticked box] All customers' (blue tick), a divider, grey help text "
          "'All customers are included. Pick one or more to narrow.' (2 lines), then one row per customer A to Z with a grey DASH box "
          "(indeterminate): 'Kolosov's Diesel Repair', 'Quartzsite Truck Service & Repair'. No search box (2 options), no Apply button."])
SCREENS["after-p7-asset-customer-picked-open.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "ASSET_CARD"],
    ui=ASSET_TABS + ["Customer: Quartzsite Truc...", "All customers", "1 selected", "e.g. when did we work on the turbo?",
        "View All History"],
    data=["Kolosov's Diesel Repair", "Quartzsite Truck Service & Repair", "Approved", "S2-16988", "shop heavy", "-", "SHOP", "0%",
          "Unas...", "94 days"],
    look=["Quartzsite ticked (blue), Kolosov's unticked (empty box), 'All customers' unticked with '1 selected' (grey) at its right; "
          "no help text now. The chip turns light blue with blue text 'Customer: Quartzsite Truc...' (cut with '...'). The list "
          "already shows only S2-16988 behind the open panel."])
SCREENS["after-p7-asset-customer-applied.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "ASSET_CARD"],
    ui=ASSET_TABS + ["Customer: Quartzsite Truc...", "e.g. when did we work on the turbo?", "View All History"],
    data=["Approved", "S2-16988", "Quartzsite Truck Service & Repair", "shop heavy", "-", "SHOP", "0%", "Unassigned", "$136.55",
          "Aug 4, 2026", "94 days"],
    look=["Panel closed: chip stays light blue 'Customer: Quartzsite Truc...'; only S2-16988 is listed."])
HEADER_1600 = ["ShopHub", "Dashboard", "Work Orders", "Schedule", "Customers", "Parts", "Reports", "Search customers, work orders...",
    "Ctrl", "K", "Clock In", "Staging Heavy Duty - 9919", "AS"]
SCREENS["before-p7-asset-work-orders-1600-search.png"] = dict(size="1600x900", chrome=["HEADER_1600", "ASSET_CARD"],
    ui=ASSET_TABS + ["(clear search icon)", "e.g. when did we work on the turbo?", "View All History"],
    data=["S2-16", "Approved", "S2-16988", "Quartzsite Truck Service & Repair", "shop heavy", "-", "SHOP", "0%", "Unassigned", "$136.55",
          "Aug 4, 2026", "94 days"],
    look=["Production at 1600: search box filled 'S2-16' (with a clear x); one match, S2-16988."])
SCREENS["after-p7-asset-work-orders-1600-search.png"] = dict(size="1600x900", chrome=["HEADER_1600", "ASSET_CARD"],
    ui=ASSET_TABS + ["(clear search icon)", "Customer: All customers", "e.g. when did we work on the turbo?", "View All History"],
    data=["S2-16", "Paid", "S2-16894", "Kolosov's Diesel Repair", "shop heavy", "-", "SHOP", "0%", "Unassigned", "Jul 28, 2026",
          "100 days", "Approved", "S2-16988", "Quartzsite Truck Service & Repair", "$136.55", "Aug 4, 2026", "94 days"],
    look=["At 1600: search box (filled 'S2-16', clear x), Status, 'Customer: All customers' chip and New all on one line; two matches: "
          "Kolosov's S2-16894 (Paid) then Quartzsite's S2-16988."])
SCREENS["before-p7-phone-asset-work-orders.png"] = dict(size="390x844", chrome=["PHONE_TOP"],
    ui=["Year:", "VIN/Serial #:", "Licence Plate:", "Type:", "Unit:", "Color:", "Mileage:", "Eng. Hr.:", "Engine:", "Trim:",
        "Drivetrain:", "Fault Codes Lookup", "(change owner icon)", "Address", "Phone", "Preferred Contact", "(edit icon)"],
    data=["shop heavy", "C1BKL36L60D9C4SKW", "DCL-8441", "Other", "73", "12", "Quartzsite Truck Service & Repair",
          "0794 Willie Mills Suite 010", "Port Josephshire", "908-734-7978", "Mark Richardson"],
    look=["Phone asset page: asset card first, then the owner card, then the preferred contact; the Work Orders tab is below the fold "
          "(not pictured), so neither the Customer chip nor the list is visible."])
SCREENS["after-p7-phone-asset-work-orders.png"] = dict(same_bytes_as="before-p7-phone-asset-work-orders.png",
    look=["Byte-identical (md5) to the production phone picture: the Bill To changes on this tab are not visible at phone width in "
          "this shot."])
A854_CARD = ["2024 INTERNATIONAL CV515 854", "(edit icon)", "Year:", "2024", "VIN/Serial #:", "WLKDY421A9NJGF3Y9", "Licence Plate:",
    "CWI-6765", "Type:", "Unit:", "854", "Color:", "Mileage:", "11,222", "Eng. Hr.:", "3,834", "Engine:", "International 6.6", "Trim:",
    "CV", "Drivetrain:", "4WD/4-Wheel Drive/4x4", "Fault Codes Lookup", "Buda Truck Repair", "Address", "8237 Brittney Divide Apt. 463",
    "Apt. 891", "Walshhaven", "Phone", "839-680-8298", "Preferred Contact", "Wendy Lopez"]
A854_ROWS = ["Paid", "S2-5491", "Buda Truck Repair", "INTERNATIONAL CV515", "854", "1HTKTSWK4RH442544", "84%", "Unassigned", "S2-6585",
    "77%", "S2-7268", "93%", "James Price", "S2-7539", "135%", "Allison Hughes", "S2-9464", "102%", "S2-10422", "96%", "S2-11850", "74%",
    "S2-13796", "97%", "Daniel Montoya", "S2-14310", "80%", "Melanie Garner", "S2-15742", "112%", "Estimate", "S2-15937", "0%",
    "S2-16890", "309%", "Approved", "S2-17579", "Valders Diesel & Fleet Repair", "S2-17581"]
A854_UI = ["Work Orders", "Invoices (12)", "Notes", "Inspections", "Search", "Status", "Customer: All customers", "New", "On Site",
    "Status", "Number", "Customer", "Bill To", "Asset", "Unit", "VIN/Serial #", "Progress", "Lead Technician", "T...", "AI",
    "SHOPCOACH ASSET HISTORY", "Asset History"]
SCREENS["after-p7-asset854-work-orders.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "A854_CARD"], ui=A854_UI,
    data=A854_ROWS,
    look=["A 'Bill To' column sits right after 'Customer': blank on Buda's self-billed rows, 'Valders Diesel & Fleet Repair' on "
          "S2-17579. The extra column pushes the last columns past the right edge at 1440: the 'Total Price' header shows only 'T' and "
          "the column values are cut (the table scrolls sideways). Oldest first (Number ▲)."])
SCREENS["after-p7-asset854-work-orders-bottom.png"] = dict(size="1440x900", chrome=["HEADER (Customers active)", "A854_CARD"],
    ui=["AI", "SHOPCOACH ASSET HISTORY", "Asset History", "e.g. when did we work on the turbo?", "View All History", "Email"],
    data=A854_ROWS + ["071-234-2245", "wendy.lopez2@staging.shopview.local"],
    look=["Scrolled down: the last two rows S2-17579 (Approved) and S2-17581 (Paid) both read 'Valders Diesel & Fleet Repair' under "
          "Bill To; the right-hand columns stay cut at the edge."])
