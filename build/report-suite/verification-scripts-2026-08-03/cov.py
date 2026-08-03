import json,re,os,csv,collections,sys
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
# requirement text per anchor: the bullet line defining it
reqs={}
for k,v in F.items():
    for line in open(os.path.join(SD,v)):
        m=re.match(r'\s*\*\s*\*\*(S\d+-(?:R|N|E)\d+[a-z]?)[:\*]', line)
        if m: reqs[(k,m.group(1))]=line.strip()
print('definition-bullet anchors found:',len(reqs), collections.Counter(k for k,_ in reqs))
# case index by (report, anchor)
idx=collections.defaultdict(list)
for c in ours:
    r=rep(c['section_id'])
    for a in set(ar.findall(c.get('refs') or '')): idx[(r,a)].append(c)
MULTI=re.compile(r'export|PDF|CSV|print|API|mobile|download', re.I)
CHANGED={'IV':'S10-R15 S12-R10 S3-R1 S7-R6 S7-R7'.split(),
 'PV':'S2-R1 S2-R12 S2-R8 S3-N1 S3-R10 S3-R1a S3-R2 S3-R5 S3-R6 S3-R9 S4-R3 S4-R4 S5-R2 S5-R3 S5-R4a S5-R4b S5-R7 S6-R1 S6-R11 S7-R6 S7-R8'.split(),
 'SBC':'S4-R12 S4-R12a S4-R13 S8-R7 S8-R8 S8-R9 S8-R10 S14-R15 S14-R16 S15-R14 S20-R19'.split(),
 'SBR':'S14-N3 S14-R1 S14-R20 S17-R1 S17-R3 S17-R6 S18-R13 S18-R7 S18-R9 S21-R7 S21-R8'.split(),
 'TU':'S1-R8 S10-R1 S10-R4 S7-N2 S7-R10 S7-R11 S7-R13 S8-R15 S8-R16 S9-R9 S9-R10'.split(),
 'WIP':'S10-R5a S4-R3 S7-R13 S7-R14 S9-R10a'.split()}
sel=[]
for r,ans in CHANGED.items():
    for a in ans:
        if (r,a) in reqs:
            cs=idx.get((r,a),[])
            sel.append((r,a,reqs[(r,a)],cs,bool(MULTI.search(reqs[(r,a)])),len(cs)))
print('changed-requirement rows selectable:',len(sel))
uncov=[s for s in sel if s[5]==0]
print('*** CHANGED requirements with NO citing case:',len(uncov))
for s in uncov: print('   %s %s :: %s'%(s[0],s[1],s[2][:190]))
print()
# multi-surface subset
ms=[s for s in sel if s[4]]
print('changed AND multi-surface:',len(ms))
mu=[s for s in ms if s[5]==0]
print('   of which uncovered:',len(mu))
for s in mu: print('   !! %s %s :: %s'%(s[0],s[1],s[2][:200]))
json.dump([[s[0],s[1],s[2],[[c['id'],idmap.get(c['id'],'?')] for c in s[3]],s[4]] for s in sel], open('cov-sel.json','w'), indent=1)
