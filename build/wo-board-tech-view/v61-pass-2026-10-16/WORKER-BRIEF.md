# Worker brief: WO Board and Tech View, full pass to PRD version 61 (16 Oct 2026)

You are rewriting one batch of existing TestRail cases to the current case standard and to PRD version 61. You write files in
the repository and create public Google Docs. **You never write to TestRail, Jira or Slack** (the lead session does every TestRail
write). Never print, copy or commit anything from `/tmp/testrail/` (credentials). Do not run git commands; the lead session commits.

Working directory: `/home/user/Manual-test-Cases`. Pass folder: `V = build/wo-board-tech-view/v61-pass-2026-10-16`.

## What the QA lead ordered
Verbatim: "Go AHead but do not update the test cases which have been updated in last 3 hours." The order is a full pass (every case
rewritten in full to the current standard and to the current source; no delta mode). The 12 cases updated in the last 3 hours are
already left out of your batch; the checker refuses them. Cases created by anyone other than us (Vladimir) are not in any batch and
are never touched.

## Read first, in full (nothing is skipped, however large)
1. `V/PRD-CHANGES-v54-to-v61.md` (every changed line, v54 → v61, verbatim).
2. `V/CONFLUENCE-845185030-v61-2026-10-16.md`, the whole PRD version 61 (95 KB; read it in chunks, all of it). It is the source of
   every expected result.
3. `build/skills/IDEAL-TEST-CASE-STANDARD.md` (the case standard) and `build/LESSONS-REGISTER.md`.
4. Each case of your batch: `V/cases-text/C<id>.txt` (live text, 16 Oct snapshot, with its run status and existing setup doc).
5. Worked examples of the target shape: `build/wo-board-tech-view/answers-2026-10-15/apply/proposals-answers.json` (43 cases
   converted on 15 Oct; compare a few with their old text in `.../apply/snapshots-before/all-cases.json`) and
   `build/wo-board-tech-view/answers-2026-10-15/sv11416-2026-10-16/part_sv11416.py` (a case built from scratch).
6. Helpers: `V/common_v61.py` (read it; use its functions and constants). Shared doc wording: `build/wo-board-tech-view/answers-2026-10-15/apply/docparts.py`.
Where a case's text depends on design wording, the design export is `build/wo-board-tech-view/sources/design-2026-10-14-upload/`
and design pictures are in `build/wo-board-tech-view/design-look-2026-10-14/compare/`. Tech plan: `build/wo-board-tech-view/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md`.
QA handoff (for quotes labelled "QA handoff …"): `build/wo-board-tech-view/sources/dev-regression-2026-10-08/QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md`.

## The target shape of every case (TestRail fields; the checker enforces most of it)
- **Title**: at most 80 characters, the screen's own words, one check, no semicolons, no requirement codes or spec shorthand
  (the checker rejects words like route, endpoint, payload, parity, anchor). Keep the existing title when it already meets this.
- **Preconditions** (list of plain sentences; the link line is added by the script): who is signed in (role, permissions), the
  location {Location-A}, then every record with its state, each named inside its sentence with a placeholder and an example:
  "Approved work order {Work-order-1} (for example S10043-17901) for {Customer-A} is led by {Technician-A}." Placeholders: name,
  hyphen, letter ({Technician-A}, {Customer-B}, {User-B}); work orders and lines are numbered ({Work-order-1}, {Line-2}). Convert old
  [WO-1] → {Work-order-1}, [Tech-A] → {Technician-A}, [User-A] → {User-A}, a number 1 → A, 2 → B. Every example value is written
  "(for example …)", never as if it already exists. No "Needs:" line, no browser count, no duration, no Setup block, no build line,
  no bare label at the start ("Data:", "User:"). A name the expected results rely on (for example a sort order by name) is still a
  placeholder, and the sentence says what the name must be like ("{Technician-B}'s first name sorts after {Technician-A}'s").
  Developer notes (file names, test ids) never go in the Preconditions; put them in Part 2 of the setup doc.
- **Steps**: numbered, one simple action per line, in the build's labels ("Click Tech View in the display switcher."), actions
  only, no expectations. A "don't" the test depends on gets its own step.
- **Expected results**: each line starts "Step N:" (or "Steps N and M:"), says what the tester SEES, in plain words, no requirement
  codes, no jargon. One result per quote where possible; the quote wins if they could disagree.
- **Source**: sentence 1 documents only (use `src(...)` for a rebuilt line, or `v61_source(old)` to move an existing Rule 117 line
  to version 61). Keep the case's own "Last checked against build … on …" sentence (in the source line or in `checked`); when the
  expected results change in this pass, restate it with `mark_changed(...)` or `checked_line(old, True)`.
