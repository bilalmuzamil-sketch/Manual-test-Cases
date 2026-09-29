# PREPARED, NOT FILED — awaiting the QA lead's go-ahead (Rule 62 / Rule 113)

**Issue type** `Story Defect` · **Parent** SV-9170 (the owning story) · **Priority** Medium
**Links** `relates to` SV-9170 · `relates to` SV-10619 · `relates to` SV-10551
**Product Area** left empty — this issue type does not carry the field.

⚠️ **Same Rule 112 flag as the other prepared ticket:** SV-9170 reads **QA Complete**, read live
2026-09-29, which is not one of the two statuses a Story Defect may be filed against. The QA lead's
call, not this session's.

---

## Title

`Search Result Rows Show Only The Characters Typed, Not The Value That Matched`

## Description

A result row is supposed to show the *value* that matched, with the characters you typed marked
inside it. Instead, whenever what you typed appears literally inside the stored value, the row
shows **only the characters you typed** — and nothing else about the record.

For example:

* Type `965` and seven customer rows all read `{{Contact match: 965}}`. Every one of them looks
  identical. The telephone number each actually matched is never shown.
* Type `SVEWU82` and six job rows all read `{{VIN: SVEWU82}}`. The chassis number is
  `{{SVEWU82M5ETEJFWFA}}` — seven characters of seventeen.
* Type `Smit` and the row reads `{{Technician: Smit}}`. The technician is *Brandi Smith*.
* Type `Garris` and the row reads `{{Advisor: Garris}}`. The advisor is *Jason Garrison*.
* Type `KVQ-28` on an asset and the row reads `{{Matched: KVQ-28}}`. The plate is `{{KVQ-2870}}`.

It does not always happen, and the difference is the giveaway: type `3286` and the rows read
`{{Contact match: (264) 328-6723}}` — the whole number, correctly. The brackets and dash stop the
typed digits appearing as one literal run inside the stored value, and the row then shows the whole
of it. Same field, same kind of match, same build, two different behaviours.

The effect is that the row stops doing its job. Two different records draw identically, and the
reader cannot tell them apart — or even tell that they *are* different — without opening both.

## Steps to Reproduce

# Sign in to staging and press `Ctrl`+`K` to open search.
# Type `{{965}}`.
# Open the *Customers* tab and read the second line of each row.
#* Seven of the nine rows read `{{Contact match: 965}}` and nothing more.
#* Two rows do show a whole number, e.g. `{{Contact match: 857-496-5067}}`.
# Clear the box and type `{{3286}}`.
# Read the second lines again.
#* Every row now shows a whole telephone number, e.g. `{{Contact match: (264) 328-6723}}`.
# Clear the box and type `{{SVEWU82}}`, then open the *Work orders* tab.
#* All six rows read `{{VIN: SVEWU82}}`, though the chassis number is `{{SVEWU82M5ETEJFWFA}}`.

*Actual Result* — where the typed text sits literally inside the stored value, the row shows only
the typed text, so rows that matched different records are indistinguishable.

*Expected Result* — the row shows the complete value that matched, with the typed part highlighted
inside it: `{{Contact match: 857-496-5067}}` with `965` marked.

## Screenshots

!typed-only-vs-full-value.png|width=760!

## Environment

Staging — [https://app.staging.shopview.com] · workplace *Staging Heavy Duty - 9919* ·
builds `{{v26.39.1-97cad2c}}` and `{{v26.39.2-51a35e1}}` · 29 September 2026
Staging was redeployed during testing; the behaviour is unchanged on both.

## Sources

*Global Search — Product Requirements v1.5 (2026-09-08), section 5.3:*

{quote}The matched substring of the query is highlighted in the primary and secondary text — searching `Fib` highlights "Fib" in "S1-644 Fibridge Commercial".{quote}

The example settles it: the query is three characters and the row shows the whole of
"S1-644 Fibridge Commercial".

*Story SV-9170:*

{quote}Each result row carries enough context to pick the right record without opening it — its identifier, who it belongs to, its status, and for work orders the unit number and vehicle, which is what tells two of the same customer's work orders apart.{quote}

---

## Notes for filing (not part of the ticket)

* `size_pics.py <KEY> pics/typed-only-vs-full-value.png` AFTER the description write, read back to
  confirm `full-width` (Rule 116). Source is 2680x1750, composed landscape from 2x captures.
* Description via `PUT /rest/api/2/issue/{KEY}` with `jira.sh` — the MCP tools take Markdown and
  will not embed the image.
* **Deliberately omitted from the ticket** (Rule 111, overriding the handoff): the root-cause trace
  into application source and the suggested fix. This repository holds test cases, not the
  application, so neither could be verified here, and our ticket shape carries no developer-details
  section. Named in the report rather than dropped silently.
* No case ids or run links in the description.
