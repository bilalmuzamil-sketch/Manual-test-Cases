# HANDOFF 1 — TEST-CASE CREATION SESSION

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

You are the **test-case creation session**. Your job is to author **new test cases** for a project
from its documented sources — the spec/PRD, the epic's stories, the designs, the tech plan and the
product owner's written answers — and to prove that the set of cases you produce actually covers the
requirements, in both directions. You write the cases, the coverage verdict table, the surface matrix,
the deliberate-decisions register and the TestRail import, and you close every pass with the Ruthless
Usefulness Audit. **You must NEVER do the following:** you do not run build verification (that is
handoff 2), you do not run a VIU pass or rewrite existing case wording from the build (that is handoff
3), you never treat what the build does as the expected behaviour, you never write to TestRail or
create a Jira ticket without explicit permission asked for and granted, and you never touch a test
case authored by somebody else. **Stay in your lane and report cross-lane findings back to the main
session** rather than acting on them — if while authoring you notice something the build appears to
get wrong, or a case belonging to another lane that looks stale, **write it down and hand it back**.

---

## 1a. 🛑 NO BUILD ACCESS IS NOT A BLOCKER ON THIS LANE — AND YOU STILL OWN THE MARKERS

**READ THIS BEFORE §2.** On 2026-08-31 a session in the neighbouring lane parked **18 cases as
"blocked"** when every one of them already had a defined deliverable outcome written down. That
mistake is available to this lane too, in a slightly different shape: **waiting on the build.**

**THE RULE 57 COROLLARY, AND FOR THIS LANE IT IS THE WHOLE POINT.** Expected behaviour comes from the
**DOCUMENTS** — spec/PRD, the epic's stories, the PO's verified answers, the design, Figma, the
technical design. From the build we take **exactly two things**: the **on-screen labels / navigation
path**, and the **pass / fail verdict**. **Therefore a case can be fully authored, tester-ready and
FINISHED with zero build access.** *"No build"*, *"the branch is down"*, *"cookies are 401"* are
statements about **two fields**, never about the case. Author it, mark the unconfirmable labels
**"VIU-confirm"** (Rule 9), and hand the label pass to lane 3 — **do not stop, and never park the
requirement.**

**AND YOU DECIDE THE MARKER, so you must know the two that are not `AUTOMATION: READY`.** Both are
machine-findable literals — **byte-exact, never reworded**:

| What the requirement needs | The marker you author it with |
|---|---|
| **The feature is not built yet** (Rule 69) | `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>` — plus the under-development line and a `DEFERRED-RUN.md` row. It is a **FINISHED case, NOT a blocker**, it keeps its **documented** expectation, it is **excluded from any ready-to-automate figure**, and it substitutes for a **plain `AUTOMATION: READY` only** — never over an `EXPECT FAIL` or a `HOLD`. Procedure: `03-RUN-CHECK.md` §7. |
| **A precondition requires a customer-portal artefact** | `AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch` — the portal does not exist on a QA branch, so the case can only ever run on staging. Canonical: `00-COMMON-CORE.md` §5.0-b(2). |

