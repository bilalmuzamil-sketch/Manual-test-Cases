# SBC build-verify — TestRail execution log (2026-08-18)

Build under test: **v3.8-2bf8d14** (app.staging.shopview.com), etag 0f69246068bb597a9f1a1f02bd708754.
All writes: , all three text fields + refs sent, re-GET byte-compared field-by-field, stop-on-mismatch. Verify by CONTENT.

| # | op | C-id | atm | action | HTTP | byte-verify (exp/pre/steps) | refs |
|---|---|---|---|---|---|---|---|
| 1 | update_case | C30102 | 1 | LIFT_READY | 200 | PASS | PASS |
| 2 | update_case | C30124 | 1 | LIFT_READY | 200 | PASS | PASS |
| 3 | update_case | C43827 | 1 | LIFT_READY | 200 | PASS | PASS |
| 4 | update_case | C30149 | 1 | LIFT_READY | 200 | PASS | PASS |
| 5 | update_case | C30151 | 1 | LIFT_READY | 200 | PASS | PASS |
| 6 | update_case | C30152 | 1 | LIFT_READY | 200 | PASS | PASS |
| 7 | update_case | C43822 | 1 | LIFT_READY | 200 | PASS | PASS |
| 8 | update_case | C43823 | 1 | LIFT_READY | 200 | PASS | PASS |
| 9 | update_case | C43824 | 1 | LIFT_READY | 200 | PASS | PASS |
| 10 | update_case | C30156 | 1 | LIFT_READY | 200 | PASS | PASS |
| 11 | update_case | C30157 | 1 | LIFT_READY | 200 | PASS | PASS |
| 12 | update_case | C43825 | 1 | LIFT_READY | 200 | PASS | PASS |
| 13 | update_case | C30161 | 1 | LIFT_READY | 200 | PASS | PASS |
| 14 | update_case | C30169 | 1 | LIFT_READY | 200 | PASS | PASS |
| 15 | update_case | C38856 | 1 | LIFT_READY | 200 | PASS | PASS |

Batch 1 (Not-available lifts, 15 cases): all HTTP 200, all byte-verify PASS. Written 2026-08-18T19:49:05.348505Z.