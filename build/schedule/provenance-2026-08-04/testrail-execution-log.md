# Schedule — Standing Rule 54 provenance retrofit: TestRail EXECUTION LOG

**Date:** 2026-08-04 · **Authorised by the QA lead** · **`update_case` ONLY** — 0 `add_case`, 0 `delete_case`, 0 section move, 0 run write.

**Group 4254** · **165 distinct cases** · **165 successful operations, every one HTTP 200 + byte-verified MATCH** · **0 refused by a guard** (recorded below, not hidden).

## Verification method (Standing Rule 50 — EXHAUSTIVE then EXACT)

Per operation, in order:

1. **Pre-write snapshot of EVERY field**, taken read-only before the run (`snapshots/pre-write-live-cases-4254.json`).
2. **Re-GET immediately before writing**, proving the live case still matches that snapshot byte-for-byte — a drifted case **STOPS the batch**.
3. `update_case` with **only** the intended fields.
4. **Re-GET and compare field by field:** every intended field byte-equal to the intended value; **every field we did NOT intend to change proven byte-identical** to its pre-write snapshot; every field outside the snapshot byte-identical to the pre-write live read. **28 fields compared per operation** — this is the half a "200 OK" can never tell you.
5. A mismatch means **the write FAILED** → stop, dump both byte sequences, never retry blindly.

**Declared normalisation (the only one, recorded in `APP-ACTIONS-PLAYBOOK` §J):** TestRail's `refs` splits on commas, trims each entry and rejoins with a bare comma, and rejects any single entry over 248 characters with HTTP 400 `Field :refs does not match the required pattern.` So `refs` is compared under `','.join(p.strip() for p in s.split(','))` and that is asserted explicitly, not waved through. Applied on **0** operations.

**Rule 38:** the executor hard-refuses any case with `created_by != 3`. Group 4254 held **0 foreign cases** before and after — verified by a fresh live read.

## What was written

| Fields written | Operations |
|---|---|
| `custom_expected` | 164 |
| `custom_expected`, `custom_preconds` | 1 |

## Provenance variant per case (Rule 54 honesty clause)

| Variant | Cases | What the sentence says |
|---|---|---|
| `plain` | 150 | the specification supports the expectation as written |
| `po_ruling` | 5 | a later product owner decision overrides the specification text (names the date) |
| `no_anchor` | 5 | **no numbered requirement covers this at all** — stated in words, never invented (Rule 12) |
| `spec_two_ways` | 3 | the specification states the point two different ways and **no ruling exists yet** |
| `techplan_detail` | 2 | the specification covers the area; the specific limits are the engineering technical plan's |

Spec version named on all 165 cases: **23** — a single generator constant, not 165 hand-typed strings. Epic named: **SV-8685**.

## Run 357 — verified untouched (Rules 34 / 47 / 50)

No run write was made, and that claim is backed by evidence rather than asserted:

| Check | Before | After | Verdict |
|---|---|---|---|
| tests in the run | 165 | 165 | case_id sets **equal in BOTH directions** |
| result records | 429 | 429 | **every prior result verified present BY ID**, not by count |
| `include_all` | false | false | unchanged |
| status counts | unchanged | unchanged | passed / failed / blocked / untested / retest all identical |

The run already contained every active case, so **no sync was required** — this pass was `update_case` only, which never changes a run's selection.

## Per-operation log

