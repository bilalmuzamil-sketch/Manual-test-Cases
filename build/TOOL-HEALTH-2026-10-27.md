# Checking-tool health check — 27 Oct 2026 (build-verification session)

Asked by the QA lead after another session found its shared checkers failing. This session's copies
(branch `claude/build-verification-setup-aieu36`) were each run for real; nothing was edited.

| Tool | Result | Notes |
|---|---|---|
| `scan_secrets.py` (+ pre-commit hook) | WORKS | selftest passes. Was running in half mode: `/tmp/secret-fingerprints.json` was gone (container reset). Rebuilt with `make_secret_fingerprints.py` — **rebuild it in every new container**. |
| `check_section1_size.py` | WORKS | §1 within cap; selftest 19/19 |
| `check_rule_amendments.py` | WORKS | exit 0 |
| `check_tester_readiness.py`, `verification_badge.py`, `snapshot_case_bodies.py`, `check_angle_brackets.py`, `make_secret_fingerprints.py`, `testrail_add_case.py`, `selftest_testrail_statuses.py` | WORK | all selftests pass (flag is `--selftest`, not `--self-test`) |
| `plain_check.py` | WORKS | plain sample passes, jargon sample is refused |
| `blocker_gate.py` | WORKS | starts; usage correct |
| `check_tester_runnable.py`, `check_runnable_cases.py` | WORK | read TestRail, give verdicts |
| `check_case_render.py` | WORKS, NOISY | flags bold/line-break tags that display correctly on screen (UI-saved text); the on-screen scan is the real arbiter |
| `served_scan_any.mjs` (on-screen display scan) | WORKS | C96916, C96927, C96929 all display correctly |
| `ensure_bridge.sh` | WORKS | restarted, OK |
| `staging-boot2.mjs` | WORKS | stops correctly: the saved staging sign-in is still the expired one; a fresh one is needed |
| All `.mjs` / `.py` in `build/testing-tools/` | OK | every file passes a syntax/compile check |
| **`check_precond_labels.py`** | **FIXED 27 Oct (QA lead: option a)** — was BROKEN | crashes `KeyError: 'email'` — reads `c['email']` but `/tmp/testrail/creds.json` names the field `user` (the shared `load_creds.py` accepts both). Proven: with a temporary copy that adds `email`, it runs and gives real verdicts. Fix: line 95 now reads `c.get('email') or c['user']` — this branch's copy only; files with `email` still work. Re-run with the normal creds file: runs, real verdicts, and `verify_suite.py` check 8 no longer crashes. |
| `verify_suite.py` | WORKS | check 8 crashed until the fix above; its "re-run:" hint prints `--cases` twice (cosmetic only — the real call is correct) |

## Suite findings seen in passing (WO Board and Tech View, section 13204) — not tool faults

Cases were edited by other sessions after this lane's 16 Oct pass (e.g. C96916 and C96929 on 19 Oct):
requirement ids in tester-facing Expected bullets (C96929), a new `AUTOMATION: UNIT-TESTED - …`
marker form not in this rule book (C581915, C698883, C682422), 62 cases without a source line per
check 4, build stamps naming older builds, and run 498 missing 57 suite cases. Reported, not acted on.
