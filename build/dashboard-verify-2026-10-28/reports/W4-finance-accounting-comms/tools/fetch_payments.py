#!/usr/bin/env python3
"""W4 — for every customer account that owns an invoice in the shared invoice cache (/tmp/cln/dv/inv),
fetch the account's full payment list (customer-payment/list: payment date + per-invoice statements) so
the historical A/R as-of dates can be replayed independently of the report SQL. Raw → /tmp/cln/w4/pay/."""
import json, os, sys, glob
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl
H = {'X-Location-ID': 'b3c8c820-f815-4cf1-8938-10956c5ee71a'}
accs = {}
for f in glob.glob('/tmp/cln/dv/inv/*.json'):
    try:
        c = json.load(open(f))['body']['data']['collection']
    except Exception:
        continue
    a = (c.get('customer_transaction') or {}).get('customer_account_id')
    if a:
        accs[a] = 1
print('accounts', len(accs))
for a in accs:
    fn = f'/tmp/cln/w4/pay/{a}.json'
    if os.path.exists(fn):
        continue
    rows, page = [], 1
    while True:
        s, j = curl('GET', '/api/customer-payment/list?' + urlencode([('accountId', a), ('pagination[page]', page), ('pagination[rowsPerPage]', 500)]), extra_headers=H)
        c = (j.get('data') or {}).get('collection', []) if s == 200 else []
        rows += c
        if s != 200 or len(c) < 500:
            break
        page += 1
    json.dump({'account': a, 'status': s, 'payments': rows}, open(fn, 'w'))
print('done')
