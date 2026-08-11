import re, json
from scope import group, unmarkup
MARK=re.compile(r'^AUTOMATION:\s*(.+)$',re.M)
TK=re.compile(r'SV-\d+')
rows=[]
for r,n in ((4110,'Filters'),(4254,'Schedule')):
    for c in [x for x in group(r) if x['created_by']==3]:
        t=unmarkup(c.get('custom_expected') or '')
        for m in MARK.finditer(t):
            if 'EXPECT FAIL' in m.group(0).upper():
                mk=m.group(0).strip()
                rows.append({'proj':n,'id':c['id'],'title':c['title'],
                             'marker':mk,'tickets':sorted(set(TK.findall(mk))),
                             'body_tickets':sorted(set(TK.findall(t)))})
json.dump(rows,open('ef.json','w'),indent=1)
for x in rows:
    print(f"{x['proj']:9s} C{x['id']}  marker-tickets={','.join(x['tickets']) or 'NONE':22s} body={','.join(x['body_tickets'])}")
print()
allt=sorted({t for x in rows for t in x['tickets']})
print('distinct tickets named in markers:',len(allt))
print(' '.join(allt))
