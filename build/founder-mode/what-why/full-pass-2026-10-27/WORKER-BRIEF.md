# Worker brief: What/Why (Title and Description) full pass (27 Oct 2026)

QA lead, 27 Oct 2026: *"OK now we do the same for WHy and WHY what you did for Parts life cycle"*, then chose **"Full pass"**, and
**"Not now"** to filing the S1-R6 bug Chris Ward asked for (so the S1-R6 case keeps the PRD's expectation; no EXPECT FAIL without a
ticket, Rule 61). Standing words: *"Make sure that your work does not bite me"*; *"The preconditions should be something like the
easiest to understand for a layman or a manual QA tester to setup and they must make sense and relate to the steps and expected results
below"*; *"One tells what to do and other tells what to expect"*; *"never add that line in the future test cases too"* (Blocked line).

You DRAFT only: edit files under `build/founder-mode/what-why/` and run the gates. No writes to TestRail, Jira, Slack or Google; no
commits. Save often. Your prompt names your PHASE.

## The model to copy
The Parts Lifecycle full pass of the same day is the worked example: `build/founder-mode/part-lifecycle/` — its `authoring/` library
(pllib.py, common.py, build.py with every gate, gate_selftest.py + plants.py, requirement_map.py, ledger.py, render_setup.py,
render_outputs.py, apply.py with the Rule 138 guard, edit lock on the latest read-back and idempotent picture upload),
`PHASE-A-HANDOFF.md`, `full-pass-2026-10-27/WORKER-BRIEF.md`, `INTEGRATION-REPORT.md`, and its live cases (e.g. S2-17, S9-21, D-11 in
`part-lifecycle/authoring/proposals.json`). Copy the structure and every gate; adapt names (keys S1-01…, S4-…, D-…).

