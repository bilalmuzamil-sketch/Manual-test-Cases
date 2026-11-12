#!/usr/bin/env python3
"""Make an invoice that the A/R reports count as OVERPAID (C715462), through normal app actions only.

    python3 seed_overpaid.py staging            # create (resumable; re-running skips finished steps)
    python3 seed_overpaid.py staging --check    # read-only: re-measure the record

THE DEFINITION (SV-11315 branch 8e35ee0d02, unchanged at the staging merge b8c04e2):
  ArOpenBalanceAsOfSql::invoice()  = ct.amount - SUM(cps.amount) over the invoice's payment statements with
  cps.payment_date <= cutoff AND (cp.reversed_at IS NULL OR cp.reversed_at > cutoff).
  ArOpenDocumentsSql keeps an invoice only when that is > 0, so an invoice whose replayed balance is < 0
  (paid more than its amount AS OF the cutoff) is left out of the rows and, in V2, out of the Totals.
  V1 (fc08f23) DbalAgingSummaryTotalsFetcher used the same expression with `<> 0`, so its Totals took the
  negative balance off; its customer rows used `> 0`.

THE PATH (every step a normal user action; the app's own guard - never pay more than the balance - holds):
  1. invoice I $100 and invoice B $500, both dated D0 (3 days ago, noon at location A)
  2. payment P1 $20 on I, payment date D0
  3. reverse P1 (today)              -> cp.reversed_at = now; I is back to $100 owed
  4. payment P2 $100 on I, payment date D0+1 (a past date the user types)
  For any as-of day from D0+1 up to yesterday the replay counts P1 (reversed only today, after that cutoff)
  AND P2 (dated before it): $120 paid on a $100 invoice = overpaid by $20. Today: P1 is excluded, $100 paid,
  invoice closed. So: A/R Summary "As of" yesterday shows customer A = invoice B only.
Endpoints are the front end's (Rule 115); helpers are the lane's own seedlib/api (secrets stay in /tmp).
"""
import datetime, json, os, sys
from zoneinfo import ZoneInfo
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'live-run-2026-11-11', 'tools'))
from api import call            # noqa: E402
import seedlib                  # noqa: E402
from seedlib import ok          # noqa: E402

ENV = sys.argv[1] if len(sys.argv) > 1 else 'staging'
CHECK = '--check' in sys.argv
LOC_A = {'staging': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'),
         'prod': (None, None)}[ENV]
LEDGER = os.path.join(HERE, f'overpaid-{ENV}.json')
L = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
UTC = datetime.timezone.utc
NAME = 'ZZAUTOTEST OVERPAID C715462 Cust A'

def put(k, v):
    L[k] = v; json.dump(L, open(LEDGER, 'w'), indent=1, sort_keys=True)
