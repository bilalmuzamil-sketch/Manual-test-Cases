# Worker brief: drive the Technician Toggle design in full (2 Nov 2026)

QA lead, 2 Nov 2026: new testing suite "Technician Toggle"; design https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R (canvas
"Technician Toggle", version 1793629882-06f7, created 2026-10-26T21:53Z). A second worker drafts the PRD cases in parallel in
`build/technician-toggle/authoring/`. Your job is the design drive, its proof, and the design-case drafts; the case worker turns your
drafts into cases in a second round.

You do NOT write to TestRail, Jira, Slack or Google; no commits. Work only inside `build/technician-toggle/design-2026-11-02/`
(read anything else), plus the one file `build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json`.

## The design (saved; read every file, Rule 119)
`design-2026-11-02/files/`:
- `project/canvas.json`: 6 pages, one board each — p1 "1 Staff list" Main.dc.html · p2 "2 Turn Technician on for a staff member"
  TurnOn.dc.html · p3 "3 When Technician can't be turned on" NotATech.dc.html · p4 "4 Turn Technician off with open work"
  TurnOff.dc.html · p5 "5 Board View and Tech View" BoardTech.dc.html · p6 "6 Technician dropdowns on a work order" WorkOrder.dc.html.
- The boards are frames of real screenshots with captions, built from the ShopView design system (`project/ds/shopview/*.css`,
  tokens.json; the Inter fonts were not downloaded). 25 screenshots in `project/shots/`: `before-*` = production today (release
  v26.43.1), `after-*` = the feature's build. Each board references `./support.js` (injected by the canvas runtime, not published):
  render without it and record anything that does not render.
- `SKILL.md`, `index.html`, `artifact-type/reference/*.md`, `artifact-type/thumbnail/thumbnail.json`: the design tool's own files.
  Read them; note whether they hold ShopView content (compare md5 with `build/credit-terms/design-2026-10-23/files/` where the same
  file exists). The viewer runtime (app.js, app.css, dc-runtime.js, fast-edit-worker.js, fonts) was not downloaded: record it as
  "viewer runtime, not design content" (read in full on 22 Oct, `build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/`).
- PRD v17 (the source of WHAT the product does): `build/technician-toggle/sources/CONFLUENCE-977371146-v17-2026-11-02.md`. The
  design is the source for the LOOK where the PRD is silent (Rule 126). Every place the design differs from PRD v17 is a design
  difference (Rule 130). Note: the build screenshots ("after-*") show a build; the build is never a source of expected behaviour
  (Rule 57) — but Chris made these boards the design, so their look counts as design.

## Rules and skills to read first, in full
`build/LESSONS-REGISTER.md` (every row); `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole file, especially §4, §4b, §6, §6b, §6c,
§6d checklist); `build/rules/RULES-61-96.md` Rules 117 (tenth, twelfth, fourteenth and fifteenth amendments), 120, 124, 126, 130,
133. Worked example of the same job: `build/credit-terms/design-2026-10-23/` (WORKER-BRIEF, reading record, tools/, inventories,
checklist, NEW-QUESTIONS.py). Reuse its tools (`tools/render.js`, `extract.py`, `screen_text.py`, …) by copying them into your
`tools/`; `build/testing-tools/design_text_inventory.py`, `design_visual_inventory.py`, `spec_to_design_check.py` as they fit.

## What to do
1. **Render every board** at its own width in light theme; screenshot every figure into `images/` (`tt-p<page>-<nn>-<slug>.png`);
   view every picture. Hover/click anything interactive (Rule 120); the boards have empty scripts, so record that.
2. **View every one of the 25 screenshots at full size and transcribe every word on it** (Rule 124): window titles, field labels,
   toggles and their states, pills, tooltips, column headers, cell values and colours, notices, dialog title/text/buttons, menu items,
   empty states, search texts, toasts.
3. **Figures list:** `DESIGN-FIGURES-2026-11-02.json` — every figure: board, page, badge (Production today (before) / This build),
   heading, caption bullets, picture file, the state it shows.
4. **Text inventory:** every word in the boards, captions and screenshots, each row classified DATA / PRD-MATCH (with the PRD code or
   §8 row it matches word for word) / OUT-OF-SCOPE (including everything in a `before-*` picture that is unchanged production, and
   production screens the feature does not touch) / SPEC-CONFLICT (design words differ from PRD v17 — quote both) / LOOK-ONLY;
   zero unclassified. Compare letter case by hand (L-04). Watch for: "Save & Close" vs the PRD's "Save"; "Add Labor" (WorkOrder
   caption) vs the PRD's "Edit Labor window"; the New Staff Member window opening "with no role and Time Clock off"; the warning's
   buttons; "No results" in the Technician filter; "No technicians match "Oli"" quote marks (the PRD uses curly quotes).
5. **Visual inventory:** per screen and state: the toggle row (order Time Clock, Sales Representative, Technician; one row below
   Billable in New and Edit), the "New" pill (place, touching the word, same look as the Work Orders display switcher pill), grayed
   toggle and tooltip position, staff list column place (left of Billable), Yes green / No red, header pill clear of Billable, notice
   (place, colour, icon, no close button), the Turn Off Technician window (title, text, buttons and colours, X), Board View columns
   order by name, Tech View groups, filter list, Reassign window, Lead Technician dropdown (grayed current lead last with check),
   Add Technician list, grayed chip; sizes and wrapping; no overlap at 1440 px. Note what the PRD says that no board shows.
6. **PRD → design check (Rule 130, §6c):** every PRD look/screen sentence (S1–S4, S3-R10 empty states, §8 rows) against the boards:
   SHOWN / NOT SHOWN / DIFFERENT. Every difference either way goes in `build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json`
   (create it) with: id, board, picture, design words, PRD words + code, kind (wording / behaviour / look), proposed outcome (question
   for Chris, or settled by a named PRD sentence). "Cases follow the spec" is never an outcome.
7. **Design-case drafts:** `DESIGN-CASE-PLAN.md` — every "looks as designed" case the §6d checklist needs, written in full in the
   QA lead's pattern (Rule 117 fourteenth/fifteenth amendments; title starts "Design: ", ≤ 80 characters, no semicolons;
   preconditions as plain "Sign in as … / Use a … / Have a …" bullets; numbered steps, one action each; "Step N:" results with
   bullets; the design's own words quoted under a "References from Design" block naming the board/page and the picture to attach),
   at 1440 and 1536 px where the layout could wrap; plus one HELD "design version" case per behaviour difference (Rule 130).
   Expected behaviour still comes from the PRD; the design gives the look.
8. **Questions:** draft the design questions for Chris Ward in `NEW-QUESTIONS.py` as a ROWS list (number from 1; topic "Technician
   Toggle: …"; question with (a)/(b)/(c); what we know today; where we found it (board, picture, PRD code); cases affected). Apply
   skill 07 §6 first: drop anything PRD v17 settles, and list what you dropped and why.

## Output
`DESIGN-READING-RECORD.md` (every file, size, read how, 100%); `DESIGN-FIGURES-2026-11-02.json`; `images/`;
`DESIGN-TEXT-INVENTORY.json` and `.md`; `DESIGN-VISUAL-INVENTORY.md`; `SPEC-TO-DESIGN-2026-11-02.json`;
`DESIGN-CASE-CHECKLIST-2026-11-02.md` (§6d, every line ticked or explained); `build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json`;
`DESIGN-CASE-PLAN.md`; `NEW-QUESTIONS.py`; `NOTES.md`. Final message (under 300 words): counts (files, figures, pictures, inventory
rows by class), the differences one line each, the design-case count, the questions.

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
