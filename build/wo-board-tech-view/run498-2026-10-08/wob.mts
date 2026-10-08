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
