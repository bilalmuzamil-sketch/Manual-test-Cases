import json,re,csv
ours=json.load(open('rs-ours.json'))
sects={s['id']:s for s in json.load(open('rs-sections.json'))}
def chain(sid):
    out=[];s=sects.get(sid)
    while s: out.append(s['name']); s=sects.get(s['parent_id'])
    return list(reversed(out))
idmap={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']
# per-area permission phrasings
PER=re.compile(r'dedicated .{0,40}permission'
 r'|Sales By (?:Customer|Representative) .{0,10}View permission'
 r'|Inventory Reports\s*(?:→|->|>)?\s*View'
 r'|inventory[- ]reports permission'
 r'|Parts Velocity .{0,10}View permission'
 r'|Technician Utilization .{0,10}View permission'
 r'|Work In Progress .{0,10}View permission'
 r'|Inventory Value .{0,10}View permission'
 r'|report-specific permission'
 r'|per-report permission|report-level permission'
 r'|its own .{0,20}permission'
 r'|separate .{0,20}permission'
 r'|timesheet reports permission|permission that grants access to the timesheet', re.I)
hits=[]
for c in ours:
    txt=' \n '.join([c.get('title') or '', c.get('custom_preconds') or '', c.get('custom_steps') or '', c.get('custom_expected') or ''])
    for m in PER.finditer(txt):
        s=max(0,m.start()-120)
        hits.append((idmap.get(c['id'],'?'),c['id'],chain(c['section_id'])[1][:8],txt[s:m.end()+140].replace('\n',' ')))
        break
print('cases mentioning a per-area/report-specific permission:',len(hits))
for h in sorted(hits): print('\nC%-6s %-13s [%s]\n   ...%s...'%(h[1],h[0],h[2],h[3][:300]))
print()
# also list ALL permission-ish cases for a full read
print('=== ALL cases whose title/expected mention permission/access-denied ===')
n=0
for c in ours:
    txt=' '.join([c.get('title') or '', c.get('custom_expected') or ''])
    if re.search(r'permission', txt, re.I):
        n+=1
        print('C%-6s %-13s [%s] %s'%(c['id'],idmap.get(c['id'],'?'),chain(c['section_id'])[1][:8],c['title'][:66]))
print('total:',n)
