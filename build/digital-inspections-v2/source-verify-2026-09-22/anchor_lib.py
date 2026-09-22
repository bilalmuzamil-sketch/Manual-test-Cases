"""Parse verbatim requirement anchors from the DVI V2 live spec (Rule 113 fidelity)."""
import re, json, urllib.request, base64, html
SRC="build/digital-inspections-v2/sources/CONFLUENCE-768507905-live-2026-09-22.md"
def load_anchors():
    d={}
    pat=re.compile(r'^- \*\*(S\d+-[RNE]\d+):\*\* (.*)$')
    for line in open(SRC, encoding='utf-8'):
        m=pat.match(line.rstrip('\n'))
        if m:
            key,txt=m.group(1),m.group(2).rstrip()
            if key in d: raise SystemExit(f"DUPLICATE anchor {key}")
            d[key]=txt
    return d
def esc(s):
    # HTML-escape only &,<,> ; keep unicode quotes/dashes verbatim
    return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
ANCH=load_anchors()
if __name__=="__main__":
    import sys
    from collections import Counter
    secs=Counter(k.split('-')[0] for k in ANCH)
    print("total anchors:", len(ANCH))
    for s,n in sorted(secs.items(), key=lambda x:int(x[0][1:])):
        print(f"  {s}: {n}")
    # spot print requested
    for a in sys.argv[1:]:
        print(f"\n{a}: {ANCH.get(a,'<MISSING>')}")
