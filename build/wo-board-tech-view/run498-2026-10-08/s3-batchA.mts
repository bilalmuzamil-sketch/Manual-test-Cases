/**
 * S3 Board View, batch A (2026-10-08). Named technicians are ZZ test people made for these checks (Esther Howard,
 * Ralph Edwards, Jenny Wilson, Theresa Webb, Kristin Watson); [User-B] view-only = a person on the
 * "ZZAUTOTEST WO View Only" role, reached by switching user. Pins are per user: cleared first, put back at the end.
 */
import { ME_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { signIn } from '../../global-search/e2e/fixtures/auth.js';
import { api, candidates, seedCase, workOrders, customer, workOrder, vehicle } from './data.mts';
import { EV, t, shot, display, tab, search, groups, toggleGroup, drag, boardCols, allBoardCols, toColumn } from './wob.mts';
import { startState } from './fixup-1017.mts';
import { staffRows, person, HEAVY, LETH, roleIds } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
await startState(p, a, 's3-batchA');   // L0415, fix-up 2
const R: Record<string, any> = {};
const D = '@staging.shopview.local', ORG = (await import('./profile.mts')).ORG;
const rolesR = await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`);
const roles: any[] = rolesR.body?.data?.collection ?? rolesR.body?.data ?? [];
const rid = (l: string) => roles.find((r) => (r.label ?? r.name) === l)?.id;
for (const [f, l, e] of [['Jenny', 'Wilson', 'jenny.wilson'], ['Theresa', 'Webb', 'theresa.webb'], ['Kristin', 'Watson', 'kristin.watson']]) await person(a, f, l, { role: rid('Technician'), email: `zz.wob.${e}${D}`, clockable: true });
await person(a, 'ZZAUTOTEST', 'WOB View Only', { role: rid('ZZAUTOTEST WO View Only'), email: `zz.wob.viewonly${D}` });
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), JW = await sid('jenny.wilson'), TW = await sid('theresa.webb'), KW = await sid('kristin.watson'), VO = await sid('viewonly');
const techs = await candidates(a);
const me = techs.find((x) => x.name === ME_NAME)!;
const nameOf = (id: string) => (id === 'unassigned' ? 'Unassigned' : techs.find((x) => x.id === id)?.name ?? id);
console.log(t(), 'people', [ES, RE, JW, TW, KW, VO].map((x) => `${x?.first_name} ${x?.last_name}:${x?.is_active}`).join(', '));
const bv = async (n: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Board View'); if (n) await search(p, n); };
const mineCols = (cs: any[], ids: string[]) => cs.filter((c) => c.id === 'unassigned' || ids.includes(c.id)).map((c) => ({ name: c.name, count: c.count, cards: c.cards, pinned: c.pinned, empty: c.empty }));
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1800));
  fs.writeFileSync(path.join(EV, 's3-batchA.json'), JSON.stringify(R, null, 1));
}
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const pinsBefore: string[] = (await prefs()).pinnedTechnicianIds ?? [];
async function unpinAll() { for (const id of (await prefs()).pinnedTechnicianIds ?? []) { if (await toColumn(p, id)) { await p.locator(`[data-test-id="button_board_pin_${id}"]`).click().catch(() => {}); await p.waitForTimeout(1200); } } }
async function pin(id: string) { await toColumn(p, id); await p.locator(`[data-test-id="button_board_pin_${id}"]`).click(); await p.waitForTimeout(1500); }
const UB = 'zzautotest.wob.userb.1008@staging.shopview.local';
async function as<T>(userId: string, f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) throw new Error(`switch ${s.status} ${JSON.stringify(s.body).slice(0, 160)}`);
  await p.waitForTimeout(800); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') });
  try { return await f(); } finally { const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); await p.waitForTimeout(800); }
}

await run('C96940', async () => {
  const n = 'ZZAUTOTEST F2 Board Columns';
  await seedCase(a, n, 'ZZF3BC', [{ lead: ES.staff_id }, { lead: ES.staff_id }, { lead: ES.staff_id, status: 'estimate' }, { lead: RE.staff_id }, { lead: RE.staff_id }, { lead: null }, { lead: null }]);
  await bv(n); const all = await allBoardCols(p);
  R.C96940 = { columns: all.length, eligible: techs.length, mine: mineCols(all, [ES.staff_id, RE.staff_id, JW.staff_id]) };
  await toColumn(p, ES.staff_id); R.C96940.avatarEsther = await p.evaluate(`(document.querySelector('[data-test-id="board_column_header_${ES.staff_id}"] .q-avatar') || {}).innerText || null`); await shot(p, 'C96940-board');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800); await p.locator('[data-test-id="filter_option_status_approved"]').click(); await p.waitForTimeout(800); await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
  R.C96940.approved = mineCols(await allBoardCols(p), [ES.staff_id]);
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1500);
});

await run('C96941', async () => {
  const n = 'ZZAUTOTEST F2 Sticky Unassigned';
  await seedCase(a, n, 'ZZF3SU', [{ lead: null }, { lead: null }, { lead: ES.staff_id }]);
  await bv(n);
  const pos = () => p.evaluate(`(() => { const u = document.querySelector('[data-test-id="board_column_unassigned"]'); const h = document.querySelector('[data-test-id="board_view_scroller"]'); const first = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(e => e.getAttribute('data-test-id').replace('board_column_header_', ''))[0]; return { unassignedLeft: u ? Math.round(u.getBoundingClientRect().left) : null, scrollLeft: Math.round(h.scrollLeft), firstColumn: first }; })()`);
  R.C96941 = { start: await pos() };
  for (const x of [1200, 3000]) { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = ${x}`); await p.waitForTimeout(1000); R.C96941['at' + x] = await pos(); }
  await shot(p, 'C96941-scrolled');
});

