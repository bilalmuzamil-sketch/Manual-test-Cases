# 01 · CASE-BUILD — author or extend a test suite from the sources

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST.** It carries the honesty bar, the TestRail
> write discipline and hazards, run sync, foreign cases, access, environment, session survival, git,
> secrets, authority and the reader-facing standards. This file adds **only** what is specific to
> authoring.

---

## PURPOSE, IN PLAIN ENGLISH

**Turn the documents into test cases, and prove nothing was missed.**

A project arrives with a specification, an epic full of stories, designs, a technical plan and a
stack of the product owner's answers. This skill reads **all** of them, works out **every requirement
they contain**, checks which requirements already have a case and which do not, writes the cases that
are missing, and then **deliberately tries to find what it itself overlooked** before handing
anything over.

**The thing it exists to prevent is not a badly-written case. It is a MISSING one** — because a
missing case is invisible. Nobody reviewing the suite can see a hole; they can only see what is
there, and it all looks fine.

---

## TRIGGER PHRASES

> *"Author the cases for [project]"* · *"write the test cases for [feature/story]"* ·
> *"we have a new spec for [project] — build the cases"* · *"cover [requirement/story] with cases"* ·
> *"the coverage matrix for [project] is out of date"* · *"re-derive coverage for [project]"* ·
> *"did we miss any cases?"*

---

## KICKOFF PROMPT (copy, fill the brackets)

```
Run CASE-BUILD for [PROJECT].

Scope: [the whole suite | epic <KEY> | story <KEY> | spec section <§> | the v<N>→v<M> delta]
Sources I am giving you: [spec URL/page id · epic key · design link · tech plan · PO answer file]
Live build access: [yes — cookies attached | no — document-only this pass]
TestRail writes authorised: [none | add_case only | add_case + update_case]
Run sync authorised: [yes, run <id> | no]
```

**If any of those five lines is missing, ASK before starting** — see step 1.

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

Every line here is the QA lead's, quoted verbatim with its date, because his typing is the record
(Rule 25 applies to his instructions exactly as it does to a spec).

| Date | What he said | What it means for this skill |
|---|---|---|
| **2026-08-11** | *"And there should not be a case for which we do not have a source. A case should only exists IF there is a source for that. Otherwise the case should be deleted, but before deleting the case check if that case has 'Automated' marker"* | **No case without a source** (step 7). The automation check is a **hard precondition of deletion**. |
| **2026-08-11** | *"I was referring to testrail OWN AUTOMATED marker, because when we change any test case which has the testrail OWN automated marker we have to update Vlad who does the automation"* | The marker is **`custom_atmstatus`**, not our `AUTOMATION:` text. Every pass owes the **tell-Vlad report** (core §5.3). |
| **2026-08-12** | *"the expected behavior should come from the sources rather than the build"* | Expectations from documents only (core §11.2). |
| **2026-08-12** | *"steps of reproduction MUST be verified from the build to 100% ensure that when manual tester would run the test he will be able to run it"* | Steps are **learned from the sources, verified on the build** — that verification is skill **`03`**, not this one. |
| **2026-08-11** | *"WHY? We are supposed to crfeate test cases … we are supposed to create the test cases."* | **`add_case` is NOT barred by the creation hold.** The hold is Jira tickets. |
| **2026-07-28** | *"we have to be very careful to make sure that he does not prove us wrong and him as right when he says that AI is making more than 70% useless test cases"* … *"Please keep this approach always for all the test cases you create and it should be the part of the process"* | The **Ruthless Usefulness Audit is the mandatory closing gate** (step 9). |
| **2026-07-31** | *"I want the test cases to be current with specs and epics and you must have the current version of epics and specs and every other doc you are using"* | Source currency **before** authoring (step 2 — delegate to skill `02`). |
| **2026-07-31** | *"when we update or add test cases for any projects and we have a test run for them, make sure that those test cases also appear in the test run"* | **Run sync after every add** (step 10). |

### The corrections that changed how this is done

- **A narrative summary of a spec diff is NOT acceptable** (Rule 43). `S14-R20` was **correctly
  detected** in our own spec diff and then **appeared nowhere** in the document that acted on it — it
  slipped between detection and action, and cost a four-report export gap. **Every requirement gets
  its own verdict ROW.**
