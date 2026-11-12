"""Explain the before/after differences found by compare.py: (1) bucket moves recomputed in calendar days at each
document's own location time zone (S1-R5a); (2) new documents: created after the 06:46Z snapshot?; (3) missing A/P
documents: what the vendor's own unpaid list says now. Read-only."""
import csv, json, sys, datetime, subprocess
from zoneinfo import ZoneInfo
AFT = '1-six-reports/all rows from the data calls'
rd = lambda p: list(csv.DictReader(open(p), delimiter='\t'))
W = {w['id']: (w['name'], w['timezone']) for w in json.load(open('/tmp/staging/workplaces.json'))['data']['collection']}
AS = datetime.date(2026, 11, 12)
def bucket(d): return 'current' if d <= 0 else 'days_1_to_30' if d <= 30 else 'days_31_to_60' if d <= 60 else 'days_61_to_90' if d <= 90 else 'days_91_plus'
moved = ['P3-2458','P3-2459','P3-2460','CM3-4538','S3-39986','S3-39987','P3-2461','P3-2462','P3-2463','CM3-4539','S3-40012','S3-40013','S2-17154','S2-16836','S3-17149','S3-17238','S3-17147','S3-17148']
A = {r['documentNumber']: r for r in rd(f'{AFT}/AR Aging Detail - all documents.tsv')}
print('== bucket moves, recomputed at the location time zone')
for n in moved:
    r = A[n]; name, tz = W.get(r['workplaceId'], ('?', None))
    due = datetime.datetime.fromisoformat(r['dueDate'].replace('Z', '+00:00')).astimezone(ZoneInfo(tz)).date() if tz else None
    pd = (AS - due).days if due else None
    utcpd = (AS - datetime.datetime.fromisoformat(r['dueDate'].replace('Z', '+00:00')).date()).days
    print(f"{n} {name} tz={tz} due(local)={due} pastDue local={pd} app={r['daysPastDue']} -> {bucket(pd) if pd is not None else '?'} app={r['bucket']} {'MATCH' if pd is not None and bucket(pd)==r['bucket'] and str(pd)==r['daysPastDue'] else 'MISMATCH'} (UTC-day count {utcpd})")
print('== new documents (not in before) that are not ZZAUTOTEST-new: dated after 06:46Z?')
import re
cmp = open('COMPARISON.md').read()
for sec in ['A/R — new after: other', 'A/P — new after: other']:
    blk = cmp.split('### ' + sec)[1].split('\n### ')[0].strip().split('\n')[1:]
    dates = [l.split(' | ')[4] for l in blk]
    late = [d for d in dates if d >= '2026-11-12T06:46']
    print(sec, len(blk), 'dated after 06:46Z:', len(late), '; earlier:', [l.strip()[:120] for l in blk if l.split(' | ')[4] < '2026-11-12T06:46'])
