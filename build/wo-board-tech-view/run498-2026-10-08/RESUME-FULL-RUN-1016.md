# RESUME — full staging run of run 498 (started 16 Oct 2026 ~20:45 UTC, QA lead: "Please start testing ALL the test cases")

**State when started:** staging build v26.40.19-1493c63 (build-verification session re-stamped cases 19:06–19:25 UTC; no Expected
content changed — only build stamps, AUTOMATION markers, precondition wording). 278 tests. Admin + Analyst 1 cookies share ONE
Google sign-in (L0407): Analyst 1 block runs first. Cookies in /tmp/qa-cookies (staging-sso.txt, staging-full.json,
staging-analyst1.json), password /tmp/shopview/staging-analyst1.env. Never print or commit them.

**Command:** `cd RUN && RUN_DRAFTS=1 RUN_GA=day1 NO_SIGNOUT=1 ./run-full-1016.sh` (background). Logs:
`evidence/staging-full-2026-10-14/logs-full-1016/` + `queue.out`. Resume after a crash: `FROM=<step> ...` (step numbers in queue.out).
After the container restarts: restart the relay (bridge.mjs, L0355) and memwatch.sh, then FROM=<next step>.

**Then:** judge every test against its LIVE case text (Rules 12, 104, 114), annotate pictures, post batches with
`push_results_to_run.py --run 498 --build-marker <live build> --env staging --screenshots yes --allow-non-passed`; failures get the
existing ticket link or a held draft (Rule 113: file only on the QA lead's yes; check the PRD live first, Rule 106/L0403).
Fix-ups for script faults, then sign-out (signout-fix.mts, C368240) LAST. Analytics day 2 (`RUN_GA=day2`) on the next Pakistan day.
Open asks to the QA lead: C97021/C368151 Expected vs PRD v55+ (now re-stamped READY by the build-verification session — re-check);
SV-11101 reopen; C590117 tooltip ticket.

## 17 Oct 02:50 UTC — judge notes for fix-up 2 (do not lose)
- **C96975** (fix-up 2, s5-batchA3.mts): steps 16–18 (log out, log back in) are SUBSTITUTED by a fresh page load, because a log-out ends the one shared staging sign-in mid-queue. A substituted step is not observed (Rule 12) ⇒ C96975 can NOT be marked Passed on the fix-up reading alone. Re-do steps 16–18 by hand-script at the very END, together with signout-fix.mts (C368240), after every other step; judge only then.
- **C368171** (fix-up 2, editwo-fix.mts) needs Ralph Edwards by name; if he is still not offered ⇒ Failed on SV-11393 (OBSOLETE, still reproduces), not Blocked.
- **C96936** step 5: if Ralph is not offered in tab B, the lead is set through the page's own save; the refresh in tab A is what the case judges — say in the result how step 5 was done.

## 17 Oct 04:20 UTC — new failures with NO ticket (Rule 113: result written, ticket held; Rule 106: PRD live read BEFORE any ask)
- **C590114** Failed — Total price left-aligned in its column, case expects right (`annotated-full-1016/C590114-1-total-price.png`; `design-stg5.json` C590114.s2_total).
- **C97020** Failed — keyboard focus on the disabled "Reassign lead technician" never shows its note "The lead technician can't be changed once a work order is Invoiced or Paid." (shows on mouse hover, C590121) (`annotated-full-1016/C97020-1-locked-menu.png`; `kbd-fix4.json` s11/s12).
- **C590117** Failed on held draft `defect-drafts/tickets/D-C590117-2026-10-16.wiki` (tooltip opens below the count).
- **C590122** Blocked — after "Clear all filters" Search still reads "zzzz"; PRD extract silent ⇒ read PRD S1-N1a LIVE; if silent ⇒ PO question (58), not a defect.
- Held draft **D-C590122** (invisible magnifier circle) no longer reproduces ⇒ close it in the report (Rule 62(c) gate 3).
- Before the final report: one live read of PRD Confluence 845185030 (latest version), quote verbatim for each of the above, then ask the QA lead per ticket (one at a time).
- Tickets now passing (TESTING STAGE): SV-11319, SV-11322, SV-11324, SV-11323, SV-11338, SV-11394, SV-11325, SV-11397, SV-11310, SV-11318, SV-11422, SV-11419, SV-11405 (C590120), SV-11317, SV-11420.

## 17 Oct 04:55 UTC — for the final report
- **C614711** (Retest → Blocked, script fault steps 6/7/10, in fix-up 2): its EXPECT-FAIL symptom (SV-11416 "Unknown Technician" column) no longer reproduces — deleted lead's work order shows under "Deleted technician" with the Inactive marker, no grip ⇒ case outcome 3: tell the QA lead the fix looks shipped (SV-11416 TESTING STAGE, read 17 Oct).
- **C614711 step 8 — QA lead ruling needed:** List shows Lead Technician "Unassigned" for the deleted lead's work order S2-37033; the case expects a blank cell. Evidence `annotated-full-1016/C614711-2-list-lead.png`.
- C97012 (step 74) not run: two-person route broken since Admin and Analyst 1 share one Google sign-in (L0407).
- C97026/C97033/C97034: analytics day 2 on the next Pakistan day (RUN_GA=day2).

## 17 Oct 06:05 UTC — fix-up 2 steps 11–14
- C581895 **Failed** on SV-11336 (Open): Settings > Staff "Carol Neal", List "David Sparks", Board/Tech View "Carol Neal" (S2-37054). Step 12 (Tech View avatar hover names) not read.
- C368166, C368168 Passed using Jenny Wilson (cases say names are examples); Ralph Edwards still not offered — Lead Technician list 98 names ending "QA PartsTechnician" (SV-11393 OBSOLETE but still reproduces) ⇒ reopen question for the QA lead.
- C368167 Blocked: the work order would not invoice ("Over Limit" mark) — round 3 fix seeds a customer that can invoice.
- C368131 (leftover pin "Brandi Smith"), C581892 (second card not found) ⇒ round 3.
- **C368167 — possible product finding (not yet a claim):** invoice in tab 2 worked (INV-S2-37056, server "Invoiced"); stale tab 1 changed the lead with no error (server lead → Jenny Wilson); after reload the work order read Complete + "Over Limit" + Create Invoice offered again. Round 3 re-runs with credit limit raised and status read before/after each step. If it reproduces: Rule 106 live PRD read + case Expected, then ask the QA lead (one ticket, Rule 113) — never file without his yes.

## 17 Oct 06:40 UTC — fix-up 2 steps 15–22 (judged, RESULTS-fixup-1017-04)
- C368171 **Failed** on SV-11393 (OBSOLETE, read live): Ralph Edwards not in the status-card Lead Technician list (98 names, ends "QA PartsTechnician", typing does not narrow). ⇒ reopen question for the QA lead.
- **QA lead question — C96945 step 5:** after Escape, keyboard focus returns to the More actions (…) button (required by the keyboard rules), so it stays shown when the mouse leaves the card and hides once focus leaves the card. Step 5 as written expects it hidden. Case wording vs keyboard focus rule — report, Expected untouched (114).
- C368234: production's Parts Velocity report shows no rows for any choice, so the narrowing could not be compared there — say so.
- Round 3 LAST attempts (Rule 115): C368246 (View details not found), C96936 (Lead Technician field not found in tab B), C368127 (clicked person icon, not the arrow). If they fail again ⇒ hand checks, named in the report with what to click.

## 17 Oct 07:05 UTC — fix-up 2 steps 23–26
- **QA lead question (start state) — C368214 and C96916:** the Work Orders tab offers NO Status filter on this build (only the All tab does), so their step 1 / start state "Work Orders tab, Status: Approved" cannot be made. Source check (Rule 57/58): is the Status filter meant to be on the Work Orders tab? Hold and ask; Expected untouched. Everything else in both cases was seen working.
- C96963 and C368212: second script fault ⇒ NOT left unjudged (Rule 107): focused one-check scripts queued in round 3. (Earlier instruction citing Rule 115 was a misreading — Rule 115 is about keeping flaky specs, not about leaving tests unjudged.)
- C96975 → end-of-run sign-out batch.

## 17 Oct 07:55 UTC — fix-up 2 steps 27–33 judged (RESULTS-fixup-1017-06); round 3 running; round 4 being built
- Fixes look shipped (passed, tickets TESTING STAGE): SV-11317 (C590113), SV-11394 + SV-11395 (C590124), SV-11338 (C590129); SV-11416 symptom gone (C614711 steps 3–5). C368130 passed.
- Round 4 (fixup-1017d.txt, chained after round 3 by after-round4-1017.sh, which then runs the sign-out batch): focused scripts for C590115, C590116, C368151, C97003, C614711, C97020. The old after-signout-1017.sh waiter is stopped so the sign-out batch cannot start before round 4.
- C97020 re-check was VOID (focus never reached the test card) — not posted; latest result stays Failed, ticket held.
