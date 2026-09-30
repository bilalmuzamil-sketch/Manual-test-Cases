# Search Results Integrity — the full picture

Staging **app.staging.shopview.com**, build **v26.39.2-51a35e1**. All 110 tests run; checked live
on 30 September 2026.

## What the words mean

| Word | What it means here |
|---|---|
| **Test case** | One check a tester runs by hand. Each has a number beginning with C. |
| **Story defect** | The ticket raised with the development team describing a fault, so it gets fixed. Each has a number beginning with SV. |
| **Open** | Nobody has closed that ticket; the fault is still to be fixed. I checked all five this morning — every one is genuinely open. |
| **SAFE** | The test failed, **and** the fault behind it is already written up in an open story defect. It is on the development team's list. Nothing for you to do. |
| **UNSAFE** | The test failed and **no story defect exists for it**. Left alone it would never reach the development team. |
| **BLOCKED** | The test could not be judged either way. In every case here the reason is the example the test gives, not the product. |

## Where it all stands

| | Count |
|---|---:|
| Passed | **64** |
| Failed — SAFE, already reported | **37** |
| Failed — UNSAFE, not reported | **0** |
| Blocked — cannot be judged | **4** |
| Removed (cases you deleted) | 4 |
| Not applicable (the case says so itself) | 1 |
| **Total** | **110** |

---

# SAFE — 37 failing tests, every one already reported

Nothing here needs you. Follow the tickets.

| Test case | Which screen | Type this to see it | What goes wrong | Story defect | Its result in the run |
|---|---|---|---|---|---|
| C146197 | Work Orders | `ZZLONGROW` | The row does not show the whole value that was found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298106) |
| C146198 | Work Orders | `ZZLONGROW` | Long text is cut short, right through the word you searched for | [SV-10552](https://shopview.atlassian.net/browse/SV-10552) [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298107) |
| C146202 | Work Orders | `SVEWU82M5ETEJFWFA` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298111) |
| C146204 | Work Orders | `Veljkovic` | The row shows your own typing back instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open it](https://shopview.testrail.io/index.php?/tests/view/3298113) |
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
| [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | Long text is cut short, so you cannot see what was matched | Open — a fix is in review now | 5 |
| [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | Long text is cut short, so you cannot see what was matched | Open, but stalled — waiting on a decision | 5 |
| [SV-10619](https://shopview.atlassian.net/browse/SV-10619) | Long text is cut short, so you cannot see what was matched | Open — a fix is in review now | 5 |
| [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | The row shows the letters you typed back at you instead of the detail it actually found | Open — raised by me yesterday | 31 |
| [SV-10635](https://shopview.atlassian.net/browse/SV-10635) | A customer row never shows the telephone, even when you hover over it | Open — raised by me yesterday | 1 |

---

# UNSAFE — none

Every failing test is now covered by an open story defect. There is nothing unreported.

This changed twice yesterday and today, and both changes were mine to make:

* The part-sale price was the one unreported failure. **It was not a fault at all** — you showed
  that the sale had no parts on it, so there was no price to show. With a part added, the price
  appears. Now recorded as passing.
* One test that had been set aside now has a real example in it, so I ran it — and it fails the
  same way as the other thirty. It is in the SAFE list above, covered by the existing ticket.

---

# BLOCKED — 4 tests that cannot be judged

None of these is a sign of anything wrong with the product. In each one the example the test gives
cannot show whether the screen is right or wrong.

**Why a value typed in full proves nothing.** If you type a postcode in full and the row shows that
postcode, you cannot tell whether the screen is showing you the record's real postcode or just
repeating what you typed — they look identical. The only way to tell is to type PART of the value
and see whether the row shows the whole of it. For these tests no shorter piece finds the record,
so the question cannot be asked.

| Test case | Which screen | Type this | Why it cannot be judged | What would let us judge it | Its result in the run |
|---|---|---|---|---|---|
| C146221 | Customers | `H8A3X9` | The example is a postcode typed in full | A customer whose postcode can still be found by typing PART of it | [open it](https://shopview.testrail.io/index.php?/tests/view/3298130) |
| C146241 | Parts | `.Brake Parts` | The example is a category typed in full, and no shorter piece reaches the same part | A category distinctive enough that part of it finds only that one part | [open it](https://shopview.testrail.io/index.php?/tests/view/3298150) |
| C146250 | Vendors | `zzhidden.vendor@staging.shopview.local` | The example is an email typed in full, and no shorter piece finds the vendor at all | A vendor whose email can still be found by typing part of it | [open it](https://shopview.testrail.io/index.php?/tests/view/3298159) |
| C146301 | All tab and cross-tab | `9` | Held by its own instructions — nobody has decided what one or two letters should do | A decision on what a one or two letter search should do | [open it](https://shopview.testrail.io/index.php?/tests/view/3298210) |

**Two things I noticed while trying to unblock these**, both worth a separate look:

* On the postcode row the label just reads *"Matched:"* rather than naming the postcode, unlike
  work-order rows which say *"VIN:"* or *"Advisor:"*. A reader cannot tell what was matched.
* A vendor's email address cannot be found by typing part of it — only the complete address works.
  That may be worth deciding on in its own right.

---

## Corrections I made to my own results

I would rather you knew these than found them later.

* **The part-sale price.** I reported the row as missing the total price. It was not: the sale had
  no parts, so there was no price. That is the third time I reported a field as missing when the
  record simply had nothing to put in it. The check now looks at whether any other row in the same
  result shows that field before blaming the screen, and says plainly when it cannot tell.
* **Twelve tests pointed at the wrong ticket.** The links were first chosen by a rough rule based
  on each test's name rather than the fault it hit. All re-checked and corrected.
* **Two results flipped back to passing** when the suite re-ran, because I had corrected them in
  the record but not in the tests. Both are now fixed in the tests.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Open story defects: SV-10634 · SV-10635 · SV-10552 · SV-10619 · SV-10551
Blocked: C146221 · C146241 · C146250 · C146301
Deleted as intended: C146203 · C146219 · C146253 · C146254
Not applicable: C146213
