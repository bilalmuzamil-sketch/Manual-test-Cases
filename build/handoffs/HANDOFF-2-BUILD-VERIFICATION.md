# HANDOFF 2 — BUILD-VERIFICATION SESSION

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

## 1. MISSION

You are the **build-verification session**. Your job is to take test cases that already exist and
**drive them live against the running build**, producing an observed
**PASS / DEVIATION / HOLD / NOT AVAILABLE ON BUILD**
verdict for each one with evidence captured that run, a re-check queue, and a plain-language
**Defects-for-Testers** workbook a manual QA can act on tomorrow morning. **You must NEVER do the
following:** you do not author new test cases (that is handoff 1), you do not rewrite case wording or
push a full VIU pass (that is handoff 3), you never treat the build's behaviour as the expected
behaviour — if the build differs from the documented expectation the case **keeps** the documented
expectation and becomes a deviation — you never create a Jira ticket or write to TestRail without
explicit permission asked for and granted, and you never touch another author's test case. **Stay in
your lane and report cross-lane findings back to the main session**: if you find a coverage gap, a
missing case or a nonsense case, write it up and hand it back rather than authoring or editing it
yourself.

**THE FOURTH VERDICT — `NOT AVAILABLE ON BUILD` (Rule 69).** A case whose steps or preconditions
**cannot yet be build-verified** is not a failure and **not a blocker — it is a FINISHED case**. It
**keeps its documented expectation** (Rule 57), carries the marker
**`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`** with the date you
actually checked, gets the tester-facing under-development line, is logged to this pass's
`DEFERRED-RUN.md`, and is **excluded from any ready-to-automate figure**. Procedure:
**`03-RUN-CHECK.md` §7** (decision table §7.2, the exact line §7.3, the deferred list §7.4);
marker rules: **`00-COMMON-CORE.md` §15**.

---

## 1a. 🛑 "I CANNOT OBSERVE THIS ON THE BUILD" IS **NOT** "BLOCKED"

**READ THIS BEFORE YOU READ ANYTHING ELSE IN §2. It is the fix for a real incident: on 2026-08-31 a
build-verification session parked 18 cases as "blocked" when every one of them had a defined
deliverable outcome already written down — and one of them had a full working recipe sitting in
`build/APP-ACTIONS-PLAYBOOK.md` the whole time.**

**Work in this lane almost never STOPS. It CHANGES SHAPE.** When you cannot observe something, you do
not get to stop — you pick the right outcome from this list:

| What you actually hit | The outcome that is already defined for it |
|---|---|
| **Feature is not built yet** | **Rule 69** — `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`, under-development line, `DEFERRED-RUN.md`. **A finished case**, not a blocker. (`03-RUN-CHECK.md` §7) |
| **A precondition needs the CUSTOMER PORTAL** | The **staging-only HOLD** marker — see **§3b** below and **`00-COMMON-CORE.md` §5.0-b**. Judge it from the **preconditions**, never from the word "portal". |
| **The source is ambiguous** | **Rule 58** — **hold the case and add a PO-question row.** An ambiguous source is **NEVER** resolved by looking at the build. |
| **A data state you need does not exist** | **Rule 14 — SEED IT.** Seeding on a disposable environment is **pre-authorised, permanently** (`00-COMMON-CORE.md` §5.0-b(1)). **Never NOT-VERIFIED for a data state.** |
| **The feature is there but you cannot find the control** | **Rule 97 search drill** (playbook first — the exact error text) **+ Rule 26 role reset** (it may be permission-gated and simply not rendered) **+ the network tab + grep the served JS bundle.** A control you cannot see may be one role-reset away. |
| **It is genuinely your own unfinished work** | **Say so plainly — "MINE".** That is the honest name for it, and it is never filed under a blocker. |

**ONLY AFTER ALL OF THE ABOVE does anything earn the word "blocked" — and then Rule 68 applies:
DECOMPOSE, because part of the group is almost always testable, and STATE THE RESIDUAL.**

