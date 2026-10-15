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

export const EV = process.env.WOB_EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
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
  // 🔴 2026-10-08: a card below the bottom of the window was "dragged" from off-screen and nothing happened —
  // which read exactly like the product refusing the move. Bring the card into view first.
  await p.locator(from).first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(300);
  const a = await p.locator(from).first().boundingBox(), b = await p.locator(to).first().boundingBox();
  if (!a || !b) throw new Error(`drag: missing ${!a ? from : to}`);
  // grab at 45% across: the exact middle of a Tech View row sits over cells (copy buttons, badges) that eat the press
  const gx = a.x + a.width * 0.45;
  await p.mouse.move(gx, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(gx, a.y + a.height / 2 + 8, { steps: 4 });
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
  // 14 Oct 2026: staging's Heavy Duty has ~119+ technicians (≈ 40 000 px of columns); 40 steps of 900 px stopped at ~125 columns
  for (let i = 0; i < 200; i++) {
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
  // 2026-10-09: the location now holds ~200 technicians (other teams' E2E staff sort first) — keep going until the column renders or the board ends
  for (let i = 0; i < 400 && !(await p.locator(`[data-test-id="board_column_${id}"]`).count()); i++) { const moved = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await p.waitForTimeout(300); if (!moved) break; }
  await p.evaluate(`document.querySelector('[data-test-id="board_column_${id}"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })`); await p.waitForTimeout(800);
  return (await p.locator(`[data-test-id="board_column_${id}"]`).count()) > 0;
}

/** open a card's (Board View) or row's (Tech View) More actions > Reassign lead technician */
export async function openReassign(p: Page, woId: string, where: 'board' | 'tech' = 'board') {
  const host = p.locator(where === 'board' ? `[data-test-id="board_card_${woId}"]` : `[data-test-id="tech_view_row_${woId}"]`);
  await host.hover(); await host.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(900);
  const item = p.locator('.q-menu .q-item').filter({ hasText: 'Reassign lead technician' }).first();
  const disabled = await item.evaluate((e) => e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled')).catch(() => null);
  return { item, disabled };
}
/** read the toasts now on screen */
export const toasts = (p: Page) => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim())`) as Promise<string[]>;
/** answer the "Clear …'s scheduled shifts?" prompt if it is up; returns its text or null */
export async function shiftPrompt(p: Page, answer: 'Keep shifts' | 'Clear shifts' | 'Cancel' | null = 'Keep shifts') {
  await p.waitForTimeout(900);
  const d = p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
  if (!(await d.count())) return null;
  const text = (await d.innerText()).replace(/\s+/g, ' ');
  // the buttons are styled with capitals ("Keep Shifts"); match without regard to case
  if (answer) { await d.locator('button').filter({ hasText: new RegExp('^\\s*' + answer + '\\s*$', 'i') }).first().click(); await p.waitForTimeout(2000); }
  return text;
}
/** pick a person in the open Reassign dialog and confirm (or cancel); answers a shift prompt with Keep shifts */
export async function pickLead(p: Page, targetId: string, action: 'confirm' | 'cancel' = 'confirm') {
  await p.locator(`[data-test-id="option_lead_technician_${targetId}"]`).click(); await p.waitForTimeout(500);
  await p.locator(action === 'confirm' ? '[data-test-id="button_confirm_reassign_lead_technician"]' : '[data-test-id="button_cancel_reassign_lead_technician"]').click();
  return action === 'confirm' ? await shiftPrompt(p) : null;
}
/** 14 Oct 2026 (staging, L0333): switch location ON SCREEN — profile menu -> select_location -> the location's item; read the
 *  header back. Works on staging (and the QA branch, which has the same control). Returns the header text after the switch. */
export async function switchLocUI(p: Page, name: string) {
  const header = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
  for (let i = 0; i < 2; i++) {
    if ((await header()).includes(name)) return await header();
    await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1200);
    await p.locator('[data-test-id="select_location"]').click().catch(() => {}); await p.waitForTimeout(1200);
    // 15 Oct 2026 (wave 20, C368156): switching BACK never took — the profile menu's own row reads "Change Location: Staging Heavy Duty -
    // 9919", so `.filter({ hasText: name }).first()` clicked that row (re-opening the picker) instead of the location's option. Take the
    // option from the picker's list: not the "Change Location" row, and the LAST match (the option menu opens after the profile menu).
    await p.locator('.q-menu .q-item').filter({ hasText: name }).filter({ hasNotText: /Change Location/i }).last().click().catch(() => {}); await p.waitForTimeout(6000);
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(800);
  }
  return await header();
}
/** 15 Oct 2026 (staging second pass, C96956): `[data-test-id="select_lead_technician"]` is not on staging's work order page, so the
 *  Lead Technician read came back empty. Open the work order in a NEW tab (the board stays as it is) and read the Lead Technician
 *  field three ways — the q-field labelled "Lead Technician", any element whose test-id mentions "lead", and the text beside the
 *  label — polling up to 15 s for the page to draw. */
export async function woPageLead(p: Page, app: string, woId: string) {
  const page = await p.context().newPage();
  try {
    await page.goto(`${app}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    let o: any = null;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      o = await page.evaluate(`(() => { const out = {};
        const f = [...document.querySelectorAll('.q-field')].find(x => /Lead Tech/i.test(((x.querySelector('.q-field__label') || {}).textContent || '') + ' ' + (x.getAttribute('aria-label') || '')));
        out.field = f ? (f.querySelector('.q-field__native, .q-field__control-container') || f).innerText.replace(/\\s+/g, ' ').trim() : null;
        out.testIds = [...document.querySelectorAll('[data-test-id*="lead" i]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-test-id') + '=' + e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60)).slice(0, 6);
        const lab = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && /^\\s*Lead Technician\\s*$/i.test(e.textContent || '') && e.getBoundingClientRect().width > 0);
        if (lab) { let a = lab.parentElement; for (let i = 0; i < 4 && a && a.innerText.replace(/\\s+/g, ' ').trim().length <= 16; i++) a = a.parentElement; out.near = a ? a.innerText.replace(/\\s+/g, ' ').trim().slice(0, 120) : null; }
        return out; })()`);
      if (o && (o.field || o.near || (o.testIds && o.testIds.length))) break;
    }
    await page.screenshot({ path: path.join(EV, `wo-page-lead-${woId.slice(0, 8)}.png`) }).catch(() => {});
    return o;
  } finally { await page.close().catch(() => {}); }
}
/** 15 Oct 2026: bring a Tech View row on screen (the table draws only rows near the screen). Expands a collapsed group the row
 *  may sit in only when asked (Unassigned starts collapsed). Returns the group the row sits in (data-group-key) or null. */
