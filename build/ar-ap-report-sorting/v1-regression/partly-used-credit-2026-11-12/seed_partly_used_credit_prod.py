#!/usr/bin/env python3
"""Make ONE partly used credit memo on the PRODUCTION test account (old reports, v26.45.x before the A/R A/P release),
so the old A/R Aging Detail can be photographed showing what "Amount" means for a partly used credit (QA lead,
12 Nov 2026: before/after evidence for the "Amount of a partly used credit" defect).
Path (normal app actions, front-end endpoints, Rule 115):
  1. customer "ZZAUTOTEST SV11315 Partly Used Credit" (+contact, vehicle)      seedlib.customer
  2. invoice from a one-line fixed-price work order                             seedlib.invoice (fixed_line_total)
  3. credit memo $200                                                           POST /api/credit-memos
  4. payment of $0 cash that applies the credit to the invoice's whole balance  POST /api/customer-account/create-customer-payment
     (applied_credits = [{id: <credit id>}], CreatePaymentCommand::getAppliedCredits reads ['id'])
Result: credit amount $200, open balance $200 - invoice balance. Resumable via the ledger; --check is read-only."""
import json, os, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'live-run-2026-11-11', 'tools'))
from api import call            # noqa: E402
import seedlib                  # noqa: E402
from seedlib import ok          # noqa: E402
ENV = 'prod'; NAME = 'ZZAUTOTEST SV11315 Partly Used Credit'
LEDGER = os.path.join(HERE, 'ledger-prod.json'); L = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
def put(k, v): L[k] = v; json.dump(L, open(LEDGER, 'w'), indent=1, sort_keys=True)
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
class _L:
    def get(self, k): return L.get(k)
    def put(self, k, v): put(k, v)
def unpaid(acc):
    return ok(call(ENV, f'/api/customer-account/list-unpaid-transaction?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=100&openOnly=false'), 'unpaid')['response']['collection']
def show(tag):
    c = L.get('cust:PUC')
    rows = [{k: x.get(k) for k in ('type', 'id', 'reference_id', 'formatted_invoice_number', 'credit_display_number', 'amount', 'balance', 'status')} for x in unpaid(c['account'])]
    print(tag, json.dumps(rows, indent=1)); L.setdefault('measures', []).append({'tag': tag, 'utc': now(), 'rows': rows}); put('measures', L['measures'])
if '--check' in sys.argv: show('check'); sys.exit(0)
seedlib.EXEMPT_TAX['prod'] = '2beeed67-efa2-4a77-af1f-6055d1d29e19'   # the tax an existing prod ZZAUTOTEST work order uses
seedlib.CUR_LT['fixed_total'] = True
c = seedlib.customer(ENV, _L(), 'PUC', NAME)
inv = seedlib.invoice(ENV, _L(), 'PUC', c, 100.0, datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S'))
if not L.get('credit'):
    x = ok(call(ENV, '/api/credit-memos', 'POST', {'customerAccountId': c['account'], 'amount': 200,
           'reason': 'ZZAUTOTEST partly used credit (A/R A/P release evidence, SV-11315)'}), 'credit memo')
    put('credit', {'resp': x, 'utc': now()})
show('before applying')
if not L.get('payment'):
    rows = unpaid(c['account'])
    i = [x for x in rows if x['type'] not in ('credit', 'deposit')][0]; cr = [x for x in rows if x['type'] == 'credit'][0]
    bal = float(i['balance'])
    body = {'account_id': c['account'], 'primary_id': None, 'ibs_batch_id': None,
            'payment_date': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'payment_method': 'Cash',
            'reference_number': 'ZZAUTOTEST', 'description': 'ZZAUTOTEST apply part of the credit',
            'new_credit': 0, 'new_deposit': 0, 'payment_amount': 0,
            'transactions': [dict(i, transaction_payment_amount=bal, index=0)], 'applied_deposits': [], 'applied_credits': [cr]}
    r = call(ENV, '/api/customer-account/create-customer-payment', 'POST', body)
    put('payment', {'status': r['status'], 'raw': r['raw'][:400], 'utc': now(), 'invoice_balance_before': bal})
    print('payment', r['status'], r['raw'][:300])
show('after applying')
print('ledger', LEDGER)
