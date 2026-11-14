#!/usr/bin/env python3
"""Mirror update_v13.py in the local copies (retired cases relabelled too, as the v12 update did locally): cases/cases.json, cases/CASES.md, tools/inventory.py, tools/check.py."""
import json, re, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
PRD = open(os.path.join(R, 'sources', 'PRD-947650561-v13-2026-11-14.md')).read()
S5R10B = re.search(r'^- \*\*S5-R10b:\*\* (.*)$', PRD, re.M).group(1).strip()
def labels(t):
    t = t.replace('PRD v12 (Confluence 947650561', 'PRD v13 (Confluence 947650561')
    t = t.replace('(Confluence 947650561) v12, 12 Nov 2026', '(Confluence 947650561) v13, 13 Nov 2026')
    t = t.replace('PRD v12, ', 'PRD v13, ')
    return t.replace('Confluence 947650561, version 12 (12 Nov 2026, Milos Vasic), read 12 Nov 2026',
                     'Confluence 947650561, version 13 (13 Nov 2026, Chris Ward), read 14 Nov 2026')
OLD = '; the A/R and A/P Report Sorting PRD v13 (Confluence 947650561) is silent on it.'
NEW = '; the A/R and A/P Report Sorting PRD v13 (Confluence 947650561), 13 Nov 2026, S5-R10b, keeps it, quoted: \u201c' + S5R10B + '\u201d'
STAMP = re.compile(r'Last checked against build [^"\n]*?on \d+/\d+/\d{4}\.')
NSTAMP = 'Last checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026.'
# cases.json
p = os.path.join(R, 'cases', 'cases.json'); L = json.load(open(p)); n = 0
for c in L:
    key = c.get('id')
    if c.get('status') == 'DELETED': continue
    s0 = json.dumps(c, ensure_ascii=False); c2 = json.loads(labels(s0))
    if key in ('V1R-07', 'V1R-08'):
        i = c2['expected'].index(''); assert c2['expected'][i + 1].startswith('EXPECT FAIL'); c2['expected'] = c2['expected'][:i]
        assert c2['provenance'].count(OLD) == 1; c2['provenance'] = STAMP.sub(NSTAMP, c2['provenance'].replace(OLD, NEW))
        assert c2['marker'] == 'AUTOMATION: READY - EXPECT FAIL (SV-12545)'; c2['marker'] = 'AUTOMATION: READY'
        assert c2['status'] == 'POSSIBLY LOST'; c2['status'] = 'KEPT'
    if json.dumps(c2, ensure_ascii=False) != s0: c.clear(); c.update(c2); n += 1
json.dump(L, open(p, 'w'), indent=1, ensure_ascii=False); open(p, 'a').write('\n')
print('cases.json entries changed:', n)
# CASES.md (already done when ONLY_JSON=1)
if os.environ.get('ONLY_JSON') != '1':
  p = os.path.join(R, 'cases', 'CASES.md'); md = open(p).read(); parts = re.split(r'(?m)^(?=## )', md); m = 0
  for k, sec in enumerate(parts):
      hd = sec.split('\n', 1)[0]
      s = labels(sec)
      if re.match(r'## V1R-0[78] ', hd):
          s, a = re.subn(r'\n\nEXPECT FAIL\..*?Put it in the Defects field when you mark this test FAILED\.', '', s, flags=re.S)
          b = s.count(OLD); s = STAMP.sub(NSTAMP, s.replace(OLD, NEW))
          c_ = s.count('AUTOMATION: READY - EXPECT FAIL (SV-12545)'); s = s.replace('AUTOMATION: READY - EXPECT FAIL (SV-12545)', 'AUTOMATION: READY')
          d = s.count('· 🔴 POSSIBLY LOST'); s = s.replace('· 🔴 POSSIBLY LOST', '· KEPT')
          assert (a, b, c_, d) == (1, 1, 1, 1), (hd, a, b, c_, d)
      if s != sec: parts[k] = s; m += 1
  open(p, 'w').write(''.join(parts)); print('CASES.md sections changed:', m)
# tools
p = os.path.join(R, 'tools', 'inventory.py'); t = open(p).read()
t = t.replace('(Confluence 947650561) v12, 12 Nov 2026', '(Confluence 947650561) v13, 13 Nov 2026').replace('PRD v12, <section>', 'PRD v13, <section>')
open(p, 'w').write(t)
p = os.path.join(R, 'tools', 'check.py'); t = open(p).read()
t = t.replace('PRD-947650561-v12-2026-11-12.md', 'PRD-947650561-v13-2026-11-14.md').replace('PRD v12', 'PRD v13')
open(p, 'w').write(t)
