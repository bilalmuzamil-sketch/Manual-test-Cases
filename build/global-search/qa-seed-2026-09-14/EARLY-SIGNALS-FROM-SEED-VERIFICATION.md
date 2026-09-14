# EARLY SIGNALS — observed while verifying the QA seed, 2026-09-14

**Status of these observations.** They came from verifying that seeded data is findable, **not** from a
formal test-run execution. They are **strong signals, not filed results** — execution and ticketing sit
with the separate session. Every one is reproducible with the query shown.

**Environment:** QA branch `sv9160.qa.shopview.com`, API `sv9160api.qa.shopview.com`.
**V2 search endpoint:** `GET /api/search?q=<term>` (minimum 2 characters, enforced).
🔴 **V1's endpoint `GET /api/global-search/fetch` returns 404 on this branch — it is gone, as planned.**

## The control that makes these findings safe to trust
The seeded asset **is** in the V2 index: searching its owner name `ZZAUTOTESTBridgeport` returns it
(`primary: "2019 Freightliner Cascadia"`, `secondary: "ZZAUTOTEST Bridgeport Hauling"`). So a field that
does not find it is **a field-level miss, not indexing lag**. The seeded customer and vendor are
likewise indexed and returned by other fields.

## Reproduced in V2 — V1 capability preserved ✅
| Query | V1 capability | V2 |
|---|---|---|
| `Bridgeport` | customer name | ✅ returns the customer |
| `Kestrelway` | customer address line 1 | ✅ |
| `Fernvale` | customer city | ✅ |
| `Dock 7B` | customer **address line 2** | ✅ |
| `Okonkwo` | contact last name | ✅ (as a Contact match on the company) |
| `ZZAUTOTESTBridgeportHauling` | customer name **with spaces removed** | ✅ — the V1 double-index behaviour survives |
| `Halbrook` | vendor address | ✅ |
| `Marnston` | vendor city | ✅ |
| `1FUJGLDR9KL` | VIN **prefix** | ✅ returns the seeded asset |

## NOT reproduced in V2 — V1 could, V2 could not 🔴
| Query | V1 capability | V2 result | Class |
|---|---|---|---|
| `ZZT-4471` / `ZZT4471` | **asset unit number** | **0 results** | 🔴 **Defect — PRD v1.5 §4 explicitly indexes "unit number" for Assets** |
| `1FUJGLDR9KLZZ4471` | **asset full VIN** | **0 results**, while the 11-char prefix `1FUJGLDR9KL` DOES return it | 🔴 **Defect — §4 indexes VIN and §7 requires exact match after normalization. A prefix working while the exact value fails points at a length/tokenisation bug** |
| `OHZZT471` | asset licence plate | 0 results | 🟠 PO decision (§4 omits licence plate) — matches the flag already on C53516 |
| `44872-9931` | customer postal code | 0 results | 🟠 PO decision (§4 omits it) — matches the flag on C53582 |
| `bridgeporthauling-zzt.com` | customer website | 0 results | 🟠 PO decision (§4 omits it) — matches the flag on C53583 |
| `Dispatch Supervisor` | contact **job title** | 0 results | 🟠 PO decision (§4 lists contact names/phones/emails, not title) — matches C53603 |
| `parts@kestrelsupply-zzt.com` | vendor email | 0 results | 🔴 **Defect — §4 explicitly indexes vendor "email"** |
| `43055-2210` | vendor postal code | 0 results | 🟠 PO decision — matches C53585 |
| `Ohio` | vendor state/province | 0 results | 🟠 PO decision — matches C53606 |

## Deliberately NOT concluded yet
- **Parts.** Both seeded parts are currently **catalogue-only** (no inventory record was added yet), and
  V2 searches Parts *(Inventory)*. Their absence is therefore **expected** and proves nothing until the
  stocked part actually has stock. **C53601 is not yet evidenced either way** — do not read the earlier
  "not found" as confirmation.
- An earlier pass appeared to show `ZZT-4471` returning one asset; a clean re-query returned **zero
  groups**. The zero result is the reproducible one. Recorded so nobody chases the transient.

## Why this matters for the suite
Three of my cases now have a predicted outcome: **C53580 (unit), C53584 (vendor email)** look like real
defects rather than PO decisions, and **C53616-class PO items** (postal, website, title, plate, state)
behave exactly as the cases anticipate — the cases tell the tester to *record and flag*, not raise a
defect, which is now demonstrably the right instruction.

