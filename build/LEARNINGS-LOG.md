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

## L0421 — 2026-10-17 — Reconciling against a moved PRD: diff the two versions by requirement id, not the old extract
- **What happened:** four run-498 problems (staging v26.40.19-1493c63) were reconciled against the live PRD 845185030. The live page was
  **v64**; our last saved text was v58 (16 Oct). Re-fetch the old version with `/wiki/rest/api/content/<id>?status=historical&version=<N>&expand=body.storage,version`,
  strip both the same way, then diff by requirement id (`S2-R23`, `S11-R1` …) — the precedent's saved text was stripped differently, so a plain
  diff against it is noise. `/wiki/rest/api/content/<id>/version?limit=10` lists each version's message (who, when, why). Both work with `jira.sh`'s cookie.
- **"Cells follow the design:" with a colon is not a blanket rule.** S2-R20 names three cells after the colon, and the PO's own ticket under it
  (SV-11325) restyled exactly those three; so Total price alignment (C590114) is design-only, the same class as C590117's count tooltip (L0403) — not filed, QA lead decides.
- **A tooltip requirement with no input method named (S4-N6) is broken when keyboard focus reaches the item and nothing shows** (C97020): prove it with
  the mouse-hover control on the same item (C590121) and state the reading risk in the draft (S11-R2 spells out keyboard parity only for avatar names).
- **"Clear all filters" and the search box:** the PRD keeps search apart from filters (S1-N1a "with or without a search"), and the QA lead ruled on 9 Oct
  that a search is not a filter (L0301). A case expecting the search emptied has no source; the deciding check is what List's own Clear all filters does (S1-N1 "same action").
- Files: `build/wo-board-tech-view/run498-2026-10-08/source-verify-2026-10-17/` (PRD v64 text, RECONCILE-4.md); draft `defect-drafts/tickets/D-C97020-2026-10-17.wiki`; D-C590122 closed. #prd #reconcile #rule106 → L0403, L0301

## L0422 — 2026-10-17 — A fix-up queue reads its list ONCE at start: lines added later need their own round
`run-fixup-1017.sh` does `grep -v '^#' "$ORDER_FILE" | while read …`, so the whole list is read the moment it starts. Script faults found by the judge AFTER that (run 498's new cases C614714/15/17/19, judged 05:0x UTC, fix-up 2 started 04:57) are NOT picked up by appending to `fixup-1017.txt`. Put them in a NEW list (`fixup-1017c.txt`) run by a COPY of the runner with its own log folder (`logs-fixup-1017c`, so step numbers that restart at 1 never overwrite round 2's logs), chained by a waiter on `[r]un-fixup-1017\.sh` (escape the dot so it does not match the copy). Never edit a runner script while it is executing: bash reads scripts as it goes.

## L0423 — 2026-10-17 — The auto-commit loop dies with the run it watches: start one for each follow-on round
`autocommit-1016.sh` stops once `run-full-1016.sh` ends, so the fix-up rounds chained after it (run 498, from 04:57 UTC) had NO automatic checkpoints; evidence piled up uncommitted until a Stop hook caught it. For each chained round start its own loop that watches THAT round and its waiter — `autocommit-1017.sh` (`[r]un-fixup-1017|[a]fter-fixup-1017`). And add only `evidence/`, never the whole run folder, so a helper's half-edited `.mts` is never swept into a checkpoint (L0415).

## L0424 — 2026-10-17 — Ruling: a waiting test whose ticket reads "Testing Stage" is re-tested at once
QA lead, 17 Oct: a Failed/Blocked/Retest test whose comment says to wait for a ticket must be tested again as soon as that ticket shows **Testing Stage**, and the result pushed — never wait for the ticket to be marked passed. How: page `get_tests/<run>` (tr_client `get()` returns `(status, body)`), read each non-passed test's last 5 results' comment + Defects, collect `SV-\d{4,5}`, read each key's status live with `build/atlassian-login/jira.sh GET /rest/api/3/issue/<KEY>?fields=status`, and queue every test whose ticket is TESTING STAGE that was not already re-tested on the current build. Do this scan at the START of every execution pass and again before the final report. Ruling recorded in `build/wo-board-tech-view/PROJECT-STATE.md` (2026-10-17).

## L0425 — 2026-10-17 — A sign-out step replaced by "a new browser" is not observed: never Passed, run it for real LAST
In run 498 three cases have a log-out / log-in step (C96975 steps 16–18, C96928 step 10, C96989). Scripts replaced it with a fresh browser loaded with the saved sign-in, because a real log-out ends the ONE shared staging sign-in mid-queue (L0394). C96989 was nevertheless posted **Passed** — wrong (Rule 12): it was corrected to Blocked. Rule: (1) a script that substitutes a step must say so in its output (`substituted: true`), and the judge never passes a case with a substituted step; (2) collect every such case into ONE end-of-run sign-out batch (`signout-1017.txt`, chained after the last fix-up round) that does the real log-out, signs back in, reads the case's after-login expectations, and ends with the sign-out case itself (C368240).

## L0426 — 2026-10-17 — Staging: a test customer marked "Over Limit" cannot be invoiced — seed one that can
Run 498 C368167 needed an Invoiced work order. Create Invoice was pressed, but after a reload the work order still read Complete with an **"Over Limit"** mark and Create Invoice was still offered: the test customer's credit limit was exceeded by the many ZZAUTOTEST work orders piled on it. Before any step that needs Invoiced/Paid, use (or seed) a customer with no credit limit or room under it, and read the status back from the server BEFORE the step that depends on it; otherwise the "refusal" being tested is never reached and the case is void (Blocked, not Failed).
- **Correction to L0426 (same day, from the 17 Oct evidence):** C368167's work order DID invoice (picture C368167-tab2-invoice: INV-S2-37056; server read "Invoiced"). The stale tab 1 then changed the lead with no error and the server lead changed; only after the reload did the page show Complete + "Over Limit" + Create Invoice again. So "Over Limit" did not stop the invoice — the invoiced state appears to have been undone after the lead change. That is a possible PRODUCT finding, not a void reading; round 3 re-runs it with the credit limit raised and the status read at every step before anything is said. The rule in L0426 (read the status back before the dependent step) stands.

## L0427 — 2026-10-17 — "Is a step stuck?" — read the newest evidence file's time, not the step's log
At the 06:35 check-in, fix-up 2 step 23 (s4-batchG, C96963) had run 11 minutes and its `.log` had not been written for 6. The step was NOT stuck: `ls -t --time-style=+%T -l evidence/staging-full-2026-10-14/ | head` showed pictures saved a minute earlier (C96963-TV-W6-back-after.png). Batch scripts log one line per CASE, not per action, so a long case looks silent in its log. Judge liveness by the newest evidence file (and the running `node … <script>.mts` in `ps`), and only intervene if both are silent past the step's own `timeout` (wob-run.sh: 3600 s).

## L0428 — 2026-10-17 — Rule 115's "two attempts" is about keeping flaky SPECS, never about leaving a test unjudged
In run 498 I told the judge that a case failing twice from a script fault "becomes a hand check" (citing Rule 115), and two cases (C96963, C368212) were posted Blocked with manual-tester steps. That was a misreading: Rule 115 says a flaky *spec* is deleted after two attempts rather than nursed; it does not let an execution pass park a test. Rule 107 governs execution: unblock ourselves. Right move after a second script fault: write a small FOCUSED script for only the unseen check, built from helpers proven working that same day (e.g. the location switch ensure-heavy uses, the in-column reorder that worked), and queue it in the next round.