await run('C96942', async () => {
  const n = 'ZZAUTOTEST F2 Sticky Column Header';
  await seedCase(a, n, 'ZZF3SH', Array(20).fill({ lead: ES.staff_id }));
  await bv(n); await toColumn(p, ES.staff_id);
  const st = () => p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_column_header_${ES.staff_id}"]'); const b = document.querySelector('[data-test-id="board_column_${ES.staff_id}"] .board-column__body'); const others = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].slice(0, 4).map(e => Math.round(e.getBoundingClientRect().top)); return { headerTop: Math.round(h.getBoundingClientRect().top), headerText: h.innerText.replace(/\\s+/g, ' '), bodyScroll: b ? Math.round(b.scrollTop) : null, otherHeaderTops: others }; })()`);
  R.C96942 = { start: await st() };
  for (const y of [600, 2000]) { await p.evaluate(`(() => { const b = document.querySelector('[data-test-id="board_column_${ES.staff_id}"] .board-column__body'); if (b) b.scrollTop = ${y}; })()`); await p.waitForTimeout(900); R.C96942['at' + y] = await st(); }
  await shot(p, 'C96942-scrolled');
});

await run('C96943', async () => {
  const n = 'ZZAUTOTEST F2 Card Required Fields';
  let wos = await workOrders(a, n);
  if (!wos.length) { const c = await customer(a, n, 'TRK-118'); const v2 = await vehicle(a, c, ''); await workOrder(a, c, 'approved', ES.staff_id); await workOrder(a, { ...c, vehicle_id: v2 }, 'approved', ES.staff_id); wos = await workOrders(a, n); }
  R.C96943 = { wos: wos.map((w: any) => `${w.number} unit=${w.unit}`) };
  await bv(n);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1000);
  const items = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=switch], .q-menu [role=checkbox]')].map(e => ({ label: e.getAttribute('aria-label'), on: e.getAttribute('aria-checked'), disabled: e.getAttribute('aria-disabled') }))`) as any[];
  R.C96943.picker = items; R.C96943.pickerText = (await p.evaluate(`(document.querySelector('.q-menu') || {}).innerText || ''`) as string).replace(/\s+/g, ' ').slice(0, 400);
  for (const it of items) if (it.on === 'true' && it.disabled !== 'true') { await p.locator(`.q-menu [aria-label="${it.label}"]`).first().click(); await p.waitForTimeout(500); }
  R.C96943.after = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=switch], .q-menu [role=checkbox]')].map(e => e.getAttribute('aria-label') + '=' + e.getAttribute('aria-checked'))`);
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  await toColumn(p, ES.staff_id);
  R.C96943.cards = await p.evaluate(`[...document.querySelectorAll('[data-test-id="board_column_${ES.staff_id}"] [data-test-id^="board_card_"][data-test-id$="-"], [data-test-id="board_column_${ES.staff_id}"] [data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id'))).map(c => c.innerText.replace(/\\s+/g, ' ').trim())`);
  await shot(p, 'C96943-cards');
  // put every field back on
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(800);
  for (const it of items) if (it.on === 'true' && it.disabled !== 'true') { const e = p.locator(`.q-menu [aria-label="${it.label}"]`).first(); if ((await e.getAttribute('aria-checked')) !== 'true') { await e.click(); await p.waitForTimeout(400); } }
  await p.keyboard.press('Escape');
});

