import json, re, os, collections
ours = json.load(open('rs-ours.json'))
sects={s['id']:s for s in json.load(open('rs-sections.json'))}
def chain(sid):
    out=[];s=sects.get(sid)
    while s: out.append(s['name']); s=sects.get(s['parent_id'])
    return list(reversed(out))
REPMAP={'Sales By Customer':'SBC','Sales By Representative':'SBR','Parts Velocity':'PV',
        'Technician Utilization':'TU','Work In Progress':'WIP','Inventory Value':'IV'}
def repof(sid):
    ch=chain(sid); n=ch[1] if len(ch)>1 else ''
    for k,v in REPMAP.items():
        if k.lower() in n.lower(): return v
    return '?'
SPECDIR='/home/user/Manual-test-Cases/build/report-suite/spec-current-2026-07-31'
files={'SBC':'Sales-By-Customer-Report-current.md','SBR':'Sales-By-Representative-Report-current.md',
 'PV':'Parts-Velocity-Report-current.md','TU':'Technician-Utilization-Report-current.md',
 'WIP':'Work-In-Progress-Report-current.md','IV':'Inventory-Value-Report-current.md'}
spec={k:open(os.path.join(SPECDIR,v)).read() for k,v in files.items()}
# also load the local specs/ mirrors as a secondary pool
SPEC2='/home/user/Manual-test-Cases/build/report-suite/specs'
files2={'SBC':'sbc-sales-by-customer.md','SBR':'sbr-sales-by-representative.md','PV':'parts-velocity.md',
 'TU':'technician-utilization.md','WIP':'wip-work-in-progress.md','IV':'inventory-value.md'}
spec2={k:open(os.path.join(SPEC2,v)).read() for k,v in files2.items()}
ar=re.compile(r'\bS\d+-(?:R|N|E)\d+[a-z]?\b')
pres={k:set(ar.findall(t)) for k,t in spec.items()}
pres2={k:set(ar.findall(t)) for k,t in spec2.items()}
allp=set().union(*pres.values())|set().union(*pres2.values())
tr=re.compile(r'\bSV-\d+\b')
empty=[];noticket=[];noanchor=[];bad=[];au=collections.defaultdict(list);repcnt=collections.Counter()
for c in ours:
    rep=repof(c['section_id']); repcnt[rep]+=1
    refs=(c.get('refs') or '').strip()
    if not refs: empty.append(c['id']); continue
    if not tr.findall(refs): noticket.append((c['id'],refs))
    ancs=ar.findall(refs)
    if not ancs:
        if not re.search(r'§|Story\s*\d|invariant|Phase', refs): noanchor.append((c['id'],rep,refs))
    b=[]
    for a in set(ancs):
        au[(rep,a)].append(c['id'])
        if a not in pres.get(rep,set()) and a not in pres2.get(rep,set()):
            b.append((a,'in-other-spec' if a in allp else 'NOWHERE'))
    if b: bad.append((c['id'],rep,refs[:110],b))
print('per-report:',dict(repcnt))
print('empty:',len(empty))
print('no ticket:',len(noticket))
print('no anchor-like token:',len(noanchor))
for x in noanchor: print('   C%s [%s] %s'%x)
print('ANCHOR NOT IN ITS OWN REPORT SPEC:',len(bad))
for x in bad: print('   C%s [%s] %s -> %s'%x)
json.dump({f'{k[0]}|{k[1]}':v for k,v in au.items()}, open('anchor-users2.json','w'), indent=1)
multi={k:v for k,v in au.items() if len(v)>1}
print('anchors cited by >1 case:',len(multi),'| total distinct anchors cited:',len(au))
