"""AFTER the upgrade: every row of the six reports from the NEW data calls (read from the network tab and from
app/src/api/reporting/index.ts on branch SV-11315-ar-ap-aging-reports, Rule 115), as TSV, checked against each
report's own totals. Usage: python3 after_data_calls.py <out-dir> <YYYY-MM-DD as-of>. Cookie from /tmp/staging only."""
import json, os, subprocess, sys, datetime, urllib.parse
OUT, AS = sys.argv[1], sys.argv[2]
CK = open('/tmp/staging/cookie-header.txt').read().strip()
if CK.lower().startswith('cookie:'): CK = CK.split(':', 1)[1].strip()
def get(path):
    for _ in range(3):
        o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                            '-w', '\n%{http_code}', 'https://api.staging.shopview.com' + path], capture_output=True, text=True).stdout
        t, c = o.rsplit('\n', 1)
        if c == '200': return json.loads(t)['data']
    raise SystemExit(f'{path[:120]} -> HTTP {c} {t[:200]}')
def paged(base, sort, key='collection'):
    out, page = [], 1
    while True:
        d = get(f'{base}?asOfDate={AS}&pagination[page]={page}&pagination[rowsPerPage]=100&pagination[sortBy]={sort}&pagination[descending]=false')
        out += d[key]; n = d['pagination'].get('rowsNumber')
        if not d[key] or (n is not None and len(out) >= n): return out, d, n
        page += 1
os.makedirs(OUT, exist_ok=True)
def tsv(name, rows):
    cols = sorted({k for r in rows for k in r if not isinstance(r.get(k), (dict, list))})
    with open(f'{OUT}/{name}.tsv', 'w') as f:
        f.write('\t'.join(cols) + '\n')
        for r in rows: f.write('\t'.join('' if r.get(c) is None else str(r.get(c)) for c in cols) + '\n')
notes = [f'As-of date sent: asOfDate={AS} · started {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}']
B = ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus']
for name, slug, sort in [('AR Aging Summary', 'ar-aging-summary', 'customer_name'), ('AP Aging Summary', 'ap-aging-summary', 'vendor_name')]:
    rows, d, n = paged('/api/reporting/reports/' + slug, sort)
    tsv(f'{name} - all rows', rows)
    t = d['totals']; s = sum(r['totalCents'] for r in rows)
    notes.append(f'{name}: {len(rows)} rows (server says {n}) · totals {json.dumps(t)} · rows add up to totalCents: {"YES" if s == t["totalCents"] else "NO " + str(s)}')
for name, slug in [('AR Aging Detail', 'ar-aging-detail'), ('AP Aging Detail', 'ap-aging-detail')]:
    g = get(f'/api/reporting/reports/{slug}?asOfDate={AS}'); rows = []
    for grp in g['groups']:
        rs, d, n = paged(f'/api/reporting/reports/{slug}/buckets/{grp["bucket"]}/rows', 'date')
        rows += [dict(r, bucket=grp['bucket']) for r in rs]
        if len(rs) != grp['rowsNumber']: notes.append(f'  !! {name} {grp["bucket"]}: fetched {len(rs)} of {grp["rowsNumber"]}')
    tsv(f'{name} - all documents', rows)
    per = {grp['bucket']: grp['rowsNumber'] for grp in g['groups']}
    s = sum(r['openBalanceCents'] for r in rows)
    notes.append(f'{name}: {len(rows)} documents · per bucket {per} · totals {json.dumps(g["totals"])} · documents add up to openBalanceCents: {"YES" if s == g["totals"]["openBalanceCents"] else "NO " + str(s)}')
for name, slug, sort in [('AR Aging Collection', 'ar-aging-collection', 'date'), ('AP Unpaid Invoices', 'ap-unpaid-invoices', 'date')]:
    groups, d, n = paged('/api/reporting/reports/' + slug, sort)
    flat = [{k: v for k, v in g.items() if not isinstance(v, (list, dict))} | {'rowsShown': len(g.get('rows') or g.get('transactions') or [])} for g in groups]
    tsv(f'{name} - all groups', flat)
    notes.append(f'{name}: {len(groups)} groups (server says {n}), {sum(g.get("rowsNumber", 0) for g in groups)} documents · totals {json.dumps(d["totals"])}')
notes.append(f'Finished {datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}')
open(f'{OUT}/NOTES.txt', 'w').write('\n'.join(notes) + '\n'); print('\n'.join(notes))
