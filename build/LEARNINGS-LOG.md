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

## L0301 — 2026-10-09 — A KEYWORD SEARCH IS NOT A FILTER (QA lead, after SV-11099 was filed in error)

**What happened:** I filed SV-11099 ("a search with no results has no Clear filters action") against PRD S1-N1,
*"When filters return no results, show the existing List empty state and Clear filters action…"*. The QA lead
marked it **Obsolete** the same hour and deleted its test case: *"the message "No Workorders match these
filters" … shows the clear all filters button when the filters are applied … Searching through the keywords
does filter on the page the date but its not applying a filter. Applying a filter is what you see in the
screenshot. You might have made similar mistakes somewhere else too."*
**The fact:** on Work Orders, a **filter** is a header chip (Status, Assigned to me, Asset on Site). With a
filter that matches nothing the page reads *No work orders match these filters* / *Try removing a filter to
widen your results.* with **Clear all filters** — which is what S1-N1 asks for, and the build does it. Typing
in **Search** narrows the rows but is NOT a filter; its own message (*No work orders match the search "…"*)
is not governed by S1-N1.
**Reusable rule:** before judging any requirement that says "filter", check WHICH control the source means.
A search box narrowing a list is not "a filter" unless the source says so (exception, his own ruling of
9 Oct: on the Parts pages that have no filter chip, the page Search is the filter used for those cases).
**Swept the same day:** every run 498 result and case that mentions both search and filters — the other
hits used Search only to narrow the list to the test's own records, and no other report rests on it.

## L0302 — 2026-10-09 — AN ASK WITHOUT THE STEPS CANNOT BE ANSWERED (QA lead, on the click-outside question)

*"You are not giving me the context neither I know the steps to follow what you are saying to verify what you need."*
I put the click-outside question (D6, C368135) to him as a requirement quote and my opinion, with no route to the
screen, no example record and no picture. Rule 99 already requires every ask to be answerable without opening
anything. **Reusable rule:** every question about a behaviour carries (1) where the feature is and what it does,
(2) numbered steps he can follow himself, including the example record and how to make one, (3) what I saw, with
the picture attached, (4) what the requirement and our test each say, quoted, then (5) the options.


## L0303 — 2026-10-09 — THE PRD WINS; PRODUCTION IS NEVER USED TO DECIDE WHAT THE PRD MEANS (QA lead)

