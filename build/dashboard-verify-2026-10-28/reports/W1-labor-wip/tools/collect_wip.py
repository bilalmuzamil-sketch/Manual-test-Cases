#!/usr/bin/env python3
"""Collect the Work In Progress report, every tab, every page, for every location (+ all locations),
for as-of TODAY, YESTERDAY, 7 days ago and a day before snapshots began.

SECRET-FREE: cookie read at run time from /tmp/cln/w1/sess-w1.txt (w1env.py), never printed.
Raw -> /tmp/cln/w1/wip/<scope>/<asof>__<tab>.json  (staging business data stays out of git).
Usage: collect_wip.py [days_back ...]   (default: 0 1 7 400)
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
import w1env  # own session (see w1env.py)
from w1env import curl, WORKPLACES
from w1env import instants, get

OUT = '/tmp/cln/w1/wip'
TABS = ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates']


def fetch_tab(wid_header, scope_ids, s, e, tab):
    rows, page, first = [], 1, None
    while True:
        c, b = get('/api/reporting/reports/work-in-progress',
                   [('from', s), ('to', e), ('locations', ','.join(scope_ids)), ('tab', tab),
                    ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], wid_header)
        if c != 200:
            return {'status': c, 'body': b}
        d = b['data']
        if first is None:
            first = {k: v for k, v in d.items() if k != 'collection'}
        rows += d['collection']
        if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']:
            break
        page += 1
    first['collection'] = rows
    first['status'] = 200
    return first


def main(days_back):
    scopes = [(w[0], w[1], w[2], [w[0]]) for w in WORKPLACES]
    scopes.append((WORKPLACES[0][0], 'ALL', WORKPLACES[0][2], [w[0] for w in WORKPLACES]))
    for wid, name, tz, ids in scopes:
        curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
        today = dt.datetime.now(ZoneInfo(tz)).date()
        d = os.path.join(OUT, 'ALL' if name == 'ALL' else wid); os.makedirs(d, exist_ok=True)
        for n in days_back:
            day = today - dt.timedelta(days=n)
            s, e = instants(day, day, tz)
            for tab in TABS:
                r = fetch_tab(wid, ids, s, e, tab)
                r.update({'asof': day.isoformat(), 'start': s, 'end': e, 'scope': ids, 'tz': tz,
                          'read_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')})
                json.dump(r, open(os.path.join(d, f'{day.isoformat()}__{tab}.json'), 'w'))
                print(name, day, tab, r.get('status'), len(r.get('collection', [])), flush=True)


if __name__ == '__main__':
    main([int(x) for x in sys.argv[1:]] or [0, 1, 7, 400])
