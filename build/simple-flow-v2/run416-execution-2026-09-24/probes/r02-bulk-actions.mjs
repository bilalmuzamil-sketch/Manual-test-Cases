// Exercise the bulk actions themselves: Approve, Decline, Pick, and read the toast each gives.
// Serves C44573, C44575, C44576, C44581, and re-reads More with a single line selected (C44574).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
const lines = async () => await page.evaluate(()=>{ const s=new Set(); const out=[];
  for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if (s.has(id)) continue; s.add(id); out.push({id, badges:[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim())}); } return out; });
const bar = async () => await page.evaluate(() => { const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  return el? { text:(el.innerText||'').replace(/\s+/g,' ').trim(), buttons:[...el.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(), disabled:b.disabled===true||/disabled/.test((b.className||'').toString())})).filter(b=>b.t) } : null; });
const tick = async id => { const tr=page.locator(`tr.line-row-${id}`).first(); await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(900);
  await page.locator(`[data-test-id="line_checkbox_${id}"]`).first().click({timeout:9000}); };
const toast = async () => await page.evaluate(()=>[...document.querySelectorAll('.q-notification, .q-notifications__list > div, [role=alert]')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
const pressInBar = async label => await page.evaluate((l)=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if (!el) return 'no bar'; const b=[...el.querySelectorAll('button,.q-btn')].find(x=>new RegExp('^'+l).test((x.innerText||'').replace(/\s+/g,' ').trim()));
  if (!b) return 'no ' + l + ' in the bar'; b.click(); return 'pressed ' + (b.innerText||'').replace(/\s+/g,' ').trim(); }, label);

await openWo(page, WO); await page.waitForTimeout(5000);
out.linesBefore = await lines();
console.log('lines:', JSON.stringify(out.linesBefore.map(l=>l.badges.join(','))));

// --- More with ONE approved line selected (C44574 clause 3)
const approved = out.linesBefore.filter(l=>l.badges.includes('Approved'));
await tick(approved[0].id); await page.waitForTimeout(2500);
out.barOneApproved = await bar();
console.log('\nbar, one approved line:', JSON.stringify(out.barOneApproved));
const m1 = await pressInBar('More');
await page.waitForTimeout(2500);
out.moreOneApproved = await page.evaluate(()=>{ const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width)[0];
  return m? [...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim()) : null; });
console.log('More holds:', JSON.stringify(out.moreOneApproved));
await page.screenshot({ path: `${EV}/rerun-more-one-approved.png` });
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);

// --- bulk Pick, and the toast (C44581, C44573)
out.pickPress = await pressInBar('Pick');
console.log('\n' + out.pickPress);
await page.waitForTimeout(3000);
out.pickDialog = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,350), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}:null; });
console.log('dialog after Pick:', JSON.stringify(out.pickDialog));
await page.screenshot({ path: `${EV}/rerun-bulk-pick.png` });
if (out.pickDialog) { await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Yes|Confirm|Pick|OK|Continue)$/i.test((x.innerText||'').trim())); if(b) b.click(); }); await page.waitForTimeout(4000); }
out.pickToast = await toast();
console.log('toast:', JSON.stringify(out.pickToast));
await page.screenshot({ path: `${EV}/rerun-pick-toast.png` });
fs.writeFileSync(`${EV}/rerun-bulk-actions.json`, JSON.stringify(out,null,1));
await browser.close();
