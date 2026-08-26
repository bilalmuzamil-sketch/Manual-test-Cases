# SKILL 15 — NEW-PROJECT INTAKE

> **The reusable intake for ANY project, now or in a year.** No project is hard-coded here: every
> reference is `<project>`. This is the **first thing a lane session runs after the QA lead names a
> project**, and it is the only permitted way to leave the Rule-92 scope gate.
>
> **Companion files:** the folder-scaffolding convention lives in `01-CASE-BUILD.md` §11 and is
> maintained **there only** — this skill points at it rather than copying it, because duplicated
> content drifts (that is why skills `10`/`11`/`12` became routers). Source currency is
> `02-SOURCE-CHECK.md`. Access is `14-ACCESS-RESILIENCE.md`.

---

## 0 · WHEN THIS RUNS

| Situation | What to do |
|---|---|
| The QA lead **names a project** and there is no `build/<project-slug>/` folder | **§1–§6 — the NEW-PROJECT path.** |
| The QA lead **names a project that already exists in this workspace** | **§7 — the REVIVAL path.** It is a **RECONCILIATION**, never a fresh authoring run. |
| The named project is a **V2 / upgrade / re-work of an existing feature** | **§1a type (ii)** — the intake runs as normal **and TRIGGERS `17-REGRESSION-IMPACT-V1-TO-V2.md` (Rule 96)**, which needs three extra inputs. |
| **Before any of the above: ASK THE PROJECT TYPE** (input **0**, §1a) | The answer routes the pass. **Never inferred from the project's name.** |
| No project has been named | **You are not in this skill yet.** Sit at the Rule-92 scope gate and wait. |

**One project at a time.** Claim its lock (Rule 83) before touching anything, and release it when you
stop. Intake for a second project does not begin until the first is handed back.

---

## 1 · THE REQUIRED INPUT SET — and work does NOT start on a half-set

**Rule 1: if the input set is incomplete, STOP and ask for the missing pieces.** Do not part-proceed,
do not invent project details ahead of the spec arriving, and do not fill a gap from the build
(Rules 57/58).

| # | Input | Why it is required | Notes |
|---|---|---|---|
| **0** | **PROJECT TYPE — ASK IT FIRST, IT ROUTES EVERYTHING ELSE.** *"Is this (i) a NEW feature, (ii) a V2 / UPGRADE of an existing feature, or (iii) a REVIVAL of an existing workspace project?"* | The three types need **different processes, different inputs and different definitions of done**. Guessing the type is how a V2 gets authored as if it were greenfield — and a greenfield authoring pass has **nothing** that converts a V2 spec's silence about V1 into tests (Rule 96) | **Never inferred from the project name.** *"Global Search V2"*, *"Filters re-work"* and *"Schedule redesign"* all read like new projects. **ASK, and record the answer** in `INTAKE-<date>.md`. See **§1a** for each type's path |
| 1 | **Spec / PRD** — the canonical **URL** *and* an ingestible copy (export/paste, or a live fetch) | It is the primary source of expected behaviour (Rule 57) | Record the **Confluence version number**, never the in-body "Version" field — that is Rule 31's trap (a) |
| 2 | **Designs** — a **Claude design** (prototype export or share page), a **Figma** file + node ids, and/or the **technical design** | All three artefact types are authoritative sources of expected behaviour (Rule 57, amended 2026-08-06) | An **undated, editable share link has no date**, so latest-wins cannot be applied to it — cite it as exactly that and escalate (Rule 54) |
| 3 | **Epic / Jira key** | Rule 20 traceability is not satisfiable without it | Verify the child count **two ways** (`parent =` and `"Epic Link" =`) with no paging remainder (Rule 37 Tier 1) |
| 4 | **Engineering tech plan** | Rule 30 — it reveals edge cases, API contracts and state machines the spec glosses over | If it was not supplied, **remind the QA lead**; never proceed quietly without it |
| 5 | **The PO's name** | Every answer's authority depends on knowing whose answer it is | **Never guessed, never mixed across projects.** A wrong-PO attribution produces a confidently-wrong case, because the wrong answer reads as authority |
| 6 | **QA branch / environment + feature-flag or settings state** | Nothing can be build-verified without it, and a project with none is reported as **source-verified only** (Rule 85) | Ask for it up front (Rule 22), together with the access it needs |
| 7 | **TestRail target** — the suite/group/section the cases belong in | A push cannot be staged without it | Nothing is written to TestRail without explicit permission, per ask (Rule 6) |

**A missing input is not a blocker to be worked around — it is an ASK.** Every one goes into
`build/OUTSTANDING-ITEMS-REGISTER.md` with the four Rule-36 fields (what is missing · who owes it ·
**what it blocks, concretely** · since when) and is requested from the QA lead in plain layman words
(Rule 7).

