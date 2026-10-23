# CLAUDE.md §1 CRITICAL CORE — verbatim copy before the 2026-10-23 consolidation

Saved byte-for-byte before §1 was brought back under its 20,000-byte cap (QA lead 2026-10-23: *"find a way to never be trapped in situations like this"*). Every bullet shortened that day keeps all of its imperatives; the evidence it carried (verbatim quotes, worked examples, incident histories) is preserved here word for word and in the rule or skill each bullet points at.

---

## 1 · CRITICAL CORE — obey these even if you read nothing else

Every **imperative** here is stated in full, because a session that gets only this far must still be
safe. The **evidence** for each one lives in the rule or skill the bullet points at.

> **🔒 §1 ADMISSION GATE — approved by the QA lead 2026-09-02, clause 1 amended by him 2026-09-03
> (Rule 72); recorded in `build/rules/INTEGRITY.md`.** A §1 bullet is **≤ 400 bytes PER SUBJECT and
> states the IMPERATIVE ONLY**; a **compound standard** whose imperatives alone exceed that is **ONE
> bullet with LABELLED PARTS** `(a)`/`(b)`/`(c)`, never two bullets (precedent 2026-09-02, the two
> TestRail formatting halves). **400 IS A BUDGET PER SUBJECT, NOT A CEILING ON A MERGED BULLET — AN
> IMPERATIVE IS NEVER DROPPED TO MEET A BYTE BUDGET** (95 clause 12): demote the evidence and merge the
> bullets instead. The
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
- **🛑 WE CREATE NO EXTERNAL ARTEFACT WITHOUT HIS EXPLICIT PERMISSION — AND WE DO NOT CREATE DEFECTS AT
  ALL (62; QA lead 2026-08-10 and 2026-09-01).**
  **(a) TESTRAIL IS NOT HELD; JIRA IS.** **CREATING TESTRAIL TEST CASES IS *NOT* HELD AND NEVER WAS —
  `add_case` and `update_case` are PERMITTED AND EXPECTED, on every project.** If you are about to report
  a requirement as uncoverable "while the hold stands", you have made the mistake two workers already
  made — **write the case.** For Jira, permission is **PER ASK**: an earlier batch approval never covers a
  later ticket, and a finding being real and obviously worth filing is not permission. **ACTIVE HOLD
  (2026-08-10): no Jira ticket of any type, and no new artefact in any other external system of record;
  TestRail cases are expressly carved out.** The hold is **TEMPORARY, lift condition = his next order — a
  session reading this later must CHECK whether it has been lifted, not assume it is standing law.**
  Register row **H1** in `build/OUTSTANDING-ITEMS-REGISTER.md`.
  **(b) A PASS NEVER ENDS IN A DEFECT — IT ENDS IN A RUNNABLE TEST (2026-09-01).** Where the build does
  not match the document: the documented expectation STAYS (57), the case gains the **three outcomes** in
  plain words so the tester runs it and marks it **Failed**, the marker stays `AUTOMATION: READY` (an
  `EXPECT FAIL` marker needs a live ticket and there is none), and the finding is reported **with its
  C-id** — no ticket text, no ask, no candidate file. This **supersedes Rules 51/52/53/62/73/94 and
  `build/skills/06-DEFECT-PREP.md` for the lane's own output**; skill 06's shape still governs *if he asks
  for a ticket*.
  **(c) IF HE EVER SAYS GO AHEAD, THAT IS PERMISSION TO LOOK AGAIN, NOT TO FILE (2026-09-01).** Three
  gates in order: **(1)** every candidate is HELD, on every suite · **(2)** his go-ahead means re-open the
  question, never file · **(3)** reproduce it on the build as it stands that day — if it no longer
  reproduces, CLOSE the candidate and say so; if it does, ASK for permission **per candidate**. The
  re-verification comes BEFORE the ask; it does not replace it.
  Verbatim quotes, the worked examples (C45068 · C45060 · C44996) and the full treatment:
  `build/rules/RULES-61-ONWARD.md` rule 62 (2026-09-01 amendment) and `build/skills/06-DEFECT-PREP.md` §A10-b.
  **🛑 (d) AND RECONCILE THE CASE AGAINST THE LIVE SOURCE FIRST — THREE WAYS (106; QA lead 2026-09-10,
  after a draft cited spec rules quoted from my own notes, never opened).** Before ANY defect is put to
  him: **the CASE's Expected** (read live from TestRail) · **the SOURCE as it reads TODAY** (fetched
  this pass, quoted VERBATIM with page id, requirement id and read date — our own case text, a
  `requirements.md` extract or a remembered version is NOT the source, Rule 100) · **the BUILD observed**
  (12, 104). **Case agrees, build differs ⇒ real defect, ask to file with the quote. CASE DISAGREES WITH
  SOURCE ⇒ THE CASE IS THE DEFECT — do NOT ask to file; ask permission to CORRECT the case's Expected,
  showing both wordings. Source silent/ambiguous ⇒ hold and ask (58).** Always the LATEST version; where
  the version integer cannot be read, say so rather than repeating one from our own text. Write the
  reconciliation to `build/<project>/source-verify-<date>/`, and **answer the nearest apparently
  contradicting rule in advance**. Worked example:
  `build/inline-add-edit-parts/source-verify-2026-09-10/DECLINED-QUOTES.md`.
