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
P={}
P[30102]=(R,None,None)
P[30105]=(EF('SV-8955'), blk('the address bar never changes - it stays at the plain report address after the range is applied, so there is nothing to copy and share','SV-8955'), None)
P[30107]=(R,None,None)
P[30115]=(R,None,None)
P[30121]=(R,None,None)
P[30124]=(R,None,None)
P[30125]=(R,None,None)
P[30126]=(R,None,None)
P[30133]=(R,None,None)
P[30134]=(R,None,None)
P[30138]=(R,None,None)
P[30139]=(R,None,None)
P[30140]=(R,None,None)
P[30143]=(R,None,None)
P[30149]=(R,None,None)
P[30150]=(R,None,None)
P[30151]=(R,None,None)
P[30152]=(R,None,None)
P[30154]=(R,None,None)
P[30156]=(R,None,None)
P[30159]=(R,None,None)
P[30160]=(EF('SV-8956'), blk('the two spreadsheets come out as sales-by-customer-summary.csv and sales-by-customer-expanded.csv, with no period in either name. The files themselves do carry a "Date Range:" line, so the information is there, just not in the name','SV-8956'), None)
P[30161]=(R,None,None)
P[30168]=(R,None,None)
P[30190]=(R,None,None)
if __name__=='__main__':
    log=[];errs=[]
    for cid,(m,k,e) in sorted(P.items()):
        st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
        try: new=writer.rebuild(exp,marker=m,known=k,body_edits=e)
        except Exception as ex: errs.append((cid,'REBUILD '+str(ex))); print('SKIP C%d %s'%(cid,ex)); continue
        try:
            line=writer.write(cid,new,log=log); print('OK C%d %s'%(cid,line))
        except Exception as ex:
            errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:300])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs3/write/sbc-oplog.json','w'),indent=1)
    print('written',len(log),'errors',len(errs))
