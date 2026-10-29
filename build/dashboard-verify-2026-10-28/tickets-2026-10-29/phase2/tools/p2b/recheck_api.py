# Phase 2 Worker B: server-data re-check of the Parts Velocity findings (B2, B4, B6, B7). SECRET-FREE.
# Rule 99: run with TZ=<location zone>; the session is change-location'd to that zone first; zones recorded.
# Usage: TZ=America/Toronto python3 recheck_api.py DVI   |   TZ=Asia/Karachi python3 recheck_api.py HD
import sys, os, json, datetime as dt, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import curl, change_loc, pv_all, TZ, NAME, RAW
from zoneinfo import ZoneInfo
LOC = {'DVI': '39522bc6-abca-4f67-bd12-2840043c2d68', 'HD': 'b3c8c820-f815-4cf1-8938-10956c5ee71a'}
key = sys.argv[1]; wid = LOC[key]; zone = TZ[wid]
assert os.environ.get('TZ') == zone, f'run with TZ={zone}'
st, j = change_loc(wid)
today = dt.datetime.now(ZoneInfo(zone)).date()
meta = {'location': NAME[wid], 'location_tz': zone, 'process_TZ': os.environ.get('TZ'),
        'process_zone': time.tzname, 'change_location_status': st, 'observed_at_utc': dt.datetime.utcnow().isoformat() + 'Z',
        'local_today': str(today)}
KEEP = ('type', 'part_number', 'description', 'units_sold', 'units_returned', 'sold_via_wo', 'sold_via_parts_sale', 'unit_cost',
        'sell_price', 'revenue', 'margin', 'margin_pct', 'demand', 'last_sale', 'on_hand', 'location', 'locations')
out = {'meta': meta, 'reads': {}}
# The screen's Last 90 days today = (today-90 .. today) [observed 28 Oct]; Chris: today and the 89 before it.
wins = {'last_90_days_as_screen': (today - dt.timedelta(days=90), today),
        'last_90_days_expected': (today - dt.timedelta(days=89), today),
        'this_year': (dt.date(today.year, 1, 1), today)}
targets = {'DVI': ['ZZAUTOTEST-PV1-10282011', 'ZZAUTOTEST-SO1-10282011', 'ZZAUTOTEST-SO2-10282011'],
           'HD': ['N000000001069']}[key]
for name, (f, t) in wins.items():
    s, meta_p, rows = pv_all(wid, f, t, extra=[('search', targets[0].split('-')[0] if key == 'DVI' else targets[0])])
    got = [{k: r.get(k) for k in KEEP} for r in rows if r.get('part_number') in targets]
    out['reads'][name] = {'from': str(f), 'to': str(t), 'days_inclusive': (t - f).days + 1, 'status': s, 'rows': got}
os.makedirs(RAW, exist_ok=True)
fn = f'{RAW}/recheck_{key}_{dt.datetime.utcnow():%Y%m%dT%H%M%S}.json'
json.dump(out, open(fn, 'w'), indent=1, default=str)
print(fn); print(json.dumps(out, indent=1, default=str)[:5000])
