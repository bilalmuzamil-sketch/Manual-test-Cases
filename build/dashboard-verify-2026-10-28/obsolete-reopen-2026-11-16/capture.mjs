// Fresh evidence for SV-8956 / SV-8950 / SV-8951 (16 Nov 2026): report screen + open Export menu + every download's
// file name; CSV checked for a Summary row. Heavy Duty, Asia/Karachi. Downloads stay in /tmp/cln/obs (never committed).
// Run: TZ=Asia/Karachi node capture.mjs
import fs from 'fs'; import { boot, LOC, APP, sleep, rule99, save } from '../report-gaps-2026-11-16/tools/sboot.mjs';
const EV = new URL('./', import.meta.url).pathname; const DL = '/tmp/cln/obs/';
const loc = LOC.HD; const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } });
const out = { start: await rule99(page, loc), reports: {} };
const rect = el => page.evaluate(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.x + r.width, r.y + r.height].map(Math.round); }, el);
for (const rep of ['technician-utilization', 'sales-by-customer']) {
  const R = out.reports[rep] = {};
  await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(8000);
  R.url = page.url(); R.top_text = (await page.evaluate(() => document.querySelector('main, .q-page')?.innerText || document.body.innerText)).slice(0, 700);
  const sum = page.locator('tr:has-text("Summary"), .summary-row, tfoot tr').first();
  if (await sum.count()) { R.summary_row_text = (await sum.innerText()).replace(/\s+/g, ' ').trim(); R.summary_row_box = await rect(await sum.elementHandle()); }
  const exp = page.locator('[aria-label="Export report"]').first(); R.export_box = await rect(await exp.elementHandle());
  await exp.click(); await sleep(1200);
  const m = page.locator('.q-menu').last(); R.menu_box = await rect(await m.elementHandle());
  R.menu_items = (await m.locator('.q-item').allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim());
  await page.screenshot({ path: EV + rep + '-export-menu.png' });
  await page.keyboard.press('Escape'); await sleep(800);
  R.downloads = [];
  for (const it of R.menu_items.filter(t => /download/i.test(t))) {
    await exp.click(); await sleep(900); const dP = page.waitForEvent('download', { timeout: 150000 }).catch(() => null);
    await page.locator('.q-menu').last().getByText(it, { exact: true }).first().click(); const d = await dP;
    const rec = { item: it, filename: d ? d.suggestedFilename() : null };
    if (d) { const p = DL + rep + '__' + rec.filename; await d.saveAs(p);
      if (/\.csv$/i.test(rec.filename)) { const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
        rec.csv_lines = lines.length; rec.csv_has_summary_row = lines.some(l => /^"?summary/i.test(l)); rec.csv_first_cells = lines.map(l => l.split(',')[0].replace(/"/g, '').slice(0, 30)).slice(0, 12); } }
    R.downloads.push(rec); console.log(rep, it, rec.filename, rec.csv_has_summary_row ?? ''); await page.keyboard.press('Escape'); await sleep(2500);
  }
}
out.end = await rule99(page, loc); save(EV + 'capture.json', out); await browser.close();
