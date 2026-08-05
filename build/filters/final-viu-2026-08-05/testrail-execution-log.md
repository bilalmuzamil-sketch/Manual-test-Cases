# Filters — TestRail execution log, 5 August 2026 (the final-check pass)

**Authorisation:** the QA lead's standing ruling for this pass — *"Update them/delete them as needed to
make them authentic"* and *"If our test case is wrong then we need to correct it"*.

**Scope of writes: `update_case` only.** 0 `add_case`, 0 `delete_case`, 0 `add_section`,
0 `update_section`, **0 run writes of any kind** (run 352 belongs to Ahtasham Amjad and he is grading
it). No result was logged anywhere — his instruction *"For now keep on asking me for running the
tests"* was followed.

**Verification standard (Standing Rule 50):** every write re-GET and byte-compared against the
intended payload, **all 28 fields compared on every case, no sampling**, with every field we did not
intend to change proven byte-identical to its pre-write snapshot. `refs` compared under the declared
normalisation `','.join(p.strip() for p in s.split(','))`.

## A NEW TESTRAIL NORMALISATION, FOUND THE HARD WAY

**`update_case` re-renders any TEXT field you OMIT from the payload through TestRail's HTML
pipeline** — it wrapped `custom_preconds` and `custom_steps` in `<p>…</p>` and converted `\n` to
`\r\n`. A field **sent explicitly** is stored **verbatim**.

This matters on this project specifically, because **TestRail shows this markup literally to the
tester here** — that is why 10 cases were repaired earlier today for showing raw `<ol>`/`<li>`.

**What happened, in order:**

1. Write 1 of 110 (C29557) sent only `custom_expected`. HTTP 200.
2. The byte-check compared all 28 fields and flagged **two UNINTENDED CHANGES** — `custom_preconds`
   and `custom_steps`, both newly `<p>`-wrapped with CRLF.
3. **The batch stopped immediately**, as Rule 50 requires. It did not retry and it did not proceed.
4. C29557's two fields were **restored byte-exact** from the pre-write snapshot and proven equal.
5. Every subsequent payload carried **all three** text fields, with the unchanged ones set to their
   exact snapshot value. All 110 then verified clean.

An untouched control case (C29558) was confirmed byte-identical **including `updated_on`**, so the
re-render is caused by the partial payload and not by anything ambient.

**This should go into `build/APP-ACTIONS-PLAYBOOK.md` §J. It was not edited from this worker** — that
file is outside this task's ownership. Flagged for the coordinator.

## Per-operation log

