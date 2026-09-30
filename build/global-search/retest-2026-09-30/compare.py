#!/usr/bin/env python3
"""Compare tonight's re-run against the 29 September verdicts, for the 39 that were Failed.

Three questions, in order:
  1. Which of the 39 now PASS  -> fixed, propose Passed and say which ticket can be checked.
  2. Which still FAIL          -> confirm each one has an OPEN story defect against it.
  3. Which failed for a DATA reason rather than a product reason (a zero-row read with no
     positive control) -> NOT a product verdict. Rule 104: an instrument that measured nothing
     proves nothing, and a seeded record that has since been removed looks exactly like a fault.
"""
import json, sys, re, collections
old = json.load(open('build/global-search/staging-run-2026-09-29/VERDICTS.json'))['verdicts']
new = json.load(open(sys.argv[1]))
FAILED39 = {str(r['case_id']) for r in json.load(open('/tmp/failed39.json'))}

DATA_SMELL = re.compile(r'rows for .*: 0\b|NO DATA|no record|0 rows|NOT FOUND|could not find', re.I)

buckets = collections.defaultdict(list)
for cid in sorted(FAILED39):
    n = new.get(cid)
    if not n:
        buckets['not re-run'].append((cid, '', '')); continue
    notes = ' | '.join(n.get('notes', []))
    if n['v'] == 'Passed':
        buckets['now passes'].append((cid, n['title'], notes))
    elif DATA_SMELL.search(notes):
        buckets['no data to judge'].append((cid, n['title'], notes))
    elif n['v'] == 'Failed':
        buckets['still fails'].append((cid, n['title'], notes))
    else:
        buckets[n['v'].lower()].append((cid, n['title'], notes))

tickets = {c: (old.get(c, {}).get('tickets') or []) for c in FAILED39}
print(f'Re-ran {len([c for c in FAILED39 if c in new])} of the {len(FAILED39)} that were failing.\n')
for k in ['now passes', 'still fails', 'no data to judge', 'blocked', 'not re-run']:
    if not buckets[k]: continue
    print(f'== {k.upper()} : {len(buckets[k])} ==')
    for cid, title, notes in buckets[k]:
        tk = ','.join(tickets.get(cid) or []) or 'NO TICKET'
        print(f'  C{cid}  [{tk}]  {title[:74]}')
        if notes and k != 'now passes': print(f'         {notes[:150]}')
    print()
json.dump({k: v for k, v in buckets.items()}, open('build/global-search/retest-2026-09-30/buckets.json','w'), indent=1)