## L0429 — 2026-10-17 — A waiter that greps `ps` for a script NAME is fooled by any shell whose text holds that name
Round 3 of run 498 (after-fixup-1017c.sh, `while ps -eo args | grep -q "[r]un-fixup-1017\.sh"`) did not start when fix-up 2 ended at 07:32: a leftover tool shell (pid 7877) whose command line was the heredoc that WROTE autocommit-1017.sh — with "run-fixup-1017.sh" in its comment — still matched. The sign-out waiter was exposed the same way (shell 13051 held "after-fixup-1017c" in its text). Killing the two stale parent shells (`kill -9`; the setsid'd children survived, reparented to 1) let round 3 start at 07:38. Next time: wait on a PID (`while kill -0 "$PID"`), or match the interpreter + exact path (`pgrep -f "^/bin/bash \./run-fixup-1017\.sh"`), never a bare name; and when a chained step "should have started", check `ps -eo pid,args | grep <name>` for impostors first.

## L0430 — 2026-10-17 — Staging Board View has ~280 technician columns: never "walk" to a far column — narrow the board first
Run 498 C614711: the "Deleted technician" column was column 279 of 280; a held card walked 80 moves (scrollLeft 15,600) and was released short of it. C97003: centring one column header (scrollLeft 59,832) pushed the drop target off screen. Tech View likewise renders only the groups near the screen (C614711 step 7: not among the 35 loaded groups; C97003: Ben's group handle not rendered). For any drag between technicians on staging: make BOTH ends render on screen first — search to the case's own work orders (only those technicians' columns stay meaningful), or pin the target next to the source — and check both bounding boxes are inside the viewport before pressing. Also: a drop at `rowBottom + 6` lands under the NEXT group's header and reassigns the work order (C590116) — drop between two rows' centres of the same group and check `elementFromPoint` first.

## L0431 — 2026-10-17 — A status pill's RED number = lines in "Needs Approval"; read the app's own public code when no recipe exists
- **Red number on List's status pill** (and Tech View's, which is the same pill) is the list answer's `serviceActionsCount`, tooltip
  `"<n> Line(s) in Auth Req'd"`: the count of the work order's lines in the line status **Needs Approval** (`authorization_required`).
  Seed it with the app's own add-line call: `POST /api/work-orders/{wo}/lines/create-from-canned-line {canned_line_id, status:
  'authorization_required'}` (fallback `POST /api/work-orders/lines/change-status {line_id, status}`), then read `serviceActionsCount`
  back before comparing. Blue number = parts actions (`statusRequestedCount` / `statusAuthToOrderCount` / `statusInStock`; a part request
  → "1 Part Ready to Order"). C590115's preconditions name only the approved line with a part request (blue only) — reported, not edited.
  Supersedes L0409's "no seed recipe" for the red count. Script: `run498-2026-10-08/design-r4.mts` (`redLine()`).
- **When no recipe says what drives a screen element, read the build's own code without touching the session:** the staging app's JS
  chunks are public static files — `curl https://app.staging.shopview.com/` → the `/js/index.*.js` names → download the chunks it lists into
  a scratch folder and `grep` the tooltip text (here `Ready to Order` → `WorkOrders.*.js` → `serviceActionsCount` → `Ga=e=>…Auth Req'd`).
  No cookie, no browser, no app session used (safe while a queue holds the one SSO session, L0394).
- **Round 4 focused scripts** (each queued alone with ONLY=<id> in `fixup-1017d.txt`, run by `after-round4-1017.sh` after round 3 and
  before the sign-out batch): `design-r4.mts` (C590115 red + blue; C590116 drop inside the group, elementFromPoint checked first),
  `kbd-r4.mts` (C368151 every key logged, lost focus recorded and re-entered by Search > Tab, Technician-A put after Unassigned by the
  saved `technicianOrder`; C97020 Admin pinned, card read back before keys, disabled item's note on keyboard vs hover), `s9-r4.mts`
  (C97003 left column put right of the sticky Unassigned and the window widened until the right one is on screen; Tech View searched from
  the TOP), `C614711-r4.mts` (board scrolled to its END: the last column and the sticky Unassigned are both on screen). Each copies the
  proven prologue of its parent script byte-for-byte and writes its own `<name>-<ONLY>.json`, so two ONLY runs never overwrite each other.
  #wo-board #scripts #status-pill → L0409, L0430

## L0432 — 2026-10-17 — A script that "fixes" a step behind the screen can hide the very finding the case exists for
Run 498 round 3: two scripts quietly finished a step the screen did not complete — C614714 switched Time Clock off by API after Save & Close left the Edit Staff Member window open; C368131 removed Theresa's enrolment by API after changing her Location on screen left her still offered at Heavy Duty. Both cases then "matched", but the step they changed is exactly where a product fault (or a case gap) would show. Rule: a behind-the-screen fallback is allowed ONLY to build a precondition (Rule 107/14), never to complete a step the case tells the user to do on screen; when the screen does not do what the step says, RECORD that as the reading (with a positive control on another record to separate script fault from product), and judge it — never paper over it.

## L0433 — 2026-10-17 — Staff window "stays open after Save & Close": first suspect the hidden window in front, not the product
- `C614714-stg.mts` pressed `.q-dialog:visible >> button "Save & Close"` with `.catch(() => {})`; staffloc.mts already records that a HIDDEN
  `.q-dialog` sits in front of the open Edit Staff Member window, so that click can fail silently and read as "the window stayed open, no
  error". Take the VISIBLE button (`button:visible` filtered by its words), keep the click's own result, log the staff/iam requests the page
  sends, and run a positive control (a harmless change on another ZZAUTOTEST record through the same window) before calling it a product
  fault. Round 4 script: `run498-2026-10-08/C614714-r4.mts`.
- Round 4 also re-runs C368136 (`s4-r4.mts`: Tech View drags walk the table from the TOP until the target group is drawn, row held while
  scrolling if needed), C96916 (`s1-r4.mts`: a CASE row brought to the top, number link clicked in place) and C368131 (`moved-r4.mts`:
  step 3 through the screen only — no enrolment removed behind it; if Location alone leaves her offered, that IS the reading).
  #wo-board #scripts #staff → L0430, L0431

## L0434 — 2026-10-17 — A "container was restarted" notice can mean only the SESSION WORKER restarted: check `ps` before restarting anything
At 08:24 UTC the harness reported a restart and listed my background WAIT commands and the judge helper as stopped. But the staging runners started with `setsid nohup` (run-fixup-1017c.sh, after-round4-1017.sh, autocommit-*.sh) and the Atlassian relay (bridge.mjs) were all still alive — round 3 carried on at step 15. Only a git commit in flight was cut (exit 137; its staged files were still staged). After such a notice: (1) `ps -eo args | grep -E "run-fixup|after-|autocommit|bridge"` and the queue logs; (2) if they live, restart NOTHING — just re-create the lost wait commands, finish the cut commit, and resume the helper telling it to check what it already posted (no double posts); (3) only if `ps` is empty, restart the relay first, then resume the queue with `FROM=<n>`.

## L0435 — 2026-10-17 — Staging traps from round 3: a no-line work order opens "New Line" over its page; the Schedule search narrows only the left list
- Opening a work order that has **no lines** shows a **New Line** window over the page. Anything on the page (Lead Technician field, status card) is behind it, and selectors hit the wrong control (C96936 matched `button_toggle_vehicle_here`; C614714 step 8 found no field). Close it with its X and answer "Are you sure you want to close this dialog?" before touching the page — or give the work order a line in set-up.
- The **Schedule search box** filters only the work-order list on the left; it does not narrow the calendar to that work order's technician. To read a technician's shifts on screen, open the Schedule on the right day and scroll the resource list to that technician's ROW (C581892 step 14 opened 6 of 286 events and never reached Esther Howard's row).
- Dashboard "View details" tables: a reader keyed to one table selector counted 0 rows while the pictures showed full tables — read rows by role=row / tr / repeated row elements and log which selector matched.

## L0436 — 2026-10-17 — Moving the sign-out batch behind a new round: stop the PARENT waiter only; its running child survives
- Round 5 of run 498 had to go before the sign-out batch, which `after-round4-1017.sh` (pid 4795) would start after round 4. `kill 4795`
  (plain SIGTERM to the waiter's pid only) left its running child `run-fixup-1017d.sh` alive, re-parented to pid 1: the child wrote to a
  log FILE (no pipe to break) and the waiter was started with `setsid nohup` (no terminal, so no hang-up signal to the group). Checked with
  `ps -eo pid,ppid,pgid,etime,args` before and after. `after-round5-1017.sh` then waits for `^/bin/bash \./run-fixup-1017d\.sh` (L0429),
  runs `run-fixup-1017e.sh`, then `run-signout-1017.sh` LAST. Never kill the process GROUP (`kill -- -4795`): that takes the round down too.
- Round 5 scripts: `sched-r5.mts` (C581892 step 14 read in Esther Howard's Schedule ROW: `.fc-datagrid-body .fc-datagrid-cell-cushion`
  starting "Esther Howard", resource list scrolled until drawn, blocks in the same vertical band), `dash-r5.mts` (C368246: the opened
  area is the ancestor that GREW after "View details", rows tried by several selectors and the hit logged), `s2-r5.mts` (C96936: close the
  New Line window before looking for Lead Technician, by its label), `C96963-tech-reorder.mts` (Tech View Unassigned reorder by the row's
  grip cell), `invoice-r5.mts` (C368167: positive control for Create Invoice on a new plain work order before the case).
  #wo-board #queues #scripts → L0429, L0430

## L0437 — 2026-10-17 — Two helpers adding learnings at once collide on the NUMBER: read the last number right before writing
Twice in one morning a helper and the main session both appended "## L0432" / "## L0433" within minutes (run 498 rounds 4–5); the self-test does not catch duplicate L-numbers in the index file. Before appending: `grep -o "^## L0[0-9]*" build/LEARNINGS-LOG.md | tail -1` and use the next; after a pull/rebase that brings in another session's entry, re-check and renumber (`sed -i '<line>s/^## L0NNN — /## L0MMM — /'`) before pushing. Tell every helper the same in its brief.

## L0438 — 2026-10-17 — After three blind script fixes fail, stop queuing and debug LIVE — hold the sign-out batch to keep the session for it
Run 498: four cases (C97003, C614714, C96916 Tech View half, C581892 step 14) failed three automated rounds each, every fix written blind from logs while the queue owned the one shared staging sign-in. Each new round cost ~1 h and found the next wrong selector. Better: once the queues end, HOLD the sign-out batch behind a go-file (`after-round5b-1017.sh` waits for `logs-signout-1017/GO`), give one helper the free session to probe each case live (dump the real markup, try the scroll/click, read it back), fix, run once, and only then release the sign-out batch with `touch .../GO`. Rule of thumb: two blind fixes, then go live.

## L0439 — 2026-10-17 — Staging: closing "New Customer Payment" with X after Create Invoice UNDOES the invoice
Run 498 round 5 (invoice-r5.mts, positive control on a plain work order S2-37110, credit limit raised): Create Invoice → `POST /api/invoices/create` 201,
and ~10 s later the work order reads Invoiced (invoice id, status pending). Closing the New Customer Payment window with its X then sends
`POST /api/invoices/remove-customer-transaction` 200 and the work order goes back to Complete with Create invoice offered again (also after a reload).
So a case step "Create Invoice, close the payment window without paying" never leaves a work order Invoiced on staging (C368167 Blocked on it;
put to the QA lead whether that is intended). To get an Invoiced work order through the screen, do not close the payment window with X — find
another route (e.g. a payment) and read the status back. Evidence: `evidence/staging-full-2026-10-14/invoice-r5-C368167.json` (control.invoice).
#wo-board #staging #invoice #precondition → L0426

## L0440 — 2026-10-17 — Staging live probes: the selectors that worked for six stubborn run 498 cases
- **Edit Staff Member window** (probe-staff-window.json): Save & Close is `[data-test-id="button_save_staff"]` — its own text is
  "Save & close" (capitalised by CSS) and aria-label "Save and close", so `hasText: /^Save & Close$/` finds NOTHING; fields by test id
  (`input_job_title` — label "Job title", `select_role`, `select_location`), switches `toggle_time_clock` / `toggle_sales_rep`.
- **Work order page Lead Technician is read-only (`lead_technician_readonly`) while the work order has NO lines**, and a New Line window
  opens over the page. Give the work order one line in SET-UP (create-from-canned-line) and `select_lead_technician` appears (C614714,
  C96936). Typing into it does not filter the list (still ~100 names, SV-11393): Ralph Edwards stays unreachable on that page.
- **Tech View rows**: `[data-test-id^="tech_view_row_"]` also matches `tech_view_row_drag_handle_<id>`, `tech_view_row_number_link_<id>`,
  `tech_view_row_progress_<id>` — filter to `/^tech_view_row_[0-9a-f-]{36}$/`. The number link is `tech_view_row_number_link_<id>`
  (`<a href="/workorders/<id>">`); clicking it opens the work order.
- **Schedule people column**: cells `.fc-datagrid-body .fc-datagrid-cell-cushion` read "EH\nEsther Howard\nNot working" — initials FIRST,
  so match the name as its own line; all ~296 people are in the DOM and two `.fc-scroller` elements scroll together (a mouse wheel over
  the column moves both). A crowded row (15+ stacked blocks from earlier runs) hides this run's blocks: clear that technician's shifts on
  the day in set-up (`DELETE /api/schedule/shifts/{id}?scope=shift`), then every block in her row is the case's.
- **Board View far columns**: put the column you need just right of the sticky Unassigned column (scrollLeft += header.x − (unassigned.right
  + 24)); never measure "the first technician" instead (C97003 step 7 placed column 1 of 281, ~196 away).
- **Invoiced state on staging**: Create Invoice reads Invoiced on the server after ~6 s while the New Customer Payment window is open;
  closing that window with its X calls `/api/invoices/remove-customer-transaction` and the work order goes back to Complete. Leave the
  window open (or record the payment) to keep the locked state (C368167).
  #wo-board #staging #selectors → L0430, L0432

## L0441 — 2026-10-17 — On staging a REAL app log-out + quick-login sign-in did NOT end the shared Google sign-in
Run 498's end-of-run sign-out batch (signout-1017.mts, from 10:42 UTC) logged out through initials > Logout and signed back in with the Admin quick-login three times in a row (C96989, C97005, …) and the next steps' location checks still passed — the `sv_sso_session` Google sign-in survived. So L0410's fear ("a real log-out may end the Google sign-in") did not happen on staging today; a sign-out batch can be run mid-pass if needed, but keep it last anyway until it has proved itself across several days. Also from this stretch: the app user's SAVED DISPLAY is shared by every session using that user, so a "Back lands in List" reading on the shared admin cannot be blamed on the product (C96916) — use a test user no other session uses for any display/preference check.

## L0442 — 2026-10-17 — A per-user check needs a user nobody else uses; a fresh user cannot be signed in for real on staging
- The Admin's saved Work Orders choices are shared with every session using that account, so "the display after Back" read List in one run
  and Board/Tech View in another (C96916). As a DEDICATED Admin-role test user ("ZZAUTOTEST C96916 Back Tester", switch-user + viewAs, as
  runner.mts) Back restored Board View and Tech View, same top card/row (`s1-r6.mts`). Use a dedicated user for any per-user preference check.
- A brand-new staff user has no password until it accepts the invitation e-mail (unreadable @staging.shopview.local; the staff window offers
  only "Resend Invitation"). For "sign in as a user who never chose a display" (C96912 step 7) the route is switch-user to a fresh ZZAUTOTEST
  user, its saved preference read empty FIRST, then the screen (List) — and the reading must say it was switch-user, not a sign-in
  (`c96912-fresh.mts`).
- Production (second account, prod-login-boot.mjs): a REAL log-out (initials > Logout -> /login) and the app's own Email/Password form work
  in one run; List's Column Selection is `button_column_selection` with `toggle_column_<key>` items (`prod-c96975.mts`). Production v26.40.19
  KEPT Progress off across log-out/log-in (C96975, Rule 121).
  #wo-board #staging #production → L0410, L0440

## L0443 — 2026-10-17 — A held (no-ticket) Failed result must carry NO browse/ link: push_results_to_run.py treats any link as the defect
Run 498, C96975: the "ticket" text of a ticket_held Failed result named the owning story with its full link (…/browse/SV-10048). The tool
read that link as the defect: it filled the result's defects field with SV-10048 and posted a separate "Follow the status here SV-10048"
comment (Rule 123), wrongly presenting the STORY as the ticket. Fixed by posting a corrected Failed result whose ticket line names the
story without a link. Rule: in a ticket_held result write the owning story as plain text ("Owning story: SV-10048, Ready for QA"), never as a
browse/ URL; only a real defect ticket gets a link. #testrail #push-results #rule-123 → L0425

## L0444 — 2026-10-17 — Staging: the "ZZBREAK…" customer sorts first because its name starts with two spaces — it is another tester's edge-case record, leave it
Customer id 70ccb9ae-a766-4572-a083-3fcf2a718a15, raw name `"  ZZBREAK <b>bold</b> \"q\" & 'x' Superlong…"` (135 chars, two leading U+0020, HTML/quotes/ampersand/long word on purpose), created 16 Oct, 6 work orders; nothing in this repo creates it. Any "Customer A–Z" check on staging will see it FIRST — that is correct ordering of the saved name, not a sort fault (C368209, C368245 passed on that basis). Do not rename or delete it (it is someone else's overflow/escaping test); name it in the result instead. Probe: `run498-2026-10-08/probe-zzbreak.mts`.

## L0445 — 2026-10-19 — Rule 131 in practice: an "Obsolete" ticket can mean three different things — read WHY before judging
Run 498, 19 Oct: three tickets read OBSOLETE, each for a different reason: (1) SV-11393 — Chris moved the bug to a new standalone ticket (SV-11429, Open): still a bug, re-link the tests; (2) SV-11101/SV-11312 — a developer closed it "works as specified", backed by the PO's own PRD change-log line (v53, 15 Oct: "S9-R14 confirmed as written") — the PRD, not the developer, made it a pass after a re-test; (3) SV-11396 — Chris closed it as "not a defect", backed by the PRD's §9 User Feedback Summary ("Success toast, auto-fades") — pass after a re-test. Always read the closing comment AND the PRD change log (search the live PRD text for the requirement id near a "20YY-MM-DD Chris Ward" entry) before re-failing. Also: the PRD's change log lives inside the page body, so one live REST read (`/wiki/rest/api/content/845185030?expand=body.storage,version` via jira.sh) answers both "what does it say" and "when did it change". Facts: staging build moved to v26.40.19-31ad1e1 by 19 Oct; the new container needed `bridge.mjs` restarted before the browser could reach staging (ERR_PROXY_CONNECTION_FAILED).

## L0446 — 2026-10-19 — Ruling: every test case named to the QA lead carries its test-in-run link
QA lead, 19 Oct: *"Whenever you give me the reference of a test case always give that reference with the link to access the test case RUN for that test."* Recorded as a Rule 8 amendment. How: `tr_client.get(f"get_tests/{run}&limit=250&offset=…")` (returns `(status, body)`; page by 250) gives `case_id → id`; the link is `https://shopview.testrail.io/index.php?/tests/view/<id>`. Run 498 examples: C96929 → tests/view/3481873, C590130 → tests/view/3995739.

## L0447 — 2026-10-19 — Updating a case to a new PRD (Rule 131 + 114(c)): safe_case_edit.py, then BOTH render checks; check_case_render flags pre-existing <strong>
Run 498, C96929 and C590130 rewritten on the QA lead's yes: build the new title/preconds/expected as block HTML (<p>, <ul><li>, <hr />, entities;
no <br>, no new inline tags), changing ONLY the lines the new PRD changes (precondition lines are replaced/added/removed by exact string, the rest
is re-sent byte-identical); write with `build/testing-tools/safe_case_edit.py <id> <new.json>` (snapshot + history, read-back, untouched-fields
and automation-flag checks, write-log.jsonl); then run `check_case_render.py` AND the served-page scan
(`build/inline-add-edit-parts/build-verify-2026-09-01/tools/served_page_scan.mjs`, OUT=<folder> IDFILE=<json list>). check_case_render
FAILS on the <strong> headers that the suite's precondition fields already carried; the served page showed them rendered in `markdown fr-view`
before and after, so that flag is pre-existing, not introduced — report it, do not "fix" unchanged lines. If the scan dies with
ERR_PROXY_CONNECTION_FAILED, run `build/testing-tools/ensure_bridge.sh` first. Folder: run498-2026-10-08/case-updates-2026-10-19/.
#testrail #case-edit #rule-131 #render → L0441

## L0448 — 2026-10-19 — QA lead ruling: a bug that is the same on production is kept as RETEST in the feature run, not Failed
Run 498: the five tests blocked by the technician-list cut-off (C97007, C368159, C368173, C368169, C368171; bug SV-11429, same on production) were set to **Retest** by the QA lead and he confirmed: *"Move them to retest — I want to keep these cases separate for now because the behavior is same on production."* So when a feature-run test fails only on a bug that production also has and that has been re-homed outside the feature (Rule 121's spirit), do NOT re-post it as Failed over his Retest; leave/put it at Retest with a plain comment naming the tracking ticket. Before overwriting any status someone else set on our shared TestRail account, read who/when and ask (I overwrote three of his Retests with Failed this morning).

## L0449 — 2026-10-19 — Re-checking a held keyboard ticket: use kbd-r4.mts (it has a positive control), not kbd-fix4.mts; read the build with the existing build-marker.mts
Run 498, 19 Oct, before filing the approved C97020 ticket: `ONLY=C97020 ./wob-run.sh kbd-fix4.mts` on today's data put the keyboard on the first technician column's header and pin (Esther Howard), never on the Invoiced card, so its step 11/12 reading (`noteShown:false`) proved nothing — the menu never opened. `ONLY=C97020 ./wob-run.sh kbd-r4.mts` pins Technician-A, reads Work-order-2's card back first (positive control) and opened the menu: keyboard highlight → no visible note (text only in aria-describedby), mouse hover → note shown. Use kbd-r4 for C97020 re-checks. Also: `run498-2026-10-08/build-marker.mts` already exists (reads `/api/version` + `<meta name="app-version">`); I overwrote it with a weaker copy before reading it and had to restore it from git — `ls`/`git show` before writing any script name. A new container still needs `bash build/testing-tools/ensure_bridge.sh` before the first browser script (ERR_PROXY_CONNECTION_FAILED otherwise).
#keyboard #run498 #recheck #positive-control #tooling → L0448

## L0450 — 2026-10-19 — Design-based tickets for WO Board: where the design facts live, the off-screen trap, and two Jira formatting traps
- **Test-in-run links are read live, never recalled.** I gave the QA lead C96929's run link as `/tests/view/3481910` from memory; the live `get_tests/498` (paged) says **3481873**. Read the test id from the run every time (Rule 100, Rule 8 amendment).
- **The 14 Oct design export is not on this branch.** Its facts are in commit `23ab6f695` (branch `claude/slack-session-setup-7v5itm`, facts only, Rule 119): `build/wo-board-tech-view/design-look-2026-10-14/VISUAL-INVENTORY-ROWS-2026-10-14.md` — read with `git show 23ab6f695:<path> | grep`. Tech View Total price = V0753/V0754 `align: right`; Tech View group count tooltip = V0929 state `tech-group-count-tooltip`, opens **above**, covers no header. The cases' attached pictures DC-05 and DC-08 are the **same file** (identical md5) and show neither Total price nor the tooltip — never judge from them alone.
- **design-stg5.mts reads C590114's Total price off-screen** (cell x 1723 in a 1440/1600 window), so its picture never shows the column. `run498-2026-10-08/c590114-total-pic.mts` scrolls `.q-table__middle` right, reads heading/amount boxes on screen and takes the picture (no search: pinned empty groups fill the screen when searching).
- **Jira:** the text `(-)` renders as a "forbidden" emoticon in the legacy rendered view, but the stored description (ADF) keeps it as plain text — check `/rest/api/3/issue/<KEY>?fields=description` before "fixing" it. `{quote}` inside a bullet item does not make a quote box (wiki has no block inside a list item) — the quote text is kept verbatim as a plain line; this is true of every ticket we filed (SV-11398, SV-11498–SV-11501). `{noformat}` does make a box.
#design #jira #run498 #tooling → L0449

## L0451 — 2026-10-19 — Work Orders List: the Status filter exists on the All tab ONLY — on staging AND production
Read 19 Oct 2026 with `run498-2026-10-08/tabs-status-filter.mts` (staging `v26.40.19-e435950`, production `v26.40.19-d2441a9`, positive control = Status chip on All): All tab = Status, Assigned to me, Asset on Site; Estimates / Work Orders / Completed tabs = Assigned to me, Asset on Site only. So any case whose start state is "Work Orders tab with Status: Approved" (C96916, C368214) asks for a state the product has never had — it is a case problem, not a product fault. Run the probe for production with `ENV=prod` through `env -i … npx tsx` from `build/global-search/e2e` (it uses `prod-login-boot.mjs`). Also: staging moved from `31ad1e1` to `e435950` during 19 Oct — re-read the build marker before every verdict.
#run498 #filters #production #staging-build → L0450

## L0452 — 2026-10-19 — QA lead ruling: a test waiting on a feature that is not built yet goes to RETEST, with the ticket link
QA lead, 19 Oct 2026, on the Technician-filter tests (SV-11326 Open, not on staging): *"move these test cases to Retest and put the ticket links with the statement 'WIll be retested once {{Ticket link}} becomes dev completed and made available for the QA'"*. So a test blocked only because its feature is not built yet is **Retest**, not Blocked, with the comment "This test will be retested once <ticket link> (<title>) is development-complete and available for QA." plus the ticket's live status and what staging showed, and the ticket in the defects field. Posted directly with `tr_client.post('add_result/<test_id>', {status_id: 4, comment, defects})` (no picture needed for a Retest). Same family as L0448 (same-on-production bug → Retest).
#run498 #ruling #retest #testrail → L0448

## L0453 — 2026-10-19 — Three run 498 routes found while unblocking: staff enrolments screen, production undoes an invoice on X too, the Split route
- **Removing someone from a location is ENROLMENT, not the Location field.** The PRD's test is "enrolled at this location" (S3-R20b, Technician definition). The Edit Staff Member window's Location field only changes the default location; the person stays enrolled and stays a technician there. The app's screen for it (found by grepping the build's JS chunks — `probe-enrol-ui.mts`, search inside a string `page.evaluate` because tsx breaks arrow functions with `__name`): **Settings > Staff, the row's "Department(s)" button (`staff_departments_button`, reads "N Departments") opens "Manage staff enrollments"** (current enrolments + Select workplace / Select department + Enroll). Round `moved-r5.mts` (C368131).
- **Production also undoes an invoice when "New Customer Payment" is closed with X** (`prod-invoice-x.mts`, 19 Oct, v26.40.19-d2441a9, S2-981: Invoiced at 10 s → X → Complete, no invoice id). Same as staging (L0439) ⇒ product behaviour, not a staging fault; the C368167 step "close the window with X" can never leave it Invoiced.
- **C368145 "created with a lead"**: the New Work Order window offers only Customer and Asset, but the case itself allows the Split route; on 19 Oct the split-off work order kept its lead and took its customer-name place (`s9-batchA5.mts ONLY=C368145`).
- **Technician lists on the work order page** stop at "QA ServiceManager" (~98 of 282). Pick technicians that sort early (Aaron Baker = `zz.wob.aaron.baker@…`, search the staff API by ONE word — "Aaron Baker" as one term returns nothing) to do a lead change on screen (`s2-r6.mts`, C96936).
- `wob-run.sh` passes only its listed env vars (`env -i`): an extra variable such as TERM_Q never reaches the script. `pkill -f <name>` also kills the shell whose command line contains the same name.
#run498 #staff #enrolment #production #invoice #routes → L0452

## L0454 — 2026-10-19 — A brand-new staging user CAN sign in for real: public yopmail inbox + the staging gate cookie (supersedes L0442's "cannot")
- Create the staff member with a **public yopmail address** (`zzwob-<case>-<n>@yopmail.com`, `person()` in staff.mts). The invitation ("<Shop> has invited you to join them on ShopView", from noreply@shopview.com) arrives within seconds; read it in a bridged chromium at `https://yopmail.com/en/?login=<box>` (frames `ifinbox` / `ifmail`).
- The "Accept Invitation" link is **http://api.staging…/api/iam/confirm-invitation/redirect…** — change it to **https** (the bridge carries CONNECT only) and carry **only the staging gate cookie `sv_sso_session`** on app/api/auth.staging hosts (without it: `{"error":"sso_required"}`). It lands on `/confirm-invitation`: "Set credentials" with Email, Password, Repeat password and a button labelled **Login**.
- The staging **login form** is one page: Email + Password + **Login** (plus the Admin/Tech quick-login buttons). A form sign-in with the gate cookie and no app session is a REAL sign-in (`fe-permissions` 200). Scripts: `c96912-inbox.mts` (create + read inbox), `c96912-accept.mts` (accept + set password + prove sign-in), `c96912-full.mts` (the whole C96912 with two dedicated users, every sign-in real). Passwords only in `/tmp/qa-cookies/*.json` (chmod 600).
- Trap: `session.mts`'s `done(browser)` EXITS the process — in a script that continues after closing the admin session, call `browser.close()` instead.
#staging #sign-in #new-user #yopmail #run498 → L0442, L0453

## L0455 — 2026-10-19 — QA lead ruling: a test that only passes by a route its own step does not describe is PASSED and the step is reworded (his "A", three cases)
On 19 Oct he chose "pass it and change the step" for C368131 (location removal = enrolment screen), C368167 (leave the payment window open) and "pass it and change the names" for C96936 (Ralph Edwards → Aaron Baker, Expected included under 114(c) because he named it). Pattern: run the behaviour by the route that works, put the case to him with A = pass + reword (my pick) / B = keep blocked or Retest, and after his A: safe_case_edit.py only the lines that change, one dated decision line in the Expected for a name change, then the served-page scan. Trap: `safe_case_edit.py` refuses any field holding `<br>` — when the Expected must be re-sent and it carries a UI-made `<br>`, turn it into `</p><p>` (text unchanged) before sending. Folder `run498-2026-10-08/case-updates-2026-10-19b/`. C368167 and C96936 are Automated: tell Vlad.
#run498 #ruling #case-edit #testrail → L0447, L0453

## L0456 — 2026-10-19 — QA lead ruling: "always unblock yourself, never get stuck like this"
After I put the three analytics tests to him as a question (the build matched PRD v64 S2-R4 — Tech View 17 fields — and the cases' 15 came from a
developer comment), he named them and wrote: *"Please unblock yourself as you had done previously when marked the test as passed by fully
unblocking yourself and finding the ways for yourself and always unblock yourself never get stuck like this."* So when the reconciliation shows the
case is out of date and the build follows the CURRENT PRD, do not park the test as a question: verify against the live PRD, update the case to the
PRD (only the changing lines, one dated decision line, `safe_case_edit.py` + served-page scan), re-run on today's build, post Passed with pictures,
and REPORT what was done. Still never: Vladimir's cases, Automated cases without telling Vlad, Jira without per-ticket permission.
Applied: C97024, C97035, C368153 (case-updates-2026-10-19c/). Same family as Rule 107, Rule 131 and L0455.
#run498 #ruling #unblock #analytics → L0455

## L0457 — 2026-10-19 — QA lead ruling: a deleted lead's work order shows "Unassigned" in List — that is the expected behaviour
PRD v64 S3-R20e says "List shows the Lead Technician as blank for these work orders, as today", but production TODAY shows "Unassigned" (prod-deleted-lead.json: throwaway technician made lead of S2-968, deleted, List read "Unassigned"; lead restored) and staging the same. Put to the QA lead; he ruled 19 Oct: *"Unassigned if the expected behavior"*. C614711 step 8 now expects "Unassigned" with a dated decision line (case-updates-2026-10-19c/). The PRD wording ("blank") still disagrees — worth telling Chris.
#run498 #ruling #deleted-lead #prd-conflict → L0456

## L0458 — 2026-10-19 — Tech View scroll readings: read the SCREEN, not the first thead, and never let Playwright scroll a row in before clicking
s1-r7 reported C96916's Tech View "Back restores the top row" as passed, but its own pictures disagreed (before = empty groups at the top, the
reading said S2-36421). Three instrument faults, all mine: **(1)** Tech View is a Quasar virtual scroll (`.q-table__middle q-virtual-scroll`,
~28,000 px tall with ~280 technician groups) and `s.querySelector('thead')` returns a thead that SCROLLS AWAY — its bottom was ≈ −scrollTop,
so every "distance from the heading" was off by thousands of px (a wheel aimed with it overshot to 22,545). Use the heading band ON SCREEN:
the thead rects whose bottom > table top and top < table top + 120. **(2)** Matching work orders by `tr.innerText` also hits GROUP rows that
wrap their work orders — find rows by their number LINK (`a[data-test-id^="tech_view_row_number_link_"]`). **(3)** The fallback
`locator.click()` on an off-screen link makes Playwright scroll it into view FIRST, so "after Back" was compared with a position the click
itself had changed. Refuse the click unless `elementFromPoint` at the link's centre is the link. Fixed in `s1-r8.mts` (wheel scrolling like
a user, elementFromPoint screen reading, click-in-place only); it passed honestly: S2-36403 top before, one row off after, sideways exact.
Lesson: when a reading and its own picture disagree, the reading is void — look at the picture before judging (Rule 104).
#run498 #tech-view #virtual-scroll #instrument #rule104 → L0451, L0456

