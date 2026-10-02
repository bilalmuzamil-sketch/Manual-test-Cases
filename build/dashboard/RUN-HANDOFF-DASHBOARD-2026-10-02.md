# HANDOFF → RUN SESSION — Dashboard (54 manual cases)
### Execute on QA branch **sv490.qa.shopview.com/dashboard** (build `v26.39.1-09be696`), record results. 2026-10-02.

**You are the run session.** The 54 manual cases (group **12166 "Dashboard (Sep 2026)"**) are build-verified on
sv490: runnable, render `fr-view`, stamped *"Last checked against build v26.39.1-09be696 on 10/2/2026."*,
**AUTOMATION: READY**. Mark Passed / Failed / Blocked.

- **Scope of this hand-off: 54 ours MANUAL cases** (created_by=3), 14 sections (S1–S12 + NF + DATA).
- **NOT in this hand-off (handled per standards):**
  - **5 AUTOMATED cases HELD (Rule 71 — need the QA lead's go-ahead to change): C88594, C88609, C88612, C88617, C88623.**
  - **3 Vladimir's cases (user 1) — hands-off, untouched (Rule 38): C137997, C137998, C137999.**
- **Env:** sv490.qa.shopview.com / sv490api. Disposable (Rule 6/107). Access: 3 cookies → /tmp/cln/sv490-cookies.json
  (ask QA lead for fresh set). Boot `qa-branch-boot.mjs sv490 /dashboard admin`.

## Build glossary (confirmed on sv490) — full map in NAVIGATION-MAP.md / OBSERVED-UI-LABELS-sv490.md
- Top nav adds **"Dashboard"** (/dashboard).
- KPI hero tiles: "Revenue" · "Billing Efficiency" · "Technician Efficiency" · "Technician Utilization".
- Count tiles: "Sales by Customer" · "At Risk Customers".
- Per tile: a date-range dropdown ("Today / This Week / Last Week / This Month / Last Month / This Quarter /
  This Year / Last Year / Last 12 Months / 120 Days / Custom"), an expand/open icon, and "View details"
  (expands the tile inline into a chart; empty state "No data for selected date range").
- Drill-in: the tile's open icon goes to the matching **Reports** page (Filter / Export / Date / chart).

## 🔎 Confirm LIVE when you run (core confirmed; these deeper bits were not fully raised via automation)
- The report-page drill-in specifics (S10/S11), chart filters (S8), chart hover/behavior (S9), and any
  "expand all"/"collapse all"/"View Report"/"New Dashboard" controls a case names. The tiles, date ranges,
  inline expand and drill-in entry ARE confirmed.

## Run + result writes — needs the QA lead's go-ahead (Rule 6)
No manual run exists. Ask the QA lead to authorise a run over these 54, then record with push_results_to_run.py.

## The 54 manual cases
| C-id | Section | Title |
|---|---|---|
| C88595 | S1 | Access gates and server-side enforcement |
| C88596 | S1 | Access negatives - missing permission or missing feature |
| C88597 | S1 | The shop logo is inert branding, not navigation |
| C88598 | S1 | Workplace edge cases - switching and none selected |
| C88599 | S2 | The fixed tile set and order |
| C88600 | S2 | No customization controls exist |
| C88601 | S3 | Report parity - every tile figure equals its report |
| C88602 | S3 | Measure formulas |
| C88603 | S3 | Void exclusion, negative revenue, and the n/a state |
| C88604 | S4 | KPI tile anatomy; Revenue and Billing Efficiency lines |
| C88605 | S4 | Technician Efficiency and Utilization headlines and lines |
| C88606 | S4 | The KPI sparkline and how it buckets the range |
| C88607 | S4 | KPI negatives and extreme values |
| C88608 | S5 | The Sales by Customer tile |
| C88610 | S5 | At Risk sparkline, remembered window, and the definition |
| C88611 | S5 | Count-tile negatives and edge cases |
| C88613 | S6 | The At Risk detail table - ordering and the 500-row cap |
| C88614 | S6 | One detail open at a time, and controls that do not expand |
| C88615 | S6 | Loading, per-tile failure, and browser-stored choices |
| C88616 | S6 | Expansion negatives and small-screen behaviour |
| C88618 | S7 | Default ranges, not remembered, and partial ranges |
| C88619 | S8 | Technician and advisor chart filters |
| C88620 | S8 | Deselecting every technician hides the chart |
| C88621 | S9 | Value-axis scaling and the 200% cap |
| C88622 | S9 | Billing Efficiency lines, ELR on hover, and no extra serie |
| C88624 | S11 | Embedded chart on the report page - toggle, filters, parit |
| C88625 | S11 | The embedded chart has no controls of its own |
| C88626 | S12 | Visual conformance - layout, themes and small-screen stack |
| C88627 | S6 | Expanded KPI detail tables show the design's columns |
| C88628 | S6 | Expanded count detail tables show the design's columns |
| C88629 | S12 | New Dashboard visual conformance - cards, panel, pill, ico |
| C88630 | S5 | At Risk line revenue aggregates all at-risk customers, not |
| C88631 | NF | Dashboard performance budget and per-tile circuit breaker |
| C88632 | NF | Sales and Advisor Analysis report corrections ship with a  |
| C88633 | DATA | Revenue - exact value to the cent, and equals the Sales re |
| C88634 | DATA | Revenue - credit memos and a true negative figure |
| C88635 | DATA | Revenue - voided/no-company invoices excluded, matching th |
| C88636 | DATA | Revenue - Parts/Labor whole-number split and no-split fall |
| C88637 | DATA | Billing Efficiency - exact to 2dp, equals Advisor Analysis |
| C88638 | DATA | Billing Efficiency - total-over-total, not average of advi |
| C88639 | DATA | Technician Efficiency - exact to 2dp, equals the report |
| C88640 | DATA | Technician Efficiency - per-line tech time split by clocke |
| C88641 | DATA | Technician Utilization - exact to 2dp, equals the report |
| C88642 | DATA | Sales by Customer - distinct count, voids excluded, no-com |
| C88643 | DATA | At Risk count - window boundary, OR test, revenue>$0, void |
| C88644 | DATA | At Risk - day boundary in the workplace timezone |
| C88645 | DATA | At Risk - twelve sparkline points recomputed from current  |
| C88646 | DATA | Ratio measures - a zero denominator reads 'n/a', never 0.0 |
| C88647 | DATA | Sparkline - one point per bucket, correct size at each bou |
| C88648 | DATA | Parity holds at every one of the nine date ranges |
| C88649 | DATA | Filtered parity - a filtered chart equals the report filte |
| C88650 | DATA | Internal consistency - headline, sparkline and table recon |
| C88651 | DATA | Workplace scoping - every figure is for the selected workp |
| C88652 | DATA | No stale window - the tile equals the report right after a |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | QA lead go-ahead to create the manual run over these 54, then record Passed/Failed/Blocked. |
| 2 | The 5 automated cases are HELD (Rule 71) — the QA lead decides whether to build-verify them; alert Vlad if changed. |
| 3 | Vladimir's 3 cases are untouched (Rule 38). |

**Standing holds:** no Jira/external artefact without the QA lead; automated cases never changed without him;
Vladimir's never; run creation + result writes need his go-ahead; secrets never committed; QA branch disposable.
