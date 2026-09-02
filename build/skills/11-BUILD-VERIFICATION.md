# SKILL 11 — BUILD-VERIFICATION lane · **ROUTER**

> **🔴 THIS FILE IS A ROUTER, NOT A SOURCE OF TRUTH.** It holds **no procedure**. The canonical
> procedure lives in the files listed in §2, and it is maintained **there only**. Converted from a
> full 317-line skill on **2026-08-21** because it duplicated `03` + `02` + `04` and duplicated
> content drifts: its build-marker discipline was already a second copy of `03` §"pass-start
> checklist". **Its unique content was migrated first, not dropped** — the `Defects-for-Testers`
> workbook specification is now `04-TESTER-READY.md` §6.1, and the `API-ASK.md` naming fact is now a
> note in `06-DEFECT-PREP.md`. **If you find guidance here that is not in §2's files, that is a bug in
> this file — report it.**

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
  `RULES-61-99.md`, a past findings or audit file. **No document is off-limits to you.**
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

**MISSION:** verify **existing** cases against the **running build** for one named project — capture
the build marker, drive the cases live, record a verdict per case with its evidence, and queue what
could not be observed.

**FROM THE BUILD WE TAKE EXACTLY TWO THINGS (Rule 57):** the **on-screen labels and navigation path**,
and the **pass / fail / deviation verdict**. **NOTHING ELSE.**

**🛑 THE LINE THIS LANE MUST NEVER CROSS: THE BUILD IS NOT A SOURCE OF EXPECTED BEHAVIOUR.** If the
build differs from the documented expectation, **the case KEEPS the documented expectation** and
becomes a **deviation**. Never the reverse. A closed ticket is not a spec change (Rule 61). An
ambiguous source is **never** resolved by looking at the build (Rule 58) — hold it and ask.

**THIS LANE MUST NOT:** author new cases (skill `01`) · **rewrite an expectation** to match what
shipped (Rules 25 / 57 / 58) · create a Jira ticket (Rule 62 + the 2026-08-10 hold — **check whether
it has lifted**) · touch another author's cases (Rule 38) or an `Automated` case without asking
(Rule 71) · write to TestRail without the QA lead's explicit go-ahead (Rule 6).

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83)** — a stale source, a coverage gap, a
broken run or a foreign edit is **recorded and reported**, not actioned here.

---

## 2 · READ THESE, IN THIS ORDER

| # | File | Why / which parts |
|---|---|---|
| 1 | `00-COMMON-CORE.md` | **All of it once**, then by its routing table. Non-negotiable: **§16.0 finality — the branches are NOT final, so findings are PROVISIONAL and a gap is possibly-unfinished** · §14 the provenance line · §15 the marker · §17 the fact sheet · Rule 77's validity window · TestRail write discipline · access + environment · secrets |
| 2 | `02-SOURCE-CHECK.md` | **§1 first** — the source must be current **before** the build is touched (Rule 81) |
| 3 | `03-RUN-CHECK.md` | **The procedure itself**, end to end — the pass-start build-marker checklist (**read it again at the end and state whether it moved**), driving cases live, §6.1 the bug-fix-deploy amendment, §6.3/§6.4 markers and the automated-case hand-off, the Rule-49 re-check queue, roles and `reset to template` · **AND DO NOT STOP AT §6.4 — READ ON THROUGH §7, §8.0-a AND §8, WHICH IS WHERE THE OUTCOME VOCABULARY LIVES:** **§7** Rule 69 not-yet-built cases (§7.2 decision table · §7.3 the under-development line · §7.4 `DEFERRED-RUN.md` · **§7.5 the staging-only customer-portal HOLD**) · **§8.0-a** a check that fails is a statement about YOUR check until proven otherwise · **§8** Rule 74, no present feature left un-build-verified (§8.2 seed it / log in · §8.4 the only permitted un-verified state · §8.5 the hard checklist gate) |
| 4 | `04-TESTER-READY.md` | **§6 + §6.1** — the tester brief and the **`Defects-for-Testers` workbook**, which is this lane's primary deliverable |
| 5 | `06-DEFECT-PREP.md` | For every deviation: prepare the pack, **the API reachability test**, and **stop at the button** |

---

## 3 · HARD GATES — pointers only, never restated here

| Rule | Gate |
|---|---|
| **6** | Nothing is written to TestRail without explicit permission |
| **62** | **No Jira ticket without permission, PER ASK** — plus the 2026-08-10 hold: **check whether it has lifted** |
| **71** | An `Automated` case is not changed without asking — **and tell Vlad** (Rule 65) |
| **51** | An API-related finding is asked about **separately, every time** |
| **80** | State the last-done date **and the build**, then **ASK** before re-running |
| **81** | **Source verification precedes** build verification — and is never auto-run |
| **11** | **ASK which process(es) to run** |
| **22** | Ask for the **live-build check and the access** up front, not when you hit the wall |

