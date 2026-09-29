# Search Results Integrity — the All tab and everything that spans tabs

Local ids `SRI-ALL-*`. **Files, not TestRail cases** — the creation hold (Rule 62) is in force.

Every Expected Result below is a verbatim quote from `SOURCES.md` (Rule 113). Where the source is
silent the case is HELD and carries a PO question id; it never invents an expectation.

---

## Class E — do not lie to me about how many there are

### SRI-ALL-E1 — A tab's count equals the number of rows that tab shows

**Why an end user cares:** if the tab says 8 and shows 5, I will stop looking and miss the record.

**Preconditions**

1. A query exists that returns more than 5 but fewer than 20 records of one entity type.

**Steps**

1. Open global search and type that query.
2. Read the count on that entity's tab.
3. Open that tab and count the rows.

**Expected result — the source's own words, quoted (Rule 113)**

> The scoped tab shows **up to 20 rows**, scrolled within the modal — there is no pagination and no
> further loading, and no `Show all` link inside the tab.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** the number on the tab and the number of rows
inside it agree, up to the cap of 20.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-E2 — No count anywhere reads higher than 20

**Why an end user cares:** a count I cannot reach is a promise the product does not keep.

**Preconditions**

1. A query exists that matches more than 20 records of a single entity type. (Seeded: `ZZBROAD`
   matches 22 parts — see `build/global-search/seeding/`.)

**Steps**

1. Open global search and type that query.
2. Read the entity's tab count, the group header count on the All tab, and the `Show all N` link.

**Expected result — the source's own words, quoted (Rule 113)**

> **Counts are capped at 20.** No count in the modal reads higher than `20` — not a tab, not a group
> header, not the `Show all N` link. A query matching 34 work orders shows `Work Orders (20)` and
> `Show all 20`. Twenty is both what search returns per entity type and what it reports.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** all three numbers read 20, never the true
total.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-E3 — A group on the All tab shows 5 and offers the rest

**Why an end user cares:** five is a sample; I need to know a sample is what I am looking at.

**Preconditions**

1. A query returns more than 5 records of one entity type.

**Steps**

1. Open global search and type that query.
2. Stay on the **All** tab and count the rows under that entity's group heading.
3. Look to the right of the group heading.

**Expected result — the source's own words, quoted (Rule 113)**