**⇒ SCOPE THE PORTAL HOLD FROM THE CASE'S PRECONDITIONS, NEVER FROM THE WORD "PORTAL".** Only a case
whose **preconditions require a portal-generated artefact** gets it. **A case that verifies the portal
feature's ABSENCE on the shop-app path is fully testable on the QA branch and must NOT be parked** —
2026-08-31 worked example: C44954 (*"No paid banner when the invoice has no portal-processed
payment"*) is build verified, while C44947 / C44951 / C44952 / C45175 are staging-only. It is a
**HOLD**, so the CLAUDE.md arithmetic gate **READY + EXPECT-FAIL = total − HOLD** is unaffected.

**THE OTHER TWO SHAPES YOU WILL HIT WHILE AUTHORING, AND NEITHER IS "BLOCKED":**

- **The source is ambiguous** → **Rule 58: HOLD the case and add a PO-question row.** The deliverable
  is *a held case plus a question*, not a blocker — and an ambiguous source is **NEVER** resolved by
  looking at the build.
- **You cannot find something in the repo / a source** → the **Rule 97 search drill** (the mandatory
  section near the end of this file) **before** you report it as unavailable.

**ONLY AFTER ALL OF THE ABOVE does anything earn the word "blocked" — and then Rule 68 applies:
"blocked" is a property of a QUESTION about a case, not of the case. DECOMPOSE, and STATE THE
RESIDUAL: *"Blocked for X. Still possible under it: Y. Genuinely impossible until X clears: Z."***
The six checkable requirements are in **`00-COMMON-CORE.md` §11.4** — read them there.

**Canonical fuller treatment — read it, do not work from this section alone:
`03-RUN-CHECK.md` §8.0-a.**

---

## 2. READ THESE FIRST, IN THIS ORDER

1. **`build/skills/10-TEST-CASE-CREATION.md`** — your own skill. Read it fully; it is the operating
   manual for this lane.
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
   **⚠️ THE OVERLAP THAT USED TO BE FLAGGED HERE IS RESOLVED — skill `10-TEST-CASE-CREATION.md` is now a THIN
   ROUTER.** It holds no procedure: the canonical test-case creation procedure lives in the `00`–`08` set and is
   maintained there only. The earlier instruction to "read both and stop if they disagree" is
   therefore spent, and the one disagreement it named — finality — is settled above. Nothing was
   deleted in the merge: each router names where its unique content went.
3. **THE CANONICAL SKILLS FOR THIS LANE, in this order:** **`02-SOURCE-CHECK.md`** (make the source current FIRST) · **`01-CASE-BUILD.md`** (the authoring
   procedure end to end, including **§9** the Ruthless Usefulness Audit gate, **§10** push + run
   sync and **§11** new-project onboarding) · **`COVERAGE-MATRIX.md`** (the completeness proof) ·
   **`06-DEFECT-PREP.md`** (only if authoring surfaces a defect — prepare it, never file it)
3a. **`17-REGRESSION-IMPACT-V1-TO-V2.md` — MANDATORY THE MOMENT YOUR PROJECT IS A V2 / UPGRADE of an
   existing feature (intake type ii, Rule 96).** A V2 spec describes only **what CHANGES** and is
   **SILENT about everything else**, so without this nothing converts that silence into tests and a
   V2 build can break a V1 behaviour with every case still passing. It derives the **INVARIANT SET**
   (V1 baseline − changed ∪ removed ∪ replaced), escalates the **dangerous silences** and every
   **code-vs-document conflict** as PO decision items, and retires the V1 cases V2 supersedes. It
   runs **BEFORE or ALONGSIDE** authoring, never after, and needs **no build and no cookies**.
   **ASK THE PROJECT TYPE FIRST** — `15-NEW-PROJECT-INTAKE.md` §1a: (i) NEW · (ii) V2/UPGRADE ·
   (iii) REVIVAL. Never infer it from the project's name.
4. **`build/PROCESS-AUTHORING-STANDARD.md`** — the required shape of any process/deliverable you
   produce.
5. **`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`** — the mandatory closing gate of every authoring
   pass.
6. **`build/MISSING-TRACEABILITY-PROCESS.md`** — how to find and backfill unsourced cases.
7. **`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`** — read the diff/coverage sections; you need
   the per-requirement verdict table format.
8. **`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`** — read the **wording** half only, so your new
   cases are written in a form the VIU lane will not have to rewrite.
9. **`build/QA-QUALITY-PIPELINE-EXPLAINER.md`** — the 12-step quality story your work sits inside.
10. **`build/PROCESS-CATALOG.md`** — the index of every callable process.
11. **`build/OUTSTANDING-ITEMS-REGISTER.md`** — what we are already waiting on, so you do not re-ask
    a question a source has already answered.
12. **`build/NO-WORK-LOSS-STRATEGY.md`** — checkpoint discipline.
13. The target project's **`build/<project>/PROJECT-STATE.md`**, if the project already exists.

**⚠️ DO NOT read `CLAUDE.md` end to end** (Rule 88) — `grep -n` for what you need.
**⚠️ CORRECTED 2026-08-21: `CLAUDE.md` IS NOW A SMALL INDEX (~28 KB), AND ITS RULE INDEX RUNS TO
RULE 91 — NOT 62.** The full, verbatim rule texts live in **`build/rules/RULES-01-20.md` ·
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-97.md`**, and **that is where you read the rule you
are about to apply — the index is not the rule.** The two claims previously here — that CLAUDE.md is
"roughly 5,000 lines" and that its "Standing Rules stop at Rule 62" — were true when written and are
both stale; they are corrected rather than deleted so nobody re-derives them.

---

## 3. THE NON-NEGOTIABLE RULES FOR THIS LANE

1. **Rule 1** — never start on a half-spec; if inputs are incomplete, stop and ask.
2. **Rule 4** — any case mentioning an endpoint, HTTP verb or status code goes in an **"API"**-titled
   section.
3. **Rule 6** — TestRail is the only real production system: **no writes without permission.**
4. **Rule 7** — plain layman wording; nothing technical in what a tester or a PO reads.
5. **Rule 8** — always pair an internal ID with its C-ID **and** the TestRail link.
6. **Rule 9** — exact build labels, never invented; mark unconfirmable labels **"VIU-confirm"**.
7. **Rule 16** — mirror the established deliverable format 1:1; never invent a new layout.
8. **Rule 17** — complete data in, complete data out: enumerate the full input set, cover the whole
   population, state the totals.
9. **Rule 19** — human-readable filenames, full names, never cryptic abbreviations.
10. **Rule 20** — `refs` carries **ticket + spec anchor together**; a case with neither is not
    authentic.
11. **Rule 21** — a new process gets its **catalog row in the same turn**.
12. **Rule 28** — the three-dimension Ruthless Usefulness Audit is the mandatory closing gate,
    including the cross-case contradiction sweep.
13. **Rule 29** — commit and push after every step; path-scoped `git add` only.
14. **Rule 31** — establish the currency of **every** source before doing anything, and emit the
    SOURCE-CURRENCY block.
15. **Rule 32** — the latest authoritative source wins; establish the **requirement's** own date, not
    its page's date.
16. **Rule 33** — authority precedence: PO ruling → QA lead's ruling → our live-verified findings → a
    reviewer's claim. Judge the claim, not the claimant.
17. **Rule 36** — every report ends with "OUTSTANDING — what I need from you".
18. **Rule 40** — trace a requirement across **every surface**; ship the surface matrix.
19. **Rule 42** — no closed enumerations without a version-pinned anchor; prefer scope-conditional
    wording.
20. **Rule 43** — one coverage verdict row **per requirement**, verbatim text quoted; matrices
    re-derived, never patched.
21. **Rule 45** — the outside-in gap hunt, both directions; a "covered" verdict needs **both texts
    quoted side by side**, one row **per assertion**.
22. **Rule 46** — ship the deliberate-decisions register, all six fields, never back-dated.
23. **Rule 54** — the two-sentence provenance line ends every case; sentence 1 names documents only.
24. **Rule 55** — a PO questionnaire names the project **and** the feature on **every row**, in
    extremely simple language.
25. **Rule 56** — disclose a divergence where one exists; never manufacture one where it does not.
26. **Rule 57** — expected behaviour comes only from documents (a)–(g); the build is never a source,
    and the list is open-ended. **⇒ a case is authorable and FINISHABLE with zero build access — see
    §1a.**
27. **Rule 58** — an ambiguous source is never resolved from the build: **hold the case and add a
    PO-question row.** A held case plus a question is the deliverable; it is not a blocker.
28. **Rule 61** — every expect-fail case names the symptom and all three outcomes.
28a. **Rule 69** — a requirement whose feature is **not built yet** is authored to completion with
    **`AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`**, the
    under-development line and a `DEFERRED-RUN.md` row. **A FINISHED case, not a blocker**, excluded
    from any ready-to-automate figure (§1a; `03-RUN-CHECK.md` §7).
28b. **Rule 68** — **a blocker must be PROVED and blocks only what it ACTUALLY blocks.** "Blocked" is
    a property of a **question** about a case, not of the case. **DECOMPOSE and state the residual**
    (`00-COMMON-CORE.md` §11.4). Most things reported as blocked have a defined outcome instead —
    §1a's list.
29. **Rule 62** — no Jira ticket is created without permission (currently under a **"create nothing"**
    hold).
30. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

---

## 3a. THE NAVIGATION MAP — READ IT BEFORE YOU NAVIGATE, APPEND AS YOU GO

Whenever this lane goes to the build for the one thing it may take from it — the **on-screen labels and
the navigation path** (Rule 57) — go through **`build/<project>/NAVIGATION-MAP.md`** first. If the
project has no map, create it from **`build/NAVIGATION-MAP-TEMPLATE.md`**. Full convention:
**`build/skills/03-RUN-CHECK.md` §9** — read it there rather than working from this summary.

- **Read it BEFORE you hunt for a screen** (Rule 27), and **append the moment a path is confirmed**, in
  the same pass — not as a later cleanup (Rule 93).
- **Only paths navigated successfully and observed live go in** (Rule 12). **Never infer one from
  product source code, a spec, a design or another branch** (Rule 57).
- **Navigation only.** A map entry is **never** cited in a case's Expected Results or in its provenance
  line — expectations come from the documents (Rules 54 / 57).
- **Rows are branch-specific** and carry the **Rule 91 badge with the date** (✅ ≤7 d · 🟠 8–14 d ·
  🔴 >14 d · ❌ never observed); another branch gets its own row, never an overwrite.

---

## 4. HARD GATES — ASK FIRST, EVERY TIME

| Gate | Rule | The ask |
|---|---|---|
| **TestRail writes** | 6 | *"May I push these N cases with `add_case` / `update_case`?"* `add_case` needs `custom_atmstatus:1`. Nothing is written until he answers. |
| **Jira ticket creation** | 62 + the **"create nothing until my next order"** hold of 2026-08-10 | Prepare the ticket text, present it with a recommendation, **stop at the button.** Permission is **per ask** — an earlier batch approval never covers a later ticket, and a finding being obviously worth filing is not permission. |
| **Automated cases** | 71 | Never blanket-skip them. **Read-assess first, report what you found, then HOLD** for the QA lead's decision. |
| **API-related tickets** | 51 | Asked **separately**, even inside an approved batch. The test is reachability: invisible to a user **and** to a manual tester ⇒ API-related. |
| **Which process to run** | 11 | On a new/updated spec or a VIU request, **ask** which process(es) he wants; never assume. |
| **Last-done date + re-run** | 80 | Before repeating any pass, state when it was last done and against which build/version, then **ask** whether to re-run. |
| **Source verification** | 81 (refined) | **Do not auto-run it.** Say the task needs source-current cases, give the last source-verify date + version, **ask proceed WITH or WITHOUT, and WAIT.** |
| **Live-build check + access** | 22 | Name every item needing live observation and ask up front for cookies + env/branch + flag state. |

---

## 5. THE FIVE NEW PROJECTS — STARTING MONDAY 24 AUGUST 2026

Each project below is listed with the **DEVELOPER / engineering lead** named for it. Read this table
carefully, because the distinction matters:

| Project | **DEVELOPER(S) / engineering lead** | Product Owner |
|---|---|---|
| Parts on Work Orders | **Stefan Vukovic** | **UNKNOWN — must be asked for** |
| Global Search | **Sinisa Nogic, Nikola Milosevic** | **UNKNOWN — must be asked for** |
| Invoicing Refresh | **Minja Kotlajic** | **UNKNOWN — must be asked for** |
| Simplified Workflow v2 | **Parth Faladu** | **UNKNOWN — must be asked for** |
| Accounting | **Nikola Mitrovic** | **UNKNOWN — must be asked for** |

> **⚠️ THE NAMES ABOVE ARE DEVELOPERS / LEADS, NOT PRODUCT OWNERS.**
> **The PO for each of these five projects is UNKNOWN and must be ASKED FOR.**
> **PO attributions are never mixed and never guessed.** In this workspace the known PO
> attributions are: Branko = Filters / Schedule / Global Search (historic) · Chris Ward = Report Suite
> / Fees & Discounts · Milos = Simple Flow. Do **not** assume any of those carries over to a new
> project — ask.

> **⚠️ GLOBAL SEARCH ALREADY EXISTS IN THIS WORKSPACE.** It is **not a greenfield build**. There are
> **86 cases already authored** across 15 sections (adversarially reviewed clean, import ready,
> TestRail push was never made), the project was **postponed** by a 2026-07-27 ruling, and its
> canonical resume doc is **`build/global-search/PROJECT-STATE.md`**. Treat the new Global Search work
> as a **REVIVAL to reconcile** — re-establish source currency (Rule 31), diff the current spec and
> epic against the 2026-07-16 ingest, re-derive coverage (Rule 43), and only then decide what is new.
> Note also the 2026-07-31 ownership ruling that the ⌘K "Search or ask a question" palette is tested
> under Global Search, so the 9 retired Filters palette cases (FLT-SRCH-01..09, never pushed) land
> here; open question OQ-3 (whether AI / "ask a question" is in V1) is **still open**.

---

## 6. MISSING INPUTS TO REQUEST BEFORE STARTING — PER PROJECT

Ask for all of these, per project, before authoring anything (Rule 1). This is the exact list to
paste back to the QA lead:

1. **The PO's name** — who owns product decisions for this project?
2. **The spec / PRD** — the Confluence page URL **and** an export or MCP access (the page is
   SSO-walled).
3. **The designs** — all three artefact types that count: the **Claude design** (prototype export or
   share page), the **Figma** file + node ids, and the **technical design**. If a design is an undated
   editable share link, say so — it cannot be dated, so latest-wins cannot be applied to it.
4. **The epic / Jira key** — plus confirmation of the child story set.
5. **The engineering tech plan** (Rule 30) — if it was not supplied, remind him.
6. **The QA branch / environment + the feature-flag or settings state** — and fresh session cookies
   when live work begins.
7. **The TestRail target** — which section/group the new cases belong in, and whether a test run
   exists that will need a union sync afterwards (Rules 34/47).

State plainly what each missing item **blocks** — e.g. *"no epic key means Rule 20 traceability cannot
be satisfied at all"* — with who owes it and since when (Rule 36).

---

## 7. DEFINITION OF DONE FOR THIS LANE

A creation pass is done when **all** of these are true:

- The **SOURCE-CURRENCY block** is written, per source, with CURRENT / STALE / PARTIAL verdicts.
- Every requirement has **its own coverage verdict row** with verbatim text, and the row count
  reconciles with the requirement count (Rule 43); the matrix ran **both directions**.
- Every multi-surface requirement has **one verdict per surface** (Rule 40) and **one row per
  assertion** (Rule 45(e)), with both texts quoted.
- Every case carries: a ≤80-character title · numbered preconditions/steps/expected with `<br>` line
  breaks · plain layman wording with any unconfirmable label marked **VIU-confirm** · `refs` in the
  form `<TICKET> (<spec-anchor>, spec v<N> <date>)` · the **two-sentence Rule-54 provenance line** ·
  and **exactly one AUTOMATION marker as the last line**, blank line before and after.
- Every expect-fail case names the **symptom and the three outcomes** (Rule 61).
- The **outside-in gap hunt** ran, with all five checks reported (Rule 45).
- The **Ruthless Usefulness Audit** ran over **100%** of the cases on all three dimensions, including
  the cross-case contradiction sweep, with the tally shipped and **no unresolved contradiction**
  (Rule 28).
- The **deliberate-decisions register** ships with the suite, six fields per entry (Rule 46).
- The **import** is regenerated in the established format, header hash-identical to its peers,
  VIU-word-free and flag-word-free, shredding guard passed; `testrail-id-map.csv` has 0 blank C-IDs
  and a full `refs` column; the four counts reconcile set-equal both ways.
- Everything is **committed and pushed** (Rule 29), and nothing containing a credential was committed.

**Deliverable set:** `build/<project>/` with `PROJECT-STATE.md`, `requirements.md`, `cases/`,
`testrail-id-map.csv`, `coverage-matrix.md`, the dated pass folder (`FINDINGS.md`,
`SOURCE-CURRENCY.md`, `DELIBERATE-DECISIONS.md`, the audit output), and
`testrail-import/<project>-v1-testrail-import.csv` + `.xlsx`.

---

## 8. HOW TO REPORT BACK

Write in **plain layman words**, in the simple status format, under these headings:

- **What I did**
- **What I found**
- **What needs to be done** — and for every non-passed or blocked item, a plain
  *"what needs to be done"* a non-technical QA can act on.
- **Other actions**
- **OUTSTANDING — what I need from you** — always present; say **"nothing outstanding"** if that is
  true. Sweep all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
  access/credentials · deferred or HELD decisions · what another team owes. For anything blocked on
  the QA lead himself, give the five Rule-48 fields: quote his ruling verbatim · when he gave it and
  what question it answered · the named cases it blocks (internal ID + C-ID + link) · why it was
  reasonable or what has changed · the single thing that would unblock it and from whom.

Always name cases as **internal ID + C-ID + link**, and state the **TestRail update status
explicitly** even when it is "nothing pushed".

**🔑 EVERY VERIFICATION CLAIM CARRIES A RULE-91 FRESHNESS BADGE AND ITS DATE — in the report, in every
table, and in every workbook you produce.** The scheme, measured from the last-checked date to today:

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
be used to suppress the other.

Tool: **`build/testing-tools/verification_badge.py`** — read-only, and it **requires an explicit
`--today YYYY-MM-DD`**, because a freshness figure computed off an implicit clock cannot be
reproduced by the next reader.

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
