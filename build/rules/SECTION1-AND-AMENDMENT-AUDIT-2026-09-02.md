# §1 CONSOLIDATION PROPOSAL + RULE-AMENDMENT SWEEP — 2026-09-02

**ANALYSIS ONLY. `CLAUDE.md` WAS NOT EDITED. NO `build/rules/RULES-*.md` FILE WAS EDITED. NO SKILL OR
HANDOFF WAS EDITED. NO LIVE SYSTEM WAS CALLED.** The only files written by this pass are this report and
`build/testing-tools/check_rule_amendments.py`.

Measured on disk at `HEAD` = `9cb57fb0` on `claude/slack-session-0sxnd9` after `git fetch origin`
(local == `origin/claude/slack-session-0sxnd9`, 0 commits behind).

---

# PART A — §1 CONSOLIDATION

## HEADLINE

| | Bytes |
|---|---|
| §1 CRITICAL CORE now (`CLAUDE.md` L31–L272, 35 bullets + header + gate) | **22,523** |
| Cap approved by the QA lead today | **20,000** |
| Overage | **+2,523** |
| **Projected §1 after the 3 top-ranked merges (A1+A2+A3)** | **19,306 — UNDER CAP, 694 B headroom** |
| **Projected §1 after all 6 accepted proposals** | **18,146 — 1,854 B headroom** |

