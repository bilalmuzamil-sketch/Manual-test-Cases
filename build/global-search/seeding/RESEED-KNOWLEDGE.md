# RESEED KNOWLEDGE — everything this data needed, in one place

**Read this before touching the seed. It exists so a reseed is a command, not an investigation.**
Every line was measured on `sv9160` or read out of the deployed product source at
`SV-9160-global-search-v2 @ 21b4db9`. Nothing here is inferred.

**One command per environment:** `./reseed_gsv2.sh qa` · `./reseed_gsv2.sh live`
**Keywords:** `RESEED GSV2 QA` · `RESEED GSV2 LIVE` (and `RESEED QA` / `RESEED LIVE` for the older
V1-regression 11 records). Runbook: `RESEED.md`. Record inventory: `SEED-MANIFEST-GS-V2-{qa,prod}.md`.

---

## 0 · THE ONE RULE THAT MATTERS MOST

**A run is finished when the VERIFIER passes, never when the seeder prints 33/33.**
*"The record exists"* is not *"the search returns it"*. The seeder has reported a clean 33 of 33 while
the suite was broken — twice. Only searching what the cases actually type finds that.

And the verifier is a **different script per environment**: `verify_gsv2.py` on the QA branch (V2,
`GET /api/search`), `verify_gsv2_v1.py` on production (V1, `GET /api/global-search/fetch`, which
reproduces V1's own two passes). Running the V2 one against production reports a dead environment
that is perfectly healthy.

---

## 1 · THE SEVEN STEPS, AND WHY THE ORDER IS NOT ARBITRARY

| # | Step | Why it must be here |
|---|---|---|
| 1 | `seed.py --check` | measure; writes nothing |
| 2 | `seed.py --confirm` | the 39 records + field verification |
| 3 | `set_wo_statuses.py --confirm` | you cannot set a status on a work order that does not exist |
| 4 | `seed_po_and_invoices.py --confirm` | consumes work orders; needs them out of `estimate` |
| 5 | `complete_and_invoice.py --confirm` | takes the **leftover** estimate work orders, so 4 must claim its own first |
| 6 | `seed_roles.py --confirm` | independent of records, but before the verifier so one run proves everything |
| 7 | `touch_recent_entities.py --confirm` | needs the records to exist; fills the recent list with one of each type |
| 8 | the verifier | **39** identity/count/negative checks + reachability + the seven status badges |

---

## 2 · THE DESIGN RULE — why so few records do so much

**Name the CUSTOMER and the VENDOR after the search term and everything inherits it.** From the
deployed indexer: a work order is indexed on its `customer_name`, an asset on its **owner's**
company name, a part sale on its `customer_name`, and a purchase order and vendor invoice on their
`vendor_name`. Three "Fibridge" customers and one "Fibridge" vendor therefore make 22 work orders,
6 assets, a part sale, 6 purchase orders and 3 vendor invoices all answer `Fib` **without any of
them carrying the word**. You never have to rename 22 work orders.

Full per-entity indexed-field table: `build/APP-ACTIONS-PLAYBOOK.md` §O5.

---

## 3 · THE COUNT TARGETS — exact, not approximate

| Group on `Fib` | Must be | Why |
|---|---|---|
| customers | **3–5** | C44825 needs a group at five or fewer |
| assets | **>5** | C44825 needs a group above five |
| work orders | **20** | the palette **caps every count at 20**; 30 match, and seeing 20 IS the pass |
| vendor invoices | **≥3** | Unpaid, Partially paid, Paid |

🔴 **Measure on `Fib`, never on `Fibridge`.** The long form fuzzy-matches the word **"Bridge"** inside
hundreds of staging addresses and returns 7 customers and 5 vendors that are nothing to do with us.
`Peterson` does the same. **A group total is never evidence your record is there — look for the
record.**

🔴 **All seven status badge colours are on `Fibridge Commercial`, NOT on `Fib`.** Thirty work orders
match `Fib` and the cap is 20, so the two `declined` ones rank out of sight — and no `limit` or scope
tab brings them back (`scope=work_orders&limit=50` still returns 20). The narrower term returns 18
and carries all seven.

---

## 4 · EVERY TRAP, WITH THE SYMPTOM IT PRESENTS AS

Ordered by how much time each one cost.

| Symptom you will see | Actual cause | What to do |
|---|---|---|
| `orders/accept` → **500**, no delivery, on a PO raised from a work order | **suspected product defect** — the handler ends with `refreshTouchedWorkOrders()`, which a standalone PO never reaches | use the standalone route: `POST /api/inventory/orders/create` then accept. The script already does. Ticket candidate, not filed. |
| `orders/accept` → 500 right after a fresh vendor | vendor `credit_term` written as the integer `30`; it is a **CreditTerms string** (`Net 30`, `COD`, …). `add-vendor` accepts the integer, stores `"30"`, and nothing complains until the due date is computed | the manifest now sends `Net 30` **and verifies it** |
| `perform-request-status-action` → **500** | the part request has no vendor yet | `POST /api/work-orders/part/change-request {id, vendor_id}` FIRST. A 500, not a 400. |
| four plan rows all land inside one purchase order | **one PO per work order + vendor** | give each PO its own work order |
| `POST /api/roles` → bare **500** naming nothing | `fePermissions` must be a list of permission **ID STRINGS** — codes, `{id:…}` and whole objects all 500 | send `[uuid, uuid, …]` |
| a role is created **201** but reads back still holding the permission you removed | a view permission will not come off while a dependant is held (`customersView` needs `customersCreateAndEdit` + `customersDelete` to go too) | remove the whole family, then **read back** |
| seeder says MISSING for records you can see in the UI | production's list endpoints return **transient empties** | already handled — the finder retries 3× before believing a miss. If it still says missing, **check for a duplicate before creating** |
| a reseed after a wipe keeps growing the estate | top-up was appending new ids to dead ones | fixed — only ids the probe just proved live are carried forward |
| the PO/invoice step prints "complete" for every row while the vendor has none | it was trusting its own state file | fixed — the environment decides, and a wiped row rebuilds in the **same** pass |
| an asset "is missing" when you search `2025 Freightliner M2` | the asset year is indexed as an **integer**, and the group caps at 20, so a year-led query degrades to "Freightliner M2" and the estate's own twenty fill it | search the **owner**, the VIN or the unit |
| a record is in the search but `view/{id}` answers **400 Not found** | the search index is **organisation-scoped**; the record is **workplace-scoped** and lives at a workplace this login cannot reach | never build a case on it — see Rule 111's reachability clause |
| `P2-59` starts returning a row and breaks C44849 | **a part-sale number matches across shop prefixes** — `P2-59` finds `P9160-259`. Numbers are sequential, so an unrelated reseed can create one | a part sale is a work order underneath: `POST /api/work-orders/delete {work_order_id}`, then reseed. Work-order numbers do **not** behave this way. |
| deleting a purchase order → **500** | the payload key is **`{id}`**, not `{order_id}` | `POST /api/inventory/orders/delete {id: <uuid>}` → 201 |
| a fulfilled purchase order vanishes from `/api/inventory/orders` | that list holds **open** orders; once received it is represented by its DELIVERY | judge a received row by its **invoice**, never by the PO still being listed |
| `mileage` → 500 | it must be a **STRING** | `'184320'`, not `184320` |
| a line refuses to complete | it needs a mileage AND a tech story AND a parts-free canned line, and status is a **walk** not a jump | pick `total_parts == 0`; walk `authorization_required → authorized → complete` |
| `invoices/create` → 500 | the work order has **no contact person** | the manifest injects `customer_id` (the CONTACT, not the company) at creation |
| production session → **409 Session has expired** | PHPSESSID aged out | `POST /api/login {username,password}`, capture the rotated `PHPSESSID` from `Set-Cookie`. **A fresh login expires that user's previous session** — once per run. |
| every record reads MISSING on the QA branch | the branch was **redeployed and wiped** | check the marker first: `curl -s https://sv9160.qa.shopview.com/ \| grep app-version`. This happened mid-session on 2026-09-16; 1 of 33 survived. |

---

## 5 · WHAT IS NOT SEEDED, AND WILL NEVER BE

Recorded so nobody investigates them again.

- **Quick Actions on hover (6774, 8 cases)** — the FEATURE is not on the build (SV-9173 deferred), so
  the cases stay parked. **But the DATA is seeded and verified** (QA lead, 2026-09-17), so they are
  runnable the day it ships. 🔴 Reading the case bodies rather than the handoff's summary (Rule 112)
  found three named example records that existed **nowhere** on the branch — `Adale Transport`,
  `Fisquare Farms`, `Report Beverages` — all three now seeded and checked by the verifier.
- **A second tenant (C44880)** — the branch has one organisation. Two *locations* is not the same
  thing. Infra item.
- **Backdated recent activity (6728)** — `POST /api/user/recent-entities/touch` records *"just now"*
  and takes no timestamp, so the **Yesterday / Past week / Past 30 days** buckets cannot be
  manufactured; they fill in as the branch is used. What step 7 DOES give you is a **Today** bucket
  containing one record of **every one of the eight types**, which is what C44858 and C44859 need.
  🔴 The list is **per user** — a tester signing in as somebody else starts empty, which is itself
  the C44855 first-time-empty case. And the touch endpoint answers **204 even for input it silently
  discards**, so a 204 is not evidence: always read the list back.
- **Exact work-order numbers** — branch-assigned. See Rule 111.

---

## 6 · WHAT THE ROLES GIVE YOU (section 6734)

Measured, not assumed. The search's own mapping is in `SearchSectionAccess.php`:
`work orders → workOrdersView` · `customers AND assets → customersView` · `parts →
catalogInventoryView` · `part sales → partSalesView` **AND** `seeFinancialData` (three conditions) ·
`vendors, POs, vendor invoices → vendorOrderManagementView` · the **Time Clock template sees nothing
at all**, whatever its bundles say.

| Role | Sees | Serves |
|---|---|---|
| Admin / Office User / Foreman / … | everything | C44877 |
| **Technician** (stock) | work orders, customers, assets | C44878, C44881 |
| **Sales Representative** (stock) | no parts, no vendor management | C44882 |
| **Time Clock User** (stock) | **nothing** | C44882 |
| **ZZAUTOTEST No Work Orders View** (created) | everything except work orders | C44879, C44882 |
| **ZZAUTOTEST No Customers View** (created) | everything except customers **and assets** | C44882 |

Only two roles were created, because the other four requirements already ship.

---

## 7 · THE FILES

| File | What it is |
|---|---|
| `reseed_gsv2.sh` | **the one command**, both environments |
| `seed-manifest-gs-v2.json` | the 33 records — **generated**, never hand-edited |
| `build_gsv2_manifest.py` | the generator, with the reasoning for every record |
| `seed.py` | the engine: find-or-create, field-verify, repair. Shared by both universes |
| `set_wo_statuses.py` · `complete_and_invoice.py` · `seed_po_and_invoices.py` · `seed_roles.py` | the stateful chains a declarative manifest cannot express |
| `verify_gsv2.py` / `verify_gsv2_v1.py` | **the proof** — V2 and V1 |
| `dump_seed_manifest.py` | regenerates the record inventory from the live environment |
| `SEED-MANIFEST-GS-V2-{qa,prod}.md` | every record with the id the branch assigned it |

**Commit after every reseed.** The ids change when a branch is wiped, and git is the only durable
store — the container and `/tmp` are not.
