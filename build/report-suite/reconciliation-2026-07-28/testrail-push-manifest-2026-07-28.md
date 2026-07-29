# Report Suite — TestRail push manifest (2026-07-28) — **EXECUTED 2026-07-28**

> **EXECUTED:** all 70 update_case + 1 add_case (SBC-EXP-16 = **C38856**) + 57 delete_case ran HTTP 200 and verified (re-GET MATCH / verified gone), 0 failures, 0 HELD groups. Live post-push count under group 4281 = **459**. Run R359: 515 → 458 tests (documented only, never written). Per-case audit: `testrail-execution-log-2026-07-28.md`.

**Authorization:** explicit user Rule-6 authorization 2026-07-28 ("Push ALL") — the full bundle: video-driven edits + SBC-EXP-16 add + SBC-EXP-13 retire + the 9 sense-check wording repairs + the 41-group/6-cut merge consolidation. Scope = TestRail **group 4281 (Reports Suite)** sections 4282–4376 ONLY; every touched case is inside C30096–C30610 (verified twice below) except the one NEW case. **NO run writes** — run R359 is documented (test count before/after) but never written to.

**Source of every update body:** the FINAL local case JSON in `build/report-suite/cases/` (video edits + repairs + merges already folded — one `update_case` per case, final body wins). Field mapping mirrors the established push (title, custom_preconds, custom_steps, custom_expected, refs = cleaned spec_ref). Two cases carry a CONDENSED refs override for TestRail's refs length cap (SBC-EXP-01, SBR-LOC-03 — full text stays in the local spec_ref/import References).

**Order of execution:** (0) live pre-push snapshot of every listed case + R359 count -> (1) update_case ×70 (each 200 + re-GET MATCH) -> (2) add_case ×1 (SBC-EXP-16, section 'SBC — Exports' under folder 4282, custom_atmstatus:3 + custom_automation_type:0) -> (3) delete_case ×57 (each verified gone by re-GET). Throttled; transient failures retried with backoff; persistent failures stop that item only and are reported.

**Counts:** update_case 70 | add_case 1 | delete_case 57. Final active suite after push: **459** (515 − 57 + 1).

## update_case (70)

