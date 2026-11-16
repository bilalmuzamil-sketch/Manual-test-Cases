#!/usr/bin/env python3
"""Area 4 decomposition (no names written). Input: /tmp/cln/rg16/a4/<tag>/raw.json from se_gap.py + staff list.
Observed: work-order clocks with the record's own billable flag (clock list); department clocks and every row's
hours (Timesheet Activities); each staff member's CURRENT billable flag (staff list); TU per-staff rows.
Inferred (labelled): a department clock's flag, taken as the flag of that staff member's nearest work-order clock
in time (flag history), since no read endpoint exposes it for department clocks.
Usage: TZ=<zone> se_decompose.py <wid> <zone> <tag>"""
import sys, os, json, collections, bisect, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
wid, tz, tag = sys.argv[1:4]; Z = ZoneInfo(tz)
R = f'/tmp/cln/rg16/a4/{tag}'; raw = json.load(open(f'{R}/raw.json'))
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', f'se-gap-{tag}.json'); out = json.load(open(out_path))
S0 = dt.datetime.fromisoformat(out['window_utc'][0].replace('Z', '+00:00')); E0 = dt.datetime.fromisoformat(out['window_utc'][1].replace('Z', '+00:00'))
st_cache = f'/tmp/cln/rg16/a4/staff.json'
if not os.path.exists(st_cache):
    allr, pg = [], 1
    while True:
        c, b = curl('GET', '/api/staff?' + urlencode([('pagination[page]', pg), ('pagination[rowsPerPage]', 60)]), extra_headers={'X-Location-ID': wid})
        cc = ((b or {}).get('data') or {}).get('collection', []) if c == 200 else []
        new = [x for x in cc if x.get('id') not in {y.get('id') for y in allr}]
        allr += new
        if not new: break
        pg += 1
    json.dump({'data': {'collection': allr}}, open(st_cache, 'w'))
SB = json.load(open(st_cache)); col = (SB.get('data') or {}); col = col.get('collection', col) if isinstance(col, dict) else col
cur = {}
for s in col if isinstance(col, list) else []:
    for k in ('staff_id', 'id'):
        if s.get(k): cur[s[k]] = s.get('billable')
L = lambda x: dt.datetime.fromisoformat(x).replace(tzinfo=Z) if x else None
def clip(a, b): a, b = max(a, S0), min(b, E0); return max(0.0, (b - a).total_seconds() / 3600)
hist = collections.defaultdict(list)       # staff -> [(start, flag)] from work-order clocks (observed flag)
wo = collections.defaultdict(lambda: [0.0, 0.0]); wo_n0 = collections.Counter(); wo_rows0 = []
for r in raw['clocks']:
    a, b = L(r.get('start_date_display')), L(r.get('end_date_display'))
    if not a: continue
    hist[r['staff_id']].append((a, r.get('billable')))
    if b is None or r.get('workplace_id') != wid: continue
    h = clip(a, b)
    if h <= 0: continue
    wo[r['staff_id']][0 if r.get('billable') == 1 else 1] += h
    if r.get('billable') != 1: wo_n0[r['staff_id']] += 1; wo_rows0.append({'wo': r.get('work_order_number'), 'start': r.get('start_date_display'), 'end': r.get('end_date_display'), 'hours': round(h, 2), 'staff_billable_now': cur.get(r['staff_id'])})
for k in hist: hist[k].sort(key=lambda x: x[0])
def flag_at(sid, t):
    h = hist.get(sid)
    if not h: return None
    i = bisect.bisect_left([x[0] for x in h], t)
    cand = [h[j] for j in (i - 1, i) if 0 <= j < len(h)]
    return min(cand, key=lambda x: abs((x[0] - t).total_seconds()))[1]
dep = collections.defaultdict(lambda: collections.Counter())
for r in raw['ta']:
    if not r.get('department_id'): continue
    hrs = float(r.get('internal_hours') or r.get('hours') or 0)
    t = dt.datetime.strptime(r['formatted_start_date_time'], '%b %d, %Y %I:%M %p').replace(tzinfo=Z) if r.get('formatted_start_date_time') else None
    f = flag_at(r['staff_id'], t) if t else None
    dep[r['staff_id']][('open' if not r.get('clock_out') else ('b1' if f == 1 else 'b0' if f == 0 else 'unknown'))] += hrs
tu_rows = {}
SE = out['shop_efficiency']['totals']['total_clocked_hours']
wo_b1 = sum(v[0] for v in wo.values()); wo_b0 = sum(v[1] for v in wo.values())
dep_b1 = sum(d['b1'] for d in dep.values()); dep_b0 = sum(d['b0'] for d in dep.values()); dep_unk = sum(d['unknown'] for d in dep.values()); dep_open = sum(d['open'] for d in dep.values())
nowbill = lambda sid: cur.get(sid) in (1, True, '1')
dep_now_bill = sum(sum(v for k, v in d.items() if k != 'open') for s, d in dep.items() if nowbill(s))
wo_b1_notnow = sum(v[0] for s_, v in wo.items() if not nowbill(s_)); wo_b0_now = sum(v[1] for s_, v in wo.items() if nowbill(s_))
TU = out.get('tu_summary') or {}
tu_h = {k: round((TU.get(k) or 0) / 3600, 2) for k in ('total_seconds', 'wo_seconds', 'internal_seconds')}
recon = {'TU_total_h': tu_h['total_seconds'], 'TU_wo_h': tu_h['wo_seconds'], 'TU_internal_h': tu_h['internal_seconds'],
         'SE_minus_TU_h': round(SE - tu_h['total_seconds'], 2),
         'A_wo_clocks_flag1_by_staff_NOT_billable_now_h (in SE, not in TU)': round(wo_b1_notnow, 2),
         'B_wo_clocks_flag0_by_staff_billable_now_h (in TU, not in SE)': round(wo_b0_now, 2),
         'C_dept_h_staff_billable_now (TU internal) minus server dept flag1 (SE - wo_flag1)': round(dep_now_bill - (SE - wo_b1), 2),
         'check: A - B - C': round(wo_b1_notnow - wo_b0_now - (dep_now_bill - (SE - wo_b1)), 2)}
res = {'reconciliation': recon, 'observed': {'shop_efficiency_clocked': SE, 'wo_clocks_flag1_h': round(wo_b1, 2), 'wo_clocks_flag0_h': round(wo_b0, 2), 'wo_clocks_flag0_count': sum(wo_n0.values()),
                    'wo_flag0_staff': len(wo_n0), 'wo_flag0_staff_billable_now': sum(1 for s in wo_n0 if nowbill(s)),
                    'dept_closed_h_all_staff': round(dep_b1 + dep_b0 + dep_unk, 2), 'dept_closed_h_staff_billable_now': round(dep_now_bill, 2),
                    'server_dept_flag1_h = SE - wo_flag1': round(SE - wo_b1, 2), 'staff_listed': len(cur), 'ta_rows_matched_clock_in_format': raw['ta'][0].get('clock_in') if raw['ta'] else None},
       'inferred_flag_history': {'dept_flag1_h': round(dep_b1, 2), 'dept_flag0_h': round(dep_b0, 2), 'dept_unknown_h': round(dep_unk, 2), 'dept_open_rows_h': round(dep_open, 2),
                                 'predicted_SE = wo_flag1 + dept_flag1': round(wo_b1 + dep_b1, 2)},
       'wo_flag0_rows_sample': sorted(wo_rows0, key=lambda x: -x['hours'])[:15]}
out['decomposition'] = res; json.dump(out, open(out_path, 'w'), indent=1, default=str)
print(json.dumps(res, default=str)[:2500])
