
---

## SESSION 5 — batch 1: Work In Progress, 8 cases

Build in force `v3.5-f77875c` (read 13:53:17Z). Sources re-read live at pass start: SBC 15 · SBR 17 ·
PV 5 · TU 6 · WIP 9 · IV 4 — unmoved. All three text fields sent on every payload.

| # | op | C-id | HTTP | verification |
|--:|---|---|---:|---|
| 1 | update_case | C30456 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 2 | update_case | C30464 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 3 | update_case | C30475 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 4 | update_case | C30476 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 5 | update_case | C30477 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 6 | update_case | C30478 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 7 | update_case | C30480 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 8 | update_case | C38890 | 200 | 30 fields compared, 3 intended, 0 mismatch |

**8 ops · 8 × HTTP 200 · 0 mismatches · 0 collateral changes. 0 add · 0 delete · 0 section · 0 run
writes · 0 results logged.**

**Post-write census of all 8, read back live:** exactly one provenance line, exactly one build sentence
naming `v3.5-f77875c` on 8/6/2026, exactly one marker, marker last, 0 raw markup, 0 barred phrases.
**8 of 8 clean** — run separately from the byte-check, because a byte-check proves the write matched the
payload, not that the payload was right.

`refs` was **not** written on any operation (the 432-case spec-version sweep remains unauthorised).

## SESSION 5 — batch 2: Sales By Representative, the 4 Inv. Hrs cases

| # | op | C-id | HTTP | verification |
|--:|---|---|---:|---|
| 9 | update_case | C30229 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 10 | update_case | C30230 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 11 | update_case | C30231 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 12 | update_case | C38894 | 200 | 30 fields compared, 3 intended, 0 mismatch |

All four set to `AUTOMATION: READY - EXPECT FAIL (SV-8999)` with a Rule-61 symptom-and-three-outcomes
block. Post-write census on all four: one provenance line, build `v3.5-f77875c` 8/6/2026, one marker,
marker last, symptom present once, outcome 3 present, 0 raw markup.

Build marker re-read **mid-pass at 14:49:05Z: `v3.5-f77875c`, etag `829ed03832a746e78cbdb28eb9957a3e`,
`index.html` sha256 byte-identical to the 13:53:17Z read.** No redeploy under the batch.

## SESSION 5 — batch 3: Sales By Representative rows, tree, sorting, badges

| # | op | C-id | HTTP | verification |
|--:|---|---|---:|---|
| 13 | update_case | C30218 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 14 | update_case | C30221 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 15 | update_case | C30242 | 200 | 30 fields compared, 3 intended, 0 mismatch |
| 16 | update_case | C30227 | 200 | 30 fields compared, 3 intended, 0 mismatch |

C30218 → `READY - EXPECT FAIL (SV-9001)` with a Rule-61 block that names which items still pass; the other
three → `READY`.

### SESSION 5 TOTAL

**16 `update_case` over 16 distinct cases · 16 × HTTP 200 · 30 fields compared each · 0 mismatches ·
0 collateral changes.** `refs` not written on any op. **0 add · 0 delete · 0 section · 0 run writes ·
0 results.**

**Build marker read three times — 13:53:17Z, 14:49:05Z, 15:02:29Z — `v3.5-f77875c`, etag
`829ed03832a746e78cbdb28eb9957a3e`, `index.html` sha256 identical all three. Zero redeploys under this
session.**

**Sources read at pass start (13:53Z) and re-read before the writes (Rule 59): SBC 15 · SBR 17 · PV 5 ·
TU 6 · WIP 9 · IV 4 — verdict UNCHANGED.**

---

## SESSION 6 — 2026-08-06 from ~15:08Z

### **ZERO TESTRAIL WRITES. 0 `update_case` · 0 `add_case` · 0 `delete_case` · 0 section ops · 0 run writes · 0 results.**

`update_case` **was** authorised for this session. **It was not used, deliberately**, because every write a
verdict pass makes owes a Rule-54 sentence-2 re-stamp, and the branch could not be reached — so any write
would either have carried a build stamp for an observation that never happened, or left a freshly-updated
case with a stale stamp. **The 73 were also audited and found to need no build-independent repair** (0 stale
anchors, 0 raw markup, 0 barred phrases, 0 marker or provenance anomalies), so **there was nothing correct
to write.**

### Read-only calls made

| Call | Purpose | Result |
|---|---|---|
| `get_sections/1` (paged, 625 total) | derive the 96 sections under group 4281 | 200 |
| `get_cases/1` (paged, 4065 total) | full case bodies | 200 |
| `get_case/{id}` × 3 | rule out a bulk-endpoint read trap on C30451, C30526, C30341 | 200; **`get_case` and `get_cases` agree byte-for-byte** |
| `get_run/359`, `get_tests/359`, `get_results_for_run/359` | prove the run untouched | 200 |

### Verification carried out (Rule 50, exhaustive then exact)

- **Count re-derived from live and proven set-equal in BOTH directions** to `REMAINING.txt` section A: 73.
- **Full census of all 476 of our cases**, every field: 0 raw markup · 476/476 exactly one marker, marker
  last · 476/476 exactly one provenance line · 0 barred phrases.
- **All 73 audited against the live specifications** for stale anchors, wrong versions, closed
  enumerations, build-as-expectation blocks: **0 defects.**
- **Run 359 proven untouched BY CONTENT** — `include_all` false, 476 tests, 535 results, test-id and
  case-id sets equal both directions, all prior results present BY ID, **0 graded-field changes, 0 new
  results**; the only movement is `case_refs` on 4 records tracing to C30114/C30173, an earlier session's
  authorised refs edit and the declared read-time echo.
- **Foreign cases C38919–C38923 byte-identical including `updated_on`/`updated_by`.**
- **The `refs` sweep was NOT run** (not authorised). `refs` was written on **0** operations. Note the refs
  on many cases still name older spec versions — e.g. C30253 reads *"SBR spec v15 2026-07-29"* against live
  **17** — and that remains an outstanding authorisation, not an oversight.
