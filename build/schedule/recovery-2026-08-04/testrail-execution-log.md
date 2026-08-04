# Schedule — recovery TestRail execution log, 2026-08-04

**Manifest header: EXECUTED.** Operation type: **`update_case` ONLY**. No `add_case`, no
`delete_case`, no `add_section`, **no run write**.

This log covers the ten edits made during the recovery of the interrupted live-VIU pass. The
interrupted worker's own 169 operations are logged separately in
`build/schedule/viu-2026-08-04/testrail-execution-log.md`; that log stands and was verified against
the live state before any of these ten ran.

## Totals

| | |
|---|---|
| operations | **10** |
| distinct cases touched | **10** |
| HTTP 200 | **10** |
| any other status | **0** |
| byte-verified **MATCH** | **10** |
| byte-verified MISMATCH | **0** |
| fields compared per operation | **28** (identical on every op) |

## The verification, per Standing Rule 50

Per operation, in this order — executor `exec_fixes.py`:

1. **pre-read** and refuse the case outright if `created_by != 3` (Rule 38). All ten passed; there
   are no foreign cases under group 4254 in any case.
2. **build the intended text by exact string replacement** — if the text to be replaced is not
   present byte-for-byte, the run **aborts rather than guessing**. Nothing was pattern-matched
   loosely and nothing was regenerated from a template.
3. **re-GET and prove the case still byte-matches the pre-write snapshot** (`pre-write-cases.json`) —
   a drift check, so nothing is written on top of somebody else's change. Zero drift.
4. `update_case` with **only** `custom_expected`.
5. **re-GET and compare EVERY field** — the intended field byte-equal to the intended value, and
   **every other field byte-identical to the pre-write snapshot**. Only `updated_on` and
   `updated_by` are excepted, as server-volatile.
6. A mismatch means **the write FAILED**: the batch stops and both byte sequences are dumped.
   **This did not happen — 0 mismatches in 10 operations.**

**Declared normalisation** (the only one recorded, `APP-ACTIONS-PLAYBOOK.md` §J): TestRail's `refs`
splits on commas, trims each entry and rejoins with a bare comma. **This pass wrote no `refs`**; the
comparison honours the normalisation anyway.

## Run 357 — proven untouched after the batch, not assumed

| | before | after |
|---|---|---|
| `include_all` | false | false |
| tests | 165 | 165 |
| result records | 429 | 429 |

- the `case_id` sets are **equal in both directions** against the start-of-pass snapshot — 0
  only-before, 0 only-after — and equal both ways against the live case list
- **all 429 prior result records are present BY ID**, and there are **0 new** ones
- no case was added or retired, so **no `update_run` union was needed** (Rules 34 / 47) and none
  was sent

## Why each edit was made

**Class (a) — eight cases said a defect had no ticket when it had one.** Seventeen broken or
not-built cases carried the sentence *"It has been reported to the QA lead but has no developer
ticket yet."* The ten tickets **SV-8848…SV-8857** had in fact been filed hours earlier in the same
pass. Each was verified live in Jira **before** any case was touched — every one **type `Bug`,
priority `Low`, `parent` SV-8685, owning story linked, status Open** — so the sentence was false on
eight of them, and only three of the ten tickets appeared anywhere in the case text. The readiness
report already told the QA lead that each broken case *"names its ticket number"*; these edits make
that true rather than aspirational.

**Class (b) — two cases leaked developer jargon into tester-facing text.** The interrupted worker's
own audit hunted exactly this and repaired three cases, but missed two of its own new known-issue
notes. Both also sat in non-API sections, so the jargon tripped the API-placement rule; after these
edits **zero cases carry API content outside the API section**.

## Per-operation records

| # | case | C-id | class | what changed | HTTP | fields compared | verification |
|---|---|---|---|---|---|---|---|
| 1 | SCH-FILT-05 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | (a) | now names **SV-8857** with its link | 200 | 28 | MATCH |
| 2 | SCH-SPREAD-06 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | (a) | now names **SV-8855** | 200 | 28 | MATCH |
| 3 | SCH-LANE-04 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | (a) | now names **SV-8850** | 200 | 28 | MATCH |
| 4 | SCH-DAY-04 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | (a)+(b) | names **SV-8856**; `PATCH /api/schedule/shifts/{id}` and `13:00Z to 14:00Z` replaced with *"moved the shift a full hour instead of the half hour you dragged it"*; an internal note about restoring the shift removed from the tester's text | 200 | 28 | MATCH |
| 5 | SCH-MODAL-07 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | (a) | now names **SV-8852** | 200 | 28 | MATCH |
| 6 | SCH-VIEW-05 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | (a) | now names **SV-8827** — the other QA's ticket its own text already called *"the ticket"* — and says plainly that the Tech Hours half of that ticket does not hold on this build | 200 | 28 | MATCH |
| 7 | SCH-VIEW-09 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | (a) | now names **SV-8851** | 200 | 28 | MATCH |
| 8 | SCH-KEY-01 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | (a) | now names **SV-8853** | 200 | 28 | MATCH |
| 9 | SCH-KEY-03 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | (a) | now names **SV-8853** (one ticket covers both keys) | 200 | 28 | MATCH |
| 10 | SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | (b) | `acknowledgeLongSeries:false`, `409` and `422` replaced with plain words; **still deliberately unticketed** per decisions-register entry 7 and `API-ASK.md` | 200 | 28 | MATCH |

## Rule 41 — the whole case was re-read before each save

Every one of the ten was read **end to end against the live spec mirror** before it was written —
title, preconditions, every step, every expected-result line, refs, section and type — not only the
sentence being changed. Recorded as: *re-verified whole against the Schedule specification,
Confluence version 23 (2026-07-30), on 2026-08-04.* Findings from that whole-case re-read:

- **0 stale spec anchors** — every `§` reference cited still exists in version 23
- **0 titles over 80 characters** across the whole suite; the longest is exactly 80
- **0 provenance defects** — all 165 carry the Rule-54 line at state 2 (build date **and** marker),
  and **not one carries it twice**
- **two further problems found and recorded rather than silently left** (neither is one of these
  ten): 16 cases hold raw HTML markup in tester-facing fields, which **predates this pass**; and
  SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) is a real
  deviation with **no ticket and no register entry**. Both are in the outstanding register.

## Verified after the batch

| check | result |
|---|---|
| cases under group 4254 | **165**, every one `created_by: 3`, **0 foreign** |
| provenance at Rule-54 state 2 | **165 / 165**, each exactly once |
| titles over 80 characters | **0** (longest exactly 80) |
| API content outside an API-titled section | **0** |
| all ten filed tickets named in case text | **yes** — SV-8848 ×4, SV-8849, SV-8850, SV-8851, SV-8852, SV-8853 ×2, SV-8854, SV-8855, SV-8856, SV-8857 |
| cases still saying "no developer ticket yet" | **8**, and every one of the eight is a documented deliberate non-ticketing (decisions register entries 7, 8, 9, 10, 11, 12 and 13) **except** C30010, which is flagged as outstanding |
| local case source vs live | **165 / 165 byte-match** on title, preconditions, steps, expected and refs |
| import vs live | Preconditions, Steps, Expected Result and References **all byte-equal on 165 / 165**; header md5 unchanged and identical to the Filters, Simple Flow and Fees & Discounts imports |
| `testrail-id-map.csv` | **165 rows, 0 blank C-ids**, set-equal to live both ways, refs and titles byte-matching live |
