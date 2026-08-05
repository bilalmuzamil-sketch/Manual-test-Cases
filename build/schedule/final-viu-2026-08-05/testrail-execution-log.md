# Schedule — TestRail execution log, 5 August 2026

## Summary

| | |
|---|---|
| Operations | **165 × `update_case`** |
| HTTP 200 | **165 of 165** |
| Byte-verified MATCH | **165 of 165** |
| Fields compared per op | **30** (every field `get_case` returns, `updated_on` excepted as server-set) |
| Mismatches | **0** |
| `add_case` / `delete_case` / section ops | **0 / 0 / 0** |
| Run writes | **0** |

**Declared normalisation applied (Standing Rule 50):** `refs` is compared under
`','.join(p.strip() for p in s.split(','))`, because TestRail splits on commas, trims each entry and
rejoins with a bare comma. No `refs` value was written by this pass; it is verified only to prove it
was not collaterally changed.

**Every field the pass did not intend to change was proven byte-identical to its pre-write snapshot**
(`/tmp` snapshot committed as `evidence/write-plan.json` alongside this log). On a mismatch the
executor stops the batch rather than retrying — it never had to.

## What each write carried

One write per case, all intents combined into one final text (never two writes to one case):

| Intent | Cases |
|---|---:|
| Provenance line reworded so the DOCUMENTED source is credited, build named only as what it was checked against | **165** |
| Automation marker appended at the very end, after the provenance line, blank line before | **165** |
| Dead `blob/main` GitHub link corrected to `blob/HEAD` (verified HTTP 200) | **17** |
| Raw `<ol>`/`<li>` markup converted to plain numbered text in preconditions, steps and expected results | **16** |
| Expected result restored to the specification | **2** (C29967, C29950) |
| Verdict change written into the case text | **3** (C29939, C29962, C29967) |
| Exhaustive-evidence note added | **1** (C29944) |
| Now-false "no developer ticket yet" replaced with the real ticket | **2** (C30010 → SV-8834, C30041 → SV-8874) |

## Per-operation record

