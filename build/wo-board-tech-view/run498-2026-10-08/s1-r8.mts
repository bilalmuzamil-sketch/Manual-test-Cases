/** s1-r8.mts — 19 Oct 2026: s1-r7.mts with the Tech View half rebuilt to read THE SCREEN. On 19 Oct s1-r7 reported the Tech View half as
 *  restored, but its pictures disagreed with its readings: the "before" picture showed empty groups (Ammar Mughamis…) at the top while the
 *  reading said row S2-36421; the row it opened was off screen and Playwright scrolled it into view before clicking, so the "after Back"
 *  position was compared with a position the click itself had changed. Now: the table is scrolled with the mouse wheel until rows of
 *  Technician-H are on screen at least one screen down; one of them is put at the top; what sits at the top is read with elementFromPoint
 *  (what the tester sees); a row FULLY on screen is opened by a mouse click on its number link, and the click is refused unless the link is
 *  under the pointer; Back; the same screen reading compared. Output EV/s1-r8-<ONLY>.json; pictures EV/C96916-r8-*.png. Records only. */
/** s1-r7.mts — 19 Oct 2026: s1-r6.mts with the start on the ALL tab + Status Approved (the Work Orders tab has no Status filter on staging or
 *  production, L0451; option A put to the QA lead). Only the tab name changed (2 places). */
