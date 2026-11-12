"""Read-only: the three 4Refuel bills missing from A/P after the feature (C715472), read as tech@shopview.com
(Admin, own cookie jar) with the active location set to Staging Lethbridge - 4310, where they were created.
Endpoints from the front end (Rule 115): POST iam/change-location {workplace_id, workplace_timezone}
(app/src/api/auth/index.ts:62, AuthModel.ts:6), GET inventory/deliveries/{id}, GET parts-catalogue/vendor/
transactions/list-unpaid-by-vendor-account. Tech's location and role are restored after (Rule 26)."""
import json, urllib.request, subprocess, sys
API = 'https://api.staging.shopview.com/api/'; ORIGIN = 'https://app.staging.shopview.com'
LETH = ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton'); HOME = ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi')
BILLS = {'E2E-Pitcq2q': 'bbb1a05d-4af9-4950-aa85-c692feb136a4', 'E2E-P8197vr': '16f298e6-6fa3-4a5b-a16d-81e96c3c04db',
         'E2E-INV-1794217548388': 'd5d0abb2-de69-453e-a668-85e2d97fd6e4', 'CONTROL E2E-INV-1791977645410 (still listed)': '4cdaa082-5aec-4d25-a9b4-44e8eb0a1013'}
def call(path, method='GET', body=None):
    H = open('/tmp/staging-tech/cookie-header.txt').read().strip()
    r = urllib.request.Request(API + path, method=method, data=None if body is None else json.dumps(body).encode(),
        headers={'Cookie': H, 'Accept': 'application/json', 'Content-Type': 'application/json', 'Origin': ORIGIN})
    try:
        with urllib.request.urlopen(r, timeout=60) as x: return x.status, json.load(x)
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:300]
def main():
    out = {}
    s, b = call('iam/change-location', 'POST', {'workplace_id': LETH[0], 'workplace_timezone': LETH[1]}); print('switch to Lethbridge', s)
    try:
        for n, ref in BILLS.items():
            s, b = call(f'inventory/deliveries/{ref}'); d = (b.get('data') or {}).get('delivery') if isinstance(b, dict) else None
            out[n] = {'http': s, 'delivery': d if d else b}
            print(n, s, json.dumps({k: d.get(k) for k in ('invoice_number', 'invoice_date', 'date_received', 'deleted_at', 'status', 'total', 'workplace_id')} if d else b)[:400])
        s, b = call('parts-catalogue/vendor/4acb542f-0f2d-45b8-bbd4-afb70fd22fb8'); acc = b['data']['vendor']['vendor_account_id']
        rows, p = [], 1
        while True:
            s, b = call(f'parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={acc}&pagination[page]={p}&pagination[rowsPerPage]=100')
            c = b['data']['response']['collection']; rows += c
            if len(c) < 100: break
            p += 1
        nums = {r['invoice_number']: r for r in rows}
        print('unpaid at Lethbridge:', len(rows), {n: (n.split()[-3] if n.startswith('CONTROL') else n) in nums for n in BILLS})
        out['unpaid_rows_at_lethbridge'] = len(rows); out['in_unpaid'] = {n: nums.get(n.split()[1] if n.startswith('CONTROL') else n) for n in BILLS}
    finally:
        s, b = call('iam/change-location', 'POST', {'workplace_id': HOME[0], 'workplace_timezone': HOME[1]}); print('switch back to Heavy Duty', s)
    json.dump(out, open('../4refuel-read-at-lethbridge.json', 'w'), indent=1, default=str)
if __name__ == '__main__':
    main()
