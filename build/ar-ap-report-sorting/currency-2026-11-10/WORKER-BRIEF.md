# Worker brief: V1 currency check of the A/R and A/P suite against the current sources (10 Nov 2026), ASSESSMENT ONLY

QA lead, 10 Nov 2026: "Source verify them" (TestRail section 90418, 356 cases, all ours) and chose **V1** (Rule 125). Before any
case is changed the QA lead decides "full pass" or "a named set" (Rule 122 amended), so this round is the **assessment** that gives
him the evidence. You DRAFT nothing in TestRail: no writes to TestRail, Jira, Slack or Google; no commits; reads are fine. Work only
inside `build/ar-ap-report-sorting/` (outputs in `currency-2026-11-10/`). Write outputs early (files on disk survive a restart).

## Sources to read in full (Rule 119; record reading coverage per file: size, lines, 100%)

1. **PRD, current** (last modified 5 Nov 2026, Chris Ward). Its Change Log rows of 2026-11-04 ("v10") and 2026-11-05 make it
   **version 11**; confirm the version number from the page if you can, else say "Change Log implies v11".
   `sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.html` (raw) and `.md`. Our cases quote **v9**
   (`sources/CONFLUENCE-947650561-v9-2026-10-26.html/.md`). A line diff is in `currency-2026-11-10/PRD-DIFF-v9-to-2026-11-05.txt`
   (52 lines): new S1-R5a, S2-R1a, S2-R1b, S2-R7a, S3-R7a, S5-E3, Story 4 Error Handling + two §8 message rows; changed S1-R8,
   S2-R7, S3-R8a, S8-R3, S9-N2, §2 overview, Out of Scope list (SV-11441 moved into scope). Check the diff yourself; it compares text
   lines, so also compare the non-requirement text.
2. **Jira**: every ticket under epic SV-11315 and its stories (26 tickets; summaries/updated dates saved in
   `sources/jira-sweep-2026-11-10.json`; all show updated 10 Nov). Fetch each ticket's description AND comments (cloudId
   `shopview.atlassian.net`, Atlassian MCP getJiraIssue / searchJiraIssuesUsingJql with fields description, comment). Our ledger
   `TICKET-LEDGER.json` was read 22 Oct. In particular: the 9 stories SV-11531..SV-11539 (did their text change since
   `sources/JIRA-SV-11315-stories-2026-10-26.md`?), the epic SV-11315 comments (Nemanja's build questions and Chris's answers of 4 and
   5 Nov, which the PRD Change Log names), bug SV-11441 (now in scope via S1-R5a), and the 7 bugs SV-12135..SV-12141 filed 3 Nov
   (SV-12138..41 already carry expect-fail lines on 9 cases since 4 Nov, see `../answers-2026-11-04/`; SV-12135, SV-12136, SV-12137
   have never been matched to our cases). Save what you read under `sources/` with today's date.
3. **Chris Ward's answers**: `questions-2026-10-22/chris-answers-2026-10-26.json` and `po-answers-2026-11-04/ANSWER-17-Chris-Ward.md`.
4. **Tech plan** `sources/Tech-Plan-AR-AP-2026-10-22-upload.md`: no newer plan is known; say whether any ticket or comment names one.
5. **Design** https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4 (driven 22 Oct, `design-2026-10-22/`). Find out whether it changed
   since (read it if your tools allow; Chris said pictures for answers 13-15 "will be corrected"). If you cannot reach it, say so
   plainly; do not guess.
6. **The live cases**: read all 356 cases of section 90418 and its 12 subsections from TestRail (read only, helper
   `../dashboards/currency-2026-10-14/apply/trlib.py`, `api("get_cases/1&suite_id=1&section_id=…&offset=…&limit=250")`, page every
   call). Compare each live body with the library (`authoring/` build output `proposals.json`, `testrail-id-map.csv`); list every case
   whose live text differs from the library and why (the 4 Nov expect-fail lines are known; anything else, name who changed it and
   when, Rule 87). Snapshot the live bodies to `currency-2026-11-10/live-before/`.

## What to produce (assessment, no edits to authoring files)

`currency-2026-11-10/ASSESSMENT.md`:
- Reading coverage per source.
- **Per-source verdict** (Rule 115/43): what changed, with the exact new or changed sentence.
- **Every one of the 356 cases** gets CONFIRMED / CHANGE / RETIRE (Rule 134), with the reason; CHANGE names the part(s) affected and
  the PRD line. Do it by script plus reading: a case is affected when it quotes a changed line, OR when its expected screen is touched
  by a new rule even without quoting it (examples: any case whose results show a date as "Today"/"Yesterday" or a relative date;
  any case naming a credit's Transaction Type "Credit"; any case with a credit dated on the as-of date or a Past Due value of a
  credit; A/R Collection / A/P Unpaid Invoices cases that expand a customer with more than 100 documents; Location sort cases where
  the column hides; PDF cases that show negative amounts or dates; Location filter cases that change the as-of date; "Credit term"
  heading; A/P Unpaid Invoices width at 1440; and every quote whose v9 wording differs in the current PRD).
- **NEW cases needed**: each new rule with no covering case (S1-R5a, S2-R1a, S2-R1b, S2-R7a, S3-R7a, S5-E3, the two bucket messages,
  S1-R8's 100-at-a-time inside an open customer, Rule 116 for the totals: exact amounts), with section and source.
- The 7 bug tickets: which cases each touches and whether an expect-fail line is owed (Rule 61 wording) or already present.
- Held cases and design-version cases: does anything new release or retire them?
- Any point the sources truly leave open (skill 07 §6 first) as a draft PO question; none if none.
- Counts: confirmed / change / retire / new, and the **evidence a named set would be safe**: for each CONFIRMED case, why the
  changes cannot touch it. Be honest: if the evidence is weak for some sections, say which.

Final message: counts, the list of CHANGE / RETIRE / NEW keys with C-ids, the live-vs-library drift, open points, reading coverage.

## Rules to read first, in full

`build/LESSONS-REGISTER.md`; `build/rules/RULES-61-96.md` Rules 61, 87, 113, 115, 116, 117 (all amendments incl. 14th and 15th),
122, 125, 129, 134, 137, 138, 139; `build/skills/22-TESTING-SUITE-CURRENCY-CHECK-V2.md` (only for the source-reading method; this is
V1); previous pass for the pattern: `v9-pass-2026-10-26/` (WORKER-BRIEF, PASS-REPORT, make_pass_report.py).

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
