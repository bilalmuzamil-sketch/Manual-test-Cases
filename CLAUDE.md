# ShopView Manual Test Cases — CLAUDE.md (INDEX)

## 🔴 READ THIS FIRST

**THIS FILE IS AN INDEX, NOT THE RULES.** It exists so that it LOADS COMPLETELY. The rule texts it
points at are the authority; this file only tells you which rules exist and where each one lives.

- **THE FULL RULE TEXTS LIVE IN `build/rules/RULES-*.md` AND MUST BE CONSULTED FOR ANY RULE YOU ARE
  ABOUT TO APPLY.** Read the rule, in full, in its file — before acting on it. **The one-line index
  entry below is NOT the rule** and may not be quoted, relied on, or argued from as if it were.
- **THE WHOLE FORMER CLAUDE.md IS ARCHIVED VERBATIM AT `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md`**
  (738,210 bytes, sha256 `2d715d75…`). Nothing was deleted in this reorganisation; the split was
  byte-verified both ways and the hashes are recorded in `build/rules/INTEGRITY.md`.
- **PER-PROJECT HISTORY** is in `build/rules/PROJECT-HISTORY-ARCHIVE.md`. The **canonical live
  document for each project is its own `build/<project>/PROJECT-STATE.md`** — read that first.

### ⚠️ WHY THIS INDEX EXISTS — THE FAILURE IT FIXES

The previous CLAUDE.md was **738 KB / roughly 183,000 tokens**, and it was **TRUNCATED ON AUTO-LOAD
AT RULE 62**. Sessions were therefore running with **Rules 63–88 SILENTLY ABSENT** while believing
they had read the whole file. A rule you have never seen is a rule you will break.

**THEREFORE: NEVER ASSUME YOU HAVE SEEN ALL THE RULES.** There are **90 numbered Standing Rules**.
Count them in the index below. If you are
about to apply a rule, open its file and read it. **NEVER read
`build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` whole** — it will exhaust your context exactly as the
old file did; grep it, or read the relevant `RULES-*.md`.

---

## 1 · CRITICAL CORE — obey these even if you read nothing else

These are stated here **in full** because a session that gets only this far must still be safe.

- **NO TESTRAIL WRITE WITHOUT EXPLICIT PERMISSION (6).** TestRail is the only real production system.
  No `add_case` / `update_case` / `delete_case` / run write / result write without the QA lead's
  explicit go-ahead. Everything else (staging, QA, prod test orgs, QuickBooks) is disposable — act
  freely there, tag throwaway data `ZZAUTOTEST`, restore what you change.