---

## 1a · THE PROJECT TYPE — the first question asked, and the answer routes the whole pass

**ASK IT BEFORE ANYTHING ELSE, AND RECORD THE ANSWER.** Input **0** above is a required input in
exactly the same sense as the spec: **work does not start without it** (Rule 1).

| Type | What it is | The path it takes | Extra inputs it demands |
|---|---|---|---|
| **(i) NEW feature** | Greenfield. **No shipped predecessor**, nothing existing that a build could regress | §1–§6 of this skill, then the authoring lane: `02-SOURCE-CHECK` → `01-CASE-BUILD` → `COVERAGE-MATRIX` → the Rule-28 audit gate | The standard 7-input set |
| **(ii) V2 / UPGRADE of an existing feature** | A **new version, re-work or re-design of something already shipped**. The V2 spec describes **only what changes** and is **SILENT about the rest** | **🔴 TRIGGERS `17-REGRESSION-IMPACT-V1-TO-V2.md` — MANDATORY (Rule 96).** It runs **BEFORE or ALONGSIDE** V2 authoring, never after, and it needs **no build and no app cookies**. Then the normal authoring path for the V2 delta | **THREE ADDITIONAL REQUIRED INPUTS — see below** |
| **(iii) REVIVAL of an existing workspace project** | The **same version** of a project this workspace already holds, with work resuming after a pause | **§7 — the REVIVAL path.** A **RECONCILIATION** of the existing cases against the current sources, never a fresh authoring run | The current source versions + the existing case set + `PROJECT-STATE.md` |

### TYPE (ii) — the three additional required inputs

**A type-(ii) project's input set is NOT complete without all three. A missing one is an ASK, not a
thing to work around (Rule 1).**

| # | Additional input | Why |
|---|---|---|
| **0a** | **The V1 project's SLUG in this workspace** — `build/<v1-slug>/` | Our own repo is a **first-class V1 source** (skill 17 §3.2): the V1 cases, `requirements.md`, spec exports, PO answer files, design reviews and `PROJECT-STATE.md`. Without the slug the baseline is built blind. **If the V1 feature has no workspace folder, say so plainly** — the baseline then rests on documents + code only, and the honest limit grows |
| **0b** | **The V1 SPEC and its VERSION** | The invariant set is derived **against a pinned V1 document**, not against a memory of one. Record the Confluence version integer (Rule 31 trap (a)) |
| **0c** | **The EXISTING V1 CASE SET, identified** — suite/group/section, case count **ours vs live total** | Step 1 of skill 17 enumerates the baseline from it, and step 4 of §6 retires the superseded ones. **Foreign cases are identified and excluded from our counts, never edited** (Rule 38) |

**Also worth asking at intake, because it materially improves the pass:** whether this session has
**read access to the ShopView application repository** (skill 17 §8). If not, it is an **OUTSTANDING
item raised at intake**, not something discovered halfway through the matrix.

**Record the type and its inputs in `INTAKE-<date>.md`** alongside the PRESENT/MISSING table in §2.

---

## 2 · THE INTAKE CHECKLIST — filled in, committed, and honest

Write `build/<project-slug>/INTAKE-<date>.md` and **commit it**. One row per input, and the verdict is
**PRESENT** or **MISSING** — there is no third value, and "probably fine" is not a verdict (Rule 12).

```
| # | Input            | PRESENT / MISSING | Identifier / where it is        | If MISSING: what it blocks   |
|---|------------------|-------------------|---------------------------------|------------------------------|
| 0 | PROJECT TYPE     | PRESENT           | (i) NEW / (ii) V2 / (iii) REVIVAL| everything — §1a             |
| 0a| V1 project slug  | (type ii only)    | build/<v1-slug>/                | skill 17 baseline            |
| 0b| V1 spec + version| (type ii only)    | <page id>, Confluence v<N>      | the invariant set            |
| 0c| V1 case set      | (type ii only)    | group <id>, N ours / M live     | baseline + retire list       |
| 1 | Spec / PRD       | PRESENT           | <page id>, Confluence v<N>      | —                            |
| 2 | Designs          | MISSING           | —                               | ~N labels unpinnable         |
| 3 | Epic / Jira key  | PRESENT           | <KEY>, N children (2 ways)      | —                            |
| 4 | Tech plan        | MISSING           | —                               | edge cases / API contracts   |
| 5 | PO name          | PRESENT           | <name>                          | —                            |
| 6 | QA branch + flag | MISSING           | —                               | nothing build-verifiable     |
| 7 | TestRail target  | PRESENT           | suite <n> / group <n>           | —                            |
```

**Then state the count plainly: `N of 7 PRESENT, M MISSING`** (Rule 17 — the totals are the evidence).
Every MISSING row is mirrored into the outstanding register in the **same turn** (Rule 36).

