# -*- coding: utf-8 -*-
import sys,json,re
sys.path.insert(0,'/tmp/testrail'); import tr
IDS=[30278,43550,43551,43557,43558,43559]
NOTE='This case has not yet been checked against any build.'
log=[];errs=[]
for cid in IDS:
    st,c=tr.get_case(cid); e=c['custom_expected']
    if 'Last checked against build' in e or NOTE in e:
        print('SKIP C%d already has a sentence 2'%cid); continue
    m=re.search(r'^AUTOMATION: .*$',e,re.M)
    if not m: errs.append((cid,'no marker')); print('SKIP C%d no marker'%cid); continue
    head=e[:m.start()].rstrip('\n'); marker=m.group(0)
    new=head+'\n'+NOTE+'\n\n'+marker
    payload={'custom_preconds':c.get('custom_preconds') or '','custom_steps':c.get('custom_steps') or '','custom_expected':new}
    try:
        st2,line,b,a=tr.update_case_verified(cid,payload,'update_case')
        log.append({'cid':cid,'http':st2,'verify':line}); print('OK C%d %s'%(cid,line))
    except Exception as ex:
        errs.append((cid,str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:300])); break
json.dump({'log':log,'errs':errs},open('/tmp/rs4/write/nobuild-oplog.json','w'),indent=1)
print('wrote',len(log),'errors',len(errs))
