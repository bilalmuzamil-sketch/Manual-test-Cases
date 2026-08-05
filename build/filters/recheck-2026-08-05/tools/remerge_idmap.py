#!/usr/bin/env python3
"""Re-merge the C-ids and the refs column into testrail-id-map.csv after a gen_import rerun.

gen_import.py rewrites the id-map with BLANK testrail_case_id and WITHOUT the refs column
(the documented gotcha). Both are restored here from LIVE TestRail, which is authoritative.
"""
import csv, json, io, os
ROOT = '/home/user/Manual-test-Cases'
P = os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv')
LIVE = json.load(open('/tmp/frc/snap/live-cases-AFTER.json'))
by_title = {}
for c in LIVE.values():
    by_title.setdefault(c['title'], []).append(c)

rows = list(csv.DictReader(open(P)))
out, unmatched, ambiguous = [], [], []
for r in rows:
    hits = by_title.get(r['title'], [])
    if len(hits) != 1:
        (ambiguous if hits else unmatched).append(r['internal_id']); out.append(r); continue
    c = hits[0]
    out.append({'internal_id': r['internal_id'], 'testrail_case_id': 'C%d' % c['id'],
                'title': c['title'], 'section': r['section'], 'refs': c.get('refs') or ''})
assert not unmatched and not ambiguous, f'unmatched={unmatched} ambiguous={ambiguous}'
buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=['internal_id', 'testrail_case_id', 'title', 'section', 'refs'],
                   lineterminator='\n')
w.writeheader(); w.writerows(out)
open(P, 'w').write(buf.getvalue())
print('id-map re-merged:', len(out), 'rows | blanks:',
      sum(1 for r in out if not r['testrail_case_id']), '| refs populated:',
      sum(1 for r in out if r['refs']))
