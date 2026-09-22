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

**THEREFORE: NEVER ASSUME YOU HAVE SEEN ALL THE RULES.** There are **96 numbered Standing Rules**,
**plus Rules 109, 110, 111, 112 and 113** at the end of `build/rules/RULES-61-96.md`.
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
- **🔴 THE EXPECTED RESULT IS THE SOURCE'S OWN WORDS, QUOTED VERBATIM — AND NEVER CHANGED (113).**
  Ordered by the QA lead 2026-09-21: *"the expected behavior should be the exact QUOTE from the
  specs/source, that MUST NOT ever be changed."* Copy the sentence, mark it as a quote, cite the
  document + version + section. **It changes only when the SOURCE changes.** A build that disagrees
  is a DEVIATION (57/61); a reviewer who disagrees is a PO QUESTION; neither permits editing the
  sentence. **If you are improving the wording of an Expected Result, stop — that is the failure
  this rule exists to prevent**, because a case rewritten towards the build can never fail.
  Plain-language wording (7/9) is ADDED AFTER the quote, clearly marked as our restatement, and
  never replaces it. No quotable sentence ⇒ hold the case and ask (58/64), never invent one and
  never look at the build.

- **VERIFIED MEANS OBSERVED, NEVER INFERRED (12).** Only mark Verified / Pass / Fail / present /
  absent if it was observed live, with evidence captured that run. Anything not observed is labelled
  **NOT VERIFIED** or **Blocked-with-reason**. Never fill a gap with inference to look complete.
- **A V2 / UPGRADE PROJECT MUST DERIVE AND TEST THE INVARIANT SET (96).** What the V2 spec does NOT
  mention is still a requirement: **silence defaults to "must not change"**, and high-collateral-risk
  silence is escalated as a PO question rather than assumed. **Documents establish intent; code
  establishes fact** — and a code-vs-document conflict is a **PO DECISION ITEM, never a silent
  invariant.** Skill: `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`.
- **NEVER BULK-READ; SCRIPT THE BULK WORK (88).** A session with direct tools must not read hundreds
  of cases, spec bodies or archives into its own context. Write a script, run it, read its SUMMARY.
  Never read `CLAUDE-FULL-ARCHIVE-2026-08-21.md` (or any 100 KB+ artefact) whole.
- **THE TOKEN-DISCIPLINE CHARTER BINDS EVERY SESSION FROM ITS FIRST TURN (95).** Twelve clauses in
  `build/skills/TOKEN-DISCIPLINE-CHARTER.md`, embedded VERBATIM in every handoff: strategy first, never
  bulk-read, spawn discipline, **never poll**, batch writes, piggyback, never re-do work, answer in text,
  the budget, the week-start guard — and **clause 12: QUALITY IS NEVER THE THING CUT.** The savings come
  from HOW work is executed, never from doing less of it. A handoff without the section is non-compliant.
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
- **🔴 A RESULT IS NOT EVIDENCE UNTIL IT IS ATTRIBUTED, IDENTIFIED AND DATED (110).** Ratified
  2026-09-16 after three failures in one week, all the same error: **a search returned something and
  that was treated as proof.** Three checks, or the claim is UNPROVEN: **(a) ATTRIBUTION** — blank the
  field and search again; still found ⇒ the match came from elsewhere (SV-10110 was withdrawn because a
  vendor's **website** matched via its **EMAIL**, which contains it, and V1's vendor query has no
  website column). **(b) IDENTITY** — is OUR record in the list, never "were there results"; a count is
  not a verdict (a count of 1 produced a false PASS on a real regression). **(c) PROVENANCE** — record
  the build marker; a QA branch redeploys unannounced, and misreading that as a slow index withdrew
  **four TRUE findings**. **Search Jira for an existing ticket before reporting any loss** — all six
  already had one. **The answer is usually one grep away in our own repo. Try to break your own finding
  before you ship it.** Tool: `build/global-search/field-attribution-audit-2026-09-16/attribution_check.py`.
  Facts: `build/APP-ACTIONS-PLAYBOOK.md` §O.

