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

**THEREFORE: NEVER ASSUME YOU HAVE SEEN ALL THE RULES.** There are **99 numbered Standing Rules**.
Count them in the index below. If you are
about to apply a rule, open its file and read it. **NEVER read
`build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` whole** — it will exhaust your context exactly as the
old file did; grep it, or read the relevant `RULES-*.md`.

---

## 1 · CRITICAL CORE — obey these even if you read nothing else

Every **imperative** here is stated in full, because a session that gets only this far must still be
safe. The **evidence** for each one lives in the rule or skill the bullet points at.

> **🔒 §1 ADMISSION GATE — approved by the QA lead 2026-09-02 (Rule 72); recorded in
> `build/rules/INTEGRITY.md`.** A §1 bullet is **≤ 400 bytes and states the IMPERATIVE ONLY.** The
> **verbatim quote, the worked example and the incident history live in the rule or the skill**, reached
> by the pointer the bullet carries — **§1 carries the instruction, the authority carries the evidence.**
> A **refinement AMENDS the existing bullet** on that subject; it never adds a second bullet about it.
> **§1 is hard-capped at 20,000 bytes** — at the cap, the next admission must demote something first.
> **NOTHING IS DELETED BY THIS GATE:** content is MOVED to its rule/skill and pointed at, and the move is
> verified by grep before the §1 text is shortened. **A gate that loses a ruling has failed.**

- **NO TESTRAIL WRITE WITHOUT EXPLICIT PERMISSION (6).** TestRail is the only real production system.
  No `add_case` / `update_case` / `delete_case` / run write / result write without the QA lead's
  explicit go-ahead. Everything else (staging, QA, prod test orgs, QuickBooks) is disposable — act
  freely there, tag throwaway data `ZZAUTOTEST`, restore what you change.
- **NO *JIRA TICKET* CREATION WITHOUT PERMISSION, AND A JIRA CREATION HOLD IS ACTIVE (62).**
  **🛑 THE HOLD IS JIRA TICKETS ONLY. CREATING TESTRAIL TEST CASES IS *NOT* HELD AND NEVER WAS —
  `add_case` and `update_case` are PERMITTED AND EXPECTED, on every project.** QA lead — recorded
  in `build/OUTSTANDING-ITEMS-REGISTER.md` row **H1** on 2026-08-20 and relayed again 2026-08-28 —
  verbatim: *"SOrry new case creation is not held for any project at all, see if you confused Hold on
  Jira ticket creation with Hold on New test case creation."* (He first corrected this on 2026-08-11;
  **two workers have since stalled real work by misreading the hold as blocking TestRail case
  creation.** If you are about to report a requirement as uncoverable "while the hold stands", you have
  made that mistake — **write the case**.)
  For Jira: permission is **PER ASK** — an earlier batch approval never covers a later ticket, and a
  finding being real and obviously worth filing is not permission. **ACTIVE HOLD (QA lead, 2026-08-10,
  verbatim: *"Do not create anything until my next order."*)** — **no Jira ticket** of any type, and no
  new artefact in any other external system of record; **TestRail cases are expressly carved out**.
  **This hold is TEMPORARY with a lift condition (his next order) — a session reading this later must
  CHECK whether it has been lifted, not assume it is standing law.** Register row **H1**.
- **🛑 WE DO NOT CREATE DEFECTS — WE MAKE THE TESTS RUNNABLE (QA lead, 2026-09-01).** Verbatim: *"You
  are never supposed to create defect, you are supposed to make the tests RUNNABLE."* **A pass no longer
  ends with a defect candidate awaiting permission.** Where the build does not match the document: the
  documented expectation STAYS (57), the case gains the **three outcomes** in plain words so the tester
  runs it and marks it **Failed**, the marker stays `AUTOMATION: READY` (an `EXPECT FAIL` marker needs a
  live ticket and there is none), and the finding is reported **with its C-id** — no ticket text, no ask,
  no candidate file. This **supersedes Rules 51/52/53/62/73/94 and `build/skills/06-DEFECT-PREP.md` for
  the lane's own output**; skill 06's shape still governs *if he asks for a ticket*. Worked examples,
  2026-09-01: **C45068**, **C45060**, **C44996**. Full text: `build/rules/RULES-61-99.md` rule 62
  amendment of 2026-09-01.
- **🛑 ALWAYS GIVE THE TEST CASE NUMBERS (QA lead, 2026-09-01).** Verbatim: *"ALways give test case
  numbers."* Every report row names its **C-ids**, never just a count; a completed-versus-left figure
  states **both numbers AND lists the ids of what is left**. Rule 98 amendment.
