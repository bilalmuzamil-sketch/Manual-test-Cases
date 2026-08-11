"""Re-derive the 82 label misses from LIVE TestRail text, PER FIELD.
Vocabulary = the union of every harvest taken on build v3.5-4795eee
(evidence/*.json + the committed build-verify evidence dir)."""
import json,re,os,sys
from collections import defaultdict
HERE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BV=os.path.join(os.path.dirname(HERE),'build-verify-2026-08-10','evidence')
EV=os.path.join(HERE,'evidence')
REP={'Work In Progress':'work-in-progress','Technician Utilization':'technician-utilization',
     'Sales By Customer Report':'sales-by-customer'}

def load_vocab(slug):
    words=set(); ids=set()
    files=[os.path.join(BV,'vocab-%s.json'%slug), os.path.join(EV,'vocab2-%s.json'%slug),
           os.path.join(EV,'vocab-rich-%s.json'%slug)]
    seen=0
    for f in files:
        if not os.path.exists(f): continue
        seen+=1
        d=json.load(open(f))
        b=d.get('base',{})
        for k in ('text','headers','tabs'):
            words|=set(b.get(k,[]))
        for h in b.get('headers',[]):
            for part in h.split('\n'): words.add(part.strip())
        for t in b.get('tabs',[]):
            words.add(re.sub(r'\s*\(\d+\)$','',t).strip())
            for part in t.split('\n'): words.add(part.strip())
        ids|=set(b.get('testids',[]))
        for k,v in d.get('menus',{}).items():
            if isinstance(v,str): continue
            for m in v:
                if isinstance(m,dict): words|=set(m.get('items',[]))
        r0=b.get('row0')
        if isinstance(r0,list): words|=set(map(str,r0))
    return {w.strip() for w in words if isinstance(w,str) and w.strip()}, ids, seen

VOCAB={}
for r,slug in REP.items():
    w,i,n=load_vocab(slug)
    VOCAB[r]=w; VOCAB[r+'|ids']=i
    print(f'{r}: {len(w)} vocabulary strings from {n} harvest file(s)')

GEN={'Reports','Work Orders','Customers','Parts','Schedule','Search','Clock In','Export Reports'}
q=re.compile(r'"([^"\n]{2,70})"')
IGNORE=re.compile(r'^[\$\d\.,%\-\s]*$|^https?:|Network|No throttling|Slow 3G|Offline|Accessibility|^\(N\)$|^N/A$')
FIELDS=[('title','title'),('preconds','custom_preconds'),('steps','custom_steps'),('expected','custom_expected')]

cases=json.load(open('/tmp/lb_225.json'))
rows=[]
for c in cases:
    rep=c['_secpath'].split(' / ')[1]
    v=VOCAB[rep]
    per={}
    for label,key in FIELDS:
        txt=c.get(key) or ''
        miss=[]
        for s in sorted(set(q.findall(txt))):
            s=s.strip()
            if IGNORE.search(s) or s in v or s in GEN: continue
            if any(s in w for w in v): continue
            miss.append(s)
        if miss: per[label]=miss
    if per:
        rows.append({'id':c['id'],'report':rep,'section':c['_secpath'].split(' / ')[-1],
                     'title':c['title'],'per_field':per})
json.dump(rows,open('/tmp/lb_misses.json','w'),indent=1)
print('\ncases with >=1 unmatched quoted string:',len(rows),'of',len(cases))
loc=defaultdict(int)
for r in rows:
    for f in r['per_field']: loc[f]+=1
print('by field (case counts):',dict(loc))
agg=defaultdict(set)
for r in rows:
    for f,ms in r['per_field'].items():
        for m in ms: agg[m].add((r['id'],f))
print('\ndistinct unmatched strings:',len(agg))
