# SV-12340 — Part create/edit actions finish before save and leak handled API failures (8 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12340 (Bug, TESTING QA, no assignee, labels FE/claude-fix-jira/sentry-sync, no QA assignee, no Powertools plan). QA branch https://sv12340.qa.shopview.com. PR 4226. Sentry SHOPVIEW-APP-40T (make-request) / 40W (change-request).
Mode: Board-2 defaults.

## Test-only technique (disclosed per Rule 108)
No screen input produced a rejected part save on production (quantity above stock is allowed; the dialog always sends matching bin totals),
so — as the ticket's own reproduction says — the reply is controlled in the test browser only: MODE=delay holds the real reply back 5 s;
MODE=fail replaces it with a standard rejection `400 {"errors":[{"error":"ZZ test-only rejection"}]}`. Not a ShopView feature; users cannot do this.

## Production BEFORE — v26.45.2-132dcb4
| # | Dialog / button | Reply | Dialog | Draft | Error shown | Uncaught "Request failed with status code 400" |
|---|---|---|---|---|---|---|
| 1 | Work order New Part Request, Save Part | held 5 s, then real 201 | stayed open with Save loading until the reply, then closed | n/a | n/a | none |
| 2 | Work order New Part Request, Save Part | 400 (test-only) | stayed open | kept | yes | **YES** |
| 3 | Work order Edit part, Save Part | 400 (test-only) | stayed open | kept (sell 181) | yes | **YES** |
| 4 | Part sale, Save & Add Part | held 5 s, then real 201 | stayed open, loading until reply, then form cleared for the next part | cleared after success | n/a | none |
| 5 | Part sale, Save & Close | held 5 s, then real 201 | stayed open, loading until reply, then closed | n/a | n/a | none |
| 6 | Part sale, Save & Add Part | 400 (test-only) | stayed open | kept | yes | **YES** |
| 7 | Part sale, Save & Close | 400 (test-only) | stayed open | kept | yes | **YES** |
Summary: on production the dialogs already wait for the save before closing (rows 1, 4, 5); the defect visible on screen-level is the
uncaught error on every rejected save (rows 2, 3, 6, 7) — 4 of 4.
Logs: ev/prod-*-log.txt.

## Branch AFTER — sv12340 v26.45.2-8a3ce52 (last-modified Sat 07 Nov 2026 14:34:38 GMT), 9 Nov 2026
S2-15658 (part 84-2005 CONNECTOR, bin A2CD), edit part GREASETUBE 9f2ec1aa, part sale P2-246 (196d3947). Log /tmp/s12340-branch.log -> ev/branch-*-log.txt.
| # | Row | Result |
|---|---|---|
| 1 | WO Save Part, held 5 s | waited (loading), closed after real 201, part added | 
| 2 | WO Save Part, test 400 | open, draft kept, toast once, 0 uncaught, nothing added |
| 3 | WO edit Save Part, test 400 | open, price 181 kept, 0 uncaught |
| 4 | PS Save & Add Part, held | waited, form cleared for next part, added |
| 5 | PS Save & Close, held | waited, closed, added |
| 6/7 | PS Save & Add / Save & Close, test 400 | open, kept, toast, 0 uncaught |
| 8 | Bin Amount blank | "Amount must be greater than or equal to 0", 0 save requests (production same) |
| 9 | test 500 HTML | "Ooooops! An error occurred", kept, 0 uncaught (production: uncaught "status code 500") |
| 10 | Edit real save (182) | closed after 200 |
Sell price blank: saves with "Sell price is lower than part cost" on both builds (unchanged).
Posted comment **80473** PASSED (10 rows, picture ev/jira/01-refused-save-prod-vs-branch.png, test-only technique disclosed). Gate: marker last-modified unchanged; ticket TESTING QA 0 comments. QAcomplete + QA assignee Bilal + QA Complete.
