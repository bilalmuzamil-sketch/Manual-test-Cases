// p63b_tap_frames.mjs — 11 Nov 2026: C715449 re-check (its Passed was withdrawn: p63 found the tooltip's words in the page after a tap, but no
// picture showed it). In a touch context (hasTouch), tap A/R Collection's info icon and, every 100 ms for 4 s, record whether a .q-tooltip is
// VISIBLE (box, opacity, visibility) with pictures at ~0.2, 0.5, 1, 2, 3 s; then tap away. Control 1: the same on Work In Progress's title icon.
// Control 2: mouse hover on the A/R Collection icon in the normal (desktop) context. Output p63b/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p63b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const A = new URL(p.url()).origin; const st = await p.context().storageState(); const c2 = await p.context().browser().newContext({ hasTouch: true, isMobile: false, viewport: { width: 1440, height: 900 }, storageState: st, ignoreHTTPSErrors: true }); const q = await c2.newPage();
const vis = (pg) => pg.evaluate(() => [...document.querySelectorAll('.q-tooltip')].map((t) => { const b = t.getBoundingClientRect(); const c = getComputedStyle(t); return { t: t.innerText.replace(/\s+/g, ' ').slice(0, 60), w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y), op: c.opacity, vis: c.visibility, disp: c.display }; }));
async function frames(pg, tag, r) { r.frames = []; const shots = new Set([2, 5, 10, 20, 30]); for (let i = 0; i < 40; i++) { r.frames.push([i * 100, await vis(pg)]); if (shots.has(i)) await pg.screenshot({ path: `${OUT}${tag}-${i * 100}ms.png` }); await pg.waitForTimeout(100); }
  r.visibleFrames = r.frames.filter(([, v]) => v.some((x) => x.w > 20 && x.h > 10 && Number(x.op) > 0.5 && x.vis !== 'hidden' && x.disp !== 'none')).map(([t]) => t); }
const titleIcon = (pg) => pg.locator('main').locator('h1, .text-h5, .text-h6, div').filter({ hasText: /^(A\/R Aging Collection|Work In Progress)\s*info_outline$/ }).last().getByText('info_outline', { exact: true }).first();
for (const [k, path] of [['arc', REPORTS.arc], ['wip', '/reports/work-in-progress']]) { const r = (o[k] = {});
  try { await q.goto(A + path, { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(5000); let ic = titleIcon(q); if (!(await ic.count())) ic = q.locator('main').getByText('info_outline', { exact: true }).first(); r.icon = await ic.count(); r.iconBox = await ic.boundingBox();
    await ic.tap(); await frames(q, k + '-tap', r); await q.touchscreen.tap(700, 860); await q.waitForTimeout(1200); r.away = await vis(q); await q.screenshot({ path: OUT + k + '-away.png' });
  } catch (e) { r.err = String(e).slice(0, 200); } console.log('p63b', k, JSON.stringify({ icon: r.icon, box: r.iconBox, visible: r.visibleFrames, away: r.away, err: r.err })); }
try { const r = (o.arcHover = {}); await s.go(REPORTS.arc); await p.waitForTimeout(4000); const ic = titleIcon(p); await ic.hover(); await frames(p, 'arc-hover', r); console.log('p63b hover', JSON.stringify({ visible: r.visibleFrames.length })); } catch (e) { o.hoverErr = String(e).slice(0, 200); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await c2.close(); await s.close(); process.exit(0);
