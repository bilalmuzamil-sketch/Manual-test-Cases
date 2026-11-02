# Technician Toggle — case library report (2 Nov 2026)

PRD "Technician Toggle", Confluence 977371146, **version 17** (2 Nov 2026, Chris Ward). Project type (ii) V2 / upgrade. Epic SV-11788. Round 2 (same day) added the 34 design cases and References from Design. Library: `build/technician-toggle/authoring/` (`tt_lib.py`, `cases_*.py`, `build.py`). Nothing was written to TestRail, Jira, Slack or Google; nothing was committed.

## 1. Counts per section

| Key | Proposed subsection of 113017 | Cases | Held |
|---|---|---|---|
| S1 | Technician toggle on a staff member | 41 | 1 |
| S2 | Turn Off Technician warning | 41 | 3 |
| S3 | Who appears on the technician lists | 50 | 1 |
| S4 | Technician column and notice on the staff list | 11 | 2 |
| API | API - Public API technician value on staff | 15 | 4 |
| S6 | Release day | 28 | 28 |
| INV | What must not change | 19 | 0 |
| DESIGN | Design — how it looks | 32 | 0 |
| | **Total** | **237** | **39** |

Markers: `AUTOMATION: Not available on Build to test Yet - Last checked 11/2/2026` × 198; `AUTOMATION: HOLD - needs the before values taken on production shortly before the release reaches production; run on production after the release` × 29; `AUTOMATION: HOLD - the end date is set only when the release is scheduled; run on the release build before release day` × 2; `AUTOMATION: HOLD - the counts usually load faster than a person can see or click the loading Save button` × 2; `AUTOMATION: HOLD - a manual tester cannot make only the open-work count request fail while the save still works` × 1; `AUTOMATION: HOLD - a manual tester cannot make only the list of technicians fail while the rest of the work order loads` × 1; `AUTOMATION: HOLD - a manual tester cannot make the staff list fail while the page itself still loads` × 1; `AUTOMATION: HOLD - needs a Public API request that changes a staff member's role; the saved sources name none` × 1; `AUTOMATION: HOLD - needs the Public API request that sets a work order's lead; the saved sources name none` × 1; `AUTOMATION: HOLD - the changelog entry is published with the release; run once the release notes for the Public API are out` × 1.

The default marker is Rule 69's `AUTOMATION: Not available on Build to test Yet - Last checked 11/2/2026`, because no build exists yet. The brief says API cases get `AUTOMATION: READY` when their steps are fully given. Under Rule 69, READY waits for a build check, so the fully given API cases carry the Rule 69 marker like every other case. Changing that is one constant (`tt_lib.MARKER`) if the coordinator rules otherwise.

## 2. Code coverage (every requirement code, named item and sub-item)