> Each group shows up to **5** results (raised from today's 3). When a group has more, a
> `Show all N` link appears to the right of the group header.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** exactly 5 rows, and a `Show all N` link.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-E4 — `Show all N` opens that entity's tab and stays in the modal

**Why an end user cares:** losing the modal loses my query and my place.

**Preconditions**

1. A query returns more than 5 records of one entity type.

**Steps**

1. Open global search, type that query, and click `Show all N`.

**Expected result — the source's own words, quoted (Rule 113)**

> Clicking it switches the modal to that entity's scope tab. The user never leaves the modal: there
> is no separate search results page and no handoff of the query to the entity's list page.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** you land on that tab, inside the same modal,
with the query intact.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-E5 — The nine tabs are present and named as specified

**Why an end user cares:** a missing tab is an entity I will never think to look for.

**Preconditions**

1. Any query that returns at least one result.

**Steps**

1. Open global search and type the query.
2. Read the tab strip left to right, scrolling it horizontally.

**Expected result — the source's own words, quoted (Rule 113)**

> A horizontal tab strip immediately under the input: `All · Work Orders · Customers · Assets ·
> Parts · Vendors · Part Sales · Purchase Orders · Vendor Invoices`. Each tab carries its result
> count, e.g. `All (12)`, `Work Orders (8)`.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** all nine, in that order, each with a count.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-E6 — Group order on the All tab is the specified order

**Why an end user cares:** a stable order is what lets me scan without reading.

**Preconditions**

1. A query returns results in at least four different entity types.

**Steps**

1. Open global search, type the query, stay on **All**, and read the group headings top to bottom.

**Expected result — the source's own words, quoted (Rule 113)**

> Group display order in "All" is: Work Orders → Customers → Assets → Parts → Vendors → Part Sales →
> Purchase Orders → Vendor Invoices.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §6.2*

**In plain words (our restatement — NOT the source):** that order every time, with absent types
simply skipped.

**Provenance.** Expected behaviour from the PRD v1.5 §6.2.

AUTOMATION: READY

---

### SRI-ALL-E7 — An exact identifier match is pinned above the groups

**Why an end user cares:** if I typed a work order number I want that work order, not a list.

**Preconditions**

1. A record exists whose identifier you can type in full (for example a work order number).

**Steps**

1. Open global search and type that identifier in full.
2. Look above the first group heading.

**Expected result — the source's own words, quoted (Rule 113)**

> When the top result across all groups has a score > 0.95 (effectively an ID match), it is pinned
> as a separate single row at the very top, above the groups, labeled by its entity icon — the "if
> you typed `S2-15276`, jump straight to that WO" experience.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §6.2*

**In plain words (our restatement — NOT the source):** the record you named sits alone at the top.

**Provenance.** Expected behaviour from the PRD v1.5 §6.2.

AUTOMATION: READY

---

## Class F — accept it the way it is written down

### SRI-ALL-F1 — An identifier is found with and without its punctuation

**Why an end user cares:** I type what is printed on the paper in front of me, dashes and all.

**Preconditions**

1. A record exists with a punctuated identifier (for example work order `S2-15276`).

**Steps**

1. Search the identifier exactly as printed, including punctuation.
2. Search it again with all punctuation removed.
3. Compare the two result lists.

**Expected result — the source's own words, quoted (Rule 113)**

> Lowercase; strip diacritics; collapse whitespace; for identifier fields (WO number, part number,
> VIN, phone) also strip non-alphanumerics so `S2-15276` and `s215276` match, and `(264) 328-6723`
> and `2643286723` match. For names, keep spaces but treat hyphens and apostrophes as optional.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §7*

**In plain words (our restatement — NOT the source):** both spellings find the same record.

**Provenance.** Expected behaviour from the PRD v1.5 §7.

AUTOMATION: READY

---

### SRI-ALL-F2 — A phone number is found however it is punctuated

**Why an end user cares:** the number on my screen has brackets; the number in my head does not.

**Preconditions**

1. A customer or vendor exists with a punctuated telephone number.

**Steps**

1. Search the number as displayed, with brackets and dashes.
2. Search the same digits with no punctuation at all.
3. Search only the last four digits.

**Expected result — the source's own words, quoted (Rule 113)**

> …for identifier fields (WO number, part number, VIN, phone) also strip non-alphanumerics so
> `S2-15276` and `s215276` match, and `(264) 328-6723` and `2643286723` match.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §7*

**In plain words (our restatement — NOT the source):** the first two find the same record. The
last-four-digits search is a partial, not a normalization case — record what it returns and whether
you can tell the results apart (that is `SRI-CUST-B1`).

**Provenance.** Expected behaviour from the PRD v1.5 §7.

AUTOMATION: READY

---

### SRI-ALL-F3 — An accented name is found typed either way

**Why an end user cares:** nobody types the accent.

**Preconditions**

1. A customer exists whose name carries a diacritic. (Seeded: the `ZZACC` records.)

**Steps**

1. Search the name with its accents.
2. Search it without.

**Expected result — the source's own words, quoted (Rule 113)**

> Lowercase; strip diacritics; collapse whitespace…

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §7*

**In plain words (our restatement — NOT the source):** both spellings return the same one record.

**Provenance.** Expected behaviour from the PRD v1.5 §7.

AUTOMATION: READY

---

### SRI-ALL-F4 — A hyphen or apostrophe in a name is optional

**Why an end user cares:** "O'Brien" and "OBrien" are the same person to everyone but a computer.

**Preconditions**

1. A customer exists whose name contains an apostrophe, and one with a hyphen. (Seeded: `ZZPUNC`.)

**Steps**

1. Search each name with the punctuation.
2. Search each name without it.

**Expected result — the source's own words, quoted (Rule 113)**

> For names, keep spaces but treat hyphens and apostrophes as optional.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §7*

**In plain words (our restatement — NOT the source):** both spellings find the record.

**Provenance.** Expected behaviour from the PRD v1.5 §7.

AUTOMATION: READY

---

### SRI-ALL-F5 — A typo in an identifier is NOT silently corrected

**Why an end user cares:** a wrong VIN is a wrong truck. I would rather see nothing than the
wrong vehicle presented as a match.

**Preconditions**

1. A record exists with a VIN or a work order number.

**Steps**

1. Search that identifier with one character changed.
2. Read the result list.

**Expected result — the source's own words, quoted (Rule 113)**

> Exact identifier fields — VIN, WO number, P-number, part number, PO number, invoice number —
> bypass fuzzy logic and require exact match after normalization. A typo in a VIN is almost always a
> wrong VIN, not a typo, and fuzzy matching here would surface confusing results.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §7*

**In plain words (our restatement — NOT the source):** the near-miss identifier does not return the
record. If it does, that is a fail — and note it carefully, because a fuzzy identifier match is the
most dangerous result the search can produce.

**Provenance.** Expected behaviour from the PRD v1.5 §7.

AUTOMATION: READY

---

### SRI-ALL-F6 — Typing a status name returns nothing

**Why an end user cares:** status words are common English. If they match, every search for a part
called "Complete Kit" drags in every complete work order.

**Preconditions**

1. Records exist in several statuses.

**Steps**

1. Search a status word — `Approved`, `Invoiced`, `Unpaid`, `Ordered`.
2. Read what comes back.

**Expected result — the source's own words, quoted (Rule 113)**

> Some fields — notably **status** — are stored on the search document for ranking (§6.1) and for the
> row badge, but are deliberately **not matchable**: typing a status name does not return records
> carrying that status.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §4*

**In plain words (our restatement — NOT the source):** nothing comes back *because of its status*.
Records whose name genuinely contains the word are fine — check each hit and say which is which.

**Provenance.** Expected behaviour from the PRD v1.5 §4.

AUTOMATION: READY

---

## Class G — do not fall over on ordinary but awkward data

### SRI-ALL-G1 — A record with empty optional fields still renders a usable row

**Why an end user cares:** real data has holes. A row that collapses when a field is blank hides a
real record.

**Preconditions**

1. A work order exists whose asset has **no unit number**.
2. An asset exists with no year, make or model.

**Steps**

1. Search for each record.
2. Read the row.

**Expected result — the source's own words, quoted (Rule 113)**

> When the asset has no unit number, the year/make/model stands alone.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §4 — Work Orders*

**In plain words (our restatement — NOT the source):** the row still identifies the record, with no
blank gaps, stray separators or "undefined".

**Provenance.** Expected behaviour from the PRD v1.5 §4. The asset-with-no-year case is NOT covered
by the quote — record what you see and raise it (PO question Q9).

AUTOMATION: HOLD - the asset-with-no-year half has no source sentence yet

---

### SRI-ALL-G2 — A very long value does not push the rest of the row out of sight

**Why an end user cares:** one customer with a 90-character name must not make every other row
unreadable.

**Preconditions**

1. A record exists with an unusually long name or description.

**Steps**

1. Search for it.
2. Read the whole row — the badge, the status, the second line.

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle, which
> is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story)*

