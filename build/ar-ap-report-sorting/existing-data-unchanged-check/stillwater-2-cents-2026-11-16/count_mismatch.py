"""How many open documents does the 'today vs a past date' jump affect? Every document of A/P Aging Detail and A/R Aging
Detail (reports' own data calls, timezone=America/Edmonton as the Lethbridge screen sends) as of TODAY (the report reads the
stored balance) and as of YESTERDAY (the report computes amount minus payments). A document present on both days whose open
balance differs, while its as-of-yesterday open balance equals its amount and no payment can explain it, carries a stored
balance that disagrees with amount minus payments. Read-only. Cookie from /tmp only."""
import json, subprocess, datetime, collections, gzip
CK = open('/tmp/staging/cookie-header.txt').read().strip(); TZ = 'America%2FEdmonton'
def get(path):
    o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com',
                        '-w', '\n%{http_code}', 'https://api.staging.shopview.com/api/' + path], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1); assert c == '200', (path[:100], c, t[:200]); return json.loads(t)['data']
def detail(slug, asof):
    g = get(f'reporting/reports/{slug}?asOfDate={asof}&timezone={TZ}'); rows = []
    for grp in g['groups']:
        p = 1
        while True:
            d = get(f'reporting/reports/{slug}/buckets/{grp["bucket"]}/rows?asOfDate={asof}&timezone={TZ}&pagination[page]={p}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false')
            rows += d['collection']
            if not d['collection'] or p * 100 >= (d['pagination'].get('rowsNumber') or 0): break
            p += 1
    return rows
build = subprocess.run(['curl', '-s', 'https://app.staging.shopview.com/'], capture_output=True, text=True).stdout.split('app-version" content="')[1].split('"')[0]
TODAY, YDAY = '2026-11-16', '2026-11-15'; out = {'build': build, 'started': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'reports': {}}
for slug in ('ap-aging-detail', 'ar-aging-detail'):
    t = {r['documentId']: r for r in detail(slug, TODAY)}; y = {r['documentId']: r for r in detail(slug, YDAY)}
    c = collections.Counter(); ex = []
    for k, a in y.items():
        b = t.get(k)
        if not b: c['open yesterday, gone today (paid or changed today)'] += 1; continue
        d = b['openBalanceCents'] - a['openBalanceCents']
        if d == 0: c['same'] += 1; continue
        if a['openBalanceCents'] == a['amountCents'] and abs(d) <= 100:
            c['jump, no payment: stored balance != amount (<= $1.00)'] += 1
            ex.append({k2: b.get(k2) for k2 in ('documentNumber', 'transactionType', 'locationName', 'date')} | {'amountCents': a['amountCents'], 'open_as_of_yesterday': a['openBalanceCents'], 'open_as_of_today': b['openBalanceCents']})
        else: c['other change (payment, credit or larger)'] += 1
    out['reports'][slug] = {'yesterday_docs': len(y), 'today_docs': len(t), 'classes': dict(c), 'examples': ex}
out['finished'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
json.dump(out, open('mismatch-count.json', 'w'), indent=1)
for s, v in out['reports'].items(): print(s, v['yesterday_docs'], v['classes']); [print('   ', e) for e in v['examples'][:12]]
