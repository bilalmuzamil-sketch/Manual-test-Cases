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
### Batch 2 — EF markers off (15) + remaining Not-available lifts (4), all HTTP 200 + byte-verify PASS

| # | op | C-id | atm | action | HTTP | verify | refs |
|---|---|---|---|---|---|---|---|
| - | update_case | C30105 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C43591 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30112 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30116 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30142 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30144 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30160 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30162 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30167 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30172 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30173 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30176 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30185 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30186 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C30194 | 1 | EF_TO_READY (marker off, symptom block removed §15.1) | 200 | PASS | PASS |
| - | update_case | C43826 | 1 | LIFT_READY | 200 | PASS | PASS |
| - | update_case | C43832 | 1 | LIFT_READY | 200 | PASS | PASS |
| - | update_case | C30178 | 1 | LIFT_READY | 200 | PASS | PASS |
| - | update_case | C43840 | 1 | LIFT_READY | 200 | PASS | PASS |

### Batch 3 — Automated (4), READY re-stamps (8), raw-HTML repairs (C30166 + C30117/C30130/C30168)
All update_case HTTP 200 + byte-verified. C30166: raw HTML demarked + EF marker off (SV-8964 OBSOLETE, A3 defect still reproduces). C30117/C30130/C30168: §3.5 raw-markup repair + re-stamp.

**Post-batch invariant census over all 96 live SBC cases: RAW MARKUP 0, MULTI-MARKER 0, NO-MARKER 0, MULTI-PROVENANCE 0. Final markers: 86 READY + 10 HOLD.**

### END-OF-PASS BUILD REDEPLOY (honest record)
Start marker (all observations + writes): **v3.8-2bf8d14**, last-mod 2026-08-18 17:45:12 GMT, etag 0f69246068bb597a9f1a1f02bd708754.
End-of-pass re-read: **v3.8-bd246fd**, last-mod 2026-08-18 19:57:31 GMT, etag c4dd352f91ecfee192844c6a04a643fc.
The redeploy happened AFTER all SBC observations and update_case writes were complete. All 50 writes stamp v3.8-2bf8d14 (the build observed). Same-minor rebuild -> per Rule 60/skill-03 6.1 the verdicts are not made stale; re-confirm labels/routes on v3.8-bd246fd only if a functional change is suspected. NO run writes (0 update_run, 0 results). Run 359 untouched.


---

## Parts Velocity (PV) — testrail-execution-log, 2026-08-18, build v3.8-bd246fd

26 `update_case` ops, all three text fields sent, re-GET byte-compared field-by-field (Rule 50). All HTTP 200 + byte-verified MATCH + custom_atmstatus=1. 0 mismatches, 0 collateral changes.

| # | C-id | mode | HTTP | byte_ok | atm |
|---|---|---|---|---|---|
| 1 | C30351 | deferred | 200 | ✅ | 1 |
| 2 | C30368 | deferred | 200 | ✅ | 1 |
| 3 | C30369 | deferred | 200 | ✅ | 1 |
| 4 | C30370 | deferred | 200 | ✅ | 1 |
| 5 | C30371 | deferred | 200 | ✅ | 1 |
| 6 | C30373 | deferred | 200 | ✅ | 1 |
| 7 | C30374 | deferred | 200 | ✅ | 1 |
| 8 | C30381 | deferred | 200 | ✅ | 1 |
| 9 | C43834 | deferred | 200 | ✅ | 1 |
| 10 | C30337 | strip | 200 | ✅ | 1 |
| 11 | C30347 | strip | 200 | ✅ | 1 |
| 12 | C30379 | strip | 200 | ✅ | 1 |
| 13 | C30380 | strip | 200 | ✅ | 1 |
| 14 | C30384 | strip | 200 | ✅ | 1 |
| 15 | C38914 | strip | 200 | ✅ | 1 |
| 16 | C30322 | restamp | 200 | ✅ | 1 |
| 17 | C30323 | restamp | 200 | ✅ | 1 |
| 18 | C30324 | restamp | 200 | ✅ | 1 |
| 19 | C30325 | restamp | 200 | ✅ | 1 |
| 20 | C30343 | restamp | 200 | ✅ | 1 |
| 21 | C30376 | restamp | 200 | ✅ | 1 |
| 22 | C30377 | restamp | 200 | ✅ | 1 |
| 23 | C30378 | restamp | 200 | ✅ | 1 |
| 24 | C30388 | restamp | 200 | ✅ | 1 |
| 25 | C30389 | restamp | 200 | ✅ | 1 |
| 26 | C30391 | restamp | 200 | ✅ | 1 |

**All 26 ops verified live post-write in the full-72 census (0 anomalies).** Run 359 untouched — only `update_case` called, no run/result writes, include_all still False, 508 tests unchanged. 0 Jira writes (GET only).
