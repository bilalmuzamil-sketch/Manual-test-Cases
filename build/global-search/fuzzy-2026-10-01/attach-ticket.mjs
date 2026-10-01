// Rule 113: once a ticket exists, its number goes onto the case in the run, so traceability runs
// from the case to the ticket. (It does not run the other way - no case ids go in a Jira
// description, per the QA lead's 2026-09-16 removal of that section.)
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const BUILD='v26.39.2-538dd8d', D='2026-10-01';
const CASES={146208:'Work orders',146223:'Customers',146232:'Assets',146244:'Parts',
             146256:'Vendors',146265:'Part sales',146276:'Purchase orders',146284:'Vendor invoices'};
for (const [cid,tab] of Object.entries(CASES)){
  const c=`Failed on staging, build ${BUILD}, ${D}.

A close match is flagged as a close match, but nothing in the row is highlighted, so the reader cannot see which text was matched.

Checked on the ${tab} tab by typing the word correctly first and then with one letter out of place, in the same session. Typed correctly, the matching word is highlighted inside the row. Typed with the slip, the same records come back carrying the close-match symbol with no highlighting anywhere.

The requirement asks for both halves - the close-match treatment AND the matched text highlighted. Only the first is present.

Reported: SV-10738 - https://shopview.atlassian.net/browse/SV-10738 (Open, raised 2026-10-01)`;
  const r=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:5,comment:c,version:BUILD}});
  console.log('C'+cid, tab.padEnd(16), '->', r.status, r.status===200?'ok':JSON.stringify(r.body).slice(0,120));
}
