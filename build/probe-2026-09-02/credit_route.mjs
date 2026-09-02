// Developer question 2 was "what does a user click to produce the printed credit note?".
// Our own cases already answer the CLICK (Customers -> the customer -> Invoices tab -> the print
// icon, tooltip "Print credit memo"), and the bundle sweep found that tooltip in
// UnpaidTransactionsTable / TransactionsPaymentsTable. What the 2026-08-31 pass could not find was
// the RENDER path. Try to find it from the API before spending the developer's time.
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
  return {status:r.status, isHtml:/^\s*<!doctype|^\s*<html/i.test(t), len:t.length,
          keys:j&&typeof j==='object'?Object.keys(j):null, head:t.slice(0,220)};
}, path);

console.log('--- hunting a credit / transaction list');
for (const path of ['/api/customer-account/list-unpaid-transaction','/api/credit-memos',
                    '/api/customer-payment/list','/api/customer-deposits/list','/api/invoices',
                    '/api/customer-account/list-transaction','/api/transactions']) {
  const r = await get(API+path);
  console.log(`${path.padEnd(48)} ${r.status} keys=${JSON.stringify(r.keys)}`);
  if (r.status>=400) console.log('     ', r.head.replace(/\s+/g,' ').slice(0,130));
}
await b.close();
