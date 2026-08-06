# -*- coding: utf-8 -*-
"""Report Suite VIU session 4 - Work In Progress batch, build v3.5-f77875c."""
import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

def blk(sym, ticket, closed_note=None):
    extra = (' ' + closed_note) if closed_note else ''
    return ("What you should see today: %s. This is a known problem and it is already reported - see "
            "https://shopview.atlassian.net/browse/%s%s\n"
            "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
            "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
            "· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed."
            % (sym, ticket, extra))

R='AUTOMATION: READY'
def EF(t): return 'AUTOMATION: READY - EXPECT FAIL (%s)'%t
def H(r): return 'AUTOMATION: HOLD - %s'%r

P={}
# ---------- PASS (24) : marker READY, any stale deviation block stripped by rebuild()
for cid in [30457,30458,30459,30460,30462,30473,30482,30484,30485,30486,30490,
            30501,30502,30503,30504,30506,30507,30508,30509,30520,30521,30522,30525,38916]:
    P[cid]=(R,None,None)

# ---------- DEVIATIONS with a NEW ticket
P[30466]=(EF('SV-8987'), blk(
  'the columns are in exactly the order listed and every left-aligned column is correct, but the Last Activity '
  'column sits on the LEFT when it should be on the right - it is the only one in the right-aligned group that is wrong',
  'SV-8987'), None)
P[30491]=(EF('SV-8988'), blk(
  'the amount is right and it is correctly left out of Total Earned and Total Remaining, but the Estimates figure '
  'is NOT toned down - its label and its amount look exactly like every other figure in the strip',
  'SV-8988'), None)
P[30481]=(EF('SV-8989'), blk(
  'the figure is the quoted hours minus the worked hours, correctly signed, coloured green or red, and a zero '
  'reads unsigned - but it carries TWO decimal places (for example +0.50, +1.24, -0.81) where one is asked for',
  'SV-8989'), None)

# ---------- DEVIATIONS on tickets that already existed
P[30500]=(EF('SV-8908, SV-8968'),
 ("What you should see today: TWO separate known problems, both already reported.\n"
  "\u00b7 The filter reads \"All assets\", each option shows both the Unit # and the VIN, typing matches against EITHER of them, "
  "and a single Clear action appears once something is picked and returns it to \"All assets\" - all of that is right. But an asset "
  "that shares a Unit # with another asset is left out of the list, so typing the other one's VIN finds nothing. Six assets were "
  "affected on the test data when that was last checked. Reported as https://shopview.atlassian.net/browse/SV-8908\n"
  "\u00b7 Picking an asset sends a fresh request to the server instead of simply narrowing the rows already on screen. "
  "Reported as https://shopview.atlassian.net/browse/SV-8968\n"
  "\u00b7 If you see exactly those two things, mark this test FAILED and do not raise anything new.\n"
  "\u00b7 If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
  "\u00b7 If it PASSES, the fixes have shipped: tell the QA lead so the tickets can be closed and this note removed."), None)
P[30511]=(EF('SV-8907'), blk(
  'the download fails outright whenever the tab has any rows, so none of the checks below can be made from a real file; '
  'a tab with no rows does download, and that file does carry the right columns, the "Locations:" line and a Totals row',
  'SV-8907'), None)

# ---------- HOLD
_loc=('the written description contradicts itself about the Location column and the product owner has not yet ruled '
      '(Q5 on the question sheet)')
P[30467]=(H(_loc), None, None)
P[43551]=(H(_loc), None, None)
_snap='the nightly capture is written by a background process and nothing in the product reads it back in this version'
for cid in [30528,30530,30531,30533]:
    P[cid]=(H(_snap), None, None)

if __name__=='__main__':
    log=[]; errs=[]
    for cid,(m,k,e) in sorted(P.items()):
        st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
        try: new=writer.rebuild(exp,marker=m,known=k,body_edits=e)
        except Exception as ex:
            errs.append((cid,'REBUILD '+str(ex)[:200])); print('SKIP C%d %s'%(cid,str(ex)[:170])); continue
        try: print('OK C%d %s'%(cid,writer.write(cid,new,log=log)))
        except Exception as ex:
            errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:400])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs5/wip2-oplog.json','w'),indent=1)
    print('wrote',len(log),'errors',len(errs))