## L0459 — 2026-10-19 — QA lead: "if editing those test cases does not go against the specs/PRD then go ahead and edit them … easiest for the Manual QA tester"
Given for the four named blocked tests C96916, C368214, C97003, C590122 (114(c), named in conversation). Each change was first checked
against PRD v64: tab change (filter views and filter bar "apply the same way in every display option"; Status chip only on All, also on
production, L0451); C97003 step 11 compares with the order written down at step 8 (S9-R2 saved per user, S9-R8 Unassigned fixed);
C590122 step 8 "search stays" (PRD §9 User Feedback Summary: "Existing List empty state and clear-filter behavior in all display options").
Edited in `case-updates-2026-10-19d/` (old `<br>` converted to `<p>` blocks so `safe_case_edit.py` accepts them), served pages clean,
all four Passed with pictures. C368214 is Automated → tell Vlad.
#run498 #ruling #case-edit #114c → L0455, L0456

## L0460 — 2026-10-19 — Today's own mistakes, and the guard now in place for each
- **False pass from a reading its picture contradicted** (C96916 Tech View) → skill 19 §9.7: open the picture of every judged step before a Passed; click only what is on screen. Details L0458.
- **A test-in-run link given from memory was wrong** (C96929, L0450) → new `build/testing-tools/test_link.py <run> <C-ids…>` prints case link + `/tests/view/<id>` + live status, paged. Use it every time a link goes to him.
- **QA_DPR=2 was silently dropped on staging runs** (`wob-run.sh` runs `env -i`; the browser scale knob is `WOB_SCALE`) → `wob-run.sh` now passes `WOB_SCALE=${WOB_SCALE:-$QA_DPR}`; s1-r8 pictures were 1x because of it.
- **"Waiting on your yes" without saying what yes does** → skill 19 §9.8.
- **Overwrote `build-marker.mts` without reading it** (restored with git) → read a file before Write, always; check `ls` first when the name is generic.
- **Parked tests as a question when the build matched the latest PRD** → L0456 ("always unblock yourself").
#run498 #mistakes #guards #tooling → L0450, L0456, L0458

