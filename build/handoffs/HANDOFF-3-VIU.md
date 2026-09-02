# HANDOFF 3 — VIU SESSION (build-accurate wording + Verify-In-UI)

> **Copy-paste this whole file into a fresh session as its briefing.**
> Written 2026-08-21. Repo: `Manual-test-Cases` (PUBLIC). Working directory:
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

## 1. MISSION

You are the **VIU session**. When the QA lead says *"VIU the test cases"* he means **run
`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` end to end** (Rule 10): capture the exact on-screen
labels **live** from the build, rewrite every case's title / preconditions / steps / expected results
into build-accurate plain layman wording, verify the behaviour live with evidence, checkpoint-commit,
push to TestRail via `update_case` with a per-case audit log, **stamp or refresh the provenance line in
that same push**, regenerate the deliverables, and **always state the TestRail update status
explicitly**. **You must NEVER do the following:** you do not author new cases (that is handoff 1); you
never change what a case **EXPECTS** — VIU corrects **labels**, never expectations, and if the build
differs the case keeps the documented expectation and becomes a deviation with a ticket; you never
resolve an ambiguous source by looking at the build; you never write to TestRail or create a Jira
ticket without permission asked for and granted; and you never touch another author's case. **Stay in
your lane and report cross-lane findings back to the main session** — a missing case is handoff 1's
work, not something you author mid-pass.

---

## 1a. 🛑 "I CANNOT OBSERVE THIS ON THE BUILD" IS **NOT** "BLOCKED"

**READ THIS BEFORE §2. It is the fix for a real incident: on 2026-08-31 a session parked 18 cases as
"blocked" when every one of them had a defined deliverable outcome already written down — and one of
them had a full working recipe sitting in `build/APP-ACTIONS-PLAYBOOK.md` the whole time.** A VIU pass
reaches more screens than any other lane, so it hits this more often than any other lane.

**Work in this lane almost never STOPS. It CHANGES SHAPE.** When you cannot observe something, you do
not get to stop — you pick the right outcome from this list:

| What you actually hit | The outcome that is already defined for it |
|---|---|
| **Feature is not built yet** | **Rule 69** — `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`, the under-development line, a `DEFERRED-RUN.md` row. **A finished case**, not a blocker; **excluded from any ready-to-automate figure**; substitutes for a plain `AUTOMATION: READY` **only**, never over an `EXPECT FAIL` or a `HOLD`. (`03-RUN-CHECK.md` §7) |
| **A precondition needs the CUSTOMER PORTAL** | The **staging-only HOLD** — the literal below. Judge it from the **preconditions**, never from the word "portal". (`00-COMMON-CORE.md` §5.0-b(2)) |
| **The source is ambiguous** | **Rule 58** — **hold the case and add a PO-question row.** An ambiguous source is **NEVER** resolved by looking at the build, and a wording change you cannot quote back to a source is **invalid**. |
| **A data state you need does not exist** | **Rule 14 — SEED IT.** Seeding on a disposable environment is **pre-authorised, permanently** (`00-COMMON-CORE.md` §5.0-b(1)). **Never NOT-VERIFIED for a data state.** |
| **The feature is there but you cannot find the control** | **Rule 97 search drill** (playbook first — the exact error text) **+ Rule 26 role reset**: an action you cannot find may be **role-gated and simply not rendered** — check the gate before calling it absent. Then the network tab, and grep the served JS bundle. |
| **It is genuinely your own unfinished work** | **Say so plainly — "MINE".** That is the honest name for it, and it is never filed under a blocker. |

**⇒ THE STAGING-ONLY CUSTOMER-PORTAL HOLD — a machine-findable literal, byte-exact, never reworded:**

```
AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch
```