- **SECRETS: `/tmp` ONLY, `chmod 600`, NEVER COMMITTED — THIS REPO IS PUBLIC (82).** Cookies, tokens,
  passwords, OTP codes live in `/tmp` and nowhere else; never in a log, an error paste, or a commit.
  **Before every commit run the REAL scanner: `python3 build/testing-tools/scan_secrets.py --staged`**
  — exit 1 means REFUSE to commit. **Never claim a scan that did not run.**
- **EXPECTED BEHAVIOUR COMES FROM THE DOCUMENTS, NEVER FROM THE BUILD, AND IS THE SOURCE'S VERBATIM
  QUOTE (57 · 114).** The sources are: the **spec/PRD**, the **epic's stories**, the **PO's verified
  answers**, the **design**, **Figma**, the **technical design**, **shared `.md` files**, and **any newer
  written statement** shared with us — and the list is **OPEN-ENDED**: a new document type counts without
  a rule amendment. **From the build we take EXACTLY TWO THINGS: the on-screen labels/navigation, and the
  pass/fail verdict.** **The Expected Result is written as the SOURCE'S EXACT WORDS (quoted, with page/
  section/version on the provenance line, 54) — never paraphrased, softened, sharpened, or edited to
  match the build (114).** If the build differs, the case KEEPS the documented expectation and becomes a
  deviation with the three outcomes (62-b). The **only** permitted edit to an Expected is correcting it
  **back to the source quote** when the case disagrees with the live source (106) — never away from it,
  never towards the build. Layman/build-label wording (7/9) governs **preconditions and steps**, not the
  Expected's substance. **A closed ticket is not a spec change. An ambiguous source is never resolved by
  looking at the build (58) — hold the case and ask.**
- **🛑 A LABEL IS READ FROM THE SMALLEST ELEMENT THAT OWNS IT, AND QUOTED AS DISPLAYED (2026-09-03).**
  **(a) WHICH ELEMENT.** `cells[i]` per column header, `value` for an input, `textContent` otherwise,
  icons stripped. Flattened text answers "does this appear", NEVER "this is the label".
  **(b) WHICH STRING.** Quote what the tester SEES: where CSS `text-transform` is set, `textContent` is
  NOT the label — RECONCILE the two before changing a character. Capitalisation alone is still no
  divergence. A WRITE-hold (71) is not an OBSERVATION-hold. Full text: `build/skills/03-RUN-CHECK.md`.
- **VERIFIED MEANS OBSERVED, NEVER INFERRED (12).** Only mark Verified / Pass / Fail / present /
  absent if it was observed live, with evidence captured that run. Anything not observed is labelled
  **NOT VERIFIED** or **Blocked-with-reason**. Never fill a gap with inference to look complete.
