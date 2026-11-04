#!/usr/bin/env python3
"""Read back the HD seed (server side, read-only): work order + invoice, the clock, Technician Efficiency This Month,
the Dashboard techEfficiencyKpi This Month, and Parts Velocity for the seeded part (Last Sale) — all in Asia/Karachi
(Rule 99). Writes results/sec3/<label>.json. Usage: TZ=Asia/Karachi python3 read_seed.py <label>"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from s3 import use, get, instants, dump, WID
label = sys.argv[1]
L = use('HD'); W, tz = L['wid'], L['tz']; S = json.load(open('/tmp/cln/s3/seed.json'))
today = dt.datetime.now(ZoneInfo(tz)).date(); m0 = today.replace(day=1)
out = {'zones': L, 'local_today': str(today), 'seed': {k: S[k] for k in ('tag', 'cat', 'inv', 'customer', 'wo', 'line', 'display') if k in S}}
c, b = get(f'/api/work-orders/view/{S["wo"]}', [], W); w = b['data']['work_order']
out['wo'] = {k: w.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoiced_date', 'invoice_date', 'completed_date', 'updated_at')}
out['wo_keys_with_invoice'] = {k: w.get(k) for k in w if 'invoice' in k.lower() and not isinstance(w.get(k), (list, dict))}
s, e = instants(today, today, tz)
c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], W)
out['clocks_today_on_wo'] = [{k: r.get(k) for k in ('id', 'employee', 'formatted_start_date_time', 'formatted_end_date_time', 'hours', 'work_order_id', 'is_active')} for r in b['data']['collection'] if r.get('work_order_id') == S['wo']]
s, e = instants(m0, today, tz)
c, b = get('/api/reporting/technician-efficiency/custom', [('range', 'custom'), ('start_date', s), ('end_date', e)], W)
out['te_this_month'] = {'status': c, 'rows': [{k: r.get(k) for k in r if not isinstance(r.get(k), (list, dict))} for r in ((b.get('data') or {}).get('collection') or [])]}
c, b = get('/api/dashboard/reports', [('reports[]', 'techEfficiencyKpi'), ('from', str(m0)), ('to', str(today))], W)
out['dash_te_this_month'] = {'status': c, 'kpi': (b.get('data') or {}).get('techEfficiencyKpi')}
# Parts Velocity, Last 12 months, all locations, search the part (what the screen sends)
m11 = (today.month - 11 - 1) % 12 + 1; y11 = today.year - (1 if today.month <= 11 else 0)
s, e = instants(dt.date(y11, m11, 1), today, tz); ALL = ','.join(WID.values())
q = [('type', 'both'), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ALL), ('search', S['cat']['pn']), ('pagination[page]', 1), ('pagination[rowsPerPage]', 50), ('pagination[sortBy]', 'demand'), ('pagination[descending]', 'true')]
c, b = get('/api/reporting/reports/parts-velocity', q, W)
out['pv'] = {'status': c, 'rows': [{k: r.get(k) for k in r if not isinstance(r.get(k), (list, dict))} for r in ((b.get('data') or {}).get('collection') or [])]}
print(json.dumps({k: out[k] for k in ('zones', 'wo', 'wo_keys_with_invoice', 'clocks_today_on_wo', 'dash_te_this_month', 'pv')}, default=str)[:3500])
print('TE rows', len(out['te_this_month']['rows']), out['te_this_month']['rows'][:3])
print(dump(f'seed-read-{label}', out))
