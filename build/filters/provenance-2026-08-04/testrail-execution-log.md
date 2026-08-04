# Filters — Standing Rule 54 provenance retrofit: TestRail EXECUTION LOG

**Date:** 2026-08-04 · **Authorised by the QA lead** · **`update_case` ONLY** — 0 `add_case`, 0 `delete_case`, 0 section move, 0 run write.

**Group 4110** · **110 distinct cases** · **111 successful operations, every one HTTP 200 + byte-verified MATCH** · **1 refused by a guard** (recorded below, not hidden).

## Verification method (Standing Rule 50 — EXHAUSTIVE then EXACT)

Per operation, in order:

1. **Pre-write snapshot of EVERY field**, taken read-only before the run (`snapshots/pre-write-live-cases-4110.json`).
2. **Re-GET immediately before writing**, proving the live case still matches that snapshot byte-for-byte — a drifted case **STOPS the batch**.
3. `update_case` with **only** the intended fields.
4. **Re-GET and compare field by field:** every intended field byte-equal to the intended value; **every field we did NOT intend to change proven byte-identical** to its pre-write snapshot; every field outside the snapshot byte-identical to the pre-write live read. **28 fields compared per operation** — this is the half a "200 OK" can never tell you.
5. A mismatch means **the write FAILED** → stop, dump both byte sequences, never retry blindly.

**Declared normalisation (the only one, recorded in `APP-ACTIONS-PLAYBOOK` §J):** TestRail's `refs` splits on commas, trims each entry and rejoins with a bare comma, and rejects any single entry over 248 characters with HTTP 400 `Field :refs does not match the required pattern.` So `refs` is compared under `','.join(p.strip() for p in s.split(','))` and that is asserted explicitly, not waved through. Applied on **110** operations.

**Rule 38:** the executor hard-refuses any case with `created_by != 3`. Group 4110 held **0 foreign cases** before and after — verified by a fresh live read.

## The guard that fired (kept on the record)

