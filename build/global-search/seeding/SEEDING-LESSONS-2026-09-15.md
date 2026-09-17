# Why the seeding was incomplete, and what now makes it complete

**Date:** 2026-09-15 · **Written after:** the execution session's `SEEDING-GAPS-REPORT.md`, and a live
redeploy that wiped every record while this was being fixed.
**Result:** `seed.py --check` now reports **11 of 11 records present · every declared field checked and
matched · 0 cases at risk**, from a completely empty branch, in one command.

---

## 1 · THE ONE-LINE DIAGNOSIS

> **I built a seeder that answered "does the record exist?" and then read its answer as
> "is the data ready?" Those are different questions, and the gap between them is where nine cases
> and three false defects lived.**

Everything below is a variety of that same mistake.

---

## 2 · WHAT I MISSED, AND WHY — six causes, each with its fix

### (a) I declared a patch block and never wrote the code that applies it

The manifest declared the customer's **website, second address line and telephone** in a `patch`
block. The seeder only ever read `create`. So the manifest looked complete, the data was not, and
`--check` — which only ever looked at one field — said "present".

**Why I missed it:** I verified the *shape* of the manifest, never that every declared thing had a
code path that acts on it. A declaration with no executor is worse than no declaration, because it
buys false confidence.

**Fixed:** the seeder now applies `patch`/`write` blocks, and every declared field is verified.

### (b) I treated a 2xx as proof

`POST /api/vehicles/change` answers **201 to a model NAME and changes nothing** — it works in ids.
The vehicle was declared a 2019 Freightliner Cascadia and was actually a 1000HS.

**Why I missed it:** I checked the status code instead of the record.

**Fixed:** every write is followed by a re-read, and a write that reports success without landing is
printed as `🔴 the write reported success and did NOT land`.

### (c) A field renamed between write and read was skipped in silence

The vehicle writes `model_name` and reads back `vehicle_model`. A key-by-key comparison finds no such
key and moves on — **silently**. That silence is where the whole problem lived.

**Why I missed it:** my check had two outcomes, match and mismatch. It needed three.

**Fixed:** `read_as` maps the names, and anything still uncomparable is printed under
**NOT COMPARED — do NOT read these as clean.** *"No gaps found"* and *"no gaps I was able to look
for"* must never look the same on screen.

### (d) I declared records, not the graph between them — the expensive one

The manifest had no **contact**. I read that as a search gap. It was worse: `/api/vehicles/create`
wants a `customer_id`, and **in this domain a Company is the business and a "customer" is a PERSON at
it.** With no contact there is no vehicle; with no vehicle there are no work orders. **One undeclared
record silently blocked three record types and about twenty cases** — and it only showed up when a
redeploy wiped the branch, because a contact left over from an earlier ad-hoc run had been quietly
holding the whole chain up.

**Why I missed it:** I built the manifest from *what the cases search for*, never from *what the
create endpoints demand*. Those are different lists, and the second one is invisible until the branch
is empty.

**Fixed:** contact declared; `records` is now an explicit **dependency chain** (customer → contact →
asset → work orders) with that stated at the top of the manifest.

### (e) I hardcoded ids that a redeploy invalidates

The four work orders were found by an id list from an earlier deployment. After every wipe the seeder
created four new ones and then reported *"created but NOT FINDABLE"* — four cases lost per redeploy.

**Why I missed it:** the ids were right the day I wrote them, and nothing re-checked the assumption.

**Fixed:** `id_from` captures the id the server returns and **writes it back into the manifest**. An
id the server has just handed you is the only one that cannot be stale.

### (f) I gave two different things one name

`part_stocked` used the **catalogue** create endpoint and then looked for the result in **inventory**.
A catalogue part is a part the shop knows about; a stocked part is one it actually holds, in a bin, at
a location. So it created a catalogue part, failed to find it in inventory, and on the next run
answered *"Part number name duplicate"* — it was fighting itself.

**Fixed:** two records — `part_catalogue_stocked_source` and `part_stocked` — and the stocked one is
built from the catalogue one via `POST /api/inventory/parts/create`.

---

## 3 · THE METHOD THAT FOUND EVERY MISSING ROUTE

