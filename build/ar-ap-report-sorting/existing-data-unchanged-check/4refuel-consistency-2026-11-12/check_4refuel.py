"""Rule 120 measurement for the three 4Refuel bills (C715472): does the NEW A/P Aging Detail list exactly the bills the
app itself still counts as unpaid for vendor 4Refuel? Part 'report': every A/P Aging Detail document (new data call,
org-wide, as of today) for 4Refuel. Part 'unpaid <label>': the vendor's own unpaid-bills list (GET
parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account, app/src/api/parts/index.ts, location-scoped) for the
session's active location. Read-only. Cookie header from argv[2] (a /tmp file)."""
import json, sys, subprocess, datetime
PART, CKF = sys.argv[1], sys.argv[2]; AS = datetime.date.today().isoformat()
CK = open(CKF).read().strip(); ACC = '80aa8bc9-1f67-4ed9-a798-ce501b6d7dd9'
def get(path):
    o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                        '-w', '\n%{http_code}', 'https://api.staging.shopview.com' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1)
    if c != '200': raise SystemExit(f'{path[:100]} -> {c} {t[:150]}')
    return json.loads(t)['data']
out = {'part': PART, 'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'asOf': AS}
if PART == 'report':
    g = get(f'/api/reporting/reports/ap-aging-detail?asOfDate={AS}'); rows = []
    for grp in g['groups']:
        page = 1
        while True:
            d = get(f'/api/reporting/reports/ap-aging-detail/buckets/{grp["bucket"]}/rows?asOfDate={AS}&pagination[page]={page}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false')
            rows += [dict(r, bucket=grp['bucket']) for r in d['collection'] if r.get('vendorName') == '4Refuel']
            if not d['collection'] or page * 100 >= (d['pagination'].get('rowsNumber') or 0): break
            page += 1
    out['rows'] = [{k: r.get(k) for k in ('documentNumber', 'locationName', 'transactionType', 'openBalanceCents', 'date', 'dueDate', 'bucket')} for r in rows]
else:
    # the vendor account is per location (ListUnpaidByVendorAccountQueryHandler filters va.workplace_id = the active
    # location), so read the account id at THIS location - a hard-coded Heavy Duty account reads 0 rows elsewhere
    ACC = get('/api/parts-catalogue/vendor/4acb542f-0f2d-45b8-bbd4-afb70fd22fb8')['vendor']['vendor_account_id']; out['account'] = ACC
    rows, p = [], 1
    while True:
        d = get(f'/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={ACC}&pagination[page]={p}&pagination[rowsPerPage]=100')
        c = d['response']['collection']; rows += c
        if len(c) < 100: break
        p += 1
    out['rows'] = [{k: r.get(k) for k in ('invoice_number', 'type', 'balance', 'date', 'status')} for r in rows]
json.dump(out, open(f'{PART.replace(" ", "-")}.json', 'w'), indent=1); print(PART, len(out['rows']), 'rows')
