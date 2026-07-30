# Schedule — TestRail EXECUTION LOG (closing authenticity pass, 2026-07-31)

**STATUS: EXECUTED.** Manifest: `testrail-sync-manifest-2026-07-31.md`.
Machine log: `testrail-op-log-2026-07-31.json`. Pre-write snapshots: `pre-push-snapshot/`.

## Result

| | |
|---|---|
| `update_case` issued | **84** |
| HTTP 200 | **84 / 84** |
| re-GET field verify MATCH | **84 / 84** |
| `add_case` · `delete_case` · `add_section` | **0 · 0 · 0** |
| result writes | **0** |
| MISMATCH / failure | **0** |
| Live case count under group 4254 | **164** (== 164 local active == 164 id-map == 164 import rows) |
| Run 357 | **164 tests, 0 missing, 0 extra, 429 results — already equal both ways, no `update_run` issued** |

## Field changes written

| Field | Count |
|---|---|
| `title` | 73 |
| `refs` | 17 |
| `custom_expected` | 1 |
| `custom_preconds` / `custom_steps` | 0 — markup-only diffs deliberately suppressed (see the manifest finding) |

## Per-case audit

| # | Case | TestRail | Link | Fields written | HTTP | re-GET |
|---|---|---|---|---|---|---|
| 1 | SCH-API-01 | C38872 | https://shopview.testrail.io/index.php?/cases/view/38872 | `refs` | 200 | **MATCH** |
| 2 | SCH-API-03 | C38874 | https://shopview.testrail.io/index.php?/cases/view/38874 | `refs` | 200 | **MATCH** |
| 3 | SCH-API-04 | C38875 | https://shopview.testrail.io/index.php?/cases/view/38875 | `refs` | 200 | **MATCH** |
| 4 | SCH-BLOCK-01 | C29991 | https://shopview.testrail.io/index.php?/cases/view/29991 | `title` | 200 | **MATCH** |
| 5 | SCH-BLOCK-02 | C29992 | https://shopview.testrail.io/index.php?/cases/view/29992 | `title` | 200 | **MATCH** |
| 6 | SCH-BLOCK-05 | C29995 | https://shopview.testrail.io/index.php?/cases/view/29995 | `title` | 200 | **MATCH** |
| 7 | SCH-CAP-02 | C30031 | https://shopview.testrail.io/index.php?/cases/view/30031 | `title` | 200 | **MATCH** |
| 8 | SCH-CAP-03 | C30032 | https://shopview.testrail.io/index.php?/cases/view/30032 | `title` | 200 | **MATCH** |
| 9 | SCH-CAP-04 | C30033 | https://shopview.testrail.io/index.php?/cases/view/30033 | `title` | 200 | **MATCH** |
| 10 | SCH-CONF-01 | C30023 | https://shopview.testrail.io/index.php?/cases/view/30023 | `title` | 200 | **MATCH** |
| 11 | SCH-CONF-02 | C30024 | https://shopview.testrail.io/index.php?/cases/view/30024 | `title`, `custom_expected` | 200 | **MATCH** |
| 12 | SCH-CONF-05 | C30027 | https://shopview.testrail.io/index.php?/cases/view/30027 | `title` | 200 | **MATCH** |
| 13 | SCH-CONF-07 | C30029 | https://shopview.testrail.io/index.php?/cases/view/30029 | `title` | 200 | **MATCH** |
| 14 | SCH-DAY-03 | C30003 | https://shopview.testrail.io/index.php?/cases/view/30003 | `title` | 200 | **MATCH** |
| 15 | SCH-DAY-04 | C30004 | https://shopview.testrail.io/index.php?/cases/view/30004 | `title` | 200 | **MATCH** |
| 16 | SCH-DEL-01 | C30057 | https://shopview.testrail.io/index.php?/cases/view/30057 | `title` | 200 | **MATCH** |
| 17 | SCH-DEL-02 | C30058 | https://shopview.testrail.io/index.php?/cases/view/30058 | `title` | 200 | **MATCH** |
| 18 | SCH-DEL-03 | C30059 | https://shopview.testrail.io/index.php?/cases/view/30059 | `title` | 200 | **MATCH** |
| 19 | SCH-DEL-05 | C30061 | https://shopview.testrail.io/index.php?/cases/view/30061 | `title` | 200 | **MATCH** |
| 20 | SCH-DND-01 | C29955 | https://shopview.testrail.io/index.php?/cases/view/29955 | `title` | 200 | **MATCH** |
| 21 | SCH-DND-03 | C29957 | https://shopview.testrail.io/index.php?/cases/view/29957 | `title` | 200 | **MATCH** |
| 22 | SCH-DND-04 | C29958 | https://shopview.testrail.io/index.php?/cases/view/29958 | `title` | 200 | **MATCH** |
| 23 | SCH-DND-05 | C29959 | https://shopview.testrail.io/index.php?/cases/view/29959 | `title` | 200 | **MATCH** |
| 24 | SCH-DND-06 | C29960 | https://shopview.testrail.io/index.php?/cases/view/29960 | `title` | 200 | **MATCH** |
| 25 | SCH-DND-07 | C29961 | https://shopview.testrail.io/index.php?/cases/view/29961 | `title` | 200 | **MATCH** |
| 26 | SCH-EDGE-02 | C30086 | https://shopview.testrail.io/index.php?/cases/view/30086 | `title`, `refs` | 200 | **MATCH** |
| 27 | SCH-EDGE-03 | C30087 | https://shopview.testrail.io/index.php?/cases/view/30087 | `refs` | 200 | **MATCH** |
| 28 | SCH-EDGE-04 | C30088 | https://shopview.testrail.io/index.php?/cases/view/30088 | `title` | 200 | **MATCH** |
| 29 | SCH-EDGE-06 | C30090 | https://shopview.testrail.io/index.php?/cases/view/30090 | `title` | 200 | **MATCH** |
| 30 | SCH-EVT-06 | C30021 | https://shopview.testrail.io/index.php?/cases/view/30021 | `title` | 200 | **MATCH** |
| 31 | SCH-EVT-07 | C30022 | https://shopview.testrail.io/index.php?/cases/view/30022 | `title` | 200 | **MATCH** |
| 32 | SCH-LANE-03 | C29998 | https://shopview.testrail.io/index.php?/cases/view/29998 | `title` | 200 | **MATCH** |
| 33 | SCH-LINE-03 | C29950 | https://shopview.testrail.io/index.php?/cases/view/29950 | `title` | 200 | **MATCH** |
| 34 | SCH-LINE-04 | C29951 | https://shopview.testrail.io/index.php?/cases/view/29951 | `title` | 200 | **MATCH** |
| 35 | SCH-LINE-07 | C29954 | https://shopview.testrail.io/index.php?/cases/view/29954 | `title` | 200 | **MATCH** |
| 36 | SCH-MCAL-02 | C29933 | https://shopview.testrail.io/index.php?/cases/view/29933 | `title` | 200 | **MATCH** |
| 37 | SCH-MCAL-04 | C29935 | https://shopview.testrail.io/index.php?/cases/view/29935 | `title` | 200 | **MATCH** |
| 38 | SCH-MODAL-01 | C30008 | https://shopview.testrail.io/index.php?/cases/view/30008 | `title` | 200 | **MATCH** |
| 39 | SCH-MODAL-04 | C30011 | https://shopview.testrail.io/index.php?/cases/view/30011 | `title` | 200 | **MATCH** |
| 40 | SCH-NAV-04 | C29928 | https://shopview.testrail.io/index.php?/cases/view/29928 | `title` | 200 | **MATCH** |
| 41 | SCH-NAV-05 | C29929 | https://shopview.testrail.io/index.php?/cases/view/29929 | `title` | 200 | **MATCH** |
| 42 | SCH-NAV-06 | C29930 | https://shopview.testrail.io/index.php?/cases/view/29930 | `title` | 200 | **MATCH** |
| 43 | SCH-NAV-07 | C29931 | https://shopview.testrail.io/index.php?/cases/view/29931 | `title` | 200 | **MATCH** |
| 44 | SCH-PERM-01 | C30074 | https://shopview.testrail.io/index.php?/cases/view/30074 | `title`, `refs` | 200 | **MATCH** |
| 45 | SCH-PERM-02 | C30075 | https://shopview.testrail.io/index.php?/cases/view/30075 | `refs` | 200 | **MATCH** |
| 46 | SCH-PERM-03 | C30076 | https://shopview.testrail.io/index.php?/cases/view/30076 | `refs` | 200 | **MATCH** |
| 47 | SCH-PERM-04 | C30077 | https://shopview.testrail.io/index.php?/cases/view/30077 | `refs` | 200 | **MATCH** |
| 48 | SCH-PERM-05 | C30078 | https://shopview.testrail.io/index.php?/cases/view/30078 | `title`, `refs` | 200 | **MATCH** |
| 49 | SCH-PERM-06 | C30079 | https://shopview.testrail.io/index.php?/cases/view/30079 | `title`, `refs` | 200 | **MATCH** |
| 50 | SCH-PERM-07 | C30080 | https://shopview.testrail.io/index.php?/cases/view/30080 | `title`, `refs` | 200 | **MATCH** |
| 51 | SCH-PERM-08 | C30081 | https://shopview.testrail.io/index.php?/cases/view/30081 | `title` | 200 | **MATCH** |
| 52 | SCH-PERM-09 | C30082 | https://shopview.testrail.io/index.php?/cases/view/30082 | `title`, `refs` | 200 | **MATCH** |
| 53 | SCH-PERM-10 | C30083 | https://shopview.testrail.io/index.php?/cases/view/30083 | `title` | 200 | **MATCH** |
| 54 | SCH-PERM-11 | C30084 | https://shopview.testrail.io/index.php?/cases/view/30084 | `title` | 200 | **MATCH** |
| 55 | SCH-PERM-12 | C30614 | https://shopview.testrail.io/index.php?/cases/view/30614 | `title` | 200 | **MATCH** |
| 56 | SCH-REAS-01 | C30052 | https://shopview.testrail.io/index.php?/cases/view/30052 | `title` | 200 | **MATCH** |
| 57 | SCH-REG-01 | C38867 | https://shopview.testrail.io/index.php?/cases/view/38867 | `refs` | 200 | **MATCH** |
| 58 | SCH-REG-02 | C38868 | https://shopview.testrail.io/index.php?/cases/view/38868 | `refs` | 200 | **MATCH** |
| 59 | SCH-REG-03 | C38869 | https://shopview.testrail.io/index.php?/cases/view/38869 | `refs` | 200 | **MATCH** |
| 60 | SCH-REG-04 | C38870 | https://shopview.testrail.io/index.php?/cases/view/38870 | `refs` | 200 | **MATCH** |
| 61 | SCH-SCOPE-02 | C29964 | https://shopview.testrail.io/index.php?/cases/view/29964 | `title` | 200 | **MATCH** |
| 62 | SCH-SCOPE-03 | C29965 | https://shopview.testrail.io/index.php?/cases/view/29965 | `title` | 200 | **MATCH** |
| 63 | SCH-SER-03 | C29989 | https://shopview.testrail.io/index.php?/cases/view/29989 | `title` | 200 | **MATCH** |
| 64 | SCH-SER-04 | C29990 | https://shopview.testrail.io/index.php?/cases/view/29990 | `title` | 200 | **MATCH** |
| 65 | SCH-SPREAD-03 | C29979 | https://shopview.testrail.io/index.php?/cases/view/29979 | `title` | 200 | **MATCH** |
| 66 | SCH-SPREAD-06 | C29982 | https://shopview.testrail.io/index.php?/cases/view/29982 | `title` | 200 | **MATCH** |
| 67 | SCH-SPREAD-08 | C29984 | https://shopview.testrail.io/index.php?/cases/view/29984 | `title` | 200 | **MATCH** |
| 68 | SCH-SPREAD-10 | C29986 | https://shopview.testrail.io/index.php?/cases/view/29986 | `title` | 200 | **MATCH** |
| 69 | SCH-START-01 | C29969 | https://shopview.testrail.io/index.php?/cases/view/29969 | `title` | 200 | **MATCH** |
| 70 | SCH-START-02 | C29970 | https://shopview.testrail.io/index.php?/cases/view/29970 | `title` | 200 | **MATCH** |
| 71 | SCH-START-04 | C29972 | https://shopview.testrail.io/index.php?/cases/view/29972 | `title` | 200 | **MATCH** |
| 72 | SCH-START-05 | C29973 | https://shopview.testrail.io/index.php?/cases/view/29973 | `title` | 200 | **MATCH** |
| 73 | SCH-START-06 | C29974 | https://shopview.testrail.io/index.php?/cases/view/29974 | `title` | 200 | **MATCH** |
| 74 | SCH-START-07 | C29975 | https://shopview.testrail.io/index.php?/cases/view/29975 | `title` | 200 | **MATCH** |
| 75 | SCH-TIP-01 | C30034 | https://shopview.testrail.io/index.php?/cases/view/30034 | `title` | 200 | **MATCH** |
| 76 | SCH-TIP-02 | C30035 | https://shopview.testrail.io/index.php?/cases/view/30035 | `title` | 200 | **MATCH** |
| 77 | SCH-TIP-03 | C30036 | https://shopview.testrail.io/index.php?/cases/view/30036 | `title` | 200 | **MATCH** |
| 78 | SCH-TIP-04 | C30037 | https://shopview.testrail.io/index.php?/cases/view/30037 | `title` | 200 | **MATCH** |
| 79 | SCH-TIP-05 | C30038 | https://shopview.testrail.io/index.php?/cases/view/30038 | `title` | 200 | **MATCH** |
| 80 | SCH-TOOL-02 | C30040 | https://shopview.testrail.io/index.php?/cases/view/30040 | `title` | 200 | **MATCH** |
| 81 | SCH-TOOL-03 | C30041 | https://shopview.testrail.io/index.php?/cases/view/30041 | `title` | 200 | **MATCH** |
| 82 | SCH-VIEW-03 | C30044 | https://shopview.testrail.io/index.php?/cases/view/30044 | `title` | 200 | **MATCH** |
| 83 | SCH-WOL-01 | C29936 | https://shopview.testrail.io/index.php?/cases/view/29936 | `title` | 200 | **MATCH** |
| 84 | SCH-WOL-02 | C29937 | https://shopview.testrail.io/index.php?/cases/view/29937 | `title` | 200 | **MATCH** |

## Rule-34 run-357 verification (read-only — no write was needed)

| Check | Result |
|---|---|
| Run | **357** — "Schedule - Ayesha (VIU Pending)" |
| Tests in run | **164** |
| Active cases | **164** |
| In cases but NOT in run | **0** |
| In run but NOT in active cases | **0** |
| Results in run | **429 — unchanged** |
| `update_run` issued | **NO** — the run already equalled the active set in both directions |

## Honesty notes

- Every verdict above is a **live API response captured this run** (HTTP code + re-GET body
  compared field-by-field), not an inference.
- The 16 HTML-reformatted cases' body fields were **deliberately not written** — see the
  manifest. Local and live therefore still differ in **markup** (not content) for those 16.
- **Nothing here is a build verification.** Schedule still has no QA branch (OQ-3); all 164
  cases remain `VIU-Pending` (Rule 12).