| PRD item | Cases, or why not testable |
|---|---|
| S1-R1 | S1-01, S1-02 |
| S1-R2 | S1-02, S1-03, S1-04, S1-05, S4-08 |
| S1-R3 | S1-06, S1-07, S1-08, S1-09, S1-10, S1-11, S1-15, S1-16, S1-17, S1-18, S1-19, S1-20, S1-21, S1-22, S1-23, S1-28, S1-37 |
| S1-R4 | S1-14, S1-16, S1-19, S1-25, S1-27, S2-23, API-08 |
| S1-R5 | S1-16, S1-17, S1-25, S6-23 |
| S1-R6 | S1-30, S2-32, S3-37, API-04 |
| S1-R7 | S1-21, S1-22, S1-31, S2-38 |
| S1-R8 | INV-11, INV-12, INV-13 |
| S1-R9 | S1-32, S1-33, S6-25, INV-08, INV-09 |
| S1-N1 | S1-08, S1-10, S1-12, S1-13, S1-20, S1-26, S1-27, S1-28, S1-29, S2-24, S2-25, S3-16, API-12 |
| S1-N2 | S1-34 |
| S1-N3 | not testable: States that the feature adds no history of who changed Technician or when. There is no screen where such a history would appear, so a tester has nothing to look at and no control to prove the check ran (L-15). |
| S1-E1 | S1-23, S1-24, S1-26 |
| S1-E2 | S1-35, S1-36, S3-12, S4-02, API-03 |
| S1-E3 | S1-30, S3-37, S3-38, S3-39, S3-40, S3-41, S3-42, S3-43, S3-44, S3-45 |
| S1-E4 | S1-36 |
| S2-R1 | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08, S2-09, S2-10, S2-11, S2-12, S2-13, S2-14, S2-23, S2-24, S2-25 |
| S2-R2 | S2-01, S2-02, S2-06, S2-22, S2-39 |
| S2-R3 1/1 | S2-03, S2-32 |
| S2-R3 0/5 | S2-04 |
| S2-R3 3/0 | S2-05 |
| S2-R3 1/0 | S2-01, S2-22 |
| S2-R3 0/1 | S2-02 |
| S2-R3 | S2-01, S2-02, S2-03, S2-04, S2-05, S2-22, S2-32 |
| S2-R4 | S2-28, S2-29, S2-30, S2-31, S2-32, S2-33, S2-34, S2-35, S2-40 |
| S2-R5 | S2-32, S3-17, S3-48 |
| S2-N1 | S2-15, S2-16, S2-17, S2-18, S2-19, S2-20, S2-21 |
| S2-N2 | S2-37, S2-38 |
| S2-E1 | S2-15, S2-16, S2-17, S2-18, S2-19, S2-20 |
| S2-E2 | S2-26, S2-27 |
| S2-E3 | S2-39, S2-40, S2-41, INV-18 |
| S3-R1 | S1-35, S3-01, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16 |
| S3-R2 | S1-30, S3-01, S3-02, S3-17, S3-28 |
| S3-R3 | S3-03, S3-48 |
| S3-R4 | S3-04, S3-05, S3-06, S3-44 |
| S3-R5 | S3-07, S3-45 |
| S3-R6 | S3-08, S3-09, S3-10 |
| S3-R6a | INV-10 |
| S3-R7 | S1-36, S3-06, S3-17, S3-18, S3-22, API-13, S6-27 |
| S3-R7a | S3-21, S3-22 |
| S3-R8 | S3-23, S3-24, S3-25, S3-26, S3-27, S6-27 |
| S3-R9 | INV-01, INV-02, INV-03, INV-04, INV-05, INV-06, INV-19 |
| S3-R10 | S3-29, S3-30, S3-31, S3-32, S3-33, S3-34, S3-35, S3-36, S3-49, S3-50 |
| S3-N1 | S3-01, S3-02, S3-03, S3-04, S3-07, S3-08, S3-11, S3-50, S3-48 |
| S3-N2 | S1-12, S1-13, S3-14, S3-15 |
| S3-N3 | S3-46, API-13 |
| S3-E1 | S3-17, S3-19, S3-20, S3-33 |
| S3-E2 | S3-28, S3-34 |
| S3-E3 | INV-07 |
| S4-R1 | S1-21, S1-22, S1-35, S4-01, S4-02, S4-11 |
| S4-R1a | S4-03 |
| S4-R2 | S4-04 |
| S4-R3 | S4-05, S4-08, S4-10 |
| S4-R4 | S4-06, S4-07 |
| S4-R5 | S4-06, S4-08, S4-09, S4-10 |
| S4-N1 | S1-34 |
| S4-N2 | S1-04, S4-09 |
| S4-E1 | S4-11 |
| S5-R1 | API-01, API-02, API-03, API-04, API-05, API-15 |
| S5-R2 | API-14 |
| S5-N1 | API-06, API-07, API-09, API-10, API-11 |
| S5-E1 | API-03 |
| S6-R1 | S6-01, S6-02, S6-03, S6-04, S6-05, S6-06, S6-07, S6-08, S6-09, S6-10, S6-11, S6-12, S6-13, S6-14, S6-18, S6-19, S6-20, S6-22, S6-25 |
| S6-R1 a | S6-01, S6-02, S6-03, S6-04, S6-05, S6-06 |
| S6-R1 c | S6-19, S6-25 |
| S6-R1 b | S6-07, S6-08, S6-09, S6-10, S6-11, S6-12, S6-13, S6-14, S6-18 |
| S6-R2 | S6-02, S6-05, S6-18, S6-24 |
| S6-R3 | API-15, S6-25 |
| S6-R4 | S6-26 |
| S6-R5 | S6-27 |
| S6-N1 | S6-24 |
| S6-N2 | S6-21 |
| S6-E1 | S6-27 |
| S6-E2 | S6-14, S6-15, S6-16, S6-17 |
| S6-E3 | S6-22, S6-23 |
| S6-E4 | S6-28 |
| EH-S1 | S1-14, S1-27, S1-38, S1-39, S1-40, S1-41, API-08, API-09, API-10, API-11, API-12 |
| EH-S2 | S2-36 |
| EH-S3 | S3-47 |
| EH-S4 | not testable: Says the staff list loads and fails as today, with no new failure path. The one testable part, the notice placement when the list fails to load, is in S4-R4 and has its own (held) case. |
| EH-S5 | not testable: Says the Public API has no new failure paths; there is nothing new to trigger. |
| EH-S6 | S6-26 |
| GOAL-1 | S3-01, S3-02, S6-24 |
| GOAL-2 | S6-01 |
| GOAL-3 | S1-06, S1-07, S1-09, S6-01 |
| GOAL-4 | S6-26, INV-11 |
| KD-BILL | S1-32, S1-33, S6-19, INV-09 |
| KD-LISTS | INV-01 |
| KD-LOGOUT | INV-11, INV-13 |
| KD-NEW | S1-06, S1-07, S1-08, S1-09, S1-37 |
| KD-NOFLAG | not testable: No feature flag exists to switch, so there is nothing to look for beyond the release-day cases, which already run with no setting switched on. |
| KD-OFFER | S3-46, API-13, INV-07 |
| KD-REL | S6-01 |
| KD-TOGGLE | S1-01, INV-15 |
| KD-TWO | S1-14, S3-11 |
| KD-WARN | S2-01, S2-32 |
| OOS-1 | S1-32, S1-33, INV-05, INV-08, INV-09, INV-18 |
| OOS-2 | INV-01, INV-02, INV-03, INV-07 |
| OOS-3 | INV-04, INV-05, INV-19 |
| OOS-4 | INV-06 |
| OOS-5 | INV-16 |
| OOS-6 | S4-04, INV-17 |
| PERM-GOV | S1-34, S4-06, INV-15 |
| PERM-NOACCESS | INV-16 |
| PERM-NONEW | INV-15 |
| T-LISTS | S3-01 |
| T-OPEN | S2-01, S2-04, S2-07, S2-08, S2-09, S2-10, S2-11, S2-12, S6-14 |
| T-TECH | S3-11, S3-16, S4-01 |
| T-TECHVIEW | S3-02, INV-14 |
| T-THREE | S1-32 |
| T-VOCAB | not testable: A vocabulary note mapping the screen word location to the back-end word workplace; no behaviour. |
| UFS-1 | S4-06 |
| UFS-2 | S1-14, S1-25 |
| UFS-3 | S1-12, S1-13, S1-26 |
| UFS-4 | S2-01, S2-06 |
| UFS-5 | S1-38 |
| UFS-6 | S1-39, S1-40, S1-41 |

