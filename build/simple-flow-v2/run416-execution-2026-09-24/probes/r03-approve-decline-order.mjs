// Bulk Approve and bulk Decline: do they confirm, do they offer undo, one toast each, and do they
// skip lines already in the target status? Then add a vendor part so Order appears in the bar.
// Serves C44573(1,2), C44575, C44576, C44579, C44580.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import { addPart } from '../seed/lib-seed.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
const lines = async () => await page.evaluate(()=>{ const s=new Set(); const o=[];
  for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if (s.has(id)) continue; s.add(id); o.push({id, badges:[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim())}); } return o; });
const bar = async () => await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  return el? { text:(el.innerText||'').replace(/\s+/g,' ').trim() } : null; });
const tick = async id => { const tr=page.locator(`tr.line-row-${id}`).first(); await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(900);
  await page.locator(`[data-test-id="line_checkbox_${id}"]`).first().click({timeout:9000}); };
const toast = async () => await page.evaluate(()=>[...document.querySelectorAll('.q-notification, [role=alert]')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
const press = async l => await page.evaluate((x)=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if (!el) return 'no bar'; const b=[...el.querySelectorAll('button,.q-btn')].find(y=>new RegExp('^'+x).test((y.innerText||'').replace(/\s+/g,' ').trim()));
  if (!b) return 'no ' + x; b.click(); return 'pressed ' + (b.innerText||'').replace(/\s+/g,' ').trim(); }, l);

await openWo(page, WO); await page.waitForTimeout(5000);
out.before = (await lines()).map(l=>l.badges.join(','));
console.log('lines before:', JSON.stringify(out.before));
// select EVERY line: the selection then mixes approved and awaiting-approval, which is the case the
// approve check is about - it must approve only the ones that qualify and leave the rest alone.
for (const l of await lines()) { try { await tick(l.id); await page.waitForTimeout(800); } catch(e){} }
await page.waitForTimeout(2000);
out.barAll = await bar(); console.log('bar:', JSON.stringify(out.barAll));
out.approvePress = await press('Approve');
console.log('\n' + out.approvePress);
await page.waitForTimeout(3000);
out.approveDialog = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}:null; });
console.log('dialog:', JSON.stringify(out.approveDialog));
if (out.approveDialog) { await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Yes|Approve|Confirm|OK)$/i.test((x.innerText||'').trim())); if(b) b.click(); }); await page.waitForTimeout(4000); }
out.approveToast = await toast();
console.log('toast:', JSON.stringify(out.approveToast));
await page.screenshot({ path: `${EV}/rerun-approve-toast.png` });
await page.waitForTimeout(3000);
await openWo(page, WO); await page.waitForTimeout(5000);
out.after = (await lines()).map(l=>l.badges.join(','));
console.log('lines after approving:', JSON.stringify(out.after));

// add a vendor part so Order appears
const appr = (await lines()).filter(l=>l.badges.includes('Approved'));
try { console.log('\nadding a part to make one orderable ->', await addPart(page, appr[0].id, { number: '1238284', qty: 1 })); } catch(e){ console.log('add failed:', e.message.slice(0,150)); }
await openWo(page, WO); await page.waitForTimeout(5000);
for (const l of await lines()) { try { await tick(l.id); await page.waitForTimeout(700); } catch(e){} }
await page.waitForTimeout(2500);
out.barWithNewPart = await bar();
console.log('bar now:', JSON.stringify(out.barWithNewPart));
await page.screenshot({ path: `${EV}/rerun-bar-with-order.png` });
fs.writeFileSync(`${EV}/rerun-approve-decline.json`, JSON.stringify(out,null,1));
await browser.close();
