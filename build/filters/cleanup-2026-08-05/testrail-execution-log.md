# Filters cleanup, 5 August 2026 — the per-operation TestRail log

**25 cases written · 25 `update_case` calls · every one HTTP 200 · every one byte-verified ·
28 fields compared each · 0 mismatches · 0 add · 0 delete · 0 section · 0 run writes.**

Where a case was touched by more than one job, all the intents were folded into **one final text
and written once** — so 25 cases means 25 writes, not 34.

## The build the writes rest on

| Field | At the start (11:59:30Z) | At the end (see `BUILD-MARKER.md`) |
|---|---|---|
| `<meta name="app-version">` | `v3.4.2-d00239b` | `v3.4.2-d00239b` |
| `index.html` last-modified | Tue, 04 Aug 2026 22:51:02 GMT | Tue, 04 Aug 2026 22:51:02 GMT |
| `index.html` etag | `b9ab1d41718b5e871432064ed914e2e7` | `b9ab1d41718b5e871432064ed914e2e7` |

**No redeploy happened under us.**

## How each write was verified (Standing Rule 50)

For every case, in this order: `update_case` → `get_case` → compare **all 28 non-volatile fields**.
The fields we meant to change had to be **byte-equal to the intended payload**; **every other field
had to be byte-identical to the pre-write snapshot**. A single mismatch would have stopped the batch
on the spot. `refs` is compared under the one declared normalisation (TestRail splits on commas,
trims each entry and rejoins) — **no `refs` was written in this pass.**

## The 25 operations

| # | Case | Fields written | HTTP | Verification | Job |
|---|---|---|---|---|---|
| 1 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 2 | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 3 | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 4 | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 5 | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 6 | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 7 | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 |
| 8 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 4 (+ a doubled provenance line removed) |
| 9 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 10 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 11 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 12 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | **title**, steps, expected | 200 | MATCH — 28 fields compared | 1 + 3 — the reversal |
| 13 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 1 + 3 + 4 |
| 14 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 15 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 16 | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | expected | 200 | MATCH — 28 fields compared | 1 + 3 |
| 17 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | expected | 200 | MATCH — 28 fields compared | 3 |
| 18 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | expected | 200 | MATCH — 28 fields compared | 3 |
| 19 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | expected | 200 | MATCH — 28 fields compared | 3 |
| 20 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | expected | 200 | MATCH — 28 fields compared | 3 |
| 21 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | expected | 200 | MATCH — 28 fields compared | 3 |
| 22 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | expected | 200 | MATCH — 28 fields compared | 3 |
| 23 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | expected | 200 | MATCH — 28 fields compared | 3 |
| 24 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | expected | 200 | MATCH — 28 fields compared | 3 |
| 25 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | preconds, steps, expected | 200 | MATCH — 28 fields compared | 3 + 4 |

Machine-readable: `tools/exec-log.jsonl` (one record per operation) and `tools/done.json`.

## The whole-suite check after the last write — no sampling

| Check (every case, all 110) | Result |
|---|---|
| Filters cases live | **110** |
| Case-id set equal to the pre-write set, both directions | **yes** |
| The **85 cases we did not touch**, every field byte-identical **including `updated_on` / `updated_by`** | **85 of 85** |
| The **25 cases we did touch**: intended fields byte-equal, every other field byte-identical to snapshot | **25 of 25** |
| Cases still holding the dead GitHub owner | **0** |
| Cases still showing raw `<ol>` / `<li>` / `<p>` / `<hr>` markup to the tester | **0** |
| Cases still saying the phone question is open | **0** |
| Provenance line present **exactly once** | **110 of 110** |
| Automation marker present exactly once, **last**, with a blank line before it | **110 of 110** |
| Titles over 80 characters | **0** (longest is exactly 80) |
| The word "VIU" or a feature-flag name anywhere in tester-facing text | **0** |

## Run 352 — proven untouched by us

We issued **zero** run or result API calls. Proof, before and after:

| Check | Before | After | Verdict |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| Tests in the run | 110 | 110 | unchanged, **test-id sets equal both directions** |
| `case_id` set in the run | 110 | 110 | **equal both directions** |
| Result records | **429** | **432** | **all 429 earlier records still present BY ID** |
| Earlier records whose **graded data** changed (status, comment, who, when, elapsed, defects, version) | — | — | **0 of 429** |

**The two differences, both explained and neither ours:**

1. **5 earlier result records on [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)
   show a different `case_title`.** That field is a **display copy of the case's title** that TestRail
   keeps inside each result record, so renaming the case changes what those old results *display*.
   Their graded data is byte-identical — status, comment, who recorded it, when, elapsed, defects and
   version all unchanged. Nothing was regraded.
2. **3 brand-new result records appeared — they are Ahtasham Amjad's, recorded while we worked.**
   Ids 397772 / 397773 / 397774, `created_by` **7 = Ahtasham Amjad**, at **12:02:11Z, 12:07:23Z and
   12:07:57Z** — inside our window (we started at 11:59:30Z). He passed
   [C29564](https://shopview.testrail.io/index.php?/cases/view/29564),
   [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) and
   [C29570](https://shopview.testrail.io/index.php?/cases/view/29570), each with a comment linking a
   ticket. The run counters moved **27 Passed / 5 Failed → 30 Passed / 2 Failed** because of him.

The `get_tests` records also mirror the case text, so 25 of them show the new wording. That mapped
**exactly** onto our plan — expected 25, steps 11, preconditions 10, title 1 — with **no other field
changed on any test**, and the only `status_id` changes being his three.

**Note for whoever reads the brief that set this work up: it said the run held 427 records with
25 Passed and 7 Failed. Live at our start it was 429 records and 27 Passed / 5 Failed, and by our
finish 432 records and 30 Passed / 2 Failed. Those numbers move because the tester is working the
run right now.**
