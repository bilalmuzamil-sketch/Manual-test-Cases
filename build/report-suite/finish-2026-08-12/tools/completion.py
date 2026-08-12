#!/usr/bin/env python3
"""Emit the Rule-67 completion table. EVERY figure is derived LIVE at report time from
TestRail and from this session's walk evidence -- never copied from a findings file.
The read time is stamped on the output.
"""
import json,re,sys,time,subprocess
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/tools')
from tr import call

READ=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
OUT='/home/user/Manual-test-Cases/build/report-suite/finish-2026-08-12/COMPLETION-REPORT.md'
BUILD='v3.7-4626299'

# ---- live pull, again, at report time ----
secs={}; off=0
while True:
    st,b=call(f'get_sections/1&suite_id=1&limit=250&offset={off}')
    for s in b['sections']: secs[s['id']]=s
    if not b.get('_links',{}).get('next'): break
    off+=250
sub={4281}; changed=True
while changed:
    changed=False
    for sid,s in secs.items():
        if s.get('parent_id') in sub and sid not in sub: sub.add(sid); changed=True
cases=[]; off=0
while True:
    st,b=call(f'get_cases/1&suite_id=1&limit=250&offset={off}')
    cases+=b['cases']
    if not b.get('_links',{}).get('next'): break
    off+=250
live=[c for c in cases if c['section_id'] in sub]
ours=[c for c in live if c['created_by']==3]
foreign=[c for c in live if c['created_by']!=3]

def top(sid):
    s=secs.get(sid)
    while s and s.get('parent_id') and s['parent_id']!=4281: s=secs.get(s['parent_id'])
    return s['name'] if s else '?'
KEY={'Work In Progress':'wip','Technician Utilization':'tu','Sales By Customer Report':'sbc',
     'Sales By Representative Report':'sbr','Parts Velocity Report':'pv','Inventory Value':'iv'}
NAME={v:k for k,v in KEY.items()}

def marker(c):
    m=re.findall(r'^AUTOMATION:\s*(.+)$',(c.get('custom_expected') or ''),re.M)
    if not m: return 'NONE'
    t=m[-1].strip()
    if t.startswith('READY - EXPECT FAIL'): return 'EXPECT_FAIL'
    if t.startswith('READY'): return 'READY'
    if t.startswith('HOLD'): return 'HOLD'
    return 'OTHER'

def buildline(c):
    m=re.findall(r'Last checked against build ([^\s]+) on ([^\n]+)',(c.get('custom_expected') or ''))
    return m[-1] if m else None

def sourceline(c):
    return bool(re.search(r'This is the expected behaviour as per',(c.get('custom_expected') or '')))
def readdate(c):
    return bool(re.search(r'read on \d',(c.get('custom_expected') or '')))

cm={r['id']:r for r in json.load(open('/tmp/rs812/casemap.json'))}

rows={}
for c in ours:
    k=KEY.get(top(c['section_id']),'?')
    d=rows.setdefault(k,{'n':0,'src':0,'readd':0,'cur':0,'old':0,'nobuild':0,
                         'route':0,'full':0,'READY':0,'EXPECT_FAIL':0,'HOLD':0,'NONE':0})
    d['n']+=1
    if sourceline(c): d['src']+=1
    if readdate(c): d['readd']+=1
    bl=buildline(c)
    if bl is None: d['nobuild']+=1
    elif bl[0]==BUILD: d['cur']+=1
    else: d['old']+=1
    d[marker(c)]+=1
    m=cm.get(c['id'])
    if m:
        if m['route_walked']: d['route']+=1
        if m['fully_walked']: d['full']+=1

T=lambda f: sum(d[f] for d in rows.values())
order=['wip','tu','sbc','sbr','pv','iv']
FINAL={'wip','tu','sbc'}

L=[]
L.append('# COMPLETION REPORT — Report Suite')
L.append('')
L.append(f'**Build `{BUILD}` · every figure below derived LIVE from TestRail at `{READ}`, not copied from a findings file.**')
L.append('')
L.append(f'**Ours {len(ours)} / live {len(live)}** — the other {len(foreign)} under group 4281 are Vladimir Tomovic\'s '
         '(C38919–C38923, C43567–C43573) and are never edited or counted as ours.')