## L0461 — 2026-10-19 — Retesting cases updated in the last N hours: find them live; queue with ABSOLUTE paths; pkill -f again; a mid-run session_expired
- **Which tests need a retest after case edits:** for every test in the run, compare the case's `updated_on` with the test's newest result (`get_results/<test>&limit=1`); NEED = result older than the edit. Use `get_cases/<project>&suite_id=<s>&updated_after=<epoch>` (paged) to list the edited cases first. On 19 Oct this found 3 beyond the 3 he named: C614719 (preconditions rewritten by Vladimir 08:46/09:17, steps and Expected unchanged), C96953 (only the S3-E2 quote updated to v65), C682419 (new, untested).
- **run_queue.sh runs every line in ONE shell**: a relative `cd build/...` works for line 1 and fails for line 2 (already inside). Always `cd <absolute path> && ...` per line.
- **`pkill -f <pattern>` killed my own shell AGAIN** (exit 144) — L0453 already said so. Never pkill -f; list with `ps aux | grep <pat> | grep -v grep` and `kill <pid>`.
- **`switch 401 session_expired` mid-run** (moved-r5, 2 min in, 15:44): the Admin app session ended under the script. One Google sign-in holds one app session (L0394); another session signing in as Admin ends ours. Re-run; if it repeats, ask whether another session is on staging.
- **C682419 scroll bar:** the board's sideways bar is the browser's own, so its handle length is read from screen pixels (strip screenshot → canvas in the page → run of pixels differing from the track), with the board scrolled to the middle so both ends are track (`c682419-bar.mts`).
#run498 #retest #queue #pkill #session #scrollbar → L0394, L0453, L0460

