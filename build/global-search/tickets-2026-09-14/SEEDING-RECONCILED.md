# Seeding reconciled with the official seeder — 14 September 2026, 15:35 UTC

**The QA lead pointed me at `build/global-search/HANDOFF-FOR-THE-TEST-RUN.md` on the baseline branch.
It contains a seeder I did not know existed**, at `build/global-search/seeding/seed.py`. I had spent a
run building my own (`GS7_seed.mjs`) because an earlier look at that branch showed only recorded IDs
and no script — the seeding directory arrived in a later commit (the branch head moved from
`cb01938c` to `24391827`).

**The official seeder is now the one to use.** `GS7_seed.mjs` is kept only for the form mechanics it
documents (required fields, real-keystroke selects) and is not the route to seed by.

## State, read from the official seeder

```
python3 seed.py --check      # from build/global-search/seeding
```

| Record | State |
|---|---|
| Customer, asset, vendor, catalogue-only part, stocked part, four work orders | ✅ **present, 6 of 7** |
| A part sale | 🔴 **blocked by SV-10031** — part sales cannot be created; filed by the QA lead. Three cases wait on it (45151, 45153, 55665) |

**Two config keys were missing** for this session: `seed.py` reads `host` and `api` out of
`/tmp/qa/cookies.json` alongside the three cookie values, and fails with `KeyError: 'api'` without
them. Added.

## No duplicates were left behind

My own seeding ran before the official seeder was known, so the first thing checked was whether it had
left doubles. Searching each seeded record returns exactly one of each:

| Searched | Result |
|---|---|
| `ZZAUTOTEST Bridgeport Hauling` | customers:1, assets:1, work_orders:4 |
| `ZZAUTOTEST Kestrel` | vendors:1, parts:1 |
| `Marlene Okonkwo` | customers:1 |
| `ZZT-4471` | assets:1 |
| `ZZT-88-4412` | parts:1 |

## One finding confirmed live, right now

**`ZZT-77-3300` — the catalogue-only part — returns NOTHING**, while the stocked part `ZZT-88-4412`
returns parts:1. That is the handoff's upgraded "strongest finding in the batch", and it is already
filed as **SV-10001**. Confirmed on the current build with the seed in place.

## A trap from the handoff that explains earlier readings

*"A whole area looks empty — you have not set the location."* The official seeder sets the location
(`Staging Heavy Duty - 9919`) before doing anything. Any probe that does not set it can read empty and
look exactly like missing data. Worth carrying into the run.

## On the already-filed tickets

The QA lead's instruction, 15:30: **"Do not touch the tickets which you have already filed, proceed
with the rest."** So the twelve stand as filed, including SV-10016, and the handoff's withdrawal of
the *"a stocked part cannot be found by its part number"* candidate is noted here rather than acted on
— that candidate is a different claim from SV-10016, which is about the record being absent from the
Parts section while the count says 1.
