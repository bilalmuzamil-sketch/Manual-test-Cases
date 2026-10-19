/** c590114-total-pic.mts — 19 Oct 2026: picture for the C590114 Total price ticket. Tech View, search the customer seeded by design-stg5
 *  (C590114), scroll the table sideways to its right end so Total price is ON SCREEN, read the heading and amount boxes (text left edge
 *  vs cell left/right edge) and screenshot. Read-only. Output EV/c590114-total-pic.json, EV/C590114-total-sideways.png (run with QA_DPR=2). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { EV, display, tab, search } from './wob.mts';
const Q = process.env.C590114_Q || ''; // 19 Oct: no search — pinned empty groups filled the screen; Unassigned rows carry amounts
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
await p.waitForTimeout(4000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await p.waitForTimeout(2500);
if (Q) { await search(p, Q); await p.waitForTimeout(3000); }
await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) { s.scrollLeft = s.scrollWidth; } })()`); await p.waitForTimeout(1500);
const o: any = await p.evaluate(`(() => {
  const ths = [...document.querySelectorAll('thead th')]; const th = ths.find(e => /total price/i.test(e.innerText));
  const idx = th ? ths.indexOf(th) : -1; const b = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right) }; };
  const tb = (e) => { const rg = document.createRange(); rg.selectNodeContents(e); const r = rg.getBoundingClientRect(); return { x: Math.round(r.x), r: Math.round(r.right) }; };
  const cells = [...document.querySelectorAll('td.total-price')].filter(c => /\\$/.test(c.innerText) && c.getBoundingClientRect().bottom < innerHeight).slice(0, 6);
  return { vw: innerWidth, header: th ? { cell: b(th), text: tb(th), align: getComputedStyle(th).textAlign } : null,
    amounts: cells.map(c => ({ text: c.innerText.trim(), cell: b(c), textBox: tb(c), align: getComputedStyle(c).textAlign })) };
})()`);
o.onScreen = !!o.header && o.header.cell.r <= o.vw;
await p.screenshot({ path: path.join(EV, 'C590114-total-sideways.png') });
fs.writeFileSync(path.join(EV, 'c590114-total-pic.json'), JSON.stringify(o, null, 1)); console.log('C590114 total', JSON.stringify(o));
await done(browser);
