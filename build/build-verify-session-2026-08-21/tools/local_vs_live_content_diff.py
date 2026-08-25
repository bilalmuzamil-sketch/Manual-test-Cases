#!/usr/bin/env python3
"""How far does LIVE TestRail content differ from our LOCAL case source, per project?
Read-only. Compares refs and the testable content (preconds/steps/expected BODY).
The expected BODY = everything before the '---' separator, so a provenance/marker
re-stamp does not register as a content difference (core 2.10's split)."""
import json, glob, base64, urllib.request, csv, collections, re

C=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B=C['host']+'/index.php?/api/v2/'
def get(p):
    r=urllib.request.Request(B+p); r.add_header('Authorization','Basic '+A)
    with urllib.request.urlopen(r,timeout=60) as x: return json.loads(x.read().decode())
def paged(p,k):
    o,f=[],0
    while True:
        d=get(f"{p}&limit=250&offset={f}"); c=d[k] if isinstance(d,dict) else d
        if not c: break
        o.extend(c)
        if len(c)<250: break
        f+=250
    return o
sec=paged("get_sections/1&suite_id=1","sections")
kids=collections.defaultdict(list)
for s in sec: kids[s.get('parent_id')].append(s['id'])
def sub(r):
    seen,st=[],[r]
    while st: n=st.pop(); seen.append(n); st.extend(kids.get(n,[]))
    return seen
allc=paged("get_cases/1&suite_id=1","cases")
live_by_id={c['id']:c for c in allc}

GROUPS={'digital-inspections-v2':6658,'global-search':6720,'simple-flow-v2':6665,
        'invoice-ui-refresh':6559,'inline-add-edit-parts':6597,'printer-friendly-wo':6617}
PH=re.compile(r'<[a-zA-Z][a-zA-Z0-9 _./-]{0,30}>')
def n(t):
    if isinstance(t,list): t='\n'.join(map(str,t))
    return ' '.join((t or '').split()).strip()
def body(t):
    """testable body only: drop everything from the '---' separator onwards"""
    t=n(t)
    return t.split('---')[0].strip() if '---' in t else t
def nb(t): return n(t).lower()

def local_index(slug):
    out={}
    for fp in glob.glob(f'build/{slug}/cases/*.json'):
        try: d=json.load(open(fp))
        except Exception: continue
        items=d if isinstance(d,list) else d.get('cases',[])
        if isinstance(items,dict): items=[items]
        for it in items:
            if isinstance(it,dict) and (it.get('id') or it.get('internal_id')): out[it.get('id') or it.get('internal_id')]=it
    return out

print(f"{'PROJECT':<28}{'PAIRS':>6}{'refs≠':>7}{'pre≠':>6}{'steps≠':>7}{'exp-body≠':>10}{'any≠':>6}")
detail={}
for slug,gid in GROUPS.items():
    loc=local_index(slug)
    rows=list(csv.DictReader(open(f'build/{slug}/testrail-id-map.csv',newline='')))
    d=collections.Counter(); diffs=[]
    pairs=0
    for r in rows:
        cid=r['testrail_case_id']
        if not cid.isdigit(): continue
        lc=live_by_id.get(int(cid)); li=loc.get(r['internal_id'])
        if not lc or not li: continue
        pairs+=1
        which=[]
        if nb(r.get('refs','')) != nb(lc.get('refs','')): d['refs']+=1; which.append('refs')
        lp=li.get('preconditions', li.get('preconds'))
        ls=li.get('steps'); le=li.get('expected', li.get('expected_results'))
        if lp is not None and nb(lp)!=nb(lc.get('custom_preconds','')): d['pre']+=1; which.append('preconds')
        if ls is not None and nb(ls)!=nb(lc.get('custom_steps','')): d['steps']+=1; which.append('steps')
        if le is not None and body(le).lower()!=body(lc.get('custom_expected','')).lower():
            d['exp']+=1; which.append('expected-body')
        if which: diffs.append((r['internal_id'],cid,which))
    d['any']=len(diffs)
    detail[slug]=diffs
    print(f"{slug:<28}{pairs:>6}{d['refs']:>7}{d['pre']:>6}{d['steps']:>7}{d['exp']:>10}{d['any']:>6}")

json.dump({k:[{'internal_id':a,'cid':b,'fields':c} for a,b,c in v] for k,v in detail.items()},
          open('build/build-verify-session-2026-08-21/evidence/content-diff.json','w'),indent=1)
print("\nfirst few divergent cases per project:")
for slug,v in detail.items():
    if v: print(f"  {slug}: {[(a,'C'+b,c) for a,b,c in v[:4]]}")
