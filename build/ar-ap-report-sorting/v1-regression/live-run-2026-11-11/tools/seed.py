#!/usr/bin/env python3
"""ONE COMMAND rebuild of every record the A/R and A/P aging regression run needs (Rule 114).

    python3 seed.py qa            # find-or-create everything in manifest.json, resumable
    python3 seed.py qa --check    # read-only: say what exists in the ledger (status.py proves it on the report)

Idempotent and resumable: every created record is written to seeded-<env>.json the moment it exists;
a re-run skips what the ledger holds. If the branch was redeployed and the ledger is stale, move the
ledger aside (status.py says MISSING) and run again: dates are relative to the run day, so a rebuild on
another day keeps every case's 'N days ago' true.
Endpoints: read from the front-end API modules at 8e35ee0d02 (Rule 115); payload traps in SEEDED.md."""
import json, os, sys, uuid, datetime
from zoneinfo import ZoneInfo
from api import call
from seedlib import Ledger, ok, customer, invoice, EXEMPT_TAX, LABOUR_TYPE, work_order
HERE = os.path.dirname(os.path.abspath(__file__))
ENV = sys.argv[1] if len(sys.argv) > 1 else 'qa'
CHECK = '--check' in sys.argv
WP = {'qa': {'A': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'America/Edmonton'),
             'B': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton')}}
M = json.load(open(f'{HERE}/manifest.json'))
L = Ledger(ENV)
TODAY = datetime.date.fromisoformat(L.get('anchor') or datetime.datetime.now(ZoneInfo('America/Edmonton')).date().isoformat())
if not L.get('anchor'): L.put('anchor', TODAY.isoformat())
def day(ago): return TODAY - datetime.timedelta(days=ago)
def sql_dt(ago): return f'{day(ago).isoformat()} 18:00:00'
def iso(ago):
    # A document dated TODAY must carry a time already past: the as-of instant for today is NOW, so an
    # 18:00Z stamp would sit in the future until 18:00Z (found 11 Nov 2026: two 'today' credits missing).
    if ago == 0:
        return (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=5)).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    return f'{day(ago).isoformat()}T18:00:00.000Z'
CUR = {'loc': 'A'}
def at(loc):
    if CUR['loc'] == loc: return
    wid, tz = WP[ENV][loc]
    r = call(ENV, '/api/iam/change-location', 'POST', {'workplace_id': wid, 'workplace_timezone': tz}, allow_change_location=True)
    ok(r, f'change-location {loc}'); CUR['loc'] = loc; print(f'  [location -> {loc}]')
    import seedlib
    seedlib.CUR_LT.clear()
    if loc != 'A':
        seedlib.CUR_LT['fixed_total'] = True   # no labour type: LineDialog's fixed-line-total mode
def unpaid_customer(acc):
    r = call(ENV, f'/api/customer-account/list-unpaid-transaction?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=100')
    return ok(r, 'unpaid')['response']['collection']
def unpaid_vendor(acc):
    r = call(ENV, f'/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=100')
    return ok(r, 'vunpaid')['response']['collection']
def credit_memo(c, d, used=()):
    for x in unpaid_customer(c['account']):
        if x['type'] == 'credit' and abs(x['amount']) == d['amount'] and str(x['date']).startswith(day(d['ago']).isoformat()) and x['id'] not in used:
            return {'id': x['id'], 'number': x.get('credit_display_number'), 'reused_unrecorded': True}
    for body in ({'customer_account_id': c['account'], 'amount': d['amount'], 'reason': 'ZZAUTOTEST aging seed', 'origin_date': iso(d['ago'])},
                 {'customerAccountId': c['account'], 'amount': d['amount'], 'reason': 'ZZAUTOTEST aging seed', 'originDate': iso(d['ago'])}):
        r = call(ENV, '/api/credit-memos', 'POST', body)
        if r['status'] in (200, 201): break
    x = ok(r, 'credit memo')
    return {'id': x.get('creditMemoId') or x.get('id'), 'number': x.get('creditNumber'), 'raw': {k: x.get(k) for k in list(x)[:12]}}
