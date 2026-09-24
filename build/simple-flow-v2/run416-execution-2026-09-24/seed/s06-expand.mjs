import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const raw = await (await ctx.request.get(`https://${APIH}/api/work-orders/lines/${WO}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
fs.writeFileSync(`${EV}/lines-raw.json`, JSON.stringify(raw,null,1));
const coll = raw.data?.collection || [];
console.log('lines in the feed:', coll.length);
for (const l of coll) console.log('  line', l.id, l.status, '| parts', (l.parts||[]).length, '| keys', Object.keys(l).slice(0,14).join(','));
await openWo(page, WO); await page.waitForTimeout(4500);
// expand every collapsed line
const expanded = await page.evaluate(() => {
  let n = 0;
  for (const b of document.querySelectorAll('button,.q-btn')) {
    const t = (b.innerText||'').trim();
    if (t === 'expand_more' || t === 'keyboard_arrow_down') { b.click(); n++; }
  }
  return n;
});
console.log('expanded', expanded, 'lines');
await page.waitForTimeout(4000);
const rows = await page.evaluate(()=>[...document.querySelectorAll('tr')].map(tr=>{
  const t=(tr.innerText||'').replace(/\s+/g,' ').trim(); if (!/^\(/.test(t)) return null;
  return { text: t.slice(0,80), badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
    actions:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(x=>x&&x!=='more_vert') }; }).filter(Boolean));
console.log('PART ROWS:'); for (const r of rows) console.log(' ', JSON.stringify(r));
await page.screenshot({ path: `${EV}/expanded.png`, fullPage: true });
await browser.close();
