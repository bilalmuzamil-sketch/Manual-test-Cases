# Phase 2: report-only ticket drafts. Shared brief for every worker (29 Oct 2026)

## The QA lead's orders (verbatim)

> "Chris has responded … check the answers from Chris and see which reports are effecting dashboard and where the dashboard is not working per the PRD and prepre the tickets for my review, the tickets hshould be ready to file to jira as soon as I give a go ahead to you."

> "We would need to create the tickets with a prefix like Dashboard - {{Ticket title}} For Reports it should be like this Reports - {{Ticket Title}} … Once done with the dashboard related tickets and the tickets which are related to reports but those reports are effecting dashboard ONLY then we will move towards the tickets related to those reports which are NOT effecting the dashboard. But in any case you will keep the ticket draft ready all of them and then we will review one by one and after my go ahead you will file those tickets in jira"

> (Rule 99, 28 Oct) "make sure you test those tickets ensuring that the Location timezone and your machine timezone is the SAME."

> (Rule 100, 28 Oct) "keep the issue clear … so that it can be understood by a lay man … or by a person who is look at the ticket for the first time."

The coordinator has finished Phase 1, the tickets that affect the Dashboard. Your job is **Phase 2: report defects that do NOT affect the Dashboard.** Write one ticket draft per defect in your list below. **Every title starts with `Reports - `.**

## Inputs (read only the parts you need, never whole files)

- **Chris Ward's answers, verbatim:** `build/dashboard-verify-2026-10-28/chris-answers-2026-10-29/CHRIS-WARD-ANSWERS-verbatim.md`. Grep your question numbers.
  - Chris's answer IS the expected behaviour for your ticket. It is a newer written statement than the PRD (Rules 57 and 32).
  - Quote it verbatim in the ticket.
- **The map:** `build/dashboard-verify-2026-10-28/chris-answers-2026-10-29/ANSWERS-AND-DASHBOARD-IMPACT.md`.
- **Earlier evidence for each finding** (who found it, the data, the tools, the pictures): `build/dashboard-verify-2026-10-28/reports/W1-labor-wip/`, `W2-sales-advisor-tax/`, `W3-parts/` and `W4-finance-accounting-comms/`.
  - Look in each folder's `RESULTS.md`, `PO-QUESTIONS.md`, `defects/` and `tools/`.
  - Reuse those tools and recipes; do not rediscover them.
- **Environment facts** (endpoints, ids, seeding recipes, boot2, annotate_v2): `build/dashboard-verify-2026-10-28/reports/WORKER-BRIEF.md`, section "Environment facts".
- **The format to copy exactly:** `build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase1/P1-3-reports-tech-utilization-seconds-only-technician.md` (and P1-2). Use the same header comment block, the same sections and the same plain wording.

## Non-negotiables

1. **Nothing is filed.**
   - No Jira create, edit, comment or link. No TestRail write. No edit of the Google Doc.
   - Read-only Jira and Confluence are fine. cloudId is `19fdd96d-a135-46c4-83e7-d2cc218a4e63`.
   - Do NOT `git add` or commit. The coordinator commits your files.

2. **Rule 99: every check and every picture in the LOCATION'S OWN TIME ZONE, and recorded.**
   - **Python:** run with `TZ=<zone>`. Call `POST /api/iam/change-location {"workplace_id":wid,"workplace_timezone":zone}` first.
   - **Browser:** start it with `boot2('admin',{workplaceId, timezone: zone, contextOptions:{viewport:{width:1600,height:1000}, deviceScaleFactor:2, timezoneId: zone}})` and run node with `TZ=<zone>`.
   - **Record** `browser_zone`, `process_zone` and `location_tz` in a `meta.json` next to the pictures. Take `browser_zone` from `Intl.DateTimeFormat().resolvedOptions().timeZone`, evaluated inside the page.
   - A result seen with the zones unmatched or unrecorded is NOT VERIFIED and is never drafted as a ticket.
   - Copy the pattern of `build/dashboard-verify-2026-10-28/tools/evidence_phase1.mjs`, which already does all of this.
   - **Locations and zones:**

     | Location | Workplace id | Zone |
     |---|---|---|
     | Staging Heavy Duty - 9919 | `b3c8c820-f815-4cf1-8938-10956c5ee71a` | Asia/Karachi |
     | Staging Lethbridge - 4310 | `f8a8b802-7780-4b16-bf10-343caeb616b2` | America/Edmonton |
     | QB Location | `25a0d576-b371-4b82-bef4-41ba977f31c2` | America/Vancouver |
     | DVI Test | `39522bc6-abca-4f67-bd12-2840043c2d68` | America/Toronto |

