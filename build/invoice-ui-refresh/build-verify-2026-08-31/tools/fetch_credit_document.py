#!/usr/bin/env python3
"""Fetch the CREDIT INVOICE document and register it in the corpus.

THE ROUTE, supplied by the QA lead from the product source on 2026-08-31:
    GET /api/credit-memos/{creditMemoId}/pdf        (route name credit_memos_pdf, ROLE_INVOICE_VIEW)
    -> inline application/pdf as credit-memo.pdf
    -> CreditMemoPdfDataProvider -> PartSaleCreditPdfGenerator
       -> api/templates/invoices/credit-invoice.html.twig  (<title> is literally "Credit Invoice")

The {creditMemoId} is the `id` field of the credit ROW from
    GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>
-- NOT the CM-number, not the origin invoice id. My 13 guessed route shapes 404'd because the
handler does findOrgScopedById() and throws NotFoundHttpException on a miss, so a wrong id and a
wrong route are indistinguishable from the outside.

The code answered WHERE the document lives -- navigation and mechanics. It supplies no expectation:
Rule 57 (documents establish intent, code establishes fact only) and Rule 96 are untouched.

Only PDF is served (type=html / format=html / html=1 all still return %PDF-), so the text is
extracted with pypdf. Note pypdf's extraction inserts kerning artefacts ("T ax", "T erritory") --
handled in the matcher, never by editing the captured text.
"""
import json, urllib.request, os, datetime, re
import pypdf

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
API = 'https://sv8218api.qa.shopview.com'
COOK = open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip()
ACC = '37b48175-14be-4049-9058-bf357e93f665'      # data.company.customer_account_id


def get(path, binary=False):
    r = urllib.request.Request(API + path)
    r.add_header('Cookie', COOK)
    with urllib.request.urlopen(r, timeout=90) as x:
        b = x.read()
    return b if binary else json.loads(b.decode())


def rows(o):
    if isinstance(o, list) and o and isinstance(o[0], dict):
        return o
    if isinstance(o, dict):
        for v in o.values():
            r = rows(v)
            if r:
                return r
    return None


txns = rows(get(f'/api/customer-account/list-unpaid-transaction?account_id={ACC}')) or []
credits = [t for t in txns if str(t.get('type')).lower() == 'credit']
print(f'credit rows on the account: {len(credits)}')
os.makedirs(f'{DIR}/documents', exist_ok=True)
man = json.load(open(f'{DIR}/documents-manifest.json'))
existing = {d.get('file') for d in man['documents']}
added = []
for c in credits:
    cid = c['id']
    pdf = get(f'/api/credit-memos/{cid}/pdf', binary=True)
    assert pdf[:5] == b'%PDF-', f'not a PDF for {cid}'
    num = (c.get('formatted_invoice_number') or c.get('invoice_number') or cid[:8]).replace('/', '-')
    pdf_name = f'credit-invoice-{num}.pdf'
    txt_name = f'credit-invoice-{num}.txt'
    open(f'{DIR}/documents/{pdf_name}', 'wb').write(pdf)
    open(f'{DIR}/documents/{txt_name}', 'w').write('/tmp/x')  # placeholder, overwritten below
    rd = pypdf.PdfReader(f'{DIR}/documents/{pdf_name}')
    text = '\n'.join((p.extract_text() or '') for p in rd.pages)
    open(f'{DIR}/documents/{txt_name}', 'w').write(text)
    rec = {
        'wo_number': c.get('origin_invoices', [{}])[0].get('invoice_number') if c.get('origin_invoices') else None,
        'wo_status': None, 'wo_id': None,
        'credit_memo_id': cid,
        'credit_number': num,
        'credit_status': c.get('status_label') or c.get('status'),
        'amount': c.get('amount'), 'balance': c.get('balance'),
        'kind': 'credit-invoice',
        'query': f'/api/credit-memos/{cid}/pdf',
        'pdf_bytes': len(pdf), 'pages': len(rd.pages), 'visible_chars': len(text),
        'test_ids': [], 'file': pdf_name, 'text_file': txt_name,
    }
    if pdf_name not in existing:
        man['documents'].append(rec)
        added.append(rec)
    print(f"  {num:<10} status={rec['credit_status']:<14} {len(pdf):>8} bytes  {len(text):>5} chars text")

man['read_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
json.dump(man, open(f'{DIR}/documents-manifest.json', 'w'), indent=1, ensure_ascii=False)
print(f'\ndocument kinds in the corpus now: {sorted({d["kind"] for d in man["documents"]})}')
print(f'added {len(added)} credit document(s)')
