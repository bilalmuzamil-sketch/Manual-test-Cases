# KNOWLEDGE MAP — "I am about to … — has this been done before, and where is it written?"

**Rule 127 (QA lead, 2026-10-13).** Before starting ANY new suite, task, probe or fix: **(1) run
`python3 build/testing-tools/recall.py "<feature or problem words>"`** and **(2) look up the task below.**
Reuse what is found; never rediscover it. When something NEW is learned, write it into the file this map
names for that kind of thing **in the same pass**, then add or extend a row here if no row would lead to it.

How the stores divide (each fact lives in ONE place; this map and `recall.py` find it):
- **`build/LEARNINGS-LOG.md`** — every dated lesson; the last 14 days in full, older entries moved byte-verified to `build/kb/LEARNINGS-LOG/` (titles in its `INDEX.md`). New entries go at the BOTTOM as `## L0nnn — date — title`.
- **`build/APP-ACTIONS-PLAYBOOK.md`** — HOW to do things on ShopView / TestRail / Jira. Now a small index of every section heading → its part in `build/kb/APP-ACTIONS-PLAYBOOK/`. Add a new recipe to the index file; the size check splits it again when needed.
- **`build/rules/RULES-*.md`** — what we MUST / MUST NOT do. **`build/skills/*.md`** — the procedure per kind of job.
- **`build/<project>/PROJECT-STATE.md`** — per suite: sources, people, environments, runs, data, scripts, open items.
- **`build/testing-tools/`** — shared tools (each starts with a comment saying what it does). Per-run scripts live in `build/<project>/run*/`.

---

## Starting something

| I am about to … | Look here first |
|---|---|
| start a NEW suite / feature | `build/skills/15-NEW-PROJECT-INTAKE.md`; then `recall.py "<feature words>"`; then the "Suites done" table below for the nearest match and its `PROJECT-STATE.md` |
| run an existing suite on a new build or a new environment | that suite's `PROJECT-STATE.md` → its `run*/STAGING-READY.md` / `RESUME-HERE.md`; WO Board: `build/wo-board-tech-view/run498-2026-10-08/staging-all.sh` + `wob-run.sh` |
| decide the scope of a task | Rule 110 in `build/rules/RULES-61-ONWARD.md` (ask: replacement or general scope) |
| save what I just learned (always, unasked — Rule 127) | the store this map names for that kind of thing; the Stop hook `build/testing-tools/learning_gate.py` checks it (`--status`, `--ack "<why>"`); hooks live in `.claude/settings.json` |
| write a status / report for the QA lead | Rules 98, 99, 103; `python3 build/testing-tools/plain_check.py <draft>` before sending |

## Getting in

| I am about to … | Look here first |
|---|---|
| sign in to a QA branch | `node build/testing-tools/qa-branch-boot.mjs <branch> <route> admin`; playbook §A; WO Board harness `run498-2026-10-08/session.mts` (one sign-in reused) |
| sign in to staging | `build/wo-board-tech-view/run498-2026-10-08/STAGING-READY.md` (THREE cookies: SV_SSO_SESSION, PHPSESSID, CF_CLEARANCE in `/tmp/shopview/app.env`); `build/BLOCKED-shopview-app-session.md`; L0064 |
| sign in to production | playbook §K; `build/ENVIRONMENT-CREDENTIALS.md`; `build/testing-tools/prod-boot.mjs`, `prod-login-boot.mjs` |
| reach TestRail / Jira / Confluence | `build/skills/14-ACCESS-RESILIENCE.md`; `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`; `/tmp/testrail/creds.json` keys are `email`, `password`, `host`; `build/testing-tools/tr_client.py` |
| the browser cannot connect (ERR_PROXY_CONNECTION_FAILED) | `bash build/testing-tools/ensure_bridge.sh` before EVERY normal-browser script, the TestRail page scan included |
| the QA branch went to sleep / is down | L0307 (watch the real thing); L0317 (network error → sleep page); `build/testing-tools/wake_branch.mjs`, `wait_branch_up.sh` |
| read a file that is too big to read whole (Rule 128) | `recall.py "<words>" --show 3` (the blocks themselves) · `recall.py --rule N` (a rule + all its amendments) · `recall.py --section "<heading>" --file <path>` · `python3 build/testing-tools/knowledge_health.py` (sizes vs budgets) · `knowledge_health.py shard <file>` / `verify` / `logical` |
| change a shared tool, hook, rule, skill, store or a suite's runner (Rule 129) | first `git grep` what depends on it; `python3 build/testing-tools/selftest_workspace.py` before and after (`--compare <ref>` for regressions); break it on a throwaway worktree to prove the guard; add a self-test check for anything newly load-bearing |
| store a secret | `/tmp` only, chmod 600; `python3 build/testing-tools/scan_secrets.py --staged` before every commit (Rule 82) |

