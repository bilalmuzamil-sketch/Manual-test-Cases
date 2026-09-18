# DATA-SEEDING HANDOFF — Global Search algorithm cases (7 new, 2026-09-18)

For the 7 new search-algorithm cases (C55724–C55730) in run **R415**. Method follows
`build/skills/20-FEATURE-DATA-SEEDING.md` + Rule 111. Standing-authorised on QA/Staging (Rule 107):
create/change/delete test data freely, tag everything **`ZZAUTOTEST`**, restore what is not the point
of the test. **Search runs on OpenSearch — after seeding, allow index lag (up to ~30s) before the
record is findable; do not call a MISS until the record has had time to index.**

## Seeding discipline (do all four)
1. **Unique keyword per case** so results are unambiguous and cannot collide with real data. Suggested
   tokens below — all begin `ZZ` and are tagged `ZZAUTOTEST`.
2. **A control** where the case needs "only this differs" — hold every other signal equal.
3. **Seed, then VERIFY** the record is findable in search (separate step) before handing the case to run.
4. **Idempotent** — re-running the seed must not create duplicates (match on the unique keyword).

## Per-case seed data
| Case | What to seed | Query used | The point |
|---|---|---|---|
| **C55724** strict prefix regression (SV-10211) | THREE customers, **identical** address + telephone, no contacts, no open work orders, none recently viewed: **A** name begins with token — `ZZPREFIX Freight Ltd`; **B** name contains token part-way — `Bolton ZZPREFIX Services`; **C** typo-only — `ZZPREFIY Cartage` | `ZZPREFIX` (Customers tab) | Only the match TYPE differs, so order must be A, B, C. Mirrors the defect exactly. |
| **C55725** unrelated returns nothing | One customer with a distinctive name — `ZZUNREL Aabridge Freight` | an UNRELATED string, e.g. `Zqwxpol` | The record must NOT come back — nothing else matching that string should exist. |
| **C55726** diacritics | One customer with accents in the name — `ZZACC José Martínez` (accents on e and i) | `ZZACC Jose Martinez` (plain) and the accented form | Both spellings find the one customer. |
| **C55727** dash/apostrophe | Two records: `ZZPUNC O'Brien Haulage` (apostrophe) and `ZZPUNC Smith-Jones Motors` (hyphen) | `ZZPUNC OBrien` / `ZZPUNC Smith Jones` and the punctuated forms | Found with or without the apostrophe/hyphen. |
| **C55728** phonetic names-only | One part whose description carries a distinctive word — `ZZPHON Alternator Assembly` (inventory part). Optional control: a customer named `ZZPHON Alternator Co` to show names DO sound-alike match | a sound-alike of `Alternator` that is NOT a close spelling (choose one during seeding, e.g. a metaphone-equal variant) | The PART must NOT be returned by the sound-alike (phonetic is names-only); the customer control MAY be. |
| **C55729** exact-ID pinned above strong name | One work order with a known number (note it, e.g. `S9160-#####`); one customer whose name BEGINS with that same number string — `<that number> Holdings` | the exact work order number | The work order is pinned as the single top row above the customer group. |
| **C55730** below top-20 unreachable | **21+** parts sharing a broad token `ZZBROAD` (in stock, recent so they rank high), plus ONE target part `ZZBROAD Target Widget` made to rank LOW (out of stock, no recent activity). A narrower query must match the target + only a few | broad: `ZZBROAD`; narrow: `ZZBROAD Target` | On the broad query the target is beyond 20 and not shown; narrowing surfaces it. |

## After seeding
- For each case, run the search once yourself and confirm the seeded records appear (or, for C55725
  and the C55728 part, correctly do NOT appear) before the case is executed.
- If a record is missing, wait for index lag and retry before treating it as a finding (Rule 104 — prove
  the instrument first).
- Keep a note of the exact seeded identifiers (WO number for C55729, the chosen sound-alike for C55728)
  so the case's tester uses the same values; correct only the identifier in the case if the seeded value
  differs (Rule 112).

## Scope note
This handoff covers the 7 algorithm cases only. The earlier permission cases (C55718–C55723) and the
first permission/ranking batch have their seeding described in
`BUILD-VERIFY-HANDOFF-6-NEW-2026-09-18.md` and `BUILD-VERIFY-HANDOFF-PERMS-SEARCHLOGIC-2026-09-18.md`.
