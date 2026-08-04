# Report Suite — TestRail EXECUTION LOG · 2026-08-04

**Authorisation (QA lead, 2026-08-04):** *"Yes, Push the ~200 staged wording and note corrections"* · *"Yes, Add the 3 proposed new cases (permission surface, PDF failure boundary, one more)"*.

**Operations: 37 `update_case` · 3 `add_case` · 1 `update_run` (run 359 union) · 0 `delete_case` · 0 section moves.** (35 update_case in the main batch + 2 added by the mandatory Rule-28 consistency sweep, which caught a contradiction the pass had itself introduced.)

**Verification standard (Standing Rule 50 — exhaustive then exact).** Per operation: the write, then a re-GET, then a comparison of **20 fields** — `title` · `refs` · `section_id` · `template_id` · `type_id` · `priority_id` · `milestone_id` · `estimate` · `custom_preconds` · `custom_steps` · `custom_expected` · `custom_atmstatus` · `custom_automation_type` · `custom_mission` · `custom_goals` · `custom_ai_type` · `custom_ai_model` · `custom_steps_separated` · `custom_testrail_bdd_scenario` · `is_deleted`. Fields we intended to change must equal the intended value byte for byte; **every other field must be byte-identical to the pre-write snapshot** (`snapshots/PRE-cases-group4281.json`). A mismatch stops the batch and prints both byte sequences — nothing is retried blindly. **Zero mismatches occurred.**

**Declared normalisation (the only one permitted, playbook §J):** `refs` is compared under `','.join(p.strip() for p in s.split(','))`, because TestRail splits `refs` on commas, trims each entry and rejoins with a bare comma. **No operation in this pass changed `refs` on an existing case**, so the normalisation was exercised only as the byte-identical proof of the untouched field, and on the three new cases (whose `refs` are deliberately comma-free, so the normalisation is the identity there).

**Rule 41 (whole-case re-read).** Every case below was re-read END TO END against its current spec before saving — not only the field being edited. The per-case line records it. The re-read is the reason three staged edits were **withdrawn** as already-done (C30285 · C30286 · C30218 — see `MANIFEST.md` §3b).

---

## PHASE 1 — `update_case` (37)

