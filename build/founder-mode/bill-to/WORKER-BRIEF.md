# Worker brief: Bill To test suite from PRD v0.5 (9 Nov 2026)

QA lead, 9 Nov 2026: new Founder Mode feature "Bill To". Project type **(ii) V2 / upgrade** ("Upgrade (Recommended)"). Write the full
suite now although the PRD is v0.5 "Pending approval from Mat and Amani" ("Yes, write it now (Recommended)"). No tech plan yet (QA lead:
"we might have later and accordingly we will have to update our test cases").

You build the case library only. **No writes to TestRail, Jira, Slack or Google; no commits.** A second worker drives the design in
parallel in `design-2026-11-09/` and owns that folder and `DESIGN-DIVERGENCE-REGISTER.json`; do not touch them. Design cases come in a
second round: leave an empty "References from Design" hook and make `build.py` load every `authoring/cases_*.py` module.

## Facts
- PRD: `sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md` (Confluence 1003585538 "Bill To", v0.5, last modified 7 Nov 2026, owner Chris
  Ward; 1,049 lines; 19 stories; Change Log empty). The source of every expected result (Rules 57, 113). "From:" line: PRD "Bill To",
  Confluence 1003585538, version 0.5 (6 Nov 2026, pending approval, Chris Ward), read 9 Nov 2026.
- Tickets in full: `sources/JIRA-SV-12289-tickets-2026-11-09.md` (epic SV-12289 + stories SV-12303..SV-12321, Story 1..19 in order).
  Compare each story with its PRD story; list every difference (latest wins, Rule 32; a real conflict is a PO question).
- Design: https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd (8 pages, before/after screenshots). You may read
  `design-2026-11-09/files/project/*.dc.html` captions to learn the screen's own labels; expected results come only from the PRD.
- TestRail: section 132467 (suite 1, Founder Mode). Propose subsections in `sections.json` (one per story, plain names; "API" for
  Public API cases (Rule 4); "What must not change"; "Design — how it looks", empty for now). Ids null.
- No QA branch is named. Recipes: `build/APP-ACTIONS-PLAYBOOK.md` (customers, work orders, part sales, invoices, payments, QuickBooks,
  AccountingHub, customer portal, IBS/export, Public API).

## Rules and skills to read first, in full
`build/LESSONS-REGISTER.md` (every row); `build/rules/RULES-01-20.md` Rule 4; `build/rules/RULES-61-96.md` Rules 96, 113, 114, 116, 117
(all amendments; the fourteenth and fifteenth set the case format), 122, 129, 130, 132, 134-138; `build/skills/IDEAL-TEST-CASE-STANDARD.md`;
`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`; `build/skills/07-PO-QUESTIONS.md` (§6).

## Case format (QA lead's pattern; Rule 117 14th/15th amendments; example C665915)
Title plain, ≤ 80 characters, no semicolons. Preconditions: short plain bullets in setup order ("Sign in as …", "Use a …", "Have a …"),
only what the steps need; no Scenario line, no {placeholders}, no "For example:", never the "mark this test Blocked" line. Numbered steps,
one UI action each (Rule 135). Expected: "Step N:" then one-fact bullets; blank line; "Exact quotes from the source" with a "From:" line per
document; build-check sentence; "References from Design" (empty now); AUTOMATION line last. Independent cases (Rule 137): data a case
changes is created fresh (ZZAUTOTEST names); no case mentions another. Rule 69 marker "AUTOMATION: Not available on Build to test Yet -
Last checked <M/D/YYYY>" for runnable cases (no build checked); HOLD with a plain reason otherwise. A case blocked on another ticket's
release opens its Preconditions with a bold line saying so (QA lead, 4 Nov 2026; example C913771).

## How to build it
Copy the newest clean library as the base: `build/technician-toggle/authoring/` (tt_lib.py quote machinery, build.py gates, create.py,
update_changed.py, render_setup.py, verify scripts). Name files `authoring/bt_lib.py`, `cases_s1.py` … `cases_s19.py`, `cases_inv.py`,
`cases_api.py`, `cases_data.py` as needed; keys S1-01 …, INV-01, API-01, DATA-01. Keep its gates (title, steps = results, verbatim quotes,
every PRD code covered or listed not-testable with reason, AUTOMATION last, one action per step, no placeholder / "For example:" /
"Blocked" line / case id in tester text). `create.py` dry run by default and calls `tester_readiness_check.require()` before any write.
Learn from Technician Toggle's 4 Nov fix: a new case keeps its PRD version once mapped.

## Coverage
1. Every requirement code, every Error Handling paragraph, every §8 User Feedback row (message word for word with its trigger), every
   testable Key Decision, §5 Terminology rules that change behaviour, §2 "State by action" table rows, and §2 Release day.
2. Exact numbers (Rule 116) wherever money or counts appear: invoice totals, receivables by Bill To, payments, deposits, statements, aging
   — seed known amounts and show the arithmetic.
3. Each surface (Rule 40): customer page, New/Edit Customer, work order and part sale Customer card, Authorizer, invoices/estimates
   (legacy and modern layouts), email, receivables/payments, reverse, delete customer, Work Order Log, asset Work Orders tab, Internal / No
   Charge, customer portal, QuickBooks, AccountingHub, IBS / export / Public API.
4. What must not change (Rule 96): every "as today" / "unchanged" sentence and every Out of Scope item a tester can see; high-risk silences
   become PO questions.
5. Things a tester cannot force: keep the case with exact text and `AUTOMATION: HOLD - <plain reason>`; list them separately so the QA
   lead can decide whether they go to TestRail.

## Output (inside build/founder-mode/bill-to/)
`authoring/` with `python3 authoring/build.py` → 0 PROBLEM lines and `proposals.json`; readiness check 0 hard (read the sample and every
"does not / never" result); `BILL-TO-SETUP-FILE.md`; `TICKET-LEDGER.json` + `TICKET-SWEEP.json` (epic SV-12289, prd_page
1003585538, prd_version_handled "0.5") and `ticket_sweep.py` 0 unhandled; `PO-QUESTIONS-DRAFT.md` (plain (a)/(b)/(c) questions for Chris
Ward after skill 07 §6; held cases named); `NO-MANUAL-PROPOSAL.md` (cases a tester cannot set up); `REPORT.md` (counts, code coverage
table, held, story-vs-PRD differences, reading coverage 100%). Final message under 300 words.

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
