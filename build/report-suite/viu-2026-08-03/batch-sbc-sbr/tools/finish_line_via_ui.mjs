// finish_line_via_ui.mjs — add a TECH STORY to a work-order line and COMPLETE the line through the
// UI, capturing the endpoints so the rest of the chain can run over the API.
// Dialog contract (live 2026-08-04): clicking "Add tech story for this line" opens a
// "Tech Story: <line name>" dialog with a textarea and an "Update" button.
// SECRET-FREE. Usage: node finish_line_via_ui.mjs <workOrderId>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const woId = process.argv[2];
const OUT = new URL('../evidence/seeding/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const L = (...a) => console.log(...a);
const { browser, page } = await boot('admin');
const reqs = [];
page.on('request', r => { if (r.url().includes('/api/')) reqs.push({ m: r.method(), u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 600) }); });
page.on('response', r => { if (!r.url().includes('/api/')) return; const e = reqs.find(x => x.u === r.url().replace(/^https:\/\/[^/]+/, '') && x.s === undefined); if (e) e.s = r.status(); });

await page.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);

// 1. tech story
await clickEl(page, page.locator('text=Add tech story for this line').first(), 2600);
const ta = page.locator('.q-dialog textarea, .q-dialog input[type=text]').first();
L('textarea present:', await ta.count());
if (await ta.count()) {
  await ta.fill('ZZAUTOTEST VIU seed story').catch(() => {});
  await page.screenshot({ path: OUT + 'techstory-typed.png' });
  const before = reqs.length;
  await clickEl(page, page.locator('.q-dialog .q-btn').filter({ hasText: /^Update$/i }).first(), 6500);
  L('TECH STORY SAVE:'); reqs.slice(before).forEach(r => L('  ', r.s, r.m, r.u.slice(0, 110), '|', r.b.slice(0, 260)));
}

// 2. complete the line
{
  const before = reqs.length;
  await clickEl(page, page.locator('.q-btn').filter({ hasText: /^Complete$/ }).first(), 6500);
  const conf = page.locator('.q-dialog .q-btn').filter({ hasText: /^(Complete|Yes|Confirm|OK|Save)$/i }).first();
  if (await conf.count()) { L('confirm dialog present'); await clickEl(page, conf, 6500); }
  L('LINE COMPLETE:'); reqs.slice(before).forEach(r => L('  ', r.s, r.m, r.u.slice(0, 110), '|', r.b.slice(0, 260)));
  await page.screenshot({ path: OUT + 'line-complete-after.png', fullPage: true });
}
fs.writeFileSync(OUT + 'finish-line-requests.json', JSON.stringify(reqs, null, 1));
const body = await page.locator('body').innerText().catch(() => '');
L('tail:', body.slice(-500).replace(/\n+/g, ' | '));
await browser.close();
