# LEARNINGS LOG — the continuous, retrievable ledger of everything we learn

> **PURPOSE.** One durable, append-only place where **every** learning is written the moment it happens,
> so any future session can retrieve **all** learnings in one read or one grep. This complements — does
> not replace — the rules (`build/rules/RULES-*.md`), the skills (`build/skills/`), the playbook
> (`build/APP-ACTIONS-PLAYBOOK.md`) and each `PROJECT-STATE.md`. A learning that hardens into a standing
> rule/skill is graduated there (Rule 72 records, Rule 93 proposes); this log keeps the **raw, dated,
> always-growing** record regardless.

## 🔁 THE CONTINUOUS PROCESS — how this stays current (do this every session)

1. **The moment you learn something durable** — a trap, a fix, a fact about the app/TestRail/access, a
   corrected mistake, a rule the QA lead states — **append an entry here in the SAME pass** (Rule 93/97:
   "solve something new ⇒ write it into the playbook/skill in the same pass" — this log is the front door).
2. **Never delete or rewrite an old entry.** If a learning is superseded, add a NEW entry that says so and
   link the old id (e.g. "supersedes L0007"). History is evidence.
3. **If the learning is important enough to be a standing behaviour**, ALSO graduate it: propose the
   rule/skill change (Rule 72) and record it in the right `RULES-*.md` / skill / playbook — then note the
   destination in the entry's **Graduated-to** field. This log is the index that points at where it lives.
4. **Commit this file with the work** (Rule 29). It is durable memory; `/tmp` and context are not.

## 🔎 HOW TO RETRIEVE — get ALL learnings, or just the ones you need

- **FIRST: `python3 build/testing-tools/recall.py "<words>"` (Rule 127, 2026-10-13).** Older entries live in `build/kb/LEARNINGS-LOG/`
  (Rule 128, split byte-verified 2026-10-13); the tool searches it (and the playbook, skills, rules, project files and tools) and prints
  `file:line` for the best matches. Since L0040 or so, entries are appended at the BOTTOM as `## L0nnn — date — title`;
  `grep -n "^## L0" build/LEARNINGS-LOG.md | tail` lists the newest.
- **By topic:** `git grep -n "#access" build/LEARNINGS-LOG.md build/kb/LEARNINGS-LOG/` — every entry carries `#tags`.
- **Common tags:** `#access` `#testrail` `#shopview-app` `#roles-permissions` `#build-verify`
  `#source-verify` `#cookies` `#deadlock` `#methodology` `#rule` `#mistake-corrected`.
- **From a cold start:** CLAUDE.md §4 (Skills index) and §5 point here; skill `00-COMMON-CORE.md` names it
  as a first-read. Search order when stuck (Rule 97): this log → the playbook → the skill → `RULES-*.md`.

---

## ENTRIES — newest first (id · date · tags · lesson → pointer)


> **Older entries moved (byte-verified) — 2026-10-13:** `build/kb/LEARNINGS-LOG/001-L0036-L0080.md`, `build/kb/LEARNINGS-LOG/002-L0081-L0164.md`, `build/kb/LEARNINGS-LOG/003-L0165-L0277.md`, `build/kb/LEARNINGS-LOG/004-L0278-L0300.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-17:** `build/kb/LEARNINGS-LOG/005-L0301-L0365.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-20:** `build/kb/LEARNINGS-LOG/006-L0366-L0420.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.


> **Older entries moved (byte-verified) — 2026-10-22:** `build/kb/LEARNINGS-LOG/007-L0421-L0484.md`. Titles: `build/kb/LEARNINGS-LOG/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.

## L0485 — 2026-10-20 — Three more set-up traps from the last run-498 batch (all were MY set-up, not the product)
- Board View "Fields to display" keys (work-orders-list preference): `technician` = **Lead technician**, `lineTechnicians` = **Line technicians** (avatars on the card), plus `clockedInTechnicians`, `serviceAdvisor`, `vin`, `timeEstimate`, `vehicleHere`, `startDate`, `companyName`, `vehicle`, `progress`, `linesCount`, `totalPrice`. Read from the app's `WorkOrders.*.js` labels map. C682438 needed `lineTechnicians: true`.
- A line created AFTER the lead was set only FOLLOWS the lead (API `assigned_techs` empty) even though the screen and Edit Line show the lead; a moved time entry then takes that line's row by design (SV-11087 scenario 5), so the lead "disappears" — a FALSE fault. Re-set the lead (none → lead) after making the lines so the lead is on every line (C682446, C368171). Check the API `assigned_techs` per line before judging anything about labor rows.
- Timesheets list (⋮ > Timesheets) has empty rows around the entries: click the row filtered by the person's name, never `tbody tr:last`.
- A tester-like on-screen set-up beats an API one when the API answer is ambiguous: C368173's start state ("Line-1's technician is Dee") was built in Edit Line (remove lead → confirm "Remove technician?" → add Dee → Save & Close).
#run498 #tooling #setup → L0484

## L0486 — 2026-10-20 — Prefixing case titles on the QA lead's order: title-only update_case, read back, audit file
- QA lead: "Please prefix all the test cases which are under RETEST with SV-11326 - {{Title}}". Run 498 had 5 Retest tests (C581915–C581918, C97022), all ours (created_by 3), none Automated. `update_case/<id> {title}` only (no other field sent, so the escaping-container trap of preconds/steps/expected is not touched), read back, audit in `wo-board-tech-view/run498-2026-10-08/title-prefix-1020/audit.json`. Skip a title that already starts with the prefix; never Vladimir's (created_by 1).
- Two titles went past the ~80-character guide (82 and 83) — reported, not shortened (his exact wording was asked for).
#run498 #testrail #titles

## L0487 — 2026-10-20 — "Prefix every Failed case with its ticket": where the ticket comes from, and Automated cases are held
- QA lead: Failed tests in run 498 get "SV-<ticket> - <title>". The ticket is the one in each Failed test's LATEST results (the "Follow the status here" comment; else any SV key in the newest Failed result) — read live with `get_results/<test>`. All 17 named exactly one ticket.
- `custom_atmstatus` values: 1 Not Automated · 2 Cannot be automated · **3 Automated** · 4 Pending. Three Failed cases are 3 (C96967, C368147, C682421) → held and asked (Rule 71; tell Vlad if changed, Rule 65). The other 14 were prefixed, read back; audit `title-prefix-1020/audit-failed.json`.
#run498 #testrail #titles → L0486

