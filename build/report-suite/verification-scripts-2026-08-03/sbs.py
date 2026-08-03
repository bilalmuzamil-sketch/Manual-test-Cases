import json,re,os,sys,textwrap
ours=json.load(open('/tmp/verify/rs-ours.json'))
sects={s['id']:s for s in json.load(open('/tmp/verify/rs-sections.json'))}
def chain(sid):
    out=[];s=sects.get(sid)
    while s: out.append(s['name']); s=sects.get(s['parent_id'])
    return list(reversed(out))
SPECDIR='/home/user/Manual-test-Cases/build/report-suite/spec-current-2026-07-31'
F={'SBC':'Sales-By-Customer-Report-current.md','SBR':'Sales-By-Representative-Report-current.md',
 'PV':'Parts-Velocity-Report-current.md','TU':'Technician-Utilization-Report-current.md',
 'WIP':'Work-In-Progress-Report-current.md','IV':'Inventory-Value-Report-current.md'}
spec={k:open(os.path.join(SPECDIR,v)).read().split('\n') for k,v in F.items()}
idmap={}
import csv
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']

def specline(rep,anchor):
    out=[]
    for i,l in enumerate(spec[rep]):
        if re.search(r'\*\*%s[:\*]'%re.escape(anchor), l) or re.search(r'\b%s\b'%re.escape(anchor),l):
            out.append((i+1,l.strip()))
    return out

def cases_citing(anchor, rep=None):
    res=[]
    for c in ours:
        if re.search(r'\b%s\b'%re.escape(anchor), c.get('refs') or ''):
            ch=chain(c['section_id'])
            res.append(c)
    return res

if __name__=='__main__':
    rep=sys.argv[1]; anchor=sys.argv[2]
    print('#### SPEC %s %s'%(rep,anchor))
    for ln,t in specline(rep,anchor)[:4]:
        print('  L%d: %s'%(ln,t[:2000]))
    print()
    cs=cases_citing(anchor)
    print('#### CASES CITING %s : %d'%(anchor,len(cs)))
    for c in cs:
        print('--- C%d [%s] %s'%(c['id'], idmap.get(c['id'],'?'), c['title']))
        print('    SECTION: %s'%' > '.join(chain(c['section_id'])[1:]))
        print('    REFS: %s'%(c.get('refs') or '')[:300])
        er=(c.get('custom_expected') or '').replace('\r','')
        print('    EXPECTED: %s'%er[:1800])
        print()