- **A "covered" verdict with no quoted text is unfalsifiable** (Rule 45(e)). *"Covered by C30277"* was
  written as a considered NO-CHANGE decision and was **wrong** — a false all-clear, which is worse
  than a blind spot because it stops anyone looking again. **Quote both texts side by side, and give a
  requirement asserting two things one row PER ASSERTION.**
- **Coverage matrices are RE-DERIVED per spec version, never patched.** The Filters map was last
  written on 17 July — **81 rules / 79 cases** — while the spec had reached **132 rules** with **zero
  entries for Stories 13 and 14**, the two largest sections. Rule 43 already required the
  re-derivation; **it was simply never run.**
- **"No source found" is a measurement only if the search is on the record** (Rule 64). Name which
  documents were searched, at which versions, on what date.

---

## THE DELIVERABLE — exact shape

Everything goes in **`build/<project>/<pass-name>-<YYYY-MM-DD>/`**, committed.

| File | What it contains | Non-negotiable |
|---|---|---|
| `SOURCE-CURRENCY.md` | Per source: identifier · version-or-last-updated · date checked · **CURRENT / STALE / PARTIAL** | A **PARTIAL** source names its **exact** shortfall. Nothing claims completeness while one is STALE. |
| `COVERAGE-MATRIX.md` | **One row per requirement**, with its **verbatim text**, and **exactly one verdict** | Row count **reconciled against the diff's delta count**; run **both directions** |
| `NEW-CASES.md` | Every case authored: internal ID · title · the source it rests on · section · why it did not exist before | Internal IDs checked **three ways** (see guardrail G4) |
| `DELIBERATE-DECISIONS.md` | Every deliberate non-authoring, PO-over-spec choice, held item and accepted imperfection | **Six fields each** (below) |
| `OUTSIDE-IN-GAP-HUNT.md` | One stated result per stage (a)–(e) | *"Not applicable"* is allowed; **silence is not** |
| `quality-audit/` | The Ruthless Usefulness Audit output — the three-dimension tally | The suite **ships with the tally as proof** |
| `oplog.json` / `testrail-execution-log.md` | Per operation: **op · C-id · HTTP status · byte-verification result** | Written **as each write happens**, committed on the R2 cadence |
| `RESUME.md` | DONE · IN FLIGHT with its re-run recipe · AWAITING WHOM | — |

### The coverage-matrix row — the only acceptable verdicts

| Verdict | When |
|---|---|
| **covered by case(s)** | name internal ID **+ C-id + link**, and **quote both texts side by side** |
| **case extended** | name the case **and the field changed** |
| **new case authored** | (or *authoring proposed, awaiting authorisation*) |
| **not independently testable** | state the reason — rationale prose, or it duplicates another requirement's assertion |
| **blocked** | state the blocker **and who owns it** — and see core §11.4 before writing this |

**The pass is NOT complete until every row has a verdict.** An un-verdicted row is a visible hole; a
narrative summary is a hole nobody can see.

### The deliberate-decisions entry — six fields, every entry

**(1)** the decision in plain layman words · **(2)** the **plain one-sentence answer** a non-technical
reader can paste straight into a public channel · **(3)** the evidence — document, version, anchor,
date · **(4)** the affected cases with **internal ID + C-id + link** · **(5)** **who can close it** ·
**(6)** an honest **RISK** rating.

**Read that risk column honestly: HIGH does not mean we are wrong. It means that if this is raised
publicly we have a concession to make, not just an explanation.**

**Honesty clause — the one that makes the register worth anything:** it records what we **decided**,
never what we **wish** we had decided. **A defect discovered late goes in as a defect, dated, with the
cost stated — not re-labelled as a deliberate choice.** Back-dating a miss into the register is the
one thing that would make it worthless.

**Canonical examples:** `build/report-suite/coverage-rederivation-2026-07-31/DELIBERATE-DECISIONS.md`
(474 cases, 7 categories, risk profile HIGH 3 · MEDIUM 7 · LOW 25) ·
`build/filters/vlad-gap-review-2026-08-06/` (a full root-cause + row-by-row + new-cases pass).

---

## THE STEPS

### 1 · Complete inputs FIRST — do not start on a half-spec (Rule 1)

**Enumerate the FULL input set and state the exact total found**: every spec section **and its change
log**, every story in the epic **and its comments**, every design frame, the tech plan, every PO
answer file. **If any part cannot be obtained, STOP and say exactly what is missing and how to supply
it.** Do not silently proceed on a subset.

