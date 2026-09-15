# The demonstrated old-search behaviours, reconciled against the regression suite

**Source of the checklist:** *How the old search behaved* — the runnable rebuild of the previous
search at commit `55767168`, 42 keywords, each naming the field it comes from and the records that
should come back. Read live on 15 September 2026.

**Reconciled against:** run 415, the **65** cases that declare the V1 standard in their own Expected
text, read live from the run on 15 September 2026 — not from any extract.

**How a preset was judged covered.** A case counts only if one of its STEPS actually types that kind
of thing into the search box. A case that merely mentions the field in passing does not count, and
neither does a case whose title claims the behaviour while its steps type something else — that
distinction is what found three of the four gaps.

## The answer

**38 of the 42 are covered. Four are not.** All four are things the demo shows the old search doing
and no test in the suite ever types.

| | What the old search did | Why it is not covered |
|---|---|---|
| 1 | **Part of a phone number** — `555-0143` finds the customer whose number is (419) 555-0143 | Two cases type a phone number and both type it WHOLE, in two formats (C55662 customer, C55663 supplier). The case that covers partial numbers (C55659) types the tail of a work order number, a part number and a unit number — never a phone. The demo records this as returning nothing on the new version. |
| 2 | **A contact's own phone number** — `419-555-0177`, different from the company switchboard | No case in the whole run types it. C55662 covers the company's own number and says in its own text that *"an existing case covers a CONTACT's phone number"* — **that is not true**, and the wrong cross-reference is why the gap was invisible. |
| 3 | **The make on its own** — `Freightliner` | No regression case types the make alone. C55664 (model) justifies the omission by saying *"the suite has a case that searches a misspelled MAKE (Freightliner), which proves the make is searchable"* — that case is **C44841**, a FEATURE case judged against the new specification, and it is **Untested**. A capability cannot be proved by a test nobody has run, against a different standard. |
| 4 | **The year on its own** — `2019` | C53605 is titled *Finding an asset by its year* and its only step types **`2019 Freightliner`** — the year and the make together, which is a different behaviour and the one raised as SV-10055. So the year alone is never typed, and the case's title promises something its steps do not do. |

Gaps 2, 3 and 4 share one cause worth naming: **a case justified its own scope by pointing at another
case, and nobody checked the pointer.** One pointed at a case that does not exist, one at a case from a
different standard that has never been run, and one pointed at itself while typing something else.

## What each gap needs

| Gap | To close it |
|---|---|
| Part of a phone number | One step added to C55662: clear the box, type the last seven characters of the same number, read the Customers group. The demo predicts it returns nothing, which makes it a finding rather than a formality. |
| A contact's own phone | One case, or a step on C55670, typing the contact's own number — and the false sentence removed from C55662. |
| The make on its own | One step on C55664, or its own case: type `Freightliner`, read the Assets group. The claim in C55664's text needs correcting either way. |
| The year on its own | Split C53605: step 1 types `2019` (the year, which is what the case is called), step 2 types `2019 Freightliner` (the year and make together, which is what it types today). |

## Every preset, and the case that types it

