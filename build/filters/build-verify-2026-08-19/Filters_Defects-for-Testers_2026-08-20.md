# Filters — Defects for Manual Testers (2026-08-20)

**Owning QA:** Ahtesham. **Defect rows:** 2. **Build:** v3.8.

Filters defects for the manual tester to review and file as Jira Story Defects (the two empty-state deviations found on v3.8).

Expected behavior comes from the documented **source** (spec / epic / PO answer), never the build (Standing Rule 57). Jira ticket creation is on hold — this sheet is for the manual QA to read and then create the Story Defects themselves.

| # | Report/Area | Title | Description | Steps to Reproduce | Expected behavior | Source | TestRail Case ID(s) | TestRail Link(s) | What needs to be done |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Work Orders list — Filters (empty state) | Empty-state message names only the filters, never the search | On the Work Orders page, when a filter and a page search are both active and nothing matches, the no-results message reads "No work orders match your filters" and never mentions the search. With a search alone and no filter set, it still says "your filters" and offers to clear filters that are not set — which is misleading. | 1. Open Work Orders at Staging Heavy Duty - 9919.<br>2. Click the Status chip and tick Invoiced (about 33 work orders remain).<br>3. Click Search in the toolbar and type zzzznomatchzzz. The list empties.<br>4. Read the message where the table was.<br>5. Repeat with a search alone and no filter set. | The no-results message mentions BOTH the current filters AND the search. When only a search is active (no filters set), the message must not claim filters are set. | Filters specification, Confluence version 19 (published 6 August 2026), S8-R3; story SV-8798; epic SV-8785. | C29607, C38897 | https://shopview.testrail.io/index.php?/cases/view/29607  https://shopview.testrail.io/index.php?/cases/view/38897 | Recommendation: CREATE NEW Story Defect (no ticket yet — this is the project's only unticketed real deviation). Run a Jira duplicate search first. Suggested shape: Story Defect · parent = owning story SV-8798 · priority Medium · link SV-8798 'relates to' · no Product Area. Verified live and reproduces on v3.8-d0e135e. |
| 2 | Work Orders list — Filters (empty state) | Empty state offers no way to clear the search, and Clear Filters also wipes the search | The empty state offers only a "Clear Filters" link; there is no separate action to clear the search from the message (the only search clear is the round x inside the toolbar search box). Clicking "Clear Filters" also removes the search word — the address bar drops the search parameter and the search box empties — so the filter and the search cannot be cleared independently. | 1. Open Work Orders at Staging Heavy Duty - 9919.<br>2. Click the Status chip and tick Invoiced.<br>3. Click Search and type zzzznomatchzzz. The list empties.<br>4. In the empty-state message, click Clear Filters.<br>5. Check the search box and the browser address bar. | The empty state includes a separate way to clear the search, and the filter and the search are each cleared independently — clearing the filters leaves the typed search word in the box and still applied. | Filters specification, Confluence version 19 (published 6 August 2026), S8-R4 and S8-R5; story SV-8798; epic SV-8785. | C29597, C29599 | https://shopview.testrail.io/index.php?/cases/view/29597  https://shopview.testrail.io/index.php?/cases/view/29599 | Recommendation: CREATE NEW Story Defect (no ticket yet). Run a Jira duplicate search first. Suggested shape: Story Defect · parent = owning story SV-8798 · priority Medium · link SV-8798 'relates to' · no Product Area. Verified live and reproduces on v3.8-d0e135e. |

## Summary

- Project: Filters
- Owning QA: Ahtesham
- Defect rows: 2
- Date: 2026-08-20