## Making the data a test needs

| I am about to … | Look here first |
|---|---|
| create technicians, customers, assets, Approved work orders, leads | the plain-English blocks in `build/wo-board-tech-view/run498-2026-10-08/ruling-rewrites-2026-10-12/preconds-trim/build_preconds.py` (TECHS, CUST, WOS, COMPLETE); by script: `run498-2026-10-08/staff.mts`, `data.mts`, `case-seed.mts`, `e84-seed.mts` |
| bring a work order to Review / Complete / Invoiced / Paid | `COMPLETE` block in `build_preconds.py`; `run498-2026-10-08/s4-batchG.mts` (real Invoiced and Paid) |
| put shifts on the Schedule | `run498-2026-10-08/shifts.mts`; Rule 125 + `qa-set-tz.mjs` / `tz-match-check.mjs` first |
| a technician cannot clock in ("already clocked into different line") | L0316 (`FRESH_CLOCK=1`); `run498-2026-10-08/clockout.mts` |
| need a second organisation | `run498-2026-10-08/orgb-*.mts`; playbook "§X — CREATING A SECOND ORGANISATION ON A QA BRANCH" (there are two §X sections) |
| see the screen as another person | `run498-2026-10-08/viewas.mts` (switch-user); impersonation: `imp-batch.mts` |
| prove a role is default / change permissions | Rule 118 (Reset To Template, Save is the tell); `run498-2026-10-08/role-restore.mts`; `build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` |

## Testing particular kinds of behaviour

| I am about to test … | Look here first |
|---|---|
| a drag-and-drop board (cards, columns, reassign, reorder) | `run498-2026-10-08/s3-batch*.mts`, `s4-batch*.mts`, `s9-batch*.mts`, `wob.mts` (shared page actions) |
| a lead-technician change and its history | L0304 (the work order's log, not the line's); `c96962-rerun.mts`; C96962 is the model test (L0305) |
| keyboard focus / tab order | `run498-2026-10-08/kbd-batch.mts`, `probe-kbd.mts` (roving focus: one tabindex per board) |
| an offline / failed-save alert | L0317 (QA branch → sleep page; judge offline on staging); `s4-batchD.mts` (refused request instead) |
| anything with times or time zones | Rule 125; L0312 (the harness shows UTC), L0313; `tz-match-check.mjs`; a two-day test: "different day" must hold in the zone the report uses (PKT midnight ≠ UTC midnight) |
| Google Analytics events / reports | L0314; playbook "GOOGLE ANALYTICS CHECKS WITHOUT GOOGLE ANALYTICS"; `ga-week.mts` + `ga_calc.py`; by hand: `ruling-rewrites-2026-10-12/HOWTO.html` (F12 → Network → filter `collect`) |
| report filters (Sales By Customer, Parts Velocity, Inventory Value) | `run498-2026-10-08/medium-batch.mts`, `prod-filters.mjs` (same clicks on production) |
| Parts pages keeping a filter (Purchase Orders, Vendors, Vendor Invoices) | `parts-filter2.mts`; the filter is the Search box at the right of the page header |
| whether something is a regression | Rule 121 (same on production ⇒ not a regression); `build/PROD-VS-STAGING-COMPARE-METHOD.md`; `run498-2026-10-08/prod-*.mjs` |
| sign-out / session changes in another tab | L0311 (pause and read the stack); `freeze-diag*.mts` |

## Recording results and changing test cases

