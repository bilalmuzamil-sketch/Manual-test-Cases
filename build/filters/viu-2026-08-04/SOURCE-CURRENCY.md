# Filters — SOURCE-CURRENCY block (Standing Rule 31 pre-flight)

**Pass:** live VIU against the Filters QA branch · **date checked 2026-08-04**

| # | Source | Identifier | Version / last-updated (LIVE) | Our baseline before this pass | Verdict |
|---|---|---|---|---|---|
| 1 | **Spec** | Confluence page **572030978** "Filters" | **Confluence version 17**, 2026-08-04T12:33:56.243Z, Branko Cicovic, comment *"Fix Story 12 numbering: deferred-apply requirement renumbered to S12-R6, placed after the page-search S12-R5"*. Body "Version:" line still reads **1.6**. | mirror captured at Confluence **v12**; the previous pass verified **v14** | **WAS STALE — REFRESHED THIS PASS** (v14 → v17) |
| 2 | **Epic + child stories** | **SV-8785 "Filters"** (Epic, hierarchy 1, Open) | **18 descendants now**: the 14 stories SV-8786…SV-8799 **plus 4 new defect/clarification tickets** raised today — SV-8824, SV-8825, SV-8828, SV-8832. `parent = SV-8785` returns 15 (14 stories + SV-8825); the other three are Story Defects parented to their stories. | we knew of 14 stories and 2 defects | **WAS STALE — REFRESHED** (Tier-1 only; no Tier-2 re-read requested) |
| 3 | **Designs** | Figma `DR4gEODShYgJqkozs3mF5q` | **85 of 85** boards; Rule-35 queue **CLOSED** 2026-07-31T08:58:40Z | same | **CURRENT — and used**: boards 11854:24657 and 11972:32318 were re-read as pixels this pass |
| 4 | **Engineering tech plan** | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | reconciled 2026-07-29 / 07-30, decision **D15** | same | **CURRENT** |
| 5 | **PO / stakeholder answers** | `build/filters/branko-answers-2026-08-04/answers-ingested.md` (9 of 9 answered) | ingested 2026-08-04 | same | **CURRENT, but now CONTRADICTED by source 1** — see the finding below |
| 6 | **THE BUILD** (new source this pass) | `sv8785.qa.shopview.com`, API `sv8785api.qa.shopview.com` | **`v3.4.2-4f8211c`**, index.html last-modified Mon, 03 Aug 2026 20:09:32 GMT, etag `cf3ffbad546f569b2b86c36b53d87514` — **identical at start, mid-run and end** | never observed before today | **PARTIAL — the branch is NOT declared final**, so every finding is provisional and queued for re-check (Standing Rule 49, `RECHECK-QUEUE.md` is OPEN) |
| 7 | **TestRail group 4110** | 110 cases | all `created_by: 3` | 110 | **CURRENT — 0 foreign cases** |
| 8 | **TestRail run 352** | "Filters - Ahtasham (Awaiting QA- ENV)" | `include_all:false`, 110 tests, **398** result records, 1 Passed / **2 Failed** / 107 Untested | the brief said 396 records and did not mention the 2 failures | **CURRENT — verified, not trusted** |

**Nothing in this pass is reported as complete while source 6 is PARTIAL.** The exact shortfall is
named: the QA branch has not been declared final by engineering, so all 110 verdicts are
**provisional** and the re-check queue stays OPEN.

## FINDING 1 (spec) — v14 → v17 changed exactly two requirements, and lost nothing

Three versions landed after the previous pass read v14:

| v | when (UTC) | comment |
|---|---|---|
| 15 | 2026-08-04T12:04:15Z | *"Clarify mobile deferred apply: revise S12-R2, add S12-R5 and a Key Decision"* |
| 16 | 2026-08-04T12:23:58Z | *"Restore v1.6 (search content) accidentally overwritten; re-apply Story 12 mobile deferred-apply edits"* |
| 17 | 2026-08-04T12:33:56Z | *"Fix Story 12 numbering: deferred-apply requirement renumbered to S12-R6"* |

**Version 15 accidentally destroyed a third of the document** — 30,594 bytes and **79 anchors**,
down from 73,403 bytes and 127 anchors. **Version 16 restored it.** We proved the restore was
complete rather than assuming it, at requirement level:

```
v14 requirements 127   v17 requirements 128
  ADDED   : S12-R6
  REMOVED : none
  CHANGED : S12-R2 only
  non-requirement prose lines present in v14 and missing from v17: 0
```

So **no requirement and no prose line was lost.** (The byte count fell 73,403 → 56,735 because the
restore re-pasted plain URLs in place of Confluence smart-link macros, which are extremely verbose
in storage format. Anchors are complete, so nothing normative went with them.)

**The two changes, verbatim:**

- **S12-R2 amended** — was *"The filter chips behave identically to desktop…"*, now *"The filter
  chips behave like desktop with one exception (see S12-R5)…"*
- **S12-R6 ADDED** — *"Unlike desktop, mobile does not filter in real time. Selections made inside a
  dropdown / bottom sheet are staged, and the table updates only when the user taps an "Apply
  filters" button within the sheet. This confirms intent on smaller screens and avoids repeated
  table reflows / data fetches while the user scrolls a long option list. "Clear selection" and
  "Clear filters" behave as on desktop."*

**S12-R2's cross-reference is wrong:** it points at **S12-R5**, which is the page-search
requirement; the exception it means is **S12-R6**. An editing slip introduced by the version-17
renumber. Raised with Branko; no case impact.

## FINDING 2 (epic) — four defect/clarification tickets exist that we did not know about

Two of them change what we do, and **both were raised by the QA executing run 352, hours before
this pass**:

- **SV-8824** (10:40 UTC) — *"Multi-select filter dropdown closes after each selection (desktop)"*.
  **Our own live observation independently reproduced it**, twice: the panel is gone within 700 ms
  of a single tick. **12 of our cases fail on this build because of it**, including five whose
  precondition ("the dropdown is open with a value ticked") is now literally unreachable. They keep
  their assertions and carry the ticket link.
- **SV-8825** (10:58 UTC) — the mobile Apply-button clarification. **This is the same question we
  independently arrived at**, and it is already with Branko.

**The timing matters and it is the crux of the mobile question.** SV-8825 was raised at **10:58
UTC**; Branko's spec edits adding S12-R6 landed at **12:04–12:33 UTC**, with the changelog comment
*"Clarify mobile deferred apply"*. So the new requirement reads as his written answer to that
ticket — which would make it the latest authoritative source and put the **build** in the wrong.
But his answer sheet, ingested the same day, says the opposite, and the ticket is still **Open**
with no comment on it. **We are not choosing.** Rule 32(iii): where recency cannot be established,
ask the PO. The 8 mobile cases are HELD.

## FINDING 3 (build) — the API host is now VERIFIED, not inferred

`build/APP-ACTIONS-PLAYBOOK.md` §B recorded `sv8785api.qa.shopview.com` as **inferred from the
naming pattern and not yet verified**, because the branch had deliberately had zero requests made
to it. It answered `POST /api/quick-login` with **HTTP 200** on the first attempt today. **The
pattern is now proven on two of the three branches.**
