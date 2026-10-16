# Run 498 full staging re-run — what the map could not simply run, and why (16 Oct 2026)

Prepared, **not run** (no staging sign-in was used; nothing posted to TestRail; no Jira; no case edited).
Companion files: `full-map-1016.json` (script -> tests, every test exactly once), `full-order-1016.txt` (one step per line),
`run-full-1016.sh` (the one command), `full-changed-1016.md` (tests whose case text changed after their latest result).
Run [498](https://shopview.testrail.io/index.php?/runs/view/498) held **278 tests** when read live (paged `get_tests/498`) on 16 Oct 2026.

## 1. Placement summary

| | Tests | Where |
|---|---|---|
| Placed and run by the main command | 253 | blocks A (Analyst 1), C, D, G of `run-full-1016.sh` |
| Placed, but **TODO** — case changed after its latest result and the script must change first | 15 | block E, runs only with `RUN_TODO=1` (see `full-changed-1016.md`) |
| Placed, but **TODO** — the two-person route no longer works (C97012) | 1 | block E |
| Placed, **two-day analytics** (C97026, C97033, C97034) | 3 | block E, `RUN_GA=day1`, then `RUN_GA=day2` the next Pakistan-time day |
| **New cases**, draft scripts not yet run (C614711, C614714, C614715, C614716, C614717, C614719) | 6 | block F, runs only with `RUN_DRAFTS=1` |
| **Unplaced** (no script at all) | **0** | — |

How each test's script was chosen: the script that produced its **latest posted staging result** — the last run of a script
that included the test (every `run.out` of passes 2-10 and every `queue.out` of 16 Oct) before that result's `created_on`; tests whose
latest staging result came from the first staging pass (14 Oct, no `run.out`) keep the 9 Oct map script (`rerun-map.json`), which is
what that pass ran. Overrides, each from the result's own comment: C590131 -> `C590131-orgb.mts` and C368191 -> `C368191-orgb-steps.mts`
(both judged in Analyst 1's company, batch 40/40b); C368156 -> `C368156-pins-loc-stg.mts`; C368179 -> `C368179-drop-exact.mts`;
C96962 -> `C96962-line-audit-stg.mts`; C97012 -> `C97012-two-people.mts`; C581895 -> `c581895-v2.mts` (+ read-only companion
`c581895-staff-carol.mts`); C154650, C368175 -> `orgb-fix3.mts` (+ companion `c368175-api.mts` for C368175 step 4);
C368208 -> `high2-batch.mts` (the staging half; `viewonly-pin-prod.mts` was its production comparison, not re-run here);
C581892, C581896 -> `stg-new5.mts` (14 Oct; `stg-fix-new3.mts` has no block for them). No probe-only script was chosen.
Extra settings per script are the ones the staging passes used (`WOB_PIN_NAMES`, `WOB_SCALE=2`, `QA_DPR=2`, `WOB_LIVE=1`), plus
`WOB_LOC_SELECT=1 WOB_EMPTY_LOC="ZZAUTOTEST F2 Empty Shop"` for the whole queue, as `run-second.sh` … `run-tenth.sh` did.

## 2. One Google sign-in for Admin and Analyst 1 (coordinator, 16 Oct ~18:35 UTC)

The QA lead's new Analyst 1 cookies (`/tmp/qa-cookies/staging-analyst1.json`) carry the **same** `sv_sso_session` as the Admin's
(`/tmp/qa-cookies/staging-sso.txt`). One Google sign-in = one app session, so an Admin quick-login ends the Analyst 1 session and the
reverse (proved: Analyst 1 answered 200, the Admin PHPSESSID then 401). Therefore:

- **Block A runs first and alone:** `analyst-ready.mts` (new, read only: proves the Analyst 1 session, signs in through the app's own
  Email/Password form only if the session is gone — `analyst.mts`, L0405, credentials in `/tmp/shopview/staging-analyst1.env` — and saves
  the new PHPSESSID back), then `stg-orgb-seed.mts`, `stg-orgb-lead.mts` (company B data for C154650/C368175; `orgb-seed-stg.json` is
  backed up and put back if the seed could not sign in), `C590131-orgb.mts`, `C368191-orgb-steps.mts`. **No `ensure-heavy.mts` before
  them** — it is an Admin quick-login and would end the Analyst 1 session. If `analyst-ready.mts` fails, block A is skipped and logged.
- **Admin scripts follow** (each after `ensure-heavy.mts`). Nothing after block A needs Analyst 1, so no re-sign-in is needed.
- **C97012 cannot use its 16 Oct route.** `C97012-two-people.mts` put the second person (Tech ShopView, Dev Mode "Tech" quick-login) in a
  browser holding only Analyst 1's Google cookies — a separate Google sign-in then. With the sign-ins now shared, that quick-login would end
  the Admin's session mid-test. A route that works with ONE Google sign-in has to be proved before C97012 runs: give the second person
  (e.g. a ZZAUTOTEST dispatcher with a password) their own app session through the app's Email/Password form (POST /api/login) in a
  browser holding no `sv_sso_session`, and prove first that it does not end the Admin session (Admin `fe-permissions` still 200 after).
  L0405 also warns that a "switch user" stand-in is NOT enough for this case (a drop was accepted after the role lost Create & Edit).
  Until then C97012 stays in block E (TODO). Its latest result (Passed, batch 40) stands.

## 3. Tests run with a caveat

| Test | Caveat |
|---|---|
| [C368177](https://shopview.testrail.io/index.php?/cases/view/368177) | Latest staging result (Passed, 16 Oct, build v26.40.19-edc8195, "fresh work orders") came from a script not in this repo (another session). Mapped to `high1-fix5.mts`, the newest script here that judged it (15 Oct). |
| [C368208](https://shopview.testrail.io/index.php?/cases/view/368208) | Staging half only (`high2-batch.mts`); the Rule 121 production comparison (`viewonly-pin-prod.mts`) is not part of a staging run. |
| [C96920](https://shopview.testrail.io/index.php?/cases/view/96920), [C96973](https://shopview.testrail.io/index.php?/cases/view/96973), [C97003](https://shopview.testrail.io/index.php?/cases/view/97003) | No staging result yet (latest result is from the QA branch, 8-10 Oct). C96920 and C97003 are mapped to their 9 Oct scripts; C96973 is in block E (its Expected changed). |
| [C581915](https://shopview.testrail.io/index.php?/cases/view/581915)–[C581918](https://shopview.testrail.io/index.php?/cases/view/581918), [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) | Staging has no Technician filter (SV-11326): expect Blocked again unless it has shipped. |
| [C590120](https://shopview.testrail.io/index.php?/cases/view/590120) | Blocked on SV-11405 (In Progress on 16 Oct); in block E anyway (its case changed). Read the story status live first (Rule 112). |
| [C368191](https://shopview.testrail.io/index.php?/cases/view/368191) | Judged in Analyst 1's company; it drops a shift at 9 AM on that company's Schedule. That location's time zone was not proved equal to the browser zone (Rule 125 was proved for Heavy Duty only). Check it before trusting a time reading. |

## 4. The six new cases (added by the build-verification session; read live 16 Oct 2026)

| Case | Title | What it needs | Closest existing script / helper | Draft |
|---|---|---|---|---|
| [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) | Work orders of a deleted lead sit under Deleted technician, which takes no drops | A technician made for this case with NO labor (only such a person can be deleted), a second technician, a customer with WO-1 led by the first and WO-2 unassigned; Settings > Staff > pencil > Delete; Board View header of WO-1's column ("Deleted technician", inactive marker, no grip); drop refused; Tech View group; List Lead Technician blank; WO-1 dragged to Technician-B accepted. Known problem SV-11416 (EXPECT FAIL, three outcomes). | `C368191-routes.mts` (staff delete: DELETE /api/staff/{id}, only a person without labor deletes), `wob.mts` drag/allBoardCols/groups, `staff.mts` person/ensureEligible | `C614711-stg.mts` |
| [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) | A lead whose Time Clock is turned off keeps a named column that takes no drops | A fresh technician (Time Clock on) leading WO-1, WO-2 unassigned; Settings > Staff > pencil > Time Clock off > Save & Close; column still named and holding only WO-1; drop of WO-2 refused; Tech View group; WO-1's page Lead Technician -> Unassigned; then no column/group for that person. Positive control: the same drop onto Esther Howard is accepted (then undone). | `staff.mts` person() (the /api/staff/{id}/change body), `wob.mts` pickLeadOnPage/woPageLead, `notech-stg4.mts` (never edit the signed-in admin's own Time Clock) | `C614714-stg.mts` |
| [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) | With no work orders at all, Tech View and Board View show No work orders yet | A location with NO work orders at all. "ZZAUTOTEST F2 Empty Shop" is no longer empty (C368130's data is made there), so the draft makes "ZZAUTOTEST C614715 Empty Location" (New Location recipe) and proves zero work orders there before judging; Tech View / Board View first-run state; its Create Work Order opens the same window as the page button; List unchanged. Always switches back to Heavy Duty. | `stg-setup.mts` / `notech-stg4.mts` (New Location), `wob.mts` switchLocUI | `C614715-stg.mts` |
| [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) | Density and Columns tooltips open above their button and hide while open | Window 1440 px; one Approved work order (ZZAUTOTEST N3 Tooltips / N3 Tia); hover density, Column Selection and the Tech View switcher button: tooltip above, not covering the header row; no tooltip while each menu is open. Positive control: at least one hover shows a tooltip. | `design-stg5.mts` (tips/boxes, C590111 tooltips), `C614717-stg.mts` hover pattern | `C614716-stg.mts` |
| [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) | Row and card name bubbles open above the avatar, headers keep the plain tip | Six technicians (N4 Ana..Fay), one Approved work order led by Ana with five approved lines whose technicians are Ben..Fay (avatars end in "+N"), Board "Line technicians" field on; hovers on row/card avatars and "+N" (bubble above) and on group/column header avatars (plain browser tip = title attribute). | `C368191-routes.mts` / `ga-week.mts` (canned lines, PUT line technicians), `design-stg5.mts` C590114/C590124 (avatar hovers), `analytics-batch.mts` (Board fields menu) | `C614717-stg.mts` |
| [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) | First Tab skips a collapsed or empty Unassigned to the first technician | Two technicians (C614719 Ana, Ben) pinned in that order, Keyboard A (WO-1 Ana, WO-2 Ben) and Keyboard B (WO-3 unassigned), no saved collapsed groups, fresh page; collapse Unassigned; Search > Tab lands on WO-1's row (no header); Board View with only Customer-A: Tab lands on WO-1's card. | `kbd-fix4.mts` (Tab/arrow focus walk, focus ring), `C590131-orgb.mts` (clearing saved collapsed groups) | `C614719-stg.mts` |

Each draft is headed "DRAFT — not yet run", makes its own ZZAUTOTEST data (Rule 107), photographs every step, writes
`EV/<script>.json`, and carries its positive control (Rule 104). They parse (`esbuild`) but have never run, so selectors marked as
guesses (staff-row pencil, Delete button, Line technicians toggle, Unassigned collapse toggle) may need the first-run fix. Per Rule 115
each new case also needs a `spec.ts` once its check has been run by hand.

## 5. Risky steps (change something shared on staging)

| Script(s) | What it changes |
|---|---|
| `stg6-tz.mts` (block B) | Sets "Staging Heavy Duty - 9919" to Asia/Karachi and moves the signed-in user onto that zone (Rule 125). The queue STOPS if the zone cannot be proved. |
| `role-viewonly-stg4.mts`, `s9-fix7.mts`, `kbd-fix4.mts`, `c368149-two.mts`, `s9-batchB.mts`, `s5-batchB.mts`, `analytics-batch.mts`, `high2-batch.mts`, `ga-week.mts`, `C97012-two-people.mts` | Change roles/permissions (view-only role, test users' roles). `s9-fix7.mts` switches Create & Edit ON in "ZZAUTOTEST WO View Only" — `role-viewonly-stg4.mts` runs right after it. Rule 118: Reset To Template before any check that needs a role's DEFAULT permissions. |
| `s1-batch4a`, `s2-batchB`, `s2-batchC`, `s3-batchA`, `s3-batchB`, `s4-batchD/E/G/H`, `s5-batchA`, `s5-batchA3`, `s5-batchC`, `s6-batch`, `s6b-batch`, `s11-fix3`, `ui-fallback`, `ps-counts`, `high2-batch`, `design-stg5`, `notech-stg4`, `orgb-fix3`, `C368156-pins-loc-stg` (block D) | Switch the signed-in account's location (Lethbridge, Empty Shop, No Tech Shop) and back. Each later script starts with `ensure-heavy.mts` and is skipped if the account is not back at Heavy Duty (L0399). |
| Every script using `WOB_PIN_NAMES` / pins (`s1-batch3/4b`, `s2-batchA/B/C`, `s3-batchA`, `s4-batchA/E`, `moved-stg4`, `kbd-fix4`, `C368156-pins-loc-stg`, drafts C614717/C614719) | Rewrite the Admin's saved Work Orders pins (the drafts put the saved choices back). |
| `sort-fix5.mts`, `high1-batch.mts` | Have left technicians' clocks running before (L0342); `clocks-stg4.mts` runs right after them. `high1-batch.mts` once hung on its production half (pass 7) — the 3600 s timeout ends it. |
| `C614711-stg.mts` (draft) | Deletes a staff record it made itself. `C614714-stg.mts` turns off the Time Clock of a person it made itself. `C614715-stg.mts` may create a location. |
| `ga-week.mts` | Sends real events to Google Analytics; two consecutive Pakistan-time days. |
| `signout-fix.mts` | Signs the shared staging session out — always the very last step. |
