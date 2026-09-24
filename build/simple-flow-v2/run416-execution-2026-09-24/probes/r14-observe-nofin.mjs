// Fresh session: what do I actually hold now, and with financial access gone, is money still drawn?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import { openPartsTab, readParts } from '../seed/lib-parts.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 12000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
out.perms = ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('permissions:', out.perms.length, '| seeFinancialData:', out.perms.includes('seeFinancialData'), '| woPickParts:', out.perms.includes('woPickParts'), '| woOrderParts:', out.perms.includes('woOrderParts'));
if (out.perms.includes('seeFinancialData')) { console.log('financial access is still held - not judging the money checks'); }
else {
  await openWo(page, WO); await page.waitForTimeout(7000);
  const t = await bodyText(page);
  out.cols = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
  out.money = { amounts: (t.match(/\$[\d,]+\.?\d*/g)||[]).slice(0,10), count: (t.match(/\$/g)||[]).length };
  console.log('columns on the lines page:', JSON.stringify(out.cols));
  console.log('money amounts still drawn:', JSON.stringify(out.money));
  await page.screenshot({ path: `${EV}/nofin-work-order.png`, fullPage: true });
  fs.writeFileSync(`${EV}/nofin-work-order.txt`, t);
  await openPartsTab(page, WO);
  const pt = await bodyText(page);
  out.partsCols = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
  out.partsMoney = { amounts: (pt.match(/\$[\d,]+\.?\d*/g)||[]).slice(0,10) };
  console.log('columns on the parts list:', JSON.stringify(out.partsCols));
  console.log('money on the parts list:', JSON.stringify(out.partsMoney));
  await page.screenshot({ path: `${EV}/nofin-parts.png`, fullPage: true });
  // the receive window without financial access (C44587, C44591 clause 4)
  const rec = page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').first();
  out.receiveOffered = await page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').count();
  if (out.receiveOffered) { await rec.click().catch(()=>{}); await page.waitForTimeout(7000);
    out.receiveModal = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      return d? { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,800), money:(d.innerText||'').match(/\$[\d,]+\.?\d*/g)||[],
        fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]) } : null; });
    console.log('receive window:', JSON.stringify(out.receiveModal));
    await page.screenshot({ path: `${EV}/nofin-receive.png` }); }
}
fs.writeFileSync(`${EV}/rerun-nofin.json`, JSON.stringify(out,null,1));
await browser.close();
