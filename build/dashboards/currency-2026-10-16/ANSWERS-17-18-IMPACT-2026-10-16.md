# Dashboard: what Chris Ward's answers 17 and 18 (and PRD v50) change for our cases (16 Oct 2026)

Read-only. Nothing written to TestRail, Jira, Confluence or the sheet.

## Sources read now
- PO sheet https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit, tab "Questions for Chris", rows 1-23, read in full. Answers 1-16 were handled on 14 Oct (`../currency-2026-10-14/PO-ANSWERS-CHRIS-WARD-2026-10-14.md`); 17 and 18 are new.
- PRD Confluence 788430850 is now **v50** (16 Oct 2026 14:55 UTC, Chris Ward). Our last copy was v48. Saved verbatim: `CONFLUENCE-788430850-v50-2026-10-16.md` (55,351 chars, read 100% by script).
  Diff `prd_diff_v48_v50.py` → `PRD-DIFF-v48-vs-v50.json`: 167 codes both sides, 0 added, 0 removed, **2 reworded (S4-R3 in v50, S5-R3 in v49)**, 165 identical. All other line differences are italic markup only, plus two Change Log rows.
- Release notes 931069964 (v7) and 928121200 (v6): unchanged since 14 Oct.
- TestRail group 12166: 124 live cases, snapshot `snapshots-live/` (read only). User 1 = Vladimir Tomovic, 2 = Nebojsa Glavinic, 3 = us.

## Answer 17: At Risk days choice on a new visit — no change
Chris: "(a). Remembered, as S5-R14 says. The caption on the design's first board is out of date. No PRD change."
Our cases already expect the window to be remembered: C88610, C88615. No case changes; no run is affected.

## Answer 18: Sales by Customer with no customers — behaviour changed (S5-R3, PRD v49)
New S5-R3 sentence: "With no customer in the range it reads “Top: None”, so the line never disappears."
| Case | Last edited by | Effect on a run if left as is | Update needed? |
|---|---|---|---|
| C351714 https://shopview.testrail.io/index.php?/cases/view/351714 | Nebojsa (atm 4) | Step 2 says the design shows "no line on Sales by Customer" and asks the tester to write down what they see. A correct build ("Top: None") can be judged wrongly as a mismatch, and a wrong build (no line) passes. Already flagged on 14 Oct for the At Risk zero wording (S5-R9). | **Yes** |
| C88611 https://shopview.testrail.io/index.php?/cases/view/88611 | Nebojsa (Automated) | Checks only the "0 customers" headline, not the line. Passes either way; never fails a correct build. | No (could gain a line check) |
| C88608 https://shopview.testrail.io/index.php?/cases/view/88608 | Nebojsa (Automated) | Has customers; old S5-R3 quote is still word-for-word inside the new rule. | No |

## Not one of the sheet answers, but also changed today: Revenue split (S4-R3, PRD v50, Chris's ruling on Ayesha's question)
New: "Parts {parts}% · Labor {labor}% · Other {other}%". Labor is labor sales only; Other is shop supplies, fees and other lines; the three round to 100; "· Other" is left off when it rounds to 0%.
Every case that checks the split uses data with no shop supplies and no fees, so Other is 0% and the line reads the same as before:
| Case | Last edited by | Run effect | Update needed? |
|---|---|---|---|
| C88604 https://shopview.testrail.io/index.php?/cases/view/88604 | Nebojsa (Automated) | "Parts 41% · Labor 59%" unchanged (Shop Supplies Charge 0 %). Its S4-R3 quote is no longer the spec's words. | Behaviour: no. Quote: yes (Rule 113) |
| C88636 https://shopview.testrail.io/index.php?/cases/view/88636 | us (atm 4) | "Parts 33% · Labor 67%" unchanged (Default Shop Supplies 0). Its quote is out of date, and its "if shop supplies appear, mark Blocked, the spec does not say" line is now wrong. Only reachable if the data is set up wrongly. | Behaviour: no. Quote and Blocked line: yes |
| C88602 https://shopview.testrail.io/index.php?/cases/view/88602 | us (atm 4) | Same Dash Shop data, "Parts 41% · Labor 59%" unchanged. | No |
| C351705 https://shopview.testrail.io/index.php?/cases/view/351705 | us (atm 4) | "Parts 0% · Labor 100%", labor only, $100.00 revenue. Unchanged. | No |
| C351736 https://shopview.testrail.io/index.php?/cases/view/351736 | us | Uses "Parts 39% · Labor 61%" only as an example of text to look at. | No |
Gap: no case checks "Other" (shop supplies or fees), the round-to-100 rule, or "· Other" being left off at 0%. That needs a new case, not a change.
Vladimir's 10 cases: none checks the Top line or the Revenue split.

## Build note
The design's row-15 build screenshot (14 Oct) shows no "Top:" line at zero, and Ayesha's question shows the build still puts supplies into Labor. A case updated to the new rules is expected to fail on today's build until the developers ship the change.

## Applied 16 Oct 2026 (QA lead: "1. Yes … 2. YES … 3. YES … add that to the test run too")
Tool `apply_v50.py` (edit lock, verbatim-quote gate against PRD v50, marker last), logs in `applied/`. PRD re-checked just before the write: still v50.
| Case | What changed | Read-back | Run 525 test |
|---|---|---|---|
| C351714 https://shopview.testrail.io/index.php?/cases/view/351714 | Step 2 now expects "Top: None" and "$0.00 (12mo) · 0 customers"; S5-R3 and S5-R9 quoted; PRD v50 + answers 9 and 18 in Source; divergence sentence (design row 15 shows no line); build stamp marked "before the expected results changed" | 200, fields OK, nothing else changed, automation status kept | https://shopview.testrail.io/index.php?/tests/view/3742900 (Passed, from the old wording) |
| C88604 https://shopview.testrail.io/index.php?/cases/view/88604 (Automated) | S4-R3 quote refreshed to v50; result says there is no "Other" share; Source v42 → v50 | same | https://shopview.testrail.io/index.php?/tests/view/3698721 (Passed, old wording) |
| C88636 https://shopview.testrail.io/index.php?/cases/view/88636 | S4-R3 quote refreshed; "spec does not say" Blocked line replaced by "setup not done" if supplies appear; no "Other" share; Source v48 → v50 | same | https://shopview.testrail.io/index.php?/tests/view/3698753 (Passed, old wording) |
| C614718 https://shopview.testrail.io/index.php?/cases/view/614718 NEW, section 12180 | Revenue tile shows shop supplies as an Other share; two-audience shape; setup file `build/dashboards/setup/DASHBOARD-SETUP-FILE.md`; AUTOMATION: HOLD - not yet build-verified | 200, fields OK, section OK | https://shopview.testrail.io/index.php?/tests/view/4006698 (Untested) |
Run 525: 118 → 119 tests, union only, nothing dropped, no test id or status changed. All other 121 dashboard cases unchanged (updated_on re-read).
