/** c590121-s2.mts — 19 Oct 2026: C590121 step 2 re-read (design-stg5's step-2 picture was "off screen"). Board View, All tab, search the
 *  work order S2-37500, mouse parked away from the board, card scrolled into view; then what is drawn at the three-dot button's spot
 *  (elementFromPoint + every ancestor's opacity/visibility) and a 2x crop of the card, and the same after hovering it (positive control).
 *  Output EV/c590121-s2.json; pictures EV/C590121-s2b-*.png. Records only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { EV, t, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const o: any = {}; const N = process.env.WO || 'S2-37500';
await tab(p, 'All'); await display(p, 'Board View'); await search(p, N); await p.waitForTimeout(3000);
const card = p.locator('[data-test-id^="board_card_"]').filter({ hasText: N }).first();
await card.scrollIntoViewIfNeeded().catch(() => {}); await p.mouse.move(5, 880); await p.waitForTimeout(1500);
const READ = `(() => { const c = [...document.querySelectorAll('[data-test-id^="board_card_"]')].find(e => e.innerText.includes(${JSON.stringify(N)})); if (!c) return null; const b = c.querySelector('[data-test-id="button_work_order_more_actions"]');
  if (!b) return { button: false }; const r = b.getBoundingClientRect(); const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); const chain = []; let e = b; while (e && e !== c.parentElement) { const s = getComputedStyle(e); chain.push({ cls: (e.getAttribute('class') || '').slice(0, 50), op: s.opacity, vis: s.visibility, disp: s.display }); e = e.parentElement; }
  return { button: true, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], atPointIsButton: !!(at && (at === b || b.contains(at))), atPoint: at ? (at.getAttribute('data-test-id') || at.tagName) : null, hiddenBy: chain.filter(x => x.op === '0' || x.vis === 'hidden' || x.disp === 'none'), cardBox: (() => { const k = c.getBoundingClientRect(); return [k.left, k.top, k.width, k.height]; })() }; })()`;
o.noHover = await p.evaluate(READ);
const cb = await card.boundingBox(); if (cb) await p.screenshot({ path: path.join(EV, 'C590121-s2b-no-hover.png'), clip: { x: Math.max(0, cb.x - 20), y: Math.max(0, cb.y - 20), width: cb.width + 40, height: cb.height + 40 } });
await p.screenshot({ path: path.join(EV, 'C590121-s2b-page.png') });
await card.hover(); await p.waitForTimeout(1200); o.hover = await p.evaluate(READ);
if (cb) await p.screenshot({ path: path.join(EV, 'C590121-s2b-hover.png'), clip: { x: Math.max(0, cb.x - 20), y: Math.max(0, cb.y - 20), width: cb.width + 40, height: cb.height + 40 } });
await search(p, ''); await display(p, 'List').catch(() => {});
fs.writeFileSync(path.join(EV, 'c590121-s2.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C590121-s2', JSON.stringify(o));
await done(browser);
