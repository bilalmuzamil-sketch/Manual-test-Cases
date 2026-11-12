# Worker brief: drive the Internal Work Orders design in full (12 Nov 2026)

QA lead, 12 Nov 2026: new suite "Internal Work Orders" (TestRail section 136701, suite 1, Founder Mode). Design:
https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo?sk=GdEwnxdol4-wwzIbj16WiA (canvas "Internal Work Orders · All flows v6", version
1794484794-2031). His words: "You must always be able to drive the design fully" and "make sure you go through all the flows from the
drop down appearing at the top right side". The QA lead is travelling; work unattended and unblock yourself (Rule 121) — never get around
a bot check or permission control.

You do NOT write to TestRail, Jira, Slack or Google; no commits. Work only inside `design-2026-11-12/` (read anything else), plus
`../DESIGN-DIVERGENCE-REGISTER.json` (create it). Two other workers run in parallel (PRD cases in `authoring/`, tech plan in
`tech-plan-2026-11-12/`); do not touch their folders.

## The design (saved; read every file, Rule 119)
- `files/project/canvas.json`: the dropdown = 10 pages: Happy flow v6 (44 boards), Review · What changed after the CEO review (34),
  Flow 0 · Turn it on (19), Flow 1 · Create and close (25), Flow 2 · No charge on a customer's work order (15), Flow 3 · Reopen (3),
  Flow 4 · Find internal and no-charge work orders (11), Flow 5 · What the books see (5), Flow 6 · Move one line off a billable work
  order (7), Shared screens (4). 167 boards, **198 canvas notes** (titles and stickies: design words too — inventory them).
  Board → page map: `PAGES-AND-BOARDS.json`.
- `files/project/*.dc.html`: LIVE HTML boards (not pictures). The 4 artboards (WO-Detail, WO-List, WO-Settings, New-WO-Dialog, all v6)
  are components with props (variants, `data-props` enums/booleans); most flow boards are `<dc-import>` instances setting props. Many
  hf-/rv-/flowN- files are byte-identical (same sha256; see the read log): drive each distinct board once but record every board.
  They use `files/project/_ds/.../_ds_bundle.js` (window.SV components), the two CSS files, and the canvas runtime
  `files/artifact-type/dc-runtime.js`; `./support.js` is injected by the canvas and is not published.
- The QA lead's browser save of the canvas: `../from-qa-lead-2026-11-12-final/design-saved-page.html` and `design-saved-page-files/`
  (`_t.html` = the canvas shell with the index; `saved_resource(1..13).html` = 13 boards fully rendered, e.g. "01 Turn on Internal Work
  Orders", "07 Invoice · the line at $0.00, Warranty", "42 AccountingHub · Held event", "7.5 · 39b Report · by technician", "18 Closed ·
  INTERNAL document", "29 Closed · NO CHARGE document", "19 Work orders list · Status Closed"). Use them to check your own rendering.
- The canvas page itself is behind a Cloudflare bot check for a headless browser: do not try to get around it. Render locally:
  build a small harness (serve `files/` locally; provide the `support.js` the canvas would inject — find what it must be from
  `dc-runtime.js`, `_t.html` and the saved frames; Playwright + Chromium are installed, `require('playwright')`). If a board cannot be
  rendered locally, read its source and its dc-import target with the props it sets, and record it as "read from source, not rendered".
- PRD (WHAT the product does): `../sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0, 2026-11-09, Milos Vasic, last modified
  10 Nov 2026). The design is the source for the LOOK where the PRD is silent (Rule 126). Every difference is a design difference (Rule 130).

## Rules and skills to read first, in full
`build/LESSONS-REGISTER.md`; `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole; §4, §4b, §6, §6b, §6c, §6d checklist);
`build/rules/RULES-61-96.md` Rules 117 (tenth, twelfth, fourteenth, fifteenth amendments), 120, 124, 126, 130, 133, 139. Worked examples:
`build/founder-mode/bill-to/design-2026-11-09/` (its WORKER-BRIEF, tools, inventories, plan) and `build/credit-terms/design-2026-10-23/`.