def pay(c, inv_id, amount, ago, credits=None):
    rows = unpaid_customer(c['account'])
    row = dict([x for x in rows if x['reference_id'] == inv_id][0], transaction_payment_amount=amount, index=0)
    applied = []
    for cr in credits or []:
        crow = [x for x in rows if x['id'] == cr['id'] or x.get('reference_id') == cr['id']]
        applied.append(dict(crow[0], transaction_payment_amount=cr['amount'], index=0))
    cash = 0 if credits else amount
    body = {'account_id': c['account'], 'primary_id': None, 'ibs_batch_id': None, 'payment_date': iso(ago),
            'payment_method': 'Cash', 'reference_number': 'ZZAUTOTEST', 'description': 'ZZAUTOTEST aging seed',
            'new_credit': 0, 'new_deposit': 0, 'payment_amount': cash, 'transactions': [row],
            'applied_deposits': [], 'applied_credits': applied}
    return {'id': ok(call(ENV, '/api/customer-account/create-customer-payment', 'POST', body), 'payment')['id']}
def overpay_deposit(c, inv_id, inv_amount, d):
    """A free-standing deposit is what the app makes from an overpayment (CreatePaymentCommandHandler
    takeFromOverpayment, dated the payment date): pay the invoice in full plus the deposit amount."""
    rows = unpaid_customer(c['account'])
    row = dict([x for x in rows if x['reference_id'] == inv_id][0], transaction_payment_amount=inv_amount, index=0)
    body = {'account_id': c['account'], 'primary_id': None, 'ibs_batch_id': None, 'payment_date': iso(d['ago']),
            'payment_method': 'Cash', 'reference_number': 'ZZAUTOTEST', 'description': 'ZZAUTOTEST overpayment deposit',
            'new_credit': d['amount'], 'new_deposit': d['amount'], 'payment_amount': inv_amount + d['amount'], 'transactions': [row],
            'applied_deposits': [], 'applied_credits': []}
    pid = ok(call(ENV, '/api/customer-account/create-customer-payment', 'POST', body), 'overpay deposit')['id']
    deps = ok(call(ENV, f"/api/customer-deposits/list?accountId={c['account']}"), 'deposits')
    coll = deps.get('collection') if isinstance(deps, dict) else deps
    mine = [x for x in (coll or []) if abs(float(x.get('amount') or 0)) == d['amount']]
    return {'payment_id': pid, 'id': (mine[0].get('id') if mine else None), 'number': (mine[0].get('creditNumber') or mine[0].get('credit_number')) if mine else None, 'deposits_seen': len(coll or [])}
def free_deposit(c, d):
    body = {'account_id': c['account'], 'primary_id': None, 'ibs_batch_id': None, 'payment_date': iso(d['ago']),
            'payment_method': 'Cash', 'reference_number': 'ZZAUTOTEST', 'description': 'ZZAUTOTEST free deposit',
            'new_credit': d['amount'], 'new_deposit': d['amount'], 'payment_amount': d['amount'], 'transactions': [],
            'applied_deposits': [], 'applied_credits': []}
    pid = ok(call(ENV, '/api/customer-account/create-customer-payment', 'POST', body), 'free deposit')['id']
    deps = ok(call(ENV, f"/api/customer-deposits/list?accountId={c['account']}"), 'deposits')
    return {'payment_id': pid, 'deposits_after': deps}
def wo_deposit(c, d):
    wo = work_order(ENV, c)
    body = {'work_order_id': wo, 'amount': d['amount'], 'payment_method': 'Cash', 'deposit_date': day(d['ago']).isoformat(),
            'reference_number': 'ZZAUTOTEST', 'memo': 'ZZAUTOTEST wo deposit'}
    x = ok(call(ENV, '/api/deposits', 'POST', body), 'wo deposit')
    return {'wo': wo, 'id': x.get('id'), 'number': x.get('creditNumber')}