| # | Area | What is typed | The field it comes from | Case that types it |
|---|---|---|---|---|
| 1 | Customers | `ZZAUTOTEST Bridgeport Hauling` | Customer name | C55667 · C53578 · C55665 · C53581 |
| 2 | Customers | `ZZAUTOTESTBridgeportHauling` | Customer name (space-free copy) | C53602 |
| 3 | Customers | `idgepor` | Customer name | C55660 |
| 4 | Customers | `Kestrelway` | Address line 1 | C53582 |
| 5 | Customers | `Dock 7B` | Address line 2 | C53604 |
| 6 | Customers | `Fernvale` | City | C53582 |
| 7 | Customers | `ernva` | City | C55660 |
| 8 | Customers | `Ohio` | State or province | C53582 · C53606 |
| 9 | Customers | `44872-9931` | Postal code | C53582 |
| 10 | Customers | `419-555-0143` | Telephone | C55662 |
| 11 | Customers | `555-0143` | Telephone (partial) | **NOTHING — gap** |
| 12 | Customers | `bridgeporthauling-zzt.com` | Website | C53583 |
| 13 | Contacts | `Marlene` | Contact first name | C55670 |
| 14 | Contacts | `Okonkwo` | Contact last name | C55670 |
| 15 | Contacts | `Dispatch Supervisor` | Contact job title | C53603 |
| 16 | Contacts | `419-555-0177` | Contact telephone | **NOTHING — gap** |
| 17 | Assets | `ZZT-4471` | Unit number | C53580 |
| 18 | Assets | `1FUJGLDR9KLZZ4471` | Chassis number (VIN) | C55669 |
| 19 | Assets | `ZZ4471` | Chassis number (partial) | C55669 |
| 20 | Assets | `OHZZT471` | Licence plate | C53516 |
| 21 | Assets | `2019` | Year | **NOTHING — gap** |
| 22 | Assets | `Freightliner` | Make | **NOTHING — gap** |
| 23 | Assets | `Cascadia` | Model | C55664 |
| 24 | Assets | `2019 Freightliner` | Year + Make | C53605 |
| 25 | Jobs | `17611` | Job number (plain) | C55672 · C55659 |
| 26 | Jobs | `S-17611` | Job number | C53579 |
| 27 | Jobs | `S9160-17611` | Job number (shop-prefixed) | C53579 |
| 28 | Jobs | `Estimate` | Status | C55658 |
| 29 | Jobs | `qualitycheck` | Status (two words joined) | C55658 |
| 30 | Vendors | `ZZAUTOTEST Kestrel Parts Supply` | Vendor name | C55668 |
| 31 | Vendors | `Halbrook` | Address line 1 | C53585 |
| 32 | Vendors | `Bay 12C` | Address line 2 | C53604 |
| 33 | Vendors | `Marnston` | City | C53585 |
| 34 | Vendors | `43055-2210` | Postal code | C53585 |
| 35 | Vendors | `614-555-0188` | Telephone | C55663 |
| 36 | Vendors | `parts@kestrelsupply-zzt.com` | Email | C53584 |
| 37 | Parts | `ZZT-77-3300` | Part number | C53601 |
| 38 | Parts | `ZZT773300` | Part number (dash-free copy) | C55666 |
| 39 | Parts | `Vernway` | Part description | C53601 · C53607 |
| 40 | Edge cases | `Darlene` | Customer name | C55685 · C55686 |
| 41 | Edge cases | `a` | — | C45161 |
| 42 | Edge cases | `zzzqqq` | — | C55675 · C55679 |

## Notes that are not gaps

* **The demo's records are illustrative, not the live seed.** It models Marlene Okonkwo as a CONTACT
  of Bridgeport Hauling; the branch is also seeded with a separate customer called ZZAUTOTEST Marlene
  Freight Lines, which is the one the near-spelling tests use. Both exist, and the behaviours line up;
  only the example records differ. The page's line *"the same eight the test suite is seeded with"* is
  the thing to correct, not the tests.
* **Three rows per kind of record.** The demo shows the old cap of three per group and no overall
  limit. The new version shows five per group and caps every count at twenty, and the specification
  says so in as many words (v1.5 §5.2, "raised from today's 3"). A deliberate change, so no
  regression test is owed for it.
* **The two matching rules** the demo rebuilds — the visible name matched from its START with spaces
  kept, and the whole detail text matched ANYWHERE with spaces removed — are what several cases rest
  on (C55660 mid-word, C53602 space-free, C55659 partial numbers, C55672 plain number). They are
  covered as behaviours even though no case names the rules.

---REFERENCE---
Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 — QA branch sv9160, build
v26.36.4-7869ff2. Case links take the form https://shopview.testrail.io/index.php?/cases/view/<id>.
Gaps: C55662 (partial phone, and the false cross-reference), C55670 (contact phone), C55664 (make,
and its cross-reference to C44841), C53605 (year alone vs year+make, SV-10055).
Checklist and mapping: PRESETS.json, MAPPING.json, COVERAGE.json, reconcile.py in this folder.
