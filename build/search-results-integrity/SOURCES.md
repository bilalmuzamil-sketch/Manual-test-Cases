# Sources for the Search Results Integrity suite — pinned, with the sentences we quote

**Rule 113:** an Expected Result is the source's own sentence, quoted verbatim, and it changes only
when the SOURCE changes. This file is where those sentences live, so every case can cite one place
and so a source version bump is a single edit here.

**Rule 31/32/59:** currency was established on **2026-09-29**. Re-check before the next authoring
pass — a quote carried forward without re-checking its version is a Rule 113 violation.

---

## S1 · Global Search — Product Requirements

| | |
|---|---|
| **Version** | **1.5** |
| **Last updated** | 2026-09-08 |
| **Author of v1.5** | Milos Vasic |
| **Page** | `576978945` |
| **URL** | https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements |
| **Status on the page** | COMPLETE |

### S1-a · §5.3 Result row anatomy — the highlighting sentence

> "Every row has a left-side entity icon, a primary line (bold), a secondary line (subdued), and an
> optional right-side cluster (status badges, counts, and quick-action buttons on hover). The matched
> substring of the query is highlighted in the primary and secondary text — searching `Fib`
> highlights "Fib" in "S1-644 Fibridge Commercial"."

**This is the sentence SV-10619 and SV-10551 violate.** Read it precisely: the row shows the text,
and *within that text* the matched substring is highlighted. The worked example is decisive — the
query was `Fib` and what the row shows is the **whole** value `S1-644 Fibridge Commercial`, not the
three matched characters. Highlighting is a treatment applied to displayed text; it is not a licence
to display only the matched part.

### S1-b · §4 Scope: Entities & Indexed Fields — the opening rule

> "The following eight entities are searchable. The indexed fields are what a typed query is matched
> against; the displayed fields drive the result row UI. Some fields — notably **status** — are
> stored on the search document for ranking (§6.1) and for the row badge, but are deliberately **not
> matchable**: typing a status name does not return records carrying that status."

### S1-c · §4 — the per-entity Displayed lists (quoted per entity in the case files)

- **Work Orders.** "Displayed: WO number + customer name (primary), status badge, **unit number +
  year/make/model**. When the asset has no unit number, the year/make/model stands alone."
- **Customers.** "Displayed: customer name (primary), address line, open WO count badge (e.g. `12`),
  telephone on hover."
- **Assets (Vehicles).** "Displayed: year + make + model (primary), customer name (secondary,
  smaller)."
- **Parts (Inventory).** "Displayed: description (primary), part number (secondary), total quantity
  with a stock-status badge (see §5.3)."
- **Vendors.** "Displayed: vendor name (primary), telephone + address line (secondary)."
- **Part Sales.** "Displayed: P-number + customer (primary), status badge, total price + created
  date."
- **Purchase Orders.** "Displayed: PO number + vendor (primary), status badge (Ordered / Received),
  total + created date."
- **Vendor Invoices.** "Displayed: invoice number + vendor (primary), status badge (Paid / Unpaid),
  total + invoice date."

### S1-d · §4 Contact-field matches

> "When a customer or vendor matches on a contact field (phone, email, contact name) rather than its
> own name, its secondary line shows "Contact match" — preserving the helpful affordance already
> present in today's search."

### S1-e · §7 Highlighting (fuzzy)

> "When a match is fuzzy rather than exact, the matched token in the row is still highlighted, and a
> subtle `≈` or italicized treatment indicates the soft match."

### S1-f · §7 Normalization

> "Lowercase; strip diacritics; collapse whitespace; for identifier fields (WO number, part number,
> VIN, phone) also strip non-alphanumerics so `S2-15276` and `s215276` match, and `(264) 328-6723`
> and `2643286723` match. For names, keep spaces but treat hyphens and apostrophes as optional."

### S1-g · §7 What is not fuzzy

> "Exact identifier fields — VIN, WO number, P-number, part number, PO number, invoice number —
> bypass fuzzy logic and require exact match after normalization."

### S1-h · §5.2 Counts

> "**Counts are capped at 20.** No count in the modal reads higher than `20` — not a tab, not a group
> header, not the `Show all N` link. A query matching 34 work orders shows `Work Orders (20)` and
> `Show all 20`. Twenty is both what search returns per entity type and what it reports."

> "Each group shows up to **5** results (raised from today's 3). When a group has more, a
> `Show all N` link appears to the right of the group header."

### S1-i · §5.2 No results

> "\"No results for '\<query\>'\" — plus \" in \<Tab\>\" when a scope tab other than All is active.
> Nothing else."

### S1-j · §5.2 The tab strip

> "A horizontal tab strip immediately under the input:
> `All · Work Orders · Customers · Assets · Parts · Vendors · Part Sales · Purchase Orders · Vendor
> Invoices`. Each tab carries its result count, e.g. `All (12)`, `Work Orders (8)`."

### S1-k · §9 Access

> "All result fields must respect existing tenant-isolation and role-based-access checks — a
> technician without Parts access does not see Parts results, and the same applies to Purchase Orders
> and Vendor Invoices, which are finance-adjacent and more likely to be restricted."

---

## S2 · SV-9170 — the parent story of both reported defects

**URL:** https://shopview.atlassian.net/browse/SV-9170
**Title:** "FE — Entity result rows: shared base row, nine variants, badges and match highlighting"
**Status:** QA Complete · **Parent epic:** SV-9160

> "Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle, which is
> what tells two of the same customer's work orders apart."

**This is the governing sentence for the whole suite.** It states the end-user purpose of a result
row in the product's own words: *pick the right record without opening it*, and *tell two similar
records apart*. Every scenario in this folder is a way that purpose fails.

---

## S3 · The two reported defects

| Ticket | Title | Status | Parent |
|---|---|---|---|
| [SV-10619](https://shopview.atlassian.net/browse/SV-10619) | "Some search results show \"....\" for the match instead of the full match." | Open | SV-9170 |
| [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | "Not providing the complete Unit number it is matching with." | Open | SV-9170 |

**SV-10619, reported steps, verbatim:** "Type 965 in the search result. Under Customers → Observe the
results for the 5th row. I shows **9…** instead of full match."

**SV-10551, verbatim:** "Not providing the complete Unit number it is matching with. Complete nit
number is: **Unit:** 38-0123"

**SV-10551 carries a live disagreement that this suite must not paper over.** Sinisa Nogic asked, on
the ticket: *"please check with the PMs first whether this is according to the specification or
not."* The check has now been done and is recorded in `PO-QUESTIONS.md` — §5.3 requires the matched
substring to be highlighted **in the primary and secondary text**, so where the matched value is
part of that text the ticket is supported by the spec. Where the matched field is **not** in the
displayed set at all, the spec is silent, and that silence is a PO question, not something we
resolve by looking at the build (Rule 58).
