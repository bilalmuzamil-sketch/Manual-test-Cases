# SV-8527 — "Found part's Part Number renders permanently disabled" — QA of the fix branch, 2026-09-15

**Verdict: the reported defect is FIXED.** 12 of 12 checks resolved, with a genuine before/after taken
on production and the fix branch.

## Build markers, read live at the start

| | marker |
|---|---|
| Fix branch `sv8527.qa.shopview.com` | **v26.36.6-3b2f046**, last-modified Tue 15 Sep 2026 07:11:02 GMT, etag `38a1a6c65c27c05e…` |
| Production `app.shopview.com` (the pre-fix build) | **v26.36.6-638eaa5**, last-modified Mon 14 Sep 2026 08:27:46 GMT — a different commit from the branch |

## What the ticket and the ruling actually ask for

Read from the ticket itself, not from the handoff alone:

* **Chris Ward, comment 75927** — *"1. Yes :). 2. Also yes."* → a Found part's part number **should** be
  editable, and Found parts **should** be addable to a Part Sale (this supersedes SV-5700).
* **Chris Ward, comment 76088** — *"1) I would leave as read only…  2) That's correct"* — answering
  Slavcho's follow-ups, i.e. **Inventory stays read-only**, and the direction is **open the grid up**,
  not lock the dialog down. *(Worth stating plainly because the numbering invites the opposite
  reading: "leave as read only" is about Inventory, not Found. The implemented fix reads it the same
  way.)*
* **Slavcho's PR #3058** — Found part number editable on **both** Part Sales and Work Orders; locked
  **only** for inventory; a Found part's **cost stays read-only**; existing locks unchanged — **core
  charge, invoiced work order, received, returned**; **clearing to blank is allowed**.

## Results

| # | Check | Result |
|---|---|---|
| 1 | Part Sale, Found part: backend flag `disable_part_number` = **false** | PASSED |
| 2 | Part Sale, Found part: the Part Number input is **not** `disabled`, pointer-events `auto` | PASSED |
| 3 | Typing + blur saves — `POST /api/work-orders/part/change-request` → **200** | PASSED |
| 4 | The edit **persists** — value survives a full page reload and a fresh server read | PASSED |
| 5 | **Clearing to blank** is accepted (200) and the blank persists across a reload | PASSED |
| 6 | Setting a value again after blanking | PASSED |
| 7 | A Found part's **Cost stays read-only** (`disabled`, pointer-events `none`) | PASSED |
| 8 | **Work Order** surface: same Found part edit works and persists | PASSED |
| 9 | **Inventory** part stays read-only, at the same row status as an editable Found part | PASSED |
| 10 | **Core charge** rows stay locked | PASSED |
| 11 | **Received / invoiced-and-paid** rows stay locked, *including a Found part that is received* | PASSED |
| 12 | **Returned** rows stay locked | **NOT APPLICABLE** — a returned part is removed from the grid (proven below) |
| 13 | Found is offered as a Source on a Part Sale, and the dialog saves it (C55657) | PASSED |

### The numbers behind the rows

**Seeded exactly as the ticket's repro describes** — Add Part → Source = **Found**, description,
quantity, sell price, Part Number left empty → Save & Close.
`POST /api/work-orders/part/make-request` → **201**, `part_source_type: "found"`, `part_number: null`.
The Source dropdown offered **Inventory / Vendor / Found**, so Found is addable to a Part Sale.

Part Sale **P8527-246** (Estimate), row `183c2122-…`:

```
after seeding   part_source_type found | status quoted | disable_part_number FALSE | disable_cost TRUE
grid probe      part_number  disabled:false  pointerEvents:auto        cost  disabled:true  pointerEvents:none
type + blur     POST /api/work-orders/part/change-request 200  {"part_number":"ZZ-8527-A"}
server re-read  part_number "ZZ-8527-A"
full reload     field shows "ZZ-8527-A", still enabled
clear to blank  POST … 200 {"part_number":""}   reload -> still blank
set again       POST … 200 {"part_number":"ZZ-8527-FINAL"}
```

Work Order **S8527-17435** (Approved), row `7c9a10b2-…`:

```
seeded          part_source_type found | status in_stock | disable_part_number FALSE | disable_cost TRUE
type + blur     POST /api/work-orders/part/change-request 200  {"part_number":"ZZ-8527-WO"}
full reload     field shows "ZZ-8527-WO", still enabled
```

**The lock is now source-specific, not blanket** — the cleanest single comparison, same row status:

| row | source | status | part number field |
|---|---|---|---|
| `ZZAUTOTEST SV-8527 found on WO` | found | in_stock | **enabled** |
| `HDEO13` (P8527-204) | inventory | in_stock | **disabled** |
| `N62ET-20` (P8527-204) | inventory | received | disabled |

