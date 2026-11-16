#!/usr/bin/env python3
"""Area 4 (16 Nov 2026): explain Shop Efficiency 'Total Clocked Hours' vs the clocks a reader can see.
Paired read on a private session (Rule 99: session zone = location zone; process TZ = location zone):
  Shop Efficiency (custom window), Timesheet Activities rows (same window), the raw work-order clock list
  (GET /api/technician-tasks/list, every page, per-record 'billable' flag), Technician Utilization summary.
Usage: TZ=<zone> se_gap.py <wid> <zone> <YYYY-MM-DD from> <YYYY-MM-DD to> <tag>
Raw -> /tmp/cln/rg16/a4/<tag>/ (names stay out of git). Summary (no names) -> ../se-gap-<tag>.json. SECRET-FREE."""
import sys, os, json, collections, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
from collect_reports import instants
wid, tz, a, b, tag = sys.argv[1:6]
Z = ZoneInfo(tz); f, t = dt.date.fromisoformat(a), dt.date.fromisoformat(b)
s, e = instants(f, t, tz)
R = f'/tmp/cln/rg16/a4/{tag}'; os.makedirs(R, exist_ok=True)
H = {'X-Location-ID': wid}
curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
def pages(path, params):
    rows, p = [], 1
    while True:
        c, j = curl('GET', path + '?' + urlencode(params + [('pagination[page]', p), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
        if c != 200: return c, j, rows
        d = j['data']; col = d.get('collection', [])
        rows += col
        if len(col) < 1000: return c, j, rows
        p += 1
read_at = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
c1, se = curl('GET', '/api/reporting/shop-billing-efficiency/custom?' + urlencode(win), extra_headers=H)
c2, taj, ta = pages('/api/reporting/punch-clock-activities/custom', win)
c3, tuj, tu = pages('/api/reporting/reports/technician-utilization', win + [('locations', wid)])
c4, _, clocks = pages('/api/technician-tasks/list', [])
c5, se2 = curl('GET', '/api/reporting/shop-billing-efficiency/custom?' + urlencode(win), extra_headers=H)
json.dump({'se': se, 'se2': se2, 'ta': ta, 'ta_meta': (taj or {}).get('data', {}).get('metadata'), 'tu_summary': (tuj or {}).get('data', {}).get('summary'), 'clocks': clocks},
          open(f'{R}/raw.json', 'w'))
S0 = dt.datetime.fromisoformat(s.replace('Z', '+00:00')); E0 = dt.datetime.fromisoformat(e.replace('Z', '+00:00'))
def loc(x):  # start_date_display / end_date_display, location-local wall time (checked below against TA)
    return dt.datetime.fromisoformat(x).replace(tzinfo=Z) if x else None
def clip(st, en):
    st, en = max(st, S0), min(en, E0)
    return max(0.0, (en - st).total_seconds() / 3600)
agg = collections.defaultdict(float); n = collections.Counter(); bystaff0 = collections.defaultdict(float)
for r in clocks:
    st, en = loc(r.get('start_date_display')), loc(r.get('end_date_display'))
    if not st: continue
    if en is None:
        n['open'] += 1; continue
    if r.get('workplace_id') != wid: n['other_workplace'] += 1; continue
    h = clip(st, en)
    if h <= 0: continue
    k = 'wo_billable' if r.get('billable') == 1 else 'wo_nonbillable'
    agg[k] += h; n[k] += 1
    if k == 'wo_nonbillable': bystaff0[r['staff_id']] += h
# Timesheet Activities: per row Work Order hours / Internal (department) hours
tak = collections.Counter(k for r in ta[:1] for k in r)
SE = (se or {}).get('data', {}); SE2 = (se2 or {}).get('data', {})
out = {'tag': tag, 'location_id': wid, 'zone': tz, 'process_TZ': os.environ.get('TZ'), 'window_local': [a, b], 'window_utc': [s, e], 'read_at_utc': read_at,
       'http': {'se': c1, 'ta': c2, 'tu': c3, 'clocks': c4, 'se_again': c5},
       'shop_efficiency': SE, 'shop_efficiency_again': SE2, 'ta_footer': (taj or {}).get('data', {}).get('metadata'), 'ta_rows': len(ta), 'ta_row_keys': sorted(tak),
       'tu_summary': (tuj or {}).get('data', {}).get('summary'),
       'work_order_clocks': {k: round(v, 2) for k, v in agg.items()}, 'counts': dict(n),
       'nonbillable_wo_clock_hours_by_staff_count': len(bystaff0)}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', f'se-gap-{tag}.json'), 'w'), indent=1, default=str)
print(json.dumps({k: out[k] for k in ('http', 'shop_efficiency', 'ta_footer', 'ta_rows', 'ta_row_keys', 'tu_summary', 'work_order_clocks', 'counts')}, default=str)[:3000])
