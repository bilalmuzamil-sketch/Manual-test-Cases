# Schedule assertion forensics — STAGED REPAIRS — 2026-08-11

**NOTHING HERE HAS BEEN APPLIED.** This pass made **0 TestRail writes, 0 Jira calls, 0 Confluence
writes**, and **another worker owns TestRail writes for Schedule** — a sibling executed a push on this
suite at ~13:56Z today. Each item below is decision-ready: the case, the link, **the exact current text**,
**the exact text it should carry**, and **the source that justifies it**.

**THE REPAIR SHAPE IS FIXED BY RULES 25/42/58: an unsupported assertion is REMOVED or made
SCOPE-CONDITIONAL. It is NEVER replaced with a description of what the build does.** This pass opened no
build and claims no build fact (Rule 12), so it could not substitute build behaviour even if that were
allowed.

**Whoever executes these owes: a second source read at the moment the writes begin (Rule 59) · a
byte-level re-GET per write with untouched fields proven identical (Rule 50) · `custom_atmstatus` captured
AT WRITE TIME, not from this file (Rule 65) · a run-357 union check afterwards (Rules 34/47).**

---

## R1 · 🔴 C29944 — remove the unsourced multi-status assertion. **The one live defect.**

**SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** · section 4256 ·
`refs: SV-8687 (§5.1)`

**CURRENT expected results, live, verbatim:**

> 1. The Status group lists the work order statuses the app supports.
> 2. Only work orders in the chosen status remain in the card list - no work order of any other status is shown.
> **3. Choosing more than one status shows the work orders of all the chosen statuses together.**
> 4. The card left-border colours of the remaining cards are consistent with that status.

**THE SOURCE, live v27 §5.1, verbatim and in full on this point:** *"Status | All work order statuses
currently supported in the app"* — and **the words `multi`, `multi-select`, `multiple`, `more than one` and
`several` appear in §5.1 in NONE of the 27 versions.** Not in story SV-8687, not in the tech plan, not in
the design, not in Branko's answers (`FINDINGS.md` §1 lists every search).

**PROPOSED TEXT — remove point 3 and renumber:**

> 1. The Status group lists the work order statuses the app supports.
> 2. Only work orders in the chosen status remain in the card list - no work order of any other status is shown.
> 3. The card left-border colours of the remaining cards are consistent with that status.

**PLUS a plain tester line, in the note block (Rule 58 — the ambiguity is disclosed, not resolved):**

> Note for the tester: this test uses one status at a time. Whether you are able to tick more than one
> status at once is not settled in the specification, so do not pass or fail this test on that — it is an
> open question with the product owner.

**JUSTIFICATION:** Rule 25 (remove the unsupported assertion, never substitute the build) · Rule 42
(scope-conditional wording) · Rule 58 (an ambiguous or silent source is never resolved from the build) ·
Rule 54 (the provenance names §5.1 and must not over-claim).

**⚠️ DO NOT "FIX" THIS BY ADDING A SECOND STATUS TO THE STEPS.** That would make the unsourced assertion
runnable rather than sourced, and would bake the build's behaviour in more firmly. **The question goes to
Branko (Q3); the assertion comes out meanwhile.**

**ALTERNATIVE, IF BRANKO ANSWERS FIRST:** if he confirms multi-select is intended, the assertion goes back
with a step that selects two statuses, cited to his answer with its date and file link (Rule 54).

**Ops: 1 `update_case` (custom_expected). No title change, no `refs` change, no steps change.**

---

## R2 · ✅ DISCHARGED BEFORE IT WAS PROPOSED — the six panel cases' wrong step count

**C43582–C43587.** All six told the tester that *"steps 1 to 8 cannot be carried out"* while five of them
did not have eight steps.

**FIXED by the sibling's 13:56Z push, verified live by this pass:**

| Case | Real steps | The note now reads |
|---|---:|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | 7 | *"steps 1 to 7 cannot be carried out"* |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | 6 | *"steps 1 to 6"* |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | 7 | *"steps 1 to 7"* |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | 4 | *"steps 1 to 4"* |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | 5 | *"steps 1 to 5"* |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | 7 | *"steps 1 to 7"* |

**All six now match exactly. Their assertion bodies were NOT touched by that push** — verified
byte-identical. **Kept in this list rather than deleted, because a repair that quietly vanishes from a
staged list is indistinguishable from one nobody did.** **No action.**

---

## R3 · ⚠️ C30041 — resync the LOCAL case source, or a regeneration will resurrect a deleted requirement

**SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** · **this is a LOCAL
FILE repair, not a TestRail write.**

**Live TestRail is CORRECT.** The local source at
`build/schedule/cases/cases-E-toolbar-views-interactions.json` is **STALE** — it still carries all four
original assertions:

| | |
|---|---|
| **LOCAL (stale)** | 1. *"Blocks that match the search are highlighted; blocks that do not match fade."* 2. the five matched fields 3. *"Matching blocks stay in place on the grid (search visually filters; it does not remove or rearrange)."* 4. *"Clearing the search restores all blocks to normal."* |
| **LIVE (correct)** | 1. *"The toolbar search filters the blocks on the grid against what you typed."* 2. the five fields, named explicitly 3. the tester note disclosing that the specification is silent on the non-matching blocks |