def vendor(v):
    rec = L.get(f'vendor:{v["key"]}')
    if rec: return rec
    body = {"name": v['name'], "address_1": "1 ZZAUTOTEST Way", "city": "Calgary", "state_or_province": "Alberta",
            "postal_code": "T2C 4M5", "telephone": "(403) 555-0102", "email": f"{v['key'].lower()}@zzautotest.test",
            "credit_limit": 25000, "tax_id": EXEMPT_TAX[ENV]}
    term = v.get('term', 'Net 30')
    if term: body['credit_term'] = term
    vid = ok(call(ENV, '/api/parts-catalogue/add-vendor', 'POST', body), 'vendor')['vendor_id']
    acc = ok(call(ENV, f'/api/parts-catalogue/vendor/{vid}'), 'vendor view')['vendor']['vendor_account_id']
    rec = {'id': vid, 'name': v['name'], 'account': acc}; L.put(f'vendor:{v["key"]}', rec); return rec
def bill(v, key, d):
    o = ok(call(ENV, '/api/inventory/orders/create', 'POST', {'vendor_id': v['id'], 'note': 'ZZAUTOTEST', 'items': [{
        'id': str(uuid.uuid4()), 'is_core': False, 'part_number': 'ZZAGING-1', 'quantity': 1, 'price': d['amount'],
        'description': 'ZZAUTOTEST Aging Bill Part'}]}), 'po')['order_id']
    order = ok(call(ENV, f'/api/inventory/orders/{o}'), 'po view')['order']
    items = [dict(it, quantity_received=float(it['quantity_ordered']), total=float(it['total_cost'])) for it in order['items']]
    num = f'ZZT-{key}-{d["k"]}'.upper()
    ok(call(ENV, '/api/inventory/orders/accept', 'POST', {'id': o, 'invoice_number': num, 'invoice_date': iso(d['ago']),
        'note': 'ZZAUTOTEST', 'items': json.dumps(items), 'total': d['amount'], 'tax': 0, 'order_status': 'fulfilled'}), 'accept')
    t = [x for x in unpaid_vendor(v['account']) if x['invoice_number'] == num]
    return {'order': o, 'po_number': order.get('order_number'), 'number': num, 'txn': t[0]['id'] if t else None,
            'delivery': t[0]['reference_id'] if t else None, 'due_date': t[0]['due_date'] if t else None}
def vendor_credit(v, key, d):
    r = ok(call(ENV, '/api/part/manual-return-request/create', 'POST', {'vendorId': v['id'], 'packagingSlip': f'ZZT-{key}',
        'items': [{'inventoryPartId': None, 'partNumber': 'ZZAGING-RET', 'partDescription': 'ZZAUTOTEST return',
                   'quantity': 1, 'costDecimal': d['amount'], 'restockingFeeDecimal': 0, 'returnReason': 'ZZAUTOTEST'}]}), 'manual return')
    rid = r.get('id') or r.get('manual_return_id') or r.get('return_id')
    memo = f'ZZT-VC-{key}-{d["k"]}'.upper()
    x = ok(call(ENV, f'/api/part/manual-return/{rid}/create', 'POST', {'creditMemoNumber': memo, 'creditDate': iso(d['ago']),
        'tax': 0, 'note': 'ZZAUTOTEST'}), 'manual return credit')
    return {'manual_return': rid, 'return': x.get('return_id'), 'memo': memo}
def vpay(v, txn, amount, ago, credit_txn=None, credit_amount=0):
    rows = unpaid_vendor(v['account'])
    row = dict([x for x in rows if x['id'] == txn][0], transaction_payment_amount=amount, index=0)
    applied = []
    if credit_txn:
        crow = [x for x in rows if x['id'] == credit_txn or x.get('reference_id') == credit_txn]
        if not crow: raise RuntimeError(f'credit row not in unpaid list: {[ (x["type"], x["id"], x["amount"]) for x in rows]}')
        applied.append(dict(crow[0], transaction_payment_amount=credit_amount, index=0))
    cash = 0 if credit_txn else amount
    body = {'account_id': v['account'], 'primary_id': None, 'ibs_batch_id': None, 'payment_date': iso(ago),
            'payment_method': 'Cash', 'reference_number': 'ZZAUTOTEST', 'description': 'ZZAUTOTEST aging seed',
            'new_credit': 0, 'new_deposit': 0, 'payment_amount': cash, 'transactions': [row],
            'applied_deposits': [], 'applied_credits': applied}
    return {'resp': ok(call(ENV, '/api/parts-catalogue/vendor/payment/create', 'POST', body), 'vendor payment')}
