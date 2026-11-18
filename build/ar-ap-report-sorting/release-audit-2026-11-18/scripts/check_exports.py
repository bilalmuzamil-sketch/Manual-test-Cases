"""Release audit 18 Nov: check the downloaded exports against PRD v14 Story 3 (S3-R4, R5, R7, R7a, R7b, R7c, R8, R8b, R3).
python3 scripts/check_exports.py exports data-as-of-2026-11-18-tz-Asia-Karachi"""
import csv, json, re, subprocess, sys, io, collections
E, D = sys.argv[1], sys.argv[2]; out = []; nfail = 0
def res(name, ok, detail=''):
    global nfail; nfail += (not ok); out.append(f"- {'PASS' if ok else 'FAIL'} — {name}{(': ' + detail) if detail else ''}")
import gzip, os
def _open(f, **k): return gzip.open(f + '.gz', 'rt', **k) if not os.path.exists(f) and os.path.exists(f + '.gz') else open(f, **k)
J = lambda s: json.load(_open(f'{D}/{s}.json'))
MONEY = re.compile(r'^-?\d+\.\d{2}$'); DATE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
HEAD = {'ar-aging-detail': 'Customer Full Name', 'ar-aging-collection': 'Customer', 'ap-aging-detail': 'Vendor Name', 'ap-unpaid-invoices': 'Vendor Name', 'ar-aging-summary': 'Customer', 'ap-aging-summary': 'Vendor'}
def readcsv(f):
    return list(csv.reader(io.StringIO(_open(f'{E}/{f}', encoding='utf-8-sig').read())))
# ---- CSV, untouched
opening = {'ar-aging-detail': json.load(open(f'{D}/ar-aging-detail-opening-order.json')), 'ap-aging-detail': json.load(open(f'{D}/ap-aging-detail-opening-order.json'))} if False else {}
for slug in ['ar-aging-summary', 'ap-aging-summary', 'ar-aging-detail', 'ap-aging-detail', 'ar-aging-collection', 'ap-unpaid-invoices']:
    rows = readcsv(f'{slug}-all.csv'); hdr = [r for r in rows[:4]]
    res(f'{slug} CSV S3-R4/R8 line 1 "As of: Nov 18, 2026"', rows[0] == ['As of: Nov 18, 2026'], str(rows[0]))
    res(f'{slug} CSV S3-R5 line 2 "Locations: All locations"', rows[1] == ['Locations: All locations'], str(rows[1]))
    head = rows[2]; body = rows[3:-1]; tot = rows[-1]
    out.append(f'  - headings: {head}')
    res(f'{slug} CSV last row is the Totals row', tot[0].strip().lower().startswith('total'), str(tot[:3]))
    data = J(slug); n = len(data['rows']) if 'groups' in data or 'summary' in slug else sum(len(g['rows']) for g in data['rows'])
    res(f'{slug} CSV S3-R8 one row per {"party" if "summary" in slug else "document"}', len(body) == n, f'{len(body)} rows vs {n} on screen')
    mcols = [i for i, h in enumerate(head) if h in ('Amount', 'Open Balance', 'Current', '1 - 30', '31 - 60', '61 - 90', '91 And Over', 'Total', '1-30', '31-60', '61-90')]
    bad = [(i, r[c]) for i, r in enumerate(body) for c in mcols if r[c] != '' and not MONEY.match(r[c])]
    res(f'{slug} CSV S3-R8 money is a plain number with two decimals', not bad and bool(mcols), f'{len(mcols)} money columns; bad {bad[:3]}')
    dcols = [i for i, h in enumerate(head) if h in ('Date', 'Due Date')]
    bad = [(i, r[c]) for i, r in enumerate(body) for c in dcols if r[c] != '' and not DATE.match(r[c])]
    res(f'{slug} CSV S3-R8 dates are YYYY-MM-DD', not bad, f'{len(dcols)} date columns; bad {bad[:3]}')
    for c in mcols:
        s = round(sum(float(r[c]) for r in body if r[c] != ''), 2); t = tot[c]
        if t != '' and abs(s - float(t)) > 0.001: res(f'{slug} CSV Totals {head[c]} = sum of rows', False, f'{s} vs {t}')
    if 'summary' in slug:
        res(f'{slug} CSV S3-R7 last bucket headed "91 And Over"', '91 And Over' in head, str(head))
        res(f'{slug} CSV S3-R8 an empty bucket is a blank cell', any(r[c] == '' for r in body for c in mcols), 'blank cells present' )
        # order: same as screen opening order
        names = [r[head.index([h for h in head if h.startswith('Customer') or h.startswith('Vendor')][0])] for r in body]
        scr = [x['customerName' if slug.startswith('ar') else 'vendorName'] for x in data['rows']]
        res(f'{slug} CSV S3-R3 rows in the on-screen order', [a.strip() for a in names] == [b.strip() for b in scr], 'first difference at ' + str(next((i for i, (a, b) in enumerate(zip(names, scr)) if a.strip() != b.strip()), '-')))
    else:
        nc = head.index('ID') if 'ID' in head else head.index('No.')
        res(f'{slug} CSV S3-R8b party column heading "{HEAD[slug]}"', HEAD[slug] in head, str(head))
        if 'detail' in slug:
            res(f'{slug} CSV S3-R8b "Aging Bucket" column with the screen bucket names', 'Aging Bucket' in head and {r[head.index('Aging Bucket')] for r in body} <= {'91 or more days past due', '61-90 days past due', '31-60 days past due', '1-30 days past due', 'Current'}, str(collections.Counter(r[head.index('Aging Bucket')] for r in body) if 'Aging Bucket' in head else head))
            op = json.load(_open(f'{D}/{slug}-opening-order.json')); scr = [x['documentNumber'] for x in op]
        else:
            scr = [x['documentNumber'] for g in data['rows'] for x in g['rows']]
        got = [r[nc] for r in body]
        res(f'{slug} CSV S3-R3 rows in the on-screen order', got == scr, 'first difference at ' + str(next((i for i, (a, b) in enumerate(zip(got, scr)) if a != b), '-')))
        if slug == 'ar-aging-collection':
            res('ar-aging-collection CSV S3-R8a "Phone" (and "Credit Term") right after "Customer"', head[head.index('Customer') + 1] == 'Phone', str(head))
