// d3d_toast.mjs — 11 Nov 2026 ~17:00: C715517 re-run. d3b clicked "Download (CSV)" on Sales By Customer, whose menu reads "Download Summary (CSV)" /
// "Download Summary (PDF)" (timeout), and A/R Summary's success message had no picture (the download beat the first look). Here: on each report a CSV
// (success message), then Location "Clear selection" and a PDF (empty-export warning); pictures of each message + the message box position and colours.
import { start, REPORTS } from './lib.mjs'; import { mkExp } from './explib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./d3d/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const E = mkExp(p, OUT); const F = mkFilt(p);
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(800); };
const chip = (re) => p.locator('main button', { hasText: re }).first();
const box = () => p.locator('.q-notification').evaluateAll((ns) => ns.map((n) => { const r = n.getBoundingClientRect(); const c = getComputedStyle(n); return { t: n.innerText.replace(/\s+/g, ' ').trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, color: c.color }; })).catch(() => []);
const o = { id: 'C715517' };
for (const [tag, k, csv, pdf] of [['ars', REPORTS.ars, 'Download (CSV)', 'Download (PDF)'], ['sbc', '/reports/sales-by-customer', 'Download Summary (CSV)', 'Download Summary (PDF)']]) {
  try { await p.setViewportSize({ width: 1440, height: 900 }); await s.go(k); await p.waitForTimeout(3000); await settle();
    const r = await E.exportAs('CSV', tag + '-csv', 60000, csv); o[tag + 'Csv'] = { file: !!r.file, notes: r.notes, toast: r.toast }; o[tag + 'CsvBox'] = await box();
    await p.waitForTimeout(6000); await chip(/Location:/).click(); await p.waitForTimeout(1000); const clr = p.locator('.q-menu:visible').getByText('Clear selection', { exact: true });
    o[tag + 'Clear'] = await clr.count(); if (o[tag + 'Clear']) await clr.click(); await p.keyboard.press('Escape'); await settle(); o[tag + 'Chip'] = (await F.chips()).find((c) => /Location/.test(c));
    await p.mouse.move(5, 890); await p.screenshot({ path: OUT + tag + '-cleared.png' });
    const r2 = await E.exportAs('PDF', tag + '-empty', 15000, pdf); o[tag + 'Empty'] = { file: !!r2.file, notes: r2.notes, toast: r2.toast }; o[tag + 'EmptyBox'] = await box();
  } catch (e) { o[tag + 'Err'] = String(e).slice(0, 300); await p.screenshot({ path: OUT + tag + '-error.png' }).catch(() => {}); } await p.waitForTimeout(6000); }
// C715529 comparison (added 18:45): Sales By Customer at 900 px - the "native mobile filter row" the PRD names (Out of scope: "Narrower than 1024
// pixels, the reports show the native mobile filter row"). Picture + the filter row's texts and whether a scroll arrow is there.
try { const q = { id: 'SBC900' }; await p.setViewportSize({ width: 900, height: 900 }); await s.go('/reports/sales-by-customer'); await p.waitForTimeout(3500); await settle();
  q.row = await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].filter((x) => /:/.test(x.innerText) && x.innerText.length < 80).map((x) => { const r = x.getBoundingClientRect(); return [x.innerText.replace(/\s+/g, ' ').trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width)]; }); return b; });
  q.arrows = await p.locator('main .q-tabs__arrow, main [class*=arrow--right], main i:text-is("chevron_right")').count(); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'SBC-900.png' });
  await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3500); await settle(); q.ars = await p.evaluate(() => [...document.querySelectorAll('main button')].filter((x) => /:/.test(x.innerText) && x.innerText.length < 80).map((x) => { const r = x.getBoundingClientRect(); return [x.innerText.replace(/\s+/g, ' ').trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width)]; }));
  await p.screenshot({ path: OUT + 'ARS-900.png' }); await p.setViewportSize({ width: 1440, height: 900 }); fs.writeFileSync(OUT + 'SBC900.json', JSON.stringify(q, null, 1)); console.log('C715529 sbc', JSON.stringify(q).slice(0, 500)); } catch (e) { console.log('C715529 sbc Error', String(e).slice(0, 200)); }
fs.writeFileSync(OUT + 'C715517.json', JSON.stringify(o, null, 1)); console.log('C715517', o.arsErr || o.sbcErr || 'ok', JSON.stringify(o).slice(0, 900)); await s.close?.(); process.exit(0);
