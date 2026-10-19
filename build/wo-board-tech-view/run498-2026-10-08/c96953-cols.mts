/** c96953-cols.mts — 19 Oct 2026, C96953 "Each Board column scrolls on its own and technicians are never hidden", following the case's 10
 *  steps WITH THE MOUSE (replaces s3-batchA's C96953 part, which set scrollTop from code and whose Esther reading never moved — not proof,
 *  skill 19 §9.7). Data (Rule 107, reused when present): customer "ZZAUTOTEST F2 Column Scroll" with 25 Approved work orders with no
 *  lead, 20 led by Esther Howard, 1 each led by two other technicians. Readings each step: the Unassigned / Esther column bodies'
 *  scrollTop, every column header's top, the first card top in the neighbouring column, the page's own scroll. Step 9: wheel sideways to the
 *  far right and back, collecting every column name on the way; step 10 compares the count with the eligible technicians (API candidates).
 *  Output EV/c96953-cols.json; pictures EV/C96953-c-*.png. Records only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, boardCols, toColumn, allBoardCols } from './wob.mts';

const { browser, page: p } = await open('/workorders?tab=all');
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C96953-c-${n}.png`) }).catch(() => {});
const o: any = {};
const techs = await candidates(a); const ES = techs.find((x) => x.name === 'Esther Howard'); const others = techs.filter((x) => !/Esther Howard|Admin ShopView|^ZZ/.test(x.name)).slice(0, 2);
if (!ES) throw new Error('Esther Howard is not an eligible technician here');
const n = 'ZZAUTOTEST F2 Column Scroll';
// data: count what exists by lead, add what is missing
let have = await workOrders(a, n); const leadOf = (w: any) => JSON.stringify(w).includes(ES.id) ? 'E' : (w.lead_technician_id || w.tech_assigned_id || w.lead_technician?.id ? 'O' : 'U');
const cnt = () => ({ U: have.filter((w: any) => leadOf(w) === 'U' && /approved/i.test(w.status)).length, E: have.filter((w: any) => leadOf(w) === 'E').length });
o.dataFound = { total: have.length, ...cnt() };
if (cnt().U < 25 || cnt().E < 20) {
  const c = await customer(a, n, 'ZZF3CS');
  for (let i = cnt().U; i < 25; i++) await workOrder(a, c, 'approved', null);
  for (let i = cnt().E; i < 20; i++) await workOrder(a, c, 'approved', ES.id);
  if (have.length < 45) for (const x of others) await workOrder(a, c, 'approved', x.id);
  have = await workOrders(a, n);
}
o.data = { total: have.length, ...cnt() };

const READ = (esId: string) => `(() => { const body = (id) => { const c = document.querySelector('[data-test-id="board_column_' + id + '"]'); if (!c) return null; const b = c.querySelector('.board-column__body') || [...c.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); return b ? { top: Math.round(b.scrollTop), scrollable: b.scrollHeight > b.clientHeight + 5, h: b.clientHeight } : null; };
  const heads = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => Math.round(e.getBoundingClientRect().top));
  const cols = [...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(e => /^board_column_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().left >= 0);
  const neighbour = cols[1] ? cols[1].querySelector('[data-test-id^="board_card_"]') : null;
  const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller');
  return { unassigned: body('unassigned'), esther: body('${esId}'), headerTops: [...new Set(heads)], neighbourFirstCardTop: neighbour ? Math.round(neighbour.getBoundingClientRect().top) : null,
    page: Math.round(document.scrollingElement.scrollTop), boardTop: h ? Math.round(h.scrollTop) : null, boardLeft: h ? Math.round(h.scrollLeft) : null }; })()`;
const read = () => p.evaluate(READ(ES.id)) as Promise<any>;

// steps 1-4
await p.goto(p.url().split('/workorders')[0] + '/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000);
await tab(p, 'All'); await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await W(1000);
await search(p, n); await W(2500); await display(p, 'Board View'); await W(2500);
await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await W(800);
o.s4 = await read(); o.s4cols = (await boardCols(p)).slice(0, 4).map((c: any) => `${c.name}:${c.count ?? ''}`); await shot('s4-board');
// steps 5-6: wheel inside Unassigned
const ub = await p.locator('[data-test-id="board_column_unassigned"]').boundingBox();
if (ub) { await p.mouse.move(ub.x + ub.width / 2, ub.y + Math.min(ub.height, 700) / 2); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 400); await W(400); } await W(1000); }
o.s5 = await read(); await shot('s5-unassigned-scrolled');
// step 7: wheel over the empty area below a short column (the second column)
const sb = await p.evaluate(`(() => { const cols = [...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(e => /^board_column_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')) && e.getBoundingClientRect().left > 300); const c = cols[0]; if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: Math.min(innerHeight - 40, r.bottom + 120), colBottom: Math.round(r.bottom) }; })()`) as any;
o.s7where = sb; if (sb) { await p.mouse.move(sb.x, sb.y); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 500); await W(300); } await W(1000); }
o.s7 = await read(); await shot('s7-wheel-below-short-column');
// step 8: Esther Howard's column
o.s8found = await toColumn(p, ES.id); await W(800); o.s8before = await read();
const eb = await p.locator(`[data-test-id="board_column_${ES.id}"]`).boundingBox();
if (eb) { await p.mouse.move(eb.x + eb.width / 2, eb.y + Math.min(eb.height, 700) / 2); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 400); await W(400); } await W(1000); }
o.s8 = await read(); await shot('s8-esther-scrolled');
// step 9-10: sideways to the far right and back, collecting every column
await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await W(600);
const seen = new Set<string>(); let steps = 0;
await p.mouse.move(800, 160);
for (; steps < 400; steps++) { for (const c of await boardCols(p)) seen.add(`${c.id}|${c.name}`); const b = (await read()).boardLeft; await p.mouse.wheel(1200, 0); await W(350); if ((await read()).boardLeft === b) { await W(800); if ((await read()).boardLeft === b) break; } }
for (const c of await boardCols(p)) seen.add(`${c.id}|${c.name}`);
o.s9wheelStopped = await read();
// 19 Oct 2026 (first run): the wheel stopped at 45,600 px of ~89,000 and only 158 of 284 columns were seen — the instrument, not the
// product. If the wheel stalls, keep going by moving the board's own scroll position (what dragging its scroll bar does), and count
// every column with allBoardCols (steps of 900 px, the proven reader).
o.s9fallbackSteps = 0;
for (let i = 0; i < 300; i++) { const r = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); return { left: Math.round(h.scrollLeft), max: h.scrollWidth - h.clientWidth }; })()`) as any;
  if (r.left >= r.max - 2) break; await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); h.scrollLeft += 900; })()`); await W(250); o.s9fallbackSteps++; for (const c of await boardCols(p)) seen.add(`${c.id}|${c.name}`); }
o.s9right = { ...(await read()), max: await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); return h.scrollWidth - h.clientWidth; })()`) }; await shot('s9-far-right');
o.lastColumns = (await boardCols(p)).slice(-3).map((c: any) => c.name);
for (let i = 0; i < 400 && (await read()).boardLeft > 0; i++) { await p.mouse.wheel(-3000, 0); await W(150); }
o.s9left = await read();
for (const c of await allBoardCols(p)) seen.add(`${c.id}|${c.name}`);
const names = [...seen].map((x) => x.split('|')); const techCols = names.filter(([id]) => id !== 'unassigned');
o.s10 = { technicianColumns: techCols.length, eligible: techs.length, missing: techs.filter((x) => !techCols.some(([id]) => id === x.id)).map((x) => x.name).slice(0, 20), wheelSteps: steps };
await search(p, ''); await display(p, 'List').catch(() => {});
fs.writeFileSync(path.join(EV, 'c96953-cols.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C96953', JSON.stringify(o).slice(0, 5000));
await done(browser);
