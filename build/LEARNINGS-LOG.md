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

## L0366 — 2026-10-15 — Wave 18: judge from json-before-passN, photograph the right window, call toasts(p)
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — readings in `evidence/staging-full-2026-10-14/json-before-pass6/` (the waiter copies every reading there before the next pass rewrites it), verdicts in `judge/wave18.json`, redos in `seventh-pass-plan.txt` (`run-seventh.sh`, `stg-after7.sh`, `logs6/signout-fix.done`).
- **Once the next pass has started, judge from the copy:** `stg-afterN.sh` copies `*.json` into `json-before-passN` before pass N runs; a script that appears in both passes overwrites its file, so read the previous pass's reading from the copy.
- **A picture must come from the window the case is about:** high2-batch's C368207/C368208 pictures were the ADMIN's page, not the view-only user's; imp-fix3 took its Assigned-to-me pictures AFTER clearing the search, so the cited work order was not on them. Photograph inside the user's own page, with the filter still applied.
- **`toasts` from `wob.mts` needs the page:** `toasts()` with no argument throws "Cannot read properties of undefined (reading 'evaluate')" before anything is read (ps-counts C368217).
- **A sort check needs different values in every column:** three rows with the same Service Advisor cannot show an order; give each row its own value. Match a header by its START (other icons can follow the name) and record the header texts seen.
- **A popular first customer hides the A-Z order on a phone:** the first 40 cards were all "4 Star Truck Repair"; scroll until several customers have passed before judging the order.
- **Lead pick lists that stop at the D names:** when the Expected quotes the name (C368169 "Ralph Edwards"), no stand-in is allowed — type into the field's own input and wait at the bottom for more names to load (`pickLazy` in editwo-fix.mts).

## L0367 — 2026-10-15 — Two machine restarts during the same script: skip it, guard memory, resume — and write down how to resume
The machine running the passes restarted at about 07:21 and again at 07:35 UTC (`uptime` showed "up 0–3 min"). Both times
`staledrop-stg4.mts` (C97012) was running, and its log was empty. Every process died with it: the pass runner, the next-pass
waiter and the sign-in relay. **Recovery that worked, in this order:**
1. Restart the relay (L0355). The proxy port changes on every restart.
2. Delete `logsN/role-viewonly-stg4.done` and `clocks-stg4.done` so the start-of-pass resets run again. The sign-in check
   always runs.
3. Start `resume-sixth.sh`. It runs `run-sixth.sh`, which skips scripts with `.done`, and then writes the
   "sixth pass finished" line that the next waiter needs.
4. Restart `stg-after7.sh`.

**When the same script is running at two restarts, do not run it a third time in place.** Mark it skipped in the current pass:
- touch its `.done` file, and note in `run.out` that it was skipped, not passed;
- move it to the end of the next pass, just before the sign-out;
- start `memwatch.sh`, which kills the test browsers if free memory falls under 2.5 GB, so a runaway script fails alone.

On an unattended night, check `uptime` first at every check-in. A restart gives no notice. #restart #unattended #memory → L0355, L0365

## L0368 — 2026-10-15 — A page that never answers must not be awaited without a limit: cap every in-page read, count reloads, add a watchdog
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/staledrop-stg4.mts` (C97012). The machine restarted twice (~07:21, ~07:35 UTC) while it ran in the sixth pass (first run 06:57 → still running at 07:21).
- **What made it unbounded:** after "Session expired, please log in again." the dispatcher's page does not load again (the fourth pass read `page.goto: Timeout 30000ms`). The wave-13 additions then talked to that page with NO time limit: `probe` = `pg.evaluate(fetch(...))` with no abort, `watchRead`/`watchStart` = `pg.evaluate(...)`, plus a `MutationObserver` on `document.body` with `{ childList: true, subtree: true, characterData: true }` that read `innerText`/`getBoundingClientRect` of every added node and re-scanned the whole document on every batch, never switched off. `page.evaluate` has no timeout of its own, so a page stuck loading can hold the script — and the page with it — open indefinitely; the context was only closed in a `finally` that was never reached.
- **The rule now:** every in-page read is wrapped (`cap(ms, promise, fallback)`); the in-page `fetch` has an `AbortController` (8 s); the watcher takes added nodes only (no `characterData`, no layout reads), keeps at most 150 entries and switches itself off after 15 s; the page's own navigations are counted (`framenavigated`, one handler) and the case stops, recording it, if the page reloads itself more than 8 times; the re-open after a refresh gets one attempt with a 3-minute cap; the window's `close()` is capped; and the whole script stops itself after 10 minutes (writes its reading, closes the browser, exit 5).
- **Applies to any script that watches a page across a sign-out or permission change:** expect the page to stop answering and bound every await on it.

## L0369 — 2026-10-15 — The work order page's Lead Technician list holds 100 people: type the name into the field, never scroll for it
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `s9-batchA5.mts` (C97007), `s11-batch.mts` (C368159), new export `pickLeadTyped` in `wob.mts`; verdicts in `evidence/staging-full-2026-10-14/judge/wave19.json`.
- **Measured (sixth pass, staging):** opened without typing and read to the end (`listAllOptions`), the list holds exactly 101 entries — Unassigned, 100 people from "Aaron …" to the Q names, then the current lead. Eligible technicians later in the alphabet (Ralph Edwards, ZZAUTOTEST Ben Bravo) are not in it, although the Reassign dialog (the lead-candidates list) offers them by staff id. Keyboard typing after clicking the field did not narrow the list.
- **What to do:** type into the field's OWN input (`pickLeadTyped(pg, ['Ben Bravo', 'Bravo', 'Ben'], 'Ben Bravo')`) and record what each term offers. Only if typing also never offers an eligible technician is it a product fault (Rule 104: the instrument must have been tried every way first); owning story SV-10047.
- **Explains earlier misses:** C96958 / C96962 / C368169 "Ralph Edwards not drawn", and the dialog vs page difference.

## L0370 — 2026-10-15 — CORRECTION to L0367: the restarts are the environment's, not the script's — recover with one command
The third restart, at about 07:57 UTC, came during `high1-batch.mts`, not `staledrop-stg4`. `memwatch.sh` was running and
logged nothing, so free memory never fell under 2.5 GB. After the restart `free` showed 15 GB available. So the restarts at
07:21, 07:35 and 07:57 come from the environment, and the script that happened to be running is not to blame. L0367's
"move the script that was running at two restarts" was a guess that this disproves. The staledrop time limits (L0368) are still
worth having. Moving it to the end of pass 7 does no harm.

**What to do:** `build/wo-board-tech-view/run498-2026-10-08/recover.sh` is the one command after any restart:
- it restarts the relay on the new proxy port;
- it restarts the memory guard;
- it resumes whichever pass is unfinished, so its start-of-pass resets run again and finished scripts are skipped;
- it restarts the next pass's waiter.

Run it first at every check-in. It does nothing if a pass is already running. Restarts give no notice, so while they keep
coming, check in every 15 minutes: each restart loses the script that was running plus the time until the next check-in.
#restart #unattended #recover → L0355, L0367

## L0371 — 2026-10-15 — "Switching back" to Heavy Duty never took because the helper clicked the "Change Location: …" row
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/wob.mts` `switchLocUI`; seen in C368156 (rest-batch, sixth pass), and the same "back on screen still reads Lethbridge" in C368212 (high2-batch) and C96989 (s6b-batch).
- **Cause:** after the profile menu opens, its own row reads "Change Location: Staging Heavy Duty - 9919". `p.locator('.q-menu .q-item').filter({ hasText: name }).first()` matched THAT row when the target was Heavy Duty, so the click re-opened the picker and the location never changed. Going TO Lethbridge worked only because that row does not contain "Lethbridge".
- **Fix:** take the option from the picker's list — `.filter({ hasNotText: /Change Location/i }).last()`. Read the top bar back after every switch (it is the only proof), and expect scripts that ran before this fix to have left the shared screen session on Lethbridge.

## L0372 — 2026-10-15 — (Being tested) The container is reclaimed when the session is idle: keep check-ins under 10 minutes
The machine restarted four times in under an hour: about 07:21, 07:35, 07:57 and 08:14 UTC. The restarts began right after the
last background watcher was stopped at its two-hour limit (about 07:00). For two hours before that, while it ran, there had been
none. Each restart came 7 to 15 minutes after the last time the session did anything. It was not memory (L0370), and it was
not one script. **Working theory:** the container is reclaimed after a short time with no session activity. Background
processes the session started do not count; a running background task or an agent turn does. A script longer than the idle
window, such as `high1-batch.mts` at about 15 minutes, can then never finish.

