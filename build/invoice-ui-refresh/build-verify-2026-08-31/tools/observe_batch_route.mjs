// observe_batch_route.mjs — find the UI route that produces a BATCH invoice document, so C44987's
// preconditions can carry a real route rather than an invented one (skill 18's hard line).
// The API call is POST /api/invoices/batch-pdf {invoiceIds}; this finds what a tester clicks.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const CID = process.env.CID;

const { browser, page } = await boot('/workorders');
const calls = [];
page.on('request', r => { if (/\/api\//.test(r.url()) && r.method() !== 'GET') calls.push(`${r.method()} ${r.url().split('/api/')[1].split('?')[0]}`); });

await page.goto(`${APP}/customers/${CID}/invoices`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => (document.body?.innerText || '').length > 900, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);
L('invoices tab:', page.url());
const surface = await page.evaluate(() => ({
  buttons: [...document.querySelectorAll('button, .q-btn')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 30),
  testids: [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).filter(x => /action|select|print|batch|checkbox/i.test(x)).slice(0, 25),
  rows: document.querySelectorAll('tbody tr').length,
}));
L('buttons:', JSON.stringify(surface.buttons));
L('relevant test-ids:', JSON.stringify(surface.testids));
L('rows:', surface.rows);

// tick the select-all checkbox, then look at what the Action menu offers
const ticked = await page.evaluate(() => {
  const cb = document.querySelector('[data-test-id="checkbox_select_all_transactions"]')
        || document.querySelector('thead .q-checkbox');
  if (!cb) return false; cb.click(); return true;
});
L('select-all ticked:', ticked);
await page.waitForTimeout(2500);
const act = await page.evaluate(() => {
  const b = document.querySelector('[data-test-id="button_action"]')
        || [...document.querySelectorAll('button, .q-btn')].find(e => /^\s*action/i.test(e.innerText || ''));
  if (!b) return { found: false };
  b.click(); return { found: true, label: (b.innerText || '').trim() };
});
L('Action control:', JSON.stringify(act));
await page.waitForTimeout(2500);
const menu = await page.evaluate(() =>
  [...document.querySelectorAll('.q-menu .q-item')].map(e => (e.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean));
L('Action menu offers:', JSON.stringify(menu));
await page.screenshot({ path: `${OUT}/evidence/batch-route.png`, fullPage: true });
L('non-GET api calls seen:', JSON.stringify([...new Set(calls)]));
fs.writeFileSync(`${OUT}/evidence/batch-route.log`, log.join('\n') + '\n');
await browser.close();
