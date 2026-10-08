# PROJECT-STATE — WO Board / Tech View (build-verification lane)
## Identity (measured live 2026-10-08)
- TestRail group **13204 "WO Board and Tech View (Sep 2026)"** (suite 1), 13 sub-sections S1–S12 + "Counts and data accuracy" + "TP - Tech-plan coverage".
  Link: https://shopview.testrail.io/index.php?/suites/view/1&group_id=13204
- **148 cases**: 130 created by Bilal (user 3, all Not Automated) · **18 created by Vladimir (user 1, all Automated) — NEVER changed (Rule 38)**:
  C204099–C204101, C228761–C228763, C236975–C236983, C335320, C335321, C351740. Nobody else has edited any case (updated_by = creator on all 148).
- Markers today: 129 "HOLD - not yet build-verified on the Work Orders QA build", 1 HOLD (server-side scoping, developer check), 18 none (Vladimir's). No build stamp on any case.
- **Test run 498 "WO Board & Tech View (Sep 2026) - Execution 2026-10-01"** (created 2026-10-02, open): 130 tests = exactly Bilal's 130 cases, all Untested;
  Vladimir's 18 are not in the run. https://shopview.testrail.io/index.php?/runs/view/498
- QA branch: **sv10043** (app https://sv10043.qa.shopview.com · api sv10043api.qa.shopview.com).

## 2026-10-08 · readiness check
- Branch was ASLEEP (control path 302 → sleep.qa.shopview.com?api=sv10043). Woken with the playbook §R call
  (toggleQaEnv {"action":"wake","env":"sv10043"} → "sv10043 is waking up."); 503 for ~75 s, then **401 = awake**.
- **Sign-in not yet possible:** the saved QA sign-in (sv_sso_session from 2026-10-05) is now rejected on sv10043 AND on sv9667 (where it worked
  on 10-05) — `/api/sso/check` 401, and the sign-in page sends the browser to Google sign-in. So the cookie has expired; it is not a branch fault.
  Needs a fresh sv_sso_session from the QA lead (stored only in /tmp, never committed).
- Build version: not read yet (needs sign-in).
