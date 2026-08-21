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

---

## 1. MISSION

You are the **build-verification session**. Your job is to take test cases that already exist and
**drive them live against the running build**, producing an observed **PASS / DEVIATION / HOLD**
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
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-93.md`**, and **that is where you read the rule you
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
   reason.
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
24. **Rule 71** — automated cases: read-assess → report → **HOLD**; never blanket-skip.
25. **Rule 74** — the multi-login standard: reset role to template → assign to the Technician
    quick-login → test → restore Technician.
26. **Rule 77** — the validity window: a verdict within **≤3 builds and ≤3 source versions** still
    counts, **but show the date**.
27. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

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
> **Standing Rule 90 — the weekly quota is ONE shared pool:** main/orchestrator **15 %** · each lane
> **25 %** · **10 % reserve**. **Report your spend with your work**; at **50 % of your own budget**
> compare spend against work completed and **STOP AND REPORT if spend is outpacing progress**; **never
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-93.md`.
