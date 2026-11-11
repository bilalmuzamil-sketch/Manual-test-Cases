// p61_locations.mjs — 11 Nov 2026: read-only. C715440's set-up unticked Lethbridge and the chip read "Location: 2 locations", so the
// Location list now holds more than the two known locations. Lists /api/workplaces and each aging report's own location list today and on
// 2026-11-09, plus the open Location menu's text on A/R Detail. Output p61/out.json.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p61/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const o = {};
try { const w = await a.get('/api/workplaces'); const d = w.j?.data; o.workplaces = (Array.isArray(d) ? d : d?.collection || []).map((x) => [x.name, x.id, x.created_at || x.createdAt || null]);
  for (const slug of ['ar-aging-summary', 'ap-aging-summary']) for (const dt of ['2026-11-11', '2026-11-09']) { const r = await a.get(`/api/reporting/reports/${slug}/locations?asOfDate=${dt}`); o[slug + ' ' + dt] = (r.j?.data?.collection || []).map((x) => x.name); }
  await s.go(REPORTS.ard); await p.waitForTimeout(3000); await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); o.menu = (await p.locator('.q-menu').last().innerText()).replace(/\s+/g, ' '); await s.shot('location-menu');
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p61', JSON.stringify(o).slice(0, 1500)); await s.close(); process.exit(0);
