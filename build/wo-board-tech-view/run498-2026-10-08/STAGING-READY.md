# Run 498 — ready list for STAGING, then PRODUCTION (Rule 126; generated 12 Oct 2026)

## ⚡ ONE COMMAND (added 12 Oct 2026 evening — use this, do not rediscover anything)
1. **Sign-in:** ask the QA lead for a fresh staging `sv_sso_session` (Google sign-in; the 5 Oct cookie had EXPIRED when tried
   12 Oct — "the Google session has expired"). Put it in `/tmp/shopview/app.env` as `SV_SSO_SESSION=…` (chmod 600, never committed).
2. **Time zone first (Rule 125):** staging location to Asia/Karachi and prove it (`qa-set-tz.mjs` / `tz-match-check.mjs`, pointed at
   staging) before any time-of-day script.
3. **Run everything:** `GS_APP=https://app.staging.shopview.com WOB_API=https://api.staging.shopview.com ./staging-all.sh staging-2026-10-14`
   — writes `profiles/app.staging.shopview.com.json` on first run, then runs all 44 batch scripts (214 tests) with `ONLY=<their tests>`,
   logs + result JSON per script in `evidence/staging-2026-10-14/`, skips finished scripts on a re-run. `ONLY_SCRIPTS="a b"` for a subset.
4. **Record:** results go to the STAGING run (not run 498) with `push_results_to_run.py --run <staging run>`; same bullet style (Rules 122/123).
5. **Traps already known (do not rediscover):** the wob harness shows times in UTC (L0312 — never judge a displayed time through it;
   use `qa-branch-boot`/`bootOrigin` with `TZ=Asia/Karachi`); `wob-run.sh` passes only listed env vars (L0315 — PHASE etc. are listed);
   analytics checks need no Google Analytics (L0314, `ga-week.mts` + `ga_calc.py`); imported work orders stay in List (PRD v48).
6a. **Must-check on staging (cannot be judged on a QA branch):** C96968 — drag a card with the computer OFFLINE (Board View and
   Tech View): card goes back and "Failed to update lead technician, please try again." shows; reconnect + reload: lead unchanged
   (L0317 — QA branches redirect network errors to the sleep page). Script: `e84-ui.mts` with ONLY=offline, pointed at staging.
6. **Not needed on staging:** the 14 ad-hoc re-check scripts below with the QA address written in — every test is covered by a batch
   script in the table, and those follow `GS_APP`.


**How to run a script on another environment:** `GS_APP=https://<host> ./wob-run.sh discover-profile.mts` once (writes `profiles/<host>.json`: API address, organisation, the two locations), then `GS_APP=https://<host> ./wob-run.sh <script>`. Sign-in values go in `/tmp/shopview/<host-key>.env` (never committed).
**Before any time-related script:** Rule 125 — set the location to Asia/Karachi and run `tz-match-check.mjs` (exit 0) on that environment.
**Data:** every script makes its own `ZZAUTOTEST` data by name; nothing depends on a QA-branch id.
**Scripts that still have the QA-branch address written in (14) — switch them to `GS_APP` / `qa-branch-boot.mjs staging` before the staging pass:** `explore-workorders.mts`, `profile.mts`, `orgb-seed.mts`, `orgb-login-probe.mts`, `orgb-fix3.mts`, `clean-tz-check.mjs`, `clean-labor-read.mjs`, `qa-asset-count.mjs`, `ah-ui.mts`, `ah-ui2.mts`, `ah-ui3.mts`, `ah-ui4.mts`, `case-ui.mts`, `case-ui2.mts`
**Tests with no script found (30) — run by hand or from the run comments:** 368164, 368142, 368143, 96997, 96999, 97000, 368180, 368181, 368182, 368183, 368184, 368185, 368186, 368187, 368226, 368227, 368228, 368229, 368230, 368231, 368232, 368233, 368234, 368235, 368236, 368237, 368243, 368244, 97033, 97034

