# Dashboard — Chris Ward's answers (PO question sheet, read 14 Oct 2026)

Sheet: https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit (tab "Questions for Chris",
column "Your answer"). Shared back by the QA lead on 14 Oct 2026. Answers copied verbatim.

| # | Topic | Chris Ward's answer (verbatim) |
|---|---|---|
| 1 | Trend line on a tile | 1. (a). New S4-R11b: the trend line shows direction, not level. Each tile scales its line to its own lowest and highest point, so a figure that never changes draws flat along the bottom, whatever the figure is; the headline carries the value. The start-at-0 axis (S9-R8) applies only to the expanded and report charts. |
| 2 | Release note | 2. (a). Done. Both release-note pages now say Sales report totals "can change": voided invoices no longer count, which lowers a total; invoices with no customer now count, which raises one; and a voided invoice that was invoiced again counts only the new amount. |
| 3 | Date choices on a tile | 3. Yes to both. New S7-R2a: a tile uses the reports' date picker, with the nine presets plus a calendar for a custom range of up to 366 days and Today inside the calendar. Today is not a tenth preset. A custom range is not remembered (S7-R8), and its report opens on Custom (S10-E1). The release notes now mention the custom range. |
| 4 | At Risk Customers table | 4. (a). New S6-R8a: the amount opens the Sales report filtered to that customer over the same twelve months, so the report total equals the amount. A walk-in row or a $0.00 amount is plain text. |
| 5 | Expanded Revenue chart | 5. (b). New S6-R3a: the expanded chart covers the tile's own date range, with one bar per day, week, month or quarter by the same rule as the trend line (S4-R11). Last 12 Months shows twelve monthly bars; This Month shows daily bars. |
| 6 | Expanded charts with an empty month | 6. (b). New S9-R9: a dashed line joins the months either side of an empty month, as these charts already draw in production. A gap applies only to the trend line on a tile. |
| 7 | Report link on technician tiles with no data | 7. (a). No PRD change: every tile keeps its report link with or without data (S10-R1, S4-R18). The drawing in row 15 is wrong; test against the PRD. |
| 8 | How At Risk measures revenue | 8. (a). No PRD change: S5-R15 stands, with invoice subtotals before discount and tax, minus credit memos, the same as the Revenue tile and the Sales report. The design note is out of date; test against the PRD. |
| 9 | At Risk with no customers at risk | 9. (a). S5-R9 now covers zero: "$0.00 (12mo) · 0 customers", so the line never disappears. |
| 10 | At Risk inactivity choice | 10. (a). New S5-N3: one control, the pill on the tile. The expanded table follows it and has no control of its own. The design's "Inactive for" box is out of date. |
| 11 | "Last updated" line | 11. (b). New S3-N2: no "Last updated" line or any other freshness indicator, because the figures are never behind the reports (S3-R1). The design is out of date. |
| 12 | Legend hover | 12. No average. New S9-R10: hovering a name shows that person's most recent value and its month, for example "120% · Aug 2026". The build still shows " · avg"; please log that as a bug against S9-R10. |
| 13 | Screen layout fixes | 13. (a), all eight. New S12-R6 to S12-R13, one per ticket (SV-10891, 10933, 10934, 10936, 11242, 11245, 11246, 11255), at 1536 x 864 and 100% zoom, and at phone width under 1024. SV-11255 is Ready for QA. |
| 14 | Two tidy-ups in the spec | 14. Yes to both. Section 7 now says the chart and its table hide together (S8-N1, S8-N1a). Every sv8311 link in the PRD, header and Design lines included, now points to sv490. |
| 15 | Report chart with no data | 15. (a). New S11-E2 (report pages) and S9-R11 (expanded charts): "No data for selected date range". The dashed outline is only for the trend line on a tile. |
| 16 | Expanded Revenue chart with no sales at all | 16. (a). A chart has nothing to show when no point in the range has a value, or when every point is zero, the same test the tile uses (S4-R13). So a Revenue range with no sales at all reads "No data for selected date range". A range with some sales still draws its $0.00 days as real points (S4-R11a). S9-R11 now says this. |
