import sys, json, time
sys.path.insert(0,'/tmp/testrail')
import tr
ops={o['cid']:o for o in json.load(open('ops.json'))}
target=sys.argv[1]
sel=[o for o in ops.values() if o['proj']==target]
sel.sort(key=lambda o:o['cid'])
log=[]
print(f"=== {target}: {len(sel)} update_case ===")
for i,o in enumerate(sel,1):
    cid=o['cid']
    st0,live=tr.get_case(cid)
    assert st0==200, live
    if live['custom_expected']!=o['old']:
        print(f"  !! C{cid} DRIFTED since payload build - STOPPING"); 
        log.append({'op':i,'cid':cid,'status':'ABORT-DRIFT'}); break
    payload={'custom_preconds':live.get('custom_preconds'),
             'custom_steps':live.get('custom_steps'),
             'custom_expected':o['new']}
    try:
        st,line,before,after=tr.update_case_verified(cid,payload,label=o['action'])
    except Exception as e:
        print(f"  !! C{cid} VERIFICATION FAILED - STOPPING BATCH\n{e}")
        log.append({'op':i,'cid':cid,'status':'FAIL','err':str(e)}); break
    print(f"  [{i:2d}/{len(sel)}] C{cid} {o['action']:12s} HTTP {st}  {line.split(': ',1)[1]}")
    log.append({'op':i,'cid':cid,'action':o['action'],'http':st,'verify':'MATCH','fields':line})
    time.sleep(0.15)
json.dump(log,open(f'oplog-{target}.json','w'),indent=1)
okc=sum(1 for l in log if l.get('verify')=='MATCH')
print(f"{target}: {okc} of {len(sel)} written and byte-verified")
