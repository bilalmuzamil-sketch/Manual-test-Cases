// Another session rewrote C44591 at 16:49 UTC today, after this session had corrected it on the QA
// lead's explicit ruling. Their rewrite is a good build-grounded restructure and cites a NEWER spec
// revision (11 Sep) than the one used before - so it is kept. But it dropped two points: the
// invoice-number rule the QA lead ruled on this very day, and the view-only permission point.
// Both are restored here, in their structure, with block tags only so the field renders.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';

const expected = [
'<p>Expected results</p>',
'<ul>',
'<li>Everything that makes a receive valid is identical to the modal: vendor, invoice number and invoice date required; cost and tax required but able to be zero and always prefilled; the same quantity rules; part number required; cost locked once invoiced or paid.</li>',
'<li>A supplier invoice number is unique and cannot be used a second time. The first order accepts it and receives the parts; entering the same number on another order, even for the same supplier, is refused with a message saying it is already in use, and nothing is received.</li>',
'<li>Sell price is not shown in the receive modal or on the receive page reached from Parts.</li>',
'<li>Without "See Financial Data" the cost, tax, subtotal, total and sell columns are absent (not masked); receiving still works because those fields arrive with a value.</li>',
'<li>Somebody whose vendor and order management is View only can open the purchase orders page and read the list, but is offered no way to receive: no tick boxes, no Receive on any row, and nothing after selecting.</li>',
'</ul>',
'<hr />',
'<p>Source - where this behaviour comes from</p>',
'<p>Epic SV-8683; story SV-9260 (Story 14, The receive page and PO bulk receive); Simple Flow V2 spec (Confluence 771391574, revision of 11 Sep 2026), Story 14; read 28 Sep 2026.</p>',
'<p>Exact quotes from the source, for reproducibility</p>',
'<ul>',
'<li>Story 14: "Everything that makes a receive valid is identical to the receive modal: vendor, invoice number and invoice date required, cost and tax required but able to be zero and always arriving prefilled"</li>',
'<li>Story 14: "Sell price is not shown in the receive modal or on the receive page reached from Parts"</li>',
'<li>Story 14: "Without See Financial Data the cost, tax, subtotal, total and sell columns are absent, not masked"</li>',
'</ul>',
'<p>Where this case follows a later decision than the written source, and why: the specification states "The same invoice number may be reused across several of a vendor\'s purchase orders. It is typed per purchase order and is not shared from the group header." The QA lead ruled on 28 September 2026 that the opposite is correct and that a supplier invoice number is unique. The later decision prevails, so the second point above follows the ruling, and the specification sentence needs correcting at source.</p>',
'<p>Last checked against build v26.39.1-3ef6ade on 9/28/2026, on production. Passed.</p>',
'<p>AUTOMATION: READY</p>',
].join('');

const r = await api('update_case/44591', { method:'POST', body:{ custom_expected: expected } });
console.log('update_case/44591 ->', r.status);
if (r.status === 200) {
  const b = (await api('get_case/44591')).body;
  const e = b.custom_expected || '';
  const bad = /<(b|i|u|em|strong|code|br)\b/i;
  console.log('title left as the other session set it:', b.title.slice(0,70));
  console.log('the ruling is back in the case:', /unique and cannot be used a second time/.test(e));
  console.log('the view-only point is back:', /View only can open the purchase orders page/.test(e));
  console.log('their source quotes kept:', (e.match(/Story 14:/g)||[]).length, 'of 3');
  console.log('stray inline tags:', bad.test(e), '| marker:', (e.match(/AUTOMATION: [A-Z]+/g)||[]));
}
