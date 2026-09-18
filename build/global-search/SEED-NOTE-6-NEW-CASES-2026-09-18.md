# DATA SEEDING COMPLETE → C55718–C55723 (the 6 new Global Search cases)

**2026-09-18, seeding session.** For the **build-verify** session and the **run** session.
Branch `sv9160`, marker **`v26.36.7-29ca209`**. **Nothing here blocks you.**

## ✅ ALL SIX CASES HAVE THEIR DATA. Prove it in one command before you start:

```bash
cd build/global-search/seeding && python3 status.py        # is everything still there?
python3 verify_ranking.py                                   # 20 checks incl. ORDER
```

`status.py` is read-only and takes seconds. **If the build marker has moved, the branch redeployed
and records are gone** — `./reseed_everything.sh qa` rebuilds all of it.

## What each case uses

| Case | What it needs | What is seeded |
|---|---|---|
| **C55718** exact number you cannot access | a role without Work Orders + a work order with a known number | Sign in with **`ZZAUTOTEST No Work Orders View`**; type **`S2-15430`**. A permitted user gets it pinned; the restricted user must get nothing |
| **C55719** contact match hidden without Customers access | a customer matched ONLY via a contact + a role without Customers | Sign in with **`ZZAUTOTEST No Customers View`**; type the contact phone **`(264) 400-0199`** (or `zzrankf@northgate-cartage.test`). It matches **Northgate Cartage Company**, whose NAME contains neither value |
| **C55720** several areas hidden together | a role missing MORE THAN ONE bundle + records of many types on one keyword | Sign in with **`ZZAUTOTEST No Work Orders Or Vendors`** ← **created for this case**; type **`Fib`**, which spans all eight groups. **Four groups must vanish** (Work Orders, Vendors, Purchase Orders, Vendor Invoices) and Customers, Assets, Parts, Part Sales must stay |
| **C55721** typo does not leak a part | a part a typo matches + a role without Catalog & Inventory | Sign in with **`ZZAUTOTEST No Parts View`**; type **`Altenator`** (typo of Alternator) |
| **C55722** more open work orders ranks higher | two customers, one with many open jobs | **`ZZOPENCOUNT`** → `Freight Busy` (**5 open**) vs `Freight Quiet` (**1 open**). Verified: Busy ranks first |
| **C55723** name match beats secondary-field match | two customers, one matched by name, one by address only | **`ZZNAMEBONUS`** → `ZZNAMEBONUS Cartage` (name) vs `Sterling Brothers Freight` (keyword is in its **address**). Verified: the name match ranks first |

**Four of the six needed nothing new** — the roles, the work order, the contact-only customer and the
typo-matchable part were already seeded. Only the two-bundle role and the two ranking pairs are new.

## 🔴 TWO THINGS THAT WOULD HAVE COST YOU A FALSE FAILURE

**1. An ESTIMATE does not count as an open work order.** A newly created work order *is* an estimate.
Seeded that way, C55722's pair ranked the **wrong way round** — five estimates lost to one. Driven to
`in_progress`, it ranks correctly. C55709's work order was also found sitting at **Paid**, a terminal
status, so "an asset on an OPEN work order" was an asset on a closed one. Both are fixed, and
`apply_ranking_signals.py` now **sets the status explicitly on every run** rather than trusting the
state a record was created in.

**2. C55707 (existing case) FAILS on this build — and the data is correct.** It expects
prefix > whole-word > typo. The typo ranks last correctly, but **`Bolton ZZPREFIX Services`
(whole-word) outranks `ZZPREFIX Freight Ltd` (prefix)**. Isolated properly before reporting: the two
records are otherwise identical, and re-saving them in **both** orders gave the **same** ranking, so
the recency tiebreak is not the cause. **Run the case and record the failure — it is a real result,
not bad data.** The verifier flags it as a known deviation rather than a seeding failure.

## Watch-outs the handoff named, confirmed on the build

- **Index lag is real but short.** New records are findable within seconds; an ordering signal applied
  *after* a record is indexed may need the parent re-saved. If something looks absent, re-search
  before concluding.
- **Permission change → re-read.** After switching roles, confirm the change took effect before
  reading results.
- **Reset roles to template before applying them** (QA lead, 2026-09-17): Edit → **Reset To Template**
  → **Save** → then assign. **If Reset To Template leaves Save disabled, the role is already default.**
  The seven `ZZAUTOTEST …` roles are rebuilt from the template by the seeder and do not need it.
- **Ranking is config-driven** (`search.yaml`) and can differ per environment — assert the ORDERING
  RULE, never an absolute position or score.

## OUTSTANDING — what I need from you

| # | Item | Who |
|---|---|---|
| 1 | **Nothing blocks the build-verify or run sessions.** All six cases have their data and it is verified. | — |
| 2 | C55707's deviation above is a **candidate finding**, not filed — ticket creation follows your own session's rules | the run session |
| 3 | C44880 still needs the second organisation's session (unrelated to these six) | QA lead |
