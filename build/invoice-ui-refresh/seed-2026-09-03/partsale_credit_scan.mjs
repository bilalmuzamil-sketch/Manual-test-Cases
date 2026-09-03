// The customer record carries `part_sale_credit_count`, so SOMETHING creates part-sale credits.
// Scan every front-end chunk for the strings that would name that flow, with controls included so a
// negative result is worth something (a bundle scan can confirm a string exists, never that it does not).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP } = await boot('sv8218', '/customers', 'admin');
const fetchText = u => page.evaluate(async x => { const r=await fetch(x,{credentials:'include'}); return r.ok? await r.text():''; }, u);
const CONTROLS=['part_sale_credit_count','Restocking fee','Receive Credit'];
const UNKNOWNS=['part-sale-credit','partSaleCredit','part_sale_credit','Restocking Fee','credit-memos','returnPart','customer-return','Return to inventory','Credit Customer','Issue Credit'];
const html=await fetchText(APP+'/');
const queue=[...[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1])], seen=new Set(), hits={}, ctxs={};
while (queue.length && seen.size < 700) {
  const s=queue.shift(); const url=s.startsWith('http')?s:APP+(s.startsWith('/')?s:'/js/'+s.replace(/^\.\//,''));
  if (seen.has(url)) continue; seen.add(url);
  const js=await fetchText(url); if(!js) continue;
  for (const n of [...CONTROLS,...UNKNOWNS]) if (js.includes(n)) { (hits[n]=hits[n]||[]).push(url.split('/').pop());
    if(!ctxs[n]){const i=js.indexOf(n); ctxs[n]=js.slice(Math.max(0,i-200), i+240);} }
  for (const m of js.matchAll(/["'`](?:\.\/|\/js\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9_-]{6,10}\.js)["'`]/g))
    if (!seen.has(APP+'/js/'+m[1])) queue.push('/js/'+m[1]);
}
console.log('chunks scanned:', seen.size, '| queue empty?', queue.length===0);
for (const c of CONTROLS) console.log(`CONTROL ${JSON.stringify(c).padEnd(24)} ${hits[c]?'FOUND '+hits[c].length+': '+hits[c].slice(0,3):'NOT FOUND - method failed'}`);
for (const u of UNKNOWNS) console.log(`        ${JSON.stringify(u).padEnd(24)} ${hits[u]?'FOUND in '+hits[u].length+': '+hits[u].slice(0,4):'not found'}`);
for (const k of ['part_sale_credit','partSaleCredit','part-sale-credit']) if (ctxs[k]) console.log(`\n### ${k}\n${ctxs[k]}`);
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/partsale-credit-scan.json', JSON.stringify({scanned:seen.size, hits, ctxs},null,1));
await browser.close();
