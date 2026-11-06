# RESOLVED 6 Nov 2026 09:28 UTC (fresh cookies from the QA lead, preflight 200/200). WAS: BLOCKED, 5 Nov 2026 17:33 UTC: sign-in has expired on sv11839 and on staging

- **What fails:**
  - `tools/preflight.py` (in `build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/`) gets **401 `sso_required`** from `…api/auth/me/fe-permissions` on both sites:
    - sv11839, build v26.45.0-277b249;
    - staging, build v26.45.2-a434e28.
  - Staging quick-login also gets 401.
- **Why:**
  - The cookie sets are `/tmp/cln/qa11839/cookies.json`, saved 4 Nov 17:12 UTC, and `/tmp/cln/cookies.json`, saved 4 Nov 15:38 UTC.
  - Their Max-Age is about 24 h (playbook line 191), so both have now expired.
  - The worker tried each cookie singly and in pairs, which rules out the "only `cf_clearance` expired" trap (playbook line 283).
  - `sv_sso_session` alone sends you to the Google sign-in page.
  - Playbook line 211: *"cookies are mintable ONLY by the QA lead"*. Google SSO cannot be automated from this workspace.
- **Searches run (Rule 97):**
  - `git grep sso_required`;
  - playbook §A and the unblock section;
  - `14-ACCESS-RESILIENCE.md`;
  - the container, for newer cookie files.
- **What it blocks:** areas 2–8 of the 5 Nov Dashboard bug hunt. The ready-to-run plans are in that folder's `RESULTS.md`.
- **What it does NOT block:**
  - Jira work;
  - area 1 (reconcile), which is done: no confirmed Dashboard defect is missing a ticket.
- **Unblock:** the QA lead pastes fresh cookie sets for **sv11839** and **staging**. Then:
  1. run `preflight.py` and confirm 200/200;
  2. run areas 2–8 from `RESULTS.md`.

  The Fiji day-boundary window comes back every day from 12:00 to 23:59 UTC.