*"You are not supposed to tele the PRD with production to confirm if PRD is correct. PRD wins over the production branch,
production branch is just used for comparison for a few cases where needed and where you need to tell me how it is behaving
in production. For this test case/defect you need to know what the PRD is asking and what is actually happening."*
**What happened:** for D8 I read PRD S4-R18 ("Continue existing line auditing for technician changes made directly on a work
order line"), then checked production to decide what "existing" covered, and was about to call the build "not against the
PRD" because production also writes nothing. **Reusable rule:** judge a case or a defect on two things only — what the PRD
says, read plainly, and what the build does. Production is a comparison shown to him when asked or useful, never an input
that narrows or reinterprets the requirement. Where the PRD's words are genuinely unclear, ask him (Rule 58); do not let
production settle it.


## L0304 — 2026-10-09 — LEAD TECHNICIAN CHANGES ARE IN THE WORK ORDER'S LOG, NOT A LINE'S (QA lead, with a recording)

On a work order page, the ⋮ at the top right (next to New Line) > **Audit Log** opens the **Work Order Log**: lead changes
read *"Lead tech changed — Lead tech: A → B"*. A line's own log (click the line number > **Audit log**, "Line Log: Line 1")
does not show lead changes — and for lines that moved with the lead it should not (PRD S4-R17). I judged C96962 on the line's
log and filed SV-11107; he closed it as Obsolete and had the case corrected. **Reusable rule:** before calling an audit entry
missing, open EVERY log the product has for that record (work order log AND line log) and name which one the source means.


## L0305 — 2026-10-09 — THE MODEL FOR PRECONDITIONS AND STEPS IS C96962 (QA lead: "a great example of a good test case preconditions and steps")

His ask: *"Keep the precondition and the steps super simple build glossary and understandable for the manual QA tester, keep it all understandable runnable and concise"* — then, of the result, *"Great this is a great example"*. The shape (case-edits/C96962-new-fields.json): 3–4 precondition bullets (who signs in; the record needed WITH a named example; one line on how to make it if missing; the other people needed, with examples); 8 short numbered steps, one action each, the screen's own labels, "e.g." names inline, "Repeat steps 3 and 4" instead of re-writing. Written through the TestRail editor (case-edits/ui_write_pre_steps.mjs) so it renders; expected untouched.

## L0306 — 2026-10-10 — EVERY TICKET IS COMMENTED IN THE RUN WITH ITS FULL LINK; AN OBSOLETED TICKET MEANS ASK "MARK THE TEST PASSED?" (QA lead)

*"make sure that each defect you create must be commented in the Test case Run with the complete ticket link to be tracked and once I
obsolete that ticket you need to ask me if we then need to mark the test case run as passed? if I say yes then act accordingly."*
**Do:** the run result for the failed case carries `https://shopview.atlassian.net/browse/<KEY>` in its comment AND the key in the
Defects field (push_results_to_run.py does both from the ticket text). At every check-in, read the status of each ticket we filed;
when one reads OBSOLETE, ask him in plain words whether to mark that test Passed — never mark it on your own (his earlier
"mark the test as passed too" for SV-11101 was a one-off answer to that question, not a standing permission).

## L0307 — 2026-10-10 — A WATCHER MUST TEST THE REAL THING, AND MUST BE PROVED ABLE TO SAY "UP" (QA lead: "Branch is back, since 30 minutes why could not know that? … Your watcher does the same all the time")

**What happened:** the branch's quick-login answered 503 early on 10 Oct. I started a watcher that pinged `/api/version`
without signing in and waited for JSON. Signed out, every `/api/...` path on a QA branch returns the plain web page — up
or down — so the watcher could NEVER report "up". The branch came back and I did not know for ~30 minutes; he had to tell me.
The same mistake had happened before: a watcher built on a signal nobody had checked against a known-good state.
**Rule, three parts:**
1. **Watch with the real action.** "Is it back?" is answered by doing what the work needs — a real sign-in through the
   suite's own launcher (`build/testing-tools/wait_branch_up.sh` does exactly that) — never by a signed-out ping, a status
   code or a page title.
2. **Prove the watcher can say "up" before trusting its silence.** Run the check once at start and print its answer
   (the script does); if the thing is known to be working somewhere, check the watcher returns "up" there first (Rule 104:
   a negative needs a positive control — "still down" is a negative claim).
3. **Never rely on the watcher alone.** At every message to the QA lead during an outage, do one real check by hand and give
   its time; and re-check on any status turn. A quiet watcher is not evidence the outage continues.

## L0308 — 2026-10-10 — A filed ticket is HIS text now: add to it, never rewrite it from the draft
Before adding pictures to SV-11123 and SV-11125 I compared the live description with my draft: the QA lead had edited both
("Do not pick this up - I need to double check it in the evening today"). Re-sending the draft would have erased his note.
Rule of thumb: after filing, a description is changed only by INSERTING into the live text (the picture line above
Environment), never by replacing it with a local copy. `defect-drafts/addpics.sh` now works that way.

## L0309 — 2026-10-12 — "Which tickets did HE mark Obsolete" is read from the change history, never assumed
Asked to delete the test cases of the tickets the QA lead marked Obsolete, I had already told him on 10 Oct that he marked
SV-11122 Obsolete — the change history shows Ahtasham Amjad did. Read `/rest/api/2/issue/{key}/changelog` (the status item
whose toString is OBSOLETE, and its author) before attributing an action to anyone. Also: TestRail `delete_case&soft=1`
deletes on this instance (playbook).

## L0310 — 2026-10-12 — Same on production ⇒ not a regression (now Rule 121)
QA lead: "any issue which is the same on production too is not a regression." Every regression-folder failure is checked on
production BEFORE it is put to him as a defect. Recorded as Standing Rule 121.

## L0311 — 2026-10-12 — A freeze that only my browser shows: pause it and read the stack before blaming anything
The sign-out test "froze the test browser" for three days and was parked as manual. Pausing both frozen tabs with the
debugger (CDP Debugger.pause) showed them looping in app code, triggered by MY harness's init script rewriting the session on
every page load. A clean context made the test pass in one run. Rule 104's "what would make this MY fault" includes the
harness's own injected scripts — test without them before parking a check.

## L0312 — 2026-10-12 — The harness shows QA-branch times in UTC: never judge a displayed time through it
Two tickets were filed from the run 498 harness (SV-11229 Schedule drop "six hours late", SV-11230 time entry "six hours
ahead, refused as future"). The QA lead's own recording, signed in normally, kept the 1 PM drop at 1 PM and obsoleted
SV-11229 within 20 minutes. Proof: signed in the way a person does (`qa-branch-boot.mjs`, quick-login button, nothing
injected), the same records read correctly — the entry made at 09:22 UTC lists as 1:22 PM in a Dubai shop, the "7 PM" shift
sits at 1 PM Mountain time — and the same entry moved to line 2 with no refusal. The records were SAVED right; the harness
(global-search `boot.ts` + `session.mts`/`runner.mts`, any browser zone, with or without Switch user) DISPLAYS them in UTC,
and a form re-saving a displayed time then sends a wrong one. Not the browser zone (UTC and Karachi alike), not Switch user
(Admin without switching alike), not the injected user copy (it already carries America/Edmonton). RULE OF THUMB: any check
whose verdict is a displayed date or time on a QA branch is judged in a `qa-branch-boot.mjs` browser, never the harness —
and a time fault is compared against a normally-signed-in browser BEFORE it is put to the QA lead (Rule 104 proof 7).
Evidence `build/wo-board-tech-view/run498-2026-10-08/evidence/clean-tz-2026-10-12/`, scripts `clean-tz-check.mjs`,
`clean-labor-read.mjs`, `tz-harness-probe.mts`.

## L0313 — 2026-10-12 — Re-test another tester's failure with THEIR route; and read the shop's own time zone first
Re-testing Ahtasham's three failures: with shifts made behind the scenes (API create, then moved to an exact moment) two of
them did NOT happen (the line followed the new lead; the Clear shifts question appeared). Made his way — dragging the work
order onto the Schedule for later today — both DID happen. The route that makes the data is part of the test. Separately,
**Staging Heavy Duty - 9919 on sv10043 is now set to Asia/Dubai** (Administration > Locations, read 12 Oct; it was
America/Edmonton): shifts created with a start date and time then land in Dubai time, and the Schedule's "now" line reads
Dubai time. Before any time-of-day check, compare the Schedule's "now" line with the shop's zone read off Locations. Changing
location with `iam/change-location` alone does not change what the screen shows (playbook, already recorded — search first).
A one-line work order dropped on a technician's Schedule row creates the shift at once, with no window.

## L0314 — 2026-10-12 — "Read it in Google Analytics" is not a blocker: test the product's half on the QA branch
Three analytics checks (C97026, C97033, C97034) said "open the Story 12 report in Google Analytics". I chased access to
Google Analytics (PowerTools, a read-only Google key from the QA lead — his account had no Analytics access at all) and filed
SV-11240 asking a developer. The QA lead asked "do you really need Google Analytics?" — no. ShopView's share of Story 12 is
the events it sends (PRD: "Engineering's part of this story ends at sending the events"). Recording each test user's events
on the QA branch (`ga-week.mts`, events intercepted at /g/collect) and applying the PRD's formulas (`ga_calc.py`) gave the
expected figures exactly: C97034 List 4 / Tech View 2 / Board View 1, density 1/1/1; C97026 default vs saved. Both Passed the
same hour; SV-11240 closed Obsolete. Lesson: ask what the product under test owns, test that, and name the slice not seen.
Now Rule 107 fourth amendment (107.J–L). Also: the agreed event rules (SV-10593, Slavcho/Milos 6 Oct) define "saved" as
"came from their account or was chosen on this visit", so a new user's Board View click is correctly "saved".

## L0315 — 2026-10-12 — `wob-run.sh` runs with `env -i`: any setting it does not list is silently dropped
`PHASE=c97026 ./wob-run.sh ga-week.mts` ran the DAY-1 steps again (PHASE fell back to its default), toggling test user FS1's
VIN/Serial back off and adding visits for WK1. Fixed three ways: wob-run.sh now passes PHASE, WOB_GA and WOB_FRESH_GA;
ga-week.mts refuses to run without an explicit PHASE (no default); FS1 put back with `PHASE=fs1fix`. Rule of thumb: a new
env setting for a harness script must be added to the launcher's env -i list, and a destructive phase must never be a default.
Also: `pkill -f <pattern>` kills your own shell if the pattern is in its command line — use `pgrep` then kill by PID.

## L0316 — 2026-10-12 — "Already clocked into different line" with no clock to stop: use fresh clockable technicians
Retesting C96978 on v26.40.14-e84b3d1, clocking in Esther Howard / Ralph Edwards answered 400 "You are already clocked into
different line." while `my-current-task` showed NO running task at either location (so there is nothing to clock out).
Instead of chasing it: `FRESH_CLOCK=1 ONLY=C96978 ./wob-run.sh s5-batchC.mts` makes two brand-new clockable technicians with the
same role and clocks them in (201/201) — the Clocked in field was then judged normally. Data workaround, not a product fault.
Also: `annotate_v2.py --scale 2` takes FULL-RESOLUTION pixel positions of the source picture (2x), not screen positions.

## L0317 — 2026-10-12 — An offline test on a QA branch lands on the sleep page: the QA build redirects every network error
Retesting C96968 (SV-11074) with the browser really offline, the page jumped to Chrome's "No internet", then to
sleep.qa.shopview.com. The app's own code (QA builds only, `env === "qa"`): any request failing with "Network Error" and no
response shows "QA env is sleeping — Redirecting…" and sets window.location to the sleep page. So on a QA branch an offline
check can prove "nothing was replayed after reconnect" and, with the request refused instead, "card back + exact alert", but
NOT the offline alert itself — that is checked on staging/production, where the redirect does not exist. Never call the
redirect a product fault; never call the offline alert "verified" from a QA branch.

## L0318 — 2026-10-13 — The QA lead's own rulings go into a test as one dated decision line, never as our chat
On 12 Oct the rewritten tests quoted the QA lead's chat with this session (questions, answers, option labels), and one carried a
personal remark. He asked for the remark to be removed everywhere and then: "In these test cases do not add my conversation with
you". Rule (13 Oct, his words): his own ruling = "a short dated line saying what you decided, never our chat"; someone else's
ruling = quoted word for word. Also: `safe_case_edit.py` saves TestRail's case history into the repo, and that history keeps
every old wording — it now blanks the personal remark automatically; check any other sensitive text before committing snapshots.

## L0319 — 2026-10-12 — Edit a TestRail case with `safe_case_edit.py`, then scan the served page (make its folder first)
`python3 build/testing-tools/safe_case_edit.py <id> <fields.json>` is the one-case editor: ours only (created_by 3, never
Vladimir's), snapshot + history saved first, only the named fields sent, read-back must equal what was sent, untouched fields
and automation flags must be unchanged (exit 1 otherwise). Then `IDFILE=<ids.json> OUT=<dir> node
build/inline-add-edit-parts/build-verify-2026-09-01/tools/served_page_scan.mjs` — it crashes with ENOENT unless `<dir>/evidence/`
exists, and with ERR_PROXY_CONNECTION_FAILED unless `ensure_bridge.sh` ran. The stored-value checker (`check_case_render.py`)
flags `<strong>` headings that render fine in a `fr-view` container — the served-page scan ("literal tags visible: 0") is the
judge. #testrail #tools → KNOWLEDGE-MAP "Recording results and changing test cases"

## L0320 — 2026-10-12 — The Automated flag moves: read it live (and its history) before telling the engineer
Vladimir Tomovic set C154884 and C96977 to Automated at 09:28 UTC and back to Not Automated at 18:35 UTC the same day — after I
had listed them as "automated, rewritten". `python3 build/testing-tools/automated_edit_scan.py <run>` reads every case's
history and lists our text edits made while a case was Automated (TestRail rate-limits bulk history reads — it retries).
#testrail #automation #rule-65 → `build/testing-tools/automated_edit_scan.py`

## L0321 — 2026-10-12 — TestRail case history keeps every old wording, so a saved snapshot can leak what was removed
After a personal remark was taken out of three tests, `safe_case_edit.py`'s history snapshots (pushed to this public repo)
still carried it, because TestRail's history holds old versions forever and only a TestRail admin can clear it. The tool now
blanks that remark in every snapshot; for anything else sensitive, grep the snapshot before committing. #testrail #secrets #mistake-corrected

## L0322 — 2026-10-12 — A "different day" test must differ in the zone the measurement uses, not only in Pakistan time
C97033's day 2 ran at 00:07 PKT on 13 Oct = 19:07 UTC on 12 Oct, so both "days" were the same UTC date. ShopView's part (each
user's events, ids and on/off values) was unaffected, but if the day split is ever judged, pick a time that is a different
date in UTC AND the shop's zone AND PKT (e.g. after 09:00 UTC next day, as first planned). #analytics #timezone

## L0323 — 2026-10-12 — Run comments: `push_results_to_run.py` printed a stray "None." under Passed results
A Passed result with `todo: "None."` rendered "None." after a rule line. Fixed: "none / nothing / n/a / nothing for the tester"
is no longer printed. #testrail #tools

## L0324 — 2026-10-13 — Finding what was learned before: `recall.py` + `KNOWLEDGE-MAP.md` (Rule 127)
The QA lead asked for a mechanism that tells a session instantly, on a NEW suite, that something similar was done and where it
is written. The learnings log (~410 KB) and playbook (~535 KB) can no longer be read whole. Now: `python3
build/testing-tools/recall.py "<words>"` searches learnings, playbook, map, skills, rules, project files and tool headers and
prints the best blocks with file:line; `build/KNOWLEDGE-MAP.md` lists "I am about to …" tasks with the file to open and the
suites done. Every project keeps a `PROJECT-STATE.md` (WO Board's was missing — written 13 Oct). The QA lead's earlier answers
in a session: `build/testing-tools/find_ruling.py "<words>"`. #methodology #retrieval #rule → Rule 127

## L0325 — 2026-10-13 — Learning is saved automatically: a Stop hook checks it, a SessionStart hook recalls it (Rule 127 amendment)
The QA lead: learning must be saved and made retrievable without him asking, every time. A rule alone depends on remembering it,
so it is now enforced by project hooks in `.claude/settings.json` (committed): `learning_gate.py` (Stop) blocks once when work was
committed with no learning-store change since the last save — proved on a copy of the repo at the 12 Oct "engineer note" commit,
where it would have caught a reusable tool left in a run folder; `session_start_recall.sh` (SessionStart) puts Rule 127, the
recall command and the newest learnings into every new session. Acknowledge a stretch with nothing new:
`python3 build/testing-tools/learning_gate.py --ack "<why>"`. #methodology #retrieval #hooks → Rule 127 amendment

## L0326 — 2026-10-13 — Big files: retrieve blocks, budget every store, split byte-verified, distil (Rule 128)
Ten knowledge files had grown past what can be read in one go (playbook 524 KB, rules 441 KB, learnings 405 KB, core skill 176 KB,
five PROJECT-STATEs and two skills over 100 KB). Fix, permanent: `recall.py` returns blocks (`--show`, `--rule N` with every
amendment, `--section … --file …`) so cost follows the answer, not the file; `knowledge_health.py` budgets every file and splits
over-budget stores into `build/kb/<stem>/` parts with sha256 proof, leaving an index of every heading at the same path (playbook →
28 KB + 55 parts, log → 23 KB + 4 parts). Files that tools parse whole (rules, core skill) stay whole until those tools read
`knowledge_health.py logical`. Hooks warn at session start and block a stop while a store is over budget. #methodology #retrieval #rule → Rule 128

## L0327 — 2026-10-13 — An improvement can break what it touches: find the dependants, prove before/after, add a self-test (Rule 129)
The recheck the QA lead asked for found two things today's improvements had made worse: (1) after the playbook/log split, the
Rule 97 drill, four handoffs and the core skill still said `grep … build/APP-ACTIONS-PLAYBOOK.md`, which now searches only the
index — a session would miss a recipe and rediscover it; (2) the Stop hook, run from outside the repo, could not find its script
and python's exit 2 counts as BLOCK — every turn would have been stopped. Both fixed; hooks now exit 0 on a missing script or a
crash; over-budget uses exit 10 so a crash is never read as a finding. `selftest_workspace.py` (20 checks, ~5 s; `--compare
<ref>`) now guards the shared machinery and the Stop hook runs it after any shared change. Proved by deleting a part on a
throwaway worktree: the stop was blocked and the missing part named. #methodology #regression #hooks → Rule 129

## L0328 — 2026-10-13 — Fail-safe pass over the day's changes: scenarios, not just checks (Rule 129 amendment)
Asked to be "better than today and not worse", the day's changes were run through the situations the workspace actually meets.
Found and fixed: (1) the split tool numbered new parts by COUNT — after a lost part the next split would have overwritten another
(now: after the highest number, and files are opened 'x', never overwritten); (2) a learnings log with no entry for 14 days
would have made the split crash on the file's last newline (now lossless at +15 days, +10 years and odd endings); (3) a burst of
learning inside 14 days could leave nothing to move, so the Stop hook would block every turn (now the hot window shrinks to half
the budget, and a file nothing can shrink is a WARNING, never a block); (4) the run-comment "None." filter must apply to Passed
only. Proved: fresh checkout + new session, a machine without node (skipped, not failed), search of another branch, a lost
part + new split. Every scenario is now a self-test check (30 checks, ~6 s). #methodology #regression #failsafe → Rule 129

## L0329 — 2026-10-14 — Before any build verification, check whether another session did it already today
The QA lead sent "build verify these 6 on staging" here; another session had build-verified the same six on the same staging
build 20 minutes earlier (branch `claude/build-verification-setup-aieu36`, stamps already on the cases). Found in two
minutes by: TestRail `get_history_for_case` (who/when changed each case today) + `git log --all --oneline --since=<yesterday>`
+ `git grep -l <C-id> $(git for-each-ref --format='%(refname)' refs/remotes/origin) -- build` + reading the live build
string (`curl` the app root with the three staging cookies, grep `v26\.`). Same build ⇒ the earlier check still counts
(Rule 77): say when it was done and ASK before re-walking (Rule 80); read its evidence for FACTS only (Rules 86/119) — here it
had left "not yet checked against a build" beside the new stamp, and its build search did not find two expected headings.
#build-verify #cross-session #staging → Rules 77, 80, 86, 119

## L0330 — 2026-10-14 — New or rewritten cases are RUN, not asked about; and the staging set-up traps that cost an hour
**Ruling (QA lead, 14 Oct):** three new cases never had a result and three were rewritten after a PRD change — both obviously
need running on the new environment. Asking "re-check or accept?" was wrong: read the run (Untested = never run; a case updated
after its result = its result is stale) and act. Results first; only then tidy the case (he: "Only removed once you add the
results in the test run"). Staging is a dummy environment: create/change anything without asking (Rule 107).
**Traps (staging, v26.40.17-ddb9ba1), each now handled in `run498-2026-10-08/stg6.mts`:**
(1) The Schedule lists only some departments (Administration, E2E Test Department, Service, Work order status). A technician
in "Service/Parts" gets NO row, and the board returns their shifts with `staffId: null` — the shift drawer says "TECHNICIAN
Unassigned" although the shift is theirs (the clear-shifts question still names them). Make technicians in EXACTLY "Service";
`POST /api/staff/{id}/change` IGNORES `departments`, so a wrong one means a new person. (2) The run-498 harness sign-in shows the
Schedule clock in UTC on staging too (L0312); use the normal sign-in — `bootOrigin` now carries `cf_clearance` from
`/tmp/qa-cookies/staging-full.json` — and prove Rule 125 with `tz-match-staging.mjs`. (3) Heavy Duty has work orders in every
status; for "no work order in status X" use QB Location (none in Estimate / In progress / Declined on 14 Oct). (4) Switch
location ON SCREEN only (profile menu → `select_location`) — I repeated `iam/change-location` although L0056/L0234 say why it
fails: run `recall.py` before the first probe, every time. (5) Status filter options are read from the menu's text, not
`.q-menu .q-item`; and work order numbers differ per location (`SMQ1-…` at QB Location) — never match `S\d+-`.
(6) The Schedule's own "Search schedule…" box (magnifier, `input_schedule_search`) + clicking a shift shows its technician,
time and lines — the fastest on-screen read. #staging #schedule #setup #ruling → Rules 107, 113, 125

## L0331 — 2026-10-14 — Results went into the run with no annotated screenshots (Rule 130)
Six staging results were posted as text only; the QA lead: annotated screenshots are the proof of a pass or a fail, always —
but ask him first whether they go on the result. Now: the pictures are made with every pass (`annotate_v2.py`, listed per case as
`"pictures"`), the ask is one plain question per batch, and `push_results_to_run.py` refuses to write without his answer
(`--screenshots yes|no`); `--attach-only` adds pictures to results already posted. #results #screenshots #evidence → Rule 130

## L0332 — 2026-10-14 — Running the whole WO Board suite on staging: five things the QA-branch scripts assumed
(1) **Location zone hard-coded** — 20 scripts switched to Heavy Duty with `workplace_timezone: 'America/Edmonton'`; after Rule 125
put it on Asia/Karachi they now read `process.env.WOB_LOC_TZ` (default unchanged). (2) **Sign-in** — `session.mts` takes
`WOB_NORMAL_SIGNIN=1` (bootOrigin, the sign-in page) because the harness sign-in shows the Schedule in UTC (L0312).
(3) **Technicians** — `staff.mts` now picks the department EXACTLY "Service"; an account email can never be changed (staff
change → "Email already associated with another account"), so the wrong-department four were renamed "ZZOLD …" and
`WOB_STAFF_ALIAS=.svc` maps the suite's usual emails to the ".svc" people. (4) **Evidence** — most scripts write to a fixed
`evidence/` (not `WOB_EV`), so a run on a new environment OVERWRITES the QA-branch JSON/PNGs in the working tree: compare
against `git show HEAD:` (`stg_compare.py`), then move the new files to the run's folder and `git checkout -- evidence/` before
committing. Several scripts keep only part of their readings in the JSON — the LOG is the full record. (5) **Sign-out last** —
`rerun-order-staging.txt` leaves `signout-fix.mts` out (it can end the shared sign-in); run it after everything else.
All five are set by `source run498-2026-10-08/stg-env.sh`. #staging #rerun #scripts → Rules 125, 126, 129

## L0333 — 2026-10-14 — The suite's location picker finds no options on staging; use `select_location`
`s1-batch4a.mts` (C96912, C96923) switches location by opening the menu and looking for the location as a menu option —
on staging it found 0 options three times and stayed put. The route that works on staging is the profile menu
(`profile_menu_button`) → `select_location` → `.q-menu .q-item` with the name (stg6.mts `switchLoc`, L0234). Such checks go on
`evidence/staging-full-2026-10-14/REDO.md` and are re-run, never judged from a switch that did not happen.
Staging output is committed as it arrives (scripts write over the QA-branch copies; the QA versions stay at efdc034e4, which
`stg_compare.py` reads). #staging #location #rerun → L0234, L0332

## L0334 — 2026-10-14 — On a fresh environment the suite's scripts depend on each other's data: plan a second pass
On the QA branch every customer the scripts read ("ZZAUTOTEST F1 Tabs" …) already existed, so the run order did not matter.
On staging `s1-batch2b` (C96913, C154884) read customers that `s1-batch2` creates — and ran first, so its readings came back
EMPTY. An empty reading is the script's set-up, never a product verdict. Rule for any new environment: run the whole order
once, then re-run every script with an empty reading, an error, or a data dependency (list kept in the run's `REDO.md`).
#staging #rerun #data → Rules 107, 126

## L0335 — 2026-10-14 — Staging can be redeployed mid-run, and its Heavy Duty has ~119 technicians
(1) Staging went from v26.40.17-ddb9ba1 to v26.40.17-a5c4210 between 17:40 and 18:05 UTC while the suite ran. Every sign-in
prints `app-version=`; grep the logs for it after a run (`grep -ho "app-version=[^ |]*" logs/*.log | sort -u`) and re-run what ran
on the old build, so a whole run names ONE build. (2) Staging's Heavy Duty location has ~119 technicians (other teams' E2E staff),
so a test technician's Tech View group / Board View column is far off screen and a script that reads only what is on screen reads
nothing. `WOB_PIN_NAMES="Ayesha Khan,…"` pins them at sign-in (session.mts) so they sit right after Unassigned.
(3) Judging ~250 readings: a helper agent per wave with strict rules (empty reading / script error = re-run, never Failed;
Failed needs quoted evidence and a ruled-out script fault) found the redeploy and every script-side cause in one pass.
#staging #build #rerun #judging → Rules 101, 104, 126

## L0336 — 2026-10-14 — Two staging timing/state traps: leftover pins, and shop midnight under Asia/Karachi
(1) **Pins are per user and capped at 3.** Checks that pin technicians leave them pinned; the next check that needs to pin
someone finds the limit full and its pin silently does nothing (C96957, C96959). Start such scripts with the pins cleared
(`WOB_PIN_NAMES=" "` empties the list at sign-in) or the named ones pinned. (2) **With the shop on Asia/Karachi (Rule 125),
19:00 UTC is midnight shop time.** A script that books a shift "under way now" from the shop's date can put it on the wrong
day after 19:00 UTC (C154888 at 00:23 shop time booked 23:15 the next evening — a future shift). Run the running-shift checks
between 04:00 and 18:00 UTC, or book with the shop's current date AND time. #staging #pins #timezone → Rule 125, L0322

## L0337 — 2026-10-14 — The second pass is a plan file, and every board reader had a hidden 125-column ceiling
(1) After a full pass, `run498-2026-10-08/second-pass-plan.txt` lists `script | ONLY=<the tests to redo> | extra settings`
and `run-second.sh` runs it (logs2/, a `.done` per finished script so a restart skips them). The plan is generated from the
judge files (`judge/wave*.json` "redo" + "doubt") with `rerun-map.json` naming each test's script. (2) A setting that must
mean "clear" cannot be empty — `env X=` passes an empty string the script reads as "unset"; use a sentinel (`WOB_PIN_NAMES=-`).
(3) Fifty scripts read Board View columns with `for (i < 40) scrollLeft += 900` — fine for ~30 technicians on the QA branch,
silently stopping at ~125 columns on staging. All now take 200 steps; any such loop must read to the END (`moved === false`).
#staging #rerun #scripts → L0334, L0335

## L0338 — 2026-10-14 — Fixture files follow WOB_EV: copy them into a new run folder first
The part-sale photo checks (C368241, C368243, C368244) upload `zz-photo-red.png` / `zz-photo-blue.png` from the evidence
folder. With `WOB_EV` pointing at a new run folder they were missing, so nothing was uploaded and three checks read nothing.
Before a run with a new `WOB_EV`, copy the fixtures: `cp evidence/zz-photo-*.png "$WOB_EV"/`. #staging #rerun #fixtures → L0332

## L0339 — 2026-10-15 — Staging's role list is a plain list; staging names are identical everywhere; GA needs a quiet wait
(1) **`GET /api/organizations/<org>/roles` answers `{"data":[…]}` on staging, not `{"data":{"collection":[…]}}`.** Fifty-six
scripts read `.data.collection`, got nothing, and fell back to roles that some staff member carries — so a custom role with
no users ("ZZAUTOTEST WO View Only", id 8e20d1b6… on staging) was "missing" and C97029, C368153 crashed on `undefined.name`.
All now read either shape (`Array.isArray(d) ? d : d?.collection`); `probe-rolecheck.mts` proves it. (2) **On staging every
technician's ACCOUNT name equals the STAFF record name** (`probe-boardnames.mts`: 155 board-header names, 264 staff, 0
differences), and renaming the staff record (`/api/staff/<id>/change`) renames both. To test S5-R11b / C581895 the difference
is made the real way: account access as the technician (`/impersonate-user/<user id>`), `POST /api/iam/change-name`, exit
(`/api/exit-switch-user`) — `stg-fix-new3.mts`. Headers come from `GET /api/work-orders/board` (`technician.firstName`), the
List from `techAssignedFirstName`. (3) **Google Analytics posts events in batches seconds later**, so counting after a fixed
wait splits a step's events across steps (C97025, C97035). `analytics-batch.mts` `settle()` now waits until no event has
arrived for 10 s (max 45 s). (4) **A Schedule shift made by API with `lineIds: []` may not equal the screen's "Entire work
order" drop** — before calling a lead-change prompt a fault (C581893), make the shift on the Schedule screen and capture its
POST. (5) Never `pkill -f <name>` from a tool shell — the pattern also matches that shell's own command line and kills it; find the pid with `ps -eo pid,args | grep "[n]ame"` and `kill <pid>`; restart a waiter with `setsid nohup … &`. A running bash script edited in place keeps running the OLD text (sed -i makes a new file) — restart it to apply. #staging #roles #names #analytics #shifts → L0332, Rule 104

## L0340 — 2026-10-15 — An empty board has no scroller: a script error there is the empty state, not a fault
When filters leave Board View with no cards (e.g. Assigned to me after reassigning the only card away), the board shows the
"No work orders match these filters" empty state and `[data-test-id="board_view_scroller"]` does not exist, so every board
reader that sets `scrollLeft` throws "Cannot set properties of null (setting 'scrollLeft')" (C96973, second pass, 15 Oct).
Read the empty-state text before reading columns; the error is the observation "empty state shown", never a product crash
and never a reason to re-run. Also: every test now ends with `<C-id>-end.png` (session.mts `__shotEach`, `WOB_SHOT_EACH=0`
turns it off), so a result always has a picture to annotate (Rule 130). Also (15 Oct): a large result push can lose its connection after the results are written but mid-attachment — `push_results_to_run.py` now retries a dropped upload and `--attach-only` skips pictures already on the result, so just re-run it with `--attach-only`. And: a Failed result that gets NO ticket because production does the same (Rule 121) is posted with `"ticket_held": true` and a `ticket` line that says so in plain words and contains "with the QA lead" (e.g. "No ticket: production does the same, so this is not caused by this work — what the test needs is with the QA lead."); the tool refuses any Failed without a link or that line. #board #emptystate #scripts #testrail → L0337, L0339, Rule 121

## L0341 — 2026-10-15 — Fourth-pass script faults on staging: wrong person by substring, shared "new" users, far-apart drags
Twenty-seven staging readings were unusable because of the scripts (judge/wave8.json "redo"); the causes worth not repeating:
(1) **Find staff by the FULL unique email.** The staff-screen search for "ayesha.khan" also matched "ayesha.khan+2026@…"
("Ayesha Tech Role"), so C368131 moved the wrong person. (2) **"A user who never chose a display / never saved a sort" is made
new each run** (timestamped email, this organisation's role, department Service) and viewed through `viewas.mts` — the shared
`zzautotest.wob.userb.1008` already has Board View and a sort saved by other scripts (C96910, C96912, C96929). (3) **Set-up keyed
on QA-branch numbers silently does nothing on staging** (s1-batch2b changed advisors only on `S10043-17602/3`); select by role
in the data (lead ≠ you), never by number. (4) **A location you create enrols YOU** (setup.json: my-workplaces lists it at once),
so with Time Clock on you are a technician there — make a "no technicians" location as the Time-Clock-off runner
(`notech-stg4.mts`); never edit the signed-in admin's own record. (5) **Drags between two columns ~119 technicians apart never
have both ends on screen**: give the case's technicians names that sort first ("Aaa ZZAUTOTEST …", `moved-stg4.mts`), or pin
both for the drag only; deactivate them with no work orders afterwards so they do not stand in front of other checks.
(6) **Moving a technician off a location = Location field AND removing the old enrolment** (playbook D5); read who counts after
each half. (7) **`invoiced` is not reachable by change-status** — complete the lines and the work order, then
`POST /api/invoices/create` (s4-batchD C96974). (8) Staging's work order page has no `select_lead_technician` test-id: read the
field labelled Lead Technician (`wob.mts woPageLead`). (9) Readers that `slice(0, 2000)` the log line cut readings off (C96916);
a run filtered by `ONLY` skips helper blocks with their own id (s5-batchA3 'loc2') — run them when their cases run.
(10) The third pass ends with `signout-fix.mts`, which signs the shared session out: the fourth pass starts with
`signin-check-stg4.mts` and stops if sign-in no longer works. #staging #rerun #scripts #staff #location → L0332, L0335, L0337, L0339

## L0342 — 2026-10-15 — On staging the sign-out test runs LAST OF ALL passes, never at the end of one pass
C368240 (signout-fix.mts) signs the shared session out. On a QA branch the next script signs in again with quick-login; on
STAGING sign-in needs the SSO cookie the QA lead supplies, and an unattended night cannot get a new one — so a sign-out at
the end of pass 3 would have stranded pass 4. It now sits as the final line of the LAST pass plan, and every later pass starts
with `signin-check-stg4.mts` (stops the pass with a plain message if sign-in fails). When adding a pass, move the sign-out
line to the end of the new last plan. #staging #signin #rerun → L0334, L0337, L0339

## L0343 — 2026-10-15 — Wave 8b script faults: shared roles changed by a case, blocks filtered out by ONLY, parts on a "plain" line
(1) **A case that needs a role switched must use its OWN role and restore it in `finally`.** C97012's [Role-D] is a role "used by
this case only", but three scripts used the shared "ZZAUTOTEST WO View Only" role, switched Create & Edit on, and one stopped before
switching it off — the next view-only check (C97020) then opened Reassign. Now `staledrop-stg4.mts` makes its own role; the old
blocks throw before touching the shared role; a pass that runs view-only checks starts with `role-viewonly-stg4.mts` (puts the role
back to Work orders > View only and reads it back). (2) **A block whose id is not a case id never runs under `ONLY=`** ('S8' in
s7-batch, 'loc2' in s5-batchA3): the three story cases logged nothing. Give each case its own block. (3) **A ready-made line can
bring parts waiting to be received**; "complete without a tech story" then stops at the Receive parts window before the story
message — pick a line whose parts list is empty (read the line back). (4) **Two people "clocked in" must be two people**: the second
check-in answered "already clocked into different line" — use two fresh technicians, stop any clock of theirs first, and record the
session's user at each check-in. (5) **"Sign out and sign back in" cannot be run unattended on staging** (L0342; nobody else can
sign in without the QA lead's Google cookie): do the nearest step — a new browser window with the same sign-in — and say so in the
reading. (6) A case's "second tab" action (e.g. Create Invoice) is done in a real second tab, never replaced by a forced failure.
#staging #roles #rerun #scripts → L0339, L0341, L0342

## L0344 — 2026-10-15 — Leftover state from one script spoils the next: every pass starts with a clean-up step
Three things leaked between staging scripts overnight and each spoiled later checks: (1) a script that edits the shared role
"ZZAUTOTEST WO View Only" (C97012) left Create & Edit ON, so C97020, C368207 and C368208 were not fair runs; (2) scripts that
start time clocks (C368196, C368176) left Dana Ortiz's, Ralph Edwards' and Esther Howard's clocks running, which refuses the
next clock-in ("already clocked into different line"); (3) a deleted "staff used elsewhere" cannot be deleted. Fix: a role a
script changes is restored in a `finally`; each pass begins with `role-viewonly-stg4.mts` (role back to View only, read back)
and `clocks-stg4.mts` (stop every test technician's clock, read back); a case that needs its own role or person makes a fresh
one rather than borrowing a shared one. When judging, a reading taken after such a leak is a re-run, never a verdict.
#staging #cleanup #roles #clock → L0339, L0341, L0343

## L0345 — 2026-10-15 — Wave 8c: Review needs the org setting, the test admin must be ENROLLED to switch location, leftover clocks
(1) **Staging's "Require Review Before Completion" (`requireReview`) is OFF**, so completing the last line takes a work order straight
to Complete and "Review" / "Work order sent to review." is never reached (C97032, C368201). Switch it on only around the set-up or
step that needs it and put it back in `finally` (`data.mts setRequireReview`; GET `/api/organizations/settings`, POST
`/settings/change` with the full object; affects only work completed later). (2) **`switchLocUI` only offers locations the signed-in
person is enrolled at**: the runner (ZZ WOB Runner) is enrolled at Heavy Duty only, so "switch to Lethbridge" silently stayed put
(C368156, C368212). Enrol first (`POST /api/staff/enrollment/create` Service), switch, read the top bar back, and stop if it did
not change. (3) **Scripts that start a technician's clock must stop it in `finally`** — Dana's and Ralph's clocks were left running
(C368196), and the time-clock window's button is "Clock Out", not Save/Stop (C368176). The fourth pass starts with
`clocks-stg4.mts`, which stops and reads back every test technician's clock. (4) **A helper block with no case id never runs
under `ONLY=`** again ('BLUE' photo upload in ps-counts; C368242's photo technician): make the set-up run when its cases run.
(5) The Schedule remembers the last day across reloads — read a shift by going back to the exact day text (`goRange`), and match
hour headings as "1 PM", never "13" (the mini-calendar's date). (6) The Timesheets row's pencil (`button_edit_timesheet`) is drawn
only while the pointer is over the row. (7) Staging refuses to delete a staff member who ever logged labor ("Staff is being used
elsewhere."); C368191 now also records the answer for a never-used staff member deleted at once. #staging #review #location
#clocks #schedule #rerun → L0336, L0341, L0343

## L0346 — 2026-10-15 — The Schedule's "Entire work order" drop records the approved lines; an API exit does not end Account Access on the page
(1) **C581893 looked like a fault and was my set-up.** A shift made behind the screen with `lineIds: []` is not what the
Schedule makes: its "Entire work order" drop POSTs `/api/schedule/shifts` with `lineIds` = every line approved AT THAT MOMENT
(captured 15 Oct, `stg-fix-new3.json` drops.*.payload). With the shift made on screen, the build behaved exactly as S4-R28
says (new approved line after the shift → no question; not-approved line → question; control → question). Make shifts on the
Schedule screen (`dropEntire` in `stg-fix-new3.mts`), or POST the approved line ids, never `[]`, when the test is about
which lines a shift covers. (2) **Account access (`/impersonate-user/<user id>`) is ended by the orange banner's Exit button
(`button_exit_impersonation`);** `POST /api/exit-switch-user` alone left the page in Account Access Mode, so the next staff
lookup ran as the technician and found nothing. Press Exit, then read the banner back. (3) ⛔ CORRECTED 15 Oct 03:05 by L0349 — the line below was WRONG: (3) The technician's own
`POST /api/iam/change-name` (made in account access) DOES make the account name differ from the staff record name — the banner
showed "ZZAUTOTEST Account Ana" while the staff record stayed "ZZAUTOTEST Staffname Ana". #shifts #impersonation #names → L0339, Rule 104

## L0347 — 2026-10-15 — An analytics test's evidence picture is a rendering of the captured events, not a screenshot
Rule 130 wants a picture on every Passed/Failed, but an analytics test's result (what the browser sends to Google Analytics)
never appears on any screen, so its end-of-test screenshot proves nothing. `run498-2026-10-08/ga_readout_png.py
<analytics-batch.json> <C-id> <out.png> "<plain title>"` renders that test's captured events (per step, with counts) under a
banner that says plainly what it is: "What the browser sent to Google Analytics during this test (captured from the browser
on staging, <date>)". Used for C97023, C97024, C97025, C97027, C97035, C368155 (posted 15 Oct). #analytics #evidence → Rule 130, L0339

## L0348 — 2026-10-15 — "While the page is still loading" means after its data request is SENT; a technician's menu has no Reports
(1) A fixed wait (400 ms) after clicking a report did not land "while loading": no report request had even started (C368238).
Wait for the page's own data request to be sent (`page.waitForRequest`), act at once, and record whether its answer had already
arrived (`imp-fix3.mts wipWhile`). (2) In account access as a Technician the top menu reads "Work Orders · Schedule · Customers" —
there is no "Reports" link to click (C368239); look for the menu's own word, then inside the "ShopHub" menu, and only then open
the report by its address, saying so. (3) Whoever creates a work order is its Service Advisor and "Assigned to me" lists it — a
case that needs "not mine" sets another advisor first (C368238; playbook WO Board). (4) A reading kept as `JSON.stringify(x).slice(0, 400)`
drops whatever comes after the cut (C96969 lost Line 2) — keep one short line per item instead. (5) A picture meant to show a
menu's ticked option is taken while the menu is still open (C96955). #staging #timing #impersonation #evidence → L0343, L0345

## L0349 — 2026-10-15 — Staging keeps ONE name per technician; a running pass skips a script whose .done exists
(1) **Corrects L0346 (3).** The fourth-pass run of C581895 read back the staff list AFTER the technician's own
`POST /api/iam/change-name`: the staff record had changed too ("ZZAUTOTEST Account Ana" everywhere — staff list, lead
candidates, board feed, List, card, hovers, column header). With L0339 (renaming the staff record renames the account), staging
keeps one name per technician whichever side is renamed, so the account-vs-staff-name difference S5-R11b (C581895, Chris's bug)
is about cannot be made there through the product. The difference exists only where the two stored names were changed outside
the app — the QA branch's scrambled data (developer, Slack 12 Oct). Reproduce S5-R11b on the QA branch, not staging.
(2) **Deferring a script in a pass that is already running:** `run-second/third/fourth.sh` skip any script whose
`logs<N>/<script>.done` exists, so creating that file (with a one-line reason) stops it running in this pass without
touching the pass — used 15 Oct to keep `signout-fix.mts` from running before the design cases (moved to the fifth pass).
#names #staging #rerun → L0339, L0342, L0346
- (L0349 addendum, 15 Oct ~03:15 UTC — QA lead ruling) **WO Board / Tech View: everything runs on STAGING; nothing for this
  suite runs on any QA branch** ("Everything needs to run on staging. Nothing for WO Board and Tech view is to run on any QA
  branch."). So S5-R11b cannot be reproduced on the QA branch either — report it as not reproducible on staging and ask.

## L0350 — 2026-10-15 — Measuring a design on staging: one string-injected kit, text boxes cut to the screen, pictures taken mid-action
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/design-stg5.mts` (run 498, section "Design — how it looks", C590110–C590131), fifth pass (`fifth-pass-plan.txt`, `run-fifth.sh`, `stg-after5.sh`).
- **Kit as a STRING, not functions:** the in-page measuring code (`LIB`, `window.__D`) is a `String.raw` expression evaluated before each read. Functions handed to `page.evaluate` from a `.mts` file can carry esbuild's `__name(...)` wrappers, which do not exist in the page; a string avoids that and survives navigations (it is re-injected when missing).
- **Label overlap is measured on the TEXT, cut to what is visible:** `Range.getClientRects()` per text node, clipped by every ancestor whose overflow is not visible (an ellipsis-cut name otherwise "overlaps" its neighbour at full length). The kit also lists the labels that were cut.
- **Hover, menu and drag states are photographed WHILE they are showing:** a real mouse move (then wait about 1.3 s) for tooltips and hover colours, the picture taken with the menu still open (C96987/C96991 lesson: the old helper closed the Density menu before its picture), and drags HELD with the mouse down while the drop line or refusal message is read and photographed (`dragHold`), then released.
- **Cut-off names in an order picture (C368144):** read the order first, then let the names wrap (white-space normal, overflow visible) for the picture only, and say so in the reading. Nothing is moved, so the picture shows the order that was read.
- **A plan line added after its pass has started is never run:** `run-*.sh` reads the plan once, at its start. Anything queued later goes into the NEXT pass's plan, together with the sign-out test, which stays last of all (L0342).

## L0351 — 2026-10-15 — A fault "fixed" (ticket Obsolete) on the QA branch can be broken again on staging
C96929 (group order = List default) passed on the QA branch on 9 Oct and its ticket SV-11101 was marked Obsolete; on staging
v26.40.17-a5c4210 it fails exactly as the ticket described, twice, with a brand-new user. Staging is a different build, so a
case passed on the strength of an Obsolete/closed ticket is re-judged on its own staging reading, never carried over (Rule 101),
and when it fails again the ask is "reopen the old ticket or file a new one", with the old ticket's live status shown.
#staging #regression #tickets → Rules 101, 113

## L0352 — 2026-10-15 — Wave 11: a location switch undone by the viewAs window, a moving "edge", messages read too late
- **A location switch inside a viewAs window does not hold (C368130):** viewas.mts writes the switched user's saved `user` (with their location at the time) back into page storage on EVERY page load. A switch that reloads the page is therefore undone, and the top bar keeps reading the old location. Instead: tell the server the new location (`/api/iam/change-location`), then open a CLEAN window of the same session (cookies only, no page storage, no init script), read the top bar, switch on screen there if needed, and read the top bar back before reading anything else.
- **Measure sticky things against something that does not move (C96935):** the thead's bottom edge scrolled with the table, so "the top edge" went negative and nothing was ever found at it. Use the scroller's own box as the reference, read every group-header element's box and position setting at each stop, and photograph mid-scroll.
- **A saved "collapsed" from an earlier run spoils "how it opens" (C368127):** use a brand-new user on every run, and write "paging not seen by hand" when no spinner appears.
- **Short messages after a drop (C368131/C96970):** start a MutationObserver BEFORE the press (stg-new5's toastWatch, widened in moved-stg4's `watchStart` to any new short text), hold the drag over the target to read and photograph, then keep watching for about 5 s after the drop.

## L0353 — 2026-10-15 — Two writers to the learnings log pick the same number: pull, then number at the moment of writing
On 15 Oct a worker agent and the main session both appended "L0351" minutes apart (each had read the last number earlier),
which breaks the self-test's "part numbers are unique" check. Whoever appends: `git pull` first, compute the next number from
the file at that moment (`grep -o "^## L0[0-9]*" build/LEARNINGS-LOG.md | tail -1`), append and commit in the same command;
after any merge, re-run `selftest_workspace.py` and renumber the later duplicate. #learnings #agents → Rules 127, 129

## L0354 — 2026-10-15 — Wave 12: the Schedule writes "S-", lines made after the lead read Unassigned, long pick lists must be scrolled
- **The Schedule (and the clock label) show a work order as `S-35915`; the list and API show `S2-35915` (C96966).** A shift block searched for by the full number is never found. Match the block on the digits (`[A-Z]+\d*-35915\b`), and fall back to the Schedule's own search (magnifier > `input_schedule_search`).
- **Line 2 "Unassigned" (C96969):** on this build a line made BEFORE the lead is set follows the lead, and a line made AFTER the lead is set reads Unassigned (case-seed.mts "Line 1 Unassigned"). Build the set-up in that order, and read it back from `/api/work-orders/{id}/line-technicians`. A line that reads "Unassigned" there has no "(follows lead)" mark.
- **Staging's pick lists do not always narrow when you type and only draw what is on screen (C96962, C96958):** the Edit Line "Add technician" list and the work order page's Lead Technician list. Scroll the last `.q-menu` until the option is drawn. `wob.mts pickLeadOnPage` now does this (`o.scrolled` = the steps it took). After Save, read the line's technicians back from the server.
- **Before judging "completing without a tech story is not stopped" (C96998):** read every settings key mentioning "story" in `GET /api/organizations/settings` and in the location's own record. Turn on a "require" switch only for the check, and put it back in `finally`.
- **Before a check that needs particular data, reset that data and read it back first (C96959, C96974, C154888):** reset leads to the case's start (3/1/0) and read them back, or make a FRESH work order with exactly the case's shifts. A shift that must be running today must not cross the shop's midnight (19:00 UTC for Asia/Karachi).
- **A fresh technician sorts to the far right ("ZZAUTOTEST …"):** bring their column on screen (`toColumn`) before reading their card (C96978).
- **A production comparison is read only:** sign in with prod-login-boot.mjs, find a recent work order in the right state through the app's own list call on `api.shopview.com`, and picture the same element on each side (C96999).

## L0355 — 2026-10-15 — After a container restart, restart the sign-in relay before trusting any "no DEV MODE Admin button"
At 04:54 UTC a script on staging failed in the middle with `TypeError: Failed to fetch (api.staging.shopview.com)`, and the next six
scripts all stopped with `no DEV MODE "Admin" button … after 30s`. It looked like the QA lead's staging cookie had expired. It had
not: a container restart just before had moved the outgoing proxy port (`$HTTPS_PROXY` :37835 → :46407). The relay
(`build/atlassian-login/bridge.mjs`) still sent everything to the old port, so every request through it got a 502. This is playbook
§A trap (1). The cheapest check is `curl -x http://127.0.0.1:$(cat /tmp/atlassian/bridge-port.txt) -k https://app.staging.shopview.com/`:
a 502 means a dead relay; restart it by its pid (never `pkill -f`) and read back a 200. **Whenever a container-restart notice
arrives during an unattended run, restart the relay straight away.** Do not wait for scripts to fail. The scripts that lost sign-in
are put into the next pass's plan, which works only if that pass has not started yet. #staging #signin #bridge → L0250, L0342

## L0356 — 2026-10-15 — Wave 13: read WHY a person is not offered, probe the session before blaming the product, drop on the grid line
- **"X is not in the list" means: read the person's eligibility, then the WHOLE list.** Use `staff.mts eligibilityOf`: active, Time Clock, role, Location, departments, enrolments, whether the lead list offers that staff id, and who else has the same name. Then read every option of the open list with `wob.mts listAllOptions` (it scrolls the last `.q-menu`). If the person is listed under another form of the name (both name parts in it), pick that and record the text used. Check the result by staff id, never by name (two "ZZAUTOTEST Ben Bravo" exist).
- **"Session expired, please log in again." in a viewAs window (C97012):** the "Admin side" of a two-person check is the runner taking the ONE shared staging session (switch-user) and handing it back. The playbook already notes that switching users can sign the other window out. Probe the dispatcher's own session (the fe-permissions call from their window) at the start, after each hand-back and after each drag, so the reading shows WHEN it stopped working. Watch messages from the press. Never retry around it.
- **Schedule drops land 15 minutes early when aimed at the heading text (C368178):** "9 AM" is drawn centred on the boundary, so heading-left + 6 px is 8:45. Aim at the left edge of the grid's own slot (`[data-time="09:00:00"]`) + 4 px. The Schedule's board data names the times `startsAt` / `endsAt` (not start / starts_at), and its details write the number as `S-…` (match digits, L0354).
- **A production "asset page" must BE an asset page (C368181):** on the customer page click the "Assets (n)" TAB (whole label), open an asset row, and accept only an address containing `/vehicle/` (staging: `/customers/vehicle/<id>/work-orders`). A customer's own Work Orders tab looks alike but is not the same page.
- **A line that must hold only one technician (C368173):** remove every pre-filled name first (Esther Howard comes pre-filled), save, reload and read it back before the steps.
- **A late plan line goes into a NEXT pass, and the sign-out moves with it:** create `logsN/signout-fix.done` before the running pass reaches it, and put the sign-out last in the new plan (L0342).

## L0357 — 2026-10-15 — "Every test is queued" must be proved from the run's latest result dates, not from the pass plans
After four passes on staging I believed every remaining test of run 498 was either posted or in a pass plan. A live count said
otherwise. I paged `get_tests/498` and `get_results_for_run/498`, took each test's LATEST result, and split them by whether it
was posted after the staging run began (14 Oct 12:00 UTC). Then I subtracted every case named in the pass plans and every case
held in `judge/*.json`. **17 tests were covered by nothing:**
- 8 had staging readings (third pass, high2-batch/parts-batch2) that no judge wave ever picked up;
- 5 had never been run on staging at all (two need a second organisation, three are analytics);
- 4 were NEW cases (C581915–C581918) the QA lead added to the run at 21:59, after the plans were written.
Their latest result was still the QA-branch "Passed", so the run's status counts looked nearly complete. **Before saying a run is
finished, or at every check-in on a long run, do this subtraction:** latest-result date < run start, minus the queued plans,
minus the judged-and-held cases. Whatever is left is the true gap. Then re-read the run's test list for cases added after the
run started. #run #coverage #staging → L0342, L0349

## L0358 — 2026-10-15 — Judging design cases: compare against the case's own attached pictures; a row read off-screen is a redo
- **Where:** run 498 section "Design — how it looks" (C590110–C590131), readings `design-stg5.json`, judged in
  `evidence/staging-full-2026-10-14/judge/wave-design.json` (2 Passed, 13 Failed, 6 redo, 1 doubt).
- **The design pictures each case names are attached to the case itself.** `get_attachments_for_case/<id>` lists them and
  `get_attachment/<attachment id>` returns the image bytes (tr_client's `_req` decodes text, so fetch with urllib and the same
  auth header). Download them to the scratchpad and look at them beside the staging picture before judging an icon or a layout.
- **A Tech View row read while it sits below the window is not a reading.** On staging the Unassigned group holds ~3,450 work
  orders; the test's row was found in the page but off screen, so cell reads came back empty, the "picture" said "off screen"
  and the next click timed out (C590114, C590121 steps 7–11, C590123 steps 7–10, C590128, C590129). Scroll the row into view
  (or pin its technician so its group sits right after Unassigned) BEFORE reading, and photograph it. Judge such cases redo,
  never failed (Rule 104).
- **When the reading and the picture disagree, the picture wins and the reading is the suspect.** C590131's reading said the
  Unassigned header was "scrolled away", but the picture taken at the same moment shows it held just under the column headers
  (the sticky header is drawn by a different element than the one the kit measured). Passed on the picture.
- **One missing step does not stop a Failed.** Where an observed step already breaks the quoted design (e.g. the missing
  six-dot grip on the Unassigned header, C590117), the case is Failed and the unreached steps are listed as "not reached in
  this reading" in the bullets.
#design #staging #judging #pictures → L0350, L0352, Rule 104

## L0359 — 2026-10-15 — Scripts written for the QA branch can carry the QA host in a filter, and keep QA users in a file
- **orgb-fix3.mts watched API answers only from `sv10043api`.** On staging nothing matched, so "the list's data holds no OrgB" would have been a false clean result. Any filter on host names must use the environment's own API host (`new URL(API).host`, session.mts). Before re-using a QA-branch script on staging, run `grep -n "sv10043" <script>`.
- **ga-week.mts kept its test users in a QA-branch file.** On staging it would have tried to switch to QA-branch user ids. On staging it now uses `<WOB_EV>/ga-week/ga-week-users.json`. PHASE may join phases with "+" (`day1+c97026`), so one plan line covers them, because no script may appear twice in a plan.
- **Checking a second organisation by id, not only by name:** organisation B's person ids come from organisation A's own `/api/users` answer (it lists other organisations' users, playbook §X). Organisation A's lists — the lead-technician list, the line technician lists' data — are then searched for those ids as well as for the name "OrgB".
- **An end picture can show a different moment from the reading (C368198):** the script re-opened and cleared the Status list after reading, so its picture showed an empty table. A judged step needs its own picture taken at that step. `__shotEach` comes after the clean-up.
- **Columns to the right of the window are not in the picture (C368213):** scroll `.q-table__middle` to its right end before photographing columns that were just turned on.

## L0360 — 2026-10-15 — Tech View on staging: close Unassigned before reading pinned groups, then centre the row
- **Unassigned opens EXPANDED for a user with no saved choice (PRD S2-R18), and on staging it holds about 3,450 work orders.** Pinned technicians' groups come after it, thousands of rows down. A row can be in the page yet read far below the window (C590114: y=1731), or not drawn at all (C590122 empty group, C590123 / C590128 / C590129 rows). Before reading a technician's group or row, close Unassigned (only when the thing needed is not in it). Then centre the element: scroll every scrollable box around it, and check it is between 0 and the window height. This is `design-stg5.mts` `collapseUn` / `centre` / `rowOn`.
- **Clearing the saved preference reopens Unassigned:** a script that drops the saved "collapsed" choice to start from defaults has to close it again for technician-group work.
- **A line technician set behind the screen may have no task for that person (C590114, also s5-batchC):** clock-in by task id is then impossible. Start the clock from the person's own window instead (Lines tab > the line's Start, `button_clock_toggle_task_…`), read the running clock back, and stop it in `finally`.
- **A board card's "unit · asset" line needs a real year/make/model:** create the work orders first, then `POST /api/vehicles/change` with year and make/model ids borrowed from an existing vehicle (playbook §C). Read the asset back, and record whether the card shows it (playbook 055 saw cards not show make/model set this way).

## L0361 — 2026-10-15 — A judge's "redo" list is not queued work until it is in the next pass's plan; a failure's story is the one its quotes cite most
- **Redo is not queued work:** the design judge returned six "redo" verdicts (C590114, C590120, C590122, C590123, C590128,
  C590129) with exact reasons, then finished. Nothing put them into a pass plan, so they would have been left out of the run
  without anyone noticing. **Whoever receives a judge's report puts every redo into the next unstarted pass plan, with the
  script fixed, in the same step as posting the passes.** It is checked at every check-in by the L0357 subtraction.
- **Which story a Failed design result goes under:** these cases have no refs field. Count the `S<n>-R<m>` requirement ids
  quoted in the case's Expected, and the most-quoted story owns it. Override this only where the behaviour plainly belongs to
  another story (grip handles → the drag story SV-10052; card hover in Board View → SV-10046). Story keys for epic SV-10043:
  S1–S9 = SV-10044 … SV-10052 in order, S10 = SV-10053 (OBSOLETE), S11 = SV-10054. Read every status live before naming it in a
  result (all Ready for QA on 15 Oct 06:00). #judge #redo #tickets → L0357

## L0362 — 2026-10-15 — Wave 15: Schedule blocks show the customer, far-down blocks must be scrolled on screen, pin both tech groups
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `s4-batchH.mts` (C96958, C96966), `high1-fix5.mts` (C368179, C368190), `s2-batchA.mts` (C96935); verdicts in `evidence/staging-full-2026-10-14/judge/wave15.json`; redos queued in `sixth-pass-plan.txt` above signout-fix.
- **Schedule block = customer name, never the number:** the day view's search finds "S2-36009" ("1 match") but the block it draws reads "ZZAUTOTEST F1 Status And Time Kept 56957". Find the block by the customer name (s4-batchH `tagBlock()`: `.fc-event` if present, else the text leaf climbed to a class naming event/shift/block, else to the last ancestor before a much wider lane) and tag it, then drag the tagged element.
- **A block's box can be 10,000+ px down the page:** `getBoundingClientRect()` on a block below the fold gives y 10,664 / 11,750 and a mouse click there hits nothing (details never opened, so C368179's details were null and C368190's shift was never deleted). Scroll the first matching block to the centre BEFORE measuring (high1-fix5 `gridBlocks`).
- **Drop on the grid line, not the heading text, for every Schedule drop:** C368179's drop "under 1 PM" saved 12:45-14:45; use `schedDrop2(..., { gridTime: '13:00:00' })` as C368178 does.
- **Lead pick lists on staging may never draw some names:** Ralph Edwards was not drawn after 19 scroll steps while Dana Ortiz was offered at once. When the case's names are examples, swap the roles to people the list does offer, and record the whole list (`listAllOptions`) if the pick still fails.
- **A "next group takes over" check needs both groups pinned:** Tech View orders pinned groups first, then everyone alphabetically; an unpinned [Tech-B] sits far below and the scroll never reaches it. Pin both (`WOB_PIN_NAMES=A,B`), step finely near the hand-over and photograph every stop; read the name drawn at the sticky spot (`elementFromPoint`) because the sticky header is a drawn copy, not the group row.
- **Staging will not delete a staff member who has labor:** `DELETE` answers 400 "Staff is being used elsewhere." before and after deactivation, while an unused staff member deletes with 200. A case needing "labor by a deleted person" cannot be built there; report it, do not force it.

## L0363 — 2026-10-15 — Wave 16: a cookies-only second window is signed out on staging; the loading bar element proves no paging
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/notech-stg4.mts` (C368130), `s2-batchC.mts` (C368127); verdicts in `evidence/staging-full-2026-10-14/judge/wave16.json`.
- **Second window = full storage state:** `browser.newContext({ storageState: { cookies, origins: [] } })` opened `/login?redirect=…` on staging (top bar empty) — the app keeps its sign-in in page storage too. Pass the whole `storageState()` (as `c368239-step4`, `imp-fix4`, `orgb-fix` do); a new context has no viewAs init script, so an on-screen location switch there is not undone. Guard: stop with a clear message if the URL is `/login`.
- **`q-loading-bar` is always in the DOM:** a "spinner seen" reading built on `.q-loading-bar` is true at every scroll stop and proves nothing about rows arriving in pages. With no visible pause and no list request while scrolling, the honest result is the case's own wording, "paging not seen by hand".
- **Refusal messages on the board appear while the card is held:** "This technician can't be assigned work orders." shows over the refused column a few hundred milliseconds into the hold (`board-drag-denied`), not after letting go — read and photograph it while holding (moved-stg4 `whileHolding`).

## L0364 — 2026-10-15 — Wave 17: read the shop setting before judging a "not blocked", read a line's audit on its own screen, frame the row you cite
- **Where:** `build/wo-board-tech-view/run498-2026-10-08/` — `s8-batch.mts` (C96998), `s4-batchE.mts` (C96962), `s4-batchD.mts` (C96974); verdicts in `evidence/staging-full-2026-10-14/judge/wave17.json`.
- **Tech story requirement is a shop setting:** on staging the organisation setting `requireTechStories` reads **false**, so a line completes without a story and no question — not a fault. With it turned ON (and read back on) the Tech stories window opens and Complete Line stays unavailable until a story is typed; put it back off and read it back. Always report what the setting read before the check.
- **A missing line audit entry is not a finding from the data alone:** C96962's Edit Line put Dana Ortiz on Line 1 (read back) but `GET /api/work-orders/lines/{id}/history` showed nothing new straight after Save. Open the line's ⋮ menu > Audit log on screen (after a settle), photograph it, and keep a control, before calling it missing (QA-branch precedent SV-11107: adding a technician to a line that already had one wrote nothing, adding to an empty line did).
- **Lead pick lists on staging stop at the D names:** Ralph Edwards is never drawn in the work order page's Lead Technician list (19 scroll steps), Dana Ortiz is offered at once; use Dana where the case's name is an example (C96958, C96962).
- **Photograph the row the verdict cites:** C96974's dialog picture showed the top of the list (A names), not Nina Newtech's "4 open" — scroll the cited element (`text_lead_technician_open_count_<staff>`) to the middle first.
- **Clocked in, card vs List:** both show the FULL name + N ("ZZAUTOTEST Cora35022 Clock +1"), while S5-R11 describes List as "first name, then +N" — card = List, but the source's wording differs from what List shows; put it to the QA lead, never edit the Expected (114).

## L0365 — 2026-10-15 — A background watcher dies at two hours; plan the night around check-ins, not around the watcher
The watcher (`/tmp/claude-0/sv/watch6.sh`, started as a background command with the longest timeout allowed, 2 hours) was
stopped at that limit at about 07:00 UTC. The harness says a command that already had the longest timeout must not be
restarted. So on an unattended run longer than two hours **the scheduled check-ins (`send_later`, every 30 minutes) are what
keep the run watched**, and each check-in must do the watcher's job by hand:
- read the newest `logsN/run.out`;
- find out whether the next pass has started;
- check that the relay answers 200;
- check that the waiter processes are alive.
Do not lean on a watcher in a way that leaves a gap when it is stopped. If a pass needs closer watching than 30 minutes,
shorten the check-in interval instead. #unattended #watcher #checkin → L0355

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
