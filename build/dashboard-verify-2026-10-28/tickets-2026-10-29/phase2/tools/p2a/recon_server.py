#!/usr/bin/env python3
"""p2a server-side re-check (read-only) for A1 (WIP Days Open wording), A2 (WIP received-later part), A3 (TA deleted WO),
A5 (Payroll Timesheet export > 24 h). Run with TZ=<location zone> (Rule 99). Writes /tmp/cln/p2a/srv/*.json + prints a summary."""
import json, os, sys, datetime as dt, collections
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from p2aenv import curl, get, instants, use
OUT = '/tmp/cln/p2a/srv'; item = sys.argv[1]
def dump(n, o): json.dump(o, open(f'{OUT}/{n}.json', 'w'), indent=1, default=str)
if item in ('A1', 'A2'):
    wid, tz, name, c = use('HD'); assert os.environ.get('TZ') == tz, 'run with TZ=' + tz
    today = dt.datetime.now(ZoneInfo(tz)).date(); s, e = instants(today, today, tz)
    allrows = {}
    for tab in ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates']:
        rows, page = [], 1
        while True:
            c, b = get('/api/reporting/reports/work-in-progress', [('from', s), ('to', e), ('locations', wid), ('tab', tab), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], wid)
            d = b['data']; rows += d['collection']
            if len(rows) >= d['pagination']['rowsNumber'] or not d['collection']: break
            page += 1
        allrows[tab] = rows
    dump('wip_hd', {'read_at_utc': dt.datetime.utcnow().isoformat(), 'tz': tz, 'today': today, 'rows': allrows})
    r0 = allrows['ApprovedNotStarted'][0]; print('keys', list(r0)[:40])
    dk = [k for k in r0 if 'day' in k.lower()]; print('day keys', dk)
    cnt = collections.Counter(r.get(dk[0]) for t in allrows.values() for r in t) if dk else None
    print('days_open distribution (first 8):', sorted(cnt.items(), key=lambda x: (x[0] is None, x[0]))[:8] if cnt else None)
    ones = [(t, r.get('work_order_number') or r.get('display_number'), r.get(dk[0]), r.get('created_at') or r.get('start_date')) for t, rr in allrows.items() for r in rr if dk and r.get(dk[0]) == 1]
    print('rows with 1 day:', len(ones), ones[:6])
    for wo in ['S2-33740', 'S2-33465', 'S2-38040', 'S2-31596', 'S2-33339']:
        hit = [(t, {k: r.get(k) for k in r if any(x in k for x in ('parts', 'labor', 'number', 'total'))}) for t, rr in allrows.items() for r in rr if wo in json.dumps(r)]
        print(wo, json.dumps(hit)[:500])
if item == 'A3':
    wid, tz, name, c = use('HD'); assert os.environ.get('TZ') == tz
    today = dt.datetime.now(ZoneInfo(tz)).date(); s, e = instants(dt.date(today.year, 1, 1), today, tz)
    rows, page = [], 1
    while True:
        c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], wid)
        d = b['data']; rows += d['collection']
        if len(d['collection']) < 1000: break
        page += 1
    dump('ta_hd_year', {'read_at_utc': dt.datetime.utcnow().isoformat(), 'tz': tz, 'rows': rows, 'meta': d.get('metadata')})
    print('rows', len(rows), 'keys', list(rows[0]))
    blank = [r for r in rows if not r.get('work_order') and not r.get('department_id')]
    print('blank-WO rows', len(blank)); [print(json.dumps(r)[:600]) for r in blank[:6]]
if item == 'A5':
    wid, tz, name, c = use('HD'); assert os.environ.get('TZ') == tz
    s, e = instants(dt.date(2026, 9, 1), dt.date(2026, 9, 30), tz)
    out = {}
    for params in ([('range', 'custom'), ('start_date', s), ('end_date', e)], [('range', 'last_month')]):
        c, b = get('/api/reporting/export/payroll_timesheet', params, wid); out[params[0][1]] = {'status': c, 'head': json.dumps(b)[:300]}
        print(params[0][1], c, json.dumps(b)[:200])
    dump('payroll_probe', out)
    # the clocks behind Admin Shopview 10 Sep and 17 Sep, Haley Brown 6 Sep
    for day in (dt.date(2026, 9, 10), dt.date(2026, 9, 17), dt.date(2026, 9, 6)):
        s, e = instants(day, day, tz)
        c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid)
        rr = b['data']['collection']; dump(f'ta_hd_{day}', {'tz': tz, 'rows': rr, 'meta': b['data'].get('metadata')})
        for who in ('Admin Shopview', 'Haley Brown'):
            m = [r for r in rr if who in json.dumps(r)]
            if m: print(day, who, len(m), [json.dumps({k: r.get(k) for k in r if any(x in k for x in ('clock', 'start', 'end', 'hour', 'total', 'number', 'date'))})[:330] for r in m][:8])
