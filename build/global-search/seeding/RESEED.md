# RESEED — the two keywords

**Say one of these and nothing else. I will do the rest.**

| You say | I reseed | Where |
|---|---|---|
| **`RESEED QA`** | the QA branch | `sv9160.qa.shopview.com` |
| **`RESEED LIVE`** | the production test account | `app.shopview.com`, workplace **Trucks Hill 2** |

The two words share no letters at the start on purpose — **QA** and **LIVE** cannot be confused for
one another the way "qa" and "prod" can when typed quickly.

**Both are safe to say at any time.** Reseeding only creates what is missing. If everything is already
there it writes nothing and just tells you so.

---

## What I will ask you for, and only if I actually need it

I check first and ask only for what is missing, so most of the time you say the keyword and I get on
with it.

| For | What expires | What I will ask for |
|---|---|---|
| **`RESEED QA`** | the browser cookies for the branch | the three cookies — `sv_sso_session`, `PHPSESSID`, `cf_clearance`. A 401 usually means only `cf_clearance` has aged out, so try that one first. |
| **`RESEED LIVE`** | nothing, unless the container was replaced | the username and password for the production test account. |

Secrets live in `/tmp` at `chmod 600` and are never committed (Standing Rule 82). A new container has
an empty `/tmp`, so after a long gap I will need them again.

---

## What actually happens

### `RESEED QA`
```bash
cd build/global-search/seeding
python3 seed.py --check      # what is missing - writes nothing
python3 seed.py --confirm    # create only what is missing
python3 seed.py --check      # prove it: expect 11/11, 0 field gaps
```

### `RESEED LIVE`
```bash
cd build/global-search/seeding
export SEED_PROFILE=/tmp/prod/cookies.json
export SEED_WORKPLACE="Trucks Hill 2"
python3 seed.py --check && python3 seed.py --confirm && python3 seed.py --check
```
First, once per run: `POST https://api.shopview.com/api/login {username, password}` → take the
`PHPSESSID` → write `/tmp/prod/cookies.json` as
`{"host":"app.shopview.com","api":"api.shopview.com","PHPSESSID":"<it>"}` at `chmod 600`.

> 🔴 **Log in ONCE per run.** A fresh login for the same user **expires that user's previous session**
> — if you are signed in as that account in your browser, you will be signed out and will just need to
> sign in again.

**Then I always prove it.** `--check` must report **11 of 11 present, 0 field gaps**. If it reports
`0 of 11`, that is not a clean bill of health and the seeder says so itself — something is wrong with
the session or the probes, not with the data.

---

## 🔴 WAIT BEFORE YOU JUDGE ANYTHING BY SEARCHING FOR IT

**The reseed writes records. The search index catches up afterwards.** Search straight after a reseed
and you are measuring the index, not the product.

This cost a whole finding on 2026-09-16. Six fields were reported as "no longer searchable"; **four of
them were fine** and had simply not been indexed yet when they were checked a minute after the write.
An argument was then built on top of those readings, including a claim about the specification, and all
of it had to be withdrawn. The QA lead caught it by noticing a search that worked for him.

**So, after any reseed:**

1. **Give it a couple of minutes** before searching for a seeded record. The specification allows up to
   30 seconds for the index to refresh; leave more.
2. **When something is not found, prove it with a control on the same record** — search a different
   field of that same record. If the control comes back and the field in question does not, the index
   has the record and that one field is genuinely not searched. If neither comes back, you are just
   early.
3. **Re-check anything that looks missing, more than once, minutes apart.** One reading is not a
   finding.
4. **Check the IDENTITY of what came back, never the number of rows.** A result count of 1 is not a
   pass — on this data almost every query returns something. Ask "is OUR record in the list?", not
   "were there any results?". That mistake produced a false pass on 2026-09-15 and a false failure the
   day after.

---

## The four things that make a reseed go wrong

All four were found the expensive way. They are fixed in `seed.py`; this is why the code looks the way
it does, so nobody "simplifies" them back out.

1. **Do not probe with an endpoint that only one version has.** `/api/search` is the NEW search and
   404s on production, which runs the old one (`/api/global-search/fetch`). Probing it there reports a
   dead session that is perfectly alive. The liveness probe must exist in every environment.

2. **A "control" record belongs to one estate.** The probe used to check a known QA customer to prove
   searching worked; in production that customer does not exist, so every probe reported broken. It now
   calibrates against whatever it is pointed at — read a record off an unfiltered page, then search for
   a word out of it. That separates *search is broken* from *this estate is simply empty*. Same fix for
   the bin the stocked part is built from.

3. **Never write one estate's record ids into the shared manifest.** The first production run
   overwrote the QA branch's work-order ids, and the next QA check reported four work orders MISSING
   while they sat right there. Ids live in `seed-ids-<env>.json`; the manifest is the shared plan.

4. **Work orders cannot be found by searching.** `/api/work-orders?search=` matches nothing, which is
   why they are tracked by the ids captured at creation. **So if the ids are lost, the seeder cannot
   see existing work orders and will create duplicates.** That happened once: a crash plus a
   `git checkout` of the manifest threw the ids away and production ended up with eight instead of
   four. If you ever see more than four, the extras are safe to remove —
   `POST /api/work-orders/delete {"work_order_id": "<id>"}` (**`work_order_id`, not `id`**).

---

## What gets created, either way

11 records, all prefixed **ZZAUTOTEST**, in dependency order:

customer → contact → asset → 4 work orders → vendor → catalogue part → stocked-source part →
stocked part → fuzzy-target customer → fuzzy near-miss customer → part sale.

The facts the test cases depend on:

| | |
|---|---|
| ZZAUTOTEST Bridgeport Hauling | company phone `(419) 555-0143` |
| Marlene Okonkwo, its contact | her own phone `(419) 555-0177` — deliberately different |
| 2019 Freightliner Cascadia | unit `ZZT-4471`, chassis `1FUJGLDR9KLZZ4471`, plate `OHZZT471` |
| ZZAUTOTEST Marlene Freight Lines / ZZAUTOTEST Darlene Cartage | the near-miss pair |
| ZZT-88-4412 | the part that is both in the catalogue and in stock |

---

## Checking the old search after a LIVE reseed

Production runs the old search, so it is the reference for every comparison. To measure it without a
browser:

```bash
python3 build/global-search/prod-v1-comparison-2026-09-15/verify_prod_v1.py
```

It fetches the whole collection the page fetches and applies the old version's own two passes. Last
run: **13 of 13** asserted behaviours confirmed.

**Two traps when comparing by hand.** A phone number in the old version matched only **with dashes or
as a fragment** — `419-555-0143` ✅ · `555-0143` ✅ · `(419) 555-0143` ❌ · `4195550143` ❌. And the old
version showed **three rows per group**, so a common make or year will not surface our record there,
and that is **not** a difference from the new version.