await run('C96944', async () => {
  const a1 = await seedCase(a, 'ZZAUTOTEST F2 Badge Spot Commercial Transport Services', 'ZZF3BL', [{ lead: ES.staff_id }]);
  let w2 = await workOrders(a, 'ZZAUTOTEST F2 Badge Spot');
  w2 = w2.filter((w: any) => w.companyName === 'ZZAUTOTEST F2 Badge Spot');
  if (!w2.length) { const c = await customer(a, 'ZZAUTOTEST F2 Badge Spot', 'ZZF3BS'); const v2 = await vehicle(a, c, ''); await workOrder(a, c, 'estimate', ES.staff_id); await workOrder(a, { ...c, vehicle_id: v2 }, 'approved', ES.staff_id); }
  await bv('ZZAUTOTEST F2 Badge Spot'); await toColumn(p, ES.staff_id);
  const spot = () => p.evaluate(`[...document.querySelectorAll('[data-test-id="board_column_${ES.staff_id}"] [data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id'))).map(c => { const r = c.getBoundingClientRect(), b = c.querySelector('[data-test-id="board_card_status"]').getBoundingClientRect(), n = c.querySelector('[data-test-id="board_card_number"]'); return { n: n.textContent.trim(), right: Math.round(r.right - b.right), top: Math.round(b.top - r.top), nextToNumber: Math.abs(Math.round(b.top - n.getBoundingClientRect().top)) <= 6 }; })`);
  R.C96944 = { regular: await spot() };
  for (const d of ['compact', 'comfortable', 'regular']) { await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(600); await p.locator(`[data-test-id="option_density_${d}"]`).click(); await p.waitForTimeout(1500); R.C96944[d] = await spot(); if (d !== 'regular') await shot(p, `C96944-${d}`); }
  const first = p.locator(`[data-test-id="board_column_${ES.staff_id}"] [data-test-id="board_card_number"]`).first();
  await first.hover(); await p.waitForTimeout(800); R.C96944.hovered = await spot(); await shot(p, 'C96944-hover');
});

