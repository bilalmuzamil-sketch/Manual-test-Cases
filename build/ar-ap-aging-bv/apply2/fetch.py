# Pull every live case in group 90418 (all child sections), paged, into apply2/live.json.
import sys,json,os; sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
secs=[];off=0
while True:
    r=L.call(f'get_sections/1&suite_id=1&offset={off}'); secs+=r['sections']; 
    if not r['_links']['next']: break
    off+=250
kids={90418}; ch=True
while ch:
    ch=False
    for s in secs:
        if s['parent_id'] in kids and s['id'] not in kids: kids.add(s['id']); ch=True
out={}
for sid in sorted(kids):
    off=0
    while True:
        r=L.call(f'get_cases/1&suite_id=1&section_id={sid}&offset={off}')
        for c in r['cases']:
            if c['section_id']==sid: out[str(c['id'])]=c
        if not r['_links']['next']: break
        off+=250
json.dump(out,open(f'{D}/live.json','w'),indent=0)
json.dump([s for s in secs if s['id'] in kids],open(f'{D}/sections.json','w'),indent=1)
print(len(out),'cases in',len(kids),'sections')
