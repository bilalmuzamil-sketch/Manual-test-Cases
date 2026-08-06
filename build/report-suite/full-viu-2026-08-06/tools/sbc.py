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
# ---- straightforward passes, observed live on v3.5-16cf83f 6 Aug 2026
for cid in [30111,30113,30117,30120,30122,30123,30128,30129,30130,30145,30153,30155,30157,30163,30169,30174,30175,30177,30178,30181,30187,30188,30189,30192,30193,38856]:
    P[cid]=(R,None,None)
# ---- expect-fail, each symptom observed this pass
P[30112]=(EF('SV-8962'), blk('the Customer filter has no magnifier icon on it - the only icon is the drop-down arrow','SV-8962'), None)
P[30116]=(EF('SV-8962'), blk('with two customers picked the closed control reads "2 customers" instead of "2 selected", and while you type the closed control keeps showing the summary label instead of what you typed','SV-8962'), None)
P[30142]=(EF('SV-8963'), blk('every column heading sorts except Location, which has no sort arrow and does not respond when you click it','SV-8963'), None)
P[30144]=(EF('SV-8963'), blk('sorting Margin % smallest-first puts the rows with a dash at the TOP, and largest-first puts them at the BOTTOM - the opposite way round','SV-8963'), None)
P[30166]=(EF('SV-8964'), blk('the Expanded View PDF comes out on A3 paper (1190 by 842 points) instead of A4. The Summary PDF from the same menu is correctly A4','SV-8964'), None)
P[30167]=(EF('SV-8937'), blk('the heading date range shows an end date one day LATER than the range you asked for - ask for 1 to 6 August and the PDF heading reads "Aug 1, 2026 - Aug 7, 2026". Every other line of the heading is correct, and the spreadsheet for the same view prints the correct end date','SV-8937'), None)
P[30176]=(EF('SV-8966'), blk('a remembered location or customer that is no longer usable is kept rather than dropped (the filter reads "1 selected" for something with no name), and a remembered date range that is no longer valid leaves the date control reading "Select Date Range" with an empty report instead of going back to This Month. Product Type and the chosen columns do fall back correctly','SV-8966'), None)
P[30185]=(EF('SV-8965'), blk('the outer cells of the table have about 14 pixels of side padding instead of 2rem (32 pixels)','SV-8965'), None)
P[30186]=(EF('SV-8965'), blk('the column headings, the customer rows and the totals row are all the pale blue-grey instead of white; the asset and invoice rows are a third, darker grey; and invoice rows are not indented any deeper than customer rows','SV-8965'), None)
# ---- Rule 42/57 repairs: remove assertions no source supports
P[30096]=(R,None,[('1. "Sales By Customer" is listed in the Performance group of the Reports left-side navigation, BELOW the pre-existing entries (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency) — the new reports are added below those items without moving them.',
 '1. "Sales By Customer" is listed in the Reports left-side navigation and can be opened from there.\n1a. Note for the tester: the written description says only that it appears in the Reports navigation - it does not say WHICH group it belongs in. Write down the group heading you find it under and carry on; do not fail the test on the group name. The product owner has been asked to settle which group each of the six new reports belongs in.')])
P[30114]=(R,None,[('4. After "Clear all": the report shows the empty-state message "No sales data found for the selected filters.", the totals row shows zeros, and the collapsed label reads "None."',
 '4. After "Clear all": the report shows the empty-state message "No sales data found for the selected filters." and the collapsed label reads "None."\n4a. Note for the tester: the written description does not say what the totals row should do when nothing matches, so do not fail the test on the totals row either way. Write down what you see - a row of zeros, or no totals row at all - and carry on. The product owner has been asked to settle it.')])
P[30173]=(R,None,[('a zero totals row','the header row')])
P[38912]=(None,None,[('"Multiple" on the totals row','"Multiple" where a row aggregates more than one location')])
# ---- honest holds: the condition could not be produced on this estate
P[30104]=(H('the calendar cannot be driven past the 366-day span from this harness; the back end refuses a wider range but the on-screen prevention was not seen'),None,None)
P[30131]=(H('this organisation has no service invoice without a vehicle, so nothing lands in the Parts Sales bucket from the service side'),None,None)
P[30132]=(H('this organisation has no reversed or voided invoice inside the report date range'),None,None)
P[30137]=(H('no customer in this organisation has two assets that produce the same label, so the numbered suffix cannot appear'),None,None)
P[30141]=(H('deleting a real invoice while the report is open is not something to do on a shared environment'),None,None)
P[30184]=(H('a failing data fetch cannot be forced from the application'),None,None)
P[43553]=(H('this organisation has a logo that loads correctly, so the set-but-will-not-load fallback cannot be produced'),None,None)
if __name__=='__main__':
    log=[];errs=[]
    for cid,(m,k,e) in sorted(P.items()):
        st,cur=tr.get_case(cid); exp=cur.get('custom_expected') or ''
        try: new=writer.rebuild(exp,marker=m,known=k,body_edits=e)
        except Exception as ex: errs.append((cid,'REBUILD '+str(ex)[:200])); print('SKIP C%d %s'%(cid,str(ex)[:160])); continue
        try:
            line=writer.write(cid,new,log=log); print('OK C%d %s'%(cid,line))
        except Exception as ex:
            errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:400])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs4/write/sbc-oplog.json','w'),indent=1)
    print('\nwrote',len(log),'errors',len(errs))
    for e in errs: print('  ',e)
