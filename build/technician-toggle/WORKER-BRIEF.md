# Worker brief: Technician Toggle test suite from PRD v17 (2 Nov 2026)

QA lead, 2 Nov 2026: "Now we need to create the test cases for "Technician Toggle"". Project type: **(ii) V2 / upgrade**
("Upgrade (Recommended)"). Tech plan: the uploaded one is for the old role version (PRD v9); his answer: "No newer plan; go ahead".

You build the case library only. **You do NOT write to TestRail, Jira, Slack or any Google file, and you do NOT commit.** The
coordinator reviews, runs the write scripts, reads back and commits. A second worker is driving the design in parallel in
`design-2026-11-02/` and owns that folder and `DESIGN-DIVERGENCE-REGISTER.json`; do not touch them. Design cases ("Design: …") are
added in a second round after both of you finish: leave a "References from Design" hook (empty) in every case, and make `build.py`
load every `authoring/cases_*.py` module so a later `cases_design.py` is picked up.

## Facts
- PRD: `sources/CONFLUENCE-977371146-v17-2026-11-02.md`, Confluence 977371146 "Technician Toggle", **version 17**, edited 2 Nov 2026
  by Chris Ward (owner and design authority), status "Ready for development - 2026-10-29". 471 lines. The source of every expected
  result (Rule 57/113). The "From:" line reads: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026.
- Tickets, in full: `sources/JIRA-SV-11788-tickets-2026-11-02.md` (17 tickets). Epic SV-11788. Stories SV-11879 (S1), SV-11880 (S2),
  SV-11881 (S3), SV-11882 (S4), SV-11883 (S5), SV-11884 (S6). Bug SV-11719 (the origin: a non-billable Parts Manager on Tech View).
  Verification tasks SV-11962..SV-11969 (Nemanja; SV-11962 and SV-11965 still name the role version — check each against v17).
  Task SV-12008 (the "New" end date). Compare every story's text with the PRD; list every difference (Rule 32: latest wins; a real
  conflict is a PO question).
- Tech plan: `sources/tech-plan-Technician-Toggle-2026-11-02.md` (907 lines, written for PRD v9, a Technician setting on each role).
  Read it in full. Use it only for testable behaviour that still matches v17 (screens, error and loading states, data rules such as
  the 90-day window); anything tied to the role version is out of date and ignored; a plan statement that contradicts v17 on the
  staff-toggle model is noted in REPORT.md, never used as an expectation (Rules 30, 57, 96).
- Design: https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R (6 pages of before/after screenshots). You may look at
  `design-2026-11-02/files/project/*.dc.html` captions and `shots/` to learn the screen's own labels (for example "Save & Close",
  "Add Labor"), but expected results come only from the PRD.
- TestRail: section 113017 "Technician Toggle" (suite 1, under 20434 Founder Mode), empty. Propose subsections in `sections.json`:
  one per story (plain names), "API" for the Public API cases (Rule 4), "What must not change" for the invariant set, and
  "Design — how it looks" (empty for now, Rule 126).
