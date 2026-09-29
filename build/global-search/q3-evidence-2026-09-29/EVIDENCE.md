# Q3 — "the row shows only what you typed": what I measured on staging

Staging `app.staging.shopview.com`, workplace **Staging Heavy Duty - 9919**, build
**v26.39.1-97cad2c**, **29 September 2026**. Pointer parked at the origin and verified with
`document.elementFromPoint` before every read. Raw measurements: `q3-scenarios.json`.

## The rule that decides each row

A labelled note shows **only the characters typed** whenever what you typed appears *literally*
inside the stored value. Where punctuation interrupts it, the note shows the **whole** value. Both
behaviours are on the same build, in the same field, on the same screen.

## The scenarios

| # | Typed | Tab | Field the note names | What the row shows | Verdict |
|---|---|---|---|---|---|
| 1 | `965` | Customers | contact telephone | `Contact match: 965` on 7 of 9 rows | **only what was typed** |
| 2 | `3286` | Customers | contact telephone | `Contact match: (264) 328-6723`, and 5 more, all whole | correct — punctuation breaks the literal run |
| 3 | `SVEWU82` | Work orders | VIN | `VIN: SVEWU82` on all 6 rows. The real VIN is `SVEWU82M5ETEJFWFA` — **7 of 17 characters** | **only what was typed** |
| 4 | `Smit` | Work orders | lead technician | `Technician: Smit`. The technician is **Brandi Smith** | **only what was typed** |
| 5 | `Garris` | Work orders | service advisor | `Advisor: Garris`. The advisor is **Jason Garrison** | **only what was typed** |
| 6 | `786` | Work orders | part number / part name | `Part number: 786`, `Part name: 786` | **only what was typed** |
| 7 | `KVQ-28` | Assets | licence plate | `Matched: KVQ-28`. The plate is `KVQ-2870` | **only what was typed** |

### Not evidence, and excluded on purpose

Typing a value **in full** — `SVEWU82M5ETEJFWFA`, `Brandi Smith` — also produces a note identical
to the query, but that is the correct output and is indistinguishable from the fault. Counting
those as failures would inflate the ticket with cases that prove nothing. Only queries that are a
**proper fragment of a longer stored value** are used above.

## Two further observations, smaller but real

- **The Assets note is labelled `Matched:`**, not by the field it matched, while Work Orders say
  `VIN:`, `Technician:`, `Advisor:`. A reader cannot tell what the asset row matched on.
- **Some matches carry no labelled note at all** — a city (`Priscillab`) and one of the `786`
  work-order rows come back with nothing on the row to say why.
- **A postal code (`H8A3X`) returns no rows at all**, which is a separate question already on the
  Product Owner's sheet, not part of this ticket.

## What is NOT claimed here

The handoff that prompted this carried a root cause traced to application source and a suggested
fix. **Neither is repeated in the ticket**: this repository holds test cases, not the application,
so I cannot verify a claim about its code, and our ticket shape carries no developer-details
section (Rule 111). The measurements above are all first-hand.