---

## 2 · THE RULE INDEX — all 96 rules, and where each one lives

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

### `build/rules/RULES-61-96.md` — rules 61–96

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
| **92** | A LANE SESSION IS A PROJECT-AGNOSTIC ENGINE — IT WORKS ONLY ON THE PROJECT IT IS GIVEN, AND EXISTING PROJECT STATE IS REFERENCE, NOT A BACKLOG |
| **93** | THE LEARNING LOOP — EVERY PROJECT ENDS WITH A RETRO THAT PROPOSES RULE AND SKILL IMPROVEMENTS (it PROPOSES; Rule 72 records) |
| **94** | THE DEFECT ADMISSIBILITY GATE — NO TICKET IS FILED UNTIL IT PASSES EVERY CHECK, AND THE LANE'S OUTPUT IS APPROVED CANDIDATES, NOT FILED TICKETS |
| **95** | THE TOKEN-DISCIPLINE CHARTER IS CARRIED BY EVERY SESSION AND EVERY HANDOFF — AND QUALITY IS NEVER WHAT GETS CUT |
| **96** | A V2 / UPGRADE PROJECT MUST DERIVE AND TEST THE INVARIANT SET — WHAT THE SPEC DOES NOT MENTION IS STILL A REQUIREMENT |

**Rule 95 (the Token-Discipline Charter)** was added 2026-08-26 in `build/rules/RULES-61-96.md`. Its
canonical one-page operator form is **`build/skills/TOKEN-DISCIPLINE-CHARTER.md`** — twelve clauses
(strategy first · never bulk-read, script it · the reading rule · spawn discipline · never poll · batch
writes · piggyback cheap checks · never re-do work · answer in text · the budget · the week-start guard ·
**quality is never the thing cut**). **EVERY handoff embeds the twelve clauses VERBATIM and every session
applies them from its first turn; a handoff without them is non-compliant and must not be issued.**
Routers take it by pointer only.

**Rule 96 (the V1→V2 invariant set)** was added 2026-08-26 in `build/rules/RULES-61-96.md`, which was
renamed on the same day from its previous 61-to-95 filename. Operator form:
**`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`**. **A V2 spec describes only what CHANGES and is
SILENT about everything else, so a V2 build can break a V1 behaviour with every case still passing.**
Derive **INVARIANTS = V1 baseline − (changed ∪ removed ∪ replaced)**; **silence defaults to "must not
change"**, and a **high-collateral-risk silence is escalated as a PO question, never assumed**.
**Documents establish INTENT; product source code establishes FACT and is NEVER a source of expectation
(57) — a code-vs-document conflict is a PO DECISION ITEM, never a silent invariant, and the case is HELD
(58).** Superseded V1 cases are **retired or rewritten, never preserved** (94). The project type is asked
at intake — **(i) NEW · (ii) V2/UPGRADE · (iii) REVIVAL** — in `build/skills/15-NEW-PROJECT-INTAKE.md`
§1a, and **type (ii) triggers the skill**. **The source-cited V1 baseline that Step 1 subtracts the
delta from is built with the companion `build/skills/V1-BASELINE-FROM-SOURCE.md`** (added 2026-08-26;
worked example `build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md`).

**Rule 109 (V1 IS the specification for a V1-vs-V2 comparison suite)** was added 2026-09-14 at the end of
`build/rules/RULES-61-96.md`. **For a comparison suite the specification is the V1 PRODUCT REPOSITORY at a
named commit — not the V1 PRD, not the V2 PRD, not the epic, not the design.** The V2 specification is
**never consulted to decide whether a case should exist**; the only question is *"could a user do this in
V1?"*, and a V2 document that deliberately removes a capability **never subtracts a case**. The expected
result states the V1 behaviour and the **SOURCE line leads with the V1 repo, commit, file and lines**.
**Never edit an existing comparison case towards the V2 spec** — a case rewritten to match the thing it
tests cannot fail. Operator form: `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` §6.0. Worked example
(and the mistake that produced the rule): `build/global-search/v1-parity-audit-2026-09-14/`.
🔴 **Numbered 109 to continue CANONICAL's sequence (canonical is at 108, in the renamed
`build/rules/RULES-61-ONWARD.md`) — it must be carried across, or the next session will not have it.**

