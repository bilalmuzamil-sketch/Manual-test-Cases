import re,sys,json
T='/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06/_tools/'
new=set(l.strip() for l in open('c1_new.txt') if l.strip())
old=set(l.strip() for l in open('c1_old.txt') if l.strip())
for f in ['inv1.txt','inv1b.txt','inv1c.txt']:
    txt=open(T+f).read()
    segs=[]
    for line in txt.splitlines():
        line=re.sub(r'^##\S+\s*(\S+\s*::\s*)?','',line)
        line=re.sub(r'^«[^»]*»\s*\(\d+×\):\s*','',line)
        for s in line.split(' | '):
            s=s.strip()
            if s: segs.append(s)
    u=sorted(set(segs))
    miss=[s for s in u if s not in new]
    print(f,len(txt.splitlines()),'lines',len(u),'distinct segs; not in new board text:',len(miss), '; of those in old:',sum(1 for s in miss if s in old))
    for s in miss: print('   ',repr(s[:300]), 'OLD' if s in old else '')
