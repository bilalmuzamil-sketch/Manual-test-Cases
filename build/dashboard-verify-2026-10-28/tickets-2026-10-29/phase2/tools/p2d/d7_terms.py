"""D7 — Customer Invoice export Terms vs the invoice's own credit term (live invoice record + customer card). TZ=Asia/Karachi python3 d7_terms.py"""
import json, csv, io, collections
from common import *
w = WID['hd']; assert os.environ.get('TZ') == TZ[w]; print('change-location', loc(w)); out = {'zones': zones(w)}
s, j = get('/api/reporting/export/customer_invoice', [('report', 'customer_invoice'), ('range', 'last_month')], w)
d = j.get('data'); txt = d[0] if isinstance(d, list) and d else ''
open(f'{RAW}/d7_customer_invoice_last_month.csv', 'w').write(txt)
rows = list(csv.DictReader(io.StringIO(txt))); out['status'] = s; out['rows'] = len(rows); out['cols'] = list(rows[0].keys()) if rows else []
first = {}
for r in rows: first.setdefault(r['InvoiceNo'], r)
out['invoices'] = len(first)
# index the cached invoice records by number to get ids, then re-read the suspects LIVE
idx = {}
import glob
for f in glob.glob('/tmp/cln/dv/inv/*.json'):
    try: c = json.load(open(f))['body']['data']['collection']
    except Exception: continue
    idx[c.get('display_number')] = c.get('id')
bad = []
for no, r in first.items():
    iid = idx.get(no)
    if not iid: continue
    cf = json.load(open(f'/tmp/cln/dv/inv/{iid}.json'))['body']['data']['collection']
    if (cf.get('credit_terms') or '') != (r.get('Terms') or ''):
        bad.append((no, iid, r.get('Terms'), r.get('InvoiceDate'), r.get('DueDate')))
out['cached_mismatch'] = len(bad); live = []
for no, iid, terms, idate, ddate in bad:
    s, iv = get(f'/api/invoices/{iid}/view', None, w); c = (iv.get('data') or {}).get('collection', {})
    comp = (c.get('work_order') or {}).get('company_id'); cust = c.get('customer_name') or (c.get('work_order') or {}).get('company_name')
    sc, cv = get(f'/api/customers/view/{comp}', None, w) if comp else (0, {})
    cc = (cv.get('data') or {}).get('company') or {}
    live.append({'no': no, 'export_terms': terms, 'export_invoice_date': idate, 'export_due_date': ddate, 'invoice_terms_live': c.get('credit_terms'),
                 'invoice_due_live': c.get('due_date'), 'invoice_date_live': c.get('invoice_date') or c.get('created_at'), 'customer': cust,
                 'customer_card_terms': cc.get('credit_term') or cc.get('credit_terms') or (cc.get('credit_term_label')), 'customer_keys_with_term': [k for k in cc if 'term' in k.lower()]})
out['live'] = live
print(json.dumps(out, indent=1, default=str)[:5000])
json.dump(out, open(f'{RAW}/d7_out.json', 'w'), default=str)
