import json,glob,csv,re,collections,itertools
ROOT='build/report-suite'
idmap={r['internal_id']:r['testrail_case_id'] for r in csv.DictReader(open(f'{ROOT}/testrail-id-map.csv'))}
cases={}
for f in sorted(glob.glob(f'{ROOT}/cases/*.json')):
    for c in json.load(open(f)):
        if str(c.get('viu_status','')).startswith('Retired'): continue
        cases[c['id']]=c
edit=json.load(open(f'{ROOT}/chris-answers-2026-07-31/edit-set.json'))
SCOPE=set(edit['edited'])|set(edit['new'])
print('active',len(cases),'in scope',len(SCOPE))

def body(c): return ' \n'.join([c['title']]+ (c.get('preconditions') or [])+(c.get('steps') or [])+(c.get('expected') or []))
def exp(c): return ' \n'.join(c.get('expected') or [])

# ---------- (i) opposite-assertion keyword sweep, per control group -------
CONTROLS={
 'Location filter control':      r'Location filter',
 'per-row Location column':      r'Location column',
 'Est. Lost Labor column':       r'Est\. Lost Labor',
 'Column Selection control (TU)':r'Column Selection',
 'WIP column-selection control': r'column-selection control|column selector',
 'download overflow menu':       r'overflow menu|three-dot|⋯',
 'export row cap':               r'10,000|too large',
 'PDF logo':                     r'logo',
 'Sales Representative label':   r'Sales Representative|Sales Rep\b',
 'Type filter / Type column':    r'\bType\b',
 'Sold (WO) / Sold (Parts Sale)':r'Sold \(WO\)|Sold via',
 'reports permission gate':      r'permission|reports access',
 '"Locations:" export line':     r'Locations:',
 '"Multiple" cell value':        r'"Multiple"|\bMultiple\b',
}
OPP=[('hidden|not shown|NOT shown|absent|is hidden','shown|displayed|IS shown|appears|visible'),
     ('greyed|disabled|non-interactive','enabled|clickable|interactive'),
     ('no reload|with no reload|immediately','reloads|re-fetch'),
     ('read-only|cannot be changed|locked','editable|can be changed'),
     ('excluded|ignored|never includes','included|includes'),
     ('persists|remembered|restored','resets|cleared|not remembered'),
     ('off by default|not offered','on by default|is offered'),
     ('no logo|shows no logo','bundled ShopView|shows that logo'),
     ('never shows "Multiple"|NO row ever shows','shows "Multiple"'),
     ('is too large to generate','is too large to export'),
     ('dedicated','ordinary reports access'),
     ('\\bSales Rep\\b(?! resentative)','Sales Representative'),
     ]
groups=collections.defaultdict(list)
for i,c in cases.items():
    for g,pat in CONTROLS.items():
        if re.search(pat,body(c)): groups[g].append(i)
findings=[]
for g,ids in sorted(groups.items()):
    for a,b in OPP:
        A=[i for i in ids if re.search(a,body(cases[i]))]
        B=[i for i in ids if re.search(b,body(cases[i]))]
        if A and B:
            both=set(A)&set(B)
            onlyA=[i for i in A if i not in both]; onlyB=[i for i in B if i not in both]
            if onlyA and onlyB:
                findings.append((g,a,b,onlyA,onlyB))
print('\n=== (i) opposite-assertion candidate groups:',len(findings))
for g,a,b,A,B in findings:
    if len(A)+len(B)<=14 or 'Multiple' in g or 'logo' in g or 'permission' in g or 'Sales' in g or 'too large' in g:
        print(f'\n[{g}] "{a[:32]}" vs "{b[:32]}"')
        print('   A:',' '.join(A)[:400]); print('   B:',' '.join(B)[:400])

# ---------- (ii) TITLE vs EXPECTED per case (whole suite) -----------------
print('\n=== (ii) TITLE-vs-EXPECTED (all',len(cases),'cases) ===')
STATE=[('hidden',r'\bhidden\b|not shown|NOT shown|is absent'),('shown',r'\bIS shown\b|is shown|appears|visible'),
       ('never Multiple',r'never (?:shows|reads) "?Multiple'),('Multiple',r'shows "Multiple"'),
       ('no logo',r'no logo'),('bundled logo',r'bundled ShopView'),
       ('dedicated perm',r'dedicated'),('ordinary perm',r'ordinary reports access'),
       ('Sales Rep short',r'\bSales Rep\b(?! resentative)'),('Sales Representative',r'Sales Representative')]
mism=[]
for i,c in sorted(cases.items()):
    t=c['title']; e=exp(c)+' '+' \n'.join(c.get('steps') or [])
    for name,pat in STATE:
        if re.search(pat,t) and not re.search(pat,e):
            mism.append((i,name,t))
for i,n,t in mism: print(f'  {i} ({idmap.get(i,"new")}) title asserts [{n}] not echoed in steps/expected: {t[:88]}')
print('  count',len(mism))

# ---------- (iii) same-anchor clustering ---------------------------------
print('\n=== (iii) same-anchor clusters with opposite state words ===')
def anchors(c):
    s=c.get('spec_ref') or ''
    return set(re.findall(r'S\d+-[RNE]\d+[a-z]?',s))
amap=collections.defaultdict(list)
for i,c in cases.items():
    for a in anchors(c): amap[(i.split('-')[0],a)].append(i)
conf=0
for k,ids in sorted(amap.items()):
    if len(ids)<2: continue
    for a,b in OPP:
        A=[i for i in ids if re.search(a,exp(cases[i]))]; B=[i for i in ids if re.search(b,exp(cases[i]))]
        both=set(A)&set(B); A=[i for i in A if i not in both]; B=[i for i in B if i not in both]
        if A and B:
            conf+=1; print(f'  {k[0]} {k[1]}: A={A} vs B={B}  ("{a[:26]}" vs "{b[:26]}")')
print('  clusters flagged',conf)