- **🛑 A DEFECT CANDIDATE IS RE-VERIFIED ON THE BUILD *AFTER* THE GO-AHEAD, AND ONLY THEN ASKED ABOUT
  (QA lead, 2026-09-01).** Verbatim: *"Hold all such tickets for now - for other suites too, we may
  need to create them after verifying the build once again when I will give you a go ahead, but make
  sure even when I give you a go ahead I will verify on the build once again and if you still find the
  issue then you will ask me for the permission to create the ticket."* **Three gates, in order:
  (1) every candidate is HELD, on every suite · (2) his "go ahead" is permission to LOOK AGAIN, never
  to file · (3) reproduce it on the build as it stands that day — if it no longer reproduces, CLOSE the
  candidate and say so; if it does, ASK for permission per candidate.** Compounds with Rule 62's
  per-ask permission; the re-verification comes BEFORE the ask, it does not replace it. Full treatment:
  `build/skills/06-DEFECT-PREP.md` §A10-b.
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
- **🛑 A LABEL IS READ FROM THE SMALLEST ELEMENT THAT OWNS IT, NEVER A CONTAINER (2026-09-02).**
  `cells[i]` per column header, `value` for an input, `textContent` otherwise, icons stripped.
  Flattened text answers "does this appear", NEVER "this is the label". Capitalisation alone is no
  divergence. A WRITE-hold (71) is not an OBSERVATION-hold.
  Full text: `build/skills/03-RUN-CHECK.md`.
- **VERIFIED MEANS OBSERVED, NEVER INFERRED (12).** Only mark Verified / Pass / Fail / present /
  absent if it was observed live, with evidence captured that run. Anything not observed is labelled
  **NOT VERIFIED** or **Blocked-with-reason**. Never fill a gap with inference to look complete.
- **A V2 / UPGRADE PROJECT MUST DERIVE AND TEST THE INVARIANT SET (96).** What the V2 spec does NOT
  mention is still a requirement: **silence defaults to "must not change"**, and high-collateral-risk
  silence is escalated as a PO question rather than assumed. **Documents establish intent; code
  establishes fact** — and a code-vs-document conflict is a **PO DECISION ITEM, never a silent
  invariant.** Skill: `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`.
- **🛑 COUNT FROM THE SYSTEM OF RECORD, NEVER A LOCAL SNAPSHOT (2026-09-02).** Cases, sections
  and runs are counted LIVE from TestRail, paged; app facts come from the endpoint that answers the
  question. Never the id-map, a `cases/*.json`, a repo note, or a figure remembered. Ask: "which list
  did this come from, and is it the list the question is about?" `build/skills/00-COMMON-CORE.md`.
- **🛑 A RULE'S AMENDMENT IS PART OF THE RULE.** Read the rule in its file to the END,
  amendments included, and encode the amendment in any check you write — project-scoped, never a
  blanket allowance. Worked miss: `build/rules/RULES-21-40.md` rule 38 amendment of 2026-09-02 and
  `build/skills/00-COMMON-CORE.md` §5.0.
- **🛑 THE MISTAKE-PREVENTION MECHANISM IS TWO FILES, NOT A CHECKLIST (QA lead, 2026-09-02).**
  Before reporting a suite run `python3 build/testing-tools/verify_suite.py`; before reading anything
  off the build use `build/testing-tools/probe_lib.mjs`. When a gate flags a label, check the
  REFERENCE first; a PASS is not the end of a case. Full text: `build/skills/00-COMMON-CORE.md`.
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
- **NEVER DECLARE A BLOCKER WITHOUT SEARCHING THE REPO FIRST (97).** **STEP 0 IS `git fetch origin` —
  never search, measure or report a repository fact from a stale checkout** — and **if you are on a
  different branch, search the canonical one without checking it out**:
  `git grep -n "<exact error text>" origin/claude/slack-session-0sxnd9 -- build/` ·
  `git show origin/claude/slack-session-0sxnd9:<path> | grep -n "<what you need>"`. **"Not on this
  branch" is NEVER a reason to conclude something does not exist.** (The Standing Rules moved OUT of
  CLAUDE.md into `build/rules/RULES-*.md` on **2026-08-21**; a session saying "the rules live inside
  CLAUDE.md" is stale.) Before reporting anything as
  impossible, blocked, unavailable or unreconstructable, **grep the workspace using the EXACT ERROR
  TEXT** — that is what finds it. Four places, in order: `build/APP-ACTIONS-PLAYBOOK.md` ·
  `build/skills/14-ACCESS-RESILIENCE.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` ·
  `build/rules/RULES-*.md` (grep, never read whole). Also `ls build/BLOCKED-*.md` — **several are
  marked RESOLVED with the cause** — and `git log --all --grep=`. **If you still cannot find it,
  REPORT THE SEARCHES YOU RAN** so the gap is known to be real rather than unsearched. One tool
  failing is a fact about that tool, never about the task (68). **Solve something new ⇒ write it into
  the playbook or the skill IN THE SAME PASS** (93). Five 2026-08-28 false blockers are in the rule.
- **STRATEGY FIRST (79).** Before starting ANY task, devise or recall the smartest quota-efficient
  plan — then begin. One pass, then exit.
- **TELL THE LAST-DONE DATE AND ASK BEFORE RE-RUNNING (80).** Never silently repeat a verification,
  VIU or ordered task: say when it was last done and ask whether to run it again. A check within the
  last 3 builds / 3 source versions still COUNTS, with its date shown (77).
- **SOURCE VERIFICATION IS OFFERED AND GATED, NEVER AUTO-RUN (81).** Make the source current FIRST,
  but ask before spending the quota on it.