Every §8 (User Feedback Summary) message is used word for word in a step or result (a `build.py` gate).

## 3. Held cases and why

| Reason | Cases |
|---|---|
| needs the before values taken on production shortly before the release reaches production; run on production after the release | 29 |
| the end date is set only when the release is scheduled; run on the release build before release day | 2 |
| the counts usually load faster than a person can see or click the loading Save button | 2 |
| a manual tester cannot make only the open-work count request fail while the save still works | 1 |
| a manual tester cannot make only the list of technicians fail while the rest of the work order loads | 1 |
| a manual tester cannot make the staff list fail while the page itself still loads | 1 |
| needs a Public API request that changes a staff member's role; the saved sources name none | 1 |
| needs the Public API request that sets a work order's lead; the saved sources name none | 1 |
| the changelog entry is published with the release; run once the release notes for the Public API are out | 1 |

| Case | Title | Why held |
|---|---|---|
| S1-05 | On the release build the "New" pill ends on the seventh day after release | the end date is set only when the release is scheduled; run on the release build before release day |
| S2-34 | Save & Close shows its loading state while the counts load | the counts usually load faster than a person can see or click the loading Save button |
| S2-35 | Closing the staff window while the counts load cancels the save | the counts usually load faster than a person can see or click the loading Save button |
| S2-36 | When the counts fail, the save goes ahead without the warning | a manual tester cannot make only the open-work count request fail while the save still works |
| S3-47 | If only the technician list fails, the work order still loads | a manual tester cannot make only the list of technicians fail while the rest of the work order loads |
| S4-07 | When the staff list fails to load, the notice still shows below the error | a manual tester cannot make the staff list fail while the page itself still loads |
| S4-10 | On the release build the notice and column pill end on the seventh day | the end date is set only when the release is scheduled; run on the release build before release day |
| API-12 | Moving a technician to Office User through a request saves and turns it off | needs a Public API request that changes a staff member's role; the saved sources name none |
| API-13 | A non-technician made lead through the Public API is accepted | needs the Public API request that sets a work order's lead; the saved sources name none |
| API-14 | The Public API changelog announces the technician value | the changelog entry is published with the release; run once the release notes for the Public API are out |
| API-15 | Staff turned on at release are picked up as changed by the Public API | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-01 | Time on a work order in the last 90 days turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-02 | Time on a work order older than 90 days does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-03 | Time on a part sale in the last 90 days turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-04 | A manual time entry made by someone else turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-05 | Time on a department only does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-06 | A time entry dated after the release moment also counts | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-07 | Leading a service work order in Approved turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-08 | Leading a service work order in In Progress turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-09 | Leading a service work order in Ready for Review turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-10 | Labor on an open line of someone else's work order turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-11 | Being added with Add Technician to an open line turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-12 | Being a line's own technician on an open line turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-13 | Being on an open line through a schedule shift turns Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-14 | Leading only an Estimate does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-15 | Leading only a declined work order does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-16 | Being only on a declined line does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-17 | Being only on a part sale does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-18 | Leading only a Complete work order does not turn Technician on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-19 | Billable on turns Technician on even with no work | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-20 | Someone on the Office User role is never turned on, even if billable | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-21 | A staff member with no role is never turned on | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-22 | Someone deactivated on release day stays off after reactivation | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-23 | Time Clock off on release day stays off when Time Clock is turned on later | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-24 | A Parts Manager with no evidence starts off and leaves the board | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-25 | Nothing else on a staff record changes at release | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-26 | Nobody is logged out by the release and no message shows | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-27 | Open work is untouched for someone who starts off | needs the before values taken on production shortly before the release reaches production; run on production after the release |
| S6-28 | The release step runs once: a later choice to turn off sticks | needs the before values taken on production shortly before the release reaches production; run on production after the release |

