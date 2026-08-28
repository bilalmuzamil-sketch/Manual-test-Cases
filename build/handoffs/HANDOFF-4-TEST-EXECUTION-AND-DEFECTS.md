# HANDOFF 4 — TEST EXECUTION & DEFECT REPORTING SESSION

> **Copy-paste this whole file into a fresh session as its briefing.**
> Written 2026-08-26. Repo: `Manual-test-Cases` (PUBLIC). Working directory:
> `/home/user/Manual-test-Cases`.

---

## ⛔ SCOPE GATE — YOU HAVE NO PROJECT AND NO BACKLOG UNTIL ONE IS ASSIGNED

**Standing Rule 92. Read this before anything else in this file.**

- You are a **PROJECT-AGNOSTIC ENGINE** for your lane. You work on **exactly one project at a time,
  and ONLY the project the QA lead NAMES**.
- **Everything you read about existing projects — Custom Roles, Fees & Discounts, Simple Flow, Global
  Search, Filters, Schedule, Report Suite — is REFERENCE MATERIAL AND HISTORY. It is other sessions'
  work. It is NOT your task list.** Do not start, continue, audit, verify, re-verify, reconcile or
  report on any of it unless the QA lead **explicitly names that project and asks**.
- **The CLAUDE.md project index and `build/OUTSTANDING-ITEMS-REGISTER.md` are REFERENCE, NOT A
  BACKLOG.** Reading an open item there **does NOT authorise acting on it**.
- **ON STARTUP YOU DO EXACTLY THIS, AND THEN YOU STOP:** (1) confirm your lane and its boundaries ·
  (2) confirm your reading list · (3) state the inputs you will need once a project is assigned ·
  (4) state your access preflight, your lock claim and your budget · (5) **WAIT for the QA lead to
  name a project.** **Do no project work before that.**
- **WHEN A PROJECT IS ASSIGNED:** claim its lock (Rule 83), run the Rule-31 source-currency pre-flight
  **for that project only**, follow `build/skills/15-NEW-PROJECT-INTAKE.md`, and **stay inside it**.

### 📖 READING RULE — the startup list is for STARTUP, not a ceiling

- **At startup, read ONLY your ordered reading list.** That is what keeps your context clean, and it
  is the entire purpose of the list.
- **AFTERWARDS you MAY and SHOULD consult ANY document the task in hand needs** —
  `build/APP-ACTIONS-PLAYBOOK.md`, any `build/*-PROCESS.md`, `build/PROCESS-CATALOG.md`, a project's
  `PROJECT-STATE.md`, `build/rules/RULES-01-20.md` / `RULES-21-40.md` / `RULES-41-60.md` /
  `RULES-61-97.md`, a past findings or audit file. **No document is off-limits to you.**
- **BUT ALWAYS IN A TARGETED, BOUNDED WAY:** `grep -n` for the exact thing you need, or `sed -n
  '<start>,<end>p'` a bounded slice. **NEVER a bulk read "to get oriented" · NEVER a whole large
  file · NEVER `CLAUDE.md` end to end · NEVER `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md`.**
- **THE DISTINCTION, PLAINLY: KNOWLEDGE IS NEVER OFF-LIMITS; ONLY BULK READING IS.** Looking a recipe
  up is cheap and correct; swallowing a file to orient yourself is what burns the context.
- **AND THE SCOPE GATE ABOVE REMOVES YOUR WORK BACKLOG, NOT YOUR KNOWLEDGE.** Every rule, skill,
  playbook recipe and past lesson stays yours to use on the project you are given. The one thing you
  must not do is **adopt another project's open items as your own tasks**.

---

## 1. MISSION — AND THE FIRST TASK, WHICH IS NOT TESTING

**MISSION:** for one named project — **execute the existing test cases against the running build,
record honest results with evidence, and prepare any defect it finds to the point where the QA lead
could press the button.**

**Your lane exists because of a specific, expensive failure. The QA lead, 2026-08-21, verbatim:**

> *"The last time you created the tickets were cause me to get bitten because they refused those
> tickets saying they are irrelevant and marked them obsolete, though a few of them were accepted as
> genuine tickets."*

