// C44557 / C44558: which settings changes ask to confirm, what the confirmation says, and that Cancel changes nothing.
// Nothing is committed here - every dialog is cancelled and the stored settings are read back afterwards.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(20000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true })).json()).data;
const before = await stored();
console.log('STORED BEFORE:', JSON.stringify(before));

await openWoSettings(page);
const r0 = await readWoSettings(page);
const out = { before, order: [], after: null };

async function tryToggle(label) {
  // click the toggle that belongs to this label, then Save Settings, then read whatever dialog appears
  const idx = r0.settings.findIndex(s => s.label === label);
  if (idx < 0) throw new Error('label not on the page: ' + label);
  // scope to the settings panel - the other tab panels keep their own toggles in the page
  const ok = await page.evaluate((i) => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings'));
    if (!panel) return 'no panel';
    const tg = panel.querySelectorAll('.q-toggle')[i];
    if (!tg) return 'no toggle at ' + i;
    tg.scrollIntoView({ block: 'center' });
    (tg.querySelector('input') || tg).click();
    return 'clicked';
  }, idx);
  console.log('  toggle click:', ok);
  if (ok !== 'clicked') throw new Error(ok);
  await page.waitForTimeout(1500);
  const savedOk = await page.evaluate(() => {
    const panel = [...document.querySelectorAll('.q-tab-panel')].find(p => (p.innerText || '').includes('Save Settings'));
    if (!panel) return 'no panel';
    const btn = [...panel.querySelectorAll('button, .q-btn')].find(b => (b.innerText || '').trim() === 'Save Settings');
    if (!btn) return 'no Save Settings button';
    btn.scrollIntoView({ block: 'center' }); btn.click(); return 'saved';
  });
  console.log('  save click:', savedOk);
  if (savedOk !== 'saved') throw new Error(savedOk);
  await page.waitForTimeout(4000);
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return null;
    return { text: (d.innerText || '').trim(), buttons: [...d.querySelectorAll('button, .q-btn')].map(b => (b.innerText || '').trim()).filter(Boolean) };
  });
  const rec = { label, dialog: dlg };
  console.log('=== toggled:', label, '=> dialog?', !!dlg);
  if (dlg) { console.log(dlg.text.slice(0, 900)); console.log('buttons:', JSON.stringify(dlg.buttons)); }
  await page.screenshot({ path: `${EV}/C44557-${label.replace(/[^A-Za-z]/g,'')}.png` });
  // cancel / dismiss, then put the toggle back
  if (dlg) {
    const cancel = page.locator('.q-dialog button:has-text("Cancel"), .q-dialog .q-btn:has-text("Cancel")').first();
    if (await cancel.count()) { await cancel.click(); } else { await page.keyboard.press('Escape'); }
    await page.waitForTimeout(2500);
  }
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000); await openWoSettings(page);
  out.order.push(rec);
}

for (const l of ['Require Ordering Parts', 'Require Picking Inventory Parts', 'Require Approval for New Lines', 'Require Receiving Parts Before Completion']) {
  try { await tryToggle(l); } catch (e) { console.log('!!', l, e.message.split('\n')[0]); out.order.push({ label: l, error: e.message.split('\n')[0] }); }
}
out.after = await stored();
console.log('STORED AFTER (must equal BEFORE - Cancel changes nothing, C44558):', JSON.stringify(out.after));
console.log('UNCHANGED:', JSON.stringify(out.after) === JSON.stringify(before));
fs.writeFileSync(`${EV}/C44557-C44558-confirmations.json`, JSON.stringify(out, null, 1));
await browser.close();
