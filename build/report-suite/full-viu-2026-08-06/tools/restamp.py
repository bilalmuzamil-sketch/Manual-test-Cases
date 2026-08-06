# -*- coding: utf-8 -*-
"""The QA branch redeployed 8 minutes into this pass: v3.5-16cf83f -> v3.5-7168d14,
index.html last-modified Thu 06 Aug 2026 08:32:37 GMT. The observations therefore
belong to v3.5-7168d14, not to the marker read at 08:24:28Z. Correct every build line
this pass wrote (Rule 12: never let a case claim a build it was not checked on)."""
import sys,json,re
sys.path.insert(0,'/tmp/testrail'); import tr
IDS=json.load(open('/tmp/rs4/restamp_ids.json'))
OLD='Last checked against build v3.5-16cf83f on 8/6/2026.'
NEW='Last checked against build v3.5-7168d14 on 8/6/2026.'
log=[];errs=[];skip=[]
for cid in IDS:
    st,c=tr.get_case(cid); e=c['custom_expected']
    if OLD not in e:
        skip.append((cid,'no v3.5-16cf83f 8/6 line')); print('SKIP C%d'%cid); continue
    new=e.replace(OLD,NEW)
    assert new.count(NEW)==1 and 'v3.5-16cf83f' not in new
    payload={'custom_preconds':c.get('custom_preconds') or '','custom_steps':c.get('custom_steps') or '','custom_expected':new}
    try:
        st2,line,b,a=tr.update_case_verified(cid,payload,'update_case')
        log.append({'cid':cid,'http':st2,'verify':line}); print('OK C%d %s'%(cid,line))
    except Exception as ex:
        errs.append((cid,str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:300])); break
json.dump({'log':log,'errs':errs,'skip':skip},open('/tmp/rs4/write/restamp-oplog.json','w'),indent=1)
print('wrote',len(log),'errors',len(errs),'skipped',len(skip))
