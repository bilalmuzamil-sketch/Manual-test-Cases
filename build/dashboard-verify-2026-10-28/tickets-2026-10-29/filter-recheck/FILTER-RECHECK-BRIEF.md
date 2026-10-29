# Filter recheck of every filed ticket. Shared brief for every worker (29 Oct 2026)

## The QA lead's order (verbatim, 29 Oct 2026)

> "SV 11955 The notes are appearing in the REPORTS tab but they are not related to the reports at all, also I see you have applied the filter  for a week, make sure that you double check the filters when reporting something, i believe you must also check ALL the tickets yo uhave reported so far for DASHBOARD and for REPORTS all the tickets if they were also showing wrong results due to any filter which was pre applied there,."
>
> "All tickets for the temporary epic and all the tickets for DASHBOARD which you have created need to be rechecked, make sure that FILTERS are not the cause of an unexpected results which made you file a ticket."

**The question for every ticket:** could a filter, a date range, a location, a picked customer/vendor/staff/representative, a tab, a search, a column or sort choice, a toggle, or a setting the screen REMEMBERED from an earlier visit explain the "wrong" result? If yes, the ticket is wrong. If no, prove it.

## What you check, for EVERY ticket in your list (all six steps, no sampling, Rule 50)

1. **Inventory the controls.** Read the ticket as filed (file paths below). List every control on that screen that shapes the result (date / as-of / date range, location picker, customer / vendor / staff / representative picker, status tabs, Show Unassigned, search box, columns button, sort, toggles such as "Open only", Dashboard date range and location) and the value the ticket's steps and pictures used.
2. **Hidden / pre-applied filters.** Open the screen in a FRESH browser context (new boot2 launch, empty storage except the app's own `localStorage['timezone']` key) and record what every control defaults to. Also check whether the screen restores a remembered view (local storage keys, a server-saved preference, or URL query values). Compare with the ticket's pictures: any control that was NOT at its default and is NOT named in the steps is a hidden filter. Name it.
3. **Independence test.** Re-run the reproduction three ways and record the figures each time:
   - (i) exactly the ticket's stated filters;
   - (ii) every control at its fresh default;
   - (iii) the narrowing filters widened or removed wherever the screen allows (All / widest date range, all locations, no customer / vendor / staff / representative, no search, all tabs).
   The defect must still show in a way the filters cannot explain (for example: Notes stops at 100 also with "All"; same-day order is wrong also with no representative opened).
4. **Expected-value check.** Confirm the ticket's Expected figure was worked out for the SAME filter it names (for example: what dates "Last Week" really covers in the app; what "Last 90 days" means; the A/R or A/P as-of date; which location's records are included). If the expected figure silently assumed a different filter, that is a finding.
5. **Server data cross-check.** Read the same report from the server data with the same filter values the screen sent (record the request the page made), and confirm the screen and the data agree.
6. **Verdict**, exactly one of:
   - **STANDS**: filters are not the cause; give the evidence in one or two lines.
   - **STANDS - WORDING FIX**: the defect is real, but the ticket text should name or change a filter so a first-time reader gets the same result. Give the exact old sentence and the exact replacement sentence, in plain words (Rule 100).
   - **CAUSED BY FILTER**: the unexpected result came from a filter or a remembered setting. Say which, show the figures that prove it, and recommend Obsolete with a one-line plain reason.
   - **NOT REPRODUCED NOW**: it no longer shows with any filter combination; give the figures.

## Non-negotiables

1. **Nothing is written outside the repo.** No Jira create, edit, comment, link or transition. No TestRail write. No Google Doc edit. Read-only Jira and Confluence are fine (cloudId `19fdd96d-a135-46c4-83e7-d2cc218a4e63`). Do NOT `git add` or commit; the coordinator commits.
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
   - `change-location` applies to the whole session, so NEVER use `/tmp/cln/sess-admin.txt` for API calls.
   - Mint your own session file `/tmp/cln/<you>/sess.txt` (mode 600). Model it on `/tmp/cln/dv/mint.mjs`: copy it into your tools folder and change only the output path. The base cookies in `/tmp/cln/cookies.json` were refreshed by the QA lead on 29 Oct and work (HTTP 200).
   - In Python, set `import collect_dashboard; collect_dashboard.COOKIE = open('/tmp/cln/<you>/sess.txt').read().strip()` BEFORE you call `curl` or `get` (same trick as `reports/W2-sales-advisor-tax/tools/common.py`, line 8).
   - boot2 makes its own browser session each time it launches, so the browser is safe. Never print a cookie.
4. **Verified means observed (Rule 12).** Every verdict comes from a check you ran today on the current build (read `<meta name="app-version">`; expect `v26.43.2-f8698cb`, say so if it changed), once through the screen and once from the server data. Never infer a verdict.
5. **Test data.** Use the ticket's own records. If you must seed, throwaway only, named `ZZAUTOTEST …`, at DVI Test, and record it. Do not edit or delete existing records named in any ticket; do not edit any existing clock.
6. **Pictures** only where a verdict needs one (a hidden filter, or a wording fix whose picture would change). Annotate with `tools/annotate_v2.py` and LOOK at each picture before you list it.
7. **Secrets** live in /tmp only.

## Where the filed text is

