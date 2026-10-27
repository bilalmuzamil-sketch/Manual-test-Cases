# Worker brief: Parts Lifecycle full pass (27 Oct 2026)

QA lead, 27 Oct 2026: *"Parts lifecycle is the next, we need to make sure it is fully covered with the test cases and design"*, then
chose **"Full pass"** and **"Delete all 12"** (the "Retire OR retest" section; the coordinator deletes those, not you). Standing words:
*"Make sure that your work does not bite me"*; *"The preconditions should be something like the easiest to understand for a layman or
a manual QA tester to setup and they must make sense and relate to the steps and expected results below"*; *"One tells what to do and
other tells what to expect"*; *"never add that line in the future test cases too"* (the "mark this test Blocked" line).

You DRAFT only: edit files under `build/founder-mode/part-lifecycle/` and run the gates. No writes to TestRail, Jira, Slack or Google;
no commits. Save often (container restarts happen; files on disk survive). Your prompt names your PHASE and your story range.

## Read first, in full (Rule 119; state your reading coverage at the end)
- Rules: `build/rules/RULES-61-96.md` — Rules 113, 114, 116, 117 (ALL amendments, especially the FOURTEENTH and FIFTEENTH, just above
  Rule 118), 122, 124, 126, 129, 130, 133, 134, 135, 136, 137, 138 (end of file). `build/LESSONS-REGISTER.md` (L-01 to L-19).
  `build/skills/IDEAL-TEST-CASE-STANDARD.md`; design phase also `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (§4b, §6b, §6d).
- Project: `build/founder-mode/part-lifecycle/PROJECT-STATE.md`, `update-2026-10-14/FULL-UPDATE-2026-10-14.md`, `PRD-CHANGES.md`,
  `COVERAGE-2026-10-14.md`, the PO answers in `po-answers-2026-10-09/` and `po-answers-2026-10-14/`.
- Sources (the ONLY sources of expected behaviour, Rule 57):
  - PRD "Parts Lifecycle Update", Confluence 829227015, **version 33** (23 Oct 2026 14:28 UTC, last edit "S8-R14/S8-R15 context note
    formatting (literal asterisks); wording unchanged"): `sources/CONFLUENCE-829227015-PartLifecycle-v33-2026-10-27.md`. Our cases
    quote v29 (`sources/CONFLUENCE-829227015-PartLifecycle-2026-10-14.md`). Script diff of the requirement codes v29 → v33: 311 codes
    (302 before); NEW S1-E1, S5-E1a, S6-R1a, S9-R21, S9-R22, S11-R8, S11-R9, S13-N1a, S13-N1b; CHANGED S7-R6c, S9-N3a, S10-R22a,
    S12-R14b; none removed. Also diff the non-code text yourself (overview, out of scope, decisions, Change Log rows of 19 and 23 Oct).
  - Tech plan 7 Oct 2026 (the QA lead re-shared it 27 Oct; byte-identical): `sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md`.
    It informs, never overrules (Rule 30); a conflict with the PRD is a PO question.
  - Jira: epic SV-10647; stories SV-10814 … SV-10826 (9 edited 23 Oct 2026 — read each one now, in full, with the Atlassian tools
    available to you, cloudId shopview.atlassian.net); bug SV-10380 (Inventory Value net quantity, ships with this epic); new task
    SV-11756 "Duplicate-part merge tool can change past Inventory Value when one copy is untracked" (26 Oct); verify tasks
    SV-11038 … SV-11046 (developers' check lists — facts about what is testable, not sources of expected behaviour unless they quote the PRD).
  - Design canvas https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE — unchanged since 13 Oct (all 53 files identical, re-read 27 Oct):
    work from `sources/design-2026-10-13-artifact/` (files/, png/, artifact-page.html opens in Chromium; Playwright is installed).

## The target: every case in the QA lead's pattern (Rule 117 fourteenth + fifteenth amendments, Rules 135-138)
Model case C665915 (Splitting Sales Representatives). Title in plain words (≤ 80 chars, no semicolons; design cases start "Design: ").
Preconditions: short plain bullets ("Sign in as …", "Have a …", "Create … for this test", "Make sure …", "Use a desktop browser …",
"Open …"), only what the steps and results need, each related to them (or saying why with "so …"), records named plainly ("part A",
"part B", "work order 1"), NO {placeholders}, NO "For example:" lines, NO Scenario line, NO setup-document link, NO Blocked line,
no who-to-ask, no case keys or C-ids. A record a step changes is created for this test; a shared setting is a "Make sure …" bullet; no
case relies on another. Steps: numbered, one UI action each, the screen's own labels. Expected Result: "Step N:" then bullets, one
observable fact each, saying what the tester SEES (no "native", "as designed", "looks right", "the same style"). A "does not appear /
nothing changes" result gets a control the tester can see, backed by a source sentence, or is listed. Then `<p></p>`, then "Exact
quotes from the source (for reproducibility)" with a From: line per document (eleventh amendment) and the verbatim quotes (Rule 113;
re-copied from v33, never edited), "References from Design" (tenth amendment) with the board names and attached pictures, then the
AUTOMATION line last (`AUTOMATION: HOLD - not yet build-verified (no build yet)` unless a better true reason applies). A case a manual
tester cannot set up or reach is NOT written as a manual case: list it with the requirement as "No manual case" (L-14).
Model the authoring library on `build/credit-terms/authoring/` (ct_lib.py, common.py, pattern.py, relevance.py, cases_*.py, build.py,
render_setup.py, render_outputs.py, update_changed.py, create.py): copy its structure and gates, adapt the names. The setup file for
Claude sessions (`PARTS-LIFECYCLE-SETUP-FILE.md`) may hold examples and recipes; TestRail text may not. The 274 per-case Google Docs
are no longer linked from any case.

## Keep every existing case's C-id (no duplicates)
The live cases are the read-backs in `update-2026-10-14/applied/C<id>-after.json` (latest write 14 Oct; the 12 "Retire OR retest"
cases C425659, C425758, C425639, C425759, C154761, C425602, C425622, C425629, C425701, C425723, C425755, C425776 are being deleted:
never map a key to them, and record each requirement they alone covered as removed from the PRD or "No manual case"). Every
remaining case maps to a library key in `testrail-id-map.csv` (key, case_id, section_id, title) so the coordinator UPDATES it in place.
A requirement that needs a new case gets a new key (no case_id yet). Rule 136 splits keep the original C-id as part 1. Sections stay as
in `section-map.json` (S1 20468 … S13 20480, SV-10380 54274); design-look cases go in a NEW section "Design — how it looks" under
Part Lifecycle 20439 (key prefix D-; the coordinator creates the section).

## Phases (your prompt says which is yours)
- **A, foundation + Stories 1-5:** read every source above in full; build `authoring/` (library, gates, quote parser that takes each
  v33 requirement line itself, never a Change Log row), `TICKET-LEDGER.json` (every ticket under the epic, Rule 129),
  `DESIGN-DIVERGENCE-REGISTER.json` (carry the 13 Oct rows, add any new), `REQUIREMENT-MAP.json` (every one of the 311 codes →
  planned case keys or "No manual case"/out of scope with reason), `testrail-id-map.csv` for ALL remaining live cases (all stories),
  then write Stories 1-5. Leave clear module stubs and a `PHASE-A-HANDOFF.md` (what B/C/D must follow) for the other phases.
- **B, Stories 6-10** and **C, Stories 11-13 + SV-10380 + SV-11756:** using Phase A's library, write your stories' cases (every
  existing case rewritten top to bottom, Rule 134; new cases for new requirements), in your own case modules only.
- **D, design look:** drive the whole design (Rule 120/124/126/133): every board, page and chunk; the text inventory
  (`build/testing-tools/design_text_inventory.py`, zero unclassified), the visual inventory (`design_visual_inventory.py`), the §6d
  checklist and every lessons-register row; write the "Design — how it looks" cases (default columns, icons, cell styles, header, page
  frame, dialogs, menus, tooltips and their position, empty/loading/error states, 1440 and 1536 px, light theme as drawn) — the design
  is the source for the look where the PRD is silent; a design-vs-PRD difference goes to the divergence register with a held "design
  version" case and a question (Rule 130). Proof file `full-pass-2026-10-27/DESIGN-DRIVE-PROOF.md`.

## Gates before you finish (every phase)
- `python3 authoring/build.py` ends `PROBLEM lines: 0` (coverage of every code you own, quotes verbatim from v33, pattern, relevance,
  independence, Blocked line, one action per step).
- `python3 build/testing-tools/tester_readiness_check.py build/founder-mode/part-lifecycle --sample 5` exits 0 (it reads
  `authoring/proposals.json`); READ its sample and every "does not appear" result it lists, in full.
- Open questions (no quotable sentence, PRD vs design, PRD vs tech plan): one row each in `full-pass-2026-10-27/QUESTIONS.json`
  (plain words, the case keys held on it). Carry the 7 open items from the 14 Oct record and check whether v33 now answers them.

## Final message
Reading coverage; counts (existing cases rewritten, split, new, "No manual case", per section); gate output; readiness check output and
what you read in its sample; 3 sample cases old vs new; open questions; anything you could not settle.

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
