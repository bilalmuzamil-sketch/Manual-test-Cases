// Run the permission checks as the REAL lower-permission person, not a role I built.
// Serves C44565(3), C44587, C44591(4), C44607, C44608, C44609, C44582, C44580(3).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 13000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
out.perms = ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('permissions:', out.perms.length, JSON.stringify(out.perms));

// move this person to the shop the seeded work order lives in
const wp = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn,div')].find(x=>/Truck Hill 1|Trucks Hill 2/.test((x.innerText||'').trim()) && (x.innerText||'').length<40);
  if (b) { b.click(); return 'opened the shop picker: ' + (b.innerText||'').trim(); } return 'no shop picker found'; });
console.log(wp); await page.waitForTimeout(3500);
const chose = await page.evaluate(()=>{ const it=[...document.querySelectorAll('.q-menu .q-item, .q-menu div')].find(e=>(e.innerText||'').trim()==='Trucks Hill 2');
  if (!it) return 'Trucks Hill 2 not offered: ' + [...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | ').slice(0,180);
  it.click(); return 'chose Trucks Hill 2'; });
console.log(chose); await page.waitForTimeout(9000);
await page.screenshot({ path: `${EV}/limitedperson-after-switch.png` });

await openWo(page, WO); await page.waitForTimeout(8000);
const t = await bodyText(page);
fs.writeFileSync(`${EV}/limitedperson-wo.txt`, t);
await page.screenshot({ path: `${EV}/limitedperson-wo.png`, fullPage: true });
out.reachedWo = !/totaled|404|Back To Work Orders/.test(t.slice(0,400));
out.cols = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
out.money = { amounts: (t.match(/\$[\d,]+\.?\d*/g)||[]).slice(0,8), count: (t.match(/\$/g)||[]).length };
out.actions = await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>['Order','Pick','Receive','Approve','Decline','Complete','Return','New Line'].includes(x)))]);
out.tickBoxes = await page.evaluate(()=>document.querySelectorAll('[data-test-id^="line_checkbox_"]').length);
console.log('\nreached the work order:', out.reachedWo);
console.log('columns:', JSON.stringify(out.cols));
console.log('money on the page:', JSON.stringify(out.money));
console.log('action buttons offered:', JSON.stringify(out.actions));
console.log('line tick boxes:', out.tickBoxes);
if (out.tickBoxes) {
  const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
  const tr=page.locator(`tr.line-row-${ids[0]}`).first(); await tr.hover().catch(()=>{}); await page.waitForTimeout(1000);
  await page.locator(`[data-test-id="line_checkbox_${ids[0]}"]`).first().click({timeout:9000}).catch(()=>{});
  await page.waitForTimeout(2500);
  out.bar = await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    return el? (el.innerText||'').replace(/\s+/g,' ').trim() : null; });
  console.log('bulk bar:', JSON.stringify(out.bar));
  await page.screenshot({ path: `${EV}/limitedperson-bar.png` });
}
fs.writeFileSync(`${EV}/rerun-limited-person.json`, JSON.stringify(out,null,1));
await browser.close();
