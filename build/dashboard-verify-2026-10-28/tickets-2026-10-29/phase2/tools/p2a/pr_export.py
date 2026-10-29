#!/usr/bin/env python3
"""A5: read the Payroll Timesheet export (as the Export Reports screen requests it) for given windows and print one
employee's day rows. Usage: TZ=<zone> pr_export.py <LOCKEY> "<employee>" <from> <to> [<from> <to> ...]"""
import json, os, sys, csv, io, datetime as dt
from p2aenv import get, instants, use
key, who = sys.argv[1], sys.argv[2]; wins = sys.argv[3:]
wid, tz, name, c = use(key); assert os.environ.get('TZ') == tz
for f, t in zip(wins[::2], wins[1::2]):
    if f == 'preset':
        c, b = get('/api/reporting/export/payroll_timesheet', [('range', t)], wid)
    else:
        s, e = instants(dt.date.fromisoformat(f), dt.date.fromisoformat(t), tz)
        c, b = get('/api/reporting/export/payroll_timesheet', [('range', 'custom'), ('start_date', s), ('end_date', e)], wid)
    txt = b['data'][0] if c == 200 and b.get('data') else ''
    open(f'/tmp/cln/p2a/srv/payroll_{key}_{f}_{t}.csv', 'w').write(txt)
    cur, out = None, []
    for r in csv.DictReader(io.StringIO(txt)):
        if r['Employee Name'] and not r['Employee Name'].startswith('Total for'): cur = r['Employee Name']; continue
        if cur == who and (r['Date'] or r['Employee Name']): out.append((r['Date'] or r['Employee Name'], r['Total Hours']))
    over = sum(1 for r in csv.DictReader(io.StringIO(txt)) if r['Date'] and float(r['Total Hours'] or 0) > 24)
    print(f'{f}..{t}', c, 'days>24 (all employees):', over, '|', who, out)
