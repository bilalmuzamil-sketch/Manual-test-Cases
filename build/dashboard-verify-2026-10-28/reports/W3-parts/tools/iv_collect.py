"""Inventory Value: every location (one by one + all four together) as of today and as of past days. Raw -> /tmp/cln/dv/w3/iv."""
from common import *
out = RAW + '/iv'; os.makedirs(out, exist_ok=True)
ALL = [w for w, _, _ in WORKPLACES]
import sys
TARGETS = WORKPLACES + [(ALL, 'ALL', 'America/Toronto')]
if len(sys.argv) > 1 and sys.argv[1] == 'ALL': TARGETS = [(ALL, 'ALL', 'America/Toronto')]
for wid, name, tz in TARGETS:
    key = 'ALL' if isinstance(wid, list) else wid
    w0 = ALL[3] if isinstance(wid, list) else wid
    change_loc(w0)
    today = dt.datetime.now(ZoneInfo(TZ[w0])).date()
    days = {'today': today, 'd-1': today - dt.timedelta(days=1), 'd-2': today - dt.timedelta(days=2), 'd-7': today - dt.timedelta(days=7),
            'd-30': today - dt.timedelta(days=30), 'd-60': today - dt.timedelta(days=60), 'd-90': today - dt.timedelta(days=90),
            'd-365': today - dt.timedelta(days=365), 'd-400': today - dt.timedelta(days=400), 'future': today + dt.timedelta(days=1)}
    for label, day in days.items():
        t0 = time.time(); st, d, rows, tot = iv_all(wid, day)
        json.dump({'wid': key, 'label': label, 'day': str(day), 'status': st, 'meta': (d if st != 200 else {k: v for k, v in d.items() if k != 'collection'}), 'rows': rows,
                   'fetched_at': dt.datetime.utcnow().isoformat()}, open(f'{out}/{key}__{label}.json', 'w'))
        print(name, label, day, st, len(rows), (d.get('as_of_date') if st == 200 else str(d)[:200]), tot, round(time.time() - t0, 1), flush=True)
