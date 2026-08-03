import json,re,os,csv,collections,textwrap
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
defs={}
for k,v in F.items():
    for line in open(os.path.join(SD,v)):
        m=re.match(r'\s*\*\s*\*\*(S\d+-(?:R|N|E)\d+[a-z]?)\b', line)
        if m: defs[(k,m.group(1))]=re.sub(r'\s+',' ',line.strip())
idx=collections.defaultdict(list)
for c in ours:
    r=rep(c['section_id'])
    for a in set(ar.findall(c.get('refs') or '')): idx[(r,a)].append(c)
# the selected set: multi-surface Location chain + changed + multi-cited, all six reports
SEL=[('SBC','S4-R13'),('SBC','S4-R12'),('SBC','S8-R7'),('SBC','S14-R15'),('SBC','S15-R14'),
     ('SBR','S14-R20'),('SBR','S21-R7'),('SBR','S18-R13'),('SBR','S17-R3'),('SBR','S14-N3'),
     ('PV','S6-R11'),('PV','S2-R12'),('PV','S3-R10'),('PV','S3-R5'),('PV','S5-R4a'),('PV','S1-R4'),
     ('TU','S7-R13'),('TU','S9-R9'),('TU','S9-R10'),('TU','S8-R15'),('TU','S10-R4'),
     ('WIP','S7-R13'),('WIP','S7-R14'),('WIP','S4-R3'),('WIP','S10-R5a'),
     ('IV','S10-R15'),('IV','S7-R6'),('IV','S7-R7'),('IV','S12-R10'),('IV','S3-R1')]
out=[]
print('# SIDE-BY-SIDE COVERAGE SUBSTANTIATION (Rule 45(e))\n')
print('Selected %d requirements across all six specs.\n'%len(SEL))
nofit=[]
for r,a in SEL:
    d=defs.get((r,a))
    cs=idx.get((r,a),[])
    print('---\n\n## %s %s\n'%(r,a))
    if not d: print('**SPEC TEXT: NOT FOUND as a definition bullet** (may be prose-only)\n'); nofit.append((r,a)); continue
    print('**REQUIREMENT (verbatim):** %s\n'%d)
    if not cs:
        print('**VERDICT: NO CITING CASE — UNSUBSTANTIATED**\n'); nofit.append((r,a)); continue
    print('**CITING CASES: %d**\n'%len(cs))
    for c in cs:
        print('- **C%d (%s)** — %s'%(c['id'],idmap.get(c['id'],'?'),c['title']))
        ex=re.sub(r'\r','',(c.get('custom_expected') or ''))
        # print only the lines that touch the requirement's key nouns
        keys=[w for w in re.findall(r'\b[A-Z][A-Za-z%#\.]{2,}\b', d) if w not in ('The','Its','When','In','A','If','Whenever','Every','Both','This','And','Each')][:6]
        lines=[l for l in ex.split('\n') if any(k in l for k in keys)]
        if not lines: lines=ex.split('\n')[:3]
        for l in lines[:5]: print('    - EXPECTED: %s'%l.strip()[:400])
    print()
print('\n## UNSUBSTANTIATED ROWS: %d %s'%(len(nofit),nofit))