- **🛑 SEARCH THE PLAYBOOK BEFORE THE FIRST EXPERIMENT, NOT AFTER THE FIRST FAILURE (97, amended
  2026-09-02).** QA lead: *"What went wrong was sequencing — you experimented before searching the
  repo, and everything above was recorded on 2026-08-28."* Rule 97 already forbids declaring a blocker
  unsearched; the amendment is that it also forbids **probing** unsearched. Getting a signed-in QA
  browser cost eight probes, a wrong root cause, a false alarm that the QA lead's session had been
  destroyed, and an ask he had to reject twice — while
  **`build/APP-ACTIONS-PLAYBOOK.md` §A "THE AUTHENTIC QA-BRANCH LOGIN"** and the harness
  **`build/testing-tools/qa-branch-boot.mjs`** held the whole answer, dated 2026-08-31. **⇒ Before the
  first probe of any environment: `grep -n "<the thing>" build/APP-ACTIONS-PLAYBOOK.md` and
  `ls build/testing-tools/`. A committed harness is reused, never rebuilt.**
- **🛑 QUICK-LOGIN IS THE ROUTE, AND ONE COOKIE ONLY (2026-09-02).** Run
  `node build/testing-tools/qa-branch-boot.mjs <branch> <route> admin`. Carry `sv_sso_session` ONLY,
  scoped **HOST-ONLY** — a domain-scoped cookie 409s right after a 200 login, which looks like a dead
  session and is not. Judge by `fe_permissions.length`, not `role.name`.
  Traps: `build/APP-ACTIONS-PLAYBOOK.md` §A.
- **AUTOMATED CASES ARE READ-ASSESSED, THEN HELD FOR THE QA LEAD (71).** Never change or delete a case
  TestRail flags as Automated without his go-ahead; if a pass does change one, TELL VLAD (65).
- **COMMIT AND PUSH AFTER EVERY STEP, PATH-SCOPED (29).** Git is the only durable store; the container
  and `/tmp` are ephemeral. `git add -- <paths>` only — **never `git add -A` / `git add .`**.
- **ALWAYS PAIR AN INTERNAL ID WITH ITS C-ID AND LINK (8).** Never a bare `FLT-…`/`SCH-…`: give
  `C#####` and `https://shopview.testrail.io/index.php?/cases/view/<id>` — in files AND in chat.
- **🛑 EVERY REPORT IS FIVE TABLES: DONE · LEFT · BLOCKED · HOW TO UNBLOCK · HANDOFF-READY (98, QA lead
  2026-09-01).** Verbatim: *"give me the report in the table format about what has been completed and
  what is left and why and how to complete that too and what is blocked on what and how to get
  unblocked on that and if the suite is ready to be handded of to the Manual Qa tester."* Prose is not
  a report. **Table 2 must say how to finish each item concretely enough for a DIFFERENT session to
  execute it without asking · Table 3 must name what the blocker does NOT block (68) · Table 5's last
  row is a bare YES or NO and is NO unless every gate above it passed.** Rule 36's OUTSTANDING section
  still closes the report. Full text: `build/rules/RULES-61-99.md` rule 98.
- **🛑 EVERY ASK IS SELF-CONTAINED AND EXECUTABLE (99, 2026-09-02).** Each item he must
  decide carries five, in plain words: **what it is** · **how it came up** · **the question** ·
  **the options**, each saying what we would then DO · **the cost of silence** and what it does not
  block (68). If answering needs a file opened, it is not finished.
  `build/rules/RULES-61-99.md` rule 99.
- **EVERY REPORT ENDS WITH "OUTSTANDING — what I need from you" (36).** Say *"nothing outstanding"* if
  that is true; never omit the section. Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current.
- **🛑 A QUESTION SHEET IS ALWAYS A SPREADSHEET, NEVER A MARKDOWN TABLE (QA lead, 2026-09-01).**
  Verbatim: *"the questions should always be in Excel or google soreadsheet, in a lay man language for
  a nontechnical person to understand."* Deliver **`.xlsx`** (or a Google Sheet) in the established
  column shape — **`# · Topic · What happens now · The question · Options · Your answer`** — one sheet
  per feature, plus a final **QA internal** sheet carrying the case ids and requirement anchors that
  the PO is not meant to read. **The PO-facing sheets contain no case ids, no spec anchors, no API or
  HTTP terms, no field names** (7/9); every question offers **OPTIONS** so it can be answered by
  ticking one. Generator + the enforced layman check: `build/testing-tools/make_question_sheet.py`.
  Still governed by Rule 55 (project and feature named on every row, answerable by a non-technical
  reader) and Rule 66 (the sheet is the LAST thing sent).
- **🎨 A DESIGN REFERENCE IS A LINK *AND* A ROUTE (QA lead, 2026-09-01).** Provenance reads
  `Design: the Design Document (<link>) — open "<view>" → "<document>", then <the block>.
  (<toggle>.)` in the design's **own button labels, read out of the file**. Verify every anchor
  before writing it; read the design BEFORE escalating a question.
  Technique: `build/skills/02-SOURCE-CHECK.md`.
