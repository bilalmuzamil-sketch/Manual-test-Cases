#!/usr/bin/env python3
"""Fetch the RENDERED documents the 119 cases are about, as evidence.

The app renders each document through its own endpoint (observed from the app's own traffic,
not guessed):
    GET /api/invoices/preview?invoice_id=<id>&type=html&isEstimate=<0|1>&includeDeclined=<0|1>
So the document a tester reads can be captured exactly, per document type, and every label the
cases name can be checked against it.

Captures, per document: the raw HTML (evidence), the visible text, and every data-test-id.
Read-only. No app state is changed.
"""
import json, urllib.request, urllib.error, re, os, html, sys, datetime

H = {'Cookie': open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip(), 'Accept': '*/*'}
API = 'https://sv8218api.qa.shopview.com'
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
DOCS = f'{DIR}/documents'
os.makedirs(DOCS, exist_ok=True)


def get(path, raw=False):
    try:
        r = urllib.request.Request(API + path, headers=H)
        with urllib.request.urlopen(r, timeout=90) as x:
            b = x.read()
            return x.status, (b if raw else json.loads(b.decode()))
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:
        return 0, str(e)[:100]


def rows(o):
    if isinstance(o, list) and o and isinstance(o[0], dict):
        return o
    if isinstance(o, dict):
        for v in o.values():
            r = rows(v)
            if r:
                return r
    return None


def visible(hstr):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', hstr, flags=re.S | re.I)
    t = re.sub(r'<[^>]+>', '\n', t)
    t = html.unescape(t)
    return '\n'.join(l.strip() for l in t.split('\n') if l.strip())


def testids(hstr):
    return sorted(set(re.findall(r'data-test-id="([^"]+)"', hstr)))


# ---- find one work order per document state the preconditions need ----
st, d = get('/api/work-orders?limit=200')
ws = rows(d) or []
by_status = {}
for w in ws:
    by_status.setdefault(str(w.get('status')).lower(), []).append(w)
print('work-order states available:', {k: len(v) for k, v in by_status.items()})

targets = []
for state in ('paid', 'approved', 'estimate'):
    for w in by_status.get(state, [])[:2]:
        targets.append((state, w))

manifest = {'read_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'documents': []}
for state, w in targets:
    wid = w['id']
    # the invoice id lives at data.work_order.invoice_id on the WORK ORDER view -- found by
    # reading the app's own payload, after /api/invoices/{woId}/view returned 400 (it wants an
    # INVOICE id, not a work-order id).
    sw, wv = get(f'/api/work-orders/view/{wid}')
    inv_id, created, inv_status = None, None, None
    if sw == 200 and isinstance(wv, dict):
        wow = (wv.get('data') or {}).get('work_order') or {}
        inv_id = wow.get('invoice_id')
        created = wow.get('is_invoice_created')
        inv_status = wow.get('invoice_status')
    if not inv_id:
        print(f"  {state} {w.get('number')}: no invoice_id on the work order "
              f"(view HTTP {sw}, is_invoice_created={created}) -- no document exists to capture")
        continue
    for kind, is_est, incl in (('invoice', 0, 0), ('estimate', 1, 0), ('invoice-with-declined', 0, 1)):
        q = (f'/api/invoices/preview?invoice_id={inv_id}&type=html'
             f'&isEstimate={is_est}&includeDeclined={incl}&historyEvent=')
        sc, body = get(q, raw=True)
        if sc != 200 or not isinstance(body, (bytes, bytearray)):
            print(f"  {state}/{kind}: HTTP {sc} — not captured")
            continue
        hs = body.decode('utf-8', 'replace')
        base = f'{state}-{kind}-{w.get("number")}'
        open(f'{DOCS}/{base}.html', 'w', encoding='utf-8').write(hs)
        vis = visible(hs)
        open(f'{DOCS}/{base}.txt', 'w', encoding='utf-8').write(vis)
        tids = testids(hs)
        manifest['documents'].append({
            'wo_number': w.get('number'), 'wo_status': state, 'wo_id': wid,
            'invoice_id': inv_id, 'invoice_status': inv_status, 'kind': kind, 'query': q,
            'html_bytes': len(body), 'visible_chars': len(vis),
            'test_ids': tids, 'file': f'{base}.html', 'text_file': f'{base}.txt',
        })
        print(f"  {state}/{kind:<22} {w.get('number'):<12} {len(body):>7}B  "
              f"visible {len(vis):>6} chars  test-ids {len(tids)}")

json.dump(manifest, open(f'{DIR}/documents-manifest.json', 'w'), indent=1)
print(f"\ncaptured {len(manifest['documents'])} documents -> {DOCS}/")
if manifest['documents']:
    allids = sorted({t for d0 in manifest['documents'] for t in d0['test_ids']})
    json.dump(allids, open(f'{DIR}/document-test-ids.json', 'w'), indent=1)
    print(f"distinct document test-ids across all captures: {len(allids)}")
    print('sample:', allids[:25])