## L0488 — 2026-10-20 — Rule 133 recorded and automated: ticket prefix on Failed/Retest/Blocked case titles
- QA lead made the prefix a standing rule ("When there is no ticket no need to prefix"), and said **Yes** to the three Automated cases (C96967, C368147, C682421 — prefixed, read back; Vlad must be told, Rule 65; note handed to the QA lead).
- `build/testing-tools/prefix_ticket_titles.py` (sweep a run, `--dry-run`, `--include-automated`, `--audit`) and a hook in `push_results_to_run.py` (step 3c: only the record's own ticket LINK counts — comments may mention other tickets in passing). Self-test check 7c3; proven to FAIL on a throwaway worktree with the prefix logic broken.
- Run 498 after the sweep: all 22 Failed/Retest cases carry their ticket; 0 Blocked.
#rule133 #testrail #titles #tooling → L0486, L0487

## L0489 — 2026-10-20 — Rule 133 amended: a Passed test's ticket prefix comes off
- QA lead: "Yes save it as a rule aswell" — when a prefixed test passes, its title goes back to its own words. `unprefix_case()` in `prefix_ticket_titles.py`; `push_results_to_run.py` calls it for every Passed result; the run sweep removes it from Passed tests. Self-test 7c3 covers both directions; a copy with removal broken fails it.
- Order matters: check "title already correct" BEFORE the Automated hold, or an Automated case prefixed on his yes is reported as still held (fixed). A `pgrep -f "<cmd>"` wait loop matches its own command line — never wait on a process that way.
- Run 498 sweep (dry): all 22 Failed/Retest titles correct, no Passed title carries a prefix — nothing to change.
#rule133 #testrail #titles #tooling → L0488

## L0490 — 2026-10-20 — Fixed-ticket retest of run 498: queue chaining trap, virtual-list readings, PRD v69, no-ticket prefix
- **Chaining one queue after another:** `until grep -q QUEUE-DONE /tmp/queue-<a>.log` matches the queue's OWN `START` line (it echoes the command, which contains "QUEUE-DONE"), so the second queue started at once and ran beside the first. Wait with `grep -q '^QUEUE-DONE'` (anchored). Same family as L0489's `pgrep -f` self-match.
- **Tech View draws only what is near the screen:** a "groups" or "rows after Clear all filters" read without walking the whole list is NOT evidence (C581915 walked 94 of the groups; C581917 saw no rows because the right groups were far down). `tech-filter-check-1020.mts` walks `.q-table__middle` to the true bottom (scrollTop + clientHeight ≥ scrollHeight, three times) with Unassigned closed first.
- **PRD 845185030 moved to v69 (20 Oct 2026 15:31 UTC):** S1-R15 now lists deactivated / not-enrolled / Time-Clock-off lead technicians who keep a column, with a grey "Inactive" label, active first; new S1-R15c: the 50-value limit message must never show just because the Technician list is opened. On staging v26.40.20-0509710 it DOES show on opening (no case covers it yet).
- **Source conflict found by C97022 step 6:** S11-E1 (focus to the column header when the last card leaves) vs S1-R15a/S1-N1a (nothing matches ⇒ empty state, so the header is gone). Ambiguous source ⇒ Blocked + PO question (Rule 58), not a ticket.
- **Rule 133 gap fixed:** a non-Passed result with NO ticket left the old "SV-n - " prefix on; `prefix_case()` now takes it off. Self-test 7c3 covers it (proved red on a broken copy).
- **`push_results_to_run.py` step 3c now also strips an old prefix when a non-Passed result names no ticket** (C97022 went Retest → Blocked on a PRD question and kept "SV-11326 - "); a ticket still HELD for his yes (`ticket_held`) ALSO loses an old prefix from an earlier, fixed ticket (C581915 was "SV-11326 - " while failing for a new reason); the new ticket's prefix goes on when it is filed.
- **Technician filter gap (staging v26.40.20-0509710):** a full walk found 329 Tech View groups / 340 Board columns but 317 filter options; every option is a group, and 11 groups have no option (Aimee Francis, Allison Hughes, Brett Guerra, Darrell Martinez, Debra Taylor, James Price, Jared Miller, Mary Parker, Rebecca Mitchell, ZZAUTOTEST F3 Dan Delta, Deleted technician). PRD v69 S1-R15 and C581915 step 2 both say the options are everyone who gets a group. `tech-filter-missing-1020.mts` reads who they are.
- **Bringing a far-down Tech View row on screen:** `findRow(p, <work-order id>)` from `wob.mts` works (id from `workOrders(a, customer)`); a `[data-test-id^="tech_view_row_"]` filtered by the S-number text found nothing. The Technician filter has its own "Search technician" box inside the open list — re-open the list and wait for the box before each `fill` (a second fill after Escape timed out).
- **Staff API:** `/api/staff?search=<name>` returned nothing for the 11 names that have a Tech View group but no filter option — they are not ordinary active staff; read them with `include_inactive=1` / `status=all` (lookup v2).
- **A staging script can land at ANOTHER location even after `asRunner` (another session moves the shared runner):** the first Aimee Francis picture run showed S1- work orders and other staff, so its "no column" was void. Every probe that judges a list must `switchLocUI(p, 'Staging Heavy Duty - 9919')` on screen, read the header back and stop if it is wrong. Options in the Technician list are `.q-checkbox` rows, not `.q-item`; the search box is `getByPlaceholder('Search technician')`.
#run498 #queue #techview #prd #rule133 → L0489, L0458

## L0491 — 2026-10-20 — Duplicate check before filing: a same-day ticket can be missed by text JQL; add_case HTML now renders without a UI save
- The QA lead said YES to filing the "Technician filter leaves out 11 technicians" report, but the re-check before filing found **SV-11575** (his own, created 10:50 UTC the same day) already covering it AND the 50-value message. My earlier `text ~ "Technician filter" AND created >= -21d` search (20 rows) had not listed it. Before filing, ALSO read: `parent = <epic> AND created >= -1d` and the tickets linked to the case's area, not only a text search. Re-check before filing (Rule 62(c)) is what caught it.
- **`add_case` with block HTML (p / ul / ol / hr) rendered as `markdown fr-view` on the served page straight away** (C698883, 20 Oct 2026) — no editor re-save was needed. Always check the served page (`new-case-1020/probe_view.mjs`) rather than assuming either way.
- TestRail's edit page keeps "Save Test Case" disabled when the content set is identical to what is stored — a disabled Save after `html.set` means "nothing changed", not a fault. `case-edits/ui_write_pre_steps.mjs` already signs in (line ~22); adding a second sign-in makes `#name` time out.
- Where the QA lead says "mention the block on this ticket in the comment and not in the test case itself": no "Known problem (SV-…)" paragraph and no ticket in `refs` / the marker; the ticket goes in the result comment. Rule 133 still prefixes the title (said so in the report).
- **Which PO sheet is "the same sheet"?** For WO Board / Tech View the running question sheet for Chris is **https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU** ("Questions on the spec and design", started 14 Oct; numbered 1…34, intro line says which numbers are new on which day). The 19 Oct "design differences" sheet (1coGNz1Z…) is a separate, finished one. I picked the latter from PROJECT-STATE's newest link and the QA lead corrected it — new questions go on the 14 Oct sheet unless he names another.
#run498 #jira #duplicates #testrail #fr-view #po-questions → L0490, L0486

## L0492 — 2026-10-20 — A PO answer that asks "please log a bug" is not the QA lead's permission
- Chris answered Q34 on the 14 Oct sheet and wrote "please log that as a bug against S11-E1" (PRD v70 the same afternoon). Jira filing still needs the QA lead's per-ticket yes (Rules 62/113): the test (C97022) was posted Failed with the ticket held, the draft prepared, and the question put to him. The case's own Expected (step 6 "column header") now diverges from v70 — reported, not edited, until he names the case (Rule 114(c)).
- Owning story for keyboard/focus defects on WO Board: **SV-10054** "Keyboard access and focus" (Ready for QA on 20 Oct) — earlier focus defects (SV-11498, SV-11422, SV-11419) sit under it.
- Order the QA lead asked for when a ruling changes a failing test (20 Oct): update the named step's Expected (only that step, before/after snapshots, served page checked) → re-run the test on staging → duplicate check again (parent + last day + text) → file → post the re-run result with the ticket. Filing script: scratchpad `file-1020b.py` (copy of `file-1020.py`, one plan line changed) + `verify_ticket.sh`.
#run498 #po-ruling #jira #rule113 #rule114 → L0491

## L0493 — 2026-10-21 — Finding a fixed ticket's tests: title prefix + newest results AND the cases whose refs name the ticket
- "Rerun every test blocked on SV-11577 / SV-11576 / SV-11575": scanning run 498 for the key in the TITLE (Rule 133 prefix) and in the newest 3 results' comments/defects found only SV-11575's two (C581915, C698883). The other two tickets each had a brand-new UNTESTED case written for them (C707076 asset year → SV-11576; C707077 Lines-tab staff name → SV-11577) that only the case's `refs` field names. Scan untested tests' `refs` too.
- C707077 needs a technician whose staff-record name and account name differ: on staging that is **Carol Neal** (account "David Sparks", L0402). `fixed-1021.mts` reads the account name back first (positive control). C707076's asset needs year/make/model: create the work order first, then `POST /api/vehicles/change` with year 2022 + borrowed make/model ids + a VIN (design-stg5 C590120 recipe).
- `tech-filter-stg6.mts` and `tech-filter-check-1020.mts` now switch to Staging Heavy Duty on screen and stop if the header reads anything else (L0490).
- **The shared test user is moved between locations by other sessions WHILE a script runs (21 Oct 12:29):** the page showed S1- work orders and an empty location name in the header, so `switchLocUI` found nothing to read and gave up; data made through the API still went to Heavy Duty. New `ensureLocation(p, a, HEAVY)` in `wob.mts`: API change-location → reload → read the header back (twice), then the on-screen switch, else throw. Call it right before every screen, not once per script. Used by fixed-1021, c698883-1021, tech-filter-stg6, tech-filter-check-1020, tech-filter-aimee-1020.
- **Inactive technicians in the Technician filter read "<Name>Inactive" in innerText** (the grey label is a separate element with no space), so an exact name match against group names reports them as missing. Compare with the label stripped. On staging v26.40.20-00f1fd6 the 10 deactivated technicians are listed after every active one; only the "Deleted technician" group has no option (PRD v71 S3-R20e calls it a group, not a person).
- **The shared "ZZ WOB Runner" kept landing at another location (S1-, no location name in the header) even right after an API change-location (21 Oct 12:47):** another session is driving the same runner. `WOB_RUNNER=<tag>` (runner.mts + wob-run.sh) gives a script its own runner "ZZ WOB Runner <TAG>"; unset = the shared one, unchanged.
- **Never edit `wob-run.sh` while a run is using it:** bash reads a script as it goes, so the running step failed with `line 17: s/[0-9a-f]{32,}/<hidden>/g: No such file or directory` (rc 127).
- **The 50-value limit on staging v26.40.20-00f1fd6 (SV-11575 fixed):** no message on opening; at 50 chosen the 51st tick is refused and the red text reads "50 selected (max 50 across all filters)" — NOT the PRD v71 S1-R15c sentence "This change would exceed the 50-value limit across all filters". A positive control that looks for the PRD sentence will never fire on this build; look for /max 50 across all filters|exceed the 50-value limit/.
- One own-runner run signed in fine and the next was refused (quick-login 200, then fe-permissions 401) with the same cookies, which still answered 404 on /api/auth/me. Re-queue before blaming the cookies.
- **Extra actions in a script change the state a step judges:** c581915-1021 typed into "Search technician" (to check Technician-D, not a step of the case) right before step 10's Escape and read the list still open. Re-check such a step exactly as written (`c581915-esc-1021.mts`) before judging it.
- **Root cause of "lands at S1" (21 Oct 13:15, diagnosed with loc-diag*-1021.mts):** the runner is enrolled ONLY at Heavy Duty (`/api/staff/my-workplaces` lists one location, so the profile menu has no Change Location row), `/api/iam/change-location` answers 200, yet the runner's page showed S1- work orders with no location name. Setting the SIGNED-IN admin's own location to Heavy Duty before switching to the runner fixed it at once. `WOB_MAIN_LOC=1` (runner.mts) does that; passed through wob-run.sh with WOB_LOC_TRIES. Cause on the server side unknown — another session using the same staging sign-in probably moves the admin's location.
- **On staging v26.40.20-c627fc7 (21 Oct 13:20) Carol Neal's work show "David Sparks" EVERYWHERE** — List lead, Lines-tab Labor text, roster, Edit Line, Board card and column header — although the staff API row reads first/last "Carol"/"Neal". L0402's split (List = David Sparks, Board = Carol Neal) no longer holds; read Settings → Staff (`c581895-staff-carol.mts`) before deciding which name is the "staff record name".
- The List's Asset cell is not found by header text "Asset" in fixed-1021 (index null) — the row text holds it; read the cell by the column's data-test-id next time.
#run498 #retest #refs #staging #location → L0490, L0402

## L0494 — 2026-10-21 — After a container restart: what is lost, and the quickest way back to TestRail, Jira and the runner
- The restart (21 Oct ~13:35 UTC) re-cloned the repo on ANOTHER session's branch (`claude/slack-session-0sxnd9`) and emptied `/tmp`. First: `git fetch origin <my-branch>` and `git checkout -B <my-branch> origin/<my-branch>` (the local commits belonged to the other branch, nothing of mine was lost).
- **TestRail API answers to the committed web password** (`build/ENVIRONMENT-CREDENTIALS.md` §4/§5) when the API key in `/tmp/testrail/creds.json` is gone: `get_run/498` → 200. Re-create `/tmp/testrail/creds.json` (`password` = that value, chmod 600) and `tr_client.py` works again.
- **Jira:** `bash build/testing-tools/ensure_bridge.sh` FIRST (login.mjs dies with `ENOENT bridge-port.txt` without it), then `/tmp/atlassian/creds.json` {email,password}, then `NODE_PATH=/opt/node22/lib/node_modules node build/atlassian-login/login.mjs`; `jira.sh` then reads 200.
- **The run-498 runner (`wob-run.sh`) runs from `build/global-search/e2e`, whose `node_modules` is not committed:** `npm ci` there (8 packages, 1 s) before the first script.
- **Staging and QA-branch sign-in cookies are NOT recoverable** after a restart — the QA lead must send them again; never dig them out of the conversation transcript.
- Finding a ticket's tests is now a committed tool: `python3 build/wo-board-tech-view/run498-2026-10-08/find-ticket-tests.py SV-1,SV-2 [run] [N]` (title prefix, refs, newest N results).
#restart #access #testrail #jira #run498 → L0493, L0355

## L0495 — 2026-10-21 — QA lead ruling: a test failing or blocked on a "fast-follow" ticket is not tested; it moves to the Fast-follow section and leaves the run
- Ruling (QA lead, 21 Oct 2026): "If there is any test case, which is blocked or failed on any ticket which has this tag called "fast-follow" please do not test that case rather move that case to this fast follow folder and exclude it from the test run." WO Board / Tech View folder = TestRail section **87347 "Fast-follow"** (parent 13204, suite 1).
- Check BEFORE any retest: `python3 build/wo-board-tech-view/run498-2026-10-08/fast-follow-scan.py 498` (tickets from the title prefix, refs and newest results; labels read live from Jira; writes fast-follow-scan.json). The label is lower-case `fast-follow`.
- **API trap:** `move_cases_to_section/{id}` takes the TARGET SECTION id in the path, body `{suite_id, case_ids}`. Calling `move_cases_to_section/1` with `section_id` in the body put seven cases into section 1 "Test Cases" (200, no error). Read `get_case/<id>.section_id` back after every move.
- Excluding from the run: snapshot every test's results first (`fast-follow-2026-10-21/run498-results-before-removal.json`), then `update_run/498 {include_all:false, case_ids: all-current minus the moved}`, read back the full test list (285 → 278, no other case lost).
- Automated cases (`custom_atmstatus` 3: C96967, C368147) are held for his yes before the move (Rule 71, as with the prefix on 20 Oct); tell Vlad if moved (Rule 65).
- After a restart the run scripts also need `build/wo-board-tech-view/node_modules` → `../global-search/e2e/node_modules` (symlink, git-ignored); without it every script dies in 3 s with `Cannot find package 'playwright' imported from …/session.mts`.
#run498 #fast-follow #testrail #ruling → L0494, L0488

## L0496 — 2026-10-21 — SV-11499 retest on sv11499: the location rows sit inside the profile menu; a first Google redirect on a QA branch can be a one-off
- C96975 Passed on sv11499 (v26.40.20-00f1fd6), all 23 steps in one script (`c96975-1021.mts`): real Logout + sign-in, a second browser, Change Location to Staging Lethbridge - 4310. The saved Work Orders preference now records `progress:false` across sign-ins.
- **Change Location:** after clicking `select_location`, the choices are rows INSIDE the profile menu, read as `check <location name>`; the first `.q-menu .q-item` is "Edit Profile". Take the `check …` rows, strip the prefix, then `switchLocUI(p, name)` and read the top bar back.
- **The staging sign-in cookie opened the sv11499 QA branch** (same Google sign-in), but the first attempt landed on `accounts.google.com/v3/signin/identifier` and the second, 30 s later, signed in. Retry once before asking for a branch cookie (Rule 104: two attempts).
- After a restart `PIL` from `/usr/lib/python3/dist-packages` is built for 3.12 while `python3` is 3.11 (`cannot import name '_imaging'`); `python3 -m pip install --target /tmp/pylib pillow` and run the annotate/push tools with `PYTHONPATH=/tmp/pylib`. (`pip` alone installs for 3.13.)
#run498 #sv11499 #location #signin #restart → L0494, L0495

## L0497 — 2026-10-21 — Settings > Staff shows the LOGIN ACCOUNT name, not the staff record name; my C707077 Failed was wrong
- `GET /api/staff` (Settings > Staff) names a person by the **login account**; `GET /api/technicians` names them by the **staff record** (`user_id` ties the two). Staging pairs: staff **David Sparks** ↔ login **Carol Neal** (user 5b7d54ab…), staff **Debra Garcia** ↔ login **Lindsay Perez** (staff 069b545f…). Probe: `names-probe2-1021.mts`. (Fact first written on another session's branch, playbook §AL.2 — read for facts only, Rule 119.)
- L0402 and L0493 had the pair the wrong way round ("Carol Neal (account David Sparks)"). With it corrected, every place on c627fc7 (List lead, Lines Labor, roster, Edit Line, Board card + header) shows the staff record name → C707077 **Passed** (outcome 3); the morning's Failed was re-judged, not re-run, and corrected by a new Passed result.
- Before calling a name "the staff record name", read `/api/technicians`; never Settings > Staff. Searching `/api/staff` for a staff-record-only name (Sparks, Debra) returns nothing — a quick tell that the two names differ.
- QA lead's question on 21 Oct ("check if we already have a ticket for this") found SV-11577 already carried a PASSED QA comment (08:58, staging c627fc7, Debra Garcia). Read the ticket's comments live before reporting any failure against it.
- C581895 (SV-11336) still uses Settings > Staff at steps 1–2 as the source of the staff record name; its preconditions say staging names cannot differ, which is no longer true. Put to the QA lead, not changed.
#run498 #names #staff-record #correction #rule104 → L0402, L0493, L0496

## L0498 — 2026-10-21 — PRD v73 settles two of three observations; Escape-in-search defect prepared; C581895 re-run with same-name technicians
- PRD 845185030 **v73 (21 Oct 14:42 UTC, Chris)**: S1-R15c now quotes the build's own text "50 selected (max 50 across all filters)" (no defect); "Deleted technician" in the Technician filter is a fast follow, **SV-11594** (no defect). S11-R5 "Escape closes an open menu, dialog or tooltip without changing anything." is broken by the Technician list once the cursor is in "Search technician" (both views, two Escapes, typed text kept; control without the box closes) → new test **C707079** (section 13246, run 498, Failed with ticket held) and draft `defect-drafts/tickets/D-S11R5-escape-technician-search-2026-10-21.wiki` (owning story SV-10054, Ready for QA). Script `esc-search-1021.mts`.
- **Jira search:** `/rest/api/2/search` answers **410** now; use `/rest/api/3/search/jql` (already in ATLASSIAN-JIRA-ACCESS-METHOD §5a). A JQL that should return known tickets is the positive control — an empty answer from the old endpoint looked like "no duplicates".
- **C581895** (QA lead chose a): preconditions corrected (Settings > Staff shows the login name; use technicians whose two names match, e.g. Esther Howard / Ralph Edwards; never Carol Neal / David Sparks) — `case-updates-2026-10-21/c581895_precond.py`, before/after, fr-view checked. `C581895_SAME_NAMES=1` (passed through wob-run.sh) skips Carol. Passed on staging c627fc7 (S2-37951), all 12 steps.
- **Tech View row cells are offset by an unlabelled drag-grip cell** — the Assigned Techs avatars sat at header index + 1; `c581895-v2.mts` now tries ai, ai+1, ai-1.
- **Leave the shared Admin's columns as found:** `c96975-1021.mts` turned Tech View's Service Advisor / Assigned Techs and List's Progress off and did not restore them, which hid Assigned Techs from the next test. It now restores at the end; `restore-cols-1021.mts` puts them back (staging done; sv11499 not — its sign-in went to Google twice at 15:30–15:40).
- `/api/technicians` is location-scoped and paged (100 at one location, 7 at Heavy Duty); don't treat "not in the list" as "no staff record".
#run498 #prd-v73 #escape #names #jira-search #columns → L0497, L0495

## L0499 — 2026-10-21 — Filing a held Story Defect end to end, then the fast-follow move (SV-11627, C707079)
- QA lead's yes was conditional ("file it if the current behavior is against the PRD"): re-read the PRD live (still v73, S11-R5 unchanged) and the staging build (still c627fc7, reproduced 15:21) before writing anything.
- `file-esc-1021.py` is the whole filing in one script: last duplicate check (`/rest/api/3/search/jql`) → `POST /rest/api/2/issue` (Story Defect, parent SV-10054, Medium, labels board-tech-view + fast-follow) → multipart attachments with the size compared → wiki description `PUT` → `size_pics.py` (needs `PYTHONPATH=/tmp/pylib` after a restart) → `issueLink` Relates → read back (type, parent, priority, labels, links, attachments, pictures in the description, test case at the end). Evidence `defect-drafts/tickets/esc-1021/filed.json`.
- Order after filing: post the result again WITH the ticket (push tool adds the "Follow the status here" comment and the `SV-nnnnn - ` title prefix) BEFORE the fast-follow move, so the run's history carries the ticket; then snapshot results, `move_cases_to_section/87347`, `update_run` without the case, read back.
#run498 #jira #filing #fast-follow → L0495, L0498

## L0500 — 2026-10-21 — Moving a Story Defect under the Fast Follow epic (SV-11593): it becomes a Bug, and only the bulk-move API can do it
- QA lead: "move this ticket SV-11627 to this Epic SV-11593". The epic **SV-11593 "Board/Tech View Fast Follow"** holds only **Bugs**; Chris converted our Story Defects (SV-11582, SV-11545, SV-11546) to Bug + parent SV-11593 the same way (changelog 21 Oct 09:03). Story Defect is hierarchy −1, so it cannot sit under an epic.
- `PUT /rest/api/3/issue/{KEY}` with `issuetype` Bug (id **10008**) + parent → 400 "Issues with this Issue Type must be created in the same project as the parent". **Works:** `POST /rest/api/3/bulk/issues/move` with key `"SV,10008,SV-11593"` → `{issueIdsOrKeys, inferClassificationDefaults/StatusDefaults/SubtaskTypeDefault: true, inferFieldDefaults: false, targetMandatoryFields: [{fields: {customfield_10153: {retain:false, type:"raw", value:["10120"]}}}]}`, `sendBulkNotification: true` (false → 403 for us). Product Area (customfield_10153) "Work Orders" = option 10120, required on Bug. Poll `/rest/api/3/bulk/queue/{taskId}` to COMPLETE.
- Read back after: summary, description, labels, priority, status, attachments, the Relates link and the full-width picture sizes all survived (before/after JSON in `defect-drafts/tickets/esc-1021/`).
#jira #fast-follow #move #epic → L0499

## L0501 — 2026-10-21 — "Move them back to their native folders": get_history_for_case records every section move
- QA lead: move all cases of run 498's folder **55300 "Not runnable for now"** (made 8 Oct for cases a tester could not run then) back to their native folders. 24 cases, all ours, none Automated.
- `get_history_for_case/{id}&limit=250` → each entry's `changes[]` has `{"field": "section_id", "old_value", "old_text", "new_value"}` for a folder move (my first read filtered on the wrong key and found nothing — read `field == "section_id"`). Each case had exactly one move into 55300; native = that move's `old_value`.
- Native folders: 13247 S12 Google Analytics (8) · 13248 Counts and data accuracy (3) · 20449 TP Tech-plan coverage (1) · 47111 Medium shared plumbing (6) · 47110 High shares code (6). `move_cases_to_section/{target}` per folder; read back: every case in its native section, run 498 test ids and statuses unchanged (276 → 276), 55300 empty (left in place, not deleted). Plan + read-back: `run498-2026-10-08/not-runnable-return-2026-10-21.json`.
#run498 #testrail #sections #history → L0495, L0500

## L0502 — 2026-10-21 — Setting "QA Assignee" on an epic's stories
- Jira field **QA Assignee = `customfield_10385`** (people, array). Bilal Muzamil's accountId `712020:6d590212-5c9b-4135-ae11-277f3826110e` (`/rest/api/3/user/search?query=bilal`).
- Stories of an epic: `/rest/api/3/search/jql` with `(parent = EPIC OR "Epic Link" = EPIC) AND issuetype = Story`. SV-10043 has 12 stories (SV-10044–SV-10054, SV-10593; SV-10053 is OBSOLETE) among 50 children (rest Bugs/Tasks).
- `PUT /rest/api/3/issue/{KEY} {"fields":{"customfield_10385":[{"accountId":…}]}}` → 204; read back each. All 12 were empty before. Log: `build/wo-board-tech-view/qa-assignee-2026-10-21/`.
#jira #qa-assignee #wo-board → L0500

## L0503 — 2026-10-21 — Labelling WO Board / Tech View's Done defects "QAcomplete"
- QA lead: label `QAcomplete` (exact case, as in his screenshot) on every WO Board / Tech View Story Defect or Bug that is Done with QA Assignee Bilal Muzamil. JQL `project = SV AND issuetype in ("Story Defect", Bug) AND status = Done AND "QA Assignee" = "<accountId>"` returns 516 across all features; WO Board / Tech View = label `board-tech-view` OR parent in SV-10043, its 12 stories, or the Fast Follow epic SV-11593 → 50. 11 already had the label; 39 got it via `PUT {"update":{"labels":[{"add":"QAcomplete"}]}}` (keeps every other label), each read back. Log `build/wo-board-tech-view/qa-assignee-2026-10-21/QAcomplete-labels-2026-10-21.json`.
#jira #labels #wo-board → L0502

## L0504 — 2026-10-21 — A timed "test this within N hours" order: baseline first, then hourly check-ins that re-arm themselves
- QA lead: "test this in next 5 hours" for a test whose change was not on staging yet. Run the script once on the current build as a baseline (it proves the instrument: the old button must be SEEN), then `send_later` 60 min with a self-contained prompt that reads the ticket status + staging `app-version` and only runs the test when either moves, re-arming itself until a final check-in that runs regardless. Check-ins 1–2 found nothing; check-in 3 (18:49) found staging v26.40.20-4c6c9e0 and SV-11580 in TESTING STAGE → C698884 Passed. Script `c698884-1021.mts` measures divider gaps (centred = within 4 px) and card spacing against the baseline.
#run498 #check-ins #send_later → L0494

## L0505 — 2026-10-22 — Running the WO Board suite on PRODUCTION: password sign-in in the harness, profile, and three traps
- Release reached production as **v26.43.0-ffea43c** (22 Oct, seen 11:15 UTC; staging v26.43.0-e48011d): switcher List / Tech View / Board View with a "New" badge, Board View without density. Check with `prod-feature-check-1022.mjs`.
- **Harness:** `source prod-env.sh` (GS_APP app.shopview.com, WOB_API api.shopview.com, `WOB_PROD_LOGIN=1`) → `session.mts open()` signs in with `testing-tools/prod-login-boot.mjs` and `/tmp/shopview/prod-login.env` (SV_USER = the second admin test account `bilal.muzamil+serviceadvisornoreports@`, password from ENVIRONMENT-CREDENTIALS §1; never the QA lead's own). `wob-run.sh` passes WOB_PROD_LOGIN / PROD_ENVF and still needs `/tmp/shopview/app.env` to exist (key "app").
- **Profile:** `profiles/app.shopview.com.json` — org **72b2cc90-6964-4429-a207-76e55f946936** (discover-profile found none; `org-probe2-1022.mts` reads it from the app's own `/api/organizations/<org>/…` request on Settings and proves it with `/roles` → 200), Truck Hill 1 (555206ea…), Trucks Hill 2 (b617914c…). `ensure-loc.mts` = ensure-heavy for any environment (profile `heavyName`).
- **Traps:** (1) the evidence folder needs `zz-photo-red.png` / `zz-photo-blue.png` (copied from staging's) or every photo case stops with ENOENT; (2) a new impersonation page on about:blank cannot fetch production's API ("Failed to fetch") — `viewas.mts` opens the app first when WOB_PROD_LOGIN; (3) a second sign-in of the same account ends the first, so production scripts run strictly one at a time (re-runs queued after the full run).
- Full run: `run-full-prod-1022.sh` + `full-order-prod-1022.txt` (made from the 16 Oct staging runner: block A / Org B dropped per QA lead 9 Oct, Fast-follow cases removed, 20–21 Oct scripts swapped in). Rule 125: `stg6-tz.mts` set Truck Hill 1 to Asia/Karachi and proved the Schedule clock (exit 0).
- Judging: `prod_compare.py <script>.json` (positions masked; staging baseline = each test's latest committed staging reading) and `judge_pack.py <script>.json C…` (case text + staging pass + production readings + diffs + pictures → `evidence/prod-2026-10-22/judge/<C>.md`).
#run498 #production #harness #rule126 → L0494, L0504

## L0506 — 2026-10-22 — A long unattended run keeps writing evidence: autosave it, path-scoped, behind the secret scan
- The production run of run 498 writes pictures and logs for hours; the Stop hook flags every new file. `run498-2026-10-08/autosave-prod.sh` (started with nohup) commits only `evidence/prod-2026-10-22` every 10 minutes after `scan_secrets.py --staged` passes, pushes, and stops by itself when both the full run (`/tmp/queue-prod-full.log`) and the re-run queue (`/tmp/queue-prod-redo.log`) say QUEUE-DONE. Copy it (change the folder and the queue names) for the next long run instead of committing by hand between notices.
#run498 #autosave #rule29 #rule75 → L0505

## L0507 — 2026-10-22 — A new environment needs the suite's standard people first (seed-staff.mts + seed-staff-extra-1022.mts)
- The first production full run reached step 13 with almost every test stopping at `Cannot read properties of undefined (reading 'id' / 'staff_id')`: the scripts look up people that exist on staging/QA but not on a fresh environment — `zz.wob.*@staging.shopview.local` (Esther Howard, Ralph Edwards, Jenny Wilson, Kristin Watson, Theresa Webb, Dana Ortiz, Ina Active, Billy Nobill, Nick Noclock, Tim Clockuser, Ella Elsewhere at the second location…) and "Ayesha Khan" (s1-batch3's Technician A).
- **Before step 6 of any new environment:** `./wob-run.sh seed-staff.mts` (8 Oct list, also learns the Deactivate route on Ina Active) then `./wob-run.sh seed-staff-extra-1022.mts` (the five added later, plus the five staging people picked by name: Admin ShopView, Bilal Muzamil, Branko Cicovic, Cameron Williamson, Floyd Miles). Read back with `candidates()` — all must be lead-eligible.
- Production has no **"Office User"** role (roles: Technician, Admin, Senior Service Advisor, Time Clock User, Foreman), so "Olive Office" cannot be made; checks that she is NOT offered are weaker there and their results must say so.
- Check every step's JSON for `"error"` as soon as it ends (`evidence/<env>/<script>.json`); a whole batch of errors in under a minute means set-up, not the product. The failed first attempt's logs are kept in `logs-full-first-attempt/`.
#run498 #production #seeding → L0505, L0506

## L0508 — 2026-10-22 — Rule 114(c) applied: rewriting named steps of a case to the current PRD (C590120)
- QA lead: "YES (Rewrite the test case and never the PRD)" to the ask to bring C590120's steps 6–7 (Board View density, removed by PRD v73 S3-R11) to the current spec. Only those two steps and their two Expected lines changed; new Expected lines are verbatim PRD v73 quotes (S3-R11, S6-E1) read live the same day, with a plain restatement marked "(our restatement)"; the source paragraph gained one dated line naming the version and his decision in one sentence (114(d) amendment: his own ruling = one short dated line). Script: `case-updates-2026-10-22/c590120_steps67.py` (exact old text must occur once; before/after JSON; reads back that preconditions and title are untouched), then the served-page check (`probe_view_590120.mjs`: fr-view, no literal tags).
- The test's script must follow the rewritten steps before the re-run (design-stg5 C590120 block: step 6 counts Board density buttons; step 7 changes density in Tech View and compares WO1's card with a baseline read just before).
#run498 #rule114 #case-update → L0505
- 22 Oct (second pass): step 11 (s2-batchA) failed the same way — scripts also pick staging's own people by name (`by('Admin ShopView')`, 'Bilal Muzamil', 'Branko Cicovic'; s1-batch4b 'Cameron Williamson', 'Floyd Miles'). Find them ALL before a new environment with a scan of the run order's scripts for `by('…')` / `name === '…'` / name arrays (the scan used on 22 Oct is the one-off in this commit's message trail) and seed them together; "Carol Neal" (staff David Sparks ≠ login) cannot be made from screens on production (§AL.2).
- 22 Oct (third pass): second-browser tests (C96928 in s2-batchA) sign in through the Global Search harness `signIn()`, which reads `GS_ENVF` / **`PROD_ENVF`** (SV_USER/SV_PASS) — `prod-env.sh` now exports `PROD_ENVF=/tmp/shopview/prod-login.env`. On production a second sign-in of the same account ends the first, so such a test is re-run ALONE after the full run (redo queue), never mid-batch.
- 22 Oct (fourth pass): production had no **"ZZAUTOTEST WO View Only"** role (`role-viewonly-stg4.mts` only resets an existing one, exit 0 with nothing done). `seed-viewonly-prod-1022.mts` makes it through Roles & Permissions > Create Custom Role (201, read back: woFullViewMode + workOrdersView only) and the view-only person zz.wob.viewonly. s3-batchC looked Ayesha Khan up by her REAL staging email — never create a user with a real person's address on any environment (it sends a real invitation); the script now falls back to the zz test copy.

## L0509 — 2026-10-22 — "Assign" vs "Reassign lead technician": the menu item depends on whether the work order has a lead (S3-R14)
- On production v26.43.0 an Unassigned card's More actions offers **"Assign lead technician"**; one with a lead offers "Reassign lead technician" — exactly PRD v66+ S3-R14 ("“Assign lead technician” on a work order with no lead technician, “Reassign lead technician” on one that has a lead technician"). The shared helper `wob.mts openReassign()` only looked for "Reassign", so C96956 timed out on production (a script fault, not a product fault). It now accepts both (`/(Re)?[Aa]ssign lead technician/`); self-test 34/34 after the change.
- Before blaming the product for a missing menu item, read the PRD for the item's wording in that state; a label that changed by state is the usual cause.
#run498 #production #menu #prd → L0505

## L0510 — 2026-10-22 — Production run: three set-up traps that look like product results ("me", the time zone, Office User)
- **"Me" is not Admin ShopView on production.** 37 run 498 scripts picked "me" (Assigned to me, my own group, my advisor) by the literal `'Admin ShopView'`; production signs in with the second admin test account, whose staff name is **"Service Advisor No Reports (Admin)"**, so C96937 / C154884 set up "my" work orders for someone else. Scripts now use `ME_NAME` from `profile.mts` (`WOB_ME_NAME` env › profile `meName` › 'Admin ShopView'); `profiles/app.shopview.com.json` carries `meName`. Proved per environment (production → the test account, staging/sv10043 → Admin ShopView); self-test 34/34 before and after.
- **The Rule 125 set-up step had silently failed.** `stg6-tz.mts` looked for the row "Staging Heavy Duty - 9919" and timed out on production, leaving Truck Hill 1 on Africa/Bangui (UTC+1) — a shift "running now" in Pakistan time was still in the future (C154888 Blocked). It now takes the location name from the profile (`heavyName`). After the change the Schedule pill equals the browser clock, but the cached user in localStorage still reads the old zone until the next sign-in — prove with a fresh sign-in. Pausing the full run for a set-up step: `pause-at-step-1022.sh <N>` (stops at a step boundary, by PID), then `FROM=<N+1>`.
- **Production has no "Office User" role** (Technician, Admin, Senior Service Advisor, Time Clock User, Foreman), so "Olive Office" was never made and C368163 step 8 had nobody to search for. `seed-office-prod-1022.mts` makes a CUSTOM role named "Office User" + Olive; if she is offered, that is Unsure (a custom role carrying the name, not the system role), never a product failure.
- Other production set-up gaps found by judging: customers seeded only by a script's OTHER test (C96913/C154884 run under s1-batch2b, seeded in s1-batch2) — re-run the seeding script with the same ONLY; staging-only sign-in pins (WOB_PIN_NAMES) that C96935 relied on — now pinned in the script. Re-runs keep the full run's readings: `redo-one-1022.sh <script> <ids>`.
#run498 #production #setup #timezone #rule125 → L0505, L0507

## L0511 — 2026-10-22 — Production: a second sign-in lands at the account's DEFAULT location and ends the first browser — tests that use one must run alone
- C96928's re-run hung 24 min: the second browser (`signIn()` of the GS harness) opened at **Trucks Hill 2** (the test account's default), so no Truck Hill 1 groups were drawn (`newSignIn: {}`), and the first browser's session was already ended (one session per account on production), so the script's `p.reload()` on the old page never returned. Fix pattern: right after `signIn()` POST `/api/iam/change-location` (profile HEAVY) on the NEW page's API, and finish the test in the NEW browser (C96928, C96948 now do).
- Any other test after it in the same script would run on a dead session → each such test (C96912 s1-batch4a, C96948 s3-batchA) is its own step in `full-order-prod-1022.txt`; `run-full-prod-1022.sh` now keeps `<script>.step<N>.json` per step so a script run twice keeps both readings.
- Six run 498 scripts carried the sv10043 QA-branch location ids as literals (`b3c8c820…`, `f8a8b802…`) — on any other environment they point nowhere. They now take HEAVY / LETH from `profile.mts`. Before a run on a new environment: `grep -n "b3c8c820\|f8a8b802\|d55bc308" <scripts>` must be empty.
- A hung step blocks the whole queue silently: when a re-run's log stops growing for >10 min, read its last line, kill it by PID and re-queue it fixed (the queue's next step starts on its own).
#run498 #production #signin #session → L0505, L0510

## L0512 — 2026-10-22 — Check a test is still IN the run before re-running it
- The production redo queue re-ran C96956 and C96973 (about 3 minutes of production time and one sign-in) although both had already been moved to the fast-follow folder and taken out of run 498; `judge_pack.py` then skipped them ("not in run 498"). Before queuing any re-run, list the run's tests (`get_tests/498`, paged) and drop the C-ids that are not there — fast-follow moves happen mid-day.
#run498 #fast-follow #redo → L0494, L0511

## L0513 — 2026-10-22 — A script that reaches the right END state by different steps is not a pass (C97006)
- `s9-batchA5.mts` C97006 dragged Ana's own second card above her first for BOTH step 6 and step 8, instead of "drag Alpha Co above Bravo Co" (step 6) and "drag the Charlie Co card from Ben's column into Ana's column" (step 8). The Expected (List keeps its sort and row order) was observed, so a judge called it Passed — but step 8 was never performed, and the staging pass of 8–16 Oct carried the same deviation. Held, script fixed to the case's own drags (by company name, `row(s,'Alpha Co')`, `card(s,'Charlie Co')`), re-run queued.
- When judging, compare the script's ACTIONS with the case's steps, not only its readings with the Expected; a deviation in the actions means re-run, never Passed.
#run498 #judging #verified-means-observed → L0510

## L0514 — 2026-10-22 — Board View has no Density control since PRD v73: older cases that ask for it are Blocked, never Failed
- PRD v73 S3-R11 (21 Oct 2026): "Board View shows no Density control in this release (SV-11580)." Production v26.43.0 matches it. C368154 (a brand-new user reads the default density "in Board View") timed out on `button_density` → Blocked at step 4 with the PRD quote, and the QA lead asked whether to move the step to Tech View (as he approved for C590120 the same morning — a per-case decision, never inferred, Rule 114(c)).
- A scan of the remaining production steps found 15 run 498 cases whose steps mention density together with Board View (C698884, C97023–C97035 analytics, C368153, C368155, C96944, C96989, C96992, C97026, C97033, C97034). When judging them: a step that needs a density control IN BOARD VIEW is Blocked (case out of date, product follows the PRD), not Failed; density in Tech View is still live.
#run498 #prd-v73 #density #board-view → L0508

## L0515 — 2026-10-22 — A script that boots its OWN sign-in ignores the environment switch
- Step 22 (`stg6.mts`, mode `nodirect`) stopped in 50 s on production: it calls `bootOrigin({ app: 'https://app.staging.shopview.com', … key: 'admin' })` directly (the staging quick-login), so `WOB_PROD_LOGIN` / `GS_APP` never reached it. Fixed: on `WOB_PROD_LOGIN` it uses `prod-login-boot.mjs bootProdLogin('/workorders')`. Before a run on a new environment: `grep -ln "bootOrigin\|qa-branch-boot\|app.staging.shopview.com'" <scripts>` — every hit needs an environment guard (today: stg6 fixed; C97012-two-people is a `todo` step that needs a second production login of its own).
#run498 #production #signin → L0505, L0511

## L0516 — 2026-10-22 — Location NAMES were hard-coded too: LOC1_NAME / LOC2_NAME from the profile
- Step 24 (C581915) stopped at once on production: `wob.mts ensureLocation()` defaulted to the name "Staging Heavy Duty - 9919" and refused "Truck Hill 1". 19 run 498 scripts matched or switched locations by the staging names ('Staging Heavy Duty', 'Staging Lethbridge', 'Lethbridge', a CSV row naming the location). `profile.mts` now exports `LOC1_NAME` / `LOC2_NAME` (env `WOB_LOC1_NAME`/`WOB_LOC2_NAME` › profile `heavyName`/`lethName` › staging names); proved per environment (production → Truck Hill 1 / Trucks Hill 2, staging → Staging Heavy Duty - 9919 / Staging Lethbridge - 4310); self-test 34/34 after.
- Still staging-only data on production: the "ZZAUTOTEST Empty Shop" location (s2-batchB / s2-batchC / s5-batchA pick it from the location menu) does not exist there — those tests will need it created (Rule 107) when they come up.
- With L0510/L0511 the full checklist for a new environment is: ids (`b3c8c820…`), location names, "me" name, own-sign-in scripts, staging-only records. grep all five before the first step.
#run498 #production #location → L0510, L0511, L0515

## L0517 — 2026-10-22 — Production data the run 498 cases assume: make it, or reuse what another test made
- C707077 needs a technician whose staff record and account name differ (staging's "Carol Neal" / "David Sparks"); production had none → `seed-carol-prod-1022.mts` makes the staff record, then account access as her → `POST /api/iam/change-name` "David Sparks" → Exit, and reads both back.
- The count-bubble pill cases (C682440, C682420) need a work order whose status pill shows BOTH a red and a blue number; a scan of List's first screens on production found none. The C590115 re-run had just made one (**S1-1262**: a line in Auth Req'd + a part Authorized to Order) — `c682439-440.mts` now takes `WOB_PILL_WO=<number>`. Before scanning or seeding, look in today's readings for a record another test already built.
- Scripts whose readings are not keyed by C-id (c698883-1021, c698884-1021, c682439-440) show "tests=0" in the step watcher — not a failure; wrap them as `{"<C-id>": readings}` (`<script>.keyed.json`) for `judge_pack.py`.
#run498 #production #seed → L0507, L0516

## L0518 — 2026-10-22 — Production has no "Service" department; a real sign-out/sign-in IS runnable there
- Production's departments do not include "Service"; scripts that looked it up by name sent `departmentId: undefined` and every enrolment add/remove was refused "department_id Missing required parameter" — so C96970 / C368131 could not move their technician off Truck Hill 1, and their own clean-up failed (S1-1290 left led by Mona Moved, S1-1287 by Theresa Pinned; the re-run's set-up puts the technicians back). Eight scripts now fall back to the FIRST department, as `staff.mts person()` already did (that is where the production test staff were enrolled).
- Staging could not do C97005 step 8 ("sign out, sign back in") unattended (shared Google sign-in, L0342), so a new-window stand-in was used and labelled. On production the test account signs in with a password: `s9-batchB.mts` now does profile menu > Logout, then the sign-in form in the SAME browser (password read from PROD_ENVF, never logged) — the step as written.
- Judges caught three "end state right, step not done" cases (C368158 / C368159 never opened the work order; C97005 step 8): `s11-batch.mts woPage()` opens `/workorders/<id>/lines` and reads Lead Technician + the On Site control with a picture.
- Three Known-problem cases reached outcome 3 on production v26.43.0 (fix shipped): C707076 → SV-11576, C698883 → SV-11575, C698884 → SV-11580 — all three tickets Done (read live 22 Oct).
#run498 #production #department #signout → L0510, L0513

## L0519 — 2026-10-22 — On production a canned line's NAME is not the line's TITLE; and a found-but-unclickable list option
- `high1-fix.mts` C368168 clicked `getByText(lineName(2))` = the canned line's name "ZX"; on production that canned line makes a line titled **"New York State Inspection"** (the page shows titles, `[data-test-id="line_title"]`). high1-fix / high1-fix5 / high1-batch now read the titles of the lines `one()` made off the work order page, in a side tab of the same session (`readTitles`), and `lineName(i)` answers those (canned name as fallback). The Schedule "Choose lines" matching uses the same lineName.
- `fx6-1017.mts clickOption` found the Lead Technician option (`data-zz-pick`) but Playwright's click waited 30 s (option outside the menu's visible scroll area) — C368166. It now tries a 6 s real click, then the option's own `click()` in the page.
#run498 #production #lines #picker → L0517

## L0520 — 2026-10-22 — A "compare with production" case run ON production must not sign in to production again; and the timesheet time shift
- medium-fix3 C368233 (and high1-batch's production half) open a production browser with `bootProdLogin` to compare against staging. Run ON production, that second sign-in ended the run's own session at 15:48 (L0511) and C368234–C368246 hit the sign-in page. On production (`WOB_PROD_LOGIN`) the "production side" is now a second tab of the same session; grep `bootProdLogin` in every script before a production run.
- Open time question, third reading (C368177, judged 22 Oct): a clock-in made at about 15:17 UTC lists as "03:17 PM – 03:18 PM" on screen, while its stored record reads 10:17–10:18 UTC — five hours (Asia/Karachi's offset) earlier than the real time. With the Work Order Log (03:25 PM for 15:25 UTC) and the Schedule now line (2:24 PM at 19:24 Karachi), production looks to shift times by the location offset between saving and showing. Recorded, not concluded: Rule 104 proofs + readings d/e after the full run.
#run498 #production #signin #timezone → L0511, L0510

## L0521 — 2026-10-22 — Production fact: Create Invoice opens "New Customer Payment", and closing it with its X takes the invoice back off
- On production v26.43.0, Finance > Create Invoice opens a "New Customer Payment" window (staging's older build did not). `high1-fix.mts` C368167 closed it with the X, which left the work order Complete and NOT invoiced — so the "change the lead on an invoiced work order" check ran on an un-invoiced one. The case already says "If a New Customer Payment window opens, leave it open"; the script now leaves it open. Any script that creates an invoice on production must not dismiss that window.
- Same judging pass: four scripts reached the right state by a shortcut the case does not describe (direct URL instead of All > Search > row; API lead change instead of tab 2's field; never opening the work order). Fixed to the case's own route, each hop recorded, the shortcut only as a recorded fallback (L0513).
#run498 #production #invoice #judging → L0513, L0520

## L0522 — 2026-10-22 — Report Location filters need a two-location account; analytics cases with Board View density
- C368226 (Work In Progress) and C368231 (Sales By Representative) were Blocked on production: medium-fix3 runs as the runner account ("ZZ WOB Runner", account access), which is enrolled at Truck Hill 1 only, and the reports hide the Location filter from a one-location user (as report cases C30446 / C30577 / C30216 say). Before a re-run, enrol the runner at the second location too (Trucks Hill 2) or run those two as the signed-in admin, who reaches both.
- Three analytics cases (C97025, C97027, C97035) change density while in Board View — Blocked under PRD v73 S3-R11 and put to the QA lead per case (Rule 114(c)); C97035's Expected "work_orders_density_load = 2 (once for each of the two displays)" may also conflict with density existing in Tech View only — reported, never edited.
- Judges flagged scripts that open screens by address (Purchase Orders, Vendors, Vendor Invoices, a work order) where the case lists clicks — Unsure under L0513; and an Escape press that emptied a Search box the case never empties.
#run498 #production #reports #location #analytics → L0513, L0514

## L0523 — 2026-10-22 — Rule 134: a question he can't follow is not a question; a reminder repeats the whole question
- Three questions were first sent with context but then REMINDED as one-line recaps ("Should C368233 pass on the behaviours it describes?"); he answered "I understand none of your questions … always make a rule". Rule 134 (RULES-61-ONWARD.md, index row, §1 line): every question and every reminder states what the thing is for, what happened, why it is a question, options each with what I will do, my marked recommendation, and the cost of silence — in layman words ("the spacing button", not "density"; "the app quietly records what people do", not "analytics"); `plain_check.py` before sending. Worked example: `run498-2026-10-08/asks-1022-rewritten.md`.
#communication #rule134 → Rules 99, 103

## L0524 — 2026-10-22 — Four more production traps: the auto "New Line" window, an all-Approved set-up, a hidden first open, a card off to the right
- **A work order with no lines opens a "New Line" window over its page on production**, hiding the status card's Lead Technician field; a script that searches for the lead field then marks the wrong control (C96936 clicked the On Site button). Close it (its X, else Escape) and read it closed before anything else on that page.
- **Read the case's set-up statuses, not just its counts:** `high1-batch.mts tabSet()` made every work order Approved although the asset/customer-tab cases need A = Estimate and C = Complete (staging passed them without noticing). Fixed: A stays an Estimate, C is finished to Complete, statuses read back.
- **The production viewAs opened /workorders before handing over the page**, so analytics cases counted two extra List views (C97023). It now opens /customers (no Work Orders events); analytics cases open Work Orders from the top menu.
- **A searched card can sit off-screen in its column** (C368153 read only empty columns) — bring the column into view (`toColumn`) and count cards as a positive control before any "no dollar amount on cards" claim.
- **Analytics passes have no screen to photograph:** `push_results_to_run.py --screenshots yes` refuses a Passed with no picture; post such results separately with `--screenshots no` and a bullet saying why.
#run498 #production #setup #analytics → L0510, L0513

## L0525 — 2026-10-22 — Production: Board View's field button is "Column Selection"; a brand-new user cannot really sign in unattended
- On production v26.43.0 the board's field picker is labelled **"Column Selection"** (SV-11580 renamed "Fields to display"); match `[data-test-id="button_board_fields_selection"]` first, labels second. The old `.board-view__scroller` scroll never reached a technician's column — use `wob.mts toColumn()`.
- Cases whose steps say a brand-new user signs out / signs in (C96910, C96912) cannot be done for real on production unattended: a new staff member has no password until they accept an emailed invitation, and test addresses (`@staging.shopview.local`) receive nothing; real mailboxes are barred (never a real person's address). The switch-user window is the stand-in and is judged Unsure with the one manual check named — not a self-imposed blocker: the route that would work (an invitation to a mailbox we can read) is not available without a real person's address.
- Seen while judging C96912: a fresh production sign-in's top bar read "Truck Hill 1" while the board showed S2-numbered work orders (the Trucks Hill 2 numbering) — noted for a look, not concluded.
#run498 #production #signin #board → L0518, L0511

## L0526 — 2026-10-22 — A script can lag its own case: read the case before blaming it
- Step 51: C96955's CASE had already been rewritten to PRD v73 (Board View has no density; Tech View keeps its own; Board cards stay the same), but `s3-batchA.mts` still drove the old version (density on Board View) — and C96954's case never mentions density, yet its script looped over three densities on Board View. Both are script lag, fixed without any case change; only C96944, whose own step 6 says to change density on Board View, went to the QA lead (Rule 114(c), Rule 134 wording). Before asking him anything about a case, read the live case text and compare it with what the script does.
#run498 #prd-v73 #density #script-lag → L0514

## L0527 — 2026-10-22 — Location names hide in PATTERNS too, not only in quoted strings
- L0516 replaced the quoted staging names, but step 59 (s5-batchA3) still stopped: its location reader looked for a top-bar line ending in `/ - \d{3,5}$/` (staging's "Staging Heavy Duty - 9919") and tested `/Heavy Duty/`; production's "Truck Hill 1" matches neither, so the reader returned null and the script refused to start. ui-fallback had `/Lethbridge/` the same way. Fixed with the profile's `LOC1_NAME` / `LOC2_NAME`. The new-environment grep must include regex literals: `grep -n "/Heavy Duty/\|/Lethbridge/\| - \\\\d{3,5}" <scripts>`.
#run498 #production #location → L0516

## L0528 — 2026-10-22 — Scripts that measure MORE than their case can fail on the extra; cut the extra, keep the case
- C96990's case is Tech View only (row text 14 px at every density), but `s6-batch.mts` also set density on Board View "for completeness" — on production (no Board View density, PRD v73) that extra stopped the test after every case step had been read. C96992's script did the same. Fixed by dropping the extra (one Board reading kept for reference). When a step outside the case errors, judge the case from the readings it did take; never Unsure/Blocked a case for a step it does not have.
- Four more scripts (s5-batchA, s6-batch, s6b-batch, ui-fallback) carried the staging-only location reader `/ - \d{3,5}$/` and `/lethbridge/i` (L0527) — now also match `LOC1_NAME` / `LOC2_NAME`.
#run498 #production #density #location → L0526, L0527

## L0529 — 2026-10-22 — Production run, last stretch: three small traps
- **Jira MCP "Atlassian_Rovo" answers 403 "The app is not installed on this instance"** for `shopview.atlassian.net`. Do not stop there: `build/atlassian-login/jira.sh GET /rest/api/3/issue/<KEY>?fields=summary,status,updated` works (its output has a trailing line after the JSON — parse with `json.JSONDecoder().raw_decode`).
- **A story that is `Done` is not named in Rule 112's table** (Ready for QA / Testing QA / QA Complete). For WO Board / Tech View, faults found after release have gone as **Bugs under the Fast Follow epic SV-11593** (L0500). So a production failure against a Done story is put to the QA lead as a question with that recommendation, never filed or blocked on my own reading (C96953, SV-10046 Done 22 Oct).
- **Building a RegExp inside a TS template literal**: an escape class like `[.*+?^${}()|[\]\\]` contains `${}`, which the template literal reads as a substitution → parse error. Build such a pattern with plain string concatenation. Check every edited script with `build/global-search/e2e/node_modules/.bin/esbuild <file>.mts --format=esm --loader:.mts=ts >/dev/null` before it reaches a queue.
- **Scripts that sign out (C368240 `signout-fix.mts`)**: production has no Dev Mode quick-login button, so "sign in again" goes through the sign-in form with the test account from `PROD_ENVF` (same block as `s9-batchB.mts` C97005). Each later script signs itself in (`session.mts` → `bootProdLogin`), so running it last is still safe.
#run498 #production #jira #typescript → L0500, L0525, L0527

## L0530 — 2026-10-22 — "Approve it" / "pin it" / "open it from the list" must be done on the screen, or the verdict is Unsure
- Judging batch 15 (production) turned three otherwise-good readings into Unsure because the script took a short cut the case does not have: C97032 approved the Estimate by adding an authorized line behind the screen; C368157 pinned and unpinned by writing the saved setting; C368215 opened the part sale by its address and never opened the Sales Representative dropdown the Expected names.
- On-screen routes now in the scripts (reuse them): **approve an Estimate** = give it one line in *Authorization required* (set-up), then Work Orders > All > Search > row > click the line's title (`[data-test-id="line_title"]`) > Edit Line > Status "Authorized" > Save & Close (`s11-fix3.mts` C97032) · **pin/unpin** = `toColumn` then click `[data-test-id="button_board_pin_<staffId>"]` (`s11-fix3.mts` C368157, from `C368156-pins-loc-stg.mts`) · **open a part sale like a tester** = top menu Parts > "Part Sales" > page search > click its row (`ps-counts.mts` C368215). Each keeps a labelled fallback so a failed click shows as "NOT ON SCREEN", never as a silent pass.
- Production switch-back trap: after visiting Trucks Hill 2, the profile menu's Change Location sometimes will not go back (three readings still "Trucks Hill 2", L0400 on staging). `ps-counts.mts` now tries the shared `ensureLocation` (server set + reload ×3, then menu) and then the menu in a fresh tab.
#run498 #production #on-screen #judging → L0526, L0528, L0529

## L0531 — 2026-10-22 — A test that visits the second location breaks the NEXT test in the same script when it cannot come back
- Production step 66 (`high2-batch.mts`): C368212 visited Trucks Hill 2 and its switch back failed, so C368214, the next test in the same browser, made its work order at Truck Hill 1 but looked for it on a list at Trucks Hill 2 and waited 30 s for a row that could not be there. The runner's per-step "location check" only runs between scripts, not between tests inside one.
- Where to look first when a list-row click times out: the test's `startState.location` in the script JSON (every test records it). If it is the second location, the culprit is the previous test's switch back, not the product.
- Fix pattern (local, not in shared `wob.mts`, Rule 129): a `backHome()` per script = `ensureLocation` with `WOB_LOC_TRIES=3`, then the profile-menu switch in a fresh tab of the same session, then reload; called at the end of any test that leaves the first location AND at the start of the test after it. Applied in `high2-batch.mts` (C368212/C368214) and `ps-counts.mts` (C368217).
#run498 #production #location → L0530, L0527

## L0532 — 2026-10-22 — Production's New Location form needs a Country before State/Province
- Settings > Locations > New Location on production (`app.shopview.com`, v26.43.0-ffea43c) marks **Country** as required ("Country is a required field") and **State/Province** stays empty until a country is chosen; staging's form had no Country field, so `notech-stg4.mts` (C368130) filled State only and Save & Close did nothing (no message). Pick Country "United States" first, then type the state. The form also shows "Setting up a new location may result in additional billing." — production is a dummy account (Rule 107, 2026-09-22), so this is expected.
#production #locations #form → L0527, L0531

## L0533 — 2026-10-22 — The stale "Change Location" field on production: go back through a third location
- C368156 on production (`C368156-pins-loc-stg.mts`): after switching to Trucks Hill 2, the profile menu still read "Change Location: Truck Hill 1" even after a reload, and picking Truck Hill 1 did nothing — the staging trap L0400, reproduced. Staging's detour went through "QB Location", which production does not have. The menu also offers **SANKAN** (the admin test account is enrolled there), so the detour now picks any THIRD location read off the menu (`check <name>` items that are neither `LOC1_NAME` nor `LOC2_NAME`), then Truck Hill 1.
- The same third-location route is now the last fallback in `backHome()` (`high2-batch.mts`) and the switch back in `ps-counts.mts`.
- This script writes `C368156-b40.json` (not `<script>.json`), so the step watcher reports "no readings file"; wrap it as `{"C368156": …}` before `judge_pack.py`.
#production #location #stale-field → L0400, L0531

## L0534 — 2026-10-22 — The draft scripts (C6147xx-stg.mts) write FLAT readings; wrap them before judging
- `C614714-stg.mts` … `C614719-stg.mts` (run 498's drafts, full-run steps 74–78) and `C368156-pins-loc-stg.mts` write one flat object to `<script>.json` / `C368156-b40.json`, not `{ "<C-id>": {...} }`, so `judge_pack.py` finds no readings for the case and the step watcher says "tests=0". Wrap first: `python3 -c "import json;o=json.load(open('X.stepN.json'));json.dump({'C614714':o},open('X.stepNw.json','w'),indent=1)"`, then `judge_pack.py X.stepNw.json C614714`.
#run498 #judging #tooling → L0533

## L0535 — 2026-10-22 — A production failure that matches a known ticket: post Failed with that ticket, no new ask
- C368152 (keyboard reassign/unassign) failed on production at steps 8 and 12: the message is "Lead technician updated" / "Lead technician removed" with Close, not "<number> assigned to <technician>" / "<number> moved to Unassigned" with Undo (PRD v73 S4 message table, lines 525/990–994 of the 22 Oct read). `grep -n "Lead technician updated" build/wo-board-tech-view/PROJECT-STATE.md` found **SV-11524** at once (Bug under Fast Follow SV-11593; its description lists the Undo/message cases). Read live: Code Review → not shipped. So the result is Failed with `"ticket": "https://shopview.atlassian.net/browse/SV-11524 (…status…)"` + `"defects": ["SV-11524"]`; `push_results_to_run.py --allow-non-passed` then posts the follow-the-status comment and the title prefix itself. No new ticket, no ask.
- The push tool REFUSES a non-Passed result without a `"todo"` ("What needs to be done", Rule 7) — `post_verdicts.py` copies `todo` from the verdicts file, so put it there.
- Always check `custom_atmstatus` of a case before its title is prefixed (Rule 133/71): C368152 is 1 (not Automated), fine.
#run498 #production #known-ticket #push → L0529

## L0536 — 2026-10-22 — A script can be shorter than its case: count the steps before trusting a clean run
- C614719 ran clean on production ("tests=0 errors=0") yet only covered steps 1–7: steps 8–13 were added to the case on 20 Oct (Chris Ward, SV-11422 comment 79047) after the draft script was written on 16 Oct. The judge marked it Unsure. Now `C614719-stg.mts` makes technicians C (not pinned) and D and "ZZAUTOTEST C614719 Third Customer" with three Approved work orders led by C, narrows the window to 1024 px (steps 8–10, board sideways scroll and card fully on screen), shortens it to about 2.5 Tech View group headings (steps 11–13) and records the row/heading geometry.
- Check before queueing any script: number of steps in the LIVE case vs the `step N` markers in the script (`grep -c "step" <script>` against the pack's Steps list). A mismatch is a script to extend, never a verdict.
- Production Edit Staff Member: turning Time Clock off and pressing Save & Close left the window open, no message, record unchanged (C614714 step 2, one reading). `C614714-stg.mts` now records every non-GET call the save sends and its answer, so the second attempt tells "refused" from "never fired" before anything is called a product problem (Rule 104).
#run498 #production #script-vs-case → L0526, L0528

## L0537 — 2026-10-22 — Re-run queue on production: snapshot each entry's readings before the next one overwrites them
- `redo-one-1022.sh` writes the script's normal `<script>.json`, so a later queue entry for the same script (e.g. two `high2-batch` or `s11-fix3` lines) overwrites the earlier readings. `run498-2026-10-08/redo3-pack-1022.sh` copies each finished entry's file to `<script>.redo3-<n>.json` and writes the judging packs for exactly the tests that entry ran; already-handled entries are listed in `evidence/prod-2026-10-22/redo3-packed.txt`. Run it on each queue EXIT, then judge in batches.
- Watching the queue: a `tail -F … | grep` Monitor delivered the full-run line but none of the queue's `EXIT` lines in 30 min; a 30-second polling loop over `grep -c '^EXIT'` (scratchpad `watch-redo2.sh`) works.
#run498 #production #queue #tooling → L0534

## L0538 — 2026-10-22 — On production "me" has TWO names: ME_NAME for the staff list, a shorter one as a work order's lead
- The production test admin's staff name is "Service Advisor No Reports (Admin)" (`ME_NAME`, profile meName), but a work order's lead reads first + last only: "Service Advisor No Reports". `s2-batchA.mts` C96937 compared the lead NAME with `ME_NAME`, decided the admin's own work order had a wrong lead and re-led it to Ralph, so the admin's group never appeared (judged Unsure). Compare a work order's lead by **id** (`techAssignedId ?? tech_assigned_id` vs `me.id`), never by name.
- Same batch: C96928 steps 9–10 on production now close every Work Orders tab (page to blank, fresh tab) and do a real Logout + sign-in form in that browser, instead of a second browser (which ends the first session).
#run498 #production #me #names → L0510-ish ME_NAME, L0529

## L0539 — 2026-10-22 — Production: renaming an account through account access ALSO renamed its staff record
- `seed-carol-prod-1022.mts` made staff "Carol Neal", switched into her account (`POST /api/switch-user`) and changed the account name to "David Sparks" (`/api/iam/change-name` 201). On staging that leaves the staff record "Carol Neal" and the account "David Sparks" (L0402, the state C707077 needs). On production the staff list then read **"David Sparks"** too, so `fixed-1021.mts` C707077 stopped with "Carol Neal not found (setup not done)".
- The seed now tries the other direction (staff record back to Carol Neal) and records `namesTied`. If production keeps one name for both, C707077's precondition cannot be built on production — an environment fact for the report, not a product fault and not "no data" (Rule 107: every route tried and named).
#run498 #production #staff #account → L0402

## L0540 — 2026-10-22 — A case's example record is staging-only; on production SEED it, don't scan for one
- C682440 / C682420 name S2-33351 (staging) as the work order whose status pill shows a red AND a blue count. On production the queue passed `WOB_PILL_WO=S1-1262` and the script's fallback scanned six List screens for any such work order: none — no readings at all. `c682439-440.mts` now seeds one when the scan finds nothing (playbook §Y "THE RED / BLUE NUMBERS": Line-1 authorized + a part request = blue, Line-2 "Authorization required" = red, then Approved → Ready For Review), records the counts read back, and uses its number.
- General rule for production re-runs: when a precondition names a specific record ("For example: S2-33351"), go straight to seeding a record with that STATE (Rule 107, 2026-10-01: "no data to judge" is banned) — a search of existing data is only a shortcut.
#run498 #production #seed #pill → L0431, L0536

## L0541 — 2026-10-22 — "Open the work order" is a step: open it from the List, never by its address
- Production re-run batch 21: six cases had every observed Expected met and were still judged Unsure, because the scripts opened the work order by its address (`/workorders/<id>/lines`) where the step says open it, or skipped a picture of the List. The judge's line (kept since batch 15): a step done by another route is not the step.
- Reusable route now in `high1-fix.mts` (`uiPage(w, lines?)`) and `s11-batch.mts` (`woPage(pg, w, pic)`): Work Orders > All > Search the work order NUMBER > click its row (3rd cell) > wait for `/workorders/<uuid>` > Escape (production's auto "New Line" window) > Lines tab when the step says so; a labelled address fallback only if the row is missing. Take a picture of the List before the click. `screenshot({path})` needs `.png` in the name or nothing is written (`woPage` lost two pictures that way).
#run498 #production #route #judging → L0530, L0526

## L0542 — 2026-10-22 — Production: the test admin cannot start account access through the screen
- Read-only probe (`impersonate-probe-prod-1022.mts`): `/impersonate-user/<user id>` answers 200 but lands on Work Orders as the admin with no "Account Access Mode" bar; Settings > Staff row offers only "1 Department" and the edit pencil, no account-access item. `POST /api/switch-user {user_id}` still works behind the screen (viewAs, seeds). So cases whose STEPS start/exit account access on screen (C368238, C368239) cannot run with the production test account as it stands.
- Next route queued: `role-access-probe-1022.mts` (read only) lists the test admin role's permission codes vs the built-in Admin role's, filtered for impersonation/account/switch, before any role is changed (Rule 107 allows the change; Rule 118 for anything measured on that role).
#run498 #production #account-access → L0539

## L0543 — 2026-10-22 — Open-from-list helpers must switch to List first: the saved display may be Tech View
- C368173 (`high1-fix5.mts`) searched for its work order on Work Orders > All and clicked "the row" — but the account's saved display was Tech View (left by an earlier test), whose rows are not `tbody tr` of the List, so no row was found and the script fell back to the address (judged Unsure). Every open-from-list helper (`uiOpen` in high1-fix5 / editwo-fix, `uiPage` in high1-fix, `woPage` in s11-batch) now calls `display(p, 'List')` after the All tab and before the search.
- Judging note for the report: an analogy to one of the QA lead's decisions (C368233 "production compared with itself") is NOT his decision for sister cases C368234/C368235 — those are held and asked.
#run498 #production #route #display → L0541
- **L0539 settled (22 Oct 22:20 UTC):** both directions read back on production — account renamed → staff record follows; staff record renamed → account follows (`seed-carol-prod-1022.json` `namesTied: yes`). Production keeps ONE name for a staff record and its sign-in account. C707077 (needs the two to differ) posted **Blocked** on production with that proof (environment limit, Rule 107 test passed: no permission or data would change it).

## L0544 — 2026-10-22 — Production filter defaults and left-menu links: two more traps
- **Report Location filter starts with ALL locations ticked on production** (Work In Progress, Sales By Representative), while the cases (written on staging) say "the first location is the only one ticked by default". A "tick the second as well" step then UNticks it. `medium-fix3.mts keepAfterReload` now unticks the case's pick first (start state read back, picture `<C-id>-start-first-only.png`) and step 3 ticks it.
- **Left-menu links on Parts pages**: `p.locator('a, .q-item, …').filter({hasText}).first()` picked a hidden copy and timed out, so the script fell back to the address (judged route-only Unsure, C368218/C368219/C368223). Use `:visible` on every candidate (`a:visible, .q-item:visible, …`).
#run498 #production #filters #route → L0541, L0543
