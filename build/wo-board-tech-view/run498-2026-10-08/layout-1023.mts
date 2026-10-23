/**
 * 23 Oct 2026 — READ ONLY. Why does C96953 (each Board column scrolls on its own; the page never scrolls) pass on staging and fail
 * on production? Opens Board View at 1600 x 1000 with the C96953 customer searched and records, top to bottom, every full-width
 * band of the page (its height and words), the page height against the window, and any banner. Run the same script on both
 * environments and compare. Pictures EV/layout-1023-<host>.png; readings EV/layout-1023-<host>.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, tab, display, search } from './wob.mts';

const host = new URL(APP).host.split('.')[0] === 'app' && APP.includes('staging') ? 'staging' : 'production';
const { browser, page: p } = await open('/workorders?tab=all');
await p.setViewportSize({ width: 1600, height: 1000 });
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
await tab(p, 'All'); await display(p, 'Board View'); await search(p, 'ZZAUTOTEST F2 Column Scroll'); await p.waitForTimeout(5000);
const R: any = { host, app: APP, version: await p.evaluate(`(document.querySelector('meta[name="app-version"]') || {}).content || null`) };
R.sizes = await p.evaluate(`({ innerHeight, innerWidth, docHeight: document.documentElement.scrollHeight, bodyHeight: document.body.scrollHeight })`);
// every element that is at least 1000 px wide and visible, with its top and height: the vertical stack of the page
R.bands = await p.evaluate(`(() => { const out = []; for (const e of document.querySelectorAll('body *')) { const r = e.getBoundingClientRect();
  if (r.width < 1000 || r.height < 4 || r.height > 2000) continue; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
  out.push({ tag: e.tagName.toLowerCase(), id: e.getAttribute('data-test-id') || e.id || '', cls: String(e.className || '').slice(0, 80), top: Math.round(r.top), h: Math.round(r.height), bottom: Math.round(r.bottom),
    text: (e.innerText || '').replace(/\\s+/g, ' ').slice(0, 90) }); }
  return out.filter(x => x.top < 300).slice(0, 80); })()`);
R.boardBottom = await p.evaluate(`(() => { const b = document.querySelector('[data-test-id^="board_column_unassigned"]'); const r = b && b.getBoundingClientRect(); return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) } : null; })()`);
R.tallest = await p.evaluate(`(() => [...document.querySelectorAll('body *')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-test-id') || e.id || e.tagName.toLowerCase(), cls: String(e.className || '').slice(0, 60), bottom: Math.round(r.bottom + scrollY), h: Math.round(r.height) }; })
  .filter(x => x.bottom > innerHeight).sort((a, b) => b.bottom - a.bottom).slice(0, 12))()`);
// the controls the comment points at, in page pixels (x2 in the 2x picture)
const boxes = () => p.evaluate(`(() => { const bx = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  const byText = (sel, re) => [...document.querySelectorAll(sel)].filter(e => re.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0).sort((x, y) => x.getBoundingClientRect().width * x.getBoundingClientRect().height - y.getBoundingClientRect().width * y.getBoundingClientRect().height)[0];
  return { allTab: bx(byText('.q-tab, [role=tab]', /(^|\\s)All$/)), technician: bx(byText('button, .q-btn, .q-field', /\\bTechnician\\b/)), assigned: bx(byText('button, .q-btn', /Assigned to me/)),
    create: bx(byText('button, .q-btn', /Create Work Order/)), header: bx(document.querySelector('[data-test-id="board_column_header_unassigned"]') || document.querySelector('[data-test-id^="board_column_header_"]')),
    scrollY: Math.round(scrollY) }; })()`);
R.before = await boxes();
await p.screenshot({ path: path.join(EV, `layout-1023-${host}.png`) });
// C96953 step 7: the mouse wheel over the empty space below a short column
const short = await p.locator('[data-test-id^="board_column_empty_"]').first().boundingBox();
R.short = short; if (short) { await p.mouse.move(short.x + short.width / 2, Math.min(950, short.y + short.height + 200)); R.mouseAt = [Math.round(short.x + short.width / 2), Math.round(Math.min(950, short.y + short.height + 200))]; await p.mouse.wheel(0, 1500); await p.waitForTimeout(1200); }
R.after = await boxes();
await p.screenshot({ path: path.join(EV, `layout-1023-${host}-after-wheel.png`) });
fs.writeFileSync(path.join(EV, `layout-1023-${host}.json`), JSON.stringify(R, null, 1));
console.log(JSON.stringify({ host, sizes: R.sizes, before: R.before, after: R.after }));
await done(browser);
