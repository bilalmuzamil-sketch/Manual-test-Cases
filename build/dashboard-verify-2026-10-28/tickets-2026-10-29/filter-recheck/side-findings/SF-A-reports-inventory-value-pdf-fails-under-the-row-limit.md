<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73). Worker F2, 29 Oct 2026.
SUMMARY: Reports - Inventory Value PDF download fails for a large view that is under the 10,000-row limit
TYPE Bug · PARENT SV-11936 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8818 (Done 24 Aug 2026: "PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports"; the same failure is back on Inventory Value) · relates to SV-8677 (Inv Value - Story 10 - Export to PDF and CSV)
PICTURES: pictures/SF-A-1-inventory-value-pdf-all-locations-fails.png
BASIS: Inventory Value Report PRD (Confluence 720142338, last change 13 Aug 2026), S10-R12, S10-R14 and the size-cap wording decision of 13 Aug 2026 (quoted below).
RE-CHECKED: 29 Oct 2026, 11:31–11:37 UTC (= 29 Oct, 7:31–7:37 AM in Toronto), staging v26.43.3-8ad4001, DVI Test; session, browser, the app's own time-zone setting and the test computer all on America/Toronto; the header showed "DVI Test" at the start of every run and at the end of run 4. In runs 1–3 the end-of-run check fired before the page opened (a fault in my tool, since fixed), so only run 4 has a valid end check.
  - Seen on screen 4 times out of 4 with All locations.
  - Server data: 4 PDF requests failed with HTTP 500 (3,699 rows to 9,667 rows); 7 PDF requests worked (1 to 2,305 rows).
  - One more request answered 502 Bad Gateway (Heavy Duty, right after a failed request) and is not counted.
  - Evidence: evidence/f2/obsA_iv_export_run1.json, evidence/f2/obsA_iv_pdf_boundary.json, evidence/f2/screen/OBSA_IV_PDF_*.json.
DUPLICATE CHECK (29 Oct, read-only):
  - JQL `project = SV AND text ~ "\"Inventory Value\"" AND (text ~ "PDF" OR text ~ "export" OR text ~ "download")` returned 42 issues, all statuses, all read. None is open for this. SV-8818 (Done) reported the same failure.
  - JQL `project = SV AND statusCategory != Done AND (summary ~ "PDF" OR summary ~ "export" OR summary ~ "download" OR text ~ "\"Failed to export\"")`: the first 60 results were read; none matches.
  - SV-11445 is about A/R and A/P background exports, not Inventory Value.
NOTE FOR THE QA LEAD: SV-8818 was closed on 24 Aug 2026; the failure is back on this build. This draft follows your earlier ruling to re-create rather than reopen (as for SV-8927).
-->

## What is wrong

On **Inventory Value**, **Download (PDF)** gives **no file** once the report holds a few thousand rows. That is still well under the report's **10,000-row** download limit. After about 30 seconds a red message appears instead: "This report is too large to export. Narrow the date range or filters, then try again."

The **Download (CSV)** of the very same view works and arrives in about 2 seconds.

For example, with **Location: All locations** the report holds **9,667** rows:

- Limit: **10,000** rows. 10,000 − 9,667 = **333** rows to spare, so the PDF should be made.
- Actual: no PDF. The "too large" message appears, although the view is under the limit.
- Expected: the PDF downloads, as the CSV does.

It is not only about All locations. **Staging Lethbridge - 4310** on its own (3,699 rows) and **Staging Heavy Duty - 9919** on its own (5,965 rows) fail the same way. A view of 2,305 rows still worked, but took about 1½ minutes.

## Where this shows on the Dashboard

Not affected. The Dashboard has no Inventory Value tile: the Dashboard PRD, last changed 22 Oct 2026, never mentions Inventory Value.

## Steps to reproduce

1. Log in to staging as an Admin.
2. Click **Reports**, then in the left menu under **Parts**, click **Inventory Value**.
3. Leave **As of** on today's date (it opens on today).
4. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**. Leave **Category: All categories** and **Vendor: All vendors**. Type nothing in **Search**.
5. (Optional) To see how many rows the view holds, do step 7 first and count the lines between the column names and the **Totals** line in the CSV. On 29 Oct 2026 there were 9,667.
6. At the top right of the report, click **⋯** and choose **Download (PDF)**. Wait about a minute.
7. Click **⋯** again and choose **Download (CSV)**.

**Actual:** after about 30 seconds the red message "This report is too large to export. Narrow the date range or filters, then try again." appears, and no PDF arrives. The CSV of the same view arrives in about 2 seconds.

**Expected:** the PDF downloads, because the view holds fewer than 10,000 rows. The "too large" message is for views over 10,000 rows only. If a download does fail for another reason, the message should say so: "Failed to export inventory value report (pdf)".

---

**Source:** Inventory Value Report PRD (Confluence 720142338, last change 13 Aug 2026):

> S10-R12: Export size guardrail. To keep a single-shot export renderable, an export is capped at a maximum of **10,000 rows** in the filtered set. When the current filtered set exceeds the cap, neither the PDF nor the CSV is produced; instead the user sees the message: "This report is too large to export. Narrow the filters, then try again."

> S10-R14: If a download fails, the user sees an error notification: "Failed to export inventory value report (pdf)" or "Failed to export inventory value report (csv)".

Same PRD, decision of 13 Aug 2026: "this report's size-cap message reads "This report is too large to export. Narrow the filters, then try again." — the suite string minus the date-range clause, because this report has no date range."

## Screenshots

**1.** Inventory Value, As of today, All locations, nothing in Search (9,667 rows): after Download (PDF), the red "too large to export" message appears and no file arrives.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- The same failure came 4 times out of 4 on screen.
- One location with 2 rows (DVI Test) downloads the PDF in about 1 second.
- Earlier the same day, on build v26.43.2-9272076, the same All-locations PDF also failed.
- Not checked on Production or on a QA branch.