**The unit-number and full-VIN misses are the ones most likely to generate the customer complaint the
QA lead is trying to prevent** — a fleet user searches by unit number constantly.

---

# PART 2 — further evidence gathered after the seed completed

## C53601 (catalogue-only part) — now EVIDENCED, not predicted
Both seeded parts are in the **catalogue (2 found)** and **neither is in inventory (0 found)**.
V2 search returns **neither**. Meanwhile the customer, asset and work orders created in the same
window **are** indexed and returned. So this is a behaviour difference, not indexing lag:

> **A part that exists in the parts catalogue but has never been stocked was findable in V1 and is
> not findable in V2.** This is the change most likely to produce "I could search this part in V1 and
> I can't now". It is arguably intended (PRD §4 scopes Parts to *Inventory*), which is exactly why it
> needs a PO ruling rather than a defect.

## C53578 (work order by customer name) — OBSERVED PASSING ✅
Searching `ZZAUTOTEST Bridgeport` returns all four seeded work orders
(`S9160-17583/17582/17581/17580`, secondary `ZZAUTOTEST Bridgeport Hauling`), **newest first**, which
also supports C53588's expectation.

## C53607 (part by description) — OBSERVED PASSING ✅
Verified against three real stocked inventory parts: `FUEL/WATER`, `12-10`, `CONNECTOR` each return
the matching part.

## 🔴 A PATTERN WORTH THE TEAM'S ATTENTION: identifier matching looks broken
Free-text fields work; **exact identifiers do not**. Reproduced on real, pre-existing data as well as
on the seed:

| Identifier searched | Real record | Result |
|---|---|---|
| `P550848` | part FUEL/WATER SEPARATOR (qty 6) | parts group returns rows, **not this part** |
| `2--83-2511PK` | part 12-10 GA RING TERMINAL (qty 46) | **not returned** |
| `84-2005` | part CONNECTOR (qty 14) | **not returned** |
| `1FUJGLDR9KLZZ4471` | seeded asset — full VIN | **not returned** (the 11-char prefix `1FUJGLDR9KL` DOES return it) |
| `ZZT-4471` / `ZZT4471` | seeded asset — unit number | **not returned** |
| `parts@kestrelsupply-zzt.com` | seeded vendor — email | **not returned** |

Against that, **names, descriptions, addresses, cities and customer names all match correctly.**

PRD v1.5 §7 requires identifier fields (WO number, part number, VIN, phone) to match **exactly after
normalization**, and §4 indexes part number, VIN, unit number and vendor email. **So these are defect
candidates, not scope cuts** — and they also put existing V2 cases **C44844 (VIN), C44846 (part
number)** at risk of failing.

**Not concluded:** work-order number search (`S9160-17583`) was not probed in isolation; the separate
execution session should test it early, because if the identifier path is broken generally it will
fail too — and that is the single most-used search in the product.

---

# PART 3 — seeding COMPLETE, and a controlled experiment that settles two questions

The stocked part now exists: **ZZAUTOTEST Brake Chamber Kestrel / `ZZT-88-4412`, quantity 25**,
inventory part `a123b4e5-39ed-40a6-bc64-ced030673daa`, bin `General Storage`, grid location
`BIN-ZZT-77`. State: **inventory = 1, catalogue = 2**, so `ZZT-77-3300` is the catalogue-only control.

This makes the two parts a controlled pair — created minutes apart, same org, same vendor, same tags.
The only difference is stock.

| Query | What it is | V2 result |
|---|---|---|
| `Kestrel` | stocked part, description word | ✅ **returned** |
| `Brake Chamber` | stocked part, description | ✅ **returned** |
| `ZZT-88-4412` | **the same stocked part's own part number** | 🔴 **NOT returned** |
| `ZZT884412` | same, dashes stripped | 🔴 **NOT returned** |
| `Vernway` | catalogue-only part, name | ⚪ not returned |
| `ZZT-77-3300` | catalogue-only part number | ⚪ not returned |
| `BIN-ZZT-77` | bin / grid location | 🔴 **NOT returned** |

## What this settles

