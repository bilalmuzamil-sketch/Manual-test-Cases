/**
 * S1 batch 4b (2026-10-08): scroll position — C96916 browser Back restores it, C96917 a tab click or
 * coming from another page starts top-left, clicking Work Orders while on the page keeps it.
 * Scroll containers are found on the page (the element whose content is wider / taller than its box),
 * never assumed; positions are read as scrollLeft / scrollTop plus the names actually in view.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const techs = await candidates(a);
const tA = techs.find((x) => x.name === 'Ayesha Khan')!;
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
  await go(); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  const B: any = { reached: await (async () => { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); for (let i = 0; i < 400 && !(await p.locator(`[data-test-id="board_column_${H.id}"]`).count()); i++) { const mv = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const b = h.scrollLeft; h.scrollLeft += 600; return h.scrollLeft !== b; })()`); await p.waitForTimeout(300); if (!mv) break; }
    await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const c = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (h && c) { const r = c.getBoundingClientRect(); if (r.right > innerWidth) h.scrollLeft += r.right - innerWidth + 24; if (r.left < 0) h.scrollLeft += r.left - 24; } })()`); await p.waitForTimeout(1200);
    return (await p.locator(`[data-test-id="board_column_${H.id}"]`).count()) > 0; })() };
  B.boardWiderThanWindow = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); return h ? h.scrollWidth > h.clientWidth : null; })()`);
  // step 5: scroll down inside H's column until a card well below the first screen is at the top (6 cards' worth)
  await p.evaluate(`(() => { const col = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (!col) return; const body = [col, ...col.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); const c1 = col.querySelector('[data-test-id^="board_card_"]'); if (body) body.scrollTop = Math.round((c1 ? c1.getBoundingClientRect().height + 8 : 150) * 6); })()`); await p.waitForTimeout(1500);
  B.before = await boardRead(); await shot(p, 'C96916-s6-board-before');
  const tgt = await p.evaluate(`(() => { const col = document.querySelector('[data-test-id="board_column_${H.id}"]'); if (!col) return null; const cards = [...col.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')));
    const vis = cards.filter(e => { const r = e.getBoundingClientRect(); return r.top > 240 && r.bottom < innerHeight - 10 && r.left > 0 && r.right < innerWidth; }); const e = vis[1] || vis[0]; if (!e) return null; const n = e.querySelector('[data-test-id="board_card_number"]'); const r = (n || e).getBoundingClientRect(); return { n: n ? n.textContent.trim() : '?', x: r.left + Math.min(r.width / 2, 30), y: r.top + r.height / 2 }; })()`) as any;
  B.clicked = tgt?.n ?? null; if (!tgt) throw new Error('Board View: no card of Technician-H on screen to open');
  await p.mouse.click(tgt.x, tgt.y); await p.waitForTimeout(4000); B.openedUrl = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>');
  await p.goBack({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); B['after' + (i + 1)] = await boardRead(); }
  await shot(p, 'C96916-s9-board-after-back');
  const bl = B.after4 ?? B.after3; B.drift = bl?.topCard && B.before?.topCard ? { sideways: (bl.left ?? 0) - (B.before.left ?? 0), cards: bl.topCard.index - B.before.topCard.index, sameTopCard: bl.topCard.number === B.before.topCard.number, px: (bl.columnScrollTop ?? 0) - (B.before.columnScrollTop ?? 0) } : null;
  R.C96916.board = B;
  // Tech View: scroll down (and right if wider), the row at the top under the headings, then open a row and come Back
  const tvRead = () => p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return null; const sb = s.getBoundingClientRect(); const th = s.querySelector('thead'); const hb = th ? th.getBoundingClientRect().bottom : sb.top;
    const held = [...s.querySelectorAll('[data-test-id^="tech_view_group_"]')].filter(e => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id'))).map(e => e.getBoundingClientRect()).filter(r => r.top <= hb + 4 && r.bottom > hb).map(r => r.bottom);
    const edge = Math.max(hb, ...held); const rows = [...s.querySelectorAll('[data-test-id^="tech_view_row_"]')]; const all = rows.map(r => (r.innerText.match(/S\\d+-\\d+/) || [''])[0]);
    const top = rows.find(r => r.getBoundingClientRect().bottom > edge + 4); const tr = top ? top.getBoundingClientRect() : null;
    const heads = [...s.querySelectorAll('thead th')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= sb.left - 1 && r.right <= sb.right + 1; }).map(e => e.innerText.replace(/arrow_drop_(up|down)/g, '').trim()).filter(Boolean);
    return { scrollTop: Math.round(s.scrollTop), scrollLeft: Math.round(s.scrollLeft), wider: s.scrollWidth > s.clientWidth, columnsInView: heads, topRow: top ? { number: (top.innerText.match(/S\\d+-\\d+/) || [''])[0], index: rows.indexOf(top), offsetFromEdge: Math.round(tr.top - edge), height: Math.round(tr.height), fullyShown: tr.top >= edge - 1 && tr.bottom <= sb.bottom + 1 } : null, rowsDrawn: all.length }; })()`);
  await display(p, 'Tech View'); await p.waitForTimeout(2000); if (!(await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(p, n);
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) { s.scrollTop = 700; s.scrollLeft = s.scrollWidth; } })()`); await p.waitForTimeout(1500);
  const T: any = { before: await tvRead() }; await shot(p, 'C96916-s12-tech-before');
  const rt = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); const th = s.querySelector('thead'); const edge = (th ? th.getBoundingClientRect().bottom : 200) + 60; const rows = [...s.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(r => { const b = r.getBoundingClientRect(); return b.top > edge && b.bottom < innerHeight - 10; }); const r = rows[1] || rows[0]; if (!r) return null; const c = [...r.querySelectorAll('td')].find(td => /S\\d+-\\d+/.test(td.innerText)) || r.querySelector('td'); const b = c.getBoundingClientRect(); return { n: (r.innerText.match(/S\\d+-\\d+/) || [''])[0], x: b.left + Math.min(b.width / 2, 30), y: b.top + b.height / 2 }; })()`) as any;
  T.clicked = rt?.n ?? null; if (!rt) throw new Error('Tech View: no row on screen to open');
  await p.mouse.click(rt.x, rt.y); await p.waitForTimeout(4000); T.openedUrl = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>');
  await p.goBack({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); T['after' + (i + 1)] = await tvRead(); }
  await shot(p, 'C96916-s15-tech-after-back');
  const tl = T.after4 ?? T.after3; T.drift = tl?.topRow && T.before?.topRow ? { sideways: tl.scrollLeft - T.before.scrollLeft, rows: tl.topRow.index - T.before.topRow.index, sameTopRow: tl.topRow.number === T.before.topRow.number, px: tl.scrollTop - T.before.scrollTop } : null;
  R.C96916.tech = T;
  await search(p, ''); await display(p, 'List');
  R.C96916.prefRestored = (await a.put(PREFU, { value: PV0 })).status;
});

await run('C96917', async () => {
  R.C96917 = { seeded: await seed('ZZAUTOTEST F1 Top Left', 'ZZTL-1', 20) };
  await go(); await tab(p, 'All');
  for (const d of ['Board View', 'Tech View']) {
    await display(p, d); R.C96917[d] = { scrollers: await mark(tA.id) };
    // 15 Oct 2026: on Board View scroll right FIRST, then down inside a long column that is still on screen (markTallInView)
    const rightDown = async (k: string) => { if (d === 'Board View') { await scrollTo(2400, 0); R.C96917[d]['longColumn' + k] = await markTallInView(tA.id); } await scrollTo(2400, 900); R.C96917[d]['scrolled' + k] = await pos(); if (d === 'Board View') R.C96917[d]['colTopsScrolled' + k] = await colTops(); };
    const after = async (k: string) => { R.C96917[d][k] = await pos(); if (d === 'Board View') R.C96917[d][k + 'ColTops'] = await colTops(); };
    await rightDown('1');
    await tab(p, 'Estimates'); await tab(p, 'All'); await p.waitForTimeout(1500); await mark(tA.id);
    await after('afterTabClick'); await shot(p, `C96917-${d.replace(' ', '')}-after-tab`);
    await rightDown('2');
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(4000);
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(5000); await mark(tA.id);
    await after('afterSchedule'); await shot(p, `C96917-${d.replace(' ', '')}-after-schedule`);
    await rightDown('3');
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(3000);
    if (d === 'Board View') { const lc = R.C96917[d].longColumn3?.id; if (lc) await markTallInView(lc); }
    await after('afterSameNav'); await shot(p, `C96917-${d.replace(' ', '')}-after-same-nav`);
  }
  await display(p, 'List');
});

if ((globalThis as any).__pv0 && !R.C96916?.prefRestored) R.C96916_prefRestoredAfterError = (await a.put('/api/users/me/preferences/work-orders-list', { value: (globalThis as any).__pv0 })).status; // 16 Oct 2026
fs.writeFileSync(path.join(EV, 's1-batch4b.json'), JSON.stringify(R, null, 1)); // 16 Oct 2026: EV = WOB_EV when set
await done(browser);
