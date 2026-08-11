# TestRail execution log — expect-fail marker audit, 2026-08-11

**Authorised operation: `update_case` only.** Executed: **42 `update_case`**, every one **HTTP 200** and
**byte-verified**. `add_case` 0 · `delete_case` 0 · section operations 0 · **run writes 0** · **results
logged 0** · **Jira writes 0**.

Each write went through the Rule-50 harness (`/tmp/testrail/tr.py`): pre-write snapshot, write, re-GET,
then **every field compared** — the intended fields against the payload, and every other field proven
**byte-identical** to the snapshot. **30 fields compared per case, 3 intended, 0 mismatches, 0 collateral
changes.** On any mismatch the batch stops; it never did.

**All three tester-facing text fields were sent explicitly on every payload** (`custom_preconds`,
`custom_steps`, `custom_expected`), because TestRail re-renders any text field omitted from the payload.
`refs` was **not** written on any operation.

**Drift guard:** before each write the live `custom_expected` was compared against the exact text the
payload was built from. A mismatch would have aborted the batch. None occurred.

## Source reads (Rule 59 — read at start, re-read immediately before the writes)

| Source | At pass start | Re-read before writes | Verdict |
|---|---|---|---|
| Filters build | `v3.6-3de5dcb`, etag `1ea90bedf9277f8b700f19ed1dea7c72`, 06:17:36Z | 06:54:34Z | `index.html` **byte-identical** |
| Schedule build | `v3.5-af3a6e1`, etag `0708dbc8bc1fe805e835a2f86d05abfb`, 06:17:36Z | 06:54:34Z | `index.html` **byte-identical** |
| Schedule spec (Confluence 713031682) | version **27**, read 06:48:51Z | — | CURRENT |
| Filters spec (Confluence 572030978) | version **19**, read 06:48:51Z | — | CURRENT |
| The 3 kept tickets | read 06:47Z | 06:54:34Z | SV-8832 Open · SV-8875 Ready to Fix · SV-8912 Ready to Fix — **unchanged** |

## Operations

| # | Case | Project | Action | HTTP | Verification |
|---:|---|---|---|---:|---|
| 1 | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 2 | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 3 | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 4 | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 5 | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 6 | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 7 | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 8 | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 9 | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 10 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 11 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 12 | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 13 | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 14 | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | Filters | KEEP+REPAIR | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 15 | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | Filters | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 16 | [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 17 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 18 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 19 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 20 | [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 21 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 22 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 23 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 24 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 25 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 26 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 27 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 28 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 29 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 30 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 31 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 32 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 33 | [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 34 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 35 | [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 36 | [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | Schedule | REMOVE | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 37 | [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 38 | [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 39 | [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 40 | [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 41 | [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |
| 42 | [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Schedule | HOLD->READY | 200 | 30 fields compared, 3 intended, **0 mismatch** |

**42 of 42 written and byte-verified. 0 failures, 0 aborts.**

## What each action did

- **REMOVE (29)** — deleted the predictive paragraph, set the marker to plain `AUTOMATION: READY`, added the
  spec read-date. **No numbered expectation was touched.**
- **KEEP+REPAIR (7)** — replaced the note with an accurate Rule-61 three-outcome block written from what was
  observed live today, normalised the marker to the machine-findable literal
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` (the old form carried a `- reported, still open` suffix that is
  both non-standard and a claim that rots), added the read-date. One case,
  [C29625](https://shopview.testrail.io/index.php?/cases/view/29625), had no note at all and gained one.
- **HOLD->READY (6)** — the Panel collapse set: marker to plain `AUTOMATION: READY`, predictive
  *"mark it Blocked"* wording replaced with run-it-and-mark-what-you-find wording, sourcing untouched.

## Payload shape asserted BEFORE sending — all 42

`tools/build_payloads.py` refuses to emit a payload unless: no markup · no CRLF · **exactly one** provenance
line · **exactly one** `AUTOMATION:` marker · marker is the **last** non-blank line · a blank line precedes
it · exactly one `---` separator · no leftover predictive prose (`expected to fail`, `do not expect it to
change`, `Known issue`, `Not built yet`, `still open)`) · exactly one read-date. It also asserts that the
three paragraphs which had to **survive** did survive:
[C29939](https://shopview.testrail.io/index.php?/cases/view/29939)'s SV-8841 note,
[C30045](https://shopview.testrail.io/index.php?/cases/view/30045)'s product-owner VIN ruling, and
[C43556](https://shopview.testrail.io/index.php?/cases/view/43556)'s Week-view scope note — each of which sits
in the same position as the paragraph being removed and would have been easy to delete by accident.

## Runs 352 and 357 — PROVEN UNTOUCHED BY CONTENT

Snapshotted before (06:54:18Z) and after. Proof is by content, **never** by `updated_on`.

| | run 352 (Ahtasham's) | run 357 (Ayesha's) |
|---|---|---|
| `include_all` | false -> false | false -> false |
| tests | 114 -> 114 | 174 -> 174 |
| result records | 473 -> 473 | 458 -> 458 |
| test-id sets equal both directions | **yes** | **yes** |
| case_id sets equal both directions | **yes** | **yes** |
| prior results missing BY ID | **0** | **0** |
| graded-field changes | **0** | **0** |
| derived/echo field changes | **0** | **0** |
| new results during the window | **0** | **0** |
| counters | 65P/7F/0B/42U unchanged | 25P/0F/1B/148U unchanged |

No `case_refs` echo appeared, because `refs` was not written. Another worker was syncing run 357 during
this session; that run is **byte-identical across our window**, so neither pass disturbed it.
Reduced snapshots: `evidence/runs-352-357-{before,after}.json` (run metadata, test ids, case ids, and a
sha256 of each result's graded fields — testers' free-text comments were deliberately not committed).

## Foreign cases (Rule 38)

Ahtasham Amjad's five Filters cases — C43576, C43577, C43578, C43579, C43580 — are `created_by=7`,
`updated_by=7`, last edited **2026-08-10 14:24:16Z**, and **none appears in the 42-case write set**.
No write was issued against any case we did not author.

