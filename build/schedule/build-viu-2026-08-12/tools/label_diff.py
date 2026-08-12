#!/usr/bin/env python3
"""label_diff.py — diff every UI label QUOTED in the 176 Schedule cases against
the strings actually harvested from build v3.5-65d6500.

Two rules carried over from the 2026-08-11 pass, both learned the hard way:

 1. Compare against the RAW TEXT NODE, not the painted string.  These panels use
    CSS text-transform, so the screen shows FILTER & DISPLAY while the build
    stores `Filter & display`.

 2. PREFER THE VISIBLE TEXT NODE OVER THE ACCESSIBLE NAME.  The toolbar button
    carries aria-label="Filter and display options", so a naive containment
    check certifies wording no manual tester can ever see.  A label found ONLY
    in an aria-label or a data-test-id is reported as Aria-only, never as OK.
"""
import json, re, sys, unicodedata

CASES = json.load(open('/tmp/sched/live-cases.json'))
H = json.load(open('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/evidence/harvest.json'))

def strip_transform(s):
    return s.split(chr(0))[0]

VIS = set(strip_transform(t) for t in H['text'])
VIS_LOWER = {v.lower(): v for v in VIS}
VIS_BLOB = '\n'.join(VIS)
VIS_BLOB_L = VIS_BLOB.lower()
ARIA_BLOB = ('\n'.join(H['arias']) + '\n' + '\n'.join(H['placeholders']) + '\n' + '\n'.join(H['testids'])).lower()

# Labels appear in the case text inside single quotes.  Skip anything that is
# plainly not a UI string (our own test data, placeholders, sentences).
SKIP = re.compile(r'(ZZAUTOTEST|^\d|^[a-z] |N Lines|^\s*$)', re.I)

def quoted(text):
    return re.findall(r"'([^']{2,60})'", text or '')

rows = []
for c in sorted(CASES, key=lambda x: x['id']):
    labels = []
    for f in ('title', 'custom_preconds', 'custom_steps', 'custom_expected'):
        labels += quoted(c.get(f) or '')
    seen = []
    for l in labels:
        l = l.strip()
        if not l or SKIP.search(l) or l in seen:
            continue
        seen.append(l)
    for l in seen:
        ll = l.lower()
        if l in VIS:
            verdict = 'OK-exact'
            found = l
        elif ll in VIS_LOWER:
            verdict = 'CASING'
            found = VIS_LOWER[ll]
        elif ll in VIS_BLOB_L:
            verdict = 'OK-substring'
            found = ''
        elif ll in ARIA_BLOB:
            verdict = 'ARIA-ONLY'
            found = ''
        else:
            verdict = 'NOT-FOUND'
            found = ''
        rows.append({'case': c['id'], 'title': c['title'][:70], 'label': l,
                     'verdict': verdict, 'build': found})

json.dump(rows, open('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/evidence/label-diff.json', 'w'), indent=1)

from collections import Counter
print('labels checked:', len(rows), Counter(r['verdict'] for r in rows))
print()
for v in ('CASING', 'ARIA-ONLY', 'NOT-FOUND'):
    hits = [r for r in rows if r['verdict'] == v]
    if not hits: continue
    print('=' * 72); print(v, '-', len(hits))
    for r in hits:
        print('  C%-6d %-42s %s' % (r['case'], repr(r['label'])[:42], ('-> ' + repr(r['build'])) if r['build'] else ''))
