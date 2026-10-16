# SV-11310 — Work Orders List: status pills different widths — staging retest, 16 Oct 2026

**Ticket:** [SV-11310](https://shopview.atlassian.net/browse/SV-11310) (Story Defect, parent SV-10044, TESTING STAGE, Medium, assignee Slavcho Mitrov). Filed by us 14 Oct on staging v26.40.17-ddb9ba1. No comments on the ticket at the time of testing.

**Expected (ticket):** "All status pills in the Status column are the same width." Sources quoted in the ticket: the team report ("The status pills are stretching now, they should all be the same.") and spec v48 out-of-scope line "List is unchanged" (= production behaviour).

## Builds (read live)
| Env | Build | last-modified | etag |
|---|---|---|---|
| Staging `app.staging.shopview.com` | **v26.40.19-1493c63** | Fri, 16 Oct 2026 18:32:36 GMT | W/"9bc39e812e8fd497d3d62b602834398d" |
| Production `app.shopview.com` (test org) | **v26.40.19-d2441a9** | Fri, 16 Oct 2026 09:17:45 GMT | W/"bb9ac5fcfbb160e79c9ba76ef1d5b5af" |

Window 1600 x 1000 CSS px (DPR 2), browser zoom 100%; repeated at 1280 px. List display option selected (`display_option_list`; production has no display options). Staging admin account has a saved Status sort (descending) — a per-user preference, left as it was.

## Mechanism (CSS read live)
- Pill = `div.q-badge` inside `td.cell.status`; `th.cell.status` has `width:100px` and the table is auto-layout, so the column grows to the widest pill text currently rendered.
- **Production:** the pill is `display:flex` via the component-scoped `.work-orders-top .row, .column, .flex` rule → it fills its cell → every pill = column width − 10 px.
- **Staging before fix (v26.40.17):** component re-scoped, that rule no longer reached the pill → `inline-flex`, sized to text (44.5–72.4 px, RFR widest).
- **Staging now:** new rule `td.cell.status .q-badge:not(.q-badge--floating){display:flex}` → pill fills the cell again, same as production. Floating count bubbles excluded (still sit on the top-right corner).

## Variant matrix (every cell observed)
| # | Cell | Staging | Production |
|---|---|---|---|
| 1 | Reporter's flow: search S2-33363 (Ready For Review) | 113.98 px in 124 px column | S2-691: 113.98 / 124 |
| 2 | Reporter's flow: clear search, compare rows | all visible pills 113.98 (RFR rows) | — |
| 3 | Mixed screen, many statuses | S2-363: 5 statuses, 15 pills all 113.98; S2-3336: 4 statuses all 113.98; S2-341: 4 statuses all 113.98; S2-343: 3 statuses all 80.03; S2-1650: 3 statuses all 67.09 | S2-9: **all 8 statuses**, 15 pills all 113.98 |
| 4 | Every screen while scrolling, 4 tabs (All/Estimates/Work Orders/Completed) | 100 screens, **0** with unequal pills | 49 screens, **0** with unequal pills |
| 5 | Tab with one status only | Estimates 67.00 · Completed 71.52 | Estimates 67.00 · Completed 71.52 (identical) |
| 6 | Each status searched alone @1600 | RFR 113.98 · In Progress 80.03 · Approved 72.36 · Complete 71.52 · Declined 67.09 · Estimate 67.00 · Invoiced 64.17 · Paid 58.45 | identical, all 8 |
| 7 | Each status searched alone @1280 | identical to 1600 | identical to 1600 |
| 8 | Count bubbles on the pill (red/blue) | top-right corner of the pill | same |

Staging WO numbers used: RFR S2-33363, In Progress S2-34360, Approved S2-36132, Complete S2-33334, Declined S2-16165, Estimate S2-33121, Invoiced S2-33142, Paid S2-4802. Production: S2-691, S2-917, S2-562, S2-810, S2-358, S2-958, S2-194, S2-597.

**Verdict: PASSED** — on every screen observed, every pill is the same width, and staging matches production in every cell.

## Observation (asked to QA lead, not in the comment unless he says so)
The pill width follows the column, and the column sizes to the longest status on screen — so when only short statuses are on screen (one-status tab, a search, or a stretch of a status-sorted list) all pills are narrower (e.g. Paid-only 58.45 px vs 113.98 px when a Ready For Review row is present). **Production behaves identically** (Estimates tab 67.00, Completed 71.52, single searches identical). Steps: Work Orders > Estimates tab (List) → pills 67 px; All tab → 113.98 px.

## Evidence
- `ev/sv11310-01-before-after-status-pills.png` — BEFORE (ticket picture, staging v26.40.17, 14 Oct) | AFTER staging now | PRODUCTION.
- `ev/sv11310-02-each-status-staging-vs-production.png` — 8 statuses, each searched alone, both envs.
- `data/` — raw measurements; `scripts/` — probe/measure scripts; `ev/raw-*` — unannotated screenshots.
- Nothing seeded; nothing changed on either environment.