| # | Internal ID | Case | HTTP | Fields written | Fields compared | Verification |
|---|---|---|---|---|---|---|
| 1 | SCH-NAV-01 | [C29925](https://shopview.testrail.io/index.php?/cases/view/29925) | 200 | `custom_expected` | 28 | **MATCH** |
| 2 | SCH-NAV-03 | [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | 200 | `custom_expected` | 28 | **MATCH** |
| 3 | SCH-NAV-04 | [C29928](https://shopview.testrail.io/index.php?/cases/view/29928) | 200 | `custom_expected` | 28 | **MATCH** |
| 4 | SCH-NAV-05 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | `custom_expected` | 28 | **MATCH** |
| 5 | SCH-NAV-06 | [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | 200 | `custom_expected` | 28 | **MATCH** |
| 6 | SCH-NAV-07 | [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) | 200 | `custom_expected` | 28 | **MATCH** |
| 7 | SCH-MCAL-01 | [C29932](https://shopview.testrail.io/index.php?/cases/view/29932) | 200 | `custom_expected` | 28 | **MATCH** |
| 8 | SCH-MCAL-02 | [C29933](https://shopview.testrail.io/index.php?/cases/view/29933) | 200 | `custom_expected` | 28 | **MATCH** |
| 9 | SCH-MCAL-03 | [C29934](https://shopview.testrail.io/index.php?/cases/view/29934) | 200 | `custom_expected` | 28 | **MATCH** |
| 10 | SCH-MCAL-04 | [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | 200 | `custom_expected` | 28 | **MATCH** |
| 11 | SCH-WOL-01 | [C29936](https://shopview.testrail.io/index.php?/cases/view/29936) | 200 | `custom_expected` | 28 | **MATCH** |
| 12 | SCH-WOL-02 | [C29937](https://shopview.testrail.io/index.php?/cases/view/29937) | 200 | `custom_expected` | 28 | **MATCH** |
| 13 | SCH-WOL-04 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | 200 | `custom_expected` | 28 | **MATCH** |
| 14 | SCH-WOL-05 | [C29940](https://shopview.testrail.io/index.php?/cases/view/29940) | 200 | `custom_expected` | 28 | **MATCH** |
| 15 | SCH-WOL-06 | [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | 200 | `custom_expected` | 28 | **MATCH** |
| 16 | SCH-FILT-01 | [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) | 200 | `custom_expected` | 28 | **MATCH** |
| 17 | SCH-FILT-02 | [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | 200 | `custom_expected` | 28 | **MATCH** |
| 18 | SCH-FILT-03 | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | 200 | `custom_expected` | 28 | **MATCH** |
| 19 | SCH-FILT-04 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | 200 | `custom_expected` | 28 | **MATCH** |
| 20 | SCH-FILT-05 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | 200 | `custom_expected` | 28 | **MATCH** |
| 21 | SCH-FILT-06 | [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) | 200 | `custom_expected` | 28 | **MATCH** |
| 22 | SCH-LINE-01 | [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) | 200 | `custom_expected` | 28 | **MATCH** |
| 23 | SCH-LINE-03 | [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | 200 | `custom_expected` | 28 | **MATCH** |
| 24 | SCH-LINE-04 | [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | 200 | `custom_expected` | 28 | **MATCH** |
| 25 | SCH-LINE-05 | [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | 200 | `custom_expected` | 28 | **MATCH** |
| 26 | SCH-LINE-06 | [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | 200 | `custom_expected` | 28 | **MATCH** |
| 27 | SCH-LINE-07 | [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | 200 | `custom_expected` | 28 | **MATCH** |
| 28 | SCH-DND-01 | [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | 200 | `custom_expected` | 28 | **MATCH** |
| 29 | SCH-DND-02 | [C29956](https://shopview.testrail.io/index.php?/cases/view/29956) | 200 | `custom_expected` | 28 | **MATCH** |
| 30 | SCH-DND-03 | [C29957](https://shopview.testrail.io/index.php?/cases/view/29957) | 200 | `custom_expected` | 28 | **MATCH** |
| 31 | SCH-DND-04 | [C29958](https://shopview.testrail.io/index.php?/cases/view/29958) | 200 | `custom_expected` | 28 | **MATCH** |
| 32 | SCH-DND-05 | [C29959](https://shopview.testrail.io/index.php?/cases/view/29959) | 200 | `custom_expected` | 28 | **MATCH** |
| 33 | SCH-DND-06 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | 200 | `custom_expected` | 28 | **MATCH** |
| 34 | SCH-DND-07 | [C29961](https://shopview.testrail.io/index.php?/cases/view/29961) | 200 | `custom_expected` | 28 | **MATCH** |
| 35 | SCH-DND-08 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | 200 | `custom_expected` | 28 | **MATCH** |
| 36 | SCH-SCOPE-01 | [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) | 200 | `custom_expected` | 28 | **MATCH** |
| 37 | SCH-SCOPE-02 | [C29964](https://shopview.testrail.io/index.php?/cases/view/29964) | 200 | `custom_expected` | 28 | **MATCH** |
| 38 | SCH-SCOPE-03 | [C29965](https://shopview.testrail.io/index.php?/cases/view/29965) | 200 | `custom_expected` | 28 | **MATCH** |
| 39 | SCH-SCOPE-05 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | 200 | `custom_expected` | 28 | **MATCH** |
| 40 | SCH-START-01 | [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) | 200 | `custom_expected` | 28 | **MATCH** |
| 41 | SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | 200 | `custom_expected` | 28 | **MATCH** |
| 42 | SCH-START-03 | [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) | 200 | `custom_expected` | 28 | **MATCH** |
| 43 | SCH-START-04 | [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) | 200 | `custom_expected` | 28 | **MATCH** |
| 44 | SCH-START-05 | [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) | 200 | `custom_expected` | 28 | **MATCH** |
| 45 | SCH-START-06 | [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) | 200 | `custom_expected` | 28 | **MATCH** |
| 46 | SCH-START-07 | [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | 200 | `custom_expected` | 28 | **MATCH** |
| 47 | SCH-SPREAD-02 | [C29978](https://shopview.testrail.io/index.php?/cases/view/29978) | 200 | `custom_expected` | 28 | **MATCH** |
| 48 | SCH-SPREAD-03 | [C29979](https://shopview.testrail.io/index.php?/cases/view/29979) | 200 | `custom_expected` | 28 | **MATCH** |
| 49 | SCH-SPREAD-04 | [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) | 200 | `custom_expected` | 28 | **MATCH** |
| 50 | SCH-SPREAD-05 | [C29981](https://shopview.testrail.io/index.php?/cases/view/29981) | 200 | `custom_expected` | 28 | **MATCH** |
| 51 | SCH-SPREAD-06 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | 200 | `custom_expected` | 28 | **MATCH** |
| 52 | SCH-SPREAD-07 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | 200 | `custom_expected` | 28 | **MATCH** |
| 53 | SCH-SPREAD-08 | [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | 200 | `custom_expected` | 28 | **MATCH** |
| 54 | SCH-SPREAD-09 | [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | 200 | `custom_expected` | 28 | **MATCH** |
| 55 | SCH-SPREAD-10 | [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) | 200 | `custom_expected` | 28 | **MATCH** |
| 56 | SCH-SER-01 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | 200 | `custom_expected` | 28 | **MATCH** |
| 57 | SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | 200 | `custom_expected` | 28 | **MATCH** |
| 58 | SCH-SER-03 | [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | 200 | `custom_expected` | 28 | **MATCH** |
| 59 | SCH-SER-04 | [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | 200 | `custom_expected` | 28 | **MATCH** |
| 60 | SCH-BLOCK-01 | [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | 200 | `custom_expected` | 28 | **MATCH** |
| 61 | SCH-BLOCK-02 | [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | 200 | `custom_expected` | 28 | **MATCH** |
| 62 | SCH-BLOCK-05 | [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | 200 | `custom_expected` | 28 | **MATCH** |
| 63 | SCH-LANE-01 | [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | 200 | `custom_expected` | 28 | **MATCH** |
| 64 | SCH-LANE-02 | [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | 200 | `custom_expected` | 28 | **MATCH** |
| 65 | SCH-LANE-03 | [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | 200 | `custom_expected` | 28 | **MATCH** |
| 66 | SCH-LANE-04 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | 200 | `custom_expected` | 28 | **MATCH** |
| 67 | SCH-DAY-01 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | 200 | `custom_expected` | 28 | **MATCH** |
| 68 | SCH-DAY-03 | [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | 200 | `custom_expected` | 28 | **MATCH** |
| 69 | SCH-DAY-04 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | 200 | `custom_expected` | 28 | **MATCH** |
| 70 | SCH-DAY-05 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | 200 | `custom_expected` | 28 | **MATCH** |
| 71 | SCH-DAY-06 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | 200 | `custom_expected` | 28 | **MATCH** |
| 72 | SCH-MODAL-01 | [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | 200 | `custom_expected` | 28 | **MATCH** |
| 73 | SCH-MODAL-02 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | 200 | `custom_expected` | 28 | **MATCH** |
| 74 | SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | 200 | `custom_expected` | 28 | **MATCH** |
| 75 | SCH-MODAL-04 | [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | 200 | `custom_expected` | 28 | **MATCH** |
| 76 | SCH-MODAL-05 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | 200 | `custom_expected` | 28 | **MATCH** |
| 77 | SCH-MODAL-06 | [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | 200 | `custom_expected` | 28 | **MATCH** |
| 78 | SCH-MODAL-07 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | 200 | `custom_expected` | 28 | **MATCH** |
| 79 | SCH-MODAL-08 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | 200 | `custom_expected` | 28 | **MATCH** |
| 80 | SCH-EVT-01 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | 200 | `custom_expected` | 28 | **MATCH** |
| 81 | SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | 200 | `custom_expected` | 28 | **MATCH** |
| 82 | SCH-EVT-03 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | 200 | `custom_expected` | 28 | **MATCH** |
| 83 | SCH-EVT-05 | [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | 200 | `custom_expected` | 28 | **MATCH** |
| 84 | SCH-EVT-06 | [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | 200 | `custom_expected` | 28 | **MATCH** |
| 85 | SCH-EVT-07 | [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | 200 | `custom_expected` | 28 | **MATCH** |
| 86 | SCH-CONF-01 | [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) | 200 | `custom_expected` | 28 | **MATCH** |
| 87 | SCH-CONF-02 | [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) | 200 | `custom_expected` | 28 | **MATCH** |
| 88 | SCH-CONF-03 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | 200 | `custom_expected` | 28 | **MATCH** |
| 89 | SCH-CONF-05 | [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | 200 | `custom_expected` | 28 | **MATCH** |
| 90 | SCH-CONF-06 | [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | 200 | `custom_expected` | 28 | **MATCH** |
| 91 | SCH-CONF-07 | [C30029](https://shopview.testrail.io/index.php?/cases/view/30029) | 200 | `custom_expected` | 28 | **MATCH** |
| 92 | SCH-CAP-01 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | 200 | `custom_expected` | 28 | **MATCH** |
| 93 | SCH-CAP-02 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | 200 | `custom_expected` | 28 | **MATCH** |
| 94 | SCH-CAP-03 | [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | 200 | `custom_expected` | 28 | **MATCH** |
| 95 | SCH-CAP-04 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | 200 | `custom_expected` | 28 | **MATCH** |
| 96 | SCH-TIP-01 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | 200 | `custom_expected` | 28 | **MATCH** |
| 97 | SCH-TIP-02 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | 200 | `custom_expected` | 28 | **MATCH** |
| 98 | SCH-TIP-03 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | 200 | `custom_expected` | 28 | **MATCH** |
| 99 | SCH-TIP-04 | [C30037](https://shopview.testrail.io/index.php?/cases/view/30037) | 200 | `custom_expected` | 28 | **MATCH** |
| 100 | SCH-TIP-05 | [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | 200 | `custom_expected` | 28 | **MATCH** |
| 101 | SCH-TOOL-01 | [C30039](https://shopview.testrail.io/index.php?/cases/view/30039) | 200 | `custom_expected` | 28 | **MATCH** |
| 102 | SCH-TOOL-02 | [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | 200 | `custom_expected` | 28 | **MATCH** |
| 103 | SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | 200 | `custom_expected` | 28 | **MATCH** |
| 104 | SCH-VIEW-01 | [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | 200 | `custom_expected` | 28 | **MATCH** |
| 105 | SCH-VIEW-02 | [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | 200 | `custom_expected` | 28 | **MATCH** |
| 106 | SCH-VIEW-03 | [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | 200 | `custom_expected` | 28 | **MATCH** |
| 107 | SCH-VIEW-04 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | 200 | `custom_expected` | 28 | **MATCH** |
| 108 | SCH-VIEW-05 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | 200 | `custom_expected` | 28 | **MATCH** |
| 109 | SCH-VIEW-06 | [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | 200 | `custom_expected` | 28 | **MATCH** |
| 110 | SCH-VIEW-09 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | 200 | `custom_expected` | 28 | **MATCH** |
| 111 | SCH-VIEW-10 | [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | 200 | `custom_expected` | 28 | **MATCH** |
| 112 | SCH-REAS-01 | [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | 200 | `custom_expected` | 28 | **MATCH** |
| 113 | SCH-REAS-03 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | 200 | `custom_expected` | 28 | **MATCH** |
| 114 | SCH-DEL-01 | [C30057](https://shopview.testrail.io/index.php?/cases/view/30057) | 200 | `custom_expected` | 28 | **MATCH** |
| 115 | SCH-DEL-02 | [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | 200 | `custom_expected` | 28 | **MATCH** |
| 116 | SCH-DEL-03 | [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | 200 | `custom_expected` | 28 | **MATCH** |
| 117 | SCH-DEL-04 | [C30060](https://shopview.testrail.io/index.php?/cases/view/30060) | 200 | `custom_expected` | 28 | **MATCH** |
| 118 | SCH-DEL-05 | [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | 200 | `custom_expected` | 28 | **MATCH** |
| 119 | SCH-DEL-06 | [C30062](https://shopview.testrail.io/index.php?/cases/view/30062) | 200 | `custom_expected` | 28 | **MATCH** |
| 120 | SCH-DEL-08 | [C30064](https://shopview.testrail.io/index.php?/cases/view/30064) | 200 | `custom_expected` | 28 | **MATCH** |
| 121 | SCH-DEL-09 | [C30065](https://shopview.testrail.io/index.php?/cases/view/30065) | 200 | `custom_expected` | 28 | **MATCH** |
| 122 | SCH-KEY-01 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | 200 | `custom_expected` | 28 | **MATCH** |
| 123 | SCH-KEY-03 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | 200 | `custom_expected` | 28 | **MATCH** |
| 124 | SCH-KEY-05 | [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | 200 | `custom_expected` | 28 | **MATCH** |
| 125 | SCH-COLOR-01 | [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | 200 | `custom_expected` | 28 | **MATCH** |
| 126 | SCH-COLOR-02 | [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | 200 | `custom_expected` | 28 | **MATCH** |
| 127 | SCH-COLOR-03 | [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | 200 | `custom_expected` | 28 | **MATCH** |
| 128 | SCH-PERM-01 | [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | 200 | `custom_expected` | 28 | **MATCH** |
| 129 | SCH-PERM-02 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | 200 | `custom_expected` | 28 | **MATCH** |
| 130 | SCH-PERM-03 | [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | 200 | `custom_expected` | 28 | **MATCH** |
| 131 | SCH-PERM-04 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | 200 | `custom_expected` | 28 | **MATCH** |
| 132 | SCH-PERM-05 | [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | 200 | `custom_expected` | 28 | **MATCH** |
| 133 | SCH-PERM-06 | [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | 200 | `custom_expected` | 28 | **MATCH** |
| 134 | SCH-PERM-07 | [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) | 200 | `custom_expected` | 28 | **MATCH** |
| 135 | SCH-PERM-08 | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | 200 | `custom_expected` | 28 | **MATCH** |
| 136 | SCH-PERM-09 | [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | 200 | `custom_expected` | 28 | **MATCH** |
| 137 | SCH-PERM-10 | [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) | 200 | `custom_expected` | 28 | **MATCH** |
| 138 | SCH-PERM-11 | [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | 200 | `custom_expected` | 28 | **MATCH** |
| 139 | SCH-EDGE-02 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | 200 | `custom_expected` | 28 | **MATCH** |
| 140 | SCH-EDGE-03 | [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | 200 | `custom_expected` | 28 | **MATCH** |
| 141 | SCH-EDGE-04 | [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) | 200 | `custom_expected` | 28 | **MATCH** |
| 142 | SCH-EDGE-05 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | 200 | `custom_expected` | 28 | **MATCH** |
| 143 | SCH-EDGE-06 | [C30090](https://shopview.testrail.io/index.php?/cases/view/30090) | 200 | `custom_expected` | 28 | **MATCH** |
| 144 | SCH-PERM-12 | [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | 200 | `custom_expected` | 28 | **MATCH** |
| 145 | SCH-EVT-08 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | 200 | `custom_expected` | 28 | **MATCH** |
| 146 | SCH-HRS-02 | [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | 200 | `custom_expected` | 28 | **MATCH** |
| 147 | SCH-HRS-03 | [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | 200 | `custom_expected` | 28 | **MATCH** |
| 148 | SCH-HRS-04 | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | 200 | `custom_expected, custom_preconds` | 28 | **MATCH** |
| 149 | SCH-HRS-05 | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 200 | `custom_expected` | 28 | **MATCH** |
| 150 | SCH-HRS-06 | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | 200 | `custom_expected` | 28 | **MATCH** |
| 151 | SCH-REAS-06 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | 200 | `custom_expected` | 28 | **MATCH** |
| 152 | SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | 200 | `custom_expected` | 28 | **MATCH** |
| 153 | SCH-DEL-10 | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | 200 | `custom_expected` | 28 | **MATCH** |
| 154 | SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | 200 | `custom_expected` | 28 | **MATCH** |
| 155 | SCH-EDGE-08 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | 200 | `custom_expected` | 28 | **MATCH** |
| 156 | SCH-REG-01 | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | 200 | `custom_expected` | 28 | **MATCH** |
| 157 | SCH-REG-02 | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | 200 | `custom_expected` | 28 | **MATCH** |
| 158 | SCH-REG-03 | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | 200 | `custom_expected` | 28 | **MATCH** |
| 159 | SCH-REG-04 | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | 200 | `custom_expected` | 28 | **MATCH** |
| 160 | SCH-REG-05 | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | 200 | `custom_expected` | 28 | **MATCH** |
| 161 | SCH-API-01 | [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | 200 | `custom_expected` | 28 | **MATCH** |
| 162 | SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | 200 | `custom_expected` | 28 | **MATCH** |
| 163 | SCH-API-03 | [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | 200 | `custom_expected` | 28 | **MATCH** |
| 164 | SCH-API-04 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | 200 | `custom_expected` | 28 | **MATCH** |
| 165 | SCH-PERM-13 | [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | 200 | `custom_expected` | 28 | **MATCH** |
