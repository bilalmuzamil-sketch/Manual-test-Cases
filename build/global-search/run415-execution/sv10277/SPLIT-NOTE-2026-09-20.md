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

## Simplified for non-technical readers (2026-09-20, QA lead's second pass)

*"it should be the simplest enough for those who are telling me that I am creating complicated
tickets … everything which helps the lazy non technical … to understand."*

**Six changes, all in service of one idea — a reader should get it from the pictures alone:**

| Was | Now |
|---|---|
| no summary line | **"In one sentence:"** opens the Description — *search used to put the most useful result at the top … and since the change it no longer does* |
| *"comes back on a score of 1.00"* in the prose | **"full marks"**; the raw numbers survive only inside the PRD quotes, the *Why This Happens* paragraph and the picture tables (as *"Full marks (1.00)"*, so a developer still gets the figure) |
| picture titles *"Search: shoe (Parts)"* | **"Someone searches for: shoe"** |
| annotations opened with the spec | **plain sentence first, spec in brackets after** — *"You have NONE of these — and it scores exactly the same. The specification says a part in stock should score higher. (PRD 6.1: …)"* |
| table headers *"What PRD 6.1 awards it"* / *"Score returned"* | **"What the specification says it should get"** / **"What it actually scores"** |
| steps ended with *"read the score on each row in the search response"* | that line is **gone** — every step is now something the reader can do; the score is proved by the table inside the picture |
| *"Applying match quality and the entity signals in two stages"* | **"not enough to reach full marks — so there is still room above it"** |

Files: `pics/SIMPLE1-parts.png` (61131) · `SIMPLE2-companies.png` (61132) · `SIMPLE3-everything.png`
(61133), inline at 760 wide, true aspect, 0 `blob:`. The `NEW*` set (61128–61130) was deleted from the
ticket and the working copies removed so nobody picks up the superseded wording.

## Third pass — the "176 on the shelf" correction (2026-09-20)

Caught by the QA lead: *"nobody knows what 176 is and what shelf means."* Fixed everywhere — prose,
annotations, picture tables and captions:

| Was | Now |
|---|---|
| *a part with 176 on the shelf and a part with none* | *a part that is **in stock** and a part that is **out of stock*** |
| *the part you actually have on the shelf* | *the part you actually have **in stock*** |
| *7 of them with none on the shelf* | *7 of them showing **0 Available*** |
| annotation *"You have 176 of these on the shelf."* | *"This part is in stock. The row says **176 Available**."* |
| table cell *176 on the shelf* / *none on the shelf* | *the row says **176 Available*** / *the row says **0 Available*** |
| *Credit for being in stock, and for having a bin location* | *Extra credit for being in stock* (bin location dropped from the table — it stays in the PRD quote) |
| *whichever record was **touched** most recently* | *whichever record was **changed** most recently* |

Pictures re-uploaded as `SIMPLE*-v2.png` (61134 / 61135 / 61136) — **a re-upload under the same
filename would have resolved to the FIRST attachment and changed nothing on screen**, so fresh names
were used and 61131–61133 deleted. Verified: 3 inline, 0 `blob:`, 760 wide at true aspect, and the
rendered description no longer contains the phrase "on the shelf".
Rule recorded: `06-DEFECT-PREP.md`, learning **L0169**.

## Fourth pass — before / fixed / broke headings, and "full marks" removed (2026-09-20)

*"It should have the heading as to what you are telling was happening before the fix and what is
happening after the fix which has fixed what was reported and broken what."*

The Description was one running explanation. It is now three named sub-headings:

| Heading | What it carries |
|---|---|
| **How search worked before the fix** | the two halves of the score, and why a contact match could beat a company's own name — i.e. the problem SV-10161 reported |
| **What the fix corrected** | own-name matches now win; 20 person-name searches / 230 rows; *"This part is right and should stay."* |
| **What the fix broke** | the maximum score is reached on the match alone, so in stock, open work orders, recent use and match closeness stop counting; results on the maximum fall back to whichever was changed most recently |

**"Full marks" was also removed** — it is a school-marking idiom, i.e. a metaphor, and therefore
barred by the rule recorded the same day. Everywhere it now reads **"the maximum score"**, and the
picture tables read **"The maximum (1.00)"**. Pictures re-uploaded as `*-v3.png` (61137 / 61138 /
61139) under fresh names again; 61134–61136 deleted. Verified in the rendered description: 3 pictures,
0 `blob:`, and no occurrence of *full marks* or *on the shelf*.

## Fifth pass — every word taken from the app or the PRD, no metaphors (2026-09-20)

*"Make sure that all the words are from the app glossary and not the metaphores."* Scanned the whole
description and the picture tables; every replacement takes the PRD's own term or the app's own label.

| Metaphor / my own word | Replaced with (source) |
|---|---|
| *credit* | **bonus** — PRD 6.1's own word (*"Bonus for match on the primary display name"*) |
| *lift* (×3) | **bonus** · **raise the score** · **rank above** |
| *nothing can lift it, nothing can hold it back* | **no signal can raise that score and none can lower it** |
| *has nowhere to go* | **is clamped away** — PRD 6.1 (*"The score is clamped to a sane range"*) |
| *still room above it … to do their job* | **the score stays below the maximum … the signals can still change the order** |
| *fall back / fallback* | **the recency tie-break** — PRD 6.1 (*"ties are broken by recency"*) |
| *sits level with* | **scores the same as** |
| *whole lists come back with nothing separating them* | **every list returns rows that all score the same** |
| *beat* | **rank above** |
| *how useful the result is likely to be* | **how recent and how important the record is** — PRD 6.1's *"recency/importance signals"* |
| *a person's name or email address* | **a contact's name or email address** — the app prints **Contact match** |
| *somebody opened recently* | **viewed recently** — PRD 6.1's own term |
| *everyday words* | **common words** |
| *arrives at 1.00* | **reaches 1.00** |
| *stop making any difference* | **no longer change the order** |

**The picture tables changed too.** The middle column is now headed *"What PRD 6.1 says it should
get"* and carries the specification's literal notation — `In stock (>0) -> +0.20`,
`Prefix match on primary name field -> +0.70`, `Whole-word match anywhere in indexed fields -> +0.50`
— instead of my paraphrases ("the higher credit", "extra credit for being in stock").

Pictures re-uploaded as `*-v4.png` (61148 / 61149 / 61150); 61137–61139 deleted. Verified in the
rendered description: 3 pictures, 0 `blob:`, and none of the fifteen suspect words present.
