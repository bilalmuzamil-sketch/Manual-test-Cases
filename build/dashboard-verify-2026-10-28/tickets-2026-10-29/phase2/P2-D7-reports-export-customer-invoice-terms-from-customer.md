<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
RESULT: REPRODUCED — 4 Nov 2026, 17:20–17:22 UTC (= 5 Nov, 5:20–5:22 AM in Fiji), staging v26.45.0-440aa25 (app meta "app-version"), DVI Test. The invoice screen for S1-38216 says Terms COD; the Customer Invoice export (Date Range: Last Month) says Terms Net 30 for the same invoice. Server read the same minute: export row S1-38216 Terms "Net 30", InvoiceDate 10-29-2026, DueDate 10-29-2026; invoice record credit_terms "COD"; customer card credit_term "Net 30". Heavy Duty, September 2026 (Asia/Karachi): S2-31597 still shows Net 30 in the file while the file's due date equals its invoice date; the file has 7 September invoices with a Net 30/50/60 term and a same-day due date (the invoice records of the other 6 were not re-read one by one today).
UPDATED 4 Nov 2026 after Chris Ward's corrected answer to question 38: Source replaced by the verbatim answer; pictures re-taken; dates now read in DVI Test's new zone. NOTE: DVI Test's zone on the server changed from America/Toronto to Pacific/Fiji around 3 Nov, so the same invoice that read "Oct 28, 2026" in Toronto now reads "Oct 29, 2026". Nothing about the invoice changed.
SUMMARY: Reports - Export Reports: Customer Invoice shows the customer's current Terms, not the invoice's own
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-1878 ("Customer Invoice" Export Report (export-step 4)) · relates to SV-11676 (Credit terms - Story 7 - Due dates; Open — S7-R7 states the same rule for invoices)
PICTURES: pictures/P2-D7-1-v3-invoice-s1-38216-terms-cod-2026-11-04.png · pictures/P2-D7-2-v3-customer-invoice-export-last-month-terms-net-30-2026-11-04.png (replace the 29 Oct pictures)
BASIS: Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 38 (corrected): "The invoice's own term: COD for S1-38216 ... Defect."
ZONES (Rule 99): zone read live from GET /api/staff/my-workplaces (DVI Test = Pacific/Fiji, Heavy Duty = Asia/Karachi); session change-location workplace_timezone, browser timezoneId, process TZ and the app's localStorage 'timezone' all = Pacific/Fiji, localStorage 'location' = DVI Test's id; header showed "DVI Test" at the start and just before the file was drawn. Evidence: rerun-2026-11-04/results/sec3/screen-d7.json, server-d7-DVI-x.json, server-d7-DVI-records.json, server-d7-HD-x.json.
DUPLICATE CHECK (4 Nov 2026, read-only JQL): project = SV AND text ~ "\"Customer Invoice\"" AND text ~ "Terms" ORDER BY created DESC → 20 issues (SV-11571, SV-10509, SV-8435, SV-8161, SV-6815, SV-4851, SV-4827, SV-4710, SV-4443, SV-4278, SV-4277, SV-4041, SV-3515, SV-3004, SV-2993, SV-2896, SV-2730, SV-2354, SV-1936, SV-1604). None is about the export's Terms column. Closest: SV-11571 (Done, vendor bill due date one day early across a daylight-saving change) — a different screen and problem.
-->

## What is wrong

The **Customer Invoice** export (Reports → Export Reports) fills the **Terms** column from the customer's **current** credit term, not from the term on the invoice itself. When a customer's term is changed after an invoice was made, the file shows the wrong term for that invoice.

**Example:** invoice **S1-38216** was made while its customer was on **COD**, so the invoice says Terms **COD** and is due the same day (invoice date Oct 29, 2026, due Oct 29, 2026). The customer was then changed to **Net 30**. The export now says Terms **Net 30** for S1-38216, with a due date equal to the invoice date. A Net 30 invoice from Oct 29 would be due Nov 28 (Oct 29 + 30 days), so the file's own dates only fit COD.

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
8. Pick **Report Name: Customer Invoice** and the **Date Range** that holds the invoice date (for the ready-made invoice below: **Last Month**; from 1 December 2026, **Custom**, 10/01/2026 to 10/31/2026), then click **Export**.
9. Open the downloaded file and find the invoice.

(Ready-made data: work order **S1-38216**, customer **ZZAUTOTEST P2D Terms**, made this way.)

**Actual:** the file shows **Terms: Net 30** for S1-38216, with InvoiceDate 10-29-2026 and DueDate 10-29-2026. The invoice itself says **Terms COD**.

**Expected:** the file shows **Terms: COD**, the invoice's own term, as on the invoice.

Also still seen on existing data: at **Staging Heavy Duty - 9919**, Date Range **Custom** 09/01/2026 to 09/30/2026, 7 invoices have a Net 30 / 50 / 60 term in the file but are due on their invoice date, which only fits COD — for example **S2-31597** (file: Net 30, invoice date and due date 09-07-2026; the invoice itself said COD when it was read on 29 Oct 2026).

---

**Source:** Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 38 (corrected). Question: "should Terms show the invoice's own term (COD for S1-38216), or the customer's term as it is today (Net 30)?"

> 38 (corrected). The invoice's own term: COD for S1-38216. An invoice keeps the term it was made with, and changing the customer's term later never changes it (SV-11676). Defect.

The Credit Terms story SV-11676 (S7-R7) says the same: *"An invoice keeps the term and due date it was created with. Changing the customer's term later, deactivating the term or moving the customer never changes an existing invoice."*

## Screenshots

**1.** Work order S1-38216 → Finance: the invoice says Terms COD, invoice date and due date Oct 29, 2026.

**2.** The downloaded Customer Invoice file (Date Range: Last Month), S1-38216 highlighted: Terms Net 30.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.45.0-440aa25, 4 Nov 2026, 5:20–5:22 AM on 5 Nov in Fiji (17:20–17:22 UTC), Admin, location DVI Test.
- Session, browser, the app's own time-zone setting and the test computer all set to the location's time zone (Pacific/Fiji). Heavy Duty example read in Asia/Karachi.
- The export covers every location in the organisation.
- Not checked on Production or on a QA branch.
