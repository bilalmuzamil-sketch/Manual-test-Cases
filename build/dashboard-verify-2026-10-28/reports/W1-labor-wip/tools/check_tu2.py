#!/usr/bin/env python3
"""TU part 2: (a) multi-location pooling S9-R4 / S9-R10, (b) the S1-R9 reconciliation with Timesheet
Activities per technician (TA filtered to the technician, same range, same single location — paired read),
(c) open (never clocked-out) records vs the 2026-10-22 ruling on SV-11688. Appends to results-tu2.json.
"""
import json, glob, collections, datetime as dt
import w1env
from w1env import curl, get, WORKPLACES

L = '/tmp/cln/w1/labor'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-tu2.json'
res = []
NAMES = {w[0]: w[1] for w in WORKPLACES}


def chk(cid, scope, rng, ok, detail, ref):
    res.append({'check': cid, 'scope': scope, 'range': rng, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'spec': ref})


# (a) pooling
for f in glob.glob(f'{L}/ALL/*__tu.json'):
    allr = json.load(open(f)); rng = allr['label']
    pooled = collections.defaultdict(lambda: collections.Counter()); locs = collections.defaultdict(set)
    for wid in NAMES:
        p = f'{L}/{wid}/{rng}__tu.json'
        try:
            tu = json.load(open(p))
        except FileNotFoundError:
            continue
        for r in tu['rows']:
            for k in ('total_seconds', 'wo_seconds', 'internal_seconds'):
                pooled[r['staff_id']][k] += r[k]
            if r['total_seconds'] > 0:
                locs[r['staff_id']].add(NAMES[wid])
    for r in allr['rows']:
        sid = r['staff_id']
        # open clocks drift between the per-location read and the ALL read -> tolerance 0.25 h
        ok = all(abs(r[k] - pooled[sid][k]) <= 900 for k in ('total_seconds', 'wo_seconds', 'internal_seconds'))
        chk('P1-all-locations=sum-of-locations', 'ALL', rng, ok, {'tech': r['technician_name'], 'all': r['total_seconds'], 'sum': pooled[sid]['total_seconds']}, 'S9-R4')
        exp_loc = 'Multiple' if len(locs[sid]) > 1 else (next(iter(locs[sid])) if locs[sid] else None)
        chk('P2-location-label', 'ALL', rng, r['location'] == exp_loc, {'tech': r['technician_name'], 'label': r['location'], 'expected': exp_loc}, 'S9-R10')
        for dd in (allr['daily'].get(sid) or []):
            pass

# (b) reconciliation with Timesheet Activities, per technician, closed records only
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    for rng in ('this_month', 'last_month', 'last_week', 'custom_0915_1014', 'yesterday'):
        try:
            tu = json.load(open(f'{L}/{wid}/{rng}__tu.json')); ta = json.load(open(f'{L}/{wid}/{rng}__ta.json'))
        except FileNotFoundError:
            continue
        win = [('range', 'custom'), ('start_date', tu['start']), ('end_date', tu['end'])]
        active = {r['staff_id'] for r in ta['rows'] if r.get('is_active')}
        for r in tu['rows']:
            c, b = get('/api/reporting/punch-clock-activities/custom', win + [('staffId', r['staff_id']), ('pagination[page]', 1), ('pagination[rowsPerPage]', 5)], wid)
            c2, b2 = get('/api/reporting/reports/technician-utilization', win + [('locations', wid), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid) if r['staff_id'] in active else (None, None)
            if c != 200:
                chk('R0-ta-200', wid, rng, False, {'status': c}, '-'); continue
            t = b['data']['metadata']['totals']
            ta_total = round(t['workOrderHours'] + t['internalHours'], 2)
            tu_total = round(r['total_seconds'] / 3600 + 1e-9, 2)
            cid = 'R1-TU-total=TA-total(closed)' if r['staff_id'] not in active else 'R2-TU-total=TA-total(has-open-clock)'
            chk(cid, wid, rng, abs(ta_total - tu_total) < 0.005, {'tech': r['technician_name'], 'TU': tu_total, 'TA': ta_total,
                'TA_wo': t['workOrderHours'], 'TU_wo': round(r['wo_seconds'] / 3600, 2), 'TA_int': t['internalHours'], 'TU_int': round(r['internal_seconds'] / 3600, 2)}, 'S1-R9')

# (c) open records (never clocked out) — TA rows flagged is_active, per location, this_month
for wid, name, tz in WORKPLACES:
    try:
        ta = json.load(open(f'{L}/{wid}/this_month__ta.json')); tu = json.load(open(f'{L}/{wid}/this_month__tu.json'))
    except FileNotFoundError:
        continue
    read = dt.datetime.fromisoformat(ta['read_at_utc']).timestamp()
    for r in ta['rows']:
        if not r.get('is_active'):
            continue
        st = dt.datetime.strptime(r['formatted_start_date_time'], '%b %d, %Y %I:%M %p')
        tur = [x for x in tu['rows'] if x['staff_id'] == r['staff_id']]
        res.append({'check': 'O1-open-record', 'scope': wid, 'range': 'this_month', 'result': 'INFO',
                    'detail': {'tech': r['employee'], 'clock_in_local': r['formatted_start_date_time'], 'row_hours': r['hours'],
                               'tu_total_h': round(tur[0]['total_seconds'] / 3600, 2) if tur else None}, 'spec': 'SV-11688 ruling: open > 24 h left out'})

json.dump(res, open(OUT, 'w'), indent=0)
tl = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(tl.items()):
    print(f'{c:42s} {rr} {n}')
for r in res:
    if r['result'] == 'FAIL' or r['check'] == 'O1-open-record':
        print(r['result'], r['check'], NAMES.get(r['scope'], r['scope'])[:14], r['range'], json.dumps(r['detail'])[:260])
