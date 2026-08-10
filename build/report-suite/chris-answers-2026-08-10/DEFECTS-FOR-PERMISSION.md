# Defects and findings this ingest revealed — AWAITING PERMISSION TO FILE

**NO JIRA TICKET WAS CREATED. NO JIRA FIELD WAS EDITED. Jira was not written to at all in this pass.**

Per the QA lead's rule of today: **no Jira ticket may be created without his explicit permission**,
however real and well-sourced the defect. Everything below is therefore a **recommendation**, with its
source quoted, waiting on his word.

**Nothing here is a product bug found in the running application** — the application was deliberately
not opened (Rule 58). These are **defects in the documents** plus **one contradiction in someone else's
test case**. That distinction matters: none of them can be verified or refuted from the build today, and
none needs to be.

---

## 1 · Sales By Customer v16 describes a journey its own ratified rule forbids

**Recommendation: NO TICKET. Ask Chris to tidy the sentence — already drafted as Q4.**

**The evidence, both sentences live in the same current version (v16, read 2026-08-10):**

> **S9-R1a:** *"The invoice number is rendered as a link **only when** the user has permission to open
> the target it links to (the work order or parts sale); a user without that permission sees the invoice
> number as **plain text**."*
>
> **S9-N2:** *"If the user lacks permission to open the destination invoice, the destination page shows
> the application's standard access-denied state; the user can press back to return to the report."*

**Chris's answer of 2026-08-10 (`A`) chooses S9-R1a.** S9-N2 therefore describes a journey that cannot
be reached, because there is no link to press.

**Why no ticket.** This is an editorial leftover in a document its own author maintains, not a product
fault. It is one sentence and he can delete it. Raising a ticket would be heavier than the problem.
**Consequence if left:** a tester reading S9-N2 hunts for a link that should not exist and raises a
fault against correct behaviour. **Affected case: SBC-PERM-04 = C30100**
(https://shopview.testrail.io/index.php?/cases/view/30100), whose premise this voids.

---

## 2 · Two specifications still state the Location rule both ways

**Recommendation: NO TICKET. Ask Chris — drafted as Q3.**

The 2026-08-06 tidy-up corrected the numbered requirement in each, but not the earlier prose.

**Inventory Value v5:**
> **S7-R6 (corrected):** *"…shown to any user with **access to** more than one location: it appears by
> default and can be toggled on or off…"*
> **S3-R1 (leftover):** *"**When the report is scoped to more than one location**, a Location column is
> inserted between Vendor and Qty on Hand; **it is hidden for a single-location scope**."*
> **§4 Terminology (leftover):** *"…**shown only when the current scope spans more than one
> location**…"*

**Sales By Representative v18:**
> **S21-R7 (corrected):** *"…shown to any user with **access to** more than one location: it appears by
> default and can be toggled on or off…"*
> **§3 Key Decisions (leftover):** *"A Location column is **shown only when the current view spans more
> than one location**; when the view is scoped to a single location the column is hidden…"*
> **§4 Terminology (leftover):** *"…displayed **only when the current view spans more than one
> location**…"*

**Neither report is one of the three handed off**, so neither blocks the priority work. **Chris's
answer settles which side is right**, so our cases can be corrected without waiting.

---

## 3 · Sales By Representative v18 still says "A4 portrait" and still uses "Sales Rep"

**Recommendation: NO TICKET — these are edits Chris has ALREADY AGREED to make today.**

Two of his own answers commit him to spec changes that had not reached the page when we read it at
2026-08-10T15:16Z:

| His answer | What the spec still says |
|---|---|
| Tab 2 item 4 = **A** (A4 landscape, *"and please correct the … description to say landscape"*) | **S14-R3:** *"…in **A4 portrait**, edge-to-edge…"* |
| Tab 2 item 5 = **A** (full word everywhere) | **"Sales Rep" appears 27 times**; the only quoted `"Representative"` is a change-log line about the download heading |

Also still outstanding from the same sheet: **S12-R1** and **S12-R3** state flatly that every invoice
number and customer name is a clickable link, which his item-3 answer (`A`) commits to qualifying.

**No ticket is warranted** — he answered "yes" to all three today. **These are tracked as owed spec
edits, not defects**, and belong in the outstanding-items register.

---

## 4 · A foreign test case now contradicts the ratified Location rule

**Recommendation: DO NOT TOUCH IT. Report to the QA lead and let him and the author decide (Rule 38).**

**C38920** — https://shopview.testrail.io/index.php?/cases/view/38920 — authored by **Vladimir Tomovic**
(user id 1), section *"PV — Row Model"*, titled:

> *"PV Location column is **scope-governed** — hidden at one location, Multiple…"*

**That asserts the model Chris rejected today.** His answer `A` makes the column **access-governed**, and
Parts Velocity **v6** now states the access model in its numbered requirement.

**Under Rule 39 both sides' bases go on the table.** **Ours:** Chris's answer of 2026-08-10 plus PV v6.
**His:** almost certainly the **older** Parts Velocity text — the scope model was the documented rule
until the 2026-08-05/06 edits, so this looks like a case written correctly against a spec that has since
moved, **not** an error by its author. **We do not edit it, and we do not ask him to withdraw it** — it
goes to the QA lead with both bases stated.

**Also worth flagging:** the foreign-case count under group 4281 has grown **from 5 to 9** since
2026-08-06 — new: **C43567**, **C43568** (Parts Velocity), **C43572** (Work In Progress), **C43573**
(Inventory Value). **C43572 sits in a handed-off report** (*"Work In Progress appends pages on scroll
while the server summary stays…"*) and describes scroll-paging that the Work In Progress specification
does not mention. **Not investigated, not touched** — recorded so the QA lead knows the neighbouring
suite is moving.

---

## 5 · Nothing else

No other defect surfaced. In particular:

- **No API-only finding arose**, so Rule 51's separate ask is **not** triggered.
- **No product bug is claimed**, because the product was not opened.
- **No `delete_case` is proposed anywhere.** The one case whose premise is voided (C30100) is proposed
  for **re-derivation**, and whether it is re-scoped or retired is explicitly left to the QA lead —
  deletion is irreversible and nothing here earns it.

---

## Summary

| # | Finding | Source | Recommendation |
|---|---|---|---|
| 1 | Sales By Customer v16 keeps a dead access-denied path (S9-N2) | spec, quoted | **No ticket** — Chris tidy-up, Q4 |
| 2 | Inventory Value v5 and Sales By Representative v18 state the Location rule both ways | spec, quoted | **No ticket** — Chris tidy-up, Q3 |
| 3 | Sales By Representative v18 not yet updated for landscape / "Representative" / link rule | his own answers today | **No ticket** — owed spec edits |
| 4 | Vladimir Tomovic's C38920 asserts the overturned scope model | TestRail, read-only | **No ticket, no edit** — QA lead + author |

**Zero tickets filed. Zero Jira writes. Awaiting the QA lead's word on all four.**
