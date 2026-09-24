// Seed the part states the checks need, on the approved lines of S2-908.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { addPart } from './lib-seed.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const parts = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/work-orders/lines/${WO}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
  return (j.data?.collection||[]).flatMap(l => (l.parts||[]).map(p=>({line:l.status, num:p.part_number, desc:p.description, status:p.status_val, src:p.part_source_type, vendor:p.vendor_id}))); };
console.log('BEFORE:', JSON.stringify(await parts(), null, 0).slice(0,800));
await openWo(page, WO); await page.waitForTimeout(4000);
const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))]);
const badges = await page.evaluate(()=>{ const out={}; for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
  const b=[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim()); if (b.length) out[id]=b; } return out; });
console.log('lines:', JSON.stringify(badges));
const approved = Object.entries(badges).filter(([,b])=>b.includes('Approved')).map(([id])=>id);
console.log('approved lines:', approved.length);
try { console.log('add inventory part ->', await addPart(page, approved[0], { number: '1237944', qty: 2 })); }
catch(e) { console.log('add failed:', e.message.slice(0,300)); }
await page.screenshot({ path: `${EV}/after-add-inventory.png`, fullPage: true });
console.log('AFTER:', JSON.stringify(await parts(), null, 0).slice(0,1000));
await browser.close();
