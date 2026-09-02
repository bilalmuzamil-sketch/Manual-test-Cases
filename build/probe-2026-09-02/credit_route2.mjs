import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status, isHtml:/^\s*<!doctype|^\s*<html/i.test(t), len:t.length, json:j, head:t.slice(0,200)};
}, path);

// customers -> find the shape
const cs = await get(API+'/api/customers?pagination[page]=1&pagination[rowsPerPage]=50');
console.log('customers ->', cs.status, cs.json?.data?Object.keys(cs.json.data):cs.head.slice(0,120));
const list = cs.json?.data?.customers || cs.json?.data?.collection || [];
console.log('customers returned:', list.length);
if (list.length) console.log('a customer\'s fields:', Object.keys(list[0]).join(', '));

// find one with an account id and unpaid transactions carrying a CM- number
let found = null;
for (const c of list.slice(0, 25)) {
  const acc = c.account_id || c.accountId || c.customer_account_id || c.id;
  const r = await get(API+`/api/customer-account/list-unpaid-transaction?account_id=${acc}`);
  if (r.status !== 200) continue;
  const d = r.json?.data;
  const rows = d?.collection || d?.transactions || (Array.isArray(d) ? d : []);
  if (!Array.isArray(rows) || !rows.length) continue;
  if (!found) console.log('\ntransaction row fields:', Object.keys(rows[0]).join(', '));
  const credit = rows.find(x => JSON.stringify(x).includes('CM-'));
  if (credit) { found = {acc, credit, name: c.name || c.companyName}; break; }
}
if (!found) { console.log('\nno CM- transaction found in the first 25 customers'); await b.close(); process.exit(0); }
console.log('\nFOUND a credit on', found.name, '->', JSON.stringify(found.credit).slice(0, 300));

// try the recorded document render path with the credit's id
const id = found.credit.invoice_id || found.credit.id || found.credit.invoiceId;
for (const q of [`/api/invoices/preview?invoice_id=${id}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`,
                 `/api/invoices/preview?invoice_id=${id}&type=html`,
                 `/api/credit-memos/preview?credit_memo_id=${id}&type=html`,
                 `/api/credit-memos/view/${id}`]) {
  const r = await get(API+q);
  console.log(`\n${q.slice(0,80)} -> ${r.status} len=${r.len} html=${r.isHtml}`);
  if (r.status===200) {
    const txt = r.json ? JSON.stringify(r.json).slice(0,400) : r.head;
    console.log('   ', txt.replace(/\s+/g,' ').slice(0,300));
  } else console.log('   ', r.head.replace(/\s+/g,' ').slice(0,160));
}
fs.writeFileSync('build/probe-2026-09-02/credit-route.json', JSON.stringify(found,null,1));
await b.close();
