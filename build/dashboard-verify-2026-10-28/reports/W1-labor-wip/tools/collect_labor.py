#!/usr/bin/env python3
"""Collect Technician Utilization (rows + summary + per-technician daily), Timesheet Activities (every row
+ footer), and Shop Efficiency for every location (+ all locations for TU) x a set of ranges.
Paired reads: for each location x range the three reports are read back-to-back (open clocks drift).
Raw -> /tmp/cln/w1/labor/<scope>/<range>__<report>.json
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
import w1env  # own session (see w1env.py)
from w1env import curl, WORKPLACES
from w1env import instants, get

OUT = '/tmp/cln/w1/labor'


def ranges(today):
    first = today.replace(day=1)
    lm_end = first - dt.timedelta(days=1)
    wk0 = today - dt.timedelta(days=(today.weekday() + 1) % 7)
    return {
        'today': (today, today),
        'yesterday': (today - dt.timedelta(days=1), today - dt.timedelta(days=1)),
        'this_week': (wk0, today),
        'last_week': (wk0 - dt.timedelta(days=7), wk0 - dt.timedelta(days=1)),
        'this_month': (first, today),
        'last_month': (lm_end.replace(day=1), lm_end),
        'custom_0915_1014': (dt.date(2026, 9, 15), dt.date(2026, 10, 14)),
        'custom_dst_0301_0314': (dt.date(2026, 3, 1), dt.date(2026, 3, 14)),
        'this_year': (dt.date(today.year, 1, 1), today),
    }


def pages(path, params, wid, key='collection'):
    out, page, last = [], 1, None
    while True:
        c, b = get(path, params + [('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], wid)
        if c != 200:
            return c, b, out
        last = b
        col = b['data'][key]; out += col
        if len(col) < 1000:
            break
        page += 1
    return 200, last, out


def main(only=None):
    scopes = [(w[0], w[1], w[2], [w[0]]) for w in WORKPLACES]
    scopes.append((WORKPLACES[0][0], 'ALL', WORKPLACES[0][2], [w[0] for w in WORKPLACES]))
    for wid, name, tz, ids in scopes:
        if only and only not in name:
            continue
        curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
        today = dt.datetime.now(ZoneInfo(tz)).date()
        d = os.path.join(OUT, 'ALL' if name == 'ALL' else wid); os.makedirs(d, exist_ok=True)
        for label, (f, t) in ranges(today).items():
            s, e = instants(f, t, tz)
            win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
            meta = {'label': label, 'from': f.isoformat(), 'to': t.isoformat(), 'start': s, 'end': e, 'tz': tz, 'scope': ids,
                    'read_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}
            c, b, rows = pages('/api/reporting/reports/technician-utilization', win + [('locations', ','.join(ids))], wid)
            tu = dict(meta, status=c, rows=rows, summary=(b or {}).get('data', {}).get('summary') if c == 200 else b)
            # daily breakdown for every technician (load-on-expand endpoint)
            daily = {}
            if c == 200 and label not in ('this_year',):
                for r in rows:
                    c2, b2 = get(f"/api/reporting/reports/technician-utilization/{r['staff_id']}/daily", win + [('locations', ','.join(ids))], wid)
                    daily[r['staff_id']] = b2['data']['collection'] if c2 == 200 else {'status': c2, 'body': b2}
            tu['daily'] = daily
            json.dump(tu, open(os.path.join(d, f'{label}__tu.json'), 'w'))
            if name != 'ALL':
                c, b, rows = pages(f'/api/reporting/punch-clock-activities/custom', win, wid)
                ta = dict(meta, status=c, rows=rows, totals=(b or {}).get('data', {}).get('metadata') if c == 200 else b)
                json.dump(ta, open(os.path.join(d, f'{label}__ta.json'), 'w'))
                c, b = get('/api/reporting/shop-billing-efficiency/custom', win, wid)
                json.dump(dict(meta, status=c, body=b), open(os.path.join(d, f'{label}__se.json'), 'w'))
            print(name, label, 'tu', tu['status'], len(tu['rows']), flush=True)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