**What to do:** on an unattended run, schedule a check-in (`send_later`) at least every 10 minutes. Each one runs
`recover.sh` first. Test of the theory: if `uptime` keeps growing past 30 minutes with 10-minute check-ins, it holds.
Record the outcome here. #restart #idle #unattended → L0365, L0370
- **Follow-up, 08:30 UTC (L0372):** a fifth restart came at about 08:28. Read `uptime` against the clock at every wake:
  07:24 = "up 3 min" (a user message arrived about 07:21), 07:35:54 = "up 0 min" (check-in), 07:58:29 = "up 0 min" (check-in),
  08:15:48 = "up 1 min" (check-in), 08:29:25 = "up 1 min" (check-in). **Every restart is the moment the session is woken.**
  So the container does not live between turns once nothing in the session is running. The watcher was a background task the
  session itself started, and while it ran (until about 07:00) the container stayed up through the night. **So an unattended run
  needs a background task kept running for as long as the passes run.** Start `/tmp/claude-0/sv/watch7.sh` with
  `run_in_background` and the 2-hour timeout, and start the next one when it exits. Check-ins alone do not keep the machine
  alive: each check-in wakes a fresh machine.
- **Confirmed, 08:52 UTC (L0372):** with `watch7.sh` running as a background task from 08:29, `uptime` read "up 24 min" at the
  08:52 check-in. The script that three restarts had cut off (`high1-batch.mts`) finished. **The theory holds: while a task the
  session started is still running, the container stays up between turns.** Keep one running for as long as the passes run.

## L0373 — 2026-10-15 — An asset page is /customers/vehicle/<id>; the customer's own Assets tab is /customers/<id>/vehicles
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/high1-batch.mts` (C368181, production comparison); verdict in `evidence/staging-full-2026-10-14/judge/wave21.json`.
- **Trap:** a check like `/\/vehicle/i.test(url)` is also true on the customer's Assets TAB (`/customers/<id>/vehicles`). Clicking an asset row did not open the asset there, so the next "Work Orders" tab clicked was the customer's ("Work Orders (4)", next to Part Sales / Contacts / Assets) — read twice as if it were an asset's.
- **Rule:** an asset page's address is `/customers/vehicle/<id>…` (staging TRK-201: `/customers/vehicle/<id>/work-orders?companyId=<id>`, tabs Work Orders · Invoices · Notes · Inspections). Click the asset row's cells until the address matches that, and read the tabs to confirm (an asset page has no Part Sales / Contacts / Assets tabs).

## L0374 — 2026-10-15 — Staging Schedule drops land 15 minutes early; every staff pick list stops at 100 names
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/high1-fix5.mts` (C368173, C368178, C368179, C368190); verdicts in `evidence/staging-full-2026-10-14/judge/wave22.json`.
- **Schedule drop:** staging's day grid has no `[data-time]` slots, and dropping a work order card at the hour heading's text saves the shift a quarter-hour EARLY (9 AM → 8:45, 1 PM → 12:45) — the dragged card's left edge, not the pointer, sets the start. Measure one hour in pixels from the visible hour headings and drop `pxPerHour / 4 + 1` further right.
- **Add Technician (Edit Line) has the same 100-name list** as the lead field (L0369): scrolled to its end it held 99 names (A to Q). Type the name into the field's own box; never rely on scrolling for a name late in the alphabet.
- **Find Schedule blocks by the FULL customer name:** an 18-letter prefix ("ZZAUTOTEST Sched D…") also matches earlier runs' blocks on the same row.
- **An unexplained "Deleted user" Labor entry** appeared under Esther Howard on S2-35973's Line 2 after a labor move, although the line's tasks / time records name only her (staff record exists). It is not a deleted person you can point to — do not use it as C368191's "labor by a deleted staff member" state.

