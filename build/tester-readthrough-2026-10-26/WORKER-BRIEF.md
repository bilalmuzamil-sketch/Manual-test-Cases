# Worker brief: tester read-through of one suite (26 Oct 2026)

The QA lead, 26 Oct 2026, after a sample of 9 live cases showed 3 with wording a tester could not act on, answered "GO" to a
read-through of every case, and added: *"Make sure that your work does not bite me"*. Earlier the same day: *"The purpose of editing
the test case is to make sure that the preconditions/steps/and expected behavior are related and the one who is running the test cases
as a manual QA tester may understand the test scenario."*

You are given ONE suite (named in your prompt). You DRAFT only: edit that suite's authoring files and run its gates. No writes to
TestRail, Jira, Slack or Google; no commits. Work only inside that suite's folder (plus your own notes in
`build/tester-readthrough-2026-10-26/<suite>/`). Save often (container restarts happen; files on disk survive).

## Read first, in full

`build/rules/RULES-61-96.md`: Rule 117 FOURTEENTH and FIFTEENTH amendments (just above Rule 118), Rules 113, 114, 116, 134, 135, 136, 137
(end of file); `build/LESSONS-REGISTER.md`; your suite's `PROJECT-STATE.md` and its latest pass reports in `pattern-format-2026-10-26/`.

## Already done by the coordinator (do not redo)

- 15 cases were DELETED from TestRail today on the QA lead's order (snapshots in `build/tester-readthrough-2026-10-26/deleted/`; your
  suite's `testrail-id-map.csv` no longer lists them): Splitting Sales Representatives S6-05, S1-11, S7-05, S5-19; A/R and A/P DATA-21;
  Credit terms S1-27, S1-28, S2-35, S3-27, S3-28, S4-30, S4-34, S5-23, S5-25, S12-19. **Remove your suite's keys from the library** so
  build.py, proposals.json, the setup file and the outputs no longer contain them (the apply scripts must never re-create them).
  In the suite's coverage / requirements record, mark each requirement those cases covered as **"No manual case: deleted 26 Oct 2026 on
  the QA lead's order (a manual tester cannot set it up); left to the developers' own checks"**, unless another remaining case covers it
  (then say which). Keep the gates green with this exclusion (a requirement-coverage gate must accept it, not fail on it).

## What to do for EVERY remaining case of your suite

Read each case exactly as a manual tester who has never seen the feature would: title, preconditions, steps, expected results together.
Fix what fails any of these checks. The exact quotes, their "From:" lines, the References from Design block and the AUTOMATION line stay
byte-identical, unless a fix adds a result that needs a new quote (see check 3).

