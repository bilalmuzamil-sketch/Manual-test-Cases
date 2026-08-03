#!/usr/bin/env python3
"""V-10 SECOND SWEEP: enumerations that close a list WITHOUT the Rule-42 trigger words.
Catches "these ten columns", "offers N options:", "the four X are:", "and no others",
"reads:" verbatim strings, "labeled A, B, C and D". READ-ONLY."""
import json, re

LIVE = json.load(open('/tmp/vf/live-cases.json'))
SECS = {s['id']: s['name'] for s in json.load(open('/tmp/vf/sections.json'))}
OURS = [c for c in LIVE if c['created_by'] == 3]
NUMWORD = r'(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)'
PATS = [
    (rf'\bthese {NUMWORD}\b', 'these N ...'),
    (rf'\b(offers|holds|lists|shows|has|contains|carries|displays) (these |the )?{NUMWORD}\b', 'offers N'),
    (r'\band no others?\b', 'and no others'),
    (r'\bnothing more\b', 'nothing more'),
    (r'\breads?:\s*"', 'reads: "verbatim"'),
    (r'\bnamed:?\s*"', 'named "verbatim"'),
    (r'\blabel(ed|led)?(\s+in\s+\w+\s+order)?:\s*"', 'labeled "verbatim"'),
    (r'\bthe (following|complete) (list|set|columns|options|items)\b', 'the following list'),
]
VERSION_PIN = re.compile(r'(spec v\d+|v\d+ \d{4}-\d\d-\d\d|v-\d{4}-\d\d-\d\d)')

known = set()  # cases already caught by pass 1
try:
    known = {r['case_id'] for r in json.load(open('/tmp/vf/r42-rederived.json'))}
except Exception:
    pass

out = []
for c in OURS:
    txt = {'title': c.get('title') or '', 'preconds': c.get('custom_preconds') or '',
           'steps': c.get('custom_steps') or '', 'expected': c.get('custom_expected') or ''}
    hits = []
    for fn, t in txt.items():
        for sent in re.split(r'(?<=[.;])\s+|\n', t):
            for p, lab in PATS:
                if re.search(p, sent, re.I):
                    hits.append((fn, lab, sent.strip()))
                    break
    if hits:
        out.append((c, hits))

print(f'BROAD sweep matched {len(out)} of {len(OURS)}; NEW (not in pass 1): '
      f'{sum(1 for c,_ in out if c["id"] not in known)}')
for c, hits in sorted(out, key=lambda x: x[0]['id']):
    new = c['id'] not in known
    pinned = bool(VERSION_PIN.search(c.get('refs') or ''))
    print('=' * 100)
    print(f'C{c["id"]}  [{SECS[c["section_id"]]}]  {"NEW" if new else "dup"}  specPIN={"Y" if pinned else "N"}')
    print(f'  {c["title"]}')
    print(f'  refs: {(c.get("refs") or "")[:200]}')
    for fn, lab, s in hits[:6]:
        print(f'   - ({fn}/{lab}) {s[:260]}')
