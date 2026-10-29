"""D1 — live customer account (Invoices tab data) and deposits for TestVT1 / Bravo. TZ=Asia/Karachi."""
import json
from common import *
w = WID['hd']; loc(w); out = {'zones': zones(w)}
for cid, acc, nos in (('1c385fee-d4cc-46f4-b20a-b8e01987e0ff', '17641732-f8c5-4315-895e-a3384b856b3c', ('P2-2352', 'P-2352')),
                      ('329d4f63-ce36-444a-893f-0a63e56b0038', 'ebb314e7-0db5-495d-8d45-06f78bfd070e', ('P2-2439', 'P-2439'))):
    s, j = get('/api/customer-account/list-unpaid-transaction', [('accountId', acc), ('pagination[page]', 1), ('pagination[rowsPerPage]', 500)], w)
    rows = (j.get('data') or {}).get('response', {}).get('collection', [])
    out[cid] = {'status': s, 'rows': [{k: v for k, v in r.items() if not isinstance(v, (list, dict))} for r in rows if any(n in json.dumps(r) for n in nos)]}
    s3, dep = get('/api/customer-deposits/list', [('accountId', acc)], w)
    out[cid]['deposits'] = [x for x in (json.dumps(dep)[:0] or []) ] if False else None
    json.dump(dep, open(f'{RAW}/d1_dep_{cid[:6]}.json', 'w'))
    dl = dep.get('data'); dl = dl.get('collection', dl) if isinstance(dl, dict) else dl
    out[cid]['deposits'] = [{k: v for k, v in x.items() if not isinstance(v, (list, dict))} for x in (dl or []) if any(n in json.dumps(x) for n in ('4763', '4801', 'P-2352', 'P-2439'))]
print(json.dumps(out, indent=1, default=str)[:5000])
json.dump(out, open(f'{RAW}/d1_ledger.json', 'w'), default=str)
