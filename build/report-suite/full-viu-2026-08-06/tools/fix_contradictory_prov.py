# -*- coding: utf-8 -*-
"""Remove the self-contradictory 'not yet been checked against a build' sentence from cases that
ALSO carry a real 'Last checked against build ...' sentence (Rule 54: the two cannot coexist).
The build stamp is deliberately NOT refreshed - these cases were not re-observed in this session."""
import sys, json, re
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

CIDS=[30278,38856,43552,43553,43557]
STALE=[
 'This case has not yet been checked against any build.',
 'This has not yet been checked against a build.',
]
if __name__=='__main__':
    log=[];errs=[];report=[]
    for cid in CIDS:
        st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
        if 'Last checked against build' not in exp:
            errs.append((cid,'NO real build sentence - would not be a contradiction; skipped')); continue
        new=exp; removed=[]
        for s in STALE:
            n=new.count(s)
            if n:
                removed.append('%s x%d'%(s,n))
                new=new.replace('\n'+s,'').replace(s,'')
        new=re.sub(r'\n{3,}','\n\n',new)
        if new==exp:
            errs.append((cid,'nothing to remove')); continue
        report.append({'cid':cid,'removed':removed})
        try: print('OK C%d  removed %s  | %s'%(cid,removed,writer.write(cid,new,log=log)))
        except Exception as ex:
            errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:300])); break
    json.dump({'log':log,'errs':errs,'report':report},open('/tmp/rs5/fixprov-oplog.json','w'),indent=1)
    print('wrote',len(log),'errors',len(errs))
