// Add three lines, filling the description properly this time, and read back how many lines the work
// order has and what status a brand-new line starts in.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const count = async () => { await openWo(page, WO); await page.waitForTimeout(5000);
  return await page.evaluate(()=>{ const s=new Set(); const out=[];
    for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if (s.has(id)) continue; s.add(id); out.push([...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim()).join(',')); }
    return out; }); };
console.log('lines before:', JSON.stringify(await count()));
for (let i = 1; i <= 3; i++) {
  await openWo(page, WO); await page.waitForTimeout(4000);
  await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b) b.click(); });
  await page.waitForTimeout(6000);
  const what = page.locator('.q-dialog .q-field:has-text("What Are You Doing") input, .q-dialog .q-field:has-text("What Are You Doing") textarea').first();
  const n = await what.count();
  console.log(`line ${i}: description field found:`, n);
  if (n) { await what.click(); await what.fill(`ZZAUTOTEST seeded line ${i}`); await page.waitForTimeout(1500);
    console.log('  typed:', await what.inputValue().catch(()=>'(textarea)')); }
  const why = page.locator('.q-dialog .q-field:has-text("Why Are You Doing It") input, .q-dialog .q-field:has-text("Why Are You Doing It") textarea').first();
  if (await why.count()) { await why.fill('seeded for the Simple Flow checks').catch(()=>{}); await page.waitForTimeout(800); }
  await page.screenshot({ path: `${EV}/newline-${i}.png` });
  const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if (!d) return 'dialog gone';
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return 'no Save & Close'; if (b.disabled || /disabled/.test((b.className||'').toString())) return 'Save & Close is disabled';
    b.click(); return 'pressed Save & Close'; });
  console.log('  ', saved);
  await page.waitForTimeout(7000);
  const err = await page.evaluate(()=>{ const t=document.body.innerText; const m=t.match(/(required|error|failed)[^\n]{0,60}/i); return m?m[0]:null; });
  if (err) console.log('   message on screen:', err);
}
console.log('lines after:', JSON.stringify(await count()));
await page.screenshot({ path: `${EV}/lines-after-new.png`, fullPage: true });
await browser.close();