| # | Op | Case | HTTP | Verified | Fields compared | What changed |
|---|---|---|---|---|---|---|
| 1 | update_case | C29557 | 200 | MATCH | 28 | class-A waiver paragraph deleted; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails |
| 2 | update_case | C29558 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 3 | update_case | C29559 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 4 | update_case | C29560 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 5 | update_case | C29561 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 6 | update_case | C29562 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 7 | update_case | C29563 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 8 | update_case | C29564 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 9 | update_case | C29565 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 10 | update_case | C29566 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 11 | update_case | C29567 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 12 | update_case | C29568 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 13 | update_case | C29569 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 14 | update_case | C29570 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 15 | update_case | C29571 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 16 | update_case | C29572 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 17 | update_case | C29573 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 18 | update_case | C29574 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 19 | update_case | C29575 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 20 | update_case | C29576 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 21 | update_case | C29577 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 22 | update_case | C29578 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 23 | update_case | C29579 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 24 | update_case | C29580 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 25 | update_case | C29581 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 26 | update_case | C29582 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 27 | update_case | C29583 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 28 | update_case | C29584 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 29 | update_case | C29585 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 30 | update_case | C29586 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 31 | update_case | C29587 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 32 | update_case | C29588 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 33 | update_case | C29589 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 34 | update_case | C29590 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 35 | update_case | C29591 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 36 | update_case | C29592 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 37 | update_case | C29593 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 38 | update_case | C29594 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 39 | update_case | C29595 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 40 | update_case | C29596 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 41 | update_case | C29597 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 42 | update_case | C29598 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 43 | update_case | C29599 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 44 | update_case | C29600 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 45 | update_case | C29601 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 46 | update_case | C29602 | 200 | MATCH | 28 | class-A waiver paragraph deleted; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict |
| 47 | update_case | C29603 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 48 | update_case | C29604 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 49 | update_case | C29605 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 50 | update_case | C29606 | 200 | MATCH | 28 | class-A waiver paragraph deleted; assertion restored to the documented requirement; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails |
| 51 | update_case | C29607 | 200 | MATCH | 28 | class-A waiver paragraph deleted; assertion restored to the documented requirement; plain deviation note added naming the closed ticket; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict; provenance no longer names the build as the source of an expectation the build fails |
| 52 | update_case | C29608 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 53 | update_case | C29609 | 200 | MATCH | 28 | stale refs corrected; "and the build" dropped from the divergence sentence; spec version corrected 1.6 -> Confluence 18 |
| 54 | update_case | C29610 | 200 | MATCH | 28 | stale refs corrected; "and the build" dropped from the divergence sentence; spec version corrected 1.6 -> Confluence 18 |
| 55 | update_case | C29611 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 56 | update_case | C29612 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 57 | update_case | C29613 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 58 | update_case | C29614 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 59 | update_case | C29615 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 60 | update_case | C29616 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 61 | update_case | C29617 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 62 | update_case | C29618 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; SV-8845 qualified as closed without a fix, since this pass proved it still reproduces; provenance no longer names the build as the source of an expectation the build fails |
| 63 | update_case | C29619 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 64 | update_case | C29620 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 65 | update_case | C29621 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 66 | update_case | C29622 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 67 | update_case | C29623 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 68 | update_case | C29624 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 69 | update_case | C29625 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 70 | update_case | C29626 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 71 | update_case | C29627 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict |
| 72 | update_case | C29628 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 73 | update_case | C29629 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; marker set from the live verdict |
| 74 | update_case | C29630 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance moved to state 2 - build + tested-on date now claimed, because it was observed; marker set from the live verdict; note about a shared-link fault removed - this case reaches the empty state by tapping, so the note would make a passing case look failed |
| 75 | update_case | C29631 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 76 | update_case | C29632 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 77 | update_case | C29633 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 78 | update_case | C29634 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 79 | update_case | C29635 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 80 | update_case | C38876 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 81 | update_case | C38877 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 82 | update_case | C38878 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 83 | update_case | C38879 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 84 | update_case | C38880 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 85 | update_case | C38881 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 86 | update_case | C38882 | 200 | MATCH | 28 | assertion restored to the documented requirement; assertion restored to the documented requirement; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict |
| 87 | update_case | C38883 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 88 | update_case | C38884 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 89 | update_case | C38886 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 90 | update_case | C38888 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 91 | update_case | C38889 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 92 | update_case | C38891 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 93 | update_case | C38893 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 94 | update_case | C38895 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 95 | update_case | C38896 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 96 | update_case | C38897 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 97 | update_case | C38898 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; provenance no longer names the build as the source of an expectation the build fails |
| 98 | update_case | C38899 | 200 | MATCH | 28 | class-A waiver paragraph deleted; spec version corrected 1.6 -> Confluence 18; marker set from the live verdict |
| 99 | update_case | C38900 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 100 | update_case | C38901 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 101 | update_case | C38902 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 102 | update_case | C38903 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18 |
| 103 | update_case | C38904 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 104 | update_case | C38905 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 105 | update_case | C38906 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 106 | update_case | C38907 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 107 | update_case | C38908 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 108 | update_case | C38909 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 109 | update_case | C38910 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |
| 110 | update_case | C38911 | 200 | MATCH | 28 | spec version corrected 1.6 -> Confluence 18; false "as per the build" provenance corrected for a not-built feature |

**Totals: 110 operations, 110 HTTP 200 + byte-verified MATCH, 0 failures.**
(One earlier attempt on C29557 is not in this table: it was the write that exposed the normalisation
above, and it was superseded by the restore + re-write recorded as row 1.)

## Rule-41 whole-case re-read

Every one of the 110 was opened and re-read end to end against **the live Confluence v18 body**, not
only the field being edited. Recorded per Standing Rule 41: **re-verified whole against the Filters
specification at Confluence version 18, read live 2026-08-05 13:24Z (byte-identical to our mirror)**.

