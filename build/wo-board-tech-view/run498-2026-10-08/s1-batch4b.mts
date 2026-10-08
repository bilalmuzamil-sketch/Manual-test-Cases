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
const scrollTo = async (left: number, top: number) => { await p.evaluate(`(() => { const h = document.querySelector('[data-zz=h],[data-zz=hv]'); const v = document.querySelector('[data-zz=v],[data-zz=hv]'); if (h) { h.scrollLeft = ${left}; h.dispatchEvent(new Event('scroll')); } if (v) { v.scrollTop = ${top}; v.dispatchEvent(new Event('scroll')); } })()`); await p.waitForTimeout(1500); };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 3000));
}

await run('C96916', async () => {
  // 🔴 first attempt void (2026-10-08): the card "in view" was found in Ayesha Khan's column while that column was
  // OFF screen, and a locator click scrolls its target into view — so the click itself moved the board and the
  // "before" position was never what Back had to restore. Now: the column is brought into view first, the card
  // is picked by its on-screen box, and it is clicked by mouse position (no automatic scrolling).
  R.C96916 = { seeded: await seed('ZZAUTOTEST F1 Scroll Back', 'ZZSB-1', 20) };
  const names = Object.fromEntries(techs.map((x) => [x.id, x.name]));
  const view = async () => { const q = await pos(); const ids = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > 0 && r.left < innerWidth; }).map(e => e.getAttribute('data-test-id').replace('board_column_', ''))`) as string[];
    return { ...q, columnsInView: ids.map((i) => names[i] ?? i) }; };
  const pickInView = (sel: string) => p.evaluate(`(() => { for (const e of document.querySelectorAll(${JSON.stringify(sel)})) { if (e.children.length || !/^S\\d+-\\d+$/.test(e.textContent.trim())) continue; const r = e.getBoundingClientRect(); if (r.top > 230 && r.bottom < innerHeight - 10 && r.left > 0 && r.right < innerWidth) return { n: e.textContent.trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 }; } return null; })()`) as Promise<{ n: string; x: number; y: number } | null>;
  await go(); await tab(p, 'All');
  for (const d of ['Board View', 'Tech View']) {
    await display(p, d); R.C96916[d] = { scrollers: await mark(tA.id) };
    if (d === 'Board View') {
      const off = await p.evaluate(`(() => { const h = document.querySelector('[data-zz=h],[data-zz=hv]'); const c = document.querySelector('[data-test-id="board_column_${tA.id}"]'); return c && h ? Math.round(c.getBoundingClientRect().left - h.getBoundingClientRect().left + h.scrollLeft) : null; })()`) as number | null;
      R.C96916[d].columnOffset = off;
      await scrollTo(Math.max(0, (off ?? 2400) - 600), 0); await mark(tA.id); await scrollTo(Math.max(0, (off ?? 2400) - 600), 900);
    } else { await scrollTo(300, 900); }
    const before = await view(); R.C96916[d].before = before; await shot(p, `C96916-${d.replace(' ', '')}-before`);
    const target = await pickInView(d === 'Board View' ? `[data-test-id="board_column_${tA.id}"] *` : '.q-virtual-scroll__content *');
    R.C96916[d].opened = target?.n ?? null;
    if (!target) throw new Error(`${d}: no work order on screen to open`);
    await p.mouse.click(target.x, target.y); await p.waitForTimeout(4000);
    R.C96916[d].openedUrl = p.url().replace(APP, '');
    await p.goBack({ waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); await mark(tA.id); R.C96916[d]['after' + (i + 1)] = await view(); }
    await shot(p, `C96916-${d.replace(' ', '')}-after-back`);
  }
  await display(p, 'List');
});

await run('C96917', async () => {
  R.C96917 = { seeded: await seed('ZZAUTOTEST F1 Top Left', 'ZZTL-1', 20) };
  await go(); await tab(p, 'All');
  for (const d of ['Board View', 'Tech View']) {
    await display(p, d); R.C96917[d] = { scrollers: await mark(tA.id) };
    await scrollTo(2400, 900); R.C96917[d].scrolled1 = await pos();
    await tab(p, 'Estimates'); await tab(p, 'All'); await p.waitForTimeout(1500); await mark(tA.id);
    R.C96917[d].afterTabClick = await pos(); await shot(p, `C96917-${d.replace(' ', '')}-after-tab`);
    await scrollTo(2400, 900); R.C96917[d].scrolled2 = await pos();
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(4000);
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(5000); await mark(tA.id);
    R.C96917[d].afterSchedule = await pos(); await shot(p, `C96917-${d.replace(' ', '')}-after-schedule`);
    await scrollTo(2400, 900); R.C96917[d].scrolled3 = await pos();
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(3000);
    R.C96917[d].afterSameNav = await pos(); await shot(p, `C96917-${d.replace(' ', '')}-after-same-nav`);
  }
  await display(p, 'List');
});

fs.writeFileSync(path.join(EV, 's1-batch4b.json'), JSON.stringify(R, null, 1));
await done(browser);
