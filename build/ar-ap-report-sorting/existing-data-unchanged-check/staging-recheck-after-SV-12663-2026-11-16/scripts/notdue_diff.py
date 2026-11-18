"""18 Nov like-for-like (UTC both sides): the A/P documents whose Past Due differs from before. Who are they?
python3 scripts/notdue_diff.py data-as-of-2026-11-12-tz-UTC"""
import csv, gzip, json, sys, collections, datetime
T = sys.argv[1]; BEF = '../staging-before-feature-captured-2026-11-12/1-six-reports/all rows from the data calls'
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
B = {(r['transactionNumber'], r['vendorName']): r for r in rd(f'{BEF}/AP Aging Detail - all documents.tsv')}
A = {(x['documentNumber'], x['vendorName']): x for x in json.load(gzip.open(f'{T}/ap-aging-detail.json.gz'))['rows']}
asof = datetime.date(2026, 11, 12); diff = []; same_neg = 0; old_signs = collections.Counter(); hours = collections.Counter()
for k, r in B.items():
    x = A.get(k)
    if not x or r.get('daysPastDue') in (None, ''): continue
    o, n = int(r['daysPastDue']), int(x['daysPastDue'])
    if o != n:
        diff.append((k, o, n, x['dueDate'], r.get('dueDate')))
        old_signs['old>0' if o > 0 else 'old=0' if o == 0 else 'old<0'] += 1
        hours['due has time-of-day' if x['dueDate'][11:19] != '00:00:00' else 'due at 00:00 UTC'] += 1
    elif n < 0: same_neg += 1
utcday = lambda s: (asof - datetime.date.fromisoformat(s[:10])).days
print('differ:', len(diff), dict(old_signs), dict(hours))
print('new == as-of minus UTC due day:', sum(n == utcday(d) for _, o, n, d, _ in diff), 'of', len(diff))
print('old == new + 1:', sum(o == n + 1 for _, o, n, _, _ in diff))
print('not-yet-due docs with SAME Past Due before and now:', same_neg)
print('due exactly as-of+1 (UTC):', sum(utcday(d) == -1 for *_, d, _ in diff))
for e in diff[:8]: print(e)
