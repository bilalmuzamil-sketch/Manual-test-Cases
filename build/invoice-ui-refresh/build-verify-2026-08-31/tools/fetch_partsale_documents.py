#!/usr/bin/env python3
"""Fetch the PARTS SALE documents and register them in the corpus.

THE KEY FACT, found 2026-08-31: A PART SALE IS A WORK ORDER.
    GET /api/part-sales/{id}/pdf                 -> 404
    GET /api/part-sales/view/{id}                -> 404
    GET /api/work-orders/view/{partSaleId}       -> 200   <-- this one
and the paid part sale's payload carries `invoice_id`, which the ordinary document route accepts:
    GET /api/invoices/preview?invoice_id=<id>&type=html&isEstimate=0|1&includeDeclined=0&historyEvent=

The clue was in the credit memo payload: origin_invoices[0].work_order_type == 'service' implies
other work_order_type values exist. I had reported 9 cases blocked on "no parts-sale document"
without ever trying the part-sale id on the work-order route.

isEstimate=1 yields the Parts Sale ESTIMATE ("Estimate: EST-P2-123", "Estimated Total"),
isEstimate=0 the Parts Sale INVOICE ("Invoice: INV-P2-123"). Both carry a flat Parts section
instead of numbered jobs, exactly as Story 13 describes.
"""
import json, urllib.request, re, html, datetime, os

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
API = 'https://sv8218api.qa.shopview.com'
COOK = open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip()


def get(p):
    r = urllib.request.Request(API + p); r.add_header('Cookie', COOK)
    with urllib.request.urlopen(r, timeout=90) as x:
        return x.read().decode('utf-8', 'replace')


def rows(o):
    if isinstance(o, list) and o and isinstance(o[0], dict): return o
    if isinstance(o, dict):
        for v in o.values():
            r = rows(v)
            if r: return r
    return None


def visible(h):
    t = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', '', h)
    t = html.unescape(re.sub(r'<[^>]+>', '\n', t))
    return re.sub(r'\n\s*\n+', '\n', t).strip()


ps = rows(json.loads(get('/api/part-sales?limit=200'))) or []
print(f'part sales listed: {len(ps)}')
man = json.load(open(f'{DIR}/documents-manifest.json'))
have = {d.get('file') for d in man['documents']}
added = 0
for sale in ps:
    v = get(f"/api/work-orders/view/{sale['id']}")
    m = re.search(r'"invoice_id"\s*:\s*"([0-9a-f-]{8,})"', v)
    if not m:
        continue                      # only an invoiced part sale has a document
    inv = m.group(1)
    for is_est, kind in ((0, 'parts-sale'), (1, 'parts-sale-estimate')):
        q = (f'/api/invoices/preview?invoice_id={inv}&type=html&isEstimate={is_est}'
             f'&includeDeclined=0&historyEvent=')
        h = get(q)
        txt = visible(h)
        base = f"{kind}-{sale['number']}"
        open(f'{DIR}/documents/{base}.html', 'w').write(h)
        open(f'{DIR}/documents/{base}.txt', 'w').write(txt)
        ids = sorted(set(re.findall(r'data-test-id="([^"]+)"', h)))
        rec = {'wo_number': sale['number'], 'wo_status': sale.get('status'), 'wo_id': sale['id'],
               'invoice_id': inv, 'invoice_status': sale.get('status'), 'kind': kind, 'query': q,
               'html_bytes': len(h), 'visible_chars': len(txt), 'test_ids': ids,
               'file': f'{base}.html', 'text_file': f'{base}.txt'}
        if rec['file'] not in have:
            man['documents'].append(rec); added += 1
        print(f"  {kind:<22} {sale['number']:<12} {sale.get('status'):<10} {len(txt):>5} chars  {len(ids)} test-ids")
    break                             # one invoiced part sale is enough for the label corpus

man['read_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
json.dump(man, open(f'{DIR}/documents-manifest.json', 'w'), indent=1, ensure_ascii=False)
print(f"\nadded {added} document(s); kinds now: {sorted({d['kind'] for d in man['documents']})}")
