# -*- coding: utf-8 -*-
import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr
P={30173:('AUTOMATION: READY',None,[('2. The file contains the column headers and a totals row of zeros, with no data rows.',
 '2. The file contains the column headers and no data rows.\n2a. Note for the tester: the written description does not say whether a no-match download should also carry a totals row, so do not fail the test either way on that. Write down what you see - a totals row of zeros, or no totals row - and carry on. The product owner has been asked to settle it.')])}
log=[];errs=[]
for cid,(m,k,e) in P.items():
    st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
    try:
        new=writer.rebuild(exp,marker=m,known=k,body_edits=e)
        print(writer.write(cid,new,log=log))
    except Exception as ex: errs.append((cid,str(ex))); print('FAIL',cid,str(ex)[:300])
json.dump({'log':log,'errs':errs},open('/tmp/rs4/write/sbc2-oplog.json','w'),indent=1)
