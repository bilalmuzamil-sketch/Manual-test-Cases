# SV-10161 split into SV-10277 (2026-09-20)

QA lead's instruction: *"the results related to this fix can stay in the comment of this ticket and
the things now broken and not working as per the specs should be created a followup ticket with more
examples and more easier to understand scenarios for everyone … the old ticket should have a
reference of the new ticket created for what is now broken and the new ticket should have a reference
at the top before the line break as to where this ticket is being splitted from."*

| | |
|---|---|
| **New ticket** | **SV-10277** — *Search Ranking No Longer Uses Stock, Recent Use or Match Strength* |
| Type / priority / parent | `Story Defect` · `Medium` · **SV-9165** (status read live: **TESTING QA**, so Rule 112 is satisfied) |
| Links | `relates to` SV-9165 · `relates to` SV-10161 |
| First line, above the `----` | *"Split from SV-10161. The fix on that ticket works and should stay. This ticket covers what stopped working as a result of it."* |
| Pictures | `NEW1-parts.png` (61128) · `NEW2-companies.png` (61129) · `NEW3-everything.png` (61130) — verified 3 `<img>`, 0 `blob:`, 760 wide at true aspect |
| SV-10161 comment 76906 | trimmed to the fix results only (245 words, 1 picture) and ends *"…written up separately, with examples and reproduction steps, in SV-10277."* |

## Why the examples were rebuilt from real data
The first draft used the seeded `ZZPREFIX` / `ZZSTOCKPART` pairs. A Product Owner does not recognise
those, and `ZZSTOCKPART` matched on **part number** (an identifier field), so it could not be
attributed to the bonus change at all. The three examples now used are ordinary records anyone can
search:

| Example | Query | What it shows |
|---|---|---|
| 1 | `shoe` | 20 parts, all **1.00**; a kit with **176** on the shelf level with one showing **0 Available** (7 of the 20 are out of stock). Composed from two crops — top of the list and bottom — with a *"rows 3 to 13 of 20 not shown"* band, because no single panel holds both. |
| 2 | `mobile` | `Mobile Truck & Trailer Repair Island Lake` (name **starts** with it) level with `Henderson Mobile Truck Repair` (word **inside**) — both **1.00**, where §6.1 separates the tiers by 0.20. |
| 3 | `truck repair` | All 20 rows at **1.00** in Work orders, Customers, Vendors, Part sales, Purchase orders and Vendor invoices; Assets all at **0.75**. |

## Attachment discrepancy — reported, not explained
At the start of this work SV-10161 carried four attachments, including `image-20260920-075638.png`
and `image-20260920-082125.png`. Both are absent from the attachment list now. The issue changelog
records **only my five deletions** (`ANN-A-solved`, `ANN-B-tiers`, `ANN-C-brake`, `PIC2-tiers`,
`PIC3-parts` — all files I had uploaded myself) and **no deletion of those two**. Neither file is
referenced by the description or by any comment, so nothing on the ticket is broken by their absence.
I cannot account for it and have not tried to restore anything. Raised with the QA lead.