/**
 * s1-r6.mts — 17 Oct 2026 LIVE re-run of s1-r4.mts as a DEDICATED test user (see the note above the sign-in). Was:
 * s1-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C96916 alone (ONLY=C96916), "Browser Back restores scroll, tab and
 * filters in Tech View and Board View". The Board View half and the set-up are s1-batch4b.mts's code, copied unchanged (lines 7-165; only
 * the start tag changed). The Tech View half is new: on 17 Oct none of the case's rows was on screen (scrollTop 700, top row S2-36421) and
 * no row was opened. Now the case's search is read back, a CASE row about six rows down is brought to the top (checked against the case's
 * own numbers), sideways scrolling is kept only as far as leaves that row's number link in view, the NUMBER LINK is clicked in place, then
 * Back, and the top row / sideways position / tab / Status are compared. Output EV/s1-r4-<ONLY>.json; pictures EV/C96916-*.png. Records only.
 * ───────────────────────────── COPIED FROM s1-batch4b.mts (lines 7-165, 17 Oct 2026) ─────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, active, activeTab, searchValue, groupCounts, allBoardCols } from './wob.mts';
import { startState, setDisplay, noteDisplay, prefRead } from './fixup-1017.mts';
import { person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
// LIVE RE-RUN 17 Oct (C96916, Rule 104): the saved display is per user and the admin's is shared with other sessions, so this run works as
// a DEDICATED Admin-role test user nobody else uses ("ZZAUTOTEST C96916 Back Tester", Time Clock off so never offered as a technician):
// the normal sign-in, then switch-user to that person (viewAs, as runner.mts does for ZZ WOB Runner), location Heavy Duty; every page
// and preference below is that user's own. Switched back at the end.
const { browser, page: p0 } = await open('/workorders?tab=all');
const a0 = api(p0); await a0.post('/api/exit-switch-user', {});
const ORG0 = (await import('./profile.mts')).ORG;
const rolesL0: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a0.get(`/api/organizations/${ORG0}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const ADMIN0 = rolesL0.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(await roleIds(a0)).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];
const DU = (await person(a0, 'ZZAUTOTEST C96916', 'Back Tester', { role: ADMIN0, email: 'zz.wob.c96916.back@staging.shopview.local', clockable: false })).row;
if (!DU) throw new Error('dedicated test user not made');
const me0 = (await candidates(a0)).find((x) => x.name === 'Admin ShopView');
const toDU = async () => { let s0 = await a0.post('/api/switch-user', { user_id: DU.id }); if (s0.status >= 300) { await a0.post('/api/exit-switch-user', {}); s0 = await a0.post('/api/switch-user', { user_id: DU.id }); } await a0.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' }); };
const V = await viewAs(browser, p0, a0, DU.id, me0?.id ?? '', toDU);
const p = V.page; p.setDefaultTimeout(30_000);
const a = api(p);
await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' });
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4000);
console.log(t(), 'DEDICATED USER', JSON.stringify({ name: 'ZZAUTOTEST C96916 Back Tester', email: DU.email, role: DU.role_label, perms: V.perms, me: (await a.get('/api/auth/me/fe-permissions')).status }));
const R: Record<string, any> = {};
const techs = await candidates(a);
const tA = techs.find((x) => x.name === 'Ayesha Khan')!;
// 17 Oct 2026: fix-up — log the saved display / collapsed groups found BEFORE anything is set, clear the saved collapsed groups
// (Tech View rows are read in both cases) and read them back; each case then sets its own display with setDisplay (read back)
R.startState = await startState(p, a, "s1-r8", { clearCollapsed: true });
const go = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); };
async function seed(name: string, unit: string, n: number) {
  let have = await workOrders(a, name);
  if (have.length < n) { const c = await customer(a, name, unit); for (let i = have.length; i < n; i++) await workOrder(a, c, 'approved', tA.id); have = await workOrders(a, name); }
  return have.length;
}
// mark the board's horizontal scroller and Ayesha Khan's column scroller / the Tech View table scroller
const MARK = `(() => {
  const big = [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return e.clientWidth > 300 && e.scrollWidth > e.clientWidth + 50 && /(auto|scroll)/.test(s.overflowX); });
  big.sort((x, y) => y.clientWidth - x.clientWidth); if (big[0]) big[0].setAttribute('data-zz', 'h');
  const col = document.querySelector('[data-test-id="board_column_${'${'}ID}"]');
  const tall = (root) => root ? [root, ...root.querySelectorAll('*')].find(e => { const s = getComputedStyle(e); return e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(s.overflowY); }) : null;
  const v = tall(col) || [...document.querySelectorAll('.q-table__middle')].find(e => e.scrollHeight > e.clientHeight + 50);
  if (v) v.setAttribute('data-zz', (v === big[0] ? 'hv' : 'v'));
  return { h: big[0] ? big[0].className.slice(0, 80) : null, v: v ? v.className.slice(0, 80) : null };
})()`.replace('${ID}', '');
async function mark(colId: string) { return p.evaluate(MARK.replace('board_column_"]', `board_column_${colId}"]`).replace('board_column_${ID}', `board_column_${colId}`)); }
const pos = () => p.evaluate(`(() => {
  const h = document.querySelector('[data-zz=h],[data-zz=hv]'), v = document.querySelector('[data-zz=v],[data-zz=hv]');
  const inView = (sel) => [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; });
  const cols = inView('[data-test-id^="board_column_"]').map(c => (c.innerText.split('\\n').find(x => /[a-z]{3}/i.test(x)) || '').trim()).slice(0, 8);
  const nums = [...(document.body.innerText.match(/\\bS\\d+-\\d+\\b/g) || [])];
  const firstVisibleNum = (() => { for (const e of document.querySelectorAll('[data-zz=v] *, [data-zz=hv] *')) { if (e.children.length) continue; const r = e.getBoundingClientRect(); const pv = v && v.getBoundingClientRect(); if (pv && r.top >= pv.top + 2 && r.width > 0 && /^S\\d+-\\d+$/.test(e.textContent.trim())) return e.textContent.trim(); } return null; })();
  return { left: h ? Math.round(h.scrollLeft) : null, top: v ? Math.round(v.scrollTop) : null, cols, firstVisibleNum, url: location.pathname + location.search };
})()`);
// left < 0 means "that many pixels before the END of the board" (15 Oct 2026: staging's board is ~40 000 px wide)
const scrollTo = async (left: number, top: number) => { await p.evaluate(`(() => { const h = document.querySelector('[data-zz=h],[data-zz=hv]'); const v = document.querySelector('[data-zz=v],[data-zz=hv]'); if (h) { h.scrollLeft = ${left} < 0 ? Math.max(0, h.scrollWidth - h.clientWidth + (${left})) : ${left}; h.dispatchEvent(new Event('scroll')); } if (v) { v.scrollTop = ${top}; v.dispatchEvent(new Event('scroll')); } })()`); await p.waitForTimeout(1500); };
/**
 * 15 Oct 2026 (staging second pass): the board draws only the columns on screen, so after scrolling RIGHT the long column
 * marked before the scroll (the pinned [Tech-A], at the far left) is no longer drawn and was never scrolled down (C96917), or
 * the board was never scrolled right at all because [Tech-A]'s pinned column sits at offset 0 (C96916). Now: scroll right
 * FIRST, then mark the tallest column that is fully on screen ([Tech-A]'s when it is there, else e.g. Unassigned, which stays
 * at the left) and scroll down inside THAT column.
 */
