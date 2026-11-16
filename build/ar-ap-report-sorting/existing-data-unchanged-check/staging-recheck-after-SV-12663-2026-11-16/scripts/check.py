"""C715471 / C715472 re-check after SV-12663 (16 Nov 2026). Three measurements, all as of 2026-11-12:
 1. PRD S1-R5a rule on EVERY document of A/R Detail, A/P Detail, A/R Collection, A/P Unpaid: Past Due must equal the
    as-of date minus the due date as shown at the document's own location (the app shows dates in the document's
    location time zone; calibrated on S2-17154 / S3-39986 / S3-17147 from the 12 Nov evidence), and the bucket must
    agree with that Past Due. Run on today's data AND on the 12 Nov after-feature data (control: must show the bug).
 2. BEFORE (staging 12 Nov 06:46Z, old version) vs TODAY, document by document (number + party): present, amount,
    open balance, bucket, Past Due. Every difference classified.
 3. BEFORE vs TODAY per customer / vendor on the two Summary reports (bucket amounts and total)."""
import json, csv, os, sys, datetime, collections, gzip
from zoneinfo import ZoneInfo
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..'); E = os.path.join(R, '..')
AS = datetime.date(2026, 11, 12)
DATA = sys.argv[1]; SCREEN = sys.argv[2]   # data folder, and the screen's zone the dates are shown in (sent as timezone=)
CTRL = sys.argv[3] if len(sys.argv) > 3 else None   # control: a pull made WITHOUT the screen's zone, judged in SCREEN
TZ = {w['id']: w['timezone'] for w in json.load(open(os.path.join(R, 'reference', 'workplaces-org.json')))}  # GET /api/workplaces (administration/index.ts:243)
def local(iso, wid): return datetime.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(ZoneInfo(SCREEN)).date()   # SV-12663 fix: the screen shows every date in ITS zone
def bucket_for(d): return 'current' if d <= 0 else 'days_1_to_30' if d <= 30 else 'days_31_to_60' if d <= 60 else 'days_61_to_90' if d <= 90 else 'days_91_plus'
T = os.path.join(R, DATA); J = lambda s, T=T: json.load(gzip.open(f'{T}/{s}.json.gz'))
today = {'A/R Detail': J('ar-aging-detail')['rows'], 'A/P Detail': J('ap-aging-detail')['rows'],
         'A/R Collection': [x for g in J('ar-aging-collection')['rows'] for x in g['rows']],
         'A/P Unpaid': [x for g in J('ap-unpaid-invoices')['rows'] for x in g['rows']]}
assert len(today['A/R Collection']) == J('ar-aging-collection')['totals']['documentCount']
assert len(today['A/P Unpaid']) == J('ap-unpaid-invoices')['totals']['documentCount']
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
ctrl = {}
if CTRL:
    C = os.path.join(R, CTRL); JC = lambda s: json.load(gzip.open(f'{C}/{s}.json.gz'))
    ctrl = {'A/R Detail': JC('ar-aging-detail')['rows'], 'A/P Detail': JC('ap-aging-detail')['rows'],
            'A/R Collection': [x for g in JC('ar-aging-collection')['rows'] for x in g['rows']], 'A/P Unpaid': [x for g in JC('ap-unpaid-invoices')['rows'] for x in g['rows']]}
out = [f'# C715471 / C715472 re-check after SV-12663 - staging, as of 12 Nov 2026, screen zone {SCREEN}', '',
       f'Data pulled {json.load(gzip.open(T + "/META.json.gz"))["started"]} on build {json.load(gzip.open(T + "/META.json.gz"))["build_start"]} (same at the end).', '']
# 1. PRD rule
out.append('## 1. PRD S1-R5a: Past Due = as-of date minus the due date shown, bucket agrees')
res1 = {}
for label, sets in ((f'TODAY, timezone={SCREEN} sent, dates read in {SCREEN}', today),) + (((f'CONTROL: {CTRL} (no zone sent, server used the session zone), dates read in {SCREEN}', ctrl),) if CTRL else ()):
    out.append(f'### {label}')
    for rep, docs in sets.items():
        bad = collections.Counter(); ex = collections.defaultdict(list); n = 0; nodue = collections.Counter()
        for x in docs:
            n += 1
            if not x.get('dueDate'):
                k = f'no due date shown (Past Due {x.get("daysPastDue")!r}, {x["transactionType"]}) - not a rule failure, counted only'; nodue[k] += 1; continue
            due = local(x['dueDate'], x['workplaceId']); exp = (AS - due).days; got = int(x['daysPastDue'])
            ok_b = x.get('bucket') in (None, bucket_for(exp)) if 'bucket' in x else True
            if got != exp or not ok_b:
                k = f'{x["locationName"]}: Past Due {got - exp:+d}' + ('' if ok_b else ', bucket wrong'); bad[k] += 1
                if len(ex[k]) < 3: ex[k].append(f'{x["documentNumber"]} ({x["transactionType"]}) due shown {due}, Past Due {got}, should be {exp}' + (f', bucket {x["bucket"]}' if 'bucket' in x else ''))
        res1[(label, rep)] = sum(bad.values())
        out.append(f'- {rep}: {n} documents, **{sum(bad.values())} wrong**' + ''.join(f'\n  - {k}: {v} (e.g. {"; ".join(ex[k])})' for k, v in bad.most_common()) + ''.join(f'\n  - {k}: {v}' for k, v in nodue.items()))
