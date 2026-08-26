# SKILL 16 — TEST EXECUTION & DEFECT REPORTING lane · **ROUTER**

> **🔴 THIS FILE IS A ROUTER, NOT A SOURCE OF TRUTH.** It holds **no procedure**. The canonical
> procedure lives in the files listed in §2, and it is maintained **there only**. Created
> **2026-08-26** as a router from the outset, so it cannot acquire a second copy of anything: the
> lesson of `10`/`11`/`12`, which were full skills until 2026-08-21 and had already started to drift
> from the files they duplicated. **If you find guidance here that is not in §2's files, that is a bug
> in this file — report it.**

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
  `RULES-61-94.md`, a past findings or audit file. **No document is off-limits to you.**
- **BUT ALWAYS IN A TARGETED, BOUNDED WAY:** `grep -n` for the exact thing you need, or `sed -n
  '<start>,<end>p'` a bounded slice. **NEVER a bulk read "to get oriented" · NEVER a whole large
  file · NEVER `CLAUDE.md` end to end · NEVER `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md`.**
- **THE DISTINCTION, PLAINLY: KNOWLEDGE IS NEVER OFF-LIMITS; ONLY BULK READING IS.** Looking a recipe
  up is cheap and correct; swallowing a file to orient yourself is what burns the context.
- **AND THE SCOPE GATE ABOVE REMOVES YOUR WORK BACKLOG, NOT YOUR KNOWLEDGE.** Every rule, skill,
  playbook recipe and past lesson stays yours to use on the project you are given. The one thing you
  must not do is **adopt another project's open items as your own tasks**.

---

## 1 · MISSION AND BOUNDARIES

**MISSION:** for one named project — **execute the existing test cases against the running build,
record honest results with evidence, and prepare any defect it finds to the point where the QA lead
could press the button.**

**THE DELIVERABLE OF THIS LANE IS A SET OF ADMISSIBLE, EVIDENCED CANDIDATES HE CAN APPROVE ONE AT A
TIME — NOT A PILE OF FILED TICKETS (Standing Rule 94).** Ten candidates he can walk through is a good
pass; ten filed tickets, six of which come back refused as *"irrelevant"* or *"obsolete"*, is a bad
pass **even if four were right** — the four are discredited by the six.

**THIS LANE MUST NOT:** author new test cases (skill `01`, lane `10`) · run a VIU wording pass or
change what a case *expects* (lane `12`) · create a Jira ticket (Rule 62 + the 2026-08-10 hold —
**check whether it has lifted**) · touch another author's cases (Rule 38) or a case TestRail flags
**Automated** (Rule 71) · write to TestRail without the QA lead's explicit go-ahead for that write,
that pass (Rule 6).

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83).** A wording error, a missing case, a
source conflict or a foreign edit noticed while executing is **recorded and reported** — it is not
actioned here, and this lane does not enter another lane's territory to fix it.

---

## 2 · READ THESE, IN THIS ORDER

| # | File | Why / which parts |
|---|---|---|
| 1 | `00-COMMON-CORE.md` | **All of it once**, then by its own routing table. Non-negotiable: **§16.0 finality (the branches are NOT final)** · **§3.3 the ampersand paging trap** · **§3.4 echo fields on run results** · **§4.1 union-only run sync + never write a result to another tester's run** · §11.4 what a blocker actually blocks · the honesty bar · secrets |
| 2 | `09-TEST-EXECUTION.md` | **The execution procedure itself**, end to end — picking the run in Rule-47 scope, pinning the build marker at start AND end, batched execution, per-case evidence, the **honest-status rules**, disciplined **Blocked**, the retest loop, union-only run sync, the deliverable |
| 3 | `03-RUN-CHECK.md` | **Before any result is recorded** — the runnability test, **probes that cannot fail**, ruling out our own harness, reading the interface correctly, FE-blocks/BE-allows, role resets, seeding, **§6 what a deploy invalidates**, **§7 the not-yet-built decision table** |
| 4 | `06-DEFECT-PREP.md` | **The moment anything Fails** — **the ADMISSIBILITY GATE (A1–A10, Rule 94)** first, then the 2026-08-17 checklist and the eight-item evidence bar, the annotated-screenshot and layman-ticket standard, the seven-section format, the prepared pack, and **stop at the button** |
| 5 | `04-TESTER-READY.md` | **§6 / §6.1** — the `Defects-for-Testers` workbook, if this pass hands anything to a manual tester |
| 6 | `13-CROSS-SESSION-SAFETY.md` | **Before the first write of this session** — Rules 82–87 as commands |
| 7 | `14-ACCESS-RESILIENCE.md` | **Before the first access call** — Rule 89 |

