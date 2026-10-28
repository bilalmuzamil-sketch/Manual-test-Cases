#!/usr/bin/env python3
"""W4 — A/R Print (PDF) vs the on-screen data for the same as-of date (SV-5028: "The same data and layout as
currently shown in the UI"; PDF contains name of report, organization, date). Downloads the three PDFs
as the Print button does, extracts text, and checks totals + as-of date + row counts."""
import sys, json, re, io
sys.modules['cryptography'] = None
import pypdf, subprocess
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import COOKIE, API
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
snap = sys.argv[1] if len(sys.argv) > 1 else 'hd_2026-09-30'
S = json.load(open(f'/tmp/cln/w4/ar/{snap}/summary.json')); A = S['asOf']
D = json.load(open(f'/tmp/cln/w4/ar/{snap}/detail.json'))['data']['buckets']
C = json.load(open(f'/tmp/cln/w4/ar/{snap}/collection.json'))['data']
money = lambda v: f'{v:,.2f}'
rows = []
for rep in ('summary', 'detail', 'collections'):
    fn = f'/tmp/cln/w4/pdf/{snap}-{rep}.pdf'
    r = subprocess.run(['curl', '-sS', '-4', '-o', fn, '-w', '%{http_code}', '-H', 'Cookie: ' + COOKIE, '-H', 'X-Location-ID: b3c8c820-f815-4cf1-8938-10956c5ee71a',
                        '-H', 'Origin: https://app.staging.shopview.com', API + '/api/reporting/account-receivable/pdf?' + urlencode([('report', rep), ('asOfDate', A)])], capture_output=True, text=True, timeout=300)
    try:
        txt = '\n'.join(p.extract_text() for p in pypdf.PdfReader(fn).pages)
    except Exception as e:
        rows.append({'report': rep, 'http': r.stdout, 'error': str(e)[:200]}); continue
    open(fn + '.txt', 'w').write(txt)
    if rep == 'summary':
        want = [money(S['data']['totals'][k]) for k in ('current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus', 'total')]
        ncust = len(S['data']['collection'])
    elif rep == 'detail':
        want = [money(D[b]['balance']) for b in ('current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus')] + [money(D['totalBalance']), money(D['totalAmount'])]
        ncust = sum(len(D[b]['transactions']) for b in ('current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus'))
    else:
        want = [money(C['totals']['totalAmount']), money(C['totals']['totalBalance'])]
        ncust = len(C['collection'])
    found = {w: (w in txt) for w in want}
    dates = sorted(set(re.findall(r'(?:As of|Date)[:\s]*([A-Z][a-z]{2} \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})', txt)))[:5]
    rows.append({'report': rep, 'http': r.stdout, 'pages': len(pypdf.PdfReader(fn).pages), 'totals_found': found, 'as_of_strings': dates,
                 'screen_rows': ncust, 'head': txt[:400]})
json.dump({'snapshot': snap, 'asOf': A, 'pdfs': rows}, open(f'{OUT}/results-ar-pdf-{snap}.json', 'w'), indent=1)
for x in rows: print(json.dumps(x)[:900])