const markTallInView = (prefer: string) => p.evaluate(`(() => {
  document.querySelectorAll('[data-zz=v]').forEach(e => e.removeAttribute('data-zz'));
  const cols = [...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(c => /^board_column_([0-9a-f-]{36}|unassigned)$/.test(c.getAttribute('data-test-id')))
    .filter(c => { const r = c.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; });
  const tall = (root) => [root, ...root.querySelectorAll('*')].find(e => { const s = getComputedStyle(e); return e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(s.overflowY); });
  const c = cols.map(col => ({ col, id: col.getAttribute('data-test-id').replace('board_column_', ''), body: tall(col) })).filter(x => x.body)
    .sort((x, y) => (y.id === ${JSON.stringify('${P}')}) - (x.id === ${JSON.stringify('${P}')}) || (y.body.scrollHeight - y.body.clientHeight) - (x.body.scrollHeight - x.body.clientHeight));
  if (!c[0]) return null; c[0].body.setAttribute('data-zz', 'v');
  const n = document.querySelector('[data-test-id="board_column_name_' + c[0].id + '"]');
  return { id: c[0].id, name: n ? n.textContent.trim() : c[0].id, extra: c[0].body.scrollHeight - c[0].body.clientHeight };
})()`.split('${P}').join(prefer)) as Promise<{ id: string; name: string; extra: number } | null>;
/** every column fully on screen with how far its own list is scrolled down (0 = starts at its first card) */
const colTops = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(c => /^board_column_([0-9a-f-]{36}|unassigned)$/.test(c.getAttribute('data-test-id')))
  .filter(c => { const r = c.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; })
  .map(c => { const id = c.getAttribute('data-test-id').replace('board_column_', ''); const n = document.querySelector('[data-test-id="board_column_name_' + id + '"]');
    const b = [c, ...c.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY));
    const first = c.querySelector('[data-test-id="board_card_number"]'); return (n ? n.textContent.trim() : id) + ' top=' + (b ? Math.round(b.scrollTop) : 'no-scroll') + ' firstCard=' + (first ? first.textContent.trim() : '-'); })`) as Promise<string[]>;
// 16 Oct 2026 (C96916 rewritten): Status chip text and the "Assigned to me" chip's state, read as they show
const statusChip = () => p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
const assignedOn = () => p.locator('[data-test-id="filter_chip_assigned_to_me"]').first().evaluate((e) => e.getAttribute('aria-pressed') ?? (/(selected|active|bg-primary|text-primary)/.test(e.className) ? 'true' : 'false')).catch(() => null);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 12000)); // 15 Oct 2026: 3000 cut off C96916's Tech View part
}

await run('C96916', async () => {
  // 16 Oct 2026 (case rewritten 15 Oct): Back must bring the sideways position back EXACTLY, and the card/row that was at the top must
  // come back at the top, fully shown, at most one card/row away. The case's own set-up is made: customer "ZZAUTOTEST F1 Scroll Back H"
  // with 20 Approved work orders led by Technician-H and 2 led by each of seven other technicians (made once, reused); Search on it;
  // Board View scrolled right to Technician-H's column, then that column scrolled down; the top card's id, its box and whether it is fully
  // inside the column are read before and after Back, and the drift is given in cards. Then the same for a Tech View row.
  const want8 = ['Esther Howard', 'Ralph Edwards', 'Jenny Wilson', 'Theresa Webb', 'Kristin Watson', 'Brenda Martinez', 'Cameron Williamson', 'Floyd Miles'];
  let eight = want8.map((n) => techs.find((x) => x.name === n)).filter(Boolean) as { id: string; name: string }[];
  if (eight.length < 8) eight = [...eight, ...techs.filter((x) => !eight.some((e) => e.id === x.id) && !/Admin ShopView|^ZZ/.test(x.name)).slice(0, 8 - eight.length)];
  // 16 Oct 2026 (second go): the first go took the last name of the list as Technician-H; with two stand-ins that was Aaron Zed, whose
  // column sits at the far LEFT, so nothing scrolled sideways. Technician-H is now the one whose name sorts LAST (columns are in name
  // order), with its own customer; and this user's saved collapsed groups and pins are taken off for the test (put back at the end),
  // because collapsed groups hid every Tech View row on the first go.
  eight.sort((x, y) => x.name.localeCompare(y.name));
  const H = eight[eight.length - 1]; const n = `ZZAUTOTEST F1 Scroll Back ${H.name.split(' ')[0]}`;
  const PREFU = '/api/users/me/preferences/work-orders-list'; const PV0 = (await a.get(PREFU)).body?.data?.value ?? {}; (globalThis as any).__pv0 = PV0;
  { const v: any = {}; for (const [k, x] of Object.entries(PV0)) if (!/collaps|pinned/i.test(k)) v[k] = x; v.pinnedTechnicianIds = []; R.C96916_prefCleared = (await a.put(PREFU, { value: v })).status; }
  let have = await workOrders(a, n);
  if (!have.length) { const c = await customer(a, n, 'ZZSBH'); for (let k = 0; k < 20; k++) await workOrder(a, c, 'approved', H.id); for (const tt of eight.slice(0, 7)) { await workOrder(a, c, 'approved', tt.id); await workOrder(a, c, 'approved', tt.id); } have = await workOrders(a, n); }
  R.C96916 = { technicians: eight.map((x) => x.name), H: H.name, workOrders: have.length };
  const boardRead = () => p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const col = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (!col) return { left: h ? Math.round(h.scrollLeft) : null, column: 'not drawn' };
    const body = [col, ...col.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); const bb = (body || col).getBoundingClientRect(); const cb = col.getBoundingClientRect();
    const cards = [...col.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')));
    const order = cards.map(e => (e.querySelector('[data-test-id="board_card_number"]') || {}).textContent?.trim());
    const top = cards.find(e => e.getBoundingClientRect().bottom > bb.top + 4); const tb = top ? top.getBoundingClientRect() : null;
    const cols = [...document.querySelectorAll('[data-test-id^="board_column_name_"]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; }).map(e => e.textContent.trim());
    return { left: h ? Math.round(h.scrollLeft) : null, columnsInView: cols, columnFullyInView: cb.left >= 0 && cb.right <= innerWidth, columnScrollTop: body ? Math.round(body.scrollTop) : null,
      topCard: top ? { number: (top.querySelector('[data-test-id="board_card_number"]') || {}).textContent?.trim(), index: cards.indexOf(top), offsetFromColumnTop: Math.round(tb.top - bb.top), height: Math.round(tb.height), fullyShown: tb.top >= bb.top - 1 && tb.bottom <= bb.bottom + 1 } : null, cardsDrawn: order.length }; })()`);
  // 16 Oct 2026: follows the case as rewritten (starts on the "Work Orders" tab with Status "Approved" only, not the All tab; after each
  // Back - steps 5 and 10 - the tab and the Status chip are read besides the scroll position; steps 4 and 9 read that the work order page
  // opened; step 6 reads that Tech View holds the same work orders as Board View, per technician). A tab click clears the search, so the
  // order is: tab, clear filters, Status, then Search. Every step has its own reading and picture (shots named by the case's step number).
  const filt = async () => ({ savedDisplay: (await prefRead(a))?.display ?? null, display: await active(p), tab: await activeTab(p), statusChip: await statusChip(), savedFilters: (await prefRead(a)).filters, search: await searchValue(p), assignedToMe: await assignedOn(), url: p.url().replace(APP, '') }); // 17 Oct 2026: fix-up — saved filters read too (the chip may not be drawn)
  // 17 Oct 2026: fix-up — on 16 Oct the click on the Status chip timed out: in the picture (C96916-error) the Work Orders tab in Board
  // View shows NO Status chip at all (Search, Assigned to me, Asset on Site only), and high2-batch (C368214) read the same on the Work
  // Orders tab in List (statusButton 0). So the chip is looked for, never assumed: count it on the Work Orders tab in Board View and in
  // List; positive control = the same selector on the All tab (where other scripts use it). If the Work Orders tab offers it, Status is
  // set to Approved there; if not, the reading says so (the case's starting screen cannot be built on this build — reported, the rest
  // of the case still runs) and the saved filters are read so the judge sees what the page holds.
  const chipCount = () => p.locator('[data-test-id="filter_chip_status"]:visible').count();
  await go(); await tab(p, 'All'); const bvStart = await setDisplay(p, a, 'Board View', 'C96916 start');
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1500);
  const sc: any = { workOrdersTabBoard: await chipCount() };
  if (!sc.workOrdersTabBoard) { await display(p, 'List'); sc.workOrdersTabList = await chipCount(); }
  const where = sc.workOrdersTabBoard ? 'Board View' : sc.workOrdersTabList ? 'List' : null;
  if (!where) { await tab(p, 'All'); sc.allTabControl = await chipCount(); await tab(p, 'All'); }
  if (where) {
    await p.locator('[data-test-id="filter_chip_status"]:visible').first().click({ timeout: 10_000 }); await p.waitForTimeout(800);
    await p.locator('.q-menu').getByText('Clear selection').first().click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(600);
    await p.locator('[data-test-id="filter_option_status_approved"]').click({ timeout: 10_000 }).catch((e) => { sc.approvedClick = String(e?.message || e).slice(0, 80); }); await p.waitForTimeout(800);
    await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  }
  sc.chipText = await statusChip(); sc.savedFilters = (await prefRead(a)).filters;
  sc.statusReachable = !!where && !sc.approvedClick;
  if (where !== 'Board View') sc.backToBoard = await setDisplay(p, a, 'Board View', 'C96916 back to Board View');
  R.C96916.statusSetup = sc; R.C96916.boardStart = bvStart;
  console.log(t(), 'C96916 Status set-up', JSON.stringify(sc));
  if ((await assignedOn()) === 'true') { await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click().catch(() => {}); await p.waitForTimeout(2000); }
  await search(p, n);
  R.C96916.start = { ...(await filt()), windowWidth: await p.evaluate('innerWidth'), seededStatuses: [...new Set(have.map((w: any) => w.status))] };
  // step 6 needs "the same work orders" in both views: every Board View column's count now (the board is scrolled back to the left after)
  R.C96916.boardCounts = Object.fromEntries((await allBoardCols(p)).filter((c) => c.count > 0).map((c) => [c.name, c.count]));
  await shot(p, 'C96916-r8-s0-start');
  const B: any = { reached: await (async () => { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); for (let i = 0; i < 400 && !(await p.locator(`[data-test-id="board_column_${H.id}"]`).count()); i++) { const mv = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const b = h.scrollLeft; h.scrollLeft += 600; return h.scrollLeft !== b; })()`); await p.waitForTimeout(300); if (!mv) break; }
    await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const c = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (h && c) { const r = c.getBoundingClientRect(); if (r.right > innerWidth) h.scrollLeft += r.right - innerWidth + 24; if (r.left < 0) h.scrollLeft += r.left - 24; } })()`); await p.waitForTimeout(1200);
    return (await p.locator(`[data-test-id="board_column_${H.id}"]`).count()) > 0; })() };
  B.boardWiderThanWindow = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); return h ? h.scrollWidth > h.clientWidth : null; })()`);
  B.step1 = await boardRead(); await shot(p, 'C96916-r8-s1-column-in-view'); // step 1: Technician-H's column fully in view
  // step 5: scroll down inside H's column until a card well below the first screen is at the top (6 cards' worth)
  await p.evaluate(`(() => { const col = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (!col) return; const body = [col, ...col.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); const c1 = col.querySelector('[data-test-id^="board_card_"]'); if (body) body.scrollTop = Math.round((c1 ? c1.getBoundingClientRect().height + 8 : 150) * 6); })()`); await p.waitForTimeout(1500);
  B.before = await boardRead(); await shot(p, 'C96916-r8-s2-s3-board-before'); // steps 2-3: the card at the top and the columns in view, written down
  const tgt = await p.evaluate(`(() => { const col = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (!col) return null; const cards = [...col.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')));
    const vis = cards.filter(e => { const r = e.getBoundingClientRect(); return r.top > 240 && r.bottom < innerHeight - 10 && r.left > 0 && r.right < innerWidth; }); const e = vis[1] || vis[0]; if (!e) return null; const n = e.querySelector('[data-test-id="board_card_number"]'); const r = (n || e).getBoundingClientRect(); return { n: n ? n.textContent.trim() : '?', x: r.left + Math.min(r.width / 2, 30), y: r.top + r.height / 2 }; })()`) as any;
  B.clicked = tgt?.n ?? null; if (!tgt) throw new Error('Board View: no card of Technician-H on screen to open');
  await p.mouse.click(tgt.x, tgt.y); await p.waitForTimeout(4000); B.openedUrl = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>');
  B.step4 = { workOrderPageOpened: /\/workorders\/[0-9a-f]{8}-/.test(p.url()), pageShowsClickedNumber: tgt.n !== '?' && (await p.evaluate('document.body.innerText').catch(() => '') as string).includes(tgt.n) }; await shot(p, 'C96916-r8-s4-wo-page');
  await p.goBack({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); B['after' + (i + 1)] = await boardRead(); }
  B.step5filters = await filt(); await shot(p, 'C96916-r8-s5-board-after-back'); // step 5: tab "Work Orders" + Status "Approved" must still read, besides the position
  const bl = B.after4 ?? B.after3; B.drift = bl?.topCard && B.before?.topCard ? { sideways: (bl.left ?? 0) - (B.before.left ?? 0), cards: bl.topCard.index - B.before.topCard.index, sameTopCard: bl.topCard.number === B.before.topCard.number, px: (bl.columnScrollTop ?? 0) - (B.before.columnScrollTop ?? 0) } : null;
  R.C96916.board = B;
  // ───── Tech View half, read from the screen (19 Oct 2026)
  await setDisplay(p, a, 'Tech View', 'C96916 step 6'); await p.waitForTimeout(2000);
  const s6: any = { ...(await filt()), techCounts: await groupCounts(p) };
  s6.sameAsBoard = JSON.stringify(Object.entries(s6.techCounts).filter(([, c]) => (c as number) > 0).sort()) === JSON.stringify(Object.entries(R.C96916.boardCounts).sort());
  await shot(p, 'C96916-r8-s6-tech-view');
  if (s6.search !== n) { await search(p, n); await p.waitForTimeout(2500); s6.searchTypedAgain = await searchValue(p); }
  R.C96916.step6 = s6;
  const T: any = {}; const hNums = have.filter((w: any) => JSON.stringify(w).includes(H.id)).map((w: any) => w.number); // 19 Oct: Technician-H's own work orders (its id appears in the record)
  const caseNums = have.map((w: any) => w.number);
  // the screen, top to bottom, under the headings: every table line the pointer meets (sticky group headers marked), first 6
  const SCREEN = (nums: string[]) => `(() => { const s = document.querySelector('.q-table__middle'); if (!s) return null; const sb = s.getBoundingClientRect(); const hbs = [...s.querySelectorAll('thead')].map(t => t.getBoundingClientRect()).filter(r => r.height > 0 && r.bottom > sb.top && r.top < sb.top + 120); const hb = hbs.length ? Math.max(...hbs.map(r => r.bottom)) : sb.top; /* 19 Oct: the heading band ON SCREEN — the first thead scrolls away */
    const nums = ${JSON.stringify(nums)}; const out = []; const seen = new Set(); const x = sb.left + Math.min(500, sb.width / 3);
    for (let y = hb + 3; y < Math.min(innerHeight, sb.bottom) - 3 && out.length < 6; y += 6) { const e = document.elementFromPoint(x, y); const tr = e && e.closest('tr'); if (!tr || seen.has(tr)) continue; seen.add(tr);
      const r = tr.getBoundingClientRect(); const sticky = [tr, ...tr.children].some(c => getComputedStyle(c).position === 'sticky' && getComputedStyle(c).top !== 'auto');
      const text = tr.innerText.replace(/\\s+/g, ' ').trim().slice(0, 70); const num = (text.match(/S\\d+-\\d+/) || [null])[0];
      out.push({ text, num, ourRow: !!num && nums.includes(num), sticky, top: Math.round(r.top - hb), height: Math.round(r.height), fully: r.top >= hb - 1 && r.bottom <= Math.min(innerHeight, sb.bottom) + 1 }); }
    const first = out.find(o => !o.sticky) || null; return { scrollTop: Math.round(s.scrollTop), scrollLeft: Math.round(s.scrollLeft), clientHeight: s.clientHeight, wider: s.scrollWidth > s.clientWidth, top: first, lines: out }; })()`;
  const screen = () => p.evaluate(SCREEN(caseNums)) as Promise<any>;
  const box = await p.locator('.q-table__middle').first().boundingBox(); if (!box) throw new Error('Tech View table not drawn');
  await p.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height, 700) / 2);
  // step 7: wheel down until rows of Technician-H are on screen at least one screen down
  const H_ON = `(() => { const s = document.querySelector('.q-table__middle'); const sb = s.getBoundingClientRect(); const hbs = [...s.querySelectorAll('thead')].map(t => t.getBoundingClientRect()).filter(r => r.height > 0 && r.bottom > sb.top && r.top < sb.top + 120); const hb = hbs.length ? Math.max(...hbs.map(r => r.bottom)) : sb.top; /* 19 Oct: the heading band ON SCREEN — the first thead scrolls away */ const nums = ${JSON.stringify(hNums.length ? hNums : caseNums)};
    return [...s.querySelectorAll('a[data-test-id^="tech_view_row_number_link_"]')].map(l => ({ b: l.getBoundingClientRect(), n: l.textContent.trim() })).filter(o => nums.includes(o.n) && o.b.width > 0 && o.b.top > hb + 60 && o.b.bottom < Math.min(innerHeight, sb.bottom) - 4).map(o => ({ n: o.n, dy: Math.round(o.b.top - hb) })); })()`; // 19 Oct: by the number LINKS — a tr match also hit group rows that wrap their work orders
  R.C96916.tech = T; T.diag = [] as any[];
  const SCR = `(() => { const s = document.querySelector('.q-table__middle'); const big = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).map(e => ({ cls: (e.className || '').toString().slice(0, 40), st: Math.round(e.scrollTop), sh: e.scrollHeight, ch: e.clientHeight })); return { st: Math.round(s.scrollTop), sh: s.scrollHeight, ch: s.clientHeight, doc: Math.round(document.scrollingElement.scrollTop), big, rows: s.querySelectorAll('tr').length, loading: !!document.querySelector('.q-inner-loading, .q-spinner, [class*=loading]') }; })()`;
  let steps = 0; let on: any[] = [];
  for (; steps < 400; steps++) { const sc = await screen(); on = await p.evaluate(H_ON) as any[]; if (sc.scrollTop >= sc.clientHeight && on.length >= 3) break; const b0 = sc.scrollTop; await p.mouse.wheel(0, 500); await p.waitForTimeout(250);
    if ((await screen()).scrollTop === b0) { let moved = false; for (let w = 0; w < 4 && !moved; w++) { T.diag.push({ step: steps, wait: w, ...(await p.evaluate(SCR) as any) }); await p.waitForTimeout(2500); await p.mouse.wheel(0, 300); await p.waitForTimeout(500); moved = (await screen()).scrollTop !== b0; } if (!moved) { await shot(p, 'C96916-r8-stuck'); break; } } }
  T.diag.push({ end: true, ...(await p.evaluate(SCR) as any) });
  T.wheelSteps = steps; T.hNums = hNums.length; T.hRowsOnScreen = on.map((o) => o.n);
  if (on.length) { await p.mouse.wheel(0, on[0].dy - 20); await p.waitForTimeout(1500); } // a Technician-H row (or its group header) to the top
  // sideways: a little to the right if the table is wider, kept only if a Technician-H number link stays fully in view
  const LINK = `(() => { const s = document.querySelector('.q-table__middle'); const sb = s.getBoundingClientRect(); const hbs = [...s.querySelectorAll('thead')].map(t => t.getBoundingClientRect()).filter(r => r.height > 0 && r.bottom > sb.top && r.top < sb.top + 120); const hb = hbs.length ? Math.max(...hbs.map(r => r.bottom)) : sb.top; /* 19 Oct: the heading band ON SCREEN — the first thead scrolls away */ const nums = ${JSON.stringify(hNums.length ? hNums : caseNums)};
    const ls = [...s.querySelectorAll('a[data-test-id^="tech_view_row_number_link_"]')].map(l => ({ l, b: l.getBoundingClientRect(), n: l.textContent.trim() })).filter(o => nums.includes(o.n) && o.b.top > hb + 60 && o.b.bottom < Math.min(innerHeight, sb.bottom) - 8 && o.b.left > sb.left && o.b.right < sb.right && o.b.width > 0);
    const o = ls[1] || ls[0]; if (!o) return null; const x = o.b.left + o.b.width / 2, y = o.b.top + o.b.height / 2; const hit = document.elementFromPoint(x, y); return { n: o.n, x, y, underPointer: !!hit && (hit === o.l || o.l.contains(hit)) }; })()`;
  T.sideways = { tries: [] as any[] }; const s7 = await screen();
  if (s7?.wider) { await p.mouse.wheel(200, 0); await p.waitForTimeout(800); const l1 = await p.evaluate(LINK) as any; T.sideways.tries.push({ right: 200, link: l1 }); if (!l1?.underPointer) { await p.mouse.wheel(-200, 0); await p.waitForTimeout(800); T.sideways.tries.push({ back: true }); } }
  T.before = await screen(); await shot(p, 'C96916-r8-s7-s8-tech-before'); // steps 7-8: the line at the top and the columns, written down
  const lk = await p.evaluate(LINK) as any; T.link = lk;
  if (!lk?.underPointer) throw new Error('Tech View: no Technician-H number link fully on screen under the pointer — not clicked (no automatic scrolling)');
  T.beforeAtClick = await screen(); const startUrl = p.url();
  await p.mouse.click(lk.x, lk.y); for (let i = 0; i < 10 && p.url() === startUrl; i++) await p.waitForTimeout(800);
  await p.waitForTimeout(2500); T.clicked = lk.n;
  T.step9 = { workOrderPageOpened: /\/workorders\/[0-9a-f]{8}-/.test(p.url()), pageShowsClickedNumber: (await p.evaluate('document.body.innerText').catch(() => '') as string).includes(lk.n) }; await shot(p, 'C96916-r8-s9-wo-page');
  await p.goBack({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); T['after' + (i + 1)] = await screen(); }
  T.step10filters = await filt(); await shot(p, 'C96916-r8-s10-tech-after-back');
  const tl = T.after4 ?? T.after3; const tb = T.beforeAtClick;
  const lineIdx = (sc: any, txt: string) => (sc?.lines ?? []).filter((o: any) => !o.sticky).findIndex((o: any) => o.text === txt);
  T.drift = tl?.top && tb?.top ? { sideways: tl.scrollLeft - tb.scrollLeft, px: tl.scrollTop - tb.scrollTop, sameTopLine: tl.top.text === tb.top.text, topBefore: tb.top.text, topAfter: tl.top.text, topAfterFully: tl.top.fully, beforeTopNowAtLine: lineIdx(tl, tb.top.text) } : null;
  console.log(t(), 'C96916 Tech View back (screen)', JSON.stringify({ steps, clicked: T.clicked, opened: T.step9, drift: T.drift, filters: T.step10filters }));
  R.C96916.tech = T;
  await search(p, ''); await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1200); await display(p, 'List');
  R.C96916.prefRestored = (await a.put(PREFU, { value: PV0 })).status;
});

if ((globalThis as any).__pv0 && !R.C96916?.prefRestored) R.C96916_prefRestoredAfterError = (await a.put('/api/users/me/preferences/work-orders-list', { value: (globalThis as any).__pv0 })).status;
const OUT4 = path.join(EV, `s1-r8${only.length ? '-' + only.join('-') : ''}.json`);
fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
await V.close().catch(() => {}); await a0.post('/api/exit-switch-user', {}).catch(() => {});
await done(browser);
