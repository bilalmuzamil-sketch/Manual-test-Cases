# Report Suite — TestRail execution log (2026-07-28 push) — **EXECUTED**

**Authorization:** explicit user Rule-6 authorization 2026-07-28 ("Push ALL"). Manifest: `testrail-push-manifest-2026-07-28.md` (header now EXECUTED). Executor: `apply`-side `/tmp` script mirrored in this folder's manifest; raw result JSON archived as `testrail-execution-result-2026-07-28.json` here.

**Result: 70 update_case + 1 add_case + 57 delete_case — ALL HTTP 200, ALL verified (re-GET MATCH on title/preconds/steps/expected/refs for updates+add; re-GET gone for deletes). 0 failures, 0 HELD groups.** One transient HTTP 000 on a verify GET (C30164) resolved on first retry.

**New case: SBC-EXP-16 = C38856** (section 4300 'SBC — Exports' under folder 4282; custom_atmstatus:3, custom_automation_type:0, type Functional, priority Medium).

**Run R359 ("Reports Suite - Nebojsa/Viktoria (VIU Pending)", NOT ours, never written to):** 515 tests (all Untested) before the push → **458 tests (all Untested) after** — the 57 deletions removed their tests from the run; the new case C38856 is not in the run. Documented only; NO result writes.

**Live verification after the push:** 459 cases under group 4281 (96 sections), C-id range C30096–C38856 — matches the 459 active local cases exactly.

**Refs note:** SBC-EXP-01 (C30159) and SBR-LOC-03 (C30215) carry a condensed refs string in TestRail (length cap); the full ticket+anchor text stays in the local spec_ref / import References.

## Per-case log

