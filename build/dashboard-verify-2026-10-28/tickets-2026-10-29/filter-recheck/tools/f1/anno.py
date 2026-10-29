#!/usr/bin/env python3
"""Annotate F1's replacement pictures (one per KEEP, EDIT ticket) with tools/annotate_v2.py; boxes come from each run's meta."""
import json, subprocess, os
EV = os.path.dirname(os.path.abspath(__file__)).replace('/tools/f1', '/evidence/f1'); A = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools/annotate_v2.py'
def S(m, shot): return json.load(open(f'{EV}/ui-{m}.ui.json'))['meta']['shots'][shot]
def b(x): return f"{x['x']},{x['y']},{x['w']},{x['h']}"
def chip(s, cid): return next(c['box'] for c in s['chips'] if c['id'] == cid)
def cell(s, h): return next(c['box'] for c in s['cells'] if c.get('h') and h in c['h'])
J = []
s = S('P11', 'iii'); J.append(('SV-11931', 'ui-P11-iii.png', 'Dashboard, DVI Test, Technician Efficiency, Last 12 Months, all technicians', [
  (s['range'], 'good', 'Date is the widest choice, Last 12 Months: no narrowing date'), (s['chip'], 'good', 'Technician filter: All technicians (nothing deselected)'),
  (s['meta'], 'bad', 'Tile still counts the declined line: 8.00 Invoiced Tech Hrs / 5.06 Clocked = 158.10%'),
  (s['row'], 'bad', 'Fabian Bonjean 1.50 Clocked / 2.00 Tech Hrs / 133.33%: should be 1.00 / 1.00 / 100.00% (only line 1 of S1-38198 was billed)')]))
s = S('P12', 'iii'); J.append(('SV-11932', 'ui-P12-iii.png', 'Dashboard, Staging Lethbridge - 4310, Technician Efficiency, Last 12 Months, all technicians', [
  (s['range'], 'good', 'Date is the widest choice, Last 12 Months'), (s['chip'], 'good', 'Technician filter: All technicians'),
  (s['meta'], 'bad', '8,135.67 / 7,345.65 = 110.75%: about 4.40 tech hours are missing from lines clocked under 36 seconds; should be about 8,140.07 = 110.82%'),
  (s['row'], 'bad', 'Joseph Nelson 1313.09 Tech Hrs: should be about 1316.17 (3.08 h missing, incl. 0.50 h on S3-17383 line 4) = 116.31%, not 116.04%')]))
s = S('P13', 'iii'); J.append(('SV-11933', 'ui-P13-iii.png', 'Dashboard, Staging Heavy Duty - 9919, Technician Utilization, Last 12 Months, all technicians, sorted by Total Hours', [
  (s['range'], 'good', 'Date is the widest choice, Last 12 Months'), (s['chip'], 'good', 'Technician filter: All technicians'),
  (s['row'], 'bad', 'Nebojsa Custom-Admin is listed with 0.00 hours: his only clocks (16-17 Sep 2026) were a few seconds each, so he should not be listed')]))
s = S('P14', 'iii'); J.append(('SV-11934', 'ui-P14-iii.png', 'Dashboard, DVI Test, Sales by Customer, Last 12 Months (the tile default)', [
  (s['range'], 'good', 'Date left on the tile default, Last 12 Months'),
  (s['row'], 'bad', 'ZZAUTOTEST Dash Q27 Labor Delta still +0.50 after the timesheet was corrected: should be 0.00 (Stats tab: 1.00 tech / 1.00 clocked)')]))
s = S('A1PIC', 'iii'); J.append(('SV-11937', 'ui-A1PIC-iii.png', 'Work In Progress, as of 10/29/2026, all customers, all locations, Approved - Partially Completed, sorted by Days Open', [
  (chip(s, 'filter_chip_customers'), 'good', 'Customer: All customers (no customer picked)'), (chip(s, 'filter_chip_locationIds'), 'good', 'Location: All locations'),
  (cell(s, 'Days Open'), 'bad', 'S2-38105 opened yesterday reads "1 days": should read "1 day"')]))
s = S('A2PIC', 'iii'); J.append(('SV-11938', 'ui-A2PIC-iii.png', 'Work In Progress, as of 10/29/2026, all customers, all locations, Approved - Not Started, Parts Earned and Parts Remaining switched on', [
  (chip(s, 'filter_chip_customers'), 'good', 'Customer: All customers (no customer picked)'), (chip(s, 'filter_chip_locationIds'), 'good', 'Location: All locations'),
  (cell(s, 'Parts Earned'), 'bad', 'S2-33740 Parts Earned $0.00: should be $37.67 (both parts are marked Receive Later)'),
  (cell(s, 'Parts Remaining'), 'bad', 'Parts Remaining $37.67: should be $0.00')]))
s = S('A4', 'iii-default'); J.append(('SV-11939', 'ui-A4-iii-default.png', 'Shop Efficiency, DVI Test, Date Range: This month (the default), one timesheet running', [
  (s['chip'], 'good', 'Date Range left on its default, This month'),
  ({'x': 2592, 'y': 12, 'w': 560, 'h': 84}, 'good', 'A timesheet is running on S1-38220: 0.73 hours so far today (the timer at the top)'),
  (s['totals'], 'bad', 'Total Clocked Hours 8.52 leaves out the running timesheet: should be 8.52 + 0.73 = about 9.25 (Timesheet Activities, same range, includes it)')]))
s = S('A5HD', 'iii-csv'); J.append(('A5-held', 'ui-A5HD-iii-csv.png', 'payroll_timesheet.csv, Staging Heavy Duty - 9919, Custom 01/01/2026 - 10/29/2026 (widest)', [
  (s['marked'][0]['box'], 'bad', 'Haley Brown 6 Sep 2026: 28.50 Total Hours. Her 15 timesheets that day all fall between 7:00 and 9:00 PM, so it should be 2.00')]))
for key, src, title, marks in J:
    out = f'{EV}/{key}-replacement.png'
    cmd = ['python3', A, f'{EV}/{src}', out, '--title', title, '--scale', '2'] + [x for (bx, kind, text) in marks for x in ('--mark', f'{b(bx)}:{kind}:{text}')]
    r = subprocess.run(cmd, capture_output=True, text=True); print(key, r.returncode, (r.stderr or r.stdout).strip()[:200])
