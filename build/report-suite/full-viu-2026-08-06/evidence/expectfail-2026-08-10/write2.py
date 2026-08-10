import sys,json,re
sys.path.insert(0,'/tmp/testrail'); import tr
BUILD='v3.5-4795eee'; DATE='8/10/2026'
SPEC={'TU':('Technician Utilization report specification version 6','Technician Utilization report specification version 7'),
      'WIP':('Work In Progress report specification version 9','Work In Progress report specification version 10')}
PLAN=[(30424,'TU','SV-8946'),(30418,'TU','SV-8953'),(30468,'WIP','SV-8967'),(43557,'WIP','SV-8967'),(30523,'WIP','SV-8967')]
log=[]
for cid,rep,tk in PLAN:
    st,c=tr.get_case(cid); assert st==200
    e=c['custom_expected']; n=e
    old,new=SPEC[rep]
    if old in n: n=n.replace(old,new)
    n2,c2=re.subn(r'Last checked against build \S+ on [\d/]+\.', f'Last checked against build {BUILD} on {DATE}.', n)
    assert c2==1,(cid,'build line',c2); n=n2
    # sanity: marker unchanged + still expect-fail on the same ticket, symptom retained
    assert n.count('This is the expected behaviour as per')==1,(cid,'prov')
    mk=re.findall(r'^AUTOMATION: .+$',n,re.M); assert len(mk)==1,(cid,'marker',mk)
    assert mk[0].startswith('AUTOMATION: READY - EXPECT FAIL'),(cid,'marker kind',mk)
    assert tk in mk[0],(cid,'ticket',mk)
    assert 'What you should see today' in n,(cid,'symptom must be kept')
    assert n.rstrip().endswith(mk[0]),(cid,'marker last')
    assert BUILD in n and 'v3.5-16cf83f' not in n and 'v3.5-7168d14' not in n,(cid,'build stamp')
    assert not re.search(r'<li>|<ol|<p>|<hr|<br',n),(cid,'raw markup')
    if n==e: print(f"C{cid}: NO CHANGE NEEDED"); continue
    payload={'title':c['title'],'custom_preconds':c['custom_preconds'],'custom_steps':c['custom_steps'],'custom_expected':n}
    stw,line,before,after=tr.update_case_verified(cid,payload,label='expectfail-restamp')
    print(f"C{cid} {tk} restamped  HTTP {stw}  {line}")
    log.append({'cid':cid,'ticket':tk,'http':stw,'verify':line})
json.dump(log,open('/tmp/ef/oplog-restamp.json','w'),indent=1)
print("DONE",len(log))
