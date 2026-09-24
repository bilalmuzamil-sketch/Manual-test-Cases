// The description field is a combobox - the typed text has to be committed with Enter. The dialog also
// carries a "Line Approved" tick box, left unticked so the line starts awaiting approval.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const lines = async () => { await openWo(page, WO); await page.waitForTimeout(5000);
  return await page.evaluate(()=>{ const s=new Set(); const out=[];
    for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if (s.has(id)) continue; s.add(id); out.push([...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim()).join(',')); }
    return out; }); };
console.log('lines before:', JSON.stringify(await lines()));
for (let i = 1; i <= 2; i++) {
  await openWo(page, WO); await page.waitForTimeout(4000);
  await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b) b.click(); });
  await page.waitForTimeout(6000);
  const what = page.locator('.q-dialog .q-field:has-text("What Are You Doing") input').first();
  await what.click(); await what.fill(`ZZAUTOTEST seeded line ${i}`);
  await page.waitForTimeout(2500);
  await page.keyboard.press('Enter');          // commit the typed value into the combobox
  await page.waitForTimeout(2000);
  const why = page.locator('.q-dialog .q-field:has-text("Why Are You Doing It") input, .q-dialog .q-field:has-text("Why Are You Doing It") textarea').first();
  if (await why.count()) { await why.click().catch(()=>{}); await why.fill('seeded for the Simple Flow checks').catch(()=>{}); await page.waitForTimeout(1200); }
  const state = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    return { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,260),
      fieldValues:[...d.querySelectorAll('input')].map(x=>x.value).filter(Boolean) }; });
  console.log(`line ${i} before saving:`, JSON.stringify(state));
  await page.screenshot({ path: `${EV}/newline2-${i}.png` });
  const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if (!d) return 'dialog gone'; const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
    b.click(); return 'pressed Save & Close'; });
  await page.waitForTimeout(7000);
  const err = await page.evaluate(()=>{ const t=document.body.innerText; const m=t.match(/(Required|error|failed)[^\n]{0,50}/i); return m?m[0]:null; });
  console.log('  ', saved, '| message:', err || 'none');
}
console.log('lines after:', JSON.stringify(await lines()));
await page.screenshot({ path: `${EV}/lines-after-new.png`, fullPage: true });
await browser.close();
