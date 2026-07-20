# TestRail push log — Simple Flow staging VIU 2026-07-20

Only wording/status-supporting field updates for VIU-Verified Story-18 cases. GET-before -> update_case -> re-GET verify. No writes to run 325.

SF-CORE-03 C29315: update_case ['custom_steps', 'custom_expected'] -> HTTP 200, re-GET MATCH
SF-CORE-04 C29316: no-op (already build-accurate)
SF-CORE-11 C29892: update_case ['custom_expected'] -> HTTP 200, re-GET MATCH
SF-CORE-18 C29899: update_case ['custom_steps', 'custom_expected'] -> HTTP 200, re-GET MATCH

SUMMARY: updated 3 / no-op 1 / failed 0