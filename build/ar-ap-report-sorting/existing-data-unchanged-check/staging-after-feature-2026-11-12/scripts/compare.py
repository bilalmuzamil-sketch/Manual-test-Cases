"""Compare the staging BEFORE snapshot (old data calls, 12 Nov 06:46Z, as of 12 Nov) with AFTER (new data calls, as of
12 Nov). Documents are matched by number + party. Parties whose name starts with ZZAUTOTEST and that did not exist in the
BEFORE data are excluded (created after the snapshot, RE-CHECK list). Every difference is classified."""
import csv, sys, os, json, collections, datetime
BEF = sys.argv[1]; AFT = sys.argv[2]; OUT = sys.argv[3]
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
BMAP = {'current': 'current', 'days1to30': 'days_1_to_30', 'days31to60': 'days_31_to_60', 'days61to90': 'days_61_to_90', 'days91Plus': 'days_91_plus'}
cents = lambda v: round(float(v) * 100) if v not in ('', None) else 0
out = []; summary = {}
for side, bf, af, party in [('A/R', 'AR Aging Detail - all documents', 'AR Aging Detail - all documents', 'customerName'), ('A/P', 'AP Aging Detail - all documents', 'AP Aging Detail - all documents', 'vendorName')]:
    B = rd(f'{BEF}/{bf}.tsv'); A = rd(f'{AFT}/{af}.tsv')
    bparties = {r[party] for r in B}
    bd = {}
    for r in B:
        k = (r['transactionNumber'], r[party]); bd.setdefault(k, []).append(r)
    ad = {}
    for r in A:
        k = (r['documentNumber'], r[party]); ad.setdefault(k, []).append(r)
    cls = collections.Counter(); det = collections.defaultdict(list)
    for k, rs in bd.items():
        a = ad.get(k)
        if not a: cls['missing after'] += len(rs); det['missing after'].append(k + (rs[0]['bucket'], rs[0].get('balance') or rs[0].get('openBalance'), rs[0]['date'])); continue
        if len(a) != len(rs): cls['count differs'] += 1; det['count differs'].append(k + (len(rs), len(a)))
        r, x = rs[0], a[0]
        bal_b = cents(r.get('balance') if r.get('balance') not in (None, '') else r.get('openBalance')); bal_a = int(x['openBalanceCents'])
        amt_b = cents(r['amount']); amt_a = int(x['amountCents'])
        if bal_b != bal_a or amt_b != amt_a: cls['amount/balance differs'] += 1; det['amount/balance differs'].append(k + (amt_b, amt_a, bal_b, bal_a, r['date']))
        bb, ba = BMAP[r['bucket']], x['bucket']
        if bb != ba:
            typ = x['transactionType']; d = x['date'][:10]
            why = 'INTENDED: credit dated on the as-of date -> Current (S1-R5a)' if (ba == 'current' and d == '2026-11-12' and typ in ('Credit Memo', 'Deposit', 'Vendor Credit')) else 'CHECK: bucket moved'
            cls[why] += 1; det[why].append(k + (bb, ba, typ, x['date'], x['dueDate'], x.get('daysPastDue')))
        else: cls['same'] += 1
    for k, rs in ad.items():
        if k in bd: continue
        excl = k[1].startswith('ZZAUTOTEST') and k[1] not in bparties
        key = 'new after: ZZAUTOTEST party created after the snapshot (excluded)' if excl else 'new after: other'
        cls[key] += len(rs)
        if not excl: det[key].append(k + (rs[0]['bucket'], rs[0]['openBalanceCents'], rs[0]['date'], rs[0]['transactionType']))
    summary[side] = dict(cls)
    out.append(f'## {side} Detail: before {len(B)} documents, after {len(A)}')
    for c, n in cls.most_common(): out.append(f'- {c}: {n}')
    for c, items in det.items():
        out.append(f'### {side} — {c} ({len(items)})')
        out += ['  ' + ' | '.join(map(str, i)) for i in items[:400]]
open(f'{OUT}/COMPARISON.md', 'w').write('# Staging before (06:46Z) vs after (13:44Z), as of 12 Nov 2026 — document level\n\n' + '\n'.join(out) + '\n')
print(json.dumps(summary, indent=1))
