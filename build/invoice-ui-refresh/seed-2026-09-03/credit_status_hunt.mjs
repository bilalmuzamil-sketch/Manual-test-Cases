// Two questions, one run:
//  (1) which endpoint feeds the customer "Invoices" tab (so credit status can be read as data), and
//  (2) what the front end itself does with the words "Applied"/"Partially applied" — i.e. what makes a
//      credit change state. Scanned in the bundles WITH CONTEXT, controls included so a negative means
//      something (the method's own limit, recorded 2026-09-02).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const gets=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)) gets.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
console.log('--- every API call the Invoices tab made ---');
for (const g of [...new Set(gets)]) console.log(' ', g);

const fetchText = u => page.evaluate(async x => { const r=await fetch(x,{credentials:'include'}); return r.ok? await r.text():''; }, u);
const CONTROLS=['Unapplied','Cash Out','Print credit memo'];
const UNKNOWNS=['Partially applied','Partially Applied','partially_applied','Applied','Reversed','Refunded','Voided','apply-credit','applyCredit','credit-memos/'];
const html=await fetchText(APP+'/');
const queue=[...[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1])], seen=new Set(), hits={}, ctxs={};
while (queue.length && seen.size < 700) {
  const s=queue.shift(); const url=s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/js/'+s.replace(/^\.\//,''));
  if (seen.has(url)) continue; seen.add(url);
  const js=await fetchText(url); if(!js) continue;
  for (const n of [...CONTROLS,...UNKNOWNS]) if (js.includes(n)) {
    (hits[n]=hits[n]||[]).push(url.split('/').pop());
    if (!ctxs[n]) { const i=js.indexOf(n); ctxs[n]=js.slice(Math.max(0,i-260), i+260); } }
  for (const m of js.matchAll(/["'`](?:\.\/|\/js\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9_-]{6,10}\.js)["'`]/g))
    if (!seen.has(APP+'/js/'+m[1])) queue.push('/js/'+m[1]);
}
console.log('\nchunks scanned:', seen.size, '(queue empty?', queue.length===0, ')');
for (const c of CONTROLS) console.log(`CONTROL ${JSON.stringify(c).padEnd(22)} ${hits[c]?'FOUND '+hits[c].length:'NOT FOUND — method failed'}`);
for (const u of UNKNOWNS) console.log(`        ${JSON.stringify(u).padEnd(22)} ${hits[u]?'FOUND in '+hits[u].length+': '+hits[u].slice(0,3):'not found'}`);
console.log('\n--- context around the interesting ones ---');
for (const k of ['Partially applied','Partially Applied','partially_applied','credit-memos/']) if (ctxs[k]) console.log(`\n### ${k}\n${ctxs[k]}`);
fs.writeFileSync(`${OUT}/credit-status-hunt.json`, JSON.stringify({scanned:seen.size, gets:[...new Set(gets)], hits, ctxs},null,1));
await browser.close();
