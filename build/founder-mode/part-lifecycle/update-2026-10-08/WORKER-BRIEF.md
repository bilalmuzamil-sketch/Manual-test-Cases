# Part Lifecycle — full rewrite brief (8 October 2026)

**The QA lead's orders:**
- 8 Oct: the go-ahead "Full update, write when ready".
- *"never do anything in DELTA mode"* (Rule 122).
- *"Can a tester or a fresh Claude session prepare the required state, execute the test and determine pass/fail using this case alone?"*

**Every case in your share is rewritten IN FULL**, and **every PRD requirement in your share gets a case.**
**You write ONE proposals JSON file only.** Never call TestRail write endpoints, never run git, never sign into any ShopView build.

## Sources — read every one in full (Rule 119) and state your reading coverage at the end
| Source | Path |
|---|---|
| **PRD v26** (THE authority; Expected comes from here), Confluence 829227015, "Ready for dev", fetched 8 Oct 2026 about 13:25 UTC | `build/founder-mode/part-lifecycle/sources/CONFLUENCE-829227015-PartLifecycle-v26-2026-10-08.md` (737 lines). Anchor map, verbatim and with bold removed: `update-2026-10-08/anchor-quotes-v26.json`. §8 User Feedback Summary rows: `update-2026-10-08/feedback-table-v26.json` |
| PRD comments: Product decisions 7–8 Oct, all folded into v26 | `sources/confluence-comments-2026-10-08.md` (summary). The full bodies are in the session; Product's answers are in the PRD text |
| Jira stories SV-10814 … SV-10826, plus SV-10380 (bug, ships with this epic) | `sources/jira-2026-10-08/STORIES-2026-10-08.md`. ⚠️ Some story texts are OLDER than PRD v26 (S9-R10 per-part warning, S9-N3 "returns nothing", S12-R11 "used by inventory parts", S13-N1 "answers to", S8-R15 role list, S4-R3 tooltip without the Inventory Value sentence). **The PRD wins**; list each difference in `notes` |
| Tech plan, 7 Oct 2026 (informs, never overrules — Rule 30) | `sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md` |
| Design canvas, 46 boards + 5 "Before" boards (on-screen labels, navigation and design-only details ONLY — Rule 57) | Transcript of every board: `sources/design-2026-10-08-artifact/BOARDS-TRANSCRIPT-2026-10-08.md`. Images: `sources/design-2026-10-08-artifact/png/<board>.png` (open any you cite). Designer notes per board: `sources/design-2026-10-08-artifact/files/canvas.json` → "annotations". Before-board text: `files/*Before.dc.html`. ⚠️ Board 5.1's tooltip lacks the PRD's Inventory Value sentence, and board 6.5's canned-job warning ("GREASETUBE is inactive and was not added.") is the OLD wording. **The PRD wins** |
| Your cases as they are live now | `build/founder-mode/part-lifecycle/snapshots-2026-10-08/live-cases.json` (all 62; take yours by `section_id`) |
| Proven app navigation (facts only) | `build/APP-ACTIONS-PLAYBOOK.md`: grep it, never read it whole. Known facts: Parts → Inventory `/parts/inventory`; the "New Inventory Part" button; a row click opens the part; the clock icon (tooltip "Part History") opens Part History; Settings → Roles & Permissions ("Create custom role"); Settings → Staff; Settings → Locations; Settings → Data Import → Inventory; the location switcher is in the top bar |
| The locked case standard | `build/skills/IDEAL-TEST-CASE-STANDARD.md` (whole file), and Rules 113, 114, 116, 117 and 119–124 in `build/rules/RULES-61-96.md` from line 2391 to the end |

## The case standard — every case, no exceptions
1. **Title** — at most 80 characters, ONE check, no semicolon, the screen's own words.
   No requirement codes, no "S7-N5", no "normalized", "parity", "route", "endpoint", "payload", "atom".
2. **Preconditions** — a list. The first item is the **Needs line**, e.g. `Needs: 1 user (Admin) · 1 browser · about 10 minutes`. Then the required starting state only:
   - the build: "the Part Lifecycle QA build (no build exists yet; use the build named in the test run)";
   - user role and permissions (Settings → Roles & Permissions labels: 'Part Library & Inventory → View / Create & Edit / Delete');
   - location; settings that matter;
   - EXACT data and relationships (count, status, tracked or untracked, active or inactive, which location stocks what, bins and quantities, Min/Max);
   - which names are examples and which values must hold.
   No instructions here.
3. **Setup** — a numbered list that creates that state:
   - real click-paths, the fields to fill, values and the save button;
   - every value the case relies on recorded ONCE as a placeholder in square brackets, e.g. `[Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BULK-01)`, `[Loc-2]`, `[User-B]`, `[PO-1] = the purchase order number shown`;
   - **own data per case**: every part, customer, canned job and role this case uses carries a ZZAUTOTEST name that belongs to THIS case only (e.g. `ZZAUTOTEST-PL-<SHORT-BEHAVIOUR>-01`), so cases can run in any order and in parallel. Never reuse another case's data, and never use a real or production record as an example;
   - a second location, second user or custom role, if needed, is created by the tester (Settings → Locations, Settings → Staff, Settings → Roles & Permissions → Create custom role). Never "ask the QA lead";
   - the LAST setup item is always `Check the setup worked: …` (what to look at, and what to fix if it does not match).
