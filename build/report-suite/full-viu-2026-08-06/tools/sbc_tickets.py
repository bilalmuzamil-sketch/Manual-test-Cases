# -*- coding: utf-8 -*-
import json,sys
sys.path.insert(0,'/tmp/rs3/jira')
import tu_tickets as J
V='15'
def src(anchor,quote):
    return ("Where this expected behaviour comes from: the Sales By Customer report specification, "
            "version %s, requirement %s, which says: \"%s\"."%(V,anchor,quote))
T=[]
T.append(dict(story='SV-8616',
 summary='Sales By Customer Customer filter: no search icon, wrong multi-select label, and the typed text never shows in the field',
 sec=[
  ('What happens now',[
   'On the Sales By Customer report the Customer filter works, but three things about how it looks and reads are not what the written description asks for.',
   'One: the control has no magnifier (search) icon on it, so nothing tells the user it can be searched. The only icon on it is the drop-down arrow. The Location filter beside it does carry its own icons, so this is not a general styling choice.',
   'Two: with two customers picked the closed control reads "2 customers". The written description asks for "2 selected".',
   'Three: while the user types a search, the closed control keeps reading "All customers" (or whatever the summary was). The typed text goes into a separate search box inside the open list, and never appears in the control itself.']),
  ('How to see it',[
   'Open Reports, then Sales By Customer. Look at the Customer filter in the toolbar: there is no magnifier icon.',
   'Open the Customer filter and type Aacrest, then tick Aacrest Works. Type Aacastle and tick Aacastle Services. Close the list. The control reads "2 customers".',
   'Open it again and type any text. Watch the closed control behind the list: it still shows the summary label, not what you typed.']),
  ('What should happen instead',[
   'The control should carry a magnifier icon, the two-or-more label should read "2 selected", and while the user is typing, the control should show the typed text in place of the summary label.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Viewport 1680x1050, desktop Chrome. Test data: customers Aacrest Works and Aacastle Services, date range This Month, Product Type Parts & Service, both locations selected.']),
  ('How bad is it',[
   'Low. The filter itself finds and applies the right customers; only its wording and its icon are wrong. The missing magnifier is the most likely one to matter, because nothing on screen tells a new user the list can be searched.']),
  ('What we ruled out',[
   'We checked that the search itself is correct before raising this: typing matches anywhere inside a name (not only the start), the list is limited to customers with invoices in the chosen date range, and a ticked customer shows a checkmark. All of that is right.']),
  ('Where this expected behaviour comes from',[
   src('S18-R2','The filter is a multi-select with server-backed type-ahead. The control carries a search (magnifier) icon marking it as searchable.'),
   src('S18-R5','The collapsed filter label reads "All customers" when the filter is in the all-customers state, "None" when the selection is an empty set, the customer\'s name when exactly one customer is selected, and "N selected" when more than one customer is selected. While the user is typing a search query in the filter, the field shows the query text instead of the summary label.'),
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8608',
 summary='Sales By Customer sorting: the Location column cannot be sorted, and blank values sort to the wrong end',
 sec=[
  ('What happens now',[
   'Two things about sorting on the Sales By Customer report do not match the written description.',
   'One: every column heading can be clicked to sort except two - the little arrow column at the far left, which is correct, and the Location column, which is not. Location has no sort arrow and clicking it does nothing. The server itself can sort by location perfectly well, so this is only missing from the screen.',
   'Two: rows with no value in them sort to the wrong end. Sorting Margin % smallest-first puts all the blank ones at the TOP, and largest-first puts them at the BOTTOM. The written description asks for the exact opposite.']),
  ('How to see it',[
   'Open Reports, then Sales By Customer, and choose This Year so there are plenty of rows.',
   'Click each column heading in turn. Every one sorts except Location, which has no arrow and does not respond.',
   'Click Margin % once (smallest first). The first rows shown have a dash instead of a percentage. Click again (largest first) and the dashes have moved to the end.']),
  ('What should happen instead',[
   'Location should sort like every other column. Blank values should go to the bottom when sorting smallest-first and to the top when sorting largest-first.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Date range This Year (1 January to 6 August 2026), both locations, Product Type Parts & Service, 384 customers in the set. 19 of the first 30 rows had no Margin % value.']),
  ('How bad is it',[
   'Low. Sorting works on the other twelve columns and the order it produces is correct; it is the blank rows that end up in the wrong place, and one column that cannot be sorted at all.']),
  ('What we ruled out',[
   'We checked the sort is genuinely applied and not a stale screen: each click sends a fresh request and the first page comes back in the new order, and the heading itself reports which way it is sorted. We also confirmed the server accepts a sort by location and answers correctly, so the gap is on the screen only.']),
  ('Where this expected behaviour comes from',[
   src('S10-R1','Every column is sortable except the chevron column.'),
   src('S10-R3','A missing value sorts to the bottom in ascending order and to the top in descending order; a Margin % em-dash cell counts as a missing value.'),
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8613',
 summary='Sales By Customer Expanded View PDF comes out on A3 paper instead of A4',
 sec=[
  ('What happens now',[
   'The Sales By Customer report offers two PDF downloads. The Summary one is A4 landscape, which is right. The Expanded View one comes out on A3 landscape - a sheet half again as wide.',
   'Anyone printing it on ordinary office paper will get it shrunk down or cropped.']),
  ('How to see it',[
   'Open Reports, then Sales By Customer. Open the download menu and choose Download Expanded View (PDF).',
   'Open the file and look at its page size. It measures 1190 by 842 points, which is A3. The Summary PDF from the same menu measures 842 by 595 points, which is A4.']),
  ('What should happen instead',[
   'Both PDFs should be A4 landscape.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. Date range 1 to 6 August 2026, Product Type Parts & Service, both locations. Both files downloaded from the report own download menu.']),
  ('How bad is it',[
   'Low. The file opens and every figure in it is correct; it is the paper size that is wrong.']),
  ('What we ruled out',[
   'This is not a one-off: the Summary PDF from the same menu, the same filters and the same moment is correctly A4, so it is specific to the Expanded View file. The footer, the heading block and the logo are all present and correct in both.']),
  ('Where this expected behaviour comes from',[
   src('S15-R7','The PDF is A4 landscape with 25px margins on all sides, using the application\'s standard font.'),
   'The same requirement covers both files: the specification says the header title reads the same for both versions and that only the file name tells them apart (S15-R13), so there is no separate paper size for the Expanded View.',
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8617',
 summary='Sales By Customer table uses the wrong row colours, too little side padding, and does not indent invoice rows',
 sec=[
  ('What happens now',[
   'The Sales By Customer table does not look the way Story 20 describes it.',
   'One: the column headings, the customer rows and the totals row should all be white. They are all the pale blue-grey instead.',
   'Two: the asset and invoice rows should be that pale blue-grey. They are a third, darker grey that appears nowhere in the description.',
   'Three: the first and last cells should have 2rem (32 pixels) of padding on the outside edge. They have about 14 pixels.',
   'Four: invoice rows should be indented one step further in than asset rows. They are not - an invoice number starts at the same distance from the left as a customer name.']),
  ('How to see it',[
   'Open Reports, then Sales By Customer, choose This Year, and expand a customer and then one of its assets so all three kinds of row are on screen together.',
   'The heading row, the customer rows and the totals row all read as rgb(249, 250, 251). The asset and invoice rows read as rgb(238, 241, 245). The outer cells measure 14.28 pixels of padding. The invoice number sits at the same left edge as the customer name above it.']),
  ('What should happen instead',[
   'Headings, customer rows and the totals row white; asset and invoice rows the pale blue-grey; 2rem of padding on the outer cells; invoice rows indented one step deeper than asset rows.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026, light mode, 1680x1050. Customer Aaborough Works expanded down to invoice S-16244.']),
  ('How bad is it',[
   'Low. Every number in the table is correct and the rows do still separate by shade, so the table is readable; it simply does not match the agreed look, and the missing indent makes an invoice row harder to tell apart from a customer row at a glance.']),
  ('What we ruled out',[
   'The rest of Story 20 is right and we checked it rather than assuming: the pinned Subtotal cell takes its own row colour instead of standing out as a strip, the table has no rounded corners, the totals row has its top border and bold text, and dark mode does darken every surface. Asset rows ARE indented one step; it is only the invoice rows that are not indented further.']),
  ('Where this expected behaviour comes from',[
   src('S20-R8','Column-header cells and customer summary rows use the white surface (#ffffff), or the dark surface in dark mode.'),
   src('S20-R9','Asset rows and invoice rows use the blue-grey background (#f9fafb), or the dark background in dark mode.'),
   src('S20-R10','The totals row uses the white surface (#ffffff), or the dark surface in dark mode, with a top border and bold text.'),
   src('S20-R12','The leftmost cell (header, body, totals) has 2rem of left padding; the rightmost cell has 2rem of right padding.'),
   src('S20-R14','The three tree levels are shown by indentation: the customer row is at the base; asset rows are indented one level; invoice rows are indented one level deeper.'),
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
T.append(dict(story='SV-8604',
 summary='Sales By Customer remembered view keeps a location and a customer the user can no longer use, and loses the date range entirely',
 sec=[
  ('What happens now',[
   'The Sales By Customer report remembers the filters a user left behind. If one of those remembered choices is no longer a real choice, the report should quietly drop it and fall back to the normal default. Two of the four do not.',
   'A remembered location that no longer exists is kept: the Location filter comes back reading "1 selected" for something the user cannot see or name.',
   'A remembered customer that no longer exists is kept the same way: the Customer filter reads "1 selected".',
   'A remembered date range that is no longer a valid choice is not replaced by the normal default either. The date control comes back reading "Select Date Range" and the report shows no rows at all, so the user is left on an empty report with no obvious reason why.',
   'Product Type and the chosen columns do fall back correctly.']),
  ('How to see it',[
   'Open Reports, then Sales By Customer, so the remembered view is created. Then make the remembered view hold a location id and a customer id that do not exist, and a date range value that is not one of the offered ranges.',
   'Reload the report. The date control reads "Select Date Range", the table is empty, and Location and Customer each read "1 selected". Product Type has gone back to Parts & Service and every column is showing again.']),
  ('What should happen instead',[
   'Anything remembered that is no longer valid should be dropped and the report should fall back to that filter default - This Month for the date range, All locations, and all customers.']),
  ('What we tested it on',[
   'QA branch sv8582, build v3.5-16cf83f, on 6 August 2026. The remembered view is held in the browser under the name report_view:sales-by-customer.']),
  ('How bad is it',[
   'Low. Nothing is lost and the user can put the filters right by hand. The date range one is the least pleasant, because the report looks broken - completely empty - rather than simply filtered.']),
  ('What we ruled out',[
   'We first checked that remembering works at all, and it does: date range, Product Type, locations, sort and the chosen columns are all restored exactly. We also confirmed each report keeps its own separate remembered view, so nothing here spills between reports.']),
  ('Where this expected behaviour comes from',[
   src('S6-R5','On restore, any saved value that is no longer valid is discarded, and that setting uses its default instead.'),
   src('S6-R6','A saved value is treated as no longer valid when it is an unknown date range, a location the user no longer has access to, a sort column that no longer exists, or a column set that does not match the current columns.'),
   src('S18-R9','in a subset selection, a selected customer that is no longer present is dropped from the selection and must be re-selected to appear.'),
   'Note on scope: S6-R6 lists the date range and the location, so those two are squarely covered. The customer half rests on S18-R9 instead, which is the requirement that says a selected customer no longer present is dropped from the selection.',
   'That is source type 2: the specification (PRD) in Confluence. The version number given is the Confluence page version, not the version written inside the page.'])]))
if __name__=='__main__':
    import json as J2
    R=[]
    for t in T:
        r=J.create(t['summary'],t['story'],t['sec'])
        print(r.get('key') or r)
        if r.get('ok'):
            ch=J.verify(r['key'],t['story'],t['summary'])
            print('  checks:',{k:v for k,v in ch.items() if not v} or 'ALL PASS', '|', sum(ch.values()),'/',len(ch))
            r['checks']=ch
        R.append(r)
    J2.dump(R,open('/tmp/rs4/jira/sbc_filed.json','w'),indent=1)
