// Find a customer that actually holds a credit, using the signed-in session's own API access,
// then hand the id to the UI walk. Fields are enumerated before they are read (probe_lib rule).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page } = await boot('sv9315', '/customers', 'admin');
const API='https://sv9315api.qa.shopview.com';
const get = path => page.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status, json:j};
}, API+path);

const cs = await get('/api/customers?pagination[page]=1&pagination[rowsPerPage]=500');
const list = cs.json?.data?.collection || [];
console.log('customers read:', list.length, '| a record has:', Object.keys(list[0]||{}).slice(0,6).join(', '));
let hit=null, checked=0, withRows=0;
for (const c of list) {
  const r = await get(`/api/customer-account/list-unpaid-transaction?account_id=${c.id}`);
  checked++;
  if (r.status!==200) continue;
  const d=r.json?.data;
  const rows = d?.collection || d?.transactions || (Array.isArray(d)?d:[]);
  if (!Array.isArray(rows) || !rows.length) continue;
  withRows++;
  if (withRows===1) console.log('transaction row fields:', Object.keys(rows[0]).join(', '));
  const cm = rows.find(x => /CM-/.test(JSON.stringify(x)));
  if (cm) { hit={customer:{id:c.id,name:c.name}, row:cm}; break; }
  if (checked>=200) break;
}
console.log(`checked ${checked} customers, ${withRows} had transactions`);
if (hit) {
  console.log('FOUND a credit on', hit.customer.name, '| id', hit.customer.id);
  console.log('the row:', JSON.stringify(hit.row).slice(0,400));
  fs.writeFileSync('build/probe-2026-09-02/credit-target.json', JSON.stringify(hit,null,1));
} else console.log('no CM- transaction on any customer checked');
await browser.close();