- Dashboard tickets: `phase1/P1-1…P1-4*.md` (SV-11931 = P1-1, SV-11932 = P1-2, SV-11933 = P1-3, SV-11934 = P1-4). SV-11931 also has a comment to Chris (79711).
- Parking-epic tickets: `filed/html/P2-<ID>-SV-<key>.html` (exact filed text), with the draft and its header (re-check times, data) in `phase2/P2-<ID>-*.md`.
- SV-11935 (A/R, D1): `phase2/P2-D1-*.md` (filed text = that draft).
- SV-11922 (A/P): `../filed-2026-10-28/SV-11922-v2-plain.md`; its re-check record is `../filed-2026-10-28/SV-11922-REVERIFY-RULE99.json`.
- Held drafts (not filed): `phase2/P2-A5-*.md` (Payroll Timesheet), `phase2/P2-D7-*.md` (Customer Invoice export Terms).
- Earlier tools and recipes: `../tools/`, `phase2/tools/p2a…p2d/`, `../reports/W1…W4/tools/`. Reuse them.

## Output (per worker)

- Tools: `filter-recheck/tools/<you>/`. Evidence (JSON per ticket, with the three runs, the requests, the zones meta): `filter-recheck/evidence/<you>/`.
- A summary file `filter-recheck/RESULT-<you>.md` with one block per ticket: the control inventory, the fresh defaults, the hidden filters found (or "none"), the three runs' figures, the expected-value check, the verdict, and (for a wording fix) the exact old and new sentences.
- **Final reply to the coordinator, 25 lines or fewer:** a table `ticket · verdict · one-line reason`, then anything you could not do and the searches you ran (Rule 97).

## THE ASSIGNMENTS

| Worker | Tickets |
|---|---|
| **F1** Dashboard + labor | SV-11931 (P1-1), SV-11932 (P1-2), SV-11933 (P1-3), SV-11934 (P1-4) — check the Dashboard date range and location AND the report's own filters for each; SV-11937 (A1), SV-11938 (A2), SV-11939 (A4), SV-11948 (C1); held draft A5 |
| **F2** Parts | SV-11940 (B1), SV-11941 (B2), SV-11942 (B3), SV-11943 (B4), SV-11944 (B5), SV-11945 (B6), SV-11946 (B7), SV-11947 (B8) |
| **F3** Sales tax, Sales By Representative order, A/R, A/P | SV-11949 (C2), SV-11950 (C3), SV-11951 (C4), SV-11952 (C6), SV-11935 (D1), SV-11922 (A/P) |
| **F4** IBS, Notes, QB Unexported, Export | SV-11953 (D2), SV-11954 (D3), SV-11955 (D4), SV-11956 (D5), SV-11957 (D6); held draft D7. **Extra for SV-11955:** the QA lead says the notes "are not related to the reports at all". Record, from the screen and read-only Jira/Confluence: where Notes sits in the menu, what kinds of records its notes come from, and whether any PRD, story or ticket defines a Notes report (JQL / Confluence search, record the queries). |

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



## AMENDMENT 1: the QA lead's ruling on filters (29 Oct 2026, verbatim). This overrides the verdict wording above where they differ.

> "ALL the tickets which you have filed under the Temporary epic and under the dashboard EPIC, i have a doubt that few or ALL might have given the wrong expected results because the filters are by default being applied there, you need to make sure that you delelect ALL the filters and keep/edit the ticket as per the findings then and any ticket which appears to show expected results after removing all the filters should be moved to obsolete and removed from the epic, however keep the filters applied if the filter is the requirement to test something which is related to the filter, but if a use case or the ticket is not related to the filter and we are testing the behavior of the report where the filter is not needed then REMOVE the filter and then see the behavior if that is correct or not."

What this means for every ticket:

1. **Is the filter the thing being tested?** Answer YES or NO for every filter the ticket uses, with a one-line reason. Some examples:
   - "Last 90 days" covering 91 days: the date option IS the subject.
   - Location column hidden when one location is picked: the location pick IS the subject.
   - Invoice Status "Partially Paid" missing an invoice: the status filter IS part of the subject.
   - A/R or A/P "as of" date: the report cannot run without one. It stays at its default (today) unless a past date is the point of the test.
2. **Deselect every filter that is NOT the subject.** Clear it, or set it to "All" or to the widest choice. A control that cannot be cleared (a date the report cannot run without) goes to its widest or default value. Then run the reproduction again and record what the screen shows.
3. **New verdict, exactly one of:**
   - **KEEP AS IS**: the defect shows with all non-subject filters deselected, and the ticket's steps and pictures already use no unneeded filter.
   - **KEEP, EDIT**: the defect still shows with the non-subject filters deselected, but the ticket's steps, example or pictures used an unneeded filter. Give:
     - the replacement steps with those filters removed;
     - the new Actual and Expected figures, with the arithmetic;
     - ONE replacement picture taken with the filters deselected, annotated and looked at;
     - the exact sentences to change.
   - **OBSOLETE**: with the non-subject filters deselected, the screen shows the expected behaviour. The ticket came from a filter. Give the figures.
   - **NOT REPRODUCED NOW**: same as before.
4. SV-11955 (Notes) has been moved to Obsolete and out of the epic by the QA lead. Do no further work on it.
5. Still no Jira writes by workers. The coordinator applies the edits and Obsolete moves after reviewing your results.
