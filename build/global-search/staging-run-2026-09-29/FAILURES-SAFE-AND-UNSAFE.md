# The 37 failing tests — safe, and unsafe

Staging **app.staging.shopview.com**, build **v26.39.2-51a35e1**. Checked live on 30 September 2026.

## What the words in this report mean

| Word | What it means here |
|---|---|
| **Test case** | One check a tester runs by hand. Each has a number beginning with C. |
| **Story defect** | The ticket raised with the development team describing a fault, so it gets fixed. Each has a number beginning with SV. |
| **Open** | Nobody has closed that ticket and the fault is still to be fixed. I checked all five this morning — every one is genuinely still open. |
| **SAFE** | The test failed, **and** the fault behind it is already written up in an open story defect. It is on the development team's list. Nothing for you to do. |
| **UNSAFE** | The test failed and there is **no story defect for it**. If nobody raises one, it will not get fixed and it will quietly be forgotten. |

---

# SAFE — 36 failing tests, all covered by an open story defect

These failed, but the fault is already reported and being tracked. You do not need to act on any of
them; you only need to follow the tickets.

| Test case | Which screen | Type this to see it | What goes wrong | Story defect | Its result in the run |
|---|---|---|---|---|---|
| C146197 | Work Orders | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298106) |
| C146198 | Work Orders | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10552](https://shopview.atlassian.net/browse/SV-10552) [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298107) |
| C146202 | Work Orders | `SVEWU82M5ETEJFWFA` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298111) |
| C146205 | Work Orders | `786` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298114) |
| C146206 | Work Orders | `786` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298115) |
| C146209 | Customers | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298118) |
| C146210 | Customers | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298119) |
| C146214 | Customers | `609-461-6502` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298123) |
| C146215 | Customers | `555-222-3333` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298124) |
| C146216 | Customers | `zzautotest.nophone@staging.shopview.local` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298125) |
| C146217 | Customers | `Savannah` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298126) |
| C146218 | Customers | `Apt. 199` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298127) |
| C146222 | Customers | `ZZLONGROW` | The row is missing something it is supposed to show | [SV-10635](https://shopview.atlassian.net/browse/SV-10635) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298131) |
| C146224 | Assets | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298133) |
| C146226 | Assets | `ZZLONGROW` | Your word is on the row but is not marked there | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298135) |
| C146229 | Assets | `SVEWU82M5ETEJFWFA` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298138) |
| C146230 | Assets | `KVQ-2870` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298139) |
| C146233 | Parts | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298142) |
| C146234 | Parts | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298143) |
| C146238 | Parts | `H3B` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298147) |
| C146239 | Parts | `Klondike` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298148) |
| C146240 | Parts | `Gibson's Mobile Diesel Repair` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298149) |
| C146242 | Parts | `496` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298151) |
| C146245 | Vendors | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298154) |
| C146246 | Vendors | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298155) |
| C146251 | Vendors | `ZZHIDDENSUITE` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298160) |
| C146252 | Vendors | `965` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298161) |
| C146257 | Part Sales | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298166) |
| C146258 | Part Sales | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298167) |
| C146262 | Part Sales | `Quietline` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298171) |
| C146263 | Part Sales | `ZZHIDDENVIN0000001` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298172) |
| C146271 | Purchase Orders | `0123` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298180) |
| C146272 | Purchase Orders | `786` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298181) |
| C146273 | Purchase Orders | `Admin ShopView` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298182) |
| C146274 | Purchase Orders | `I-1522` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298183) |
| C146282 | Vendor Invoices | `I2-965` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298191) |

## The story defects behind them

| Story defect | What it is about | Where it stands today | Failing tests it explains |
|---|---|---|---|
| [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | Long text is cut short, so you cannot see what was matched | Open — a fix is being reviewed now | 5 |
| [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | Long text is cut short, so you cannot see what was matched | Open, but stalled — waiting on a decision | 5 |
| [SV-10619](https://shopview.atlassian.net/browse/SV-10619) | Long text is cut short, so you cannot see what was matched | Open — a fix is being reviewed now | 5 |
| [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | The row shows the letters you typed back at you instead of the detail it actually found | Open — I raised it yesterday | 30 |
| [SV-10635](https://shopview.atlassian.net/browse/SV-10635) | A customer row never shows the telephone number, even when you hover over it | Open — I raised it yesterday | 1 |

---

# UNSAFE — 1 failing test, with no story defect at all

| Test case | Which screen | Type this to see it | What goes wrong | Story defect | Its result in the run |
|---|---|---|---|---|---|
| C146264 | Part Sales | `ZZLONGROW` | The row is missing something it is supposed to show | **none** | [open it](https://shopview.testrail.io/index.php?/tests/view/3298173) |

**What is wrong.** A part-sale row is supposed to show four things: the sale number and the
customer, its status, the total price, and the date it was created. Three of them are there. The
price is not shown anywhere on the row.

**See it for yourself.** Press `Ctrl`+`K`, type `ZZLONGROW`, open the *Part sales* tab. The row
reads `P2-2277 ZZLONGROW Heavy Haulage… Estimate · Admin ShopView · Today`. There is no price.

**Why it is unsafe.** This is the only failure in the whole folder that nobody has written up. It
is not part of any of the five tickets above, so if it is left as it is, it will not reach the
development team at all.

**I have not raised it.** Say the word and I will, with the same layout and pictures as the other
two.

---

## One thing I corrected before writing this

When the results were first written into the run, the ticket link on each one was chosen by a rough
rule based on the test's name rather than the fault it actually hit. **Twelve of the thirty-seven
pointed at the wrong ticket** — the customer-telephone test, for instance, pointed at the
cut-off-text tickets instead of its own. Every one has been re-checked against what actually went
wrong, corrected, and re-posted into the run. The grouping above is built from the corrected list.

Had I built it from what was first recorded, the totals would still have added up to 37 and a third
of the rows would have been wrong.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Open story defects: SV-10634 · SV-10635 · SV-10552 · SV-10619 · SV-10551
No story defect: C146264 — the part-sale row shows no total price
