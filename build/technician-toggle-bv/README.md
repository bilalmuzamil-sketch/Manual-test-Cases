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

- Sign-in expired ~12:50 UTC (Google bounce); he sent a fresh `sv_sso_session` at ~13:15 and the walk continued.
- **Screens walked, probes 03–18** (`probe/`): every label in `build/OBSERVED-UI-LABELS-sv11788.md`, including what was NOT seen.
- **Pass 1** (`apply1/`): 220 tests — start lines and steps rewritten into the build's clicks (484 line rewrites, labels only from the probes), build line added before the marker (`Last checked …` or `Partly checked …; not yet seen on that build: …`), marker `Not available on Build to test Yet` → `AUTOMATION: READY` (Release day keeps its HOLD). Guarded, 220/220 read back.
- **Pass 2** (`apply2/`): 108 tests whose starting state is hard to make moved to new folder **S115075 "Setup needed before testing"** (under 113017), each with a separate, plain `Setup` list built only from its own preconditions (`apply2/setup.py`); "Lead technician" → "Lead Technician" (as on screen once a work order has a line); C897336 precondition "View mode: Tech view" → "View mode set to Tech view (under Work orders)"; 7 duplicated partly reasons removed. 111 + 1 + 7 writes, all read back.
- **Gates (live):** `verify_suite.py --root 113017 --observed build/OBSERVED-UI-LABELS-sv11788.md` ALL CHECKS PASSED (220 sourced, markers READY 192 + HOLD 28, 0 not runnable, precondition labels clear); `check_runnable_cases.py` 220/220; `check_tester_runnable.py` PASS. Two checker vocabulary fixes (dated comments): verify_suite now recognises this suite's "Exact quotes from the source … From:" block; check_tester_runnable counts the build's "Create Work Order" as building a work order.
- Throwaway data left on sv11788 (dummy branch): staff member "ZZAUTOTEST TT Staff A" (zzautotest.tt.a@example.com, active, Technician on) and work order S11788-17580 (Approved, lead Staff A, line "ZZAUTOTEST TT LINE 1" with labor rows Staff A and Admin ShopView). Admin was clocked in on that line by the Start check and was clocked out again (probe 18).

## Partly checked (43 tests) — see `final-tally.txt` for the C-ids per reason
Not seen on this build: signing in as a newly made staff member; "Reassign lead technician"; recording time as the new staff member; a line's own technician / a Schedule shift / five lines; "No technicians yet"; a phone number field in Edit Staff Member (the window has none — C897217–C897219 ask the tester to change it); the Sales Representative removal warning; a part sale's page; work orders in Ready for Review / Declined / Complete / Invoiced / Paid; the add-time-entry window; a technician filter on Technician Efficiency; Schedule department lanes; switching permissions off in a custom role; Add Technician without a labor entry; "Deleted technician" in the filter.

## Follow-up, 4 Nov 2026 (QA lead: "1. (a)", "2. Yes, if those tests were created by ME/us")
- C897217, C897218, C897219: the phone number (no such field in Edit Staff Member) is now Job Title in preconditions, steps and the step
  results; the quoted PRD text is unchanged (it names no phone). Build line now full. `phone-fix/` (writes read back; checks 3/3; display 3/3).
- Run 555: the 11 Public API tests that were in it (C897280–C897290, all created by us, all untested) removed; read back 192 tests, all
  still assigned to Mudassir and untested. `run555/`. C897291–C897294 were never in the run.
- Partly checked now 40 tests (the 3 phone tests are fully checked).
