/** c665914-sv11503-1026.mts — 26 Oct 2026, QA branch sv11503 (fix for SV-11503: long customer name ran outside the drag preview).
 *  C665914, all 7 steps: seeds Technician-A "ZZAUTOTEST C665914 Ana" and an Approved work order led by Ana for a customer with a long
 *  unbroken name; pins Ana; Board View: press + hold on the card, move a little right, read the drag preview (the element that follows
 *  the pointer and holds the work order number): its box, the customer-name element's box, scrollWidth vs clientWidth, text-overflow, and
 *  the right edge of the name's own text (Range rects) vs the box's right edge; picture; Escape, release, read the card's column.
 *  Tech View: same on the row (move a little down), then where the row sits. Pictures EV/C665914-*.png (2x), readings EV/c665914-1026.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, findRow, expandSmallGroups } from './wob.mts'; import { person, roleIds } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const o: any = { at: new Date().toISOString() };
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || null`);
const ANA = (await person(a, 'ZZAUTOTEST C665914', 'Ana', { role: (await roleIds(a))['Technician'], email: 'zz.c665914.ana@staging.shopview.local', clockable: true })).row;
const CUST = 'ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview';
let ws = await workOrders(a, CUST);
if (!ws.length) { const c = await customer(a, CUST, 'ZZ-665914'); await workOrder(a, c, 'approved', ANA.staff_id); ws = await workOrders(a, CUST); }
const w = ws[0]; o.wo = { id: w.id, number: w.number, lead: `${w.techAssignedFirstName ?? ''} ${w.techAssignedLastName ?? ''}`.trim(), ana: ANA.staff_id };
const PREF = '/api/users/me/preferences/work-orders-list'; const pv = (await a.get(PREF)).body?.data?.value ?? {};
o.pin = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id] } })).status;
await p.setViewportSize({ width: 1440, height: 900 }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await tab(p, 'All'); await display(p, 'Board View'); await search(p, CUST); await p.waitForTimeout(3500);
// reads the element following the pointer: newest visible element (not the source) whose text holds the work order number
const READ = (src: string) => `(() => { const num = ${JSON.stringify(w.number)}; const src = document.querySelector('${src}');
  const cand = [...document.querySelectorAll('body *')].filter(e => { if (src && (src === e || src.contains(e) || e.contains(src))) return false; const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 10 && (e.innerText || '').includes(num); });
  const box = cand.filter(e => !cand.some(c => c !== e && e.contains(c) && (c.innerText||'').includes(num) && c.children.length)).pop() || cand.pop(); if (!box) return { found: false, srcStill: !!src };
  let host = box.closest('[class*="drag-ghost"]:not([class*="__"])') || box; while (host === box && host.parentElement && host.parentElement !== document.body && (host.parentElement.innerText || '').trim() === (host.innerText || '').trim()) host = host.parentElement;
  const hr = host.getBoundingClientRect(); const cs = getComputedStyle(host);
  const nameEl = [...host.querySelectorAll('*')].filter(e => (e.innerText || '').includes('Superlong') && ![...e.children].some(c => (c.innerText || '').includes('Superlong'))).pop();
  let txt = null; if (nameEl) { const rg = document.createRange(); rg.selectNodeContents(nameEl); const rs = [...rg.getClientRects()]; const nr = nameEl.getBoundingClientRect(); const ncs = getComputedStyle(nameEl);
    txt = { text: nameEl.innerText.trim().slice(0, 120), box: [Math.round(nr.left), Math.round(nr.top), Math.round(nr.width), Math.round(nr.height)], textRight: Math.round(Math.max(...rs.map(r => r.right))), lines: rs.length, scrollW: nameEl.scrollWidth, clientW: nameEl.clientWidth, overflow: ncs.overflow, textOverflow: ncs.textOverflow, whiteSpace: ncs.whiteSpace }; }
  return { found: true, tag: host.tagName, cls: (host.getAttribute('class') || '').slice(0, 80), position: cs.position, box: [Math.round(hr.left), Math.round(hr.top), Math.round(hr.width), Math.round(hr.height)], boxRight: Math.round(hr.right), overflow: cs.overflow, text: host.innerText.replace(/\\s+/g, ' ').slice(0, 140), name: txt,
    nameInside: txt ? (txt.textRight <= Math.round(hr.right) + 1 && (txt.scrollW <= txt.clientW + 1 || txt.textOverflow === 'ellipsis' || cs.overflow !== 'visible')) : null, clippedVisually: txt ? txt.textRight > hr.right + 1 && (cs.overflow !== 'visible' || ncs_ok()) : null };
  function ncs_ok() { return false; } })()`;
async function dragRead(sel: string, dx: number, dy: number, name: string) {
  await p.locator(sel).first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(600);
  const b = await p.locator(sel).first().boundingBox(); if (!b) return { found: false, reason: 'source not on screen' };
  const gx = b.x + b.width * 0.45, gy = b.y + b.height / 2;
  await p.mouse.move(gx, gy); await p.mouse.down(); await p.mouse.move(gx + dx / 3, gy + dy / 3, { steps: 4 }); await p.mouse.move(gx + dx, gy + dy, { steps: 8 }); await p.waitForTimeout(900);
  const r: any = await p.evaluate(READ(sel)); r.pointer = [Math.round(gx + dx), Math.round(gy + dy)];
  const cx = Math.max(0, Math.min((r.box?.[0] ?? gx) - 120, 1440 - 760)), cy = Math.max(0, (r.box?.[1] ?? gy) - 120);
  await p.screenshot({ path: path.join(EV, `C665914-${name}-drag.png`), clip: { x: cx, y: cy, width: 760, height: 300 } });
  await p.screenshot({ path: path.join(EV, `C665914-${name}-drag-full.png`) }); r.clip = [cx, cy];
  await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.mouse.up(); await p.waitForTimeout(2500);
  return r;
}
o.s1_2 = await dragRead(`[data-test-id="board_card_${w.id}"]`, 70, 6, 'board');
o.s3 = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${w.id}"]'); const col = c && c.closest('[data-test-id^="board_column_"]'); return { card: !!c, column: col ? col.getAttribute('data-test-id') : null, columnText: col ? col.innerText.split('\\n').slice(0, 2).join(' | ') : null }; })()`);
await display(p, 'Tech View'); await p.waitForTimeout(3500); await expandSmallGroups(p).catch(() => {});
o.s4 = { group: await findRow(p, w.id).catch((e: any) => String(e).slice(0, 80)), ana: ANA.staff_id };
o.s5_6 = await dragRead(`[data-test-id="tech_view_row_${w.id}"]`, 6, 60, 'tech');
o.s7 = { group: await p.evaluate(`(document.querySelector('[data-test-id="tech_view_row_${w.id}"]') || { getAttribute: () => null }).getAttribute('data-group-key')`) };
o.lead_after = (await workOrders(a, CUST)).map((x: any) => `${x.techAssignedFirstName ?? ''} ${x.techAssignedLastName ?? ''}`.trim());
await a.put(PREF, { value: { ...((await a.get(PREF)).body?.data?.value ?? {}), pinnedTechnicianIds: pv.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(path.join(EV, 'c665914-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C665914', JSON.stringify(o).slice(0, 3000));
await done(browser, 0);
