import json,glob,os
live=json.load(open('/tmp/live_ours2.json'))
sec=json.load(open('/tmp/sec_names.json'))

# touched C-ids this pass (updates)
TOUCHED=[30152,30162,30221,30226,30230,30231,30236,30287,30291,30306,30309,30481,30495,30512,30513,30525,38894,  # simple
 30124,30142,30149,30156,30161,30169,38856,30151,30218,30235,30241,30265,30229,30279,30278,30285,30286,38913,30466,30507,30467, # complex
 30501,30502,30508,30511,38918,43551,30456,30457,30459,30460,30462,30464,43557, # WIP
 30470,30234]  # item5 + contradiction fix

# new cases: C-id -> internal id + section + area
NEWMAP={43832:('SBC-EXP-18',4300),43833:('SBR-EXP-17',4322),43834:('PV-EXP-13',4335),
 43835:('TU-EXP-11',4346),43836:('WIP-EXP-11',4360),43837:('IV-EXP-11',4373),
 43838:('WIP-VIS-08',4361),43839:('SBR-VIS-06',4326),43840:('SBC-VIS-04',4303)}

# build C-id -> (file, idx)
files={f:json.load(open(f)) for f in sorted(glob.glob('build/report-suite/cases/cases-*.json'))}
cidmap={}
for f,arr in files.items():
    for i,c in enumerate(arr):
        t=c.get('testrail_id','')
        if t and t.startswith('C'): cidmap[int(t[1:])]=(f,i)

missing=[c for c in TOUCHED if c not in cidmap]
print('touched not found in local (will match by title):',missing)

def L2list(s): return (s or '').split('\n')
# update touched
upd=0
for cid in TOUCHED:
    if cid not in cidmap: continue
    f,i=cidmap[cid]; c=files[f][i]; lc=live[str(cid)]
    c['title']=lc['title']
    c['preconditions']=L2list(lc.get('custom_preconds',''))
    c['steps']=L2list(lc.get('custom_steps',''))
    c['expected']=lc.get('custom_expected','')
    c['refs']=lc.get('refs','')
    c['spec_ref']=lc.get('refs','')  # import References column
    upd+=1
print('updated touched:',upd)

# handle the missing-by-title (SBR-CALC-04 etc.) — try match by live title
for cid in missing:
    lc=live[str(cid)]; t=lc['title']
    found=False
    for f,arr in files.items():
        for i,c in enumerate(arr):
            if c.get('title')==t or c.get('testrail_id')=='' and False:
                pass
    # can't safely match; report
    print('  could not resync C%d (%s) - not in local by testrail_id'%(cid,t[:40]))

# add 9 new cases
nc=json.load(open('/tmp/new_cases.json'))
# map old internal id -> new internal id
IDREN={'SBC-EXP-17':'SBC-EXP-18','SUITE-VIS-TAB-01':'WIP-VIS-08','SUITE-VIS-HDR-01':'SBR-VIS-06','SUITE-VIS-GRP-01':'SBC-VIS-04'}
created={c[1]:c for c in json.load(open('build/report-suite/fabian-review-2026-08-17/new-created-ids.json'))}
# file to append per section
def file_for_section(sec_id):
    # pick the file that already holds cases in that section
    best=None
    for f,arr in files.items():
        for c in arr:
            if c.get('section_id')==sec_id: return f
    return None
addln=0
for o in nc:
    iid=IDREN.get(o['id'],o['id'])
    secid=o['section_id']; area=sec.get(str(secid),'')
    # find C-id from created-ids by internal id
    cid=None
    for c in json.load(open('build/report-suite/fabian-review-2026-08-17/new-created-ids.json')):
        if c[0]==o['id']: cid=c[1]; break
    rec={'id':iid,'area':area,'title':o['title'],'priority':'High','type':'Functional',
      'permissions_required':'the ordinary reports access (Reports section View).',
      'preconditions':L2list(o['preconds']),'steps':L2list(o['steps']),'expected':o['expected'],
      'design_ref':'','spec_ref':o['refs'],'viu_status':'VIU-Pending','notes':'',
      'api_related':False,'refs':o['refs'],'testrail_id':'C%d'%cid,'section_id':secid}
    f=file_for_section(secid)
    if f is None:
        f='build/report-suite/cases/cases-fabian-new-2026-08-17.json'
        files.setdefault(f,[])
    files[f].append(rec); addln+=1
print('added new:',addln)

# write back all files
for f,arr in files.items():
    json.dump(arr, open(f,'w'), indent=1)
print('local mirror written')
