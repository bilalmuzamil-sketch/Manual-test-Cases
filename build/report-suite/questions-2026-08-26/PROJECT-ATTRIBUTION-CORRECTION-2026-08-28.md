# C30491 is a WORK IN PROGRESS case, not Inventory Value — confirmed live 2026-08-28

**Why this file exists.** The question about what the Work In Progress **Estimates** summary figure
counts was handed to us labelled as an **Inventory Value** question about **C30491**. That label is
wrong, and it has been corrected.

---

## 1 · The evidence, read live from TestRail on 2026-08-28

| Field | Live value |
|---|---|
| Case | **C30491** — <https://shopview.testrail.io/index.php?/cases/view/30491> |
| Title | *"The Estimates figure is the Estimates tab total, shown at full opacity"* |
| Section | **4356 — `WIP — Summary Strip`** |
| Parent sections | `Work In Progress` → `Reports Suite` |
| `custom_atmstatus` | **1** (not Automated) |
| Refs | `SV-8661 (WIP Story 5; WIP report design review 2026-08-13 …)` |

**`SV-8661` is the WIP Story-5 "Summary Strip" story.** The anchors in the question — `S5-R8`,
`S5-R9`, `S5-R12` — are **Work In Progress** anchors. **Inventory Value v10's own `S5-R8`** reads
*"Changing the 'as of' date reloads the report"* and has nothing to do with Estimates.

**Verdict: C30491 belongs to the Work In Progress report. It has never belonged to Inventory Value.**

## 2 · What this changed in the sheet — nothing, and that is the point

The sheet that carries the question,
`build/report-suite/questions-2026-08-26/Report-Suite_Questions-for-Chris-Ward_2026-08-26.md` and its
`.xlsx` twin, was **already written against the Work In Progress report**:

> *"Question 2 - Report Suite - **the Work In Progress report** - what the Estimates figure counts (the
> Estimates total in the summary strip at the top; under epic SV-8582)"*

and its QA-only tab already carried the note *"the task named this as an Inventory Value question — it
is not"*. **No question text needed correcting, and none was changed.** What was missing was a
**confirmed, live-verified record** so the wrong label could not be re-introduced by the next pass.
That record is §1 above, plus register row **PO-2**.

## 3 · Nothing else moved

- **The question is still open** — it is a genuine self-contradiction in Chris Ward's live WIP
  specification, and Rule 58 forbids resolving it from the build.
- **C30491 is still HELD** and was **not written to**.
- **The sheet is still a DRAFT and has not been sent.**
- No TestRail write, no Jira write, no ticket. The Rule-62 creation hold is untouched.

## OUTSTANDING — what I need from you

1. **Nothing on the attribution** — it is settled and recorded.
2. The underlying question still needs Chris Ward's answer before **C30491** can come off hold. It is
   question 2 on the 2026-08-26 sheet, which is drafted and waiting for your go-ahead to send.
