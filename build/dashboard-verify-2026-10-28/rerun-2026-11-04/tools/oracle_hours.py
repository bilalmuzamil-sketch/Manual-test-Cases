#!/usr/bin/env python3
"""Layer C3 — independent check of "invoiced hours" (Billing Efficiency, Service Advisor Analysis, Sales Inv. Hrs).

PRD Dashboard v53 §4: "Invoiced hours — the labor time billed on work order lines."
For every invoice the Sales report lists (~2 years), the BILLED lines are the lines printed on the invoice
(GET /api/invoices/{id}/view — line ids are work-order line ids). Their hours are taken from the work order's
own line record (GET /api/work-orders/lines/{wo}: time_estimate minutes). The report's figure is compared and
every difference is classified:
  * EXTRA_LINE      — the report counts a work-order line that is NOT on the invoice (with that line's status)
  * MISSING_LINE    — a billed line the report does not count
  * (anything else) — unexplained
Output: /tmp/cln/dv/out/oracle_hours.json + summary. SECRET-FREE.
"""
import json, os, collections

W = {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 'Staging Heavy Duty - 9919', 'f8a8b802-7780-4b16-bf10-343caeb616b2': 'Staging Lethbridge - 4310',
     '25a0d576-b371-4b82-bef4-41ba977f31c2': 'QB Location', '39522bc6-abca-4f67-bd12-2840043c2d68': 'DVI Test'}
rows, cls = [], collections.Counter()


def wo_lines(wo):
    p = f'/tmp/cln/dv/wol/{wo}.json'
    if not os.path.exists(p): return None
    w = json.load(open(p)); d = w.get('data', w)
    return d.get('collection', d) if isinstance(d, dict) else d


for wid, name in W.items():
    seen = {}
    for lab in ('last_12_months', 'last_year'):
        for r in json.load(open(f'/tmp/cln/dv/rep/{wid}/{lab}__sales.json'))['body']['data']['collection']:
            if not r['is_credit']: seen[r['document_id']] = r
    # newest invoice per work order carries the hours on the Sales report (code); group to know which one
    by_wo = collections.defaultdict(list)
    for iid, r in seen.items(): by_wo[r['work_order_id']].append((iid, r))
    for wo, invs in by_wo.items():
        ls = wo_lines(wo)
        if ls is None: cls['no WO lines record'] += 1; continue
        L = {l['line_id']: l for l in ls}
        billed_ids = set()
        for iid, r in invs:
            p = f'/tmp/cln/dv/inv/{iid}.json'
            if os.path.exists(p):
                billed_ids |= {l['id'] for l in json.load(open(p))['body']['data']['collection']['work_order']['lines']}
        rep = round(sum(r['hours_invoiced'] or 0 for _, r in invs), 2)
        billed = round(sum(round((L[i]['time_estimate'] or 0) / 60, 2) for i in billed_ids if i in L), 2)
        extra = [l for l in ls if l['line_id'] not in billed_ids and l['status'] != 'authorization_declined' and (l['time_estimate'] or 0) > 0]
        missing = [i for i in billed_ids if i not in L]
        if abs(rep - billed) < 0.011:
            cls['MATCH'] += 1; continue
        reason = 'EXTRA_LINE' if extra and abs(rep - billed - sum(round(l['time_estimate'] / 60, 2) for l in extra)) < 0.011 * max(1, len(extra)) else ('MISSING_LINE' if missing else 'UNEXPLAINED')
        cls[reason] += 1
        rows.append({'location': name, 'work_order_id': wo, 'invoices': [r['invoice_number'] for _, r in invs],
                     'invoice_dates': [r['invoice_date'] for _, r in invs], 'customer': invs[0][1]['customer_service'],
                     'report_invoiced_hours': rep, 'billed_hours': billed, 'reason': reason,
                     'extra_lines': [{'name': l['line_name'], 'status': l['status'], 'hours': round(l['time_estimate'] / 60, 2)} for l in extra],
                     'wo_status': ls[0]['work_order_status'] if ls else None})

json.dump(rows, open('/tmp/cln/dv/out/oracle_hours.json', 'w'), indent=0)
print(cls)
st = collections.Counter(e['status'] for r in rows if r['reason'] == 'EXTRA_LINE' for e in r['extra_lines'])
print('extra line statuses', st)
for k in ('EXTRA_LINE', 'UNEXPLAINED', 'MISSING_LINE'):
    v = [r for r in rows if r['reason'] == k]
    print(f'\n{k}: {len(v)}')
    for r in v[:8]: print('   ', r['location'][:20], r['invoices'], r['invoice_dates'], '| report', r['report_invoiced_hours'], 'billed', r['billed_hours'], '|', [(e['name'][:30], e['status'], e['hours']) for e in r['extra_lines']][:3])
