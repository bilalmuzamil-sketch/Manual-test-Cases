/**
 * C96963-tech-reorder.mts — 17 Oct 2026, ROUND 5: ONLY the check still open in C96963 step 11 — in TECH VIEW, "{Work-order-4} (Invoiced)
 * cannot be moved out of Unassigned, but it can be reordered inside it" (Board View's half was read in round 3 by
 * C96963-unassigned-reorder.mts). Rule 107: the state is built, then the screen is used.
 * Data: customer search "ZZAUTOTEST F1 Invoiced Paid Locked 84534"; W4 = S2-37066 (Invoiced, no lead) and a second row for Unassigned,
 * S2-37063 (W1, Approved) — its lead is cleared with the app's own save if it is not already in Unassigned (read back).
 * Tech View, the case's search; the Unassigned group opened; the rows of the Unassigned group read (groups()). The drag takes W4's own
 * six-dot grip cell (the row's first cell) and asks for a NEW place inside the group: above the top row's top edge if W4 is not on top,
 * else below the last row's bottom edge — and document.elementFromPoint at the drop point must be a row of the Unassigned group
 * (data-group-key / the group the row sits under) before the press; it is read again while held. Readings: order on screen before,
 * holding, after, after a reload; the server's leads; pictures before / holding / after / after-reload; messages. START STATE found / set.
 * Output EV/C96963-tech-reorder.json.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { EV, t, display, tab, search, toasts, groups } from './wob.mts';
import { startState } from './fixup-1017.mts';

const Q = 'ZZAUTOTEST F1 Invoiced Paid Locked 84534', W4N = 'S2-37066', OTHERN = 'S2-37063';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C96963-tech-${n}.png`) }).catch(() => {});
const lead = (w: any) => w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none';
const unOrder = async () => (await groups(p)).find((g) => g.id === 'unassigned')?.rows ?? null;
/** what is under a point: the row, its group key and the group header it sits under */
const under = (x: number, y: number) => p.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); const tr = e && e.closest('tr'); if (!tr) return { what: e ? e.tagName : 'nothing' };
  let g = tr; while (g && !/^tech_view_group_/.test(g.getAttribute('data-test-id') || '')) g = g.previousElementSibling;
  return { row: (tr.getAttribute('data-test-id') || tr.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), number: (tr.innerText.match(/S\\d+-\\d+/) || [null])[0], groupKey: tr.getAttribute('data-group-key'), underGroup: g ? g.getAttribute('data-test-id').replace('tech_view_group_', '').slice(0, 12) : null, isGroupHeader: /^tech_view_group_/.test(tr.getAttribute('data-test-id') || '') }; })()`).catch(() => null) as Promise<any>;
const tech = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await search(p, Q); await W(2500);
  if (await p.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="true"]').count()) { await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click().catch(() => {}); await W(1500); o.unassignedOpenedByScript = true; }
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) { s.scrollTop = 0; s.scrollLeft = 0; } })()`).catch(() => {}); await W(800); };
try {
  await startState(p, a, 'C96963-tech');
  let ws = await workOrders(a, Q); const w4 = ws.find((x: any) => x.number === W4N), wo = ws.find((x: any) => x.number === OTHERN);
  o.found = ws.map((x: any) => `${x.number} ${x.status} lead=${lead(x)}`);
  console.log(t(), 'START STATE found C96963 Tech View Unassigned reorder', JSON.stringify(o.found));
  if (!w4 || !wo) throw new Error(`work orders not found by "${Q}": ${JSON.stringify(o.found)}`);
  if (wo.techAssignedFirstName) o.otherToUnassigned = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo.id, tech_assigned_id: null })).status;
  ws = await workOrders(a, Q); o.set = ws.map((x: any) => `${x.number} ${x.status} lead=${lead(x)}`);
  await tech(); o.before = await unOrder(); o.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null); await shot('before');
  console.log(t(), 'START STATE set C96963 Tech View Unassigned reorder', JSON.stringify({ server: o.set, unassignedOnScreen: o.before, search: o.searchHolds }));
  if (!o.before || !o.before.includes(W4N) || o.before.length < 2) throw new Error(`Tech View's Unassigned group does not hold ${W4N} and another row: ${JSON.stringify(o.before)}`);
  const row = (id: string) => p.locator(`[data-test-id="tech_view_row_${id}"]`).first();
  await row(w4.id).scrollIntoViewIfNeeded().catch(() => {}); await W(600);
  const atTop = o.before[0] === W4N; const refN = atTop ? o.before[o.before.length - 1] : o.before[0]; const ref = ws.find((x: any) => x.number === refN);
  await row(ref?.id).scrollIntoViewIfNeeded().catch(() => {}); await W(400);
  const grip = p.locator(`[data-test-id="tech_view_row_${w4.id}"] td.grip, [data-test-id="tech_view_row_${w4.id}"] td`).first();
  const gb = await grip.boundingBox(), fb = await row(w4.id).boundingBox(), tb = await row(ref?.id).boundingBox();
  o.plan = { w4WasOnTop: atTop, droppedRelativeTo: refN, where: atTop ? 'below its bottom edge' : 'above its top edge', grip: gb ? 'the row\'s first (grip) cell' : 'grip cell not found' };
  if (!gb || !fb || !tb) throw new Error(`boxes missing: grip ${!!gb}, ${W4N} ${!!fb}, ${refN} ${!!tb}`);
  const x = tb.x + Math.min(400, tb.width / 3); const ty = atTop ? tb.y + tb.height - 6 : tb.y + 5;
  o.dropAt = { x: Math.round(x), y: Math.round(ty), refTop: Math.round(tb.y), refBottom: Math.round(tb.y + tb.height) }; o.underBeforePress = await under(x, ty);
  o.dropInsideUnassigned = !!o.underBeforePress && !o.underBeforePress.isGroupHeader && (o.underBeforePress.groupKey === 'unassigned' || o.underBeforePress.underGroup === 'unassigned' || o.underBeforePress.number === refN);
  if (!o.dropInsideUnassigned) throw new Error(`the drop point is not inside the Unassigned group: ${JSON.stringify(o.underBeforePress)} — drag NOT made`);
  const gx = gb.x + gb.width / 2, gy = gb.y + gb.height / 2;
  await p.mouse.move(gx, gy); await p.mouse.down(); await p.mouse.move(gx + 4, gy + 8, { steps: 4 });
  await p.mouse.move(x, ty, { steps: 22 }); await W(700);
  o.holding = { order: await unOrder(), underWhileHeld: await under(x, ty), marks: await p.evaluate(`[...document.querySelectorAll('[class*="ghost"], [class*="placeholder"], [class*="chosen"], [class*="dragging"], [class*="drop"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => String(e.className).slice(0, 50)).slice(0, 6)`).catch(() => []) }; await shot('holding');
  await p.mouse.up(); await W(3000); o.messages = await toasts(p); o.after = await unOrder(); await shot('after');
  await tech(); o.afterReload = await unOrder(); await shot('after-reload');
  const srv = await workOrders(a, Q); o.server = { w4: `${W4N} ${srv.find((x: any) => x.number === W4N)?.status} lead=${lead(srv.find((x: any) => x.number === W4N))}`, unassigned: srv.filter((x: any) => !x.techAssignedFirstName).map((x: any) => x.number) };
  o.reordered = JSON.stringify(o.before) !== JSON.stringify(o.afterReload); o.stillInUnassigned = (o.afterReload ?? []).includes(W4N);
  console.log(t(), 'C96963 Tech View Unassigned reorder', JSON.stringify({ before: o.before, holding: o.holding?.order, after: o.after, afterReload: o.afterReload, reordered: o.reordered, under: [o.underBeforePress, o.holding?.underWhileHeld], messages: o.messages }));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'C96963-tech-reorder.json'), JSON.stringify({ C96963: o }, null, 1)); console.log(t(), 'C96963', JSON.stringify(o).slice(0, 3000)); await done(browser);
