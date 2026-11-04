# Worker brief: Technician Toggle named-set update to PRD v20 (4 Nov 2026)

QA lead, 4 Nov 2026: "Yes, named sets (Recommended)". Library only: no TestRail/Jira/Slack/Google writes, no commits.

## Sources
- `sources/CONFLUENCE-977371146-v20-2026-11-04.md` (PRD v20, 3 Nov 2026). Changed vs v18 (diff verified): S3-N1 (v19: a picked person
  whose Technician is turned off stays offered and picked while the board still gives them a column or group (S3-E1/S3-E2); otherwise
  they stay picked while Work Orders stays open, until the user unticks them or changes location; if they are the only person picked
  the board shows "No work orders match these filters"; the next time Work Orders is opened from the menu, or the page is reloaded, they
  drop out; a person picked at another location drops out when the location changes; work orders do not move) and S6-R1 (a) (v20: "time
  on a department alone does not count; an entry that has both a department and a work order counts as time on the work order"), plus
  two Change Log rows. Nothing else changed.
- Chris's answer 9: `po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md` (bottom).

## Named set (nothing outside it changes)
- S3-N1 cases: S3-01, S3-02, S3-03, S3-04, S3-07, S3-08, S3-11, S3-48, S3-50 (re-copy the S3-N1 quote from v20; S3-48 and S3-50 are
  rewritten to the new filter behaviour top to bottom, Rule 134).
- S6-R1 (a) cases: S6-01 to S6-06 and INV-06 (re-copy the quote; add the department-and-work-order rule only where the case is about it).
- Every case in the set: From line "version 20 (3 Nov 2026, Chris Ward), read 4 Nov 2026"; per-case version switch so only the set quotes v20.
- New cases (check first that none already covers it): (1) a turned-off person who still leads shown work stays picked and offered in
  the filter; (2) a turned-off person with no column stays picked while Work Orders stays open, and "No work orders match these filters"
  shows when they are the only one picked; (3) they drop out when Work Orders is opened again from the menu or the page is reloaded.
  A case for a time entry with both a department and a work order only if a tester can create one on screen; otherwise list it as
  not testable by hand with the reason (Chris's question 9 note: no screen found).
- Keep the non-PRD quotes (design notes, tech plan) untouched; the verbatim check is against v20 only for PRD quotes.

## Gates and output
`build.py` 0 PROBLEM lines; readiness check 0 hard (read the sample and new "does not / never" lines); a `verify_v20_named_set.py`
proving set quotes are word for word in v20 and every mapped case outside the set renders exactly like its latest read-back (the
v18 update wrote read-backs into `applied/`); `ticket_sweep` 0 unhandled with prd_version_handled 20; update REPORT.md, the setup file,
TICKET-LEDGER/SWEEP. Dry runs of `update_changed.py` (lock on the latest read-back; new released cases into run 555 union only; run 555
and its tests are assigned to Mudassir, user 6 — new tests must be assigned to him too) and `create.py`. Final message under 200 words.
