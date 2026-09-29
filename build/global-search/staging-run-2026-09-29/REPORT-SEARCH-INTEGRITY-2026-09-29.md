# Search Results Integrity — where the 110 checks stand (29 September 2026)

Counted live from TestRail, run 415, this folder only.

| Status | Count |
|---|---:|
| **Passed** | **9** |
| **Failed** | **26** |
| **Blocked** | **10** |
| **In Retest** | **0** |
| Not yet run | 65 |
| **Total** | **110** |

The 9 "Retest" on the run overall belong to the older Global Search suite, not to this folder.

## By sheet

| Sheet | Passed | Failed | Blocked | Not yet run | Total |
|---|---:|---:|---:|---:|---:|
| Work Orders | 5 | 5 | 2 | 0 | 12 |
| Customers | 4 | 6 | 4 | 1 | 15 |
| Assets | 0 | 2 | 0 | 7 | 9 |
| Parts | 0 | 4 | 1 | 7 | 12 |
| Vendors | 0 | 2 | 3 | 7 | 12 |
| Part Sales | 0 | 2 | 0 | 7 | 9 |
| Purchase Orders | 0 | 4 | 0 | 7 | 11 |
| Vendor Invoices | 0 | 1 | 0 | 7 | 8 |
| All tab and cross-tab | 0 | 0 | 0 | 22 | 22 |

---

## The 26 failures — three problems

### 1. The row repeats your typing back at you instead of showing the detail it found — 22 tests

**Trying to do:** when a record is found because of something not shown on the row — a chassis
number, a technician's name, a part number — the row adds a short note saying what matched. We
check that the note shows the WHOLE detail.

**Expected:** type `SVEWU82`, the note reads `VIN: SVEWU82M5ETEJFWFA` with your letters marked
inside it.

**Happening:** the note reads `VIN: SVEWU82` — only your own typing. Every row looks identical, so
you cannot tell which vehicle is which, or that they are different vehicles, without opening each.

**Steps**
1. Press Ctrl+K.
2. Type `SVEWU82`.
3. Open the Work orders tab; read the second line of each row.
4. All read `VIN: SVEWU82`. Open one — its real chassis number is `SVEWU82M5ETEJFWFA`.
5. Now type `3286` and open Customers: those notes DO show whole numbers, e.g. `(264) 328-6723`.
   The contrast is the giveaway — it happens when your typing appears letter-for-letter inside the
   stored value.

Affects: chassis number, licence plate, technician, service advisor, part number, part name, bin
location, manufacturer, vendor name, tags, contact telephone, contact name, address line, PO
number, created-by.

C146202 · C146205 · C146206 · C146214 · C146215 · C146217 · C146218 · C146229 · C146230 · C146238 ·
C146239 · C146240 · C146242 · C146251 · C146252 · C146262 · C146263 · C146271 · C146272 · C146273 ·
C146274 · C146282

### 2. Long text is cut off, and sometimes cuts off the thing you searched for — 3 tests

**Trying to do:** check a long name is not chopped so short that the record loses its identity.

**Expected:** you can still identify the record and your word is visible on the row.

**Happening:** the search box is a fixed width, so long customer names end in "…". Usually
harmless — but if your word sits in the chopped-off part, the record comes back with your word
nowhere on it.

**Steps**
1. Press Ctrl+K, type `Fernvale`.
2. Open the Work orders tab.
3. S2-34379 and S2-34376 come back and "Fernvale" is not visible on either.
4. Other rows in the same list do show it highlighted — so it is long names only.

C146197 · C146198 · C146210 — already reported as SV-10619 and SV-10551

### 3. A customer row never shows the telephone — 1 test

**Trying to do:** check the customer row shows its four promised things — name, address, count of
open jobs, telephone on hover.

**Expected:** resting the pointer on the row shows the telephone.

**Happening:** name, `30 open` and address are there. Hovering does nothing at all. Anyone who
searched a customer in order to ring them still has to open the record.

**Steps**
1. Press Ctrl+K, type `7 Star Truck Repair`, open Customers.
2. Rest the pointer on the row — nothing changes.
3. Open the customer: its Phone field reads `609-461-6502`.

C146222

---

## The 10 blocked — all four reasons are in the test wording, not the product

| Reason | Tests | What the tester sees | What it needs |
|---|---|---|---|
| The case says to type the word `None` | C146203 · C146204 · C146253 · C146254 | No search term at all — an empty value was written into the case text | A real technician / advisor / contact name or email that exists on staging |
| The row carries no note at all | C146219 (city) · C146220 (state / province) | The record is found but nothing says why, so there is no value to check | A decision on whether a city or province match should say so on the row |
| The case gives the WHOLE value, so it can never fail | C146221 (postcode) · C146241 (category) · C146250 (email) | Typing a value in full always echoes it back, right or wrong | An example where PART of the value still finds the record. `H8A3` does not find the postcode; `.Brake` does not find the category |
| The case asks for something it cannot reach | C146209 | It demands "the complete telephone", but the word it gives matches a customer NAME, and the telephone only appears on hover | Rewording by whoever owns the case. Not touched here |

## In Retest: 0

Nothing in this folder is awaiting a retest.

## One caveat

Staging was redeployed mid-session, `v26.39.1-97cad2c` → `v26.39.2-51a35e1`. Work Orders and
Customers were measured on the older build, the 32 retests on the newer one. Every result carries
its own build marker, and problem 1 reproduces identically on both. Once the remaining 65 are run,
one clean sweep on a single build would remove the split.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Case links · https://shopview.testrail.io/index.php?/cases/view/<id>
Open tickets: SV-10619, SV-10551. Two tickets prepared and not filed, both blocked on SV-9170
reading "QA Complete": the Q3 root defect (problem 1) and the customer telephone (problem 3).
