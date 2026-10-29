# OBS B: test three readings of "Last Sale" against server data with exact UTC sale times.
#   H_elapsed = floor((now - last sale time) / 24 h)      H_utc = UTC calendar days      H_loc = calendar days in the location's zone
# Candidates: inventory rows at the location with Last Sale 0..3 (all-time value; window = 366 days so the row is listed).
# Sale time = the newest stock-decrementing pick in the part's history (historyDate/Time are UTC: S1-38206 pick 20:34:00 = WO history
# 2026-10-28T20:34:01+00:00). SECRET-FREE. Usage: TZ=<zone> python3 obsb_test.py DVI|HD|LB|QB
import os, sys, json, datetime as dt, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
W = {'DVI': DVI, 'HD': HD, 'LB': 'f8a8b802-7780-4b16-bf10-343caeb616b2', 'QB': '25a0d576-b371-4b82-bef4-41ba977f31c2'}
key = sys.argv[1]; wid = W[key]; zone = TZ[wid]; assert os.environ.get('TZ') == zone
change_loc(wid)
now = dt.datetime.now(dt.timezone.utc); today = now.astimezone(ZoneInfo(zone)).date()
st, pg, rows = pv_all(wid, [wid], today - dt.timedelta(days=365), today, zone, typ='inventory', sort='last_sale', desc=False, per=200)
cand = [r for r in rows if r.get('last_sale') is not None and r['last_sale'] <= 3][:30]
read_at = dt.datetime.now(dt.timezone.utc)
res = []
for r in cand:
    s2, h = get(f"/api/parts/history/{r['key']}?" + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 50}), wid)
    ev = [e for e in (h.get('data', {}).get('collection', []) if s2 == 200 else []) if e['eventType'] == 'part.picked.qty' and (e.get('quantityChange') or 0) < 0]
    if not ev: res.append({'part': r['part_number'], 'reported': r['last_sale'], 'note': 'no pick event in history'}); continue
    t = max(dt.datetime.fromisoformat(f"{e['historyDate']}T{e['historyTime']}+00:00") for e in ev)
    H = {'elapsed': int((read_at - t).total_seconds() // 86400), 'utc': (read_at.date() - t.date()).days,
         'loc': (read_at.astimezone(ZoneInfo(zone)).date() - t.astimezone(ZoneInfo(zone)).date()).days}
    res.append({'part': r['part_number'], 'reported': r['last_sale'], 'sale_utc': t.isoformat(), 'sale_local': t.astimezone(ZoneInfo(zone)).isoformat(), **H})
agree = {h: sum(1 for x in res if 'elapsed' in x and x[h] == x['reported']) for h in ('elapsed', 'utc', 'loc')}
n = sum(1 for x in res if 'elapsed' in x)
out = {'meta': {'location': NAME[wid], 'location_tz': zone, 'process_TZ': os.environ['TZ'], 'read_at_utc': read_at.isoformat(), 'read_at_local': read_at.astimezone(ZoneInfo(zone)).isoformat()},
       'candidates': len(cand), 'with_pick_time': n, 'agree': agree, 'rows': res}
json.dump(out, open(f'/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/obsB_lastsale_{key}.json', 'w'), indent=1)
print(json.dumps(out['meta'])); print('candidates', len(cand), 'with pick time', n, 'agree', agree)
for x in res:
    if 'elapsed' in x and len({x['elapsed'], x['utc'], x['loc']}) > 1: print('  DISCRIMINATING', x)
