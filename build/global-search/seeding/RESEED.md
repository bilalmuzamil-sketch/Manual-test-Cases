# RESEED — the reseed keywords

> **📖 EVERY trap, count target, permission map and non-seedable item is in
> [`RESEED-KNOWLEDGE.md`](RESEED-KNOWLEDGE.md) — one page, written so a reseed is a command rather
> than an investigation. Read it before debugging anything here.**

## 🔍 FIRST, ASK WHAT IS ACTUALLY THERE — `python3 status.py`

**Before reseeding anything, run the status board.** It is READ-ONLY, takes a few seconds, and
answers the only question that matters after a redeploy: *what survived?*

```bash
cd build/global-search/seeding && python3 status.py          # quick — spine records, every universe
python3 status.py --full                                     # then run every verifier end to end
```

It reports the **build marker and whether it changed since the last run** (a change means the branch
redeployed and losses are expected), then each universe as **PRESENT / PARTIAL / GONE** with the
missing records **named**, then the six role fixtures — and it ends with the exact command to fix
whatever is missing.

**It refuses to guess.** If the session is not live it stops and says so, because every probe would
otherwise read as "missing" when the data is perfectly fine. A 5xx from the search service is
reported as **the service, not your data**. And it checks **identity, not row counts** — a count of 1
has already produced a false PASS on a real regression here.

---

**Say one of these and nothing else. I will do the rest.**

There are **two universes** of test data and they must never be mixed, so each one has its own
keyword per environment. Ids and state are stored per universe AND per environment, so a production
run can no longer overwrite the QA branch's record ids (which it once did, and four work orders then
read as MISSING while sitting right there).

| You say | I reseed | Which data | Where |
|---|---|---|---|
| **`RESEED QA`** | the QA branch | the **V1-regression** universe (11 records, sections 6769 / 8056) | `sv9160.qa.shopview.com` |
| **`RESEED LIVE`** | production | the **V1-regression** universe | `app.shopview.com`, workplace **Trucks Hill 2** |
| **`RESEED GSV2 QA`** | the QA branch | the **Global Search V2 "Fibridge"** universe (33 records + statuses + purchase orders + vendor invoices, sections 6721–6740) | `sv9160.qa.shopview.com` |
| **`RESEED GSV2 LIVE`** | production | the **Fibridge** universe | `app.shopview.com`, workplace **Trucks Hill 2** |

| **`RESEED RANKING QA`** | the QA branch | the **ranking + fuzzy-remainder** universe (25 records, sections 6726 / 6725) | `sv9160.qa.shopview.com` |
| **`RESEED TOGGLE QA`** | the QA branch | the **same-record permission toggle** universe (20 records + a PO and vendor invoice, section 6734 — C55731–C55737) | `sv9160.qa.shopview.com` |
| **`RESEED PARITY QA`** | the QA branch | the **SV-10279 prefix-parity** comparison (12 records, one keyword across customers / vendors / assets / parts) | `sv9160.qa.shopview.com` |
| **`RESEED PERTAB QA`** | the QA branch | the **per-tab prefix** universe (14 records — C72120 Parts, C72121 Vendors, C72122 Assets) | `sv9160.qa.shopview.com` |

🔴 **`RESEED EVERYTHING QA`** is now the one to reach for after a redeploy — **`./reseed_everything.sh qa`**
rebuilds **all six** universes in dependency order and runs **each one's own verifier where it
has one**
(V1-regression → Fibridge 39 checks → ranking 10 checks). `RESEED EVERYTHING LIVE` rebuilds only the
V1-regression universe, because production runs V1 and the other two are QA-branch features.

🔴 **KEYWORDS MUST BE FAR APART IN EDIT DISTANCE, NOT MERELY DIFFERENT.** The ranking universe was
first built on `ZZRANKQ`, `ZZRANKC`, `ZZRANKV`… — one character apart. The search is deliberately
fuzzy, so every keyword matched every other one, and each returned the same eight customers. Every
record had been created, verified present and field-checked clean; only SEARCHING for them exposed
it. The tokens are now whole distinct words (`ZZPREFIX`, `ZZCUSTOPEN`, `ZZASSETLIFT`, `ZZVENDORPO`,
`ZZTIEBREAK`, `ZZSTOCKPART`, `ZZPARTBUSY`, `ZZCONTACTONLY`, `ZZFUZZLEN`). **A `<PREFIX><letter>`
scheme is exactly wrong for a fuzzy search, however tidy it looks in a table.**

🔴 **A CATALOGUE PART IS NOT SEARCHABLE WITHOUT AN INVENTORY ROW.** Both part keywords returned
nothing while their catalogue parts were present and verified — the search indexes the stock record.

The words share no leading letters on purpose — **QA** and **LIVE** cannot be confused for one
another the way "qa" and "prod" can when typed quickly, and **GSV2** is impossible to say by
accident.

---

## 🌱 THE CONVENTION FOR THE NEXT FEATURE — this file is the register for ALL of them

**This is not a Global Search file any more; it is where every feature's reseed keywords live.**
Other areas of the app will need their own seeded data, and each one gets the same shape:

