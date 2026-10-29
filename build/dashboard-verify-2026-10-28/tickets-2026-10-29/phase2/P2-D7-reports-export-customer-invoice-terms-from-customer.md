<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Export Reports: Customer Invoice shows the customer's current Terms, not the invoice's own
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-1878 ("Customer Invoice" Export Report (export-step 4)) · relates to SV-11676 (Credit terms - Story 7 - Due dates; Open — S7-R7 states the same rule for invoices)
PICTURES: pictures/P2-D7-1-invoice-s1-38216-terms-cod.png · pictures/P2-D7-2-customer-invoice-export-terms-net-30.png
BASIS: Chris Ward's answer to question 38 (28 Oct 2026): "Yes, the invoice's own term. Defect."
RE-CHECKED: 29 Oct 2026, 12:43–12:46 AM UTC (= 28 Oct, 8:43–8:46 PM in Toronto; export and invoice screen re-taken with the app's time-zone setting; data made at 12:05–12:08 AM UTC), staging v26.43.2-f8698cb, DVI Test, on new test data; session, browser, app time-zone setting and test computer all on America/Toronto. The 7 September invoices from question 38 were re-read at Staging Heavy Duty - 9919 (Asia/Karachi) the same hour and still show it.
NOTE FOR THE QA LEAD: question 38 said the customers "both say COD". Re-checked today, those customers' cards now say Net 30 / 50 / 60 — the export follows the CUSTOMER's current term. Re-created on fresh data to prove it.
-->

## What is wrong

The **Customer Invoice** export (Reports → Export Reports) fills the **Terms** column from the customer's **current** credit term, not from the term on the invoice itself. When a customer's term is changed after an invoice was made, the file shows the wrong term for that invoice.

**Example:** invoice **S1-38216** was made on Oct 28, 2026 while its customer was on **COD**, so the invoice says Terms **COD** and is due the same day. The customer was then changed to **Net 30**. The export now says Terms **Net 30** for S1-38216, with a due date equal to the invoice date — which only fits COD.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Create a customer named **ZZAUTOTEST Terms test** with **Credit Terms: COD**, with one contact and one asset.
4. Create a work order for that customer, add one labor line (for example the canned line "Test DVI Line"), mark the line **Complete**, and create the invoice.
5. On the work order, click **Finance**. The invoice shows **Terms COD** and a due date equal to the invoice date.
6. Open the customer (Customers → the customer), click the edit icon next to the name, change **Credit Terms** to **Net 30**, and click **Save**.
7. Click **Reports**, then **Export Reports** (under Accounting).
8. Pick **Report Name: Customer Invoice** and **Date range: Today**, then click **Export**.
9. Open the downloaded file and find the new invoice.

(Ready-made data: work order **S1-38216**, customer **ZZAUTOTEST P2D Terms**, made this way on 28 Oct 2026. From 29 Oct pick **Custom** Oct 28, 2026 – Oct 28, 2026 in step 8.)

**Actual:** the file shows **Terms: Net 30** for the invoice (DueDate = InvoiceDate = 10-28-2026).

**Expected:** the file shows **Terms: COD**, the invoice's own term, as on the invoice.

Also still seen on existing data: at Staging Heavy Duty - 9919, **Last Month** (September 2026), 7 COD invoices show Net 30 / 50 / 60 — for example **S2-31597** (file: Net 30; invoice: COD).

---

**Source:** Chris Ward, answer to question 38 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026). Question: "should the Terms column show the invoice's own term?"

> Yes, the invoice's own term. Defect.

The new Credit Terms story SV-11676 (S7-R7) says the same: *"An invoice keeps the term and due date it was created with. Changing the customer's term later, deactivating the term or moving the customer never changes an existing invoice."*

## Screenshots

**1.** Work order S1-38216 → Finance: the invoice's Terms is COD, due Oct 28, 2026.

**2.** The downloaded Customer Invoice file (Today) for the same invoice: Terms Net 30.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (America/Toronto).
- The export covers every location in the organisation.
- Not checked on Production or on a QA branch.
