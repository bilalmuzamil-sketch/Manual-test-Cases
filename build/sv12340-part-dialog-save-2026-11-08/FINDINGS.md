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
(part sale rows 5-7 below)
Logs: ev/prod-*-log.txt.

## Branch AFTER
Waiting for fresh `.qa.shopview.com` cookies.
