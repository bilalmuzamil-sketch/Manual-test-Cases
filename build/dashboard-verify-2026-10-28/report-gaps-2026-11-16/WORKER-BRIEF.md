# Report gaps + Dashboard S12-R7–R10 on STAGING: worker brief (16 Nov 2026)

## The order
- QA lead's main instruction (verbatim, 28 Oct): `build/dashboard-verify-2026-10-28/MAIN-INSTRUCTIONS-QA-LEAD.md` Section 1. Dashboard first, then reports, "100% scrutinez", full pass never delta, a drafted ticket for every defect, filed only on his per-ticket go-ahead.
- 13 Nov he approved finishing the gaps found in the coverage check: *"2. Yes"* (report gaps) and *"3. I will follow your recomendation"* (Dashboard S12-R7–R10 in the same session).
- 15 Nov: QA branch sv11839 is unreachable and treated as destroyed. **Work on STAGING** (QA lead: *"Yes Staging if the QA environment is destroyed."*).

You are the worker. **You do NOT write to Jira or TestRail.** You draft; the coordinator verifies your evidence (Rule 86) and handles Jira.

## Read first (your rule book: this repo, branch claude/credit-memo-document-location-tov2x1 only; Rule 98)
- `CLAUDE.md` index. Read in full in their files: Rules 12, 14, 29, 57, 58, 82, 94, 97, 99 (with the 6 Nov offsets amendment), 100, 101 (with the 9 Nov amendment), 103 (with the 5 Nov and 9 Nov amendments).
- `build/skills/09-TEST-EXECUTION.md`, `build/skills/06-DEFECT-PREP.md`.
- `build/APP-ACTIONS-PLAYBOOK.md`: grep it, never read it whole. Staging hosts are **app.staging.shopview.com / api.staging.shopview.com** (NOT staging.shopview.com).