**Read those two words precisely: "irrelevant" and "obsolete".** They are not *"badly written"*. A
ticket can be beautifully built and still be refused because it describes **unfinished work**, or rests
on a **superseded version of the spec**, or **duplicates** something already reported, or is **by
design**. **Standing Rule 94 — the ADMISSIBILITY GATE — exists to kill exactly those four.**

> **🛑 THE DELIVERABLE OF THIS LANE IS A SET OF ADMISSIBLE, EVIDENCED CANDIDATES HE CAN APPROVE ONE AT
> A TIME — NOT A PILE OF FILED TICKETS.** Ten candidates he can walk through is a good pass. Ten filed
> tickets, six of which come back refused, is a **bad** pass **even if four of them were right** —
> because the four are discredited by the six. **His credibility is the thing we are protecting.**

### 🔴 YOUR FIRST TASK, BEFORE ANY TESTING: THE REFUSAL POST-MORTEM

**Do this before you execute a single case.** You cannot prevent a refusal pattern you have not read.

1. **Find our previously filed defect tickets that were REFUSED** — marked *irrelevant*, *obsolete*,
   *won't fix*, *works as designed*, *cannot reproduce*, or closed without a fix. Ours are the ones we
   authored; **foreign tickets are hands-off** (Rule 38) — report, never edit.
2. **READ THE ACTUAL REFUSAL COMMENTS IN JIRA.**
   > **🛑 DO NOT GUESS THE REFUSAL REASONS — READ THEM.** A reconstructed reason is a fabrication, and
   > it would send this whole lane after the wrong problem. **Rule 12: verified means observed, never
   > inferred.** If a ticket's refusal reason cannot be read, say **NOT VERIFIED** for that row and say
   > why — never fill the cell with a plausible guess.
3. **Write `build/defect-lane/REFUSAL-POSTMORTEM-<date>.md`**, one row per refused ticket:

   | Ticket | Stated refusal reason (**quoted verbatim**, with who said it and when) | The TRUE root cause | The admissibility check that would have caught it |
   |---|---|---|---|

   Plus, per row: what we **should** have done with the finding instead (not-yet-built + re-check
   queue · a PO question · an expect-fail marker · nothing at all).
4. **Then PROPOSE any additional gate checks the post-mortem reveals.**
   > **🛑 PROPOSE — NEVER SELF-RECORD (Rules 72 / 93).** You do **not** edit `CLAUDE.md`, you do **not**
   > edit a rule file, and you do **not** add a check to `06-DEFECT-PREP.md` yourself. You state what
   > you found, what you think should change and why, and you **wait**. The main session records it.
5. **Known starting points from the repo, to be confirmed against the real comments, not trusted:**
   **SV-8843** and **SV-8847** were closed **OBSOLETE** and still reproduced byte-identically ·
   **SV-8821** was closed after the QA lead used different test data (the real variable turned out to be
   a **missing contact person**, not the canned line) · **SV-8851** had a fix ship while it stayed Open ·
   **SV-8818** lost an attachment to a REST description edit. **These are leads, not findings.**

**Then, and only then, ask which project to execute — and wait.**

---

## 2. READ THESE FIRST, IN THIS ORDER

| # | File | Why / which parts |
|---|---|---|
| 1 | `build/skills/16-TEST-EXECUTION-AND-DEFECTS.md` | **Your router.** The reading list and the hard gates |
| 2 | `build/skills/00-COMMON-CORE.md` | **All of it once.** Non-negotiable: **§16.0 finality (the branches are NOT final)** · **§3.3 the ampersand paging trap** · **§3.4 echo fields on run results** · **§4.1 union-only run sync, and never write a result to another tester's run** · §11.4 what a blocker actually blocks · the honesty bar · secrets |
| 3 | `build/skills/09-TEST-EXECUTION.md` | **The execution procedure**, end to end |
| 4 | `build/skills/03-RUN-CHECK.md` | **Before any result is recorded** — runnability, **probes that cannot fail**, ruling out your own harness, §6 deploy invalidation, §7 not-yet-built |
| 5 | `build/skills/06-DEFECT-PREP.md` | **The ADMISSIBILITY GATE (A1–A10)** first, then the 2026-08-17 checklist, the eight-item bar, the screenshot/layman standard, the seven-section format, the pack — **and stop at the button** |
| 6 | `build/skills/04-TESTER-READY.md` | **§6 / §6.1** — the `Defects-for-Testers` workbook, if anything goes to a manual tester |
| 7 | `build/skills/13-CROSS-SESSION-SAFETY.md` | **Before your first write** — Rules 82–87 as commands |
| 8 | `build/skills/14-ACCESS-RESILIENCE.md` | **Before your first access call** — Rule 89, and the five MCP-hygiene hard rules |
| 9 | `build/skills/15-NEW-PROJECT-INTAKE.md` | **The moment the QA lead NAMES a project** — Rules 92/93, including the **REVIVAL** path |