Full texts: `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-99.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 4 · ALSO MANDATORY FOR THIS SESSION

- **`15-NEW-PROJECT-INTAKE.md`** — **read it the moment the QA lead NAMES a project** (Rules 92/93):
  the required input set, the committed PRESENT/MISSING intake checklist, the source-currency block, the
  scaffolding pointer, and the **REVIVAL** path — an existing project starts as a RECONCILIATION of its
  cases against the current sources, never a fresh authoring run.
- **`14-ACCESS-RESILIENCE.md`** — read **before the first access call** (Rule 89). This lane hits it
  hardest: **`401 sso_required` means dead cookies OR a deploy — check the build marker FIRST.** Also
  the **five MCP-hygiene hard rules** (**never edit or "repair" shared MCP config**) and the
  unattended **BLOCKED** protocol: commit `BLOCKED-<system>.md`, keep working on what is not blocked,
  **never fabricate a result**.
- **`13-CROSS-SESSION-SAFETY.md`** — Rules 82–87: the real secret-scan gate, lane write locks, the
  tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots.
- **🔴 TOKEN DISCIPLINE CHARTER (Rule 95) — MANDATORY, FROM YOUR FIRST TURN:**
  **[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md)**. Twelve clauses — strategy first (79),
  never bulk-read/script it (88), the reading rule, spawn discipline (76/88), never poll (75), batch
  writes, piggyback cheap checks (78), never re-do work (77/80), answer in text, the budget (90), the
  week-start guard, and **clause 12: quality is never the thing cut**. **This router holds no substance
  — read the charter itself; it supersedes the Rule 88 / Rule 90 lines this section used to carry.**
  Every handoff embeds the same twelve clauses in full. Rule text: `build/rules/RULES-61-99.md`.
- **🔴 SEARCH BEFORE YOU GIVE UP (Rule 97) — POINTER ONLY; the full drill is INLINE in every handoff.**
  **Before reporting anything as impossible, blocked, unavailable or unreconstructable, GREP THIS
  WORKSPACE using the EXACT ERROR TEXT** — that is what finds it. Four places, in order:
  `build/APP-ACTIONS-PLAYBOOK.md` · `14-ACCESS-RESILIENCE.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`
  · `build/rules/RULES-*.md` (grep, never read whole). Also `ls build/BLOCKED-*.md` — **several are
  marked RESOLVED with the cause** — and `git log --all --grep=`. Still not found ⇒ **report the
  searches you ran**, so the gap is known to be real rather than unsearched. **Solve something new ⇒
  write it into the playbook or the skill IN THE SAME PASS** (Rule 93). Full text with the five real
  2026-08-28 false blockers: `build/rules/RULES-61-99.md` (Rule 97).
- **Rule 91 — this lane's own output rule.** Every build-verification claim is reported with a
  **freshness badge and its date**: **✅ ≤ 7 days · 🟠 8–14 days · 🔴 > 14 days · ❌ never
  build-verified**, with the build marker. **A bare tick is non-compliant** (Rule 12). Rule 91 is
  **visibility**; Rule 77 is **validity** — a case inside Rule 77's 3-build window may still show 🟠
  or 🔴, and that is intended. Tool: `build/testing-tools/verification_badge.py` (requires `--today`).


---

## 🔴 THE LANE IS NOT FINISHED UNTIL EVERY CASE IS RUNNABLE (QA lead, 2026-09-01)

Build verification has **two** deliverables of equal standing, not one:

1. **The verdicts** — observed live, with evidence (Rules 12/13).
2. **RUNNABILITY** — every case in the suite carries preconditions and steps a manual tester can
   follow from the UI. Not only the cases verified this run: **every case in the suite.**

> QA lead, verbatim: *"ONE of the major part of build verification is TO make the steps of
> replication and preconditions RUNNABLE and not to keep those test cases the spec level test
> cases. Make sure you do never fail in that part and this thing never bites me."*

**Before reporting a suite done, run the gate and drive it to zero:**

```
python3 build/testing-tools/check_runnable_cases.py --section-prefix "Invoice Refresh (Aug 2026)"
```

It reads TestRail live and exits 1 while any case is still spec-level. A green verdict table on top
of spec-level steps is an unfinished lane, and it is the failure the QA lead has now called out
twice. Procedure and calibration: `build/skills/18-LAYMAN-UI-STEPS.md`.
