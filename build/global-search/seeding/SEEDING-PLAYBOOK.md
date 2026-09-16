> 🔴 **READ `SEEDING-LESSONS-2026-09-15.md` FIRST.** It records why the earlier seeding was
> incomplete (nine cases unrunnable, three near-miss false defects), the method that found every
> missing route, the exact reseed procedure, and what still makes it fail. This playbook is the
> reference; that file is the reasoning.

# SEEDING PLAYBOOK — restore the suite's data after any redeploy, in minutes

**Why this exists:** the QA branch is redeployed regularly and **our test data is wiped every time.**
Re-seeding by hand costs an hour, produces different ids each run, and those ids then rot inside a
committed file — which is exactly what happened on 2026-09-14 and made a live customer look missing.

**The fix is a loop that gets cheaper every time it runs:**

```
python3 seed.py --check      # report only - nothing is written to the environment
python3 seed.py --confirm    # find-or-create whatever is missing
```

## THE THREE FILES, AND WHICH ONE YOU EDIT

| File | What it is | Do you edit it? |
|---|---|---|
| **`seed-manifest.json`** | Every record the suite needs, the cases it serves, how to find it, how to create it | ✅ **YES — this is the only file you edit** |
| `seed.py` | The idempotent engine. Find-or-create, self-healing ids, control-verified probes | ❌ No — adding a record never needs a code change |
| `seed-state-live.json` | The live ids, rewritten on every run | ❌ No — generated. **Never trust an older copy** |

## 🔴 TO ADD DATA FOR A NEW TEST CASE — the loop that keeps this cheap

1. Write the case.
2. Add **one entry** to `seed-manifest.json` — or, if an existing record already covers it, just add
   the case id to that record's `serves` list.
3. Run `python3 seed.py --confirm`. It creates only what is missing and leaves everything else alone.
4. Commit the manifest. **Never commit `seed-state-live.json` as truth** — it is a snapshot.

That is the whole loop. The second run is cheap because the first run wrote down the endpoints, the
payloads and the find strategy. **Every trap solved once is solved forever.**

## WHAT THE ENGINE DOES FOR YOU

- **Authenticates itself** (Rule 107). `quick-login` mints a session; no one is asked for cookies.
  ⚠️ It **evicts other workers on that branch** (Rule 83) — say so when you run it.
- **Captures the rotated `PHPSESSID`** from `Set-Cookie`. Skip that and every later call answers
  409 `"Session has expired."` — which reads exactly like a dead session. It is not.
- **Sets the location** before anything else. Without it `default_workplace` is `"None"` and
  workplace-scoped data is invisible — **which looks exactly like "the seed is gone."**
- **Verifies every probe with a control** before believing a negative (Rule 104). If a record known to
  exist comes back empty, the probe is broken and the "missing" verdict is thrown away.
- **Refuses to create a duplicate** of a record marked `unique`. A double run once created **two**
  vendor records, which made global search look like it was returning duplicates.

## THE FIND STRATEGY IS PER ENDPOINT — because `?search=` lies

Measured live on 2026-09-14, each with a control:

| Endpoint | `?search=` | Use |
|---|---|---|
| `/api/customers` · `/api/vehicles` · `/api/parts-catalogue/vendors` · `/api/inventory/parts` · `/api/parts-catalogue/catalogue-parts` | ✅ works | `mode: search` |
| `/api/work-orders` | 🔴 **broken** — returns 100 unfiltered rows for a real target and **zero for a control that exists** | `mode: page` |

`?page=` is **also** ignored on some list endpoints — they return the same 100 rows forever. The engine
detects a repeated page and stops instead of "scanning 8,000 records" that were the same 100 eighty times.

## PROVEN ENDPOINTS AND PAYLOADS — do not re-discover these

| Thing | Endpoint | Required |
|---|---|---|
| Auth | `POST /api/quick-login` | `{"key":"admin"}` — admin first; a failed `tech` burns the session |
| Locations | `GET /api/staff/my-workplaces` | — |
| Set location | `POST /api/iam/change-location` | `{workplace_id, workplace_timezone}` |
| Customer | `POST /api/customers/create` | ⚠️ **`website` and `address_2` are NOT on the create payload** — set them after, or C53583 and half of C53582 are unrunnable |
| Asset | `POST /api/vehicles/create` | `maker_name`/`model_name`, `year`, `unit`, `vin`, `licence_plate`, `company_id` |
| Vendor | `POST /api/parts-catalogue/add-vendor` | needs `tax_id` — take the first from `GET /api/taxes`; also `credit_term`, `credit_limit` |
| **Catalogue part** | `POST /api/parts-catalogue/add-catalogue-part` | `name`, `part_number`, **`tags` (an empty array, or 400)** |
| **Stock a part** | `POST /api/inventory/parts/create` | `catalog_part_id`, `category_id`, `quantity`, `cost`, `tags`, `bins:[{id, quantity, isDefault}]`. Category from `GET /api/parts-catalogue/categories-list`, bin from `GET /api/inventory/bin-locations` |
| Work order | `POST /api/work-orders/create` | `company_id` only — 🔴 **currently returns 500, see A5** |

## 🔴 A PART MUST BE STOCKED, NOT JUST CATALOGUED

V2 searches **Parts (Inventory)**. A catalogue part with no inventory record **is not findable at all**.
Creating the catalogue entry and stopping leaves six cases failing for a data reason.

Proved on 2026-09-14 by creating both, minutes apart, the same way:

| Part | State | `?q=<part number>` |
|---|---|---|
| `ZZT-88-4412` | catalogued **and stocked** (qty 25, General Storage) | ✅ **found** |
| `ZZT-77-3300` | catalogued only | ❌ **0 results** |

That pair is the cleanest evidence in the whole suite for the catalogue-part question (candidate B1).

## WHAT THIS CANNOT FIX

- **Work orders and part sales are blocked by A5** — `POST /api/work-orders/create` returns 500 on a
  proven-live session. Until that is fixed the engine reports them blocked and does not pretend.
- **Roles, a second location, a second organization** are environment state, not records. The recipes
  are in `seed-manifest.json` → `environment_setup`, taken from `build/APP-ACTIONS-PLAYBOOK.md`.
  The second location **already exists**.

## OUTSTANDING — what I need from you

Nothing to run this. Two things to know: **A5 blocks the work orders and the part sale**, and there is
**a duplicate vendor to delete** (two records, ids `0be71457…` and `0ff19eb4…`).
