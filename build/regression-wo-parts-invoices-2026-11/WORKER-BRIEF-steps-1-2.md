# Regression steps 1 and 2 on STAGING: worker brief (16 Nov 2026)

## The order
- QA lead, 13 Nov (verbatim): *"I need to run the regression tests on workorder l;ifecycle and parts lifecycle and also ensure that the invoices being created by both parts lifecycle and work order are accurate and nothing is being missed."*
- Narrowed since — the full record, verbatim, is `build/regression-wo-parts-invoices-2026-11/INTAKE.md`. **Read it in full first.** In short:
  - IN: the work order lifecycle, part sales, and the accuracy of every invoice either one creates.
  - OUT: parts lifecycle (SV-10647); Invoice Refresh; Fees & Discounts (on WO and part lines); Founder Mode / Internal Work Order.
- 16 Nov, plan approved (QA lead: *"I will follow your recomentation"*). The recommendation was: **steps 1 and 2 first**, then the TestRail cases one section at a time (that later step is NOT yours).
- Build: **STAGING** (sv11839 is gone).

You are the worker. **You do NOT write to Jira, TestRail, Google Sheets or Slack.** You test and draft; the coordinator verifies your committed evidence (Rule 86) and fills the shared workbook.

## Read first (your rule book: this repo, branch claude/credit-memo-document-location-tov2x1 only; Rule 98)
- `CLAUDE.md` index. Read these rules in full in their files: 12, 14, 29, 32, 57, 58, 82, 94, 96, 97, 99 (with the 29 Oct and 6 Nov amendments), 100, 101 (with the 9 Nov amendment).
- `INTAKE.md` above, especially **"How this run obeys it"** — the classification of every mismatch into (a) bug candidate / (b) outdated test or ticket / (c) question for Chris / (d) settings-dependent, and the evidence chain. **A mismatch is never a bug until it passes every step there.**
- `build/skills/09-TEST-EXECUTION.md`, `build/skills/06-DEFECT-PREP.md`.
- `build/APP-ACTIONS-PLAYBOOK.md`: grep it, never read it whole. Staging hosts are **app.staging.shopview.com / api.staging.shopview.com** (NOT staging.shopview.com).

## Environment
- Record the build first: `meta[name="app-version"]` (was v26.45.4-f3d3d2d at 06:28 UTC on 16 Nov).
- Sign-in: `/tmp/cln/cookies.json` (chmod 600). Boot with `build/testing-tools/staging-boot2.mjs` (`boot2('admin', {workplaceId, timezone})`); quick-login is allowed on staging.
  - boot2 rotates PHPSESSID: make API calls from inside the booted page (`page.evaluate(fetch …, credentials:'include')`), as `build/dashboard-verify-2026-10-28/sv10702-recheck-2026-11-16/zone.mjs` does.
  - Never print or commit cookies. Use your own scratch dir `/tmp/cln/rgwo/` (chmod 700). **Do not touch `/tmp/cln/rg16/`** — it belongs to the other worker.
- 🔴 **ANOTHER WORKER IS RUNNING ON STAGING RIGHT NOW** (report re-checks at **Heavy Duty - 9919, Calgary HD, Lethbridge - 4310**). New work orders and invoices at those locations would change its report figures mid-run.
  - **Work at a different location.** List them live (`GET /api/staff/my-workplaces`), choose one that is none of those three, has an active setup (labour rate, tax, a customer, parts in stock), and record why you chose it.
  - **Do not change any setting** in this pass (settings can be company-wide and would disturb the other worker). Settings-dependent behaviour is recorded as (d) with the current value; re-testing under other values is a later, separate pass.
- Rule 99 time zones: session change-location, browser `timezoneId`, process `TZ`, and localStorage `timezone` must all equal the location's zone, and be recorded with every result. Run `build/testing-tools/tz_rules_check.py <zone> --from 2026-11-16 --to 2026-11-30`.
- Throwaway data: name/tag it **ZZAUTOTEST**, log every create/update call to `seed-log.jsonl` in your folder.

## Expected behaviour comes from DOCUMENTS only (Rule 57) — and here most documents are OLD
- There is **no work order lifecycle PRD**. Candidate sources are listed in INTAKE.md ("Candidate sources found"). Re-read the CURRENT Confluence version of each before relying on it (Rule 59) and record the version. Most useful for invoices: 989757441 "Create Invoice: closing the payment window" (says it describes current production behaviour checked against code on 30 Oct 2026) and 767066118 "Invoice Status and Payment Status Reference". Also 646021121 (Simple Mode) and 782761986 (inline parts on WO lines).
- Product repo for the supersession check (read-only): `/home/user/shopview` — run `git fetch origin` there first; use `git log -S`, `git log -L`, blame, and the ticket keys in commit messages. **Code shows WHAT changed and WHEN; it is never by itself the expectation.**
- **Arithmetic you can show is still a check:** if the same screen or document shows lines that do not add up to its own subtotal/total, or an invoice leaves out a line the work order has, that is a candidate even without a PRD — show the arithmetic. Anything that needs a rule nobody wrote down (rounding method, which lines are taxable, when a status changes) needs a document; if none exists it is (c) a question for Chris, never a bug.
- Never ask Chris to change a document (Rule 103, 9 Nov amendment).

