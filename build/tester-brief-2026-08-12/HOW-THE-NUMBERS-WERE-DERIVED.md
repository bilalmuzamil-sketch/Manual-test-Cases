# How every number in the tester brief was derived — 12 August 2026

`build/TESTER-BRIEF-2026-08-12.md` is **generated**, not written by hand, because the counts moved
repeatedly today and a stale brief is worse than none.

## The chain

1. **`census.py`** — pages `get_sections` (626 live sections; **an unpaged call returns 250 and
   silently finds nothing**) and `get_cases` (4096 live cases), walks the section tree down from each
   project's group, and reads the `AUTOMATION:` marker out of each case's Expected Results.
2. **`holds.py`** — collects every `HOLD` case with its reason, and cross-reads each project's run for
   results already recorded against a held case.
3. **`gen_brief.py`** — writes the brief. Every figure comes from steps 1 and 2; nothing is
   transcribed.

## What was measured

| Project | Group | Ours | READY | EXPECT FAIL | HOLD | Foreign | Run | Tests in run |
|---|---|---|---|---|---|---|---|---|
| Filters | 4110 | 115 | 90 | 7 | 18 | 5 | 352 | 115 |
| Schedule | 4254 | 176 | 141 | 4 | 31 | 0 | 357 | 176 |
| Report Suite | 4281 | 480 | 343 | 95 | 42 | 12 | 359 | 480 |

**The arithmetic gate passes on all three** — `READY + EXPECT FAIL` equals `total − HOLD` in every
row: 97 = 97, 145 = 145, 438 = 438. **This is a marker count, not a coverage claim.**

**Every run holds exactly our cases** — the case-id sets are equal in both directions, so nothing we
own is missing from a run and no run carries a case we do not own.

## The foreign cases, and why they are excluded

**17 cases in these groups were written by someone else** and are excluded from our counts under the
hands-off rule — reported here so the totals stay honest without claiming or hiding anyone's work:

- **Filters, 5** — C43576–C43580, created by user **7** (Ahtasham Amjad). They carry `refs` but no
  automation marker.
- **Report Suite, 12** — C38919–C38923 and C43567–C43573, created by user **1** (Vladimir Tomovic),
  the automated cases. No `refs`, no marker.

**None of the 17 sits in any run**, which is why the run test counts match our own totals exactly.

## The finding that made the brief's opening line necessary

**19 of the 91 held cases already carry a result, and 16 of those say Passed.** A test that cannot be
run cannot have passed, so those results need clearing up before they are read as evidence.

**Stated honestly: 3 of them are not a tester's error.** C30004, C30013 and C30020 were moved onto the
skip list **today, by this session**, after their results had been recorded. The other 16 predate
today's work.

**The brief's own claim was checked mechanically:** it lists **91** skip rows, **91** of them unique,
matching the total it states.
