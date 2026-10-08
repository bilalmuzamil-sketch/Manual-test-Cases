/**
 * S2 Tech View, batch A (2026-10-08). Tech-A = Ayesha Khan, Tech-B = Bilal Muzamil, Tech-C = Branko Cicovic
 * (eligible technicians at Staging Heavy Duty - 9919; names in the cases are examples). Each case seeds its
 * own customer first. Pins and collapsed groups are per user and are put back at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { signIn } from '../../global-search/e2e/fixtures/auth.js';
import { api, candidates, seedCase } from './data.mts';
import { EV, t, shot, display, tab, search, groups, toggleGroup, drag, read } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const techs = await candidates(a);
const by = (n: string) => techs.find((x) => x.name === n)!;
const tA = by('Ayesha Khan'), tB = by('Bilal Muzamil'), tC = by('Branko Cicovic'), me = by('Admin ShopView');
console.log(t(), 'techs', [tA, tB, tC, me].map((x) => x?.name).join(', '));
const tv = async (name: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Tech View'); await search(p, name); };
const mine = (gs: any[], ids: string[]) => gs.filter((g) => ids.includes(g.id) || g.id === 'unassigned');
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1800));
  fs.writeFileSync(path.join(EV, 's2-batchA.json'), JSON.stringify(R, null, 1));
}
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};

await run('C96924', async () => {
  const n = 'ZZAUTOTEST F2 Tech Grouping';
  const wos = await seedCase(a, n, 'ZZF2TG', [{ lead: tA.id }, { lead: tA.id }, { lead: tA.id, status: 'estimate' }, { lead: tB.id }, { lead: tB.id }, { lead: null }]);
  R.C96924 = { wos: wos.map((w: any) => `${w.number} ${w.status} ${w.techAssignedFirstName ?? 'none'}`) };
  await tv(n);
  R.C96924.all = mine(await groups(p), [tA.id, tB.id]);
  R.C96924.headerA = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id="tech_view_group_${tA.id}"]'); if (!g) return null; const av = g.querySelector('.q-avatar, [class*=avatar] img, [class*=avatar]'); const td = g.querySelector('td'); const cs = getComputedStyle(td || g); return { text: g.innerText.replace(/\\s+/g, ' '), avatar: av ? (av.innerText.trim() || (av.querySelector('img') ? 'photo' : 'element')) : null, borderTop: cs.borderTopWidth + ' ' + cs.borderTopStyle, borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomStyle }; })()`);
  await shot(p, 'C96924-all');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800);
  await p.locator('[data-test-id="filter_option_status_approved"]').click(); await p.waitForTimeout(800); await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
  R.C96924.approved = mine(await groups(p), [tA.id, tB.id]); await shot(p, 'C96924-approved');
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1500);
});

await run('C96925', async () => {
  const n = 'ZZAUTOTEST F2 Unassigned First';
  await seedCase(a, n, 'ZZF2UF', [{ lead: null }, { lead: null }, { lead: tA.id }, { lead: tB.id }]);
  await tv(n); const g0 = await groups(p);
  R.C96925 = { order: g0.slice(0, 4).map((g) => `${g.name}(${g.count}) ${g.rows.join(' ')}`) };
  await drag(p, `[data-test-id="tech_view_group_drag_handle_${tA.id}"]`, '[data-test-id="tech_view_group_unassigned"]', 2);
  const g1 = await groups(p); R.C96925.afterDrag = g1.slice(0, 4).map((g) => `${g.name}(${g.count})`); await shot(p, 'C96925-after-drag');
});

await run('C96927', async () => {
  const n = 'ZZAUTOTEST F2 Tech Columns';
  await seedCase(a, n, 'ZZF2TC', [{ lead: tA.id }]);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await display(p, 'List'); await search(p, n);
  const menu = async (btn: string) => { await p.locator(`[data-test-id="${btn}"]`).click(); await p.waitForTimeout(1200); const items = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=checkbox], .q-menu .q-item, .q-menu .q-checkbox')].map(e => ({ label: (e.getAttribute('aria-label') || e.innerText || '').trim(), on: e.getAttribute('aria-checked') }))`) as any[]; return items; };
  const listMenu = await menu('button_column_selection'); await shot(p, 'C96927-list-menu'); await p.keyboard.press('Escape');
  await display(p, 'Tech View');
  const techMenu = await menu('button_tech_view_column_selection'); await shot(p, 'C96927-tech-menu');
  const at = p.locator('.q-menu [role=checkbox], .q-menu .q-item').filter({ hasText: /Assigned Techs/i }).first();
  if (await at.count()) { if ((await at.getAttribute('aria-checked')) === 'false') { await at.click(); await p.waitForTimeout(1500); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  const heads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`);
  await shot(p, 'C96927-tech-with-assigned');
  const L = [...new Set(listMenu.map((x) => x.label).filter(Boolean))], T = [...new Set(techMenu.map((x) => x.label).filter(Boolean))];
  R.C96927 = { listMenu: L, techMenu: T, inListNotTech: L.filter((x) => !T.includes(x)), techOnly: T.filter((x) => !L.includes(x)), techHeadersAfter: heads };
});

await run('C96928', async () => {
  const n = 'ZZAUTOTEST F2 Collapse Memory';
  await seedCase(a, n, 'ZZF2CM', [{ lead: tA.id }, { lead: tB.id }, { lead: tC.id }]);
  await tv(n);
  const st = async (pg: Page) => Object.fromEntries((await groups(pg)).filter((g) => [tA.id, tB.id, tC.id].includes(g.id)).map((g) => [g.name, g.collapsed ? 'collapsed' : 'expanded']));
  for (const g of await groups(p)) if ([tA.id, tB.id, tC.id].includes(g.id) && g.collapsed) await toggleGroup(p, g.id);
  R.C96928 = { start: await st(p) };
  await toggleGroup(p, tB.id); R.C96928.afterCollapse = await st(p); R.C96928.bRowsShown = (await groups(p)).find((g) => g.id === tB.id)?.rows.length; await shot(p, 'C96928-collapsed');
  await p.waitForTimeout(1500); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, n); R.C96928.afterRefresh = await st(p);
  const p2 = await p.context().newPage(); await p2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(5000); await search(p2, n); R.C96928.newTab = await st(p2); await p2.close();
  const s2 = await signIn('/customers'); await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await s2.page.waitForTimeout(5000); await search(s2.page, n);
  R.C96928.newSignIn = await st(s2.page); await shot(s2.page, 'C96928-new-signin'); await Promise.race([s2.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, n);
  await toggleGroup(p, tB.id); R.C96928.reExpanded = await st(p); R.C96928.bRowsAfter = (await groups(p)).find((g) => g.id === tB.id)?.rows;
});

await run('C96931', async () => {
  const n = 'ZZAUTOTEST F2 No Work Text';
  const wos = await seedCase(a, n, 'ZZF2NW', [{ lead: tA.id }, { lead: tB.id }, { lead: null }]);
  await tv(n);
  const pick = async () => (await groups(p)).filter((g) => [tA.id, tB.id, tC.id, 'unassigned'].includes(g.id)).map((g) => `${g.name}: count ${g.count}, rows [${g.rows.join(' ')}], text ${JSON.stringify(g.empty)}${g.collapsed ? ' (collapsed)' : ''}`);
  R.C96931 = { byName: await pick() }; await shot(p, 'C96931-by-name');
  const w1 = wos.find((w: any) => w.techAssignedFirstName === 'Ayesha')?.number;
  await search(p, w1); R.C96931.byNumber = { searched: w1, groups: await pick() }; await shot(p, 'C96931-by-number');
});

await run('C96932', async () => {
  const n = 'ZZAUTOTEST F2 Row Click';
  const [w] = await seedCase(a, n, 'ZZF2RC', [{ lead: tA.id }]);
  await tv(n);
  const row = p.locator(`[data-test-id="tech_view_row_${w.id}"]`);
  const opened = async () => { const u = p.url(); const r = /\/workorders\/[0-9a-f-]{36}/.test(u); if (r) { await p.goBack({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await search(p, n); } return r ? u.replace(APP, '') : false; };
  R.C96932 = {};
  await row.getByText(n).first().click(); await p.waitForTimeout(3000); R.C96932.customerClick = await opened();
  const bb = await row.boundingBox(); const lines = await row.locator('td').nth(-3).boundingBox();
  await p.mouse.click((lines ?? bb!).x + 4, (lines ?? bb!).y + (lines ?? bb!).height / 2); await p.waitForTimeout(3000); R.C96932.emptyClick = await opened();
  const b2 = (await row.boundingBox())!; const x = b2.x + b2.width * 0.45, y = b2.y + b2.height / 2;
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x + 2, y + 1, { steps: 2 }); await p.mouse.up(); await p.waitForTimeout(3000); R.C96932.tinySlip = await opened();
  await row.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(1500);
  R.C96932.moreActions = { url: p.url().replace(APP, ''), menu: await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' ').slice(0, 200))`) }; await shot(p, 'C96932-more-actions'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  const b3 = (await row.boundingBox())!; await p.mouse.move(b3.x + b3.width * 0.45, b3.y + b3.height / 2); await p.mouse.down(); await p.mouse.move(b3.x + b3.width * 0.45, b3.y + 60, { steps: 12 }); await p.waitForTimeout(500);
  R.C96932.clearMove = { moving: await row.getAttribute('data-moving').catch(() => null), anyMoving: await p.evaluate(`!!document.querySelector('[data-moving="true"], .sortable-chosen, .sortable-ghost, [class*=dragging]')`) }; await shot(p, 'C96932-dragging');
  await p.keyboard.press('Escape'); await p.mouse.move(b3.x + b3.width * 0.45, b3.y + b3.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(2500);
  R.C96932.afterDragUrl = p.url().replace(APP, ''); R.C96932.leadAfter = (await groups(p)).find((g) => g.rows.includes(w.number))?.name;
});

await run('C96933', async () => {
  const n = 'ZZAUTOTEST F2 Empty Unassigned Drop';
  const wos = await seedCase(a, n, 'ZZF2EU', [{ lead: tA.id }, { lead: tA.id }]);
  await tv(n);
  const pick = async () => (await groups(p)).filter((g) => [tA.id, 'unassigned'].includes(g.id)).map((g) => ({ name: g.name, count: g.count, rows: g.rows, empty: g.empty, collapsed: g.collapsed }));
  R.C96933 = { before: await pick(), firstGroup: (await groups(p))[0]?.name }; await shot(p, 'C96933-before');
  if (R.C96933.before.find((g: any) => g.name === 'Unassigned')?.collapsed) await toggleGroup(p, 'unassigned');
  const w2 = wos[wos.length - 1];
  await drag(p, `[data-test-id="tech_view_row_${w2.id}"]`, '[data-test-id="tech_view_group_unassigned"]', 10);
  R.C96933.moved = w2.number; R.C96933.after = await pick(); R.C96933.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification,.q-dialog')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 200))`); await shot(p, 'C96933-after');
});

await run('C96935', async () => {
  const n = 'ZZAUTOTEST F2 Sticky Header';
  await seedCase(a, n, 'ZZF2SH', [...Array(25).fill({ lead: tA.id }), { lead: tB.id }, { lead: tB.id }, { lead: tB.id }]);
  await tv(n);
  for (const g of await groups(p)) if ((g.id === tA.id || g.id === tB.id) && g.collapsed) await toggleGroup(p, g.id);
  const scroller = '.q-table__middle';
  const topGroup = () => p.evaluate(`(() => { const s = document.querySelector('${scroller}'); const th = s.querySelector('thead'); const y = (th ? th.getBoundingClientRect().bottom : s.getBoundingClientRect().top) + 6; const x = s.getBoundingClientRect().left + 200; const el = document.elementFromPoint(x, y); const tr = el && el.closest('tr'); const tid = tr && tr.getAttribute('data-test-id') || ''; return { at: tid.startsWith('tech_view_group_') ? (tr.querySelector('[data-test-id^="tech_view_group_name_"]') || {}).textContent : (tr ? 'row ' + ((tr.innerText.match(/S\\d+-\\d+/) || [''])[0]) : null), scrollTop: Math.round(s.scrollTop) }; })()`);
  R.C96935 = { samples: [] };
  for (const y of [0, 300, 700, 1100, 1400, 1700]) { await p.evaluate(`document.querySelector('${scroller}').scrollTop = ${y}`); await p.waitForTimeout(900); R.C96935.samples.push(await topGroup()); if (y === 700) await shot(p, 'C96935-mid-A'); if (y === 1700) await shot(p, 'C96935-in-B'); }
});

await run('C368125', async () => {
  await seedCase(a, 'ZZAUTOTEST F2 Collapse Kept', 'ZZF2CK', [{ lead: tA.id }]);
  await seedCase(a, 'ZZAUTOTEST F2 Collapse Other', 'ZZF2CO', [{ lead: tA.id }]);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await display(p, 'Tech View');
  const gA = async () => (await groups(p)).find((g) => g.id === tA.id);
  if (!(await gA())?.collapsed) await toggleGroup(p, tA.id);
  R.C368125 = { before: (await gA()) && { count: (await gA())!.count, collapsed: (await gA())!.collapsed } };
  await search(p, 'Collapse Kept'); const d = await gA(); R.C368125.during = d && { count: d.count, collapsed: d.collapsed, rows: d.rows }; await shot(p, 'C368125-during-search');
  await toggleGroup(p, tA.id); const e = await gA(); R.C368125.expanded = e && { count: e.count, collapsed: e.collapsed, rows: e.rows };
});

await run('C368128', async () => {
  const n = 'ZZAUTOTEST F2 No Pin Assigned';
  await seedCase(a, n, 'ZZF2NP', [{ lead: me.id }, { lead: tB.id }]);
  await tv(n);
  const pins = async () => (await groups(p)).map((g) => `${g.name}:${g.pin ? 'pin' : 'no pin'}`);
  R.C368128 = { off: (await pins()).slice(0, 6) };
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  R.C368128.on = await pins(); await shot(p, 'C368128-assigned-on');
  await display(p, 'Board View'); R.C368128.boardOnPins = await p.locator('[data-test-id^="button_board_pin_"], [data-test-id^="button_board_column_pin_"], [aria-label*="Pin" i]').count();
  await display(p, 'Tech View'); await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  R.C368128.offAgain = (await pins()).slice(0, 6);
});

await run('C368129', async () => {
  const n = 'ZZAUTOTEST F2 No Total Row';
  await seedCase(a, n, 'ZZF2NT', [{ lead: tA.id }, { lead: tA.id }]);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await display(p, 'List'); await search(p, n);
  const totals = () => p.evaluate(`[...document.querySelectorAll('.sticky-bottom-row, tfoot tr, [class*=total-row], [class*=summary-row]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  R.C368129 = { list: await totals() }; await shot(p, 'C368129-list');
  await display(p, 'Tech View'); R.C368129.tech = await totals(); R.C368129.techLastRows = await p.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr, tfoot tr')].slice(-3).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 120))`);
  R.C368129.techHeaders = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`); await shot(p, 'C368129-tech');
});

await run('C368162', async () => {
  const n = 'ZZAUTOTEST F2 Collapse All';
  await seedCase(a, n, 'ZZF2CA', [{ lead: tA.id }, { lead: tB.id }, { lead: null }]);
  await tv(n);
  for (const g of await groups(p)) if ([tA.id, tB.id, 'unassigned'].includes(g.id) && g.collapsed) await toggleGroup(p, g.id);
  const btn = p.locator('thead button, thead [role=button]').first();
  R.C368162 = { buttonFound: await btn.count(), buttonHtml: (await btn.evaluate((e) => e.outerHTML.slice(0, 300)).catch(() => null)) };
  const tip = async () => { await btn.hover(); await p.waitForTimeout(1200); return p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim()).join(' | ')`); };
  const st = async () => (await groups(p)).filter((g) => [tA.id, tB.id, 'unassigned'].includes(g.id)).map((g) => `${g.name}:${g.collapsed ? 'closed' : 'open'}:${g.count}:${g.rows.join(' ')}`);
  if (!R.C368162.buttonFound) return;
  R.C368162.tip1 = await tip(); await btn.click(); await p.waitForTimeout(2000); R.C368162.afterCollapseAll = await st(); R.C368162.allGroupsClosed = (await groups(p)).every((g) => g.collapsed);
  R.C368162.tip2 = await tip(); await shot(p, 'C368162-all-closed');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, n); R.C368162.afterRefresh = await st();
  await btn.click(); await p.waitForTimeout(2000); R.C368162.afterExpandAll = await st(); R.C368162.tip3 = await tip();
  await toggleGroup(p, tB.id); R.C368162.oneClosed = await st(); await btn.click(); await p.waitForTimeout(2000); R.C368162.afterMixed = await st();
  R.C368162.searchKept = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  await btn.click(); await p.waitForTimeout(1500);   // open again
});

// ── pins last (per user); put back what was there ───────────────────────
const pinsBefore = (await prefs()).pinnedTechnicianIds ?? [];
console.log(t(), 'pins before', JSON.stringify(pinsBefore));
const pinBtn = (id: string) => p.locator(`[data-test-id="button_tech_view_pin_${id}"]`);
async function unpinAll() { for (const g of await groups(p)) if (g.pin?.pressed === 'true') { await pinBtn(g.id).click(); await p.waitForTimeout(1500); } }
await run('C96939', async () => {
  const n = 'ZZAUTOTEST F2 Tech Pin Limit';
  const five = [tA, tB, tC, techs.find((x) => !['Ayesha Khan', 'Bilal Muzamil', 'Branko Cicovic', 'Admin ShopView'].includes(x.name))!, techs.filter((x) => !['Ayesha Khan', 'Bilal Muzamil', 'Branko Cicovic', 'Admin ShopView'].includes(x.name))[1]];
  await seedCase(a, n, 'ZZF2PL', five.map((x) => ({ lead: x.id })));
  await tv(n); await unpinAll();
  R.C96939 = { five: five.map((x) => x.name), pinsShown: (await groups(p)).filter((g) => g.id !== 'unassigned').every((g) => !!g.pin) };
  for (const x of [tB, five[3], five[4]]) { await pinBtn(x.id).click(); await p.waitForTimeout(1800); }
  const g = await groups(p); R.C96939.after3 = g.filter((x) => five.some((f) => f.id === x.id)).map((x) => `${x.name}:${JSON.stringify(x.pin)}`);
  await pinBtn(tA.id).hover(); await p.waitForTimeout(1200); R.C96939.fourthTip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim()).join(' | ')`);
  await pinBtn(tA.id).click({ force: true }).catch(() => {}); await p.waitForTimeout(1800);
  R.C96939.afterFourth = (await groups(p)).filter((x) => x.pin?.pressed === 'true').map((x) => x.name); await shot(p, 'C96939-three-pinned');
  R.C96939.savedPins = (await prefs()).pinnedTechnicianIds;
  await unpinAll();
});
await run('C96937', async () => {
  const n = 'ZZAUTOTEST F2 Assigned Groups';
  const jw = techs.filter((x) => !['Ayesha Khan', 'Bilal Muzamil', 'Branko Cicovic', 'Admin ShopView'].includes(x.name))[2];
  await seedCase(a, n, 'ZZF2AG', [{ lead: me.id }, { lead: tB.id }, { lead: null }]);
  await tv(n); await unpinAll(); await pinBtn(jw.id).click(); await p.waitForTimeout(1800);
  R.C96937 = { pinned: jw.name };
  await display(p, 'List'); await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  R.C96937.list = Object.keys(await read(p, 'List'));
  await display(p, 'Tech View'); R.C96937.tech = (await groups(p)).map((g) => `${g.name}(${g.count}) [${g.rows.join(' ')}]${g.pin?.pressed === 'true' ? ' pinned' : ''}`); await shot(p, 'C96937-assigned-on');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  const g = await groups(p); R.C96937.offCount = g.length; R.C96937.offFirst = g.slice(0, 3).map((x) => `${x.name}${x.pin?.pressed === 'true' ? ' pinned' : ''}`);
  await unpinAll();
});
// restore the pins that were there before
for (const id of pinsBefore) { await pinBtn(id).click().catch(() => {}); await p.waitForTimeout(1200); }
R.pinsRestored = (await prefs()).pinnedTechnicianIds;
await search(p, '').catch(() => {}); await display(p, 'List').catch(() => {});
fs.writeFileSync(path.join(EV, 's2-batchA.json'), JSON.stringify(R, null, 1));
await done(browser);
