# WO Board and Tech View — Chris Ward's answers (PO question sheet, read 14 Oct 2026)

Sheet: https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU/edit (tab "Questions for Chris",
column "Your answer"). Shared back by the QA lead on 14 Oct 2026. Answers copied verbatim.

| # | Topic | Chris Ward's answer (verbatim) |
|---|---|---|
| 1 | The "Clear shifts" question | 1. (a) yes, (b) yes, (c) no, only approved lines count, and a line not yet approved or declined is ignored, (d) no once the new line is approved, because the shift then covers only some lines, so there's no prompt. S4-R28 now says "every approved line, judged at the moment the lead changes". |
| 2 | A technician removed from this location | 2. (a) No. A drop is refused with "This technician can't be assigned work orders." and the work order stays put. (b) No inactive marker, because they aren't deactivated. (c) Once empty, the column is no longer shown. New S3-R20c; S4-N5 is widened to match. |
| 3 | Estimated hours on a card | 3. (a) Yes, declined lines are left out, the same as the work order page's Total Hours. (b) Yes, a difference of up to 0.1 hours from rounding is accepted. The card follows the work order page, not the List, and the List keeps its production figure, which can differ. New S5-R11a. |
| 4 | Technician name on cards | 4. (b). Cards and headers show the staff record name, the same as the List's Lead Technician column. New S5-R11b. The build uses the account name today; please log it as a bug against S5-R11b. |
| 5 | The Review Decisions page | 5. (b). The PRD is the source of truth. The review page now carries a banner saying it is history and the PRD wins where they differ. |
| 6 | Release notes | 6. Yes, done on both release-note pages: "the lead technician can't change on Invoiced or Paid work orders, which can still be reordered within their technician. Imported work orders open in List only." |
| 7 | Imported ticked from a link or saved filter | 7. (a). The page opens in List with Imported ticked, and Board View and Tech View are greyed out as in S1-R13a. The user's saved display is kept for their next visit. New S1-R13c. |
| 8 | The spec's header and change log | 8. Done. The Status line reads v49, and the Change Log now lists every change since development started (baseline v34, 28 Sep), one row per version. |
| 9 | Work order preview panel | 9. (b). Not in 26.43.0. A List row opens the work order page as today. The preview panel is now in Out of Scope. |
| 10 | "No results" message in the design | 10. (a). The PRD is right and the build matches it; test against the PRD. The design is being updated. |
| 11 | Extra Columns menu and group controls | 11. (a). Confirmed, not in 26.43.0. Collapse all / Expand all and the extra Columns menu items are now in Out of Scope. |
