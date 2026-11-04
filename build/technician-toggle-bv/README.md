# Technician Toggle — build verification on sv11788 (started 4 Nov 2026)

**Order (QA lead, 4 Nov 2026):** "We need to build verify Technician toggle now" — QA site https://sv11788.qa.shopview.com/, TestRail group 113017 (suite 1, under Founder Mode 20434).

## His answers (4 Nov 2026)
| Question | Answer |
|---|---|
| Re-check the sources first? | No re-check (PRD v20 was applied to the tests this morning by the test-writing session) |
| Who runs them / setup clicks | Same as Parts Lifecycle: preconditions say only what must be true; hard-to-make states go into a "Setup needed before testing" folder with a separate, plain Setup list for that one test |
| The 15 Public API tests | Move out of the suite (done, below) |
| The 28 Release day tests | Check screens only; they keep their marker, because the release moment only happens on production. (Their current marker is the HOLD "needs the before values taken on production…", which stays.) |

## Build facts
- QA site version label `v26.43.5-9596ea9` (index.html last modified 3 Nov 2026 12:23 GMT). **That commit is develop's, and does not contain the feature**, yet the screen shows it (New Staff Member has "Technician New" with the hint "Turn on Time Clock first. Only staff who clock in can be technicians.", probe 01). So the site was built from the feature branch merged with develop and labelled with develop's commit. Code reference used (finding aid only): branch `SV-11788-technician-toggle` head `b6a1a87427` (contains 9596ea9), worktree `/home/user/shopview-sv11788`.
- Settings is in the profile menu (top right) → `/administration`; its tabs include Staff, Roles & Permissions, Locations, Departments.
- Staff list: notice "New: Decide who appears on Board View, Tech View and the technician dropdowns. …"; tabs Active(94) / Deactivated(71); columns First Name … Technician (with New pill) · Billable.

## Live census (TestRail, 4 Nov 2026)
235 tests, all ours (created_by 3), none Automated; markers 203 "Not available on Build to test Yet", 32 HOLD. Run 555 (Mudassir) 203 tests, all untested. Writing session's last Technician Toggle commit 05:25 UTC today; nothing since.

## Done so far
- 15 Public API tests (C897280–C897294) moved to new folder **S115074 "Technician Toggle – not runnable by a manual tester"** under Founder Mode, marker `AUTOMATION: HOLD - not manually testable (developer/automated check only): …` (earlier hold reasons kept). Guarded writes, read back 15/15, display scan clean. `api-out/`.

## Blocked
- 4 Nov 2026 ~12:50 UTC: sign-in to sv11788 bounces to Google sign-in (`sso/check` 401). Stored `sv_sso_session` is the value he sent today; it worked for probes 01–02 and then expired (learning L0003). Cloudflare value added: still 401. Needs a fresh `sv_sso_session` from him.