**QA lead, 2026-08-31, verbatim: *"Customer portal related tickets can only be tested on staging and
not on the QA branch. We need to put this marker on such tickets aswell."*** Without it, **a label
that lives on a portal surface is reported "absent" by any QA-branch probe, forever** — which in this
lane means a VIU pass would "correct" a case's wording to match a screen the label was never on.
**SCOPE IT FROM THE PRECONDITIONS, NEVER FROM THE WORD "PORTAL":** only a case whose preconditions
require a **portal-generated artefact** gets it; **a case verifying the portal feature's ABSENCE on
the shop-app path is fully testable on the QA branch and must NOT be parked** (2026-08-31: C44954 is
build verified; **C44951 / C44952 / C45175** are staging-only and carry the HOLD). **C44947 is IN
SCOPE** — mis-parked with those three at first, then correctly reclassified because it is about the
**payment method name on the Payments rows (S8-R2), not the paid banner**, so it never needed the
portal; it is live at `AUTOMATION: READY`. **The id that looked portal-gated was not — scope from the
preconditions, never from the word "portal".** **Three cases carry the literal, not four**, measured
live over the whole estate: `build/testrail-writes/portal-hold-inventory-2026-08-31/INVENTORY.md`.
It is a **HOLD**, so the gate **READY + EXPECT-FAIL = total − HOLD** is unaffected.

**ONLY AFTER ALL OF THE ABOVE does anything earn the word "blocked" — and then Rule 68 applies:
"blocked" is a property of a QUESTION about a case, not of the case. DECOMPOSE, because part of the
group is almost always testable, and STATE THE RESIDUAL: *"Blocked for X. Still possible under it: Y.
Genuinely impossible until X clears: Z."*** Six checkable requirements: **`00-COMMON-CORE.md` §11.4.**

**THE RULE 57 COROLLARY:** expected behaviour comes from the **DOCUMENTS**; from the build we take
**exactly two things** — the **on-screen labels / navigation path** and the **pass / fail verdict**.
**Therefore a case can be fully tester-ready and FINISHED with zero build access** — "no build access"
is a statement about two fields, never about the case.

**Canonical fuller treatment — read it, do not work from this table alone: `03-RUN-CHECK.md` §8.0-a**
(*a check that fails is a statement about YOUR CHECK until you prove otherwise* — the positive-control
gate, the one-token variant, and the MINE / BLOCKED-PROVEN / BLOCKED-EVIDENCED / NOT-YET-PROVEN
classification you must report counts for).

---

## 2. READ THESE FIRST, IN THIS ORDER

1. **`build/skills/12-VIU.md`** — your own skill. Read it fully.
2. **`build/skills/00-COMMON-CORE.md`** — **READ IT, ALL OF IT ONCE**, then use its own routing
   table. It is the shared core: the honesty bar, TestRail write discipline and hazards, run sync,
   foreign cases, access mechanics, environment, session survival, git on a shared branch, secrets,
   authority, the reader-facing standards, **§14** the provenance line, **§15** the `AUTOMATION:`
   marker, **§16 FINALITY** and **§17** the project fact sheet.
   **⚠️ ON FINALITY, READ §16.0 AND ONLY §16.0.** As of **2026-08-21** the QA lead has ruled the
   branches are **NOT final** — they are continuously updated as ad-hoc decisions are made and will
   not be final until release day — so **Rules 49 and 60 apply in full, findings stay PROVISIONAL, and
   a gap is possibly-unfinished rather than automatically a defect.** **§16.1 is the superseded
   2026-08-11 "the branches are FINAL" text, kept visible and dated; do not apply it.**
   **⚠️ THE OVERLAP THAT USED TO BE FLAGGED HERE IS RESOLVED — skill `12-VIU.md` is now a THIN
   ROUTER.** It holds no procedure: the canonical VIU procedure lives in the `00`–`08` set and is
   maintained there only. The earlier instruction to "read both and stop if they disagree" is
   therefore spent, and the one disagreement it named — finality — is settled above. Nothing was
   deleted in the merge: each router names where its unique content went.
3. **THE CANONICAL SKILLS FOR THIS LANE, in this order:** **`02-SOURCE-CHECK.md`** (source current first — Rule 81; Rule 59 re-reads it again immediately
   before the writes begin) · **`03-RUN-CHECK.md`** (driving the build live; roles and `reset to
   template`) · **`01-CASE-BUILD.md`** (the wording/structure/traceability standards a re-worded
   case must still satisfy, and **§10** push + run sync) · **`04-TESTER-READY.md`** **§6 + §6.1** ·
   **`06-DEFECT-PREP.md`**
4. **`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`** — **the method you are executing.** Read it in
   full before anything else in this list.
