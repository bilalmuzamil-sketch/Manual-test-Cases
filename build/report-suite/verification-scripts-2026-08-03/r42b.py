import json,re,csv
ours=json.load(open('rs-ours.json'))
idmap={}
for r in csv.DictReader(open('/home/user/Manual-test-Cases/build/report-suite/testrail-id-map.csv')):
    idmap[int(r['testrail_case_id'].lstrip('Cc'))]=r['internal_id']
# GENUINE closed-list patterns only
CLOSED=re.compile(r'(?:are|is|reads|lists|offers|holds|contains|has|includes|shows|opens|carries)\s+exactly\b'
                  r'|\bexactly the\b'
                  r'|in (?:this )?exact order'
                  r'|in order,? are exactly'
                  r'|\bonly these\b|\bno other\b|the complete list'
                  r'|these (?:three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+) (?:columns|options|items|headers|fields)'
                  r'|\bexactly (?:three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d+)\b', re.I)
VER=re.compile(r'\bspec v\d+\b|\bv\d+ 20\d\d-\d\d-\d\d|Confluence \d{9}|\bv-20\d\d-\d\d-\d\d')
COND=re.compile(r'single location in scope|more than one location|only when|when .{0,50}(?:in scope|is shown|are shown|is selected|enabled)', re.I)
out=[]
for c in ours:
    txt=' \n '.join([c.get('title') or '', c.get('custom_preconds') or '', c.get('custom_steps') or '', c.get('custom_expected') or ''])
    ms=CLOSED.findall(txt)
    if not ms: continue
    snips=[]
    for m in CLOSED.finditer(txt):
        s=max(0,m.start()-70); snips.append(txt[s:m.end()+110].replace('\n',' '))
    refs=c.get('refs') or ''
    out.append((idmap.get(c['id'],'?'),c['id'],bool(VER.search(refs)),bool(COND.search(txt)),snips[:2],refs[:130]))
print('GENUINE closed-list cases:',len(out))
print()
unp=[o for o in out if not o[2]]
print('=== NOT version-pinned (%d) ==='%len(unp))
for o in sorted(unp):
    print('C%-6s %-12s cond=%s'%(o[1],o[0],'Y' if o[3] else 'N'))
    for s in o[4]: print('     ...%s...'%s[:190])
    print('     REFS: %s'%o[5])
    print()
