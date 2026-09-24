// What does the shop already have to build from: inventory parts with stock, vendors, and the
// endpoints the Add Part flow uses. Seed only what is missing (Rule 14).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const { browser, page, ctx, APIH } = await bootProdLogin('/parts', { settle: 12000 });
page.setDefaultTimeout(20000);
const G = async p => { const r = await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true}); const x=await r.text(); let j=null; try{j=JSON.parse(x);}catch{} return {s:r.status(),j,x:x.slice(0,300)}; };

const inv = await G('/api/inventory/parts?pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=');
const rows = inv.j?.data?.parts || inv.j?.data?.collection || inv.j?.data || [];
console.log('inventory endpoint', inv.s, '| shape', Array.isArray(rows)?'array':Object.keys(rows||{}).join(','));
const list = Array.isArray(rows) ? rows : (rows.parts || rows.collection || []);
console.log('inventory parts:', list.length);
if (list[0]) console.log('row keys:', Object.keys(list[0]).join(','));
for (const p of list.slice(0,15)) console.log('  ', (p.part_number||p.partNumber||''), '|', (p.description||p.name||'').slice(0,24), '| qty', p.quantity ?? p.on_hand ?? p.qty_on_hand, '| bin', p.bin_location||p.bin, '| id', p.id);
fs.writeFileSync(`${EV}/inventory.json`, JSON.stringify(list,null,1));

// vendors - the page tab is Parts -> Vendors
const seen=[];
page.on('response', r=>{ const u=r.url(); if (u.includes('/api/') && !u.includes('sentry')) seen.push(r.request().method()+' '+u.replace('https://api.shopview.com','')); });
await page.goto('https://app.shopview.com/parts/vendors',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const vt = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/vendors-page.txt`, vt);
console.log('\nvendor endpoints seen:', JSON.stringify([...new Set(seen.filter(s=>/vendor/i.test(s)))]));
console.log('vendors page text:', vt.slice(Math.max(0,vt.indexOf('Vendors')), vt.indexOf('Vendors')+700));
await browser.close();