5. **`build/VIU-ACCESS-METHOD.md`** — live access: egress, the three session cookies, the MITM bridge,
   the `boot2` hydration pattern.
6. **`build/APP-ACTIONS-PLAYBOOK.md`** — the indexed **STAGING ACTION RECIPES** plus **§J** (TestRail
   and API declared facts / normalisations). **Rule 27: reuse, never re-discover; append a new proven
   recipe immediately.**
7. **`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`** — the Rule-11 companion process; you may be
   asked for this instead of, or alongside, the VIU.
8. **`build/MISSING-TRACEABILITY-PROCESS.md`** — a standard sub-step of any VIU pass.
9. **`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md`** — the 4-layer live method if the pass touches
   roles or permissions.
10. **`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`** — required if the wording changes are extensive
   enough to count as an authoring pass (Rule 28).
11. **`build/TESTING-RUNBOOK.md`** and **`build/NO-WORK-LOSS-STRATEGY.md`**.
12. **`build/PROCESS-CATALOG.md`** — the index of every callable process.
13. **`build/OUTSTANDING-ITEMS-REGISTER.md`** — what we are already waiting on.
14. The target project's **`build/<project>/PROJECT-STATE.md`**, then its newest dated pass folder and
    every **`RECHECK-QUEUE.md`**.

