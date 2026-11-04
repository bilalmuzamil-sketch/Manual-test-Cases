#!/usr/bin/env python3
"""SV-11820: which invoices in the Sales report are missing from Service Advisor Analysis, and what advisor do their work orders have?
SECRET-FREE. Usage (TZ=<zone>): sv11820_missing.py <workplace_id> <zone> <from> <to> <out.json>"""
import sys, json, os, datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
from collect_reports import instants
from urllib.parse import urlencode
wid, tz, f, t, out = sys.argv[1:6]; H = {'X-Location-ID': wid}; assert os.environ.get('TZ') == tz
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})[0])
s, e = instants(dt.date.fromisoformat(f), dt.date.fromisoformat(t), tz); win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
def allrows(path):
    rows, first = [], None
    for p in range(1, 21):
        c, b = curl('GET', path + '?' + urlencode(win + [('pagination[page]', p), ('pagination[rowsPerPage]', 500)]), extra_headers=H)
        col = b['data']['collection']; tot = b['data'].get('totals')
        if not col or (col and json.dumps(col[0]) == first): break
        first = json.dumps(col[0]); rows += col
        if len(col) < 500: break
    return rows, tot
S, st = allrows('/api/reporting/sales/custom'); A, at = allrows('/api/reporting/service-advisor-analysis/custom')
aw = {r['work_order_id'] for r in A}
miss = [r for r in S if r.get('work_order_id') and r['work_order_id'] not in aw and float(r.get('hours_invoiced') or 0) != 0]
print('rows sales', len(S), 'saa', len(A), '| inv hrs sales', st.get('hours_invoiced'), 'saa', at.get('hours_invoiced'), '| missing with hours', len(miss), round(sum(float(r['hours_invoiced']) for r in miss), 2))
det = []
for r in miss[:60]:
    c, b = curl('GET', f"/api/work-orders/view/{r['work_order_id']}", extra_headers=H); w = (b.get('data') or {}).get('work_order', {}) if isinstance(b, dict) else {}
    det.append({'invoice': r['invoice_number'], 'date': r['invoice_date'], 'type': r.get('work_order_type'), 'hours_invoiced': r['hours_invoiced'], 'wo': w.get('display_number'),
                'advisor': {k: w.get(k) for k in w if 'advisor' in k.lower()}})
for x in det: print(json.dumps(x)[:260])
adv = {}
for r in A: adv[r['advisor']] = adv.get(r['advisor'], 0) + 1
print('SAA advisors', sorted(adv.items(), key=lambda x: -x[1]))
json.dump({'window': [f, t, s, e], 'sales_totals': st, 'saa_totals': at, 'saa_advisor_counts': adv, 'missing_with_hours': det}, open(out, 'w'), indent=1)
