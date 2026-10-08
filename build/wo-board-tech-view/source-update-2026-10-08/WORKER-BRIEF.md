# WO Board & Tech View — full rewrite brief (8 October 2026)

QA lead orders: *"never do anything in DELTA mode, you fully drive the design and create/edit the test cases as needed to
make them runnable for the manual QA tester"* (Rule 122) and, on 8 Oct, the go-ahead to write this update ("1. Yes").
Every case in your share is re-read and rewritten **in full** to the standard below — not only where a source changed.
**You write a proposals JSON only. Never call TestRail write endpoints, never git commit, never sign into any QA build.**

## Sources — read every one in full (Rule 119), and state your reading coverage at the end
| Source | Path / how |
|---|---|
| **PRD** (THE authority; quotes come from here), Confluence 845185030, edited 7 Oct 2026 (status line still "PRD v33") | `build/wo-board-tech-view/sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md` · anchor map `source-update-2026-10-08/anchor-quotes-2026-10-08.json` (normalised: straight quotes, no `**`) |
| Review Decisions & Open Questions, Confluence 853901313, 29 Sep | `build/wo-board-tech-view/sources/CONFLUENCE-853901313-Review-Decisions-Open-Questions-2026-09-29.md` |
| PRD page comments (footer + inline, with replies) — PO decisions 24 Sep–7 Oct, all folded into the 7 Oct PRD | fetch yourself: Atlassian MCP `getConfluencePageFooterComments` and `getConfluencePageInlineComments`, cloudId `shopview.atlassian.net`, pageId `845185030`, `includeReplies: true`, `contentFormat: markdown`, limit 100 |
| Epic SV-10043 stories, descriptions + comments (8 Oct) | `build/wo-board-tech-view/sources/jira-2026-10-08/SV-10043-stories-2026-10-08.md` |
| Tech plan, revised 24 Sep (uploaded by the QA lead 8 Oct; informs, never overrules — Rule 30) | `build/wo-board-tech-view/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md` |
| **Design export of 8 Oct** (Branko's Claude Design project; on-screen labels and navigation ONLY, Rule 57) | `build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html` (template text) + its `screenshots/` + `uploads/`; one-click sweep text `source-update-2026-10-08/design-drive/work-orders/Work Orders-pages.txt` and `…-interactions.jsonl`; **stateful crawl so far** `source-update-2026-10-08/design-crawl/{list,tech,board}/states.jsonl` (each line = one screen: `lines` = every visible text line, `shot` = screenshot) and `actions.jsonl` (what each hover/click/type/drag showed). The crawl is still running; read what exists when you start. A final label check against the complete crawl runs after you. |
| Your cases as they are live now | `source-update-2026-10-08/snapshots-before/C<id>.json` |
| Earlier recheck notes (history, facts only) | `build/wo-board-tech-view/V33-RECHECK-2026-09-30.md`, `RULE117-REFORMAT-AND-TECHPLAN-2026-09-30.md`, `PROJECT-STATE.md` |
| The locked case standard + worked example | `build/skills/IDEAL-TEST-CASE-STANDARD.md`; `build/founder-mode/part-sales/snapshots-2026-10-05/C154586-after.json` |
| Rules 113, 114, 116, 117, 119–123 (read in full) | `build/rules/RULES-61-96.md` from line 2391 to the end |

**Hands off:** cases created by Vladimir Tomovic (created_by 1): C204099–C204101, C228761–C228763, C236975–C236983,
C335320, C335321, C351740. Read them (they show what automation already covers) but never propose a change to them.

## What changed since 30 Sep (you still rewrite EVERY case in your share)
- **17 new PRD requirements with no case:** S2-R16, S2-R17, S2-R18, S2-N4, S2-N5, S3-R20a, S4-R28, S4-R29, S4-R30, S4-R31,
  S4-N10, S4-N11, S4-N12, S7-R7, S7-R8, S7-R9, S7-R10.
- **3 changed requirements:** S1-R12 (C96917 quotes the old text), S3-R20 (C96950), S9-R14 (C97007).
- **QA build exists** (sv10043.qa.shopview.com) but is NOT a source and is not to be opened.

## The standard every case must meet (Rules 113/114/116/117 + the 7 Oct title rule)
1. **Title**: ≤ 80 characters, one check, no semicolons, the screen's own words, no specification shorthand (no "S4-R11",
   rule numbers, "parity", "denominator", "N-open composition"…). A manual tester must understand it.
