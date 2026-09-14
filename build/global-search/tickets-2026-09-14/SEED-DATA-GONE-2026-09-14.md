# The sv9160 test data is gone — 14 September 2026, 14:20 UTC

**The branch came back at about 14:12 after roughly 2½ hours down. It came back without the test
data.** This is the thing that now blocks the regression suite, and it is not a product defect.

## What is proved

| Check | Result |
|---|---|
| Companies, **paged to exhaustion — 1,500 records** | **No `ZZAUTOTEST` company at all.** The seeded customer *ZZAUTOTEST Bridgeport Hauling* and vendor *ZZAUTOTEST Kestrel Parts Supply* are gone |
| Work orders, **paged to exhaustion — 2,000 records** | **S9160-17580, 17581, 17582 and 17583 all GONE** |
| Search for `ZZAUTOTEST` | every group returns `total: 0` |
| Search for `Brake Chamber` (a control) | `work_orders total: 20` with items — **search itself is healthy** |

Paging to exhaustion matters: the list endpoint caps at 100 per page, and "not in the first 100" is
not absence (learning L0077).

## What this means for the measurements I just took

Running the scope-tab probe right after the branch returned gave **zero for five of six queries**.
**Those zeros are about missing records, not about search.** Nothing has been concluded or filed from
them. The one query that still has a record behind it behaves differently — see below.

## The one case that can still be tested, and what it now shows

The vehicle with VIN `BAHUTYV09T63EV7NS` belongs to *4 Star Truck Repair*, not to the ZZAUTOTEST seed,
so it survived. Searching that VIN now returns **`assets: 1`, and the Assets tab shows the row**.

**So SV-10014 does not reproduce right now.** That is stated as a fact about the build at 14:15, not
as a verdict on the ticket: the QA lead's recording is genuine evidence of the behaviour earlier
today, and a branch rebuild in between can mask a fault as easily as fix one. **The ticket is not
withdrawn**; a factual note goes on it so engineering sees both readings.

The other three (SV-10015, SV-10016, SV-10017) **cannot be retested at all** — their records no
longer exist.

## What is blocked

1. **The 58-case regression suite.** Its preconditions are built on the ZZAUTOTEST seed.
2. **Re-confirming all twelve filed Story Defects** — eight from this morning, four from the recording.
3. Re-checking the mid-word fragment and the unit-number search.

## What unblocks it

The seed must be rebuilt: a customer, a contact, a vehicle with a specific VIN, unit number and plate,
a vendor with an email, a catalogue-only part, a stocked part, and four work orders. The other
session recorded the **ids** of what it made (`qa-seed-2026-09-14/qa-seed-state.json`) but **no script
that makes them** — so this is a build, not a replay. Seeding QA test data is within standing
authorisation, so it does not need asking; it needs time and a branch that stays up.
