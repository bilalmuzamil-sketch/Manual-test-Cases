# Run-557 comments to add ONCE the ticket number exists (Rules 113 / 123 / 133)

Tests: C1062570 https://shopview.testrail.io/index.php?/tests/view/4667037 · C1062571 https://shopview.testrail.io/index.php?/tests/view/4667038
(run 557 https://shopview.testrail.io/index.php?/runs/view/557). Both are already Failed with the ticket held.

## How (never hand-rolled)
1. Copy `RESULTS-link-ticket.TEMPLATE.json` to `RESULTS-link-ticket.json` and replace every `SV-NNNNN` with the real key (and the status read live).
2. `python3 build/testing-tools/push_results_to_run.py --run 557 --results build/aging-reports/defects/01-open-group-loads-every-document-at-once/RESULTS-link-ticket.json --build-marker v26.45.2-6a8b89c --date "11 November 2026" --env "QA site sv11315" --allow-non-passed --screenshots yes`
   (dry run of the template passed 11 Nov: `dry-run-1111.txt`). The tool then posts, per test:
   - the same why-it-failed comment (bold failing steps 2 and 3, "Fails against:" S1-R8) with the ticket line, Defects field = the key;
   - a separate comment on top: `Follow the status here https://shopview.atlassian.net/browse/<KEY>` (Rule 123);
   - the title prefix `<KEY> - ` on both cases (Rule 133; both are ours, created_by 3, not Vladimir's).

## The ticket line that goes into each comment
`Ticket: https://shopview.atlassian.net/browse/<KEY> (status: <live status>)`