**In plain words (our restatement — NOT the source):** the badge and the second line are still
readable. Record anything that is pushed off, and what it was.

**Provenance.** Governing expectation from SV-9170.

AUTOMATION: READY

---

### SRI-ALL-G3 — A search term that is also a common word stays usable

**Why an end user cares:** parts are called "Kit", "Filter", "Seal". If a common word returns 20
near-identical rows, the tab is dead weight.

**Preconditions**

1. A common word appears in many part descriptions.

**Steps**

1. Search that word.
2. Open the Parts tab and try to find one specific part you know exists.

**Expected result — the source's own words, quoted (Rule 113)**

> Because search returns at most 20 records per entity type (§5.2), ranking quality is what decides
> whether the record the user wanted is reachable at all.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §6.1*

**In plain words (our restatement — NOT the source):** the record you wanted is inside the 20, and
the rows are different enough from one another to pick from. If it is not reachable, say which
record and what you typed.

**Provenance.** Expected behaviour from the PRD v1.5 §6.1.

AUTOMATION: READY

---

### SRI-ALL-G4 — A query of one or two characters behaves sanely

**Why an end user cares:** everybody types one character on the way to typing six.

**Preconditions**

1. None.

**Steps**

1. Open global search and type a single character. Wait.
2. Add a second character. Wait.
3. Note what is shown at each step.

**Expected result — the source's own words, quoted (Rule 113)**

> …debounce input at 150ms…

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §8*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** v1 of the product filtered queries under two
characters; the v2 PRD states a debounce but sets **no minimum query length**. What a one-character
query should do is therefore unstated — PO question Q10. Record what happens; do not judge it.

**In plain words (our restatement — NOT the source):** whatever it does, it must not error, must not
hang, and must not leave a stale result list from the previous keystroke.