3. **Use YOUR OWN session, because other workers run at the same time.**
   - `change-location` applies to the whole session, so NEVER use `/tmp/cln/sess-admin.txt`.
   - Mint your own session file `/tmp/cln/<you>/sess.txt` (mode 600). Model it on `/tmp/cln/dv/mint.mjs`: copy that script into your tools folder and change only the output path.
   - In Python, set `import collect_dashboard; collect_dashboard.COOKIE = open('/tmp/cln/<you>/sess.txt').read().strip()` BEFORE you call `curl` or `get`. The same trick is in `reports/W2-sales-advisor-tax/tools/common.py`, line 8.
   - boot2 makes its own browser session each time it launches, so the browser is safe.
   - Never print a cookie.

4. **Verified means observed (Rule 12).**
   - Re-check each finding on the CURRENT build. Read `<meta name="app-version">`; expect `v26.43.2-f8698cb`, and say so if it changed.
   - Check at least once **through the screen** and once from the server data.
   - If it no longer reproduces, write that instead of a ticket.
   - If a customer cannot reach it on screen, it is NOT a ticket, and you say so. QA lead, 28 Oct: exclude what a customer cannot reproduce on screen.

5. **Rule 100: plain words for a first-time, non-technical reader.**
   - Say what the screen shows and what it means.
   - Give ONE example with the arithmetic (Actual vs Expected).
   - Say where on screen to look.
   - Write plain numbered steps with the exact on-screen labels: one action per step, the exact test data named, and what to pick once the date moves on (for example "from 1 November pick Last month").
   - Quote the source: Chris verbatim, plus the PRD line if it helps.
   - Use few pictures (1–3).
   - Put "For developers" last and keep it short.
   - No row counts, no endpoints or field names outside the developer note, no jargon.