**WHY THIS IS A HAZARD AND NOT HOUSEKEEPING: the generators run off the local source.** Regenerating the
import or the deliverables today would **re-emit the fade/highlight assertion the PRD DELETED at v24
(2026-08-06)**, silently undoing this morning's correct trim — and it would do so in a file that looks
freshly generated.

**PROPOSED: re-sync the local body for C30041 from live before any regeneration.** Measured scope: **1 of
174 cases differs in its assertion body**; all 174 differ in the provenance/marker layer (read-on dates and
marker changes written live on 2026-08-10/11 that local has not absorbed), so **the same caution applies to
any regeneration** — it would also restore removed expect-fail markers and symptom blocks.

**Ops: 0 TestRail writes. 1 local file edit + a re-sync of the provenance layer, then regenerate.**

---

## Q1 · Branko — was the §4.12 one-word change deliberate? (a QUESTION, not a repair)

**SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)**

**The case is CORRECT against v27 and NO EDIT IS PROPOSED.** It asserts *"a breakdown for each assigned
technician"*, matching v27 §4.12 *"a per-assigned technician breakdown"*.

**The rider, carried from 2026-08-10 and still open:** `per-assigned technician` first appears at **v26,
2026-08-07T11:02:57Z**, the wording it replaced stood from **v1 to v25**, and **v26 carries no version
comment** — so nothing announced a change that narrows who appears in a tooltip. The 2026-08-10 pass
recommended holding the edit until Branko confirmed it was not a typo; it was applied without that
confirmation.

**Plain question for the sheet:** *"On the capacity bar tooltip, should it list every technician, or only
the technicians who have work booked that day? The written specification changed on 7 August from one to
the other without a note, so we want to be sure the change was intended."*

**Risk: LOW.** Following the current text of the specification is defensible under Rule 57 either way.

---

## Q2 · Branko — the PRD deleted the search fade/highlight, but story SV-8686 still requires it

**A PRD-vs-STORY MISMATCH, which Rule 57 (as amended 2026-08-06) requires be RAISED, never silently
resolved.** Both are authoritative sources of expected behaviour.

| Source | What it says |
|---|---|
| **PRD v27 §6** | *"Search | Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name."* — **and nothing about fading or highlighting.** The sentence *"Non-matching blocks fade; matching blocks highlight."* was present **v7 → v23** and **DELETED at v24, 2026-08-06T08:34:03Z**. |
| **Story SV-8686** | **still asks for the fade/highlight behaviour** (established by `build/schedule/c30041-latest-wins-2026-08-11/`, which read the story live). |

**C30041 already handles this correctly and needs no edit:** it follows the more recent source on the QA
lead's own ruling (*"The latest or newer wins here"*) and **discloses the divergence in its own
tester-facing text** (Rule 56). **What is owed is the RAISING of it.**

**Plain question for the sheet:** *"When someone types in the schedule search box, what should happen to
the jobs that do not match — should they stay on the grid greyed out, or disappear until the search is
cleared? The written specification used to say they fade, that sentence was removed on 6 August, and the
ticket describing the work still asks for it."*

**Risk: MEDIUM** — this is the only assertion in the suite deliberately dropped while a live source still
requires it, and it is defensible only for as long as the ruling and the disclosure are on the record.

---

## Q3 · Branko — is the Status filter multi-select? (the question behind R1)

**Plain question for the sheet:** *"In the work order filter panel, can you tick more than one status at
the same time — for example Approved and Review together — and see both sets of jobs? The written
specification lists which statuses appear but does not say whether you may pick more than one."*

**What it unblocks:** whether **C29944** gains a *sourced* multi-status assertion or simply loses the
unsourced one. **R1 does not wait on this** — the unsourced assertion comes out either way; his answer
decides whether a sourced one goes back.

---

## What is deliberately NOT in this pack

| Not proposed | Why |
|---|---|
| Any change to the 167 UNCHANGED cases | their assertion bodies never moved; nothing was found to repair |
| Reverting the 21 removed expect-fail symptom blocks | they implement the **Rule-61 amendment of 2026-08-11**; removing an unbacked expect-fail marker is what the QA lead ordered |
| Reverting C30033 or C30041 | both are faithful to the current specification; their riders are **questions**, not repairs |
| Correcting **C38866**'s `refs` and provenance (it cites the epic where **SV-8700** owns the requirement) | found by the 2026-08-10 / coverage passes, **not by this one**; it is their staged item and duplicating it here would double-count the work |
| Any Jira ticket | **the creation hold of 2026-08-10 is active** — *"Do not create anything until my next order"* — Jira only, and Rule 62 requires per-ask permission regardless |
| Any question sheet actually sent | Q1–Q3 are **drafted, not sent**; sending is the QA lead's call and they belong on **one** sheet |
| Adding a second status to C29944's steps | that would make the unsourced assertion *runnable* rather than *sourced* — the wrong repair, and it would bake the build's behaviour in harder |