**Also, the moment the QA lead NAMES a project:** `15-NEW-PROJECT-INTAKE.md` (Rules 92/93) — the
required input set, the committed PRESENT/MISSING checklist, the source-currency block, and the
**REVIVAL** path.

**Source of expected behaviour when a case and the build disagree:** `02-SOURCE-CHECK.md` §1, and
**Rule 81 — source verification precedes build verification, and is never auto-run.**

---

## 3 · HARD GATES — pointers only, never restated here

| Rule | Gate |
|---|---|
| **6** | Nothing is written to TestRail without explicit permission — **for that write, that pass** |
| **11** | **ASK which process(es) to run** on any new or updated source |
| **24** | **Front end blocks + back end allows = a PASSED case, never a defect.** The inverse IS a defect |
| **25** | Every DEVIATION call cites the spec/ticket/story reference **and its VERBATIM wording** |
| **49 / 60** | **The branches are NOT final.** Verdicts are **PROVISIONAL**; a gap is possibly-unfinished; everything goes in the re-check queue |
| **51** | An API-related finding is asked about **separately, every time** — even inside an approved batch |
| **52** | `Story Defect`, parented to **the OWNING STORY** (an Epic parent → HTTP 400), plus the `relates to` link |
| **53** | Priority **`Medium`**. **`High` is barred** |
| **62** | **No Jira ticket without permission, asked PER ASK** — plus the 2026-08-10 "create nothing" hold: **check whether it has lifted** |
| **71** | An `Automated` case is not changed without asking (and Rule 65 — tell Vlad if a pass changed one) |
| **80** | State the last-done date, then **ASK** before re-running anything |
| **81** | **Source verification precedes** build verification — and is never auto-run |
| **83** | Lane ownership and write locks — claim the lock; cross-lane findings route back to the main session |
| **88** | **Never bulk-read. Script the bulk work, run it, read the SUMMARY** — never one tool call per case |
| **90** | Shared quota: main **15 %** · each lane **25 %** · **10 % reserve**. At **50 %** of your budget, compare spend against progress and **STOP AND REPORT** if spend is outpacing it. **Never touch the reserve** |
| **91** | Every verification claim carries a **freshness badge with its date**: **✅ ≤7 d · 🟠 8–14 d · 🔴 >14 d · ❌ never**. A bare tick is non-compliant. Tool: `build/testing-tools/verification_badge.py --today` |
| **94** | **THE DEFECT ADMISSIBILITY GATE** — no ticket is prepared past the gate until it passes **every** check; the lane's output is **approved candidates, not filed tickets** |

Full texts: `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-94.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 4 · ALSO MANDATORY FOR THIS SESSION

- **THE LANE'S FIRST TASK, BEFORE ANY TESTING: THE REFUSAL POST-MORTEM.** See
  `build/handoffs/HANDOFF-4-TEST-EXECUTION-AND-DEFECTS.md` §1. **Read the actual refusal comments in
  Jira — do not guess them.**
- **Rule 29 — commit and push after every step, path-scoped.** `git add -- <paths>`; **never
  `git add -A` / `git add .`**. **Run `python3 build/testing-tools/scan_secrets.py --staged` before
  every commit; exit 1 means REFUSE to commit, and never claim a scan that did not run** (Rule 82).
- **Rule 36 — every report ends with "OUTSTANDING — what I need from you"**, or *"nothing
  outstanding"*. Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current.
- **Rules 72 / 93 — PROPOSE rule and skill changes; never self-record them.** A lane session that
  believes a gate check is missing **proposes it to the QA lead** and waits.
- **🔴 TOKEN DISCIPLINE CHARTER (Rule 95) — MANDATORY, FROM YOUR FIRST TURN:**
  **[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md)**. Twelve clauses — strategy first (79),
  never bulk-read/script it (88), the reading rule, spawn discipline (76/88), never poll (75), batch
  writes, piggyback cheap checks (78), never re-do work (77/80), answer in text, the budget (90), the
  week-start guard, and **clause 12: quality is never the thing cut**. **This router holds no substance
  — read the charter itself.**
  Every handoff embeds the same twelve clauses in full. Rule text: `build/rules/RULES-61-95.md`.
