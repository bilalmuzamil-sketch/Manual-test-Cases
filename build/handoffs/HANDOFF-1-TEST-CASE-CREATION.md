# HANDOFF 1 — TEST-CASE CREATION SESSION

> **Copy-paste this whole file into a fresh session as its briefing.**
> Written 2026-08-21. Repo: `Manual-test-Cases` (PUBLIC). Working directory:
> `/home/user/Manual-test-Cases`.

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
`RULES-21-40.md` · `RULES-41-60.md` · `RULES-61-91.md`**, and **that is where you read the rule you
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
    and the list is open-ended.
27. **Rule 58** — an ambiguous source is never resolved from the build: hold and ask.
28. **Rule 61** — every expect-fail case names the symptom and all three outcomes.
29. **Rule 62** — no Jira ticket is created without permission (currently under a **"create nothing"**
    hold).
30. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

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
> **Standing Rule 90 — the weekly quota is ONE shared pool:** main/orchestrator **15 %** · each lane
> **25 %** · **10 % reserve**. **Report your spend with your work**; at **50 % of your own budget**
> compare spend against work completed and **STOP AND REPORT if spend is outpacing progress**; **never
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-91.md`.