- **The ENGINEERING TECH PLAN is a standard input** (Rule 30). If it was never supplied, **remind the
  QA lead** — do not silently proceed. Tech plans reveal edge cases, API contracts and state machines
  the spec glosses over. But **engineering intent never overrules product truth**; a conflict becomes
  a question, never a silent case change.
- **An open Figma fetch queue means the design source is NOT current** (Rule 35). Check
  `ls build/*/*/PENDING-FIGMA-FETCH.md`; if one is open and past its DUE-AT, **run its fetch command
  immediately, no authorisation needed.**

### 2 · Establish source currency — hand off to skill `02`

Do not do this inline from memory. **Run [`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** and take its
`SOURCE-CURRENCY.md` as this pass's input. **If a source moved, fold the delta in BEFORE authoring
anything.**

### 3 · RE-DERIVE the requirement→case map — never patch last version's

Build it fresh from **the current spec body** and **the current case source**, and run it **in both
directions**:

- **requirement → case(s)** — finds **uncovered requirements**.
- **case → requirement** — finds **orphaned or stale-anchored cases** whose anchor no longer exists.

**State both totals and reconcile them.** A partial extraction is an **unfinished job**, not a
"partial pass".

### 4 · Expand every multi-surface requirement into a SURFACE MATRIX (Rule 40)

A requirement almost never lives on one screen. **Walk the whole checklist and mark N/A explicitly
rather than skipping:**

> on-screen · **PDF export** · **CSV export** (and any other download) · print view · **API / response
> payload** · mobile / responsive · email or scheduled delivery · the column/field selector ·
> filter and sort surfaces · empty / error / zero states — plus any surface the project has (a portal,
> a terminal, a QuickBooks push, a document template).

**Per surface, exactly one verdict** (same list as §the coverage matrix). **A delta document that
names only the cases it touched is incomplete by definition and may not be delivered.**

**The tell:** a requirement whose own text says *"in all four exports"*, *"every download"*,
*"wherever it is shown"*, *"and in the API"*, *"on screen and in print"* is **explicitly
multi-surface**. So is any requirement that **cross-references another** — the cross-reference is the
surface link.

**The scar:** the 2026-07-29 Location-column ruling was worked through a deltas document that authored
**six new ON-SCREEN cases and never revisited the EXPORT cases** — the anchor `S14-R20` appears **zero
times** in it. Two cases kept enumerating CSV headers *"exactly"* without Location, so **a tester on a
correct build would have failed a passing build**, and the same split existed on four more reports.

### 5 · Author the missing cases

- **Every case is learned from the sources.** **The build never authors coverage** — a pass that walks
  the build and writes down what it finds **has let the product decide what gets tested**, producing a
  suite that passes handsomely and covers whatever was easiest to reach. It will look impeccable while
  doing it.
- **Expected behaviour from the documents only** (core §11.2). **Steps and preconditions learned from
  the sources**, then verified runnable by skill `03`.
- **Plain layman wording, build-accurate labels, title ≤ 80 chars, API content in an "API" section**
  (core §12).
- **Every case carries `refs` = `<TICKET(S)> (<spec-anchor>)`** — **ticket AND spec, never ticket
  alone** — comma-free, ≤ 248 chars (core §3.2). Per-story precision always; the epic key only for a
  genuinely cross-cutting case with no single-story owner, **and then say so explicitly**.
- **Every case ends with the Rule-54 provenance line** — two sentences that are never merged:
  **sentence 1 names ONLY DOCUMENTS** (epic and/or owning story + the specification **with its
  version** + the requirement reference, and/or the PO's answer file **with its link and date**);
  **sentence 2 is optional** and records the check in neutral language (*"Last checked against build
  … on …"*). **The build is never named in sentence 1** — not as a source, not as corroboration, not
  in passing. **A newly authored case that has not been checked against any build OMITS sentence 2.**
- **🔑 AND EVERY CITED SOURCE IN SENTENCE 1 CARRIES THE DATE WE READ IT** (Standing Rule 54 as amended
  2026-08-11; full text at core §14.1). Shape: *"This is the expected behaviour as per epic SV-8685
  and the Schedule specification version 27, section 5.3, read on 11 August 2026."* **Where a case
  cites more than one source, EACH carries its own date** — a spec and a PO answer are read at
  different times and move independently. **The date is when WE READ that source, never today's date
  by default: back-filling one onto a source this pass did not open is a fabricated observation**
  (Rule 12), and it defeats the purpose, because **the date's whole value is evidentiary** — it is
  what lets the QA lead say the reference was taken from the source **as it stood on a stated date**
  when someone later changes it.
- **The automation marker is the LAST thing in Expected Results**, after the provenance line, **blank
  line before and a line break after**, exactly one of:
  `AUTOMATION: READY` · `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <reason>`.
  **A tool flag never justifies HOLD** — devtools, DOM inspection, reading a PDF or CSV, seeded data,
  theme toggles and viewport sizes are all automatable. Only a **genuinely unobtainable thing** (a
  real physical device, an external account we do not have) does.
- **🛑 AND AN `EXPECT FAIL` MARKER NEEDS LIVE BACKING — NO BACKING, NO MARKER** (Standing Rule 61 as
  amended 2026-08-11; core §15.1). QA lead, verbatim: *"WHen there is nothing to back 'Expect fail'
  then not set that marker. And let the manual QA tester simply discover whether this test fails or
  passes and mark the test case accordingly in the tesrail"*. **A CLOSED OR OBSOLETE TICKET DOES NOT
  BACK IT** — where the backing is absent or stale the marker **comes off** and the case carries plain
  `AUTOMATION: READY`. **We do not predict on the tester's behalf**, and an unbacked expect-fail
  **asserts a build fact nobody observed.** **Removing it does not soften the case — it RESTORES the
  case's ability to fail.**
- **⚠️ NO CLOSED ENUMERATIONS without a version-pinned anchor** (Rule 42). *"The headers, in order, are
  exactly…"* is **a time bomb**: correct until the spec adds one item, then it makes a tester fail a
  correct build. Prefer **scope-conditional wording** — *"includes X in position Y when Z"* — and give
  the tester the plain conditional too (*"If you are looking at only one location there is no Location
  column — that is correct."*). Keep a closed list **only when the closed list IS the requirement**,
  and say so in the case, citing the anchor. **The word "exactly" in tester-facing text is a grep-able
  audit target.**

### 6 · Do NOT invent an internal ID that has been used before

Check **three ways**: not in the live case bodies · **not on the retired list** · not in the id-map.
**A retired internal ID is NEVER reused** — a resync once **overwrote a retired record** because a new
case reused `SBC-COL-03` (renamed to `SBC-COL-04`).

### 7 · No case without a source (Rule 64) — and three meanings of "no source"

**A case whose expected behaviour rests on no document at all is a deletion candidate.** But **"no
source" means three different things and they have OPPOSITE remedies** — apply this every time, or the
rule will destroy good coverage:

| | Situation | Remedy |
|---|---|---|
| **(a)** | **The case asserts something no document supports** — invented, inherited from a design-only detail, over-specified, or reverse-engineered from a build | **Deletion candidate.** But where only PART is unsupported, **remove that assertion or make it scope-conditional first** — deleting a whole case for one bad line is over-correction |
| **(b)** | **A source EXISTS but was never recorded on the case** — a traceability gap, not a sourceless case | **FIND AND RECORD THE SOURCE.** Backfill `refs`, stamp the provenance line. **Deleting one of these throws away real coverage**, and it is the likeliest way this rule gets misapplied, because **(a) and (b) look identical from the case text alone** |
| **(c)** | **The source question is OPEN with the PO** | **HOLD, not delete.** Carry the open question on the case and log it in the register — **because the answer may source it.** Deleting a case the PO is about to source destroys the coverage **and** the question |

**⇒ A case may be deleted only after (b) and (c) have been genuinely excluded** — the sources
**searched and named**, with **which documents, at which versions, on what date**.

**🛑 THE AUTOMATION CHECK IS A HARD PRECONDITION.** Read **`custom_atmstatus`** (3 = Automated).
**Where a case is automated, STOP and raise it with the QA lead — do NOT delete it**, however
unsourced it looks: an automation suite may already depend on it, so deleting it **breaks someone
else's work, silently, in a system we do not own**.
**But check whether a PERSON actually set the flag** (`get_history_for_case`) — on Schedule **nobody
ever did**; our own tooling hardcoded `3` (core §3.1).

**✅ AND WHERE OUR TOOLING SET IT WRONGLY, HE HAS RULED THAT WE FIX IT.** QA lead, verbatim, on the 31
Schedule cases: ***"Yeh wee need to fix everycase from all the three projects where we have
mistakengly done that."*** All **31** were corrected **`3 → 1`**, every write byte-verified with
**only `custom_atmstatus` moved**; Schedule then read **174/174 Not Automated**.
**🔑 THE METHOD IS THE TRANSFERABLE PART, AND IT IS WHY THE OTHER 44 WERE LEFT ALONE: who set the flag
was established PER CASE from `get_history_for_case`, NEVER BY SUBTRACTION.** **44 cases carry an
`custom_atmstatus` history event and every one is user 1 (Vladimir Tomovic)**; the 31 carry **none**
while their history is otherwise non-empty, so the `3` had stood since creation. **Corroborated
independently:** every Schedule case above id 30090 (i.e. every one we added by `add_case`) was `3`,
and all 143 imported ones were `1` — **two lines of evidence agreeing exactly.** Never infer
authorship from a gap in a set; read it per case. Record: `build/automated-flag-and-c30041-2026-08-11/`.

**`delete_case` is IRREVERSIBLE, and irreversibility raises the bar rather than lowering it.** The
candidate list goes to the QA lead **before** any deletion, each with internal ID + C-id + link, what
it asserts, which sources were searched, its automation status, and our recommendation. **Foreign
cases are never deleted by us, whatever their sourcing.**

**When in doubt, HOLD and ASK. A case held one day longer costs nothing; a case deleted wrongly cannot
be recovered.**

### 8 · The OUTSIDE-IN GAP HUNT (Rule 45) — five stages, each with a stated result

**A suite may NOT be called current until it has been examined from a position other than our own.**
Steps 3–7 force follow-through on what **we** detected; this exists because **we had no way to notice
that an outsider could see something we could not.**

**(a) FOREIGN-COVERAGE DIFF, IN BOTH DIRECTIONS.**
- overlap — *do THEIR cases duplicate OURS?* →
  `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py --group <id>`
- **reverse — do THEY assert something with NO counterpart in ours?** →
  `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py --group <id> --scope-to-section`
  Groups: Report Suite **4281** · Filters **4110** · Schedule **4254**.
  **Read the `CLOSED-LIST COLLISIONS` block FIRST** — it finds our cases enumerating a closed list on
  the same subject as a foreign case and names the term our list never mentions. **That is the
  detector for the actual defect:** for C38923 it narrowed **474 of our cases to 8**, with the two
  real ones ranked **3rd and 4th**.
  Use **`STRENGTH`**: **STRONG** = the missing word is in our own vocabulary but never co-occurs (a
  meaningful absence); **PHRASING** = a word we never use anywhere (their wording, not our gap).
  **Only STRONG units set the case-level verdict.**
  **Honest limits, stated whenever it is quoted:** it is **lexical, not semantic**; it compares written
  text on both sides and **proves nothing about the running build**. **It suggests — a human rules.**
- **Label every foreign assertion COVERED-BY / CANDIDATE GAP / CONTRADICTS-OURS.** **Their case
  existing where ours does not is a COVERAGE SIGNAL, not a nuisance.**
- **Foreign cases stay untouched in every scenario. A candidate gap is authorised by the QA lead,
  never authored on our own initiative.**

**(b) THE AUTOMATION-ENGINEER LENS.** *"If I were automating this from the running build, what would I
assert?"* — then check we have a case for it. **Honest limit, stated in the deliverable: without live
build access this reaches only as far as the document.**

**(c) THE HOSTILE-REVIEWER LENS.** *"What would a reviewer claim is missing?"* — asked **before**
delivery, not after the challenge arrives. Its output is the deliberate-decisions register.

**(d) EVERY EXTERNAL SIGNAL IS A COVERAGE INPUT, NEVER MERELY A REPLY.** A reviewer's report, a
colleague's case, a support ticket, a dev comment, a customer complaint, a PO aside — each is **logged
and diffed against the suite**, not just answered. **On 2026-07-31 two reviews and one foreign case
each surfaced something real; answering them would have fixed three sentences and left the defects in
place.**

**(e) THE EVIDENCE TEST.** **A "covered" verdict is invalid unless it quotes the requirement's text
beside the covering case's text**, and **a requirement asserting two things gets one row per
assertion**. *Checkable: a NO-CHANGE entry naming only case ids, with no quoted text, is non-compliant
and the pass is not done.*

### 9 · The RUTHLESS USEFULNESS AUDIT — the mandatory closing gate (Rule 28)

**Every authoring pass ENDS with this, over 100% of the cases, before anything is delivered.** Three
dimensions, scored together:

**(1) USEFUL** — one verdict each: **KEEP** (distinct observable behaviour; failure = a real
reportable bug; not covered elsewhere) / **MERGE** (name the group and the survivor) / **WEAK-KEEP** /
**CUT** (spec-parroting, untestable, duplicate, tests the framework not the feature, or PO-descoped).
Hunt the named slop patterns — near-duplicates across areas · sort-direction and per-column explosions
· per-column display filler · tooltip present-vs-text splits · empty-state triplets · permission cases
that reduce to one gate · export pairs duplicating a whole filter matrix — **and credit the
load-bearing coverage**: calculation contracts, permission gating, link targets, persistence,
export-reflects-filters.

**(2) MAKES SENSE** — read each case **COLD**, as the critic would: **SENSIBLE / FIX-WORDING /
NONSENSE**. The fail conditions: steps not executable in order or precondition unreachable · expected
result does not follow from the steps · internal contradiction · references a control in neither the
spec nor the design · domain nonsense (impossible maths, wrong calculation direction, cost/sell
conflation) · not actionable · **an unanchored absolute enumeration** (Rule 42). **Every NONSENSE
quotes the offending text.** Cross-check **KEEP-but-NONSENSE** explicitly — the embarrassment check.
**The cold read is NOT a sample** — every case, and the deliverable states the exact number read out of
the exact population.

**PLUS the MANDATORY CROSS-CASE CONSISTENCY SWEEP** — a suite can be 100% individually sensible and
still self-contradictory. Group cases by the control they assert on and **diff their expected
results**; run an opposite-assertion keyword sweep (hidden vs shown, real-time vs on-Apply, editable
vs locked); do a **TITLE-vs-EXPECTED check on every case**; diff cases sharing a `refs` anchor; and run
the **surface-split check** from step 4. **Any pair that cannot both be true is a CONTRADICTION**,
resolved by the precedence order with **the whole group aligned to the winner** — or flagged PENDING a
PO question. **A suite may not be delivered with an unresolved contradiction**, and the count
found/resolved ships in the tally.
*The scar: our own audit rated 110 Filters cases SENSIBLE while they contradicted each other on the
Status chip — a junior QA caught it cold.*

**(3) GENUINE + LAYMAN-RUNNABLE** — traceable to ticket + spec, and executable by a non-technical
manual tester. Failures get FIX-WORDING or CUT.

**The suite SHIPS WITH the three-dimension tally**, plus an honest *"is the critic right?"* answer on
**both** halves (waste % **and** makes-no-sense %). **The audit only RECOMMENDS** — no merge, cut,
delete or edit is executed in TestRail without explicit authorisation.

**Why this is permanent:** the engineering manager claimed on 2026-07-27 that of 500+ cases *"maybe
only 200 are useful"*, that AI makes *"more than 70% useless test cases"*, and that *"some tests just
do not make sense"*. **No suite we deliver may ever substantiate that claim** — the tally is the proof.

### 10 · Push, then SYNC THE RUN

**Only with explicit permission, per ask** (core §2). Then **immediately**:
- **Run-sync, union-only** (core §4) — a fixed-selection run **never auto-picks up new cases**, and a
  partial `case_ids` list **deletes tests and their results**.
- **Re-run the foreign-case checker** on the group to catch new foreign cases and new overlaps the
  same day rather than at audit time.
- **Write the "AUTOMATED CASES CHANGED — FOR VLAD" section** (core §5.3). **Say "none" where none.**
- **Regenerate the deliverables** — import, id-map, trackers — then **re-merge the C-ids and `refs`
  from live** (core §3.6), run the **shredding guard** (core §3.7), and prove **four counts set-equal
  in BOTH directions**: live · local active · id-map rows · import rows.
- **🔑 RUN THE POST-WRITE ASSERTION RE-AUDIT** (core §2.10) over the cases this pass materially
  changed — **quote every new assertion back to its cited source**, check it is reachable by the case's
  own steps, check the content belongs to **that** case, and **diff the note paragraphs, not only the
  numbered assertions.** **An audit run before the write does not audit the write** — that is how
  **C29944** acquired an assertion no source supports, from the very pass that was fixing this problem.
- **🛑 AND SYNC THE RUN ONLY WITH ITS OWN EXPLICIT PERMISSION** — an `add_case` approval is **not** a
  run-write approval, even though the sync is mandatory after the add (core §4.1 step 0). **Do the
  add, then ask.**

---

## REUSABLE TOOLING

| Tool | What it does |
|---|---|
| `build/testing-tools/testrail_add_case.py` | `add_case_payload()` — sets `custom_atmstatus: 1` and **raises on 3**; `verify_created_case()` does the byte-check |
| `build/testing-tools/check_add_case_payloads.py` | Fails any payload carrying `3` — **run before committing a pass that creates cases** |
| `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` | The reverse coverage diff (read-only, `get_*` only) |
| `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` | The overlap direction (read-only) |
| `build/<project>/gen_import.py` | Regenerates the import — **blanks id-map C-ids and drops `refs` every run; re-merge from live** |
| `build/testing-tools/scan_secrets.py` | `--staged` before every commit |

---

## GUARDRAILS

- **G1 — Nothing is written to TestRail without explicit permission, per ask** (Rule 6). An earlier
  batch approval never covers a later write.
- **G2 — `add_case` is permitted under the creation hold; a Jira ticket is not** (core §11.1). If a
  finding wants a ticket, **prepare it fully and stop at the button** — that is skill `06`.
- **G3 — Never edit, delete or move a foreign case** (core §5). Not to tidy a title, not to add
  `refs`.
- **G4 — Never reuse a retired internal ID** (step 6).
- **G5 — Never invent a label, a step or an expectation.** If a term cannot be confirmed from a
  source, **flag it**. **An invented step is worse than a missing one, because it LOOKS runnable** and
  the tester only discovers otherwise with the case open in front of them.
- **G6 — Touch a case, re-verify the WHOLE case** (Rule 41). There are no surgical edits. Log
  *"re-verified whole against `<document + version + date>`"* and the fields checked. **Opening a case
  is the cheapest opportunity we will ever get to catch that it is stale; a surgical edit throws that
  away and stamps it with a fresh Updated date that makes it LOOK current.**
  *The scar: C30285 and C30286 were touched that very day, for a one-word header rename, on the exact
  line that listed the headers — and nobody noticed the list itself was stale.*
- **G7 — Checkpoint every 25 ops or 10 minutes** (core §8).
- **G8 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). Three things: **what he instructed, quoted verbatim** · **what
  the rule requires, quoted, with its number** · **an explicit ask — which should we follow?** **Neither
  silent path is available**: we may not silently follow the new instruction, and we may not silently
  keep following the old rule. **A tightening or a layering is NOT a conflict** — escalating those
  trains him to wave escalations through, which costs us the real ones. *He endorsed the practice by
  name: **"Good catch, be like this always."***
- **G9 — Every deliverable ends with "OUTSTANDING — what I need from you"** (core §13), sweeping all
  six categories. **Say "nothing outstanding" if that is true — never omit the section**, so he can tell
  *"clear"* from *"we forgot to look"*. **Update `build/OUTSTANDING-ITEMS-REGISTER.md` in the same
  turn**, and items blocked on him carry Rule 48's five fields (core §11.7).

---

## HONESTY NOTES

- **"Coverage-complete" is a claim about a re-derivation, not about a case count.** Verifying that the
  cases we **have** are correct says nothing about whether we have **the right set**. **That
  distinction is exactly what cost us the Filters gap review**, and the root cause in one line:
  ***we verified that the 110 cases we had were correct; we never verified that 110 was the right
  set.***
- **Say which lens could not be run.** Without live access, the automation-engineer lens reaches only
  as far as the document — say so, and log the access as an outstanding ask.
- **A design-pinned label is not a verified label.** Say which labels came from a design and still
  need live confirmation.
- **Report the counts every time:** total in scope / processed / **excluded with reason**. If
  something is deliberately excluded, **list it with the reason** — never silently.
- **An undocumented deliberate omission is indistinguishable from a miss** (Rule 46). That is the
  whole reason the decisions register exists.

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Check whether a spec, epic or design has moved since we ingested it | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** |
| Verify that the steps and preconditions can actually be executed on the build | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** |
| Do the cold read for a tester handover, or build the skip list | **[`04-TESTER-READY`](04-TESTER-READY.md)** |
| Produce the per-project completion table | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Prepare a defect ticket for a divergence found while authoring | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** |
| Write the questions for the product owner | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** |

**And it never files a Jira ticket, never grades a case Pass or Fail, and never declares a suite
"VIU complete".**