- **PLAIN LAYMAN WORDING (7/9).** Tester-facing and PO-facing text uses the build's exact labels and
  no jargon — no case IDs, spec anchors, HTTP terms or internal names in what they read.
- **🛑 RUNNABILITY IS A DELIVERABLE OF BUILD VERIFICATION, NOT A TIDY-UP (QA lead, 2026-09-01).** Verbatim:
  *"ONE of the major part of build verification is TO make the steps of replication and preconditions
  RUNNABLE and not to keep those test cases the spec level test cases … this thing never bites me."*
  **A build-verification pass is NOT done when the verdicts are in** — it is done when **every case in
  the suite**, verified this run or not, carries UI preconditions and steps a manual tester can follow.
  **Gate: `python3 build/testing-tools/check_runnable_cases.py --section-prefix "<suite>"`** — reads
  TestRail LIVE, exit 1 on any failure; drive it to zero before reporting a suite done. It replaces
  `check_layman_steps.py`, which passed any case containing the words *"open the"*. Skill: `build/skills/18-LAYMAN-UI-STEPS.md`.
- **🛑 RUNNABLE-SHAPED IS NOT BUILD-VERIFIED — THE LABELS MUST BE READ OFF THE SCREEN (2026-09-01).**
  `check_runnable_cases.py` proves a precondition is tester-SHAPED and says in its own header that it
  **cannot** prove the route is correct. Asked *"confirm if the preconditions are also Build verified"*,
  a label inventory found **117 cases naming a permission “Work Order Line - Create and Edit” and 90
  naming “Work Orders → Work Order View Mode” — neither string exists**; the build says the
  **“Work order lines”** section's **“Create & Edit”** toggle and the **“Work orders”** section's
  **“View mode”** (`Full View` / `Tech view`). **⇒ TWO GATES, ALWAYS BOTH:**
  `check_runnable_cases.py` (shape) **and**
  `python3 build/testing-tools/check_precond_labels.py --sections <ids> --observed build/OBSERVED-UI-LABELS-<env>.md`
  (are the quoted labels real). A label enters the observed file **only from a probe with committed
  evidence** — never from an API field name, a spec, or a note in this repo: copying `Fee & Discount`
  from an old note when the build says `Fee / Discount` made the new gate flag 42 correct cases.
  Full text: `build/skills/18-LAYMAN-UI-STEPS.md`.
