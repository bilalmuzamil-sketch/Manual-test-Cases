import sys,re,json,collections
sys.path.insert(0,'/tmp/testrail'); import tr
PROV=re.compile(r'^This is the expected behaviour',re.M); LC=re.compile(r'^Last checked against build',re.M)
MK=re.compile(r'^AUTOMATION: (READY - EXPECT FAIL \([^)]*\)|READY|HOLD - .+)$',re.M)
MKANY=re.compile(r'AUTOMATION:',re.M)
BAR=re.compile(r'as per the build tested on|verified by the build',re.I)
RAW=re.compile(r'<li>|<ol|<p>|<hr|<br')
old=json.load(open('/tmp/rs4/live-4281.json'))
oldc={c['id']:c for c in old['cases']}; secs=old['sections']
cases=[]; off=0
while True:
    st,b=tr.api(f"get_cases/1&suite_id=1&limit=250&offset={off}")
    ch=b['cases'] if isinstance(b,dict) else b; cases+=ch
    if len(ch)<250: break
    off+=250
want=set(int(k) for k in secs)
mine=[c for c in cases if c['section_id'] in want]
ours=[c for c in mine if c['created_by']==3]; foreign=[c for c in mine if c['created_by']!=3]
print("LIVE under 4281: %d (ours %d, foreign %d)"%(len(mine),len(ours),len(foreign)))
# foreign untouched BY CONTENT
FLD=['title','custom_preconds','custom_steps','custom_expected','refs','section_id','type_id','priority_id','custom_atmstatus','custom_automation_type','updated_on','updated_by']
fdiff=[]
for c in foreign:
    o=oldc.get(c['id'])
    for f in FLD:
        if (o or {}).get(f)!=c.get(f): fdiff.append((c['id'],f))
print("FOREIGN C38919-38923 field diffs:",fdiff or 'NONE - byte-identical by content')
touched=set(json.load(open('/tmp/rs4/write/sbc-oplog.json'))['log'][i]['cid'] for i in range(len(json.load(open('/tmp/rs4/write/sbc-oplog.json'))['log'])))
touched|= {30173,30096,30114}
untouched=[c for c in ours if c['id'] not in touched]
udiff=[]
for c in untouched:
    o=oldc.get(c['id'])
    if not o: udiff.append((c['id'],'NEW')); continue
    for f in FLD:
        if o.get(f)!=c.get(f): udiff.append((c['id'],f))
print("UNTOUCHED ours (%d) field diffs: %s"%(len(untouched), udiff or 'NONE - byte-identical by content incl. updated_on/updated_by'))
# census
prob=[]; mk=collections.Counter(); builds=collections.Counter(); nb=[]
for c in ours:
    e=c.get('custom_expected') or ''
    p,l,m=len(PROV.findall(e)),len(LC.findall(e)),len(MKANY.findall(e))
    last=e.rstrip().split('\n')[-1]
    if p!=1: prob.append((c['id'],'prov=%d'%p))
    if m!=1: prob.append((c['id'],'marker=%d'%m))
    if not last.startswith('AUTOMATION:'): prob.append((c['id'],'marker not last'))
    if BAR.search(e): prob.append((c['id'],'BARRED PHRASE'))
    if RAW.search((c.get('custom_preconds') or '')+(c.get('custom_steps') or '')+e): prob.append((c['id'],'raw markup'))
    mm=MK.search(e)
    if mm: mk['READY - EXPECT FAIL' if 'EXPECT FAIL' in mm.group(1) else ('HOLD' if mm.group(1).startswith('HOLD') else 'READY')]+=1
    bl=re.findall(r'Last checked against build (\S+?) on ([0-9/]+)',e)
    if bl: builds[(bl[-1][0],bl[-1][1])]+=1
    else: nb.append(c['id'])
print("\nMARKERS:",dict(mk),'sum',sum(mk.values()))
print("BUILD LINES:",{f"{k[0]} {k[1]}":v for k,v in builds.most_common()})
print("no build line:",len(nb),sorted(nb))
print("\nCENSUS PROBLEMS:",len(prob))
for x in prob[:40]: print("  ",x)
json.dump({'ours':[c['id'] for c in ours],'problems':prob},open('/tmp/rs4/census.json','w'))
