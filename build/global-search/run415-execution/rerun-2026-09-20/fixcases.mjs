import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const P=(t)=>'<p>'+t+'</p>';
const OL=(items)=>'<ol>'+items.map(i=>'<li><p>'+i+'</p></li>').join('')+'</ol>';
const UL=(items)=>'<ul>'+items.map(i=>'<li><p>'+i+'</p></li>').join('')+'</ul>';
const HR='<hr />';
const INTRO='Sign in to ShopView. In the app header, click the search field (or press &#8984;K / Ctrl+K) to open the global search, which searches across work orders, customers, parts and more; results appear grouped by type under a tab strip.';

const c55736={
 title:'Removing See Financial Data hides the total on a Vendor invoice row but keeps the row',
 custom_preconds: OL([
   INTRO,
   'Have TWO roles that are identical except for the "See Financial Data" permission - one with it, one without. The same person can be moved between them.',
   'Pick a word that returns at least one Vendor invoice. "truck repair" works on the test branch.',
 ]) + P('A Vendor invoice row is the right row for this check: it is one of the rows that prints a total. A part row never prints a price at all, so the price cannot be watched appearing and disappearing there.'),
 custom_steps: OL([
   'Signed in as the role WITH "See Financial Data", type the word and open the "Vendor invoices" tab.',
   'Read the first row and note the total shown on it, and the invoice number next to it.',
   'Move the same person to the role WITHOUT "See Financial Data" and sign in again.',
   'Type the SAME word, open the "Vendor invoices" tab and find the SAME invoice number.',
 ]),
 custom_expected: P('With the permission, the row shows the invoice number, the vendor, the status and the total.')
   + P('Without the permission, the SAME invoice still appears in the list, with its number, its vendor and its status - but the total is no longer shown.')
   + P('Only the "See Financial Data" permission changed between the two readings, so anything that disappears can only be that permission at work. The row itself must not disappear: that permission hides money, it does not hide records.')
   + HR
   + P('Source:')
   + UL([
     'Epic SV-9160 and the Global Search - Product Requirements specification version 1.5 (Confluence page 576978945), section 4, which lists what a Vendor invoice row displays: "invoice number + vendor (primary), status badge (Paid / Unpaid), total + invoice date".',
     'The same specification, section 9: results, group counts and scope tabs are all filtered by the user\'s permissions.',
   ])
   + P('Corrected on 20 September 2026 with the QA lead\'s go-ahead. It previously asked for the price on a PART row, which cannot be run: a part row does not print a price for anyone, so there was nothing to watch disappear. The behaviour being checked is unchanged - only the row it is checked on.')
   + P('Last checked against build v26.36.8-d146c39 on 20 September 2026.')
   + '<p></p><p>AUTOMATION: READY</p>',
};

const c55737={
 title:'Records a person cannot see are not counted in any heading, tab or total',
 custom_preconds: OL([
   INTRO,
   'Have TWO roles that are identical except that one is missing a whole access area - for example "Part Sales: View". The same person can be moved between them.',
   'Pick a word that returns results of several kinds at once. "truck repair" works on the test branch.',
 ]) + P('Permissions on this product grant or deny a whole KIND of record, never one individual record. This check is therefore written around a kind of record being taken away, which is the only way a record can be made unreachable here.'),
 custom_steps: OL([
   'Signed in as the role WITH the access area, type the word.',
   'On the "All" tab, write down the number shown on the "All" tab itself, and the number shown on each group heading and on each tab in the strip.',
   'Move the same person to the role WITHOUT that access area and sign in again.',
   'Type the SAME word and read the same numbers again.',
 ]),
 custom_expected: P('With the access area, that kind of record has its own heading and its own tab, both showing how many were found, and those results are included in the number on the "All" tab.')
   + P('Without the access area, that kind of record has no heading and no tab at all, and the number on the "All" tab has dropped by exactly the number that kind used to contribute.')
   + P('Every other kind of record keeps the same numbers it had before. A record the person is not allowed to see is neither shown nor counted anywhere - not in a heading, not on a tab, and not in the total.')
   + HR
   + P('Source:')
   + UL([
     'Epic SV-9160 and the Global Search - Product Requirements specification version 1.5 (Confluence page 576978945), section 9: results, group counts and scope tabs are all filtered by the user\'s permissions.',
   ])
   + P('Corrected on 20 September 2026 with the QA lead\'s go-ahead. It previously asked for a role that could see SOME records of a kind but not one particular record of that same kind. That cannot be set up here, because permissions are given by kind of record and not by individual record, so the check could never be run. What is being checked - that a record you cannot see is never counted - is unchanged.')
   + P('Last checked against build v26.36.8-d146c39 on 20 September 2026.')
   + '<p></p><p>AUTOMATION: READY</p>',
};

for(const [id,body] of [[55736,c55736],[55737,c55737]]){
  const r=await api('update_case/'+id,{method:'POST',body});
  console.log('update C'+id,'->',r.status, r.body?.id? ('ok, title now: '+String(r.body.title).slice(0,70)) : JSON.stringify(r.body).slice(0,160));
}
