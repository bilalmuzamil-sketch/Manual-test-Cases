> # ✅ CLOSED AS AN ATTEMPT — 5 August 2026, 14:1x UTC
>
> **Its blocker has cleared.** Fresh cookies arrived, the build was reachable, and a pass ran.
> The live queue is now `../final-viu-2026-08-05/RECHECK-QUEUE.md`, which records **7 of 165**
> rows re-checked on `v3.5-be42149` and the 158 still owed. This file is kept as the record of
> the attempt that could not start.

# Schedule — Standing Rule 49 RE-CHECK QUEUE (re-armed 5 August 2026)

## STATUS: **OPEN** — 0 of 165 rows re-checked

> **This queue supersedes `viu-2026-08-04/RECHECK-QUEUE.md` as the live queue.** That file stays as
> the record of what was observed on 4 August; this one is what is owed.

### Why it is open

Two separate reasons, and **both** must clear before it can close:

1. **The build moved and the rows have not been re-checked.** The Schedule QA branch was redeployed at
   **08:09 UTC on 5 August**. Every verdict below was measured on a build that is no longer served.
2. **The branch has still not been declared final by engineering.** Even once every row is
   re-confirmed, the verdicts stay **PROVISIONAL** until they tell us the branch is done. So this queue
   does not close on a successful re-run; it re-arms.

### Build markers

| | Verdicts below were measured on | Serving now |
|---|---|---|
| `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-be42149`** |
| `index.html` last-modified | Tue 04 Aug 2026 14:47:39 GMT | **Wed 05 Aug 2026 08:09:19 GMT** |
| etag | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`70e496609e155994b93f515db32d0289`** |

Read at 12:01:46Z and again at 12:09Z on 5 August — **identical, so nothing redeployed under the
attempted pass.** If `app-version` differs from `v3.5-be42149` when you next read it, the build has
moved **again** and this whole queue is due afresh.

### Why 0 of 165 were re-checked on 5 August

**No session on the build.** The Schedule cookies (`/tmp/schedule-viu/cookies.json`, dated
2026-08-04 11:31 UTC) return `HTTP 401 {"error":"sso_required"}` — ordinary ~24-hour expiry across the
whole `.qa.shopview.com` estate, compounded by the deploy. The Filters and Report Suite cookie sets are
dead too, so it is not Schedule-specific and cannot be worked around from the container.

**What is needed: fresh `sv_sso_session`, `PHPSESSID` and `cf_clearance` for `.qa.shopview.com`,
written to `/tmp/schedule-viu/cookies.json`.**

### How to re-run

1. Read the build marker; record it at start, midpoint and end.
2. Re-observe every row below on the new build. Mark it **CONFIRMED** or **CHANGED**, with evidence
   captured that run. **A row you cannot drive is neither — it is stated unobserved with the reason.**
3. **Re-stamp each case's provenance line** (Rule 54) to the new build and the date actually observed.
   *A row re-checked without its provenance re-stamped is not re-checked.*
4. Apply the queued corrections in `WRITE-PLAN.md` **in the same single write** as the re-stamp — the
   16 formatting repairs, the two stale "no ticket yet" sentences, and the automation markers.
5. Check the arithmetic gate: **READY + READY-EXPECT-FAIL must equal the ready-to-automate figure.**

### Priority rows — re-check these first

| Why | Case | C-id |
|---|---|---|
| Another tester's **Ready to Fix** defect contradicts our PASS; we likely tested only the passing half | SCH-SEARCH (tech full name) | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) |
| Same — we proved one status of many and called the filter good | SCH-FILT (Status filter) | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) |
| A redeploy is exactly when a not-built feature appears | SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) |
| " | SCH-DND-08 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) |
| " | SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) |
| " | SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) |
| Could not be set up last time — seed harder | SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) |
| " | SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) |
| Its "no developer ticket yet" sentence is now false — SV-8834 covers it | SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) |
| Same — SV-8874 now covers it | SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) |

## The 165 rows

**`RE-CHECKED?` is `NOT YET` on every row.** Change it to CONFIRMED or CHANGED as each is re-observed.

