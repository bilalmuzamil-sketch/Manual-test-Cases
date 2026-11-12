"""Rule 120 measurement behind the C715472 correction (12 Nov 2026): compare daysPastDue per A/P bill, BEFORE
(old data calls, staging 06:46Z) vs AFTER (new data calls, v26.45.4-d07623f), matched by number + vendor."""
import csv, collections, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..', '..')
d = '1-six-reports/all rows from the data calls/AP Aging Detail - all documents.tsv'
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
B = rd(os.path.join(R, 'staging-before-feature-captured-2026-11-12', d)); A = rd(os.path.join(R, 'staging-after-feature-2026-11-12', d))
ad = {(r['documentNumber'], r['vendorName']): r for r in A}; c = collections.Counter()
for r in B:
    a = ad.get((r['transactionNumber'], r['vendorName']))
    if not a: c['not in after'] += 1; continue
    diff = int(a['daysPastDue']) - int(r['daysPastDue'])
    c['same' if diff == 0 else f'{diff:+d} ({"not yet due" if int(r["daysPastDue"]) <= 0 else "past due"})'] += 1
for k, v in sorted(c.items()): print(f'{v:6d}  {k}')