## L0462 — 2026-10-19 — Staging v26.40.19-c850386: Create Invoice no longer opens the "New Customer Payment" window
On c850386 (19 Oct, 15:53) Finance > Create Invoice made the invoice (server Invoiced after 4 s) and the Finance tab showed the invoice with a
**New Payment** button; no payment window opened (`invoice-r5.mts`: `windows: []`, picture C368167-r5-case-tab2-invoiced-window-open.png).
So C368167 step 2 ("Leave the New Customer Payment window open … closing it with its X takes the invoice back off", L0453) now describes a
window that does not appear; the test still passes. It is Automated → not reworded without the QA lead (Rule 71); raised with him.
Also: the C368167 refusal message is read from the screen's notification as it shows; it fades before the next picture — the picture proves
the outcome (Invoiced, lead unchanged), the reading proves the words.
#run498 #staging #invoice #c850386 → L0453

## L0463 — 2026-10-19 — Another session shares the staging Admin's saved Work Orders view; old batch scripts are not proof
- **C614719-stg start state found** the Admin's saved view on `tab: work_orders` with ~80 groups collapsed — none of it set by this session. Another session works on staging as Admin at the same time and changes the SAME saved preferences (tab, collapsed groups, pins). Every script must set its own start state and read it back (startState/fixup-1017 pattern) — never trust what is saved. It may also explain why C96936's tab A came back on the Work Orders tab after a reload (probe `refresh-tab.mts`: production List keeps All after a reload; staging read queued).
- **s3-batchA.mts's C96953 part set `scrollTop` from code and its Esther reading never moved** — a script that does not use the mouse and whose reading does not change is not evidence for "scrolls on its own" (skill 19 §9.7). Replaced by `c96953-cols.mts` (mouse wheel inside each column, wheel below a short column, wheel sideways collecting every column, count vs `candidates()`).
#run498 #staging #shared-admin #preferences #instrument → L0458, L0461