await run('C96945', async () => {
  // 16 Oct 2026: follows the case as rewritten (PRD v61 S11-R1/S11-R3: the card is reached by clicking Search, Tab until a card shows a
  // focus ring, then the arrow keys - no card.focus(); new readings: the menu closes after Escape (step 4) and the More actions button is
  // hidden again after the mouse leaves (step 5)). Every key press records document.activeElement (data-test-id + words + ring).
  // Precondition: Technician-A (Esther Howard) pinned in your Board View - pinned here if not (the pin list is read back).
  const [w] = await seedCase(a, 'ZZAUTOTEST F2 Card Menu', 'ZZF3CM', [{ lead: ES.staff_id }]);
  const o: any = (R.C96945 = {});
  if (!(((await prefs()).pinnedTechnicianIds ?? []) as string[]).includes(ES.staff_id)) { await bv(''); await pin(ES.staff_id); }
  o.pinnedEsther = (((await prefs()).pinnedTechnicianIds ?? []) as string[]).includes(ES.staff_id);
  await bv('ZZAUTOTEST F2 Card Menu'); await toColumn(p, ES.staff_id);
  const card = p.locator(`[data-test-id="board_card_${w.id}"]`); const btn = card.locator('[data-test-id="button_work_order_more_actions"]');
  // FIX-UP 2 (17 Oct 2026): on 16 Oct the button read as shown BEFORE any hover (and still after Escape), so "shows only on hover"
  // could not be judged — possibly held by keyboard focus on the card. The reading now also gives the EFFECTIVE opacity (the button's
  // and every ancestor's up to the card, since a hover style can sit on a parent), pointer-events, whether the button is the element
  // actually painted at its own centre, and document.activeElement; and the idle / step-5 readings are taken after focus is cleared.
  const vis = () => btn.evaluate((e: any) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); let eff = 1, n: any = e; for (let i = 0; i < 12 && n; i++, n = n.parentElement) { eff *= +getComputedStyle(n).opacity; if (n.getAttribute && /^board_card_/.test(n.getAttribute('data-test-id') || '') && n.getAttribute('data-test-id') !== 'board_card_number') break; }
    const top = r.width > 0 ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null; const ae = document.activeElement;
    return { opacity: s.opacity, effectiveOpacity: Math.round(eff * 100) / 100, visibility: s.visibility, display: s.display, pointerEvents: s.pointerEvents, w: Math.round(r.width), h: Math.round(r.height), paintedOnTop: !!(top && (top === e || e.contains(top))),
      shown: s.visibility !== 'hidden' && s.display !== 'none' && eff > 0.05 && r.width > 0, active: ae && ae !== document.body ? String(ae.getAttribute('data-test-id') || ae.closest('[data-test-id]')?.getAttribute('data-test-id') || ae.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>') : 'body', cardHovered: !!(e.closest('[data-test-id^="board_card_"]') || e).matches(':hover'), cardFocusWithin: !!(e.closest('[data-test-id^="board_card_"]') || e).matches(':focus-within') }; }).catch(() => ({ shown: false, missing: true }));
  // a neutral spot: a point whose element is not a control, a card or a field — clicked to drop focus, and where the mouse is parked
  const neutral = async () => { for (const [x, y] of [[1590, 990], [800, 990], [1590, 500], [5, 500], [800, 75]] as const) { const ok = await p.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); return !!e && !e.closest('button, a, input, textarea, [role=button], [role=menuitem], .q-field, .q-btn, [data-test-id^="board_card_"], [data-test-id^="board_column_header"]'); })()`).catch(() => false); if (ok) return { x, y }; } return { x: 1590, y: 990 }; };
  const clearFocus = async (tag: string) => { const pt = await neutral(); await p.mouse.click(pt.x, pt.y).catch(() => {}); await p.evaluate(`(() => { const e = document.activeElement; if (e && e !== document.body && e.blur) e.blur(); })()`).catch(() => {}); await p.mouse.move(pt.x, pt.y); await p.waitForTimeout(900); return { at: pt, tag }; };
  const menus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(m => m.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
  const fx = () => p.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body', text: '', ring: false };
    const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
    const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
    return { tid: String(e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace('${w.id}', 'Work-order-1').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), text: (e.innerText || e.value || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), ring: !!ring }; })()`) as Promise<any>;
  const press = async (k: string) => { await p.keyboard.press(k); await p.waitForTimeout(250); return { key: k, focus: await fx() }; };
  o.idleBeforeClear = await vis();   // as found, before focus is cleared
  o.cleared = await clearFocus('before step 1'); o.idle = await vis(); await shot(p, 'C96945-s0-idle');   // the NEGATIVE reading: nothing hovers, nothing focused
  console.log(t(), 'START STATE found C96945', JSON.stringify({ idleBeforeClear: o.idleBeforeClear, idleAfterClear: o.idle }));
  // step 1: hover the card
  await card.hover(); await p.waitForTimeout(800); o.s1 = await vis(); await shot(p, 'C96945-s1-hover');
  // steps 2-3: click More actions, read the items
  await btn.click(); await p.waitForTimeout(1200); o.s2 = { menusOpen: (await menus()).length }; o.s3 = { items: await menus(), offersReassign: (await menus()).some((x) => /Reassign lead technician/.test(x)) }; await shot(p, 'C96945-s2-s3-menu');
  // step 4: Escape closes the menu
  await p.keyboard.press('Escape'); await p.waitForTimeout(800); o.s4 = { menusOpen: (await menus()).length }; await shot(p, 'C96945-s4-after-escape');
  // step 5: mouse off the card, the button hides again
  { const pt = await neutral(); await p.mouse.move(pt.x, pt.y); } await p.waitForTimeout(900); o.s5 = await vis(); await shot(p, 'C96945-s5-mouse-off');   // the case's step 5: mouse only
  o.s5cleared = await clearFocus('before the step-5 reading'); o.s5afterClickOutside = await vis(); await shot(p, 'C96945-s5-after-click-outside');   // the same after a click outside the card (focus dropped)
  o.hoverControl = { s1Shown: o.s1?.shown, idleShown: o.idle?.shown, s5Shown: o.s5afterClickOutside?.shown, note: 's1 (hovered) is the positive control; idle and s5 after the click outside are the negative readings' };
  // step 6: click once in Search
  const box = p.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click();
  await box.click(); await p.waitForTimeout(400); o.s6 = { focus: await fx(), inSearch: await p.evaluate(`!!(document.activeElement && document.activeElement.closest('[data-test-id="page_search_input"]') || (document.activeElement && document.activeElement.getAttribute('data-test-id') === 'page_search_input'))`), searchHolds: await box.inputValue().catch(() => null) };
  await shot(p, 'C96945-s6-search');
  // step 7: Tab until a card shows a focus ring (every stop recorded; positive control that Tab DOES reach the board)
  o.s7 = { stops: [] as any[] };
  for (let i = 0; i < 40; i++) { const st = await press('Tab'); o.s7.stops.push(st.focus); if (/^board_card_/.test(st.focus.tid) && st.focus.tid !== 'board_card_number') { o.s7.landed = st.focus; o.s7.presses = i + 1; break; } }
  await p.mouse.move(5, 500); await shot(p, 'C96945-s7-tab-card');
  // step 8: arrow keys to Work-order-1's card (down its column, then left/right across columns), each key recorded
  o.s8 = { keys: [] as any[] }; const target = 'board_card_Work-order-1';
  if (o.s7.landed) {
    let f = o.s7.landed;
    for (const k of ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']) { for (let i = 0; i < 10 && f.tid !== target; i++) { const st = await press(k); o.s8.keys.push(`${k} -> ${st.focus.tid}${st.focus.ring ? ' (ring)' : ''}`); if (st.focus.tid === f.tid) break; f = st.focus; } if (f.tid === target) break; }
    o.s8.reached = f.tid === target; o.s8.focus = await fx();
  }
  await p.mouse.move(5, 500); await p.waitForTimeout(700); o.s8.moreActionsWithoutHover = await vis(); await shot(p, 'C96945-s8-arrows-card');
  // an unassigned card's menu label (extra reading kept from the earlier version)
  const [u] = await seedCase(a, 'ZZAUTOTEST F2 Card Menu Unassigned', 'ZZF3CU', [{ lead: null }]);
  await search(p, 'ZZAUTOTEST F2 Card Menu Unassigned'); await p.locator(`[data-test-id="board_card_${u.id}"]`).hover(); await p.locator(`[data-test-id="board_card_${u.id}"] [data-test-id="button_work_order_more_actions"]`).click(); await p.waitForTimeout(1000);
  o.menuUnassigned = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' '))`); await p.keyboard.press('Escape');
});


await run('C96946', async () => {
  const [w] = await seedCase(a, 'ZZAUTOTEST F2 Card Click', 'ZZF3CC', [{ lead: ES.staff_id }]);
  await bv('ZZAUTOTEST F2 Card Click'); await toColumn(p, ES.staff_id);
  const card = p.locator(`[data-test-id="board_card_${w.id}"]`);
  const opened = async () => { const u = p.url(); const r = /\/workorders\/[0-9a-f-]{36}/.test(u); if (r) { await p.goBack({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await search(p, 'ZZAUTOTEST F2 Card Click'); await toColumn(p, ES.staff_id); } return r ? u.replace(APP, '') : false; };
  R.C96946 = {};
  await card.locator('[data-test-id="board_card_field_company_name"]').click(); await p.waitForTimeout(3000); R.C96946.customerName = await opened();
  const b = (await card.boundingBox())!; await p.mouse.click(b.x + b.width - 30, b.y + b.height - 12); await p.waitForTimeout(3000); R.C96946.emptySpace = await opened();
  await card.hover(); await card.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(1200);
  R.C96946.moreActions = { url: p.url().replace(APP, ''), menu: await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' '))`) }; await p.keyboard.press('Escape');
});

