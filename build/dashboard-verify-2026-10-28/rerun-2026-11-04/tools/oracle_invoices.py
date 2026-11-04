#!/usr/bin/env python3
"""Layer C1 — independent per-invoice check of the Revenue population and amounts.

For every invoice row the Sales report lists (last 12 months + last year = ~2 years), fetch the invoice's
OWN record (GET /api/invoices/{id}/view — a different code path from the report) and check:
  * the invoice is not void (S3-E2)                       * its created date is inside the window, local tz
  * report Subtotal = the invoice's own subtotal           * report Parts / Labor = the invoice's own lines
Cache: /tmp/cln/dv/inv/<id>.json. Output: /tmp/cln/dv/out/oracle_invoices.json + summary. SECRET-FREE.
"""
import json, os, sys, datetime as dt, collections
from concurrent.futures import ThreadPoolExecutor
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl, WORKPLACES

REP, CACHE = '/tmp/cln/dv/rep', '/tmp/cln/dv/inv'
os.makedirs(CACHE, exist_ok=True)


def view(arg):
    wid, iid = arg
    p = os.path.join(CACHE, iid + '.json')
    if os.path.exists(p):
        return iid, json.load(open(p))
    c, b = curl('GET', f'/api/invoices/{iid}/view', extra_headers={'X-Location-ID': wid})
    j = {'status': c, 'body': b}
    if c == 200: json.dump(j, open(p, 'w'))
    return iid, j


rows = []
for wid, name, tz in WORKPLACES:
    z = ZoneInfo(tz)
    seen = {}
    for label in ('last_12_months', 'last_year'):
        j = json.load(open(os.path.join(REP, wid, f'{label}__sales.json')))
        for r in j['body']['data']['collection']:
            if not r['is_credit']:
                seen[r['document_id']] = (label, j['from'], j['to'], r)
    with ThreadPoolExecutor(6) as ex:
        got = dict(ex.map(view, [(wid, i) for i in seen]))
    for iid, (label, f, t, r) in seen.items():
        g = got[iid]
        if g['status'] != 200:
            rows.append({'location': name, 'invoice': r['invoice_number'], 'check': 'Invoice record readable', 'result': 'FAIL', 'detail': f'HTTP {g["status"]}'}); continue
        v = g['body']['data']['collection']
        made = dt.datetime.fromisoformat(v['created_on']).astimezone(z).date()
        wo = v['work_order']
        parts = round(sum(l.get('parts_cost') or 0 for l in wo['lines']), 2)
        labor = round(sum(l.get('labour_cost') or 0 for l in wo['lines']), 2)
        def add(check, ok, detail):
            rows.append({'location': name, 'invoice': r['invoice_number'], 'invoice_id': iid, 'range': label,
                         'check': check, 'result': 'PASS' if ok else 'FAIL', 'detail': detail})
        add('Listed invoice is not void', v['status'] != 'void', f'status {v["status"]}')
        add('Created date inside the range (location time zone)', f <= made.isoformat() <= t, f'created {made} local, range {f}..{t}')
        add('Report Subtotal = invoice subtotal', abs(r['total_invoiced'] - float(str(v['sub_total_display']).replace(',', ''))) < 0.005,
            f'report {r["total_invoiced"]} vs invoice {v["sub_total_display"]} (discount {v.get("discount")}, supplies {v.get("shop_supplies_cost")})')
        add('Report Parts = invoice parts lines', abs(r['parts_invoiced'] - parts) < 0.005, f'report {r["parts_invoiced"]} vs lines {parts}')
        add('Report Labor = invoice labor lines', abs(r['labor_invoiced'] - labor) < 0.005, f'report {r["labor_invoiced"]} vs lines {labor}')
        if v.get('discount') not in (0, None, '0', '0.00'):
            add('Invoice has an invoice-level discount (PRD: revenue is before any discount)', True,
                f'discount {v["discount"]}; subtotal {v["sub_total_display"]}; with discount {v.get("sub_total_with_discount")}')
    print(name, len(seen), 'invoices checked', flush=True)

os.makedirs('/tmp/cln/dv/out', exist_ok=True)
json.dump(rows, open('/tmp/cln/dv/out/oracle_invoices.json', 'w'), indent=0)
print('TOTAL', len(rows), collections.Counter(r['result'] for r in rows))
g = collections.defaultdict(list)
for r in rows:
    if r['result'] == 'FAIL' or r['check'].startswith('Invoice has'): g[r['check']].append(r)
for k, v in g.items():
    print(f'\n{k}: {len(v)}')
    for r in v[:6]: print('   ', r['location'][:22], r['invoice'], r.get('range'), '|', r['detail'][:170])
