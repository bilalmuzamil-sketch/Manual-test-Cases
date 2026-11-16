#!/usr/bin/env python3
"""Area 3 — can a work order carry two live invoices (needed for the Sales column note "Inv. Hrs from the newest
invoice", which has NO written source: it came from the code-derived column reference)? Take one invoiced ZZAUTOTEST
work order at DVI Test and ask for a second invoice; record the exact answer; undo anything created. Logged to ../seed-log.jsonl.
Run: TZ=Pacific/Fiji python3 second_invoice.py"""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
W, TZ = '39522bc6-abca-4f67-bd12-2840043c2d68', 'Pacific/Fiji'; H = {'X-Location-ID': W}; LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'seed-log.jsonl')
def call(m, p, b=None, why=''):
    s, r = curl(m, p, b, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'area': 3, 'op': f'{m} {p}', 'request': b, 'http': s, 'response': json.dumps(r)[:400], 'why': why}) + '\n'); return s, r
curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': TZ})
s, b = curl('GET', '/api/invoices/list?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 200)]), extra_headers=H)
inv = [x for x in b['data']['collection'] if x.get('work_place_id') == W and x.get('status') in ('pending', 'invoiced', 'unpaid', 'open') and x.get('work_order_id')]
res = {'invoices_seen_at_DVI': len(b['data']['collection']), 'candidates': len(inv), 'statuses': sorted({x.get('status') for x in b['data']['collection']})}
if inv:
    x = inv[0]; wo = x['work_order_id']; today = dt.datetime.now(ZoneInfo(TZ)).date().isoformat()
    s, v = curl('GET', f'/api/work-orders/view/{wo}', extra_headers=H); d = (v.get('data') or {}); d = d.get('work_order', d)
    res['work_order'] = {'status': d.get('status_value'), 'invoice_status': d.get('invoice_status'), 'company': (d.get('company_name') or '')[:10] + '…'}
    s2, r2 = call('POST', '/api/invoices/create', {'work_order_id': wo, 'issue_date': today, 'due_date': today}, 'second invoice on an already-invoiced work order')
    res['second_invoice'] = {'http': s2, 'response': json.dumps(r2)[:400], 'invoice_number_of_first': x.get('invoice_number')}
    if s2 in (200, 201):
        nid = ((r2 or {}).get('data') or {}).get('invoice_id') or ((r2 or {}).get('data') or {}).get('id')
        s3, r3 = call('POST', '/api/invoices/reverse-invoice', {'id': nid, 'invoice_id': nid}, 'undo the second invoice'); res['undo'] = {'http': s3, 'response': json.dumps(r3)[:200]}
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'second-invoice.json'), 'w'), indent=1); print(json.dumps(res)[:900])