Lesson L-14 says a behaviour a manual tester cannot set up is not written as a manual case. The brief (point 10) says to keep such cases with the exact expected text and a HOLD marker. These cases are kept as HELD in the library (not for a manual run): S2-34, S2-35, S2-36, S3-47 and S4-07 (coordinator, round 2: kept; the QA lead decides whether they go to TestRail).

## 4. Stories and tickets against PRD v17

- **Stories SV-11879 to SV-11884:** all 68 requirement lines match PRD v17 word for word, and so do the six Error Handling lines (`authoring/story_diff.py`, `story_diff.json`). No PRD code is missing from a story. The acceptance criteria add worked examples (Jordan Lee / "Jordy", "Pat", 2 + 1 counts across two locations) that agree with the PRD. Story 1 and Story 4 also add the SV-12008 placeholder check ("if it is still the placeholder 31 Dec 2026, 07:00 UTC, this check fails"), which S1-05 and S4-10 carry.
- **Epic SV-11788:** the description says "New staff start with it off". PRD v17 S1-R3 pre-fills from the role (on for the built-in Technician and Foreman roles with Time Clock on). The PRD and story SV-11879 (updated 14:29 UTC) are later than the epic (09:33 UTC), so the cases follow PRD v17 (Rule 32). It is not a PO question; the epic text needs refreshing.
- **Verification tasks (Nemanja Djuric) against v17:**
  - **SV-11962** (NO-CASE): Developer verification task for Release A of the ROLE version (PRD v9): a session-neutral Technician permission on roles, migrations, fe-permissions, "Role is not editable.". PRD v17 has no Technician setting on roles, so none of its checks applies. The user-visible behaviour it protects (no logout from a Technician change or the release) is covered by INV-11 and S6-26.
  - **SV-11963** (COVERED): Developer checklist for the lists (B1). Its setup ("turn Technician off on a test role such as Parts Manager") is the role version; under v17 the toggle is per staff member. Every check that still holds is covered by the Story 3 cases named here. Its line "Time sheets, the time sheet dialogs, Punch Clock Activities, Part Sale, Schedule ... still list them" names Part Sale, which PRD v17 S3-R6a says shows no technician dropdown.
  - **SV-11964** (COVERED): Developer checklist for the warning (B2), written for the role version: "Roles & Permissions → Edit a role", a people count and the role name, "Save continues to the Confirm Permission Updates window", and a count endpoint per role. PRD v17 warns per staff member in Edit Staff Member. The v17 checks are covered by the Story 2 cases named here.
  - **SV-11965** (NO-CASE): Developer checklist for a Technician card in Roles & Permissions (B3): role version only (Cross-Cutting card, Confirm Permission Updates, View Permissions, Duplicate Role, Reset To Template). PRD v17 has no such card; INV-15 checks that Roles & Permissions gains no Technician permission. Its pill end-date item is covered by S1-05 and S4-10 (SV-12008).
  - **SV-11966** (COVERED): Developer checklist for the staff list column, notice and Public API value (B4). Its rule "Yes = active, role has Technician on, Time Clock on" is the role version; v17 reads the person's own toggle (S4-R1). Covered by the Story 4 and API cases named here.
  - **SV-11967** (COVERED): Developer checklist for the release-day migration (B5), granting per ROLE ("a role with evidence is on whatever its name"); PRD v17 turns Technician on per staff member (S6-R1). The evidence rules that still match are covered by the Release day cases named here.
  - **SV-11968** (COVERED): Developer checklist for the "No technicians yet" text (B6a). Its text "Turn Technician on for a role in Roles & Permissions to assign work orders. ..." is the v9 text; PRD v17 S3-R10 reads "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned.". The cases follow v17.
  - **SV-11969** (COVERED): Developer checklist for "Set Up Technicians" and the first-run text (B6b). It says the button "opens Roles & Permissions" and the text reads "...for a role and create your first work order..."; PRD v17 S3-R10 says it opens the staff list (Settings, Staff) and reads "Turn Technician on for your technicians and create your first work order to track work by tech.". The cases follow v17.
- **SV-11719** (origin bug) and **SV-12008** (the "New" end date): covered by new cases (TICKET-LEDGER.json).

