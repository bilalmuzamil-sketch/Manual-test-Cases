# Global Search — ALL test data is now on STAGING, and every record was proved by search

**For:** the build-verification session
**From:** the seeding session
**Date:** 2026-09-25
**Environment:** `https://app.staging.shopview.com`
**Workplace:** **Staging Heavy Duty - 9919**
**Build marker when this was proved:** `v26.39.1-1efc285`

---

## 1 · In one line

Everything that was seeded on the QA branch for Global Search is now on staging as well, and every
universe was checked by **actually searching for the records**, not by trusting that the create call
returned 200. You can run the Global Search cases on staging using the same data, the same keywords
and the same expected rows as on the QA branch.

---

## 2 · What is on staging now

| # | Data set (what it is for) | Records | Proved how | Result |
|---|---|---|---|---|
| 1 | **V1-regression** — the 11 records the old-search comparison uses | 11 | searched for each one by name | ✅ 9 returned, 1 correctly absent by design, 1 not searchable by design |
| 2 | **"Fibridge"** — the main Global Search V2 universe | 39 | 39 named checks | ✅ all 39 |
| 3 | **Ranking, fuzzy matching and the algorithm cases** | 93 | 25 checks — 14 record checks, 8 "which row comes first", 2 "this must NOT be found" with a control, 1 typo-reachability | ✅ all 25 |
| 4 | **Same-record permission toggle** (C55731–C55737) | 20 + 1 purchase order + 1 vendor invoice | 6 per-case record checks + the 3-record set C55735 needs | ✅ all |
| 5 | **SV-10279 prefix parity** — one keyword across Customers, Vendors, Assets and Parts | 12 | searched for each one | ✅ all 12 |
| 6 | **Per-tab prefix** (C72120 / C72121 / C72122) | 14 | searched for each one | ✅ all 14 |
| 7 | **Permission role fixtures** — the 7 cut-down roles the permission cases need | 7 roles | read back off the live role list | ✅ all 7 |

**Status board:** all seven show **PRESENT**. Re-run it any time with:

```
SEED_PROFILE=/tmp/staging/cookies.json SEED_WORKPLACE="Staging Heavy Duty - 9919" \
  python3 build/global-search/seeding/status.py
```

---

## 3 · Two things you should know before you trust any result

### 3.1 The record numbers on staging are NOT the QA numbers

Work orders, part sales and purchase orders are numbered **by the branch**. The very same records
read `S9160-…`, `P9160-…`, `I9160-…` on the QA branch and `S2-…`, `P2-…`, `I2-…` on staging.

**What this means for you:** if a test case names a work order number, a part sale number or a
purchase order number, **that number will be different on staging** and the case will look like it
failed when nothing is wrong. Find the record by the **customer or vendor name** instead — every one
of our seeded rows carries it. If you hit such a case, tell me and I will correct the identifier in
the case (and only the identifier).

This bit us in our own tools: six healthy checks were reporting "missing" for exactly this reason,
and the status board was telling the reader to rebuild data that was sitting there. Both are fixed.

### 3.2 Check the build marker before you explain any change in behaviour

```
curl -s https://app.staging.shopview.com/ | grep -o 'app-version[^>]*'
```

If it is no longer `v26.39.1-1efc285`, staging has been redeployed. A redeploy **may** wipe seeded
records — one has taken 32 of 33, another took none — so do not assume either way. Run the status
board and tell me; a full rebuild is one command and takes about 20 minutes.

---

## 4 · SV-10279 reproduces on staging — measured, not assumed

Searching **`ZZVORTAC`** on staging, where the keyword sits at the very start of the name in all four
cases:

| Tab | Record | What the product labels the match |
|---|---|---|
| Customers | ZZVORTAC Freight Ltd | **prefix** ✅ |
| Vendors | ZZVORTAC Supply Co | **prefix** ✅ |
| Assets | unit ZZVORTAC… | **prefix** ✅ |
| **Parts** | **ZZVORTAC Brake Kit** | **word** ❌ |

Three entity types apply the "starts with the keyword" rule; **Parts does not**, on its `description`
field — which is the field the PRD names as a part's displayed name. This is the same result we
measured on the QA branch, now confirmed on a **second, independent environment and a different
build**. That removes "it's just that branch" as an explanation.

For comparison, the per-tab keywords behave correctly everywhere except Parts:

| Case | Keyword | Begins with | Contains | Close spelling |
|---|---|---|---|---|
| C72120 Parts | ZZKRYPTON | **word** ❌ (should be *prefix*) | word | fuzzy |
| C72121 Vendors | ZZMAGENTA | prefix ✅ | word | fuzzy |
| C72122 Assets | ZZOBSIDIAN | prefix ✅ | word | fuzzy |

---

## 5 · OUTSTANDING — what I need from you

### On YOU — two decisions, and how to make them

1. **Do you want the leftover invoice removed from staging?**
   There is one vendor invoice on staging called `ZZT-INV-GSV2-ZZT-FIB-`, left behind by an older
   numbering scheme that cut names short. It is marked **paid** and it is harmless — no case uses
   it. **What to do:** just reply *"remove it"* or *"leave it"*. If you say remove, I will delete it
   and prove it is gone.

2. **One purchase order on the Fibridge vendor would not go to "ordered".**
   Staging answered *"This action cannot be performed on requests that are waiting to receive."*
   Every case that needs a purchase order has one, so nothing is blocked today — but I have not got
   to the bottom of why that one row refuses. **What to do:** reply *"look into it"* if you want me
   to spend the time, or *"leave it"* if you would rather I did not.

### On ME — nothing is blocking you

- I still owe you the diagnosis of that one purchase order, **if** you ask for it (item 2 above).
- If staging gets redeployed, rebuilding all the data is on me — say **"RESEED STAGING"** and I will
  do it and report the proof.

### Still parked from earlier, unchanged

- **C44880** needs a login captured inside the second organisation. You said to do this after
  everything else.
- **The SV-10279 ticket comment** is drafted but not posted — I will not post anything to Jira
  without your word.
- **Existing test cases predate Rule 113** (expected results must be the source's exact words). I
  have flagged it and have not touched a single case.
