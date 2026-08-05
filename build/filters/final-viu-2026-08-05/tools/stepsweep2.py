import subprocess, json, re, collections
FILES=[f for f in subprocess.run(['git','ls-tree','--name-only','HEAD','build/filters/cases/'],capture_output=True,text=True).stdout.split() if f.endswith('.json')]
commits=subprocess.run(['git','log','--format=%H|%ad|%s','--date=short','--reverse','--since=2026-07-28','--','build/filters/cases/'],capture_output=True,text=True).stdout.strip().split('\n')
def norm(v):
    if isinstance(v,list): v='\n'.join(str(x) for x in v)
    s=str(v or '')
    s=re.sub(r'<[^>]+>',' ',s)                       # strip HTML
    s=re.sub(r'^\s*\d+[.)]\s*','',s,flags=re.M)      # strip list numbering
    return re.sub(r'\s+',' ',s).strip().lower()
def assertion(v):
    s=norm(v)
    for cut in ['this is the expected behaviour as per','automation: ','---']:
        i=s.find(cut)
        if i>0: s=s[:i]
    return s.strip()
def g(c,*n):
    for x in n:
        if x in c and c[x] is not None: return c[x]
    return ''
def load(sha):
    out={}
    for f in FILES:
        r=subprocess.run(['git','show',f'{sha}:{f}'],capture_output=True,text=True)
        if r.returncode: continue
        try: d=json.loads(r.stdout)
        except Exception: continue
        for c in (d if isinstance(d,list) else d.get('cases',[])):
            k=c.get('id') or c.get('internal_id')
            if k: out[k]=c
    return out
prev=None; FIND=collections.defaultdict(list)
for line in commits:
    sha,date,subj=line.split('|',2)
    cur=load(sha)
    if not cur: continue
    if prev:
        for k,c in cur.items():
            if k not in prev: continue
            p=prev[k]
            so,sn=norm(g(p,'steps','custom_steps')),norm(g(c,'steps','custom_steps'))
            ao,an=assertion(g(p,'expected','custom_expected')),assertion(g(c,'expected','custom_expected'))
            if so!=sn and ao!=an:
                FIND[k].append(dict(sha=sha[:9],date=date,subj=subj[:64],
                  steps_before=so[:110],steps_after=sn[:110],
                  assert_before=ao[:200],assert_after=an[:200]))
    prev=cur
print('cases where STEPS changed AND the ASSERTION BODY changed in the SAME commit:',len(FIND))
json.dump(FIND,open('/tmp/fv/stepsweep2.json','w'),indent=1)
for k,v in sorted(FIND.items()):
    for x in v:
        print(f"\n### {k}  {x['sha']} {x['date']}  \"{x['subj']}\"")
        print('  STEPS  -: '+x['steps_before'][:100]); print('  STEPS  +: '+x['steps_after'][:100])
        print('  ASSERT -: '+x['assert_before'][:160]); print('  ASSERT +: '+x['assert_after'][:160])
