# TestRail execution log - Report Suite VIU session 4, 2026-08-06

**Build in force: `v3.5-f77875c`** (index.html last-modified Thu 06 Aug 2026 10:43:37 GMT, etag
`829ed038…`, sha256 `b0f05b6f…` — read at 10:55:54Z and 11:53:07Z, **byte-identical**).

**Authorisation used: `update_case` on our own cases only.** `add_case` 0 · `delete_case` 0 ·
section ops 0 · run writes 0 · results logged 0. The 432-case `refs` version sweep was **not** run.

**Every operation below: HTTP 200, re-GET and byte-compared against the intended payload, 30 fields
compared each, with all three text fields sent explicitly on every payload** (`custom_preconds`,
`custom_steps`, `custom_expected`) because `update_case` re-renders any omitted text field.
**`refs` was not written on any operation.**

**Pre-write snapshot:** `/tmp/rs5/PRE-wip2.json` (35 cases, all fields) and `/tmp/rs5/PRE-run359.json`.

## Totals

| | Count |
|---|---:|
| `update_case` operations | **44** |
| Distinct cases touched | **43** |
| HTTP 200 | **44 of 44** |
| Field mismatches | **0** |
| Collateral changes on fields we did not intend to change | **0** (proven by re-reading all 35 pre-snapshot cases across title, preconditions, steps, refs, section, type, priority, atmstatus and automation_type) |

## Per operation

| Batch | Case | HTTP | Verification |
|---|---|---:|---|
| WIP verdict batch | C30457 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30458 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30459 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30460 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30462 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30466 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30467 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30473 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30481 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30482 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30484 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30485 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30486 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30490 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30491 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30500 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30501 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30502 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30503 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30504 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30506 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30507 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30508 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30509 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30511 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30520 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30521 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30522 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30525 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30528 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30530 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30531 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C30533 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C38916 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| WIP verdict batch | C43551 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| contradictory provenance repair | C30278 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| contradictory provenance repair | C38856 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| contradictory provenance repair | C43552 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| contradictory provenance repair | C43553 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| contradictory provenance repair | C43557 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| stale-sentence repair | C43551 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| stale-sentence repair | C43550 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| stale-sentence repair | C43558 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| stale-sentence repair | C43559 | 200 | 30 fields compared, 3 intended, 0 mismatch |

## Run 359 — proven untouched BY CONTENT, never by `updated_on`

| Check | Before | After |
|---|---|---|
| `include_all` | False | False |
| Tests | 476 | 476 |
| Result records | 535 | 535 |
| `case_id` sets equal in BOTH directions | — | **True**, 0 either way |
| `test_id` sets equal in BOTH directions | — | **True** |
| Prior results missing BY ID | — | **0** |
| New results during the write window | — | **0** |
| Graded-field changes on any prior result (`status_id`, `comment`, `elapsed`, `defects`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`) | — | **0** |
| Declared read-time echo movement (`case_title`, `case_refs`) | — | **0** |

## Post-write census of all 40 written cases, read back live

- Provenance line: **exactly one** on all 40.
- `Last checked against build` sentence: **exactly one** on all 40.
- Automation marker: **exactly one** on all 40, and it is **the last line** on all 40.
- Markers: **26 `READY` · 7 `READY - EXPECT FAIL` · 7 `HOLD` = 40**.
- Barred phrases (*"as per the build tested on"*, *"verified by the build"*): **0**.
- Raw markup in any of the three text fields: **0**.
- Build lines: **35 on `v3.5-f77875c`** (this session's observations) · **4 on `v3.5-7168d14`** and
  **1 on `v3.5-16cf83f`** — the provenance repairs, whose stamps were **deliberately not refreshed**
  because those cases were **not re-observed here**.
- **The census caught one defect of this session's own making:** C43551 came out carrying both a real
  build sentence and a stale *"has not yet been checked against a build"* claim. Repaired in the same
  session, and a sweep of **all 476** confirmed it was the **only** remaining contradictory pair.
