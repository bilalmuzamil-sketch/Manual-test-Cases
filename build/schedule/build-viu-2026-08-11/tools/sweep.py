#!/usr/bin/env python3
"""Sweep ALL 174 live Schedule cases for QUOTED UI labels and diff each against the
build vocabulary harvested this run. Labels only - nothing here touches an
expectation (Rule 57)."""
import json,re,collections,difflib
CASES=json.load(open('/tmp/sched_live.json'))
V=json.load(open('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence/vocab-by-surface.json'))
vocab=set(); origin={}
for surf,items in V.items():
    for s in items:
        vocab.add(s); origin.setdefault(s,set()).add(surf)
# When the SAME label exists both as raw markup and as a CSS-uppercased innerText
# copy, prefer the RAW form: textContent is the label the product actually ships,
# innerText merely reflects text-transform. Proven this run - the raw nodes read
# 'Filter & display' and 'View options' while innerText read them in all caps.
low={}
for v in sorted(vocab, key=lambda x:(x.isupper(), x)):
    low.setdefault(v.lower(), v)
FIELDS=('title','custom_preconds','custom_steps','custom_expected')
# quoted UI labels: 'Foo Bar' or "Foo Bar"
Q=re.compile(r"[‘']([A-Z][A-Za-z0-9 &/–—\-\.\+#]{1,44})[’']|\"([A-Z][A-Za-z0-9 &/–—\-\.\+#]{1,44})\"")
# prose words that mean the extraction caught a sentence, not a label
BAD=re.compile(r'\b(the|and|that|which|when|then|with|from|this|there|should|must|does|are|is)\b',re.I)
found=collections.defaultdict(lambda: collections.defaultdict(set))
for c in CASES:
    for f in FIELDS:
        t=c.get(f) or ''
        for m in Q.finditer(t):
            lab=(m.group(1) or m.group(2) or '').strip()
            if not lab or BAD.search(lab): continue
            if len(lab.split())>6: continue
            found[lab][c['id']].add(f)
rows=[]
for lab,cs in found.items():
    if lab in vocab: v,b='EXACT',lab
    elif lab.lower() in low: v,b='CASE',low[lab.lower()]
    else:
        cont=[x for x in vocab if lab.lower() in x.lower()]
        if cont: v,b='EXACT-IN-CONTEXT',sorted(cont,key=len)[0]
        else:
            m=difflib.get_close_matches(lab,list(vocab),n=1,cutoff=0.78)
            v,b=('VARIANT',m[0]) if m else ('NOT-ON-HARVESTED-SURFACES',None)
    rows.append({'label':lab,'verdict':v,'build':b,
                 'surfaces':sorted(origin.get(b,[])) if b else [],
                 'cases':{str(k):sorted(vv) for k,vv in sorted(cs.items())}})
order={'CASE':0,'VARIANT':1,'EXACT-IN-CONTEXT':2,'NOT-ON-HARVESTED-SURFACES':3,'EXACT':4}
rows.sort(key=lambda r:(order[r['verdict']],-len(r['cases'])))
json.dump({'vocab':len(vocab),'labels':len(rows),'rows':rows},
          open('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence/sweep.json','w'),indent=1)
c=collections.Counter(r['verdict'] for r in rows)
print('quoted labels found across 174 cases:',len(rows))
print('verdicts:',dict(c))
print()
print('### MISMATCHES THAT NEED A CORRECTION (CASE / VARIANT) ###')
for r in rows:
    if r['verdict'] in ('CASE','VARIANT'):
        ids=', '.join(f"C{k}({'/'.join(f.replace('custom_','') for f in v)})" for k,v in r['cases'].items())
        print(f"  {r['verdict']:8} {r['label']!r:34} -> BUILD {r['build']!r:34} | {ids}")
