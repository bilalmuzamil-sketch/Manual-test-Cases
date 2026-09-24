// The decisive test for the sweep: record every part's state and every purchase order BEFORE, turn
// Require Ordering Parts OFF, then record them again. The spec says outstanding parts are placed on
// purchase orders and move to Awaiting; the build's own dialog says no record is changed.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const G = async p => { const r = await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true}); const x=await r.text(); let j=null; try{j=JSON.parse(x);}catch{} return {s:r.status(),j,x}; };

async function snapshot(tag) {
  const list = JSON.parse(fs.readFileSync(`${EV}/wo-list.json`,'utf8')).filter(w => (w.partRequestsCount||0)>0).slice(0,45);
  const parts = [];
  for (const w of list) {
    const r = await G(`/api/work-orders/lines/${w.id}`);
    if (r.s !== 200) continue;
    for (const l of (r.j.data?.collection||[])) for (const p of (l.parts||[]))
      parts.push({ wo:w.number, line:l.status, part:p.id, num:p.part_number, status:p.status_val, src:p.part_source_type, vendor:p.vendor_id });
  }
  fs.writeFileSync(`${EV}/parts-${tag}.json`, JSON.stringify(parts,null,1));
  const counts = {}; for (const p of parts) counts[p.status] = (counts[p.status]||0)+1;
  console.log(`[${tag}] parts ${parts.length} ->`, JSON.stringify(counts));
  return parts;
}
const before = await snapshot('before-ordering-off');

// turn Require Ordering Parts OFF through the screen
await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await openWoSettings(page);
const r0 = await readWoSettings(page);
const idx = r0.settings.findIndex(s => s.label === 'Require Ordering Parts');
console.log('Require Ordering Parts currently', r0.settings[idx].on ? 'ON' : 'off');
await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(idx).click();
await page.waitForTimeout(3500);
const dlg = await page.evaluate(()=>{const d=document.querySelector('.q-dialog');return d?(d.innerText||'').trim():null;});
console.log('DIALOG (turning it off):', dlg && dlg.replace(/\n+/g,' | '));
await page.screenshot({ path: `${EV}/C44554-ordering-off-dialog.png` });
const aff = page.locator('.q-dialog').locator('button:has-text("Turn Off"), .q-btn:has-text("Turn Off")').first();
await aff.click();
let prog=null; for (let i=0;i<20;i++){ await page.waitForTimeout(700);
  const p=await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-spinner,.q-linear-progress,.q-circular-progress,[role=progressbar]')].filter(e=>e.getBoundingClientRect().width>0);return b.length?b.length:null;}); if(p){prog=p;break;} }
console.log('progress indicator while applying:', prog);
await page.waitForTimeout(3000);
const save = page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first();
await save.click({ timeout: 20000 }).catch(e=>console.log('save:', e.message.split('\n')[0]));
await page.waitForTimeout(9000);
const st = (await G('/api/organizations/settings')).j.data;
console.log('stored now:', JSON.stringify({ordering:st.requireOrderingParts}));
const after = await snapshot('after-ordering-off');
// did any part change?
const bm = new Map(before.map(p=>[p.part,p.status]));
const changed = after.filter(p => bm.get(p.part) !== p.status);
console.log('PARTS WHOSE STATE CHANGED:', changed.length, JSON.stringify(changed.slice(0,10)));
fs.writeFileSync(`${EV}/C44554-sweep-result.json`, JSON.stringify({ dialog: dlg, progress: prog, changed }, null, 1));
await browser.close();
