"""18 Nov: every Summary difference (before 12 Nov vs today) must be explained by a Detail-level difference already
classified in RECHECK-<zone>.md §2. Compares, per customer/vendor and bucket, the change in the Summary with the change in
the sum of that party's Detail open balances.   python3 scripts/summary_reconcile.py data-as-of-2026-11-12-tz-UTC"""
import csv, gzip, json, sys, collections
from decimal import Decimal
T = sys.argv[1]; BEF = '../staging-before-feature-captured-2026-11-12/1-six-reports/all rows from the data calls'
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
c = lambda v: int((Decimal(str(v).replace(',', '').replace('$', '') or '0') * 100).to_integral_value())
J = lambda s: json.load(gzip.open(f'{T}/{s}.json.gz'))
OB = {'current': 'current', 'days1to30': 'd1', 'days31to60': 'd31', 'days61to90': 'd61', 'days91Plus': 'd91'}
NB = {'current': 'current', 'days_1_to_30': 'd1', 'days_31_to_60': 'd31', 'days_61_to_90': 'd61', 'days_91_plus': 'd91'}
NS = {'currentCents': 'current', 'days1To30Cents': 'd1', 'days31To60Cents': 'd31', 'days61To90Cents': 'd61', 'days91PlusCents': 'd91'}
for side, party, sumf, detf, dslug, sslug in (('A/R', 'customerName', 'AR Aging Summary - all rows', 'AR Aging Detail - all documents', 'ar-aging-detail', 'ar-aging-summary'),
                                              ('A/P', 'vendorName', 'AP Aging Summary - all rows', 'AP Aging Detail - all documents', 'ap-aging-detail', 'ap-aging-summary')):
    so = collections.Counter(); sn = collections.Counter(); do = collections.Counter(); dn = collections.Counter()
    for r in rd(f'{BEF}/{sumf}.tsv'):
        for k, b in OB.items(): so[(r[party].strip(), b)] += c(r[k])
    for r in J(sslug)['rows']:
        for k, b in NS.items(): sn[(r[party].strip(), b)] += r[k]
    bucket_old = {}
    for r in rd(f'{BEF}/{detf}.tsv'):
        bo = r['bucket']; b = OB.get(bo) or NB.get(bo) or {'days1To30': 'd1', 'days31To60': 'd31', 'days61To90': 'd61'}.get(bo)
        bal = r.get('openBalance') or r.get('balance'); do[(r[party].strip(), b)] += c(bal)
    for x in J(dslug)['rows']: dn[(x[party].strip(), NB[x['bucket']])] += x['openBalanceCents']
    keys = set(so) | set(sn) | set(do) | set(dn); bad = []; changed = 0
    for k in keys:
        ds, dd = sn[k] - so[k], dn[k] - do[k]
        if ds: changed += 1
        if ds != dd: bad.append((k, ds, dd))
    print(f'{side}: party-buckets whose Summary changed {changed}; changes NOT matched by the Detail change: {len(bad)}')
    for b in sorted(bad)[:10]: print('   ', b)
