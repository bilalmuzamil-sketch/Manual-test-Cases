"""F3 side finding 1 (read-only): deposits on S1-38219 / S1-38221 (DVI Test, ZZAUTOTEST) - the server's deposit record and the WO's payments.
TZ=America/Toronto. Out evidence/f3/SIDE1/server.json"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
w = WID['dvi']; tz = TZ[w]; out = {'zones': zones(w), 'change_location': loc(w)}
def local(s):
    if not s: return None
    s2 = s.replace('Z', '+00:00').replace(' ', 'T')
    d = dt.datetime.fromisoformat(s2 if ('+' in s2[10:] or s2.endswith('+00:00')) else s2 + '+00:00')
    return d.astimezone(ZoneInfo(tz)).strftime('%Y-%m-%d %H:%M %Z')
for k, wo in (('S1-38219', '420b6744-19e3-482e-aa9c-a682484065cd'), ('S1-38221', '1cf29c7d-295e-4919-be7e-12e90806e534')):
    c, b = get(f'/api/work-orders/view/{wo}', [], w); d = b.get('data') or {}; x = d.get('work_order') or {}
    acc = (x.get('customer') or {}).get('customer_account_id') or x.get('customer_account_id')
    if not acc:
        cid = x.get('customer_id') or (x.get('customer') or {}).get('id')
        c2, v = get(f'/api/customers/view/{cid}', [], w); acc = ((v.get('data') or {}).get('company') or {}).get('customer_account_id')
    pays = d.get('customer_payments') or []
    c3, dep = get('/api/customer-deposits/list', [('accountId', acc)], w); dl = dep.get('data'); dl = dl.get('collection', dl) if isinstance(dl, dict) else dl
    out[k] = {'wo_status': c, 'account': acc, 'payments': [{kk: p.get(kk) for kk in p if any(s in kk for s in ('date', 'amount', 'deposit', 'created', 'number', 'status'))} for p in pays],
              'deposits': [{kk: v for kk, v in r.items() if not isinstance(v, (list, dict))} for r in (dl or [])]}
    for r in out[k]['deposits']:
        for kk in list(r):
            if any(s in kk.lower() for s in ('date', 'created', 'updated')) and isinstance(r[kk], str): r[kk + '__toronto'] = local(r[kk])
os.makedirs(f'{EV}/SIDE1', exist_ok=True); json.dump(out, open(f'{EV}/SIDE1/server.json', 'w'), indent=1, default=str)
print(json.dumps(out, default=str)[:4000])