**[C29628](https://shopview.testrail.io/index.php?/cases/view/29628) — `FAIL-DRIFT` on `pre_get`, fields `refs, custom_expected`.**

**What happened and why it is correct.** The Rule-28 cross-case sweep run *after* the main push found that **FLT-MOB-08 (C29628)** needed the `design_awaiting` variant rather than `plain`, because its own precondition 2 reads *"at least one filter applied via the sheet"* — its route depends on the same design-only screen as its six siblings. Re-pushing it was refused by the step-2 guard, because the plan's snapshot predated **our own** first write. That is exactly the intended behaviour: the guard cannot tell our write from anyone else's, and it should not guess. The snapshot for that one case was refreshed from live, the plan rebuilt, and the case re-pushed — verified MATCH. The stamper is idempotent, so the re-stamp **replaced** the line rather than appending a second one (confirmed live: exactly one provenance sentence).

## What was written

| Fields written | Operations |
|---|---|
| `custom_expected` | 1 |
| `custom_expected`, `refs` | 110 |

## Provenance variant per case (Rule 54 honesty clause)

| Variant | Cases | What the sentence says |
|---|---|---|
| `plain` | 88 | the specification supports the expectation as written |
| `po_prose_only` | 9 | the specification covers the area in its overview / key decisions only; a later product owner decision supplies the detail (names the date) |
| `design_awaiting` | 8 | the screen comes from the agreed design, the specification does not describe it, and a product owner decision is still awaited |
| `po_ruling` | 4 | a later product owner decision overrides the specification text (names the date) |
| `no_anchor` | 2 | **no numbered requirement covers this at all** — stated in words, never invented (Rule 12) |

Spec version named on all 110 cases: **1.6** — a single generator constant, not 111 hand-typed strings. Epic named: **SV-8785**.

## Run 352 — verified untouched (Rules 34 / 47 / 50)

No run write was made, and that claim is backed by evidence rather than asserted:

| Check | Before | After | Verdict |
|---|---|---|---|
| tests in the run | 110 | 110 | case_id sets **equal in BOTH directions** |
| result records | 395 | 395 | **every prior result verified present BY ID**, not by count |
| `include_all` | false | false | unchanged |
| status counts | unchanged | unchanged | passed / failed / blocked / untested / retest all identical |

The run already contained every active case, so **no sync was required** — this pass was `update_case` only, which never changes a run's selection.

## Per-operation log

| # | Internal ID | Case | HTTP | Fields written | Fields compared | Verification |
|---|---|---|---|---|---|---|
| 1 | FLT-BAR-01 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 2 | FLT-BAR-02 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 3 | FLT-BAR-03 | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 4 | FLT-STAT-01 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 5 | FLT-STAT-02 | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 6 | FLT-STAT-03 | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 7 | FLT-STAT-04 | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 8 | FLT-STAT-05 | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 9 | FLT-STAT-06 | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 10 | FLT-CUST-01 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 11 | FLT-CUST-02 | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 12 | FLT-CUST-03 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 13 | FLT-CUST-04 | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 14 | FLT-CUST-05 | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 15 | FLT-CUST-06 | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 16 | FLT-CUST-07 | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 17 | FLT-CUST-08 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 18 | FLT-CUST-09 | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 19 | FLT-TECH-01 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 20 | FLT-TECH-02 | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 21 | FLT-TECH-03 | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 22 | FLT-TECH-04 | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 23 | FLT-TECH-05 | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 24 | FLT-TECH-06 | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 25 | FLT-TECH-07 | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 26 | FLT-ADV-01 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 27 | FLT-ADV-02 | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 28 | FLT-ADV-03 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 29 | FLT-ADV-04 | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 30 | FLT-ADV-05 | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 31 | FLT-ADV-06 | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 32 | FLT-ADV-07 | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 33 | FLT-ASSET-01 | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 34 | FLT-ASSET-02 | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 35 | FLT-ASSET-03 | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 36 | FLT-ASSET-04 | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 37 | FLT-ASSET-05 | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 38 | FLT-ASSET-06 | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 39 | FLT-CHIP-01 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 40 | FLT-CHIP-02 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 41 | FLT-CHIP-03 | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 42 | FLT-CHIP-04 | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 43 | FLT-CHIP-05 | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 44 | FLT-CHIP-06 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 45 | FLT-COLL-01 | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 46 | FLT-COLL-02 | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 47 | FLT-COLL-03 | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 48 | FLT-COLL-04 | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 49 | FLT-COLL-05 | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 50 | FLT-EMPTY-01 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 51 | FLT-EMPTY-02 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 52 | FLT-TAB-01 | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 53 | FLT-TAB-02 | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 54 | FLT-TAB-03 | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 55 | FLT-TAB-04 | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 56 | FLT-TAB-05 | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 57 | FLT-PERS-01 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 58 | FLT-PERS-02 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 59 | FLT-PERS-03 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 60 | FLT-PERS-04 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 61 | FLT-URL-01 | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 62 | FLT-URL-02 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 63 | FLT-URL-03 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 64 | FLT-URL-04 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 65 | FLT-MOB-01 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 66 | FLT-MOB-02 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 67 | FLT-MOB-03 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 68 | FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 69 | FLT-MOB-05 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 70 | FLT-MOB-06 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 71 | FLT-MOB-07 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 72 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 73 | FLT-MOB-09 | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 74 | FLT-MOB-10 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 75 | FLT-API-01 | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 76 | FLT-API-02 | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 77 | FLT-API-03 | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 78 | FLT-API-04 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 79 | FLT-API-05 | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 80 | FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 81 | FLT-STAT-07 | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 82 | FLT-ASSET-07 | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 83 | FLT-URL-05 | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 84 | FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 85 | FLT-PERS-06 | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 86 | FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 87 | FLT-PSRCH-01 | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 88 | FLT-PSRCH-02 | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 89 | FLT-PSRCH-03 | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 90 | FLT-PSRCH-04 | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 91 | FLT-PSRCH-05 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 92 | FLT-PSRCH-06 | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 93 | FLT-PSRCH-07 | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 94 | FLT-API-06 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 95 | FLT-URL-06 | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 96 | FLT-EMPTY-03 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 97 | FLT-PSRCH-08 | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 98 | FLT-PSRCH-09 | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 99 | FLT-PSRCH-10 | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 100 | FLT-PSRCH-11 | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 101 | FLT-PSRCH-12 | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 102 | FLT-PSRCH-13 | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 103 | FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 104 | FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 105 | FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 106 | FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 107 | FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 108 | FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 109 | FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 110 | FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | 200 | `custom_expected, refs` | 28 | **MATCH** |
| 111 | FLT-MOB-08 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | 200 | `custom_expected` | 28 | **MATCH** |
