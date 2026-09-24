// Turn Require Ordering Parts ON (it is off on this org) and see what actually happens:
// the confirmation, any progress indicator (C44559), what the app stores afterwards, and whether
// parts already on work orders were touched (C44553) or Order actions appeared (C44551 clause 2).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import { setWoSetting } from './lib4.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='47abc3c7-93a1-401c-9344-547e1066a4a2'; // S2-861 approved, 12 parts
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(20000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true })).json()).data;

// the part states BEFORE, straight from the work order the app itself reads
const woBefore = await (await ctx.request.get(`https://${APIH}/api/work-orders/${WO}`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true })).text();
fs.writeFileSync(`${EV}/S2-861-before-ordering-on.json`, woBefore);

await openWoSettings(page);
const r0 = await readWoSettings(page);
const idx = r0.settings.findIndex(s => s.label === 'Require Ordering Parts');
console.log('BEFORE stored:', JSON.stringify(await stored()));
const res = await setWoSetting(page, idx, { confirm: true, shotPath: `${EV}/C44559-ordering-on-dialog.png` });
console.log('dialog:', res.dialog && res.dialog.text.replace(/\n+/g, ' | '));
console.log('confirmed:', res.confirmed, res.pressed, '| progress indicator seen:', JSON.stringify(res.progress));
await page.screenshot({ path: `${EV}/C44559-ordering-on-after.png` });
await page.waitForTimeout(4000);
console.log('AFTER stored:', JSON.stringify(await stored()));

await openWo(page, WO);
const t = await bodyText(page);
fs.writeFileSync(`${EV}/S2-861-ordering-ON-lines.txt`, t);
await page.screenshot({ path: `${EV}/S2-861-ordering-ON-lines.png`, fullPage: true });
console.log('=== Order on the row? ===', /\bOrder\b/.test(t));
const menus = [];
const n = await page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")').count();
const all = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
for (let i = 0; i < Math.min(n, 8); i++) {
  try { await all.nth(i).click({ timeout: 7000 }); await page.waitForTimeout(2200);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')].map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean));
    menus.push(items); console.log(`menu#${i}:`, JSON.stringify(items));
    await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  } catch (e) { menus.push(['ERR ' + e.message.split('\n')[0]]); }
}
fs.writeFileSync(`${EV}/S2-861-ordering-ON-menus.json`, JSON.stringify({ menus, rowHasOrder: /\bOrder\b/.test(t) }, null, 1));
await browser.close();