## Read first, in full (Rule 119; state your reading coverage at the end)
- Rules: `build/rules/RULES-61-96.md` — Rules 113, 114, 116, 117 (ALL amendments, especially FOURTEENTH and FIFTEENTH), 122, 124, 126,
  129, 130, 133, 134, 135, 136, 137, 138. `build/LESSONS-REGISTER.md` (L-01 to L-19). `build/skills/IDEAL-TEST-CASE-STANDARD.md`;
  design phase also `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (§4b, §6b, §6d).
- Project: `build/founder-mode/what-why/PROJECT-STATE.md`, `update-2026-10-13/` (FULL-UPDATE, DESIGN-COVERAGE), `questions-2026-10-14/`.
- Sources (the ONLY sources of expected behaviour, Rule 57):
  - PRD "What Are You Doing / Why Are You Doing It?", Confluence 845348896, **version 15** (14 Oct 2026 16:32 UTC; v14 the same day
    holds Chris Ward's answers to our 8 questions; v15 changed only the Status row). Phase A: fetch it with the Atlassian tools
    (cloudId shopview.atlassian.net, content_format markdown, detail full — a large result is saved to a file; parse the JSON there)
    and save it as `sources/CONFLUENCE-845348896-v15-2026-10-27.md`; diff it against our v13 copy
    `sources/CONFLUENCE-845348896-2026-10-13.md` by requirement code and record `full-pass-2026-10-27/PRD-DIFF-v13-v15.md`.
    The v14 Change Log row names: S1-R1, S1-R3, S1-R6, S3-R3, S3-R6, S3-R6a, S3-R8, S3-R4, S3-N1, new S3-E4, S4-R3.
  - Chris Ward's 8 answers (14 Oct): Google Doc 1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA (read it with the Drive tools,
    read_file_content); quote the PRD where it now carries the answer, the answer only where the PRD is silent.
  - Tech plan 23 Sep 2026 (re-shared 27 Oct, byte-identical): `sources/tech-plan-Title-and-Description-2026-10-13.md` — informs,
    never overrules.
  - Jira: epic SV-11257 (status TESTING QA), stories SV-10130 … SV-10133 (all "Merged to Staging"), verify tasks SV-10390 … SV-10393
    (Done), and the bug **SV-11850** filed 27 Oct ("ShopCoach Line Builder on staging: Build Lines fails with 'Failed to parse work
    description into lines' and the UI shows nothing") — read every one in full now. A case whose steps go through Build Lines takes
    `AUTOMATION: READY - EXPECT FAIL (SV-11850)` with the symptom and the three outcomes (Rule 61) only if SV-11850's symptom is what the
    tester will meet; otherwise note it.
  - Design canvas https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6 — 8 files; re-read 27 Oct, only change since 13 Oct: "Title *" →
    "Title" in Main.dc.html. Work from `sources/design-2026-10-27-artifact/files/` (and the 13 Oct copy's rendered page
    `sources/design-2026-10-13-artifact/artifact-page.html` for driving in Chromium; Playwright is installed).
- A QA build exists (sv10130.qa.shopview.com, QuickBooks qb1.qa.shopview.com) and the stories are on staging, but this pass is
  source-only: never take an expectation from a build (Rule 57). Screen labels you cannot confirm from the sources are listed.

## The target: every case in the QA lead's pattern
Exactly as in the Parts Lifecycle brief (`part-lifecycle/full-pass-2026-10-27/WORKER-BRIEF.md`, section "The target"): plain title
(≤ 80 chars, design cases "Design: "), short plain setup bullets only for what the steps and results need, no {placeholders}, no "For
example:", no Scenario line, no setup-document link, no Blocked line, no case ids or who-to-ask; one UI action per step; "Step N:"
results saying what the tester sees, controls for every "does not appear"; `<p></p>`; quotes verbatim from v15 with From: lines;
References from Design; AUTOMATION line last. Story 3 (what reaches QuickBooks) is numeric/text-exact: Rule 116 in spirit — exact
joined text from known inputs, both routes (live sync to QuickBooks and the downloaded Customer Invoice report) shown, the 4,000-byte
cut with a multibyte example computed exactly. A behaviour a manual tester cannot set up or reach is "No manual case" (L-14).

## Keep every existing case's C-id
The 37 live cases: read-backs in `update-2026-10-13/applied/` (latest write 13 Oct). Map each to a key in `testrail-id-map.csv`
(key, case_id, section_id, title) so the coordinator UPDATES in place; new requirements get new keys. Sections: S1 20461, S2 20462,
S3 20463, S4 20464 (`section-map.json`); design-look cases go in a NEW section "Design — how it looks" under What/Why 20437 (the
coordinator creates it and writes its id into section-map.json as "DESIGN").

## Phases
- **A, library + all four stories:** read everything; build `authoring/` (copy Parts Lifecycle's), REQUIREMENT-MAP (every v15 code),
  TICKET-LEDGER.json (every ticket above), DESIGN-DIVERGENCE-REGISTER.json, testrail-id-map.csv for all 37, the setup file
  `WHAT-WHY-SETUP-FILE.md`, and write every case of Stories 1-4. Leave `PHASE-A-HANDOFF.md` for phase D.
- **D, design:** part 1 (no cases; only under `full-pass-2026-10-27/design/`): drive the whole design (Rule 120/124/126/133), text and
  visual inventories (0 unclassified), the §6d checklist and every lessons row, PRD v15 ↔ design both ways, `DESIGN-CASE-PLAN.md`,
  divergence rows and questions. Part 2 (after phase A, on the coordinator's word): write the "Design — how it looks" cases in
  `authoring/cases_design.py` only.

## Gates before you finish
`python3 authoring/build.py` → `PROBLEM lines: 0`; `authoring/gate_selftest.py` → 0; `python3 build/testing-tools/tester_readiness_check.py
build/founder-mode/what-why --sample 5` → exit 0, and READ its sample and every "does not appear" result in full. Open questions go to
`full-pass-2026-10-27/QUESTIONS.json` (plain words, held keys); nothing is sent.

## Final message
Reading coverage; counts (rewritten / split / new / "No manual case", per section); gate output; readiness output and what you read;
3 samples old vs new; open questions; what you could not settle.

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
