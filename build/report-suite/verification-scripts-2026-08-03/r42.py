import json,re,csv
ours=json.load(open('rs-ours.json'))
idmap={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']
PATS=[('exactly',r'\bexactly\b'),('only these',r'only these'),('no other',r'no other'),
      ('complete list',r'the complete list'),('in order are',r'in order,? are'),
      ('nothing else',r'nothing else'),('and no more',r'and no more')]
VER=re.compile(r'\bv\d+\b|\bspec v|\b20\d\d-\d\d-\d\d\b|Confluence \d{9}')
COND=re.compile(r'single location in scope|more than one location|when .{0,40}(is|are) (?:shown|selected|enabled|in scope)|only when', re.I)
hits=[]
for c in ours:
    fields = ' \n '.join([c.get('title') or '', c.get('custom_preconds') or '', c.get('custom_steps') or '', c.get('custom_expected') or ''])
    m=[n for n,p in PATS if re.search(p,fields,re.I)]
    if not m: continue
    refs=c.get('refs') or ''
    pinned=bool(VER.search(refs))
    cond=bool(COND.search(fields))
    hits.append((c['id'],idmap.get(c['id'],'?'),m,pinned,cond,c['title'][:56]))
print('cases containing a closed-list phrase:',len(hits))
unpinned=[h for h in hits if not h[3]]
print()
print('*** NOT version-pinned in refs:',len(unpinned))
for h in sorted(unpinned,key=lambda x:x[1]):
    print('  C%-7s %-12s cond=%s  %s  | %s'%(h[0],h[1],'Y' if h[4] else 'N',','.join(h[2]),h[5]))
print()
worst=[h for h in hits if not h[3] and not h[4]]
print('*** neither pinned NOR scope-conditional:',len(worst))
for h in sorted(worst,key=lambda x:x[1]): print('  C%-7s %-12s %s | %s'%(h[0],h[1],','.join(h[2]),h[5]))
