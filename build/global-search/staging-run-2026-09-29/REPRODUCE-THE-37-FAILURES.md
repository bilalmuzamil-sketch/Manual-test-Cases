# The 37 failing checks — how to reproduce each one

Staging **app.staging.shopview.com**, workplace *Staging Heavy Duty - 9919*, build
**v26.39.2-51a35e1**. Every check below is in run 415; the link on each row opens that check's own
result with its comment and history.

## First, the two questions you asked

**Does any of this need data seeding? No.** I searched every term these checks use, live, just now.
All 27 of them still return records. Nothing here is failing because data is missing, and a tester
can reproduce all of it today without setting anything up.

**Is any of it my own fault? One and a half, and both are corrected.**

* **C146264 was half mine.** I reported the part-sale row as missing the total price *and* the
  created date. The date is there — the row writes it as the word *"Today"* and my check only
  recognised dates written as numbers or month names. Corrected: only the price is missing. The
  same check on purchase orders and supplier invoices reads *"Sep 25, 2026"* and *"Yesterday"* and
  passes.
* **One false alarm that never reached you.** While preparing this list, my summary script reported
  a Parts term as returning nothing. That was the script failing to decode an apostrophe, not
  missing data. The real test used the correct term, so that result stands.

Everything else I have checked hard, and the strongest evidence that the reader is sound is that
**it reports some things as correct**: a punctuated telephone shows in full, purchase-order and
supplier-invoice rows show every promised field, and 62 checks pass. A broken reader would not.

---

## A. The row repeats your typing instead of showing what it found — 23 checks

**What should happen.** When a record is found because of a detail that is not on the row — a
chassis number, a technician's name, a part number — the row adds a short note saying what matched.
That note should show the **whole** detail, with the part you typed marked inside it.

**What happens instead.** The note shows only the characters you typed, and nothing else.

**Reproduce it in thirty seconds**
1. Press `Ctrl`+`K`.
2. Type `SVEWU82`.
3. Open the *Work orders* tab and read the second line of each row.
4. Every row reads **VIN: SVEWU82**. Open any one of them: the real chassis number is
   `SVEWU82M5ETEJFWFA` — seven characters out of seventeen.
5. Now type `3286` and open *Customers*. These rows read **Contact match: (264) 328-6723** — the
   whole number. That contrast is the giveaway: it goes wrong when what you type sits letter-for-letter
   inside the stored value, and goes right when punctuation breaks it up.

**Note on the terms below.** Several of these checks tell you to type a value *in full*. Typing a
value in full always echoes it back whether the screen is right or wrong, so to actually see the
fault, type **part** of the value instead — the last few characters of a chassis number, four digits
of a telephone, the first half of a name.

| Check | Where | Type this | Open the result |
|---|---|---|---|
| C146202 | Work Orders | `SVEWU82M5ETEJFWFA` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298111) |
| C146205 | Work Orders | `786` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298114) |
| C146206 | Work Orders | `786` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298115) |
| C146214 | Customers | `609-461-6502` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298123) |
| C146215 | Customers | `555-222-3333` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298124) |
| C146216 | Customers | `zzautotest.nophone@staging.shopview.local` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298125) |
| C146217 | Customers | `Savannah` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298126) |
| C146218 | Customers | `Apt. 199` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298127) |
| C146229 | Assets | `SVEWU82M5ETEJFWFA` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298138) |
| C146230 | Assets | `KVQ-2870` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298139) |
| C146238 | Parts | `H3B` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298147) |
| C146239 | Parts | `Klondike` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298148) |
| C146240 | Parts | `Gibson's Mobile Diesel Repair` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298149) |
| C146242 | Parts | `496` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298151) |
| C146251 | Vendors | `ZZHIDDENSUITE` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298160) |
| C146252 | Vendors | `965` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298161) |
| C146262 | Part Sales | `Quietline` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298171) |
| C146263 | Part Sales | `ZZHIDDENVIN0000001` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298172) |
| C146271 | Purchase Orders | `0123` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298180) |
| C146272 | Purchase Orders | `786` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298181) |
| C146273 | Purchase Orders | `Admin ShopView` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298182) |
| C146274 | Purchase Orders | `I-1522` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298183) |
| C146282 | Vendor Invoices | `I2-965` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298191) |