| I am about to … | Look here first |
|---|---|
| write results into a TestRail run | `python3 build/testing-tools/push_results_to_run.py` (playbook §W); Rules 113, 122, 123, 124 |
| attach annotated screenshots | `build/testing-tools/annotate_v2.py SRC OUT --scale 2 --mark "x,y,w,h:good|bad:text"` (coordinates in 2x pixels); Rule 116; `size_pics.py` for Jira |
| edit ONE TestRail case safely | `python3 build/testing-tools/safe_case_edit.py <id> <fields.json>` then `served_page_scan.mjs` (make `<OUT>/evidence/` first; needs `ensure_bridge.sh`); playbook §J |
| rewrite a test that passed on a ruling | Rule 114(d) as amended 2026-10-13 (the QA lead's ruling = one dated line, never our chat; anyone else's = word for word); worked set `build/wo-board-tech-view/run498-2026-10-08/ruling-rewrites-2026-10-12/` |
| shorten / fix preconditions without losing anything | `preconds-trim/build_preconds.py` (shared blocks); skill 18; L0305 |
| tell the automation engineer what changed | Rules 65/71; `ruling-rewrites-2026-10-12/FOR-ENGINEER.md`; check the automation flag LIVE first — Vladimir changes it (`automated_edit_scan.py` reads every case's history) |
| delete test cases | snapshot first: `run498-2026-10-08/case-deletes-2026-10-12/` |
| find what the QA lead or the PO answered earlier | `python3 build/testing-tools/find_ruling.py "<words of the question>"` (searches this session's transcript); the run comments; `RESUME-HERE.md` |

## Tickets and questions

| I am about to … | Look here first |
|---|---|
| prepare or file a Jira ticket | `build/skills/06-DEFECT-PREP.md`; Rules 62, 110, 112, 113, 116, 120; label `board-tech-view` for WO Board; `jira.sh` takes a body FILE; Product Area `customfield_10153` |
| ask a developer for access or help | Rule 107 amendment 2026-10-12: first test what the PRODUCT owns on the QA branch; an ask is the last step (L0314) |
| send the PO questions | `build/testing-tools/make_question_sheet.py`; skill 07; a Google Sheet editable by @shopview.com |
| decide whether something is really blocked | Rules 97, 104, 107; `python3 build/testing-tools/blocker_gate.py --check <claim>`; `ls build/BLOCKED-*.md` |

---

## Suites done — find the nearest one and reuse its work

| Suite | Where | What it is good for next time |
|---|---|---|
| **WO Board & Tech View** (epic SV-10043, run 498, Oct 2026) | `build/wo-board-tech-view/PROJECT-STATE.md` | drag-and-drop boards, lead technicians, Schedule shifts, display/field/density preferences, analytics events, keyboard focus, regression across List/Parts/Reports, staging-ready one-command runs |
| Global Search V2 | `build/global-search/PROJECT-STATE.md` | Playwright e2e specs (`build/global-search/e2e`, the sign-in fixture other harnesses reuse), search ranking, staging seeding |
| Inline Add and Edit Parts | `build/inline-add-edit-parts/PROJECT-STATE.md` | parts on work orders, TestRail render repair (`render-repair-2026-08-31/`), served-page scan tool |
| Report Suite | `build/report-suite/PROJECT-STATE.md` | report pages and their filters |
| Schedule | `build/schedule/PROJECT-STATE.md` | Schedule screens and shifts |
| Filters | `build/filters/PROJECT-STATE.md` | list filters |
| Custom Roles & Permissions | `build/custom-roles/PROJECT-STATE.md` | permission checks after every release |
| Fees & Discounts | `build/fees-discounts/PROJECT-STATE.md` | pricing |
| Simple Flow / Simple Flow V2 | `build/simple-flow/`, `build/simple-flow-v2/PROJECT-STATE.md` | V2/upgrade method (skill 17) |
| Invoice UI Refresh · Invoice Design Selection · Printer Friendly WO · Digital Inspections V2 | `build/invoice-ui-refresh/`, `build/invoice-design-selection/`, `build/printer-friendly-wo/`, `build/digital-inspections-v2/` (each `PROJECT-STATE.md`) | invoices, printing, inspections |
