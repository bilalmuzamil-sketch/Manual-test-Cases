#!/usr/bin/env python3
"""A5 (held draft, Payroll Timesheet overlap) server cross-check, read-only, in the location's own zone (Rule 99):
the export the Export Reports screen requests (GET /api/reporting/export/payroll_timesheet) for (i) the draft's window,
(ii) the dialog default (replayed from the screen run if it recorded one), (iii) the widest window; plus the day's
clocks from Timesheet Activities and the UNION of their time (overlap counted once) = the expected figure.
Usage: TZ=<zone> a5srv.py <HD|DVI>"""
import csv, io, json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump, instants
key = sys.argv[1]
loc = use(key); w, tz = loc['wid'], loc['tz']
WHO, DAY, WIN = {'HD': ('Haley Brown', dt.date(2026, 9, 6), (dt.date(2026, 9, 1), dt.date(2026, 9, 30))),
                 'DVI': ('Admin Shopview', dt.date(2026, 10, 28), (dt.date(2026, 10, 28), dt.date(2026, 10, 28)))}[key]
today = dt.datetime.now(ZoneInfo(tz)).date()
out = {'loc': loc, 'who': WHO, 'day': DAY, 'exports': {}}


def export(label, f, t):
    s, e = instants(f, t, tz)
    c, b = get('/api/reporting/export/payroll_timesheet', [('range', 'custom'), ('start_date', s), ('end_date', e)], w)
    txt = b['data'][0] if c == 200 and b.get('data') else ''
    cur, day_rows, over = None, [], 0
    for r in csv.DictReader(io.StringIO(txt)):
        if r.get('Employee Name') and not r['Employee Name'].startswith('Total for'): cur = r['Employee Name']; continue
        if r.get('Date') and float(r.get('Total Hours') or 0) > 24: over += 1
        if cur == WHO and r.get('Date') == DAY.isoformat(): day_rows.append(r)
    out['exports'][label] = {'window': [f, t], 'status': c, 'target_day': day_rows, 'days_over_24_all_staff': over}
    print(label, f, t, c, 'days>24:', over, '|', WHO, DAY, [(r.get('Date'), r.get('Total Hours')) for r in day_rows])


export('i-draft-window', *WIN)
export('iii-widest', dt.date(today.year, 1, 1), today)
# the day's clocks (Timesheet Activities, same zone) and the union of their time
s, e = instants(DAY, DAY, tz)
c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
rows = [r for r in b['data']['collection'] if r['employee'] == WHO]
fmt = '%b %d, %Y %I:%M %p'
iv = sorted((dt.datetime.strptime(r['formatted_start_date_time'], fmt), dt.datetime.strptime(r['formatted_end_date_time'], fmt), r['hours']) for r in rows if r.get('formatted_end_date_time'))
union, cs, ce = 0.0, None, None
for a, z, h in iv:
    if cs is None or a > ce:
        if cs is not None: union += (ce - cs).total_seconds()
        cs, ce = a, z
    else: ce = max(ce, z)
if cs is not None: union += (ce - cs).total_seconds()
out['clocks'] = [(a.isoformat(), z.isoformat(), h) for a, z, h in iv]
out['sum_hours'] = round(sum(h for *_, h in iv), 2); out['union_hours_minute_precision'] = round(union / 3600, 2)
print('clocks', len(iv), 'sum of hours', out['sum_hours'], '| union (overlap once, minute precision):', out['union_hours_minute_precision'])
print('first/last', iv[0][:2] if iv else None, iv[-1][:2] if iv else None)
dump(f'srv-A5{key}', out)