| Internal ID | C-id | Link | Driving source |
|---|---|---|---|
| IV-EXP-09 | C30595 | https://shopview.testrail.io/index.php?/cases/view/30595 | merge survivor (MERGE-PLAN.md) |
| IV-FLT-02 | C30570 | https://shopview.testrail.io/index.php?/cases/view/30570 | merge survivor (MERGE-PLAN.md) |
| IV-LOC-01 | C30574 | https://shopview.testrail.io/index.php?/cases/view/30574 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| IV-LOC-04 | C30577 | https://shopview.testrail.io/index.php?/cases/view/30577 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| IV-NAV-06 | C30539 | https://shopview.testrail.io/index.php?/cases/view/30539 | merge survivor (MERGE-PLAN.md) |
| IV-PERS-04 | C30582 | https://shopview.testrail.io/index.php?/cases/view/30582 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| IV-SCOPE-01 | C30540 | https://shopview.testrail.io/index.php?/cases/view/30540 | merge survivor (MERGE-PLAN.md) |
| IV-TOT-01 | C30556 | https://shopview.testrail.io/index.php?/cases/view/30556 | merge survivor (MERGE-PLAN.md) |
| IV-TOT-02 | C30557 | https://shopview.testrail.io/index.php?/cases/view/30557 | merge survivor (MERGE-PLAN.md) |
| PV-API-01 | C30388 | https://shopview.testrail.io/index.php?/cases/view/30388 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| PV-API-02 | C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| PV-EXP-08 | C30382 | https://shopview.testrail.io/index.php?/cases/view/30382 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) + FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| PV-EXP-10 | C30384 | https://shopview.testrail.io/index.php?/cases/view/30384 | merge survivor (MERGE-PLAN.md) |
| PV-FILT-01 | C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) + merge survivor (MERGE-PLAN.md) |
| PV-FILT-09 | C30336 | https://shopview.testrail.io/index.php?/cases/view/30336 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| PV-FILT-10 | C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| PV-FILT-13 | C30340 | https://shopview.testrail.io/index.php?/cases/view/30340 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| PV-ROW-05 | C30345 | https://shopview.testrail.io/index.php?/cases/view/30345 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBC-COL-02 | C30157 | https://shopview.testrail.io/index.php?/cases/view/30157 | merge survivor (MERGE-PLAN.md) |
| SBC-CUST-03 | C30114 | https://shopview.testrail.io/index.php?/cases/view/30114 | merge survivor (MERGE-PLAN.md) |
| SBC-CUST-04 | C30115 | https://shopview.testrail.io/index.php?/cases/view/30115 | merge survivor (MERGE-PLAN.md) |
| SBC-EMPTY-01 | C30181 | https://shopview.testrail.io/index.php?/cases/view/30181 | merge survivor (MERGE-PLAN.md) |
| SBC-EXP-01 | C30159 | https://shopview.testrail.io/index.php?/cases/view/30159 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBC-EXP-02 | C30160 | https://shopview.testrail.io/index.php?/cases/view/30160 | merge survivor (MERGE-PLAN.md) |
| SBC-EXP-06 | C30164 | https://shopview.testrail.io/index.php?/cases/view/30164 | merge survivor (MERGE-PLAN.md) |
| SBC-EXP-08 | C30166 | https://shopview.testrail.io/index.php?/cases/view/30166 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| SBC-EXP-14 | C30172 | https://shopview.testrail.io/index.php?/cases/view/30172 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBC-LBL-01 | C30134 | https://shopview.testrail.io/index.php?/cases/view/30134 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) + merge survivor (MERGE-PLAN.md) |
| SBC-LBL-04 | C30137 | https://shopview.testrail.io/index.php?/cases/view/30137 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBC-LOC-03 | C30111 | https://shopview.testrail.io/index.php?/cases/view/30111 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBC-NAV-01 | C30096 | https://shopview.testrail.io/index.php?/cases/view/30096 | merge survivor (MERGE-PLAN.md) |
| SBC-PERM-04 | C30101 | https://shopview.testrail.io/index.php?/cases/view/30101 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| SBC-PERS-05 | C30178 | https://shopview.testrail.io/index.php?/cases/view/30178 | merge survivor (MERGE-PLAN.md) |
| SBC-SORT-01 | C30142 | https://shopview.testrail.io/index.php?/cases/view/30142 | merge survivor (MERGE-PLAN.md) |
| SBC-TREE-03 | C30123 | https://shopview.testrail.io/index.php?/cases/view/30123 | merge survivor (MERGE-PLAN.md) |
| SBC-TREE-09 | C30129 | https://shopview.testrail.io/index.php?/cases/view/30129 | merge survivor (MERGE-PLAN.md) |
| SBC-TYPE-02 | C30107 | https://shopview.testrail.io/index.php?/cases/view/30107 | merge survivor (MERGE-PLAN.md) |
| SBR-BADGE-01 | C30226 | https://shopview.testrail.io/index.php?/cases/view/30226 | merge survivor (MERGE-PLAN.md) |
| SBR-CALC-02 | C30230 | https://shopview.testrail.io/index.php?/cases/view/30230 | merge survivor (MERGE-PLAN.md) |
| SBR-CALC-08 | C30236 | https://shopview.testrail.io/index.php?/cases/view/30236 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| SBR-COL-01 | C30265 | https://shopview.testrail.io/index.php?/cases/view/30265 | merge survivor (MERGE-PLAN.md) |
| SBR-DEACT-07 | C30258 | https://shopview.testrail.io/index.php?/cases/view/30258 | merge survivor (MERGE-PLAN.md) |
| SBR-EXP-08 | C30283 | https://shopview.testrail.io/index.php?/cases/view/30283 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| SBR-LINK-01 | C30247 | https://shopview.testrail.io/index.php?/cases/view/30247 | merge survivor (MERGE-PLAN.md) |
| SBR-LOC-03 | C30215 | https://shopview.testrail.io/index.php?/cases/view/30215 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBR-LOC-04 | C30216 | https://shopview.testrail.io/index.php?/cases/view/30216 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| SBR-NAV-01 | C30195 | https://shopview.testrail.io/index.php?/cases/view/30195 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) + merge survivor (MERGE-PLAN.md) |
| SBR-PERS-04 | C30274 | https://shopview.testrail.io/index.php?/cases/view/30274 | merge survivor (MERGE-PLAN.md) |
| SBR-ROW-02 | C30218 | https://shopview.testrail.io/index.php?/cases/view/30218 | merge survivor (MERGE-PLAN.md) |
| SBR-STAT-04 | C30211 | https://shopview.testrail.io/index.php?/cases/view/30211 | merge survivor (MERGE-PLAN.md) |
| SBR-STATE-01 | C30298 | https://shopview.testrail.io/index.php?/cases/view/30298 | merge survivor (MERGE-PLAN.md) |
| SBR-TOT-01 | C30237 | https://shopview.testrail.io/index.php?/cases/view/30237 | merge survivor (MERGE-PLAN.md) |
| SBR-TYPE-02 | C30206 | https://shopview.testrail.io/index.php?/cases/view/30206 | merge survivor (MERGE-PLAN.md) |
| SBR-UNAS-02 | C30262 | https://shopview.testrail.io/index.php?/cases/view/30262 | merge survivor (MERGE-PLAN.md) |
| TU-HRS-02 | C30401 | https://shopview.testrail.io/index.php?/cases/view/30401 | merge survivor (MERGE-PLAN.md) |
| TU-LINK-03 | C30430 | https://shopview.testrail.io/index.php?/cases/view/30430 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| TU-LOC-01 | C30442 | https://shopview.testrail.io/index.php?/cases/view/30442 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| TU-LOC-05 | C30446 | https://shopview.testrail.io/index.php?/cases/view/30446 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| TU-NAV-01 | C30392 | https://shopview.testrail.io/index.php?/cases/view/30392 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| TU-NAV-08 | C30399 | https://shopview.testrail.io/index.php?/cases/view/30399 | merge survivor (MERGE-PLAN.md) |
| TU-SUM-02 | C30415 | https://shopview.testrail.io/index.php?/cases/view/30415 | FIX-WORDING repair (SENSE-CHECK-2026-07-28.md) |
| WIP-COL-05 | C30470 | https://shopview.testrail.io/index.php?/cases/view/30470 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| WIP-EXP-07 | C30516 | https://shopview.testrail.io/index.php?/cases/view/30516 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| WIP-FLT-03 | C30500 | https://shopview.testrail.io/index.php?/cases/view/30500 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| WIP-FLT-08 | C30505 | https://shopview.testrail.io/index.php?/cases/view/30505 | merge survivor (MERGE-PLAN.md) |
| WIP-PLACE-01 | C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 | merge survivor (MERGE-PLAN.md) |
| WIP-PLACE-03 | C30464 | https://shopview.testrail.io/index.php?/cases/view/30464 | merge survivor (MERGE-PLAN.md) |
| WIP-SCOPE-05 | C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 | merge survivor (MERGE-PLAN.md) |
| WIP-SORT-03 | C30485 | https://shopview.testrail.io/index.php?/cases/view/30485 | video-promotion edit (video-promotion-edit-log-2026-07-28.md) |
| WIP-TAB-01 | C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 | merge survivor (MERGE-PLAN.md) |

