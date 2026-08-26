#!/usr/bin/env python3
"""Per-anchor HELD-vs-LIVE text for the changed requirements + the citing C-ids.
Writes the FULL text to a file; prints only a truncated view."""
import json,os,sys,html,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from verify import flatten, anchor_texts, live_body, held_body, R, OUT
code=sys.argv[1]; W=int(sys.argv[2]) if len(sys.argv)>2 else 150
slug,hslug,hver=R[code]
lx,lver,lmod=live_body(slug); la=anchor_texts(flatten(lx))
ha=anchor_texts(flatten(held_body(hslug,hver)))
res=json.load(open(os.path.join(OUT,f'{code}.json')))
det={}
for a in res['changed']+res['gone']:
    det[a]={'held':ha.get(a),'live':la.get(a),'cids':res['cites'].get(a,[])}
json.dump(det,open(os.path.join(OUT,f'{code}-changed-detail.json'),'w'),indent=1)
for a,d in det.items():
    h=' | '.join(d['held'] or []); l=' | '.join(d['live'] or [])
    print(f"\n--- {a}  cases={','.join(d['cids']) or 'NONE'}")
    print(f"  HELD v{hver}: {h[:W]}")
    print(f"  LIVE v{lver}: {l[:W]}")
