/**
 * C96963-unassigned-reorder.mts — 17 Oct 2026, round 3: ONLY the check still open in C96963 — "{Work-order-4} (Invoiced) cannot be
 * moved out of Unassigned, but it can be reordered inside it" (step 7, second half). Rule 107: the state is built, then the screen is used.
 * Data (from the 17 Oct fix-up run): customer search "ZZAUTOTEST F1 Invoiced Paid Locked 84534"; W4 = S2-37066 (Invoiced, no lead) and a
 * second card for Unassigned, S2-37063 (W1, Approved) — its lead is cleared with the app's own save if it is not already in Unassigned.
 * The drop asks for a NEW place (L0417: the old drop asked for the place W4 already had): if W4 is not on top it is dropped above the top
 * card's top edge; if it is already on top, below the last card's bottom edge. Same press / small move / move / drop as the working
 * in-column reorder in s4-batchG. Readings: order on screen before, while holding, after, after a reload; the server's list order; pictures
 * before / holding / after / after-reload; any message. START STATE found / set logged. Output EV/C96963-unassigned-reorder.json.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { EV, t, display, tab, search, toasts } from './wob.mts';
import { startState } from './fixup-1017.mts';

const Q = 'ZZAUTOTEST F1 Invoiced Paid Locked 84534', W4N = 'S2-37066', OTHERN = 'S2-37063';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C96963-unassigned-${n}.png`) }).catch(() => {});
const lead = (w: any) => w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none';
const unOrder = () => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_unassigned"]'); return c ? [...c.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : null; })()`).catch(() => null) as Promise<string[] | null>;
const board = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await search(p, Q); await W(2500);
  await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = 0; })()`).catch(() => {}); await W(800); };
try {
  await startState(p, a, 'C96963-unassigned');
  let ws = await workOrders(a, Q); const w4 = ws.find((x: any) => x.number === W4N), wo = ws.find((x: any) => x.number === OTHERN);
  o.found = ws.map((x: any) => `${x.number} ${x.status} lead=${lead(x)}`);
  console.log(t(), 'START STATE found C96963 Unassigned reorder', JSON.stringify(o.found));
  if (!w4 || !wo) throw new Error(`work orders not found by "${Q}": ${JSON.stringify(o.found)}`);
  if (wo.techAssignedFirstName) o.otherToUnassigned = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo.id, tech_assigned_id: null })).status;
  ws = await workOrders(a, Q); o.set = ws.map((x: any) => `${x.number} ${x.status} lead=${lead(x)}`);
  await board(); o.before = await unOrder(); await shot('before');
  console.log(t(), 'START STATE set C96963 Unassigned reorder', JSON.stringify({ server: o.set, unassignedOnScreen: o.before }));
  if (!o.before || !o.before.includes(W4N) || o.before.length < 2) throw new Error(`Unassigned does not hold ${W4N} and another card: ${JSON.stringify(o.before)}`);
  const card = p.locator(`[data-test-id="board_card_${w4.id}"]`).first(); await card.scrollIntoViewIfNeeded().catch(() => {}); await W(600);
  const atTop = o.before[0] === W4N; const refN = atTop ? o.before[o.before.length - 1] : o.before[0];
  const ref = ws.find((x: any) => x.number === refN); const rl = p.locator(`[data-test-id="board_card_${ref?.id}"]`).first(); await rl.scrollIntoViewIfNeeded().catch(() => {}); await W(400);
  const fb = await card.boundingBox(), tb = await rl.boundingBox();
  o.plan = { w4WasOnTop: atTop, droppedRelativeTo: refN, where: atTop ? 'below its bottom edge' : 'above its top edge' };
  if (!fb || !tb) throw new Error(`card boxes missing: ${W4N} ${!!fb}, ${refN} ${!!tb}`);
  const gx = fb.x + fb.width * 0.45, ty = atTop ? tb.y + tb.height - 6 : tb.y + 4; o.dropAt = { x: Math.round(tb.x + tb.width / 2), y: Math.round(ty), refTop: Math.round(tb.y), refBottom: Math.round(tb.y + tb.height) };
  await p.mouse.move(gx, fb.y + fb.height / 2); await p.mouse.down(); await p.mouse.move(gx, fb.y + fb.height / 2 + 8, { steps: 4 });
  await p.mouse.move(tb.x + tb.width / 2, ty, { steps: 20 }); await W(500);
  o.holding = { order: await unOrder(), marks: await p.evaluate(`[...document.querySelectorAll('[class*="ghost"], [class*="placeholder"], [class*="chosen"], [class*="dragging"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => String(e.className).slice(0, 50)).slice(0, 6)`).catch(() => []) }; await shot('holding');
  await p.mouse.up(); await W(3000); o.messages = await toasts(p); o.after = await unOrder(); await shot('after');
  await board(); o.afterReload = await unOrder(); await shot('after-reload');
  const srv = await workOrders(a, Q); o.server = { unassignedListOrder: srv.filter((x: any) => !x.techAssignedFirstName).map((x: any) => x.number), w4: `${W4N} ${srv.find((x: any) => x.number === W4N)?.status} lead=${lead(srv.find((x: any) => x.number === W4N))}`,
    orderFields: Object.fromEntries(srv.filter((x: any) => [W4N, refN].includes(x.number)).map((x: any) => [x.number, Object.fromEntries(Object.entries(x).filter(([k]) => /order|position|sort|rank|index/i.test(k)))])) };
  o.reordered = JSON.stringify(o.before) !== JSON.stringify(o.afterReload); o.stillInUnassigned = (o.afterReload ?? []).includes(W4N);
  console.log(t(), 'C96963 Unassigned reorder', JSON.stringify({ before: o.before, after: o.after, afterReload: o.afterReload, reordered: o.reordered, messages: o.messages }));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'C96963-unassigned-reorder.json'), JSON.stringify({ C96963: o }, null, 1)); console.log(t(), 'C96963', JSON.stringify(o).slice(0, 3000)); await done(browser);