def run():
    todo = []
    for c in M['customers']:
        for d in c['docs']: todo.append(('c', c, d))
        if not c['docs']: todo.append(('c', c, None))
    for v in M['vendors']:
        for d in v['docs']: todo.append(('v', v, d))
    # location B first (one switch out and one back)
    todo.sort(key=lambda t: 0 if (t[2] or {}).get('at') == 'B' else 1)
    done = fail = 0
    for kind, p, d in todo:
        dk = f"doc:{p['key']}:{d['k']}" if d else f"cust-only:{p['key']}"
        if L.get(dk): done += 1; continue
        if CHECK: print(f'  MISSING {dk}'); continue
        try:
            at(d.get('at', 'A') if d else 'A')
            if kind == 'c':
                c = customer(ENV, L, p['key'], p['name'])
                if p.get('term') and not L.get(f'term:{p["key"]}'):
                    view = ok(call(ENV, f"/api/customers/view/{c['id']}"), 'view')['company']
                    # the payload CustomerDialog.vue sends (tax block included - without it the API answers 500)
                    body = {k: view.get(k) for k in ('name', 'telephone', 'address_1', 'city', 'state_or_province', 'postal_code', 'country_code',
                            'credit_limit', 'shop_supplies_charge', 'min_shop_supplies_charge', 'max_shop_supplies_charge', 'labour_type_id') if view.get(k) is not None}
                    body.update({'id': c['id'], 'require_po': bool(view.get('require_po')), 'credit_term': p['term'], 'pin_notes': False, 'notes': None,
                                 'tax': {'id': None, 'isEnabledLabor': True, 'isEnabledParts': True, 'isEnabledShopSupplies': True}})
                    ok(call(ENV, '/api/customers/change', 'POST', body), 'credit term')
                    got = ok(call(ENV, f"/api/customers/view/{c['id']}"), 'view')['company']['credit_term']
                    if got != p['term']: raise RuntimeError(f'credit term did not stick: {got}')
                    L.put(f'term:{p["key"]}', got)
                if d is None: rec = {'customer': c['id']}
                elif d['type'] == 'invoice': rec = invoice(ENV, L, f"{p['key']}:{d['k']}", c, d['amount'], sql_dt(d['ago']))
                elif d['type'] == 'credit_memo': rec = credit_memo(c, d)
                elif d['type'] == 'payment':
                    inv = L.get(f"doc:{p['key']}:{d['on']}"); rec = pay(c, inv['invoice_id'], d['amount'], d['ago'])
                elif d['type'] == 'apply_credit':
                    inv = L.get(f"doc:{p['key']}:{d['on']}"); cm = L.get(f"doc:{p['key']}:{d['credit']}")
                    rec = pay(c, inv['invoice_id'], d['amount'], d['ago'], credits=[{'id': cm['id'], 'amount': d['amount']}])
                elif d['type'] == 'free_deposit': rec = free_deposit(c, d)
                elif d['type'] == 'overpay_deposit':
                    inv = L.get(f"doc:{p['key']}:{d['on']}"); rec = overpay_deposit(c, inv['invoice_id'], float(inv['total']), d)
                elif d['type'] == 'overpay_invoice':
                    inv = L.get(f"doc:{p['key']}:{d['on']}"); rec = pay(c, inv['invoice_id'], d['amount'], d['ago'])
                elif d['type'] == 'credit_memo_many':
                    made = L.get(f"many:{p['key']}:{d['k']}") or []
                    while len(made) < d['repeat']:
                        x = credit_memo(c, {'amount': d['amount'], 'ago': d['ago']}, used=tuple(m['id'] for m in made) + ('force-new',))
                        if x.get('reused_unrecorded') and x['id'] in [m['id'] for m in made]: break
                        made.append(x); L.put(f"many:{p['key']}:{d['k']}", made)
                    rec = {'count': len(made), 'first': made[0]['number'], 'last': made[-1]['number']}
                elif d['type'] == 'wo_deposit': rec = wo_deposit(c, d)
                elif d['type'] == 'open_wo':
                    rec = {'wo': work_order(ENV, c)}
                    rec['number'] = ok(call(ENV, f"/api/work-orders/view/{rec['wo']}"), 'wo')['work_order']['number']
                elif d['type'] == 'part_sale':
                    x = ok(call(ENV, '/api/part-sales', 'POST', {'customer_id': c['contact'], 'contact_id': c['contact'], 'vehicle_id': c['vehicle'],
                        'mileage': None, 'engine_hours': None, 'licence_plate': None, 'vin': None, 'company_id': c['id']}), 'part sale')
                    rec = {'id': x.get('id') if isinstance(x, dict) else None, 'resp': x}
                    if not rec['id']:
                        lst = ok(call(ENV, f"/api/customers/view/{c['id']}"), 'view')['company']
                        rec['part_sale_count'] = lst.get('part_sale_count')
                else: raise RuntimeError('unknown type ' + d['type'])
                if d and d.get('reverse') and d['type'] == 'payment':
                    ok(call(ENV, '/api/customer-account/reverse-customer-payment', 'POST', {'id': rec['id']}), 'reverse payment'); rec['reversed_now'] = True
                if d and d.get('reverse') and d['type'] == 'overpay_deposit':
                    # /deposits/{id}/reverse refuses a free deposit ("refund it to the customer ... or apply it") and the
                    # refund route (cash-out) is switched off (SV-9904). Reversing the payment that made it stamps the
                    # deposit reversed_at = now (proved 11 Nov 2026: DEP-4715 -> reversed).
                    ok(call(ENV, '/api/customer-account/reverse-customer-payment', 'POST', {'id': rec['payment_id']}), 'reverse originating payment'); rec['reversed_now'] = True
                if d and d.get('void'):
                    ok(call(ENV, f"/api/credit-memos/{rec['id']}/void", 'POST', {}), 'void'); rec['voided_now'] = True
            else:
                v = vendor(p)
                if d['type'] == 'bill': rec = bill(v, p['key'], d)
                elif d['type'] == 'vendor_credit': rec = vendor_credit(v, p['key'], d)
                elif d['type'] == 'vendor_credit_direct':
                    ok(call(ENV, '/api/parts-catalogue/vendor/credit/create', 'POST', {'vendorId': v['id'], 'amount': d['amount'], 'memo': f"ZZT-DIRECT-{p['key']}"}), 'direct vendor credit')
                    rec = {'memo': f"ZZT-DIRECT-{p['key']}", 'note': 'dated now by the API (no date field)'}
                elif d['type'] == 'vpayment':
                    b = L.get(f"doc:{p['key']}:{d['on']}"); rec = vpay(v, b['txn'], d['amount'], d['ago'])
                elif d['type'] == 'vapply_credit':
                    b = L.get(f"doc:{p['key']}:{d['on']}")
                    vc = [x for x in unpaid_vendor(v['account']) if x['type'] != 'delivery']
                    rec = vpay(v, b['txn'], d['amount'], d['ago'], credit_txn=vc[0]['id'] if vc else None, credit_amount=d['amount'])
            if d: rec.update({'type': d['type'], 'amount': d.get('amount'), 'date': day(d['ago']).isoformat() if 'ago' in d else None, 'at': d.get('at', 'A')})
            L.put(dk, rec); done += 1; print(f'  OK {dk} {json.dumps(rec)[:160]}')
        except SystemExit: raise
        except Exception as e:
            fail += 1; print(f'  FAIL {dk}: {e}')
    at('A')
    print(f'anchor {TODAY} | done {done} | failed {fail} | total {len(todo)}')
if __name__ == '__main__':
    try: run()
    finally:
        if CUR['loc'] != 'A': at('A')
