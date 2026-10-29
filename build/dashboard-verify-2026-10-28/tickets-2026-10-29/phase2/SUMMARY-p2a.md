# Phase 2 · Worker A (p2a) · 29 Oct 2026

Saved by the coordinator from Worker A's hand-back; the harness refused the file to the worker.

Nothing was filed. The build was v26.43.2-f8698cb at the start and at the end. The worker used its own session, `/tmp/cln/p2a/sess.txt`.

## Verdicts

| Item | Verdict | Draft |
|---|---|---|
| A1 | DRAFTED | P2-A1-reports-wip-days-open-1-days.md |
| A2 | DRAFTED | P2-A2-reports-wip-receive-later-parts-not-earned.md |
| A3 | **NOT ON SCREEN**, so no draft | — |
| A4 | DRAFTED | P2-A4-reports-shop-efficiency-running-shift-left-out.md |
| A5 | DRAFTED | P2-A5-reports-payroll-timesheet-overlap-counted-twice.md |

## Details

**A1: Work In Progress shows "1 days".**
- Re-checked 00:47 UTC (5:47 AM Karachi) at Heavy Duty. The browser, process, location and the app's time-zone setting were all Asia/Karachi. The WIP request asked from 2026-10-28T19:00:00.000Z.
- S2-38105, opened 28 Oct, reads "1 days".
- Owning story: SV-8660.

**A2: a "Receive Later" part counts as Parts Remaining.**
- Re-checked 00:48 UTC, same zones.
- S2-33740 (Approved - Not Started) shows Parts Earned $0.00 and Parts Remaining $37.67. Both its part ($36.67) and its core ($1.00) are Receive Later. The server agrees: parts_remaining 3767 cents, request status received_later.
- Uses existing data. The worker did not mark a part Receive Later itself; the feature exists on screen (SV-9261, SV-10444).
- Owning story: SV-8660.

**A3: time on a deleted work order. NOT ON SCREEN.**
- There are 5 such rows at Heavy Duty from April–June. Their Work Order reads "N/A", not blank.
- On screen, Delete Work Order is blocked when time is clocked on it ("Cannot delete a work order that has labor clocked into it"; checked on S1-38220).
- The old rows came from somewhere other than the screen. Evidence: `/tmp/cln/p2a/ev/A3/` and `/tmp/cln/p2a/ev/A5d/`.

**A4: Shop Efficiency leaves out a running timesheet.**
- Re-checked 00:30–00:34 UTC (8:30–8:34 PM Toronto) at DVI Test, zones America/Toronto.
- The pictures were taken **before** the app's time-zone setting was found. Both pages ask for "Today" by name and showed Toronto's 28 Oct, so the window was right.
- Timesheet Activities, Today: Totals 4.25 = 3.56 finished + 0.69 running. Shop Efficiency, Today: 3.56.
- Owning stories: SV-2116, SV-11688.

**A5: the Payroll Timesheet export counts overlapping time twice.**
- Re-checked 00:45 UTC (DVI Test, Toronto) and 00:46 UTC (Heavy Duty, Karachi), with the app's setting on.
- **Q39 correction: Chris's question quoted wrong figures for Admin Shopview.** With the zones matched, his day is 7.70 h on 10 Sep (not 40.70) and 12.10 h on 17 Sep (not 32.34). The earlier figures came from unmatched zones.
- Haley Brown does reproduce: 28.50 h on 6 Sep, and 24.50 h on 2 Sep.
- Fresh reproduction on screen at DVI Test: a running timesheet plus an overlapping New entry. No warning appears. The export for Today reads 1.53 h; it should read 1.09.
- An overlap with a finished timesheet does warn (SV-10695 is fixed).
- Second symptom, in the developer note only: the part of a clock that runs past midnight lands on the next day. It may be linked to SV-10702.
- Owning story: SV-2071.

## Test data (DVI Test)

- Customer "ZZAUTOTEST P2A Labor": company dc07b472-b6c5-4aeb-97d3-cd13e495abc4, contact 7090d630-…, unit ZZ-P2A.
- Work order S1-38220 (a941b1ad-a5ed-4126-95c7-514861ca1bc0).
- **Kept as A5 evidence:** timesheets 0994f8d3 (7:39–8:34 PM) and 649c06cd (8:08–8:41 PM).
- **Deleted:** the running timesheet 836ddb16 (the delete answered 500, but the record is gone) and the probe ae3dde07.

## JQL run (read-only)

1. `project = SV AND created >= -365d AND (text ~ "\"days open\"" OR summary ~ "Work In Progress" OR summary ~ "WIP")`
   - 60 results, no match.
2. `project = SV AND created >= -365d AND (text ~ "\"1 days\"" OR text ~ "\"received later\"" OR text ~ "\"receive later\"" OR text ~ "\"Days Open\"")`
   - 41 results. The nearest is SV-11821 (Dashboard wording, not WIP).
3. `project = SV AND created >= -365d AND (text ~ "\"Shop Efficiency\"" OR text ~ "\"Shop Billing Efficiency\"" OR text ~ "\"Payroll Timesheet\"" OR text ~ "overlapping" OR (text ~ "\"Timesheet Activities\"" AND text ~ "deleted"))`
   - 80 results. Related but not duplicates: SV-9723, SV-10702, SV-10701, SV-10695, SV-10696, SV-9613.
4. `key in (…)` to read the summaries of the owning stories.
