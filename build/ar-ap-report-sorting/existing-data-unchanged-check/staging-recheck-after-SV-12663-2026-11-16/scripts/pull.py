"""Re-check of C715471 / C715472 after SV-12663 (16 Nov 2026): every document of the six A/R and A/P reports from the
reports' own data calls (endpoints from app/src/api/reporting/index.ts on develop, Rule 115), as of 2026-11-12, the date
of the staging BEFORE snapshot. Raw JSON is kept. Cookie from /tmp/staging only; read-only (GET)."""
import json, os, subprocess, sys, datetime, urllib.parse
OUT, AS = sys.argv[1], sys.argv[2]; TZQ = sys.argv[3] if len(sys.argv) > 3 else ''; os.makedirs(OUT, exist_ok=True)
ZP = f'&timezone={urllib.parse.quote(TZQ)}' if TZQ else ''   # the screen's zone, sent by the fixed app on every aging read (SV-12663 handoff)
CK = open('/tmp/staging/cookie-header.txt').read().strip()
def get(path):
    for _ in range(3):
        o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                            '-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
        t, c = o.rsplit('\n', 1)
        if c == '200': return json.loads(t)['data']
    raise SystemExit(f'{path[:120]} -> HTTP {c} {t[:200]}')
def paged(base, sort, key='collection'):
    out, page = [], 1
    while True:
        d = get(f'{base}?asOfDate={AS}{ZP}&pagination[page]={page}&pagination[rowsPerPage]=100&pagination[sortBy]={sort}&pagination[descending]=false')
        out += d[key]; n = d['pagination'].get('rowsNumber')
        if not d[key] or (n is not None and len(out) >= n): return out, d
        page += 1
build = subprocess.run(['curl', '-s', 'https://app.staging.shopview.com/'], capture_output=True, text=True).stdout.split('app-version" content="')[1].split('"')[0]
meta = {'asOfDate': AS, 'timezone_sent': TZQ or None, 'build_start': build, 'started': f'{datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}'}
for slug, sort in [('ar-aging-summary', 'customer_name'), ('ap-aging-summary', 'vendor_name'), ('ar-aging-collection', 'date'), ('ap-unpaid-invoices', 'date')]:
    rows, d = paged('reporting/reports/' + slug, sort)
    json.dump({'rows': rows, 'totals': d.get('totals')}, open(f'{OUT}/{slug}.json', 'w'))
    meta[slug] = {'rows': len(rows), 'server_rowsNumber': d['pagination'].get('rowsNumber'), 'totals': d.get('totals')}
for slug in ('ar-aging-detail', 'ap-aging-detail'):
    g = get(f'reporting/reports/{slug}?asOfDate={AS}{ZP}'); docs = []
    for grp in g['groups']:
        rs, _ = paged(f'reporting/reports/{slug}/buckets/{grp["bucket"]}/rows', 'date')
        assert len(rs) == grp['rowsNumber'], (slug, grp['bucket'], len(rs), grp['rowsNumber'])
        docs += [dict(r, bucket=grp['bucket']) for r in rs]
    json.dump({'groups': g['groups'], 'totals': g['totals'], 'rows': docs}, open(f'{OUT}/{slug}.json', 'w'))
    meta[slug] = {'rows': len(docs), 'totals': g['totals'], 'add_up': sum(r['openBalanceCents'] for r in docs) == g['totals']['openBalanceCents']}
meta['build_end'] = subprocess.run(['curl', '-s', 'https://app.staging.shopview.com/'], capture_output=True, text=True).stdout.split('app-version" content="')[1].split('"')[0]
meta['finished'] = f'{datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}'
json.dump(meta, open(f'{OUT}/META.json', 'w'), indent=1); print(json.dumps(meta, indent=1))