| Script (newest that runs these) | Tests | Status on QA branch |
|---|---|---|
| `analytics-batch.mts` | C97023, C97024, C97025, C97026, C97027, C97029, C97035, C368153, C368155 | Passed 8, Blocked 1 |
| `c368149-two.mts` | C97010 | Passed 1 |
| `editwo-fix.mts` | C368169, C368170, C368171 | Passed 3 |
| `high1-batch.mts` | C368166, C368167, C368168, C368176, C368213 | Passed 5 |
| `high1-fix7.mts` | C368172, C368173, C368174, C368177, C368178, C368179, C368188, C368189, C368190, C368192, C368202, C368191 | Passed 12 |
| `high2-batch.mts` | C368193, C368194, C368195, C368198, C368199, C368200, C368201, C368203, C368205, C368206, C368207, C368208, C368209, C368210, C368212, C368214 | Passed 16 |
| `imp-fix4.mts` | C368238, C368239 | Passed 2 |
| `kbd-fix4.mts` | C97020, C97021, C97022, C368150, C368151, C368152 | Passed 6 |
| `medium-fix4.mts` | C368220, C368222, C368224, C368225, C368245, C368246 | Passed 6 |
| `orgb-fix3.mts` | C154650, C368175 | Passed 2 |
| `ps-counts2.mts` | C368215, C368217, C368241 | Passed 3 |
| `rest-batch.mts` | C368156, C368240, C368197, C368218, C368219, C368223 | Passed 6 |
| `s1-batch1.mts` | C96909, C154885 | Passed 2 |
| `s1-batch2.mts` | C96921 | Passed 1 |
| `s1-batch2b.mts` | C96913, C154884 | Passed 2 |
| `s1-batch3.mts` | C96911, C96914, C96915, C96920 | Passed 4 |
| `s1-batch4a.mts` | C96910, C96912, C96919, C96923 | Passed 4 |
| `s1-batch4b.mts` | C96916, C96917 | Passed 2 |
| `s11-batch.mts` | C97028, C368154, C97031, C154648, C154649, C368158, C368159 | Passed 7 |
| `s11-fix2.mts` | C97030, C97032, C368157 | Passed 3 |
| `s2-batchA.mts` | C96924, C96925, C96928, C96931, C96932, C96933, C96939, C368128, C368129 | Passed 9 |
| `s2-batchB.mts` | C96935, C96936, C96937, C368126, C368162 | Passed 4, Blocked 1 |
| `s2-batchC.mts` | C96926, C96927, C96929, C96930, C96934, C96938, C368125, C368127, C368130, C368161 | Passed 9, Failed 1 |
| `s3-batchA.mts` | C96940, C96941, C96942, C96943, C96944, C96945, C96946, C96947, C96948, C96949, C96951, C96952, C96953, C96954, C96955 | Passed 15 |
| `s3-batchB.mts` | C154886, C368132 | Passed 2 |
| `s3-batchC.mts` | C96950, C368131 | Passed 2 |
| `s4-batchA.mts` | C96956, C96957, C96959, C96967, C96969, C96970, C96973, C96974, C368163 | Passed 9 |
| `s4-batchC.mts` | C96965, C154888, C154889, C154890, C368133, C368134, C368135, C368136 | Passed 8 |
| `s4-batchD.mts` | C96968, C96971, C154887, C368137, C368138, C368139 | Failed 1, Passed 4, Blocked 1 |
| `s4-batchE.mts` | C96960, C96961, C96962, C368140 | Passed 4 |
| `s4-batchG.mts` | C96963, C96964, C96972 | Passed 3 |
| `s4-batchH.mts` | C96958, C96966 | Passed 2 |
| `s5-batchA.mts` | C96977, C96981 | Passed 2 |
| `s5-batchA3.mts` | C96975, C96976, C96983 | Passed 2, Failed 1 |
| `s5-batchB.mts` | C96979, C96980, C96986, C368160 | Passed 3, Blocked 1 |
| `s5-batchC.mts` | C96978, C96982, C96984, C96985 | Failed 1, Passed 3 |
| `s6-batch.mts` | C96987, C96990, C96991 | Passed 3 |
| `s6b-batch.mts` | C96988, C96989, C96992 | Passed 3 |
| `s7-batch.mts` | C96993, C96994, C96995, C96996, C368141 | Passed 5 |
| `s8-batch.mts` | C96998 | Passed 1 |
| `s9-batchA5.mts` | C97001, C97002, C97004, C97006, C97008, C97009, C97011, C97013, C368144, C368145, C368148 | Passed 11 |
| `s9-batchB.mts` | C97005, C97007, C368147 | Passed 3 |
| `s9-fix8.mts` | C97003, C97012, C368146 | Passed 3 |
| `sort-fix5.mts` | C368196 | Passed 1 |
| `— by hand (see note)` | C368164, C368142, C368143, C96997, C96999, C97000, C368180, C368181, C368182, C368183, C368184, C368185, C368186, C368187, C368226, C368227, C368228, C368229, C368230, C368231, C368232, C368233, C368234, C368235, C368236, C368237, C368243, C368244, C97033, C97034 | Blocked 3, Passed 27 |