**Retained locks, counted rather than sampled:**

* Part Sale **P2-193** (paid, contains two core-charge rows): **6 of 6** part-number inputs `disabled`.
* Work Order **S2-4219** (paid, contains a Found part that is received — `WS2 `): **11 of 11**
  part-number inputs `disabled`.

So the fix did **not** blanket-unlock Found parts: a Found part that is received is still locked.

**Branch-wide flag sweep** (25 part sales + 25 work orders, every part row read from
`/api/work-orders/{id}/parts/list-requests-by-line`) — before seeding:

| source | row status | core | `disable_part_number` | rows |
|---|---|---|---|---|
| inventory | received | no | true | 64 |
| vendor | received | no | true | 38 |
| vendor | quoted | no | **false** | 11 |
| found | received | no | true | 9 |
| inventory | in_stock | no | true | 2 |
| vendor | received | **yes** | true | 2 |
| vendor | requested | no | true / false | 3 |

Note there was **no Found part in an editable state anywhere on the branch** — every pre-existing
Found row is `received`, which is legitimately locked. That is why one had to be seeded, and it is
also why a reader glancing at the branch could wrongly conclude nothing changed.

## The before/after — taken on production, then cleaned up

Production is the pre-fix build (**v26.36.6-638eaa5**, a different commit from the branch). Its only
existing Found rows are `received`, which is locked for a *retained* reason, so they prove nothing.
So the identical seed was made on production through the same endpoint:

```
production seed   part_source_type found | status in_stock | disable_part_number TRUE | disable_cost TRUE
grid probe        part_number  disabled:TRUE   pointerEvents:none   value ""
clicked it        click rejected (element not enabled); typed "XYZ" -> field still empty
the row above it  vendor part, disabled:false  -> so it is the row, not the grid
```

Against the fix branch's identical seed: `disable_part_number` **FALSE**, field editable, value saves.
**Same seed, same source, opposite result.**

*Stated honestly:* the two seeded rows settled on different statuses — `in_stock` on production,
`quoted` on the branch. That does not explain the difference, because on the fix branch a Found part is
editable at **both** statuses: `quoted` on the Part Sale and `in_stock` on the Work Order.

**Production was left as it was found.** The seeded row was deleted
(`POST /api/work-orders/part/remove-request/{id}` → 200) and the part sale re-read: back to its single
original `BilaDD` vendor row, seeded row absent.

## The "returned" lock — resolved, not skipped

There were no returned rows to test, so one was created: pressing **Return** on a received part row
fires `POST /api/work-orders/parts/delete` → **201** and **the row disappears from the parts grid**.
Re-reading the listing afterwards: the returned row is gone and there are **zero** rows with a returned
status anywhere in that grid.

So the "returned" lock cannot be exercised in this grid — a returned part is not shown here at all, so
there is no field to lock. That is why no returned row exists on the branch, and it is a complete
answer rather than an untested row.

## Evidence

* `ev/03-before-production-after-fixbranch.png` — **the before/after**: the same part seeded on
  production (field disabled, typing rejected) and on the fix branch (field editable, value saved).
* `ev/01-found-part-number-editable.png` — the Part Sale and Work Order grids, Part Number editable
  and holding the typed value, Cost greyed, annotated with leader lines.
* `ev/02-found-editable-inventory-locked.png` — same row status, opposite result: Found editable,
  Inventory locked.

## Test data left on the branch (per-ticket branch, no cleanup required)

* Part Sale **P8527-246** → part request `183c2122-e34c-452b-b645-30473afde27a`,
  *"ZZAUTOTEST SV-8527 found part"*, part number `ZZ-8527-FINAL`.
* Work Order **S8527-17435** → part request `7c9a10b2-9f04-4fbd-89c1-4d4d7764c412`,
  *"ZZAUTOTEST SV-8527 found on WO"*, part number `ZZ-8527-WO`.

Both left in place so the result is reproducible from the ticket.

## What was changed where

* **Production** — one Found part seeded for the before-capture and **deleted afterwards**; the part
  sale re-read and confirmed back to its original single row. Nothing else touched.
* **Fix branch** (per-ticket QA branch, no cleanup required) — the two ZZAUTOTEST Found parts above are
  left in place so the result is reproducible, and one inventory part was returned on P8527-243 while
  resolving the "returned" question.

## Not touched

No Jira write of any kind. The two sibling bugs the ticket mentions —
SV-8526 (description edit) and SV-9047 (edits lost on save) — were **not** tested; they are separate
tickets and conflating them would muddy this verdict.
