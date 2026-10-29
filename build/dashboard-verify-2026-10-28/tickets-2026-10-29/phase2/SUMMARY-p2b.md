# Phase 2 · Worker B (p2b) · 29 Oct 2026

Saved by the coordinator from Worker B's hand-back; the harness would not let the worker save this file.

Nothing was filed, nothing was written to TestRail, and nothing was committed.

## Session and time zones

- Own session, `/tmp/cln/p2b/sess.txt`, minted again after the container restart.
- Build v26.43.2-f8698cb at every capture (unchanged).
- **Screen captures** used three settings, all on the location's zone:
  - browser timezoneId = node TZ = location zone;
  - `change-location` to that zone;
  - **the app's own `localStorage.timezone` key**.
- **Server reads** ran with `TZ=<zone>` after `change-location`.
- Zones are recorded in `pictures/P2-B-meta.json` and `tools/p2b/results/recheck_*.json`.

## Verdicts (re-checked 29 Oct, UTC)

| Item | Verdict | Re-check | Relates to |
|---|---|---|---|
| B1 Last 90 days covers 91 days | DRAFTED | 00:09–00:11, Toronto. The PDF/CSV say "Date Range: Jul 30 – Oct 28, 2026". | SV-11514, SV-8642 |
| B2 A vendor return counts in Units Returned | DRAFTED | 00:18–00:27, Toronto. The return was made on screen; Units Returned showed 1.00. | SV-8645 |
| B3 Location column hidden when one location is picked | DRAFTED | 00:09–00:15, Toronto. The column is not in the column list either; Inventory Value shows it. | SV-8642, SV-8643 |
| B4 Last Sale ignores a billed sale | DRAFTED | 00:03–00:15, Karachi. N000000001069 reads 161 days; S2-16621 billed it on 30 Jul, so it should read 91. | SV-8645, SV-11516 |
| B5 Inventory Value "Qty" should read "On Hand" | DRAFTED | 00:14–00:16, Toronto. The screen, PDF and CSV all say "Qty". | SV-8670, SV-8677 |
| B6 (PV-D1) Receive-later part shows as never sold | DRAFTED (redraft) | 00:03–00:17, Toronto. Existing S1-38206 re-checked; it was made through the screen on 28 Oct. | SV-8645 |
| B7 (PV-D2) Demand counts a re-invoice twice | DRAFTED (redraft) | 00:03–00:27, Toronto. Existing records re-checked. | SV-8645 |
| B8 (IV-COLUMNS) Margin and Total Sell shown on first visit | DRAFTED (converted) | 00:14, Toronto, fresh browser. | SV-8670, SV-8675, SV-8927 |

14 annotated pictures (`pictures/P2-B1-1` … `P2-B8-1`). The worker looked at each one.

## Test data

- One vendor return was made at DVI Test (packaging slip "ZZAUTOTEST P2B vendor return", id 7a98ea67-06fa-450a-a2e9-6cad94a0dfb0), then cancelled.
- The part is back to 4 in stock and Units Returned is back to 0.00.

## JQL run (read-only, about 00:30 UTC)

1. `project = SV AND created >= -365d AND (text ~ "Parts Velocity" OR summary ~ "velocity" OR summary ~ "PV")`. 65 results, all read.
2. `project = SV AND created >= -365d AND (summary ~ "Inventory Value" OR summary ~ "Inv Value" OR summary ~ "On Hand" OR summary ~ "Qty on Hand")`. 59 results, all read.
3. `project = SV AND created >= -365d AND statusCategory != Done AND (text ~ "\"Units Returned\"" OR text ~ "\"Receive later\"" OR text ~ "\"Last Sale\"" OR text ~ "\"Last 90 days\"" OR text ~ "\"Location column\"" OR text ~ "Demand" OR text ~ "\"Qty on Hand\"")`. 46 results, all read.
4. A broad search for "Inventory Value" with qty or column. The first 60 results were read; nothing relevant.

Open items seen, none matching: SV-11895, SV-11516, SV-10080, SV-9810, SV-10380, SV-10379, SV-9286, SV-11756. SV-9810 (core parts inflating Demand) and SV-11516 (a stored last-sale date) have different causes.

Full text: `tools/p2b/results/jql_pv.txt` and `jql_iv.txt`.

## Found along the way (not drafted)

1. **Rule 99 has a fourth place: the app's `localStorage.timezone` key.** When the key is missing the app falls back to UTC. Recorded in `build/APP-ACTIONS-PLAYBOOK.md`. Since 29 Oct, `staging-boot2.mjs` sets the key automatically.
2. **Parts → Returns, "Cancel Return → Yes" did nothing for a manual return.** The screen sent no request, only a Sentry error, and the row stayed. Seen once, at 00:25 UTC. The return was then cancelled from the server.