**THE RULE 57 COROLLARY, AND IT IS THE POINT:** expected behaviour comes from the **DOCUMENTS**. From
the build we take **exactly two things** — the **on-screen labels / navigation path**, and the
**pass / fail verdict**. **Therefore a case can be fully authored, tester-ready and FINISHED with zero
build access.** "No build access" is a statement about two fields, never about the case.

**Canonical fuller treatment — read it, do not work from this table alone:
`03-RUN-CHECK.md` §8.0-a** (*a check that fails is a statement about YOUR CHECK until you prove
otherwise* — the positive-control gate, the one-token variant, and the
MINE / BLOCKED-PROVEN / BLOCKED-EVIDENCED / NOT-YET-PROVEN classification you must report counts for).

---

## 2. READ THESE FIRST, IN THIS ORDER

1. **`build/skills/11-BUILD-VERIFICATION.md`** — your own skill. Read it fully.
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
   **⚠️ THE OVERLAP THAT USED TO BE FLAGGED HERE IS RESOLVED — skill `11-BUILD-VERIFICATION.md` is now a THIN
   ROUTER.** It holds no procedure: the canonical build verification procedure lives in the `00`–`08` set and is
   maintained there only. The earlier instruction to "read both and stop if they disagree" is
   therefore spent, and the one disagreement it named — finality — is settled above. Nothing was
   deleted in the merge: each router names where its unique content went.
3. **THE CANONICAL SKILLS FOR THIS LANE, in this order:** **`02-SOURCE-CHECK.md`** §1 (the source must be current BEFORE the build is touched — Rule 81) ·
   **`03-RUN-CHECK.md`** (the procedure end to end: the build marker at both ends, driving cases
   live, **§6.1** the bug-fix-deploy amendment, **§6.3/§6.4** markers and the automated-case
   hand-off, the Rule-49 queue) · **`04-TESTER-READY.md`** **§6 + §6.1** (the tester brief and the
   **`Defects-for-Testers` workbook** — your primary deliverable) · **`06-DEFECT-PREP.md`**
4. **`build/VIU-ACCESS-METHOD.md`** — how to get live access: network egress, the three session
   cookies, the MITM bridge and the `boot2` hydration pattern.
5. **`build/APP-ACTIONS-PLAYBOOK.md`** — the indexed **STAGING ACTION RECIPES** at the top, plus **§J**
   (TestRail/API declared facts and normalisations). **Rule 27: reuse the recorded recipe; never
   re-discover an action from scratch, and append any genuinely new proven recipe immediately.**
6. **`build/TESTING-RUNBOOK.md`** — the proven staging/TestRail method.
7. **`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md`** — the 4-layer live permission method, if the
   pass touches roles or permissions.
8. **`build/PROD-VS-STAGING-COMPARE-METHOD.md`** — if two environments must be compared (100%
   live-observed, zero NOT-VERIFIED).
9. **`build/NO-WORK-LOSS-STRATEGY.md`** — checkpoint discipline and in-flight kill recovery.
10. **`build/PROCESS-CATALOG.md`** — the index of every callable process.
11. **`build/OUTSTANDING-ITEMS-REGISTER.md`** — what we are already waiting on.
12. The target project's **`build/<project>/PROJECT-STATE.md`**, then its most recent dated pass folder
    (`build-verify-*` / `full-viu-*` / `final-viu-*`) and its **`RECHECK-QUEUE.md`** files.
13. **Closest existing example of this lane's output:**
    `build/report-suite/build-verify-2026-08-10/` — `BUILD-VERIFICATION-2026-08-10.md`,
    `LABEL-LAYER-2026-08-10.md`, `RESUME.md`, `evidence/`, `tools/`.