- **🛑 AN INJECTED OR REMEMBERED COPY OF A FILE IS NOT EVIDENCE ABOUT IT — MEASURE IT ON DISK (100).**
  Context, system prompt and memory go stale by commits, silently. Before reporting a file's size, its
  contents, whether a pointer resolves or whether a rule exists: `git fetch origin`, then `wc -c` ·
  `grep -n` · `git show origin/<branch>:<path>`. Never hand a worker a recollection as a premise.
- **WHICH STANDARD APPLIES — DECIDE PER CASE, NEVER PER PROJECT (109 + 57).** A V2 project runs **two
  suites under two standards at once.** *Does V2 do what the V2 documents require?* → **the V2
  documents (57)**. *Did V2 keep what V1 could do?* → **the V1 product code at a named commit (109)**.
  *A V2 feature V1 never had?* → **the V2 documents; Rule 109 is SILENT and must not be stretched —
  "V1 did not do it" is never a reason to skip testing a new feature.** *Is V2 right because V2's code
  does it?* → **never a valid standard, in any suite.** *A V1 behaviour that looks like a bug?* → **a PO
  decision item, never a silent invariant (96).** Full table in Rule 109.
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
- **🛑 FIND A ROUTE BY WALKING THE UI, NEVER BY GUESSING — AND RECORD IT (2026-09-02, amended 09-03).**
  Drill: `route_registry.mjs find` → `qa-branch-boot.mjs` → `find_ui_route.mjs` → `RECORD_AS=`.
  **Enumerate EVERY row** (`ENUMERATE_ROWS_FN`) — a one-row or one-state "nothing here" is void.
  **Walk stalls ⇒ grep the build's chunks.** API only to SEED (14) or READ a set. `03-RUN-CHECK.md`.
