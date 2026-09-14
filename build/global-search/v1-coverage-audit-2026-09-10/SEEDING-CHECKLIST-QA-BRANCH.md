# SEEDING CHECKLIST — what to create on the QA branch before running my 19 cases

**Scope:** the 19 cases I authored in section 6769 (C53578-C53589, C53601-C53607). Seed this once;
all 19 then run against it. Values are the canonical ones in `seed-data.json` — every keyword is
unique to a single field, so a hit proves that field is searchable rather than another field matching
by accident.

**Feasibility was VERIFIED against the API at baseline `55767168`, not assumed.** Several fields are
absent from the shipped e2e factories but ARE supported by the API — seeding those needs the
change/edit call, not create. Each is called out below.

## 1 · Customer — "ZZAUTOTEST Bridgeport Hauling"
| Field | Value | How |
|---|---|---|
| name | `ZZAUTOTEST Bridgeport Hauling` | `POST /customers/create` |
| address 1 | `1450 Kestrelway Industrial` | create |
| city | `Fernvale` | create |
| state/province | `Ohio` | create |
| postal code | `44872-9931` | create |
| telephone | `(419) 555-0143` | create |
| **address 2** | `Dock 7B` | ⚠️ **not on create** — set via `POST /customers/change` (`address_2` is in that payload) |
| **website** | `bridgeporthauling-zzt.com` | ⚠️ **not on the e2e factory**, but `CreateCommand`/`ChangeCommand` both accept `website` (`api/src/Customer/Customers/Application/{Create,Change}`) — set via the customer edit screen or the change call |

Feeds C53578, C53582, C53583, C53586(name pattern), C53602, C53604.

## 2 · Contact on that customer
| Field | Value | How |
|---|---|---|
| first / last name | `Marlene` / `Okonkwo` | `POST /contacts/create` |
| **job title** | `Dispatch Supervisor` | `title` IS supported. ⚠️ BE rejects a title under 2 characters |
| telephone | `(419) 555-0177` | create |

Feeds C53603.

## 3 · Asset owned by that customer
| Field | Value | How |
|---|---|---|
| year / make / model | `2019` / `Freightliner` / `Cascadia` | `POST /vehicles/create` |
| VIN | `1FUJGLDR9KLZZ4471` | create |
| licence plate | `OHZZT471` | create |
| **unit number** | `ZZT-4471` | ⚠️ **not on the e2e factory create payload** — settable via the vehicle **change** endpoint (`ChangeCommandHandler:146 $vehicle->setUnit(...)`) or the asset edit screen |

Feeds C53580, C53581, C53605.

## 4 · Vendor — "ZZAUTOTEST Kestrel Parts Supply"
| Field | Value | How |
|---|---|---|
| name / address / city / state / postal / email | `88 Halbrook Trace`, `Marnston`, `Ohio`, `43055-2210`, `parts@kestrelsupply-zzt.com` | `POST /parts-catalogue/add-vendor` — all supported (`AddVendorRequestDto`) |

⚠️ **add-vendor requires `tax_id`.** If the org has no tax configured the call fails. Resolve the first
tax from `GET /taxes` or create one first.

Feeds C53584, C53585, C53604(vendor half), C53606.

## 5 · Parts — TWO parts are needed, and the difference is the point
| Part | Values | Must be true |
|---|---|---|
| **Stocked part** | `ZZAUTOTEST Brake Chamber Kestrel`, part number `ZZT-88-4412` | quantity on hand **greater than zero** |
| **Catalogue-only part** | `ZZAUTOTEST Airline Coupler Vernway`, part number `ZZT-77-3300` | **created in the catalogue and NEVER stocked — no inventory record at all** |

✅ **Verified seedable:** `catalogue_part` is its own table with its own create endpoint
(`api/src/PartsCatalogue/CataloguePart/Application/Create/`), and that handler creates **no** inventory
record — so a catalogue-only part is a real, creatable state.

Feeds C53601 (the highest-risk case) and C53607.

## 6 · Work orders — four, for the seeded customer
All four on customer *Bridgeport Hauling* with asset unit `ZZT-4471`, **same status**, each with a
clearly different last-updated date (suggest today, −7d, −14d, −21d).

🔴 **At seed time, write the real values into the `_runtime_values` block of `seed-data.json`:**
`shop_number`, `wo_a_number`…`wo_d_number`, `part_sale_number`. C53579 and C53587 read them from
there — the cases deliberately never hard-code a number, because numbers are assigned by the system.

Feeds C53578, C53579, C53587, C53588.

## 7 · Created during the run — do NOT pre-seed
C53586 and C53587 create their own records, because the behaviour under test is that a brand-new
record becomes findable. Give the new customer a unique name (`ZZAUTOTEST Halloway Freight` + a
timestamp) so re-runs don't collide.

---

## Cases needing NO seed data
**C53589** (loading state) — needs only a fresh sign-in. ⚠️ It is timing-sensitive: the loading state
may pass in a blink on a fast QA box. If it cannot be observed, mark it Blocked with that reason
rather than Failed.

## Order of work
1. Tax (if none) → 2. Customer → 3. Change customer for address 2 + website → 4. Contact →
5. Asset → 6. Change asset for unit number → 7. Vendor → 8. Two parts → 9. Four work orders →
10. Record the runtime values.
