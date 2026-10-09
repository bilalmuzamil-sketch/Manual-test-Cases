# Dashboard — 3 pilot cases, simplified Preconditions + Setup (preview, NOT yet written to TestRail)

Only the Preconditions field changes. Steps and Expected Results are left word for word as they are now. Every path and label below was already in the case; nothing new was added.


---

## C88633 — Revenue tile shows the exact amount to the cent and equals the Sales report
https://shopview.testrail.io/index.php?/cases/view/88633

### NEW Preconditions field
**Preconditions**

1. You are signed in as an Admin (Admin holds every permission, including Reports, so Reports and Dashboard both show in the top menu).
2. You are in a quiet test location: on the Dashboard, the Revenue tile set to This Week reads $0.00 with 0 Invoices.
3. The whole case is run on one day, and not on the last evening of the week, so every record you create stays inside This Week.
4. A test customer with one contact and one asset (for example "ZZAUTOTEST Dash Customer 1", contact "Dana Test", unit "ZZ-101").
5. An in-stock inventory part with a Sell price (for example $200.00).
6. Invoice 1 for that customer, not paid: Service Advisor "Alex Advisor", one approved labor line by technician "Tom Tech" (for example Labor Rate $125.00 per hour, Estimated Time 10.00, Tech Time 10.00) and a flat Discount (for example $100.00). Not sent and not paid. You have written down its Subtotal (before any discount and before tax, for example $1,250.00 = 10.00 hours x $125.00).
7. Invoice 2 for the same customer, not paid: Service Advisor "Alex Advisor", one approved labor line by "Tom Tech" (for example Labor Rate $140.00 per hour, Estimated Time 2.00, Tech Time 2.00) with the part from 5 added (quantity 1, In stock). Not sent and not paid. You have written down its Subtotal (for example $480.00 = $280.00 labor + the $200.00 part).
8. A credit on invoice 2 that returns the part, Outcome Store Credit. You have written down its amount before tax (for example $200.00).

**Setup**

- For 2: pick the location with the location name at the top left of the top bar (for example ShopHub). Check it on Dashboard > Revenue tile > range pill > This Week. If no location you can reach is quiet, create one once and reuse it: Settings > Locations > add a location (for example "ZZAUTOTEST Dashboard Quiet") and give your user access. Locations cannot be deleted, so never create a second one.
- For 4: Customers > New Customer; then the customer's Contacts tab and Assets tab (pick the contact in the asset's Contact field).
- For 5: Parts > Inventory (pick a part with stock on hand, or use New Inventory Part).
- For 6 and 7: Work Orders > New Work Order > the customer and its asset > Create. Set Service Advisor and mileage (for example 123456) in the work order header; if the Finance tab is greyed out with "Please select a contact for the asset", choose the contact and answer YES. Lines tab > New Line (Technician, Labor Rate, Estimated Time, Tech Time, tick Approved) > Save & Close. Discount: three dots at the top right > Add Work Order Fee / Discount > Type Discount, the flat amount > Add Discount. Part: on the line, + Add Part (pick it if the screen asks, so it shows In stock). Then type a Story on each line and set it to Complete, click Complete Work Order, then Mark Reviewed, then Finance tab > Create Invoice. Close the New Customer Payment dialog without taking a payment; do not send or pay the invoice. The Subtotal is on the Finance tab; if shop supplies are added automatically they are part of it.
- For 8: invoice 2's Finance tab > the invoice's three dots > Issue Credit > choose the part, Outcome Store Credit > save. The credit shows on Customers > the customer > Invoices tab with an orange Credit chip (turn Open only off if you cannot see it).

### Steps (unchanged)
1. Work out Revenue by hand: invoice 1 subtotal + invoice 2 subtotal - the credit = $1,250.00 + $480.00 - $200.00 = $1,530.00 (use your own figures if they differ).
2. Click Dashboard in the top menu.
3. On the Revenue tile click the range pill and choose This Week.
4. Write down the Revenue figure exactly as shown.
5. Click the arrow icon beside "Revenue" on the tile (its tooltip names the report).
6. On the Sales report, make sure the Date control shows This week. If it does not, choose This week.
7. Write down the Subtotal in the Totals row at the bottom of the table.