## Step 1 — record the settings
- Open https://app.staging.shopview.com/administration/settings (and any sub-pages it links) for your location.
- Record **every** setting that can change how a work order moves through its life or what its invoice contains (statuses, required fields, approvals, labour/parts pricing and tax, deposits, invoicing, payment, numbering, completion rules, simple mode, etc.).
- Output `settings.json` (page, section, label exactly as on screen, value, time recorded) plus screenshots. For each setting say in one line which part of the run it affects.

## Step 2 — full flows, every invoice recomputed independently
Run each flow end to end at your location, on screen (the API only for reading back figures). For **every** invoice: list every line the source record has, then work out quantities × prices, line totals, subtotal, tax, total, deposits/payments applied and balance **yourself** from the inputs you entered, and compare every figure with the invoice screen and the invoice's own data. "Nothing is being missed" = every line, quantity, hour, part and payment on the work order or part sale appears on the invoice, once.
Minimum set (add more where the sources or settings show another path matters):
1. **WO-1:** customer + unit → labour line(s) and part line(s) → move through every status the build offers to completion → create the invoice → pay in full. Record each status change and what is locked/allowed at each.
2. **WO-2:** a deposit taken before the invoice → invoice → the deposit applied → a partial payment → the balance paid. Check balance and payment status at every stage against 767066118.
3. **WO-3:** awkward numbers — decimal hours (e.g. 1.33 h), a part quantity > 1 with a price ending in odd cents, a non-taxable line if the setup allows — to expose rounding and tax.
4. **WO-4:** re-open / edit after invoicing (whatever the build allows): does the invoice follow, lock, or leave something out? Follow 989757441.
5. **PS-1:** a part sale with several parts → invoice → pay in full.
6. **PS-2:** a part sale with a partial payment, then the balance.
Do NOT use discounts or fees (excluded), internal work orders, or the invoice design/refresh screens beyond reading the figures.

## Output (everything under `build/regression-wo-parts-invoices-2026-11/steps-1-2/`)
- `RESULTS.md`: build, location (and why), the four zones; then one table per flow. Each row: what was checked, the expected value **with how you got it** (your arithmetic, or the source quote + version), what the screen showed, verdict **PASS / (a) / (b) / (c) / (d) / NOT VERIFIED** (with exactly why and what would unblock it), and the evidence path.
- `rows.json`: the same rows, shaped for the workbook tabs — `tab` ∈ {"Bug candidates","Outdated tests and tickets","Questions for Chris","Passed","Not verified","Settings used"} plus the columns of that tab as listed in `INTAKE.md` "Workbook" section (ID, Area, … — copy the header names exactly from the workbook headers given at the end of this brief).
- One folder per (a) or (c): `A<n>-<slug>/` or `C<n>-<slug>/` with `TICKET.html` (plain words, first-time reader, Rule 100: what the screen shows, one example with the arithmetic, where to look, plain steps, source quote, no developer section), the **evidence chain** (old test/ticket → newer ticket(s) → commit(s) → current source quote → build observation with build/time/location/zones), an annotated picture (`build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/tools/ann.py`; open it and look at it before handing back), evidence JSON. For (c) also `CHRIS-COMMENT.html` (what happens today / what the sources say / "fix it, or leave it as it is?").
- **Gate (Rule 94) before drafting an (a):** read-only Jira duplicate search (text search on the behaviour), reproduced on screen with the zones recorded, expectation quoted or arithmetic shown, supersession check done.
- **Commit and push after each step and after each flow:** `git add -- <paths>` only; `python3 build/testing-tools/scan_secrets.py --staged` must exit 0; never commit full downloads holding staff/customer names (extract the rows you need); trailer:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01D95Q7VoyGzYXAt4w5J2bJE
  ```
- If another worker's uncommitted files are in the tree, leave them alone (path-scoped adds only).

## Workbook headers (the coordinator writes these; match them in rows.json)
- Bug candidates: ID · Area · Title · What happens · What should happen · Source of the expected behaviour (quote, link, date) · Why it is not outdated (newer tickets and code history checked) · Steps to reproduce · Build, date/time, location, time zones · Picture · TestRail case (C-id and link) · Verified by Mudassir (Yes/No) · Jira ticket · Notes
- Outdated tests and tickets: ID · Area · TestRail case (C-id and link) or ticket · What the old case or ticket says · What the app does now · Newer source that changed it (ticket, code change, date) · Suggested update · Notes
- Questions for Chris: ID · Area · Question in plain words · What happens today (one example) · Sources found and why they do not settle it · My recommendation · Chris's answer (where, date) · Notes
- Passed: ID · Area · What was checked · TestRail case (C-id and link) · Result seen · Build, date/time, location, time zones · Evidence
- Not verified: ID · Area · What could not be checked · TestRail case (C-id and link) · Why (blocked by what) · What is needed to check it
- Settings used: Settings page and section · Setting · Value when tested · Date/time recorded · Why it matters for the regression
(Area values: "Work Order lifecycle", "Part sales", "Invoices from work orders and part sales". "Verified by Mudassir", "Jira ticket" and "Chris's answer" stay empty.)

## Hand-back (short)
- Build, location, zones; one line per flow (PASS count / candidates).
- Each (a)/(c): folder, one line, the source quote or arithmetic.
- What was NOT covered, and why. Commit ids.
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

