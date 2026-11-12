"""Section 1 completeness: the six reports' screens are paged (30 rows a page) or virtualised, so the screenshots and
rows.txt show only what is in the page. This saves EVERY row from the same data call each screen makes (the OLD routes,
read from the network tab on 12 Nov 2026), as TSV, and checks each file's sum against the report's own totals.
Usage: python3 data_calls.py <out-dir> [YYYY-MM-DD as-of, default today]. Cookie read from /tmp/staging only.
After the upgrade these routes are replaced (e.g. /api/reporting/reports/ap-aging-summary): find the new ones in
app/src/api (Rule 115) and adapt the URL list; the TSV columns are the comparison basis."""
import json, os, subprocess, sys, datetime
OUT = sys.argv[1]; AS = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().isoformat()
CK = open('/tmp/staging/cookie-header.txt').read().strip()
if CK.lower().startswith('cookie:'): CK = CK.split(':', 1)[1].strip()
def get(path):
    o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                        '-w', '\n%{http_code}', 'https://api.staging.shopview.com' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1)
    if c != '200': raise SystemExit(f'{path[:90]} -> HTTP {c} {t[:200]}')
    return json.loads(t)['data']
A = f'asOfDate={AS}T23:59:59.999Z'
P = 'pagination[page]=1&pagination[rowsPerPage]=5000&pagination[descending]=false'
os.makedirs(OUT, exist_ok=True)
def tsv(name, rows, cols):
    with open(f'{OUT}/{name}.tsv', 'w') as f:
        f.write('\t'.join(cols) + '\n')
        for r in rows: f.write('\t'.join('' if r.get(c) is None else str(r.get(c)) for c in cols) + '\n')
notes = [f'As-of date sent: {A} · fetched {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}']
locs = {}
B = ['current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus']
# summaries (one row per customer / vendor)
for name, path, key in [('AR Aging Summary', '/api/reporting/account-receivable/aging-summary-report?' + P + '&pagination[sortBy]=customerName&', 'customerName'),
                        ('AP Aging Summary', '/api/reporting/account-payable/aging-summary-report?' + P + '&pagination[sortBy]=&', 'vendorName')]:
    d = get(path + A); rows = d['collection']
    cols = [k for k in rows[0].keys()] if rows else []
    tsv(f'{name} - all rows', rows, cols)
    sums = {b: round(sum(r.get(b) or 0 for r in rows), 2) for b in B + ['total']}
    ok = all(abs(sums[b] - (d['totals'].get(b) or 0)) < 0.05 for b in sums)
    notes.append(f'{name}: {len(rows)} rows · report totals {json.dumps(d["totals"])} · rows add up to the totals: {"YES" if ok else "NO " + json.dumps(sums)}')
# details (every document, by bucket)
for name, path in [('AR Aging Detail', '/api/reporting/account-receivable/aging-detail-report?'), ('AP Aging Detail', '/api/reporting/account-payable/aging-detail-report?')]:
    d = get(path + A)['buckets']; rows = []
    for b in B:
        for t in d[b]['transactions']: rows.append(dict(t, bucket=b))
    cols = ['bucket'] + sorted({k for r in rows for k in r if k != 'bucket'})
    rows.sort(key=lambda r: (B.index(r['bucket']), str(r.get('date') or r.get('transactionDate')), str(r.get('transactionNumber'))))
    tsv(f'{name} - all documents', rows, cols)
    per = {b: len(d[b]['transactions']) for b in B}
    bal = round(sum((r.get('balance') if r.get('balance') is not None else r.get('openBalance') or 0) for r in rows), 2)
    for r in rows: locs.setdefault(name, {}).setdefault(r.get('locationName'), 0); locs[name][r.get('locationName')] += 1
    notes.append(f'{name}: {len(rows)} documents · per bucket {per} · report total balance {d.get("totalBalance", d.get("totalOpenBalance"))} · documents add up to {bal}: {"YES" if abs(bal - (d.get("totalBalance") or d.get("totalOpenBalance") or 0)) < 0.05 else "NO"}')
# collection / unpaid (groups with their documents)
for name, path, key in [('AR Aging Collection', '/api/reporting/account-receivable/collections-report?' + P + '&pagination[sortBy]=&', 'customerName'),
                        ('AP Unpaid Invoices', '/api/reporting/account-payable/unpaid-invoices-report?' + P + '&pagination[sortBy]=&', 'vendorName')]:
    d = get(path + A); rows = []
    for g in d['collection']:
        for t in g['transactions']: rows.append(dict(t, group=g.get(key)))
    cols = ['group'] + sorted({k for r in rows for k in r if k != 'group'})
    tsv(f'{name} - all documents', rows, cols)
    for r in rows: locs.setdefault(name, {}).setdefault(r.get('locationName'), 0); locs[name][r.get('locationName')] += 1
    notes.append(f'{name}: {len(d["collection"])} groups, {len(rows)} documents · report totals {json.dumps(d.get("totals"))}')
notes.append('Documents per location: ' + json.dumps(locs))
open(f'{OUT}/NOTES.txt', 'w').write('\n'.join(notes) + '\n'); print('\n'.join(notes))
