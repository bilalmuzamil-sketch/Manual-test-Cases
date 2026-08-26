# SKILL 17 — REGRESSION IMPACT, V1 → V2

> **THE PROBLEM THIS SKILL EXISTS TO SOLVE.** We author cases for **V2 of an existing feature**, but a
> V2 spec only describes **what CHANGES**. It is **SILENT about everything else**. Nothing in our
> process converted that silence into tests, so **a V2 build could silently break a V1 behaviour and
> every case would still pass.**
>
> **THE QA LEAD, 2026-08-21, VERBATIM:**
> *"I have no way to know what should not be changed in V1 due to V2 specially when V2 is not asking
> to change it."*
>
> **AND ON THE CODE-VS-DOCUMENT CONFLICT, VERBATIM:**
> *"Good Question you should always ask this question. But in this case I will raise a question in the
> meeting or if we create ticket with the reference that current behavior is this and V2 is changing it
> in that case the PO can decide which behavior to keep."*
>
> **THE ONE-LINE ANSWER: WHAT THE V2 SPEC DOES NOT MENTION IS STILL A REQUIREMENT.** Silence defaults
> to *"must not change"* — and where the silence is **dangerous** (high collateral risk) it is
> **escalated as a PO question**, never assumed either way. Standing Rule **96**.

**🔴 TOKEN DISCIPLINE CHARTER (Rule 95) — MANDATORY, FROM YOUR FIRST TURN:**
**[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md)**. Twelve clauses — strategy first (79),
never bulk-read / script it (88), the reading rule, spawn discipline (76/88), never poll (75), batch
writes, piggyback cheap checks (78), never re-do work (77/80), answer in text, the budget (90), the
week-start guard, and **clause 12: quality is never the thing cut**. **This skill points at the
charter; it does not restate it.** Rule text: `build/rules/RULES-61-96.md`.

**Companion files:** authoring itself is `01-CASE-BUILD.md` · source currency is `02-SOURCE-CHECK.md` ·
intake and the project-type question are `15-NEW-PROJECT-INTAKE.md` · defect admissibility is
`06-DEFECT-PREP.md` + Rule 94 · PO question sheets are `07-PO-QUESTIONS.md` · **the source-cited V1
baseline method (Step 1 / §3.3) is [`V1-BASELINE-FROM-SOURCE.md`](V1-BASELINE-FROM-SOURCE.md)** — use it
when you have read access to the product source and want the invariant register this skill subtracts the
V2 delta from.

---

## 1 · WHEN IT RUNS

| Situation | Does skill 17 run? |
|---|---|
| The assigned project is a **V2 / upgrade / re-work / re-design of an existing feature** | **YES — mandatory.** This is project type **(ii)** in `15-NEW-PROJECT-INTAKE.md` §1a |
| The assigned project is a **greenfield / brand-new feature** with no shipped predecessor | **NO.** There is no V1 behaviour to protect |
| The assigned project is a **REVIVAL** of an existing workspace project (same version, work resuming) | **NO** — that is a **reconciliation** of our cases against the current sources (`15` §7), not a V1→V2 impact analysis. If the revival turns out to be a **new version** of the feature, it becomes type (ii) and skill 17 runs |
| A single V2 **story** lands on a feature we already cover | **YES, scoped to that story.** The same four steps, a smaller matrix |

**IT RUNS BEFORE OR ALONGSIDE V2 CASE AUTHORING — NOT AFTER.** Authoring the V2 delta cases first and
bolting regression on at the end produces a matrix written to fit the cases already written. The
invariant set is an **input** to authoring, not a review of it.

**IT NEEDS NO BUILD AND NO APP COOKIES.** This is **document + case + code analysis**. A blocked
staging login, an HTTP 502 QA branch or an absent build does **not** block it (Rule 68 — a blocker
blocks only what it actually blocks; Rule 85 — no build is reported, not treated as a stop). What it
does need is stated in §8.

---

## 2 · THE FOUR STEPS

