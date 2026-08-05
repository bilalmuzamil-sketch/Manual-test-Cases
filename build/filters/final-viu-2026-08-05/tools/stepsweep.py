import subprocess, json, sys, collections
FILES=subprocess.run(['git','ls-tree','--name-only','HEAD','build/filters/cases/'],capture_output=True,text=True).stdout.split()
FILES=[f for f in FILES if f.endswith('.json')]
commits=subprocess.run(['git','log','--format=%H %ad %s','--date=short','--reverse','--since=2026-07-28','--','build/filters/cases/'],capture_output=True,text=True).stdout.strip().split('\n')
def load(sha):
    out={}
    for f in FILES:
        r=subprocess.run(['git','show',f'{sha}:{f}'],capture_output=True,text=True)
        if r.returncode: continue
        try: d=json.loads(r.stdout)
        except Exception: continue
        for c in (d if isinstance(d,list) else d.get('cases',[])):
            k=c.get('testrail_case_id') or c.get('c_id') or c.get('id')
            if k: out[str(k).lstrip('C')]=c
    return out
prev=None; prevsha=None
FIND=collections.defaultdict(list)
def g(c,*names):
    for n in names:
        if n in c and c[n] is not None: return c[n]
    return ''
def norm(v):
    if isinstance(v,list): return '\n'.join(str(x) for x in v)
    return str(v or '')
for line in commits:
    sha,date,subj=line.split(' ',2)
    cur=load(sha)
    if not cur: continue
    if prev:
        for k,c in cur.items():
            if k not in prev: continue
            p=prev[k]
            st_o,st_n=norm(g(p,'steps','custom_steps')),norm(g(c,'steps','custom_steps'))
            ex_o,ex_n=norm(g(p,'expected','custom_expected')),norm(g(c,'expected','custom_expected'))
            if st_o!=st_n and ex_o!=ex_n:
                FIND[k].append(dict(sha=sha[:8],date=date,subj=subj[:70],
                    steps_delta=len(st_n)-len(st_o), exp_delta=len(ex_n)-len(ex_o)))
    prev=cur; prevsha=sha
print('commits scanned:', len(commits))
print('cases where STEPS and EXPECTED both changed in the SAME commit:', len(FIND))
json.dump(FIND,open('/tmp/fv/stepsweep.json','w'),indent=1)
for k,v in sorted(FIND.items(), key=lambda x:-len(x[1]))[:40]:
    print(f"  C{k}: {len(v)} such commits -> " + '; '.join(f"{x['sha']} {x['date']} steps{x['steps_delta']:+d} exp{x['exp_delta']:+d}" for x in v[:3]))
