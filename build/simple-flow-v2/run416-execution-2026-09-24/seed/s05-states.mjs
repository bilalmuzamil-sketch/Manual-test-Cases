// Drive the part through its states: Pick one, Order another, then read back what each row shows.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const parts = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/work-orders/lines/${WO}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
  return (j.data?.collection||[]).flatMap(l => (l.parts||[]).map(p=>({num:p.part_number, desc:(p.description||'').slice(0,18), status:p.status_val, src:p.part_source_type}))); };
console.log('parts now:', JSON.stringify(await parts()));

await openWo(page, WO); await page.waitForTimeout(4500);
// what each row shows
const rows = async () => await page.evaluate(()=>[...document.querySelectorAll('tr')].map(tr=>{
  const t=(tr.innerText||'').replace(/\s+/g,' ').trim(); if (!/^\(/.test(t)) return null;
  return { text: t.slice(0,90), badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
    actions:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(x=>x && x!=='more_vert') }; }).filter(Boolean));
console.log('\nPART ROWS:'); for (const r of await rows()) console.log(' ', JSON.stringify(r));

// Pick the first part that offers Pick
const picked = await page.evaluate(() => {
  for (const tr of document.querySelectorAll('tr')) { const t=(tr.innerText||'').trim(); if (!/^\(/.test(t)) continue;
    const b=[...tr.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Pick');
    if (b) { b.click(); return 'pressed Pick on ' + t.replace(/\s+/g,' ').slice(0,40); } }
  return 'no Pick on any row'; });
console.log('\n' + picked);
await page.waitForTimeout(4000);
const dlg = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,400), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean) } : null; });
console.log('dialog after Pick:', JSON.stringify(dlg));
if (dlg) { await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Yes|Confirm|Pick|OK|Continue)$/i.test((x.innerText||'').trim())); if(b) b.click(); });
  await page.waitForTimeout(5000); }
await page.screenshot({ path: `${EV}/after-pick.png`, fullPage: true });
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
console.log('\nPART ROWS AFTER PICK:'); for (const r of await rows()) console.log(' ', JSON.stringify(r));
console.log('\nstored:', JSON.stringify(await parts()));
await browser.close();