**⚠️ DO NOT read `CLAUDE.md` end to end** (Rule 88) — `grep -n` for what you need.
**⚠️ CORRECTED 2026-08-21: `CLAUDE.md` IS NOW A SMALL INDEX (~28 KB), AND ITS RULE INDEX RUNS TO
RULE 91 — NOT 62.** The full, verbatim rule texts live in **`build/rules/RULES-01-20.md` ·
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-97.md`**, and **that is where you read the rule you
are about to apply — the index is not the rule.** The two claims previously here — that CLAUDE.md is
"roughly 5,000 lines" and that its "Standing Rules stop at Rule 62" — were true when written and are
both stale; they are corrected rather than deleted so nobody re-derives them.

**At session start also run the standing queue checks:**
`ls build/*/design-*/PENDING-FIGMA-FETCH.md` (Rule 35) and `ls build/*/*/RECHECK-QUEUE.md` (Rule 49).

---

## 3. THE NON-NEGOTIABLE RULES FOR THIS LANE

1. **Rule 6** — TestRail is the only real production system: **no writes without permission.**
2. **Rule 8** — always pair an internal ID with its C-ID **and** the TestRail link.
3. **Rule 9** — the build supplies the **labels**; correct them, never invent them.
4. **Rule 12** — verified means **observed**, with evidence captured that run. Never inferred from
   spec, code, role definitions or prior data. Not observed ⇒ labelled NOT VERIFIED / Blocked with the
   reason. **⚠️ READ THIS WITH §1a — Blocked-with-reason stays a legitimate honest outcome, but it is
   NOT the default for anything you did not observe.** Most unobserved things have a *different*
   defined outcome (Rule 69 marker · the staging-only portal HOLD · Rule 58 hold-and-ask · Rule 14
   seed it · the Rule 97 search drill). **Pick the outcome from §1a's table first; "blocked" is what
   is left over, and Rule 68 then applies to it.**
5. **Rule 13** — live, feature-by-feature testing is the default standard for any test / verify /
   check / confirm request.
6. **Rule 14** — **seed, don't block.** A missing data state is never an acceptable blocker on a
   disposable environment.
7. **Rule 17** — cover the whole population; state total in scope / processed / excluded-with-reason.
8. **Rule 25** — every deviation quotes its source **verbatim** (document + version + anchor + date).
9. **Rule 26 / 26a** — reset roles to template first; re-reset persistently on mid-run drift.
10. **Rule 27** — reuse the recorded action recipes; append new proven ones immediately.
11. **Rule 29** — commit and push after every step and mid-run; path-scoped `git add` only.
12. **Rule 31 / 59** — establish source currency first, and **re-read the sources immediately before
    any writes**, logging **both** timestamps.
13. **Rule 34 / 47** — run sync is **UNION ONLY**; a partial `case_ids` list deletes tests **and their
    results**. Snapshot before, verify every prior result **by id** after.
14. **Rule 36** — every report ends with "OUTSTANDING — what I need from you".
15. **Rule 49** — a non-final build yields **PROVISIONAL** findings: record the build marker, open a
    dated `RECHECK-QUEUE.md`, stamp provenance, never claim completeness. A queue closes only at
    **100%** of rows re-verified.
16. **Rule 50** — **exhaustive then exact**: every case, every field, no sampling; byte-verify every
    write and prove every untouched field byte-identical; on a mismatch **stop the batch**.
17. **Rule 51** — API-only findings are asked about **separately**.
18. **Rule 52 / 53** — if a ticket is authorised: `Story Defect`, parent = the **owning story**, story
    also linked *relates to*, priority **Medium**, no Product Area. **High is barred.** Never convert
    or "restore" someone else's ticket field.
19. **Rule 57** — the build supplies **only** labels and the verdict; it is never a source of expected
    behaviour, and a **closed ticket is not a spec change**.
20. **Rule 58** — an ambiguous source is never resolved from the build: hold and ask.
21. **Rule 60** — the layer split: only labels/navigation, the verdict, and the **HOLD half** of the
    markers go stale on a redeploy. Plain `AUTOMATION: READY` is build-independent. Never use "the
    branch is not final" as a blanket caveat — give numbers.
22. **Rule 61** — the automated suite is the monitor; **ticket status is never evidence about the
    build**.
23. **Rule 62** — no Jira ticket is created without permission (currently under a **"create nothing"**
    hold).
24. **Rule 68** — **a blocker must be PROVED, and it blocks ONLY WHAT IT ACTUALLY BLOCKS.**
    *"We could not see a way"* is an assumption; *"we tried A, B and C, and here is what each
    returned"* is a measurement. **DECOMPOSE the work** — "blocked" is a property of a **question**
    about a case, not of the case: a missing PO answer blocks the **verdict**, not the runnability; a
    missing permission blocks **one step**, not the walk. **STATE THE RESIDUAL, in two lines:**
    *"Blocked for X. Still possible under it: Y. Genuinely impossible until X clears: Z."* A blocked
    item that never names what could still be done is not a report, it is an excuse. **The six
    checkable requirements are in `00-COMMON-CORE.md` §11.4 — read them there; they are not repeated
    here.** See also **§1a**: most things reported as blocked are not.
25. **Rule 69** — a case that **cannot yet be build-verified** keeps its **documented** expectation
    (Rule 57), carries **`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`**,
    gets the under-development line and a `DEFERRED-RUN.md` row — it is a **FINISHED case, NOT a
    blocker**, and it is **excluded from any ready-to-automate figure**. The marker substitutes for a
    plain `AUTOMATION: READY` **only** — never over an `EXPECT FAIL` or a `HOLD`. Procedure:
    **`03-RUN-CHECK.md` §7**.
26. **Rule 71** — automated cases: read-assess → report → **HOLD**; never blanket-skip.
27. **Rule 74** — the multi-login standard: reset role to template → assign to the Technician
    quick-login → test → restore Technician.
28. **Rule 77** — the validity window: a verdict within **≤3 builds and ≤3 source versions** still
    counts, **but show the date**.
29. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

---

## 3a. THE NAVIGATION MAP — READ IT BEFORE YOU NAVIGATE, APPEND AS YOU GO

**`build/<project>/NAVIGATION-MAP.md`** records how each screen is actually reached on this build:
one row per feature/screen — **feature/screen · exact menu path in the build's own on-screen labels ·
URL · branch + build marker observed on · date observed · recorded by**. Full convention:
**`03-RUN-CHECK.md` §9**; new projects copy **`build/NAVIGATION-MAP-TEMPLATE.md`**.

- **Read it FIRST, before you start hunting for a screen** (Rule 27 — reuse the recorded recipe, never
  re-discover). If the project has no map yet, create it from the template as you go.
- **Append the moment a path is confirmed**, in the same pass (Rule 93) — not at the end of the pass.
- **Only what you navigated successfully and observed live goes in** (Rule 12). **Never infer a path
  from source code, a spec, a design or another branch** — a route that exists in code may not be
  deployed or flag-enabled on the branch you are testing (Rule 57).
- **Navigation only, never expected behaviour** — a map entry is never cited in a case's Expected
  Results or provenance line (Rule 57).
- **Paths are branch-specific**: a different branch gets **its own row**, re-observed, never an
  overwrite. Carry the **Rule 91 badge + date** (✅ ≤7 d · 🟠 8–14 d · 🔴 >14 d · ❌ never observed).
- A stale row is a **starting point**; if it fails, **re-observe, correct the row and commit the
  correction in the same pass** — never leave a known-wrong path behind you.
- The map gets you to the screen. **It is never evidence the feature works** — the verdict still comes
  from observing the feature (Rule 12).

---

## 3b. THE STAGING-ONLY CUSTOMER-PORTAL HOLD

> **CANONICAL SOURCE: `build/skills/00-COMMON-CORE.md` §5.0-b(2). This is a working copy — if the two
> ever disagree, §5.0-b wins and this copy is the bug.**

**QA lead, 2026-08-31, verbatim: *"Customer portal related tickets can only be tested on staging and
not on the QA branch. We need to put this marker on such tickets aswell."*** This matters far beyond
one project: **a label or behaviour that lives on a portal surface will be reported "absent" by any
QA-branch probe, forever** — so without this marker a portal case turns into a false "not built"
verdict or a false blocker.

**⇒ THE MARKER — a machine-findable literal, never reworded, exactly as written:**

```
AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch
```

**It is a HOLD, not a fifth literal**, so the CLAUDE.md arithmetic gate **READY + EXPECT-FAIL =
total − HOLD** is unaffected; a portal that does not exist on the branch is *"a genuinely unobtainable
thing"*, so this is not the barred tool-flag excuse. **The wording is FINAL — the QA lead confirmed
this exact string on 2026-08-31; it is never reworded, abbreviated or re-punctuated in isolation, and
`00-COMMON-CORE.md` §5.0-b holds the LOCATIONS list a rename would have to sweep.**

**⇒ SCOPE IT FROM THE CASE'S PRECONDITIONS, NEVER FROM THE WORD "PORTAL".** Only a case whose
**preconditions require a portal-generated artefact** gets the marker. **A case that verifies the
portal feature's ABSENCE on the shop-app path is fully testable on the QA branch and must NOT be
parked.** Worked example, 2026-08-31 (Invoice UI Refresh): **C44954** — *"No paid banner when the
invoice has no portal-processed payment"* — **is build verified**, while **C44947 / C44951 / C44952 /
C45175** are staging-only. Four further cases mention the banner in passing and **C45184** names it as
an **exclusion** (*"The only exception is the Paid banner's 'Date / Time' field"*) — **none of those
five are portal-gated.**

---

## 4. HARD GATES — ASK FIRST, EVERY TIME

| Gate | Rule | The ask |
|---|---|---|
| **Last-done date + re-run** | 80 | Before re-running a verification, **state when it was last done and against which build/version, then ASK whether to re-run.** |
| **Source verification** | 81 (refined) | **Do not auto-run it.** Tell him the task needs source-current cases, give the **last source-verify date + version**, **ask proceed WITH or WITHOUT — and WAIT** for the answer. |
| **TestRail writes** | 6 | No `update_case` / `add_case` / `delete_case` / **run result** write without explicit permission. |
| **Jira ticket creation** | 62 + the **"create nothing until my next order"** hold of 2026-08-10 | Prepare the ticket text with a recommendation and **stop at the button.** Permission is **per ask**; a batch approval never covers a later ticket; the finding being real and obviously worth filing is **not** permission. |
| **API-only findings** | 51 | Asked **separately**, even inside an approved batch. Reachability test: invisible to a user **and** to a manual tester ⇒ API-related. |
| **Automated cases** | 71 | Read-assess first, report, then **HOLD** for his decision. |
| **Which process** | 11 | On a new/updated spec or a VIU request, ask which process(es) he wants. |
| **Live check + access** | 22 | Ask up front for cookies + env/branch + feature-flag state, naming every item that needs live observation. |

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
> **PO attributions are never mixed and never guessed.** Existing known attributions — Branko =
> Filters / Schedule / Global Search (historic) · Chris Ward = Report Suite / Fees & Discounts ·
> Milos = Simple Flow — must **not** be assumed to carry over. Ask.
> *(For this lane the developer names matter for a different reason: they tell you whose branch you are
> testing and who to name when a finding is written up — but a developer's opinion about intended
> behaviour is not a product source, and it never overrules the PRD or a PO answer.)*

> **⚠️ GLOBAL SEARCH ALREADY EXISTS IN THIS WORKSPACE — it is a REVIVAL, not a greenfield build.**
> **86 cases are already authored** (15 sections, adversarially reviewed clean, import ready, never
> pushed to TestRail); the project was **postponed** on 2026-07-27; canonical resume doc
> **`build/global-search/PROJECT-STATE.md`**. Before verifying anything against a build, the existing
> cases must be reconciled against the current sources — which is handoff 1's and handoff 3's work,
> not yours. Say so rather than verifying stale cases and reporting confident verdicts on them.

---

## 6. MISSING INPUTS TO REQUEST BEFORE STARTING — PER PROJECT

1. **The PO's name** — who settles a product question when the sources disagree?
2. **The spec / PRD** — Confluence URL **and** export/MCP access, so a deviation can quote its source
   verbatim.
3. **The designs** — Claude design, Figma (file + node ids), and the technical design. Flag any undated
   editable share link: it cannot be dated, so latest-wins cannot be applied to it.
4. **The epic / Jira key** — needed to name the owning story if a ticket is later authorised.
5. **The engineering tech plan** (Rule 30) — remind him if it was never supplied.
6. **The QA branch / environment + the feature-flag or settings state**, and **fresh session cookies**
   (`sv_sso_session`, `PHPSESSID`, `cf_clearance` for `.qa.shopview.com`). These die at roughly 24
   hours **or on deploy** — this is the single most common blocker in this lane.
7. **A second sign-in / non-administrator login** if any permission case must be driven, plus
   confirmation that no sibling worker is sharing the session (`quick-login` and `switch-user` rotate
   it).
8. **The TestRail target** — which run, if any, and whether a union sync will be needed afterwards.

State plainly what each missing item **blocks**, who owes it, and since when (Rule 36).

---

## 7. DEFINITION OF DONE FOR THIS LANE

- The **build marker** is captured at **pass start and pass end** — `<meta name="app-version">`,
  `last-modified`, `etag`, and the sha256 of `index.html`, each with its UTC timestamp — and proven
  **byte-identical** across the reads, so nothing redeployed under the pass.
- **Every case in scope carries a definite outcome:** PASS · DEVIATION (with its source quoted
  verbatim and its ticket, or the prepared ticket text if creation is on hold) · HOLD (with the exact
  thing it is waiting on) · NOT OBSERVED (with the written reason). **Zero partly-observed, zero
  silently skipped.** Counted two independent ways that agree.
- The **honest split is stated in numbers**, never as a banner: *"N of M observed on build
  `<marker>`; the remaining M−N carry their last recorded check."*
- A dated **`RECHECK-QUEUE.md`** exists with one row per verdicted case, OPEN/CLOSED header, and the
  re-check obligation and trigger per row (Rule 49).
- If writes were authorised: **every write byte-verified**, every untouched field proven
  byte-identical, the per-operation audit log complete (operation · C-ID · HTTP status · verification
  result), and the **run proven undamaged** — `include_all` state recorded, case_id sets equal both
  directions, **every prior result present by id** with no graded field changed.
- The environment is **left clean**: throwaway data named `ZZAUTOTEST` and deleted, roles restored to
  template, settings and location restored and **proven byte-identical** — a restore is not restored
  until it is compared field by field.
- Everything **committed and pushed**; no credential ever committed.

**Deliverable — the primary output of this lane:**
`build/<project>/build-verify-<date>/<Project>_Defects-for-Testers_<date>.xlsx`
One row per non-passed case, with: internal ID · **C-ID** · **TestRail link** · title · what the
document requires (anchor + version) · what the build actually does (observed, with the evidence
reference) · verdict · ticket key or "ticket prepared, not filed" · and a plain **"What needs to be
done"** in words a non-technical QA can act on. A tab per verdict status plus a Summary tab.
**Never a bare DEVIATION / Failed / Blocked with no plain next step.**
Alongside it: `FINDINGS.md` · `RECHECK-QUEUE.md` · `SOURCE-CURRENCY.md` · `CHANGES-MADE.md` ·
`testrail-execution-log.md` · `API-ASK.md` · `DELIBERATE-DECISIONS.md` · `evidence/`.
*(Honest note: no `*Defects-for-Testers*.xlsx` exists in the repo yet — the first one sets the
template. Mirror the established workbook conventions, Rule 16.)*

---

## 8. HOW TO REPORT BACK

Plain layman words, simple status format, these headings:

- **What I did**
- **What I found** — each finding with the source quoted verbatim and the case named as internal ID +
  C-ID + link.
- **What needs to be done** — a plain next step for every non-passed row.
- **Other actions**
- **OUTSTANDING — what I need from you** — always present; **"nothing outstanding"** if true. Sweep
  all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
  access/credentials · deferred or HELD decisions · what another team owes. For anything blocked on
  the QA lead himself, give the five Rule-48 fields: his ruling quoted verbatim · when he gave it and
  what question it answered · the named cases it blocks (internal ID + C-ID + link) · why it was
  reasonable or what has changed since · the one thing that would unblock it, and from whom.

Always **state the TestRail update status explicitly**, even when it is "nothing pushed", and always
name the build marker the verdicts rest on.

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
> below, which carries all twelve clauses in full. Full texts: `build/rules/RULES-61-97.md`.

---

## SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)

**This section is MANDATORY in every handoff.** Full rule text: `build/rules/RULES-61-97.md` (Rule 97,
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
