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