2. **Preconditions**: numbered single actions with real click-paths; every seeded value an example *(e.g. "S1-702")*.
   Sign-in, permissions (Settings > Roles & Permissions: Work Orders view; Work Orders create and edit for dragging /
   reassigning), the location in the top bar, technicians that count as eligible (Clockable, Active, role not Office or
   Time Clock User, enrolled at the location) and how to make one, work orders in each status needed and how to reach
   that status, shifts on the Schedule where the shift prompt is tested. **Never** "the display options are on" (there is
   no switch — the display switcher is simply on the Work Orders page), never "seed the exact records", never an internal
   rule number. Where a case needs a second user (another dispatcher, a user without create-and-edit), say how to create
   them; the manual tester creates any organization, location or user a case needs (L13), never "ask the QA lead".
3. **Steps**: numbered, ONE UI action per line, the design's on-screen labels (e.g. "Status", "Assigned to me", "Columns",
   the display switcher, "Reassign lead technician", "Keep shifts" / "Clear shifts" / "Cancel"). A step is an action,
   never "confirm X" or "check that" — checks belong in Expected.
4. **Expected results** = runnable observations: what the tester SEES, one per bullet, arithmetic written out (counts).
   Then **Source** (one paragraph): `Epic SV-10043; story <SV-key> (<Story n name>); PRD Confluence 845185030, edited
   7 Oct 2026 (status line "PRD v33"), <anchors>, read 8 Oct 2026.` plus the Review Decisions row / PO comment (author,
   date) / tech-plan section / design screen where used. Then **Exact quotes** — the PRD sentence for each anchor copied
   **verbatim from the PRD file** (keep its quote marks as they are; drop only the `**` bold markers). Quotes pair with
   results; the quote wins.
5. **Cannot be checked by hand** (server refusal, timing, true concurrency, analytics payloads): express it as something a
   human can do (two browsers / two users dropping at the same moment, a user without the permission), or say plainly in
   the plain result "this part cannot be checked by hand; write 'not checked by hand' in the result comment and pass or
   fail on what you can see". Never leave an instruction a manual tester cannot carry out.
6. **Design vs spec**: the design may use other words than the PRD (known: switcher tooltips "Table / By Lead Tech /
   Board" vs PRD "List / Tech View / Board View"; "Row height: Small/Medium/Large" vs PRD "Density: Compact/Regular/
   Comfortable"; empty texts). Steps may use the design's word where that is what the tester will click, but Expected
   follows the PRD and tells the tester "write down the words you see; a different label alone is not a fail" only where
   the PRD does not fix the wording; where the PRD DOES fix the words (e.g. S4-R29 prompt text, S4-N10–N12 alerts, S3-R20
   empty text), Expected asserts the PRD words exactly. List every difference in `notes`. Design-only testable details
   (not contradicting the PRD) may be ADDED, cited to the design screen (Rule 115).
7. **AUTOMATION marker** (exactly one, the last line of Expected): keep `AUTOMATION: HOLD - not yet build-verified on the
   Work Orders QA build` for every case (nothing is build-verified yet); keep C154650's own marker text unchanged.
8. **Coverage**: every PRD anchor in your share must be quoted by at least one case. Report any you could not place.
   Removed nothing: if a case's whole basis left the PRD, propose `"retire": true` with the reason instead of rewriting.

## Output — ONE JSON file (path given in your task), exactly this shape
```json
{"updates":[{"case_id":96950,"title":"...","preconds":["..."],"steps":["..."],"results":["..."],
  "source":"Epic SV-10043; story SV-10046 (Story 3, Board View); PRD Confluence 845185030, edited 7 Oct 2026 ...",
  "quotes":[["S3-R20","<verbatim PRD text>"]],"marker":"AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build",
  "change_summary":"one line"}],
 "new":[{"key":"NEW-1-01","section_id":13237,"title":"...","preconds":[],"steps":[],"results":[],"source":"",
  "quotes":[],"marker":"","why":"which anchors it covers"}],
 "retire":[{"case_id":0,"why":"..."}],
 "notes":["design-vs-spec differences, PO questions, anything unresolved"],
 "anchors_covered":{"S2-R16":["NEW-1-01"]},
 "reading_coverage":"file — size — lines read — 100%"}
```
Plain text only in every string (no HTML). Each list item is one line; a sub-step starts with "↳ ". Write the JSON with a
script (so quotes are copied from the PRD file programmatically, never retyped), validate it, and report counts.
Tech-plan quotes use anchor names starting "Tech plan " and are copied from the tech-plan file.

## Token-Discipline Charter (Rule 95) — embedded verbatim
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
