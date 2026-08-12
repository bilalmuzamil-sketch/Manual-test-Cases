# FILTERS — TESTRAIL EXECUTION LOG (finish4), 2026-08-12

**Build:** `v3.7-20e801b` — marker read at 15:30:10Z and again at **16:07:04Z immediately before the first write**, byte-identical (Rule 59).
**Writes started:** 2026-08-12T16:07:11.814055Z · **finished:** 2026-08-12T16:07:24.331975Z
**Authorisation:** `update_case` only, as briefed. **0 add · 0 delete · 0 section · 0 run writes · 0 results · 0 Jira calls that create anything.**

Every payload carried **all three text fields** (`custom_preconds`, `custom_steps`, `custom_expected`) because `update_case` re-renders any text field it is not given, and this project shows markup literally to the tester.

Each row was written to this log **before** its write was sent, then completed after the byte-check (Rule 29 R1).

## THE OPERATIONS

| # | Case | Link | What changed | HTTP | Fields compared | Byte-verified | Collateral | `custom_atmstatus` at write time |
|---|---|---|---|---|---|---|---|---|
| 1 | C29568 | [open](https://shopview.testrail.io/index.php?/cases/view/29568) | Rule-54 sentence 2 re-stamped | 200 | 28 | YES | 0 | 1 |
| 2 | C29569 | [open](https://shopview.testrail.io/index.php?/cases/view/29569) | Rule-54 sentence 2 re-stamped | 200 | 28 | YES | 0 | 1 |
| 3 | C29594 | [open](https://shopview.testrail.io/index.php?/cases/view/29594) | Rule-54 sentence 2 re-stamped | 200 | 28 | YES | 0 | 1 |
| 4 | C29626 | [open](https://shopview.testrail.io/index.php?/cases/view/29626) | Rule-54 sentence 2 re-stamped | 200 | 28 | YES | 0 | 1 |
| 5 | C38886 | [open](https://shopview.testrail.io/index.php?/cases/view/38886) | Rule-54 sentence 2 re-stamped · **step 2 corrected (next page → scroll down)** | 200 | 28 | YES | 0 | 1 |
| 6 | C43561 | [open](https://shopview.testrail.io/index.php?/cases/view/43561) | Rule-54 sentence 2 re-stamped | 200 | 28 | YES | 0 | 1 |

**6 of 6 planned writes executed and verified · 0 skipped · stopped early: None**

## WHAT WAS DELIBERATELY NOT WRITTEN

**C29614 and C43560 were NOT stamped.** Both depend on a saved filter being restored on page load — the one behaviour this pass could not settle (`DIVERGENCES.md` §3). A `v3.7-20e801b` build line on either would assert a check that was not completed (Rule 12). **C43560 keeps its honest *"This test has not yet been checked against any build."***

**No marker was changed on any case.** The live census still reads 90 READY + 7 READY-EXPECT-FAIL + 18 HOLD = 115, the gate passing both ways.

**Sentence 1 was never touched** on any case. It names documents only; putting a build into it is what Rule 54's 2026-08-05 amendment forbids.

## VERIFICATION AFTER THE WRITES (all read live)

### Run 352 — proven untouched BY CONTENT, never by `updated_on`

| check | result |
|---|---|
| `include_all` | still **false** |
| tests | 120 → **120** |
| test-id sets equal both directions | **yes** (0 missing, 0 new) |
| case-id sets equal both directions | **yes** |
| result records | 645 → **645**, **all present BY ID** |
| graded fields changed on any prior result | **0** |
| new results during the write window | **0** |
| `case_title` / `case_refs` echo movement | **0** |

### The five foreign cases (Ahtasham Amjad)

**C43576 · C43577 · C43578 · C43579 · C43580 — byte-identical across every field INCLUDING `updated_on` and `updated_by`.** Never opened for editing (Rule 38). Reported as two numbers throughout: **ours 115 / live 120**.

### Live census of our 115

| | |
|---|---|
| markers | **90 READY · 7 READY - EXPECT FAIL · 18 HOLD = 115** |
| gate | 90 + 7 = **97** and 115 − 18 = **97** → **PASSES both ways** |
| build stamps | `v3.7-20e801b` **70** (was 64: **+6, exactly this pass**) · `v3.4.2-d00239b` 26 · `v3.6-3e9dd6d` 12 · no build line 5 · "not yet checked" 2 = **115** |
| raw markup in any text field | **0 of 115** |
| doubled marker or doubled build line | **0** |
| cases with exactly one provenance sentence | **115 of 115** |

*Census read live at 2026-08-12T16:09:38Z.*