- **NEVER DECLARE A BLOCKER — OR RUN THE FIRST PROBE — WITHOUT SEARCHING THE REPO FIRST (97, amended
  2026-09-02).** **STEP 0 IS `git fetch origin`** — never search, measure or report a repository fact from
  a stale checkout — and if you are on a different branch, search the canonical one **without checking it
  out**: `git grep -n "<exact error text>" origin/claude/slack-session-0sxnd9 -- build/` (or
  `git show`). **"Not on this branch" is NEVER a reason to conclude something does not
  exist.** **Searching another session's copy is for FACTS only (a route, a login method, a known
  problem) — never take a rule from it** (amended 2026-10-06, QA lead). Before reporting anything as impossible, blocked, unavailable or unreconstructable — **and
  before the FIRST PROBE of any environment, not after the first failure** — **grep the workspace using
  the EXACT ERROR TEXT**, plus `grep -n "<the thing>" build/APP-ACTIONS-PLAYBOOK.md` and
  `ls build/testing-tools/`. **A committed harness is reused, never rebuilt.** Four places, in order:
  `build/APP-ACTIONS-PLAYBOOK.md` · `build/skills/14-ACCESS-RESILIENCE.md` ·
  `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` · `build/rules/RULES-*.md` (grep, never read whole). Also
  `ls build/BLOCKED-*.md` (several are RESOLVED, with the cause) and `git log --all --grep=`.
  **If you still cannot find it, REPORT THE SEARCHES YOU RAN** so the gap is known to be real rather than
  unsearched. One tool failing is a fact about that tool, never about the task (68). **Solve something
  new ⇒ write it into the playbook or the skill IN THE SAME PASS** (93). The QA lead's verbatim ruling on
  sequencing, the eight-probe incident and the five 2026-08-28 false blockers:
  `build/rules/RULES-61-ONWARD.md` rule 97.
  **🛑 AND PROVE THE INSTRUMENT WORKED BEFORE ANY NEGATIVE CLAIM (104; QA lead 2026-09-10 — five false
  blockers in one day, ALL my own selector/timing/route/method blamed on the product, two of them
  already unblocked by him earlier).** *Absent · nothing · broken · impossible · cannot* needs SEVEN
  proofs with evidence: **positive control · through the SCREEN not a script · ≥2 attempts on a settled
  page · navigation and new-tab checked · precondition read back (a 200 is not proof a write landed) ·
  repo searched (97) · "what would make this MY fault, and how did I rule it out?"** Enforced, not
  advisory: build probes on **`build/testing-tools/probe_guard.mjs`** (`assertNegative` THROWS without a
  positive control — fix the probe, never file the finding; `afterAction` forbids "nothing happened"
  unless navigation, new tab, panel, DOM change and server write are ALL empty), and **nothing negative
  reaches a `BLOCKED-*.md`, a candidate, an ask, or a Blocked/Failed-as-unavailable result until
  `python3 build/testing-tools/blocker_gate.py --check <claim>` exits 0.** An unclosable proof is
  reported as an OPEN GAP, never as a proved blocker. **First `ls build/BLOCKED-*.md` — several are
  RESOLVED or WITHDRAWN with the route that worked.** Learning L0036.
  **🛑 AND YOU ARE STANDING-AUTHORISED TO UNBLOCK YOURSELF — DO WHATEVER THE TEST ENVIRONMENT NEEDS
  (107; QA lead 2026-09-10: *"you are authorized to do anything to unblock yourself, give it what it
  takes"*).** On any QA branch or Staging, WITHOUT ASKING AGAIN: create/change/delete any test data ·
  **edit roles and permissions and assign them to staff** · switch workplace · use the screen or go
  behind it, whichever reaches the state · walk a neighbouring feature to build a precondition · write
  the tooling. Tag `ZZAUTOTEST`, restore what is not the point of the test (6). **SEVEN ROUTES, ALL
  TRIED AND NAMED IN THE REPORT BEFORE "BLOCKED" IS EVEN CONSIDERED:** search the repo (97) · read the
  refusal (it names the missing field or allowed method) · try the OTHER surface · SEED the state ·
  walk the neighbouring feature · change the role/permission/data in the way · prove the instrument
  (104). *"It failed the way I first tried"* is step 1 of 7, not a blocker. **107 NEVER overrides the
  standing holds: no Jira/external artefact (62) · no TestRail write without his go-ahead (6) ·
  Vladimir's cases never (38) · Automated cases held (71) · secrets never committed (82) · production
  is not a test environment.**
- **STRATEGY FIRST (79), AND NEVER GO IDLE WHILE WORK REMAINS (105; QA lead 2026-09-10 — *"Are you
  done? I do not see any running task"*, asked while a finished probe sat with no successor).** Devise
  or recall the smartest quota-efficient plan, then begin. **Queue EVERY remaining step into
  `build/testing-tools/run_queue.sh <queue> <tag>` rather than hand-launching one at a time** — it
  refreshes the bridge per step, spaces them for login trap 2, survives a crash, and `--status <tag>`
  answers "is anything running?" in one line. **THE LAST ACTION BEFORE ANY REPORT IS TO START THE NEXT
  WORK AND CONFIRM IT IS RUNNING**, and every status names the step in flight. The only legitimate
  stops: the queue is empty · a decision only he can make, already put to him (103) · a blocker that
  passed the gate (104). *"I finished a step and hadn't decided what's next"* is not one.
- **TELL THE LAST-DONE DATE AND ASK BEFORE RE-RUNNING (80).** Never silently repeat a verification,
  VIU or ordered task: say when it was last done and ask whether to run it again. A check within the
  last 3 builds / 3 source versions still COUNTS, with its date shown (77).
- **🛑 SOURCE VERIFICATION IS OFFERED AND GATED, NEVER AUTO-RUN — HE DECIDES, EVERY SESSION (81;
  re-confirmed 2026-09-03).** On a build-verify / VIU order: name the need · give the **last-done DATE +
  spec version** · **ASK** with-or-without · **WAIT**. Never pull sources on your own initiative, and
  never inherit an earlier session's answer. Once he says yes, "all the sources" = the Rule 57 list.
  Both 2026-09-03 rulings: `RULES-61-ONWARD.md` rule 81.
- **🛑 THERE IS NO DELTA — EVERY VERIFICATION IS FULL, ON EVERY CASE (101; QA lead 2026-09-09).** A source
  verify, build verify, VIU or re-verify covers the **ENTIRE suite, every case**, re-read/re-walked/
  re-observed on the CURRENT build — never only the changed stories, the shared labels, or a build-line
  re-stamp standing in for a re-walk. **"Unchanged, so carried over" is the forbidden delta.** Rules 77/80
  still decide WHETHER to run; when you run, it is full. Can't do it all ⇒ report the rest **NOT VERIFIED
  THIS BUILD** (12) — never let a partial pass be stamped or reported as verified. Full text + the two
  incidents: `RULES-61-ONWARD.md` rule 101.
- **🛑 BUILD-VERIFY MAKES ALL THREE PARTS RUNNABLE — PRECONDS · STEPS · EXPECTED (102; QA lead 2026-09-09).**
  Preconditions runnable (reach the state by UI clicks) · Steps of replication runnable (followable in the
  build's labels) · **Expected stays INTACT in substance (documents, Rule 57) but its WORDING is made clear,
  meaningful and consistent with the Build Glossary** (the `OBSERVED-UI-LABELS-<env>.md` terms the tester
  sees) — align the words to the screen, never the asserted outcome. Wording-to-glossary ≠ changing Expected
  to match build behaviour (that stays a three-outcomes conflict, 62-b). Full text: `RULES-61-ONWARD.md` rule 102.
- **🛑 "DONE" MEANS THE MANUAL TESTER CAN READ AND RUN EVERY CASE — FULLY UNDERSTANDABLE + FULLY RUNNABLE,
  NOT JUST STAMPED (115; QA lead 2026-10-05, after a manual tester reported Dashboard cases he could not
  understand or run).** The authoring session MAKES cases; THIS lane makes them (a) build-verified (102/54)
  AND (b) layman-understandable (7/9/110) AND (c) hand-runnable to a verdict (84/18) — all three, or it is
  not done. **FORBIDDEN in any `AUTOMATION: READY` case: (i) developer jargon in tester-facing text** (permission
  codes, endpoint/API/payload/request, authorization-failure/HTTP codes, server-side/p95/circuit-breaker/ms,
  requirement ids) — those live ONLY in the `Source —` provenance block (54/110); **(ii) a check not doable
  by hand marked READY** — keep only the manual part, else mark `AUTOMATION: HOLD - not manually testable
  (developer/automated check only)` and report it (98), never READY. Expected substance still the source's
  (57/114); clarity is wording + testability-marking, never softening the outcome. **(iii) PRECONDITIONS
  MUST LET THE TESTER REACH THE START STATE BY HAND (amendment 2026-10-05, 2nd tester complaint):** name the
  EXACT role + permissions (never "the permissions the step needs"), EVERY setting that gates the behaviour
  (a screen gated by an unnamed setting is unreachable), and the CONCRETE UI-buildable data (never a bare
  state assertion like "a WO with a Needs Approval line" with no setup) — match the shape the tester uses
  when he fixes a case himself, and VERIFY the settings on the build, never guess. **ENFORCED:**
  `python3 build/testing-tools/check_tester_runnable.py --cases <ids>` must exit 0 before any suite is
  reported build-verified. **A manual tester must NEVER again report a build-verified case as unclear/unrunnable.** **🛑 2026-10-08 (QA lead, permanent): the bar is 100% AUTHENTIC (every label/route/setting/data step SEEN on the build this pass, never assumed or taken from a draft) · RUNNABLE · BUILD-VERIFIED · BUILD GLOSSARY · UNDERSTANDABLE · ZERO tester complaints; a helper's draft is walked before it is written.** **🛑 LANE LIMIT (QA lead 2026-10-08, permanent): this lane ONLY confirms that each case's labels, routes, settings and setup exist on the build in the build's words and are followable — NEVER run the test or read its result, never run behaviour experiments, never build hard data states, never take side work, never give a helper a wider task; anything more ⇒ STOP AND ASK first, with the time it would take, and proceed ONLY on his YES — otherwise stay in the lane and report the item as not seen (2026-10-09).**
  Don't edit a case the tester is already editing (83/86). Full text: `RULES-61-ONWARD.md` rule 115.
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
- **🛑 EVERY REPORT IS FIVE TABLES, NAMES ITS C-IDS, AND ENDS WITH "OUTSTANDING — what I need from you"
  (98 · 99 · 36; QA lead 2026-09-01).** The five tables: **DONE · LEFT · BLOCKED · HOW TO UNBLOCK ·
  HANDOFF-READY.** **Prose is not a report.** **Table 2 must say how to finish each item concretely enough
  for a DIFFERENT session to execute it without asking · Table 3 must name what the blocker does NOT block
  (68) · Table 5's last row is a bare YES or NO and is NO unless every gate above it passed.** **Every row
  names its C-ids, never just a count**, and a completed-versus-left figure states **both numbers AND
  lists the ids of what is left.** **Every ask is SELF-CONTAINED AND EXECUTABLE (99):** each item he must
  decide carries five things in plain words — **what it is** · **how it came up** · **the question** ·
  **the options**, each saying what we would then DO · **the cost of silence** and what it does not block
  (68). If answering needs a file opened, it is not finished. Say *"nothing outstanding"* if that is true;
  never omit the section. Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current.
  **🛑 AND EVERYTHING HE READS IS IN HIS LANGUAGE — EVERY MESSAGE, NOT ONLY ASKS (103; QA lead
  2026-09-10, widened the same day after a STATUS line slipped through: *"keep things simple for me to
  understand, for everything you share with me all the time"*).** Lead with what a USER would see and
  why it matters, then the decision, the options each saying what we would DO, and the cost of silence.
  **BARRED from anything he reads: run numbers · case/test ids · ticket keys · suite numbers · API
  paths · status codes · HTTP verbs · selector/probe/tool names · payload/endpoint/DOM/JSON ·
  precondition · verdict · settled · "not observed" · "clause 3" — and BARE TALLIES: a count is always
  followed by what it MEANS for him (what is finished, what is left, what he must do).** C-ids and keys
  go after a `---REFERENCE---` line (8), never carrying the meaning. **RUN THE CHECK BEFORE SENDING:
  `python3 build/testing-tools/plain_check.py <draft>` — exit 1 names every phrase he would stop at.**
  If he must decode it, or open anything to understand it, it is NOT WRITTEN YET. Internal files stay
  technical; 103 governs what is put to HIM. Full text: `build/rules/RULES-61-ONWARD.md` rules 98, 99, 103.
- **🛑 A QUESTION SHEET IS ALWAYS A SPREADSHEET, NEVER A MARKDOWN TABLE (55 · 66 · 7/9; QA lead
  2026-09-01).** Deliver **`.xlsx`** (or a Google Sheet) in the established column shape —
  **`# · Topic · What happens now · The question · Options · Your answer`** — one sheet per feature, plus a
  final **QA internal** sheet carrying the case ids and requirement anchors that the PO is not meant to
  read. **The PO-facing sheets contain no case ids, no spec anchors, no API or HTTP terms, no field names**
  (7/9); every question offers **OPTIONS** so it can be answered by ticking one. Still governed by Rule 55
  (project and feature named on every row, answerable by a non-technical reader) and Rule 66 (the sheet is
  the LAST thing sent). Generator + the enforced layman check and his verbatim ruling:
  `build/testing-tools/make_question_sheet.py`, `build/skills/07-PO-QUESTIONS.md`.
- **🎨 A DESIGN REFERENCE IS A LINK *AND* A ROUTE (QA lead, 2026-09-01).** Provenance reads
  `Design: the Design Document (<link>) — open "<view>" → "<document>", then <the block>.
  (<toggle>.)` in the design's **own button labels, read out of the file**. Verify every anchor
  before writing it; read the design BEFORE escalating a question.
  Technique: `build/skills/02-SOURCE-CHECK.md`.
- **PLAIN LAYMAN WORDING (7/9).** Tester-facing and PO-facing text uses the build's exact labels and
  no jargon — no case IDs, spec anchors, HTTP terms or internal names in what they read.
- **🛑 EVERY CASE IS RUNNABLE FROM THE UI BY A LAYMAN, AND RUNNABILITY IS A DELIVERABLE OF BUILD
  VERIFICATION, NOT A TIDY-UP (skill 18; QA lead 2026-08-31 + 2026-09-01; UNIVERSAL — ALL cases, ALL
  suites, NOT only build-verified ones).**
  **(a) THE STANDARD.** A precondition that asserts a *state* ("a document exists whose work order has …
  set") or a step that *summarizes* an action ("Generate the Invoice") is DEFECTIVE. Preconditions carry
  the **route as UI clicks** — the five things: (1) entry point (top-menu/screen, exact label) · (2) which
  record to open and how you know it is the right one · (3) the tab/panel · (4) where the thing appears ·
  (5) any default-on filter that hides it. Steps describe the check; **Expected Results still come from
  the documents, never the build (57).** **NEVER make a step followable by inventing a path or a state a
  tester cannot actually reach.** A build-verification pass is **NOT done when the verdicts are in** — it
  is done when **every case in the suite**, verified this run or not, is followable; spec-level
  preconditions or steps mean NOT tester-ready (84).
  **(b) TWO GATES, ALWAYS BOTH — runnable-SHAPED is not build-VERIFIED, the labels are read off the
  screen.** `python3 build/testing-tools/check_runnable_cases.py --section-prefix "<suite>"` (shape; reads
  TestRail LIVE, exit 1 on any failure — drive it to zero before reporting a suite done) **and**
  `python3 build/testing-tools/check_precond_labels.py --sections <ids> --observed build/OBSERVED-UI-LABELS-<env>.md`
  (are the quoted labels real). A label enters the observed file **only from a probe with committed
  evidence** — never from an API field name, a spec, or a note in this repo.
  **(c) LIFECYCLE + COORDINATION.** PROVISIONAL at source-verification (no build yet, Rule 85: draft the
  route from the design/spec and mark it provisional, never fabricated) → **FINALISED at
  build-verification** (the build's own labels + `AUTOMATION: READY`). Before any runnability pass, verify
  live (86) whether a QA build now exists (a "QA env: none" line can be STALE) and whether a parallel
  session is already build-verifying that suite — if so it OWNS the routes: **DEFER**, never run a
  design-provisional pass over it (concurrent UI edits collide / can downgrade a build-verified route).
  Both QA-lead quotes, both label incidents, the `check_layman_steps.py` replacement and the hard line:
  `build/skills/18-LAYMAN-UI-STEPS.md`.
- **FOREIGN CASES AND TICKETS ARE HANDS-OFF (38).** Report, never edit. State both numbers: ours N / live
  total M. **ALWAYS NAME THE CREATOR when you call a case foreign** (look up the TestRail user, e.g.
  `get_user/<id>`) — the QA lead decides scope by who authored it. **A case authored by the project's
  designated MANUAL QA TESTER is NOT foreign — treat it as IN-SCOPE (as if created by the QA lead):
  source-verify it, keep it tester-ready, update it.** **THE TWO TESTERS ARE ASSIGNED PER SUITE — do not
  merge them:** **Invoice UI Refresh → Mudassir Qamar** (TestRail user **6**, `mudassir.qamar@shopview.com`)
  · **Inline Add and Edit Parts (6597) and Printer Friendly WO (6617) → Viktoria Videnovic** (TestRail
  user **4**); **spelling is "Viktoria"**, not "Victoria" — older notes have it wrong, and a handover names
  the tester who actually owns that suite. **🛑 VLADIMIR TOMOVIC'S CASES ARE NEVER CHANGED** — TestRail
  user **1**; **the test is `created_by == 1` checked before the write, never the title.** It does not
  matter that the case fails a gate, has no steps, or is the only thing between a suite and a clean score:
  report it, name the author, leave it. **No general go-ahead reaches his cases and we do not re-ask per
  case**, whatever else a session has been authorised to override. (Still respect Rule 71: never change a
  case flagged **Automated** without the QA lead — even a tester's.) Verbatim rulings and the naming
  history: `build/rules/RULES-21-40.md` rule 38.

---

