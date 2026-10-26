/** sv11728-preview-1026.mts — 26 Oct 2026, QA branch sv11728 (SV-11728, Branko: "Drag and Drop preview card doesn't match the design").
 *  The design (pictures on the ticket): dragging a Board View CARD shows a full copy of the card under the pointer (number, status, customer,
 *  unit/asset, hours/date, progress, avatars, total) with the source card faded and a blue line where it would land; dragging a Tech View ROW
 *  shows a full copy of the row; dragging a Board View COLUMN header shows a copy of the header (grip, avatar, name, pin, count) with a blue
 *  vertical line. Also C665914 (long customer name stays inside the preview). Seeds: technician "ZZAUTOTEST C665914 Ana", her long-name
 *  work order (as c665914-sv11503-1026.mts) and a second technician column to drag. Reads, while held: the ghost element (box, text, lines),
 *  the source element's box and opacity, any blue drop line; pictures 2x EV/SV11728-*.png. Escape cancels each drag. Read-only on the data. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, findRow, expandSmallGroups } from './wob.mts'; import { person, roleIds } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const o: any = { at: new Date().toISOString() };
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || null`);
const TR = (await roleIds(a))['Technician'];
const ANA = (await person(a, 'ZZAUTOTEST C665914', 'Ana', { role: TR, email: 'zz.c665914.ana@staging.shopview.local', clockable: true })).row;
const BEN = (await person(a, 'ZZAUTOTEST C665914', 'Ben', { role: TR, email: 'zz.c665914.ben@staging.shopview.local', clockable: true })).row;
const CUST = 'ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview';
let ws = await workOrders(a, CUST);
if (!ws.length) { const c = await customer(a, CUST, 'ZZ-665914'); await workOrder(a, c, 'approved', ANA.staff_id); ws = await workOrders(a, CUST); }
const w = ws[0]; o.wo = { id: w.id, number: w.number, lead: `${w.techAssignedFirstName ?? ''} ${w.techAssignedLastName ?? ''}`.trim() };
const PREF = '/api/users/me/preferences/work-orders-list'; const pv = (await a.get(PREF)).body?.data?.value ?? {};
o.pin = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } })).status;
await p.setViewportSize({ width: 1440, height: 900 }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await tab(p, 'All'); await display(p, 'Board View'); await search(p, 'C665914'); await p.waitForTimeout(3500);
const READ = (src: string) => `(() => { const src = document.querySelector('${src}'); const sr = src ? src.getBoundingClientRect() : null;
  const ghosts = [...document.querySelectorAll('[class*="drag-ghost"]:not([class*="__"]), [class*="ghost"]:not([class*="__"]), .sortable-drag, .sortable-fallback, [class*="drag-preview"], [class*="dragging"]')].filter(e => e !== src && e.getBoundingClientRect().width > 20);
  const g = ghosts.find(e => getComputedStyle(e).position === 'absolute' || getComputedStyle(e).position === 'fixed') || ghosts[0];
  const gr = g ? g.getBoundingClientRect() : null;
  const lines = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); const bg = cs.backgroundColor; return ((r.height <= 4 && r.width > 40) || (r.width <= 4 && r.height > 40)) && /rgb\\((2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]), ?(9[0-9]|1[0-4][0-9]), ?(2[0-5][0-9])\\)/.test(bg) && cs.visibility !== 'hidden'; }).map(e => { const r = e.getBoundingClientRect(); return { cls: (e.getAttribute('class') || '').slice(0, 50), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], bg: getComputedStyle(e).backgroundColor }; }).slice(0, 4);
  return { ghost: g ? { cls: (g.getAttribute('class') || '').slice(0, 90), pos: getComputedStyle(g).position, box: [Math.round(gr.left), Math.round(gr.top), Math.round(gr.width), Math.round(gr.height)], text: g.innerText.replace(/\\s+/g, ' ').slice(0, 220), children: g.querySelectorAll('*').length, avatars: g.querySelectorAll('.q-avatar, img').length, progress: !!g.querySelector('[class*="progress"]') } : null,
    ghostCount: ghosts.length, source: src ? { box: [Math.round(sr.left), Math.round(sr.top), Math.round(sr.width), Math.round(sr.height)], opacity: getComputedStyle(src).opacity, cls: (src.getAttribute('class') || '').slice(0, 90), text: src.innerText.replace(/\\s+/g, ' ').slice(0, 220) } : null, blueLines: lines }; })()`;
async function hold(sel: string, dx: number, dy: number, name: string, grab = 0.45) {
  await p.locator(sel).first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(600);
  const b = await p.locator(sel).first().boundingBox(); if (!b) return { found: false };
  const gx = b.x + Math.min(b.width * grab, 40 + b.width * 0.1), gy = b.y + b.height / 2;
  await p.mouse.move(gx, gy); await p.mouse.down(); await p.mouse.move(gx + dx / 3, gy + dy / 3, { steps: 4 }); await p.mouse.move(gx + dx, gy + dy, { steps: 10 }); await p.waitForTimeout(900);
  const r: any = await p.evaluate(READ(sel)); r.pointer = [Math.round(gx + dx), Math.round(gy + dy)];
  await p.screenshot({ path: path.join(EV, `SV11728-${name}-held.png`) });
  await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.mouse.up(); await p.waitForTimeout(2000);
  r.after = await p.evaluate(`(() => { const e = document.querySelector('${sel}'); return e ? { opacity: getComputedStyle(e).opacity } : null; })()`);
  return r;
}
o.card = await hold(`[data-test-id="board_card_${w.id}"]`, 330, 40, 'board-card');
o.cardColumnAfter = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${w.id}"]'); const col = c && c.closest('[data-test-id^="board_column_"]'); return col ? col.getAttribute('data-test-id') : null; })()`);
// column header drag (Ben's column, by its grip)
const benHead = `[data-test-id="board_column_header_${BEN.staff_id}"]`;
o.columnGrip = await p.evaluate(`(() => { const h = document.querySelector('${benHead}'); if (!h) return null; const g = [...h.querySelectorAll('*')].find(e => /grip|drag/i.test((e.getAttribute('class') || '') + (e.getAttribute('data-test-id') || '') + (e.getAttribute('aria-label') || ''))); return g ? (g.getAttribute('data-test-id') || g.getAttribute('class')).slice(0, 60) : 'none'; })()`);
o.column = await hold(benHead, -380, 0, 'board-column', 0.02);
await display(p, 'Tech View'); await p.waitForTimeout(3500); await expandSmallGroups(p).catch(() => {});
o.techGroup = await findRow(p, w.id).catch((e: any) => String(e).slice(0, 80));
o.row = await hold(`[data-test-id="tech_view_row_${w.id}"]`, 6, 70, 'tech-row', 0.3);
o.leadAfter = (await workOrders(a, CUST)).map((x: any) => `${x.techAssignedFirstName ?? ''} ${x.techAssignedLastName ?? ''}`.trim());
await a.put(PREF, { value: { ...((await a.get(PREF)).body?.data?.value ?? {}), pinnedTechnicianIds: pv.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(path.join(EV, 'sv11728-preview-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'SV11728', JSON.stringify(o).slice(0, 3500));
await done(browser, 0);
