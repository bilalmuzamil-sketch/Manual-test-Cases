# -*- coding: utf-8 -*-
import sys, json, re, html
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

def blk(symptom, ticket):
    return ("What you should see today: %s. This is a known problem and it is already reported - see "
            "https://shopview.atlassian.net/browse/%s\n"
            "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
            "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
            "· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed."
            % (symptom, ticket))

# cid -> (marker, known_block_or_None, body_edits_or_None)
P = {}
R='AUTOMATION: READY'
def EF(t): return 'AUTOMATION: READY - EXPECT FAIL (%s)' % t
def H(r): return 'AUTOMATION: HOLD - %s' % r

P[30393]=(R,None,None)
P[30394]=(EF('SV-8943'), blk('the Location filter reads "All locations" and the table returns rows from both Staging Heavy Duty - 9919 and Staging Lethbridge - 4310, instead of opening on the one location shown beside your name. The date range half is correct - it reads This Month','SV-8943'), None)
P[30395]=(R,None,None)
P[30396]=(R,None,None)
P[30397]=(R,None,None)
P[30398]=(H('needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment'),None,None)
P[30399]=(R,None,None)
P[30401]=(R,None,None)
P[30402]=(R,None,None)
P[30403]=(R,None,None)
P[30404]=(R,None,None)
P[30405]=(R,None,None)
P[30406]=(R,None,None)
P[30407]=(H('no location on this environment is set up without a default labor rate, so the em-dash state cannot be produced'),None,None)
P[30408]=(H('no location on this environment is set up without a default labor rate, so a part-valued row cannot be produced'),None,None)
P[30409]=(R,None,None)
P[30410]=(EF('SV-8945'), blk('items 1, 2, 3 and 5 pass, but item 4 does not: every click on a column heading sends a fresh request to the server and the rows come back from there, instead of the rows already on screen being reordered','SV-8945'), None)
P[30411]=(R,None,None)
P[30412]=(R,None,None)
P[30413]=(H('no technician on this environment has an em-dash in Est. Lost Labor, because both locations have a default labor rate'),None,None)
P[30414]=(R,None,None)
P[30415]=(R,None,None)
P[30416]=(R,None,None)
P[30417]=(R,None,None)
P[30418]=(EF('SV-8953'), blk('items 1 and 2 pass - the control is there and its name reads "Expand Christian Pitts\'s daily breakdown" and then "Collapse Christian Pitts\'s daily breakdown" - but item 3 does not: the control never reports its open or closed state to a screen reader','SV-8953'), None)
P[30419]=(R,None,None)
P[30420]=(R,None,None)
P[30421]=(EF('SV-8953'), blk('items 1, 2 and 3 pass, but item 4 does not: the control never reports its open or closed state to a screen reader, only its name','SV-8953'), None)
P[30422]=(R,None,None)
P[30423]=(EF('SV-8947'), blk('the filter is labelled "Technician" and not "Filter by Technician". Everything else in this test passes - every technician is selected on a first visit and every row is shown','SV-8947'),
  [('1. The toolbar has a filter labeled "Technician" that allows selecting more than one technician (when several are chosen its label reads, for example, "2 technicians").',
    '1. The toolbar has a filter labeled "Filter by Technician" that allows selecting more than one technician (when several are chosen its label reads, for example, "2 technicians").')])
P[30424]=(EF('SV-8946'), blk('items 1, 2 and 4 pass - the row hides, the Summary recalculates and re-selecting brings it back - but item 3 does not: the report reloads from the server when you tick or untick a technician','SV-8946'), None)
P[30425]=(EF('SV-8947'), blk('the control that selects everybody is labelled "All technicians" and not "Select all". The behaviour itself passes - clearing everybody really does deselect the whole list, and a technician you deselected stays deselected when you change the date range','SV-8947'),
  [('1. "Clear all" sets every currently-listed technician to deselected; "All technicians" selects all technicians at once.',
    '1. "Clear all" sets every currently-listed technician to deselected; "Select all" selects all technicians at once.')])
