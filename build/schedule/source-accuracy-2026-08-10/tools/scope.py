import json
secs=json.load(open('sections.json')); byid={s['id']:s for s in secs}
kids={}
for s in secs: kids.setdefault(s.get('parent_id'), []).append(s['id'])
def subtree(root):
    out=[]; stack=[root]
    while stack:
        x=stack.pop(); out.append(x); stack.extend(kids.get(x,[]))
    return set(out)
cases=json.load(open('all-cases.json'))
def group(root):
    ss=subtree(root)
    return [c for c in cases if c['section_id'] in ss]
if __name__=='__main__':
    for r,name in ((4110,'Filters'),(4254,'Schedule')):
        g=group(r)
        from collections import Counter
        print(name, r, 'cases', len(g), 'created_by', dict(Counter(c['created_by'] for c in g)))