| # | Case | C-id | HTTP | Fields compared | Verification | Marker written |
|---:|---|---|---:|---:|---|---|
| 1 | SCH-NAV-01 | [C29925](https://shopview.testrail.io/index.php?/cases/view/29925) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 2 | SCH-NAV-03 | [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 3 | SCH-NAV-04 | [C29928](https://shopview.testrail.io/index.php?/cases/view/29928) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 4 | SCH-NAV-05 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 5 | SCH-NAV-06 | [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 6 | SCH-NAV-07 | [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 7 | SCH-MCAL-01 | [C29932](https://shopview.testrail.io/index.php?/cases/view/29932) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 8 | SCH-MCAL-02 | [C29933](https://shopview.testrail.io/index.php?/cases/view/29933) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 9 | SCH-MCAL-03 | [C29934](https://shopview.testrail.io/index.php?/cases/view/29934) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 10 | SCH-MCAL-04 | [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 11 | SCH-WOL-01 | [C29936](https://shopview.testrail.io/index.php?/cases/view/29936) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 12 | SCH-WOL-02 | [C29937](https://shopview.testrail.io/index.php?/cases/view/29937) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 13 | SCH-WOL-04 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8873)` |
| 14 | SCH-WOL-05 | [C29940](https://shopview.testrail.io/index.php?/cases/view/29940) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 15 | SCH-WOL-06 | [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 16 | SCH-FILT-01 | [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 17 | SCH-FILT-02 | [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 18 | SCH-FILT-03 | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 19 | SCH-FILT-04 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 20 | SCH-FILT-05 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8857)` |
| 21 | SCH-FILT-06 | [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 22 | SCH-LINE-01 | [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 23 | SCH-LINE-03 | [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 24 | SCH-LINE-04 | [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 25 | SCH-LINE-05 | [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 26 | SCH-LINE-06 | [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 27 | SCH-LINE-07 | [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 28 | SCH-DND-01 | [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 29 | SCH-DND-02 | [C29956](https://shopview.testrail.io/index.php?/cases/view/29956) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 30 | SCH-DND-03 | [C29957](https://shopview.testrail.io/index.php?/cases/view/29957) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 31 | SCH-DND-04 | [C29958](https://shopview.testrail.io/index.php?/cases/view/29958) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 32 | SCH-DND-05 | [C29959](https://shopview.testrail.io/index.php?/cases/view/29959) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 33 | SCH-DND-06 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8840)` |
| 34 | SCH-DND-07 | [C29961](https://shopview.testrail.io/index.php?/cases/view/29961) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 35 | SCH-DND-08 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 36 | SCH-SCOPE-01 | [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 37 | SCH-SCOPE-02 | [C29964](https://shopview.testrail.io/index.php?/cases/view/29964) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 38 | SCH-SCOPE-03 | [C29965](https://shopview.testrail.io/index.php?/cases/view/29965) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 39 | SCH-SCOPE-05 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8886)` |
| 40 | SCH-START-01 | [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 41 | SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - needs shop business hours switched on, which ` |
| 42 | SCH-START-03 | [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 43 | SCH-START-04 | [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 44 | SCH-START-05 | [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 45 | SCH-START-06 | [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 46 | SCH-START-07 | [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 47 | SCH-SPREAD-02 | [C29978](https://shopview.testrail.io/index.php?/cases/view/29978) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 48 | SCH-SPREAD-03 | [C29979](https://shopview.testrail.io/index.php?/cases/view/29979) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 49 | SCH-SPREAD-04 | [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 50 | SCH-SPREAD-05 | [C29981](https://shopview.testrail.io/index.php?/cases/view/29981) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 51 | SCH-SPREAD-06 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8855)` |
| 52 | SCH-SPREAD-07 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - waiting on the product owner's answer, and th` |
| 53 | SCH-SPREAD-08 | [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 54 | SCH-SPREAD-09 | [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 55 | SCH-SPREAD-10 | [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 56 | SCH-SER-01 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 57 | SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8849)` |
| 58 | SCH-SER-03 | [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 59 | SCH-SER-04 | [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 60 | SCH-BLOCK-01 | [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 61 | SCH-BLOCK-02 | [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 62 | SCH-BLOCK-05 | [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 63 | SCH-LANE-01 | [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 64 | SCH-LANE-02 | [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 65 | SCH-LANE-03 | [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 66 | SCH-LANE-04 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8850)` |
| 67 | SCH-DAY-01 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8837)` |
| 68 | SCH-DAY-03 | [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 69 | SCH-DAY-04 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8856)` |
| 70 | SCH-DAY-05 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 71 | SCH-DAY-06 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 72 | SCH-MODAL-01 | [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 73 | SCH-MODAL-02 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8833)` |
| 74 | SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8834)` |
| 75 | SCH-MODAL-04 | [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 76 | SCH-MODAL-05 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8829)` |
| 77 | SCH-MODAL-06 | [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 78 | SCH-MODAL-07 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8852)` |
| 79 | SCH-MODAL-08 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 80 | SCH-EVT-01 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 81 | SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - the feature is not built yet` |
| 82 | SCH-EVT-03 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 83 | SCH-EVT-05 | [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 84 | SCH-EVT-06 | [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 85 | SCH-EVT-07 | [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 86 | SCH-CONF-01 | [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 87 | SCH-CONF-02 | [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 88 | SCH-CONF-03 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 89 | SCH-CONF-05 | [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 90 | SCH-CONF-06 | [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 91 | SCH-CONF-07 | [C30029](https://shopview.testrail.io/index.php?/cases/view/30029) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 92 | SCH-CAP-01 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 93 | SCH-CAP-02 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 94 | SCH-CAP-03 | [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 95 | SCH-CAP-04 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 96 | SCH-TIP-01 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (no ticket - accepted, see the d` |
| 97 | SCH-TIP-02 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 98 | SCH-TIP-03 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 99 | SCH-TIP-04 | [C30037](https://shopview.testrail.io/index.php?/cases/view/30037) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 100 | SCH-TIP-05 | [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 101 | SCH-TOOL-01 | [C30039](https://shopview.testrail.io/index.php?/cases/view/30039) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 102 | SCH-TOOL-02 | [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 103 | SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8874)` |
| 104 | SCH-VIEW-01 | [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 105 | SCH-VIEW-02 | [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 106 | SCH-VIEW-03 | [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 107 | SCH-VIEW-04 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 108 | SCH-VIEW-05 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8827)` |
| 109 | SCH-VIEW-06 | [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 110 | SCH-VIEW-09 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8851)` |
| 111 | SCH-VIEW-10 | [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 112 | SCH-REAS-01 | [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 113 | SCH-REAS-03 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 114 | SCH-DEL-01 | [C30057](https://shopview.testrail.io/index.php?/cases/view/30057) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 115 | SCH-DEL-02 | [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 116 | SCH-DEL-03 | [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 117 | SCH-DEL-04 | [C30060](https://shopview.testrail.io/index.php?/cases/view/30060) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 118 | SCH-DEL-05 | [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 119 | SCH-DEL-06 | [C30062](https://shopview.testrail.io/index.php?/cases/view/30062) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 120 | SCH-DEL-08 | [C30064](https://shopview.testrail.io/index.php?/cases/view/30064) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 121 | SCH-DEL-09 | [C30065](https://shopview.testrail.io/index.php?/cases/view/30065) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 122 | SCH-KEY-01 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8853)` |
| 123 | SCH-KEY-03 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8853)` |
| 124 | SCH-KEY-05 | [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 125 | SCH-COLOR-01 | [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 126 | SCH-COLOR-02 | [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 127 | SCH-COLOR-03 | [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 128 | SCH-PERM-01 | [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 129 | SCH-PERM-02 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 130 | SCH-PERM-03 | [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 131 | SCH-PERM-04 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 132 | SCH-PERM-05 | [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 133 | SCH-PERM-06 | [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 134 | SCH-PERM-07 | [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 135 | SCH-PERM-08 | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (SV-8854)` |
| 136 | SCH-PERM-09 | [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 137 | SCH-PERM-10 | [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 138 | SCH-PERM-11 | [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 139 | SCH-EDGE-02 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | 200 | 30 | **MATCH** | `AUTOMATION: READY - EXPECT FAIL (no ticket - accepted, see the d` |
| 140 | SCH-EDGE-03 | [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 141 | SCH-EDGE-04 | [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 142 | SCH-EDGE-05 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - waiting on the product owner's answer, and th` |
| 143 | SCH-EDGE-06 | [C30090](https://shopview.testrail.io/index.php?/cases/view/30090) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 144 | SCH-PERM-12 | [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 145 | SCH-EVT-08 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 146 | SCH-HRS-02 | [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 147 | SCH-HRS-03 | [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 148 | SCH-HRS-04 | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 149 | SCH-HRS-05 | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 150 | SCH-HRS-06 | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 151 | SCH-REAS-06 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 152 | SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - the feature is not built yet` |
| 153 | SCH-DEL-10 | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 154 | SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - needs a real daylight-saving clock change, th` |
| 155 | SCH-EDGE-08 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 156 | SCH-REG-01 | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 157 | SCH-REG-02 | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 158 | SCH-REG-03 | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 159 | SCH-REG-04 | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 160 | SCH-REG-05 | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 161 | SCH-API-01 | [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 162 | SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | 200 | 30 | **MATCH** | `AUTOMATION: HOLD - the feature is not built yet` |
| 163 | SCH-API-03 | [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 164 | SCH-API-04 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |
| 165 | SCH-PERM-13 | [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | 200 | 30 | **MATCH** | `AUTOMATION: READY` |

## Run 357 — proven untouched, before AND after

| Check | Result |
|---|---|
| `include_all` | **false** before and after (unchanged) |
| Tests | **165** before, **165** after |
| Result records | **429** before, **429** after |
| `case_id` sets equal BOTH directions | **yes** — 0 added, 0 removed |
| `test_id` sets equal BOTH directions | **yes** |
| Every prior result present BY ID | **yes**, all 429 |
| New results created | **0** |
| Prior results differing in ANY graded field | **0** |
| Prior results differing only in `case_title` | **0** — no case was retitled, so the declared read-time echo never fired |

**No result was logged anywhere**, per the QA lead's standing instruction to keep asking before
running tests.
