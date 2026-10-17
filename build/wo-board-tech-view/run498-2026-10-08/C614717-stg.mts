/** C614717-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614717 "Row and card name bubbles open above the avatar, headers keep the plain tip" (section 73780), steps as read live from
 *  TestRail on 16 Oct 2026. Source the case asserts: PRD Confluence 845185030 version 61, S2-R23 (name-bubble sentence added in versions
 *  60 and 61, Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422, SV-11421), S7-R6, S2-R10.
 *  Data (Rule 107, ZZAUTOTEST, reused when present): technicians "ZZAUTOTEST N4 Ana", Ben, Cal, Dee, Eve, Fay; customer
 *  "ZZAUTOTEST N4 Name Bubbles" with one Approved work order led by Ana and five approved lines whose technicians are Ben..Fay (lines
 *  from canned lines, PUT /api/work-orders/lines/{id}/technicians, as C368191-routes.mts), so the avatars end in "+N". Ana is pinned for
 *  this run so her group/column sits next to Unassigned (the saved Work Orders choices are put back at the end). Board View's "Fields to
 *  display" > "Line technicians" is turned on through the screen if it is off.
 *  Reading per hover: the visible .q-tooltip bubbles (text + box) and the nearest [title] on the hovered element (the browser's plain tip
 *  cannot be photographed; its text is the title attribute). "Above" = bubble bottom <= avatar top.
 *  Positive control (Rule 104): the row avatar hover (step 1) must show a bubble or a title; if neither, the header readings are void.
 *  Output EV/C614717-stg.json, pictures C614717-stg-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, toColumn, findRow } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614717-stg-${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const PREF = '/api/users/me/preferences/work-orders-list'; const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {}; const ORIGINAL = await prefGet();
const away = async () => { await p.mouse.move(5, 880); await W(700); };
/** FIX-UP 2 (17 Oct 2026): on 16 Oct Tech View's Assigned Techs cell sat right of the window, so the row hovers moved the mouse to a
 *  point off screen and read nothing; on the card, "first" was the first of 14 matches of a loose selector and landed on "N4 Cal".
 *  hoverAt() now takes only real avatars (.q-avatar) and the "+N", orders them as the eye sees them (left to right), records their
 *  initials, MARKS the one wanted — the leftmost ("first"), the "+N", or the avatar showing given initials — scrolls it into view
 *  (both directions, so an off-screen cell comes on screen), measures it after the scroll, moves to its centre and checks
 *  elementFromPoint there is that avatar (hit.onTarget) before the bubble is read. */
