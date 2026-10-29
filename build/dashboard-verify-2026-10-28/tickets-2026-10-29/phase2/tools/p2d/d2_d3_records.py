"""D2 export file of the Lethbridge 2 Oct batch (TZ=America/Edmonton) and D3 invoice record of S2-16924 (TZ=Asia/Karachi). Usage: python3 d2_d3_records.py leth|hd"""
import json, sys, base64
from common import *
tag = sys.argv[1]; w = WID[tag]; assert os.environ.get('TZ') == TZ[w]; loc(w); print(zones(w))
d = json.load(open(f'{RAW}/ibs_{tag}.json'))
if tag == 'leth':
    s, ex = get('/api/customers/ibs/batch-export/7af04085-eff9-4e3b-bd0c-88559223b3d5', None, w)
    data = ex.get('data'); data = data.get('data', data) if isinstance(data, dict) else data
    txt = data if isinstance(data, str) else json.dumps(data)
    try:
        t2 = base64.b64decode(txt).decode(); txt = t2
    except Exception: pass
    print(s, txt[:900])
else:
    r = [x for x in d['t']['data']['response']['collection'] if x.get('invoice_display_number') == 'S2-16924'][0]
    s, iv = get(f"/api/invoices/{r['reference_id']}/view", None, w); c = iv['data']['collection']
    print({k: c.get(k) for k in ('display_number', 'status', 'total_balance', 'paid_balance', 'balance', 'credit_terms', 'due_date')})
    print('lines/total keys', [k for k in c if 'total' in k])
