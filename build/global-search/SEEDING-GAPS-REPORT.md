# For the session that seeded the Global Search V2 test data — what was missing, and why it mattered

**From:** the session executing run 415 (the V1 regression set, section 6769) on **sv9160**
**Date:** 14 September 2026
**Tone note:** the seeder and its manifest are genuinely good work — declarative, find-or-create,
idempotent, with the live ids recorded. Everything below is about a gap **between what the manifest
declares and what the records ended up holding**, which the seeder's own `--check` was structurally
unable to see. None of it is a criticism of the approach.

---

## The one-line version

`seed.py --check` reported **6 of 7 records present**, and that was true. But **"the record exists"
is not "the record carries the values the cases search for."** Six field values the suite searches on
were absent or different, and one whole record type the suite depends on is **not in the manifest at
all**. Nine cases could not be run, and three of them would have been written up as product defects.

---

## What was missing

| # | Record · field | The manifest declares | The record actually held | Cases it made unrunnable |
|---|---|---|---|---|
| 1 | customer · `state_or_province` | `Ohio` | *(empty)* | C53582 (search the state) |
| 2 | customer · `address_2` | `Dock 7B` | *(empty)* | C53604 (search address line 2) |
| 3 | customer · `telephone` | `(419) 555-0143` | *(empty)* | C55662 (the company's own phone) |
| 4 | vendor · `telephone` | `(614) 555-0188` | *(empty)* | C55663 (vendor by phone) |
| 5 | asset · model | `Cascadia` | **`1000HS`** | C55664 (asset by model), C53605 (asset by year) |
| 6 | customer · `country_code` | `US` | `CA` | none directly — flagged for tidiness |
| 7 | **a CONTACT** | **not declared anywhere** | one exists, by luck | C53603, C55670, and part of C53582 |
| 8 | part sale | declared | cannot be created (SV-10031) | C55665, part of C45153/C45151 |

### The three that would have become false defects

Items 1, 2, 3 and 5 all present identically on screen: **you search a value and nothing comes back.**
That is indistinguishable from "the search index is broken for this field" unless you go and read the
record. Three tickets were one step away from being proposed for fields the record simply did not
carry.

### Item 5 — the root cause, and it will bite again

The vehicle's create payload sends `model_name: "Cascadia"`. **The vehicle endpoint does not accept
the model by name.** It answers **201**, reports success, and silently drops the field — the vehicle
ends up with whatever model it was going to have anyway (`1000HS`). The endpoint works in **ids**: it
wants `vehicle_model_id`, and its own response echoes that field, which is the tell.

So the bad data and my first failed repair have the **identical cause**. I sent `model_name` too, got
my own 201, and changed nothing.

> `POST /api/vehicles/change` needs **`vehicle_id`** (not `id`), **`company_id`**, and the model as an
> **id**, not a name.

**Where to get that id**, since no models-lookup endpoint answers on this branch — every shape of
`/api/vehicles/models`, `/api/vehicle-models` and `/api/vehicles/makers/{id}/models` returns 404:
**take it off a vehicle that already has the model you want.** Searching the vehicle list for
`Cascadia` returns 61 rows; the first one's `vehicle_model_id` is the id. Confirmed: the seeded
vehicle is now a 2019 Freightliner Cascadia, read back to prove it.

When the lookup table is not exposed, the existing data is the lookup table.

This is the single highest-value thing in this report: a create that returns success while dropping a
field will keep producing fixtures that look complete and are not — and only a read-back catches it.

### Item 5 also deserves this note — it was visible the whole time

The seeded asset rendered in **every single result row** as:

> `ZZT-4471` **2019 Freightliner ????** · ZZAUTOTEST Bridgeport Hauling

The `????` was the model failing to resolve. It sat in hundreds of lines of captured evidence and was
read past, because the eye was on zeros rather than on what the non-zero rows actually said.

### Item 7 is the structural one

**The manifest has no contact record**, yet the suite searches a contact's first name, last name and
job title (C55670, C53603). A contact called *Marlene Okonkwo · Dispatch Supervisor* does exist on the
customer — left behind by an earlier ad-hoc seeding run, not created by `seed.py`. So those cases
passed or failed **by luck**: on a freshly seeded branch they would have found nothing, and the
obvious reading would have been "contact search is broken".

---

## Why `--check` could not catch any of it

`--check` answers **"does a record matching `find.value` exist?"** — one field per record. It never
compares the rest of the `create.payload` or the `patch.fields` against what came back. So:

- a `patch` step that returns 2xx and silently does not persist reads as success;
- a field the API **renames between write and read** is invisible. The asset writes `model_name` and
  reads back `vehicle_model`. A naive key-by-key comparison *also* misses this — it looks up
  `model_name`, finds no such key, and skips. **That silent skip is where item 5 lived.**

---

## What would have prevented all of it

**1. Verify every declared field, not just the finder field.** After seeding, re-read each record and
compare the whole `create.payload` + `patch.fields` against it.

**2. Print what you could NOT compare, next to what you did.** A field absent under the name you wrote
is a **third outcome**, not a pass. `"no gaps found"` and `"no gaps I was able to look for"` must not
look the same. This one line is what turns item 5 from invisible into obvious.

Here is that check running against the fixtures as they stand — the second block is the part that had
been silent, and `asset.model_name` is item 5 announcing itself:

```
DATA GAPS:
  customer.country_code: wanted "US" but the record holds "CA"
  vendor.telephone: wanted "(614) 555-0188" but the record holds null
NOT COMPARED (do not read these as clean):
  customer.address:   written as 'address',    but the record exposes no such key -- cannot compare
  customer.phone:     written as 'phone',      but the record exposes no such key -- cannot compare
  customer.email:     written as 'email',      but the record exposes no such key -- cannot compare
  asset.maker_name:   written as 'maker_name', but the record exposes no such key -- cannot compare
  asset.model_name:   written as 'model_name', but the record exposes no such key -- cannot compare
  work_orders:        the record could not be read at all
  part_sale:          the record could not be read at all
```

Five of the seven lines in that second block are **write-name vs read-name mismatches**: the payload
writes `address`, `phone`, `email`, `maker_name`, `model_name`; the record reads back `address_1`,
`telephone`, *(email not exposed on the list row)*, and `vehicle_model`. Every one of those is a
field the suite searches on.

**3. Add a `read_as` mapping to the manifest** wherever the API renames a field:
```json
"verify": ["unit", "vin", "licence_plate", "year"],
"read_as": { "model_name": "vehicle_model", "phone": "telephone" }
```

**4. Declare every record the suite searches — contacts included.** Grep the suite for what the cases
actually type. If a case searches a contact's job title, a contact with a job title is fixture, not
scenery.

**5. Treat "created" and "carries its values" as two separate checks**, and report both:
> `customer: present ✓  ·  fields 5/8 ✓  ·  MISSING state_or_province, address_2, telephone`

---

## Ready to reuse

- `build/global-search/tickets-2026-09-14/VERIFY_data2.mjs` — finds each record the way the manifest
  does, dumps **every** scalar field, prints gaps **and** the fields it could not compare.
- `build/global-search/tickets-2026-09-14/seed_index.py` — indexes every value the manifest declares,
  so any search returning nothing can be checked against "does a record actually carry this".
- `build/global-search/tickets-2026-09-14/SEED_fields.mjs` / `SEED_fields2.mjs` — repair the gaps above
  and read the record back, because a 2xx is not evidence a write landed.

Folding checks 1, 2 and 5 into `seed.py --check` would make the next hand-off complete, and would have
saved this pass several hours and three defects that were never real.

## One more gap, found while repairing the others

**The vendor has no second address line declared at all.** C53604 checks that a second address line is
searchable for a customer *and* for a supplier. The manifest gives the customer an `address_2` (in the
`patch` block) and the vendor none — so the supplier half of that case had nothing to search for. Not
"declared and missing"; simply never specified. Worth a sweep of the suite for any other field a case
types that no record is declared to carry.

## Write routes, since repairing the data cost time finding them

Recorded so nobody repeats the search. Every refusal named its own fix, which is the fastest route to
the right call:

| To change | Route | Note |
|---|---|---|
| A customer's fields | `POST /api/customers/change` | Send the **whole record** with the fields replaced, not a sparse patch. Confirmed landing: state, second address line, telephone |
| A vehicle's fields | `POST /api/vehicles/change` | Refuses `id`. The 400 names what it wants: **`vehicle_id` and `company_id`** |
| Reading a record back | the manifest's own `find.list` endpoints | `/api/<type>/view/<id>` answers **404** for vehicles and vendors — a wrong route, not a missing record |

**Always read the record back after writing.** Two of the writes above returned a success status while
changing nothing, and the read-back is the only thing that catches it.

## Still genuinely blocked, and not the seeder's doing

**A part sale cannot be created on this branch** (SV-10031, filed by the QA lead). C55665 cannot run,
and C45153 and C45151 cannot be finished, until that is fixed. Nothing in the seeding approach can
work around it.
