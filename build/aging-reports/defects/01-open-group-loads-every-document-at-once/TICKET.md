# HELD — prepared, NOT filed (Rules 62 / 113: one ticket, one ask, his own yes)

Prepared 11 Nov 2026 (~11:00 UTC). Supersedes the earlier sketch in `build/aging-reports/tickets-held/01-open-group-loads-all-documents-at-once.md`
(same finding; this one is in the house voice, opens with "What the PRD requires:" (Rule 135(8)) and ends with the test-case links (Rule 120)).

**Summary (title, 68 chars):**
`Aging Reports – Open Customer or Vendor Loads Every Document at Once`

**Fields:** see `FIELDS.json` (Story Defect · parent SV-11531 · Medium · relates to SV-11531 · also relates to SV-11534).

**Description — wiki markup, exactly as it goes into `PUT /rest/api/2/issue/<KEY>` (the only route that embeds pictures):**

---

```
h2. Description

*What the PRD requires:*
{quote}On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents.{quote}

*What happens instead:*
When a customer or vendor with *more than 100 documents* is opened, *every one of its documents appears at once*. Scrolling past the 100th document loads nothing more, because the rest are already there.

For example,
* a customer with 105 overdue invoices: all 105 are listed as soon as the group opens;
* a vendor with 105 unpaid bills: the same.

The count in brackets, the *Total for <name>* row and the *Totals* row are correct, and every document is listed once. Only the *100 at a time* loading is missing.

h2. Steps to Reproduce

h3. Example 1 - A/R Aging Collection
# Sign in to the QA site and make sure one customer has *more than 100 overdue invoices* (we used *ZZAUTOTEST OVER100 C*, 105 invoices dated Oct 1-20, 2026).
# Open *Reports* → *A/R Aging Collection*.
# In the *Customer* filter, tick only that customer.
# Open the customer's group with its arrow.
#* The group row reads *ZZAUTOTEST OVER100 C (105)*.
# Scroll down to the 100th invoice ({{S11315-17714}}) and on to the end.
#* Invoices 101 to 105 are already there under it; no loading row appears and nothing more loads.

!PIC1-ar-collection.png|width=1000!

h3. Example 2 - A/P Unpaid Invoices
# Make sure one vendor has *more than 100 unpaid bills* (we used *ZZAUTOTEST OVER100 V*, 105 bills).
# Open *Reports* → *A/P Unpaid Invoices*; in the *Vendor* filter, tick only that vendor.
# Open the vendor's group and scroll to the 100th bill ({{ZZO100-099}}) and on to the end.
#* Bills 101 to 105 are already there; nothing more loads.

!PIC2-ap-unpaid.png|width=1000!

*Actual Result:*
* The open group shows *all of its documents at once* (105 of 105).
* Scrolling past the 100th document loads nothing, because nothing is left to load.

*Expected Result:*
* The open group shows its *first 100 documents*.
* The next documents load under them *as the user scrolls*, up to 100 more each time.
* The count, the *Total for <name>* row, the *Totals* row and the exports still cover all of the group's documents.


h2. Environment

* QA site: [https://sv11315.qa.shopview.com|https://sv11315.qa.shopview.com] (build *v26.45.2-6a8b89c*), location *Staging Heavy Duty - 9919*, Admin role, observed 10-11 Nov 2026.
* Reports: [A/R Aging Collection|https://sv11315.qa.shopview.com/reports/ar-aging-collection] with *ZZAUTOTEST OVER100 C* ticked · [A/P Unpaid Invoices|https://sv11315.qa.shopview.com/reports/ap-unpaid-invoices] with *ZZAUTOTEST OVER100 V* ticked.


h2. Sources

* PRD *"A/R and A/P Report Sorting, Export and Location Filter"*, [Confluence page 947650561|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561], *version 11* (5 Nov 2026, Chris Ward), read 10 Nov 2026, *S1-R8*:
{quote}On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents.{quote}
* The same PRD's change log, 2026-11-04 (Chris Ward): "S1-R8: documents inside an open customer or vendor load 100 at a time."

h2. Test case

* [C1062570 A/R Collection: a customer with over 100 documents loads 100 at a time|https://shopview.testrail.io/index.php?/cases/view/1062570]
* [C1062571 A/P Unpaid Invoices: a vendor with over 100 bills loads 100 at a time|https://shopview.testrail.io/index.php?/cases/view/1062571]
```

---

## Why ONE ticket for two failed tests (skill 06, "One ticket, one primary failure" and "The example-block shape")

* Both tests fail against the **same PRD sentence** (S1-R8, last sentence), which names both reports in one rule.
* The **fault has the same shape** on both: the open group arrives whole; there is no 100-at-a-time loading. Same screen family (grouped A/R Collection / A/P Unpaid Invoices), same owning story.
* Skill 06: *"Several examples of the SAME failure belong in one ticket"* and *"Where one fault shows on more than one kind of record, write ONE NAMED EXAMPLE PER RECORD TYPE, each under its own h3."* Two examples is the ceiling (6b) — one per report.
* Two tickets would ask a developer to fix one thing twice and would split the retest.

## Things deliberately left OUT of the description (and why)

* "The server sends every document in its first answer" (our recorded observation: no network call when opening the group or scrolling — `exec/s1e/C1062570.json` `callsOpen: []`, `callsScroll: []`). It is a mechanism, not what a user sees; the house rule bars a technical-details section. It may go in a COMMENT if a developer asks.
* Any impact sentence (slow loading for big customers, etc.) — barred (skill 06: no assumed effects).
