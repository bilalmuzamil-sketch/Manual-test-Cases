# For the build verification session: verifying cases in the two-audience layout (8 Oct 2026)

**From the QA lead (8 Oct 2026):**
- The authoring session creates the test cases. You build-verify them.
- That covers **everything, starting from the Setup file attached to the case**, then the Preconditions, the Setup, the Steps and the Expected results.
- **Everything from Expected results downwards is handled exactly the way you already handle it.**

The layout is permanent: Rule 117, third amendment of 8 Oct, in `build/rules/RULES-61-96.md`; the standard is `build/skills/IDEAL-TEST-CASE-STANDARD.md`.

## What a case looks like now (Rule 117, fourth amendment of 8 Oct — PERMANENT)
| Part | What it holds |
|---|---|
| Top of the Preconditions field: link **"Setup (manual QA tester and Claude session)"** | the case's public Google Doc, in the Drive folder "Setup for Claude session (test case setup docs)". **Part 1 "Setup for manual QA tester"** is short click-by-click steps in the build's labels, ending with "Check the setup worked". **Part 2 "Setup for Claude session"** is everything a Claude session needs (environment, access, ids, recipes with browser fallbacks, the check, how to run and observe, evidence, cleanup, traps), with unproven points marked UNVERIFIED. No secrets, ever. |
| After a line break: **Preconditions** | clearly and completely, what must be true before step 1: user and role, location, every record with its state, as **{brace} placeholders** ({Location}, {Part}, {Line}). Every illustrative value is marked **"(for example …)"** (Rule 117, fifth amendment). No Needs line, browser count or duration. |
| (no Setup block in TestRail) | the Setup lives only in the doc |
| **Steps** | actions only, one per line |
| **Expected results** and below | every line starts "Step N:". Source, exact quotes, build stamp and AUTOMATION marker are as today. |

## What to verify, in this order (every case, in full: Rule 122, never a delta)
1. **Doc Part 2 (Claude session). Run it as a fresh session would**, following only what the doc says.
   - Check every address, the access route, every id, every recipe and call, the check, the way to observe the steps, the evidence list and the cleanup.
   - Resolve every UNVERIFIED point, and add any trap you hit.
   - The test of Part 2: *"Could a new Claude session, with only this doc and the case, prepare the state and run the test without rediscovering anything?"*
2. **Doc Part 1 (manual QA tester).** Carry it out by hand in the UI, exactly as written, as a manual tester would.
   - It must reach the same state as Part 2, in the build's own labels.
   - Its final "Check the setup worked" must really detect a broken setup.
3. **Correcting the doc:** correct it in place, so the link stays the same. If this session has no Google Docs editor connector, never create a second doc. Instead:
   - write the corrected text to `build/<project>/setup-doc-corrections/C<id>.md`;
   - list it in your report.
   - Never write a cookie, password, token or OTP into a doc: it is public.
4. **Preconditions:**
   - Every item is true after the setup, and is needed by the test.
   - Nothing needed is missing: a tester reading only the Preconditions knows exactly what must exist.
   - Labels are the build's own.
   - No example value is written as if it already exists in the app.
5. **Steps:**
   - Perform them. Each is one action in the build's labels.
   - There are no checks in Steps.
6. **Expected results and everything below. Handle these exactly as you do today:**
   - pass/fail on what you see;
   - Rules 57 and 113: the quote is never changed, and a build that differs is a deviation;
   - the build stamp;
   - the AUTOMATION marker;
   - Blocked vs Failed.
   One addition: check that each "Step N:" points at the right step.

## Rules that still apply
- **One writer per case set, plus the edit lock (L17).** Re-read a case immediately before you write. Refuse if it changed since you read it.
- **Ask before changing a case created by someone else (Rule 123).** Never touch Vladimir Tomovic's cases.
- **Run sync is union only, with `get_tests` paged (L16).**
- **Secrets stay in `/tmp`** (`chmod 600`); run the secret scan before every commit.

## First case to verify — the worked example
- [C425784](https://shopview.testrail.io/index.php?/cases/view/425784) "Approving a line moves its Quoted inventory part to In stock" is the regression case for [SV-4802](https://shopview.atlassian.net/browse/SV-4802).
  - Section 54276 "ZZ - Layout samples (to be retired)". It is not in any run.
  - Its doc: [Setup (manual QA tester and Claude session) v2 - C425784](https://docs.google.com/document/d/1IKNq5uHgWp7oSRWEJrI678wZ89_FewPRWtmATFqYHDM/edit).
- **UNVERIFIED points for you to settle:**
  - the shape of "bins" when creating an inventory part through the API;
  - whether the part status shows on the Lines tab, the Parts tab, or both.
- **The bug was a screen-refresh bug.** The pass/fail must come from the screen without a reload, never from an API read.
- The case will be retired after the QA lead's review. Verify it as the trial of this layout, and report what the doc got right and wrong.
- The earlier example, C425783, was deleted on 8 Oct; ignore any mention of it.

## Report back (per case)
Give a table with these columns:
- C-id + link;
- doc verified (yes / corrected / corrections filed);
- UNVERIFIED points resolved;
- Preconditions OK;
- Setup runnable by hand;
- Steps OK;
- result;
- what needs to be done.

End with "OUTSTANDING — what I need from you".

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
