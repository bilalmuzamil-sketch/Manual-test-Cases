# 02 · SOURCE-CHECK — establish that we hold the CURRENT version of every source

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST.** This file adds only what is specific to
> checking sources.

---

## PURPOSE, IN PLAIN ENGLISH

**Before doing anything on a project, prove we are working from today's documents — not last week's.**

Specifications get republished. Product owners answer questions and change their minds. Stories get
added to an epic, or reopened. Designs get redrawn. **Each of those silently invalidates work we have
already done**, and none of them notifies us.

This skill fetches every source live, compares it against what we hold, works out **exactly what
changed**, and gives every changed requirement its own verdict — so the next piece of work starts from
the truth rather than from a copy of unknown age.

**It runs FIRST on every project task. Not only on authoring.** Writing a question sheet, a status
report, an audit, a push, a bug investigation — even **answering a question about a project's state**
— all start here. **A stale answer about a project is as damaging as a stale test case**, and we have
already told the QA lead a suite was current while its spec was eight versions ahead.

---

## TRIGGER PHRASES

> *"Check the sources for [project]"* · *"is our spec current?"* · *"what changed in the spec?"* ·
> *"the spec has been updated — reconcile it"* · *"pre-flight [project]"* ·
> *"diff v[N] to v[M] for [project]"* · **and implicitly at the start of every other skill.**

---

## KICKOFF PROMPT