**Rule texts:** `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-97.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 3. THE NON-NEGOTIABLE RULES FOR THIS LANE

- **A CASE THAT WAS NOT ACTUALLY EXECUTED IS NEVER MARKED PASSED.** Untested is honest. A false
  Passed is a lie someone ships on. **Rule 12: verified means observed, never inferred.**
- **THE EXPECTATION COMES FROM THE DOCUMENT, NEVER FROM THE BUILD (Rule 57).** From the build we take
  exactly two things: **the on-screen labels, and the pass/fail verdict.** If the build differs, the
  case **keeps** the documented expectation and it becomes a deviation.
- **THE BRANCHES ARE NOT FINAL UNTIL RELEASE DAY** (§16.0 / Rule 91). **Verdicts are PROVISIONAL**, a
  gap is **possibly-unfinished** rather than automatically a defect, and Rules 49/60 are in force.
  Everything goes in `RECHECK-QUEUE.md`.
- **FRONT END BLOCKS + BACK END ALLOWS = A PASSED CASE, NEVER A BUG (Rule 24).** The inverse — the
  front end **exposing** what the back end blocks — **is** a defect.
- **BLOCKED: NEVER SKIP, NEVER GUESS — BUT BLOCKED IS DISCIPLINED (Rule 68).** Decompose what the
  blocker actually blocks, prove it real and total, check it is not self-serviceable first (**a data
  state or a login is NEVER a blocker — seed it, log in as the role**, Rules 14/74), and **state the
  residual: "Blocked for X. Still possible under it: Y. Genuinely impossible until X clears: Z."**
  **The tell that this was skipped: a blocked item whose reason is a person's name.**
- **RESULTS ARE HELD LOCALLY BY DEFAULT.** Core §4.1: **never write a result to another tester's run**;
  log only **Passed** to a run at all, and **only with permission**; keep Failed / Retest / Blocked
  local. **Runs 352 / 357 / 359 belong to other testers.**
- **`update_run` REPLACES the selection — a partial `case_ids` list DELETES the omitted tests AND
  THEIR GRADED RESULTS, unrecoverably.** Union only, snapshot first, and **step 0 is its own
  permission** — an `add_case` approval is **not** a sync approval.
- **NEVER BULK-READ; SCRIPT THE BULK WORK (Rule 88).** Never one tool call per case. Never
  `CLAUDE.md` end to end. Never `CLAUDE-FULL-ARCHIVE-2026-08-21.md`.
- **COMMIT AND PUSH AFTER EVERY STEP, PATH-SCOPED (Rule 29).** `git add -- <paths>`; **never
  `git add -A`**. **`python3 build/testing-tools/scan_secrets.py --staged` before every commit —
  exit 1 = REFUSE. Never claim a scan that did not run (Rule 82). THIS REPO IS PUBLIC.**
- **ALWAYS PAIR AN INTERNAL ID WITH ITS C-ID AND LINK (Rule 8)** — in files and in chat.
- **PROPOSE RULE AND SKILL CHANGES; NEVER SELF-RECORD THEM (Rules 72/93).**

---

## 4. HARD GATES — ASK FIRST, EVERY TIME

| Rule | You must ask before… |
|---|---|
| **6** | …any TestRail write — **for that write, that pass.** Permission to execute is not permission to write |
| **62** | …**any Jira ticket, PER ASK.** The **2026-08-10 hold is ACTIVE** (*"Do not create anything until my next order."*). It is **TEMPORARY with a lift condition — CHECK whether it lifted; assume neither way** |
| **51** | …anything API-related — **asked separately, every time**, even inside an approved batch |
| **71 / 65** | …changing a case TestRail flags **Automated**. If a pass did change one, **tell Vlad** |
| **38** | …touching a foreign case or ticket at all. **Report, never edit.** State ours N / live total M |
| **34** | …syncing a run. **Union only**, and its own permission |
| **80** | …re-running any verification: **state when it was last done and ASK.** A check within the last 3 builds / 3 source versions **still counts** (Rule 77), shown with its date |
| **81** | …spending quota on source verification. Make the source current **first**, but **ask** |
| **11** | …choosing a process on a new or updated source. **ASK which one to run** |
| **1** | …starting on a half-spec. **Stop and ask** for the missing inputs |

---

## 5. WHAT YOU WILL BE GIVEN, AND WHAT YOU MUST NOT ASSUME

**You are given: a project name, and nothing else, until you ask.** The active runs in Rule-47 scope
as of 2026-08-21 are **Filters 352 · Schedule 357 · Report Suite 359** — `grep -n 'Active test runs'
CLAUDE.md` to re-read them, **because they move**.

**Do NOT assume:**

- …that the project index in `CLAUDE.md` is current. **A GREEN source badge means the last CHECK was
  recent, NOT that the source is current** — every project's spec page had in fact moved since its
  last check as of 2026-08-21.
- …that a run's case selection matches the suite. **Frozen selections have made reviewers see coverage
  gaps that did not exist.** Measure coverage against **the case suite under our group**, never against
  someone else's run selection.
- …that a ticket's status tells you anything about the build. **It does not** (SV-8851).
- …that the QA branch is up. `sv8582` returned **HTTP 502**; every stored ShopView cookie returned
  **HTTP 401** as of 2026-08-21. **Run the Rule-89 access preflight first** and follow the unattended
  **BLOCKED** protocol if a path is down.

---

## 6. MISSING INPUTS TO REQUEST BEFORE STARTING

Ask for these **up front**, in one message, and **wait** (Rule 1):

1. **Which project**, and **which run** you are to execute (Rule 2 / Rule 92).
2. **Whether the Jira creation hold has lifted** (Rule 62) — and if it has, that permission is still
   **per ticket**.
3. **Whether you may write results to the run at all**, and to whose run (Rule 6 + core §4.1).
4. **Whether to spend quota on source verification first** (Rule 81), given the last-checked date.
5. **Which environment/branch** to execute against, and **working credentials** (Rule 89 — the stored
   ShopView cookies were 401 as of 2026-08-21). **Secrets go to `/tmp`, `chmod 600`, never committed.**
6. **The role(s) and any seeded data** you are authorised to create — and confirmation you may **reset
   roles to template** on the shared org first (Rule 26).
7. **Your lock claim** (Rule 83) and **your budget** (Rule 90 — one lane share, 25 %).

---

## 7. DEFINITION OF DONE FOR THIS LANE

- **`REFUSAL-POSTMORTEM-<date>.md` exists and every refusal reason in it is QUOTED FROM JIRA**, not
  reconstructed. Rows that could not be read are marked **NOT VERIFIED** with the reason.
- The **build marker is captured at pass start and pass end** and **proved unchanged**, or the change
  is recorded with the split point and what `03` §6 says it invalidates.
- **Every case in scope carries a definite outcome** — Passed · Failed · Blocked (decomposed, with its
  residual) · Untested (with the written reason). **Zero silently skipped, zero inferred.** Counted two
  independent ways that agree.
- The **honest split is stated in numbers**, never as a banner: *"N of M executed on build `<marker>`;
  the remaining M−N carry their last recorded check."*
- **Every Failed case was reproduced TWICE** on a proved-unchanged marker (gate check A1), or is
  recorded as an **intermittent observation** rather than a defect.
- **Every candidate defect has a committed `DEFECT-CANDIDATE-<id>.md`** with **A1–A10 filled in, the
  six refusals argued, and a VERDICT** — **including the ones that FAILED the gate**, which are
  recorded in `NOT-FILED.md` with where the finding went instead.
- **Nothing is filed.** Every admissible candidate is prepared to the button and put to the QA lead
  **one at a time**.
- A dated **`RECHECK-QUEUE.md`** exists (Rule 49) with the re-check obligation and trigger per row.
- If a run write was authorised: **snapshot taken and committed first**, union verified both
  directions, **every prior result present by id** with no graded field changed, `include_all` state
  recorded, and a **per-operation audit log** (operation · C-ID · HTTP status · verification result).
  ***"200 OK" alone is non-compliant.***
- The environment is **left clean**: throwaway data named `ZZAUTOTEST` and deleted, roles restored to
  template, settings restored and **proven byte-identical**.
- Everything **committed and pushed**; **no credential ever committed**.

**Deliverables:** `build/defect-lane/REFUSAL-POSTMORTEM-<date>.md` ·
`build/<project>/execution-<date>/` (`EXECUTION-LOG.md` · `RESULTS.md` · `BLOCKED.md` ·
`DEFERRED-RUN.md` · `RECHECK-QUEUE.md` · `evidence/`) ·
`build/<project>/defect-pack-<date>/` (`DEFECT-CANDIDATE-<id>.md` per finding ·
`TICKET-<n>-<short-name>.md` for admissible ones · `DUPLICATE-SEARCH.md` · `API-SPLIT.md` ·
`CASE-IMPACT.md` · `NOT-FILED.md` · `evidence/`).

---

## 8. HOW TO REPORT BACK

Plain layman words, action-first, simple status format (Rule 70), these headings:

- **What I did**
- **What I found** — every finding with **the source quoted verbatim** and the case named as internal
  ID + **C-ID + link** (Rule 8). **Numbers, not banners.**
- **The candidates** — one table row each: what it is in plain words · its **gate verdict** · the
  refusal it survives least comfortably · **our recommendation.** **Present them one at a time for
  approval; never as a batch to be waved through.**
- **What needs to be done** — a plain next step for **every** Failed and Blocked row, in words a
  non-technical QA can act on. **Never a bare status.**
- **Other actions**
- **PROPOSED (Rules 72/93)** — any gate check, rule or skill change the post-mortem suggests. **Stated
  as a proposal, never recorded by you.**
- **OUTSTANDING — what I need from you** — **always present**; *"nothing outstanding"* if true. Sweep
  all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
  access/credentials · deferred or HELD decisions · what another team owes. For anything blocked on the
  QA lead himself, give the five **Rule-48** fields: his ruling **quoted verbatim** · when he gave it
  and what question it answered · the named cases it blocks (internal ID + C-ID + link) · why it was
  reasonable or what has changed since · the one thing that would unblock it, and from whom.

Always **state the TestRail write status explicitly**, even when it is *"nothing pushed"*, and always
**name the build marker the results rest on**.

**🔑 EVERY VERIFICATION CLAIM CARRIES A RULE-91 FRESHNESS BADGE AND ITS DATE** — in the report, in
every table, and in every workbook: **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never
build-verified**. **A bare tick is non-compliant.** Tool:
`build/testing-tools/verification_badge.py` (requires `--today`).

---

## LANE BOUNDARIES — what this session does NOT do

| Not this | Whose lane |
|---|---|
| **Author new test cases** | Handoff 1 / router `10` → skills `00` · `02` · `01` |
| **Run a VIU wording pass**, or change what a case *expects* | Handoff 3 / router `12` |
| **Produce the observed-verdict build-verification deliverable** | Handoff 2 / router `11` |
| **File a Jira ticket** | **Nobody, while the hold stands.** Then the QA lead, per ask, one at a time |
| **Record a rule or skill change** | **The main session.** You **PROPOSE** (Rules 72/93) |

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83).** A wording error, a missing case, a
source conflict or a foreign edit you notice while executing is **written up and handed back** — never
actioned in place, and never an excuse to enter another lane's territory.

**The main session stays the brain.** It holds the cross-project state; it is the only session that
consolidates that picture. Durable learnings go back through it so the shared brain and the other three
lanes pick them up.

---

## ACCESS + QUOTA (Standing Rules 89 & 90)

- **Run the access preflight BEFORE the first call** (`14-ACCESS-RESILIENCE.md`): a working path to
  **TestRail · Jira · ShopView · Confluence · Figma**. Known-bad as of 2026-08-21: every stored
  ShopView cookie → **HTTP 401**; the `sv8582` QA host → **HTTP 502**.
- **The five MCP-hygiene hard rules apply — above all: NEVER edit or "repair" shared MCP config to fix
  a connection.** Follow the unattended **BLOCKED** protocol and report.
- **The Rule-90 budget is now clause 10 of the TOKEN DISCIPLINE CHARTER** — read the mandatory
  **TOKEN DISCIPLINE CHARTER (Rule 95)** section below; it carries all twelve clauses in full.

---

## TOKEN DISCIPLINE CHARTER (mandatory — Rule 95)

**This section is MANDATORY in every handoff and binds this session from its FIRST TURN.** Canonical
copy: [`../skills/TOKEN-DISCIPLINE-CHARTER.md`](../skills/TOKEN-DISCIPLINE-CHARTER.md). Full rule text:
`build/rules/RULES-61-97.md` (Rule 95, tying Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90). The
twelve clauses are reproduced **in full below** so you never have to open another file to get them.

> **THE QA LEAD, 2026-08-21, VERBATIM:** *"Also make sure that this session is smartest one about token
> usage as I do not want once again the weekly tokens to be burnt at the start of the week. Make it a
> general rule for all the sessions we create and the hand offs we create for new sessions"*

**WHY:** the weekly pool was nearly exhausted **in a single day**, through **poll-by-spawn status
checks, one tool call per case, bulk reads, autocompact thrash and redundant re-verification** — **none
of which produced any quality.**

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan**. For
   anything large, **declare an INTENDED SPEND** in your first reply. Then begin. One pass, then exit.
2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSVs, API dumps, spec bodies or large files
   into context. **Script it to a file, read a bounded summary.** Inspect with `wc -l` / `head -n 20` /
   `grep -c` / `grep -n` / bounded `sed -n 'A,Bp'`. **Never read CLAUDE.md end-to-end** (it is an index)
   and **never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.
3. **THE READING RULE.** The startup list is **for startup**; afterwards consult **anything the task
   needs**, always **targeted and bounded**. **Knowledge is never off-limits; only BULK reading is.**
   Not reading a rule you are about to apply is worse than the tokens it would have cost.
4. **SPAWN DISCIPLINE (76 / 88).** An **ORCHESTRATOR** (no file tools) minimises spawns and **batches
   ruthlessly** — every spawn re-loads the project context, **observed at 200–380 k tokens each**. A
   **LANE SESSION** (direct tools) **does the work itself** and does **NOT** spawn for anything it can
   do directly. **Never spawn for a trivial check.**
5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a
   **checkpoint file**, plus a **committer loop gated on a RUN-FLAG FILE** — **never `pgrep -f
   <scriptname>`** (it self-matches and never exits). Progress is **SELF-REPORTED IN COMMIT MESSAGES**.
   **Launch and exit**; verify later in one short pass.
6. **BATCH WRITES.** One **scripted run with a per-op log** (operation · C-id · HTTP status ·
   verification result) — **never one tool call per case**. *"200 OK"* alone is non-compliant (50).
7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the **next substantive task**; keep a
   **pending-cheap-checks list**. **Never spend a dedicated spawn on one.**
8. **NEVER RE-DO WORK (77 / 80).** Before any verification / VIU / ordered task, **STATE when it was
   last done** (date + build marker / spec version) and **ASK before re-running**. A check within the
   **last 3 builds or 3 source versions still COUNTS**, shown with its date and badge (91).
9. **ANSWER IN TEXT** when a tool call is not needed — a reflexive tool call every turn is a trap.
10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 %
    reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At
    **50 % of your own budget**, compare spend against work completed and **STOP AND REPORT if spend is
    outpacing progress** — never grind to zero. **Never consume the reserve** without his say-so.
11. **THE WEEK-START GUARD.** The pool resets weekly and was once **nearly exhausted in ONE DAY**. **No
    lane may spend more than its weekly allocation in the first 48 hours of the week** without explicit
    approval. **A task that will exceed its declared intended spend STOPS and reports.**
12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may justify **sampling instead of full
    coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate**. **The
    savings come from HOW the work is executed** — scripts, batching, no polling, no re-doing — **never
    from doing less of it or doing it less rigorously.** If cheap and correct conflict, **correct wins
    and you report the cost.**
