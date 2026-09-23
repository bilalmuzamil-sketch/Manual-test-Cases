# SV-10322 — ORIGINAL description backup (taken 2026-09-23 before PO-friendly re-edit)

- Summary: Reports – a first visit writes materialised default filters into the URL, enumerating every customer id
- Type: Bug | Status: Ready to Fix | Priority: Medium
- Reporter: Vladimir Tomovic
- Links: [('Relates', 'SV-9984')]

---

## Original description (verbatim, Jira wiki markup)

h3. Preconditions

* Org / account: freshly-minted E2E org on staging
* Role / user: Admin
* Data needed: a shop with several customers (13 in the failing run)
* State: *no remembered view* — {{localStorage}} cleared before entry

h3. Steps to reproduce

# Clear the remembered view for Sales By Customer
# Open *Reports → Sales By Customer*
# Read the address bar

h3. Expected result

*No filter params at all.* A default is encoded by _omitting_ it — that is the rule the app's own code states and implements:

* {{useFilterUrlSync.mirroredValues()}} returns {{[]}} for any key sitting at its default, and {{buildQuery}} skips empty values.
* {{SalesByCustomerReport.vue:732}} declares {{emptyMeansAll: true}} on {{customerIds}}, with a comment warning that without it _"the tick enumerates the ids the panel happens to have loaded"_.
* {{MultipleToggleSelect.vue:336}} honours it — the All row emits {{[]}}.

h3. Actual result

The URL comes back carrying materialised defaults, including *every customer id enumerated*:

{noformat}Expected: Object {}
Received: Object {
  "customerIds": Array [ 13 ids … ],
  …15 lines total
}{noformat}

The "all customers" selection is mirrored as an explicit id list rather than an absent key.

*Reproduction rate:* every attempt on the 2026-09-21 nightly; 0 occurrences on the 09-16, 09-17 and 09-20 nightlies.

h3. Environment

* Environment: staging
* URL: https://app.staging.shopview.com/reports
* Build / version: develop @ {{1ad5ade8f4}}
* Browser + OS: Chromium (Playwright 1.62.1), headless, Ubuntu CI runner
* Date & time of reproduction: nightly run 2026-09-21 (UTC), run 35662096972

h3. Evidence

Five E2E cases assert this contract directly and all five fail:

||Case||Report||Message||
|C30178|Sales By Customer|a first visit must leave the URL unnarrowed|
|C30174|Sales By Customer|a fresh entry must carry no filter params|
|C30177|Sales By Customer|SBC must re-enter on its own defaults|
|C30180|Sales By Customer|all-customers must never be mirrored as an enumerated page of ids|
|C30274|Sales By Representative|a first visit must leave the URL unnarrowed|

Specs: {{e2e/tests/ui/reporting/sales-by-customer.spec.ts}}, {{sales-by-representative.spec.ts}}.

h3. Why this matters beyond the tests

Two consequences the code comments already predict:

# *A pasted link silently pins someone else's filters.* A fresh entry that writes materialised defaults turns every URL into a share link pinning This Month, and now a customer list, for whoever receives it.
# *It can under-report on a large shop.* The customer typeahead is capped at 50 server-side ({{DbalSalesByCustomerFetcher::CUSTOMER_SEARCH_LIMIT}}). Enumerating "the ids the panel happens to have loaded" means a shop with more than 50 customers gets a report narrowed to those 50 *while the chip still reads "All customers"* — wrong numbers presented as complete. That is the exact hazard {{emptyMeansAll}} was introduced to prevent.

There is also a request-line length concern: *C43570* — _"Select all / Clear all filter encoding does not overflow the request line"_ — fails in the same run.

h3. QA note

*Regression, and the window is narrow.* The reporting shard went from 1 failure on 09-20 to 21 on 09-21. Two feature branches landed in between and both are about exactly this area: *SV-9984* ("keep report filters on the URL, not the user's account") and *SV-10032* ("carry the in-report Location chip across a top-right location switch"). SV-9984 is the likelier origin — it is the change that moved filters onto the URL.

The E2E specs were updated as part of SV-9984 ({{9a7f1b8e9a}}, {{f932e591da}}), so this is *not* stale tests meeting new behaviour: the specs encode the new intended contract and the app does not meet it.

*Scope caveat, stated honestly:* 5 of the 21 reporting failures assert this contract directly. Several others in the same run (empty report bodies, CSV/PDF export row counts, drill-through gating) are plausibly downstream of the same wrong filter state, but I have not proven that and they may be separate. Treat the five above as the confirmed set.

*Severity:* Medium. *Regression:* yes — last good 2026-09-20.
