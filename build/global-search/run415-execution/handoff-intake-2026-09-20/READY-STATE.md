# Ready state before the three new handoffs land — 2026-09-20

## Access and data: green, on the build the handoffs name

| Check | Result |
|---|---|
| Session | fresh cookies in `/tmp` (`chmod 600`, never committed, Rule 82); `qa-branch-boot.mjs` signs in — `template_slug=administrator`, 57 permissions |
| Bridge | restarted, OK |
| Build marker | **`v26.36.8-d146c39`** — the build both existing handoffs name. The branch has been rebuilt twice since my last results (`29ca209` → `069b8c2` → `d146c39`) |
| Seeded data | **all four universes PRESENT** — V1-regression 11 · Fibridge 39 · ranking/fuzzy 39 · **7 of 7 permission roles** |
| Ranking controls | `verify_ranking.py` **20 of 20** on this build |

## Run 415 today: 200 tests

**160 Passed · 14 Failed · 11 Retest · 0 Blocked · 15 Untested.**

## The 15 untested, grouped — this is the de-duplication baseline

| Section | Cases | What they are |
|---|---|---|
| **6725** fuzzy/matching | C55725, C55726, C55727, C55728 | unrelated query returns nothing · accented name · dash/apostrophe name · sound-alike is names-only |
| **6726** ranking | C55724, C55729, C55730 | prefix above whole-word · exact identifier pinned · a record below the top 20 |
| **6734** permissions | C55731, C55732, C55733, C55734, C55735, C55736, C55737 | one access bundle flipped at a time (Parts · Work Orders · Customers · Part Sales · Vendor & Order Mgmt · Financial Data) and a restricted record not counted |
| **6767** | C45140 | telemetry is out of v1 scope |

## Already run, and therefore duplicate-suspects when the new handoffs arrive

| Group | Status | Evidence age |
|---|---|---|
| **Handoff A — permissions 12**: C44877, C44878, C44879, C44880, C44881, C44882, C55702–C55706, C55717 | 11 Passed, C55706 Failed (SV-10163) | written **17 Sep on `v26.36.7-29ca209`** — **two builds old** |
| **Handoff B — first six**: C55718–C55723 | all 6 Passed | written **18 Sep on `v26.36.7-29ca209`** — **two builds old** |
| **Handoff B — the other seven**: C55724–C55730 | **never run** | — |

## The de-duplication rule I will apply (his instruction, 2026-09-20)

1. Read all three new handoffs first, then diff their case lists against the table above **and against
   each other**.
2. Where a case appears in more than one handoff, **the newest handoff wins** — its expectations, its
   data, its warnings. The older instruction is dropped and **named in the report as dropped**.
3. Where a case has already been run but the new handoff changes what to type, what to expect, or the
   role to use, **it is re-run under the new wording** — a stale pass is not a reason to skip.
4. A case already run on an older build is **not** treated as done when a newer handoff names this
   build; the build moved twice, and on the last move a defect I had raised stopped reproducing.
5. Anything in the run that no handoff mentions (today: C55731–C55737 and C45140) is listed as
   outstanding rather than quietly run or quietly skipped.
6. Rule 111 stands throughout: a handoff is a work list. How a result is recorded, how a defect is
   shaped, and what a screenshot looks like come from our own rules, and anything I override is named.
