// observe_wo_salesrep.mjs — find and characterise the Sales Rep control on a work order, which is
// what feeds the Sales By Representative report. Serves the "SBR — Work Order Sales Rep" cases and
// unlocks seeding (assigning reps so more than one rep row exists). SECRET-FREE.
// Usage: node observe_wo_salesrep.mjs <workOrderId> [--page finance|lines]
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const woId = process.argv[2] || '45717cf3-c927-4bff-a49c-a0fa1d60f7d4';
const sub = (process.argv.includes('--page') ? process.argv[process.argv.indexOf('--page') + 1] : 'finance');
const OUT = new URL('../evidence/wo-salesrep/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const L = (...a) => console.log(...a);
const rec = { woId, sub, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };

const { browser, page, netlog } = await boot('admin');
await page.goto(`${APP}/workorders/${woId}/${sub}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);
rec.url = page.url();
L('URL:', rec.url);

rec.apiCalls = netlog.filter(n => n.url.includes('/api/'))
  .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
L('API CALLS:'); rec.apiCalls.forEach(c => L('  ', c.status, c.method, c.path.slice(0, 150)));

// any element whose label/text mentions a sales rep
rec.repControls = await page.evaluate(() => {
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
  const out = [];
  for (const el of document.querySelectorAll('.q-field, .q-select, .q-item, label, div, span')) {
    const t = txt(el);
    if (!/sales rep|sales representative|representative/i.test(t)) continue;
    if (t.length > 220) continue;
    out.push({ tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 140), text: t.slice(0, 200) });
  }
  return out.slice(0, 30);
});
L('REP CONTROLS:'); rec.repControls.forEach(r => L('  ', r.tag, JSON.stringify(r.text), '|', r.cls.slice(0, 70)));

rec.bodyText = await page.locator('body').innerText().catch(() => '');
rec.bodyHasSalesRep = /sales rep/i.test(rec.bodyText);
L('body mentions "sales rep":', rec.bodyHasSalesRep);
await page.screenshot({ path: OUT + `wo-${sub}.png`, fullPage: true });

// if there is a q-select for it, open it and list the options (the assignable reps)
{
  const sel = page.locator('.q-select').filter({ hasText: /Sales Rep/i }).first();
  if (await sel.count()) {
    const before = netlog.length;
    await clickEl(page, sel, 2200);
    rec.repOptions = await page.evaluate(() => {
      const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
      const m = ms[ms.length - 1]; if (!m) return null;
      return { items: Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()).filter(Boolean),
        hasSearch: !!m.querySelector('input') };
    });
    rec.repOptionsApi = netlog.slice(before).filter(n => n.url.includes('/api/'))
      .map(n => n.status + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 160));
    await page.screenshot({ path: OUT + 'wo-salesrep-dropdown.png' });
    L('REP OPTIONS:', JSON.stringify(rec.repOptions));
    L('  api on open:', JSON.stringify(rec.repOptionsApi));
    await page.keyboard.press('Escape').catch(() => {});
  } else { L('no q-select matching /Sales Rep/i on this page'); }
}

fs.writeFileSync(OUT + `wo-${sub}.json`, JSON.stringify(rec, null, 1));
fs.writeFileSync(OUT + `wo-${sub}-body.txt`, rec.bodyText);
L('wrote', OUT + `wo-${sub}.json`);
await browser.close();
