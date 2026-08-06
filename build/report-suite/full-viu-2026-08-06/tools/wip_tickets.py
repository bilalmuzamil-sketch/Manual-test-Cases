# -*- coding: utf-8 -*-
import json,sys
sys.path.insert(0,'/tmp/rs3/jira')
import tu_tickets as J
V='9'
def src(a,q): return ("Where this expected behaviour comes from: the Work In Progress report specification, "
    "version %s, requirement %s, which says: \"%s\"."%(V,a,q))
T=[]
T.append(dict(story='SV-8660',
 summary='Work In Progress: the WO number is plain text even for a user who does have Work Order permission',
 sec=[
  ('What happens now',[
   'On the Work In Progress report the WO number in the first column is plain black text. It is not a link, nothing happens when you click it, and there is no way to get from the report to the work order.',
   'This was checked signed in as an administrator who does hold Work Orders access, so it is not the permission rule doing its job - the whole table contains no links at all.']),
  ('How to see it',[
   'Open Reports, then Work In Progress. Click any WO number, for example S8582-16256. Nothing happens and the address bar does not change.',
   'The cell is an ordinary piece of text: no underline, black, and the mouse pointer does not change to a hand over it.']),
  ('What should happen instead',[
   'For a user who has Work Orders access the WO number should be a link that opens that work order in the same tab, so the user can look at the job and come back with the browser back button. A user WITHOUT Work Orders access should see it as plain text - which is what everyone sees today.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Signed in as Admin ShopView, whose permissions include Work Orders View, Create & Edit and Delete. Date range This Week, both locations, on the Approved - Partially Completed tab.']),
  ('How bad is it',[
   'Low, but it removes the one thing that makes the report actionable: a service manager reading it cannot jump to the job to do anything about it.']),
  ('What we ruled out',[
   'We confirmed the user really does hold Work Orders access before raising this, and we clicked the number rather than only inspecting it. We also checked the rest of the row: every other cell is correct and the report data itself is right.']),
  ('Where this expected behaviour comes from',[
   src('S4-R5','WO # is shown as a link that opens the work order in the same browser tab (the user returns via the browser\'s back navigation) only when the user has permission to access Work Orders. A user without Work Order permission sees the WO # as plain text, not a link.'),
   'This requirement was rewritten on 5 August 2026 to spell out both halves - the link for someone with permission, and plain text for someone without. The half that gives the link is the half that is missing.',
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8663',
 summary='Work In Progress Advisor, Customer and Asset filters reload from the server instead of narrowing on screen',
 sec=[
  ('What happens now',[
   'The written description asks for the Work In Progress report to load the complete set of open jobs in one request, and then for the Advisor, Customer and Asset filters to narrow what you see on screen without going back to the server.',
   'That is not what happens. Ticking an advisor or a customer sends a fresh request to the server with the choice attached, and the table is rebuilt from the answer. Switching tab afterwards carries those choices to the server too.']),
  ('How to see it',[
   'Open Reports, then Work In Progress. Open the Advisor filter and tick Admin ShopView: a fresh request goes out. Open the Customer filter and tick Aaborough Works: another fresh request goes out.',
   'Now click the Estimates tab. The request that follows carries both choices with it, so the narrowing is being done by the server, not on screen.']),
  ('What should happen instead',[
   'The report should load the open jobs once, and ticking an advisor, a customer or an asset should simply hide the rows that do not match, with no new request.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Date range This Week, both locations, advisor Admin ShopView, customer Aaborough Works.']),
  ('How bad is it',[
   'Low. The filtering itself gives the right answer - the rows, the Totals row and the summary figures all agree with the choice made. It is how the answer is produced that differs, which matters mainly for speed and for how the report behaves on a slow connection.']),
  ('What we ruled out',[
   'We checked the results are correct before raising this: filtering to one customer left the right jobs on screen, the Totals row recalculated to match, and the summary figures moved with it. We also confirmed the filter lists themselves are drawn from the full scope, which is the other half of the requirement and is right.']),
  ('Where this expected behaviour comes from',[
   src('S7-R1','The toolbar has an Advisor filter, a multi-select listing the advisors present across all open jobs in the current scope (the report loads the complete set of open jobs in one request). Selecting one or more advisors narrows the visible jobs to those advisors, on screen only (no reload).'),
   src('S7-R2','The toolbar has a Customer filter ... The user types to narrow the list and selects one or more customers; narrowing is on screen only (no reload).'),
   src('S7-R4','The toolbar has an Asset filter ... Selecting one or more assets narrows the visible jobs on screen only (no reload).'),
   'These three requirements were rewritten on 5 August 2026, which is why they are worth checking now.',
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8663',
 summary='Work In Progress filters show a Clear action before anything is selected, and the Advisor filter has no All advisors item',
 sec=[
  ('What happens now',[
   'Two small things about the three Work In Progress filters do not match the written description.',
   'One: each filter offers its Clear action all the time, even before anything has been picked. The description asks for it to appear only once at least one thing is selected. It is also labelled "Clear all" where the description calls it a single "Clear" action.',
   'Two: the Customer and Asset filters each have an "All customers" / "All assets" item pinned at the top of their list, but the Advisor filter has no "All advisors" item at all - its list starts with "Clear all" and then the advisors. The closed control does read "All advisors", so the state exists; it is the item that is missing.']),
  ('How to see it',[
   'Open Reports, then Work In Progress, without touching any filter.',
   'Open the Customer filter: the list reads "All customers", "Clear all", then the customers - and nothing is selected yet. The Asset filter behaves the same way.',
   'Open the Advisor filter: the list reads "Clear all", then Admin ShopView. There is no "All advisors" item.']),
  ('What should happen instead',[
   'The Clear action should appear only once something is selected, and the Advisor filter should offer an "All advisors" item like the other two.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Date range This Week, both locations, nothing selected in any filter.']),
  ('How bad is it',[
   'Low. Everything still works - Clear all does return the filter to its all state, and the closed control shows the right words. It is only when each control appears that differs.']),
  ('What we ruled out',[
   'We checked the useful half first: each filter does list the values found across the whole scope, the closed labels do read "All advisors", "All customers" and "All assets", and Clear all does put the filter back.']),
  ('Where this expected behaviour comes from',[
   src('S7-R3','When no customer is selected, the Customer filter reads "All customers" and every job is shown; the filter offers a single "Clear" action that returns it to "All customers", shown only once at least one customer is selected.'),
   src('S7-R5','When no asset is selected, the Asset filter reads "All assets" and every job is shown; the filter offers a single "Clear" action that returns it to "All assets", shown only once at least one asset is selected.'),
   'The Advisor filter half rests on S7-R1, which describes the Advisor filter as the same kind of multi-select as the other two.',
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8666',
 summary='Work In Progress table is pale blue-grey throughout instead of the all-white table the description asks for',
 sec=[
  ('What happens now',[
   'The written description asks the Work In Progress table to be all white - white column headings and white data cells, with no alternating shading.',
   'Every part of the table is the pale blue-grey instead: the headings, every data row and the Totals row all read as the same off-white tint. There is at least no alternating shading, which is the other half of the requirement.']),
  ('How to see it',[
   'Open Reports, then Work In Progress. The heading row, the data rows and the Totals row all read as rgb(249, 250, 251) rather than white.']),
  ('What should happen instead',[
   'White column headings and white data cells.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026, light mode, 1680x1050, on the Approved - Partially Completed tab and again on the Estimates tab.']),
  ('How bad is it',[
   'Low. The table is perfectly readable and every figure in it is correct; it does not match the agreed look.']),
  ('What we ruled out',[
   'We checked the parts of the requirement that are right rather than only the part that is wrong: there is no alternating row shading, the Totals row is bold, and the summary figures above the table each carry a keyboard-reachable information button with a full plain-English explanation.']),
  ('Where this expected behaviour comes from',[
   src('S10-R1','Each tab uses an all-white table: white column headers and white data cells, with no alternating row shading.'),
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
if __name__=='__main__':
    R=[]
    for t in T:
        r=J.create(t['summary'],t['story'],t['sec']); print(r.get('key') or r)
        if r.get('ok'):
            ch=J.verify(r['key'],t['story'],t['summary'])
            print('  checks:',{k:v for k,v in ch.items() if not v} or 'ALL PASS',sum(ch.values()),'/',len(ch)); r['checks']=ch
        R.append(r)
    json.dump(R,open('/tmp/rs4/jira/wip_filed.json','w'),indent=1)
