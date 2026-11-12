"""Read-only: vendor-invoice list rows (payment badge) for the three 4Refuel bills and the control, plus the vendor's
payments without a sort, as tech (Admin) at Staging Lethbridge - 4310. GET inventory/deliveries?search=
(app/src/api/parts/index.ts:351-354, Deliveries.vue:289-294). Location restored after."""
import json
from read_4refuel_at_lethbridge import call, LETH, HOME
NUMS = ['E2E-Pitcq2q', 'E2E-P8197vr', 'E2E-INV-1794217548388', 'E2E-INV-1791977645410']; ACC = '80aa8bc9-1f67-4ed9-a798-ce501b6d7dd9'
out = {}
print('switch to Lethbridge', call('iam/change-location', 'POST', {'workplace_id': LETH[0], 'workplace_timezone': LETH[1]})[0])
try:
    for n in NUMS:
        s, b = call(f'inventory/deliveries?search={n}&pagination[page]=1&pagination[rowsPerPage]=10')
        rows = ((b.get('data') or {}).get('collection') if isinstance(b, dict) else None) or b
        out[n] = rows; print(n, s, json.dumps(rows)[:700])
    s, b = call(f'parts-catalogue/vendor/payment/list-by-vendor-account?accountId={ACC}&pagination[page]=1&pagination[rowsPerPage]=100')
    c = b['data']['collection'] if isinstance(b, dict) and 'data' in b else b
    print('payments (no sort):', s, len(c) if isinstance(c, list) else c)
    out['payments_no_sort'] = c
finally:
    print('switch back to Heavy Duty', call('iam/change-location', 'POST', {'workplace_id': HOME[0], 'workplace_timezone': HOME[1]})[0])
json.dump(out, open('../4refuel-list-at-lethbridge.json', 'w'), indent=1)
