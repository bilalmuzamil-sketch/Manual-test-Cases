# Runnability audit — 61 live Maintenance Reminders cases

## requirement code in preconditions/steps/plain results: 0

## engineering words (API, endpoint, server, database, payload, 4xx/5xx, JSON, devtools, console, network tab): 7
- [C88613](https://shopview.testrail.io/index.php?/cases/view/88613) (dash) — The At Risk detail table's order and its 500-row limit — found: 500
- [C88612](https://shopview.testrail.io/index.php?/cases/view/88612) (dash) — View details expands each tile to its own detail — found: API
- [C88623](https://shopview.testrail.io/index.php?/cases/view/88623) (dash) — Opening a report from a Dashboard tile — found: API
- [C88630](https://shopview.testrail.io/index.php?/cases/view/88630) (dash) — At Risk revenue adds up all at-risk customers, not table rows — found: 500
- [C88594](https://shopview.testrail.io/index.php?/cases/view/88594) (dash) — Dashboard entry point, landing page and the six tiles — found: API
- [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (dash) — The At Risk Customers tile: headline, line and time window — found: API
- [C88617](https://shopview.testrail.io/index.php?/cases/view/88617) (dash) — Each tile's date range: options, updates, independent of other tiles — found: API

## plan or design jargon (Plan 1/2, TD-, FD-, NFR, artboard, board, frame, D-number): 0

## points to another case or section instead of saying what to do: 1
- [C88632](https://shopview.testrail.io/index.php?/cases/view/88632) (dash) — Sales and Advisor Analysis report fixes come with a note — found: as above

## placeholder left in text: 10
- [C88636](https://shopview.testrail.io/index.php?/cases/view/88636) (dash) — Revenue splits Parts and Labor as whole numbers, with a fallback — found: {count}, {labor}, {parts}
- [C88607](https://shopview.testrail.io/index.php?/cases/view/88607) (dash) — KPI tiles with no data and with extreme values — found: {count}
- [C88641](https://shopview.testrail.io/index.php?/cases/view/88641) (dash) — Technician Utilization is exact to 2 decimals and equals the report — found: {clocked hours}
- [C88637](https://shopview.testrail.io/index.php?/cases/view/88637) (dash) — Billing Efficiency is exact to 2 decimals and equals Advisor Analysis — found: {clocked hours}, {invoiced hours}
- [C88605](https://shopview.testrail.io/index.php?/cases/view/88605) (dash) — Technician Efficiency and Utilization tile figures — found: {clocked hours}, {invoiced tech hours}
- [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (dash) — The At Risk Customers tile: headline, line and time window — found: {count}, {customer name}, {revenue}
- [C88642](https://shopview.testrail.io/index.php?/cases/view/88642) (dash) — Sales by Customer counts each customer once, voids out, no-company grouped — found: {count}
- [C88604](https://shopview.testrail.io/index.php?/cases/view/88604) (dash) — KPI tile layout, and the Revenue and Billing Efficiency figures — found: {clocked hours}, {invoiced hours}, {labor}, {parts}
- [C88608](https://shopview.testrail.io/index.php?/cases/view/88608) (dash) — The Sales by Customer tile — found: {count}, {top customer name}
- [C88639](https://shopview.testrail.io/index.php?/cases/view/88639) (dash) — Technician Efficiency is exact to 2 decimals and equals the report — found: {clocked hours}, {invoiced tech hours}

## feature-flag wording: 0

## unclear verbs (verify the logic / ensure it works / check behaviour): 0

## no preconditions: 0

## no steps: 0

## title > 80: 0

## steps with no numbered list: 59
- [C88634](https://shopview.testrail.io/index.php?/cases/view/88634) (dash) — Revenue with credit memos and a true negative figure
- [C88613](https://shopview.testrail.io/index.php?/cases/view/88613) (dash) — The At Risk detail table's order and its 500-row limit
- [C88612](https://shopview.testrail.io/index.php?/cases/view/88612) (dash) — View details expands each tile to its own detail
- [C88636](https://shopview.testrail.io/index.php?/cases/view/88636) (dash) — Revenue splits Parts and Labor as whole numbers, with a fallback
- [C88601](https://shopview.testrail.io/index.php?/cases/view/88601) (dash) — Every tile figure equals the figure in its report
- [C88607](https://shopview.testrail.io/index.php?/cases/view/88607) (dash) — KPI tiles with no data and with extreme values
- [C88640](https://shopview.testrail.io/index.php?/cases/view/88640) (dash) — Technician Efficiency splits each line's time by clocked share
- [C88599](https://shopview.testrail.io/index.php?/cases/view/88599) (dash) — The Dashboard always shows the same tiles in the same order
- [C88611](https://shopview.testrail.io/index.php?/cases/view/88611) (dash) — Count tiles with no data and unusual cases
- [C88618](https://shopview.testrail.io/index.php?/cases/view/88618) (dash) — Default date ranges, not remembered, and part-period ranges
- [C88641](https://shopview.testrail.io/index.php?/cases/view/88641) (dash) — Technician Utilization is exact to 2 decimals and equals the report
- [C88615](https://shopview.testrail.io/index.php?/cases/view/88615) (dash) — Loading, one tile failing, and choices remembered by the browser
- [C88648](https://shopview.testrail.io/index.php?/cases/view/88648) (dash) — Each tile matches its report for all nine date ranges
- [C88623](https://shopview.testrail.io/index.php?/cases/view/88623) (dash) — Opening a report from a Dashboard tile
- [C88606](https://shopview.testrail.io/index.php?/cases/view/88606) (dash) — The KPI tile's small trend line and how it splits the date range
- [C88637](https://shopview.testrail.io/index.php?/cases/view/88637) (dash) — Billing Efficiency is exact to 2 decimals and equals Advisor Analysis
- [C88650](https://shopview.testrail.io/index.php?/cases/view/88650) (dash) — Headline, trend line and detail table all add up the same
- [C88605](https://shopview.testrail.io/index.php?/cases/view/88605) (dash) — Technician Efficiency and Utilization tile figures
- [C88645](https://shopview.testrail.io/index.php?/cases/view/88645) (dash) — At Risk trend line's twelve points are recalculated from current data
- [C88602](https://shopview.testrail.io/index.php?/cases/view/88602) (dash) — How each tile's figure is calculated
- [C88603](https://shopview.testrail.io/index.php?/cases/view/88603) (dash) — Voided invoices left out, negative revenue, and the n/a figure
- [C88616](https://shopview.testrail.io/index.php?/cases/view/88616) (dash) — Expanding tiles on a small screen and when it can't expand
- [C88646](https://shopview.testrail.io/index.php?/cases/view/88646) (dash) — A ratio with nothing to divide by reads n/a, never 0.00%
- [C88649](https://shopview.testrail.io/index.php?/cases/view/88649) (dash) — A filtered chart equals the report with the same filter
- [C88652](https://shopview.testrail.io/index.php?/cases/view/88652) (dash) — A tile matches its report straight after a change
- [C88620](https://shopview.testrail.io/index.php?/cases/view/88620) (dash) — Deselecting every technician hides the chart
- [C88630](https://shopview.testrail.io/index.php?/cases/view/88630) (dash) — At Risk revenue adds up all at-risk customers, not table rows
- [C88629](https://shopview.testrail.io/index.php?/cases/view/88629) (dash) — New Dashboard look: cards, panel, pill, icons and themes
- [C88628](https://shopview.testrail.io/index.php?/cases/view/88628) (dash) — Expanded count detail tables show the design's columns
- [C88594](https://shopview.testrail.io/index.php?/cases/view/88594) (dash) — Dashboard entry point, landing page and the six tiles
- [C88614](https://shopview.testrail.io/index.php?/cases/view/88614) (dash) — Only one detail opens at a time, some controls don't expand a tile
- [C88625](https://shopview.testrail.io/index.php?/cases/view/88625) (dash) — The embedded chart has no controls of its own
- [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (dash) — The At Risk Customers tile: headline, line and time window
- [C88598](https://shopview.testrail.io/index.php?/cases/view/88598) (dash) — Switching location and having no location selected on the Dashboard
- [C88610](https://shopview.testrail.io/index.php?/cases/view/88610) (dash) — At Risk trend line, remembered window, and what counts as at risk
- [C88596](https://shopview.testrail.io/index.php?/cases/view/88596) (dash) — Without the Reports permission the Dashboard is not available
- [C88617](https://shopview.testrail.io/index.php?/cases/view/88617) (dash) — Each tile's date range: options, updates, independent of other tiles
- [C88632](https://shopview.testrail.io/index.php?/cases/view/88632) (dash) — Sales and Advisor Analysis report fixes come with a note
- [C88642](https://shopview.testrail.io/index.php?/cases/view/88642) (dash) — Sales by Customer counts each customer once, voids out, no-company grouped
- [C88651](https://shopview.testrail.io/index.php?/cases/view/88651) (dash) — Every figure is for the selected location only
- [C88597](https://shopview.testrail.io/index.php?/cases/view/88597) (dash) — The shop logo on the Dashboard is not a link
- [C88604](https://shopview.testrail.io/index.php?/cases/view/88604) (dash) — KPI tile layout, and the Revenue and Billing Efficiency figures
- [C88638](https://shopview.testrail.io/index.php?/cases/view/88638) (dash) — Billing Efficiency is total over total, not an average of advisors
- [C88627](https://shopview.testrail.io/index.php?/cases/view/88627) (dash) — Expanded KPI detail tables show the design's columns
- [C88635](https://shopview.testrail.io/index.php?/cases/view/88635) (dash) — Revenue leaves out voided and no-company invoices, like the report
- [C88626](https://shopview.testrail.io/index.php?/cases/view/88626) (dash) — Dashboard layout, light and dark themes, and stacking on small screens
- [C88600](https://shopview.testrail.io/index.php?/cases/view/88600) (dash) — The Dashboard has no settings to customise it
- [C88647](https://shopview.testrail.io/index.php?/cases/view/88647) (dash) — The trend line has one point per period, correct at each edge
- [C88624](https://shopview.testrail.io/index.php?/cases/view/88624) (dash) — The chart on the report page: show/hide, filters, matches the Dashboard
- [C204097](https://shopview.testrail.io/index.php?/cases/view/204097) (dash) — Chart axis starts at 0, and extends below 0 only for negative values
- [C88643](https://shopview.testrail.io/index.php?/cases/view/88643) (dash) — At Risk count: window edge, either rule, revenue above $0, voids out
- [C204098](https://shopview.testrail.io/index.php?/cases/view/204098) (dash) — Show/Hide-chart control sits on the report filter row
- [C88622](https://shopview.testrail.io/index.php?/cases/view/88622) (dash) — Billing Efficiency lines, labor rate on hover, and no extra lines
- [C88633](https://shopview.testrail.io/index.php?/cases/view/88633) (dash) — Revenue is exact to the cent and equals the Sales report
- [C88621](https://shopview.testrail.io/index.php?/cases/view/88621) (dash) — Chart scale and the 200% limit
- [C88644](https://shopview.testrail.io/index.php?/cases/view/88644) (dash) — At Risk day edge follows the location's time zone
- [C88619](https://shopview.testrail.io/index.php?/cases/view/88619) (dash) — Technician and advisor chart filters
- [C88608](https://shopview.testrail.io/index.php?/cases/view/88608) (dash) — The Sales by Customer tile
- [C88639](https://shopview.testrail.io/index.php?/cases/view/88639) (dash) — Technician Efficiency is exact to 2 decimals and equals the report

## very long step (>350 chars): 0

## asks the tester to record wording (not judge): 0

## says part cannot be checked by hand: 0

## plain results missing: 0