**Definition of done for the checklist:** it is committed, every row has a verdict, every MISSING row
exists in the register, and the QA lead has been told the count and the asks.

---

## 3 · SCAFFOLDING — see `01-CASE-BUILD.md` §11, do not re-derive it

The folder convention is canonical **there**: `build/<project-slug>/` with `PROJECT-STATE.md`,
`requirements.md`, `cases/` (internal IDs `<PREFIX>-<AREA>-NN`, **never reusing a retired ID**),
`testrail-id-map.csv` **with a `refs` column**, the recorded **canonical spec URL and PO name**, and a
CLAUDE.md project-index row pointing at that `PROJECT-STATE.md`.

**What this skill adds to it:** the folder is created **only after §1 and §2**, so the state doc records
a real input set rather than an aspiration, and `PROJECT-STATE.md` opens with the intake verdict
(`N of 7 PRESENT`) and a link to the committed checklist.

---

## 4 · THE SOURCE-CURRENCY BLOCK — recorded per source, at intake and re-read before writes

Run the Rule-31 pre-flight **for this project only** and record, **per source**: the **identifier** ·
the **version or last-updated value** · the **date we checked it** · a verdict of **CURRENT / STALE /
PARTIAL**, and for a PARTIAL source **the exact shortfall named**.

```
| Source        | Identifier              | Version / last-updated | Checked     | Verdict            |
|---------------|-------------------------|------------------------|-------------|--------------------|
| Spec / PRD    | Confluence <page id>    | v<N>, <UTC>            | <date>      | CURRENT            |
| Epic          | <KEY>                   | N children, changelog  | <date>      | CURRENT            |
| Designs       | <file/node ids or link> | undated share link     | <date>      | PARTIAL — <what>   |
| Tech plan     | <doc>                   | <date>                 | <date>      | MISSING            |
| PO answers    | <file> + link           | <date>                 | <date>      | CURRENT            |
| Build         | <app-version marker>    | last-mod + etag        | <date>      | PARTIAL — not final|
```

**Three traps, all evidenced:** a Confluence page's **in-body "Version" can sit at 1.0** while the real
version advances · a Jira epic's **"updated" date moves for admin-only edits** — read the **changelog** ·
and **a page version being new says nothing about whether a given requirement inside it is new** — to
date a requirement, **diff that requirement's own text across versions** (Rule 31 traps a/b/c).

**No deliverable may claim completeness while any source is STALE**, and **Rule 59** requires this block
be **re-read immediately before the writes begin**, with both timestamps in the log.

---

## 5 · FIRST DELIVERABLES

In order, and none of them is skipped because the project "looks small":

1. **`INTAKE-<date>.md`** — §2, committed.
2. **`SOURCE-CURRENCY.md`** — §4, per source, with verdicts.
3. **`requirements.md`** — the complete spec, ingested, with its version pinned.
4. **The requirement → case coverage matrix, RE-DERIVED, in BOTH directions** (Rule 43): one verdict
   row **per requirement** and **per assertion** (Rule 45(e)), with **both texts quoted side by side**.
   A narrative summary is not acceptable, and a matrix is **re-derived, never patched**.
5. **The surface matrix** (Rule 40) — requirement down the side, surfaces across the top (screen · PDF ·
   CSV · print · API · mobile · email · column selector · filter/sort · empty/error state), each cell
   carrying exactly one verdict.
6. **The deliberate-decisions register** (Rule 46) — six fields per entry, including an honest RISK
   rating, so a deliberate omission can never be mistaken for a miss.
7. **The outstanding-items rows** (Rule 36) — every MISSING input, every unanswered question.

---

## 6 · DEFINITION OF DONE FOR INTAKE

Intake is complete — and **only then does lane work begin** — when **all** of these hold:

- [ ] The project's **lock is claimed** (Rule 83) and the lane is working **one project only**.
- [ ] `INTAKE-<date>.md` is **committed**, every row verdicted, the `N of 7` count stated.
- [ ] Every **MISSING** input is in `build/OUTSTANDING-ITEMS-REGISTER.md` with its four Rule-36 fields
      and has been **asked for in plain words**.
- [ ] `SOURCE-CURRENCY.md` records **every** source with identifier · version · date · verdict.
- [ ] The scaffolding of `01-CASE-BUILD.md` §11 exists, with the **canonical spec URL and the PO's
      name** recorded.
- [ ] The **CLAUDE.md project-index row** exists and points at `PROJECT-STATE.md`.
- [ ] **Rule 1 has been honoured**: if the set is incomplete, the QA lead has been told **what is
      missing and what it blocks**, and work has **not** started on the parts that depend on it.