| # | case | C-id | link | verdict on v3.5-4873abe (4 Aug) | RE-CHECKED on v3.5-be42149? | what must be re-confirmed |
|---|---|---|---|---|---|---|
| 1 | SCH-API-01 | C38872 | https://shopview.testrail.io/index.php?/cases/view/38872 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 2 | SCH-API-02 | C38873 | https://shopview.testrail.io/index.php?/cases/view/38873 | NOT-BUILT | **NOT YET** | whether the feature has since been built; if it has, re-observe it fully and remove the not-built block |
| 3 | SCH-API-03 | C38874 | https://shopview.testrail.io/index.php?/cases/view/38874 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 4 | SCH-API-04 | C38875 | https://shopview.testrail.io/index.php?/cases/view/38875 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 5 | SCH-BLOCK-01 | C29991 | https://shopview.testrail.io/index.php?/cases/view/29991 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 6 | SCH-BLOCK-02 | C29992 | https://shopview.testrail.io/index.php?/cases/view/29992 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 7 | SCH-BLOCK-05 | C29995 | https://shopview.testrail.io/index.php?/cases/view/29995 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 8 | SCH-CAP-01 | C30030 | https://shopview.testrail.io/index.php?/cases/view/30030 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 9 | SCH-CAP-02 | C30031 | https://shopview.testrail.io/index.php?/cases/view/30031 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 10 | SCH-CAP-03 | C30032 | https://shopview.testrail.io/index.php?/cases/view/30032 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 11 | SCH-CAP-04 | C30033 | https://shopview.testrail.io/index.php?/cases/view/30033 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 12 | SCH-COLOR-01 | C30071 | https://shopview.testrail.io/index.php?/cases/view/30071 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 13 | SCH-COLOR-02 | C30072 | https://shopview.testrail.io/index.php?/cases/view/30072 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 14 | SCH-COLOR-03 | C30073 | https://shopview.testrail.io/index.php?/cases/view/30073 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 15 | SCH-CONF-01 | C30023 | https://shopview.testrail.io/index.php?/cases/view/30023 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 16 | SCH-CONF-02 | C30024 | https://shopview.testrail.io/index.php?/cases/view/30024 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 17 | SCH-CONF-03 | C30025 | https://shopview.testrail.io/index.php?/cases/view/30025 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 18 | SCH-CONF-05 | C30027 | https://shopview.testrail.io/index.php?/cases/view/30027 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 19 | SCH-CONF-06 | C30028 | https://shopview.testrail.io/index.php?/cases/view/30028 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 20 | SCH-CONF-07 | C30029 | https://shopview.testrail.io/index.php?/cases/view/30029 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 21 | SCH-DAY-01 | C30001 | https://shopview.testrail.io/index.php?/cases/view/30001 | DEVIATION (SV-8837) | **NOT YET** | whether SV-8837 is fixed; if it is, remove the known-issue block and re-stamp |
| 22 | SCH-DAY-03 | C30003 | https://shopview.testrail.io/index.php?/cases/view/30003 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 23 | SCH-DAY-04 | C30004 | https://shopview.testrail.io/index.php?/cases/view/30004 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 24 | SCH-DAY-05 | C30005 | https://shopview.testrail.io/index.php?/cases/view/30005 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 25 | SCH-DAY-06 | C30006 | https://shopview.testrail.io/index.php?/cases/view/30006 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 26 | SCH-DEL-01 | C30057 | https://shopview.testrail.io/index.php?/cases/view/30057 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 27 | SCH-DEL-02 | C30058 | https://shopview.testrail.io/index.php?/cases/view/30058 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 28 | SCH-DEL-03 | C30059 | https://shopview.testrail.io/index.php?/cases/view/30059 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 29 | SCH-DEL-04 | C30060 | https://shopview.testrail.io/index.php?/cases/view/30060 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 30 | SCH-DEL-05 | C30061 | https://shopview.testrail.io/index.php?/cases/view/30061 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 31 | SCH-DEL-06 | C30062 | https://shopview.testrail.io/index.php?/cases/view/30062 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 32 | SCH-DEL-08 | C30064 | https://shopview.testrail.io/index.php?/cases/view/30064 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 33 | SCH-DEL-09 | C30065 | https://shopview.testrail.io/index.php?/cases/view/30065 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 34 | SCH-DEL-10 | C38864 | https://shopview.testrail.io/index.php?/cases/view/38864 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 35 | SCH-DND-01 | C29955 | https://shopview.testrail.io/index.php?/cases/view/29955 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 36 | SCH-DND-02 | C29956 | https://shopview.testrail.io/index.php?/cases/view/29956 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 37 | SCH-DND-03 | C29957 | https://shopview.testrail.io/index.php?/cases/view/29957 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 38 | SCH-DND-04 | C29958 | https://shopview.testrail.io/index.php?/cases/view/29958 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 39 | SCH-DND-05 | C29959 | https://shopview.testrail.io/index.php?/cases/view/29959 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 40 | SCH-DND-06 | C29960 | https://shopview.testrail.io/index.php?/cases/view/29960 | DEVIATION (SV-8840) | **NOT YET** | whether SV-8840 is fixed; if it is, remove the known-issue block and re-stamp |
| 41 | SCH-DND-07 | C29961 | https://shopview.testrail.io/index.php?/cases/view/29961 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 42 | SCH-DND-08 | C29962 | https://shopview.testrail.io/index.php?/cases/view/29962 | NOT-BUILT | **NOT YET** | whether the feature has since been built; if it has, re-observe it fully and remove the not-built block |
| 43 | SCH-EDGE-02 | C30086 | https://shopview.testrail.io/index.php?/cases/view/30086 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 44 | SCH-EDGE-03 | C30087 | https://shopview.testrail.io/index.php?/cases/view/30087 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 45 | SCH-EDGE-04 | C30088 | https://shopview.testrail.io/index.php?/cases/view/30088 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 46 | SCH-EDGE-05 | C30089 | https://shopview.testrail.io/index.php?/cases/view/30089 | HELD | **NOT YET** | whether Branko has ruled; if he has, apply the ruling and remove the do-not-automate block |
| 47 | SCH-EDGE-06 | C30090 | https://shopview.testrail.io/index.php?/cases/view/30090 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 48 | SCH-EDGE-07 | C38865 | https://shopview.testrail.io/index.php?/cases/view/38865 | EXTERNAL-DEPENDENCY | **NOT YET** | whether the external limit still applies |
| 49 | SCH-EDGE-08 | C38866 | https://shopview.testrail.io/index.php?/cases/view/38866 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 50 | SCH-EVT-01 | C30016 | https://shopview.testrail.io/index.php?/cases/view/30016 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 51 | SCH-EVT-02 | C30017 | https://shopview.testrail.io/index.php?/cases/view/30017 | NOT-BUILT | **NOT YET** | whether the feature has since been built; if it has, re-observe it fully and remove the not-built block |
| 52 | SCH-EVT-03 | C30018 | https://shopview.testrail.io/index.php?/cases/view/30018 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 53 | SCH-EVT-05 | C30020 | https://shopview.testrail.io/index.php?/cases/view/30020 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 54 | SCH-EVT-06 | C30021 | https://shopview.testrail.io/index.php?/cases/view/30021 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 55 | SCH-EVT-07 | C30022 | https://shopview.testrail.io/index.php?/cases/view/30022 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 56 | SCH-EVT-08 | C30615 | https://shopview.testrail.io/index.php?/cases/view/30615 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 57 | SCH-FILT-01 | C29942 | https://shopview.testrail.io/index.php?/cases/view/29942 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 58 | SCH-FILT-02 | C29943 | https://shopview.testrail.io/index.php?/cases/view/29943 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 59 | SCH-FILT-03 | C29944 | https://shopview.testrail.io/index.php?/cases/view/29944 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 60 | SCH-FILT-04 | C29945 | https://shopview.testrail.io/index.php?/cases/view/29945 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 61 | SCH-FILT-05 | C29946 | https://shopview.testrail.io/index.php?/cases/view/29946 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 62 | SCH-FILT-06 | C29947 | https://shopview.testrail.io/index.php?/cases/view/29947 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 63 | SCH-HRS-02 | C38847 | https://shopview.testrail.io/index.php?/cases/view/38847 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 64 | SCH-HRS-03 | C38848 | https://shopview.testrail.io/index.php?/cases/view/38848 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 65 | SCH-HRS-04 | C38849 | https://shopview.testrail.io/index.php?/cases/view/38849 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 66 | SCH-HRS-05 | C38850 | https://shopview.testrail.io/index.php?/cases/view/38850 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 67 | SCH-HRS-06 | C38851 | https://shopview.testrail.io/index.php?/cases/view/38851 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 68 | SCH-KEY-01 | C30066 | https://shopview.testrail.io/index.php?/cases/view/30066 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 69 | SCH-KEY-03 | C30068 | https://shopview.testrail.io/index.php?/cases/view/30068 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 70 | SCH-KEY-05 | C30070 | https://shopview.testrail.io/index.php?/cases/view/30070 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 71 | SCH-LANE-01 | C29996 | https://shopview.testrail.io/index.php?/cases/view/29996 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 72 | SCH-LANE-02 | C29997 | https://shopview.testrail.io/index.php?/cases/view/29997 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 73 | SCH-LANE-03 | C29998 | https://shopview.testrail.io/index.php?/cases/view/29998 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 74 | SCH-LANE-04 | C29999 | https://shopview.testrail.io/index.php?/cases/view/29999 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 75 | SCH-LINE-01 | C29948 | https://shopview.testrail.io/index.php?/cases/view/29948 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 76 | SCH-LINE-03 | C29950 | https://shopview.testrail.io/index.php?/cases/view/29950 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 77 | SCH-LINE-04 | C29951 | https://shopview.testrail.io/index.php?/cases/view/29951 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 78 | SCH-LINE-05 | C29952 | https://shopview.testrail.io/index.php?/cases/view/29952 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 79 | SCH-LINE-06 | C29953 | https://shopview.testrail.io/index.php?/cases/view/29953 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 80 | SCH-LINE-07 | C29954 | https://shopview.testrail.io/index.php?/cases/view/29954 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 81 | SCH-MCAL-01 | C29932 | https://shopview.testrail.io/index.php?/cases/view/29932 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 82 | SCH-MCAL-02 | C29933 | https://shopview.testrail.io/index.php?/cases/view/29933 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 83 | SCH-MCAL-03 | C29934 | https://shopview.testrail.io/index.php?/cases/view/29934 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 84 | SCH-MCAL-04 | C29935 | https://shopview.testrail.io/index.php?/cases/view/29935 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 85 | SCH-MODAL-01 | C30008 | https://shopview.testrail.io/index.php?/cases/view/30008 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 86 | SCH-MODAL-02 | C30009 | https://shopview.testrail.io/index.php?/cases/view/30009 | DEVIATION (SV-8833) | **NOT YET** | whether SV-8833 is fixed; if it is, remove the known-issue block and re-stamp |
| 87 | SCH-MODAL-03 | C30010 | https://shopview.testrail.io/index.php?/cases/view/30010 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 88 | SCH-MODAL-04 | C30011 | https://shopview.testrail.io/index.php?/cases/view/30011 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 89 | SCH-MODAL-05 | C30012 | https://shopview.testrail.io/index.php?/cases/view/30012 | DEVIATION (SV-8829) | **NOT YET** | whether SV-8829 is fixed; if it is, remove the known-issue block and re-stamp |
| 90 | SCH-MODAL-06 | C30013 | https://shopview.testrail.io/index.php?/cases/view/30013 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 91 | SCH-MODAL-07 | C30014 | https://shopview.testrail.io/index.php?/cases/view/30014 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 92 | SCH-MODAL-08 | C30015 | https://shopview.testrail.io/index.php?/cases/view/30015 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 93 | SCH-NAV-01 | C29925 | https://shopview.testrail.io/index.php?/cases/view/29925 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 94 | SCH-NAV-03 | C29927 | https://shopview.testrail.io/index.php?/cases/view/29927 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 95 | SCH-NAV-04 | C29928 | https://shopview.testrail.io/index.php?/cases/view/29928 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 96 | SCH-NAV-05 | C29929 | https://shopview.testrail.io/index.php?/cases/view/29929 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 97 | SCH-NAV-06 | C29930 | https://shopview.testrail.io/index.php?/cases/view/29930 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 98 | SCH-NAV-07 | C29931 | https://shopview.testrail.io/index.php?/cases/view/29931 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 99 | SCH-PERM-01 | C30074 | https://shopview.testrail.io/index.php?/cases/view/30074 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 100 | SCH-PERM-02 | C30075 | https://shopview.testrail.io/index.php?/cases/view/30075 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 101 | SCH-PERM-03 | C30076 | https://shopview.testrail.io/index.php?/cases/view/30076 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 102 | SCH-PERM-04 | C30077 | https://shopview.testrail.io/index.php?/cases/view/30077 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 103 | SCH-PERM-05 | C30078 | https://shopview.testrail.io/index.php?/cases/view/30078 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 104 | SCH-PERM-06 | C30079 | https://shopview.testrail.io/index.php?/cases/view/30079 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 105 | SCH-PERM-07 | C30080 | https://shopview.testrail.io/index.php?/cases/view/30080 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 106 | SCH-PERM-08 | C30081 | https://shopview.testrail.io/index.php?/cases/view/30081 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 107 | SCH-PERM-09 | C30082 | https://shopview.testrail.io/index.php?/cases/view/30082 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 108 | SCH-PERM-10 | C30083 | https://shopview.testrail.io/index.php?/cases/view/30083 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 109 | SCH-PERM-11 | C30084 | https://shopview.testrail.io/index.php?/cases/view/30084 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 110 | SCH-PERM-12 | C30614 | https://shopview.testrail.io/index.php?/cases/view/30614 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 111 | SCH-PERM-13 | C38926 | https://shopview.testrail.io/index.php?/cases/view/38926 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 112 | SCH-REAS-01 | C30052 | https://shopview.testrail.io/index.php?/cases/view/30052 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 113 | SCH-REAS-03 | C30054 | https://shopview.testrail.io/index.php?/cases/view/30054 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 114 | SCH-REAS-06 | C38855 | https://shopview.testrail.io/index.php?/cases/view/38855 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 115 | SCH-REG-01 | C38867 | https://shopview.testrail.io/index.php?/cases/view/38867 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 116 | SCH-REG-02 | C38868 | https://shopview.testrail.io/index.php?/cases/view/38868 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 117 | SCH-REG-03 | C38869 | https://shopview.testrail.io/index.php?/cases/view/38869 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 118 | SCH-REG-04 | C38870 | https://shopview.testrail.io/index.php?/cases/view/38870 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 119 | SCH-REG-05 | C38871 | https://shopview.testrail.io/index.php?/cases/view/38871 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 120 | SCH-SCOPE-01 | C29963 | https://shopview.testrail.io/index.php?/cases/view/29963 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 121 | SCH-SCOPE-02 | C29964 | https://shopview.testrail.io/index.php?/cases/view/29964 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 122 | SCH-SCOPE-03 | C29965 | https://shopview.testrail.io/index.php?/cases/view/29965 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 123 | SCH-SCOPE-05 | C29967 | https://shopview.testrail.io/index.php?/cases/view/29967 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 124 | SCH-SER-01 | C29987 | https://shopview.testrail.io/index.php?/cases/view/29987 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 125 | SCH-SER-02 | C29988 | https://shopview.testrail.io/index.php?/cases/view/29988 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 126 | SCH-SER-03 | C29989 | https://shopview.testrail.io/index.php?/cases/view/29989 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 127 | SCH-SER-04 | C29990 | https://shopview.testrail.io/index.php?/cases/view/29990 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 128 | SCH-SPREAD-02 | C29978 | https://shopview.testrail.io/index.php?/cases/view/29978 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 129 | SCH-SPREAD-03 | C29979 | https://shopview.testrail.io/index.php?/cases/view/29979 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 130 | SCH-SPREAD-04 | C29980 | https://shopview.testrail.io/index.php?/cases/view/29980 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 131 | SCH-SPREAD-05 | C29981 | https://shopview.testrail.io/index.php?/cases/view/29981 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 132 | SCH-SPREAD-06 | C29982 | https://shopview.testrail.io/index.php?/cases/view/29982 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 133 | SCH-SPREAD-07 | C29983 | https://shopview.testrail.io/index.php?/cases/view/29983 | HELD | **NOT YET** | whether Branko has ruled; if he has, apply the ruling and remove the do-not-automate block |
| 134 | SCH-SPREAD-08 | C29984 | https://shopview.testrail.io/index.php?/cases/view/29984 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 135 | SCH-SPREAD-09 | C29985 | https://shopview.testrail.io/index.php?/cases/view/29985 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 136 | SCH-SPREAD-10 | C29986 | https://shopview.testrail.io/index.php?/cases/view/29986 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 137 | SCH-SPREAD-11 | C38863 | https://shopview.testrail.io/index.php?/cases/view/38863 | NOT-BUILT | **NOT YET** | whether the feature has since been built; if it has, re-observe it fully and remove the not-built block |
| 138 | SCH-START-01 | C29969 | https://shopview.testrail.io/index.php?/cases/view/29969 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 139 | SCH-START-02 | C29970 | https://shopview.testrail.io/index.php?/cases/view/29970 | EXTERNAL-DEPENDENCY | **NOT YET** | whether the external limit still applies |
| 140 | SCH-START-03 | C29971 | https://shopview.testrail.io/index.php?/cases/view/29971 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 141 | SCH-START-04 | C29972 | https://shopview.testrail.io/index.php?/cases/view/29972 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 142 | SCH-START-05 | C29973 | https://shopview.testrail.io/index.php?/cases/view/29973 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 143 | SCH-START-06 | C29974 | https://shopview.testrail.io/index.php?/cases/view/29974 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 144 | SCH-START-07 | C29975 | https://shopview.testrail.io/index.php?/cases/view/29975 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 145 | SCH-TIP-01 | C30034 | https://shopview.testrail.io/index.php?/cases/view/30034 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 146 | SCH-TIP-02 | C30035 | https://shopview.testrail.io/index.php?/cases/view/30035 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 147 | SCH-TIP-03 | C30036 | https://shopview.testrail.io/index.php?/cases/view/30036 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 148 | SCH-TIP-04 | C30037 | https://shopview.testrail.io/index.php?/cases/view/30037 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 149 | SCH-TIP-05 | C30038 | https://shopview.testrail.io/index.php?/cases/view/30038 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 150 | SCH-TOOL-01 | C30039 | https://shopview.testrail.io/index.php?/cases/view/30039 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 151 | SCH-TOOL-02 | C30040 | https://shopview.testrail.io/index.php?/cases/view/30040 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 152 | SCH-TOOL-03 | C30041 | https://shopview.testrail.io/index.php?/cases/view/30041 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 153 | SCH-VIEW-01 | C30042 | https://shopview.testrail.io/index.php?/cases/view/30042 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 154 | SCH-VIEW-02 | C30043 | https://shopview.testrail.io/index.php?/cases/view/30043 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 155 | SCH-VIEW-03 | C30044 | https://shopview.testrail.io/index.php?/cases/view/30044 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 156 | SCH-VIEW-04 | C30045 | https://shopview.testrail.io/index.php?/cases/view/30045 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 157 | SCH-VIEW-05 | C30046 | https://shopview.testrail.io/index.php?/cases/view/30046 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 158 | SCH-VIEW-06 | C30047 | https://shopview.testrail.io/index.php?/cases/view/30047 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 159 | SCH-VIEW-09 | C30050 | https://shopview.testrail.io/index.php?/cases/view/30050 | DEVIATION | **NOT YET** | whether the deviation still stands; if it is, remove the known-issue block and re-stamp |
| 160 | SCH-VIEW-10 | C30051 | https://shopview.testrail.io/index.php?/cases/view/30051 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 161 | SCH-WOL-01 | C29936 | https://shopview.testrail.io/index.php?/cases/view/29936 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 162 | SCH-WOL-02 | C29937 | https://shopview.testrail.io/index.php?/cases/view/29937 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 163 | SCH-WOL-04 | C29939 | https://shopview.testrail.io/index.php?/cases/view/29939 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 164 | SCH-WOL-05 | C29940 | https://shopview.testrail.io/index.php?/cases/view/29940 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |
| 165 | SCH-WOL-06 | C29941 | https://shopview.testrail.io/index.php?/cases/view/29941 | VIU-Observed-PASS | **NOT YET** | that the behaviour still matches, and that the labels quoted in the case are still the on-screen ones |

## Tally carried forward (re-counted from the rows above this run)

| Verdict on 4 August | Count |
|---|---|
| Pass | 138 |
| Product is wrong (the case correctly fails) | 19 |
| Not built yet | 4 |
| Held for the product owner | 2 |
| Could not be set up on this estate | 2 |
| **Total** | **165** |

**None of these is confirmed against the build now being served.**