// ── pins (admin's own; put back at the end) ───────────────────────────
await run('C96947', async () => {
  const n = 'ZZAUTOTEST F2 Board Pin Order';
  await seedCase(a, n, 'ZZF3PO', [{ lead: ES.staff_id }, { lead: RE.staff_id }, { lead: JW.staff_id }, { lead: KW.staff_id }, { lead: null }]);
  await bv(n); await unpinAll();
  const four = [ES.staff_id, JW.staff_id, KW.staff_id, RE.staff_id];
  const order = async () => (await allBoardCols(p)).filter((c) => c.id === 'unassigned' || four.includes(c.id)).map((c) => `${c.name}${c.pinned === 'true' ? ' (pinned)' : ''}`);
  R.C96947 = { start: await order(), pinControls: (await boardCols(p)).filter((c) => c.id !== 'unassigned').every((c) => c.pinned !== null) };
  await pin(RE.staff_id); R.C96947.afterRalph = await order();
  await pin(ES.staff_id); R.C96947.afterEsther = await order(); await shot(p, 'C96947-board');
  await display(p, 'Tech View'); R.C96947.tech = (await groups(p)).filter((g) => g.id === 'unassigned' || four.includes(g.id)).map((g) => g.name); await display(p, 'Board View');
});

await run('C96948', async () => {
  const n = 'ZZAUTOTEST F2 Pins Follow User';
  await seedCase(a, n, 'ZZF3PF', [{ lead: RE.staff_id }, { lead: JW.staff_id }, { lead: ES.staff_id }]);
  await bv(n); await unpinAll(); await pin(RE.staff_id); await pin(JW.staff_id);
  R.C96948 = { saved: ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf) };
  await display(p, 'Tech View'); R.C96948.tech = (await groups(p)).slice(0, 4).map((g) => `${g.name}${g.pin?.pressed === 'true' ? ' (pinned)' : ''}`); await display(p, 'Board View');
  // 22 Oct 2026 (production): User-B is read BEFORE the second sign-in — that sign-in ends this browser's session (L0511), so the
  // switch to User-B through it failed; and User-B is made when missing (production had none).
  let ub = (await staffRows(a, UB)).find((x) => x.email === UB);
  if (!ub) { const rr = await person(a, 'ZZAUTOTEST', 'WOB User B', { role: (await roleIds(a))['Admin'], email: UB }); ub = rr.row ?? (await staffRows(a, UB)).find((x) => x.email === UB); }
  R.C96948.userB = await as(ub.id, async () => { await bv(n); return { pinned: ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf), first: (await boardCols(p)).slice(0, 4).map((c) => `${c.name}${c.pinned === 'true' ? ' (pinned)' : ''}`) }; });
  // 22 Oct 2026 (production): a new sign-in opens at the account's default location — move it to {Location-A} first
  const s2 = await signIn('/customers'); R.C96948.newSignInLocation = (await api(s2.page).post('/api/iam/change-location', { workplace_id: HEAVY, ...(process.env.WOB_LOC_TZ ? { workplace_timezone: process.env.WOB_LOC_TZ } : {}) })).status; await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await s2.page.waitForTimeout(4000); await display(s2.page, 'Board View'); await search(s2.page, n);
  R.C96948.newSignIn = (await boardCols(s2.page)).slice(0, 4).map((c) => `${c.name}${c.pinned === 'true' ? ' (pinned)' : ''}`); await shot(s2.page, 'C96948-new-signin');
  await Promise.race([s2.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]);
});

