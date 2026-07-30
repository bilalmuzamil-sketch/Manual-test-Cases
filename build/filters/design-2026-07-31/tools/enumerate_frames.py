import json
d=json.load(open('nodes.json'))
LINKS={'11817:27678':'link1-Filters-canvas','11884:16885':'link2-Parts','11903:10573':'link3-Reports','11829:8908':'link4-Button-componentset'}
out=[]
def walk(n, req, path):
    t=n['type']
    if t in ('CANVAS','SECTION'):
        for c in n.get('children',[]):
            walk(c, req, path+[n.get('name','')])
    elif t in ('FRAME','COMPONENT_SET','COMPONENT','INSTANCE','GROUP'):
        out.append({'req':req,'id':n['id'],'name':n.get('name'),'type':t,'path':' / '.join([p for p in path if p]),
                    'w':round(n.get('absoluteBoundingBox',{}).get('width') or 0),
                    'h':round(n.get('absoluteBoundingBox',{}).get('height') or 0)})
for k,v in d['nodes'].items():
    walk(v['document'], k, [])
json.dump(out,open('frames.json','w'),indent=1)
print('TOTAL exportable top-level nodes:',len(out))
from collections import Counter
print(Counter(o['req'] for o in out))
for o in out: print(f"{LINKS[o['req']]:32} {o['id']:16} {o['type']:12} {o['w']:>5}x{o['h']:<5} {o['path'][:45]:45} | {o['name']}")
