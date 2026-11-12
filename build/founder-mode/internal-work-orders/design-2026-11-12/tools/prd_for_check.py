#!/usr/bin/env python3
"""Builds render/prd-for-check.md, the INPUT file of build/testing-tools/spec_to_design_check.py, from the saved PRD
(../sources/CONFLUENCE-942243841-read-2026-11-12.md). The tool's logic is not changed; only its input is prepared:
 1. Markdown escapes removed (\\[ \\] \\* \\_ \\>), and [placeholder] written {placeholder}, the placeholder form the tool expects.
 2. On every requirement line ("- **S#-R#:**"), the straight double quotes are paired in order and written as curly quotes:
    the 1st, 3rd, 5th ... as “ and the 2nd, 4th, 6th ... as ”. The words inside the quotes are unchanged, so every key
    "<code>|<words>" of a real quoted label is the same as before.
Why (2): the tool finds quotes with [“"]([^”"]{2,90})[”"]. When a quoted sentence is longer than 90 characters the match fails at its
opening quote, the scan moves on, and the long quote's CLOSING quote then starts a match that runs to the next quote's OPENING quote,
so prose between two quotes (" (with ", " when it is not (Closed · No Charge ...). Buttons: Cancel and ") was reported as PRD words.
With curly pairs a closing ” cannot start a match, so only real quoted strings are compared. Each line's straight-quote count is
checked to be even first (a line with an odd count is left as it is and reported).  python3 -I tools/prd_for_check.py"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.normpath(os.path.join(ROOT, '..', 'sources', 'CONFLUENCE-942243841-read-2026-11-12.md'))
OUT = os.path.join(ROOT, 'render', 'prd-for-check.md')
out, odd, paired = [], [], 0
for ln in open(SRC, encoding='utf-8').read().split('\n'):
    ln = ln.replace('\\[', '[').replace('\\]', ']').replace('\\*', '*').replace('\\_', '_').replace('\\>', '>')
    ln = re.sub(r'\[([^\]]+)\]', r'{\1}', ln)
    if re.match(r'- \*\*(S\d+-[RNE]\d+[a-z]?):\*\*', ln):
        if ln.count('"') % 2: odd.append(ln[:40])
        else:
            parts = ln.split('"'); ln = parts[0]
            for i, p in enumerate(parts[1:]):
                ln += ('“' if i % 2 == 0 else '”') + p
            paired += 1
    out.append(ln)
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print('requirement lines paired:', paired, '; odd quote count (left as they were):', odd)
