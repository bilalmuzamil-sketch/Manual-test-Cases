// seed_line_via_ui2.mjs — drive the WO "New Line" dialog correctly and save a real labour line.
// Dialog contract observed live 2026-08-04 on sv8582:
//   selects : "What Are You Doing?" (searchable) · "Technician (Max 5)" · "Labor Rate"
//   inputs  : "Estimated time" (#.## hours) · "Tech time" (#.## hours)
//   checkbox: "Line Approved"
//   buttons : "Save & Add Part" · "Save & Add Line" · "Save & Close"
// SECRET-FREE. Usage: node seed_line_via_ui2.mjs <workOrderId>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const woId = process.argv[2];
const OUT = new URL('../evidence/seeding/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const L = (...a) => console.log(...a);
const { browser, page, netlog } = await boot('admin');
await page.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);

await clickEl(page, page.locator('button, .q-btn').filter({ hasText: /New Line/i }).first(), 3500);

async function pickFromSelect(labelRe, optionIndex = 0, typeText = null) {
  const sel = page.locator('.q-dialog .q-select').filter({ hasText: labelRe }).first();
  if (!(await sel.count())) { L('  select not found:', labelRe); return false; }
  await clickEl(page, sel, 1800);
  if (typeText) { await page.keyboard.type(typeText, { delay: 60 }); await page.waitForTimeout(2600); }
  const opts = await page.evaluate(() => {
    const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
    const m = ms[ms.length - 1]; if (!m) return [];
    return Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()).filter(Boolean);
  });
  L('  options for', String(labelRe), '->', JSON.stringify(opts.slice(0, 6)));
  if (!opts.length) { await page.keyboard.press('Escape'); return false; }
  const item = page.locator('.q-menu .q-item').nth(optionIndex);
  await clickEl(page, item, 2200);
  return true;
}

L('picking "What Are You Doing?"');
await pickFromSelect(/What Are You Doing/i, 0, 'Inspection');
L('picking Labor Rate');
await pickFromSelect(/Labor Rate/i, 0);

for (const [aria, val] of [['Estimated time', '2'], ['Tech time', '2']]) {
  const inp = page.locator(`.q-dialog input[aria-label="${aria}"]`).first();
  if (await inp.count()) { await inp.fill(val).catch(() => {}); L('  filled', aria, '=', val); }
}
// tick "Line Approved" so the line can be completed/invoiced
const appr = page.locator('.q-dialog .q-checkbox, .q-dialog .q-toggle').first();
if (await appr.count()) { await clickEl(page, appr, 900); L('  ticked Line Approved'); }

await page.screenshot({ path: OUT + 'newline2-filled.png', fullPage: true });
const before = netlog.length;
await clickEl(page, page.locator('.q-dialog .q-btn').filter({ hasText: /^Save & Close$/i }).first(), 8000);
const calls = netlog.slice(before).filter(n => n.url.includes('/api/'))
  .map(n => n.status + ' ' + n.method + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 120));
L('SAVE api:', JSON.stringify(calls));
await page.screenshot({ path: OUT + 'newline2-after.png', fullPage: true });
const body = await page.locator('body').innerText().catch(() => '');
L('has a line now?', /ZZAUTOTEST|Inspection/i.test(body));
L('tail:', body.slice(-700).replace(/\n+/g, ' | '));
await browser.close();
