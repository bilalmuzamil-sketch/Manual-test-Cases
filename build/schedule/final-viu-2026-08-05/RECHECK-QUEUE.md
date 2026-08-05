> **⚠️ SUPERSEDED 2026-08-05 17:xx UTC — this file is now the RECORD of that pass, not the live queue.**
> **The LIVE queue is `../provenance-reword-2026-08-05/RECHECK-QUEUE.md`.** The build has moved again
> (`v3.5-be42149` → **`v3.5-d122eef`**, last-modified Wed 05 Aug 15:35:43 GMT), the suite is now **168
> cases**, and every reference below to "the current build" means `v3.5-be42149`, which is no longer
> deployed. Nothing here is deleted.

# Schedule — Standing Rule 49 RE-CHECK QUEUE (re-armed 5 August 2026, 14:1x UTC)

## STATUS: **OPEN** — 7 of 165 rows re-checked on `v3.5-be42149`

> **Supersedes `recheck-2026-08-05/RECHECK-QUEUE.md`**, which recorded 0 of 165 because there was no
> session on the build. There is now, so that file is **closed as an attempt** and this is what is owed.

### Why it stays open — two reasons, both must clear

1. **158 of the 165 rows still carry verdicts measured on `v3.5-4873abe`**, a build no longer served.
2. **The branch has still not been declared final.** Even once every row is re-confirmed the verdicts
   stay PROVISIONAL, so this queue does not close on a successful re-run — it re-arms.

### Build markers

| | Value |
|---|---|
| `<meta name="app-version">` | **`v3.5-be42149`** |
| `index.html` last-modified | Wed, 05 Aug 2026 08:09:19 GMT |
| etag | `70e496609e155994b93f515db32d0289` |
| Read at | **13:24:01Z**, **13:49:34Z**, **14:11:22Z** — byte-identical all three |

**If `app-version` differs when you next read it, the build has moved again and the whole queue is
due afresh — including the 7 rows re-checked today.**

### The 7 re-checked today

