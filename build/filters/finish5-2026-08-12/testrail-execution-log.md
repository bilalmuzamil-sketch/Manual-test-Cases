# TESTRAIL EXECUTION LOG — Filters finish5, 2026-08-12

**Two operations. Both `update_case`. Nothing else was written anywhere.**

Written at **2026-08-12T18:15:13.104042Z** · build **v3.7-20e801b** · TestRail project 1 / suite 1 / group 4110.

**0 add_case · 0 delete_case · 0 add_section · 0 update_section · 0 run writes · 0 results · 0 Jira calls that create anything.**

---

## THE OPERATIONS

| # | Case | Op | HTTP | Fields compared | Expected field matches | Collateral changes | `custom_atmstatus` at write time | Verified |
|---|---|---|---|---|---|---|---|---|
| 1 | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | `update_case` | **200** | **28** | yes | **0** | **3** | **PASS** |
| 2 | [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | `update_case` | **200** | **28** | yes | **0** | **1** | **PASS** |

**Summary:** planned 2 · written 2 · skipped 0 · no-op 0 · stopped early: **none**
---

## WHAT WAS CHANGED, EXACTLY

**Rule-54 sentence 2 only — the record of when the case was last checked against a build.**
**Sentence 1 was not touched on either case**: it names documents only, and putting a build into it
is what Rule 54's 2026-08-05 amendment forbids.

| Case | Sentence 2 before | Sentence 2 after |
|---|---|---|
| C29614 | `Last checked against build v3.4.2-d00239b on 8/5/2026.` | `Last checked against build v3.7-20e801b on 12 August 2026.` |
| C43560 | `This test has not yet been checked against any build.` | `Last checked against build v3.7-20e801b on 12 August 2026.` |

**Why only these two.** They are the only two cases this pass drove **end to end, every step**, that
it had not already driven. The 14 cases held on Branko were walked for **runnability** but were
**deliberately not written to** — the brief bars touching their expected results, and the provenance
line lives in that field. Their runnability verdict is recorded in `RUNNABILITY.md`, off the case.

**Every payload carried all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`), because `update_case` re-renders any text field it is not given and **this
project shows markup literally to the tester**. Payload lengths were printed and read before
sending.

**The replacement had to match exactly once or the case was skipped.** Both matched once.

---

## PROOFS

### The writes

* Both **HTTP 200**, both re-GET and **byte-compared field by field** against the intended payload:
  **28 fields each, 0 mismatches, 0 collateral changes**.
* Every field the pass did not intend to change proven **byte-identical** to its pre-write snapshot
  (`updated_on` / `updated_by` excluded, as they necessarily move).
* The per-operation log was written **before each write**, not at the end
  (`evidence/restamp5-oplog.json`).

### Run 352 — PROVEN UNTOUCHED, BY CONTENT

The tester is grading this run live, so it was snapshotted before the writes and re-read after:

| Check | Result |
|---|---|
| `include_all` | **false**, before and after |
| Tests | **120** before, **120** after |
| Test-id sets | **equal in both directions** |
| `case_id` sets | **equal in both directions** |
| Result records | **648** before, **648** after |
| Prior results missing **by id** | **0** |
| Graded fields changed on any prior result | **0** (`status_id`, `comment`, `defects`, `assignedto_id`, `elapsed`, `version`, `created_by`, `created_on`, `test_id`) |
| Derived/echo fields changed | **0** |
| New results during the write window | **0** |

**`update_run` was never called. No result was logged anywhere.**

### Ahtasham Amjad's five cases — never touched

**C43576, C43577, C43578, C43579, C43580** snapshotted before and re-read after: **byte-identical on
every field, `updated_on` and `updated_by` included.** They are his (Rule 38) and are excluded from
every count of ours.

### Counts

**Ours 115 / live 120.** The five foreign cases are the difference, and both numbers are stated
wherever a total is given.