## L0464 — 2026-10-19 — Headless Chromium hides EVERY scrollbar: launch without --hide-scrollbars to measure one
Playwright launches headless Chromium with `--hide-scrollbars` by default, so `offsetHeight - clientHeight` reads 0 and no bar is drawn
in a screenshot — on the board AND in List/Tech View (c682419-bar.mts first run: all 0). Any check about a scrollbar's size, colour or
handle must launch with `ignoreDefaultArgs: ['--hide-scrollbars']` (same executablePath/proxy as qa-branch-boot.mjs; reuse the signed-in
`storageState`, no new sign-in) and carry a positive control (a List/Tech View bar must read > 0). A 0 everywhere is the instrument, never
the product (Rule 104).
#scrollbar #headless #playwright #instrument #run498 → L0461, L0458

## L0465 — 2026-10-19 — Board sideways sweep with the mouse wheel stalls halfway; a failed staging sign-in at 16:08 recovered at 16:12
- **Wheel sideways over the board (`mouse.wheel(1200, 0)` at the header row) stopped at 45,600 px of ~89,000** and only 158 of 284 columns were seen (c96953-cols.mts first run). A short count is the instrument: finish with the board's own scroll position in 900 px steps and count with `allBoardCols` (proven: 284 = 284). Never judge "technicians are never hidden" from a sweep that did not reach `scrollWidth - clientWidth`.
- **refresh-tab.mts at 16:08 landed on accounts.google.com ("NOT SIGNED IN after 3 quick-login attempts")**; the next script at 16:12 signed in normally. Same as L0413/L0417: one failed sign-in is not an expired gate — run the next step and re-queue the failed one.
#run498 #board #sideways #instrument #staging #signin → L0413, L0417, L0464

## L0466 — 2026-10-19 — A reload keeps the All tab (staging c850386 and production d2441a9); C96936's tab change came from the shared Admin
`refresh-tab.mts`: All tab + a search, reload → still All, twice 5 s apart, in production List and staging List and Tech View. So when
C96936's tab A came back on "Work Orders" after its refresh (16:00), the cause was another session changing the shared staging Admin's
saved tab mid-run (L0463), not the product. Not a defect; nothing to report beyond that. The probe's saved-preference read returned the
app's HTML (the API lives on the api. host, not the app host) — read preferences with `api(p)` from data.mts, not a relative fetch.
#run498 #refresh #tab #shared-admin #probe → L0463

## L0467 — 2026-10-19 — QA lead rulings: "no need" to tell Vlad about changed Automated cases (this time); the PO question sheet for Chris is the other session's Google Sheet
- After I listed Automated cases changed today, he answered "No need" to telling Vlad (19 Oct, for these changes). Rule 65 stands in general; don't re-raise today's list.
- For a PRD wording question to Chris he named the Google Sheet "WO Board and Tech View Feature Squad – Questions on design differences – for Chris Ward" (id 1coGNz1ZNj1GiFA4rS7pt9nwKsNgE8bCLpuutygK4iQs, tab "Questions for Chris", columns # · Topic · Question for you · What we know today (with (a)/(b) options) · Your answer · Where we found it). Add a row at the bottom, copy the row above's format (copyPaste PASTE_FORMAT), plain words, quote the PRD sentence live.
- C368167 step 2 now runs on both builds ("If a New Customer Payment window opens, leave it open … If no such window opens, simply go on").
#run498 #ruling #po-sheet #vlad → L0462, L0466

## L0468 — 2026-10-19 — "Design-" cases in run 498: which are held, how the count bubbles are built, and a copy-paste trap
- **Section "Design — how it looks" (73780)**: titles starting "Design-". Eight "(design's version)" cases C682429–C682436 (another session, 17:24) say "Do not run it while it is held" — they wait on Chris's rows D01–D16 of the design-differences sheet (id 1coGNz1ZNj1GiFA4rS7pt9nwKsNgE8bCLpuutygK4iQs) and are NOT in run 498. Release ⇒ run `c6824-held.mts`; PRD ruling ⇒ the case is removed. C682439/C682440 (known problems SV-11430 / SV-11467, both Done) Passed on c850386 with `c682439-440.mts`.
- **Status pill DOM (List and Tech View)**: `td.status .q-badge[role=status]` is the pill (aria-label = status), `.service-actions .q-badge` the red count and `.parts-actions .q-badge` the blue count (`probe-pill.json`). Measure "covers the words" with a Range over the pill's text node: on c850386 the 19 px bubbles reach 4.2 px (28%) into the 15 px text line in List AND in Tech View at every density.
- **Trap: copying a line range out of another script** (`sed -n 5,91p dash-seed.mts`) cut a function in half → "Transform failed … Unexpected end of file". Check a generated script with `npx esbuild --loader:.mts=ts file.mts > /dev/null` (from build/global-search/e2e) before running it.
- **The bridge dropped again before a run** (ERR_PROXY_CONNECTION_FAILED): run `ensure_bridge.sh` right before every staging script, not once per session.
#run498 #design #held #pill #tooling → L0464, L0467

## L0469 — 2026-10-19 — Chris answered the design-differences sheet (all 19 rows); what it means for the Design- cases, and two staging traps
- Answers (read live ~22:15 UTC): D01 b, D02–D06 a, D07 b, D08 b, D09 a, D10–D15 b, D16 a (button only for users who can add staff), row 17 a ("already done in PRD v67"), row 18 b, row 19 a ("Unassigned"; PRD sentence to change). Per the held cases' own rule: C682429, C682432, C682433, C682434, C682435 → remove; C682430, C682436 → release; C682431 → mixed, needs rewording (Expected → QA lead's go-ahead). Full table: `run498-2026-10-08/design-dash-2026-10-19/READY-TO-RUN.md`.
- c850386 today vs the released design: messages still "Lead technician updated/removed", no Undo, ~6.4 s, no bar; no-technician page has the text but no Add Technician button; an empty location shows "No work orders yet" (not "Nothing here yet"). The PRD-v66 cases C682424/C682425 (Undo message, 8 s) conflict with D05 (2.6 s) — re-check against PRD v67 before running.
- **ZZAUTOTEST technicians sort last**: their Board columns are far right and not drawn at the left; pin them for the runner (`pins([...])`, restored after) so they sit after Unassigned.
- **`POST /api/iam/change-location` does not change what the open page shows** for the runner here; switch with `switchLocUI(p, name)` and read the header back. The runner's location is reset by `asRunner` at the next start anyway.
#run498 #design #chris #ruling #staging → L0468, L0467

