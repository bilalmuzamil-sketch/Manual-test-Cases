#!/usr/bin/env python3
"""Area 4 residual: per technician, TU work-order seconds vs that person's closed work-order clocks (clock list,
location = this location, clipped to the window). Prints counts and hours only (no names). Usage: TZ=<zone> se_residual.py <wid> <zone> <tag>"""
import sys, json, collections, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
wid, tz, tag = sys.argv[1:4]; Z = ZoneInfo(tz)
raw = json.load(open(f'/tmp/cln/rg16/a4/{tag}/raw.json')); out = json.load(open(f'../se-gap-{tag}.json'))
s, e = out['window_utc']; S0 = dt.datetime.fromisoformat(s.replace('Z', '+00:00')); E0 = dt.datetime.fromisoformat(e.replace('Z', '+00:00'))
c, b = curl('GET', '/api/reporting/reports/technician-utilization?' + urlencode([('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', wid), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers={'X-Location-ID': wid})
rows = b['data']['collection']
L = lambda x: dt.datetime.fromisoformat(x).replace(tzinfo=Z) if x else None
mine = collections.defaultdict(float); opn = collections.defaultdict(float); other = collections.defaultdict(float)
for r in raw['clocks']:
    a, z = L(r.get('start_date_display')), L(r.get('end_date_display'))
    if not a: continue
    if z is None: continue
    h = max(0.0, (min(z, E0) - max(a, S0)).total_seconds() / 3600)
    (mine if r.get('workplace_id') == wid else other)[r['staff_id']] += h
diffs = []
for r in rows:
    sid = r.get('staff_id'); tu = (r.get('wo_seconds') or 0) / 3600
    diffs.append((round(tu - mine.get(sid, 0), 2), round(tu, 2), round(mine.get(sid, 0), 2), round(other.get(sid, 0), 2)))
big = sorted([d for d in diffs if abs(d[0]) > 0.5], key=lambda d: -abs(d[0]))
print('TU rows', len(rows), 'sum TU wo', round(sum(d[1] for d in diffs), 2), 'sum clocks (same people)', round(sum(d[2] for d in diffs), 2),
      'people off by >0.5h', len(big), 'their net', round(sum(d[0] for d in big), 2))
print('largest (TU-clocks, TU, clocks here, clocks at other locations):', big[:8])
print('row keys', sorted(rows[0].keys())[:30])
