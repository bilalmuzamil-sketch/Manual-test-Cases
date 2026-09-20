# SV-10211 has regressed — and it supplies the before-and-after SV-10277 was missing

Found during the ticket audit on 20 September 2026. **Nothing was changed on any ticket.**

## The history, with dates and build markers

| When | Build | What was true | Evidence |
|---|---|---|---|
| 17–18 Sep | `v26.36.7-29ca209` | prefix and whole-word matches scored **identically (0.90000004)**, so the stronger match got no advantage. **SV-10211 raised.** | the ticket's own description |
| 18 Sep | `v26.36.7-069b8c2` | **FIXED.** `ZZPREFIX Freight Ltd` (starts with) first, `Bolton ZZPREFIX Services` (contains) second, `ZZPREFIY Cartage` (typo) third — read twice. **C55707 recorded Passed**, SV-10211 moved to **QA Complete**. | `results/c55707fixed.json` |
| 20 Sep | `v26.36.8-d146c39` | **BACK.** Both score **1.00** — identical again. In real company data the wrong one now comes first: `diesel` → `Stillwater Diesel Repair` at row 1, `Diesel Diesel & Fleet Repair` at row 5; `fleet` → `Continental Fleet Services` at row 1, `Fleetwise Truck Repair LLC` at row 8. | `VISIBLE-EVIDENCE-2026-09-20.md`, `recheck10277.mjs` |

The SV-10161 change was deployed **between** the 18 September pass and today.

## Why this matters more than the regression itself

An hour ago I told the QA lead, in writing, that I could **not** prove these behaviours were correct
before the SV-10161 change, because the pre-fix build is gone and nobody captured it — and that the
link therefore rested on arithmetic rather than on a measurement. **That was wrong, and I should have
found this before saying it.** The measurement exists: it is our own dated, recorded pass of C55707 on
`v26.36.7-069b8c2`, made two days ago and signed off in the ticket.

So SV-10277 §2a is not a theory. It is a **regression of a ticket that was already fixed and closed**.

## What this means for SV-10211 itself

It sits at **QA Complete** carrying my comment *"→ QA Status: Passed"*, and the behaviour it describes
is failing again today. A closed ticket that has silently regressed is the worst state for a ticket to
be in — nobody is looking at it. **Put to the QA lead; not touched.**

## The lesson
**Before writing "no before-and-after exists", search our OWN recorded results for the same behaviour.**
Every pass we record is a dated measurement on a named build. The regression evidence I said was
missing had been sitting in `results/c55707fixed.json` for two days. Learning **L0173**.
