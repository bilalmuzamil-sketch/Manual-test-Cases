# Filters — execution log (finish2), 2026-08-12

**Build `v3.6-3e9dd6d`**, `index.html` sha256
`fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb`, last-modified Tue 11 Aug 2026
07:45:44 GMT, etag `b1b2623f07bec03883f57a0e17204431` — **byte-identical at 12:07Z and 12:44Z, so
the build did not move under this session.**
Location: **Staging Heavy Duty - 9919**. Identity: **admin@shopview.com**.

## IDENTITY PROOF (taken before any observation was trusted)

| | admin | technician |
|---|---|---|
| `fe_permissions` count | **42** | **6** |
| `view_mode` | `full` | `tech` |
| `GET /api/staff?limit=200` | **200** | **403** |

`quick-login` and `switch-user` were **never called**.

## READ-ONLY SNAPSHOTS TAKEN FIRST

| What | When (UTC) | Result |
|---|---|---|
| Case census, group 4110 | 12:08:27Z | **120 live · 115 ours (`created_by` 3) · 5 foreign (`created_by` 7)** |
| Foreign cases C43576–C43580 | 12:08Z | `evidence/foreign-PRE.json` |
| Run 352 | 12:09:38Z | `include_all` **false**, 120 tests, **636** results |
| Pre-write snapshot of the 10 cases | 12:41Z | `evidence/restamp-PRE.json` |

## WRITE OPERATIONS — 10, all `update_case`

Each payload carried **all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`), because `update_case` re-renders any text field omitted and this project shows
raw markup literally to the tester. Only the Rule-54 **sentence 2** build line changed inside
`custom_expected`; the replacement was required to match **exactly once** or the case was skipped.
The per-operation log was written **as each write happened** (`evidence/restamp-oplog.json`).

| # | Op | Case | Result | Fields compared | `custom_atmstatus` at write time | Verdict |
|---|---|---|---|---|---|---|
| 1 | `update_case` | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | ok | 30 | 1 | **MATCH** |
| 2 | `update_case` | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | ok | 30 | 1 | **MATCH** |
| 3 | `update_case` | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | ok | 30 | 1 | **MATCH** |
| 4 | `update_case` | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | ok | 30 | **3 — Automated** | **MATCH** |
| 5 | `update_case` | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | ok | 30 | 1 | **MATCH** |
| 6 | `update_case` | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | ok | 30 | 1 | **MATCH** |
| 7 | `update_case` | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | ok | 30 | 1 | **MATCH** |
| 8 | `update_case` | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | ok | 30 | 1 | **MATCH** |
| 9 | `update_case` | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | ok | 30 | 1 | **MATCH** |
| 10 | `update_case` | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | ok | 30 | 1 | **MATCH** |

**0 mismatches · 0 collateral changes.** The batch was set to stop on the first mismatch; it never
had to. Every field not in the payload was proven byte-identical to the pre-write snapshot.

**0 `add_case` · 0 `delete_case` · 0 `add_section` · 0 `update_run` · 0 results logged ·
0 Jira calls of any kind.**

## POST-WRITE PROOFS

**Run 352 (read 12:44Z, `evidence/run352-POST.json`)**

| Check | Result |
|---|---|
| `include_all` | false → **false** |
| tests | 120 → **120** |
| `case_id` sets | **equal in BOTH directions** (0 only-pre, 0 only-post) |
| prior result records present **BY ID** | **636 of 636 — 0 missing** |
| graded-field changes on prior results | **0** |
| derived / echo field changes | **0** |
| new results during the window | **3, all by user 7 (the tester)** — C38893 Passed, C38891 Blocked, C38889 Failed |

**Foreign cases (C43576–C43580)** — re-read after the writes and **byte-identical by content,
including `updated_on` and `updated_by`**. Never opened for editing.

## FINAL CENSUS (12:44Z, live)

**115 ours / 120 live** · markers **90 READY + 7 READY-EXPECT-FAIL + 18 HOLD = 115** ·
gate **90 + 7 = 97** and **115 − 18 = 97**, closing both ways · build lines **22 `v3.6-3e9dd6d` ·
83 `v3.4.2-d00239b` · 10 none = 115** · **0 cases without a marker** · **0 cases with empty `refs`**.