| # | Op | Internal ID | C-id | Link | HTTP | Verify | Driving source |
|---|---|---|---|---|---|---|---|
| 1 | update_case | IV-EXP-09 | C30595 | https://shopview.testrail.io/index.php?/cases/view/30595 | 200 | MATCH | merge survivor |
| 2 | update_case | IV-FLT-02 | C30570 | https://shopview.testrail.io/index.php?/cases/view/30570 | 200 | MATCH | merge survivor |
| 3 | update_case | IV-LOC-01 | C30574 | https://shopview.testrail.io/index.php?/cases/view/30574 | 200 | MATCH | video edit |
| 4 | update_case | IV-LOC-04 | C30577 | https://shopview.testrail.io/index.php?/cases/view/30577 | 200 | MATCH | video edit |
| 5 | update_case | IV-NAV-06 | C30539 | https://shopview.testrail.io/index.php?/cases/view/30539 | 200 | MATCH | merge survivor |
| 6 | update_case | IV-PERS-04 | C30582 | https://shopview.testrail.io/index.php?/cases/view/30582 | 200 | MATCH | sense-check repair |
| 7 | update_case | IV-SCOPE-01 | C30540 | https://shopview.testrail.io/index.php?/cases/view/30540 | 200 | MATCH | merge survivor |
| 8 | update_case | IV-TOT-01 | C30556 | https://shopview.testrail.io/index.php?/cases/view/30556 | 200 | MATCH | merge survivor |
| 9 | update_case | IV-TOT-02 | C30557 | https://shopview.testrail.io/index.php?/cases/view/30557 | 200 | MATCH | merge survivor |
| 10 | update_case | PV-API-01 | C30388 | https://shopview.testrail.io/index.php?/cases/view/30388 | 200 | MATCH | video edit |
| 11 | update_case | PV-API-02 | C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 | 200 | MATCH | video edit |
| 12 | update_case | PV-EXP-08 | C30382 | https://shopview.testrail.io/index.php?/cases/view/30382 | 200 | MATCH | video edit + sense-check repair |
| 13 | update_case | PV-EXP-10 | C30384 | https://shopview.testrail.io/index.php?/cases/view/30384 | 200 | MATCH | merge survivor |
| 14 | update_case | PV-FILT-01 | C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 | 200 | MATCH | video edit + merge survivor |
| 15 | update_case | PV-FILT-09 | C30336 | https://shopview.testrail.io/index.php?/cases/view/30336 | 200 | MATCH | video edit |
| 16 | update_case | PV-FILT-10 | C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 | 200 | MATCH | video edit |
| 17 | update_case | PV-FILT-13 | C30340 | https://shopview.testrail.io/index.php?/cases/view/30340 | 200 | MATCH | video edit |
| 18 | update_case | PV-ROW-05 | C30345 | https://shopview.testrail.io/index.php?/cases/view/30345 | 200 | MATCH | video edit |
| 19 | update_case | SBC-COL-02 | C30157 | https://shopview.testrail.io/index.php?/cases/view/30157 | 200 | MATCH | merge survivor |
| 20 | update_case | SBC-CUST-03 | C30114 | https://shopview.testrail.io/index.php?/cases/view/30114 | 200 | MATCH | merge survivor |
| 21 | update_case | SBC-CUST-04 | C30115 | https://shopview.testrail.io/index.php?/cases/view/30115 | 200 | MATCH | merge survivor |
| 22 | update_case | SBC-EMPTY-01 | C30181 | https://shopview.testrail.io/index.php?/cases/view/30181 | 200 | MATCH | merge survivor |
| 23 | update_case | SBC-EXP-01 | C30159 | https://shopview.testrail.io/index.php?/cases/view/30159 | 200 | MATCH | video edit |
| 24 | update_case | SBC-EXP-02 | C30160 | https://shopview.testrail.io/index.php?/cases/view/30160 | 200 | MATCH | merge survivor |
| 25 | update_case | SBC-EXP-06 | C30164 | https://shopview.testrail.io/index.php?/cases/view/30164 | 200 | MATCH | merge survivor |
| 26 | update_case | SBC-EXP-08 | C30166 | https://shopview.testrail.io/index.php?/cases/view/30166 | 200 | MATCH | sense-check repair |
| 27 | update_case | SBC-EXP-14 | C30172 | https://shopview.testrail.io/index.php?/cases/view/30172 | 200 | MATCH | video edit |
| 28 | update_case | SBC-LBL-01 | C30134 | https://shopview.testrail.io/index.php?/cases/view/30134 | 200 | MATCH | video edit + merge survivor |
| 29 | update_case | SBC-LBL-04 | C30137 | https://shopview.testrail.io/index.php?/cases/view/30137 | 200 | MATCH | video edit |
| 30 | update_case | SBC-LOC-03 | C30111 | https://shopview.testrail.io/index.php?/cases/view/30111 | 200 | MATCH | video edit |
| 31 | update_case | SBC-NAV-01 | C30096 | https://shopview.testrail.io/index.php?/cases/view/30096 | 200 | MATCH | merge survivor |
| 32 | update_case | SBC-PERM-04 | C30101 | https://shopview.testrail.io/index.php?/cases/view/30101 | 200 | MATCH | sense-check repair |
| 33 | update_case | SBC-PERS-05 | C30178 | https://shopview.testrail.io/index.php?/cases/view/30178 | 200 | MATCH | merge survivor |
| 34 | update_case | SBC-SORT-01 | C30142 | https://shopview.testrail.io/index.php?/cases/view/30142 | 200 | MATCH | merge survivor |
| 35 | update_case | SBC-TREE-03 | C30123 | https://shopview.testrail.io/index.php?/cases/view/30123 | 200 | MATCH | merge survivor |
| 36 | update_case | SBC-TREE-09 | C30129 | https://shopview.testrail.io/index.php?/cases/view/30129 | 200 | MATCH | merge survivor |
| 37 | update_case | SBC-TYPE-02 | C30107 | https://shopview.testrail.io/index.php?/cases/view/30107 | 200 | MATCH | merge survivor |
| 38 | update_case | SBR-BADGE-01 | C30226 | https://shopview.testrail.io/index.php?/cases/view/30226 | 200 | MATCH | merge survivor |
| 39 | update_case | SBR-CALC-02 | C30230 | https://shopview.testrail.io/index.php?/cases/view/30230 | 200 | MATCH | merge survivor |
| 40 | update_case | SBR-CALC-08 | C30236 | https://shopview.testrail.io/index.php?/cases/view/30236 | 200 | MATCH | sense-check repair |
| 41 | update_case | SBR-COL-01 | C30265 | https://shopview.testrail.io/index.php?/cases/view/30265 | 200 | MATCH | merge survivor |
| 42 | update_case | SBR-DEACT-07 | C30258 | https://shopview.testrail.io/index.php?/cases/view/30258 | 200 | MATCH | merge survivor |
| 43 | update_case | SBR-EXP-08 | C30283 | https://shopview.testrail.io/index.php?/cases/view/30283 | 200 | MATCH | sense-check repair |
| 44 | update_case | SBR-LINK-01 | C30247 | https://shopview.testrail.io/index.php?/cases/view/30247 | 200 | MATCH | merge survivor |
| 45 | update_case | SBR-LOC-03 | C30215 | https://shopview.testrail.io/index.php?/cases/view/30215 | 200 | MATCH | video edit |
| 46 | update_case | SBR-LOC-04 | C30216 | https://shopview.testrail.io/index.php?/cases/view/30216 | 200 | MATCH | video edit |
| 47 | update_case | SBR-NAV-01 | C30195 | https://shopview.testrail.io/index.php?/cases/view/30195 | 200 | MATCH | sense-check repair + merge survivor |
| 48 | update_case | SBR-PERS-04 | C30274 | https://shopview.testrail.io/index.php?/cases/view/30274 | 200 | MATCH | merge survivor |
| 49 | update_case | SBR-ROW-02 | C30218 | https://shopview.testrail.io/index.php?/cases/view/30218 | 200 | MATCH | merge survivor |
| 50 | update_case | SBR-STAT-04 | C30211 | https://shopview.testrail.io/index.php?/cases/view/30211 | 200 | MATCH | merge survivor |
| 51 | update_case | SBR-STATE-01 | C30298 | https://shopview.testrail.io/index.php?/cases/view/30298 | 200 | MATCH | merge survivor |
| 52 | update_case | SBR-TOT-01 | C30237 | https://shopview.testrail.io/index.php?/cases/view/30237 | 200 | MATCH | merge survivor |
| 53 | update_case | SBR-TYPE-02 | C30206 | https://shopview.testrail.io/index.php?/cases/view/30206 | 200 | MATCH | merge survivor |
| 54 | update_case | SBR-UNAS-02 | C30262 | https://shopview.testrail.io/index.php?/cases/view/30262 | 200 | MATCH | merge survivor |
| 55 | update_case | TU-HRS-02 | C30401 | https://shopview.testrail.io/index.php?/cases/view/30401 | 200 | MATCH | merge survivor |
| 56 | update_case | TU-LINK-03 | C30430 | https://shopview.testrail.io/index.php?/cases/view/30430 | 200 | MATCH | sense-check repair |
| 57 | update_case | TU-LOC-01 | C30442 | https://shopview.testrail.io/index.php?/cases/view/30442 | 200 | MATCH | video edit |
| 58 | update_case | TU-LOC-05 | C30446 | https://shopview.testrail.io/index.php?/cases/view/30446 | 200 | MATCH | video edit |
| 59 | update_case | TU-NAV-01 | C30392 | https://shopview.testrail.io/index.php?/cases/view/30392 | 200 | MATCH | video edit |
| 60 | update_case | TU-NAV-08 | C30399 | https://shopview.testrail.io/index.php?/cases/view/30399 | 200 | MATCH | merge survivor |
| 61 | update_case | TU-SUM-02 | C30415 | https://shopview.testrail.io/index.php?/cases/view/30415 | 200 | MATCH | sense-check repair |
| 62 | update_case | WIP-COL-05 | C30470 | https://shopview.testrail.io/index.php?/cases/view/30470 | 200 | MATCH | video edit |
| 63 | update_case | WIP-EXP-07 | C30516 | https://shopview.testrail.io/index.php?/cases/view/30516 | 200 | MATCH | video edit |
| 64 | update_case | WIP-FLT-03 | C30500 | https://shopview.testrail.io/index.php?/cases/view/30500 | 200 | MATCH | video edit |
| 65 | update_case | WIP-FLT-08 | C30505 | https://shopview.testrail.io/index.php?/cases/view/30505 | 200 | MATCH | merge survivor |
| 66 | update_case | WIP-PLACE-01 | C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 | 200 | MATCH | merge survivor |
| 67 | update_case | WIP-PLACE-03 | C30464 | https://shopview.testrail.io/index.php?/cases/view/30464 | 200 | MATCH | merge survivor |
| 68 | update_case | WIP-SCOPE-05 | C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 | 200 | MATCH | merge survivor |
| 69 | update_case | WIP-SORT-03 | C30485 | https://shopview.testrail.io/index.php?/cases/view/30485 | 200 | MATCH | video edit |
| 70 | update_case | WIP-TAB-01 | C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 | 200 | MATCH | merge survivor |
| 71 | add_case | SBC-EXP-16 | C38856 | https://shopview.testrail.io/index.php?/cases/view/38856 | 200 | MATCH | video P21 compressed download (new case) |
| 72 | delete_case | SBC-NAV-02 | C30097 | https://shopview.testrail.io/index.php?/cases/view/30097 | 200 | GONE(re-GET 400) | merged-away member |
| 73 | delete_case | SBC-DATE-02 | C30103 | https://shopview.testrail.io/index.php?/cases/view/30103 | 200 | GONE(re-GET 400) | merged-away member |
| 74 | delete_case | SBC-LOC-02 | C30110 | https://shopview.testrail.io/index.php?/cases/view/30110 | 200 | GONE(re-GET 400) | merged-away member |
| 75 | delete_case | SBC-TYPE-01 | C30106 | https://shopview.testrail.io/index.php?/cases/view/30106 | 200 | GONE(re-GET 400) | merged-away member |
| 76 | delete_case | SBC-TYPE-03 | C30108 | https://shopview.testrail.io/index.php?/cases/view/30108 | 200 | GONE(re-GET 400) | merged-away member |
| 77 | delete_case | SBC-CUST-08 | C30119 | https://shopview.testrail.io/index.php?/cases/view/30119 | 200 | GONE(re-GET 400) | merged-away member |
| 78 | delete_case | SBC-CUST-07 | C30118 | https://shopview.testrail.io/index.php?/cases/view/30118 | 200 | GONE(re-GET 400) | merged-away member |
| 79 | delete_case | SBC-TREE-07 | C30127 | https://shopview.testrail.io/index.php?/cases/view/30127 | 200 | GONE(re-GET 400) | merged-away member |
| 80 | delete_case | SBC-LBL-02 | C30135 | https://shopview.testrail.io/index.php?/cases/view/30135 | 200 | GONE(re-GET 400) | merged-away member |
| 81 | delete_case | SBC-LBL-03 | C30136 | https://shopview.testrail.io/index.php?/cases/view/30136 | 200 | GONE(re-GET 400) | merged-away member |
| 82 | delete_case | SBC-SORT-05 | C30146 | https://shopview.testrail.io/index.php?/cases/view/30146 | 200 | GONE(re-GET 400) | merged-away member |
| 83 | delete_case | SBC-SORT-06 | C30147 | https://shopview.testrail.io/index.php?/cases/view/30147 | 200 | GONE(re-GET 400) | merged-away member |
| 84 | delete_case | SBC-COL-03 | C30158 | https://shopview.testrail.io/index.php?/cases/view/30158 | 200 | GONE(re-GET 400) | merged-away member |
| 85 | delete_case | SBC-EXP-07 | C30165 | https://shopview.testrail.io/index.php?/cases/view/30165 | 200 | GONE(re-GET 400) | merged-away member |
| 86 | delete_case | SBC-EXP-12 | C30170 | https://shopview.testrail.io/index.php?/cases/view/30170 | 200 | GONE(re-GET 400) | merged-away member |
| 87 | delete_case | SBC-EMPTY-03 | C30183 | https://shopview.testrail.io/index.php?/cases/view/30183 | 200 | GONE(re-GET 400) | merged-away member |
| 88 | delete_case | SBR-NAV-02 | C30196 | https://shopview.testrail.io/index.php?/cases/view/30196 | 200 | GONE(re-GET 400) | merged-away member |
| 89 | delete_case | SBR-DATE-03 | C30203 | https://shopview.testrail.io/index.php?/cases/view/30203 | 200 | GONE(re-GET 400) | merged-away member |
| 90 | delete_case | SBR-LOC-02 | C30214 | https://shopview.testrail.io/index.php?/cases/view/30214 | 200 | GONE(re-GET 400) | merged-away member |
| 91 | delete_case | SBR-TYPE-01 | C30205 | https://shopview.testrail.io/index.php?/cases/view/30205 | 200 | GONE(re-GET 400) | merged-away member |
| 92 | delete_case | SBR-TYPE-03 | C30207 | https://shopview.testrail.io/index.php?/cases/view/30207 | 200 | GONE(re-GET 400) | merged-away member |
| 93 | delete_case | SBR-STAT-03 | C30210 | https://shopview.testrail.io/index.php?/cases/view/30210 | 200 | GONE(re-GET 400) | merged-away member |
| 94 | delete_case | SBR-ROW-04 | C30220 | https://shopview.testrail.io/index.php?/cases/view/30220 | 200 | GONE(re-GET 400) | merged-away member |
| 95 | delete_case | SBR-BADGE-03 | C30228 | https://shopview.testrail.io/index.php?/cases/view/30228 | 200 | GONE(re-GET 400) | merged-away member |
| 96 | delete_case | SBR-CALC-04 | C30232 | https://shopview.testrail.io/index.php?/cases/view/30232 | 200 | GONE(re-GET 400) | merged-away member |
| 97 | delete_case | SBR-TOT-04 | C30240 | https://shopview.testrail.io/index.php?/cases/view/30240 | 200 | GONE(re-GET 400) | merged-away member |
| 98 | delete_case | SBR-LINK-02 | C30248 | https://shopview.testrail.io/index.php?/cases/view/30248 | 200 | GONE(re-GET 400) | merged-away member |
| 99 | delete_case | SBR-DEACT-01 | C30252 | https://shopview.testrail.io/index.php?/cases/view/30252 | 200 | GONE(re-GET 400) | merged-away member |
| 100 | delete_case | SBR-UNAS-03 | C30263 | https://shopview.testrail.io/index.php?/cases/view/30263 | 200 | GONE(re-GET 400) | merged-away member |
| 101 | delete_case | SBR-COL-02 | C30266 | https://shopview.testrail.io/index.php?/cases/view/30266 | 200 | GONE(re-GET 400) | merged-away member |
| 102 | delete_case | SBR-COL-06 | C30270 | https://shopview.testrail.io/index.php?/cases/view/30270 | 200 | GONE(re-GET 400) | merged-away member |
| 103 | delete_case | SBR-STATE-02 | C30299 | https://shopview.testrail.io/index.php?/cases/view/30299 | 200 | GONE(re-GET 400) | merged-away member |
| 104 | delete_case | PV-FILT-02 | C30329 | https://shopview.testrail.io/index.php?/cases/view/30329 | 200 | GONE(re-GET 400) | merged-away member |
| 105 | delete_case | PV-EXP-09 | C30383 | https://shopview.testrail.io/index.php?/cases/view/30383 | 200 | GONE(re-GET 400) | merged-away member |
| 106 | delete_case | TU-HRS-01 | C30400 | https://shopview.testrail.io/index.php?/cases/view/30400 | 200 | GONE(re-GET 400) | merged-away member |
| 107 | delete_case | TU-TECH-05 | C30427 | https://shopview.testrail.io/index.php?/cases/view/30427 | 200 | GONE(re-GET 400) | merged-away member |
| 108 | delete_case | WIP-TAB-04 | C30454 | https://shopview.testrail.io/index.php?/cases/view/30454 | 200 | GONE(re-GET 400) | merged-away member |
| 109 | delete_case | WIP-SCOPE-06 | C30461 | https://shopview.testrail.io/index.php?/cases/view/30461 | 200 | GONE(re-GET 400) | merged-away member |
| 110 | delete_case | WIP-PLACE-02 | C30463 | https://shopview.testrail.io/index.php?/cases/view/30463 | 200 | GONE(re-GET 400) | merged-away member |
| 111 | delete_case | WIP-PLACE-04 | C30465 | https://shopview.testrail.io/index.php?/cases/view/30465 | 200 | GONE(re-GET 400) | merged-away member |
| 112 | delete_case | WIP-SUM-06 | C30492 | https://shopview.testrail.io/index.php?/cases/view/30492 | 200 | GONE(re-GET 400) | merged-away member |
| 113 | delete_case | WIP-TOT-03 | C30496 | https://shopview.testrail.io/index.php?/cases/view/30496 | 200 | GONE(re-GET 400) | merged-away member |
| 114 | delete_case | IV-NAV-04 | C30537 | https://shopview.testrail.io/index.php?/cases/view/30537 | 200 | GONE(re-GET 400) | merged-away member |
| 115 | delete_case | IV-DATE-07 | C30567 | https://shopview.testrail.io/index.php?/cases/view/30567 | 200 | GONE(re-GET 400) | merged-away member |
| 116 | delete_case | IV-LOC-05 | C30578 | https://shopview.testrail.io/index.php?/cases/view/30578 | 200 | GONE(re-GET 400) | merged-away member |
| 117 | delete_case | IV-SCOPE-03 | C30542 | https://shopview.testrail.io/index.php?/cases/view/30542 | 200 | GONE(re-GET 400) | merged-away member |
| 118 | delete_case | IV-SCOPE-04 | C30543 | https://shopview.testrail.io/index.php?/cases/view/30543 | 200 | GONE(re-GET 400) | merged-away member |
| 119 | delete_case | IV-TOT-04 | C30559 | https://shopview.testrail.io/index.php?/cases/view/30559 | 200 | GONE(re-GET 400) | merged-away member |
| 120 | delete_case | IV-EXP-08 | C30594 | https://shopview.testrail.io/index.php?/cases/view/30594 | 200 | GONE(re-GET 400) | merged-away member |
| 121 | delete_case | IV-VIS-03 | C30598 | https://shopview.testrail.io/index.php?/cases/view/30598 | 200 | GONE(re-GET 400) | merged-away member |
| 122 | delete_case | SBC-SORT-07 | C30148 | https://shopview.testrail.io/index.php?/cases/view/30148 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 123 | delete_case | SBR-SORT-06 | C30246 | https://shopview.testrail.io/index.php?/cases/view/30246 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 124 | delete_case | SBR-EXP-09 | C30284 | https://shopview.testrail.io/index.php?/cases/view/30284 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 125 | delete_case | PV-COL-07 | C30357 | https://shopview.testrail.io/index.php?/cases/view/30357 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 126 | delete_case | WIP-TOT-04 | C30497 | https://shopview.testrail.io/index.php?/cases/view/30497 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 127 | delete_case | IV-TOT-05 | C30560 | https://shopview.testrail.io/index.php?/cases/view/30560 | 200 | GONE(re-GET 400) | CUT (usefulness+sense audit) |
| 128 | delete_case | SBC-EXP-13 | C30171 | https://shopview.testrail.io/index.php?/cases/view/30171 | 200 | GONE(re-GET 400) | retire (video P25 Print removal) |