Second problems the re-read found and fixed, which this pass was not chartered to look for:

| Case | Second problem found |
|---|---|
| C29609, C29610 | `refs` still asserted Branko's **superseded** 17 July position (*"= shown greyed-out/disabled"*), directly contradicting the case's own body |
| C29609, C29610 | the divergence sentence claimed the case follows *"the specification **and the build**"* — the build is not a co-author of an expectation |
| C29630 | carried a note about a shared-link fault its own steps never reach; it would have made a passing case look failed |
| C29618 | named SV-8845 without saying it had been closed without a fix |
| all 110 | provenance named *"specification version 1.6"* while live Confluence is **18** |

## Population checks after the writes (all 110, no sampling)

| Check | Result |
|---|---|
| Live count under group 4110 | **110**, every one `created_by = 3` — no foreign case |
| Case-id sets PRE vs POST, both directions | **equal** |
| Cases matching the intended final text exactly | **110 of 110**, 0 field mismatches |
| Exactly one provenance line per case | **110/110** |
| Exactly one automation marker per case | **110/110** |
| Cases still saying "version 1.6" | **0** |
| Cases still carrying a "Known and accepted" waiver | **0** |
| Any text field `<p>`-wrapped or containing CRLF | **0** |

## Run 352 — proven undamaged

| Check | Before | After |
|---|---|---|
| `include_all` | false | false |
| Tests | 110 | 110 |
| `case_id` sets, both directions | — | **equal** |
| `test_id` sets, both directions | — | **equal** |
| Result records | **438** | **438** |
| Prior results missing **BY ID** | — | **0** |
| Counters P / F / B / U | 36 / 2 / 0 / 72 | 36 / 2 / 0 / 72 |

**The only field that moved on any prior result is `case_refs`, on 10 records** — and those 10 trace to
exactly **C29609 and C29610**, the only two cases whose `refs` we edited. `case_refs` is therefore a
**derived read-time echo of the case's References field**, the same class as the already-declared
`case_title` echo. **No graded field moved on any of the 438**, and `status_id` on all 10 is unchanged.

**Ahtasham added no results during the write window** — he stood at 438 records / 36 Passed / 2 Failed
at the pre-write snapshot and at the post-write snapshot alike. Nine results had arrived between the
coordinator's 12:25Z reading and our 13:23Z snapshot; none arrived after.


## Environment left clean — and proven, not asserted

**Nothing was seeded.** No customer, work order, part, asset or role was created. A live search for
`ZZAUTOTEST` customers returned **0**. The whole pass was reads plus filter selections, which are UI
state rather than data.

**One thing WAS changed and has been put back: the signed-in user's saved filter state.** Filter
selections on this product are stored **server-side against the user account** (S10-R2), so ticking a
filter to observe it is a persistent change.

| Moment | Saved state on a fresh load |
|---|---|
| **At the start of the pass** (pre-existing residue, **not ours**) | `?status=estimate&status=approved&status=in_progress&status=ready_for_review&company_id=00122246…&company_id=003a361e…&tab=complete` |
| **After the pass, before cleanup** | `?company_id=00122246…&company_id=0029b928…&company_id=003a361e…&tab=my` — the third `company_id` came from the mobile Customer sheet test |
| **After cleanup, proven on two fresh loads** | `?tab=all` — no filter parameters, no Clear Filters control, tab **All**, 30 rows |

**Honest note:** the end state is **cleaner than the start state**, not byte-identical to it. The state
we found was itself leftover residue from an earlier pass (four statuses and two customers on the
Completed tab), and restoring that would mean re-applying somebody else's stray filters. **Cleared to no
filters instead, and said so** rather than claiming a byte-identical restore we did not perform.

**Why the chips looked clean while filters were still active:** the restored Customer chip comes back
**without its value name** — that is [SV-8871](https://shopview.atlassian.net/browse/SV-8871), our own
open defect, reproducing during our own cleanup. The URL and the Clear Filters control were the reliable
signals, not the chips.

Tooling: `tools/cleanup.mjs` and `tools/cleanup2.mjs`.
