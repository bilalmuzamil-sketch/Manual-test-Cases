// ui_finance_tab.mjs — open a work order's Finance tab properly (by [role=tab]) and report exactly
// what the product shows there: the Create Invoice control, whether it is enabled, and any
// on-screen reason it gives. Then click it and capture the request/response.
import fs from 'fs';
import { boot } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';

const woId = process.argv[2], label = process.argv[3] || 'fin';
const OUT = `/tmp/sv8821/ui-${label}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });

const calls = [];
page.on('request', r => { if (r.url().includes('/api/')) calls.push({ phase: 'req', method: r.method(), url: r.url(), body: r.postData() }); });
page.on('response', async r => {
  if (!r.url().includes('/api/')) return;
  let body = null; try { body = (await r.text()).slice(0, 1200); } catch {}
  calls.push({ phase: 'res', status: r.status(), method: r.request().method(), url: r.url(),
    reqid: (r.headers()['x-request-id'] || null), body });
});

await page.goto(APP + `/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6500);

// click the Finance TAB element itself (not a text node that merely reads "Finance")
const tab = page.locator('[role="tab"]').filter({ hasText: 'Finance' }).first();
const tb = await tab.boundingBox().catch(() => null);
if (!tb) { console.log('!! Finance tab not found'); }
else { await page.mouse.click(tb.x + tb.width / 2, tb.y + tb.height / 2); }
await page.waitForTimeout(5000);
await page.screenshot({ path: `${OUT}/01-finance.png`, fullPage: true });

// the tab panel only — not the whole page chrome
let panel = await page.locator('.q-tab-panel:visible, [role="tabpanel"]:visible').last()
  .innerText().catch(() => null);
if (!panel) panel = await page.locator('body').innerText().catch(() => '');
fs.writeFileSync(`${OUT}/panel.txt`, panel);
console.log('=== FINANCE PANEL TEXT ===\n' + panel.replace(/\n{2,}/g, '\n').slice(0, 2500));

// every button in the panel, with its enabled state and any title/aria reason
const info = await page.evaluate(() => {
  const out = [];
  for (const b of document.querySelectorAll('button')) {
    const t = (b.innerText || '').trim().replace(/\s+/g, ' ');
    if (!t) continue;
    out.push({ text: t.slice(0, 60), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' || b.classList.contains('disabled'),
      title: b.getAttribute('title') || b.getAttribute('aria-label') || null });
  }
  return out;
});
console.log('\n=== BUTTONS ===');
info.forEach(b => console.log('  ', b.disabled ? 'DISABLED' : 'enabled ', '|', b.text, b.title ? '| title=' + b.title : ''));

const mark = calls.length;
const ci = page.locator('button').filter({ hasText: /Create Invoice/i }).first();
const cb = await ci.boundingBox().catch(() => null);
if (!cb) { console.log('\n!! no "Create Invoice" button found on the Finance tab'); }
else {
  console.log('\nclicking Create Invoice at', Math.round(cb.x), Math.round(cb.y));
  await page.mouse.click(cb.x + cb.width / 2, cb.y + cb.height / 2);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/02-after-click.png`, fullPage: true });
  const dlg = await page.locator('.q-dialog:visible').innerText().catch(() => '');
  if (dlg) {
    console.log('DIALOG:', dlg.replace(/\n+/g, ' | ').slice(0, 700));
    const confirm = page.locator('.q-dialog:visible button').filter({ hasText: /^(Create|Confirm|Yes|Save|OK|Create Invoice)$/i }).first();
    const bb = await confirm.boundingBox().catch(() => null);
    if (bb) { await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); console.log('confirmed dialog'); await page.waitForTimeout(5000); }
  }
  await page.screenshot({ path: `${OUT}/03-final.png`, fullPage: true });
  const after = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(`${OUT}/after.txt`, after);
  // surface any notification / error banner
  const notif = await page.locator('.q-notification, .q-banner, [role="alert"]').allInnerTexts().catch(() => []);
  console.log('NOTIFICATIONS:', JSON.stringify(notif));
}
console.log('\n=== API CALLS AFTER CLICK ===');
for (const c of calls.slice(mark)) {
  const p = c.url.replace(/^https:\/\/[^/]+/, '');
  if (c.phase === 'req') console.log('  REQ ', c.method, p, c.body ? '\n        body: ' + String(c.body).slice(0, 500) : '');
  else console.log('  RES ', c.status, c.method, p, c.reqid ? '| reqid ' + c.reqid : '',
    c.status >= 400 ? '\n        body: ' + String(c.body).slice(0, 500) : '');
}
fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
console.log('\nevidence:', OUT);
await browser.close();