| # | Step | Produces |
|---|---|---|
| **1** | **BUILD THE V1 BEHAVIOUR BASELINE** — enumerate what V1 does today, from the sources in §3, each behaviour in plain words with its evidence | The baseline list (matrix column 1–3) |
| **2** | **MAP THE V2 DELTA AGAINST IT** — for every baseline behaviour, what does V2 say? **CHANGED / REMOVED / REPLACED / SILENT**, with the V2 source quote wherever V2 speaks | Matrix column 4 |
| **3** | **DERIVE THE INVARIANT SET** — **Invariants = V1 baseline − (changed ∪ removed ∪ replaced)**. Everything left is something that **must still work after V2**, i.e. a regression case | The invariant list → the regression case set |
| **4** | **ESCALATE THE DANGEROUS SILENCES** — a SILENT behaviour with **HIGH collateral risk**, and every **code-vs-document conflict**, becomes a **PO decision item**, not a silently-written case | The PO decision register (§5) + PO question rows |

**Step 1 detail.** One row per behaviour, at the granularity a tester could assert. *"Search works"* is
not a behaviour; *"a search with no matches shows the empty-state message and keeps the filter bar
visible"* is. Split anything that asserts two things into two rows (Rule 43's per-requirement
discipline, applied to behaviours).

**Step 2 detail.** *"V2 is SILENT"* is a **finding you record**, not an absence you skip past. The
whole point of the skill is that the silent rows exist on paper. Where V2 **does** speak, quote it
verbatim with its version and anchor (Rule 25) — a paraphrase is not a citation.

**Step 3 detail.** The subtraction is only as good as the baseline. See the honest limit in §7: a
behaviour nobody documented, nobody tested and no code path makes visible **will not appear** in the
baseline and therefore cannot become an invariant. Say so; do not imply exhaustiveness you do not have.

**Step 4 detail.** *"Dangerous"* = **HIGH collateral risk** per §4: V2 touches the same screen,
component, API, data model, permission check or shared pipeline. A silence over something V2 never goes
near is low risk and takes the default (*must not change*) without an escalation.

---

## 3 · SOURCES OF V1 BEHAVIOUR, AND THEIR STANDING

**This section is the heart of the skill. Two different questions are being answered by two different
kinds of source, and confusing them is how a bug becomes a protected invariant.**

| Question | Answered by | Standing |
|---|---|---|
| **What SHOULD V1 do?** (intent) | **DOCUMENTS** | **AUTHORITATIVE for expectation** (Rule 57) |
| **What DOES the system do today?** (fact) | **PRODUCT SOURCE CODE**, and production observation | **Evidence of current behaviour only — NEVER a source of expectation** |

### 3.1 DOCUMENTS ESTABLISH INTENT — what V1 SHOULD do

- The **V1 spec / PRD**, with its **version number** recorded (the Confluence version integer, never the
  in-body "Version" field — Rule 31 trap (a)).
- The **V1 epic's stories and their acceptance criteria**.
- The **PO's verified answers** (file + link + date).
- The **designs** — Claude design, Figma, and the technical design.
- Any **newer written statement** shared with us. The list is **open-ended** (Rule 57).

**These are authoritative for what the expectation IS.** A regression case's Expected Results states
what the document requires, in the document's terms, with the Rule-54 provenance line naming it.

### 3.2 OUR OWN REPO IS A FIRST-CLASS V1 SOURCE

**Do not go looking outside before looking inside.** The workspace already holds a large, curated,
traceable record of V1 behaviour:

- the **existing V1 TestRail cases and their bodies** (and the Rule-87 snapshots of them),
- `build/<project>/requirements.md`,
- **spec exports** and ingested copies under `build/<project>/`,
- **PO answer files**,
- **design-review documents**,
- **`build/<project>/PROJECT-STATE.md`** — read this first; it is the canonical live document for the
  project (and its coverage matrix tells you what was actually covered).

**A V1 case DERIVED FROM V1 DOCUMENTS carries a provenance line (Rule 54). Those count as DOCUMENTED
INVARIANTS** — the document work has already been done and traced, and the case is the evidence.

> **⚠️ A CASE WHOSE PROVENANCE IS MISSING OR VAGUE IS A *CANDIDATE* INVARIANT ONLY, and must be
> confirmed before it is protected (Rule 64 — every case must have a source, but CHECK before
> concluding it has none).** Confirm it against the V1 document; if no document supports it, it goes to
> the PO decision register (§5), not into the regression set.

