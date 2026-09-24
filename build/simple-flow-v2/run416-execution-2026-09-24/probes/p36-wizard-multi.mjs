// Build a work order that has SEVERAL things outstanding, so the wizard has more than one step to show.
// Turn on Require Tech Story and Require Picking Inventory Parts, open the wizard from Complete on the
// line of S2-715 (inventory parts with cores plus a vendor part), read it, close it, then put both settings back.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='ce386c92-3d56-468f-9d57-a99ae5066175'; // S2-715
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(25000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
const out = { before: await stored() };
console.log('BEFORE:', JSON.stringify(out.before));

async function flip(label, dir) {
  await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  await openWoSettings(page);
  const r = await readWoSettings(page);
  const i = r.settings.findIndex(s=>s.label===label);
  if (i < 0) { console.log('!! label not found:', label); return; }
  if ((dir==='On') === r.settings[i].on) { console.log(label, 'already', dir); return; }
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(i).click();
  await page.waitForTimeout(3000);
  const aff = page.locator('.q-dialog').locator(`button:has-text("Turn ${dir}"), .q-btn:has-text("Turn ${dir}")`).first();
  if (await aff.count()) { await aff.click(); await page.waitForTimeout(2500); }
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click({timeout:20000}).catch(e=>console.log(' save:',e.message.split('\n')[0]));
  await page.waitForTimeout(7000);
  console.log('flipped', label, '->', dir);
}
await flip('Require Tech Story','On');
await flip('Require Picking Inventory Parts','On');
console.log('NOW:', JSON.stringify(await stored()));

await openWo(page, WO); await page.waitForTimeout(3500);
await page.screenshot({ path: `${EV}/C44595-S2-715-before.png`, fullPage: true });
const complete = page.locator('button:has-text("Complete"), .q-btn:has-text("Complete")').first();
console.log('Complete buttons:', await page.locator('button:has-text("Complete"), .q-btn:has-text("Complete")').count());
await complete.click(); await page.waitForTimeout(7000);
const wiz = await page.evaluate(() => {
  const d = [...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  if (!d) return null;
  return { text:(d.innerText||'').trim().slice(0,1500),
    pills:[...d.querySelectorAll('.q-chip,.q-tab,[role=tab],[class*=pill],[class*=step]')].map(e=>(e.innerText||'').trim()).filter(Boolean),
    buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>({t:(b.innerText||'').trim(),disabled:b.disabled===true||/disabled/.test((b.className||'').toString())})).filter(b=>b.t) };
});
console.log('\n=== WIZARD (several things outstanding) ==='); console.log(JSON.stringify(wiz,null,1));
await page.screenshot({ path: `${EV}/C44595-wizard-multi.png` });
out.wizard = wiz;
// leave without completing
const cancel = page.locator('.q-dialog .q-btn:has-text("Cancel")').first();
if (await cancel.count()) { await cancel.click(); await page.waitForTimeout(2000); } else { await page.keyboard.press('Escape'); await page.waitForTimeout(1500); }

// put the settings back exactly as they were
await flip('Require Tech Story','Off');
await flip('Require Picking Inventory Parts','Off');
out.after = await stored();
console.log('AFTER (must match BEFORE):', JSON.stringify(out.after));
console.log('RESTORED:', JSON.stringify(out.after)===JSON.stringify(out.before));
fs.writeFileSync(`${EV}/C44595-wizard-multi.json`, JSON.stringify(out,null,1));
await browser.close();
