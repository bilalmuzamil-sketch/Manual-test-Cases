# RESUME — full staging run of run 498 (started 16 Oct 2026 ~20:45 UTC, QA lead: "Please start testing ALL the test cases")

**State when started:** staging build v26.40.19-1493c63 (build-verification session re-stamped cases 19:06–19:25 UTC; no Expected
content changed — only build stamps, AUTOMATION markers, precondition wording). 278 tests. Admin + Analyst 1 cookies share ONE
Google sign-in (L0407): Analyst 1 block runs first. Cookies in /tmp/qa-cookies (staging-sso.txt, staging-full.json,
staging-analyst1.json), password /tmp/shopview/staging-analyst1.env. Never print or commit them.

**Command:** `cd RUN && RUN_DRAFTS=1 RUN_GA=day1 NO_SIGNOUT=1 ./run-full-1016.sh` (background). Logs:
`evidence/staging-full-2026-10-14/logs-full-1016/` + `queue.out`. Resume after a crash: `FROM=<step> ...` (step numbers in queue.out).
After the container restarts: restart the relay (bridge.mjs, L0355) and memwatch.sh, then FROM=<next step>.

**Then:** judge every test against its LIVE case text (Rules 12, 104, 114), annotate pictures, post batches with
`push_results_to_run.py --run 498 --build-marker <live build> --env staging --screenshots yes --allow-non-passed`; failures get the
existing ticket link or a held draft (Rule 113: file only on the QA lead's yes; check the PRD live first, Rule 106/L0403).
Fix-ups for script faults, then sign-out (signout-fix.mts, C368240) LAST. Analytics day 2 (`RUN_GA=day2`) on the next Pakistan day.
Open asks to the QA lead: C97021/C368151 Expected vs PRD v55+ (now re-stamped READY by the build-verification session — re-check);
SV-11101 reopen; C590117 tooltip ticket.

## 17 Oct 02:50 UTC — judge notes for fix-up 2 (do not lose)
- **C96975** (fix-up 2, s5-batchA3.mts): steps 16–18 (log out, log back in) are SUBSTITUTED by a fresh page load, because a log-out ends the one shared staging sign-in mid-queue. A substituted step is not observed (Rule 12) ⇒ C96975 can NOT be marked Passed on the fix-up reading alone. Re-do steps 16–18 by hand-script at the very END, together with signout-fix.mts (C368240), after every other step; judge only then.
- **C368171** (fix-up 2, editwo-fix.mts) needs Ralph Edwards by name; if he is still not offered ⇒ Failed on SV-11393 (OBSOLETE, still reproduces), not Blocked.
- **C96936** step 5: if Ralph is not offered in tab B, the lead is set through the page's own save; the refresh in tab A is what the case judges — say in the result how step 5 was done.
