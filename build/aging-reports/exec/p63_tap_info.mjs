// p63_tap_info.mjs — 11 Nov 2026: C715449 instrument (Rule 104). In a touch context (hasTouch) a tap on A/R Collection's info icon showed no
// tooltip after 1 s (the icon turned blue). PRD S8-R1: "Hovering, keyboard focus or a tap shows the report's description in a tooltip" and the
// icon is "the native report info icon (the one Work In Progress and Technician Utilization use)". Control: the same taps on Work In Progress.
// Per page: (a) locator.tap, poll 3 s; (b) touchscreen.tap at the icon's centre, poll 3 s; (c) long press (touchstart, 800 ms, touchend), poll 3 s;
// (d) tap an empty part of the page - tooltip gone? Pictures after each. Output p63/out.json.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p63/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const A = new URL(p.url()).origin; const st = await p.context().storageState(); const c2 = await p.context().browser().newContext({ hasTouch: true, isMobile: false, viewport: { width: 1440, height: 900 }, storageState: st, ignoreHTTPSErrors: true }); const q = await c2.newPage();
const tips = async () => (await q.locator('.q-tooltip').allInnerTexts().catch(() => [])).join('|').replace(/\s+/g, ' ');
const poll = async () => { for (let i = 0; i < 15; i++) { const t = await tips(); if (t) return t; await q.waitForTimeout(200); } return ''; };
for (const [k, path] of [['wip', '/reports/work-in-progress'], ['arc', REPORTS.arc]]) { const r = (o[k] = {});
  try { await q.goto(A + path, { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(5000); const ic = q.locator('main').getByText('info_outline', { exact: true }).first(); r.icon = await ic.count(); if (!r.icon) { r.err = 'no info icon'; continue; }
    await ic.tap(); r.a = await poll(); await q.screenshot({ path: OUT + k + '-a-tap.png' }); await q.mouse.click(5, 880).catch(() => {}); await q.touchscreen.tap(700, 860); await q.waitForTimeout(1000);
    const b = await ic.boundingBox(); await q.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); r.b = await poll(); await q.screenshot({ path: OUT + k + '-b-touchscreen.png' }); await q.touchscreen.tap(700, 860); await q.waitForTimeout(1000);
    await ic.dispatchEvent('touchstart'); await q.waitForTimeout(800); await ic.dispatchEvent('touchend'); r.c = await poll(); await q.screenshot({ path: OUT + k + '-c-longpress.png' });
    await q.touchscreen.tap(700, 860); await q.waitForTimeout(1500); r.d = await tips(); await q.screenshot({ path: OUT + k + '-d-away.png' });
  } catch (e) { r.err = String(e).slice(0, 200); }
  console.log('p63', k, JSON.stringify(r)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await c2.close(); await s.close(); process.exit(0);
