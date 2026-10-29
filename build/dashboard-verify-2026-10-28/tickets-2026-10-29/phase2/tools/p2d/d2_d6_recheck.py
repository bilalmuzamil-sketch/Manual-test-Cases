"""D2/D3 IBS, D4 Notes, D5/D6 QB Unexported — live server re-check, each location read with the session switched to it.
Run once per location with TZ=<location zone>:  TZ=America/Edmonton python3 d2_d6_recheck.py leth ;  TZ=Asia/Karachi python3 d2_d6_recheck.py hd"""
import json, sys, collections
from common import *
tag = sys.argv[1]; w = WID[tag]; assert os.environ.get('TZ') == TZ[w], 'TZ must equal the location zone'
print('change-location', loc(w)); out = {'zones': zones(w), 'location': NAME[w]}
r2 = lambda x: round(x + 0.0, 2)
# IBS
s1, t = get('/api/customers/ibs/list-transactions', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
s2, b = get('/api/customers/ibs/list-batches', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
json.dump({'t': t, 'b': b}, open(f'{RAW}/ibs_{tag}.json', 'w'))
rts = t['data']['response']['collection']
out['ready_zero'] = [{k: r.get(k) for k in ('invoice_display_number', 'customer_name', 'amount', 'balance', 'status', 'type', 'date')} for r in rts if abs(r.get('amount') or 0) < 0.005]
out['ready_count'] = len(rts)
out['batches'] = []
for bt in b['data']['response'] or []:
    ta = r2(sum(x['amount'] for x in bt['transactions']) + sum((x.get('amount') or 0) for x in bt.get('credits', [])))
    out['batches'].append({'id': bt['id'], 'date': bt.get('created_at') or bt.get('date'), 'amount': bt['amount'], 'balance': bt['balance'], 'status': bt['status'],
                           'n_inv': len(bt['transactions']), 'n_cr': len(bt.get('credits', [])), 'sum': ta,
                           'inv': [(x.get('invoice_display_number'), x['amount'], x.get('balance')) for x in bt['transactions']]})
# QB unexported, Customers tab
items, page = [], 1
while True:
    s, j = get('/api/bookkeeping/unexported-items', [('filters[0][field]', 'groupName'), ('filters[0][value]', 'customer'), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], w)
    c = j['data']['collection']; items += c
    if len(c) < 1000: break
    page += 1
json.dump(items, open(f'{RAW}/qb_{tag}.json', 'w'))
out['qb_rows'] = len(items); out['qb_types'] = dict(collections.Counter(i['type'] for i in items))
out['qb_blank_no_by_type'] = dict(collections.Counter(i['type'] for i in items if not i.get('number')))
dup = collections.defaultdict(list)
for i in items: dup[(i['type'], i.get('referenceId'))].append(i)
d2 = {k: v for k, v in dup.items() if len(v) > 1}
out['qb_dup_docs'] = len(d2); out['qb_dup_by_type'] = dict(collections.Counter(k[0] for k in d2))
out['qb_dup_samples'] = [[{kk: (vv[:90] if isinstance(vv, str) else vv) for kk, vv in x.items() if kk in ('type', 'number', 'customer', 'date', 'errorMessage', 'createdAt', 'updatedAt', 'amount')} for x in v] for v in list(d2.values())[:4]]
out['qb_blank_samples'] = [{kk: (vv[:90] if isinstance(vv, str) else vv) for kk, vv in x.items() if kk in ('type', 'number', 'customer', 'date', 'errorMessage', 'amount')} for x in items if not x.get('number')][:6]
out['qb_keys'] = sorted(items[0].keys()) if items else []
# Notes (org-wide list): total for All
s, j = get('/api/notes', [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
out['notes_all'] = {'status': s, 'returned': len((j.get('data') or {}).get('notes', [])), 'pagination': (j.get('data') or {}).get('pagination')}
print(json.dumps({k: v for k, v in out.items() if k not in ('qb_dup_samples',)}, indent=1, default=str)[:6000])
print(json.dumps(out['qb_dup_samples'], default=str)[:2500])
json.dump(out, open(f'{RAW}/recheck_{tag}.json', 'w'), default=str)
