// seed_line_via_ui.mjs — add a work-order LINE through the UI's New Line dialog, because the API
// `POST /api/work-orders/lines/create` returns HTTP 500 on this branch once validation is satisfied
// (see the batch VERDICTS for the captured requestIds). Rule-14 self-seed playbook (b): when the API
// is broken, switch to the UI. SECRET-FREE.
//
// Usage: node seed_line_via_ui.mjs <workOrderId>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const woId = process.argv[2];
if (!woId) { console.error('usage: node seed_line_via_ui.mjs <workOrderId>'); process.exit(1); }
const OUT = new URL('../evidence/seeding/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const L = (...a) => console.log(...a);

const { browser, page, netlog } = await boot('admin');
await page.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);
L('url', page.url());

// find the New Line control
const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button,.q-btn'))
  .filter(b => b.getClientRects().length)
  .map(b => ({ text: (b.innerText || '').trim().replace(/\s+/g, ' '), aria: b.getAttribute('aria-label') })));
L('BUTTONS:', JSON.stringify(buttons.map(b => b.text || b.aria).filter(Boolean).slice(0, 30)));

const nl = page.locator('button, .q-btn').filter({ hasText: /New Line|Add Line/i }).first();
if (!(await nl.count())) { L('NO New Line button found'); await page.screenshot({ path: OUT + 'no-newline.png', fullPage: true }); await browser.close(); process.exit(3); }
await clickEl(page, nl, 3500);
await page.screenshot({ path: OUT + 'newline-dialog.png', fullPage: true });

const dlg = await page.evaluate(() => {
  const d = Array.from(document.querySelectorAll('.q-dialog')).filter(e => e.getClientRects().length)[0];
  if (!d) return null;
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
  return { text: txt(d).slice(0, 2500),
    inputs: Array.from(d.querySelectorAll('input')).map(i => ({ ph: i.getAttribute('placeholder'),
      aria: i.getAttribute('aria-label'), type: i.type, label: i.closest('.q-field')?.querySelector('.q-field__label')?.textContent?.trim() })),
    selects: Array.from(d.querySelectorAll('.q-select')).map(s => txt(s).slice(0, 80)),
    buttons: Array.from(d.querySelectorAll('button,.q-btn')).map(b => txt(b)).filter(Boolean) };
});
L('DIALOG:', JSON.stringify(dlg, null, 1).slice(0, 2200));

if (dlg) {
  // fill the first text input (line name) and any price input we can identify
  const inputs = await page.locator('.q-dialog input').all();
  if (inputs.length) { await inputs[0].fill('ZZAUTOTEST VIU line').catch(() => {}); }
  for (const i of inputs.slice(1)) {
    const lab = await i.evaluate(el => (el.closest('.q-field')?.querySelector('.q-field__label')?.textContent || '') + '|' + (el.getAttribute('placeholder') || '')).catch(() => '');
    if (/price|rate|hour|time|qty|amount/i.test(lab)) { await i.fill('2').catch(() => {}); L('  filled', JSON.stringify(lab), 'with 2'); }
  }
  await page.screenshot({ path: OUT + 'newline-filled.png', fullPage: true });
  const before = netlog.length;
  const save = page.locator('.q-dialog button, .q-dialog .q-btn').filter({ hasText: /^(Save|Add|Create|Done)$/i }).first();
  L('save button present:', await save.count());
  await clickEl(page, save, 6000);
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/'))
    .map(n => n.status + ' ' + n.method + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 130));
  L('SAVE api:', JSON.stringify(calls));
  await page.screenshot({ path: OUT + 'newline-after-save.png', fullPage: true });
  L('page text tail:', (await page.locator('body').innerText().catch(() => '')).slice(-900).replace(/\n+/g, ' | '));
}
await browser.close();