**1. The part-number failure is now airtight, not circumstantial.** The part is demonstrably **in the
index** — its description returns it. Its own part number does not. That removes every alternative
explanation (not indexed, indexing lag, wrong org, permissions). PRD v1.5 §4 indexes part number and
§7 requires identifier fields to match exactly after normalization. **This is a defect.** It is the
same failure shape already seen on asset unit number, full VIN and vendor email — and it puts
existing case **C44846** at risk.

**2. C53601 is confirmed.** With the stocked twin returning on its name, the catalogue-only part
returning nothing is now clean evidence that **a part a V1 user could find is unfindable in V2** once
it has never been stocked. Whether that is acceptable is the PO's call — the case says record-and-
Blocked, which is right.

**3. Bin location is indexed per §4 but does not match.** `BIN-ZZT-77` returns nothing. Worth a look
during execution; it is outside my 19 cases (it is V2-new functionality, not a V1 regression).

---

## 🔴 CORRECTION AND RE-TEST — BIN LOCATION, 2026-09-14 (second pass, with the instrument proved)

**The earlier `BIN-ZZT-77` line in this file was WITHDRAWN and is now REPLACED by a proved result.**

**Why the first attempt was invalid.** I reported `BIN-ZZT-77` returning nothing as a signal. The bin
location did not exist — I had only written that string into the free-text `grid_location` column on one
inventory part. Searching for a record that was never created and finding nothing proves nothing
(Standing Rule 104: a negative finding must first prove the instrument worked).

**The QA lead then (a) created the bin location and (b) settled the ambiguity:** *"Bin Locations are
Grid locations"*, managed at `https://app.shopview.com/administration/bins`. So there is **one** concept,
not two, and the open PO question about which one PRD v1.5 §4 means is **CLOSED**.

### The instrument, proved before any conclusion

| Check | Result |
|---|---|
| Does the bin exist? | **YES** — `GET /api/inventory/bin-locations` returns `BIN-ZZT-77`, id `972733fe-4731-40aa-8b86-923e9f5caf73`, 555 units, 1 part |
| Is a part actually in it? | **YES** — part **P550848**, *"FUEL/WATER SEPARATOR, (FS19732, 33732, BF1385-SPS)"*, quantity 555 in that bin |
| Is that part in the search index at all? | **YES** — it is returned by other queries |
| Does bin-location search work *at all* in V2? | **YES** — `H3B` returns 13 parts, `General Storage` returns 19 |

### The finding — a controlled comparison inside a single record

**P550848 sits in two bins at once:** `H3B` (999 units, default) and `BIN-ZZT-77` (555 units).

| Query | Rows | Contains P550848 |
|---|---|---|
| `H3B` | 13 parts | **YES** |
| `BIN-ZZT-77` | **0** | no |

**Same record. Same field. Two values. One is indexed, the other is not.** That eliminates permissions,
organization scoping, the part being absent from the index, and bin search being unimplemented. What is
left is that **the search index holds a stale copy of this part's bin list** — the newly added bin was
never indexed. Four query forms were tried (`BIN-ZZT-77`, `BIN ZZT 77`, `BINZZT77`, `ZZT-77`); all zero.

### 🔴 WHAT THIS IS, AND WHAT IT IS NOT

**It is NOT a V1 regression, and it gets no case in section 6769.** V1 never indexed bin or grid
location at all — V1's part search text was `cp.name` and `cp.part_number` and nothing else
(`FetchDataQueryHandler.php:324-328` at baseline `55767168`). Nobody could search a bin location in V1,
so nothing was lost.

**It IS a V2 defect against V2's own specification** — PRD v1.5 §4 indexes bin location for Parts and §9
requires the index to refresh within 30 seconds. It belongs to the **V2 functional suite**, not to this
V1 regression suite, and is recorded here so the finding is not lost.

**Related, and noticed on the way:** searching the part number `P550848` returns a *different* part
(*"Fuel/Water Separator, Cummins QSB | FS19732"*) rather than the P550848 record itself — another
instance of the identifier-matching problem already reported.

### One thing that produced NO finding, deliberately

Creating a part sale through `POST /api/work-orders/create` returned **HTTP 500** (request ids
`d630fc5e…`, `d50aeb87…`, `8adc4b7b…`). **A control with `type: service` returned 500 as well**, so the
failure is not part-sale-specific and is most likely my payload missing a required field rather than a
build defect. **No defect is claimed from it** — the instrument was not proved, so there is no finding.
The part sale that C55665 needs must be created through the UI; the case's preconditions already say so.