- **🛑 EVERY CASE IS RUNNABLE FROM THE UI BY A LAYMAN — NO SPEC-LEVEL PRECONDITIONS OR STEPS (skill 18,
  QA lead 2026-08-31, UNIVERSAL — ALL cases, ALL suites, NOT only build-verified ones).** A precondition
  that asserts a *state* ("a document exists whose work order has … set") or a step that *summarizes* an
  action ("Generate the Invoice") is DEFECTIVE. Preconditions carry the **route as UI clicks** — the five
  things: (1) entry point (top-menu/screen, exact label) · (2) which record to open and how you know it's
  the right one · (3) the tab/panel · (4) where the thing appears · (5) any default-on filter that hides
  it. Steps describe the check; **Expected Results still come from the documents, never the build (57).**
  **NEVER make a step followable by inventing a path or a state a tester cannot actually reach** (skill 18
  hard line) — where a route needs the live build to confirm and no build exists yet (Rule 85), draft it
  from the **design/spec** and mark it PROVISIONAL, never fabricated. This is part of the tester-readiness
  gate (84): a case with spec-level preconditions/steps is NOT tester-ready. Skill: `build/skills/18-LAYMAN-UI-STEPS.md`.
  **RUNNABILITY LIFECYCLE: provisional at source-verification (no build) → FINALISED at build-verification**
  (the build's own labels + `AUTOMATION: READY`; QA lead: *"build verification is the final touch-up … to
  make the tests runnable"*). **COORDINATION (verify live, Rule 86): before any runnability pass on a suite,
  check whether a QA build now exists (a "QA env: none" line can be STALE) and whether a parallel session is
  already build-verifying it — if so, that session OWNS the suite's routes; DEFER, do not run a
  design-provisional pass over it (concurrent UI edits collide / can downgrade a build-verified route).**
- **FOREIGN CASES AND TICKETS ARE HANDS-OFF (38).** Report, never edit. State both numbers: ours N /
  live total M. **ALWAYS NAME THE CREATOR when you call a case foreign** (look up the TestRail user, e.g.
  `get_user/<id>`) — the QA lead decides scope by who authored it. **A case authored by the project's
  designated MANUAL QA TESTER is NOT foreign — treat it as IN-SCOPE (as if created by the QA lead):
  source-verify it, keep it tester-ready, update it.** The QA lead names who the tester is per project;
  once named, that person's cases on that project are ours to maintain.
  **🛑 VLADIMIR TOMOVIC'S CASES ARE NEVER CHANGED — RE-CONFIRMED 2026-09-01, verbatim: _"If the creator
  is Vladimir leave the test cases as is - remember this rule."_ (and earlier the same day: _"C45220 and
  others where the creator of the test case is Vladimir, do not change them."_)** — TestRail user **1**,
  `created_by = 1`. **The test is `created_by == 1` checked before the write, never the title.** It does
  not matter that the case fails a gate, has no steps, or is the only thing between a suite and a clean
  score: report it, name the author, leave it. **No general go-ahead reaches his cases and we do not
  re-ask per case.** Report them, never edit them, whatever else a session has been authorised to
  override. Check `created_by` before any write, not the title. **Recorded testers:** Invoice UI
  Refresh → **Mudassir Qamar** (TestRail user 6, mudassir.qamar@shopview.com), confirmed 2026-08-31.
  **THE TWO MANUAL QA TESTERS ARE ASSIGNED PER SUITE — do not merge them (QA lead, 2026-09-01,
  verbatim: _"invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria."_):**
  **Invoice UI Refresh → Mudassir Qamar** (TestRail user 6) · **Inline Add and Edit Parts (6597) and
  Printer Friendly WO (6617) → Viktoria Videnovic** (TestRail user 4). **Spelling is "Viktoria"**, not
  "Victoria" — older notes have it wrong. A handover names the tester who actually owns that suite.
  (Still respect Rule 71: never change a case flagged **Automated** without the QA lead — even a tester's.)

---

## 2 · THE RULE INDEX — all 99 rules, and where each one lives

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

### `build/rules/RULES-61-99.md` — rules 61–99

| # | Rule (short title) |
|---|---|
| **61** | THE EXPECT-FAIL MARKER IS AN INSTRUCTION, NOT A PREDICTION — NAME THE SYMPTOM, AND LET THE |
| **62** | NO **JIRA TICKET** IS EVER CREATED WITHOUT THE QA LEAD'S EXPLICIT PERMISSION — **JIRA ONLY; CREATING TESTRAIL TEST CASES IS *NOT* HELD AND NEVER WAS** (`add_case`/`update_case` permitted and expected, every project) |
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
| **87** | SNAPSHOT CASE BODIES SO A FOREIGN EDIT IS ALWAYS DIFFABLE — **but CHECK `get_history_for_case` FIRST: corrected 2026-08-28, it IS the authoritative per-field record (old + new values, full bodies), so nothing is "unreconstructable" until that call has been made; the snapshot is the fast offline diff, not the only evidence** (all projects, permanent) |
| **88** | LANE-SESSION CONTEXT DISCIPLINE — a session WITH direct tools must never bulk-read; script it |
| **89** | ACCESS RESILIENCE AND MCP HYGIENE — every session keeps a working path to every source, and |
| **90** | SHARED-QUOTA BUDGET ALLOCATION ACROSS SESSIONS (all projects) |
| **91** | THE VERIFICATION FRESHNESS BADGE — every build/source verification claim is shown with a COLOUR |
| **92** | A LANE SESSION IS A PROJECT-AGNOSTIC ENGINE — IT WORKS ONLY ON THE PROJECT IT IS GIVEN, AND EXISTING PROJECT STATE IS REFERENCE, NOT A BACKLOG |
| **93** | THE LEARNING LOOP — EVERY PROJECT ENDS WITH A RETRO THAT PROPOSES RULE AND SKILL IMPROVEMENTS (it PROPOSES; Rule 72 records) |
| **94** | THE DEFECT ADMISSIBILITY GATE — NO TICKET IS FILED UNTIL IT PASSES EVERY CHECK, AND THE LANE'S OUTPUT IS APPROVED CANDIDATES, NOT FILED TICKETS |
| **95** | THE TOKEN-DISCIPLINE CHARTER IS CARRIED BY EVERY SESSION AND EVERY HANDOFF — AND QUALITY IS NEVER WHAT GETS CUT |
| **96** | A V2 / UPGRADE PROJECT MUST DERIVE AND TEST THE INVARIANT SET — WHAT THE SPEC DOES NOT MENTION IS STILL A REQUIREMENT |
| **97** | NEVER DECLARE A BLOCKER WITHOUT SEARCHING THE REPO FIRST — THE ANSWER IS USUALLY ALREADY WRITTEN DOWN |
| **98** | EVERY REPORT IS A TABLE THAT ANSWERS FIVE QUESTIONS — DONE · LEFT · BLOCKED · HOW TO UNBLOCK · HANDOFF-READY |
| **99** | EVERY ASK IS SELF-CONTAINED AND EXECUTABLE — HE MUST NEVER HAVE TO LOOK SOMETHING UP TO UNDERSTAND WHAT IS BEING ASKED |

**Operator forms** (the rule bodies are all in `build/rules/RULES-61-99.md`): **95** →
`build/skills/TOKEN-DISCIPLINE-CHARTER.md` · **96** → `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`
(project type asked at intake, `15-NEW-PROJECT-INTAKE.md` §1a) · **97** → the SEARCH-BEFORE-YOU-GIVE-UP
drill, carried inline by every handoff · **89** → `build/skills/14-ACCESS-RESILIENCE.md` ·
**91** → `build/testing-tools/verification_badge.py`. When each rule was added, and the file's rename
history, are in `build/rules/INTEGRITY.md`.
**Rule 91 badges: ✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never build-verified** — always with the
date (and build marker or spec version). Rule 91's correction (**the branches are NOT final**, so Rules
49 and 60 stay in force and a gap is possibly-unfinished, not automatically a defect) is stated in full
in `build/skills/00-COMMON-CORE.md` §16.0.

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
| **Report Suite** (6 reports, epic **SV-8582** — **114** children, was 105) | **ACTIVE** — **516 cases ours** (live 532 incl. 16 foreign), run 359 = **516 tests / 535 results**. **Corrected 2026-08-28: the row said 509, which was wrong; the damage sweep re-derived 513 that morning and three WIP cases (C45208–C45210) were authored the same day.** Branch final for **WIP · Technician Utilization · Sales By Customer** only; SBR/PV/IV not final (Rule 49 amendment 2026-08-10). Verified on **staging**, not on `sv8582` (that host → **HTTP 502**) | ✅ **2026-08-20** (`v3.8-d0e135e`; staging now `v3.10-49b5fe3`) | 🟠 **2026-08-11** — **all six specs moved since** (2026-08-13 / 2026-08-20); Inventory Value measured at **Confluence v10** vs our v5 | Chris Ward · `build/report-suite/PROJECT-STATE.md` |
| **Schedule** (epic **SV-8685** — **40** children, was 24) | **ACTIVE** — **195 cases** (0 foreign; CLAUDE.md said 168), run 357. Rule-49 queue OPEN; verdicts PROVISIONAL | ✅ **2026-08-20** (`v3.8-d0e135e`, staging; own branch `sv8685` = `v3.8-bc7508a`) | 🟠 **2026-08-11** (Confluence **v27**) — **page moved 2026-08-20, uningested** | Branko · `build/schedule/PROJECT-STATE.md` |
| **Filters** (epic **SV-8785** — **34** children, unchanged) | **ACTIVE** — **124 cases ours** (live 129 incl. 5 foreign; CLAUDE.md said 114), run 352. Rule-49 queue OPEN; verdicts PROVISIONAL | ✅ **2026-08-19** (`v3.8-d0e135e`, staging; own branch `sv8785` = `v3.7-6e2d301`) | ✅ **2026-08-18** (Confluence **v21**) — **but the page moved 2026-08-20, so the badge is fresh and the source is behind**. Spec page id **`572030978`** (was "TO CONFIRM"); in-body "1.8" is the Rule-31(a) trap | Branko · `build/filters/PROJECT-STATE.md` |
| **Global Search** (epic **SV-9160** — **24** children; **epic EXISTS since 2026-08-12**, our record said "not available") | **REVIVED as V2** — **118 cases ours**, live under **group 6720 *Global Search V2 (Aug 2026)*** (126 in the Global Search tree incl. **8 foreign**, all Vladimir Tomovic's, sitting directly in section 49). **Corrected 2026-08-28: the row said "86 cases in group 4094"; section 4094 NO LONGER EXISTS and every one of our 118 was created 2026-08-25 (98) or 2026-08-26 (20) — the V2 revival push, not a miscount.** ⚠️ **12 API cases from the id-map (C44883–C44894) are gone from TestRail**, which the 2026-08-25 note *"lossless, nothing deleted"* does not explain — see `build/global-search/PROJECT-STATE.md`. No QA branch exists, so nothing has ever been observed | ❌ **NEVER build-verified** | 🔴 **2026-07-16** — PRD moved **2026-08-20**; the epic also carries 4 open questions + 2 PRD corrections (PRD says PostgreSQL/`pg_trgm`, stack is **MySQL on Aurora**; says "React context", app is **Vue 3 + Quasar**) | Branko · `build/global-search/PROJECT-STATE.md` |
| **Simple Flow** (epic **SV-7301** — **25** children) | **COMPLETED** (2026-07-27 ruling) — docs retained. **185 cases ours** live (2 foreign); local id-map says 189 — **4-case mismatch, reported not investigated** | 🔴 **2026-07-29** (`sv7301` = `v2.320-44e5b70`) | 🔴 **2026-07-17** (V2.6) — spec page unchanged since 2026-07-16 | Milos · `build/simple-flow/PROJECT-STATE.md` |
| **Fees & Discounts V1** (epic **SV-7387**, Done — **24** children) | **COMPLETED** (2026-07-27 ruling) — docs retained. **200 cases ours** live (2 foreign); local id-map says 203 — **3-case mismatch, reported not investigated** | 🔴 **2026-07-22** (`qb` = `v3.1-4eaa076`) | 🔴 **2026-07-20** (V1_3) — spec page unchanged since 2026-07-14 | Chris Ward · `build/fees-discounts/PROJECT-STATE.md` |
| **Custom Roles & Permissions** (epic **SV-7388** — **269** children) | **RECURRING** — re-run the 4-layer permission VIU after EVERY feature release (it regresses when other features ship). **515 cases ours** live under group 3527 (714 total, **199 foreign**) and **no `testrail-id-map.csv` exists**, so current scope cannot be reconciled locally | 🔴 **2026-07-27** (staging now `v3.10-49b5fe3`) | 🔴 **2026-07-27** — spec page unchanged since 2026-07-17 | **Sasha Grosman** (recorded 2026-08-28; TestRail user 9 spells it "Grossman" — spelling unconfirmed with him) · `build/custom-roles/PROJECT-STATE.md` |

**BLOCKED, with the exact ask in each file (all in `build/OUTSTANDING-ITEMS-REGISTER.md` as R1–R6):**
`BLOCKED-shopview-app-session.md` (**STAGING ONLY** since 2026-09-02 — QA-branch login is proven and
routine: playbook §A) ·
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
| `build/skills/18-LAYMAN-UI-STEPS.md` | **Before any handover to a manual tester** — every build-verified case must be followable from the UI by a layman: the entry point, the record, the tab, where the thing appears, and any default-on filter that hides it. Carries the observed routes for sv8218 and the hard line: making a step followable must NEVER make an unreachable state reachable on paper (QA lead, 2026-08-31; testers Viktoria, Mudassir Qamar) |
| `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` | **The project is a V2 / upgrade of an existing feature** (Rule 96) — a V2 spec says only what CHANGES and is SILENT about the rest, so derive the **invariant set** (V1 baseline − changed ∪ removed ∪ replaced), escalate the dangerous silences, retire the superseded V1 cases. No build, no cookies |
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

**Other standing infrastructure docs:** `build/PROCESS-CATALOG.md` (every callable process) ·
`build/APP-ACTIONS-PLAYBOOK.md` (proven staging/QA action recipes — **read before any staging
action**; §J TestRail traps, §K production access) · `build/TESTING-RUNBOOK.md` ·
`build/OUTSTANDING-ITEMS-REGISTER.md` · `build/NO-WORK-LOSS-STRATEGY.md` ·
`build/QA-QUALITY-PIPELINE-EXPLAINER.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` ·
`build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` · `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` ·
`build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` · `build/MISSING-TRACEABILITY-PROCESS.md` ·
`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` · `build/PROD-VS-STAGING-COMPARE-METHOD.md` ·
`build/COMPARISON-WORKBOOK-RECIPE.md` · `build/PROCESS-AUTHORING-STANDARD.md` ·
`build/LESSONS-2026-07-31.md` · `build/NAVIGATION-MAP-TEMPLATE.md` (copy to
`build/<project>/NAVIGATION-MAP.md` — navigation paths OBSERVED once on the build and RECORDED, then
reused; convention in `build/skills/03-RUN-CHECK.md` §9).

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
- **"MANUALLY ADDED" SOURCE — for a case the QA lead authors from PRODUCT KNOWLEDGE, not the spec
  pipeline** (field-level editability, pricing-matrix behaviour, etc. not spelled out in the PRD): the
  provenance reads **"Source: Manually added (QA lead, <date>)"** instead of the "as per epic …
  specification version …" sentence, and it carries **AUTOMATION: HOLD — manually added; to be
  build-verified** with any UI labels flagged PROVISIONAL. It must still be runnable
  (`check_runnable_cases.py`) and render `fr-view`. Worked example: C44996 was split into the manually-added
  C45250–C45253 (Inline). Full pattern (split one vague case into concrete single-behaviour cases, each
  building its own state) in `build/skills/18-LAYMAN-UI-STEPS.md`. [2026-09-01]
- **The build is named ONLY as what a case was last checked against.** *"as per the build tested on…"*
  is **BARRED**. Not yet checked against any build ⇒ omit sentence 2 or say plainly it has not been
  checked. [54, 57]
- **A DIVERGENCE SENTENCE follows the provenance line only where the case follows a later decision
  that differs from an earlier source** — where the PO asked for it (file + link + date), where it
  differs, and that we take the latest as prevailing. **Never added where nothing contradicted it.**
  [56]
- **🛑 AUTOMATION TYPE FIELD IS SET ON CREATION, NEVER LEFT NONE (QA lead, 2026-09-02).** Verbatim:
  *"going forward every test case you directly create in Testrail or if you give me the CSV/XML file to
  upload these must contain the AUTOMATION type for each test case, so that we never have to edit the
  testrail test cases for this again."* This is the TestRail **`custom_automation_type`** field
  (`0 None · 1 E2E · 2 Functional · 3 Unit`) — **DISTINCT from the `AUTOMATION:` marker literal below
  and from `custom_atmstatus`.** Every `add_case`, and every **CSV/XML/import deliverable** handed over
  for upload, carries a **real type per case — 1/2/3, never 0/None, never blank.** Rubric: **Unit** =
  isolated calculation / format / single-field validation · **E2E** = cross-feature journey, browser
  print dialog, audit trail, or email/PDF delivery · **Functional** = single-feature UI behaviour
  (default). A not-yet-automated case (`custom_atmstatus: 1`) still declares the KIND of automated test
  it would become. **This supersedes the older "`custom_automation_type: 0`" instruction** (a 285-case
  sweep on 2026-09-02 had to backfill the field precisely because cases were born `0`). Full text +
  the corrected field map: `build/skills/01-CASE-BUILD.md`, `build/skills/00-COMMON-CORE.md` §3.1. [61]
- **AUTOMATION MARKER — the LAST thing in Expected Results**, after the provenance line, blank line
  before and a line break after. Exactly one of: `AUTOMATION: READY` ·
  `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <short plain reason>`. A machine-
  findable literal — never reworded or abbreviated, exactly one per case. **A tool flag never justifies
  HOLD** (devtools, DOM/network, PDF/CSV reading, seeded data, viewports are all automatable); only a
  genuinely unobtainable thing does. **NOT-BUILT cases are excluded from any ready-to-automate figure.**
  Arithmetic gate: READY + EXPECT-FAIL = total − HOLD, read back from the live cases. [61, 60]
  **🆕 2026-08-31 — THE STAGING-ONLY HOLD.** A case whose PRECONDITIONS require a **customer-portal**
  artefact cannot be tested on a QA branch at all (QA lead, 2026-08-31: *"Customer portal related
  tickets can only be tested on staging and not on the QA branch. We need to put this marker on such
  tickets aswell."*). It carries
  `AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch`
  — a HOLD, so the arithmetic gate above is unaffected. **Scope it from the preconditions, never from
  the word "portal":** a case that verifies the portal feature's ABSENCE on the shop-app path is
  testable on the branch and must not be parked. Full treatment + the worked example:
  `build/skills/00-COMMON-CORE.md` §5.0-b.
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
- **🛑 TESTRAIL CASE-FIELD FORMATTING AND THE API-WRITE ESCAPING-CONTAINER TRAP — ONE BULLET, TWO HALVES
  (merged 2026-09-02; full trap, round-trip evidence and the served-page scanner:
  `build/APP-ACTIONS-PLAYBOOK.md` §J).**
  **(i) WHAT TO EMIT — `<p>`/LIST BLOCKS ONLY, NEVER STYLING INLINE TAGS, NEVER PLAIN NEWLINES.** The
  `preconds`/`steps`/`expected` fields are Markdown but TestRail wraps every submitted value in ONE
  outer `<p>`, so plain `\n\n` **loses all line breaks** (collapses to a wall of text) and **styling**
  inline tags (`<b>`, `<i>`, `<code>`, `<em>`, `<strong>`) **show literally**. **`<br>` is
  ORIGIN-DEPENDENT: it renders from a UI edit but shows LITERALLY when written via the API** — so
  **never emit `<br>` (or any inline tag) in an API payload**; to put lines on their own rows use
  separate `<p>` blocks or a `<ul><li>` list. Format with block tags only: **`<p>` per paragraph,
  `<ol>/<ul><li>` for lists, `<hr />` for a separator** — and put the **source / provenance BELOW the
  expected behaviour after an `<hr />`**, as a `<p>` label + `<ul><li>` list + a final `<p>` date. When
  editing a case after source verification, **keep formatting 100% intact**: copy the proven-good
  structure (e.g. Global Search C44804) or reuse the block-only converters in
  `build/global-search/apply_to_testrail.py`; never hand-author inline HTML. [proven live 2026-08-28,
  C27800]
  **(ii) WHERE IT LANDS — BLOCK HTML WRITTEN VIA THE API IS OFTEN UNREADABLE, AND
  `check_case_render.py` CANNOT SEE IT (measured 2026-08-31).** TestRail serves each field in one of two
  containers, invisible to the API: `<div class="markdown fr-view">` renders block HTML; plain
  `<div class="markdown">` **ESCAPES it** so the tester literally reads `<ol><li><p>`. **An API
  `update_case`/`add_case` leaves the field in the ESCAPING container; only a UI SAVE flips it to
  `fr-view`.** So a case can PASS `check_case_render.py` (which reads the API-stored value) and still be
  unreadable on screen. **⇒ (a) the
  post-write check is TWO steps now: the stored-value check AND a served-page container scan (log into the
  UI, GET `/index.php?/cases/view/<id>`, require `markdown fr-view`); (b) repair escaping cases through
  the UI editor (Playwright), NEVER by another API write — proven recipe in
  `build/build-verify-session-2026-08-21/repair-2026-08-25/` and playbook §J; (c) plain text in an
  escaping container still renders as text, so do NOT "upgrade" a readable plain-text case to block HTML
  via the API — that makes it WORSE.**
  **🆕 STANDARD (QA lead, 2026-08-31): after ANY API-write pass, the served-page container scan + UI-repair
  of every escaping case to `fr-view` is the REQUIRED post-step — not optional.** Proven recipe (Playwright →
  Froala `html.set` → deadlock-retry): `build/inline-add-edit-parts/render-repair-2026-08-31/` and
  `build/build-verify-session-2026-08-21/repair-2026-08-25/`. The 76-of-118 worked example that
  established this is in `build/inline-add-edit-parts/PROJECT-STATE.md`.
- **🛑 POST-WRITE RENDER SELF-CHECK — after ANY case create/update, fetch it back and confirm it
  renders correctly before calling it done.** Never assume the write looks right; verify it. Run
  `python3 build/testing-tools/check_case_render.py <C-ID> …` (fails on inline tags, wall-of-text, or
  no block structure) **AND then the served-page container scan** (above) — a green stored-value check is
  NOT sufficient on its own. A case is "done" only when the served page shows `fr-view`. [standing rule, 2026-08-28; served-page correction 2026-08-31]
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
| Standing Rules 61–98 (full text) | `build/rules/RULES-61-99.md` |
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