## What to do
1. **Drive every page of the dropdown, every board, every variant** (Rule 120): render each distinct board at its own size, light theme,
   screenshot to `images/iwo-<page>-<nn>-<slug>.png`, view every picture. Click/hover everything interactive (menus, tabs, chips,
   toggles, line menus, dialogs) where the board is interactive; record what each exposes. Record per page that every board was done.
2. **Text inventory** of every word on the boards (rendered), the board titles, and all 198 canvas notes: each row DATA / PRD-MATCH (code
   or §8 row, word for word, letter case by hand) / OUT-OF-SCOPE (unchanged production) / SPEC-CONFLICT (quote both) / LOOK-ONLY;
   zero unclassified. Watch the "Review · What changed after the CEO review" page: it shows what changed; check each change against the
   PRD (Final v1.0 may already include or reject it).
3. **Visual inventory** per screen and state: Settings (setting off/on, internal customers, categories), Edit Customer / Edit Asset
   (Internal customer flag, default internal category), New WO dialog, WO list (badges Internal / No Charge, Classification chip,
   Internal chip, Status Closed, total "No Charge"), WO detail (orange outlined header, badges, lines without sell prices, hours and cost,
   shop supplies flat amount, line menu Change category / Mark as Billable / No Charge, Notes and Audit Log), Close dialog, Closed ·
   Internal / Closed · No Charge, NO CHARGE / INTERNAL documents, Reopen, invoices with a No Charge line ($0.00, Warranty), reports
   (by technician), QuickBooks and AccountingHub screens (held event, journal), portal. Sizes, wrapping, no overlap at 1440/1536 px.
4. **PRD → design check** (Rule 130, §6c): every PRD screen/label/message sentence against the boards: SHOWN / NOT SHOWN / DIFFERENT.
   Every difference goes in `../DESIGN-DIVERGENCE-REGISTER.json` (id IWO-D01…, board, picture, design words, PRD words + code, kind,
   proposed outcome: a question for Milos, or settled by a named PRD sentence). "Cases follow the spec" is never an outcome.
5. **Design-case drafts** `DESIGN-CASE-PLAN.md`: every look case the §6d checklist needs, in the QA lead's pattern (title "Design: …",
   ≤ 80 characters, no semicolons; preconditions "Sign in as … / Use a … / Have a …"; numbered one-action steps; "Step N:" bullets; the
   design's own words under "References from Design" naming page, board and picture to attach), at 1440 and 1536 px where wrapping could
   matter; plus one HELD "design version" case per behaviour difference (Rule 130). Expected behaviour from the PRD; the look from the design.
6. **Questions for Milos Vasic** in `NEW-QUESTIONS.py` (ROWS list): the QA lead calls him "sir"; plain, friendly, short, written by
   someone who knows ShopView well (name the screens and buttons as ShopView users know them; never robotic, never explaining ShopView
   basics back to him); (a)/(b)/(c) options with a suggested one; what we know today; where (page, board, PRD code); cases affected.
   Skill 07 §6 first: drop anything the PRD settles and list what you dropped.

## Output
`DESIGN-READING-RECORD.md` (every file and board: size, sha256, rendered or read, 100%), `DESIGN-FIGURES-2026-11-12.json`, `images/`,
`DESIGN-TEXT-INVENTORY.json` + `.md`, `DESIGN-VISUAL-INVENTORY.md`, `SPEC-TO-DESIGN-2026-11-12.json`, `DESIGN-CASE-CHECKLIST-2026-11-12.md`,
`../DESIGN-DIVERGENCE-REGISTER.json`, `DESIGN-CASE-PLAN.md`, `NEW-QUESTIONS.py`, `tools/`, `NOTES.md` (write as you go). Final message under
300 words: counts per page, inventory rows by class, differences one line each, design-case count, questions.

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