- [ ] Nothing was written to **TestRail** or **Jira** (Rules 6/62 — and check whether the 2026-08-10
      creation hold has lifted).

**A half-set is reported, not absorbed.** Intake whose honest answer is *"4 of 7 present, and here is
what the other 3 block"* is a **successful** intake; one that quietly proceeds on 4 and produces
confident cases is a failure that only shows up later.

---

## 7 · THE REVIVAL PATH — a project that already exists starts as a RECONCILIATION

**When the named project already has work in this workspace, the intake is a reconciliation of the
existing cases against the current sources. It is NEVER a fresh authoring run.** Authoring over the top
of an existing suite produces duplicates, reuses retired internal IDs, and silently overwrites another
session's decisions.

> **⚠️ REVIVAL (type iii) IS NOT V2 (type ii) — CHECK WHICH ONE YOU HAVE (§1a).** A revival resumes the
> **same version** of the feature; a V2 is a **new version of something already shipped**. If the
> "revival" turns out to be a new version, it is **type (ii)** and
> **`17-REGRESSION-IMPACT-V1-TO-V2.md` is mandatory** (Rule 96) — a reconciliation does not derive an
> invariant set, so on its own it will not notice a V2 build breaking a V1 behaviour.

**The procedure, generic:**

1. **Measure what exists, live and paged** — cases under the project's group (**ours only**,
   `created_by = 3`), the id-map, the local case source, and the import: **four counts, set-equal in
   BOTH directions** (Rule 50). An unpaged `get_sections` returns 250 and silently finds zero.
2. **Do not trust the record — re-derive it.** A project's stored status line is frequently wrong; the
   sources move and nobody re-measures. Treat every remembered figure as **unverified until measured**.
3. **Run §4's source-currency block.** The gap between "when the cases were written" and "where the
   sources are now" **is** the reconciliation's scope.
4. **Re-derive the coverage matrix from scratch, both directions** (Rule 43) — requirement → case finds
   uncovered requirements, case → requirement finds cases whose anchor no longer exists. **Patching the
   old matrix preserves the old blind spots.**
5. **Rule 41 on every case you touch:** re-read the **whole** case against the current sources and log
   *"re-verified whole against `<doc + version + date>`"*. There are no surgical edits.
6. **Never resurrect a retired case or reuse a retired internal ID** — a resync once overwrote a
   retired record because an ID was reused.
7. **Respect foreign work** (Rules 38/71/87): do not edit another author's case, do not touch a case
   TestRail flags **Automated** without telling Vlad, and snapshot bodies so a foreign edit stays
   diffable.
8. **Report the delta, then stop** — what exists, what moved, what is now uncovered, and what you
   recommend. **Whether to act on it is the QA lead's call** (Rule 6).

**WORKED EXAMPLE OF A REVIVAL (illustration only — the procedure above is what generalises).**
**Global Search** is postponed but **not empty**: **all 86 of its cases are LIVE in TestRail** (group
4094, every one ours) — the older record saying *"authored, never pushed"* was **false** — and its
**epic exists, `SV-9160`, created 2026-08-12 with 24 children**, where our record said *"epic key not
available yet"*. **No QA branch has ever existed**, so **nothing has ever been observed** (Rule 85:
source-verified only). Its PRD moved **2026-08-20** while its last source check was **2026-07-16**, and
the epic carries **4 open questions and 2 PRD corrections** (the PRD names PostgreSQL/`pg_trgm` where
the stack is MySQL on Aurora, and "React context" where the app is Vue 3 + Quasar). **So a revival there
is: re-measure the 86, diff the PRD forward from 2026-07-16, re-derive coverage against the 24 stories,
and report — not author.** Every one of those record-vs-reality gaps is exactly what step 2 exists to
catch.

---

## GUARDRAILS

- **G1 — You may not enter this skill without a named project.** Rule 92's gate is the door.
- **G2 — One project at a time, under lock** (Rule 83). Cross-project findings are **reported** to the
  main session, never actioned here.
- **G3 — The PO's name is never guessed and never carried across projects.**
- **G4 — Expected behaviour comes from the documents; the build supplies labels and the verdict only**
  (Rules 57/58). At intake there is often no build at all — that is normal, and it is reported as
  **source-verified only** (Rule 85), not hidden.
- **G5 — Nothing is written to TestRail or Jira** during intake (Rules 6/62 + the 2026-08-10 creation
  hold — **check whether it has lifted**).
- **G6 — A half input set is REPORTED, never absorbed** (Rule 1 + Rule 36).
- **G7 — Propose, do not self-record, any rule or skill change** this intake suggests (Rule 72); the
  end-of-project retro is the vehicle (Rule 93).
- **G8 — `git fetch origin && git rebase` BEFORE measuring anything** (Rule 59's clause). A stale
  working copy yields confident wrong facts.