## L0470 — 2026-10-19 — Retest of six run 498 tests: SV-11416 fix is on staging, Branko's two UX tickets cover the lead-change message, and a running queue can be extended
- **Staging v26.40.19-c850386 has the SV-11416 fix**: a deleted lead's work orders sit under "Deleted technician" with the "Inactive" marker and no grip (Board and Tech View), drops onto it are refused, List reads "Unassigned" (C614711 steps 1–9 pass). A case still carrying "EXPECT FAIL (SV-11416)" is now outcome 3 — tell the QA lead.
- **Before preparing a defect for the lead-change message, read SV-11524 (Board View UX Improvements) and SV-11522 (Tech View UX Improvements)** — both Open, by Branko Cicovic, 19 Oct, parent SV-10047. They already cover: generic "Lead technician updated" message with no work order / technician / Undo (PRD S4-R5), "Assign tech" for a work order with no lead, no "Unassigned" in the dialog, one-click assign. A failure on those points points at them; nothing new is prepared.
- **`run_queue.sh` reads its queue file line by line while running**, so appending a line (`echo "<cmd>" >> <queue file>`) to a RUNNING queue adds a step without restarting it. Use absolute `cd` paths (each line is `eval`ed in one shell).
- **Rule 112 gap**: the owning story of Board View (SV-10046) is now "Ready for Production", a status Rule 112 does not list (it lists Ready for QA, Testing QA, QA Complete). By the 2026-10-01 QA Complete reasoning (a fault after sign-off is our miss) it should be fileable, but this is NOT ruled — name it in the ask, do not assume.
- `jira.sh GET` prints a status line after the JSON: parse with `json.JSONDecoder().raw_decode(...)`, not `json.load`.
#run498 #retest #sv-11416 #sv-11524 #queue #rule112 → L0469, L0462

## L0471 — 2026-10-19 — Keyboard and menu-look re-tests on c850386: what the scripts' fields really mean, and the locked note's wording
- **`kbd-r4.mts ONLY=C97020` runs only the Admin half (steps 7–16)**; steps 1–6 (the view-only user) need their own run — now the `C97020` block in `retest-locks.mts` (viewer made with role "ZZAUTOTEST WO View Only", keyboard only).
- **`noteOnKeyboard: true` in kbd-r4 output means the disabled item carries the note as its accessible description (aria-describedby), NOT that anything shows on screen**; `tooltips: []` and the picture (`C97020-r4-s12-item-by-keyboard.png`) are what say whether a sighted keyboard user sees it. On c850386 nothing shows (SV-11498, In Progress).
- **Locked wording on c850386 is still the pre-v68 sentence** "The lead technician can't be changed once a work order is Invoiced or Paid." (disabled menu item tooltip, Board and Tech View); PRD v68 S4-N6 wants "Invoiced · can't be reassigned" / "Paid · can't be reassigned".
- **`design-stg5.mts` step 2 picture can be "off screen"** (the card sat at y≈980 in a 900-high window), and the button's own computed opacity says nothing about a hidden parent. Re-read with `c590121-s2.mts` (card scrolled into view, mouse parked, elementFromPoint + ancestor opacity chain, 2x crop, hover as positive control).
#run498 #retest #keyboard #locked #c850386 → L0470, L0469

## L0472 — 2026-10-19 — Two script traps in the lock/permission re-test, and where the locked wording lives
- **`viewAs(..., adminStaffId, backTo)` in a script built on c6824-held helpers: there is no `ME`** — pass `(RUN as any).id` (the runner) and `RUN.toRunner` as backTo. `ME?.id` threw "ME is not defined" and voided all three view-only checks (C96967, C368147, C97020 steps 1–6) of retest-locks.mts; fixed in retest-locks2.mts.
- **A Board card whose lead's column sits far right is not in the page at all** (columns are drawn near the screen only), so `locator(card).boundingBox()` times out for 60 s. Scroll to the column first: `toColumn(p, staffId)` (staff id from `candidates(api(p))`), or pin the technician.
- **On c850386 the locked work order's lock icon is `span.board-card__lock` / `span.tech-view__row-lock` (12 px)**; a hover on it gave no `.q-tooltip` in the first pass — re-read with attributes (title/aria) and a slow mouse move in retest-locks2 before calling it.
- **PRD v68 change log (line "S4-N6, S4-N1: locked work orders read …") is the cleanest Source quote for a wording defect**: it names the old sentence and the new words in one line.
#run498 #retest #viewas #board #locked → L0471, L0470

## L0473 — 2026-10-19 — Run 498 six-case retest outcome (c850386) and two product facts
- **Posted 19 Oct 23:3x UTC, all six Failed** (C614711 → SV-11524; C97020 → SV-11498 + held wording; C96964, C590121 → held S4-N6 wording draft; C96967, C368147 → held S4-N1 permission-note draft). Drafts: `run498-2026-10-08/defect-drafts/tickets/D-S4N6-locked-wording-2026-10-19.wiki`, `D-S4N1-no-permission-note-2026-10-19.wiki`.
- **View-only user on c850386: a card or row cannot be picked up at all** — the mouse only selects text — so no drag note can ever show (PRD v68 S4-N1 wants "You don't have permission to assign technicians" over the target). Positive control: the same press-move-hold as Admin picks the card up and shows the locked note.
- **The lock icon's tooltip is a native `title` attribute** (also `aria-label`) on `span.board-card__lock` / `span.tech-view__row-lock`; headless Chromium never draws a native title box, so read the attribute — a missing `.q-tooltip` is not "no tooltip".
- **For the view-only user the Invoiced card shows no lock icon** (seen in C97020-v-s5-enter.png) — not asserted by any test; noted only.
#run498 #retest #permission #locked #c850386 → L0472, L0471