P[30426]=(R,None,None)
P[30428]=(R,None,None)
P[30429]=(R,None,None)
P[30430]=(EF('SV-8944'), blk('the two totals do not match. Andrew Wade reads 1080.44 on Technician Utilization and 1080.64 on Timesheet Activities for the same dates and the same single location, and six of the eight technicians checked disagree by up to 0.25 hours','SV-8944'), None)
P[30431]=(H('needs a technician clocked in at the moment of the test, and no technician on this environment is currently clocked in'),None,None)
P[30432]=(R,None,None)
P[30433]=(R,None,None)
P[30434]=(EF('SV-8881'), blk('the four items read "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)" and "Expanded (CSV)" - without the word "Download" and without the word "View". Item 1 passes: the three-dot menu is leftmost with the Column Selection control immediately after it','SV-8881'),
  [('3. Note for the tester: on this build the four items are worded more briefly - "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)" and "Expanded (CSV)" - without the word "Download". The product owner has decided they must match the other two reports, so record what you see; the change is with the developers.','')])
P[30435]=(EF('SV-8950'), blk('both PDFs stop at the last technician - neither contains the Summary row - and the file names come out lower-case as technician-utilization-summary.pdf and technician-utilization-expanded.pdf rather than Title-Case. The per-day breakdown itself is in the Expanded PDF, correctly','SV-8950'), None)
P[30436]=(EF('SV-8951'), blk('there are two spreadsheet files, not one: technician-utilization-summary.csv and technician-utilization-expanded.csv, and the expanded one holds a row for each day as well. Neither contains the Summary row. The comma quoting in item 3 does pass - "$7,248.85" comes out wrapped in double quotes','SV-8951'), None)
P[30437]=(EF('SV-8948'), blk('item 1 does not pass: a technician you untick is still in every downloaded file. Items 2, 3, 4 and 5 do pass - the location, the date range, the "Locations:" line and the shown columns are all carried into the files correctly','SV-8948'), None)
P[30438]=(EF('SV-8949'), blk('item 2 does not pass: the rows in both the spreadsheet and the PDF come out in no recognisable order - they begin Alexander Cohen, Brittany Anderson, Colleen Guerrero, Wesley Mcclure, Jacob Chung - even though the screen was in its normal A to Z order. Item 1 passes','SV-8949'), None)
P[30439]=(R,None,None)
P[30440]=(EF('SV-8948'), blk('the download is not silent: a file still arrives, holding every technician, and a message reads "Success / Data exported successfully."','SV-8948'), None)
P[30441]=(EF('SV-8952'), blk('a download that starts shows "Success / Data exported successfully." instead of "Download started", and a download that fails shows no message at all','SV-8952'), None)
P[30443]=(R,None,None)
P[30444]=(R,None,None)
P[30446]=(H('needs a second sign-in as a user who can reach only one location, and there is one shared sign-in on this environment'),None,None)
P[30447]=(R,None,None)
P[30448]=(R,None,None)
P[30449]=(R,None,None)
P[30450]=(EF('SV-8945'), blk('items 1 and 2 pass, but items 3 and 4 do not: ticking a technician in the technician filter sends a request to the server, and so does every click on a column heading','SV-8945'), None)
P[43552]=(EF('SV-8951'), blk('the two spreadsheets are not the same: the Expanded one holds a row for each day beneath each technician. Neither file holds the Summary row. The comma quoting in item 4 does pass. The two names, for the record, are technician-utilization-summary.csv and technician-utilization-expanded.csv','SV-8951'), None)

if __name__=='__main__':
    log=[]; errs=[]
    for cid,(marker,known,edits) in sorted(P.items()):
        st,cur=tr.get_case(cid)
        exp=cur.get('custom_expected') or ''
        try:
            new=writer.rebuild(exp, marker=marker, known=known, body_edits=edits)
        except Exception as e:
            errs.append((cid,'REBUILD: '+str(e))); print('SKIP C%d %s'%(cid,e)); continue
        try:
            line=writer.write(cid,new,log=log)
            print('OK C%d %s'%(cid,line))
        except Exception as e:
            errs.append((cid,'WRITE: '+str(e))); print('FAIL C%d %s'%(cid,str(e)[:400])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs3/write/tu-oplog.json','w'),indent=1)
    print('written',len(log),'errors',len(errs))
