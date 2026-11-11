# A/R and A/P aging, V1 regression: live run on the upgraded build (QA sv11315), 11 Nov 2026

## Summary

| Verdict | Count |
|---|---|
| PASS | 0 |
| FAIL | 0 |
| BLOCKED | 0 |
| CASE-WRONG | 0 |
| **NOT RUN** | **93** (72 V1 regression + 21 planned-change) |

**No case was executed.** The QA lead's QA session answered **HTTP 401** at **2026-11-11T10:43:36Z** (QA marker
`v26.45.2-6a8b89c`, checked at the same minute) while test data was still being created. The instruction for a
401 was to stop the QA part and not try to repair the session, so the run stopped there. Nothing was observed on
any report screen, so no case can be called passed, failed or blocked (Rule 12).

**Confirmed LOST list: empty.** Nothing was observed, so nothing is confirmed. The three possible losses
(V1R-07, V1R-08, V1R-35) and the held V1R-25 are still unproven on both sides.

Production (V1) was not touched: no failure exists to confirm there.

## What is ready for the restart

- `tools/seed.py qa` + `tools/manifest.json`: one command that rebuilds every record the 72 cases need. It is
  resumable from `tools/seeded-qa.json`, and dates are counted back from the run day. 45 of the records exist (`SEEDED.md`).
- Before the restart, fix in `seed.py` (all listed in `SEEDED.md`): read the credit memo id from `creditMemoId`;
  find another route for a free-standing deposit; find a working way to set a customer to Net 30 (`customers/change` gives 500);
  use the location-B labour type for location-B lines; pick the part sale id from the list response.

## Per case

The 21 planned-change cases (V1R-73..V1R-93, C1095429-C1095449) were added to the scope at about 10:50Z, after the QA session had already been lost. The seeding manifest does not cover them yet.