await run('C96949', async () => {
  const n = 'ZZAUTOTEST F2 Board Pin Limit';
  await seedCase(a, n, 'ZZF3PL', [RE, TW, ES, KW, JW].map((x) => ({ lead: x.staff_id })));
  await bv(n); await unpinAll();
  for (const x of [RE, TW, JW]) await pin(x.staff_id);
  await toColumn(p, KW.staff_id);
  const kw = p.locator(`[data-test-id="button_board_pin_${KW.staff_id}"]`);
  R.C96949 = { kwDisabled: await kw.evaluate((e) => (e as HTMLButtonElement).disabled || e.getAttribute('aria-disabled') === 'true') };
  await kw.hover({ force: true }); await p.waitForTimeout(1200); R.C96949.tip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim()).join(' | ')`);
  await kw.click({ force: true }).catch(() => {}); await p.waitForTimeout(1500); R.C96949.afterClick = ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf); await shot(p, 'C96949-limit');
  await pin(JW.staff_id); await pin(ES.staff_id); R.C96949.afterSwap = ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf);
  await display(p, 'Tech View'); await search(p, n);
  const g = await groups(p); R.C96949.tech = g.filter((x) => x.pin?.pressed === 'true').map((x) => x.name); await shot(p, 'C96949-tech-pins');
  // 15 Oct 2026 (staging second pass): Kristin Watson's group is far down among ~119 technicians and is not drawn until scrolled
  // to, so her pin control was never read. Collapse Unassigned, scroll the table until her group exists, centre it, then read.
  { const u = g.find((x) => x.id === 'unassigned'); if (u && !u.collapsed) await toggleGroup(p, 'unassigned'); }
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(500);
  for (let i = 0; i < 150 && !(await p.locator(`[data-test-id="tech_view_group_${KW.staff_id}"]`).count()); i++) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 400`); await p.waitForTimeout(300); }
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${KW.staff_id}"]')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(1000);
  R.C96949.techKwDisabled = (await groups(p)).find((x) => x.id === KW.staff_id)?.pin?.disabled ?? 'not drawn';
  const kwT = p.locator(`[data-test-id="button_tech_view_pin_${KW.staff_id}"]`);
  if (await kwT.count()) { await kwT.hover({ force: true }); await p.waitForTimeout(1500); R.C96949.techKwTip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim()).join(' | ')`); await shot(p, 'C96949-tech-kristin'); }
  await (globalThis as any).__shotEach?.('C96949-tech');
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`);
  await display(p, 'Board View');
});