```
Run SOURCE-CHECK for [PROJECT].

Baseline we hold: [requirements.md at spec v<N> | the last SOURCE-CURRENCY.md at <path>]
Scope: [all five source types | just the spec | just the epic]
If something moved: [report only | report and propose the per-requirement verdicts | fold it in]
Access: [Atlassian MCP available? Confluence cookies? Figma token?]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-07-31** | *"everytime you are making the test cases or looking at the test cases for any reason make a rule that you pull the latest version of Specs from the URL, I see that the specs have been updated on 28th. But I believe you are unaware of that and due to that you left a few tests uncovered."* | The rule's origin — a stale spec directly caused uncovered tests |
| **2026-07-31** | *"I want the test cases to be current with specs and epics and you must have the current version of epics and specs and every other doc you are using alwyas first make sure that you have the current source for the test cases before doing anything with the test cases."* | Widened from the spec to **every source** |
| **2026-07-31** | *"Going forward the first thing you do whenever you are about to do anything for your projects is to get the updated version of all the sources you have for that project and ONLY then do what you are asked to do."* | **Widened again — from test-case work to ANY project task.** This is the operative formulation |
| **2026-07-31** | *"since reading them from scratch is a long proess, ask me if you want me to get the updated epic version too. But if I ask you to do ye, then you need to check the epic open each ticket defect, bug, story and everything in that epic … including the ticket/stories/bug/task titles/description/attached or inline images/comments and everything"* | The **two-tier epic check** (step 3) |
| **2026-08-05** | (after he edited all six specs mid-pass) | Rule 59 — **re-read the sources again immediately before writing** (step 6) |
| **2026-08-10** | *"the test cases are correct as per the Specs/Stories/Answer sheets/New design/new .md files/new claude designs and anything which is provided to you and is latest"* | The source list is **open-ended** — a new document type does not need a rule amendment before it counts |

---

## THE FIVE SOURCE TYPES — check every one, every time

| # | Source | What "current" means | How it lies |
|---|---|---|---|
| **1** | **The specification** (PRD / Confluence) | the **live Confluence version number** + last-edited timestamp, vs our ingested baseline | **trap (a)** below |
| **2** | **The epic and its child stories** | the **story set**, **each story's status**, and description/comment changes | **trap (b)** below |
| **3** | **The designs** — a Claude design or prototype, **Figma**, **and the technical design he shares** | the file/nodes we hold vs what exists now | **an undated editable share link cannot be dated at all** |
| **4** | **The engineering tech plan** | do we hold the current version — and was one ever supplied? | it is simply never mentioned |
| **5** | **PO / stakeholder answers, messages, videos, shared `.md` files** | the newest authoritative one wins | **trap (c)** below — the deadliest |

**The list is OPEN-ENDED by his instruction.** A handover document, a design-review `.md`, a channel
post — if it is provided to us and it is the latest, **it counts**, and it does not need a rule
amendment first.

**The evidence that this is not theoretical:** two `.md` files shared on 2026-08-10 **each changed
real verdicts**, and one exposed **C38909** asserting working filter buttons across nineteen report
surfaces when **fourteen** had been **forbidden, deferred, orphaned or never scoped** by engineering.
A tester would have logged a long row of Blocked results waiting for a build that was never coming.

---

# 🔴 THE THREE STALENESS TRAPS

**Staleness markers lie. Verify the right one.**

### TRAP (a) — a Confluence page's IN-BODY "Version" field is not its version

A page's body can read **`Version: 1.0`** forever while the real Confluence page version advances.
**That is exactly how the Schedule spec drifted five versions unnoticed**, and how the Filters spec
sat eight versions behind while we believed we held v1.0.

**⇒ USE THE CONFLUENCE VERSION NUMBER**, from `GET /wiki/api/v2/pages/<id>` — never the version
printed inside the document.

**And note the mirror-image fact:** **six Report Suite pages genuinely have no in-body version field
at all.** Absence of the field is **the fact**, not a failed read (core §1.4).

### TRAP (b) — a Jira epic's "updated" timestamp moves for administrative edits

On 2026-07-31 **two epics looked changed when their content was identical** — the timestamp had moved
for a QA-Assignee change.

**⇒ USE THE JIRA CHANGELOG — what actually changed — not the surface updated-date.**

### TRAP (c) — 🔑 A PAGE BEING NEW SAYS NOTHING ABOUT WHETHER A GIVEN RULE INSIDE IT IS NEW

**This is the mirror image of trap (a), and it is the one that does real damage.** In (a) the printed
version lies while the page version is honest. **Here the page version is honest AND STILL TELLS YOU
NOTHING** about the age of the requirement you are reading.

**A spec page republished yesterday can carry a requirement untouched for five months.**

**Why it matters so much:** this is the **exact input to latest-wins**. Get the rule's date wrong and
**latest-wins is applied BACKWARDS** — an older requirement is used to overrule a newer decision,
while the case looks freshly reviewed and carries a confident explanation of itself.

**⇒ TO DATE A REQUIREMENT, DIFF THAT REQUIREMENT'S OWN TEXT ACROSS VERSIONS.** Confluence serves any
historical version, so this is **one extra call per version per requirement** — it settled the
incident below in about two minutes.

**THE SCAR.** Our 5 August pass flipped **FLT-TAB-02 = [C29609](https://shopview.testrail.io/index.php?/cases/view/29609)**
and **FLT-TAB-03 = [C29610](https://shopview.testrail.io/index.php?/cases/view/29610)** off Branko's
**17 July** ruling and onto the spec's wording, reasoning verbatim: *"The specification is the newer
authoritative source (Standing Rule 32), so the cases follow it"* — a comparison of the **page's**
publication date against the answer's date. The rule was then fetched from **ten spec versions
(4, 5, 6, 7, 9, 12, 14, 17, 18, 19)** and found **byte-identical in all ten, unchanged since
2026-05-14 — two and a half months BEFORE the answer.** The spec text was **older**, so latest-wins
pointed the other way.

**AND THAT IS ONLY HALF THE DEFECT.** The same pass **silently reversed the QA lead's own recorded
30 July ruling**, deleting the very `refs` entry that named it: *"behaviour per Branko Q4=B
2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled"*.

**⇒ THE CHECK THAT CATCHES IT: BEFORE OVERRIDING ANY CASE, READ WHAT THE CASE'S OWN `refs` CREDITS.
If a ruling is named there, it may not be dropped without citing it and saying why.**

---

## THE STEPS

### 1 · Establish the baseline you are comparing against

Read the project's `PROJECT-STATE.md` and the last committed `SOURCE-CURRENCY.md`. **Write down what
we believe we hold, before fetching anything** — otherwise the comparison is a memory test.

### 2 · Fetch the specification LIVE and compare by VERSION NUMBER

Confluence via the Atlassian MCP `getConfluencePage`, or the REST API with session cookies.

- **Compare the Confluence version number**, not the in-body one (trap (a)).
- **Then compare the BODY** — byte-compare our mirror against the live fetch, or **enumerate the exact
  differing lines**. **Never trust a version number alone** to mean the content is unchanged; that is
  trap (a) in the other direction.
- **A word-diff is the cheap form:** *"0 runs of 6+ words present live and missing from our mirror"*
  is a measurement. Resolve every apparent gap individually — on Schedule, **33 apparent word-diff
  gaps were each individually resolved as boundary artefacts of our mirror's annotations, with 0
  requirements changed.**

**If it cannot be fetched, STOP and ask for access.** Never proceed on a possibly-stale copy, and
never fabricate content to appear complete.

### 3 · The epic — TWO TIERS, and only the second needs asking

**TIER 1 — the cheap currency check. Part of every pre-flight. No need to ask.**

Fetch the epic and its child list, and compare against our ingest: **the STORY SET** (any new or
removed keys) · **each story's STATUS** · **the CHANGELOG** (trap (b)).

**Verify the child count TWO INDEPENDENT WAYS** — `parent = <epic>` and `"Epic Link" = <epic>` — with
**no paging remainder**, and check the key sets are equal. *(This is how SV-8685 was proven unchanged
and how SV-8582's six reopened stories were caught.)*

**⚠️ A NEW CHILD IS NOT ALWAYS A REQUIREMENT.** SV-8812 appeared under the Schedule epic and was a
**Task — "Set up a dedicated QA environment for testing"** — the ticket for the very thing blocking
our work, not something to test. **A status move (Open → In Progress across all 15 stories) changes no
case content.** Say which it is.

**⚠️ A CHILD CAN DISAPPEAR FOR AN ORDINARY REASON.** The Report Suite epic moved 105 → 104 children
because **SV-8821 was closed OBSOLETE and had its parent stripped** — somebody tidying closed tickets.
**Left exactly as found** (another author's triage is never reversed), and a sweep confirmed the
ticket was **named on no case**, so nothing downstream was affected. **Establish that before treating
it as a loss.**

**TIER 2 — the FULL re-read. Expensive. ASK FIRST.**

When the currency check shows **meaningful movement**, or the task genuinely needs the epic's full
content, **ask before starting it.** **Never launch one unannounced, and never skip one he
authorised.**

If authorised, **"exhaustive" means exactly this:** open **every child AND every related ticket** —
linked issues, sub-tasks, defects, bugs, stories, tasks, **including tickets outside the epic that
link to it** — and for **each** read the **title**, the **full description**, **every comment**, and
**every attachment INCLUDING inline images**. **Images must actually be DOWNLOADED AND LOOKED AT, not
listed by filename** — screenshots routinely carry the real requirement or the real defect. Also read
the changelog, the status/resolution history, and any linked PRs.

**Report the exact counts** (tickets read / comments read / images viewed) and **quote the testable
content verbatim** with its ticket key. **If any part cannot be read, say precisely what and why. A
PARTIAL epic read presented as complete is worse than none**, because it produces false confidence
about coverage.

### 4 · Designs, tech plan, PO answers

- **Designs.** Check the currency of **each artefact in play**, not only Figma: a **Claude design or
  prototype export**, a **Figma file**, and **the technical design**. **An open Figma fetch queue means
  the design source is NOT current** — say so, naming the shortfall, e.g. *"designs PARTIAL — 73/85
  frames, 12 pending, due-at …"*.
  **⚠️ AN UNDATED, EDITABLE SHARE LINK CANNOT BE DATED FOR RECENCY PURPOSES AT ALL**, so latest-wins
  **cannot be applied to it** — it is recorded **PARTIAL** and **escalated**, never treated as newest
  merely because it arrived most recently in a conversation. *(Live case: three Schedule tickets cite a
  `claude.ai/design/p/…?…&via=share` page with no version and no date, while ~48 of our Schedule
  labels are pinned from a different, ingested prototype.)*
  **✅ THE TECHNICAL DESIGN'S AUTHORITY IS ANSWERED AND CLOSED — DO NOT RE-ASK IT (QA lead,
  2026-08-12).** Verbatim: *"Technical design is the authority but if that contradicts with
  specs/tickets/answer sheet/claude design/figma (because they are also the authority with the rule
  that the latest entry for that question wins) I would suggest to consider the specs/tickets/answer
  sheet/claude design/figma … as the authority for the test cases but let me know where it contradicts
  with the tech design."*
  **SO: (1) on a CONTRADICTION the other five win**, latest-wins among them; **(2) where NOTHING
  contradicts it, the technical design SOURCES a case on its own** — properly sourced, and **not** a
  Rule-64 deletion candidate (**eleven held cases were released by this ruling**); **(3) 🛑 EVERY
  CONTRADICTION IS REPORTED TO HIM** — his closing clause is an instruction, and **applying the
  precedence order silently breaches half the ruling.** Log each one in the outstanding register.
  **⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED:** from 2026-08-06 until that ruling this block read
  *"AND AN OPEN QUESTION SITS HERE: does a TECHNICAL DESIGN carry PRD-level authority on what the
  product should do, or does 'informs but never overrules' still hold for it? … Do not answer it for
  him. Until he does, a case that would turn on the difference is HELD."* **That is no longer in
  force.** It is kept rather than deleted because **a silently-erased open question is how a session
  re-asks something a source has already answered** — an embarrassment this workspace has had before.
  Live list: `build/rulings-2026-08-12/TECH-DESIGN-CONTRADICTIONS.md`.
- **Tech plan.** If none was supplied, **remind him** — it is a standard input, not an optional extra.
- **PO answers / messages / videos / shared `.md` files.** The **newest authoritative one wins**, and
  **a later answer can reverse an earlier ruling our cases still assert.**

### 5 · Give every changed requirement its OWN verdict row (Rule 43)

**A narrative summary is not acceptable.** For **every added / changed / removed** requirement:

> requirement id · **the VERBATIM requirement text** · **exactly one verdict** from —
> **covered by case(s)** (internal ID + C-id + link, **both texts quoted side by side**) ·
> **case extended** (name the case and the field) · **new case authored** (or *proposed, awaiting
> authorisation*) · **not independently testable** (state why) · **blocked** (state the blocker and its
> owner — and read core §11.4 first).

**Reconcile the row count against the number of deltas the diff itself found, and state both totals.**

**RE-DERIVE, NEVER PATCH.** Rebuild the requirement→case map from the current spec body and the
current case source **every time**, and run it **in both directions** — requirement→case finds
uncovered requirements; case→requirement finds cases whose anchor no longer exists. **Patching last
version's matrix preserves last version's blind spots**, which is exactly how this rule was earned.

**THE SCAR:** `S14-R20` **was present** in our own v15 spec diff — listed explicitly — and **appears
nowhere** in the deltas document that acted on that diff. **The narrative summary let a
correctly-detected requirement slip between detection and action**, and it took a formal
re-derivation to surface it, along with the same gap on three more reports. **A per-requirement
verdict table makes that class of slip structurally impossible: an un-verdicted row is a visible
hole.**

### 6 · 🔑 RE-READ THE SOURCES AGAIN IMMEDIATELY BEFORE THE WRITES BEGIN (Rule 59)

**Step 2 runs at pass start. This is a SECOND, CHEAP check at write start** — re-fetch the governing
spec version(s) and re-read any blocking ticket **at the moment you rely on them**.

**If a source moved between pass start and write start: STOP, RE-DIFF, RE-DERIVE the affected edits
before writing.** A pass may not write conclusions drawn from a source that has since changed — **they
were right when reached and wrong when written**, which is the worst combination, because the log will
show them as carefully verified.

**MECHANICS, and they are checkable:** the execution log records **BOTH timestamps** — *"sources read
at pass start: `<UTC>`"* and *"sources re-read at write start: `<UTC>`"* — **and states the verdict of
the second read**. **A log with only ONE source-read timestamp is NON-COMPLIANT**, exactly as one
saying only *"200 OK"* is.

**THE TWO SCARS, both from one day:**
- **The PO edited ALL SIX Report Suite specs mid-pass.** SBC v13→14 at 13:07Z · PV v4→5 at 13:21Z —
  **one minute before that spec was fetched** — then SBR, TU, WIP and IV between 13:55Z and 14:23Z,
  all messaged *"Applied QA review workbook decisions"*. **Four of them flipped the exact anchors the
  pass had cited.** The sources had been read ~35 minutes earlier **and that was already too long.**
- **The PO answered and closed a blocking ticket hours after a readiness report relied on it.**
  SV-8825 was closed *"This is updated in the filters prd, I'm closing it"* **after** the report had
  been finished stating it was still Open with zero comments — freezing 8 phone cases on a question
  that was already settled.

**⚠️ AND THE HONEST FOOTNOTE IS PART OF THE LESSON:** our first write-up of that second incident said
the gap was *"28 minutes"*. **That was wrong — a `-0500` timestamp read as UTC; the real gap was five
and a half hours.** A misread timezone inside an evidence claim is **itself a defect**: it made a
near-miss look like an unavoidable coincidence. **Timestamps carry offsets; convert them, do not
eyeball them.**

### 7 · A DELETED requirement may mean a DELETED case — and Vlad must be told

**A requirement can vanish between versions, and that is a coverage event in the opposite direction.**

**Live example:** the Schedule specification **lost a requirement at v24** — the fade/highlight line in
§6 — deleted **81 seconds after [SV-8874](https://shopview.atlassian.net/browse/SV-8874) was closed
OBSOLETE**, following an engineering remark about a *"gap between PRD and design"*. **Meanwhile story
SV-8686 STILL REQUIRES that behaviour** in both its Requirements and its Acceptance Criteria.

**⇒ THE HANDLING, and note that none of it is "delete the case":**
1. **A spec deletion is not automatically a requirement deletion.** Check the **stories** (source (b)),
   the **designs** (d/e) and the **PO answers** (c) — here the story still requires it, so the
   documents now **disagree with each other**, which is a **finding to RAISE**, not a side to pick.
2. **Where the requirement genuinely is gone from every source**, its case becomes a **Rule-64
   candidate** — and skill `01` step 7's three-way test applies in full: (a) unsourceable · (b) a
   traceability gap · (c) open with the PO.
3. **🛑 CHECK `custom_atmstatus` BEFORE PROPOSING ANY DELETION.** An automated case may be depended on
   by a suite we cannot see. **Where it is automated: STOP and raise it — do not propose deletion.**
4. **TELL VLAD** (core §5.3) — **for an update as much as a deletion.** Per case: **C-id + link** ·
   **what changed, in one plain phrase** · **whether it affects what an automated check would assert.**
   The last column is **our judgement, offered so he can overrule it** — we have never seen his
   scripts, and **a rewording we call cosmetic can still break a check matching an exact string.**
   **Say "none" where none.**
5. **Nothing is deleted without the QA lead's explicit permission**, presented with the full candidate
   record.

### 8 · Emit the SOURCE-CURRENCY block

---

## THE DELIVERABLE

`build/<project>/<pass>-<date>/SOURCE-CURRENCY.md` — and **every deliverable this workspace produces
carries this block**, not just this skill's.

```
## SOURCE CURRENCY — read <UTC timestamp>

