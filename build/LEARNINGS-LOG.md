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
  the card it already sits above changes nothing (C96963 step 7). #staging #scripts #signin #sv-11393 → L0394, L0396, L0413, L0415

## L0418 — 2026-10-17 — Reading a run's history: what a full re-run's posts did to earlier verdicts (run 498)
- **`build/testing-tools/tr_client.py` `get()` returns a TUPLE `(http_status, body)`**, not the body: `_, r = t.get("get_tests/498&limit=250&offset=0"); r['tests']`; `_, rs = t.get(f"get_results/{test_id}&limit=3"); rs['results']`. Page `get_tests` by 250.
- **After each judged batch, diff each case's NEW result against its PREVIOUS one** (last 3 results per test). Two things only that diff shows: (1) **Failed → Passed** = the ticket's fix may have shipped (Rule 61 outcome 3) — read the ticket's live status and tell the QA lead (C96927: Failed 16 Oct on SV-11317, Passed 17 Oct, ticket in TESTING STAGE); (2) **Passed → Blocked by a script fault** = the re-run made the run look worse than the build is — queue a fix-up at once (C96936, C368127, C368161, added to fix-up 2).
- **Run totals can move by more than the batch explains** (passed 201→199 after 11 passes): previously-passed tests re-posted as script-fault Blocked. Never report the totals without that diff.

## L0419 — 2026-10-17 — A background wait-loop is cut at 30 minutes unless it is given a timeout
A background Bash wait-loop ("until step 53 ends", loop limit 3000 s) was stopped by the harness after 30 minutes. That is the DEFAULT background `timeout` (1,800,000 ms), whatever limit the loop sets itself. For any wait longer than 30 minutes, pass `timeout` explicitly (up to 7,200,000 ms), and keep the loop's own limit below it. Being stopped is NOT a sign the run stalled: read `queue.out` before reacting (run 498 step 51 was still moving).
