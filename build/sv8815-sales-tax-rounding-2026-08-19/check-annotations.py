#!/usr/bin/env python3
"""Guard against the one annotation defect that ruins an exhibit: a label covering the value it
points at, or covering another label. Reproduces annotate.py's own label geometry, so it catches the
collision BEFORE the image is published. Run it on the annotation spec after generating it.

    python3 check-annotations.py /path/to/annspec.json
"""
import json, sys
from PIL import ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=ImageFont.truetype(F,20)

def rects(b):
    bx=(b['x']-4,b['y']-4,b['x']+b['w']+4,b['y']+b['h']+4)
    lb=None
    if b.get('label'):
        tw=f.getlength(b['label'])
        lx,ly=b.get('lx',0),b.get('ly',0)
        lb=(lx-8,ly-6,lx+tw+8,ly+30)
    return bx,lb

def overlaps(a,b):
    if not a or not b: return False
    return not (a[2]<=b[0] or b[2]<=a[0] or a[3]<=b[1] or b[3]<=a[1])

bad=0
for s in json.load(open(sys.argv[1])):
    name=s['dst'].split('/')[-1]
    R=[rects(b) for b in s['boxes']]
    probs=set()
    for i,(bi,li) in enumerate(R):
        for j,(bj,lj) in enumerate(R):
            if i<j and overlaps(li,lj): probs.add(f'label{i} overlaps label{j}')
            if overlaps(li,bj):         probs.add(f'label{i} covers box{j}')
    print(('FAIL ' if probs else 'ok   ')+name+((': '+'; '.join(sorted(probs))) if probs else ''))
    bad+=bool(probs)
print(f'\n{bad} exhibit(s) with a label covering a value or another label')
sys.exit(1 if bad else 0)