4. **Steps** — numbered, ONE UI action per line, the exact control and value, using placeholders.
   - Only the behaviour under test; no setup actions.
   - A step is an action, never "verify/confirm/check that".
5. **Expected results** — runnable observations, what the tester SEES, one per item.
   - **Every item starts with the step it belongs to**: `Step 3: …` or `Steps 2 and 5: …`.
   - Arithmetic is written out wherever a number is checked (Rule 116).
   - Message texts are given exactly as the PRD gives them, with the placeholder filled, e.g. `"[Part-A] already exists at this location."`.
6. **Source** (one paragraph): `Epic SV-10647; story <SV-key> (Story <n>, <name>); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), <anchors>, read 8 Oct 2026; design canvas board <n.n> (<title>). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).`
   Add a tech-plan section or a Product comment (author and date) where you used it.
7. **Exact quotes** — `[anchor, text]` pairs:
   - each PRD anchor's text copied PROGRAMMATICALLY from `anchor-quotes-v26.json` (never retyped);
   - a §8 table row: anchor `PRD §8 User Feedback Summary (<trigger>)`, text = the Message cell or the Behavior cell, copied programmatically;
   - a tech-plan quote: anchor starting `Tech plan`, text copied verbatim from the tech-plan file;
   - a SV-10380 quote: anchor `SV-10380 acceptance criteria`.
   Quotes pair with results; the quote wins.
8. **Marker** (the last line): exactly `AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified`.
9. **Cannot be checked by hand:** "by any route", the system refusing a request made outside the screen, server errors, a request with no parts, a note over 255 characters reaching the system. Rule 114 says either:
   - express it as something a human can really do (two browser tabs: tick in one, change the part in the other; a second user without the permission; the parts CSV import; Settings → Data Import); or
   - mark that part plainly in the plain result: "this part cannot be checked by hand; write 'not checked by hand' in the result comment".
   Where a WHOLE case is not checkable by hand, still write it, and say so in `notes` so the QA lead can decide.
   Never leave an instruction a manual tester cannot carry out (no API, DevTools, database or curl).
10. **Design vs spec:**
    - The design gives the labels you click.
    - Expected follows the PRD.
    - Every design-vs-PRD and story-vs-PRD difference goes in `notes`, one line each, with board or story and both texts.
    - A design-only testable detail that does not contradict the PRD may be ADDED, cited as "design canvas board n.n".
11. **Coverage:** every anchor in your share is quoted by at least one case. List any you could not place, and why, in `notes`.
    - A case whose whole basis left the PRD → `"retire": [{"case_id":…, "why":…}]`.
    - Otherwise rewrite the existing case: keep its C-id where its behaviour is still in the PRD, and split extra behaviours into new cases.
    - Removed anchors: S2-R18, S5-E2, S5-E3, S5-E3a, S5-E4, S5-E4a, S5-E5, S5-E6, S5-E7, S5-E8, S5-E9, S9-N4.
12. **Final check, on every case:** *"Can a tester or a fresh Claude session prepare the required state, execute the test and determine pass/fail using this case alone?"*

## Output — ONE JSON file (the path is given in your task), exactly this shape
```json
{"updates":[{"case_id":154752,"title":"...","preconditions":["Needs: ...","..."],"setup":["...","Check the setup worked: ..."],
  "steps":["..."],"results":["Step 2: ..."],"source":"...","quotes":[["S1-R1","<verbatim>"]],
  "marker":"AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified","change_summary":"one line"}],
 "new":[{"key":"A-01","section_id":20468,"title":"...","preconditions":[],"setup":[],"steps":[],"results":[],"source":"",
  "quotes":[],"marker":"","why":"which anchors it covers"}],
 "retire":[{"case_id":0,"why":"..."}],
 "notes":["..."],
 "anchors_covered":{"S1-R1":[154752,"A-01"]},
 "reading_coverage":"file — size — lines read — 100%"}
```
- Plain text only in every string (no HTML). Each list item is one line; a sub-item starts with "↳ ".
- Build the JSON with a Python script that loads the quotes from the anchor files, so nothing is retyped.
- Validate it before you finish:
  - every quote is verbatim;
  - titles are 80 characters or fewer, with no ";";
  - every result starts with "Step";
  - preconditions[0] starts with "Needs:";
  - the last setup item starts with "Check the setup worked";
  - every anchor in your share is covered.
- Then report the counts.

Section ids — the Part Lifecycle folder is 20439:

| Story | Section |
|---|---|
| S1 | 20468 |
| S2 | 20469 |
| S3 | 20470 |
| S4 | 20471 |
| S5 | 20472 |
| S6 | 20473 |
| S7 | 20474 |
| S8 | 20475 |
| S9 | 20476 |
| S10 | 20477 |
| S11 | 20478 |
| S12 | 20479 |
| S13 | 20480 |

For SV-10380 cases, use `"section_id": "NEW:Inventory Value net quantity (SV-10380)"`.

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
