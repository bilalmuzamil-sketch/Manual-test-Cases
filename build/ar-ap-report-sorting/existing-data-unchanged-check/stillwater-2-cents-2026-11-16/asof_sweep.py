"""Rule 120: the NEW A/P Unpaid Invoices report (reports' own data call, vendors=<Stillwater>, timezone sent as the screen
does) for bill 055-541861 at several as-of dates, today included. Nothing was paid on the bill (the app's own payment list
for the vendor account is empty), so its open balance must be the same on every date. Read-only. Cookie from /tmp only."""
import json, subprocess, datetime
CK = open('/tmp/staging/cookie-header.txt').read().strip(); V = '086df5dc-5dfb-4627-bfbe-f7efafaffcc9'
def get(path):
    o = subprocess.run(['curl', '-g', '-s', '-m', '120', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                        '-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1); assert c == '200', (path, c, t[:200]); return json.loads(t)['data']
build = subprocess.run(['curl', '-s', 'https://app.staging.shopview.com/'], capture_output=True, text=True).stdout.split('app-version" content="')[1].split('"')[0]
out = {'build': build, 'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'rows': []}
for asof in ('2026-11-16', '2026-11-15', '2026-11-13', '2026-11-12', '2026-10-31', '2026-09-30'):
    for tz in ('America/Edmonton', 'Asia/Karachi'):
        d = get(f'reporting/reports/ap-unpaid-invoices?asOfDate={asof}&timezone={tz.replace("/", "%2F")}&vendors={V}&pagination[page]=1&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false')
        for g in d['collection']:
            for r in g['rows']:
                if r['documentNumber'] in ('055-541861', '069-855902'):
                    out['rows'].append({'asOf': asof, 'tz': tz, 'doc': r['documentNumber'], 'amountCents': r['amountCents'], 'openBalanceCents': r['openBalanceCents'], 'pastDue': r['daysPastDue']})
json.dump(out, open('asof-sweep.json', 'w'), indent=1)
print(out['build'], out['utc'])
for r in out['rows']: print(r)
