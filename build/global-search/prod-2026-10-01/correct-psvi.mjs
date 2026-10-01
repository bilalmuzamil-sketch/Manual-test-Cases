// Replaces the 14 Blocked results I posted on a false premise. Both record types exist on
// production and search finds them; only my probe terms were wrong.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const B='v26.40.2-95f3172', D='2026-10-01';
const PASS={'Part Sales':{term:'P1-',ids:[146257,146258,146260,146261,146264,146262]},
            'Vendor Invoices':{term:'regration.',ids:[146277,146278,146279,146280,146281,146283,146282]}};
let ok=0,bad=[];
const put=async(cid,s,c)=>{const r=await api(`add_result_for_case/415/${cid}`,{method:'POST',
  body:{status_id:s,comment:c,version:`PRODUCTION ${B}`}}); r.status===200?ok++:bad.push(`C${cid} ${r.status}`);};
for (const [ent,{term,ids}] of Object.entries(PASS))
  for (const cid of ids) await put(cid,1,
`Passed on PRODUCTION, build ${B}, ${D}.

CORRECTION - this check was recorded Blocked earlier today on a false premise. I reported that production had no ${ent.toLowerCase()} this account could see. It has them, and search finds them without trouble. My search words were the fault: I tried "repair", "service" and "truck", which match work orders and customers, while ${ent.toLowerCase()} are named by number and customer.

Re-run against a real production record by searching "${term}", and the row behaves as the requirement asks.`);
await put(146259,5,
`Failed on PRODUCTION, build ${B}, ${D}.

CORRECTION - recorded Blocked earlier today on a false premise; production does hold part sales and search finds them. Re-run properly by searching "P1-".

The highlight replaces the matched text instead of marking it inside the text. The same fault shows on the Assets and Parts tabs, and on staging, so production has not broken it.

Already reported - no new ticket raised:
  SV-10738 - https://shopview.atlassian.net/browse/SV-10738 (Open)`);
console.log('corrected', ok, bad.length?('FAILED: '+bad.join(', ')):'');
