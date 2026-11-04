# Worker brief: Part Lifecycle named-set update to PRD v36 + held case for SV-12010 (4 Nov 2026)

QA lead, 4 Nov 2026: "Named set (Recommended)" and, for SV-12010, "Yes, held (Recommended)". Release is 19 Nov 2026; the
build-verification session will verify these cases on https://sv10647.qa.shopview.com/. You update the library only: no TestRail,
Jira, Slack or Google writes; no commits.

## Sources (read in full what you need; the PRD diff is small)
- New page: `sources/CONFLUENCE-829227015-v36-2026-11-04.md` (version 36, edited 3 Nov 2026 by Chris Ward; converted from ADF by a
  different script than the v35 copy, so compare by requirement code, not by line). Change Log row 3 Nov 2026: "S6-R5: Total Qty sorts by
  the quantity shown in the column, and the printed count sheet follows the same order. S13-R19a: a part request added from the Part
  Library result is linked and takes the new number. S11-R3c: a work order line that received the part, and an open or credited part
  return, also block Delete." (Rulings on SV-12105, SV-12110, SV-12115.) The cases quote v35: `sources/CONFLUENCE-829227015-2026-10-28.md`.
- SV-12010 (Task, Board Backlog, Nemanja, requested by Chris in SV-10647 comment 79703), word for word:
  "Today: changing the part number on a received vendor bill line to an inactive part's number is accepted. On a stock line the received
  quantity then moves onto the retired part. The stock line's part picker already hides inactive parts (S9-R6), but the system has no
  check of its own, and a special-order line accepts any typed number. Expected: The save is refused with "{part number} is inactive.
  Activate it from the Inactive tab to use it.", as S9-R17 does for purchase order lines. Same match as S9-R17: upper and lower case,
  hyphens, asterisks, periods and spaces are ignored; a number an active part at this location also has is not refused. A line that
  already holds an inactive part can still be saved with its own number (S9-E2)."
- Story defects filed against these stories by the build-verification session (facts only; markers on them are that session's job):
  SV-12105 (Total Qty sort), SV-12110 (part request keeps the old number after a rename), SV-12111, SV-12115 (Delete stays enabled while an
  open part request uses the entry), SV-12127..SV-12132.
- Rules: build/rules/RULES-61-96.md 113, 117 (14th, 15th), 130, 134-138; the earlier brief `full-pass-2026-10-27/WORKER-BRIEF-V35-NAMED-SET.md`
  for the library mechanics (it carries the token-discipline charter, which binds you).

## The named set (nothing outside it changes, not even version stamps)
- Quote no longer word for word in v36: S6-02 (S6-R5), S11-02, S11-18, S11-21, S12-06 (S11-R3c).
- Cite a changed code: S12-02, S13-18c, S13-22, S13-22b (check each against v36 S11-R3c / S13-R19a / S6-R5; rewrite if its expectation
  changes, otherwise only re-copy the quote and version).
- Each case in the set is rewritten top to bottom (Rule 134); "From:" line: version 36 (3 Nov 2026, Chris Ward), read 4 Nov 2026.
  Per-case version switch so only the set (and new cases) quote v36 — and make sure NEW cases stay on v36 after they are mapped
  (a bug of exactly this kind hit the Technician Toggle library on 4 Nov).
- New cases only where no case covers the new text: S6-R5 printed count sheet order; S13-R19a (part request added from the Part Library
  result is linked and takes the new number); S11-R3c's new blockers (a work order line that received the part; an open or credited part
  return) — extend an existing case instead where one fits.
- SV-12010: one new case (or more if Rule 136 needs) in Story 9's section, expected result quoted from the ticket with a "From:" line
  (Jira SV-12010, read 4 Nov 2026), marker `AUTOMATION: HOLD - SV-12010 is not built yet (Board Backlog, 4 Nov 2026); release when it ships`,
  held = true (stays out of the run).

## Gates and output
`authoring/build.py` 0 PROBLEM lines; `authoring/gate_selftest.py` 0; readiness check on build/founder-mode/part-lifecycle (0 hard; read
the sample and new "does not / never" lines); a `verify_v36_named_set.py` proving set quotes are word for word in v36 and every mapped
case outside the set renders exactly like its latest TestRail read-back (fetch the live case where no read-back exists); ticket ledger rows
for SV-12010 and the story defects listed above (NO-CASE: defect, owned by the build-verification session; or COVERED by key);
`authoring/apply.py` dry run (locks on the live updated_on; new unheld cases must be added to run 556, union only, assigned to user 6).
Final message under 200 words: keys changed (with C-ids), new keys, held, gate output, dry-run plan.
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