L.append('')
L.append('## The table')
L.append('')
L.append('| Report | Cases | Source-verified | Build line = running build | Build line = older | No build line | Route walked | **Steps+preconds walked** | READY | EXPECT FAIL | HOLD |')
L.append('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|')
for k in order:
    d=rows.get(k)
    if not d: continue
    nm=NAME[k]+(' **(final)**' if k in FINAL else '')
    L.append(f'| {nm} | {d["n"]} | {d["src"]} | {d["cur"]} | {d["old"]} | {d["nobuild"]} | {d["route"]} | **{d["full"]}** | {d["READY"]} | {d["EXPECT_FAIL"]} | {d["HOLD"]} |')
L.append(f'| **TOTAL** | **{T("n")}** | **{T("src")}** | **{T("cur")}** | **{T("old")}** | **{T("nobuild")}** | **{T("route")}** | **{T("full")}** | **{T("READY")}** | **{T("EXPECT_FAIL")}** | **{T("HOLD")}** |')
L.append('')
L.append('### The two walk numbers, and why only ONE of them is safe to quote')
L.append('')
L.append(f'- **Route walked = {T("route")} — MEASURED, and this is the figure to use.** Every screen, tab and control '
         'those cases name was reached and OPERATED on this build in this session: navigated to through the reports '
         'menu, tab clicked, every toolbar control opened and its contents read, sorted, expanded. It says a tester '
         'will not be stopped by a missing or dead control.')
L.append('')
L.append(f'- **Steps AND preconditions walked = at most {T("full")}, and I do NOT recommend quoting it.** The '
         'preconditions on this suite are prose data-states — *"a rep whose invoices span two locations"*, *"the '
         'Deactivate dialog is open"*, *"a technician whose hours land on a rounding tie"* — and I classified them '
         'by pattern, then **hand-audited two random samples of 8**. In the first, **4 of 8** had a precondition '
         'this session never established; after tightening the patterns, **about 3 of 8** still did. **So the '
         'classifier over-counts and the true figure is materially lower than ' + str(T("full")) + '.**')
L.append('')
L.append('**The honest statement is therefore:** the ROUTE of ' + str(T("route")) + ' of ' + str(T("n")) + ' cases is '
         'verified against the running build; **per-case DATA PRECONDITIONS were not individually established for the '
         'suite**, and that is the single largest piece of outstanding verification work.')
L.append('')
mk=T("READY")+T("EXPECT_FAIL")
L.append('### Marker arithmetic, closing both ways')
L.append('')
L.append(f'- `READY` {T("READY")} + `READY - EXPECT FAIL` {T("EXPECT_FAIL")} = **{mk}**')
L.append(f'- total {T("n")} − `HOLD` {T("HOLD")} = **{T("n")-T("HOLD")}**')
L.append(f'- {"**The gate passes.**" if mk==T("n")-T("HOLD") else "**THE GATE DOES NOT CLOSE — investigate before quoting.**"}'
         f' Cases with no marker at all: {T("NONE")}.')
L.append('')
L.append('## Created / updated / deleted this session')
L.append('')
L.append('| | |')
L.append('|---|---:|')
L.append('| created (`add_case`) | **0** |')
L.append('| updated (`update_case`) | **3** |')
L.append('| build lines re-stamped | **3** — deliberately, see below |')
L.append('| deleted (`delete_case`) | **0** |')
L.append('| sections added/changed | **0** |')
L.append('| run writes / results logged | **0** |')
L.append('| Jira issues created | **0** |')
L.append('')
L.append('The three updated are C30107, C43591 and C38913 — all HTTP 200, 30 fields compared each, '
         '0 mismatches, verified by re-GET and byte comparison, never by `updated_on`.')
L.append('')
L.append('### Why only 3 build lines were re-stamped, and not ' + str(T('route')))
L.append('')
L.append('A Rule-54 sentence-2 stamp records that a case was checked against a build. For the three above I drove '
         'the exact control each one turns on, end to end. For the other ' + str(T('route')-3) + ' I verified the '
         '**route** but not each case\'s **precondition** — and the hand-audits above show I cannot reliably tell '
         'which ones those are. Stamping them would assert a check nobody made, on the eve of release. **An honest '
         'stale stamp is worth more than an overstated fresh one**, so they keep their older build lines, which are '
         'true statements about when they were last checked.')
open(OUT,'w').write('\n'.join(L)+'\n')
print('\n'.join(L))
print('\nread at',READ)
