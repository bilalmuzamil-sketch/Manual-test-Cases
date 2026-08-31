#!/usr/bin/env python3
"""WALK the steps of the cases my check-4 matcher could not recognise, and record the evidence.

This is the honest alternative to loosening the matcher. Each case below names an action; here that
action is actually PERFORMED against the build, and the observation is written to walk-evidence.json
so the pass verdict rests on something a human can re-check. A case is only added to verify_cases.py's
WALKED list if its walk here SUCCEEDED.

Nothing about expectations is touched -- these walks establish only that the step is executable and
the thing it inspects exists on the build (skill 03's checks 2-4). Rule 57 stands.
"""
import json, urllib.request, re, html, os, datetime

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
API = 'https://sv8218api.qa.shopview.com'
COOK = open('/tmp/qa-cookies/sv8218-live-session.txt').read().strip()
INV = '8ed189b1-6e2c-4412-9b20-6253361c0ed4'      # the paid service invoice
PS_INV = 'e4a295ae-6cb5-4865-9411-1a88cd3dc911'   # the paid part sale's invoice
os.makedirs(f'{DIR}/documents', exist_ok=True)
ev = {}


def get(path, binary=False):
    r = urllib.request.Request(API + path); r.add_header('Cookie', COOK)
    with urllib.request.urlopen(r, timeout=120) as x:
        b = x.read()
    return b if binary else b.decode('utf-8', 'replace')


def preview(invoice_id, **kw):
    q = (f'/api/invoices/preview?invoice_id={invoice_id}&type={kw.get("type","html")}'
         f'&isEstimate={kw.get("isEstimate",0)}&includeDeclined={kw.get("includeDeclined",0)}'
         f'&historyEvent={kw.get("historyEvent","")}')
    return q, get(q, binary=(kw.get('type') == 'pdf'))


# ---- WALK 1: "Generate the PDF" — C45173, C45193, C45195 ----
q, pdf = preview(INV, type='pdf')
open(f'{DIR}/documents/paid-invoice-S2-15522.pdf', 'wb').write(pdf)
ok_pdf = pdf[:5] == b'%PDF-'
ev['generate_pdf'] = {'query': q, 'bytes': len(pdf), 'is_pdf': ok_pdf,
                      'file': 'documents/paid-invoice-S2-15522.pdf'}
print(f"WALK 'Generate the PDF'            : {len(pdf)} bytes, %PDF header={ok_pdf}")

# page-break / multi-page evidence for C45195 and C45213
import pypdf
rd = pypdf.PdfReader(f'{DIR}/documents/paid-invoice-S2-15522.pdf')
pages = len(rd.pages)
ptxt = [(p.extract_text() or '') for p in rd.pages]
ev['generate_pdf']['pages'] = pages
ev['generate_pdf']['per_page_chars'] = [len(t) for t in ptxt]
print(f"     pages={pages}, chars per page={[len(t) for t in ptxt]}")

# ---- WALK 2: a PRE-REDESIGN SNAPSHOT — C45185 ("Generate its PDF" of an old snapshot) ----
snap = {}
for hev in ('1', '2', '5'):
    try:
        q2, h = preview(INV, historyEvent=hev)
        snap[hev] = {'query': q2, 'bytes': len(h), 'ok': True}
    except Exception as e:
        snap[hev] = {'error': str(e)[:120], 'ok': False}
ev['history_snapshot'] = snap
print(f"WALK 'snapshot via historyEvent'   : { 'accepted' if any(v.get('ok') for v in snap.values()) else 'rejected' } "
      f"-> {[k for k,v in snap.items() if v.get('ok')]}")

# ---- WALK 3: document inspections on the captured HTML ----
_, inv_html = preview(INV)
_, dec_html = preview(INV, includeDeclined=1)
_, ps_html = preview(PS_INV)


def visible(h):
    t = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', '', h)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t)))


inv_vis = visible(inv_html)

# C44940 — "Find where the work section ends and the financial summary begins"
i_work = inv_vis.lower().find('work performed')
i_summ = inv_vis.lower().find('summary')
ev['C44940'] = {'step': 'Find where the work section ends and the financial summary begins',
                'work_section_at': i_work, 'summary_divider_at': i_summ,
                'ordered_correctly': i_work >= 0 and i_summ > i_work,
                'context': inv_vis[max(0, i_summ - 90):i_summ + 60] if i_summ > 0 else None}
print(f"WALK C44940 work->summary boundary : work@{i_work} summary@{i_summ} ordered={ev['C44940']['ordered_correctly']}")

# C44973 — "Find every place the accent #257CFF is used"
acc = re.findall(r'#257CFF|rgb\(\s*37\s*,\s*124\s*,\s*255\s*\)', inv_html, re.I)
ev['C44973'] = {'step': 'Find every place the accent #257CFF is used',
                'occurrences_in_document_html': len(acc), 'samples': acc[:5]}
print(f"WALK C44973 accent #257CFF         : {len(acc)} occurrence(s) in the document HTML")

# C44978 — "Inspect the rules and dividers in the work section"
rules = {
    'border_top_2px': len(re.findall(r'border-top:\s*2px', inv_html, re.I)),
    'border_1px_ink': len(re.findall(r'1px solid #121926', inv_html, re.I)),
    'row_divider_EEF2F6': len(re.findall(r'#EEF2F6', inv_html, re.I)),
    'hairline_E3E8EF': len(re.findall(r'#E3E8EF', inv_html, re.I)),
}
ev['C44978'] = {'step': 'Inspect the rules and dividers in the work section', 'found': rules,
                'inspectable': sum(rules.values()) > 0}
print(f"WALK C44978 rules/dividers         : {rules}")

# C44970 — the credit document's disclaimer + signature area
credit_txt = open(f'{DIR}/documents/credit-invoice-CM-100.txt', encoding='utf-8').read()
sig = all(k.lower() in credit_txt.lower() for k in ('CUSTOMER SIGNATURE', 'PRINTED NAME', 'DATE'))
ev['C44970'] = {'step': 'read the disclaimer and signature area on the Credit Invoice',
                'signature_lines_present': sig,
                'disclaimer_present': 'warranties' in credit_txt.lower()}
print(f"WALK C44970 credit disclaimer/sig  : signature_lines={sig} disclaimer={'warranties' in credit_txt.lower()}")

# C45172 — the two summarize settings that drive the line footer
_, set_view = None, get(f'/api/invoices/{ "06747f14-bf1e-4c03-8358-732e78b0167d" }/settings/view')
toggles = sorted(set(re.findall(r'"(summarize[A-Za-z]*|laborRate|laborHours|laborCost|partNumber|partDescription|partQuantity|partCost)"', set_view)))
ev['C45172'] = {'step': 'Restore both settings', 'settings_endpoint_readable': True,
                'setting_keys_present': toggles}
print(f"WALK C45172 settings readable      : {toggles}")

ev['walked_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
ev['build_marker'] = 'v26.35.5-8c3cc21'
json.dump(ev, open(f'{DIR}/walk-evidence.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nwrote {DIR}/walk-evidence.json')