6. **Ticket fields** (the QA lead's ruling for epic SV-11839):
   - Bug, parent SV-11839, priority Medium, Product Area "Reports & Dashboards".
   - "relates to" the owning story. Find it with JQL (read-only) and record its key and summary.
   - Keep the heading "Where this shows on the Dashboard" with the line `Not affected — this report does not feed any Dashboard tile.`, so the reviewer sees it was considered.

7. **Duplicate check (A4).**
   - Run JQL live for each ticket: summary and text words, last 365 days, project SV.
   - Record the query and the result in your summary file.
   - If an open ticket already covers it, do NOT draft a new one. Draft a short comment instead (like `phase1/P1-5-COMMENT-SV-11823-revenue-split.md`) and say so.

8. **Pictures.**
   - Annotate with `python3 build/dashboard-verify-2026-10-28/tools/annotate_v2.py IN.png OUT.png --scale 2 --title "…" --mark "x,y,w,h:bad:<full sentence>" --mark "x,y,w,h:good:<full sentence>"`. Boxes are in source pixels (2x).
   - **Look at every annotated picture before you list it.** The box must sit on the thing it names, and that thing must be visible. Lesson L3, 28 Oct: a box was once drawn on an off-screen row.
   - Save to `build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/pictures/` as `P2-<ID>-<n>-<what>.png`.

9. **Test data.**
   - Throwaway only, named `ZZAUTOTEST …`.
   - Seed at DVI Test unless the finding needs another location. Record every record you create.
   - **Do not touch the Phase-1 evidence records:**
     - DVI Test: S1-38195, S1-38196, S1-38198, S1-38199, S1-38200, S1-38215
     - Lethbridge: S3-17383
     - Heavy Duty: QA Technician's clock on S2-38042
   - Do not edit any existing clock at DVI Test.

10. **Secrets** live in /tmp only. Never write one into the repo.

## Output (per worker)

- **One draft per defect:** `build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/P2-<ID>-<slug>.md`. Copy the P1-3 layout exactly, with the summary starting `Reports - `.
- **Your tools:** `build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/tools/<you>/`.
- **A summary file** `build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/SUMMARY-<you>.md`. For each item record:
  - the verdict: DRAFTED / NOT REPRODUCED / NOT ON SCREEN / ALREADY REPORTED SV-#### + comment draft
  - the re-check date and time (UTC) and the zones
  - the test data you created
  - the owning story
  - the JQL you ran
- **Final reply to the coordinator,** 25 lines or fewer:
  - the table of items with verdicts and file names
  - anything you could not do, and the searches you ran (Rule 97)

## THE ASSIGNMENTS (ID · Chris question · what to draft)

### Worker A: Labor / Work In Progress / Payroll (earlier evidence: `reports/W1-labor-wip/`)

| ID | Q | Defect (Chris's answer decides the expected result) |
|---|---|---|
| A1 | 4 | Work In Progress: Days Open reads "1 days". It should read "1 day". (Counting by calendar dates is correct, per SV-9403.) |
| A2 | 6 | Work In Progress: a part request marked "received later" counts in Parts Remaining. It should count in Parts Earned. |
| A3 | 11 | Timesheet Activities: time on a deleted work order shows a blank Work Order. It should read "Deleted work order". (The hours keep counting as WO Hours.) |
| A4 | 12 | Shop Efficiency: a running shift under 24 hours is left out of Total Clocked Hours. It should count (same rule as SV-11688). |
| A5 | 39 | Export Reports → Payroll Timesheet: overlapping clocks make one employee's day exceed 24 Total Hours. Overlapping time should count once. |

### Worker B: Parts Velocity / Inventory Value (earlier evidence: `reports/W3-parts/`)

| ID | Q | Defect |
|---|---|---|
| B1 | 13 | Parts Velocity: "Last 90 days" covers 91 days. It should be today and the 89 days before it. |
| B2 | 15 | Parts Velocity: a return to the vendor (Parts → Returns) counts in Units Returned. Only customer returns should count. |
| B3 | 16 | Parts Velocity: with one location picked, the Location column is hidden. It should always show, as on Inventory Value. |
| B4 | 18 | Parts Velocity: Last Sale ignores a billed sale that moved no stock. Any billed sale should count. |
| B5 | 20(b) | Inventory Value: the quantity column heading reads "Qty". The standard is "On Hand", on screen and in the download. |
| B6 | — | Earlier finding PV-D1 (`reports/W3-parts/defects/TICKET-D1-pv-receive-later-special-order-not-counted.wiki`). Re-verify under Rule 99 (its earlier screen pictures were NOT taken in America/Toronto) and redraft in the new format. |
| B7 | — | Earlier finding PV-D2 (`reports/W3-parts/defects/TICKET-D2-pv-demand-counts-reinvoice-twice.wiki`). Same as B6. |
| B8 | — | Earlier finding IV-COLUMNS (re-created SV-8927; draft `build/dashboard-verify-2026-10-28/filed-2026-10-28/drafts/IV-COLUMNS.html`; picture already recaptured in Toronto). Convert to the new format and re-check once more. |

### Worker C: Sales By Representative / Sales Tax Collected (earlier evidence: `reports/W2-sales-advisor-tax/`)

| ID | Q | Defect |
|---|---|---|
| C1 | 27 | Sales By Representative keeps the old Labor Delta after a timesheet is corrected. It should use the figures as they are now. This is the same as Phase-1 P1-4 for Sales By Customer. Reuse its method (`build/dashboard-verify-2026-10-28/tools/seed_q27.py` and `evidence_q27.mjs`), but make your OWN new ZZAUTOTEST work order with a sales representative set, and do not touch S1-38215. |
| C2 | 30 | Sales Tax Collected: credit memos are not shown and do not lower the tax totals. They should show as negative rows on their date, with their tax taken off the totals. |
| C3 | 31(a) | Sales Tax Collected: $0.00 invoices with no payment are listed as Paid, with a paid date. $0.00 invoices should be left off. |
| C4 | 31(b) | Sales Tax Collected: when a deposit pays part of an invoice, Invoice Paid Date is the invoice date. It should be the latest payment date, deposits included (SV-4573). |
| C5 | — | Earlier finding TAX1 (`reports/W2-sales-advisor-tax/defects/TICKET-W2-6-sales-tax-status-deposit-paid.wiki`). Re-verify and redraft. Check whether it is the same defect as C4; if so, merge them and say so. |
| C6 | — | Earlier finding SBR-ORDER (re-created SV-8974; draft `build/dashboard-verify-2026-10-28/filed-2026-10-28/drafts/SBR-ORDER.html`). Convert to the new format and re-check once more. |

### Worker D: A/R · IBS · Notes · QB Unexported · Export Reports (earlier evidence: `reports/W4-finance-accounting-comms/`)

| ID | Q | Defect |
|---|---|---|
| D1 | 33 | A/R Aging: once a part sale is invoiced, its deposit does not lower its A/R balance. Example: P2-2352 shows $543.43 on A/R but $443.43 on the Invoices tab. It should, by the same rule as SV-11690. |
| D2 | 34 | IBS Batches → Sent: a batch's Total ($9,473.35) is not the sum of its invoices ($9,183.29). It must always equal the sum. |
| D3 | 35 | IBS Batches → Ready to Send: a $0.00 invoice is listed. $0.00 invoices should be left out. |
| D4 | 36 | Notes Report: shows at most 100 notes, with no way to see more. It should show every note in the dates, with paging. |
| D5 | 37(a) | QB Unexported → Customers: credit memo rows (and payment and application rows) have a blank No. Every row should show its number. |
| D6 | 37(b) | QB Unexported → Customers: a document appears more than once, each time with a different error. There should be one row per document, showing its latest error. |
| D7 | 38 | Export Reports → Customer Invoice: Terms shows Net 30/50/60 where the invoice and the customer say COD. It should show the invoice's own term. |

Note for Worker D: Chris (Q32) also asked us to link the A/R same-day-credit finding to SV-11441. That is a Jira write, so only draft the comment text in your summary; do not post it.


## TOKEN DISCIPLINE CHARTER (Rule 95, embedded verbatim)

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


