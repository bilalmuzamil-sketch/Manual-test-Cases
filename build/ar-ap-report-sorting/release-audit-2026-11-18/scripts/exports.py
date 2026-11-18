"""Release audit 18 Nov: download the aging exports exactly as the screen asks for them
(GET reporting/reports/{slug}/export, params from app/src/api/reporting ReportingModel.ts AgingScopeParams + format + pagination).
Read-only. Cookie from /tmp/staging only. Saves each file + a manifest with HTTP status, content type, size, and any message."""
import json, subprocess, sys, urllib.parse, os
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CK = open('/tmp/staging/cookie-header.txt').read().strip()
AS, Z = '2026-11-18', 'Asia/Karachi'
OPEN = {'ar-aging-summary': 'customer_name', 'ap-aging-summary': 'vendor_name', 'ar-aging-detail': 'customer_name', 'ap-aging-detail': 'vendor_name', 'ar-aging-collection': 'date', 'ap-unpaid-invoices': 'date'}
FOUR, LONG, COVINA, WILL = '6a7b6afc-084d-4584-aacb-773bcd71cbcd', '70ccb9ae-a766-4572-a083-3fcf2a718a15', '8ee34c14-ec5b-4298-8de2-75b682647dff', '851a7b1a-a47d-4e2e-8eb9-0db8525a64a1'
LETH = 'f8a8b802-7780-4b16-bf10-343caeb616b2'
JOBS = []
for slug in OPEN:   # every report, untouched, both formats
    JOBS += [(f'{slug}-all.csv', slug, 'csv', {}), (f'{slug}-all.pdf', slug, 'pdf', {})]
JOBS += [
    ('ar-aging-detail-2cust.pdf', 'ar-aging-detail', 'pdf', {'customers': f'{FOUR},{LONG}'}),
    ('ar-aging-collection-2cust.pdf', 'ar-aging-collection', 'pdf', {'customers': f'{FOUR},{LONG}'}),
    ('ar-aging-collection-2cust.csv', 'ar-aging-collection', 'csv', {'customers': f'{FOUR},{LONG}'}),
    ('ar-aging-summary-longname.pdf', 'ar-aging-summary', 'pdf', {'customers': LONG}),
    ('ap-aging-detail-2vend.pdf', 'ap-aging-detail', 'pdf', {'vendors': f'{COVINA},{WILL}'}),
    ('ap-unpaid-invoices-2vend.pdf', 'ap-unpaid-invoices', 'pdf', {'vendors': f'{COVINA},{WILL}'}),
    ('ap-aging-detail-lethbridge-31-60.csv', 'ap-aging-detail', 'csv', {'locations': LETH, 'pastDue': '31-60,91-plus'}),
    ('ar-aging-detail-lethbridge.csv', 'ar-aging-detail', 'csv', {'locations': LETH}),
]
man = []
for name, slug, fmt, extra in JOBS:
    q = {'asOfDate': AS, 'timezone': Z, 'format': fmt, 'pagination[sortBy]': OPEN[slug], 'pagination[descending]': 'false', 'pagination[page]': '1', 'pagination[rowsPerPage]': '30', **extra}
    url = f'https://api.staging.shopview.com/api/reporting/reports/{slug}/export?' + urllib.parse.urlencode(q)
    path = os.path.join(OUT, name)
    o = subprocess.run(['curl', '-g', '-s', '-m', '300', '-o', path, '-D', path + '.hdr', '-w', '%{http_code} %{content_type} %{size_download} %{time_total}',
                        '-H', 'Cookie: ' + CK, '-H', 'Accept: */*', '-H', 'Origin: https://app.staging.shopview.com', url], capture_output=True, text=True).stdout.split()
    rec = {'file': name, 'slug': slug, 'format': fmt, 'filters': extra, 'http': o[0], 'type': o[1] if len(o) > 3 else '', 'bytes': o[-2], 'seconds': o[-1]}
    if not o[0].startswith('2') or 'json' in rec['type']:
        try: rec['body'] = open(path).read()[:400]
        except Exception: rec['body'] = '(binary)'
    os.remove(path + '.hdr'); man.append(rec); print(json.dumps(rec)[:330])
json.dump(man, open(os.path.join(OUT, 'MANIFEST.json'), 'w'), indent=1)
