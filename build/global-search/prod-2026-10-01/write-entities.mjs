import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const BUILD='v26.40.2-95f3172', D='2026-10-01';
const TERMS={Assets:'Truck',Parts:'123',Vendors:'Supply','Purchase Orders':'Vendor'};
const PASSED={
 Assets:[146224,146225,146227,146228,146231,146229],
 Parts:[146233,146234,146236,146237,146243,146238],
 Vendors:[146245,146246,146247,146248,146249,146255,146250],
 'Purchase Orders':[146266,146267,146268,146269,146270,146275,146271]};
// the two that fail, and why - said plainly, not dressed up
const FAILED={
 146226:['Assets','Truck','The highlight replaces the matched text instead of marking it inside the text. This also fails on staging, so production has not broken it.'],
 146235:['Parts','123','The highlight replaces the matched text instead of marking it inside the text. Worth noting: the same check PASSES on production against a different part (searching B49, which finds part number B495), so it depends on which record is matched rather than being broken everywhere.']};
// no records of these kinds exist on production for this account - every term returned zero
const NODATA={'Part Sales':[146257,146258,146259,146260,146261,146264,146262],
              'Vendor Invoices':[146277,146278,146279,146280,146281,146283,146282]};
let ok=0, bad=[];
const put=async(cid,status,comment)=>{
  const r=await api(`add_result_for_case/415/${cid}`,{method:'POST',
    body:{status_id:status,comment,version:`PRODUCTION ${BUILD}`}});
  r.status===200?ok++:bad.push(`C${cid} ${r.status}`); };

for (const [ent,ids] of Object.entries(PASSED))
  for (const cid of ids) await put(cid,1,
`Passed on PRODUCTION, build ${BUILD}, ${D}.

Run against production's own records rather than the test data this check was written with. On the ${ent} tab, searching "${TERMS[ent]}" returns real production records and the row behaves as the requirement asks.`);

for (const [cid,[ent,term,why]] of Object.entries(FAILED))
  await put(cid,5,
`Failed on PRODUCTION, build ${BUILD}, ${D}.

On the ${ent} tab, searching "${term}": ${why}

Already reported - no new ticket raised:
  SV-10738 - https://shopview.atlassian.net/browse/SV-10738 (Open)`);

for (const [ent,ids] of Object.entries(NODATA))
  for (const cid of ids) await put(cid,2,
`Blocked on PRODUCTION, build ${BUILD}, ${D}.

There are no ${ent.toLowerCase()} on production that this account can see. Every search tried - "repair", "service", "truck", and a single letter - returned none, while work orders, customers, assets, parts and purchase orders all returned records on those same searches.

So either production holds none of these in this workplace, or this account cannot see them. Either way there is nothing to judge, and no fault has been recorded, because none was observed.`);

console.log('written', ok, bad.length?('FAILED: '+bad.join(', ')):'');
