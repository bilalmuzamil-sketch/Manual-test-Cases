# Worker brief: read the Internal Work Orders tech plan in full and extract what a tester can check (12 Nov 2026)

QA lead, 12 Nov 2026: new suite "Internal Work Orders". Tech plan: `../sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md`
(842,447 bytes, 5,398 lines; uploaded by the QA lead; also at https://powertools.shopview.com/md-viewer/48d32d68-286a-44e9-94ba-dc1e3c40091a).
PRD: `../sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0, 2026-11-09, Milos Vasic). The QA lead is travelling: work unattended.

**Read the WHOLE tech plan, every line** (Rule 119: size is never a reason to sample). Read it in chunks (Rule 88/95) and keep running
notes in `NOTES.md` so a restart loses nothing; record the line ranges read. No writes to TestRail, Jira, Slack or Google; no commits.
Work only inside `tech-plan-2026-11-12/`.

Rules to read first: `build/rules/RULES-21-40.md` Rule 30; `build/rules/RULES-61-96.md` Rules 57, 96, 113, 115, 116, 119; `build/skills/
17-REGRESSION-IMPACT-V1-TO-V2.md` (documents establish intent; a code-vs-document conflict is a PO decision item). Worked example of the
same job: `build/ar-ap-report-sorting/tech-plan-pass-2026-10-22/` and `authoring/tech_plan.py` there.

## Produce
1. `TECH-PLAN-READING-RECORD.md`: line ranges read, 100%; the plan's version/date/author and the PRD version it was written for.
2. `TECH-PLAN-TESTABLE.json`: every statement a manual tester could observe in the product (screens, labels, messages, permissions,
   states, order, numbers, posting amounts and accounts, QuickBooks / AccountingHub entries, webhooks and Open API fields, release-day
   seeding/migration, performance limits a person can see), each with: id TP-001…, plan line(s), the exact quote, the PRD code it
   matches, and a verdict CONFIRM (PRD says the same) / ADD (testable, PRD silent: a case may be authored citing the plan) / DIVERGE
   (plan and PRD disagree: quote both).
3. `TECH-PLAN-DIVERGENCES.md`: every DIVERGE, plain words, PRD sentence vs plan sentence, which wins under our rules (the PRD is the
   source; a real conflict is a question for Milos Vasic), and the draft question if one is needed.
4. `INVARIANTS-FROM-PLAN.md`: what the plan says must NOT change for ordinary billable work orders, invoices, reports, QuickBooks,
   AccountingHub, portal, API (Rule 96 invariant set), each with plan lines and the PRD sentence that agrees (or "PRD silent").
5. `QUESTIONS-DRAFT.md`: questions for Milos Vasic (the QA lead calls him "sir"): plain, friendly, short, from someone who knows ShopView;
   (a)/(b)/(c) with a suggested option; only where the plan and PRD truly disagree or the PRD is silent on something risky.
Final message under 300 words: reading coverage, counts by verdict, the divergences one line each, the questions.

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