const hoverAt = async (sel: string, which: 'first' | 'plus' | { initials: string }, tag: string) => { await away();
  const want = JSON.stringify(which);
  const pre = await p.evaluate(`(() => { document.querySelectorAll('[data-zz-hv]').forEach(e => e.removeAttribute('data-zz-hv')); const host = document.querySelector(${JSON.stringify(sel)}); if (!host) return null;
    const vis = (e) => e.getBoundingClientRect().width > 0; const avs = [...host.querySelectorAll('.q-avatar')].filter(vis).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left);
    const plus = [...host.querySelectorAll('*')].find(e => e.childElementCount === 0 && /^\\+\\d+$/.test((e.textContent || '').trim()));
    const w = ${want}; const el = w === 'plus' ? plus : w === 'first' ? avs[0] : avs.find(a => (a.innerText || '').trim() === w.initials);
    if (!el) return { found: false, initials: avs.map(a => (a.innerText || '').trim() || (a.querySelector('img') ? 'img' : '')), plus: plus ? plus.textContent.trim() : null };
    el.setAttribute('data-zz-hv', '1'); el.scrollIntoView({ block: 'center', inline: 'center' }); const ti = el.closest('[title]');
    return { found: true, initials: avs.map(a => (a.innerText || '').trim() || (a.querySelector('img') ? 'img' : '')), plus: plus ? plus.textContent.trim() : null, picked: (el.innerText || '').trim(), title: ti ? ti.getAttribute('title') : null }; })()`).catch(() => null) as any;
  if (!pre?.found) return { found: false, ...(pre ?? {}) };
  await W(800); const bb = await p.locator('[data-zz-hv="1"]').first().boundingBox().catch(() => null); if (!bb) return { ...pre, why: 'no box after scrolling' };
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 5 }); await W(1500);
  const hit = await p.evaluate(`(() => { const el = document.querySelector('[data-zz-hv="1"]'); if (!el) return null; const r = el.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { onTarget: !!e && (e === el || el.contains(e) || e.contains(el)), at: e ? e.tagName + '.' + String(e.className).slice(0, 40) : null, hovered: el.matches(':hover'), inWindow: r.x >= 0 && r.right <= innerWidth && r.y >= 0 && r.bottom <= innerHeight }; })()`).catch(() => null);
  const bubbles = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); return { text: e.innerText.replace(/\\s+/g, ' ').trim(), y: Math.round(r.y), h: Math.round(r.height) }; })`) as any[];
  await shot(tag); return { ...pre, hit, bubbles, above: bubbles[0] ? bubbles[0].y + bubbles[0].h <= bb.y + 1 : null }; };
try {
  const names = ['Ana', 'Ben', 'Cal', 'Dee', 'Eve', 'Fay']; const T: any[] = [];
  for (const n of names) { const r = (await person(a, 'ZZAUTOTEST N4', n, { role: TECH, email: `zz.wob.n4.${n.toLowerCase()}${D}`, clockable: true, workplace: HEAVY })).row; T.push(r); o[`eligible${n}`] = await ensureEligible(a, r, n); }
  const CUST = 'ZZAUTOTEST N4 Name Bubbles'; let wo = (await workOrders(a, CUST))[0];
  if (!wo) { const c = await customer(a, CUST, 'N4-U1'); const id = await workOrder(a, c, 'estimate', null);
    const canned: any[] = []; { const cc = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(cc) ? cc : cc?.collection ?? [])); }
    for (let i = 1; i <= 5; i++) { const line = (await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id;
      o[`line${i}`] = line ? (await a.put(`/api/work-orders/lines/${line}/technicians`, { staffIds: [T[i].staff_id] })).status : 'no line'; }
    o.approve = (await a.post('/api/work-orders/change-status', { id, status: 'approved' })).status; o.lead = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: T[0].staff_id })).status;
    wo = (await workOrders(a, CUST))[0]; }
  o.wo = wo?.number; const W1 = wo.id;
  await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: [T[0].staff_id] } });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {});
  // Board View field "Line technicians" on (precondition), through the screen
  await display(p, 'Board View'); await p.locator('[data-test-id="button_board_fields_selection"]').first().click().catch(() => {}); await W(1000);
  const ft = p.locator('[data-test-id="toggle_board_field_line_technicians"], .q-menu .q-item:has-text("Line technicians") .q-toggle').first();
  o.lineTechField = await ft.getAttribute('aria-checked').catch(() => null); if (o.lineTechField === 'false') { await ft.click().catch(() => {}); await W(800); o.lineTechFieldAfter = await ft.getAttribute('aria-checked').catch(() => null); }
  await p.keyboard.press('Escape').catch(() => {}); await W(600);
  // ---- steps 1-3: Tech View
  await display(p, 'Tech View'); await search(p, CUST); await W(2000); o.rowGroup = await findRow(p, W1, T[0].staff_id).catch(() => null);   // fix-up 2: the row brought on screen first
  const cellSel = await p.evaluate((id) => { const heads = [...document.querySelectorAll('thead th')].map((th) => (th as HTMLElement).innerText.trim()); const i = heads.findIndex((h) => /^Assigned Techs$/i.test(h));
    const tr = document.querySelector(`[data-test-id="tech_view_row_${id}"]`) as HTMLTableRowElement | null; if (!tr || i < 0) return null; tr.cells[i].setAttribute('data-zz', 'assigned'); return '[data-zz="assigned"]'; }, W1);
  o.techAInitials = `${String(T[0].first_name ?? '').trim()[0] ?? ''}${String(T[0].last_name ?? '').trim()[0] ?? ''}`.toUpperCase();
  console.log(t(), 'START STATE found C614717', JSON.stringify({ wo: o.wo, technicianA: `${T[0].first_name} ${T[0].last_name}`, initials: o.techAInitials, assignedTechsCell: !!cellSel, lineTechField: o.lineTechField }));
  o.s1 = cellSel ? await hoverAt(cellSel, 'first', 's1-row-avatar') : { found: false, why: 'Assigned Techs cell not found' };
  o.s1_technicianA = cellSel ? await hoverAt(cellSel, { initials: o.techAInitials }, 's1-row-technician-a-avatar') : null;   // fix-up 2: Technician-A's own avatar, by initials
  o.s2 = cellSel ? await hoverAt(cellSel, 'plus', 's2-row-plus') : { found: false };
  o.s3 = await hoverAt(`[data-test-id="tech_view_group_${T[0].staff_id}"]`, 'first', 's3-group-header-avatar');
  // ---- steps 4-7: Board View
  await away(); await display(p, 'Board View'); await toColumn(p, T[0].staff_id); o.s4_card = await p.locator(`[data-test-id="board_card_${W1}"]`).count(); await shot('s4-board');
  const lt = `[data-test-id="board_card_${W1}"] [data-test-id="board_card_field_line_technicians"]`; const cardAv = (await p.locator(lt).count()) ? lt : `[data-test-id="board_card_${W1}"]`; o.s5_container = cardAv === lt ? 'line technicians field' : 'whole card';
  o.s5 = await hoverAt(cardAv, 'first', 's5-card-avatar');
  o.s5_technicianA = await hoverAt(cardAv, { initials: o.techAInitials }, 's5-card-technician-a-avatar');   // fix-up 2
  o.s6 = await hoverAt(cardAv, 'plus', 's6-card-plus');
  o.s7 = await hoverAt(`[data-test-id="board_column_header_${T[0].staff_id}"]`, 'first', 's7-column-header-avatar');
  o.positiveControl = (o.s1?.hit?.onTarget || o.s5?.hit?.onTarget) ? ((o.s1?.bubbles?.length || o.s1?.title || o.s5?.bubbles?.length) ? 'an avatar hover (pointer confirmed on the avatar) produced a bubble or a title' : 'the pointer was on the avatar (hit.onTarget) and no bubble or title appeared') : 'VOID: the pointer was never confirmed on an avatar';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.prefsBack = (await a.put(PREF, { value: ORIGINAL }).catch(() => ({ status: 0 }))).status; }
fs.writeFileSync(path.join(EV, 'C614717-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614717', JSON.stringify(o).slice(0, 2500)); await done(browser);
