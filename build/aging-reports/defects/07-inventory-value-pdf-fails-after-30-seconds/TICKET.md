# HELD — not filed (Rule 62/113: his per-ticket yes). Likely the same fault as SV-12539 — ask him first: add to SV-12539, or file new.

**Title:** Inventory Value PDF Fails After 30 Seconds For Any List Over A Few Hundred Parts

## Description
Any report PDF that takes the server longer than about 30 seconds to make fails on the new build, so Inventory Value can no longer print lists it printed before the release.

For example,
* Inventory Value with one location ticked and 614 parts or more gives no PDF.
* Before the release (production) Inventory Value printed 1,439 parts for one location and 2,856 parts for every location.
* The same cut-off stops A/P Aging Detail at 1,784 rows, below its 2,000-row limit (see SV-12539).

## Steps to Reproduce
# Open *Reports* > *Inventory Value*.
# In *Location*, click *Clear selection*, then tick *Staging Lethbridge - 4310*.
# In *Category*, tick *HD-Hose & Fittings* (614 parts).
# Click *⋯* > *Download (PDF)* and wait.
#* After about 30 seconds: "This report is too large to export. Narrow the date range or filters, then try again."
#* No PDF downloads.

*Actual Result:* no PDF; the "too large" message after about 30 seconds.
*Expected Result:* the PDF downloads, as it did before the release.

!PIC1-inventory-value-pdf-message.png|thumbnail!  (banner: Inventory Value, 614 parts - no PDF, the message after 30 seconds)
!PIC2-production-pdf-before-release.png|thumbnail!  (banner: Before the release - the same report's PDF for 1,439 parts)

## Environment

QA site: https://sv11315.qa.shopview.com/reports/inventory-value · Production (before the release): https://app.shopview.com/reports/inventory-value

## Sources
* Test case C715475, step 2: "The PDF downloads." (Inventory Value must work as before the release.)
* Production v26.45.3-f5ba431, 11 Nov 2026: Inventory Value PDF of 2,856 parts downloads (about 90 seconds).

## Test case
https://shopview.testrail.io/index.php?/cases/view/715475
