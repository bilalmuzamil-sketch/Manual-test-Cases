#!/usr/bin/env python3
"""A5: every Timesheet Activities row for one employee in September 2026 at each location (each read in its own zone,
Rule 99), to explain the Payroll Timesheet export's day totals. Usage: TZ=<zone> pr_clocks.py <LOCKEY> "<employee>" """
import json, os, sys, datetime as dt
from p2aenv import get, instants, use
key, who = sys.argv[1], sys.argv[2]
wid, tz, name, c = use(key); assert os.environ.get('TZ') == tz
s, e = instants(dt.date(2026, 9, 1), dt.date(2026, 9, 30), tz)
rows, page = [], 1
while True:
    c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], wid)
    rows += b['data']['collection']
    if len(b['data']['collection']) < 1000: break
    page += 1
m = [r for r in rows if r['employee'] == who]
json.dump(m, open(f'/tmp/cln/p2a/srv/ta_sep_{key}_{who.replace(" ", "_")}.json', 'w'), indent=1)
print(name, tz, who, len(m), 'rows; total', round(sum(r['hours'] for r in m), 2))
byday = {}
for r in m: byday.setdefault(r['date'], []).append(r)
for d in sorted(byday, key=lambda x: dt.datetime.strptime(x, '%b %d %Y')):
    rr = byday[d]; print(d, round(sum(r['hours'] for r in rr), 2), '|', '; '.join(f"{r['formatted_start_date_time']} -> {r['formatted_end_date_time']} = {r['hours']} [{(r['work_order'] or r['clock_activity'] or '')[:20]}]" for r in rr)[:900])
