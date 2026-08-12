# Filters — changes made (finish2), 2026-08-12

## THE WHOLE LIST OF WRITES: 10 `update_case`, NOTHING ELSE

**0 `add_case` · 0 `delete_case` · 0 `add_section` · 0 `update_run` · 0 results logged ·
0 Jira calls of any kind.**

### What changed, and only this

On **ten cases this pass walked end to end today**, the **Rule-54 sentence 2** build line moved:

> from `Last checked against build v3.4.2-d00239b on 8/5/2026.`
> to&nbsp;&nbsp; `Last checked against build v3.6-3e9dd6d on 12 August 2026.`

**Sentence 1 — the SOURCE sentence — was not touched on any of them.** It names documents only, and
nothing about the sources changed. No expectation, no step, no precondition, no title, no `refs`, no
marker and no `custom_atmstatus` was altered anywhere.

| Case | Fields compared | Verdict |
|---|---|---|
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | 30 | MATCH |
| [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | 30 | MATCH |
| [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | 30 | MATCH |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | 30 | MATCH · **`custom_atmstatus` = 3 (Automated) — see `AUTOMATED-CASES-CHANGED.md`** |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | 30 | MATCH |
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | 30 | MATCH |
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | 30 | MATCH |
| [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | 30 | MATCH |
| [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | 30 | MATCH |
| [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | 30 | MATCH |

**All three text fields were sent on every payload** (`custom_preconds`, `custom_steps`,
`custom_expected`) because `update_case` re-renders any text field it is not given, and **this
project shows raw markup literally to the tester**. Each write was re-read and byte-compared field by
field against the intended payload; every field not in the payload was proven byte-identical to the
pre-write snapshot. **0 mismatches, 0 collateral changes.** The batch was set to stop on the first
mismatch; it never had to.

### What was deliberately NOT written

- **No re-stamp campaign.** 83 cases still name `v3.4.2-d00239b` and **that is correct** — they have
  not been checked against this build, and an honest stale stamp is worth more than an asserted
  check nobody made.
- **Two cases this pass walked already named `v3.6-3e9dd6d`** (C29622, C38895) and were left alone.
- **C43563 was walked only to step 5 of 7**, so it did **not** earn a stamp and did not get one.
- **No case text was corrected**, because every case walked was runnable exactly as written.
- **No marker was changed.** In particular no `EXPECT FAIL` marker was added to the five plain
  `READY` cases the tester failed today: Rule 61 as amended on 11 August requires a live source
  backing such a marker, and adding one is a decision for a pass chartered to do it across all three
  projects, not a side effect of this one.

## PROOF THAT NOTHING ELSE MOVED

**Run 352** — `include_all` still **false**; **120 tests**, case-id sets **equal in both
directions**; **all 636 prior result records present BY ID**, with **0 graded-field changes and 0
derived/echo changes**. **3 new results appeared during the window and all three are the tester's
own** (user 7): C38893 Passed, C38891 Blocked, C38889 Failed. Nothing of ours.

**The 5 foreign cases** (C43576–C43580, author user 7) — re-read after the writes and **byte-identical
by content, including `updated_on` and `updated_by`**. Never opened for editing.

## ENVIRONMENT

Nothing was created and nothing deleted. The only state left changed is the admin account's own saved
Work Orders filter, which this pass set through the interface while driving C38877/C38879/C38896 —
ordinary test data on a disposable branch, and no restore was attempted per the standing instruction.
**No role, staff record or settings were touched.**
