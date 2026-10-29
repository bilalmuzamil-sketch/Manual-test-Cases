"""Probe (read-only): credit memos at a location and their tax. Usage: TZ=<zone> probe_cm.py <wid> <customer name> [CM numbers...]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common_p2c import *
wid, cname = sys.argv[1], sys.argv[2]; loc(wid)
for p in ('/api/customers/list', '/api/customers'):
    c, b = get(p, [('search', cname), ('pagination[page]', 1), ('pagination[rowsPerPage]', 10)], wid); print(p, c, json.dumps(b)[:300])
    if c == 200: break
coll = (b.get('data') or {}).get('collection') or []
cu = next((x for x in coll if (x.get('name') or x.get('company_name')) == cname), coll[0] if coll else None)
cid = cu.get('id') or cu.get('company_id'); print('customer', cid)
c, v = get(f'/api/customers/view/{cid}', [], wid); acct = v['data']['company'].get('customer_account_id'); print('account', acct)
c, u = get('/api/customer-account/list-unpaid-transaction', [('account_id', acct)], wid)
json.dump(u, open(f'{OUT}/cm_{cname.replace(" ","_")}.json', 'w'), indent=1)
items = (u.get('data') or {}).get('collection', u.get('data')) if isinstance(u, dict) else u
for x in (items or []):
    if x.get('type') == 'credit' or 'CM' in str(x.get('formatted_invoice_number')):
        print({k: x.get(k) for k in x if any(s in k for s in ('number', 'tax', 'total', 'amount', 'date', 'status', 'id'))})
