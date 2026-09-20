# C55736 and C55737 corrected and run — 20 September 2026

QA lead's go-ahead: *"Correct C55736 and C55737 so they can actually be run — Yes."* Both are ours
(`created_by = 3`), neither is flagged Automated, so Rules 38 and 71 are clear. Written with block HTML
only; `check_case_render.py` passes on both.

## C55736 — was pointed at a row that never shows a price

| | |
|---|---|
| **Was** | *"Flipping only See Financial Data shows then masks the price on the same row"* — on a **part** row |
| **Why it could not run** | a part row prints no price for anyone. §4 lists a part row as description, part number, quantity badge and bin location — no price. There was nothing to watch disappear. |
| **Now** | *"Removing See Financial Data hides the total on a Vendor invoice row but keeps the row"* — §4: *"invoice number + vendor (primary), status badge (Paid / Unpaid), total + invoice date"* |
| **Unchanged** | what is being checked: the permission hides the money, not the record |

**Run: Passed.** Same person, two restricted roles, same word, same three invoices:

| Invoice | With financial access | Without |
|---|---|---|
| `dfgdsgsfggsfdgsd` | 138.60 | no total |
| `fdsgsdgsg` | 23.10 | no total |
| `cv124` | 21.00 | no total |

Both roles returned the same **20** Vendor invoice rows, so nothing was hidden except the amount.

## C55737 — asked for a permission this product does not have

| | |
|---|---|
| **Was** | a role that may see SOME records of a kind but not **one particular record** of that same kind |
| **Why it could not run** | permissions here grant or deny a whole KIND of record, never an individual one, so the situation could not be created |
| **Now** | *"Records a person cannot see are not counted in any heading, tab or total"* — a whole kind is taken away, which is the only unreachability this product supports |
| **Unchanged** | what is being checked: a record you cannot see is never counted |

**Run: Passed.** `truck repair` with every area allowed → 8 kinds, 20 rows each, **160**. With Part sales
taken away → 7 kinds, **140**. The heading and tab are gone and 160 − 140 is exactly the 20 it used to
contribute; every other kind kept its number. Confirmed a second way on `ZZAUTOTEST Fibridge`, moving the
same person between two restricted roles.

**Neither Expected was changed to match the build (Rule 57)** — both still assert what §9 requires
(*"results, group counts and scope tabs are all filtered by the user's permissions"*). Only the row and
the kind of unreachability changed, and each case now records why, in its own text.

Run 415 after this: **177 passed · 14 failed · 8 blocked · 3 retest · 1 not run.**
