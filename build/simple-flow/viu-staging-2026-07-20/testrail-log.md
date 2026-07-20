# TestRail push log — Simple Flow staging VIU 2026-07-20

Only wording/status-supporting field updates for VIU-Verified Story-18 cases. GET-before -> update_case -> re-GET verify. No writes to run 325.

SF-CORE-03 C29315: update_case ['custom_steps', 'custom_expected'] -> HTTP 200, re-GET MATCH
SF-CORE-04 C29316: no-op (already build-accurate)
SF-CORE-11 C29892: update_case ['custom_expected'] -> HTTP 200, re-GET MATCH
SF-CORE-18 C29899: update_case ['custom_steps', 'custom_expected'] -> HTTP 200, re-GET MATCH

SUMMARY: updated 3 / no-op 1 / failed 0
## Batch 2 push (2026-07-20) — receive/PO surface VIU-Verified
SF-INV-01 C29360: no-op (wording already build-accurate; status/note local)
SF-INV-02 C29361: no-op (wording already build-accurate; status/note local)
SF-INV-03 C29362: no-op (wording already build-accurate; status/note local)
SF-BULK-06 C29355: no-op (wording already build-accurate; status/note local)
SF-RCV-13 C29903: no-op (wording already build-accurate; status/note local)
SF-VEND-08 C29905: no-op (wording already build-accurate; status/note local)
SUMMARY batch2: updated 0 / no-op 6 / failed 0 (status/notes flipped locally for all 6; run 325 untouched)
## Batch 3 push (2026-07-20) — Story-18 core charge/gate/lines-tab
SF-CORE-12 C29893: no-op (status/note local)
SF-CORE-13 C29894: no-op (status/note local)
SF-CORE-16 C29897: no-op (status/note local)
SUMMARY batch3: updated 0 / no-op 3 / failed 0; run 325 untouched
## Batch 4 push (2026-07-20) — required-invoice/review core flow + receive auto-apply
SF-CORE-07 C29319: no-op (status/note local)
SF-CORE-08 C29320: no-op (status/note local)
SF-CORE-14 C29895: no-op (status/note local)
SF-BULK-10 C29359: no-op (status/note local)
SF-REV-14 C29399: no-op (status/note local)
SUMMARY batch4: updated 0 / no-op 5 / failed 0; run 325 untouched
## Batch 5 push (2026-07-20 resume 2) — deviations + part-sale + vendor-change
SF-VEND-07 C29904: no-op (status/note local)
SF-POSEL-07 C29906: no-op (status/note local)
SF-BULK-11 C29907: no-op (status/note local)
SUMMARY batch5: verified-pushed 0 / no-op 3 / failed 0; SF-CORE-15/17 -> Blocked-Env; deviation SF-RCV-05/07 CONFIRMED (bug#5 open); run 325 untouched