## L0375 — 2026-10-15 — "Click outside" at a fixed point can open a dialog; and a GA reading must keep every user id, not the first
- **Trap 1 (tech-filter-stg6, staging):** a helper that closed menus by clicking a fixed point (40,140) hit **Create Work Order** once the toolbar wrapped on staging, opening a New Work Order dialog that then blocked every later click (15 s timeouts in C581916–C581918). **Fix:** pick the first candidate point whose `elementFromPoint` is not a button, link, field, tab, header, card or menu, then close any menu or dialog that opened anyway (`tech-filter-stg6.mts` `clickOutside`). Any "click outside" in a script must check what it is about to click.
- **Trap 2 (ga-week, C97034/C97033):** `ga-week.mts` kept only each user's FIRST `uid`, so "each user keeps the same uid on every event" was assumed, not read. `log()` now keeps every id seen per user (`uids`). Check that each list holds ONE id before passing. `ga_calc.py` now takes the folder as an optional argument (`python3 ga_calc.py evidence/staging-full-2026-10-14/ga-week`); with no argument it reads the QA-branch folder as before.
- **Two-day GA test (C97033):** day 2 must be a later calendar day in **Pakistan time** (the QA lead's choice), in the same Monday–Sunday week. Day 1 on staging ran 15 Oct 09:04 UTC (Thursday), so day 2 runs between 15 Oct 19:05 UTC and 18 Oct 18:59 UTC. Never put it in a pass that may run earlier than that.

## L0376 — 2026-10-15 — "Just below a row" must be inside the row when that row ends its group
- **Where:** run 498, C590123 step 7 (sixth pass, `design-stg5.mts`), judged in `judge/wave-design2.json`.
- The script dropped Work-order-1 at "Work-order-2's bottom + 4 points". Work-order-2 was the LAST row of Tia's group, so that
  point was Uma's group header: the blue line went to the end of Uma's group and the drop **changed the work order's lead**
  (S2-36131 moved to Uma). For "drop just below row X", aim at the lower half of row X (e.g. 75% of its height), never past its
  edge; check which group the blue line sits in before releasing, and read the lead back after the drop.
- Reused technicians keep earlier passes' work orders in their groups (Tia still held S2-35997/98/99), so "WO-1 below WO-2"
  is read among extra rows. Use run-numbered technicians, or move the old work orders away first.
#drag #design #staging → L0350, L0360

## L0377 — 2026-10-15 — Long location names are cut short in the picker; a name prefix matched an old run's Schedule block; hold the block while scrolling
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `wob.mts` `switchLocUI` (shared), `notech-stg4.mts` (C368130), `s4-batchH.mts` (C96958, C96966); verdicts in `evidence/staging-full-2026-10-14/judge/wave24.json`.
- **Location picker cuts long names short:** the profile menu's location list shows "ZZAUTOTEST F2 No Tech Sho..", so `hasText: 'ZZAUTOTEST F2 No Tech Shop'` never matched and the switch silently did not happen. `switchLocUI` now matches a name longer than 22 characters on its first 20 characters (picker and top bar). Read the top bar back after every switch.
- **Never match a test record by a shortened prefix:** C96966's block finder fell back to the first 30 characters of the customer name, which matched an EARLIER run's block ("…Status And Time Kept 56957"), so the on-screen move dragged another shift. Match only this run's full name (it ends in the run number) or the number.
- **Drag onto a Schedule row that is off screen:** hold the block (mouse down), scroll the Schedule's own scroller toward the target row in 300 px steps while nudging the mouse, and drop only once the row is on screen; record the held scrolls (`s4-batchH` C96966 step c).
- **Same-name technicians pile up:** staging's Reassign dialog lists four "ZZAUTOTEST F3 Count Ben Bravo" from earlier runs. Identify this run's person by the **Current** mark or by staff id, never by name or position alone.
- **The result picture of a "no notification" check is the empty Notifications page itself**, photographed in that person's own window (`s4-batchH` `read(who, tag)`).
- **A pass runner reads its plan ONCE:** `run-*.sh` pipes `grep -v '^#' plan | while read`, so the list is fixed the moment the pass starts; a line added a minute later never runs. Check `run-all.out` for "<n> pass start" immediately before AND after editing a plan; if it started, use the next pass (`eighth-pass-plan.txt`, `run-eighth.sh` skips a line the previous pass already ran with the same ONLY, `stg-after8.sh`, `resume-eighth.sh`, wired into `recover.sh`).

## L0378 — 2026-10-15 — Every time a pass is added, check where the sign-out test is: it must be in the LAST plan only
L0342 says the sign-out test runs last of all passes. Even so, when the eighth pass was added (after the seventh had started),
`signout-fix.mts` was left as the last line of the seventh plan. The eighth plan had none. So staging would have been signed
out at the end of pass 7, and pass 8's sign-in check would have stopped it. I caught it on reading the plans. The fix was to
touch `logs7/signout-fix.done` before pass 7 reached it, note the skip in `logs7/run.out`, and append the sign-out line to the
end of `eighth-pass-plan.txt`. **The check, whenever a new pass plan is written:**
`grep -l signout-fix *-pass-plan.txt` must name only the newest plan. Each older pass that has not yet reached its sign-out line
needs its `.done` marker. #signout #passes #staging → L0342

## L0379 — 2026-10-15 — Never switch users while a "view as" window is open; a page set behind the screen is not the screen's location
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `high2-batch.mts` (C368208, C368212), `ps-counts.mts` (C368217), `sort-fix5.mts` (C368196); verdicts in `evidence/staging-full-2026-10-14/judge/wave25.json`.
- **"View as" windows share the server session:** C368208 switched back to the runner and then to the user again mid-window to read a value; the user's window then reloaded onto the sign-in page ("Session expired, please log in again."). Read anything you need as the runner BEFORE opening the window, and let `v.close()` switch back afterwards.
- **Setting the location behind the screen does not move the screen:** `POST /api/iam/change-location` alone left the browser at Heavy Duty, so the Lethbridge part sale's page bounced to the Part Sales list (no Add Part button). Switch the screen with Change Location (`switchLocUI`) and read the top bar; to come back, if the screen will not switch, set it behind the screen AND reload.
- **A header can be drawn but missed by a text filter:** "Total Price" / "Created On" were in the drawn header row yet `filter({ hasText: /^Total Price…/ })` found nothing (the filter tests textContent). Last resort: find the `th` by its drawn `innerText`, tag it, click the tag (`sort-fix5`).
- **Keep partial readings:** set `R[id] = o` at the start of a check so a late failure keeps everything read before it (`ps-counts` C368217).
- **Reading a control on production without changing anything (C368208, `viewonly-pin-prod.mts`):** sign in once as the lower-permission login (`/tmp/shopview/prod-login-limited.env`), read its permissions LIVE (it has drifted before), record the control's tooltip and its disabled state (disabled / aria-disabled / class / cursor / opacity) while hovered, and click it ONLY if the page itself marks it disabled — otherwise the click could change production data, so say "not clicked" and why.
- **"Typing did not find him" needs a positive control (wave 26, C97007 / C368159 / C368169):** typing three different terms into the Lead Technician field's own box left the SAME drawn list each time — that points to a field with no type-to-search, but it is only proved when a name that IS in the first 100 is typed the same way and the list also fails to narrow. Photograph the list while it is OPEN after typing (the earlier picture was taken after Escape). `lead100-compare.mts` now does both on staging and production.

## L0380 — 2026-10-15 — QA lead ruling: a distinct finding met along the way gets its OWN Story Defect
QA lead, 15 Oct 2026: he ruled that the work order page's 100-name Lead Technician list must be its own Story Defect. **A
problem found along the way, which blocks several tests but is not what those tests are about, is a separate ticket.** It is
never folded into another ticket, and never left only as a "held" note. It still goes through every gate:
- production compared (Rule 121);
- the story's status read live (Rule 112);
- the source quoted (Rule 106; the live read needs his go-ahead, Rule 81);
- drafted in the house layout (skill 06);
- asked for on its own (Rule 113).

The tests it blocks carry the ticket number once it is filed. #ruling #tickets #story-defect → L0369

## L0381 — 2026-10-15 — A hung script costs its whole timeout: spot it by log age and CPU, kill only its `timeout`, re-queue
`high1-batch.mts` (C368181) signed in to production at 10:22:15 UTC and then did nothing. The log was silent and the node
process sat at 0% CPU. Its `timeout` is 3600 s, so it would have held the pass until about 11:20.
- **How to spot a hang:** the newest `logsN/*.log` has not changed for more than 10 minutes, the newest evidence picture is just
  as old, and `ps -eo pid,etime,pcpu,args | grep <script>` shows 0% CPU.
- **How to stop it:** `kill -TERM <pid of the 'timeout 3600 ./wob-run.sh <script>' process>`. timeout passes the signal on,
  the pass runner writes EXIT=143 and goes on to the next line, and no `.done` is written. Do not use `pkill -f`, which can hit
  your own shell (L0339).
- **After stopping it:** log the stop in `run.out` and re-queue the case in the next pass with every step time-limited
  (L0368).
- Every check-in now reads the newest log's age.

Also seen: production moved to **v26.40.18-163ddfa** during the run (it was f5bf8f4 overnight). A production comparison must
record the build it read. #hang #unattended #production → L0368, L0372

## L0382 — 2026-10-15 — A production read inside a staging script needs its own limits: the 90 s default × nested loops hung for 17 minutes
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/high1-batch.mts` (C368181 production half); queued in `eighth-pass-plan.txt`.
- **What happened:** after the production sign-in (10:22:15, app-version v26.40.18-163ddfa — production had moved from v26.40.17-f5bf8f4 since 08:39), the script sat at 0% CPU for 17 minutes and was killed (EXIT=143). `bootProdLogin` sets a 90 s default timeout, and the loops (8 customers × 4 assets × 4 cells, each click waiting up to 90 s on a cell that never opened anything) multiplied it.
- **Fix, the L0368 pattern applied to the production half:** set the production page's own defaults (10 s per action, 30 s per load), cap every read with `Promise.race`, bound the loops (3 × 3 × 4) AND the total clicks (30), record every step with a time, wrap the whole read in an 8-minute watchdog that keeps the reading so far and closes the browser, and cap the sign-in itself (3 min).
- **Record the production build in every production reading** — it changes during the day.

## L0383 — 2026-10-15 — Open a Schedule block to prove it is yours before dragging it; the Schedule drop snaps down to the quarter
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `s4-batchH.mts` (C96966), `high1-fix5.mts` (C368178, C368179), `lead100-compare.mts`; verdicts in `evidence/staging-full-2026-10-14/judge/wave27.json`.
- **A block found by customer name can still be someone else's:** even with this run's full customer name, the found element was another shift — the move changed shift 715fdca2 and the held drag opened "Reassign shift S2-36076 · ZZAUTOTEST Sched Lines 30846", which the script confirmed (that other test shift now belongs to Dana Ortiz). Open each candidate block, read its details' work order number (`text_shift_detail_work_order`), and drag only the one that names YOUR work order; cancel any move/reassign dialog that names another.
- **Schedule drop offset (staging, 87 px an hour, no `[data-time]` slots):** dropping the card at the hour heading's left edge + 6 px saved 15 minutes early (8:45 / 12:45); + a quarter-hour more saved 15 minutes late (9:15 / 13:15). The start snaps DOWN to the quarter, with the hour line just right of heading + 6 px: aim at heading + 6 + pxPerHour/8.
- **A reading that comes back empty is a script fault until proved otherwise:** lead100-compare's first run found "no work order" (a `status=approved` list filter returns nothing) and opened no dialog (the first Board View card of thousands was off screen); production answered 404 for the lead-candidates list because the board feature is not on production — use the staff list there.
- **Leftover test shifts stack over yours (wave 28, eighth pass):** earlier runs' own shifts on Esther Howard's row tomorrow, in the same hours, sat over this run's block, so every drag grabbed one of them (the refusal guard cancelled the wrong reassign this time). Before a Schedule drag test, delete that person's other ZZAUTOTEST shifts on the test day (`DELETE /api/schedule/shifts/<id>?scope=shift`, recorded), and open a block with a mouse click on the block itself — `locator.click()` on the `.fc-event` opened no details.

## L0384 — 2026-10-15 — A running pass reads its PLAN once, but loads each SCRIPT only when its line starts
**Plan:** `run-*.sh` reads `*-pass-plan.txt` once, at the start (L0350). A line added afterwards never runs.
**Script:** the `.mts` file is loaded by `wob-run.sh` / `npx tsx` only when its own line begins. So a script whose line is
still ahead can be fixed or extended while the pass runs, and the change is used. This is how `lead100-compare.mts` (line 10 of
pass 8) gained the Edit Line > Add Technician reading after pass 8 had started.
**Two cautions:**
1. A shared helper (`wob.mts`, `staff.mts`) that is changed mid-pass also changes every later script. Change it only in ways
   that cannot break those scripts.
2. Never edit the script that is running at that moment.
#passes #plans #scripts → L0350, L0378

## L0385 — 2026-10-15 — `pgrep -f <name>` counts the shell that runs it: count waiters with a bracketed `ps` pattern
`pgrep -f stg-after9.sh | wc -l` printed 2, which looked like two next-pass waiters, and two waiters would have run the ninth
pass twice. There was only one. The other match was the tool's own `bash -c "…stg-after9.sh…"` command line.
**Use instead:** `ps -eo pid,ppid,lstart,args | grep "[s]tg-after9"`. The bracket stops the grep from matching itself, and the
start times show whether there really are two. Before killing a duplicate, check its parent is 1 (started with setsid) and its
start time. Never use `pkill -f` (L0339). #processes #waiters → L0339

## L0386 — 2026-10-15 — A short production list cannot answer "does production have the same list limit?": read the request's limit instead
- Context: D-LEAD100 (run 498, wo-board-tech-view). Staging's work order page Lead Technician list stops at 100 people (101 entries of 184 who can lead); Edit Line > Add Technician stops at 97.
- Production (v26.40.18-163ddfa) has only 18 active staff, 9 offered at the location, so both its lists (10 and 9 entries) are complete and can never reach 100. Rule 121 is then "production cannot show it" — say so, never guess.
- The way to settle it without seeding 100 people on production: record the GET /api/ request each list makes and its limit setting on both sites (`watchRequests(pg)` in `run498-2026-10-08/lead100-compare.mts`). Same limit asked on production ⇒ the limit is older than this work.
- Always pair a "typing does not find X" reading with a positive control (type a name that IS in the list): here neither narrowed, so the finding is "the field does not search as you type", not "X cannot be found".
- Instrument trap found the same day: `inp.fill(term).catch(() => {})` swallowed the error when a pick field takes no typing, so the readings said "typed, not narrowed" while the pictures show an EMPTY field. A typing reading must record how it typed, the fill error, the field's `readonly`, and the value after, and fall back to pressing the keys as a person does (`typeLikeUser` in `lead100-compare.mts`). Until then, word it as what the screen shows: "no text appears and the list does not change".

## L0387 — 2026-10-15 — I told the QA lead "typing does not narrow the list" before anyone looked at the field in the picture
From the lead100-compare reading I reported that typing a name narrowed neither list, on staging or production. The script had
used `inp.fill(term).catch(() => {})`, and every "typed" picture showed an EMPTY field: the typing never landed. So the honest
reading was only "no text appeared and the list did not change". I corrected it to him in my next message.
**Rule 104 applies to a script's own negative results too:**
- before a "typing found nothing" or "nothing narrowed" result is reported, the reading must show what the field held after
  typing, and the picture must show the typed text;
- a `.catch(() => {})` on an action that a negative claim rests on makes that claim unproven.
The script now records how it typed and what the field held (`typeLikeUser`). #negative-claims #typing #rule104 → L0036, L0386

## L0388 — 2026-10-15 — A list's size cap need not be in the request: compare the request AND say what it cannot prove
- D-LEAD100 (run 498). The tenth pass recorded the work order page's own requests on both sites (`watchRequests` in `run498-2026-10-08/lead100-compare.mts`): staging and production both send `GET /api/technicians`, `/api/technicians?clockableOnly=1` and `/api/work-orders/<id>/line-technicians` with NO limit in the address. The cut-off at about 100 people is therefore in the server's answer, not in what the page asks.
- "Same request on production" proves the page did not change; it does not prove production's server also stops at 100 (production has 18 staff). Say both halves; the decision goes to the QA lead.
- The list end MOVES as test staff are added during the day (QA Foreman, then QA Administrator; 184 then 255 people who can lead), so describe it as "about 100 people, in the P/Q names", never a fixed last name or exact count.
- The Lead Technician and Add Technician fields refuse `fill()` (5 s timeout, not read-only): type by pressing keys with the field focused (`typeLikeUser`). Pressing keys shows no text and changes nothing, on both sites.
- Wave 30, C368217: a case that checks "the second location's counts are not added" makes BOTH part sales for the SAME customer; a separate "… L2 …" customer leaves that half untested (fixed in `ps-counts.mts`).
- Correction the same day (coordinator): "the page sends the same request on production" does NOT make a fault "older than this work" when the release's own change list touches that area (developer's regression list, High 1: the line-technician lists were changed). With production unable to show the cap, the honest line is "cannot tell new from old" — Rule 121 both ways — and the QA lead decides.
- Wave 31: a Schedule check that opens "the shift" on a technician's row must first clear that technician's older ZZAUTOTEST shifts for the day and then open blocks by mouse until one names THIS work order; on a stacked row ("+8 more") the first block opened was another test's (C368178/C368179).

## L0389 — 2026-10-15 — Before drafting a ticket for a failed design test, read the reports the case itself says it covers
- Run 498 design section (73780): each case's provenance says "Covers the design defects SV-113xx (reported 14 Oct 2026 by …)". Read live (jira.sh GET, read-only) on 15 Oct: SV-11317 to SV-11326 are Open Bugs under the epic, SV-11338 an Open Story Defect. They already cover 11 of the 14 distinct design findings and the missing Technician filter.
- So each draft carries an "ALREADY REPORTED" line with the key, title and live status, and the queue suggests attaching the failed tests to the open report instead of a new ticket — the QA lead decides. A new ticket for one of those would be a duplicate.
- Group by distinct finding, not by test (L0380): one test can hold two findings (C590113 columns + header labels; C590121 hover shadow + menu icon; C590124 hover shadow + name bubble), and one finding can span two tests (C590119 + C590129 blue avatars; C590121 + C590124 hover shadow). Re-read each Expected before calling something a failure: C590128 allows Compact text "the same size as at Regular or a little smaller", so that point is not a defect.
- Drafts: `run498-2026-10-08/defect-drafts/tickets/D-TECHFILTER-*`, `D-DESIGN-1…14-*.wiki`, queue `QUEUE-2026-10-15.md`.

## L0390 — 2026-10-15 — QA lead ruling: every ticket we reopen or file for this suite carries the label `board-tech-view`
QA lead, 15 Oct 2026: a ticket that was Obsolete and is reopened gets the label `board-tech-view`. New tickets already carried
it. The label is added with v2 `PUT /rest/api/2/issue/{KEY}` and the body `{"update":{"labels":[{"add":"board-tech-view"}]}}`
(204), then read back.
On 15 Oct: SV-11101 (reopened) and SV-11393 to SV-11397 (new) all read Open with the label.
**When reopening, also:** keep a copy of the old text first, transition "Reopen" (id 26 on SV), rewrite in the house layout
with pictures, run size_pics, and give him the link. #tickets #labels #reopen → L0380

## L0391 — 2026-10-15 — `recover.sh` hung after a container restart: its relay check `curl` had no time limit
After the restart the relay was not yet up, so the `curl` in `recover.sh` line 11 waited forever, and memwatch and the
waiters it starts after that line never came back. **Fix (done):** `curl -m 20`. **Rule for any recovery or watcher
script:** every network call gets a time limit (`curl -m`, `timeout N`), because a recovery step that can hang is worse
than none: it looks like it ran. Check after recovery with `ps` that memwatch and the waiters really are running. #recovery #relay #hang → L0372, L0381

## L0392 — 2026-10-15 — Production's work-order list holds only the ACTIVE location's work orders: switch to the record's location first
`GET /api/work-orders` on production answered 200 rows, all `S2-…`, and "S1-3 not in the list", because the active location
had changed since 12 Oct. Its location id is NOT in the login data. Read it from the reply the *Locations* page itself gets
(match `"id":"<uuid>","name":"Truck Hill 1"…"timezone":"…"`), then `POST /api/iam/change-location` with that id and the
zone it already has (so nothing changes), then list. Recipe: `build/wo-board-tech-view/run498-2026-10-08/prod-s13-labor-read.mjs`.
**Also:** for a Rule 121 check, an earlier production run that already DID the same steps is reusable. Read the record it
left (read-only) instead of repeating the whole flow; here one read settled the "Deleted user" question (SV-11398). #production #location #rule121 → L0386

## L0393 — 2026-10-15 — Staging's sign-in ends within about two hours; "no DEV MODE Admin button" was Google's sign-in page
The staging sign-in the QA lead gave at 12:27 UTC worked at 13:21 and was refused at 14:47 (`401 {"error":"sso_required"}` on
every API call; the sign-in page redirected to `accounts.google.com/v3/signin/identifier`). `qa-branch-boot.mjs` only said
"no DEV MODE Admin button", which reads like a timing fault. **Fix (done):** on that stop it now saves `/tmp/qa-boot-fail.png` and
prints the page it landed on, so "Google sign-in" is visible at once. **What to do:** staging has no password sign-in (see
`build/BLOCKED-shopview-app-session.md`), so ask the QA lead for fresh staging cookies straight away, and run staging work
soon after he sends them. #staging #signin #sso → L0355, L0383

## L0394 — 2026-10-15 — One staging Google sign-in holds ONE app session at a time; the Staff page is /administration/staff
- **Sessions:** the QA lead sent one `sv_sso_session` with two `PHPSESSID`s (Admin, and "Analyst 1" in a second company). The
  Analyst one answered `401 session_expired` at once, and the Admin one went `session_expired` the moment our run signed in through
  quick-login. So each new sign-in under the same Google sign-in ends the previous app session. **To work as two users:** finish
  everything that needs user 1 before anything signs in as user 2, and ask him not to sign in again in that browser after copying
  the cookies. A run's own quick-login counts as a sign-in.
- **Staff page:** `APP + '/administration/staff'` (`/settings/staff` shows "This URL is in the shop… indefinitely"). Its Search
  folds into an icon after the first search; click "Search" before each new fill (`c581895-staff-ralph.mts`).
- **Tech View, a group lower down:** use `findRow(p, woId, staffId)` from `wob.mts` (opens and scrolls), then read
  `tech_view_group_name_<data-group-key>`; a group not yet rendered reads null, which is not "missing". #staging #signin #staff #techview → L0393

## L0395 — 2026-10-15 — Staging HAS a second company: the QA lead's "Analyst 1" login (bilal.muzamil+dako) reaches it
- Corrects the 15 Oct report line "staging has only one company". The QA lead's login `bilal.muzamil+dako@shopview.com`
  ("Analyst 1") signs in to a different company; with its three cookies a Playwright request context (relay proxy, Origin/Referer
  `app.staging.shopview.com`) can write there: `stg-orgb-seed.mts` made customer "ZZAUTOTEST F3 Scope OrgB Customer" and Approved
  work orders S-2 / S1-2; `stg-orgb-lead.mts` made its only lead candidate "Scope OrgB Tech" the lead (201, read back).
- **Traps:** `/api/roles` answers an empty list for this user, so `person()` fails with "Role is missing" — use the company's
  existing technician (lead candidates) instead. `/api/organizations` lists ~100 "E2E-Bootstrap-…" companies, so never pick
  "the other company" from that list. Do company B first, then the Admin run (L0394: the Admin sign-in ends the Analyst session).
- Unblocks C154650 and C368175 on staging. #staging #second-company #orgb → L0394

## L0396 — 2026-10-15 — The technician lists stop at 100 because the server pages at 100; a list's absence is proved from the full source
- `GET /api/technicians` (and `?clockableOnly=1`) on staging answers `pagination {page, rowsPerPage: 100}`: 253 people over 4 pages
  (`c368175-api.mts`, reading `page=N`). Every technician pick list on the work order page (Lead Technician, New Line / Edit Line
  > Add Technician, Edit labor > Technician) stops at about 100 names, the Q names. So the screen very likely uses page 1 only. That
  is useful to the developer on SV-11393 (the 100-name list ticket). It is an inference from the paging, not a code read.
- To prove "X is never offered" in a capped list, read the FULL source list (every page) with positive controls (our own names, Z
  names present) and the other company's ids. The capped screen alone cannot show anyone past Q.
- Trap in `orgb-fix3.mts` C368175: for New Line, "OrgB" landed in "What Are You Doing?" (the line-name search), so its "No results"
  is about line names, not technicians. Check the picture before using a typed-search result (L0387). Edit labor's last row is the
  line's CURRENT technician (shown selected), not the end of the alphabet. #technician-list #paging #rule104 → L0386, L0388

## L0397 — 2026-10-15 — A Jira attachment upload needs the same Origin/Referer/User-Agent headers as jira.sh, and goes BEFORE the comment that shows it
- On SV-11393 the attachment POST without the `Referer` header answered 404, and an earlier try answered 000. It answered 200 with the exact header set
  of `build/atlassian-login/jira.sh` (Origin, Referer, browser User-Agent, `X-Atlassian-Token: no-check`) plus `;type=image/png`.
- Upload the picture FIRST, then post the comment or description that embeds `!name.png|width=1000!`. The comment went in first here,
  so it briefly pointed at a missing picture. Read back `?expand=renderedBody` and count `<img`. #jira #attachment #comment → L0390

## L0398 — 2026-10-16 — A scheduled check-in fires into a reclaimed container; and "not_authenticated" (not "sso_required") means the Google sign-in still works
- The C97033 day-2 routine fired at 19:11 UTC on 15 Oct but reached this session only at 07:36 UTC on 16 Oct. The container had been
  reclaimed while idle, so nothing ran overnight. If a timed step matters, keep a background job alive until it fires (L0372), or
  check the routine's delivery time on wake and run the step straight away. Day 2 still counted: it was 16 Oct in Pakistan.
- After a restart, `/api/auth/me/fe-permissions` with only the saved `sv_sso_session` answered `not_authenticated`. That means the
  Google sign-in is still alive and quick-login will work. `sso_required` means it has expired and the QA lead must send a new one (L0393).
- To list "tests whose latest result is not from staging", page `get_tests` and read each test's latest result (~270 calls, more
  than 2 min: run it in the background). A comment that names "Staging Heavy Duty" is NOT a staging result: match the "Tested on
  staging" / "Tested on QA branch" opening line instead. #routine #staging #signin #testrail → L0372, L0393, L0394

## L0399 — 2026-10-16 — The staging test account's location DRIFTS between runs; check it before every test
- 16 Oct, staging: the first round of re-runs made work orders at the wrong location (numbers "S1-…" / "S3-…", not "S2-…"), and
  most scripts timed out looking for things that were at Heavy Duty. When the probe started, the account (ZZ WOB Runner) sat at
  "DVI Test", a location none of our scripts use. So something outside the run changes it.
- The C368156 switch-back that "failed twice" did NOT reproduce. Done the way a person does it (`loc-switchback-probe.mts`:
  menu > Lethbridge, then menu > Heavy Duty) it took on the first try. It is not a product fault and was not reported (Rule 104).
- `POST /api/iam/change-location` answered 200 but did NOT change the top bar after a reload. Switch through the menu (`switchLocUI`).
- Every re-run now starts with `ensure-heavy.mts` (menu switch to Heavy Duty, top bar read back, exit 3 = skip the test). Scripts
  that switch location themselves go last (`rerun6-1016b.sh`). Ticks in the location list can't be read from the text: every row
  carries a "check" icon. #staging #location #rule104 → L0394

## L0400 — 2026-10-16 — A scripted Schedule drop cannot judge a start time; and the location field can already read the target
- **Schedule drops:** in one run (`high1-fix5.mts`, staging, 16 Oct) both drops landed the same distance past the hour line (about
  24 px, worked out from the heading text because staging has no time-slot marker). The 9 AM drop saved 9:00 and the 1 PM drop saved
  12:45. So a script's drop point is not a proved instrument for the START TIME (Rule 104). Judge the time only from a drop made by
  hand on the line, or after a positive control that shows the same offset saving the same minute twice. What the shift covers
  (whole work order or chosen lines) and "no error message" can still be judged from a scripted drop (C368178 Passed, C368179 Blocked).
- **Change Location:** on the way back in `rest-batch.mts` the menu's "Change Location:" field already read "Staging Heavy Duty -
  9919" (ticked in the list) while the top bar read "Staging Lethbridge - 4310". Picking the value the field already shows may change
  nothing. Before saying a switch failed, read that field; if it already shows the target, pick another location first, then the
  target. Not proved yet, so it was not reported (C368156 Blocked).
- `push_results_to_run.py --screenshots yes` refuses unless EVERY result, Blocked included, has a picture: annotate the screen that
  shows why it was blocked. #staging #schedule #location #rule104 #rule130 → L0399

## L0401 — 2026-10-16 — Read the build with build-marker.mts (wob-run hides /api/version); recount the run before reporting, other sessions change it
- `/api/version` answers a 40-character commit plus "-develop", and `wob-run.sh` masks any 32+ hex run as "<hidden>". So the build
  probe printed "<hidden>-develop". `run498-2026-10-08/build-marker.mts` prints the page's own `<meta app-version>` (v26.40.18-7d85b7d
  on 16 Oct) and the commit's first 7 characters. Read it before judging from older evidence: a changed build means a fresh run.
- On 16 Oct at 08:10 UTC another session set 28 tests in run 498 to Retest (Chris Ward's answers 12–31, PRD v54), added C598326, and
  rewrote C581895. Our counts from the previous hour were stale. Count the run live before every report and say WHO changed what
  (`get_results` created_by/created_on). #testrail #build #cross-session → L0398, L0399

## L0402 — 2026-10-16 — Run 498 re-runs on v26.40.18: queue waiters, Tech View traps, and staff vs account names on staging
- **Queue waiters:** a background `while pgrep -f "rerun-1016c.sh"; do sleep; done; ./rerun-1016c.sh …` matches ITS OWN command line and
  waits for ever. Wait on the running queue's PID (`while kill -0 <pid>`) or on a line in `logs-1016c/queue.out` ("end <tag>") plus
  `! pgrep -f "^/bin/bash ./rerun-1016c.sh"`. `rerun-1016c.sh` stops the queue when a log shows Google's sign-in or `sso_required`.
- **Tech View traps (staging):** Unassigned opens expanded with ~3,530 rows, so pinned technicians' headers are not drawn until it is
  collapsed (`collapseUn`). Its rows load in BATCHES: jumping to `scrollHeight` lands in the technician groups after it, and nearing the
  next group starts the next batch, which pushes that group away (C590131 steps 4–5 were not reached; the 16 Oct script waits 3 s and
  re-checks). The header held under the headings is its own `.tech-view-group-header` element, not inside the group's row. The heading row
  is sticky per `th`, so measure `thead th`, not `thead`.
- **Users' saved choices bite:** Admin ShopView had groups saved collapsed and a pin (Tech View rows hidden); the runner's Tech View had
  Assigned Techs OFF, and with no saved columns Tech View starts with Assigned Techs off and VIN/Lead on (SV-11317). Clear and restore the
  preference inside the test.
- **Keyboard (C97021):** Tab stops on ONE card (Board View) or the first group header (Tech View) and then leaves; arrows move between
  cards. In the Reassign dialog, arrows from the search box do nothing: Tab to the first row, then arrow down. Headless Chromium ignores
  Alt+Left; use `page.goBack()`.
- **Profile menu theme:** "Light" and "Dark" are two buttons in ONE menu row; click the button by its exact word.
- **Names can differ on staging (corrects C581895's set-up note):** Carol Neal's staff record reads "Carol Neal" but List's Lead
  Technician shows "David Sparks" (no staff member of that name); Tech View/Board View show "Carol Neal". Use her when a test needs the two
  names to differ (`c581895-v2.mts`, `c581895-staff-carol.mts`).
- **Ticket status matters:** SV-11101 read OBSOLETE on 16 Oct while C96929 still fails; read statuses live before linking. SV-11310 (List
  pill widths) exists and covers C598326 step 3. #staging #techview #keyboard #queue #rule104 → L0394, L0399, L0401

## L0403 — 2026-10-16 — Re-read the PRD before filing a held draft: a version bump can turn a "defect" into the product being right
- **What happened:** seven problems from run 498 (staging v26.40.18-7d85b7d) were drafted against PRD **v54** (quoted by the cases).
  The live page was **v58**. v55 rewrote **S11-R1/S11-R3**: each view is ONE Tab stop, arrow keys move inside, Tab then reaches the
  focused item's own controls and leaves. The C97021 draft ("Tab stops on one card, then leaves") was the build FOLLOWING the PRD —
  a false defect (Rule 106 outcome 4). Only the narrow point "Tech View's single Tab stop lands on the Unassigned header, not a row"
  was against S11-R1 → SV-11422. C97021/C368151 Expected/steps now disagree with the PRD: reported, Expected not edited (Rule 114).
- **Always search Jira by requirement id AND by words before calling a problem new:** `text ~ "S5-R11b"` found SV-11336 (filed by
  Ahtasham Amjad 14 Oct, its footer already names C581895) that the draft's "none found among SV-113xx" list had missed — the draft had
  only scanned our own and Chris's ticket ranges.
- **A visual fault can be a symptom of another ticket:** C590122's invisible magnifier circle in Board View sits on the grey rounded
  panel that S3-R23 forbids (SV-11323) — the empty state itself is List's; not filed separately.
- **PRD silent ⇒ not filed even if the design shows it:** C590117's count tooltip "above the number" comes only from the design
  (the PRD sets tooltip placement only for the switcher, Density and Columns). Report it; the QA lead decides on a design-based ticket.
- **Rendered `<img>` count on read-back includes smart-link issue-type icons** (a ticket key in the body renders an `<img class="icon">`),
  so "img 2 / 1" after filing is not a stray picture — check the `src` before worrying.
- Files: `build/wo-board-tech-view/run498-2026-10-08/source-verify-2026-10-16/` (PRD v58 text, RECONCILE-7.md, FILED-2026-10-16.json).

## L0404 — 2026-10-16 — Two different Google sign-ins = two staging sessions that can run at the SAME time
- One staging Google sign-in holds one app session (L0394). The QA lead's Admin cookie (`/tmp/qa-cookies/staging-sso.txt`) and his
  "Analyst 1" cookie (`/tmp/qa-cookies/staging-analyst1.json`, bilal.muzamil+dako, the second company) are DIFFERENT Google
  sign-ins, so they do not end each other. Use this for any test that needs two people at once, e.g. C97012 "Session expired".
- Drive Analyst 1 by loading its three cookies into a Playwright context, host-only on app. and api.staging.shopview.com
  (`stg-orgb-seed.mts`). Never put its cookie through quick-login: that replaces its session.
- He calls the Analyst 1 company "comparatively cleaner" (few records). Use it where a big shop gets in the way, such as Unassigned
  loading in batches or 255 technicians. Add whatever data a test needs there. Password kept in `/tmp/shopview/staging-analyst1.env` only. #staging #signin #two-users → L0394, L0395

## L0405 — 2026-10-16 — Unblocking run 498 (batch 40): exact Schedule drops, the line's own Audit log, two-person tests, a clean company
- **Build moved under us:** staging served v26.40.19-72f4f3b at 10:40 UTC (not v26.40.18); `build-marker.mts` before every batch (L0401).
- **Location zone drifts too:** "Staging Heavy Duty - 9919" was back on America/Edmonton (audit times read 04:43 AM at 3:43 PM Karachi).
  `stg6-tz.mts` sets Asia/Karachi and checks the Schedule's "now" pill; run it before any test that reads a time (Rule 125).
- **Schedule drop = FullCalendar resource timeline, snapDuration 00:15, start = the 15-minute slot under the POINTER** (Schedule chunks,
  v26.40.19). The hour lines are `[data-date*="T13:00:00"]` slot cells (`td.fc-timeline-slot-lane`); release at line + 1/8 hour. While the
  mouse is held, `.fc-event-mirror`'s left edge shows where it will land. 9 AM saved 9:00 and 1 PM saved 1:00 PM (`C368179-drop-exact.mts`).
  The heading TEXT sits ~6 px right of the line, so aiming from the text was the 12:45 trap (L0400). "Choose lines" is a TAB in the drop
  window. Delete a shift with `DELETE /api/schedule/shifts/{id}?scope=shift` (shift | following | series).
- **A line's own Audit log:** click `line_number_<lineId>` and pick "Audit log" from the VISIBLE menu (`C96962-line-audit-stg.mts`).
  The labor sub-row's ⋮ only offers "Add Labor Fee / Discount" (playbook 054 trap). If saved pins do not take, pin through the column pin buttons.
- **Two people in company A at once:** Analyst 1's own user cannot join company A ("There is already a user with that email."). Instead, in
  a browser holding ONLY Analyst 1's Google cookies (sso + cf_clearance), the Dev Mode "Tech" quick-login gives Tech ShopView in company A
  on a separate session; give Tech the test role first, put it back after (`C97012-two-people.mts`). This replaces Analyst 1's app session:
  `analyst.mts` signs Analyst 1 back in through the app's own Email/Password form (POST /api/login) and saves the new PHPSESSID to its file.
- **One-session stand-in is not enough for permission checks:** switching users from the RUNNER's jar left the dispatcher's jar on a dead
  cookie (401). Switching from the dispatcher's own jar works, but a dispatcher reached by "switch user" had a drop ACCEPTED after the role
  lost Create & Edit, while the real second sign-in was signed out and refused. Judge permission changes with a real second sign-in.
- **Analyst 1 company for long-list tests:** Location A/B, technicians Bilal Muzamil and Test B2; Analyst 1 can create customers and work
  orders but not staff or roles. Tech View hand-over (C590131) needs Unassigned > one screen AND a full screen of rows after the next group's
  header (30 unassigned + 23 led by Test B2). `analyst.mts` opens a browser as Analyst 1. #staging #schedule #fullcalendar #audit-log #two-users → L0400, L0404

## L0406 — 2026-10-16 — "Deleted user" labor exists in the Analyst 1 company (S1-3); company A cannot make it; a card pill check waits on SV-11405
- **Company A (staging, v26.40.19):** a staff member with logged labor cannot be deleted: "Staff is being used elsewhere." after
  deactivation and a role change too; removing the location is refused ("Staff must be enrolled in at least one department from default
  location"). A person who is ONLY a line's technician deletes (200), and the Labor row then reads "Unassigned", not "Deleted user". The app's
  code holds one delete only (DELETE /api/staff/{id}); there is no account delete and no timesheet delete (`C368191-routes.mts`).
- **Analyst 1 company:** work order S1-3 (Customer 1), Line 1 "Gfhghfghg" reads "Deleted user"; its labor entries point at two staff ids that
  answer 404 "'Staff' was not found." Use it for C368191 (`C368191-orgb-steps.mts`, technician Test B2). Scan a company for such lines with
  `C368191-orgb-scan.mts`.
- **Settings > Staff search** matches one name field: "Gone B Tech 26846" finds nothing, and a deactivated person is on the Deactivated tab.
- **C590120 step 7** (List's pill with its red/blue numbers on the Board card, 22 px) is the open work item SV-11405 (Chris Ward, In Progress
  on 16 Oct): mark Blocked under Rule 112 until it is Ready for QA. Measured today: List and card pills 21 px; the card has no number.
- **Progress above 0 on demand:** progress = clocked labour minutes / Estimated Time; set Line 1's Estimated Time to 0.1 h in Edit Line and
  clock its technician ~100 s from their own window (29%). #staging #deleted-user #staff #rule112 #progress → L0405

## L0407 — 2026-10-16 — Check whether the Admin and Analyst 1 cookies share ONE Google sign-in before planning parallel sessions
- L0404 holds only when the two `sv_sso_session` values DIFFER. On 16 Oct evening the QA lead sent Admin and Analyst 1 cookies
  with the SAME `sv_sso_session`. Analyst 1's PHPSESSID answered 200, and the Admin PHPSESSID went 401 straight after: one Google
  sign-in, one app session (L0394).
- So compare the two `sv_sso_session` values first. Same value: Admin quick-login and Analyst 1 take turns, and a two-person test
  (C97012) needs another second person, such as Tech quick-login in a separate run (L0405 route). Different values: both can run at once. #staging #signin → L0394, L0404

## L0408 — 2026-10-16 — Finding the script that judged a test, a case's old wording, and an empty location for run 498
- **Which script judged a test:** match the dated start lines in each pass's `run.out` / `queue.out` (passes 2–10, the 16 Oct
  queues) to the time of the test's latest staging result. The last script that ran before that result is the judge. This mapping
  is now `run498-2026-10-08/full-map-1016.json` (278 tests, 70 scripts); the one-command run is `run-full-1016.sh`.
- **A case's wording at the time it was judged:** `get_history_for_case/<id>`. The first change AFTER the result's created_on holds the
  old value. Quick filter first: the case's `updated_on` is later than the result's `created_on`. On 16 Oct, 56 of 278 had changed.
- **"ZZAUTOTEST F2 Empty Shop" is no longer empty:** C368130 seeds work orders there. A "location with no work orders" test must make
  a fresh location and prove it holds zero first (draft `C614715-stg.mts`). #testrail #mapping #staging → L0401

## L0409 — 2026-10-16 — Keyboard scripts for PRD v61 (one Tab stop per view), and a status pill's red count has no seed recipe
- **Keyboard readings under PRD v61** (`run498-2026-10-08/kbd-fix4.mts`, helpers `kz`/`kp`/`kSearch`/`kTabIn`/`kArrowsTo`/`kDialogPick`):
  the view is entered by Search > Tab until focus is INSIDE the board/table (every stop kept, so "no header on the way" is read), then
  arrows only. After every key record the focused element's own data-test-id plus the card / column / row / group it sits in (walk up
  for `board_card_<uuid>`, not `closest('[data-test-id^="board_card_"]')`, which stops at `board_card_number`). "Focus leaves the board"
  only counts when the same run shows Tab landing ON the board (Rule 104).
- **Red service-actions count:** the list answer carries `serviceActionsCount` (and `partRequestsCount`), but no recipe in this repo
  makes a nonzero service-actions count; `design-stg5.mts` C590120 looks one up in the list and says so when none is found. The blue
  parts count comes from a part request on the line (C590115 recipe).
- **Editing a script block by text:** cut a `await run('Cxxxx', …)` block up to the NEXT `await run(` or a line that is exactly `});`,
  never the first `});` after it — `…, staff_id });` inside the block matches first and leaves half the old block behind (esbuild caught it).
  #keyboard #wo-board #scripts → L0408

## L0410 — 2026-10-16 — Before a long run: hold the sign-out step, and delete check-ins that would start it twice
- `signout-fix.mts` (C368240) ends the shared staging Google sign-in. If it runs at the end of a 9–15 hour queue, every fix-up
  re-run after judging needs new cookies from the QA lead. `run-full-1016.sh` now takes `NO_SIGNOUT=1`: run sign-out only after
  the fix-ups.
- A scheduled check-in written as "if the go-ahead came, start the full run" would start a SECOND queue once the run is already
  going by hand. Delete or rewrite such check-ins the moment the run starts. Two queues at once end each other's session (L0394).
- Before starting, check which cases changed since the scripts were prepared (updated_on, then `get_history_for_case` field diffs).
  On 16 Oct, 39 cases changed, but only build stamps, AUTOMATION markers and wording tidies: no Expected content. #long-run #signout #routines → L0383, L0394

## L0411 — 2026-10-16 — On a long run, post results as steps finish: the QA lead sees TestRail, not our logs
- 75 minutes into the full run (22 of 87 steps done) the QA lead asked twice "You are still not running any tests?". Nothing had
  reached TestRail, because judging was planned for the end. From the first finished steps onward, run a judging helper next
  to the queue that posts every few steps (`judged-full-1016.txt` tracks what is done). Every status names the step running and
  the steps done.
- `autocommit-1016.sh` commits and pushes the run folder every 20 minutes (secret scan first) until the queue ends, so the Stop
  hook's "uncommitted changes" never stalls a turn. #long-run #reporting → L0105

## L0412 — 2026-10-16 — Judging a long staging queue as it runs: where the readings are, and four script traps seen in run 498
- **Helper:** `run498-2026-10-08/judge-helper-1016.py <step> [--short]` prints, for one queue step, each test's live Expected, its log
  line, its JSON reading and the pictures taken during the step, plus the latest posted result. Some older scripts (`s1-batch2.mts`)
  still write to `RUN/evidence/` instead of `WOB_EV`; the helper searches both. Progress is in `judged-full-1016.txt`.
- **Coordinates for `annotate_v2.py`:** draw a labelled 100 px grid on the raw picture (source pixels) and read it once; several
  pictures in one contact sheet keep the cost down. Readings that carry element positions (sticky headers, rows) can be used directly.
- **Traps that made tests Blocked (our scripts, not the product):** `s1-batch1.mts` stops after C96909 whenever ONLY is set, so
  C154885 never runs; `s1-batch2.mts` ignores ONLY; `s1-batch3.mts` (C96920) refreshes AFTER loading the displays, so offline the Tech
  View part must be fetched again; column drags look for a `drag_indicator` icon the board column header no longer matches.
- **Shared user preferences bite:** Tech View collapse state and the chosen display are saved per user, and every script (and any other
  session on the same user) shares them. Mid-run, every Tech View group was found collapsed (C368135, C368136) and the page twice came
  back in Board View after Tech View had been chosen (C96917, C96928). Before a Tech View check, expand all groups and choose Tech View
  again, and read the preference back; whether the display really falls back on its own is still to be proved.
- **False stop after about 3 hours (22:44 UTC, step 30 of 82):** one quick-login landed on the Google sign-in page, the queue logged
  "STOP: staging sign-in expired" and "queue finished", but the next sign-in worked at once; it was resumed with FROM=30. A judging
  helper must not take one "queue finished" line as the end: wait until the process is gone AND the last line is "queue finished". Step 28 (`stg-new5.mts`) also hung for its whole 60-minute limit after C581892's third drag. A script that reloads
  its JSON from disk (`stg-new5.mts`) keeps the OLD readings of a test it never reached (C581896's were from 14 Oct): judge only readings
  whose pictures were taken in the step's own time window. #long-run #judging → L0411

## L0413 — 2026-10-17 — One script landing on Google's sign-in page is not proof the staging sign-in expired
- At 22:44 UTC, step 30 (c581895-v2.mts) logged "NOT SIGNED IN after 3 quick-login attempts" (accounts.google.com), and the full
  run stopped as "sign-in expired". A minute later `ensure-heavy.mts` signed in at once. The API with only the SSO cookie answered
  `not_authenticated` (alive), not `sso_required` (L0398).
- `run-full-1016.sh` now confirms with a fresh `ensure-heavy.mts` (`confirm_expired`) before stopping. Resume with `FROM=<the step that
  failed>`: that step never signed in, so it must run again. Tell the judging helper the queue continues, or it will take
  "queue finished" as the end. #staging #signin #long-run → L0393, L0398

## L0414 — 2026-10-17 — A message to a helper that has finished RESUMES it: pick one judge before sending, or results get posted twice
- After the false stop I messaged the first judging helper "the run resumed, keep judging". It had already finished, so I
  started a second judge. The message then resumed the first, and both were about to post steps 30+.
- Rule: when replacing a helper, either message the old one OR start a new one, never both. If both happen, send the old one an
  explicit STOP (no posting, no writes to the tracking file, kill its waiters) and ask what it posted after the cut-off.
  `judged-full-1016.txt` is the single record of what is judged. #helpers #double-posting → L0412

## L0415 — 2026-10-17 — Run 498 fix-up: what the eleven script faults taught (fixup-1017.mts, fixup-1017.txt, run-fixup-1017.sh)
- **Saved choices are read and logged before they are set.** `fixup-1017.mts` `startState()` logs "START STATE found …" (saved display,
  collapsedGroups, pins, filters, density from `/api/users/me/preferences/work-orders-list`, plus the display on screen) BEFORE setting
  anything, then `setDisplay()` clicks and reads the display back on screen AND in the saved preference (`display`: list / tech_view /
  board_view). Use it after every refresh / round trip: a fall-back to Board View is then SEEN, not a broken next step.
- **The Work Orders TAB has no Status chip** (Board View picture C96916-error, 16 Oct; List: high2-batch `statusButton: 0`). The All tab
  has it. C96916's rewritten starting screen ("Work Orders tab, Status = Approved") may not be buildable — the fixed script counts the
  chip (All tab = control) and records `statusReachable`.
- **Column / group drag handle = its own test id:** `board_column_drag_handle_<id>` (span.board-column-header__grip) and
  `tech_view_group_drag_handle_<id>`. `header.locator('i, .q-icon').filter({ hasText: 'drag_indicator' })` found nothing on staging
  although the grips were on screen.
- **Unbounded loops over page items hang a step for its whole timeout:** stg-new5 clicked every `.fc-event` on the Schedule (30 s + 3 s
  each); cap the count, cap the whole read (`capped()`), print progress lines, and dismiss browser dialogs.
- **Pin toggles read straight after another case's toggle are stale** (C96959): pin through the saved preference (PUT) and read back.
- **Another session's "evidence checkpoint" commits sweep in scripts being edited** in the same checkout (4ffbe5b28, 6c0979e0a took the
  fix-up edits mid-way): check `git log --stat` before reporting what you committed. #staging #scripts #preferences → L0412, L0413

## L0416 — 2026-10-17 — A wait-loop on a resumed queue log must read only the recent lines
**What happened:** a background "wait until step 53 ends or the run stops" loop on run 498's `logs-full-1016/queue.out` returned at once, because `grep -q "STOP"` over the WHOLE log matched the old false stop at 22:44 (before the `FROM=30` resume).
**Do this:** on a queue that has been resumed, test only the tail — `tail -40 queue.out | grep -qE "step (5[3-9]|…) end"` — plus `ps` for the runner. Never match a word that an earlier, already-handled stop wrote into the same log.
**Also:** a helper agent that ends its turn with "waiting for step N" has stopped; it does not keep watching. The main session waits (background until-loop) and resumes that ONE judge per batch (L0414).

## L0417 — 2026-10-17 — Run 498 fix-up 2: six script faults, and what each one teaches (fx6-1017.mts, fixup-1017.txt "C-fix2" lines)
- **A staging quick-login that fails on its FIRST click cannot recover inside the boot harness.** `qa-branch-boot.mjs` retries by
  clearing ALL cookies — the Google `sv_sso_session` too — so attempts 2-3 can only land on accounts.google.com, then it calls
  `process.exit(2)`. That is why c581895-v2 "could not sign in" twice while ensure-heavy signed in just before and after (L0413).
  `fx6-1017.mts openRetry(open, route)` turns that exit into an error and opens a FRESH browser (cookie files re-read), 45 s / 90 s
  apart. The shared harness was NOT changed (Rule 129: every staging script depends on it) — clearing only PHPSESSID there is a
  proposal, not done.
- **Technician pick lists (SV-11393, ~100 names, ends at Q): read the case's own wording before substituting.** "Names are examples"
  (C368166-C368168, C368174) → use the first name the list DOES offer (Ralph Edwards, else Jenny Wilson, else another offered lead) and
  log it. "Names … are examples, EXCEPT names the expected results quote, which must be used exactly" (C368171) → no substitute; log
  the whole list (count, first, last, Ralph offered, Esther/Dana as the control) so the judge can mark it against SV-11393.
  `fx6-1017.mts pickTech()` does both (`exact: true`).
- **A filter's "All …" row text starts with its tick-box icon word**, so `/^\s*(Select all|All\b)/` never matched it (C368233-C368235
  step 6 never ran) and a numbered pick of option 0 chose the default "All manufacturers" (C368224/C368225 chose nothing). Strip the
  icon word first (`cleanOpt`, `clickAllItem` in medium-fix3.mts) and skip the "All …" row in a numbered pick.
- **The Purchase Order receive form re-draws after a vendor is picked** (a spinner over the parts table): a Vendor Invoice # typed
  before that is wiped and Receive Parts stays disabled (C368213, picture C368213-receive). Wait for the spinner, type, READ BACK, retype.
- **Schedule blocks: use the calendar event element and let Playwright scroll it**, or re-measure after the scroll settles; a box read
  in the same breath as `scrollIntoView()` came back 12,600 px down and the click hit nothing (C368190). Seed the shift the case needs
  first (Schedule drag, `mkShift` fallback) and read it back before judging "removed".
- **Production in the same script as staging is safe when it signs in by password** (`prod-login-boot.mjs`, second production
  account): it does not touch the staging Google sign-in (L0394), so a case's "repeat on production" step can run in its own browser
  right after the staging steps (medium-fix3 `caseSteps(..., 'production')`).
- **`seedCase()` makes a case's work orders ONCE; later runs inherit whatever leads earlier runs left** (C96936 found no work order
  with its first technician and stopped). Set the leads every run and read them back before step 1; a check that ADDS a technician
  to a line needs a fresh work order per run (C368161: Aaron Baker was already on the re-used line, so the list no longer offered him).
- **Tech View's held group header is a drawn copy (`.tech-view__sticky`) with no `<button>`**: click its
  `.tech-view-group-header__icon` and read the collapse in place (saved `collapsedGroups`, scroll position) before scrolling back
  (C368127 step 7).
- **An "empty" precondition must be made true and read back every run** (C154886: S2-35718, left with no lead by the 15 Oct run,
  kept Unassigned from ever being empty). **A "hidden until hover" reading needs focus cleared first** (click a neutral spot, blur,
  park the mouse) and the effective opacity up the ancestors plus `document.activeElement` recorded (C96945).
- **ensure-heavy.mts fixes the ADMIN's location, not the runner's** (ZZ WOB Runner, runner.mts): a script that switched the runner to
  Lethbridge and back with the API left it there (L0399), and the next runner script searched an empty board (C96977/C96981). Read and fix
  the runner's own top bar through the menu before searching. **A reorder test must ask for a NEW place**: dropping a card on the top of
  the card it already sits above changes nothing (C96963 step 7).
- **A batch script's cases must each start and end clean** (high2-batch `caseEdge`): one case's saved Status filter hid the next
  cases' new work orders, and one case's location switch hid the next one's. **Quasar option lists move a HIGHLIGHT, not the browser
  focus** (C368151): read `q-manual-focusable--focused` / `aria-activedescendant` beside `document.activeElement` after each key.
  **Measure a hover target at the moment of the hover** and check `elementFromPoint` (C590124).
- **Board View draws only the columns near the screen**: scrolling to one end of a drag un-draws the other (C614711 steps 6/10 timed out
  on `board_column_deleted` / the card). Bring the source on screen, hold the card and walk the board until the target is drawn
  (`dragAcross`), or pin the target technician first. Column grips are their own elements (`board_column_drag_handle_<id>`), not a
  `drag_indicator` icon (C97003).
- **A queue reads its list once, at start**: lines added after run-fixup-1017.sh started go to a NEW list (fixup-1017c.txt) run by a
  copy of the runner (run-fixup-1017c.sh, own log dir) chained behind it (after-fixup-1017c.sh waits on `[r]un-fixup-1017\.sh`, a
  pattern that does not match the copy). Never edit a running bash script. Closing New Work Order asks "Are you sure you want to
  close this dialog?" — answer it (C614715).
- **The end-of-run sign-out batch** (`signout-1017.txt`, `signout-1017.mts`, `run-signout-1017.sh`, `after-signout-1017.sh`): each case's
  state is made, then a REAL Logout and a REAL sign-in on the sign-in page (Admin quick-login), "SIGN-OUT done / SIGN-IN done" logged; a
  failed sign-in exits 9 with an `sso_required` line so the runner re-checks and stops. User-B on the shared Google sign-in can only be the
  "Tech" quick-login — its saved display is read first and a changed one is reported, never used as "never changed" (C96912).
  #staging #scripts #signin #sv-11393 → L0394, L0396, L0413, L0415, L0425

## L0418 — 2026-10-17 — Reading a run's history: what a full re-run's posts did to earlier verdicts (run 498)
- **`build/testing-tools/tr_client.py` `get()` returns a TUPLE `(http_status, body)`**, not the body: `_, r = t.get("get_tests/498&limit=250&offset=0"); r['tests']`; `_, rs = t.get(f"get_results/{test_id}&limit=3"); rs['results']`. Page `get_tests` by 250.
- **After each judged batch, diff each case's NEW result against its PREVIOUS one** (last 3 results per test). Two things only that diff shows: (1) **Failed → Passed** = the ticket's fix may have shipped (Rule 61 outcome 3) — read the ticket's live status and tell the QA lead (C96927: Failed 16 Oct on SV-11317, Passed 17 Oct, ticket in TESTING STAGE); (2) **Passed → Blocked by a script fault** = the re-run made the run look worse than the build is — queue a fix-up at once (C96936, C368127, C368161, added to fix-up 2).
- **Run totals can move by more than the batch explains** (passed 201→199 after 11 passes): previously-passed tests re-posted as script-fault Blocked. Never report the totals without that diff.

## L0419 — 2026-10-17 — A background wait-loop is cut at 30 minutes unless it is given a timeout
A background Bash wait-loop ("until step 53 ends", loop limit 3000 s) was stopped by the harness after 30 minutes. That is the DEFAULT background `timeout` (1,800,000 ms), whatever limit the loop sets itself. For any wait longer than 30 minutes, pass `timeout` explicitly (up to 7,200,000 ms), and keep the loop's own limit below it. Being stopped is NOT a sign the run stalled: read `queue.out` before reacting (run 498 step 51 was still moving).

## L0420 — 2026-10-17 — Run 498 steps 61-68: one test's leftover state blocks the next four, and three reading traps
- **A filter left on cascades.** high2-batch C368198 ticked Status: Invoiced and never cleared it; C368200, C368201, C368212 (and the phone views of C368209/C368210) all ran with it on, so their own work orders were hidden and the row locators timed out. C368212 then left the location at Staging Lethbridge, which blocked C368214. **Every script step that starts a test must clear filters, Search and the location first, and read them back** (the picture "C3682xx-error.png" shows the chip — look at it before calling a timeout a product fault).
- **Compare like with like.** design-stg5 C590115 searched List down to one work order (Approved pill 72 px) but read Tech View unsearched, where a Ready For Review pill sets every pill to 114 px. List pills match the widest pill on the page (C598326), so a width comparison needs the same search in both views.
- **Hovering the middle of a box is not hovering the thing.** The Assigned Techs cell is 120 px wide with 2 small avatars at its left; hovering its centre hits empty space (C590114, C590124) or the second avatar (C590124 bubble showed Technician-B). Hover the avatar element itself.
- **Column Selection toggles in Tech View have no data-test-id**; a test-id lookup finds nothing and silently skips step 5 (C590113). Find them by their label text.
- **A precondition location can be changed by another session**: ZZAUTOTEST F2 No Tech Shop now has Ayesha Khan as a technician (C368130). Read the technicians there and take them off before judging.

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
