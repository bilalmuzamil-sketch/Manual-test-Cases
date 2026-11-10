# Setup recipes walked on the QA site (sv11315, build v26.45.2-6a8b89c), 10 Nov 2026

Every recipe below was clicked through on the QA site this pass, signed in with the Admin quick-login
button, at "Staging Heavy Duty - 9919". Evidence (text dump + screenshot) is in the probe folder named
beside each step. Labels are quoted as the screen shows them. These are the only recipes the Setup
lists may use; anything else is written as "not yet seen on this build".

## Customer side (A/R)

| Recipe | Clicks, in the build's labels | Seen in |
|---|---|---|
| New customer | Customers (top bar) → New Customer → Name, Phone → Save | `probe/10/` |
| Customer terms and exact totals | On the customer page, the edit icon beside the name → Edit Customer → Credit Terms (e.g. Net 30) → Taxes "Exempt (0%)" → Default Shop Supplies 0 → Save. Without "Exempt (0%)" and shop supplies 0, a $300 line came out $348.08 | `probe/11/`–`probe/18/` |
| Contact | Customer page → Add Contact → First name, Last name → Save | `probe/12/` |
| Asset | Customer page → Assets tab → New Asset → Contact, Make … → Save ("New Work Order" stays greyed out until the customer has an asset) | `probe/13/` |
| Work order with an exact amount | Customer page → New Work Order → Asset → Save → New Line: Title, Labor Rate "Calgary Transit Rate $150", Tech Time 2 → Line Approved → Save & Close (line = $300.00). A brand-new customer was not found by the "Create Work Order" customer search, so start from the customer page | `probe/14/`–`probe/16b/` |
| Finish the work order | Line → Complete → "Tech stories": type a story → Complete All Lines → "Missing Details": Mileage → Complete All Lines → Finance tab → Mark Reviewed → Mark as reviewed (VIN) → Confirm Review | `probe/17/`–`probe/20/` |
| Invoice on an earlier date | Work order → Finance tab → Invoice Date (type the date, e.g. 10/01/2026) → Create Invoice. Result: invoice dated Oct 1, 2026, due Oct 31, 2026 (Net 30), $300.00 | `probe/21/` |
| Invoice of any exact amount | New Line → Labor Rate "Fixed Line Total" (in the list) → Fixed Line Total box = the amount (e.g. 1250.50) → Line Approved → Save & Close. The work order invoice then reads Parts $1,250.50, Total $1,250.50 (S11315-17582, Sep 1, 2026, due Oct 1, 2026). Mark Reviewed asked for the VIN only the first time; later it completed with no window | `probe/48e/`, `probe/49/`, `probe/53/` |
| Keep an invoice unpaid | After Create Invoice the "New Customer Payment" window opens. Closing it with its × took the new invoice away again (S11315-17583 disappeared and the work order went back to Complete). Reloading the page instead (F5) kept it (S11315-17583, Oct 21, 2026, due Nov 20, 2026, Unpaid; work order Invoiced) | `probe/54b/`, `probe/54c/` |
| Due date the same day | Edit Customer → Credit Terms "Due on Receipt" → the invoice dated Oct 31, 2026 was due Oct 31, 2026 (S11315-17585). Terms put back to Net 30 afterwards | `probe/55c/`, `probe/56/` |
| Part payment | After Create Invoice the "New Customer Payment" window opens (or the customer's New Payment button): Payment Date, Payment Method, the Payment box on the invoice's row → Make Payment. Paying $250 left $50.00, "Partially Paid" | `probe/22/` |
| Credit memo | Customer page → Invoices tab → Issue Credit → Credit Date (e.g. 10/20/2026), Amount, Outcome: click "Issue Store Credit" (the other choice, "Issue Refund", adds Payment Method and changes the button to Issue Refund), Reason → Issue Credit ("Credit issued"). Result on A/R Aging Detail: "Credit Memo CM11315-4192", Oct 20, 2026, $-150.00 | `probe/23/`, `probe/50b/` |
| Deposit | A work order not yet invoiced → Finance tab → Add Deposit → "Create Deposit": Deposit Date, Payment Method (e.g. Cash), Deposit Amount → Record Deposit ("A deposit was created"). While it is held on the work order it is NOT on the A/R reports (customer Deposits tab: "Held Deposit for Work Order …"). Invoicing that work order for less than the deposit ($50 against $75) paid the invoice and left a new deposit for the rest, DEP11315-4707 $25.00, which IS on A/R Aging Detail as "Deposit", $-25.00, dated the day the invoice was made (Nov 10, 2026), not the deposit's own date. The customer's Deposits tab has no button to add a deposit outside a work order | `probe/25/`, `probe/55b/`, `probe/56/` |
| Part sale invoice | Parts → Part Sales → New Part Sale → Customer → Save → Add Part: Part Number (type a new one → "Add new special order part: …"), Description, Quantity, Cost, Sell Price → Save & Close. Then Authorize; on the part row pick the Vendor and press Order (status "Awaiting"); press Receive → tick the part, Vendor Invoice Number → Receive Parts (1) (status "Received"; the Finance tab then shows "Invoice Date" and Create Invoice becomes active). Finance tab → Invoice Date (e.g. 09/15/2026) → Create Invoice. Result: invoice dated Sep 15, 2026, due Oct 15, 2026, $300.00. The shop's pricing set the sell price to $222.22 on save; the Sell Price box on the part row was then changed to 300 | `probe/35/`–`probe/44/` |

## Vendor side (A/P)

| Recipe | Clicks, in the build's labels | Seen in |
|---|---|---|
| New vendor | Parts → Vendors (left menu) → New Vendor → Name, Telephone, Credit Terms (COD … Net 30 … Net 120, Credit Hold), Taxes "Exempt (0%)" → Save & Close | `probe/28/`, `probe/29b/` |
| Bill on an earlier date | Parts → Purchase Orders → New PO → Vendor → Part Number (type a new one → "Add new special order part: …"), Description, Quantity, Cost → Add → Save & Close. In the Purchase Orders list press Receive on that order → Vendor Invoice #, Invoice Date (e.g. 10/01/2026), Tax 0 → Receive Parts (1). Result in Vendor Invoices: Invoice Date Oct 1, 2026, Due Date Oct 31, 2026 (vendor Net 30), Total Cost $200.00 | `probe/30b/`, `probe/30i/` |
| Vendor credit on an earlier date | Parts → Returns → Create Return → Vendor, Packaging Slip, Part Number (pick the received part), Price Per Unit → Save Return. In the Returns list tick the return → Receive Credit → "Process Return": Credit Memo Number, Credit Date (e.g. 10/15/2026), Tax → Post Credit. Result on A/P Aging Detail: a "Vendor Credit" row dated Oct 15, 2026, $-50.00 | `probe/31/`, `probe/32/`, `probe/33/` |

## Locations, staff and roles

| Recipe | Clicks, in the build's labels | Seen in |
|---|---|---|
| Two locations | The organisation has two: "Staging Heavy Duty - 9919" and "Staging Lethbridge - 4310" (Settings → Locations; profile menu → Change Location lists both). In A to Z order Heavy Duty comes first | `probe/34d/`, `probe/34/` |
| Make a document at the other location | Profile menu → Change Location: <location> → pick the other location (the top bar then shows "Staging Lethbridge - 4310"); make the document there; switch back the same way afterwards. Made this way at Lethbridge: invoice S11315-17586 ($20.00, Location "Staging Lethbridge - 4310" on A/R Aging Detail) and bill ZZAUTOTEST-BILL-B1 ($40.00, same location on A/P Aging Detail). Lethbridge has its own, longer Labor Rate list: type "Fixed" in the Labor Rate box to find "Fixed Line Total" | `probe/50/`, `probe/51/`, `probe/57/`, `probe/57b/` |
| Third location | Settings → Locations → New Location → Name * … → Save & Close (form seen, not saved; it warns "Setting up a new location may result in additional billing.") | `probe/35/` |
| Custom role | Settings → Roles & Permissions → Create Custom Role → "Choose a template": Skip → Create Role: Role Name, switches (with Skip every switch starts off) → Create ("Role created successfully."). Made one throwaway role, "ZZAUTOTEST AR AP Reports only" (Reports in Page Access on, nothing else) | `probe/45b/` |
| Give the Tech sign-in user the role | Settings → Staff → the row "Tech ShopView" → edit icon → Edit Staff Member → Role (the custom role is offered) → Save & Close; sign out, then on the QA sign-in page press "Tech" in the DEV MODE — QUICK LOGIN panel. Tech ShopView's role is Technician at "Staging Heavy Duty - 9919" only; put it back to Technician afterwards | `probe/47b/` (role list seen; not assigned, so Tech was not changed) |

## Not walked this pass (Setup lines that use them say "not yet seen on this build")

- An unused deposit dated an earlier day (the leftover deposit takes the day the invoice is made), and a deposit taken at a location other than the work order's.
- Saving a third location, and enrolling yourself at it.
- Signing in as Tech with a custom role (role offered in the list; not assigned).
- A vendor credit made by hand without a return, and a vendor bill payment.
- An invoice made "in the evening when the UTC date is already tomorrow" — this depends on the time of day the tester runs it.

## Throwaway data left on sv11315 (all named ZZAUTOTEST)

Customer "ZZAUTOTEST AR Customer A" (contact, asset, work order S11315-17581 invoiced $300 / paid $250,
work orders S11315-17582 $1,250.50, S11315-17583 $100, S11315-17584 $50 (paid by its $75 deposit, leftover deposit DEP11315-4707 $25), S11315-17585 $10 (made under Due on Receipt; terms back to Net 30), S11315-17586 $20 at Lethbridge, credit memo CM11315-4192 $150, part sale P11315-248 invoiced $300); vendor "ZZAUTOTEST AP Vendor A"
(purchase orders I11315-1395 received as bill ZZAUTOTEST-BILL-A1 $200, and the part-sale order received
as ZZAUTOTEST-BILL-PS1 $100; I11315-724 received at Lethbridge as ZZAUTOTEST-BILL-B1 $40; return credit C-13667 $50); custom role "ZZAUTOTEST AR AP Reports only"
(assigned to nobody). Tech ShopView was not changed.
