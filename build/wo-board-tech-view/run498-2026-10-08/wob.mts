/**
 * Shared page actions for the WO Board run (2026-10-08), read off the build:
 * display switcher = [aria-label="List"|"Tech View"|"Board View"] (active one aria-pressed=true);
 * page search = page_search_toggle / page_search_input (a TAB CLICK CLEARS IT — type it again after);
 * Tech View groups = rows data-test-id tech_view_group_<id>, data-collapsed, count tech_view_group_count_<id>,
 * toggle button_tech_view_group_toggle_<id>; Unassigned starts COLLAPSED and the table draws only the
 * rows on screen, so a group must be expanded and the search kept small before rows can be read;
 * Board View columns = data-test-id board_column_<staffId|unassigned>.
 */
import path from 'node:path';
import type { Page } from 'playwright';

export const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
export const t = () => new Date().toISOString().slice(11, 19);
export const shot = (p: Page, n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
export async function display(p: Page, l: string) { await p.locator(`[aria-label="${l}"]`).first().click(); await p.waitForTimeout(3000); }
export const active = (p: Page) => p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`) as Promise<string | null>;
export async function tab(p: Page, name: string) { await p.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + name + '\\s*$') }).first().click(); await p.waitForTimeout(2500); }
export const activeTab = (p: Page) => p.evaluate(`(() => { const e = document.querySelector('.q-tab--active, [role=tab][aria-selected=true]'); return e ? e.innerText.trim() : null; })()`) as Promise<string | null>;
export async function search(p: Page, q: string) {
  const box = p.locator('[data-test-id="page_search_input"]');
  if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(600); }
  await box.fill(q); await p.waitForTimeout(4000);
}
export const searchValue = (p: Page) => p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
export async function expandSmallGroups(p: Page) {
  for (let i = 0; i < 60; i++) {
    const id = await p.evaluate(`(() => { const g = [...document.querySelectorAll('[data-test-id^="tech_view_group_"][data-collapsed="true"]')].find(r => { const id = r.getAttribute('data-test-id').replace('tech_view_group_', ''); const c = document.querySelector('[data-test-id="tech_view_group_count_' + id + '"]'); const n = c ? +c.textContent.trim() : 0; return n > 0 && n <= 50 && !r.dataset.zzTried; }); if (!g) return null; g.dataset.zzTried = '1'; return g.getAttribute('data-test-id').replace('tech_view_group_', ''); })()`);
    if (!id) return;
    await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click().catch(() => {}); await p.waitForTimeout(1200);
  }
}
/** Tech View group header counts {group name: count} for groups with a non-zero count */
export const groupCounts = (p: Page) => p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].map(c => { const id = c.getAttribute('data-test-id').replace('tech_view_group_count_', ''); const n = document.querySelector('[data-test-id="tech_view_group_name_' + id + '"]'); return [n ? n.textContent.trim() : id, +c.textContent.trim()]; }).filter(([, n]) => n > 0))`) as Promise<Record<string, number>>;
/** Board View column header text (first line) for columns that hold a card */
export const columnHeads = (p: Page) => p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(c => /\\bS\\d+-\\d+\\b/.test(c.innerText)).map(c => [c.getAttribute('data-test-id'), c.innerText.split('\\n').slice(0, 3).join(' | ')]))`) as Promise<Record<string, string>>;
/** {number: where it sits} — Tech View group name, Board View column test-id, or "list" — in screen order */
export async function read(p: Page, d: string): Promise<Record<string, string>> {
  if (d === 'Tech View') await expandSmallGroups(p);
  return p.evaluate(`(() => {
    const out = {}; const re = /\\bS\\d+-\\d+\\b/g;
    if (${JSON.stringify(d)} === 'Tech View') {
      let g = '?';
      for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) {
        const tid = tr.getAttribute('data-test-id') || '';
        if (tid.startsWith('tech_view_group_')) { const n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); g = n ? n.textContent.trim() : tid; continue; }
        for (const m of (tr.innerText.match(re) || [])) out[m] = g;
      }
      return out;
    }
    const m = document.querySelector('main, .q-page') || document.body;
    const walker = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      for (const n of (walker.currentNode.textContent.match(re) || [])) {
        let e = walker.currentNode.parentElement, where = '';
        while (e && !where) { const id = e.getAttribute && e.getAttribute('data-test-id'); if (id && /column|lane|group/i.test(id)) where = id; e = e.parentElement; }
        if (!(n in out)) out[n] = where || 'list';
      }
    }
    return out;
  })()`) as any;
}

/** Tech View groups in screen order: {name, id, count, collapsed, pinned?, empty text, rows (numbers)} */
export const groups = (p: Page) => p.evaluate(`(() => {
  const out = []; let cur = null;
  for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) {
    const tid = tr.getAttribute('data-test-id') || '';
    if (/^tech_view_group_/.test(tid)) {
      const id = tid.replace('tech_view_group_', '');
      const q = (s) => tr.querySelector('[data-test-id="' + s + id + '"]');
      const pin = q('button_tech_view_pin_');
      cur = { name: (q('tech_view_group_name_') || {}).textContent?.trim(), id, count: +((q('tech_view_group_count_') || {}).textContent || 'NaN'),
        collapsed: tr.getAttribute('data-collapsed') === 'true', pin: pin ? { pressed: pin.getAttribute('aria-pressed'), disabled: pin.disabled || pin.getAttribute('aria-disabled') === 'true', label: pin.getAttribute('aria-label') } : null,
        empty: (q('tech_view_group_empty_') || {}).textContent?.trim() || null, rows: [] };
      out.push(cur); continue;
    }
    const m = tr.innerText.match(/\\bS\\d+-\\d+\\b/); if (cur && m) cur.rows.push(m[0]);
    const e = tr.querySelector('[data-test-id^="tech_view_group_empty_"]'); if (cur && e && !cur.empty) cur.empty = e.textContent.trim();
  }
  return out;
})()`) as Promise<{ name: string; id: string; count: number; collapsed: boolean; pin: any; empty: string | null; rows: string[] }[]>;
export async function toggleGroup(p: Page, id: string) { await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click(); await p.waitForTimeout(1500); }
/** drag from one element's centre to another's (mouse, in steps, so a drag library sees a real drag) */
export async function drag(p: Page, from: string, to: string, dy = 4) {
  const a = await p.locator(from).first().boundingBox(), b = await p.locator(to).first().boundingBox();
  if (!a || !b) throw new Error(`drag: missing ${!a ? from : to}`);
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2 + 6, { steps: 3 });
  await p.mouse.move(b.x + b.width / 2, b.y + dy, { steps: 20 }); await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(3000);
}

/** Board View columns currently drawn, left to right: {id, name, count, cards, pinned, pinDisabled, empty, left} */
export const boardCols = (p: Page) => p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(h => {
  const id = h.getAttribute('data-test-id').replace('board_column_header_', '');
  const col = document.querySelector('[data-test-id="board_column_' + id + '"]');
  const q = (s) => document.querySelector('[data-test-id="' + s + id + '"]');
  const pin = q('button_board_pin_');
  return { id, name: (q('board_column_name_') || {}).textContent?.trim(), count: +((q('board_column_count_') || {}).textContent || 'NaN'),
    cards: col ? [...col.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : [],
    pinned: pin ? pin.getAttribute('aria-pressed') : null, pinDisabled: pin ? (pin.disabled || pin.getAttribute('aria-disabled') === 'true') : null,
    empty: (q('board_column_empty_') || {}).innerText?.replace(/\\s+/g, ' ').trim() || null, left: Math.round(h.getBoundingClientRect().left) };
})`) as Promise<{ id: string; name: string; count: number; cards: string[]; pinned: string | null; pinDisabled: boolean | null; empty: string | null; left: number }[]>;
/** every column on the board, scrolling sideways to draw them all; returns them in board order */
export async function allBoardCols(p: Page) {
  const seen = new Map<string, any>();
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(600);
  for (let i = 0; i < 40; i++) {
    for (const c of await boardCols(p)) if (!seen.has(c.id)) seen.set(c.id, c);
    const moved = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`);
    await p.waitForTimeout(400); if (!moved) { for (const c of await boardCols(p)) if (!seen.has(c.id)) seen.set(c.id, c); break; }
  }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(500);
  return [...seen.values()];
}
/** bring one Board column on screen */
export async function toColumn(p: Page, id: string) {
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(400);
  for (let i = 0; i < 40 && !(await p.locator(`[data-test-id="board_column_${id}"]`).count()); i++) { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft += 600`); await p.waitForTimeout(350); }
  await p.evaluate(`document.querySelector('[data-test-id="board_column_${id}"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })`); await p.waitForTimeout(800);
  return (await p.locator(`[data-test-id="board_column_${id}"]`).count()) > 0;
}
