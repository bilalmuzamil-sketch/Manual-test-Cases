#!/usr/bin/env python3
"""Board snapshot for the Schedule branch.

The board endpoint refuses a range over 62 days, so the window is walked in
slices and merged by id.  A per-shift SHA-256 over the sorted field set is what
makes "the board is identical" a measurement rather than an assertion: an id
set can match while a shift has silently moved technician or lost 450 minutes,
which is exactly what happened on 4 August and was found only at the finish.

Usage: board_snap.py <out.json>
"""
import json, sys, hashlib, urllib.request, datetime

API = 'https://sv8685api.qa.shopview.com'
CK = open('/tmp/qa-cookies/schedule-cookie-header.txt').read().strip()

def get(path):
    req = urllib.request.Request(API + path)
    req.add_header('Cookie', CK)
    req.add_header('Accept', 'application/json')
    req.add_header('User-Agent', 'Mozilla/5.0')
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.loads(r.read().decode())

def h(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(',', ':')).encode()).hexdigest()[:16]

def snap(start='2026-06-01', end='2026-11-30'):
    d0 = datetime.date.fromisoformat(start); d1 = datetime.date.fromisoformat(end)
    shifts, events, series, windows = {}, {}, {}, 0
    cur = d0
    while cur < d1:
        nxt = min(cur + datetime.timedelta(days=60), d1)
        b = get(f'/api/schedule/board?from={cur}T00:00:00Z&to={nxt}T00:00:00Z')['data']['board']
        for s in b.get('shifts') or []:
            shifts[s['id']] = s
        for e in b.get('events') or []:
            events[e['id']] = e
        for s in b.get('series') or []:
            series[s['id']] = s
        windows += len(b.get('workingWindows') or [])
        cur = nxt
    return {
        'range': [start, end],
        'shifts': len(shifts), 'events': len(events), 'series': len(series),
        'shift_ids': sorted(shifts), 'event_ids': sorted(events), 'series_ids': sorted(series),
        # per-object hash: catches a move/duration change that an id set cannot
        'per_shift': {k: h(v) for k, v in sorted(shifts.items())},
        'per_event': {k: h(v) for k, v in sorted(events.items())},
        'per_series': {k: h(v) for k, v in sorted(series.items())},
        'read_at_utc': datetime.datetime.utcnow().isoformat() + 'Z',
    }

def diff(a, b):
    """Return a plain-language difference report between two snapshots."""
    out = []
    for kind in ('shift', 'event', 'series'):
        ka, kb = set(a[kind + '_ids']), set(b[kind + '_ids'])
        for i in sorted(kb - ka): out.append(f'ADDED   {kind} {i}')
        for i in sorted(ka - kb): out.append(f'REMOVED {kind} {i}')
        pa, pb = a['per_' + kind], b['per_' + kind]
        for i in sorted(ka & kb):
            if pa[i] != pb[i]: out.append(f'CHANGED {kind} {i}  {pa[i]} -> {pb[i]}')
    return out

if __name__ == '__main__':
    s = snap()
    json.dump(s, open(sys.argv[1], 'w'), indent=1)
    print(f"shifts={s['shifts']} events={s['events']} series={s['series']} -> {sys.argv[1]}")
