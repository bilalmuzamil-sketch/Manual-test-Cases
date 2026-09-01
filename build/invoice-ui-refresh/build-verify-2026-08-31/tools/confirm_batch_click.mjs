// confirm_batch_click.mjs — which toolbar icon on the customer's Invoices tab produces the BATCH
// document? Skill 18 forbids inventing a route, so this clicks the real control and watches the
// network for POST /api/invoices/batch-pdf rather than assuming.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const CID = process.env.CID;
const { browser, page } = await boot('/workorders');
const hits = [];
page.on('request', r => { if (/\/api\/invoices\/batch-pdf/.test(r.url())) hits.push(`${r.method()} ${r.url()}`); });
page.on('response', async r => { if (/batch-pdf/.test(r.url())) L('  >> batch-pdf response', r.status()); });

await page.goto(`${APP}/customers/${CID}/invoices`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => (document.body?.innerText || '').length > 900, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);
const t = await page.evaluate(() => {
  const cb = document.querySelector('[data-test-id="checkbox_select_all_transactions"]');
  if (!cb) return false; cb.click(); return true;
});
L('select-all ticked:', t);
await page.waitForTimeout(3000);
const toolbar = await page.evaluate(() =>
  [...document.querySelectorAll('[data-test-id="button_action"]')]
    .map((e, i) => ({ i, text: (e.innerText || '').trim(), title: e.getAttribute('title') || e.getAttribute('aria-label') || '' })));
L('toolbar actions:', JSON.stringify(toolbar));
for (const a of toolbar) {
  hits.length = 0;
  await page.evaluate(i => document.querySelectorAll('[data-test-id="button_action"]')[i].click(), a.i);
  await page.waitForTimeout(4000);
  L(`clicked action[${a.i}] "${a.text}" -> batch-pdf calls: ${hits.length ? JSON.stringify(hits) : 'none'}`);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1500);
}
await page.screenshot({ path: `${OUT}/evidence/batch-toolbar.png`, fullPage: true });
fs.writeFileSync(`${OUT}/evidence/batch-click.log`, log.join('\n') + '\n');
await browser.close();
