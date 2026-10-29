# Filter recheck F2 — server-data side of the three-way independence test for SV-11940..11947 (PV + IV). SECRET-FREE.
# Rule 99: run with TZ=<location zone>; the private F2 session is change-location'd to that location first; zones recorded.
# Usage: TZ=America/Toronto python3 server_f2.py DVI <label> [full|quick]  |  TZ=Asia/Karachi python3 server_f2.py HD <label> [full|quick]
import sys, os, json, datetime as dt, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import common_f2
from zoneinfo import ZoneInfo
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2'
key, label = sys.argv[1], sys.argv[2]; mode = sys.argv[3] if len(sys.argv) > 3 else 'full'
wid = {'DVI': DVI, 'HD': HD}[key]; zone = TZ[wid]
assert os.environ.get('TZ') == zone, f'run with TZ={zone}'
st, _ = change_loc(wid)
now = dt.datetime.now(ZoneInfo(zone)); today = now.date()
meta = {'location': NAME[wid], 'workplace_id': wid, 'location_tz': zone, 'process_TZ': os.environ.get('TZ'), 'process_zone': time.tzname,
        'change_location_status': st, 'observed_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(), 'local_now': now.isoformat(), 'local_today': str(today), 'mode': mode}
KEEP = ('type', 'part_number', 'description', 'category', 'vendor', 'units_sold', 'units_returned', 'unit_cost', 'sell_price', 'revenue', 'margin',
        'margin_pct', 'demand', 'last_sale', 'on_hand', 'workplace_id', 'location')
TARGETS = {'DVI': ['ZZAUTOTEST-PV1-10282011', 'ZZAUTOTEST-SO1-10282011', 'ZZAUTOTEST-SO2-10282011'], 'HD': ['N000000001069']}[key]
L90 = (today - dt.timedelta(days=90), today)          # what the screen sends for "Last 90 days" (seen in its requests)
L90X = (today - dt.timedelta(days=89), today)         # Chris q13: today and the 89 before it
WIDE = (today - dt.timedelta(days=365), today)        # widest the server allows ("Date range cannot exceed 366 days.")
LQ = (dt.date(2026, 7, 1), dt.date(2026, 9, 30))      # "Last quarter" as of Oct 2026 (B4's stated filter)
if key == 'DVI':
    runs = {'i_ticket_filters_search_ZZAUTOTEST': ([wid], L90, 'ZZAUTOTEST'),
            'i_ticket_filters_search_ZZAUTOTEST-PV1': ([wid], L90, 'ZZAUTOTEST-PV1'),
            'ii_fresh_defaults_no_search': ([wid], L90, None),
            'iii_widened_all_locations_366d_no_search' if mode == 'full' else 'iii_widened_all_locations_366d_search_ZZAUTOTEST': (ALL, WIDE, None if mode == 'full' else 'ZZAUTOTEST'),
            'x_L90_expected_window_today_minus_89': ([wid], L90X, 'ZZAUTOTEST')}
else:
    runs = {'i_ticket_filters_last_quarter_search': ([wid], LQ, 'N000000001069'),
            'ii_fresh_defaults_L90_no_search': ([wid], L90, None),
            'iii_widened_all_locations_366d_no_search' if mode == 'full' else 'iii_widened_all_locations_366d_search': (ALL, WIDE, None if mode == 'full' else 'N000000001069'),
            'x_all_locations_last_quarter_search': (ALL, LQ, 'N000000001069'),
            'x_L90_expected_window_search': ([wid], L90X, 'N000000001069')}
out = {'meta': meta, 'runs': {}}
for name, (locs, (f, t), srch) in runs.items():
    t0 = time.time(); s, pg, rows = pv_all(wid, locs, f, t, zone, search=srch)
    got = [{k: r.get(k) for k in KEEP} for r in rows if r.get('part_number') in TARGETS]
    out['runs'][name] = {'locations': [NAME[x] for x in locs], 'from': str(f), 'to': str(t), 'days_inclusive': (t - f).days + 1, 'search': srch,
                         'type': 'both', 'status': s, 'rowsNumber': (pg or {}).get('rowsNumber') if s == 200 else str(pg)[:300],
                         'request_first_page': common_f2.REQS[-1].split('&pagination[page]')[0] if s == 200 else None, 'secs': round(time.time() - t0, 1), 'rows': got}
    print(name, s, out['runs'][name]['rowsNumber'], len(got), flush=True)
# Inventory Value (B5/B8): the same part, as-of today, active location vs all locations; and an earlier as-of date.
if key == 'DVI':
    for name, locs, day in [('iv_i_DVI_asof_today', [wid], today), ('iv_iii_all_locations_asof_today', ALL, today), ('iv_x_DVI_asof_2026-09-30', [wid], dt.date(2026, 9, 30))]:
        s, pg, rows, tot = iv_all(wid, locs, day, zone, search='ZZAUTOTEST')
        out['runs'][name] = {'locations': [NAME[x] for x in locs], 'as_of': str(day), 'status': s, 'rowsNumber': (pg or {}).get('rowsNumber') if s == 200 else str(pg)[:300],
                             'row_keys': sorted(rows[0].keys()) if rows else [], 'rows': [r for r in rows if r.get('part_number') in TARGETS]}
        print(name, s, len(rows), flush=True)
fn = f'{EV}/server_{key}_{label}_{dt.datetime.now(dt.timezone.utc):%Y%m%dT%H%M%SZ}.json'
json.dump(out, open(fn, 'w'), indent=1, default=str); print(fn)
