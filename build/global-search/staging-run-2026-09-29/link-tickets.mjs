import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const P1=['146202','146205','146206','146209','146214','146215','146216','146217','146218','146229','146230',
          '146238','146239','146240','146242','146251','146252','146262','146263','146271','146272','146273',
          '146274','146282'];
const P2=['146197','146198','146210'];
const P3=['146222'];
const BUILD='v26.39.2-51a35e1';
const L=k=>`${k} — https://shopview.atlassian.net/browse/${k}`;
const groups=[
 [P1,'Failed',`A ticket has now been raised for this:\n  ${L('SV-10634')}\n\nIt covers every place this was found — Work Orders, Customers, Assets, Parts, Vendors, Part Sales, Purchase Orders and Vendor Invoices — with pictures of where it goes wrong and where it does not.`],
 [P2,'Failed',`Already reported. The cutting-off of long text is covered by:\n  ${L('SV-10552')}  (currently Blocked — the developer's note says the highlight is hidden because the row's label is too long, and calls it a data problem)\n  ${L('SV-10619')}\n  ${L('SV-10551')}\n\nWorth adding when this is next discussed: the search panel is a fixed 640 pixels wide at every screen size from 1280 to 2560, so widening the window does not help the user.`],
 [P3,'Failed',`A ticket has now been raised for this:\n  ${L('SV-10635')}`],
];
let n=0, bad=[];
for(const [ids,status,comment] of groups){
  for(const cid of ids){
    const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',
      body:{status_id:5, comment:`${status} on Staging, build ${BUILD}, 29 September 2026.\n\n${comment}`, version:BUILD}});
    if(res.status!==200) bad.push(`C${cid} -> ${res.status}`); else n++;
  }
}
console.log('ticket references posted:', n);
if(bad.length){ console.log('FAILED:', bad); process.exit(1); }
const {body:run}=await api('get_run/415');
console.log('RUN 415:', 'passed',run.passed_count,'failed',run.failed_count,'retest',run.retest_count,'blocked',run.blocked_count,'untested',run.untested_count);