# ---- CSV filtered: header lines
r = readcsv('ap-aging-detail-lethbridge-31-60.csv')
res('A/P Detail CSV S3-R5 location + Past due lines', r[1] == ['Locations: Staging Lethbridge - 4310'] and r[2] == ['Past due: 31-60 days, 91+ days'], str(r[:3]))
r = readcsv('ar-aging-collection-2cust.csv')
res('A/R Collection CSV S3-R5 "Customers: " names in the order ticked', r[2][0].startswith('Customers: 4 Star Truck Repair, ') and 'ZZBREAK' in r[2][0], r[2][0][:90])
# ---- PDFs
def pdftext(f, layout=True):
    return subprocess.run(['pdftotext'] + (['-layout'] if layout else []) + [f'{E}/{f}', '-'], capture_output=True, text=True).stdout
for f, groups in [('ar-aging-summary-all.pdf', None), ('ap-aging-summary-all.pdf', None), ('ar-aging-detail-2cust.pdf', 'b'), ('ar-aging-collection-2cust.pdf', 'p'), ('ap-aging-detail-3vend.pdf', 'b'), ('ap-unpaid-invoices-3vend.pdf', 'p'), ('ar-aging-summary-longname.pdf', None), ('ap-unpaid-invoices-exactly-1000.pdf', 'p')]:
    t = pdftext(f); pages = t.split('\f')
    res(f'{f} S3-R4 "As of Nov 18, 2026"', 'As of Nov 18, 2026' in t)
    res(f'{f} S3-R5 "Locations: All locations"', 'Locations: All locations' in t)
    res(f'{f} S3-R7b never prints "Subtotal"', 'Subtotal' not in t)
    ds = re.findall(r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2},? \d{4}\b', t)
    wrong = [d for d in ds if not re.match(r'^[A-Z][a-z]{2} \d{2} \d{4}$', d) and d != 'Nov 18, 2026']
    res(f'{f} S3-R7a dates print as "Nov 04 2026"', not wrong, f'{len(ds)} dates; not in that form: {wrong[:4]}')
    neg_screen = re.findall(r'\$-\d', t); neg_pdf = re.findall(r'\(-\$[\d,]+\.\d\d\)', t)
    res(f'{f} S3-R7a negatives in brackets "(-$11,111.00)"', not neg_screen, f'{len(neg_pdf)} bracketed, {len(neg_screen)} in screen form')
    if 'summary' in f: res(f'{f} S3-R7 heading "91 And Over" on one line', '91 And Over' in t)
    if groups:
        tf = re.findall(r'Total for ', pdftext(f, False)); out.append(f'  - {f}: {len(pages)-1} pages, {len(tf)} "Total for" rows')
    # S3-R7c every column on every page: the money headings appear on each page that holds a table
    need = ['Open Balance'] if 'summary' not in f else ['91 And Over', 'Total']
    miss = [i + 1 for i, p in enumerate(pages) if p.strip() and not all(h in p for h in need)]
    res(f'{f} S3-R7c every column heading on every page', not miss, f'pages missing: {miss[:6]}')
open(f'{E}/EXPORT-CHECKS.md', 'w').write('\n'.join(out) + '\n'); print('\n'.join(out)); print('FAILS', nfail)
