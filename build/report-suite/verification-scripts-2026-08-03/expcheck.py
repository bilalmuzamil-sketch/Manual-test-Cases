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
# cases in an "Export" section
enum=re.compile(r'in (?:this|that) exact order|in order are exactly|are exactly:|headers, in order|these (?:ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|\d+) columns|columns in this order|the columns are')
print('%-8s %-9s %-11s %-4s %-4s %-4s  %s'%('REPORT','CASE','INTERNAL','ENUM','LOC','COND','TITLE'))
rows=[]
for c in ours:
    ch=chain(c['section_id'])
    if len(ch)<3: continue
    leaf=ch[-1]
    if 'export' not in leaf.lower() and 'download' not in leaf.lower(): continue
    er=(c.get('custom_expected') or '')
    has_enum = bool(enum.search(er))
    has_loc = 'Location' in er or 'Branch' in er
    cond = bool(re.search(r'single location in scope|more than one location', er))
    rows.append((ch[1][:7], c['id'], idmap.get(c['id'],'?'), has_enum, has_loc, cond, c['title'][:58]))
for r in sorted(rows):
    print('%-8s C%-8s %-11s %-4s %-4s %-4s  %s'%(r[0],r[1],r[2],'Y' if r[3] else '-','Y' if r[4] else '-','Y' if r[5] else '-',r[6]))
print()
print('TOTAL export-section cases:',len(rows))
bad=[r for r in rows if r[3] and not r[4]]
print('*** ENUMERATES COLUMNS BUT NO Location/Branch mention:',len(bad))
for r in bad: print('   ',r[0],'C%s'%r[1],r[2],r[6])