await run('C96951', async () => {
  const n = 'ZZAUTOTEST F2 Board Assigned';
  const wos = await seedCase(a, n, 'ZZF3BA', [{ lead: me.id }, { lead: RE.staff_id }, { lead: null }]);
  const w2 = wos.find((w: any) => w.techAssignedId === RE.staff_id); if (w2) await a.post('/api/work-orders/change-service-advisor', { work_order_id: w2.id, service_advisor_id: RE.staff_id });
  await bv(n); await unpinAll(); await pin(JW.staff_id);
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  const on = await allBoardCols(p); R.C96951 = { on: on.map((c) => `${c.name}(${c.count}) [${c.cards.join(' ')}] pin:${c.pinned}`) }; await shot(p, 'C96951-assigned-on');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  const off = await boardCols(p); R.C96951.offFirst = off.slice(0, 3).map((c) => `${c.name} pin:${c.pinned}`); R.C96951.offColumns = (await allBoardCols(p)).length;
});

await run('C96952', async () => {
  const n = 'ZZAUTOTEST F2 Inactive Pinned';
  await seedCase(a, n, 'ZZF3IP', [{ lead: RE.staff_id }, { lead: RE.staff_id }]);
  await bv(n); await unpinAll(); await pin(RE.staff_id);
  const r = await a.post('/api/iam/change-status', { id: RE.id }); R.C96952 = { deactivate: r.status, activeNow: (await sid('ralph.edwards'))?.is_active };
  await bv(n);
  const cs = await boardCols(p); const rc = cs.find((c) => c.id === RE.staff_id);
  R.C96952.order = cs.slice(0, 3).map((c) => `${c.name} pin:${c.pinned}`); R.C96952.ralph = rc;
  R.C96952.header = await p.evaluate(`(document.querySelector('[data-test-id="board_column_header_${RE.staff_id}"]') || {}).innerText?.replace(/\\s+/g, ' ') || null`);
  await shot(p, 'C96952-inactive-pinned');
  await p.locator(`[data-test-id="button_board_pin_${RE.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1500);
  R.C96952.afterUnpin = { pins: ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf), first: (await boardCols(p)).slice(0, 3).map((c) => c.name) };
  const back = await a.post('/api/iam/change-status', { id: RE.id }); R.C96952.reactivate = back.status; R.C96952.activeAfter = (await sid('ralph.edwards'))?.is_active;
});
// put the admin's pins back
await bv(''); await unpinAll(); for (const id of pinsBefore) await pin(id).catch(() => {});
R.pinsRestored = ((await prefs()).pinnedTechnicianIds ?? []).map(nameOf);

await run('C96953', async () => {
  const n = 'ZZAUTOTEST F2 Column Scroll';
  await seedCase(a, n, 'ZZF3CS', [...Array(25).fill({ lead: null }), ...Array(20).fill({ lead: ES.staff_id }), { lead: RE.staff_id }, { lead: JW.staff_id }]);
  await bv(n);
  const st = () => p.evaluate(`(() => { const u = document.querySelector('[data-test-id="board_column_unassigned"] .board-column__body'); const hs = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].slice(0, 4).map(e => Math.round(e.getBoundingClientRect().top)); const second = document.querySelectorAll('[data-test-id^="board_column_"] .board-column__body')[1]; return { uBody: u ? Math.round(u.scrollTop) : null, headers: hs, secondBodyScroll: second ? Math.round(second.scrollTop) : null, page: Math.round(scrollY), docScroll: Math.round(document.scrollingElement.scrollTop) }; })()`);
  R.C96953 = { start: await st() };
  await p.evaluate(`document.querySelector('[data-test-id="board_column_unassigned"] .board-column__body').scrollTop = 1200`); await p.waitForTimeout(900); R.C96953.unassignedScrolled = await st();
  // wheel over empty space below a short column
  const short = await p.locator('[data-test-id^="board_column_empty_"]').first().boundingBox();
  if (short) { await p.mouse.move(short.x + short.width / 2, Math.min(950, short.y + short.height + 200)); await p.mouse.wheel(0, 1500); await p.waitForTimeout(900); }
  R.C96953.afterWheelOnEmpty = await st();
  await toColumn(p, ES.staff_id); await p.evaluate(`(() => { const b = document.querySelector('[data-test-id="board_column_${ES.staff_id}"] .board-column__body'); if (b) b.scrollTop = 1200; })()`); await p.waitForTimeout(900); R.C96953.estherScrolled = await st();
  await shot(p, 'C96953-columns');
  const all = await allBoardCols(p); R.C96953.technicianColumns = all.filter((c) => c.id !== 'unassigned').length; R.C96953.eligible = techs.length;
});

await run('C96955', async () => {
  // 22 Oct 2026: rewritten to the case as it reads now (PRD v73): Board View has NO density control; Tech View keeps its own and Board
  // cards do not change with it. Steps 3-9: density buttons on Board View (count) and Column Selection present; [WO-1]'s card box; Tech
  // View's density menu (options, ticked); Comfortable; Board card box again; Tech View Compact; Board card box again. Tech View is put
  // back to Regular at the end.
  const n = 'ZZAUTOTEST F2 Shared Density';
  const [w1] = await seedCase(a, n, 'ZZF3SD', [{ lead: ES.staff_id }]);
  await bv(n); await toColumn(p, ES.staff_id).catch(() => {}); await p.waitForTimeout(1000);
  const vis = (sel: string) => p.evaluate(`[...document.querySelectorAll('${sel}')].filter(e => e.getBoundingClientRect().width > 0).length`) as Promise<number>;
  const box = () => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${w1.id}"]'); if (!c) return null; const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })()`);
  const o: any = { step3: { densityButtons: await vis('[data-test-id="button_density"]'), columnSelection: await vis('[data-test-id="button_board_fields_selection"]') } };
  o.step4 = await box(); await shot(p, 'C96955-s4-board-card'); R.C96955 = o;
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(800);
  o.step6 = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/check/, '').trim() + (e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || e.querySelector('.q-icon') ? ' [ticked]' : ''))`);
  await shot(p, 'C96955-s6-tech-density-menu'); await p.locator('[data-test-id="option_density_comfortable"]').click(); await p.waitForTimeout(1500);
  await display(p, 'Board View'); await p.waitForTimeout(1500); await toColumn(p, ES.staff_id).catch(() => {}); o.step8 = await box(); await shot(p, 'C96955-s8-board-after-tech-comfortable');
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(800); await p.locator('[data-test-id="option_density_compact"]').click(); await p.waitForTimeout(1500);
  await display(p, 'Board View'); await p.waitForTimeout(1500); await toColumn(p, ES.staff_id).catch(() => {}); o.step9 = await box(); await shot(p, 'C96955-s9-board-after-tech-compact');
  o.sameCard = JSON.stringify(o.step4) === JSON.stringify(o.step8) && JSON.stringify(o.step4) === JSON.stringify(o.step9);
  await display(p, 'Tech View'); await p.waitForTimeout(1200); await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(600); await p.locator('[data-test-id="option_density_regular"]').click().catch(() => {}); await p.waitForTimeout(800); await display(p, 'Board View');
});

await run('C96954', async () => {
  const n = 'ZZAUTOTEST F2 Card Reach';
  await seedCase(a, n, 'ZZF3CR', Array(10).fill({ lead: ES.staff_id }));
  await seedCase(a, 'ZZAUTOTEST F2 Card Reach Commercial Transport Services', 'ZZF3CL', Array(5).fill({ lead: ES.staff_id }));
  await bv(n);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(800);
  for (const e of await p.locator('.q-menu [role=switch][aria-checked="false"], .q-menu [role=checkbox][aria-checked="false"]').all()) { await e.click().catch(() => {}); await p.waitForTimeout(300); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  await toColumn(p, ES.staff_id); R.C96954 = {};
  // 22 Oct 2026: the case has no density step (and Board View has no density control in this release) — one reading, as the case says
  for (const d of ['board']) {
    await p.evaluate(`(() => { const b = document.querySelector('[data-test-id="board_column_${ES.staff_id}"] .board-column__body'); if (b) b.scrollTop = b.scrollHeight; })()`); await p.waitForTimeout(1200);
    R.C96954[d] = await p.evaluate(`(() => { const b = document.querySelector('[data-test-id="board_column_${ES.staff_id}"] .board-column__body'); const cards = [...b.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id'))); const last = cards[cards.length - 1]; const br = b.getBoundingClientRect(), lr = last.getBoundingClientRect(); return { cards: cards.length, lastNumber: last.querySelector('[data-test-id="board_card_number"]').textContent.trim(), lastBottomInside: Math.round(br.bottom - lr.bottom), fields: [...last.querySelectorAll('[data-test-id^="board_card_field_"]')].map(f => f.getAttribute('data-test-id').replace('board_card_field_', '')), atEnd: Math.round(b.scrollHeight - b.clientHeight - b.scrollTop) }; })()`);
    await shot(p, `C96954-${d}`);
  }
});

fs.writeFileSync(path.join(EV, 's3-batchA.json'), JSON.stringify(R, null, 1));
await done(browser);
