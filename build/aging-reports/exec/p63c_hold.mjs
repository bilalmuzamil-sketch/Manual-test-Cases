// p63c_hold.mjs — 11 Nov 2026: C715449, last instrument check. p63b: a TAP (touch context) never shows a visible tooltip on A/R Collection
// nor on Work In Progress (control), while mouse hover shows it (38/40 frames). Here, with real touch events through the DevTools protocol:
// (a) tap = touchStart + touchEnd 80 ms apart; (b) press-and-hold = touchStart, hold 1.5 s, touchEnd - on each page, polling the tooltip's
// visibility every 100 ms during and 3 s after, with pictures. Output p63c/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p63c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const st = await p.context().storageState(); const c2 = await p.context().browser().newContext({ hasTouch: true, isMobile: true, viewport: { width: 1280, height: 900 }, storageState: st, ignoreHTTPSErrors: true }); const q = await c2.newPage(); const cdp = await c2.newCDPSession(q);
const A = new URL(p.url()).origin; const vis = () => q.evaluate(() => [...document.querySelectorAll('.q-tooltip')].filter((t) => { const b = t.getBoundingClientRect(); const c = getComputedStyle(t); return b.width > 20 && b.height > 10 && Number(c.opacity) > 0.5 && c.visibility !== 'hidden'; }).map((t) => t.innerText.replace(/\s+/g, ' ').slice(0, 60)));
const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
async function watch(tag, ms, shotsAt) { const seen = []; for (let t = 0; t < ms; t += 100) { const v = await vis(); if (v.length) seen.push([t, v[0]]); if (shotsAt.includes(t)) await q.screenshot({ path: `${OUT}${tag}-${t}ms.png` }); await q.waitForTimeout(100); } return seen; }
for (const [k, path] of [['arc', REPORTS.arc], ['wip', '/reports/work-in-progress']]) { const r = (o[k] = {});
  try { await q.goto(A + path, { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(5000); const ic = q.locator('main').getByText('info_outline', { exact: true }).first(); const b = await ic.boundingBox(); r.box = b; const x = b.x + b.width / 2, y = b.y + b.height / 2;
    await touch('touchStart', x, y); await q.waitForTimeout(80); await touch('touchEnd', x, y); r.tap = await watch(k + '-tap', 3000, [300, 1000, 2500]); await touch('touchStart', 640, 860); await touch('touchEnd', 640, 860); await q.waitForTimeout(1500);
    await touch('touchStart', x, y); r.holdDuring = await watch(k + '-hold', 1500, [500, 1400]); await touch('touchEnd', x, y); r.holdAfter = await watch(k + '-after-hold', 3000, [300, 2000]);
  } catch (e) { r.err = String(e).slice(0, 200); } console.log('p63c', k, JSON.stringify({ tap: r.tap?.length, hold: r.holdDuring?.length, after: r.holdAfter?.length, first: (r.tap || r.holdDuring || [])[0], err: r.err })); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await c2.close(); await s.close(); process.exit(0);