- **NO JIRA TICKET CREATION WITHOUT PERMISSION, AND A CREATION HOLD IS ACTIVE (62).** Permission is
  **PER ASK** — an earlier batch approval never covers a later ticket, and a finding being real and
  obviously worth filing is not permission. **ACTIVE HOLD (QA lead, 2026-08-10, verbatim: *"Do not
  create anything until my next order."*)** — no Jira ticket, no new TestRail case, no new artefact in
  any external system of record. **`update_case` on EXISTING cases CONTINUES — that is correction, not
  creation.** **This hold is TEMPORARY with a lift condition (his next order) — a session reading this
  later must CHECK whether it has been lifted, not assume it is standing law.** Register row **H1**.
- **SECRETS: `/tmp` ONLY, `chmod 600`, NEVER COMMITTED — THIS REPO IS PUBLIC (82).** Cookies, tokens,
  passwords, OTP codes live in `/tmp` and nowhere else; never in a log, an error paste, or a commit.
  **Before every commit run the REAL scanner: `python3 build/testing-tools/scan_secrets.py --staged`**
  — exit 1 means REFUSE to commit. **Never claim a scan that did not run.**
- **EXPECTED BEHAVIOUR COMES FROM THE DOCUMENTS, NEVER FROM THE BUILD (57).** The sources are: the
  **spec/PRD**, the **epic's stories**, the **PO's verified answers**, the **design**, **Figma**, the
  **technical design**, **shared `.md` files**, and **any newer written statement** shared with us —
  and the list is **OPEN-ENDED**: a new document type counts without a rule amendment. **From the build
  we take EXACTLY TWO THINGS: the on-screen labels/navigation, and the pass/fail verdict.** If the
  build differs, the case KEEPS the documented expectation and becomes a deviation with a ticket.
  **A closed ticket is not a spec change. An ambiguous source is never resolved by looking at the
  build (58) — hold the case and ask.**
- **VERIFIED MEANS OBSERVED, NEVER INFERRED (12).** Only mark Verified / Pass / Fail / present /
  absent if it was observed live, with evidence captured that run. Anything not observed is labelled
  **NOT VERIFIED** or **Blocked-with-reason**. Never fill a gap with inference to look complete.
- **NEVER BULK-READ; SCRIPT THE BULK WORK (88).** A session with direct tools must not read hundreds
  of cases, spec bodies or archives into its own context. Write a script, run it, read its SUMMARY.
  Never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` (or any 100 KB+ artefact) whole.
- **MINIMISE SUBAGENT SPAWNS (76).** Every spawn pays the full context tax. Batch related work into
  one worker; piggyback cheap checks onto the next substantive worker (78) rather than spending a
  dedicated spawn on them.
- **STRATEGY FIRST (79).** Before starting ANY task, devise or recall the smartest quota-efficient
  plan — then begin. One pass, then exit.
- **TELL THE LAST-DONE DATE AND ASK BEFORE RE-RUNNING (80).** Never silently repeat a verification,
  VIU or ordered task: say when it was last done and ask whether to run it again. A check within the
  last 3 builds / 3 source versions still COUNTS, with its date shown (77).
- **SOURCE VERIFICATION IS OFFERED AND GATED, NEVER AUTO-RUN (81).** Make the source current FIRST,
  but ask before spending the quota on it.
- **AUTOMATED CASES ARE READ-ASSESSED, THEN HELD FOR THE QA LEAD (71).** Never change or delete a case
  TestRail flags as Automated without his go-ahead; if a pass does change one, TELL VLAD (65).
- **COMMIT AND PUSH AFTER EVERY STEP, PATH-SCOPED (29).** Git is the only durable store; the container
  and `/tmp` are ephemeral. `git add -- <paths>` only — **never `git add -A` / `git add .`**.
- **ALWAYS PAIR AN INTERNAL ID WITH ITS C-ID AND LINK (8).** Never a bare `FLT-…`/`SCH-…`: give
  `C#####` and `https://shopview.testrail.io/index.php?/cases/view/<id>` — in files AND in chat.
- **EVERY REPORT ENDS WITH "OUTSTANDING — what I need from you" (36).** Say *"nothing outstanding"* if
  that is true; never omit the section. Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current.
- **PLAIN LAYMAN WORDING (7/9).** Tester-facing and PO-facing text uses the build's exact labels and
  no jargon — no case IDs, spec anchors, HTTP terms or internal names in what they read.
- **FOREIGN CASES AND TICKETS ARE HANDS-OFF (38).** Report, never edit. State both numbers: ours N /
  live total M.

---

## 2 · THE RULE INDEX — all 90 rules, and where each one lives

**Read the rule in its file before applying it.** One line per rule; the line is a locator, not the
rule. Generated from the split files' own headers.


### `build/rules/RULES-01-20.md` — rules 1–20

| # | Rule (short title) |
|---|---|
| **1** | Never proceed without the complete set of information needed |
| **2** | Always confirm which project an instruction is for |
| **3** | Separate memory per project; cross-use when useful |
| **4** | API test placement |
| **5** | Self-service test data & roles (all projects) |
| **6** | Everything except TestRail is a disposable TEST account — act freely |
| **7** | PO & Dev questions (all projects) |
| **8** | TestRail IDs in deliverables (all projects) |
| **9** | Build-accurate, layman-friendly wording (all projects) |
| **10** | "VIU" = the full BUILD-ACCURATE-WORDING-VIU-PROCESS (all projects, default |
| **11** | ALWAYS ASK which process to run on a new/updated spec OR a VIU request |
| **12** | Verified means OBSERVED, never inferred (trust rule) |
| **13** | Live, feature-by-feature testing is the DEFAULT standard (all projects) |
| **14** | NEVER mark anything NOT-VERIFIED for a missing DATA-STATE — seed it and |
| **15** | Spec-conformance calls derive from a VERBATIM TRUTH TABLE + adversarial |
| **16** | ALWAYS deliver in the format already established/provided (all projects) |
| **17** | COMPLETE data in, COMPLETE data out, COMPLETE work — always (all projects) |
| **18** | Reconstruct the FULL originating instruction history when turning work |
| **19** | Deliverable filenames must be HUMAN-READABLE (all projects) |
| **20** | Every test case is 100% AUTHENTIC = fully TRACEABLE to its ticket(s) + spec |

### `build/rules/RULES-21-40.md` — rules 21–40

| # | Rule (short title) |
|---|---|
| **21** | When CREATING a process, follow the Process-Authoring Standard — do NOT skip |
| **22** | ALWAYS ASK about a live-build check up front — for EVERY process/task — whenever |
| **23** | ALWAYS check the CURRENT Confluence spec — and ASK per process when unsure |
| **24** | Front-end blocks + backend/API allows = a PASSED test case (all projects) |
| **25** | Every DEVIATION call must cite the spec/ticket/story reference + the VERBATIM wording |
| **26** | Reset roles to template/default BEFORE any permission/role verification on a shared/ |
| **27** | Reuse recorded action recipes; never re-discover from scratch (all projects) |
| **28** | Ruthless usefulness audit — a THREE-DIMENSION mandatory quality gate on all test-case |
| **29** | No-work-loss checkpoint discipline is permanent (all projects + side projects) |
| **30** | Tech plan is a standard project input — remind the user if missing (all projects) |
| **31** | Establish the CURRENCY OF EVERY SOURCE before doing ANYTHING on a project (all projects) |
| **32** | Latest information wins across ALL sources (all projects) |
| **33** | Review findings are INPUTS, not overrides — apply the authority precedence order |
| **34** | Keep test runs in sync with the cases (all projects) — new/updated cases must appear in |
| **35** | Never leave design frames unfetched — auto-retry rate-limited Figma fetches until 100% |
| **36** | Always remind the user of everything OUTSTANDING for each project — every report carries |
| **37** | Epics — ASK before a full re-read; if authorized, read them EXHAUSTIVELY (all projects) |
| **38** | FOREIGN test cases (created by someone other than us) are HANDS-OFF — identify, exclude from |
| **39** | When someone else's test cases CONTRADICT ours, establish BOTH sides' sources and bring them |
| **40** | A requirement that spans SURFACES must be traced across EVERY surface — produce a surface |

### `build/rules/RULES-41-60.md` — rules 41–60

| # | Rule (short title) |
|---|---|
| **41** | Touch a case, RE-VERIFY THE WHOLE CASE — there are no surgical edits (all projects) |
| **42** | NO ABSOLUTE ENUMERATIONS without a version-pinned anchor — prefer scope-conditional wording |
| **43** | Spec-diff processing must emit a PER-REQUIREMENT COVERAGE VERDICT — a narrative summary is not |
| **44** | Another author's CONTRADICTING case is a BUG REPORT AGAINST OUR SUITE until disproven |
| **45** | OUTSIDE-IN GAP HUNT — before any suite is declared current, deliberately look at it from |
| **46** | EVERY SUITE SHIPS ITS DELIBERATE-DECISIONS / ANTICIPATED-CHALLENGE REGISTER (all projects) |
| **47** | TEST-RUN SCOPE — we keep OUR ACTIVE projects' runs COMPLETE, and IGNORE every other run |
| **48** | NEVER say "waiting on you" or "frozen by your ruling" without the CONTEXT — quote the ruling, |
| **49** | A NON-FINAL BUILD yields PROVISIONAL findings ONLY — record the build marker, queue every |
| **50** | VERIFY EXHAUSTIVELY — "byte-level" means NOTHING is skipped, sampled, or assumed |
| **51** | NEVER file an API-related ticket without ASKING — every time, even inside an approved batch |
| **52** | A defect ticket is filed as a `Story Defect` parented to the OWNING STORY — and because that... |
| **53** | NEVER set a ticket's priority to High — always file at Medium; and NEVER "restore" a field th... |
| **54** | EVERY TEST CASE STATES WHAT ITS EXPECTATION IS BASED ON — a provenance line under Expected |
| **55** | A PO QUESTIONNAIRE NAMES THE PROJECT AND THE FEATURE ON EVERY ROW, IS ANSWERABLE BY A |
| **56** | WHERE A CASE FOLLOWS A LATER DECISION THAT DIFFERS FROM AN EARLIER SOURCE, THE CASE MUST SAY |
| **57** | THE SOURCE OF EXPECTED BEHAVIOUR IS THE DOCUMENT, NEVER THE BUILD — from the build we take |
| **58** | AN AMBIGUOUS SOURCE IS NEVER RESOLVED BY LOOKING AT THE BUILD — an ingest pass holds and asks |
| **59** | RE-READ THE SOURCES IMMEDIATELY BEFORE THE WRITES BEGIN — a second currency check, not only the |
| **60** | THE BUILD WILL NEVER BE DECLARED FINAL — SEPARATE WHAT DEPENDS ON THE BUILD FROM WHAT DOES NOT |

### `build/rules/RULES-61-91.md` — rules 61–91

| # | Rule (short title) |
|---|---|
| **61** | THE EXPECT-FAIL MARKER IS AN INSTRUCTION, NOT A PREDICTION — NAME THE SYMPTOM, AND LET THE |
| **62** | NO JIRA TICKET IS EVER CREATED WITHOUT THE QA LEAD'S EXPLICIT PERMISSION, ASKED FOR AND GRANTED |
| **63** | WHEN HIS INSTRUCTION CONFLICTS WITH A RECORDED RULE, STOP AND SURFACE THE CONFLICT BEFORE |
| **64** | EVERY TEST CASE MUST HAVE A SOURCE — a case with NO source should not exist; but CHECK THE |
| **65** | CHANGE A CASE THAT TESTRAIL FLAGS AS AUTOMATED → TELL VLAD. Every pass that writes to cases |
| **66** | A PO / DEV QUESTION SHEET IS THE LAST THING SENT — it goes out only once everything we can do |
| **67** | EACH PROJECT REPORTS BEFORE THE NEXT ONE STARTS — a per-project completion TABLE, delivered to |
| **68** | A BLOCKER MUST BE PROVED, AND IT BLOCKS ONLY WHAT IT ACTUALLY BLOCKS — decompose the work, |
| **69** | A CASE WHOSE STEPS/PRECONDITIONS CANNOT YET BE BUILD-VERIFIED GETS THE "NOT AVAILABLE ON BUILD" |
| **70** | COMMUNICATE WITH THE QA LEAD CLEARLY: ACTION-FIRST, PLAIN-LANGUAGE, TABLE-FORM — tell him |
| **71** | PROTECT "AUTOMATED" CASES — never change or delete a case TestRail flags as Automated without |
| **72** | PROPOSE SKILL / RULE CHANGES BEFORE RECORDING THEM — never add to the Skills or CLAUDE.md |
| **73** | WHEN THE JIRA CREATION HOLD LIFTS, RESUME ONE TICKET AT A TIME — AND EVERY TICKET MUST CLEAR THE |
| **74** | NO PRESENT FEATURE IS LEFT UN-BUILD-VERIFIED — SEED DATA AND LOG IN AS NEEDED; THE ONLY |
| **75** | LONG-RUNNING WORK RUNS DETACHED AND SELF-COMMITTING; AN AGENT LAUNCHES IT AND EXITS — IT NEVE... |
| **76** | QUOTA DISCIPLINE — MINIMIZE SUBAGENT SPAWNS; EVERY SPAWN PAYS THE FULL CONTEXT TAX (all proje... |
| **77** | VERIFICATION VALIDITY WINDOW — a check within the last 3 builds (or 3 source versions) still... |
| **78** | PIGGYBACK CHEAP CHECKS ONTO THE NEXT SUBSTANTIVE WORKER — never spend a dedicated spawn on a... |
| **79** | STRATEGY-FIRST — BEFORE STARTING ANY TASK, DEVISE (OR RECALL) THE SMARTEST QUOTA-EFFICIENT PL... |
| **80** | TELL THE LAST-DONE DATE AND ASK BEFORE RE-RUNNING any verification / VIU / ordered task (all... |
| **81** | SOURCE VERIFICATION PRECEDES BUILD VERIFICATION / VIU — make the source current FIRST (all pr... |
| **82** | THE SECRET-SCAN GATE MUST BE REAL AND EXECUTABLE — never claim a scan that did not run (all p... |
| **83** | LANE OWNERSHIP AND WRITE LOCKS — four sessions, one TestRail, one branch, one login (all proj... |
| **84** | THE TESTER-READINESS GATE — nothing reaches a manual tester until it passes (all projects, pe... |
| **85** | A PROJECT WITH NO QA BUILD IS REPORTED AS "SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET" (all p... |
| **86** | CROSS-SESSION TRUST — VERIFY FROM COMMITTED EVIDENCE, NEVER FROM A SESSION'S SELF-REPORT; AND... |
| **87** | SNAPSHOT CASE BODIES SO A FOREIGN EDIT IS ALWAYS DIFFABLE (all projects, permanent) |
| **88** | LANE-SESSION CONTEXT DISCIPLINE — a session WITH direct tools must never bulk-read; script it |
| **89** | ACCESS RESILIENCE AND MCP HYGIENE — every session keeps a working path to every source, and |
| **90** | SHARED-QUOTA BUDGET ALLOCATION ACROSS SESSIONS (all projects) |
| **91** | THE VERIFICATION FRESHNESS BADGE — every build/source verification claim is shown with a COLOUR |

**Rules 89 (access resilience + MCP hygiene) and 90 (shared-quota budget allocation)** were added
2026-08-21 and live in `build/rules/RULES-61-91.md` with 61–88. Rule 89's operator form is
`build/skills/14-ACCESS-RESILIENCE.md`.

**Rule 91 (the verification freshness badge)** was added 2026-08-21 in the same file. **Its second
half is a CORRECTION: the branches are NOT final** — they are continuously updated as ad-hoc
decisions are made and will not be final until release day, so **Rules 49 and 60 remain in force**
and a gap is **possibly-unfinished** rather than automatically a defect. Badges: **✅ ≤7 days ·
🟠 8–14 days · 🔴 >14 days · ❌ never build-verified**, always with the date (and build marker or
spec version). Tool: `build/testing-tools/verification_badge.py` (requires `--today`).

---

## 3 · PROJECT INDEX

Two or three lines each — **the detail lives in each project's own `PROJECT-STATE.md`**, and the long
status histories are in `build/rules/PROJECT-HISTORY-ARCHIVE.md`. **Keep each project's memory
SEPARATE; reuse only the shared infrastructure.** Never mix PO attributions.

| Project | Status | PO | Canonical resume doc |
|---|---|---|---|
| **Report Suite** (6 reports, epic SV-8582) | **ACTIVE** — 476 cases, run 359. Branch final for **Work In Progress · Technician Utilization · Sales By Customer** only; SBR/PV/IV not final (Rule 49 amendment 2026-08-10) | Chris Ward | `build/report-suite/PROJECT-STATE.md` |
| **Schedule** (epic SV-8685) | **ACTIVE** — 168 cases, run 357. Rule-49 queue OPEN; verdicts PROVISIONAL | Branko | `build/schedule/PROJECT-STATE.md` |
| **Filters** (epic SV-8785) | **ACTIVE** — 114 cases, run 352. Rule-49 queue OPEN; verdicts PROVISIONAL | Branko | `build/filters/PROJECT-STATE.md` |
| **Global Search** | **POSTPONED** (2026-07-27 ruling) — 86 cases authored, never pushed | Branko | `build/global-search/PROJECT-STATE.md` |
| **Simple Flow** (epic SV-7301) | **COMPLETED** (2026-07-27 ruling) — docs retained | Milos | `build/simple-flow/PROJECT-STATE.md` |
| **Fees & Discounts V1** | **COMPLETED** (2026-07-27 ruling) — docs retained | Chris Ward | `build/fees-discounts/PROJECT-STATE.md` |
| **Custom Roles & Permissions** (epic SV-7388) | **RECURRING** — re-run the 4-layer permission VIU after EVERY feature release (it regresses when other features ship) | — | `build/custom-roles-run/release-regression-2026-07-27/RELEASE-REGRESSION-STATE-2026-07-27.md` |

**Active test runs (Rule 47 scope — keep these COMPLETE, ignore every other run):** Filters **352** ·
Schedule **357** · Report Suite **359**. Union-only when syncing (Rule 34): a partial `case_ids` list
DELETES tests and their results.

**New-project onboarding:** create `build/<slug>/` with `PROJECT-STATE.md`, `requirements.md`,
`cases/`, `testrail-id-map.csv`; record the canonical spec URL + PO name; the **engineering tech plan
is a required input** (Rule 30 — remind the QA lead if it is missing).

---

## 4 · SKILLS INDEX

**Read `build/skills/README.md`, then `build/skills/00-COMMON-CORE.md`, then the one skill for your
job.** Each file is a complete cold-start specification.

| File | Use it when |
|---|---|
| `build/skills/README.md` | Index of the skill set — start here |
| `build/skills/00-COMMON-CORE.md` | **Always, first** — the honesty bar, TestRail mechanics, access, session survival |
| `build/skills/01-CASE-BUILD.md` | Authoring or extending a suite from the sources |
| `build/skills/02-SOURCE-CHECK.md` | Proving we hold the CURRENT version of every source |
| `build/skills/03-RUN-CHECK.md` | Proving every precondition and step can actually be executed on the build |
| `build/skills/04-TESTER-READY.md` | Handing a suite to the manual test team |
| `build/skills/05-PROJECT-REPORT.md` | The per-project completion table, before the next project starts |
| `build/skills/06-DEFECT-PREP.md` | Building an unchallengeable defect ticket — then stopping at the button |
| `build/skills/07-PO-QUESTIONS.md` | One PO question sheet, plain words, sent LAST |
| `build/skills/08-RECOVER.md` | Establishing what a killed pass actually landed, by content, and finishing it |
| `build/skills/10-TEST-CASE-CREATION.md` | Lane: authoring |
| `build/skills/11-BUILD-VERIFICATION.md` | Lane: verifying existing cases against the running build |
| `build/skills/12-VIU.md` | Lane: the full build-accurate wording + Verify-In-UI pass |
| `build/skills/13-CROSS-SESSION-SAFETY.md` | Before the first write of any lane session (Rules 82–87 as commands) |
| `build/skills/14-ACCESS-RESILIENCE.md` | Keeping a working path to TestRail / Jira / ShopView / Figma; MCP hygiene (Rule 89) |
| `build/skills/COVERAGE-MATRIX.md` | Checking that a session learning is actually carried by a skill |
| `build/skills/STATE.md` | Resuming work ON the skills themselves |
| `build/handoffs/README.md` | Three copy-paste lane briefings for a fresh session |

**Other standing infrastructure docs:** `build/PROCESS-CATALOG.md` (every callable process) ·
`build/APP-ACTIONS-PLAYBOOK.md` (proven staging/QA action recipes — **read before any staging
action**; §J TestRail traps, §K production access) · `build/TESTING-RUNBOOK.md` ·
`build/OUTSTANDING-ITEMS-REGISTER.md` · `build/NO-WORK-LOSS-STRATEGY.md` ·
`build/QA-QUALITY-PIPELINE-EXPLAINER.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` ·
`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` · `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` ·
`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` · `build/MISSING-TRACEABILITY-PROCESS.md` ·
`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` · `build/PROD-VS-STAGING-COMPARE-METHOD.md` ·
`build/COMPARISON-WORKBOOK-RECIPE.md` · `build/PROCESS-AUTHORING-STANDARD.md` ·
`build/LESSONS-2026-07-31.md`.

---

## 5 · DELIVERABLE CONVENTIONS

Compact form — **the rule named in brackets is the authority; read it before relying on this.**

- **Plain, layman English** throughout; numbered **Preconditions / Steps / Expected**, each on its own
  line. [7, 9]
- **Expected Results state what the DOCUMENT requires**, never how the build behaves. If the build
  differs, keep the documented expectation and raise a deviation. [57]
- **PRD, design and Figma are expected to AGREE.** Where they disagree that is a **finding to raise**
  (a PO question + the outstanding register), never a side to pick silently; meanwhile the case follows
  the most recent authoritative source and DISCLOSES the divergence. "Everything should match the
  Build" means the **build must conform to the sources** — the build is still never a source. **No
  retroactive changes** were authorised for this. [57, 32, 56, 36]
- **"The design" means three artefact types:** a **Claude design** (incl. a prototype export or share
  page), a **Figma design**, and the **technical design** he shares. Tiebreak between them:
  **latest wins, unless the latest does not make sense — then a PO question sheet.** An **undated,
  editable share link has no date**, so latest-wins cannot be applied to it: cite it as exactly that
  and escalate. Rule 30's *"informs but never overrules"* is preserved for the technical design and
  the question of which prevails is **OUTSTANDING with him — do not answer it.** [57, 30, 32]
- **PROVENANCE LINE ends every case's Expected Results — TWO SENTENCES, NEVER MERGED.** Sentence 1
  names **only documents** (epic/story + spec with its VERSION + the requirement reference, and/or the
  PO answer file with link and date). Sentence 2 is optional and records the check: *"Last checked
  against build v3.5-16cf83f on 8/5/2026."* Re-stamped on every spec/epic/build re-check — a stale
  stamp is a finding. Never the word "VIU", never a flag name. [54]
- **The build is named ONLY as what a case was last checked against.** *"as per the build tested on…"*
  is **BARRED**. Not yet checked against any build ⇒ omit sentence 2 or say plainly it has not been
  checked. [54, 57]
- **A DIVERGENCE SENTENCE follows the provenance line only where the case follows a later decision
  that differs from an earlier source** — where the PO asked for it (file + link + date), where it
  differs, and that we take the latest as prevailing. **Never added where nothing contradicted it.**
  [56]
- **AUTOMATION MARKER — the LAST thing in Expected Results**, after the provenance line, blank line
  before and a line break after. Exactly one of: `AUTOMATION: READY` ·
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <short plain reason>`. A machine-
  findable literal — never reworded or abbreviated, exactly one per case. **A tool flag never justifies
  HOLD** (devtools, DOM/network, PDF/CSV reading, seeded data, viewports are all automatable); only a
  genuinely unobtainable thing does. **NOT-BUILT cases are excluded from any ready-to-automate figure.**
  Arithmetic gate: READY + EXPECT-FAIL = total − HOLD, read back from the live cases. [61, 60]
- **An `EXPECT FAIL` case carries the SYMPTOM and ALL THREE OUTCOMES**, before the provenance line:
  what you should see today; **(1)** exactly that ⇒ mark FAILED, raise nothing new; **(2)** fails
  DIFFERENTLY ⇒ a NEW problem, report it; **(3)** PASSES ⇒ the fix shipped, tell the QA lead. Where the
  ticket was closed without a fix, say so. **Ticket status is never evidence about the build.** [61]
- **DEFECT TICKET SHAPE (once permission is given):** `issuetype` = **`Story Defect`** · `parent` =
  **the OWNING STORY** (an Epic parent is rejected HTTP 400) · `priority` = **`Medium`** (was `Low`
  before 2026-08-06; earlier tickets are correct for their date; **`High` is barred**) · **also link
  the owning story `relates to`** · **no Product Area** (absent on this type). Never
  `Story Defect - Archive`. **Never convert someone else's ticket** — conversion is UI-only and
  silently wipes Product Area. [52, 53, 62]
- **Every DEVIATION / Failed / Blocked cell carries a plain "What needs to be done"** a non-technical
  QA can act on. Never a bare status. [7]
- **Excel:** a tab per result status + a Summary tab; every case row carries the C-id and a TestRail
  link. **Human-readable filenames** — full project/report names, never cryptic slugs. [8, 19]
- **Mirror the established format 1:1** — find the canonical prior example and copy its schema; do not
  invent a layout. API-content cases go in an `API`-titled section. Imports stay VIU-word-free and
  flag-word-free. [16, 4]
- **Per-case audit logs for every TestRail edit**, recording operation · C-id · HTTP status ·
  verification result. *"200 OK"* alone is non-compliant. [50]
- **FE-blocks + BE/API-allows = a PASSED case**, with the plain tester note (*"only hidden on screen;
  if still doable via the back-end that is expected — mark PASSED, don't raise a bug"*). The inverse
  (FE exposes what BE blocks) is an FE-exposure DEFECT. [24]
- **Simple-format status updates:** short plain statements under plain headings ("What I did / What
  needs to be done / Other actions"), action-first, table-form where it helps. [70]
- **Concise TestRail titles — ≤ ~80 characters**, so nothing truncates on the case page. [ref: title
  convention]
- **Blocked-revisit loop:** a tester marks anything that seems off as **Blocked** (never skips, never
  guesses); every Blocked case gets a manual revisit against the current spec + build and an
  authorised correction.
- **Provide GitHub raw download links** for deliverables.
- **Git identity:** `noreply@anthropic.com` / `Claude`. The *"Unverified"* commit stop-hook is a known
  false alarm — ignore it.

---

## 6 · WHERE THE REST WENT

| Content | Now lives at |
|---|---|
| The complete former CLAUDE.md (verbatim) | `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` — **never read whole; grep it** |
| Standing Rules 1–20 (full text) | `build/rules/RULES-01-20.md` |
| Standing Rules 21–40 (full text) | `build/rules/RULES-21-40.md` |
| Standing Rules 41–60 (full text) | `build/rules/RULES-41-60.md` |
| Standing Rules 61–91 (full text) | `build/rules/RULES-61-91.md` |
| Per-project narrative history (projects 1–7) | `build/rules/PROJECT-HISTORY-ARCHIVE.md` |
| Byte-verification hashes for the split | `build/rules/INTEGRITY.md` |
| Staging/QA/prod action recipes, TestRail traps | `build/APP-ACTIONS-PLAYBOOK.md` |
| Durable env facts, IDs, endpoints, auth | `build/APP-ACTIONS-PLAYBOOK.md` + `build/TESTING-RUNBOOK.md` |
| Everything we are waiting on | `build/OUTSTANDING-ITEMS-REGISTER.md` |

**Two-session shared brain:** this workspace is worked by more than one session in parallel with **no
live message bus** — **this index, the `build/rules/` files, the skills and each `PROJECT-STATE.md`
ARE the channel.** Any session that learns a durable fact writes it there; any session must read
before acting. **Propose skill/rule changes before recording them (72).**

**Persistence:** secrets are ephemeral (`/tmp`, re-supplied per environment). Everything else here is
durable memory — update it when a fact genuinely changes.