| Key | TestRail | Group | Verdict | Observed | QA marker |
|---|---|---|---|---|---|
| V1R-01 | [C1078974](https://shopview.testrail.io/index.php?/cases/view/1078974) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-02 | [C1078975](https://shopview.testrail.io/index.php?/cases/view/1078975) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-03 | [C1078976](https://shopview.testrail.io/index.php?/cases/view/1078976) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-04 | [C1078977](https://shopview.testrail.io/index.php?/cases/view/1078977) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-05 | [C1078978](https://shopview.testrail.io/index.php?/cases/view/1078978) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-06 | [C1078979](https://shopview.testrail.io/index.php?/cases/view/1078979) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-07 | [C1078980](https://shopview.testrail.io/index.php?/cases/view/1078980) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-08 | [C1078981](https://shopview.testrail.io/index.php?/cases/view/1078981) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-09 | [C1078982](https://shopview.testrail.io/index.php?/cases/view/1078982) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-10 | [C1078983](https://shopview.testrail.io/index.php?/cases/view/1078983) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-11 | [C1078984](https://shopview.testrail.io/index.php?/cases/view/1078984) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-12 | [C1078985](https://shopview.testrail.io/index.php?/cases/view/1078985) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-13 | [C1078986](https://shopview.testrail.io/index.php?/cases/view/1078986) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-14 | [C1078987](https://shopview.testrail.io/index.php?/cases/view/1078987) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-15 | [C1078988](https://shopview.testrail.io/index.php?/cases/view/1078988) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-16 | [C1078989](https://shopview.testrail.io/index.php?/cases/view/1078989) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-17 | [C1078990](https://shopview.testrail.io/index.php?/cases/view/1078990) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-18 | [C1078991](https://shopview.testrail.io/index.php?/cases/view/1078991) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-19 | [C1078992](https://shopview.testrail.io/index.php?/cases/view/1078992) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-20 | [C1078993](https://shopview.testrail.io/index.php?/cases/view/1078993) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-21 | [C1078994](https://shopview.testrail.io/index.php?/cases/view/1078994) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-22 | [C1078995](https://shopview.testrail.io/index.php?/cases/view/1078995) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-23 | [C1078996](https://shopview.testrail.io/index.php?/cases/view/1078996) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-24 | [C1078997](https://shopview.testrail.io/index.php?/cases/view/1078997) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-25 | [C1078998](https://shopview.testrail.io/index.php?/cases/view/1078998) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-26 | [C1078999](https://shopview.testrail.io/index.php?/cases/view/1078999) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-27 | [C1079000](https://shopview.testrail.io/index.php?/cases/view/1079000) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-28 | [C1079001](https://shopview.testrail.io/index.php?/cases/view/1079001) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-29 | [C1079002](https://shopview.testrail.io/index.php?/cases/view/1079002) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-30 | [C1079003](https://shopview.testrail.io/index.php?/cases/view/1079003) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-31 | [C1079004](https://shopview.testrail.io/index.php?/cases/view/1079004) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-32 | [C1079005](https://shopview.testrail.io/index.php?/cases/view/1079005) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-33 | [C1079006](https://shopview.testrail.io/index.php?/cases/view/1079006) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-34 | [C1079007](https://shopview.testrail.io/index.php?/cases/view/1079007) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-35 | [C1079008](https://shopview.testrail.io/index.php?/cases/view/1079008) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-36 | [C1079009](https://shopview.testrail.io/index.php?/cases/view/1079009) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-37 | [C1079010](https://shopview.testrail.io/index.php?/cases/view/1079010) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-38 | [C1079011](https://shopview.testrail.io/index.php?/cases/view/1079011) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-39 | [C1079012](https://shopview.testrail.io/index.php?/cases/view/1079012) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-40 | [C1079013](https://shopview.testrail.io/index.php?/cases/view/1079013) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-41 | [C1079014](https://shopview.testrail.io/index.php?/cases/view/1079014) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-42 | [C1079015](https://shopview.testrail.io/index.php?/cases/view/1079015) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-43 | [C1079016](https://shopview.testrail.io/index.php?/cases/view/1079016) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-44 | [C1079017](https://shopview.testrail.io/index.php?/cases/view/1079017) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-45 | [C1079018](https://shopview.testrail.io/index.php?/cases/view/1079018) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-46 | [C1079019](https://shopview.testrail.io/index.php?/cases/view/1079019) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-47 | [C1079020](https://shopview.testrail.io/index.php?/cases/view/1079020) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-48 | [C1079021](https://shopview.testrail.io/index.php?/cases/view/1079021) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-49 | [C1079022](https://shopview.testrail.io/index.php?/cases/view/1079022) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-50 | [C1079023](https://shopview.testrail.io/index.php?/cases/view/1079023) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-51 | [C1079024](https://shopview.testrail.io/index.php?/cases/view/1079024) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-52 | [C1079025](https://shopview.testrail.io/index.php?/cases/view/1079025) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-53 | [C1079026](https://shopview.testrail.io/index.php?/cases/view/1079026) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-54 | [C1079027](https://shopview.testrail.io/index.php?/cases/view/1079027) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-55 | [C1079028](https://shopview.testrail.io/index.php?/cases/view/1079028) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-56 | [C1079029](https://shopview.testrail.io/index.php?/cases/view/1079029) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-57 | [C1079030](https://shopview.testrail.io/index.php?/cases/view/1079030) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-58 | [C1079031](https://shopview.testrail.io/index.php?/cases/view/1079031) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-59 | [C1079032](https://shopview.testrail.io/index.php?/cases/view/1079032) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-60 | [C1079033](https://shopview.testrail.io/index.php?/cases/view/1079033) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-61 | [C1079034](https://shopview.testrail.io/index.php?/cases/view/1079034) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-62 | [C1079035](https://shopview.testrail.io/index.php?/cases/view/1079035) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-63 | [C1079036](https://shopview.testrail.io/index.php?/cases/view/1079036) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-64 | [C1079037](https://shopview.testrail.io/index.php?/cases/view/1079037) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-65 | [C1079038](https://shopview.testrail.io/index.php?/cases/view/1079038) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-66 | [C1079039](https://shopview.testrail.io/index.php?/cases/view/1079039) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-67 | [C1079040](https://shopview.testrail.io/index.php?/cases/view/1079040) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-68 | [C1079041](https://shopview.testrail.io/index.php?/cases/view/1079041) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-69 | [C1079042](https://shopview.testrail.io/index.php?/cases/view/1079042) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-70 | [C1079043](https://shopview.testrail.io/index.php?/cases/view/1079043) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-71 | [C1079044](https://shopview.testrail.io/index.php?/cases/view/1079044) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-72 | [C1079045](https://shopview.testrail.io/index.php?/cases/view/1079045) | V1 regression | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-73 | [C1095429](https://shopview.testrail.io/index.php?/cases/view/1095429) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-74 | [C1095430](https://shopview.testrail.io/index.php?/cases/view/1095430) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-75 | [C1095431](https://shopview.testrail.io/index.php?/cases/view/1095431) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-76 | [C1095432](https://shopview.testrail.io/index.php?/cases/view/1095432) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-77 | [C1095433](https://shopview.testrail.io/index.php?/cases/view/1095433) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-78 | [C1095434](https://shopview.testrail.io/index.php?/cases/view/1095434) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-79 | [C1095435](https://shopview.testrail.io/index.php?/cases/view/1095435) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-80 | [C1095436](https://shopview.testrail.io/index.php?/cases/view/1095436) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-81 | [C1095437](https://shopview.testrail.io/index.php?/cases/view/1095437) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-82 | [C1095438](https://shopview.testrail.io/index.php?/cases/view/1095438) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). Also needs more than 2,000 A/P Detail lines; the line count on QA could not be measured without a session. | v26.45.2-6a8b89c |
| V1R-83 | [C1095439](https://shopview.testrail.io/index.php?/cases/view/1095439) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-84 | [C1095440](https://shopview.testrail.io/index.php?/cases/view/1095440) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-85 | [C1095441](https://shopview.testrail.io/index.php?/cases/view/1095441) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-86 | [C1095442](https://shopview.testrail.io/index.php?/cases/view/1095442) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-87 | [C1095443](https://shopview.testrail.io/index.php?/cases/view/1095443) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-88 | [C1095444](https://shopview.testrail.io/index.php?/cases/view/1095444) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-89 | [C1095445](https://shopview.testrail.io/index.php?/cases/view/1095445) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-90 | [C1095446](https://shopview.testrail.io/index.php?/cases/view/1095446) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-91 | [C1095447](https://shopview.testrail.io/index.php?/cases/view/1095447) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-92 | [C1095448](https://shopview.testrail.io/index.php?/cases/view/1095448) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
| V1R-93 | [C1095449](https://shopview.testrail.io/index.php?/cases/view/1095449) | planned change (PRD v11) | NOT RUN | Not executed (QA session lost before the run started). | v26.45.2-6a8b89c |
