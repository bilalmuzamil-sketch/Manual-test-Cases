# A/R and A/P release (19 Nov 2026): what to capture on production BEFORE the release

**For:** Mudassir. **Do this by 18 Nov 2026**, before the release is installed on production. Anything captured after the
release is installed cannot be used, because these tests compare "before" with "after".

**Where:** the production test account, signed in as an **Admin** user, in a desktop browser window **1440 px wide**. The account
needs **open documents at two or more locations** (and you must be able to switch between them in the top-right location
switcher).

**Keep everything** (screenshots, PDFs, CSVs, links, notes) in one folder named "A-R A-P before release 2026-11-19", and write down
the as-of date, the location names and the customer and vendor names you used. After the release, the same tests in run 557 tell
the tester to compare against these.

---

## 1. The six A/R and A/P reports, untouched

Used by: C715471 (A/R) and C715472 (A/P).

1. Pick one as-of date (for example 17 Nov 2026) and write it down.
2. Open Reports, then each of these six reports, set the as-of date you picked, and touch no other filter:
   - A/R Aging Summary
   - A/R Aging Detail
   - A/R Aging Collection
   - A/P Aging Summary
   - A/P Aging Detail
   - A/P Unpaid Invoices
3. On each report, take screenshots of every row and the Totals row (scroll and take more screenshots if the list is long).
4. On the A/R reports, also save the print (the print icon).

## 2. A credit memo for the aging change

Used by the new release-day case that replaces C715478 (its number will follow once it is created).

1. Create an unused credit memo for a customer, dated **the day before the release** (18 Nov 2026). Put ZZAUTOTEST in its memo or
   reference.
2. Open A/R Aging Detail with the credit memo's own date as the as-of date, tick its customer, and expand every bucket.
3. Write down which bucket the credit memo is in (today it should be "1-30 days past due"), and take a screenshot.

## 3. Inventory Value, Sales By Customer and Work In Progress: files and a link

Used by: C715475 (Inventory Value), C715617 (Sales By Customer), C715618 (Work In Progress).

For **each** of the three reports:
1. Open it, set an as-of date before the release, and tick **one** location in its Location filter.
2. Choose "Download (PDF)" from the ⋯ menu and save the file.
3. Choose "Download (CSV)" from the ⋯ menu and save the file.
4. Copy the page address (the link in the browser's address bar) and save it.

## 4. Sales By Customer: the message when an export fails

Used by: C715476.

1. Open Sales By Customer.
2. Switch the computer's network connection off (for example Wi-Fi off).
3. Choose "Download (CSV)" from the ⋯ menu.
4. Write down the exact message and take a screenshot.
5. Switch the network connection back on.

## 5. The location switcher

Used by: C715480.

1. Open A/R Aging Summary.
2. Open the location switcher in the top right of ShopView.
3. Take a screenshot of it open.

## 6. Drill-down links

Used by: C715582.

1. Open A/R Aging Summary and click a customer's name that has overdue invoices. Save the address of the A/R Aging Collection page
   it opens, and write down the customer's name.
2. Open A/P Aging Summary and click a vendor's name that has unpaid bills. Save the address of the A/P Unpaid Invoices page it opens,
   and write down the vendor's name.

## 7. Does the Location filter remember itself between visits?

Used by: C715583 (Sales By Customer), C715619 (Inventory Value), C715620 (Work In Progress).

For **each** of the three reports:
1. Open it and, in its Location filter, untick one location (write down which).
2. Open A/R Aging Summary.
3. Open the first report again from the Reports menu.
4. Write down whether the location you unticked is still unticked.

## 8. Sales By Customer's filter menus

Used by: C715584.

1. Open Sales By Customer.
2. In the Location menu, click "Clear selection", then "Select all". Write down what the Location chip says and copy the page address.
3. Open the Customer menu and type a few letters of a customer's name into its search box, then keep typing without clicking the
   box again. Write down whether the letters kept going into the box.
4. Make the browser window 900 px wide and take a screenshot of the filter row.

---

When done, tell the QA lead where the folder is.
