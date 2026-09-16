# The sweep — can every test in this suite actually be run?

**Date:** 2026-09-15 · **Cases swept:** all **65** (sections 6769 and 8056) · **Result: yes, now.**

The question this answers: **every case tells the tester to type something into the search box. Does a
record actually exist that contains it?** If not, the tester types it, nothing comes back, and it looks
exactly like the search is broken.

## How it was done

1. Read all 65 cases and pulled out **every value a tester is told to type** — 45 distinct values.
2. Checked each one against the **seeded records directly**, reading 490 field values off the records
   themselves. 🔴 **Deliberately NOT through the search box** — search is the thing under test, so using
   it as the measuring instrument would prove nothing.
3. Classified the 24 cases whose steps name no specific value.

## What came back

**41 of 45 values are carried by a seeded record.** Postcodes, phone numbers in both formats, the
website, the second address line, the county, the contact's name and job title, part numbers whole and
partial, the chassis number whole and partial, mixed capitals, spaces removed — all present.

**Four were flagged, and only one was a real gap:**

| Value | Verdict |
|---|---|
| `ZZNOSUCHRECORD9999` | ✅ Correct — this one **must** match nothing. It is the no-results test. |
| `Halloway` | ✅ Correct — the tester creates that record during the test ("findable within 30 seconds"). |
| `2019 Freightliner` | ✅ Not a gap — it is the year and the make, **two separate fields**. Both are on the vehicle (year `2019`, make `Freightliner`). The old version joined year + make + model into one searchable string, which is why the phrase worked. |
| **`17597`** | 🔴 **A REAL GAP — and the worst kind.** |

## The real gap, and why it mattered more than it looks

Six cases referred to work order numbers **that no longer exist** — and in **three different,
contradictory ranges**: `S9160-17580` to `17583`, `S-17597`, and `S9160-17597` to `17600`. The jobs
actually on the branch today are **`S-17611` to `S-17614`**.

**Job numbers change every time a new build goes on the branch.** Any number printed in a test case is
wrong within days. A tester would have typed `17597`, got nothing, and filed a fault against a search
that was working perfectly.

**The fix — the tester now reads the number off the screen:**

> Type **ZZAUTOTEST** into search. The **Work orders** group lists our four test jobs. Write down the
> number of any one of them — it looks like **S-17611**. Use that number for this test.

Five seconds, no tools, nothing to install, and **it is right forever** because it comes from the
product itself. Fixed on C45153, C55658, C55659, C55661, C55672, C55684.

## Two cases that sent the tester away to look something up

- **C53516** said *"type the licence plate exactly as it is saved on the asset record"* — so the tester
  had to go and find it. It now **gives the plate (`OHZZT471`)**, keeping the lookup only as a fallback.
- **C53579** said *"for example S-1234"*, a made-up number. It now points at the same ZZAUTOTEST lookup.

A non-technical tester should be handed the value, not sent hunting for it.

## The five-second data check, now on all 65 cases

Added at the top of every case, once:

> **BEFORE YOU START — a five-second check that the test data is there.** Open global search and type
> **ZZAUTOTEST**. You should get several groups of results. **If you get nothing at all, a new build has
> wiped our test data** — stop and ask for it to be put back (one command, about a minute).
> **Do NOT create the records yourself** — records made by hand come out slightly different every time,
> and a test that passes against the wrong data is worse than one that fails.

**Verified live:** typing `ZZAUTOTEST` returns **14 results across 6 groups** (work orders, customers,
assets, parts, vendors, part sales).

**Why not have the tester build the missing data?** Because they would build it slightly differently
each time — one types the postcode with a space, another without — and the test then passes against
data the tester invented rather than the data the case was written to check. One command restores all
eleven records identically in about a minute; sixty-five sets of hand-setup instructions do not.

## The 24 cases whose steps name no value — all accounted for

| Kind | Cases | Why that is fine |
|---|---|---|
| Behaviour only, no data needed | C45156, C45158, C45161, C55683 | keyboard shortcut, no feature flag, two-character minimum, the shortcut hint |
| The tester creates the record as part of the test | C53587, C45160 | "a new job is findable", "selecting a result is recorded" |
| Permission and location cases — need **roles**, not a search word | C45142-45148, C45150, C45151, C45152, C45154, C45155, C45157, C45159 | their setup is roles and locations, which is declared separately in the seed manifest |
| Already names a seeded value | C55674 | types "Bridgeport" |

These also got easier: the new check at the top means a tester always has a word that returns results
(`ZZAUTOTEST`), so *"search a word that matches a work order"* is no longer a puzzle.

## Proof that nothing broke

72 cases were written to. Afterwards, re-checked across all 65:

```
stale hardcoded job numbers   : NONE
missing the data check        : NONE
data check duplicated         : NONE

coverage proof : 73 capabilities · 0 missing · 0 out of run · 0 unmapped
source audit   : 64 of 64 still lead with V1, 0 need fixing
seed check     : 11/11 records · 0 field gaps · 0 not compared · 0 cases at risk
```

## What this now guarantees

**Every one of the 65 cases can be run by a non-technical tester, with no lookups, no tools and no
hand-built data** — provided the five-second check passes. If it does not, the answer is one command,
not an hour of typing.

**And it stays true.** Nothing in the suite now depends on a value that a redeploy can change: the only
number that moves is read off the screen at the moment it is needed.
