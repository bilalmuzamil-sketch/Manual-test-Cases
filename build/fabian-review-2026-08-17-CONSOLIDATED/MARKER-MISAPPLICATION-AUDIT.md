# Marker-Misapplication Audit — `AUTOMATION: Not available on Build to test Yet`

**2026-08-17/18 Fabian-review + currency passes · Schedule (group 4254) · Report Suite (group 4281) · Filters (group 4110)**

Read-only investigation. Author: Bilal Muzamil (TestRail user id 3). Written 2026-08-18.
**No TestRail or Jira write was made by this audit — only this report file was committed.**

## What this audit answers

The Rule-69 marker `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` was
applied broadly in this session's currency passes. The QA lead's **intent** was that it go **only** on:
- **(a) newly-added cases**, and
- **(b) cases whose CONTENT (title / preconditions / steps / expected-behaviour body) changed** because a spec/source changed.

It was suspected the marker was **also** put on **reference-only** cases — cases whose content did
**not** change, where the pass only refreshed the provenance line (spec version + dates below the
`---`) and/or the `refs`. **This audit produces the exact reference-only list (the fix set), verified
from git + live TestRail, not from any worker self-report (Standing Rule 50 / Rule G).**

## Method (Rule G — audit from live + git, never from self-reports)

1. **Population = every case whose LIVE `custom_expected` currently carries the marker** — read live
   via `get_cases` (project 1 / suite 1, 4163 cases pulled and indexed). **686 cases carry it live.**
