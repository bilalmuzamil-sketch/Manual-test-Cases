// C53488 (selecting purchase orders raises the shared bulk bar) and C44604 (Move up reorders a part
// within its line and persists).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const out = {};
const { browser, page, ctx, APIH } = await bootProdLogin('/parts/orders', { settle: 15000 });
page.setDefaultTimeout(20000);

// --- C53488: select a purchase order row
const vis = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0);
  if (!rows[0]) return null;
  rows[0].scrollIntoView({block:'center'});
  return { n: rows.length, text: (rows[0].innerText||'').replace(/\s+/g,' ').slice(0,120) };
});
console.log('visible purchase order rows:', JSON.stringify(vis));
if (vis) {
  const row = page.locator('tbody tr').filter({ hasText: /Receive/ }).first();
  await row.hover().catch(e=>console.log('hover:',e.message.split('\n')[0]));
  await page.waitForTimeout(1200);
  const cb = row.locator('input[type=checkbox], .q-checkbox').first();
  if (await cb.count()) { await cb.click({timeout:8000}).catch(e=>console.log('tick:',e.message.split('\n')[0])); await page.waitForTimeout(3000); }
  out.poBar = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].filter(e => /selected/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length < 180).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    return el ? { text:(el.innerText||'').replace(/\s+/g,' ').trim(), buttons:[...el.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean) } : null;
  });
  console.log('PO bulk bar:', JSON.stringify(out.poBar));
  await page.screenshot({ path: `${EV}/C53488-po-bulk.png` });
}

// --- C44604: Move up on a part, then read the order back
const WO='ce386c92-3d56-468f-9d57-a99ae5066175'; // S2-715, several parts on one line
const order = async () => (await ctx.request.get(`https://${APIH}/api/work-orders/lines/${WO}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true}).then(r=>r.json()))
  .data.collection.flatMap(l => (l.parts||[]).map(p=>p.part_number+':'+p.description));
out.partOrderBefore = await order();
console.log('\npart order before:', JSON.stringify(out.partOrderBefore));
await openWo(page, WO); await page.waitForTimeout(3000);
const mv = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
const n = await mv.count();
let moved = false;
for (let i = n - 1; i >= 0 && !moved; i--) {
  try { await mv.nth(i).click({timeout:6000}); await page.waitForTimeout(1800);
    const up = page.locator('.q-menu .q-item:has-text("Move up")').first();
    if (await up.count()) { await up.click(); await page.waitForTimeout(5000); moved = true; console.log('pressed Move up from menu #'+i); }
    else { await page.keyboard.press('Escape'); await page.waitForTimeout(600); }
  } catch(e){}
}
out.moved = moved;
await page.waitForTimeout(3000);
out.partOrderAfter = await order();
console.log('part order after :', JSON.stringify(out.partOrderAfter));
console.log('order changed:', JSON.stringify(out.partOrderBefore) !== JSON.stringify(out.partOrderAfter));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
out.partOrderAfterReload = await order();
console.log('after a reload  :', JSON.stringify(out.partOrderAfterReload));
console.log('persisted:', JSON.stringify(out.partOrderAfter) === JSON.stringify(out.partOrderAfterReload));
await page.screenshot({ path: `${EV}/C44604-after-move-up.png`, fullPage: true });
fs.writeFileSync(`${EV}/C53488-C44604.json`, JSON.stringify(out,null,1));
await browser.close();
