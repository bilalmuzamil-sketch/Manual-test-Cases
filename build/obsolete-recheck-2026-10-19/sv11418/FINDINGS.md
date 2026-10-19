# SV-11418 re-check — Time Clock off: work order shown as Unassigned (19 October 2026)

**Verdict: the reported issue is FIXED on staging build v26.40.19-e435950** (last-modified Mon 19 Oct 2026 06:18:22 GMT, etag 6981e221…). Ticket status: OBSOLETE (QA lead, 16 Oct, comment 78836 "NoT reproducible anymore"). Nothing posted to Jira.

## What the PRD says now (PRD 845185030 v64)
The ticket was filed "PO to confirm". Since then Chris added **S3-R20d** (PRD v59, 2026-10-16, Chris ruling on Slavcho's question in SV-11416):
> "A lead technician whose Time Clock is turned off (not deleted) keeps their own column on Board View and group in Tech View, under their name, while they still lead work orders. Nothing can be dropped onto it, the same as S3-R20c. Once they lead no work orders, the column or group is no longer shown."

S3-R20c (the "same as" rule): "Dropping a work order on it is refused with "This technician can't be assigned work orders." and the work order stays where it was."

## Matrix (all observed live; technician ZZAUTOTEST DC15 Wes Hover, staff d1879db8…, Staging Heavy Duty - 9919)
| # | Check | Result |
|---|---|---|
| 1 | Baseline, Time Clock on: S2-37319 + S2-37320 led by Wes → own Board column, own Tech View group, List Lead Technician "ZZAUTOTEST DC15 Wes Hover" | as expected |
| 2 | Time Clock turned off in Settings → Staff → pencil → Time Clock → Save & Close (UI; request `POST /api/staff/{id}/change` clockable:false → 201; staff record re-read clockable false) | done |
| 3 | Board View after: Wes keeps a column under his name holding both work orders (header "ZZAUTOTEST DC15 Wes Hover … 2 work orders") | PASS (S3-R20d) |
| 4 | Tech View after: group "ZZAUTOTEST DC15 Wes Hover", 2 work orders, Lead Technician column shows his name | PASS (S3-R20d) |
| 5 | List after: Lead Technician "ZZAUTOTEST DC15 Wes Hover" on both rows | PASS (not Unassigned) |
| 6 | Work order page S2-37319: lead "ZZAUTOTEST DC15 Wes Hover" | PASS |
| 7 | Board View: drag S2-37321 (Unassigned) onto his column → "This technician can't be assigned work orders." shown over the column, work order stays Unassigned | PASS (S3-R20c via S3-R20d) |
| 8 | Tech View: same drag onto his group → same message, work order stays Unassigned | PASS |
| 9 | Drag both work orders out to Unassigned → "Lead technician removed" ×2; his column and group are no longer shown | PASS (S3-R20d) |

Observation, not a fault: his column/group shows no "inactive" marker. S3-R20d does not ask for one (the marker rules S2-N3/S3-N4 are for deactivated technicians; Time Clock off is not deactivation).

## Side effects / clean-up
- A drag attempt with edge auto-scroll overshot and briefly assigned S2-37321 to ZZAUTOTEST DC16 Xia Dark ("Lead technician updated"); it was set back to unassigned (board-move technicianId null → 200, re-read "(none)").
- Wes Hover's Time Clock restored to on (201; re-read clockable true, departments/role/billable unchanged).
- Test work orders left in place (staging test data, ZZAUTOTEST customer): S2-37319 (led by Wes), S2-37320, S2-37321 (unassigned).

## Evidence
`ev/` — baseline board, Edit Staff dialog before/after toggle, Board/Tech/List/work-order page after, Board and Tech View drop messages, after drag-out. `data/` — JSON of every run. `scripts/` — o18/d18/d18b/d18e.
