# The 37 failing checks, split by whether a report exists

Staging **app.staging.shopview.com**, build **v26.39.2-51a35e1**, run 415. How to reproduce each
one is in `REPRODUCE-THE-37-FAILURES.md`; this splits them the way you asked.

## Group 1 — already reported (36 checks)

Nothing to do here but track the reports. Three of these reports were already open before this
pass; two I raised.

| Check | Where | Type this | What goes wrong | Report | Result |
|---|---|---|---|---|---|
| C146197 | Work Orders | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298106) |
| C146198 | Work Orders | `ZZLONGROW` | long text cut off through the word you searched for | [SV-10552](https://shopview.atlassian.net/browse/SV-10552) [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | [open](https://shopview.testrail.io/index.php?/tests/view/3298107) |
| C146202 | Work Orders | `SVEWU82M5ETEJFWFA` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298111) |
| C146205 | Work Orders | `786` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298114) |
| C146206 | Work Orders | `786` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298115) |
| C146209 | Customers | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298118) |
| C146210 | Customers | `ZZLONGROW` | long text cut off through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open](https://shopview.testrail.io/index.php?/tests/view/3298119) |
| C146214 | Customers | `609-461-6502` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298123) |
| C146215 | Customers | `555-222-3333` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298124) |
| C146216 | Customers | `zzautotest.nophone@staging.shopview.local` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298125) |
| C146217 | Customers | `Savannah` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298126) |
| C146218 | Customers | `Apt. 199` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298127) |
| C146222 | Customers | `ZZLONGROW` | a row is missing something the requirement promises | [SV-10635](https://shopview.atlassian.net/browse/SV-10635) | [open](https://shopview.testrail.io/index.php?/tests/view/3298131) |
| C146224 | Assets | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298133) |
| C146226 | Assets | `ZZLONGROW` | the match is not marked on the line containing it | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298135) |
| C146229 | Assets | `SVEWU82M5ETEJFWFA` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298138) |
| C146230 | Assets | `KVQ-2870` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298139) |
| C146233 | Parts | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298142) |
| C146234 | Parts | `ZZLONGROW` | long text cut off through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open](https://shopview.testrail.io/index.php?/tests/view/3298143) |
| C146238 | Parts | `H3B` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298147) |
| C146239 | Parts | `Klondike` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298148) |
| C146240 | Parts | `Gibson's Mobile Diesel Repair` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298149) |
| C146242 | Parts | `496` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298151) |
| C146245 | Vendors | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298154) |
| C146246 | Vendors | `ZZLONGROW` | long text cut off through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open](https://shopview.testrail.io/index.php?/tests/view/3298155) |
| C146251 | Vendors | `ZZHIDDENSUITE` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298160) |
| C146252 | Vendors | `965` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298161) |
| C146257 | Part Sales | `ZZLONGROW` | the whole matched value is not shown | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298166) |
| C146258 | Part Sales | `ZZLONGROW` | long text cut off through the word you searched for | [SV-10619](https://shopview.atlassian.net/browse/SV-10619) [SV-10551](https://shopview.atlassian.net/browse/SV-10551) [SV-10552](https://shopview.atlassian.net/browse/SV-10552) | [open](https://shopview.testrail.io/index.php?/tests/view/3298167) |
| C146262 | Part Sales | `Quietline` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298171) |
| C146263 | Part Sales | `ZZHIDDENVIN0000001` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298172) |
| C146271 | Purchase Orders | `0123` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298180) |
| C146272 | Purchase Orders | `786` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298181) |
| C146273 | Purchase Orders | `Admin ShopView` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298182) |
| C146274 | Purchase Orders | `I-1522` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298183) |
| C146282 | Vendor Invoices | `I2-965` | the row repeats your typing instead of the detail it found | [SV-10634](https://shopview.atlassian.net/browse/SV-10634) | [open](https://shopview.testrail.io/index.php?/tests/view/3298191) |

**Which report covers what**

| Report | Covers | Checks |
|---|---|---|
| SV-10634 (raised by me) | The row repeats your typing instead of the detail it matched, including where the whole value is not shown and where the match is not marked on the line holding it | 30 |
| SV-10552 · SV-10619 · SV-10551 (already open) | Long text cut off through the word you searched for | 5 |
| SV-10635 (raised by me) | The customer row never shows the telephone on hover | 1 |

## Group 2 — NOT reported yet (1 check)

| Check | Where | Type this | What goes wrong | Report | Result |
|---|---|---|---|---|---|
| C146264 | Part Sales | `ZZLONGROW` | a row is missing something the requirement promises | — | [open](https://shopview.testrail.io/index.php?/tests/view/3298173) |

**The one thing here.** A part-sale row does not show the total price. Type `ZZLONGROW`, open
*Part sales*: the row reads `P2-2277 ZZLONGROW Heavy Haulage… Estimate · Admin ShopView · Today`.
The sale number, the customer, the status and the date are all there; there is no price anywhere on
the row. The written requirement lists the total price as one of the four things the row shows.

I have not raised it — say the word and I will.

## One correction you should know about

When I first wrote the report links into these results I assigned them with a rough rule based on
each check's title, and **twelve of the thirty-seven pointed at the wrong report**. The worst was
the customer-telephone check, which pointed at the three cut-off-text reports instead of its own.
All thirty-seven have been re-checked against the actual fault each one hit, corrected, and
re-posted into the run. The counts above come from the corrected list.

---REFERENCE---
Run 415 · https://shopview.testrail.io/index.php?/runs/view/415
Raised in this pass: SV-10634 · SV-10635
Already open: SV-10552 (Blocked) · SV-10619 · SV-10551
Unreported: C146264 — the part-sale row has no total price
