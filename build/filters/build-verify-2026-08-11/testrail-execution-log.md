# TestRail execution log — Filters build verification

**Rule 59, both timestamps.** Sources read at pass start **2026-08-11T09:32:19Z**; **re-read at write
start 2026-08-11T11:0xZ** — build marker re-read immediately before the batch and **byte-identical**
(`v3.6-3e9dd6d`, etag `b1b2623f07bec03883f57a0e17204431`); spec v19 text re-read from the committed
live-flattened mirror. **Verdict of the second read: unchanged.**

## Scope of writes

**8 × `update_case`. 0 `add_case`, 0 `delete_case`, 0 section operations, 0 run writes, 0 results.**
`quick-login` and `switch-user` were **never called**. **No Jira write of any kind.**

## Build markers, read three times

| when | marker | etag | moved? |
|---|---|---|---|
| pass start 09:32:19Z | `v3.6-3e9dd6d` | `b1b2623f07bec03883f57a0e17204431` | — |
| before the first write | `v3.6-3e9dd6d` | same | **no** |
| pass end | `v3.6-3e9dd6d` | same | **no** |

**The build moved ZERO times under this pass.** It had, however, moved a whole minor version since the
last recorded Filters marker: `v3.4.2-ef30acc` → `v3.6-3e9dd6d`.

## Per operation

| # | Case | HTTP | verification | fields sent | `custom_atmstatus` |
|---|---|---|---|---|---|
| 1 | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 2 | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 3 | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 4 | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 3 |
| 5 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 6 | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 7 | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |
| 8 | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | 200 | 30 fields compared, 3 intended, 0 mismatch | preconds+steps+expected | 1 |

**All three text fields were sent explicitly on every payload** — TestRail re-renders any text field
omitted from the payload through its HTML pipeline, and this project shows markup literally to the
tester.

**Every payload was shape-checked BEFORE sending**: exactly one provenance line, exactly one
`AUTOMATION:` marker, the marker last, and no raw markup. A failure would have aborted the batch.

## Verification results

- **8 of 8 HTTP 200**, each re-GET and byte-compared: **30 fields compared per case, 3 intended,
  0 mismatches, 0 collateral changes.**
- **Raw-markup census: 0 of 114 before, 0 of 114 after** — counted from live text, not assumed. The
  census was re-run *after* the writes because TestRail can re-render hours later without moving
  `updated_on`.
- **Shape census after: 0 defects across all 114** — one provenance line and one marker each, marker
  last.
- **The 106 cases NOT written are proven byte-identical BY CONTENT**, `updated_on` and `updated_by`
  included: **0 changed.**

## Run 352 — proven untouched BY CONTENT, never by `updated_on`

| check | result |
|---|---|
| `include_all` | **false**, unchanged |
| tests | **114 before, 114 after** |
| `case_id` sets | **equal in BOTH directions** |
| `test_id` sets | **equal in BOTH directions** |
| result records | **473 before, 473 after** |
| prior results present **BY ID** | **473 of 473, none missing** |
| graded-field changes on prior results | **0** |
| non-graded (echo) changes | **0** — no title was changed, so not even `case_title` moved |
| new results during the write window | **0** |
| counters | 65 Passed / 7 Failed / 42 Untested, unchanged |

Run 352 is Ahtasham's. Nothing in it was written to.

## Foreign cases

**Ours 114 / live total 119.** The five foreign cases in group 4110 are user 7's (Ahtasham):
C43576, C43577, C43578, C43579, C43580. **Not read into our counts, not touched** (Rule 38).

## Provenance stamps

The 8 written cases had **Rule-54 sentence 2** moved from `v3.4.2-d00239b on 8/5/2026` to
`v3.6-3e9dd6d on 8/11/2026`, because those 8 were genuinely observed today. **Sentence 1 — the
documents the expectation comes from — was not touched on any of them.**

**No stamp was added or refreshed on any case that was not observed.** The 84 cases found correct
were checked but not written, so they still name the older build; `BUILD-VERIFICATION.md` is the
record of what was checked today, and it says so explicitly rather than implying their stamps are
current.