**Provenance.** Governing expectation from SV-9170; minimum query length is unstated in PRD v1.5.

AUTOMATION: HOLD - no source sentence for the expected outcome

---

### SRI-ALL-G5 — An entity type with no records at all does not break the search

**Why an end user cares:** a new shop has no part sales yet. Search must still work.

**Preconditions**

1. An organisation/workplace where at least one entity type has zero records.

**Steps**

1. Search a term that returns results in other types.
2. Read the tab strip and the group list.

**Expected result — the source's own words, quoted (Rule 113)**

> Search must work for a single-tenant dataset where any entity type is empty (e.g. a shop with no
> part sales yet).

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §9*

**In plain words (our restatement — NOT the source):** the search works normally and the empty type
simply does not appear.

**Provenance.** Expected behaviour from the PRD v1.5 §9.

AUTOMATION: READY

---

## Class H — say "nothing found" honestly

### SRI-ALL-H1 — No results shows the query back, and nothing else

**Why an end user cares:** seeing my own typo is how I realise it was a typo.

**Preconditions**

1. A string that matches nothing. (Use a keyword that cannot collide, e.g. `Zqwxpol`.)

**Steps**

1. Open global search and type it.

**Expected result — the source's own words, quoted (Rule 113)**

> "No results for '\<query\>'" — plus " in \<Tab\>" when a scope tab other than All is active.
> Nothing else.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** that sentence with your query in it, and no
suggestions, buttons or tips.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-H2 — No results inside a tab names the tab

**Why an end user cares:** "no results" when there ARE results on another tab would send me away for
nothing.

**Preconditions**

1. A query that returns results in one entity type only.

**Steps**

1. Search it.
2. Open a tab that has no results for this query.

**Expected result — the source's own words, quoted (Rule 113)**

> "No results for '\<query\>'" — plus " in \<Tab\>" when a scope tab other than All is active.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §5.2*

**In plain words (our restatement — NOT the source):** the message names the tab you are on, so you
know the search is scoped and not empty everywhere.

**Provenance.** Expected behaviour from the PRD v1.5 §5.2.

AUTOMATION: READY

---

### SRI-ALL-H3 — A "no results" is never shown for a record the user can see elsewhere

**Why an end user cares:** this is the worst possible outcome — the record exists, I can open it from
its list page, and search says it does not exist.

**Preconditions**

1. Pick a record you can open from its own list page.
2. Note a value from one of the fields PRD §4 lists as indexed for that entity.

**Steps**

1. Search that value.
2. If nothing comes back, confirm the record still opens from its list page.
3. Then search a DIFFERENT field of the SAME record as a control.

**Expected result — the source's own words, quoted (Rule 113)**

> The indexed fields are what a typed query is matched against…

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §4*

**In plain words (our restatement — NOT the source):** a value in an indexed field finds its record.
**The control in step 3 is mandatory** — without it you cannot tell "this field is not searchable"
from "the search is down" (Rule 110).

**Provenance.** Expected behaviour from the PRD v1.5 §4.

AUTOMATION: READY

---

## Class K — results I am not allowed to see must not appear

### SRI-ALL-K1 — A role without access to an entity type sees no tab and no rows for it

**Why an end user cares:** a technician seeing finance rows is a data leak, not a search bug.

**Preconditions**

1. A role exists without Parts access, and another without Purchase Order / Vendor Invoice access.
   (Seeded: the seven `ZZAUTOTEST No …` roles — see `build/global-search/seeding/`.)
2. A query is known to return records of that type for an unrestricted user.

**Steps**

1. Sign in as the unrestricted user, search, and note the rows.
2. Sign in as the restricted role and run the identical search.
3. Compare — the SAME query, the SAME records.

**Expected result — the source's own words, quoted (Rule 113)**

> All result fields must respect existing tenant-isolation and role-based-access checks — a
> technician without Parts access does not see Parts results, and the same applies to Purchase
> Orders and Vendor Invoices, which are finance-adjacent and more likely to be restricted.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), §9*

**In plain words (our restatement — NOT the source):** the restricted user sees none of those rows,
no tab for them, and no count. Check the COUNT as well as the rows — a count that still reads the
unrestricted total leaks how much exists.

**Provenance.** Expected behaviour from the PRD v1.5 §9. Overlaps the existing permission suite
(C55731–C55737) — run those first; this case exists so the count leak is checked, which they do not
cover.

AUTOMATION: READY

---
