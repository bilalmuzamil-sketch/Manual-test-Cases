// With "Require Approval for New Lines" on, add three fresh lines so they start awaiting approval -
// material for the bulk approve and decline checks.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { setSetting } from './lib-seed.mjs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
console.log(await setSetting(page, 'Require Approval for New Lines', true));
const st = (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
console.log('requireApproval now:', !st.autoApproveLines, '| ordering', st.requireOrderingParts, '| requirePicking', !st.autoPickInventoryParts, '| receiving', st.requireVendorInvoiceNumber);
for (let i = 1; i <= 3; i++) {
  await openWo(page, WO); await page.waitForTimeout(4000);
  const clicked = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(!b) return 'no New Line'; b.click(); return 'clicked New Line'; });
  console.log(`line ${i}:`, clicked);
  await page.waitForTimeout(5000);
  const dlg = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    return d? {fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)} : null; });
  if (dlg) {
    console.log('  new-line dialog:', JSON.stringify(dlg));
    await page.locator('.q-dialog .q-field:has-text("What Are You Doing") input, .q-dialog .q-field:has-text("What Are You Doing") textarea').first().fill(`ZZAUTOTEST line ${i}`).catch(async()=>{
      await page.locator('.q-dialog input, .q-dialog textarea').first().fill(`ZZAUTOTEST line ${i}`).catch(()=>{}); });
    await page.waitForTimeout(1500);
    const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
      if(!b) return 'no Save & Close, buttons are: ' + [...d.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').replace(/\s+/g,' ').trim()).join('|');
      b.click(); return 'pressed Save & Close'; });
    console.log('  ', saved);
  } else {
    // an inline row instead of a dialog
    const inline = await page.evaluate(()=>{ const i=[...document.querySelectorAll('input')].find(x=>x.getBoundingClientRect().width && /name|description/i.test((x.closest('.q-field')?.innerText)||'')); return i? 'inline row open' : 'nothing opened'; });
    console.log('  ', inline);
    await page.locator('.q-field:has-text("Description") input, .q-field:has-text("Name") input').first().fill(`ZZAUTOTEST line ${i}`).catch(()=>{});
    await page.waitForTimeout(1000);
    const saved = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>(x.innerText||'').trim()==='Save'); if(!b) return 'no save'; b.click(); return 'saved'; });
    console.log('  ', saved);
  }
  await page.waitForTimeout(5000);
}
await openWo(page, WO); await page.waitForTimeout(5000);
const badges = await page.evaluate(()=>{ const out=[]; for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) {
  const b=[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim()); if (b.length) out.push(b); } return out; });
console.log('\nLINES NOW:', JSON.stringify(badges));
await page.screenshot({ path: `${EV}/lines-seeded.png`, fullPage: true });
await browser.close();