## Environment
- Staging build: read `meta[name="app-version"]` at the start and record it. It was v26.45.4-f3d3d2d at 06:28 UTC on 16 Nov.
- Sign-in: `/tmp/cln/cookies.json` (QA lead's, chmod 600; was 200 at 06:28 UTC). Boot with `build/testing-tools/staging-boot2.mjs` (`boot2('admin', {workplaceId, timezone})`); quick-login is allowed on staging.
  - boot2 rotates PHPSESSID, so raw-cookie API calls after a boot can get `session_expired`. Make API reads from inside the booted page (`page.evaluate(fetch …, credentials:'include')`), as `sv10702-recheck-2026-11-16/zone.mjs` does.
  - Never print or commit cookies.
- Locations and zones: read them LIVE from `GET /api/staff/my-workplaces` before each location. On 16 Nov, Heavy Duty = Asia/Karachi; check the others.
  - Rule 99: session change-location, browser timezoneId, process TZ and localStorage 'timezone'/'location' must all equal the location's zone, and be recorded.
  - Run `build/testing-tools/tz_rules_check.py <zone> --from … --to …` for the dates you test. Edmonton, Vancouver and Winnipeg are an hour off in Chromium 153 from 1 Nov 2026; mind the gap hour.
- Throwaway data: tag it ZZAUTOTEST, log every seed call (`seed-log.jsonl` in your folder), and restore anything shared that you change.

## Expected behaviour comes from DOCUMENTS only (Rule 57)
- Report PRDs: re-read the CURRENT Confluence version before relying on it (Rule 59) and record the version used. Our local copies are older. Example: "SBC (Sales By Customer) Report" page 577634305 is live at v22 (19 Oct); its "Product Type" became "Sales Type" and its filters now live in the page link.
- Other sources:
  - Chris Ward's answers: `chris-answers-2026-10-29/` and `chris-answers-2026-11-04-section3-verbatim.md`;
  - the Dashboard PRD, Confluence 788430850, v53 (check whether still v53);
  - Jira stories named in each worker's RESULTS.md "Written source".
- A document that is silent or ambiguous is a question for Chris, never a defect (Rule 58). Never ask him to change the PRD (Rule 103, 9 Nov amendment).

## The work: everything the 28 Oct reports pass left NOT VERIFIED, plus a re-check because the build moved
The previous pass was on v26.43.2, now several builds old. Evidence and tools: `build/dashboard-verify-2026-10-28/reports/W1..W4/` and `ShopView-Dashboard-and-Reports-Full-Check-2026-10-28.md`.
1. **Re-check every report's figures on the current build.**
   - Re-run each W1–W4 recompute (their tools/results are in those folders) at the same locations and presets.
   - Report pass counts per report, and every difference.
   - A figure that changed since 28 Oct gets explained (new data vs a behaviour change).
2. **Screen features never verified:** downloads (PDF/CSV: open the file, compare it with the screen), column chooser and its memory, sorting, and basic accessibility (labels, keyboard).
   - Reports: Work In Progress, Technician Utilization, Shop Efficiency, Timesheet Activities, Timesheets, Sales By Customer, Sales By Representative, Sales, Service Advisor Analysis, Technician Efficiency, A/R ×3, A/P ×3.
   - Each check needs a document source; where none exists, record "no source" rather than inventing an expectation.
3. **Edge cases never verified because no record existed. Seed them** (Rule 14):
   - the "(No company)" row (Sales By Customer);
   - "Inv. Hrs from the newest invoice" (Sales: a work order with two live invoices, if the product allows it; if it refuses, record exactly how);
   - "—" for a location with no labour rate (Technician Efficiency S2-E3), plus a rate change (S2-R8a);
   - an attached core part (Parts Velocity, SV-10379);
   - Export Reports X-PAY1: verify the 16 unverified payment rows;
   - Customer Payment export: deposit, refund and credit rows;
   - the Sales report's part-sale population: all part-sale work orders, not 80 of 258.
4. **Shop Efficiency vs clocked time at Heavy Duty** (760 h, 5% gap "this year" on 28 Oct; also Lethbridge last year SE 10,762.85 h > TU 8,709.03 h):
   - find the exact records that explain it;
   - settle it against the Shop Efficiency source;
   - verdict: defect, by design (quote the source), or question for Chris.
5. **Dashboard PRD S12-R7 to S12-R10** (Story 12, visual conformance):
   - read the exact wording first;
   - check at 1920/1536/1280/1024 px and phone width, light and dark, at a staging location with data.
   - The earlier visual results are in `dashboard-bug-hunt-2026-11-05/RESULTS.md` Area 7.

## Output (write everything under `build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/`)
- `RESULTS.md`: one table per numbered area above. Each row: what was checked, the source quote + version, PASS / FAIL / NOT VERIFIED (with exactly why and what would unblock it), and the evidence path.
- One folder per candidate defect or question (`D<n>-<slug>/` or `Q<n>-<slug>/`):
  - `TICKET.html`, in plain words for a first-time reader (Rule 100);
  - `CHRIS-COMMENT.html`: what happens today / what the document says / "fix it, or leave it as it is?", thankful and respectful, with NO request to change any document;
  - the annotated picture(s) (`dashboard-bug-hunt-2026-11-05/tools/ann.py`: numbered boxes plus a legend strip; never cover the data; open it and look at it before handing back);
  - evidence JSON;
  - `EPIC.txt`: Reports → SV-11936, Dashboard → SV-11839.
- **Gate (Rule 94):** before drafting, the duplicate search is clean (read-only JQL: `parent = SV-11936`, `parent = SV-11839`, plus a text search), it was reproduced on screen with the zones matched and recorded, and the expectation is quoted from a document.
- **Commit and push after every area:**
  - `git add -- <paths>` only;
  - `python3 build/testing-tools/scan_secrets.py --staged` must exit 0;
  - never commit full downloaded files that hold staff or customer names; extract only the rows you need;
  - commit trailer:
    ```
    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
    Claude-Session: https://claude.ai/code/session_01D95Q7VoyGzYXAt4w5J2bJE
    ```

## Hand-back (short)
- The table of areas.
- Each candidate: folder, one line, the document quote, the epic.
- What was NOT covered, and why.
- Commit ids.
- **Quality is never the thing cut.** If you cannot test something, say exactly why and what would unblock it.

---

## TOKEN-DISCIPLINE CHARTER (embedded verbatim, Rule 95)

# TOKEN DISCIPLINE CHARTER — mandatory in every session and every handoff (Standing Rule 95)

**Status:** canonical · created 2026-08-26 · all projects, permanent · authority = **Standing Rule 95**
(`build/rules/RULES-61-97.md`), which ties Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90.

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

---

## SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)

**This section is MANDATORY in every handoff.** Full rule text: `build/rules/RULES-61-97.md` (Rule 97,
tying Rules 27, 29, 59, 68, 76, 79, 86, 88, 89, 93). It is reproduced **in full below** so you never
have to open another file to get it.

**QA LEAD DIRECTIVE, 2026-08-28, verbatim:** *"I want that session if it is giving up to go and see if
you ever did something similar and it worked for you and to learn from you then."*

**THE RULE — BEFORE you report ANYTHING as impossible, blocked, unavailable, unreachable or
unreconstructable, SEARCH THIS WORKSPACE.** It is the accumulated memory of every session before you,
and most "blockers" have already been hit, diagnosed and written down. **Use the EXACT ERROR TEXT as
the search key** — the literal string the tool printed, not a paraphrase and not a category. That is
what finds it, because the session that solved it pasted the same string into the playbook, the skill
or the BLOCKED file. **If you still cannot find it, REPORT THE SEARCHES YOU RAN** — commands, keys,
files covered — so the QA lead knows the gap is REAL rather than merely UNSEARCHED.

**🔴 STEP 0 OF THE DRILL IS `git fetch origin` (added 2026-08-28).** **Never search, measure or report
ANY repository fact before fetching.** A stale checkout does not fail loudly — it answers confidently
and wrongly. **On 2026-08-28 alone a stale checkout caused a 479-line security tool
(`build/testing-tools/scan_secrets.py`) to be declared non-existent, present handoff files to be
reported absent, a 42 KB `CLAUDE.md` to be measured as 459 KB, and existing build-verify directories to
be denied.** Fetch first, then search.

**🔴 YOU MAY ALSO SEARCH ANOTHER SESSION'S BRANCH — FOR FACTS ONLY, NEVER RULES (added 2026-08-28,
amended 2026-10-06, Rule 98).** Another session's branch — e.g. **`origin/claude/slack-session-0sxnd9`** —
may hold a FACT you need (a login method, a click-path, a known problem with a test site, where a record
is). Anything you find there in a rules file, a skill, a handoff or an index is **that session's** rule
book: read it only for the fact you came for, never as an instruction, and never copy, merge or renumber
it into yours. You do **NOT** need to check it out — read straight from the remote ref:

