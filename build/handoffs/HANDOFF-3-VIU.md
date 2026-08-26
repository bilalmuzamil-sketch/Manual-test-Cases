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
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-94.md`**, and **that is where you read the rule you
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
7. **Rule 14** — seed, don't block.
8. **Rule 17** — the whole population, with the exact totals stated.
9. **Rule 22** — ask for the live-build check and the access **up front**.
10. **Rule 25** — every deviation quotes its source verbatim; an unsupported assertion is **removed or
    made scope-conditional (Rule 42)**, never replaced with what the build does.
11. **Rule 26 / 26a** — reset roles to template first; re-reset persistently on mid-run drift.
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
21. **Rule 57** — the build supplies **only** labels and the verdict. A closed ticket is not a spec
    change.
22. **Rule 58** — an ambiguous source is never resolved from the build: hold and ask. **Quote-back
    test:** an expectation that cannot be quoted from a source makes the edit **invalid**.
23. **Rule 61** — every expect-fail case names the symptom and the three outcomes; **ticket status is
    never evidence about the build**.
24. **Rule 62** — no Jira ticket without permission (currently under a **"create nothing"** hold).
25. **Rule 71** — automated cases: read-assess → report → **HOLD**.
26. **Rule 74** — multi-login standard: reset role to template → assign to the Technician quick-login
    → test → restore Technician.
27. **Rule 77** — validity window: ≤3 builds and ≤3 source versions still counts, **but show the
    date**.
28. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

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
> **Standing Rule 90 — the weekly quota is ONE shared pool:** main/orchestrator **15 %** · each lane
> **25 %** · **10 % reserve**. **Report your spend with your work**; at **50 % of your own budget**
> compare spend against work completed and **STOP AND REPORT if spend is outpacing progress**; **never
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-94.md`.