export async function findRow(p: Page, woId: string, openGroup?: string) {
  if (openGroup && await p.locator(`[data-test-id="tech_view_group_${openGroup}"][data-collapsed="true"]`).count()) { await p.locator(`[data-test-id="button_tech_view_group_toggle_${openGroup}"]`).click().catch(() => {}); await p.waitForTimeout(1200); }
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`); await p.waitForTimeout(500);
  for (let i = 0; i < 150 && !(await p.locator(`[data-test-id="tech_view_row_${woId}"]`).count()); i++) { const moved = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 400; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; }
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_row_${woId}"]')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(800);
  return p.evaluate(`(document.querySelector('[data-test-id="tech_view_row_${woId}"]') || { getAttribute: () => null }).getAttribute('data-group-key')`) as Promise<string | null>;
}
/** 15 Oct 2026 (staging): set Lead Technician on the work order page — the field found by its test-id or, on staging, by its label;
 *  `typed` is typed to filter, then the option holding `name` is picked. Returns what was found (field, options seen, picked). */
export async function pickLeadOnPage(pg: Page, typed: string, name: string) {
  const sel = (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]') : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
  const o: any = { field: await sel.count() }; if (!o.field) return o;
  await sel.click(); await pg.waitForTimeout(1000); await pg.keyboard.type(typed, { delay: 60 }); await pg.waitForTimeout(1500);
  o.options = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 8);
  let opt = pg.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: name }).first();
  // 15 Oct 2026 (wave 12): on staging typing does not always narrow the list and a long list draws only what is on screen — scroll the
  // open list (top to bottom) until the option is drawn; o.scrolled says how many steps it took (absent = found at once)
  if (!(await opt.count())) { await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (s) s.scrollTop = 0; })()`).catch(() => {}); await pg.waitForTimeout(400);
    for (let i = 0; i < 80 && !(await opt.count()); i++) { o.scrolled = i + 1; const moved = await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false); await pg.waitForTimeout(250); if (!moved) break; }
    opt = pg.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: name }).first(); }
  o.picked = (await opt.count()) > 0;
  if (o.picked) { await opt.click(); await pg.waitForTimeout(3000); } else await pg.keyboard.press('Escape').catch(() => {});
  return o;
}
/** 15 Oct 2026 (wave 19, C97007 / C368159 / C368169): the work order page's Lead Technician list holds 100 people (+ Unassigned and the
 *  current lead) — listAllOptions read exactly 101 entries ending at the Q names — so anyone later in the alphabet (Ralph Edwards,
 *  ZZAUTOTEST Ben Bravo) is never drawn by scrolling. Keyboard typing did not narrow the list (the options stayed at the A names).
 *  This types into the field's OWN input, one term at a time (e.g. the full name, then the last name, then the first name), waits
 *  for the list to answer, records what each term offered, and picks the option holding `name` as soon as one appears.
 *  New export only — the existing pickLeadOnPage is unchanged. */
export async function pickLeadTyped(pg: Page, terms: string[], name: string) {
  const sel = (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]') : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
  const o: any = { field: await sel.count(), tries: [] as any[], picked: false }; if (!o.field) return o;
  for (const term of terms) {
    await sel.click().catch(() => {}); await pg.waitForTimeout(1200);
    const inp = sel.locator('input').first(); const hasInput = await inp.count();
    if (hasInput) { await inp.fill('').catch(() => {}); await inp.fill(term).catch(() => {}); } else await pg.keyboard.type(term, { delay: 60 });
    await pg.waitForTimeout(3000);
    const opts = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').trim());
    o.tries.push({ term, hasInput, count: opts.length, offered: opts.slice(0, 10) });
    const opt = pg.locator('.q-menu .q-item').filter({ hasText: name }).first();
    if (await opt.count()) { await opt.click(); await pg.waitForTimeout(3000); o.picked = true; o.pickedWith = term; return o; }
    await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(600);
  }
  return o;
}
/** 15 Oct 2026 (wave 13, C97007 / C368159): every option of the open pick list (the last visible .q-menu), scrolling it top to bottom,
 *  so a reading can say exactly how a person is listed (or that they are not). Returns the texts in list order (max 400). */
export async function listAllOptions(pg: Page) {
  const seen: string[] = [];
  await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (s) s.scrollTop = 0; })()`).catch(() => {}); await pg.waitForTimeout(400);
  for (let i = 0; i < 120 && seen.length < 400; i++) {
    for (const x of (await pg.locator('.q-menu .q-item, .q-menu .q-checkbox').allInnerTexts().catch(() => [])).map((y) => y.replace(/\s+/g, ' ').trim())) if (x && !seen.includes(x)) seen.push(x);
    const moved = await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false);
    await pg.waitForTimeout(250); if (!moved) break;
  }
  return seen;
}
