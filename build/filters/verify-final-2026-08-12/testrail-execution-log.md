# Filters — TestRail execution log, verify-final, 2026-08-12

## ZERO WRITES. The log is empty by fact, not by omission.

| Operation | Count |
|---|---|
| `update_case` | **0** |
| `add_case` | **0** |
| `delete_case` | **0** |
| section writes | **0** |
| `update_run` | **0** |
| results written | **0** |
| Jira calls that create anything | **0** |

The pass was stood down during orientation, before the first payload was built. **No operation was
in flight**, so nothing is half-verified and nothing needs completing or reversing.

## Reads performed, all `GET`

| Read | Result |
|---|---|
| `get_sections` (paged, 626 total) | 19 sections under group 4110 |
| `get_cases` per section | **120 live · 115 ours · 5 foreign** |
| `get_case` × 5 (foreign) | re-read to prove untouched — **0 fields differ** |
| `get_run/352` | `include_all` false · 65 passed · 7 failed · 0 blocked · 43 untested |
| `get_tests/352` (paged) | **115** |
| `get_results_for_run/352` (paged) | **473** |

**Run 352 is untouched by content**, and the proof is by id, never by `updated_on`: all 115 test ids,
all 115 case ids and all 473 result ids are recorded in `evidence/run352-snapshot.json` for the next
worker to diff against. The case-id set equals our 115 **in both directions**, so the run is already
in sync — `update_run` was neither needed nor called.

## Standing constraints carried forward for whoever writes first

- `update_case` only; **all three text fields on every payload** — TestRail re-renders any omitted
  text field through its HTML pipeline, and this project shows markup literally to the tester.
- Re-GET and **byte-compare field by field**; **STOP the batch on any mismatch**.
- **Print and read the built payload before sending it.** A byte-check proves the write matched the
  payload; it cannot tell you the payload was right.
- **An HTTP 500 can come back from a write that already landed — read before retrying.**
- **Never send `custom_atmstatus`** — it was set by hand by another author on C29600, C29614,
  C29623, C38877.
- **Never edit the five foreign cases.**
