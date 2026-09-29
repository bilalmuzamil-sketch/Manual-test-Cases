#!/usr/bin/env python3
"""Turn a playwright --reporter=list run into a verdict per TestRail case.

🔴 A HELD CASE OR A "CANNOT JUDGE" MUST NEVER BECOME A PASS JUST BECAUSE THE TEST WENT GREEN.
Held tests assert only that the observation was recorded, so a green tick on one means "measured",
not "the product is correct". They are mapped to Blocked and their console line is carried into the
comment. The same goes for any test that printed CANNOT RUN or COULD NOT JUDGE before passing.
"""
import re, sys, json, collections
raw = re.sub(r'\x1b\[[0-9;]*m', '', open(sys.argv[1], encoding='utf8', errors='replace').read())
lines = raw.split('\n')

notes = collections.defaultdict(list)          # cid -> console lines mentioning it
for l in lines:
    m = re.match(r'^C(1462\d\d):\s*(.+)$', l.strip())
    if m: notes[m.group(1)].append(m.group(2).strip())

verdict = {}
for l in lines:
    m = re.match(r'^\s*(✓|✘)\s+\d+\s+(.*?)›\s*C(1462\d\d)\s*—\s*(.*)$', l)
    if not m: continue
    tick, _file, cid, title = m.group(1), m.group(2), m.group(3), m.group(4)
    held = 'HELD' in title
    n = notes.get(cid, [])
    unjudged = any(x.startswith(('CANNOT RUN', 'COULD NOT JUDGE')) for x in n)
    if held or unjudged:
        verdict[cid] = ('Blocked', title, n)
    else:
        verdict[cid] = ('Passed' if tick == '✓' else 'Failed', title, n)

out = {c: {'v': v, 'title': t, 'notes': n} for c, (v, t, n) in verdict.items()}
json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
tally = collections.Counter(v['v'] for v in out.values())
print(f"parsed {len(out)} cases: {dict(tally)}")
for c in sorted(out):
    if out[c]['v'] != 'Passed': print(f"  C{c} {out[c]['v']:8} {out[c]['title'][:70]}")
