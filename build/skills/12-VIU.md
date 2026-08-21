# SKILL 12 — VIU lane · **ROUTER**

> **🔴 THIS FILE IS A ROUTER, NOT A SOURCE OF TRUTH.** It holds **no procedure**. The canonical
> procedure lives in the files listed in §2, and it is maintained **there only**. Converted from a
> full 309-line skill on **2026-08-21** because it duplicated `03` + `01` + `04`, and its §4 was a
> second copy of `00`'s Rule-50 write discipline — the exact material that must never exist twice,
> since a drifted copy of a write rule is how a batch proceeds past a mismatch. **Its unique content
> was migrated first, not dropped** (the `API-ASK.md` naming fact is now a note in
> `06-DEFECT-PREP.md`). **If you find guidance here that is not in §2's files, that is a bug in this
> file — report it.**

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

**MISSION:** run the full **build-accurate wording + Verify-In-UI** pass on an existing suite —
capture the real on-screen labels live, correct every case's title / preconditions / steps / expected
so a non-technical tester can actually follow it, verify behaviour live with evidence, and (if
authorised) push with per-case byte verification.

**🛑 WHAT "VIU" MEANS AND WHAT IT DOES NOT.** The QA lead's own correction, verbatim: *"'the case
should be matched to the build' … meant that the test case should be VIU'd from the build"*. So VIU
corrects **the LABELS, the step order and the navigation path**. **IT HAS NEVER MEANT REWRITING WHAT
THE CASE EXPECTS.** In one line: **if the expected behaviour bends to whatever shipped, the case can
no longer fail, and a test that cannot fail is not a test.**

**THIS LANE MUST NOT:** **change an expectation** to match the build (Rules 25 / 57) — the repair
for an unsourced assertion is **removal or scope-conditional wording** (Rule 42), **never
substitution** · resolve an ambiguous source by looking at the build (Rule 58 — hold it and ask) ·
author new cases (skill `01`) · file a Jira ticket (Rule 62 + the 2026-08-10 hold) · touch another
author's cases (Rule 38) or an `Automated` case without asking (Rule 71) · write to TestRail without
the QA lead's explicit go-ahead (Rule 6).

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83)** — recorded and reported, not
actioned here.

---

## 2 · READ THESE, IN THIS ORDER

| # | File | Why / which parts |
|---|---|---|
| 1 | `00-COMMON-CORE.md` | **All of it once**, then by its routing table. Non-negotiable: **the Rule-50 write discipline and the TestRail hazards — including the omit-field re-render trap and the declared normalisations** · **§16.0 finality (NOT final ⇒ findings PROVISIONAL)** · §14 the provenance line, two sentences never merged · §15 the marker · §17 the fact sheet |
| 2 | `02-SOURCE-CHECK.md` | **First** — the source must be current before any live work (Rule 81); Rule 59 re-reads it again immediately before the writes begin |
| 3 | `03-RUN-CHECK.md` | Driving the build live: the build marker at both ends, roles and `reset to template` (Rules 26 / 26a / 74), markers, the Rule-49 queue |
| 4 | `01-CASE-BUILD.md` | The wording, structure and traceability standards a re-worded case must still satisfy — and §10 push + **run sync** |
| 5 | `04-TESTER-READY.md` | The handover, if the pass ends in one — **§6 the brief, §6.1 the `Defects-for-Testers` workbook** |
| 6 | `06-DEFECT-PREP.md` | Every deviation this pass finds: prepare the pack, apply the **API reachability test**, **stop at the button** |
| — | `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` | **The process document this lane executes.** The skills above are how it is run safely; this is the method itself |

---

## 3 · HARD GATES — pointers only, never restated here

| Rule | Gate |
|---|---|
| **6** | Nothing is written to TestRail without explicit permission |
| **62** | **No Jira ticket without permission, PER ASK** — plus the 2026-08-10 hold: **check whether it has lifted** |
| **71** | An `Automated` case is not changed without asking — **and tell Vlad** (Rule 65) |
| **51** | An API-related finding is asked about **separately, every time** |
| **80** | State the last-done date **and the build**, then **ASK** before re-running |
| **81** | **Source verification precedes** VIU — and is never auto-run |
| **11** | **ALWAYS ASK which process(es) to run** — wording+VIU, or the spec-relevance reconciliation, or both |
| **22** | Ask for the **live-build check and the access** up front |

Full texts: `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-91.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 4 · ALSO MANDATORY FOR THIS SESSION

- **`14-ACCESS-RESILIENCE.md`** — read **before the first access call** (Rule 89): primary paths and
  fallback ladders, the failure signatures (**`401 sso_required` = dead cookies OR a deploy — check
  the build marker first**), the **five MCP-hygiene hard rules** (**never edit or "repair" shared MCP
  config**), and the unattended **BLOCKED** protocol — **never fabricate a result.**
- **`13-CROSS-SESSION-SAFETY.md`** — Rules 82–87: the real secret-scan gate, lane write locks, the
  tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, **case-body snapshots**
  (this lane rewrites bodies in bulk, so the snapshot is what makes a foreign edit diffable).
- **Rule 88** — never bulk-read case bodies into context: **script the pass and read a bounded
  summary**; batch the writes in a script; Rule-75 detached pattern for long jobs.
- **Rule 90** — one shared quota: main **15 %** · each lane **25 %** · **10 % reserve**. Report your
  spend; **STOP AND REPORT at 50 %** if spend outpaces progress; **never touch the reserve**.
- **Rule 91** — every verification claim carries a **freshness badge with its date**: **✅ ≤ 7 days ·
  🟠 8–14 days · 🔴 > 14 days · ❌ never verified**, with the build marker (or spec version for
  source). **A bare tick is non-compliant.** A VIU pass **re-stamps** the Rule-54 provenance line as
  part of the same write, which is what keeps the badge derivable from the case rather than remembered.
  Tool: `build/testing-tools/verification_badge.py` (requires `--today`).