<details><summary>OLD Preconditions field</summary>

1. Sign in on the build under test as an Admin user. Admin holds every permission, including Reports, so Reports and Dashboard both show in the top menu.
2. In the top bar, click the location name at the top left (e.g. ShopHub) and choose your test location: one where nobody else invoices, issues credits or clocks time this week. The next step checks that it is quiet. If no location you can reach is quiet, create one once and reuse it on every later run: Settings > Locations > add a location (e.g. "ZZAUTOTEST Dashboard Quiet") > save, give your user access, then choose it here. Locations cannot be deleted, so never create a second one.
3. Check the location is quiet: click Dashboard in the top menu, click the range pill on the Revenue tile and choose This Week. Revenue must read $0.00 with 0 Invoices under it. If it shows anything else, choose another location.
4. Run the whole case on one day, and not on the last evening of the week, so every record you create stays inside This Week.
5. Create a test customer: Customers > New Customer, name it (e.g. "ZZAUTOTEST Dash Customer 1") and save. On its Contacts tab add a contact (e.g. "Dana Test"). On its Assets tab add an asset (e.g. unit "ZZ-101") and pick that contact in the asset's Contact field.
6. Have an in-stock inventory part to sell: Parts > Inventory, pick (or create with New Inventory Part) a part with stock on hand and a Sell price of e.g. $200.00. Credits are issued by returning a part, so the credit needs this part on the invoice.
7. Invoice 1 (with a discount). Create it with these standard steps:Work Orders > New Work Order > choose the customer and its asset > Create.
8. In the work order header set Service Advisor to "Alex Advisor" and enter the mileage (e.g. 123456). If the Finance tab is greyed out with "Please select a contact for the asset", choose the contact and answer YES to keep it on the asset.
9. Lines tab > New Line: Description "ZZAUTOTEST Labor 10h", Technician "Tom Tech", Labor Rate e.g. $125.00 per hour, Estimated Time 10.00, Tech Time 10.00, tick Approved > Save & Close.
10. Click the three dots (top right) > Add Work Order Fee / Discount: Type Discount, flat amount e.g. $100.00 > Add Discount.
11. On each line type a Story (e.g. "Done") and set the line to Complete. Then click Complete Work Order, then Mark Reviewed.
12. Finance tab > Create Invoice. When the New Customer Payment dialog opens, close it without taking a payment. Do not send or pay the invoice.
13. On the Finance tab write down the invoice's Subtotal (before any discount and before tax), e.g. $1,250.00 (10.00 hours x $125.00), with the $100.00 discount and the tax shown below it. If shop supplies are added automatically they are part of the subtotal: use the subtotal the invoice shows.
14. Invoice 2 (with the part you will return). Create a second work order for the same customer the same way:Work Orders > New Work Order > choose the customer and its asset > Create.
15. In the work order header set Service Advisor to "Alex Advisor" and enter the mileage (e.g. 123456). If the Finance tab is greyed out with "Please select a contact for the asset", choose the contact and answer YES to keep it on the asset.
16. Lines tab > New Line: Description "ZZAUTOTEST Labor 2h", Technician "Tom Tech", Labor Rate e.g. $140.00 per hour, Estimated Time 2.00, Tech Time 2.00, tick Approved > Save & Close.
17. On that line click + Add Part, choose the inventory part (Sell price e.g. $200.00), quantity 1, and make sure it shows In stock (pick it if the screen asks).
18. On each line type a Story (e.g. "Done") and set the line to Complete. Then click Complete Work Order, then Mark Reviewed.
19. Finance tab > Create Invoice. When the New Customer Payment dialog opens, close it without taking a payment. Do not send or pay the invoice.
20. On the Finance tab write down the invoice's Subtotal (before any discount and before tax), e.g. $480.00 (2.00 hours x $140.00 = $280.00, plus the $200.00 part). If shop supplies are added automatically they are part of the subtotal: use the subtotal the invoice shows.
21. Credit memo. On invoice 2's Finance tab click the invoice's three dots > Issue Credit, choose the $200.00 part to return, Outcome Store Credit, and save.Write down the credit's amount before tax (e.g. $200.00). It shows on Customers > the customer > Invoices tab as a row with an orange Credit chip (turn Open only off if you cannot see it).

