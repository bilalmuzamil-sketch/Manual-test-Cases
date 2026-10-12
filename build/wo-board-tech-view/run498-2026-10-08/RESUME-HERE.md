# 12 Oct 2026 — test cases of the QA lead's Obsolete tickets
Obsolete by the QA lead (change history read live): SV-11099, SV-11101, SV-11107, SV-11118, SV-11119, SV-11120, SV-11121,
SV-11123, SV-11124, SV-11125. SV-11122 was marked Obsolete by **Ahtasham Amjad**, not him (my 10 Oct report said otherwise —
corrected). On his choice (12 Oct) DELETED: C368149 (SV-11119), C368216 (SV-11123), C368242 (SV-11124), C368221 (SV-11125) —
bodies saved in `case-deletes-2026-10-12/`. Already gone before: C368211 (SV-11099), C368247 (SV-11121). Then, on his second instruction (12 Oct), DELETED too: C368204 (SV-11118) and C368165 (SV-11120), both ours and flagged
Automated — the case history shows Vladimir Tomovic set the flag on 9 Oct (the QA lead said Ahtasham automated them). KEPT: C96929 (SV-11101) and C96962
(SV-11107), both Passed. Held drafts D12/D16/D17/D18 are closed (their tickets obsolete, cases deleted).

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


