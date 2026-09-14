# READINESS HANDOFF — the 19 V1-regression cases, QA branch sv9160

**Date:** 2026-09-14 · **Environment:** `sv9160.qa.shopview.com` (API `sv9160api.qa.shopview.com`)
**Verdict: READY FOR TEST-RUN EXECUTION — no build-verification pass needed first.**

Build verification would ask "can a tester execute these steps at all?" That question is already
answered: I executed the seeding and the searches myself against this branch. The environment is up,
the search endpoint responds, and seeded records are being indexed and returned.

## 1 · The cases
| | |
|---|---|
| Cases I authored | **19** — C53578-C53589, C53601-C53607 |
| All in section 6769 | ✅ (section total 40) |
| All in **run 415** "Global Search V2 — Full Suite" | ✅ (139 tests, union-only sync, 0 tests lost) |
| House format, `refs` source, provenance block, automation marker | ✅ verified on all 19 |

## 2 · Seed data — CREATED on the QA branch
| Entity | Identity | ID |
|---|---|---|
| Customer | ZZAUTOTEST Bridgeport Hauling (address 1+2, city, state, postal, phone, **website**) | `c01eab9e-e400-474c-aaa9-a8a93a346add` |
| Contact | Marlene Okonkwo, title *Dispatch Supervisor* | `10991ac6-656e-43dd-9dc1-dc96c81fa303` |
| Asset | 2019 Freightliner Cascadia, unit `ZZT-4471`, VIN `1FUJGLDR9KLZZ4471`, plate `OHZZT471` | `b7d49e1e-9c00-4070-bd42-c9d83da9b80c` |
| Vendor | ZZAUTOTEST Kestrel Parts Supply (address, city, state, postal, **email**) | `7379aa02-c999-4659-b017-a8661c450af9` |
| Catalogue part — **never stocked** | ZZAUTOTEST Airline Coupler Vernway / `ZZT-77-3300` | `c7c4b204-32d8-43e9-94dd-c2e6abe1c463` |
| Catalogue part — intended stocked | ZZAUTOTEST Brake Chamber Kestrel / `ZZT-88-4412` | `74d3e14e-3714-4e9d-8e6f-86a8be45a6cc` |
| Work orders ×4 | `S9160-17580` … `S9160-17583`, same customer + asset | see `qa-seed-state.json` |

**Runtime values are filled in** `seed-data.json` → `_runtime_values`: shop number **9160**, the four
WO numbers, and the exact three number forms C53579 should try.

## 3 · ⚠️ ONE SEEDING ITEM REMAINS — 5 minutes in the UI
**The "stocked" part has no stock.** There is no API route that puts a catalogue part into inventory
(stock arrives through the receive-order flow), so this was not automatable here.

**Do this before running C53607 and C53601:** put `ZZAUTOTEST Brake Chamber Kestrel` (`ZZT-88-4412`)
into inventory with **quantity > 0**, and **leave `ZZAUTOTEST Airline Coupler Vernway` (`ZZT-77-3300`)
untouched in the catalogue**. The contrast between the two IS the test.

Everything else is seeded; the other 17 cases need nothing further.

## 4 · Read this before executing — it will save the tester hours
`EARLY-SIGNALS-FROM-SEED-VERIFICATION.md` (same folder) records what I already observed. In short:

- **Already observed PASSING:** customer name · address 1 · **address 2** · city · contact last name ·
  **name with spaces removed** · vendor address · vendor city · VIN *prefix* · **work order by customer
  name (all 4, newest first)** · **part by description**.
- **Already observed NOT reproduced:** customer postal code · customer website · contact job title ·
  asset unit number · asset full VIN · asset licence plate · vendor email · vendor postal code ·
  vendor state · catalogue-only part.
- 🔴 **A pattern:** free-text matching works, **exact-identifier matching does not** — part numbers of
  three real stocked parts, the full VIN, the unit number and the vendor email all fail, while the
  same records are returned by their names. PRD §7 requires identifiers to match exactly after
  normalization, so several of these look like **defects rather than scope cuts**, and they also put
  existing cases **C44844 (VIN)** and **C44846 (part number)** at risk.
- **Test the work-order number search early** (`S9160-17580`). It was not probed in isolation, and if
  the identifier path is broken generally it will fail too — it is the most-used search in the product.

## 5 · Standing instruction inside the cases
Nine cases carry a **PO DECISION** note telling the tester to **record and flag, not raise a defect**
(postal codes, website, job title, licence plate, vendor state, catalogue-only parts, WO number forms).
That instruction is now demonstrably correct: those fields are absent from PRD v1.5 §4, so a failure
is a scope question. The identifier failures in §4 above are the opposite — those are defect candidates.

## 6 · Not done by me, by design
No test results were recorded and no tickets were raised — execution and ticketing belong to the
separate session.
