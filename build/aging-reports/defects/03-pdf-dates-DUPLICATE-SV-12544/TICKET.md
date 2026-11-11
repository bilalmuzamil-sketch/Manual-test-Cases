# HELD — prepared, NOT filed (Rules 62 / 113: one ticket, one ask, his own yes)

Prepared 11 Nov 2026 (~12:10 UTC). Run result recorded Failed (ticket held) in run 557.

**Summary (title, 66 chars):**
`Aging Reports – PDF Dates Print "Nov 4, 2026" Instead of "Nov 04 2026"`

**Fields:** see `FIELDS.json` (Story Defect · parent SV-11533 · Medium · relates to SV-11533).

**Scope observed:** A/R Detail (C1062581, Nov 4/Dec 4) and the saved PDFs of A/R Collection (C715459), A/P Detail (C715460), A/P Unpaid Invoices (C715461): all print "Nov 6, 2026"-style dates. No other suite case asserts the date form (scan of cases.json, 11 Nov), so no earlier Passed result is affected.

**Inventory Value (the PRD's other named report):** its rows are parts with no document dates, and its PDF did not arrive within 2 minutes in two tries (p55, p55b; menu "Download (PDF)"), so it gives no date control. Sales By Customer alone is the control.

**Reconciliation (Rule 106 / §1(d)):** case Expected = PRD v11 S3-R7a quoted verbatim (read live 10 Nov, this pass) · build differs · control: the Sales By Customer PDF, which S3-R7a names as the format to match, prints document dates "Nov 04 2026" on the same build (p55b, 11 Nov) — so the PRD's example and its "same as" agree; the case is right and the build differs ⇒ real defect. Nearest contradicting rule answered: S2-R1a says the SCREEN shows "Nov 4, 2026" — the screen does, and this ticket is about the PDF only. Not checked: the PDF's top "As of" line (open question 18 on Chris Ward's sheet), so it is left out of this ticket.

**Description — wiki markup, exactly as it goes into `PUT /rest/api/2/issue/<KEY>`:**

---

```
h2. Description

*What the PRD requires:*
{quote}The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026".{quote}

*What happens instead:*
In the aging report PDFs, a document's *Date* and *Due Date* print with a *one-digit day and a comma* ("Nov 4, 2026"), not as *three-letter month, two-digit day and year with no comma* ("Nov 04 2026").

For example,
* an invoice dated Nov 4, 2026 and due Dec 4, 2026 prints *Nov 4, 2026* and *Dec 4, 2026*;
* the *A/R Aging Collection*, *A/P Aging Detail* and *A/P Unpaid Invoices* PDFs print the same way, for example *Nov 6, 2026*;
* the Sales By Customer PDF on the same site prints its dates as *Nov 04 2026*, as the PRD asks.

On screen the dates correctly read "Nov 4, 2026". Negative amounts in the PDF correctly print in brackets, for example *(-$150.00)*.

h2. Steps to Reproduce

# Sign in to the QA site and make sure one customer has an open invoice dated on a day from the 1st to the 9th of a month (we used *ZZX PDF Date S9*, invoice {{S11315-17866}}, $64.00, dated Nov 4, 2026, due Dec 4, 2026).
# Open *Reports* → *A/R Aging Detail*.
# In the *Customer* filter, tick only that customer.
# Set *As of* to the invoice date (11/04/2026) and expand *Current*.
#* On screen the invoice's Date reads *Nov 4, 2026*.
# Choose *Download (PDF)* from the ⋯ menu and open the PDF.
#* The invoice's row prints Date *Nov 4, 2026* and Due Date *Dec 4, 2026*.

!PIC1-ar-detail-pdf.png|width=1000!

For comparison, *Reports* → *Sales By Customer* → ⋯ → *Download Expanded View (PDF)* prints its document dates as *Nov 01 2026*, *Nov 04 2026*:

!PIC2-sales-by-customer-pdf.png|width=1000!

*Actual Result:*
* The PDF prints a document's Date and Due Date as *Nov 4, 2026* and *Dec 4, 2026*.

*Expected Result:*
* The PDF prints them as *Nov 04 2026* and *Dec 04 2026*: three-letter month, two-digit day, year, no comma - the same as the Sales By Customer PDF.


h2. Environment

* QA site: [https://sv11315.qa.shopview.com|https://sv11315.qa.shopview.com] (build *v26.45.2-6a8b89c*), location *Staging Heavy Duty - 9919*, Admin role, observed 11 Nov 2026.
* Report: [A/R Aging Detail|https://sv11315.qa.shopview.com/reports/ar-aging-detail] with *ZZX PDF Date S9* ticked, As of 11/04/2026.


h2. Sources

* PRD *"A/R and A/P Report Sorting, Export and Location Filter"*, [Confluence page 947650561|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561], *version 11* (5 Nov 2026, Chris Ward), read 10 Nov 2026, *S3-R7a*:
{quote}The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today.{quote}

h2. Test case

* [C1062581 A/R Detail: the PDF prints dates as month, two-digit day and year|https://shopview.testrail.io/index.php?/cases/view/1062581]
```

---
