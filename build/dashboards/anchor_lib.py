import re
SRC="build/dashboards/sources/CONFLUENCE-788430850-Dashboard-v1-2026-09-22.md"
def load_anchors():
    d={}; pat=re.compile(r'^- \*\*(S\d+-[RNE]\d+):\*\* (.*)$')
    for line in open(SRC,encoding='utf-8'):
        m=pat.match(line.rstrip('\n'))
        if m:
            if m.group(1) in d: raise SystemExit("DUP "+m.group(1))
            d[m.group(1)]=m.group(2).rstrip()
    return d
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
ANCH=load_anchors()
