// ui_full_wo_flow.mjs — create a work order ENTIRELY through the product's own screens (the gap the
// original SV-8821 evidence admitted it never closed), and capture exactly what the "Create Work
// Order" dialog sends — in particular whether it sets a CONTACT on the work order.
// Then report the Finance-tab state that results.
import fs from 'fs';
import { boot } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const OUT = '/tmp/sv8821/ui-fullflow'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const calls = [];
page.on('request', r => { if (r.url().includes('/api/')) calls.push({ phase: 'req', method: r.method(), url: r.url(), body: r.postData() }); });
page.on('response', async r => {
  if (!r.url().includes('/api/')) return;
  let body = null; try { body = (await r.text()).slice(0, 900); } catch {}
  calls.push({ phase: 'res', status: r.status(), method: r.request().method(), url: r.url(), body });
});
const click = async (loc, why) => {
  const b = await loc.boundingBox().catch(() => null);
  if (!b) { console.log('  !! cannot click:', why); return false; }
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  return true;
};

await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);
await click(page.locator('button').filter({ hasText: 'Create Work Order' }).first(), 'Create Work Order');
await page.waitForTimeout(3500);

// Customer select — a Quasar q-select; click it, type, pick the first option
const dlg = page.locator('.q-dialog:visible');
await click(dlg.locator('.q-field').filter({ hasText: 'Customer' }).first(), 'Customer select');
await page.waitForTimeout(1800);
await page.keyboard.type('Aab', { delay: 60 });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/01-customer-options.png`, fullPage: true });
let opts = await page.locator('.q-menu:visible .q-item').allInnerTexts().catch(() => []);
console.log('CUSTOMER OPTIONS:', JSON.stringify(opts.slice(0, 6).map(o => o.trim().replace(/\s+/g, ' '))));
if (opts.length) { await click(page.locator('.q-menu:visible .q-item').first(), 'first customer'); await page.waitForTimeout(2500); }

// Asset select
await click(dlg.locator('.q-field').filter({ hasText: 'Asset' }).first(), 'Asset select');
await page.waitForTimeout(2200);
opts = await page.locator('.q-menu:visible .q-item').allInnerTexts().catch(() => []);
console.log('ASSET OPTIONS:', JSON.stringify(opts.slice(0, 6).map(o => o.trim().replace(/\s+/g, ' '))));
if (opts.length) { await click(page.locator('.q-menu:visible .q-item').first(), 'first asset'); await page.waitForTimeout(2000); }
await page.screenshot({ path: `${OUT}/02-dialog-filled.png`, fullPage: true });
console.log('DIALOG NOW:', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400));

const mark = calls.length;
await click(dlg.locator('button').filter({ hasText: /^Save$/ }).first(), 'Save');
await page.waitForTimeout(8000);
await page.screenshot({ path: `${OUT}/03-after-save.png`, fullPage: true });
console.log('URL after save:', page.url());

console.log('\n=== WHAT THE DIALOG SENT ===');
for (const c of calls.slice(mark)) {
  const p = c.url.replace(/^https:\/\/[^/]+/, '');
  if (c.phase === 'req' && c.method !== 'GET') console.log('  REQ ', c.method, p, '\n        body:', String(c.body || '').slice(0, 500));
  if (c.phase === 'res' && /work-orders\/create/.test(p)) console.log('  RES ', c.status, p, '\n        body:', String(c.body || '').slice(0, 300));
}
fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));

// what does the resulting work order look like, and is Finance reachable?
const m = page.url().match(/workorders\/([0-9a-f-]{36})/);
if (m) {
  console.log('\nUI-CREATED WORK ORDER:', m[1]);
  const st = await page.evaluate(() => {
    const t = [...document.querySelectorAll('[role="tab"]')].find(x => /Finance/.test(x.innerText));
    const card = document.body.innerText;
    return { financeDisabled: t ? (t.getAttribute('aria-disabled') === 'true' || t.className.includes('disabled')) : null,
      mentionsContact: /Contact/.test(card) };
  });
  console.log('  Finance tab disabled on a UI-created work order?', st.financeDisabled);
  const fin = page.locator('[role="tab"]').filter({ hasText: 'Finance' }).first();
  const fb = await fin.boundingBox().catch(() => null);
  if (fb) { await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2); await page.waitForTimeout(2000);
    const tips = await page.locator('.q-tooltip, [role="tooltip"]').allInnerTexts().catch(() => []);
    console.log('  Finance tab tooltip:', JSON.stringify(tips.map(t => t.trim()).filter(Boolean))); }
  fs.writeFileSync('/tmp/sv8821/ui-created-wo.txt', m[1]);
  await page.screenshot({ path: `${OUT}/04-wo-detail.png`, fullPage: true });
}
await browser.close();
console.log('evidence:', OUT);
