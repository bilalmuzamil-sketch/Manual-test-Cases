// CORRECTED. The previous run passed the CUSTOMER id where this endpoint wants the ACCOUNT id, and
// got 0 transactions on all 500 customers - a uniform zero is the signature of a wrong parameter,
// not of empty data. The account id is `customer_account_id` on /api/customers/view/<id>; it is NOT
// on the customers LIST. Capped at 80 customers so the run is bounded.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page } = await boot('sv9315', '/customers', 'admin');
const API='https://sv9315api.qa.shopview.com';
const get = path => page.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status,json:j};
}, API+path);
const cs = await get('/api/customers?pagination[page]=1&pagination[rowsPerPage]=500');
const list = (cs.json?.data?.collection||[]).slice(0, 80);
let withRows=0, hit=null, fieldsShown=false;
for (const c of list) {
  const v = await get(`/api/customers/view/${c.id}`);
  const acc = JSON.stringify(v.json||{}).match(/"customer_account_id":"([^"]+)"/)?.[1];
  if (!acc) continue;
  const r = await get(`/api/customer-account/list-unpaid-transaction?account_id=${acc}`);
  if (r.status!==200) continue;
  const d=r.json?.data;
  const rows = d?.collection || d?.transactions || (Array.isArray(d)?d:[]);
  if (!Array.isArray(rows)||!rows.length) continue;
  withRows++;
  if (!fieldsShown) { console.log('transaction row fields:', Object.keys(rows[0]).join(', ')); fieldsShown=true; }
  const cm = rows.find(x=>/CM-/.test(JSON.stringify(x)));
  if (cm) { hit={customer:{id:c.id,name:c.name,account:acc}, row:cm}; break; }
}
console.log(`customers checked: ${list.length} | with transactions: ${withRows}`);
if (hit) {
  console.log('FOUND a credit on', hit.customer.name);
  console.log('row:', JSON.stringify(hit.row).slice(0,400));
  fs.writeFileSync('build/probe-2026-09-02/credit-target.json', JSON.stringify(hit,null,1));
} else console.log('no CM- row in this sample of 80 - NOT a claim that none exists');
await browser.close();
