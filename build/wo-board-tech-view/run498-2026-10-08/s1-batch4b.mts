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
  // 🔴 first attempt void (2026-10-08): the card "in view" was found in Ayesha Khan's column while that column was
  // OFF screen, and a locator click scrolls its target into view — so the click itself moved the board and the
  // "before" position was never what Back had to restore. Now: the column is brought into view first, the card
  // is picked by its on-screen box, and it is clicked by mouse position (no automatic scrolling).
  R.C96916 = { seeded: await seed('ZZAUTOTEST F1 Scroll Back', 'ZZSB-1', 20) };
  const names = Object.fromEntries(techs.map((x) => [x.id, x.name]));
  const view = async () => { const q = await pos(); const ids = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(e => /^board_column_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id'))).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > 0 && r.left < innerWidth; }).map(e => e.getAttribute('data-test-id').replace('board_column_', ''))`) as string[];
    return { ...q, columnsInView: ids.map((i) => names[i] ?? i) }; };
  const pickInView = (sel: string) => p.evaluate(`(() => { for (const e of document.querySelectorAll(${JSON.stringify(sel)})) { if (e.children.length || !/^S\\d+-\\d+$/.test(e.textContent.trim())) continue; const r = e.getBoundingClientRect(); if (r.top > 230 && r.bottom < innerHeight - 10 && r.left > 0 && r.right < innerWidth) return { n: e.textContent.trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 }; } return null; })()`) as Promise<{ n: string; x: number; y: number } | null>;
  await go(); await tab(p, 'All');
  for (const d of ['Board View', 'Tech View']) {
    await display(p, d); R.C96916[d] = { scrollers: await mark(tA.id) };
    if (d === 'Board View') {
      const off = await p.evaluate(`(() => { const h = document.querySelector('[data-zz=h],[data-zz=hv]'); const c = document.querySelector('[data-test-id="board_column_${tA.id}"]'); return c && h ? Math.round(c.getBoundingClientRect().left - h.getBoundingClientRect().left + h.scrollLeft) : null; })()`) as number | null;
      R.C96916[d].columnOffset = off;
      // step 4: scroll right until a technician near the END is at the left edge; step 5: scroll down inside a long column on screen
      await scrollTo(-1200, 0); R.C96916[d].longColumn = await markTallInView(tA.id); await scrollTo(-1200, 900);
      R.C96916[d].colTopsBefore = await colTops();
    } else { await scrollTo(300, 900); }
    const before = await view(); R.C96916[d].before = before; await shot(p, `C96916-${d.replace(' ', '')}-before`);
    const target = await pickInView(d === 'Board View' ? `[data-zz=v] *` : '.q-virtual-scroll__content *');
    R.C96916[d].opened = target?.n ?? null;
    if (!target) throw new Error(`${d}: no work order on screen to open`);
    await p.mouse.click(target.x, target.y); await p.waitForTimeout(4000);
    R.C96916[d].openedUrl = p.url().replace(APP, '');
    await p.goBack({ waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); if (d === 'Board View') { await mark(tA.id); const lc = R.C96916[d].longColumn?.id; if (lc) await markTallInView(lc); } else await mark(tA.id); R.C96916[d]['after' + (i + 1)] = await view(); if (d === 'Board View') R.C96916[d]['colTopsAfter' + (i + 1)] = await colTops(); }
    await shot(p, `C96916-${d.replace(' ', '')}-after-back`);
  }
  await display(p, 'List');
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

fs.writeFileSync(path.join(EV, 's1-batch4b.json'), JSON.stringify(R, null, 1));
await done(browser);