> **⚠️ OUR V1 CASES ARE WHAT WE *TESTED*, NOT EVERYTHING V1 *DOES*.** Coverage gaps are **invisible
> invariants**: a V1 behaviour we never wrote a case for leaves no trace in the suite, so subtracting
> the V2 delta from our case list silently under-counts. **The case baseline is NECESSARY BUT NOT
> SUFFICIENT** — this is exactly why §3.3 exists, and why §7's honest limit is stated in the
> deliverable.

**Bulk discipline (Rule 88 / charter clause 2):** do **not** read hundreds of case bodies into context
to build the baseline. **Script the extraction** to a file, then read a bounded summary.

### 3.3 PRODUCT SOURCE CODE ESTABLISHES FACT — what the system CURRENTLY DOES

The **ShopView application repository's current release/develop branch** — the composables, components,
handlers, services and API endpoints implementing the feature, **plus the existing E2E tests**.

**Why it is the best available enumerator of current behaviour:** it contains **every branch, every
permission gate, every guard clause and every edge case**, including the ones nobody documented and
nobody wrote a case for. It reaches **far beyond our test coverage**, and for a **REGRESSION baseline —
a factual question about what exists today — that is exactly what is needed. Using it here is
legitimate.**

> **🔴 BUT CODE IS NEVER A SOURCE OF EXPECTATION (Rule 57).** The danger is precise and worth stating
> plainly: **if the code contains a bug, code-derived "current behaviour" would become an invariant we
> actively protect** — i.e. we would write a regression case asserting that **the bug must survive
> V2**. That is the failure mode this section is built to prevent.

Record code evidence as **file + function/component** (e.g. `useGlobalSearch.ts → buildQuery()`), never
as a vague *"the code does X"*. E2E tests are read the same way: they are evidence of current asserted
behaviour, not of intent.

### 3.4 THE CROSS-CHECK RULE — apply it to EVERY code-derived behaviour

| Finding | What it is | What you do |
|---|---|---|
| **Code AGREES with the documents** | **STRONG INVARIANT** — intent and fact coincide | **Write the regression case.** Cite the document in the provenance line; the code is corroboration, not the source |
| **Code CONTRADICTS the documents** | **A FINDING — never a silent invariant** | **Raise it as a PO DECISION ITEM (§5).** The affected case is **HELD** until the decision |
| **Code does something the documents never mention** | **CANDIDATE invariant** | Confirm with the PO (§5) before protecting it. Undocumented ≠ unintended, but undocumented ≠ required either |

**ALWAYS ASK THIS QUESTION ON EVERY CODE-DERIVED BEHAVIOUR.** That is the QA lead's directive, verbatim
at the top of this file: *"Good Question you should always ask this question."* And his ruling on what
happens next is equally explicit: **he raises it in the meeting, or we file a ticket stating that the
current behaviour is X and V2 changes it to Y — and the PO decides which behaviour to keep.** We do
**not** decide it, and we do **not** resolve it by looking at the build (Rule 58).

### 3.5 CODE / THE DEVELOPER ALSO ANSWERS THE OTHER HALF — COLLATERAL RISK

The second question code answers is **not about behaviour at all — it is about blast radius:**

- **Which components, composables, APIs, data models, permission checks and shared pipelines does V2
  touch?**
- **What ELSE depends on each of those?**

That is a **factual dependency question**, and it is what tells you **WHICH SILENCES ARE DANGEROUS**.
A V1 behaviour that shares a filter pipeline with something V2 rewrites is at risk even though the V2
spec never mentions it; a V1 behaviour on an unrelated screen is not.

**The developer is a legitimate and cheap source for this** — asking *"what else uses this
composable / this endpoint / this permission check?"* is a factual question, not a request for
expectation. Record the answer with who said it and when.

### 3.6 PRODUCTION OBSERVATION

Observing production may surface **undocumented behaviours users rely on**. Treat these as **CANDIDATE
invariants needing PO confirmation** — **never as expectations in themselves.** Same standing as an
undocumented code path (§3.4 row 3): worth surfacing, never self-authorising. Production access follows
`build/APP-ACTIONS-PLAYBOOK.md` §K.

---