| # | Op | Internal ID | C-id | Fields changed | HTTP | Byte-level verification |
|---:|---|---|---|---|---:|---|
| 1 | `update_case` | SBC-DATE-03 | [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | steps | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 2 | `update_case` | SBR-DATE-02 | [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | steps | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 3 | `update_case` | SBR-WO-04 | [C30313](https://shopview.testrail.io/index.php?/cases/view/30313) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 4 | `update_case` | PV-ROW-06 | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | expected result, preconditions, steps, title | 200 | **PASS** — all 20 fields compared; 4 equal the intended bytes, 16 proven byte-identical to the pre-write snapshot |
| 5 | `update_case` | PV-COL-01 | [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 6 | `update_case` | PV-COL-03 | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | expected result, steps | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 7 | `update_case` | PV-VIS-02 | [C30386](https://shopview.testrail.io/index.php?/cases/view/30386) | expected result, preconditions, steps | 200 | **PASS** — all 20 fields compared; 3 equal the intended bytes, 17 proven byte-identical to the pre-write snapshot |
| 8 | `update_case` | TU-TECH-01 | [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | expected result, steps | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 9 | `update_case` | TU-TECH-03 | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | expected result, steps, title | 200 | **PASS** — all 20 fields compared; 3 equal the intended bytes, 17 proven byte-identical to the pre-write snapshot |
| 10 | `update_case` | TU-LOC-01 | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | expected result, steps | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 11 | `update_case` | WIP-TAB-02 | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 12 | `update_case` | WIP-SCOPE-02 | [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) | expected result, preconditions, steps, title | 200 | **PASS** — all 20 fields compared; 4 equal the intended bytes, 16 proven byte-identical to the pre-write snapshot |
| 13 | `update_case` | WIP-COL-01 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | preconditions | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 14 | `update_case` | WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 15 | `update_case` | WIP-COL-04 | [C30469](https://shopview.testrail.io/index.php?/cases/view/30469) | expected result, preconditions | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 16 | `update_case` | WIP-TOT-02 | [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 17 | `update_case` | WIP-FLT-05 | [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | expected result, steps | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 18 | `update_case` | WIP-EXP-02 | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 19 | `update_case` | IV-NAV-05 | [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) | expected result, steps | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 20 | `update_case` | IV-COL-01 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 21 | `update_case` | IV-COL-02 | [C30552](https://shopview.testrail.io/index.php?/cases/view/30552) | expected result, preconditions, steps, title | 200 | **PASS** — all 20 fields compared; 4 equal the intended bytes, 16 proven byte-identical to the pre-write snapshot |
| 22 | `update_case` | IV-COL-04 | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 23 | `update_case` | IV-COL-05 | [C30555](https://shopview.testrail.io/index.php?/cases/view/30555) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 24 | `update_case` | IV-TOT-01 | [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | expected result, title | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 25 | `update_case` | IV-TOT-02 | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 26 | `update_case` | IV-DATE-06 | [C30566](https://shopview.testrail.io/index.php?/cases/view/30566) | steps | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 27 | `update_case` | IV-FLT-02 | [C30570](https://shopview.testrail.io/index.php?/cases/view/30570) | expected result, preconditions, steps | 200 | **PASS** — all 20 fields compared; 3 equal the intended bytes, 17 proven byte-identical to the pre-write snapshot |
| 28 | `update_case` | IV-PERS-02 | [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 29 | `update_case` | IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 30 | `update_case` | IV-EXP-04 | [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 31 | `update_case` | IV-EXP-07 | [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 32 | `update_case` | IV-EXP-09 | [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 33 | `update_case` | WIP-FLT-09 | [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 34 | `update_case` | IV-LOC-06 | [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | expected result, steps, title | 200 | **PASS** — all 20 fields compared; 3 equal the intended bytes, 17 proven byte-identical to the pre-write snapshot |
| 35 | `update_case` | WIP-EXP-10 | [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | expected result | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |
| 36 | `update_case` | IV-TOT-02 | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | expected result, steps *(Rule-28 sweep follow-up)* | 200 | **PASS** — all 20 fields compared; 2 equal the intended bytes, 18 proven byte-identical to the pre-write snapshot |
| 37 | `update_case` | IV-SORT-03 | [C30585](https://shopview.testrail.io/index.php?/cases/view/30585) | steps *(Rule-28 sweep follow-up)* | 200 | **PASS** — all 20 fields compared; 1 equal the intended bytes, 19 proven byte-identical to the pre-write snapshot |

### Rule-41 whole-case re-verification, per case

| Internal ID | C-id | Re-verified whole against | Second finding from the re-read |
|---|---|---|---|
| SBC-DATE-03 | C30104 | re-verified whole against SBC spec v13 (2026-07-31) + the live observations in `viu-2026-08-03/` | the eleven-option enumeration left untouched; only the un-runnable step fixed |
| SBR-DATE-02 | C30202 | re-verified whole against SBR spec v15 (2026-07-29) + the live observations in `viu-2026-08-03/` | same |
| SBR-WO-04 | C30313 | re-verified whole against SBR spec v15 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| PV-ROW-06 | C30346 | re-verified whole against PV spec v4 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| PV-COL-01 | C30351 | re-verified whole against PV spec v4 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| PV-COL-03 | C30353 | re-verified whole against PV spec v4 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| PV-VIS-02 | C30386 | re-verified whole against PV spec v4 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| TU-TECH-01 | C30423 | re-verified whole against TU spec v5 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| TU-TECH-03 | C30425 | re-verified whole against TU spec v5 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| TU-LOC-01 | C30442 | re-verified whole against TU spec v5 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-TAB-02 | C30452 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-SCOPE-02 | C30457 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-COL-01 | C30466 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-COL-02 | C30467 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | resolved a live internal contradiction against C30466 / C30507, which already listed Location inside the toggleable order |
| WIP-COL-04 | C30469 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-TOT-02 | C30495 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-FLT-05 | C30502 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | the 366-vs-367 cap difference deliberately NOT asserted either way — a shared-component question for Chris |
| WIP-EXP-02 | C30511 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-NAV-05 | C30538 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | S1-R8 (the pagination requirement) KEPT — only the steps made executable |
| IV-COL-01 | C30551 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-COL-02 | C30552 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-COL-04 | C30554 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | items 1–2 (the un-built default column set) left ALONE as a build defect; only item 4's mechanism corrected |
| IV-COL-05 | C30555 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-TOT-01 | C30556 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-TOT-02 | C30557 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | its steps and expected still said "Qty on Hand" after the label change elsewhere — fixed in the follow-up batch |
| IV-DATE-06 | C30566 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | same |
| IV-FLT-02 | C30570 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | same |
| IV-PERS-02 | C30580 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-EXP-02 | C30588 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | item 1 (export column order) left ALONE as a build defect per IV S10-R3; only item 5's mechanism corrected |
| IV-EXP-04 | C30590 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-EXP-07 | C30593 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-EXP-09 | C30595 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| WIP-FLT-09 | C38916 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-LOC-06 | C38917 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | **not in any batch's list** — the sweep found it making the same refuted "automatic" assertion; added |
| WIP-EXP-10 | C38918 | re-verified whole against WIP spec v6 (2026-07-29) + the live observations in `viu-2026-08-03/` | nothing further — every other field re-read and left byte-identical |
| IV-TOT-02 | C30557 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | its steps and expected still said "Qty on Hand" after the label change elsewhere — fixed in the follow-up batch |
| IV-SORT-03 | C30585 | re-verified whole against IV spec v3 (2026-07-29) + the live observations in `viu-2026-08-03/` | same — the straggler the sweep found |

## PHASE 2 — `add_case` (3)

| Internal ID | C-id | Section | HTTP | Byte-level verification |
|---|---|---|---:|---|
| SBC-API-06 | [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | `SBC — API` (4305) | 200 | **PASS** — all 12 fields compared against the intended payload (incl. `custom_atmstatus`=3, `custom_automation_type`=0, `section_id`, `created_by`=3) |
| PV-EXP-12 | [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | `PV — Exports` (4335) | 200 | **PASS** — all 12 fields compared against the intended payload (incl. `custom_atmstatus`=3, `custom_automation_type`=0, `section_id`, `created_by`=3) |
| IV-EXP-10 | [C43548](https://shopview.testrail.io/index.php?/cases/view/43548) | `IV — Exports` (4373) | 200 | **PASS** — all 12 fields compared against the intended payload (incl. `custom_atmstatus`=3, `custom_automation_type`=0, `section_id`, `created_by`=3) |

## PHASE 3 — run 359 union sync (Standing Rules 34 / 47)

| Check | Result |
|---|---|
| `include_all` | **false** — a fixed selection, so new cases are NOT picked up automatically |
| Tests before → after | **475 → 478** (475 + 3) |
| Result records before → after | **539 → 539** |
| Every prior result present **BY ID** (not by count) | **YES** — all 539 ids from `snapshots/PRE-run359-results.json` re-found |
| case_id sets equal **in both directions** | **YES** |
| HTTP | 200 |

The executor **refuses to write the run** unless the payload is a superset of every current `case_id`: a partial `case_ids` list would DELETE the omitted tests **and their recorded results**. Snapshots were taken before the write.

## PHASE 4 — foreign cases proven untouched (Standing Rules 38 / 50)

Vladimir Tomovic's cases (`created_by` 1) under group 4281: C38919 · C38920 · C38921 · C38922 · C38923.

- **Refused up front:** the executor asserts `created_by == 3` on every target before any write and dies otherwise. All 37 targets passed that gate.

- **Proven after the run:** each of the five was re-GET and compared across the same 20 fields **plus `updated_on`, `updated_by`, `created_on`, `created_by`** against the pre-run snapshot. **All five byte-identical, `updated_on`/`updated_by` included** — evidence, not an assertion.

## Totals

| | |
|---|---:|
| Operations attempted | **41** |
| HTTP 200 | **41** |
| Byte-level verification PASS | **41** |
| Failures / retries / mismatches | **0** |
| `delete_case` | **0** |

Machine-readable per-operation record: `exec-log.jsonl`.