## 5. Tech plan notes (plan of 28 Oct 2026, written for PRD v9; QA lead: "No newer plan; go ahead")

Used only where it still matches v17: the Public API staff requests and field names (`GET /api/v1/staff`, `/v1/staff/{id}`, `/v1/locations/{id}/staff`; `technician` read-only, ignored on `PATCH`); the changelog location (D6); the 30-second Back rule (`RESUME_STALE_TIME_MS = 30_000`, which matches S1-E3); the lead window refetching on every open (S1-E3); the technician-list failure behaviour (S3 Error Handling); and the Edit Line save keeping former technicians (D1, S3-R8). Quoted in API-01, API-02, API-05, API-06 and API-14.

Statements that contradict v17's staff-toggle model are not used as expectations:
- Technician is a permission bundle on each ROLE (§2, D11, Phase A1/B3: a Cross-Cutting card in Roles & Permissions). v17: a toggle on each staff member, next to Sales Representative.
- S1 Error handling: one message, "Role is not editable." (Q3, PRD v9). v17: "A technician must have Time Clock on." and "This role can't be a technician."
- S2 warning per role: "1 person on E2E Role leads 1 open work order...", counting the role's people, with Save continuing to Confirm Permission Updates. v17: per person, "[Name] leads ...", in Edit Staff Member.
- S3-R10 text "Turn Technician on for a role in Roles & Permissions ..." and the button opening Roles & Permissions (B6a, B6b). v17: "... for your technicians in Staff ..." and the button opens the staff list.
- Release day per role (Migration B grants roles; S6-R3 "Technician and Foreman templates on"). v17: per person (S6-R1), with no per-role default for existing staff.
- S4-R1 and S5-R1 "role has Technician on". v17: the person's own toggle.
- Changelog note "a role toggle does not move updated_at" (B4). v17 S6-R3: staff turned on by the release step ARE marked as updated (API-15).
- S5-E1 "Roles are not exposed". v17 S5-E1: a deactivated person whose toggle is on reads false.
- Evidence D19 counts a time row that carries both a department and a work order. v17 S6-R1 (a) says only "time on a department does not count"; there is no conflict for a row a tester can make, so no case or question.

## 5b. Round 3 — PRD v18, Chris's answers 1 to 8, design version 1793640819-ff4d (named set, 2 Nov 2026)

QA lead: "Named set (Recommended)". The set is 56 cases: the 50 in `po-answers-2026-11-02/named-50-from-codes.json` (every case tagged S1-R3, S1-R8, S3-R10, S3-N1 or Story 1 Error Handling, and the 17 held on questions 1 to 8), plus D-26, S1-25, S3-09, S3-10, S3-21 and S3-23, which quote a changed design caption. Nothing outside the set changes, not even version stamps.

