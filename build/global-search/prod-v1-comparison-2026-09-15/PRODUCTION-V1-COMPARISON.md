# Production is seeded, and the old search was measured on it

**15 September 2026 · `app.shopview.com` (the dummy test account, workplace Trucks Hill 2) · production
runs V1, the old search.**

---

## 1 · What is now in production

All 11 records, every declared field matching on read-back. Same records as the QA branch, so the two
can be compared like for like.

| Record | What it is |
|---|---|
| ZZAUTOTEST Bridgeport Hauling | the customer · company phone `(419) 555-0143` |
| Marlene Okonkwo | its contact · her own phone `(419) 555-0177` |
| 2019 Freightliner Cascadia | the asset · unit `ZZT-4471` |
| S2-873 · S2-874 · S2-875 · S2-876 | four work orders, all Estimates |
| ZZAUTOTEST Kestrel Parts Supply | the vendor |
| ZZAUTOTEST Brake Chamber Kestrel | catalogue + stocked part `ZZT-88-4412` |
| ZZAUTOTEST Airline Coupler Vernway | catalogue-only part |
| ZZAUTOTEST Marlene Freight Lines · ZZAUTOTEST Darlene Cartage | the near-miss pair |
| P2-67 | one part sale |

Re-check any time: `SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2" python3 seed.py --check`

---

## 2 · The old search was measured, not assumed

Production's search endpoint returns the **whole collection** in one call — 5,218 rows of label +
search text — and the browser does the filtering. That is V1's design, so the verdict needs no
browser: fetch the collection the page fetches, then apply the same two passes the page applies,
transcribed from the V1 product at commit `55767168`.

`verify_prod_v1.py` in this folder does exactly that and is re-runnable.

### Every behaviour the regression suite asserts was confirmed on real production data

| Typed | Old version finds our record? | Matches what the suite says |
|---|---|---|
| `419-555-0143` — company phone, dashed | ✅ yes | ✅ |
| `555-0143` — only part of it | ✅ yes | ✅ |
| `(419) 555-0143` — with brackets | ❌ no | ✅ |
| `4195550143` — plain digits | ❌ no | ✅ |
| `419-555-0177` — the contact's own number | ✅ yes | ✅ |
| `555-0177` — part of the contact's number | ✅ yes | ✅ |
| `4195550177` — plain digits | ❌ no | ✅ |
| `Freightliner` — the make alone | ✅ yes | ✅ |
| `2019` — the year alone | ✅ yes | ✅ |
| `Cascadia` — the model alone | ✅ yes | ✅ |
| `2019 Freightliner` — year and make together | ✅ **yes** | ✅ |
| `ZZT-4471` — the unit number | ✅ yes | ✅ |
| `4471` — part of the unit number | ✅ yes | ✅ |

**13 of 13.** Nothing the suite claims about the old version is contradicted by the old version.

### Two of these rows settle open questions

1. **The phone-format rule is now proven on the live old product, not simulated.** Brackets and plain
   digits found nothing in V1; dashes and fragments found the record. This is what C55662 and C55670
   were corrected to today, and it is why SV-10057's remaining half — part of a number finding nothing
   — is a genuine loss and the rest of it is the new version going further than the old one.

2. **`2019 Freightliner` RETURNS the vehicle in the old version and returns nothing in the new one.**
   That confirms **SV-10055 is a real regression**, measured on both sides rather than argued from one.

---

## 3 · Three things this run proved about the seeder itself

Each was found by pointing the seeder at a second environment, and each would have produced a wrong
answer quietly.

1. **The liveness probe was the V2 endpoint.** `/api/search` 404s on production, which runs V1 — its
   search is `/api/global-search/fetch`. The seeder read that 404 as a dead session and refused to run,
   on a session that was perfectly alive. The probe is now one that exists in every environment.

2. **The "is this probe working?" control was a record of one estate.** It searched for a QA customer
   that does not exist in production, found nothing, and reported every probe broken. The control now
   calibrates against whatever environment it is pointed at — read a record off an unfiltered page,
   search for a word out of it — which separates *search is broken* from *the estate is simply empty*.
   Same fix one level deeper for the bin the stocked part is built from.

3. **Captured ids were written back into the SHARED manifest.** The first production run overwrote the
   QA branch's work-order ids with production's, and the next QA check reported those four work orders
   MISSING while they sat right there. Ids are per estate now (`seed-ids-<env>.json`); the manifest is
   the shared plan and holds no estate's ids.

Plus one thing the seeder did right, and it mattered: it **refused to call 0-of-11 a clean bill of
health**, and it reported *probe broken* rather than *missing* when it could not tell them apart.

---

## 4 · One mess I made, and cleaned

My first production run crashed part-way through (a real bug: the crash handler read a field that an
errored call does not carry). Recovering, I restored the manifest from git — which threw away the four
work-order ids that run had just captured, so the second run could not see them and created four more.

Production briefly held **eight** ZZAUTOTEST work orders. The four orphans (S2-869 … S2-872) were
deleted after checking id-by-id that none of them was one of the four the seeder had recorded.
**Production now holds exactly the four intended**, verified by re-reading the collection.

The delete route is worth recording: `POST /api/work-orders/delete` wants **`work_order_id`**, not
`id` — the 400 names its own missing parameter, which is the quickest way to find any of these.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **Nothing to unblock.** Production is seeded and verified, the old search is measured, and the two environments now hold the same records. |
| **2** | Worth knowing: the account is signed in as this session's login. **A fresh login for the same user expires the previous session**, so if you were signed in as the limited-view service advisor while I worked, you were signed out and just need to sign in again. |
