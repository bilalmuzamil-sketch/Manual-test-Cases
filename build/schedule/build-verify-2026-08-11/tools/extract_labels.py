"""Extract every UI string the 174 Schedule cases assert, tagged by FIELD.

Field decides the CLASS of any mismatch (see CLASSIFICATION.md):
  Preconditions / Steps -> class A  (directions to a control; the build's wording wins)
  Expected Results      -> class B  if a numbered requirement pins the wording (spec wins)
                        -> class C  if merely describing what the tester sees (build wins)

Two harvest shapes, kept deliberately narrow so the output stays hand-checkable:
  'single-quoted'  and  "double-quoted"  and  `backticked`.
The Rule-54 provenance tail and the AUTOMATION marker are stripped first - they are
ours, not the build's, and must never be mistaken for a UI string.
"""
import json, re, collections

sc = json.load(open('/tmp/sched-bv/sched_cases.json'))
FIELDS = ['title', 'custom_preconds', 'custom_steps', 'custom_expected']

SINGLE  = re.compile(r"'([^'\n]{1,80})'")
DOUBLE  = re.compile(r'"([^"\n]{1,80})"')
BACKTIK = re.compile(r'`([^`\n]{1,80})`')

TAIL   = re.compile(r'\n-{3,}\n.*$', re.S)
MARKER = re.compile(r'\nAUTOMATION:.*$', re.S)

# possessives such as  the grid's  must not be harvested as a label
POSSESSIVE = re.compile(r"^s\b")

rows = []
for c in sc:
    for f in FIELDS:
        v = c.get(f) or ''
        if f == 'custom_expected':
            v = MARKER.sub('', TAIL.sub('', v))
        for rx in (SINGLE, DOUBLE, BACKTIK):
            for m in rx.finditer(v):
                s = m.group(1).strip()
                if not s or s.isdigit() or POSSESSIVE.match(s):
                    continue
                rows.append({'case': c['id'], 'section': c['section_id'],
                             'field': f, 'label': s})

json.dump(rows, open('/tmp/sched-bv/labels.json', 'w'), indent=1)
uniq = collections.Counter(r['label'] for r in rows)
print('label mentions:', len(rows))
print('distinct strings:', len(uniq))
cw = len({r['case'] for r in rows})
print('cases asserting >=1 quoted string:', cw, 'of', len(sc), '| asserting none:', len(sc)-cw)
print('by field:', dict(collections.Counter(r['field'] for r in rows)))
with open('/tmp/sched-bv/distinct_labels.txt','w') as fh:
    for s,n in uniq.most_common():
        fh.write(f'{n:4d}  {s}\n')
print('--- top 45 ---')
for s,n in uniq.most_common(45):
    print(f'  {n:3d}  {s}')