> **`RESEED <FEATURE> QA`** and **`RESEED <FEATURE> LIVE`**

**Rules for a new keyword, so the list stays unambiguous as it grows:**

1. **Two keywords minimum — one per environment.** Never one keyword that guesses the environment.
2. **The `<FEATURE>` token must be impossible to say by accident** and must not share a prefix with
   an existing one. `GSV2` is the model.
3. **Add the row to the table above the moment the kit exists**, with the record count, the sections
   it serves, and the host. A keyword nobody registered is a keyword nobody can use.
4. **Each universe keeps its own state, keyed by universe AND environment.** Two features must never
   write into one state file.
5. **Name the verifier for that feature in its row**, because 🔴 **the verification step can be a
   DIFFERENT PROGRAM per environment** — running the wrong one reports a dead environment that is
   perfectly healthy, and somebody then reseeds something that was never broken.

**To stand up a new feature's kit:**

```bash
python3 build/testing-tools/seeding/scaffold_seeding.py <project-slug> "<Feature Name>"
```

It copies the proven engine and leaves you only the manifest to write. **The method is
`build/skills/20-FEATURE-DATA-SEEDING.md`; the manifest schema is
`build/testing-tools/seeding/MANIFEST-SCHEMA.md`.** Both were written so that the second feature
area costs a fraction of the first.

---

## 🔴 WHAT I RUN FOR THE GSV2 KEYWORDS — the exact sequence, so nothing is rediscovered

Four steps, in this order, because each depends on the one before. All of them are safe to re-run:
every step measures first and creates only the difference.

```bash
cd build/global-search/seeding

# ── RESEED GSV2 QA ────────────────────────────────────────────────────────────────
export SEED_MANIFEST=seed-manifest-gs-v2.json
python3 seed.py --check                     # 1. measure, write nothing
python3 seed.py --confirm                   #    create the 33 records, verify every field
python3 set_wo_statuses.py --confirm        # 2. spread the work orders across the statuses
python3 seed_po_and_invoices.py --confirm   # 3. purchase orders, vendor invoices, payments
python3 verify_gsv2.py                      # 4. PROVE it: 35 identity/count/negative checks
python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-qa.md

# ── RESEED GSV2 LIVE ──────────────────────────────────────────────────────────────
export SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2"
export SEED_MANIFEST=seed-manifest-gs-v2.json
python3 seed.py --check && python3 seed.py --confirm
python3 set_wo_statuses.py --confirm
python3 seed_po_and_invoices.py --confirm
python3 verify_gsv2_v1.py                   # 🔴 the V1 verifier — see below
python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-prod.md
```

🔴 **STEP 4 IS A DIFFERENT SCRIPT ON EACH ENVIRONMENT, AND THAT IS NOT OPTIONAL.** The QA branch
runs V2 (`GET /api/search`); production runs V1 (`GET /api/global-search/fetch`) and answers **404**
to the V2 endpoint. Running `verify_gsv2.py` against production reports a dead environment that is
perfectly healthy. `verify_gsv2_v1.py` reproduces V1's own two passes over the whole collection
instead, and asserts the two known V1 misses (a contact's **email**, and a phone typed as plain
digits) as **EXPECTED** — because those are the V1-vs-V2 difference under comparison, not a broken
seed.

**A run is finished when step 4 prints all checks passed, not when step 1 prints 33/33.** "The
record exists" is not "the search returns it".

---

## If a step fails, this is almost always why

| Symptom | Cause | Fix |
|---|---|---|
| `seed.py` reports records MISSING that you can see in the UI | production's list endpoints return transient empties | already handled — the finder retries 3× before believing a miss. If it still reports missing, check for a **duplicate** before creating anything. |
| `perform-request-status-action` → **500** | the part request has no vendor yet | `POST /api/work-orders/part/change-request {id, vendor_id}` first. A 500, not a 400. |
| `orders/accept` → **500** on a work-order PO | **a suspected product defect** — see playbook §O6 | use the standalone inventory route (`/api/inventory/orders/create`), which the script already does |
| `orders/accept` → 500 right after creating a vendor | `credit_term` was written as the integer `30` | it must be a CreditTerms **string**: `Net 30`. The manifest now verifies it. |
| four plan rows all land in one purchase order | one PO per work order **and** vendor | the script uses a different work order per PO |
| production session → **409 Session has expired** | the PHPSESSID aged out | `POST /api/login {username, password}` and capture the rotated `PHPSESSID` from `Set-Cookie`. A fresh login **expires that user's previous session**, so only do it once per run. |

---

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

**And before you explain ANY change in behaviour, check the build marker:**
`curl -s https://sv9160.qa.shopview.com/ | grep app-version`. The branch is redeployed without
announcement. On 2026-09-16 it went from `v26.36.4-7869ff2` to `v26.36.7-893d13a` overnight and four
behaviours changed with it — and **the wiped data was the clue**: a reseed finding 0 of 11 records
usually means a redeploy, not a cleanup. Blaming the index for that cost four true findings, which
were withdrawn and had to be restored.

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