## 4 · THE REGRESSION IMPACT MATRIX — the deliverable

**File:** `build/<project>/regression-impact-<date>/REGRESSION-IMPACT-MATRIX.md`

**One row per V1 behaviour.** Seven columns, all of them filled — an empty cell is not a row, it is an
unfinished row. Where something is unknown the cell says **NOT AVAILABLE** or **NOT VERIFIED** and the
gap goes to OUTSTANDING (Rule 12 — never inferred to look complete).

| Column | What goes in it |
|---|---|
| **1 · V1 BEHAVIOUR** | Plain words, tester-readable, one assertion per row (Rules 7/9) |
| **2 · WHERE V1 GUARANTEES IT** | The document + **version** + anchor, **and/or** the `C#####` with its full link (Rule 8). Both where both exist |
| **3 · WHAT THE CODE DOES TODAY** | File + function/component evidence, or **NOT AVAILABLE** (§8) |
| **4 · V2 SAYS** | **CHANGED / REMOVED / REPLACED / SILENT** — with the **verbatim V2 source quote** wherever V2 speaks (Rule 25), and its version + anchor |
| **5 · COLLATERAL RISK** | **HIGH / MED / LOW** — does it share a **screen · component · API · data model · permission check · filter pipeline** with something V2 changes? Name what is shared; a bare rating is not evidence |
| **6 · DECISION** | **regression case** · **superseded — retire/rewrite the V1 case** · **PO question** · **PO decision item** |
| **7 · WHERE IT WENT** | The new regression case id/title, the retire-list entry, or the register row it became |

### The markdown template — copy this

```markdown
# REGRESSION IMPACT MATRIX — <Project> V1 → V2
Date: <YYYY-MM-DD> · V1 spec: <name> v<N> (<link>) · V2 spec: <name> v<N> (<link>)
V1 project slug: build/<v1-slug>/ · V1 case set: <N> cases (ours), group <id>
Code baseline: <repo> @ <branch/commit>  |  or: NOT AVAILABLE — see OUTSTANDING

| # | V1 behaviour (plain words) | Where V1 guarantees it (doc v<N> + anchor / C-id + link) | What the code does today (file → function) | V2 says (CHANGED/REMOVED/REPLACED/SILENT + verbatim quote) | Collateral risk (H/M/L + what is shared) | Decision | Where it went |
|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |

## TALLY
Baseline behaviours: <N>  ·  CHANGED <n> · REMOVED <n> · REPLACED <n> · SILENT <n>
INVARIANTS (baseline − changed ∪ removed ∪ replaced): <N>
Regression cases written: <n> · Retired/rewritten V1 cases: <n>
PO decision items: <n> · PO questions: <n>
Arithmetic check: changed + removed + replaced + silent = baseline  → <PASS/FAIL>

## HONEST LIMIT
<the §7 statement, in full>

## OUTSTANDING — what I need from you
| What is missing | Who owes it | What it blocks, concretely | Since |
```

**The arithmetic check is a real gate**, read back from the finished table (the same discipline as the
Rule-61 automation-marker arithmetic). If it does not balance, the matrix is wrong, not the sum.

---

## 5 · THE PO DECISION REGISTER

**File:** `build/<project>/regression-impact-<date>/PO-DECISION-REGISTER.md`

**One row for every code-vs-document conflict AND every HIGH-risk silence.** The row must let the PO
decide **without digging** — everything they need is in front of them (Rule 55: plain words, project
and feature named on every row).

