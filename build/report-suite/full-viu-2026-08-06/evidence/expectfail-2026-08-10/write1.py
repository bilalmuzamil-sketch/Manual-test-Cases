import sys,json,re,datetime
sys.path.insert(0,'/tmp/testrail'); import tr
BUILD='v3.5-4795eee'; DATE='8/10/2026'
SPEC={'TU':('Technician Utilization report specification version 6','Technician Utilization report specification version 7'),
      'WIP':('Work In Progress report specification version 9','Work In Progress report specification version 10')}
PLAN=[(30410,'TU','SV-8945'),(30423,'TU','SV-8947'),(30510,'WIP','SV-8907')]
SYMPT=re.compile(r'\nWhat you should see today.*?(?:If it PASSES[^\n]*\n)',re.S)
log=[]
for cid,rep,tk in PLAN:
    st,c=tr.get_case(cid)
    assert st==200, (cid,st)
    e=c['custom_expected']
    # 1. remove Rule-61 symptom block
    n,cnt=SYMPT.subn('\n',e)
    assert cnt==1, ('symptom block count',cid,cnt)
    # 2. spec version bump
    old,new=SPEC[rep]
    assert old in n, ('spec string missing',cid)
    n=n.replace(old,new)
    # 3. build re-stamp
    n2,c2=re.subn(r'Last checked against build \S+ on [\d/]+\.', f'Last checked against build {BUILD} on {DATE}.', n)
    assert c2==1, ('build line',cid,c2)
    n=n2
    # 4. marker -> READY
    n3,c3=re.subn(r'AUTOMATION: READY - EXPECT FAIL \([^)]*\)$','AUTOMATION: READY',n)
    assert c3==1, ('marker',cid,c3)
    n=n3
    # ---- SANITY CHECKS ON THE PAYLOAD SHAPE (Rule 50: the byte check proves fidelity, not correctness) ----
    assert n.count('This is the expected behaviour as per')==1, ('prov count',cid)
    assert len(re.findall(r'^AUTOMATION: ',n,re.M))==1, ('marker count',cid)
    assert n.rstrip().endswith('AUTOMATION: READY'), ('marker last',cid)
    assert 'What you should see today' not in n, ('symptom残',cid)
    assert tk not in n, ('ticket still referenced',cid)
    assert not re.search(r'<li>|<ol|<p>|<hr|<br',n), ('raw markup',cid)
    assert 'version 6 (' not in n and 'version 9 (' not in n, ('stale spec',cid)
    assert BUILD in n and 'v3.5-16cf83f' not in n, ('build stamp',cid)
    payload={'title':c['title'],'custom_preconds':c['custom_preconds'],'custom_steps':c['custom_steps'],'custom_expected':n}
    stw,line,before,after=tr.update_case_verified(cid,payload,label='expectfail-fixed')
    print(f"C{cid} {tk} -> READY  HTTP {stw}  {line}")
    log.append({'cid':cid,'ticket':tk,'http':stw,'verify':line})
json.dump(log,open('/tmp/ef/oplog-flips.json','w'),indent=1)
print("DONE",len(log))
