import json
d=json.load(open('nodes.json'))
uniq=json.load(open('uniq.json'))
want={o['id']:o for o in uniq}
found={}
def collect(n,acc):
    if n.get('visible') is False: return
    if n['type']=='TEXT':
        t=(n.get('characters') or '').strip()
        if t: acc.append(t)
    for c in n.get('children',[]): collect(c,acc)
def walk(n):
    if n['id'] in want and n['id'] not in found:
        acc=[]; collect(n,acc); found[n['id']]=acc
    for c in n.get('children',[]): walk(c)
for k,v in d['nodes'].items(): walk(v['document'])
out=[]
for o in uniq:
    o2=dict(o); o2['texts']=found.get(o['id'],[])
    out.append(o2)
json.dump(out,open('frames-with-texts.json','w'),indent=1)
with open('frame-texts.md','w') as f:
    for o in out:
        f.write(f"\n## {o['section']} / {o['name']} ({o['id']}) {o['w']}x{o['h']}\n")
        f.write(' | '.join(o['texts'][:220])+'\n')
print('frames with text:',sum(1 for o in out if o['texts']),'/',len(out))
