# Search Results Integrity — finished. Read this first.

All 110 checks are run and recorded, on one build: staging **v26.39.2-51a35e1**, 29–30 September
2026. Nothing is waiting on me. One thing is waiting on you, at the bottom.

## The numbers

| Status | Count |
|---|---:|
| **Passed** | **61** |
| **Failed** | **38** |
| **Blocked** | **6** |
| **In Retest** | **0** |
| Removed (you deleted the cases) | 4 |
| Not applicable (the case says so itself) | 1 |
| **Total** | **110** |

| Sheet | Passed | Failed | Blocked | Other |
|---|---:|---:|---:|---|
| Work Orders | 5 | 5 | 1 | 1 deleted |
| Customers | 3 | 8 | 2 | 1 deleted, 1 n/a |
| Assets | 5 | 4 | — | |
| Parts | 5 | 6 | 1 | |
| Vendors | 5 | 4 | 1 | 2 deleted |
| Part Sales | 4 | 5 | — | |
| Purchase Orders | 7 | 4 | — | |
| Vendor Invoices | 7 | 1 | — | |
| All tab and cross-tab | 20 | 1 | 1 | |

## 38 failures, but only THREE problems

**1. The row repeats your typing instead of showing what it found — 33 checks.**
Type `SVEWU82` and twenty job rows all read *VIN: SVEWU82*; the chassis number is
`SVEWU82M5ETEJFWFA`. Type `965` and seven customer rows all read *Contact match: 965*. Every row
looks the same, so you cannot tell the records apart without opening each one. It affects chassis
number, licence plate, technician, advisor, part number, part name, bin location, manufacturer,
vendor name, tags, contact telephone, contact name, address line, PO number and created-by.
**I have raised this** with three annotated pictures — where it goes wrong, and where it does not.
It is the first ticket in the list at the bottom.

**2. Long text is cut off, sometimes through the word you searched for — 3 checks.**
The search panel is a fixed 640 pixels at every screen size from 1280 to 2560. Type `Fernvale` and
two work orders come back with the word nowhere on them. **Already reported** — three existing
tickets cover it, listed at the bottom; the main one is currently Blocked, with the developer
saying the label is simply too long. Worth knowing when that is next discussed: the panel is a
fixed width, so making the window bigger does not help anybody.

**3. Two smaller ones, one each.**
The customer row never shows the telephone the requirement puts on hover — **I have raised this**,
second in the list at the bottom. And typing a record number in full does not jump you to that
record — **not raised, see below**.

## The 6 blocked — all test wording, none of them the product

| Tests | Why | What they need |
|---|---|---|
| C146204 | Tells the tester to type the word `None` | A real service-advisor name that exists here |
| C146220, C146221, C146241, C146250 | Gives the WHOLE value, which can never fail, and no shorter piece of it matches that field | A term that is part of a longer value AND that the search actually matches on that field |
| C146301 | Held by its own Expected — the specification sets a typing delay but no minimum length | A decision on what one character should do |

C146220 and C146221 are worth a look on their own: a city and a province match, the record comes
back, and the row says nothing at all about why. That may be the same family as problem 1.

## What needs you — one thing

**Typing a record number in full does not take you to that record.** The requirement (PRD v1.5
§6.2) says an exact match is *"pinned as a separate single row at the very top, above the groups"* —
the "type the number, go straight there" behaviour. It is not. The record comes back in the
ordinary way inside its group.

I checked the obvious way for this to be my mistake: the case says to type `S-34379` while the row
displays `S2-34379`, so I tried both. Each brings back exactly one record and neither is pinned.

The ticket is written and ready at `TICKET-DRAFT-pinned-top-result.md`. **I have not filed it** —
your go-ahead covered the two tickets you named, and filing is the one thing I will not do on my
own. It is separate from the first ticket: that one is about what a row shows once it is drawn, this is
a row that is never drawn at all. Fixing one would not fix the other.

## Two other things you may want to action

- **Five cases you listed as deleted still exist** in TestRail and are still Blocked: C146204,
  C146220, C146221, C146241, C146250. Four did delete (C146203, C146219, C146253, C146254).
- **C146209's wording still contradicts itself.** Its steps say to type `0900`, which is what makes
  it work, but a leftover line above still says to type `ZZLONGROW`. A tester will type the wrong
  thing.

## About the numbers themselves

Every failure passed the evidence gate before it was recorded, and every one carries a link to its
ticket in the run itself.

I also want you to know how many of my own mistakes this pass caught, because it bears on how much
to trust the 38. **Ten failures turned out to be my measuring tools rather than the product**,
and each was caught by reading the failure rather than copying it down — a check that cannot tell
correct behaviour from broken behaviour looks exactly like a check that passed. Two results I had
already corrected were silently overwritten when the suite re-ran, because the correction lived in
the record and not in the test; both are now fixed in the tests so they cannot flip back. And the
results parser matched only `C1462xx`, so ten cases never appeared in its output at all — a wrong
result argues with you, a missing one does not.

The suite is now one test per case, 105 automated checks, with the five cases that cannot be fairly
automated recorded as such.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Case links · https://shopview.testrail.io/index.php?/cases/view/<id>
Filed today: SV-10634, SV-10635. Open already: SV-10552, SV-10619, SV-10551.
Drafted, not filed: build/global-search/staging-run-2026-09-29/TICKET-DRAFT-pinned-top-result.md
