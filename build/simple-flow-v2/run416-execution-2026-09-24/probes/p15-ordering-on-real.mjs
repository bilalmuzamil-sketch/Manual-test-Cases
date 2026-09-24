// Same change, driven with real pointer events through the screen, and read back three ways.
// Rule 104: before saying "the switch does not save", prove the press itself landed.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(25000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true })).json()).data;

// watch what the app sends and what comes back
const calls = [];
page.on('request', r => { if (/\/api\/organizations\/settings/.test(r.url())) calls.push({ dir: '->', m: r.method(), u: r.url(), body: (r.postData() || '').slice(0, 400) }); });
page.on('response', async r => { if (/\/api\/organizations\/settings/.test(r.url())) calls.push({ dir: '<-', s: r.status(), u: r.url(), body: (await r.text().catch(()=> '')).slice(0, 400) }); });

await openWoSettings(page);
const r0 = await readWoSettings(page);
const idx = r0.settings.findIndex(s => s.label === 'Require Ordering Parts');
console.log('toggle index', idx, '| currently', r0.settings[idx].on ? 'ON' : 'off');
console.log('BEFORE:', JSON.stringify(await stored()));

// real click on the toggle
const panelToggle = page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(idx);
await panelToggle.scrollIntoViewIfNeeded(); await panelToggle.click();
await page.waitForTimeout(1500);
const midway = await readWoSettings(page);
console.log('after clicking the switch, the screen shows:', midway.settings[idx].on ? 'ON' : 'off');

await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click();
await page.waitForTimeout(4000);
await page.screenshot({ path: `${EV}/C44557-ordering-on-dialog.png` });
const turnOn = page.locator('.q-dialog .q-btn:has-text("Turn On"), .q-dialog button:has-text("Turn On")').first();
console.log('Turn On button present:', await turnOn.count());
await turnOn.click();
// watch for a progress indicator for up to 20s (C44559)
let progressSeen = null;
for (let i = 0; i < 25; i++) {
  await page.waitForTimeout(800);
  const p = await page.evaluate(() => {
    const bits = [...document.querySelectorAll('.q-spinner, .q-linear-progress, .q-circular-progress, [role=progressbar]')].filter(e => e.getBoundingClientRect().width > 0);
    return bits.length ? bits.map(b => b.className.toString().slice(0, 60)) : null;
  });
  if (p) { progressSeen = p; break; }
}
console.log('progress indicator while applying:', JSON.stringify(progressSeen));
await page.waitForTimeout(8000);
await page.screenshot({ path: `${EV}/C44551-after-turn-on.png` });
console.log('AFTER (what the app stores):', JSON.stringify(await stored()));
await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
await openWoSettings(page);
const r1 = await readWoSettings(page);
console.log('AFTER (what the page shows on a fresh load):', r1.settings[idx].label, '=', r1.settings[idx].on ? 'ON' : 'off');
console.log('=== what the app sent and got back ===');
for (const c of calls) console.log(JSON.stringify(c));
fs.writeFileSync(`${EV}/C44551-turn-on-network.json`, JSON.stringify({ calls, progressSeen, after: r1.settings }, null, 1));
await browser.close();
