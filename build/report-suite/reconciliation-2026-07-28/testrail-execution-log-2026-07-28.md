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

## COMPLETION PASS (2026-07-29) — the 2 manifest-omitted Chris Q1=B Esc cases

**Why:** the independent post-push verification (`POST-PUSH-VERIFICATION-2026-07-28.md`, Check 4 /
ISSUE-1) found the "Push ALL" manifest omitted 2 cases that WERE in the user-approved bundle —
SBR-DEACT-04 (C30255) + SBR-DEACT-05 (C30256), the Chris Q1=B "Esc does NOT close the dialog"
edits (edited locally in commit 16485ca but never listed in the manifest's three buckets). The
user authorized completing them within the already-authorized Push-ALL scope.

**Executor:** `exec_completion_2026-07-28.py` (this folder); raw result JSON =
`testrail-execution-result-completion-2026-07-29.json`. Pre-op live snapshots taken first (same
convention): `testrail-pre-push-snapshot-2026-07-28/C30255_SBR-DEACT-04.json` +
`C30256_SBR-DEACT-05.json` (+ `COMPLETION-PASS-NOTE.md` explaining they are completion-pass
snapshots, not from the original 2026-07-28 snapshot run).

| # | Op | Internal ID | C-id | Link | HTTP | Re-GET verify | Timestamp (UTC) |
|---|---|---|---|---|---|---|---|
| 129 | update_case | SBR-DEACT-04 | C30255 | https://shopview.testrail.io/index.php?/cases/view/30255 | 200 | MATCH (title/preconds/steps/expected/refs) | 2026-07-29 04:32:29Z |
| 130 | update_case | SBR-DEACT-05 | C30256 | https://shopview.testrail.io/index.php?/cases/view/30256 | 200 | MATCH (title/preconds/steps/expected/refs) | 2026-07-29 04:32:30Z |

**Limit-kill + resume note:** the worker executing this pass was killed by a usage limit
immediately AFTER both ops succeeded ("Both ops succeeded. Now the documentation updates") and
BEFORE any documentation/commit steps. On resume (2026-07-29) an INDEPENDENT read-only re-verify
was run: fresh `get_case` on C30255 + C30256, byte-compared against the final local bodies in
`cases/cases-sbr-C-links-deactivation-unassigned-columns-persistence.json` — **both MATCH on all
five fields, and both live bodies carry the Esc-does-NOT-close expectation** (SBR-DEACT-04
expected #3: "Pressing the \"Esc\" key does NOT close the dialog - it stays open…"; SBR-DEACT-05
expected #1: "…pressing the \"Esc\" key never closes the dialog at any time"). **No re-push was
needed; no further TestRail writes were made on resume.** R359 post-op total = 458 (unchanged,
never written to).

**Running totals for the full Push-ALL scope (now complete): 72 update_case + 1 add_case +
57 delete_case, all HTTP 200 + verified, 0 failures. Suite = 459 ACTIVE.** ISSUE-1 is RESOLVED;
remaining known live drifts (NOT in the authorized scope, AWAITING user authorization): TU-DAY-01
C30418 (import placeholder artifact) + 2 overlong titles PV-API-02 C30389 / PV-FILT-09 C30336.

---

## AUTHORIZED FIXES 2026-07-29 (explicit user authorization 2026-07-29 — exactly 3 update_case)

The three "remaining known live drifts" flagged above were authorized and executed 2026-07-29.
Executor: `exec_authorized_fixes_2026-07-29.py`; machine-readable result:
`testrail-execution-result-authorized-fixes-2026-07-29.json`. Pre-op live snapshots (get_case
first, completion-pass convention): `testrail-pre-push-snapshot-2026-07-28/
C30418_TU-DAY-01.pre-authorized-fix-2026-07-29.json` + `C30389_PV-API-02.pre-authorized-fix-2026-07-29.json`
+ `C30336_PV-FILT-09.pre-authorized-fix-2026-07-29.json`. NO other case touched; NO run writes
(R359 untouched).

| # | Op | Internal ID | C-id | Link | What changed | HTTP | Re-GET verify |
|---|---|---|---|---|---|---|---|
| 131 | update_case | TU-DAY-01 | C30418 | https://shopview.testrail.io/index.php?/cases/view/30418 | Import artifact repaired: live expected #2 read "Expand 's daily breakdown" (the angle-bracket name placeholder was swallowed as an HTML tag at the 2026-07-22 import — confirmed in the pre-op snapshot). Rewritten plain, no angle brackets: "…when collapsed it reads Expand, then that technician's name, then daily breakdown (for example: Expand John Smith's daily breakdown); when expanded it reads Collapse, then the same name and words." Title/refs unchanged. | 200 | MATCH (title/preconds/steps/expected/refs) |
| 132 | update_case | PV-API-02 | C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 | Title 100→71 chars: "Each filter or search change re-queries the server and returns page one". Body/refs unchanged. | 200 | MATCH |
| 133 | update_case | PV-FILT-09 | C30336 | https://shopview.testrail.io/index.php?/cases/view/30336 | Title 96→77 chars: "Bin filter excludes special-order rows; Bin plus that Type is empty by design". Body/refs unchanged. | 200 | MATCH |

**Angle-bracket sweep (part of the authorization):** ALL 459 active local bodies (plus retired
bodies) grepped for "<" in title/preconditions/steps/expected → **0 other occurrences**; a
second sweep for the swallowed-remnant pattern (a bare " 's " with the name eaten) → 0 hits.
TU-DAY-01 was the ONLY case with the artifact. **Follow-up candidate found (NOT pushed, needs
authorization): TU-DAY-01's own title is 87 chars** ("Each technician row has an accessible
expand/collapse control named for its next action") — over the ≤80 concise-title rule; pushed
UNCHANGED this pass (only the placeholder repair was authorized for that case).

Gotcha captured to `build/APP-ACTIONS-PLAYBOOK.md` §J (Rule 27): TestRail swallows angle-bracket
placeholders as HTML — never use "<"/">" in case text; write plain words instead.

---

## CHRIS-UPDATE PUSH 2026-07-29 (explicit user authorization 2026-07-29)

**Scope: EXACTLY the ChangeList-2026-07-29.md push queue — 24 update_case + 1 add_case (TU-COL-01). Result: 25/25 HTTP 200, 25/25 re-GET verified MATCH (title/preconds/steps/expected/refs; add also section + atm fields), 0 failures. NOTHING else written — no deletes, no section writes, no run writes (R359 untouched). Live count under group 4281 after the push = 460 == id-map.**

Executor: `chris-update-2026-07-29/exec_chris_push_2026-07-29.py`; machine result: `chris-update-2026-07-29/testrail-execution-result-2026-07-29.json`. Pre-op live snapshots of all 24 update targets: `chris-update-2026-07-29/pre-push-snapshot/C<cid>_<iid>.pre-chris-push-2026-07-29.json`. **Refs-cap convention applied (same as SBC-EXP-01/SBR-LOC-03 on 2026-07-28):** 14 cases' combined ticket+anchor refs exceeded the TestRail 250-char cap and were CONDENSED at push (ticket + spec anchor + 'Chris Ward msg 2026-07-29 [last-update-wins]' kept); the full text stays in the local `spec_ref` / import References. **TU-COL-01 = C38859** (section 4348 "TU — Visual & Accessibility", resolved live from sibling TU-VIS-01 C30447).

| # | Op | Internal ID | C-id | Link | What changed | HTTP | Re-GET verify |
|---|---|---|---|---|---|---|---|
| 134 | update_case | SBC-LBL-01 | C30134 | https://shopview.testrail.io/index.php?/cases/view/30134 | Asset identifier re-ruled: VIN, falling back to Unit #, then plate (supersedes the video's serial ruling for SBC). | 200 | MATCH (2026-07-29 09:32:28Z) |
| 135 | update_case | SBC-LBL-04 | C30137 | https://shopview.testrail.io/index.php?/cases/view/30137 | Notes-only: duplicate-label seeding context moved from serial to the VIN chain; (#1)/(#2) rule unchanged. | 200 | MATCH (2026-07-29 09:32:30Z) |
| 136 | update_case | SBC-EXP-01 | C30159 | https://shopview.testrail.io/index.php?/cases/view/30159 | Menu = the four exact items (Download Summary/Expanded View, PDF and CSV); still NO Print. Refs condensed to cap. | 200 | MATCH (2026-07-29 09:32:31Z) |
| 137 | update_case | SBC-EXP-16 | C38856 | https://shopview.testrail.io/index.php?/cases/view/38856 | Reshaped to the Summary/Expanded split: Summary = one row per customer; Expanded = Customer→Asset→Invoice; both PDF+CSV. | 200 | MATCH (2026-07-29 09:32:33Z) |
| 138 | update_case | SBC-EXP-03 | C30161 | https://shopview.testrail.io/index.php?/cases/view/30161 | Scoped to the Expanded View CSV; 'no asset layer by design' note removed; 'Locations:' line expectation added. | 200 | MATCH (2026-07-29 09:32:35Z) |
| 139 | update_case | SBC-EXP-11 | C30169 | https://shopview.testrail.io/index.php?/cases/view/30169 | Scoped to the Expanded View PDF body with the Customer/Asset/Invoice breakdown; formatting rules kept. | 200 | MATCH (2026-07-29 09:32:36Z) |
| 140 | update_case | SBC-EXP-09 | C30167 | https://shopview.testrail.io/index.php?/cases/view/30167 | REVERSED: 'location NOT shown in the header' replaced by a 'Locations:' line in the PDF header. | 200 | MATCH (2026-07-29 09:32:38Z) |
| 141 | update_case | SBR-EXP-02 | C30277 | https://shopview.testrail.io/index.php?/cases/view/30277 | 'Locations:' line in every one of the four downloads; long title trimmed. | 200 | MATCH (2026-07-29 09:32:39Z) |
| 142 | update_case | PV-EXP-02 | C30376 | https://shopview.testrail.io/index.php?/cases/view/30376 | 'Locations:' line in each export (PDF and CSV). | 200 | MATCH (2026-07-29 09:32:41Z) |
| 143 | update_case | TU-EXP-04 | C30437 | https://shopview.testrail.io/index.php?/cases/view/30437 | 'Locations:' line in every download; long title trimmed. | 200 | MATCH (2026-07-29 09:32:43Z) |
| 144 | update_case | IV-EXP-02 | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 | 'Locations:' line in each download; long title trimmed. | 200 | MATCH (2026-07-29 09:32:44Z) |
| 145 | update_case | WIP-EXP-02 | C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 | 'Locations:' line in each download; long title trimmed. | 200 | MATCH (2026-07-29 09:32:46Z) |
| 146 | update_case | SBC-LOC-03 | C30111 | https://shopview.testrail.io/index.php?/cases/view/30111 | On-screen location-scope indicator expectation added (distinct from the per-row location label). | 200 | MATCH (2026-07-29 09:32:47Z) |
| 147 | update_case | SBR-LOC-03 | C30215 | https://shopview.testrail.io/index.php?/cases/view/30215 | On-screen scope-indicator expectation added. | 200 | MATCH (2026-07-29 09:32:49Z) |
| 148 | update_case | PV-FILT-10 | C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 | On-screen scope-indicator expectation added. | 200 | MATCH (2026-07-29 09:32:51Z) |
| 149 | update_case | TU-LOC-02 | C30443 | https://shopview.testrail.io/index.php?/cases/view/30443 | On-screen scope-indicator expectation added; long title trimmed. | 200 | MATCH (2026-07-29 09:32:52Z) |
| 150 | update_case | IV-LOC-02 | C30575 | https://shopview.testrail.io/index.php?/cases/view/30575 | On-screen scope-indicator expectation added. | 200 | MATCH (2026-07-29 09:32:54Z) |
| 151 | update_case | WIP-FLT-06 | C30503 | https://shopview.testrail.io/index.php?/cases/view/30503 | On-screen scope-indicator expectation added; long title trimmed. | 200 | MATCH (2026-07-29 09:32:55Z) |
| 152 | update_case | PV-FILT-01 | C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 | Type filter options read exactly: Both, Inventory, Special Order; rename hedge removed. | 200 | MATCH (2026-07-29 09:32:57Z) |
| 153 | update_case | PV-FILT-09 | C30336 | https://shopview.testrail.io/index.php?/cases/view/30336 | Body wording moved to the exact 'Special Order' label (title was already pushed in the authorized fix). | 200 | MATCH (2026-07-29 09:32:58Z) |
| 154 | update_case | PV-ROW-05 | C30345 | https://shopview.testrail.io/index.php?/cases/view/30345 | Type column values read exactly 'Inventory' or 'Special Order'; hedge removed. | 200 | MATCH (2026-07-29 09:32:59Z) |
| 155 | update_case | PV-EXP-08 | C30382 | https://shopview.testrail.io/index.php?/cases/view/30382 | Notes-only: exported Type values read 'Special Order'; alignment rule unaffected. | 200 | MATCH (2026-07-29 09:33:01Z) |
| 156 | update_case | PV-EXP-05 | C30379 | https://shopview.testrail.io/index.php?/cases/view/30379 | Same-logo-treatment expectation added (PV was the only report with no logo coverage); long title trimmed. | 200 | MATCH (2026-07-29 09:33:03Z) |
| 157 | update_case | TU-DAY-01 | C30418 | https://shopview.testrail.io/index.php?/cases/view/30418 | Local title trim 87→61 chars + story ticket SV-8651 added to refs (the placeholder repair was already live). | 200 | MATCH (2026-07-29 09:33:04Z) |
| 158 | add_case | TU-COL-01 | C38859 | https://shopview.testrail.io/index.php?/cases/view/38859 | NEW case: a column selector lets the user choose which columns show (reverses the video-era no-selector state; column list/defaults unpinned until the spec changelog). Section 4348 TU — Visual & Accessibility; custom_atmstatus:3 + custom_automation_type:0. | 200 | MATCH (2026-07-29 09:33:08Z) |

**Post-push reconciliation:** id-map TU-COL-01 = C38859 (460/460 rows, 0 blank C-ids); import + 6 per-report splits + coverage addenda regenerated over 460 (header byte-identical to the other project imports 7/7 files; 0 VIU words, 0 feature-flag words, 0 internal-id leaks, 0 duplicate section+title pairs; 29 API cases all in "— API" sections; splits row-set == unified). Push authorization CONSUMED; VIU-time corrections come later per the user.


---

## WAVE-2 PUSH 2026-07-29 (explicit user authorization "Push" 2026-07-29)

**Scope: EXACTLY the ChangeList-2026-07-29.md "Push queue — wave 2" — 4 update_case (the WIP asset-identifier VIN-chain edits per Chris Ward's answer A). Result: 4/4 HTTP 200, 4/4 re-GET verified MATCH (title/preconds/steps/expected/refs), 0 failures. NOTHING else written — no adds, no deletes, no section writes, no run writes (R359 untouched). Live count under group 4281 after the push = 460 == id-map.**

Executor: `chris-update-2026-07-29/exec_wave2_push_2026-07-29.py`; machine result: `chris-update-2026-07-29/testrail-execution-result-wave2-2026-07-29.json`. Pre-op live snapshots of all 4 update targets: `chris-update-2026-07-29/pre-push-snapshot/C<cid>_<iid>.pre-wave2-push-2026-07-29.json`. **Refs-cap convention applied (same as wave 1):** all 4 combined ticket+anchor refs exceeded the TestRail 250-char cap and were CONDENSED at push (ticket + spec anchor + 'Chris Ward answer A 2026-07-29 [last-update-wins]' kept); the full text stays in the local `spec_ref` / import References. SBC-LBL-01 C30134 = notes-only (local metadata field, NOT pushed — its pushed fields already carry the VIN chain from wave 1).

| # | Op | Internal ID | C-id | Link | What changed | HTTP | Re-GET verify |
|---|---|---|---|---|---|---|---|
| 159 | update_case | WIP-COL-05 | C30470 | https://shopview.testrail.io/index.php?/cases/view/30470 | Asset cell re-ruled from the video's serial number to VIN, falling back to Unit #, then plate (mirrors SBC-LBL-01); second-line rendering unpinned (confirm in the build); plain tester VIN-terminology note added (non-vehicle assets = serial number). | 200 | MATCH (2026-07-29 12:33:48Z) |
| 160 | update_case | WIP-FLT-03 | C30500 | https://shopview.testrail.io/index.php?/cases/view/30500 | Asset filter options + type-ahead matching re-ruled to the VIN chain (exact option text / matched fields confirmed in the build); same tester VIN-terminology note added. | 200 | MATCH (2026-07-29 12:33:50Z) |
| 161 | update_case | WIP-SORT-03 | C30485 | https://shopview.testrail.io/index.php?/cases/view/30485 | Asset column sort key re-ruled from serial number to the identifier the cell shows (VIN, falling back to Unit #, then plate). | 200 | MATCH (2026-07-29 12:33:51Z) |
| 162 | update_case | WIP-EXP-07 | C30516 | https://shopview.testrail.io/index.php?/cases/view/30516 | Serial-remnant flip: the Unit/Branch export-header caveat's expected #4 now says the on-screen Asset cell identifies the asset by its VIN (falling back to Unit #, then plate); the caveat itself (export header text unpinned, record — don't file) unchanged. | 200 | MATCH (2026-07-29 12:33:53Z) |

**Post-push state:** suite 460 active under group 4281, all current with Chris's rulings; wave-2 push authorization CONSUMED.

---

## TECH-PLAN PUSH 2026-07-30 (explicit user authorization "Push all three" 2026-07-30)

**Scope: EXACTLY the tech-plan-2026-07-29/ChangeList-2026-07-30.md push queue (section C) — 5 update_case + 5 add_case. Result: 10/10 HTTP 200, 10/10 re-GET verified MATCH (title/preconds/steps/expected/refs; adds also section + custom_atmstatus:3/custom_automation_type:0), 0 failures. NOTHING else written — 0 deletes, 0 section writes, NO run writes (R359 untouched: 458 tests, all Untested, before AND after). Live count under group 4281 after the push = 465 == id-map.**

Executor: `tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py` (pre-flight gate: refs ≤250, no angle brackets, no VIU/flag words; the 4 unchanged long update titles are pre-existing and outside this authorized diff — flag for next touch). Machine result: `tech-plan-2026-07-29/testrail-execution-result-techplan-2026-07-30.json`. Pre-op live snapshots of all 5 update targets: `tech-plan-2026-07-29/pre-push-snapshot/C<cid>_<iid>.pre-techplan-push-2026-07-30.json` (a pre-push desired-vs-live diff confirmed each update changes ONLY its ChangeList fields). Refs all under the 250-char cap — no condensing needed; SBR-BADGE-01 C30226 + WIP-FLT-05 C30502 = notes-only (local metadata, NOT pushed, per the ChangeList).

| # | Op | Internal ID | C-id | Link | What changed | HTTP | Re-GET verify |
|---|---|---|---|---|---|---|---|
| 163 | update_case | WIP-API-01 | C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 | Step + expected added: re-running the nightly capture for the SAME date replaces that date's rows — never duplicates (plan B1.2 idempotent re-run; WIP spec Story 11 silent); refs extended. | 200 | MATCH (2026-07-30 04:06:55Z) |
| 164 | update_case | SBR-STAT-02 | C30209 | https://shopview.testrail.io/index.php?/cases/view/30209 | Precondition added: seed the prepaid-zero-balance invoice via a customer DEPOSIT that fully covers the work (plan B6.2 — the bug-prone path a naive balance calc shows as "Partially Paid"). | 200 | MATCH (2026-07-30 04:06:57Z) |
| 165 | update_case | PV-CALC-07 | C30365 | https://shopview.testrail.io/index.php?/cases/view/30365 | Precondition + step + expected added: reversing the part's most recent sale re-anchors Last Sale to the previous remaining sale (or —) (plan B3.1, spec-silent); refs extended. | 200 | MATCH (2026-07-30 04:06:58Z) |
| 166 | update_case | SBC-API-02 | C30191 | https://shopview.testrail.io/index.php?/cases/view/30191 | Optional API step + expected added: a sort request naming a column the report does not offer is safely refused/ignored — never an error (plan A2 server sort whitelist); refs extended. | 200 | MATCH (2026-07-30 04:07:00Z) |
| 167 | update_case | IV-EXP-07 | C30593 | https://shopview.testrail.io/index.php?/cases/view/30593 | Title trimmed 128→83 chars: dropped "(exact cap value pending owner confirmation)" — the plan records 10,000 as the suite-wide cap locked by Chris 2026-07-21 (still VIU-confirm live). | 200 | MATCH (2026-07-30 04:07:01Z) |
| 168 | add_case | PV-EXP-11 | C38885 | https://shopview.testrail.io/index.php?/cases/view/38885 | NEW: an over-cap Parts Velocity export is refused with the too-large message; narrowing re-enables (SV-8646; plan A3/FR-F4 — PV spec silent on the cap, flagged to Chris Q3). Section 4335 PV — Exports. | 200 | MATCH (2026-07-30 04:07:03Z) |
| 169 | add_case | TU-EXP-09 | C38887 | https://shopview.testrail.io/index.php?/cases/view/38887 | NEW: same over-cap export guard for Technician Utilization (SV-8654; plan A3/FR-F4 — TU spec silent, flagged to Chris Q3). Section 4346 TU — Exports. | 200 | MATCH (2026-07-30 04:07:05Z) |
| 170 | add_case | WIP-CALC-10 | C38890 | https://shopview.testrail.io/index.php?/cases/view/38890 | NEW: a technician STILL clocked in counts toward Labor Earned, capped at the quote (SV-8660 S4-R15; plan B1.2 open-clock policy — regression guard, the old report dropped open clock records). Section 4354 WIP — Earned & Remaining. | 200 | MATCH (2026-07-30 04:07:07Z) |
| 171 | add_case | IV-DATE-09 | C38892 | https://shopview.testrail.io/index.php?/cases/view/38892 | NEW: a recorded day keeps its category/vendor names after a rename or delete; live view shows the new name (SV-8678 S11-R2; plan B4.1 denormalized names). Section 4368 IV — As-of Date & Snapshots. | 200 | MATCH (2026-07-30 04:07:08Z) |
| 172 | add_case | SBR-CALC-09 | C38894 | https://shopview.testrail.io/index.php?/cases/view/38894 | NEW: a clock-record edit AFTER invoicing updates Inv. Hrs; billed sell values stay put (SV-8626 §3 + S9-R2; plan Phase 4 FR-F7 clock-change rebuild; also guards SBC's shared values). Section 4314 SBR — Inv. Hrs & Calculations. | 200 | MATCH (2026-07-30 04:07:10Z) |

**Post-push state:** suite = **465 active** under group 4281 (460 prior + 5 new), all C-id'd; id-map 465/465 re-merged (0 blanks); unified import + 6 human-readable splits regenerated over 465 (82/110/68/59/77/69; header byte-identical to the other project imports; 0 VIU words, 0 flag words, 0 internal-id leaks, 29 API cases all in "— API" sections, no dup titles); coverage addenda ×6 appended. Tech-plan push authorization CONSUMED.

---

## COMPANION-VIDEO PUSH 2026-07-30 (user authorization 2026-07-30: "do update the test cases if you learn that the video is warranting for that")

**Scope: EXACTLY the chris-update-2026-07-29/ChangeList-companion-2026-07-30.md push queue (section A) — 7 update_case, 0 add, 0 delete. Result: 7/7 HTTP 200, 7/7 re-GET verified MATCH (title/preconds/steps/expected/refs), 0 failures. NOTHING else written — 0 section writes, NO run writes (R359 untouched). Live count under group 4281 after the push = 465 == id-map.**

Source: Chris Ward PRD companion video 2026-07-30 (Loom e4a3ad01912048c0bba88f1a02677004; transcript `chris-update-2026-07-29/companion-video-transcript-2026-07-30.md`; delta analysis `companion-video-deltas-2026-07-30.md` — 20 points: 3 FIRM / 10 CONFIRMATION / 1 PENDING-SPEC / 3 VISUAL-VIU-CONFIRM / 1 CROSS-SQUAD / 2 NO-IMPACT). Only the FIRM video-warranted changes were pushed; the soft/pending items (C15 Rep-label scope → question Q5; C20 snapshot-indicator soft ruling → SPEC-WATCH note) were NOT pushed. Executor: `chris-update-2026-07-29/exec_companion_push_2026-07-30.py`; machine result `testrail-execution-result-companion-2026-07-30.json`; pre-op live snapshots `chris-update-2026-07-29/pre-push-snapshot/C<cid>_<iid>.pre-companion-push-2026-07-30.json`; local pre-edit backups `chris-update-2026-07-29/backup/companion-2026-07-30/`.

| # | Op | Internal ID | C-id | Link | What changed | HTTP | Re-GET verify |
|---|---|---|---|---|---|---|---|
| 173 | update_case | SBC-NAV-01 | C30096 | https://shopview.testrail.io/index.php?/cases/view/30096 | Performance group + BELOW the four named anchors (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency) — new info, the SBC spec names no nav group (video C4 01:18–02:05); title re-worded. | 200 | MATCH (2026-07-30 09:37:29Z) |
| 174 | update_case | TU-NAV-01 | C30392 | https://shopview.testrail.io/index.php?/cases/view/30392 | The four anchor items NAMED in the below-placement expectation (video C4). | 200 | MATCH (2026-07-30 09:37:31Z) |
| 175 | update_case | SBR-NAV-01 | C30195 | https://shopview.testrail.io/index.php?/cases/view/30195 | "At the BOTTOM of the group" re-based to below-the-named-anchors; need not be literally last (video C4); title re-worded. | 200 | MATCH (2026-07-30 09:37:32Z) |
| 176 | update_case | WIP-TAB-01 | C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 | Below-the-named-anchors placement added to the Performance-group expectation (video C4). | 200 | MATCH (2026-07-30 09:37:34Z) |
| 177 | update_case | PV-NAV-01 | C30322 | https://shopview.testrail.io/index.php?/cases/view/30322 | "(the only Parts report in this release)" dropped — Inventory Value also under Parts; order of the two not fixed (video C2b 00:35–01:18; PV S1-R1 vs IV S1-R1 inconsistency flagged to SPEC-WATCH #11). | 200 | MATCH (2026-07-30 09:37:36Z) |
| 178 | update_case | SBR-WO-06 | C30315 | https://shopview.testrail.io/index.php?/cases/view/30315 | Customer-record row label → "Sales Representative" (full word; video C17 10:53–11:12 FIRM, supersedes spec S19-R7 verbatim '"Sales Rep" row'); title trimmed 130→74. | 200 | MATCH (2026-07-30 09:37:37Z) |
| 179 | update_case | SBR-WO-02 | C30311 | https://shopview.testrail.io/index.php?/cases/view/30311 | Tester-aid precondition: toggle reached via Settings → Staff → edit the staff member (video C14 09:17–09:41; exact toggle label to confirm live); title trimmed 124→64. | 200 | MATCH (2026-07-30 09:37:39Z) |

**Post-push state:** suite = **465 active** under group 4281 (tally unchanged — edits only); id-map 465/465 (0 blanks); unified import + 6 splits already regenerated over the edited bodies pre-push (header byte-identical; 0 VIU words, 0 flag words, 0 internal-id leaks, 29 API cases in API sections). 13 notes-only companion annotations local-only (notes are not a pushed field). Companion-video push authorization CONSUMED. Still awaited: Chris spec changelog (SPEC-WATCH deadline 2026-08-04, now incl. items #9–#12), Q1–Q5 answers, live VIU at the QA branch.