- No QA branch is known; staging (app.staging.shopview.com) is where the feature lands. Built-in roles named in the PRD: Office User,
  Time Clock User, Technician, Foreman, Parts Technician, Parts Manager. Staff are under Settings → Staff (permission 'Settings → App
  Settings'). Recipes: `build/APP-ACTIONS-PLAYBOOK.md` (staff, roles, work orders, Board View / Tech View, Public API).

## Rules and skills to read first, in full
`build/LESSONS-REGISTER.md` (every row); `build/rules/RULES-01-20.md` Rule 4; `build/rules/RULES-61-96.md` Rules 96, 113, 114, 116,
117 (all amendments; the **fourteenth and fifteenth** set the case format), 122, 129, 130, 132, 134, 135, 136, 137, 138;
`build/skills/IDEAL-TEST-CASE-STANDARD.md`; `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`; `build/skills/07-PO-QUESTIONS.md` (§6).

## The case format (QA lead's pattern, Rule 117 fourteenth amendment; example C665915)
Title in plain words, at most 80 characters, no semicolons. Preconditions: short plain bullets in setup order ("Sign in as …",
"Use a …", "Have a …"), only what the steps and results need; no Scenario line, no {placeholders}, no "For example:" lines, **never
the "mark this test Blocked" line (fifteenth amendment)**. Numbered Steps, one UI action each (Rule 135). Expected Result: "Step N:"
then bullets, one observable fact each; a blank line; then "Exact quotes from the source" with a "From:" line per document above its
own quotes (eleventh amendment), the build-check sentence ("The build is not yet available to check this case against."), the
"References from Design" block (empty for now), and the AUTOMATION line last. Every case independent (Rule 137): data it changes is
created fresh for it (ZZAUTOTEST names), shared settings are "Make sure …" preconditions, no case mentions another.

## How to build it
Copy the Credit terms library as the base: `build/credit-terms/authoring/` (`ct_lib.py` quote machinery — quotes pulled by
requirement code and checked word for word against the saved PRD, never from the Change Log; `build.py` gates; `create.py`;
`render_setup.py`; `render_outputs.py`; `po_questions.py`). Write case bodies **directly in the final pattern**: do not copy the
layers that only converted older layouts (`pattern.py`, `scenarios.py`, `readthrough.py`, `relevance.py`, `build_mods.py`) unless a
gate you need lives there. Name files `authoring/tt_lib.py`, `cases_s1.py` … `cases_s6.py`, `cases_inv.py` (invariants),
`cases_data.py` if needed; keys S1-01, S3-12, INV-01. `build.py` prints PROBLEM lines for: title > 80 chars or a semicolon; steps ≠
results; quote not verbatim in v17; PRD code neither covered nor listed as not testable with its reason; AUTOMATION line missing or
not last; a step with two UI actions; any {placeholder}, "For example:" or "Blocked" line in tester text; a case id in tester text.
`create.py` (dry run by default) must call `build/testing-tools/tester_readiness_check.py`'s `require()` before any write (Rule 138).

## What the suite must cover
1. **Every requirement code** (S1-R1 … S6-E4, including S3-R6a, S3-R7a), every Error Handling paragraph, every §8 row (each message
   quoted word for word with its exact trigger), every Key Decision that states testable behaviour, the Permissions paragraph, and the
   §5 Terminology rules that change behaviour ("Technician lists" is exactly seven lists; "Open work" definition; Tech View vs the role
   setting "View mode: Tech view").
2. **New Staff Member pre-fill (S1-R3/R5, S1-N1):** each built-in role (Technician, Foreman, Parts Technician, Office User, Time Clock
   User, another built-in such as Parts Manager) and a custom role copied from Technician, with Time Clock on and off; the re-run on
   role/Time Clock change; the hand switch that stops the pre-fill; S1-R4 and S1-N1 still turning it off after a hand switch.
   Edit Staff Member never pre-fills (S1-E1).
3. **Tooltips and grayed states** with exact text, including both reasons at once (the role message wins).
4. **Turn Off Technician warning (Story 2):** every S2-R3 wording form (1/0, 0/1, 1/1, 0/5, 3/0, and a plural/plural case), every
   counted kind (lead, labor, Add Technician, line's own technician, schedule shift, line on a work order they also lead), every
   status counted and not counted (Estimate, Approved, In Progress, Ready for Review vs Declined, Complete, Invoiced, Paid, part sales,
   declined lines), another location, name as last saved, each of the three ways to turn it off and two at once (shown once),
   Cancel / X / Escape / click outside, the loading state, Save saving what the window showed, the Sales Representative warning
   together (S2-E3), Deactivate Account (S1-E4). Exact numbers are Rule 116: seed known counts and state them.
5. **Technician lists (Story 3):** each of the seven lists, offered vs not offered for each S3-R1 condition (toggle off, Time Clock
   off, deactivated, not enrolled at the location, Office User / Time Clock User role); a non-technician lead (S3-R7, S3-R7a, S3-E1),
   pinned column (S3-E2, the refusal message), someone already on a line (S3-R8, Edit Labor gray and alphabetical, Edit Line chip,
   lock text), "Current · no longer assignable" in Assign/Reassign, the No technicians match message, empty states with exact text
   and the "Set Up Technicians" button (S3-R10), refresh timing (S1-E3, each trigger and the 30-second Back), S3-N3 and S3-E3.
6. **Staff list (Story 4):** column place, Yes/No colours, deactivated always No, location-independent, sorting, pill, notice text and
   place (including the load-error line), cannot be closed.
7. **Public API (Story 5, section "API"):** technician value true/false per S5-R1, deactivated false, cannot be set (S5-N1), changes
   after a Time Clock change via the API (S1-R4), the refusals from the S1 Error Handling paragraph, changelog (S5-R2). Steps name
   the request a tester sends with an API key and a request tool; `AUTOMATION: READY` only when the steps are fully given.
8. **Release day (Story 6):** follow the Credit terms precedent (`build/credit-terms/authoring/cases_s11.py`: the QA lead ruled on
   26 Oct that release-day cases take their "before" values on production shortly before the release and run there after): one case
   per S6 condition (a) time entry inside/outside 90 days, part sale time, manual entry by someone else, department time not counted;
   (b) each open-work kind and status; (c) Billable; no role (S6-N2); deactivated or Time Clock off on the day (S6-E3, including the
   seasonal reactivation); nothing else changes (S6-R3); nobody logged out (S6-R4); open work untouched (S6-R5, S6-E1); runs once
   (S6-E4). Use the HOLD marker from that precedent with its reason.
9. **What must not change (Rule 96, section "What must not change"):** every "as today" / "exactly as today" / "unchanged" sentence
   and every Out of Scope item a tester can see: time sheets and their dialogs, Punch Clock Activities, Technician Efficiency and
   Technician Utilization reports, schedule lanes, Billable and Sales Representative behaviour (and the Sales Representative removal
   warning), Start on an approved line by a non-technician, a Time Clock change still logging the person out, a Technician change
   never logging out (S1-R8), part sales, the role setting "View mode: Tech view", no new permission, no bulk edit or filter by
   Technician on the staff list. A high-risk silence the PRD does not settle is a PO question, never assumed.
10. **Things a tester cannot force** (counts failing to load, a list failing to load, the pill end date before it happens): keep the
    case with the exact expected text and `AUTOMATION: HOLD - <plain reason>` naming what a manual tester cannot do.

## Output (all inside `build/technician-toggle/`, except nothing else)
- `authoring/` and a passing `python3 build/technician-toggle/authoring/build.py` (0 PROBLEM lines), writing
  `authoring/proposals.json` (one entry per case: section key, title, refs, the three HTML fields, automation marker, held flag).
- `python3 build/testing-tools/tester_readiness_check.py build/technician-toggle --sample 5`: 0 hard problems. Read the sample and
  every "does not appear / never" result in full.
- `TECHNICIAN-TOGGLE-SETUP-FILE.md` (one setup file for Claude sessions: accounts and roles, data recipes per case, traceability,
  open questions), from `authoring/render_setup.py`.
- `TICKET-LEDGER.json` (one row per ticket: NEW-CASES with keys / COVERED / NO-CASE with reason / ASKED) and `TICKET-SWEEP.json`
  (project, epic SV-11788, stories, prd_page 977371146, prd_version_handled 17). Then
  `python3 build/testing-tools/ticket_sweep.py --help` and run it as it says against these files; it must report 0 unhandled.
- `PO-QUESTIONS-DRAFT.md`: every point the PRD does not settle (ambiguous, contradicting a story or verification task, not testable
  as written), one plain question each with (a)/(b)/(c), for Chris Ward, after the skill 07 §6 check (list what you dropped and
  which source answered it). Cases that depend on an open question are HELD (`AUTOMATION: HOLD - waiting on the PO (question N)`).
  Do not send anything.
- `REPORT.md`: counts per section, the code coverage table (code → keys, or "not testable: reason"), held cases and why, story-vs-PRD
  and verification-task-vs-PRD differences, tech-plan notes, reading coverage (file, size, line ranges, 100% read).
- Final message (under 300 words): counts per section, held cases, questions, gate output, anything you could not do.

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
