import json,re,os,csv,collections
ours=json.load(open('rs-ours.json'))
sects={s['id']:s for s in json.load(open('rs-sections.json'))}
def rep(sid):
    ch=[];s=sects.get(sid)
    while s: ch.append(s['name']); s=sects.get(s['parent_id'])
    ch=list(reversed(ch)); n=ch[1] if len(ch)>1 else '?'
    for k,v in {'Sales By Customer':'SBC','Sales By Representative':'SBR','Parts Velocity':'PV',
                'Technician Utilization':'TU','Work In Progress':'WIP','Inventory Value':'IV'}.items():
        if k.lower() in n.lower(): return v
    return '?'
idmap={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']
SD='/home/user/Manual-test-Cases/build/report-suite/spec-current-2026-07-31'
F={'SBC':'Sales-By-Customer-Report-current.md','SBR':'Sales-By-Representative-Report-current.md',
 'PV':'Parts-Velocity-Report-current.md','TU':'Technician-Utilization-Report-current.md',
 'WIP':'Work-In-Progress-Report-current.md','IV':'Inventory-Value-Report-current.md'}
ar=re.compile(r'\bS\d+-(?:R|N|E)\d+[a-z]?\b')
# BROADER: any bold anchor at start of a bullet, tolerant of parentheticals
defs={}
allanch=collections.defaultdict(set)
for k,v in F.items():
    txt=open(os.path.join(SD,v)).read()
    for a in ar.findall(txt): allanch[k].add(a)
    for line in txt.split('\n'):
        m=re.match(r'\s*\*\s*\*\*(S\d+-(?:R|N|E)\d+[a-z]?)\b', line)          # tolerant: no need for :/*
        if m: defs[(k,m.group(1))]=line.strip()
        else:
            m2=re.match(r'\s*\*\s*\*\*(S\d+-(?:R|N|E)\d+[a-z]?)\s*\(', line)  # parenthetical form
            if m2: defs[(k,m2.group(1))]=line.strip()
print('TOTAL distinct anchors appearing anywhere per spec:', {k:len(v) for k,v in allanch.items()}, 'sum', sum(len(v) for v in allanch.values()))
print('TOTAL definition bullets extracted:', len(defs), collections.Counter(k for k,_ in defs))
idx=collections.defaultdict(list)
for c in ours:
    r=rep(c['section_id'])
    for a in set(ar.findall(c.get('refs') or '')): idx[(r,a)].append(c)
uncov=[(k,a,t) for (k,a),t in sorted(defs.items()) if not idx.get((k,a))]
print()
print('*** UNCOVERED definition-requirements (requirement -> no case):', len(uncov))
for k,a,t in uncov: print('   %-4s %-9s %s'%(k,a,t[:175]))
print()
# reverse: case anchors with no definition bullet
orph=collections.defaultdict(list)
for (r,a),cs in idx.items():
    if (r,a) not in defs:
        orph[(r,a)]=[c['id'] for c in cs]
print('*** case-cited anchors with NO definition bullet in that report spec:', len(orph))
for (r,a),ids in sorted(orph.items()):
    inspec = a in allanch.get(r,set())
    print('   %-4s %-9s in-spec-text=%s cases=%s'%(r,a,inspec,['C%d'%i for i in ids][:6]))
