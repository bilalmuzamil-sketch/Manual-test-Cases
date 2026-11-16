#!/usr/bin/env python3
"""Area 3 — Reports > Export Reports > Customer Payment (Heavy Duty, 1–30 Sep 2026, the 28 Oct window): EVERY row,
by kind, against the customer's own records (Customers > <customer> > Payments list and Deposits list):
  invoice-payment rows (incl. the 28 Oct "X-PAY1" rows), deposit rows (DEP-#), and rows with no invoice (refund /
  excess / overflow payments). No written spec exists for the export layout (28 Oct searches), so this is a
  record-agreement check. Names never written; counts + document numbers only. Run: TZ=Asia/Karachi python3 payment_export_rows.py"""
import sys, os, json, csv, io, collections, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
W, TZ = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'; Z = ZoneInfo(TZ); H = {'X-Location-ID': W}
curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': TZ})
num = lambda s: round(float(str(s).replace(',', '').replace('$', '') or 0), 2)
rows = list(csv.DictReader(io.StringIO(json.load(open('/tmp/cln/rg16/w4/exp/hd_sep__customer_payment.json'))['body']['data'][0])))
def pg(path, q):
    out, p = [], 1
    while True:
        s, b = curl('GET', path + '?' + urlencode(q + [('pagination[page]', p), ('pagination[rowsPerPage]', 200)]), extra_headers=H)
        col = ((b or {}).get('data') or {}).get('collection', []) if s == 200 else []
        out += col
        if len(col) < 200: return out
        p += 1
cache = {}
def records(name):
    if name in cache: return cache[name]
    s, b = curl('GET', '/api/customers?' + urlencode([('search', name), ('pagination[rowsPerPage]', 50)]), extra_headers=H)
    cands = [x for x in ((b or {}).get('data') or {}).get('collection', []) if (x.get('name') or '').strip() == name.strip()]
    recs = {'matches': len(cands), 'payments': [], 'deposits': []}
    for x in cands:
        s, v = curl('GET', f"/api/customers/view/{x['id']}", extra_headers=H)
        acc = ((v or {}).get('data') or {}).get('company', {}).get('customer_account_id') if s == 200 else None
        if not acc: continue
        recs['payments'] += pg('/api/customer-payment/list', [('accountId', acc)])
        s, d = curl('GET', '/api/customer-deposits/list?' + urlencode([('accountId', acc)]), extra_headers=H)
        recs['deposits'] += ((d or {}).get('data') or {}).get('collection', []) if s == 200 else []
    cache[name] = recs; return recs
def loc_day(iso):
    if not iso: return None
    x = dt.datetime.fromisoformat(iso.replace('Z', '+00:00').replace(' ', 'T'))
    return (x if x.tzinfo else x.replace(tzinfo=dt.timezone.utc)).astimezone(Z).date()
mdY = lambda s: dt.datetime.strptime(s[:10], '%m-%d-%Y').date()
res = collections.defaultdict(lambda: {'rows': 0, 'pass': 0, 'fail': []})
for r in rows:
    kind = 'deposit' if r['Invoice No'].startswith('DEP-') else ('invoice_payment' if r['Invoice No'] else 'no_invoice')
    R = res[kind]; R['rows'] += 1; rec = records(r['Customer']); amt = num(r['Amount']); day = mdY(r['Payment Date'])
    live = [p for p in rec['payments'] if p.get('payment_status') != 'reversed']
    if kind == 'deposit':
        d = [x for x in rec['deposits'] if x.get('creditNumber') == r['Invoice No']]
        ok = any(abs(num(x['amount']) - amt) < 0.015 and loc_day(x['depositDate']) == day for x in d)
        why = None if ok else {'doc': r['Invoice No'], 'row': [r['Payment Date'], r['Amount']], 'record': [(x.get('depositDate'), x.get('amount'), x.get('status')) for x in d][:3] or 'no deposit with that number'}
    elif kind == 'invoice_payment':
        got = [(p['payment_date'], s['amount']) for p in live for s in (p.get('payment_statements') or []) if r['Invoice No'] in {s.get('invoice_display_number'), s.get('invoice_number')}]
        ok = any(abs(num(a) - amt) < 0.015 and loc_day(pd) == day for pd, a in got)
        why = None if ok else {'doc': r['Invoice No'], 'row': [r['Payment Date'], r['Amount']], 'record': got[:4] or 'no payment on that invoice'}
    else:
        got = [(p['payment_date'], p.get('amount'), p.get('display_type')) for p in live if (p.get('description') or '').strip() == (r['Memo'] or '').strip() or not p.get('payment_statements')]
        ok = any(abs(num(a) - amt) < 0.015 and loc_day(pd) == day for pd, a, _ in got)
        why = None if ok else {'row': [r['Payment Date'], r['Amount'], r['payment method']], 'record': got[:4] or 'no unapplied/refund payment'}
    if rec['matches'] != 1: why = (why or {}) | {'customer_name_matches': rec['matches']}; ok = ok and rec['matches'] == 1
    if ok: R['pass'] += 1
    if not ok: R['fail'].append(why)
out = {'export': 'Customer Payment', 'location': 'Staging Heavy Duty - 9919', 'zone': TZ, 'process_TZ': os.environ.get('TZ'), 'window': ['2026-09-01', '2026-09-30'],
       'rows': len(rows), 'customers_looked_up': len(cache), 'by_kind': {k: {'rows': v['rows'], 'pass': v['pass'], 'fail_count': len(v['fail']), 'fail': v['fail'][:15]} for k, v in res.items()},
       'kinds_seen': dict(collections.Counter(p.get('display_type') for c in cache.values() for p in c['payments']))}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'payment-export-rows.json'), 'w'), indent=1, default=str)
print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk != 'fail'} for k, v in out['by_kind'].items()}), out['customers_looked_up'], out['kinds_seen'])
