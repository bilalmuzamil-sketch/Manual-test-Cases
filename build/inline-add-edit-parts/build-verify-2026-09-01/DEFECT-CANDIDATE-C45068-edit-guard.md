# DEFECT CANDIDATE — Edit on a part line skips the unsaved-data guard (suite 6597 / C45068)

**PREPARED, NOT FILED.** The Jira creation hold is active (Rule 62, QA lead 2026-08-10, re-confirmed
2026-09-01: *"Do not do it now"*). Permission for Jira is **per ask**. This file is the ticket text,
ready to paste the moment permission is given.

| Field | Value |
|---|---|
| Issue type | `Story Defect` |
| Parent | **SV-9320** (Story 5, Edit Part — Full View) — the owning story, never the epic |
| Also link | `relates to` SV-9320 |
| Priority | **Medium** |
| Product Area | not set (absent on this issue type) |
| Branch / build | `https://sv9315.qa.shopview.com`, **`v26.35.6-598cc8a`**, observed 1 September 2026 |
| Case | [C45068](https://shopview.testrail.io/index.php?/cases/view/45068) |

## Summary

Selecting **Edit** on an existing part line while an inline **add** row is open **and holding entered
data** opens the Edit Part Request modal straight away. The unsaved-data confirmation is not shown,
and the populated add row is left open behind the modal.

## Steps to reproduce

1. In the top menu click **Work Orders** and open a work order whose status is Estimate or Approved.
2. Open its **Lines** tab. Each work order line has a Parts section beneath it.
3. In that Parts section click **Add Part**. An inline row opens above the existing part rows.
4. Type anything into **Description** and a number into **Qty**. Do not save.
5. Now click the **edit** control on one of the part rows that was already on the line.

## What happens

The **Edit Part Request** modal opens immediately. No confirmation appears, and the inline add row is
still open underneath it with the typed data in it.

## What should happen

The **"Discard this part?"** confirmation should appear first — body *"The details you entered will be
lost."*, actions **Keep Editing** and **Discard Part**. Choosing **Discard Part** should close the add
row and then open the Edit surface; choosing **Keep Editing** should cancel the request and leave the
add row open and focused.

## Source of that expectation

Inline Add and Edit Parts on Work Order Lines specification **version 16**:

- **S5-E1** — *"If an inline add row is open on the work order and the user selects Edit on an existing
  part line, S6-R5 applies before the modal opens."*
- **S6-R5** — *"If the user selects 'Add Part' on another work order line, **or selects Edit on another
  part line**, while a row contains data, the confirmation in S6-R1 is displayed. Selecting 'Discard
  Part' closes the current row and opens the requested one. Selecting 'Keep Editing' cancels the
  request and leaves the current row open and focused."*

## Why this is not an instrument error

The **Add Part** half of the very same requirement works: clicking Add Part on another line with data
in the row **does** raise the confirmation, observed in the same session
(`evidence/probe-full.json` → `M-second-row`). So the guard exists and is wired to one entry point and
not the other. The Edit leg was then re-run a second time from a clean page load and behaved
identically — `evidence/probe-full.json` → `AB-edit-guard-recheck`, two legs, both showing
`discardConfirmationShown: false`, `editModalShown: true`, `addRowStillOpen: true`.

## Impact

A technician or advisor who has typed a part and then clicks Edit on another line loses the typed part
with no warning, which is the exact loss Story 6 exists to prevent.
