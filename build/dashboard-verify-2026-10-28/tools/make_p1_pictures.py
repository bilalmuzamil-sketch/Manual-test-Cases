#!/usr/bin/env python3
"""Annotate the Phase-1 pictures (29 Oct 2026) from the boxes recorded by evidence_phase1.mjs / evidence_q27.mjs.
Every source picture was taken with the browser in the location's own time zone (meta.json: browser_zone)."""
import json, subprocess, os
T = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(os.path.dirname(T), 'tickets-2026-10-29', 'pictures')
A = os.path.join(T, 'annotate_v2.py')
def m(p): return json.load(open(p))
def b(x): return f"{x['x']},{x['y']},{x['w']},{x['h']}"
def run(src, out, title, marks):
    cmd = ['python3', A, src, os.path.join(OUT, out), '--scale', '2', '--title', title]
    for box, kind, text in marks: cmd += ['--mark', f'{b(box)}:{kind}:{text}']
    subprocess.run(cmd, check=True); print(out)
# P1-1 declined line
F = m('/tmp/cln/dv/p1/F2/meta.json')['shots']; F1 = F['1-dashboard-tiles']; F2t = F['2-dashboard-te-table']
run('/tmp/cln/dv/p1/F2/2-dashboard-te-table.png', 'P1-1-1-dashboard-technician-efficiency.png',
    'Dashboard, DVI Test, Technician Efficiency, This Week (Oct 25 - Oct 28, 2026)',
    [(F1['te']['meta'], 'bad', 'Includes the declined lines: their 1.02 clocked hours are in these 5.06 Clocked hours (and their tech time in Invoiced Tech Hrs)'),
     (F1['be']['meta'], 'good', 'Billing Efficiency already leaves declined lines out: 4.04 Clocked, which is 5.06 minus the 1.02 declined hours'),
     (F2t['row_Fabian Bonjean']['box'], 'bad', 'Fabian Bonjean: 2.00 / 1.50 / 133.33%. On S1-38198 only line 1 (1 hour) was billed. Should read 1.00 / 1.00 / 100.00%')])
G = m('/tmp/cln/dv/p1/F2b/meta.json')['shots']; L = G['3-work-order-lines']
run('/tmp/cln/dv/p1/F2b/3-work-order-lines.png', 'P1-1-2-work-order-S1-38198-lines.png', 'Work order S1-38198, Lines tab',
    [(L['complete'], 'good', 'Line 1 is Complete and billed: 1.00 hour clocked, 1.00 hour of tech time'),
     (L['declined'], 'bad', 'Line 2 was Declined by the customer. It is not billed, yet its hour is counted on the Dashboard')])
I = G['4-invoice']
run('/tmp/cln/dv/p1/F2b/4-invoice.png', 'P1-1-3-invoice-S1-38198.png', 'Work order S1-38198, Finance tab (the invoice)',
    [(I['labor'], 'good', 'The invoice bills one line only: Labor Total $135.00 (line 1)')])
# P1-2 clock under 36 seconds
E = m('/tmp/cln/dv/p1/TE28/meta.json')['shots']; E1 = E['1-dashboard-te-tile']; E2 = E['2-dashboard-te-table']
run('/tmp/cln/dv/p1/TE28/2-dashboard-te-table.png', 'P1-2-1-dashboard-technician-efficiency.png',
    'Dashboard, Staging Lethbridge - 4310, Technician Efficiency, Aug 25, 2026',
    [(E1['meta'], 'bad', '33.50 Invoiced Tech Hrs: the 0.50 hour of line 4 on S3-17383 is missing. Should read 34.00 / 29.36 = 115.80%'),
     (E2['row_Joseph Nelson']['box'], 'bad', 'Joseph Nelson: 9.75 Invoiced Tech Hrs and 131.22%. Should read 10.25 and 137.95%')])
W = E['3-work-order-line-4']
run('/tmp/cln/dv/p1/TE28/3-work-order-line-4.png', 'P1-2-2-work-order-S3-17383-line-4.png', 'Work order S3-17383, Lines tab',
    [({'x': 700, 'y': 1585, 'w': 2450, 'h': 95}, 'good', 'Line 4 has 0.50 hour of tech time. Joseph Nelson clocked 30 seconds on it (shown as 0.01)')])
R = m('/tmp/cln/dv/p1/TE28b/meta.json')['shots']['4-te-report-line']
run('/tmp/cln/dv/p1/TE28b/4-te-report-line.png', 'P1-2-3-technician-efficiency-report-line.png',
    'Reports > Technician Efficiency > Invoiced, Last quarter, Joseph Nelson expanded',
    [(R['cells'][5]['box'] if len(R['cells']) > 5 else R['line']['box'], 'bad', 'Invoiced Tech Hrs 0 for line 4. Should be 0.50, the line tech time'),
     (R['cells'][4]['box'] if len(R['cells']) > 4 else R['line']['box'], 'good', 'Clocked 0.01 (30 seconds)')])
# P1-3 technician with only seconds
U = m('/tmp/cln/dv/p1/TU10/meta.json')['shots']
run('/tmp/cln/dv/p1/TU10/1-dashboard-tu-table.png', 'P1-3-1-dashboard-technician-utilization.png',
    'Dashboard, Staging Heavy Duty - 9919, Technician Utilization, This Month (table sorted by Total Hours)',
    [(U['1-dashboard-tu-table']['qa']['box'], 'bad', 'QA Technician is listed with 0.00 hours and n/a. Their only clock this month lasted a few seconds. They should not be listed')])
run('/tmp/cln/dv/p1/TU10/2-tu-report.png', 'P1-3-2-technician-utilization-report.png',
    'Reports > Technician Utilization, This month (sorted by Total Hours)',
    [(U['2-tu-report']['qa']['box'], 'bad', 'Same row on the report: 0.00 hours and Utilization -. Under 0.01 hours counts as no time, so it should be left off')])
# P1-4 Labor Delta after the timesheet is corrected
Q = m('/tmp/cln/q27/ev/meta.json')['shots']
run('/tmp/cln/q27/ev/4-edit-dialog.png', 'P1-4-1-edit-timesheet.png', 'Reports > Timesheet Activities > Edit timesheet (S1-38215)',
    [(Q['4-edit-dialog']['startBox'], 'good', 'The manager corrects Start from 07:07 PM to 06:37 PM: the clock becomes 1.00 hour')])
run('/tmp/cln/q27/ev/6-stats-after.png', 'P1-4-2-stats-tab-after.png', 'Work order S1-38215, Stats tab, after the correction',
    [({'x': 626, 'y': 376, 'w': 2526, 'h': 88}, 'good', '1.00 Tech hours and 1.00 Clocked hours: the Labor Delta is now 0.00')])
run('/tmp/cln/q27/ev/7-dashboard-sbc-after.png', 'P1-4-3-dashboard-sales-by-customer-after.png',
    'Dashboard, DVI Test, Sales by Customer, This Week, after the correction',
    [(Q['7-dashboard-sbc-after']['row']['box'], 'bad', 'Labor Delta still +0.50, the figure from before the correction. Should read 0.00')])
