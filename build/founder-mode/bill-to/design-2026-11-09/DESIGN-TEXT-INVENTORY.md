# Design text inventory — Bill To (9 Nov 2026)

Every text in the 8 board files (title, headings, notes, badges, picture headings, alt text, every caption sentence, the cover lists) and every word transcribed by hand from the 124 screenshots (`tools/screen_text.py`). Built by `tools/build_all.py` with the rules in `tools/classify.py`; full rows with file and line in `DESIGN-TEXT-INVENTORY.json`. Classes: DATA · PRD-MATCH (code) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (register id) · LOOK-ONLY. Letter case of every PRD-MATCH screen label was compared with the PRD by script (L-04).

## Counts

| | rows |
|---|---|
| Board rows | 750 |
| Screenshot rows (incl. shared chrome expanded per picture) | 8583 |
| DATA | 5189 |
| LOOK-ONLY | 479 |
| OUT-OF-SCOPE | 3334 |
| PRD-MATCH | 297 |
| SPEC-CONFLICT | 34 |
| **Unclassified** | **0** |

Letter-case differences against the PRD among PRD-MATCH labels: none.

## Board rows (every sentence)

| Id | Board | Line | Kind | Text | Class | Codes | Note |
|---|---|---|---|---|---|---|---|
| T00001 | Main.dc.html | 5 | title | Bill To design: cover | LOOK-ONLY |  | board title (page name) |
| T00002 | Main.dc.html | 22 | heading | Bill To: design file | LOOK-ONLY |  | board heading or row title |
| T00003 | Main.dc.html | 27 | heading | Pages | LOOK-ONLY |  | board heading or row title |
| T00004 | Main.dc.html | 39 | heading | What the boards are | LOOK-ONLY |  | board heading or row title |
| T00005 | Main.dc.html | 48 | heading | What is not shown | LOOK-ONLY |  | board heading or row title |
| T00006 | Main.dc.html | 23 | cover | Bill To lets a work order or part sale bill one customer while the work stays with another. | PRD-MATCH | §2 Core Bill To | same meaning as §2 'Every work order, part sale and invoice has two customers' |
| T00007 | Main.dc.html | 23 | cover | Every picture in this file is a real screenshot or a real PDF render, never a drawing. | LOOK-ONLY |  | the pictures are the look source (Rule 126.5) |
| T00008 | Main.dc.html | 23 | cover | Before boards are production code; after boards are the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00009 | Main.dc.html | 23 | cover | Both ran against the same copy of the same data, so the same records appear on both sides. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00010 | Main.dc.html | 29 | cover | 1 Set a customer's default Bill To (26 boards): New Customer and Edit Customer field (lists A to Z), no field on the Counter Sale customer, the customer card line with Change, the "Pays for" counter and list, a user without AP/AR, phone. | LOOK-ONLY |  | page index of the design |
| T00011 | Main.dc.html | 30 | cover | 2 Bill a work order or part sale to someone else (21 boards): the Customer card Bill To field (A to Z, first 50), the Authorizer list, Change Customer enabled while a deposit is held, the Work Order Log, the part sale card, New Work Order unchanged, phone. | LOOK-ONLY |  | page index |
| T00012 | Main.dc.html | 31 | cover | 3 When the Bill To is blocked (21 boards): invoiced lock, deposits lock (toast for everyone, the button only for users allowed to use it, shown as admin and as mary.moore), Credit Hold on the Bill To with "Change Bill To" on desktop and phone, Counter Sale not offered. | LOOK-ONLY |  | page index |
| T00013 | Main.dc.html | 32 | cover | 4 Service For band on invoices and estimates (22 boards): modern and legacy invoice, estimate, part sale with and without a vehicle, batch, and an invoice that pays for itself. | LOOK-ONLY |  | page index |
| T00014 | Main.dc.html | 33 | cover | 5 Getting paid (15 boards): the payer's Invoices tab with "Service For", the payment window, invoice email recipients, the customer portal note, phone. | LOOK-ONLY |  | page index |
| T00015 | Main.dc.html | 34 | cover | 6 Deleting a customer that pays for others (10 boards): the refusal, the confirm, the result, phone. | LOOK-ONLY |  | page index |
| T00016 | Main.dc.html | 35 | cover | 7 Asset Work Orders tab (11 boards): whole history at this location by default, the Customer chip open, one customer picked, a 1600px board with search filled, phone, and the "Bill To" column on the asset of S2-17579. | LOOK-ONLY |  | page index |
| T00017 | Main.dc.html | 41 | cover | Production (v26.45.2.1) the latest release tag, v26.45.2.1, run from a separate checkout. | LOOK-ONLY |  | badge legend |
| T00018 | Main.dc.html | 42 | cover | This build the Bill To build after the tech review fixes, uncommitted on branch project/bill-to, snapshot lock_snapshot_20261106_155048 (base commit 551fa20901c7). | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00019 | Main.dc.html | 42 | cover | Boards whose behavior changed in the review were reshot on it and say "Reshot after the tech review" or "New after the tech review"; the other after boards are from the earlier snapshot, lock_snapshot_20261106_113444, and still match the build. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00020 | Main.dc.html | 43 | cover | New, no before exists or New, no before needed a screen production does not have, or one where production's screen is already on the page. | LOOK-ONLY |  | badge legend |
| T00021 | Main.dc.html | 44 | cover | Production was not re-run for the review reshoot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00022 | Main.dc.html | 44 | cover | New boards that pair with production reuse an existing production board, and say so. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00023 | Main.dc.html | 45 | cover | Desktop boards are 1440 wide (one list board is 1600 wide); phone boards are 390 wide. | LOOK-ONLY |  | phone width of the pictures: phone cases use a 390 px wide window |
| T00024 | Main.dc.html | 46 | cover | Example data: Buda Truck Repair bills A & J Truck & Trailer Repair by default; A & J pays for Buda; S2-17579 and S2-17581 are Buda billed to Valders Diesel & Fleet Repair; S2-17577 is Desert Edge billed to 7 Star and holds a $10.00 deposit; P2-256 is 4 Star billed to 7 Star. | DATA |  | demo records |
| T00025 | Main.dc.html | 46 | cover | In this data the Counter Sale customer is named "Gennadiy's Mobile Truck Repair". | DATA |  | demo records: the Counter Sale customer's name in this data |
| T00026 | Main.dc.html | 46 | cover | Buda's saved default was found cleared in the build's data at the review reshoot; it was set back to A & J only while page 1 was reshot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00027 | Main.dc.html | 50 | cover | Customer portal ("Billed to", Pay only for the Bill To, the "invoice created" email, the deposit link check): the portal app does not run locally. | OUT-OF-SCOPE |  | portal not pictured (BT-N19) |
| T00028 | Main.dc.html | 51 | cover | QuickBooks, AccountingHub, the IBS batch export, the invoice CSV export and the Public API: no screens; covered in the PRD. | OUT-OF-SCOPE |  | no screen (BT-N20) |
| T00029 | Main.dc.html | 52 | cover | AccountingHub: the version 4 invoice event that carries the Bill To to AccountingHub is not built yet (it needs the AccountingHub owner), so nothing here shows it. | SPEC-CONFLICT | BT-D12 | conflicts with S18-R2 'no AccountingHub change is needed' |
| T00030 | Main.dc.html | 53 | cover | Change Customer with a Bill To, its refusal while a deposit is held, and Reverse then invoice again: they change data and add no new screen. | OUT-OF-SCOPE |  | no screen (PRD Stories 6 and 11: 'Design: No screen change') |
| T00031 | Main.dc.html | 54 | cover | The send window for invoice email (page 5) was rechecked after the tech review and looks the same for S2-17581, so it was not reshot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00032 | Main.dc.html | 55 | cover | Internal and No Charge work orders: they wait on Internal Work Orders (SV-11665). | OUT-OF-SCOPE |  | S15-N1 (BT-N18) |
| T00033 | Main.dc.html | 56 | cover | Global search inside a list: the local search index is empty on both stacks, so the 1600px search board uses the asset tab's own search. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00034 | Main.dc.html | 57 | cover | Credit Terms and Split Representatives changes are in the same build. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00035 | Main.dc.html | 57 | cover | They are not Bill To and are not described here; they show only where they sit on a Bill To screen (Credit Terms and Credit Limit in the customer windows, the + beside Sales Representative, "Unassigned" in place of "N/A"). | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00036 | Main.dc.html | 41 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00037 | Main.dc.html | 42 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00038 | Main.dc.html | 43 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00039 | Main.dc.html | 43 | badge | New, no before needed | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00040 | DefaultBillTo.dc.html | 5 | title | 1. Set a customer's default Bill To | LOOK-ONLY |  | board title (page name) |
| T00041 | DefaultBillTo.dc.html | 29 | heading | 1. Set a customer's default Bill To | LOOK-ONLY |  | board heading or row title |
| T00042 | DefaultBillTo.dc.html | 34 | heading | New Customer | LOOK-ONLY |  | board heading or row title |
| T00043 | DefaultBillTo.dc.html | 64 | heading | Edit Customer (Buda Truck Repair) | LOOK-ONLY |  | board heading or row title |
| T00044 | DefaultBillTo.dc.html | 96 | heading | The customer card (Buda Truck Repair) | LOOK-ONLY |  | board heading or row title |
| T00045 | DefaultBillTo.dc.html | 121 | heading | The payer (A & J Truck & Trailer Repair) | LOOK-ONLY |  | board heading or row title |
| T00046 | DefaultBillTo.dc.html | 146 | heading | A user without "View and Manage AP/AR Data" (mary.moore, Foreman) | LOOK-ONLY |  | board heading or row title |
| T00047 | DefaultBillTo.dc.html | 30 | note | Customers. | LOOK-ONLY |  | board layout |
| T00048 | DefaultBillTo.dc.html | 30 | note | Left to right: New Customer, Edit Customer, the customer card, the payer's "Pays for" list, a user without "View and Manage AP/AR Data", then phone. | LOOK-ONLY |  | board layout (order of the pictures) |
| T00049 | DefaultBillTo.dc.html | 30 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00050 | DefaultBillTo.dc.html | 30 | note | Credit Terms, Credit Limit and the + beside Sales Representative come from the Credit Terms and Split Representatives work in the same build; they are context, not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00051 | DefaultBillTo.dc.html | 37 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00052 | DefaultBillTo.dc.html | 37 | figure heading | New Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00053 | DefaultBillTo.dc.html | 38 | alt | New Customer window in production | LOOK-ONLY |  | picture description (alt text) |
| T00054 | DefaultBillTo.dc.html | 39 | caption | No Bill To field. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00055 | DefaultBillTo.dc.html | 39 | caption | The red "Oooops! An error occurred" toast and the empty list behind are the production code reading this build's data copy; they are not part of the window. | SPEC-CONFLICT | BT-D13 | the production picture shows no toast and a full list (register BT-D13) |
| T00056 | DefaultBillTo.dc.html | 42 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00057 | DefaultBillTo.dc.html | 42 | figure heading | Bill Invoices To, empty | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00058 | DefaultBillTo.dc.html | 43 | alt | New Customer with the Bill Invoices To field reading This customer | LOOK-ONLY |  | picture description (alt text) |
| T00059 | DefaultBillTo.dc.html | 44 | caption | "Bill Invoices To" sits after Credit Terms and Credit Limit and before Sales Representative. | PRD-MATCH | S2-R2 | same meaning as S2-R2 |
| T00060 | DefaultBillTo.dc.html | 44 | caption | It reads "This customer". | PRD-MATCH | S2-R1 | word for word 'reading "This customer"' |
| T00061 | DefaultBillTo.dc.html | 44 | caption | No help line under it in New Customer. | PRD-MATCH | S2-N2 | same meaning as S2-N2 |
| T00062 | DefaultBillTo.dc.html | 47 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00063 | DefaultBillTo.dc.html | 47 | figure heading | Open | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00064 | DefaultBillTo.dc.html | 48 | alt | Bill Invoices To list open | LOOK-ONLY |  | picture description (alt text) |
| T00065 | DefaultBillTo.dc.html | 49 | caption | Name typed: "Lone Star Fleet Services". | PRD-MATCH | S2-R4 | first option '[name typed so far] (this customer)' |
| T00066 | DefaultBillTo.dc.html | 49 | caption | The first option reads "Lone Star Fleet Services (this customer)", then customers A to Z: "4 Star Truck Repair", "7 Star Truck Repair", "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC". | PRD-MATCH | S2-R4, S3-R3 | template '[name typed so far] (this customer)', then A to Z |
| T00067 | DefaultBillTo.dc.html | 49 | caption | The list holds the first 50 customers A to Z; typing narrows it. | PRD-MATCH | S3-R3 | S3-R3 'A to Z, showing the first 50 matches' (S2 is silent on 50 for the customer windows: noted for the case worker) |
| T00068 | DefaultBillTo.dc.html | 49 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00069 | DefaultBillTo.dc.html | 52 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00070 | DefaultBillTo.dc.html | 52 | figure heading | Searching | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00071 | DefaultBillTo.dc.html | 53 | alt | Bill Invoices To searching A and J | LOOK-ONLY |  | picture description (alt text) |
| T00072 | DefaultBillTo.dc.html | 54 | caption | Typing "A & J" narrows the list. | PRD-MATCH | S3-R3 | same meaning (typing narrows) |
| T00073 | DefaultBillTo.dc.html | 54 | caption | The "(this customer)" option stays first. | PRD-MATCH | S2-R4, S3-R3 | same meaning |
| T00074 | DefaultBillTo.dc.html | 57 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00075 | DefaultBillTo.dc.html | 57 | figure heading | Picked | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00076 | DefaultBillTo.dc.html | 58 | alt | A and J picked in Bill Invoices To | LOOK-ONLY |  | picture description (alt text) |
| T00077 | DefaultBillTo.dc.html | 59 | caption | "A & J Truck & Trailer Repair" picked. | LOOK-ONLY |  | state of the picture |
| T00078 | DefaultBillTo.dc.html | 59 | caption | It saves with Save, right after the customer is created. | PRD-MATCH | S2-R5 | same meaning |
| T00079 | DefaultBillTo.dc.html | 59 | caption | Not saved here. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00080 | DefaultBillTo.dc.html | 67 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00081 | DefaultBillTo.dc.html | 67 | figure heading | Edit Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00082 | DefaultBillTo.dc.html | 68 | alt | Edit Customer in production | LOOK-ONLY |  | picture description (alt text) |
| T00083 | DefaultBillTo.dc.html | 69 | caption | No Bill To field. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00084 | DefaultBillTo.dc.html | 69 | caption | Shot 1440 x 1300 so the whole window shows. | LOOK-ONLY |  | picture size (correct: the picture is 1440 x 1300) |
| T00085 | DefaultBillTo.dc.html | 72 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00086 | DefaultBillTo.dc.html | 72 | figure heading | Saved default | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00087 | DefaultBillTo.dc.html | 73 | alt | Edit Customer with Bill Invoices To A and J | LOOK-ONLY |  | picture description (alt text) |
| T00088 | DefaultBillTo.dc.html | 74 | caption | "Bill Invoices To" shows the saved default, "A & J Truck & Trailer Repair". | PRD-MATCH | S2-R1 | same meaning |
| T00089 | DefaultBillTo.dc.html | 74 | caption | Help line, Edit Customer only: "New work orders and part sales bill to this customer. Existing ones don't change." | PRD-MATCH | S2-R3, §8 Help | word for word |
| T00090 | DefaultBillTo.dc.html | 74 | caption | Address 2 has a value, so it shows, with an x to clear it. | PRD-MATCH | S2-R8, S2-R7 | same meaning |
| T00091 | DefaultBillTo.dc.html | 77 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00092 | DefaultBillTo.dc.html | 77 | figure heading | Open | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00093 | DefaultBillTo.dc.html | 78 | alt | Edit Customer Bill Invoices To list open | LOOK-ONLY |  | picture description (alt text) |
| T00094 | DefaultBillTo.dc.html | 79 | caption | The list opens with "Buda Truck Repair (this customer)" first, then customers A to Z. | PRD-MATCH | S1-R5, S3-R3 | same meaning |
| T00095 | DefaultBillTo.dc.html | 79 | caption | The current pick, "A & J Truck & Trailer Repair", is highlighted in its A to Z place. | LOOK-ONLY |  | current pick highlighted in its A-to-Z place in the customer windows (compare BT-D01) |
| T00096 | DefaultBillTo.dc.html | 79 | caption | Picking "(this customer)" and saving clears the default. | PRD-MATCH | S1-R5 | same meaning as S1-R5 |
| T00097 | DefaultBillTo.dc.html | 79 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00098 | DefaultBillTo.dc.html | 79 | caption | Buda's saved default had been cleared in the build's data before this reshoot; it was set back to A & J for these shots and cleared again after. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00099 | DefaultBillTo.dc.html | 82 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00100 | DefaultBillTo.dc.html | 82 | figure heading | Searching | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00101 | DefaultBillTo.dc.html | 83 | alt | Edit Customer Bill Invoices To searching Vald | LOOK-ONLY |  | picture description (alt text) |
| T00102 | DefaultBillTo.dc.html | 84 | caption | Typing "Vald": "Buda Truck Repair (this customer)", then "Uvalde Estates Truck Centre" and "Valders Diesel & Fleet Repair", A to Z. | PRD-MATCH | S3-R3 | same meaning (search, (this customer) first, A to Z) |
| T00103 | DefaultBillTo.dc.html | 84 | caption | Closed without saving. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00104 | DefaultBillTo.dc.html | 89 | badge | New, no before needed | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00105 | DefaultBillTo.dc.html | 89 | figure heading | Edit Customer, Counter Sale customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00106 | DefaultBillTo.dc.html | 90 | alt | Edit Customer on the Counter Sale customer with no Bill Invoices To field | LOOK-ONLY |  | picture description (alt text) |
| T00107 | DefaultBillTo.dc.html | 91 | caption | In this data the Counter Sale customer is named "Gennadiy's Mobile Truck Repair". | DATA |  | demo records: the Counter Sale customer's name in this data |
| T00108 | DefaultBillTo.dc.html | 91 | caption | Its Edit Customer window has no "Bill Invoices To" field and no help line: Credit Terms and Credit Limit are followed directly by Sales Representative. | PRD-MATCH | S2-N3 | same meaning as S2-N3 |
| T00109 | DefaultBillTo.dc.html | 91 | caption | No before board: production has no "Bill Invoices To" field on any customer, so production's window for this customer matches the production Edit Customer board above. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00110 | DefaultBillTo.dc.html | 91 | caption | Shot 1440 x 1300. | LOOK-ONLY |  | picture size (correct: the picture is 1440 x 1300) |
| T00111 | DefaultBillTo.dc.html | 99 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00112 | DefaultBillTo.dc.html | 99 | figure heading | Customer page | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00113 | DefaultBillTo.dc.html | 100 | alt | Buda customer page in production | LOOK-ONLY |  | picture description (alt text) |
| T00114 | DefaultBillTo.dc.html | 101 | caption | The card ends with IBS, then Contacts and Assets. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00115 | DefaultBillTo.dc.html | 104 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00116 | DefaultBillTo.dc.html | 104 | figure heading | Bill Invoices To line | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00117 | DefaultBillTo.dc.html | 105 | alt | Buda customer page with Bill Invoices To line | LOOK-ONLY |  | picture description (alt text) |
| T00118 | DefaultBillTo.dc.html | 106 | caption | Under IBS: "Bill Invoices To", "A & J Truck & Trailer Repair", and "Change". | PRD-MATCH | S1-R1, S1-R2 | same meaning; 'Under IBS' is the design's position (PRD: 'left card') |
| T00119 | DefaultBillTo.dc.html | 106 | caption | The line shows only when another customer is saved. | PRD-MATCH | S1-R1, S1-N1 | same meaning |
| T00120 | DefaultBillTo.dc.html | 106 | caption | A customer that bills itself shows nothing here. | PRD-MATCH | S1-N1 | same meaning |
| T00121 | DefaultBillTo.dc.html | 109 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00122 | DefaultBillTo.dc.html | 109 | figure heading | Change | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00123 | DefaultBillTo.dc.html | 110 | alt | Bill Invoices To window | LOOK-ONLY |  | picture description (alt text) |
| T00124 | DefaultBillTo.dc.html | 111 | caption | Window "Bill Invoices To": "New work orders and part sales for Buda Truck Repair will be billed to this customer. Existing ones don't change." | PRD-MATCH | S1-R3, §8 Help | word for word with [customer] = Buda Truck Repair |
| T00125 | DefaultBillTo.dc.html | 111 | caption | Buttons "Cancel" and "Save". | SPEC-CONFLICT | BT-D03 | S1-R4 names only 'Save' |
| T00126 | DefaultBillTo.dc.html | 114 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00127 | DefaultBillTo.dc.html | 114 | figure heading | Change, open | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00128 | DefaultBillTo.dc.html | 115 | alt | Bill Invoices To window with the list open | LOOK-ONLY |  | picture description (alt text) |
| T00129 | DefaultBillTo.dc.html | 116 | caption | The list opens above the field when there is no room below: "Buda Truck Repair (this customer)" first, then customers A to Z, the current pick "A & J Truck & Trailer Repair" highlighted. | SPEC-CONFLICT | BT-D09 | list position: covers the app's top bar in the picture (BT-D09) |
| T00130 | DefaultBillTo.dc.html | 116 | caption | Closed without saving. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00131 | DefaultBillTo.dc.html | 116 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00132 | DefaultBillTo.dc.html | 124 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00133 | DefaultBillTo.dc.html | 124 | figure heading | Customer page | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00134 | DefaultBillTo.dc.html | 125 | alt | A and J customer page in production | LOOK-ONLY |  | picture description (alt text) |
| T00135 | DefaultBillTo.dc.html | 126 | caption | Contacts and Assets only. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00136 | DefaultBillTo.dc.html | 129 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00137 | DefaultBillTo.dc.html | 129 | figure heading | Pays for counter | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00138 | DefaultBillTo.dc.html | 130 | alt | A and J customer page with Pays for 1 | LOOK-ONLY |  | picture description (alt text) |
| T00139 | DefaultBillTo.dc.html | 131 | caption | "Pays for" 1 sits beside Contacts and Assets. | PRD-MATCH | S1-R7 | same meaning |
| T00140 | DefaultBillTo.dc.html | 131 | caption | Hidden when the count is 0. | PRD-MATCH | S1-N4 | word for word |
| T00141 | DefaultBillTo.dc.html | 131 | caption | A & J has its own default, so it also shows "Bill Invoices To", "Mayfield Heights Truck Centre", "Change". | PRD-MATCH | S1-R1 | same meaning |
| T00142 | DefaultBillTo.dc.html | 131 | caption | New work orders for Buda still bill A & J, one hop only. | PRD-MATCH | S1-E1 | same meaning |
| T00143 | DefaultBillTo.dc.html | 134 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00144 | DefaultBillTo.dc.html | 134 | figure heading | Tooltip | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00145 | DefaultBillTo.dc.html | 135 | alt | Pays for tooltip | LOOK-ONLY |  | picture description (alt text) |
| T00146 | DefaultBillTo.dc.html | 136 | caption | Tooltip: "Customers billed to this customer by default". | PRD-MATCH | S1-R8, §8 Pays for | word for word |
| T00147 | DefaultBillTo.dc.html | 139 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00148 | DefaultBillTo.dc.html | 139 | figure heading | Pays for list | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00149 | DefaultBillTo.dc.html | 140 | alt | A and J pays for window | LOOK-ONLY |  | picture description (alt text) |
| T00150 | DefaultBillTo.dc.html | 141 | caption | Window "A & J Truck & Trailer Repair pays for": "These customers bill new work orders and part sales to A & J Truck & Trailer Repair by default." | PRD-MATCH | S1-R9, S1-R10 | word for word with [customer] = A & J |
| T00151 | DefaultBillTo.dc.html | 141 | caption | Each customer is a link to its page ("Buda Truck Repair"). | PRD-MATCH | S1-R9 | same meaning |
| T00152 | DefaultBillTo.dc.html | 141 | caption | Button "Close". | PRD-MATCH | S1-R10 | word for word |
| T00153 | DefaultBillTo.dc.html | 141 | caption | Customers are listed A to Z, and a long list scrolls inside the window. | PRD-MATCH | S1-R9 | same meaning |
| T00154 | DefaultBillTo.dc.html | 141 | caption | A & J pays for one customer, so this window looks the same after the tech review; not reshot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00155 | DefaultBillTo.dc.html | 149 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00156 | DefaultBillTo.dc.html | 149 | figure heading | New Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00157 | DefaultBillTo.dc.html | 150 | alt | New Customer for a Foreman in production | LOOK-ONLY |  | picture description (alt text) |
| T00158 | DefaultBillTo.dc.html | 151 | caption | Her location is Staging Lethbridge - 4310; customers are shared across the organization. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00159 | DefaultBillTo.dc.html | 154 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00160 | DefaultBillTo.dc.html | 154 | figure heading | New Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00161 | DefaultBillTo.dc.html | 155 | alt | New Customer for a Foreman in this build | LOOK-ONLY |  | picture description (alt text) |
| T00162 | DefaultBillTo.dc.html | 156 | caption | No "Bill Invoices To" field; the window closes up around it. | PRD-MATCH | S2-N1 | word for word 'the window closes up around it' |
| T00163 | DefaultBillTo.dc.html | 159 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00164 | DefaultBillTo.dc.html | 159 | figure heading | Customer page | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00165 | DefaultBillTo.dc.html | 160 | alt | Buda page for a Foreman in production | LOOK-ONLY |  | picture description (alt text) |
| T00166 | DefaultBillTo.dc.html | 161 | caption | The customer card as her role sees it today. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00167 | DefaultBillTo.dc.html | 164 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00168 | DefaultBillTo.dc.html | 164 | figure heading | Customer page | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00169 | DefaultBillTo.dc.html | 165 | alt | Buda page for a Foreman in this build | LOOK-ONLY |  | picture description (alt text) |
| T00170 | DefaultBillTo.dc.html | 166 | caption | She still sees "Bill Invoices To", "A & J Truck & Trailer Repair", with no "Change". | PRD-MATCH | S1-N2 | same meaning |
| T00171 | DefaultBillTo.dc.html | 171 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00172 | DefaultBillTo.dc.html | 171 | figure heading | Edit Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00173 | DefaultBillTo.dc.html | 172 | alt | Edit Customer for a Foreman in production | LOOK-ONLY |  | picture description (alt text) |
| T00174 | DefaultBillTo.dc.html | 173 | caption | Shot 1440 x 1300. | SPEC-CONFLICT | BT-D13 | the mary.moore production Edit Customer picture is 1600 x 900, not 1440 x 1300 (BT-D13) |
| T00175 | DefaultBillTo.dc.html | 176 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00176 | DefaultBillTo.dc.html | 176 | figure heading | Edit Customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00177 | DefaultBillTo.dc.html | 177 | alt | Edit Customer for a Foreman in this build | LOOK-ONLY |  | picture description (alt text) |
| T00178 | DefaultBillTo.dc.html | 178 | caption | No "Bill Invoices To" field and no help line. | PRD-MATCH | S2-N1 | same meaning |
| T00179 | DefaultBillTo.dc.html | 178 | caption | The saved default is untouched when she saves. | PRD-MATCH | S2-N1 | implied by S2-N1 |
| T00180 | DefaultBillTo.dc.html | 181 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00181 | DefaultBillTo.dc.html | 181 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00182 | DefaultBillTo.dc.html | 182 | alt | Buda page on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00183 | DefaultBillTo.dc.html | 183 | caption | 390 wide. | LOOK-ONLY |  | phone width of the pictures: phone cases use a 390 px wide window |
| T00184 | DefaultBillTo.dc.html | 186 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00185 | DefaultBillTo.dc.html | 186 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00186 | DefaultBillTo.dc.html | 187 | alt | Buda page on a phone in this build | LOOK-ONLY |  | picture description (alt text) |
| T00187 | DefaultBillTo.dc.html | 188 | caption | The same "Bill Invoices To" line with "Change", under IBS. | LOOK-ONLY |  | phone look (BT-S04) |
| T00188 | DefaultBillTo.dc.html | 188 | caption | Nothing phone-only. | LOOK-ONLY |  | phone look |
| T00189 | BillJob.dc.html | 5 | title | 2. Bill a work order or part sale to someone else | LOOK-ONLY |  | board title (page name) |
| T00190 | BillJob.dc.html | 29 | heading | 2. Bill a work order or part sale to someone else | LOOK-ONLY |  | board heading or row title |
| T00191 | BillJob.dc.html | 34 | heading | Pick a Bill To (S2-15937, Buda Truck Repair bills itself) | LOOK-ONLY |  | board heading or row title |
| T00192 | BillJob.dc.html | 69 | heading | Billed to someone else, and the Authorizer list | LOOK-ONLY |  | board heading or row title |
| T00193 | BillJob.dc.html | 99 | heading | Change Customer while a deposit is held (S2-17577, Desert Edge billed to 7 Star, $10.00 deposit) | LOOK-ONLY |  | board heading or row title |
| T00194 | BillJob.dc.html | 114 | heading | Work Order Log, part sale, New Work Order | LOOK-ONLY |  | board heading or row title |
| T00195 | BillJob.dc.html | 149 | heading | Phone | LOOK-ONLY |  | board heading or row title |
| T00196 | BillJob.dc.html | 30 | note | Work order page, Customer card. | LOOK-ONLY |  | board layout |
| T00197 | BillJob.dc.html | 30 | note | Left to right: pick a Bill To on a work order that bills itself (S2-15937, Buda), a work order billed to someone else (S2-17579, Buda billed to Valders), the Authorizer list, Change Customer while a deposit is held (S2-17577), the Work Order Log, a part sale, New Work Order, then phone. | LOOK-ONLY |  | board layout (order of the pictures) |
| T00198 | BillJob.dc.html | 30 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00199 | BillJob.dc.html | 37 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00200 | BillJob.dc.html | 37 | figure heading | Customer card | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00201 | BillJob.dc.html | 38 | alt | S2-15937 customer card in production | LOOK-ONLY |  | picture description (alt text) |
| T00202 | BillJob.dc.html | 39 | caption | Contact, Phone, Authorizer. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00203 | BillJob.dc.html | 39 | caption | No Bill To. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00204 | BillJob.dc.html | 42 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00205 | BillJob.dc.html | 42 | figure heading | This customer | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00206 | BillJob.dc.html | 43 | alt | S2-15937 card with Bill To This customer | LOOK-ONLY |  | picture description (alt text) |
| T00207 | BillJob.dc.html | 44 | caption | "Bill To" under Authorizer reads "This customer". | PRD-MATCH | S3-R1, S3-R2 | same meaning |
| T00208 | BillJob.dc.html | 44 | caption | The work order was created before Buda had a default, so it bills Buda. | PRD-MATCH | S1-R6 | same meaning |
| T00209 | BillJob.dc.html | 47 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00210 | BillJob.dc.html | 47 | figure heading | Open | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00211 | BillJob.dc.html | 48 | alt | Bill To list open | LOOK-ONLY |  | picture description (alt text) |
| T00212 | BillJob.dc.html | 49 | caption | First option: "Buda Truck Repair (this customer)", then customers A to Z: "4 Star Truck Repair", "7 Star Truck Repair", "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC" and on. | PRD-MATCH | S3-R3, S1-N5 | same meaning (never Counter Sale) |
| T00213 | BillJob.dc.html | 49 | caption | Never Counter Sale. | PRD-MATCH | S3-R3, S1-N5 | same meaning |
| T00214 | BillJob.dc.html | 49 | caption | The list holds the first 50 customers A to Z; typing narrows it. | PRD-MATCH | S3-R3 | S3-R3 'A to Z, showing the first 50 matches' (S2 is silent on 50 for the customer windows: noted for the case worker) |
| T00215 | BillJob.dc.html | 49 | caption | Reshot after the tech review (the list used to come in database order). | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00216 | BillJob.dc.html | 52 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00217 | BillJob.dc.html | 52 | figure heading | Searching | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00218 | BillJob.dc.html | 53 | alt | Bill To searching Vald | LOOK-ONLY |  | picture description (alt text) |
| T00219 | BillJob.dc.html | 54 | caption | Typing "Vald": "Buda Truck Repair (this customer)", then A to Z "Uvalde Estates Truck Centre", "Valders Diesel & Fleet Repair". | PRD-MATCH | S3-R3 | same meaning (search, (this customer) first, A to Z) |
| T00220 | BillJob.dc.html | 54 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00221 | BillJob.dc.html | 57 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00222 | BillJob.dc.html | 57 | figure heading | No match | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00223 | BillJob.dc.html | 58 | alt | Bill To with no matching customer | LOOK-ONLY |  | picture description (alt text) |
| T00224 | BillJob.dc.html | 59 | caption | Typing "zzqx": only "Buda Truck Repair (this customer)" stays. | PRD-MATCH | S3-R4 | same meaning |
| T00225 | BillJob.dc.html | 59 | caption | The "(this customer)" option is always listed, so the list is never empty. | PRD-MATCH | S3-R4 | same meaning |
| T00226 | BillJob.dc.html | 59 | caption | Rechecked after the tech review: unchanged. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00227 | BillJob.dc.html | 62 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00228 | BillJob.dc.html | 62 | figure heading | Picked | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00229 | BillJob.dc.html | 63 | alt | Bill To Valders picked | LOOK-ONLY |  | picture description (alt text) |
| T00230 | BillJob.dc.html | 64 | caption | Picking "Valders Diesel & Fleet Repair" saves at once. | PRD-MATCH | S3-R5 | same meaning |
| T00231 | BillJob.dc.html | 64 | caption | The card shows "Bill To" "Valders Diesel & Fleet Re", cut at the card's width. | SPEC-CONFLICT | BT-D06 | name cut with no ellipsis |
| T00232 | BillJob.dc.html | 64 | caption | Reverted after the shot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00233 | BillJob.dc.html | 72 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00234 | BillJob.dc.html | 72 | figure heading | S2-17579 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00235 | BillJob.dc.html | 73 | alt | S2-17579 in production | LOOK-ONLY |  | picture description (alt text) |
| T00236 | BillJob.dc.html | 74 | caption | Nothing says who pays. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00237 | BillJob.dc.html | 77 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00238 | BillJob.dc.html | 77 | figure heading | S2-17579 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00239 | BillJob.dc.html | 78 | alt | S2-17579 with Bill To Valders | LOOK-ONLY |  | picture description (alt text) |
| T00240 | BillJob.dc.html | 79 | caption | "Bill To" reads "Valders Diesel & Fleet Repair". | SPEC-CONFLICT | BT-D06, BT-D13 | the picture shows the name cut |
| T00241 | BillJob.dc.html | 79 | caption | Nothing is added to the card's header or the work order header. | LOOK-ONLY |  | design-only look statement (PRD silent): no Bill To in the headers |
| T00242 | BillJob.dc.html | 82 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00243 | BillJob.dc.html | 82 | figure heading | Authorizer list (S2-17577) | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00244 | BillJob.dc.html | 83 | alt | Authorizer list in production | LOOK-ONLY |  | picture description (alt text) |
| T00245 | BillJob.dc.html | 84 | caption | S2-17577 is Desert Edge billed to 7 Star. | DATA |  | demo records |
| T00246 | BillJob.dc.html | 84 | caption | Production lists Desert Edge's contacts only, one line each. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00247 | BillJob.dc.html | 84 | caption | The "Over Limit" pill in the header is production's credit check; this build's Credit Terms work skips it for COD. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00248 | BillJob.dc.html | 87 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00249 | BillJob.dc.html | 87 | figure heading | Authorizer list, top | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00250 | BillJob.dc.html | 88 | alt | Authorizer list with customer names | LOOK-ONLY |  | picture description (alt text) |
| T00251 | BillJob.dc.html | 89 | caption | "No authorizer", then the customer's contacts, each with "Desert Edge Truck Service & Repair" on a second line. | PRD-MATCH | S4-R1, S4-R2 | same meaning |
| T00252 | BillJob.dc.html | 92 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00253 | BillJob.dc.html | 92 | figure heading | Authorizer list, bottom | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00254 | BillJob.dc.html | 93 | alt | Authorizer list scrolled to the Bill To contact | LOOK-ONLY |  | picture description (alt text) |
| T00255 | BillJob.dc.html | 94 | caption | The Bill To's contacts come last: "Jaime Johnson", "7 Star Truck Repair". | PRD-MATCH | S4-R1 | same meaning |
| T00256 | BillJob.dc.html | 94 | caption | When the customer pays for itself the list is exactly today's, with no second line. | PRD-MATCH | S4-N1 | word for word |
| T00257 | BillJob.dc.html | 102 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00258 | BillJob.dc.html | 102 | figure heading | Card | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00259 | BillJob.dc.html | 103 | alt | S2-17577 in production with the Change Customer button | LOOK-ONLY |  | picture description (alt text) |
| T00260 | BillJob.dc.html | 104 | caption | The Change Customer button (two arrows at the top right of the customer card) is enabled. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00261 | BillJob.dc.html | 104 | caption | The "Over Limit" pill is production's credit check; not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') (production credit check) |
| T00262 | BillJob.dc.html | 104 | caption | The same production board as page 3's deposit row. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00263 | BillJob.dc.html | 107 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00264 | BillJob.dc.html | 107 | figure heading | Change Customer enabled | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00265 | BillJob.dc.html | 108 | alt | S2-17577 with the Change Customer button enabled | LOOK-ONLY |  | picture description (alt text) |
| T00266 | BillJob.dc.html | 109 | caption | The Change Customer button stays enabled while the deposit is held, as in production. | PRD-MATCH | S6-R3 | settled (BT-S02) |
| T00267 | BillJob.dc.html | 109 | caption | The deposit no longer greys it out. | PRD-MATCH | S6-R3 | settled (BT-S02) |
| T00268 | BillJob.dc.html | 109 | caption | The server refuses Change Customer only when the change would change the Bill To; picking a customer that keeps "7 Star Truck Repair" as Bill To goes through. | PRD-MATCH | S6-R3 | same meaning |
| T00269 | BillJob.dc.html | 109 | caption | New after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00270 | BillJob.dc.html | 109 | caption | The refusal was not shot: it needs a real Change Customer attempt. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour (S6-R3, BT-S02) |
| T00271 | BillJob.dc.html | 117 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00272 | BillJob.dc.html | 117 | figure heading | Work Order Log | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00273 | BillJob.dc.html | 118 | alt | Work Order Log in production | LOOK-ONLY |  | picture description (alt text) |
| T00274 | BillJob.dc.html | 119 | caption | The "Bill To changed" rows exist only because this build wrote them into the shared data. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00275 | BillJob.dc.html | 119 | caption | Production reads them as "Customer:" changes. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00276 | BillJob.dc.html | 119 | caption | Production itself never writes them. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00277 | BillJob.dc.html | 122 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00278 | BillJob.dc.html | 122 | figure heading | Work Order Log | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00279 | BillJob.dc.html | 123 | alt | Work Order Log with Bill To changed rows | LOOK-ONLY |  | picture description (alt text) |
| T00280 | BillJob.dc.html | 124 | caption | Event "Bill To changed". | PRD-MATCH | S13-R1, S13-R2 | same meaning; the design adds an arrow between the names |
| T00281 | BillJob.dc.html | 124 | caption | Details: "Bill To:" old customer, arrow, new customer, each a link (for example "Buda Truck Repair" to "Valders Diesel & Fleet Repair"). | PRD-MATCH | S13-R2 | same meaning; the arrow is design-only look |
| T00282 | BillJob.dc.html | 124 | caption | These rows come from earlier testing on this work order. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00283 | BillJob.dc.html | 127 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00284 | BillJob.dc.html | 127 | figure heading | Part sale P2-256 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00285 | BillJob.dc.html | 128 | alt | Part sale P2-256 in production | LOOK-ONLY |  | picture description (alt text) |
| T00286 | BillJob.dc.html | 129 | caption | 4 Star Truck Repair card: Contact, Phone, Authorizer. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00287 | BillJob.dc.html | 132 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00288 | BillJob.dc.html | 132 | figure heading | Part sale P2-256 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00289 | BillJob.dc.html | 133 | alt | Part sale P2-256 with Bill To 7 Star | LOOK-ONLY |  | picture description (alt text) |
| T00290 | BillJob.dc.html | 134 | caption | The same "Bill To" field, here "7 Star Truck Repair". | PRD-MATCH | S3-R1 | same meaning (part sale card) |
| T00291 | BillJob.dc.html | 134 | caption | The parts table columns differ from production (Quantity, Requested At, Fees & Discounts). | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00292 | BillJob.dc.html | 134 | caption | That comes from newer develop work under this build, not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00293 | BillJob.dc.html | 137 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00294 | BillJob.dc.html | 137 | figure heading | New Work Order | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00295 | BillJob.dc.html | 138 | alt | New Work Order in production | LOOK-ONLY |  | picture description (alt text) |
| T00296 | BillJob.dc.html | 139 | caption | Buda Truck Repair and its CV515 picked. | DATA |  | demo records |
| T00297 | BillJob.dc.html | 142 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00298 | BillJob.dc.html | 142 | figure heading | New Work Order, unchanged | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00299 | BillJob.dc.html | 143 | alt | New Work Order in this build | LOOK-ONLY |  | picture description (alt text) |
| T00300 | BillJob.dc.html | 144 | caption | The window is pixel-identical to production. | PRD-MATCH | S3-R8 | same meaning as S3-R8 'New Work Order ... show no Bill To' |
| T00301 | BillJob.dc.html | 144 | caption | No Bill To here; Buda's saved default applies quietly when the work order is created. | PRD-MATCH | S3-R6, Key Decisions | same meaning ('applied silently') |
| T00302 | BillJob.dc.html | 144 | caption | Accuracy check: the Work Orders list toolbar behind the window is spaced differently (tabs and Search sit further left). | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour; names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00303 | BillJob.dc.html | 144 | caption | That comes from release fixes newer than this build's base, not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00304 | BillJob.dc.html | 152 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00305 | BillJob.dc.html | 152 | figure heading | S2-17579 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00306 | BillJob.dc.html | 153 | alt | S2-17579 details on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00307 | BillJob.dc.html | 154 | caption | Details shown. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00308 | BillJob.dc.html | 157 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00309 | BillJob.dc.html | 157 | figure heading | S2-17579 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00310 | BillJob.dc.html | 158 | alt | S2-17579 details on a phone with Bill To | LOOK-ONLY |  | picture description (alt text) |
| T00311 | BillJob.dc.html | 159 | caption | The same card, with "Bill To" "Valders Diesel & Fleet Repair" under Authorizer. | PRD-MATCH | S3-R1, Story 3 Form factor | same meaning |
| T00312 | BillJob.dc.html | 159 | caption | Nothing phone-only. | LOOK-ONLY |  | phone look |
| T00313 | Blocked.dc.html | 5 | title | 3. When the Bill To is blocked | LOOK-ONLY |  | board title (page name) |
| T00314 | Blocked.dc.html | 29 | heading | 3. When the Bill To is blocked | LOOK-ONLY |  | board heading or row title |
| T00315 | Blocked.dc.html | 34 | heading | Invoiced (S2-17581, Buda billed to Valders, Paid) | LOOK-ONLY |  | board heading or row title |
| T00316 | Blocked.dc.html | 59 | heading | Deposit held (S2-17577, Desert Edge billed to 7 Star, $10.00 deposit) | LOOK-ONLY |  | board heading or row title |
| T00317 | Blocked.dc.html | 84 | heading | Deposit held, a user without "View and Manage AP/AR Data" (mary.moore, Foreman, S2-17577) | LOOK-ONLY |  | board heading or row title |
| T00318 | Blocked.dc.html | 109 | heading | Bill To on Credit Hold (S2-17579, Buda billed to Valders) | LOOK-ONLY |  | board heading or row title |
| T00319 | Blocked.dc.html | 139 | heading | Counter Sale is never offered, and phone | LOOK-ONLY |  | board heading or row title |
| T00320 | Blocked.dc.html | 30 | note | Left to right: an invoiced work order, a work order holding a deposit, a Bill To on Credit Hold, Counter Sale, then phone. | LOOK-ONLY |  | board layout (order of the pictures) |
| T00321 | Blocked.dc.html | 30 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00322 | Blocked.dc.html | 30 | note | For the Credit Hold row, Valders was put on Credit Hold on both stacks for the shots and set back to COD after. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00323 | Blocked.dc.html | 30 | note | After the tech review: clicking or tapping a locked Bill To shows its message as an error toast for anyone who can see the field; the button in the toast ("Open Deposits" or "Go To Invoice") shows only for users allowed to use it; history mode shows no lock message. | PRD-MATCH | S5-R2, S5-R5, S5-N3 | same meaning (toast on click or tap for everyone who sees the field) |
| T00324 | Blocked.dc.html | 30 | note | The deposit row and the mary.moore row were reshot on the build after the review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00325 | Blocked.dc.html | 37 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00326 | Blocked.dc.html | 37 | figure heading | Invoiced card | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00327 | Blocked.dc.html | 38 | alt | S2-17581 in production | LOOK-ONLY |  | picture description (alt text) |
| T00328 | Blocked.dc.html | 39 | caption | No Bill To on the card. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00329 | Blocked.dc.html | 42 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00330 | Blocked.dc.html | 42 | figure heading | Read-only | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00331 | Blocked.dc.html | 43 | alt | S2-17581 with read-only Bill To | LOOK-ONLY |  | picture description (alt text) |
| T00332 | Blocked.dc.html | 44 | caption | "Bill To" "Valders Diesel & Fleet Repair", read-only. | PRD-MATCH | S5-R1 | same meaning |
| T00333 | Blocked.dc.html | 47 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00334 | Blocked.dc.html | 47 | figure heading | Hover | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00335 | Blocked.dc.html | 48 | alt | Invoiced tooltip | LOOK-ONLY |  | picture description (alt text) |
| T00336 | Blocked.dc.html | 49 | caption | Tooltip: "Invoiced. Reverse the invoice to change who's billed." | PRD-MATCH | S5-R1, §8 M4 | word for word |
| T00337 | Blocked.dc.html | 49 | caption | No tooltip and no toast in history mode. | PRD-MATCH | S3-N2 | same meaning ('no lock message') |
| T00338 | Blocked.dc.html | 52 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00339 | Blocked.dc.html | 52 | figure heading | Click | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00340 | Blocked.dc.html | 53 | alt | Invoiced toast with Go To Invoice | LOOK-ONLY |  | picture description (alt text) |
| T00341 | Blocked.dc.html | 54 | caption | Error toast with the same words and "Go To Invoice" and "Close". | SPEC-CONFLICT | BT-D02 | Close is not in S5-R2 |
| T00342 | Blocked.dc.html | 54 | caption | "Go To Invoice" opens the Finance tab; it never reverses anything. | PRD-MATCH | S5-R3 | same meaning |
| T00343 | Blocked.dc.html | 54 | caption | Anyone who can see the field gets the toast. | PRD-MATCH | S5-N3 | same meaning |
| T00344 | Blocked.dc.html | 54 | caption | "Go To Invoice" shows only for users who can open the Finance tab; others get the message and "Close" only. | SPEC-CONFLICT | BT-D02 | S5-N1 'with no button' |
| T00345 | Blocked.dc.html | 54 | caption | Rechecked after the tech review: pixel-identical to the earlier shot, so not replaced. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00346 | Blocked.dc.html | 62 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00347 | Blocked.dc.html | 62 | figure heading | Card | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00348 | Blocked.dc.html | 63 | alt | S2-17577 in production | LOOK-ONLY |  | picture description (alt text) |
| T00349 | Blocked.dc.html | 64 | caption | No Bill To on the card. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00350 | Blocked.dc.html | 64 | caption | The "Over Limit" pill is production's credit check; not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') (production credit check) |
| T00351 | Blocked.dc.html | 67 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00352 | Blocked.dc.html | 67 | figure heading | Read-only | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00353 | Blocked.dc.html | 68 | alt | S2-17577 with read-only Bill To | LOOK-ONLY |  | picture description (alt text) |
| T00354 | Blocked.dc.html | 69 | caption | "Bill To" "7 Star Truck Repair", read-only while the deposit is held. | PRD-MATCH | S5-R4 | same meaning |
| T00355 | Blocked.dc.html | 69 | caption | The Change Customer button (two arrows at the top right of the customer card) stays enabled. | PRD-MATCH | S6-R3 | settled (BT-S02) |
| T00356 | Blocked.dc.html | 69 | caption | The server refuses Change Customer only when it would change the Bill To. | PRD-MATCH | S6-R3 | same meaning |
| T00357 | Blocked.dc.html | 69 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00358 | Blocked.dc.html | 72 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00359 | Blocked.dc.html | 72 | figure heading | Hover | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00360 | Blocked.dc.html | 73 | alt | Deposit tooltip | LOOK-ONLY |  | picture description (alt text) |
| T00361 | Blocked.dc.html | 74 | caption | Tooltip: "This work order has a $10.00 deposit from 7 Star Truck Repair. Reverse it, change the Bill To, then take the deposit again under the new Bill To." | PRD-MATCH | S5-R4, §8 M1 | word for word with [$amount] = $10.00, [customer] = 7 Star Truck Repair |
| T00362 | Blocked.dc.html | 77 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00363 | Blocked.dc.html | 77 | figure heading | Click | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00364 | Blocked.dc.html | 78 | alt | Deposit toast with Open Deposits | LOOK-ONLY |  | picture description (alt text) |
| T00365 | Blocked.dc.html | 79 | caption | Error toast with the same words, "Open Deposits" and "Close". | SPEC-CONFLICT | BT-D02 | Close is not in S5-R5 |
| T00366 | Blocked.dc.html | 79 | caption | "Open Deposits" opens the Deposits tab of the customer holding the largest share. | PRD-MATCH | S5-R6 | same meaning |
| T00367 | Blocked.dc.html | 79 | caption | Shot as admin, who can open Deposits. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00368 | Blocked.dc.html | 79 | caption | The hover tooltip also shows at the bottom left because the pointer is still on the field. | SPEC-CONFLICT | BT-D08 | tooltip position |
| T00369 | Blocked.dc.html | 79 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00370 | Blocked.dc.html | 87 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00371 | Blocked.dc.html | 87 | figure heading | Card (admin) | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00372 | Blocked.dc.html | 88 | alt | S2-17577 in production | LOOK-ONLY |  | picture description (alt text) |
| T00373 | Blocked.dc.html | 89 | caption | The same production board as the row above: production has no Bill To, so there is nothing to tap. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00374 | Blocked.dc.html | 89 | caption | No production board was shot as mary.moore for this work order. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00375 | Blocked.dc.html | 92 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00376 | Blocked.dc.html | 92 | figure heading | Card | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00377 | Blocked.dc.html | 93 | alt | S2-17577 as mary.moore with the Bill To shown read-only | LOOK-ONLY |  | picture description (alt text) |
| T00378 | Blocked.dc.html | 94 | caption | She sees "Bill To" "7 Star Truck Repair" because someone else pays. | PRD-MATCH | S3-N1 | same meaning |
| T00379 | Blocked.dc.html | 94 | caption | Accuracy check: the top bar shows her role's menu (no Dashboard, no Reports, a wider search box) and "Staging Heavy Duty - 9919". | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour; names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00380 | Blocked.dc.html | 94 | caption | Her only location is Staging Lethbridge - 4310, so for these shots her staff location was moved to Staging Heavy Duty - 9919 and moved back after. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00381 | Blocked.dc.html | 94 | caption | Not Bill To. | OUT-OF-SCOPE |  | names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00382 | Blocked.dc.html | 97 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00383 | Blocked.dc.html | 97 | figure heading | Click | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00384 | Blocked.dc.html | 98 | alt | Deposit toast with only Close for mary.moore | LOOK-ONLY |  | picture description (alt text) |
| T00385 | Blocked.dc.html | 99 | caption | Error toast: "This work order has a $10.00 deposit from 7 Star Truck Repair. Reverse it, change the Bill To, then take the deposit again under the new Bill To." with "Close" only. | SPEC-CONFLICT | BT-D02 | M1 text word for word, but with Close (S5-N2/N3 'with no button') |
| T00386 | Blocked.dc.html | 99 | caption | No "Open Deposits": she cannot open a customer's Deposits tab. | PRD-MATCH | S5-N2 | same meaning |
| T00387 | Blocked.dc.html | 99 | caption | The tooltip with the same words shows at the bottom left because the pointer is still on the field. | SPEC-CONFLICT | BT-D08 | tooltip position |
| T00388 | Blocked.dc.html | 102 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00389 | Blocked.dc.html | 102 | figure heading | Phone, tap | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00390 | Blocked.dc.html | 103 | alt | Deposit toast on a phone for mary.moore | LOOK-ONLY |  | picture description (alt text) |
| T00391 | Blocked.dc.html | 104 | caption | Details open, the Bill To field tapped (it sits below the fold, under the toast). | PRD-MATCH | Story 5 Form factor, S5-N3 | same meaning ('tap does what click does') |
| T00392 | Blocked.dc.html | 104 | caption | The same toast, "Close" only. | SPEC-CONFLICT | BT-D02 | Close |
| T00393 | Blocked.dc.html | 104 | caption | A tap never depends on a hover. | PRD-MATCH | Story 5 Form factor | same meaning ('no hover-only message') |
| T00394 | Blocked.dc.html | 112 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00395 | Blocked.dc.html | 112 | figure heading | Lines | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00396 | Blocked.dc.html | 113 | alt | S2-17579 in production with the payer on Credit Hold | LOOK-ONLY |  | picture description (alt text) |
| T00397 | Blocked.dc.html | 114 | caption | Production checks only Buda, which is on COD, so no banner. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00398 | Blocked.dc.html | 117 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00399 | Blocked.dc.html | 117 | figure heading | Banner | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00400 | Blocked.dc.html | 118 | alt | Credit Hold banner naming the Bill To | LOOK-ONLY |  | picture description (alt text) |
| T00401 | Blocked.dc.html | 119 | caption | Banner: "Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold", with "Change Bill To". | PRD-MATCH | S7-R6, §8 M2 | word for word with [Bill To] = Valders Diesel & Fleet Repair |
| T00402 | Blocked.dc.html | 119 | caption | The work order header shows a "Credit Hold" pill. | PRD-MATCH | S7-R11 | same meaning |
| T00403 | Blocked.dc.html | 122 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00404 | Blocked.dc.html | 122 | figure heading | Finance | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00405 | Blocked.dc.html | 123 | alt | Finance tab in production | LOOK-ONLY |  | picture description (alt text) |
| T00406 | Blocked.dc.html | 124 | caption | No banner. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00407 | Blocked.dc.html | 124 | caption | Create Invoice is greyed here only because no line is complete yet. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00408 | Blocked.dc.html | 127 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00409 | Blocked.dc.html | 127 | figure heading | Finance | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00410 | Blocked.dc.html | 128 | alt | Finance tab with the banner and Create Invoice disabled | LOOK-ONLY |  | picture description (alt text) |
| T00411 | Blocked.dc.html | 129 | caption | The same banner on Finance. | SPEC-CONFLICT | BT-D10 | S7-R6 places the work order banner in the page header |
| T00412 | Blocked.dc.html | 129 | caption | Create Invoice is greyed here because no line is complete; the Credit Hold tooltip on it was not shot. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour (S7-R8 not shown, BT-N09) |
| T00413 | Blocked.dc.html | 129 | caption | The toolbar (Customer PO, icons, Add Deposit, Create Invoice) sits where it does in production. | LOOK-ONLY |  | design-only look statement |
| T00414 | Blocked.dc.html | 132 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00415 | Blocked.dc.html | 132 | figure heading | Change Bill To | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00416 | Blocked.dc.html | 133 | alt | Change Bill To opens the card's Bill To list | LOOK-ONLY |  | picture description (alt text) |
| T00417 | Blocked.dc.html | 134 | caption | "Change Bill To" opens and focuses the card's Bill To field, so the page scrolls to it. | PRD-MATCH | S7-R7 | same meaning |
| T00418 | Blocked.dc.html | 134 | caption | The list: "Buda Truck Repair (this customer)" first, then the current Bill To "Valders Diesel & Fleet Repair" highlighted, then customers A to Z ("4 Star Truck Repair", "7 Star Truck Repair", "A & J Truck & Trailer Repair"). | SPEC-CONFLICT | BT-D01 | S3-R3 order |
| T00419 | Blocked.dc.html | 134 | caption | Reshot after the tech review. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00420 | Blocked.dc.html | 142 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00421 | Blocked.dc.html | 142 | figure heading | Counter Sale not offered | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00422 | Blocked.dc.html | 143 | alt | Searching the Counter Sale customer finds nothing | LOOK-ONLY |  | picture description (alt text) |
| T00423 | Blocked.dc.html | 144 | caption | In this data the Counter Sale customer is named "Gennadiy's Mobile Truck Repair". | DATA |  | demo records: the Counter Sale customer's name in this data |
| T00424 | Blocked.dc.html | 144 | caption | Typing "Gennadiy" in Bill To leaves only "Buda Truck Repair (this customer)". | PRD-MATCH | S3-R3, S1-N5 | same meaning (Counter Sale never offered) |
| T00425 | Blocked.dc.html | 147 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00426 | Blocked.dc.html | 147 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00427 | Blocked.dc.html | 148 | alt | S2-17579 on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00428 | Blocked.dc.html | 149 | caption | No banner. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00429 | Blocked.dc.html | 152 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00430 | Blocked.dc.html | 152 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00431 | Blocked.dc.html | 153 | alt | S2-17579 on a phone with Credit Hold | LOOK-ONLY |  | picture description (alt text) |
| T00432 | Blocked.dc.html | 154 | caption | The "Credit Hold" pill shows in the phone header, and the banner "Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold" with "Change Bill To" sits above the lines. | PRD-MATCH | S7-R6, S7-R11, Story 7 Form factor | same meaning |
| T00433 | Blocked.dc.html | 157 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00434 | Blocked.dc.html | 157 | figure heading | Phone, Change Bill To | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00435 | Blocked.dc.html | 158 | alt | Change Bill To on a phone opens Details and the Bill To list | LOOK-ONLY |  | picture description (alt text) |
| T00436 | Blocked.dc.html | 159 | caption | Tapping "Change Bill To" opens the phone Details, scrolls to the Bill To field and opens its list: "Buda Truck Repair (this customer)", "Valders Diesel & Fleet Repair" highlighted, then customers A to Z. | PRD-MATCH | S7-R7 | same meaning ('on a phone it first opens the work order details') |
| T00437 | Blocked.dc.html | 159 | caption | New after the tech review (it used to target the card hidden behind Details, so nothing visible happened). | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00438 | Blocked.dc.html | 159 | caption | Closed without saving. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00439 | ServiceFor.dc.html | 5 | title | 4. Service For band on invoices and estimates | LOOK-ONLY |  | board title (page name) |
| T00440 | ServiceFor.dc.html | 27 | heading | 4. Service For band on invoices and estimates | LOOK-ONLY |  | board heading or row title |
| T00441 | ServiceFor.dc.html | 32 | heading | Invoice billed to someone else (INV-S2-17581, Buda billed to Valders) | LOOK-ONLY |  | board heading or row title |
| T00442 | ServiceFor.dc.html | 57 | heading | Estimate billed to someone else (EST-S2-17582, A & J billed to Buda) | LOOK-ONLY |  | board heading or row title |
| T00443 | ServiceFor.dc.html | 82 | heading | Part sale with a vehicle (P2-256, 4 Star billed to 7 Star) | LOOK-ONLY |  | board heading or row title |
| T00444 | ServiceFor.dc.html | 107 | heading | Part sale without a vehicle (P2-254, 4 Star billed to 7 Star) | LOOK-ONLY |  | board heading or row title |
| T00445 | ServiceFor.dc.html | 132 | heading | Pays for itself, unchanged (S2-17322), and batch | LOOK-ONLY |  | board heading or row title |
| T00446 | ServiceFor.dc.html | 28 | note | Page 1 of each PDF, rendered by each stack from the same records at 110 dpi. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00447 | ServiceFor.dc.html | 28 | note | Each row: modern before, modern after, legacy before, legacy after. | LOOK-ONLY |  | board layout |
| T00448 | ServiceFor.dc.html | 28 | note | All renders are new for this file; none shows an "Attn" line. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00449 | ServiceFor.dc.html | 28 | note | Printed documents have no phone layout, so this page has no phone board. | PRD-MATCH | Story 8 Form factor | same meaning as 'Desktop only by rule: printed and PDF documents.' |
| T00450 | ServiceFor.dc.html | 28 | note | For the part sale with a vehicle, a 4 Star vehicle (2011 Hyundai Santa Fe, unit set to 4417) was attached to P2-256 for the render on both stacks and removed after. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00451 | ServiceFor.dc.html | 28 | note | The document design setting was switched between modern and legacy for the renders and set back to legacy. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00452 | ServiceFor.dc.html | 35 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00453 | ServiceFor.dc.html | 35 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00454 | ServiceFor.dc.html | 36 | alt | Modern invoice in production | LOOK-ONLY |  | picture description (alt text) |
| T00455 | ServiceFor.dc.html | 37 | caption | The Bill To block names Valders only because this build created the invoice and saved Valders on it. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00456 | ServiceFor.dc.html | 37 | caption | Production, creating it, would have saved Buda. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00457 | ServiceFor.dc.html | 37 | caption | Nothing says whose truck it was. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00458 | ServiceFor.dc.html | 40 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00459 | ServiceFor.dc.html | 40 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00460 | ServiceFor.dc.html | 41 | alt | Modern invoice with the Service For band | LOOK-ONLY |  | picture description (alt text) |
| T00461 | ServiceFor.dc.html | 42 | caption | A full-width band under the address row: "SERVICE FOR", "Buda Truck Repair", "Unit 854", "2024 INTERNATIONAL CV515", joined by " · ". | PRD-MATCH | S8-R1, S8-R2 | same meaning |
| T00462 | ServiceFor.dc.html | 42 | caption | Light grey fill and thin grey border, so it reads in black and white. | PRD-MATCH | S8-R5 | same meaning |
| T00463 | ServiceFor.dc.html | 45 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00464 | ServiceFor.dc.html | 45 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00465 | ServiceFor.dc.html | 46 | alt | Legacy invoice in production | LOOK-ONLY |  | picture description (alt text) |
| T00466 | ServiceFor.dc.html | 47 | caption | Same note on the Bill To block as the modern one. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00467 | ServiceFor.dc.html | 50 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00468 | ServiceFor.dc.html | 50 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00469 | ServiceFor.dc.html | 51 | alt | Legacy invoice with the Service For band | LOOK-ONLY |  | picture description (alt text) |
| T00470 | ServiceFor.dc.html | 52 | caption | The same band, under Bill To and Remit payment to, above the asset table. | PRD-MATCH | S8-R1, S8-R6 | same meaning (legacy) |
| T00471 | ServiceFor.dc.html | 60 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00472 | ServiceFor.dc.html | 60 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00473 | ServiceFor.dc.html | 61 | alt | Modern estimate in production | LOOK-ONLY |  | picture description (alt text) |
| T00474 | ServiceFor.dc.html | 62 | caption | Rendered live from the work order: the Bill To block is the customer, A & J Truck & Trailer Repair. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00475 | ServiceFor.dc.html | 62 | caption | This is production's true behavior. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00476 | ServiceFor.dc.html | 65 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00477 | ServiceFor.dc.html | 65 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00478 | ServiceFor.dc.html | 66 | alt | Modern estimate billed to Buda with Service For | LOOK-ONLY |  | picture description (alt text) |
| T00479 | ServiceFor.dc.html | 67 | caption | Bill To: "Buda Truck Repair" with its address. | PRD-MATCH | S7-R1, S8-R2 | same meaning |
| T00480 | ServiceFor.dc.html | 67 | caption | Band: "SERVICE FOR", "A & J Truck & Trailer Repair", "2017 Ford Transit". | PRD-MATCH | S8-R2, S8-R3 | same meaning (no unit) |
| T00481 | ServiceFor.dc.html | 67 | caption | The asset has no unit, so "Unit" drops out with its separator. | PRD-MATCH | S8-R3 | same meaning |
| T00482 | ServiceFor.dc.html | 70 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00483 | ServiceFor.dc.html | 70 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00484 | ServiceFor.dc.html | 71 | alt | Legacy estimate in production | LOOK-ONLY |  | picture description (alt text) |
| T00485 | ServiceFor.dc.html | 72 | caption | Bill To is A & J. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00486 | ServiceFor.dc.html | 75 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00487 | ServiceFor.dc.html | 75 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00488 | ServiceFor.dc.html | 76 | alt | Legacy estimate with Service For | LOOK-ONLY |  | picture description (alt text) |
| T00489 | ServiceFor.dc.html | 77 | caption | Bill To is Buda; the same band. | PRD-MATCH | S8-R6 | same meaning |
| T00490 | ServiceFor.dc.html | 85 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00491 | ServiceFor.dc.html | 85 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00492 | ServiceFor.dc.html | 86 | alt | Modern part sale estimate in production | LOOK-ONLY |  | picture description (alt text) |
| T00493 | ServiceFor.dc.html | 87 | caption | Bill To is the customer, 4 Star. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00494 | ServiceFor.dc.html | 90 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00495 | ServiceFor.dc.html | 90 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00496 | ServiceFor.dc.html | 91 | alt | Modern part sale with Service For and unit | LOOK-ONLY |  | picture description (alt text) |
| T00497 | ServiceFor.dc.html | 92 | caption | Bill To is 7 Star. | PRD-MATCH | S8-R4 | same meaning |
| T00498 | ServiceFor.dc.html | 92 | caption | Band: "SERVICE FOR", "4 Star Truck Repair", "Unit 4417", "2011 Hyundai Santa Fe". | PRD-MATCH | S8-R4 | same meaning |
| T00499 | ServiceFor.dc.html | 95 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00500 | ServiceFor.dc.html | 95 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00501 | ServiceFor.dc.html | 96 | alt | Legacy part sale estimate in production | LOOK-ONLY |  | picture description (alt text) |
| T00502 | ServiceFor.dc.html | 97 | caption | Bill To is 4 Star. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00503 | ServiceFor.dc.html | 100 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00504 | ServiceFor.dc.html | 100 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00505 | ServiceFor.dc.html | 101 | alt | Legacy part sale with Service For and unit | LOOK-ONLY |  | picture description (alt text) |
| T00506 | ServiceFor.dc.html | 102 | caption | The same band with the unit. | PRD-MATCH | S8-R4 | same meaning |
| T00507 | ServiceFor.dc.html | 110 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00508 | ServiceFor.dc.html | 110 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00509 | ServiceFor.dc.html | 111 | alt | Modern part sale without vehicle in production | LOOK-ONLY |  | picture description (alt text) |
| T00510 | ServiceFor.dc.html | 112 | caption | Bill To is 4 Star. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00511 | ServiceFor.dc.html | 115 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00512 | ServiceFor.dc.html | 115 | figure heading | Modern | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00513 | ServiceFor.dc.html | 116 | alt | Modern part sale without vehicle with Service For | LOOK-ONLY |  | picture description (alt text) |
| T00514 | ServiceFor.dc.html | 117 | caption | Band: "SERVICE FOR", "4 Star Truck Repair" only. | PRD-MATCH | S8-R4 | same meaning (no vehicle) |
| T00515 | ServiceFor.dc.html | 120 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00516 | ServiceFor.dc.html | 120 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00517 | ServiceFor.dc.html | 121 | alt | Legacy part sale without vehicle in production | LOOK-ONLY |  | picture description (alt text) |
| T00518 | ServiceFor.dc.html | 122 | caption | Bill To is 4 Star. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00519 | ServiceFor.dc.html | 125 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00520 | ServiceFor.dc.html | 125 | figure heading | Legacy | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00521 | ServiceFor.dc.html | 126 | alt | Legacy part sale without vehicle with Service For | LOOK-ONLY |  | picture description (alt text) |
| T00522 | ServiceFor.dc.html | 127 | caption | Name only. | PRD-MATCH | S8-R4 | same meaning |
| T00523 | ServiceFor.dc.html | 135 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00524 | ServiceFor.dc.html | 135 | figure heading | Modern, pays for itself | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00525 | ServiceFor.dc.html | 136 | alt | Modern invoice that pays for itself in production | LOOK-ONLY |  | picture description (alt text) |
| T00526 | ServiceFor.dc.html | 137 | caption | S2-17322 bills its own customer. | DATA |  | demo records |
| T00527 | ServiceFor.dc.html | 140 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00528 | ServiceFor.dc.html | 140 | figure heading | Modern, pays for itself | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00529 | ServiceFor.dc.html | 141 | alt | Modern invoice that pays for itself in this build | LOOK-ONLY |  | picture description (alt text) |
| T00530 | ServiceFor.dc.html | 142 | caption | No band. | PRD-MATCH | S8-N1 | same meaning |
| T00531 | ServiceFor.dc.html | 142 | caption | Pixel-identical to production (compared). | PRD-MATCH | S8-N1 | same meaning as S8-N1 'no band prints and the document is unchanged' |
| T00532 | ServiceFor.dc.html | 145 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00533 | ServiceFor.dc.html | 145 | figure heading | Legacy, pays for itself | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00534 | ServiceFor.dc.html | 146 | alt | Legacy invoice that pays for itself in production | LOOK-ONLY |  | picture description (alt text) |
| T00535 | ServiceFor.dc.html | 147 | caption | S2-17322. | DATA |  | demo records |
| T00536 | ServiceFor.dc.html | 150 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00537 | ServiceFor.dc.html | 150 | figure heading | Legacy, pays for itself | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00538 | ServiceFor.dc.html | 151 | alt | Legacy invoice that pays for itself in this build | LOOK-ONLY |  | picture description (alt text) |
| T00539 | ServiceFor.dc.html | 152 | caption | No band. | PRD-MATCH | S8-N1 | same meaning |
| T00540 | ServiceFor.dc.html | 152 | caption | Pixel-identical to production (compared). | PRD-MATCH | S8-N1 | same meaning as S8-N1 'no band prints and the document is unchanged' |
| T00541 | ServiceFor.dc.html | 157 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00542 | ServiceFor.dc.html | 157 | figure heading | Batch, page 1 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00543 | ServiceFor.dc.html | 158 | alt | Batch invoice page 1 in production | LOOK-ONLY |  | picture description (alt text) |
| T00544 | ServiceFor.dc.html | 159 | caption | Batch of S2-17581, S2-17513 and S2-17322. | DATA |  | demo records |
| T00545 | ServiceFor.dc.html | 159 | caption | Page 1 shown. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00546 | ServiceFor.dc.html | 162 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00547 | ServiceFor.dc.html | 162 | figure heading | Batch, page 1 | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00548 | ServiceFor.dc.html | 163 | alt | Batch invoice page 1 with Service For | LOOK-ONLY |  | picture description (alt text) |
| T00549 | ServiceFor.dc.html | 164 | caption | Page 1 is S2-17581 with its band. | PRD-MATCH | S8-R6 | same meaning (batch) |
| T00550 | ServiceFor.dc.html | 164 | caption | In the full PDF each invoice billed to someone else gets its own band; S2-17513 reads "SERVICE FOR", "Orchard City Truck & Trailer Repair", "Unit 15", "2018 Freightliner 114sd". | PRD-MATCH | S8-R6 | same meaning; pages 2-7 not pictured (BT-N11) |
| T00551 | ServiceFor.dc.html | 164 | caption | S2-17322 gets none. | PRD-MATCH | S8-N1 | same meaning |
| T00552 | GettingPaid.dc.html | 5 | title | 5. Getting paid | LOOK-ONLY |  | board title (page name) |
| T00553 | GettingPaid.dc.html | 29 | heading | 5. Getting paid | LOOK-ONLY |  | board heading or row title |
| T00554 | GettingPaid.dc.html | 34 | heading | The payer's Invoices tab | LOOK-ONLY |  | board heading or row title |
| T00555 | GettingPaid.dc.html | 59 | heading | Payment limited to the Bill To | LOOK-ONLY |  | board heading or row title |
| T00556 | GettingPaid.dc.html | 94 | heading | Invoice email, the portal, phone | LOOK-ONLY |  | board heading or row title |
| T00557 | GettingPaid.dc.html | 30 | note | Customer page, Invoices tab, then the payment window, then the invoice email, then the portal and phone. | LOOK-ONLY |  | board layout |
| T00558 | GettingPaid.dc.html | 30 | note | A & J Truck & Trailer Repair is the payer for S2-17513 (Orchard City's work) and S2-17362 (Phillipsburg's work). | DATA |  | demo records |
| T00559 | GettingPaid.dc.html | 30 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00560 | GettingPaid.dc.html | 30 | note | Both ran on the same data, and the receivables in that data were already posted to the payer by this build, so production lists them on the payer too; production itself would post them to the customer. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00561 | GettingPaid.dc.html | 37 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00562 | GettingPaid.dc.html | 37 | figure heading | A & J, Invoices | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00563 | GettingPaid.dc.html | 38 | alt | A and J invoices in production | LOOK-ONLY |  | picture description (alt text) |
| T00564 | GettingPaid.dc.html | 39 | caption | Date, Type, No., Memo, Total, Balance, Status, Action. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases; production column order |
| T00565 | GettingPaid.dc.html | 39 | caption | Nothing says whose work each invoice was. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00566 | GettingPaid.dc.html | 42 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00567 | GettingPaid.dc.html | 42 | figure heading | A & J, Invoices | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00568 | GettingPaid.dc.html | 43 | alt | A and J invoices with the Service For column | LOOK-ONLY |  | picture description (alt text) |
| T00569 | GettingPaid.dc.html | 44 | caption | New column after No.: header "Service For", naming the customer the work was for. | PRD-MATCH | S10-R6 | same meaning; 'after No.' is the design's position (PRD silent) |
| T00570 | GettingPaid.dc.html | 44 | caption | The column is hidden when no row on the tab is billed for someone else. | PRD-MATCH | S10-N1 | same meaning; PRD adds 'before any search' |
| T00571 | GettingPaid.dc.html | 47 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00572 | GettingPaid.dc.html | 47 | figure heading | Valders, Open only off | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00573 | GettingPaid.dc.html | 48 | alt | Valders invoices in production | LOOK-ONLY |  | picture description (alt text) |
| T00574 | GettingPaid.dc.html | 49 | caption | S2-17581 listed with no Service For column. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00575 | GettingPaid.dc.html | 52 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00576 | GettingPaid.dc.html | 52 | figure heading | Valders, Open only off | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00577 | GettingPaid.dc.html | 53 | alt | Valders invoices with Service For Buda | LOOK-ONLY |  | picture description (alt text) |
| T00578 | GettingPaid.dc.html | 54 | caption | S2-17581, Service For "Buda Truck Repair", Paid. | PRD-MATCH | S10-R6, S10-R1 | same meaning |
| T00579 | GettingPaid.dc.html | 62 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00580 | GettingPaid.dc.html | 62 | figure heading | Rows picked | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00581 | GettingPaid.dc.html | 63 | alt | A and J rows selected in production | LOOK-ONLY |  | picture description (alt text) |
| T00582 | GettingPaid.dc.html | 64 | caption | Both invoices ticked; New Payment turns on. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00583 | GettingPaid.dc.html | 67 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00584 | GettingPaid.dc.html | 67 | figure heading | Rows picked | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00585 | GettingPaid.dc.html | 68 | alt | A and J rows selected in this build | LOOK-ONLY |  | picture description (alt text) |
| T00586 | GettingPaid.dc.html | 69 | caption | The same, with the Service For column. | PRD-MATCH | S10-R6 | same meaning |
| T00587 | GettingPaid.dc.html | 72 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00588 | GettingPaid.dc.html | 72 | figure heading | New Customer Payment | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00589 | GettingPaid.dc.html | 73 | alt | New Customer Payment in production | LOOK-ONLY |  | picture description (alt text) |
| T00590 | GettingPaid.dc.html | 74 | caption | The payment window. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00591 | GettingPaid.dc.html | 77 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00592 | GettingPaid.dc.html | 77 | figure heading | New Customer Payment | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00593 | GettingPaid.dc.html | 78 | alt | New Customer Payment in this build | LOOK-ONLY |  | picture description (alt text) |
| T00594 | GettingPaid.dc.html | 79 | caption | The window is unchanged: S2-17362 and S2-17513, Payment amount $1,679.02. | PRD-MATCH | S10-R4 | same meaning |
| T00595 | GettingPaid.dc.html | 79 | caption | One payment covers several of the payer's invoices across the customers it pays for. | PRD-MATCH | S10-R4 | same meaning |
| T00596 | GettingPaid.dc.html | 79 | caption | A payment applied to another customer's invoice is refused by the server; that refusal has no screen here. | OUT-OF-SCOPE |  | S10-R5 not shown (BT-N13) |
| T00597 | GettingPaid.dc.html | 82 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00598 | GettingPaid.dc.html | 82 | figure heading | Orchard City, Invoices | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00599 | GettingPaid.dc.html | 83 | alt | Orchard City invoices in production | LOOK-ONLY |  | picture description (alt text) |
| T00600 | GettingPaid.dc.html | 84 | caption | Empty on this data. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00601 | GettingPaid.dc.html | 87 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00602 | GettingPaid.dc.html | 87 | figure heading | Orchard City, Invoices | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00603 | GettingPaid.dc.html | 88 | alt | Orchard City invoices in this build | LOOK-ONLY |  | picture description (alt text) |
| T00604 | GettingPaid.dc.html | 89 | caption | S2-17513 was Orchard City's work but is not on its tab, so it cannot be paid from Orchard City's side. | PRD-MATCH | S10-N2 | same meaning |
| T00605 | GettingPaid.dc.html | 97 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00606 | GettingPaid.dc.html | 97 | figure heading | Sending invoice (S2-17581) | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00607 | GettingPaid.dc.html | 98 | alt | Sending invoice in production | LOOK-ONLY |  | picture description (alt text) |
| T00608 | GettingPaid.dc.html | 99 | caption | Lists Buda's contact, "Wendy Lopez", ticked. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00609 | GettingPaid.dc.html | 102 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00610 | GettingPaid.dc.html | 102 | figure heading | Sending invoice (S2-17581) | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00611 | GettingPaid.dc.html | 103 | alt | Sending invoice to the Bill To contact | LOOK-ONLY |  | picture description (alt text) |
| T00612 | GettingPaid.dc.html | 104 | caption | Lists the Bill To's contacts and ticks "George Thomas" (Valders): its Billing contact, else its first. | PRD-MATCH | S9-R1, S9-R2 | same meaning |
| T00613 | GettingPaid.dc.html | 104 | caption | "Include 'For Customer' Attachments in email" starts unticked, as today. | PRD-MATCH | S9-R4 | same meaning |
| T00614 | GettingPaid.dc.html | 107 | badge | Not shown | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00615 | GettingPaid.dc.html | 107 | figure heading | Customer portal | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00616 | GettingPaid.dc.html | 109 | caption | The customer portal could not be shot. | OUT-OF-SCOPE |  | portal not pictured (register BT-N19) |
| T00617 | GettingPaid.dc.html | 110 | caption | The portal is a separate app and does not run on this machine. | OUT-OF-SCOPE |  | portal not pictured (register BT-N19) |
| T00618 | GettingPaid.dc.html | 110 | caption | Its Bill To changes ("Billed to [Bill To]" where Pay would be, Pay only for the Bill To, paying several invoices at once only for the viewer's own customer, the "invoice created" email to the Bill To's portal contacts, and the deposit link check) are built but have not been run live. | OUT-OF-SCOPE |  | portal not pictured (BT-N19); words match S16-R2..R7 in meaning |
| T00619 | GettingPaid.dc.html | 110 | caption | They are covered in the PRD. | OUT-OF-SCOPE |  | portal not pictured (BT-N19) |
| T00620 | GettingPaid.dc.html | 114 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00621 | GettingPaid.dc.html | 114 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00622 | GettingPaid.dc.html | 115 | alt | A and J invoices on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00623 | GettingPaid.dc.html | 116 | caption | The customer card comes first on a phone; the tab is below. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00624 | GettingPaid.dc.html | 119 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00625 | GettingPaid.dc.html | 119 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00626 | GettingPaid.dc.html | 120 | alt | A and J invoices on a phone in this build | LOOK-ONLY |  | picture description (alt text) |
| T00627 | GettingPaid.dc.html | 121 | caption | Same order as production. | LOOK-ONLY |  | phone look |
| T00628 | GettingPaid.dc.html | 121 | caption | Nothing phone-only. | LOOK-ONLY |  | phone look |
| T00629 | DeletePayer.dc.html | 5 | title | 6. Deleting a customer that pays for others | LOOK-ONLY |  | board title (page name) |
| T00630 | DeletePayer.dc.html | 28 | heading | 6. Deleting a customer that pays for others | LOOK-ONLY |  | board heading or row title |
| T00631 | DeletePayer.dc.html | 29 | note | Customers, Edit Customer, Delete. | LOOK-ONLY |  | board layout |
| T00632 | DeletePayer.dc.html | 29 | note | A customer with work orders, assets or contacts cannot be deleted at all, as today, so this flow uses Murrieta Diesel Repair, which has none. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour (S12-R8 says today's refusals come first) |
| T00633 | DeletePayer.dc.html | 29 | note | For the shots Murrieta was saved as Valders Diesel & Fleet Repair's default Bill To; "Remove as default Bill To" then cleared it, which is also the original state. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00634 | DeletePayer.dc.html | 29 | note | Murrieta was never deleted. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00635 | DeletePayer.dc.html | 29 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00636 | DeletePayer.dc.html | 34 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00637 | DeletePayer.dc.html | 34 | figure heading | Edit Customer, Delete | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00638 | DeletePayer.dc.html | 35 | alt | Edit Customer for Murrieta in production | LOOK-ONLY |  | picture description (alt text) |
| T00639 | DeletePayer.dc.html | 36 | caption | Delete is available. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00640 | DeletePayer.dc.html | 39 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00641 | DeletePayer.dc.html | 39 | figure heading | Edit Customer, Delete | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00642 | DeletePayer.dc.html | 40 | alt | Edit Customer for Murrieta in this build | LOOK-ONLY |  | picture description (alt text) |
| T00643 | DeletePayer.dc.html | 41 | caption | Murrieta's card shows "Pays for" 1. | PRD-MATCH | S1-R7 | same meaning |
| T00644 | DeletePayer.dc.html | 41 | caption | Delete is still available; the check happens on delete. | PRD-MATCH | S12-R1 | same meaning (BT-S01) |
| T00645 | DeletePayer.dc.html | 44 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00646 | DeletePayer.dc.html | 44 | figure heading | Confirmation | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00647 | DeletePayer.dc.html | 45 | alt | Delete confirmation in production | LOOK-ONLY |  | picture description (alt text) |
| T00648 | DeletePayer.dc.html | 46 | caption | "Confirmation": "Are you sure you want to delete this company?" with "Cancel" and "Delete". | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00649 | DeletePayer.dc.html | 46 | caption | Confirming would delete it; not clicked. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00650 | DeletePayer.dc.html | 49 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00651 | DeletePayer.dc.html | 49 | figure heading | Confirmation | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00652 | DeletePayer.dc.html | 50 | alt | Delete confirmation in this build | LOOK-ONLY |  | picture description (alt text) |
| T00653 | DeletePayer.dc.html | 51 | caption | The same confirmation, unchanged. | PRD-MATCH | S12-R8 | same meaning (today's flow first, BT-S01) |
| T00654 | DeletePayer.dc.html | 54 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00655 | DeletePayer.dc.html | 54 | figure heading | Delete Customer refused | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00656 | DeletePayer.dc.html | 55 | alt | Delete Customer window naming the dependent customer | LOOK-ONLY |  | picture description (alt text) |
| T00657 | DeletePayer.dc.html | 56 | caption | Window "Delete Customer": "This customer is the default Bill To for Valders Diesel & Fleet Repair. Remove it from that customer first." Each dependent customer is a link. | PRD-MATCH | S12-R1, S12-R2, §8 D8 | word for word with [names] = Valders Diesel & Fleet Repair, 'that customer' |
| T00658 | DeletePayer.dc.html | 56 | caption | Buttons "Cancel" and "Remove As Default Bill To" (app buttons render in Title Case). | PRD-MATCH | S12-R3, §8 D8 | word for word, same order |
| T00659 | DeletePayer.dc.html | 61 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00660 | DeletePayer.dc.html | 61 | figure heading | Remove as default Bill To | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00661 | DeletePayer.dc.html | 62 | alt | Remove as default Bill To confirmation | LOOK-ONLY |  | picture description (alt text) |
| T00662 | DeletePayer.dc.html | 63 | caption | "Remove as default Bill To": "Remove Murrieta Diesel Repair as the default Bill To for 1 customer? Open work orders keep their Bill To." Buttons "Cancel" and "Remove". | PRD-MATCH | S12-R4, §8 D8 | word for word with [customer] = Murrieta Diesel Repair, [N] = 1 |
| T00663 | DeletePayer.dc.html | 66 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00664 | DeletePayer.dc.html | 66 | figure heading | After Remove | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00665 | DeletePayer.dc.html | 67 | alt | Back on the delete confirmation after Remove | LOOK-ONLY |  | picture description (alt text) |
| T00666 | DeletePayer.dc.html | 68 | caption | The default is cleared and the user is back on the delete "Confirmation"; the user deletes again from there (not clicked here). | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00667 | DeletePayer.dc.html | 68 | caption | Fixed after these shots: the customer page now refreshes when the default is removed, so "Pays for" 1 disappears at once. | SPEC-CONFLICT | BT-D13 | the picture still shows Pays for 1; S1-N4 settles the expected result (BT-S05) |
| T00668 | DeletePayer.dc.html | 71 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00669 | DeletePayer.dc.html | 71 | figure heading | Result | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00670 | DeletePayer.dc.html | 72 | alt | Murrieta page after the default was removed | LOOK-ONLY |  | picture description (alt text) |
| T00671 | DeletePayer.dc.html | 73 | caption | Reloaded: no "Pays for" counter. | PRD-MATCH | S1-N4 | same meaning |
| T00672 | DeletePayer.dc.html | 73 | caption | Valders now bills itself for new work. | PRD-MATCH | S12-R5 | same meaning |
| T00673 | DeletePayer.dc.html | 76 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00674 | DeletePayer.dc.html | 76 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00675 | DeletePayer.dc.html | 77 | alt | Delete confirmation on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00676 | DeletePayer.dc.html | 78 | caption | Confirmation on a phone. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00677 | DeletePayer.dc.html | 81 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00678 | DeletePayer.dc.html | 81 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00679 | DeletePayer.dc.html | 82 | alt | Delete confirmation on a phone in this build | LOOK-ONLY |  | picture description (alt text) |
| T00680 | DeletePayer.dc.html | 83 | caption | The default had already been removed, so this shows the plain confirmation, same as production. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00681 | AssetTab.dc.html | 5 | title | 7. Asset Work Orders tab | LOOK-ONLY |  | board title (page name) |
| T00682 | AssetTab.dc.html | 30 | heading | 7. Asset Work Orders tab | LOOK-ONLY |  | board heading or row title |
| T00683 | AssetTab.dc.html | 84 | heading | Bill To column (asset of S2-17579, unit 854, Buda Truck Repair) | LOOK-ONLY |  | board heading or row title |
| T00684 | AssetTab.dc.html | 31 | note | Asset "shop heavy", opened from its current owner, Quartzsite Truck Service & Repair. | DATA |  | demo records |
| T00685 | AssetTab.dc.html | 31 | note | It had an earlier owner, Kolosov's Diesel Repair. | DATA |  | demo records |
| T00686 | AssetTab.dc.html | 31 | note | Left to right: the default view, the Customer chip open, one customer picked, applied, a 1600px board with search filled, then phone. | LOOK-ONLY |  | board layout (order of the pictures) |
| T00687 | AssetTab.dc.html | 31 | note | Last row: the asset of S2-17579 (2024 INTERNATIONAL CV515, unit 854, Buda Truck Repair), where two work orders bill someone else, to show the "Bill To" column added after the tech review. | LOOK-ONLY |  | board layout |
| T00688 | AssetTab.dc.html | 31 | note | Before: production v26.45.2.1. After: the locked Bill To build. | LOOK-ONLY |  | badge legend |
| T00689 | AssetTab.dc.html | 36 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00690 | AssetTab.dc.html | 36 | figure heading | Work Orders tab | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00691 | AssetTab.dc.html | 37 | alt | Asset Work Orders tab in production | LOOK-ONLY |  | picture description (alt text) |
| T00692 | AssetTab.dc.html | 38 | caption | Only the current owner's work: S2-16988. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00693 | AssetTab.dc.html | 38 | caption | Toolbar: Search, Status, New. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00694 | AssetTab.dc.html | 41 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00695 | AssetTab.dc.html | 41 | figure heading | Whole history | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00696 | AssetTab.dc.html | 42 | alt | Asset Work Orders tab with the whole history | LOOK-ONLY |  | picture description (alt text) |
| T00697 | AssetTab.dc.html | 43 | caption | Every work order on the asset at this location, for every owner and payer, oldest first as today: Kolosov's work orders now appear too. | PRD-MATCH | S14-R1 | same meaning |
| T00698 | AssetTab.dc.html | 43 | caption | No row here bills someone else, so there is no "Bill To" column (see the S2-17579 asset below). | PRD-MATCH | S14-R6 | same meaning |
| T00699 | AssetTab.dc.html | 43 | caption | Rechecked after the tech review: pixel-identical, not replaced. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00700 | AssetTab.dc.html | 43 | caption | New chip between Status and New: "Customer: All customers". | PRD-MATCH | S14-R2 | same meaning ('beside Status', 'All customers') |
| T00701 | AssetTab.dc.html | 43 | caption | Search and Status shift left to make room; New stays at the right edge. | LOOK-ONLY |  | design-only look statement |
| T00702 | AssetTab.dc.html | 43 | caption | The chip is the only addition and nothing wraps. | LOOK-ONLY |  | design-only look statement (1440) |
| T00703 | AssetTab.dc.html | 43 | caption | Release-day change: old owners' jobs appear on this tab. | PRD-MATCH | §2 Release day | same meaning |
| T00704 | AssetTab.dc.html | 46 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00705 | AssetTab.dc.html | 46 | figure heading | Customer chip open | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00706 | AssetTab.dc.html | 47 | alt | Customer chip open | LOOK-ONLY |  | picture description (alt text) |
| T00707 | AssetTab.dc.html | 48 | caption | "All customers" ticked, then "All customers are included. Pick one or more to narrow.", then each customer on the asset's work orders, as customer or Bill To, A to Z: "Kolosov's Diesel Repair", "Quartzsite Truck Service & Repair". | PRD-MATCH | S14-R3 | options A to Z as customer or Bill To match S14-R3; the help sentence is design-only (BT-S07) |
| T00708 | AssetTab.dc.html | 48 | caption | Search shows only with more than 8 options. | PRD-MATCH | S14-R5 | same meaning |
| T00709 | AssetTab.dc.html | 51 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00710 | AssetTab.dc.html | 51 | figure heading | One customer picked | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00711 | AssetTab.dc.html | 52 | alt | Quartzsite picked in the Customer chip | LOOK-ONLY |  | picture description (alt text) |
| T00712 | AssetTab.dc.html | 53 | caption | Quartzsite ticked: "1 selected", and the chip reads "Customer: Quartzsite Truc...". | LOOK-ONLY |  | design-only words (BT-S07) |
| T00713 | AssetTab.dc.html | 56 | badge | New, no before exists | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00714 | AssetTab.dc.html | 56 | figure heading | Applied | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00715 | AssetTab.dc.html | 57 | alt | Customer filter applied | LOOK-ONLY |  | picture description (alt text) |
| T00716 | AssetTab.dc.html | 58 | caption | Only S2-16988. | PRD-MATCH | S14-R4 | filtered result |
| T00717 | AssetTab.dc.html | 58 | caption | A work order matches when a picked customer is its customer or its Bill To. | PRD-MATCH | S14-R4 | same meaning |
| T00718 | AssetTab.dc.html | 63 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00719 | AssetTab.dc.html | 63 | figure heading | 1600 wide, search "S2-16" | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00720 | AssetTab.dc.html | 64 | alt | Asset tab at 1600 with search in production | LOOK-ONLY |  | picture description (alt text) |
| T00721 | AssetTab.dc.html | 65 | caption | One match from the current owner, S2-16988. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00722 | AssetTab.dc.html | 68 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00723 | AssetTab.dc.html | 68 | figure heading | 1600 wide, search "S2-16" | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00724 | AssetTab.dc.html | 69 | alt | Asset tab at 1600 with search in this build | LOOK-ONLY |  | picture description (alt text) |
| T00725 | AssetTab.dc.html | 70 | caption | Searching the whole history finds Kolosov's S2-16894 as well. | PRD-MATCH | S14-R1 | same meaning |
| T00726 | AssetTab.dc.html | 70 | caption | The search box, Status, Customer chip and New sit on one line at 1600; nothing wraps. | LOOK-ONLY |  | design-only look statement (1600) |
| T00727 | AssetTab.dc.html | 73 | badge | Production (v26.45.2.1) | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00728 | AssetTab.dc.html | 73 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00729 | AssetTab.dc.html | 74 | alt | Asset page on a phone in production | LOOK-ONLY |  | picture description (alt text) |
| T00730 | AssetTab.dc.html | 75 | caption | The asset card comes first on a phone. | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00731 | AssetTab.dc.html | 78 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00732 | AssetTab.dc.html | 78 | figure heading | Phone | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00733 | AssetTab.dc.html | 79 | alt | Asset page on a phone in this build | LOOK-ONLY |  | picture description (alt text) |
| T00734 | AssetTab.dc.html | 80 | caption | Same order as production. | LOOK-ONLY |  | phone look |
| T00735 | AssetTab.dc.html | 87 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00736 | AssetTab.dc.html | 87 | figure heading | Work Orders tab, top | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00737 | AssetTab.dc.html | 88 | alt | Asset Work Orders tab with a Bill To column | LOOK-ONLY |  | picture description (alt text) |
| T00738 | AssetTab.dc.html | 89 | caption | A "Bill To" column sits right after Customer because a loaded row bills someone else. | SPEC-CONFLICT | BT-D11 | 'loaded row' vs S14-R6 'at least one row' |
| T00739 | AssetTab.dc.html | 89 | caption | S2-17579 reads "Buda Truck Repair", "Valders Diesel & Fleet Repair". | PRD-MATCH | S14-R6 | same meaning |
| T00740 | AssetTab.dc.html | 89 | caption | Self-billed rows leave the Bill To cell blank. | PRD-MATCH | S14-R6 | same meaning |
| T00741 | AssetTab.dc.html | 89 | caption | Oldest first, as today. | PRD-MATCH | S14-R1 | same meaning ('in today's sort') |
| T00742 | AssetTab.dc.html | 89 | caption | At 1440 the extra column pushes the last columns past the right edge; the table scrolls sideways. | SPEC-CONFLICT | BT-D07 | clipping at 1440 |
| T00743 | AssetTab.dc.html | 89 | caption | No production board for this asset: production was not re-run for this update. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour |
| T00744 | AssetTab.dc.html | 89 | caption | Production's tab has no Bill To column on any asset (see the "shop heavy" before board above). | OUT-OF-SCOPE |  | describes production today (before picture); unchanged production is out of scope for Bill To look cases |
| T00745 | AssetTab.dc.html | 89 | caption | Accuracy check: top bar identical to production; the tab toolbar differs from production only by the Customer chip (this build) and the Invoices count, which is this asset's data. | OUT-OF-SCOPE |  | design-file process note (how or when the picture was made); not Bill To behaviour; names another feature or newer develop work in the same build; not Bill To (cover: 'They are not Bill To') |
| T00746 | AssetTab.dc.html | 92 | badge | This build | LOOK-ONLY |  | picture badge: which side of the comparison the picture shows |
| T00747 | AssetTab.dc.html | 92 | figure heading | Work Orders tab, scrolled | LOOK-ONLY |  | picture heading: the state the picture shows |
| T00748 | AssetTab.dc.html | 93 | alt | Asset Work Orders tab scrolled to the last rows | LOOK-ONLY |  | picture description (alt text) |
| T00749 | AssetTab.dc.html | 94 | caption | The last two rows, S2-17579 (Approved) and S2-17581 (Paid), both read "Valders Diesel & Fleet Repair" under Bill To. | PRD-MATCH | S14-R6 | same meaning |
| T00750 | AssetTab.dc.html | 94 | caption | When no loaded row bills someone else the column is not shown at all. | SPEC-CONFLICT | BT-D11 | 'loaded row' |

## Screenshot words (distinct text per class; files listed)

| Text | Class | Codes | Pictures | Note |
|---|---|---|---|---|
| $ | DATA |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | demo data |
| $ 0.00 | DATA |  | 13 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| $0 | DATA |  | 16 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| $0.00 | DATA |  | 78 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| $1,032.51 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $1,083.27 | DATA |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| $1,266.92 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $1,424.61 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $1,679.02 | DATA |  | 8 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| $1,679.37 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $1,680.02 | DATA |  | after-p5-aj-rows-selected.png, before-p5-aj-rows-selected.png | demo data |
| $1,836.78 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $10,000.00 | DATA |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| $11.50 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $131.96 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| $136.55 | DATA |  | after-p7-asset-customer-applied.png, after-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders.png | demo data |
| $145 | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| $149.95 | DATA |  | 5 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| $150 | DATA |  | 5 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| $150.00 | DATA |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | demo data |
| $164.95 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| $175.54 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $2,120.44 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $2,185.40 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $22.10 | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| $224.93 | DATA |  | 8 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| $247.43 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| $250.52 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $298.89 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $3,099.27 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $3,188.36 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $3,241.06 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $380.96 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $400 | DATA |  | after-p3-invoiced-card.png, after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png, before-p3-invoiced-card.png | demo data |
| $400.00 | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| $42.00 | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| $442.00 | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| $464.10 | DATA |  | 14 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $5,215.80 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $538.12 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $542.35 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $580 | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| $593.29 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $595.75 | DATA |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| $596.75 | DATA |  | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, before-p5-aj-invoices.png, before-p5-aj-rows-selected.png | demo data |
| $62.24 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $661.20 | DATA |  | 8 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $67.23 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $7.07 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $7.47 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $7.99 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| $74.98 | DATA |  | 7 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| $765.54 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| $82.48 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| $837.61 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| $9,333.18 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| (-) Fuel filter | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) Oil | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) brake clean | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) grease | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) oil filter | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) washer fluid | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (-) water seperator | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| (403) 523 - 0488 | DATA |  | 24 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| (471) 611 - 4441 | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| (839) 680 - 8298 | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| (AT502207) Left side chassis harness | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| (delete icon) | DATA |  | 5 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| (more icon) | DATA |  | 17 pictures, e.g. after-p2-part-sale-card.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png | demo data |
| + Add Part | DATA |  | 22 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| - | DATA |  | 48 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| 0 | DATA |  | 23 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-edit-customer-counter-sale.png | demo data |
| 0% | DATA |  | 47 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| 0-BB695 | DATA |  | after-p3-credit-hold-change-bill-to.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| 0.00 | DATA |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | demo data |
| 0.00 / 0.00 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| 0.00 / 0.50 | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| 0.00 / 0.80 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| 0.00 / 1.50 | DATA |  | 12 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| 0.00 / 4.00 | DATA |  | 14 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| 01 | DATA |  | after-p4-modern-invoice-billed-to-other.png, before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 01:00 PM | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| 02 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 071-234-2245 | DATA |  | 19 pictures, e.g. after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-picked.png | demo data |
| 0794 Willie Mills Suite 010 | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| 086-623-0166 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 09:54 AM | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| 1 | DATA |  | 68 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| 1,083.27 | DATA |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | demo data |
| 1. | DATA |  | after-p3-phone-credit-hold.png, before-p3-phone-credit-hold.png | demo data |
| 10 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 10,210 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 100 days | DATA |  | after-p7-asset-work-orders-1600-search.png | demo data |
| 100% | DATA |  | 28 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| 102% | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| 10:00 AM | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| 11 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 11,222 | DATA |  | 13 pictures, e.g. after-p3-credit-hold-change-bill-to.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| 112% | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| 115% | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 12 | DATA |  | 15 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 12:33 PM | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| 12:35 PM | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| 135% | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| 14 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 148-434-9127 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 15W40 Bulk- Mobil 1 Delvac HDEO | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 16% | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 167% | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| 170-451-7342 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 17483 Shane Drive | DATA |  | 12 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| 17483 Shane DrivePatriciashire, OntarioB4Y6L9 | DATA |  | after-p5-phone-aj-invoices.png, before-p5-phone-aj-invoices.png | demo data |
| 193 Stephen Island Apt. 722 | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| 1997 PTL | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 1HTKTSWK4RH442544 | DATA |  | 16 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 2 | DATA |  | 27 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 2% | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2. | DATA |  | after-p3-phone-credit-hold.png, before-p3-phone-credit-hold.png | demo data |
| 20 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| 2011 Hyundai Santa Fe | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| 2011 ISUZU NQR/ NRR | DATA |  | before-p4-legacy-invoice-pays-for-itself.png | demo data |
| 2011 ISUZU NQR/NRR | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 2017 Ford Transit | DATA |  | after-p4-legacy-estimate-billed-to-other.png, after-p4-modern-estimate-billed-to-other.png, before-p4-legacy-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | demo data |
| 2021 JOHN DEERE | DATA |  | before-p2-authorizer-open.png, before-p3-deposits-card.png | demo data |
| 2021 Kaufman Trailers Of Ne, Inc. Kaufma.. | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2023 Hino Incomplete Vehicle | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2023 XCMG ES125PD | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2024 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| 2024 INTERNATIONAL CV515 | DATA |  | 10 pictures, e.g. after-p3-credit-hold-finance.png, after-p3-phone-credit-hold.png, after-p4-batch.png | demo data |
| 2024 INTERNATIONAL CV515 854 | DATA |  | 23 pictures, e.g. after-p2-new-work-order.png, after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png | demo data |
| 2206262 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2247 Spencer Roads | DATA |  | before-p4-modern-invoice-pays-for-itself.png | demo data |
| 225,584 | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| 23% | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2335 Thomas Well | DATA |  | 9 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| 27 | DATA |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| 2AYNF7AV7P3T10746 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2P9LB62A8V1061236 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 2ZTM0GN6FHYZT4KXE | DATA |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| 3 | DATA |  | 35 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| 3,834 | DATA |  | 12 pictures, e.g. after-p3-credit-hold-change-bill-to.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| 305 Harris Cape | DATA |  | after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-no-vehicle.png, after-p4-modern-part-sale-with-vehicle.png | demo data |
| 309% | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| 348 Ramos Field Suite 079 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 363,551 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 366 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 366-450-7279 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 373-618-0076 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 4 | DATA |  | 18 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| 4 Star Truck Repair | DATA |  | 22 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-edit-customer-buda-open.png, after-p1-mary-new-customer.png | demo data |
| 4 days | DATA |  | after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, before-p1-aj-page.png | demo data |
| 400-268-3715 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 409 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 414 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 421-421-6674 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 423 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 430 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 4417 | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| 462 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 471-611-4441 | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| 491-406-3151 | DATA |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| 498 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 4WD/4-Wheel Drive/4x4 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| 5 | DATA |  | 13 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 514 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 562 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 595.75 | DATA |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | demo data |
| 596 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 5SHFE4730MB001604 | DATA |  | 8 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 6 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 609-461-6502 | DATA |  | 9 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 6263 Elizabeth Causeway Apt. 973 | DATA |  | before-p4-legacy-part-sale-no-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-no-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| 632 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 646-858-9964 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 651 days | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 684-154-9226 | DATA |  | 8 pictures, e.g. after-p6-blocked.png, after-p6-del-after-remove.png, after-p6-delete-first.png | demo data |
| 699-679-2107 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 7 | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| 7 Star Truck Repair | DATA |  | 25 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-edit-customer-buda-open.png, after-p1-mary-new-customer.png | demo data |
| 73 | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| 730-246-8895 | DATA |  | 9 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 74% | DATA |  | after-p2-new-work-order.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p2-new-work-order.png | demo data |
| 77% | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| 777-878-3348 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 79789048 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 8 | DATA |  | 10 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 80% | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| 816970 | DATA |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| 8237 Brittney Divide Apt. 463 | DATA |  | 17 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| 8237 Brittney Divide Apt. 463Apt. 891Walshhaven, | DATA |  | after-p1-phone-buda-page.png, before-p1-phone-buda-page.png | demo data |
| 839-680-8298 | DATA |  | 16 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| 84% | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| 854 | DATA |  | 39 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| 86% | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| 87% | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 885-670-3999 | DATA |  | 20 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| 898-021-4480 | DATA |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | demo data |
| 9 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png, before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| 908-734-7978 | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| 92% | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| 93% | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| 94 days | DATA |  | 5 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-picked-open.png, after-p7-asset-work-orders-1600-search.png | demo data |
| 940-826-3697 | DATA |  | before-p4-modern-invoice-pays-for-itself.png | demo data |
| 958-590-3025 | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| 96% | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| 963-871-9453 | DATA |  | after-p4-modern-invoice-billed-to-other.png, after-p5-valders-invoices-all.png, before-p5-valders-invoices-all.png | demo data |
| 965 Smith Course | DATA |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| 97% | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| 98% | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| 9919 Shepard Road SE | DATA |  | 22 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| 997-656-9359 | DATA |  | 8 pictures, e.g. after-p2-wo77-change-customer.png, after-p3-deposits-card.png, after-p3-deposits-toast.png | demo data |
| 9982 Espinoza Lodge Suite 631 | DATA |  | 8 pictures, e.g. after-p6-blocked.png, after-p6-del-after-remove.png, after-p6-delete-first.png | demo data |
| > | DATA |  | 9 pictures, e.g. after-p1-phone-buda-page.png, after-p2-wo79-card.png, after-p3-credit-hold-banner.png | demo data |
| A & J | DATA |  | after-p1-new-customer-field-search.png | demo data |
| A & J Truck & Trailer Repair | DATA |  | 37 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Aberdeen Diesel Services LLC | DATA |  | 12 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-edit-customer-buda-open.png, after-p1-mary-new-customer.png | demo data |
| Aberdeen Truck Repair | DATA |  | 11 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png | demo data |
| Abilene Mechanical Services | DATA |  | 11 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png | demo data |
| Abode Trucking & Repair | DATA |  | 10 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png | demo data |
| Accokeek Heavy Truck Repair Inc | DATA |  | 9 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png | demo data |
| Action | DATA |  | 34 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Actual/Estimate | DATA |  | 26 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Ada Truck Service & Repair | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Add tech story for this line | DATA |  | 7 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Adeel's Mobile Diesel Repair | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Admin ShopView | DATA |  | after-p2-wo-log.png, after-p5-invoice-email.png, before-p2-wo-log.png, before-p5-invoice-email.png | demo data |
| Ado Truck Center - Oasis | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Adrian's Truck & Trailer Repair LLC | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Affordable Diesel Performance | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Affordable Fleet Services | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Air Filter | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Allison Hughes | DATA |  | 8 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| Amount | DATA |  | 13 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| Andrews' Truck & Trailer Repai.. | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Annual inspection | DATA |  | 19 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Approve | DATA |  | 17 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Approved | DATA |  | 26 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Apr 17, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Apr 23, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Apr 9, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Apt. 150 | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| Apt. 891 | DATA |  | 17 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| Asset | DATA |  | 36 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Aug 1, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Aug 18, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Aug 20, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Aug 21, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Aug 31, 2026 | DATA |  | 10 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Aug 4, 2026 | DATA |  | after-p7-asset-customer-applied.png, after-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders.png | demo data |
| Auth To Order | DATA |  | 5 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Authorizer | DATA |  | 41 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Becky Gonzales | DATA |  | 10 pictures, e.g. after-p2-new-work-order.png, after-p2-phone-wo79-card.png, after-p2-wo79-card.png | demo data |
| Bill To | DATA |  | 7 pictures, e.g. before-p3-credit-hold-finance.png, before-p4-batch.png, before-p4-legacy-estimate-billed-to-other.png | demo data |
| Brake & Parts Cleaner | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Brandon Juarez | DATA |  | 8 pictures, e.g. after-p2-wo77-change-customer.png, after-p3-deposits-card.png, after-p3-deposits-toast.png | demo data |
| British Columbia | DATA |  | 13 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| British ColumbiaP5H 7C4 | DATA |  | after-p1-phone-buda-page.png, before-p1-phone-buda-page.png | demo data |
| Buda Truck Repair | DATA |  | 47 pictures, e.g. after-p1-aj-pays-for-dialog.png, after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png | demo data |
| C/O T04220C PO Box 4220, STN A | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| C1BKL36L60D9C4SKW | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| COD | DATA |  | 58 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| CV515 854 | DATA |  | after-p3-counter-sale-not-offered.png | demo data |
| CWI-6765 | DATA |  | after-p4-modern-invoice-billed-to-other.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p4-modern-invoice-billed-to-other.png | demo data |
| Calgary, Alberta | DATA |  | 20 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Calgary, Alberta, T2C 4M5 | DATA |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | demo data |
| Cameron Johnston | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p2-new-work-order.png, after-p7-asset-customer-open.png | demo data |
| Canada | DATA |  | 17 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| Christian Wallace | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| Clinton Truck & Tr... | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Colesville Diesel F... | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Complete | DATA |  | 11 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Completed a general inspection of the unit and documented additional repairs as identified during the inspection. Job complete. | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Contact | DATA |  | 28 pictures, e.g. after-p2-part-sale-card.png, after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png | demo data |
| Continental Fleet ... | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Coughlin & Sons T... | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Cummins QSX15-G9 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Customer PO | DATA |  | 14 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| DCL-8441 | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| Daniel Montoya | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p2-new-work-order.png, after-p7-asset854-work-orders-bottom.png | demo data |
| David Combs | DATA |  | 11 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| Dec 17, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Dec 18, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Dec 8, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Decline | DATA |  | 19 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Delano Diesel Services LLC | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Description | DATA |  | 15 pictures, e.g. after-p2-part-sale-card.png, after-p3-credit-hold-finance.png, after-p4-batch.png | demo data |
| Desert Edge Truck Service & Re.. | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Desert Edge Truck Service & Repair | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| Dfgdfgdfg | DATA |  | 10 pictures, e.g. after-p3-invoiced-card.png, after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png | demo data |
| Due date | DATA |  | 13 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| Due date: | DATA |  | 12 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Due date: Nov 6, 2026 | DATA |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | demo data |
| EP2 Grease Tube, 390G | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| EST- | DATA |  | after-p4-legacy-estimate-billed-to-other.png, before-p4-legacy-estimate-billed-to-other.png | demo data |
| EST-P2-254 | DATA |  | after-p4-legacy-part-sale-no-vehicle.png, after-p4-modern-part-sale-no-vehicle.png, before-p4-legacy-part-sale-no-vehicle.png, before-p4-modern-part-sale-no-vehicle.png | demo data |
| EST-P2-254 - Page 1 / 1 | DATA |  | after-p4-legacy-part-sale-no-vehicle.png, after-p4-modern-part-sale-no-vehicle.png, before-p4-legacy-part-sale-no-vehicle.png, before-p4-modern-part-sale-no-vehicle.png | demo data |
| EST-P2-256 | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| EST-P2-256 - Page 1 / 1 | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| EST-S2-17582 | DATA |  | after-p4-modern-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | demo data |
| EST-S2-17582 - Page 1 / 1 | DATA |  | after-p4-legacy-estimate-billed-to-other.png, after-p4-modern-estimate-billed-to-other.png, before-p4-legacy-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | demo data |
| East Bruce | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| East Bruce, Yukon Territory | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| Edward Bowen | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Eng Hrs | DATA |  | 11 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| Engine | DATA |  | 20 pictures, e.g. after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png | demo data |
| Engine Hours | DATA |  | after-p3-credit-hold-change-bill-to.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| Engine Oil Filter, Isuzu/Hino | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Estimate | DATA |  | 31 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Estimate: EST-S2-17579 | DATA |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | demo data |
| Feb 12, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Finance | DATA |  | 32 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Foothills Group Inc | DATA |  | after-p5-invoice-email.png, before-p5-invoice-email.png | demo data |
| Foothills Group Inc c/o Interstate Billing Service | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Ford Transit | DATA |  | after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, before-p1-aj-page.png | demo data |
| G2M 4Y2 | DATA |  | 9 pictures, e.g. after-p6-blocked.png, after-p6-del-after-remove.png, after-p6-delete-first.png | demo data |
| GST# 812694966 RT0001 | DATA |  | 20 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Gennadiy | DATA |  | after-p3-counter-sale-not-offered.png | demo data |
| Gennadiy's Mobile Truck Repair | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| George Thomas | DATA |  | after-p5-invoice-email.png | demo data |
| Gerald Ortiz | DATA |  | 16 pictures, e.g. after-p2-new-work-order.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-picked.png | demo data |
| Greased the unit at all required lubrication points and topped up the windshield washer fluid. Rechecked the engine oil level and adjusted as required. | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Heavy Duty - 9919 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| INTERNATIONAL CV515 | DATA |  | 9 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| INV-S2-17322 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| INV-S2-17322 - Page 1 / 4 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| INV-S2-17581 | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| INV-S2-17581 - Page 1 / 1 | DATA |  | after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, before-p4-legacy-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png | demo data |
| Inspection | DATA |  | 6 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Internal faults in harness | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| International 6.6 | DATA |  | 22 pictures, e.g. after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png | demo data |
| Invoice Date: | DATA |  | 11 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Invoice Date: Nov 6, 2026 | DATA |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | demo data |
| Invoiced | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| JP: Performed a lube, oil, and filter (LOF) service. Drained the engine oil and removed the existing oil filter. Pre-filled the new oil filter before installation, then refilled the engine with the appropriate oil and verified the oil level. | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| JP: Removed air filter. Cleaned hosuing replaced with new. Job complete. | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Jaime Johnson | DATA |  | after-p2-authorizer-open-scrolled.png | demo data |
| James Price | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| Jan 15, 2026 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Jan 24, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Jasmine Baker | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Jul 27, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jul 28, 2026 | DATA |  | 7 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jul 31, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jun 10, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Jun 16, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jun 19, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jun 22, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Jun 26, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Jun 8, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| KXS-6900 | DATA |  | after-p4-modern-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | demo data |
| Kaufman Trailers Of .. | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Kelsey Weiss | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Kenneth Oconnor | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Kevin Davis | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Kolosov's Diesel Repair | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png, after-p7-asset-work-orders-1600-search.png, after-p7-asset-work-orders.png | demo data |
| L7 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| LOF Inspection | DATA |  | 6 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Labor | DATA |  | 39 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Lake Paula | DATA |  | after-p6-edit-bottom.png, before-p6-edit-bottom.png, before-p6-phone-delete-first.png | demo data |
| Lauren Richmond | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Lead Technician | DATA |  | 44 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| License Plate | DATA |  | after-p3-credit-hold-change-bill-to.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| Line Total | DATA |  | 7 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Lines (1) | DATA |  | 14 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| Lone Star Fleet Services | DATA |  | after-p1-new-customer-field-open.png, after-p1-new-customer-field-picked.png, after-p1-new-customer-field-search.png | demo data |
| Manitoba | DATA |  | 10 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Mar 13, 2026 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Mar 20, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Mar 25, 2026 | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Mar 26, 2026 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Margin | DATA |  | 28 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Mark Richardson | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| Mayfield Heights Truck Centre | DATA |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Melanie Garner | DATA |  | 6 pictures, e.g. after-p1-buda-page.png, after-p2-new-work-order.png, after-p7-asset854-work-orders-bottom.png | demo data |
| Melissa Spencer | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Michael Newman | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Mileage | DATA |  | 14 pictures, e.g. after-p3-credit-hold-change-bill-to.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold-change-bill-to.png | demo data |
| Millertown | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Monica Brady | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| Name/Description | DATA |  | 26 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Needs Approval | DATA |  | 17 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Net 30 | DATA |  | after-p5-orchard-invoices.png, before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png, before-p5-orchard-invoices.png | demo data |
| New Brunswick | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Nicole Campbell | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| None | DATA |  | 30 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| North Walterberg, Yukon Territory E1P 1X4 | DATA |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png | demo data |
| North Walterberg, Yukon Territory, E1P 1X4 | DATA |  | 5 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Northwest Territories | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Not started | DATA |  | 6 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Notes | DATA |  | 65 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Nov 06, 2026 | DATA |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | demo data |
| Nov 2, 2026 | DATA |  | 19 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Nov 2, 2026 - Cash | DATA |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| Nov 5, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Nov 5, 2026 | DATA |  | 12 pictures, e.g. after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png | demo data |
| Nov 6, 2026 | DATA |  | after-p2-wo-log.png, after-p3-credit-hold-finance.png, before-p2-wo-log.png, before-p3-credit-hold-finance.png | demo data |
| Nova Scotia | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Nunavut | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| ONR-3722 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Oct 30, 2026 | DATA |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| Oct 4, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Oct 7, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Oil | DATA |  | before-p3-credit-hold-finance.png | demo data |
| Ontario | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Open | DATA |  | 6 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Orchard City Truck & Trailer Repair | DATA |  | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | demo data |
| Order | DATA |  | 5 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Other | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| P2-254 | DATA |  | after-p4-legacy-part-sale-no-vehicle.png, before-p4-legacy-part-sale-no-vehicle.png | demo data |
| P2-256 | DATA |  | after-p2-part-sale-card.png, after-p4-legacy-part-sale-with-vehicle.png, before-p2-part-sale-card.png, before-p4-legacy-part-sale-with-vehicle.png | demo data |
| P5H 7C4 | DATA |  | 12 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| PV1T2SK1DNUUK7YDE | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| Paid | DATA |  | 18 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | demo data |
| Parts | DATA |  | 102 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Patriciashire, Ontario B4Y6L9 | DATA |  | before-p4-modern-estimate-billed-to-other.png | demo data |
| Patriciashire, Ontario, B4Y6L9 | DATA |  | before-p4-legacy-estimate-billed-to-other.png | demo data |
| Phillipsburg Truck & Trailer Repair | DATA |  | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png | demo data |
| Phone | DATA |  | 84 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Pinned Notes: | DATA |  | 8 pictures, e.g. after-p2-wo77-change-customer.png, after-p3-deposits-card.png, after-p3-deposits-toast.png | demo data |
| Port Josephshire | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| Preventative maintenance | DATA |  | 10 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Prince Edward Island | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| Priscillabury, Nunavut H8A3X9 | DATA |  | after-p4-modern-part-sale-no-vehicle.png, after-p4-modern-part-sale-with-vehicle.png | demo data |
| Priscillabury, Nunavut, H8A3X9 | DATA |  | after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png | demo data |
| Progress | DATA |  | 50 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Quality control check over | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| Quantity | DATA |  | 14 pictures, e.g. after-p2-part-sale-card.png, after-p3-credit-hold-finance.png, after-p4-batch.png | demo data |
| Quarterly inspection | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Quartzsite Truck Service & Repair | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| Quebec | DATA |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | demo data |
| RDC54B39CG3BWHBK9 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| RP1 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Rate | DATA |  | 39 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| Raystad, British Columbia V4M 8Y2 | DATA |  | before-p4-modern-part-sale-no-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| Raystad, British Columbia, V4M 8Y2 | DATA |  | before-p4-legacy-part-sale-no-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png | demo data |
| Remit payment to | DATA |  | 13 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| Replace - Left side main chassis harness | DATA |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| Requested | DATA |  | 17 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | demo data |
| S2-10058 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-10149 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-10422 | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| S2-11135 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-11850 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-13796 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-14044 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-14310 | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| S2-15742 | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| S2-15743 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-15887 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-15934 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-15937 | DATA |  | 11 pictures, e.g. after-p1-buda-page.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png | demo data |
| S2-15957 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-16 | DATA |  | after-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders-1600-search.png | demo data |
| S2-16747 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-16833 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-16890 | DATA |  | after-p1-buda-page.png, after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png, before-p1-buda-page.png | demo data |
| S2-16894 | DATA |  | after-p7-asset-work-orders-1600-search.png | demo data |
| S2-16912 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-16988 | DATA |  | 5 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-picked-open.png, after-p7-asset-work-orders-1600-search.png | demo data |
| S2-17095 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17277 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17322 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| S2-17332 | DATA |  | after-p1-buda-page.png, before-p1-buda-page.png | demo data |
| S2-17362 | DATA |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| S2-17388 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17415 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17435 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17477 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17481 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17513 | DATA |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | demo data |
| S2-17554 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| S2-17577 | DATA |  | 11 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| S2-17578 | DATA |  | after-p1-buda-page.png, after-p2-new-work-order.png, before-p1-buda-page.png, before-p2-new-work-order.png | demo data |
| S2-17579 | DATA |  | 16 pictures, e.g. after-p1-buda-page.png, after-p2-new-work-order.png, after-p2-phone-wo79-card.png | demo data |
| S2-17581 | DATA |  | 19 pictures, e.g. after-p1-buda-page.png, after-p3-invoiced-card.png, after-p3-invoiced-toast.png | demo data |
| S2-17582 | DATA |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| S2-17583 | DATA |  | after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, before-p1-aj-page.png | demo data |
| S2-4597 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-5018 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-5491 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-5878 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-6585 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-6679 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-7268 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-7539 | DATA |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | demo data |
| S2-7889 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-8275 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-9042 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-9051 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-9464 | DATA |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| S2-9466 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| S2-9675 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S2-9875 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| S9S3X9 | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| SHOP | DATA |  | 7 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| Sales Representative | DATA |  | 71 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Sep 18, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Sep 2, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Sep 23, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Sep 30, 2026 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Sep 4, 2025 | DATA |  | after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png, before-p1-edit-customer-buda.png | demo data |
| Sep 9, 2025 | DATA |  | after-p7-asset-customer-open.png, after-p7-asset-work-orders.png | demo data |
| Service - Air filter | DATA |  | 16 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Service - CVIP inspection singl... | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| Service - CVIP inspection single or tandem axle | DATA |  | 10 pictures, e.g. after-p3-invoiced-card.png, after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png | demo data |
| Service - Perform LOF and ins... | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| Service - Perform LOF and inspection | DATA |  | 17 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Service - Quarterly inspection | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Service - Replace fuel filters | DATA |  | 9 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Service - Wheels off single or ... | DATA |  | after-p2-wo-log.png, before-p2-wo-log.png | demo data |
| Service - Wheels off single or tandem axle | DATA |  | 9 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Service Advisor | DATA |  | 25 pictures, e.g. after-p2-new-work-order.png, after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png | demo data |
| Service Order | DATA |  | 9 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| South Kennethside, Yukon Territory B1G3H7 | DATA |  | before-p4-modern-invoice-pays-for-itself.png | demo data |
| South Kennethside, Yukon Territory, B1G3H7 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png | demo data |
| Staging Heavy Duty - 9919 | DATA |  | 99 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Start | DATA |  | 7 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| Started: Aug 31, 2026 | DATA |  | 19 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-phone-wo79-card.png | demo data |
| Started: Jun 16, 2026 | DATA |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Started: Nov 2, 2026 | DATA |  | 6 pictures, e.g. after-p2-part-sale-card.png, after-p3-invoiced-card.png, after-p3-invoiced-toast.png | demo data |
| Stats | DATA |  | 32 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Status | DATA |  | 65 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Story | DATA |  | 9 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| T2C 4M5 | DATA |  | 20 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | demo data |
| Terms | DATA |  | 22 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | demo data |
| Tim | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Timothy Jenkins | DATA |  | after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, before-p2-authorizer-open.png | demo data |
| Toronto, Ontario M5W 3B9 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| Toronto, Ontario, M5W 3B9 | DATA |  | before-p4-legacy-invoice-pays-for-itself.png | demo data |
| Total | DATA |  | 54 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | demo data |
| Total Hours: 3.1 hrs | DATA |  | 6 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-picked.png, after-p2-wo-billto-search.png | demo data |
| Total Hours: 4.0 hrs | DATA |  | 15 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | demo data |
| Total Hours: 4.3 hrs | DATA |  | 8 pictures, e.g. after-p2-phone-wo79-card.png, after-p2-wo79-card.png, after-p3-credit-hold-banner.png | demo data |
| Totam dolor velit ratione dolorum dignissimos. Ipsa expedita ad labore vel. Necessitatibus est omnis expedita aliquid culpa autem. | DATA |  | 8 pictures, e.g. after-p2-wo77-change-customer.png, after-p3-deposits-card.png, after-p3-deposits-toast.png | demo data |
| Unas... | DATA |  | after-p7-asset-customer-picked-open.png | demo data |
| Unassigned | DATA |  | 66 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | demo data |
| Unit | DATA |  | 32 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Unit # | DATA |  | 22 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | demo data |
| Unit 4417 | DATA |  | after-p4-legacy-part-sale-with-vehicle.png, after-p4-modern-part-sale-with-vehicle.png | demo data |
| Unit 854 | DATA |  | after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | demo data |
| Uvalde Estates Truck Centre | DATA |  | after-p1-edit-customer-buda-search.png, after-p2-wo-billto-search.png | demo data |
| VIN/Serial # | DATA |  | 46 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | demo data |
| Vald | DATA |  | after-p1-edit-customer-buda-search.png, after-p2-wo-billto-search.png | demo data |
| Valders Diesel & Fleet Repair | DATA |  | 23 pictures, e.g. after-p1-edit-customer-buda-search.png, after-p2-phone-wo79-card.png, after-p2-wo-billto-search.png | demo data |
| WLKDY421A9NJGF3Y9 | DATA |  | 12 pictures, e.g. after-p3-credit-hold-finance.png, after-p3-phone-credit-hold.png, after-p4-batch.png | demo data |
| Walshhaven | DATA |  | 8 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | demo data |
| Walshhaven, British Columbia | DATA |  | 10 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p1-buda-page.png | demo data |
| Walshhaven, British Columbia P5H 7C4 | DATA |  | after-p4-modern-estimate-billed-to-other.png | demo data |
| Walshhaven, British Columbia, P5H 7C4 | DATA |  | after-p4-legacy-estimate-billed-to-other.png, before-p3-credit-hold-finance.png | demo data |
| Wendy Lopez | DATA |  | 21 pictures, e.g. after-p2-phone-wo79-card.png, after-p2-wo-billto-no-match.png, after-p2-wo-billto-picked.png | demo data |
| Windshield Washer Fluid 4L | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| XUG01251LPJE00018 | DATA |  | after-p2-new-work-order.png, before-p2-new-work-order.png | demo data |
| Yukon Territory | DATA |  | after-p1-edit-customer-counter-sale.png | demo data |
| ZZP-6028 | DATA |  | after-p4-modern-part-sale-with-vehicle.png, before-p4-modern-part-sale-with-vehicle.png | demo data |
| Zero Truck and Trailer Repair (IBS#: 873606) | DATA |  | before-p4-legacy-invoice-pays-for-itself.png, before-p4-modern-invoice-pays-for-itself.png | demo data |
| george.thomas@staging.shopview.local | DATA |  | after-p5-invoice-email.png | demo data |
| grease | DATA |  | before-p3-credit-hold-finance.png | demo data |
| shop heavy | DATA |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | demo data |
| v2 | DATA |  | 6 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png | demo data |
| washer fluid | DATA |  | before-p3-credit-hold-finance.png | demo data |
| wendy.lopez2@staging.shopview.local | DATA |  | after-p7-asset854-work-orders-bottom.png, before-p5-invoice-email.png | demo data |
| zzqx | DATA |  | after-p2-wo-billto-no-match.png | demo data |
| (building icon) | LOOK-ONLY |  | after-p7-asset-work-orders.png | chip icon |
| (warning triangle icon) | LOOK-ONLY |  | after-p3-deposits-toast.png, after-p3-invoiced-toast.png, after-p3-mary-deposits-toast.png, after-p3-mary-phone-deposits-toast.png | error toast icon |
| -> | LOOK-ONLY |  | after-p2-wo-log.png | arrow between old and new customer |
| 1 selected | LOOK-ONLY |  | after-p7-asset-customer-picked-open.png | design-only (BT-S07) |
| All customers are included. Pick one or more to narrow. | LOOK-ONLY |  | after-p7-asset-customer-open.png | design-only help sentence (BT-S07) |
| Customer: Quartzsite Truc... | LOOK-ONLY |  | after-p7-asset-customer-applied.png, after-p7-asset-customer-picked-open.png | chip label with one pick, cut with ... |
| (Change Customer icon) | OUT-OF-SCOPE |  | after-p2-wo-billto-no-match.png, after-p3-counter-sale-not-offered.png, after-p3-mary-phone-deposits-toast.png, before-p2-authorizer-open.png | same label in a production picture: unchanged by Bill To |
| (Change Customer icon, blue) | OUT-OF-SCOPE |  | after-p3-deposits-toast.png, after-p3-deposits-tooltip.png, after-p3-mary-deposits-card.png, after-p3-mary-deposits-toast.png | existing production control or another feature in the same build (cover note); not Bill To |
| (Change Customer icon: two arrows) | OUT-OF-SCOPE |  | after-p2-wo-billto-search.png | existing production control or another feature in the same build (cover note); not Bill To |
| (Change Customer icon: two arrows, blue) | OUT-OF-SCOPE |  | after-p2-wo77-change-customer.png, before-p3-deposits-card.png | same label in a production picture: unchanged by Bill To |
| (byte-identical to after-p1-new-customer-field-empty.png) | OUT-OF-SCOPE |  | after-p1-new-customer.png | byte-identical picture; its words are counted under the picture it copies |
| (byte-identical to before-p4-legacy-invoice-pays-for-itself.png) | OUT-OF-SCOPE |  | after-p4-legacy-invoice-pays-for-itself.png | byte-identical picture; its words are counted under the picture it copies |
| (byte-identical to before-p4-modern-invoice-pays-for-itself.png) | OUT-OF-SCOPE |  | after-p4-modern-invoice-pays-for-itself.png | byte-identical picture; its words are counted under the picture it copies |
| (byte-identical to before-p7-phone-asset-work-orders.png) | OUT-OF-SCOPE |  | after-p7-phone-asset-work-orders.png | byte-identical picture; its words are counted under the picture it copies |
| (calendar icon) | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| (change owner icon) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | production today (before picture), unchanged by Bill To |
| (clear search icon) | OUT-OF-SCOPE |  | after-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders-1600-search.png | same label in a production picture: unchanged by Bill To |
| (columns icon) | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| (download icon) | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p3-credit-hold-finance.png, after-p5-aj-invoices.png, after-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| (edit icon) | OUT-OF-SCOPE |  | 42 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| (email icon) | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p3-credit-hold-finance.png, after-p5-aj-invoices.png, after-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| (history icon) | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| (list / person / board view icons) | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| (logo) | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p1-phone-buda-page.png, after-p2-phone-wo79-card.png, after-p3-mary-phone-deposits-toast.png | production today (before picture), unchanged by Bill To |
| (menu icon) | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p1-phone-buda-page.png, after-p2-phone-wo79-card.png, after-p3-mary-phone-deposits-toast.png | production today (before picture), unchanged by Bill To |
| (print icon) | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p3-credit-hold-finance.png, after-p5-aj-invoices.png, after-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| (settings icon) | OUT-OF-SCOPE |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| (terms paragraph) | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png | same label in a production picture: unchanged by Bill To |
| (terms paragraph, same words as on the invoices) | OUT-OF-SCOPE |  | after-p4-modern-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| (terms paragraph: same words as the modern layout, 'testing and/or inspection') | OUT-OF-SCOPE |  | after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, before-p4-batch.png, before-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| + (beside Sales Representative) | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | existing production control or another feature in the same build (cover note); not Bill To |
| -> | OUT-OF-SCOPE |  | before-p2-wo-log.png | production today (before picture), unchanged by Bill To |
| ...rk Orders | OUT-OF-SCOPE |  | after-p3-credit-hold-change-bill-to.png | existing production control or another feature in the same build (cover note); not Bill To |
| ...ts (8) | OUT-OF-SCOPE |  | after-p3-credit-hold-change-bill-to.png | existing production control or another feature in the same build (cover note); not Bill To |
| < | OUT-OF-SCOPE |  | after-p5-phone-aj-invoices.png, before-p5-phone-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| ADDRESSES | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | production today (before picture), unchanged by Bill To |
| AI | OUT-OF-SCOPE |  | 30 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | same label in a production picture: unchanged by Bill To |
| AJ invoices (dimmed) | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | screen chrome named only (dimmed page behind a window) |
| AJ_WO_TAB (dimmed) | OUT-OF-SCOPE |  | after-p1-aj-pays-for-dialog.png | screen chrome named only (dimmed page behind a window) |
| AS | OUT-OF-SCOPE |  | 79 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| ASSET | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-with-vehicle.png | production today (before picture), unchanged by Bill To |
| Actions | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Actual/Est: 0.00 / 1.50 | OUT-OF-SCOPE |  | after-p3-phone-credit-hold.png, before-p3-phone-credit-hold.png | same label in a production picture: unchanged by Bill To |
| Add | OUT-OF-SCOPE |  | after-p2-new-work-order.png, after-p2-part-sale-card.png, before-p2-new-work-order.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Add Asset | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Add Deposit | OUT-OF-SCOPE |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| Add Part | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Address | OUT-OF-SCOPE |  | 49 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Address 1 | OUT-OF-SCOPE |  | 16 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Address 2 | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | production today (before picture), unchanged by Bill To |
| All | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Amount to credit: | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Any warranties on the parts and accessories sold hereby are made by the manufacturer. You understand and agree that we make no warranties of any kind unless expressed in writing. You hereby authorize us to perform the repair work herein set forth and to purchase the necessary material and parts to perform such repair work. You agree that we are not responsible for loss or damage to your vehicle or articles left in your vehicle in case of fire, theft, or any other cause beyond our control or for any delays caused by unavailability of parts or delays in part shipments by the supplier or transporter. In addition, you agree that we are not responsible for damages to your vehicle from freezing due to lack of antifreeze. You hereby grant our employees permission to operate your vehicle on streets, highways, or elsewhere for the purpose of testing and/ or inspection. You acknowledge and agree that an express mechanic's lien on your vehicle is granted to secure payment of this invoice for the repair work detailed in this invoice. | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Are you sure you want to delete this company? | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p6-delete-first.png, after-p6-phone-delete-first.png, after-p6-remove-result.png | same label in a production picture: unchanged by Bill To |
| Asse... | OUT-OF-SCOPE |  | after-p1-phone-buda-page.png, before-p1-phone-buda-page.png | same label in a production picture: unchanged by Bill To |
| Asset Here? | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Asset History | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Asset on Site | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Assets | OUT-OF-SCOPE |  | 46 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Assets (1) | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p5-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| Assets (27) | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Assets (3) | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | same label in a production picture: unchanged by Bill To |
| Assigned to me | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Authorize | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| B4Y6L9 | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| BILL TO | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | production today (before picture), unchanged by Bill To |
| BUDA_WO_TAB (dimmed) | OUT-OF-SCOPE |  | after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png | screen chrome named only (dimmed page behind a window) |
| Balance | OUT-OF-SCOPE |  | 23 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Balance: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Best regards, | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Bill To | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | document's existing Bill To heading (production label); S7-R1 covers its content |
| Bill To changed | OUT-OF-SCOPE |  | before-p2-wo-log.png | production today (before picture), unchanged by Bill To |
| Build Lines | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | same label in a production picture: unchanged by Bill To |
| CUSTOMER SIGNATURE | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| CV | OUT-OF-SCOPE |  | after-p7-asset854-work-orders-bottom.png, after-p7-asset854-work-orders.png | existing production control or another feature in the same build (cover note); not Bill To |
| Calgary, Alberta T2C 4M5 | OUT-OF-SCOPE |  | 18 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Cancel | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p6-delete-first.png, after-p6-phone-delete-first.png, after-p6-remove-result.png | same label in a production picture: unchanged by Bill To |
| Category | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| City | OUT-OF-SCOPE |  | 17 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | production today (before picture), unchanged by Bill To |
| Clock In | OUT-OF-SCOPE |  | 99 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Clocked... | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Color: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Completed | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Confirmation | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p6-delete-first.png, after-p6-phone-delete-first.png, after-p6-remove-result.png | same label in a production picture: unchanged by Bill To |
| Consequatur quisquam soluta accusamus. Earum accusantium asperiores dolorum voluptatum quisquam. | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Contacts | OUT-OF-SCOPE |  | 39 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Contacts (1) | OUT-OF-SCOPE |  | 23 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Contacts (8) | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Core | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Cost | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Country | OUT-OF-SCOPE |  | 17 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | production today (before picture), unchanged by Bill To |
| Create Invoice | OUT-OF-SCOPE |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| Create Work Order | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Created | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Created On | OUT-OF-SCOPE |  | 24 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Credit Limit | OUT-OF-SCOPE |  | 13 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Credit Terms | OUT-OF-SCOPE |  | 13 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Credit limit | OUT-OF-SCOPE |  | 35 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Credit term | OUT-OF-SCOPE |  | 35 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Ctrl | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Customer | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p2-new-work-order.png, after-p3-phone-credit-hold.png, after-p7-asset-customer-applied.png | same label in a production picture: unchanged by Bill To |
| Customer Name | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | same label in a production picture: unchanged by Bill To |
| Customer signature: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Customer: | OUT-OF-SCOPE |  | before-p2-wo-log.png | production today (before picture), unchanged by Bill To |
| Customers | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| DATE | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| Dashboard | OUT-OF-SCOPE |  | 79 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Date | OUT-OF-SCOPE |  | 13 pictures, e.g. after-p2-wo-log.png, after-p5-aj-invoices.png, after-p5-aj-new-payment.png | production today (before picture), unchanged by Bill To |
| Date: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Days Open | OUT-OF-SCOPE |  | 18 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-edit-customer-counter-sale.png | same label in a production picture: unchanged by Bill To |
| Default Labor Rate | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Default Shop Supplies | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Default Tax Settings | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Delete | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Deposits | OUT-OF-SCOPE |  | 19 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Details | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Drivetrain: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Due | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| E1P 1X4 | OUT-OF-SCOPE |  | after-p5-valders-invoices-all.png, before-p5-valders-invoices-all.png | same label in a production picture: unchanged by Bill To |
| ENG HRS | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| Edit Customer | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Edit Customer and Confirmation dimmed | OUT-OF-SCOPE |  | after-p6-blocked.png | screen chrome named only (dimmed page behind a window) |
| Edit Customer dimmed | OUT-OF-SCOPE |  | after-p6-delete-first.png, after-p6-remove-result.png, before-p6-delete-first.png | screen chrome named only (dimmed page behind a window) |
| Edit Customer, Confirmation, Delete Customer dimmed | OUT-OF-SCOPE |  | after-p6-remove-confirm.png | screen chrome named only (dimmed page behind a window) |
| Email | OUT-OF-SCOPE |  | after-p7-asset854-work-orders-bottom.png | existing production control or another feature in the same build (cover note); not Bill To |
| Email Content | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Empty bays, endless possibilities. Get Going! | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-mary-buda-page.png, after-p2-part-sale-card.png, after-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Eng. Hr.: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Engine: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Estimate date: | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png, after-p4-modern-part-sale-with-vehicle.png | same label in a production picture: unchanged by Bill To |
| Estimate/Invoice | OUT-OF-SCOPE |  | after-p3-credit-hold-finance.png, before-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| Estimate: | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png | same label in a production picture: unchanged by Bill To |
| Estimates | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Event | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Fault Codes Lookup | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p3-phone-credit-hold-change-bill-to.png, after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png | same label in a production picture: unchanged by Bill To |
| Fees & Discounts | OUT-OF-SCOPE |  | after-p2-part-sale-card.png | existing production control or another feature in the same build (cover note); not Bill To |
| Fees & Discounts (0) | OUT-OF-SCOPE |  | 19 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Financial Info | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| GST | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| GST (5%) | OUT-OF-SCOPE |  | 18 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Hello, | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Hide Details | OUT-OF-SCOPE |  | after-p2-phone-wo79-card.png, after-p3-mary-phone-deposits-toast.png, before-p2-phone-wo79-card.png | same label in a production picture: unchanged by Bill To |
| IBS | OUT-OF-SCOPE |  | 48 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Include 'For Customer' Attachments in email | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Include your email to BCC | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Inspections | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Invoice | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-valders-invoices-all.png | same label in a production picture: unchanged by Bill To |
| Invoice date: | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| Invoice: | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Invoiced Date | OUT-OF-SCOPE |  | 17 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Invoices | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p1-edit-customer-counter-sale.png, after-p5-orchard-invoices.png, after-p6-del-after-remove.png | same label in a production picture: unchanged by Bill To |
| Invoices (1) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | same label in a production picture: unchanged by Bill To |
| Invoices (12) | OUT-OF-SCOPE |  | after-p7-asset854-work-orders.png | existing production control or another feature in the same build (cover note); not Bill To |
| Invoices (2) | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p5-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| Issue Credit | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Item | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| K | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| LABOR | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| Lake Paula, Manitoba | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p6-blocked.png, after-p6-del-after-remove.png, after-p6-delete-first.png | same label in a production picture: unchanged by Bill To |
| Lead technician | OUT-OF-SCOPE |  | after-p3-invoiced-card.png, after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png, before-p3-invoiced-card.png | same label in a production picture: unchanged by Bill To |
| Licence Plate: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Line | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Line created | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Line total | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| Lines | OUT-OF-SCOPE |  | 13 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Lines (5) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| Lines (8) | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | same label in a production picture: unchanged by Bill To |
| MILEAGE | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-modern-invoice-billed-to-other.png | production today (before picture), unchanged by Bill To |
| MM | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p1-mary-buda-page.png, after-p1-mary-edit-customer-buda.png, after-p1-mary-new-customer.png | same label in a production picture: unchanged by Bill To |
| Make Payment | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Max | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Memo | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | production today (before picture), unchanged by Bill To |
| Mileage: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Min | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Murrieta Diesel Repair | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p6-blocked.png, after-p6-del-after-remove.png, after-p6-delete-first.png | same label in a production picture: unchanged by Bill To |
| N/A | OUT-OF-SCOPE |  | 39 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Name * | OUT-OF-SCOPE |  | 14 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| New | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| New Customer | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | same label in a production picture: unchanged by Bill To |
| New Customer Payment | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| New Line | OUT-OF-SCOPE |  | 24 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | same label in a production picture: unchanged by Bill To |
| New Payment | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| New Work Order | OUT-OF-SCOPE |  | 21 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| No authorizer | OUT-OF-SCOPE |  | before-p2-authorizer-open.png | production today (before picture), unchanged by Bill To |
| No. | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-new-payment.png, after-p5-aj-rows-selected.png | production today (before picture), unchanged by Bill To |
| North Walterberg, Yukon Territ... | OUT-OF-SCOPE |  | after-p5-valders-invoices-all.png, before-p5-valders-invoices-all.png | same label in a production picture: unchanged by Bill To |
| Notes (1) | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | same label in a production picture: unchanged by Bill To |
| Number | OUT-OF-SCOPE |  | 29 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| On Site | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p2-new-work-order.png, after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png | same label in a production picture: unchanged by Bill To |
| Open only | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Optional Emails (Comma Separated) | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Over Limit | OUT-OF-SCOPE |  | before-p2-authorizer-open.png, before-p3-deposits-card.png | production today (before picture), unchanged by Bill To |
| PARTS | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p4-modern-part-sale-no-vehicle.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| PLATE | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-with-vehicle.png | production today (before picture), unchanged by Bill To |
| PO is required | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| PRINTED NAME | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| Page 1 / 1 | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Page 1 of 7 | OUT-OF-SCOPE |  | after-p4-batch.png, before-p4-batch.png | same label in a production picture: unchanged by Bill To |
| Paid date: | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Part Number | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Part Sales | OUT-OF-SCOPE |  | 19 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-edit-customer-counter-sale.png | same label in a production picture: unchanged by Bill To |
| Part Sales (2) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | same label in a production picture: unchanged by Bill To |
| Partially Paid | OUT-OF-SCOPE |  | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, before-p5-aj-invoices.png, before-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| Parts (0) | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Parts (1) | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | same label in a production picture: unchanged by Bill To |
| Parts (10) | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p2-wo-billto-no-match.png, after-p2-wo-billto-open.png, after-p2-wo-billto-picked.png | same label in a production picture: unchanged by Bill To |
| Parts (8) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p2-wo79-card.png, after-p3-credit-hold-banner.png, after-p3-credit-hold-finance.png | same label in a production picture: unchanged by Bill To |
| Parts Order | OUT-OF-SCOPE |  | after-p4-legacy-part-sale-no-vehicle.png, after-p4-legacy-part-sale-with-vehicle.png, before-p4-legacy-part-sale-no-vehicle.png, before-p4-legacy-part-sale-with-vehicle.png | same label in a production picture: unchanged by Bill To |
| Patriciashire, Ontario | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Payment | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Payment Date | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Payment Method | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Payment amount: | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Payments | OUT-OF-SCOPE |  | 14 pictures, e.g. after-p1-edit-customer-counter-sale.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Payments (1) | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p5-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| Payments (106) | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Payments (2) | OUT-OF-SCOPE |  | after-p5-valders-invoices-all.png, before-p5-valders-invoices-all.png | same label in a production picture: unchanged by Bill To |
| Payments (23) | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | same label in a production picture: unchanged by Bill To |
| Please find your attached invoice for work order: | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Port Peterchester, Yukon Territo... | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Powered by | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| Powered by ShopView | OUT-OF-SCOPE |  | 11 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Preferred Contact | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Printed name: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png, after-p4-legacy-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Qty | OUT-OF-SCOPE |  | before-p2-part-sale-card.png | production today (before picture), unchanged by Bill To |
| REMIT PAYMENT TO | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| Reference Number | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Reports | OUT-OF-SCOPE |  | 79 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Requested At | OUT-OF-SCOPE |  | after-p2-part-sale-card.png | existing production control or another feature in the same build (cover note); not Bill To |
| Ret... | OUT-OF-SCOPE |  | after-p1-edit-customer-counter-sale.png, after-p1-mary-buda-page.png, after-p6-del-after-remove.png | existing production control or another feature in the same build (cover note); not Bill To |
| Return... | OUT-OF-SCOPE |  | after-p6-edit-bottom.png, before-p6-edit-bottom.png | same label in a production picture: unchanged by Bill To |
| Returns | OUT-OF-SCOPE |  | after-p1-mary-edit-customer-buda.png, before-p1-mary-buda-page.png, before-p1-mary-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| SCOPE OF WORK | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| SHOPCOACH ANALYSIS | OUT-OF-SCOPE |  | 22 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo-billto-no-match.png | same label in a production picture: unchanged by Bill To |
| SHOPCOACH ASSET HISTORY | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| SHOPCOACH LINE BUILDER | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | same label in a production picture: unchanged by Bill To |
| SUMMARY | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| Sales representative | OUT-OF-SCOPE |  | before-p3-invoiced-card.png | production today (before picture), unchanged by Bill To |
| Savannah Tran | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Save | OUT-OF-SCOPE |  | 22 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Schedule | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Searc... | OUT-OF-SCOPE |  | 77 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Search | OUT-OF-SCOPE |  | 48 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Search customers, ... | OUT-OF-SCOPE |  | 12 pictures, e.g. after-p1-phone-buda-page.png, after-p2-phone-wo79-card.png, after-p3-mary-phone-deposits-toast.png | production today (before picture), unchanged by Bill To |
| Search customers, work orders, ... | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p1-mary-buda-page.png, after-p1-mary-edit-customer-buda.png, after-p1-mary-new-customer.png | same label in a production picture: unchanged by Bill To |
| Search customers, work orders... | OUT-OF-SCOPE |  | after-p7-asset-work-orders-1600-search.png, before-p7-asset-work-orders-1600-search.png | same label in a production picture: unchanged by Bill To |
| Sell Price | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| Send Email | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Send to Terminal | OUT-OF-SCOPE |  | after-p5-aj-new-payment.png, before-p5-aj-new-payment.png | same label in a production picture: unchanged by Bill To |
| Sending invoice | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| Service advisor | OUT-OF-SCOPE |  | after-p3-invoiced-card.png, after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png, before-p3-invoiced-card.png | same label in a production picture: unchanged by Bill To |
| Shop supplies | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p4-batch.png, after-p4-legacy-invoice-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| ShopHub | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| ShopView | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-no-vehicle.png | same label in a production picture: unchanged by Bill To |
| Software Powered by ShopView | OUT-OF-SCOPE |  | after-p4-batch.png, before-p4-batch.png | same label in a production picture: unchanged by Bill To |
| Split to | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Staging Lethbridge - 4310 | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p1-mary-buda-page.png, after-p1-mary-edit-customer-buda.png, after-p1-mary-new-customer.png | same label in a production picture: unchanged by Bill To |
| State/Province | OUT-OF-SCOPE |  | 17 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | production today (before picture), unchanged by Bill To |
| Subtotal | OUT-OF-SCOPE |  | 20 pictures, e.g. after-p2-part-sale-card.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Taxes | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | same label in a production picture: unchanged by Bill To |
| Tech Story | OUT-OF-SCOPE |  | after-p3-phone-credit-hold.png, before-p3-phone-credit-hold.png | same label in a production picture: unchanged by Bill To |
| Telephone | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-mary-new-customer.png, after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png | same label in a production picture: unchanged by Bill To |
| Time | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Tot... | OUT-OF-SCOPE |  | before-p5-phone-aj-invoices.png | production today (before picture), unchanged by Bill To |
| Total Price | OUT-OF-SCOPE |  | 20 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p1-buda-page.png | same label in a production picture: unchanged by Bill To |
| Total: | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Totals selected | OUT-OF-SCOPE |  | after-p5-aj-rows-selected.png, before-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| Trim: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Type | OUT-OF-SCOPE |  | 9 pictures, e.g. after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-orchard-invoices.png | production today (before picture), unchanged by Bill To |
| Type: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| UNIT | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-with-vehicle.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-part-sale-with-vehicle.png | same label in a production picture: unchanged by Bill To |
| Unit: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Unpaid | OUT-OF-SCOPE |  | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, before-p5-aj-invoices.png, before-p5-aj-rows-selected.png | same label in a production picture: unchanged by Bill To |
| User | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| VIN / SERIAL | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, after-p4-modern-part-sale-with-vehicle.png | production today (before picture), unchanged by Bill To |
| VIN/Serial #: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| Vendor | OUT-OF-SCOPE |  | after-p2-part-sale-card.png, before-p2-part-sale-card.png | same label in a production picture: unchanged by Bill To |
| View All History | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-picked-open.png, after-p7-asset-work-orders-1600-search.png | same label in a production picture: unchanged by Bill To |
| View open work orders | OUT-OF-SCOPE |  | after-p2-new-work-order.png, before-p2-new-work-order.png | same label in a production picture: unchanged by Bill To |
| Vin/Serial # | OUT-OF-SCOPE |  | after-p3-phone-credit-hold.png, before-p3-phone-credit-hold.png | same label in a production picture: unchanged by Bill To |
| WO17579 page dimmed | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | screen chrome named only (dimmed page behind a window) |
| WO17581 page dimmed | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | screen chrome named only (dimmed page behind a window) |
| WORK PERFORMED | OUT-OF-SCOPE |  | after-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-billed-to-other.png, before-p4-modern-invoice-pays-for-itself.png | production today (before picture), unchanged by Bill To |
| WORK SUMMARY | OUT-OF-SCOPE |  | after-p4-modern-estimate-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | same label in a production picture: unchanged by Bill To |
| Website | OUT-OF-SCOPE |  | 45 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Work Order | OUT-OF-SCOPE |  | 5 pictures, e.g. after-p4-modern-estimate-billed-to-other.png, after-p4-modern-invoice-billed-to-other.png, before-p4-modern-estimate-billed-to-other.png | production today (before picture), unchanged by Bill To |
| Work Order Log | OUT-OF-SCOPE |  | after-p2-wo-log.png, before-p2-wo-log.png | same label in a production picture: unchanged by Bill To |
| Work Orders | OUT-OF-SCOPE |  | 87 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | same label in a production picture: unchanged by Bill To |
| Work Orders (105) | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Work Orders (2) | OUT-OF-SCOPE |  | 7 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-tooltip.png, after-p5-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| Work Orders (30) | OUT-OF-SCOPE |  | 8 pictures, e.g. after-p1-buda-page.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | same label in a production picture: unchanged by Bill To |
| Y5P 3K3 | OUT-OF-SCOPE |  | after-p5-orchard-invoices.png, before-p5-orchard-invoices.png | same label in a production picture: unchanged by Bill To |
| Year: | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | same label in a production picture: unchanged by Bill To |
| You're about to send invoice to selected contacts: | OUT-OF-SCOPE |  | after-p5-invoice-email.png, before-p5-invoice-email.png | same label in a production picture: unchanged by Bill To |
| ZIP/Postal Code | OUT-OF-SCOPE |  | 17 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | production today (before picture), unchanged by Bill To |
| e.g. Dot Inspection, Oil Change, Check Engine Light | OUT-OF-SCOPE |  | 10 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-wo77-change-customer.png | same label in a production picture: unchanged by Bill To |
| e.g. when did we work on the turbo? | OUT-OF-SCOPE |  | 6 pictures, e.g. after-p7-asset-customer-applied.png, after-p7-asset-customer-picked-open.png, after-p7-asset-work-orders-1600-search.png | same label in a production picture: unchanged by Bill To |
| rs (2) | OUT-OF-SCOPE |  | after-p5-phone-aj-invoices.png, before-p5-phone-aj-invoices.png | same label in a production picture: unchanged by Bill To |
| x (close) | OUT-OF-SCOPE |  | 31 pictures, e.g. after-p1-aj-pays-for-dialog.png, after-p1-buda-change-dialog.png, after-p1-edit-customer-buda-open.png | same label in a production picture: unchanged by Bill To |
| + | PRD-MATCH | S2-R6 | 6 pictures, e.g. after-p1-mary-edit-customer-buda.png, after-p1-mary-new-customer.png, after-p1-new-customer-field-open.png | the + beside Address 1 (the + beside Sales Representative is Split Representatives work) |
| + (beside Address 1) | PRD-MATCH | S2-R6 | after-p1-new-customer-field-empty.png, after-p1-new-customer-field-picked.png | the + beside Address 1 |
| A & J Truck & Trailer Repair pays for | PRD-MATCH | S1-R9, §8 Pays for | after-p1-aj-pays-for-dialog.png | template '[customer] pays for' |
| All customers | PRD-MATCH | S14-R2 | after-p7-asset-customer-open.png, after-p7-asset-customer-picked-open.png | exact |
| Bill Invoices To | PRD-MATCH | S1-R1, S1-R4, S2-R1 | 24 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | exact, letter case checked |
| Bill To | PRD-MATCH | S3-R1, S14-R6 | 24 pictures, e.g. after-p2-authorizer-open-scrolled.png, after-p2-authorizer-open.png, after-p2-part-sale-card.png | exact |
| Bill To changed | PRD-MATCH | S13-R1 | after-p2-wo-log.png | exact |
| Bill To: | PRD-MATCH | S13-R2 | after-p2-wo-log.png | 'Bill To' with the names |
| Buda Truck Repair (this customer) | PRD-MATCH | S1-R5, S2-R4, S3-R3 | 9 pictures, e.g. after-p1-buda-change-dialog-open.png, after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png | template '[customer] (this customer)' |
| Cancel | PRD-MATCH | S12-R3 | after-p6-blocked.png | exact, same order |
| Cannot invoice. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold | PRD-MATCH | §8 M2, S7-R6 | after-p3-credit-hold-banner.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold.png | word for word, [Bill To] = Valders |
| Change | PRD-MATCH | S1-R2 | 14 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | exact |
| Change Bill To | PRD-MATCH | S7-R6, S7-R7 | after-p3-credit-hold-banner.png, after-p3-credit-hold-change-bill-to.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold.png | exact |
| Close | PRD-MATCH | S1-R10 | after-p1-aj-pays-for-dialog.png | exact |
| Credit Hold | PRD-MATCH | S7-R11 | after-p3-credit-hold-banner.png, after-p3-credit-hold-finance.png, after-p3-phone-credit-hold.png | pill on the work order header |
| Customer: All customers | PRD-MATCH | S14-R2 | after-p7-asset-customer-open.png, after-p7-asset-work-orders-1600-search.png, after-p7-asset-work-orders.png, after-p7-asset854-work-orders.png | chip 'Customer' defaulting to 'All customers' |
| Customers billed to this customer by default | PRD-MATCH | S1-R8, §8 Pays for | after-p1-aj-pays-for-tooltip.png | word for word |
| Delete Customer | PRD-MATCH | S12-R1 | after-p6-blocked.png | exact |
| Go To Invoice | PRD-MATCH | S5-R2 | after-p3-invoiced-toast.png | exact |
| Invoiced. Reverse the invoice to change who's billed. | PRD-MATCH | §8 M4, S5-R1 | after-p3-invoiced-toast.png, after-p3-invoiced-tooltip.png | word for word |
| Lone Star Fleet Services (this customer) | PRD-MATCH | S1-R5, S2-R4, S3-R3 | after-p1-new-customer-field-open.png, after-p1-new-customer-field-search.png | template '[customer] (this customer)' |
| New work orders and part sales bill to this customer. Existing ones don't change. | PRD-MATCH | S2-R3, §8 Help | 5 pictures, e.g. after-p1-edit-customer-buda.png, after-p6-delete-first.png, after-p6-edit-bottom.png | word for word |
| New work orders and part sales for Buda Truck Repair will be billed to this customer. Existing ones don't change. | PRD-MATCH | S1-R3, §8 Help | after-p1-buda-change-dialog.png | word for word, [customer] = Buda Truck Repair |
| No authorizer | PRD-MATCH | S4-R1 | after-p2-authorizer-open.png | exact |
| Open Deposits | PRD-MATCH | S5-R5 | after-p3-deposits-toast.png | exact |
| Pays for | PRD-MATCH | S1-R7 | 8 pictures, e.g. after-p1-aj-page.png, after-p1-aj-pays-for-dialog.png, after-p1-aj-pays-for-tooltip.png | exact |
| Remove As Default Bill To | PRD-MATCH | S12-R3 | after-p6-blocked.png | exact, Title Case |
| Remove Murrieta Diesel Repair as the default Bill To for 1 customer? Open work orders keep their Bill To. | PRD-MATCH | §8 D8 | after-p6-remove-confirm.png | template, [N] = 1, customer |
| Remove as default Bill To | PRD-MATCH | S12-R4 | after-p6-remove-confirm.png | exact window title |
| SERVICE FOR | PRD-MATCH | S8-R1 | 10 pictures, e.g. after-p3-credit-hold-finance.png, after-p4-batch.png, after-p4-legacy-estimate-billed-to-other.png | exact, upper case as in S8-R1 |
| Save | PRD-MATCH | S1-R4 | after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png | exact |
| Service For | PRD-MATCH | S10-R6 | after-p5-aj-invoices.png, after-p5-aj-rows-selected.png, after-p5-valders-invoices-all.png | exact, Title Case as in S10-R6 |
| These customers bill new work orders and part sales to A & J Truck & Trailer Repair by default. | PRD-MATCH | S1-R10, §8 Pays for | after-p1-aj-pays-for-dialog.png | word for word |
| This customer | PRD-MATCH | S2-R1, S3-R2 | 9 pictures, e.g. after-p1-new-customer-field-empty.png, after-p1-new-customer-field-open.png, after-p1-new-customer-field-picked.png | exact |
| This customer is the default Bill To for Valders Diesel & Fleet Repair. Remove it from that customer first. | PRD-MATCH | §8 D8, S12-R2 | after-p6-blocked.png | template, one customer |
| This work order has a $10.00 deposit from 7 Star Truck Repair. Reverse it, change the Bill To, then take the deposit again under the new Bill To. | PRD-MATCH | §8 M1, S5-R4 | after-p3-deposits-toast.png, after-p3-deposits-tooltip.png, after-p3-mary-deposits-toast.png, after-p3-mary-phone-deposits-toast.png | word for word, [$amount] = $10.00 |
| e. The Bill To customer, Valders Diesel & Fleet Repair, is on Credit Hold | PRD-MATCH | §8 M2 | after-p3-credit-hold-change-bill-to.png | M2 partly covered by the open list |
| x (beside Address 2) | PRD-MATCH | S2-R7 | 5 pictures, e.g. after-p1-edit-customer-buda-open.png, after-p1-edit-customer-buda-search.png, after-p1-edit-customer-buda.png | the x beside Address 2 |
| Cancel | SPEC-CONFLICT | BT-D04 | after-p1-buda-change-dialog-open.png, after-p1-buda-change-dialog.png, after-p6-remove-confirm.png | order |
| Close | SPEC-CONFLICT | BT-D02 | after-p3-deposits-toast.png, after-p3-invoiced-toast.png, after-p3-mary-deposits-toast.png, after-p3-mary-phone-deposits-toast.png | S5-N2 'with no button' |
| Remove | SPEC-CONFLICT | BT-D04 | after-p6-remove-confirm.png | order |
| T... | SPEC-CONFLICT | BT-D07 | after-p7-asset854-work-orders.png | header cut at 1440 |
| Valders Diesel & Fleet Re | SPEC-CONFLICT | BT-D06 | 5 pictures, e.g. after-p2-wo-billto-picked.png, after-p2-wo79-card.png, after-p3-credit-hold-banner.png | name cut, no ellipsis |
