import json,re,html
A=json.load(open('source-update-2026-10-06/anchors-old-new.json'))
o,n=A['old'],A['new']
cases=json.load(open('snapshots-2026-10-06/chunk1-cases-before.json'))
if isinstance(cases,dict): cases=cases.get('cases',cases)
def norm(t):
    t=html.unescape(t).replace('->','→').replace('\\-','-')
    return re.sub(r'\s+',' ',t).strip()
cited={}
rows=[]
for c in cases:
    exp=c['custom_expected'] or ''
    qs=re.findall(r'<strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;',exp,re.S)
    for a,q in qs:
        a=html.unescape(a).strip(); q=norm(q)
        cited.setdefault(a,[]).append(c['id'])
        cur=n.get(a)
        parts=[p.strip(' .') for p in re.split(r'\.\.\.|…',q) if p.strip(' .')]
        if cur is None: st='ANCHOR-REMOVED' if a in o else 'NOT-A-SPEC-ANCHOR'
        else:
            st='OK' if all(p in cur for p in parts) else 'MISMATCH'
        rows.append((c['id'],a,st,q,cur))
import collections
print(len(cases),'cases;',len(rows),'quotes;',collections.Counter(r[2] for r in rows))
json.dump({'rows':rows,'cited':cited},open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/casecheck.json','w'),indent=1)
for r in rows:
    if r[2]!='OK': print(r[0],r[1],r[2],'| Q:',r[3][:300],'\n     CUR:',(r[4] or '')[:300])
unc=[a for a in n if a not in cited]
print('\nUNCITED current anchors',len(unc),unc)
print('\ncited anchors not in new',[a for a in cited if a not in n])
