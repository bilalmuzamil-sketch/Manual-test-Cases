import json,re,sys
from collections import defaultdict
cases=json.load(open('/tmp/cases225.json'))
REP={'Work In Progress':'work-in-progress','Technician Utilization':'technician-utilization','Sales By Customer Report':'sales-by-customer'}
vocab={}
for r,f in REP.items():
    d=json.load(open('/tmp/vocab2-%s.json'%f))
    words=set()
    words|=set(d['base']['text']); words|=set(d['base']['headers']); words|=set(d['base']['tabs'])
    for h in d['base']['headers']:
        for part in h.split('\n'): words.add(part.strip())
    for t in d['base']['tabs']:
        words.add(re.sub(r'\s*\(\d+\)$','',t).strip())
    for k,v in d['menus'].items():
        if isinstance(v,str): continue
        for m in v: words|=set(m['items'])
    # extra harvest file if present
    try:
        d2=json.load(open('/tmp/vocab3-%s.json'%f))
        for k,v in d2['menus'].items():
            if isinstance(v,str): continue
            for m in v: words|=set(m['items'])
    except Exception: pass
    vocab[r]={w.strip() for w in words if w.strip()}
    vocab[r+'|ids']=set(d['base']['testids'])
GEN={'Reports','Work Orders','Customers','Parts','Schedule','Search','Clock In','Export Reports'}
q=re.compile(r'"([^"\n]{2,70})"')
IGNORE=re.compile(r'^[\$\d\.,%\-\s]*$|^https?:|Network|No throttling|Slow 3G|Offline|Accessibility|^\(N\)$|^N/A$')
rows=[]
for c in cases:
    misses=[]
    for s in set(q.findall(c['body'])):
        s=s.strip()
        if IGNORE.search(s): continue
        v=vocab[c['report']]
        if s in v or s in GEN: continue
        # tolerant: present as a substring of some vocabulary item
        if any(s in w for w in v): continue
        misses.append(s)
    rows.append({'id':c['id'],'report':c['report'],'section':c['section'],'title':c['title'],'misses':sorted(misses)})
json.dump(rows,open('/tmp/labelcheck.json','w'),indent=1)
n=sum(1 for r in rows if r['misses'])
print('cases with at least one unmatched quoted label:',n,'of',len(rows))
agg=defaultdict(list)
for r in rows:
    for m in r['misses']: agg[m].append(r['id'])
for m,ids in sorted(agg.items(), key=lambda kv:-len(kv[1])):
    print(f'{len(ids):3d}  {m!r}  e.g. C{ids[0]}')
