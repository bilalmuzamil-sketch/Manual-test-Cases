"""Collect every Parts Velocity preset x 4 locations x 3 Type values (FULL pass). Raw -> /tmp/cln/dv/w3/pv."""
from common import *
out = RAW + '/pv'; os.makedirs(out, exist_ok=True)
log = []
for wid, name, tz in WORKPLACES:
    change_loc(wid)
    today = dt.datetime.now(ZoneInfo(tz)).date()
    for label, (f, t) in ranges(today).items():
        for typ in ('both', 'inventory', 'special_order'):
            t0 = time.time(); st, pg, rows = pv_all(wid, f, t, typ)
            json.dump({'wid': wid, 'range': label, 'from': str(f), 'to': str(t), 'type': typ, 'status': st, 'pagination': pg, 'rows': rows, 'fetched_at': dt.datetime.utcnow().isoformat()},
                      open(f'{out}/{wid}__{label}__{typ}.json', 'w'))
            log.append((name, label, typ, st, len(rows), round(time.time() - t0, 1)))
            print(*log[-1], flush=True)
json.dump(log, open(out + '/_log.json', 'w'))
