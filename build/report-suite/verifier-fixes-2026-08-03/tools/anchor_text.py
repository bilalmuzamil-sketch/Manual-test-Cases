#!/usr/bin/env python3
"""Print the VERBATIM current-spec text of every anchor cited by a case's refs
(Rule 41 whole-case re-verification aid; Rule 25 verbatim citation). READ-ONLY.

Usage: anchor_text.py <C-id> [<C-id> ...]
       anchor_text.py --anchor SBR S14-R20
"""
import json, re, sys, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SPECDIR = os.path.join(ROOT, 'spec-current-2026-07-31')
FILES = {
    'SBC': 'Sales-By-Customer-Report-current.md',
    'SBR': 'Sales-By-Representative-Report-current.md',
    'PV': 'Parts-Velocity-Report-current.md',
    'TU': 'Technician-Utilization-Report-current.md',
    'WIP': 'Work-In-Progress-Report-current.md',
    'IV': 'Inventory-Value-Report-current.md',
}
SPECS = {k: open(os.path.join(SPECDIR, v)).read().splitlines() for k, v in FILES.items()}


def find(report, anchor):
    out = []
    pat = re.compile(r'\*\*' + re.escape(anchor) + r'[:.]?\*\*|\*\*' + re.escape(anchor) + r'\b')
    for i, line in enumerate(SPECS[report], 1):
        if pat.search(line):
            out.append((i, line.strip()))
    return out


def report_of(cid, live, secs):
    c = [x for x in live if x['id'] == cid][0]
    name = secs[c['section_id']]
    for k in ('SBC', 'SBR', 'PV', 'TU', 'WIP', 'IV'):
        if name.startswith(k + ' '):
            return k, c
    raise SystemExit('cannot map section ' + name)


if sys.argv[1] == '--anchor':
    for a in sys.argv[3:]:
        for ln, t in find(sys.argv[2], a) or [(0, 'NOT FOUND')]:
            print(f'{sys.argv[2]} {a} L{ln}: {t}')
    sys.exit()

live = json.load(open('/tmp/vf/live-cases.json'))
secs = {s['id']: s['name'] for s in json.load(open('/tmp/vf/sections.json'))}
for arg in sys.argv[1:]:
    cid = int(arg.lstrip('Cc'))
    rep, c = report_of(cid, live, secs)
    refs = c.get('refs') or ''
    anchors = sorted(set(re.findall(r'S\d+-(?:R\d+[a-z]?|N\d+|E\d+)', refs)))
    print('=' * 100)
    print(f'C{cid} [{rep}] {c["title"]}')
    print(f'  refs: {refs}')
    for a in anchors:
        hits = find(rep, a)
        if not hits:
            print(f'  !! {a}: NOT FOUND in current {rep} spec')
        for ln, t in hits:
            print(f'  {a} L{ln}: {t[:500]}')