</details>


---

## C88615 — Tiles load on their own and remember choices in this browser
https://shopview.testrail.io/index.php?/cases/view/88615

### NEW Preconditions field
**Preconditions**

1. You are signed in as a user whose role has the Reports permission (for example an Administrator).
2. Your browser window is at least 1024 pixels wide (a maximised laptop or desktop window).
3. You are in a workplace that has invoices and technician clocked time on several different days this month and in the last twelve months (on the QA environment the "QA Testing" data has this).
4. A second browser on the same computer (for example Chrome and Firefox), or a private window.

**Setup**

- For 1: Settings > Roles & Permissions > open the role > the Reports permission is switched on.
- For 3: the workplace selector at the top left of the top bar (it shows the workplace name, for example "ShopHub").

### Steps (unchanged)
1. Open the dashboard and watch the tiles while they load.
2. On the Revenue tile change the range pill to Last Year and watch the tile straight away.
3. Click View details on Technician Utilization.
4. In its chart, open the "Technician: All technicians" filter and untick all but one technician.
5. Set the At Risk window to 60 days.
6. Open Reports > Sales and click Hide Chart above the report table.
7. Close the tab, open the site again in the same browser and open the dashboard, then Reports > Sales.
8. Open the dashboard and Reports > Sales in the second browser (or a private window).
9. In the first browser clear the site's data (browser settings > privacy > clear browsing data for this site), sign in again and open the dashboard.

<details><summary>OLD Preconditions field</summary>

1. Sign in on the build under test as a user whose role has the Reports permission, for example an Administrator. To check a role: Settings > Roles & Permissions > open the role > the Reports permission is switched on.
2. Use a desktop browser window at least 1024 pixels wide (a maximised laptop or desktop window).
3. In the top bar, use the workplace selector at the top left (it shows the workplace name, e.g. "ShopHub") to pick a workplace that has invoices and technician clocked time on several different days this month and in the last twelve months (on the QA environment the "QA Testing" data has this).
4. Have a second browser on the same computer (e.g. Chrome and Firefox), or use a private window.

</details>


---

## C88609 — At Risk Customers tile updates when the inactivity window changes
https://shopview.testrail.io/index.php?/cases/view/88609

### NEW Preconditions field
**Preconditions**

1. You are signed in as a user whose role has the Reports permission (for example an Administrator).
2. Your browser window is at least 1024 pixels wide (a maximised laptop or desktop window).
3. The site is open in a fresh private (incognito) window, so nothing remembered from an earlier visit is in play.
4. You are in a workplace with customers who have not been invoiced for a while (on the QA environment, the "QA Testing" data).
5. At least one customer shows in the At Risk table at 60 days whose Last Invoice Date is between 60 and 119 days ago (the automated version of this case seeds its own customer with one invoice about 90 days old; a manual tester uses the existing customers).

**Setup**

- For 1: Settings > Roles & Permissions > open the role > the Reports permission is switched on.
- For 4: the workplace selector in the top bar.

### Steps (unchanged)
1. Open the dashboard and look at the At Risk Customers tile's window pill.
2. Click the window pill and read the options.
3. Close the menu and read the headline and the supporting line.
4. Click View details on At Risk Customers, count the table rows (all pages) and read their Last Invoice Date values.
5. Open the window pill and pick 60 days.
6. Read the headline, the supporting line, the trend line and the table again.
7. Try each of 30, 90 and 180 days the same way, noting for each the headline and the end of the supporting line.

<details><summary>OLD Preconditions field</summary>

1. Sign in on the build under test as a user whose role has the Reports permission, for example an Administrator. To check a role: Settings > Roles & Permissions > open the role > the Reports permission is switched on.
2. Use a desktop browser window at least 1024 pixels wide (a maximised laptop or desktop window).
3. Open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play.
4. In the workplace selector in the top bar, pick a workplace with customers who have not been invoiced for a while (on the QA environment, the "QA Testing" data).
5. Test data: the automated version of this case seeds its own customer with one invoice about 90 days old and nothing since. A manual tester uses the existing customers: at least one customer must show in the At Risk table at 60 days whose Last Invoice Date is between 60 and 119 days ago.

</details>