**THE 20,000-BYTE CAP IS REACHABLE WITHOUT LOSING ANY SUBSTANCE. Answer: yes, plainly.** Three merges do
it. Every imperative is retained; what leaves §1 is *evidence already proven present in its destination
file by grep before the merge text was written* (the gate's own no-loss condition).

**ONE CONSTRAINT CANNOT BE MET AND YOU NEED TO RULE ON IT (see A-GATE below): the gate's "≤ 400 bytes per
bullet" clause is incompatible with §1's promise that "every imperative here is stated in full" for the
four compound standards.** Every merged bullet below exceeds 400 B. I did not manufacture a pass by
deleting imperatives to hit 400.

## A-GATE — THE 400-BYTE CLAUSE VS "STATED IN FULL"

§1's own preamble says *"Every **imperative** here is stated in full."* The gate says a bullet is
*"≤ 400 bytes and states the IMPERATIVE ONLY."* For a **compound standard** — runnability, the
permission/defect regime, the search-before-you-give-up drill, the report shape — the imperatives alone
are 1.2–2.4 KB. Both clauses cannot hold. Three options; **I recommend (i)**:

| | Option | Effect on §1 | Cost |
|---|---|---|---|
| **(i)** | Read "≤ 400 B" as **per SUBJECT**, and allow a **labelled multi-part bullet** (the precedent you set today with the two TestRail formatting halves) for a compound standard | 18,146 B with all 6 proposals | none — this is what A1–A4 do |
| (ii) | Enforce 400 B literally | ~9,000 B | **imperatives leave §1**, which §1 exists to prevent |
| (iii) | Promote the four compound standards to numbered Rules 100–103 and let §1 carry a ~380 B pointer each | ~14,500 B | four new rules to write; **and Part B shows a rule body is exactly where amendments go to die** |

## RANKED PROPOSALS

Ranked by (bytes saved ÷ risk). Cumulative column assumes they are applied in this order; **each is
independent and can be approved or rejected on its own.**

| # | Proposal | Bullets merged | Current | Proposed | Saves | §1 after | Risk |
|---|---|---|---|---|---|---|---|
| **A1** | RUNNABILITY → one 3-part bullet | L211 + L219 + L232 | 3,916 | **2,432** | **−1,484** | 21,039 | **LOWEST** |
| **A2** | PERMISSION + DEFECTS → one 3-part bullet | L49 + L64 + L77 | 3,370 | **2,374** | **−996** | 20,043 | LOW |
| **A3** | SEARCH-BEFORE-YOU-GIVE-UP → one bullet | L135 + L158 | 2,420 | **1,683** | **−737** | **19,306 ✅** | LOW |
| **A4** | FOREIGN CASES → demote evidence | L249 (single bullet) | 2,142 | **1,497** | **−645** | 18,661 | LOW-MED |
| **A5** | REPORT SHAPE → one bullet | L74 + L179 + L187 + L192 | 1,672 | **1,224** | **−448** | 18,213 | LOW |
| **A6** | QUESTION SHEET → demote the quote | L194 (single bullet) | 971 | **904** | **−67** | 18,146 | LOWEST |
| ~~A7~~ | ~~TOKEN DISCIPLINE merge~~ | L124+L127+L132+L151 | 1,173 | 1,232 | **+59** | — | **REJECTED** |
| ~~A8~~ | ~~RE-RUN / SOURCE-GATING merge~~ | L153 + L156 | 420 | 424 | **+4** | — | **REJECTED** |

**A7 and A8 were drafted, measured and rejected: merging them costs bytes rather than saving them.** Those
six bullets are already single-subject, gate-shaped and small (143–522 B each); a merge only adds a shared
headline. Reported so you know they were examined, not skipped.

## MACHINE-FINDABLE LITERALS — BYTE-EXACT SURVIVAL

Verified by exact-string count against the current §1 and against every candidate text.

| Literal | In §1 now | In the proposals | Verdict |
|---|---|---|---|
| `AUTOMATION: READY` | 2 (L68, L244) | 2 — one in A1 part (c), one in A2 part (b) | **byte-exact, count preserved** |
| `ZZAUTOTEST` | 1 (L48) | — bullet L45 is **not touched by any proposal** | **untouched** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 0 (lives in §5 L570) | — | **§5 not touched** |
| `AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch` | 0 (lives in §5 L579) | — | **§5 not touched** |
| `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>` | **0 — absent from all of `CLAUDE.md`** | — | **not touched; see Part B finding B-61, this is a real gap** |

---

## A1 · RUNNABILITY — merge L211 + L219 + L232 (3,916 B → 2,432 B, saves 1,484 B) · RISK: LOWEST

Three bullets added on 2026-08-31 and 2026-09-01, all three about the same standard, all three pointing at
the same file (`build/skills/18-LAYMAN-UI-STEPS.md`). They restate each other three times: all three say a
case must be followable from the UI, two of them name `check_runnable_cases.py`, and two of them explain
the shape-vs-labels distinction.

**Evidence demoted (each one grep-verified present in `build/skills/18-LAYMAN-UI-STEPS.md` BEFORE the
merged text was drafted — the gate's no-loss condition):**

| Evidence demoted | Verified at |
|---|---|
| *"ONE of the major part of build verification is TO make the steps of replication and preconditions RUNNABLE…"* | skill 18 (also `11-BUILD-VERIFICATION.md`) |
| *"build verification is the final touch-up … to make the tests runnable"* | `18-LAYMAN-UI-STEPS.md:54` |
| *"confirm if the preconditions are also Build verified"* | skill 18 |
| `Work Order Line - Create and Edit` / `Work Orders → Work Order View Mode` / the 117 + 90 counts / the real labels | skill 18 (1 hit each) |
| `Fee & Discount` vs `Fee / Discount` and the 42 wrongly-flagged cases | skill 18 (2 hits) |
| `check_layman_steps.py` and why it was replaced | skill 18 (2 hits) |
| the hard line (*"making a step followable must never make an unreachable state reachable on paper"*) | `18-LAYMAN-UI-STEPS.md:141` |
| `RUNNABILITY LIFECYCLE`, `QA env: none`, "five things" | skill 18 (1 hit each) |

### EXACT PROPOSED TEXT (2,432 bytes)

```markdown
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
  design-provisional pass over it.
  Both QA-lead quotes, both label incidents, the `check_layman_steps.py` replacement and the hard line:
  `build/skills/18-LAYMAN-UI-STEPS.md`.
```

### EVERY IMPERATIVE SURVIVES — line by line

| From | Imperative | Lands in |
|---|---|---|
| L232 | universal scope: ALL cases, ALL suites, not only build-verified | headline |
| L232 | a state-asserting precondition / a summarizing step is DEFECTIVE | (a) sentence 1 |
| L232 | the five things, all five, verbatim | (a) sentence 2 |
| L232 | steps describe the check; Expected Results from the documents, never the build (57) | (a) sentence 3 |
| L232 | never invent a path or a state a tester cannot reach | (a) sentence 4 |
| L211 | a BV pass is not done when the verdicts are in; done when every case in the suite is followable | (a) sentence 5 |
| L232 | spec-level preconditions/steps = NOT tester-ready (84) | (a) sentence 5 |
| L219 | runnable-SHAPED is not build-VERIFIED; labels read off the screen | (b) headline |
| L211 | `check_runnable_cases.py --section-prefix "<suite>"`, reads TestRail LIVE, exit 1, drive to zero before reporting a suite done | (b), command byte-exact |
| L219 | TWO GATES, ALWAYS BOTH + `check_precond_labels.py --sections <ids> --observed build/OBSERVED-UI-LABELS-<env>.md` | (b), command byte-exact |
| L219 | a label enters the observed file only from a probe with committed evidence; never an API field name, a spec, or a repo note | (b) last sentence |
| L232 | lifecycle: provisional at source-verification → finalised at build-verification, build's own labels + `AUTOMATION: READY` | (c) sentence 1 |
| L232 | no build yet (85) ⇒ draft from design/spec, mark PROVISIONAL, never fabricated | (c) sentence 1 |
| L232 | coordination: verify live (86); "QA env: none" can be STALE; a parallel session OWNS the routes; DEFER | (c) sentence 2 |
| L211 | skill-18 pointer | closing line |

**Nothing is dropped. The only losses are the two label-incident narratives, the three verbatim quotes and
the `check_layman_steps.py` history — all grep-verified in skill 18 above.**

---

## A2 · PERMISSION + DEFECTS — merge L49 + L64 + L77 (3,370 B → 2,374 B, saves 996 B) · RISK: LOW

Three bullets that all answer one question: *may I create an external artefact, and what do I do instead?*
L49 is the Jira/TestRail hold, L64 says we do not create defects at all, L77 says what happens if the hold
ever lifts. Read separately they appear to conflict (L49 tells you how to ask; L64 tells you never to
ask). Merging them makes the ordering explicit.

**Evidence demoted (grep-verified):** all three verbatim quotes and the three worked examples
`C45068` / `C45060` / `C44996` are in `build/rules/RULES-61-99.md` rule 62 (1 hit each); the
re-verification treatment is at `build/skills/06-DEFECT-PREP.md` §A10-b (1 hit). The
*"SOrry new case creation is not held…"* quote is in rule 62's body.

### EXACT PROPOSED TEXT (2,374 bytes)

```markdown
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
  `build/rules/RULES-61-99.md` rule 62 (2026-09-01 amendment) and `build/skills/06-DEFECT-PREP.md` §A10-b.
```

### EVERY IMPERATIVE SURVIVES — line by line

| From | Imperative | Lands in |
|---|---|---|
| L49 | TestRail case creation is NOT held and never was; `add_case`/`update_case` permitted and expected, every project | (a) sentence 1 |
| L49 | if you are about to call a requirement uncoverable "while the hold stands" — write the case | (a) sentence 2 |
| L49 | Jira permission is PER ASK; an earlier batch approval never covers a later ticket; worth filing ≠ permission | (a) sentence 3 |
| L49 | ACTIVE HOLD: no Jira ticket of any type, no new artefact in any other external system of record, TestRail carved out | (a) sentence 4 |
| L49 | the hold is TEMPORARY; lift condition = his next order; a later session must CHECK, not assume | (a) sentence 5 |
| L49 | register row H1 | (a) sentence 6 |
| L64 | documented expectation STAYS (57) | (b) |
| L64 | the case gains the three outcomes in plain words; tester runs it and marks it Failed | (b) |
| L64 | the marker stays `AUTOMATION: READY`; EXPECT FAIL needs a live ticket and there is none | (b), literal byte-exact |
| L64 | the finding is reported with its C-id; no ticket text, no ask, no candidate file | (b) |
| L64 | supersedes Rules 51/52/53/62/73/94 and skill 06 for the lane's output; skill 06's shape governs if he asks | (b) |
| L77 | gate 1 — every candidate HELD, on every suite | (c) |
| L77 | gate 2 — his go-ahead is permission to LOOK AGAIN, never to file | (c) |
| L77 | gate 3 — reproduce on the build that day; if not, CLOSE and say so; if yes, ASK per candidate | (c) |
| L77 | the re-verification comes BEFORE the ask, it does not replace it | (c) |
| L64/L77 | pointers to rule 62 and skill 06 §A10-b | closing line |

**Dropped from §1 (all grep-verified in the destinations):** three verbatim quotes and the C-id worked
examples. **Note the phrase "Compounds with Rule 62's per-ask permission" is preserved as
"it does not replace it".**

---

## A3 · SEARCH BEFORE YOU GIVE UP — merge L135 + L158 (2,420 B → 1,683 B, saves 737 B) · RISK: LOW · **THIS IS THE ONE THAT LANDS UNDER THE CAP**

Both bullets are Rule 97. L158 is explicitly labelled *"(97, amended 2026-09-02)"* — it is a refinement of
L135, which is exactly the case the gate says **amends the existing bullet rather than adding a second**.
Keeping both duplicates the whole search drill.

**Evidence demoted (grep-verified in `build/rules/RULES-61-99.md` rule 97):** the QA-lead verbatim
*"What went wrong was sequencing…"*, the eight-probe incident, the five 2026-08-28 false blockers, and the
`APP-ACTIONS-PLAYBOOK.md` §A / `qa-branch-boot.mjs` specifics (also 8 + 2 hits in the playbook).

### EXACT PROPOSED TEXT (1,683 bytes)

```markdown
- **NEVER DECLARE A BLOCKER — OR RUN THE FIRST PROBE — WITHOUT SEARCHING THE REPO FIRST (97, amended
  2026-09-02).** **STEP 0 IS `git fetch origin`** — never search, measure or report a repository fact from
  a stale checkout — and if you are on a different branch, search the canonical one **without checking it
  out**: `git grep -n "<exact error text>" origin/claude/slack-session-0sxnd9 -- build/` ·
  `git show origin/claude/slack-session-0sxnd9:<path> | grep -n "<what you need>"`. **"Not on this branch"
  is NEVER a reason to conclude something does not exist.** Before reporting anything as impossible,
  blocked, unavailable or unreconstructable — **and before the FIRST PROBE of any environment, not after
  the first failure** — **grep the workspace using the EXACT ERROR TEXT**, plus
  `grep -n "<the thing>" build/APP-ACTIONS-PLAYBOOK.md` and `ls build/testing-tools/`. **A committed
  harness is reused, never rebuilt.** Four places, in order: `build/APP-ACTIONS-PLAYBOOK.md` ·
  `build/skills/14-ACCESS-RESILIENCE.md` · `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` ·
  `build/rules/RULES-*.md` (grep, never read whole). Also `ls build/BLOCKED-*.md` — **several are marked
  RESOLVED with the cause** — and `git log --all --grep=`. **If you still cannot find it, REPORT THE
  SEARCHES YOU RAN** so the gap is known to be real rather than unsearched. One tool failing is a fact
  about that tool, never about the task (68). **Solve something new ⇒ write it into the playbook or the
  skill IN THE SAME PASS** (93). The QA lead's verbatim ruling, the eight-probe incident and the five
  2026-08-28 false blockers: `build/rules/RULES-61-99.md` rule 97.
```

### EVERY IMPERATIVE SURVIVES — line by line

| From | Imperative | Lands in |
|---|---|---|
| L135 | STEP 0 is `git fetch origin`; never report a repo fact from a stale checkout | sentence 1 |
| L135 | search the canonical branch without checking it out — **both commands byte-exact** | sentence 1 |
| L135 | "not on this branch" is never a reason to conclude something does not exist | sentence 2 |
| L135 | grep the workspace using the EXACT ERROR TEXT before reporting impossible/blocked/unavailable/unreconstructable | sentence 3 |
| **L158** | **the amendment: search before the FIRST PROBE, not after the first failure** | sentence 3, merged into the same clause |
| **L158** | `grep -n "<the thing>" build/APP-ACTIONS-PLAYBOOK.md` and `ls build/testing-tools/` before probing an environment | sentence 3 |
| **L158** | a committed harness is reused, never rebuilt | sentence 4 |
| L135 | the four places, in order | sentence 5 |
| L135 | `ls build/BLOCKED-*.md`, several marked RESOLVED with the cause; `git log --all --grep=` | sentence 6 |
| L135 | if you still cannot find it, REPORT THE SEARCHES YOU RAN | sentence 7 |
| L135 | one tool failing is a fact about that tool, never about the task (68) | sentence 8 |
| L135 | solve something new ⇒ write it into the playbook or the skill in the SAME PASS (93) | sentence 9 |

**One parenthetical is deliberately dropped:** *"(The Standing Rules moved OUT of CLAUDE.md into
`build/rules/RULES-*.md` on 2026-08-21; a session saying 'the rules live inside CLAUDE.md' is stale.)"* —
this is stated twice already in `CLAUDE.md`'s own **READ THIS FIRST** block (L3–L30) and in §6, both of
which load before §1. **Approve this one explicitly if you want it gone; it is the only sentence in A1–A6
that is not covered by a grep-verified destination file.**

---

## A4 · FOREIGN CASES — demote the evidence in L249 (2,142 B → 1,497 B, saves 645 B) · RISK: LOW-MEDIUM

Not a merge — a single bullet, and **the largest in §1**. It carries three verbatim QA-lead quotes inline.
Every operative fact (who the testers are, the user ids, the spelling, `created_by == 1`) is KEPT; only
the quotes and the "confirmed 2026-08-31" provenance leave.

**⚠️ CONDITIONAL — this is the one proposal with a real prerequisite.** Two of the three quotes are
grep-verified in `build/rules/RULES-21-40.md` rule 38. **The third —
*"invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria."* — is NOT in rule 38's
body verbatim.** Rule 38's body does carry the same substance in a *different* verbatim quote
(RULES-21-40.md:792–805: *"If they are created by Mudassir, then treat them as the test cases which you
need to build verify too…"*, plus the per-suite assignment and the "Viktoria" spelling). **Under the
gate's own no-loss condition, A4 should be applied only after Part B item B-38 puts that quote in rule
38's body.** Do not apply A4 first.

### EXACT PROPOSED TEXT (1,497 bytes)

```markdown
- **FOREIGN CASES AND TICKETS ARE HANDS-OFF (38).** Report, never edit. State both numbers: ours N / live
  total M. **ALWAYS NAME THE CREATOR when you call a case foreign** (look up the TestRail user, e.g.
  `get_user/<id>`) — the QA lead decides scope by who authored it. **A case authored by the project's
  designated MANUAL QA TESTER is NOT foreign — treat it as IN-SCOPE (as if created by the QA lead):
  source-verify it, keep it tester-ready, update it.** **THE TWO TESTERS ARE ASSIGNED PER SUITE — do not
  merge them:** **Invoice UI Refresh → Mudassir Qamar** (TestRail user **6**) · **Inline Add and Edit Parts
  (6597) and Printer Friendly WO (6617) → Viktoria Videnovic** (TestRail user **4**); **spelling is
  "Viktoria"**, not "Victoria" — older notes have it wrong, and a handover names the tester who actually
  owns that suite. **🛑 VLADIMIR TOMOVIC'S CASES ARE NEVER CHANGED** — TestRail user **1**; **the test is
  `created_by == 1` checked before the write, never the title.** It does not matter that the case fails a
  gate, has no steps, or is the only thing between a suite and a clean score: report it, name the author,
  leave it. **No general go-ahead reaches his cases and we do not re-ask per case**, whatever else a
  session has been authorised to override. (Still respect Rule 71: never change a case flagged
  **Automated** without the QA lead — even a tester's.) Verbatim rulings and the naming history:
  `build/rules/RULES-21-40.md` rule 38.
```

### EVERY IMPERATIVE SURVIVES — line by line

| Imperative | Lands in |
|---|---|
| report, never edit; state both numbers ours N / live total M | sentence 1–2 |
| always name the creator; `get_user/<id>`; he decides scope by author | sentence 3 |
| the tester's cases are IN-SCOPE, not foreign: source-verify, keep tester-ready, update | sentence 4 |
| the two testers are assigned PER SUITE, do not merge them | sentence 5 |
| Mudassir Qamar = user 6 = Invoice UI Refresh | sentence 5 |
| Viktoria Videnovic = user 4 = 6597 + 6617 | sentence 5 |
| spelling is "Viktoria" not "Victoria"; older notes wrong; a handover names the owning tester | sentence 5 |
| Vladimir Tomovic's cases are NEVER changed; user 1 | sentence 6 |
| the test is `created_by == 1`, checked before the write, never the title | sentence 6 |
| a failing gate / no steps / a clean score is no exception: report, name, leave | sentence 7 |
| no general go-ahead reaches his cases; we do not re-ask per case | sentence 8 |
| Rule 71 still applies — even a tester's Automated case | sentence 9 |

**Dropped:** the two Vladimir verbatim quotes (in rule 38's body), the *"invoice refresh os…"* quote
(**pending B-38**), the email address `mudassir.qamar@shopview.com`, "confirmed 2026-08-31", and the
duplicated sentences *"Check `created_by` before any write, not the title"* / *"Report them, never edit
them"* — **both of which the current bullet says twice.** The email is in rule 38's body and in
`build/invoice-ui-refresh/PROJECT-STATE.md`.

---

## A5 · REPORT SHAPE — merge L74 + L179 + L187 + L192 (1,672 B → 1,224 B, saves 448 B) · RISK: LOW

Four bullets, all about the shape of a report: the five tables (98), the C-ids in every row (98
amendment), every ask self-contained (99), and the OUTSTANDING section (36). L74 is explicitly labelled
*"Rule 98 amendment"* — again the case the gate says amends the existing bullet.

**Evidence demoted (grep-verified):** the two verbatim quotes are in `build/rules/RULES-61-99.md`
(rules 98 and 36/99) and in `build/skills/05-PROJECT-REPORT.md`.

### EXACT PROPOSED TEXT (1,224 bytes)

```markdown
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
  never omit the section. Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current. Verbatim quotes and full
  text: `build/rules/RULES-61-99.md` rules 98 and 99.
```

### EVERY IMPERATIVE SURVIVES — line by line

| From | Imperative | Lands in |
|---|---|---|
| L179 | the five tables, named in order | sentence 1 |
| L179 | prose is not a report | sentence 2 |
| L179 | table 2 executable by a DIFFERENT session without asking | sentence 3 |
| L179 | table 3 names what the blocker does NOT block (68) | sentence 3 |
| L179 | table 5's last row is a bare YES/NO, NO unless every gate above passed | sentence 3 |
| **L74** | every row names its C-ids, never just a count | sentence 4 |
| **L74** | completed-vs-left states BOTH numbers AND lists the ids of what is left | sentence 4 |
| L187 | every ask self-contained: the five things, all five | sentence 5 |
| L187 | each option says what we would then DO | sentence 5 |
| L187 | the cost of silence + what it does not block (68) | sentence 5 |
| L187 | if answering needs a file opened, it is not finished | sentence 6 |
| L192 | say "nothing outstanding" if true; never omit the section | sentence 7 |
| L192 | keep `build/OUTSTANDING-ITEMS-REGISTER.md` current | sentence 8 |
| L179 | "Rule 36's OUTSTANDING section still closes the report" | headline + sentence 7 |

---

## A6 · QUESTION SHEET — demote the quote in L194 (971 B → 904 B, saves 67 B) · RISK: LOWEST

Small, but it is a pure gate-compliance fix: the only thing removed is the inline verbatim quote, which is
grep-verified in `build/skills/07-PO-QUESTIONS.md`. **Every imperative and the column shape stay verbatim.**

### EXACT PROPOSED TEXT (904 bytes)

```markdown
- **🛑 A QUESTION SHEET IS ALWAYS A SPREADSHEET, NEVER A MARKDOWN TABLE (55 · 66 · 7/9; QA lead
  2026-09-01).** Deliver **`.xlsx`** (or a Google Sheet) in the established column shape —
  **`# · Topic · What happens now · The question · Options · Your answer`** — one sheet per feature, plus a
  final **QA internal** sheet carrying the case ids and requirement anchors that the PO is not meant to
  read. **The PO-facing sheets contain no case ids, no spec anchors, no API or HTTP terms, no field names**
  (7/9); every question offers **OPTIONS** so it can be answered by ticking one. Still governed by Rule 55
  (project and feature named on every row, answerable by a non-technical reader) and Rule 66 (the sheet is
  the LAST thing sent). Generator + the enforced layman check and his verbatim ruling:
  `build/testing-tools/make_question_sheet.py`, `build/skills/07-PO-QUESTIONS.md`.
```

### EVERY IMPERATIVE SURVIVES

`.xlsx`/Google Sheet mandatory · never a markdown table · the six-column shape **byte-exact** · one sheet
per feature · the final QA-internal sheet with ids/anchors the PO must not read · no case ids / spec
anchors / API-HTTP terms / field names in PO-facing sheets (7/9) · every question offers OPTIONS · Rule 55
still governs (project + feature per row, non-technical reader) · Rule 66 still governs (sent LAST) ·
generator path. **Only the verbatim quote leaves.**

---

## A-EXTRA · BULLETS WHOSE EVIDENCE IS STILL INLINE BUT WHICH I DID NOT PROPOSE TOUCHING

Flagged for completeness under the admission gate; **each is already ≤ 400 B or close to it, so the
saving does not justify the risk.** Listed so nothing is unexamined.

| Bullet | Bytes | Inline evidence | Destination if you want it moved | Saves |
|---|---|---|---|---|
| L91 EXPECTED BEHAVIOUR FROM THE DOCUMENTS (57) | 745 | the open-ended source list (8 document types) | rule 57 body | ~250 |
| L127 TOKEN-DISCIPLINE CHARTER (95) | 522 | the twelve clause names | `TOKEN-DISCIPLINE-CHARTER.md` | ~200 — **but "never poll", "batch writes", "never re-do work", "answer in text" appear in §1 ONLY here.** Not recommended. |
| L107 V2 INVARIANT SET (96) | 466 | none — already imperative-only | — | 0 |
| L45 NO TESTRAIL WRITE (6) | 374 | none | — | 0 (**holds `ZZAUTOTEST`; do not touch**) |
| L36–L43 the gate blockquote itself | 1,072 (of the 22,523) | its own rationale and the no-loss clause | `build/rules/INTEGRITY.md`, where it is already recorded | ~600, **but it is the thing that stops §1 re-inflating.** Not recommended. |

---
---

# PART B — RULE-AMENDMENT SWEEP (99 rules, report-only)

## HEADLINE

**8 rules out of 99 are HIGH severity: a session that reads only the rule body reaches a WRONG answer.
11 rules are flagged in total.** The Rule-38 failure is not a one-off — **the same shape has happened at
least eight more times, and one of them has already produced a measured incident** (a gate coded from
Rule 61's three-marker list flagged 4 correct cases; recorded at `build/skills/00-COMMON-CORE.md:2378`).

## METHOD AND HONEST LIMITS

Scripted, not read — `build/testing-tools/check_rule_amendments.py` (committed with this report).
**No rule body was read into context whole; the script read them and I read its summary**, then ran
targeted `grep`s on the shortlist only.

| Step | Result |
|---|---|
| Rule set established | `RULES-01-20.md`, `RULES-21-40.md`, `RULES-41-60.md`, **`RULES-61-99.md`** |
| Numbering confirmed by grep before analysing | **99 rule bodies, complete 1..99, no gaps, no duplicates, none out of range** |
| Sources compared against each body | 35 §1 bullets · 99 §2 index rows · §2 trailing narrative · 28 skill/handoff files |
| Atoms checked per rule | verbatim quotes, `2026-0*` dates, named people, amendment keywords (`amend`/`corrected`/`superseded`/`clarified`/`carve-out`/`exception`/`re-confirmed`/`never was`) |
| **Rules checked** | **99** |
| **Script-flagged (≥1 atom in a citing source but not in the body)** | **23** |
| **Confirmed real by targeted grep** | **11** |
| **HIGH severity** | **8** |
| Adjudicated as script noise | 12 — skill-local phrasing, a filename date (`CLAUDE-FULL-ARCHIVE-2026-08-21.md` read as a date for rule 88), and dates belonging to a neighbouring rule in the same sentence |

**Limit, stated plainly:** the detector is text-similarity, so it finds *missing verbatim atoms*, not
missing *meaning*. A rule whose amendment was reworded rather than quoted can pass. The 11 confirmed rows
below were each verified by hand; the 12 discarded rows were each verified by hand as noise. **A rule not
listed below is not proven clean — it is proven to have no missing quote, date or name.**

## THE TABLE

| Rule | Where the amendment lives | Body carries it? | What is missing from the rule body | Severity |
|---|---|---|---|---|
| **51** *(never file an API ticket without asking)* | `CLAUDE.md` §1 L64 + `RULES-61-99.md` rule 62 (2026-09-01) | **NO** | The 2026-09-01 ruling *"You are never supposed to create defect, you are supposed to make the tests RUNNABLE"* explicitly **supersedes rule 51**. Rule 51's body still teaches "ask before filing an API ticket" as the live procedure. | **HIGH** — a session reading rule 51 asks permission to file, when the answer is that we do not file at all. |
| **52** *(a defect is a `Story Defect` parented to the owning story)* | same | **NO** | Same supersession. Rule 52's body (27,544 B) is the full ticket-shape recipe with no note that the lane no longer produces tickets. | **HIGH** — the single most likely wrong action in the repo: a session reads rule 52 and builds a ticket. |
| **53** *(priority Medium, never High)* | same | **NO** | Same supersession. | **HIGH** |
| **73** *(when the Jira hold lifts, resume one ticket at a time)* | same | **NO** | Same supersession, **and** the 2026-09-01 three-gate re-verification (`06-DEFECT-PREP.md` §A10-b): his go-ahead is permission to LOOK AGAIN, not to file. Rule 73's body describes the lift as "resume filing". | **HIGH** — rule 73 is *specifically* the rule a session opens when the hold lifts, and it gives the wrong answer. |
| **94** *(the defect admissibility gate; the lane's output is approved candidates)* | same | **NO** | Same supersession. Rule 94's body still says the lane's output is "approved candidates, not filed tickets"; since 2026-09-01 the output is a runnable test and a C-id. | **HIGH** |
| **61** *(the automation marker)* | `RULES-61-99.md` rule **69** body; `CLAUDE.md` §5 L579; `00-COMMON-CORE.md` §5.0-b | **NO** | Rule 61's body enumerates **three** markers (`AUTOMATION: READY`, `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`, `AUTOMATION: HOLD - …`). **Rule 69's body sanctions a fourth, `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`, and rule 61 does not mention it.** The 2026-08-31 customer-portal staging-only HOLD is also absent from rule 61's body. | **HIGH — and already proven.** `build/skills/00-COMMON-CORE.md:2378` records the incident: *"4 Invoice cases carry an invalid automation marker — **the gate**: it was coded with three literals when **Rule 69 sanctions a fourth**"*. **Identical shape to Rule 38 / the 30 Mudassir cases.** `CLAUDE.md` §5 L569-570 also enumerates only three. |
| **84** *(the tester-readiness gate)* | `CLAUDE.md` §1 L211/L219/L232 + `18-LAYMAN-UI-STEPS.md`; and `CLAUDE.md` §5 + `APP-ACTIONS-PLAYBOOK.md` §J | **NO** (two separate misses) | **(i)** The 2026-08-31/2026-09-01 runnability standard is absent: no `check_runnable_cases.py`, no `check_precond_labels.py`, no skill-18 pointer, no "spec-level preconditions = not tester-ready". Rule 84's body has only *"preconditions reachable and steps executable in order (Rule 28 dimension 2)"*. **(ii)** Rule 84's body still positively instructs **`<br>`** (*"line breaks that genuinely render as separate lines (`<br>`, never a bare `\n`)"*) — but `CLAUDE.md` §5 now says `<br>` is **origin-dependent and must NEVER be emitted in an API payload**. `build/TESTER-READINESS-CHECKLIST.md`, which rule 84 makes the authority, teaches `<br>` twice. **The `<br>`/`fr-view` correction appears in NO rule body.** | **HIGH ×2** — (i) a session passes a suite with spec-level preconditions; (ii) a session emits `<br>` via the API and the tester reads a literal `<br>`. |
| **55** *(a PO questionnaire names the project and feature on every row)* | `CLAUDE.md` §1 L194 + `07-PO-QUESTIONS.md` | **NO** | The 2026-09-01 ruling *"the questions should always be in Excel or google soreadsheet…"* — the sheet must be `.xlsx`/Google Sheet, **never a markdown table** — and the six-column shape. Rule 55's body names `.xlsx` files only as examples of past deliverables; it does not require a spreadsheet. | **HIGH** — a session reading rule 55 delivers a markdown table, which he has now rejected. |
| **66** *(the question sheet is the LAST thing sent)* | `CLAUDE.md` §1 L194 | **NO** | Same spreadsheet-form ruling; rule 66's body mentions neither Excel, spreadsheet nor `.xlsx`. | **LOW** — rule 66 is about *timing* and its own answer stays correct; the form is rule 55's job. |
| **71** *(protect Automated cases)* | `CLAUDE.md` §1 L249 (*"even a tester's"*) + rule 38's body | **NO** | Rule 71's body never mentions the manual-QA-tester carve-out, so the interaction *"a tester's case is in scope, but not if it is Automated"* is nowhere in it. No occurrence of "Mudassir" or "tester". | **LOW** — rule 71's own answer ("never change an Automated case without his go-ahead") is correct and safe as written; the miss makes it less complete, not wrong. |
| **38** *(foreign cases are hands-off)* | `CLAUDE.md` §1 L249; **fixed in the body today** | **PARTIAL** | The amendment substance **is** now in the body (`RULES-21-40.md:792–805`: the Mudassir carve-out, the per-suite assignment, user ids 6 and 4, the "Viktoria" spelling, Vladimir user 1 as the exception). **Missing: the specific verbatim quote _"invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria."_**, which exists nowhere outside `CLAUDE.md` §1. A different verbatim quote covering the same ground is in the body. | **LOW** — but **this is the blocker for Part A proposal A4.** Put that quote in rule 38's body and A4 becomes unconditional. |

## B-EXTRA · A SECOND FAILURE MODE THE SWEEP FOUND: RULINGS WITH NO RULE AT ALL

Six §1 bullets name **no numbered rule anywhere in their text.** They cannot diverge from a rule body
because they have none — so a session told *"read the rule in its file, amendments included"* has nothing
to open, and a pass that walks the 99 rules never sees them.

| §1 bullet | Bytes | Where the substance lives | Numbered rule? |
|---|---|---|---|
| L112 🛑 COUNT FROM THE SYSTEM OF RECORD, NEVER A LOCAL SNAPSHOT (2026-09-02) | 398 | `00-COMMON-CORE.md` (headline present) | **none** |
| L120 🛑 THE MISTAKE-PREVENTION MECHANISM IS TWO FILES, NOT A CHECKLIST (2026-09-02) | 390 | `00-COMMON-CORE.md:2303-2305` | **none** |
| L168 🛑 QUICK-LOGIN IS THE ROUTE, AND ONE COOKIE ONLY (2026-09-02) | 399 | `APP-ACTIONS-PLAYBOOK.md` §A | **none** |
| L204 🎨 A DESIGN REFERENCE IS A LINK *AND* A ROUTE (2026-09-01) | 399 | `02-SOURCE-CHECK.md` | **none** |
| L211 🛑 RUNNABILITY IS A DELIVERABLE OF BUILD VERIFICATION | 856 | `18-LAYMAN-UI-STEPS.md` | **none** (cites 84 only via L232) |
| L219 🛑 RUNNABLE-SHAPED IS NOT BUILD-VERIFIED | 1,225 | `18-LAYMAN-UI-STEPS.md` | **none** |

**And the sharpest one: L116 "🛑 A RULE'S AMENDMENT IS PART OF THE RULE" — the meta-rule that this entire
sweep enforces — is itself not a numbered rule.** It cites rule 38 only as its worked miss. If §1 is ever
trimmed by a session that has not read this report, the instruction to read amendments disappears with it.

## B-EXTRA-2 · ONE THING FOUND IN PASSING

`build/rules/INTEGRITY.md`'s rule counts were reported stale on 2026-09-02 in
`build/rules/CLAUDE-MD-SIZE-DIAGNOSIS-2026-09-02.md` §5 (*"rules 1..97"* twice, and
*"`RULES-61-99.md` — rules 61-97 (37 rules)"*). **Still unfixed at this HEAD.** Its no-loss assertion
would therefore pass while ignoring rules 98 and 99. Reported, not changed — outside this pass's scope,
and already on the register from the earlier pass.

---

# OUTSTANDING — what I need from you

**1 · Approve the §1 merges, one by one.** Each is independent; approving only the first three lands §1
under the cap.

| Approve? | Proposal | Saves | §1 after | What it is | Options | Cost of silence |
|---|---|---|---|---|---|---|
| ☐ | **A1 RUNNABILITY** | 1,484 B | 21,039 | Three bullets about the same standard become one bullet with parts (a)/(b)/(c) | **Approve** ⇒ I apply the exact text above · **Reject** ⇒ §1 stays 2,523 B over cap | §1 stays over the cap you set today |
| ☐ | **A2 PERMISSION + DEFECTS** | 996 B | 20,043 | The Jira hold, "we don't create defects", and the re-verification gates become one bullet | **Approve** / **Reject** | the three bullets keep reading as if they contradict each other |
| ☐ | **A3 SEARCH BEFORE YOU GIVE UP** | 737 B | **19,306 ✅** | The 2026-09-02 amendment folds into the Rule 97 bullet it amends | **Approve** / **Reject** · also tell me whether to drop the "Standing Rules moved out of CLAUDE.md" parenthetical (stated twice already above §1) | the cap is not reached |
| ☐ | **A4 FOREIGN CASES** | 645 B | 18,661 | Three inline verbatim quotes move to rule 38's body; every name, user id and `created_by == 1` test stays | **Approve conditionally** (apply after B-38) · **Approve now** · **Reject** | headroom stays thin |
| ☐ | **A5 REPORT SHAPE** | 448 B | 18,213 | The five tables, the C-id rule, the self-contained ask and the OUTSTANDING section become one bullet | **Approve** / **Reject** | four bullets keep restating the same report shape |
| ☐ | **A6 QUESTION SHEET** | 67 B | 18,146 | Only the verbatim quote leaves | **Approve** / **Reject** | a gate-non-compliant bullet stays |

Does not block anything else (68): all six are text-only edits to `CLAUDE.md` §1 and touch no case, no
run and no live system.

**2 · Rule on the gate's 400-byte clause (A-GATE above).** **What it is:** the gate says ≤ 400 B per
bullet, §1 says every imperative is stated in full; for the four compound standards both cannot be true.
**How it came up:** every merged bullet I can write without deleting an imperative is 0.9–2.4 KB.
**The question:** which clause gives? **Options:** **(i) read "≤ 400 B" as per SUBJECT and allow labelled
multi-part bullets** ⇒ I apply A1–A6 as written and §1 lands at 18,146 B · **(ii) enforce 400 B literally**
⇒ imperatives must leave §1, which is what §1 exists to prevent; I would come back with a demotion list
rather than apply it silently · **(iii) promote the four compound standards to numbered Rules 100–103**
⇒ §1 drops to ~14,500 B, but Part B shows a rule body is exactly where amendments go unread.
**Cost of silence:** I cannot apply any merge without knowing which clause governs, so §1 stays at
22,523 B. **Recommended: (i).**

**3 · Approve the eight HIGH-severity rule-body backfills (Part B).** **What it is:** eight rule bodies
that give a session the wrong answer. **How it came up:** hunting the Rule-38 failure across all 99 rules.
**The question:** may a session write the amendment into each rule's own body? **Options:**
**(a) all eight in one pass** (recommended — they are five instances of one supersession plus three
independent misses) · **(b) the defect five first** (51/52/53/73/94 — highest chance of a wrong action
today) · **(c) rule 61 first** (it has already caused a measured incident) · **(d) none, report only.**
**Cost of silence:** rule 52 remains a complete, confident, superseded recipe for filing a ticket you have
told us never to file. Does not block anything else (68): nothing here touches TestRail, Jira or a build.

**4 · Rule 84's `<br>` instruction is the one I would fix first even under option (d).** **What it is:**
Rule 84's body and `build/TESTER-READINESS-CHECKLIST.md` both instruct `<br>`; `CLAUDE.md` §5 and
playbook §J say never to emit it in an API payload because the tester then reads a literal `<br>`.
**The question:** may that one correction go into rule 84's body and the checklist? **Options:**
**yes** ⇒ two edits, no case touched · **no** ⇒ tell me and I will leave it. **Cost of silence:** the next
session that follows rule 84 to the letter produces unreadable cases; this trap has already produced 76.

**5 · Decide whether Part B's six rule-less §1 rulings should become numbered rules** (B-EXTRA), most of
all **L116 "A RULE'S AMENDMENT IS PART OF THE RULE"** — the instruction this whole audit rests on, which
today exists only as a §1 bullet. **Options:** **promote all six to Rules 100–105** · **promote only L116**
· **leave them as §1-only rulings and accept that a rule-walk never sees them.** **Cost of silence:** a
future §1 trim can delete a ruling that has no rule body to fall back on.

**6 · `build/rules/INTEGRITY.md` still says "rules 1..97".** Reported on 2026-09-02 by the size-diagnosis
pass and still unfixed. **The question:** do you want this pass's owner to fix it, or does it stay with
whoever owns `INTEGRITY.md`? Does not block anything (68).
