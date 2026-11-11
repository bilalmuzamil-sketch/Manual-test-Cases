# HELD — prepared, NOT filed (Rules 62 / 113: one ticket, one ask, his own yes)

Prepared 11 Nov 2026 (~14:12 UTC). Run results recorded Failed (ticket held) in run 557 for C715442 and C715443. Negative-claim gate: `CLAIM.json` passed `blocker_gate.py --check` (7 of 7).

**Summary (title):** `Aging Reports – No Load-Error Message When the Report Fails While Offline`

**Fields:** see `FIELDS.json` (Story Defect · parent SV-11538 · Medium · relates to SV-11538). Parent status to be read live before the ask (Rule 112).

**Reconciliation (Rule 106 / §1(d)):** case Expected = PRD v11 S8-R6, quoted (read 10 Nov) · build differs when the network is off · the PRD sentence covers any failure to load ("If a report fails to load"), and the case itself names a lost connection as the failure a tester can cause, so offline is inside it (Rule 137: not stricter than the PRD). What does NOT fail: online failures show both the message and the standard error message (PIC3). Related held draft 04 covers the Detail bucket messages (Story 4) — same cause, different rule and story, so a separate ticket.

**Description — wiki markup, exactly as it goes into `PUT /rest/api/2/issue/<KEY>`:**

---

```
h2. Description

*What the PRD requires:*
{quote}If a report fails to load, it shows "Something went wrong loading this report. Please try again." in place of the rows, with the standard error message.{quote}

*What happens instead:*
When the computer is *offline* and the as-of date is changed, the aging reports show *no message at all*, and the rows from *before* the change stay on screen under the *new* date.

For example,
* *A/R Aging Collection* → As of changed to *11/03/2026* with the network off: the chip reads 11/03/2026, the earlier rows and Totals stay, no message, no standard error message;
* *A/P Aging Summary* → As of changed to *11/03/2026* with the network off: the Totals row still reads *$4,763,211.95*, today's figure, and no message shows.

When the same report fails to load while the computer is online, the message and the standard error message *do* appear.

h2. Steps to Reproduce

# Sign in to the QA site and open *Reports* → *A/R Aging Collection* (as of today).
# Switch the computer's network off.
# Click the *As of* chip and pick an earlier day (we picked *3* in November).
#* The chip reads *As of: 11/03/2026*.
#* The rows and Totals from before stay on screen, and *no message* appears (watched 30 seconds, two tries).

!PIC1-collection-offline-no-message.png|width=1000!

# Repeat on *Reports* → *A/P Aging Summary*.
#* Same result: the Totals row still reads today's *$4,763,211.95* under *As of: 11/03/2026*, with no message.

!PIC2-ap-summary-offline-no-message.png|width=1000!

For comparison, when the report's load fails while the computer is online, the message is shown in place of the rows, with the standard error message:

!PIC3-online-failure-shows-message.png|width=1000!

*Actual Result:*
* With the network off, a new as-of date shows the earlier rows and no message.

*Expected Result:*
* In place of the rows the report shows *Something went wrong loading this report. Please try again.*, with the standard error message.


h2. Environment

* QA site: [https://sv11315.qa.shopview.com|https://sv11315.qa.shopview.com] (build *v26.45.2-6a8b89c*), location *Staging Heavy Duty - 9919*, Admin role, observed 11 Nov 2026 (two tries per report).
* Reports: [A/R Aging Collection|https://sv11315.qa.shopview.com/reports/ar-aging-collection] and [A/P Aging Summary|https://sv11315.qa.shopview.com/reports/ap-aging-summary], all customers / all vendors.


h2. Sources

* PRD *"A/R and A/P Report Sorting, Export and Location Filter"*, [Confluence page 947650561|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561], *version 11* (5 Nov 2026, Chris Ward), read 10 Nov 2026, Story 8, *S8-R6*:
{quote}If a report fails to load, it shows "Something went wrong loading this report. Please try again." in place of the rows, with the standard error message.{quote}
* The same PRD's User Feedback Summary: "Report fails to load | "Something went wrong loading this report. Please try again." | In place of the rows, plus the standard error toast".

h2. Test case

* [C715442 A/R Collection: a report that fails to load says so in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715442]
* [C715443 A/P Summary: a report that fails to load says so in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715443]
* [C715633 Design: A/R Summary load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715633]
* [C715634 Design: A/R Detail load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715634]
* [C715635 Design: A/R Collection load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715635]
* [C715636 Design: A/P Summary load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715636]
* [C715637 Design: A/P Detail load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715637]
* [C715638 Design: A/P Unpaid Invoices load error message shows in place of the rows|https://shopview.testrail.io/index.php?/cases/view/715638]
```

---
