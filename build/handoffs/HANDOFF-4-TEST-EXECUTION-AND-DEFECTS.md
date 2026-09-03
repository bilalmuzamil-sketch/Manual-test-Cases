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
  `RULES-61-ONWARD.md`, a past findings or audit file. **No document is off-limits to you.**
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

## 1a. 🛑 "I CANNOT OBSERVE THIS ON THE BUILD" IS **NOT** "BLOCKED" — AND IT IS NOT A DEFECT EITHER

**READ THIS BEFORE §2. On 2026-08-31 a session parked 18 cases as "blocked" when every one of them had
a defined deliverable outcome already written down — and one of them had a full working recipe sitting
in `build/APP-ACTIONS-PLAYBOOK.md` the whole time.** In **this** lane the mistake is more expensive
than a stalled pass: **an unobserved thing recorded as Blocked is a wrong test result, and an
unobserved thing recorded as a defect is a refused ticket** — the exact failure this lane exists to
stop (*"irrelevant"*, *"obsolete"*).

**A result is a CONCLUSION, so pick the right outcome before you record one:**

| What you actually hit | The outcome that is already defined for it — NOT Blocked, NOT Failed |
|---|---|
| **Feature is not built yet** | **Rule 69** — `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`, the under-development line, a **`DEFERRED-RUN.md`** row. **A finished case**, not a blocker and **not a defect** (admissibility gate: *unfinished work* is refusal reason #1). Excluded from any ready-to-automate figure. (`03-RUN-CHECK.md` §7) |
| **A precondition *or a step* needs a CUSTOMER-PORTAL SCREEN** | The **staging-only HOLD** — the literal below. Judge it from the **preconditions AND the steps** (corrected 2026-09-03), never from the word "portal", and never park a portal **data state** that a seed can reach. (`00-COMMON-CORE.md` §5.0-b(2)) |
| **The source is ambiguous** | **Rule 58** — **hold the case and add a PO-question row.** An ambiguous source is **NEVER** resolved by looking at the build, and **you may not raise a defect against an expectation you had to interpret.** |
| **A data state you need does not exist** | **Rule 14 — SEED IT.** Pre-authorised, permanently, on a disposable environment (`00-COMMON-CORE.md` §5.0-b(1)). **Never NOT-VERIFIED, never Blocked, for a data state.** |
| **The feature is there but you cannot find the control** | **Rule 97 search drill** (playbook first — the **exact error text**) **+ Rule 26 role reset**: an action you cannot find may be **role-gated and simply not rendered** — check the gate before you call it absent. **A "missing control" filed as a defect without the role reset is a refused ticket.** Then the network tab, and grep the served JS bundle. |
| **It is genuinely your own unfinished work or a broken harness** | **Say so plainly — "MINE".** `03-RUN-CHECK.md` §8.0-a: **a check that fails is a statement about YOUR CHECK until you prove otherwise** — no probe that could not fire ever produces a Failed. |

**⇒ THE STAGING-ONLY CUSTOMER-PORTAL HOLD — a machine-findable literal, byte-exact, never reworded:**

```
AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch
```

**QA lead, 2026-08-31, verbatim: *"Customer portal related tickets can only be tested on staging and
not on the QA branch. We need to put this marker on such tickets aswell."*** **A label or behaviour
that lives on a portal surface will be reported "absent" by any QA-branch probe, forever** — so
without this marker it becomes a false Failed and then a refused ticket.

**⇒ THE SCOPING TEST — THREE PARTS, CORRECTED 2026-09-03. Full text: `00-COMMON-CORE.md` §5.0-b(2).**

> **⛔ SUPERSEDED 2026-09-03** (kept visible so a session mid-task on the old text sees it changed):
> *"SCOPE IT FROM THE PRECONDITIONS, NEVER FROM THE WORD 'PORTAL': only a case whose **preconditions**
> require a portal-generated artefact gets it."* **It read the preconditions only** — a 2026-09-03
> assessment of 11 candidates found four cases it misses.

**(1) READ THE PRECONDITIONS *AND* THE STEPS** — if **either** puts the tester on a **portal screen**,
the case cannot be executed on a QA branch and it carries the HOLD. **A precondition-only scan is not a
scan**, and a tester handed one of these walls immediately. Worked miss, 2026-09-03 — *the precondition
was silent and the step was not*: **C18671 / C18728** (sole step *"Open the invoice in the customer
portal before its due date."*) and **C18672 / C18729** (sole step *"Open the invoice in the customer
portal during the grace period (1–29 days overdue)."*) all have data-state preconditions that never
mention the portal (`build/testrail-writes/portal-candidates-2026-09-03/ASSESSMENT.md`).

**(2) NEVER SCOPE FROM THE WORD "PORTAL" ALONE — unchanged:**
**a case verifying the portal feature's ABSENCE on the shop-app
path is fully executable on the QA branch and must NOT be parked** (2026-08-31: C44954 is build
verified; **C44951 / C44952 / C45175** are staging-only and carry the HOLD). **C44947 is IN SCOPE** —
mis-parked with those three at first, then correctly reclassified because it is about the **payment
method name on the Payments rows (S8-R2), not the paid banner**, so it never needed the portal; it is
live at `AUTOMATION: READY`. **The id that looked portal-gated was not — which is why you never scope
from the word.** **Three cases carry the literal, not four**, measured live over the
whole estate: `build/testrail-writes/portal-hold-inventory-2026-08-31/INVENTORY.md`.
It is a **HOLD**, so the gate **READY + EXPECT-FAIL = total − HOLD** is unaffected.

**(3) 🆕 A PORTAL *SCREEN* IS NOT A PORTAL *DATA STATE*.** A case needing a **record created via the
portal** but asserting **only on shop-app screens** is a **data-state** case — **Rule 14 says a missing
data state is SEEDED, not parked**, so it does **NOT** automatically get the HOLD, and marking it
Blocked would be a false Blocked. Settle it by asking whether the seeding route is reachable with an
**ordinary session**; only if the state needs a **portal credential** is it a HOLD. Worked example
**C45245** (deposit *"created via `POST /api/external/customer-portal/deposits`"*, every assertion on
shop-app screens) — **and it is Vladimir Tomovic's, so it is HANDS-OFF whatever the verdict (Rule 38)**:
cited for the test, not as work to do.

**ONLY AFTER ALL OF THE ABOVE does anything earn the word "blocked"** — and the disciplined-Blocked
bullet in §3 (Rule 68) then applies in full: **"blocked" is a property of a QUESTION about a case, not
of the case. DECOMPOSE and STATE THE RESIDUAL.** Six checkable requirements: **`00-COMMON-CORE.md`
§11.4.** Canonical fuller treatment, including the positive-control gate and the MINE /
BLOCKED-PROVEN / BLOCKED-EVIDENCED / NOT-YET-PROVEN classification you must report counts for:
**`03-RUN-CHECK.md` §8.0-a** — read it, do not work from this table alone.

---

## 1b. 🔑 GETTING ONTO THE QA BRANCH — ONE COMMAND, THREE TRAPS, AND WHY A 409 IS NOT A BLOCKER

**Do not re-discover this and do not hand-assemble a session.** Canonical text:
**`build/APP-ACTIONS-PLAYBOOK.md` §A "THE AUTHENTIC QA-BRANCH LOGIN"** ·
**`build/skills/14-ACCESS-RESILIENCE.md` §3 + §3.1**. Proven live six consecutive times on `sv9315`
(build `v26.35.6-0f8d60b`, 2026-08-31/2026-09-02).

**THE ONE COMMAND**
```
source build/testing-tools/ensure_bridge.sh            # fresh MITM bridge; port rotates, never hard-code it
node build/testing-tools/qa-branch-boot.mjs <branch> <path> <admin|tech>
#  e.g.  node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin
```
The QA branch's sign-in screen carries a **`DEV MODE — QUICK LOGIN`** panel; the harness clicks it and
**the app logs itself in**, writing `localStorage` from the server's own response. **Nothing is
hand-minted, so the role and permissions are authentic** (Rules 12, 26).

**PREREQUISITES**
1. A **fresh MITM bridge** — Chromium cannot TLS through the egress proxy. `ensure_bridge.sh` launches
   `build/atlassian-login/bridge.mjs` and writes the port to `/tmp/atlassian/bridge-port.txt`.
2. **`sv_sso_session` ONLY**, as `sv_sso_session=<value>` in **`/tmp/qa-cookies/<branch>-sso.txt`**,
   **`chmod 600`**. `/tmp` only, **never committed** — this repo is public (Rule 82).
3. Playwright at `/opt/node22/lib/node_modules/playwright/index.js`.

**THE THREE TRAPS**
- **CARRY `sv_sso_session` ONLY — never `PHPSESSID`, never `cf_clearance`.** `PHPSESSID` is minted
  fresh by the login itself and a stale one you brought is the whole "409 Session has expired" latch;
  `cf_clearance` is inert here (app host = CloudFront, API host = bare nginx).
- **SCOPE COOKIES HOST-ONLY, NEVER `.qa.shopview.com`.** A parent-domain cookie collides with the
  host-only one the login sets — two same-name `PHPSESSID`s reach the API host, the server reads the
  stale one, and **`GET /api/auth/me/fe-permissions` answers 409 immediately after a 200 quick-login.**
  **Recognise that symptom: it is duplicate cookies, NOT a dead session and NOT a dead branch.**
- **`getByRole('button', {name:/^Admin$/})` does not match these Quasar `q-btn` elements** — use
  `button:has-text("Admin")`. And **judge the session by `fe_permissions.length` + `template_slug`,
  never by `role.name`.**

**🛑 EVICTION — THE OPERATING RULE (recorded 2026-09-02)**
Every quick-login **rotates that branch's `PHPSESSID`** (measured: seven rotations on `sv9315`), so
**two sessions on one QA branch will evict each other.** That is expected branch behaviour, not a
fault.
- **One session per QA branch (Rule 83 lane ownership).** Claim it before you drive it; if a branch
  must be shared, expect eviction and say so up front.
- **A mid-test 401 or 409 is NOT a blocker and NOT a reason to contact the QA lead — it is a re-boot.**
  Re-run the harness and carry on from the case you were on. Recovery is seconds. **Asking a human to
  log out so your session survives is the failure mode this block exists to eliminate.**
- **Never reuse a `PHPSESSID` you did not just mint, and never persist one between runs.**
- **Escalate only if `sv_sso_session` itself is refused** (true ~24 h expiry, or a deploy) — that one
  only the QA lead can re-mint. Re-read the build marker after any re-boot: eviction and redeploy look
  identical from the inside.

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

**Rule texts:** `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-ONWARD.md`.
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
  **⚠️ AND READ IT WITH §1a — "blocked" is what is LEFT OVER after the defined outcomes are ruled
  out, never the default for anything you did not observe.**
- **A CASE YOU COULD NOT RUN BECAUSE THE FEATURE IS NOT BUILT YET IS A FINISHED CASE (Rule 69), NOT A
  BLOCKER AND NOT A DEFECT.** It keeps its **documented** expectation, carries
  **`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`** with the date you
  checked, gets the under-development line and a **`DEFERRED-RUN.md`** row, and is **excluded from any
  ready-to-automate figure**. Procedure: `03-RUN-CHECK.md` §7. **Filing unfinished work as a defect is
  refusal reason #1** (Rule 94).
- **AN AMBIGUOUS SOURCE IS NEVER RESOLVED FROM THE BUILD (Rule 58).** The deliverable is a **HELD case
  plus a PO-question row**, not a blocker and never a ticket — **a defect raised against an
  expectation you had to interpret cannot clear the admissibility gate.**
- **AN ACTION YOU CANNOT FIND MAY BE ROLE-GATED AND SIMPLY NOT RENDERED (Rule 26).** Reset roles to
  template **before** any permission-dependent execution, and **check the gate before you call a
  control absent** — a "missing control" reported without the role reset is a refused ticket.
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

## 3a. THE NAVIGATION MAP — READ IT BEFORE YOU NAVIGATE, APPEND AS YOU GO

Before you go looking for a screen a case's steps name, open **`build/<project>/NAVIGATION-MAP.md`**;
if the project has no map, create it from **`build/NAVIGATION-MAP-TEMPLATE.md`**. Full convention:
**`build/skills/03-RUN-CHECK.md` §9** — read it there rather than working from this summary.

- **Read it FIRST** (Rule 27 — reuse the recorded recipe, never re-discover), and **append the moment a
  path is confirmed**, in the same pass, not as a later cleanup (Rule 93).
- **Only paths navigated successfully and observed live go in** (Rule 12). **Never infer one from
  product source code, a spec, a design or another branch** (Rule 57).
- **Navigation only.** A map entry is **never** cited in a case's Expected Results or provenance line,
  and it is **never evidence that the feature works** — the pass/fail verdict still comes from
  observing the feature itself (Rules 12 / 57).
- **Rows are branch-specific** and carry the **Rule 91 badge with the date** (✅ ≤7 d · 🟠 8–14 d ·
  🔴 >14 d · ❌ never observed); a stale row is a starting point — if it fails, re-observe and correct
  it in the same pass.

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

## SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)

**This section is MANDATORY in every handoff.** Full rule text: `build/rules/RULES-61-ONWARD.md` (Rule 97,
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

**🔴 SEARCH THE CANONICAL BRANCH, NOT ONLY YOUR OWN (added 2026-08-28, same cause).** The workspace's
shared knowledge lives on **`origin/claude/slack-session-0sxnd9`**. If you are on a different branch you
do **NOT** need to check it out — read straight from the remote ref:

```
git ls-tree -r --name-only origin/claude/slack-session-0sxnd9 | grep -E 'skills/|rules/|BLOCKED|PLAYBOOK'
git show origin/claude/slack-session-0sxnd9:<path> | grep -n "<what you need>"
git show origin/claude/slack-session-0sxnd9:<path> | sed -n '1,80p'
git grep -n "<exact error text>" origin/claude/slack-session-0sxnd9 -- build/ | head -20
```

**"NOT ON THIS BRANCH" IS NEVER A VALID REASON TO CONCLUDE SOMETHING DOES NOT EXIST — check the
canonical branch before saying anything is missing.** On 2026-08-28 a session on another branch
reported `build/skills/14-ACCESS-RESILIENCE.md`, `build/rules/RULES-*.md` and the `build/BLOCKED-*.md`
files as absent; all of them existed on the canonical branch at that moment.

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
thing is still blocked; open it and read what happened next. `git log --all --grep=` reaches work that
landed on another session's branch and is not yet in the document you are reading.

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

## TOKEN DISCIPLINE CHARTER (mandatory — Rule 95)

**This section is MANDATORY in every handoff and binds this session from its FIRST TURN.** Canonical
copy: [`../skills/TOKEN-DISCIPLINE-CHARTER.md`](../skills/TOKEN-DISCIPLINE-CHARTER.md). Full rule text:
`build/rules/RULES-61-ONWARD.md` (Rule 95, tying Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90). The
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
