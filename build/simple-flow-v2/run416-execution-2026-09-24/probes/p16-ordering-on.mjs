// The real flow, learnt from the screen: clicking the switch itself opens the confirmation.
// Turn On -> then Save Settings -> then read back three ways.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const LABEL = process.argv[2] || 'Require Ordering Parts';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(25000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true })).json()).data;
const calls = [];
page.on('request', r => { if (/\/api\/organizations?\/settings/.test(r.url())) calls.push({ d:'->', m:r.method(), u:r.url().replace('https://api.shopview.com',''), body:(r.postData()||'').slice(0,300) }); });
page.on('response', async r => { if (/\/api\/organizations?\/settings/.test(r.url())) calls.push({ d:'<-', s:r.status(), u:r.url().replace('https://api.shopview.com',''), body:(await r.text().catch(()=>'')).slice(0,300) }); });

await openWoSettings(page);
const r0 = await readWoSettings(page);
const idx = r0.settings.findIndex(s => s.label === LABEL);
console.log(LABEL, '| index', idx, '| starts', r0.settings[idx].on ? 'ON' : 'off');
console.log('BEFORE:', JSON.stringify(await stored()));

await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(idx).click();
await page.waitForTimeout(3000);
const dlgText = await page.evaluate(() => { const d=document.querySelector('.q-dialog'); return d ? (d.innerText||'').trim() : null; });
console.log('dialog after clicking the switch:', dlgText && dlgText.replace(/\n+/g,' | '));
await page.screenshot({ path: `${EV}/C44557-${LABEL.replace(/[^A-Za-z]/g,'')}-dialog.png` });
const aff = page.locator('.q-dialog').locator('button:has-text("Turn On"), button:has-text("Turn Off"), .q-btn:has-text("Turn On"), .q-btn:has-text("Turn Off")').first();
console.log('affirmative button count:', await aff.count());
await aff.click({ timeout: 20000 });
let progressSeen = null;
for (let i = 0; i < 20; i++) { await page.waitForTimeout(700);
  const p = await page.evaluate(() => { const b=[...document.querySelectorAll('.q-spinner,.q-linear-progress,.q-circular-progress,[role=progressbar]')].filter(e=>e.getBoundingClientRect().width>0); return b.length?b.map(x=>x.className.toString().slice(0,50)):null; });
  if (p) { progressSeen = p; break; } }
console.log('progress indicator:', JSON.stringify(progressSeen));
await page.waitForTimeout(4000);
console.log('stored right after the confirmation:', JSON.stringify(await stored()));
// now the page's own Save
const saveBtn = page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first();
if (await saveBtn.count()) { await saveBtn.click({ timeout: 15000 }).catch(e=>console.log('save click:', e.message.split('\n')[0])); await page.waitForTimeout(6000); }
console.log('stored after Save Settings:', JSON.stringify(await stored()));
await page.screenshot({ path: `${EV}/${LABEL.replace(/[^A-Za-z]/g,'')}-after.png` });
await page.reload({ waitUntil:'domcontentloaded' }); await page.waitForTimeout(9000); await openWoSettings(page);
const r1 = await readWoSettings(page);
console.log('on a fresh load the page shows:', r1.settings[idx].label, '=', r1.settings[idx].on ? 'ON' : 'off');
console.log('=== what the app sent / got back ==='); for (const c of calls) console.log(JSON.stringify(c));
fs.writeFileSync(`${EV}/${LABEL.replace(/[^A-Za-z]/g,'')}-turn-network.json`, JSON.stringify({calls,progressSeen,after:r1.settings},null,1));
await browser.close();
