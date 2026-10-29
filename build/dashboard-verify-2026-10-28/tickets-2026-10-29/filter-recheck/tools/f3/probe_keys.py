"""F3 probe (read-only): response shapes of A/P aging detail, A/P unpaid, A/R aging detail. TZ=America/Edmonton."""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
w = WID['leth']; print('loc', loc(w))
def shape(o, d=0):
    if isinstance(o, dict): return {k: shape(v, d+1) if d < 3 else type(v).__name__ for k, v in list(o.items())[:25]}
    if isinstance(o, list): return [shape(o[0], d+1)] if o else []
    return o if not isinstance(o, str) else o[:40]
for p, q in [('/api/reporting/account-payable/aging-detail-report', [('asOfDate', '2026-10-29T05:59:59.999Z')]),
             ('/api/reporting/account-payable/unpaid-invoices-report', [('asOfDate', '2026-10-21T05:59:59.999Z'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 3)]),
             ('/api/reporting/account-receivable/aging-detail-report', [('asOfDate', '2026-10-29T05:59:59.999Z')])]:
    c, b = get(p, q, w); print(p, c); print(json.dumps(shape(b))[:1500])
c, b = get('/api/reporting/account-payable/aging-detail-report', [('asOfDate', '2026-10-29T05:59:59.999Z')], w)
t = b['data']['buckets']['current']['transactions']; print('AP current n', len(t)); print(json.dumps([x for x in t if 'SV10190' in json.dumps(x)][:2])[:900])
c, b = get('/api/reporting/account-receivable/aging-detail-report', [('asOfDate', '2026-10-29T05:59:59.999Z')], w)
for k, v in b['data']['buckets'].items():
    if isinstance(v, dict):
        for x in v['transactions']:
            if 'P2-2352' in json.dumps(x) or 'P2-2439' in json.dumps(x): print(k, json.dumps(x)[:600])
