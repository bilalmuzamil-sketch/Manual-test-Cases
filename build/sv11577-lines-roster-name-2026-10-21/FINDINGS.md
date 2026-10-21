# SV-11577 — Lines tab roster + Edit Line name the technician by the staff record name (QA, 21 Oct 2026)

**Verdict: PASSED** — Jira comment 79196 (2 exhibits, 11 checks). No recording, no technical section (batch ruling).
Staging `app.staging.shopview.com`, Admin, Staging Heavy Duty - 9919. Build moved mid-pass
v26.40.20-00f1fd6 → **v26.40.20-c627fc7**; every capture was re-taken on c627fc7 before posting (identical results).

## Test data
- Technician staff 069b545f-7fb2-4210-bb59-ce7a6921e1a5: staff record **Debra Garcia**, login account **Lindsay Perez**
  (`/api/technicians` = staff record; `/api/staff` list = account). Only active mismatch at Heavy Duty
  (Scott Griffin / Jared Miller 8b9910da… is inactive and not offered).
- Work order **S2-37763** (13380d8b-30d2-41df-a5c7-e8989a38daeb), customer "E2E Refresh Payments Rows 1790350599322-243010",
  2020 Ford Transit. Line 1 Transmission service: technicians David Sparks + Debra Garcia (added in Edit Line, UI).
  Line 2 Cabin air filter: unassigned. Lead technician Debra Garcia (set in the UI, `POST /api/work-orders/change-lead-technician`).

## Matrix (all observed on screen)
Lines roster (1st/2nd technician) · Edit Line chips · Add Technician list (no "Lindsay Perez") · save + reopen ·
lead technician panel · Board column header + card + avatar hover · Tech View group header · List Lead Technician ·
Technician filter ("Debra" found, "Lindsay" none). Save response `PUT /api/work-orders/lines/{id}/technicians` and
`GET …/line-technicians` both return firstName Debra / lastName Garcia.

## Production before — not buildable from screens
No production technician has two different names. Both rename paths change both names together:
- `POST /api/staff/{id}/change` (Technician 1, a1d7fb4a…) → both lists showed the new name.
- Edit Profile `POST /api/iam/change-name` (own account, 3d2a9387…) → both lists showed the new name.
Restored: Technician 1 name "Technician 1" + clockable true (my first change body had no `clockable`, which switched it
off — `clockableChanged:true`); billable/salary of Technician 1 now read billable 0 / salary none — originals were not
captured before the change. Own name restored to Bilal Muzammil (clockable true, billable 1).

## Gate
Build re-read (stopped once on the redeploy, re-captured, then posted on c627fc7); ticket Ready for QA, 0 comments;
2 attachments read back as file media 980x929 / 1080x752, table 12 rows, 6 steps; first panel PASSED.
Learning: `POST /api/staff/{id}/change` resets fields not sent (clockable) — send the full list-record fields
(`clockable, billable, salary_type, salary, is_sales_rep`) from `GET /api/staff` list, not only the `/view` record.