## add_case (1)

| Internal ID | C-id | Target section | Driving source |
|---|---|---|---|
| SBC-EXP-16 | new — no C-ID yet | 'SBC — Exports' (under folder 4282 Sales By Customer Report) | video P21 compressed download (edit log #12) |

## delete_case (57) — every ID verified against the id-map TWICE; all inside C30096–C30610

| Internal ID | C-id | Link | Why |
|---|---|---|---|
| SBC-NAV-02 | C30097 | https://shopview.testrail.io/index.php?/cases/view/30097 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-DATE-02 | C30103 | https://shopview.testrail.io/index.php?/cases/view/30103 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-LOC-02 | C30110 | https://shopview.testrail.io/index.php?/cases/view/30110 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-TYPE-01 | C30106 | https://shopview.testrail.io/index.php?/cases/view/30106 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-TYPE-03 | C30108 | https://shopview.testrail.io/index.php?/cases/view/30108 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-CUST-08 | C30119 | https://shopview.testrail.io/index.php?/cases/view/30119 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-CUST-07 | C30118 | https://shopview.testrail.io/index.php?/cases/view/30118 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-TREE-07 | C30127 | https://shopview.testrail.io/index.php?/cases/view/30127 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-LBL-02 | C30135 | https://shopview.testrail.io/index.php?/cases/view/30135 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-LBL-03 | C30136 | https://shopview.testrail.io/index.php?/cases/view/30136 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-SORT-05 | C30146 | https://shopview.testrail.io/index.php?/cases/view/30146 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-SORT-06 | C30147 | https://shopview.testrail.io/index.php?/cases/view/30147 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-COL-03 | C30158 | https://shopview.testrail.io/index.php?/cases/view/30158 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-EXP-07 | C30165 | https://shopview.testrail.io/index.php?/cases/view/30165 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-EXP-12 | C30170 | https://shopview.testrail.io/index.php?/cases/view/30170 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-EMPTY-03 | C30183 | https://shopview.testrail.io/index.php?/cases/view/30183 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-NAV-02 | C30196 | https://shopview.testrail.io/index.php?/cases/view/30196 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-DATE-03 | C30203 | https://shopview.testrail.io/index.php?/cases/view/30203 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-LOC-02 | C30214 | https://shopview.testrail.io/index.php?/cases/view/30214 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-TYPE-01 | C30205 | https://shopview.testrail.io/index.php?/cases/view/30205 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-TYPE-03 | C30207 | https://shopview.testrail.io/index.php?/cases/view/30207 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-STAT-03 | C30210 | https://shopview.testrail.io/index.php?/cases/view/30210 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-ROW-04 | C30220 | https://shopview.testrail.io/index.php?/cases/view/30220 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-BADGE-03 | C30228 | https://shopview.testrail.io/index.php?/cases/view/30228 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-CALC-04 | C30232 | https://shopview.testrail.io/index.php?/cases/view/30232 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-TOT-04 | C30240 | https://shopview.testrail.io/index.php?/cases/view/30240 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-LINK-02 | C30248 | https://shopview.testrail.io/index.php?/cases/view/30248 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-DEACT-01 | C30252 | https://shopview.testrail.io/index.php?/cases/view/30252 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-UNAS-03 | C30263 | https://shopview.testrail.io/index.php?/cases/view/30263 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-COL-02 | C30266 | https://shopview.testrail.io/index.php?/cases/view/30266 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-COL-06 | C30270 | https://shopview.testrail.io/index.php?/cases/view/30270 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBR-STATE-02 | C30299 | https://shopview.testrail.io/index.php?/cases/view/30299 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| PV-FILT-02 | C30329 | https://shopview.testrail.io/index.php?/cases/view/30329 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| PV-EXP-09 | C30383 | https://shopview.testrail.io/index.php?/cases/view/30383 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| TU-HRS-01 | C30400 | https://shopview.testrail.io/index.php?/cases/view/30400 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| TU-TECH-05 | C30427 | https://shopview.testrail.io/index.php?/cases/view/30427 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-TAB-04 | C30454 | https://shopview.testrail.io/index.php?/cases/view/30454 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-SCOPE-06 | C30461 | https://shopview.testrail.io/index.php?/cases/view/30461 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-PLACE-02 | C30463 | https://shopview.testrail.io/index.php?/cases/view/30463 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-PLACE-04 | C30465 | https://shopview.testrail.io/index.php?/cases/view/30465 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-SUM-06 | C30492 | https://shopview.testrail.io/index.php?/cases/view/30492 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| WIP-TOT-03 | C30496 | https://shopview.testrail.io/index.php?/cases/view/30496 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-NAV-04 | C30537 | https://shopview.testrail.io/index.php?/cases/view/30537 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-DATE-07 | C30567 | https://shopview.testrail.io/index.php?/cases/view/30567 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-LOC-05 | C30578 | https://shopview.testrail.io/index.php?/cases/view/30578 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-SCOPE-03 | C30542 | https://shopview.testrail.io/index.php?/cases/view/30542 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-SCOPE-04 | C30543 | https://shopview.testrail.io/index.php?/cases/view/30543 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-TOT-04 | C30559 | https://shopview.testrail.io/index.php?/cases/view/30559 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-EXP-08 | C30594 | https://shopview.testrail.io/index.php?/cases/view/30594 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| IV-VIS-03 | C30598 | https://shopview.testrail.io/index.php?/cases/view/30598 | merged-away member (MERGE-PLAN.md; body kept locally, Retired) |
| SBC-SORT-07 | C30148 | https://shopview.testrail.io/index.php?/cases/view/30148 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| SBR-SORT-06 | C30246 | https://shopview.testrail.io/index.php?/cases/view/30246 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| SBR-EXP-09 | C30284 | https://shopview.testrail.io/index.php?/cases/view/30284 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| PV-COL-07 | C30357 | https://shopview.testrail.io/index.php?/cases/view/30357 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| WIP-TOT-04 | C30497 | https://shopview.testrail.io/index.php?/cases/view/30497 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| IV-TOT-05 | C30560 | https://shopview.testrail.io/index.php?/cases/view/30560 | outright CUT (usefulness+sense audit; body kept locally, Retired) |
| SBC-EXP-13 | C30171 | https://shopview.testrail.io/index.php?/cases/view/30171 | Print removed from SBC (video P25) — retire |

## Guardrails

- NOTHING outside group 4281 / range C30096–C30610 is touched; the only new object is SBC-EXP-16 inside folder 4282.
- Run R359 (and every other run): READ-ONLY. Deleting cases removes their tests from R359 — the before/after test count is documented in the execution log.
- Live pre-push snapshot = build/report-suite/testrail-pre-push-snapshot-2026-07-28/ (authoritative recovery set).
- Local pre-edit bodies = consolidation-backup-2026-07-28/ + video-promotion-backup-2026-07-28/.
- No secrets in the repo; creds from /tmp env only.