Recorded because it worked every time and cost minutes instead of hours.

> **POST an EMPTY BODY to each candidate route and read the refusal. A 404 and a 400 mean completely
> different things, and that difference is the discovery method.**

| Answer | What it means | What to do |
|---|---|---|
| **404** `'resource' was not found` | wrong route | try the next spelling |
| **405** Method Not Allowed | right path, **wrong verb** | try POST/PUT/PATCH on that same path |
| **400** listing fields | **right route**, missing arguments | it just told you the payload |

That found `/api/contacts/create`, `/api/parts-catalogue/change-vendor` and
`/api/inventory/parts/create` in one pass each.

**And the one it could NOT find — with the rule that follows.** Eight spellings of a part-sale create
route all answered 404. The real route is **`POST /api/part-sales` — the same path as the list, a
different verb** — because that one route is REST while the rest of the API is `/resource/verb`.
No amount of guessing reaches it.

> 🔴 **WHEN GUESSING HAS FAILED TWICE, READ THE ROUTE OUT OF THE PRODUCT SOURCE.** One `git grep` for
> the `#[Route(...)]` attribute gave both the path and the payload. It is faster than the third guess,
> and unlike a guess it cannot be subtly wrong.

**The transferable trick, twice over:** when a lookup table is not exposed, **the existing data IS the
lookup table.** No vehicle-models endpoint answers on this branch, so the Cascadia model id is taken
off a vehicle that already has it. No bin can be created by name, so the bin id is taken off a part
that already sits in one.

---

## 4 · HOW TO RESEED AFTER A REDEPLOY — the whole procedure

```bash
cd build/global-search/seeding
python3 seed.py --check      # reports only, writes nothing to the environment
python3 seed.py --confirm    # creates what is missing and repairs what is wrong
```

Cookies live in `/tmp/qa/cookies.json` (`sv_sso_session`, `PHPSESSID`, `cf_clearance`) at `chmod 600`,
never committed. The seeder logs itself in, sets the location, and captures the rotated `PHPSESSID`
from `Set-Cookie` — not doing that makes every later call answer 409.

**Read the report, not just the summary.** It ends in three blocks and they are not interchangeable:

| Block | Meaning | Action |
|---|---|---|
| `fields n/n ✓` | present AND carries every declared value | nothing |
| **DATA GAPS** | the record holds something else | `--confirm` repairs it; **a case searching this finds nothing and it is NOT a product fault** |
| **NOT COMPARED** | could not be checked at all | 🔴 never read as clean — check by hand or add a `read_as` |

**Done looks exactly like this:**

```
records present : 11/11
field gaps      : 0
NOT COMPARED    : 0
cases at risk   : 0  []
Every declared field on every record was checked, and every one matched.
```

**If a branch is wiped, expect roughly 90 seconds and zero manual steps.** That was measured on
2026-09-15 from a completely empty branch.

---

## 5 · HOW IT IS FUTURE-PROOFED

1. **Adding data for a new case is one manifest entry, never a code change.** Rule 111 — a case is
   not finished until its data is seeded or explicitly accounted for, in the same pass that wrote it.
2. **Three outcomes, never two.** The tool cannot report a clean bill of health over fields it did not
   look at — and it now refuses to say "every one matched" when zero records were present to check.
   *(It made exactly that mistake once, on 2026-09-15, and that is why the guard exists.)*
3. **Order is a dependency chain**, stated at the top of the manifest. Put a new record after its
   parents.
4. **Ids are captured, never typed.** `id_from` writes the server's own id back into the manifest.
5. **Every refusal is recorded where the next person will hit it** — the `_why` note sits on the
   record it explains, not in a document nobody opens.
6. **`🔴 UNPROVEN` marks anything not exercised live**, so an untested assumption is visible instead
   of being mistaken for a verified one.

### The sweep that is still owed

The execution session asked for a sweep of the suite for *any other field a case types that no record
is declared to carry*. Two were found and fixed this pass (the vendor's second address line; the
contact entirely). **The full sweep across all 65 cases has not been run** — it is the last thing
between this and a guarantee, and it is listed as outstanding.
