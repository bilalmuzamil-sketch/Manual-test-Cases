// p74_loadbar.mjs — 11 Nov 2026 ~16:40: the loading-bar half of C715499-C715504 ("the same loading bar Sales By Customer shows"). s84/s84b never
// caught Sales By Customer's table progress bar (its reply is too fast; only the page-top bar was seen). Here every /reporting/ reply is held 3 s
// (route + continue after a delay - never abort, L0646) on Sales By Customer and on each aging report, the date / as-of is changed, and the
// progress elements under the headings are sampled every 150 ms with a picture at first sight. Output p74/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./p74/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const prog = () => p.evaluate(() => [...document.querySelectorAll('main .q-linear-progress, main [role=progressbar], main .q-inner-loading, main .q-spinner')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; }).map((e) => { const b = e.getBoundingClientRect(); const c = getComputedStyle(e); return { cls: e.className.toString().slice(0, 90), box: [b.x, b.y, b.width, b.height].map(Math.round), color: c.color }; }));
await p.route((u) => /\/reporting\//.test(u.toString()), async (rt) => { await new Promise((r) => setTimeout(r, 3000)); await rt.continue().catch(() => {}); });
async function watch(tag, act) { const r = { samples: [] }; await act(); for (let i = 0; i < 26; i++) { const g = await prog(); if (g.length) { r.samples.push([i * 150, g]); if (!r.pic) { r.pic = OUT + tag + '-loading.png'; await p.screenshot({ path: r.pic }); } } await p.waitForTimeout(150); } o[tag] = r; }
try { await ensureLoc(p, 'Staging Heavy Duty - 9919');
  await s.go('/reports/sales-by-customer'); await p.waitForTimeout(6000);
  await watch('sbc', async () => { const c = p.locator('main button', { hasText: /Location:/ }).first(); await c.click(); await p.waitForTimeout(800); await p.locator('.q-menu:visible').locator('.q-item, label, .q-checkbox').nth(1).click(); await p.keyboard.press('Escape'); });
  for (const k of ['ars', 'ard', 'arc', 'aps', 'apd', 'apu']) { await s.go(REPORTS[k]); await p.waitForTimeout(6000); await watch(k, () => F.asOf(10).catch(() => {})); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p74', JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.samples ? [v.samples.length, v.samples[0]?.[1]?.map((x) => x.cls.slice(0, 40) + ' ' + x.box.join(','))] : v])))); await s.close(); process.exit(0);
