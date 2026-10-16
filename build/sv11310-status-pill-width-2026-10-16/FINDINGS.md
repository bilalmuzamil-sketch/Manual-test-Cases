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

## QA lead answers (16 Oct 2026)
- Screen recording: **yes**; voice-over: **yes** (asked second, after the recording yes).
- Technical details section: **no**.
- Column-follows-content behaviour: *"Pass it but create a separate bug ticket for production and do mention in the ticket comment that the other issue found (reproducible on production) has been reported separately as a bug"*.

## Separate bug filed: [SV-11464](https://shopview.atlassian.net/browse/SV-11464)
"Work Orders List: status pill width changes with the statuses on screen" — Bug, Medium, Product Area Work Orders, label board-tech-view, parent epic SV-10043, Relates SV-11310. Duplicate search (search/jql: "status pill", "pill width", "same width", summary "pills", "status badge"+"width") found only SV-11310 / SV-11318 (Tech View) / SV-11405 (Board View) — none cover it. Reproduced on production by clicking (top menu Work Orders → All 113.98 / Work Orders 113.98 / Estimates 67.00 / Completed 71.52 / search S2-691 113.98 / search S2-597 58.45), build v26.40.19-d2441a9. Image attachment 62472 (`ev/01-pill-width-changes-by-tab-production-hd.png`). Read back: media type file 1276x534, steps 1-5, table 7 rows, Relates link, no jargon.

## Recording
`ev/sv11310-status-pills-staging-recording-voiceover.mp4` — 21.6 s, 1440 px window, en-US-AriaNeural +10%, 4 lines (5.42/4.46/3.19/5.42 s). Captions read live: S2-33363 Ready For Review 113.98 px / column 124 px; S2-363 13 pills, 5 statuses, all 113.98 px. Full decode OK; caption on frame 0; speech at every step (-19.9 / -20.6 / -20.2 / -21.6 dB). Grid `voiceover/grid.png`.

## Pre-post gate (14:32 CDT)
- Build markers re-read: staging v26.40.19-1493c63 (18:32:36 GMT, etag 9bc39e81…) and production v26.40.19-d2441a9 (09:17:45 GMT) — unchanged from the measurements.
- SV-11310 re-read: TESTING STAGE, Slavcho Mitrov, Medium, no comments.
- Voice scan of the comment text: clean. No technical section (QA lead said no).
- Every figure in the comment traces to `data/` (mix/sr/mx/meas json).

## Posted
SV-11310 comment **78903** (14:33 CDT): attachments 62473 (before/after), 62474 (each status), 62475 (recording). Read back via v3: green panel first; media in order png, png, mp4 (all `file`); table 8 rows (header + 7); 4 numbered steps; SV-11464 link present.

## Learning check
One new recipe recorded in the playbook (§AK area is unrelated; added under the Work Orders list notes): a saved **Status sort** on a staging account groups the list so most screens show one status — use a **search that returns mixed statuses** (e.g. a partial work-order number) to get a mixed screen; and a pill/badge "same width" check must compare **per screen and across tabs**, because the Work Orders table column auto-sizes to the widest content rendered. Nothing else new.

## Re-check after the mid-afternoon redeploy (v26.40.19-754919e, 20:22 GMT)
S2-363 mixed screen: 5 statuses all 113.98 px; S2-1650: 3 statuses all 67.09 px; single searches S2-33363 113.98 / S2-4802 58.45 / S2-33121 67.00 — identical to production and to 1493c63. PRD v63: S6-R2a / S2-R22 unchanged. Comment 78903 still holds; not edited.

## SV-11464 vs the spec (raise with QA lead)
PRD v62/v63 S6-R2a: "List's status pill is unchanged: for the same work orders on the same page, every List pill is the same width and height as in production, including production's matching widths down the column"; S2-R22: "With Ready for Review on the page that is about the design's 132px; with only short statuses it is narrower." Change log v53 (Chris, 15 Oct): "we cannot break what people currently have." → SV-11464 (filed on the QA lead's instruction) asks for the behaviour the spec keeps on purpose. Not changed or closed by us — QA lead's decision.
