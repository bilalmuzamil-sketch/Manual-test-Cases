# STATE 10 Oct 10:30 UTC — scripted testing finished
Run 498: passed 217 · failed 19 · blocked 9 · untested 6 (C97022 waits on the QA lead; C368240, C368238, C368239 manual;
C154650, C368175 manual — need a second organization). Recorded today: C97012, C368190, C368237, C368217 Passed;
C368178, C368179 Failed (held ticket D19, six-hour Schedule jump); C368177 Failed (linked to SV-11087, "future" refusal noted
on D19); C368233-235 Failed, NO ticket (production identical). SV-11122 is OBSOLETE (C368181) — asked the QA lead whether to
mark C368181 Passed (L0306); act only on his yes. Questions put to him: SV-11122/C368181 · file D19 · the three report-filter
tests · C97022 refresh step · L0307. Report text: session scratchpad report.md (also in the chat).

---

# UPDATE 10 Oct 09:50 UTC
**Recorded today:** C368233/C368234/C368235 Failed (case outcome 1) — production behaves the same, so NO ticket (not a
regression of this work); the test's steps describe the other filter style — for the QA lead. C368179 Failed — a shift dropped
under 1 PM is saved 07:00–09:00 PM (six hours later, in either browser zone); production (shop on UTC) saved 12:00–14:00; ticket
**D19 prepared and HELD** (`defect-drafts/tickets/D19-C368179-ticket.wiki`, picture 1x — recapture at 2x before filing).
**Tickets:** SV-11123 and SV-11125 now carry their 2x pictures, inserted into the QA lead's edited text (he added "Do not
pick this up - I need to double check it in the evening today" to both — never overwrite a filed description, L0308).
**Queues r7–r10:** r7 C368177 (hover the pencil) + C368178/C368192/C368190 on an empty day (`WOB_SCHED_SKIP=8`); r8 make a
staff member a sales rep (branch had none) + invoice + C368237; r9 C97012 (scroll to Ana's column; steps 5/6/9 already seen
correct); r10 C368217 (use the Add Part window a new part sale opens by itself).
**SV-11087** (In Progress, someone else's) is exactly C368177's subject — if C368177 fails, no new ticket: name SV-11087.

---

# Run 498 — RESUME HERE — STATE 10 Oct 2026 09:15 UTC (newest first; older notes below)

**Run 498 live:** passed 213 · failed 13 · blocked 9 · untested 16 (C97012 C97022 C368177 C368178 C368179 C368190 C368217
C368233 C368234 C368235 C368237 C154650 C368240 C368238 C368239 C368175). All 13 filed tickets read **Open** live 09:05
(SV-11075 SV-11098 SV-11104 SV-11106 SV-11117–SV-11125). On any Obsolete: ASK the QA lead whether to mark the test Passed (L0306).

**Queues running (session scratchpad, status files r3/r4/r5.status; logs `queue-logs-2026-10-10/r3-*`, `r4-*`, `r5-*`):**
- r3: sbr-seed (failed: sales-rep list shape — fixed) → medium-fix4 C368233/234/235/237 → high1-fix7 C368177/178/179/192/190
  with `WOB_TZ=America/Edmonton` (shop's zone; a UTC browser saved a 9 AM drop at 3 PM).
- r4: sbr-seed again → C368237 again → C97012 again (s9-fix8 FIX 10 reads the tech's page right after his permission is removed).
- r5: pics2.mts → 2x pictures for SV-11123 (part sale card) and SV-11125 (Credits reload) into `defect-drafts/raw/`; then
  annotate with `annotate_v2.py --scale 2`, put before/after side by side, run scratchpad `addpics.sh <KEY> <wiki>`.

**Judged today, not yet written to the run:** C97012 steps 5–6 (refused with "Failed to update lead technician, please try
again. The lead technician can't be changed once a work order is Invoiced or Paid.", card back in Ana's column, Alpha Invoiced);
steps 8–9 pending the r4 re-run. C368192 is already recorded.

**C368233/C368234/C368235** carry today's behaviour + three outcomes in their own text: if seen exactly, mark Failed, raise nothing.
**C368240 (sign-out):** test browser freezes after sign-out in tab 2 (4 attempts, 3 instruments) — tab 1 reached the sign-in page
once. Leave for a MANUAL run; steps are the case's own. **C97022:** the case's "refresh" step always puts focus at the top —
question for the QA lead, explained in plain words in the end report. **Manual:** C368238, C368239, C368175, C154650.
**Still to fix:** C368217 (Part Number box), impersonation retry.

---

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

### Filter step (medium) — judged 9 Oct 19:50: 7 Passed, C368221 Failed (outcome 1). NOT judged, re-run needed:
C368224, C368225 (script picked the "All …" option, not a value) · C368226, C368231 (nothing picked) · C368230 (rows differed after reload — recheck) ·
C368233, C368234, C368235 (report filter is "All …" + single picks; the case's untick/select-all/clear steps do not fit — case question for the QA lead) ·
C368237 (Sales By Representative has no data — seed a sale with a sales representative first).

### Batch 3 judged 9 Oct 19:58: C368172, C368188, C368189 Passed; C368149 Failed (merge of two reorders, no alert) — reconcile with PRD S4-N11 before asking.
NOT judged, re-run needed: C368177 (labor move not performed by the script) · C368178, C368179, C368190, C368192 (Schedule shift not created after Create — instrument or app, decide first) · C97003 (column order read incomplete; Tech View drag found no handle) · C97012 (script error: technician not found) · C368217 (Add Part box not found) · C368240 (sign-out: Reports click timed out) · C368238, C368239 (hung 3 times — propose MANUAL).

## 10 Oct 2026 — QA lead: "I need everything done today … get done with ALL the test cases and prepare the defects for the failed ones"
- sv10043 backend down from ~06:xx UTC (quick-login HTTP 503; /api/version returns the web page). Watcher `wait_up.sh` (scratchpad) writes branch-UP.
- D12 (C368149) drafted: PRD S9-R11 "the later save wins" broken (merge). Pictures to RETAKE at 2x (`c368149-two.mts`, WOB_SCALE=2) when the branch is up.
- C368221 (Return credits): source is a dev note only ("pages that remember filters and settings … check that it's kept"); the filter WAS kept, only the tab went back to Returns → put to the QA lead as "not a defect?".
- Blocked 9 reviewed: all legitimately blocked (case-instructed PO questions C368162/C368160/C368164/C96977/C154887; analytics ruling C97026/C97033/C97034; Q1 C368170).
- Next on the branch, in order: s9-fix8 C97003 (viewer pins the 3 techs), C97012, C97022 (judge what can be judged), C368177, shifts C368178/C368179/C368190 (+C368192 setup), C368217, filters C368224/225/226/230/231/237, C368246 dashboard, D12 pictures, C368240 sign-out LAST.

## Tickets to watch (L0306): when any reads OBSOLETE, ask the QA lead "mark that test Passed?" — act only on yes
SV-11098 C96923 · SV-11104 C368138 · SV-11106 C96978 · SV-11117 C96983 · SV-11118 C368204 · SV-11119 C368149 · SV-11120 C368165 ·
SV-11121 C368247 · SV-11122 C368181 · SV-11123 C368216 · SV-11124 C368242 · SV-11125 C368221 · (SV-11075 C96938, someone else's)
Pictures still to add (2x, after the branch is back: caps2x + twopics steps of resume2.sh): SV-11119..SV-11125.
