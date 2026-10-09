# Part Lifecycle — Chris Ward's answers (question sheet of 9 Oct 2026)

Source: Google Sheet "Part Lifecycle – Questions for Chris Ward (9 Oct 2026)", https://docs.google.com/spreadsheets/d/1qVNQ2RtjBUJP7hor79Pjo9Y5mKmYaGM55W3rLgkme7k/edit — "Your answer" column, read 9 Oct 2026 (CSV export). Verbatim.
The sheet now holds only the "For Chris (product)" tab; the developers tab and the QA internal tab are no longer in the file (internal mapping kept in `questions-2026-10-09/spec.json`).

| # | Topic | Chris's answer (verbatim) |
|---|---|---|
| 1 | Jira stories | A) The PRD wins. The stories will be brought in line. |
| 2 | Design screens | A) The PRD is right on all five. The design will be updated. |
| 3 | Inventory list column name | A) Total Qty. This update doesn't change it: production already says Total Qty (shortened by SV-10027 on 28 Sep). The design's "before" screen is older than that. |
| 4 | Part number that already exists | A) The active part's number (FF-5507). Added to the PRD (S7-N5a). |
| 5 | Description warning | A) Yes, count inactive parts too, same as part numbers. Added to S13-R13. |
| 6 | Vendor field | B) None. Vendor always shows. Only the Inventory list opens this window, and it never hides Vendor. S13-R4a updated. |
| 7 | Canned job warning | B) The part's own number (FF-5507), as it shows on the Inactive tab. New S9-R10b. |
| 8 | Library entry deleted in another tab | B) "Part Library entry not found." New S11-E4. |
| 9 | Bulk change message | A) "2 parts updated." Cores aren't counted. New S10-R12a. |
| 10 | Supply filter | A) All. That's what the Supply filter says today; "All categories" is the Category filter next to it. |
| 11 | Punctuation-only change | A) It saves. The duplicate check never counts the part being saved. New S7-N5c. |
| 12 | Inventory Value past dates (SV-10380) | A) Keep the saved figures for past dates. The new count of bins below zero applies from release on. Added to the PRD overview. |
| 13 | Critical Reorder list | B) It will be gone. Dashboard v1 ships first and has no Critical Reorder list. Drop those tests; S5-R14 and S9-E12 are removed from the PRD. |

Developer questions (setup facts): not answered in the file.