2. **Classification uses git**: for each case, the committed local case-source body was compared
   between the **pre-session baseline commit** (the parent of the first Fabian/currency commit that
   touched that project's case source) and now. The compared content is **title + preconditions +
   steps + expected-behaviour BODY only** — the trailing provenance line, the automation marker and
   the `refs` field are **excluded** from the body comparison (they are exactly what a reference-only
   refresh touches).
3. **Baselines used** (parent of first session commit on each case source):
   - Schedule `build/schedule/cases` → baseline **`6dbec93f`** (2026-08-12), first session commit `343206e2`.
   - Report Suite `build/report-suite/cases` → baseline **`94a4aab0`** (2026-08-12), first session commit `dec97a26`.
   - Filters `build/filters/cases` → baseline **`80f773af`** (2026-08-12), first session commit `b457922c`.
4. **Classify each marked case:** NEW (no baseline counterpart) · CONTENT-CHANGED (body genuinely
   differs) · REFERENCE-ONLY (body byte-identical to baseline).
5. **Live cross-check (Rule G):** every classified case was checked against its LIVE body; the
   `custom_atmstatus` (Automated) flag was read LIVE for the fix set. Reconciliation: 686 live-marked
   = 691 local-marked − 5 local-only divergences (see §5); **0 live-marked cases were unclassified.**

## HEADLINE

| Project | Cases carrying the marker (live) | NEW (correct) | CONTENT-CHANGED (correct) | **REFERENCE-ONLY (WRONGLY MARKED)** | of which Automated |
|---|--:|--:|--:|--:|--:|
| Schedule | 189 | 18 | 40 | **131** | 0 |
| Report Suite | 387 | 27 | 79 | **281** | 25 |
| Filters | 110 | 9 | 61 | **40** | 2 |
| **TOTAL** | **686** | **54** | **180** | **452** | **27** |

**452 cases were wrongly given the marker** (reference-only: content unchanged, only the
provenance line / refs were refreshed). Of these, **27 are flagged "Automated"**
(`custom_atmstatus = 3`) in TestRail, so reverting their marker needs **Rule-71 handling** (ask the
QA lead first; edit an Automated case only coupled with build verification, then hand to Vlad).

Per project, wrongly marked: **Schedule 131 · Report Suite 281 · Filters 40.**
Automated among the fix set: **Report Suite 25 · Filters 2 · Schedule 0.**

**Marker to restore on the fix set:** 430 were plain `AUTOMATION: READY` before the session
(109 Schedule + 281 Report Suite + 40 Filters); **22 Schedule reference-only cases were previously
`AUTOMATION: HOLD - ...`** and must be restored to their exact HOLD text (see §3 and §4 — those 22
are a compounded error: reference-only **and** a Rule-69 overwrite of a HOLD marker).

---

## §1 — Per-project split

### Schedule (baseline `6dbec93f`)
- Live cases carrying the marker: **189**
- NEW (marker correct): **18**
- CONTENT-CHANGED (marker correct): **40**
- **REFERENCE-ONLY (marker WRONGLY applied): 131**

### Report Suite (baseline `94a4aab0`)
- Live cases carrying the marker: **387**
- NEW (marker correct): **27**
- CONTENT-CHANGED (marker correct): **79**
- **REFERENCE-ONLY (marker WRONGLY applied): 281**

### Filters (baseline `80f773af`)
- Live cases carrying the marker: **110**
- NEW (marker correct): **9**
- CONTENT-CHANGED (marker correct): **61**
- **REFERENCE-ONLY (marker WRONGLY applied): 40**

---

## §2 — The fix set: full REFERENCE-ONLY list (wrongly-marked cases)

These 452 cases carry the marker live but their tester-facing content (title / preconditions /
steps / expected-body) is **byte-identical** to the pre-session baseline. The marker should be
reverted to the **Prior marker** column value.

### Schedule — 131 reference-only cases

| # | Internal ID | C-id | Link | Prior marker (to restore) | Automated? |
|--:|---|---|---|---|:--:|
| 1 | SCH-NAV-01 | C29925 | [open](https://shopview.testrail.io/index.php?/cases/view/29925) | `AUTOMATION: READY` | no |
| 2 | SCH-NAV-03 | C29927 | [open](https://shopview.testrail.io/index.php?/cases/view/29927) | `AUTOMATION: READY` | no |
| 3 | SCH-NAV-04 | C29928 | [open](https://shopview.testrail.io/index.php?/cases/view/29928) | `AUTOMATION: READY` | no |
| 4 | SCH-NAV-05 | C29929 | [open](https://shopview.testrail.io/index.php?/cases/view/29929) | `AUTOMATION: READY` | no |
| 5 | SCH-NAV-06 | C29930 | [open](https://shopview.testrail.io/index.php?/cases/view/29930) | `AUTOMATION: READY` | no |
| 6 | SCH-MCAL-01 | C29932 | [open](https://shopview.testrail.io/index.php?/cases/view/29932) | `AUTOMATION: READY` | no |
| 7 | SCH-MCAL-02 | C29933 | [open](https://shopview.testrail.io/index.php?/cases/view/29933) | `AUTOMATION: READY` | no |
| 8 | SCH-MCAL-03 | C29934 | [open](https://shopview.testrail.io/index.php?/cases/view/29934) | `AUTOMATION: READY` | no |
| 9 | SCH-MCAL-04 | C29935 | [open](https://shopview.testrail.io/index.php?/cases/view/29935) | `AUTOMATION: READY` | no |
| 10 | SCH-WOL-01 | C29936 | [open](https://shopview.testrail.io/index.php?/cases/view/29936) | `AUTOMATION: READY` | no |
| 11 | SCH-WOL-05 | C29940 | [open](https://shopview.testrail.io/index.php?/cases/view/29940) | `AUTOMATION: READY` | no |
| 12 | SCH-WOL-06 | C29941 | [open](https://shopview.testrail.io/index.php?/cases/view/29941) | `AUTOMATION: READY` | no |
| 13 | SCH-FILT-01 | C29942 | [open](https://shopview.testrail.io/index.php?/cases/view/29942) | `AUTOMATION: READY` | no |
| 14 | SCH-FILT-02 | C29943 | [open](https://shopview.testrail.io/index.php?/cases/view/29943) | `AUTOMATION: READY` | no |
| 15 | SCH-FILT-03 | C29944 | [open](https://shopview.testrail.io/index.php?/cases/view/29944) | `AUTOMATION: READY` | no |
| 16 | SCH-FILT-04 | C29945 | [open](https://shopview.testrail.io/index.php?/cases/view/29945) | `AUTOMATION: READY` | no |
| 17 | SCH-FILT-06 | C29947 | [open](https://shopview.testrail.io/index.php?/cases/view/29947) | `AUTOMATION: READY` | no |
| 18 | SCH-LINE-01 | C29948 | [open](https://shopview.testrail.io/index.php?/cases/view/29948) | `AUTOMATION: READY` | no |
| 19 | SCH-LINE-03 | C29950 | [open](https://shopview.testrail.io/index.php?/cases/view/29950) | `AUTOMATION: READY` | no |
| 20 | SCH-LINE-04 | C29951 | [open](https://shopview.testrail.io/index.php?/cases/view/29951) | `AUTOMATION: READY` | no |
| 21 | SCH-LINE-05 | C29952 | [open](https://shopview.testrail.io/index.php?/cases/view/29952) | `AUTOMATION: READY` | no |
| 22 | SCH-LINE-06 | C29953 | [open](https://shopview.testrail.io/index.php?/cases/view/29953) | `AUTOMATION: READY` | no |
| 23 | SCH-LINE-07 | C29954 | [open](https://shopview.testrail.io/index.php?/cases/view/29954) | `AUTOMATION: READY` | no |
| 24 | SCH-DND-02 | C29956 | [open](https://shopview.testrail.io/index.php?/cases/view/29956) | `AUTOMATION: READY` | no |
| 25 | SCH-DND-03 | C29957 | [open](https://shopview.testrail.io/index.php?/cases/view/29957) | `AUTOMATION: READY` | no |
| 26 | SCH-DND-05 | C29959 | [open](https://shopview.testrail.io/index.php?/cases/view/29959) | `AUTOMATION: READY` | no |
| 27 | SCH-DND-06 | C29960 | [open](https://shopview.testrail.io/index.php?/cases/view/29960) | `AUTOMATION: READY` | no |
| 28 | SCH-DND-07 | C29961 | [open](https://shopview.testrail.io/index.php?/cases/view/29961) | `AUTOMATION: READY` | no |
| 29 | SCH-SCOPE-01 | C29963 | [open](https://shopview.testrail.io/index.php?/cases/view/29963) | `AUTOMATION: READY` | no |
| 30 | SCH-SCOPE-02 | C29964 | [open](https://shopview.testrail.io/index.php?/cases/view/29964) | `AUTOMATION: READY` | no |
| 31 | SCH-SCOPE-03 | C29965 | [open](https://shopview.testrail.io/index.php?/cases/view/29965) | `AUTOMATION: READY` | no |
| 32 | SCH-SCOPE-05 | C29967 | [open](https://shopview.testrail.io/index.php?/cases/view/29967) | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` | no |
| 33 | SCH-START-01 | C29969 | [open](https://shopview.testrail.io/index.php?/cases/view/29969) | `AUTOMATION: READY` | no |
| 34 | SCH-START-02 | C29970 | [open](https://shopview.testrail.io/index.php?/cases/view/29970) | `AUTOMATION: READY` | no |
| 35 | SCH-START-04 | C29972 | [open](https://shopview.testrail.io/index.php?/cases/view/29972) | `AUTOMATION: READY` | no |
| 36 | SCH-SPREAD-02 | C29978 | [open](https://shopview.testrail.io/index.php?/cases/view/29978) | `AUTOMATION: READY` | no |
| 37 | SCH-SPREAD-06 | C29982 | [open](https://shopview.testrail.io/index.php?/cases/view/29982) | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` | no |
| 38 | SCH-SPREAD-09 | C29985 | [open](https://shopview.testrail.io/index.php?/cases/view/29985) | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` | no |
| 39 | SCH-SPREAD-10 | C29986 | [open](https://shopview.testrail.io/index.php?/cases/view/29986) | `AUTOMATION: READY` | no |
| 40 | SCH-SER-01 | C29987 | [open](https://shopview.testrail.io/index.php?/cases/view/29987) | `AUTOMATION: READY` | no |
| 41 | SCH-SER-02 | C29988 | [open](https://shopview.testrail.io/index.php?/cases/view/29988) | `AUTOMATION: READY` | no |
| 42 | SCH-SER-03 | C29989 | [open](https://shopview.testrail.io/index.php?/cases/view/29989) | `AUTOMATION: READY` | no |
| 43 | SCH-SER-04 | C29990 | [open](https://shopview.testrail.io/index.php?/cases/view/29990) | `AUTOMATION: READY` | no |
| 44 | SCH-BLOCK-01 | C29991 | [open](https://shopview.testrail.io/index.php?/cases/view/29991) | `AUTOMATION: READY` | no |
| 45 | SCH-BLOCK-02 | C29992 | [open](https://shopview.testrail.io/index.php?/cases/view/29992) | `AUTOMATION: READY` | no |
| 46 | SCH-BLOCK-05 | C29995 | [open](https://shopview.testrail.io/index.php?/cases/view/29995) | `AUTOMATION: READY` | no |
| 47 | SCH-LANE-01 | C29996 | [open](https://shopview.testrail.io/index.php?/cases/view/29996) | `AUTOMATION: READY` | no |
| 48 | SCH-LANE-02 | C29997 | [open](https://shopview.testrail.io/index.php?/cases/view/29997) | `AUTOMATION: READY` | no |
| 49 | SCH-LANE-03 | C29998 | [open](https://shopview.testrail.io/index.php?/cases/view/29998) | `AUTOMATION: READY` | no |
| 50 | SCH-LANE-04 | C29999 | [open](https://shopview.testrail.io/index.php?/cases/view/29999) | `AUTOMATION: READY` | no |
| 51 | SCH-DAY-03 | C30003 | [open](https://shopview.testrail.io/index.php?/cases/view/30003) | `AUTOMATION: READY` | no |
| 52 | SCH-DAY-06 | C30006 | [open](https://shopview.testrail.io/index.php?/cases/view/30006) | `AUTOMATION: READY` | no |
| 53 | SCH-MODAL-04 | C30011 | [open](https://shopview.testrail.io/index.php?/cases/view/30011) | `AUTOMATION: READY` | no |
| 54 | SCH-MODAL-05 | C30012 | [open](https://shopview.testrail.io/index.php?/cases/view/30012) | `AUTOMATION: READY` | no |
| 55 | SCH-MODAL-07 | C30014 | [open](https://shopview.testrail.io/index.php?/cases/view/30014) | `AUTOMATION: READY` | no |
| 56 | SCH-MODAL-08 | C30015 | [open](https://shopview.testrail.io/index.php?/cases/view/30015) | `AUTOMATION: READY` | no |
| 57 | SCH-EVT-01 | C30016 | [open](https://shopview.testrail.io/index.php?/cases/view/30016) | `AUTOMATION: READY` | no |
| 58 | SCH-EVT-02 | C30017 | [open](https://shopview.testrail.io/index.php?/cases/view/30017) | `AUTOMATION: READY` | no |
| 59 | SCH-EVT-03 | C30018 | [open](https://shopview.testrail.io/index.php?/cases/view/30018) | `AUTOMATION: READY` | no |
| 60 | SCH-EVT-05 | C30020 | [open](https://shopview.testrail.io/index.php?/cases/view/30020) | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` | no |
| 61 | SCH-EVT-06 | C30021 | [open](https://shopview.testrail.io/index.php?/cases/view/30021) | `AUTOMATION: READY` | no |
| 62 | SCH-EVT-07 | C30022 | [open](https://shopview.testrail.io/index.php?/cases/view/30022) | `AUTOMATION: READY` | no |
| 63 | SCH-CONF-01 | C30023 | [open](https://shopview.testrail.io/index.php?/cases/view/30023) | `AUTOMATION: READY` | no |
| 64 | SCH-CONF-05 | C30027 | [open](https://shopview.testrail.io/index.php?/cases/view/30027) | `AUTOMATION: READY` | no |
| 65 | SCH-CONF-06 | C30028 | [open](https://shopview.testrail.io/index.php?/cases/view/30028) | `AUTOMATION: READY` | no |
| 66 | SCH-CONF-07 | C30029 | [open](https://shopview.testrail.io/index.php?/cases/view/30029) | `AUTOMATION: READY` | no |
| 67 | SCH-CAP-01 | C30030 | [open](https://shopview.testrail.io/index.php?/cases/view/30030) | `AUTOMATION: READY` | no |
| 68 | SCH-CAP-02 | C30031 | [open](https://shopview.testrail.io/index.php?/cases/view/30031) | `AUTOMATION: READY` | no |
| 69 | SCH-CAP-03 | C30032 | [open](https://shopview.testrail.io/index.php?/cases/view/30032) | `AUTOMATION: READY` | no |
| 70 | SCH-TIP-02 | C30035 | [open](https://shopview.testrail.io/index.php?/cases/view/30035) | `AUTOMATION: READY` | no |
| 71 | SCH-TIP-03 | C30036 | [open](https://shopview.testrail.io/index.php?/cases/view/30036) | `AUTOMATION: READY` | no |
| 72 | SCH-TIP-04 | C30037 | [open](https://shopview.testrail.io/index.php?/cases/view/30037) | `AUTOMATION: READY` | no |
| 73 | SCH-TIP-05 | C30038 | [open](https://shopview.testrail.io/index.php?/cases/view/30038) | `AUTOMATION: READY` | no |
| 74 | SCH-TOOL-01 | C30039 | [open](https://shopview.testrail.io/index.php?/cases/view/30039) | `AUTOMATION: READY` | no |
| 75 | SCH-TOOL-02 | C30040 | [open](https://shopview.testrail.io/index.php?/cases/view/30040) | `AUTOMATION: READY` | no |
| 76 | SCH-TOOL-03 | C30041 | [open](https://shopview.testrail.io/index.php?/cases/view/30041) | `AUTOMATION: READY` | no |
| 77 | SCH-VIEW-01 | C30042 | [open](https://shopview.testrail.io/index.php?/cases/view/30042) | `AUTOMATION: READY` | no |
| 78 | SCH-VIEW-02 | C30043 | [open](https://shopview.testrail.io/index.php?/cases/view/30043) | `AUTOMATION: READY` | no |
| 79 | SCH-VIEW-03 | C30044 | [open](https://shopview.testrail.io/index.php?/cases/view/30044) | `AUTOMATION: HOLD - needs a second sign-in as a user with no staff record of their own` | no |
| 80 | SCH-VIEW-04 | C30045 | [open](https://shopview.testrail.io/index.php?/cases/view/30045) | `AUTOMATION: READY` | no |
| 81 | SCH-VIEW-05 | C30046 | [open](https://shopview.testrail.io/index.php?/cases/view/30046) | `AUTOMATION: READY` | no |
| 82 | SCH-VIEW-06 | C30047 | [open](https://shopview.testrail.io/index.php?/cases/view/30047) | `AUTOMATION: READY` | no |
| 83 | SCH-VIEW-09 | C30050 | [open](https://shopview.testrail.io/index.php?/cases/view/30050) | `AUTOMATION: READY` | no |
| 84 | SCH-VIEW-10 | C30051 | [open](https://shopview.testrail.io/index.php?/cases/view/30051) | `AUTOMATION: READY` | no |
| 85 | SCH-REAS-01 | C30052 | [open](https://shopview.testrail.io/index.php?/cases/view/30052) | `AUTOMATION: READY` | no |
| 86 | SCH-DEL-04 | C30060 | [open](https://shopview.testrail.io/index.php?/cases/view/30060) | `AUTOMATION: READY` | no |
| 87 | SCH-DEL-05 | C30061 | [open](https://shopview.testrail.io/index.php?/cases/view/30061) | `AUTOMATION: READY` | no |
| 88 | SCH-DEL-06 | C30062 | [open](https://shopview.testrail.io/index.php?/cases/view/30062) | `AUTOMATION: READY` | no |
| 89 | SCH-DEL-09 | C30065 | [open](https://shopview.testrail.io/index.php?/cases/view/30065) | `AUTOMATION: READY` | no |
| 90 | SCH-KEY-01 | C30066 | [open](https://shopview.testrail.io/index.php?/cases/view/30066) | `AUTOMATION: READY` | no |
| 91 | SCH-KEY-03 | C30068 | [open](https://shopview.testrail.io/index.php?/cases/view/30068) | `AUTOMATION: READY` | no |
| 92 | SCH-KEY-05 | C30070 | [open](https://shopview.testrail.io/index.php?/cases/view/30070) | `AUTOMATION: READY` | no |
| 93 | SCH-COLOR-01 | C30071 | [open](https://shopview.testrail.io/index.php?/cases/view/30071) | `AUTOMATION: READY` | no |
| 94 | SCH-COLOR-02 | C30072 | [open](https://shopview.testrail.io/index.php?/cases/view/30072) | `AUTOMATION: READY` | no |
| 95 | SCH-COLOR-03 | C30073 | [open](https://shopview.testrail.io/index.php?/cases/view/30073) | `AUTOMATION: READY` | no |
| 96 | SCH-PERM-01 | C30074 | [open](https://shopview.testrail.io/index.php?/cases/view/30074) | `AUTOMATION: HOLD - needs a second sign-in as a view-only user` | no |
| 97 | SCH-PERM-02 | C30075 | [open](https://shopview.testrail.io/index.php?/cases/view/30075) | `AUTOMATION: HOLD - needs a second sign-in as a view-only user` | no |
| 98 | SCH-PERM-03 | C30076 | [open](https://shopview.testrail.io/index.php?/cases/view/30076) | `AUTOMATION: HOLD - needs a second sign-in as a user without the Schedule permission` | no |
| 99 | SCH-PERM-04 | C30077 | [open](https://shopview.testrail.io/index.php?/cases/view/30077) | `AUTOMATION: HOLD - needs a second sign-in as an edit-without-delete user` | no |
| 100 | SCH-PERM-05 | C30078 | [open](https://shopview.testrail.io/index.php?/cases/view/30078) | `AUTOMATION: HOLD - needs a second sign-in as an edit-without-delete user` | no |
| 101 | SCH-PERM-06 | C30079 | [open](https://shopview.testrail.io/index.php?/cases/view/30079) | `AUTOMATION: HOLD - needs a second sign-in as a delete-capable user` | no |
| 102 | SCH-PERM-07 | C30080 | [open](https://shopview.testrail.io/index.php?/cases/view/30080) | `AUTOMATION: READY` | no |
| 103 | SCH-PERM-08 | C30081 | [open](https://shopview.testrail.io/index.php?/cases/view/30081) | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` | no |
| 104 | SCH-PERM-09 | C30082 | [open](https://shopview.testrail.io/index.php?/cases/view/30082) | `AUTOMATION: HOLD - needs a second sign-in as a view-only technician` | no |
| 105 | SCH-PERM-10 | C30083 | [open](https://shopview.testrail.io/index.php?/cases/view/30083) | `AUTOMATION: READY` | no |
| 106 | SCH-PERM-11 | C30084 | [open](https://shopview.testrail.io/index.php?/cases/view/30084) | `AUTOMATION: HOLD - needs a second sign-in as each of the two staff members` | no |
| 107 | SCH-EDGE-02 | C30086 | [open](https://shopview.testrail.io/index.php?/cases/view/30086) | `AUTOMATION: READY` | no |
| 108 | SCH-EDGE-03 | C30087 | [open](https://shopview.testrail.io/index.php?/cases/view/30087) | `AUTOMATION: READY` | no |
| 109 | SCH-EDGE-04 | C30088 | [open](https://shopview.testrail.io/index.php?/cases/view/30088) | `AUTOMATION: READY` | no |
| 110 | SCH-EDGE-06 | C30090 | [open](https://shopview.testrail.io/index.php?/cases/view/30090) | `AUTOMATION: READY` | no |
| 111 | SCH-PERM-12 | C30614 | [open](https://shopview.testrail.io/index.php?/cases/view/30614) | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` | no |
| 112 | SCH-EVT-08 | C30615 | [open](https://shopview.testrail.io/index.php?/cases/view/30615) | `AUTOMATION: READY` | no |
| 113 | SCH-HRS-06 | C38851 | [open](https://shopview.testrail.io/index.php?/cases/view/38851) | `AUTOMATION: READY` | no |
| 114 | SCH-REAS-06 | C38855 | [open](https://shopview.testrail.io/index.php?/cases/view/38855) | `AUTOMATION: READY` | no |
| 115 | SCH-SPREAD-11 | C38863 | [open](https://shopview.testrail.io/index.php?/cases/view/38863) | `AUTOMATION: READY` | no |
| 116 | SCH-DEL-10 | C38864 | [open](https://shopview.testrail.io/index.php?/cases/view/38864) | `AUTOMATION: READY` | no |
| 117 | SCH-EDGE-07 | C38865 | [open](https://shopview.testrail.io/index.php?/cases/view/38865) | `AUTOMATION: READY` | no |
| 118 | SCH-EDGE-08 | C38866 | [open](https://shopview.testrail.io/index.php?/cases/view/38866) | `AUTOMATION: READY` | no |
| 119 | SCH-REG-01 | C38867 | [open](https://shopview.testrail.io/index.php?/cases/view/38867) | `AUTOMATION: HOLD - cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed` | no |
| 120 | SCH-REG-02 | C38868 | [open](https://shopview.testrail.io/index.php?/cases/view/38868) | `AUTOMATION: HOLD - the Dashboard section this test needs does not exist in the build` | no |
| 121 | SCH-REG-03 | C38869 | [open](https://shopview.testrail.io/index.php?/cases/view/38869) | `AUTOMATION: HOLD - work order creation offers no appointment in the build` | no |
| 122 | SCH-REG-04 | C38870 | [open](https://shopview.testrail.io/index.php?/cases/view/38870) | `AUTOMATION: READY` | no |
| 123 | SCH-REG-05 | C38871 | [open](https://shopview.testrail.io/index.php?/cases/view/38871) | `AUTOMATION: HOLD - the Priority field this test needs does not exist in the build` | no |
| 124 | SCH-API-01 | C38872 | [open](https://shopview.testrail.io/index.php?/cases/view/38872) | `AUTOMATION: HOLD - needs three separate sign-ins, one per permission level` | no |
| 125 | SCH-API-02 | C38873 | [open](https://shopview.testrail.io/index.php?/cases/view/38873) | `AUTOMATION: READY` | no |
| 126 | SCH-API-03 | C38874 | [open](https://shopview.testrail.io/index.php?/cases/view/38874) | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` | no |
| 127 | SCH-PERM-13 | C38926 | [open](https://shopview.testrail.io/index.php?/cases/view/38926) | `AUTOMATION: HOLD - needs a second sign-in as a holder of each permission level` | no |
| 128 | SCH-NAV-08 | C43554 | [open](https://shopview.testrail.io/index.php?/cases/view/43554) | `AUTOMATION: READY` | no |
| 129 | SCH-REAS-07 | C43556 | [open](https://shopview.testrail.io/index.php?/cases/view/43556) | `AUTOMATION: READY` | no |
| 130 | SCH-EDGE-09 | C43588 | [open](https://shopview.testrail.io/index.php?/cases/view/43588) | `AUTOMATION: READY` | no |
| 131 | SCH-EDGE-10 | C43589 | [open](https://shopview.testrail.io/index.php?/cases/view/43589) | `AUTOMATION: READY` | no |

### Report Suite — 281 reference-only cases

| # | Internal ID | C-id | Link | Prior marker (to restore) | Automated? |
|--:|---|---|---|---|:--:|
| 1 | SBC-NAV-01 | C30096 | [open](https://shopview.testrail.io/index.php?/cases/view/30096) | `AUTOMATION: READY` | no |
| 2 | SBC-PERM-01 | C30098 | [open](https://shopview.testrail.io/index.php?/cases/view/30098) | `AUTOMATION: READY` | no |
| 3 | SBC-PERM-02 | C30099 | [open](https://shopview.testrail.io/index.php?/cases/view/30099) | `AUTOMATION: READY` | no |
| 4 | SBC-PERM-04 | C30101 | [open](https://shopview.testrail.io/index.php?/cases/view/30101) | `AUTOMATION: READY` | no |
| 5 | SBC-LOC-01 | C30109 | [open](https://shopview.testrail.io/index.php?/cases/view/30109) | `AUTOMATION: READY` | no |
| 6 | SBC-LOC-03 | C30111 | [open](https://shopview.testrail.io/index.php?/cases/view/30111) | `AUTOMATION: READY` | no |
| 7 | SBC-CUST-02 | C30113 | [open](https://shopview.testrail.io/index.php?/cases/view/30113) | `AUTOMATION: READY` | no |
| 8 | SBC-CUST-04 | C30115 | [open](https://shopview.testrail.io/index.php?/cases/view/30115) | `AUTOMATION: READY` | no |
| 9 | SBC-CUST-06 | C30117 | [open](https://shopview.testrail.io/index.php?/cases/view/30117) | `AUTOMATION: READY` | no |
| 10 | SBC-CUST-09 | C30120 | [open](https://shopview.testrail.io/index.php?/cases/view/30120) | `AUTOMATION: READY` | no |
| 11 | SBC-TREE-01 | C30121 | [open](https://shopview.testrail.io/index.php?/cases/view/30121) | `AUTOMATION: READY` | YES |
| 12 | SBC-TREE-02 | C30122 | [open](https://shopview.testrail.io/index.php?/cases/view/30122) | `AUTOMATION: READY` | no |
| 13 | SBC-TREE-03 | C30123 | [open](https://shopview.testrail.io/index.php?/cases/view/30123) | `AUTOMATION: READY` | YES |
| 14 | SBC-TREE-05 | C30125 | [open](https://shopview.testrail.io/index.php?/cases/view/30125) | `AUTOMATION: READY` | no |
| 15 | SBC-TREE-06 | C30126 | [open](https://shopview.testrail.io/index.php?/cases/view/30126) | `AUTOMATION: READY` | no |
| 16 | SBC-TREE-08 | C30128 | [open](https://shopview.testrail.io/index.php?/cases/view/30128) | `AUTOMATION: READY` | no |
| 17 | SBC-TREE-09 | C30129 | [open](https://shopview.testrail.io/index.php?/cases/view/30129) | `AUTOMATION: READY` | no |
| 18 | SBC-TREE-10 | C30130 | [open](https://shopview.testrail.io/index.php?/cases/view/30130) | `AUTOMATION: READY` | no |
| 19 | SBC-TREE-13 | C30133 | [open](https://shopview.testrail.io/index.php?/cases/view/30133) | `AUTOMATION: READY` | no |
| 20 | SBC-LBL-01 | C30134 | [open](https://shopview.testrail.io/index.php?/cases/view/30134) | `AUTOMATION: READY` | no |
| 21 | SBC-LINK-01 | C30138 | [open](https://shopview.testrail.io/index.php?/cases/view/30138) | `AUTOMATION: READY` | YES |
| 22 | SBC-LINK-02 | C30139 | [open](https://shopview.testrail.io/index.php?/cases/view/30139) | `AUTOMATION: READY` | no |
| 23 | SBC-LINK-03 | C30140 | [open](https://shopview.testrail.io/index.php?/cases/view/30140) | `AUTOMATION: READY` | no |
| 24 | SBC-SORT-02 | C30143 | [open](https://shopview.testrail.io/index.php?/cases/view/30143) | `AUTOMATION: READY` | no |
| 25 | SBC-SORT-04 | C30145 | [open](https://shopview.testrail.io/index.php?/cases/view/30145) | `AUTOMATION: READY` | no |
| 26 | SBC-CALC-02 | C30150 | [open](https://shopview.testrail.io/index.php?/cases/view/30150) | `AUTOMATION: READY` | no |
| 27 | SBC-CALC-05 | C30153 | [open](https://shopview.testrail.io/index.php?/cases/view/30153) | `AUTOMATION: READY` | no |
| 28 | SBC-CALC-06 | C30154 | [open](https://shopview.testrail.io/index.php?/cases/view/30154) | `AUTOMATION: READY` | no |
| 29 | SBC-CALC-07 | C30155 | [open](https://shopview.testrail.io/index.php?/cases/view/30155) | `AUTOMATION: READY` | no |
| 30 | SBC-EXP-01 | C30159 | [open](https://shopview.testrail.io/index.php?/cases/view/30159) | `AUTOMATION: READY` | no |
| 31 | SBC-EXP-05 | C30163 | [open](https://shopview.testrail.io/index.php?/cases/view/30163) | `AUTOMATION: READY` | no |
| 32 | SBC-EXP-06 | C30164 | [open](https://shopview.testrail.io/index.php?/cases/view/30164) | `AUTOMATION: READY` | no |
| 33 | SBC-EXP-10 | C30168 | [open](https://shopview.testrail.io/index.php?/cases/view/30168) | `AUTOMATION: READY` | no |
| 34 | SBC-PERS-01 | C30174 | [open](https://shopview.testrail.io/index.php?/cases/view/30174) | `AUTOMATION: READY` | no |
| 35 | SBC-PERS-02 | C30175 | [open](https://shopview.testrail.io/index.php?/cases/view/30175) | `AUTOMATION: READY` | no |
| 36 | SBC-PERS-04 | C30177 | [open](https://shopview.testrail.io/index.php?/cases/view/30177) | `AUTOMATION: READY` | no |
| 37 | SBC-PERS-06 | C30179 | [open](https://shopview.testrail.io/index.php?/cases/view/30179) | `AUTOMATION: READY` | no |
| 38 | SBC-PERS-07 | C30180 | [open](https://shopview.testrail.io/index.php?/cases/view/30180) | `AUTOMATION: READY` | no |
| 39 | SBC-EMPTY-01 | C30181 | [open](https://shopview.testrail.io/index.php?/cases/view/30181) | `AUTOMATION: READY` | no |
| 40 | SBC-VIS-03 | C30187 | [open](https://shopview.testrail.io/index.php?/cases/view/30187) | `AUTOMATION: READY` | no |
| 41 | SBC-MOB-01 | C30188 | [open](https://shopview.testrail.io/index.php?/cases/view/30188) | `AUTOMATION: READY` | no |
| 42 | SBC-MOB-02 | C30189 | [open](https://shopview.testrail.io/index.php?/cases/view/30189) | `AUTOMATION: READY` | no |
| 43 | SBC-API-01 | C30190 | [open](https://shopview.testrail.io/index.php?/cases/view/30190) | `AUTOMATION: READY` | no |
| 44 | SBC-API-02 | C30191 | [open](https://shopview.testrail.io/index.php?/cases/view/30191) | `AUTOMATION: READY` | no |
| 45 | SBC-API-03 | C30192 | [open](https://shopview.testrail.io/index.php?/cases/view/30192) | `AUTOMATION: READY` | no |
| 46 | SBC-API-04 | C30193 | [open](https://shopview.testrail.io/index.php?/cases/view/30193) | `AUTOMATION: READY` | no |
| 47 | SBR-NAV-01 | C30195 | [open](https://shopview.testrail.io/index.php?/cases/view/30195) | `AUTOMATION: READY` | no |
| 48 | SBR-NAV-03 | C30197 | [open](https://shopview.testrail.io/index.php?/cases/view/30197) | `AUTOMATION: READY` | no |
| 49 | SBR-PERM-01 | C30198 | [open](https://shopview.testrail.io/index.php?/cases/view/30198) | `AUTOMATION: READY` | no |
| 50 | SBR-PERM-02 | C30199 | [open](https://shopview.testrail.io/index.php?/cases/view/30199) | `AUTOMATION: READY` | no |
| 51 | SBR-PERM-03 | C30200 | [open](https://shopview.testrail.io/index.php?/cases/view/30200) | `AUTOMATION: READY` | no |
| 52 | SBR-DATE-01 | C30201 | [open](https://shopview.testrail.io/index.php?/cases/view/30201) | `AUTOMATION: READY` | no |
| 53 | SBR-DATE-04 | C30204 | [open](https://shopview.testrail.io/index.php?/cases/view/30204) | `AUTOMATION: READY` | no |
| 54 | SBR-TYPE-02 | C30206 | [open](https://shopview.testrail.io/index.php?/cases/view/30206) | `AUTOMATION: READY` | no |
| 55 | SBR-STAT-01 | C30208 | [open](https://shopview.testrail.io/index.php?/cases/view/30208) | `AUTOMATION: READY` | no |
| 56 | SBR-STAT-02 | C30209 | [open](https://shopview.testrail.io/index.php?/cases/view/30209) | `AUTOMATION: READY` | no |
| 57 | SBR-STAT-04 | C30211 | [open](https://shopview.testrail.io/index.php?/cases/view/30211) | `AUTOMATION: READY` | no |
| 58 | SBR-STAT-05 | C30212 | [open](https://shopview.testrail.io/index.php?/cases/view/30212) | `AUTOMATION: READY` | no |
| 59 | SBR-LOC-01 | C30213 | [open](https://shopview.testrail.io/index.php?/cases/view/30213) | `AUTOMATION: READY` | no |
| 60 | SBR-LOC-03 | C30215 | [open](https://shopview.testrail.io/index.php?/cases/view/30215) | `AUTOMATION: READY` | no |
| 61 | SBR-LOC-04 | C30216 | [open](https://shopview.testrail.io/index.php?/cases/view/30216) | `AUTOMATION: READY` | no |
| 62 | SBR-ROW-01 | C30217 | [open](https://shopview.testrail.io/index.php?/cases/view/30217) | `AUTOMATION: READY` | YES |
| 63 | SBR-ROW-03 | C30219 | [open](https://shopview.testrail.io/index.php?/cases/view/30219) | `AUTOMATION: READY` | no |
| 64 | SBR-TREE-06 | C30222 | [open](https://shopview.testrail.io/index.php?/cases/view/30222) | `AUTOMATION: READY` | no |
| 65 | SBR-TREE-07 | C30223 | [open](https://shopview.testrail.io/index.php?/cases/view/30223) | `AUTOMATION: READY` | no |
| 66 | SBR-TREE-08 | C30224 | [open](https://shopview.testrail.io/index.php?/cases/view/30224) | `AUTOMATION: READY` | no |
| 67 | SBR-BADGE-02 | C30227 | [open](https://shopview.testrail.io/index.php?/cases/view/30227) | `AUTOMATION: READY` | no |
| 68 | SBR-CALC-05 | C30233 | [open](https://shopview.testrail.io/index.php?/cases/view/30233) | `AUTOMATION: READY` | no |
| 69 | SBR-SORT-02 | C30242 | [open](https://shopview.testrail.io/index.php?/cases/view/30242) | `AUTOMATION: READY` | no |
| 70 | SBR-SORT-03 | C30243 | [open](https://shopview.testrail.io/index.php?/cases/view/30243) | `AUTOMATION: READY` | no |
| 71 | SBR-SORT-04 | C30244 | [open](https://shopview.testrail.io/index.php?/cases/view/30244) | `AUTOMATION: READY` | no |
| 72 | SBR-SORT-05 | C30245 | [open](https://shopview.testrail.io/index.php?/cases/view/30245) | `AUTOMATION: READY` | no |
| 73 | SBR-LINK-01 | C30247 | [open](https://shopview.testrail.io/index.php?/cases/view/30247) | `AUTOMATION: READY` | no |
| 74 | SBR-LINK-03 | C30249 | [open](https://shopview.testrail.io/index.php?/cases/view/30249) | `AUTOMATION: READY` | no |
| 75 | SBR-LINK-04 | C30250 | [open](https://shopview.testrail.io/index.php?/cases/view/30250) | `AUTOMATION: READY` | no |
| 76 | SBR-LINK-05 | C30251 | [open](https://shopview.testrail.io/index.php?/cases/view/30251) | `AUTOMATION: READY` | no |
| 77 | SBR-DEACT-02 | C30253 | [open](https://shopview.testrail.io/index.php?/cases/view/30253) | `AUTOMATION: READY` | no |
| 78 | SBR-DEACT-03 | C30254 | [open](https://shopview.testrail.io/index.php?/cases/view/30254) | `AUTOMATION: READY` | no |
| 79 | SBR-DEACT-04 | C30255 | [open](https://shopview.testrail.io/index.php?/cases/view/30255) | `AUTOMATION: READY` | no |
| 80 | SBR-DEACT-05 | C30256 | [open](https://shopview.testrail.io/index.php?/cases/view/30256) | `AUTOMATION: READY` | no |
| 81 | SBR-DEACT-06 | C30257 | [open](https://shopview.testrail.io/index.php?/cases/view/30257) | `AUTOMATION: READY` | no |
| 82 | SBR-DEACT-07 | C30258 | [open](https://shopview.testrail.io/index.php?/cases/view/30258) | `AUTOMATION: READY` | no |
| 83 | SBR-DEACT-08 | C30259 | [open](https://shopview.testrail.io/index.php?/cases/view/30259) | `AUTOMATION: READY` | no |
| 84 | SBR-DEACT-09 | C30260 | [open](https://shopview.testrail.io/index.php?/cases/view/30260) | `AUTOMATION: READY` | no |
| 85 | SBR-UNAS-01 | C30261 | [open](https://shopview.testrail.io/index.php?/cases/view/30261) | `AUTOMATION: READY` | no |
| 86 | SBR-UNAS-02 | C30262 | [open](https://shopview.testrail.io/index.php?/cases/view/30262) | `AUTOMATION: READY` | YES |
| 87 | SBR-UNAS-04 | C30264 | [open](https://shopview.testrail.io/index.php?/cases/view/30264) | `AUTOMATION: READY` | no |
| 88 | SBR-COL-03 | C30267 | [open](https://shopview.testrail.io/index.php?/cases/view/30267) | `AUTOMATION: READY` | no |
| 89 | SBR-COL-04 | C30268 | [open](https://shopview.testrail.io/index.php?/cases/view/30268) | `AUTOMATION: READY` | no |
| 90 | SBR-COL-05 | C30269 | [open](https://shopview.testrail.io/index.php?/cases/view/30269) | `AUTOMATION: READY` | no |
| 91 | SBR-PERS-01 | C30271 | [open](https://shopview.testrail.io/index.php?/cases/view/30271) | `AUTOMATION: READY` | no |
| 92 | SBR-PERS-02 | C30272 | [open](https://shopview.testrail.io/index.php?/cases/view/30272) | `AUTOMATION: READY` | no |
| 93 | SBR-PERS-05 | C30275 | [open](https://shopview.testrail.io/index.php?/cases/view/30275) | `AUTOMATION: READY` | no |
| 94 | SBR-EXP-01 | C30276 | [open](https://shopview.testrail.io/index.php?/cases/view/30276) | `AUTOMATION: READY` | no |
| 95 | SBR-EXP-05 | C30280 | [open](https://shopview.testrail.io/index.php?/cases/view/30280) | `AUTOMATION: READY` | no |
| 96 | SBR-EXP-07 | C30282 | [open](https://shopview.testrail.io/index.php?/cases/view/30282) | `AUTOMATION: READY` | no |
| 97 | SBR-EXP-08 | C30283 | [open](https://shopview.testrail.io/index.php?/cases/view/30283) | `AUTOMATION: READY` | no |
| 98 | SBR-EXP-13 | C30288 | [open](https://shopview.testrail.io/index.php?/cases/view/30288) | `AUTOMATION: READY` | no |
| 99 | SBR-EXP-14 | C30289 | [open](https://shopview.testrail.io/index.php?/cases/view/30289) | `AUTOMATION: READY` | no |
| 100 | SBR-ASGN-01 | C30292 | [open](https://shopview.testrail.io/index.php?/cases/view/30292) | `AUTOMATION: READY` | no |
| 101 | SBR-ASGN-03 | C30294 | [open](https://shopview.testrail.io/index.php?/cases/view/30294) | `AUTOMATION: READY` | no |
| 102 | SBR-ASGN-04 | C30295 | [open](https://shopview.testrail.io/index.php?/cases/view/30295) | `AUTOMATION: READY` | no |
| 103 | SBR-ASGN-05 | C30296 | [open](https://shopview.testrail.io/index.php?/cases/view/30296) | `AUTOMATION: READY` | no |
| 104 | SBR-ASGN-06 | C30297 | [open](https://shopview.testrail.io/index.php?/cases/view/30297) | `AUTOMATION: READY` | no |
| 105 | SBR-STATE-03 | C30300 | [open](https://shopview.testrail.io/index.php?/cases/view/30300) | `AUTOMATION: READY` | no |
| 106 | SBR-STATE-04 | C30301 | [open](https://shopview.testrail.io/index.php?/cases/view/30301) | `AUTOMATION: READY` | no |
| 107 | SBR-MOB-01 | C30302 | [open](https://shopview.testrail.io/index.php?/cases/view/30302) | `AUTOMATION: READY` | no |
| 108 | SBR-MOB-02 | C30303 | [open](https://shopview.testrail.io/index.php?/cases/view/30303) | `AUTOMATION: READY` | no |
| 109 | SBR-VIS-04 | C30308 | [open](https://shopview.testrail.io/index.php?/cases/view/30308) | `AUTOMATION: READY` | no |
| 110 | SBR-WO-03 | C30312 | [open](https://shopview.testrail.io/index.php?/cases/view/30312) | `AUTOMATION: READY` | no |
| 111 | SBR-WO-04 | C30313 | [open](https://shopview.testrail.io/index.php?/cases/view/30313) | `AUTOMATION: READY` | no |
| 112 | SBR-WO-05 | C30314 | [open](https://shopview.testrail.io/index.php?/cases/view/30314) | `AUTOMATION: READY` | YES |
| 113 | SBR-API-01 | C30316 | [open](https://shopview.testrail.io/index.php?/cases/view/30316) | `AUTOMATION: READY` | no |
| 114 | SBR-API-02 | C30317 | [open](https://shopview.testrail.io/index.php?/cases/view/30317) | `AUTOMATION: READY` | no |
| 115 | SBR-API-03 | C30318 | [open](https://shopview.testrail.io/index.php?/cases/view/30318) | `AUTOMATION: READY` | no |
| 116 | SBR-API-04 | C30319 | [open](https://shopview.testrail.io/index.php?/cases/view/30319) | `AUTOMATION: READY` | no |
| 117 | SBR-API-06 | C30321 | [open](https://shopview.testrail.io/index.php?/cases/view/30321) | `AUTOMATION: READY` | no |
| 118 | PV-NAV-01 | C30322 | [open](https://shopview.testrail.io/index.php?/cases/view/30322) | `AUTOMATION: READY` | no |
| 119 | PV-NAV-02 | C30323 | [open](https://shopview.testrail.io/index.php?/cases/view/30323) | `AUTOMATION: READY` | no |
| 120 | PV-NAV-03 | C30324 | [open](https://shopview.testrail.io/index.php?/cases/view/30324) | `AUTOMATION: READY` | no |
| 121 | PV-PERM-01 | C30325 | [open](https://shopview.testrail.io/index.php?/cases/view/30325) | `AUTOMATION: READY` | no |
| 122 | PV-PERM-02 | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | `AUTOMATION: READY` | YES |
| 123 | PV-PERM-03 | C30327 | [open](https://shopview.testrail.io/index.php?/cases/view/30327) | `AUTOMATION: READY` | no |
| 124 | PV-FILT-01 | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | `AUTOMATION: READY` | YES |
| 125 | PV-FILT-03 | C30330 | [open](https://shopview.testrail.io/index.php?/cases/view/30330) | `AUTOMATION: READY` | no |
| 126 | PV-FILT-04 | C30331 | [open](https://shopview.testrail.io/index.php?/cases/view/30331) | `AUTOMATION: READY` | no |
| 127 | PV-FILT-05 | C30332 | [open](https://shopview.testrail.io/index.php?/cases/view/30332) | `AUTOMATION: READY` | no |
| 128 | PV-FILT-06 | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | `AUTOMATION: READY` | YES |
| 129 | PV-FILT-07 | C30334 | [open](https://shopview.testrail.io/index.php?/cases/view/30334) | `AUTOMATION: READY` | no |
| 130 | PV-FILT-08 | C30335 | [open](https://shopview.testrail.io/index.php?/cases/view/30335) | `AUTOMATION: READY` | no |
| 131 | PV-FILT-09 | C30336 | [open](https://shopview.testrail.io/index.php?/cases/view/30336) | `AUTOMATION: READY` | no |
| 132 | PV-FILT-11 | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | `AUTOMATION: READY` | YES |
| 133 | PV-FILT-12 | C30339 | [open](https://shopview.testrail.io/index.php?/cases/view/30339) | `AUTOMATION: READY` | no |
| 134 | PV-FILT-13 | C30340 | [open](https://shopview.testrail.io/index.php?/cases/view/30340) | `AUTOMATION: READY` | no |
| 135 | PV-ROW-01 | C30341 | [open](https://shopview.testrail.io/index.php?/cases/view/30341) | `AUTOMATION: READY` | no |
| 136 | PV-ROW-02 | C30342 | [open](https://shopview.testrail.io/index.php?/cases/view/30342) | `AUTOMATION: READY` | no |
| 137 | PV-ROW-03 | C30343 | [open](https://shopview.testrail.io/index.php?/cases/view/30343) | `AUTOMATION: READY` | no |
| 138 | PV-ROW-04 | C30344 | [open](https://shopview.testrail.io/index.php?/cases/view/30344) | `AUTOMATION: READY` | no |
| 139 | PV-ROW-05 | C30345 | [open](https://shopview.testrail.io/index.php?/cases/view/30345) | `AUTOMATION: READY` | no |
| 140 | PV-ROW-08 | C30348 | [open](https://shopview.testrail.io/index.php?/cases/view/30348) | `AUTOMATION: READY` | no |
| 141 | PV-ROW-09 | C30349 | [open](https://shopview.testrail.io/index.php?/cases/view/30349) | `AUTOMATION: READY` | no |
| 142 | PV-COL-04 | C30354 | [open](https://shopview.testrail.io/index.php?/cases/view/30354) | `AUTOMATION: READY` | no |
| 143 | PV-COL-05 | C30355 | [open](https://shopview.testrail.io/index.php?/cases/view/30355) | `AUTOMATION: READY` | no |
| 144 | PV-COL-06 | C30356 | [open](https://shopview.testrail.io/index.php?/cases/view/30356) | `AUTOMATION: READY` | no |
| 145 | PV-COL-08 | C30358 | [open](https://shopview.testrail.io/index.php?/cases/view/30358) | `AUTOMATION: READY` | no |
| 146 | PV-CALC-01 | C30359 | [open](https://shopview.testrail.io/index.php?/cases/view/30359) | `AUTOMATION: READY` | no |
| 147 | PV-CALC-02 | C30360 | [open](https://shopview.testrail.io/index.php?/cases/view/30360) | `AUTOMATION: READY` | no |
| 148 | PV-CALC-03 | C30361 | [open](https://shopview.testrail.io/index.php?/cases/view/30361) | `AUTOMATION: READY` | no |
| 149 | PV-CALC-04 | C30362 | [open](https://shopview.testrail.io/index.php?/cases/view/30362) | `AUTOMATION: READY` | no |
| 150 | PV-CALC-05 | C30363 | [open](https://shopview.testrail.io/index.php?/cases/view/30363) | `AUTOMATION: READY` | no |
| 151 | PV-CALC-06 | C30364 | [open](https://shopview.testrail.io/index.php?/cases/view/30364) | `AUTOMATION: READY` | no |
| 152 | PV-CALC-07 | C30365 | [open](https://shopview.testrail.io/index.php?/cases/view/30365) | `AUTOMATION: READY` | no |
| 153 | PV-CALC-08 | C30366 | [open](https://shopview.testrail.io/index.php?/cases/view/30366) | `AUTOMATION: READY` | no |
| 154 | PV-CALC-09 | C30367 | [open](https://shopview.testrail.io/index.php?/cases/view/30367) | `AUTOMATION: READY` | no |
| 155 | PV-EXP-01 | C30375 | [open](https://shopview.testrail.io/index.php?/cases/view/30375) | `AUTOMATION: READY` | no |
| 156 | PV-EXP-02 | C30376 | [open](https://shopview.testrail.io/index.php?/cases/view/30376) | `AUTOMATION: READY` | no |
| 157 | PV-EXP-03 | C30377 | [open](https://shopview.testrail.io/index.php?/cases/view/30377) | `AUTOMATION: READY` | no |
| 158 | PV-EXP-04 | C30378 | [open](https://shopview.testrail.io/index.php?/cases/view/30378) | `AUTOMATION: READY` | no |
| 159 | PV-EXP-08 | C30382 | [open](https://shopview.testrail.io/index.php?/cases/view/30382) | `AUTOMATION: READY` | no |
| 160 | PV-VIS-01 | C30385 | [open](https://shopview.testrail.io/index.php?/cases/view/30385) | `AUTOMATION: READY` | no |
| 161 | PV-VIS-02 | C30386 | [open](https://shopview.testrail.io/index.php?/cases/view/30386) | `AUTOMATION: READY` | no |
| 162 | PV-VIS-03 | C30387 | [open](https://shopview.testrail.io/index.php?/cases/view/30387) | `AUTOMATION: READY` | no |
| 163 | PV-API-01 | C30388 | [open](https://shopview.testrail.io/index.php?/cases/view/30388) | `AUTOMATION: READY` | no |
| 164 | PV-API-02 | C30389 | [open](https://shopview.testrail.io/index.php?/cases/view/30389) | `AUTOMATION: READY` | no |
| 165 | PV-API-03 | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | `AUTOMATION: READY` | YES |
| 166 | PV-API-04 | C30391 | [open](https://shopview.testrail.io/index.php?/cases/view/30391) | `AUTOMATION: READY` | no |
| 167 | TU-NAV-01 | C30392 | [open](https://shopview.testrail.io/index.php?/cases/view/30392) | `AUTOMATION: READY` | no |
| 168 | TU-NAV-02 | C30393 | [open](https://shopview.testrail.io/index.php?/cases/view/30393) | `AUTOMATION: READY` | no |
| 169 | TU-NAV-04 | C30395 | [open](https://shopview.testrail.io/index.php?/cases/view/30395) | `AUTOMATION: READY` | no |
| 170 | TU-NAV-05 | C30396 | [open](https://shopview.testrail.io/index.php?/cases/view/30396) | `AUTOMATION: READY` | no |
| 171 | TU-NAV-06 | C30397 | [open](https://shopview.testrail.io/index.php?/cases/view/30397) | `AUTOMATION: READY` | no |
| 172 | TU-NAV-08 | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | `AUTOMATION: READY` | YES |
| 173 | TU-HRS-02 | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | `AUTOMATION: READY` | YES |
| 174 | TU-HRS-03 | C30402 | [open](https://shopview.testrail.io/index.php?/cases/view/30402) | `AUTOMATION: READY` | no |
| 175 | TU-HRS-04 | C30403 | [open](https://shopview.testrail.io/index.php?/cases/view/30403) | `AUTOMATION: READY` | no |
| 176 | TU-ELL-01 | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | `AUTOMATION: READY` | YES |
| 177 | TU-ELL-02 | C30405 | [open](https://shopview.testrail.io/index.php?/cases/view/30405) | `AUTOMATION: READY` | no |
| 178 | TU-ELL-03 | C30406 | [open](https://shopview.testrail.io/index.php?/cases/view/30406) | `AUTOMATION: READY` | no |
| 179 | TU-SORT-01 | C30409 | [open](https://shopview.testrail.io/index.php?/cases/view/30409) | `AUTOMATION: READY` | no |
| 180 | TU-SORT-02 | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | `AUTOMATION: READY` | YES |
| 181 | TU-SORT-03 | C30411 | [open](https://shopview.testrail.io/index.php?/cases/view/30411) | `AUTOMATION: READY` | no |
| 182 | TU-SORT-04 | C30412 | [open](https://shopview.testrail.io/index.php?/cases/view/30412) | `AUTOMATION: READY` | no |
| 183 | TU-SUM-01 | C30414 | [open](https://shopview.testrail.io/index.php?/cases/view/30414) | `AUTOMATION: READY` | no |
| 184 | TU-SUM-02 | C30415 | [open](https://shopview.testrail.io/index.php?/cases/view/30415) | `AUTOMATION: READY` | no |
| 185 | TU-SUM-03 | C30416 | [open](https://shopview.testrail.io/index.php?/cases/view/30416) | `AUTOMATION: READY` | no |
| 186 | TU-SUM-04 | C30417 | [open](https://shopview.testrail.io/index.php?/cases/view/30417) | `AUTOMATION: READY` | no |
| 187 | TU-DAY-02 | C30419 | [open](https://shopview.testrail.io/index.php?/cases/view/30419) | `AUTOMATION: READY` | no |
| 188 | TU-DAY-03 | C30420 | [open](https://shopview.testrail.io/index.php?/cases/view/30420) | `AUTOMATION: READY` | no |
| 189 | TU-DAY-05 | C30422 | [open](https://shopview.testrail.io/index.php?/cases/view/30422) | `AUTOMATION: READY` | no |
| 190 | TU-TECH-01 | C30423 | [open](https://shopview.testrail.io/index.php?/cases/view/30423) | `AUTOMATION: READY` | no |
| 191 | TU-TECH-04 | C30426 | [open](https://shopview.testrail.io/index.php?/cases/view/30426) | `AUTOMATION: READY` | no |
| 192 | TU-LINK-02 | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | `AUTOMATION: READY` | YES |
| 193 | TU-EXP-01 | C30434 | [open](https://shopview.testrail.io/index.php?/cases/view/30434) | `AUTOMATION: READY` | no |
| 194 | TU-EXP-06 | C30439 | [open](https://shopview.testrail.io/index.php?/cases/view/30439) | `AUTOMATION: READY` | no |
| 195 | TU-LOC-01 | C30442 | [open](https://shopview.testrail.io/index.php?/cases/view/30442) | `AUTOMATION: READY` | no |
| 196 | TU-LOC-02 | C30443 | [open](https://shopview.testrail.io/index.php?/cases/view/30443) | `AUTOMATION: READY` | no |
| 197 | TU-LOC-03 | C30444 | [open](https://shopview.testrail.io/index.php?/cases/view/30444) | `AUTOMATION: READY` | no |
| 198 | TU-VIS-01 | C30447 | [open](https://shopview.testrail.io/index.php?/cases/view/30447) | `AUTOMATION: READY` | no |
| 199 | TU-VIS-02 | C30448 | [open](https://shopview.testrail.io/index.php?/cases/view/30448) | `AUTOMATION: READY` | no |
| 200 | TU-API-01 | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | `AUTOMATION: READY` | YES |
| 201 | WIP-TAB-01 | C30451 | [open](https://shopview.testrail.io/index.php?/cases/view/30451) | `AUTOMATION: READY` | no |
| 202 | WIP-TAB-02 | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | `AUTOMATION: READY` | YES |
| 203 | WIP-TAB-05 | C30455 | [open](https://shopview.testrail.io/index.php?/cases/view/30455) | `AUTOMATION: READY` | no |
| 204 | WIP-COL-04 | C30469 | [open](https://shopview.testrail.io/index.php?/cases/view/30469) | `AUTOMATION: READY` | no |
| 205 | WIP-COL-06 | C30471 | [open](https://shopview.testrail.io/index.php?/cases/view/30471) | `AUTOMATION: READY` | no |
| 206 | WIP-COL-07 | C30472 | [open](https://shopview.testrail.io/index.php?/cases/view/30472) | `AUTOMATION: READY` | no |
| 207 | WIP-COL-08 | C30473 | [open](https://shopview.testrail.io/index.php?/cases/view/30473) | `AUTOMATION: READY` | no |
| 208 | WIP-CALC-01 | C30474 | [open](https://shopview.testrail.io/index.php?/cases/view/30474) | `AUTOMATION: READY` | no |
| 209 | WIP-CALC-02 | C30475 | [open](https://shopview.testrail.io/index.php?/cases/view/30475) | `AUTOMATION: READY` | no |
| 210 | WIP-CALC-03 | C30476 | [open](https://shopview.testrail.io/index.php?/cases/view/30476) | `AUTOMATION: READY` | no |
| 211 | WIP-CALC-04 | C30477 | [open](https://shopview.testrail.io/index.php?/cases/view/30477) | `AUTOMATION: READY` | no |
| 212 | WIP-CALC-05 | C30478 | [open](https://shopview.testrail.io/index.php?/cases/view/30478) | `AUTOMATION: READY` | no |
| 213 | WIP-CALC-07 | C30480 | [open](https://shopview.testrail.io/index.php?/cases/view/30480) | `AUTOMATION: READY` | no |
| 214 | WIP-CALC-09 | C30482 | [open](https://shopview.testrail.io/index.php?/cases/view/30482) | `AUTOMATION: READY` | no |
| 215 | WIP-SORT-01 | C30483 | [open](https://shopview.testrail.io/index.php?/cases/view/30483) | `AUTOMATION: READY` | no |
| 216 | WIP-SORT-02 | C30484 | [open](https://shopview.testrail.io/index.php?/cases/view/30484) | `AUTOMATION: READY` | no |
| 217 | WIP-SORT-03 | C30485 | [open](https://shopview.testrail.io/index.php?/cases/view/30485) | `AUTOMATION: READY` | no |
| 218 | WIP-SORT-04 | C30486 | [open](https://shopview.testrail.io/index.php?/cases/view/30486) | `AUTOMATION: READY` | no |
| 219 | WIP-SUM-01 | C30487 | [open](https://shopview.testrail.io/index.php?/cases/view/30487) | `AUTOMATION: READY` | no |
| 220 | WIP-SUM-02 | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | `AUTOMATION: READY` | YES |
| 221 | WIP-SUM-03 | C30489 | [open](https://shopview.testrail.io/index.php?/cases/view/30489) | `AUTOMATION: READY` | no |
| 222 | WIP-SUM-04 | C30490 | [open](https://shopview.testrail.io/index.php?/cases/view/30490) | `AUTOMATION: READY` | no |
| 223 | WIP-TOT-01 | C30494 | [open](https://shopview.testrail.io/index.php?/cases/view/30494) | `AUTOMATION: READY` | no |
| 224 | WIP-FLT-06 | C30503 | [open](https://shopview.testrail.io/index.php?/cases/view/30503) | `AUTOMATION: READY` | no |
| 225 | WIP-FLT-07 | C30504 | [open](https://shopview.testrail.io/index.php?/cases/view/30504) | `AUTOMATION: READY` | no |
| 226 | WIP-PERS-01 | C30506 | [open](https://shopview.testrail.io/index.php?/cases/view/30506) | `AUTOMATION: READY` | no |
| 227 | WIP-PERS-04 | C30509 | [open](https://shopview.testrail.io/index.php?/cases/view/30509) | `AUTOMATION: READY` | no |
| 228 | WIP-EXP-01 | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | `AUTOMATION: READY` | YES |
| 229 | WIP-EXP-06 | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | `AUTOMATION: READY` | YES |
| 230 | WIP-EXP-07 | C30516 | [open](https://shopview.testrail.io/index.php?/cases/view/30516) | `AUTOMATION: READY` | no |
| 231 | WIP-EXP-08 | C30517 | [open](https://shopview.testrail.io/index.php?/cases/view/30517) | `AUTOMATION: READY` | no |
| 232 | WIP-VIS-02 | C30520 | [open](https://shopview.testrail.io/index.php?/cases/view/30520) | `AUTOMATION: READY` | no |
| 233 | WIP-VIS-03 | C30521 | [open](https://shopview.testrail.io/index.php?/cases/view/30521) | `AUTOMATION: READY` | no |
| 234 | WIP-VIS-04 | C30522 | [open](https://shopview.testrail.io/index.php?/cases/view/30522) | `AUTOMATION: READY` | no |
| 235 | WIP-VIS-06 | C30524 | [open](https://shopview.testrail.io/index.php?/cases/view/30524) | `AUTOMATION: READY` | no |
| 236 | WIP-PERM-01 | C30526 | [open](https://shopview.testrail.io/index.php?/cases/view/30526) | `AUTOMATION: READY` | no |
| 237 | WIP-PERM-02 | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | `AUTOMATION: READY` | YES |
| 238 | IV-NAV-01 | C30534 | [open](https://shopview.testrail.io/index.php?/cases/view/30534) | `AUTOMATION: READY` | no |
| 239 | IV-NAV-05 | C30538 | [open](https://shopview.testrail.io/index.php?/cases/view/30538) | `AUTOMATION: READY` | no |
| 240 | IV-SCOPE-01 | C30540 | [open](https://shopview.testrail.io/index.php?/cases/view/30540) | `AUTOMATION: READY` | no |
| 241 | IV-SCOPE-02 | C30541 | [open](https://shopview.testrail.io/index.php?/cases/view/30541) | `AUTOMATION: READY` | no |
| 242 | IV-CALC-01 | C30545 | [open](https://shopview.testrail.io/index.php?/cases/view/30545) | `AUTOMATION: READY` | no |
| 243 | IV-CALC-02 | C30546 | [open](https://shopview.testrail.io/index.php?/cases/view/30546) | `AUTOMATION: READY` | no |
| 244 | IV-CALC-04 | C30548 | [open](https://shopview.testrail.io/index.php?/cases/view/30548) | `AUTOMATION: READY` | no |
| 245 | IV-CALC-05 | C30549 | [open](https://shopview.testrail.io/index.php?/cases/view/30549) | `AUTOMATION: READY` | no |
| 246 | IV-CALC-06 | C30550 | [open](https://shopview.testrail.io/index.php?/cases/view/30550) | `AUTOMATION: READY` | no |
| 247 | IV-COL-01 | C30551 | [open](https://shopview.testrail.io/index.php?/cases/view/30551) | `AUTOMATION: READY` | no |
| 248 | IV-COL-02 | C30552 | [open](https://shopview.testrail.io/index.php?/cases/view/30552) | `AUTOMATION: READY` | no |
| 249 | IV-COL-03 | C30553 | [open](https://shopview.testrail.io/index.php?/cases/view/30553) | `AUTOMATION: READY` | no |
| 250 | IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | `AUTOMATION: READY` | no |
| 251 | IV-COL-05 | C30555 | [open](https://shopview.testrail.io/index.php?/cases/view/30555) | `AUTOMATION: READY` | no |
| 252 | IV-TOT-02 | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | `AUTOMATION: READY` | YES |
| 253 | IV-TOT-03 | C30558 | [open](https://shopview.testrail.io/index.php?/cases/view/30558) | `AUTOMATION: READY` | no |
| 254 | IV-DATE-08 | C30568 | [open](https://shopview.testrail.io/index.php?/cases/view/30568) | `AUTOMATION: READY` | no |
| 255 | IV-FLT-01 | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | `AUTOMATION: READY` | YES |
| 256 | IV-FLT-03 | C30571 | [open](https://shopview.testrail.io/index.php?/cases/view/30571) | `AUTOMATION: READY` | no |
| 257 | IV-FLT-04 | C30572 | [open](https://shopview.testrail.io/index.php?/cases/view/30572) | `AUTOMATION: READY` | no |
| 258 | IV-LOC-02 | C30575 | [open](https://shopview.testrail.io/index.php?/cases/view/30575) | `AUTOMATION: READY` | no |
| 259 | IV-LOC-03 | C30576 | [open](https://shopview.testrail.io/index.php?/cases/view/30576) | `AUTOMATION: READY` | no |
| 260 | IV-PERS-01 | C30579 | [open](https://shopview.testrail.io/index.php?/cases/view/30579) | `AUTOMATION: READY` | no |
| 261 | IV-PERS-02 | C30580 | [open](https://shopview.testrail.io/index.php?/cases/view/30580) | `AUTOMATION: READY` | no |
| 262 | IV-SORT-01 | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | `AUTOMATION: READY` | YES |
| 263 | IV-SORT-02 | C30584 | [open](https://shopview.testrail.io/index.php?/cases/view/30584) | `AUTOMATION: READY` | no |
| 264 | IV-SORT-03 | C30585 | [open](https://shopview.testrail.io/index.php?/cases/view/30585) | `AUTOMATION: READY` | no |
| 265 | IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | `AUTOMATION: READY` | no |
| 266 | IV-EXP-06 | C30592 | [open](https://shopview.testrail.io/index.php?/cases/view/30592) | `AUTOMATION: READY` | no |
| 267 | IV-VIS-01 | C30596 | [open](https://shopview.testrail.io/index.php?/cases/view/30596) | `AUTOMATION: READY` | no |
| 268 | IV-VIS-02 | C30597 | [open](https://shopview.testrail.io/index.php?/cases/view/30597) | `AUTOMATION: READY` | no |
| 269 | IV-VIS-05 | C30600 | [open](https://shopview.testrail.io/index.php?/cases/view/30600) | `AUTOMATION: READY` | no |
| 270 | IV-VIS-07 | C30602 | [open](https://shopview.testrail.io/index.php?/cases/view/30602) | `AUTOMATION: READY` | no |
| 271 | TU-COL-01 | C38859 | [open](https://shopview.testrail.io/index.php?/cases/view/38859) | `AUTOMATION: READY` | no |
| 272 | WIP-CALC-10 | C38890 | [open](https://shopview.testrail.io/index.php?/cases/view/38890) | `AUTOMATION: READY` | no |
| 273 | IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | `AUTOMATION: READY` | no |
| 274 | PV-PREC-01 | C38924 | [open](https://shopview.testrail.io/index.php?/cases/view/38924) | `AUTOMATION: READY` | no |
| 275 | PV-PREC-02 | C38925 | [open](https://shopview.testrail.io/index.php?/cases/view/38925) | `AUTOMATION: READY` | no |
| 276 | SBC-PERM-05 | C39447 | [open](https://shopview.testrail.io/index.php?/cases/view/39447) | `AUTOMATION: READY` | no |
| 277 | SBC-API-06 | C43546 | [open](https://shopview.testrail.io/index.php?/cases/view/43546) | `AUTOMATION: READY` | no |
| 278 | SBC-COL-04 | C43550 | [open](https://shopview.testrail.io/index.php?/cases/view/43550) | `AUTOMATION: READY` | no |
| 279 | WIP-CALC-11 | C43592 | [open](https://shopview.testrail.io/index.php?/cases/view/43592) | `AUTOMATION: READY` | no |
| 280 | WIP-CALC-12 | C43593 | [open](https://shopview.testrail.io/index.php?/cases/view/43593) | `AUTOMATION: READY` | no |
| 281 | WIP-CALC-13 | C43594 | [open](https://shopview.testrail.io/index.php?/cases/view/43594) | `AUTOMATION: READY` | no |

### Filters — 40 reference-only cases

| # | Internal ID | C-id | Link | Prior marker (to restore) | Automated? |
|--:|---|---|---|---|:--:|
| 1 | FLT-STAT-02 | C29561 | [open](https://shopview.testrail.io/index.php?/cases/view/29561) | `AUTOMATION: READY` | no |
| 2 | FLT-STAT-03 | C29562 | [open](https://shopview.testrail.io/index.php?/cases/view/29562) | `AUTOMATION: READY` | no |
| 3 | FLT-STAT-04 | C29563 | [open](https://shopview.testrail.io/index.php?/cases/view/29563) | `AUTOMATION: READY` | no |
| 4 | FLT-STAT-05 | C29564 | [open](https://shopview.testrail.io/index.php?/cases/view/29564) | `AUTOMATION: READY` | no |
| 5 | FLT-STAT-06 | C29565 | [open](https://shopview.testrail.io/index.php?/cases/view/29565) | `AUTOMATION: READY` | no |
| 6 | FLT-ASSET-02 | C29590 | [open](https://shopview.testrail.io/index.php?/cases/view/29590) | `AUTOMATION: READY` | no |
| 7 | FLT-ASSET-04 | C29592 | [open](https://shopview.testrail.io/index.php?/cases/view/29592) | `AUTOMATION: READY` | no |
| 8 | FLT-ASSET-05 | C29593 | [open](https://shopview.testrail.io/index.php?/cases/view/29593) | `AUTOMATION: READY` | no |
| 9 | FLT-ASSET-06 | C29594 | [open](https://shopview.testrail.io/index.php?/cases/view/29594) | `AUTOMATION: READY` | no |
| 10 | FLT-CHIP-01 | C29595 | [open](https://shopview.testrail.io/index.php?/cases/view/29595) | `AUTOMATION: READY` | no |
| 11 | FLT-CHIP-02 | C29596 | [open](https://shopview.testrail.io/index.php?/cases/view/29596) | `AUTOMATION: READY` | no |
| 12 | FLT-EMPTY-01 | C29606 | [open](https://shopview.testrail.io/index.php?/cases/view/29606) | `AUTOMATION: READY` | no |
| 13 | FLT-PERS-02 | C29614 | [open](https://shopview.testrail.io/index.php?/cases/view/29614) | `AUTOMATION: READY` | YES |
| 14 | FLT-PERS-03 | C29615 | [open](https://shopview.testrail.io/index.php?/cases/view/29615) | `AUTOMATION: READY` | no |
| 15 | FLT-URL-01 | C29617 | [open](https://shopview.testrail.io/index.php?/cases/view/29617) | `AUTOMATION: READY` | no |
| 16 | FLT-URL-02 | C29618 | [open](https://shopview.testrail.io/index.php?/cases/view/29618) | `AUTOMATION: READY` | no |
| 17 | FLT-MOB-09 | C29629 | [open](https://shopview.testrail.io/index.php?/cases/view/29629) | `AUTOMATION: READY` | no |
| 18 | FLT-MOB-10 | C29630 | [open](https://shopview.testrail.io/index.php?/cases/view/29630) | `AUTOMATION: READY` | no |
| 19 | FLT-API-01 | C29631 | [open](https://shopview.testrail.io/index.php?/cases/view/29631) | `AUTOMATION: READY` | no |
| 20 | FLT-API-02 | C29632 | [open](https://shopview.testrail.io/index.php?/cases/view/29632) | `AUTOMATION: READY` | no |
| 21 | FLT-API-03 | C29633 | [open](https://shopview.testrail.io/index.php?/cases/view/29633) | `AUTOMATION: READY` | no |
| 22 | FLT-API-05 | C29635 | [open](https://shopview.testrail.io/index.php?/cases/view/29635) | `AUTOMATION: READY` | no |
| 23 | FLT-TAB-06 | C38876 | [open](https://shopview.testrail.io/index.php?/cases/view/38876) | `AUTOMATION: READY` | no |
| 24 | FLT-STAT-07 | C38877 | [open](https://shopview.testrail.io/index.php?/cases/view/38877) | `AUTOMATION: READY` | YES |
| 25 | FLT-ASSET-07 | C38878 | [open](https://shopview.testrail.io/index.php?/cases/view/38878) | `AUTOMATION: READY` | no |
| 26 | FLT-URL-05 | C38879 | [open](https://shopview.testrail.io/index.php?/cases/view/38879) | `AUTOMATION: READY` | no |
| 27 | FLT-PSRCH-01 | C38883 | [open](https://shopview.testrail.io/index.php?/cases/view/38883) | `AUTOMATION: READY` | no |
| 28 | FLT-PSRCH-02 | C38884 | [open](https://shopview.testrail.io/index.php?/cases/view/38884) | `AUTOMATION: READY` | no |
| 29 | FLT-PSRCH-04 | C38888 | [open](https://shopview.testrail.io/index.php?/cases/view/38888) | `AUTOMATION: READY` | no |
| 30 | FLT-PSRCH-07 | C38893 | [open](https://shopview.testrail.io/index.php?/cases/view/38893) | `AUTOMATION: READY` | no |
| 31 | FLT-API-06 | C38895 | [open](https://shopview.testrail.io/index.php?/cases/view/38895) | `AUTOMATION: READY` | no |
| 32 | FLT-URL-06 | C38896 | [open](https://shopview.testrail.io/index.php?/cases/view/38896) | `AUTOMATION: READY` | no |
| 33 | FLT-EMPTY-03 | C38897 | [open](https://shopview.testrail.io/index.php?/cases/view/38897) | `AUTOMATION: READY` | no |
| 34 | FLT-PSRCH-08 | C38898 | [open](https://shopview.testrail.io/index.php?/cases/view/38898) | `AUTOMATION: READY` | no |
| 35 | FLT-PSRCH-09 | C38899 | [open](https://shopview.testrail.io/index.php?/cases/view/38899) | `AUTOMATION: READY` | no |
| 36 | FLT-PSRCH-10 | C38900 | [open](https://shopview.testrail.io/index.php?/cases/view/38900) | `AUTOMATION: READY` | no |
| 37 | FLT-PSRCH-12 | C38902 | [open](https://shopview.testrail.io/index.php?/cases/view/38902) | `AUTOMATION: READY` | no |
| 38 | FLT-PERS-07 | C43560 | [open](https://shopview.testrail.io/index.php?/cases/view/43560) | `AUTOMATION: READY` | no |
| 39 | FLT-PSRCH-14 | C43561 | [open](https://shopview.testrail.io/index.php?/cases/view/43561) | `AUTOMATION: READY` | no |
| 40 | FLT-MOB-11 | C43563 | [open](https://shopview.testrail.io/index.php?/cases/view/43563) | `AUTOMATION: READY` | no |

---

## §3 — Automated cases in the fix set (Rule-71 handling required)

These reference-only wrongly-marked cases are TestRail-flagged **Automated** (`custom_atmstatus = 3`),
set by Vladimir Tomovic (user id 1). **Do not edit them without asking the QA lead first**, and only
coupled with build verification, then hand the case number to Vlad (Rule 71, 2026-08-18 refinement).

| Project | Internal ID | C-id | Link | Prior marker (to restore) |
|---|---|---|---|---|
| Report Suite | SBC-TREE-01 | C30121 | [open](https://shopview.testrail.io/index.php?/cases/view/30121) | `AUTOMATION: READY` |
| Report Suite | SBC-TREE-03 | C30123 | [open](https://shopview.testrail.io/index.php?/cases/view/30123) | `AUTOMATION: READY` |
| Report Suite | SBC-LINK-01 | C30138 | [open](https://shopview.testrail.io/index.php?/cases/view/30138) | `AUTOMATION: READY` |
| Report Suite | SBR-ROW-01 | C30217 | [open](https://shopview.testrail.io/index.php?/cases/view/30217) | `AUTOMATION: READY` |
| Report Suite | SBR-UNAS-02 | C30262 | [open](https://shopview.testrail.io/index.php?/cases/view/30262) | `AUTOMATION: READY` |
| Report Suite | SBR-WO-05 | C30314 | [open](https://shopview.testrail.io/index.php?/cases/view/30314) | `AUTOMATION: READY` |
| Report Suite | PV-PERM-02 | C30326 | [open](https://shopview.testrail.io/index.php?/cases/view/30326) | `AUTOMATION: READY` |
| Report Suite | PV-FILT-01 | C30328 | [open](https://shopview.testrail.io/index.php?/cases/view/30328) | `AUTOMATION: READY` |
| Report Suite | PV-FILT-06 | C30333 | [open](https://shopview.testrail.io/index.php?/cases/view/30333) | `AUTOMATION: READY` |
| Report Suite | PV-FILT-11 | C30338 | [open](https://shopview.testrail.io/index.php?/cases/view/30338) | `AUTOMATION: READY` |
| Report Suite | PV-API-03 | C30390 | [open](https://shopview.testrail.io/index.php?/cases/view/30390) | `AUTOMATION: READY` |
| Report Suite | TU-NAV-08 | C30399 | [open](https://shopview.testrail.io/index.php?/cases/view/30399) | `AUTOMATION: READY` |
| Report Suite | TU-HRS-02 | C30401 | [open](https://shopview.testrail.io/index.php?/cases/view/30401) | `AUTOMATION: READY` |
| Report Suite | TU-ELL-01 | C30404 | [open](https://shopview.testrail.io/index.php?/cases/view/30404) | `AUTOMATION: READY` |
| Report Suite | TU-SORT-02 | C30410 | [open](https://shopview.testrail.io/index.php?/cases/view/30410) | `AUTOMATION: READY` |
| Report Suite | TU-LINK-02 | C30429 | [open](https://shopview.testrail.io/index.php?/cases/view/30429) | `AUTOMATION: READY` |
| Report Suite | TU-API-01 | C30449 | [open](https://shopview.testrail.io/index.php?/cases/view/30449) | `AUTOMATION: READY` |
| Report Suite | WIP-TAB-02 | C30452 | [open](https://shopview.testrail.io/index.php?/cases/view/30452) | `AUTOMATION: READY` |
| Report Suite | WIP-SUM-02 | C30488 | [open](https://shopview.testrail.io/index.php?/cases/view/30488) | `AUTOMATION: READY` |
| Report Suite | WIP-EXP-01 | C30510 | [open](https://shopview.testrail.io/index.php?/cases/view/30510) | `AUTOMATION: READY` |
| Report Suite | WIP-EXP-06 | C30515 | [open](https://shopview.testrail.io/index.php?/cases/view/30515) | `AUTOMATION: READY` |
| Report Suite | WIP-PERM-02 | C30527 | [open](https://shopview.testrail.io/index.php?/cases/view/30527) | `AUTOMATION: READY` |
| Report Suite | IV-TOT-02 | C30557 | [open](https://shopview.testrail.io/index.php?/cases/view/30557) | `AUTOMATION: READY` |
| Report Suite | IV-FLT-01 | C30569 | [open](https://shopview.testrail.io/index.php?/cases/view/30569) | `AUTOMATION: READY` |
| Report Suite | IV-SORT-01 | C30583 | [open](https://shopview.testrail.io/index.php?/cases/view/30583) | `AUTOMATION: READY` |
| Filters | FLT-PERS-02 | C29614 | [open](https://shopview.testrail.io/index.php?/cases/view/29614) | `AUTOMATION: READY` |
| Filters | FLT-STAT-07 | C38877 | [open](https://shopview.testrail.io/index.php?/cases/view/38877) | `AUTOMATION: READY` |

**Total automated in the fix set: 27** (Report Suite 25 · Filters 2 · Schedule 0).

---

## §4 — SECONDARY finding: the marker overwrote a HOLD / EXPECT-FAIL marker (Rule-69 violation)

Rule 69's dated addition (2026-08-17/18): the `Not available on Build to test Yet` marker
**substitutes for a plain `AUTOMATION: READY` marker ONLY** — it must **never** overwrite an
existing `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD - <reason>` marker, which
carry ticket/blocker references that must be preserved.

**69 live-marked cases had a HOLD or EXPECT-FAIL marker that the session overwrote with the
'Not available' marker** (23 were EXPECT-FAIL, 46 were HOLD). Split:
- **22 are also REFERENCE-ONLY** — a compounded error (already inside the §2 fix set; all 22 are Schedule prior-HOLD cases).
- **47 are CONTENT-CHANGED** — their body legitimately changed, but their marker should
  still have kept its EXPECT-FAIL/HOLD text, not become 'Not available'. These need a marker revert
  **in addition** to the §2 fix set.

So the total distinct cases needing a marker correction = **452 (reference-only) + 47
(content-changed but EXPECT-FAIL/HOLD overwritten) = 499.**

Full list of the overwrite cases (all buckets):

| Project | Internal ID | C-id | Link | Class | Automated? | Prior marker (to restore) |
|---|---|---|---|---|:--:|---|
| Filters | FLT-BAR-03 | C29559 | [open](https://shopview.testrail.io/index.php?/cases/view/29559) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification` |
| Filters | FLT-TAB-02 | C29609 | [open](https://shopview.testrail.io/index.php?/cases/view/29609) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification` |
| Filters | FLT-TAB-03 | C29610 | [open](https://shopview.testrail.io/index.php?/cases/view/29610) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification` |
| Filters | FLT-TAB-05 | C29612 | [open](https://shopview.testrail.io/index.php?/cases/view/29612) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko to confirm whether the Status chip is hidden or shown greyed out on the Estimates and Completed tabs, and to correct the specification` |
| Filters | FLT-PERS-04 | C29616 | [open](https://shopview.testrail.io/index.php?/cases/view/29616) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8832)` |
| Filters | FLT-MOB-04 | C29624 | [open](https://shopview.testrail.io/index.php?/cases/view/29624) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8875)` |
| Filters | FLT-MOB-05 | C29625 | [open](https://shopview.testrail.io/index.php?/cases/view/29625) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8875)` |
| Filters | FLT-PERS-06 | C38881 | [open](https://shopview.testrail.io/index.php?/cases/view/38881) | CHANGED | no | `AUTOMATION: HOLD - cannot be run - it needs an account whose filters were saved before the redesign, and none exists` |
| Filters | FLT-RPTS-23 | C38882 | [open](https://shopview.testrail.io/index.php?/cases/view/38882) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up - the date range filter is built but no source states the periods it must offer` |
| Filters | FLT-PARTS-12 | C38907 | [open](https://shopview.testrail.io/index.php?/cases/view/38907) | CHANGED | no | `AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up - the filter bar is built but no source states what it should do` |
| Filters | FLT-PARTS-14 | C43562 | [open](https://shopview.testrail.io/index.php?/cases/view/43562) | CHANGED | no | `AUTOMATION: HOLD - the new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet` |
| Report Suite | SBC-SORT-01 | C30142 | [open](https://shopview.testrail.io/index.php?/cases/view/30142) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8963)` |
| Report Suite | SBC-EXP-04 | C30162 | [open](https://shopview.testrail.io/index.php?/cases/view/30162) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8823)` |
| Report Suite | SBR-ROW-02 | C30218 | [open](https://shopview.testrail.io/index.php?/cases/view/30218) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-9001)` |
| Report Suite | SBR-CALC-01 | C30229 | [open](https://shopview.testrail.io/index.php?/cases/view/30229) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8999)` |
| Report Suite | SBR-CALC-02 | C30230 | [open](https://shopview.testrail.io/index.php?/cases/view/30230) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8999)` |
| Report Suite | SBR-CALC-03 | C30231 | [open](https://shopview.testrail.io/index.php?/cases/view/30231) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8999)` |
| Report Suite | SBR-EXP-04 | C30279 | [open](https://shopview.testrail.io/index.php?/cases/view/30279) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8981)` |
| Report Suite | SBR-EXP-10 | C30285 | [open](https://shopview.testrail.io/index.php?/cases/view/30285) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8880)` |
| Report Suite | SBR-EXP-11 | C30286 | [open](https://shopview.testrail.io/index.php?/cases/view/30286) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8972)` |
| Report Suite | SBR-EXP-12 | C30287 | [open](https://shopview.testrail.io/index.php?/cases/view/30287) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8823)` |
| Report Suite | WIP-PLACE-01 | C30462 | [open](https://shopview.testrail.io/index.php?/cases/view/30462) | CHANGED | YES | `AUTOMATION: HOLD - the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs` |
| Report Suite | WIP-PLACE-03 | C30464 | [open](https://shopview.testrail.io/index.php?/cases/view/30464) | CHANGED | no | `AUTOMATION: HOLD - the specification states two different tab-placement rules (whole work order by status, or per line state) and the product owner has been asked which governs` |
| Report Suite | WIP-COL-01 | C30466 | [open](https://shopview.testrail.io/index.php?/cases/view/30466) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8987)` |
| Report Suite | WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | CHANGED | no | `AUTOMATION: HOLD - the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at` |
| Report Suite | WIP-CALC-08 | C30481 | [open](https://shopview.testrail.io/index.php?/cases/view/30481) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8989)` |
| Report Suite | WIP-EXP-02 | C30511 | [open](https://shopview.testrail.io/index.php?/cases/view/30511) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |
| Report Suite | WIP-EXP-03 | C30512 | [open](https://shopview.testrail.io/index.php?/cases/view/30512) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |
| Report Suite | WIP-EXP-04 | C30513 | [open](https://shopview.testrail.io/index.php?/cases/view/30513) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |
| Report Suite | WIP-EXP-05 | C30514 | [open](https://shopview.testrail.io/index.php?/cases/view/30514) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |
| Report Suite | WIP-EXP-09 | C30518 | [open](https://shopview.testrail.io/index.php?/cases/view/30518) | CHANGED | YES | `AUTOMATION: READY - EXPECT FAIL (SV-8907)` |
| Report Suite | SBR-CALC-09 | C38894 | [open](https://shopview.testrail.io/index.php?/cases/view/38894) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8999)` |
| Report Suite | WIP-EXP-10 | C38918 | [open](https://shopview.testrail.io/index.php?/cases/view/38918) | CHANGED | no | `AUTOMATION: HOLD - the over-size refusal cannot be produced on this environment; no tab comes near the size limit` |
| Report Suite | WIP-PERS-05 | C43551 | [open](https://shopview.testrail.io/index.php?/cases/view/43551) | CHANGED | no | `AUTOMATION: HOLD - the build does not follow the ratified Location rule; the defect is written up in DEFECTS-FOR-PERMISSION.md and needs the QA lead's permission before a ticket exists to point at` |
| Report Suite | WIP-COL-09 | C43557 | [open](https://shopview.testrail.io/index.php?/cases/view/43557) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8967)` |
| Schedule | SCH-DND-08 | C29962 | [open](https://shopview.testrail.io/index.php?/cases/view/29962) | CHANGED | no | `AUTOMATION: READY - EXPECT FAIL (SV-8957)` |
| Schedule | SCH-SCOPE-05 | C29967 | [open](https://shopview.testrail.io/index.php?/cases/view/29967) | REF | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-SPREAD-06 | C29982 | [open](https://shopview.testrail.io/index.php?/cases/view/29982) | REF | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-SPREAD-07 | C29983 | [open](https://shopview.testrail.io/index.php?/cases/view/29983) | CHANGED | no | `AUTOMATION: HOLD - waiting on the product owner's answer, and the question has not been sent yet` |
| Schedule | SCH-SPREAD-08 | C29984 | [open](https://shopview.testrail.io/index.php?/cases/view/29984) | CHANGED | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-SPREAD-09 | C29985 | [open](https://shopview.testrail.io/index.php?/cases/view/29985) | REF | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-DAY-04 | C30004 | [open](https://shopview.testrail.io/index.php?/cases/view/30004) | CHANGED | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-MODAL-06 | C30013 | [open](https://shopview.testrail.io/index.php?/cases/view/30013) | CHANGED | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-EVT-05 | C30020 | [open](https://shopview.testrail.io/index.php?/cases/view/30020) | REF | no | `AUTOMATION: HOLD - not re-checked against the current build - it needs a drag that could not be completed` |
| Schedule | SCH-VIEW-03 | C30044 | [open](https://shopview.testrail.io/index.php?/cases/view/30044) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a user with no staff record of their own` |
| Schedule | SCH-PERM-01 | C30074 | [open](https://shopview.testrail.io/index.php?/cases/view/30074) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a view-only user` |
| Schedule | SCH-PERM-02 | C30075 | [open](https://shopview.testrail.io/index.php?/cases/view/30075) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a view-only user` |
| Schedule | SCH-PERM-03 | C30076 | [open](https://shopview.testrail.io/index.php?/cases/view/30076) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a user without the Schedule permission` |
| Schedule | SCH-PERM-04 | C30077 | [open](https://shopview.testrail.io/index.php?/cases/view/30077) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as an edit-without-delete user` |
| Schedule | SCH-PERM-05 | C30078 | [open](https://shopview.testrail.io/index.php?/cases/view/30078) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as an edit-without-delete user` |
| Schedule | SCH-PERM-06 | C30079 | [open](https://shopview.testrail.io/index.php?/cases/view/30079) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a delete-capable user` |
| Schedule | SCH-PERM-08 | C30081 | [open](https://shopview.testrail.io/index.php?/cases/view/30081) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` |
| Schedule | SCH-PERM-09 | C30082 | [open](https://shopview.testrail.io/index.php?/cases/view/30082) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a view-only technician` |
| Schedule | SCH-PERM-11 | C30084 | [open](https://shopview.testrail.io/index.php?/cases/view/30084) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as each of the two staff members` |
| Schedule | SCH-EDGE-05 | C30089 | [open](https://shopview.testrail.io/index.php?/cases/view/30089) | CHANGED | no | `AUTOMATION: HOLD - waiting on the product owner's answer, and the shop-closure setting does not exist in the build` |
| Schedule | SCH-PERM-12 | C30614 | [open](https://shopview.testrail.io/index.php?/cases/view/30614) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` |
| Schedule | SCH-REG-01 | C38867 | [open](https://shopview.testrail.io/index.php?/cases/view/38867) | REF | no | `AUTOMATION: HOLD - cannot be run now - it needs shifts noted BEFORE the release, and the release is already deployed` |
| Schedule | SCH-REG-02 | C38868 | [open](https://shopview.testrail.io/index.php?/cases/view/38868) | REF | no | `AUTOMATION: HOLD - the Dashboard section this test needs does not exist in the build` |
| Schedule | SCH-REG-03 | C38869 | [open](https://shopview.testrail.io/index.php?/cases/view/38869) | REF | no | `AUTOMATION: HOLD - work order creation offers no appointment in the build` |
| Schedule | SCH-REG-05 | C38871 | [open](https://shopview.testrail.io/index.php?/cases/view/38871) | REF | no | `AUTOMATION: HOLD - the Priority field this test needs does not exist in the build` |
| Schedule | SCH-API-01 | C38872 | [open](https://shopview.testrail.io/index.php?/cases/view/38872) | REF | no | `AUTOMATION: HOLD - needs three separate sign-ins, one per permission level` |
| Schedule | SCH-API-03 | C38874 | [open](https://shopview.testrail.io/index.php?/cases/view/38874) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a user who cannot see work orders` |
| Schedule | SCH-PERM-13 | C38926 | [open](https://shopview.testrail.io/index.php?/cases/view/38926) | REF | no | `AUTOMATION: HOLD - needs a second sign-in as a holder of each permission level` |
| Schedule | SCH-PANEL-01 | C43582 | [open](https://shopview.testrail.io/index.php?/cases/view/43582) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |
| Schedule | SCH-PANEL-02 | C43583 | [open](https://shopview.testrail.io/index.php?/cases/view/43583) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |
| Schedule | SCH-PANEL-03 | C43584 | [open](https://shopview.testrail.io/index.php?/cases/view/43584) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |
| Schedule | SCH-PANEL-04 | C43585 | [open](https://shopview.testrail.io/index.php?/cases/view/43585) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |
| Schedule | SCH-PANEL-05 | C43586 | [open](https://shopview.testrail.io/index.php?/cases/view/43586) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |
| Schedule | SCH-PANEL-06 | C43587 | [open](https://shopview.testrail.io/index.php?/cases/view/43587) | CHANGED | no | `AUTOMATION: HOLD - the panel button does not exist in this build` |

---

## §5 — Local/live divergence: 5 Automated Schedule cases marked in the local source ONLY

These carry the marker in the **committed local case source** but **NOT live** — live shows no
automation marker at all. All 5 are `custom_atmstatus = 3` (Automated) and were **last updated by
Vladimir Tomovic (user id 1)** live, so his automated version prevails on TestRail. **There is no
live marker to fix on these; the local source is simply stale/divergent and should be re-synced
from live. Do NOT edit them (Rule 71).** They are excluded from the live counts above.

| Project | Internal ID | C-id | Link | Local classification | Live updated_by |
|---|---|---|---|---|---|
| Schedule | SCH-HRS-02 | C38847 | [open](https://shopview.testrail.io/index.php?/cases/view/38847) | REF | 1 (Vladimir Tomovic) |
| Schedule | SCH-HRS-03 | C38848 | [open](https://shopview.testrail.io/index.php?/cases/view/38848) | REF | 1 (Vladimir Tomovic) |
| Schedule | SCH-HRS-04 | C38849 | [open](https://shopview.testrail.io/index.php?/cases/view/38849) | REF | 1 (Vladimir Tomovic) |
| Schedule | SCH-HRS-05 | C38850 | [open](https://shopview.testrail.io/index.php?/cases/view/38850) | REF | 1 (Vladimir Tomovic) |
| Schedule | SCH-REAS-08 | C43811 | [open](https://shopview.testrail.io/index.php?/cases/view/43811) | NEW | 1 (Vladimir Tomovic) |

> Note (Rule G): the earlier `AUTOMATED-MARKER-AUDIT.md` self-reported **0** Automated (`atmstatus=3`)
> Schedule cases; live now shows **5** (Vlad flagged them since). This audit trusts the live read.

---

## §6 — How to restore (for whoever runs the authorized fix pass)

- **Reference-only, prior `AUTOMATION: READY` (430 cases):** replace the `Not available on Build to
  test Yet` marker line with `AUTOMATION: READY`; leave title/preconditions/steps/expected-body and
  the provenance line as they are.
- **Reference-only, prior HOLD (22 Schedule cases, §2 + §4):** restore the exact HOLD text shown in
  the Prior-marker column.
- **Content-changed but EXPECT-FAIL/HOLD overwritten (47 cases, §4):** restore the exact
  EXPECT-FAIL/HOLD text shown; the content edits themselves stand.
- **The 27 Automated fix-set cases (§3) + the 2 Automated overwrite cases (§4):** Rule 71 — ask the
  QA lead first, edit only coupled with build verification, then hand the case numbers to Vlad.
- **The 5 local-only Automated divergences (§5):** no live change; re-sync local source from live.
- Any marker write is a TestRail write and needs the QA lead's go-ahead (Rule 6); and the
  Rule-62 creation hold does not block `update_case` corrections on existing cases.
