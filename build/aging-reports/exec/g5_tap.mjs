// g5_tap.mjs — 12 Nov 2026 07:40 UTC: C715449 under the QA lead's decision (pass if the tap behaves as on Work In Progress, the native icon S8-R1
// names). Touch-screen browser (hasTouch, 1440 px): tap the info icon right of the title on A/R Aging Collection and on Work In Progress; read
// whether a tooltip is on screen at 0.3 s, 1 s, 2 s, 4 s after the tap (picture each), then tap an empty area and read again.
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./g5/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const st = await s.page.context().storageState();
const ctx = await s.page.context().browser().newContext({ hasTouch: true, viewport: { width: 1440, height: 900 }, storageState: st, ignoreHTTPSErrors: true }); const p = await ctx.newPage(); const o = {};
const base = new URL(s.page.url()).origin; const tip = async () => (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
for (const [k, path] of [['arc', '/reports/ar-aging-collection'], ['wip', '/reports/work-in-progress']]) { const q = (o[k] = { reads: [] });
  try { await p.goto(base + path, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); const ic = p.locator('main').getByText('info_outline', { exact: true }).first(); q.icon = await ic.count(); const b = await ic.boundingBox(); q.box = b;
    await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); let last = 0; for (const ms of [300, 1000, 2000, 4000]) { await p.waitForTimeout(ms - last); last = ms; const t = await tip(); q.reads.push([ms, t]); await p.screenshot({ path: `${OUT}${k}-tap-${ms}ms.png` }); }
    await p.touchscreen.tap(900, 700); await p.waitForTimeout(1200); q.afterAway = await tip(); await p.screenshot({ path: `${OUT}${k}-away.png` });
  } catch (e) { q.err = String(e).slice(0, 200); } console.log('g5', k, JSON.stringify(q)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await ctx.close(); await s.close(); process.exit(0);
