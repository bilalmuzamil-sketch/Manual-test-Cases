# Note for Vladimir: automated WO Board cases whose expected results changed (16 Oct 2026)

For the QA lead to send. Not posted anywhere.

Hi Vladimir, two of the WO Board cases flagged Automated now expect different behaviour, after Chris Ward's answers and PRD version 54
(Confluence 845185030, 15 Oct 2026). Your automated tests for them may need the same change.

| Case | What changed in the expected results |
|---|---|
| [C96929](https://shopview.testrail.io/index.php?/cases/view/96929) Before anyone reorders them, a group's work orders follow List's default sort | Ties now follow the List exactly: work orders for the same customer are ordered by start date, newest first (S2-R6). The case adds a fourth work order for the same customer to check this. |
| [C96978](https://shopview.testrail.io/index.php?/cases/view/96978) Fields to display offers the 13 optional fields with their usual values | Clocked In now shows the first technician's full name, then +N, as List does (was: first name only) (S5-R11). Estimated hours follow the work order page (S5-R11a). |

Five more automated cases were rewritten to the new layout with their expected results unchanged (only the quotes were refreshed):
C97007, C368144, C368145, C368214, C97011. Nothing to change in automation for those.
