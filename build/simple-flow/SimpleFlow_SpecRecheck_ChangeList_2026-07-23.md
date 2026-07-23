# Simple Flow spec-recheck — change list (2026-07-23)

> **LIVE-BUILD CHECK 2026-07-23:** 0 of 4 rows re-verified live on staging; 0 characterised-blocked on an env defect; the rest flagged **⏳ LIVE CHECK PENDING**.

4 of 184 cases need a change or a decision. The other 180 cases need no change (151 Verified, 21 Blocked-on-environment, 4 to re-verify live, 3 retired, plus 4 Create-Purchase-Orders cases deleted from TestRail and ignored per your ruling). Nothing pushed to TestRail yet.

**Legend:** Action = *Apply update* (wording/expected fix) or *Decision* (needs you/PO/dev to choose). Ticket status shows whether the driving Jira ticket is Done (live status 2026-07-23).

| Case | Area | What needs to change | Ticket | Ticket status | Action |
|---|---|---|---|---|---|
| [C29373 ](https://shopview.testrail.io/index.php?/cases/view/29373) | Accept Delivery | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: On the Accept Delivery screen the group of parts with no vendor yet appears at the TOP of the list; the product owner wanted it at the BOTTOM. Reviewed and accepted as a look-only difference (no effect on how it works) — confirm we keep it as-is and change nothing. | SV-7707 | DONE | DECISION |
| [C29375 ](https://shopview.testrail.io/index.php?/cases/view/29375) | Accept Delivery | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: Same Accept-Delivery point as C29373 — the position of the no-vendor group and the multi-vendor indicator. Accepted as look-only — confirm keep as-is, no case change. | SV-7707 | DONE | DECISION |
| [C29396 ](https://shopview.testrail.io/index.php?/cases/view/29396) | Review before completion | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: When 'require review before completion' is on, signing off finishes the work order straight away with no separate 'Reviewed' holding step. Whether invoicing should be blocked until a review happens is a product decision (Milos). Don't finalise this case until that review ticket ships. | SV-7870 | NOT DONE (Blocked) | DECISION |
| [C29404 ](https://shopview.testrail.io/index.php?/cases/view/29404) | Completion screen — Close/Cancel | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: The 'Close' vs 'Cancel' confirmation pop-up on the completion screens isn't finalised in the design yet, so the exact behaviour isn't defined. Needs Milos to confirm what Close and Cancel should do before the case can state a result. | SV-7710 | NOT DONE (Blocked) | DECISION |

## Highlight — cases waiting on a ticket that is NOT yet done (2)

| Case | Ticket | Ticket status | Why it's blocked |
|---|---|---|---|
| [C29396](https://shopview.testrail.io/index.php?/cases/view/29396) | SV-7870 | NOT DONE (Blocked) | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: When 'require review before completion' is on, signing off finishes the work order straight away with no separate 'Reviewed' holding step. Whether invoicing should be blocked until a review happens is a product decision (Milos). Don't finalise this case until that review ticket ships. |
| [C29404](https://shopview.testrail.io/index.php?/cases/view/29404) | SV-7710 | NOT DONE (Blocked) | ⏳ LIVE CHECK PENDING (2026-07-23 run: not yet observed) — prior finding: The 'Close' vs 'Cancel' confirmation pop-up on the completion screens isn't finalised in the design yet, so the exact behaviour isn't defined. Needs Milos to confirm what Close and Cancel should do before the case can state a result. |
