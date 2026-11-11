# HELD — prepared, NOT filed (Rules 62 / 113: one ticket, one ask, his own yes)

Prepared 11 Nov 2026 (~12:30 UTC). Run result recorded Failed (ticket held) in run 557. Negative-claim gate: `CLAIM.json` passed `blocker_gate.py --check`.

**Summary (title, 67 chars):**
`Aging Detail – Bucket Opened While Offline Shows No Load-Error Message`

**Fields:** see `FIELDS.json` (Story Defect · parent SV-11534 · Medium · relates to SV-11534).

**Reconciliation (Rule 106 / §1(d)):** case Expected = PRD v11 Story 4 error handling, quoted (read 10 Nov, this pass) · build differs when the network is off · the PRD sentence covers any failure to load ("fail to load when it is expanded"), so an offline failure is inside it (Rule 137: not stricter than the PRD). Nearest contradicting reading: "the message is only for server errors" — the PRD names no such limit. PIC2 is a comparison only: it was taken with the load blocked while online, and at that moment the site was also going to sleep (a "QA env is sleeping" toast, cropped out), so it proves only that the message exists, not why the call failed.

**Description — wiki markup, exactly as it goes into `PUT /rest/api/2/issue/<KEY>`:**

---

```
h2. Description

*What the PRD requires:*
{quote}If a bucket's lines fail to load when it is expanded, the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again." in place of its lines.{quote}

*What happens instead:*
When the computer is *offline*, expanding a bucket on *A/R Aging Detail* fails to load its lines, and the bucket opens *empty with no message*. The user sees an open bucket with nothing in it and no way to tell that something went wrong.

For example,
* *Current (15)* opened with the network off shows no lines and no message, and stays that way;
* when the same load fails while the computer is online, the message *does* appear.

h2. Steps to Reproduce

# Sign in to the QA site and open *Reports* → *A/R Aging Detail* (as of today; we used *Current (15)*).
# Leave every bucket collapsed and switch the computer's network off.
# Expand *Current*.
#* The bucket opens with *no lines and no message*, and stays that way.

!PIC1-offline-no-message.png|width=1000!

For comparison, when the bucket's load fails while the computer is online, the message is shown:

!PIC2-online-failure-shows-message.png|width=1000!

*Actual Result:*
* With the network off, the expanded bucket is empty and shows no message.

*Expected Result:*
* In place of its lines the bucket shows *Something went wrong loading this bucket. Collapse and expand it to try again.*


h2. Environment

* QA site: [https://sv11315.qa.shopview.com|https://sv11315.qa.shopview.com] (build *v26.45.2-6a8b89c*), location *Staging Heavy Duty - 9919*, Admin role, observed 11 Nov 2026 (three tries).
* Report: [A/R Aging Detail|https://sv11315.qa.shopview.com/reports/ar-aging-detail], As of 11/11/2026, all customers.


h2. Sources

* PRD *"A/R and A/P Report Sorting, Export and Location Filter"*, [Confluence page 947650561|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561], *version 11* (5 Nov 2026, Chris Ward), read 10 Nov 2026, Story 4 *Error Handling*:
{quote}If a bucket's lines fail to load when it is expanded, the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again." in place of its lines.{quote}
* The same PRD's messages table: "A bucket fails to load (A/R Detail, A/P Detail) | "Something went wrong loading this bucket. Collapse and expand it to try again." | Inside the bucket, in place of its lines".

h2. Test case

* [C1062582 A/R Detail: a bucket that cannot load its lines says so|https://shopview.testrail.io/index.php?/cases/view/1062582]
```

---
