# A/R + A/P figure checks on the rebuilt reports, plus the Dashboard Technician Efficiency tile re-check — STAGING worker brief (16 Nov 2026)

## The order
- Main instruction (verbatim, 28 Oct): `build/dashboard-verify-2026-10-28/MAIN-INSTRUCTIONS-QA-LEAD.md` — Dashboard and reports "100% scrutinez", full pass never delta, a drafted ticket for every defect, filed only on the QA lead's per-ticket go-ahead.
- 16 Nov the QA lead approved (verbatim "5. OK 6. OK") two items from the report-gaps hand-back (`build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/RESULTS.md`, "Decisions for the QA lead" 5 and 6):
  - **5.** Rebuild the A/R and A/P figure checks against the rebuilt reports and their new PRD (Confluence **947650561**, 13 Nov 2026). The 28 Oct tools no longer work: the old endpoints answer 404.
  - **6.** Re-check the **Dashboard Technician Efficiency tile** before the 28 Oct finding F2 (Technician Efficiency listed declined lines; held with DQ-1) is raised again. The Technician Efficiency REPORT no longer lists declined lines (84,880 lines, 0 declined, 16 Nov). Does the tile still match the report?
- Piggy-back (Rule 78): the A/R/A/P sorting check left NOT VERIFIED on 16 Nov (headers other than the name column): `report-gaps-2026-11-16/area2/resort_check.mjs` over every header label.

You are the worker. **No writes to Jira, TestRail, Google Sheets or Slack.** You draft; the coordinator verifies your committed evidence (Rule 86) and handles Jira.

## Read first (your rule book: this repo, branch claude/credit-memo-document-location-tov2x1 only; Rule 98)
- `CLAUDE.md` index. Read in full in their files: Rules 12, 14, 29, 32, 57, 58, 82, 94, 97, 99 (29 Oct + 6 Nov amendments), 100 (incl. the **16 Nov amendment: every ticket description carries an inline annotated screenshot**), 101 (9 Nov amendment), 103 (5 Nov + 9 Nov amendments).
- `build/skills/09-TEST-EXECUTION.md`, `build/skills/06-DEFECT-PREP.md`.
- `build/APP-ACTIONS-PLAYBOOK.md`: grep it, never read whole. Staging hosts: **app.staging.shopview.com / api.staging.shopview.com**. Grep it for the 16 Nov notes (two scripts must never share one session; retired A/R/A/P endpoints).
- The previous pass's tools and how they booted, zoned and saved: `build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/tools/sboot.mjs` (reuse it), its RESULTS.md, and the 28 Oct A/R/A/P work in `build/dashboard-verify-2026-10-28/reports/` (grep "ar-aging", "ap-aging").
- For item 6: grep `DQ-1` and `F2` under `build/dashboard-verify-2026-10-28/` to find the finding, the tile's PRD wording (Dashboard PRD Confluence 788430850 — check its current version) and Chris's answers (`chris-answers-2026-10-29/`, `chris-answers-2026-11-04-section3-verbatim.md`).

## Environment
- Record the build first (`meta[name="app-version"]`; was v26.45.4-f3d3d2d all of 16 Nov morning).
- Sign-in `/tmp/cln/cookies.json` via `staging-boot2.mjs` / `sboot.mjs`; quick-login allowed on staging; API reads from inside the booted page. Never print or commit cookies. Scratch dir `/tmp/cln/arap/` (chmod 700).
- Nobody else is testing on staging now. Locations: Heavy Duty - 9919 (Asia/Karachi), Lethbridge - 4310 (America/Edmonton) and the others in `sboot.mjs` LOC — read zones live. **Rule 99**: session change-location, browser timezoneId, process TZ, localStorage 'timezone' all = the location's zone, recorded; run `build/testing-tools/tz_rules_check.py` for the dates you test (Edmonton is an hour off in Chromium 153 after 1 Nov — keep checks out of the gap hour or label them NOT VERIFIED).
- Aging is date-sensitive: state the as-of date and the zone for every figure.
- Throwaway data: ZZAUTOTEST, every write logged in `seed-log.jsonl`, restore what you change. Do not touch `ZZAUTOTEST R365 Location C…` work orders S2-40391..S2-40397 / P2-2476..2477 (regression evidence).

## Expected behaviour comes from DOCUMENTS only (Rule 57)
- A/R/A/P: the new PRD 947650561 (read its CURRENT version, record it). Find what rebuilt the reports: SV-11315 is live at **Ready for Development** (not shipped), so search `/home/user/shopview` git history (`git fetch origin` first; `git log -S`, ticket keys) and Jira (read-only) for the change that did it. Code shows what changed and when; it is never the expectation.
- A silent or ambiguous document is a question for Chris, never a defect (Rule 58). Never ask Chris to change a document (Rule 103, 9 Nov).

## The work
1. **A/R Aging Summary / Detail / Collection and A/P Aging Summary / Detail / Unpaid Invoices:** build an independent recompute from the underlying invoices/bills/payments/credits (read via the app's own data, from inside the page) for at least two locations and two as-of dates (today and a fixed past date). Compare every bucket, row and total with the screen and with the downloads (CSV/PDF — open them; extract only needed rows, never commit full files with customer/vendor names). Report pass counts per report and every difference, each classified: defect candidate (quote) / question for Chris / by design (quote) / NOT VERIFIED (why).
2. **Sorting:** every A/R/A/P header label, both directions, against the PRD's sorting rules.
3. **Dashboard Technician Efficiency tile:** at the locations/presets used on 28 Oct, compare the tile with the Technician Efficiency report on today's build (zones matched). Say plainly whether F2 is still a problem, now fixed, or now a tile-vs-report mismatch.
4. Re-check before claiming (Rule 101): each candidate's duplicate search is a read-only JQL (`parent = SV-11936`, `parent = SV-11839`, plus text) run in the same pass.

## Output — `build/dashboard-verify-2026-10-28/ar-ap-rebuild-2026-11-16/`
- `RESULTS.md`: one table per item; each row: what was checked, the source quote + version, PASS / FAIL / NOT VERIFIED (why + what would unblock), evidence path.
- One folder per candidate (`D<n>-<slug>/`, `Q<n>-<slug>/`): `TICKET.html` (Rule 100: plain words, one example with the arithmetic, where to look, plain steps, source quote, **a "Picture:" line and the annotated screenshot meant to sit INSIDE the description**), `CHRIS-COMMENT.html` (what happens / what the document says / "fix it, or leave it as it is?", thankful, no request to change any document), annotated picture via `build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/tools/ann.py` (open and look at it; never cover the data), evidence JSON, `EPIC.txt` (Reports → SV-11936, Dashboard → SV-11839).
- **Commit and push after each item:** `git add -- <paths>` only; `python3 build/testing-tools/scan_secrets.py --staged` must exit 0; trailer:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01D95Q7VoyGzYXAt4w5J2bJE
  ```

## Hand-back (short)
Build, locations, zones; table per item; each candidate (folder, one line, quote, epic); what was NOT covered and why; commit ids. **Quality is never the thing cut.**

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