---

## B. The whole matched value is not shown — 6 checks

**What should happen.** The row shows the complete value that matched, with your typing marked
inside it.

**What happens instead.** The value is cut short, or your typing is not marked inside the line that
contains it.

**Reproduce it**
1. Press `Ctrl`+`K` and type `ZZLONGROW`.
2. Open each tab named in the table below and read the bold first line.
3. On work orders, customers, parts, vendors and part sales the line ends in a **"…"** before it
   finishes. On assets the unit number contains what you typed but is **not marked** there, while
   the same characters *are* marked on the line below.

| Check | Where | Type this | Open the result |
|---|---|---|---|
| C146197 | Work Orders | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298106) |
| C146209 | Customers | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298118) |
| C146224 | Assets | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298133) |
| C146233 | Parts | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298142) |
| C146245 | Vendors | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298154) |
| C146257 | Part Sales | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298166) |

---

## C. Long text is cut off through the word you searched for — 5 checks

**What should happen.** You can still identify the record, and the word you typed is visible on the
row.

**What happens instead.** The search panel is a fixed 640 pixels wide — the same at every screen
size from 1280 to 2560 — so a long name is cut short. If your word is in the part that gets cut,
**the record comes back with your word nowhere on it**.

**Reproduce it**
1. Press `Ctrl`+`K` and type `Fernvale`.
2. Open the *Work orders* tab.
3. Two work orders come back and the word *Fernvale* is not visible on either one.
4. Other rows in the same list do show it highlighted — so it is long names only.

Typing `ZZLONGROW` as the checks instruct will **not** show you this, because that word sits at the
start of the name where a cut from the right can never reach it. Use a word from the end.

| Check | Where | Type this | Open the result |
|---|---|---|---|
| C146198 | Work Orders | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298107) |
| C146210 | Customers | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298119) |
| C146234 | Parts | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298143) |
| C146246 | Vendors | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298155) |
| C146258 | Part Sales | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298167) |

---

## D. The match is not marked on the line that contains it — 1 check

**What should happen.** Wherever your typing appears on the row, it is marked there.

**What happens instead.** On an asset row the unit number contains what you typed as ordinary text,
while the customer name below it *is* marked.

**Reproduce it**
1. Press `Ctrl`+`K` and type `ZZLONGROW`, then open the *Assets* tab.
2. The bold first line reads `ZZLONGROW-123786 · 2021 Rowcheck Trucks Longhauler` with nothing
   highlighted.
3. The line underneath shows the same word highlighted.

| Check | Where | Type this | Open the result |
|---|---|---|---|
| C146226 | Assets | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298135) |

---

## E. A row is missing something the requirement promises — 2 checks

**What should happen.** A customer row shows its name, address, a count of open jobs, and the
telephone when you hover. A part-sale row shows the sale number and customer, its status, the
total price and the created date.

**What happens instead.** The customer telephone never appears, on hover or otherwise. The
part-sale row has no total price.

**Reproduce the customer one**
1. Press `Ctrl`+`K`, type `7 Star Truck Repair`, open *Customers*.
2. Rest the pointer on the row and leave it there — nothing changes.
3. Open the customer: its Phone field reads `609-461-6502`.

**Reproduce the part-sale one**
1. Press `Ctrl`+`K`, type `ZZLONGROW`, open *Part sales*.
2. The row reads `P2-2277 ZZLONGROW Heavy Haulage… Estimate · Admin ShopView · Today`.
3. The sale number, customer, status and date are there. There is no price anywhere on the row.

| Check | Where | Type this | Open the result |
|---|---|---|---|
| C146222 | Customers | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298131) |
| C146264 | Part Sales | `ZZLONGROW` | [open the result](https://shopview.testrail.io/index.php?/tests/view/3298173) |

---

## What these add up to

Groups A, B and D are all one underlying fault and are covered by the first ticket in the list
below. Group C is covered by three tickets that were already open. Group E is two separate things:
the customer telephone has its own ticket; the missing part-sale price has **no ticket yet** and is
the only failure here not yet reported anywhere.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Raised by me: SV-10634 (groups A, B, D) · SV-10635 (customer telephone)
Already open: SV-10552 · SV-10619 · SV-10551 (group C)
Not yet raised: the missing part-sale total price, C146264
