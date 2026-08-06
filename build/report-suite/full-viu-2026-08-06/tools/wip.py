# -*- coding: utf-8 -*-
import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr
def blk(sym,t):
    return ("What you should see today: %s. This is a known problem and it is already reported - see "
            "https://shopview.atlassian.net/browse/%s\n"
            "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
            "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
            "· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed."%(sym,t))
R='AUTOMATION: READY'
def EF(t): return 'AUTOMATION: READY - EXPECT FAIL (%s)'%t
def H(r): return 'AUTOMATION: HOLD - %s'%r
P={}
for cid in [30451,30452,30455,30469,30470,30471,30472,30474,30479,30483,30487,30488,30489,30493,30494,30495,30524]:
    P[cid]=(R,None,None)
WO='the WO number is plain black text with nothing to click, for every user - the whole table contains no links at all, and this was checked as an administrator who does hold Work Orders access'
P[30468]=(EF('SV-8967'), blk(WO,'SV-8967'), None)
P[43557]=(EF('SV-8967'), blk('the second half is right - a person without Work Orders access sees plain text - but so does a person WHO HAS that access, so the first half of this test cannot pass: '+WO,'SV-8967'), None)
P[30523]=(EF('SV-8967'), blk('there is no WO number link to put keyboard focus on, because the WO number is plain text for everyone','SV-8967'), None)
P[30498]=(EF('SV-8968'), blk('ticking an advisor sends a fresh request to the server and the table is rebuilt from the answer, instead of simply hiding the rows on screen. The list of advisors itself is right - it covers the whole scope','SV-8968'), None)
P[30499]=(EF('SV-8969'), blk('the Clear action is offered before anything is selected - the list reads "All customers", "Clear all", then the customers, with nothing yet picked. Separately, ticking a customer reloads from the server instead of narrowing on screen, which is reported as SV-8968','SV-8969'), None)
P[30505]=(EF('SV-8968'), blk('each filter change sends a fresh request to the server rather than recomputing on screen. The figures themselves are right - the Totals row and the summary strip do agree with what is left visible','SV-8968'), None)
P[30519]=(EF('SV-8970'), blk('the whole table - headings, data rows and the Totals row - is the pale blue-grey rather than white. There is correctly no alternating shading','SV-8970'), None)
if __name__=='__main__':
    log=[];errs=[]
    for cid,(m,k,e) in sorted(P.items()):
        st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
        try: new=writer.rebuild(exp,marker=m,known=k,body_edits=e)
        except Exception as ex: errs.append((cid,'REBUILD '+str(ex)[:160])); print('SKIP C%d %s'%(cid,str(ex)[:150])); continue
        try: print('OK C%d %s'%(cid,writer.write(cid,new,log=log)))
        except Exception as ex: errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:300])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs4/write/wip-oplog.json','w'),indent=1)
    print('wrote',len(log),'errors',len(errs))
