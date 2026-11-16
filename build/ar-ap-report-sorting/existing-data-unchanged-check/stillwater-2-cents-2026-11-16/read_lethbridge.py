"""Stillwater Diesel Repair, bill 055-541861 (Staging Lethbridge - 4310): what the APP itself holds, read at the session's
active location (Lethbridge; the bill's delivery opens there, the Heavy Duty one answers 400). Read-only GETs; endpoints
from app/src/api/parts/index.ts (vendor, list-unpaid-by-vendor-account, payment/list-by-vendor-account) - the same ones
../4refuel-consistency-2026-11-12/ used. Cookie from /tmp only."""
import json, subprocess, datetime
CK = open('/tmp/staging/cookie-header.txt').read().strip(); VENDOR = '086df5dc-5dfb-4627-bfbe-f7efafaffcc9'; BILLS = {'055-541861', '069-855902'}
def get(path):
    o = subprocess.run(['curl', '-g', '-s', '-m', '120', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                        '-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1); return c, (json.loads(t) if t.strip().startswith('{') else t)
out = {'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}
c, v = get(f'parts-catalogue/vendor/{VENDOR}'); acc = v['data']['vendor']['vendor_account_id']; out['account_at_active_location'] = acc
rows, p = [], 1
while True:
    c, d = get(f'parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={acc}&pagination[page]={p}&pagination[rowsPerPage]=100')
    col = d['data']['response']['collection']; rows += col
    if len(col) < 100: break
    p += 1
out['unpaid_total_rows'] = len(rows); out['unpaid_hits'] = [r for r in rows if r.get('invoice_number') in BILLS]
pays, p = [], 1
while True:
    c, d = get(f'parts-catalogue/vendor/payment/list-by-vendor-account?accountId={acc}&pagination[page]={p}&pagination[rowsPerPage]=100')
    col = d['data']['collection']; pays += col
    if len(col) < 100 or p > 40: break
    p += 1
out['payments_read'] = len(pays)
out['payment_hits'] = [dict({k: pay.get(k) for k in ('payment_date', 'reference_number', 'description', 'payment_method', 'amount', 'payment_status', 'created_at', 'updated_at')}, statement=st)
                       for pay in pays for st in pay.get('payment_statements', []) if st.get('invoice_number') in BILLS]
json.dump(out, open('lethbridge-app-view.json', 'w'), indent=1); print(json.dumps(out, indent=1)[:3500])