- **Divergence** (optional, Rule 56): only where the case follows a later decision that differs from an earlier source; say which,
  where, and that the latest prevails.
- **Exact quotes**: every quote verbatim from its source: PRD v61 via `q("S2-R11a")` or `prd_line("Deactivating a technician")`;
  tech plan quotes labelled "Tech plan …"; Jira "SV-…"; QA handoff "QA handoff …"; design "Design — …" (verbatim from the design
  package, or labelled "(element as the design names it)"). Never paraphrase, tidy or merge a quote. A quote from an older PRD version
  that v61 changed is replaced by the v61 text; if the meaning changed, the expected results change too (`expected_changed: true`).
  If no sentence in any source backs a result, drop the result or hold the case (below); never invent one.
- **Marker**: the last line, exactly one of `AUTOMATION: READY`, `AUTOMATION: READY - EXPECT FAIL (SV-xxxxx)` (only while an OPEN
  ticket describes that failure; then add `expect_fail` paragraphs with the symptom and the three outcomes, see part_sv11416.py),
  or `AUTOMATION: HOLD - <short plain reason>`. Keep the case's existing marker unless this pass gives a reason to change it; say why
  in `change_summary` if you change it.
- **Setup doc** (Google Doc, public folder): `doc_part1` = numbered manual steps that create every precondition, using the shared
  wording (SIGNIN, LOCATION, WIDTH, tech(), customer(), wo(), CLEAR_DOC), ending with "Check the setup worked: …". `doc_part2` = notes
  for a Claude session (goal, facts, faster routes, developer notes, evidence; PART2_EVIDENCE is added for you). A Rule 117 case whose
  preconditions and setup do not change may keep its doc: `reuse_doc=<existing doc URL from the case text>`.
- `expected_changed`: true when what the tester must see or do to pass now differs in meaning from the live case (a v55–v61 change,
  or a correction to the current source); false for a rewrite into the new shape with the same meaning, a quote refresh with the same
  meaning, or a source-line bump.
- `change_summary`: one or two plain sentences: what changed and why (name the PRD rule and version).

## Facts you may rely on (recorded, observed)
- Staging keeps one name per technician: renaming the staff record or the account renames both.
- Staging has no Technician filter yet (SV-11326 open).
- The profile menu (click your initials) offers Light and Dark.
- Deleting a staff member who has recorded labor is refused with "Staff is being used elsewhere."; a technician who only leads a work
  order can be deleted.
- A filter list may close the moment one option is ticked (SV-8824).
- Vladimir's newer cases already cover Collapse all / Expand all (C614712) and Back with scroll in Tech and Board View (C236983,
  C236982). Do not duplicate them, and do not edit them.

## When a source is unclear
Never settle it from the build. Leave the case out of `updates` and put it in a top-level `"hold"` list in your proposals file:
`{"case_id": …, "why": "…", "po_question": "plain question for the product owner"}`. Also hold a case you cannot make runnable by a
manual tester with the product UI alone (say why).

## How to do the batch
1. Write `V/batches/batch_<BATCH>.py`. Build one proposal per case with `mk(...)` (or start from `base(cid)` for a Rule 117 case),
   and end with `write("<BATCH>", updates, new=[])` plus any `"hold"` list (write it into the same JSON file). Run it with
   `python3 V/batches/batch_<BATCH>.py` from the repository root.
2. Check: `python3 V/apply_answers.py --config V/config.json --only V/proposals/proposals-<BATCH>.json`. Fix every PROBLEM until
   it prints none (exit 0). The check proves each quote is verbatim, every placeholder is defined, results start with "Step", the
   marker is a valid literal, and more.
3. Docs: `python3 V/apply_answers.py --config V/config.json --only V/proposals/proposals-<BATCH>.json --docs` writes
   `V/docs/C<id>.html` for each case without `reuse_doc`. For each such file: load the Drive tools with ToolSearch
   ("select:mcp__Google_Drive__create_file,mcp__Google_Drive__search_files"), then create the doc with `create_file`:
   title `Setup (manual QA tester and Claude session) - C<id> <case title>`, parentId `1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e`,
   contentMimeType `text/html`, textContent = the file's full content. Right after each create, append
   `{"id": "C<id>", "doc": "<file id>"}` as one line to `V/doc-ids-<BATCH>.jsonl`. If a call fails (for example "Resource has been
   exhausted"), first search the folder for that exact title (`title = '…' and parentId = '1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e'`)
   before retrying, so no doc is made twice; wait a little between retries.
4. Report back in plain text: number of updates, which have `expected_changed: true` (with the one-line reason each), holds with
   their questions, Automated cases (marked "Automated: True" in the case text) whose expected results changed, docs created (count)
   and reused, and anything you could not do. Do not paste case bodies into the report.

## Token-discipline charter (verbatim, applies to you)
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
