# Does every fuzzy match carry the indicator? — sweep of 23 September 2026

Asked for by the QA lead, on top of **SV-10346** (which he raised himself on 22 Sep and which covers
**customer contacts only**): *"see if fuzzy matching for everything in this whole global search
results does show the fuzzy matching sign/icon wherever there is a fuzzy match besides what has
already been reported in this ticket … if that goes with the specs."*

Build `v26.36.8-fa74ea8`, QA branch `sv9160`.

## The requirement, verbatim (page 576978945 v17, §7 Highlighting, read live 22 Sep)

> When a match is fuzzy rather than exact, the matched token in the row is still highlighted, and a
> subtle ≈ or italicized treatment indicates the soft match.

It is unqualified — it applies to **any** fuzzy match. Note it has **two halves**: the matched token
is highlighted, **and** the soft match is indicated. §7 also rules identifier fields out of fuzzy
matching entirely (*"VIN, WO number, P-number, part number, PO number, invoice number … bypass fuzzy
logic"*), so those are correctly outside this check.

## Method

Not a spot-check. Ground truth is the product's own answer — each row comes back with
`match: {field, kind, highlight}` — so `kind === "fuzzy"` says which rows *must* carry the mark,
and the row's own text says whether it does.

1. **Discovery** (`DISCOVERY.json`) — 30 misspelled queries across the estate, to find every
   `(entity, matched field)` pair that can come back fuzzy at all. **27 pairs.**
2. **Sweep** (`SWEEP.json`) — 11 queries chosen to cover all 27, reading each scope tab and pairing
   the screen's rows with the product's answer **by index**. Where the two lists differed in length
   the group was **skipped, not guessed**.

## Result — 25 of 27 carry it, 2 do not

| Carries the indicator | |
|---|---|
| Assets | customer name · make · model |
| Customers | name · address line 1 · city |
| Vendors | name · address line 1 · city |
| Parts | description · category · tags · vendor name |
| Work orders | customer name · asset make · asset model · lead technician name · item part names · line texts |
| Part sales | customer name · asset description |
| Purchase orders | vendor name · item part names · ordered-by name |
| Vendor invoices | vendor name |

| Does NOT carry it | rows seen | reported? |
|---|---|---|
| **Customers — contact_names** | 18 fuzzy rows, **0 marked** | yes — **SV-10346** |
| **Vendors — contact_names** | 11 fuzzy rows, **0 marked** | **NO — not in the ticket** |

## What this changes about the finding

**The fault is not "contacts on customers". It is contact names wherever they are indexed**, and §4
indexes them on **both** customers and vendors:

> Customers. Indexed: … plus the names, telephone numbers and email addresses of the customer's contacts.
> Vendors. Indexed: … plus the names, telephone numbers and email addresses of the vendor's contacts.

SV-10346 is written specifically around customers — its title, its steps and its expected result all
say Customer. **A developer implementing exactly what it asks could leave the vendor side untouched.**

Everything else in global search is consistent. That is worth saying plainly on the ticket: this is a
single gap in one field type, not a scattered problem.

## COMPLETE — every tab, every indexed field (finished 23 September)

The sweep was then driven off **§4's own indexed-field list for all eight tabs**, not off hand-written
queries: for each field a real value was harvested from the branch, misspelled by transposing two
letters, and the product asked what it matched on. A field counts as covered only when the product
actually reported a near-spelling match against it.

**30 combinations reached in total across both runs. 28 correct, 2 wrong.**

| Tab | Field | Can go fuzzy? | Carries the mark |
|---|---|---|---|
| **Work orders** | customer name | yes | ✅ |
| | asset make | yes | ✅ |
| | asset model | yes | ✅ |
| | lead technician name | yes | ✅ |
| | line item descriptions (line texts) | yes | ✅ |
| | line item descriptions (part names) | yes | ✅ |
| | job number, VIN | **no — identifier, §7** | n/a |
| | asset year, unit number, service advisor | never produced one on this branch | not reached |
| **Customers** | name | yes | ✅ |
| | address line 1 | yes | ✅ |
| | address line 2 | yes | ✅ |
| | city | yes | ✅ |
| | **contact names** | yes | ❌ **NO MARK** |
| | telephone, contact telephone, contact email, state/province | never produced one | not reached |
| **Assets** | make · model · owning customer name | yes | ✅ ✅ ✅ |
| | VIN | **no — identifier** | n/a |
| | year, unit number | never produced one | not reached |
| **Parts** | description · tags · category · manufacturer · vendor name | yes | ✅ ×5 |
| | part number | **no — identifier** | n/a |
| | bin location | never produced one | not reached |
| **Vendors** | name · address line 1 · address line 2 · city | yes | ✅ ×4 |
| | **contact names** | yes | ❌ **NO MARK** |
| | telephone, email, contact telephone, contact email | never produced one | not reached |
| **Part sales** | customer name · asset description | yes | ✅ ✅ |
| | P-number, VIN | **no — identifier** | n/a |
| **Purchase orders** | vendor name · item part names · ordered-by name | yes | ✅ ✅ ✅ |
| | PO number, part numbers | **no — identifier** | n/a |
| **Vendor invoices** | vendor name | yes | ✅ |
| | invoice number, PO number | **no — identifier** | n/a |

### The other half of the requirement fails in the same two places

§7 asks for two things: the matched token is **highlighted**, *and* a ≈ **indicates** the soft match.
Measured on every combination:

- **28 of 30** — the text that matched is present in the row **and** carries the mark.
- **The 2 contact-name ones — the matched text is not in the row at all.** Searching `Petersn`
  returns *Schwartz's Diesel Repair* because its contact is **Sandra Peterson**; the row shows only
  `Contact match` and never the name. So both halves fail, not just the indicator.

### The two failures, exactly

| Combination | fuzzy rows seen | marked | matched text shown | reported? |
|---|---|---|---|---|
| Customers — contact names | 18 | **0** | **0** | yes — **SV-10346** |
| **Vendors — contact names** | 11 | **0** | **0** | **NO** |

### What this means for the ticket

**The fault is contact names wherever they are indexed, and §4 indexes them on both customers and
vendors.** SV-10346's title, steps and expected result all say *Customer*. A developer implementing
exactly what it asks could fix the customer side and leave the vendor side untouched. The ticket
should be widened to both, and should name the second half too — the contact's name is never shown,
so there is nothing to highlight.

Everything else in global search is consistent. This is one gap in one field type, not a scattered
problem — worth saying plainly, because it makes the fix small and checkable.

### Not reached, and honestly so (Rule 12)

Telephone numbers, email addresses, bin location, asset year, unit number and state/province never
produced a near-spelling match with this branch's data. That may be correct — numbers and addresses
behave like identifiers — but it is **not proved either way here**, and is recorded as not reached
rather than counted as passing.

### Evidence

`DISCOVERY.json` · `SWEEP.json` (first pass) · `FIELD-MATRIX.json` (per-field harvest and probe) ·
`FINAL.json` (mark + visibility) · `UNION.json` (both runs combined, 30 combinations).
Build `v26.36.8-fa74ea8`. Nothing posted to any ticket.
