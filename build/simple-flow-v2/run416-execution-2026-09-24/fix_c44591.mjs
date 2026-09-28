// C44591 corrected end to end on the QA lead's ruling of 28 September 2026: a supplier invoice
// number is UNIQUE and cannot be reused. That reverses what the specification says, so the case now
// follows the ruling and says openly that it does (Rule 56), and the Expected is written as the
// ruling rather than as a spec sentence that no longer holds (Rule 114(c) - he named this case and
// authorised the change in that conversation).
// Block tags only: TestRail wraps a submitted value in one outer <p>, so plain newlines collapse and
// inline tags such as <b> or <br> render literally when written through the API (playbook J).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';

const title = 'Receive page matches the modal; an invoice number cannot be reused; money hidden';

const preconds = [
'<p>You will need three sign-ins and one supplier that has two orders still waiting for parts.</p>',
'<p>The three people</p>',
'<ul>',
'<li>1. An Owner or Admin who is allowed to see money. This is the normal administrator sign-in.</li>',
'<li>2. Somebody who is NOT allowed to see money. To make one: top menu "Settings" -> left sidebar "Roles &amp; Permissions" -> press the pencil on a role -> in the "Search permission" box type "financial" -> turn "See Financial Data" off -> the shop warns that other permissions switch off with it, so press the button that confirms it -> press "Save", then "Confirm". Put a test person into that role from "Settings" -> "Staff" -> hover their row -> pencil -> change "Role" -> "Save &amp; Close".</li>',
'<li>3. Somebody who may only LOOK at suppliers and orders. Same route: pencil on a role -> find the row "Vendor and order management" -> it has three tick boxes, "View", "Create &amp; Edit" and "Delete" -> leave "View" ticked and untick the other two. Untick "Delete" FIRST and "Create &amp; Edit" second, because the shop will not let you untick "Create &amp; Edit" while "Delete" is still ticked. Press "Save", then "Confirm".</li>',
'</ul>',
'<p>The orders</p>',
'<ul>',
'<li>4. You need one supplier whose name appears on two different purchase orders that still have parts to receive. To find one: top menu "Parts" -> left sidebar "Purchase Orders" (under the heading SUPPLY CHAIN) -> read down the "Vendor" column for a name that appears twice, on rows whose "Order Status" reads "Ordered" or "Partial Delivery" and which show a "Receive" button. On the test shop the supplier "Delete Test" has several; if it does not, pick any name that appears on two such rows.</li>',
'<li>5. If no supplier appears twice, make it: open a work order, add two parts that must be bought in, press "Order" on each one separately, and choose the same supplier both times.</li>',
'</ul>',
].join('');

const steps = [
'<ol>',
'<li>Sign in as the person who may only LOOK at suppliers and orders. Go to top menu "Parts" -> left sidebar "Purchase Orders". Check whether the list opens, and whether anything at all offers a way to receive: a tick box beside a row, a "Receive" button on a row, or any button that appears after selecting rows.</li>',
'<li>Sign in as the administrator and open the same page. Check that a "Receive" button IS offered on the rows, so you know the empty page in step 1 was the permission and not a page that failed to load.</li>',
'<li>Still as the administrator, press "Receive" on one of your chosen supplier\'s two orders. The order opens and a receiving form appears on the page itself, grouped under the supplier\'s name.</li>',
'<li>In that group, type a supplier invoice number nobody has used before into the box marked "Vendor Invoice # *". Make one up that you will recognise, for example ZZAUTOTEST-REUSE-01. Leave the date as today.</li>',
'<li>Press "Select All" so every part is ticked, then press the "Receive Parts" button at the bottom of the group. Note whether the parts are received.</li>',
'<li>Go back to "Parts" -> "Purchase Orders" and press "Receive" on the SECOND order belonging to the SAME supplier.</li>',
'<li>Type the very same invoice number you used in step 4, tick the parts, and press "Receive Parts". Note exactly what the shop says and whether anything is received.</li>',
'<li>Sign in as the person who is not allowed to see money and open a purchase order that still has parts to receive. Look at the columns and the totals: are "Cost", "Tax", "Subtotal", "Total" and any selling price there, blanked out, or gone altogether? Then try to receive a part and see whether it still works.</li>',
'<li>On the same page, and in the receiving form, look for a SELLING price anywhere (what the customer would be charged, as opposed to what the shop paid).</li>',
'</ol>',
].join('');

const expected = [
'<ol>',
'<li>Everything that decides whether a receive is allowed is the same on this page as in the receiving window: the supplier, the invoice number and the invoice date are all required; cost and tax are required but may be zero and always arrive already filled in; the quantity rules are the same; the part number is required; and the cost can no longer be changed once the job has been billed or paid.</li>',
'<li>A supplier invoice number is unique and cannot be used a second time. The first order accepts it and receives the parts. When the same number is typed on another order, even for the same supplier, the shop refuses it, says the invoice number is already in use, and receives nothing. The person must enter the number that belongs to that order.</li>',
'<li>No selling price is shown anywhere on the receiving window or on the receive page reached from "Parts". Only what the shop paid is shown: cost, quantity and total cost.</li>',
'<li>For somebody who is not allowed to see money, the cost, tax, subtotal, total and selling price columns are GONE altogether, not blanked out or starred over. Receiving still works for them, because those figures are already filled in behind the scenes.</li>',
'<li>Somebody who may only look at suppliers and orders can open the purchase orders page and read the whole list, but is given no way to receive: no tick boxes, no "Receive" on any row, and nothing offered after selecting. An administrator on the same page is offered a "Receive" on every row.</li>',
'</ol>',
'<hr />',
'<p>Source</p>',
'<ul>',
'<li>Point 2 follows the QA lead\'s ruling of 28 September 2026: a supplier invoice number is unique and is not reusable.</li>',
'<li>Points 1, 3, 4 and 5 are as per epic SV-8683 and story SV-9260 (Story 14, The receive page and PO bulk receive) and the Simple Flow V2 specification (Confluence page 771391574, revised 8 September 2026), read on 25 September 2026.</li>',
'</ul>',
'<p>Where this case differs from an earlier source, and why: the specification states "The same invoice number may be reused across several of a vendor\'s purchase orders. It is typed per purchase order and is not shared from the group header." The QA lead ruled on 28 September 2026 that the opposite is correct and that the invoice number is unique. The later decision prevails, so this case follows the ruling. The specification sentence needs correcting.</p>',
'<p>Last checked against build v26.39.1-3ef6ade on 9/28/2026.</p>',
'<p>AUTOMATION: READY</p>',
].join('');

const r = await api('update_case/44591', { method:'POST', body:{
  title, custom_preconds:preconds, custom_steps:steps, custom_expected:expected,
  custom_automation_type: 2, refs:'SV-9260 (Story 14)' } });
console.log('update_case/44591 ->', r.status);
if (r.status !== 200) console.log(JSON.stringify(r.body).slice(0,500));
else {
  const back = await api('get_case/44591');
  const b = back.body;
  console.log('title now:', b.title, '(' + b.title.length + ' characters)');
  console.log('automation type kept:', b.custom_automation_type);
  const bad = /<(b|i|u|em|strong|code|br)\b/i;
  for (const f of ['custom_preconds','custom_steps','custom_expected']) {
    const v = b[f] || '';
    console.log(f, '| length', v.length,
      '| block tags:', /<(p|ol|ul|li|hr)\b/i.test(v),
      '| stray inline tags:', bad.test(v) );
  }
  console.log('marker present exactly once:', (b.custom_expected.match(/AUTOMATION: READY/g)||[]).length);
}