**Rule 110 (a result is not evidence until it is attributed, identified and dated)** was ratified
2026-09-16 and lives at the end of `build/rules/RULES-61-96.md`, after 109. **Read it before reporting
any pass, failure or regression.** It is the evidential floor under Rule 12 — Rule 12 says *verified
means observed*, Rule 110 says **observed how**: attribution (blank the field), identity (is OUR record
there), provenance (which build, how long after the write). Operator form:
`build/global-search/field-attribution-audit-2026-09-16/attribution_check.py`. The durable facts it
produced are in **`build/APP-ACTIONS-PLAYBOOK.md` §O — Global Search**, which is the place to look
before re-deriving anything about either search version (the two endpoints, V1's two passes and its
three-rows-per-group cap, the phone-format rule, the per-record-type field lists, and the TestRail
delete traps).

**Rule 111 (correct a stale identifier in a case — the identifier ONLY)** was ordered by the QA lead
2026-09-17 and lives at the end of `build/rules/RULES-61-96.md`, after 110. **A case that names an
identifier the environment does not hold is a FALSE FAILED waiting to happen** — three cases named work
order `S2-15276`, which cannot exist because work-order numbers are branch-assigned. So: seed first,
read the REAL identifier back off the environment, and where it differs from the case, **update the
identifier and nothing else** — not the wording, not the provenance line, not a helpful note.
🔴 **The reachability clause:** an identifier the SEARCH returns is not automatically usable. The first
replacement proposed, `S2-15440`, was pinned and normalized perfectly and was still wrong — the record
answers **400 Not found** at both workplaces the test login can reach, because **the search index is
organisation-scoped while the record is workplace-scoped.** Prove three things: the search returns it,
the record OPENS as the tester, and the near miss is genuinely absent. **Prefer an identifier that
survives a reseed** — our own seeded numbers change on every redeploy, and consecutive seeded numbers
can never satisfy a "returns nothing" near miss. Worked example, false start included:
`build/global-search/case-corrections-2026-09-17/`.

**Rule 112 (verify against the real case text, never a summary)** was ordered by the QA lead
2026-09-17 and lives at the end of `build/rules/RULES-61-96.md`, after 111. **A handoff, a task card
and a previous session's report are all SUMMARIES; the case body is the only thing the tester reads.**
The seeding handoff stated that the eight Quick Actions cases needed *"no NEW records beyond §1"* —
reading the actual case bodies found three named example records that do not exist on the branch and
one example term returning no assets at all, which proved to be a product defect. A session trusting
the summary would have reported the section ready and handed a tester four dead ends. Script the
reading (88), extract what the tester will literally TYPE, check each against the live environment,
and where the summary and the case disagree **the case wins**. A term named only as "for example"
still gets typed by somebody.

