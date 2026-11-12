"""As tech (Admin) at Lethbridge: 4Refuel's payments on its LETHBRIDGE vendor account (read at that location), searched
for the three bills. GET parts-catalogue/vendor/payment/list-by-vendor-account (app/src/api/parts/index.ts:444-452)."""
import json, subprocess, os
H = os.path.dirname(os.path.abspath(__file__)); CK = open('/tmp/staging-tech/cookie-header.txt').read().strip()
def req(path, method='GET', body=None):
    a = ['curl', '-g', '-s', '-m', '120', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Content-Type: application/json', '-H', 'Origin: https://app.staging.shopview.com']
    if method == 'POST': a += ['-X', 'POST', '-d', json.dumps(body)]
    o = subprocess.run(a + ['-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1); return c, (json.loads(t) if t.strip().startswith('{') else t)
W = {'heavy-duty': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'), 'lethbridge': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton')}
BILLS = {'E2E-Pitcq2q', 'E2E-P8197vr', 'E2E-INV-1794217548388'}; out = {'hits': []}
try:
    print('switch lethbridge', req('iam/change-location', 'POST', {'workplace_id': W['lethbridge'][0], 'workplace_timezone': W['lethbridge'][1]})[0])
    acc = req('parts-catalogue/vendor/4acb542f-0f2d-45b8-bbd4-afb70fd22fb8')[1]['data']['vendor']['vendor_account_id']; out['account'] = acc; n, p = 0, 1
    while True:
        c, b = req(f'parts-catalogue/vendor/payment/list-by-vendor-account?accountId={acc}&pagination[page]={p}&pagination[rowsPerPage]=100')
        col = b['data']['collection']; n += len(col)
        for pay in col:
            for st in pay.get('payment_statements', []):
                if st.get('invoice_number') in BILLS:
                    out['hits'].append({'invoice': st['invoice_number'], 'statement_amount': st.get('amount'), 'statement_status': st.get('payment_statement_status'),
                                        **{k: pay.get(k) for k in ('payment_date', 'reference_number', 'description', 'payment_method', 'amount', 'payment_status')}})
        if len(col) < 100 or p > 40: break
        p += 1
    out['payments_read'] = n
finally:
    print('switch back', req('iam/change-location', 'POST', {'workplace_id': W['heavy-duty'][0], 'workplace_timezone': W['heavy-duty'][1]})[0])
json.dump(out, open(os.path.join(H, 'payments-lethbridge.json'), 'w'), indent=1); print(json.dumps(out, indent=1)[:2500])
