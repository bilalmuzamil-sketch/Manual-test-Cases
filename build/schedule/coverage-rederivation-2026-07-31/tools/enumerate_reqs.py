#!/usr/bin/env python3
"""Phase 1 - enumerate EVERY atomic statement in Schedule spec v23.

Parse rules (documented so the parse is auditable, Rule 17):
  * Body starts at the first '### ' heading and ends at end of file.
  * Section = '### N. Title'; subsection = '#### N.M Title'. Statements are
    attributed to the deepest heading in force.
  * Unit types:
      - BULLET: each top-level '- ' list item (continuation lines folded in)
      - TABLEROW: each data row of a markdown table (header + separator skipped)
      - PROSE: each sentence of a non-list, non-table paragraph, split on
        sentence-final punctuation followed by a capital/quote, with abbreviation
        and decimal-number guards.
  * Every non-blank body line lands in exactly one unit -> line accounting proves
    completeness (printed at the end: lines consumed == non-blank body lines).
"""
import json, re, sys, pathlib

SPEC = pathlib.Path('build/schedule/spec-current-2026-07-31/Schedule-spec-current.md')
OUT  = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31/requirements-enumerated.json')

lines = SPEC.read_text().split('\n')
start = next(i for i, l in enumerate(lines) if l.startswith('### 1. Overview'))
body = lines[start:]

units = []
sec = subsec = None
i = 0
consumed = 0

def sec_key():
    return subsec or sec

def sentences(text):
    # protect known abbreviations / decimals / e.g.
    prot = text
    NUL = chr(0)
    prot = re.sub(r'\be\.g\.', 'e' + NUL + 'g' + NUL, prot)
    prot = re.sub(r'\bi\.e\.', 'i' + NUL + 'e' + NUL, prot)
    prot = re.sub(r'(\d)\.(\d)', lambda m: m.group(1) + NUL + m.group(2), prot)
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z"“(])', prot)
    return [p.replace(NUL, '.').strip() for p in parts if p.strip()]

while i < len(body):
    line = body[i]
    s = line.strip()
    if not s or s == '---':
        i += 1
        continue
    consumed += 1
    m = re.match(r'^### (\d+)\.\s+(.*)$', s)
    if m:
        sec, subsec = m.group(1), None
        i += 1; continue
    m = re.match(r'^#### (\d+\.\d+)\s+(.*)$', s)
    if m:
        subsec = m.group(1)
        i += 1; continue
    # table
    if s.startswith('|'):
        tbl = []
        while i < len(body) and body[i].strip().startswith('|'):
            tbl.append(body[i].strip()); i += 1
        consumed += len(tbl) - 1
        for r_i, row in enumerate(tbl):
            cells = [c.strip() for c in row.strip('|').split('|')]
            if r_i == 0 or set(''.join(cells)) <= set('-: '):
                continue
            if not any(cells):
                continue
            units.append(dict(section=sec_key(), kind='TABLEROW',
                              text=' — '.join(c for c in cells if c)))
        continue
    # bullet (fold continuation lines)
    if s.startswith('- '):
        buf = [s[2:]]
        i += 1
        while i < len(body):
            nx = body[i].strip()
            if not nx or nx.startswith('- ') or nx.startswith('|') or nx.startswith('#') or nx == '---':
                break
            buf.append(nx); i += 1; consumed += 1
        units.append(dict(section=sec_key(), kind='BULLET', text=' '.join(buf)))
        continue
    # numbered list item -> treat as bullet
    if re.match(r'^\d+\.\s', s):
        units.append(dict(section=sec_key(), kind='BULLET', text=re.sub(r'^\d+\.\s*', '', s)))
        i += 1; continue
    # prose paragraph
    buf = [s]
    i += 1
    while i < len(body):
        nx = body[i].strip()
        if not nx or nx.startswith('- ') or nx.startswith('|') or nx.startswith('#') or nx == '---' or re.match(r'^\d+\.\s', nx):
            break
        buf.append(nx); i += 1; consumed += 1
    for sent in sentences(' '.join(buf)):
        units.append(dict(section=sec_key(), kind='PROSE', text=sent))
    continue

# assign ids
from collections import Counter
cnt = Counter()
for u in units:
    cnt[u['section']] += 1
    u['id'] = 'R-%s-%02d' % (u['section'], cnt[u['section']])

nonblank = sum(1 for l in body if l.strip() and l.strip() != '---')
print('non-blank body lines:', nonblank, '| lines consumed:', consumed,
      '| MATCH' if nonblank == consumed else '| MISMATCH')
print('units:', len(units))
for k in sorted(cnt, key=lambda s: [int(x) for x in s.split('.')]):
    print('  §%s: %d' % (k, cnt[k]))
OUT.write_text(json.dumps(units, indent=1))
print('wrote', OUT)