# 2. before vs today, documents
BEF = os.path.join(E, 'staging-before-feature-captured-2026-11-12', '1-six-reports', 'all rows from the data calls')
BMAP = {'current': 'current', 'days1to30': 'days_1_to_30', 'days31to60': 'days_31_to_60', 'days61to90': 'days_61_to_90', 'days91Plus': 'days_91_plus'}
cents = lambda v: round(float(v) * 100) if v not in ('', None) else 0
out += ['', '## 2. Before the feature (12 Nov 06:46Z, old version) vs today, document by document']
res2 = {}
pairs = [('A/R Detail', 'AR Aging Detail - all documents', 'customerName', 'customerName', None),
         ('A/P Detail', 'AP Aging Detail - all documents', 'vendorName', 'vendorName', 'daysPastDue'),
         ('A/R Collection', 'AR Aging Collection - all documents', None, 'customerName', 'pastDue'),
         ('A/P Unpaid', 'AP Unpaid Invoices - all documents', 'vendorName', 'vendorName', 'pastDue')]
for rep, bf, bparty, aparty, bpd in pairs:
    B = rd(f'{BEF}/{bf}.tsv'); A = today[rep]
    if bparty is None:   # old A/R Collection rows carry no customer name: match by number only
        bk = lambda r: (r['transactionNumber'],); ak = lambda x: (x['documentNumber'],)
    else:
        bk = lambda r: (r['transactionNumber'], r[bparty]); ak = lambda x: (x['documentNumber'], x[aparty])
    ad = collections.defaultdict(list); [ad[ak(x)].append(x) for x in A]
    bd = collections.defaultdict(list); [bd[bk(r)].append(r) for r in B]
    cls = collections.Counter(); ex = collections.defaultdict(list)
    def note(c, s):
        cls[c] += 1
        if len(ex[c]) < 6: ex[c].append(s)
    for k, rs in bd.items():
        a = ad.get(k)
        if not a: note('missing today', f'{k} {rs[0].get("bucket", rs[0].get("group"))} {rs[0].get("openBalance", rs[0].get("balance"))}'); continue
        r, x = rs[0], a[0]
        bal = r.get('openBalance') if r.get('openBalance') not in (None, '') else r.get('balance')
        if cents(r['amount']) != x['amountCents'] or cents(bal) != x['openBalanceCents']:
            note('amount or open balance differs', f'{k} amount {cents(r["amount"])}->{x["amountCents"]}, open {cents(bal)}->{x["openBalanceCents"]}')
        if 'bucket' in r and BMAP[r['bucket']] != x['bucket']:
            intended = x['transactionType'] in ('Credit Memo', 'Deposit', 'Vendor Credit') and local(x['date'], x['workplaceId']) == AS and x['bucket'] == 'current'
            note('bucket moved - INTENDED (credit dated on the as-of date -> Current, PRD section 2)' if intended else 'bucket moved - NOT intended',
                 f'{k} {r["bucket"]}->{x["bucket"]} {x["locationName"]} due {x["dueDate"]}')
        if bpd and r.get(bpd) not in (None, '') and int(r[bpd]) != int(x['daysPastDue']):
            intended = x['transactionType'] in ('Credit Memo', 'Deposit', 'Vendor Credit') and local(x['date'], x['workplaceId']) == AS and int(x['daysPastDue']) == 0
            note('Past Due differs - INTENDED (credit dated on the as-of date -> 0)' if intended else f'Past Due differs ({int(x["daysPastDue"]) - int(r[bpd]):+d}) - NOT intended',
                 f'{k} {r[bpd]}->{x["daysPastDue"]} {x["locationName"]}')
        cls['matched'] += 1
    for k, xs in ad.items():
        if k not in bd: note('new today (not in the before snapshot)', f'{k} {xs[0]["locationName"]} dated {xs[0]["date"][:10]} open {xs[0]["openBalanceCents"]}')
    res2[rep] = dict(cls)
    out.append(f'### {rep}: before {len(B)}, today {len(A)}')
    out += [f'- {c}: {v}' + ('' if c == 'matched' else '\n  - ' + '\n  - '.join(ex[c])) for c, v in cls.most_common()]
# 3. summaries
out += ['', '## 3. Before vs today, Summary reports per customer / vendor']
for rep, bf, slug, pk in (('A/R Summary', 'AR Aging Summary - all rows', 'ar-aging-summary', 'customerName'), ('A/P Summary', 'AP Aging Summary - all rows', 'ap-aging-summary', 'vendorName')):
    B = {r[pk]: r for r in rd(f'{BEF}/{bf}.tsv')}; A = {x[pk]: x for x in J(slug)['rows']}
    cols = [('current', 'currentCents'), ('days1to30', 'days1To30Cents'), ('days31to60', 'days31To60Cents'), ('days61to90', 'days61To90Cents'), ('days91Plus', 'days91PlusCents'), ('total', 'totalCents')]
    diff = [p for p in B if p in A and any(cents(B[p][b]) != A[p][a] for b, a in cols)]
    out.append(f'- {rep}: before {len(B)} parties, today {len(A)}; only before {len(set(B) - set(A))}, only today {len(set(A) - set(B))}; same name, any column differs: {len(diff)}'
               + ''.join(f'\n  - {p}: ' + ', '.join(f'{b} {cents(B[p][b])}->{A[p][a]}' for b, a in cols if cents(B[p][b]) != A[p][a]) for p in diff[:25]))
open(os.path.join(R, f'RECHECK-{SCREEN.replace("/", "-")}.md'), 'w').write('\n'.join(out) + '\n')
json.dump({'rule_check': {f'{a} | {b}': v for (a, b), v in res1.items()}, 'before_vs_today': res2}, open(os.path.join(R, f'summary-{SCREEN.replace("/", "-")}.json'), 'w'), indent=1)
print(json.dumps({'rule_check': {f'{a[:9]} | {b}': v for (a, b), v in res1.items()}, 'before_vs_today': res2}, indent=1))
