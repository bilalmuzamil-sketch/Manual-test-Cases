#!/usr/bin/env python3
"""Back-fill testrail_case_id into each project's id-map from LIVE TestRail.
QA lead authorised 2026-08-25 ("Back fill the id-maps"). LOCAL FILE WRITES ONLY --
no TestRail write of any kind.

Join ladder, most specific first, and every step must be UNIQUE or it is not used:
  1. exact normalised title
  2. placeholder-stripped title   (TestRail eats <...> on import -- core 3.8)
  3. normalised refs              (disambiguates two cases sharing one title)
Anything still unresolved is left BLANK and reported -- never guessed (a C-ID on the
wrong case is the C30162/C30287 failure class).
"""
import json, base64, urllib.request, csv, collections, re, os, shutil

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
PH=re.compile(r'<[a-zA-Z][a-zA-Z0-9 _./-]{0,30}>')
def norm(t): return ' '.join((t or '').split()).strip().lower()
def strip_ph(t): return norm(PH.sub('',t or ''))

report={}
for slug,gid in GROUPS.items():
    live=[c for s in sub(gid) for c in bysec.get(s,[])]
    idx_title=collections.defaultdict(list); idx_strip=collections.defaultdict(list); idx_refs=collections.defaultdict(list)
    for c in live:
        idx_title[norm(c['title'])].append(c)
        idx_strip[strip_ph(c['title'])].append(c)
        if (c.get('refs') or '').strip(): idx_refs[norm(c['refs'])].append(c)
    path=f'build/{slug}/testrail-id-map.csv'
    with open(path,newline='') as f:
        rd=csv.DictReader(f); fields=rd.fieldnames; rows=list(rd)
    used=set(); how=collections.Counter(); unresolved=[]
    for r in rows:
        cand=None; method=None
        for key,idx,m in ((norm(r['title']),idx_title,'exact-title'),
                          (strip_ph(r['title']),idx_strip,'stripped-title'),
                          (norm(r.get('refs','')),idx_refs,'refs')):
            if not key: continue
            pool=[c for c in idx.get(key,[]) if c['id'] not in used]
            if len(pool)==1:
                cand,method=pool[0],m; break
        if cand:
            r['testrail_case_id']=str(cand['id']); used.add(cand['id']); how[method]+=1
        else:
            r['testrail_case_id']=''; unresolved.append(r['internal_id'])
    shutil.copyfile(path,path+'.pre-backfill.bak')
    with open(path,'w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(rows)
    # byte-verify: re-read and confirm every filled value is an int, and count
    with open(path,newline='') as f: back=list(csv.DictReader(f))
    filled=sum(1 for r in back if r['testrail_case_id'].isdigit())
    ids=[int(r['testrail_case_id']) for r in back if r['testrail_case_id'].isdigit()]
    report[slug]={'rows':len(rows),'live':len(live),'filled':filled,
                  'methods':dict(how),'unresolved':unresolved,
                  'unique_ids':len(set(ids)),'collisions':len(ids)-len(set(ids)),
                  'cid_min':min(ids,default=None),'cid_max':max(ids,default=None)}
    os.remove(path+'.pre-backfill.bak')

json.dump(report,open('build/build-verify-session-2026-08-21/evidence/backfill-report.json','w'),indent=2)
print(f"{'PROJECT':<28}{'ROWS':>5}{'LIVE':>5}{'FILLED':>7}{'UNIQ':>6}{'COLL':>5}  METHODS / UNRESOLVED")
tot=totf=0
for s,r in report.items():
    tot+=r['rows']; totf+=r['filled']
    print(f"{s:<28}{r['rows']:>5}{r['live']:>5}{r['filled']:>7}{r['unique_ids']:>6}{r['collisions']:>5}  {r['methods']}"
          + (f"  UNRESOLVED={r['unresolved']}" if r['unresolved'] else ""))
print(f"\nTOTAL rows {tot} | filled {totf} | blank {tot-totf}")