def now(): return datetime.datetime.now(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')
TZ = ZoneInfo(LOC_A[1])
if 'anchor_local' not in L:
    put('anchor_local', datetime.datetime.now(UTC).astimezone(TZ).date().isoformat())
ANCHOR = datetime.date.fromisoformat(L['anchor_local'])
def noon(ago):
    return datetime.datetime.combine(ANCHOR - datetime.timedelta(days=ago), datetime.time(12, 0), TZ).astimezone(UTC)
D0, D1 = noon(3), noon(2)
DAYS = [(ANCHOR - datetime.timedelta(days=n)).isoformat() for n in (3, 2, 1, 0)]

def unpaid(acc):
    r = call(ENV, f'/api/customer-account/list-unpaid-transaction?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=100')
    return ok(r, 'unpaid')['response']['collection']
def payments(acc):
    r = call(ENV, f'/api/customer-payment/list?accountId={acc}&pagination[page]=1&pagination[rowsPerPage]=50')
    d = ok(r, 'payments')
    return (d.get('response') or d).get('collection') if isinstance(d, dict) else d
def summary(cid, day):
    r = call(ENV, f'/api/reporting/reports/ar-aging-summary?asOfDate={day}&customers={cid}'
                  f'&pagination[page]=1&pagination[rowsPerPage]=30')
    d = ok(r, 'ar summary')
    return {'rows': [{k: x.get(k) for k in ('customerName', 'currentCents', 'days1To30Cents', 'totalCents')}
                     for x in d.get('collection', [])], 'totals': d.get('totals')}

def measure(tag):
    c = L.get('cust'); inv = L.get('inv:I'); invb = L.get('inv:B')
    out = {'tag': tag, 'utc': now()}
    if c:
        rows = unpaid(c['account'])
        out['unpaid'] = [{k: x.get(k) for k in ('type', 'reference_id', 'invoice_number', 'amount', 'balance', 'status')}
                         for x in rows]
        ps = payments(c['account']) or []
        out['payments'] = [{k: x.get(k) for k in ('id', 'amount', 'payment_date', 'paymentDate', 'status', 'reversed_at',
                                                   'reversedAt', 'is_reversed', 'isReversed')
                            if k in x} for x in ps]
        out['ar_summary'] = {d: summary(c['id'], d) for d in DAYS}
    L.setdefault('measures', []).append(out); put('measures', L['measures'])
    print(json.dumps(out, indent=1)[:6000])

def pay(acc, inv_id, amount, when, what):
    rows = unpaid(acc)
    row = dict([x for x in rows if x['reference_id'] == inv_id][0], transaction_payment_amount=amount, index=0)
    body = {'account_id': acc, 'primary_id': None, 'ibs_batch_id': None,
            'payment_date': when.strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'payment_method': 'Cash',
            'reference_number': 'ZZAUTOTEST', 'description': f'ZZAUTOTEST overpaid recipe {what}',
            'new_credit': 0, 'new_deposit': 0, 'payment_amount': amount, 'transactions': [row],
            'applied_deposits': [], 'applied_credits': []}
    r = call(ENV, '/api/customer-account/create-customer-payment', 'POST', body)
    return {'status': r['status'], 'id': ((r['json'] or {}).get('data') or {}).get('id'), 'raw': r['raw'][:300]}

if CHECK:
    measure('check'); sys.exit(0)

# location A (the session's active location decides where the work order and invoice are made)
if not L.get('loc'):
    wid, tz = LOC_A
    ok(call(ENV, '/api/iam/change-location', 'POST', {'workplace_id': wid, 'workplace_timezone': tz},
            allow_change_location=True), 'change-location A')
    put('loc', {'id': wid, 'tz': tz, 'utc': now()})

class _L:   # seedlib.customer/invoice expect a ledger with get/put
    def get(self, k): return L.get(k)
    def put(self, k, v):
        if isinstance(v, dict): v = dict(v, created_utc=(L.get(k) or {}).get('created_utc') or now())
        put(k, v)
SL = _L()
c = seedlib.customer(ENV, SL, 'OVP715462', NAME)
L['cust'] = c; put('cust', c)
sql = lambda t: t.strftime('%Y-%m-%d %H:%M:%S')
inv = seedlib.invoice(ENV, SL, 'I', c, 100.0, sql(D0))
invb = seedlib.invoice(ENV, SL, 'B', c, 500.0, sql(D0))
if not L.get('m:before'):
    measure('before payments'); put('m:before', True)
if not L.get('p1'):
    put('p1', dict(pay(c['account'], inv['invoice_id'], 20.0, D0, 'P1 $20 (to be reversed)'), utc=now()))
    measure('after P1')
if not L.get('p1_rev'):
    r = call(ENV, '/api/customer-account/reverse-customer-payment', 'POST', {'id': L['p1']['id']})
    put('p1_rev', {'status': r['status'], 'raw': r['raw'][:300], 'utc': now()})
    measure('after reversing P1')
if not L.get('p2'):
    put('p2', dict(pay(c['account'], inv['invoice_id'], 100.0, D1, 'P2 $100 (backdated)'), utc=now()))
    measure('after P2')
print('ledger:', LEDGER)
