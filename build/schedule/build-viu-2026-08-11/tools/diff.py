#!/usr/bin/env python3
"""Classify each asserted string against the harvested build vocabulary.
EXACT   - present verbatim
CASE    - present but capitalisation differs
VARIANT - a near neighbour exists under different words
ABSENT  - no neighbour found on the surfaces harvested so far
Nothing here decides an EXPECTATION (Rule 57) - labels only."""
import json,sys,collections,re,glob,difflib

lab=json.load(open('/home/user/Manual-test-Cases/build/schedule/build-verify-2026-08-11/evidence/labels.json'))
vocab=set(); testids={}
for f in sorted(glob.glob('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence/*dump*.json')):
    d=json.load(open(f)); u=d.get('dump') or d
    for k in ('texts','buttons','headers','aria','placeholders'):
        for t in u.get(k,[]) or []:
            t=(t or '').strip()
            if t: vocab.add(t)
    for t in u.get('testids',[]) or []:
        if t.get('id'): testids[t['id']]=t.get('text','')
        for v in (t.get('text'),t.get('label')):
            if v and v.strip(): vocab.add(v.strip())
    bt=u.get('body_text') or ''
    for line in bt.split('\n'):
        line=line.strip()
        if line: vocab.add(line)

low={v.lower():v for v in vocab}
byl=collections.defaultdict(lambda:{'cases':set(),'fields':set()})
for r in lab:
    byl[r['label']]['cases'].add(r['case']); byl[r['label']]['fields'].add(r['field'])

# placeholder-bearing assertions (N, M, X, Y, ellipsis) can't be matched literally
PH=re.compile(r'\b[NMXY]\b|…|\bN\b')
rows=[]
for l,v in byl.items():
    verdict=None; found=None
    if l in vocab: verdict='EXACT'; found=l
    elif l.lower() in low: verdict='CASE'; found=low[l.lower()]
    else:
        # substring containment either way (a label inside a longer rendered string)
        cont=[x for x in vocab if l.lower() in x.lower()]
        if cont: verdict='EXACT-IN-CONTEXT'; found=sorted(cont,key=len)[0]
        else:
            m=difflib.get_close_matches(l,list(vocab),n=1,cutoff=0.75)
            if m: verdict='VARIANT'; found=m[0]
            else: verdict='ABSENT'; found=None
    rows.append({'label':l,'verdict':verdict,'build':found,
                 'cases':sorted(v['cases']),'fields':sorted(v['fields']),
                 'placeholder':bool(PH.search(l))})
order={'ABSENT':0,'VARIANT':1,'CASE':2,'EXACT-IN-CONTEXT':3,'EXACT':4}
rows.sort(key=lambda r:(order[r['verdict']],-len(r['cases'])))
json.dump({'vocab_size':len(vocab),'testid_count':len(testids),'rows':rows},
          open('/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence/diff.json','w'),indent=1)
c=collections.Counter(r['verdict'] for r in rows)
print('vocab strings harvested:',len(vocab),'| test-ids:',len(testids))
print('verdicts:',dict(c),'| total',sum(c.values()))
print()
for r in rows:
    if r['verdict'] in ('ABSENT','VARIANT','CASE'):
        ph=' [placeholder]' if r['placeholder'] else ''
        print(f"{r['verdict']:16} {r['label']!r:60} -> {r['build']!r}  cases={r['cases']}{ph}")