| Case | C-id | Outcome | Verdict now |
|---|---|---|---|
| SCH-FILT-03 | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | CONFIRMED — proven over all 8 statuses the filter accepts, 0 leaks | PASS |
| SCH-WOL-04 | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | **CHANGED** — the full-name search finds nothing; SV-8873 is right | DEVIATION |
| SCH-DND-08 | [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | **CHANGED** — click-to-arm IS built on this build | PASS |
| SCH-SCOPE-05 | [C29967](https://shopview.testrail.io/index.php?/cases/view/29967) | **CHANGED** — no Select all, no Cancel; SV-8886 filed | DEVIATION |
| SCH-LINE-03 | [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | CONFIRMED — 533 of 533 sidebar lines are approved | PASS |
| SCH-FILT-04 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | CONFIRMED — priority filter returns only the chosen priority | PASS |
| SCH-FILT-06 | [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) | CONFIRMED — search and filter narrow jointly | PASS |

### The 158 still owed

Each of these carries, in its own Expected Results, the sentence *"It was last checked against build
v3.5-4873abe on 8/4/2026; the branch has since been rebuilt to v3.5-be42149 and this case has not
been re-checked against it."* — so the shortfall is visible on the case, not only in this file.

| Case | C-id | Carried-forward verdict | What must be re-confirmed |
|---|---|---|---|
| SCH-API-01 | [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | PASS | that it still passes |
| SCH-API-02 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | NOTBUILT | whether the feature shipped in this deploy |
| SCH-API-03 | [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | PASS | that it still passes |
| SCH-API-04 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | PASS | that it still passes |
| SCH-BLOCK-01 | [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | PASS | that it still passes |
| SCH-BLOCK-02 | [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | PASS | that it still passes |
| SCH-BLOCK-05 | [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | PASS | that it still passes |
| SCH-CAP-01 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | PASS | that it still passes |
| SCH-CAP-02 | [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | PASS | that it still passes |
| SCH-CAP-03 | [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | PASS | that it still passes |
| SCH-CAP-04 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | PASS | that it still passes |
| SCH-COLOR-01 | [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | PASS | that it still passes |
| SCH-COLOR-02 | [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | PASS | that it still passes |
| SCH-COLOR-03 | [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | PASS | that it still passes |
| SCH-CONF-01 | [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) | PASS | that it still passes |
| SCH-CONF-02 | [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) | PASS | that it still passes |
| SCH-CONF-03 | [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | PASS | that it still passes |
| SCH-CONF-05 | [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | PASS | that it still passes |
| SCH-CONF-06 | [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | PASS | that it still passes |
| SCH-CONF-07 | [C30029](https://shopview.testrail.io/index.php?/cases/view/30029) | PASS | that it still passes |
| SCH-DAY-01 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-DAY-03 | [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | PASS | that it still passes |
| SCH-DAY-04 | [C30004](https://shopview.testrail.io/index.php?/cases/view/30004) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-DAY-05 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | PASS | that it still passes |
| SCH-DAY-06 | [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | PASS | that it still passes |
| SCH-DEL-01 | [C30057](https://shopview.testrail.io/index.php?/cases/view/30057) | PASS | that it still passes |
| SCH-DEL-02 | [C30058](https://shopview.testrail.io/index.php?/cases/view/30058) | PASS | that it still passes |
| SCH-DEL-03 | [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | PASS | that it still passes |
| SCH-DEL-04 | [C30060](https://shopview.testrail.io/index.php?/cases/view/30060) | PASS | that it still passes |
| SCH-DEL-05 | [C30061](https://shopview.testrail.io/index.php?/cases/view/30061) | PASS | that it still passes |
| SCH-DEL-06 | [C30062](https://shopview.testrail.io/index.php?/cases/view/30062) | PASS | that it still passes |
| SCH-DEL-08 | [C30064](https://shopview.testrail.io/index.php?/cases/view/30064) | PASS | that it still passes |
| SCH-DEL-09 | [C30065](https://shopview.testrail.io/index.php?/cases/view/30065) | PASS | that it still passes |
| SCH-DEL-10 | [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | PASS | that it still passes |
| SCH-DND-01 | [C29955](https://shopview.testrail.io/index.php?/cases/view/29955) | PASS | that it still passes |
| SCH-DND-02 | [C29956](https://shopview.testrail.io/index.php?/cases/view/29956) | PASS | that it still passes |
| SCH-DND-03 | [C29957](https://shopview.testrail.io/index.php?/cases/view/29957) | PASS | that it still passes |
| SCH-DND-04 | [C29958](https://shopview.testrail.io/index.php?/cases/view/29958) | PASS | that it still passes |
| SCH-DND-05 | [C29959](https://shopview.testrail.io/index.php?/cases/view/29959) | PASS | that it still passes |
| SCH-DND-06 | [C29960](https://shopview.testrail.io/index.php?/cases/view/29960) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-DND-07 | [C29961](https://shopview.testrail.io/index.php?/cases/view/29961) | PASS | that it still passes |
| SCH-EDGE-02 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-EDGE-03 | [C30087](https://shopview.testrail.io/index.php?/cases/view/30087) | PASS | that it still passes |
| SCH-EDGE-04 | [C30088](https://shopview.testrail.io/index.php?/cases/view/30088) | PASS | that it still passes |
| SCH-EDGE-05 | [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) | HELD | nothing on the build — it needs the PO answer |
| SCH-EDGE-06 | [C30090](https://shopview.testrail.io/index.php?/cases/view/30090) | PASS | that it still passes |
| SCH-EDGE-07 | [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | EXT | whether it can now be set up |
| SCH-EDGE-08 | [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | PASS | that it still passes |
| SCH-EVT-01 | [C30016](https://shopview.testrail.io/index.php?/cases/view/30016) | PASS | that it still passes |
| SCH-EVT-02 | [C30017](https://shopview.testrail.io/index.php?/cases/view/30017) | NOTBUILT | whether the feature shipped in this deploy |
| SCH-EVT-03 | [C30018](https://shopview.testrail.io/index.php?/cases/view/30018) | PASS | that it still passes |
| SCH-EVT-05 | [C30020](https://shopview.testrail.io/index.php?/cases/view/30020) | PASS | that it still passes |
| SCH-EVT-06 | [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | PASS | that it still passes |
| SCH-EVT-07 | [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | PASS | that it still passes |
| SCH-EVT-08 | [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | PASS | that it still passes |
| SCH-FILT-01 | [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) | PASS | that it still passes |
| SCH-FILT-02 | [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | PASS | that it still passes |
| SCH-FILT-05 | [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-HRS-02 | [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | PASS | that it still passes |
| SCH-HRS-03 | [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | PASS | that it still passes |
| SCH-HRS-04 | [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | PASS | that it still passes |
| SCH-HRS-05 | [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | PASS | that it still passes |
| SCH-HRS-06 | [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | PASS | that it still passes |
| SCH-KEY-01 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-KEY-03 | [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-KEY-05 | [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | PASS | that it still passes |
| SCH-LANE-01 | [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | PASS | that it still passes |
| SCH-LANE-02 | [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | PASS | that it still passes |
| SCH-LANE-03 | [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | PASS | that it still passes |
| SCH-LANE-04 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-LINE-01 | [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) | PASS | that it still passes |
| SCH-LINE-04 | [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | PASS | that it still passes |
| SCH-LINE-05 | [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | PASS | that it still passes |
| SCH-LINE-06 | [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | PASS | that it still passes |
| SCH-LINE-07 | [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | PASS | that it still passes |
| SCH-MCAL-01 | [C29932](https://shopview.testrail.io/index.php?/cases/view/29932) | PASS | that it still passes |
| SCH-MCAL-02 | [C29933](https://shopview.testrail.io/index.php?/cases/view/29933) | PASS | that it still passes |
| SCH-MCAL-03 | [C29934](https://shopview.testrail.io/index.php?/cases/view/29934) | PASS | that it still passes |
| SCH-MCAL-04 | [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | PASS | that it still passes |
| SCH-MODAL-01 | [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | PASS | that it still passes |
| SCH-MODAL-02 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-MODAL-04 | [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | PASS | that it still passes |
| SCH-MODAL-05 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-MODAL-06 | [C30013](https://shopview.testrail.io/index.php?/cases/view/30013) | PASS | that it still passes |
| SCH-MODAL-07 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-MODAL-08 | [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | PASS | that it still passes |
| SCH-NAV-01 | [C29925](https://shopview.testrail.io/index.php?/cases/view/29925) | PASS | that it still passes |
| SCH-NAV-03 | [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | PASS | that it still passes |
| SCH-NAV-04 | [C29928](https://shopview.testrail.io/index.php?/cases/view/29928) | PASS | that it still passes |
| SCH-NAV-05 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | PASS | that it still passes |
| SCH-NAV-06 | [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | PASS | that it still passes |
| SCH-NAV-07 | [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) | PASS | that it still passes |
| SCH-PERM-01 | [C30074](https://shopview.testrail.io/index.php?/cases/view/30074) | PASS | that it still passes |
| SCH-PERM-02 | [C30075](https://shopview.testrail.io/index.php?/cases/view/30075) | PASS | that it still passes |
| SCH-PERM-03 | [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) | PASS | that it still passes |
| SCH-PERM-04 | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) | PASS | that it still passes |
| SCH-PERM-05 | [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) | PASS | that it still passes |
| SCH-PERM-06 | [C30079](https://shopview.testrail.io/index.php?/cases/view/30079) | PASS | that it still passes |
| SCH-PERM-07 | [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) | PASS | that it still passes |
| SCH-PERM-08 | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-PERM-09 | [C30082](https://shopview.testrail.io/index.php?/cases/view/30082) | PASS | that it still passes |
| SCH-PERM-10 | [C30083](https://shopview.testrail.io/index.php?/cases/view/30083) | PASS | that it still passes |
| SCH-PERM-11 | [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) | PASS | that it still passes |
| SCH-PERM-12 | [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | PASS | that it still passes |
| SCH-PERM-13 | [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | PASS | that it still passes |
| SCH-REAS-01 | [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) | PASS | that it still passes |
| SCH-REAS-03 | [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | PASS | that it still passes |
| SCH-REAS-06 | [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | PASS | that it still passes |
| SCH-REG-01 | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | PASS | that it still passes |
| SCH-REG-02 | [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | PASS | that it still passes |
| SCH-REG-03 | [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | PASS | that it still passes |
| SCH-REG-04 | [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | PASS | that it still passes |
| SCH-REG-05 | [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | PASS | that it still passes |
| SCH-SCOPE-01 | [C29963](https://shopview.testrail.io/index.php?/cases/view/29963) | PASS | that it still passes |
| SCH-SCOPE-02 | [C29964](https://shopview.testrail.io/index.php?/cases/view/29964) | PASS | that it still passes |
| SCH-SCOPE-03 | [C29965](https://shopview.testrail.io/index.php?/cases/view/29965) | PASS | that it still passes |
| SCH-SER-01 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | PASS | that it still passes |
| SCH-SER-02 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-SER-03 | [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | PASS | that it still passes |
| SCH-SER-04 | [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | PASS | that it still passes |
| SCH-SPREAD-02 | [C29978](https://shopview.testrail.io/index.php?/cases/view/29978) | PASS | that it still passes |
| SCH-SPREAD-03 | [C29979](https://shopview.testrail.io/index.php?/cases/view/29979) | PASS | that it still passes |
| SCH-SPREAD-04 | [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) | PASS | that it still passes |
| SCH-SPREAD-05 | [C29981](https://shopview.testrail.io/index.php?/cases/view/29981) | PASS | that it still passes |
| SCH-SPREAD-06 | [C29982](https://shopview.testrail.io/index.php?/cases/view/29982) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-SPREAD-07 | [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) | HELD | nothing on the build — it needs the PO answer |
| SCH-SPREAD-08 | [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | PASS | that it still passes |
| SCH-SPREAD-09 | [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) | PASS | that it still passes |
| SCH-SPREAD-10 | [C29986](https://shopview.testrail.io/index.php?/cases/view/29986) | PASS | that it still passes |
| SCH-SPREAD-11 | [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | NOTBUILT | whether the feature shipped in this deploy |
| SCH-START-01 | [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) | PASS | that it still passes |
| SCH-START-02 | [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) | EXT | whether it can now be set up |
| SCH-START-03 | [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) | PASS | that it still passes |
| SCH-START-04 | [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) | PASS | that it still passes |
| SCH-START-05 | [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) | PASS | that it still passes |
| SCH-START-06 | [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) | PASS | that it still passes |
| SCH-START-07 | [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | PASS | that it still passes |
| SCH-TIP-01 | [C30034](https://shopview.testrail.io/index.php?/cases/view/30034) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-TIP-02 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | PASS | that it still passes |
| SCH-TIP-03 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | PASS | that it still passes |
| SCH-TIP-04 | [C30037](https://shopview.testrail.io/index.php?/cases/view/30037) | PASS | that it still passes |
| SCH-TIP-05 | [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | PASS | that it still passes |
| SCH-TOOL-01 | [C30039](https://shopview.testrail.io/index.php?/cases/view/30039) | PASS | that it still passes |
| SCH-TOOL-02 | [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | PASS | that it still passes |
| SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-VIEW-01 | [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | PASS | that it still passes |
| SCH-VIEW-02 | [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | PASS | that it still passes |
| SCH-VIEW-03 | [C30044](https://shopview.testrail.io/index.php?/cases/view/30044) | PASS | that it still passes |
| SCH-VIEW-04 | [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | PASS | that it still passes |
| SCH-VIEW-05 | [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-VIEW-06 | [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | PASS | that it still passes |
| SCH-VIEW-09 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | DEV | that the fault still reproduces (its ticket is still Open) |
| SCH-VIEW-10 | [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | PASS | that it still passes |
| SCH-WOL-01 | [C29936](https://shopview.testrail.io/index.php?/cases/view/29936) | PASS | that it still passes |
| SCH-WOL-02 | [C29937](https://shopview.testrail.io/index.php?/cases/view/29937) | PASS | that it still passes |
| SCH-WOL-05 | [C29940](https://shopview.testrail.io/index.php?/cases/view/29940) | PASS | that it still passes |
| SCH-WOL-06 | [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | PASS | that it still passes |

### Priority order for the next run

1. **The 3 not-built cases** — SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873), SCH-EVT-02 = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017), SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863). A redeploy is exactly when these change, and one of the original four **did** change today.
2. **The 19 carried-forward deviations** — all ten tickets are still Open, so expect them to reproduce; confirm rather than assume.
3. **SCH-EDGE-07** = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) — try a series scheduled ACROSS 1 November 2026 instead of trying to move the clock.
4. **The remaining 136 passes.**
