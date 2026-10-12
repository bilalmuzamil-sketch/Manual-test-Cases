# Automated test cases rewritten on 12 Oct 2026 — for the automation engineer

The QA lead asked for these to be shared so the automations can be adjusted. Each was rewritten under Rule 114(d):
the test had passed only because of a ruling, so its text now says what the ruling allows, with the ruling quoted
word for word under Source. Nothing else in TestRail changed (automation flags untouched; before/after copies of
every field are in this folder as `C<id>-before.json` / `C<id>-after.json`).

| Case | Title | What changed — adjust the automation to this |
|---|---|---|
| [C154884](https://shopview.testrail.io/index.php?/cases/view/154884) | Assigned to me shows the same matching work orders in every display | Preconditions only: the Service Advisor setup step. Steps and expected result unchanged. |
| [C368135](https://shopview.testrail.io/index.php?/cases/view/368135) | Cancel or closing the clear-shifts question calls the change off | The "click outside the question" step is removed; clicking outside does NOT close the question and that is expected. Cancel, the X button and Escape must still each put the card back. The out-of-date "What you should see today" note is removed. |
| [C96977](https://shopview.testrail.io/index.php?/cases/view/96977) | Work order number, unit number and status cannot be turned off on cards | Passes if the three fields are either absent from Fields to display or listed as locked "always on". The card must still show all three with every other field turned off. |
| [C368181](https://shopview.testrail.io/index.php?/cases/view/368181) | An asset's Work Orders tab count matches its rows | Rows must be 3. A count, if shown, must equal the rows. No count passes only when production's asset Work Orders tab also shows no count (a production comparison step was added). |

All four sit in run 498: https://shopview.testrail.io/index.php?/runs/view/498

Not automated, also rewritten the same day (for completeness): C368138, C97022, C368169, C368170, C368171, C368218,
C368219, C368223, C368233, C368234, C368235, C97026, C97034; C97033 follows after its day-2 check. C96923 needed no change.
