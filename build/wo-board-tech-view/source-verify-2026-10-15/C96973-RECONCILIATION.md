# C96973 — three-way reconciliation (Rule 106), 15 Oct 2026
Case: https://shopview.testrail.io/index.php?/cases/view/96973 (AUTOMATED — no write without the QA lead's yes, Rule 71; tell Vlad, Rule 65).

**1 · The case's Expected (read live 15 Oct):** "After the change the work order no longer matches Assigned to me and disappears
from the board without a reload (your column count goes from 1 to 0)."

**2 · The source as it reads today** — PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 52
(change log's last entry v52, 14 Oct 2026, Chris Ward), read 15 Oct 2026 (PRD-845185030-read-2026-10-15.md in this folder):
- S4-E8: "After reassignment, remove the work order from results if it no longer matches the filter."
- S3-N1: "With Assigned to me enabled, Board View shows only the technician columns, including Unassigned, that hold at least one
  work order matching Assigned to me (S1-R13). Every other column is hidden, including pinned technicians."
- S1-N1: "When the active filters or a search return no work orders, Tech View and Board View show the same empty state as the
  List, with the same messages and action."
- S1-N1a: "With filters active, with or without a search, the empty state reads “No work orders match these filters”, then
  “Try removing a filter to widen your results.”, with a Clear all filters button."
- Change log 2026-10-08 (v43): S1-N1 rewritten to match the List's empty state (after the case was written on 8 Oct from v33).

**3 · The build observed** (run session, staging, 15 Oct; REPORT-staging-2026-10-15.md item 4): giving away the only work order
empties the board and it shows "No work orders match these filters".

**Verdict: the CASE disagrees with the source; the build agrees with it.** "(your column count goes from 1 to 0)" is not in any
source line: under S3-N1 a column with 0 matching work orders is hidden, and with nothing left S1-N1a's empty state shows.
This is a correction of the Expected BACK to the source (Rule 106/114), not toward the build.

**Proposed Expected line (replaces the one above):** "After the change the work order no longer matches Assigned to me and
disappears from the board without a reload. With none of your work orders left, your column is hidden and the board shows
“No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button."
Plus S3-N1 and S1-N1a added to the case's exact-quotes list and the source line re-dated to v52, read 15 Oct 2026.

**Nearest rule that seems to forbid this, answered:** Rule 114 ("the Expected is never changed") — its one permitted edit is
correcting it back to the source quote, which is what this is. Rule 57 — the expectation still comes from the document (v52),
not from staging; staging only happens to agree.