| Field | Content |
|---|---|
| **What the system DOES today** | Plain words + the code/production evidence (file → function, or what was observed and when) |
| **What the V1 DOCUMENT SAYS** | **Verbatim quote** + document **version** + link (Rule 25) |
| **What V2 says** | The verbatim V2 quote — **or the explicit statement that V2 is SILENT on this** |
| **The options** | The genuine alternatives, plainly worded (e.g. *keep today's behaviour · make it match the V1 document · change it as part of V2*) |
| **Our recommendation** | Ours, with the reason — a recommendation, never a decision |
| **DECISION + DATE** | Filled in **only when the PO gives it**, with who gave it and where it was recorded |

> **🔴 THE AFFECTED CASE IS HELD UNTIL THE DECISION (Rule 58).** It is **never resolved by looking at
> the build**, and it is **never decided by us**. A held case is reported as held, with the register
> row it is waiting on.

**Once the decision is given:** the case is written **to the decision**, and it carries the **Rule-56
divergence sentence** after its provenance line — naming the decision, its source and its date, and
saying plainly that we take the later decision as prevailing over the earlier source. The register row
is closed with the decision and date, and the case links back to it.

**Route the same rows into the PO question sheet** via `07-PO-QUESTIONS.md` — one sheet, plain words,
sent LAST (Rule 66), naming project and feature on every row.

---

## 6 · RETIRE THE SUPERSEDED V1 CASES

**Where V2 deliberately CHANGES or REMOVES a V1 behaviour, the V1 cases asserting the old behaviour
must be REWRITTEN or RETIRED — not preserved.** A regression suite that protects behaviour V2 was
commissioned to remove is not caution; it is a defect factory.

**WORKED EXAMPLE — the one to reason from.**
*Global search must no longer include page search, because page search has been separated out into its
own feature.* The V1 behaviour *"page search results appear in the global search results"* is therefore
**NOT an invariant**. It is **REPLACED**. A regression case asserting it would, on the V2 build,
**generate a defect against intended behaviour** — and that defect would be **refused as obsolete**,
exactly as Rule 94's admissibility gate requires (a ticket must be against a real, current, intended-
behaviour deviation; *"irrelevant / obsolete"* is precisely the refusal that gate exists to prevent).

**The procedure:**

1. For every matrix row marked **CHANGED / REMOVED / REPLACED**, list **every V1 case that asserts the
   old behaviour** — by `C#####` + link (Rule 8).
2. Decide per case: **REWRITE** to the V2 expectation, or **RETIRE**.
3. Write the list to `build/<project>/regression-impact-<date>/RETIRE-OR-REWRITE-LIST.md` with the
   reason and the V2 quote that supersedes it.
4. **NOTHING IS CHANGED OR DELETED IN TESTRAIL WITHOUT EXPLICIT PERMISSION (Rule 6)** — this list is a
   **proposal**. A case TestRail flags **Automated** is read-assessed and **HELD** for the QA lead
   (Rules 71/65). A **foreign** case (not ours) is **reported, never edited** (Rule 38).
5. Touching a case means **re-verifying the whole case** (Rule 41) — there are no surgical edits.

---

## 7 · OUTPUTS + DEFINITION OF DONE

**The pass is DONE when all six exist, in `build/<project>/regression-impact-<date>/`:**

| # | Output | Done means |
|---|---|---|
| 1 | **`REGRESSION-IMPACT-MATRIX.md`** | Every baseline behaviour has a row, all seven columns filled, the tally balances |
| 2 | **The new REGRESSION CASE SET** | Each case **marked as a regression case**, each **tracing to its V1 source** in the Rule-54 provenance line, each carrying its `AUTOMATION:` marker (Rule 61). Authored per `01-CASE-BUILD.md`; **not pushed without permission** (Rule 6) |
| 3 | **`RETIRE-OR-REWRITE-LIST.md`** | Every superseded V1 case listed with C-id, link, reason and the V2 quote — as a proposal |
| 4 | **`PO-DECISION-REGISTER.md`** | Every conflict and every HIGH-risk silence, six fields each, held cases named |
| 5 | **The PO QUESTION SHEET rows** | Plain words, project + feature on every row, routed through `07-PO-QUESTIONS.md` |
| 6 | **An OUTSTANDING section** | Rule 36 — in every deliverable and every report, four fields per item; *"nothing outstanding"* if that is true, but **never omitted** |

### THE HONEST LIMIT — state it plainly, in the deliverable

> **Undocumented, untested, code-invisible behaviours cannot be fully enumerated.** No baseline built
> from documents, cases and code is provably complete: the documents describe intent rather than
> behaviour, our cases cover what we chose to test, and code analysis surfaces what the code makes
> visible. **This process does not claim to have found every V1 behaviour.**
>
> **WHAT PROTECTS US IS THE WRITTEN, PO-REVIEWED INVARIANT LIST PLUS THE DATED QUESTIONS WE ASKED.**
> The invariants are on paper, they were reviewed by the person entitled to decide them, and every
> silence we judged dangerous was asked about in writing on a stated date. That is a defensible
> position; *"we assumed the rest was fine"* is not.