| Source | Identifier | Version / last updated | Date checked | Verdict |
|---|---|---|---|---|
| Specification | Confluence page 713031682 | v25, edited 2026-08-06T09:13:51Z | 2026-08-06 | STALE — we hold v23 |
| Epic + stories | SV-8685 | 26 children, verified 2 ways, key sets equal | 2026-08-06 | CURRENT |
| Designs        | build/schedule/design-2026-07-27/ | undated prototype; a newer undated share link exists | 2026-08-06 | PARTIAL — cannot be dated; escalated |
| Tech plan      | —      | never supplied                  | 2026-08-06 | MISSING — reminded |
| PO answers     | <file> | 2026-08-05                      | 2026-08-06 | CURRENT |

Sources read at pass start: <UTC>   ·   re-read at write start: <UTC>   ·   verdict of second read: <…>
```

- **CURRENT / STALE / PARTIAL — and a PARTIAL source names its EXACT shortfall.**
- **Nothing may claim completeness while any source is STALE.**
- **🔑 THE "DATE CHECKED" COLUMN IS THE READ-DATE THAT NOW GOES ONTO THE CASES THEMSELVES** — Standing
  Rule 54 as amended 2026-08-11 requires **every cited source in a case's provenance line to carry the
  date we read it** (core §14.1). So this table is not merely a pass artefact: **it is the input to
  the stamp.** Two consequences that bite if they are missed: **each source keeps its OWN date** (a
  spec and a PO answer move independently, so one shared date would misstate at least one), and **a
  source this pass did NOT actually re-read keeps its previous date** — **back-filling today's date
  onto a source nobody opened is a fabricated observation** (Rule 12) and **defeats the whole point,
  because the date's value is evidentiary.** His reason, verbatim: *"if someone changes the source of
  truth I can guard myself telling that the refrence taken from the source of truth was from the state
  of that source which was at this certain date."*
- If the spec moved: **`SPEC-DIFF-<date>.md`** with the per-requirement verdict table (step 5).
- Then **`OUTSTANDING — what I need from you`** (core §13).

**Canonical examples:** `build/filters/provenance-2026-08-04/SOURCE-CURRENCY.md` ·
`build/report-suite/spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md` ·
`build/schedule/spec-v25-2026-08-06/`.

---

## GUARDRAILS

- **G1 — Read-only by default.** This skill fetches and compares. It authors nothing, pushes nothing
  and files nothing.
- **G2 — Never proceed on a source you could not fetch.** Stop and ask.
- **G3 — Never fabricate content to appear complete** (core §1.1).
- **G4 — A proven-absence finding has a shelf life. Re-check it; do not cache it.** *The scar: "no
  Filters epic exists — all 170 SV epics enumerated" was TRUE on 2026-07-31 and went STALE WITHIN
  HOURS. The epic was created at 12:51 UTC, after the enumeration ran, and linked into the spec 16
  minutes later.*
- **G5 — Ask before a Tier-2 epic re-read** (step 3), and never present a partial one as complete.
- **G6 — Do not resolve a document-vs-document conflict silently** (core §11.2/§11.3). Raise it as a
  PO question and log it; meanwhile the case follows the most recent authoritative source **and
  discloses the divergence in its own text**.
- **G7 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). **What he instructed, quoted verbatim · what the rule
  requires, quoted, with its number · an explicit ask: which should we follow?** **Neither silent path
  is available** — not silently following the new instruction, not silently keeping the old rule. **A
  tightening or a layering is NOT a conflict**; escalating those trains him to wave escalations
  through. *He endorsed the practice by name: **"Good catch, be like this always."***
---

## HONESTY NOTES

- **"The spec is unchanged" is a claim about a comparison you actually ran.** Say which comparison —
  version number, word-diff, byte-compare — and what it returned.
- **State the read timestamp on every verdict.** A currency check is a claim about a moment.
- **If the second read (step 6) was skipped, say so.** Do not let a one-timestamp log imply two.
- **Distinguish "no field" from "failed to read".** Six Confluence pages have no in-body version field
  at all; that is a fact about the pages.

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Write the cases the diff shows are missing | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Check whether the steps can be executed on the build | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** |
| Judge whether a case is coherent or useful | **[`04-TESTER-READY`](04-TESTER-READY.md)** / `01` step 9 |
| Report the project's completion figures | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Turn a PRD-vs-design mismatch into a ticket | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** |
| Ask the PO which document wins | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** |

**And it never treats the BUILD as a source of expected behaviour** — the build is not on the list
(core §11.2).
