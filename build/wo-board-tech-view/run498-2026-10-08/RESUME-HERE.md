# Run 498 — RESUME HERE (written 9 Oct 2026 18:30 UTC, weekly quota at 92%)

QA lead, 9 Oct: *"first make all the defects READY for me to review and immediately file when I approve … ALL the failed test
cases are ready to be posted as defects once I approve them one by one, once you are done, you MUST resume with testing the
remaining test cases … do everything which you can do quickly first … make sure that our work is not lost midway."*

## Filed today (all with label board-tech-view, case link at the bottom, ticket in the test's Defects field)
| Report | Ticket | State |
|---|---|---|
| D2 Assigned to me stays on after a location change (C96923) | SV-11098 | Open |
| D7 "card has moved" alert has an extra headline (C368138) | SV-11104 | Open |
| D10 Estimated hours never on a card (C96978) | SV-11106 | Open |
| D1 search no-results (C368211) | SV-11099 | Obsolete (search is not a filter, L0301) |
| D3 group order (C96929) | SV-11101 | Obsolete (works now) — C96929 Passed |
| D8 line history (C96962) | SV-11107 | Obsolete (wrong log, L0304) — case corrected, re-run Passed |
Closed without a ticket: D5 (C368131 re-run Passed), D6 (C368135 Passed on ruling). D4 = SV-11075 (someone else's, Open).

## Still to make READY (one ask each, never batch)
1. **D9 C96983** — field choice not saved after a load failure. Ticket `defect-drafts/tickets/D9-ticket.wiki` is ready EXCEPT
   its Steps use DevTools "Block request URL", which also blocks the save. Rewrite the steps: a developer makes only the
   GET of `/api/users/me/preferences/work-orders-list` fail (our check: `s5-batchA5.mts` line ~134 does exactly that).
2. **Six failed cases nobody has reported** — C368165, C368181, C368204, C368216, C368242, C368247 (all run 498, outcome 1 of
   their own case text). For each: quote the case's source sentence (its Expected carries the PRD quote), steps from the case,
   an annotated 2x picture from `evidence/`, owning story read live, label, case link last. Judge on PRD vs build only (L0303).

## Testing queue (resume1.sh in the session scratchpad; if the container is gone, re-run from PAUSED-STATE.md table)
Done 9 Oct: kbd, rename, pscounts (INSTRUMENT FAULT: Part Number box not found — fix `ps-counts.mts` field() and re-run),
sort, deleted, high1 (shift booking showed no shift after Create — decide instrument vs app before judging), medium, dash.
Running/left: s9, two, imp, signout (LAST). None of the queue's outputs are judged or written to the run yet — read each
`r1-<tag>.log` / evidence JSON, judge, write with push_results_to_run.py.

## Sign-in
Fresh sv_sso_session given by the QA lead 9 Oct ~17:00 (in /tmp only). Production checks: PROD_ENVF=/tmp/shopview/prod-login-second.env,
start the bridge first (`bash build/testing-tools/ensure_bridge.sh`).

## Queue outcome, 9 Oct 19:40 UTC (logs copied to `queue-logs-2026-10-09/`; NOTHING from it is judged or written to the run yet)
| Step | Cases | Outcome |
|---|---|---|
| kbd | C368151, C368152, C97020 | ran — judge from the log |
| rename | (probe) | ran: the List's Lead Technician column showed the NEW name after a staff rename (no stale name here) |
| pscounts | C368217 | INSTRUMENT FAULT: Add Part's "Part Number" box not found — fix `ps-counts.mts`, re-run |
| sort | C368196 | ran — judge |
| deleted | C368191 | ran — judge |
| high1 | C368172, C368177, C368178, C368179, C368190, C368188, C368189 | ran; Schedule shift creation showed no shift after Create — decide instrument vs app first |
| medium | C368220–C368237 | ran — judge |
| dash | C368246 probe | ran — judge |
| s9 | C97003, C97012 | C97003 ran; C97012 script error (technician not found) — fix and re-run |
| two | C368149 | ran — judge |
| imp | C368238, C368239 | 3rd attempt hung (page.goto timeout after switch-user; C368239 timed out). Proposed: leave for MANUAL testing |
| signout | C368240 | half: tab 2 went to /login after sign-out (good); the Reports click timed out — finish by hand or re-run |
