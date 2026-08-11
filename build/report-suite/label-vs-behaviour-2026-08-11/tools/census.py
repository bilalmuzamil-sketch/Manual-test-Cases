import sys,json,re,time; sys.path.insert(0,'/tmp')
from trlib import tr
tag=sys.argv[1]
def getall2(path,key):
    out=[];off=0
    while True:
        r=tr(f"{path}&limit=250&offset={off}")
        ch=r[key] if isinstance(r,dict) else r
        out+=ch
        if len(ch)<250: break
        off+=250
    return out
secs=getall2('get_sections/1&suite_id=1','sections'); byid={s['id']:s for s in secs}
def p(s):
    o=[];c=s
    while c: o.append(c['name']); c=byid.get(c['parent_id'])
    return ' / '.join(reversed(o))
paths={s['id']:p(s) for s in secs}
cases=[c for c in getall2('get_cases/1&suite_id=1','cases') if paths.get(c['section_id'],'').startswith('Reports Suite')]
TGT={'Sales By Customer Report','Work In Progress','Technician Utilization'}
sel=[c for c in cases if len(paths[c['section_id']].split(' / '))>1
     and paths[c['section_id']].split(' / ')[1] in TGT and c['created_by']==3]
MK=re.compile(r'</?(ol|li|ul|p|br|div|span|table|tr|td|th|strong|em)\b[^>]*>',re.I)
bad=[]
for c in sel:
    hits=set()
    for k in ('title','custom_preconds','custom_steps','custom_expected'):
        for m in MK.findall(c.get(k) or ''): hits.add(m.lower())
    if hits: bad.append((c['id'],sorted(hits)))
print(f'[{tag}] cases={len(sel)}  raw-markup cases={len(bad)}')
for i,h in bad: print('   C%d %s'%(i,h))
json.dump({'tag':tag,'ts':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),
           'count':len(sel),'markup':bad},open('/tmp/lb_census_%s.json'%tag,'w'),indent=1)
