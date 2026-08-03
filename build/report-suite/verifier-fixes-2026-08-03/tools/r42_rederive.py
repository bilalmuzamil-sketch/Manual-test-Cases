#!/usr/bin/env python3
"""V-10 re-derivation (Rule 42): find every ACTIVE case that closes a list, and
report whether its refs carry a VERSION-PINNED anchor.

READ-ONLY. Reads the live snapshot /tmp/vf/live-cases.json (ours only, created_by==3).

Rule 42(a) pin = the refs must contain a spec version/date token so a change to the
governing requirement re-surfaces the case: "spec v<N> <date>" or "v-<date>" or a
bare ISO date next to the spec name.
"""
import json, re, sys, csv

LIVE = json.load(open('/tmp/vf/live-cases.json'))
SECS = {s['id']: s for s in json.load(open('/tmp/vf/sections.json'))}
OURS = [c for c in LIVE if c['created_by'] == 3]

TRIGGERS = [
    (r'\bexactly\b', 'exactly'),
    (r'\bonly these\b', 'only these'),
    (r'\bno other\b', 'no other'),
    (r'\bthe complete list\b', 'the complete list'),
    (r'\bin order,? are\b', 'in order are'),
    (r'\bin this exact order\b', 'in this exact order'),
    (r'\bin this order\b', 'in this order'),
    (r'\bnothing else\b', 'nothing else'),
    (r'\bnone other\b', 'none other'),
]

# adverbial / non-enumerating uses of "exactly" that do NOT close a list
ADVERBIAL = re.compile(
    r'exactly (once|twice|one|two|three|four|five|six|seven|eight|nine|ten|\d+|the same|matching|match|as|what|where|when|how|why|this|that|it|equal|zero|null|-)',
    re.I)

VERSION_PIN = re.compile(r'(spec v\d+|v\d+ \d{4}-\d\d-\d\d|v-\d{4}-\d\d-\d\d|\bv\d+\b[^)]{0,20}\d{4}-\d\d-\d\d|\d{4}-\d\d-\d\d)')

def fields(c):
    return {
        'title': c.get('title') or '',
        'preconds': c.get('custom_preconds') or '',
        'steps': c.get('custom_steps') or '',
        'expected': c.get('custom_expected') or '',
    }

rows = []
for c in OURS:
    f = fields(c)
    hits = []
    for fname, text in f.items():
        for sent in re.split(r'(?<=[.;])\s+|\n', text):
            for pat, label in TRIGGERS:
                if re.search(pat, sent, re.I):
                    if label == 'exactly' and ADVERBIAL.search(sent):
                        # still a closed list if it ALSO enumerates with a colon list
                        if not re.search(r'exactly[^.]{0,40}:', sent, re.I):
                            continue
                    hits.append((fname, label, sent.strip()))
    if hits:
        refs = c.get('refs') or ''
        rows.append({
            'case_id': c['id'],
            'section': SECS[c['section_id']]['name'],
            'title': c['title'],
            'pinned': bool(VERSION_PIN.search(refs)),
            'refs': refs,
            'hits': hits,
        })

rows.sort(key=lambda r: r['case_id'])
print(f'TRIGGER-MATCHED CASES: {len(rows)} of {len(OURS)} active')
print(f'  of those, refs has NO version pin: {sum(1 for r in rows if not r["pinned"])}')
print()
for r in rows:
    print('=' * 100)
    print(f'C{r["case_id"]}  [{r["section"]}]  PIN={"YES" if r["pinned"] else "NO "}')
    print(f'  title: {r["title"]}')
    print(f'  refs : {r["refs"]}')
    for fname, label, sent in r['hits']:
        print(f'   - ({fname}/{label}) {sent[:400]}')

with open('/tmp/vf/r42-rederived.json', 'w') as fh:
    json.dump(rows, fh, indent=1)