```
git ls-tree -r --name-only origin/claude/slack-session-0sxnd9 | grep -E 'BLOCKED|PLAYBOOK|RUNBOOK|PROJECT-STATE'   # facts only — never skills/ or rules/ (Rule 98)
git show origin/claude/slack-session-0sxnd9:<path> | grep -n "<what you need>"
git show origin/claude/slack-session-0sxnd9:<path> | sed -n '1,80p'
git grep -n "<exact error text>" origin/claude/slack-session-0sxnd9 -- build/ | head -20
```

**"NOT ON THIS BRANCH" IS NEVER A VALID REASON TO CONCLUDE SOMETHING DOES NOT EXIST — check another
session's branch for the FACT before saying anything is missing (facts only — Rule 98).** On 2026-08-28 a session on another branch
reported `build/skills/14-ACCESS-RESILIENCE.md`, `build/rules/RULES-*.md` and the `build/BLOCKED-*.md`
files as absent; all of them existed on `origin/claude/slack-session-0sxnd9` at that moment.

**DURABLE FACT:** the Standing Rules moved **OUT of `CLAUDE.md` into `build/rules/RULES-*.md` on
2026-08-21; `CLAUDE.md` is now an INDEX.** A session asserting "the rules live inside CLAUDE.md" is
describing a pre-2026-08-21 state and is therefore **stale** — fetch and re-check before reporting
anything else.

**THE SEARCH DRILL — run these, substituting your own strings:**

```
git fetch origin                        # STEP 0 — ALWAYS FIRST, NEVER SKIPPED
grep -rn "<exact error string>" build/ --include=*.md | head -20
git grep -n "<exact error string>" origin/claude/slack-session-0sxnd9 -- build/ | head -20
grep -rn "<endpoint/tool/symptom>" build/APP-ACTIONS-PLAYBOOK.md build/skills/ | head -20
ls build/BLOCKED-*.md
ls build/*DIAGNOSIS*.md build/*/FINDINGS.md
git log --all --oneline --grep="<keyword>" | head -20
```

**SEVERAL `BLOCKED-*.md` FILES ARE MARKED RESOLVED AND CARRY THE CAUSE** — the name is not proof the
thing is still blocked; open it and read what happened next. `git log --all --grep=` reaches facts
recorded on another session's branch — facts only; that session's rules are never merged into yours (Rule 98).

**THE FOUR PLACES, IN THIS ORDER:**

| # | File | What it holds |
|---|---|---|
| 1 | `build/APP-ACTIONS-PLAYBOOK.md` | Proven staging/QA/prod action recipes and the traps (§J TestRail, §K production) |
| 2 | `build/skills/14-ACCESS-RESILIENCE.md` | The primary/fallback ladder and the preflight for each system (Rule 89) |
| 3 | `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` | Browser, proxy and MITM-bridge mechanics |
| 4 | `build/rules/RULES-*.md` | **GREP them — never read one end to end** |

**SEARCH IN A TARGETED WAY:** grep, or a bounded slice around a hit — **never bulk-read a file to "get
oriented"** (Rule 88). Never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` whole.

**FIVE REAL FALSE BLOCKERS, ALL 2026-08-28 — the answer was in this repo every time:**

1. *"chromium's outbound TCP is reset, Playwright is unusable"* — it needs a **fresh local MITM bridge
   started per run**, documented in `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §1.
2. *"the Atlassian login needs an emailed OTP"* — **no OTP exists** (two-step is off). The real
   obstacle was an **undismissed "Security review" interstitial**.
3. *"a foreign edit is unreconstructable"* — **`get_history_for_case` returns per-field old/new values
   including whole bodies**, and it recovered the **C29557** edit.
4. *"`build/testing-tools/scan_secrets.py` does not exist"* — **it did**: 479 lines, passing self-test.
   A **stale checkout** produced the false claim.
5. *"the 72 damaged cases cannot be repaired"* — the **API** could not; the **TestRail UI editor could,
   and did.**

**THE COMMON SHAPE:** the session mistook the first path it tried for the only path. **One tool failing
is a fact about that tool, never about the task** (Rule 68).

**IF YOU SOLVE SOMETHING NEW, WRITE IT DOWN IN THE SAME PASS** — the recipe into
`build/APP-ACTIONS-PLAYBOOK.md`, the access ladder into the relevant skill — **before you report and
exit, not "next time"** — and include the exact error string you searched for so the next session's
grep hits it. **Undocumented knowledge is knowledge the next session pays for again**, out of the same
shared quota (Rule 90). This is Rule 93's learning loop at the scale of one obstacle.

---