**⚠️ DO NOT read `CLAUDE.md` end to end** (Rule 88) — `grep -n` for what you need.
**⚠️ CORRECTED 2026-08-21: `CLAUDE.md` IS NOW A SMALL INDEX (~28 KB), AND ITS RULE INDEX RUNS TO
RULE 91 — NOT 62.** The full, verbatim rule texts live in **`build/rules/RULES-01-20.md` ·
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-99.md`**, and **that is where you read the rule you
are about to apply — the index is not the rule.** The two claims previously here — that CLAUDE.md is
"roughly 5,000 lines" and that its "Standing Rules stop at Rule 62" — were true when written and are
both stale; they are corrected rather than deleted so nobody re-derives them.

**At session start also run the standing queue checks:**
`ls build/*/design-*/PENDING-FIGMA-FETCH.md` (Rule 35) and `ls build/*/*/RECHECK-QUEUE.md` (Rule 49).

---

## 3. THE NON-NEGOTIABLE RULES FOR THIS LANE

1. **Rule 10** — "VIU" means the **whole** process end to end, including the TestRail push, the
   provenance stamp and the regenerated deliverables. A wording fix alone is not a VIU.
2. **Rule 11** — **ALWAYS ASK** which process(es) to run on a new/updated spec or a VIU request.
3. **Rule 6** — no TestRail write without explicit permission.
4. **Rule 7 / 9** — plain layman wording, exact build labels, **flag anything unconfirmable rather
   than inventing it**.
5. **Rule 8** — always pair an internal ID with its C-ID **and** the TestRail link.
6. **Rule 12 / 13** — VIU-Verified means **observed live with evidence captured that run**; for
   permission cases that means driving the UI **as** the role, per role, per environment. Never
   derived from role definitions, `fe_permissions`, atoms or code.
7. **Rule 14** — **seed, don't block.** A missing data state is never an acceptable blocker on a
   disposable environment, and **never a NOT-VERIFIED**; seeding there is **pre-authorised,
   permanently** (`00-COMMON-CORE.md` §5.0-b(1)). Roles, staff records and settings are the exception
   (core §7.3), and you may never manufacture the condition under test (core §7.4).
8. **Rule 17** — the whole population, with the exact totals stated.
9. **Rule 22** — ask for the live-build check and the access **up front**.
10. **Rule 25** — every deviation quotes its source verbatim; an unsupported assertion is **removed or
    made scope-conditional (Rule 42)**, never replaced with what the build does.
11. **Rule 26 / 26a** — reset roles to template first; re-reset persistently on mid-run drift.
    **And the inverse framing, which is how this rule usually bites a VIU: an action or a label you
    cannot find may be ROLE-GATED and simply not rendered for the role you are in — check the gate
    before you call it absent, and before you "correct" a case's wording to match a screen.**
12. **Rule 29** — commit and push after every step and **mid-run**; path-scoped `git add` only; keep
    per-operation logs so a killed push can be resumed exactly.
13. **Rule 31 / 59** — source currency first, and **re-read the sources immediately before the writes
    begin**, logging **both** timestamps and the second read's verdict.
14. **Rule 34 / 47** — run sync **UNION ONLY**; snapshot before, verify every prior result **by id**
    after.
15. **Rule 36** — every report ends with "OUTSTANDING — what I need from you".
16. **Rule 41** — **touch a case, re-verify the WHOLE case**, and log *"re-verified whole against
    `<spec + version + date>`"*. There are no surgical edits.
17. **Rule 49** — provisional findings, dated `RECHECK-QUEUE.md`, never claim completeness.
18. **Rule 50** — exhaustive then exact; byte-verify every write; on a mismatch **stop the batch**.
19. **Rule 54** — the two-sentence provenance line, **re-stamped in the same push**; sentence 1 names
    documents only; *"as per the build tested on …"* is **barred**.
20. **Rule 56** — disclose a divergence where one exists; never manufacture one where it does not.
21. **Rule 57** — the build supplies **only** labels/navigation and the verdict. A closed ticket is
    not a spec change. **⇒ a case can be tester-ready and FINISHED with zero build access (§1a).**
22. **Rule 58** — an ambiguous source is never resolved from the build: **hold the case and add a
    PO-question row** — a held case plus a question is the deliverable, not a blocker. **Quote-back
    test:** an expectation that cannot be quoted from a source makes the edit **invalid**.
23. **Rule 61** — every expect-fail case names the symptom and the three outcomes; **ticket status is
    never evidence about the build**.
24. **Rule 62** — no Jira ticket without permission (currently under a **"create nothing"** hold).
25. **Rule 71** — automated cases: read-assess → report → **HOLD**.
26. **Rule 74** — **no PRESENT feature is left un-build-verified.** This is a coverage obligation, not
    a login mechanic: **seed the data and log in as whatever role the feature needs**, and the only
    acceptable un-verified feature is one that is **genuinely absent from the build** (→ Rule 69) or
    **genuinely unreachable on it** (→ the staging-only portal HOLD). The multi-login mechanic — reset
    role to template → assign to the Technician quick-login → test → restore Technician — is **how**
    you satisfy it, never the whole of it.
26a. **Rule 68** — **a blocker must be PROVED and blocks only what it ACTUALLY blocks.** *"We could
    not see a way"* is an assumption; *"we tried A, B and C and here is what each returned"* is a
    measurement. **DECOMPOSE and state the residual** (`00-COMMON-CORE.md` §11.4). See §1a — most
    things reported as blocked are not.
26b. **Rule 69** — a case that **cannot yet be build-verified** keeps its **documented** expectation,
    carries **`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`**, gets the
    under-development line and a `DEFERRED-RUN.md` row: a **FINISHED case, NOT a blocker**, excluded
    from any ready-to-automate figure. Substitutes for a plain `AUTOMATION: READY` **only**.
    Procedure: **`03-RUN-CHECK.md` §7**.
27. **Rule 77** — validity window: ≤3 builds and ≤3 source versions still counts, **but show the
    date**.
28. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

---

## 3a. THE NAVIGATION MAP — READ IT BEFORE YOU NAVIGATE, APPEND AS YOU GO

A VIU pass reaches a lot of screens, so it both consumes and feeds
**`build/<project>/NAVIGATION-MAP.md`**. If the project has no map, create it from
**`build/NAVIGATION-MAP-TEMPLATE.md`**. Full convention: **`build/skills/03-RUN-CHECK.md` §9** — read
it there rather than working from this summary.

- **Read it BEFORE you start hunting for a screen** (Rule 27 — reuse the recorded recipe, never
  re-discover), and **append the moment a path is confirmed**, in the same pass (Rule 93).
- **Only paths navigated successfully and observed live go in** (Rule 12). **Never infer one from
  product source code, a spec, a design or another branch** (Rule 57).
- **Navigation only** — a map entry is **never** cited in a case's Expected Results or provenance line;
  the wording you put in a case still comes from the documents plus the build's own labels (Rules 9 /
  54 / 57).
- **Rows are branch-specific** and carry the **Rule 91 badge with the date** (✅ ≤7 d · 🟠 8–14 d ·
  🔴 >14 d · ❌ never observed); a different branch gets its own row, never an overwrite.

---

## 4. HARD GATES — ASK FIRST, EVERY TIME

| Gate | Rule | The ask |
|---|---|---|
| **Which process** | 11 | *"Do you want the build-accurate wording + VIU, the whole-suite spec-relevance reconciliation, or both?"* Never assume. |
| **Last-done date + re-run** | 80 | State when the VIU was last done and against which build/version, then **ASK** whether to re-run. |
| **Source verification** | 81 (refined) | **Do not auto-run it.** Say the task needs source-current cases, give the last source-verify date + version, **ask WITH or WITHOUT — and WAIT.** |
| **TestRail writes** | 6 | No `update_case` / `add_case` / `delete_case` / run write without explicit permission. The push is the heart of this lane, so this gate is asked **before** the pass, not after the rewrite. |
| **Jira ticket creation** | 62 + the **"create nothing until my next order"** hold of 2026-08-10 | Prepare the text, recommend, **stop at the button.** Permission is **per ask**. |
| **API-only findings** | 51 | Asked **separately**, even inside an approved batch. |
| **Automated cases** | 71 | Read-assess → report → **HOLD** for his decision. |
| **Live check + access** | 22 | Fresh cookies + env/branch + flag state, requested up front, with every item needing live observation named. |

---

## 5. THE FIVE NEW PROJECTS — STARTING MONDAY 24 AUGUST 2026

| Project | **DEVELOPER(S) / engineering lead** | Product Owner |
|---|---|---|
| Parts on Work Orders | **Stefan Vukovic** | **UNKNOWN — must be asked for** |
| Global Search | **Sinisa Nogic, Nikola Milosevic** | **UNKNOWN — must be asked for** |
| Invoicing Refresh | **Minja Kotlajic** | **UNKNOWN — must be asked for** |
| Simplified Workflow v2 | **Parth Faladu** | **UNKNOWN — must be asked for** |
| Accounting | **Nikola Mitrovic** | **UNKNOWN — must be asked for** |

> **⚠️ THE NAMES ABOVE ARE DEVELOPERS / LEADS, NOT PRODUCT OWNERS.**
> **The PO for each of these five projects is UNKNOWN and must be ASKED FOR.**
> **PO attributions are never mixed and never guessed.** The known existing attributions — Branko =
> Filters / Schedule / Global Search (historic) · Chris Ward = Report Suite / Fees & Discounts ·
> Milos = Simple Flow — must **not** be assumed to carry over to a new project. Ask.
> This matters acutely in this lane, because the **PO's verified answer is a source of expected
> behaviour** (Rule 57 (c)) — citing the wrong person's answer on a provenance line manufactures false
> authority, which is worse than having no provenance line at all.

> **⚠️ GLOBAL SEARCH ALREADY EXISTS IN THIS WORKSPACE — it is a REVIVAL to reconcile, not a greenfield
> build.** **86 cases are already authored** (15 sections, adversarially reviewed clean, import ready,
> **never pushed to TestRail — so they have no C-IDs yet**); the project was **postponed** on
> 2026-07-27; canonical resume doc **`build/global-search/PROJECT-STATE.md`**. For this lane that has
> two consequences: (1) those cases were written **spec-only, with "VIU-confirm" markers on every label
> the spec did not pin down** — this pass is where those get resolved; and (2) since they are not in
> TestRail, there is **nothing to `update_case`** until an authorised `add_case` push happens first, so
> the wording work lands in the local case source and the import, not in TestRail. Say that plainly
> rather than reporting a TestRail update status that cannot exist.
> Open question **OQ-3** (whether AI / "ask a question" is in V1) is **still open**.

---

## 6. MISSING INPUTS TO REQUEST BEFORE STARTING — PER PROJECT

1. **The PO's name** — and their answer file, since a PO answer is a source of expected behaviour.
2. **The spec / PRD** — Confluence URL **and** export/MCP access, with the **version number** (the
   in-body "Version" field lies; use the Confluence version).
3. **The designs** — Claude design, Figma (file + node ids), technical design. Flag any **undated
   editable share link**: it cannot be dated, so latest-wins cannot be applied and it must be cited as
   exactly what it is.
4. **The epic / Jira key** and its child story set — needed for `refs` and for naming an owning story.
5. **The engineering tech plan** (Rule 30) — remind him if missing.
6. **The QA branch / environment + feature-flag or settings state**, and **fresh session cookies**
   (`sv_sso_session`, `PHPSESSID`, `cf_clearance` for `.qa.shopview.com`) — these die at roughly 24
   hours **or on deploy**, and without them **nothing can be VIU'd at all**.
7. **A second sign-in / non-administrator login** for any permission case, plus confirmation that no
   sibling worker shares the session (`quick-login` and `switch-user` rotate it).
8. **The TestRail target** — the section/group, and the run that will need a **union** sync afterwards.
9. **Explicit authorisation for the push**, since a VIU without the push is only half the process.

State plainly what each missing item **blocks**, who owes it, and since when (Rule 36).

---

## 7. DEFINITION OF DONE FOR THIS LANE

A VIU pass is done when **all** of these are true:

- The **build marker** is captured at start and end (`app-version`, `last-modified`, `etag`, sha256 of
  `index.html`, with UTC timestamps) and proven **byte-identical**, so nothing redeployed under the
  pass.
- Sources were read at **pass start** and **re-read at write start**, with **both timestamps and the
  second read's verdict** in the execution log (Rule 59).
- Every case's **wording** now matches the build exactly — labels, field names, screen names, button
  text, step order, navigation path — with anything unconfirmable **flagged, not invented**; titles
  ≤80 characters; numbered preconditions/steps/expected with **`<br>` line breaks, not bare `\n`**;
  **zero raw markup** visible to the tester (this project renders markup literally).
- Every case's **expectation is unchanged unless a document moved it** — and where a document did move
  it, the change is quotable back to that document (Rule 58's quote-back test).
- Every touched case was **re-verified whole** and logged as such (Rule 41).
- Every case carries **exactly one** Rule-54 provenance line (two sentences, documents-only in
  sentence 1, the build named only in sentence 2), **exactly one** AUTOMATION marker as the last line
  with a blank line before and after, and a Rule-56 divergence sentence **only where there is a
  divergence**.
- Every expect-fail case names the **symptom and the three outcomes** (Rule 61).
- The **arithmetic gate passes, read back from the live cases, both ways**:
  `READY + READY-EXPECT-FAIL = total − HOLD`.
- The push is complete: **every `update_case` HTTP 200 and byte-verified** against the intended
  payload, **all text fields sent on every payload**, every untouched field proven byte-identical, the
  per-operation audit log complete, and the **run proven undamaged** (case_id sets equal both
  directions, every prior result present **by id**, no graded field changed, no result logged).
- **Deliverables regenerated**: import (header hash-identical to its peers, shredding guard passed,
  VIU-word-free and flag-word-free), Blockers Tracker, results workbook (a tab per status + Summary),
  `testrail-id-map.csv` **re-merged from live** (the generator blanks C-IDs and drops `refs` every
  rerun), with the **four counts set-equal both ways**: live · local active · id-map · import.
- A dated **`RECHECK-QUEUE.md`** is open with one row per verdict and its trigger (Rule 49).
- The environment is **left clean** and every restore **proven byte-identical field by field**.
- Everything **committed and pushed**; no credential ever committed.
- **The TestRail update status is stated explicitly** in the report.

**Deliverable set:** `build/<project>/full-viu-<date>/` (or `final-viu-<date>/`) with `FINDINGS.md` ·
`CHANGES-MADE.md` · `testrail-execution-log.md` · `RECHECK-QUEUE.md` · `SOURCE-CURRENCY.md` ·
`DELIBERATE-DECISIONS.md` · `API-ASK.md` · `RESUME.md` · `evidence/`, plus the regenerated
`testrail-import/…` files and the updated `PROJECT-STATE.md`.

---

## 8. HOW TO REPORT BACK

Plain layman words, simple status format, these headings:

- **What I did**
- **What I found** — every deviation with its source quoted verbatim, every case named as internal ID
  + C-ID + link.
- **What needs to be done** — a plain next step for every non-passed row.
- **Other actions**
- **OUTSTANDING — what I need from you** — always present; **"nothing outstanding"** if true. Sweep
  all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
  access/credentials · deferred or HELD decisions · what another team owes. For anything blocked on
  the QA lead himself, give the five Rule-48 fields: his ruling quoted verbatim · when he gave it and
  what question it answered · the named cases it blocks (internal ID + C-ID + link) · why it was
  reasonable, or what has changed since · the one thing that would unblock it, and from whom.

**Always state the TestRail update status explicitly**, give the honest observed-versus-carried-forward
split in numbers, and name the build marker every verdict rests on.

**🔑 EVERY VERIFICATION CLAIM CARRIES A RULE-91 FRESHNESS BADGE AND ITS DATE — in the report, in every
table, and in every workbook you produce (including the `Defects-for-Testers` workbook).** The scheme,
measured from the last-checked date to today:

| Badge | Meaning |
|---|---|
| **✅ GREEN** | build/source-verified, **current** — age **≤ 7 days** |
| **🟠 ORANGE** | build/source-verified, **ageing** — age **8–14 days** |
| **🔴 RED** | build/source-verified, **stale** — age **> 14 days** |
| **❌ CROSS** | **NOT verified** — never observed on any build |

**The badge ALWAYS carries the date, and the build marker where known** — e.g.
`✅ Build-verified 2026-08-18 (v3.8-bd246fd)`; for source verification the **spec version** —
`🟠 Source-verified 2026-08-06 (spec v19)`. **A BARE TICK IS NON-COMPLIANT** (Rule 12 — a claim
carries its evidence). **Report BOTH badges** (build and source); they often disagree, and collapsing
them into one "verified" hides whichever half is out of date.

**Rule 91 is the VISIBILITY layer; Rule 77 is the VALIDITY test.** A case inside Rule 77's 3-build
window may still show 🟠 or 🔴 — **that is intended honesty, not a contradiction.** Neither rule may
be used to suppress the other. **And because the branches are NOT final (core §16.0), a green badge
still describes a PROVISIONAL verdict** — freshness is not finality.

Tool: **`build/testing-tools/verification_badge.py`** — read-only, and it **requires an explicit
`--today YYYY-MM-DD`**, because a freshness figure computed off an implicit clock cannot be reproduced
by the next reader.

Also read build/skills/13-CROSS-SESSION-SAFETY.md (Rules 82–87: real secret-scan gate, lane locks, tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots).

---

**Rule 88 — LANE-SESSION CONTEXT DISCIPLINE:** never read `CLAUDE.md` end-to-end (grep it); never bulk-read case bodies or CSVs into context (script it to a file, read a bounded summary); batch writes in a script; long jobs use the Rule-75 detached pattern with progress in commit messages; do NOT spawn subagents for work you can do directly; stop and report at the budget tripwire.

---

## ACCESS + QUOTA — added 2026-08-21 (Standing Rules 89 & 90)

> **🔴 [`../skills/14-ACCESS-RESILIENCE.md`](../skills/14-ACCESS-RESILIENCE.md) — read it BEFORE the first access call of
> this session.** It carries **Standing Rule 89**: the PRIMARY path and FALLBACK ladder for TestRail,
> Jira/Confluence, ShopView QA/staging/production and Figma; the **mandatory session-start preflight**;
> the failure signatures (notably **ShopView `401 sso_required` = dead cookies OR a deploy — check the
> build marker first**); the **five MCP-hygiene hard rules** (above all: **never edit, delete or
> "repair" shared MCP configuration to fix a connection** — a mutated config stays corrupt for every
> future session); and the **unattended BLOCKED protocol** (write and commit `BLOCKED-<system>.md`,
> keep working on what is not blocked, never fabricate a result).
>
> **THE RULE-90 BUDGET IS NOW CLAUSE 10 OF THE TOKEN DISCIPLINE CHARTER — see the mandatory
> [TOKEN DISCIPLINE CHARTER (Rule 95)](#token-discipline-charter-mandatory--rule-95) section immediately
> below, which carries all twelve clauses in full. Full texts: `build/rules/RULES-61-99.md`.

---

## SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)

**This section is MANDATORY in every handoff.** Full rule text: `build/rules/RULES-61-99.md` (Rule 97,
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
`build/rules/RULES-61-99.md` (Rule 95, tying Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90). The
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
