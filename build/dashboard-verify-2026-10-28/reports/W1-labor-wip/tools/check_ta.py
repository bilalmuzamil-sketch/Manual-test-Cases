#!/usr/bin/env python3
"""Timesheet Activities — full pass over every row and footer collected by collect_labor.py (own session),
every location x 9 ranges. Written sources (Jira, read 2026-10-28): SV-2030 (one clock per row, one date per
line, a clock past 11:59:59 pm split into a new row at 12:00 am, Hours with 2 decimals, Work Order column,
Clock Activity = line or department), SV-2662 ("it should only show the hours for that day ... The total hours
should never contain a value more than 24"), SV-3239 (footer = sum of ALL filtered results), SV-10698 (Cody
McCarthy 2026-09-30: rows and Totals ALWAYS add up — already filed, Blocked), SV-11688 ruling (open > 24 h left
out, TA follows the same rule). Independent completeness check against RAW clock records
(GET /api/technician-tasks/list). Writes results-ta.json.
"""
import json, glob, collections, datetime as dt
from zoneinfo import ZoneInfo

L = '/tmp/cln/w1/labor'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-ta.json'
res = []


def chk(cid, scope, rng, ok, detail, ref):
    res.append({'check': cid, 'scope': scope, 'range': rng, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'spec': ref})


def p(s):
    return dt.datetime.strptime(s, '%b %d, %Y %I:%M %p')


clocks = {json.load(open(f))['wid']: json.load(open(f)) for f in glob.glob('/tmp/cln/w1/clocks/*.json')}
for f in sorted(glob.glob(f'{L}/*/*__ta.json')):
    scope = f.split('/')[-2]; ta = json.load(open(f)); rng = ta['label']
    if ta['status'] != 200:
        chk('TA0-200', scope, rng, False, {'status': ta['status']}, '-'); continue
    rows, tot = ta['rows'], ta['totals']['totals']
    f0, t0 = dt.date.fromisoformat(ta['from']), dt.date.fromisoformat(ta['to'])
    sw, si = round(sum(r['wo_hours'] for r in rows), 2), round(sum(r['internal_hours'] for r in rows), 2)
    has_open = any(r['is_active'] for r in rows)
    cid = 'TA1-footer=sum-of-rows' + ('(open clock present)' if has_open else '')
    chk(cid + '-WO', scope, rng, abs(sw - tot['workOrderHours']) <= 0.005 * max(1, len(rows)) ** 0.5 + 0.011,
        {'rows': sw, 'footer': tot['workOrderHours'], 'n': len(rows)}, 'SV-3239 / SV-10698')
    chk(cid + '-Internal', scope, rng, abs(si - tot['internalHours']) <= 0.005 * max(1, len(rows)) ** 0.5 + 0.011,
        {'rows': si, 'footer': tot['internalHours'], 'n': len(rows)}, 'SV-3239 / SV-10698')
    for r in rows:
        who = (r['employee'], r['date'], r['clock_in'], r['work_order'] or r['clock_activity'])
        chk('TA2-hours=wo+internal', scope, rng, abs(r['hours'] - r['wo_hours'] - r['internal_hours']) < 0.006, {'row': who}, 'SV-2030 columns')
        kind_ok = (r['work_order'] and r['wo_hours'] == r['hours'] and not r['department_id']) or (r['department_id'] and r['internal_hours'] == r['hours'] and not r['work_order'])
        chk('TA3-wo-or-department', scope, rng, bool(kind_ok), {'row': who, 'wo': r['work_order'], 'dept': r['department_id']}, 'SV-2030')
        d = dt.datetime.strptime(r['date'], '%b %d %Y').date()
        chk('TA4-row-date-in-range', scope, rng, f0 <= d <= t0, {'row': who}, 'SV-2030 (Fabian 2024-02-21: only that day\'s records)')
        if not r['is_active']:
            ci = dt.datetime.combine(d, dt.datetime.strptime(r['clock_in'], '%I:%M %p').time())
            co = dt.datetime.combine(d, dt.datetime.strptime(r['clock_out'], '%I:%M %p').time())
            if co < ci or (r['clock_out'] == '11:59 PM' and r['hours'] > 0):
                co = co if co >= ci else co + dt.timedelta(days=1)
            mins = (co - ci).total_seconds() / 3600
            if r['clock_out'] == '11:59 PM':
                mins += 1 / 60  # a piece cut at the day end runs to 12:00 AM
            chk('TA6-hours-match-clock-in/out-columns', scope, rng, abs(mins - r['hours']) <= 0.035,
                {'row': who, 'in': r['clock_in'], 'out': r['clock_out'], 'in_out_h': round(mins, 3), 'hours': r['hours'],
                 'record': [r['formatted_start_date_time'], r['formatted_end_date_time']]}, 'SV-2030 Hours / SV-2662')
        chk('TA7-row-hours<=24', scope, rng, r['hours'] <= 24.0001, {'row': who, 'hours': r['hours'], 'open': r['is_active']}, 'SV-2662')
    # TA8 completeness vs RAW work-order clock records overlapping the window (closed ones)
    if scope in clocks:
        ws = dt.datetime.fromisoformat(ta['start'].replace('Z', '+00:00')); we = dt.datetime.fromisoformat(ta['end'].replace('Z', '+00:00'))
        raw = set()
        for c in clocks[scope]['rows']:
            if c['workplace_id'] != scope or not c['end_date_display'] or not c['work_order_id']:
                continue
            s = dt.datetime.strptime(c['start_date_display'], '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc)
            e = dt.datetime.strptime(c['end_date_display'], '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc)
            if s < we and e > ws:
                raw.add(c['id'])
        listed = {r['id'] for r in rows if r['work_order']}
        miss, extra = raw - listed, {i for i in listed if i not in raw}
        chk('TA8-every-raw-WO-clock-listed', scope, rng, not miss, {'raw': len(raw), 'listed': len(listed), 'missing': sorted(miss)[:5], 'n_missing': len(miss)}, 'SV-2030 one clock per row')
        res.append({'check': 'TA8b-listed-not-in-raw-INFO', 'scope': scope, 'range': rng, 'result': 'INFO', 'detail': {'n': len(extra), 'ex': sorted(extra)[:3]}, 'spec': '-'})

json.dump(res, open(OUT, 'w'), indent=0)
tl = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(tl.items()):
    print(f'{c:55s} {rr} {n}')
seen = collections.Counter()
for r in res:
    if r['result'] == 'FAIL' and seen[r['check']] < 6:
        seen[r['check']] += 1
        print('FAIL', r['check'], r['scope'][:8], r['range'], json.dumps(r['detail'])[:250])
