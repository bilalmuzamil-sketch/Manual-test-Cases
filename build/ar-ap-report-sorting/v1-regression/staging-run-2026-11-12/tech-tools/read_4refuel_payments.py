"""Read-only: find the payments that closed the three 4Refuel bills, as tech (Admin) at Staging Lethbridge - 4310.
GET parts-catalogue/vendor/payment/list-by-vendor-account (app/src/api/parts/index.ts:444-452). Location restored."""
import json
from read_4refuel_at_lethbridge import call, LETH, HOME  # noqa: importing runs nothing heavy? (guarded below)
W = {'E2E-Pitcq2q', 'E2E-P8197vr', 'E2E-INV-1794217548388'}; ACC = '80aa8bc9-1f67-4ed9-a798-ce501b6d7dd9'
s, b = call('iam/change-location', 'POST', {'workplace_id': LETH[0], 'workplace_timezone': LETH[1]}); print('switch to Lethbridge', s)
hits, n, p = [], 0, 1
try:
    while True:
        s, b = call(f'parts-catalogue/vendor/payment/list-by-vendor-account?accountId={ACC}&pagination[page]={p}&pagination[rowsPerPage]=100&pagination[sortBy]=payment_date&pagination[descending]=true')
        c = b['data']['collection']; n += len(c)
        for pay in c:
            for st in pay['payment_statements']:
                if st['invoice_number'] in W:
                    hits.append({k: pay.get(k) for k in ('id', 'payment_date', 'reference_number', 'description', 'payment_method', 'amount', 'payment_status')} | {'invoice': st['invoice_number'], 'statement_amount': st['amount'], 'statement_status': st['payment_statement_status']})
        if len(c) < 100 or p > 40: break
        p += 1
finally:
    s, b = call('iam/change-location', 'POST', {'workplace_id': HOME[0], 'workplace_timezone': HOME[1]}); print('switch back to Heavy Duty', s)
print('payments read', n); print(json.dumps(hits, indent=1))
json.dump({'payments_read_at_lethbridge': n, 'hits': hits}, open('../4refuel-payments.json', 'w'), indent=1)
