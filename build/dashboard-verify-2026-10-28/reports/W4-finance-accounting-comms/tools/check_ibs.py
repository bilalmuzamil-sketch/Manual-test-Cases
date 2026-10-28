#!/usr/bin/env python3
"""W4 — IBS Batches (Ready to Send / Sent / Payments) full collection + checks.

Written sources: SV-2144 (Batch Transactions workflow), SV-2441/SV-2427 (only IBS customers), SV-11065
(IBS export CSV headers + order). Independent records: invoice view (/api/invoices/{id}/view), the
customer account ledger (customer-account/list-unpaid-transaction), the customer card (IBS number).
Raw → /tmp/cln/w4/ibs/. Results → results-ibs.json.
"""
import json, os, sys, csv, io, collections
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl, WORKPLACES
OUT = '/tmp/cln/w4/ibs'; os.makedirs(OUT, exist_ok=True)
RES = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms/results-ibs.json'
r2 = lambda x: round(x + 0.0, 2)
rows = []
def chk(cid, loc, desc, ok, observed=None, expected=None, ref=None):
    rows.append({'check': cid, 'location': loc, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected, 'ref': ref})

summary = {}
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}); H = {'X-Location-ID': wid}
    s1, t = curl('GET', '/api/customers/ibs/list-transactions?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
    s2, b = curl('GET', '/api/customers/ibs/list-batches?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
    s3, p = curl('GET', '/api/customers/ibs/list-payments?' + urlencode([('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]), extra_headers=H)
    json.dump({'t': t, 'b': b, 'p': p}, open(f'{OUT}/{wid}.json', 'w'))
    rts = t['data']['response']['collection']; cnt = t['data']['response'].get('batch_transactions_count')
    batches = b['data']['response'] or []; pays = p['data']['collection']
    summary[name] = {'ready_to_send': len(rts), 'count_field': cnt, 'batches': len(batches), 'payments': len(pays)}
    chk('I1', name, 'Ready to Send count field = rows listed', cnt == len(rts), cnt, len(rts), 'SV-2144 "full listing of all invoices waiting"')
    # every Ready-to-Send row: open, not batched, belongs to an IBS customer, amount = invoice record
    cust_cache = {}
    bad_open, bad_ibs, bad_amt, bad_wp = [], [], [], []
    for r in rts:
        if r['type'] == 'invoice' and not (r['balance'] > 0 and r['status'] in ('unpaid', 'partially_paid')):
            bad_open.append(r['invoice_display_number'])
        if r['work_place_id'] != wid:
            bad_wp.append(r['invoice_display_number'])
        if r['type'] == 'invoice' and r.get('reference_id'):
            s, iv = curl('GET', f"/api/invoices/{r['reference_id']}/view", extra_headers=H)
            c = (iv.get('data') or {}).get('collection', {}) if s == 200 else {}
            comp = (c.get('work_order') or {}).get('company_id')
            sv, cv = curl('GET', f'/api/customers/view/{comp}', extra_headers=H) if comp else (0, {})
            ibs = ((cv.get('data') or {}).get('company') or {}).get('ibs') if sv == 200 else None
            if not ibs:
                bad_ibs.append({'no': r['invoice_display_number'], 'customer': r['customer_name'], 'ibs': ibs})
            tot = c.get('total_balance')
            if tot is None or abs(float(str(tot).replace(',', '')) - r['amount']) >= 0.005:
                bad_amt.append({'no': r['invoice_display_number'], 'listed': r['amount'], 'invoice_total': tot})
    chk('I2', name, 'Ready to Send lists only open invoices', not bad_open, bad_open[:5], [], 'SV-2144 "waiting to be sent"')
    chk('I3', name, 'Ready to Send lists only invoices of customers with an IBS number', not bad_ibs, bad_ibs[:5], [], 'SV-2144 "only for IBS customers with an IBS number populated"; SV-2441')
    chk('I4', name, 'Ready to Send Total = the invoice\'s own total', not bad_amt, bad_amt[:5], [], 'invoice record')
    chk('I5', name, 'Ready to Send lists only this location\'s invoices', not bad_wp, bad_wp[:5], [], 'location-scoped list')
    # Sent batches
    bb = []
    for bt in batches:
        ta = r2(sum(x['amount'] for x in bt['transactions']) + sum((x.get('amount') or 0) for x in bt.get('credits', [])))
        tb = r2(sum(x['balance'] for x in bt['transactions']) + sum((x.get('balance') if x.get('balance') is not None else x.get('amount', 0)) for x in bt.get('credits', [])))
        st = 'paid' if abs(tb) < 0.005 else ('unpaid' if abs(tb - ta) < 0.005 else 'partially_paid')
        if abs(ta - bt['amount']) >= 0.005 or abs(tb - bt['balance']) >= 0.005 or st != bt['status']:
            bb.append({'batch': bt['id'], 'amount': bt['amount'], 'sum_amount': ta, 'balance': bt['balance'], 'sum_balance': tb, 'status': bt['status'], 'derived': st})
    chk('I6', name, 'Each Sent batch: amount and balance = sum of its invoices/credits; status follows the balance', not bb, bb[:5], [], 'SV-2144 Sent tab grouping')
    inv_in_batch = {x['id']: bt['id'] for bt in batches for x in bt['transactions']}
    overlap = [r['invoice_display_number'] for r in rts if r['id'] in inv_in_batch]
    chk('I7', name, 'An invoice is never both Ready to Send and in a Sent batch', not overlap, overlap[:5], [], 'SV-2144 "cleared from this listing and moved to Sent"')
    # Payments
    bp = []
    for py in pays:
        sm = r2(sum(x['amount'] for x in py['payment_statements']))
        if abs(sm - py['payment_statements_amount']) >= 0.005:
            bp.append({'ref': py['reference_number'], 'shown': py['payment_statements_amount'], 'sum': sm})
    chk('I8', name, 'Each IBS payment amount = sum of the invoices it pays', not bp, bp[:5], [], 'SV-2144 New Payment')
    # Export CSV for every batch
    for bt in batches:
        s, ex = curl('GET', f"/api/customers/ibs/batch-export/{bt['id']}", extra_headers=H)
        data = (ex.get('data') or {}).get('data') if s == 200 and isinstance(ex.get('data'), dict) else (ex.get('data') if s == 200 else None)
        txt = data if isinstance(data, str) else json.dumps(ex)[:500]
        open(f"{OUT}/export-{bt['id']}.txt", 'w').write(txt)
        try:
            import base64
            dec = base64.b64decode(txt).decode() if not txt.lstrip().startswith(('Acct', '"', 'IBS')) else txt
        except Exception:
            dec = txt
        alllines = list(csv.reader(io.StringIO(dec)))
        hi = next((i for i, l in enumerate(alllines) if l[:1] == ['Acct#']), 0)
        lines = alllines[hi:]
        hdr = lines[0] if lines else []
        pre = {l[0]: l[1] for l in alllines[:hi] if len(l) > 1 and l[0]}
        inv_total = r2(sum(x['amount'] for x in bt['transactions']))
        chk('I11', name, f'IBS export "Invoices" line = sum of the batch invoices (batch {bt["id"][:8]})', pre.get('Invoices', '').replace('$', '').replace(',', '') and abs(float(pre.get('Invoices', '0').replace('$', '').replace(',', '')) - inv_total) < 0.005, pre, inv_total, 'internal')
        chk('I9', name, f'IBS export CSV headers = Acct#, Ref#, Amount, PO, Invoice Date (batch {bt["id"][:8]})',
            hdr[:5] == ['Acct#', 'Ref#', 'Amount', 'PO', 'Invoice Date'], hdr, ['Acct#', 'Ref#', 'Amount', 'PO', 'Invoice Date'], 'SV-11065 AC1/AC2')
        body = lines[1:]
        if hdr[:3] == ['Acct#', 'Ref#', 'Amount']:
            want = {'INV-' + (x.get('invoice_display_number') or x['invoice_number']): x['amount'] for x in bt['transactions']}
            got = {}
            for ln in body:
                if len(ln) >= 3 and ln[1]:
                    try:
                        got[ln[1]] = float(ln[2].replace(',', '').replace('$', ''))
                    except ValueError:
                        got[ln[1]] = ln[2]
            mis = [(k, v, got.get(k)) for k, v in want.items() if not isinstance(got.get(k), float) or abs(got[k] - v) >= 0.005]
            chk('I10', name, f'IBS export CSV: one row per batch invoice with its amount (batch {bt["id"][:8]})', not mis and len(got) == len(want),
                {'rows': len(got), 'mismatch': mis[:5], 'sample_line': body[:2]}, len(want), 'SV-11065 AC3 "retains all existing invoice data"')
json.dump({'summary': summary, 'checks': rows}, open(RES, 'w'), indent=1)
print(json.dumps(summary)); print(collections.Counter(r['result'] for r in rows))
for r in rows:
    if r['result'] == 'FAIL':
        print('FAIL', r['check'], r['location'], r['desc'], json.dumps(r['observed'])[:400])
