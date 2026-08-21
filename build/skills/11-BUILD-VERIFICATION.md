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
| 3 | `03-RUN-CHECK.md` | **The procedure itself**, end to end — the pass-start build-marker checklist (**read it again at the end and state whether it moved**), driving cases live, §6.1 the bug-fix-deploy amendment, §6.3/§6.4 markers and the automated-case hand-off, the Rule-49 re-check queue, roles and `reset to template` |
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

Full texts: `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-91.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 4 · ALSO MANDATORY FOR THIS SESSION

- **`14-ACCESS-RESILIENCE.md`** — read **before the first access call** (Rule 89). This lane hits it
  hardest: **`401 sso_required` means dead cookies OR a deploy — check the build marker FIRST.** Also
  the **five MCP-hygiene hard rules** (**never edit or "repair" shared MCP config**) and the
  unattended **BLOCKED** protocol: commit `BLOCKED-<system>.md`, keep working on what is not blocked,
  **never fabricate a result**.
- **`13-CROSS-SESSION-SAFETY.md`** — Rules 82–87: the real secret-scan gate, lane write locks, the
  tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots.
- **Rule 88** — never bulk-read; script bulk work to a file and read a bounded summary; batch writes;
  Rule-75 detached pattern for long jobs; no subagents for work you can do directly.
- **Rule 90** — one shared quota: main **15 %** · each lane **25 %** · **10 % reserve**. Report your
  spend; **STOP AND REPORT at 50 %** if spend outpaces progress; **never touch the reserve**.
- **Rule 91 — this lane's own output rule.** Every build-verification claim is reported with a
  **freshness badge and its date**: **✅ ≤ 7 days · 🟠 8–14 days · 🔴 > 14 days · ❌ never
  build-verified**, with the build marker. **A bare tick is non-compliant** (Rule 12). Rule 91 is
  **visibility**; Rule 77 is **validity** — a case inside Rule 77's 3-build window may still show 🟠
  or 🔴, and that is intended. Tool: `build/testing-tools/verification_badge.py` (requires `--today`).
