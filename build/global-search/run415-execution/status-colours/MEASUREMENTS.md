# Work-order status badge colours — Work Orders list vs search

Measured 17 September 2026 on QA branch **sv9160**, build **v26.36.7-29ca209**, signed in as Admin,
customer **ZZAUTOTEST Fibridge Commercial**. Each status was isolated on the Work Orders list with
its own filter (`/workorders?status=<value>&search=Fibridge+Commercial`), the work order number was
noted, and **that same work order number** was then found in the search's *Work orders* tab. Colours
are the values the product itself applies, not a judgement by eye.

| Status | Work order | Work Orders list — background / text | Search — background / text | Identical? |
|---|---|---|---|---|
| Estimate | S9160-17669 | `229,237,255` / `1,87,155` | `233,245,255` / `23,92,211` | ✗ |
| Approved | S9160-17657 | `224,242,241` / `0,105,92` | `236,253,243` / `8,116,67` | ✗ |
| **In Progress** | S9160-17660 | **`217,251,208` / `81,102,62` — green** | **`255,250,235` / `181,71,8` — orange** | ✗ **different colour** |
| Review | S9160-17662 | `255,239,202` / `188,56,3` | `255,250,235` / `181,71,8` | ✗ |
| Complete | S9160-17667 | `255,239,202` / `188,56,3` | `255,250,235` / `181,71,8` | ✗ |
| **Invoiced** | S9160-17668 | **`rgba(37,176,3,0.08)` / `67,160,71` — green** | **`238,242,246` / `18,25,38` — grey** | ✗ **different colour** |
| Paid | S9160-17661 | `224,242,241` / `0,105,92` | `236,253,243` / `8,116,67` | ✗ |
| **Declined** | S9160-17665 | **`255,224,219` / `184,24,0` — red** | **`255,250,235` / `181,71,8` — orange** | ✗ **different colour** |
| **Imported** | *none exists* | **deep purple** (from the product's own table) | **neutral grey** (same) | ✗ **different colour** |

**Not one of the nine matches.** Four statuses — In Progress, Review, Complete and Declined — land
on the *same* orange in search.

## The two maps, read from the product's own built code

**The rest of the app** (`index.RWYdtdr6.js`, the shared status-colour table): `invoiced` green ·
`paid` teal · `approved` teal · `in_progress` green · `ready_for_review` orange · `complete` orange ·
`declined` red · `imported` deep purple · anything unlisted (including `estimate`) falls through to
the default blue.

**Search** (`Nc` in the same bundle) has **only four tones of its own**:

```
approved:"success"  complete:"warning"  declined:"warning"  estimate:"info"  hold:"warning"
imported:"neutral"  in_progress:"warning"  invoiced:"neutral"  paid:"success"
ready_for_review:"warning"  fulfilled:"success"  partial_delivery:"warning"  pending:"neutral"
requested:"warning"  sent:"info"  special_order:"info"  staged:"info"  waiting_to_receive:"info"
credit:"warning"  partially_paid:"warning" …
```

That table **is** the "palette of its own" the specification forbids (§5.3, Confluence 576978945
version 17, read live 2026-09-17).

## Why Imported could not be seen on screen — Rule 107, routes tried

**Imported work orders are a separate kind of record**, not a regular work order carrying a status:
they have their own list (`work-orders-imported`), their own page (`/imported-work-orders/:id`) and
their own delete route (`work-order-historical/delete`). They arrive by data import.

1. Repo searched first (Rule 97).
2. **Refusal read:** the product exposes *fetch* and *delete* for imported work orders and **no
   create route at all**.
3. **Other surface:** the Status filter offers *Imported* and returns nothing; the status badge on a
   work order's own page is not a control, so a status cannot be set by hand.
4. **Seed:** nothing to seed with — no create route.
5. **Neighbouring feature:** they come from the data-import path, not from anything in the app.
6. **Role / permission:** not the obstacle; the same account reads the other eight.
7. **Instrument proved:** the same filter and the same search return all eight other statuses, and
   `work-orders-imported` answers 200 with an empty list — so the route works and the branch is
   genuinely empty.

Both Imported colours are therefore taken from the product's own tables above, and are labelled as
such in the ticket. **Ask the QA lead whether an imported work order can be put on the branch** if a
screen-level confirmation is wanted.

## Pictures

`badge-grid.png` — the raw eight-row comparison. The annotated version filed on the ticket is
`../tickets/C44838-all-statuses.png`.
