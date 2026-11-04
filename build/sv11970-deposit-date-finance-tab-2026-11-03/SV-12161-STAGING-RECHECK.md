# SV-12161 re-check on staging — 4 Nov 2026 04:04–04:12 UTC (3 Nov 9–11 PM North America)
Staging app.staging.shopview.com, front end v26.45.0-f417d48 (last-mod Tue 03 Nov 19:42:39 GMT) = the build named in SV-12161.
Customer ZZAUTOTEST P2C DEP (a63836b3…), deposits recorded on screen (Finance tab > Add Deposit > EFT > Record Deposit), then the
customer's Deposits tab read. Scripts: scripts/dep.mjs (ENV=staging), scripts/prodloc.mjs (ENV=staging), scripts/stgdep4823.mjs.

| Run | Location (time zone) | Local time | Deposit Date | Stored | Deposits tab | Finance tab |
|---|---|---|---|---|---|---|
| stg12161-today S3-38348 DEP-4824 | Staging Lethbridge - 4310 (Edmonton) | 9:05 PM 3 Nov | default 11/03 | 2026-11-04T04:05:23Z | Today (right) | Nov 4 (SV-11970 bug — fix not on staging) |
| stg12161-nov2 S3-38349 DEP-4825 | Lethbridge (Edmonton) | 9:06 PM 3 Nov | typed 11/02 | 2026-11-03T04:06:24Z | Yesterday (right) | Nov 3 (SV-11970 bug) |
| stg12161-toronto S3-38351 DEP-4827 | Lethbridge set to America/Toronto for the run, restored (0 fields different) | 11:11 PM 3 Nov | default 11/03 | 2026-11-04T04:11:24Z | Today (right) | Nov 4 (SV-11970 bug) |
| stg12161-dvi-fiji S1-38350 DEP-4826 | DVI Test — NOW Pacific/Fiji, not Toronto (not changed by us) | browser 11:09 PM Toronto | default 11/04 (Fiji's date) | 2026-11-04T04:09:38Z | Today | Nov 4 |
(A first attempt to use our ZZAUTOTEST C614715 Empty Location on Toronto time ran in DVI Test instead — the admin cannot switch to it on
staging; the location was restored with 0 fields different. That run is the DVI/Fiji row.)

SV-12161's own example, read tonight at DVI Test: DEP-4823 stored 2026-11-03T00:16:40Z (recorded 7:16 PM Toronto 3 Nov = 2026-11-04T00:16Z)
-> it WAS saved a day early. DEP-4821 2026-10-29T00:27:28Z and DEP-4822 2026-10-28T00:42:37Z the same.
Result: SV-12161 does NOT reproduce now (3 runs at North American locations incl. exact Toronto, all saved on the right day). What changed
since 7:16 PM Toronto is NOT established: DVI Test's time zone has been changed to Pacific/Fiji by someone, and a back-end-only deploy would
not move the front-end marker. Shared settings: Lethbridge and C614715 restored byte-for-byte; DVI Test untouched. Test data left (ZZAUTOTEST customer).

## Retest as a first-time tester, following SV-12161's own steps (QA lead, 4 Nov 04:16 UTC)
Step 2 needs DVI Test on Toronto time; it is now Pacific/Fiji (changed by someone else). For the retest DVI Test was set to America/Toronto
and restored to Pacific/Fiji after each run (0 fields different every time). Work order S1-38222 (the ticket's), customer ZZAUTOTEST P2C DEP,
Finance tab > Add Deposit > Payment Method Cash (selected by option_create_deposit_payment_method_CASH) > 5.00 > Record Deposit, browser on Toronto.
| Deposit | Recorded | Deposit Date | Request / stored | Deposits tab | Right? |
|---|---|---|---|---|---|
| DEP-4831 | 11:22 PM Toronto 3 Nov | default 11/03/2026 | 2026-11-03T05:00Z / 2026-11-04T04:23:03Z | Today | yes |
| DEP-4832 | 11:23 PM Toronto 3 Nov | typed 11/01/2026 | 2026-11-01T04:00Z / 2026-11-02T04:24:02Z | 2 days ago | yes |
(Earlier the same minute-range runs with EFT: DEP-4828 Today, DEP-4829 Today, DEP-4830 dated Nov 1 "2 days ago" — all right.)
Annotated picture: ev/sv12161-retest-deposits-tab.png. Verdict: SV-12161 does NOT reproduce on staging v26.45.0-f417d48 at 11:22 PM Toronto.
DEP-4823 (7:16 PM) still reads "Yesterday" — stored 2026-11-03T00:16:40Z, a day early at the time. Cause of the change between 7:16 PM and
11 PM not established (DVI Test time-zone change by someone; possible back-end deploy that does not move the front-end marker).
Scripts fixed: dep.mjs now picks the payment method by test-id (PM env, default CASH) — the list item text carries a hidden "check" icon word.

## Closed (QA lead: "If this issue is not reproducible any more just put the evidence ... and obsolete the ticket")
4 Nov 04:29 UTC: comment 80084 posted (not-reproducible evidence, annotated picture attached inline), then transition id 8 "Close" ->
status OBSOLETE (resolution Done). Staging build re-read v26.45.0-f417d48 right before posting. The "I will move the ticket to OPEN after
retesting" header the QA lead put in the description was left as it is.
