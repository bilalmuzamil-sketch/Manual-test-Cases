import subprocess, json, re
FILES=[f for f in subprocess.run(['git','ls-tree','--name-only','HEAD','build/filters/cases/'],capture_output=True,text=True).stdout.split() if f.endswith('.json')]
commits=subprocess.run(['git','log','--format=%H|%ad|%an|%s','--date=short','--reverse','--since=2026-07-28','--','build/filters/cases/'],capture_output=True,text=True).stdout.strip().split('\n')
TARGETS={'FLT-BAR-01','FLT-COLL-02','FLT-EMPTY-01','FLT-EMPTY-02','FLT-PSRCH-09'}
def load(sha):
    out={}
    for f in FILES:
        r=subprocess.run(['git','show',f'{sha}:{f}'],capture_output=True,text=True)
        if r.returncode: continue
        try: d=json.loads(r.stdout)
        except Exception: continue
        for c in (d if isinstance(d,list) else d.get('cases',[])):
            k=c.get('id') or c.get('internal_id')
            if k in TARGETS: out[k]=c
    return out
def norm(v):
    if isinstance(v,list): return '\n'.join(str(x) for x in v)
    return str(v or '')
def g(c,*n):
    for x in n:
        if x in c and c[x] is not None: return c[x]
    return ''
prev={}
for line in commits:
    sha,date,an,subj=line.split('|',3)
    cur=load(sha)
    if not cur: continue
    for k,c in cur.items():
        ex=norm(g(c,'expected','custom_expected')); st=norm(g(c,'steps','custom_steps'))
        pex=norm(g(prev.get(k,{}),'expected','custom_expected')); pst=norm(g(prev.get(k,{}),'steps','custom_steps'))
        had='Known and accepted' in pex; has='Known and accepted' in ex
        if has and not had:
            print(f"\n>>> WAIVER INTRODUCED in {k}  commit {sha[:9]} {date}  \"{subj[:66]}\"")
            print(f"    steps changed in the SAME commit? {'YES' if st!=pst else 'NO'}  (len {len(pst)} -> {len(st)})")
            m=re.search(r'Known and accepted:.*?(?=\n\n|$)', ex, re.S)
            print('    text: '+re.sub(r'\s+',' ',m.group(0))[:230])
            # what did the expected look like before?
            print('    expected BEFORE (first 200): '+re.sub(r'\s+',' ',pex)[:200])
    prev.update(cur)
