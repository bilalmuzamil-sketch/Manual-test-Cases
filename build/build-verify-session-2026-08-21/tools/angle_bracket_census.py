#!/usr/bin/env python3
"""Find every local case carrying an angle-bracket placeholder and check whether the
LIVE TestRail copy still has it. Read-only. Core 3.8: TestRail eats < > as HTML."""
import json, glob, re, base64, urllib.request, collections, csv, os

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
bysec=collections.defaultdict(list)
for c in allc: bysec[c['section_id']].append(c)

GROUPS={'digital-inspections-v2':6658,'global-search':6720,'simple-flow-v2':6665,
        'invoice-ui-refresh':6559,'inline-add-edit-parts':6597,'printer-friendly-wo':6617}
PLACEHOLDER=re.compile(r'<[a-zA-Z][a-zA-Z0-9 _./-]{0,30}>')
TEXTKEYS=('title','refs','preconds','custom_preconds','steps','custom_steps',
          'expected','custom_expected','preconditions','expected_results')

def norm(t): return ' '.join((t or '').split()).strip().lower()

rows=[]
for slug,gid in GROUPS.items():
    live=[c for s in sub(gid) for c in bysec.get(s,[])]
    live_by_title={norm(c['title']):c for c in live}
    # strip placeholders from a local title the way TestRail would, to find the live match
    def find_live(local_title):
        n=norm(local_title)
        if n in live_by_title: return live_by_title[n]
        stripped=norm(PLACEHOLDER.sub('',local_title))
        if stripped in live_by_title: return live_by_title[stripped]
        return None
    for fp in glob.glob(f'build/{slug}/cases/*.json'):
        try: data=json.load(open(fp))
        except Exception: continue
        items = data if isinstance(data,list) else data.get('cases',data if isinstance(data,list) else [])
        if isinstance(items,dict): items=[items]
        for it in items:
            if not isinstance(it,dict): continue
            hits={}
            for k in TEXTKEYS:
                v=it.get(k)
                if isinstance(v,list): v='\n'.join(map(str,v))
                if isinstance(v,str):
                    m=PLACEHOLDER.findall(v)
                    if m: hits[k]=m
            if not hits: continue
            lt=it.get('title','')
            lc=find_live(lt)
            rows.append({'slug':slug,'internal_id':it.get('internal_id') or it.get('id') or '?',
                         'local_title':lt,'placeholders':hits,
                         'live_cid':lc['id'] if lc else None,
                         'live_title':lc['title'] if lc else None,
                         'live_refs':(lc.get('refs') or '') if lc else None,
                         'live_expected':(lc.get('custom_expected') or '') if lc else None,
                         'live_steps':(lc.get('custom_steps') or '') if lc else None,
                         'live_preconds':(lc.get('custom_preconds') or '') if lc else None})

os.makedirs('build/build-verify-session-2026-08-21/evidence',exist_ok=True)
out='build/build-verify-session-2026-08-21/evidence/angle-bracket-census.json'
json.dump(rows,open(out,'w'),indent=1)
print(f"local cases carrying an angle-bracket placeholder: {len(rows)}\n")
for r in rows:
    print(f"[{r['slug']}] {r['internal_id']}  -> live C{r['live_cid']}")
    print(f"   placeholders in LOCAL: { {k:v for k,v in r['placeholders'].items()} }")
    for fld,livekey in (('title','live_title'),('refs','live_refs'),
                        ('custom_preconds','live_preconds'),('custom_steps','live_steps'),
                        ('custom_expected','live_expected')):
        lv=r.get(livekey)
        if lv is None: continue
        for ph in set(sum(r['placeholders'].values(),[])):
            if ph in lv:
                print(f"   SURVIVED in live {fld}: {ph}")
    # detect the swallow signature: the placeholder gone AND a tell-tale double space
    for fld,livekey in (('title','live_title'),('refs','live_refs'),('custom_expected','live_expected')):
        lv=r.get(livekey) or ''
        if any(ph not in lv for ph in set(sum(r['placeholders'].values(),[]))) and '  ' in lv:
            print(f"   *** SWALLOWED in live {fld} (double-space signature present)")
    print()
print(f"detail -> {out}")