1. **Clear setup.** Every precondition says exactly what to create or which existing thing to use, in the product's own words, in setup
   order. "Make sure the report has open documents on today's date" is not enough; say what (for example "Have a customer with one open
   invoice dated today"). A record a case changes is created for this test ("Create …" / "Have a new … (made for this test)"), never
   "Make sure … exists". A shared setting stays a "Make sure …" line.
2. **No vague words.** Replace "native", "as described", "as in the layout being checked", "the same style", "looks right", "correct"
   and the like with what the tester actually sees (bold, pinned to the right edge, the exact text, the colour, the order), taken from
   the case's own quotes and design references. Never invent a look the sources do not give; if the sources give nothing concrete,
   list the case under "could not make concrete" and leave its meaning unchanged.
3. **A "does not appear / is not sent / nothing changes" check must prove the trigger ran.** Add a control the tester can see (a second
   record that must appear, the sync log line, the count that must change) ONLY where a source sentence backs it; add that sentence as
   a new quote with its From: line. If no source backs a control, do not invent one: list the case under "negative check without a
   control" with the reason.
4. **No repeated or bundled steps.** One UI action per step (Rule 135); a step that repeats part of another is merged or split; one
   "Step N:" result per step.
5. **Related.** Every precondition is needed by a step or a result (or says why, "so …"); every record a step or result names is set up
   in the preconditions; every result is something the steps make visible. Rule 137 gates already enforce names; you check meaning.
6. **Understandable.** After reading the case a tester knows what situation is being tested and how to judge pass or fail. Title in
   plain words, at most 80 characters, no semicolons; design cases keep "Design: ".
7. **Remove the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"."** (and any variant, such as
   "If any record above is missing, mark this test Blocked …") from EVERY case, and add a build.py gate that fails on it (fifteenth
   amendment, permanent). The setup file for Claude sessions must not carry it either.
8. **Enrolment (A/R and A/P only).** The PRD v9 makes the reports organization-wide; keep the "enrolled at both locations" line ONLY in
   cases whose steps click a document at another location (the "Switch location?" prompt) or check plain-text documents at a location
   the user is not enrolled in, and check that every such case has it. List what you found.

Never: change a quote; add a behaviour no source states; soften, drop or add a fact in a result except as above; use {placeholders},
"For example:" lines, a Scenario line, case keys or C-ids in tester text; refer to another case.

## Gates and output

- `python3 authoring/build.py` ends with `PROBLEM lines: 0`, with the new Blocked-line gate and every earlier gate kept.
- A script check (commit it in `build/tester-readthrough-2026-10-26/<suite>/`) that for every remaining case the quotes block onward is
  byte-identical to `applied/C<id>-after.json`, except cases where you added a quote (list them, each with the added quote).
- `build/tester-readthrough-2026-10-26/<suite>/READTHROUGH-REPORT.md`: reading coverage (every case read, count); per changed case one
  line: key, C-id, which checks (1-8) it failed and what you changed; the lists "could not make concrete" and "negative check without a
  control"; the enrolment findings; old vs new text for every changed case (script-generated).
- Regenerate the setup file and outputs; update `PROJECT-STATE.md` with a dated entry.
- Final message: counts (cases read, changed, unchanged, keys removed), gate output, byte-identity result, the two lists, and 3 sample
  cases old vs new.

---

# TOKEN DISCIPLINE CHARTER — mandatory in every session and every handoff (Standing Rule 95)

**Status:** canonical · created 2026-08-26 · all projects, permanent · authority = **Standing Rule 95**
(`build/rules/RULES-61-ONWARD.md` *(another session's rule file — facts only, never rules; Rule 118)*), which ties Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90.

> **THE QA LEAD, 2026-08-21, VERBATIM:** *"Also make sure that this session is smartest one about token
> usage as I do not want once again the weekly tokens to be burnt at the start of the week. Make it a
> general rule for all the sessions we create and the hand offs we create for new sessions"*

**WHY THIS EXISTS.** The weekly pool was nearly exhausted **in a single day**. The causes were
**poll-by-spawn status checks, one tool call per case, bulk reads of cases/specs/archives, autocompact
thrash and redundant re-verification** — **not one of which produced any quality.** The rules that
prevent each of those already existed (75, 76, 77, 78, 79, 88, 90) but were **scattered**, so nothing
guaranteed a new session or a newly-authored handoff actually carried them. This one page is what every
session inherits, and **every handoff embeds it verbatim.**

---

## THE TWELVE CLAUSES

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan** — not the
   first plan. For anything large, **declare an INTENDED SPEND** (roughly: tokens, spawns, script runs)
   in your first reply. Then begin. One pass, then exit.

2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSV exports, API dumps, spec bodies or large
   files go into your context. **Write a script, run it to a file, read a bounded SUMMARY.** Inspect
   with `wc -l` / `head -n 20` / `tail -n 20` / `grep -c` / `grep -n` / bounded `sed -n 'A,Bp'`. **Never
   read CLAUDE.md end-to-end** (it is an index) and **never read
   `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.

3. **THE READING RULE.** The startup reading list is **for startup**. Afterwards, consult **anything the
   task needs** — any rule, skill, project state, spec or ticket — always **targeted and bounded**.
   **Knowledge is never off-limits; only BULK reading is.** Not reading a rule you are about to apply is
   a worse failure than the tokens it would have cost.

4. **SPAWN DISCIPLINE (76 / 88).** An **ORCHESTRATOR** (no file tools) minimises spawns and **batches
   ruthlessly** — every spawn re-loads the whole project context, **observed at 200–380 k tokens each**.
   A **LANE SESSION** (direct tools) **does the work itself** and does **NOT** spawn for anything it can
   do directly. **Never spawn for a trivial check** — piggyback it (clause 7).

5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a
   **checkpoint file**, plus a **committer loop gated on a RUN-FLAG FILE**. **Never `pgrep -f
   <scriptname>`** — it matches itself and the loop never exits. Progress is **SELF-REPORTED IN COMMIT
   MESSAGES**. **Launch and exit**; verify later in one short pass. Polling for status is the single
   most expensive thing a session can do.

6. **BATCH WRITES.** One **scripted run with a per-op log** (operation · C-id · HTTP status ·
   verification result), **never one tool call per case**. The log is the evidence (Rule 50); *"200 OK"*
   alone is non-compliant.

7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the **next substantive task**. Keep a
   **pending-cheap-checks list** and carry it forward. **Never spend a dedicated spawn on one.**

8. **NEVER RE-DO WORK (77 / 80).** Before any verification, VIU or ordered task, **STATE when it was
   last done** (date + build marker / spec version) and **ASK before re-running**. A check within the
   **last 3 builds or 3 source versions still COUNTS**, shown with its date and freshness badge (91).

9. **ANSWER IN TEXT** when a tool call is not needed. A reflexive tool call every turn is a trap: if you
   already know the answer, or the question is about plan/scope/reporting, **just answer**.

10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 %
    reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At
    **50 % of your own budget**, compare spend against work completed; if spend is outpacing progress,
    **STOP AND REPORT** — never grind to zero. **Never consume the reserve** without the QA lead's
    say-so.

11. **THE WEEK-START GUARD.** The pool resets weekly and was once **nearly exhausted in ONE DAY**. **No
    lane may spend more than its weekly allocation in the first 48 hours of the week** without explicit
    approval. **A task that will exceed its declared intended spend STOPS and reports** rather than
    continuing.

12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may be used to justify **sampling instead
    of full coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate
    (84, 86)**. **The savings come from HOW the work is executed** — scripts, batching, no polling, no
    re-doing — **never from doing less of it, and never from doing it less rigorously.** If cheap and
    correct conflict, **correct wins and you report the cost.**

---

## THE THIRTY-SECOND SELF-CHECK — run it at session start and before any large task

| Ask | If the answer is wrong |
|---|---|
| Do I have the cheapest correct plan, and have I declared an intended spend? | Stop; plan first (1) |
| Am I about to pull a large file or many records into context? | Script it; read a summary (2) |
| Do I actually need to spawn, or can I do this myself / piggyback it? | Do it yourself (4, 7) |
| Am I about to check on a running job? | Don't — it self-reports in commits (5) |
| Has this verification already been done within 3 builds / 3 source versions? | Say the date and ask (8) |
| What is my cumulative spend, and am I past 50 % of my budget? | Compare against progress; report (10, 11) |
| Is any of this saving tokens by lowering rigour? | Forbidden — revert to the full method (12) |

**OUTSTANDING — what I need from you:** nothing outstanding for this charter; the budget percentages in
clause 10 are the QA lead's to change at any time.
