# Schedule drag re-try — TestRail execution log, 2026-08-12

Build observed: **`v3.5-65d6500`**. Suite 176 cases. **Run 357 not touched — `update_run` never called.**

**Scope: `update_case` only.** 0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes ·
0 results logged. `custom_atmstatus` never sent — it is Vlad's flag.

**All three text fields on every payload**, including the two that do not change: TestRail re-renders
any text field omitted from a payload through its HTML pipeline, wrapping it in `<p>` and turning
`\n` into `\r\n`. On a project that shows markup literally to the tester that is a visible defect.

**Verification is by CONTENT, never by `updated_on`.** Every write is re-GET and compared field by
field against the intended payload, and every field not meant to change is compared byte-for-byte
against its pre-write snapshot.

| # | case | op | HTTP | fields compared | mismatches | collateral |
|---|---|---|---|---|---|---|
| 1 | C29967 | update_case | 200 | 30 | 0 | 0 |
| 2 | C29982 | update_case | 200 | 30 | 0 | 0 |
| 3 | C29984 | update_case | 200 | 30 | 0 | 0 |
| 4 | C29985 | update_case | 200 | 30 | 0 | 0 |
| 5 | C30004 | update_case | 200 | 30 | 0 | 0 |
| 6 | C30013 | update_case | 200 | 30 | 0 | 0 |
| 7 | C30020 | update_case | 200 | 30 | 0 | 0 |

**7 of 7 written, every one HTTP 200 + byte-verified, 0 mismatches, 0 collateral changes.**

## Run 357, proven untouched

Read after the writes: **`include_all` still `false`** · **176 tests** · **250 result records** ·
counters **89 Passed / 6 Failed / 2 Blocked / 79 Untested**. All seven cases are present as tests in
the run. **`update_run` was never called**, and no result was logged anywhere.

## What each case now says

| Case | Was | Now | Ticket |
|---|---|---|---|
| [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | HOLD "needs a drag that could not be completed" | `READY - EXPECT FAIL` | [SV-8886](https://shopview.atlassian.net/browse/SV-8886), In Progress |
| [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | same | `READY - EXPECT FAIL` | [SV-9090](https://shopview.atlassian.net/browse/SV-9090) **closed OBSOLETE, still reproduces** (also SV-8855) |
| [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | same | `READY - EXPECT FAIL` | [SV-9006](https://shopview.atlassian.net/browse/SV-9006), open |
| [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | same | `HOLD` — **precise reason**: an observed fault with no ticket number yet | none |
| [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | same | `HOLD` — same precise reason | none |
| [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | same | `HOLD` — same precise reason | none |
| [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | same | `HOLD` — same precise reason | none |

**Three of the seven moved off HOLD.** The other four are still held, but **the reason is now true**:
each has been driven, each carries its observed symptom in plain words, and each is one edit away from
`READY - EXPECT FAIL` the moment a ticket number exists. **The old reason — "it needs a drag that
could not be completed" — was wrong on five of the seven** and had simply been copied across the group.

**No expected result was changed** (Standing Rule 57). What was added is the observed-symptom note and
its three outcomes, and what was replaced is the provenance line's second sentence and the marker.

**The payloads exactly as sent** are in `evidence/payloads-as-sent.txt` — read before sending, because
a re-stamp regex once landed inside a version string and produced corrupt text that a byte-check
passed, the write being faithful to a wrong payload.

## A ninth and tenth write — C29980, and a mistake of mine caught by reading the result

| # | case | op | HTTP | fields compared | mismatches | collateral |
|---|---|---|---|---|---|---|
| 8 | [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) | update_case | 200 | 30 | 0 | 0 |
| 9 | C29980 | update_case (correction) | 200 | 30 | 0 | 0 |

**Write 8** corrected the label `'finish by'` → **`'Finish by'`** — read live today from the visible
text node with its computed `text-transform` applied (`raw='Finish by'`, `transform='none'`), so the
tester really does see a capital F. It also added a plain note for point 2.

**Write 9 exists because write 8 got the provenance wrong, and I caught it by reading the result
rather than trusting the byte-check.** My re-stamp tested `line.startswith('Last checked against
build')`, but that sentence sits **mid-line**, appended after the specification sentence — so nothing
matched and the case kept a stale `v3.5-d122eef` stamp. **The byte-check passed both times**, because
the write was faithful to the payload; the payload was wrong. Fixed by splitting on the literal
sentence opener, which is what the seven-case builder did correctly.

The stamp reads **`Last checked against build v3.5-65d6500 on 12 August 2026 (point 1 only).`** — the
qualifier is there because only point 1 was observed.

## Totals

**9 `update_case` operations over 8 distinct cases, every one HTTP 200 + byte-verified, 30 fields
compared each, 0 mismatches, 0 collateral changes.**
0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes · 0 results logged.