## L0474 — 2026-10-20 — Finding which open runs hold a case: skip the Nightly runs first
- Project 1 has **357 open runs; 321 are "Nightly Test Run …"** (Engineering's automated runs, Rule 47 — not ours). Paging `get_tests` across all of them took over 30 min and was killed. **Filter `get_runs` to names not starting "Nightly Test Run" (36 runs) and page only those** — done in under 10 min.
- `tr_client.get()` returns `(status, body)`; body of `get_runs` / `get_tests` is a dict with `runs` / `tests`.
- 20 Oct: C614711, C96964, C97020, C590121, C96967, C368147 sit in exactly one manual run, **498**, plus every Nightly run from 20 Sep on.
- `push_results_to_run.py` posts the "Follow the status here" comment for the FIRST ticket of a result only; a result with two tickets needs the second posted by hand (`add_result_for_case`, status 5, `defects` = key) — done for C97020 / SV-11545 (result 529863).
#testrail #runs #nightly #tooling → L0473

## L0475 — 2026-10-20 — Editing (not adding) a TestRail result comment: UI only, and only within an edit window
- **The TestRail API cannot edit a result.** The test page (`index.php?/tests/view/<test>`) gives each result its own `Edit` link (`App.Tests.editResult(1, <result_id>, <status>)`), which opens the "Edit Result" dialog; the comment is the Froala instance `addResultComment_display` (backing `#addResultComment`); save is `#addResultSubmit`. `html.set` + save keeps the same result id, status, defects and attachments (read back for 20 results). Tool: `build/wo-board-tech-view/run498-2026-10-08/comment-edits-1020/apply_edits.mjs` (edits.json {rid: {test, new}}); snapshot + verify pattern in the same folder.
- **Results older than about 2–3 days have NO Edit link** (17 Oct results had none on 20 Oct; 19 Oct ones did) — a TestRail site setting. Such a comment cannot be edited by us; only a new result can carry the change, and the QA lead said "not to add a new comment" → ask him.
- `<strong>` written through the editor renders bold (screenshot `shown-3761668.png`); the API-write literal-tag trap does not apply to a UI save.
- QA lead ruling 20 Oct 2026: every not-Passed run-498 comment must open with the failing step number(s) in bold, and the bullet(s) describing those steps bold — "to know exactly at which step the test failed".
#testrail #results #edit #run498 #ruling → L0474

## L0476 — 2026-10-20 — Rule 132 recorded and enforced: bold failing steps on every non-Passed result
- QA lead: *"Save adding the step numbers in the results and bolding the Failed steps as a permanent rule."* → Rule 132 (RULES-61-ONWARD.md), index row in CLAUDE.md, skill 09 section.
- `push_results_to_run.py`: new fields `failed_steps` (bold first line) and `bold_steps` (step numbers whose bullets, plus "Result:", are bolded); a non-Passed result without `failed_steps` is REFUSED (proved with a deliberate failing dry-run). Self-test check 7c2 added; selftest 33/33 before→after (32 before + the new one).
- An API-posted `<a>` in a result comment renders as a link (shown-api-link-529847.png), so `<strong>` posted by the tool is expected to render too — confirm on the first post (screenshot), as the case-field literal-tag trap is about case fields, not results.
#rule132 #results #tooling → L0475

## L0477 — 2026-10-20 — Staging sign-in expired overnight; the 22-test batch is queued and waits only on fresh cookies
- 20 Oct ~03:20 UTC: every saved staging sign-in (Admin `staging-full.json`, `staging-analyst1.json`, the SSO files) answers `401 {"error":"sso_required"}` on `/api/auth/me` and `/api/quick-login`; the boot lands on accounts.google.com twice. Staging has no password sign-in → only the QA lead can renew it: THREE cookies `SV_SSO_SESSION`, `PHPSESSID`, `CF_CLEARANCE` into `/tmp/shopview/app.env` (STAGING-READY.md step 1) and the Admin JSON in `/tmp/qa-cookies/`.
- The 16 "(release)" tests C690642–C690657 are copies of C96963, C96973, C97002, C97007, C97008, C97009, C97028, C154889, C368133, C368135, C368136, C368140, C368144, C581891, C581892, C581893 — each leaves out only the lead-change MESSAGE (fast-follow SV-11522/SV-11524, Chris Ward, Slack 20 Oct). Their originals' scripts run them with ONLY=… : queue `run498-2026-10-08/run-1020/queue-1020.txt`.
- New script `new6-1020.mts` covers C682421, C682436 (after `c6824-held.mts ONLY=C682436` makes the two locations), C682437, C682438, C682445, C682446.
- QA lead 20 Oct: for this batch's failures, create the Story Defect if none exists and put "Follow the status here <link>" on the result (his go-ahead for these failures; still check for an existing ticket first).
#staging #signin #run498 #release → L0476, L0393

## L0478 — 2026-10-20 — Fresh staging cookies: where they go, how to check them, and the "AA" technician names
- The QA lead pastes THREE values in order: SV_SSO_SESSION (64 hex) · PHPSESSID (32 hex) · CF_CLEARANCE (long). Save all three into `/tmp/shopview/app.env` (three `KEY=value` lines), the SSO into `/tmp/qa-cookies/staging-sso.txt` (keep its existing `sv_sso_session=` prefix form) and all three into `/tmp/qa-cookies/staging-full.json` (keys `sv_sso_session`, `PHPSESSID`, `cf_clearance`); chmod 600, back up the old file first, never echo the values.
- Quick check: `GET https://api.staging.shopview.com/api/auth/me` with the cookies — `401 sso_required` = expired; a `404 resource not found` means the SSO was ACCEPTED (that path just doesn't exist). Then `wob-run.sh build-marker.mts` proves the full sign-in (20 Oct 04:2x UTC: build v26.40.19-c850386).
- C368159, C368169, C368171, C368173 were rewritten (~19 Oct) to use technicians named "AA ZZAUTOTEST <case> Ana/Ben/Dee" so they fall inside the work order page's ~100-name lists (SV-11429). Old scripts (s11-batch, editwo-fix, high1-fix5) still use Ralph Edwards etc. — use `four-aa-1020.mts` instead.
#staging #signin #cookies #run498 → L0477

## L0479 — 2026-10-20 — C682436's "empty" location must have no technician: the first-run title tells you which state you are in
- The empty-state title depends on BOTH counts (design: `noWo && noTech ? "Nothing here yet" : noWo ? "No work orders yet" : "No technicians yet"`). On 20 Oct "ZZAUTOTEST Location Empty" showed **"No work orders yet"** — so it HAD a technician (it is not a product fault). `locC-fix.mts` switches the runner there on screen, reads `lead-technician-candidates`, removes each one's enrolment at that location (`/api/staff/enrollment/remove` per department), reads back, switches back. Re-run C682436 after it.
- A re-run of one block of a multi-test script (`ONLY=…`) overwrites that script's whole result JSON — copy the JSON first (queue line does `cp new6-1020.json new6-1020-main.json`).
- QA lead added C97021 (Tab enters each view once) to the batch; case unchanged since 16 Oct, `kbd-fix4.mts ONLY=C97021` follows it.
#run498 #design #emptystate #tooling → L0478

## L0480 — 2026-10-20 — First-Tab (C682421) re-judged Failed; another session posts on run 498 too; a script must come back to Heavy Duty itself
- C682421 on c850386: focus lands on S2-16688's row, but the row sits behind Brandi Smith's sticky group heading (elementFromPoint at the row's top and middle hit the heading; only the bottom 2–4 px are the row). Chris Ward ruled 19 Oct (SV-11422) "not acceptable" → Failed at step 5; step 7 (Board) passes. Posted result 530264 + follow comment 530265.
- **Another session posted the same Failed at 04:35 (result 530263, same account)** — check `get_results_for_run/498&created_after=<ts>` before posting a batch so duplicates are seen, and expect the shared Admin/Google sign-in to be in use by it (L0394: one sign-in = one app session).
- `switchLocUI` back to Heavy Duty after a block at another location did NOT take (header stayed "ZZAUTOTEST Location Empty"), and the next four blocks of the same script ran at the wrong location (no cards, 500 on assign-technician). Fix in `new6-1020.mts`: `toHeavy()` at the start of every block — on-screen switch, header read back, API `/api/iam/change-location` fallback, throw if still wrong.
- `staff/enrollment/create` needs `departmentId` (400 "department_id Missing required parameter" without it).
#run498 #keyboard #location #tooling → L0479

## L0481 — 2026-10-20 — Release copies run on their originals' scripts, but those scripts do not read everything the copy asks
- `s4-batchG.mts ONLY=C96963` (for C690642) reads the moves, reorders, leads and the server refusal, but NOT the note shown while dragging ("Invoiced · can't be reassigned") — read it with `retest-locks2.mts ONLY=C96964` on the same build. Its Unassigned reorder of W4 dropped at W1's bottom edge, i.e. W4's own place → "reordered: false" is the instrument, not the product (L0417); `C96963-unassigned-reorder.mts` now takes `W4N`/`OTHERN` from the environment (passed by `wob-run.sh`) and reads the customer name from W4's record.
- `wob-run.sh` passes ONLY the variables it lists (`env -i`): any new env input to a script must be added there (W4N, OTHERN added 20 Oct).
- On c850386 an Invoiced work order's page shows "Lead technician" as plain read-only text (no dropdown) — C690642 step 14 passes (C96963-wo-page.png).
#run498 #release #tooling → L0480, L0417

## L0482 — 2026-10-20 — Any release copy that picks a lead on the WORK ORDER PAGE needs top-sorting technician names
- `s9-batchB.mts ONLY=C97007` (for C690645) timed out waiting for "Ben Bravo" in the work order page's Lead Technician list: "ZZAUTOTEST Ben Bravo" sorts after the ~100 names the page lists (SV-11429). The case's names are examples, so C690645 now runs in `four-aa-1020.mts` with "AA ZZAUTOTEST C690645 Ana/Ben/Cal". Rule of thumb: every test that sets a lead or a line technician ON THE PAGE (not by drag/dialog) uses "AA ZZAUTOTEST <case> …" names.
- `s9-batchA5.mts` takes only an end-of-test picture (`<id>-end.png`, session.mts __shotEach) — enough for a pass when it shows the final state; a failure needs its own picture of the failing moment (e.g. the lock hover read in `retest-locks2.mts`).
#run498 #release #sv-11429 → L0478, L0481

## L0483 — 2026-10-20 — A release copy's lead change is a DRAG or More actions > Unassign; the originals' scripts often used the lead dialog
- The 20 Oct release copies (C6906xx) leave out "the lead technician dialog" (fast-follow, SV-11522 / SV-11524). Their originals' scripts change the lead through `openReassign` → dialog, so a green reading from those scripts does NOT observe the copy's step. Found in: `s4-batchE.mts` C368140 (C690653), `stg6.mts` C581891 (C690655), `s4-batchC.mts` C154889 / C368136 (C690649 / C690652, which ask for More actions > **Unassign**, a separate menu item).
- Before posting a release copy, grep the original's block for `openReassign` / `option_lead_technician_`; if present, re-run with a drag (`drag()` card→`board_column_<staff>`) or the `Unassign` menu item. Drag versions: `s4-batchE-drag-1020.mts`, `stg6-drag-1020.mts`; Unassign + work-order-page (AA name) version: `c690649-652-1020.mts`.
#run498 #release #tooling → L0481, L0482

## L0484 — 2026-10-20 — CORRECTS L0479: today's build has no "Nothing here yet" and no "Add Technician" at all; plus three setup traps
- L0479 said "No work orders yet" at "ZZAUTOTEST Location Empty" meant a leftover technician. WRONG: `locC-fix.mts` found NO technician there, and the app's own code (shopview-app@v26.40.19, chunk `WorkOrderMoreActions.*.js` component `WorkOrdersFirstRunState`) has a FIXED title "No work orders yet" / "Create a work order and assign a technician to see it here." — no "Nothing here yet" string and no "Add Technician" button in any Work Orders chunk. Filed as SV-11555 (C682436). Lesson: when a screen differs from the design, grep the build's chunks BEFORE blaming the data (fetch `/js/index.*.js` with the three staging cookies, follow `WorkOrders.*.js` imports).
- `POST /api/work-orders/lines/assign-technician` answers **500** on c850386 — use `PUT /api/work-orders/lines/<line>/technicians {staffIds:[…]}` (200). Hit C368173, C682438, C682446 set-ups.
- The runner (ZZ WOB Runner) is `clockable:false` by design, so it never sees Start/Clock In: a test where "you" clock in runs as a clockable Admin ("ZZAUTOTEST C682446 Me") via `viewAs` (`new6-c682446-1020.mts`).
- Board View "Fields to display" preference: C682438 needs `technician: true` in the work-orders-list preference (it read false), or the card has no avatars.
- `run_queue.sh` reads its queue file ONCE at start: lines appended later are NOT run (run1020 stopped at 16 of 24). Start a second queue for appended lines.
- An unpinned technician group can be ~280 groups down in Tech View: give "Technician-C" an "AA …" name so its header is drawn (C682437).
#run498 #design #emptystate #tooling #correction → L0479, L0482, L0483

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
