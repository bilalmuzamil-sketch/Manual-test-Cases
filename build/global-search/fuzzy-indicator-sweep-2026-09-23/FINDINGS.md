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

## Still open at the time of writing

- **The other half of §7** — whether the matched token is *shown and highlighted* at all. On a
  contact match the contact's name is never displayed, so both halves look to fail there; being
  measured (`VISIBILITY.json`).
- **Coverage of fields the first queries never triggered** — service advisor name, part manufacturer,
  state/province, vendor email, created-by user. Targeted pass running (`GAP.json`). Until it
  finishes, the honest claim is **27 pairs this branch's data produced**, not every field in §4.

Nothing has been posted to any ticket.