**Rule 113 (the Expected Result is the source's own words, quoted verbatim)** was ordered by the QA
lead **2026-09-21** and lives at the end of `build/rules/RULES-61-96.md`, after 112. **It is the
strongest form of Rule 57 and it binds every case we write or touch.** A paraphrase is a small,
invisible act of interpretation, and interpretation drifts towards whatever the author is looking
at — the build. Once the Expected Result is OUR sentence rather than the SPEC's sentence, the case
can no longer fail: it has been quietly rewritten to describe the thing it is supposed to test.
**Quote it, attribute it (document + version + section), and change it only when the SOURCE
changes.** Plain-language wording for testers is **added after** the quote and clearly marked as
our restatement — never a replacement, and where they could be read as disagreeing the quote wins.
**Forbidden outright:** rewriting Expected because the build differs · tidying grammar, tense or
spelling · merging or splitting source sentences without showing the original · quoting a SUMMARY
(a handoff, a task card, a Jira description that restates the PRD — quote the source itself, 112) ·
carrying a quote forward without re-checking the source version (31/32/59). **No quotable sentence
exists** ⇒ hold the case and raise a PO question (58/64); never invent one and never resolve it
from the build. Worked example: the line that moved SV-10279 was the PRD's own
*"Prefix match on primary name field → +0.70"* set against the product's own match label.

**Rule 114 (every case must be runnable by a human manual QA tester)** was ordered by the QA lead
**2026-09-22** and lives at the end of `build/rules/RULES-61-96.md`, after 113. **It is the executable
half of the tester-readiness gate (84): 113 governs what Expected SAYS, 114 governs whether a human
can actually DO the whole case by reading it.** A manual tester, reading only the case, must reach the
**preconditions**, perform every **step**, and judge the **expected result** — by hand, in the
product UI, with no API, no database, no devtools, no code, and no knowledge the case does not give
them. **Preconditions** name the exact data (seeded keyword or create-steps), roles/settings, build
and starting screen — never a bare *"the conditions in Sx are met"*; an unreachable precondition is a
blocker to surface (68). **Steps** are numbered, one UI action per line, in the build's exact labels;
no step may need what a manual tester cannot do — where a rule can only be proven outside the UI
(server enforcement, forced failure, true concurrency) either express it as something a human really
can do (two real logins, two browser sessions) OR mark `AUTOMATION: HOLD - <reason>` and say plainly
which part cannot be checked by hand; **never leave an uncarryable instruction in a manual case.**
**Expected** keeps the verbatim quote first (113) but the tester acts on the plain restatement, which
says what they SEE, no ids/jargon/HTTP terms (7/9). The three parts must line up. Check:
*"Could a tester who has never seen this feature reach the preconditions, do every step in the UI, and
decide pass/fail from what they see, with no help and no tool beyond the product?"* If no, fix it or
mark honestly — it is **not tester-ready and does not ship.**

**Rules 89 (access resilience + MCP hygiene) and 90 (shared-quota budget allocation)** were added
2026-08-21 and live in `build/rules/RULES-61-96.md` with 61–88. Rule 89's operator form is
`build/skills/14-ACCESS-RESILIENCE.md`.

**Rule 91 (the verification freshness badge)** was added 2026-08-21 in the same file. **Its second
half is a CORRECTION: the branches are NOT final** — they are continuously updated as ad-hoc
decisions are made and will not be final until release day, so **Rules 49 and 60 remain in force**
and a gap is **possibly-unfinished** rather than automatically a defect. Badges: **✅ ≤7 days ·
🟠 8–14 days · 🔴 >14 days · ❌ never build-verified**, always with the date (and build marker or
spec version). Tool: `build/testing-tools/verification_badge.py` (requires `--today`).

---

> **⚠️ REFERENCE ONLY — this index is history and other sessions' work. It is NOT a backlog and does not authorise action (Rule 92).**

## 3 · PROJECT INDEX

Two to four lines each — **the detail lives in each project's own `PROJECT-STATE.md`**, and the long
status histories are in `build/rules/PROJECT-HISTORY-ARCHIVE.md`. **Keep each project's memory
SEPARATE; reuse only the shared infrastructure.** Never mix PO attributions.

**🔴 EVERY FIGURE BELOW WAS RE-DERIVED LIVE ON 2026-08-21 — full evidence
`build/PROJECT-INDEX-REFRESH-2026-08-21.md`. The rows it replaced were carried over from the previous
CLAUDE.md and had never been measured; six of them were wrong.** Case counts are **ours only**
(`created_by = 3`), from a fully-paged `get_cases` (627 sections / 4,170 cases in the estate — an
unpaged call returns 250 sections and silently finds zero). Epic child counts are verified **two ways**
(`parent =` and `"Epic Link" =`), agreeing on every epic with no paging remainder. Badges are Rule 91
(`verification_badge.py --today 2026-08-21`; ✅ ≤7 d · 🟠 8–14 d · 🔴 >14 d · ❌ never).
**A GREEN source badge means the last CHECK was recent, NOT that the source is current** — every
project's spec page has in fact moved since its last check (§3 of the evidence file).

| Project | Status (live 2026-08-21) | Build badge | Source badge | PO · resume doc |
|---|---|---|---|---|
| **Report Suite** (6 reports, epic **SV-8582** — **114** children, was 105) | **ACTIVE** — **509 cases ours** (live 523 incl. 14 foreign; CLAUDE.md said 476), run 359. Branch final for **WIP · Technician Utilization · Sales By Customer** only; SBR/PV/IV not final (Rule 49 amendment 2026-08-10). Verified on **staging**, not on `sv8582` (that host → **HTTP 502**) | ✅ **2026-08-20** (`v3.8-d0e135e`; staging now `v3.10-49b5fe3`) | 🟠 **2026-08-11** — **all six specs moved since** (2026-08-13 / 2026-08-20); Inventory Value measured at **Confluence v10** vs our v5 | Chris Ward · `build/report-suite/PROJECT-STATE.md` |
| **Schedule** (epic **SV-8685** — **40** children, was 24) | **ACTIVE** — **195 cases** (0 foreign; CLAUDE.md said 168), run 357. Rule-49 queue OPEN; verdicts PROVISIONAL | ✅ **2026-08-20** (`v3.8-d0e135e`, staging; own branch `sv8685` = `v3.8-bc7508a`) | 🟠 **2026-08-11** (Confluence **v27**) — **page moved 2026-08-20, uningested** | Branko · `build/schedule/PROJECT-STATE.md` |
| **Filters** (epic **SV-8785** — **34** children, unchanged) | **ACTIVE** — **124 cases ours** (live 129 incl. 5 foreign; CLAUDE.md said 114), run 352. Rule-49 queue OPEN; verdicts PROVISIONAL | ✅ **2026-08-19** (`v3.8-d0e135e`, staging; own branch `sv8785` = `v3.7-6e2d301`) | ✅ **2026-08-18** (Confluence **v21**) — **but the page moved 2026-08-20, so the badge is fresh and the source is behind**. Spec page id **`572030978`** (was "TO CONFIRM"); in-body "1.8" is the Rule-31(a) trap | Branko · `build/filters/PROJECT-STATE.md` |
| **Global Search** (epic **SV-9160** — **24** children; **epic EXISTS since 2026-08-12**, our record said "not available") | **POSTPONED** (2026-07-27 ruling) — **but all 86 cases ARE LIVE in TestRail** (group 4094, every one ours). The old line *"authored, never pushed"* is **false**. No QA branch exists, so nothing has ever been observed | ❌ **NEVER build-verified** | 🔴 **2026-07-16** — PRD moved **2026-08-20**; the epic also carries 4 open questions + 2 PRD corrections (PRD says PostgreSQL/`pg_trgm`, stack is **MySQL on Aurora**; says "React context", app is **Vue 3 + Quasar**) | Branko · `build/global-search/PROJECT-STATE.md` |
| **Simple Flow** (epic **SV-7301** — **25** children) | **COMPLETED** (2026-07-27 ruling) — docs retained. **185 cases ours** live (2 foreign); local id-map says 189 — **4-case mismatch, reported not investigated** | 🔴 **2026-07-29** (`sv7301` = `v2.320-44e5b70`) | 🔴 **2026-07-17** (V2.6) — spec page unchanged since 2026-07-16 | Milos · `build/simple-flow/PROJECT-STATE.md` |
| **Fees & Discounts V1** (epic **SV-7387**, Done — **24** children) | **COMPLETED** (2026-07-27 ruling) — docs retained. **200 cases ours** live (2 foreign); local id-map says 203 — **3-case mismatch, reported not investigated** | 🔴 **2026-07-22** (`qb` = `v3.1-4eaa076`) | 🔴 **2026-07-20** (V1_3) — spec page unchanged since 2026-07-14 | Chris Ward · `build/fees-discounts/PROJECT-STATE.md` |
| **Custom Roles & Permissions** (epic **SV-7388** — **269** children) | **RECURRING** — re-run the 4-layer permission VIU after EVERY feature release (it regresses when other features ship). **515 cases ours** live under group 3527 (714 total, **199 foreign**) and **no `testrail-id-map.csv` exists**, so current scope cannot be reconciled locally | 🔴 **2026-07-27** (staging now `v3.10-49b5fe3`) | 🔴 **2026-07-27** — spec page unchanged since 2026-07-17 | **PO UNKNOWN — must be asked** (spec owner is Sasha Grosman) · `build/custom-roles-run/release-regression-2026-07-27/RELEASE-REGRESSION-STATE-2026-07-27.md` |

**BLOCKED, with the exact ask in each file (all in `build/OUTSTANDING-ITEMS-REGISTER.md` as R1–R6):**
`BLOCKED-shopview-app-session.md` (every stored cookie → **HTTP 401**; blocks every live verdict) ·
`BLOCKED-confluence-version-integers.md` (12 of 13 version integers unread — access is fine, the only
version-bearing MCP call returns the whole page body) · `BLOCKED-qa-branch-sv8582.md` (**HTTP 502** ×3)
· `BLOCKED-global-search-build.md`.

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
| `build/skills/TOKEN-DISCIPLINE-CHARTER.md` | **Always, from your first turn (Rule 95)** — the twelve token-discipline clauses every session and every handoff carries; clause 12 = quality is never the thing cut |
| `build/skills/00-COMMON-CORE.md` | **Always, first** — the honesty bar, TestRail mechanics, access, session survival |
| `build/skills/01-CASE-BUILD.md` | Authoring or extending a suite from the sources |
| `build/skills/02-SOURCE-CHECK.md` | Proving we hold the CURRENT version of every source |
| `build/skills/03-RUN-CHECK.md` | Proving every precondition and step can actually be executed on the build |
| `build/skills/04-TESTER-READY.md` | Handing a suite to the manual test team |
| `build/skills/05-PROJECT-REPORT.md` | The per-project completion table, before the next project starts |
| `build/skills/06-DEFECT-PREP.md` | Building an unchallengeable defect ticket — then stopping at the button |
| `build/skills/07-PO-QUESTIONS.md` | One PO question sheet, plain words, sent LAST |
| `build/skills/08-RECOVER.md` | Establishing what a killed pass actually landed, by content, and finishing it |
| `build/skills/09-TEST-EXECUTION.md` | Executing the cases against a build and recording honest results — the honest-status rule, disciplined Blocked, the retest loop, union-only run sync |
| `build/skills/10-TEST-CASE-CREATION.md` | **ROUTER** — authoring lane. Points at `00` → `02` → `01` → `COVERAGE-MATRIX`. **No procedure of its own** |
| `build/skills/11-BUILD-VERIFICATION.md` | **ROUTER** — build-verification lane. Points at `00` → `02` §1 → `03` → `04` §6/§6.1 → `06`. **No procedure of its own** |
| `build/skills/12-VIU.md` | **ROUTER** — VIU lane. Points at `00` → `02` → `03` → `01` → `04` → `06`. **No procedure of its own** |
| `build/skills/16-TEST-EXECUTION-AND-DEFECTS.md` | **ROUTER** — test-execution & defect lane. Points at `00` → `09` → `03` → `06` → `04` §6.1 → `13` → `14`. **No procedure of its own** |
| `build/skills/13-CROSS-SESSION-SAFETY.md` | Before the first write of any lane session (Rules 82–87 as commands) |
| `build/skills/14-ACCESS-RESILIENCE.md` | Keeping a working path to TestRail / Jira / ShopView / Figma; MCP hygiene (Rule 89) |
| `build/skills/15-NEW-PROJECT-INTAKE.md` | **The moment a project is NAMED** — required input set, PRESENT/MISSING intake checklist, source-currency block, and the REVIVAL path (Rules 92–93) |
| `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` | **The project is a V2 / upgrade of an existing feature** (Rule 96) — a V2 spec says only what CHANGES and is SILENT about the rest, so derive the **invariant set** (V1 baseline − changed ∪ removed ∪ replaced), escalate the dangerous silences, retire the superseded V1 cases. No build, no cookies |
| `build/skills/V1-BASELINE-FROM-SOURCE.md` | **Companion to Skill 17 (Rule 96)** — the method for its Step 1 / §3.3: read the CURRENT product source code and produce a **source-cited V1 behaviour baseline** (invariant register + collateral-risk map + existing-coverage list + self-check, pinned to a commit SHA) for the V2 session to subtract the delta from. Use when you have source read access; it feeds Skill 17, it does not derive invariants or author cases. Worked example: `build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md` |
| `build/skills/20-FEATURE-DATA-SEEDING.md` | **The feature's cases need data the environment does not hold** — the project-agnostic method for seeding AND reseeding any area of the app. **The engine is generic; only the manifest is per-feature**, so the second feature area costs a fraction of the first. Nine steps (read the CASES not a summary · measure before creating · write the DESIGN RULE first · a keyword that cannot collide · manifest with `serves` and `_why` · seed and VERIFY as separate steps · prove idempotence by running it three times · reconcile server-assigned identifiers · write the traps down), the five-point reseed contract, thirteen feature-independent traps with the symptom each presents as, and what is NEVER seedable. Scaffold: `python3 build/testing-tools/seeding/scaffold_seeding.py <slug> "<Feature>"` · schema: `build/testing-tools/seeding/MANIFEST-SCHEMA.md` · reference implementation: `build/global-search/seeding/` |
| `build/skills/COVERAGE-MATRIX.md` | Checking that a session learning is actually carried by a skill |
| `build/skills/STATE.md` | Resuming work ON the skills themselves |
| `build/handoffs/README.md` | **Four** copy-paste lane briefings for a fresh session |

**⚠️ `10` / `11` / `12` BECAME THIN ROUTERS ON 2026-08-21.** They were full standalone skills that
duplicated `01`/`02`/`03`/`04`/`06`, and **duplicated content drifts** — the two copies were already
disagreeing about whether the branches were final, and one carried a second copy of the Rule-50 write
discipline. **The canonical procedure now lives in the `00`–`08` set and is maintained there only.**
**Nothing was lost in the merge:** new-project onboarding → **`01` §11** · the `Defects-for-Testers`
workbook → **`04` §6.1** · the `API-ASK.md` naming fact → **`06`**. A router holds no substance, so it
cannot drift; **procedure found inside one is a bug in that router.**

**FINALITY LIVES IN `00-COMMON-CORE.md` §16 — READ §16.0, NOT §16.1.** §16.0 (2026-08-21) is current:
**the branches are NOT final**, they are updated by ad-hoc decisions until release day, so Rules 49
and 60 apply in full and findings stay PROVISIONAL. §16.1 is the superseded 2026-08-11 "the branches
are FINAL" text, kept visible and dated.

**🌱 SEEDING AND RESEEDING TEST DATA — THE METHOD IS `build/skills/20-FEATURE-DATA-SEEDING.md`,
THE KEYWORD REGISTER IS `build/global-search/seeding/RESEED.md`, AND IT COVERS EVERY FEATURE, NOT
JUST GLOBAL SEARCH.** Other areas of the app will need seeded data too; each gets
**`RESEED <FEATURE> QA`** / **`RESEED <FEATURE> LIVE`**, registered in that file. **The engine is
generic and only the manifest is per-feature**, so stand a new kit up with
`python3 build/testing-tools/seeding/scaffold_seeding.py <slug> "<Feature Name>"` rather than writing
one from scratch — schema at `build/testing-tools/seeding/MANIFEST-SCHEMA.md`, worked reference at
`build/global-search/seeding/`.

**🌱 GLOBAL SEARCH SPECIFICALLY — FOUR KEYWORDS, `build/global-search/seeding/RESEED.md`.**
🔴 **A RESEED THAT FINDS 0 OF 11 RECORDS USUALLY MEANS THE BRANCH WAS REDEPLOYED — SO CHECK THE BUILD
MARKER BEFORE EXPLAINING ANY CHANGE IN BEHAVIOUR** (`curl -s https://sv9160.qa.shopview.com/ | grep
app-version`). On 2026-09-16 the branch went `v26.36.4-7869ff2` → `v26.36.7-893d13a` overnight and
four behaviours changed with it; blaming the search index instead withdrew **four TRUE findings** that
then had to be restored. **Prove a "not found" with a control on the SAME record (search a different
field of it), re-check minutes apart, and check the IDENTITY of what came back — never the row count.**
A count of 1 is not a pass. **And before reporting any loss, check Jira for an existing ticket** — on
2026-09-16 every one of six already had one.
**TWO UNIVERSES, NEVER MIXED.** `RESEED QA` / `RESEED LIVE` rebuild the **V1-regression** 11 records
(sections 6769 / 8056); **`RESEED GSV2 QA`** / **`RESEED GSV2 LIVE`** rebuild the **Global Search V2
"Fibridge"** universe — 33 records plus the work-order status spread, the purchase orders and the
three vendor-invoice payment states (sections 6721–6740, run R415). Ids and state are keyed by
universe AND environment, so one can no longer overwrite the other. 🔴 **The proof step is a
DIFFERENT script per environment**: `verify_gsv2.py` on the QA branch (V2, `/api/search`) and
`verify_gsv2_v1.py` on production (V1, `/api/global-search/fetch`) — running the V2 one against
production reports a dead environment that is perfectly healthy. A run is finished when the verifier
passes, never when the seeder prints 33/33: *"the record exists"* is not *"the search returns it"*.
Record inventory with real ids: `build/global-search/seeding/SEED-MANIFEST-GS-V2-{qa,prod}.md`.

The QA lead says **`RESEED QA`** (branch `sv9160`) or **`RESEED LIVE`** (the production test account
`app.shopview.com`, workplace **Trucks Hill 2**) and the session does the rest: `seed.py --check`,
`--confirm`, `--check` again, proving **11/11 present, 0 field gaps**. Production needs
`SEED_PROFILE` + `SEED_WORKPLACE` and a **single** login per run (a fresh login expires that user's
previous session). **`0 of 11` is NEVER a clean bill of health** — the seeder says so itself. Four
traps are recorded there and must not be simplified back out: a liveness probe must not use an
endpoint only one version has (`/api/search` 404s on V1); a probe "control" record belongs to ONE
estate and must calibrate against the environment in front of it; **one estate's record ids must
never be written into the shared manifest** (a production run once overwrote the QA branch's and four
work orders read as MISSING while sitting there); and **work orders cannot be found by searching**, so
losing their captured ids means the seeder creates duplicates — remove extras with
`POST /api/work-orders/delete {"work_order_id": …}` (**`work_order_id`, not `id`**).

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
- **🔴 Expected Results QUOTE THE DOCUMENT VERBATIM — the source's own sentence, unaltered**, with
  the document, its version and the section named. Never paraphrased, tidied, merged, split or
  adjusted towards the build; it changes only when the SOURCE changes. A build that differs is a
  deviation; a reviewer who differs is a PO question. **Improving the wording of an Expected Result
  is the failure the rule exists to prevent** — a case rewritten towards the build can never fail.
  Plain-language wording is ADDED AFTER the quote, marked as our restatement, never replacing it;
  where they could disagree the quote wins. No quotable sentence ⇒ hold the case and ask.
  [**113**, 57, 58, 64, 7, 9]
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
| Standing Rules 61–96 (full text) | `build/rules/RULES-61-96.md` |
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
