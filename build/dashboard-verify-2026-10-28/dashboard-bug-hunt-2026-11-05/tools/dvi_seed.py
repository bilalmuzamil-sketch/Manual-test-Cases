#!/usr/bin/env python3
"""Area 2 (day boundary) set-up on sv11839, DVI Test (run with TZ=Pacific/Fiji). Throwaway ZZAUTOTEST data only.
The CHECK is on screen (money_screen.mjs); these calls are the same requests the screen sends (set-up only).
Steps: customer | wo | invoice | reverse | credit | zero | show.  State: /tmp/cln/qa11839/seed.json -> HUNT8. Log: ../seed-log.jsonl. SECRET-FREE."""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = '93404b24-8d43-4459-b152-513e64e2ad81'; Z = 'Pacific/Fiji'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z, 'Rule 99'
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'; TECH = '558264f7-7c13-4198-b331-5e95ab20c4f9'  # Craig Mckee staff_id (proven 4 Nov)
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)); R = S.setdefault('HUNT2', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/seed-log.jsonl'
def save(): json.dump(S, open(ST, 'w'), indent=1)
step = sys.argv[1]
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'HUNT2', 'step': step, 'op': f'{m} {p}', 'http': c, 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:160]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, dict):
        for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'vehicle_id', 'invoice_id', 'creditMemoId'):
            if d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
now = dt.datetime.now(ZoneInfo(Z)).replace(second=0, microsecond=0)
def new_wo(key, n_lines=1):
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True})
    wo = did(b); R[key] = {'wo': wo}
    for _ in range(n_lines): call('POST', f'/api/work-orders/{wo}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{wo}', extra_headers=H); R[key]['lines'] = [l['line_id'] for l in b['data']['collection']]
    call('POST', '/api/work-orders/change-mileage', {'work_order_id': wo, 'mileage': '123456'})
    for l in R[key]['lines']: call('POST', '/api/work-orders/lines/change-story', {'line_id': l, 'tech_story': 'ZZAUTOTEST hunt seed', 'work_order_id': wo})
    c, v = curl('GET', f'/api/work-orders/view/{wo}', extra_headers=H); R[key]['display'] = v['data']['work_order'].get('display_number'); save()
if step == 'customer':
    c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST Hunt Fiji Day'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': 'ZZAUTOTEST Hunt', 'last_name': 'Fiji'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-HUNT-FIJI'}); R['vehicle_id'] = did(b)
    c, b = curl('GET', f'/api/customers/view/{R["company_id"]}', extra_headers=H); R['customer_account_id'] = b['data']['company'].get('customer_account_id'); save()
elif step == 'wo':   # one canned labour line, 30 min clocked by Craig Mckee ending 10 min ago (location time)
    new_wo('A'); s, e = now - dt.timedelta(minutes=40), now - dt.timedelta(minutes=10)
    call('POST', '/api/technician-tasks/create', {'line_id': R['A']['lines'][0], 'work_order_id': R['A']['wo'], 'tech_assigned_id': TECH, 'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['A']['lines'][0], 'status': 'complete', 'workOrderId': R['A']['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['A']['wo'], 'status': 'complete'})
elif step == 'wo_only':
    new_wo(sys.argv[2])
elif step == 'clock':
    k = sys.argv[2]; call('POST', '/api/technician-tasks/create', {'line_id': R[k]['lines'][0], 'work_order_id': R[k]['wo'], 'tech_assigned_id': TECH, 'start_date': sys.argv[3], 'end_date': sys.argv[4]}); save()
elif step == 'complete':
    k = sys.argv[2]; call('POST', '/api/work-orders/lines/change-status', {'line_id': R[k]['lines'][0], 'status': 'complete', 'workOrderId': R[k]['wo']}); call('POST', '/api/work-orders/change-status', {'id': R[k]['wo'], 'status': 'complete'})
elif step == 'invoice_key':
    k = sys.argv[2]; c, b = call('POST', '/api/invoices/create', {'work_order_id': R[k]['wo']}); R[k].setdefault('invoices', []).append(did(b)); R[k]['invoiced_utc'] = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'); save()
elif step == 'invoice':
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['A']['wo']}); R['A'].setdefault('invoices', []).append(did(b)); save()
elif step == 'reverse':
    call('POST', '/api/invoices/reverse-invoice', {'id': R['A']['invoices'][-1]}); save()
elif step == 'credit':
    c, b = call('POST', '/api/credit-memos', {'customer_account_id': R['customer_account_id'], 'amount': 10}); R['credit'] = b; save()
elif step == 'zero':   # a work order whose only line is declined, then invoiced -> $0.00 invoice (if the server allows it)
    new_wo('Z'); call('POST', '/api/work-orders/lines/change-status', {'line_id': R['Z']['lines'][0], 'status': 'authorization_declined', 'workOrderId': R['Z']['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['Z']['wo'], 'status': 'complete'})
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['Z']['wo']}); R['Z']['invoice'] = did(b); save()
for k in [x for x in R if isinstance(R.get(x), dict) and 'wo' in R[x]]:
    if k in R:
        c, v = curl('GET', f'/api/work-orders/view/{R[k]["wo"]}', extra_headers=H); w = v['data']['work_order']; print(k, R[k].get('display'), w.get('status'), w.get('invoice_number') or w.get('invoice_id'))
print('HUNT2', json.dumps({k: v for k, v in R.items() if k not in ('credit',)})[:500])