## 12 Oct 2026 — priority 2, defects one by one
- **Defect 1 DONE:** Rule 121 production check (prod-tz-check.mjs, evidence/prod-2026-10-12) ⇒ regression; filed [SV-11229](https://shopview.atlassian.net/browse/SV-11229) under SV-10228 (his choice); posted into run 498 on C368179 + C368178. C368175 marked Passed by the QA lead himself (video).
- **Next: Defect 2** — C97022 keyboard focus after a refresh (held, no ticket). Then Defect 3 C368177 (SV-11087 covers it), then the filed open tickets, then priority 3 (9 blocked).
- **12 Oct, later:** SV-11229 and SV-11230 were both HARNESS artefacts (L0312: the harness displays QA-branch times in UTC). The QA lead obsoleted both himself. C368177/C368178/C368179 marked Passed (his ruling). Re-check of every run 498 test whose result mentions a time: 60 found, none other changes — the shift tests read stored times through `shifts.mts` (Edmonton, from the API), never the display. C97022 Passed (his ruling). Ahtasham marked C96960 (SV-11128), C96968 (SV-11074), C368136 (SV-11126) Failed himself at 08:59–09:13 UTC.
- **Next:** the already-filed open tickets one by one — SV-11098 (C96923), SV-11104 (C368138), SV-11106 (C96978), SV-11117 (C96983), SV-11110 (C368181); SV-11075 (C96938) is someone else's. Then priority 3 (9 blocked).
- **12 Oct, end of day:** run 498 = 231 passed · 6 failed · 7 blocked · 0 untested.
  - Failed (each with a why-comment + "Follow the status here <ticket>" on top, Rule 123): C96938/SV-11075, C96960/SV-11128, C96968/SV-11074, C368136/SV-11126 (all three of Ahtasham's re-tested with his steps and reproduced — left untouched, Rule 124), C96978/SV-11106, C96983/SV-11117.
  - Blocked: C368162 + C154887 (Product Owner sheet `Work Orders Board and Tech View - Product Owner questions - 12 Oct 2026.xlsx`), C368160 + C368164 (developer: not in this release), C97026/C97033/C97034 (Google Analytics reports; day-1 user steps done, day 2 scheduled 13 Oct 06:00 UTC, trig_01TXWEUtko3vhjXQ7i7gS8qh; read reports after 19 Oct).
  - New rules today: 121 (+ screenshot amendment), 122, 123, 124. Shop "Staging Heavy Duty - 9919" is now Asia/Dubai (L0313).
- **12 Oct, evening:** Heavy Duty set to Asia/Karachi (Rule 125, gate `tz-match-check.mjs`). C96960 and C368136 re-run BY THEIR OWN CASE STEPS → Passed with annotated pictures (Rule 124 amendment: judge the case, not the attached ticket); C96968 still Failed by its own steps. Run 498 = 233 passed · 4 failed (C96938, C96968, C96978, C96983) · 7 blocked. `STAGING-READY.md` generated (Rule 126).
- **12 Oct:** PO questions as a Google Sheet for Chris (owner bilal.muzamil@shopview.com; domain-wide edit to be switched on by the QA lead — the Drive connector shares only with a person or group): https://docs.google.com/spreadsheets/d/1cDba13YuN4ZS9tiu38DP8OjInCtYHWyOkGOuv6f9_P8/edit
- **12 Oct:** C368162 and C154887 moved Blocked → Retest (waiting on Chris; the Google Sheet link is in each comment).

## 12 Oct 2026 — blocked tests, after the QA lead's choices
- C368160 (test 3762381) and C368164 (test 3763435) moved Blocked -> Retest (QA lead: anything blocked on Chris goes to Retest with the reason and the sheet link). Comments name question 3 and the sheet link. Run now: 233 passed · 4 failed · 3 blocked · 4 retest.
- OPEN: question 3 is NOT yet in Chris's Google Sheet — no Google Sheets editing connector in this chat. Asked the QA lead to turn it on (or paste the drafted row himself). Do not recreate the sheet.
- Analytics C97026 / C97033 / C97034 stay Blocked (not on Chris). QA lead reads the reports; checklist sent 12 Oct. C97026 readable now; C97033/C97034 after 19 Oct. Day-2 steps scheduled 13 Oct 06:00 UTC (`PHASE=day2 ./wob-run.sh ga-week.mts`).
- 12 Oct 2026 (later): QA lead asked for a NEW sheet with all questions. Created "Work Orders Board View and Tech View - Questions for Chris - 12 Oct 2026 (all questions)" = https://docs.google.com/spreadsheets/d/1LFiQHC4Ja6SgRrFHphpTjCY92B7g_wMwDOZnxiwbjJs/edit (Q1 Collapse all, Q2 Imported, Q3 Columns menu + Find a column; plus QA internal tab). Read back: all three rows present. All four Retest tests (C368162, C154887, C368160, C368164) re-commented with the NEW link. Old sheet 1cDba13… left untouched (not trashed). Sharing: only the owner — QA lead to set General access → ShopView → Editor.
- 12 Oct 2026 (Chris's answers): Q1 + Q3 "remove the check" -> QA lead chose DELETE. C368162, C368160, C368164 deleted (snapshots + history in case-deletes-2026-10-12/, delete-log.json; read-back 400; run 244 -> 241 tests). All three were design-only (Branko's design export), never in the PRD (PRD v47 has none of the words).
- Q2 Imported: Chris (12 Oct) says imported WOs must show in Board/Tech View = build gap, ticket to Slavcho. CONFLICT: Sasha approved the opposite in PRD footer reply 886374410 (24 Sep), build matches Sasha (re-checked 12 Oct, evidence/imported-2026-10-12). QA lead chose: ask Chris first, file nothing. C154887 + C154648 -> Retest with the reason + old sheet link. Follow-up question drafted: source-verify-2026-10-12/question-for-chris-imported-followup.md — NOT yet in the sheet (no Sheets editor connector). Record: source-verify-2026-10-12/IMPORTED-CONFLICT.md.
- Run 498 now: 232 passed · 4 failed · 3 blocked (analytics) · 2 retest (Imported).
- Follow-up sheet for Chris (Imported) created: https://docs.google.com/spreadsheets/d/1qOK9Jxc6vWWfof7UWMSmX0dorZWgRRNHUMiLvNuHPhk/edit — read back OK. C154887 + C154648 Retest comments now point to it. Deleted C368162/C368160/C368164 were all at Retest in run 498 when deleted (Blocked until earlier on 12 Oct).
- 12 Oct 2026: QA lead sent Chris the follow-up sheet (1qOK9…). WAITING on Chris. On his answer: A -> file the ticket under SV-10047 for Slavcho (Rule 113 shape), C154887 Failed + ticket, C154648 Failed + ticket (case Expected left as is, divergence reported); B -> C154648 Passed, C154887 closed (cannot apply), no ticket.
- 12 Oct 2026: GA key from QA lead valid but account has NO Analytics access (key deleted). Ticket SV-11240 (Task, Medium, under SV-10043, relates SV-10593, Stefan Mitrovic tagged) filed on the QA lead's instruction; C97026/C97033/C97034 stay Blocked with the ticket link. Cases simplified (setup + steps only).
- 12 Oct 2026 evening: analytics done on the QA branch WITHOUT Google Analytics (Rule 107.J-L). C97026 Passed, C97034 Passed (report-figures.json), C97033 Blocked until day 2 (scheduled 13 Oct 06:00 UTC, trigger prompt updated to compute with ga_calc.py and record). SV-11240 commented + closed OBSOLETE. Launcher fault (PHASE dropped) fixed; FS1 VIN restored (fs1fix).
- 12 Oct: day-2 trigger moved 06:00 -> 09:00 UTC 13 Oct (06:00 UTC is still 12 Oct in US Pacific; GA property time zone unknown). C97033 comment updated.
- 12 Oct 22:39 PKT: QA lead set day 2 to start when the Pakistan date changes; trigger now 19:05 UTC 12 Oct (00:05 PKT 13 Oct). Day-2 timing only matters for the Google Analytics report page; the QA-branch verdict uses the PRD formula on the events.