**Never let this limit become an excuse for a thinner pass (charter clause 12 / Rule 50).** It is a
disclosure, not a discount.

---

## 8 · ACCESS NOTE — the ShopView application repository

**Read access to the ShopView application repository materially improves BOTH halves of this skill:**
the **behaviour baseline** (§3.3 — every branch, gate and edge case, far beyond our test coverage) and
the **collateral-risk map** (§3.5 — what V2 touches and what else depends on it).

**IF IT IS NOT AVAILABLE TO THIS SESSION:**

1. **Say so plainly in the deliverable** — in the header block and in the OUTSTANDING section.
2. **Mark column 3 of every matrix row `NOT AVAILABLE`** — not blank, not guessed, not inferred from
   the product's visible behaviour (Rule 12: never inferred to look complete).
3. **Raise it as an OUTSTANDING item** in `build/OUTSTANDING-ITEMS-REGISTER.md` with the four Rule-36
   fields (what is missing · who owes it · **what it blocks, concretely** · since when), and ask the QA
   lead for it in plain words.
4. **Do not guess.** A collateral-risk rating with no dependency evidence behind it is a made-up number
   wearing a letter. Rate what you can evidence, mark the rest **NOT VERIFIED**, and ask.
5. **The pass still runs.** Without code, the baseline rests on documents + our cases (§3.1/§3.2), the
   honest limit in §7 is correspondingly larger, and the deliverable says so.

**Access ladders, fallbacks and MCP hygiene: `14-ACCESS-RESILIENCE.md` (Rule 89). Never edit shared MCP
config to fix a connection.**

---

### 8.1 THE PRODUCT REPOSITORY IS READ-ONLY TO US, ALWAYS

**The ShopView application source repository is READ-ONLY for every QA session.** We read it to
establish what the system **CURRENTLY DOES** (fact, §3.3) and to build the **collateral-risk map**
(§3.5). **That is the ONLY permitted use.**

- **NEVER commit, push, branch, open a pull request, comment on a PR or issue, or modify ANYTHING in
  the product repository** — not a fix, not a typo, not a test, not a comment. **Our writes go ONLY to
  the QA workspace repo, path-scoped, on our own branch (Rule 29).**
- **The installed GitHub App's permissions may PERMIT writing. Permission is not authorisation.** If a
  task appears to require changing product code, **STOP and report it to the QA lead** — that work
  belongs to the developers, never to QA.
- **Reading product code NEVER makes it a source of EXPECTED behaviour (Rule 57).** Code establishes
  **fact**; documents establish **intent**; a conflict between them is a **PO decision item (§5)**,
  never a silently adopted invariant.
- **Cite the file paths and the branch/commit you read** whenever you use code as evidence, so any
  claim about current behaviour is verifiable. **Never paraphrase code you have not actually opened,
  and never cite a path you have not confirmed exists.**

---

## 9 · GOVERNING RULES

**Standing Rule 96** is this skill's rule. Read it in full in `build/rules/RULES-61-96.md` before
applying it — the index line is not the rule.

**It ties to:** **1** (never start on a half-set) · **12** (verified means observed, never inferred) ·
**20** (every case traceable to ticket + spec) · **25** (verbatim citation on every deviation call) ·
**32** (latest information wins) · **40** (a requirement spanning surfaces is traced across every
surface) · **43** (per-requirement verdicts, not a narrative) · **45** (the outside-in gap hunt) ·
**56** (the divergence sentence) · **57** (expectation comes from documents, never the build — and
never the code) · **58** (an ambiguous source is never resolved by looking at the build — hold and
ask) · **64** (every case must have a source; check before concluding it has none) · **66** (the PO
sheet goes last) · **94** (the defect admissibility gate — why an obsolete regression case is a
liability).

---

## OUTSTANDING — what I need from you

Every report produced by this skill ends with this section (Rule 36). Say *"nothing outstanding"* if
that is true; **never omit it.** Keep `build/OUTSTANDING-ITEMS-REGISTER.md` current.
