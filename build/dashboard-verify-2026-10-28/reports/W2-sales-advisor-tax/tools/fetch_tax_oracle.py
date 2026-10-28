#!/usr/bin/env python3
"""Fresh oracle for Sales Tax Collected: for every invoice that is paid / partially paid (per the invoice
record) or listed by the report in any range, read FRESH the invoice record (GET /api/invoices/{id}/view)
and the work order's finance record (GET /api/work-orders/view/{wo}: invoice_status, open_balance and
customer_payments incl. deposits). -> /tmp/cln/w2/taxor/<invoiceId>.json. SECRET-FREE."""
import json, os, sys, glob
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import invoice
OUT = os.path.join(RAW, 'taxor'); os.makedirs(OUT, exist_ok=True)
todo = []
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid)
    inv = {}
    for lab in ('last_12_months', 'last_year'):
        p = os.path.join(d, f'sbc_tree__{lab}.json')
        if not os.path.exists(p): continue
        for c in json.load(open(p))['tree']:
            for a in c['assets']:
                for i in a['invoices'] or []: inv[i['invoice_number']] = i
    listed = set()
    for p in glob.glob(os.path.join(d, 'tax__*.json')) + glob.glob(os.path.join(d, 'tax_preset__*.json')):
        j = json.load(open(p))
        if j['status'] == 200: listed |= {r['invoiceNumber'] for r in j['data']['collection']}
    for num, i in inv.items():
        v = invoice(i['invoice_id'], wid)
        if num in listed or (v and v.get('payment_status') in ('paid', 'partially_paid', 'overpaid', 'prepaid')):
            todo.append((wid, i))
def one(a):
    wid, i = a
    p = os.path.join(OUT, i['invoice_id'] + '.json')
    if os.path.exists(p): return 'cached'
    c1, b1 = get(f'/api/invoices/{i["invoice_id"]}/view', [], wid)
    c2, b2 = get(f'/api/work-orders/view/{i["work_order_id"]}', [], wid)
    if c1 != 200 or c2 != 200: return (c1, c2)
    v = b1['data']['collection']; w = b2['data']['work_order']
    json.dump({'number': v['display_number'], 'status': v['status'], 'payment_status': v['payment_status'], 'sub_total_with_tax': v['sub_total_with_tax'],
               'wo_invoice_status': w.get('invoice_status'), 'open_balance': w.get('open_balance'), 'invoice_balance': w.get('invoice_balance'),
               'payments': [{k: x.get(k) for k in ('payment_date', 'amount', 'applied_amount', 'is_deposit', 'deposit_status', 'customer_payment_status', 'label')} for x in (w.get('customer_payments') or [])],
               'invoice_credits': w.get('invoiceCredits')}, open(p, 'w'))
    return 200
with ThreadPoolExecutor(10) as ex:
    res = list(ex.map(one, todo))
from collections import Counter
print(len(todo), Counter(map(str, res)))