- **Updated (54), each rewritten top to bottom (Rule 134):** API-08 C897287, API-09 C897288, API-10 C897289, API-11 C897290, API-12 C897291, D-26 C897367, D-27 C897368, D-29 C897370, INV-11 C897333, INV-12 C897334, INV-13 C897335, S1-06 C897153, S1-07 C897154, S1-08 C897155, S1-09 C897156, S1-10 C897157, S1-11 C897158, S1-14 C897161, S1-15 C897162, S1-16 C897163, S1-17 C897164, S1-18 C897165, S1-19 C897166, S1-20 C897167, S1-21 C897168, S1-22 C897169, S1-23 C897170, S1-25 C897172, S1-27 C897174, S1-28 C897175, S1-37 C897184, S3-01 C897223, S3-02 C897224, S3-03 C897225, S3-04 C897226, S3-07 C897229, S3-08 C897230, S3-09 C897231, S3-10 C897232, S3-11 C897233, S3-21 C897243, S3-23 C897245, S3-24 C897246, S3-25 C897247, S3-26 C897248, S3-29 C897251, S3-30 C897252, S3-31 C897253, S3-32 C897254, S3-33 C897255, S3-34 C897256, S3-35 C897257, S3-36 C897258, S3-48 C897269.
- **Parts changed per case (against its read-back):** API-08: expected; API-09: title, preconds, steps, expected; API-10: title, preconds, steps, expected; API-11: title, preconds, steps, expected; API-12: expected; D-26: expected; D-27: expected; D-29: expected; INV-11: expected; INV-12: expected; INV-13: expected; S1-06: expected; S1-07: expected; S1-08: expected; S1-09: expected; S1-10: expected; S1-11: expected; S1-14: expected; S1-15: expected; S1-16: expected; S1-17: expected; S1-18: expected; S1-19: expected; S1-20: expected; S1-21: expected; S1-22: expected; S1-23: expected; S1-25: expected; S1-27: expected; S1-28: expected; S1-37: title, steps, expected; S3-01: expected; S3-02: expected; S3-03: expected; S3-04: expected; S3-07: expected; S3-08: expected; S3-09: expected; S3-10: expected; S3-11: expected; S3-21: expected; S3-23: expected; S3-24: expected; S3-25: expected; S3-26: expected; S3-29: expected; S3-30: expected; S3-31: expected; S3-32: expected; S3-33: expected; S3-34: expected; S3-35: expected; S3-36: title, preconds, steps, expected; S3-48: title, preconds, steps, expected, refs. Every other part was re-checked against PRD v18, the answers and design version 1793640819-ff4d and CONFIRMED (`authoring/v18-named-set-record.json`).
- **What changed in them:** quotes re-copied from PRD v18 (From line "version 18 (2 Nov 2026, Chris Ward), read 2 Nov 2026"); a From line for Chris's answer (sheet link and question number) where a case relies on it; References from Design name design version 1793640819-ff4d and quote its new words, and the difference notes are replaced by the rulings. The 15 cases held on questions 1 to 8 are released (Rule 69 marker). Rewritten to the answers: API-09, API-10 and API-11 (accepted, value ignored: S5-N1 and answer 1); S1-37 (Save & Add Next starts fresh: answer 8); S3-36 (the filter's Unassigned choice: answer 3); S3-48 (a picked person who is turned off drops out of the filter and their work does not move: answer 4).
- **New (6):** S1-38, S1-39, S1-40, S1-41 (the two refusal messages, and the role message when both reasons apply, from an old staff window in a second browser tab: PRD v18 Story 1 Error Handling, answer 1); S3-49 (the filter's Deleted technician choice); S3-50 (people picked at another location are dropped on switching, so "No technicians yet" shows: answer 3). INV-13 already covers answer 2, and S1-37 covers answer 8, so no duplicates were added.
- **Deleted (2), for the coordinator with the QA lead's go-ahead:** D-33 C897374 and D-34 C897375, the held design-version cases (Chris ruled for the PRD on questions 5 and 6); listed in `po-answers-2026-11-02/DELETE.json`.
- **Register:** TT-D01, TT-D02, TT-D04 and TT-D06 are PO-RULED, each with its answer word for word (DESIGN-DIVERGENCE-REGISTER.json).
- **Named-set proof** (`authoring/verify_v18_named_set.py`): named set 54 (in TestRail 54) | changed parts: {'title': 6, 'custom_preconds': 5, 'custom_steps': 6, 'custom_expected': 54, 'refs': 1} | outside the set and mapped: 172 checked identical | new ['S1-38', 'S1-39', 'S1-40', 'S1-41', 'S3-49', 'S3-50'] | deleted ['D-33', 'D-34'] failures: 0. It failed on a planted title change outside the set, as it should.
- **Stories re-read (pm):** SV-11879 and SV-11881 changed to match v18 word for word (68 of 68 requirement lines and the Story 1 Error Handling line match v18). SV-11880 and SV-11884 show the same text and update time as in the morning sweep.

## 5a. Round 2 — design cases and References from Design (2 Nov 2026; the held statements here are superseded by 5b)

- **Design cases:** the 34 drafts of `design-2026-11-02/DESIGN-CASE-PLAN.md` are `authoring/cases_design.py` (generated by `make_cases_design.py`): DC-01 to DC-32 are D-01 to D-32, DV-01 is D-33 and DV-02 is D-34, in "Design — how it looks". Each carries its References from Design block (board and page, the pictures to attach, the design's own words, the difference with its register id). The draft marker READY is replaced by Rule 69's marker (no build yet; coordinator, round 2). D-27, D-29, D-33 and D-34 are held on PO questions 6, 7, 5 and 6.
- **Wording changes from the drafts (41), each needed by a gate, the pattern or a rule:**
  - DC-10: title: "looks as designed" -> "matches the picture" (vague look word, L-16)
  - DC-11: title: "looks as designed" -> "matches the picture" (vague look word, L-16)
  - DC-18: title: "looks as designed" -> "matches the picture" (vague look word, L-16)
  - DC-13: precondition example in brackets reworded (no examples in the preconditions)
  - DC-19: precondition example in brackets reworded (no examples in the preconditions)
  - DC-19: precondition example in brackets reworded (no examples in the preconditions)
  - DC-20: precondition example in brackets reworded (no examples in the preconditions)
  - DC-20: precondition example in brackets reworded (no examples in the preconditions)
  - DC-21: precondition example in brackets reworded (no examples in the preconditions)
  - DC-22: precondition example in brackets reworded (no examples in the preconditions)
  - DC-23: precondition example in brackets reworded (no examples in the preconditions)
  - DC-23: precondition example in brackets reworded (no examples in the preconditions)
  - DC-25: precondition example in brackets reworded (no examples in the preconditions)
  - DC-25: precondition example in brackets reworded (no examples in the preconditions)
  - DC-24: staff member C is made new for this test (its setup switches Technician off, Rule 137)
  - DC-26: staff member C is made new for this test (its setup switches Technician off, Rule 137)
  - DC-27: staff member C is made new for this test (its setup switches Technician off, Rule 137)
  - DC-31: staff member C is made new for this test (its setup switches Technician off, Rule 137)
  - DV-02: staff member C is made new for this test (its setup switches Technician off, Rule 137)
  - DC-15: staff member A is made new for this test (the case saves it, Rule 137)
  - DC-04: a record only read (or switched without saving) is 'any' (Rule 137 gate)
  - DC-04: a record only read (or switched without saving) is 'any' (Rule 137 gate)
  - DC-13: a record only read (or switched without saving) is 'any' (Rule 137 gate)
  - DC-14: a record only read (or switched without saving) is 'any' (Rule 137 gate)
  - DC-16: a record only read (or switched without saving) is 'any' (Rule 137 gate)
  - DC-24: the new work order is said to be made for this test (Rule 137 gate)
  - DC-26: the new work order is said to be made for this test (Rule 137 gate)
  - DC-27: the new work order is said to be made for this test (Rule 137 gate)
  - DC-31: the new work order is said to be made for this test (Rule 137 gate)
  - DV-02: the new work order is said to be made for this test (Rule 137 gate)
  - DC-06: quote S4-R1 joined PRD sentences that are not next to each other; split into 2 verbatim quotes (Rule 113)
  - DC-29: quote S3-R10 joined PRD sentences that are not next to each other; split into 2 verbatim quotes (Rule 113)
  - DC-24: the result 'Clicking staff member C's row does not pick it.' became step 3 with its own result (Rule 135)
  - DC-29: the result '...clicking it opens Settings, Staff.' became step 3 with its own result (Rule 135)
  - DC-27: note renumbered to the merged question sheet (question 6; design version D-34, held)
  - DC-29: note renumbered to the merged question sheet (register TT-D04, question 7)
  - DV-01: note renumbered to the merged question sheet (question 5 for Chris Ward)
  - DV-02: note renumbered to the merged question sheet (question 6 for Chris Ward)
  - DC-27: released (question 6 answered) and quotes Chris's answer 6
  - DC-29: released (question 7 answered) and quotes Chris's answer 7
  - DV-01, DV-02: deleted (D-33 C897374, D-34 C897375; Chris ruled for the PRD on questions 5 and 6)
- **References from Design on the PRD cases:** 117 of 205 PRD cases name the board and pictures that show their screen (`authoring/design_refs.py`, from DESIGN-FIGURES-2026-11-02.json and SPEC-TO-DESIGN-2026-11-02.json). The other 88 have no board for their screen or state and carry no References from Design heading: S1-34, S1-35, S1-36, S1-38, S1-39, S1-40, S1-41, S2-37, S2-38, S2-39, S2-40, S2-41, S3-16, S3-27, S3-28, S3-31, S3-32, S3-33, S3-34, S3-35, S3-36, S3-49, S3-50, S3-37, S3-38, S3-39, S3-40, S3-41, S3-42, S3-43, S3-46, S3-47, API-01, API-02, API-03, API-04, API-05, API-06, API-07, API-08, API-09, API-10, API-11, API-12, API-13, API-14, API-15, S6-01, S6-02, S6-03, S6-04, S6-05, S6-06, S6-07, S6-08, S6-09, S6-10, S6-11, S6-12, S6-13, S6-14, S6-15, S6-16, S6-17, S6-18, S6-19, S6-20, S6-21, S6-22, S6-23, S6-24, S6-25, S6-26, S6-27, S6-28, INV-03, INV-04, INV-05, INV-06, INV-08, INV-12, INV-13, INV-14, INV-15, INV-16, INV-17, INV-18, INV-19.
- **Differences named in the PRD-following cases (Rule 130), and the PRD cases now held:** TT-D01 in S1-16 (held, question 5); TT-D02 in S3-24, S3-25, S3-26 (held, question 6); TT-D04 in S3-29, S3-30 (held, question 7); TT-D06 in the new case S1-37, Save & Add Next (held, question 8). Settled differences are named where they touch a case (TT-D03, TT-D05, TT-D07, TT-D11 and the not-drawn rows).
- **Cases changed in round 2 (Rule 134, cases not yet in TestRail):** S1-14 lost its last step, Time Clock back on, and its S1-R3 and S1-R5 quotes, because that step depends on question 5; S1-16 still covers it, held. S1-16, S3-24, S3-25, S3-26, S3-29 and S3-30 changed only their AUTOMATION line (now held). S3-31's location precondition was rewritten (an earlier string edit had garbled it; found in the round 2 sample read). S1-37 is new. Every PRD case with a board gained a References from Design block. Title, preconditions, steps, results, quotes, From lines, refs and setup recipe were re-checked against PRD v17 and the design files by build.py and found unchanged for every other case.

## 6. Reading coverage (Rule 119: every source read in full)

| Source | Size | Lines read | Coverage |
|---|---|---|---|
| sources/CONFLUENCE-977371146-v17-2026-11-02.md | 44,045 bytes, 472 lines | 1-472 (whole file, including the Change Log, which is never quoted) | 100% |
| sources/JIRA-SV-11788-tickets-2026-11-02.md | 76,982 bytes, 727 lines | 1-728 (all 17 tickets) | 100% |
| sources/tech-plan-Technician-Toggle-2026-11-02.md | 84,614 bytes, 908 lines | 1-907 (whole plan) | 100% |
| sources/jira-sweep-2026-11-02.json | 77,826 bytes (one JSON line) | parsed by script for keys, types and updated times; its ticket text is the same text as the .md above, which was read in full | 100% of fields used |
| design-2026-11-02/files/project/*.dc.html (6 boards) | 6 boards | every caption (round 1, for labels); every quoted design word is checked against the package by build.py | 100% of captions |
| design-2026-11-02/DESIGN-CASE-PLAN.md | 85,722 bytes | 1-1395 (all 34 drafts) | 100% of what the cases use |
| design-2026-11-02/NEW-QUESTIONS.py | 8,634 bytes | whole file | 100% of what the cases use |
| design-2026-11-02/NOTES.md | 4,991 bytes | whole file | 100% of what the cases use |
| design-2026-11-02/DESIGN-CASE-CHECKLIST-2026-11-02.md | 8,467 bytes | whole file | 100% of what the cases use |
| design-2026-11-02/DESIGN-FIGURES-2026-11-02.json | 23,187 bytes | every figure (page, badge, heading, image, captions) by script | 100% of what the cases use |
| design-2026-11-02/SPEC-TO-DESIGN-2026-11-02.json | 24,706 bytes | every row (code, verdict, pictures, note) by script | 100% of what the cases use |
| DESIGN-DIVERGENCE-REGISTER.json | 25,608 bytes | every difference and not-shown row id and outcome by script | 100% of what the cases use |
| design-2026-11-02/DESIGN-TEXT-INVENTORY.*, DESIGN-VISUAL-INVENTORY.md, DESIGN-READING-RECORD.md, images/ | the design worker's proof files | not re-read: they are the design drive's own coverage proof, which the plan and checklist summarise; the 25 pictures are referenced by name, and every name is checked to exist | NOT read in full (stated, Rule 119) |

Rules and skills read before writing: LESSONS-REGISTER.md (L-01 to L-19), Rule 4, Rules 96, 113, 114, 116, 117 (fourteenth and fifteenth amendments in full), 122, 129, 130, 132, 134 to 138, Rule 69, IDEAL-TEST-CASE-STANDARD (superseded parts noted), skill 17 (Rule 96 text), skill 07 §2 to §6.

## 7. Gates

- `python3 build/technician-toggle/authoring/build.py`: 0 PROBLEM lines. Each gate was proved to fail on a planted fault (a semicolon title, steps not equal to results, two actions in one step, a placeholder, a For example line, a case id, an unused precondition record, a record not made for the test, a quote not in the PRD).
- `python3 build/testing-tools/tester_readiness_check.py build/technician-toggle --sample 5`: 0 hard problems. Two random samples of five cases were read in full, and so was every "does not / never" result (76). Fixes made from that reading: S3-40's filter change ('Assigned to me' hides every column, so it proved nothing; it is now a Technician filter change); S3-05's staff member B reason; location C's switch moved last; a visible technician control added to S3-37 to S3-42 and S6-24; S1-34's Settings-menu result made conditional on the menu showing.
- Round 2 readiness check: cases 237 | hard problems 0 | 'does not / never' results to read for a control 102. The round 2 sample (5 cases, seed 21) and every new "does not / never" line from the design cases, S1-14 and S1-37 (22 lines) were read in full; each has a visible control (the neighbouring names, the message shown, the unchanged buttons, the layout compared with a named picture). One fault found and fixed: S3-31's garbled location precondition.
- `python3 build/testing-tools/ticket_sweep.py` (pm sweep, `--prd-version 18`): 0 unhandled tickets, PRD v18 handled.

## 8. OUTSTANDING — what I need from you

- The coordinator: review, create the subsections in 113017 (`sections.json`), run `create.py --apply` with the QA lead's go-ahead, then read back the cases and commit.
- Round 3 (coordinator, with the QA lead's go-ahead): `update_changed.py --apply` (54 named-set cases; 15 released cases join run 555, union only), `create.py --apply` (6 new cases, then add them to run 555), delete D-33 and D-34 (DELETE.json).
- Facts to confirm on the build (not PO questions): how the screen sets a line's own technician; which Public API requests change a staff member's role or a work order's lead (API-12, API-13).
- **Waiting on the PO:** nothing: Chris answered questions 1 to 8 on 2 Nov 2026 (sheet https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M) and no case is held on the PO.
