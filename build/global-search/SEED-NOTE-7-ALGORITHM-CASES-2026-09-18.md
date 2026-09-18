# DATA SEEDING → C55724–C55730 (the 7 search-algorithm cases)

**2026-09-18.** Branch `sv9160`, marker **`v26.36.7-069b8c2`**. For the build-verify and run sessions.

## Run this first — it answers "is it all still there" in seconds

```bash
cd build/global-search/seeding && python3 status.py       # read-only
python3 verify_ranking.py                                  # every assertion
```

## Per case

| Case | Type this | What you get |
|---|---|---|
| **C55724** prefix > whole-word > typo | `ZZPREFIX` | 3 customers, identical address/phone, no contacts, no open work orders: `ZZPREFIX Freight Ltd` (begins), `Bolton ZZPREFIX Services` (mid-name), `ZZPREFIY Cartage` (typo) |
| **C55725** unrelated query returns nothing | `Zqwxpol` | Nothing. **Control:** `Aabridge` must return Aabridge Freight — that proves the search is working, so the miss means something |
| **C55726** accents ignored | `ZZACC Jose Martinez` and `ZZACC José Martínez` | Both find the one customer `ZZACC José Martínez` |
| **C55727** dash / apostrophe optional | `ZZPUNC OBrien` · `ZZPUNC Smith Jones` and the punctuated forms | `ZZPUNC O'Brien Haulage` and `ZZPUNC Smith-Jones Motors` |
| **C55728** sound-alike is NAMES ONLY | **`Olternaytor`** | The **customer** `ZZPHON Alternator Co` comes back; the **part** `ZZPHON Alternator Assembly` must NOT. 🔴 The customer is the control — without it a miss proves nothing |
| **C55729** exact ID beats a strong name match | `S2-15430` | The work order pins as the single top row, **above** customer `S2-15430 Holdings`, whose name begins with the same text |
| **C55730** below the top 20 is unreachable | broad `ZZBROAD`, then narrow `ZZBROAD Target` | 22 parts match; the tab shows **20**; `ZZBROAD Target Widget` (out of stock) is not among them. Narrowing surfaces it |

**The sound-alike for C55728 was discovered, not guessed.** Four candidates were tried against the
live build; all four match the customer control and miss the part. **`Olternaytor`** is the one to use.

## 🔴 Three things that would otherwise waste your time

**1. A deleted record can stay in the search index.** `ZZPREFOX Cartage` was deleted — `/api/customers`
returns three ZZPREF customers, `/api/search` still returns four, **at the same moment, for over a
minute**. If `ZZPREFIX` shows four rows, check the list endpoint before touching data: it is an
indexing lag, not a seeding fault. **Worth a look as a product observation in its own right.**

**2. Work orders on this branch get driven to terminal states by something else.** All five of
C55722's "busy" work orders were found at **Complete**, which cannot be reopened — so the customer
with five open jobs had none and the case would have ranked backwards. `apply_ranking_signals.py`
now **counts what is genuinely open and creates the shortfall**, so re-running it repairs this.

**3. C55707 fails on this build and the data is correct** (carried over from yesterday): whole-word
outranks prefix. Isolated — re-saving the pair in both orders gave the same result, so it is not the
recency tiebreak. **C55724 asserts the same rule, so expect it to fail too. That is a real result.**

## Verification state

All checks pass except the ZZPREFIX count, which reads 4 because of the stale index row above; the
database holds the correct 3. Everything else — the order assertions, both control-backed negatives,
the 20-row cap, the accents, the punctuation — is green.

## OUTSTANDING — what I need from you

| # | Item | Who |
|---|---|---|
| 1 | Nothing blocks you. All seven cases have their data | — |
| 2 | The stale-index-after-delete behaviour is a **candidate observation**, not filed | run session |
| 3 | C55707 / C55724's prefix-vs-whole-word deviation is a **candidate finding**, not filed | run session |
