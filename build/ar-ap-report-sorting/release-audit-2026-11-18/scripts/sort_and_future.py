"""Release audit 18 Nov. (1) SV-12723 / PRD S2-R6 "A blank value ... sorts to the bottom of its group in both directions":
every Summary money column, both directions, all pages. (2) SV-12545 / PRD S5-R10b: an as-of date after today (2026-11-25)
reads on all six reports and Past Due is counted to that day (S1-R5a). Read-only."""
import json, subprocess, urllib.parse, datetime, sys
from zoneinfo import ZoneInfo
CK = open('/tmp/staging/cookie-header.txt').read().strip(); Z = 'Asia/Karachi'; out = []
def get(path, q):
    u = f'https://api.staging.shopview.com/api/reporting/reports/{path}?' + urllib.parse.urlencode(q)
    o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-w', '\n%{http_code}', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com', u], capture_output=True, text=True).stdout
    t, c = o.rsplit('\n', 1); return c, (json.loads(t) if t.startswith('{') else t)
def allrows(slug, sort, desc, AS):
    rows, page = [], 1
    while True:
        c, d = get(slug, {'asOfDate': AS, 'timezone': Z, 'pagination[page]': page, 'pagination[rowsPerPage]': 100, 'pagination[sortBy]': sort, 'pagination[descending]': str(desc).lower()})
        d = d['data']; rows += d['collection'] if 'collection' in d else d['rows']
        n = d['pagination']['rowsNumber']
        if len(rows) >= n or page > 50: return rows
        page += 1
F = {'current': 'currentCents', 'days_1_to_30': 'days1To30Cents', 'days_31_to_60': 'days31To60Cents', 'days_61_to_90': 'days61To90Cents', 'days_91_plus': 'days91PlusCents', 'total': 'totalCents'}
bad_total = 0
for slug, P in (('ar-aging-summary', 'customerName'), ('ap-aging-summary', 'vendorName')):
    for key, f in F.items():
        for desc in (False, True):
            rs = allrows(slug, key, desc, '2026-11-18'); v = [r[f] for r in rs]
            first_blank = next((i for i, x in enumerate(v) if x == 0), len(v))
            bad = [i for i in range(first_blank, len(v)) if v[i] != 0]
            nz = v[:first_blank]; order_bad = [i for i in range(len(nz) - 1) if (nz[i] < nz[i+1] if desc else nz[i] > nz[i+1])]
            ok = not bad and not order_bad; bad_total += not ok
            out.append(f"- {'PASS' if ok else 'FAIL'} — {slug} sort {key} {'desc' if desc else 'asc'}: {len(rs)} rows, {len(v)-first_blank} blank cells all at the bottom: {not bad}; values in order: {not order_bad}")
# (2) as-of after today
AS = '2026-11-25'; asd = datetime.date(2026, 11, 25)
for slug, sort in (('ar-aging-summary', 'customer_name'), ('ap-aging-summary', 'vendor_name'), ('ar-aging-collection', 'date'), ('ap-unpaid-invoices', 'date')):
    c, d = get(slug, {'asOfDate': AS, 'timezone': Z, 'pagination[page]': 1, 'pagination[rowsPerPage]': 30, 'pagination[sortBy]': sort, 'pagination[descending]': 'false'})
    out.append(f"- {'PASS' if c == '200' else 'FAIL'} — {slug} as of {AS} (after today): HTTP {c}"); bad_total += c != '200'
for slug in ('ar-aging-detail', 'ap-aging-detail'):
    c, g = get(slug, {'asOfDate': AS, 'timezone': Z}); wrong = n = 0
    for grp in g['data']['groups']:
        if not grp['rowsNumber']: continue
        c2, d = get(f"{slug}/buckets/{grp['bucket']}/rows", {'asOfDate': AS, 'timezone': Z, 'pagination[page]': 1, 'pagination[rowsPerPage]': 100, 'pagination[sortBy]': 'date', 'pagination[descending]': 'false'})
        for r in d['data']['collection']:
            due = datetime.datetime.fromisoformat((r['dueDate'] or r['date']).replace('Z', '+00:00')).astimezone(ZoneInfo(Z)).date(); n += 1
            wrong += r['daysPastDue'] != (asd - due).days
    ok = c == '200' and wrong == 0 and n > 0; bad_total += not ok
    out.append(f"- {'PASS' if ok else 'FAIL'} — {slug} as of {AS}: HTTP {c}; Past Due counted to Nov 25: {wrong} wrong of {n} sampled (first 100 lines of each bucket)")
open(sys.argv[1], 'w').write('\n'.join(out) + '\n'); print('\n'.join(out)); print('FAILS', bad_total)
