// Seed ZZAUTOTEST inventory parts at the test location ON SCREEN (Parts > Inventory > New Inventory Part). Logged to seed-log.jsonl. SECRET-FREE.
import fs from 'fs';
import { start, APP, OUT, LOC, fillByLabel, selectByLabel, netlog, call } from './common.mjs';
const PARTS = [
  { d: 'ZZAUTOTEST RGWO Oil Filter', pn: 'ZZRGWO-OF1', cost: '8.10', sell: '14.37', qty: '50' },
  { d: 'ZZAUTOTEST RGWO Brake Pad Set', pn: 'ZZRGWO-BP2', cost: '41.25', sell: '89.99', qty: '20' },
  { d: 'ZZAUTOTEST RGWO Wiper Blade', pn: 'ZZRGWO-WB3', cost: '3.33', sell: '7.77', qty: '50' },
  { d: 'ZZAUTOTEST RGWO Hose Clamp', pn: 'ZZRGWO-HC4', cost: '0.41', sell: '1.13', qty: '100' },
];
const only = process.argv[2] ? PARTS.filter(p => p.pn === process.argv[2]) : PARTS;
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const net = []; netlog(page, net);
for (const p of only) {
  await page.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(5000);
  await page.locator('[data-test-id="button_new_inventory_part"]').click({ force: true }); await page.waitForTimeout(2500);
  await fillByLabel(page, 'Description', p.d); await fillByLabel(page, 'Part Number', p.pn);
  await selectByLabel(page, 'Category', 'Uncategorized'); await fillByLabel(page, 'Cost', p.cost); await page.waitForTimeout(1500); await fillByLabel(page, 'Sell Price', p.sell); await fillByLabel(page, 'Quantity', p.qty); await page.waitForTimeout(800);
  const vals = await page.evaluate(() => [...document.querySelectorAll('.q-dialog .q-field')].map(f => (f.querySelector('.q-field__label')?.innerText || '') + '=' + (f.querySelector('input')?.value || f.querySelector('.q-field__native')?.innerText || '')).join(' ; ')); console.log('FORM', vals);
  await page.screenshot({ path: '/tmp/cln/rgwo/seed-' + p.pn + '.png' });
  await page.locator('.q-dialog button', { hasText: /^\s*Save\s*$/ }).first().click({ force: true }); await page.waitForTimeout(4000);
  const err = await page.locator('.q-dialog .q-field--error, .q-notification').allInnerTexts().catch(() => []);
  console.log(p.pn, 'dialog open after save:', await page.locator('.q-dialog').count(), 'errors:', JSON.stringify(err).slice(0, 300));
}
const inv = await call(page, 'GET', '/api/inventory/parts?pagination[rowsPerPage]=100');
const rows = (inv.j?.data?.collection || []).map(x => Object.fromEntries(Object.entries(x).filter(([k]) => /id$|number|desc|quantity|price|cost|sell/i.test(k))));
fs.writeFileSync('/tmp/cln/rgwo/inventory.json', JSON.stringify(inv.j, null, 1));
console.log(JSON.stringify(rows, null, 0).slice(0, 2000));
console.log(net.map(n => n.m + ' ' + n.u + ' ' + n.s + ' ' + n.resp.slice(0, 120)).join('\n'));
await browser.close();
