# SKILL 10 — TEST-CASE CREATION lane · **ROUTER**

> **🔴 THIS FILE IS A ROUTER, NOT A SOURCE OF TRUTH.** It holds **no procedure**. The canonical
> procedure lives in the files listed in §2, and it is maintained **there only**. Converted from a
> full 395-line skill on **2026-08-21** because it duplicated `01` + `02` + `06` and duplicated
> content drifts: the two copies were already disagreeing about finality. **Its unique content was
> migrated first, not dropped** — the new-project onboarding convention is now `01-CASE-BUILD.md` §11.
> **If you find guidance here that is not in §2's files, that is a bug in this file — report it.**

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

## 1 · MISSION AND BOUNDARIES

**MISSION:** author **new** test cases from the sources, for one named project, and take them to the
point where a push could be authorised.

**THIS LANE MUST NOT:** verify anything against the running build (skill `03`) · run a VIU wording
pass on existing cases (skills `03` + `01`) · create a Jira ticket (Rule 62 + the 2026-08-10 hold —
**check whether it has lifted**) · touch another author's cases (Rule 38) or a case TestRail flags
**Automated** (Rule 71) · write to TestRail without the QA lead's explicit go-ahead (Rule 6).

**CROSS-LANE FINDINGS ROUTE BACK TO THE MAIN SESSION (Rule 83).** If this lane notices a build
deviation, a broken run, a foreign edit or a source conflict, it **records and reports it** — it does
not action it, and it does not enter another lane's territory to fix it.

---

## 2 · READ THESE, IN THIS ORDER

| # | File | Why / which parts |
|---|---|---|
| 1 | `00-COMMON-CORE.md` | **All of it once**, then by its own routing table. Non-negotiable: **§16.0 finality (the branches are NOT final)** · §14 the provenance line · §15 the `AUTOMATION:` marker · §17 the project fact sheet · the honesty bar · TestRail write discipline · secrets · reader-facing standards |
| 2 | `02-SOURCE-CHECK.md` | **First**, before authoring a word — the Rule-31 source-currency pre-flight and the per-requirement reconciliation |
| 3 | `01-CASE-BUILD.md` | **The authoring procedure itself**, end to end — wording, structure, traceability, the surface matrix, coverage in both directions, §9 the Ruthless Usefulness Audit closing gate, §10 push + run sync, **§11 new-project onboarding** |
| 4 | `17-REGRESSION-IMPACT-V1-TO-V2.md` | **Only when the project is a V2 / UPGRADE of an existing feature (intake type ii) — then MANDATORY, and it runs BEFORE or ALONGSIDE authoring, never after** (Rule 96). A V2 spec describes only what CHANGES and is SILENT about the rest; this derives the **invariant set** (V1 baseline − changed ∪ removed ∪ replaced) so a V2 build cannot silently break a V1 behaviour with every case still passing. Needs **no build and no cookies** |
| 5 | `COVERAGE-MATRIX.md` | The completeness proof this lane owes |
| 6 | `06-DEFECT-PREP.md` | Only if authoring surfaces a **defect** — prepare it, do not file it |
| 7 | `04-TESTER-READY.md` | Only if the output is going to a manual tester in this pass |

---

## 3 · HARD GATES — pointers only, never restated here

| Rule | Gate |
|---|---|
| **6** | Nothing is written to TestRail without explicit permission |
| **62** | **No Jira ticket is created without permission, asked PER ASK** — plus the 2026-08-10 "create nothing" hold: **check whether it has lifted** |
| **71** | An `Automated` case is not changed without asking |
| **51** | An API-related finding is asked about **separately, every time** |
| **80** | State the last-done date, then **ASK** before re-running anything |
| **81** | **Source verification precedes** build verification — and is never auto-run |
| **11** | **ASK which process(es) to run** on any new or updated source |
| **1** | Never start on a half-spec — **stop and ask** for the missing inputs |

Full texts: `build/rules/RULES-01-20.md` · `RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-97.md`.
**Read the rule you are about to apply, in full. An index is not a rule.**

---

## 4 · ALSO MANDATORY FOR THIS SESSION

- **`15-NEW-PROJECT-INTAKE.md`** — **read it the moment the QA lead NAMES a project** (Rules 92/93):
  the required input set, the committed PRESENT/MISSING intake checklist, the source-currency block, the
  scaffolding pointer, and the **REVIVAL** path — an existing project starts as a RECONCILIATION of its
  cases against the current sources, never a fresh authoring run. **Its §1a PROJECT-TYPE question is
  asked FIRST — (i) NEW · (ii) V2/UPGRADE · (iii) REVIVAL — and type (ii) triggers skill `17`.**
- **`14-ACCESS-RESILIENCE.md`** — read **before the first access call** (Rule 89): primary paths,
  fallback ladders, failure signatures, the **five MCP-hygiene hard rules** (above all: **never edit
  or "repair" shared MCP config to fix a connection**), and the unattended **BLOCKED** protocol.
- **`13-CROSS-SESSION-SAFETY.md`** — Rules 82–87: the real secret-scan gate, lane write locks, the
  tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots.
- **🔴 TOKEN DISCIPLINE CHARTER (Rule 95) — MANDATORY, FROM YOUR FIRST TURN:**
  **[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md)**. Twelve clauses — strategy first (79),
  never bulk-read/script it (88), the reading rule, spawn discipline (76/88), never poll (75), batch
  writes, piggyback cheap checks (78), never re-do work (77/80), answer in text, the budget (90), the
  week-start guard, and **clause 12: quality is never the thing cut**. **This router holds no substance
  — read the charter itself; it supersedes the Rule 88 / Rule 90 lines this section used to carry.**
  Every handoff embeds the same twelve clauses in full. Rule text: `build/rules/RULES-61-97.md`.
- **Rule 91** — every verification claim in your report carries a **freshness badge with its date**:
  **✅ ≤ 7 days · 🟠 8–14 days · 🔴 > 14 days · ❌ never verified**. A bare tick is non-compliant.
  Tool: `build/testing-tools/verification_badge.py` (requires `--today`).
